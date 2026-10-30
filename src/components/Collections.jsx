import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, useGSAP, Flip, FULL } from '../lib/gsap'
import { shopGroups, inFilter, localizedProducts } from '../data/content'
import { useLang } from '../i18n'
import { Bag, Plus, ArrowRight } from './Art'
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
        {/* z-10 keeps the tag above the pack, which lifts on hover. */}
        <span className="absolute left-4 top-4 z-10 rounded-full bg-espresso/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream">
          {t.shop.categories[p.tags[0]]}
        </span>
        <div className="pc-bag w-[58%] drop-shadow-[0_24px_24px_rgba(15,11,8,.35)]">
          <Bag product={p} />
        </div>
      </Link>
      <div className="relative flex flex-1 flex-col px-1 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">{p.kicker}</p>
        <div className="mt-1 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold leading-tight text-espresso"><Link to={`/products/${p.id}`} className="transition-colors hover:text-gold-deep">{p.name}</Link></h3>
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

// Icons for the three shop groups.
const groupIcon = {
  coffee: <><ellipse cx="12" cy="12" rx="6.5" ry="9" transform="rotate(30 12 12)" /><path d="M9 5c3 3-1 9 6 14" /></>,
  equipment: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M4 8h16" /><path d="M9 12h6l-1 4h-4z" /><path d="M8 5.5h.01M11 5.5h.01" /></>,
  more: <><path d="M4 10h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" /><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" /><path d="M11 3c2 1 2 3 0 4" /><path d="M8 7h6" /></>,
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Collections({ onAdd }) {
  const { t } = useLang()
  const s = t.shop
  const products = localizedProducts(t)
  const root = useRef(null)
  // `tab` updates instantly (buttons + pill); `sel` drives the grid once leaving cards have faded out.
  const [tab, setTab] = useState({ group: 'coffee', filter: 'all' })
  const [sel, setSel] = useState(tab)
  const selRef = useRef(tab)
  const flip = useRef(null)
  const exitTween = useRef(null)
  const visible = products.filter((p) => inFilter(p, sel.group, sel.filter))
  const count = (group, filter) => products.filter((p) => inFilter(p, group, filter)).length
  const filters = shopGroups.find((g) => g.id === tab.group).filters

  const choose = (group, filter) => {
    if (group === tab.group && filter === tab.filter) return
    const next = { group, filter }
    setTab(next)
    const wrap = root.current.querySelector('.pc-wrap')
    const commit = () => {
      // Clicked away and back before the grid changed: just bring faded cards back.
      if (selRef.current.group === group && selRef.current.filter === filter) {
        gsap.to(gsap.utils.toArray('.pc, .pc-empty', root.current), { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out', clearProps: 'opacity,visibility,scale' })
        return
      }
      selRef.current = next
      // Record where every remaining card is and how tall the grid is, then re-render.
      flip.current = { state: Flip.getState('.pc'), height: wrap.offsetHeight }
      setSel(next)
    }
    exitTween.current?.kill()
    const leaving = [
      ...gsap.utils.toArray('.pc', root.current).filter((el) => !inFilter(products.find((p) => p.id === el.dataset.flipId), group, filter)),
      ...gsap.utils.toArray('.pc-empty', root.current),
    ]
    if (!leaving.length || reduced()) { commit(); return }
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
    const cards = gsap.utils.toArray('.pc', root.current)
    gsap.set(cards, { clearProps: 'opacity,visibility,scale' })
    if (reduced()) return

    const to = wrap.scrollHeight
    if (to !== f.height) {
      gsap.fromTo(wrap, { height: f.height, overflow: 'hidden' }, { height: to, duration: 0.7, ease: 'expo.inOut', clearProps: 'height,overflow' })
    }
    gsap.fromTo('.pc-empty', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.15, ease: 'power3.out', clearProps: 'transform,opacity,visibility' })
    Flip.from(f.state, {
      targets: cards,
      scale: true, // move with transforms only; never touch width/height
      duration: 0.7,
      ease: 'expo.inOut',
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 30, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.06, delay: 0.15, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }),
    })
  }, { scope: root, dependencies: [sel] })

  // Dark pill slides (and wraps to the next row) under the active filter.
  useGSAP(() => {
    const place = (duration) => {
      const active = root.current.querySelector('.f-chip[aria-pressed="true"]')
      if (active) gsap.to('.f-pill', { x: active.offsetLeft, y: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight, duration, ease: 'expo.out', overwrite: true })
    }
    place(0.6)
    // Chips wrap differently as the screen and fonts change, so follow resizes.
    const ro = new ResizeObserver(() => place(0))
    root.current.querySelectorAll('.f-chip').forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, { scope: root, dependencies: [tab] })

  // New group: its filter chips cascade in.
  useGSAP(() => {
    if (reduced()) return
    gsap.from('.f-chip', { y: 12, autoAlpha: 0, duration: 0.45, stagger: 0.03, ease: 'power3.out', clearProps: 'transform,opacity,visibility' })
  }, { scope: root, dependencies: [tab.group], revertOnUpdate: false })

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

  const equipment = sel.group === 'equipment'

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

        {/* Groups: three tiles, side by side even on phones. */}
        <div role="group" aria-label={s.groupsLabel} className="mt-12 grid grid-cols-3 gap-2 sm:gap-3 lg:max-w-3xl">
          {shopGroups.map(({ id }) => {
            const on = tab.group === id
            const n = count(id, 'all')
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => choose(id, 'all')}
                className={`group/g flex flex-col items-start gap-3 rounded-3xl border p-3 text-left transition-all duration-500 ease-expo sm:flex-row sm:items-center sm:p-4 ${on ? 'border-espresso bg-espresso text-cream shadow-[0_18px_40px_-20px_rgba(23,17,12,.7)]' : 'border-espresso/10 bg-white/60 text-espresso hover:-translate-y-0.5 hover:border-espresso/25'}`}
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-2xl transition-colors duration-500 ${on ? 'bg-gold text-espresso' : 'bg-espresso/5 text-gold-deep group-hover/g:bg-gold/20'}`}>
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{groupIcon[id]}</svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold leading-tight sm:text-base">{s.groups[id]}</span>
                  <span className={`mt-1 block text-[11px] sm:text-xs ${on ? 'text-cream/60' : 'text-stone'}`}>{s.count(n)}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Filters of the active group; they wrap on small screens instead of scrolling. */}
        <div role="group" aria-label={s.filter} className="relative mt-5 flex flex-wrap gap-2">
          <span className="f-pill absolute left-0 top-0 rounded-full bg-espresso" aria-hidden="true" />
          {filters.map((id) => {
            const on = tab.filter === id
            const n = count(tab.group, id)
            return (
              <button
                key={`${tab.group}-${id}`}
                type="button"
                aria-pressed={on}
                onClick={() => choose(tab.group, id)}
                className={`f-chip relative z-10 inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium sm:gap-2 sm:px-4 sm:text-sm transition-colors duration-300 ${on ? 'border-transparent text-cream' : 'border-espresso/15 text-stone hover:border-espresso/40 hover:text-espresso'}`}
              >
                {id === 'all' ? s.all[tab.group] : s.categories[id]}
                {/* Product count, or "Soon" for empty filters (just a dot on phones, to keep the chips on fewer rows). */}
                {id !== 'all' && (n
                  ? <span className={`text-[11px] tabular-nums ${on ? 'text-cream/60' : 'text-stone/70'}`}>{n}</span>
                  : <><span className={`size-1.5 rounded-full sm:hidden ${on ? 'bg-cream/40' : 'bg-gold'}`} aria-hidden="true" /><span className={`hidden text-[11px] sm:inline ${on ? 'text-cream/60' : 'text-stone/50'}`}>{s.soon}</span></>)}
              </button>
            )
          })}
        </div>

        <div className="pc-wrap mt-10">
          <div className="pc-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => <ProductCard key={p.id} p={p} onAdd={onAdd} />)}
          </div>
          {!visible.length && (
            <div className="pc-empty flex flex-col items-center rounded-[2rem] border border-dashed border-espresso/20 bg-white/50 px-6 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-gold/15 text-gold-deep">
                <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{groupIcon[sel.group]}</svg>
              </span>
              <h3 className="mt-6 font-display text-3xl md:text-4xl">{s.empty.title}</h3>
              <p className="mt-3 max-w-md text-stone">{equipment ? s.empty.equipmentText : s.empty.text}</p>
              {equipment
                ? <Link to="/wholesale#professional" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-espresso px-6 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep">{s.empty.equipmentCta} <ArrowRight className="size-4" /></Link>
                : <a href="mailto:info@fuerte.gr" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-espresso px-6 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep">{s.empty.cta} <ArrowRight className="size-4" /></a>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
