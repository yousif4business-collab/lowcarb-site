// صور الأكلات — اسم الأكلة → مسار الصورة. تُملأ لما توصل صور المطبخ؛
// المكوّنات ترجع للتصميم النصّي إذا ما كو صورة للأكلة.
export const DISH_IMAGES = {}

export function dishImage(name) {
  return DISH_IMAGES[name]
}
