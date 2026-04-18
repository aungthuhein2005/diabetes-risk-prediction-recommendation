import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { analyzeRisk } from './lib/api';
import { AnalyzeScreen } from './screens/AnalyzeScreen';
import { HabitScreen } from './screens/HabitScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RecommendationScreen } from './screens/RecommendationScreen';
import type { AnalyzeResult, AppScreen, HabitAnswers } from './screens/types';
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
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await analyzeRisk(answers, 'en');
      setAnalysisResult(result);
      setCurrentScreen('analyze');
    } catch (error) {
      setAnalysisResult(null);
      setAnalysisError(error instanceof Error ? error.message : 'Unable to connect to API.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onStartAssessment={() => setCurrentScreen('habit')}
            onOpenProfile={() => setCurrentScreen('profile')}
          />
        );
      case 'habit':
        return (
          <HabitScreen
            answers={answers}
            onAnswersChange={setAnswers}
            onAnalyze={runAnalysis}
            onBack={() => setCurrentScreen('home')}
            isAnalyzing={isAnalyzing}
            analysisError={analysisError}
          />
        );
      case 'analyze':
        return (
          <AnalyzeScreen
            analysisPercent={analysisPercent}
            result={analysisResult}
            onViewPlan={() => setCurrentScreen('plan')}
            onRetake={() => setCurrentScreen('habit')}
          />
        );
      case 'plan':
        return (
          <RecommendationScreen
            onBack={() => setCurrentScreen('analyze')}
            result={analysisResult}
          />
        );
      case 'profile':
        return <ProfileScreen onBack={() => setCurrentScreen('home')} />;
      default:
        return (
          <HomeScreen
            onStartAssessment={() => setCurrentScreen('habit')}
            onOpenProfile={() => setCurrentScreen('profile')}
          />
        );
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
