import { useState } from 'react'
import Card from '../../shared/ui/Card'
import Button from '../../shared/ui/Button'

function formatDateTime(dateValue) {
  if (!dateValue) {
    return '--'
  }

  return new Date(dateValue).toLocaleString()
}

export default function AdminDepartmentCard({
  department,
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
            {department.name}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {department.description || 'No description'}
          </p>
        </div>

        <div className="flex items-center gap-3">
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
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Department ID
              </p>
              <p className="mt-1 text-sm text-slate-700">{department.id}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created At
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {formatDateTime(department.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => onEdit(department)}>
              Edit
            </Button>

            <Button
              variant="danger"
              onClick={() => onDelete(department.id)}
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