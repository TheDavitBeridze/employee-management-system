import { useState } from 'react'
import Card from '../../shared/ui/Card'
import StatusBadge from '../../shared/ui/StatusBadge'
import Button from '../../shared/ui/Button'

function formatDate(dateValue) {
  if (!dateValue) {
    return '--'
  }

  return new Date(dateValue).toLocaleDateString()
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

export default function AdminEmployeeCard({
  employee,
  onEdit,
  onDelete,
  isDeleting,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {employee.departmentName || '--'} • {employee.positionName || '--'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={employee.status} />
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {renderField('Employee ID', employee.id)}
            {renderField('User ID', employee.userId)}
            {renderField('First Name', employee.firstName)}
            {renderField('Last Name', employee.lastName)}
            {renderField('Personal Number', employee.personalNumber)}
            {renderField('Phone', employee.phone)}
            {renderField('Birth Date', formatDate(employee.birthDate))}
            {renderField('Hire Date', formatDate(employee.hireDate))}
            {renderField('Department', employee.departmentName)}
            {renderField('Position', employee.positionName)}
            {renderField('Salary', employee.salary)}
            {renderField('Created At', formatDate(employee.createdAt))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => onEdit(employee)}>
              Edit
            </Button>

            <Button
              variant="danger"
              onClick={() => onDelete(employee.id)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  )
}