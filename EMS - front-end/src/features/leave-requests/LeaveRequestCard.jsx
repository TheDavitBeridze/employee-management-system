import Card from '../../shared/ui/Card'
import StatusBadge from '../../shared/ui/StatusBadge'
import Button from '../../shared/ui/Button'

function formatDate(dateValue) {
  if (!dateValue) {
    return '--'
  }

  return new Date(dateValue).toLocaleDateString()
}

function formatDateTime(dateValue) {
  if (!dateValue) {
    return '--'
  }

  return new Date(dateValue).toLocaleString()
}

export default function LeaveRequestCard({ request, onCancel, isCancelling }) {
  const canCancel = request.status === 'PENDING'

  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Leave Request #{request.id ?? '--'}
            </h3>
            <StatusBadge status={request.status} />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Start Date
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {formatDate(request.startDate)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                End Date
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {formatDate(request.endDate)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created At
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {formatDateTime(request.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Decided At
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {formatDateTime(request.decidedAt)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Reason
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {request.reason || '--'}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Manager Comment
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {request.managerComment || '--'}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {canCancel ? (
            <Button
              variant="outline"
              onClick={() => onCancel(request.id)}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Request'}
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  )
}