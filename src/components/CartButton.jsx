import { useId, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

// Add-to-cart button with a small animation inside it: the label slides away,
// three beans drop into a cup, the cup fills with espresso and crema, steam
// rises, then "Added ✓" shows for a moment before the label comes back.
// Clicking again while it plays adds again and restarts the animation.
export default function CartButton({ onAdd, children, addedLabel, className = '' }) {
  const ref = useRef(null)
  const tl = useRef(null)
  const [status, setStatus] = useState('')
  const clip = `cb-inside-${useId().replace(/:/g, '')}`

  const { contextSafe } = useGSAP(() => {
    const q = gsap.utils.selector(ref)
    gsap.set(q('.cb-anim, .cb-done, .cb-bean'), { autoAlpha: 0 })
    tl.current = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
      .to(q('.cb-label'), { yPercent: -140, autoAlpha: 0, duration: 0.3, ease: 'power2.in' })
      .set(q('.cb-anim'), { autoAlpha: 1 })
      .fromTo(q('.cb-cup'), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)' })
      // Each bean fades in, falls into the cup and disappears as it lands.
      .to(q('.cb-bean'), { keyframes: { y: [-16, 14], rotate: [-60, 40], autoAlpha: [0, 1, 1, 0], ease: 'power2.in' }, duration: 0.45, stagger: 0.09 }, '-=0.1')
      .fromTo(q('.cb-liquid'), { attr: { y: 37 } }, { attr: { y: 19 }, duration: 0.6, ease: 'power1.inOut' }, '-=0.15')
      .fromTo(q('.cb-foam'), { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, transformOrigin: '50% 100%', duration: 0.25 }, '-=0.15')
      .fromTo(q('.cb-steam'), { strokeDashoffset: 14, y: 2, autoAlpha: 0 }, { strokeDashoffset: 0, y: -3, autoAlpha: 1, duration: 0.5, stagger: 0.12 })
      .to(q('.cb-steam'), { y: -8, autoAlpha: 0, duration: 0.4 }, '+=0.05')
      .to(q('.cb-cup'), { y: -18, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, '<')
      .fromTo(q('.cb-done'), { yPercent: 140, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.35, immediateRender: false })
      .to(q('.cb-done'), { yPercent: -140, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, '+=0.9')
      .set(q('.cb-anim'), { autoAlpha: 0 })
      .fromTo(q('.cb-label'), { yPercent: 140, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.35, immediateRender: false })
  }, { scope: ref })

  const click = contextSafe((e) => {
    onAdd(e)
    setStatus(addedLabel)
    setTimeout(() => setStatus(''), 2500)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // No motion: just show "Added" for a moment.
      const q = gsap.utils.selector(ref)
      gsap.set(q('.cb-label'), { autoAlpha: 0 })
      gsap.set(q('.cb-done'), { autoAlpha: 1, yPercent: 0 })
      gsap.delayedCall(1.6, () => { gsap.set(q('.cb-done'), { autoAlpha: 0 }); gsap.set(q('.cb-label'), { autoAlpha: 1 }) })
      return
    }
    tl.current.restart()
  })

  return (
    <button
      ref={ref}
      type="button"
      onClick={click}
      className={`relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full bg-gold px-7 py-3 text-sm font-semibold tracking-wide text-espresso transition-colors duration-300 hover:bg-crema active:scale-[0.98] ${className}`}
    >
      <span className="cb-label inline-flex items-center gap-3">{children}</span>
      <span className="cb-done absolute inset-0 flex items-center justify-center gap-2" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
        {addedLabel}
      </span>
      <span className="cb-anim pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
        <svg viewBox="0 0 56 44" className="h-10 overflow-visible">
          <defs>
            <clipPath id={clip}><path d="M17 15H39V24C39 30.5 34.5 35 28 35C21.5 35 17 30.5 17 24Z" /></clipPath>
          </defs>
          {/* beans dropping in */}
          {[22, 28, 34].map((x, i) => (
            <g key={i} className="cb-bean" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <ellipse cx={x} cy="4" rx="3" ry="4.2" fill="#3b2415" />
              <path d={`M${x} 0.6c-1.4 2.2 1.4 4.6 0 6.8`} stroke="#c8a15a" strokeWidth=".9" fill="none" />
            </g>
          ))}
          <g className="cb-cup">
            {/* espresso + crema inside the cup */}
            <g clipPath={`url(#${clip})`}>
              <rect className="cb-liquid" x="15" y="37" width="26" height="22" fill="#4a2a14" />
              <ellipse className="cb-foam" cx="28" cy="19.5" rx="12" ry="2.6" fill="#e9c98f" />
            </g>
            <path d="M16 14H40V24C40 31 35 36 28 36C21 36 16 31 16 24Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M40 18h2.5a4 4 0 0 1 0 8H40" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <path d="M11 40h34" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            {/* steam */}
            {[24, 32].map((x) => (
              <path key={x} className="cb-steam" d={`M${x} 11c-2-2.5 2-4.5 0-7`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="14" />
            ))}
          </g>
        </svg>
      </span>
      {/* Announced to screen readers when something is added. */}
      <span className="sr-only" role="status">{status}</span>
    </button>
  )
}
