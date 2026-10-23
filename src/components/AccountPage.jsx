import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useParams } from 'react-router'
import { gsap, useGSAP, FULL } from '../lib/gsap'
import { useLang } from '../i18n'
import { useAuth } from '../account/AuthContext'
import { accountText } from '../account/text'
import { pointsRules } from '../account/service'
import { localizedProducts } from '../data/content'
import { Bag, ArrowRight, Plus, Check2, Close, Truck } from './Art'
import { Eyebrow, Button, PhotoBg, flyToCart } from './ui'
import { Field } from './AuthPanel'

const tabIds = ['overview', 'orders', 'addresses', 'points']

function useFormat(code) {
  const locale = code === 'el' ? 'el-GR' : 'en-GB'
  return useMemo(() => ({
    money: (v) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(v),
    date: (d) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d)),
    month: (d) => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(d)),
  }), [locale])
}

const orderTotals = (o) => {
  const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0)
  return { subtotal, total: subtotal + o.shipping }
}

const statusStyle = {
  processing: 'bg-[#f2c200]/15 text-[#f2c200]',
  shipped: 'bg-sky-400/15 text-sky-300',
  delivered: 'bg-[#2e9e3e]/20 text-[#6fd17f]',
  cancelled: 'bg-cream/10 text-muted',
}

function Status({ s, label }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[s]}`}><span className="size-1.5 rounded-full bg-current" />{label}</span>
}

/* ---------- orders ---------- */

function OrderCard({ o, a, f, products, addresses, onAdd, open, onToggle, grindLabel }) {
  const ref = useRef(null)
  const [done, setDone] = useState(false)
  const { subtotal, total } = orderTotals(o)
  const count = o.items.reduce((s, i) => s + i.qty, 0)
  const addr = addresses.find((x) => x.id === o.addressId)
  const earned = o.status === 'cancelled' ? 0 : Math.floor(subtotal * pointsRules.perEuro)

  useGSAP(() => {
    const body = ref.current.querySelector('.oc-body')
    if (!body) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(body, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: 0.5, ease: 'expo.out' })
  }, { scope: ref, dependencies: [open] })

  const reorder = (e) => {
    o.items.forEach((i) => { const p = products.find((x) => x.id === i.productId); if (p) for (let k = 0; k < i.qty; k++) onAdd(p, { size: i.size, grind: i.grind, roast: 'roasted', qty: 1 }) })
    flyToCart(e.currentTarget)
    setDone(true); setTimeout(() => setDone(false), 2000)
  }

  return (
    <article ref={ref} className="ac-in overflow-hidden rounded-3xl border border-cream/10 bg-roast/70">
      <button onClick={onToggle} aria-expanded={open} className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 p-5 text-left transition-colors hover:bg-cream/[0.03] md:grid-cols-[auto_1fr_auto_auto_auto] md:p-6">
        <div className="flex -space-x-3" aria-hidden="true">
          {o.items.slice(0, 3).map((i) => { const p = products.find((x) => x.id === i.productId); return p && <span key={i.productId} className="w-9 drop-shadow-[0_6px_6px_rgba(0,0,0,.4)]"><Bag product={p} /></span> })}
        </div>
        <div className="hidden md:block">
          <p className="font-display text-xl text-cream">{a.order} #{o.id}</p>
          <p className="text-sm text-muted">{f.date(o.date)} · {a.items(count)}</p>
        </div>
        <div className="min-w-0 md:hidden"><p className="font-display text-xl text-cream">#{o.id}</p><p className="text-xs text-muted">{f.date(o.date)}</p></div>
        <p className="text-right font-semibold tabular-nums text-cream md:hidden">{f.money(total)}</p>
        <span className="col-span-3 md:col-span-1"><Status s={o.status} label={a.status[o.status]} /></span>
        <p className="hidden font-semibold tabular-nums text-cream md:block">{f.money(total)}</p>
        <span className="hidden text-sm text-gold md:block">{open ? a.hide : a.show}</span>
      </button>
      {open && (
        <div className="oc-body overflow-hidden border-t border-cream/10">
          <div className="grid gap-6 p-5 md:grid-cols-[1.4fr_1fr] md:p-6">
            <ul className="min-w-0 space-y-3">
              {o.items.map((i) => {
                const p = products.find((x) => x.id === i.productId)
                return p && (
                  <li key={i.productId} className="flex items-center gap-4 rounded-2xl bg-espresso/40 p-3">
                    <Link to={`/products/${p.id}`} className="w-11 shrink-0"><Bag product={p} /></Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/products/${p.id}`} className="block truncate font-display text-lg text-cream hover:text-gold">{p.name}</Link>
                      <p className="text-xs text-muted">{i.size} · {grindLabel(i.grind)} · ×{i.qty}</p>
                    </div>
                    <p className="text-sm tabular-nums text-cream">{f.money(i.price * i.qty)}</p>
                  </li>
                )
              })}
            </ul>
            <div className="space-y-4 text-sm">
              {addr && <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{a.shipTo}</p><p className="mt-1 text-cream/80">{addr.name}<br />{addr.street}, {addr.zip} {addr.city}</p></div>}
              <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{a.payment}</p><p className="mt-1 text-cream/80">{o.payment}</p></div>
              <dl className="space-y-1.5 border-t border-cream/10 pt-4">
                <div className="flex justify-between text-cream/70"><dt>{a.subtotal}</dt><dd className="tabular-nums">{f.money(subtotal)}</dd></div>
                <div className="flex justify-between text-cream/70"><dt>{a.shipping}</dt><dd className="tabular-nums">{o.shipping ? f.money(o.shipping) : a.free}</dd></div>
                <div className="flex justify-between font-semibold text-cream"><dt>{a.total}</dt><dd className="tabular-nums">{f.money(total)}</dd></div>
                {earned > 0 && <p className="pt-1 text-right text-xs text-gold">{a.earned(earned)}</p>}
              </dl>
              <Button as="button" onClick={reorder} className="w-full justify-center">{done ? <><Check2 className="size-4" /> {a.reordered}</> : a.reorder}</Button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

