import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AnalyzePage from './pages/Analyze'
import HabitPage from './pages/Habit'
import HomePage from './pages/Home'
import PlanPage from './pages/Plan'
import type { HabitAnswers } from './types/assessment'

function App() {
  const [answers, setAnswers] = useState<HabitAnswers>({
    Pregnancies: 2,
    Glucose: 148,
    BloodPressure: 72,
    SkinThickness: 35,
    Insulin: 125,
    BMI: 33.6,
    DiabetesPedigreeFunction: 0.627,
    Age: 50,
    Missing_Insulin: 0,
    Missing_SkinThickness: 0,
  })

  const habitsScore = useMemo(() => {
    const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

    const weightedRisk =
      clamp01(answers.Pregnancies / 10) * 0.08 +
      clamp01((answers.Glucose - 90) / 110) * 0.25 +
      clamp01((answers.BloodPressure - 60) / 60) * 0.08 +
      clamp01(answers.SkinThickness / 60) * 0.06 +
      clamp01(answers.Insulin / 300) * 0.12 +
      clamp01((answers.BMI - 18) / 25) * 0.16 +
      clamp01(answers.DiabetesPedigreeFunction / 2.5) * 0.12 +
      clamp01((answers.Age - 20) / 50) * 0.1 +
      clamp01(answers.Missing_Insulin) * 0.02 +
      clamp01(answers.Missing_SkinThickness) * 0.01

    return Math.round(weightedRisk * 100)
  }, [answers])

  const analysisPercent = Math.max(1, habitsScore)

  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/habit" element={<HabitPage answers={answers} onChange={setAnswers} />} />
        <Route path="/analyze" element={<AnalyzePage analysisPercent={analysisPercent} />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default App
