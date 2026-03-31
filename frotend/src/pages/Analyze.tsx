import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'

type AnalyzePageProps = { analysisPercent: number }

export default function AnalyzePage({ analysisPercent }: AnalyzePageProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const pct = Math.max(0, Math.min(analysisPercent, 100))

  const size = 200, segments = 44, filled = Math.round((pct / 100) * segments)
  const radius = 70, segW = 7, segH = 16, cx = size / 2

  const risk = pct > 65
    ? { label: t('analyze.riskHigh'), cls: 'badge-high', color: '#dc2626', bar: 'bg-red-500'     }
    : pct > 35
    ? { label: t('analyze.riskMod'),  cls: 'badge-mod',  color: '#d97706', bar: 'bg-amber-400'  }
    : { label: t('analyze.riskLow'),  cls: 'badge-low',  color: '#059669', bar: 'bg-emerald-500' }

  const breakdown = [
    { labelKey: 'analyze.metabolic', pct },
    { labelKey: 'analyze.lifestyle', pct: Math.round(pct * 0.72) },
    { labelKey: 'analyze.genetic',   pct: Math.round(pct * 0.41) },
  ]

  const recoKeys = ['reco1','reco2','reco3','reco4'] as const

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">

      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => navigate('/habit')}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{t('analyze.stepLabel')}</p>
          <h1 className="mt-0.5 text-xl font-semibold text-slate-900 sm:text-2xl">{t('analyze.title')}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">

        {/* Ring chart */}
        <div className="card flex flex-col items-center p-6 lg:col-span-2">
          <div style={{ width: size, height: size, position: 'relative' }} className="flex items-center justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0 }}>
              {Array.from({ length: segments }).map((_, i) => {
                const θ = (i / segments) * Math.PI * 2 - Math.PI / 2
                const x = cx + radius * Math.cos(θ)
                const y = cx + radius * Math.sin(θ)
                return (
                  <rect key={i}
                    x={x - segW / 2} y={y - segH / 2}
                    width={segW} height={segH} rx={3}
                    fill={i < filled ? risk.color : '#e2e8f0'}
                    transform={`rotate(${θ * 180 / Math.PI + 90}, ${x}, ${y})`}
                  />
                )
              })}
            </svg>
            <div className="relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full border border-slate-200 bg-white">
              <span className="text-4xl font-bold tabular-nums text-slate-900">{pct}%</span>
              <span className={`mt-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${risk.cls}`}>
                {risk.label}
              </span>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">{t('analyze.chartCaption')}</p>
        </div>

        {/* Info panel */}
        <div className="space-y-5 lg:col-span-3">

          <div className="card p-5">
            <p className="mb-4 text-sm font-semibold text-slate-700">{t('analyze.breakdownTitle')}</p>
            <div className="space-y-4">
              {breakdown.map(b => (
                <div key={b.labelKey}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-slate-500">{t(b.labelKey)}</span>
                    <span className="font-semibold tabular-nums text-slate-700">{b.pct}%</span>
                  </div>
                  <ProgressBar value={b.pct} color={risk.bar} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="mb-2 text-sm font-semibold text-slate-700">{t('analyze.meansTitle')}</p>
            <p className="text-sm leading-relaxed text-slate-500">{t('analyze.meansText')}</p>
          </div>

          <div className="card p-5">
            <p className="mb-3 text-sm font-semibold text-slate-700">{t('analyze.recoTitle')}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {recoKeys.map(k => (
                <div key={k} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                  <span className="text-xs text-slate-600">{t(`analyze.${k}`)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={() => navigate('/plan')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
            >
              {t('analyze.viewPlan')}
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </button>
            <button
              onClick={() => navigate('/habit')}
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 active:bg-slate-100"
            >
              {t('common.retake')}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] text-slate-400">{t('analyze.disclaimer')}</p>
    </div>
  )
}