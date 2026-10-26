import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, FULL } from '../lib/gsap'
import { ArrowRight } from './Art'

const AUTOPLAY = 5 // seconds per slide

// Photo carousel: drag or swipe, arrow buttons, dots, keyboard arrows and an
// autoplay progress bar that pauses on hover, focus or when off screen.
export default function Carousel({ slides, labels }) {
  const root = useRef(null)
  const track = useRef(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const hover = useRef(false)
  const visible = useRef(false)
  const progress = useRef(null)
  const n = slides.length
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const go = useCallback((i) => setIndex(((i % n) + n) % n), [n])

  const offsetFor = (i) => {
    const slide = track.current.children[i]
    const viewport = root.current.querySelector('.cr-viewport')
    return -(slide.offsetLeft - (viewport.clientWidth - slide.clientWidth) / 2)
  }

  // Glide to the active slide; neighbours dim and shrink slightly.
  useGSAP(() => {
    const d = reduce() ? 0 : 0.9
    gsap.to(track.current, { x: offsetFor(index), duration: d, ease: 'expo.out' })
    gsap.utils.toArray('.cr-slide', root.current).forEach((s, i) => {
      const active = i === index
      gsap.to(s, { scale: active ? 1 : 0.9, opacity: active ? 1 : 0.45, duration: d, ease: 'expo.out' })
      gsap.to(s.querySelector('img'), { xPercent: active ? 0 : (i < index ? 8 : -8), duration: d * 1.4, ease: 'expo.out' })
    })
    if (!reduce()) gsap.fromTo(`.cr-cap-${index}`, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, delay: 0.25, ease: 'power3.out' })
  }, { scope: root, dependencies: [index] })

  // Keep the active slide centred on resize.
  useEffect(() => {
    const onResize = () => gsap.set(track.current, { x: offsetFor(index) })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  })

  // Autoplay: a progress bar fills, then advances. Paused on hover/focus/off-screen.
  useGSAP(() => {
    if (reduce()) return
    const tween = gsap.fromTo(progress.current, { scaleX: 0 }, {
      scaleX: 1, duration: AUTOPLAY, ease: 'none', paused: true,
      onComplete: () => go(index + 1),
    })
    const sync = () => (playing && !hover.current && visible.current ? tween.play() : tween.pause())
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; sync() }, { threshold: 0.4 })
    io.observe(root.current)
    root.current._sync = sync
    sync()
    return () => io.disconnect()
  }, { scope: root, dependencies: [index, playing], revertOnUpdate: true })

  const setHover = (v) => { hover.current = v; root.current._sync?.() }

  // Pointer drag / swipe.
  const drag = useRef(null)
  const onDown = (e) => {
    drag.current = { x: e.clientX, base: gsap.getProperty(track.current, 'x'), moved: 0 }
    track.current.setPointerCapture(e.pointerId)
  }
  const onMove = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    drag.current.moved = dx
    gsap.set(track.current, { x: drag.current.base + dx })
  }
  const onUp = () => {
    if (!drag.current) return
    const { moved } = drag.current
    drag.current = null
    if (Math.abs(moved) > 60) go(index + (moved < 0 ? 1 : -1))
    else gsap.to(track.current, { x: offsetFor(index), duration: 0.6, ease: 'expo.out' })
  }

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1) }
  }

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL, () => {
      gsap.from('.cr-viewport', { y: 80, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 80%' } })
    })
  }, { scope: root })

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.title}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="relative outline-none"
    >
      <div className="cr-viewport overflow-hidden">
        <div
          ref={track}
          className="flex cursor-grab touch-pan-y select-none gap-4 active:cursor-grabbing md:gap-6"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {slides.map((s, i) => (
            <figure
              key={s.id}
              className="cr-slide relative aspect-[4/3] w-[84vw] shrink-0 overflow-hidden rounded-[2rem] bg-roast md:aspect-[16/9] md:w-[min(70vw,960px)]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${n}`}
              aria-hidden={i !== index}
            >
              <img src={s.src} alt={s.caption} draggable="false" loading="lazy" decoding="async" className="absolute inset-0 size-full scale-110 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/10 to-transparent" />
              <figcaption className={`cr-cap-${i} absolute bottom-0 left-0 p-6 md:p-10`}>
                <span className="text-xs font-semibold tabular-nums tracking-[0.3em] text-gold">0{i + 1} / 0{n}</span>
                <span className="mt-2 block font-display text-3xl text-cream md:text-5xl">{s.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <div className="flex min-w-0 items-center sm:gap-1" role="group">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              aria-label={labels.goTo(i + 1)}
              aria-current={i === index}
              className="group grid h-11 place-items-center px-1"
            >
              <span className={`block h-1 overflow-hidden rounded-full bg-cream/15 transition-all duration-500 ease-expo ${i === index ? 'w-10 sm:w-14' : 'w-4 group-hover:bg-cream/30 sm:w-6'}`}>
                {i === index && <span ref={progress} className="block h-full origin-left rounded-full bg-gold" />}
              </span>
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? labels.pause : labels.play} className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream/80 transition-colors hover:border-gold hover:text-gold">
            {playing
              ? <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
              : <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>}
          </button>
          <button onClick={() => go(index - 1)} aria-label={labels.prev} className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream transition-all hover:-translate-x-0.5 md:size-12 hover:border-gold hover:text-gold">
            <ArrowRight className="size-5 rotate-180" />
          </button>
          <button onClick={() => go(index + 1)} aria-label={labels.next} className="grid size-11 place-items-center rounded-full bg-gold text-espresso md:size-12 transition-all hover:translate-x-0.5 hover:bg-crema">
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
