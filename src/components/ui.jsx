import { useRef } from 'react'
import { gsap, useGSAP, FULL } from '../lib/gsap'

// Splits text into masked words so they can slide up individually.
export function SplitWords({ text, className = '', wordClass = '' }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <span className={`split-word inline-block will-change-transform ${wordClass}`}>{w}&nbsp;</span>
        </span>
      ))}
    </span>
  )
}

// Button that is pulled towards the pointer.
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  useGSAP(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add(`${FULL} and (pointer: fine)`, () => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      const move = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const leave = () => { xTo(0); yTo(0) }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    })
  }, { scope: ref })
  return <div ref={ref} className={`inline-block ${className}`}>{children}</div>
}

export function Button({ children, href = '#', variant = 'gold', className = '', ...rest }) {
  const styles = {
    gold: 'bg-gold text-espresso hover:bg-crema',
    ghost: 'border border-cream/25 text-cream hover:border-gold hover:text-gold',
    dark: 'bg-espresso text-cream hover:bg-roast',
  }
  return (
    <a
      href={href}
      className={`group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition-colors duration-300 ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}

export function Eyebrow({ children, className = '' }) {
  return (
    <p className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold ${className}`}>
      <span className="h-px w-8 bg-gold" />
      {children}
    </p>
  )
}
