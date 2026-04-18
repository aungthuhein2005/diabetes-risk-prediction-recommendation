import io
import json
import os
import pickle

import numpy as np
import shap
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from PIL import Image
from pydantic import BaseModel
from supabase import create_client

load_dotenv()

EASYOCR_LANGS = [lang.strip() for lang in os.environ.get("EASYOCR_LANGS", "en").split(",") if lang.strip()]
ocr_reader = None

# --- Supabase ---
supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_ANON_KEY"],
)

# --- Load model ---
model = pickle.load(open("./model/xgb_model.pkl", "rb"))

# --- LLM setup ---
llm = ChatOpenAI(
    model="deepseek-chat",
    api_key=os.environ.get("DEEPSEEK_API_KEY", "sk-90f7995e2bf14c5e8cdb3b6bdc0b1ed6"),
    base_url="https://api.deepseek.com",
)

LANG_INSTRUCTIONS = {
    "en": "Respond in English.",
    "th": "Respond entirely in Thai (ภาษาไทย). All text must be in Thai.",
    "my": "Respond entirely in Myanmar/Burmese (မြန်မာဘာသာ). All text must be in Myanmar.",
}

prompt_template = PromptTemplate(
    input_variables=["risk", "probability", "factors", "lang_instruction"],
    template="""
You are a health assistant.
{lang_instruction}

Risk Level: {risk}
Probability: {probability}

Top contributing factors:
{factors}

Provide:
1. Simple explanation
2. Lifestyle advice
3. Preventive steps
4. Suggest consulting a doctor

Do NOT give medical diagnosis.
""",
)

FEATURE_NAMES = [
    "Pregnancies", "Glucose", "BloodPressure",
    "SkinThickness", "Insulin", "BMI",
    "DiabetesPedigreeFunction", "Age",
    "Missing_Insulin", "Missing_SkinThickness",
]


# --- Helper functions ---
def prepare_input(data):
    (Pregnancies, Glucose, BloodPressure,
     SkinThickness, Insulin, BMI,
     DiabetesPedigreeFunction, Age) = data

    Missing_Insulin = 1 if Insulin == 0 else 0
    Missing_SkinThickness = 1 if SkinThickness == 0 else 0

    return [
        Pregnancies, Glucose, BloodPressure,
        SkinThickness, Insulin, BMI,
        DiabetesPedigreeFunction, Age,
        Missing_Insulin, Missing_SkinThickness,
    ]


def predict_risk(data):
    data = np.array(data).reshape(1, -1)
    proba = model.predict_proba(data)[0][1]

    if proba < 0.3:
        risk = "Low"
    elif proba < 0.7:
        risk = "Medium"
    else:
        risk = "High"

    return float(proba), risk


def get_top_features(data, feature_names):
    data = np.array(data).reshape(1, -1)
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(data)[0]

    feature_impact = list(zip(feature_names, shap_values))
    feature_impact.sort(key=lambda x: abs(x[1]), reverse=True)

    result = []
    for f, v in feature_impact[:3]:
        impact = "High" if abs(v) > 0.3 else "Medium"
        result.append({"feature": f, "impact": impact})

    return result


def generate_advice(risk, probability, factors, lang="en"):
    lang_instruction = LANG_INSTRUCTIONS.get(lang, LANG_INSTRUCTIONS["en"])
    formatted_factors = "\n".join(
        [f"- {f['feature']}: {f['impact']}" for f in factors]
    )
    final_prompt = prompt_template.format(
        risk=risk,
        probability=round(probability, 2),
        factors=formatted_factors,
        lang_instruction=lang_instruction,
    )
    response = llm.invoke(final_prompt)
    return response.content


def analyze_risk(input_data, lang="en"):
    full_input = prepare_input(input_data)
    probability, risk = predict_risk(full_input)
    factors = get_top_features(full_input, FEATURE_NAMES)
    advice = generate_advice(risk, probability, factors, lang)

    return {
        "risk": risk,
        "probability": round(probability, 4),
        "top_factors": factors,
        "advice": advice,
    }


def get_ocr_reader():
    global ocr_reader
    if ocr_reader is None:
        try:
            import easyocr
        except Exception as e:
            raise RuntimeError(
                "EasyOCR is not available in this Python environment. "
                "Run: python -m pip install --user easyocr"
            ) from e
        ocr_reader = easyocr.Reader(EASYOCR_LANGS, gpu=False)
    return ocr_reader


