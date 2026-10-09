import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from './en'
import el from './el'

const dictionaries = { en, el }
export const languages = [
  { id: 'en', short: 'EN', name: 'English' },
  { id: 'el', short: 'ΕΛ', name: 'Ελληνικά' },
]

const LangContext = createContext(null)

function initialLang() {
  try {
    const saved = localStorage.getItem('fuerte-lang')
    if (saved in dictionaries) return saved
  } catch { /* storage unavailable */ }
  return navigator.language?.toLowerCase().startsWith('el') ? 'el' : 'en'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang)
  const t = dictionaries[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    try { localStorage.setItem('fuerte-lang', lang) } catch { /* storage unavailable */ }
  }, [lang, t])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
