import { useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, CheckCircle2, ChevronRight, ShieldAlert } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import ProgressBar from '../components/ProgressBar'

type AnalyzePageProps = {
  analysisPercent: number
}

export default function AnalyzePage({ analysisPercent }: AnalyzePageProps) {
  const navigate = useNavigate()

  // Dynamic configuration based on the risk percentage
  const getRiskConfig = (percent: number) => {
    if (percent < 30) return { 
      label: 'Low Risk', 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-100',
      icon: CheckCircle2,
      description: "Your metrics are currently within a healthy range. Maintaining your current lifestyle is key."
    }
    if (percent < 70) return { 
      label: 'Moderate Risk', 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      border: 'border-amber-100',
      icon: AlertCircle,
      description: "Some of your indicators are slightly elevated. Small changes now can have a major impact."
    }
    return { 
      label: 'High Risk', 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      border: 'border-red-100',
      icon: ShieldAlert,
      description: "Your responses show strong indications of risk factors. We recommend sharing this report with a professional."
    }
  }

  const config = getRiskConfig(analysisPercent)
  const RiskIcon = config.icon

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <Card className="overflow-hidden border-none shadow-2xl">
        {/* Top Progress Bar - Fixed at 100% since analysis is done */}
        <div className="px-6 pt-6">
           <ProgressBar value={100} />
           <p className="text-center text-[10px] uppercase tracking-widest text-slate-400 mt-2 font-bold">Analysis Complete</p>
        </div>

        <div className="flex flex-col items-center p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Risk Assessment Result</h3>
          
          {/* Enhanced Circular Chart */}
          <div className="relative mb-8 group">
            {/* Soft Glow Background */}
            <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${config.bg}`} />
            
            <div className="relative grid h-56 w-56 place-items-center rounded-full bg-white shadow-xl border-4 border-slate-50">
              {/* Outer Ring (The "Track") */}
              <div className="absolute inset-0 rounded-full border-[12px] border-slate-100" />
              
              {/* Active Ring */}
              <div
                className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
                style={{
                  background: `conic-gradient(currentColor ${analysisPercent * 3.6}deg, transparent 0deg)`,
                  maskImage: 'radial-gradient(transparent 58%, black 60%)',
                  WebkitMaskImage: 'radial-gradient(transparent 58%, black 60%)',
                }}
              />
              
              <div className="flex flex-col items-center">
                <span className={`text-6xl font-black tracking-tight ${config.color}`}>
                  {analysisPercent}%
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Score</span>
              </div>
            </div>
          </div>

          {/* Dynamic Status Badge */}
          <div className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold shadow-sm border ${config.bg} ${config.color} ${config.border}`}>
            <RiskIcon size={18} strokeWidth={2.5} />
            {config.label}
          </div>

          <p className="mt-6 text-slate-600 leading-relaxed max-w-sm">
            {config.description}
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-slate-50 p-6 space-y-3">
          <Button 
            className="w-full flex items-center justify-center gap-2 py-4 text-lg shadow-md" 
            onClick={() => navigate('/plan')}
          >
            View Personalized Health Plan
            <ChevronRight size={20} />
          </Button>
          
          <button
            type="button"
            className="group flex w-full items-center justify-center gap-1 py-2 text-sm font-semibold text-slate-400 transition hover:text-indigo-600"
            onClick={() => navigate('/habit')}
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Edit My Responses
          </button>
        </div>
      </Card>

      <p className="mt-6 text-center text-xs text-slate-400">
        Disclaimer: This is an AI-generated assessment and not a medical diagnosis. 
        Always consult with a qualified healthcare provider.
      </p>
    </section>
  )
}