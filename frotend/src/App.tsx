import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import AnalyzePage from './pages/Analyze'
import HabitPage from './pages/Habit'
import HomePage from './pages/Home'
import PlanPage from './pages/Plan'
import ProfilePage from './pages/Profile'
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
    const c = (v: number) => Math.min(1, Math.max(0, v))
    return Math.round((
      c(answers.Pregnancies / 10) * 0.08 +
      c((answers.Glucose - 90) / 110) * 0.25 +
      c((answers.BloodPressure - 60) / 60) * 0.08 +
      c(answers.SkinThickness / 60) * 0.06 +
      c(answers.Insulin / 300) * 0.12 +
      c((answers.BMI - 18) / 25) * 0.16 +
      c(answers.DiabetesPedigreeFunction / 2.5) * 0.12 +
      c((answers.Age - 20) / 50) * 0.10 +
      c(answers.Missing_Insulin) * 0.02 +
      c(answers.Missing_SkinThickness) * 0.01
    ) * 100)
  }, [answers])

  const analysisPercent = Math.max(1, habitsScore)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"        element={<HomePage />} />
          <Route path="/habit"   element={<HabitPage answers={answers} onChange={setAnswers} />} />
          <Route path="/analyze" element={<AnalyzePage analysisPercent={analysisPercent} />} />
          <Route path="/plan"    element={<PlanPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
