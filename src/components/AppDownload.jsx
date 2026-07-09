import { Arc, Reveal } from './ui.jsx'
import { APP_URL } from '../data/config.js'
import appQr from '../assets/brand/app-qr.png'

const STEPS = [
  'امسح الكود أو افتح الرابط',
  'مشاركة ← إضافة إلى الشاشة الرئيسية',
  'اطلب اشتراكك بثواني'
]

export default function AppDownload() {
  return (
    <section id="app" className="on-grape">
      <Arc fill="#482465" className="bg-paper -mb-px" />
      <div className="bg-grape pb-8 pt-4 text-white md:pb-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-14">
          <div className="text-center md:text-right">
            <Reveal>
              <p className="font-display text-lg font-bold text-lemon">حمّل تطبيق Low Carb</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-2 font-display text-3xl font-extrabold md:text-5xl">
                اطلب من التطبيق — أسرع وأسهل
              </h2>
            </Reveal>
            <ol className="mt-8 space-y-4 text-right">
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s} delay={140 + i * 90} className="flex items-center gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lemon font-display text-base font-extrabold text-grape">
                    {i + 1}
                  </span>
                  <span className="text-[17px] font-medium text-white/90">{s}</span>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={420} className="mt-9">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-lemon px-9 py-4 font-display text-lg font-extrabold text-grape shadow-pop transition hover:-translate-y-0.5"
              >
                افتح التطبيق
              </a>
            </Reveal>
          </div>

          <Reveal delay={160} className="mx-auto w-full max-w-sm">
            <div className="rounded-[32px] bg-white p-7 text-center shadow-pop">
              <img
                src={appQr}
                alt="رمز QR لتثبيت تطبيق Low Carb"
                className="mx-auto w-full max-w-[300px] rounded-2xl"
              />
              <p className="mt-4 font-display text-xl font-extrabold text-grape">
                امسح وثبّت التطبيق
              </p>
            </div>
          </Reveal>
        </div>
      </div>
      <Arc fill="#482465" flip className="bg-paper -mt-px" />
    </section>
  )
}
