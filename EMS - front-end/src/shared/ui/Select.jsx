export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error = '',
  className = '',
  ...props
}) {
  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      ) : null}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={[
          'w-full rounded-xl border px-4 py-3 outline-none transition',
          error
            ? 'border-red-300 bg-red-50 focus:border-red-400'
            : 'border-slate-300 bg-white focus:border-slate-400',
          className,
        ].join(' ')}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}