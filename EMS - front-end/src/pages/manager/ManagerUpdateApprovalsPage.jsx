import { useEffect, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import ManagerUpdateRequestCard from '../../features/update-requests/ManagerUpdateRequestCard'
import {
  approveUpdateRequest,
  getPendingUpdateRequestsForManager,
  rejectUpdateRequest,
} from '../../features/update-requests/managerUpdateRequestService'

export default function ManagerUpdateApprovalsPage() {
  const [updateRequests, setUpdateRequests] = useState([])
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
        const responseData = await getPendingUpdateRequestsForManager()

        if (isMounted) {
          setUpdateRequests(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load pending update requests.'

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

  async function handleApprove(id) {
    setErrorMessage('')
    setSuccessMessage('')
    setProcessingId(id)

    try {
      const updatedRequest = await approveUpdateRequest(id)

      setUpdateRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === id ? updatedRequest : request,
        ),
      )

      setSuccessMessage(`Update request #${id} approved successfully.`)
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to approve update request.'

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
      const updatedRequest = await rejectUpdateRequest(id, payload)

      setUpdateRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === id ? updatedRequest : request,
        ),
      )

      setSuccessMessage(`Update request #${id} rejected successfully.`)
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to reject update request.'

      setErrorMessage(serverMessage)
    } finally {
      setProcessingId(null)
    }
  }

  const pendingRequests = updateRequests.filter(
    (request) => request.status === 'PENDING',
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Approvals"
        description="Review and process pending employee profile update requests."
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
        title="Pending Update Requests"
        description="Requests awaiting manager approval or rejection."
      >
        {isLoading ? <Loader text="Loading pending update requests..." /> : null}

        {!isLoading && pendingRequests.length === 0 ? (
          <EmptyState
            title="No pending update requests"
            description="There are currently no update requests waiting for your decision."
          />
        ) : null}

        {!isLoading && pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <ManagerUpdateRequestCard
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