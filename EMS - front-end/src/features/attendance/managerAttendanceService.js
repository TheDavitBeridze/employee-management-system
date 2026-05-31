import apiClient from '../../shared/lib/apiClient'

export async function getDepartmentAttendanceForManager() {
  const response = await apiClient.get('/api/manager/attendance')
  return response.data
}