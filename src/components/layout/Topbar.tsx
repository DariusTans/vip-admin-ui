import { Moon, Sun, Languages, LogOut, User, Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface TopbarProps {
  onMenuClick?: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const toggleLang = () => {
    const next = i18n.language === 'th' ? 'en' : 'th'
    i18n.changeLanguage(next)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Desktop spacer */}
      <div className="hidden lg:block" />

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Lang toggle */}
        <button
          onClick={toggleLang}
          title={t('topbar.toggleLang')}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors sm:px-3"
        >
          <Languages className="size-4" />
          <span className="hidden sm:inline">{i18n.language === 'th' ? 'EN' : 'TH'}</span>
          <span className="sm:hidden">{i18n.language === 'th' ? 'EN' : 'TH'}</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={t('topbar.toggleTheme')}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        {/* User menu */}
        <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5 sm:px-3 sm:gap-2">
          <User className="size-4 text-muted-foreground" />
          <span className="hidden text-sm text-foreground sm:inline">{user?.name}</span>
          <button
            onClick={handleLogout}
            title={t('auth.logout')}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
