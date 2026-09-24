import { useRef } from 'react'
import { gsap, useGSAP, FULL } from '../lib/gsap'
import { Bag, Bean, Cup, ArrowRight } from './Art'
import { SplitWords, Magnetic, Button } from './ui'
import { products } from '../data/content'

const orbit = [
  { x: '3%', y: '90%', s: 40, r: -20 },
  { x: '88%', y: '16%', s: 30, r: 40 },
  { x: '80%', y: '80%', s: 54, r: 70 },
  { x: '46%', y: '86%', s: 24, r: 10 },
  { x: '58%', y: '22%', s: 20, r: 120 },
  { x: '95%', y: '50%', s: 22, r: -60 },
]

export default function Hero({ ready }) {
  const root = useRef(null)

  useGSAP(() => {
    if (!ready) return
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.hero-eyebrow', { y: 20, autoAlpha: 0, duration: 1 })
        .from('.hero-title .split-word', { yPercent: 115, rotate: 4, duration: 1.4, stagger: 0.07 }, '<0.1')
        .from('.hero-copy', { y: 30, autoAlpha: 0, duration: 1.1 }, '<0.5')
        .from('.hero-cta > *', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1 }, '<0.15')
        .from('.hero-bag', { yPercent: 40, rotate: (i) => (i ? 18 : -14), autoAlpha: 0, duration: 1.6, stagger: 0.12 }, 0.3)
        .from('.hero-cup', { scale: 0.6, autoAlpha: 0, duration: 1.4, ease: 'back.out(1.6)' }, 0.7)
        .from('.hero-bean', { scale: 0, rotate: -180, duration: 1.2, stagger: 0.06, ease: 'back.out(2)' }, 0.6)
        .from('.hero-stat', { y: 20, autoAlpha: 0, stagger: 0.1, duration: 0.9 }, 1)

      // Idle float
      gsap.to('.hero-bag-a', { y: -14, rotate: -4, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to('.hero-bag-b', { y: 12, rotate: 7, duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.utils.toArray('.hero-bean').forEach((b, i) => {
        gsap.to(b, { y: i % 2 ? 18 : -18, rotate: `+=${i % 2 ? 40 : -40}`, duration: 4 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      })

      // Scroll parallax — decorative layers only, background slowest.
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 }
      gsap.to('.hero-glow', { yPercent: 30, scale: 1.2, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-visual', { yPercent: -18, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-beans', { yPercent: -35, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-text', { autoAlpha: 0.15, y: -60, ease: 'none', scrollTrigger: { ...st, start: 'center center' } })

      // Pointer parallax on the visual cluster
      const xTo = gsap.quickTo('.hero-tilt', 'rotationY', { duration: 1, ease: 'power3.out' })
      const yTo = gsap.quickTo('.hero-tilt', 'rotationX', { duration: 1, ease: 'power3.out' })
      const move = (e) => {
        xTo((e.clientX / window.innerWidth - 0.5) * 16)
        yTo((e.clientY / window.innerHeight - 0.5) * -12)
      }
      window.addEventListener('pointermove', move)
      return () => window.removeEventListener('pointermove', move)
    })
  }, { scope: root, dependencies: [ready] })

  return (
    <section id="top" ref={root} className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-16">
      <div className="hero-glow pointer-events-none absolute -top-40 left-1/2 h-[80vh] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,161,90,.28),transparent)] blur-2xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(245,239,230,.04)_1px,transparent_1px)] bg-[size:12.5%_100%]" />

      <div className="hero-beans pointer-events-none absolute inset-0 opacity-50 lg:opacity-100">
        {orbit.map((b, i) => (
          <Bean key={i} className="hero-bean absolute" color={i % 2 ? '#3b2415' : '#5c3a1e'} crease="#1a0f08"
            style={{ left: b.x, top: b.y, width: b.s, rotate: `${b.r}deg` }} />
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="hero-text">
          <p className="hero-eyebrow mb-6 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            <span className="size-1.5 animate-pulse rounded-full bg-gold" />
            Roasting in Greece since 1997
          </p>
          <h1 className="hero-title font-display text-[clamp(3.4rem,9vw,8.5rem)] font-medium leading-[0.88] tracking-tight text-cream">
            <SplitWords text="Strong by" />
            <br />
            <SplitWords text="character." wordClass="italic text-gold" />
          </h1>
          <p className="hero-copy mt-8 max-w-md text-base leading-relaxed text-cream/70 md:text-lg">
            100% Arabica espresso blends, single origins, Greek and filter coffee — each with its own roast profile, so every cup tastes exactly as it should.
          </p>
          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button href="#shop">
                Shop the coffees
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="#story" variant="ghost">Our story</Button>
            </Magnetic>
          </div>
          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-cream/10 pt-6">
            {[['1997', 'Since'], ['100%', 'Arabica'], ['1:1', 'Roast profile per blend']].map(([v, l]) => (
              <div key={l} className="hero-stat">
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl text-cream">{v}</dd>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-visual relative mx-auto aspect-square w-full max-w-[560px] [perspective:1200px]">
          <div className="hero-tilt relative size-full [transform-style:preserve-3d]">
            <div className="absolute inset-[8%] rounded-full border border-gold/20" />
            <div className="spin-slow absolute inset-[2%] rounded-full border border-dashed border-cream/10" />
            <svg viewBox="0 0 400 400" className="spin-slow absolute inset-0 size-full [animation-direction:reverse]" aria-hidden="true">
              <defs><path id="circ" d="M200 200m-170 0a170 170 0 1 1 340 0a170 170 0 1 1-340 0" /></defs>
              <text fill="#c8a15a" fillOpacity=".55" fontSize="13" letterSpacing="7" fontFamily="Montserrat Variable">
                <textPath href="#circ">FUERTE COFFEE ROASTERS · 100% ARABICA · EST. 1997 · </textPath>
              </text>
            </svg>
            <div className="hero-bag hero-bag-a absolute left-[6%] top-[14%] w-[44%] drop-shadow-[0_40px_40px_rgba(0,0,0,.55)] [transform:translateZ(60px)]">
              <Bag product={products[0]} />
            </div>
            <div className="hero-bag hero-bag-b absolute right-[4%] top-[24%] w-[40%] drop-shadow-[0_40px_40px_rgba(0,0,0,.55)] [transform:translateZ(30px)]">
              <Bag product={products[2]} />
            </div>
            <div className="hero-cup absolute bottom-[2%] left-1/2 w-[46%] -translate-x-1/2 drop-shadow-[0_30px_30px_rgba(0,0,0,.5)] [transform:translateZ(90px)]">
              <Cup />
            </div>
          </div>
        </div>
      </div>

      <a href="#marquee" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted md:flex" aria-label="Scroll down">
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-cream/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-gold" />
        </span>
      </a>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  )
}
