# DISEÑO — Taller Rangel e Hijos

> Contrato de dirección de arte. Si algo del sitio no cabe aquí, no entra.

## 1. Concepto: "La orden de servicio"

Todo el sitio es **la hoja de servicio que te llenan en el mostrador** de un taller de barrio de Guadalajara: papel kraft con grasa en las orillas, folio impreso en rojo, casillas que alguien marcó con pluma, un sello de goma que quedó chueco y la nota del mecánico escrita con plumón en el margen.

La identidad no sale de un kit de UI, sale de cuatro objetos reales del taller:

| Objeto real | Cómo vive en el sitio |
|---|---|
| **Orden de servicio** (folio, casillas, líneas de llenado, firma, talón desprendible) | encabezado, hero, formulario, FAQ, cotizador |
| **Lista de precios pegada en la pared** (puntos guía, tachones, precio corregido a mano) | lista de precios del inicio y `/servicios` |
| **Pizarrón del taller** (columnas a gis, tiras magnéticas con la placa) | sección oscura del inicio y `/seguimiento` |
| **Tablero de herramientas** (pegboard perforado, siluetas de herramienta) | notas de clientes, fondo de 404 |

Regla de oro: **cada elemento tiene que poder existir en un taller de verdad.** Si no se puede imprimir, pegar, sellar o escribir con gis, no va.

## 2. Tokens

### Color (un solo tema, sin modo oscuro)

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--grasa` | `#14120F` | tinta, bordes 2 px, texto, pizarrón | 13.5:1 sobre kraft, 16.3:1 sobre papel |
| `--kraft` | `#E6DAC1` | fondo principal | — |
| `--papel` | `#F5EFE0` | hojas, notas, tickets | — |
| `--oxido` | `#C8401F` | titulares grandes, sellos, folio | 4.35:1 sobre papel, 3.6:1 sobre kraft → **solo texto grande (≥ 24 px o 19 px bold)** |
| `--oxido-oscuro` | `#A3301A` | texto chico en rojo, fondo de botones rojos | 6.1:1 sobre papel, 5.1:1 sobre kraft |
| `--mostaza` | `#E8B422` | cinta de precaución, resaltador, botón principal | 9.8:1 con grasa |
| `--acero` | `#59646B` | texto secundario, líneas técnicas | 5.3:1 sobre papel; 4.38:1 sobre kraft → en kraft el texto chico secundario usa `--acero-oscuro` |
| `--verde-ok` | `#3F7A4A` | semáforo "puede esperar" (relleno de medidor, no texto chico) | 4.47:1 sobre papel → etiquetas en `--grasa` |
| `--acero-oscuro` | `#4B555B` | texto secundario sobre kraft | ≥ 5.5:1 sobre kraft |
| `--gis` | `#EDE8DA` | texto "de gis" sobre pizarrón | 15:1 sobre grasa |

Nada de gradientes de color. Las únicas transiciones de tono son texturas (grano, grasa).

### Tipografía

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| Rótulo / titular | **Big Shoulders Display** | 800, 900 | mayúsculas, `line-height: .82`, `letter-spacing: -.01em` |
| Cuerpo | **IBM Plex Sans** | 400, 600 | párrafos, botones |
| Datos | **IBM Plex Mono** | 400, 700 | folios, precios, placas, horas, etiquetas; siempre `tabular-nums` |
| Plumón | **Caveat Brush** | 400 | notas a mano: **máximo 8 en todo el sitio** (ver §6) |

### Escala (extrema a propósito)

| Paso | Tamaño | Dónde |
|---|---|---|
| `mono-xs` | 11–12 px | sellos de folio, metadatos, pie de ticket |
| `mono-s` | 13–14 px | precios, etiquetas técnicas, horario |
| `body` | 16–17 px | texto corrido |
| `lead` | 19–21 px | entradillas |
| `rotulo-m` | `clamp(2.4rem, 6vw, 4.5rem)` | títulos de sección secundarios |
| `rotulo-l` | `clamp(3.5rem, 11vw, 10rem)` | títulos de sección |
| `rotulo-xl` | `clamp(4.2rem, 17vw, 19rem)` | hero y footer (se sale del contenedor) |

El contraste de **tamaño** es el protagonista: un titular de 17 vw junto a un párrafo mono de 13 px.

### Forma

- Radios: `0` por defecto, `2px` en inputs, `4px` máximo (tickets). Círculos solo en sellos redondos y tornillos.
- Bordes: `2px solid var(--grasa)`. Líneas de llenado: `1.5px dashed` o punteadas.
- Sombras: solo duras, solo en objetos físicos: `--sombra-1: 2px 2px 0`, `--sombra-2: 4px 4px 0`, `--sombra-3: 7px 7px 0` en `--grasa`. Cero `blur`.

