import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`card p-5 ${className}`}>
      {children}
    </div>
  )
}
