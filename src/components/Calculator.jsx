import { useState } from 'react'
import { QiBadge, Reveal, WaButton } from './ui.jsx'
import { PRICING, FRIDAY_ADD } from '../data/plans.js'

const MEAL_LABELS = { 1: 'وجبة واحدة', 2: 'وجبتين', 3: '٣ وجبات' }

// كل هدف يقترح عدد وجبات — المستخدم يعدّل مثل ما يحب
const GOALS = [
  { v: 'loss', label: 'خسارة وزن', meals: 2 },
  { v: 'stable', label: 'ثبات', meals: 1 },
  { v: 'muscle', label: 'بناء عضل', meals: 3 }
]

const TIMES = ['صباحاً', 'ظهراً', 'مساءً', 'أي وقت']

/* ركّب اشتراكك — segmented pills feeding one live total */
export default function Calculator() {
  const [goal, setGoal] = useState('loss')
  const [duration, setDuration] = useState('monthly')
  const [meals, setMeals] = useState(2)
  const [friday, setFriday] = useState(false)
  const [zone, setZone] = useState('')
  const [time, setTime] = useState('أي وقت')

  const isWeekly = duration === 'weekly'
  const effMeals = isWeekly ? 2 : meals
  const total = PRICING[duration][effMeals] + (friday ? FRIDAY_ADD : 0)
  const unit = isWeekly ? 'ألف / أسبوع' : 'ألف / شهر'

  const goalLabel = GOALS.find((g) => g.v === goal).label
  const waMsg =
    `مرحبا، اريد اشتراك ${isWeekly ? 'أسبوعي' : 'شهري'} — ${
      MEAL_LABELS[effMeals]
    } يومياً، ${friday ? 'مع يوم الجمعة' : 'بدون الجمعة'} — المجموع ${total} ألف دينار، هدفي: ${goalLabel}` +
    (zone.trim() ? `، منطقتي: ${zone.trim()}` : '') +
    (time !== 'أي وقت' ? `، وقت التوصيل: ${time}` : '')

  return (
    <Reveal className="mx-auto mt-12 max-w-2xl rounded-[32px] bg-white p-8 text-start shadow-pop md:p-10">
      <h3 className="text-center font-display text-2xl font-extrabold text-grape md:text-3xl">
        أو ركّب اشتراكك على كيفك
      </h3>

      <div className="mt-8 space-y-6">
        <Row label="هدفك" note="اقتراح حسب هدفك — عدّل مثل ما تحب">
          <Seg
            options={GOALS.map((g) => ({ v: g.v, label: g.label }))}
            value={goal}
            onChange={(v) => {
              setGoal(v)
              setMeals(GOALS.find((g) => g.v === v).meals)
            }}
          />
        </Row>

        <Row label="المدة">
          <Seg
            options={[
              { v: 'monthly', label: 'شهري' },
              { v: 'weekly', label: 'أسبوعي' }
            ]}
            value={duration}
            onChange={(v) => {
              setDuration(v)
              if (v === 'weekly') setMeals(2)
            }}
          />
        </Row>

        <Row
          label="الوجبات يومياً"
          note={isWeekly ? 'الاشتراك الأسبوعي متوفر بوجبتين يومياً' : null}
        >
          <Seg
            options={[
              { v: 1, label: 'وجبة', disabled: isWeekly },
              { v: 2, label: 'وجبتين' },
              { v: 3, label: '٣ وجبات', disabled: isWeekly }
            ]}
            value={effMeals}
            onChange={setMeals}
          />
        </Row>

        <Row label="يوم الجمعة">
          <Seg
            options={[
              { v: false, label: 'بدون الجمعة' },
              { v: true, label: 'مع الجمعة +15' }
            ]}
            value={friday}
            onChange={setFriday}
          />
        </Row>

        <Row label="منطقتك بالبغداد (اختياري)">
          <input
            type="text"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            placeholder="مثلاً: المنصور، زيونة…"
            className="w-full max-w-sm rounded-full border-2 border-grape/10 bg-paper px-5 py-2.5 text-[15px] font-medium text-ink placeholder:text-muted/60 focus:border-grape focus:outline-none"
          />
        </Row>

        <Row label="وقت التوصيل المفضل">
          <Seg
            options={TIMES.map((t) => ({ v: t, label: t }))}
            value={time}
            onChange={setTime}
          />
        </Row>
      </div>

      <div className="mt-9 text-center">
        <p key={total} className="pop font-display text-7xl font-extrabold leading-none text-grape">
          {total}
        </p>
        <p className="mt-1 text-base font-bold text-muted">{unit}</p>
        <div className="mt-6">
          <WaButton msg={waMsg}>ثبّت هذا الاشتراك</WaButton>
        </div>
        <p className="mt-4 text-sm font-medium text-muted">
          تنرسل تفاصيل اختيارك جاهزة على واتساب — والدفع عبر كي كارد
        </p>
        <div className="mt-2.5 flex justify-center">
          <QiBadge sm />
        </div>
      </div>
    </Reveal>
  )
}

function Row({ label, note, children }) {
  return (
    <div>
      <p className="mb-2.5 font-display text-base font-bold text-ink">{label}</p>
      {children}
      {note && <p className="mt-2 text-[13px] font-bold text-muted">{note}</p>}
    </div>
  )
}

function Seg({ options, value, onChange }) {
  return (
    <div className="inline-flex flex-wrap gap-1.5 rounded-full bg-paper p-1.5 ring-2 ring-grape/10">
      {options.map((o) => (
        <button
          key={String(o.v)}
          type="button"
          disabled={o.disabled}
          onClick={() => onChange(o.v)}
          aria-pressed={value === o.v}
          className={`rounded-full px-4 py-2 font-display text-[15px] font-bold transition md:px-5 ${
            value === o.v
              ? 'bg-grape text-lemon shadow-card'
              : o.disabled
                ? 'cursor-not-allowed text-muted/50'
                : 'text-grape hover:bg-lemon/50'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
