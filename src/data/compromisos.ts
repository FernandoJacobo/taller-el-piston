/**
 * "Lo que firmamos": cada compromiso se dibuja como un sello de goma distinto.
 * `forma` elige el tipo de sello; `r` su rotación (que parezca que alguien lo estampó).
 */
export type FormaSello = 'redondo' | 'doble' | 'ovalo' | 'fechador' | 'esquina' | 'roto';

export interface Compromiso {
  sello: string;
  /** Línea pequeña dentro del sello */
  sub: string;
  detalle: string;
  forma: FormaSello;
  r: number;
}

export const compromisos: Compromiso[] = [
  { sello: 'Te avisamos', sub: 'antes de cambiar nada', detalle: 'Nada se desarma ni se cambia sin tu OK por WhatsApp o por teléfono.', forma: 'doble', r: -4 },
  { sello: 'Foto', sub: 'de la pieza dañada', detalle: 'Te mandamos foto o video de lo que está mal, con la medida cuando aplica.', forma: 'redondo', r: 6 },
  { sello: 'Te la devolvemos', sub: 'pieza vieja', detalle: 'Las piezas que salen de tu auto se van contigo, en bolsa y con tu folio.', forma: 'ovalo', r: -2 },
  { sello: 'Por escrito', sub: 'presupuesto', detalle: 'Refacciones y mano de obra separadas. Si cambia, te avisamos antes.', forma: 'fechador', r: 3 },
  { sello: '3 meses', sub: 'o 5,000 km', detalle: 'Garantía en piezas y mano de obra. Lo que pase primero.', forma: 'roto', r: -7 },
  { sello: 'No lo necesita', sub: 'y te lo decimos', detalle: 'Si tu auto no necesita algo, no te lo vendemos. Así de simple.', forma: 'esquina', r: 2 },
];
