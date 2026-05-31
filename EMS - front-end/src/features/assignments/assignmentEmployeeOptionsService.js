import apiClient from '../../shared/lib/apiClient'

export async function getManagerDepartmentEmployees() {
  const response = await apiClient.get('/api/employees/manager/department-employees')
  return response.data
}