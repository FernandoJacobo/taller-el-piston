/**
 * "Los de abajo del cofre". Las fotos son de su herramienta favorita (no de su cara):
 * en FOTOS-REALES.md está cómo pedirle al taller real las suyas.
 */
import type { ImageMetadata } from 'astro';
import stillson from '@/assets/fotos/stillson.jpg';
import matraca from '@/assets/fotos/matraca.jpg';
import multimetro from '@/assets/fotos/multimetro.jpg';
import manometro from '@/assets/fotos/manometro.jpg';

export interface Mecanico {
  nombre: string;
  apodo: string;
  desde: number;
  especialidad: string;
  herramienta: string;
  /** Lo que dice cuando le preguntas algo */
  frase: string;
  foto: ImageMetadata;
  fotoAlt: string;
}

export const equipo: Mecanico[] = [
  {
    nombre: 'Ramiro Ortiz',
    apodo: 'El Patrón',
    desde: 1983,
    especialidad: 'Motor y ruidos raros. Diagnostica con el oído antes que con el escáner.',
    herramienta: 'Una Stillson de 1987 que heredó del maestro que le enseñó el oficio.',
    frase: '“Si me lo traes a tiempo, te sale barato.”',
    foto: stillson,
    fotoAlt: 'Llave Stillson y llave ajustable sobre fondo oscuro',
  },
  {
    nombre: 'Iván Ortiz',
    apodo: 'El Chato',
    desde: 2006,
    especialidad: 'Frenos, suspensión y dirección. Si truena en los topes, es suyo.',
    herramienta: 'Su matraca de 1/2", la misma desde 2006.',
    frase: '“Esa balata todavía da. No la cambies.”',
    foto: matraca,
    fotoAlt: 'Matraca y dados sobre una lámina de metal',
  },
  {
    nombre: 'Eduardo Mendoza',
    apodo: 'El Profe',
    desde: 2011,
    especialidad: 'Eléctrico y diagnóstico computarizado. Da clases de electricidad automotriz los sábados.',
    herramienta: 'Un multímetro amarillo con cinta de aislar en el cable rojo.',
    frase: '“El código dice dónde buscar, no qué cambiar.”',
    foto: multimetro,
    fotoAlt: 'Mano sosteniendo un multímetro digital amarillo',
  },
  {
    nombre: 'Daniela Ortiz',
    apodo: 'La Inge',
    desde: 2017,
    especialidad: 'Aire acondicionado y transmisiones automáticas. Ingeniera mecánica titulada.',
    herramienta: 'El juego de manómetros del A/C. Les puso su nombre con plumón.',
    frase: '“Cargar gas sin buscar la fuga es tirar dinero.”',
    foto: manometro,
    fotoAlt: 'Carátula de un manómetro naranja con aguja',
  },
];
