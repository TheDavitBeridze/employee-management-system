import apiClient from '../../shared/lib/apiClient'

export async function getOrganizationStructure() {
  const response = await apiClient.get('/api/admin/organization-structure')
  return response.data
}