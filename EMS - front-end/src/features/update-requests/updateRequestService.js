import apiClient from '../../shared/lib/apiClient'

export async function getMyUpdateRequests() {
  const response = await apiClient.get('/api/me/update-requests')
  return response.data
}

export async function createMyUpdateRequest(payload) {
  const response = await apiClient.post('/api/me/update-requests', payload)
  return response.data
}