import { Reveal, WaButton } from './ui.jsx'
import { wa, CITY } from '../data/config.js'
import lockupYellow from '../assets/brand/lc-lockup-yellow.png'

/* ── sticky nav ────────────────────────────────────────────────────── */
export function Nav() {
  return (
    <nav className="on-grape sticky top-0 z-50 bg-grape/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
        <a href="#" aria-label="Low Carb — الرئيسية">
          <img src={lockupYellow} alt="Low Carb" className="h-11 w-auto" />
        </a>
        <div className="hidden items-center gap-7 font-display text-[15px] font-bold text-white/85 sm:flex">
          <a href="#how" className="transition hover:text-lemon">شلون نشتغل</a>
          <a href="#pricing" className="transition hover:text-lemon">الأسعار</a>
          <a href="#menu" className="transition hover:text-lemon">القائمة</a>
        </div>
        <a
          href="#pricing"
          className="rounded-full bg-lemon px-6 py-2.5 font-display text-[15px] font-extrabold text-grape transition hover:-translate-y-0.5"
        >
          اشترك الآن
        </a>
      </div>
    </nav>
  )
}

/* ── trust strip ───────────────────────────────────────────────────── */
const POINTS = ['قائمة ٤ أسابيع بدون تكرار', 'طبخ يومي طازج', 'توصيل داخل بغداد', 'أكل لو كارب متوازن']

export function Strip() {
  return (
    <div className="bg-grape py-5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2.5 px-6">
        {POINTS.map((p) => (
          <span key={p} className="flex items-center gap-2.5 font-display text-[15px] font-bold text-white/90">
            <span className="h-2 w-2 rounded-full bg-lemon" />
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── rules / logistics ─────────────────────────────────────────────── */
const RULES = [
  { t: 'الجمعة اختيارية', d: 'الاشتراك الأساسي بدون جمعة — تكدر تضيفها بـ 15 ألف.' },
  { t: 'التوصيل داخل بغداد', d: 'حدد منطقتك ووقت الاستلام المناسب وقت التثبيت.' },
  { t: 'الدفع بالتنسيق', d: 'يتم تأكيد طريقة الدفع والاستلام على واتساب.' }
]

export function Rules() {
  return (
    <section className="bg-paper pb-20 pt-2 md:pb-24">
      <div className="mx-auto grid max-w-6xl gap-5 px-6 md:grid-cols-3">
        {RULES.map((r, i) => (
          <Reveal
            key={r.t}
            delay={i * 100}
            className="rounded-[26px] border-2 border-grape/10 bg-white p-7 shadow-card"
          >
            <h3 className="font-display text-xl font-extrabold text-grape">{r.t}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{r.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
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

/* ── footer ────────────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="on-grape bg-grapedeep py-14 text-center">
      <div className="mx-auto max-w-6xl px-6">
        <img src={lockupYellow} alt="Low Carb" className="mx-auto h-14 w-auto" />
        <div className="mt-6 flex justify-center gap-8 font-display text-[15px] font-bold text-white/75">
          <a href="#pricing" className="transition hover:text-lemon">الأسعار</a>
          <a href="#menu" className="transition hover:text-lemon">القائمة</a>
          <a
            href={wa('مرحبا Low Carb')}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-lemon"
          >
            واتساب
          </a>
        </div>
        <p className="mt-6 text-sm text-white/40">© Low Carb · {CITY} — جميع الحقوق محفوظة</p>
      </div>
    </footer>
  )
}
