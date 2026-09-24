import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Collections from './components/Collections'
import Story from './components/Story'
import Process from './components/Process'
import Taste from './components/Taste'
import Footer, { Wholesale } from './components/Footer'

export default function App() {
  const [ready, setReady] = useState(false)
  const [cart, setCart] = useState([])
  const [bump, setBump] = useState(0)

  // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.15, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])

  const add = (p) => {
    setCart((c) => [...c, p.id])
    setBump((b) => b + 1)
  }

  return (
    <div className="grain">
      <a href="#shop" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-espresso">Skip to shop</a>
      <Preloader onDone={() => setReady(true)} />
      <Nav cartCount={cart.length} bump={bump} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Collections onAdd={add} />
        <Story />
        <Process />
        <Taste />
        <Wholesale />
      </main>
      <Footer />
    </div>
  )
}
