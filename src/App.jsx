import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Intro from './components/Intro.jsx'
import { Nav, Footer, FloatingWa, MobileCta } from './components/Chrome.jsx'

// route-level code splitting — / is the landing page so Home stays eager;
// every other page is its own lazy chunk so / doesn't ship /menu's weight
import Home from './pages/Home.jsx'
const MenuPage = lazy(() => import('./pages/MenuPage.jsx'))
const SubscribePage = lazy(() => import('./pages/SubscribePage.jsx'))
const AppPage = lazy(() => import('./pages/AppPage.jsx'))
const GymsPage = lazy(() => import('./pages/GymsPage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const FaqPage = lazy(() => import('./pages/FaqPage.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function PageSpinner() {
  // full-viewport so the footer stays below the fold while a chunk loads (no CLS)
  return (
    <div className="grid min-h-screen place-items-center" role="status" aria-label="جاري التحميل">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-grape/20 border-t-grape" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Intro />
      <Nav />
      <ScrollToTop />
      <main>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/gyms" element={<GymsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <FloatingWa />
      <MobileCta />
    </>
  )
}
