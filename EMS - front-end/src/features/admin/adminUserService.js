import apiClient from '../../shared/lib/apiClient'

export async function getAllUsers() {
  const response = await apiClient.get('/api/users')
  return response.data
}