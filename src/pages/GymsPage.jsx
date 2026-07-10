import PageHeader from '../components/PageHeader.jsx'
import CtaBand from '../components/CtaBand.jsx'
import { Reveal, WaIcon } from '../components/ui.jsx'
import { waGym } from '../data/config.js'
import { usePageMeta } from '../lib/meta.js'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

const ICONS = {
  stopwatch: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9.5 2.5h5M12 2.5V5" />
    </svg>
  ),
  scale: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7.5 9.5a6 6 0 0 1 9 0L14 12a3 3 0 0 0-4 0Z" />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
      <path d="M3 11V4a1 1 0 0 1 1-1h7l10 10-8 8L3 11Z" />
      <circle cx="8" cy="8" r="1.6" />
    </svg>
  ),
  cloche: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
      <path d="M3 17h18M4 17a8 8 0 0 1 16 0" />
      <path d="M12 9V7.5M10.5 6.5a1.5 1.5 0 1 1 3 0" />
    </svg>
  )
}

// the 4 points from the client's own poster — expanded
const POINTS = [
  {
    icon: 'stopwatch',
    t: 'انتاج يومي طازج',
    d: 'الوجبات تنطبخ صبيحة يوم التسليم — ما نجهز من قبل بيوم. نفس المطبخ السحابي اللي يطبخ لمشتركينا، بنفس معايير النظافة والجودة.'
  },
  {
    icon: 'scale',
    t: 'محسوب الأوزان والسعرات',
    d: 'كل وجبة موزونة بالغرام ومحسوبة السعرات والبروتين — جاهزة تنربط ببرامج التدريب والدايت مال أعضاء قاعتك.'
  },
  {
    icon: 'tag',
    t: 'أسعار خاصة للكميات',
    d: 'تسعيرة خاصة تتناسب مع حجم الطلب اليومي — كل ما زاد العدد، صار السعر أحسن. التسعيرة النهائية حسب الكمية والوجبات المطلوبة.'
  },
  {
    icon: 'cloche',
    t: 'نكهات متنوعة',
    d: 'قائمة أربعة أسابيع بدون تكرار — دجاج، لحم، رز، معكرونة وخضار. أعضاؤك ما يملّون من نفس الأكل.'
  }
]

const STEPS = [
  { t: 'تواصل', d: 'دزلنا على واتساب — خبرنا عدد الوجبات التقريبي وأيام التجهيز.' },
  { t: 'عيّنة وتسعيرة كميات', d: 'نرتبلك عيّنة ونطلعلك تسعيرة حسب الكمية والوجبات.' },
  { t: 'تجهيز يومي', d: 'نبدي التجهيز اليومي الطازج بالمواعيد المتفق عليها.' }
]

const AUDIENCE = ['نوادي رياضية', 'أكاديميات', 'مدربين شخصيين']

export default function GymsPage() {
  usePageMeta(
    'للقاعات الرياضية',
    'تجهيز يومي طازج بالجملة للقاعات الرياضية في بغداد — وجبات موزونة محسوبة السعرات وبأسعار خاصة للكميات.'
  )

  return (
    <>
      <PageHeader
        title="للقاعات الرياضية والجيمات"
        sub="جهّز أعضاء قاعتك بوجبات لو كارب طازة — نفس مطبخنا، بالجملة وبسعر خاص."
      />

      <section className="bg-paper py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* the poster points, expanded */}
          <div className="space-y-4">
            {POINTS.map((p, i) => (
              <Reveal
                key={p.t}
                delay={i * 80}
                className="flex items-start gap-5 rounded-[26px] border-2 border-grape/10 bg-white p-7 shadow-card"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-lemon text-grape">
                  {ICONS[p.icon]}
                </span>
                <span>
                  <h3 className="font-display text-xl font-extrabold text-grape">{p.t}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{p.d}</p>
                </span>
              </Reveal>
            ))}
          </div>

          {/* how we work with gyms */}
          <Reveal className="mt-14 text-center">
            <h2 className="font-display text-2xl font-extrabold text-grape md:text-3xl">
              شلون نشتغل مع القاعات؟
            </h2>
          </Reveal>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal
                as="li"
                key={s.t}
                delay={i * 90}
                className="rounded-[24px] border-2 border-grape/10 bg-white p-6 text-center shadow-card"
              >
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-grape font-display text-lg font-extrabold text-lemon">
                  {i + 1}
                </span>
                <p className="mt-3 font-display text-lg font-extrabold text-grape">{s.t}</p>
                <p className="mt-1 text-[14px] font-medium leading-relaxed text-muted">{s.d}</p>
              </Reveal>
            ))}
          </ol>

          {/* who it's for */}
          <Reveal className="mt-12 text-center">
            <p className="font-display text-lg font-extrabold text-grape">مناسب لـ:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {AUDIENCE.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-white px-5 py-2.5 font-display text-[15px] font-bold text-grape ring-2 ring-grape/15"
                >
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand title="خلي أعضاءك يوصلون لأهدافهم" sub="راسلنا وخبرنا عدد الوجبات — نرتبلك عرض كميات خلال يوم.">
        <a
          href={waGym('مرحبا، اريد عرض تجهيز يومي لقاعة رياضية')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-9 py-4 font-display text-lg font-bold text-white shadow-pop transition hover:-translate-y-0.5 hover:brightness-105"
        >
          <WaIcon />
          اطلب عرض للكميات
        </a>
      </CtaBand>
    </>
  )
}
