/**
 * Configuración central del taller.
 * Para adaptar el sitio a otro taller, edita este archivo y los datos de src/data/.
 * Ningún componente tiene datos de la marca escritos a mano.
 */

export type DayKey = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export interface OpeningSlot {
  /** Hora de apertura en formato 24 h, "HH:MM" */
  open: string;
  /** Hora de cierre en formato 24 h, "HH:MM" */
  close: string;
}

export const site = {
  name: 'Taller Rangel e Hijos',
  /** Palabra que se pinta en el rótulo gigante del footer y en el logo */
  rotulo: 'RANGEL',
  rotuloSub: 'e Hijos',
  legalName: 'Taller Rangel e Hijos — Mecánica en general',
  tagline: 'Mecánica en general desde 1994',
  slogan: 'Primero se revisa; luego se habla de dinero.',
  description:
    'Taller mecánico de barrio en la colonia San Carlos, Guadalajara. Frenos, suspensión, afinación, clutch, A/C y diagnóstico computarizado. Revisión sin costo si la reparación se hace aquí; presupuesto por escrito y garantía de 3 meses.',
  url: 'https://taller-rangel.pages.dev',
  locale: 'es-MX',
  ogLocale: 'es_MX',
  currency: 'MXN',
  timeZone: 'America/Mexico_City',
  foundingYear: 1994,

  contact: {
    phoneDisplay: '33 3826 0194',
    /** Formato E.164 para enlaces tel: */
    phone: '+523338260194',
    /** WhatsApp en formato internacional sin "+" ni espacios (para wa.me) */
    whatsapp: '523338260194',
    email: 'mostrador@taller-rangel-demo.mx',
  },

  address: {
    street: 'Calle Gigantes 1874',
    neighborhood: 'Col. San Carlos',
    city: 'Guadalajara',
    region: 'Jalisco',
    postalCode: '44460',
    country: 'MX',
    reference: 'Entre Gigantes y Calle 46, el portón verde con el rótulo rojo. Si ves la llantera de la esquina, ya te pasaste.',
    parking: 'Cabemos 6 autos adentro mientras esperas tu diagnóstico. Sobre la calle hay lugar casi siempre después de las 10 a. m.',
    transit: 'Si dejas el auto y te vas: la parada de camión de Av. Revolución está a dos cuadras.',
  },

  geo: { lat: 20.6554, lng: -103.3297 },

  /** Horario semanal. Un arreglo vacío = cerrado. */
  hours: {
    lun: [{ open: '08:30', close: '18:30' }],
    mar: [{ open: '08:30', close: '18:30' }],
    mie: [{ open: '08:30', close: '18:30' }],
    jue: [{ open: '08:30', close: '18:30' }],
    vie: [{ open: '08:30', close: '18:30' }],
    sab: [{ open: '09:00', close: '14:00' }],
    dom: [],
  } satisfies Record<DayKey, OpeningSlot[]>,

  /** Grúa propia (ficticia) */
  grua: {
    label: 'Grúa de plataforma',
    detail: 'Dentro de Guadalajara y Zapopan: $650 fijo. Gratis si la reparación pasa de $5,000.',
  },

  /** Número que muestra el odómetro del pizarrón */
  autosRevisados: 12480,
  garantia: { meses: 3, km: 5000 },

  payments: 'Efectivo, tarjeta (débito y crédito) y transferencia. Factura en el momento.',

  nav: [
    { label: 'Diagnóstico', href: '/#diagnostico' },
    { label: 'Precios', href: '/servicios' },
    { label: 'Cotizador', href: '/presupuesto' },
    { label: 'Mi auto', href: '/seguimiento' },
    { label: 'Contacto', href: '/contacto' },
  ],

  credit: { label: 'Demo desarrollado por JacoboDev', href: 'https://jacobodev.pages.dev', display: 'jacobodev.pages.dev' },
  demoNotice: 'Sitio de demostración: el taller, los mecánicos, los precios, las órdenes y las reseñas son ficticios.',
} as const;

export const dayLabels: Record<DayKey, string> = {
  lun: 'Lunes',
  mar: 'Martes',
  mie: 'Miércoles',
  jue: 'Jueves',
  vie: 'Viernes',
  sab: 'Sábado',
  dom: 'Domingo',
};

export const dayShort: Record<DayKey, string> = {
  lun: 'LUN',
  mar: 'MAR',
  mie: 'MIÉ',
  jue: 'JUE',
  vie: 'VIE',
  sab: 'SÁB',
  dom: 'DOM',
};

export const dayOrder: DayKey[] = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

export const fullAddress = `${site.address.street}, ${site.address.neighborhood}, ${site.address.postalCode} ${site.address.city}, ${site.address.region}`;

export const mapEmbedUrl = `https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=16&output=embed`;
export const mapLinkUrl = `https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat},${site.geo.lng}`;

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${site.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const mailtoUrl = (subject: string, body: string) =>
  `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const formatMXN = (amount: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(amount);

/** "18:30" → "6:30 p. m." (formato de México; igual en el servidor y en el navegador). */
export const formatTime = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`;
};
