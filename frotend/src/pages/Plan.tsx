import { ArrowLeft, CircleAlert, Download, HeartPulse, ListChecks, Save, Stethoscope } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

const planResult = {
  risk: 'High',
  probability: 0.7171334,
  top_factors: [
    { feature: 'Glucose', impact: 'High' },
    { feature: 'Insulin', impact: 'High' },
    { feature: 'Age',     impact: 'High' },
  ],
}

type SectionCardProps = {
  title: string; icon: ReactNode
  content?: string; bulletItems?: string[]; footerText?: string
}

function SectionCard({ title, icon, content, bulletItems, footerText }: SectionCardProps) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">{icon}</div>
        <span className="text-sm font-semibold text-slate-800">{title}</span>
      </div>
      {content && <p className="text-sm leading-relaxed text-slate-500">{content}</p>}
      {bulletItems && (
        <ul className="space-y-2">
          {bulletItems.map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-500">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
              {item}
            </li>
          ))}
        </ul>
      )}
      {footerText && <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] italic text-slate-400">{footerText}</p>}
    </div>
  )
}

export default function PlanPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [downloading, setDownloading] = useState(false)
  const pctStr = (planResult.probability * 100).toFixed(1)

  const handleDownloadPdf = () => {
    setDownloading(true)
    try {
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
      const left = 48, maxW = pdf.internal.pageSize.getWidth() - 96
      let y = 56
      pdf.setFont('helvetica', 'bold').setFontSize(18)
      pdf.text('DiaPredict — Health Plan', left, y); y += 26
      pdf.setFont('helvetica', 'normal').setFontSize(12)
      pdf.text(`Risk: ${planResult.risk}`, left, y); y += 18
      pdf.text(`Probability: ${pctStr}%`, left, y); y += 18
      pdf.text(`Factors: ${planResult.top_factors.map(f => `${f.feature} (${f.impact})`).join(', ')}`, left, y); y += 24
      pdf.setFont('helvetica', 'bold').setFontSize(13); pdf.text('Advice', left, y); y += 18
      pdf.setFont('helvetica', 'normal').setFontSize(11)
      const wrapped = pdf.splitTextToSize(t('plan.explanationText'), maxW)
      pdf.text(wrapped, left, y)
      pdf.save(`diapredict-${planResult.risk.toLowerCase()}-plan.pdf`)
    } finally { setDownloading(false) }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">

      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => navigate('/analyze')}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{t('plan.label')}</p>
          <h1 className="mt-0.5 text-xl font-semibold text-slate-900 sm:text-2xl">{t('plan.title')}</h1>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{t('plan.riskLevel')}</p>
          <p className="mt-1 text-xl font-bold text-red-600">{planResult.risk}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{t('plan.probability')}</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{pctStr}%</p>
        </div>
        <div className="card col-span-2 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">{t('plan.topFactors')}</p>
          <div className="flex flex-wrap gap-1.5">
            {planResult.top_factors.map(f => (
              <span key={f.feature} className="rounded-md border border-amber-100 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                {f.feature} · {f.impact}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard
          title={t('plan.explanation')}
          icon={<CircleAlert className="h-4 w-4 text-blue-500" />}
          content={t('plan.explanationText')}
        />
        <SectionCard
          title={t('plan.actionPlan')}
          icon={<ListChecks className="h-4 w-4 text-cyan-500" />}
          bulletItems={[t('plan.action1'), t('plan.action2'), t('plan.action3'), t('plan.action4')]}
        />
        <SectionCard
          title={t('plan.lifestyle')}
          icon={<HeartPulse className="h-4 w-4 text-emerald-500" />}
          bulletItems={[t('plan.life1'), t('plan.life2'), t('plan.life3'), t('plan.life4')]}
        />
        <SectionCard
          title={t('plan.medAdvice')}
          icon={<Stethoscope className="h-4 w-4 text-violet-500" />}
          content={t('plan.medText')}
          footerText={t('plan.medFooter')}
        />
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
        <Button variant="secondary" size="md" className="sm:w-36">
          <Save className="h-4 w-4" /> {t('common.savePlan')}
        </Button>
        <Button size="md" className="sm:w-44" onClick={handleDownloadPdf} disabled={downloading}>
          <Download className="h-4 w-4" />
          {downloading ? '…' : t('common.download')}
        </Button>
      </div>
    </div>
  )
}