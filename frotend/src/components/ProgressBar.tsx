type ProgressBarProps = {
  value: number
  color?: string
}

export default function ProgressBar({ value, color = 'bg-blue-600' }: ProgressBarProps) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
