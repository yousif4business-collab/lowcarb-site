import { Arc, QiBadge, Reveal } from './ui.jsx'
import { PLANS, FRIDAY_NOTE } from '../data/plans.js'
import { wa } from '../data/config.js'
import Calculator from './Calculator.jsx'

export default function Pricing() {
  return (
    <section id="pricing" className="on-grape">
      <Arc fill="#482465" className="bg-paper -mb-px" />
      <div className="bg-grape pb-6 pt-4 text-white md:pb-10">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold text-lemon md:text-5xl">
              اختر اشتراكك
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
              أسعار واضحة بالدينار العراقي — نفس أسعار واتساب، بدون أي زيادة.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p, i) => (
              <Reveal
                key={p.id}
                delay={i * 90}
                className={`relative flex flex-col rounded-[28px] p-7 text-start shadow-pop transition hover:-translate-y-1.5 ${
                  p.featured ? 'bg-lemon text-ink' : 'bg-white text-ink'
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-4 start-6 rounded-full bg-grape px-4 py-1.5 font-display text-sm font-bold text-lemon">
                    الأكثر طلباً
                  </span>
                )}
                <span className="font-display text-sm font-bold tracking-wide text-grape">
                  {p.kick}
                </span>
                <span className="mt-1 text-[15px] font-medium text-muted">{p.meals}</span>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-6xl font-extrabold leading-none text-grape">
                    {p.price}
                  </span>
                </div>
                <span className="mt-1 text-sm font-bold text-muted">{p.unit}</span>
                <a
                  href={wa(p.waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 rounded-2xl bg-grape py-3.5 text-center font-display text-lg font-bold text-lemon transition hover:bg-grapedeep"
                >
                  اشترك
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mx-auto mt-12 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full bg-white/10 px-7 py-3.5 text-[15px] font-bold text-white/85">
              <span>{FRIDAY_NOTE.base}</span>
              <span className="text-lemon">·</span>
              <span className="text-lemon">{FRIDAY_NOTE.add}</span>
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <QiBadge />
              <span className="text-[15px] font-bold text-white/85">
                الدفع عبر تحويل كي كارد — نأكد التفاصيل على واتساب
              </span>
            </div>
          </Reveal>

          <Calculator />
        </div>
      </div>
      <Arc fill="#482465" flip className="bg-paper -mt-px" />
    </section>
  )
}
