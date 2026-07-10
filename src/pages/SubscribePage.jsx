import PageHeader from '../components/PageHeader.jsx'
import CtaBand from '../components/CtaBand.jsx'
import Pricing from '../components/Pricing.jsx'
import FaqList, { QA } from '../components/Faq.jsx'
import { QiBadge, Reveal, WaButton } from '../components/ui.jsx'
import { FRIDAY_NOTE, FRIDAY_ADD } from '../data/plans.js'
import { usePageMeta } from '../lib/meta.js'
import qiLogo from '../assets/brand/qi.png'

const PAY_STEPS = [
  { t: 'ثبّت على واتساب', d: 'اختار خطتك ودزلنا — نأكد المنطقة ووقت التوصيل.' },
  { t: 'تفاصيل التحويل', d: 'ندزلك تفاصيل التحويل عبر كي كارد (Qi Card).' },
  { t: 'يبدأ اشتراكك', d: 'بمجرد تأكيد التحويل، وجباتك تبدي من أقرب يوم دوام.' }
]

const RULES = [
  FRIDAY_NOTE.base,
  `${FRIDAY_NOTE.add} (+${FRIDAY_ADD})`,
  'التجديد بنفس الطريقة — رسالة واتساب وتحويل كي كارد',
  'التوصيل مجاني داخل بغداد على كل الخطط'
]

const PAYMENT_QA = QA.filter((item) => ['payment', 'start', 'days', 'delivery-cost'].includes(item.id))

function Payment() {
  return (
    <section className="bg-paper pb-20 md:pb-24">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-extrabold text-grape md:text-4xl">طريقة الدفع</h2>
        </Reveal>

        <Reveal delay={80} className="mt-8 rounded-[32px] border-2 border-grape/10 bg-white p-8 shadow-card">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <img src={qiLogo} alt="Qi Card" className="h-16 w-16" />
            <div className="text-center sm:text-start">
              <p className="font-display text-xl font-extrabold text-grape">الدفع عبر تحويل كي كارد</p>
              <p className="mt-1 text-[15px] font-medium text-muted">
                Qi Card — التحويل يتم بعد تثبيت الاشتراك على واتساب.
              </p>
            </div>
          </div>

          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {PAY_STEPS.map((s, i) => (
              <li key={s.t} className="rounded-2xl bg-paper p-5 text-center">
                <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-lemon font-display text-base font-extrabold text-grape">
                  {i + 1}
                </span>
                <p className="mt-3 font-display text-[16px] font-extrabold text-grape">{s.t}</p>
                <p className="mt-1 text-[13px] font-medium leading-relaxed text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={140} className="mt-6 rounded-[26px] border-2 border-grape/10 bg-white p-7 shadow-card">
          <h3 className="font-display text-xl font-extrabold text-grape">قواعد الاشتراك</h3>
          <ul className="mt-3 space-y-2">
            {RULES.map((r) => (
              <li key={r} className="flex items-start gap-2.5 text-[15px] font-medium text-muted">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-lemon ring-1 ring-grape/20" />
                {r}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-10">
          <Reveal className="text-center">
            <h3 className="font-display text-2xl font-extrabold text-grape">أسئلة الدفع والاشتراك</h3>
          </Reveal>
          <div className="mt-6">
            <FaqList items={PAYMENT_QA} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SubscribePage() {
  usePageMeta(
    'الاشتراك والأسعار',
    'خطط اشتراك أسبوعية وشهرية بوجبة أو وجبتين أو ثلاث يومياً، مع حاسبة السعر والدفع عبر كي كارد.'
  )

  return (
    <>
      <PageHeader
        title="الاشتراك والأسعار"
        sub="اختار خطتك، احسب سعرك بالحاسبة، وثبت على واتساب — الدفع عبر كي كارد."
      />
      <Pricing />
      <div className="h-10 bg-paper md:h-14" />
      <Payment />
      <CtaBand title="جاهز تبدي؟" sub="دزلنا رسالة ونمشيك على التثبيت خطوة خطوة.">
        <WaButton msg="مرحبا، اريد ابدأ اشتراك Low Carb">ابدأ الآن على واتساب</WaButton>
        <QiBadge />
      </CtaBand>
    </>
  )
}
