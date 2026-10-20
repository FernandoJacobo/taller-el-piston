import { defineConfig } from '@playwright/test';

/**
 * Pruebas de punta a punta sobre el build estático (`npm run build` antes).
 * Usa el Chrome del sistema; en CI sin Chrome: `npx playwright install chromium` y quita `channel`.
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4400',
    channel: 'chrome',
    locale: 'es-MX',
    timezoneId: 'America/Mexico_City',
  },
  webServer: {
    command: 'npx astro preview --port 4400',
    url: 'http://localhost:4400',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
