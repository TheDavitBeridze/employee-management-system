import { useState } from 'react'
import Card from '../../shared/ui/Card'
import StatusBadge from '../../shared/ui/StatusBadge'
import Button from '../../shared/ui/Button'
import AssignmentSubmitForm from './AssignmentSubmitForm'

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
      <p className="mt-1 text-sm text-slate-700 break-words">{value || '--'}</p>
    </div>
  )
}

export default function EmployeeAssignmentCard({
  assignment,
  onSubmit,
  isSubmitting,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const canSubmit =
    assignment.status === 'ASSIGNED' || assignment.status === 'OVERDUE'

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {assignment.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Due: {formatDateTime(assignment.dueAt)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={assignment.status} />
          <Button
            variant="outline"
            className="px-3 py-2 text-xs"
            onClick={() => setIsExpanded((current) => !current)}
          >
            {isExpanded ? 'Hide' : 'Details'}
          </Button>
        </div>
      </div>

      {isExpanded ? (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
              {assignment.description || '--'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {renderField('Department', assignment.departmentName)}
            {renderField('Assigned At', formatDateTime(assignment.assignedAt))}
            {renderField('Manager Comment', assignment.managerComment)}
            {renderField('Submitted At', formatDateTime(assignment.submittedAt))}
            {renderField('Submission Link', assignment.submissionLink)}
            {renderField('Submission File', assignment.submissionFileName)}
          </div>

          {canSubmit ? (
            <AssignmentSubmitForm
              assignmentId={assignment.id}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
            />
          ) : null}
        </div>
      ) : null}
    </Card>
  )
}