// خطط الاشتراك — كما وردت من Low Carb
export const PLANS = [
  {
    id: 'weekly-2',
    kick: 'اسبوعي',
    meals: 'وجبتين يومياً',
    price: 100,
    unit: 'ألف دينار / أسبوع',
    featured: false,
    waMsg: 'مرحبا، اريد الاشتراك الاسبوعي — وجبتين يومياً (100 ألف)'
  },
  {
    id: 'monthly-1',
    kick: 'شهري',
    meals: 'وجبة واحدة يومياً',
    price: 175,
    unit: 'ألف دينار / شهر',
    featured: false,
    waMsg: 'مرحبا، اريد الاشتراك الشهري — وجبة يومياً (175 ألف)'
  },
  {
    id: 'monthly-2',
    kick: 'شهري',
    meals: 'وجبتين يومياً',
    price: 325,
    unit: 'ألف دينار / شهر',
    featured: true,
    waMsg: 'مرحبا، اريد الاشتراك الشهري — وجبتين يومياً (325 ألف)'
  },
  {
    id: 'monthly-3',
    kick: 'شهري',
    meals: 'ثلاث وجبات يومياً',
    price: 425,
    unit: 'ألف دينار / شهر',
    featured: false,
    waMsg: 'مرحبا، اريد الاشتراك الشهري — 3 وجبات يومياً (425 ألف)'
  }
]

// أسعار الحاسبة — بالألف دينار: PRICING[المدة][عدد الوجبات يومياً]
export const PRICING = {
  weekly: { 2: 100 },
  monthly: { 1: 175, 2: 325, 3: 425 }
}

export const FRIDAY_ADD = 15

export const FRIDAY_NOTE = {
  base: 'الاشتراكات بدون يوم الجمعة',
  add: 'إضافة الجمعة: 15 ألف على الاشتراك'
}
