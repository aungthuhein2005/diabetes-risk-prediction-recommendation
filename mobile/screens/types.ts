export type AppScreen = 'home' | 'habit' | 'analyze' | 'plan' | 'profile';

export type HabitAnswers = {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
};

export type AnalyzeResult = {
  risk: 'Low' | 'Medium' | 'High';
  probability: number;
  top_factors: { feature: string; impact: string }[];
  advice: string;
};

export type PlanTasks = {
  drinkWater: boolean;
  greensDinner: boolean;
  walking: boolean;
  resistance: boolean;
};
