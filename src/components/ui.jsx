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

export function Button({ children, href = '#', variant = 'gold', className = '', as: Tag = 'a', ...rest }) {
  const styles = {
    gold: 'bg-gold text-espresso hover:bg-crema',
    ghost: 'border border-cream/25 text-cream hover:border-gold hover:text-gold',
    dark: 'bg-espresso text-cream hover:bg-roast',
  }
  return (
    <Tag
      {...(Tag === 'a' ? { href } : Tag === 'button' ? { type: 'button' } : {})}
      className={`group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition-colors duration-300 ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
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

// Fly a gold dot from an element to the cart icon.
export function flyToCart(fromEl) {
  const from = fromEl.getBoundingClientRect()
  const to = document.querySelector('.cart-btn')?.getBoundingClientRect()
  if (!to || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const dot = document.createElement('span')
  dot.className = 'fixed z-[70] size-4 rounded-full bg-gold pointer-events-none'
  Object.assign(dot.style, { left: `${from.left + from.width / 2 - 8}px`, top: `${from.top + from.height / 2 - 8}px` })
  document.body.appendChild(dot)
  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  gsap.timeline({ onComplete: () => dot.remove() })
    .to(dot, { x: dx, duration: 0.8, ease: 'power1.inOut' })
    .to(dot, { y: dy, duration: 0.8, ease: 'back.in(1.4)' }, 0)
    .to(dot, { scale: 0.4, duration: 0.8 }, 0)
}

// Full-bleed background photo with a tint overlay and a slow scroll parallax.
// The parent section needs `relative isolate`; content after it needs `relative`.
export function PhotoBg({ name, widths, overlay, position = 'center', blur = 0, eager = false }) {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.fromTo(ref.current.querySelector('img'), { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  }, { scope: ref })
  const largest = widths[widths.length - 1]
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <img
        src={`/img/${name}-${largest}.webp`}
        srcSet={widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ')}
        sizes="100vw"
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        className="absolute inset-x-0 -top-[8%] h-[116%] w-full scale-105 object-cover"
        style={{ objectPosition: position, filter: blur ? `blur(${blur}px)` : undefined }}
      />
      <div className="absolute inset-0" style={{ background: overlay }} />
    </div>
  )
}
