import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import Input from '../../shared/ui/Input'
import DepartmentForm from '../../features/admin/DepartmentForm'
import AdminDepartmentCard from '../../features/admin/AdminDepartmentCard'
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  updateDepartment,
} from '../../features/admin/adminDepartmentService'

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDepartments() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getAllDepartments()

        if (isMounted) {
          setDepartments(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load departments.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDepartments()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleCreate(payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsCreating(true)

    try {
      const createdDepartment = await createDepartment(payload)

      setDepartments((currentDepartments) => [
        createdDepartment,
        ...currentDepartments,
      ])

      setSuccessMessage('Department created successfully.')
      return true
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to create department.'

      setErrorMessage(serverMessage)
      return false
    } finally {
      setIsCreating(false)
    }
  }

  async function handleUpdate(payload) {
    if (!editingDepartment) {
      return false
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsSavingEdit(true)

    try {
      const updatedDepartment = await updateDepartment(editingDepartment.id, payload)

      setDepartments((currentDepartments) =>
        currentDepartments.map((department) =>
          department.id === editingDepartment.id ? updatedDepartment : department,
        ),
      )

      setEditingDepartment(null)
      setSuccessMessage('Department updated successfully.')
      return true
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to update department.'

      setErrorMessage(serverMessage)
      return false
    } finally {
      setIsSavingEdit(false)
    }
  }

  async function handleDelete(id) {
    setErrorMessage('')
    setSuccessMessage('')
    setDeletingId(id)

    try {
      await deleteDepartment(id)

      setDepartments((currentDepartments) =>
        currentDepartments.filter((department) => department.id !== id),
      )

      if (editingDepartment?.id === id) {
        setEditingDepartment(null)
      }

      setSuccessMessage('Department deleted successfully.')
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to delete department.'

      setErrorMessage(serverMessage)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredDepartments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return departments
    }

    return departments.filter((department) => {
      const name = (department.name || '').toLowerCase()
      const description = (department.description || '').toLowerCase()

      return (
        name.includes(normalizedSearch) ||
        description.includes(normalizedSearch)
      )
    })
  }, [departments, searchTerm])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Create, update, and manage organizational departments."
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

      <DepartmentForm onSubmit={handleCreate} isSubmitting={isCreating} />

      {editingDepartment ? (
        <DepartmentForm
          mode="edit"
          initialValues={editingDepartment}
          onSubmit={handleUpdate}
          isSubmitting={isSavingEdit}
          onCancel={() => setEditingDepartment(null)}
        />
      ) : null}

      <PageSection
        title="Department Directory"
        description="Search and review all departments in the system."
      >
        <div className="mb-4">
          <Input
            label="Search"
            name="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by department name or description"
          />
        </div>

        {isLoading ? <Loader text="Loading departments..." /> : null}

        {!isLoading && filteredDepartments.length === 0 ? (
          <EmptyState
            title="No departments found"
            description={
              searchTerm
                ? 'No departments matched your search.'
                : 'There are no departments in the system yet.'
            }
          />
        ) : null}

        {!isLoading && filteredDepartments.length > 0 ? (
          <div className="space-y-4">
            {filteredDepartments.map((department) => (
              <AdminDepartmentCard
                key={department.id}
                department={department}
                onEdit={setEditingDepartment}
                onDelete={handleDelete}
                isDeleting={deletingId === department.id}
              />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}