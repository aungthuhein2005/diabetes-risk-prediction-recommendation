import { Platform } from 'react-native';
import type { AnalyzeResult, HabitAnswers } from '../screens/types';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000');

export async function analyzeRisk(
  answers: HabitAnswers,
  lang = 'en',
  userId?: string,
): Promise<AnalyzeResult> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...answers,
      lang,
      user_id: userId ?? '',
      source: 'mobile',
    }),
  });

  if (!response.ok) {
    throw new Error(`Analyze failed: ${response.status}`);
  }

  return (await response.json()) as AnalyzeResult;
}
