/**
 * Orden de servicio: validación y mensaje de WhatsApp. Funciones puras (tests/orden.test.ts).
 */
export interface DatosOrden {
  placa: string;
  marca: string;
  modelo: string;
  anio: string;
  km: string;
  falla: string;
  horario: string;
  nombre: string;
  telefono: string;
}

export type Errores = Partial<Record<keyof DatosOrden, string>>;

export const horarios = [
  'Mañana (8:30 a 12:00)',
  'Mediodía (12:00 a 15:00)',
  'Tarde (15:00 a 18:30)',
  'Sábado (9:00 a 14:00)',
  'Lo antes posible',
] as const;

const soloDigitos = (s: string) => s.replace(/\D/g, '');

export function validarOrden(d: DatosOrden, anioActual = new Date().getFullYear()): Errores {
  const e: Errores = {};
  const placa = d.placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (placa.length < 5 || placa.length > 8) e.placa = 'Escribe la placa completa (de 5 a 8 letras y números).';
  if (!d.marca.trim()) e.marca = '¿Qué marca es?';
  if (!d.modelo.trim()) e.modelo = '¿Qué modelo?';
  const anio = Number(d.anio);
  if (!/^\d{4}$/.test(d.anio.trim()) || anio < 1960 || anio > anioActual + 1) e.anio = `Un año entre 1960 y ${anioActual + 1}.`;
  if (d.km.trim() && !/^\d{1,7}$/.test(soloDigitos(d.km))) e.km = 'Solo números, sin puntos.';
  if (d.falla.trim().length < 8) e.falla = 'Cuéntanos un poco más: qué hace, cuándo y desde cuándo.';
  if (!d.horario.trim()) e.horario = 'Elige un horario.';
  if (d.nombre.trim().length < 3) e.nombre = 'Firma con tu nombre.';
  if (soloDigitos(d.telefono).length !== 10) e.telefono = 'Teléfono a 10 dígitos.';
  return e;
}

export const miles = (n: number) => new Intl.NumberFormat('es-MX').format(n);

export function mensajeOrden(d: DatosOrden, folio: string) {
  const km = soloDigitos(d.km);
  return [
    `*ORDEN DE SERVICIO N.º ${folio}*`,
    '',
    `Placa: ${d.placa.toUpperCase().trim()}`,
    `Auto: ${d.marca.trim()} ${d.modelo.trim()} ${d.anio.trim()}`,
    km ? `Kilometraje: ${miles(Number(km))} km` : null,
    `Falla: ${d.falla.trim()}`,
    `Horario preferido: ${d.horario}`,
    '',
    `Firma: ${d.nombre.trim()}`,
    `Tel.: ${soloDigitos(d.telefono)}`,
  ]
    .filter((l) => l !== null)
    .join('\n');
}

/** Folio de 4 dígitos derivado de la fecha: cambia cada minuto, legible en mostrador. */
export function folioDelMomento(fecha = new Date()) {
  const n = (fecha.getMonth() * 31 + fecha.getDate()) * 1440 + fecha.getHours() * 60 + fecha.getMinutes();
  return String(n % 9000 + 1000);
}
