import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { analyzeRisk } from './lib/api'
import AnalyzePage from './pages/Analyze'
import HabitPage from './pages/Habit'
import HomePage from './pages/Home'
import PlanPage from './pages/Plan'
import ProfilePage from './pages/Profile'
import type { AnalyzeResult, HabitAnswers } from './types/assessment'
import i18n from './i18n'

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
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

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

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setAnalysisError(null)
    try {
      const result = await analyzeRisk(answers, i18n.language)
      setAnalysisResult(result)
      return true
    } catch (error) {
      setAnalysisResult(null)
      setAnalysisError(
        error instanceof Error ? error.message : 'Unable to connect to API. Please try again.',
      )
      return false
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"        element={<HomePage />} />
          <Route
            path="/habit"
            element={
              <HabitPage
                answers={answers}
                onChange={setAnswers}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                analysisError={analysisError}
              />
            }
          />
          <Route
            path="/analyze"
            element={<AnalyzePage analysisPercent={analysisPercent} result={analysisResult} />}
          />
          <Route path="/plan"    element={<PlanPage result={analysisResult} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
