import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { Bean } from './Art'

export default function Preloader({ onDone }) {
  const root = useRef(null)
  const count = useRef(null)

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { gsap.set(root.current, { autoAlpha: 0 }); onDone(); return }

    const n = { v: 0 }
    const tl = gsap.timeline({ onComplete: () => gsap.set(root.current, { display: 'none' }) })
    tl.from('.pl-bean', { scale: 0, rotate: -120, duration: 0.8, ease: 'back.out(2)' })
      .to(n, {
        v: 100, duration: 1.6, ease: 'power2.inOut',
        onUpdate: () => { count.current.textContent = String(Math.round(n.v)).padStart(3, '0') },
      }, '<')
      .to('.pl-bar', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, '<')
      .to('.pl-bean', { rotate: 360, duration: 1.6, ease: 'power2.inOut' }, '<')
      .to('.pl-inner', { y: -40, autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
      .add(onDone, '-=0.1')
      .to('.pl-panel', { yPercent: -100, duration: 1, stagger: 0.08, ease: 'expo.inOut' }, '-=0.2')
  }, { scope: root })

  return (
    <div ref={root} className="fixed inset-0 z-[100]" aria-hidden="true">
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3].map((i) => <div key={i} className="pl-panel h-full flex-1 bg-roast" />)}
      </div>
      <div className="pl-inner absolute inset-0 flex flex-col items-center justify-center gap-6">
        <Bean className="pl-bean w-10" color="#c8a15a" crease="#1c1917" />
        <p className="font-display text-4xl tracking-[0.3em] text-cream">FUERTE</p>
        <div className="h-px w-48 bg-cream/15">
          <div className="pl-bar h-full origin-left scale-x-0 bg-gold" />
        </div>
        <p ref={count} className="font-sans text-xs tabular-nums tracking-[0.4em] text-muted">000</p>
      </div>
    </div>
  )
}
