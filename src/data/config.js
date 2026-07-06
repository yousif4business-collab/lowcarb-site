// ─── Low Carb site config ────────────────────────────────────────────
// TODO: replace with the real business WhatsApp number (digits only, country code, no +)
export const WHATSAPP = '9647XXXXXXXXX'

export const wa = (msg) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`

export const CITY = 'بغداد'
