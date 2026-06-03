import { useEffect, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import CreateAssignmentDraftForm from '../../features/assignments/CreateAssignmentDraftForm'
import ManagerAssignmentCard from '../../features/assignments/ManagerAssignmentCard'
import PageSection from '../../shared/ui/PageSection'
import {
  approveAssignment,
  assignAssignment,
  cancelAssignment,
  createAssignmentDraft,
  downloadAssignmentSubmissionFile,
  getManagerAssignments,
  reassignAssignment,
  rejectAssignment,
  updateAssignmentDeadline,
  createAndAssignAssignment,
} from '../../features/assignments/managerAssignmentService'


export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadAssignments() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getManagerAssignments()

        if (isMounted) {
          setAssignments(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load assignments.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAssignments()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleUpdateDeadline(id, payload) {
  setErrorMessage('')
  setSuccessMessage('')
  setProcessingId(id)

  try {
    const updatedAssignment = await updateAssignmentDeadline(id, payload)

    setAssignments((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === id ? updatedAssignment : assignment,
      ),
    )

    setSuccessMessage(`Assignment #${id} deadline updated successfully.`)
    return true
  } catch (error) {
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Failed to update assignment deadline.'

    setErrorMessage(serverMessage)
    return false
  } finally {
    setProcessingId(null)
  }
}

async function handleCancel(id, payload) {
  setErrorMessage('')
  setSuccessMessage('')
  setProcessingId(id)

  try {
    const updatedAssignment = await cancelAssignment(id, payload)

    setAssignments((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === id ? updatedAssignment : assignment,
      ),
    )

    setSuccessMessage(`Assignment #${id} cancelled successfully.`)
    return true
  } catch (error) {
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Failed to cancel assignment.'

    setErrorMessage(serverMessage)
    return false
  } finally {
    setProcessingId(null)
  }
}

  async function handleCreate(payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsCreating(true)

    try {
      const createdAssignment = await createAssignmentDraft(payload)

      setAssignments((currentAssignments) => [
        createdAssignment,
        ...currentAssignments,
      ])

      setSuccessMessage('Assignment draft created successfully.')
      return true
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to create assignment draft.'

      setErrorMessage(serverMessage)
      return false
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDirect(payload) {
  setErrorMessage('')
  setSuccessMessage('')
  setIsCreating(true)
  try {
    const createdAssignment = await createAndAssignAssignment(payload)
    setAssignments((current) => [createdAssignment, ...current])
    setSuccessMessage('Assignment created and assigned successfully.')
    return true
  } catch (error) {
    setErrorMessage(error?.response?.data?.message || 'Failed to create and assign.')
    return false
  } finally {
    setIsCreating(false)
  }
}

  async function handleAssign(id, payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setProcessingId(id)

    try {
      const updatedAssignment = await assignAssignment(id, payload)

      setAssignments((currentAssignments) =>
        currentAssignments.map((assignment) =>
          assignment.id === id ? updatedAssignment : assignment,
        ),
      )

      setSuccessMessage(`Assignment #${id} assigned successfully.`)
      return true
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to assign assignment.'

      setErrorMessage(serverMessage)
      return false
    } finally {
      setProcessingId(null)
    }
  }

  async function handleReassign(id, payload) {
  setErrorMessage('')
  setSuccessMessage('')
  setProcessingId(id)

  try {
    const updatedAssignment = await reassignAssignment(id, payload)

    setAssignments((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.id === id ? updatedAssignment : assignment,
      ),
    )

    setSuccessMessage(`Assignment #${id} reassigned successfully.`)
    return true
  } catch (error) {
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Failed to reassign assignment.'

    setErrorMessage(serverMessage)
    return false
  } finally {
    setProcessingId(null)
  }
}





  async function handleApprove(id, payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setProcessingId(id)

    try {
      const updatedAssignment = await approveAssignment(id, payload)

      setAssignments((currentAssignments) =>
        currentAssignments.map((assignment) =>
          assignment.id === id ? updatedAssignment : assignment,
        ),
      )

      setSuccessMessage(`Assignment #${id} approved successfully.`)
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to approve assignment.'

      setErrorMessage(serverMessage)
    } finally {
      setProcessingId(null)
    }
  }

  async function handleDownloadFile(id, fileName) {
  setErrorMessage('')
  setSuccessMessage('')

  try {
    const response = await downloadAssignmentSubmissionFile(id)
    const blob = response.data

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName || 'assignment-file'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Failed to download submission file.'

    setErrorMessage(serverMessage)
  }
}



  async function handleReject(id, payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setProcessingId(id)

    try {
      const updatedAssignment = await rejectAssignment(id, payload)

      setAssignments((currentAssignments) =>
        currentAssignments.map((assignment) =>
          assignment.id === id ? updatedAssignment : assignment,
        ),
      )

      setSuccessMessage(`Assignment #${id} rejected successfully.`)
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to reject assignment.'

      setErrorMessage(serverMessage)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        description="Create, assign, and review assignments for your department."
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

      <CreateAssignmentDraftForm
        onSubmitDraft={handleCreate}
        onSubmitDirect={handleDirect}
        isSubmitting={isCreating}
      />

      <PageSection
        title="Department Assignments"
        description="This section displays assignments in your department."
      >
        {isLoading ? <Loader text="Loading assignments..." /> : null}

        {!isLoading && assignments.length === 0 ? (
          <EmptyState
            title="No assignments found"
            description="There are no assignments for your department yet."
          />
        ) : null}

        {!isLoading && assignments.length > 0 ? (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <ManagerAssignmentCard
                key={assignment.id}
                assignment={assignment}
                onAssign={handleAssign}
                onApprove={handleApprove}
                onReject={handleReject}
                onReassign={handleReassign}
                onCancel={handleCancel}
                onUpdateDeadline={handleUpdateDeadline}
                onDownloadFile={handleDownloadFile}
                isProcessing={processingId === assignment.id}
              />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}