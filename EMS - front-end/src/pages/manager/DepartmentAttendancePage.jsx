import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import Input from '../../shared/ui/Input'
import ManagerAttendanceCard from '../../features/attendance/ManagerAttendanceCard'
import { getDepartmentAttendanceForManager } from '../../features/attendance/managerAttendanceService'

export default function DepartmentAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAttendance() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getDepartmentAttendanceForManager()

        if (isMounted) {
          setAttendanceRecords(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load department attendance.'

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

  const filteredAttendance = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return attendanceRecords
    }

    return attendanceRecords.filter((record) => {
      const fullName =
        `${record.employeeFirstName || ''} ${record.employeeLastName || ''}`.toLowerCase()
      const departmentName = (record.departmentName || '').toLowerCase()
      const workDate = (record.workDate || '').toLowerCase()

      return (
        fullName.includes(normalizedSearch) ||
        departmentName.includes(normalizedSearch) ||
        workDate.includes(normalizedSearch)
      )
    })
  }, [attendanceRecords, searchTerm])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Attendance"
        description="Review attendance records for employees in your department."
      />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <PageSection
        title="Attendance Records"
        description="Search and review department attendance records."
      >
        <div className="mb-4">
          <Input
            label="Search"
            name="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by employee name, department, or work date"
          />
        </div>

        {isLoading ? <Loader text="Loading department attendance..." /> : null}

        {!isLoading && filteredAttendance.length === 0 ? (
          <EmptyState
            title="No attendance records found"
            description={
              searchTerm
                ? 'No attendance records matched your search.'
                : 'There are no attendance records for your department yet.'
            }
          />
        ) : null}

        {!isLoading && filteredAttendance.length > 0 ? (
          <div className="space-y-4">
            {filteredAttendance.map((record) => (
              <ManagerAttendanceCard key={record.id} record={record} />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}