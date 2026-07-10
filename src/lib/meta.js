import { useEffect } from 'react'

const BASE = 'Low Carb بغداد'

/* per-route <title> + meta description — tiny, no helmet dep */
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : BASE
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }
  }, [title, description])
}
