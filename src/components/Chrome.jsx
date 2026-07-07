import { useEffect, useRef, useState } from 'react'
import { QiBadge, Reveal, WaButton, WaIcon } from './ui.jsx'
import { wa, CITY, INSTAGRAM } from '../data/config.js'
import lockupYellow from '../assets/brand/lc-lockup-yellow.png'

const LINKS = [
  ['how', 'شلون نشتغل'],
  ['pricing', 'الأسعار'],
  ['menu', 'القائمة'],
  ['faq', 'الأسئلة']
]

/* ── sticky nav: scroll progress, active section, mobile menu ──────── */
export function Nav() {
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const burgerRef = useRef(null)

  // Escape closes the mobile panel and hands focus back to the burger
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0)
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    LINKS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <nav
      className={`on-grape sticky top-0 z-50 bg-grape/95 backdrop-blur ${
        scrolled ? 'shadow-[0_10px_30px_-12px_rgba(46,21,67,0.6)]' : ''
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
        <a href="#" aria-label="Low Carb — الرئيسية">
          <img src={lockupYellow} alt="Low Carb" className="h-11 w-auto" />
        </a>
        <div className="hidden items-center gap-7 font-display text-[15px] font-bold md:flex">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={`transition hover:text-lemon ${
                active === id ? 'text-lemon' : 'text-white/85'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#pricing"
            className="hidden rounded-full bg-lemon px-6 py-2.5 font-display text-[15px] font-extrabold text-grape transition hover:-translate-y-0.5 md:block"
          >
            اشترك الآن
          </a>
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'اغلق القائمة' : 'افتح القائمة'}
            className="grid h-11 w-11 place-items-center rounded-xl text-white md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* mobile panel */}
      {open && (
        <div className="border-t border-white/10 bg-grapedeep px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1 font-display text-lg font-bold">
            {LINKS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 transition ${
                  active === id ? 'bg-white/10 text-lemon' : 'text-white/90'
                }`}
              >
                {label}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-lemon px-6 py-3 text-center font-extrabold text-grape"
            >
              اشترك الآن
            </a>
          </div>
        </div>
      )}

      {/* scroll progress */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-[3px] bg-lemon"
        style={{ width: `${progress}%` }}
      />
    </nav>
  )
}

/* ── trust strip — infinite marquee ────────────────────────────────── */
const POINTS = ['قائمة ٤ أسابيع بدون تكرار', 'طبخ يومي طازج', 'توصيل داخل بغداد', 'أكل لو كارب متوازن']

export function Strip() {
  return (
    <div className="overflow-hidden bg-grape py-5" dir="ltr">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            data-copy={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center"
          >
            {POINTS.map((p) => (
              <span
                key={p}
                dir="rtl"
                className="mx-6 flex items-center gap-2.5 font-display text-[15px] font-bold text-white/90"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-lemon" />
                {p}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── final CTA ─────────────────────────────────────────────────────── */
export function FinalCta() {
  return (
    <section className="bg-lemon py-20 text-center md:py-24">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold text-grape md:text-5xl">
            جاهز تبدي اشتراكك؟
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-4 text-lg font-medium text-ink/70">
            دزلنا رسالة على واتساب ونساعدك تختار الخطة المناسبة لهدفك.
          </p>
        </Reveal>
        <Reveal delay={180} className="mt-9">
          <WaButton msg="مرحبا، اريد ابدأ اشتراك Low Carb">ابدأ الآن على واتساب</WaButton>
        </Reveal>
      </div>
    </section>
  )
}

/* ── floating WhatsApp (desktop only — mobile has the CTA bar) ─────── */
export function FloatingWa() {
  return (
    <a
      href={wa('مرحبا، اريد استفسر عن اشتراكات Low Carb')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="راسلنا على واتساب"
      className="fixed bottom-6 left-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-pop transition hover:-translate-y-1 md:grid"
    >
      <WaIcon size={26} />
    </a>
  )
}

/* ── mobile bottom CTA bar ─────────────────────────────────────────── */
export function MobileCta() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-grape/95 backdrop-blur transition-transform duration-300 md:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-between gap-4 px-5 pt-3">
        <div>
          <p className="text-xs font-medium text-white/70">اشتراكات تبدأ من</p>
          <p className="font-display text-lg font-extrabold leading-tight text-lemon">
            100 ألف / أسبوع
          </p>
        </div>
        <a
          href={wa('مرحبا، اريد استفسر عن اشتراكات Low Carb')}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-lemon px-8 py-3 font-display text-base font-extrabold text-grape"
        >
          اشترك
        </a>
      </div>
    </div>
  )
}

/* ── footer ────────────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="on-grape bg-grapedeep py-14 text-center">
      <div className="mx-auto max-w-6xl px-6">
        <img src={lockupYellow} alt="Low Carb" className="mx-auto h-14 w-auto" />
        <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 font-display text-[15px] font-bold text-white/75">
          <a href="#pricing" className="transition hover:text-lemon">الأسعار</a>
          <a href="#menu" className="transition hover:text-lemon">القائمة</a>
          <a href="#faq" className="transition hover:text-lemon">الأسئلة</a>
          <a
            href={wa('مرحبا Low Carb')}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-lemon"
          >
            واتساب
          </a>
          {INSTAGRAM && (
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-lemon"
            >
              انستغرام
            </a>
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold text-white/60">
          <span>توصيل يومي داخل بغداد — السبت إلى الخميس</span>
          <span className="flex items-center gap-2">
            الدفع عبر كي كارد
            <QiBadge sm />
          </span>
        </div>
        <p className="mt-3 text-sm text-white/60">© Low Carb · {CITY} — جميع الحقوق محفوظة</p>
      </div>
    </footer>
  )
}
