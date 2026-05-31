import apiClient from '../../shared/lib/apiClient'

export async function getMyLeaveRequests() {
  const response = await apiClient.get('/api/me/leave-requests')
  return response.data
}

export async function createMyLeaveRequest(payload) {
  const response = await apiClient.post('/api/me/leave-requests', payload)
  return response.data
}

export async function cancelMyLeaveRequest(id) {
  const response = await apiClient.post(`/api/me/leave-requests/${id}/cancel`)
  return response.data
}