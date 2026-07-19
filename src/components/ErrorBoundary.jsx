import { Component } from 'react'
import markPurple from '../assets/brand/lc-mark-purple.png'

/* branded crash fallback — one wraps the whole app, one wraps each route,
   so a page that throws never blanks the nav/footer shell around it */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div
        role="alert"
        className="grid min-h-screen place-items-center bg-paper px-6 py-16 text-center"
      >
        <div>
          <img src={markPurple} alt="Low Carb" className="mx-auto h-16 w-auto" />
          <h1 className="mt-6 font-display text-3xl font-extrabold text-grape md:text-4xl">
            صار خطأ بسيط
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base font-medium text-muted">
            شي ما مشى صح من طرفنا — جرّب تحدّث الصفحة وإذا تكرر دزلنا على واتساب.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-7 rounded-full bg-grape px-9 py-3.5 font-display text-lg font-extrabold text-lemon shadow-pop transition hover:-translate-y-0.5"
          >
            إعادة تحميل
          </button>
        </div>
      </div>
    )
  }
}
