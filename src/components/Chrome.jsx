import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { QiBadge, Reveal, TiltMark, WaButton, WaIcon } from './ui.jsx'
import { wa, CITY, INSTAGRAM } from '../data/config.js'
import lockupYellow from '../assets/brand/lc-lockup-yellow.png'

// [path, label, lowPriority] — low-priority links hide at md, show at lg
const LINKS = [
  ['/', 'الرئيسية'],
  ['/menu', 'القائمة'],
  ['/subscribe', 'الاشتراك'],
  ['/app', 'التطبيق'],
  ['/gyms', 'للقاعات', true],
  ['/about', 'من نحن', true],
  ['/faq', 'الأسئلة', true]
]

/* ── sticky nav: scroll progress, active section, mobile menu ──────── */
export function Nav() {
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
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

  return (
    <nav
      className={`on-grape sticky top-0 z-50 bg-grape/95 backdrop-blur ${
        scrolled ? 'shadow-[0_10px_30px_-12px_rgba(46,21,67,0.6)]' : ''
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
        <Link to="/" aria-label="Low Carb — الرئيسية">
          <TiltMark>
            <img src={lockupYellow} alt="Low Carb" className="h-11 w-auto" />
          </TiltMark>
        </Link>
        <div className="hidden items-center gap-6 font-display text-[15px] font-bold md:flex lg:gap-7">
          {LINKS.map(([path, label, lo]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `${lo ? 'hidden lg:inline-block' : ''} transition hover:text-lemon ${
                  isActive ? 'text-lemon' : 'text-white/85'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/subscribe"
            className="hidden rounded-full bg-lemon px-6 py-2.5 font-display text-[15px] font-extrabold text-grape transition hover:-translate-y-0.5 md:block"
          >
            اشترك الآن
          </Link>
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'اغلق القائمة' : 'افتح القائمة'}
            className="grid h-11 w-11 place-items-center rounded-xl text-white lg:hidden"
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
        <div className="border-t border-white/10 bg-grapedeep px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1 font-display text-lg font-bold">
            {LINKS.map(([path, label]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 transition ${
                    isActive ? 'bg-white/10 text-lemon' : 'text-white/90'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/subscribe"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-lemon px-6 py-3 text-center font-extrabold text-grape"
            >
              اشترك الآن
            </Link>
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
const POINTS = ['قائمة ٤ أسابيع بدون تكرار', 'طبخ يومي طازج', 'توصيل مجاني داخل بغداد', 'أكل لو كارب متوازن', 'بإشراف شيف مختص بالتغذية']

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
      className="no-print fixed bottom-6 left-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-pop transition hover:-translate-y-1 md:grid"
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
      className={`no-print fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-grape/95 backdrop-blur transition-transform duration-300 md:hidden ${
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

/* ── شاركنا رأيك — stars + optional text → prefilled WA message ────── */
function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-9 w-9"
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M12 2.8 14.9 8.7l6.4.9-4.6 4.5 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.7 9.6l6.4-.9L12 2.8Z" />
    </svg>
  )
}

export function RateUs({ className = 'transition hover:text-lemon' }) {
  const [open, setOpen] = useState(false)
  const [stars, setStars] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const msg = `تقييمي لـ Low Carb: ${stars}/5${text.trim() ? ` — ${text.trim()}` : ''}`

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        شاركنا رأيك
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-5"
          role="dialog"
          aria-modal="true"
          aria-label="شاركنا رأيك"
        >
          <button
            type="button"
            aria-label="إغلاق"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-grapedeep/70"
          />
          <div className="relative w-full max-w-sm rounded-[28px] bg-white p-7 text-center shadow-pop">
            <h3 className="font-display text-2xl font-extrabold text-grape">شلون كانت تجربتك؟</h3>

            <div className="mt-5 flex flex-row-reverse justify-center gap-2" dir="ltr">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} من 5`}
                  aria-pressed={stars >= n}
                  onClick={() => setStars(n)}
                  className={`transition hover:scale-110 ${
                    stars >= n ? 'text-lemon drop-shadow-[0_1px_0_rgba(72,36,101,0.4)]' : 'text-grape/25'
                  }`}
                >
                  <Star filled={stars >= n} />
                </button>
              ))}
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="تحب تضيف شي؟ (اختياري)"
              className="mt-5 w-full resize-none rounded-2xl border-2 border-grape/10 bg-paper p-4 text-start text-[15px] font-medium text-ink placeholder:text-muted/70 focus:border-grape/40 focus:outline-none"
            />

            {stars > 0 ? (
              <a
                href={wa(msg)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 font-display text-[15px] font-extrabold text-white transition hover:brightness-105"
              >
                <WaIcon size={20} />
                دز التقييم على واتساب
              </a>
            ) : (
              <p className="mt-4 rounded-full bg-paper py-3.5 text-[13px] font-bold text-muted">
                اختار عدد النجوم أول
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

/* ── footer — grouped link columns ─────────────────────────────────── */
export function Footer() {
  return (
    <footer className="on-grape bg-grapedeep py-14">
      <div className="mx-auto max-w-6xl px-6">
        <img src={lockupYellow} alt="Low Carb" className="mx-auto h-14 w-auto" />

        <div className="mx-auto mt-10 grid max-w-3xl gap-10 text-center sm:grid-cols-3 sm:text-start">
          <div>
            <h3 className="font-display text-[15px] font-extrabold text-lemon">الصفحات</h3>
            <ul className="mt-3 space-y-2 font-display text-[15px] font-bold text-white/75">
              {LINKS.map(([path, label]) => (
                <li key={path}>
                  <Link to={path} className="transition hover:text-lemon">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[15px] font-extrabold text-lemon">تواصل</h3>
            <ul className="mt-3 space-y-2 font-display text-[15px] font-bold text-white/75">
              <li>
                <a
                  href={wa('مرحبا Low Carb')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-lemon"
                >
                  واتساب
                </a>
              </li>
              {INSTAGRAM && (
                <li>
                  <a
                    href={INSTAGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-lemon"
                  >
                    انستغرام
                  </a>
                </li>
              )}
              <li>
                <RateUs />
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[15px] font-extrabold text-lemon">الدفع والتوصيل</h3>
            <div className="mt-3 flex justify-center sm:justify-start">
              <QiBadge sm />
            </div>
            <p className="mt-3 text-sm font-bold leading-relaxed text-white/60">
              الدفع عبر تحويل كي كارد
              <br />
              توصيل يومي مجاني داخل بغداد
              <br />
              السبت إلى الخميس
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-white/60">
          © Low Carb · {CITY} — جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  )
}
