import Card from './Card'

export default function EmptyState({
  title = 'No data found',
  description = 'There is nothing to display at the moment.',
}) {
  return (
    <Card>
      <div className="py-8 text-center">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>
    </Card>
  )
}