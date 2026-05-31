export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition'

  const variantClasses = {
    primary: 'bg-slate-900 text-white hover:opacity-90',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline:
      'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
  }

  const disabledClasses = disabled ? 'cursor-not-allowed opacity-60' : ''

  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        baseClasses,
        variantClasses[variant] ?? variantClasses.primary,
        disabledClasses,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}