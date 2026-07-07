import { Reveal, WaButton } from './ui.jsx'
import { WEEKS } from '../data/menu.js'
import { todayRotation } from '../data/rotation.js'
import { NUTRITION_CONFIRMED, dishInfo, dayTotals } from '../data/nutrition.js'
import bowlRiceMeat from '../assets/food/bowl-rice-meat.webp'

/* أكلات اليوم — يقرأ دورة الأربع أسابيع ويعرض أطباق اليوم الفعلية */
export default function TodayMeals() {
  const rot = todayRotation()

  if (rot.isFriday) {
    const next = todayRotation(new Date(Date.now() + 86400000))
    const nextWeek = WEEKS[next.weekNo - 1]
    return (
      <Shell chip="اليوم الجمعة" title="عطلتنا الأسبوعية — نرجع باچر">
        <p className="mt-3 text-lg font-medium text-ink/70">
          السبت نبدي {nextWeek.title} — ثبت اشتراكك من الآن.
        </p>
        <div className="mt-6">
          <WaButton msg="مرحبا، اريد ابدأ اشتراكي من يوم السبت">ثبت ليوم السبت</WaButton>
        </div>
      </Shell>
    )
  }

  const week = WEEKS[rot.weekNo - 1]
  const day = week.days[rot.dayIndex]
  const totals = dayTotals(day.dishes)

  return (
    <Shell chip="أكلات اليوم" title={`${rot.dayName} · ${week.title}`}>
      <p className="mt-3 text-xl font-bold leading-relaxed text-ink/80">
        {day.dishes.join(' · ')}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {day.dishes.map((dish) => {
          const info = dishInfo(dish)
          if (!info) return null
          return (
            <span
              key={dish}
              className="rounded-full bg-paper px-3.5 py-1.5 text-[13px] font-bold text-grape ring-1 ring-grape/15"
            >
              {dish} — {info.kcal} سعرة · {info.carbs} كارب
            </span>
          )
        })}
      </div>
      <p className="mt-3 text-[14px] font-bold text-muted">
        مجموع اليوم تقريباً: ~{totals.kcal} سعرة · {totals.carbs} غم كارب · {totals.protein} غم
        بروتين
      </p>
      {!NUTRITION_CONFIRMED && (
        <p className="mt-1.5 text-[12px] font-medium text-muted/80">
          * القيم الغذائية تقريبية وقد تختلف حسب التحضير
        </p>
      )}
      <div className="mt-6">
        <WaButton
          msg={`مرحبا، اريد اطلب وجبات اليوم (${rot.dayName}): ${day.dishes.join('، ')}`}
        >
          اطلب وجبات اليوم
        </WaButton>
      </div>
    </Shell>
  )
}

function Shell({ chip, title, children }) {
  return (
    <section className="bg-paper pb-4 pt-16 md:pt-20">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="relative overflow-hidden rounded-[32px] bg-white p-8 shadow-pop md:p-10">
          <img
            src={bowlRiceMeat}
            alt=""
            aria-hidden="true"
            width="480"
            height="480"
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute -left-10 -bottom-12 w-36 opacity-90 md:w-44"
          />
          <span className="inline-block rounded-full bg-lemon px-4 py-1.5 font-display text-sm font-extrabold text-grape">
            {chip}
          </span>
          <h2 className="mt-4 font-display text-2xl font-extrabold text-grape md:text-3xl">
            {title}
          </h2>
          {children}
        </Reveal>
      </div>
    </section>
  )
}
