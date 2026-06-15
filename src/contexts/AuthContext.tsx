import { createContext, useContext, useState } from 'react'

export type UserRole = 'superadmin' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const MOCK_USERS: (AuthUser & { password: string })[] = [
  { id: '1', name: 'Super Admin', email: 'superadmin@vip.com', password: 'admin1234', role: 'superadmin' },
  { id: '2', name: 'Admin User', email: 'admin@vip.com', password: 'admin1234', role: 'admin' },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem('vip-user')
    return stored ? (JSON.parse(stored) as AuthUser) : null
  })

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600))
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (!found) return false
    const { password: _, ...authUser } = found
    setUser(authUser)
    sessionStorage.setItem('vip-user', JSON.stringify(authUser))
    return true
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('vip-user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
