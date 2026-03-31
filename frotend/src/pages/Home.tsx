import { Activity, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'

const chartLine  = 'M 0 110 L 35 78 L 70 55 L 105 88 L 140 92 L 175 78 L 210 22 L 245 50 L 280 58 L 320 24'
const chartFill  = `${chartLine} L 320 120 L 0 120 Z`
const weekDays   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function HomePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [done, setDone] = useState<Record<string, boolean>>({ water: true })

  const activityKeys = ['walk', 'water', 'sugar', 'sleep'] as const
  const toggle = (id: string) => setDone(p => ({ ...p, [id]: !p[id] }))
  const completed = activityKeys.filter(id => done[id]).length
  const progress  = Math.round((completed / activityKeys.length) * 100)

  const stats = [
    { key: 'healthScore', value: '58',   sub: t('home.outOf100') },
    { key: 'riskLevel',   value: t('home.riskModerate'), sub: t('home.riskModerate') },
    { key: 'lastCheck',   value: '2d',   sub: 'Mar 29, 2026' },
    { key: 'streak',      value: '3',    sub: t('home.daysInRow') },
  ]

  const motivate = progress >= 100
    ? t('home.progressMotivate3')
    : progress >= 50
    ? t('home.progressMotivate2')
    : t('home.progressMotivate1')

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">

      {/* ── Page heading ── */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{t('home.overviewLabel')}</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{t('home.title')}</h1>
      </div>

      {/* ── Stats row ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: t('home.healthScore'), value: '58',   sub: t('home.outOf100') },
          { label: t('home.riskLevel'),   value: t('home.riskModerate'), sub: '' },
          { label: t('home.lastCheck'),   value: '2d',   sub: 'Mar 29, 2026' },
          { label: t('home.streak'),      value: '3',    sub: t('home.daysInRow') },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-xs font-medium text-slate-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{s.value}</p>
            <p className="mt-0.5 text-xs text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── CTA banner ── */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900">{t('home.ctaTitle')}</p>
            <p className="text-xs text-blue-600">{t('home.ctaSub')}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/habit')}
          className="hidden sm:flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {t('common.startNow')} <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Main grid ── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Left: chart + activities */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">{t('home.trendTitle')}</p>
                <p className="text-xs text-slate-400">{t('home.trendSub')}</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-rose-50 px-2.5 py-1">
                <TrendingUp className="h-3.5 w-3.5 text-rose-500" />
                <span className="text-sm font-bold text-rose-600">58%</span>
              </div>
            </div>
            <svg width="100%" height={100} viewBox="0 0 320 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#2563eb" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={chartFill} fill="url(#areaFill)" />
              <path d={chartLine} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-2 flex justify-between">
              {weekDays.map(d => <span key={d} className="text-[10px] text-slate-400">{d}</span>)}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">{t('home.activitiesTitle')}</p>
              <span className="text-xs text-slate-400">{completed}/{activityKeys.length} done</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {activityKeys.map(id => (
                <button
                  key={id}
                  onClick={() => toggle(id)}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    done[id] ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 flex-shrink-0 transition-colors ${done[id] ? 'text-emerald-500' : 'text-slate-300'}`} strokeWidth={2.5} />
                  <span className={`text-sm ${done[id] ? 'text-emerald-700 line-through decoration-emerald-400' : 'text-slate-700'}`}>
                    {t(`home.act_${id}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: progress + tips */}
        <div className="space-y-6">
          <div className="card p-5">
            <p className="mb-3 text-sm font-semibold text-slate-700">{t('home.progressTitle')}</p>
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums text-slate-900">{progress}%</span>
              <span className="text-xs text-slate-400">
                {t('home.progressTasks', { done: completed, total: activityKeys.length })}
              </span>
            </div>
            <ProgressBar value={progress} />
            <p className="mt-2 text-xs text-slate-400">{motivate}</p>
          </div>

          <div className="card p-5">
            <p className="mb-3 text-sm font-semibold text-slate-700">{t('home.tipsTitle')}</p>
            <ul className="space-y-3">
              {(['tip1','tip2','tip3','tip4'] as const).map((k, i) => (
                <li key={k} className="flex gap-2.5 text-sm">
                  <span className="text-base leading-none">{['🩸','⚖️','💧','🏃'][i]}</span>
                  <span className="text-slate-600 leading-snug">{t(`home.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button size="lg" onClick={() => navigate('/habit')}>
            {t('home.cta')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
