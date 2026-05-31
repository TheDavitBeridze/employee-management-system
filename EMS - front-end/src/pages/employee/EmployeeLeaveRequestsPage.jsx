import { useEffect, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import LeaveRequestCard from '../../features/leave-requests/LeaveRequestCard'
import CreateLeaveRequestForm from '../../features/leave-requests/CreateLeaveRequestForm'
import {
  cancelMyLeaveRequest,
  createMyLeaveRequest,
  getMyLeaveRequests,
} from '../../features/leave-requests/leaveRequestService'

export default function EmployeeLeaveRequestsPage() {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadLeaveRequests() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getMyLeaveRequests()

        if (isMounted) {
          setLeaveRequests(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load leave requests.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadLeaveRequests()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleCreate(payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsCreating(true)

    try {
      const createdRequest = await createMyLeaveRequest(payload)

      setLeaveRequests((currentRequests) => [createdRequest, ...currentRequests])
      setSuccessMessage('Leave request created successfully.')
      return true
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to create leave request.'

      setErrorMessage(serverMessage)
      return false
    } finally {
      setIsCreating(false)
    }
  }

  async function handleCancel(id) {
    setErrorMessage('')
    setSuccessMessage('')
    setCancellingId(id)

    try {
      const updatedRequest = await cancelMyLeaveRequest(id)

      setLeaveRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === id ? updatedRequest : request,
        ),
      )

      setSuccessMessage('Leave request cancelled successfully.')
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to cancel leave request.'

      setErrorMessage(serverMessage)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Requests"
        description="Review your submitted leave requests and create new ones."
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

      <CreateLeaveRequestForm
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />

      <PageSection
        title="My Leave Requests"
        description="This section displays your leave request history."
      >
        {isLoading ? <Loader text="Loading leave requests..." /> : null}

        {!isLoading && leaveRequests.length === 0 ? (
          <EmptyState
            title="No leave requests found"
            description="You have not submitted any leave requests yet."
          />
        ) : null}

        {!isLoading && leaveRequests.length > 0 ? (
          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <LeaveRequestCard
                key={request.id}
                request={request}
                onCancel={handleCancel}
                isCancelling={cancellingId === request.id}
              />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}