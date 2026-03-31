type FeatureInputProps = {
  label: string
  hint?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  normalRange?: string
  emoji?: string
}

export default function FeatureInput({
  label, hint, value, onChange,
  min = 0, max = 100, step = 1,
  unit, normalRange, emoji,
}: FeatureInputProps) {
  const pct = ((value - min) / (max - min)) * 100
  const display = Number.isInteger(value) ? String(value) : value.toFixed(2)

  return (
    <div className="card p-4 space-y-3">
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-700">
          {emoji && <span className="mr-1.5">{emoji}</span>}
          {label}
        </span>
        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 tabular-nums">
          {display}{unit ? ` ${unit}` : ''}
        </span>
      </div>

      {/* Hint */}
      {hint && <p className="text-xs text-slate-400 -mt-1">{hint}</p>}

      {/* Slider */}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider w-full"
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`,
        }}
      />

      {/* Normal range */}
      {normalRange && (
        <p className="text-xs text-slate-400">
          Normal range: <span className="font-medium text-emerald-600">{normalRange}</span>
        </p>
      )}
    </div>
  )
}
