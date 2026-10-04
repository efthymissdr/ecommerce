import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, useGSAP, FULL } from '../lib/gsap'
import { useLang } from '../i18n'
import { axes, localizedProducts } from '../data/content'
import { questions, recommend } from '../data/quiz'
import { Bag, Bean, ArrowRight } from './Art'
import { Eyebrow, Magnetic, Button, SplitWords, flyToCart, PhotoBg } from './ui'

/* ---------- option icons ---------- */

const ico = (d) => (
  <svg viewBox="0 0 32 32" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)
const icons = {
  espresso: ico(<><path d="M7 13h14v5a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6z" /><path d="M21 15h2a3 3 0 0 1 0 6h-2" /><path d="M5 27h20" /><path d="M11 5v4M15 5v4" /></>),
  briki: ico(<><path d="M9 11h12l-1.5 13a2 2 0 0 1-2 1.8h-5a2 2 0 0 1-2-1.8z" /><path d="M21 13h7" /><path d="M9 11c0-2 1.5-3 3-3h6c1.5 0 3 1 3 3" /><path d="M13 5c1 1-1 2 0 3" /></>),
  filter: ico(<><path d="M6 8h20l-7 11h-6z" /><path d="M13 19v3h6v-3" /><path d="M9 26h14" /></>),
  press: ico(<><rect x="9" y="9" width="12" height="17" rx="2" /><path d="M15 3v13M11 16h8" /><path d="M21 12h3v9h-3" /></>),
  black: ico(<><path d="M7 11h15v8a7 7 0 0 1-7 7h-1a7 7 0 0 1-7-7z" /><path d="M22 13h2a3 3 0 0 1 0 6h-2" /><ellipse cx="14.5" cy="11" rx="7.5" ry="1.5" fill="currentColor" /></>),
  splash: ico(<path d="M16 5c4 6 7 9.5 7 13a7 7 0 0 1-14 0c0-3.5 3-7 7-13z" />),
  lots: ico(<><path d="M11 4h10v4l3 4v15H8V12l3-4z" /><path d="M8 17h16" /></>),
  choc: ico(<><rect x="7" y="6" width="18" height="20" rx="2" /><path d="M7 13h18M7 20h18M16 6v20" /></>),
  fruit: ico(<><circle cx="11" cy="21" r="5" /><circle cx="21" cy="22" r="4.5" /><path d="M11 16c1-5 4-8 8-10M21 17c0-4-1-7-2-11" /></>),
  caramel: ico(<><path d="M10 12h12l-2 13h-8z" /><path d="M10 12c0-3 3-5 6-5s6 2 6 5" /><path d="M14 7c0-2 1-3 2-3" /></>),
  smoky: ico(<path d="M16 28c5 0 8-3.5 8-8 0-5.5-5.5-8-5.5-14-3.5 2.5-5.5 5.5-5.5 9-1.5-1-2.5-2.5-2.5-4.5C8 13 8 16.5 8 20c0 4.5 3 8 8 8z" />),
  bright: ico(<><circle cx="16" cy="16" r="5" /><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M6.8 25.2l2.8-2.8M22.4 9.6l2.8-2.8" /></>),
  balanced: ico(<><path d="M16 5v22M8 27h16M6 9h20" /><path d="M6 9l-3 8a3 3 0 0 0 6 0zM26 9l-3 8a3 3 0 0 0 6 0z" /></>),
  low: ico(<path d="M4 12c4-3 8 3 12 0s8-3 12 0M4 20c4-3 8 3 12 0s8-3 12 0" />),
  gentle: ico(<><rect x="6" y="20" width="5" height="7" rx="1" fill="currentColor" /><rect x="14" y="13" width="5" height="14" rx="1" /><rect x="22" y="6" width="5" height="21" rx="1" /></>),
  medium: ico(<><rect x="6" y="20" width="5" height="7" rx="1" fill="currentColor" /><rect x="14" y="13" width="5" height="14" rx="1" fill="currentColor" /><rect x="22" y="6" width="5" height="21" rx="1" /></>),
  intense: ico(<><rect x="6" y="20" width="5" height="7" rx="1" fill="currentColor" /><rect x="14" y="13" width="5" height="14" rx="1" fill="currentColor" /><rect x="22" y="6" width="5" height="21" rx="1" fill="currentColor" /></>),
  classic: ico(<path d="M16 26s-10-6-10-13a5.5 5.5 0 0 1 10-3 5.5 5.5 0 0 1 10 3c0 7-10 13-10 13z" />),
  explore: ico(<><circle cx="16" cy="16" r="11" /><path d="m20.5 11.5-3 6-6 3 3-6z" /></>),
}

const Check = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
)

