// القيم الغذائية لكل أكلة — القيم تقديرية.
// TODO: replace with kitchen-confirmed sheet ثم فعّل NUTRITION_CONFIRMED.
import { WEEKS } from './menu.js'

export const NUTRITION_CONFIRMED = false // flip when kitchen confirms real values

// kcal · protein/carbs/fat غم · grams حجم الحصة · tags للتصنيف
export const NUTRITION = {
  // ── أطباق الرز ──────────────────────────────────────────────────────
  'برياني دجاج':            { kcal: 540, protein: 36, carbs: 46, fat: 16, grams: 420, tags: ['دجاج', 'رز'] },
  'داوود باشا ورز':          { kcal: 530, protein: 36, carbs: 44, fat: 18, grams: 420, tags: ['لحم', 'رز'] },
  'مجدرة ولحم':             { kcal: 510, protein: 33, carbs: 46, fat: 15, grams: 400, tags: ['لحم', 'رز'] },
  'رز باكله وستيك دجاج':     { kcal: 520, protein: 38, carbs: 42, fat: 15, grams: 420, tags: ['دجاج', 'رز'] },
  'رز باكله مع ستيك دجاج':   { kcal: 520, protein: 38, carbs: 42, fat: 15, grams: 420, tags: ['دجاج', 'رز'] },
  'رز بالحمص واللحمة':       { kcal: 550, protein: 36, carbs: 48, fat: 17, grams: 430, tags: ['لحم', 'رز'] },
  'رز عدس مع ستيك':          { kcal: 500, protein: 37, carbs: 43, fat: 14, grams: 410, tags: ['لحم', 'رز'] },
  'ستيك رز بالراشي':         { kcal: 520, protein: 36, carbs: 36, fat: 22, grams: 420, tags: ['لحم', 'رز'] },
  'ستيك دجاج مع سوتيه خضار ورز': { kcal: 500, protein: 40, carbs: 38, fat: 16, grams: 440, tags: ['دجاج', 'رز', 'خضار'] },

  // ── مشاوي وستيك مع خضار ─────────────────────────────────────────────
  'كباب دجاج':              { kcal: 420, protein: 42, carbs: 12, fat: 22, grams: 350, tags: ['دجاج'] },
  'كباب دجاج وبرغل احمر':    { kcal: 470, protein: 40, carbs: 34, fat: 18, grams: 410, tags: ['دجاج'] },
  'ستيك دجاج':              { kcal: 400, protein: 42, carbs: 10, fat: 18, grams: 350, tags: ['دجاج'] },
  'ستيك دجاج مع سوتيه خضار': { kcal: 430, protein: 42, carbs: 14, fat: 20, grams: 400, tags: ['دجاج', 'خضار'] },
  'ستيك دجاج بالراشي':       { kcal: 450, protein: 42, carbs: 12, fat: 26, grams: 380, tags: ['دجاج'] },
  'تاجينة لحم':             { kcal: 440, protein: 40, carbs: 16, fat: 24, grams: 400, tags: ['لحم', 'خضار'] },
  'تاجينة جزر وبزاليا':      { kcal: 400, protein: 38, carbs: 18, fat: 18, grams: 400, tags: ['لحم', 'خضار'] },
  'كرات دجاج بالخضار':       { kcal: 420, protein: 40, carbs: 14, fat: 20, grams: 380, tags: ['دجاج', 'خضار'] },

  // ── دجاج بصوص / كريمي ───────────────────────────────────────────────
  'دجاج بالكريمة والخضار':   { kcal: 470, protein: 38, carbs: 14, fat: 28, grams: 400, tags: ['دجاج', 'خضار'] },
  'دجاج بالكريمة':           { kcal: 460, protein: 38, carbs: 12, fat: 28, grams: 380, tags: ['دجاج'] },
  'دجاج بالفطر مع برغل':     { kcal: 490, protein: 38, carbs: 34, fat: 20, grams: 420, tags: ['دجاج'] },
  'دجاج بالراشي':            { kcal: 480, protein: 38, carbs: 12, fat: 30, grams: 380, tags: ['دجاج'] },
  'كاري دجاج':              { kcal: 450, protein: 36, carbs: 16, fat: 24, grams: 400, tags: ['دجاج'] },
  'دجاج بالسبانغ':           { kcal: 440, protein: 38, carbs: 12, fat: 24, grams: 400, tags: ['دجاج', 'خضار'] },
  'دجاج بالجبن مع رز':       { kcal: 530, protein: 40, carbs: 36, fat: 22, grams: 430, tags: ['دجاج', 'رز'] },
  'كرات لحم بالراشي':        { kcal: 490, protein: 38, carbs: 14, fat: 30, grams: 380, tags: ['لحم'] },
  'برغل مع دجاج':            { kcal: 470, protein: 36, carbs: 36, fat: 16, grams: 410, tags: ['دجاج'] },
  'داوود باشا لحم':          { kcal: 460, protein: 38, carbs: 16, fat: 26, grams: 390, tags: ['لحم'] },
  'بتر جكن':                { kcal: 510, protein: 38, carbs: 28, fat: 26, grams: 400, tags: ['دجاج'] },

  // ── معكرونة ─────────────────────────────────────────────────────────
  'معكرونة باللحم':          { kcal: 540, protein: 34, carbs: 46, fat: 20, grams: 420, tags: ['لحم', 'معكرونة'] },
  'فوتوشيني ستيك دجاج':      { kcal: 550, protein: 36, carbs: 44, fat: 22, grams: 430, tags: ['دجاج', 'معكرونة'] },
  'فوتوشيني وستيك دجاج':     { kcal: 550, protein: 36, carbs: 44, fat: 22, grams: 430, tags: ['دجاج', 'معكرونة'] },
  'معكرونة بالراشي ودجاج':   { kcal: 560, protein: 34, carbs: 46, fat: 24, grams: 430, tags: ['دجاج', 'معكرونة'] },
  'معكرونة دجاج':            { kcal: 520, protein: 34, carbs: 44, fat: 18, grams: 410, tags: ['دجاج', 'معكرونة'] },
  'سباكتي باللحم والراشي':   { kcal: 560, protein: 34, carbs: 46, fat: 24, grams: 430, tags: ['لحم', 'معكرونة'] },

  // ── بولات ───────────────────────────────────────────────────────────
  'بول دجاج':               { kcal: 470, protein: 40, carbs: 34, fat: 16, grams: 400, tags: ['دجاج', 'رز'] },
  'بول لحم':                { kcal: 490, protein: 42, carbs: 34, fat: 18, grams: 400, tags: ['لحم', 'رز'] },

  // ── ساندويتشات وبطاطا ───────────────────────────────────────────────
  'سندويش دجاج':             { kcal: 440, protein: 34, carbs: 32, fat: 16, grams: 330, tags: ['دجاج', 'ساندويتش'] },
  'سندويش مسخن':             { kcal: 470, protein: 34, carbs: 34, fat: 20, grams: 340, tags: ['دجاج', 'ساندويتش'] },
  'بركر لحم':               { kcal: 490, protein: 36, carbs: 32, fat: 24, grams: 350, tags: ['لحم', 'ساندويتش'] },
  'ماش بطاطا ودجاج':         { kcal: 470, protein: 38, carbs: 34, fat: 18, grams: 420, tags: ['دجاج', 'خضار'] },
  'ماش بطاطا مع كوردون دجاج': { kcal: 500, protein: 38, carbs: 36, fat: 24, grams: 430, tags: ['دجاج', 'خضار'] }
}

export function dishInfo(name) {
  return NUTRITION[name]
}

export function dayTotals(dishes) {
  return dishes.reduce(
    (acc, name) => {
      const n = NUTRITION[name]
      if (!n) return acc
      acc.kcal += n.kcal
      acc.carbs += n.carbs
      acc.protein += n.protein
      return acc
    },
    { kcal: 0, carbs: 0, protein: 0 }
  )
}

// dev-only: كل أكلة بالمنيو لازم إلها قيم
if (import.meta.env?.DEV) {
  WEEKS.flatMap((w) => w.days.flatMap((d) => d.dishes)).forEach((dish) => {
    if (!NUTRITION[dish]) console.warn(`[nutrition] لا توجد قيم للأكلة: ${dish}`)
  })
}
