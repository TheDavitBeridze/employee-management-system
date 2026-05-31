import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import Input from '../../shared/ui/Input'
import OrganizationDepartmentCard from '../../features/admin/OrganizationDepartmentCard'
import { getOrganizationStructure } from '../../features/admin/adminOrganizationStructureService'

export default function OrganizationStructurePage() {
  const [structure, setStructure] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadStructure() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getOrganizationStructure()

        if (isMounted) {
          setStructure(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load organization structure.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadStructure()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredStructure = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return structure
    }

    return structure.filter((department) => {
      const departmentName = (department.departmentName || '').toLowerCase()
      const departmentDescription = (department.departmentDescription || '').toLowerCase()
      const managerName = (department.manager?.fullName || '').toLowerCase()

      const matchesTopLevel =
        departmentName.includes(normalizedSearch) ||
        departmentDescription.includes(normalizedSearch) ||
        managerName.includes(normalizedSearch)

      if (matchesTopLevel) {
        return true
      }

      return (department.positions || []).some((group) => {
        const positionName = (group.positionName || '').toLowerCase()

        if (positionName.includes(normalizedSearch)) {
          return true
        }

        return (group.employees || []).some((employee) => {
          const fullName = (employee.fullName || '').toLowerCase()
          const phone = (employee.phone || '').toLowerCase()

          return (
            fullName.includes(normalizedSearch) ||
            phone.includes(normalizedSearch)
          )
        })
      })
    })
  }, [structure, searchTerm])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Structure"
        description="Review departments, managers, and employees grouped by position."
      />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <PageSection
        title="Department Structure"
        description="Search and review the organization hierarchy."
      >
        <div className="mb-4">
          <Input
            label="Search"
            name="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by department, manager, employee, position, or phone"
          />
        </div>

        {isLoading ? <Loader text="Loading organization structure..." /> : null}

        {!isLoading && filteredStructure.length === 0 ? (
          <EmptyState
            title="No departments found"
            description={
              searchTerm
                ? 'No organization records matched your search.'
                : 'There is no organization structure data available yet.'
            }
          />
        ) : null}

        {!isLoading && filteredStructure.length > 0 ? (
          <div className="space-y-4">
            {filteredStructure.map((department) => (
              <OrganizationDepartmentCard
                key={department.departmentId}
                department={department}
              />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}