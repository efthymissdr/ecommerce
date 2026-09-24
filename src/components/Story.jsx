import { useRef } from 'react'
import { gsap, useGSAP, FULL } from '../lib/gsap'
import { milestones } from '../data/content'
import { Eyebrow } from './ui'
import { Leaf, Flame, Award } from './Art'

const statement =
  'We choose each origin for its aroma, flavour and body — then combine them in proportions that let every component shine. One blend, one roast profile, the same cup year after year.'

const pillars = [
  { icon: Leaf, title: '100% Arabica', body: 'Selected origins only. No fillers, no shortcuts.' },
  { icon: Flame, title: 'Own roast profile', body: 'Every blend is roasted to a curve built for it alone.' },
  { icon: Award, title: 'Certified single origins', body: 'Traceable coffees that taste of where they grew.' },
]

export default function Story() {
  const root = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      // Word-by-word highlight tied to scroll.
      gsap.fromTo('.st-word', { opacity: 0.14 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: '.st-statement', start: 'top 80%', end: 'bottom 45%', scrub: true },
      })
      // Timeline line draws in, dots pop.
      gsap.fromTo('.tl-line', { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 60%', scrub: true },
      })
      gsap.utils.toArray('.tl-item').forEach((el) => {
        gsap.from(el.querySelector('.tl-dot'), { scale: 0, duration: 0.6, ease: 'back.out(3)', scrollTrigger: { trigger: el, start: 'top 72%' } })
        gsap.from(el.querySelectorAll('.tl-reveal'), { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 75%' } })
      })
      gsap.from('.pillar', {
        y: 60, autoAlpha: 0, duration: 1, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.pillars', start: 'top 80%' },
      })
      // Year counter
      const n = { v: 1970 }
      gsap.to(n, {
        v: 1997, duration: 2, ease: 'power3.out',
        scrollTrigger: { trigger: '.st-year', start: 'top 85%' },
        onUpdate: () => { document.querySelector('.st-year').textContent = Math.round(n.v) },
      })
    })
  }, { scope: root })

  return (
    <section id="story" ref={root} className="relative mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>Our story</Eyebrow>
          <p className="mt-8 font-display text-[clamp(5rem,14vw,11rem)] leading-none text-gold [font-variant-numeric:lining-nums]">
            <span className="st-year tabular-nums">1997</span>
          </p>
          <p className="mt-14 max-w-sm text-cream/60">
            Nearly three decades of roasting, trading and obsessing over coffee — from a small Greek roastery to a full specialty line.
          </p>
        </div>
        <div>
          <p className="st-statement font-display text-3xl leading-[1.25] text-cream md:text-5xl" aria-label={statement}>
            {statement.split(' ').map((w, i) => (
              <span key={i} className="st-word" aria-hidden="true">{w} </span>
            ))}
          </p>

          <ol className="tl relative mt-20 space-y-14 pl-10">
            <span className="tl-line absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-gold via-gold/60 to-transparent" aria-hidden="true" />
            {milestones.map((m) => (
              <li key={m.title} className="tl-item relative">
                <span className="tl-dot absolute -left-10 top-1.5 grid size-[15px] place-items-center rounded-full border border-gold bg-espresso">
                  <span className="size-1.5 rounded-full bg-gold" />
                </span>
                <p className="tl-reveal text-xs font-semibold uppercase tracking-[0.3em] text-gold">{m.year}</p>
                <h3 className="tl-reveal mt-2 font-display text-3xl text-cream md:text-4xl">{m.title}</h3>
                <p className="tl-reveal mt-2 max-w-lg text-cream/60">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="pillars mt-28 grid gap-4 md:grid-cols-3">
        {pillars.map(({ icon: Icon, title, body }) => (
          <div key={title} className="pillar group relative overflow-hidden rounded-3xl border border-cream/10 bg-roast/60 p-8 transition-colors duration-500 hover:border-gold/40">
            <div className="absolute -right-16 -top-16 size-40 rounded-full bg-gold/10 blur-2xl transition-transform duration-700 ease-expo group-hover:scale-[2.2]" />
            <span className="relative grid size-12 place-items-center rounded-2xl bg-gold/15 text-gold transition-transform duration-500 ease-expo group-hover:-rotate-12 group-hover:scale-110">
              <Icon className="size-6" />
            </span>
            <h3 className="relative mt-8 font-display text-3xl text-cream">{title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-cream/60">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
