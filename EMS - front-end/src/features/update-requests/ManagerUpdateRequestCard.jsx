import Card from '../../shared/ui/Card'
import StatusBadge from '../../shared/ui/StatusBadge'
import ManagerRejectUpdateRequestForm from './ManagerRejectUpdateRequestForm'

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

export default function ManagerUpdateRequestCard({
  request,
  onApprove,
  onReject,
  isProcessing,
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-900">
            Update Request #{request.id ?? '--'}
          </h3>
          <StatusBadge status={request.status} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {renderField('Employee ID', request.employeeId ?? '--')}
          {renderField('Created At', formatDateTime(request.createdAt))}
          {renderField('Requested First Name', request.requestedFirstName)}
          {renderField('Requested Last Name', request.requestedLastName)}
          {renderField('Requested Email', request.requestedEmail)}
          {renderField('Requested Phone', request.requestedPhone)}
          {renderField('Password Requested', request.passwordRequested ? 'Yes' : 'No')}
          {renderField('Comment', request.comment)}
        </div>

        {request.status === 'PENDING' ? (
          <ManagerRejectUpdateRequestForm
            requestId={request.id}
            onApprove={onApprove}
            onReject={onReject}
            isProcessing={isProcessing}
          />
        ) : null}
      </div>
    </Card>
  )
}