import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import Input from '../../shared/ui/Input'
import PositionForm from '../../features/admin/PositionForm'
import AdminPositionCard from '../../features/admin/AdminPositionCard'
import {
  createPosition,
  deletePosition,
  getAllPositions,
  updatePosition,
} from '../../features/admin/adminPositionService'

export default function AdminPositionsPage() {
  const [positions, setPositions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingPosition, setEditingPosition] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadPositions() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getAllPositions()

        if (isMounted) {
          setPositions(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load positions.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPositions()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleCreate(payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsCreating(true)

    try {
      const createdPosition = await createPosition(payload)

      setPositions((currentPositions) => [
        createdPosition,
        ...currentPositions,
      ])

      setSuccessMessage('Position created successfully.')
      return true
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to create position.'

      setErrorMessage(serverMessage)
      return false
    } finally {
      setIsCreating(false)
    }
  }

  async function handleUpdate(payload) {
    if (!editingPosition) {
      return false
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsSavingEdit(true)

    try {
      const updatedPosition = await updatePosition(editingPosition.id, payload)

      setPositions((currentPositions) =>
        currentPositions.map((position) =>
          position.id === editingPosition.id ? updatedPosition : position,
        ),
      )

      setEditingPosition(null)
      setSuccessMessage('Position updated successfully.')
      return true
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to update position.'

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
      await deletePosition(id)

      setPositions((currentPositions) =>
        currentPositions.filter((position) => position.id !== id),
      )

      if (editingPosition?.id === id) {
        setEditingPosition(null)
      }

      setSuccessMessage('Position deleted successfully.')
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to delete position.'

      setErrorMessage(serverMessage)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredPositions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return positions
    }

    return positions.filter((position) => {
      const name = (position.name || '').toLowerCase()
      const baseSalary = String(position.baseSalary || '').toLowerCase()

      return (
        name.includes(normalizedSearch) ||
        baseSalary.includes(normalizedSearch)
      )
    })
  }, [positions, searchTerm])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Positions"
        description="Create, update, and manage organizational positions."
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

      <PositionForm onSubmit={handleCreate} isSubmitting={isCreating} />

      {editingPosition ? (
        <PositionForm
          mode="edit"
          initialValues={editingPosition}
          onSubmit={handleUpdate}
          isSubmitting={isSavingEdit}
          onCancel={() => setEditingPosition(null)}
        />
      ) : null}

      <PageSection
        title="Position Directory"
        description="Search and review all positions in the system."
      >
        <div className="mb-4">
          <Input
            label="Search"
            name="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by position name or base salary"
          />
        </div>

        {isLoading ? <Loader text="Loading positions..." /> : null}

        {!isLoading && filteredPositions.length === 0 ? (
          <EmptyState
            title="No positions found"
            description={
              searchTerm
                ? 'No positions matched your search.'
                : 'There are no positions in the system yet.'
            }
          />
        ) : null}

        {!isLoading && filteredPositions.length > 0 ? (
          <div className="space-y-4">
            {filteredPositions.map((position) => (
              <AdminPositionCard
                key={position.id}
                position={position}
                onEdit={setEditingPosition}
                onDelete={handleDelete}
                isDeleting={deletingId === position.id}
              />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}