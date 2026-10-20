/**
 * Genera public/og.jpg (1200×630) para Open Graph/Twitter con la identidad del sitio.
 * Uso: npm run og   (requiere Chrome instalado o `npx playwright install chromium`)
 * Toma nombre, lema y teléfono de src/config/site.ts.
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs';

// site.ts es TypeScript: se leen los valores con expresiones simples para no compilar
const src = fs.readFileSync(new URL('../src/config/site.ts', import.meta.url), 'utf8');
const campo = (k) => src.match(new RegExp(`${k}: '([^']+)'`))?.[1] ?? '';
const nombre = campo('name');
const rotulo = campo('rotulo');
const lema = campo('slogan');
const tel = campo('phoneDisplay');
const colonia = campo('neighborhood');
const ciudad = campo('city');

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=IBM+Plex+Mono:wght@400;700&display=block" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:630px;overflow:hidden;background:#E6DAC1;color:#14120F;font-family:'IBM Plex Mono',monospace;position:relative}
  .grano{position:absolute;inset:0;opacity:.5;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .08 0 0 0 0 .07 0 0 0 0 .05 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
  .tira{position:absolute;left:40px;right:40px;top:34px;display:flex;border:3px solid #14120F;background:#F5EFE0;font-size:17px;font-weight:700;text-transform:uppercase;letter-spacing:.12em}
  .tira span{padding:10px 16px;border-right:3px solid #14120F}.tira span:last-child{border:0;margin-left:auto}
  .rojo{color:#A3301A}
  h1{position:absolute;left:36px;top:96px;font-family:'Big Shoulders Display';font-weight:900;font-size:176px;line-height:.8;text-transform:uppercase;letter-spacing:-.01em}
  h1 b{color:#C8401F;display:block;font-weight:900}
  .lamina{position:absolute;left:44px;bottom:112px;background:#A3301A;border:3px solid #14120F;box-shadow:6px 6px 0 #14120F;padding:10px 22px 6px;transform:rotate(-2deg);font-family:'Big Shoulders Display';font-weight:900;font-size:84px;line-height:.9;color:#F5EFE0;text-shadow:3px 3px 0 #14120F}
  .lema{position:absolute;left:40px;bottom:40px;background:#E8B422;padding:8px 14px;font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
  .sello{position:absolute;right:70px;bottom:46px;border:5px solid #C8401F;color:#C8401F;font-family:'Big Shoulders Display';font-weight:900;font-size:46px;line-height:.9;text-transform:uppercase;padding:10px 16px;transform:rotate(-8deg);text-align:center}
</style></head><body><div class="grano"></div>
<div class="tira"><span class="rojo">Folio N.º 0001</span><span>${colonia}, ${ciudad}</span><span>Tel. ${tel}</span></div>
<h1>Si suena raro,<b>no es normal.</b></h1>
<div class="lamina">${rotulo}</div>
<p class="lema">${lema}</p>
<div class="sello">Revisión<br>sin costo</div>
</body></html>`;

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.jpg', type: 'jpeg', quality: 82 });
await browser.close();
console.log(`✓ public/og.jpg (${nombre})`);
