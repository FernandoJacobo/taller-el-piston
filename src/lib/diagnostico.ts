/**
 * Diagnóstico por síntoma (orientativo). Funciones puras, probadas en tests/diagnostico.test.ts.
 */
import type { Causa, Probabilidad, Sintoma, Urgencia } from '@/data/sintomas';
import type { Servicio } from '@/data/servicios';
import { precioDesde, partida } from '@/lib/cotizador';

const peso: Record<Probabilidad, number> = { alta: 3, media: 2, baja: 1 };

export const urgencias: Record<Urgencia, { etiqueta: string; corto: string; angulo: number }> = {
  verde: { etiqueta: 'Puede esperar', corto: 'Verde', angulo: -60 },
  ambar: { etiqueta: 'Agenda esta semana', corto: 'Ámbar', angulo: 0 },
  rojo: { etiqueta: 'No lo manejes', corto: 'Rojo', angulo: 60 },
};

/** Causas de la más a la menos probable; en empate se respeta el orden de captura. */
export function ordenarCausas(causas: readonly Causa[]): Causa[] {
  return causas
    .map((c, i) => ({ c, i }))
    .sort((a, b) => peso[b.c.probabilidad] - peso[a.c.probabilidad] || a.i - b.i)
    .map(({ c }) => c);
}

/**
 * Rango orientativo: desde el servicio relacionado más barato (compacto, económica)
 * hasta el servicio más probable en SUV con refacción equivalente.
 */
export function rangoPrecio(relacionados: readonly Servicio[]) {
  if (relacionados.length === 0) return null;
  const min = Math.min(...relacionados.map(precioDesde));
  const principal = partida(relacionados[0], 'suv', 'equivalente');
  const max = Math.max(min, principal.refaccion + principal.manoObra);
  return { min, max };
}

export interface Resultado {
  sintoma: Sintoma;
  causas: Causa[];
  urgencia: (typeof urgencias)[Urgencia] & { nivel: Urgencia };
  servicios: Servicio[];
  rango: { min: number; max: number } | null;
}

export function diagnosticar(sintoma: Sintoma, catalogo: readonly Servicio[]): Resultado {
  const servicios = sintoma.servicios
    .map((id) => catalogo.find((s) => s.id === id))
    .filter((s): s is Servicio => Boolean(s));
  return {
    sintoma,
    causas: ordenarCausas(sintoma.causas),
    urgencia: { ...urgencias[sintoma.urgencia], nivel: sintoma.urgencia },
    servicios,
    rango: rangoPrecio(servicios),
  };
}

/** Texto con el que se prellena el campo "falla" de la orden de servicio. */
export function fallaParaOrden(r: Resultado) {
  return `${r.sintoma.nombre}. (Diagnóstico en línea: ${r.urgencia.etiqueta.toLowerCase()}; posible ${r.causas[0]?.causa.toLowerCase() ?? 'falla'}.)`;
}
