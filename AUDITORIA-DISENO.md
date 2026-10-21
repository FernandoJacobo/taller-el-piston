# Auditoría de diseño: Taller Rangel e Hijos

Revisión del sitio terminado contra `DISENO.md` y la lista negra del encargo. Hecha con capturas de Playwright a 360, 390, 768, 1024, 1280, 1440 y 1536 px (`npm run qa`), Lighthouse móvil y búsquedas en el código.

## 1. Inicio, sección por sección

| # | Sección | Composición | Materiales | Lista negra |
|---|---|---|---|---|
| A | Encabezado | Tira de formulario: celdas de borde de 2 px (folio, fecha, horario, estado calculado con la hora de Guadalajara) y menú de texto subrayado | Papel, tinta, casilla ☒ | Sin barra de navegación con píldoras ni logo centrado |
| B | Hero | Titular a 17 vw alineado a la izquierda que se sale por la derecha; hoja de orden llenada con pluma, rotada 2°; sello redondo montado sobre la cinta; llave de cruz dibujada detrás | Kraft con grano, hoja con cinta adhesiva, tinta de pluma, sello con tinta gastada | No está centrado, tiene 1 botón y un enlace de texto, ninguna cifra |
| — | Cinta 1 | Franja de precaución inclinada con leyenda | Cinta de precaución | 1 de 2 permitidas, sin animación |
| C | Diagnóstico | Índice tipográfico 01–10 a la izquierda y expediente *sticky* a la derecha, con el primer síntoma ya abierto | Hoja de expediente, medidor dibujado, casillas | No es una cuadrícula de tarjetas. El medidor no se anima (no está en la lista de animaciones) |
| D | Lista de pared | "PRECIOS" vertical en mostaza; hoja atornillada a dos columnas con puntos guía | Tornillos, esquina doblada, dos notas de plumón | Sin tabla de precios en tres columnas con "plan recomendado" |
| E | Pizarrón | Tablero oscuro a sangre: odómetro, 5 columnas de estado con placas magnéticas, invitación a gis | Pizarrón, gis (filtro `#trazo-gis`), placas | El odómetro es una de las animaciones permitidas |
| F | Lo que firmamos | 6 sellos de 6 formas distintas sobre una hoja rasgada; título abajo a la derecha con firma | Sellos de goma con tinta gastada, papel rasgado | Sin iconos en círculos de colores |
| G | Equipo | 4 gafetes de anchos distintos en escalera descendente (zigzag en móvil), colgados de un clip | Clip, foto duotono de la herramienta favorita, resaltador | No son tarjetas iguales; no hay fotos de caras de stock |
| H | Notas | Tablero perforado con 6 papelitos de 6 tipos (adhesiva, recibo rasgado, renglones, servilleta, tarjeta, nota con tachuela) | Pegboard, tachuelas, cinta, grapa | No hay carrusel ni estrellas |
| — | Marquee | Tira de servicios a 60 s | Cinta de rotular | 1 permitido; se pausa con el mouse y con `reduced-motion` |
| I | Preguntas | Columna angosta de casillas ☐/☒ (`<details>`) y vacío intencional a la derecha con una nota de plumón | Renglones de formulario | Sin acordeón con chevrons ni sombras |
| J | Orden de servicio | Hoja con talón desprendible y perforación; abre WhatsApp y tiene salida por correo | Líneas para llenar, tinta de pluma, sello "Conserve este talón" | Sin formulario de tarjeta flotante |
| K | Footer | Cinta 2, tabla de horario, croquis dibujado pegado con cinta y "RANGEL" a 35 vw cortado por el borde inferior | Grasa, cinta, croquis | Sin cuatro columnas de enlaces genéricos |

Son 11 composiciones distintas en el inicio (se pedían al menos 6).

## 2. Lista negra, verificada en el código

