import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useLang } from '../i18n'
import { ArrowUp } from './Art'

// Round "back to top" button, bottom right. Appears once the visitor has
// scrolled past the first screen; a CSS transition keeps it cheap.
export default function ToTop({ onClick }) {
  const { t } = useLang()
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const check = () => setShow(window.scrollY > window.innerHeight * 0.8)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  // On phones the product page has a sticky add-to-cart bar at the bottom; sit above it.
  const raised = pathname.startsWith('/products/') ? 'max-lg:bottom-24' : ''

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t.nav.toTop}
      title={t.nav.toTop}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`group fixed bottom-5 right-4 z-40 grid size-12 place-items-center rounded-full border border-gold/40 bg-roast/90 text-gold shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] backdrop-blur-md transition-all duration-500 ease-expo hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-espresso md:bottom-8 md:right-8 md:size-14 ${raised} ${show ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-6 scale-75 opacity-0'}`}
    >
      <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 md:size-6" />
    </button>
  )
}
