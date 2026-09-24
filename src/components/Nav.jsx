import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap'
import { Bag2, Menu, Close } from './Art'

const links = [
  { href: '#shop', label: 'Shop' },
  { href: '#story', label: 'Our story' },
  { href: '#craft', label: 'The craft' },
  { href: '#taste', label: 'Taste' },
  { href: '#wholesale', label: 'Wholesale' },
]

export default function Nav({ cartCount, bump }) {
  const root = useRef(null)
  const [open, setOpen] = useState(false)

  useGSAP(() => {
    // Hide on scroll down, reveal on scroll up; tighten once past the hero.
    const show = gsap.quickTo(root.current, 'yPercent', { duration: 0.45, ease: 'power3.out' })
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const past = self.scroll() > 120
        root.current.dataset.scrolled = past
        show(self.direction === 1 && past && !open ? -130 : 0)
      },
    })
  }, { scope: root, dependencies: [open] })

  useGSAP(() => {
    if (!bump) return
    gsap.fromTo('.cart-badge', { scale: 1.8 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)' })
    gsap.fromTo('.cart-btn', { rotate: -12 }, { rotate: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
  }, { scope: root, dependencies: [bump] })

  useGSAP(() => {
    if (!open) return
    gsap.from('.m-link', { yPercent: 110, duration: 0.7, stagger: 0.06, ease: 'expo.out', delay: 0.15 })
  }, { scope: root, dependencies: [open] })

  return (
    <header ref={root} className="group fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-[padding,background] duration-500 md:px-7 group-data-[scrolled=true]:py-2" aria-label="Main">
        <a href="#top" className="font-display text-2xl font-semibold tracking-[0.25em] text-cream" aria-label="Fuerte home">
          FUERTE
        </a>
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group/l relative py-2 text-sm text-cream/80 transition-colors hover:text-cream">
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-gold transition-transform duration-500 ease-expo group-hover/l:origin-left group-hover/l:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href="#shop" className="cart-btn relative grid size-11 place-items-center rounded-full text-cream transition-colors hover:bg-cream/10" aria-label={`Cart, ${cartCount} items`}>
            <Bag2 />
            <span className="cart-badge absolute right-1 top-1 grid size-4.5 place-items-center rounded-full bg-gold text-[10px] font-bold text-espresso">{cartCount}</span>
          </a>
          <button
            className="grid size-11 place-items-center rounded-full text-cream transition-colors hover:bg-cream/10 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="glass mx-auto mt-2 max-w-7xl rounded-3xl p-6 lg:hidden">
          <ul className="flex flex-col gap-2">
            {links.map((l) => (
              <li key={l.href} className="overflow-hidden">
                <a href={l.href} onClick={() => setOpen(false)} className="m-link block py-2 font-display text-4xl text-cream">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
