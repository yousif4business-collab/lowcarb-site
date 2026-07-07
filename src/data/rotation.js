// أي أسبوع وأي يوم من دورة الأربع أسابيع نحن اليوم؟
// المرجع: ROTATION_ANCHOR سبت يبدأ "الأسبوع الأول".
import { ROTATION_ANCHOR } from './config.js'

export const DAYS_AR = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']

// JS getDay() → menu day index (Saturday = 0 … Thursday = 5, Friday = -1)
const DAY_INDEX = { 6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: -1 }

export function todayRotation(now = new Date()) {
  const [y, m, d] = ROTATION_ANCHOR.split('-').map(Number)
  const anchor = new Date(y, m - 1, d) // local-midnight Saturday, week 1 day 0
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round((today - anchor) / 86400000)
  const weekNo = ((Math.floor(diffDays / 7) % 4) + 4) % 4 + 1
  const dayIndex = DAY_INDEX[now.getDay()]
  const isFriday = dayIndex === -1
  return {
    weekNo,
    dayIndex,
    isFriday,
    dayName: isFriday ? 'الجمعة' : DAYS_AR[dayIndex]
  }
}
