export type AppScreen = 'home' | 'habit' | 'analyze' | 'plan';

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

export type PlanTasks = {
  drinkWater: boolean;
  greensDinner: boolean;
  walking: boolean;
  resistance: boolean;
};
