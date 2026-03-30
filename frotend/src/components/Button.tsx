import type { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyle =
    'inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'

  const variantStyle =
    variant === 'primary'
      ? 'bg-linear-to-r from-blue-500 to-green-400 shadow-lg shadow-blue-200/70 hover:from-blue-600 hover:to-green-500'
      : 'bg-linear-to-r from-green-400 to-green-500 shadow-lg shadow-green-200/70 hover:from-green-500 hover:to-green-600'

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variantStyle} ${className}`}>
      {children}
    </button>
  )
}
