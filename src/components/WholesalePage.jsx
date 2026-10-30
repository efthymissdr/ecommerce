import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, FULL } from '../lib/gsap'
import { useLang } from '../i18n'
import { wholesaleContent, wholesaleEmail } from '../data/wholesale'
import { Bag, ArrowRight, Check2 } from './Art'
import { Eyebrow, Magnetic, Button, PhotoBg } from './ui'
import { composeEnquiry, sendEnquiry, enquiryKey } from '../lib/enquiry'
import PhoneField from './PhoneField'

/* ---------- icons ---------- */

const ico = (d) => function Icon() {
  return <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
}
const icons = {
  box: ico(<><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></>),
  tag: ico(<><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" /><circle cx="7.5" cy="7.5" r="1.5" /></>),
  beans: ico(<><ellipse cx="9" cy="13" rx="4.5" ry="6.5" transform="rotate(-25 9 13)" /><path d="M7 7.5c1.5 3-1 7 1.5 11" /><ellipse cx="17" cy="9" rx="3.2" ry="4.6" transform="rotate(20 17 9)" /></>),
  cup: ico(<><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" /><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" /><path d="M8 3c-1 1.2 1 2 0 3.5M12 3c-1 1.2 1 2 0 3.5" /></>),
  store: ico(<><path d="M4 9h16l-1-5H5z" /><path d="M5 9v11h14V9" /><path d="M10 20v-5h4v5" /></>),
  truck: ico(<><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>),
  machine: ico(<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M4 8h16" /><path d="M9 12h6l-1 4h-4z" /><path d="M8 5.5h.01M11 5.5h.01" /></>),
  support: ico(<><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /><path d="M19 20a3 3 0 0 1-3 2h-2" /></>),
  grinder: ico(<><path d="M8 3h8l-1 5H9z" /><rect x="6" y="8" width="12" height="11" rx="2" /><path d="M10 13h4M9 22h6" /></>),
  chat: ico(<><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></>),
}

/* ---------- visuals per section ---------- */

function PrivateLabelArt({ label }) {
  // Three blank bags in the logo colours, each labelled "your brand".
  const bags = [
    { id: 'pl-r', bag: '#d7261e', ink: '#f5efe6' },
    { id: 'pl-y', bag: '#f2c200', ink: '#17110c' },
    { id: 'pl-g', bag: '#2e9e3e', ink: '#f5efe6' },
  ].map((b) => ({ ...b, name: label, bagName: label, kicker: 'Private label', weight: '250g', roast: 3 }))
  return (
    <div className="relative grid aspect-[4/3.4] place-items-center overflow-hidden rounded-[2.5rem] border border-cream/10 bg-[radial-gradient(circle_at_50%_45%,rgba(200,161,90,.25),rgba(36,27,20,.95)_70%)]">
      <div className="relative flex w-[86%] items-end justify-center">
        {bags.map((b, i) => (
          <div key={b.id} className={`ws-bag w-[38%] drop-shadow-[0_30px_30px_rgba(0,0,0,.5)] ${i === 1 ? 'z-10 -mx-[6%] mb-[6%]' : ''}`} style={{ rotate: `${(i - 1) * 8}deg` }}>
            <Bag product={b} />
          </div>
        ))}
      </div>
    </div>
  )
}

function PhotoArt({ src, children }) {
  return (
    <div className="ws-photo relative aspect-[4/3.4] overflow-hidden rounded-[2.5rem] bg-roast">
      <img src={src} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full scale-110 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
      {children}
    </div>
  )
}

/* ---------- one section ---------- */

function Section({ s, index, c, onAsk, flip }) {
  const ref = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      const st = { trigger: ref.current, start: 'top 72%' }
      gsap.from(ref.current.querySelectorAll('.ws-in'), { y: 40, autoAlpha: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: st })
      gsap.from(ref.current.querySelectorAll('.ws-card'), { y: 60, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: ref.current.querySelector('.ws-cards'), start: 'top 85%' } })
      gsap.fromTo(ref.current.querySelector('.ws-visual'), { clipPath: 'inset(12% 12% 12% 12% round 2.5rem)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 2.5rem)', ease: 'none',
        scrollTrigger: { trigger: ref.current.querySelector('.ws-visual'), start: 'top 95%', end: 'top 45%', scrub: true },
      })
      const img = ref.current.querySelector('.ws-photo img')
      if (img) gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.utils.toArray(ref.current.querySelectorAll('.ws-bag')).forEach((b, i) => {
        gsap.to(b, { y: i % 2 ? -14 : 12, duration: 3 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      })
    })
  }, { scope: ref })

  const visual = s.id === 'private-label'
    ? <PrivateLabelArt label={c === wholesaleContent.el ? 'Η μάρκα σας' : 'Your brand'} />
    : s.id === 'greek-coffee'
      ? <PhotoArt src="/img/beans-960.webp"><div className="absolute bottom-6 left-1/2 w-[30%] -translate-x-1/2 drop-shadow-[0_30px_30px_rgba(0,0,0,.6)]"><Bag product={{ id: 'ws-greek', bag: '#1e3a5f', ink: '#f5efe6', name: s.kicker, bagName: c === wholesaleContent.el ? 'Ελληνικός' : 'Greek', kicker: c === wholesaleContent.el ? 'Ελληνικός καφές' : 'Greek coffee', weight: '200g', roast: 3 }} /></div></PhotoArt>
      : <PhotoArt src={s.id === 'office' ? '/img/cafe-1400.webp' : '/img/barista-1200.webp'} />

  const n = String(index + 1).padStart(2, '0')

  return (
    <section id={s.id} ref={ref} data-ws-section={s.id} className={`relative scroll-mt-40 border-t border-cream/10 py-24 md:py-32 ${index % 2 ? 'bg-roast/40' : ''}`}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <div>
            <p className="ws-in flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              <span className="font-display text-3xl tracking-normal text-gold/60">{n}</span>
              {s.kicker}
            </p>
            <h2 className="ws-in mt-6 font-display text-[clamp(2.8rem,5.5vw,5rem)] leading-[0.92] text-cream">
              {s.title} <em className="text-gold">{s.titleEm}</em>
            </h2>
            <p className="ws-in mt-6 max-w-xl text-lg leading-relaxed text-cream/70">{s.lead}</p>

            {s.features && (
              <div className="ws-in mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">{s.featuresTitle}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-cream">
                      <Check2 className="size-4 text-gold" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {s.steps && (
              <div className="ws-in mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">{s.stepsTitle}</p>
                <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                  {s.steps.map((st, i) => (
                    <li key={st} className="flex items-start gap-3 rounded-2xl border border-cream/10 bg-espresso/40 p-4 text-sm text-cream/85">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold text-xs font-bold text-espresso">{i + 1}</span>
                      {st}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="ws-in mt-10">
              <Magnetic>
                <Button as="button" onClick={() => onAsk(s.id)}>
                  {c.ask} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Magnetic>
            </div>
          </div>
          <div className="ws-visual">{visual}</div>
        </div>

        <div className={`ws-cards mt-16 grid gap-4 sm:grid-cols-2 ${s.cards.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {s.cards.map((card) => {
            const Icon = icons[card.icon]
            const inner = (
              <>
                <div className="absolute -right-12 -top-12 size-32 rounded-full bg-gold/10 blur-2xl transition-transform duration-700 ease-expo group-hover:scale-[2]" />
                <span className="relative grid size-12 place-items-center rounded-2xl bg-gold/15 text-gold transition-transform duration-500 ease-expo group-hover:-rotate-6 group-hover:scale-110"><Icon /></span>
                <h3 className="relative mt-6 font-display text-2xl text-cream">{card.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-cream/65">{card.body}</p>
                {card.contact && <span className="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold">{c.ask} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>}
              </>
            )
            const cls = 'ws-card group relative overflow-hidden rounded-3xl border border-cream/10 bg-roast/70 p-7 text-left transition-colors duration-500 hover:border-gold/40'
            return card.contact
              ? <button key={card.title} type="button" onClick={() => onAsk(s.id)} className={`${cls} border-dashed`}>{inner}</button>
              : <div key={card.title} className={cls}>{inner}</div>
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- enquiry form (emailed with Web3Forms, see src/lib/enquiry.js) ---------- */

function Select({ name, label, options, placeholder, required, value, onChange, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}{required && ' *'}</span>
      <span className="relative mt-2 block">
        <select
          name={name}
          required={required}
          {...(onChange ? { value, onChange } : { defaultValue: '' })}
          className="peer block w-full cursor-pointer appearance-none rounded-2xl border border-cream/15 bg-espresso/50 py-3 pl-4 pr-11 text-cream transition-colors has-[option[value='']:checked]:text-muted hover:border-cream/30 focus:border-gold focus:outline-none"
        >
          {placeholder && <option value="" disabled={required} className="bg-roast">{placeholder}</option>}
          {options.map(([id, text]) => <option key={id} value={id} className="bg-roast text-cream">{text}</option>)}
        </select>
        <ArrowRight className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 rotate-90 text-gold transition-transform duration-300 peer-focus:-rotate-90" />
      </span>
    </label>
  )
}

function EnquiryForm({ c, interest, setInterest }) {
  const f = c.form
  const ref = useRef(null)
  const [business, setBusiness] = useState('')
  // idle | sending | done | error | mailto (no key configured)
  const [status, setStatus] = useState('idle')

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.from(ref.current.querySelectorAll('.ef-in'), { y: 40, autoAlpha: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
    })
  }, { scope: ref })

  // Reveal the "describe your business" field when "Other" is picked.
  useGSAP(() => {
    if (business === 'other') gsap.from('.ef-other', { height: 0, autoAlpha: 0, duration: 0.5, ease: 'power3.out', clearProps: 'height' })
  }, { scope: ref, dependencies: [business] })

  useGSAP(() => {
    if (status === 'done' || status === 'error') gsap.from('.ef-status', { y: 12, autoAlpha: 0, duration: 0.5, ease: 'back.out(2)' })
  }, { scope: ref, dependencies: [status] })

  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const d = Object.fromEntries(new FormData(form))
    const topic = c.sections.find((s) => s.id === d.interest)?.kicker || ''
    if (!enquiryKey) {
      const { subject, body } = composeEnquiry(d, topic)
      window.location.href = `mailto:${wholesaleEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setStatus('mailto')
      return
    }
    setStatus('sending')
    try {
      await sendEnquiry(d, topic)
      form.reset()
      setBusiness('')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const field = 'mt-2 block w-full rounded-2xl border border-cream/15 bg-espresso/50 px-4 py-3 text-cream placeholder:text-muted transition-colors focus:border-gold focus:outline-none'
  const label = 'text-xs font-semibold uppercase tracking-[0.2em] text-muted'
  const sending = status === 'sending'

  return (
    <section id="enquiry" ref={ref} className="relative isolate scroll-mt-40 border-t border-cream/10">
      <PhotoBg name="cups" widths={[900]} blur={3} overlay="linear-gradient(180deg, rgba(23,17,12,.95), rgba(23,17,12,.85) 50%, rgba(23,17,12,.97))" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <Eyebrow className="ef-in">{f.eyebrow}</Eyebrow>
          <h2 className="ef-in mt-6 font-display text-[clamp(2.8rem,5.5vw,5rem)] leading-[0.92] text-cream">{f.title} <em className="text-gold">{f.titleEm}</em></h2>
          <p className="ef-in mt-6 max-w-md text-lg text-cream/70">{f.intro}</p>
          <a href={`mailto:${wholesaleEmail}`} className="ef-in mt-8 inline-block text-gold underline-offset-4 hover:underline">{wholesaleEmail}</a>
        </div>
        <form onSubmit={submit} aria-busy={sending} className="ef-in grid gap-5 rounded-[2.5rem] border border-cream/10 bg-roast/80 p-6 backdrop-blur-md sm:grid-cols-2 md:p-10">
          <label className="block"><span className={label}>{f.name} *</span><input name="name" required autoComplete="name" className={field} /></label>
          <label className="block"><span className={label}>{f.company} *</span><input name="company" required autoComplete="organization" className={field} /></label>
          <label className="block"><span className={label}>{f.email} *</span><input name="email" type="email" required autoComplete="email" className={field} /></label>
          <PhoneField label={f.phone} hint={f.phoneHint} codeLabel={f.phoneCode} searchLabel={f.phoneSearch} noMatch={f.phoneNoMatch} lang={c === wholesaleContent.el ? 'el' : 'en'} />

          <Select name="business" label={f.business} options={f.businessOptions} placeholder={f.choose} required value={business} onChange={(e) => setBusiness(e.target.value)} className="sm:col-span-2" />
          {business === 'other' && (
            <label className="ef-other block overflow-hidden sm:col-span-2"><span className={label}>{f.businessOther} *</span><input name="businessOther" required className={field} /></label>
          )}
          <Select name="equipment" label={f.equipment} options={f.equipmentOptions} placeholder={f.choose} required className="sm:col-span-2" />
          <Select name="consumption" label={f.consumption} options={f.consumptionOptions} placeholder={f.choose} className="sm:col-span-2" />
          <Select name="interest" label={f.interest} options={c.sections.map((s) => [s.id, s.kicker])} value={interest} onChange={(e) => setInterest(e.target.value)} className="sm:col-span-2" />

          <label className="block sm:col-span-2"><span className={label}>{f.message}</span><textarea name="message" rows="4" className={`${field} resize-y`} /></label>
          {/* Honeypot for spam bots; hidden from people and screen readers. */}
          <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <Button as="button" type="submit" disabled={sending} className="disabled:cursor-wait disabled:opacity-70">
              {sending ? f.sending : f.submit}
              {sending
                ? <span className="size-4 animate-spin rounded-full border-2 border-espresso/30 border-t-espresso" aria-hidden="true" />
                : <ArrowRight className="size-4" />}
            </Button>
            <div role="status" aria-live="polite" className="max-w-sm text-sm">
              {status === 'done' && <p className="ef-status flex items-start gap-2 text-gold"><Check2 className="mt-0.5 size-4 shrink-0" />{f.done}</p>}
              {status === 'error' && <p className="ef-status text-[#f08a7e]">{f.error} <a href={`mailto:${wholesaleEmail}`} className="underline underline-offset-4">{wholesaleEmail}</a></p>}
              {status === 'mailto' && <p className="text-gold">{f.sent}</p>}
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

/* ---------- page ---------- */

export default function WholesalePage() {
  const { t } = useLang()
  const c = wholesaleContent[t.code] || wholesaleContent.en
  const root = useRef(null)
  const [active, setActive] = useState(c.sections[0].id)
  const [interest, setInterest] = useState(c.sections[0].id)

  useEffect(() => {
    const id = setTimeout(() => { document.title = `${c.eyebrow} — FUERTE` }, 0)
    return () => { clearTimeout(id); document.title = t.meta.title }
  }, [c, t])

  // Hero entrance and the sub-navigation's active tab.
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.wh-in', { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.08 })
        .from('.wh-tile', { y: 50, autoAlpha: 0, duration: 1, stagger: 0.07 }, '<0.3')
    })
    root.current.querySelectorAll('[data-ws-section]').forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 50%', end: 'bottom 50%', onToggle: (self) => self.isActive && setActive(el.dataset.wsSection) })
    })
  }, { scope: root })

  // Keep the active tab visible inside the horizontally scrolling sub-nav.
  useEffect(() => {
    const tab = root.current?.querySelector(`[data-tab="${active}"]`)
    const bar = tab?.parentElement
    if (bar) bar.scrollTo({ left: tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2, behavior: 'smooth' })
  }, [active])

  const go = (id) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: 'smooth' })
  }
  const ask = (id) => { setInterest(id); go('enquiry') }

  return (
    <main ref={root}>
      <section className="relative isolate overflow-hidden">
        <PhotoBg name="sacks" widths={[900]} eager blur={1.5} overlay="linear-gradient(180deg, rgba(23,17,12,.75) 0%, rgba(23,17,12,.88) 60%, rgba(23,17,12,1) 100%)" />
        <div className="relative mx-auto max-w-7xl px-5 pt-36 pb-16 md:px-8 md:pt-44">
          <Eyebrow className="wh-in">{c.eyebrow}</Eyebrow>
          <h1 className="wh-in mt-6 font-display text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.88] text-cream">
            {c.title}<br /><em className="text-gold">{c.titleEm}</em>
          </h1>
          <p className="wh-in mt-8 max-w-2xl text-lg leading-relaxed text-cream/70">{c.intro}</p>
          <nav aria-label={c.jump} className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {c.sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); go(s.id) }}
                className="wh-tile group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-3xl border border-cream/10 bg-roast/70 p-6 backdrop-blur-sm transition-colors duration-500 hover:border-gold/50">
                <span className="font-display text-4xl text-gold/50 transition-colors group-hover:text-gold">0{i + 1}</span>
                <span className="flex items-end justify-between gap-3">
                  <span className="font-display text-2xl leading-tight text-cream">{s.kicker}</span>
                  <ArrowRight className="size-5 shrink-0 rotate-90 text-gold transition-transform duration-300 group-hover:translate-y-1" />
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Sticky section tabs under the main navigation. */}
      <div className="sticky top-[84px] z-30 px-4 md:top-[92px] md:px-8">
        <div className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-cream/10 bg-roast/95 p-1 shadow-[0_12px_30px_-10px_rgba(0,0,0,.6)] backdrop-blur-md [scrollbar-width:none] lg:max-w-7xl">
          {c.sections.map((s) => (
            <a key={s.id} data-tab={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); go(s.id) }}
              aria-current={active === s.id ? 'true' : undefined}
              className={`min-h-10 shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${active === s.id ? 'bg-gold text-espresso' : 'text-cream/75 hover:text-cream'}`}>
              {s.kicker}
            </a>
          ))}
        </div>
      </div>

      {c.sections.map((s, i) => <Section key={s.id} s={s} index={i} c={c} onAsk={ask} flip={i % 2 === 1} />)}
      <EnquiryForm c={c} interest={interest} setInterest={setInterest} />
    </main>
  )
}
