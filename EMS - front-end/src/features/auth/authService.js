import apiClient from '../../shared/lib/apiClient'

export async function loginUser(payload) {
  const response = await apiClient.post('/auth/login', payload)
  return response.data
}

export async function logoutUser() {
  const response = await apiClient.post('/auth/logout')
  return response.data
}