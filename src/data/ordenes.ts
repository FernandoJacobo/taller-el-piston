/**
 * Órdenes de demostración para /seguimiento. Las horas son relativas al momento en que
 * se abre la página (minutos hacia atrás), para que el pizarrón siempre se vea "de hoy".
 */
import type { IlustracionNombre } from '@/data/ilustraciones';

export type EstadoId = 'recibido' | 'diagnostico' | 'autorizacion' | 'reparacion' | 'listo';

export interface Evento {
  /** Minutos antes de "ahora" */
  hace: number;
  estado: EstadoId;
  nota: string;
}

export interface Concepto {
  concepto: string;
  refaccion: number;
  manoObra: number;
}

export interface OrdenDemo {
  folio: string;
  placa: string;
  auto: string;
  color: string;
  km: number;
  cliente: string;
  mecanico: string;
  falla: string;
  estado: EstadoId;
  historial: Evento[];
  notasMecanico: string[];
  piezas: string[];
  fotos: { ilustracion: IlustracionNombre; pie: string }[];
  presupuesto: Concepto[];
  /** Si el presupuesto ya estaba autorizado al abrir la demo */
  autorizado: boolean;
  /** Días hábiles a partir de hoy para la entrega estimada */
  entregaEnDias: number;
  horaEntrega: string;
}

export const estados: { id: EstadoId; nombre: string; corto: string }[] = [
  { id: 'recibido', nombre: 'Recibido', corto: 'Recibido' },
  { id: 'diagnostico', nombre: 'Diagnóstico', corto: 'Diagnóstico' },
  { id: 'autorizacion', nombre: 'Esperando autorización', corto: 'Autorización' },
  { id: 'reparacion', nombre: 'En reparación', corto: 'Reparación' },
  { id: 'listo', nombre: 'Listo para entregar', corto: 'Listo' },
];