function Orders({ customer, a, f, products, onAdd, grindLabel }) {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(customer.orders[0]?.id)
  const statuses = ['all', ...new Set(customer.orders.map((o) => o.status))]
  const list = customer.orders.filter((o) => filter === 'all' || o.status === filter)
  return (
    <div>
      {customer.orders.length > 0 && (
        <div className="ac-in mb-6 flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button key={s} onClick={() => setFilter(s)} aria-pressed={filter === s}
              className={`min-h-10 rounded-full px-4 text-sm transition-colors ${filter === s ? 'bg-gold text-espresso' : 'border border-cream/15 text-cream/75 hover:border-gold/50'}`}>
              {s === 'all' ? a.filterAll : a.status[s]}
            </button>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {list.map((o) => <OrderCard key={o.id} o={o} a={a} f={f} products={products} addresses={customer.addresses} onAdd={onAdd} open={open === o.id} onToggle={() => setOpen(open === o.id ? null : o.id)} grindLabel={grindLabel} />)}
        {!list.length && <Empty text={a.empty} />}
      </div>
    </div>
  )
}

/* ---------- addresses ---------- */

const blank = { label: '', name: '', street: '', floor: '', city: '', zip: '', phone: '' }

function AddressForm({ initial, a, p, onSave, onCancel }) {
  const [v, setV] = useState({ ...blank, ...initial })
  const [err, setErr] = useState({})
  const set = (k, val) => { setV((s) => ({ ...s, [k]: val })); setErr((e) => ({ ...e, [k]: undefined })) }
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    for (const k of ['name', 'street', 'city', 'zip']) if (!v[k].trim()) er[k] = p.errors.required
    if (v.zip && !/^\d{3}\s?\d{2}$/.test(v.zip.trim())) er.zip = a.zipError
    if (v.phone && !/^\+?[\d\s]{10,15}$/.test(v.phone.trim())) er.phone = a.phoneError
    setErr(er)
    if (!Object.keys(er).length) onSave(v)
  }
  const F = (k, auto, cls = '') => <Field label={a.fields[k]} name={k} value={v[k]} onChange={set} error={err[k]} autoComplete={auto} className={cls} />
  return (
    <form onSubmit={submit} noValidate className="ac-in grid gap-4 rounded-3xl border border-gold/30 bg-roast/80 p-5 sm:grid-cols-2 md:p-6">
      {F('label', 'off', 'sm:col-span-2')}
      {F('name', 'name', 'sm:col-span-2')}
      {F('street', 'street-address')}
      {F('floor', 'address-line2')}
      {F('city', 'address-level2')}
      {F('zip', 'postal-code')}
      {F('phone', 'tel', 'sm:col-span-2')}
      <div className="flex gap-3 sm:col-span-2">
        <Button as="button" type="submit">{a.save}</Button>
        <Button as="button" variant="ghost" onClick={onCancel}>{a.cancel}</Button>
      </div>
    </form>
  )
}

function Addresses({ customer, a, p }) {
  const { saveAddresses } = useAuth()
  const [editing, setEditing] = useState(null) // address id, 'new' or null
  const [confirm, setConfirm] = useState(null)
  const list = customer.addresses

  const save = async (v) => {
    const next = editing === 'new'
      ? [...list, { ...v, id: `a${Date.now()}`, isDefault: list.length === 0 }]
      : list.map((x) => (x.id === editing ? { ...x, ...v } : x))
    await saveAddresses(next); setEditing(null)
  }
  const remove = async (id) => {
    let next = list.filter((x) => x.id !== id)
    if (next.length && !next.some((x) => x.isDefault)) next = next.map((x, i) => ({ ...x, isDefault: i === 0 }))
    await saveAddresses(next); setConfirm(null)
  }
  const makeDefault = (id) => saveAddresses(list.map((x) => ({ ...x, isDefault: x.id === id })))

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((x) => editing === x.id ? (
          <div key={x.id} className="md:col-span-2"><AddressForm initial={x} a={a} p={p} onSave={save} onCancel={() => setEditing(null)} /></div>
        ) : (
          <div key={x.id} className={`ac-in relative rounded-3xl border p-6 ${x.isDefault ? 'border-gold/50 bg-gold/[0.06]' : 'border-cream/10 bg-roast/70'}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-2xl text-cream">{x.label || x.city}</p>
              {x.isDefault && <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-espresso">{a.default}</span>}
            </div>
            <address className="mt-3 not-italic leading-relaxed text-cream/75">
              {x.name}<br />{x.street}{x.floor && `, ${x.floor}`}<br />{x.zip} {x.city}{x.phone && <><br />{x.phone}</>}
            </address>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <button onClick={() => setEditing(x.id)} className="min-h-10 text-gold hover:underline">{a.edit}</button>
              {!x.isDefault && <button onClick={() => makeDefault(x.id)} className="min-h-10 text-cream/70 hover:text-gold">{a.makeDefault}</button>}
              {confirm === x.id
                ? <span className="flex items-center gap-3"><button onClick={() => remove(x.id)} className="min-h-10 font-semibold text-red-300">{a.confirmRemove} {a.remove}</button><button onClick={() => setConfirm(null)} aria-label={a.cancel} className="text-muted"><Close className="size-4" /></button></span>
                : <button onClick={() => setConfirm(x.id)} className="min-h-10 text-cream/50 hover:text-red-300">{a.remove}</button>}
            </div>
          </div>
        ))}
        {editing !== 'new' && (
          <button onClick={() => setEditing('new')} className="ac-in group grid min-h-48 place-items-center rounded-3xl border border-dashed border-cream/20 p-6 text-cream/70 transition-colors hover:border-gold hover:text-gold">
            <span className="flex flex-col items-center gap-3"><span className="grid size-12 place-items-center rounded-full bg-gold/15 text-gold transition-transform group-hover:rotate-90"><Plus /></span>{a.add}</span>
          </button>
        )}
      </div>
      {editing === 'new' && <AddressForm initial={{ name: `${customer.firstName} ${customer.lastName}`.trim() }} a={a} p={p} onSave={save} onCancel={() => setEditing(null)} />}
      {!list.length && editing !== 'new' && <Empty text={a.empty} />}
    </div>
  )
}

/* ---------- points ---------- */

function PointsRing({ value, max, size = 'size-44' }) {
  const c = 2 * Math.PI * 52
  return (
    <svg viewBox="0 0 120 120" className={`${size} -rotate-90`} aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="none" stroke="#f5efe6" strokeOpacity=".1" strokeWidth="8" />
      <circle className="pt-ring" cx="60" cy="60" r="52" fill="none" stroke="url(#ptg)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, value / max))} data-c={c} data-off={c * (1 - Math.min(1, value / max))} />
      <defs><linearGradient id="ptg" x1="0" x2="1"><stop offset="0" stopColor="#d7261e" /><stop offset=".5" stopColor="#f2c200" /><stop offset="1" stopColor="#2e9e3e" /></linearGradient></defs>
    </svg>
  )
}

function Points({ customer, points, a, f }) {
  const r = pointsRules
  const toNext = r.rewardPoints - (points % r.rewardPoints)
  const worth = Math.floor(points / r.rewardPoints) * r.rewardValue
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <div className="ac-in flex flex-col items-center rounded-3xl border border-cream/10 bg-roast/70 p-8 text-center">
        <div className="relative grid place-items-center">
          <PointsRing value={points % r.rewardPoints} max={r.rewardPoints} />
          <p className="pt-count absolute font-display text-5xl tabular-nums text-cream" data-v={points}>{points}</p>
        </div>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">{a.balance}</p>
        {worth > 0 && <p className="mt-5 text-gold">{a.worth(f.money(worth))}</p>}
        <p className="mt-2 text-sm text-cream/70">{a.nextReward(toNext, f.money(r.rewardValue))}</p>
        <div className="mt-8 w-full text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{a.howTitle}</p>
          <ul className="mt-3 space-y-2">
            {a.how.map(([k, fn]) => <li key={k} className="flex gap-3 rounded-2xl bg-espresso/40 p-3 text-sm"><span className="font-semibold text-gold">{k}</span><span className="text-cream/75">{fn(r, f.money)}</span></li>)}
          </ul>
          <p className="mt-3 text-xs text-muted">{a.placeholder}</p>
        </div>
      </div>
      <div className="ac-in rounded-3xl border border-cream/10 bg-roast/70 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{a.history}</p>
        <ol className="mt-4 divide-y divide-cream/10">
          {customer.pointsHistory.map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <p className="text-cream">{a.types[h.type]}{h.ref && <span className="text-muted"> · #{h.ref}</span>}</p>
                <p className="text-xs text-muted">{f.date(h.date)}</p>
              </div>
              <span className={`font-semibold tabular-nums ${h.points < 0 ? 'text-cream/50' : 'text-[#6fd17f]'}`}>{h.points > 0 ? '+' : ''}{h.points}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ---------- overview ---------- */

function Overview({ customer, points, tx, f, products }) {
  const o = tx.page.overview
  const last = customer.orders[0]
  const stats = [[o.points, points, '/account/points'], [o.orders, customer.orders.length, '/account/orders'], [o.addresses, customer.addresses.length, '/account/addresses']]
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {stats.map(([label, val, to]) => (
        <Link key={label} to={to} className="ac-in group rounded-3xl border border-cream/10 bg-roast/70 p-6 transition-colors hover:border-gold/50">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
          <p className="mt-3 flex items-end justify-between font-display text-5xl tabular-nums text-cream"><span className="ov-count" data-v={val}>{val}</span><ArrowRight className="mb-3 size-5 text-gold transition-transform group-hover:translate-x-1" /></p>
        </Link>
      ))}
      <div className="ac-in rounded-3xl border border-cream/10 bg-roast/70 p-6 lg:col-span-2">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{o.lastOrder}</p>
          {last && <Link to="/account/orders" className="text-sm text-gold hover:underline">{o.viewAll}</Link>}
        </div>
        {last ? (
          <div className="mt-5 flex flex-wrap items-center gap-5">
            <div className="flex -space-x-3" aria-hidden="true">{last.items.map((i) => { const p = products.find((x) => x.id === i.productId); return p && <span key={i.productId} className="w-12"><Bag product={p} /></span> })}</div>
            <div className="flex-1">
              <p className="font-display text-2xl text-cream">#{last.id}</p>
              <p className="text-sm text-muted">{f.date(last.date)} · {f.money(orderTotals(last).total)}</p>
            </div>
            <Status s={last.status} label={tx.page.orders.status[last.status]} />
            {last.status === 'shipped' && <Truck className="size-6 text-sky-300" />}
          </div>
        ) : (
          <div className="mt-5"><p className="text-cream/70">{o.noOrders}</p><Button as={Link} to="/#shop" className="mt-4">{o.shop}</Button></div>
        )}
      </div>
      <div className="ac-in rounded-3xl border border-cream/10 bg-roast/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{o.details}</p>
        <p className="mt-4 font-display text-2xl text-cream">{customer.firstName} {customer.lastName}</p>
        <p className="mt-1 break-all text-sm text-cream/70">{customer.email}</p>
        <p className="mt-3 text-xs text-muted">{tx.page.memberSince(f.month(customer.createdAt))}</p>
      </div>
    </div>
  )
}

function Empty({ text }) {
  return <p className="ac-in rounded-3xl border border-dashed border-cream/15 p-10 text-center text-cream/60">{text}</p>
}

/* ---------- page ---------- */

export default function AccountPage({ onAdd }) {
  const { section = 'overview' } = useParams()
  const tab = tabIds.includes(section) ? section : 'overview'
  const { t } = useLang()
  const tx = accountText[t.code]
  const { customer, ready, points, logout, openPanel } = useAuth()
  const f = useFormat(t.code)
  const products = localizedProducts(t)
  const root = useRef(null)

  useEffect(() => {
    const id = setTimeout(() => { document.title = `${tx.page.eyebrow} — FUERTE` }, 0)
    return () => { clearTimeout(id); document.title = t.meta.title }
  }, [tx, t])

  // Entrance for the header once, and for the tab content on every tab change.
  useGSAP(() => {
    if (!customer) return
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.from('.ac-head > *', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.07, ease: 'expo.out' })
    })
  }, { scope: root, dependencies: [!!customer] })

  useGSAP(() => {
    if (!customer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo('.ac-body .ac-in', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.06, ease: 'expo.out' })
    // Count numbers up and draw the points ring.
    root.current.querySelectorAll('.ov-count, .pt-count').forEach((el) => {
      const n = { v: 0 }; const to = +el.dataset.v
      gsap.to(n, { v: to, duration: 1.2, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(n.v) } })
    })
    const ring = root.current.querySelector('.pt-ring')
    if (ring) gsap.fromTo(ring, { strokeDashoffset: +ring.dataset.c }, { strokeDashoffset: +ring.dataset.off, duration: 1.4, ease: 'power3.out' })
    gsap.to('.ac-tab-pill', { x: root.current.querySelector('[aria-current=page]')?.offsetLeft ?? 0, width: root.current.querySelector('[aria-current=page]')?.offsetWidth ?? 0, duration: 0.6, ease: 'expo.out' })
  }, { scope: root, dependencies: [tab, !!customer, t.code] })

  if (!ready) return <main className="min-h-svh" />

  if (!customer) {
    return (
      <main className="relative isolate grid min-h-[90svh] place-items-center px-5 pt-28 pb-16">
        <PhotoBg name="beans" widths={[960, 1920]} eager blur={3} overlay="rgba(23,17,12,.9)" />
        <div className="relative max-w-lg text-center">
          <Eyebrow className="justify-center">{tx.page.eyebrow}</Eyebrow>
          <h1 className="mt-6 font-display text-[clamp(2.8rem,6vw,4.5rem)] leading-[0.95] text-cream">{tx.page.signedOutTitle} <em className="text-gold">{tx.page.signedOutTitleEm}</em></h1>
          <p className="mt-5 text-cream/70">{tx.page.signedOutText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button as="button" onClick={() => openPanel('login')}>{tx.panel.login}</Button>
            <Button as="button" variant="ghost" onClick={() => openPanel('register')}>{tx.panel.registerTab}</Button>
          </div>
          <p className="mt-10 text-xs text-muted">{tx.demo}</p>
        </div>
      </main>
    )
  }

  const a = tx.page
  return (
    <main ref={root}>
      <section className="relative isolate overflow-hidden">
        <PhotoBg name="beans" widths={[960, 1920]} eager blur={2} overlay="linear-gradient(180deg, rgba(23,17,12,.82), rgba(23,17,12,1))" />
        <div className="ac-head relative mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-5 pt-36 pb-10 md:px-8 md:pt-40">
          <div>
            <Eyebrow>{a.eyebrow}</Eyebrow>
            <h1 className="mt-5 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.9] text-cream">{a.hello(customer.firstName)} <em className="text-gold">{customer.firstName}.</em></h1>
          </div>
          <button onClick={logout} className="min-h-11 rounded-full border border-cream/20 px-5 text-sm text-cream/80 transition-colors hover:border-gold hover:text-gold">{a.logout}</button>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <nav aria-label={a.eyebrow} className="relative mb-8 flex gap-1 overflow-x-auto rounded-full border border-cream/10 bg-roast/80 p-1 [scrollbar-width:none]">
          <span className="ac-tab-pill absolute left-0 top-1 bottom-1 rounded-full bg-gold" aria-hidden="true" />
          {tabIds.map((id) => (
            <NavLink key={id} to={id === 'overview' ? '/account' : `/account/${id}`} end
              className={({ isActive }) => `relative z-10 flex min-h-11 shrink-0 items-center rounded-full px-5 text-sm font-medium transition-colors ${isActive ? 'text-espresso' : 'text-cream/75 hover:text-cream'}`}>
              {a.tabs[id]}
            </NavLink>
          ))}
        </nav>

        <div className="ac-body" key={tab}>
          {tab === 'overview' && <Overview customer={customer} points={points} tx={tx} f={f} products={products} />}
          {tab === 'orders' && <Orders customer={customer} a={a.orders} f={f} products={products} onAdd={onAdd} grindLabel={(g) => t.pdp.grinds[g] || g} />}
          {tab === 'addresses' && <Addresses customer={customer} a={a.addresses} p={tx.panel} />}
          {tab === 'points' && <Points customer={customer} points={points} a={a.points} f={f} />}
        </div>
        <p className="mt-12 text-center text-xs text-muted">{tx.demo}</p>
      </div>
    </main>
  )
}
