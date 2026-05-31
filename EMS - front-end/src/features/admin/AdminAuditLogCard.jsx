import { useState } from 'react'
import Card from '../../shared/ui/Card'
import Button from '../../shared/ui/Button'
import StatusBadge from '../../shared/ui/StatusBadge'

function formatDateTime(dateValue) {
  if (!dateValue) {
    return '--'
  }

  return new Date(dateValue).toLocaleString()
}

function getAuditActionLabel(action) {
  const labels = {
    CREATE: 'Created',
    UPDATE: 'Updated',
    DELETE: 'Deleted',
    APPROVE: 'Approved',
    REJECT: 'Rejected',
    CANCEL: 'Cancelled',
    SUBMIT: 'Submitted',
    ASSIGN: 'Assigned',
    LOGIN: 'Logged In',
    LOGOUT: 'Logged Out',
  }

  return labels[action] || action || 'Activity'
}

function buildAuditHeadline(log) {
  const actionLabel = getAuditActionLabel(log.action)
  const entityLabel = (log.entityType || 'SYSTEM')
    .toString()
    .replaceAll('_', ' ')
    .toLowerCase()

  return `${actionLabel} ${entityLabel}`
}

function renderField(label, value) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm text-slate-700">{value || '--'}</p>
    </div>
  )
}

export default function AdminAuditLogCard({ log }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold text-slate-900">
              {buildAuditHeadline(log)}
            </h3>
            <StatusBadge status={log.action} />
          </div>

          <p className="mt-2 text-sm text-slate-800">
            {log.details || 'No additional details provided.'}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {formatDateTime(log.createdAt)}
          </p>
        </div>

        <Button
          variant="outline"
          className="px-3 py-2 text-xs"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? 'Hide' : 'Details'}
        </Button>
      </div>

      {isExpanded ? (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {renderField('Audit Log ID', log.id)}
            {renderField('Actor User ID', log.actorUserId)}
            {renderField('Actor Email', log.actorEmail)}
            {renderField('Action', log.action)}
            {renderField('Entity Type', log.entityType)}
            {renderField('Entity ID', log.entityId)}
            {renderField('Created At', formatDateTime(log.createdAt))}
          </div>
        </div>
      ) : null}
    </Card>
  )
}