import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as demo from './service'
import * as shopifyAccount from '../shopify/customer'
import { shopify, customerLoginAvailable } from '../shopify/config'
import { useLang } from '../i18n'

const AuthContext = createContext(null)

// Shopify customer accounts on the live (https) site; the browser-only demo
// account otherwise (local development, or with VITE_SHOPIFY=off).
const useShopify = shopify.enabled && customerLoginAvailable()

export function AuthProvider({ children }) {
  const { lang } = useLang()
  const [customer, setCustomer] = useState(null)
  const [ready, setReady] = useState(false)
  // Login / sign-up panel: null (closed), 'login' or 'register'.
  const [panel, setPanel] = useState(null)

  useEffect(() => {
    const load = useShopify
      ? (shopifyAccount.isLoggedIn() ? shopifyAccount.getCustomer() : Promise.resolve(null))
      : demo.getCustomer()
    load.catch((e) => { console.error(e); return null }).then((c) => { setCustomer(c); setReady(true) })
  }, [])

  // With Shopify, login and sign-up are the same hosted page (email + one-time code).
  const login = useCallback(async (data) => {
    if (useShopify) return shopifyAccount.login({ returnTo: window.location.pathname.startsWith('/account') ? '/account' : window.location.pathname, lang })
    const c = await demo.login(data); setCustomer(c); return c
  }, [lang])
  const register = useCallback(async (data) => {
    if (useShopify) return shopifyAccount.login({ lang })
    const c = await demo.register(data); setCustomer(c); return c
  }, [lang])
  const completeLogin = useCallback(async (search) => {
    const to = await shopifyAccount.handleCallback(search)
    setCustomer(await shopifyAccount.getCustomer())
    return to
  }, [])
  const logout = useCallback(async () => {
    setCustomer(null)
    await (useShopify ? shopifyAccount.logout() : demo.logout())
  }, [])
  const saveAddresses = useCallback(async (list) => {
    const c = useShopify
      ? await shopifyAccount.saveAddresses(customer.addresses, list)
      : await demo.saveAddresses(customer.email, list)
    setCustomer(c)
  }, [customer])

  const value = useMemo(() => ({
    customer, ready, login, register, logout, saveAddresses, completeLogin,
    mode: useShopify ? 'shopify' : 'demo',
    requestPasswordReset: demo.requestPasswordReset,
    panel, openPanel: (mode = 'login') => setPanel(mode), closePanel: () => setPanel(null),
    points: customer ? customer.pointsHistory.reduce((s, p) => s + p.points, 0) : 0,
  }), [customer, ready, login, register, logout, saveAddresses, completeLogin, panel])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
