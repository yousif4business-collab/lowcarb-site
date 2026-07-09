import { useEffect, useRef } from 'react'
import { Arc, Magnetic, Reveal, WaButton, Words } from './ui.jsx'
import markPurple from '../assets/brand/lc-mark-purple.png'

// LCP element — served from /public so index.html can preload it
const markWhite = '/brand/lc-mark-white.png'
import bowlChicken from '../assets/food/bowl-grilled-chicken.webp'
import bowlOrange from '../assets/food/bowl-orange-rice.webp'
import bowlVeggie from '../assets/food/bowl-veggie.webp'

/* scroll parallax wrapper — motion-safe, passive, rAF-throttled */
function Parallax({ speed, className = '', children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * speed}px)`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])
  return (
    <span ref={ref} className={`pointer-events-none absolute block ${className}`}>
      {children}
    </span>
  )
}

export default function Hero() {
  return (
    <header className="relative overflow-hidden">
      {/* purple crown — exactly like the printed menu header */}
      <div className="bg-grape pt-10 pb-2 text-center">
        <img
          src={markWhite}
          alt="Low Carb"
          width="1177"
          height="575"
          fetchpriority="high"
          className="mx-auto h-24 w-auto md:h-28 drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
        />
      </div>
      <Arc fill="#F2EA4F" className="bg-grape -mb-px" />

      {/* lemon field */}
      <div className="relative bg-lemon pb-24 pt-6 md:pb-32">
        {/* faint brand watermark */}
        <img
          src={markPurple}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[-4%] top-6 hidden w-72 -rotate-12 opacity-[0.05] lg:block"
        />

        {/* floating bowls, from their real menu photos */}
        <Parallax speed={0.08} className="-right-10 top-2 w-36 md:right-[6%] md:top-6 md:w-52 lg:w-60">
          <img
            src={bowlChicken}
            alt=""
            aria-hidden="true"
            className="animate-floaty w-full"
            style={{ '--rot': '-6deg' }}
          />
        </Parallax>
        <Parallax speed={0.12} className="-left-12 bottom-4 w-32 md:left-[7%] md:bottom-10 md:w-44">
          <img
            src={bowlOrange}
            alt=""
            aria-hidden="true"
            className="animate-floaty w-full"
            style={{ '--rot': '7deg', animationDelay: '1.4s' }}
          />
        </Parallax>
        <Parallax speed={0.05} className="hidden lg:block right-[22%] -bottom-14 w-40">
          <img
            src={bowlVeggie}
            alt=""
            aria-hidden="true"
            className="animate-floaty w-full"
            style={{ '--rot': '3deg', animationDelay: '2.6s' }}
          />
        </Parallax>

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="font-fraunces italic font-semibold tracking-[0.35em] text-grape/70 text-sm md:text-base">
              LOW CARB · BAGHDAD
            </p>
          </Reveal>
          <h1 className="mt-4 font-display font-extrabold leading-[1.15] text-grape text-4xl md:text-6xl">
            <span className="block">
              <Words text="أكل صحي لو كارب،" />
            </span>
            <span className="block">
              <Words text="طازة كل يوم لباب بيتك" base={4} />
            </span>
          </h1>
          <Reveal delay={160}>
            <p className="mx-auto mt-5 max-w-xl text-lg md:text-xl font-medium text-ink/70">
              مطبخ سحابي متخصص بالأكل الصحي — اشتراكات أسبوعية وشهرية على قائمة
              أربعة أسابيع ما تتكرر، نطبخ يومياً ونوصّل مجاناً داخل بغداد.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <WaButton msg="مرحبا، اريد استفسر عن اشتراكات Low Carb">
                اطلب على واتساب
              </WaButton>
            </Magnetic>
            <Magnetic>
              <a
                href="#menu"
                className="inline-flex items-center rounded-full border-[2.5px] border-grape px-7 py-3.5 font-display font-bold text-lg text-grape transition hover:bg-grape hover:text-lemon"
              >
                شوف القائمة
              </a>
            </Magnetic>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-6 text-sm font-bold text-grape/80">
              بدون يوم الجمعة · تكدر تضيف الجمعة بـ 15 ألف
            </p>
          </Reveal>
        </div>
      </div>
    </header>
  )
}
