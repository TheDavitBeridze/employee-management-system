export default function Card({ children, className = '' }) {
  return (
    <div
      className={[
        'rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}