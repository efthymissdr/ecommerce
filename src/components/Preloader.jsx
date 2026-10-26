import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

export default function Preloader({ onDone }) {
  const root = useRef(null)
  const count = useRef(null)

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { gsap.set(root.current, { autoAlpha: 0 }); onDone(); return }

    const n = { v: 0 }
    const tl = gsap.timeline({ onComplete: () => gsap.set(root.current, { display: 'none' }) })
    tl.from('.pl-mark', { scale: 0, rotate: -40, duration: 0.9, ease: 'back.out(2)' })
      .fromTo('.pl-word', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.inOut' }, '<0.2')
      .to(n, {
        v: 100, duration: 1.6, ease: 'power2.inOut',
        onUpdate: () => { count.current.textContent = String(Math.round(n.v)).padStart(3, '0') },
      }, '<')
      .to('.pl-bar', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, '<')
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
        {/* Leaf mark pops in, then the wordmark wipes in; the bar uses the logo's red, yellow and green. */}
        {/* Leaf and wordmark are cut from the same logo; sizes and offset keep their original proportions (168px : 135px, 23px down). */}
        <div className="flex items-start" role="img" aria-label="FUERTE Coffee Roasters">
          <img src="/img/logo-leaf.webp" alt="" width="185" height="168" className="pl-mark h-24 w-auto" />
          <img src="/img/logo-word.webp" alt="" width="295" height="135" className="pl-word ml-px mt-[13px] h-[77px] w-auto" />
        </div>
        <div className="h-[3px] w-56 bg-cream/10">
          <div className="pl-bar h-full origin-left scale-x-0 bg-[linear-gradient(90deg,#d7261e_0_33.3%,#f2c200_33.3%_66.6%,#2e9e3e_66.6%)]" />
        </div>
        <p ref={count} className="font-sans text-xs tabular-nums tracking-[0.4em] text-muted">000</p>
      </div>
    </div>
  )
}
