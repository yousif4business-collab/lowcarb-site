import { test, expect } from '@playwright/test'

// [path, expected h1] — Home has no PageHeader so we assert its hero h1 exists
const ROUTES = [
  ['/menu', 'قائمة الأربع أسابيع'],
  ['/subscribe', 'الاشتراك والأسعار'],
  ['/app', 'تطبيق Low Carb'],
  ['/gyms', 'للقاعات الرياضية والجيمات'],
  ['/about', 'من نحن'],
  ['/faq', 'أسئلة تخطر ببالك']
]

test('home renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page).toHaveTitle('Low Carb بغداد')
  await expect(page.getByRole('contentinfo')).toContainText('جميع الحقوق محفوظة')
})

for (const [path, h1] of ROUTES) {
  test(`deep-link ${path} renders`, async ({ page }) => {
    // direct load — vite preview must SPA-fallback to index.html
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1, name: h1 })).toBeVisible()
  })
}

test('client-side navigation reaches every page', async ({ page, isMobile }) => {
  await page.goto('/')
  for (const [path, h1] of ROUTES) {
    if (isMobile) {
      await page.getByRole('button', { name: 'افتح القائمة' }).click()
    }
    // desktop link list is display:none on mobile — click the visible copy
    await page
      .getByRole('navigation')
      .getByRole('link', { name: linkLabel(path) })
      .filter({ visible: true })
      .click()
    await expect(page.getByRole('heading', { level: 1, name: h1 })).toBeVisible()
    await expect(page).toHaveURL(path)
  }
})

function linkLabel(path) {
  return {
    '/menu': 'القائمة',
    '/subscribe': 'الاشتراك',
    '/app': 'التطبيق',
    '/gyms': 'للقاعات',
    '/about': 'من نحن',
    '/faq': 'الأسئلة'
  }[path]
}

test('unknown path shows friendly 404 with a way home', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  await expect(page.getByRole('heading', { level: 1, name: 'صفحة غير موجودة' })).toBeVisible()
  await page.getByRole('link', { name: 'ارجع للرئيسية' }).click()
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
