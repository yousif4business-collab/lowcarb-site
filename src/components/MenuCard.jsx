import { useState } from 'react'
import { Reveal } from './ui.jsx'
import { WEEKS } from '../data/menu.js'
import markWhite from '../assets/brand/lc-mark-white.png'
import bowlWhiteRice from '../assets/food/bowl-white-rice.png'
import bowlAvocado from '../assets/food/bowl-avocado.png'
import bowlRiceMeat from '../assets/food/bowl-rice-meat.png'

export default function MenuCard() {
  const [week, setWeek] = useState(1)
  const active = WEEKS.find((w) => w.id === week)

  return (
    <section id="menu" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold text-grape md:text-5xl">
              قائمة الأربع أسابيع
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              نفس المنيو المطبوع مالتنا — بس تفاعلي. كل أسبوع أكلات مختلفة، بدون تكرار.
            </p>
          </Reveal>
        </div>

        {/* the menu card itself */}
        <Reveal delay={150} className="relative mt-12">
          {/* floating bowls on the card edges */}
          <img
            src={bowlWhiteRice}
            alt=""
            aria-hidden="true"
            className="animate-floaty pointer-events-none absolute -top-10 -right-4 z-10 w-28 md:-right-10 md:w-44"
            style={{ '--rot': '8deg' }}
          />
          <img
            src={bowlAvocado}
            alt=""
            aria-hidden="true"
            className="animate-floaty pointer-events-none absolute -bottom-12 -left-4 z-10 w-28 md:-left-10 md:w-44"
            style={{ '--rot': '-7deg', animationDelay: '1.2s' }}
          />
          <img
            src={bowlRiceMeat}
            alt=""
            aria-hidden="true"
            className="animate-floaty pointer-events-none absolute hidden md:block -bottom-14 right-[18%] z-10 w-36"
            style={{ '--rot': '4deg', animationDelay: '2.2s' }}
          />

          <div className="overflow-hidden rounded-[40px] bg-lemon shadow-pop">
            {/* purple crown like the printed card */}
            <div className="relative bg-grape pb-12 pt-7 text-center md:pb-14">
              <img src={markWhite} alt="" className="mx-auto h-14 md:h-16" />
              <svg
                viewBox="0 0 1440 110"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute bottom-0 left-0 block h-[46px] w-full md:h-[64px]"
              >
                <path d="M0,110 C420,-20 1020,-20 1440,110 Z" fill="#F2EA4F" />
              </svg>
            </div>

            {/* week tabs */}
            <div className="flex flex-wrap justify-center gap-2.5 px-6 pt-2 md:gap-3">
              {WEEKS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setWeek(w.id)}
                  aria-pressed={week === w.id}
                  className={`rounded-full px-5 py-2.5 font-display text-base font-bold transition md:px-6 ${
                    week === w.id
                      ? 'bg-grape text-lemon shadow-card'
                      : 'bg-white/70 text-grape hover:bg-white'
                  }`}
                >
                  {w.title}
                </button>
              ))}
            </div>

            {/* days */}
            <div className="grid gap-x-10 gap-y-7 px-7 pb-16 pt-9 md:grid-cols-2 md:px-14 lg:grid-cols-3">
              {active.days.map((d) => (
                <div key={d.day} className="border-b-2 border-dashed border-grape/15 pb-5 last:border-0 md:last:border-b-2 lg:[&:nth-last-child(-n+3)]:border-0 md:[&:nth-last-child(-n+2)]:border-0">
                  <h3 className="flex items-center gap-2.5 font-display text-2xl font-extrabold text-grape">
                    <span className="inline-block h-3 w-3 rounded-full bg-grape ring-4 ring-white/70" />
                    {d.day}
                  </h3>
                  <ul className="mt-3 space-y-1.5 ps-6">
                    {d.dishes.map((dish) => (
                      <li key={dish} className="font-medium text-lg leading-snug text-ink/80">
                        {dish}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
