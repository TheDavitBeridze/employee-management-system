import apiClient from '../../shared/lib/apiClient'

export async function getAllDepartments() {
  const response = await apiClient.get('/api/departments')
  return response.data
}

export async function createDepartment(payload) {
  const response = await apiClient.post('/api/departments', payload)
  return response.data
}

export async function updateDepartment(id, payload) {
  const response = await apiClient.put(`/api/departments/${id}`, payload)
  return response.data
}

export async function deleteDepartment(id) {
  await apiClient.delete(`/api/departments/${id}`)
}