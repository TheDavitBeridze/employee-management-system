import { useEffect, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Card from '../../shared/ui/Card'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import { getManagerAssignments } from '../../features/assignments/managerAssignmentService'
import { getDepartmentEmployeesForManager } from '../../features/employees/managerEmployeeService'
import { getDepartmentAttendanceForManager } from '../../features/attendance/managerAttendanceService'

function DashboardStatCard({ title, value, helperText }) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helperText}</p>
    </Card>
  )
}

function CompactListCard({ title, items, emptyText, renderItem }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map(renderItem)}
        </div>
      )}
    </Card>
  )
}

function isToday(dateValue) {
  if (!dateValue) {
    return false
  }

  const date = new Date(dateValue)
  const today = new Date()

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

function formatDateTime(dateValue) {
  if (!dateValue) {
    return '--'
  }

  return new Date(dateValue).toLocaleString()
}

export default function ManagerDashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    assignments: [],
    employees: [],
    attendanceRecords: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const [assignments, employees, attendanceRecords] = await Promise.all([
          getManagerAssignments(),
          getDepartmentEmployeesForManager(),
          getDepartmentAttendanceForManager(),
        ])

        if (isMounted) {
          setDashboardData({
            assignments: Array.isArray(assignments) ? assignments : [],
            employees: Array.isArray(employees) ? employees : [],
            attendanceRecords: Array.isArray(attendanceRecords) ? attendanceRecords : [],
          })
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load dashboard data.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return <Loader text="Loading dashboard..." />
  }

  if (errorMessage) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Manager Dashboard"
          description="Overview of assignments, employees, and attendance activity in your department."
        />

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    )
  }

  const draftAssignments = dashboardData.assignments.filter(
    (item) => item.status === 'DRAFT',
  ).length

  const assignedAssignments = dashboardData.assignments.filter(
    (item) => item.status === 'ASSIGNED' || item.status === 'OVERDUE',
  ).length

  const submittedToday = dashboardData.assignments.filter(
    (item) => item.status === 'SUBMITTED' && isToday(item.submittedAt),
  ).length

  const deadlineToday = dashboardData.assignments.filter(
    (item) =>
      isToday(item.dueAt) &&
      (item.status === 'ASSIGNED' || item.status === 'OVERDUE' || item.status === 'SUBMITTED'),
    ).length

  const activeEmployees = dashboardData.employees.filter(
    (item) => item.status === 'ACTIVE',
  ).length

  const checkedInNow = dashboardData.attendanceRecords.filter(
    (item) => !item.checkOutTime,
  ).length

  const recentSubmittedAssignments = dashboardData.assignments
    .filter((item) => item.status === 'SUBMITTED')
    .slice(0, 4)

  const currentlyCheckedInEmployees = dashboardData.attendanceRecords
    .filter((item) => !item.checkOutTime)
    .slice(0, 4)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manager Dashboard"
        description="Overview of assignments, employees, and attendance activity in your department."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <DashboardStatCard
          title="Draft Assignments"
          value={draftAssignments}
          helperText="Assignments created but not assigned yet."
        />
        <DashboardStatCard
          title="Assigned Assignments"
          value={assignedAssignments}
          helperText="Assignments currently active in the department."
        />
        <DashboardStatCard
          title="Submitted Today"
          value={submittedToday}
          helperText="Assignments submitted for review today."
        />
        <DashboardStatCard
          title="Deadline Today"
          value={deadlineToday}
          helperText="Assignments whose due date is today."
        />
        <DashboardStatCard
          title="Active Employees"
          value={activeEmployees}
          helperText="Employees with ACTIVE status in your department."
        />
        <DashboardStatCard
          title="Checked In Now"
          value={checkedInNow}
          helperText="Employees currently checked in without checkout."
        />
      </div>

      {dashboardData.assignments.length === 0 &&
      dashboardData.employees.length === 0 &&
      dashboardData.attendanceRecords.length === 0 ? (
        <EmptyState
          title="No manager activity yet"
          description="Assignments, employee activity, and attendance summaries will appear here."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <CompactListCard
            title="Recent Submitted Assignments"
            items={recentSubmittedAssignments}
            emptyText="No submitted assignments right now."
            renderItem={(item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Employee: {item.assignedEmployeeName || '--'}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Submitted: {formatDateTime(item.submittedAt)}
                </p>
              </div>
            )}
          />

          <CompactListCard
            title="Currently Checked In"
            items={currentlyCheckedInEmployees}
            emptyText="No employees are currently checked in."
            renderItem={(item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <p className="font-medium text-slate-900">
                  {item.employeeFirstName} {item.employeeLastName}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Department: {item.departmentName || '--'}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Check In: {formatDateTime(item.checkInTime)}
                </p>
              </div>
            )}
          />
        </div>
      )}
    </div>
  )
}