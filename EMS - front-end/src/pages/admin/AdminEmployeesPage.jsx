import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import Input from '../../shared/ui/Input'
import AdminEmployeeCard from '../../features/admin/AdminEmployeeCard'
import StaffCreateForm from '../../features/admin/StaffCreateForm'
import {
  createStaff,
  deleteStaff,
  getAllEmployees,
  updateStaff,
} from '../../features/admin/adminEmployeeService'
import { getAllDepartments } from '../../features/admin/adminDepartmentService'
import { getAllPositions } from '../../features/admin/adminPositionService'

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const [employeesData, departmentsData, positionsData] = await Promise.all([
          getAllEmployees(),
          getAllDepartments(),
          getAllPositions(),
        ])

        if (isMounted) {
          setEmployees(Array.isArray(employeesData) ? employeesData : [])
          setDepartments(Array.isArray(departmentsData) ? departmentsData : [])
          setPositions(Array.isArray(positionsData) ? positionsData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load employees.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleCreateStaff(payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsCreating(true)

    try {
      const createdEmployee = await createStaff(payload)

      setEmployees((currentEmployees) => [createdEmployee, ...currentEmployees])
      setSuccessMessage('Staff member created successfully.')
      return true
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to create staff member.'

      setErrorMessage(serverMessage)
      return false
    } finally {
      setIsCreating(false)
    }
  }

  async function handleUpdateStaff(payload) {
    if (!editingEmployee) {
      return false
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsSavingEdit(true)

    try {
      const updatedEmployee = await updateStaff(editingEmployee.id, payload)

      setEmployees((currentEmployees) =>
        currentEmployees.map((employee) =>
          employee.id === editingEmployee.id ? updatedEmployee : employee,
        ),
      )

      setEditingEmployee(null)
      setSuccessMessage('Staff member updated successfully.')
      return true
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to update staff member.'

      setErrorMessage(serverMessage)
      return false
    } finally {
      setIsSavingEdit(false)
    }
  }

  async function handleDeleteStaff(id) {
    setErrorMessage('')
    setSuccessMessage('')
    setDeletingId(id)

    try {
      await deleteStaff(id)

      setEmployees((currentEmployees) =>
        currentEmployees.filter((employee) => employee.id !== id),
      )

      if (editingEmployee?.id === id) {
        setEditingEmployee(null)
      }

      setSuccessMessage('Staff member deleted successfully.')
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to delete staff member.'

      setErrorMessage(serverMessage)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return employees
    }

    return employees.filter((employee) => {
      const fullName =
        `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase()
      const personalNumber = (employee.personalNumber || '').toLowerCase()
      const phone = (employee.phone || '').toLowerCase()
      const departmentName = (employee.departmentName || '').toLowerCase()
      const positionName = (employee.positionName || '').toLowerCase()

      return (
        fullName.includes(normalizedSearch) ||
        personalNumber.includes(normalizedSearch) ||
        phone.includes(normalizedSearch) ||
        departmentName.includes(normalizedSearch) ||
        positionName.includes(normalizedSearch)
      )
    })
  }, [employees, searchTerm])

  const departmentOptions = departments.map((department) => ({
    value: String(department.id),
    label: department.name,
  }))

  const positionOptions = positions.map((position) => ({
    value: String(position.id),
    label: position.name,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Create, update, and manage staff members across the organization."
      />

      {successMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <StaffCreateForm
        mode="create"
        onSubmit={handleCreateStaff}
        isSubmitting={isCreating}
        departmentOptions={departmentOptions}
        positionOptions={positionOptions}
      />

      {editingEmployee ? (
        <StaffCreateForm
          mode="edit"
          initialValues={editingEmployee}
          onSubmit={handleUpdateStaff}
          isSubmitting={isSavingEdit}
          departmentOptions={departmentOptions}
          positionOptions={positionOptions}
          onCancel={() => setEditingEmployee(null)}
        />
      ) : null}

      <PageSection
        title="Employee Directory"
        description="Search and review all employees in the system."
      >
        <div className="mb-4">
          <Input
            label="Search"
            name="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, personal number, phone, department, or position"
          />
        </div>

        {isLoading ? <Loader text="Loading employees..." /> : null}

        {!isLoading && filteredEmployees.length === 0 ? (
          <EmptyState
            title="No employees found"
            description={
              searchTerm
                ? 'No employees matched your search.'
                : 'There are no employee records in the system yet.'
            }
          />
        ) : null}

        {!isLoading && filteredEmployees.length > 0 ? (
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <AdminEmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={setEditingEmployee}
                onDelete={handleDeleteStaff}
                isDeleting={deletingId === employee.id}
              />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}