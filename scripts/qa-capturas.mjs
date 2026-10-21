/**
 * QA visual: capturas de página completa a varios anchos con Playwright.
 * Uso: npm run qa -- [url-base] [rutas separadas por coma] [anchos separados por coma]
 *   npm run qa                          → http://localhost:4321, "/", 390,768,1440
 *   npm run qa -- http://localhost:4321 /,/servicios 360,1536
 * Usa el Chrome instalado en el sistema (channel: 'chrome'); si no existe, el Chromium de Playwright.
 * QA_TRAMOS=1 guarda también la página en tramos.
 * Las capturas quedan en qa/capturas/ (fuera de git) y se reporta cualquier scroll horizontal.
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const [base = 'http://localhost:4321', rutasArg = '/', anchosArg = '390,768,1440'] = process.argv.slice(2);
const rutas = rutasArg.split(',');
const anchos = anchosArg.split(',').map(Number);
const salida = path.resolve('qa/capturas');
fs.mkdirSync(salida, { recursive: true });

// Nota: en capturas de página completa Chrome deja en blanco los iframes de otro origen (el mapa de
// OpenStreetMap). En el navegador real sí se ven; para revisarlo usa una captura del elemento.
const browser = await chromium
  .launch({ channel: 'chrome', args: ['--headless=new'], ignoreDefaultArgs: ['--headless'] })
  .catch(() => chromium.launch());
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';
let problemas = 0;

for (const ruta of rutas) {
  for (const ancho of anchos) {
    // UA de navegador normal: algunos servicios externos rechazan "HeadlessChrome"
    const page = await browser.newPage({ viewport: { width: ancho, height: 900 }, deviceScaleFactor: 1, userAgent: UA });
    await page.goto(base + ruta, { waitUntil: 'networkidle' });
    // Fuerza lo que aparece al hacer scroll (sellos, odómetro) para que la captura sea fiel
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 140));
      }
      window.scrollTo(0, 0);
    });
    // Los mapas son iframes lazy: se cargan con el barrido de arriba, pero sus mosaicos tardan
    await page.locator('iframe').evaluateAll((fs) => fs.forEach((f) => (f.loading = 'eager')));
    await page.waitForTimeout((await page.locator('iframe').count()) ? 5000 : 1600);
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (desborde > 0) {
      problemas++;
      console.warn(`⚠ ${ruta} @${ancho}px: ${desborde}px de scroll horizontal`);
    }
    const nombre = `${ruta === '/' ? 'inicio' : ruta.replace(/\W+/g, '-').replace(/^-|-$/g, '')}-${ancho}.png`;
    await page.screenshot({ path: path.join(salida, nombre), fullPage: true });
    console.log(`✓ ${nombre}`);
    // QA_TRAMOS=1 → además, la página en tramos de 1.6 pantallas para revisarla de cerca
    if (process.env.QA_TRAMOS) {
      const alto = await page.evaluate(() => document.documentElement.scrollHeight);
      const tramo = Math.round(ancho * (ancho < 800 ? 2.4 : 0.9));
      for (let y = 0, n = 1; y < alto; y += tramo, n++) {
        await page.screenshot({
          path: path.join(salida, nombre.replace(".png", `-t${n}.png`)),
          fullPage: true,
          clip: { x: 0, y, width: ancho, height: Math.min(tramo, alto - y) },
        });
      }
    }
    await page.close();
  }
}

await browser.close();
process.exit(problemas ? 1 : 0);
