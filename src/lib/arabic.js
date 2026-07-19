// بحث عربي متسامح — همزات وتاء مربوطة وألف مقصورة وتشكيل كلها تنطبق
// أإآٱ→ا · ة→ه · ى→ي · حذف التشكيل والتطويل، فيصير «بريانى» يلگي «برياني»
const DIACRITICS = /[ً-ْٰ]/g // fathatan…sukun + dagger alif
const TATWEEL = /ـ/g

export function normalizeAr(text) {
  return text
    .replace(DIACRITICS, '')
    .replace(TATWEEL, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase()
    .trim()
}

export const matchesAr = (haystack, query) =>
  normalizeAr(haystack).includes(normalizeAr(query))
