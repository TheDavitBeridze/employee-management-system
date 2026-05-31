import apiClient from '../../shared/lib/apiClient'

export async function getAdminAttendance() {
  const response = await apiClient.get('/api/admin/attendance')
  return response.data
}