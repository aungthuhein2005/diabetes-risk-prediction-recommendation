import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Droplets,
  LineChart,
  Lightbulb,
  TrendingUp,
} from 'lucide-react'
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

  const motivate = progress >= 100
    ? t('home.progressMotivate3')
    : progress >= 50
    ? t('home.progressMotivate2')
    : t('home.progressMotivate1')

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('home.overviewLabel')}</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">DiaPredict</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600">
          <Activity className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-blue-100 p-4">
          <div className="mb-1 flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold text-blue-500">Tip</span>
          </div>
          <p className="text-lg font-bold text-blue-700">Drink more water today</p>
          <p className="mt-1 text-xs text-blue-600">Staying hydrated helps regulate blood sugar.</p>
          <Button className="mt-3 h-9" onClick={() => navigate('/habit')}>
            Check Now
          </Button>
        </div>
        <div className="rounded-2xl bg-emerald-100 p-4">
          <div className="mb-1 flex items-center gap-1.5">
            <LineChart className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-600">Progress</span>
          </div>
          <p className="text-lg font-bold text-emerald-700">You improved 12%</p>
          <p className="mt-1 text-xs text-emerald-600">Keep going, you're doing great.</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs text-slate-500">{t('home.healthScore')}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">58</p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs text-slate-500">{t('home.lastCheck')}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">2d ago</p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">Health Risk Trend</p>
          <div className="flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1">
            <TrendingUp className="h-3.5 w-3.5 text-rose-500" />
            <span className="text-sm font-bold text-rose-500">58%</span>
          </div>
        </div>
        <svg width="100%" height={120} viewBox="0 0 320 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path d={chartFill} fill="url(#areaFill)" />
          <path
            d={chartLine}
            fill="none"
            stroke="#38bdf8"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-2 flex justify-between">
          {weekDays.map((d) => (
            <span key={d} className="text-[10px] text-slate-400">{d}</span>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-2xl bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-5 w-5 text-slate-500" />
          <p className="text-base font-semibold text-slate-800">Suggested for You</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {activityKeys.map((id) => (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={`flex items-center justify-between rounded-xl px-3 py-3 transition-colors ${
                done[id] ? 'bg-emerald-50' : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <span className="text-sm text-slate-800">{t(`home.act_${id}`)}</span>
              <CheckCircle2
                className={`h-4 w-4 ${done[id] ? 'text-emerald-500' : 'text-slate-300'}`}
                strokeWidth={2.5}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4">
        <p className="text-sm font-semibold text-slate-800">{t('home.progressTitle')}</p>
        <div className="mt-3 flex items-center gap-2">
          <Droplets className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-slate-500">
            {t('home.progressTasks', { done: completed, total: activityKeys.length })}
          </span>
        </div>
        <div className="mt-3">
          <ProgressBar value={progress} />
        </div>
        <p className="mt-2 text-sm font-semibold text-blue-600">{progress}%</p>
        <p className="mt-1 text-xs text-slate-400">{motivate}</p>
      </div>

      <div className="mt-6">
        <Button size="lg" onClick={() => navigate('/habit')}>
          {t('home.cta')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
