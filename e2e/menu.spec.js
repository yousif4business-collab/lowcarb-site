import { test, expect } from '@playwright/test'

// all dish assertions scope to the menu card — TodayMeals above it repeats
// today's dish names and would trip strict mode otherwise
const panel = (page) => page.locator('#week-panel')
const card = (page) => page.locator('#menu')

test.beforeEach(async ({ page }) => {
  await page.goto('/menu')
  // pin week 1 — the preselected tab follows the real-date rotation
  await page.getByRole('tab', { name: 'الأسبوع الأول' }).click()
})

test('week tabs switch the days panel', async ({ page }) => {
  await expect(page.getByRole('tab', { name: 'الأسبوع الأول' })).toHaveAttribute(
    'aria-selected',
    'true'
  )
  await expect(panel(page).getByText('تاجينة لحم')).toBeVisible()

  await page.getByRole('tab', { name: 'الأسبوع الثاني' }).click()
  await expect(page.getByRole('tab', { name: 'الأسبوع الثاني' })).toHaveAttribute(
    'aria-selected',
    'true'
  )
  await expect(panel(page).getByText('ماش بطاطا ودجاج')).toBeVisible()
  await expect(panel(page).getByText('تاجينة لحم')).toHaveCount(0)
})

test('نوع filter dims non-matching dishes', async ({ page }) => {
  await page.getByRole('button', { name: 'دجاج', exact: true }).click()
  // تاجينة لحم is لحم-only → dimmed; بول دجاج stays full strength
  await expect(panel(page).locator('.opacity-30').filter({ hasText: 'تاجينة لحم' })).toHaveCount(1)
  await expect(panel(page).locator('.opacity-30').filter({ hasText: 'بول دجاج' })).toHaveCount(0)
})

test('الأقل كارب badges the lowest-carb dish of every day', async ({ page }) => {
  await page.getByRole('button', { name: 'الأقل كارب' }).click()
  await expect(panel(page).getByText('الأقل كارب', { exact: true })).toHaveCount(6)
})

test('dish row expands to the nutrition panel', async ({ page }) => {
  const dish = panel(page).getByRole('button', { name: /برياني دجاج/ })
  await dish.click()
  await expect(dish).toHaveAttribute('aria-expanded', 'true')
  const macros = panel(page).locator('.acc-body.open')
  await expect(macros.getByText('540', { exact: true })).toBeVisible()
  await expect(macros.getByText('بروتين غم')).toBeVisible()
  await dish.click()
  await expect(dish).toHaveAttribute('aria-expanded', 'false')
})

test('حسب النوع groups every dish with its drop days', async ({ page }) => {
  await page.getByRole('tab', { name: 'حسب النوع' }).click()
  await expect(card(page).getByRole('heading', { name: /^دجاج/ })).toBeVisible()
  await expect(card(page).getByRole('heading', { name: /^لحم/ })).toBeVisible()
  await expect(card(page).getByText('ينزل:').first()).toBeVisible()
})

test('search normalizes Arabic: بريانى + مجدره match', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: 'دوّر على أكلة' })

  // ى → ي: بريانى finds برياني دجاج, dims the rest of the week
  await search.fill('بريانى')
  await expect(panel(page).locator('.opacity-30').filter({ hasText: 'تاجينة لحم' })).toHaveCount(1)
  await expect(panel(page).locator('.opacity-30').filter({ hasText: 'برياني دجاج' })).toHaveCount(0)

  // ه → ة: مجدره finds مجدرة ولحم
  await search.fill('مجدره')
  await expect(panel(page).locator('.opacity-30').filter({ hasText: 'مجدرة ولحم' })).toHaveCount(0)

  // «حسب النوع» filters the groups down to matches only
  await search.fill('بريانى')
  await page.getByRole('tab', { name: 'حسب النوع' }).click()
  await expect(card(page).getByText('برياني دجاج').first()).toBeVisible()
  await expect(card(page).getByText('بول لحم')).toHaveCount(0)
})

test('search misses show the friendly empty state', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: 'دوّر على أكلة' })
  await search.fill('كبسة')
  await expect(card(page).getByText('ما لقينا هاي الأكلة')).toBeVisible()

  await page.getByRole('button', { name: 'امسح البحث' }).click()
  await expect(panel(page).getByText('تاجينة لحم')).toBeVisible()
})

test('اطبع القائمة button is wired on the card', async ({ page }) => {
  // window.print is stubbed — headless print dialogs would hang the run
  await page.evaluate(() => {
    window.__printed = 0
    window.print = () => {
      window.__printed++
    }
  })
  await page.getByRole('button', { name: 'اطبع القائمة' }).click()
  expect(await page.evaluate(() => window.__printed)).toBe(1)
})
