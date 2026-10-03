import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap'
import { useLang, languages } from '../i18n'
import { Bag2, Menu, Close } from './Art'

const linkIds = [['#shop', 'shop'], ['#story', 'story'], ['#craft', 'craft'], ['#quiz', 'quiz'], ['#wholesale', 'wholesale']]

function LangSwitch({ onChange }) {
  const { lang, t } = useLang()
  const ref = useRef(null)
  const first = useRef(true)

  // Gold pill slides to the active language.
  useGSAP(() => {
    const active = ref.current.querySelector('[aria-pressed="true"]')
    gsap.to('.ls-pill', {
      x: active.offsetLeft, width: active.offsetWidth,
      duration: first.current ? 0 : 0.6, ease: 'expo.out',
    })
    first.current = false
  }, { scope: ref, dependencies: [lang] })

  return (
    <div ref={ref} role="group" aria-label={t.langName} className="relative flex items-center rounded-full border border-cream/15 p-1">
      <span className="ls-pill absolute left-0 top-1 bottom-1 rounded-full bg-gold" aria-hidden="true" />
      {languages.map((l) => {
        const active = l.id === lang
        return (
          <button
            key={l.id}
            lang={l.id}
            title={l.name}
            aria-label={l.name}
            aria-pressed={active}
            onClick={() => onChange(l.id)}
            className={`relative z-10 grid h-9 min-w-11 place-items-center rounded-full px-3 text-xs font-bold tracking-[0.14em] transition-colors duration-300 ${active ? 'text-espresso' : 'text-cream/70 hover:text-cream'}`}
          >
            {l.short}
          </button>
        )
      })}
    </div>
  )
}

export default function Nav({ cartCount, bump, onLang }) {
  const { t } = useLang()
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
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full py-2.5 pl-5 pr-2.5 transition-[padding] duration-500 md:pl-7 group-data-[scrolled=true]:py-1.5" aria-label={t.nav.main}>
        <a href="#top" className="font-display text-2xl font-semibold tracking-[0.25em] text-cream" aria-label={t.nav.home}>
          FUERTE
        </a>
        <ul className="hidden items-center gap-7 xl:flex">
          {linkIds.map(([href, id]) => (
            <li key={id}>
              <a href={href} className="group/l relative whitespace-nowrap py-2 text-sm text-cream/80 transition-colors hover:text-cream">
                {t.nav.links[id]}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-gold transition-transform duration-500 ease-expo group-hover/l:origin-left group-hover/l:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1.5">
          <LangSwitch onChange={onLang} />
          <a href="#shop" className="cart-btn relative grid size-11 place-items-center rounded-full text-cream transition-colors hover:bg-cream/10" aria-label={t.nav.cart(cartCount)}>
            <Bag2 />
            <span className="cart-badge absolute right-1 top-1 grid size-4.5 place-items-center rounded-full bg-gold text-[10px] font-bold text-espresso">{cartCount}</span>
          </a>
          <button
            className="grid size-11 place-items-center rounded-full text-cream transition-colors hover:bg-cream/10 xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.open}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="glass mx-auto mt-2 max-w-7xl rounded-3xl p-6 xl:hidden">
          <ul className="flex flex-col gap-2">
            {linkIds.map(([href, id]) => (
              <li key={id} className="overflow-hidden">
                <a href={href} onClick={() => setOpen(false)} className="m-link block py-2 font-display text-4xl text-cream">
                  {t.nav.links[id]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