# --- FastAPI app ---
app = FastAPI(title="Diabetes Risk Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthInput(BaseModel):
    Pregnancies: float
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: float
    lang: str = "en"
    user_id: str = ""
    source: str = "web"


@app.post("/analyze")
def analyze(data: HealthInput):
    input_list = [
        data.Pregnancies, data.Glucose, data.BloodPressure,
        data.SkinThickness, data.Insulin, data.BMI,
        data.DiabetesPedigreeFunction, data.Age,
    ]
    result = analyze_risk(input_list, lang=data.lang)

    # Save to Supabase if user is logged in
    if data.user_id:
        try:
            # 1) Save assessment
            assess_row = supabase.table("assessments").insert({
                "user_id": data.user_id,
                "pregnancies": int(data.Pregnancies),
                "glucose": float(data.Glucose),
                "blood_pressure": float(data.BloodPressure),
                "skin_thickness": float(data.SkinThickness),
                "insulin": float(data.Insulin),
                "bmi": float(data.BMI),
                "diabetes_pedigree_function": float(data.DiabetesPedigreeFunction),
                "age": int(data.Age),
                "missing_insulin": data.Insulin == 0,
                "missing_skin_thickness": data.SkinThickness == 0,
                "source": data.source,
            }).execute()
            assessment_id = assess_row.data[0]["id"]

            # 2) Save prediction
            pred_row = supabase.table("predictions").insert({
                "assessment_id": assessment_id,
                "user_id": data.user_id,
                "risk_label": result["risk"],
                "probability": result["probability"],
                "top_factors": result["top_factors"],
            }).execute()
            prediction_id = pred_row.data[0]["id"]

            # 3) Save recommendation
            supabase.table("recommendations").insert({
                "prediction_id": prediction_id,
                "user_id": data.user_id,
                "full_advice": result["advice"],
            }).execute()
        except Exception as e:
            print(f"DB save error: {e}")

    return result


@app.get("/health")
def health_check():
    return {"status": "ok"}


# --- Document Scan Endpoint ---
SCAN_PROMPT = """You are a medical data extraction assistant.

Below is raw OCR text extracted from a medical document (lab report, health checkup, prescription, etc.).
Extract the following 8 health features from this text. If a value is not found, return 0.

Return ONLY a valid JSON object with exactly these keys (no extra text, no markdown):
{{
  "Pregnancies": <number>,
  "Glucose": <number in mg/dL>,
  "BloodPressure": <number, diastolic in mmHg>,
  "SkinThickness": <number in mm>,
  "Insulin": <number in mu U/ml>,
  "BMI": <number>,
  "DiabetesPedigreeFunction": <number between 0.0 and 2.5>,
  "Age": <number>
}}

Notes:
- For Glucose, look for "blood sugar", "fasting glucose", "FBS", "blood glucose", "plasma glucose"
- For BloodPressure, look for "BP", "diastolic", or the second number in readings like "120/80"
- For BMI, look for "BMI", "body mass index", or calculate from height/weight if available
- For Insulin, look for "insulin", "fasting insulin", "serum insulin"
- For DiabetesPedigreeFunction, this is rarely in documents — use 0.5 as default if not found
- For SkinThickness, look for "skin fold", "triceps" — use 0 if not found

OCR Text:
{ocr_text}"""


@app.post("/scan")
async def scan_document(file: UploadFile = File(...)):
    # Step 1: Read the uploaded image
    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents))
        # Convert to RGB in case of RGBA/palette images
        if image.mode not in ("L", "RGB"):
            image = image.convert("RGB")
    except Exception as e:
        return {"error": f"Could not open image: {e}"}

    # Step 2: OCR — extract messy text (EasyOCR, pure Python)
    try:
        reader = get_ocr_reader()
        extracted_lines = reader.readtext(np.array(image), detail=0, paragraph=True)
        ocr_text = "\n".join([line for line in extracted_lines if str(line).strip()])
    except Exception as e:
        return {"error": f"EasyOCR failed: {e}"}

    if not ocr_text.strip():
        return {"error": "Could not extract any text from the image. Please try a clearer image."}

    # Step 3: DeepSeek — structure the messy OCR text into clean features
    prompt = SCAN_PROMPT.format(ocr_text=ocr_text)
    response = llm.invoke(prompt)
    raw = response.content.strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]
    raw = raw.strip()

    try:
        features = json.loads(raw)
    except json.JSONDecodeError:
        return {"error": "Could not parse health features from document.", "ocr_text": ocr_text, "llm_raw": raw}

    return {
        "features": features,
        "ocr_text": ocr_text,
    }


# --- Auth via Supabase ---
class RegisterInput(BaseModel):
    name: str
    email: str
    password: str


class LoginInput(BaseModel):
    email: str
    password: str


@app.post("/register")
def register(data: RegisterInput):
    try:
        res = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {"data": {"full_name": data.name}},
        })
        if res.user is None:
            return {"error": "Registration failed. Try a different email."}
        return {
            "id": str(res.user.id),
            "name": data.name,
            "email": data.email,
        }
    except Exception as e:
        return {"error": str(e)}


@app.post("/login")
def login(data: LoginInput):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password,
        })
        if res.user is None:
            return {"error": "Invalid email or password."}
        name = res.user.user_metadata.get("full_name", data.email.split("@")[0])
        return {
            "id": str(res.user.id),
            "name": name,
            "email": data.email,
        }
    except Exception as e:
        return {"error": str(e)}
