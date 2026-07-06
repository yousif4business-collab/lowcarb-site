import { Arc, Reveal, WaButton } from './ui.jsx'
import markWhite from '../assets/brand/lc-mark-white.png'
import bowlChicken from '../assets/food/bowl-grilled-chicken.png'
import bowlOrange from '../assets/food/bowl-orange-rice.png'
import bowlVeggie from '../assets/food/bowl-veggie.png'

export default function Hero() {
  return (
    <header className="relative overflow-hidden">
      {/* purple crown — exactly like the printed menu header */}
      <div className="bg-grape pt-10 pb-2 text-center">
        <img
          src={markWhite}
          alt="Low Carb"
          className="mx-auto h-24 md:h-28 drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
        />
      </div>
      <Arc fill="#F2EA4F" className="bg-grape -mb-px" />

      {/* lemon field */}
      <div className="relative bg-lemon pb-24 pt-6 md:pb-32">
        {/* floating bowls, from their real menu photos */}
        <img
          src={bowlChicken}
          alt=""
          aria-hidden="true"
          className="animate-floaty pointer-events-none absolute -right-10 top-2 w-36 md:right-[6%] md:top-6 md:w-52 lg:w-60"
          style={{ '--rot': '-6deg' }}
        />
        <img
          src={bowlOrange}
          alt=""
          aria-hidden="true"
          className="animate-floaty pointer-events-none absolute -left-12 bottom-4 w-32 md:left-[7%] md:bottom-10 md:w-44"
          style={{ '--rot': '7deg', animationDelay: '1.4s' }}
        />
        <img
          src={bowlVeggie}
          alt=""
          aria-hidden="true"
          className="animate-floaty pointer-events-none absolute hidden lg:block right-[22%] -bottom-14 w-40"
          style={{ '--rot': '3deg', animationDelay: '2.6s' }}
        />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="font-fraunces italic font-semibold tracking-[0.35em] text-grape/70 text-sm md:text-base">
              LOW CARB · BAGHDAD
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 font-display font-extrabold leading-[1.15] text-grape text-4xl md:text-6xl">
              أكل صحي لو كارب،
              <br />
              طازة كل يوم لباب بيتك
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-5 max-w-xl text-lg md:text-xl font-medium text-ink/70">
              اشتراكات أسبوعية وشهرية على قائمة أربعة أسابيع ما تتكرر —
              نطبخ يومياً ونوصّل داخل بغداد.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <WaButton msg="مرحبا، اريد استفسر عن اشتراكات Low Carb">
              اطلب على واتساب
            </WaButton>
            <a
              href="#menu"
              className="inline-flex items-center rounded-full border-[2.5px] border-grape px-7 py-3.5 font-display font-bold text-lg text-grape transition hover:bg-grape hover:text-lemon"
            >
              شوف القائمة
            </a>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-6 text-sm font-bold text-grape/60">
              بدون يوم الجمعة · تكدر تضيف الجمعة بـ 15 ألف
            </p>
          </Reveal>
        </div>
      </div>
    </header>
  )
}
