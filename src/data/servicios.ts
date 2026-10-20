/**
 * Lista de precios del taller.
 * Los montos son la base para un auto COMPACTO con refacción EQUIVALENTE; el cotizador
 * (src/lib/cotizador.ts) aplica los factores por tipo de vehículo y de refacción.
 * El "desde $" de la pared se calcula con el caso más barato (compacto + económica).
 */
import type { IlustracionNombre } from '@/data/ilustraciones';

export type SistemaId =
  | 'mantenimiento'
  | 'frenos'
  | 'suspension'
  | 'motor'
  | 'transmision'
  | 'electrico'
  | 'aire'
  | 'llantas';

export interface Sistema {
  id: SistemaId;
  nombre: string;
  /** Nombre corto para filtros */
  corto: string;
  ilustracion: IlustracionNombre;
  /** Una línea con voz de taller */
  dicho: string;
}

export interface Servicio {
  id: string;
  sistema: SistemaId;
  nombre: string;
  /** Refacciones base (MXN, compacto, equivalente). 0 = solo mano de obra */
  refaccion: number;
  /** Mano de obra base (MXN, compacto) */
  manoObra: number;
  /** Horas de trabajo base (compacto) */
  horas: number;
  incluye: string[];
  garantia: string;
  cuando: string;
  /** Posición en la lista de "los más pedidos" del inicio (1 = el que más sale) */
  top?: number;
  /** Nota de plumón junto a la fila en la pared */
  nota?: string;
  /** Precio anterior tachado (bajó de precio) */
  antes?: number;
}

export const sistemas: Sistema[] = [
  { id: 'mantenimiento', nombre: 'Mantenimiento', corto: 'Mantenimiento', ilustracion: 'bayoneta', dicho: 'Lo que evita el 80 % de las visitas de emergencia.' },
  { id: 'frenos', nombre: 'Frenos', corto: 'Frenos', ilustracion: 'disco-freno', dicho: 'Aquí no se ahorra. Pero tampoco se cambia lo que sirve.' },
  { id: 'suspension', nombre: 'Suspensión y dirección', corto: 'Suspensión', ilustracion: 'amortiguador', dicho: 'Los topes de Guadalajara cobran caro. Esto es lo que cobran.' },
  { id: 'motor', nombre: 'Motor', corto: 'Motor', ilustracion: 'piston', dicho: 'Antes de abrir un motor, te decimos por qué y cuánto.' },
  { id: 'transmision', nombre: 'Transmisión y clutch', corto: 'Clutch', ilustracion: 'clutch', dicho: 'Si patina, huele o truena al meter velocidad, es aquí.' },
  { id: 'electrico', nombre: 'Eléctrico y diagnóstico computarizado', corto: 'Eléctrico', ilustracion: 'bujia', dicho: 'El escáner dice el código. El mecánico dice la falla.' },
  { id: 'aire', nombre: 'Aire acondicionado', corto: 'A/C', ilustracion: 'ventilador', dicho: 'En mayo no hay cita. Revísalo en marzo.' },
  { id: 'llantas', nombre: 'Llantas y alineación', corto: 'Llantas', ilustracion: 'llanta', dicho: 'Si el volante no está derecho, tu llanta tampoco.' },
];

const g3 = 'Garantía 3 meses o 5,000 km';

