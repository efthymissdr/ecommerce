import { useRef } from 'react'
import { NavLink, Navigate, useParams } from 'react-router'
import { gsap, useGSAP } from '../lib/gsap'
import { useLang } from '../i18n'
import { legalContent, legalSlugs, company } from '../data/legal'
import { Mail } from './Art'
import { Eyebrow } from './ui'

// Plain text page for the footer's information links (/legal/terms etc.).
export default function LegalPage() {
  const { slug } = useParams()
  const { t } = useLang()
  const c = legalContent[t.code] || legalContent.en
  const page = c.pages[slug]
  const root = useRef(null)

  useGSAP(() => {
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.from('.lg-in', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' })
  }, { scope: root, dependencies: [slug], revertOnUpdate: true })

  if (!page) return <Navigate to="/legal/terms" replace />

  return (
    <main ref={root} className="mx-auto max-w-7xl px-5 pt-36 pb-24 md:px-8 md:pt-44">
      <div className="grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-20">
        <nav aria-label={c.other} className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">{c.nav}</p>
          <ul className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {legalSlugs.map((s) => (
              <li key={s} className="shrink-0">
                <NavLink
                  to={`/legal/${s}`}
                  className={({ isActive }) => `block whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors duration-300 lg:whitespace-normal lg:rounded-xl ${isActive ? 'border-gold/50 bg-gold/10 text-gold' : 'border-cream/10 text-cream/70 hover:border-cream/25 hover:text-cream lg:border-transparent'}`}
                >
                  {c.pages[s].title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-3xl">
          <Eyebrow className="lg-in">{c.nav}</Eyebrow>
          <h1 className="lg-in mt-6 font-display text-[clamp(2.6rem,6vw,4.75rem)] leading-[0.95] text-cream">{page.title}</h1>
          <p className="lg-in mt-4 text-sm text-muted">{c.updated}: {c.date}</p>
          <p className="lg-in mt-8 text-lg leading-relaxed text-cream/85">{page.intro}</p>
          {/* Placeholder notice until the text is approved. */}
          <p className="lg-in mt-6 rounded-2xl border border-gold/30 bg-gold/[0.07] px-5 py-4 text-sm text-gold">{c.draft}</p>

          <div className="mt-12 space-y-10">
            {page.sections.map((s) => (
              <section key={s.h} className="lg-in border-t border-cream/10 pt-8">
                <h2 className="font-display text-2xl text-cream md:text-3xl">{s.h}</h2>
                {s.p?.map((p) => <p key={p} className="mt-4 leading-relaxed text-cream/75">{p}</p>)}
                {s.list && (
                  <ul className="mt-4 space-y-2">
                    {s.list.map((li) => (
                      <li key={li} className="flex gap-3 leading-relaxed text-cream/75">
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="lg-in mt-16 flex flex-col gap-4 rounded-3xl border border-cream/10 bg-roast/60 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <p className="font-display text-2xl text-cream">{c.questions}</p>
            <a href={`mailto:${company.email}`} className="inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-gold px-6 text-sm font-semibold text-espresso transition-colors hover:bg-crema sm:self-auto">
              <Mail className="size-4" /> {c.contact}
            </a>
          </div>
        </article>
      </div>
    </main>
  )
}
