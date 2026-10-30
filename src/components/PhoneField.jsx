import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { countries, countryName } from '../data/countries'
import { ArrowRight } from './Art'

// Lower case without accents, so "κυπ" finds "Κύπρος".
const plain = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const Flag = ({ id, className = '' }) => (
  <img src={`/flags/${id}.webp`} alt="" width="20" height="15" loading="lazy" className={`h-[15px] w-5 shrink-0 rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(245,239,230,.15)] ${className}`} />
)

// Phone number with a country code picker (flag + dial code, searchable).
// Submits `phoneCountry` (e.g. "gr"), `phoneCode` ("+30") and `phone`.
export default function PhoneField({ label, hint, codeLabel, searchLabel, noMatch, lang }) {
  const uid = useId()
  const root = useRef(null)
  const button = useRef(null)
  const search = useRef(null)
  const list = useRef(null)
  const [country, setCountry] = useState(countries[0])
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const options = useMemo(() => {
    const q = plain(query.trim()).replace(/^\+/, '')
    const all = countries.map((c) => ({ ...c, name: countryName(c.id, lang) }))
    if (!q) return all
    return all.filter((c) => plain(c.name).includes(q) || c.dial.slice(1).startsWith(q) || c.id === q)
  }, [query, lang])

  const close = (refocus = true) => {
    setOpen(false)
    setQuery('')
    if (refocus) button.current?.focus()
  }
  const pick = (c) => { setCountry(c); close() }

  // Open: focus the search box and highlight the current country.
  useEffect(() => {
    if (!open) return
    setActive(Math.max(0, options.findIndex((c) => c.id === country.id)))
    search.current?.focus()
    const outside = (e) => { if (!root.current.contains(e.target)) close(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => { setActive(0) }, [query])

  // Keep the highlighted option in view.
  useEffect(() => {
    list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  useGSAP(() => {
    if (open && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // opacity, not autoAlpha: the search box must stay focusable while it animates.
      gsap.from('.pf-pop', { y: -8, scale: 0.97, opacity: 0, duration: 0.3, ease: 'power3.out', transformOrigin: 'top left' })
    }
  }, { scope: root, dependencies: [open] })

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, options.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (options[active]) pick(options[active]) }
    else if (e.key === 'Escape') { e.preventDefault(); close() }
    else if (e.key === 'Tab') close(false)
  }

  const listId = `${uid}-list`
  const optId = (i) => `${uid}-opt-${i}`

  return (
    <div ref={root} className="relative block min-w-0">
      <span id={`${uid}-label`} className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label} *</span>
      <div className="mt-2 flex rounded-2xl border border-cream/15 bg-espresso/50 transition-colors focus-within:border-gold">
        <button
          ref={button}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true) } }}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`${codeLabel}: ${countryName(country.id, lang)} ${country.dial}`}
          className="flex shrink-0 items-center gap-2 rounded-l-2xl border-r border-cream/10 py-3 pl-4 pr-3 text-cream transition-colors hover:bg-cream/5 focus:outline-none focus-visible:bg-cream/5"
        >
          <Flag id={country.id} />
          <span className="tabular-nums">{country.dial}</span>
          <ArrowRight className={`size-3.5 text-gold transition-transform duration-300 ${open ? '-rotate-90' : 'rotate-90'}`} />
        </button>
        <input
          name="phone"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel-national"
          aria-labelledby={`${uid}-label`}
          // At least `min` digits for the chosen country, at most 15 (international limit).
          pattern={`\\D*(\\d\\D*){${country.min},15}`}
          title={hint(country.min)}
          className="w-0 min-w-0 flex-1 rounded-r-2xl bg-transparent px-4 py-3 text-cream placeholder:text-muted focus:outline-none"
        />
      </div>
      <input type="hidden" name="phoneCountry" value={country.id} />
      <input type="hidden" name="phoneCode" value={country.dial} />

      {open && (
        <div className="pf-pop absolute left-0 top-full z-30 mt-2 w-full max-w-xs overflow-hidden rounded-2xl border border-cream/15 bg-roast shadow-[0_24px_50px_-12px_rgba(0,0,0,.7)]">
          <div className="border-b border-cream/10 p-2">
            <input
              ref={search}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={options[active] ? optId(active) : undefined}
              aria-label={searchLabel}
              placeholder={searchLabel}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKey}
              className="w-full rounded-xl bg-espresso/60 px-3 py-2 text-sm text-cream placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <ul ref={list} id={listId} role="listbox" aria-label={codeLabel} data-lenis-prevent className="max-h-64 overflow-y-auto overscroll-contain p-1.5">
            {options.map((c, i) => (
              <li
                key={c.id}
                id={optId(i)}
                data-i={i}
                role="option"
                aria-selected={c.id === country.id}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(c)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${i === active ? 'bg-cream/10 text-cream' : 'text-cream/80'}`}
              >
                <Flag id={c.id} />
                <span className="flex-1 truncate">{c.name}</span>
                <span className={`tabular-nums ${c.id === country.id ? 'text-gold' : 'text-muted'}`}>{c.dial}</span>
              </li>
            ))}
            {!options.length && <li className="px-3 py-3 text-sm text-muted">{noMatch}</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
