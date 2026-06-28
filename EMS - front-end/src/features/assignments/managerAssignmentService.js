import apiClient from '../../shared/lib/apiClient'

export async function getManagerAssignments() {
  const response = await apiClient.get('/api/manager/assignments')
  return response.data
}

export async function createAssignmentDraft(payload) {
  const response = await apiClient.post('/api/manager/assignments', payload)
  return response.data
}

export async function assignAssignment(id, payload) {
  const response = await apiClient.post(`/api/manager/assignments/${id}/assign`, payload)
  return response.data
}

export async function reassignAssignment(id, payload) {
  const response = await apiClient.put(`/api/manager/assignments/${id}/reassign`, payload)
  return response.data
}

export async function approveAssignment(id, payload) {
  const response = await apiClient.post(`/api/manager/assignments/${id}/approve`, payload)
  return response.data
}

export async function rejectAssignment(id, payload) {
  const response = await apiClient.post(`/api/manager/assignments/${id}/reject`, payload)
  return response.data
}

export async function cancelAssignment(id, payload) {
  const response = await apiClient.post(`/api/manager/assignments/${id}/cancel`, payload)
  return response.data
}

export async function updateAssignmentDeadline(id, payload) {
  const response = await apiClient.put(`/api/manager/assignments/${id}/deadline`, payload)
  return response.data
}

export async function downloadAssignmentSubmissionFile(id) {
  const response = await apiClient.get(`/api/manager/assignments/${id}/file`, {
    responseType: 'blob',
  })

  return response
}

  export async function createAndAssignAssignment(payload) {
  const response = await apiClient.post('/api/manager/assignments/direct', payload)
  return response.data
}
