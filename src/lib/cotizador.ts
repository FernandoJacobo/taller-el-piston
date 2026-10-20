/**
 * Cotizador "nota de taller". Funciones puras: no tocan el DOM ni el almacenamiento.
 * Probadas en tests/cotizador.test.ts.
 */
import type { Servicio } from '@/data/servicios';

export type Vehiculo = 'compacto' | 'sedan' | 'suv' | 'pickup';
export type Refaccion = 'original' | 'equivalente' | 'economica';

export interface FactorVehiculo {
  nombre: string;
  ejemplo: string;
  refaccion: number;
  manoObra: number;
  tiempo: number;
}

export const vehiculos: Record<Vehiculo, FactorVehiculo> = {
  compacto: { nombre: 'Compacto', ejemplo: 'Aveo, March, Spark', refaccion: 1, manoObra: 1, tiempo: 1 },
  sedan: { nombre: 'Sedán', ejemplo: 'Versa, Jetta, Corolla', refaccion: 1.15, manoObra: 1.1, tiempo: 1.1 },
  suv: { nombre: 'SUV', ejemplo: 'CR-V, Tiguan, X-Trail', refaccion: 1.4, manoObra: 1.25, tiempo: 1.2 },
  pickup: { nombre: 'Pickup', ejemplo: 'NP300, Hilux, Ranger', refaccion: 1.55, manoObra: 1.3, tiempo: 1.25 },
};

export const refacciones: Record<Refaccion, { nombre: string; detalle: string; factor: number }> = {
  original: { nombre: 'Original', detalle: 'De agencia, con la marca del fabricante.', factor: 1.45 },
  equivalente: { nombre: 'Equivalente', detalle: 'Marca de primer equipo. La que usamos casi siempre.', factor: 1 },
  economica: { nombre: 'Económica', detalle: 'Funciona, pero dura menos. Te lo decimos claro.', factor: 0.75 },
};

export const IVA = 0.16;

/** Redondea a la decena, como se cobra en mostrador. */
export const redondear = (n: number) => Math.round(n / 10) * 10;

export interface Partida {
  id: string;
  nombre: string;
  refaccion: number;
  manoObra: number;
  horas: number;
}

export function partida(servicio: Servicio, vehiculo: Vehiculo, refaccion: Refaccion): Partida {
  const v = vehiculos[vehiculo];
  return {
    id: servicio.id,
    nombre: servicio.nombre,
    refaccion: redondear(servicio.refaccion * v.refaccion * refacciones[refaccion].factor),
    manoObra: redondear(servicio.manoObra * v.manoObra),
    horas: Math.round(servicio.horas * v.tiempo * 4) / 4,
  };
}

/** Precio "desde $" de la lista de la pared: compacto con refacción económica. */
export function precioDesde(servicio: Servicio) {
  const p = partida(servicio, 'compacto', 'economica');
  return p.refaccion + p.manoObra;
}

/** Precio más alto razonable: pickup con refacción original (para rangos). */
export function precioHasta(servicio: Servicio) {
  const p = partida(servicio, 'pickup', 'original');
  return p.refaccion + p.manoObra;
}

export interface Cotizacion {
  partidas: Partida[];
  refacciones: number;
  manoObra: number;
  subtotal: number;
  iva: number;
  total: number;
  horas: number;
  /** Días hábiles estimados (jornada de 7 h de bahía) */
  dias: number;
}

export function cotizar(
  servicios: readonly Servicio[],
  vehiculo: Vehiculo,
  refaccion: Refaccion,
  conIva: boolean,
): Cotizacion {
  const partidas = servicios.map((s) => partida(s, vehiculo, refaccion));
  const refaccionesTotal = partidas.reduce((a, p) => a + p.refaccion, 0);
  const manoObra = partidas.reduce((a, p) => a + p.manoObra, 0);
  const subtotal = refaccionesTotal + manoObra;
  const iva = conIva ? Math.round(subtotal * IVA) : 0;
  const horas = partidas.reduce((a, p) => a + p.horas, 0);
  return {
    partidas,
    refacciones: refaccionesTotal,
    manoObra,
    subtotal,
    iva,
    total: subtotal + iva,
    horas,
    dias: horas === 0 ? 0 : Math.ceil(horas / 7),
  };
}

/** "1 h 30 min", "45 min", "6 h" */
export function formatoHoras(horas: number) {
  const total = Math.round(horas * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/** Texto de entrega: "Hoy mismo" si cabe en la jornada, si no "N días hábiles". */
export function formatoEntrega(c: Cotizacion) {
  if (c.horas === 0) return '—';
  if (c.horas <= 5) return 'El mismo día';
  return c.dias === 1 ? '1 día hábil' : `${c.dias} días hábiles`;
}
