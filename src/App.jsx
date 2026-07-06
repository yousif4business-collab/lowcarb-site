import Hero from './components/Hero.jsx'
import How from './components/How.jsx'
import Pricing from './components/Pricing.jsx'
import MenuCard from './components/MenuCard.jsx'
import { Nav, Strip, Rules, FinalCta, Footer } from './components/Chrome.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Strip />
        <How />
        <Pricing />
        <MenuCard />
        <Rules />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
