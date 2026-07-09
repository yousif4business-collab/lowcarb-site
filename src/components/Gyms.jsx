import { Arc, Reveal, WaIcon } from './ui.jsx'
import { waGym } from '../data/config.js'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

const ICONS = {
  stopwatch: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9.5 2.5h5M12 2.5V5" />
    </svg>
  ),
  scale: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...stroke}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7.5 9.5a6 6 0 0 1 9 0L14 12a3 3 0 0 0-4 0Z" />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...stroke}>
      <path d="M3 11V4a1 1 0 0 1 1-1h7l10 10-8 8L3 11Z" />
      <circle cx="8" cy="8" r="1.6" />
    </svg>
  ),
  cloche: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...stroke}>
      <path d="M3 17h18M4 17a8 8 0 0 1 16 0" />
      <path d="M12 9V7.5M10.5 6.5a1.5 1.5 0 1 1 3 0" />
    </svg>
  )
}

// the 4 points from the client's own poster
const POINTS = [
  { icon: 'stopwatch', t: 'انتاج يومي طازج', d: 'الوجبات تنطبخ صبيحة يوم التسليم — ما نجهز من قبل بيوم.' },
  { icon: 'scale', t: 'محسوب الأوزان والسعرات', d: 'كل وجبة موزونة ومحسوبة السعرات — جاهزة لبرامج أعضاء قاعتك.' },
  { icon: 'tag', t: 'أسعار خاصة للكميات', d: 'كل ما زاد العدد، السعر أحسن — عروض مخصصة حسب حجم الطلب.' },
  { icon: 'cloche', t: 'نكهات متنوعة', d: 'قائمة أربعة أسابيع بدون تكرار — أعضاؤك ما يملّون.' }
]

export default function Gyms() {
  return (
    <section id="gyms" className="on-grape">
      <Arc fill="#482465" className="bg-paper -mb-px" />
      <div className="bg-grape pb-8 pt-4 text-white md:pb-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <Reveal>
              <p className="font-display text-lg font-bold text-lemon">تجهيز يومي بالجملة</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-2 font-display text-3xl font-extrabold md:text-5xl">
                للقاعات الرياضية والجيمات
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-4 max-w-xl text-lg font-medium text-white/80">
                جهّز أعضاء قاعتك بوجبات لو كارب طازة — نفس مطبخنا، بالجملة وبسعر خاص.
              </p>
            </Reveal>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {POINTS.map((p, i) => (
              <Reveal
                key={p.t}
                delay={180 + i * 80}
                className="flex items-start gap-4 rounded-[24px] bg-white/10 p-5 ring-1 ring-white/15"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lemon text-grape">
                  {ICONS[p.icon]}
                </span>
                <span>
                  <span className="block font-display text-lg font-extrabold">{p.t}</span>
                  <span className="mt-1 block text-[14px] font-medium leading-relaxed text-white/75">
                    {p.d}
                  </span>
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={520} className="mt-10 text-center">
            <a
              href={waGym('مرحبا، اريد عرض تجهيز يومي لقاعة رياضية')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 font-display text-lg font-bold text-white shadow-pop transition hover:-translate-y-0.5 hover:brightness-105"
            >
              <WaIcon />
              اطلب عرض للكميات
            </a>
          </Reveal>
        </div>
      </div>
      <Arc fill="#482465" flip className="bg-paper -mt-px" />
    </section>
  )
}
