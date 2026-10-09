import { useEffect, useRef } from 'react'

// Thin bar in the FUERTE logo colours across the top of the page that fills as you scroll.
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
        className="h-full w-full origin-left"
        style={{
          transform: 'scaleX(0)',
          // FUERTE logo colours: red, yellow, green in equal thirds.
          background: 'linear-gradient(90deg, #d7261e 0 33.3%, #f2c200 33.3% 66.6%, #2e9e3e 66.6%)',
        }}
      />
    </div>
  )
}