export const ordenesDemo: OrdenDemo[] = [
  {
    folio: '2417',
    placa: 'JAL-482-C',
    auto: 'Sedán 2014 · 4 cilindros',
    color: 'Gris plata',
    km: 148_320,
    cliente: 'Mariana T.',
    mecanico: 'El Chato',
    falla: 'Rechina al frenar y vibra el pedal en bajada.',
    estado: 'autorizacion',
    historial: [
      { hace: 230, estado: 'recibido', nota: 'Entra con 1/4 de tanque. Rayón previo en defensa trasera (foto en expediente).' },
      { hace: 175, estado: 'diagnostico', nota: 'Prueba de manejo: vibra al frenar arriba de 60 km/h.' },
      { hace: 95, estado: 'autorizacion', nota: 'Presupuesto enviado por WhatsApp. Esperamos tu OK para empezar.' },
    ],
    notasMecanico: [
      'Balatas delanteras en 2 mm. Ya tocan el testigo.',
      'Discos con 21.4 mm: sí se pueden rectificar (mínimo 20 mm). No hace falta cambiarlos.',
      'Traseras al 60 %. Aguantan otros 15,000 km; no las cambies todavía.',
    ],
    piezas: [],
    fotos: [
      { ilustracion: 'disco-freno', pie: 'Disco delantero izq. con marcas de calor' },
      { ilustracion: 'manometro', pie: 'Calibrador: 21.4 mm' },
    ],
    presupuesto: [
      { concepto: 'Balatas delanteras cerámicas', refaccion: 870, manoObra: 480 },
      { concepto: 'Rectificado de discos (par)', refaccion: 0, manoObra: 570 },
    ],
    autorizado: false,
    entregaEnDias: 0,
    horaEntrega: '17:30',
  },
  {
    folio: '2418',
    placa: 'JKL-305-A',
    auto: 'Pickup 2019 · doble cabina',
    color: 'Blanco',
    km: 92_100,
    cliente: 'Don Arturo V.',
    mecanico: 'El Profe',
    falla: 'Prendió el check engine y se jalonea en baja.',
    estado: 'diagnostico',
    historial: [
      { hace: 80, estado: 'recibido', nota: 'Entra con grúa propia. Testigo de check engine fijo.' },
      { hace: 35, estado: 'diagnostico', nota: 'Conectado al escáner: código P0302 (falla de encendido, cilindro 2).' },
    ],
    notasMecanico: ['Revisando bobina y bujía del cilindro 2. Si es la bobina, se cambia solo esa.'],
    piezas: [],
    fotos: [{ ilustracion: 'bujia', pie: 'Bujía cilindro 2: electrodo con carbón' }],
    presupuesto: [],
    autorizado: false,
    entregaEnDias: 1,
    horaEntrega: '13:00',
  },
  {
    folio: '2409',
    placa: 'JHT-917-B',
    auto: 'SUV 2017 · automática',
    color: 'Rojo',
    km: 121_870,
    cliente: 'Sofía R.',
    mecanico: 'El Patrón',
    falla: 'Se calentó en Periférico. Llegó con la aguja arriba.',
    estado: 'reparacion',
    historial: [
      { hace: 1520, estado: 'recibido', nota: 'Recibido con grúa. Sin anticongelante en el depósito.' },
      { hace: 1460, estado: 'diagnostico', nota: 'Prueba de presión: fuga en la bomba de agua. Cabeza sin daño (prueba de compresión OK).' },
      { hace: 1390, estado: 'autorizacion', nota: 'Presupuesto enviado con foto de la fuga.' },
      { hace: 1310, estado: 'reparacion', nota: 'Autorizado por la clienta. Pedimos bomba equivalente; llega mañana 9 a. m.' },
      { hace: 120, estado: 'reparacion', nota: 'Bomba instalada. Purgando sistema y probando en ralentí 40 min.' },
    ],
    notasMecanico: ['Te guardamos la bomba vieja en una bolsa con tu folio.', 'El termostato está bien; no se cambió.'],
    piezas: ['Bomba de agua equivalente', 'Empaque de bomba', '5 L de anticongelante'],
    fotos: [
      { ilustracion: 'piston', pie: 'Prueba de compresión: 4 cilindros parejos' },
      { ilustracion: 'manometro', pie: 'Presión del sistema: 15 psi sin caída' },
    ],
    presupuesto: [
      { concepto: 'Bomba de agua', refaccion: 1300, manoObra: 1100 },
      { concepto: 'Anticongelante (5 L)', refaccion: 590, manoObra: 0 },
    ],
    autorizado: true,
    entregaEnDias: 0,
    horaEntrega: '18:00',
  },
  {
    folio: '2402',
    placa: 'JNB-226-D',
    auto: 'Compacto 2012 · estándar',
    color: 'Azul',
    km: 203_450,
    cliente: 'Toño G.',
    mecanico: 'La Inge',
    falla: 'El A/C no enfría.',
    estado: 'listo',
    historial: [
      { hace: 410, estado: 'recibido', nota: 'Recibido. Salida de aire a 19 °C.' },
      { hace: 370, estado: 'diagnostico', nota: 'Tinte UV: fuga en el o-ring de la válvula de servicio.' },
      { hace: 330, estado: 'autorizacion', nota: 'Presupuesto enviado.' },
      { hace: 300, estado: 'reparacion', nota: 'Autorizado. Cambio de o-ring, vacío 30 min y carga.' },
      { hace: 45, estado: 'listo', nota: 'Salida de aire a 5 °C. Listo para recoger.' },
    ],
    notasMecanico: ['El compresor está sano. No dejes que te lo vendan.', 'Cambia el filtro de cabina en tu próximo servicio: ya está gris.'],
    piezas: ['O-ring de válvula de servicio', 'Gas R-134a (450 g)'],
    fotos: [{ ilustracion: 'ventilador', pie: 'Termómetro en la rejilla: 5 °C' }],
    presupuesto: [
      { concepto: 'Detección de fugas con tinte UV', refaccion: 120, manoObra: 380 },
      { concepto: 'O-ring y carga de gas', refaccion: 480, manoObra: 380 },
    ],
    autorizado: true,
    entregaEnDias: 0,
    horaEntrega: '15:00',
  },
];