/* ---------- radar chart ---------- */

// Greek capitals drop their accents (ΓΛΥΚΥΤΗΤΑ, not ΓΛΥΚΎΤΗΤΑ).
const caps = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()

const C = 150
const R = 104
const zero = Object.fromEntries(axes.map((a) => [a, 0]))

export function points(profile) {
  return axes.map((a, i) => {
    const ang = (Math.PI * 2 * i) / axes.length - Math.PI / 2
    const r = (profile[a] / 5) * R
    return `${(C + Math.cos(ang) * r).toFixed(1)},${(C + Math.sin(ang) * r).toFixed(1)}`
  }).join(' ')
}

// Polygons start collapsed in the markup; GSAP morphs them to their targets so
// React never resets the animated attribute.
export function Radar({ product, user, labels, ariaLabel, className = '' }) {
  return (
    <svg viewBox="-50 -12 400 324" className={className} role="img" aria-label={ariaLabel}>
      {[1, 0.75, 0.5, 0.25].map((k) => (
        <polygon key={k} className="rd-grid" points={points({ acidity: 5 * k, body: 5 * k, sweetness: 5 * k, bitterness: 5 * k })} fill="none" stroke="#f5efe6" strokeOpacity=".1" />
      ))}
      {axes.map((a, i) => {
        const ang = (Math.PI * 2 * i) / axes.length - Math.PI / 2
        return (
          <g key={a}>
            <line x1={C} y1={C} x2={C + Math.cos(ang) * R} y2={C + Math.sin(ang) * R} stroke="#f5efe6" strokeOpacity=".1" />
            <text x={C + Math.cos(ang) * (R + 24)} y={C + Math.sin(ang) * (R + 24) + 4} textAnchor="middle" fill="#a8a29e" fontSize="11" letterSpacing="1.5" fontFamily="Montserrat Variable, Manrope Variable">{caps(labels[a])}</text>
          </g>
        )
      })}
      <polygon className="rd-product" data-target={product ? points(product) : ''} points={points(zero)} fill="#c8a15a" fillOpacity=".28" stroke="#c8a15a" strokeWidth="2" strokeLinejoin="round" />
      {user && (
        <polygon className="rd-user" data-target={points(user)} points={points(zero)} fill="#f5efe6" fillOpacity=".06" stroke="#f5efe6" strokeWidth="2" strokeDasharray="5 5" strokeLinejoin="round" />
      )}
      {product && axes.map((a, i) => {
        const ang = (Math.PI * 2 * i) / axes.length - Math.PI / 2
        const r = (product[a] / 5) * R
        return <circle key={a} className="rd-dot" cx={C + Math.cos(ang) * r} cy={C + Math.sin(ang) * r} r="4" fill="#c8a15a" />
      })}
    </svg>
  )
}

/* ---------- quiz ---------- */

