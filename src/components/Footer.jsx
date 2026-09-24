import { useRef, useState } from 'react'
import { gsap, useGSAP, FULL } from '../lib/gsap'
import { ArrowUpRight, ArrowRight, Instagram, Facebook, Mail, Truck, Cup } from './Art'
import { Magnetic, Button, Eyebrow } from './ui'

export function Wholesale() {
  const root = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.fromTo('.ws-card', { scale: 0.88, borderRadius: '6rem' }, {
        scale: 1, borderRadius: '2.5rem', ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 25%', scrub: true },
      })
      gsap.from('.ws-in', { y: 50, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.ws-card', start: 'top 65%' } })
      gsap.to('.ws-cup', { rotate: 8, y: -20, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
  }, { scope: root })

  return (
    <section id="wholesale" ref={root} className="px-4 py-10 md:px-8">
      <div className="ws-card relative mx-auto max-w-7xl overflow-hidden bg-gold px-6 py-16 text-espresso md:px-16 md:py-24">
        <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full border-[40px] border-espresso/5" />
        <div className="ws-cup pointer-events-none absolute -bottom-10 right-4 w-56 opacity-90 md:right-16 md:w-80"><Cup /></div>
        <div className="relative max-w-2xl">
          <p className="ws-in text-xs font-semibold uppercase tracking-[0.3em] text-espresso/70">For cafés, hotels & offices</p>
          <h2 className="ws-in mt-5 font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.92]">
            Serve FUERTE <em>in your space.</em>
          </h2>
          <p className="ws-in mt-6 max-w-md text-espresso/75">
            Custom blends, barista training and equipment support for businesses across Greece.
          </p>
          <div className="ws-in mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <Button href="mailto:info@fuerte.gr" variant="dark">
                Become a partner <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Footer() {
  const root = useRef(null)
  const [sent, setSent] = useState(false)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.from('.ft-letter', {
        yPercent: 100, duration: 1.2, stagger: 0.05, ease: 'expo.out',
        scrollTrigger: { trigger: '.ft-word', start: 'top 95%' },
      })
    })
  }, { scope: root })

  useGSAP(() => {
    if (sent) gsap.from('.nl-thanks', { y: 16, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)' })
  }, { scope: root, dependencies: [sent] })

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-cream/10 bg-espresso pt-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Eyebrow>Newsletter</Eyebrow>
          <h3 className="mt-5 font-display text-4xl text-cream md:text-5xl">New roasts, first.</h3>
          {sent ? (
            <p className="nl-thanks mt-8 text-gold" role="status">Thank you — check your inbox to confirm.</p>
          ) : (
            <form className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-cream/15 p-1.5 focus-within:border-gold" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
              <label htmlFor="nl-email" className="sr-only">Email address</label>
              <input id="nl-email" type="email" required placeholder="you@email.com" autoComplete="email" className="min-h-11 flex-1 bg-transparent px-4 text-cream placeholder:text-muted focus:outline-none" />
              <button className="grid size-11 shrink-0 place-items-center rounded-full bg-gold text-espresso transition-transform duration-300 hover:scale-105 active:scale-95" aria-label="Subscribe">
                <ArrowRight className="size-5" />
              </button>
            </form>
          )}
          <p className="mt-6 flex items-center gap-2 text-sm text-muted"><Truck className="size-4 text-gold" /> Fresh-roasted and shipped across Greece</p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Explore</p>
          <ul className="mt-5 space-y-3">
            {[['#shop', 'Shop'], ['#story', 'Our story'], ['#craft', 'The craft'], ['#taste', 'Taste profile'], ['#wholesale', 'Wholesale']].map(([h, l]) => (
              <li key={h}><a href={h} className="text-cream/80 transition-colors hover:text-gold">{l}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Say hello</p>
          <ul className="mt-5 space-y-3 text-cream/80">
            <li><a href="mailto:info@fuerte.gr" className="inline-flex items-center gap-2 transition-colors hover:text-gold"><Mail className="size-4" /> info@fuerte.gr</a></li>
          </ul>
          <div className="mt-6 flex gap-2">
            {[[Instagram, 'Instagram'], [Facebook, 'Facebook']].map(([I, l]) => (
              <a key={l} href="#" aria-label={l} className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:text-gold">
                <I className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="ft-word mt-20 flex select-none justify-center overflow-hidden font-display text-[23vw] leading-[0.8] tracking-tight text-cream/[0.06]" aria-hidden="true">
        {'FUERTE'.split('').map((l, i) => <span key={i} className="ft-letter inline-block">{l}</span>)}
      </p>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 border-t border-cream/10 px-5 py-6 text-xs text-muted md:flex-row md:px-8">
        <p>© {new Date().getFullYear()} FUERTE coffee roasters. Since 1997.</p>
        <p>100% Arabica · Roasted in Greece</p>
      </div>
    </footer>
  )
}
