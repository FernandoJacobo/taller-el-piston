/**
 * Contenido para redes de la demo "Taller Rangel e Hijos".
 *
 *   npm run social -- [capture] [compose] [video] [--base=https://taller-rangel.pages.dev]
 *
 * - capture: capturas del sitio en celular (390 @3x) y escritorio (1440 @2x) → social/capturas/
 * - compose: posts, story y carrusel (1080×1350 / 1080×1920) con la identidad del taller → social/posts/, social/carrusel/
 * - video:   reels 9:16 (interacciones y recorrido) y recorrido 16:9, con portada → social/video/
 *
 * Sin argumentos ejecuta las tres etapas. Por defecto usa la vista previa local:
 *   npm run build && npm run preview
 */
import { mkdir, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import ffmpegPath from 'ffmpeg-static';
import { launch, sleep, settle, NO_SMOOTH_CSS } from './lib/browser.mjs';

const args = process.argv.slice(2);
const BASE = (args.find((a) => a.startsWith('--base='))?.slice(7) ?? 'http://localhost:4321').replace(/\/$/, '');
const steps = args.filter((a) => !a.startsWith('--'));
const run = (s) => steps.length === 0 || steps.includes(s);

const OUT = 'social';
const CAP = join(OUT, 'capturas');
const exec = promisify(execFile);

const MOBILE = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 };

const ORDEN = { placa: 'JAL-482-C', marca: 'Nissan', modelo: 'Versa', anio: '2014', km: '148320', nombre: 'Mariana T.', tel: '33 1234 5678' };

/** Cada página empieza con la demo de seguimiento limpia (nada autorizado). */
const freshDemo = (page) => page.evaluateOnNewDocument(() => {
  try {
    localStorage.clear();
  } catch {}
});

// ───────────────────────── Interacciones ─────────────────────────

async function warm(page) {
  await page.addStyleTag({ content: NO_SMOOTH_CSS });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(40);
  }
  await settle(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);
}

async function scrollToSel(page, sel, offset = 0) {
  await page.evaluate(
    (s, off) => {
      const el = document.querySelector(s);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + off);
    },
    sel,
    offset,
  );
  await sleep(500);
}

const click = (sel, wait = 500) => async (page) => {
  await page.evaluate((s) => document.querySelector(s).click(), sel);
  await sleep(wait);
};

/** Elige un síntoma sin el salto automático al expediente (la captura decide dónde mirar). */
const pickSymptom = (id) => async (page) => {
  await page.evaluate((i) => {
    const input = document.getElementById(`sin-${i}`);
    input.checked = true;
    input.labels[0].scrollIntoView({ block: 'nearest', inline: 'center' });
  }, id);
  await sleep(400);
};

async function fillOrder(page, falla = 'Rechina al frenar en las mañanas y vibra el pedal en bajada.') {
  await page.evaluate(
    (o, f) => {
      const set = (id, v) => {
        const el = document.getElementById(id);
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set('o-placa', o.placa);
      set('o-marca', o.marca);
      set('o-modelo', o.modelo);
      set('o-anio', o.anio);
      set('o-km', o.km);
      set('o-falla', f);
      set('o-nombre', o.nombre);
      set('o-tel', o.tel);
    },
    ORDEN,
    falla,
  );
  await sleep(300);
}

/** Cotización de ejemplo: sedán, balatas + rectificado, refacción equivalente, con IVA. */
async function quote(page) {
  await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el.checked) el.click();
    };
    pick('input[name="vehiculo"][value="sedan"]');
    pick('input[name="servicio"][value="balatas-delanteras"]');
    pick('input[name="servicio"][value="rectificado-discos"]');
    pick('input[name="servicio"][value="alineacion-balanceo"]');
    pick('input[name="iva"]');
  });
  await sleep(1200); // el sello "Estimado" se estampa
}

// ───────────────────────── Capturas ─────────────────────────

async function shot(browser, { path = '/', viewport, file, section, offset = 0, before, full = false }) {
  const page = await browser.newPage();
  await freshDemo(page);
  await page.setViewport(viewport);
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 90_000 });
  await warm(page);
  if (before) await before(page);
  if (section) await scrollToSel(page, section, offset);
  await page.screenshot({ path: join(CAP, file), type: 'png', fullPage: full });
  console.log('  ✓', file);
  await page.close();
}

async function capture() {
  await mkdir(CAP, { recursive: true });
  const browser = await launch();
  const m = (o) => shot(browser, { viewport: MOBILE, ...o });
  const d = (o) => shot(browser, { viewport: DESKTOP, ...o });

  console.log('Celular…');
  await m({ file: 'movil-inicio.png' });
  await m({ file: 'movil-diagnostico.png', section: '#expediente', offset: -150, before: pickSymptom('se-calienta') });
  await m({ file: 'movil-precios.png', section: '#precios', offset: -10 });
  await m({ file: 'movil-pizarron.png', section: '.tablero.pizarron', offset: 0 });
  await m({ file: 'movil-firmamos.png', section: '.firmamos', offset: 20 });
  await m({ file: 'movil-equipo.png', section: '.equipo', offset: 260 });
  await m({ file: 'movil-notas.png', section: '.notas', offset: 30 });
  await m({ file: 'movil-preguntas.png', section: '.faq', offset: 0, before: click('.faq details summary') });
  await m({ file: 'movil-orden.png', section: '#orden', offset: 140, before: fillOrder });
  await m({ path: '/servicios', file: 'movil-servicios.png', section: '[data-filtros]', offset: -40 });
  await m({ path: '/presupuesto', file: 'movil-cotizador.png', section: '[data-ticket]', offset: -24, before: quote });
  await m({ path: '/seguimiento?placa=JAL-482-C', file: 'movil-seguimiento.png', section: '[data-pizarra]', offset: 0 });
  await m({ path: '/seguimiento?placa=JAL-482-C', file: 'movil-seguimiento-autorizado.png', section: '[data-pizarra]', offset: 0, before: click('[data-autorizar]', 900) });
  await m({ path: '/contacto', file: 'movil-contacto.png', section: '.indicaciones', offset: -20 });

  console.log('Escritorio…');
  await d({ file: 'escritorio-inicio.png' });
  await d({ file: 'escritorio-diagnostico.png', section: '#diagnostico', offset: 0, before: pickSymptom('ruido-frenar') });
  await d({ file: 'escritorio-precios.png', section: '#precios', offset: -30 });
  await d({ file: 'escritorio-pizarron.png', section: '.tablero.pizarron', offset: 0 });
  // más alta que la pantalla normal para que entren los seis sellos y el título
  await shot(browser, { viewport: { ...DESKTOP, height: 1180 }, file: 'escritorio-firmamos.png', section: '.firmamos', offset: 50 });
  await d({ file: 'escritorio-equipo.png', section: '.equipo', offset: 40 });
  await d({ file: 'escritorio-notas.png', section: '.notas', offset: 0 });
  await d({ file: 'escritorio-orden.png', section: '#orden', offset: -40, before: fillOrder });
  await d({ path: '/servicios', file: 'escritorio-servicios.png', section: '[data-filtros]', offset: -40, before: click('[data-fila] summary', 600) });
  await d({ path: '/presupuesto', file: 'escritorio-cotizador.png', section: 'main', offset: 440, before: quote });
  await d({ path: '/seguimiento?placa=JAL-482-C', file: 'escritorio-seguimiento.png', section: '[data-pizarra]', offset: -20 });
  await d({ path: '/contacto', file: 'escritorio-contacto.png', offset: 0 });
  await d({ path: '/no-existe', file: 'escritorio-404.png' });
  await d({ file: 'escritorio-completa.png', full: true });
  await browser.close();
}

