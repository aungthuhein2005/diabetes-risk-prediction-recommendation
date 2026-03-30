import { Activity, Bot, HeartPulse } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <section className=" mx-auto px-4 py-6 sm:px-6">
      <div className="flex  flex-col items-center justify-between text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-blue-500/20 to-green-400/20">
            <HeartPulse className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">DiaPredict</h1>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-slate-900">
              Check Your
              <br />
              Diabetes Risk
            </h2>
            <p className="mt-3 text-sm text-slate-500">AI-powered health prediction</p>
          </div>
        </div>

        <div className="my-6 flex h-52 w-full items-center justify-center rounded-2xl bg-linear-to-b from-white to-blue-50/60">
          <div className="flex items-center gap-5 text-slate-400">
            <Activity className="h-16 w-16 text-blue-500/60" />
            <Bot className="h-12 w-12 text-green-500/70" />
          </div>
        </div>

        <Button onClick={() => navigate('/habit')}>Start Assessment</Button>
      </div>
    </section>
  )
}
