// ─── Low Carb site config ────────────────────────────────────────────
// TODO: replace with the real business WhatsApp number (digits only, country code, no +)
export const WHATSAPP = '9647XXXXXXXXX'

export const wa = (msg) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`

// gym bulk-prep line — separate number not confirmed yet; empty falls back to WHATSAPP
export const WHATSAPP_GYM = ''

export const waGym = (msg) =>
  `https://wa.me/${WHATSAPP_GYM || WHATSAPP}?text=${encodeURIComponent(msg)}`

export const CITY = 'بغداد'

// customer app (PWA)
export const APP_URL = 'https://lowcarb-app.pages.dev'

// TODO: confirm with the kitchen which Saturday starts "الأسبوع الأول"
export const ROTATION_ANCHOR = '2026-07-04'

// footer link renders only when set
export const INSTAGRAM = 'https://www.instagram.com/lowcar.b2'
