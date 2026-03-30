import { ArrowLeft, Download, ShieldAlert, TrendingUp } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'

type PredictionResult = {
  risk: string
  probability: number
  top_factors: Array<{ feature: string; impact: string }>
  advice: string
}

const planResult: PredictionResult = {
  risk: 'High',
  probability: 0.7171334,
  top_factors: [
    { feature: 'Glucose', impact: 'High' },
    { feature: 'Insulin', impact: 'High' },
    { feature: 'Age', impact: 'High' },
  ],
  advice:
    '1. **Simple Explanation**  \nYour risk level is high due to elevated glucose (blood sugar), insulin levels, and age. These factors are linked to conditions like diabetes, metabolic syndrome, or heart disease. While this doesn’t mean you have a specific illness, it highlights the need to address these risks early to protect your health.\n\n2. **Lifestyle Advice**  \n- **Diet**: Focus on whole foods (vegetables, lean proteins, whole grains) and limit refined sugars, processed foods, and sugary drinks.  \n- **Exercise**: Aim for 30–60 minutes of moderate activity (e.g., walking, swimming) most days to improve insulin sensitivity and glucose control.  \n- **Weight Management**: Even a 5–10% reduction in body weight can significantly lower blood sugar and insulin levels.  \n- **Sleep & Stress**: Prioritize 7–8 hours of sleep and practice stress-reduction techniques (e.g., meditation, yoga) to support metabolic health.  \n\n3. **Preventive Steps**  \n- **Monitor Health Metrics**: Regularly check blood sugar levels (if recommended by a healthcare provider) and track cholesterol or blood pressure.  \n- **Hydration**: Drink plenty of water to support kidney function and metabolism.  \n- **Avoid Harmful Habits**: Limit alcohol, quit smoking, and reduce sedentary behavior (e.g., screen time).  \n- **Stay Informed**: Learn about your family health history and discuss risks with a professional.  \n\n4. **Suggest Consulting a Doctor**  \nA healthcare provider can assess your risk through blood tests (e.g., HbA1c, lipid panel) and create a personalized plan. Early intervention can reduce complications and improve long-term outcomes.  \n\n**Note**: This guidance is not a diagnosis. Always consult a qualified healthcare professional for individualized care.',
}

export default function PlanPage() {
  const navigate = useNavigate()
  const probabilityPercent = (planResult.probability * 100).toFixed(1)

  const adviceLines = planResult.advice
    .split('\n')
    .map((line) => line.replace(/\*\*/g, '').trimEnd())

  const handleDownloadPdf = () => {
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const left = 48
    const right = 48
    const maxTextWidth = pageWidth - left - right
    const lineHeight = 16
    let y = 56

    const ensureSpace = (requiredHeight: number) => {
      if (y + requiredHeight > pageHeight - 56) {
        pdf.addPage()
        y = 56
      }
    }

    const writeWrapped = (text: string, fontSize = 11) => {
      const wrapped = pdf.splitTextToSize(text, maxTextWidth)
      ensureSpace(wrapped.length * lineHeight + 2)
      pdf.setFontSize(fontSize)
      pdf.text(wrapped, left, y)
      y += wrapped.length * lineHeight
    }

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(18)
    pdf.text('DiaPredict - Personalized Health Advice', left, y)
    y += 26

    pdf.setFont('helvetica', 'normal')
    writeWrapped(`Risk: ${planResult.risk}`, 12)
    y += 4
    writeWrapped(`Probability: ${probabilityPercent}%`, 12)
    y += 8
    writeWrapped(
      `Top Factors: ${planResult.top_factors.map((factor) => `${factor.feature} (${factor.impact})`).join(', ')}`,
      11,
    )
    y += 12

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(13)
    ensureSpace(lineHeight + 6)
    pdf.text('Advice', left, y)
    y += 18
    pdf.setFont('helvetica', 'normal')

    adviceLines.forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed) {
        y += 10
        return
      }

      const text = trimmed.startsWith('- ') ? `- ${trimmed.slice(2)}` : trimmed
      writeWrapped(text, 11)
      y += 4
    })

    const safeRisk = planResult.risk.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    pdf.save(`diapredict-advice-${safeRisk}.pdf`)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate('/analyze')}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Result
        </button>
      </div>

      <div className="space-y-5">
        <Card className="border-none shadow-2xl">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-red-50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-500">Risk Level</p>
              <div className="flex items-center gap-2 text-2xl font-black text-red-600">
                <ShieldAlert size={22} />
                {planResult.risk}
              </div>
            </div>
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-500">Probability</p>
              <div className="flex items-center gap-2 text-2xl font-black text-blue-600">
                <TrendingUp size={22} />
                {probabilityPercent}%
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-white/80 p-4 shadow-sm">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Top Factors</p>
            <div className="flex flex-wrap gap-2">
              {planResult.top_factors.map((factor) => (
                <span
                  key={factor.feature}
                  className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
                >
                  {factor.feature} ({factor.impact})
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border-none shadow-xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
            Personalized Advice
          </p>
          <div className="space-y-2 text-sm leading-relaxed text-slate-700">
            {adviceLines.map((line, index) => {
              if (!line.trim()) {
                return <div key={`space-${index}`} className="h-2" />
              }

              const isBullet = line.trim().startsWith('- ')
              const text = isBullet ? line.trim().slice(2) : line.trim()

              return (
                <p key={`${line}-${index}`} className={isBullet ? 'pl-4' : ''}>
                  {isBullet ? `- ${text}` : text}
                </p>
              )
            })}
          </div>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button className="shadow-lg">Save Plan</Button>
          <Button className="shadow-lg" onClick={handleDownloadPdf}>
            <span className="inline-flex items-center gap-2">
              <Download size={16} />
              Download PDF
            </span>
          </Button>
        </div>
      </div>
    </section>
  )
}