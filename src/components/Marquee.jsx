import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, FULL } from '../lib/gsap'
import { Bean } from './Art'

const words = ['Espresso blends', 'Single origins', 'Greek coffee', 'Filter', '100% Arabica', 'Roasted in Greece']

function Row({ outline }) {
  return (
    <div className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className={`px-8 font-display text-5xl italic md:text-7xl ${outline ? 'text-outline' : 'text-cream'}`}>{w}</span>
          <Bean className="w-5 shrink-0 md:w-7" color="#c8a15a" crease="#0f0b08" />
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  const root = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      // Two rows moving in opposite directions; scroll velocity speeds them up and skews them.
      const rows = gsap.utils.toArray('.mq-row')
      const tweens = rows.map((r, i) =>
        gsap.fromTo(r, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 40, ease: 'none', repeat: -1 }))
      const skew = gsap.quickTo(rows, 'skewX', { duration: 0.5, ease: 'power3.out' })
      ScrollTrigger.create({
        trigger: root.current, start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity()
          const boost = 1 + Math.min(Math.abs(v) / 300, 6)
          tweens.forEach((t) => gsap.to(t, { timeScale: boost, duration: 0.2, overwrite: true, onComplete: () => gsap.to(t, { timeScale: 1, duration: 1 }) }))
          skew(gsap.utils.clamp(-8, 8, v / -250))
        },
      })
    })
  }, { scope: root })

  return (
    <section id="marquee" ref={root} className="relative -rotate-2 overflow-hidden border-y border-gold/20 bg-roast py-6 md:py-8" aria-label="What we roast">
      <div className="mq-row flex w-max"><Row /><Row /></div>
      <div className="mq-row mt-4 flex w-max"><Row outline /><Row outline /></div>
    </section>
  )
}
