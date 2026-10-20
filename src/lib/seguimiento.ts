/**
 * Estado del pizarrón "Así va tu auto". Funciones puras: el script de la página
 * solo lee/escribe localStorage y pinta. Probadas en tests/seguimiento.test.ts.
 */
import { estados, type EstadoId, type OrdenDemo } from '@/data/ordenes';
import { IVA } from '@/lib/cotizador';

export const CLAVE_DEMO = 'rangel:seguimiento:v1';

/** Lo único que se guarda en localStorage */
export interface EstadoDemo {
  /** Momento (ms) en que se abrió la demo por primera vez: ancla las horas del historial */
  inicio: number;
  /** placa normalizada → momento (ms) en que se autorizó el presupuesto */
  autorizaciones: Record<string, number>;
}

export interface EventoReal {
  en: number;
  estado: EstadoId;
  nota: string;
}

export interface OrdenVista extends Omit<OrdenDemo, 'historial'> {
  historial: EventoReal[];
  /** 0 = recibido … 4 = listo */
  paso: number;
  puedeAutorizar: boolean;
  entrega: number;
}

/** "jal 482c", "JAL-482-C" y "jal482c" son la misma placa. */
export const normalizarPlaca = (placa: string) => placa.toUpperCase().replace(/[^A-Z0-9]/g, '');

export const pasoDe = (estado: EstadoId) => estados.findIndex((e) => e.id === estado);

export function estadoInicial(ahora: number): EstadoDemo {
  return { inicio: ahora, autorizaciones: {} };
}

/** Lee lo guardado sin confiar en ello: cualquier cosa rara → demo nueva. */
export function leerEstado(raw: string | null, ahora: number): EstadoDemo {
  if (!raw) return estadoInicial(ahora);
  try {
    const data = JSON.parse(raw) as Partial<EstadoDemo>;
    const inicio = typeof data.inicio === 'number' && Number.isFinite(data.inicio) ? data.inicio : ahora;
    const autorizaciones: Record<string, number> = {};
    if (data.autorizaciones && typeof data.autorizaciones === 'object') {
      for (const [k, v] of Object.entries(data.autorizaciones)) {
        if (typeof v === 'number' && Number.isFinite(v)) autorizaciones[normalizarPlaca(k)] = v;
      }
    }
    return { inicio, autorizaciones };
  } catch {
    return estadoInicial(ahora);
  }
}

export function buscarOrden(ordenes: readonly OrdenDemo[], placa: string) {
  const p = normalizarPlaca(placa);
  if (!p) return undefined;
  return ordenes.find((o) => normalizarPlaca(o.placa) === p);
}

/** Suma días hábiles (lunes a sábado) y fija la hora "HH:MM" en hora local. */
export function fechaEntrega(inicio: number, dias: number, hora: string) {
  const d = new Date(inicio);
  let faltan = dias;
  while (faltan > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) faltan--;
  }
  const [h, m] = hora.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

/** Orden lista para pintar: historial con horas reales y la autorización aplicada. */
export function vistaOrden(orden: OrdenDemo, demo: EstadoDemo): OrdenVista {
  const historial: EventoReal[] = orden.historial.map((e) => ({
    en: demo.inicio - e.hace * 60_000,
    estado: e.estado,
    nota: e.nota,
  }));

  let estado = orden.estado;
  let autorizado = orden.autorizado;
  const autorizadoEn = demo.autorizaciones[normalizarPlaca(orden.placa)];

  if (autorizadoEn && estado === 'autorizacion' && orden.presupuesto.length > 0) {
    estado = 'reparacion';
    autorizado = true;
    historial.push({
      en: autorizadoEn,
      estado: 'reparacion',
      nota: `Autorizado por ${orden.cliente} desde el pizarrón en línea. ${orden.mecanico} ya está en ello.`,
    });
  }

  historial.sort((a, b) => a.en - b.en);

  return {
    ...orden,
    estado,
    autorizado,
    historial,
    paso: pasoDe(estado),
    puedeAutorizar: estado === 'autorizacion' && !autorizado && orden.presupuesto.length > 0,
    entrega: fechaEntrega(demo.inicio, orden.entregaEnDias, orden.horaEntrega),
  };
}

/** Devuelve un estado NUEVO con la autorización registrada (no muta). */
export function autorizar(demo: EstadoDemo, orden: OrdenDemo, ahora: number): EstadoDemo {
  const vista = vistaOrden(orden, demo);
  if (!vista.puedeAutorizar) return demo;
  return { ...demo, autorizaciones: { ...demo.autorizaciones, [normalizarPlaca(orden.placa)]: ahora } };
}

export function totales(orden: Pick<OrdenDemo, 'presupuesto'>) {
  const refacciones = orden.presupuesto.reduce((a, c) => a + c.refaccion, 0);
  const manoObra = orden.presupuesto.reduce((a, c) => a + c.manoObra, 0);
  const subtotal = refacciones + manoObra;
  const iva = Math.round(subtotal * IVA);
  return { refacciones, manoObra, subtotal, iva, total: subtotal + iva };
}
