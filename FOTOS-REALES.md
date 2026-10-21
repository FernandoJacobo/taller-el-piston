# Fotos reales: qué pedirle al taller

Las 5 fotos actuales son de banco (Unsplash) y ya tienen el tratamiento del sitio: escala de grises, mucho contraste y semitono encima. Este diseño no necesita fotos bonitas. Necesita fotos **verdaderas**, tomadas con celular en el taller, con luz de día.

## Lista de tomas

| Archivo | Dónde sale | Qué foto pedir | Cómo tomarla |
|---|---|---|---|
| `stillson.jpg` | Gafete de El Patrón | Su herramienta favorita, sola, sobre el banco de trabajo | Desde arriba, fondo liso (lámina, banco, cartón), que llene el cuadro. Horizontal 4:3 |
| `matraca.jpg` | Gafete de El Chato | La matraca de 1/2" | Igual: desde arriba, fondo liso, horizontal 4:3 |
| `multimetro.jpg` | Gafete de El Profe | El multímetro con la cinta en el cable rojo | Que se lea la carátula. Horizontal 4:3 |
| `manometro.jpg` | Gafete de La Inge | Los manómetros de A/C con el nombre en plumón | De frente, cerca. Horizontal 4:3 |
| `elevador.jpg` | `/contacto`, junto a "Cómo llegar" | Un auto arriba del elevador en la bahía, con el cofre abierto | Desde la entrada de la bahía, a la altura del pecho. Horizontal 3:2 |

### Tomas extra que conviene tener (no se usan todavía)

- La fachada: el portón verde y el rótulo rojo, de frente desde la banqueta de enfrente. Sirve para "Cómo llegar" y para la imagen OG.
- La pieza vieja en su bolsa con el folio. Respalda el sello "Te la devolvemos".
- Una nota real del tablero junto a la caja, con permiso del cliente.

## Reglas

- **No fotos de caras.** Los gafetes muestran la herramienta a propósito. Si el taller quiere caras, que sean en el taller y con ropa de trabajo, nunca de estudio.
- **Nada de fotos de banco** de "mecánico sonriendo con llave". Rompen el concepto.
- Al menos 1600 px por el lado largo. Astro las reduce y las convierte a WebP solo.
- El color no importa porque el sitio las pasa a duotono. Lo que importa es el **contraste**: herramienta oscura sobre fondo claro, o al revés.

## Cómo reemplazarlas

1. Guarda la foto nueva en `src/assets/fotos/` **con el mismo nombre** (`stillson.jpg`, etc.). No hay que tocar código.
2. Si cambias el nombre o agregas una persona, edita `src/data/equipo.ts`: el `import` de arriba, el campo `foto` y el `fotoAlt`. El texto alternativo describe lo que se ve, por ejemplo "Matraca de 1/2 pulgada con mango gastado sobre el banco".
3. `npm run build` y revisa con `npm run qa -- http://localhost:4321 / 390,1440`.

El tratamiento duotono vive en la clase `.foto-duo` de `src/styles/global.css` (escala de grises, contraste 1.35, mezcla *multiply* sobre kraft y semitono de puntos). Se aplica solo a cualquier imagen que esté dentro de un contenedor `.foto-duo`. Si una foto llega a fallar, el contenedor muestra un texto de respaldo en lugar de un hueco.
