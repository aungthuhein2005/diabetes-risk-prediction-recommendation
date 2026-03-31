import { ChevronLeft, ImagePlus, Scan, Sparkles, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import FeatureInput from '../components/FeatureInput'
import type { HabitAnswers } from '../types/assessment'

type HabitPageProps = {
  answers: HabitAnswers
  onChange: (nextAnswers: HabitAnswers) => void
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

export default function HabitPage({ answers, onChange }: HabitPageProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const fileRef = useRef<HTMLInputElement>(null)

  const [file,      setFile]      = useState<File | null>(null)
  const [preview,   setPreview]   = useState<string | null>(null)
  const [dragging,  setDragging]  = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFile = (f: File) => {
    setFileError(null)
    if (!ACCEPTED.includes(f.type))  { setFileError('Unsupported file type. Use JPG, PNG, or WebP.'); return }
    if (f.size > 10 * 1024 * 1024)  { setFileError('File exceeds 10 MB limit.'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const clearFile = () => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setFileError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const fmtSize = (b: number) =>
    b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`

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

      {/* Upload card */}
      <div className="card mb-8 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
              <Scan className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{t('habit.uploadTitle')}</p>
              <p className="text-xs text-slate-400">{t('habit.uploadSub')}</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">
            <Sparkles className="h-3 w-3" /> {t('habit.aiPowered')}
          </span>
        </div>

        {!file && (
          <>
            <div
              id="upload-dropzone"
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed py-10 transition-colors ${
                dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-colors ${dragging ? 'border-blue-200 bg-blue-100' : 'border-slate-200 bg-white'}`}>
                <Upload className={`h-5 w-5 ${dragging ? 'text-blue-500' : 'text-slate-400'}`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">{t('habit.dropTitle')}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {t('habit.dropSub')} <span className="text-blue-600 underline">{t('habit.dropBrowse')}</span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {['JPG', 'PNG', 'WebP', 'HEIC', 'Max 10 MB'].map(f => (
                  <span key={f} className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-400">{f}</span>
                ))}
              </div>
              <input ref={fileRef} type="file" id="image-upload-input"
                accept="image/jpeg,image/png,image/webp,image/heic" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            </div>
            {fileError && <p className="mt-2 text-xs text-red-500">{fileError}</p>}
          </>
        )}

        {file && preview && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <img src={preview} alt="preview" className="h-16 w-16 flex-shrink-0 rounded-lg border border-slate-200 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-400">{fmtSize(file.size)}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {t('habit.readyToExtract')}
                </span>
              </div>
              <button onClick={clearFile} id="remove-image-btn" className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              💡 {t('habit.uploadTip')}
            </p>
            <Button id="extract-values-btn">
              <Sparkles className="h-4 w-4" /> {t('habit.extractBtn')}
            </Button>
            <button onClick={() => fileRef.current?.click()} className="flex w-full items-center justify-center gap-1.5 py-1 text-xs text-slate-400 hover:text-slate-600 transition-colors">
              <ImagePlus className="h-3.5 w-3.5" /> {t('habit.changeImage')}
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">{t('habit.orManual')}</span>
        <div className="h-px flex-1 bg-slate-200" />
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

      {/* Actions */}
      <div className="mt-10 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
        <Button variant="secondary" size="md" className="sm:w-32" onClick={() => navigate('/')}>
          {t('common.cancel')}
        </Button>
        <Button size="md" className="sm:w-40" onClick={() => navigate('/analyze')}>
          {t('habit.runAnalysis')}
        </Button>
      </div>
    </div>
  )
}