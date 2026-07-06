import { Reveal } from './ui.jsx'

const STEPS = [
  {
    n: '١',
    t: 'اختر اشتراكك',
    d: 'أسبوعي أو شهري — وجبة، وجبتين أو ثلاث وجبات يومياً حسب هدفك.'
  },
  {
    n: '٢',
    t: 'ثبّت على واتساب',
    d: 'دزلنا موقعك ووقت التوصيل المناسب، ونأكد اشتراكك مباشرة.'
  },
  {
    n: '٣',
    t: 'استلم يومياً',
    d: 'وجباتك تنطبخ طازة كل يوم وتوصل لباب بيتك على قائمة الأسبوع.'
  }
]

export default function How() {
  return (
    <section className="bg-paper py-20 md:py-24" id="how">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-grape">
            شلون يشتغل الاشتراك؟
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            ثلاث خطوات بس — من اختيار الخطة لين ما توصلك أول وجبة.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 120}
              className="rounded-[32px] border-2 border-grape/10 bg-white p-9 shadow-card"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lemon ring-4 ring-grape/15">
                <span className="font-display text-3xl font-extrabold text-grape">{s.n}</span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold text-grape">{s.t}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
