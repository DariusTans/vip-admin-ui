import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Users,
  Shield,
  UserCog,
  Clock,
  BookOpen,
  Package,
  Receipt,
  Banknote,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const NAV_ITEMS = [
  { key: 'vms', path: '/vms', icon: Users },
  { key: 'patrol', path: '/patrol', icon: Shield },
  { key: 'hr', path: '/hr', icon: UserCog },
  { key: 'shift', path: '/shift', icon: Clock },
  { key: 'training', path: '/training', icon: BookOpen },
  { key: 'stock', path: '/stock', icon: Package },
  { key: 'billing', path: '/billing', icon: Receipt },
  { key: 'payroll', path: '/payroll', icon: Banknote },
] as const

export function Sidebar() {
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-16 items-center border-b border-sidebar-border px-4', collapsed && 'justify-center px-0')}>
        <LayoutDashboard className="size-6 shrink-0 text-sidebar-primary" />
        {!collapsed && (
          <span className="ml-2 text-sm font-semibold text-sidebar-foreground">
            {t('app.name')}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV_ITEMS.map(({ key, path, icon: Icon }) => (
          <NavLink
            key={key}
            to={path}
            title={collapsed ? t(`nav.${key}`) : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2',
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && <span>{t(`nav.${key}`)}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(p => !p)}
        className="flex h-10 items-center justify-center border-t border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>
    </aside>
  )
}
