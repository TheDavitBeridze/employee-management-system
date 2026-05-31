import Card from './Card'

export default function PageSection({
  title,
  description,
  children,
  actions = null,
}) {
  return (
    <Card>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          ) : null}
        </div>

        {actions ? <div>{actions}</div> : null}
      </div>

      <div>{children}</div>
    </Card>
  )
}