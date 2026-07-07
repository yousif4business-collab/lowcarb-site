import { useState } from 'react'
import { Reveal } from './ui.jsx'

const QA = [
  {
    q: 'شنو يعني "لو كارب"؟',
    a: 'وجبات قليلة الكربوهيدرات ومدروسة السعرات، ببروتين أعلى — تساعدك تنزل وزن أو تثبت عليه وانت شبعان، بدون ما تحس محروم من الأكل العراقي.'
  },
  {
    q: 'شلون أبدي اشتراكي؟',
    a: 'تختار الخطة اللي تناسبك وتدزلنا على واتساب. نثبت منطقتك ووقت التوصيل، وتبدي وجباتك من أقرب يوم دوام.'
  },
  {
    q: 'أي أيام توصلون؟',
    a: 'من السبت للخميس، ست أيام بالأسبوع. الجمعة عطلة — وإذا تحب تضيفها لاشتراكك، تنضاف بـ 15 ألف.'
  },
  {
    q: 'أي مناطق تغطون؟',
    a: 'التوصيل داخل بغداد. أكد منطقتك ويانا على واتساب وقت التثبيت ونرتبلك أنسب وقت.'
  },
  {
    q: 'شلون الدفع؟',
    a: 'الدفع عبر تحويل كي كارد (Qi Card). بعد ما تثبت اشتراكك على واتساب، ندزلك تفاصيل التحويل، وبمجرد التأكيد يبدأ اشتراكك.'
  },
  {
    q: 'المنيو يتكرر؟',
    a: 'لا — القائمة مقسمة على أربعة أسابيع كاملة بدون تكرار، وبعدها تدور من جديد. تكدر تشوف كل أسبوع فوق بقسم القائمة.'
  },
  {
    q: 'شكد سعرات وكارب بكل وجبة؟',
    a: 'كل وجبة مبنية على بروتين عالي وكارب مدروس. تكدر تضغط على أي أكلة داخل القائمة وتشوف تفاصيلها — سعرات، كارب، بروتين، دهون والوزن. القيم تقريبية لحين تأكيدها من المطبخ.'
  }
]

export default function Faq() {
  const [open, setOpen] = useState(-1)

  return (
    <section id="faq" className="bg-paper pb-20 md:pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-extrabold text-grape md:text-5xl">
            أسئلة تخطر ببالك
          </h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {QA.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal
                key={item.q}
                delay={i * 60}
                className="overflow-hidden rounded-[22px] border-2 border-grape/10 bg-white shadow-card"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
                >
                  <span className="font-display text-lg font-extrabold text-grape">
                    {item.q}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={`h-5 w-5 shrink-0 text-grape transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div className={`acc-body ${isOpen ? 'open' : ''}`}>
                  <div>
                    <p className="px-6 pb-5 text-[15px] leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
