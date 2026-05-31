import apiClient from '../../shared/lib/apiClient'

export async function getAllEmployees() {
  const response = await apiClient.get('/api/employees')
  return response.data
}

export async function createStaff(payload) {
  const response = await apiClient.post('/api/employees/staff', payload)
  return response.data
}

export async function updateStaff(id, payload) {
  const response = await apiClient.put(`/api/employees/staff/${id}`, payload)
  return response.data
}

export async function deleteStaff(id) {
  await apiClient.delete(`/api/employees/staff/${id}`)
}