import type { HabitAnswers } from '../types/assessment'

export type AnalyzeResponse = {
  risk: 'Low' | 'Medium' | 'High'
  probability: number
  top_factors: { feature: string; impact: string }[]
  advice: string
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000'

export async function analyzeRisk(
  answers: HabitAnswers,
  lang: string,
  userId?: string,
): Promise<AnalyzeResponse> {
  const payload = {
    ...answers,
    lang,
    user_id: userId ?? '',
    source: 'web',
  }

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Analyze failed: ${response.status}`)
  }

  return (await response.json()) as AnalyzeResponse
}
