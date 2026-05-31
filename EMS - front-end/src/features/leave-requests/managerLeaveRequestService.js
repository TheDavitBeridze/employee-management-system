import apiClient from '../../shared/lib/apiClient'

export async function getPendingLeaveRequestsForManager() {
  const response = await apiClient.get('/api/manager/leave-requests')
  return response.data
}

export async function approveLeaveRequest(id, payload) {
  const response = await apiClient.post(
    `/api/manager/leave-requests/${id}/approve`,
    payload,
  )
  return response.data
}

export async function rejectLeaveRequest(id, payload) {
  const response = await apiClient.post(
    `/api/manager/leave-requests/${id}/reject`,
    payload,
  )
  return response.data
}