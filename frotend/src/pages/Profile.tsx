import { Activity, Calendar, Download, Eye, HeartPulse, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ProgressBar from '../components/ProgressBar'

type RiskLevel = 'High' | 'Moderate' | 'Low'

const user    = { name: 'Aung Thu Hein', email: 'aung@example.com', joined: 'January 2026', initials: 'AT' }
const savedPlans: { id: number; date: string; risk: RiskLevel; probability: number; factors: string[] }[] = [
  { id: 1, date: 'Mar 29, 2026', risk: 'High',     probability: 71.7, factors: ['Glucose', 'Insulin', 'Age'] },
  { id: 2, date: 'Mar 15, 2026', risk: 'Moderate', probability: 44.2, factors: ['BMI', 'Blood Pressure'] },
  { id: 3, date: 'Feb 28, 2026', risk: 'Moderate', probability: 38.9, factors: ['Glucose', 'Age'] },
  { id: 4, date: 'Feb 10, 2026', risk: 'Low',      probability: 22.1, factors: ['BMI'] },
]
const riskCfg = {
  High:     { cls: 'badge-high', bar: 'bg-red-500'     },
  Moderate: { cls: 'badge-mod',  bar: 'bg-amber-400'   },
  Low:      { cls: 'badge-low',  bar: 'bg-emerald-500' },
}
const trophies = [
  { key: 'ach1', icon: '🎯', earned: true  },
  { key: 'ach2', icon: '🔥', earned: true  },
  { key: 'ach3', icon: '🏆', earned: false },
  { key: 'ach4', icon: '💎', earned: false },
]

export default function ProfilePage() {
  const { t } = useTranslation()

  const userStats = [
    { labelKey: 'profile.totalAssessments', value: '4',    icon: Activity },
    { labelKey: 'profile.latestRisk',       value: t('home.riskLevel') === 'Risk Level' ? 'High' : 'High', icon: ShieldCheck },
    { labelKey: 'profile.avgRisk',          value: '44%',  icon: HeartPulse },
    { labelKey: 'profile.daysActive',       value: '21',   icon: Calendar },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">

      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{t('profile.label')}</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{t('profile.title')}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="card p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
              {user.initials}
            </div>
            <p className="text-base font-semibold text-slate-900">{user.name}</p>
            <p className="mt-0.5 text-sm text-slate-400">{user.email}</p>
            <p className="mt-3 text-xs text-slate-400">{t('profile.memberSince', { date: user.joined })}</p>
            <button className="mt-4 w-full rounded-lg border border-slate-200 bg-white py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
              {t('profile.editProfile')}
            </button>
          </div>

          <div className="card p-5">
            <p className="mb-4 text-sm font-semibold text-slate-700">{t('profile.achievements')}</p>
            <div className="grid grid-cols-2 gap-2">
              {trophies.map(({ key, icon, earned }) => (
                <div key={key} className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-center transition-colors ${earned ? 'border-blue-100 bg-blue-50' : 'border-slate-100 bg-slate-50 opacity-40 grayscale'}`}>
                  <span className="text-2xl">{icon}</span>
                  <span className={`text-[10px] font-medium leading-tight ${earned ? 'text-blue-700' : 'text-slate-400'}`}>
                    {t(`profile.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {userStats.map(({ labelKey, value, icon: Icon }) => (
              <div key={labelKey} className="card p-4">
                <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                  <Icon className="h-4 w-4 text-slate-500" />
                </div>
                <p className="text-xl font-bold tabular-nums text-slate-900">{value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{t(labelKey)}</p>
              </div>
            ))}
          </div>

          {/* Risk history */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">{t('profile.riskHistory')}</p>
              <span className="text-xs text-slate-400">{t('profile.lastN', { n: savedPlans.length })}</span>
            </div>
            <div className="space-y-3">
              {savedPlans.map(plan => (
                <div key={plan.id} className="flex items-center gap-3">
                  <span className="w-16 flex-shrink-0 text-xs text-slate-400">{plan.date.split(',')[0]}</span>
                  <div className="flex-1"><ProgressBar value={plan.probability} color={riskCfg[plan.risk].bar} /></div>
                  <span className="w-10 text-right text-xs font-semibold tabular-nums text-slate-700">{plan.probability}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Saved plans table */}
          <div className="card overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <p className="text-sm font-semibold text-slate-700">{t('profile.savedPlans')}</p>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                {t('profile.nPlans', { n: savedPlans.length })}
              </span>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3">{t('profile.colDate')}</th>
                    <th className="px-5 py-3">{t('profile.colRisk')}</th>
                    <th className="px-5 py-3">{t('profile.colProb')}</th>
                    <th className="px-5 py-3">{t('profile.colFactors')}</th>
                    <th className="px-5 py-3 text-right">{t('profile.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {savedPlans.map((plan, idx) => (
                    <tr key={plan.id} className={`border-b border-slate-50 transition-colors hover:bg-slate-50/60 ${idx === savedPlans.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-5 py-3.5 text-slate-600">{plan.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${riskCfg[plan.risk].cls}`}>{plan.risk}</span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold tabular-nums text-slate-800">{plan.probability}%</td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {plan.factors.map(f => (
                            <span key={f} className="rounded-md border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-500">{f}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex gap-1.5">
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 transition-colors">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 transition-colors">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-slate-100">
              {savedPlans.map(plan => (
                <div key={plan.id} className="px-5 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{plan.date}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${riskCfg[plan.risk].cls}`}>{plan.risk}</span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <ProgressBar value={plan.probability} color={riskCfg[plan.risk].bar} />
                    <span className="flex-shrink-0 text-xs font-semibold tabular-nums text-slate-700">{plan.probability}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {plan.factors.map(f => (
                        <span key={f} className="rounded-md border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-500">{f}</span>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400"><Eye className="h-3.5 w-3.5" /></button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400"><Download className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">{t('profile.savedNote')}</p>
        </div>
      </div>
    </div>
  )
}
