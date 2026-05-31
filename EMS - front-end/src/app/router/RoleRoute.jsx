import { Navigate } from 'react-router-dom'
import { useAuth } from '../../shared/hooks/useAuth'
import { ROUTES } from '../../shared/constants/routes'

export default function RoleRoute({ allowedRoles, children }) {
  const { isAuthReady, isAuthenticated, user } = useAuth()

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Loading session...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return children
}