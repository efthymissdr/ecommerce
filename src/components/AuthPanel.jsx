import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, useGSAP } from '../lib/gsap'
import { useLang } from '../i18n'
import { useAuth } from '../account/AuthContext'
import { accountText } from '../account/text'
import { demoUser } from '../account/service'
import { Close, Check2, ArrowRight, User } from './Art'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

// Text field with label, inline error and (for passwords) a show/hide toggle.
export function Field({ label, error, type = 'text', name, value, onChange, autoComplete, showLabel, hideLabel, className = '' }) {
  const [shown, setShown] = useState(false)
  const id = `f-${name}`
  const isPw = type === 'password'
  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</label>
      <div className="relative mt-2">
        <input
          id={id} name={name} value={value} onChange={(e) => onChange(name, e.target.value)}
          type={isPw && shown ? 'text' : type} autoComplete={autoComplete}
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
          className={`block w-full rounded-2xl border bg-espresso/60 px-4 py-3 text-cream placeholder:text-muted transition-colors focus:outline-none ${isPw ? 'pr-12' : ''} ${error ? 'border-red-400/70 focus:border-red-400' : 'border-cream/15 focus:border-gold'}`}
        />
        {isPw && (
          <button type="button" onClick={() => setShown((s) => !s)} aria-label={shown ? hideLabel : showLabel} aria-pressed={shown}
            className="absolute inset-y-0 right-1 my-auto grid size-10 place-items-center rounded-full text-muted transition-colors hover:text-gold">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
              {shown && <path d="M4 4l16 16" />}
            </svg>
          </button>
        )}
      </div>
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  )
}

