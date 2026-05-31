import { useAuth } from '../../shared/hooks/useAuth'

export default function Topbar({ onLogout }) {
  const { user } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">EMS Portal</h1>
        <p className="text-sm text-slate-500">{user?.email ?? 'Authenticated user'}</p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Logout
      </button>
    </header>
  )
}