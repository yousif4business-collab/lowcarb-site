import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import TodayMeals from '../components/TodayMeals.jsx'
import How from '../components/How.jsx'
import Stats from '../components/Stats.jsx'
import { Strip, FinalCta } from '../components/Chrome.jsx'
import { Reveal } from '../components/ui.jsx'
import { WEEKS } from '../data/menu.js'
import { todayRotation } from '../data/rotation.js'
import { PLANS } from '../data/plans.js'
import { usePageMeta } from '../lib/meta.js'
import appQr from '../assets/brand/app-qr.png'

/* teaser cards deep-linking into the inner pages */
function Teasers() {
  const rot = todayRotation()
  const week = WEEKS[rot.weekNo - 1]
  const today = rot.isFriday ? null : week.days[rot.dayIndex]
  const next = todayRotation(new Date(Date.now() + 86400000))
  const tomorrow = next.isFriday ? null : WEEKS[next.weekNo - 1].days[next.dayIndex]
  const featured = PLANS.find((p) => p.featured)

  const card =
    'flex flex-col rounded-[26px] border-2 border-grape/10 bg-white p-6 shadow-card transition hover:-translate-y-1'
  const cta = 'mt-auto pt-4 font-display text-[15px] font-extrabold text-grape'

  return (
    <section className="bg-paper pb-20 md:pb-24">
      <div className="mx-auto grid max-w-6xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal className={card} as={Link} to="/menu">
          <h3 className="font-display text-xl font-extrabold text-grape">القائمة</h3>
          {today && (
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-muted">
              اليوم: {today.dishes.join('، ')}
            </p>
          )}
          {tomorrow && (
            <p className="mt-1 text-[14px] font-medium leading-relaxed text-muted">
              باچر: {tomorrow.dishes.join('، ')}
            </p>
          )}
          <span className={cta}>القائمة كاملة ←</span>
        </Reveal>

        <Reveal delay={80} className={card} as={Link} to="/subscribe">
          <h3 className="font-display text-xl font-extrabold text-grape">الاشتراك</h3>
          <p className="mt-2 text-[14px] font-medium text-muted">{featured.kick} · {featured.meals}</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-grape">
            {featured.price}
            <span className="ms-1 text-sm font-bold text-muted">{featured.unit}</span>
          </p>
          <span className={cta}>كل الخطط والحاسبة ←</span>
        </Reveal>

        <Reveal delay={160} className={card} as={Link} to="/app">
          <h3 className="font-display text-xl font-extrabold text-grape">التطبيق</h3>
          <img src={appQr} alt="رمز QR لتثبيت تطبيق Low Carb" className="mt-3 h-24 w-24 rounded-xl" />
          <p className="mt-2 text-[14px] font-medium text-muted">اطلب من التطبيق — أسرع وأسهل.</p>
          <span className={cta}>حمّل التطبيق ←</span>
        </Reveal>

        <Reveal delay={240} className={card} as={Link} to="/gyms">
          <h3 className="font-display text-xl font-extrabold text-grape">للقاعات الرياضية</h3>
          <p className="mt-2 text-[14px] font-medium leading-relaxed text-muted">
            تجهيز يومي بالجملة — محسوب الأوزان والسعرات وبأسعار خاصة للكميات.
          </p>
          <span className={cta}>تفاصيل العرض ←</span>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  usePageMeta(
    null,
    'اشتراكات أسبوعية وشهرية لوجبات صحية قليلة الكربوهيدرات في بغداد. قائمة أربعة أسابيع بدون تكرار، طبخ يومي وتوصيل مجاني.'
  )

  return (
    <>
      <Hero />
      <Strip />
      <TodayMeals />
      <How />
      <Stats />
      <Teasers />
      <FinalCta />
    </>
  )
}
