import { Moon, Sun, Languages, LogOut, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export function Topbar() {
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
      <div />

      <div className="flex items-center gap-2">
        {/* Lang toggle */}
        <button
          onClick={toggleLang}
          title={t('topbar.toggleLang')}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Languages className="size-4" />
          <span>{i18n.language === 'th' ? 'EN' : 'TH'}</span>
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
        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5">
          <User className="size-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{user?.name}</span>
          <button
            onClick={handleLogout}
            title={t('auth.logout')}
            className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
