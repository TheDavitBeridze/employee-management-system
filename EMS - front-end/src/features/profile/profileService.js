import apiClient from '../../shared/lib/apiClient'

export async function getMyProfile() {
  const response = await apiClient.get('/api/me/profile')
  return response.data
}