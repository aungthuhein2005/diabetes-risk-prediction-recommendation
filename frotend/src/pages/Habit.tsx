import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import FeatureInput from '../components/FeatureInput'
import type { HabitAnswers } from '../types/assessment'

type HabitPageProps = {
  answers: HabitAnswers
  onChange: (nextAnswers: HabitAnswers) => void
  onAnalyze: () => Promise<boolean>
  isAnalyzing: boolean
  analysisError: string | null
}

export default function HabitPage({
  answers,
  onChange,
  onAnalyze,
  isAnalyzing,
  analysisError,
}: HabitPageProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleRunAnalysis = async () => {
    const ok = await onAnalyze()
    if (ok) navigate('/analyze')
  }

  // Translated feature sections
  const featureSections = [
    {
      titleKey: 'habit.sectionPersonal', emoji: '🧬',
      fields: [
        { key: 'Age'       as keyof HabitAnswers, tKey: 'Age',              min: 18,  max: 90,  step: 1,    emoji: '👤' },
        { key: 'Pregnancies' as keyof HabitAnswers, tKey: 'Pregnancies',    min: 0,   max: 15,  step: 1,    emoji: '🤰' },
      ],
    },
    {
      titleKey: 'habit.sectionVitals', emoji: '❤️',
      fields: [
        { key: 'Glucose'       as keyof HabitAnswers, tKey: 'Glucose',      min: 50,  max: 220, step: 1,    emoji: '🩸' },
        { key: 'BloodPressure' as keyof HabitAnswers, tKey: 'BloodPressure',min: 40,  max: 130, step: 1,    emoji: '🫀' },
        { key: 'Insulin'       as keyof HabitAnswers, tKey: 'Insulin',      min: 0,   max: 400, step: 1,    emoji: '💉' },
      ],
    },
    {
      titleKey: 'habit.sectionBody', emoji: '📊',
      fields: [
        { key: 'BMI'           as keyof HabitAnswers, tKey: 'BMI',          min: 10,  max: 60,  step: 0.1,  emoji: '⚖️' },
        { key: 'SkinThickness' as keyof HabitAnswers, tKey: 'SkinThickness',min: 0,   max: 60,  step: 1,    emoji: '📏' },
      ],
    },
    {
      titleKey: 'habit.sectionRisk', emoji: '🧪',
      fields: [
        { key: 'DiabetesPedigreeFunction' as keyof HabitAnswers, tKey: 'DiabetesPedigree', min: 0, max: 2.5, step: 0.01, emoji: '🧬' },
      ],
    },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">

      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{t('habit.stepLabel')}</p>
          <h1 className="mt-0.5 text-xl font-semibold text-slate-900 sm:text-2xl">{t('habit.title')}</h1>
        </div>
      </div>

      {/* Slider sections */}
      <div className="space-y-8">
        {featureSections.map(section => (
          <div key={section.titleKey}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {section.emoji} {t(section.titleKey)}
            </p>
            <div className={`grid gap-3 ${
              section.fields.length >= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
            }`}>
              {section.fields.map(f => (
                <FeatureInput
                  key={f.key}
                  label={t(`habit.fields.${f.tKey}.label`)}
                  hint={t(`habit.fields.${f.tKey}.hint`)}
                  value={answers[f.key] as number}
                  onChange={v => onChange({ ...answers, [f.key]: v })}
                  min={f.min} max={f.max} step={f.step}
                  unit={t(`habit.fields.${f.tKey}.unit`, { defaultValue: '' })}
                  normalRange={t(`habit.fields.${f.tKey}.range`)}
                  emoji={f.emoji}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {analysisError && (
        <p className="mt-6 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          {analysisError}
        </p>
      )}

      {/* Actions */}
      <div className="mt-10 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
        <Button variant="secondary" size="md" className="sm:w-32" onClick={() => navigate('/')}>
          {t('common.cancel')}
        </Button>
        <Button size="md" className="sm:w-40" onClick={handleRunAnalysis} disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : t('habit.runAnalysis')}
        </Button>
      </div>
    </div>
  )
}