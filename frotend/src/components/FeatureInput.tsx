import type { LucideIcon } from 'lucide-react'

type FeatureInputProps = {
  label: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
  min?: number
  max?: number
  step?: number
  icon: LucideIcon
  iconClassName?: string
}

export default function FeatureInput({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  step = 1,
  icon: Icon,
  iconClassName = 'text-blue-500',
}: FeatureInputProps) {
  return (
    <section className="rounded-xl bg-white/80 p-3 shadow-sm">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon className={`h-4 w-4 ${iconClassName}`} />
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
      />
    </section>
  )
}
