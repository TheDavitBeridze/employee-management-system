import { useEffect, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import Loader from '../../shared/ui/Loader'
import EmptyState from '../../shared/ui/EmptyState'
import PageSection from '../../shared/ui/PageSection'
import UpdateRequestCard from '../../features/update-requests/UpdateRequestCard'
import CreateUpdateRequestForm from '../../features/update-requests/CreateUpdateRequestForm'
import {
  createMyUpdateRequest,
  getMyUpdateRequests,
} from '../../features/update-requests/updateRequestService'

export default function EmployeeUpdateRequestsPage() {
  const [updateRequests, setUpdateRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadUpdateRequests() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const responseData = await getMyUpdateRequests()

        if (isMounted) {
          setUpdateRequests(Array.isArray(responseData) ? responseData : [])
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to load update requests.'

        if (isMounted) {
          setErrorMessage(serverMessage)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadUpdateRequests()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleCreate(payload) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsCreating(true)

    try {
      const createdRequest = await createMyUpdateRequest(payload)

      setUpdateRequests((currentRequests) => [createdRequest, ...currentRequests])
      setSuccessMessage('Update request created successfully.')
      return true
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to create update request.'

      setErrorMessage(serverMessage)
      return false
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Requests"
        description="Submit and review your personal profile update requests."
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

      <CreateUpdateRequestForm
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />

      <PageSection
        title="My Update Requests"
        description="This section displays your submitted profile update requests."
      >
        {isLoading ? <Loader text="Loading update requests..." /> : null}

        {!isLoading && updateRequests.length === 0 ? (
          <EmptyState
            title="No update requests found"
            description="You have not submitted any update requests yet."
          />
        ) : null}

        {!isLoading && updateRequests.length > 0 ? (
          <div className="space-y-4">
            {updateRequests.map((request) => (
              <UpdateRequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  )
}