import apiClient from '../../shared/lib/apiClient'

export async function getPendingUpdateRequestsForManager() {
  const response = await apiClient.get('/api/manager/update-requests')
  return response.data
}

export async function approveUpdateRequest(id) {
  const response = await apiClient.post(`/api/manager/update-requests/${id}/approve`)
  return response.data
}

export async function rejectUpdateRequest(id, payload) {
  const response = await apiClient.post(
    `/api/manager/update-requests/${id}/reject`,
    payload,
  )
  return response.data
}