function Checkbox({ name, checked, onChange, children, error }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-cream/75">
        <input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(name, e.target.checked)} className="peer sr-only" />
        <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold ${checked ? 'border-gold bg-gold text-espresso' : error ? 'border-red-400/70' : 'border-cream/30'}`}>
          {checked && <Check2 className="size-3.5" />}
        </span>
        {children}
      </label>
      {error && <p className="mt-1 pl-8 text-xs text-red-300">{error}</p>}
    </div>
  )
}

function Spinner() {
  return <span className="size-4 animate-spin rounded-full border-2 border-espresso/30 border-t-espresso" aria-hidden="true" />
}

/* ---------- forms ---------- */

function LoginForm({ p, onSwitch, onDone }) {
  const { login, requestPasswordReset } = useAuth()
  const [v, setV] = useState({ email: '', password: '', remember: true })
  const [err, setErr] = useState({})
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const set = (k, val) => { setV((s) => ({ ...s, [k]: val })); setErr((e) => ({ ...e, [k]: undefined, form: undefined })) }

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!v.email.trim()) er.email = p.errors.required; else if (!emailOk(v.email)) er.email = p.errors.email
    if (!v.password) er.password = p.errors.required; else if (v.password.length < 8) er.password = p.errors.password
    setErr(er)
    if (Object.keys(er).length) return
    setBusy(true)
    try { await login(v); onDone() } catch (x) { setErr({ form: p.errors[x.message] || x.message }) } finally { setBusy(false) }
  }

  const forgot = async () => {
    if (!emailOk(v.email)) { setErr({ email: p.forgotNeedEmail }); return }
    await requestPasswordReset(v.email)
    setNote(p.forgotSent(v.email.trim()))
  }

  return (
    <form onSubmit={submit} noValidate className="ap-in space-y-5">
      <Field label={p.email} name="email" type="email" autoComplete="email" value={v.email} onChange={set} error={err.email} />
      <Field label={p.password} name="password" type="password" autoComplete="current-password" value={v.password} onChange={set} error={err.password} showLabel={p.show} hideLabel={p.hide} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Checkbox name="remember" checked={v.remember} onChange={set}>{p.remember}</Checkbox>
        <button type="button" onClick={forgot} className="text-sm text-gold underline-offset-4 hover:underline">{p.forgot}</button>
      </div>
      {note && <p role="status" className="rounded-2xl border border-gold/30 bg-gold/10 p-3 text-sm text-cream/85">{note}</p>}
      {err.form && <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-200">{err.form}</p>}
      <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-gold px-7 text-sm font-semibold text-espresso transition-colors hover:bg-crema disabled:opacity-70">
        {busy ? <Spinner /> : <>{p.login} <ArrowRight className="size-4" /></>}
      </button>
      {/* Demo only: remove when Shopify login is connected. */}
      <div className="rounded-2xl border border-dashed border-gold/40 p-4 text-center">
        <button type="button" disabled={busy}
          onClick={async () => { setBusy(true); try { await login({ ...demoUser, remember: true }); onDone() } finally { setBusy(false) } }}
          className="min-h-11 w-full rounded-full border border-gold/60 px-5 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-espresso">
          {p.demoUser}
        </button>
        <p className="mt-2 text-xs text-muted">{p.demoHint(demoUser.email, demoUser.password)}</p>
      </div>
      <p className="text-center text-sm text-cream/60">{p.noAccount} <button type="button" onClick={onSwitch} className="font-semibold text-gold hover:underline">{p.switchRegister}</button></p>
    </form>
  )
}

function RegisterForm({ p, onSwitch, onDone }) {
  const { register } = useAuth()
  const [v, setV] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', newsletter: false, terms: false })
  const [err, setErr] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (k, val) => { setV((s) => ({ ...s, [k]: val })); setErr((e) => ({ ...e, [k]: undefined, form: undefined })) }

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    for (const k of ['firstName', 'lastName']) if (!v[k].trim()) er[k] = p.errors.required
    if (!v.email.trim()) er.email = p.errors.required; else if (!emailOk(v.email)) er.email = p.errors.email
    if (v.password.length < 8) er.password = p.errors.password
    if (v.confirm !== v.password) er.confirm = p.errors.confirm
    if (!v.terms) er.terms = p.errors.terms
    setErr(er)
    if (Object.keys(er).length) return
    setBusy(true)
    try { await register(v); onDone() } catch (x) { setErr({ form: p.errors[x.message] || x.message }) } finally { setBusy(false) }
  }

  // Simple strength meter: length, digits, mixed case, symbols.
  const strength = [v.password.length >= 8, /\d/.test(v.password), /[a-zα-ω]/.test(v.password) && /[A-ZΑ-Ω]/.test(v.password), /[^\w\sα-ωΑ-Ω]/.test(v.password)].filter(Boolean).length

  return (
    <form onSubmit={submit} noValidate className="ap-in space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={p.firstName} name="firstName" autoComplete="given-name" value={v.firstName} onChange={set} error={err.firstName} />
        <Field label={p.lastName} name="lastName" autoComplete="family-name" value={v.lastName} onChange={set} error={err.lastName} />
      </div>
      <Field label={p.email} name="email" type="email" autoComplete="email" value={v.email} onChange={set} error={err.email} />
      <div>
        <Field label={p.password} name="password" type="password" autoComplete="new-password" value={v.password} onChange={set} error={err.password} showLabel={p.show} hideLabel={p.hide} />
        <div className="mt-2 flex gap-1" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < strength ? ['bg-[#d7261e]', 'bg-[#f2c200]', 'bg-[#2e9e3e]', 'bg-[#2e9e3e]'][strength - 1] : 'bg-cream/10'}`} />
          ))}
        </div>
      </div>
      <Field label={p.confirm} name="confirm" type="password" autoComplete="new-password" value={v.confirm} onChange={set} error={err.confirm} showLabel={p.show} hideLabel={p.hide} />
      <Checkbox name="newsletter" checked={v.newsletter} onChange={set}>{p.newsletter}</Checkbox>
      <Checkbox name="terms" checked={v.terms} onChange={set} error={err.terms}>{p.terms}</Checkbox>
      {err.form && <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-200">{err.form}</p>}
      <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-gold px-7 text-sm font-semibold text-espresso transition-colors hover:bg-crema disabled:opacity-70">
        {busy ? <Spinner /> : <>{p.register} <ArrowRight className="size-4" /></>}
      </button>
      <p className="text-center text-sm text-cream/60">{p.haveAccount} <button type="button" onClick={onSwitch} className="font-semibold text-gold hover:underline">{p.switchLogin}</button></p>
    </form>
  )
}

