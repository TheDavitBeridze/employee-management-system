import apiClient from '../../shared/lib/apiClient'

export async function getMyAssignments() {
  const response = await apiClient.get('/api/me/assignments')
  return response.data
}

export async function submitAssignment(id, payload) {
  const formData = new FormData()

  formData.append(
    'data',
    new Blob(
      [
        JSON.stringify({
          submissionComment: payload.submissionComment,
          submissionLink: payload.submissionLink,
        }),
      ],
      { type: 'application/json' },
    ),
  )

  if (payload.submissionFile) {
    formData.append('file', payload.submissionFile)
  }

  const response = await apiClient.post(`/api/me/assignments/${id}/submit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}