// ───────────────────────── Composición ─────────────────────────

const img = async (name) => `data:image/png;base64,${(await readFile(join(CAP, name))).toString('base64')}`;

const GRANO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .08 0 0 0 0 .07 0 0 0 0 .05 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/** Misma paleta y tipos que el sitio: kraft, grasa, óxido, mostaza; rótulo condensado, mono de formulario. */
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{width:var(--w);height:var(--h);overflow:hidden;background:#E6DAC1;color:#14120F;font-family:'IBM Plex Sans',sans-serif;position:relative}
body:before{content:"";position:absolute;inset:0;opacity:.55;background-image:${GRANO};pointer-events:none}
body.grasa{background:#1d1a16;color:#F5EFE0}
body.grasa:before{opacity:.35}
.tira{position:absolute;left:56px;right:56px;top:44px;display:flex;border:3px solid #14120F;background:#F5EFE0;font-family:'IBM Plex Mono',monospace;font-size:17px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#14120F;white-space:nowrap}
.tira span{padding:12px 18px;border-right:3px solid #14120F}.tira span:last-child{border:0;margin-left:auto}
.tira .r{color:#A3301A}
.k{font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:#A3301A}
.grasa .k{color:#E8B422}
h1,h2{font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase;line-height:.98;letter-spacing:-.005em}
h1 b,h2 b{color:#C8401F;font-weight:900}
.grasa h1,.grasa h2{color:#F5EFE0}
.grasa h2 b{color:#E8B422}
.abre{display:inline-block;transform:translateY(-.2em)}
.lead{font-size:30px;line-height:1.4;color:#3b352d}
.grasa .lead{color:#d8cfbb}
.foot{position:absolute;left:56px;right:56px;bottom:44px;display:flex;justify-content:space-between;align-items:center;font-family:'IBM Plex Mono',monospace;font-size:20px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#4B555B}
.grasa .foot{color:#bdb3a0}
.foot b{color:#14120F}.grasa .foot b{color:#E8B422}
.placa{display:inline-flex;align-items:baseline;gap:10px;padding:8px 22px 4px;background:#A3301A;border:3px solid #14120F;box-shadow:6px 6px 0 #14120F;font-family:'Big Shoulders Display';font-weight:900;font-size:64px;line-height:.9;color:#F5EFE0;text-shadow:3px 3px 0 #14120F;transform:rotate(-2deg)}
.placa small{font-size:26px;color:#F5EFE0;letter-spacing:.06em;text-shadow:none}
.sello{position:absolute;border:5px solid #C8401F;color:#C8401F;font-family:'Big Shoulders Display';font-weight:900;font-size:44px;line-height:.9;text-transform:uppercase;padding:10px 18px;text-align:center;opacity:.92}
.sello small{display:block;font-family:'IBM Plex Mono';font-size:15px;letter-spacing:.14em;margin-top:6px}
.cinta{position:absolute;height:34px;background:rgb(232 222 196/.78);box-shadow:0 0 0 1px rgb(20 18 15/.08)}
.browser{background:#F5EFE0;border:3px solid #14120F;box-shadow:12px 12px 0 #14120F}
.browser .bar{height:46px;display:flex;align-items:center;gap:10px;padding:0 16px;border-bottom:3px solid #14120F;background:#E6DAC1}
.browser .bar i{width:14px;height:14px;border:2px solid #14120F;background:#F5EFE0}
.browser .bar i:first-child{background:#C8401F}
.browser .bar span{margin-left:12px;flex:1;height:28px;border:2px solid #14120F;background:#F5EFE0;font-family:'IBM Plex Mono';font-size:15px;font-weight:700;color:#14120F;display:flex;align-items:center;padding:0 12px}
.browser img{display:block;width:100%}
.phone{border-radius:54px;padding:12px;background:#14120F;box-shadow:12px 12px 0 rgb(20 18 15/.55);position:relative}
.phone .screen{border-radius:43px;overflow:hidden;padding-top:44px;background:#E6DAC1}
.phone img{display:block;width:100%}
.phone:after{content:"";position:absolute;top:24px;left:50%;transform:translateX(-50%);width:96px;height:28px;border-radius:20px;background:#14120F}
.etq{display:inline-block;margin-top:18px;padding:6px 12px;background:#E8B422;border:2px solid #14120F;font-family:'IBM Plex Mono';font-weight:700;font-size:20px;letter-spacing:.08em;text-transform:uppercase;color:#14120F}
ul.casillas{list-style:none;display:grid;gap:22px;font-size:29px;line-height:1.3}
ul.casillas li{display:flex;gap:16px;align-items:flex-start}
ul.casillas li:before{content:"☒";flex:none;font-family:'IBM Plex Mono';font-size:34px;line-height:1;color:#A3301A}
.grasa ul.casillas li:before{color:#E8B422}
.nota{font-family:'Caveat Brush',cursive;color:#A3301A;font-size:40px;transform:rotate(-4deg);position:absolute}
.cal{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
.cal div{border:3px solid #14120F;background:#F5EFE0;box-shadow:6px 6px 0 #14120F;padding:22px 16px 18px;text-align:center}
.cal b{display:block;font-family:'Big Shoulders Display';font-weight:900;font-size:110px;line-height:.9;color:#3F7A4A}
.cal span{display:block;margin-top:10px;font-family:'IBM Plex Mono';font-weight:700;font-size:17px;letter-spacing:.08em;text-transform:uppercase}
.btn{display:inline-block;padding:22px 38px;background:#E8B422;border:3px solid #14120F;box-shadow:8px 8px 0 #14120F;font-family:'IBM Plex Mono';font-weight:700;font-size:34px;letter-spacing:.06em;color:#14120F}
.precaucion{position:absolute;left:-40px;right:-40px;height:64px;background:repeating-linear-gradient(-45deg,#E8B422 0 34px,#14120F 34px 68px);border-block:3px solid #14120F}
.precaucion span{position:absolute;left:120px;top:50%;transform:translateY(-50%);background:#14120F;color:#E8B422;padding:6px 18px;font-family:'IBM Plex Mono';font-weight:700;font-size:20px;letter-spacing:.12em;text-transform:uppercase}
`;

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=IBM+Plex+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;600&family=Caveat+Brush&display=block';

function page(w, h, body, cls = '') {
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FONTS_URL}"><style>:root{--w:${w}px;--h:${h}px}${CSS}</style></head><body class="${cls}">${body}</body></html>`;
}

const footer = '<div class="foot"><span>Demo · taller ficticio</span><span><b>JacoboDev</b> · jacobodev.pages.dev</span></div>';
const tira = (folio, centro = 'Mecánica en general · Guadalajara') =>
  `<div class="tira"><span class="r">Folio N.º ${folio}</span><span>${centro}</span><span>Taller Rangel e Hijos</span></div>`;
const placa = '<div class="placa">RANGEL <small>E HIJOS</small></div>';

async function render(browser, html, file, w, h) {
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: 'networkidle0' });
  // Carga explícita de cada estilo (document.fonts.ready no espera fuentes aún no solicitadas).
  await p.evaluate(async () => {
    const faces = ['900 40px "Big Shoulders Display"', '800 40px "Big Shoulders Display"', '400 20px "IBM Plex Mono"', '700 20px "IBM Plex Mono"', '400 20px "IBM Plex Sans"', '600 20px "IBM Plex Sans"', '400 30px "Caveat Brush"'];
    await Promise.all(faces.map((f) => document.fonts.load(f, '0123456789AaÁéñ¿?☒')));
    await document.fonts.ready;
  });
  await p.screenshot({ path: file, type: 'jpeg', quality: 92 });
  await p.close();
  console.log('  ✓', file);
}

async function compose() {
  const POSTS = join(OUT, 'posts');
  const CARR = join(OUT, 'carrusel');
  await mkdir(POSTS, { recursive: true });
  await mkdir(CARR, { recursive: true });
  const browser = await launch();
  const names = [
    'movil-inicio', 'movil-diagnostico', 'movil-precios', 'movil-pizarron', 'movil-firmamos', 'movil-orden', 'movil-servicios',
    'movil-cotizador', 'movil-seguimiento', 'movil-seguimiento-autorizado', 'movil-notas',
    'escritorio-inicio', 'escritorio-diagnostico', 'escritorio-precios', 'escritorio-firmamos', 'escritorio-servicios', 'escritorio-cotizador', 'escritorio-seguimiento',
  ];
  const c = Object.fromEntries(await Promise.all(names.map(async (n) => [n, await img(`${n}.png`)])));
  const browserFrame = (src, extra = '') =>
    `<div class="browser" style="${extra}"><div class="bar"><i></i><i></i><i></i><span>taller-rangel.pages.dev</span></div><img src="${src}"></div>`;
  // Franja arriba de la captura para que el notch no tape el encabezado del sitio.
  const phone = (src, w, extra = '') => `<div class="phone" style="width:${w}px;${extra}"><div class="screen"><img src="${src}"></div></div>`;

  // Post 1080×1350: escritorio + celular
  await render(
    browser,
    page(1080, 1350, `
    ${tira('0001')}
    <div style="position:absolute;left:56px;top:150px;right:56px">
      <p class="k">Sitio web · Taller mecánico</p>
      <h2 style="font-size:120px;margin-top:18px">Un taller que<br>se ve como <b>taller.</b></h2>
    </div>
    ${browserFrame(c['escritorio-inicio'], 'position:absolute;left:56px;width:840px;top:520px;transform:rotate(-1deg)')}
    ${phone(c['movil-inicio'], 250, 'position:absolute;right:56px;top:690px;transform:rotate(3deg)')}
    <div class="sello" style="right:64px;top:190px;transform:rotate(8deg)">Revisión<br>sin costo</div>
    ${footer}`),
    join(POSTS, '01-post-escritorio-movil.jpg'), 1080, 1350,
  );

  // Post 1080×1350: diagnóstico → orden
  await render(
    browser,
    page(1080, 1350, `
    ${tira('0002', 'Diagnóstico por síntoma')}
    <div style="position:absolute;left:56px;top:150px;right:56px">
      <h2 style="font-size:104px"><span class="abre">¿</span>Qué le suena<br>a tu <b>carro?</b></h2>
      <p class="lead" style="margin-top:20px;max-width:900px">Eliges el síntoma, te dice qué suele ser, qué tan urgente es y cuánto cuesta más o menos.</p>
    </div>
    <div style="position:absolute;left:140px;top:490px;width:300px">${phone(c['movil-diagnostico'], 300)}<p class="etq">1 · Eliges el síntoma</p></div>
    <div style="position:absolute;right:140px;top:490px;width:300px">${phone(c['movil-orden'], 300)}<p class="etq">2 · Se llena la orden</p></div>
    ${footer}`),
    join(POSTS, '02-post-diagnostico-orden.jpg'), 1080, 1350,
  );

  // Story 1080×1920
  await render(
    browser,
    page(1080, 1920, `
    ${tira('0003')}
    <div style="position:absolute;left:64px;top:170px;right:64px">
      ${placa}
      <p class="k" style="margin-top:56px">Sitio web para talleres</p>
      <h2 style="font-size:150px;margin-top:16px">Si suena raro,<br><b>no es normal.</b></h2>
      <p class="lead" style="margin-top:26px;max-width:900px">Diagnóstico por síntoma, precios a la vista, cotizador y seguimiento por placa.</p>
    </div>
    ${phone(c['movil-cotizador'], 400, 'position:absolute;left:90px;top:900px;transform:rotate(-4deg)')}
    ${phone(c['movil-seguimiento'], 400, 'position:absolute;right:90px;top:840px;transform:rotate(4deg)')}
    <div class="foot" style="bottom:100px"><span>Demo · taller ficticio</span><span><b>JacoboDev</b> · jacobodev.pages.dev</span></div>`),
    join(POSTS, '03-story.jpg'), 1080, 1920,
  );

  // Carrusel 1080×1350
  const slides = [
    // 1. Portada
    [`${tira('0001', 'Caso de diseño web')}
     <div style="position:absolute;left:56px;top:170px;width:560px">
       ${placa}
       <h1 style="font-size:118px;margin-top:64px">Sitio web<br>para un<br><b>taller mecánico.</b></h1>
       <p class="lead" style="margin-top:30px">Desliza para ver cómo convierte "suena raro" en una cita →</p>
     </div>
     ${phone(c['movil-inicio'], 360, 'position:absolute;right:64px;top:200px;transform:rotate(4deg)')}
     <div class="sello" style="left:70px;bottom:170px;transform:rotate(-7deg)">Demo<small>Datos ficticios</small></div>
     ${footer}`],
    // 2. Diagnóstico
    [`${tira('0002', 'Diagnóstico por síntoma')}
     <div style="position:absolute;left:56px;top:150px;right:56px">
       <h2 style="font-size:96px"><span class="abre">¿</span>Qué le suena <b>a tu carro?</b></h2>
     </div>
     ${phone(c['movil-diagnostico'], 350, 'position:absolute;left:80px;top:400px;transform:rotate(-2deg)')}
     <ul class="casillas" style="position:absolute;left:500px;right:56px;top:440px">
       <li>10 síntomas con causas de más a menos probable</li>
       <li>Medidor de urgencia: "agéndalo" o "no lo manejes"</li>
       <li>Lo que puedes revisar tú, gratis</li>
       <li>Rango de precio y botón para llevarlo</li>
     </ul>
     ${footer}`],
    // 3. Lista de precios
    [`${tira('0003', 'Lista de precios')}
     <div style="position:absolute;left:56px;top:150px;right:56px">
       <h2 style="font-size:96px">Precios <b>a la vista,</b><br>como en la pared.</h2>
       <p class="lead" style="margin-top:20px;max-width:880px">34 servicios con buscador y filtro por sistema. Precio desde, qué incluye y garantía.</p>
     </div>
     ${browserFrame(c['escritorio-servicios'], 'position:absolute;left:56px;width:700px;top:560px;transform:rotate(-1deg)')}
     ${phone(c['movil-precios'], 300, 'position:absolute;right:56px;top:600px;transform:rotate(3deg)')}
     <p class="nota" style="left:480px;top:500px">sin letra chiquita</p>
     ${footer}`],
    // 4. Cotizador
    [`${tira('0004', 'Cotizador')}
     <div style="position:absolute;left:56px;top:150px;right:56px">
       <h2 style="font-size:96px"><span class="abre">¿</span>Cuánto me <b>va a salir?</b></h2>
     </div>
     ${phone(c['movil-cotizador'], 370, 'position:absolute;right:80px;top:300px;transform:rotate(2deg)')}
     <ul class="casillas" style="position:absolute;left:56px;right:520px;top:380px">
       <li>Tipo de auto y tipo de refacción</li>
       <li>Refacciones y mano de obra por separado</li>
       <li>Tiempo de entrega y IVA opcional</li>
       <li>Nota de taller que se imprime o se manda por WhatsApp</li>
     </ul>
     ${footer}`],
    // 5. Seguimiento
    [`${tira('0005', 'Seguimiento por placa')}
     <div style="position:absolute;left:56px;top:150px;right:56px">
       <h2 style="font-size:96px">Así va <b>tu auto.</b></h2>
       <p class="lead" style="margin-top:16px;max-width:900px">Lo que antes veías en el pizarrón del taller, ahora en tu celular. Autorizas con un botón.</p>
     </div>
     <div style="position:absolute;left:130px;top:380px;width:330px">${phone(c['movil-seguimiento'], 330)}<p class="etq">Esperando tu OK</p></div>
     <div style="position:absolute;right:130px;top:380px;width:330px">${phone(c['movil-seguimiento-autorizado'], 330)}<p class="etq">Autorizado: a reparar</p></div>
     ${footer}`, 'grasa'],
    // 6. Lo que firmamos
    [`${tira('0006', 'Condiciones del servicio')}
     <div style="position:absolute;left:56px;top:150px;right:56px">
       <h2 style="font-size:96px">Confianza <b>por escrito.</b></h2>
       <p class="lead" style="margin-top:16px;max-width:900px">Seis compromisos como sellos de goma: te avisamos antes, foto de la pieza, garantía de 3 meses…</p>
     </div>
     ${browserFrame(c['escritorio-firmamos'], 'position:absolute;left:56px;right:56px;top:390px;transform:rotate(-.6deg)')}
     ${footer}`],
    // 7. Lighthouse
    [`${tira('0007', 'Lighthouse · celular')}
     <div style="position:absolute;left:56px;top:150px;right:56px">
       <h2 style="font-size:96px">Rápido, accesible<br>y <b>listo para Google.</b></h2>
     </div>
     <div class="cal" style="position:absolute;left:56px;right:56px;top:440px">
       ${[[95, 'Rendimiento'], [100, 'Accesibilidad'], [100, 'Buenas prácticas'], [100, 'SEO']].map(([v, n]) => `<div><b>${v}</b><span>${n}</span></div>`).join('')}
     </div>
     <ul class="casillas" style="position:absolute;left:56px;right:56px;top:740px">
       <li>Abierto o cerrado calculado con el horario real</li>
       <li>Ficha de negocio y preguntas en datos estructurados</li>
       <li>Sin plantillas: ilustraciones y diseño propios</li>
       <li>Hosting gratuito en Cloudflare</li>
     </ul>
     ${footer}`],
    // 8. Cierre
    [`<div class="precaucion" style="top:120px;transform:rotate(-2deg)"><span>Zona de trabajo · Pásale sin miedo</span></div>
     <div style="position:absolute;left:56px;right:56px;top:330px;text-align:center">
       <p class="k">Para talleres y refaccionarias</p>
       <h2 style="font-size:132px;margin-top:28px"><span class="abre">¿</span>Tu taller da<br><b>confianza</b> en línea?</h2>
       <p class="lead" style="margin:36px auto 0;max-width:820px">Diseño sitios rápidos y con identidad propia, pensados para que te llamen.</p>
       <p class="btn" style="margin-top:60px">jacobodev.pages.dev</p>
     </div>
     ${footer}`, 'grasa'],
  ];
  for (const [i, [body, cls]] of slides.entries()) {
    await render(browser, page(1080, 1350, body, cls), join(CARR, `${String(i + 1).padStart(2, '0')}.jpg`), 1080, 1350);
  }
  await browser.close();
}

// ───────────────────────── Video ─────────────────────────

const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Efectos que se inyectan en la página durante la grabación: etiquetas de texto, toques,
 * fundidos entre páginas, portada y cierre. Todo con la identidad del taller.
 * Las animaciones son CSS; su velocidad se ajusta a la de captura (ver `Recorder.applyRate`).
 */
const FX_CSS = `
html{scroll-behavior:auto!important}
#fx{position:fixed;inset:0;z-index:2147483647;pointer-events:none;font-family:var(--font-datos),monospace}
#fx .cap{position:absolute;left:50%;top:var(--cap-top,76px);transform:translateX(-50%) rotate(-1.5deg);white-space:nowrap;padding:9px 16px;background:#E8B422;color:#14120F;border:2px solid #14120F;box-shadow:4px 4px 0 #14120F;font-weight:700;font-size:var(--cap-size,15px);letter-spacing:.08em;text-transform:uppercase;animation:fx-in .4s cubic-bezier(.2,.8,.2,1) both}
#fx .cap.out{animation:fx-out .3s ease both}
@keyframes fx-in{from{opacity:0;transform:translateX(-50%) rotate(-6deg) scale(1.3)}}
@keyframes fx-out{to{opacity:0;transform:translate(-50%,-10px) rotate(-1.5deg)}}
#fx .tap{position:absolute;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;background:rgb(200 64 31/.28);border:3px solid #C8401F;animation:fx-tap .7s ease-out both}
@keyframes fx-tap{0%{transform:scale(.3);opacity:0}25%{opacity:1}100%{transform:scale(1.25);opacity:0}}
#fx .shot{position:absolute;inset:0;width:100%;height:100%}
#fx .shot.fade{animation:fx-fade .45s ease both}
@keyframes fx-fade{to{opacity:0}}
#fx .card{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 var(--card-pad,30px);background:#E6DAC1;color:#14120F;overflow:hidden}
#fx .card:before{content:"";position:absolute;inset:0;opacity:.55;background-image:${GRANO}}
#fx .card .cinta-p{position:absolute;left:-30px;right:-30px;bottom:var(--cinta-b,90px);height:var(--cinta-h,34px);background:repeating-linear-gradient(-45deg,#E8B422 0 18px,#14120F 18px 36px);border-block:2px solid #14120F;transform:rotate(-3deg)}
#fx .card > *:not(.cinta-p){position:relative;animation:fx-up .55s cubic-bezier(.2,.8,.2,1) both}
#fx .card > :nth-child(3){animation-delay:.1s}#fx .card > :nth-child(4){animation-delay:.2s}#fx .card > :nth-child(5){animation-delay:.3s}#fx .card > :nth-child(6){animation-delay:.4s}
@keyframes fx-up{from{opacity:0;transform:translateY(22px)}}
#fx .card .pl{align-self:flex-start;display:inline-flex;align-items:baseline;gap:8px;padding:5px 16px 2px;background:#A3301A;border:3px solid #14120F;box-shadow:5px 5px 0 #14120F;font-family:var(--font-rotulo);font-weight:900;font-size:var(--pl,40px);line-height:.9;color:#F5EFE0;text-shadow:2px 2px 0 #14120F;transform:rotate(-2deg)}
#fx .card .pl small{font-size:.4em;letter-spacing:.06em;text-shadow:none}
#fx .card .k{margin-top:30px;font-weight:700;font-size:var(--k,13px);letter-spacing:.14em;text-transform:uppercase;color:#A3301A}
#fx .card h2{margin-top:10px;font-family:var(--font-rotulo);font-weight:900;font-size:var(--h,54px);line-height:.92;text-transform:uppercase;color:#14120F}
#fx .card h2 b{color:#C8401F}
#fx .card p.t{margin-top:16px;font-family:var(--font-cuerpo);font-size:var(--p,17px);line-height:1.45;color:#3b352d}
#fx .card .url{align-self:flex-start;margin-top:26px;padding:12px 20px;background:#E8B422;border:3px solid #14120F;box-shadow:5px 5px 0 #14120F;font-weight:700;font-size:var(--url,18px);letter-spacing:.04em;color:#14120F}
#fx .card .by{margin-top:22px;font-size:var(--by,12px);font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#4B555B}
#fx .card.out{animation:fx-cardout .5s ease both}
@keyframes fx-cardout{to{opacity:0;transform:scale(1.04)}}
`;

class Recorder {
  constructor({ page, dir, fps, vars = {} }) {
    Object.assign(this, { page, dir, fps, vars, n: 0, last: 0, cycle: null, rate: 1 });
    this.frameMs = 1000 / fps;
  }

  /** Inyecta efectos y reloj ajustable tras cada navegación. */
  async prepare() {
    await this.page.addStyleTag({ content: FX_CSS });
    await this.page.evaluate((vars) => {
      const fx = document.createElement('div');
      fx.id = 'fx';
      for (const [k, v] of Object.entries(vars)) fx.style.setProperty(k, v);
      document.body.append(fx);
      window.__fxCap = null;
    }, this.vars);
    this.cdp = await this.page.createCDPSession();
    await this.cdp.send('Animation.enable');
    if (this.cycle == null) {
      // Calibración: mide cuánto tarda cada captura para fijar la velocidad desde el primer cuadro.
      const t = performance.now();
      for (let i = 0; i < 4; i++) await this.page.screenshot({ type: 'jpeg', quality: 90, optimizeForSpeed: true });
      this.cycle = (performance.now() - t) / 4 + 8;
      this.rate = Math.min(1, this.frameMs / this.cycle);
    }
    this.last = 0;
    await this.applyRate();
  }

  /** Ajusta animaciones CSS y el reloj de JS para que corran a la velocidad del video, no a la de captura. */
  async applyRate() {
    await this.cdp.send('Animation.setPlaybackRate', { playbackRate: this.rate });
    await this.page.evaluate((r) => window.__setRate?.(r), this.rate);
  }

  async snap() {
    await this.page.screenshot({ path: join(this.dir, `${String(this.n++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90, optimizeForSpeed: true });
    const now = performance.now();
    if (this.last) {
      const dt = now - this.last;
      this.cycle = this.cycle * 0.85 + dt * 0.15;
      if (this.n % 10 === 0) {
        this.rate = Math.min(1, Math.max(0.05, this.frameMs / this.cycle));
        await this.applyRate();
      }
    }
    this.last = performance.now();
  }

  async hold(sec) {
    for (let i = 0, n = Math.round(sec * this.fps); i < n; i++) await this.snap();
  }

  async scrollBy(dy, sec) {
    const from = await this.page.evaluate(() => window.scrollY);
    const max = await this.page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const to = Math.max(0, Math.min(max, from + dy));
    const n = Math.max(1, Math.round(sec * this.fps));
    for (let i = 1; i <= n; i++) {
      await this.page.evaluate((y) => window.scrollTo(0, y), Math.round(from + (to - from) * ease(i / n)));
      await this.snap();
    }
  }

  async scrollToSel(sel, offset, sec) {
    const dy = await this.page.evaluate((s, off) => document.querySelector(s).getBoundingClientRect().top + off, sel, offset);
    await this.scrollBy(dy, sec);
  }

  /** Desliza de lado una tira con scroll horizontal hasta centrar un elemento. */
  async slideTo(sel, sec = 0.7) {
    const { box, from, to } = await this.page.evaluate((s) => {
      const el = document.querySelector(s);
      let box = el.parentElement;
      while (box && box.scrollWidth <= box.clientWidth) box = box.parentElement;
      if (!box) return { box: null };
      box.dataset.fxSlide = '';
      const r = el.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      const to = Math.max(0, Math.min(box.scrollWidth - box.clientWidth, box.scrollLeft + r.left + r.width / 2 - (b.left + b.width / 2)));
      return { box: true, from: box.scrollLeft, to };
    }, sel);
    if (!box) return;
    const n = Math.max(1, Math.round(sec * this.fps));
    for (let i = 1; i <= n; i++) {
      await this.page.evaluate((x) => (document.querySelector('[data-fx-slide]').scrollLeft = x), Math.round(from + (to - from) * ease(i / n)));
      await this.snap();
    }
    await this.page.evaluate(() => delete document.querySelector('[data-fx-slide]').dataset.fxSlide);
  }

  async caption(text) {
    await this.page.evaluate((t) => {
      const fx = document.getElementById('fx');
      if (window.__fxCap) {
        const old = window.__fxCap;
        old.classList.add('out');
        setTimeout(() => old.remove(), 2000);
      }
      if (!t) return (window.__fxCap = null);
      const el = document.createElement('div');
      el.className = 'cap';
      el.textContent = t;
      fx.append(el);
      window.__fxCap = el;
    }, text);
  }

  /** Toque visible sobre un elemento; luego ejecuta `act` (por defecto, click). */
  async tap(sel, { act = true, sec = 0.5 } = {}) {
    // Si el elemento queda fuera de la zona cómoda de la pantalla, primero se desplaza hasta él.
    const dy = await this.page.evaluate((s) => {
      const r = document.querySelector(s).getBoundingClientRect();
      const c = r.top + r.height / 2;
      return c < innerHeight * 0.22 || c > innerHeight * 0.7 ? c - innerHeight * 0.48 : 0;
    }, sel);
    if (dy) await this.scrollBy(dy, 0.5);
    const box = await this.page.evaluate((s) => {
      const r = document.querySelector(s).getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }, sel);
    await this.page.evaluate(({ x, y }) => {
      const t = document.createElement('div');
      t.className = 'tap';
      t.style.left = `${x}px`;
      t.style.top = `${y}px`;
      document.getElementById('fx').append(t);
      setTimeout(() => t.remove(), 8000);
    }, box);
    await this.hold(0.12);
    if (act) await this.page.evaluate((s) => document.querySelector(s).click(), sel);
    await this.hold(sec);
  }

  /** Escribe texto en un campo, letra por letra. */
  async type(sel, text, cps = 20) {
    const perFrame = cps / this.fps;
    let shown = 0;
    while (shown < text.length) {
      shown = Math.min(text.length, shown + perFrame);
      await this.page.evaluate(
        (s, v) => {
          const el = document.querySelector(s);
          el.value = v;
          el.dispatchEvent(new Event('input', { bubbles: true }));
        },
        sel,
        text.slice(0, Math.floor(shown)),
      );
      await this.snap();
    }
  }

  async screenshotData() {
    return this.page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 92 });
  }

  /** Navega con un fundido desde la página anterior. */
  async go(url, { fade = true } = {}) {
    const prev = fade && this.n > 0 ? await this.screenshotData() : null;
    await this.page.goto(url, { waitUntil: 'networkidle0', timeout: 90_000 });
    await this.prepare();
    await this.page.evaluate(() => document.fonts.ready);
    if (prev) {
      await this.page.evaluate((d) => {
        const im = new Image();
        im.className = 'shot fade';
        im.src = `data:image/jpeg;base64,${d}`;
        document.getElementById('fx').append(im);
        setTimeout(() => im.remove(), 8000);
      }, prev);
    }
  }

  async card(html) {
    await this.page.evaluate((h) => {
      const c = document.createElement('div');
      c.className = 'card';
      c.innerHTML = `<span class="cinta-p"></span>${h}`;
      document.getElementById('fx').append(c);
      window.__fxCard = c;
    }, html);
  }

  async cardOut() {
    await this.page.evaluate(() => {
      const c = window.__fxCard;
      c.classList.add('out');
      setTimeout(() => c.remove(), 4000);
    });
  }
}

/** Reloj de JS ajustable (requestAnimationFrame) para que coincida con el video. */
function clockPatch() {
  const real = performance.now.bind(performance);
  let rate = 1;
  let base = real();
  let virt = base;
  window.__setRate = (r) => {
    virt = performance.now();
    base = real();
    rate = r;
  };
  performance.now = () => virt + (real() - base) * rate;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf(() => cb(performance.now()));
}

async function record({ name, viewport, scale, size, fps = 30, vars, coverAt = 1.6, script }) {
  const dir = join(OUT, '_frames', name);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  const browser = await launch();
  const page = await browser.newPage();
  // Demo de seguimiento limpia solo al principio: lo que se autoriza en el video se conserva.
  await page.evaluateOnNewDocument(() => {
    if (!sessionStorage.getItem('fx-limpio')) {
      localStorage.clear();
      sessionStorage.setItem('fx-limpio', '1');
    }
  });
  await page.evaluateOnNewDocument(clockPatch);
  await page.setViewport({ ...viewport, deviceScaleFactor: scale });
  const rec = new Recorder({ page, dir, fps, vars });
  await script(rec, page);
  await browser.close();

  const VIDEO = join(OUT, 'video');
  await mkdir(VIDEO, { recursive: true });
  const outFile = join(VIDEO, `${name}.mp4`);
  await exec(
    ffmpegPath,
    ['-y', '-framerate', String(fps), '-i', join(dir, '%05d.jpg'), '-vf', `scale=${size[0]}:${size[1]}:flags=lanczos,setsar=1`,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '19', '-movflags', '+faststart', outFile],
    { maxBuffer: 1 << 26 },
  );
  // Portada: cuadro con la tarjeta de título ya completa, antes de que se desvanezca.
  await exec(ffmpegPath, ['-y', '-ss', String(coverAt), '-i', outFile, '-frames:v', '1', '-q:v', '3', outFile.replace(/\.mp4$/, '-portada.jpg')]);
  await rm(dir, { recursive: true, force: true });
  console.log('  ✓', outFile, `(${rec.n} cuadros, ${(rec.n / fps).toFixed(1)} s)`);
}

const MOBILE_VIDEO = { viewport: { width: 390, height: 693, isMobile: true, hasTouch: true }, scale: 1080 / 390, size: [1080, 1920] };
const PLACA = '<span class="pl">RANGEL <small>E HIJOS</small></span>';

async function introCard(rec, { kicker, title, text }) {
  await rec.card(`${PLACA}<p class="k">${kicker}</p><h2>${title}</h2><p class="t">${text}</p><p class="by">Demo por JacoboDev · taller ficticio</p>`);
}

async function outroCard(rec) {
  await rec.card(
    `${PLACA}<p class="k">Para talleres mecánicos</p><h2>¿Quieres un sitio <b>así</b> para tu taller?</h2><p class="t">Precios claros, cotizador y citas por WhatsApp. Rápido y fácil de actualizar.</p><span class="url">jacobodev.pages.dev</span>`,
  );
}

/** Elige el síntoma en la tira (desliza hasta él y lo toca). */
async function chooseSymptom(rec, id) {
  await rec.slideTo(`label[for="sin-${id}"]`, 0.8);
  await rec.tap(`label[for="sin-${id}"]`, { sec: 0.9 });
}

/** Cotización tocando casillas como lo haría una persona. */
async function buildQuote(rec) {
  const lbl = (s) => `label:has(> input${s}), label:has(input${s})`;
  await rec.tap(lbl('[name="vehiculo"][value="sedan"]'), { sec: 0.5 });
  await rec.tap(lbl('[value="balatas-delanteras"]'), { sec: 0.5 });
  await rec.tap(lbl('[value="rectificado-discos"]'), { sec: 0.5 });
  await rec.tap(lbl('[value="alineacion-balanceo"]'), { sec: 0.5 });
  await rec.tap(lbl('[name="iva"]'), { sec: 0.6 });
}

async function video() {
  console.log('Reel 9:16 · interacciones…');
  await record({
    name: 'rangel-reel-interacciones-9x16',
    ...MOBILE_VIDEO,
    coverAt: 2,
    async script(rec) {
      await rec.go(`${BASE}/`, { fade: false });
      await introCard(rec, { kicker: 'Sitio web · Taller mecánico', title: 'Así se ve el sitio de un <b>taller de barrio</b>', text: 'Todo lo que un cliente puede hacer desde su celular.' });
      await rec.hold(2.4);
      await rec.cardOut();
      await rec.hold(0.4);
      await rec.caption('Dice si está abierto ahora');
      await rec.hold(1.8);

      await rec.caption('Diagnóstico por síntoma');
      await rec.scrollToSel('#diagnostico', -10, 2);
      await rec.hold(0.4);
      await chooseSymptom(rec, 'se-calienta');
      await rec.scrollBy(260, 1.2);
      await rec.hold(0.8);
      await rec.scrollBy(380, 1.4);
      await rec.hold(0.6);

      await rec.caption('Precios a la vista');
      await rec.scrollToSel('#precios', 0, 2);
      await rec.scrollBy(520, 2.2);

      await rec.caption('12,480 autos revisados');
      await rec.scrollToSel('.tablero.pizarron', -10, 1.8);
      await rec.hold(2.6);

      await rec.caption('Lo que firmamos');
      await rec.scrollToSel('.firmamos', 0, 1.8);
      await rec.hold(1.4);
      await rec.scrollBy(500, 1.6);
      await rec.hold(0.8);

      await rec.caption('Cotizador con nota de taller');
      await rec.go(`${BASE}/presupuesto`);
      await rec.scrollToSel('[name="vehiculo"]', -160, 1.4);
      await buildQuote(rec);
      await rec.scrollToSel('[data-ticket]', -70, 1.8);
      await rec.hold(2);

      await rec.caption('Seguimiento por placa');
      await rec.go(`${BASE}/seguimiento`);
      await rec.hold(0.4);
      await rec.tap('[data-placa="JAL-482-C"]', { sec: 1 });
      await rec.scrollToSel('[data-pizarra]', 0, 1.4);
      await rec.hold(0.6);
      await rec.caption('Autorizas con un botón');
      await rec.tap('[data-autorizar]', { sec: 1 });
      await rec.scrollToSel('[data-pizarra]', 0, 1);
      await rec.hold(1.6);
      await rec.caption(null);

      await outroCard(rec);
      await rec.hold(3.2);
    },
  });

  console.log('Reel 9:16 · recorrido…');
  await record({
    name: 'rangel-reel-recorrido-9x16',
    ...MOBILE_VIDEO,
    async script(rec) {
      await rec.go(`${BASE}/`, { fade: false });
      await introCard(rec, { kicker: 'Diseño web · Taller', title: 'Si suena raro, <b>no es normal.</b>', text: 'Recorrido completo en celular.' });
      await rec.hold(2);
      await rec.cardOut();
      await rec.hold(1.2);
      // Hasta el inicio del pie (la cinta y el rótulo gigante), sin recorrer todos los datos
      const end = await rec.page.evaluate(() => document.querySelector('body > footer, footer').getBoundingClientRect().top + scrollY - innerHeight * 0.55);
      await rec.scrollBy(end, 26);
      await rec.hold(0.6);
      await outroCard(rec);
      await rec.hold(3);
    },
  });

  console.log('Video 16:9 · escritorio…');
  await record({
    name: 'rangel-recorrido-16x9',
    viewport: { width: 1440, height: 810 },
    scale: 1920 / 1440,
    size: [1920, 1080],
    vars: { '--cap-top': '96px', '--cap-size': '19px', '--card-pad': '160px', '--h': '96px', '--p': '24px', '--k': '17px', '--pl': '60px', '--url': '24px', '--by': '16px', '--cinta-b': '110px', '--cinta-h': '46px' },
    async script(rec) {
      await rec.go(`${BASE}/`, { fade: false });
      await introCard(rec, { kicker: 'Sitio web · Taller mecánico', title: 'Taller Rangel e Hijos:<br>sitio para un <b>taller de barrio</b>', text: 'Astro · Tailwind · Lighthouse 95–100 en celular' });
      await rec.hold(2.2);
      await rec.cardOut();
      await rec.hold(1.4);
      await rec.caption('Diagnóstico por síntoma');
      await rec.scrollToSel('#diagnostico', 0, 2);
      await rec.tap('label[for="sin-vibra-volante"]', { sec: 1 });
      await rec.tap('label[for="sin-se-calienta"]', { sec: 1.4 });
      await rec.caption('Lista de precios de pared');
      await rec.scrollToSel('#precios', -20, 2);
      await rec.hold(1.2);
      await rec.caption(null);
      await rec.scrollToSel('.tablero.pizarron', 0, 1.8);
      await rec.hold(2.6);
      await rec.scrollToSel('.firmamos', 0, 1.8);
      await rec.hold(1.6);
      await rec.scrollToSel('.equipo', 0, 2);
      await rec.scrollBy(500, 2);
      await rec.scrollToSel('.notas', 0, 1.8);
      await rec.hold(1);
      await rec.caption('Orden de servicio directo a WhatsApp');
      await rec.scrollToSel('#orden', -30, 2.2);
      await rec.type('#o-placa', ORDEN.placa);
      await rec.type('#o-marca', ORDEN.marca);
      await rec.type('#o-modelo', ORDEN.modelo);
      await rec.type('#o-anio', ORDEN.anio);
      await rec.type('#o-falla', 'Rechina al frenar en las mañanas.', 28);
      await rec.type('#o-nombre', ORDEN.nombre);
      await rec.type('#o-tel', ORDEN.tel);
      await rec.tap('#orden button[type="submit"]', { act: false, sec: 1 });
      await rec.caption('Cotizador');
      await rec.go(`${BASE}/presupuesto`);
      await rec.scrollToSel('[name="vehiculo"]', -200, 1.4);
      await buildQuote(rec);
      await rec.hold(1.2);
      await rec.caption('Seguimiento por placa');
      await rec.go(`${BASE}/seguimiento?placa=JAL-482-C`);
      await rec.scrollToSel('[data-pizarra]', -20, 1.4);
      await rec.hold(0.8);
      await rec.tap('[data-autorizar]', { sec: 1.6 });
      await rec.caption(null);
      await outroCard(rec);
      await rec.hold(3);
    },
  });
}

if (run('capture')) await capture();
if (run('compose')) {
  if (!existsSync(join(CAP, 'movil-inicio.png'))) throw new Error('Faltan capturas: ejecuta primero la etapa "capture".');
  await compose();
}
if (run('video')) await video();