/* ---------- signed-in summary ---------- */

function SignedIn({ p, onClose }) {
  const { customer, points, logout } = useAuth()
  const { t } = useLang()
  const a = accountText[t.code].page
  const links = [['', a.tabs.overview], ['/orders', a.tabs.orders], ['/addresses', a.tabs.addresses], ['/points', a.tabs.points]]
  return (
    <div className="ap-in">
      <div className="flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-full bg-gold font-display text-2xl text-espresso">{customer.firstName.slice(0, 1).toUpperCase()}</span>
        <div>
          <p className="font-display text-3xl text-cream">{p.hello(customer.firstName)}</p>
          <p className="text-sm text-gold">{p.points(points)}</p>
        </div>
      </div>
      <nav className="mt-8 grid gap-2">
        {links.map(([to, label]) => (
          <Link key={to} to={`/account${to}`} onClick={onClose} className="group flex min-h-12 items-center justify-between rounded-2xl border border-cream/10 bg-espresso/40 px-5 text-cream transition-colors hover:border-gold/50">
            {label} <ArrowRight className="size-4 text-gold transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </nav>
      <button onClick={() => { logout(); onClose() }} className="mt-6 min-h-11 text-sm text-cream/60 underline-offset-4 hover:text-gold hover:underline">{p.logout}</button>
    </div>
  )
}

/* ---------- panel ---------- */

export default function AuthPanel() {
  const { t } = useLang()
  const tx = accountText[t.code]
  const p = tx.panel
  const { panel, closePanel, openPanel, customer } = useAuth()
  const root = useRef(null)
  const lastFocus = useRef(null)
  const [mounted, setMounted] = useState(false)
  const mode = panel || 'login'
  const open = !!panel
  const body = useRef(null)
  const lastHeight = useRef(0)
  const lastMode = useRef(mode)

  // Open / close with a slide; stay mounted until the exit animation ends.
  useEffect(() => {
    if (panel) { lastFocus.current = document.activeElement; setMounted(true) }
  }, [panel])

  useGSAP(() => {
    if (!mounted) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const d = reduce ? 0 : 1
    if (panel) {
      gsap.timeline()
        .fromTo('.ap-overlay', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 * d })
        .fromTo('.ap-sheet', { xPercent: 100 }, { xPercent: 0, duration: 0.7 * d, ease: 'expo.out' }, 0)
      // After the fields start fading in (hidden elements can't take focus).
      setTimeout(() => {
        const first = root.current?.querySelector('.ap-sheet input') || root.current?.querySelector('.ap-sheet a, .ap-sheet button')
        first?.focus({ preventScroll: true })
      }, 350 * d)
    } else {
      gsap.timeline({ onComplete: () => { setMounted(false); lastFocus.current?.focus?.({ preventScroll: true }) } })
        .to('.ap-sheet', { xPercent: 100, duration: 0.5 * d, ease: 'expo.in' })
        .to('.ap-overlay', { autoAlpha: 0, duration: 0.3 * d }, '-=0.2')
    }
  }, { scope: root, dependencies: [open, mounted] })

  // Content entrance when the panel opens (or after logging in / out).
  useGSAP(() => {
    if (!open || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo('.ap-in', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: 'expo.out', delay: 0.15 })
  }, { scope: root, dependencies: [open, !!customer, mounted] })

  // Switching between log in and sign up: the new content slides in from the
  // side of its tab, and the height eases from the old size to the new one.
  // Transform, opacity and one height tween only, so it stays light.
  useGSAP(() => {
    const el = body.current
    if (!el) return
    const from = lastHeight.current
    const to = el.offsetHeight
    lastHeight.current = to
    if (lastMode.current === mode) return
    const dir = mode === 'register' ? 1 : -1
    lastMode.current = mode
    if (!from || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.killTweensOf([el, el.children])
    gsap.fromTo(el, { height: from, overflow: 'hidden' }, { height: to, duration: 0.45, ease: 'power3.out', clearProps: 'height,overflow' })
    gsap.fromTo(el.children, { x: 28 * dir, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, stagger: 0.04, ease: 'power3.out', clearProps: 'transform,opacity,visibility' })
  }, { scope: root, dependencies: [mode, mounted, !!customer] })

  // Pill under the active tab.
  useGSAP(() => {
    const active = root.current?.querySelector('[role=tab][aria-selected=true]')
    if (active) gsap.to('.ap-pill', { x: active.offsetLeft, width: active.offsetWidth, duration: mounted ? 0.5 : 0, ease: 'expo.out' })
  }, { scope: root, dependencies: [mode, mounted, !!customer] })

  // Esc closes; Tab stays inside the panel.
  useEffect(() => {
    if (!panel) return
    const onKey = (e) => {
      if (e.key === 'Escape') closePanel()
      if (e.key !== 'Tab') return
      const f = [...root.current.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent)
      if (!f.length) return
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus() }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [panel, closePanel])

  if (!mounted) return null

  return (
    <div ref={root} className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-labelledby="ap-title">
      <div className="ap-overlay absolute inset-0 bg-espresso/70 backdrop-blur-sm" onClick={closePanel} />
      <aside data-lenis-prevent className="ap-sheet absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto border-l border-cream/10 bg-roast shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 md:px-8">
          <img src="/img/logo.webp" alt="FUERTE" className="h-9 w-auto" />
          <button onClick={closePanel} aria-label={p.close} className="grid size-11 place-items-center rounded-full text-cream transition-colors hover:bg-cream/10"><Close /></button>
        </div>

        <div className="flex-1 px-6 pt-8 pb-10 md:px-8">
          {customer ? (
            <>
              <h2 id="ap-title" className="sr-only">{p.goAccount}</h2>
              <SignedIn p={p} onClose={closePanel} />
            </>
          ) : (
            <>
              <div role="tablist" aria-label={p.loginTab} className="relative inline-flex rounded-full border border-cream/10 bg-espresso/50 p-1">
                <span className="ap-pill absolute left-0 top-1 bottom-1 rounded-full bg-gold" aria-hidden="true" />
                {[['login', p.loginTab], ['register', p.registerTab]].map(([m, label]) => (
                  <button key={m} role="tab" aria-selected={mode === m} onClick={() => openPanel(m)}
                    className={`relative z-10 min-h-10 rounded-full px-5 text-sm font-semibold transition-colors ${mode === m ? 'text-espresso' : 'text-cream/70 hover:text-cream'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <div ref={body}>
              <h2 id="ap-title" className="ap-in mt-8 font-display text-5xl leading-[0.95] text-cream">
                {mode === 'login' ? p.loginTitle : p.registerTitle} <em className="text-gold">{mode === 'login' ? p.loginTitleEm : p.registerTitleEm}</em>
              </h2>
              <p className="ap-in mt-3 text-cream/65">{mode === 'login' ? p.loginIntro : p.registerIntro}</p>
              {mode === 'register' && (
                <ul className="ap-in mt-5 flex flex-wrap gap-2">
                  {p.perks.map((x) => <li key={x} className="flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-xs text-cream/85"><Check2 className="size-3.5 text-gold" />{x}</li>)}
                </ul>
              )}
              <div className="mt-8" key={mode}>
                {mode === 'login'
                  ? <LoginForm p={p} onSwitch={() => openPanel('register')} onDone={closePanel} />
                  : <RegisterForm p={p} onSwitch={() => openPanel('login')} onDone={closePanel} />}
              </div>
              </div>
            </>
          )}
        </div>
        <p className="flex items-start gap-2 border-t border-cream/10 px-6 py-4 text-xs leading-relaxed text-muted md:px-8">
          <User className="mt-0.5 size-4 shrink-0" /> {tx.demo}
        </p>
      </aside>
    </div>
  )
}
