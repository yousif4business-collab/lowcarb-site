import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Reveal, ShareIcon, shareWeek } from './ui.jsx'
import { WEEKS } from '../data/menu.js'
import { todayRotation } from '../data/rotation.js'
import { NUTRITION_CONFIRMED, dishInfo, dayTotals } from '../data/nutrition.js'
import { browseByType } from '../data/browse.js'
import { dishImage } from '../data/dishImages.js'
import { matchesAr } from '../lib/arabic.js'
import markPurple from '../assets/brand/lc-mark-purple.png'

const markWhite = '/brand/lc-mark-white.png'
import bowlWhiteRice from '../assets/food/bowl-white-rice.webp'
import bowlAvocado from '../assets/food/bowl-avocado.webp'
import bowlRiceMeat from '../assets/food/bowl-rice-meat.webp'

const FILTERS = [
  { v: 'all', label: 'الكل' },
  { v: 'دجاج', label: 'دجاج' },
  { v: 'لحم', label: 'لحم' },
  { v: 'معكرونة', label: 'معكرونة' },
  { v: 'low', label: 'الأقل كارب' }
]

const VIEWS = [
  ['week', 'حسب الأسبوع'],
  ['type', 'حسب النوع']
]

const GROUPS = browseByType()

/* week summary — dish count + average kcal/day, from the nutrition sheet */
function weekSummary(week) {
  const dishes = week.days.reduce((n, d) => n + d.dishes.length, 0)
  const kcal = week.days.map((d) => dayTotals(d.dishes).kcal)
  const avg = Math.round(kcal.reduce((a, b) => a + b, 0) / kcal.length / 10) * 10
  return `${week.days.length} أيام · ${dishes} أكلة · معدل ~${avg} سعرة باليوم`
}

