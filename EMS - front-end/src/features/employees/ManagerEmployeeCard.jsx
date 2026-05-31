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
      <p className="mt-1 text-sm text-slate-700">{value || '--'}</p>
    </div>
  )
}

export default function ManagerEmployeeCard({ employee }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {employee.positionName || '--'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={employee.status} />

          <Button
            variant="outline"
            className="px-3 py-2 text-xs"
            onClick={() => setIsExpanded((current) => !current)}
          >
            {isExpanded ? 'Hide' : 'View'}
          </Button>
        </div>
      </div>

      {isExpanded ? (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {renderField('Employee ID', employee.id)}
            {renderField('User ID', employee.userId)}
            {renderField('Personal Number', employee.personalNumber)}
            {renderField('Phone', employee.phone)}
            {renderField('Department', employee.departmentName)}
            {renderField('Position', employee.positionName)}
            {renderField('Hire Date', formatDate(employee.hireDate))}
            {renderField('Birth Date', formatDate(employee.birthDate))}
          </div>
        </div>
      ) : null}
    </Card>
  )
}