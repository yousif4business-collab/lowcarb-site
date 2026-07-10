import { Reveal } from './ui.jsx'

/* contextual closing band — lemon, title + sub + whatever CTA children fit */
export default function CtaBand({ title, sub, children }) {
  return (
    <section className="bg-lemon py-16 text-center md:py-20">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold text-grape md:text-4xl">{title}</h2>
        </Reveal>
        {sub && (
          <Reveal delay={90}>
            <p className="mt-4 text-lg font-medium text-ink/70">{sub}</p>
          </Reveal>
        )}
        <Reveal delay={170} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {children}
        </Reveal>
      </div>
    </section>
  )
}
