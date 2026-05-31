import { useEffect, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import EmployeeAssignmentCard from '../../features/assignments/EmployeeAssignmentCard'
import {
  getMyAssignments,
  submitAssignment,
} from '../../features/assignments/employeeAssignmentService'

export default function EmployeeAssignmentsPage() {
  const [assignments, setAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submittingId, setSubmittingId] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadAssignments() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getMyAssignments()

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

  async function handleSubmit(id, payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setSubmittingId(id)

    try {
      const updatedAssignment = await submitAssignment(id, payload)

      setAssignments((currentAssignments) =>
        currentAssignments.map((assignment) =>
          assignment.id === id ? updatedAssignment : assignment,
        ),
      )

      setSuccessMessage(`Assignment #${id} submitted successfully.`)
      return true
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to submit assignment.'

      setErrorMessage(serverMessage)
      return false
    } finally {
      setSubmittingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        description="Review and submit your assigned tasks."
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

      <PageSection
        title="My Assignments"
        description="This section displays your current and past assignments."
      >
        {isLoading ? <Loader text="Loading assignments..." /> : null}

        {!isLoading && assignments.length === 0 ? (
          <EmptyState
            title="No assignments found"
            description="You do not have any assignments yet."
          />
        ) : null}

        {!isLoading && assignments.length > 0 ? (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <EmployeeAssignmentCard
                key={assignment.id}
                assignment={assignment}
                onSubmit={handleSubmit}
                isSubmitting={submittingId === assignment.id}
              />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}