## 3. Composiciones del inicio (9 distintas)

| # | Sección | Composición | Retícula |
|---|---|---|---|
| A | Encabezado de orden | **Tira de formulario**: celdas con bordes como el encabezado impreso de una orden (folio · fecha · horario · estado) + navegación de texto subrayado | tabla de 4 celdas desiguales |
| B | Hero | **Titular desbordado + hoja encimada**: "SI SUENA RARO, NO ES NORMAL." a 17 vw alineado a la izquierda que se sale por la derecha; la orden de servicio llenada a mano se monta encima, rotada +2°, con cinta; sello redondo que muerde la orilla de la hoja; llave de cruz gigante cruzando detrás | 12 col: titular 1–13 (desborda), hoja 8–12 encimada |
| C | Diagnóstico | **Índice + expediente**: lista tipográfica numerada 01–10 a la izquierda (tamaño de rótulo M, como índice de manual), expediente de papel *sticky* a la derecha con medidor | 5 / 7, el expediente se pega |
| D | Lista de precios | **Pared con título vertical**: "PRECIOS" vertical a 90° pegado al borde izquierdo, hoja de lista a dos columnas atornillada a la pared, nota de plumón en la esquina | título 1 col / hoja 10 col desplazada |
| E | Pizarrón | **Sangrado oscuro con columnas a gis**: tablero `--grasa` a todo lo ancho, odómetro arriba a la izquierda, 5 columnas de estado con tiras magnéticas, invitación escrita con gis abajo a la derecha | 5 columnas de pizarrón |
| F | Lo que firmamos | **Sellos dispersos sobre una hoja**: 6 sellos de formas distintas (redondo, rectángulo doble, óvalo, triangular de esquina, rectangular con fecha, cuadrado con borde roto) en posiciones libres con rotación propia; título abajo a la derecha | retícula libre 6×4 con colocación manual |
| G | Equipo | **Gafetes escalonados en diagonal**: 4 gafetes de anchos distintos, cada uno más abajo que el anterior, colgando de un clip, foto duotono de su herramienta | escalera descendente |
| H | Notas de clientes | **Tablero perforado (pegboard)**: 6 papelitos de tamaños distintos clavados con tachuela o cinta sobre un fondo de agujeros | masonry manual, 3 alturas |
| I | Preguntas | **Columna angosta de casillas**: FAQ como renglones ☐/☒ de formulario en una columna estrecha a la izquierda; a la derecha mucho vacío con una sola nota de plumón | 7 / 5 vacío intencional |
| J | Orden de servicio (CTA) | **Hoja con talón desprendible**: formulario a la izquierda, talón perforado a la derecha con el folio y "conserve este talón" | 9 / 3 con perforación vertical |
| K | Footer | **Rótulo gigante cortado**: "RANGEL" a 30 vw cortado por el borde inferior, datos en tabla mono arriba, croquis dibujado con marco de foto pegada (el mapa real se carga al pedirlo) | 3 bloques + rótulo a sangre |

Entre B y C va la **cinta de precaución 1**; entre H e I corre el **marquee** único; la **cinta de precaución 2** es la orilla superior del footer: es el mismo elemento en todas las páginas, así que el sitio nunca muestra más de dos cintas a la vez.

### Móvil (no se apila sin más)

- B: el titular baja a 3 renglones a 19 vw; la hoja va justo debajo, recargada a la derecha y rotada (en QA se vio que encimarla tapaba "ES NORMAL.").
- C: el índice se vuelve una tira horizontal desplazable de "chips" rectangulares de papel (sin radio) **y** el expediente queda debajo; al elegir, se hace scroll al expediente.
- D: el título vertical pasa a horizontal arriba pero con rotación −2° pegado como tira de cinta de rotular.
- E: columnas del pizarrón como filas con la tira a la derecha.
- F: sellos en dos columnas alternando lado y rotación.
- G: gafetes alternan izquierda/derecha (zigzag) en lugar de escalera.
- J: el talón pasa arriba como tira horizontal perforada.

## 4. Catálogo de ilustraciones SVG (propias)

Trazo `stroke-width: 3` en viewBox 120, `stroke-linecap: round`, `stroke-linejoin: round`, monocromo `--grasa` + **un** acento (`--oxido` o `--mostaza`). Filtro `#trazo-mano`: `feTurbulence baseFrequency .03 numOctaves 2` + `feDisplacementMap scale 2.2`.

