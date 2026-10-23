import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as service from './service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null)
  const [ready, setReady] = useState(false)
  // Login / sign-up panel: null (closed), 'login' or 'register'.
  const [panel, setPanel] = useState(null)

  useEffect(() => {
    service.getCustomer().then((c) => { setCustomer(c); setReady(true) })
  }, [])

  const login = useCallback(async (data) => { const c = await service.login(data); setCustomer(c); return c }, [])
  const register = useCallback(async (data) => { const c = await service.register(data); setCustomer(c); return c }, [])
  const logout = useCallback(async () => { await service.logout(); setCustomer(null) }, [])
  const saveAddresses = useCallback(async (list) => { const c = await service.saveAddresses(customer.email, list); setCustomer(c) }, [customer])

  const value = useMemo(() => ({
    customer, ready, login, register, logout, saveAddresses,
    requestPasswordReset: service.requestPasswordReset,
    panel, openPanel: (mode = 'login') => setPanel(mode), closePanel: () => setPanel(null),
    points: customer ? customer.pointsHistory.reduce((s, p) => s + p.points, 0) : 0,
  }), [customer, ready, login, register, logout, saveAddresses, panel])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
