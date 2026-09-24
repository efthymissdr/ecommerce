import { useRef } from 'react'
import { gsap, useGSAP, FULL } from '../lib/gsap'
import { steps } from '../data/content'
import { Bean } from './Art'
import { Eyebrow } from './ui'

// One illustration per step, drawn with simple shapes.
function StepArt({ i }) {
  const common = 'absolute inset-0 m-auto'
  if (i === 0) return (
    <div className="relative size-full">
      {Array.from({ length: 9 }).map((_, k) => (
        <Bean key={k} className={`step-float ${common}`} color={['#b91c1c', '#dc2626', '#65a30d'][k % 3]} crease="#450a0a"
          style={{ width: 34, transform: `rotate(${k * 40}deg) translateY(-${60 + (k % 3) * 22}px)` }} />
      ))}
      <div className={`${common} size-24 rounded-full bg-gold/20 blur-xl`} />
    </div>
  )
  if (i === 1) return (
    <div className="relative size-full">
      {['#c8a15a', '#7c2d12', '#3f6212'].map((c, k) => (
        <div key={k} className="step-float absolute size-36 rounded-full mix-blend-screen opacity-80" style={{ background: c, left: `${18 + k * 18}%`, top: `${k % 2 ? 38 : 22}%` }} />
      ))}
    </div>
  )
  if (i === 2) return (
    <svg viewBox="0 0 300 200" className="size-full" aria-hidden="true">
      <defs>
        <linearGradient id="curve" x1="0" x2="1"><stop offset="0" stopColor="#65a30d" /><stop offset=".5" stopColor="#c8a15a" /><stop offset="1" stopColor="#3b2415" /></linearGradient>
      </defs>
      {[40, 80, 120, 160].map((y) => <line key={y} x1="20" x2="290" y1={y} y2={y} stroke="#f5efe6" strokeOpacity=".08" />)}
      <path className="roast-curve" d="M20 170 C70 165 90 120 130 95 S210 45 290 38" fill="none" stroke="url(#curve)" strokeWidth="5" strokeLinecap="round" />
      <circle className="roast-dot" cx="290" cy="38" r="8" fill="#c8a15a" />
      <text x="24" y="192" fill="#a8a29e" fontSize="10" fontFamily="Montserrat Variable">TIME →</text>
      <text x="236" y="28" fill="#c8a15a" fontSize="10" fontFamily="Montserrat Variable">DROP</text>
    </svg>
  )
  return (
    <div className="relative grid size-full place-items-center">
      {[1, 2, 3].map((k) => (
        <div key={k} className="step-ring absolute rounded-full border border-gold/40" style={{ width: k * 70, height: k * 70 }} />
      ))}
      <span className="font-display text-6xl text-gold">100</span>
    </div>
  )
}

export default function Process() {
  const root = useRef(null)
  const track = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(`${FULL} and (min-width: 1024px)`, () => {
      const distance = () => track.current.scrollWidth - window.innerWidth
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      gsap.to('.pr-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } })
      gsap.utils.toArray('.step').forEach((s) => {
        gsap.from(s.querySelectorAll('.step-in'), {
          y: 60, autoAlpha: 0, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left 85%', end: 'left 45%', scrub: true },
        })
        gsap.from(s.querySelector('.step-num'), {
          xPercent: 40, ease: 'none',
          scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        })
      })
      gsap.fromTo('.roast-curve', { strokeDasharray: 400, strokeDashoffset: 400 }, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: '.step-2', containerAnimation: tween, start: 'left 80%', end: 'center center', scrub: true },
      })
    })
    mm.add(`${FULL} and (max-width: 1023px)`, () => {
      gsap.utils.toArray('.step').forEach((s) => {
        gsap.from(s.querySelectorAll('.step-in'), { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 80%' } })
      })
    })
    mm.add(FULL, () => {
      gsap.to('.step-float', { y: '+=14', duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.2, from: 'random' } })
      gsap.fromTo('.step-ring', { scale: 0.6, autoAlpha: 1 }, { scale: 1.4, autoAlpha: 0, duration: 2.6, repeat: -1, stagger: 0.8, ease: 'power1.out' })
      gsap.to('.roast-dot', { scale: 1.5, transformOrigin: 'center', duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    })
  }, { scope: root })

  return (
    <section id="craft" ref={root} className="relative overflow-hidden bg-espresso lg:h-svh">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-cream/5">
        <div className="pr-progress h-full origin-left scale-x-0 bg-gold" />
      </div>
      <div ref={track} className="flex h-full flex-col lg:w-max lg:flex-row">
        <div className="flex shrink-0 flex-col justify-center px-5 pt-24 pb-10 md:px-8 lg:w-[42vw] lg:py-0 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <Eyebrow>The craft</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] text-cream">
            Four steps.<br /><em className="text-gold">Zero shortcuts.</em>
          </h2>
          <p className="mt-6 max-w-sm text-cream/60">How a green bean becomes a FUERTE coffee — the same way, every single roast.</p>
          <p className="mt-10 hidden items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted lg:flex">
            Keep scrolling <span className="h-px w-16 bg-gold" />
          </p>
        </div>
        {steps.map((s, i) => (
          <article key={s.n} className={`step step-${i} relative flex shrink-0 items-center px-5 py-10 md:px-8 lg:w-[62vw] lg:max-w-[900px] lg:py-0`}>
            <div className="relative grid w-full items-center gap-8 overflow-hidden rounded-[2.5rem] border border-cream/10 bg-roast p-8 md:grid-cols-2 md:p-12">
              <div className="relative z-10">
                <p className="step-in text-xs font-semibold uppercase tracking-[0.3em] text-gold">Step {s.n}</p>
                <h3 className="step-in mt-4 font-display text-5xl text-cream md:text-6xl">{s.title}</h3>
                <p className="step-in mt-5 max-w-sm leading-relaxed text-cream/65">{s.body}</p>
              </div>
              <div className="step-in relative h-56 md:h-72"><StepArt i={i} /></div>
              <span className="step-num pointer-events-none absolute -bottom-10 right-4 font-display text-[12rem] leading-none text-cream/[0.04]" aria-hidden="true">{s.n}</span>
            </div>
          </article>
        ))}
        <div className="hidden shrink-0 lg:block lg:w-[8vw]" />
      </div>
    </section>
  )
}
