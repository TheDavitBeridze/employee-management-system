import { useEffect, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import AttendanceCard from '../../features/attendance/AttendanceCard'
import { getMyAttendance } from '../../features/attendance/attendanceService'

export default function EmployeeAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAttendance() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getMyAttendance()

        if (isMounted) {
          setAttendanceRecords(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load attendance records.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAttendance()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Review your attendance history, check-in times, and check-out times."
      />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <PageSection
        title="My Attendance Records"
        description="This section displays your attendance history."
      >
        {isLoading ? <Loader text="Loading attendance records..." /> : null}

        {!isLoading && attendanceRecords.length === 0 ? (
          <EmptyState
            title="No attendance records found"
            description="You do not have any attendance records yet."
          />
        ) : null}

        {!isLoading && attendanceRecords.length > 0 ? (
          <div className="space-y-4">
            {attendanceRecords.map((record) => (
              <AttendanceCard key={record.id} record={record} />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}