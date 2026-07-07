import { useEffect, useRef, useState } from 'react'
import { WEEKS } from '../data/menu.js'

const UNIQUE_DISHES = new Set(WEEKS.flatMap((w) => w.days.flatMap((d) => d.dishes))).size

const ITEMS = [
  { n: UNIQUE_DISHES, suffix: '+', label: 'أكلة مختلفة' },
  { n: 4, suffix: '', label: 'أسابيع بدون تكرار' },
  { n: 6, suffix: '', label: 'أيام توصيل بالأسبوع' },
  { n: 3, suffix: '', label: 'وجبات باليوم لغاية' }
]

export default function Stats() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setStarted(true)
            io.unobserve(el)
          }
        }),
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="bg-paper pb-20 md:pb-24">
      <div ref={ref} className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
        {ITEMS.map((it) => (
          <div key={it.label} className="text-center">
            <p className="font-display text-5xl font-extrabold leading-none text-grape md:text-6xl">
              <CountUp target={it.n} started={started} />
              {it.suffix}
            </p>
            <p className="mt-2 text-[15px] font-bold text-muted">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CountUp({ target, started }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!started) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min((t - t0) / 900, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, target])

  return value
}
