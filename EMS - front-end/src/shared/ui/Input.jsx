export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
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

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          'w-full rounded-xl border px-4 py-3 outline-none transition',
          error
            ? 'border-red-300 bg-red-50 focus:border-red-400'
            : 'border-slate-300 bg-white focus:border-slate-400',
          className,
        ].join(' ')}
        {...props}
      />

      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}