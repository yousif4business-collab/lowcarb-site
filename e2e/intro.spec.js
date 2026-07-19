import { test, expect } from '@playwright/test'

const INTRO_LINE = 'مطبخ سحابي · وجبات لو كارب'

test('intro plays once per session for real visitors', async ({ page }) => {
  // mask automation so the site treats us like a human first visit
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
  })

  await page.goto('/')
  await expect(page.getByText(INTRO_LINE)).toBeVisible()
  // overlay dismisses itself ≤2.5s after mount
  await expect(page.getByText(INTRO_LINE)).toBeHidden({ timeout: 5000 })

  // same session → sessionStorage lc-intro short-circuits the replay
  await page.reload()
  await expect(page.locator('html.no-intro')).toHaveCount(1)
  await expect(page.getByText(INTRO_LINE)).toBeHidden()
})

test('intro and entrance animations skip for automation (webdriver)', async ({ page }) => {
  await page.goto('/')
  // the #lc-boot inline script stamps both classes before first paint
  await expect(page.locator('html.no-anim.no-intro')).toHaveCount(1)
  await expect(page.getByText(INTRO_LINE)).toBeHidden()
  await expect(page.locator('#lc-boot')).toHaveCount(0)
})
