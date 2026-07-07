import Intro from './components/Intro.jsx'
import Hero from './components/Hero.jsx'
import TodayMeals from './components/TodayMeals.jsx'
import How from './components/How.jsx'
import Stats from './components/Stats.jsx'
import Pricing from './components/Pricing.jsx'
import MenuCard from './components/MenuCard.jsx'
import Why from './components/Why.jsx'
import Faq from './components/Faq.jsx'
import { Nav, Strip, FinalCta, Footer, FloatingWa, MobileCta } from './components/Chrome.jsx'

export default function App() {
  return (
    <>
      <Intro />
      <Nav />
      <main>
        <Hero />
        <Strip />
        <TodayMeals />
        <How />
        <Stats />
        <Pricing />
        <MenuCard />
        <Why />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FloatingWa />
      <MobileCta />
    </>
  )
}
