# Taller Rangel e Hijos: demo

Sitio de demostración de un taller mecánico de barrio en la colonia San Carlos, Guadalajara. El taller, los mecánicos, los precios, las órdenes y las reseñas son ficticios.

> Primero se revisa; luego se habla de dinero.

## Concepto: "La orden de servicio"

Todo el sitio está hecho con los papeles de un taller: folios, casillas ☐/☒, líneas para llenar, sellos de goma, la lista de precios de la pared, el pizarrón con gis, el tablero perforado de la caja y el talón que se desprende. Las ilustraciones son SVG propios con trazo a mano. Las pocas fotos llevan tratamiento duotono con semitono.

La dirección de arte completa está en [`DISENO.md`](DISENO.md) y la revisión final contra la lista negra en [`AUDITORIA-DISENO.md`](AUDITORIA-DISENO.md).

## Páginas

| Ruta | Qué hace |
|---|---|
| `/` | Encabezado de orden con estado abierto/cerrado calculado, diagnóstico por síntoma (10 síntomas con causas, urgencia, revisiones caseras y rango de precio), lista de pared, pizarrón con odómetro, compromisos sellados, equipo, notas de clientes, preguntas y orden de servicio que abre WhatsApp |
| `/servicios` | Los 34 servicios agrupados por sistema, con filtro, buscador y filas que se abren |
| `/presupuesto` | Cotizador: tipo de auto, servicios y tipo de refacción. Separa refacciones y mano de obra, calcula tiempo e IVA opcional, y saca una nota de taller que se manda por WhatsApp o se imprime |
| `/seguimiento` | Seguimiento por placa con 4 placas de prueba (`JAL-482-C`, `JKL-305-A`, `JHT-917-B`, `JNB-226-D`). "Autorizar" se guarda en el navegador y se sincroniza entre pestañas |
| `/contacto` | Cómo llegar, croquis, grúa, horario y orden de servicio |
| `/aviso-de-privacidad`, 404 | "Esta página está en el elevador" |

## Stack

- **Astro 7** estático (`output: 'static'`), TypeScript estricto y `@astrojs/sitemap`.
- **Tailwind 4** con tema propio (`@theme` sin los valores por defecto) en `src/styles/global.css`.
- JavaScript mínimo y sin frameworks: un script pequeño por componente.
- Fuentes servidas desde el propio sitio con la API de fuentes de Astro: Big Shoulders Display, IBM Plex Sans, IBM Plex Mono y Caveat Brush.
- **Vitest** para la lógica pura (`src/lib/`) y **Playwright** para los flujos y la QA visual.

## Uso

```powershell
npm install
npm run dev          # http://localhost:4321
npm run build        # genera dist/
npm run preview
```

| Script | Para qué |
|---|---|
| `npm test` | Pruebas de lógica: cotizador, diagnóstico, seguimiento y orden |
| `npm run e2e` | Flujos en navegador (levanta `astro preview` en el puerto 4400; antes corre `npm run build`) |
| `npm run qa -- <url> <rutas> <anchos>` | Capturas de página completa en `qa/capturas/` y aviso si hay scroll horizontal. Ejemplo: `npm run qa -- http://localhost:4321 /,/servicios 390,768,1440` |
| `npm run og` | Regenera `public/og.jpg` con el nombre, lema y teléfono de `site.ts` |
| `npm run social -- [capture] [compose] [video] --base=<url>` | Contenido para redes en `social/`: capturas, posts, carrusel y videos 9:16 y 16:9 (necesita `npm run preview` corriendo). Los textos para publicar están en `social/copys.md` |
| `npm run check` | Revisión de tipos de Astro |

Playwright usa el Chrome instalado en el sistema (`channel: 'chrome'`). Si no lo tienes, corre `npx playwright install chromium`.

## Publicar en Cloudflare Pages

- Comando de build: `npm run build`
- Directorio de salida: `dist`
- Los encabezados de caché y seguridad están en `public/_headers`.
- El `package-lock.json` está generado con npm 10, el mismo que usa la imagen de build de Pages. Si lo regeneras con otro npm, usa `npx npm@10 install --package-lock-only`.

## Adaptarlo a otro taller

1. **`src/config/site.ts`**: nombre, rótulo, lema, teléfono, WhatsApp, correo, dirección, coordenadas, calles del croquis, horario, grúa, garantía y la URL del sitio. Ningún componente tiene datos de la marca escritos a mano.
2. **`src/data/`**:
   - `servicios.ts`: precios base de refacción y mano de obra, horas, qué incluye y garantía.
   - `sintomas.ts`: síntomas del diagnóstico.
   - `equipo.ts`, `notas.ts`, `preguntas.ts` y `compromisos.ts`.
   - `ordenes.ts`: órdenes de la demo de seguimiento.
3. **Factores del cotizador** en `src/lib/cotizador.ts`: multiplicador por tipo de auto y por tipo de refacción, IVA y redondeo.
4. **Fotos**: ver [`FOTOS-REALES.md`](FOTOS-REALES.md).
5. `npm run og` para la imagen de redes. La URL canónica y el sitemap salen de `site.url`.

## Decisiones

- **Sin backend.** La orden de servicio y el cotizador arman un mensaje que la persona decide mandar por WhatsApp, o por correo si no tiene WhatsApp. El seguimiento es una demo guardada en `localStorage`.
- **Mapa bajo pedido.** El footer y contacto muestran un croquis dibujado. El mapa de OpenStreetMap solo se carga al tocar "Ver mapa interactivo": evita cerca de 300 KB de JS en cada página y no avisa a terceros de cada visita.
- **El diagnóstico funciona sin JavaScript.** Usa radios nativos y `:has()`. El JS solo prellena la orden.
- **Movimiento limitado.** Sello que se estampa, odómetro, botón táctil, dos cintas de precaución y un marquee. Todo se detiene con `prefers-reduced-motion`.
- **Accesibilidad.** Contraste AA revisado (los tonos óxido y acero tienen versiones oscuras para texto chico), objetivos táctiles de al menos 44 px, foco visible y barra fija de "Llamar / WhatsApp" en móvil.
- **SEO local.** Títulos únicos, Open Graph y Twitter, canonical, `lang="es-MX"`, JSON-LD `AutoRepair`, `FAQPage` y `Service`, sitemap y robots.

---

Demo desarrollado por [JacoboDev](https://jacobodev.pages.dev).
