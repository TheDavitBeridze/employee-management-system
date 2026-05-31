const AUTH_STORAGE_KEY = 'ems_auth'

export function saveAuthData(authData) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
}

export function getAuthData() {
  const rawData = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!rawData) {
    return null
  }

  try {
    return JSON.parse(rawData)
  } catch {
    return null
  }
}

export function clearAuthData() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getAccessToken() {
  const authData = getAuthData()
  return authData?.token ?? null
}