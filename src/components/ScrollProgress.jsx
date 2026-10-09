import { useEffect, useRef } from 'react'

// Thin brand-gold bar across the top of the page that fills as you scroll.
// Same idea as the Claude Design prototype: scaleX = scrollY / (scrollHeight − viewport).
// Updated in a rAF loop so it tracks Lenis' smoothed scroll exactly.
export default function ScrollProgress() {
  const bar = useRef(null)

  useEffect(() => {
    let raf
    let last = -1
    const frame = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (Math.abs(p - last) > 0.0005) {
        bar.current.style.transform = `scaleX(${p.toFixed(4)})`
        last = p
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px]" aria-hidden="true">
      <div
        ref={bar}
        className="h-full w-full origin-left bg-[linear-gradient(90deg,var(--color-gold-deep),var(--color-gold)_45%,var(--color-crema)_75%,var(--color-gold))] shadow-[0_0_12px_rgba(200,161,90,.7)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
