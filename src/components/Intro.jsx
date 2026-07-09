import { useEffect, useState } from 'react'

const markWhite = '/brand/lc-mark-white.png'

/* welcome intro v2 — 3D mark pop, two lines, lemon arc wipe.
   ≤2.5s total, click-skip, once per session, skipped under reduced motion */
export default function Intro() {
  const [phase, setPhase] = useState(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off'
    if (sessionStorage.getItem('lc-intro')) return 'off'
    return 'show'
  })

  useEffect(() => {
    if (phase === 'off') return
    sessionStorage.setItem('lc-intro', '1')
    const toWipe = setTimeout(() => setPhase('wipe'), 1850)
    const toOff = setTimeout(() => setPhase('off'), 2450)
    return () => {
      clearTimeout(toWipe)
      clearTimeout(toOff)
    }
  }, [])

  if (phase === 'off') return null

  return (
    <div
      onClick={() => setPhase('off')}
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden bg-grape"
      style={{ perspective: '900px' }}
    >
      <div className="grid h-full place-items-center">
        <div className="text-center">
          {/* layered copies fan back in Z for a solid 3D extrusion */}
          <div className="intro3d relative mx-auto h-32 w-64 md:h-40 md:w-80">
            {[4, 3, 2, 1].map((z) => (
              <img
                key={z}
                src={markWhite}
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
                style={{
                  transform: `translateZ(${-z * 5}px)`,
                  filter: `brightness(${1 - z * 0.18})`,
                  opacity: 0.9
                }}
              />
            ))}
            <img
              src={markWhite}
              alt=""
              className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.45)]"
            />
          </div>

          <p className="intro-line font-display text-lg font-bold text-white/90 md:text-2xl" style={{ '--d': '0.7s' }}>
            مطبخ سحابي · وجبات لو كارب
          </p>
          <p className="intro-line mt-2 font-display text-base font-bold text-lemon md:text-xl" style={{ '--d': '1.15s' }}>
            طازة يومياً بإشراف شيف تغذية
          </p>
        </div>
      </div>

      {/* lemon arc rises to wipe the screen before unmount */}
      <div className={`intro-wipe ${phase === 'wipe' ? 'go' : ''}`} />
    </div>
  )
}
