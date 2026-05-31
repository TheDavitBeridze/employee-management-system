import axios from 'axios'
import { getAccessToken, clearAuthData } from '../utils/storage'
import { setSessionNotice } from '../utils/sessionNotice'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const requestUrl = error?.config?.url ?? ''

    const isSensitiveProfileRefreshCase =
      status === 500 &&
      typeof requestUrl === 'string' &&
      requestUrl.includes('/api/me/update-requests')

    if (isSensitiveProfileRefreshCase) {
      clearAuthData()

      setSessionNotice(
        'Your account information was updated. Please sign in again to continue.',
      )

      window.location.replace('/login')
    }

    return Promise.reject(error)
  },
)

export default apiClient