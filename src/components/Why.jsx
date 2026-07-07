import { Reveal } from './ui.jsx'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

const ICONS = {
  leaf: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
      <path d="M5 19C6 9 12 4 20 4c0 9-5 15-15 15Z" />
      <path d="M5 19c3-5 7-8 11-10" />
    </svg>
  ),
  pot: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
      <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4Z" />
      <path d="M2 12h20" />
      <path d="M9 8c0-1.2 1-1.6 1-2.8M14 8c0-1.2 1-1.6 1-2.8" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
      <path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3" />
      <path d="M20 4v4h-4M4 20v-4h4" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" {...stroke}>
      <path d="M1 7h13v9H1zM14 10h5l3 3v3h-8" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="18" cy="18" r="1.8" />
    </svg>
  )
}

const CARDS = [
  {
    icon: 'leaf',
    t: 'كارب أقل، طاقة أعلى',
    d: 'وجبات متوازنة تشبعك وتخليك خفيف — بدون خمول ما بعد الأكل.'
  },
  {
    icon: 'pot',
    t: 'مطبوخ اليوم، مو مجمّد',
    d: 'المطبخ يشتغل يومياً — وجبتك تنطبخ وتوصل بنفس اليوم.'
  },
  {
    icon: 'refresh',
    t: 'منيو يتجدد ٤ أسابيع',
    d: 'كل أسبوع أكلات مختلفة — ما راح تحس بالتكرار أبداً.'
  },
  {
    icon: 'truck',
    t: 'توصيل يومي داخل بغداد',
    d: 'لباب البيت أو المكتب، بالوقت اللي يناسبك.'
  }
]

export default function Why() {
  return (
    <section className="bg-paper py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c, i) => (
          <Reveal
            key={c.t}
            delay={i * 90}
            className="rounded-[26px] border-2 border-grape/10 bg-white p-7 shadow-card"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lemon text-grape">
              {ICONS[c.icon]}
            </div>
            <h3 className="mt-5 font-display text-xl font-extrabold text-grape">{c.t}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
