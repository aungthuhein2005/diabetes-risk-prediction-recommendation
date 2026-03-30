import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AnalyzeScreen } from './screens/AnalyzeScreen';
import { HabitScreen } from './screens/HabitScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RecommendationScreen } from './screens/RecommendationScreen';
import type { AppScreen, HabitAnswers } from './screens/types';
import './global.css';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');

  const [answers, setAnswers] = useState<HabitAnswers>({
    Pregnancies: 2,
    Glucose: 148,
    BloodPressure: 72,
    SkinThickness: 35,
    Insulin: 125,
    BMI: 33.6,
    DiabetesPedigreeFunction: 0.627,
    Age: 50,
  });

  const habitsScore = useMemo(() => {
    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

    const weightedRisk =
      clamp01(answers.Pregnancies / 10) * 0.1 +
      clamp01((answers.Glucose - 90) / 110) * 0.25 +
      clamp01((answers.BloodPressure - 60) / 60) * 0.1 +
      clamp01(answers.SkinThickness / 60) * 0.08 +
      clamp01(answers.Insulin / 300) * 0.14 +
      clamp01((answers.BMI - 18) / 25) * 0.16 +
      clamp01(answers.DiabetesPedigreeFunction / 2.5) * 0.09 +
      clamp01((answers.Age - 20) / 50) * 0.08;

    return Math.round(weightedRisk * 100);
  }, [answers]);

  const analysisPercent = Math.max(1, habitsScore);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onStartAssessment={() => setCurrentScreen('habit')} />;
      case 'habit':
        return (
          <HabitScreen
            answers={answers}
            onAnswersChange={setAnswers}
            onAnalyze={() => setCurrentScreen('analyze')}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'analyze':
        return (
          <AnalyzeScreen
            analysisPercent={analysisPercent}
            onViewPlan={() => setCurrentScreen('plan')}
            onRetake={() => setCurrentScreen('habit')}
          />
        );
      case 'plan':
        return <RecommendationScreen onBack={() => setCurrentScreen('analyze')} />;
      default:
        return <HomeScreen onStartAssessment={() => setCurrentScreen('habit')} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-100">
        <StatusBar style="dark" />
        {renderScreen()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
