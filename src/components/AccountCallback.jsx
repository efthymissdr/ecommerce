import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useLang } from '../i18n'
import { useAuth } from '../account/AuthContext'
import { shopText } from '../shopify/text'

// Shopify sends the customer back here after login (/account/callback?code=…&state=…).
export default function AccountCallback() {
  const { t } = useLang()
  const c = shopText[t.code] || shopText.en
  const { completeLogin, login } = useAuth()
  const navigate = useNavigate()
  const [failed, setFailed] = useState(null)
  const once = useRef(false)

  useEffect(() => {
    if (once.current) return // StrictMode runs effects twice; the code can be used only once.
    once.current = true
    completeLogin(window.location.search)
      .then((to) => navigate(to, { replace: true }))
      .catch((e) => { console.error(e); setFailed(e.message) })
  }, [completeLogin, navigate])

  return (
    <main className="grid min-h-[80svh] place-items-center px-5 pt-28 text-center">
      <div>
        <p className="font-display text-4xl text-cream md:text-5xl">{failed ? c.callbackFailed : c.callbackWorking}</p>
        {failed && (
          <button type="button" onClick={() => login()} className="mt-8 inline-flex min-h-12 items-center rounded-full bg-gold px-6 text-sm font-semibold text-espresso hover:bg-crema">{c.tryAgain}</button>
        )}
      </div>
    </main>
  )
}
