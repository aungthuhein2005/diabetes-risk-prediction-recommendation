import i18n from 'i18next'
import { HeartPulse, LayoutDashboard, Activity, User } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'my', label: 'MY' },
  { code: 'th', label: 'TH' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  if (pathname === '/analyze') return null

  const currentLang = i18n.language

  const navItems = [
    { to: '/',        label: t('nav.dashboard'),   icon: LayoutDashboard },
    { to: '/habit',   label: t('nav.assessment'),  icon: Activity },
    { to: '/plan',    label: t('nav.healthPlan'),  icon: HeartPulse },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 text-slate-900 no-underline">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
            <HeartPulse className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-tight">DiaPredict</span>
        </NavLink>


        {/* Right: language switcher + profile */}
        <div className="flex items-center gap-3">
          {/* Language pills */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => i18n.changeLanguage(code)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  currentLang === code
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Profile icon */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                isActive
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`
            }
          >
            <User className="h-4 w-4" />
          </NavLink>
        </div>
      </div>
    </header>
  )
}
