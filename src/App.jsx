import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Lenis from 'lenis'
import { Routes, Route, useLocation } from 'react-router'
import { gsap, ScrollTrigger } from './lib/gsap'
import { useLang, languages } from './i18n'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import ScrollProgress from './components/ScrollProgress'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Collections from './components/Collections'
import Story from './components/Story'
import Process from './components/Process'
import Quiz from './components/Quiz'
import Footer, { Wholesale } from './components/Footer'
// Loaded on demand so the home page bundle stays small.
const ProductPage = lazy(() => import('./components/ProductPage'))

export default function App() {
  const { lang, setLang, t } = useLang()
  const [ready, setReady] = useState(false)
  const [cart, setCart] = useState([])
  const [bump, setBump] = useState(0)
  // Lives here so quiz progress survives a language switch.
  const [quiz, setQuiz] = useState({ step: -1, answers: [], pick: null })
  const lenis = useRef(null)
  const curtain = useRef(null)
  const switching = useRef(false)

  // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ duration: 1.15, anchors: true })
    lenis.current = l
    l.on('scroll', ScrollTrigger.update)
    const raf = (time) => l.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); l.destroy(); lenis.current = null }
  }, [])

  // Re-measure scroll-driven animations whenever the page height changes
  // (a lazily loaded route, fonts, a language switch), so triggers like the
  // nav's hide/show keep covering the whole page.
  useEffect(() => {
    let timer
    let last = document.body.scrollHeight
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight
      if (Math.abs(h - last) < 2) return
      last = h
      clearTimeout(timer)
      timer = setTimeout(() => { ScrollTrigger.refresh(); lenis.current?.resize() }, 150)
    })
    ro.observe(document.body)
    return () => { ro.disconnect(); clearTimeout(timer) }
  }, [])

  // Cart lines carry the chosen variant; quick-adds from the grid use the defaults.
  // TODO(shopify): replace with a Storefront API cart.
  const add = (p, opts = {}) => {
    setCart((c) => [...c, { id: p.id, qty: 1, ...opts }])
    setBump((b) => b + 1)
  }
  const cartCount = cart.reduce((n, line) => n + line.qty, 0)

  // On navigation: jump to the top, or to the #section in the URL once the
  // new page has mounted, then re-measure scroll-driven animations.
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const to = (y) => (lenis.current ? lenis.current.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y))
    to(0)
    const id = setTimeout(() => {
      ScrollTrigger.refresh()
      const el = hash && document.querySelector(hash)
      if (el) to(el.getBoundingClientRect().top + window.scrollY)
    }, 120)
    return () => clearTimeout(id)
  }, [pathname, hash])

  // Swap language behind a curtain: the page content remounts in the new
  // language, scroll-driven animations are re-measured, and the scroll
  // position is restored before the curtain lifts.
  const switchLang = (next) => {
    if (next === lang || switching.current) return
    const y = window.scrollY
    const apply = () => {
      flushSync(() => setLang(next))
      ScrollTrigger.refresh()
      if (lenis.current) lenis.current.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo(0, y)
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return }

    switching.current = true
    curtain.current.querySelector('.lc-label').textContent = languages.find((l) => l.id === next).name
    gsap.timeline({ onComplete: () => { switching.current = false } })
      .set(curtain.current, { display: 'flex', yPercent: 100 })
      .to(curtain.current, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' })
      .from('.lc-label', { yPercent: 110, duration: 0.6, ease: 'expo.out' }, '-=0.25')
      .add(apply)
      .to('.lc-label', { yPercent: -110, duration: 0.45, ease: 'expo.in' }, '+=0.15')
      .to(curtain.current, { yPercent: -100, duration: 0.7, ease: 'expo.inOut' }, '-=0.1')
      .set(curtain.current, { display: 'none' })
  }

  return (
    <div className="grain">
      <a href="#shop" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-espresso">{t.nav.skip}</a>
      <Preloader onDone={() => setReady(true)} />
      <div ref={curtain} className="fixed inset-0 z-[95] hidden items-center justify-center bg-roast" aria-hidden="true">
        <span className="overflow-hidden"><span className="lc-label block font-display text-6xl italic text-gold md:text-8xl" /></span>
      </div>
      <ScrollProgress />
      <Nav cartCount={cartCount} bump={bump} onLang={switchLang} />
      <div key={lang} className="overflow-x-clip">
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <Hero ready={ready} />
                <Marquee />
                <Quiz quiz={quiz} setQuiz={setQuiz} onAdd={add} />
                <Collections onAdd={add} />
                <Story />
                <Process />
                <Wholesale />
              </main>
            }
          />
          <Route path="/products/:id" element={<Suspense fallback={<div className="min-h-svh" />}><ProductPage onAdd={add} /></Suspense>} />
        </Routes>
        <Footer />
      </div>
    </div>
  )
}
