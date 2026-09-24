import { useRef, useState } from 'react'
import { gsap, useGSAP, FULL } from '../lib/gsap'
import { products } from '../data/content'
import { Bag } from './Art'
import { Eyebrow } from './ui'

const axes = ['acidity', 'body', 'sweetness', 'bitterness']
const C = 150
const R = 110

function radarPoints(profile) {
  return axes.map((a, i) => {
    const ang = (Math.PI * 2 * i) / axes.length - Math.PI / 2
    const r = (profile[a] / 5) * R
    return `${C + Math.cos(ang) * r},${C + Math.sin(ang) * r}`
  }).join(' ')
}

export default function Taste() {
  const root = useRef(null)
  const [idx, setIdx] = useState(0)
  const p = products[idx]

  // Morph radar polygon, bars and bag when the selected coffee changes.
  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const d = reduce ? 0 : 0.9
    gsap.to('.radar-shape', { attr: { points: radarPoints(p.profile) }, duration: d, ease: 'elastic.out(1, 0.6)' })
    axes.forEach((a) => gsap.to(`.bar-${a}`, { scaleX: p.profile[a] / 5, duration: d, ease: 'expo.out' }))
    if (!reduce) {
      gsap.fromTo('.taste-bag', { rotateY: -90, autoAlpha: 0 }, { rotateY: 0, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.4)' })
      gsap.fromTo('.taste-meta > *', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' })
    }
  }, { scope: root, dependencies: [idx] })

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.from('.taste-panel', { y: 80, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } })
      gsap.from('.radar-grid', { scale: 0, transformOrigin: '150px 150px', duration: 1, stagger: 0.1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.radar', start: 'top 80%' } })
    })
  }, { scope: root })

  return (
    <section id="taste" ref={root} className="relative mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-36">
      <div className="max-w-2xl">
        <Eyebrow>Taste profile</Eyebrow>
        <h2 className="mt-6 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] text-cream">
          Every coffee has a <em className="text-gold">shape.</em>
        </h2>
      </div>

      <div className="taste-panel mt-14 grid gap-6 rounded-[2.5rem] border border-cream/10 bg-roast/70 p-6 md:p-10 lg:grid-cols-[auto_1fr_1fr]">
        <div role="tablist" aria-label="Choose a coffee" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {products.map((x, i) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={i === idx}
              onClick={() => setIdx(i)}
              className={`min-h-11 shrink-0 rounded-2xl px-4 py-2 text-left text-sm transition-all duration-300 ${i === idx ? 'bg-gold text-espresso' : 'text-cream/70 hover:bg-cream/5 hover:text-cream'}`}
            >
              <span className="block font-semibold">{x.name}</span>
              <span className={`block text-[11px] ${i === idx ? 'text-espresso/70' : 'text-muted'}`}>{x.kicker}</span>
            </button>
          ))}
        </div>

        <div className="radar relative mx-auto w-full max-w-[340px] self-center">
          <svg viewBox="-40 -10 380 320" className="w-full" role="img" aria-label={`${p.name} taste profile`}>
            {[1, 0.75, 0.5, 0.25].map((k) => (
              <polygon key={k} className="radar-grid" points={radarPoints({ acidity: 5 * k, body: 5 * k, sweetness: 5 * k, bitterness: 5 * k })} fill="none" stroke="#f5efe6" strokeOpacity=".1" />
            ))}
            {axes.map((a, i) => {
              const ang = (Math.PI * 2 * i) / axes.length - Math.PI / 2
              return (
                <g key={a}>
                  <line x1={C} y1={C} x2={C + Math.cos(ang) * R} y2={C + Math.sin(ang) * R} stroke="#f5efe6" strokeOpacity=".1" />
                  <text x={C + Math.cos(ang) * (R + 22)} y={C + Math.sin(ang) * (R + 22) + 4} textAnchor="middle" fill="#a8a29e" fontSize="10" letterSpacing="1.5" fontFamily="Montserrat Variable">{a.toUpperCase()}</text>
                </g>
              )
            })}
            <polygon className="radar-shape" points={radarPoints({ acidity: 0, body: 0, sweetness: 0, bitterness: 0 })} fill="#c8a15a" fillOpacity=".3" stroke="#c8a15a" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row lg:flex-col xl:flex-row">
          <div className="grid w-40 shrink-0 place-items-center self-center [perspective:800px]">
            <div className="taste-bag w-full drop-shadow-[0_24px_24px_rgba(0,0,0,.5)]"><Bag product={p} /></div>
          </div>
          <div className="taste-meta flex-1 self-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{p.kicker}</p>
            <h3 className="mt-2 font-display text-4xl text-cream">{p.name}</h3>
            <p className="mt-2 text-sm text-cream/60">{p.notes.join(' · ')}</p>
            <dl className="mt-6 space-y-3">
              {axes.map((a) => (
                <div key={a}>
                  <div className="flex justify-between text-xs uppercase tracking-[0.15em] text-muted">
                    <dt>{a}</dt><dd className="tabular-nums text-cream">{p.profile[a]}/5</dd>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream/10">
                    <div className={`bar-${a} h-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-gold-deep to-gold`} />
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
