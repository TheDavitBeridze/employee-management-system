import apiClient from '../../shared/lib/apiClient'

export async function getAllPositions() {
  const response = await apiClient.get('/api/positions')
  return response.data
}

export async function createPosition(payload) {
  const response = await apiClient.post('/api/positions', payload)
  return response.data
}

export async function updatePosition(id, payload) {
  const response = await apiClient.put(`/api/positions/${id}`, payload)
  return response.data
}

export async function deletePosition(id) {
  await apiClient.delete(`/api/positions/${id}`)
}