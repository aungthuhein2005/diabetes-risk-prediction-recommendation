export type HabitAnswers = {
  Pregnancies: number
  Glucose: number
  BloodPressure: number
  SkinThickness: number
  Insulin: number
  BMI: number
  DiabetesPedigreeFunction: number
  Age: number
  Missing_Insulin: number
  Missing_SkinThickness: number
}

export type AnalyzeResult = {
  risk: 'Low' | 'Medium' | 'High'
  probability: number
  top_factors: { feature: string; impact: string }[]
  advice: string
}
