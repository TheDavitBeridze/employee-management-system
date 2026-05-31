import Card from '../../shared/ui/Card'
import StatusBadge from '../../shared/ui/StatusBadge'

function formatDateTime(dateValue) {
  if (!dateValue) {
    return '--'
  }

  return new Date(dateValue).toLocaleString()
}

function renderField(label, value) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm text-slate-700">{value || '--'}</p>
    </div>
  )
}

export default function UpdateRequestCard({ request }) {
  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Update Request #{request.id ?? '--'}
            </h3>
            <StatusBadge status={request.status} />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {renderField('Requested First Name', request.requestedFirstName)}
            {renderField('Requested Last Name', request.requestedLastName)}
            {renderField('Requested Email', request.requestedEmail)}
            {renderField('Requested Phone', request.requestedPhone)}
            {renderField('Password Requested', request.passwordRequested ? 'Yes' : 'No')}
            {renderField('Created At', formatDateTime(request.createdAt))}
            {renderField('Decided At', formatDateTime(request.decidedAt))}
            {renderField('Decided By User ID', request.decidedByUserId ?? '--')}
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Comment
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {request.comment || '--'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}