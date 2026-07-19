import { test, expect } from '@playwright/test'

// the wa.me CTA is the calculator's real output — decode it and assert the
// order message carries the right plan + total
const decodedWaHref = async (page) => {
  const href = await page.getByRole('link', { name: 'ثبّت هذا الاشتراك' }).getAttribute('href')
  expect(href).toContain('https://wa.me/')
  return decodeURIComponent(href)
}

const total = (page) => page.locator('p.pop')

test.beforeEach(async ({ page }) => {
  await page.goto('/subscribe')
})

test('monthly · 2 meals · Friday = 340', async ({ page }) => {
  // defaults: goal خسارة وزن → شهري، وجبتين (325)
  await expect(total(page)).toHaveText('325')
  await page.getByRole('button', { name: 'مع الجمعة +15' }).click()
  await expect(total(page)).toHaveText('340')

  const msg = await decodedWaHref(page)
  expect(msg).toContain('اشتراك شهري')
  expect(msg).toContain('وجبتين يومياً')
  expect(msg).toContain('مع يوم الجمعة')
  expect(msg).toContain('المجموع 340 ألف دينار')
})

test('weekly locks meals to 2 — 100, with Friday 115', async ({ page }) => {
  await page.getByRole('button', { name: 'أسبوعي' }).click()

  await expect(page.getByRole('button', { name: 'وجبة', exact: true })).toBeDisabled()
  await expect(page.getByRole('button', { name: '٣ وجبات' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'وجبتين', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  )

  await expect(total(page)).toHaveText('100')
  expect(await decodedWaHref(page)).toContain('المجموع 100 ألف دينار')

  await page.getByRole('button', { name: 'مع الجمعة +15' }).click()
  await expect(total(page)).toHaveText('115')
  const msg = await decodedWaHref(page)
  expect(msg).toContain('اشتراك أسبوعي')
  expect(msg).toContain('المجموع 115 ألف دينار')
})

test('goal بناء عضل suggests 3 meals — 425', async ({ page }) => {
  await page.getByRole('button', { name: 'بناء عضل' }).click()

  await expect(page.getByRole('button', { name: '٣ وجبات' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await expect(total(page)).toHaveText('425')

  const msg = await decodedWaHref(page)
  expect(msg).toContain('هدفي: بناء عضل')
  expect(msg).toContain('المجموع 425 ألف دينار')
})

test('Qi Card payment badge shows on /subscribe', async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Qi Card' })).toBeVisible()
  await expect(page.getByText('الدفع عبر تحويل كي كارد').first()).toBeVisible()
})
