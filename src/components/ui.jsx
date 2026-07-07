import { useEffect, useRef, useState } from 'react'
import { wa } from '../data/config.js'

/* ── scroll reveal wrapper ─────────────────────────────────────────── */
export function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }) {
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
    >
      {children}
    </Tag>
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
