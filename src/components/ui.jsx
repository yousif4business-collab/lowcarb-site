import { useEffect, useRef, useState } from 'react'
import { wa } from '../data/config.js'

/* ── scroll reveal wrapper ─────────────────────────────────────────── */
export function Reveal({ children, className = '', as: Tag = 'div', delay = 0, ...rest }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true)
            io.unobserve(el)
          }
        }),
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${inView ? 'in' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ── 3D-interactive mark: pointer tilt on fine pointers, gyro tilt where
      permission-free (Android); static everywhere else ───────────────── */
export function TiltMark({ children, className = '', max = 10 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const set = (rx, ry) => {
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    const clamp = (v) => Math.max(-max, Math.min(max, v))

    if (window.matchMedia('(pointer: fine)').matches) {
      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        set(
          clamp(-((e.clientY - r.top) / r.height - 0.5) * 2 * max),
          clamp(((e.clientX - r.left) / r.width - 0.5) * 2 * max)
        )
      }
      const onLeave = () => {
        el.style.transform = ''
      }
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      return () => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      }
    }

    // iOS requires a permission gesture for gyro — static fallback there
    if (
      typeof window.DeviceOrientationEvent !== 'undefined' &&
      typeof window.DeviceOrientationEvent.requestPermission !== 'function'
    ) {
      const onOrient = (e) => {
        if (e.beta == null || e.gamma == null) return
        // beta rests ~45° in-hand; recentre so the mark sits flat there
        set(clamp((e.beta - 45) / 4), clamp(e.gamma / 4))
      }
      window.addEventListener('deviceorientation', onOrient)
      return () => window.removeEventListener('deviceorientation', onOrient)
    }
  }, [max])

  return (
    <span ref={ref} className={`tilt-mark ${className}`}>
      {children}
    </span>
  )
}

/* ── magnetic hover wrapper (pointer:fine + motion-safe only) ──────── */
export function Magnetic({ children, className = '' }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (
      !el ||
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * 0.22
    const y = (e.clientY - r.top - r.height / 2) * 0.22
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block transition-transform duration-150 ease-out ${className}`}
    >
      {children}
    </span>
  )
}

/* ── word-by-word cascade (pairs with .word in index.css) ──────────── */
export function Words({ text, base = 0 }) {
  return text.split(' ').map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="word" style={{ '--i': base + i }}>
        {w}
      </span>{' '}
    </span>
  ))
}

/* ── curved section divider (the printed-menu arc) ─────────────────── */
export function Arc({ fill = '#F2EA4F', flip = false, className = '' }) {
  return (
    <svg
      viewBox="0 0 1440 110"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-full h-[64px] md:h-[96px] ${flip ? 'rotate-180' : ''} ${className}`}
    >
      <path d="M0,110 C420,-30 1020,-30 1440,110 L1440,110 L0,110 Z" fill={fill} />
    </svg>
  )
}

/* ── WhatsApp CTA ──────────────────────────────────────────────────── */
export function WaButton({ msg, children, className = '', ghost = false }) {
  return (
    <a
      href={wa(msg)}
      target="_blank"
      rel="noopener noreferrer"
      className={
        ghost
          ? `inline-flex items-center gap-2.5 rounded-full border-[2.5px] border-grape px-7 py-3.5 font-display font-bold text-lg text-grape transition hover:bg-grape hover:text-lemon ${className}`
          : `inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 font-display font-bold text-lg text-white shadow-pop transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 ${className}`
      }
    >
      {!ghost && <WaIcon />}
      {children}
    </a>
  )
}

export function WaIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15L2 21.8l4.9-1.3A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.1-4.6-.2-.2-1.3-1.7-1.3-3.2s.8-2.3 1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .5 0 .7.5.2.5.8 1.9.8 2 .1.1.1.3 0 .5-.1.2-.2.3-.3.5l-.4.4c-.2.2-.3.4-.1.7.2.3.8 1.2 1.6 2 1.1 1 1.9 1.3 2.2 1.4.3.1.5.1.6-.1l.8-.9c.2-.2.4-.3.6-.2.3.1 1.5.7 1.7.9.3.1.4.2.5.3 0 .2 0 .6-.1 1.1Z" />
    </svg>
  )
}

/* ── Qi Card badge — official logo if present, text fallback ───────── */
// optional asset: drop the official logo at src/assets/brand/qi.png
const qiLogo = import.meta.glob('../assets/brand/qi.png', {
  eager: true,
  import: 'default'
})['../assets/brand/qi.png']

export function QiBadge({ sm = false, className = '' }) {
  if (qiLogo) {
    // the official roundel carries no wordmark — always label it (brand rule)
    return (
      <span
        className={`inline-flex items-center rounded-full bg-white font-display font-bold text-grape ring-1 ring-grape/15 ${
          sm ? 'gap-1.5 px-3 py-1 text-[13px]' : 'gap-2 px-4 py-1.5 text-[15px]'
        } ${className}`}
      >
        <img src={qiLogo} alt="" className={sm ? 'h-5 w-5' : 'h-6 w-6'} />
        كي كارد
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center rounded-full bg-white font-display font-bold text-grape ring-1 ring-grape/15 ${
        sm ? 'px-3 py-1 text-[13px]' : 'px-4 py-1.5 text-[15px]'
      } ${className}`}
    >
      كي كارد
    </span>
  )
}

/* ── share a week's menu (native share, wa.me fallback) ────────────── */
export function shareWeek(week) {
  const text =
    `منيو ${week.title} — Low Carb\n` +
    week.days.map((d) => `${d.day}: ${d.dishes.join('، ')}`).join('\n')
  if (navigator.share) {
    navigator.share({ title: 'Low Carb', text, url: location.href }).catch(() => {})
  } else {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${text}\n${location.href}`)}`,
      '_blank',
      'noopener'
    )
  }
}

export function ShareIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="17.5" cy="5.5" r="2.6" />
      <circle cx="17.5" cy="18.5" r="2.6" />
      <path d="m8.4 10.8 6.8-4M8.4 13.2l6.8 4" />
    </svg>
  )
}

/* ── leaf accent (from the logo) ───────────────────────────────────── */
export function Leaf({ className = '' }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
      <path
        d="M4 28C10 8 30 2 46 4 42 22 22 32 4 28Z"
        fill="currentColor"
      />
    </svg>
  )
}
