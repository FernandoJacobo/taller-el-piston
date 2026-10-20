/**
 * "Abierto ahora / Cerramos a las 6:30 p. m." para el encabezado de la orden.
 * Funciona igual en el build (Node) y en el navegador.
 */
import { formatTime, type DayKey, type OpeningSlot } from '@/config/site';

export type Hours = Record<DayKey, readonly OpeningSlot[]>;

/** Índice de Date.getDay() (0 = domingo) → clave de site.hours */
export const dayKeys: DayKey[] = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];

const dayNames: Record<DayKey, string> = {
  lun: 'el lunes',
  mar: 'el martes',
  mie: 'el miércoles',
  jue: 'el jueves',
  vie: 'el viernes',
  sab: 'el sábado',
  dom: 'el domingo',
};

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Día de la semana y minutos desde medianoche en la zona horaria del taller. */
export function nowIn(tz: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return {
    dayIdx: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

export interface OpenStatus {
  open: boolean;
  /** "Abierto ahora" / "Cerrado" */
  estado: string;
  /** "Cerramos a las 6:30 p. m." / "Abrimos mañana a las 8:30 a. m." */
  detalle: string;
}

export function openStatus(hours: Hours, tz: string, date = new Date()): OpenStatus {
  const { dayIdx, minutes } = nowIn(tz, date);
  const today = hours[dayKeys[dayIdx]] ?? [];
  const current = today.find((s) => minutes >= toMinutes(s.open) && minutes < toMinutes(s.close));
  if (current) {
    const faltan = toMinutes(current.close) - minutes;
    return {
      open: true,
      estado: faltan <= 45 ? 'Abierto · ya casi cerramos' : 'Abierto ahora',
      detalle: `Cerramos a las ${formatTime(current.close)}`,
    };
  }

  const laterToday = today.find((s) => minutes < toMinutes(s.open));
  if (laterToday) return { open: false, estado: 'Cerrado', detalle: `Abrimos hoy a las ${formatTime(laterToday.open)}` };

  for (let i = 1; i <= 7; i++) {
    const key = dayKeys[(dayIdx + i) % 7];
    const slot = hours[key]?.[0];
    if (slot) {
      return { open: false, estado: 'Cerrado', detalle: `Abrimos ${i === 1 ? 'mañana' : dayNames[key]} a las ${formatTime(slot.open)}` };
    }
  }
  return { open: false, estado: 'Cerrado', detalle: 'Cerrado por vacaciones' };
}
