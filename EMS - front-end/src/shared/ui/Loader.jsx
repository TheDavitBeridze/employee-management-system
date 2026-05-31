export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="text-sm font-medium text-slate-600">{text}</div>
    </div>
  )
}