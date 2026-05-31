import apiClient from '../../shared/lib/apiClient'

export async function getAuditLogs() {
  const response = await apiClient.get('/api/audit-logs')
  return response.data
}