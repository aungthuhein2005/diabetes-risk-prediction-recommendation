# Diabetes Risk Level Prediction and Recommendation System

This project predicts diabetes risk level and provides personalized health recommendations using a trained machine learning model.

## Dataset

- Source: [Kaggle Diabetes Dataset](https://www.kaggle.com/datasets/mathchi/diabetes-data-set)
- Model features include:
  - `Pregnancies`
  - `Glucose`
  - `BloodPressure`
  - `SkinThickness`
  - `Insulin`
  - `BMI`
  - `DiabetesPedigreeFunction`
  - `Age`

## Model Training

- Algorithm: XGBoost classifier
- Hyperparameter tuning: GridSearchCV
- Best parameters:

```python
{
  "colsample_bytree": 1.0,
  "learning_rate": 0.1,
  "max_depth": 3,
  "n_estimators": 50,
  "subsample": 1.0
}
```

## Model Performance

- Accuracy: `0.7532467532467533`

### Classification Report

```text
              precision    recall  f1-score   support

           0       0.80      0.82      0.81        99
           1       0.66      0.64      0.65        55

    accuracy                           0.75       154
   macro avg       0.73      0.73      0.73       154
weighted avg       0.75      0.75      0.75       154
```

### Confusion Matrix

```text
[[81 18]
 [20 35]]
```

## Project Structure

- `backend/`
  - training notebook and backend logic
  - trained model files are stored under `backend/model/`
- `frotend/`
  - web app built with React + Tailwind CSS
- `mobile/`
  - mobile app built with React Native + NativeWind

## Tech Stack

- Python, XGBoost, scikit-learn
- React, Tailwind CSS
- React Native, NativeWind, Expo
