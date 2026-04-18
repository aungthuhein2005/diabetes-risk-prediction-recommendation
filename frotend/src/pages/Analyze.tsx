import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import type { AnalyzeResult } from '../types/assessment'
import Button from '../components/Button'

type AnalyzePageProps = { analysisPercent: number; result: AnalyzeResult | null }

export default function AnalyzePage({ analysisPercent, result }: AnalyzePageProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const pct = Math.max(
    0,
    Math.min(result ? Math.round(result.probability * 100) : analysisPercent, 100),
  )

  const size = 200, segments = 44, filled = Math.round((pct / 100) * segments)
  const radius = 70, segW = 7, segH = 16, cx = size / 2

  const risk = result?.risk === 'High'
    ? { label: t('analyze.riskHigh'), cls: 'badge-high', color: '#dc2626', bar: 'bg-red-500' }
    : result?.risk === 'Medium'
      ? { label: t('analyze.riskMod'), cls: 'badge-mod', color: '#d97706', bar: 'bg-amber-400' }
      : result?.risk === 'Low'
        ? { label: t('analyze.riskLow'), cls: 'badge-low', color: '#059669', bar: 'bg-emerald-500' }
        : pct > 65
          ? { label: t('analyze.riskHigh'), cls: 'badge-high', color: '#dc2626', bar: 'bg-red-500' }
          : pct > 35
            ? { label: t('analyze.riskMod'), cls: 'badge-mod', color: '#d97706', bar: 'bg-amber-400' }
            : { label: t('analyze.riskLow'), cls: 'badge-low', color: '#059669', bar: 'bg-emerald-500' }

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

      <div className="flex flex-col items-center gap-6">

        {/* Ring chart */}
        <div className="card flex w-full max-w-md flex-col items-center p-6">
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
          <Button
          onClick={() => navigate('/plan')}
          className="mt-6 "
        >
          {t('analyze.viewPlan')}
        </Button>
          <p className="mt-4 text-center text-xs text-slate-400">{t('analyze.chartCaption')}</p>
          
        </div>
       
      </div>
    </div>
  );
}