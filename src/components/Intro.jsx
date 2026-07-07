import { useEffect, useState } from 'react'

const markWhite = '/brand/lc-mark-white.png'

/* splash mark — once per session, skippable, skipped under reduced motion */
export default function Intro() {
  const [phase, setPhase] = useState(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off'
    if (sessionStorage.getItem('lc-intro')) return 'off'
    return 'show'
  })

  useEffect(() => {
    if (phase === 'off') return
    sessionStorage.setItem('lc-intro', '1')
    const toFade = setTimeout(() => setPhase('fade'), 1400)
    const toOff = setTimeout(() => setPhase('off'), 1900)
    return () => {
      clearTimeout(toFade)
      clearTimeout(toOff)
    }
  }, [])

  if (phase === 'off') return null

  return (
    <div
      onClick={() => setPhase('off')}
      aria-hidden="true"
      className={`fixed inset-0 z-[100] grid place-items-center bg-grape transition-opacity duration-500 ${
        phase === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img src={markWhite} alt="" className="intro-mark h-32 w-auto md:h-40" />
    </div>
  )
}
