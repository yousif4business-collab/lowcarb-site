import PageHeader from '../components/PageHeader.jsx'
import CtaBand from '../components/CtaBand.jsx'
import { Reveal } from '../components/ui.jsx'
import { APP_URL } from '../data/config.js'
import { usePageMeta } from '../lib/meta.js'
import appQr from '../assets/brand/app-qr.png'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

const FEATURES = [
  {
    t: 'الطلب بثواني',
    d: 'جاوب كم سؤال وطلبك ينرسل جاهز بكل التفاصيل على واتساب.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
    )
  },
  {
    t: 'القائمة والسعرات',
    d: 'الأربع أسابيع كاملة بجيبك — كل أكلة بسعراتها وبروتينها وكاربها.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
        <path d="M4 4h16v16H4z" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    )
  },
  {
    t: 'يعمل بدون إنترنت',
    d: 'القائمة وطلباتك محفوظة بجهازك — حتى لو انقطع النت.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
        <path d="M5 12.5a7 7 0 0 1 14 0M8.5 15.5a3.8 3.8 0 0 1 7 0M12 19h.01" />
      </svg>
    )
  },
  {
    t: 'سجل طلباتك',
    d: 'كل طلباتك السابقة بمكان واحد — وإعادة الطلب بضغطة.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    )
  }
]

const IOS_STEPS = ['افتح الرابط بسفاري', 'اضغط مشاركة', 'إضافة إلى الشاشة الرئيسية']
const ANDROID_STEPS = ['افتح الرابط بكروم', 'افتح قائمة المتصفح ⋮', 'تثبيت التطبيق']

function InstallCard({ os, steps }) {
  return (
    <div className="rounded-[26px] border-2 border-grape/10 bg-white p-7 shadow-card">
      <h3 className="font-display text-xl font-extrabold text-grape">{os}</h3>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lemon font-display text-[14px] font-extrabold text-grape">
              {i + 1}
            </span>
            <span className="text-[15px] font-medium text-ink/80">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function AppPage() {
  usePageMeta(
    'التطبيق',
    'حمّل تطبيق Low Carb — اطلب اشتراكك بثواني، تصفح القائمة والسعرات، ويشتغل حتى بدون إنترنت.'
  )

  return (
    <>
      <PageHeader
        title="تطبيق Low Carb"
        sub="اطلب من التطبيق — أسرع وأسهل. يشتغل من المتصفح، بدون متجر وبدون تحديثات."
      />

      {/* feature grid + QR */}
      <section className="bg-paper py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-14">
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal
                key={f.t}
                delay={i * 80}
                className="rounded-[24px] border-2 border-grape/10 bg-white p-6 shadow-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lemon text-grape">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-display text-lg font-extrabold text-grape">{f.t}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{f.d}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160} className="mx-auto w-full max-w-sm">
            <div className="rounded-[32px] border-2 border-grape/10 bg-white p-7 text-center shadow-pop">
              <img
                src={appQr}
                alt="رمز QR لتثبيت تطبيق Low Carb"
                className="mx-auto w-full max-w-[300px] rounded-2xl"
              />
              <p className="mt-4 font-display text-xl font-extrabold text-grape">امسح وثبّت التطبيق</p>
            </div>
          </Reveal>
        </div>

        {/* install steps by platform */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 px-6 sm:grid-cols-2">
          <Reveal>
            <InstallCard os="آيفون (iOS)" steps={IOS_STEPS} />
          </Reveal>
          <Reveal delay={90}>
            <InstallCard os="أندرويد (Android)" steps={ANDROID_STEPS} />
          </Reveal>
        </div>
      </section>

      <CtaBand title="جرّبه هسة" sub="يفتح بالمتصفح مباشرة — والتثبيت اختياري.">
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-grape px-9 py-4 font-display text-lg font-extrabold text-lemon shadow-pop transition hover:-translate-y-0.5"
        >
          افتح التطبيق
        </a>
      </CtaBand>
    </>
  )
}
