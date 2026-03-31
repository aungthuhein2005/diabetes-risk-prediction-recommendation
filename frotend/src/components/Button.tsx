import type { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  fullWidth?: boolean
  id?: string
}

const styles = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 shadow-sm',
  ghost:     'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
}

const sizes = {
  sm: 'h-8  px-3 text-xs  gap-1.5',
  md: 'h-9  px-4 text-sm  gap-2',
  lg: 'h-10 px-5 text-sm  gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = true,
  id,
}: ButtonProps) {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-colors duration-150
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
        ${styles[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  )
}
