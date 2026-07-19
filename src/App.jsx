import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Intro from './components/Intro.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
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

/* branded skeleton while a route chunk loads — grape crown + shimmer lines
   mirror PageHeader's shape. Full-viewport so the footer stays below the
   fold on direct loads (no CLS). */
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-paper" role="status" aria-label="جاري التحميل">
      <div className="bg-grape px-6 pb-16 pt-10 text-center">
        <div className="shimmer-dark mx-auto h-16 w-32 rounded-2xl" />
        <div className="shimmer-dark mx-auto mt-5 h-8 w-64 max-w-full rounded-full" />
        <div className="shimmer-dark mx-auto mt-4 h-4 w-80 max-w-full rounded-full" />
      </div>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="shimmer h-6 w-28 rounded-full" />
              <div className="shimmer mt-4 h-4 w-full rounded-full" />
              <div className="shimmer mt-2.5 h-4 w-4/5 rounded-full" />
              <div className="shimmer mt-2.5 h-4 w-2/3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// each route gets its own boundary so a page crash keeps nav + footer alive
const guard = (page) => <ErrorBoundary>{page}</ErrorBoundary>

export default function App() {
  return (
    <>
      <Intro />
      <Nav />
      <ScrollToTop />
      <main>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={guard(<Home />)} />
            <Route path="/menu" element={guard(<MenuPage />)} />
            <Route path="/subscribe" element={guard(<SubscribePage />)} />
            <Route path="/app" element={guard(<AppPage />)} />
            <Route path="/gyms" element={guard(<GymsPage />)} />
            <Route path="/about" element={guard(<AboutPage />)} />
            <Route path="/faq" element={guard(<FaqPage />)} />
            <Route path="*" element={guard(<NotFound />)} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <FloatingWa />
      <MobileCta />
    </>
  )
}