export default function Quiz({ quiz, setQuiz, onAdd }) {
  const { lang, t } = useLang()
  const q = t.quiz
  const root = useRef(null)
  const busy = useRef(false)
  const [added, setAdded] = useState(false)
  const products = localizedProducts(t)
  const n = questions.length
  const { step, answers, pick } = quiz
  const view = step < 0 ? 'intro' : step < n ? 'question' : 'result'
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const result = view === 'result' ? recommend(answers, products) : null
  const top = result?.ranked[0]
  const shown = result ? result.ranked.find((r) => r.product.id === (pick || top.product.id)) : null
  const others = result ? result.ranked.slice(0, 3).filter((r) => r !== shown).slice(0, 2) : []

  // Fade the stage out, then change state; the enter animation runs on render.
  const go = (next, force = false) => {
    if (busy.current && !force) return
    if (reduce()) { busy.current = false; setQuiz(next); return }
    busy.current = true
    gsap.to(root.current.querySelector('.qz-stage'), {
      autoAlpha: 0, y: -24, duration: 0.3, ease: 'power2.in',
      onComplete: () => { busy.current = false; setQuiz(next) },
    })
  }

  const choose = (optId, el) => {
    if (busy.current) return
    busy.current = true // ignore further clicks until the next question is in
    const nextAnswers = [...answers.slice(0, step), optId]
    setQuiz({ ...quiz, answers: nextAnswers })
    if (!reduce()) gsap.fromTo(el, { scale: 0.96 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    setTimeout(() => go({ step: step + 1, answers: nextAnswers, pick: null }, true), reduce() ? 0 : 420)
  }

  const showPick = (id) => {
    if (busy.current) return
    setQuiz({ ...quiz, pick: id })
  }

  const addToCart = (e) => {
    onAdd(shown.product)
    flyToCart(e.currentTarget)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  // Section entrance on scroll.
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.from('.qz-head > *', { y: 50, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 75%' } })
      gsap.from('.qz-panel', { y: 80, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.qz-panel', start: 'top 85%' } })
    })
  }, { scope: root })

  // Per-view enter animations.
  useGSAP(() => {
    const stage = root.current.querySelector('.qz-stage')
    gsap.set(stage, { autoAlpha: 1, y: 0 })
    const morph = (sel, d = 1.1, ease = 'elastic.out(1, 0.65)') => {
      root.current.querySelectorAll(sel).forEach((el) => {
        if (!el.dataset.target) return
        gsap.to(el, { attr: { points: el.dataset.target }, duration: reduce() ? 0 : d, ease })
      })
    }

    if (reduce()) { morph('.rd-product'); morph('.rd-user'); return }

    if (view === 'intro') {
      gsap.from('.qz-intro > *', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' })
      // Demo radar cycles through the coffees.
      const el = root.current.querySelector('.rd-product')
      const tl = gsap.timeline({ repeat: -1 })
      products.forEach((p) => {
        tl.to(el, { attr: { points: points(p.profile) }, duration: 1.1, ease: 'elastic.out(1, 0.6)' }).to({}, { duration: 0.9 })
      })
      gsap.to('.qz-float', { y: '+=16', rotate: '+=25', duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: { each: 0.4, from: 'random' } })
    }

    if (view === 'question') {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.qz-meta', { y: 16, autoAlpha: 0, duration: 0.6 })
        .from('.qz-title .split-word', { yPercent: 115, duration: 0.9, stagger: 0.04 }, '<0.05')
        .from('.qz-opt', { y: 40, autoAlpha: 0, scale: 0.94, duration: 0.8, stagger: 0.07, ease: 'back.out(1.5)' }, '<0.15')
        .fromTo('.qz-seg-current', { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, '<')
    }

    if (view === 'result') {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.qz-res-in', { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.07 })
        .fromTo('.qz-bag', { rotateY: -100, autoAlpha: 0, scale: 0.8 }, { rotateY: 0, autoAlpha: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)' }, 0)
        .from('.qz-burst', {
          x: () => gsap.utils.random(-200, 200), y: () => gsap.utils.random(-170, 150),
          rotate: () => gsap.utils.random(-260, 260), scale: 0, duration: 1.4, ease: 'expo.out',
        }, 0.1)
        .to('.qz-burst', { autoAlpha: 0, duration: 0.6 }, 1.1)
        .fromTo('.qz-ring', { strokeDashoffset: 302 }, { strokeDashoffset: 302 * (1 - shown.match / 100), duration: 1.6, ease: 'power3.out' }, 0.2)
        .from('.qz-alt', { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8 }, 0.5)
        .from('.rd-dot', { scale: 0, transformOrigin: 'center', stagger: 0.06, duration: 0.5, ease: 'back.out(3)' }, 0.8)
      const n = { v: 0 }
      tl.to(n, { v: shown.match, duration: 1.6, ease: 'power3.out', onUpdate: () => { const c = root.current?.querySelector('.qz-count'); if (c) c.textContent = Math.round(n.v) } }, 0.2)
      gsap.delayedCall(0.25, () => { morph('.rd-user', 1.2, 'power3.out'); morph('.rd-product', 1.4) })
    }
  }, { scope: root, dependencies: [view, step, lang], revertOnUpdate: true })

  // Switching between the match and an alternative re-animates the card and morphs the chart.
  useGSAP(() => {
    if (view !== 'result' || !pick) return
    const target = root.current.querySelector('.rd-product').dataset.target
    if (reduce()) { gsap.set('.rd-product', { attr: { points: target } }); return }
    gsap.to('.rd-product', { attr: { points: target }, duration: 1, ease: 'elastic.out(1, 0.6)' })
    gsap.fromTo('.qz-bag', { rotateY: 90 }, { rotateY: 0, duration: 0.8, ease: 'back.out(1.6)' })
    gsap.fromTo('.qz-swap', { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' })
    gsap.fromTo('.qz-ring', { strokeDashoffset: 302 }, { strokeDashoffset: 302 * (1 - shown.match / 100), duration: 1, ease: 'power3.out' })
    root.current.querySelector('.qz-count').textContent = shown.match
  }, { scope: root, dependencies: [pick] })

  const question = view === 'question' ? questions[step] : null
  const qt = question ? q.questions[question.id] : null
  const brewOpt = answers[0] && q.questions.brew.o[answers[0]]

  return (
    <section id="quiz" ref={root} className="relative isolate scroll-mt-24">
      <PhotoBg
        name="cups"
        widths={[900]}
        blur={2}
        overlay="linear-gradient(180deg, rgba(23,17,12,.88) 0%, rgba(36,27,20,.62) 45%, rgba(23,17,12,.9) 100%)"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-36">
      <div className="qz-head max-w-2xl">
        <Eyebrow>{q.eyebrow}</Eyebrow>
        <h2 className="mt-6 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] text-cream">
          {q.title} <em className="text-gold">{q.titleEm}</em>
        </h2>
      </div>

      <div className="qz-panel relative mt-14 overflow-clip rounded-[2.5rem] border border-cream/15 bg-roast/75 p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)] backdrop-blur-md md:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="qz-stage relative" aria-live="polite">
          {view === 'intro' && (
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
              <div className="qz-intro">
                <p className="text-lg leading-relaxed text-cream/70 md:text-xl">{q.copy}</p>
                <ol className="mt-8 flex flex-wrap gap-2" aria-hidden="true">
                  {questions.map((qq, i) => (
                    <li key={qq.id} className="relative grid size-14 place-items-center rounded-2xl border border-cream/10 bg-espresso/40 text-gold">
                      {icons[qq.options[0].id]}
                      <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-espresso">{i + 1}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-10 flex flex-wrap items-center gap-5">
                  <Magnetic>
                    <Button as="button" onClick={() => go({ step: 0, answers: [], pick: null })}>
                      {q.start}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Magnetic>
                  <span className="text-xs uppercase tracking-[0.25em] text-muted">{q.time}</span>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[420px]" aria-hidden="true">
                {[[8, 12, 30], [82, 4, 22], [90, 70, 34], [4, 78, 20]].map(([x, y, s], i) => (
                  <Bean key={i} className="qz-float absolute" color={i % 2 ? '#3b2415' : '#5c3a1e'} crease="#1a0f08" style={{ left: `${x}%`, top: `${y}%`, width: s, rotate: `${i * 50}deg` }} />
                ))}
                <Radar labels={t.axes} ariaLabel="" className="w-full" />
              </div>
            </div>
          )}

          {view === 'question' && (
            <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
              <div className="flex flex-col">
                <div className="qz-meta">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{q.questionOf(step + 1, n)}</p>
                  <div className="mt-4 flex gap-1.5" aria-hidden="true">
                    {questions.map((qq, i) => (
                      <span key={qq.id} className="h-1 flex-1 overflow-hidden rounded-full bg-cream/10">
                        {i <= step && <span className={`block h-full origin-left rounded-full bg-gold ${i === step ? 'qz-seg-current' : ''}`} />}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 id={`qz-q-${question.id}`} className="qz-title mt-8 font-display text-4xl leading-[1.05] text-cream md:text-5xl">
                  <SplitWords text={qt.q} />
                </h3>
                <button
                  onClick={() => go({ step: step - 1, answers, pick: null })}
                  className="qz-meta mt-8 inline-flex min-h-11 items-center gap-2 self-start rounded-full px-1 text-sm text-cream/60 transition-colors hover:text-gold lg:mt-auto"
                >
                  <ArrowRight className="size-4 rotate-180" /> {q.back}
                </button>
              </div>
              <div role="group" aria-labelledby={`qz-q-${question.id}`} className={`grid gap-3 ${question.options.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                {question.options.map((o) => {
                  const [label, hint] = qt.o[o.id]
                  const selected = answers[step] === o.id
                  return (
                    <button
                      key={o.id}
                      aria-pressed={selected}
                      onClick={(e) => choose(o.id, e.currentTarget)}
                      className={`qz-opt group relative flex min-h-36 flex-col items-start gap-4 rounded-3xl border p-5 text-left transition-colors duration-300 ${selected ? 'border-gold bg-gold/15' : 'border-cream/10 bg-espresso/40 hover:border-gold/50 hover:bg-cream/[0.04]'}`}
                    >
                      <span className={`grid size-12 place-items-center rounded-2xl transition-all duration-500 ease-expo group-hover:-rotate-6 group-hover:scale-110 ${selected ? 'bg-gold text-espresso' : 'bg-gold/10 text-gold'}`}>
                        {icons[o.id]}
                      </span>
                      <span className="mt-auto">
                        <span className="block font-semibold text-cream">{label}</span>
                        <span className="mt-1 block text-sm text-cream/55">{hint}</span>
                      </span>
                      <span className={`absolute right-4 top-4 grid size-6 place-items-center rounded-full border transition-all duration-300 ${selected ? 'scale-100 border-gold bg-gold text-espresso' : 'scale-75 border-cream/20 text-transparent'}`}>
                        <Check />
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {view === 'result' && (
            <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
              <div>
                <p className="qz-res-in text-xs font-semibold uppercase tracking-[0.3em] text-gold">{q.resultEyebrow}</p>
                <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-center">
                  <div className="relative mx-auto w-40 shrink-0 [perspective:900px] sm:mx-0">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <Bean key={i} className="qz-burst pointer-events-none absolute left-1/2 top-1/2 -ml-2.5 -mt-3.5 w-5" color={i % 3 ? '#c8a15a' : '#5c3a1e'} crease="#1a0f08" />
                    ))}
                    <div className="qz-bag relative drop-shadow-[0_28px_28px_rgba(0,0,0,.55)]"><Bag product={shown.product} /></div>
                  </div>
                  <div className="min-w-0">
                    <p className="qz-res-in qz-swap text-xs font-semibold uppercase tracking-[0.2em] text-muted">{shown.product.kicker}</p>
                    <h3 className="qz-res-in qz-swap mt-2 font-display text-5xl leading-none text-cream md:text-6xl">{shown.product.name}</h3>
                    <div className="qz-res-in mt-5 flex items-center gap-4">
                      <svg viewBox="0 0 110 110" className="size-20 -rotate-90" aria-hidden="true">
                        <circle cx="55" cy="55" r="48" fill="none" stroke="#f5efe6" strokeOpacity=".1" strokeWidth="7" />
                        <circle className="qz-ring" cx="55" cy="55" r="48" fill="none" stroke="#c8a15a" strokeWidth="7" strokeLinecap="round" strokeDasharray="302" strokeDashoffset={302 * (1 - shown.match / 100)} />
                      </svg>
                      <p className="font-display text-cream">
                        <span className="text-5xl tabular-nums"><span className="qz-count">{shown.match}</span>%</span>
                        <span className="ml-2 text-sm uppercase tracking-[0.2em] text-muted">{q.match}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <p className="qz-res-in qz-swap mt-8 text-lg leading-relaxed text-cream/75">{shown.product.pitch}</p>
                <div className="qz-res-in mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">{q.why}</p>
                  <ul className="mt-3 space-y-2 text-sm text-cream/75">
                    {[brewOpt && q.brewLine(brewOpt[0]), q.notesLine(shown.product.notes.join(', '))].filter(Boolean).map((line) => (
                      <li key={line} className="qz-swap flex items-start gap-3">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold"><Check /></span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="qz-res-in mt-8 flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <Button as="button" onClick={addToCart}>
                      {added ? q.added : `${q.add} · €${shown.product.price.toFixed(2)}`}
                    </Button>
                  </Magnetic>
                  <Button as={Link} to={`/products/${shown.product.id}`} variant="ghost">
                    {t.pdp.view} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                  <button onClick={() => go({ step: -1, answers: [], pick: null })} className="min-h-11 px-2 text-sm text-cream/60 underline-offset-4 transition-colors hover:text-gold hover:underline">
                    {q.retake}
                  </button>
                </div>
              </div>

              <div>
                <div className="qz-res-in rounded-3xl border border-cream/10 bg-espresso/40 p-5">
                  <Radar
                    product={shown.product.profile}
                    user={result.profile}
                    labels={t.axes}
                    ariaLabel={q.chartLabel(shown.product.name)}
                    className="mx-auto w-full max-w-[380px]"
                  />
                  <div className="mt-2 flex flex-wrap justify-center gap-5 text-xs text-cream/70">
                    <span className="flex items-center gap-2"><span className="h-0.5 w-6 border-t-2 border-dashed border-cream" />{q.yourTaste}</span>
                    <span className="flex items-center gap-2"><span className="size-3 rounded-sm bg-gold/60 ring-1 ring-gold" />{shown.product.name}</span>
                  </div>
                </div>
                <p className="qz-res-in mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-muted">{q.alsoLike}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {others.map((o) => (
                    <button
                      key={o.product.id}
                      onClick={() => showPick(o.product.id)}
                      className="qz-alt group flex items-center gap-3 rounded-2xl border border-cream/10 bg-espresso/40 p-3 text-left transition-colors duration-300 hover:border-gold/50"
                    >
                      <span className="w-12 shrink-0 transition-transform duration-500 ease-expo group-hover:-rotate-6 group-hover:scale-110"><Bag product={o.product} /></span>
                      <span className="min-w-0">
                        <span className="block truncate font-display text-xl text-cream">{o.product.name}</span>
                        <span className="text-xs tabular-nums text-gold">{o.match}% {q.match}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  )
}
