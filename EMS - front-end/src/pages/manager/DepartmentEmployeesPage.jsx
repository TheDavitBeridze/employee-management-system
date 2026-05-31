import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import Input from '../../shared/ui/Input'
import ManagerEmployeeCard from '../../features/employees/ManagerEmployeeCard'
import { getDepartmentEmployeesForManager } from '../../features/employees/managerEmployeeService'

export default function DepartmentEmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadEmployees() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getDepartmentEmployeesForManager()

        if (isMounted) {
          setEmployees(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load department employees.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadEmployees()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return employees
    }

    return employees.filter((employee) => {
      const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase()
      const personalNumber = (employee.personalNumber || '').toLowerCase()
      const phone = (employee.phone || '').toLowerCase()
      const positionName = (employee.positionName || '').toLowerCase()

      return (
        fullName.includes(normalizedSearch) ||
        personalNumber.includes(normalizedSearch) ||
        phone.includes(normalizedSearch) ||
        positionName.includes(normalizedSearch)
      )
    })
  }, [employees, searchTerm])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Employees"
        description="Review employees assigned to your department."
      />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <PageSection
        title="Employee Directory"
        description="Search and review employees in your department."
      >
        <div className="mb-4">
          <Input
            label="Search"
            name="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, personal number, phone, or position"
          />
        </div>

        {isLoading ? <Loader text="Loading department employees..." /> : null}

        {!isLoading && filteredEmployees.length === 0 ? (
          <EmptyState
            title="No employees found"
            description={
              searchTerm
                ? 'No employees matched your search.'
                : 'There are no employees assigned to your department.'
            }
          />
        ) : null}

        {!isLoading && filteredEmployees.length > 0 ? (
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <ManagerEmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}