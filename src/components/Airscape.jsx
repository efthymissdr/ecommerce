import { useRef } from 'react'
import { gsap, useGSAP, FULL } from '../lib/gsap'
import { Eyebrow } from './ui'

// Small shield + check, used on the "Airscape secured" badge.
export function ShieldIcon({ className = 'size-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </svg>
  )
}

export function AirscapeBadge({ label, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-espresso shadow-[0_6px_16px_-6px_rgba(0,0,0,.5)] ${className}`}>
      <ShieldIcon /> {label}
    </span>
  )
}

const icons = {
  air: <><path d="M4 9h10a3 3 0 1 0-3-3" /><path d="M4 14h14a3 3 0 1 1-3 3" /><path d="M4 19h6" /></>,
  valve: <><circle cx="12" cy="12" r="8" /><path d="M12 16V8" /><path d="m9 11 3-3 3 3" /></>,
  light: <><path d="M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5 19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5 19 5" /><circle cx="12" cy="12" r="4" /><path d="M4 4l16 16" /></>,
  down: <><path d="M12 4v12" /><path d="m7 11 5 5 5-5" /><path d="M5 20h14" /></>,
}

// Cut-away Airscape canister (as used at FUERTE's premises to store the coffee): as you scroll, the inner plunger lid presses down
// onto the beans, the air escapes through the valve, and the outer lid closes.
function Canister() {
  const beans = [
    [62, 222, 20], [84, 226, -30], [106, 221, 40], [128, 225, -10], [146, 220, 60],
    [70, 206, -50], [94, 208, 15], [118, 205, -35], [140, 204, 25],
    [60, 190, 30], [82, 191, -20], [105, 189, 50], [128, 190, -45], [148, 188, 10],
    [72, 175, 0], [96, 174, -25], [120, 173, 35], [142, 172, -5],
  ]
  return (
    <svg viewBox="0 0 210 270" className="w-full" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="as-steel" x1="0" x2="1">
          <stop offset="0" stopColor="#2a211a" />
          <stop offset=".45" stopColor="#4a3b2f" />
          <stop offset="1" stopColor="#1f1813" />
        </linearGradient>
        <linearGradient id="as-lid" x1="0" x2="1">
          <stop offset="0" stopColor="#a8854a" />
          <stop offset=".5" stopColor="#e2c48a" />
          <stop offset="1" stopColor="#8d6e3a" />
        </linearGradient>
        <clipPath id="as-inside"><rect x="44" y="58" width="122" height="190" rx="10" /></clipPath>
      </defs>

      {/* body (cut away so the inside shows) */}
      <rect x="38" y="52" width="134" height="202" rx="16" fill="url(#as-steel)" />
      <rect x="44" y="58" width="122" height="190" rx="10" fill="#120d09" />
      <g clipPath="url(#as-inside)">
        {beans.map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <ellipse rx="10" ry="7" fill={i % 3 ? '#5c3a1e' : '#4a2e17'} />
            <path d="M-8 0c4-3 12 3 16 0" stroke="#1a0f08" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </g>
        ))}
        {/* air above the coffee, pushed out as the plunger comes down */}
        {[[70, 120], [100, 104], [132, 126], [84, 142], [118, 146], [148, 108], [60, 96]].map(([x, y], i) => (
          <circle key={i} className="as-air" cx={x} cy={y} r={i % 2 ? 3 : 4.5} fill="none" stroke="#e8d9b8" strokeOpacity=".55" strokeWidth="1.5" />
        ))}
        {/* inner plunger lid with its one-way valve */}
        <g className="as-plunger">
          <rect x="46" y="66" width="118" height="16" rx="6" fill="url(#as-lid)" />
          <rect x="94" y="56" width="22" height="12" rx="4" fill="#c8a15a" />
          <circle cx="105" cy="74" r="3" fill="#17110c" />
        </g>
      </g>
      {/* air leaving through the valve */}
      {[0, 1, 2].map((i) => (
        <circle key={i} className="as-out" cx={105} cy={50} r={3 - i * 0.6} fill="#e8d9b8" opacity="0" />
      ))}
      {/* outer lid */}
      <g className="as-cap">
        <rect x="32" y="34" width="146" height="22" rx="9" fill="url(#as-steel)" stroke="#c8a15a" strokeOpacity=".35" />
        <rect x="88" y="26" width="34" height="10" rx="5" fill="#c8a15a" />
      </g>
      <ellipse cx="105" cy="262" rx="80" ry="6" fill="#000" opacity=".35" />
    </svg>
  )
}

export default function Airscape({ text }) {
  const ref = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.from('.as-in', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } })
      // Scrubbed with the scroll: lift the cap, press the plunger down, let the air out, close.
      // Desktop: the canister is sticky, so play it across the whole section.
      // Phones: it sits above the text, so play it while the canister itself is on screen.
      const wide = window.matchMedia('(min-width: 1024px)').matches
      const st = wide
        ? { trigger: ref.current, start: 'top 55%', end: 'bottom 85%', scrub: 0.6 }
        : { trigger: '.as-stage', start: 'top 85%', end: 'bottom 40%', scrub: 0.6 }
      const tl = gsap.timeline({ scrollTrigger: st })
      tl.to('.as-cap', { y: -26, rotate: -10, transformOrigin: '20% 100%', duration: 0.6 })
        .to('.as-plunger', { y: 82, duration: 2, ease: 'power1.inOut' })
        .to('.as-air', { y: -70, autoAlpha: 0, stagger: 0.1, duration: 1.2, ease: 'power1.in' }, '<')
        .fromTo('.as-out', { y: 0, autoAlpha: 0.9 }, { y: -40, autoAlpha: 0, stagger: 0.25, duration: 0.8, repeat: 1 }, '<0.3')
        .to('.as-cap', { y: 0, rotate: 0, duration: 0.6 })
    })
    // Reduced motion: show the end state (pressed down, closed).
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.as-plunger', { y: 82 })
      gsap.set('.as-air', { autoAlpha: 0 })
    })
  }, { scope: ref })

  return (
    <section id="airscape" ref={ref} className="relative scroll-mt-24 overflow-clip border-t border-cream/10 bg-roast/40">
      <div className="pointer-events-none absolute -left-40 top-1/3 size-[32rem] rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-start gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Sticky on desktop, so the canister stays in view while the text scrolls past. */}
        <div className="as-stage relative mx-auto flex w-full max-w-[300px] flex-col items-center lg:sticky lg:top-28 lg:max-w-[340px]">
          <div className="relative w-full">
            <div className="absolute inset-[12%] rounded-full border border-dashed border-gold/20" aria-hidden="true" />
            <Canister />
          </div>
          <AirscapeBadge label={text.badge} className="as-in mt-6" />
        </div>

        <div>
          <Eyebrow className="as-in">{text.eyebrow}</Eyebrow>
          <h2 className="as-in mt-6 font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] text-cream">
            {text.title} <em className="text-gold">{text.titleEm}</em>
          </h2>
          <p className="as-in mt-6 max-w-xl text-lg leading-relaxed text-cream/75">{text.intro}</p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {text.features.map(([icon, title, body]) => (
              <li key={title} className="as-in rounded-3xl border border-cream/10 bg-espresso/50 p-5">
                <span className="grid size-10 place-items-center rounded-2xl bg-gold/15 text-gold">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[icon]}</svg>
                </span>
                <p className="mt-4 font-display text-2xl text-cream">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">{body}</p>
              </li>
            ))}
          </ul>

          <p className="as-in mt-10 text-xs font-semibold uppercase tracking-[0.25em] text-muted">{text.stepsTitle}</p>
          <ol className="as-in mt-4 grid max-w-xl grid-cols-2 gap-3">
            {text.steps.map((s, i) => (
              <li key={s} className={`flex items-center gap-3 rounded-2xl border p-3 text-sm ${i === 1 ? 'border-gold/50 bg-gold/10 text-gold' : 'border-cream/10 text-cream/80'}`}>
                <span className={`grid size-8 shrink-0 place-items-center rounded-full font-display text-lg ${i === 1 ? 'bg-gold text-espresso' : 'border border-gold/40 text-gold'}`}>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="as-in mt-10 text-xs text-muted">{text.trademark}</p>
        </div>
      </div>
    </section>
  )
}
