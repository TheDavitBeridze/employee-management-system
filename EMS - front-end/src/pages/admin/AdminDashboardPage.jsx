import { useEffect, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Card from '../../shared/ui/Card'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import StatusBadge from '../../shared/ui/StatusBadge'
import { getAllUsers } from '../../features/admin/adminUserService'
import { getAllEmployees } from '../../features/admin/adminEmployeeService'
import { getAllDepartments } from '../../features/admin/adminDepartmentService'
import { getAllPositions } from '../../features/admin/adminPositionService'
import { getAdminAttendance } from '../../features/admin/adminAttendanceService'
import { getAuditLogs } from '../../features/admin/adminAuditLogService'

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
        <div className="mt-4 space-y-3">{items.map(renderItem)}</div>
      )}
    </Card>
  )
}

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

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    users: [],
    employees: [],
    departments: [],
    positions: [],
    attendance: [],
    auditLogs: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const [users, employees, departments, positions, attendance, auditLogs] =
          await Promise.all([
            getAllUsers(),
            getAllEmployees(),
            getAllDepartments(),
            getAllPositions(),
            getAdminAttendance(),
            getAuditLogs(),
          ])

        if (isMounted) {
          setDashboardData({
            users: Array.isArray(users) ? users : [],
            employees: Array.isArray(employees) ? employees : [],
            departments: Array.isArray(departments) ? departments : [],
            positions: Array.isArray(positions) ? positions : [],
            attendance: Array.isArray(attendance) ? attendance : [],
            auditLogs: Array.isArray(auditLogs) ? auditLogs : [],
          })
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load admin dashboard data.'

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
    return <Loader text="Loading admin dashboard..." />
  }

  if (errorMessage) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Admin Dashboard"
          description="System overview, organization structure, and recent operational activity."
        />
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    )
  }

  const totalUsers = dashboardData.users.length
  const totalEmployees = dashboardData.employees.length
  const activeEmployees = dashboardData.employees.filter(
    (item) => item.status === 'ACTIVE',
  ).length
  const totalDepartments = dashboardData.departments.length
  const totalPositions = dashboardData.positions.length
  const openAttendanceSessions = dashboardData.attendance.filter(
    (item) => !item.checkOutTime,
  ).length

  const recentEmployees = dashboardData.employees.slice(0, 4)
  const recentAuditLogs = dashboardData.auditLogs.slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="System overview, organization structure, and recent operational activity."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <DashboardStatCard
          title="Total Users"
          value={totalUsers}
          helperText="All system user accounts."
        />
        <DashboardStatCard
          title="Total Employees"
          value={totalEmployees}
          helperText="All employee records in the system."
        />
        <DashboardStatCard
          title="Active Employees"
          value={activeEmployees}
          helperText="Employees currently marked as ACTIVE."
        />
        <DashboardStatCard
          title="Departments"
          value={totalDepartments}
          helperText="Organizational departments configured."
        />
        <DashboardStatCard
          title="Positions"
          value={totalPositions}
          helperText="Available employee positions in the system."
        />
        <DashboardStatCard
          title="Open Attendance Sessions"
          value={openAttendanceSessions}
          helperText="Attendance records without checkout yet."
        />
      </div>

      {dashboardData.employees.length === 0 &&
      dashboardData.auditLogs.length === 0 ? (
        <EmptyState
          title="No admin activity yet"
          description="Recent employees and audit activity will appear here."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <CompactListCard
            title="Managers"
            items={recentEmployees}
            emptyText="No employees found."
            renderItem={(item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <p className="font-medium text-slate-900">
                  {item.firstName} {item.lastName}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Department: {item.departmentName || '--'}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Position: {item.positionName || '--'}
                </p>
              </div>
            )}
          />

          <CompactListCard
            title="Recent Audit Logs"
            items={recentAuditLogs}
            emptyText="No audit logs found."
            renderItem={(item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">
                    {buildAuditHeadline(item)}
                  </p>
                  <StatusBadge status={item.action} />
                </div>

                <p className="mt-2 text-sm text-slate-800">
                  {item.details || 'No additional details provided.'}
                </p>

                <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p>
                    <span className="font-medium text-slate-700">Actor:</span>{' '}
                    {item.actorEmail || '--'}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Entity:</span>{' '}
                    {item.entityType || '--'}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Entity ID:</span>{' '}
                    {item.entityId ?? '--'}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Time:</span>{' '}
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  )
}