| Nombre | Dibujo | Uso |
|---|---|---|
| `llave-cruz` | llave de cruz de 4 bocas en X | hero, logo, 404 |
| `disco-freno` | disco ventilado con barrenos y caliper óxido | Frenos |
| `bujia` | bujía con electrodo y chispa mostaza | Eléctrico |
| `amortiguador` | amortiguador con resorte helicoidal | Suspensión |
| `piston` | pistón con biela y anillos | Motor, logo alterno |
| `bayoneta` | medidor de aceite con gota óxido y marcas MIN/MAX | Mantenimiento |
| `manometro` | manómetro con aguja y zona roja | semáforo, pizarrón |
| `clutch` | disco de clutch con resortes | Transmisión |
| `ventilador` | ventilador de condensador con copo | A/C |
| `llanta` | llanta de perfil con dibujo | Llantas |
| `flecha` | flecha a mano | notas de plumón |
| croquis | calles, manzanas, llantera, parada y una X en óxido (`Croquis.astro`, datos en `site.address.croquis`) | contacto y footer; el mapa de OpenStreetMap solo carga al pedirlo |

## 5. Materiales y texturas

| Material | Técnica | Peso |
|---|---|---|
| Grano de papel | `feTurbulence` en SVG como `data:` URI, `background-blend-mode: multiply`, opacidad .18 | < 1 KB |
| Manchas de grasa / huella | SVG con `feTurbulence` + `feColorMatrix` como `<svg>` decorativo con `aria-hidden` | < 1 KB c/u |
| Borde rasgado | `clip-path: polygon()` con dientes irregulares (12–18 puntos) | CSS |
| Cinta adhesiva | rectángulo `--papel`/`--mostaza` al 55 % con extremos dentados por `clip-path`, rotado ±4–8° | CSS |
| Grapa | dos `::before`/`::after` de 2 px gris acero | CSS |
| Esquina doblada | `linear-gradient` de esquina (solo papel→sombra, no color) | CSS |
| Perforación | `radial-gradient` repetido de círculos `--kraft` | CSS |
| Pegboard | `radial-gradient` repetido de agujeros `--grasa` al 22 % | CSS |
| Gis | texto `--gis` + filtro `#gis` (turbulencia leve) | SVG |
| Fotos | duotono `grayscale + contrast` + capa `--kraft` en `multiply` y `--grasa` en `screen`, recorte `clip-path` irregular, trama `radial-gradient` de puntos encima | CSS |

Reglas: textura siempre por debajo del 20 % de opacidad; máximo **una** mancha de grasa por pantalla; cinta adhesiva solo en notas, la hoja del hero, "Cómo llegar" y los marcos del croquis.

## 6. Notas de plumón (máximo 8)

1. Hero: la hoja de orden llenada a mano (placa, falla, firma).
2. Lista de precios: "incluye filtro ✓".
3. Lista de precios: precio tachado corregido "ya bajó".
4. Pizarrón: "Pruébalo con la placa JAL-482-C" (con filtro de gis).
5. Equipo: "el Chato no presta su matraca".
6. Notas de clientes: el único papelito escrito a mano.
7. FAQ: "Pregunta lo que quieras. Aquí nadie se ríe."
8. Cotizador: "estimado, no es factura".

Lo llenado "con pluma" en formularios y talones usa IBM Plex Mono en tinta `--pluma` (#1F3A7A, azul de pluma de mostrador, 9.6:1 sobre papel), no el plumón.

## 7. Movimiento (solo estos)

| Animación | Dónde | Detalle |
|---|---|---|
| Sello que se estampa | sellos de "Lo que firmamos", sello "REVISIÓN SIN COSTO" del hero, sello del ticket | `scale(1.4) rotate(-8°)` → `scale(1) rotate(var(--r))`, rebote 0.96, sombra 6 px → 1 px; una sola vez |
| Odómetro | pizarrón | rodillos 0–9 por dígito, cada rodillo con distinto retraso y vueltas extra (las unidades giran más) |
| Botón táctil | todos los `.btn` | `:active` → `translate(3px,3px)` y sombra 4 px → 1 px |
| Cinta de precaución | 2 lugares | estática (las franjas no se mueven) |
| Marquee | 1 lugar | 60 s, pausa al pasar el mouse y con `reduced-motion` |

Sin fade-up. Las secciones aparecen como están.

## 8. Lista negra (verificada en `AUDITORIA-DISENO.md`)

Fuentes Inter/Poppins/Manrope/Jakarta/DM Sans/Space Grotesk/Outfit/Geist/Roboto · gradientes de color, glow, blobs, glass · cuadrícula de tarjetas iguales con icono · hero centrado + 2 botones + 3 cifras · pills con puntito · radios 12–24 px · sombras difusas · bordes 1 px gris · iconos Lucide/Heroicons · carrusel de reseñas · fade-up · toggle de tema · frases de agencia · emojis · lorem ipsum · librerías de componentes.
