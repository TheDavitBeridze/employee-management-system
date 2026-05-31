import { useEffect, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import ManagerLeaveRequestCard from '../../features/leave-requests/ManagerLeaveRequestCard'
import {
  approveLeaveRequest,
  getPendingLeaveRequestsForManager,
  rejectLeaveRequest,
} from '../../features/leave-requests/managerLeaveRequestService'

export default function ManagerLeaveApprovalsPage() {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadPendingRequests() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getPendingLeaveRequestsForManager()

        if (isMounted) {
          setLeaveRequests(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load pending leave requests.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPendingRequests()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleApprove(id, payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setProcessingId(id)

    try {
      const updatedRequest = await approveLeaveRequest(id, payload)

      setLeaveRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === id ? updatedRequest : request,
        ),
      )

      setSuccessMessage(`Leave request #${id} approved successfully.`)
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to approve leave request.'

      setErrorMessage(serverMessage)
    } finally {
      setProcessingId(null)
    }
  }

  async function handleReject(id, payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setProcessingId(id)

    try {
      const updatedRequest = await rejectLeaveRequest(id, payload)

      setLeaveRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === id ? updatedRequest : request,
        ),
      )

      setSuccessMessage(`Leave request #${id} rejected successfully.`)
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to reject leave request.'

      setErrorMessage(serverMessage)
    } finally {
      setProcessingId(null)
    }
  }

  const pendingRequests = leaveRequests.filter(
    (request) => request.status === 'PENDING',
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Approvals"
        description="Review and process pending employee leave requests."
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
        title="Pending Leave Requests"
        description="Requests awaiting manager approval or rejection."
      >
        {isLoading ? <Loader text="Loading pending leave requests..." /> : null}

        {!isLoading && pendingRequests.length === 0 ? (
          <EmptyState
            title="No pending leave requests"
            description="There are currently no leave requests waiting for your decision."
          />
        ) : null}

        {!isLoading && pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <ManagerLeaveRequestCard
                key={request.id}
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={processingId === request.id}
              />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}