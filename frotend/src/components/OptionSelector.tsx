type OptionSelectorProps = {
  options: string[]
  value: string
  onChange: (value: string) => void
}

export default function OptionSelector({ options, value, onChange }: OptionSelectorProps) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value
        return (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition duration-200 ${
              active
                ? 'border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-200'
                : 'border-slate-200 bg-white/80 text-slate-600 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
