import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

const baseCardStyles =
  'rounded-2xl border border-white/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/60 p-5 shadow-xl shadow-blue-100/50 transition-transform duration-300 hover:-translate-y-0.5'

export default function Card({ children, className = '' }: CardProps) {
  return <article className={`${baseCardStyles} ${className}`}>{children}</article>
}
