import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

/** Chrome instalado en el sistema (Windows/macOS/Linux) o el definido en CHROME_PATH. */
export function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error('No se encontró Chrome. Define CHROME_PATH con la ruta del ejecutable.');
  return found;
}

export function launch(extra = {}) {
  return puppeteer.launch({ executablePath: chromePath(), headless: true, ...extra });
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Para capturar y grabar: scroll inmediato (sin `scroll-behavior: smooth`). */
export const NO_SMOOTH_CSS = 'html{scroll-behavior:auto!important}';

/**
 * Deja la página lista para capturar: estampa los sellos, pone el odómetro en su cifra final,
 * carga las imágenes diferidas y espera las fuentes.
 */
export async function settle(page) {
  await page.addStyleTag({ content: NO_SMOOTH_CSS });
  await page.evaluate(async () => {
    document.querySelectorAll('[data-estampa]').forEach((e) => e.classList.add('estampado'));
    document.querySelectorAll('[data-odometro]').forEach((e) => e.classList.replace('en-cero', 'girando'));
    const imgs = [...document.images].filter((i) => !i.complete);
    imgs.forEach((i) => (i.loading = 'eager'));
    await Promise.all(imgs.map((i) => new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); })));
    await document.fonts.ready;
  });
  // El rodillo más lento del odómetro tarda ~2.5 s
  await sleep(2800);
}
