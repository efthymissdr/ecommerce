import { useRef, useState } from 'react'
import { gsap, useGSAP, Flip, FULL } from '../lib/gsap'
import { categories, products } from '../data/content'
import { Bag, Plus } from './Art'
import { Eyebrow } from './ui'

function ProductCard({ p, onAdd }) {
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
    // Fly a bean from the button to the cart icon.
    const from = e.currentTarget.getBoundingClientRect()
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

  return (
    <article
      ref={card}
      data-flip-id={p.id}
      className="pc group relative flex flex-col overflow-hidden rounded-[2rem] border border-espresso/10 bg-white/70 p-5 shadow-[0_1px_0_rgba(0,0,0,.04)] [transform-style:preserve-3d] [perspective:900px]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(400px_circle_at_var(--mx,50%)_var(--my,50%),rgba(200,161,90,.22),transparent_60%)]" />
      <div className="relative grid aspect-[4/4.2] place-items-center overflow-hidden rounded-3xl" style={{ background: `radial-gradient(circle at 50% 60%, ${p.bag}33, transparent 70%), #efe7da` }}>
        <span className="absolute left-4 top-4 rounded-full bg-espresso/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream">
          {categories.find((c) => c.id === p.category).label}
        </span>
        <div className="pc-bag w-[58%] drop-shadow-[0_24px_24px_rgba(15,11,8,.35)]">
          <Bag product={p} />
        </div>
      </div>
      <div className="relative flex flex-1 flex-col px-1 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">{p.kicker}</p>
        <div className="mt-1 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-3xl font-semibold text-espresso">{p.name}</h3>
          <p className="font-sans text-lg font-semibold tabular-nums text-espresso">€{p.price.toFixed(2)}</p>
        </div>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {p.notes.map((n) => (
            <li key={n} className="rounded-full border border-espresso/15 px-2.5 py-1 text-xs text-stone">{n}</li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 text-xs text-stone" aria-label={`Roast level ${p.roast} of 5`}>
            Roast
            <span className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`h-1.5 w-4 rounded-full ${i < p.roast ? 'bg-espresso' : 'bg-espresso/15'}`} />
              ))}
            </span>
          </div>
          <button
            onClick={add}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-espresso px-4 text-sm font-semibold text-cream transition-all duration-300 hover:gap-3 hover:bg-gold-deep active:scale-95"
            aria-label={`Add ${p.name} to cart`}
          >
            <Plus className="size-4" /> Add
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Collections({ onAdd }) {
  const root = useRef(null)
  const [cat, setCat] = useState('all')
  const flipState = useRef(null)
  const visible = products.filter((p) => cat === 'all' || p.category === cat)

  const choose = (id) => {
    if (id === cat) return
    flipState.current = Flip.getState('.pc')
    setCat(id)
  }

  // Animate filter changes with FLIP: cards glide to new slots, newcomers scale in.
  useGSAP(() => {
    if (!flipState.current) return
    Flip.from(flipState.current, {
      targets: '.pc',
      duration: 0.7,
      ease: 'expo.inOut',
      absolute: true,
      scale: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.4 }),
    })
    flipState.current = null
  }, { scope: root, dependencies: [cat] })

  // Pill indicator slides under the active tab.
  useGSAP(() => {
    const active = root.current.querySelector('[aria-selected="true"]')
    gsap.to('.tab-pill', { x: active.offsetLeft, width: active.offsetWidth, duration: 0.6, ease: 'expo.out' })
  }, { scope: root, dependencies: [cat] })

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
            <Eyebrow className="!text-gold-deep [&>span]:!bg-gold-deep">The collection</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.9] font-medium">
              Find your <em className="text-gold-deep">cup.</em>
            </h2>
          </div>
          <p className="max-w-sm text-stone">From bold espresso to delicate single origins and traditional Greek coffee — roasted fresh and shipped across Greece.</p>
        </div>

        <div className="-mx-5 mt-12 overflow-x-auto px-5 md:mx-0 md:px-0">
          <div role="tablist" aria-label="Filter coffees" className="relative inline-flex gap-1 rounded-full border border-espresso/10 bg-white/60 p-1">
            <span className="tab-pill absolute left-0 top-1 bottom-1 rounded-full bg-espresso" aria-hidden="true" />
            {categories.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={cat === c.id}
                onClick={() => choose(c.id)}
                className={`relative z-10 min-h-11 whitespace-nowrap rounded-full px-5 text-sm font-medium transition-colors duration-300 ${cat === c.id ? 'text-cream' : 'text-stone hover:text-espresso'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pc-grid mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => <ProductCard key={p.id} p={p} onAdd={onAdd} />)}
        </div>
      </div>
    </section>
  )
}
