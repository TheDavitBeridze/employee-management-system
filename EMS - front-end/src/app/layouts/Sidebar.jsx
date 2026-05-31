import SidebarNavItem from '../../shared/ui/SidebarNavItem'
import { NAVIGATION_BY_ROLE } from '../../shared/constants/navigation'
import { useAuth } from '../../shared/hooks/useAuth'

export default function Sidebar() {
  const { user } = useAuth()

  const role = user?.role ?? null
  const navigationItems = role ? NAVIGATION_BY_ROLE[role] ?? [] : []

  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">EMS</h2>
        <p className="mt-1 text-sm text-slate-500">{role ?? 'Unknown role'}</p>
      </div>

      <nav className="space-y-2 p-4">
        {navigationItems.map((item) => (
          <SidebarNavItem key={item.to} to={item.to} label={item.label} />
        ))}
      </nav>
    </aside>
  )
}