| Regla | Cómo se verificó | Resultado |
|---|---|---|
| Fuentes prohibidas | Búsqueda de Inter, Poppins, Manrope, Jakarta, DM Sans, Space Grotesk, Outfit, Geist y Roboto en `src/` y `astro.config.mjs` | Ninguna. Se usan Big Shoulders Display, IBM Plex Sans, IBM Plex Mono y Caveat Brush, servidas desde el propio sitio |
| Gradientes de color, glow, blobs, glass | Revisión de cada `*-gradient(` | Solo patrones funcionales: puntos del pegboard y del semitono, renglones, franjas de la cinta, sombra interna del odómetro y dientes del ticket. No hay `backdrop-filter` |
| Radios de 12–24 px | Búsqueda de `border-radius` | Tokens de 0, 2 y 4 px. `9999px` y `50%` solo en objetos que son redondos de verdad (sellos, tachuelas, radios del formulario); 0.5rem en el alambre del clip |
| Sombras difusas | Búsqueda de `box-shadow` | Tokens de 2, 4 y 7 px sin difuminado. Una sombra de 1 px en el contorno de la cinta adhesiva y una de 4 px sin difuminado en la cinta de rotular |
| Bordes grises de 1 px | Revisión de bordes | Los bordes son de 2 px en tinta, o punteados de formulario |
| Lucide o Heroicons | `package.json` | No están instalados. Todas las ilustraciones son SVG propios (`Ilustracion.astro`, `Croquis.astro`) |
| Carrusel de reseñas, fade-up, cambio de tema | Revisión de scripts | No existen. Las animaciones son sello, odómetro, botón táctil y marquee, todas detenidas con `prefers-reduced-motion` |
| Emojis | Búsqueda de rangos Unicode de emoji | Ninguno. Solo marcas tipográficas de formulario: ✓ ✕ ☐ ☒ |
| Lorem ipsum, frases de agencia | Búsqueda de texto | Ninguno. Todo el texto está escrito en la voz del taller |
| Librerías de componentes | `package.json` | Solo `astro`, `@astrojs/sitemap`, `tailwindcss` y `@tailwindcss/vite` |
| Letra de plumón (máximo 6–8 usos) | Conteo de `.plumon` | 8 usos, listados en `DISENO.md` §6 |

## 3. Correcciones de la QA visual

**Ronda 1 (1440 y 390 px)**
- Hero a 1440: la hoja de orden tapaba la "L" de "NORMAL" y se leía "..". La hoja bajó 5.5 rem y quedó montada sobre la cinta.
- Diagnóstico: el expediente vacío dejaba un hueco grande. Ahora el primer síntoma viene abierto.
- Titulares: con interlineado 0.86 los acentos (SÍ, É) chocaban con el renglón de arriba. Subió a 0.98.
- Pizarrón: columnas vacías demasiado altas, de 14 a 8 rem.
- Notas: la tarjeta repetía el nombre del cliente en el membrete y en la firma.
- Móvil: el menú se partía en dos renglones y "MI AUTO" se cortaba. Ahora va en un renglón hasta 360 px.
- Móvil: en la lista de pared algunos precios bajaban de renglón y otros no. Ahora el precio siempre queda a la derecha.

**Ronda 2 (768 px y páginas internas)**
- Tablet: la hoja de orden volvía a tapar "es normal." porque tenía margen negativo.
- Encabezado: el horario y el teléfono se partían a la mitad de la cifra.
- Sellos a 768: el texto de "Foto" quedaba debajo de "3 meses".
- Contacto: el mapa de OpenStreetMap costaba unos 300 KB de JS y bajaba el rendimiento móvil a 74. Se cambió por un croquis dibujado y el mapa se carga al pedirlo. El rendimiento subió a 99.
- El sello del hero giraba sin parar, y esa animación no está en la lista. Ahora se estampa una vez.

## 4. Números

**Lighthouse móvil** (vista previa local, Lighthouse 12):

| Página | Rend. | Acces. | Prácticas | SEO |
|---|---|---|---|---|
| `/` | 95 | 100 | 100 | 100 |
| `/servicios` | 99 | 100 | 100 | 100 |
| `/presupuesto` | 96 | 100 | 100 | 100 |
| `/seguimiento` | 99 | 100 | 100 | 100 |
| `/contacto` | 99 | 100 | 100 | 100 |
| `/aviso-de-privacidad` | 100 | 100 | 100 | 100 |

El 404 no se mide porque Lighthouse aborta cuando la respuesta es 404, que es lo correcto.

**Pruebas:**
- 47 pruebas de Vitest: cotizador, diagnóstico, seguimiento y orden de servicio.
- 12 pruebas de Playwright: los tres flujos, el croquis y que no haya scroll horizontal de 360 a 1536 px en todas las rutas.

## 5. Pendiente o a vigilar

- Las fotos son de banco (Unsplash) con tratamiento duotono. Hay que cambiarlas por fotos del taller real, según `FOTOS-REALES.md`.
- El folio, el estado y los datos de seguimiento son de demostración. Un taller real necesitaría un backend para las órdenes.
- Los textos legales del aviso de privacidad son genéricos.
