import apiClient from '../../shared/lib/apiClient'

export async function getMyAttendance() {
  const response = await apiClient.get('/api/me/attendance')
  return response.data
}