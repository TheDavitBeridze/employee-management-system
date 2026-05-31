import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../../shared/hooks/useAuth'
import { ROUTES } from '../../shared/constants/routes'
import { logoutUser } from '../../features/auth/authService'

export default function AppLayout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  async function handleLogout() {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Backend logout failed:', error)
    } finally {
      logout()
      navigate(ROUTES.LOGIN)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onLogout={handleLogout} />

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}