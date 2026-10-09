import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router'
import { gsap, useGSAP, ScrollTrigger, FULL } from '../lib/gsap'
import { useLang } from '../i18n'
import { axes, localizedProducts, productOptions, priceFor } from '../data/content'
import { Bag, Bean, Plus, Leaf, Truck, Flame, ArrowRight } from './Art'
import { Eyebrow, Magnetic, Button, PhotoBg, flyToCart } from './ui'
import { Radar, points } from './Quiz'
import Carousel from './Carousel'

const slideIds = [
  ['beans', '/img/beans-1200.webp'],
  ['cups', '/img/cups-900.webp'],
  ['sacks', '/img/sacks-900.webp'],
  ['barista', '/img/barista-1200.webp'],
  ['cafe', '/img/cafe-1400.webp'],
  ['breakfast', '/img/breakfast-900.webp'],
]

// Photo used beside each product's story.
const storyPhoto = { espresso: 'cups', single: 'sacks', greek: 'cups', filter: 'cups' }

const euro = (v) => `€${v.toFixed(2)}`

/* ---------- option group built on native radios (free keyboard support) ---------- */

function OptionGroup({ name, legend, options, value, onChange, cols = 'grid-cols-3' }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted">{legend}</legend>
      <div className={`grid gap-2 ${cols}`}>
        {options.map((o) => (
          <label key={o.id} className="group relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              disabled={o.disabled}
              className="peer sr-only"
            />
            <span className="flex min-h-12 flex-col justify-center rounded-2xl border border-cream/15 px-4 py-2.5 text-sm text-cream/80 transition-all duration-300 group-hover:border-gold/60 peer-checked:border-gold peer-checked:bg-gold peer-checked:text-espresso peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold peer-disabled:cursor-not-allowed peer-disabled:opacity-35">
              <span className="font-semibold">{o.label}</span>
              {o.hint && <span className="mt-0.5 text-xs opacity-70">{o.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/* ---------- top: floating product stage + options ---------- */

function Stage({ product, view, setView, labels }) {
  const ref = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.to('.st-float', { y: -18, rotate: -2.5, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to('.st-shadow', { scaleX: 0.82, opacity: 0.25, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.utils.toArray('.st-bean').forEach((b, i) => {
        gsap.to(b, { y: i % 2 ? 14 : -14, rotate: `+=${i % 2 ? 30 : -30}`, duration: 3 + i * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      })
      // Tilt towards the pointer.
      const el = ref.current
      const rx = gsap.quickTo('.st-tilt', 'rotationX', { duration: 0.8, ease: 'power3.out' })
      const ry = gsap.quickTo('.st-tilt', 'rotationY', { duration: 0.8, ease: 'power3.out' })
      const move = (e) => {
        const r = el.getBoundingClientRect()
        ry(((e.clientX - r.left) / r.width - 0.5) * 18)
        rx(((e.clientY - r.top) / r.height - 0.5) * -14)
      }
      const leave = () => { rx(0); ry(0) }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
    })
  }, { scope: ref })

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo('.st-view', { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'expo.out' })
  }, { scope: ref, dependencies: [view, product.kicker] })

  const views = [['bag', null], ['beans', '/img/beans-960.webp'], ['cup', '/img/cups-900.webp']]

  return (
    <div ref={ref} className="pdp-stage lg:sticky lg:top-28">
      <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-cream/10 bg-[radial-gradient(circle_at_50%_45%,rgba(200,161,90,.28),rgba(36,27,20,.9)_65%)] [perspective:1200px]">
        <div className="spin-slow pointer-events-none absolute inset-[7%] rounded-full border border-dashed border-gold/20" />
        {view === 'bag' ? (
          <div className="st-view absolute inset-0 grid place-items-center">
            {[[12, 18, 34], [80, 14, 24], [84, 70, 40], [10, 74, 22], [52, 6, 18]].map(([x, y, s], i) => (
              <Bean key={i} className="st-bean absolute" color={i % 2 ? '#3b2415' : '#6b4423'} crease="#1a0f08" style={{ left: `${x}%`, top: `${y}%`, width: s, rotate: `${i * 40}deg` }} />
            ))}
            <div className="st-tilt relative w-[52%] [transform-style:preserve-3d]">
              <div className="st-float drop-shadow-[0_40px_40px_rgba(0,0,0,.5)]"><Bag product={product} /></div>
              <div className="st-shadow mx-auto mt-6 h-5 w-3/4 rounded-[50%] bg-black/45 blur-md" />
            </div>
          </div>
        ) : (
          <img src={views.find(([v]) => v === view)[1]} alt="" className="st-view absolute inset-0 size-full object-cover" />
        )}
      </div>
      <div className="mt-4 flex gap-3" role="group" aria-label={labels.viewsLabel}>
        {views.map(([v, src]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            aria-pressed={view === v}
            className={`group relative h-20 w-20 overflow-hidden rounded-2xl border transition-all duration-300 ${view === v ? 'border-gold' : 'border-cream/10 hover:border-gold/50'}`}
          >
            {src
              ? <img src={src} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
              : <span className="grid size-full place-items-center bg-roast"><span className="w-9"><Bag product={product} /></span></span>}
            <span className="sr-only">{labels.views[v]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Buy({ product, onAdd, t }) {
  const d = t.pdp
  const opts = useMemo(() => productOptions(product), [product])
  const [size, setSize] = useState(opts.sizes[0].id)
  const [roast, setRoast] = useState('roasted')
  const [grind, setGrind] = useState(opts.grinds[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const ref = useRef(null)
  const priceEl = useRef(null)
  const shown = useRef(null)

  const sizeObj = opts.sizes.find((s) => s.id === size)
  const unit = priceFor(product, sizeObj.mult, roast)
  const total = unit * qty

  // Green coffee only comes as whole beans.
  const pickRoast = (r) => { setRoast(r); if (r === 'green') setGrind('whole') }

  // Count the price up or down when options change.
  useEffect(() => {
    const from = shown.current ?? total
    shown.current = total
    if (from === total || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { priceEl.current.textContent = euro(total); return }
    const o = { v: from }
    const tw = gsap.to(o, { v: total, duration: 0.6, ease: 'power3.out', onUpdate: () => { priceEl.current.textContent = euro(o.v) } })
    gsap.fromTo(priceEl.current, { y: -6, color: '#f5efe6' }, { y: 0, color: '#c8a15a', duration: 0.6, ease: 'back.out(3)' })
    return () => tw.kill()
  }, [total])

  const add = (e) => {
    onAdd(product, { size, roast, grind, qty })
    flyToCart(e.currentTarget)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  // Sticky add-to-cart bar on small screens once the main button scrolls away.
  const [showBar, setShowBar] = useState(false)
  // A ScrollTrigger (not an IntersectionObserver) so jumps past the button count too.
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: '.pdp-add', start: 'bottom top', end: 'max',
      onToggle: (self) => setShowBar(self.isActive),
    })
  }, { scope: ref })

  const summary = [sizeObj.label, d.roasts[roast][0], d.grinds[grind]].join(' · ')

  return (
    <div ref={ref} className="pdp-buy">
      <nav aria-label="Breadcrumb" className="pdp-in text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:text-gold">{d.home}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/#shop" className="hover:text-gold">{d.shop}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-cream/80">{product.name}</li>
        </ol>
      </nav>
      <p className="pdp-in mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-gold">{product.kicker}</p>
      <h1 className="pdp-in mt-3 font-display text-[clamp(3.2rem,7vw,6rem)] leading-[0.9] text-cream">{product.name}</h1>
      <div className="pdp-in mt-5 flex flex-wrap items-baseline gap-4">
        <p ref={priceEl} className="font-display text-4xl tabular-nums text-gold" aria-live="polite">{euro(total)}</p>
        <p className="text-sm text-muted">{qty > 1 && `${qty} × ${euro(unit)}`}</p>
      </div>
      <ul className="pdp-in mt-5 flex flex-wrap gap-2">
        {product.notes.map((n) => <li key={n} className="rounded-full border border-cream/15 px-3 py-1 text-xs text-cream/75">{n}</li>)}
      </ul>
      <p className="pdp-in mt-6 max-w-lg leading-relaxed text-cream/70">{product.pitch}</p>

      <div className="pdp-in mt-10 space-y-7">
        <OptionGroup name="size" legend={d.size} value={size} onChange={setSize}
          options={opts.sizes.map((s) => ({ id: s.id, label: s.label, hint: euro(priceFor(product, s.mult, roast)) }))} />
        {opts.roasts.length > 1 && (
          <OptionGroup name="roast" legend={d.roast} value={roast} onChange={pickRoast} cols="grid-cols-2"
            options={opts.roasts.map((r) => ({ id: r, label: d.roasts[r][0], hint: d.roasts[r][1] }))} />
        )}
        <div>
          <OptionGroup name="grind" legend={d.grind} value={grind} onChange={setGrind} cols="grid-cols-2 sm:grid-cols-3"
            options={opts.grinds.map((g) => ({ id: g, label: d.grinds[g], disabled: roast === 'green' && g !== 'whole' }))} />
          {roast === 'green' && <p className="mt-2 text-xs text-gold" role="status">{d.greenNote}</p>}
        </div>
      </div>

      <div className="pdp-in mt-9 flex flex-wrap items-end gap-4">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted" id="qty-label">{d.quantity}</p>
          <div className="flex items-center rounded-full border border-cream/15" role="group" aria-labelledby="qty-label">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={d.decrease} disabled={qty <= 1} className="grid size-12 place-items-center rounded-full text-xl text-cream transition-colors hover:text-gold disabled:opacity-30">−</button>
            <output className="w-8 text-center font-semibold tabular-nums text-cream" aria-live="polite">{qty}</output>
            <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label={d.increase} className="grid size-12 place-items-center rounded-full text-cream transition-colors hover:text-gold"><Plus className="size-4" /></button>
          </div>
        </div>
        <Magnetic strength={0.2} className="flex-1">
          <Button as="button" onClick={add} className="pdp-add w-full justify-center !min-h-14 text-base">
            {added ? d.added : <>{d.add} · {euro(total)}</>}
          </Button>
        </Magnetic>
      </div>
      <p className="pdp-in mt-3 text-xs text-muted">{summary}</p>

      <ul className="pdp-in mt-8 grid grid-cols-3 gap-3 border-t border-cream/10 pt-6 text-xs text-cream/70">
        {[Flame, Truck, Leaf].map((I, i) => (
          <li key={i} className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold"><I className="size-4" /></span>
            {d.perks[i]}
          </li>
        ))}
      </ul>

      {/* Portalled to <body>: inside the hero section's stacking context it would sit under later sections. */}
      {createPortal(<div className={`fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-full border border-cream/15 bg-roast/90 py-2 pl-5 pr-2 shadow-2xl backdrop-blur-md transition-all duration-500 ease-expo lg:hidden ${showBar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'}`} aria-hidden={!showBar}>
        <span className="min-w-0">
          <span className="block truncate font-display text-xl text-cream">{product.name}</span>
          <span className="text-xs tabular-nums text-gold">{euro(total)}</span>
        </span>
        <button onClick={add} tabIndex={showBar ? 0 : -1} className="min-h-11 shrink-0 rounded-full bg-gold px-5 text-sm font-semibold text-espresso">
          {added ? d.added : d.add}
        </button>
      </div>, document.body)}
    </div>
  )
}

/* ---------- story ---------- */

function Story({ product, d }) {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.from('.ps-in', { y: 50, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } })
      gsap.fromTo('.ps-photo', { clipPath: 'inset(18% 18% 18% 18% round 2.5rem)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 2.5rem)', ease: 'none',
        scrollTrigger: { trigger: '.ps-photo', start: 'top 90%', end: 'top 35%', scrub: true },
      })
      gsap.fromTo('.ps-photo img', { yPercent: -8, scale: 1.2 }, { yPercent: 8, scale: 1.2, ease: 'none', scrollTrigger: { trigger: '.ps-photo', start: 'top bottom', end: 'bottom top', scrub: true } })
    })
  }, { scope: ref })

  const photo = storyPhoto[product.category]
  return (
    <section ref={ref} className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-2 lg:gap-20">
      <div>
        <Eyebrow className="ps-in">{d.storyEyebrow}</Eyebrow>
        <h2 className="ps-in mt-6 font-display text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.95] text-cream">{product.story.title}</h2>
        {product.story.body.map((p, i) => (
          <p key={i} className={`ps-in mt-6 text-lg leading-relaxed ${i === 0 ? 'text-cream/85' : 'text-cream/65'}`}>{p}</p>
        ))}
      </div>
      <div className="ps-photo relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-roast">
        <img src={`/img/${photo}-900.webp`} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 rounded-2xl border border-cream/15 bg-roast/70 p-4 backdrop-blur-md">
          <span className="w-10 shrink-0"><Bag product={product} /></span>
          <span>
            <span className="block text-xs uppercase tracking-[0.2em] text-muted">{d.facts.origin}</span>
            <span className="font-display text-xl text-cream">{product.facts.origin}</span>
          </span>
        </div>
      </div>
    </section>
  )
}

/* ---------- characteristics ---------- */

function Specs({ product, t }) {
  const d = t.pdp
  const ref = useRef(null)
  const opts = productOptions(product)

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = points(product.profile)
    if (reduce) { gsap.set('.rd-product', { attr: { points: target } }); gsap.set('.sp-bar', { scaleX: (i, el) => el.dataset.v }); return }
    const st = { trigger: ref.current, start: 'top 70%' }
    gsap.from('.sp-tile', { y: 50, autoAlpha: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', scrollTrigger: st })
    gsap.to('.rd-product', { attr: { points: target }, duration: 1.4, ease: 'elastic.out(1, 0.6)', scrollTrigger: { trigger: '.sp-radar', start: 'top 80%' } })
    gsap.fromTo('.sp-bar', { scaleX: 0 }, { scaleX: (i, el) => el.dataset.v, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.sp-bars', start: 'top 85%' } })
    gsap.fromTo('.sp-roast span', { scaleY: 0 }, { scaleY: 1, transformOrigin: 'bottom', duration: 0.6, stagger: 0.08, ease: 'back.out(2)', scrollTrigger: { trigger: '.sp-roast', start: 'top 90%' } })
  }, { scope: ref, dependencies: [product.id] })

  const facts = ['origin', 'region', 'process', 'variety', 'altitude']
  return (
    <section ref={ref} className="relative isolate">
      <PhotoBg name="beans" widths={[960]} blur={3} overlay="linear-gradient(180deg, rgba(23,17,12,.97), rgba(23,17,12,.86) 40%, rgba(23,17,12,.97))" />
      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Eyebrow>{d.specsEyebrow}</Eyebrow>
        <h2 className="mt-6 font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] text-cream">
          {d.specsTitle} <em className="text-gold">{d.specsTitleEm}</em>
        </h2>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f} className="sp-tile rounded-3xl border border-cream/10 bg-roast/70 p-6 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">{d.facts[f]}</p>
                <p className="mt-3 font-display text-2xl text-cream">{product.facts[f]}</p>
              </div>
            ))}
            <div className="sp-tile rounded-3xl border border-cream/10 bg-roast/70 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">{d.roastLevel}</p>
              <div className="sp-roast mt-4 flex h-10 items-end gap-1.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`w-full rounded-md ${i < product.roast ? 'bg-gold' : 'bg-cream/10'}`} style={{ height: `${40 + i * 15}%` }} />
                ))}
              </div>
              <p className="mt-3 font-display text-2xl text-cream">{d.roastLevels[product.roast - 1]}</p>
            </div>
            <div className="sp-tile rounded-3xl border border-cream/10 bg-roast/70 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">{d.notes}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {product.notes.map((n) => <li key={n} className="rounded-full bg-gold/15 px-3 py-1.5 text-sm text-cream">{n}</li>)}
              </ul>
            </div>
            <div className="sp-tile rounded-3xl border border-cream/10 bg-roast/70 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">{d.brew}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {opts.brew.map((b) => <li key={b} className="rounded-full border border-gold/40 px-3 py-1.5 text-sm text-gold">{d.brews[b]}</li>)}
              </ul>
            </div>
          </div>

          <div className="sp-tile sp-radar rounded-3xl border border-cream/10 bg-roast/70 p-6 backdrop-blur-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">{d.profile}</p>
            <Radar product={product.profile} labels={t.axes} ariaLabel={`${d.profile}: ${product.name}`} className="mx-auto mt-2 w-full max-w-[340px]" />
            <dl className="sp-bars mt-4 space-y-3">
              {axes.map((a) => (
                <div key={a}>
                  <div className="flex justify-between text-xs uppercase tracking-[0.15em] text-muted">
                    <dt>{t.axes[a]}</dt><dd className="tabular-nums text-cream">{product.profile[a]}/5</dd>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream/10">
                    <div className="sp-bar h-full origin-left rounded-full bg-gradient-to-r from-gold-deep to-gold" data-v={product.profile[a] / 5} />
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- page ---------- */

export default function ProductPage({ onAdd }) {
  const { id } = useParams()
  const { t } = useLang()
  const d = t.pdp
  const product = localizedProducts(t).find((p) => p.id === id)
  const [view, setView] = useState('bag')
  const root = useRef(null)

  // Deferred so it runs after LangProvider sets the site-wide title on a language switch.
  useEffect(() => {
    if (!product) return
    const id = setTimeout(() => { document.title = `${product.name} — FUERTE` }, 0)
    return () => { clearTimeout(id); document.title = t.meta.title }
  }, [product?.name, t])

  useGSAP(() => {
    if (!product) return
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.pdp-stage', { y: 60, autoAlpha: 0, scale: 0.96, duration: 1.3 })
        .from('.pdp-in', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.06 }, 0.15)
    })
  }, { scope: root, dependencies: [id] })

  if (!product) {
    return (
      <main className="grid min-h-[80svh] place-items-center px-5 pt-28 text-center">
        <div>
          <p className="font-display text-5xl text-cream">{d.notFound}</p>
          <div className="mt-8"><Button as={Link} to="/#shop">{d.back} <ArrowRight className="size-4" /></Button></div>
        </div>
      </main>
    )
  }

  return (
    <main ref={root} key={id}>
      <section className="relative isolate">
        <PhotoBg name="beans" widths={[960, 1920]} eager blur={2} overlay="linear-gradient(180deg, rgba(23,17,12,.82) 0%, rgba(23,17,12,.93) 55%, rgba(23,17,12,1) 100%)" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pt-28 pb-16 md:px-8 md:pt-36 lg:grid-cols-2 lg:gap-16">
          <div><Stage product={product} view={view} setView={setView} labels={d} /></div>
          <Buy key={product.id} product={product} onAdd={onAdd} t={t} />
        </div>
      </section>
      <Story product={product} d={d} />
      <Specs product={product} t={t} />
      <section className="py-24 md:py-32">
        <div className="mx-auto mb-12 max-w-7xl px-5 md:px-8">
          <Eyebrow>{d.galleryEyebrow}</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] text-cream">
            {d.galleryTitle} <em className="text-gold">{d.galleryTitleEm}</em>
          </h2>
        </div>
        <Carousel
          slides={slideIds.map(([sid, src]) => ({ id: sid, src, caption: d.slides[sid] }))}
          labels={{ title: `${d.galleryTitle} ${d.galleryTitleEm}`, prev: d.prev, next: d.next, goTo: d.goTo, pause: d.pause, play: d.play }}
        />
      </section>
    </main>
  )
}
