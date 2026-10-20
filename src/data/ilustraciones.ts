/** Catálogo de ilustraciones propias (ver DISENO.md §4 y src/components/ui/Ilustracion.astro). */
export const ilustraciones = [
  'llave-cruz',
  'disco-freno',
  'bujia',
  'amortiguador',
  'piston',
  'bayoneta',
  'manometro',
  'clutch',
  'ventilador',
  'llanta',
  'flecha',
] as const;

export type IlustracionNombre = (typeof ilustraciones)[number];
