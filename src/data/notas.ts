/**
 * Notas de clientes, como papelitos pegados en el tablero del mostrador.
 * `forma` decide cómo se ve el papel; no hay dos iguales seguidas.
 */
export type FormaNota = 'cuadro' | 'ticket' | 'mano' | 'tarjeta' | 'servilleta' | 'recibo';

export interface Nota {
  texto: string;
  firma: string;
  auto: string;
  fecha: string;
  forma: FormaNota;
}

export const notas: Nota[] = [
  {
    texto: 'En la agencia me querían cambiar los 4 discos. Aquí los rectificaron y me enseñaron la medida. Ahorré $3,800.',
    firma: 'Lupita C.',
    auto: 'Sedán 2016',
    fecha: '12·AGO·26',
    forma: 'cuadro',
  },
  {
    texto: 'Llegué en grúa un sábado a la 1:40. Cierran a las 2. Me lo dejaron andando antes de irse.',
    firma: 'Javier M.',
    auto: 'Pickup 2011',
    fecha: '07·SEP·26',
    forma: 'ticket',
  },
  {
    texto: 'Me devolvieron la bomba vieja en una bolsa con mi nombre. Nunca nadie había hecho eso.',
    firma: 'Sofía R.',
    auto: 'SUV 2017',
    fecha: '19·SEP·26',
    forma: 'mano',
  },
  {
    texto: 'Le pregunté a La Inge por qué no enfriaba y me lo explicó con un dibujo en una servilleta. Ya entendí qué es un compresor.',
    firma: 'Toño G.',
    auto: 'Compacto 2012',
    fecha: '28·SEP·26',
    forma: 'servilleta',
  },
  {
    texto: 'Fui por afinación y me dijeron que no la necesitaba todavía. Volví a los 6 meses, ya sí. Ahora no voy a otro lado.',
    firma: 'Ing. Ricardo P.',
    auto: 'Sedán 2019',
    fecha: '03·OCT·26',
    forma: 'tarjeta',
  },
  {
    texto: 'El Chato no me prestó su matraca. Pero me arregló la suspensión en hora y media. 10/10.',
    firma: 'Memo L.',
    auto: 'Hatchback 2015',
    fecha: '14·OCT·26',
    forma: 'recibo',
  },
];
