import { useState } from 'react'
import Card from '../../shared/ui/Card'
import StatusBadge from '../../shared/ui/StatusBadge'
import Button from '../../shared/ui/Button'
import ManagerAssignmentDecisionForm from './ManagerAssignmentDecisionForm'
import AssignAssignmentForm from './AssignAssignmentForm'
import UpdateAssignmentDeadlineForm from './UpdateAssignmentDeadlineForm'
import CancelAssignmentForm from './CancelAssignmentForm'

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
      <p className="mt-1 break-words text-sm text-slate-700">{value || '--'}</p>
    </div>
  )
}

export default function ManagerAssignmentCard({
  assignment,
  onAssign,
  onApprove,
  onReject,
  onReassign,
  onCancel,
  onUpdateDeadline,
  onDownloadFile,
  isProcessing,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isReassigning, setIsReassigning] = useState(false)
  const [isUpdatingDeadline, setIsUpdatingDeadline] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const canAssign = assignment.status === 'DRAFT'
  const canReview = assignment.status === 'SUBMITTED'
  const canManageAssigned =
  assignment.status === 'ASSIGNED' ||
  assignment.status === 'OVERDUE' ||
  assignment.status === 'REJECTED'
  const hasSubmissionFile = Boolean(assignment.submissionFileName)

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {assignment.title || '--'}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
             {assignment.status === 'DRAFT'
              ? 'Draft assignment'
              : `Assigned to: ${assignment.assignedEmployeeName || '--'}`}
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
            {renderField('Assigned Employee', assignment.assignedEmployeeName)}
            {renderField('Department', assignment.departmentName)}
            {renderField('Due At', formatDateTime(assignment.dueAt))}
            {renderField('Assigned At', formatDateTime(assignment.assignedAt))}
            {renderField('Submitted At', formatDateTime(assignment.submittedAt))}
            {renderField('Reviewed At', formatDateTime(assignment.reviewedAt))}
            {renderField('Manager Comment', assignment.managerComment)}
            {renderField('Submission Comment', assignment.submissionComment)}
            {renderField('Submission Link', assignment.submissionLink)}
            {renderField('Submission File', assignment.submissionFileName)}
          </div>

          {hasSubmissionFile ? (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => onDownloadFile?.(assignment.id, assignment.submissionFileName)}
                disabled={isProcessing}
              >
                Download File
              </Button>
            </div>
          ) : null}

          {canAssign ? (
            <AssignAssignmentForm
              assignmentId={assignment.id}
              onAssign={onAssign}
              isSubmitting={isProcessing}
              submitLabel="Assign"
            />
          ) : null}

          {canManageAssigned ? (
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReassigning((current) => !current)
                    setIsUpdatingDeadline(false)
                    setIsCancelling(false)
                  }}
                  disabled={isProcessing}
                >
                  {isReassigning ? 'Hide Reassign' : 'Reassign'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setIsUpdatingDeadline((current) => !current)
                    setIsReassigning(false)
                    setIsCancelling(false)
                  }}
                  disabled={isProcessing}
                >
                  {isUpdatingDeadline ? 'Hide Deadline' : 'Update Deadline'}
                </Button>

                <Button
                  variant="danger"
                  onClick={() => {
                    setIsCancelling((current) => !current)
                    setIsReassigning(false)
                    setIsUpdatingDeadline(false)
                  }}
                  disabled={isProcessing}
                >
                  {isCancelling ? 'Hide Cancel' : 'Cancel'}
                </Button>
              </div>

              {isReassigning ? (
              <AssignAssignmentForm
                assignmentId={assignment.id}
                onAssign={onReassign}
                isSubmitting={isProcessing}
                submitLabel="Reassign"
                initialEmployeeId={assignment.assignedEmployeeId}
                initialDueAt={assignment.dueAt}
                initialManagerComment={assignment.managerComment || ''}
                mode="reassign"
              />
              ) : null}

              {isUpdatingDeadline ? (
                <UpdateAssignmentDeadlineForm
                  assignmentId={assignment.id}
                  onUpdateDeadline={onUpdateDeadline}
                  isSubmitting={isProcessing}
                />
              ) : null}

              {isCancelling ? (
                <CancelAssignmentForm
                  assignmentId={assignment.id}
                  onCancel={onCancel}
                  isSubmitting={isProcessing}
                />
              ) : null}
            </div>
          ) : null}

          {canReview ? (
            <ManagerAssignmentDecisionForm
              assignmentId={assignment.id}
              onApprove={onApprove}
              onReject={onReject}
              isProcessing={isProcessing}
            />
          ) : null}
        </div>
      ) : null}
    </Card>
  )
}