import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, useGSAP, Flip, FULL } from '../lib/gsap'
import { categoryIds, localizedProducts } from '../data/content'
import { useLang } from '../i18n'
import { Bag, Plus } from './Art'
import { Eyebrow, flyToCart } from './ui'

function ProductCard({ p, onAdd }) {
  const { t } = useLang()
  const card = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(`${FULL} and (pointer: fine)`, () => {
      const el = card.current
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
      const bag = el.querySelector('.pc-bag')
      const move = (e) => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        rx(y * -10); ry(x * 12)
        el.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
        el.style.setProperty('--my', `${(y + 0.5) * 100}%`)
      }
      const enter = () => gsap.to(bag, { y: -18, rotate: -4, scale: 1.05, duration: 0.7, ease: 'back.out(2)' })
      const leave = () => { rx(0); ry(0); gsap.to(bag, { y: 0, rotate: 0, scale: 1, duration: 0.7, ease: 'power3.out' }) }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerenter', enter)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerenter', enter)
        el.removeEventListener('pointerleave', leave)
      }
    })
  }, { scope: card })

  const add = (e) => {
    onAdd(p)
    flyToCart(e.currentTarget)
  }

  return (
    <article
      ref={card}
      data-flip-id={p.id}
      className="pc group relative flex flex-col overflow-hidden rounded-[2rem] border border-espresso/10 bg-white/70 p-5 shadow-[0_1px_0_rgba(0,0,0,.04)] [transform-style:preserve-3d] [perspective:900px]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(400px_circle_at_var(--mx,50%)_var(--my,50%),rgba(200,161,90,.22),transparent_60%)]" />
      {/* Image duplicates the title link, so it is hidden from keyboard and screen readers. */}
      <Link to={`/products/${p.id}`} tabIndex={-1} aria-hidden="true" className="relative grid aspect-[4/4.2] place-items-center overflow-hidden rounded-3xl" style={{ background: `radial-gradient(circle at 50% 60%, ${p.bag}33, transparent 70%), #efe7da` }}>
        <span className="absolute left-4 top-4 rounded-full bg-espresso/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream">
          {t.shop.categories[p.category]}
        </span>
        <div className="pc-bag w-[58%] drop-shadow-[0_24px_24px_rgba(15,11,8,.35)]">
          <Bag product={p} />
        </div>
      </Link>
      <div className="relative flex flex-1 flex-col px-1 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">{p.kicker}</p>
        <div className="mt-1 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-3xl font-semibold text-espresso"><Link to={`/products/${p.id}`} className="transition-colors hover:text-gold-deep">{p.name}</Link></h3>
          <p className="font-sans text-lg font-semibold tabular-nums text-espresso">€{p.price.toFixed(2)}</p>
        </div>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {p.notes.map((n) => (
            <li key={n} className="rounded-full border border-espresso/15 px-2.5 py-1 text-xs text-stone">{n}</li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 text-xs text-stone" aria-label={t.shop.roastAria(p.roast)}>
            {t.shop.roast}
            <span className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`h-1.5 w-4 rounded-full ${i < p.roast ? 'bg-espresso' : 'bg-espresso/15'}`} />
              ))}
            </span>
          </div>
          <button
            onClick={add}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-espresso px-4 text-sm font-semibold text-cream transition-all duration-300 hover:gap-3 hover:bg-gold-deep active:scale-95"
            aria-label={t.shop.addAria(p.name)}
          >
            <Plus className="size-4" /> {t.shop.add}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Collections({ onAdd }) {
  const { t } = useLang()
  const s = t.shop
  const products = localizedProducts(t)
  const root = useRef(null)
  // `tab` updates instantly (pill + aria state); `cat` drives the grid once leaving cards have faded out.
  const [tab, setTab] = useState('all')
  const [cat, setCat] = useState('all')
  const catRef = useRef('all')
  const flip = useRef(null)
  const exitTween = useRef(null)
  const visible = products.filter((p) => cat === 'all' || p.category === cat)

  const choose = (id) => {
    if (id === tab) return
    setTab(id)
    const wrap = root.current.querySelector('.pc-wrap')
    const commit = () => {
      // Clicked away and back before the grid changed: just bring faded cards back.
      if (catRef.current === id) {
        gsap.to(gsap.utils.toArray('.pc', root.current), { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out', clearProps: 'opacity,visibility,scale' })
        return
      }
      catRef.current = id
      // Record where every remaining card is and how tall the grid is, then re-render.
      flip.current = { state: Flip.getState('.pc'), height: wrap.offsetHeight }
      setCat(id)
    }
    exitTween.current?.kill()
    const leaving = gsap.utils.toArray('.pc', root.current).filter((el) => {
      const prod = products.find((p) => p.id === el.dataset.flipId)
      return id !== 'all' && prod.category !== id
    })
    if (!leaving.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { commit(); return }
    exitTween.current = gsap.to(leaving, { autoAlpha: 0, scale: 0.92, duration: 0.25, ease: 'power2.in', onComplete: commit })
  }

  // Cards stay in normal layout the whole time (no absolute positioning), so the
  // grid never collapses. The grid itself is never given a fixed height (that
  // squeezes the cards); a wrapper around it eases from the old height to the
  // new one while the cards keep their real size. Remaining cards glide to
  // their new slots and newcomers fade in where they belong.
  useGSAP(() => {
    const f = flip.current
    if (!f) return
    flip.current = null
    const wrap = root.current.querySelector('.pc-wrap')
    const grid = root.current.querySelector('.pc-grid')
    const cards = gsap.utils.toArray('.pc', root.current)
    gsap.set(cards, { clearProps: 'opacity,visibility,scale' })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const to = grid.offsetHeight
    if (to !== f.height) {
      gsap.fromTo(wrap, { height: f.height, overflow: 'hidden' }, { height: to, duration: 0.7, ease: 'expo.inOut', clearProps: 'height,overflow' })
    }
    Flip.from(f.state, {
      targets: cards,
      scale: true, // move with transforms only; never touch width/height
      duration: 0.7,
      ease: 'expo.inOut',
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 30, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.06, delay: 0.15, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }),
    })
  }, { scope: root, dependencies: [cat] })

  // Pill indicator slides under the active tab.
  useGSAP(() => {
    const active = root.current.querySelector('[aria-selected="true"]')
    gsap.to('.tab-pill', { x: active.offsetLeft, width: active.offsetWidth, duration: 0.6, ease: 'expo.out' })
  }, { scope: root, dependencies: [tab] })

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.from('.col-head > *', { y: 50, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 75%' } })
      gsap.from('.pc', { y: 90, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.pc-grid', start: 'top 80%' } })
      // Section rises over the dark page with rounded top.
      gsap.fromTo(root.current, { borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }, {
        borderTopLeftRadius: '48px', borderTopRightRadius: '48px', ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 40%', scrub: true },
      })
    })
  }, { scope: root })

  return (
    <section id="shop" ref={root} className="relative z-10 bg-cream text-espresso">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="col-head flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow className="!text-gold-deep [&>span]:!bg-gold-deep">{s.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.9] font-medium">
              {s.title} <em className="text-gold-deep">{s.titleEm}</em>
            </h2>
          </div>
          <p className="max-w-sm text-stone">{s.copy}</p>
        </div>

        <div className="-mx-5 mt-12 overflow-x-auto px-5 md:mx-0 md:px-0">
          <div role="tablist" aria-label={s.filter} className="relative inline-flex gap-1 rounded-full border border-espresso/10 bg-white/60 p-1">
            <span className="tab-pill absolute left-0 top-1 bottom-1 rounded-full bg-espresso" aria-hidden="true" />
            {categoryIds.map((id) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => choose(id)}
                className={`relative z-10 min-h-11 whitespace-nowrap rounded-full px-5 text-sm font-medium transition-colors duration-300 ${tab === id ? 'text-cream' : 'text-stone hover:text-espresso'}`}
              >
                {s.categories[id]}
              </button>
            ))}
          </div>
        </div>

        <div className="pc-wrap mt-10">
          <div className="pc-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => <ProductCard key={p.id} p={p} onAdd={onAdd} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
