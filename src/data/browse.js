// «حسب النوع» — كل الأكلات الفريدة عبر الأربع أسابيع مجمّعة حسب تاكات NUTRITION
import { WEEKS } from './menu.js'
import { dishInfo } from './nutrition.js'

export const CATEGORIES = ['دجاج', 'لحم', 'رز', 'معكرونة', 'ساندويتش', 'خضار']

const WEEK_NUM = ['١', '٢', '٣', '٤']

/* dish → the days it lands, e.g. «الثلاثاء (أسبوع ١)».
   A dish with several tags appears under every matching category. */
export function browseByType() {
  const drops = new Map()
  for (const w of WEEKS)
    for (const d of w.days)
      for (const dish of d.dishes) {
        if (!drops.has(dish)) drops.set(dish, [])
        drops.get(dish).push(`${d.day} (أسبوع ${WEEK_NUM[w.id - 1]})`)
      }
  return CATEGORIES.map((cat) => ({
    cat,
    dishes: [...drops.entries()]
      .filter(([dish]) => dishInfo(dish)?.tags?.includes(cat))
      .map(([dish, days]) => ({ dish, days }))
  })).filter((g) => g.dishes.length > 0)
}
