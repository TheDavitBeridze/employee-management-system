import { useState } from 'react'
import Card from '../../shared/ui/Card'
import Button from '../../shared/ui/Button'
import StatusBadge from '../../shared/ui/StatusBadge'

function EmployeeMiniCard({ employee }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">
            {employee.fullName || '--'}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {employee.phone || '--'}
          </p>
        </div>

        {employee.status ? <StatusBadge status={employee.status} /> : null}
      </div>
    </div>
  )
}

function PositionGroup({ group }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
        {group.positionName || 'Unassigned Position'}
      </h4>

      <div className="mt-3 space-y-3">
        {group.employees?.length > 0 ? (
          group.employees.map((employee) => (
            <EmployeeMiniCard
              key={`${group.positionId}-${employee.employeeId}`}
              employee={employee}
            />
          ))
        ) : (
          <p className="text-sm text-slate-600">No employees in this position group.</p>
        )}
      </div>
    </div>
  )
}

export default function OrganizationDepartmentCard({ department }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const manager = department.manager
  const positionGroups = Array.isArray(department.positions)
    ? department.positions
    : []

  const totalEmployees = positionGroups.reduce(
    (count, group) => count + (Array.isArray(group.employees) ? group.employees.length : 0),
    0,
  )

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900">
            {department.departmentName || '--'}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {department.departmentDescription || 'No department description.'}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Manager: {manager?.fullName || 'Not assigned'} • Employees: {totalEmployees}
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
        <div className="mt-4 border-t border-slate-200 pt-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Manager
            </h4>

            {manager ? (
              <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {manager.fullName || '--'}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {manager.positionName || 'Manager'}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {manager.phone || '--'}
                    </p>
                  </div>

                  {manager.status ? <StatusBadge status={manager.status} /> : null}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">
                No manager assigned to this department.
              </p>
            )}
          </div>

          <div className="space-y-4">
            {positionGroups.length > 0 ? (
              positionGroups.map((group) => (
                <PositionGroup
                  key={`${department.departmentId}-${group.positionId}`}
                  group={group}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  No employees grouped under positions yet.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Card>
  )
}