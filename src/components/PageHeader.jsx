import { Arc, TiltMark } from './ui.jsx'

const markWhite = '/brand/lc-mark-white.png'

/* grape crown every inner page opens with — mark + title + sub, arc to paper */
export default function PageHeader({ title, sub }) {
  return (
    <div className="on-grape">
      <div className="bg-grape pb-2 pt-8 text-center text-white">
        <TiltMark>
          <img src={markWhite} alt="Low Carb" width="1177" height="575" className="mx-auto h-16 w-auto md:h-20" />
        </TiltMark>
        <h1 className="mt-4 font-display text-3xl font-extrabold md:text-5xl">{title}</h1>
        {sub && <p className="mx-auto mt-3 max-w-xl px-6 text-base font-medium text-white/80 md:text-lg">{sub}</p>}
        <div className="h-6" />
      </div>
      <Arc fill="#FFFDF4" className="bg-grape -mb-px" />
    </div>
  )
}
