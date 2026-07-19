import { defineConfig } from '@playwright/test'

// 4173/4174 are usually squatted by other local previews and 4199 is
// reserved for Lighthouse runs — 4198 + strictPort surfaces any squatter.
const PORT = 4198

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`
  },
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000
  },
  projects: [
    { name: 'chromium-desktop', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
    {
      name: 'chromium-mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true
      }
    },
    { name: 'webkit-desktop', use: { browserName: 'webkit', viewport: { width: 1280, height: 800 } } },
    {
      name: 'webkit-mobile',
      use: {
        browserName: 'webkit',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true
      }
    }
  ]
})