export const servicios: Servicio[] = [
  // ─── Mantenimiento ───
  {
    id: 'cambio-aceite',
    sistema: 'mantenimiento',
    nombre: 'Cambio de aceite y filtro',
    refaccion: 760,
    manoObra: 180,
    horas: 0.5,
    incluye: ['Hasta 4.5 L de aceite sintético 5W-30', 'Filtro de aceite', 'Revisión de niveles y presión de llantas'],
    garantia: 'Sin fugas por 3 meses',
    cuando: 'Cada 10,000 km o 6 meses con sintético; cada 5,000 km con mineral.',
    top: 1,
    nota: 'incluye filtro ✓',
  },
  {
    id: 'afinacion-menor',
    sistema: 'mantenimiento',
    nombre: 'Afinación menor',
    refaccion: 640,
    manoObra: 420,
    horas: 1.5,
    incluye: ['Aceite y filtro de aceite', 'Filtro de aire', 'Limpieza de cuerpo de aceleración', 'Escaneo de códigos'],
    garantia: g3,
    cuando: 'A la mitad entre afinaciones mayores, o si tu auto casi no sale a carretera.',
    top: 3,
  },
  {
    id: 'afinacion-mayor',
    sistema: 'mantenimiento',
    nombre: 'Afinación mayor',
    refaccion: 1050,
    manoObra: 640,
    horas: 3,
    incluye: ['4 bujías', 'Aceite, filtro de aceite, aire y gasolina', 'Limpieza de inyectores en banco', 'Limpieza de cuerpo de aceleración', 'Escaneo antes y después'],
    garantia: g3,
    cuando: 'Cada 20,000 km, o si tironea, consume de más o tarda en arrancar en frío.',
    top: 2,
    antes: 1590,
  },
  {
    id: 'revision-40',
    sistema: 'mantenimiento',
    nombre: 'Revisión de 40 puntos',
    refaccion: 0,
    manoObra: 350,
    horas: 1,
    incluye: ['Frenos, suspensión, fugas, bandas, mangueras, luces y batería', 'Reporte por escrito con fotos', 'Sin costo si haces la reparación aquí'],
    garantia: 'Es una revisión: no aplica',
    cuando: 'Antes de salir a carretera o antes de comprar un auto usado.',
  },
  {
    id: 'anticongelante',
    sistema: 'mantenimiento',
    nombre: 'Cambio de anticongelante',
    refaccion: 420,
    manoObra: 260,
    horas: 1,
    incluye: ['Drenado y lavado del sistema', 'Hasta 5 L de anticongelante', 'Purga de aire'],
    garantia: g3,
    cuando: 'Cada 2 años o 40,000 km. Antes, si el líquido se ve café.',
  },
  {
    id: 'banda-accesorios',
    sistema: 'mantenimiento',
    nombre: 'Banda de accesorios',
    refaccion: 520,
    manoObra: 340,
    horas: 1,
    incluye: ['Banda nueva', 'Revisión de tensor y poleas'],
    garantia: g3,
    cuando: 'Si chilla al arrancar en frío o se ve cuarteada.',
  },

  // ─── Frenos ───
  {
    id: 'balatas-delanteras',
    sistema: 'frenos',
    nombre: 'Balatas delanteras',
    refaccion: 760,
    manoObra: 440,
    horas: 1.5,
    incluye: ['Juego de balatas cerámicas', 'Limpieza y lubricación de calipers', 'Medición de discos (te decimos el grosor)'],
    garantia: g3,
    cuando: 'Cuando chillan al frenar o el testigo de desgaste ya toca el disco.',
    top: 4,
  },
  {
    id: 'balatas-traseras',
    sistema: 'frenos',
    nombre: 'Balatas o zapatas traseras',
    refaccion: 690,
    manoObra: 500,
    horas: 1.75,
    incluye: ['Juego de balatas o zapatas', 'Ajuste de freno de mano', 'Limpieza de tambores o calipers'],
    garantia: g3,
    cuando: 'Más o menos cada segundo cambio de las delanteras.',
  },
  {
    id: 'rectificado-discos',
    sistema: 'frenos',
    nombre: 'Rectificado de discos (par)',
    refaccion: 0,
    manoObra: 520,
    horas: 1,
    incluye: ['Rectificado en torno de los 2 discos', 'Medición antes y después'],
    garantia: g3,
    cuando: 'Si el pedal o el volante vibran al frenar y el disco todavía tiene grosor.',
    top: 5,
  },
  {
    id: 'discos-nuevos',
    sistema: 'frenos',
    nombre: 'Discos nuevos (par)',
    refaccion: 1380,
    manoObra: 440,
    horas: 1.5,
    incluye: ['2 discos', 'Limpieza de mazas', 'Asentamiento de balatas'],
    garantia: g3,
    cuando: 'Cuando el disco ya no da el grosor mínimo para rectificar. Te enseñamos la medida.',
  },
  {
    id: 'liquido-frenos',
    sistema: 'frenos',
    nombre: 'Cambio de líquido y purga',
    refaccion: 220,
    manoObra: 340,
    horas: 1,
    incluye: ['Líquido DOT 4', 'Purga de las 4 ruedas'],
    garantia: g3,
    cuando: 'Cada 2 años, o si el pedal se siente esponjoso.',
  },

  // ─── Suspensión y dirección ───
  {
    id: 'amortiguadores-delanteros',
    sistema: 'suspension',
    nombre: 'Amortiguadores delanteros (par)',
    refaccion: 2500,
    manoObra: 880,
    horas: 2.5,
    incluye: ['2 amortiguadores', 'Bases y topes si vienen dañados (se cotizan aparte)', 'Alineación de cortesía'],
    garantia: g3,
    cuando: 'Si el auto rebota después de un tope o "clava" la nariz al frenar.',
    top: 9,
  },
  {
    id: 'horquillas',
    sistema: 'suspension',
    nombre: 'Horquillas o bujes',
    refaccion: 1180,
    manoObra: 780,
    horas: 2.5,
    incluye: ['Par de horquillas o juego de bujes', 'Alineación de cortesía'],
    garantia: g3,
    cuando: 'Golpeteo en topes o la llanta se gasta de un solo lado.',
  },
  {
    id: 'terminales',
    sistema: 'suspension',
    nombre: 'Terminales de dirección',
    refaccion: 640,
    manoObra: 480,
    horas: 1.5,
    incluye: ['Par de terminales', 'Alineación de cortesía'],
    garantia: g3,
    cuando: 'Juego en el volante o el auto se va de lado.',
  },
  {
    id: 'rotulas',
    sistema: 'suspension',
    nombre: 'Rótulas',
    refaccion: 700,
    manoObra: 580,
    horas: 2,
    incluye: ['Par de rótulas', 'Revisión de guardapolvos'],
    garantia: g3,
    cuando: 'Si truena al dar vuelta con el volante todo girado.',
  },

  // ─── Motor ───
  {
    id: 'banda-distribucion',
    sistema: 'motor',
    nombre: 'Kit de distribución',
    refaccion: 2350,
    manoObra: 2150,
    horas: 5,
    incluye: ['Banda, tensor y polea loca', 'Retenes de árbol de levas y cigüeñal', 'Revisión de bomba de agua'],
    garantia: g3,
    cuando: 'Según el manual (casi siempre entre 60,000 y 100,000 km). Si se rompe, el motor se puede dañar.',
  },
  {
    id: 'bomba-agua',
    sistema: 'motor',
    nombre: 'Bomba de agua',
    refaccion: 940,
    manoObra: 880,
    horas: 2.5,
    incluye: ['Bomba y empaque', 'Anticongelante nuevo'],
    garantia: g3,
    cuando: 'Fuga de anticongelante en la parte del frente o ruido de balero.',
  },
  {
    id: 'termostato',
    sistema: 'motor',
    nombre: 'Termostato y mangueras',
    refaccion: 480,
    manoObra: 440,
    horas: 1.5,
    incluye: ['Termostato con empaque', 'Revisión de mangueras y abrazaderas', 'Purga del sistema'],
    garantia: g3,
    cuando: 'Si la aguja de temperatura sube y baja, o la calefacción no calienta.',
  },
  {
    id: 'empaque-cabeza',
    sistema: 'motor',
    nombre: 'Empaque de cabeza',
    refaccion: 1800,
    manoObra: 4100,
    horas: 10,
    incluye: ['Juego de empaques', 'Rectificado de cabeza (planeado)', 'Aceite y anticongelante nuevos', 'Prueba de compresión'],
    garantia: g3,
    cuando: 'Humo blanco con olor dulce, se consume el anticongelante o el aceite se ve como café con leche.',
  },
  {
    id: 'inyectores',
    sistema: 'motor',
    nombre: 'Limpieza de inyectores por ultrasonido',
    refaccion: 240,
    manoObra: 720,
    horas: 2,
    incluye: ['Prueba de caudal antes y después', 'Ligas y filtros de inyector'],
    garantia: g3,
    cuando: 'Si se jalonea en baja o subió el consumo sin razón.',
  },

  // ─── Transmisión y clutch ───
  {
    id: 'kit-clutch',
    sistema: 'transmision',
    nombre: 'Kit de clutch',
    refaccion: 3150,
    manoObra: 2550,
    horas: 6,
    incluye: ['Disco, plato y collarín', 'Rectificado de volante', 'Aceite de transmisión'],
    garantia: g3,
    cuando: 'Si patina en subida, el pedal se siente alto o huele a quemado.',
    top: 10,
  },
  {
    id: 'aceite-automatica',
    sistema: 'transmision',
    nombre: 'Aceite de transmisión automática',
    refaccion: 1280,
    manoObra: 440,
    horas: 1.5,
    incluye: ['Aceite ATF especificado', 'Filtro y empaque de cárter cuando aplica', 'Escaneo de transmisión'],
    garantia: g3,
    cuando: 'Cada 60,000 km, o si los cambios entran duros.',
  },
  {
    id: 'soportes',
    sistema: 'transmision',
    nombre: 'Soportes de motor y transmisión',
    refaccion: 920,
    manoObra: 600,
    horas: 2,
    incluye: ['Soporte dañado (te enseñamos cuál)', 'Revisión de los demás'],
    garantia: g3,
    cuando: 'Golpe seco al meter reversa o vibración en ralentí.',
  },

  // ─── Eléctrico y diagnóstico ───
  {
    id: 'diagnostico-computarizado',
    sistema: 'electrico',
    nombre: 'Diagnóstico computarizado',
    refaccion: 0,
    manoObra: 450,
    horas: 1,
    incluye: ['Escaneo de todos los módulos', 'Lectura de datos en vivo y prueba de manejo', 'Reporte de qué falla y qué no'],
    garantia: 'Sin costo si haces la reparación aquí',
    cuando: 'Cuando prende la luz de check engine o cualquier testigo del tablero.',
    top: 7,
  },
  {
    id: 'bateria',
    sistema: 'electrico',
    nombre: 'Batería con instalación',
    refaccion: 2050,
    manoObra: 80,
    horas: 0.3,
    incluye: ['Batería nueva', 'Prueba de alternador y marcha', 'Recibimos la vieja'],
    garantia: 'Garantía del fabricante (12 a 24 meses)',
    cuando: 'Si tarda en arrancar en las mañanas o tiene más de 3 años.',
  },
  {
    id: 'alternador',
    sistema: 'electrico',
    nombre: 'Reparación de alternador',
    refaccion: 1080,
    manoObra: 680,
    horas: 2.5,
    incluye: ['Regulador, carbones o baleros según falla', 'Prueba de carga'],
    garantia: g3,
    cuando: 'Se prende el testigo de batería o las luces bajan de intensidad.',
  },
  {
    id: 'marcha',
    sistema: 'electrico',
    nombre: 'Reparación de marcha',
    refaccion: 1280,
    manoObra: 640,
    horas: 2,
    incluye: ['Bendix, automático o carbones según falla', 'Prueba en banco'],
    garantia: g3,
    cuando: 'Si al dar marcha solo hace "clic".',
  },

  // ─── Aire acondicionado ───
  {
    id: 'carga-gas',
    sistema: 'aire',
    nombre: 'Carga de gas del A/C',
    refaccion: 440,
    manoObra: 380,
    horas: 1,
    incluye: ['Vacío del sistema', 'Gas R-134a o R-1234yf según tu auto', 'Prueba de fugas', 'Temperatura de salida por escrito'],
    garantia: 'Si se fuga en 30 días, lo revisamos sin costo',
    cuando: 'Si enfría poco. Si dejó de enfriar de golpe, hay fuga: no basta con cargar.',
    top: 8,
  },
  {
    id: 'fugas-ac',
    sistema: 'aire',
    nombre: 'Detección de fugas con tinte UV',
    refaccion: 120,
    manoObra: 380,
    horas: 1,
    incluye: ['Tinte y lámpara UV', 'Foto de la fuga'],
    garantia: 'Es un diagnóstico: no aplica',
    cuando: 'Antes de cargar gas por segunda vez en el año.',
  },
  {
    id: 'compresor',
    sistema: 'aire',
    nombre: 'Compresor de A/C',
    refaccion: 5150,
    manoObra: 1550,
    horas: 4,
    incluye: ['Compresor', 'Válvula de expansión y filtro deshidratador', 'Aceite, vacío y carga'],
    garantia: g3,
    cuando: 'Si el compresor no embraga o hace ruido metálico al encender el A/C.',
  },
  {
    id: 'filtro-cabina',
    sistema: 'aire',
    nombre: 'Filtro de cabina',
    refaccion: 220,
    manoObra: 80,
    horas: 0.3,
    incluye: ['Filtro de cabina', 'Aplicación de sanitizante'],
    garantia: 'No aplica',
    cuando: 'Cada 15,000 km o si huele a humedad al prender el aire.',
  },

  // ─── Llantas y alineación ───
  {
    id: 'alineacion-balanceo',
    sistema: 'llantas',
    nombre: 'Alineación y balanceo',
    refaccion: 80,
    manoObra: 560,
    horas: 1.25,
    incluye: ['Alineación computarizada', 'Balanceo de 4 llantas con pesas', 'Hoja con medidas antes y después'],
    garantia: 'Reajuste sin costo en 30 días',
    cuando: 'Cada 10,000 km, cuando cambias llantas o después de un buen hoyo.',
    top: 6,
  },
  {
    id: 'rotacion',
    sistema: 'llantas',
    nombre: 'Rotación de llantas',
    refaccion: 0,
    manoObra: 150,
    horas: 0.5,
    incluye: ['Rotación cruzada', 'Calibración de presión'],
    garantia: 'No aplica',
    cuando: 'Cada 10,000 km para que se gasten parejo.',
  },
  {
    id: 'ponchadura',
    sistema: 'llantas',
    nombre: 'Reparación de ponchadura',
    refaccion: 40,
    manoObra: 110,
    horas: 0.5,
    incluye: ['Parche por dentro (no solo taquete)', 'Balanceo de esa llanta'],
    garantia: 'Mientras dure la llanta',
    cuando: 'Si el clavo está en la banda de rodamiento. En el costado, no se repara: se cambia.',
  },
];

export const servicioPorId = (id: string) => servicios.find((s) => s.id === id);

export const losMasPedidos = servicios
  .filter((s) => s.top)
  .sort((a, b) => (a.top ?? 99) - (b.top ?? 99));
