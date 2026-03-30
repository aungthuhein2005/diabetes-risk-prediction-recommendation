type ProgressBarProps = {
  value: number
}

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="mb-4">
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="mt-1 text-right text-xs font-medium text-slate-500">{value}%</div>
    </div>
  )
}
