/** Preguntas que sí nos hacen en el mostrador (también alimentan el JSON-LD FAQPage). */
export interface Pregunta {
  p: string;
  r: string;
}

export const preguntas: Pregunta[] = [
  {
    p: '¿Por qué me cobran la revisión?',
    r: 'No la cobramos si te haces la reparación aquí. Si solo quieres el diagnóstico para llevártelo, son $350 por la hora de bahía y el reporte por escrito con fotos.',
  },
  {
    p: '¿Cómo sé que de verdad necesita esa pieza?',
    r: 'Te mandamos foto de la pieza dañada antes de cambiarla, y al final te devolvemos la vieja en una bolsa con tu folio. Si quieres, pasas y la ves en el elevador.',
  },
  {
    p: '¿Puedo llevar mis propias refacciones?',
    r: 'Sí. Cobramos solo mano de obra, pero la garantía cubre el trabajo, no la pieza. Si la pieza viene mal, te lo decimos antes de instalarla.',
  },
  {
    p: '¿Cuánto tardan?',
    r: 'Lo de rutina (aceite, balatas, alineación) sale el mismo día. Lo grande (clutch, distribución) de 1 a 2 días hábiles. La fecha va escrita en tu orden y la ves en el pizarrón en línea.',
  },
  {
    p: '¿La garantía es de a de veras?',
    r: '3 meses o 5,000 km, lo que pase primero, en piezas y mano de obra. Si falla lo que hicimos, lo volvemos a hacer sin costo. Va por escrito en tu nota.',
  },
  {
    p: '¿Dan factura?',
    r: 'Sí, en el momento. Los precios de la lista no incluyen IVA; en el cotizador puedes marcar la casilla "con factura" y te lo suma.',
  },
  {
    p: '¿Y si me lo cambian por una pieza usada?',
    r: 'Las refacciones llegan selladas y abrimos la caja frente a ti o en el video que te mandamos. Original, equivalente o económica: tú eliges y queda escrito.',
  },
];
