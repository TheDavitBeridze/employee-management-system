import { createContext, useEffect, useMemo, useState } from 'react'
import { clearAuthData, getAuthData, saveAuthData } from '../../shared/utils/storage'

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null)
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    const storedAuth = getAuthData()
    setAuth(storedAuth)
    setIsAuthReady(true)
  }, [])

  function login(nextAuthData) {
    saveAuthData(nextAuthData)
    setAuth(nextAuthData)
  }

  function logout() {
    clearAuthData()
    setAuth(null)
  }

  const value = useMemo(
    () => ({
      auth,
      isAuthReady,
      isAuthenticated: Boolean(auth?.token),
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      login,
      logout,
    }),
    [auth, isAuthReady],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}