import { useEffect, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Card from '../../shared/ui/Card'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import { getMyLeaveRequests } from '../../features/leave-requests/leaveRequestService'
import { getMyUpdateRequests } from '../../features/update-requests/updateRequestService'
import { getMyAttendance } from '../../features/attendance/attendanceService'
import { getMyAssignments } from '../../features/assignments/employeeAssignmentService'

function DashboardStatCard({ title, value, helperText }) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helperText}</p>
    </Card>
  )
}

function RecentActivityCard({ title, items, emptyText, renderItem }) {
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

export default function EmployeeDashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    leaveRequests: [],
    updateRequests: [],
    attendanceRecords: [],
    assignments: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const [leaveRequests, updateRequests, attendanceRecords, assignments] =
          await Promise.all([
            getMyLeaveRequests(),
            getMyUpdateRequests(),
            getMyAttendance(),
            getMyAssignments(),
          ])

        if (isMounted) {
          setDashboardData({
            leaveRequests: Array.isArray(leaveRequests) ? leaveRequests : [],
            updateRequests: Array.isArray(updateRequests) ? updateRequests : [],
            attendanceRecords: Array.isArray(attendanceRecords) ? attendanceRecords : [],
            assignments: Array.isArray(assignments) ? assignments : [],
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
          title="Employee Dashboard"
          description="Overview of your profile, attendance, requests, and assignments."
        />

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    )
  }

  const pendingLeaveRequests = dashboardData.leaveRequests.filter(
    (item) => item.status === 'PENDING',
  ).length

  const pendingUpdateRequests = dashboardData.updateRequests.filter(
    (item) => item.status === 'PENDING',
  ).length

  const activeAssignments = dashboardData.assignments.filter(
    (item) =>
      item.status === 'ASSIGNED' ||
      item.status === 'OVERDUE' ||
      item.status === 'SUBMITTED',
  ).length

  const openAttendanceSessions = dashboardData.attendanceRecords.filter(
    (item) => !item.checkOutTime,
  ).length

  const recentAssignments = dashboardData.assignments.slice(0, 3)
  const recentAttendance = dashboardData.attendanceRecords.slice(0, 3)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Dashboard"
        description="Overview of your profile, attendance, requests, and assignments."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardStatCard
          title="Pending Leaves"
          value={pendingLeaveRequests}
          helperText="Leave requests waiting for manager decision."
        />

        <DashboardStatCard
          title="Pending Updates"
          value={pendingUpdateRequests}
          helperText="Profile update requests awaiting review."
        />

        <DashboardStatCard
          title="Active Assignments"
          value={activeAssignments}
          helperText="Assignments currently in progress or under review."
        />

        <DashboardStatCard
          title="Open Attendance"
          value={openAttendanceSessions}
          helperText="Attendance records without check-out yet."
        />
      </div>

      {dashboardData.assignments.length === 0 &&
      dashboardData.attendanceRecords.length === 0 ? (
        <EmptyState
          title="No dashboard activity yet"
          description="Your recent assignments and attendance activity will appear here."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <RecentActivityCard
            title="Recent Assignments"
            items={recentAssignments}
            emptyText="No assignments found."
            renderItem={(item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Status: {item.status}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Due: {formatDate(item.dueAt)}
                </p>
              </div>
            )}
          />

          <RecentActivityCard
            title="Recent Attendance"
            items={recentAttendance}
            emptyText="No attendance records found."
            renderItem={(item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <p className="font-medium text-slate-900">
                  Work Date: {formatDate(item.workDate)}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Check In: {formatDateTime(item.checkInTime)}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Check Out: {formatDateTime(item.checkOutTime)}
                </p>
              </div>
            )}
          />
        </div>
      )}
    </div>
  )
}