export default function MenuCard({ noHeader = false }) {
  const currentWeek = todayRotation().weekNo
  const [view, setView] = useState('week')
  const [week, setWeek] = useState(currentWeek)
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')
  const active = WEEKS.find((w) => w.id === week)

  const query = q.trim()
  // search: week view dims non-matches per dish; النوع view filters the lists
  const weekHasMatch =
    !query || active.days.some((d) => d.dishes.some((dish) => matchesAr(dish, query)))
  const groups = query
    ? GROUPS.map((g) => ({
        ...g,
        dishes: g.dishes.filter(({ dish }) => matchesAr(dish, query))
      })).filter((g) => g.dishes.length > 0)
    : GROUPS

  // «اطبع القائمة» prints the current week — force week view before the dialog
  const printWeek = () => {
    flushSync(() => setView('week'))
    window.print()
  }

  return (
    <section id="menu" className={`bg-paper ${noHeader ? 'py-10 md:py-14' : 'py-20 md:py-28'}`}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center">
          {!noHeader && (
            <>
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
            </>
          )}
          <Reveal delay={140} className="no-print flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => shareWeek(active)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-grape/20 px-5 py-2.5 font-display text-[15px] font-bold text-grape transition hover:border-grape hover:bg-grape hover:text-lemon"
            >
              <ShareIcon />
              شارك منيو الأسبوع
            </button>
            <button
              type="button"
              onClick={printWeek}
              className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-grape/20 px-5 py-2.5 font-display text-[15px] font-bold text-grape transition hover:border-grape hover:bg-grape hover:text-lemon"
            >
              <PrintIcon />
              اطبع القائمة
            </button>
          </Reveal>
        </div>

        {/* the menu card itself */}
        <Reveal delay={150} className="relative mt-12">
          {/* floating bowls on the card edges */}
          <img
            src={bowlWhiteRice}
            alt=""
            aria-hidden="true"
            width="480"
            height="480"
            loading="lazy"
            decoding="async"
            className="animate-floaty pointer-events-none absolute -top-10 -right-4 z-10 w-28 md:-right-10 md:w-44"
            style={{ '--rot': '8deg' }}
          />
          <img
            src={bowlAvocado}
            alt=""
            aria-hidden="true"
            width="480"
            height="480"
            loading="lazy"
            decoding="async"
            className="animate-floaty pointer-events-none absolute -bottom-12 -left-4 z-10 w-28 md:-left-10 md:w-44"
            style={{ '--rot': '-7deg', animationDelay: '1.2s' }}
          />
          <img
            src={bowlRiceMeat}
            alt=""
            aria-hidden="true"
            width="480"
            height="480"
            loading="lazy"
            decoding="async"
            className="animate-floaty pointer-events-none absolute hidden md:block -bottom-14 right-[18%] z-10 w-36"
            style={{ '--rot': '4deg', animationDelay: '2.2s' }}
          />

          <div className="relative overflow-hidden rounded-[40px] bg-lemon shadow-pop">
            {/* print-only letterhead: mark + week title (screen never sees it) */}
            <div className="print-only pb-2 pt-4 text-center">
              <img src={markPurple} alt="Low Carb" className="print-keep mx-auto h-14 w-auto" />
              <p className="mt-2 font-display text-2xl font-extrabold text-grape">
                قائمة {active.title} — Low Carb
              </p>
            </div>

            {/* purple crown like the printed card */}
            <div className="no-print relative bg-grape pb-12 pt-7 text-center md:pb-14">
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

            {/* faint brand watermark inside the lemon card */}
            <img
              src={markPurple}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-8 bottom-2 w-64 -rotate-12 opacity-[0.05]"
            />

            {/* view toggle */}
            <div className="no-print flex justify-center px-6 pt-3">
              <div
                role="tablist"
                aria-label="طريقة العرض"
                className="grid grid-cols-2 gap-1 rounded-full bg-white/60 p-1"
              >
                {VIEWS.map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    role="tab"
                    aria-selected={view === v}
                    onClick={() => setView(v)}
                    className={`rounded-full px-6 py-2 font-display text-[14px] font-bold transition ${
                      view === v ? 'bg-grape text-lemon shadow-card' : 'text-grape hover:bg-white/70'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* dish search — normalized Arabic matching across both views */}
            <div className="no-print flex justify-center px-6 pt-3">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="دوّر على أكلة… مثلاً برياني"
                aria-label="دوّر على أكلة"
                className="w-full max-w-sm rounded-full border-2 border-grape/15 bg-white/70 px-5 py-2.5 text-center text-[15px] font-medium text-ink placeholder:text-muted/60 focus:border-grape focus:bg-white focus:outline-none"
              />
            </div>

            {view === 'week' && (
              <>
                {/* nutrition filters */}
                <div className="no-print flex flex-wrap justify-center gap-2 px-6 pt-3">
                  {FILTERS.map((f) => (
                    <button
                      key={f.v}
                      type="button"
                      onClick={() => setFilter(f.v)}
                      aria-pressed={filter === f.v}
                      className={`rounded-full px-4 py-1.5 font-display text-[13px] font-bold transition motion-reduce:transition-none ${
                        filter === f.v
                          ? 'bg-grapedeep text-lemon'
                          : 'bg-white/50 text-grape/80 hover:bg-white/80'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* week tabs */}
                <div
                  role="tablist"
                  aria-label="أسابيع القائمة"
                  className="no-print flex flex-wrap justify-center gap-2.5 px-6 pt-2 md:gap-3"
                >
                  {WEEKS.map((w) => (
                    <button
                      key={w.id}
                      role="tab"
                      id={`week-tab-${w.id}`}
                      aria-selected={week === w.id}
                      aria-controls="week-panel"
                      onClick={() => setWeek(w.id)}
                      className={`relative rounded-full px-5 py-2.5 font-display text-base font-bold transition md:px-6 ${
                        week === w.id
                          ? 'bg-grape text-lemon shadow-card'
                          : 'bg-white/70 text-grape hover:bg-white'
                      }`}
                    >
                      {w.title}
                      {w.id === currentWeek && (
                        <span
                          aria-hidden="true"
                          title="الأسبوع الحالي"
                          className={`absolute -top-1 start-2 h-2.5 w-2.5 rounded-full ring-2 ${
                            week === w.id ? 'bg-lemon ring-grape' : 'bg-grape ring-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            {view === 'week' && (
              <p className="px-6 pt-4 text-center font-display text-[14px] font-bold text-grape">
                {weekSummary(active)}
              </p>
            )}

            {!NUTRITION_CONFIRMED && (
              <p className="px-6 pt-2 text-center text-[13px] font-bold text-grape/80">
                * القيم الغذائية تقريبية وقد تختلف حسب التحضير
              </p>
            )}

            {view === 'week' && !weekHasMatch ? (
              <SearchEmpty onClear={() => setQ('')} />
            ) : view === 'week' ? (
              /* days */
              <div
                key={week}
                role="tabpanel"
                id="week-panel"
                aria-labelledby={`week-tab-${week}`}
                className="week-anim grid gap-5 px-6 pb-16 pt-6 md:grid-cols-2 md:px-12 lg:grid-cols-3"
              >
                {active.days.map((d) => (
                  <DayCard key={d.day} d={d} filter={filter} query={query} />
                ))}
              </div>
            ) : groups.length === 0 ? (
              <SearchEmpty onClear={() => setQ('')} />
            ) : (
              /* categories — all unique dishes across the 4 weeks */
              <div className="week-anim grid gap-5 px-6 pb-16 pt-6 md:grid-cols-2 md:px-12 lg:grid-cols-3">
                {groups.map((g) => (
                  <TypeCard key={g.cat} g={g} />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* search found nothing in the current view */
function SearchEmpty({ onClear }) {
  return (
    <div className="px-6 pb-16 pt-10 text-center">
      <p className="font-display text-2xl font-extrabold text-grape">ما لقينا هاي الأكلة</p>
      <p className="mt-2 text-[15px] font-medium text-muted">
        جرب اسم ثاني — أو امسح البحث وشوف القائمة كاملة.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-full bg-grape px-6 py-2.5 font-display text-[15px] font-bold text-lemon transition hover:-translate-y-0.5"
      >
        امسح البحث
      </button>
    </div>
  )
}

function PrintIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  )
}

/* one day: dish rows expand to a macro panel — single-open per card */
function DayCard({ d, filter = 'all', query = '' }) {
  const [open, setOpen] = useState(-1)
  const totals = dayTotals(d.dishes)

  // 'الأقل كارب' badges the day's lowest-carb dish instead of dimming
  const lowestCarb =
    filter === 'low'
      ? d.dishes.reduce((min, dish) => {
          const c = dishInfo(dish)?.carbs
          if (c === undefined) return min
          return min === null || c < dishInfo(min).carbs ? dish : min
        }, null)
      : null

  const dimmed = (dish) => {
    if (query && !matchesAr(dish, query)) return true
    if (filter === 'all' || filter === 'low') return false
    return !(dishInfo(dish)?.tags ?? []).includes(filter)
  }

  return (
    <div className="rounded-2xl bg-white/60 p-5">
      <h3 className="flex items-center gap-2.5 font-display text-2xl font-extrabold text-grape">
        <span className="inline-block h-3 w-3 rounded-full bg-grape ring-4 ring-white/70" />
        {d.day}
      </h3>

      <div className="mt-3 space-y-1">
        {d.dishes.map((dish, i) => {
          const info = dishInfo(dish)
          const isOpen = open === i
          if (!info) {
            return (
              <p key={dish} className="py-1.5 font-medium text-lg leading-snug text-ink/80">
                {dish}
              </p>
            )
          }
          return (
            <div
              key={dish}
              className={`transition-opacity duration-300 motion-reduce:transition-none ${
                dimmed(dish) ? 'opacity-30' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 rounded-xl px-1 py-1.5 text-start transition hover:bg-white/70"
              >
                {dishImage(dish) && (
                  <img
                    src={dishImage(dish)}
                    alt=""
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-xl object-cover"
                  />
                )}
                <span className="flex-1 font-medium text-lg leading-snug text-ink/80">
                  {dish}
                  {dish === lowestCarb && (
                    <span className="ms-2 inline-block rounded-full bg-lemon px-2 py-0.5 align-middle text-[11px] font-extrabold text-grape">
                      الأقل كارب
                    </span>
                  )}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={`h-4 w-4 shrink-0 text-grape/60 transition-transform duration-300 ${
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
                  <div className="grid grid-cols-5 gap-1.5 px-1 pt-1.5">
                    {[
                      [info.kcal, 'سعرات'],
                      [info.protein, 'بروتين غم'],
                      [info.carbs, 'كارب غم'],
                      [info.fat, 'دهون غم'],
                      [info.grams, 'الوزن غم']
                    ].map(([v, label]) => (
                      <div key={label} className="rounded-xl bg-white p-2 text-center">
                        <p className="font-display text-base font-extrabold leading-none text-grape">
                          {v}
                        </p>
                        <p className="mt-1 text-[10px] font-bold leading-tight text-muted">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-1 pb-2 pt-2">
                    {info.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-lemon/70 px-2.5 py-0.5 text-[11px] font-bold text-grape"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 border-t border-dashed border-grape/15 pt-3 text-[13px] font-bold text-muted">
        مجموع اليوم تقريباً: ~{totals.kcal} سعرة · {totals.carbs} غم كارب · {totals.protein} غم
        بروتين
      </p>
    </div>
  )
}

/* one category («حسب النوع»): dish rows with macro chips + ينزل، expandable */
function TypeCard({ g }) {
  const [open, setOpen] = useState(-1)

  return (
    <div className="rounded-2xl bg-white/60 p-5">
      <h3 className="flex items-center gap-2.5 font-display text-2xl font-extrabold text-grape">
        <span className="inline-block h-3 w-3 rounded-full bg-grape ring-4 ring-white/70" />
        {g.cat}
        <span className="text-[13px] font-bold text-muted">{g.dishes.length} أكلة</span>
      </h3>

      <div className="mt-3 space-y-1">
        {g.dishes.map(({ dish, days }, i) => {
          const info = dishInfo(dish)
          const isOpen = open === i
          return (
            <div key={dish}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-3 rounded-xl px-1 py-2 text-start transition hover:bg-white/70"
              >
                {dishImage(dish) && (
                  <img
                    src={dishImage(dish)}
                    alt=""
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-lg leading-snug text-ink/80">
                    {dish}
                  </span>
                  {info && (
                    <span className="mt-1.5 flex flex-wrap gap-1.5">
                      {[
                        `${info.kcal} سعرة`,
                        `${info.protein}غم بروتين`,
                        `${info.carbs}غم كارب`
                      ].map((c) => (
                        <span
                          key={c}
                          className="rounded-full bg-lemon/70 px-2 py-0.5 text-[11px] font-bold text-grape"
                        >
                          {c}
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="mt-1.5 block text-[12px] font-bold leading-relaxed text-muted">
                    ينزل: {days.join('، ')}
                  </span>
                </span>
                {info && (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={`mt-2 h-4 w-4 shrink-0 text-grape/60 transition-transform duration-300 ${
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
                )}
              </button>
              {info && (
                <div className={`acc-body ${isOpen ? 'open' : ''}`}>
                  <div>
                    <div className="grid grid-cols-5 gap-1.5 px-1 pb-2 pt-1.5">
                      {[
                        [info.kcal, 'سعرات'],
                        [info.protein, 'بروتين غم'],
                        [info.carbs, 'كارب غم'],
                        [info.fat, 'دهون غم'],
                        [info.grams, 'الوزن غم']
                      ].map(([v, label]) => (
                        <div key={label} className="rounded-xl bg-white p-2 text-center">
                          <p className="font-display text-base font-extrabold leading-none text-grape">
                            {v}
                          </p>
                          <p className="mt-1 text-[10px] font-bold leading-tight text-muted">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
