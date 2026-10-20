/**
 * Diagnóstico por síntoma (orientativo). Cada síntoma enlaza a servicios de src/data/servicios.ts;
 * el rango de precio se calcula a partir de ellos en src/lib/diagnostico.ts.
 */
export type Probabilidad = 'alta' | 'media' | 'baja';
export type Urgencia = 'verde' | 'ambar' | 'rojo';

export interface Causa {
  causa: string;
  probabilidad: Probabilidad;
  /** Por qué pensamos eso, con peras y manzanas */
  porque: string;
}

export interface Sintoma {
  id: string;
  /** Como lo dice el cliente en el mostrador */
  nombre: string;
  urgencia: Urgencia;
  /** Una frase de mecánico sobre la urgencia */
  veredicto: string;
  causas: Causa[];
  /** Lo que puedes revisar tú sin riesgo */
  revisaTu: string[];
  /** Servicios relacionados (ids), el primero es el más probable */
  servicios: string[];
}

export const sintomas: Sintoma[] = [
  {
    id: 'ruido-frenar',
    nombre: 'Rechina al frenar',
    urgencia: 'ambar',
    veredicto: 'Agéndalo esta semana. Si ya truena metal con metal, no esperes.',
    causas: [
      { causa: 'Balatas gastadas hasta el testigo', probabilidad: 'alta', porque: 'El testigo es una lámina que chilla a propósito para avisarte.' },
      { causa: 'Discos con rebaba o cristalizados', probabilidad: 'media', porque: 'Pasa cuando se cambiaron balatas sin rectificar.' },
      { causa: 'Polvo o piedrita entre balata y disco', probabilidad: 'baja', porque: 'Común después de terracería; se quita con limpieza.' },
    ],
    revisaTu: ['Mira por entre los rayos del rin: si la balata se ve de menos de 3 mm, ya toca.', 'Fíjate si chilla solo en frío por la mañana (humedad) o todo el día.'],
    servicios: ['balatas-delanteras', 'rectificado-discos', 'discos-nuevos'],
  },
  {
    id: 'vibra-volante',
    nombre: 'Vibra el volante',
    urgencia: 'ambar',
    veredicto: 'No es de vida o muerte, pero se come tus llantas. Esta semana.',
    causas: [
      { causa: 'Llantas desbalanceadas', probabilidad: 'alta', porque: 'Si vibra arriba de 80 km/h y no al frenar, es lo primero.' },
      { causa: 'Discos de freno torcidos', probabilidad: 'media', porque: 'Si vibra solo al frenar, es el disco.' },
      { causa: 'Terminales o rótulas con juego', probabilidad: 'media', porque: 'Se siente también en topes y baches.' },
      { causa: 'Llanta con chipote', probabilidad: 'baja', porque: 'Pasa después de un hoyo fuerte.' },
    ],
    revisaTu: ['Fíjate en qué velocidad empieza y si cambia al frenar.', 'Pasa la mano (con el auto frío) por la cara de cada llanta buscando bolas.'],
    servicios: ['alineacion-balanceo', 'rectificado-discos', 'terminales'],
  },
  {
    id: 'humo-escape',
    nombre: 'Sale humo por el escape',
    urgencia: 'ambar',
    veredicto: 'Depende del color. Blanco con olor dulce: rojo. Negro o azul: esta semana.',
    causas: [
      { causa: 'Mezcla rica (humo negro): inyectores o sensor', probabilidad: 'alta', porque: 'Gasta de más y huele a gasolina.' },
      { causa: 'Quema aceite (humo azul): anillos o sellos de válvula', probabilidad: 'media', porque: 'Se te acaba el aceite entre cambios.' },
      { causa: 'Empaque de cabeza (humo blanco espeso y dulce)', probabilidad: 'baja', porque: 'Se pierde anticongelante sin fuga visible.' },
    ],
    revisaTu: ['Mira el color del humo con el motor caliente (el vapor en frío es normal).', 'Revisa la bayoneta del aceite: si se ve como café con leche, no lo manejes.'],
    servicios: ['inyectores', 'diagnostico-computarizado', 'empaque-cabeza'],
  },
  {
    id: 'check-engine',
    nombre: 'Prendió el check engine',
    urgencia: 'ambar',
    veredicto: 'Si está fija, agéndalo esta semana. Si parpadea, para el auto.',
    causas: [
      { causa: 'Tapón de gasolina mal cerrado', probabilidad: 'media', porque: 'Sí, de verdad. Es de las más comunes y no cuesta nada.' },
      { causa: 'Sensor de oxígeno o de flujo de aire', probabilidad: 'alta', porque: 'Se desgastan con los kilómetros y suben el consumo.' },
      { causa: 'Bujía o bobina fallando', probabilidad: 'media', porque: 'Si además tironea, casi seguro es encendido.' },
    ],
    revisaTu: ['Aprieta el tapón de gasolina hasta que truene 3 veces y maneja 2 días.', 'Fíjate si la luz está fija o parpadea: parpadeando es urgente.'],
    servicios: ['diagnostico-computarizado', 'afinacion-mayor'],
  },
  {
    id: 'no-enciende',
    nombre: 'No enciende',
    urgencia: 'rojo',
    veredicto: 'No lo andes empujando. Mándanos foto del tablero y vamos con la grúa.',
    causas: [
      { causa: 'Batería descargada o terminales sulfatadas', probabilidad: 'alta', porque: 'Si las luces del tablero prenden débil, es la batería.' },
      { causa: 'Marcha dañada', probabilidad: 'media', porque: 'Se escucha un "clic" pero no gira el motor.' },
      { causa: 'Bomba de gasolina o relevador', probabilidad: 'baja', porque: 'El motor gira pero no prende.' },
    ],
    revisaTu: ['Prende las luces: si están débiles, es batería.', 'Revisa que las terminales de la batería no tengan polvo blanco o verde.', 'Escucha: ¿clic, gira sin prender o nada?'],
    servicios: ['bateria', 'marcha', 'diagnostico-computarizado'],
  },
  {
    id: 'se-calienta',
    nombre: 'Se calienta',
    urgencia: 'rojo',
    veredicto: 'No lo manejes. Un motor calentado es la reparación más cara del taller.',
    causas: [
      { causa: 'Falta de anticongelante por fuga', probabilidad: 'alta', porque: 'Busca charco verde o rosa debajo del auto.' },
      { causa: 'Termostato pegado', probabilidad: 'media', porque: 'La aguja sube rápido aunque el depósito esté lleno.' },
      { causa: 'Ventilador o bomba de agua', probabilidad: 'media', porque: 'Se calienta en tráfico pero baja en carretera.' },
    ],
    revisaTu: ['Apágalo y espera 30 minutos. Nunca abras el radiador caliente.', 'Con el motor frío, revisa el nivel del depósito del anticongelante.'],
    servicios: ['termostato', 'bomba-agua', 'anticongelante'],
  },
  {
    id: 'patina-clutch',
    nombre: 'Patina el clutch',
    urgencia: 'ambar',
    veredicto: 'Aguanta unos días, pero te puede dejar en una subida. Esta semana.',
    causas: [
      { causa: 'Disco de clutch gastado', probabilidad: 'alta', porque: 'Revoluciona pero no avanza, sobre todo en subida.' },
      { causa: 'Fuga en el sistema hidráulico', probabilidad: 'media', porque: 'El pedal se queda abajo o se siente esponjoso.' },
      { causa: 'Fuga de aceite al disco', probabilidad: 'baja', porque: 'Un retén goteando contamina el disco.' },
    ],
    revisaTu: ['En subida, mete tercera a 40 km/h y acelera: si sube la aguja y no el auto, patina.', 'Revisa el nivel del depósito del clutch (junto al de frenos).'],
    servicios: ['kit-clutch', 'soportes'],
  },
  {
    id: 'consume-gasolina',
    nombre: 'Consume mucha gasolina',
    urgencia: 'verde',
    veredicto: 'Puede esperar, pero cada semana lo pagas en la gasolinera.',
    causas: [
      { causa: 'Afinación vencida (bujías, filtros)', probabilidad: 'alta', porque: 'Un filtro de aire tapado sube el consumo hasta 10 %.' },
      { causa: 'Llantas bajas o desalineadas', probabilidad: 'media', porque: 'Rodar con 25 psi en vez de 32 se nota en el tanque.' },
      { causa: 'Sensor de oxígeno', probabilidad: 'media', porque: 'El motor cree que necesita más gasolina de la que necesita.' },
    ],
    revisaTu: ['Calibra las llantas en frío a lo que dice la etiqueta de la puerta.', 'Saca el promedio: litros cargados entre kilómetros recorridos, dos tanques seguidos.'],
    servicios: ['afinacion-mayor', 'alineacion-balanceo', 'diagnostico-computarizado'],
  },
  {
    id: 'olor-quemado',
    nombre: 'Huele a quemado',
    urgencia: 'rojo',
    veredicto: 'Oríllate y apaga. Hasta saber qué se quema, no lo manejes.',
    causas: [
      { causa: 'Aceite goteando sobre el escape', probabilidad: 'alta', porque: 'Olor a aceite quemado y a veces humo del cofre.' },
      { causa: 'Clutch patinando o freno de mano puesto', probabilidad: 'media', porque: 'Olor fuerte, como a papel quemado.' },
      { causa: 'Corto eléctrico', probabilidad: 'baja', porque: 'Olor a plástico. Es el más peligroso.' },
    ],
    revisaTu: ['Revisa que el freno de mano esté abajo del todo.', 'Con el motor frío, busca manchas de aceite en el motor o en el piso.'],
    servicios: ['diagnostico-computarizado', 'kit-clutch', 'revision-40'],
  },
  {
    id: 'ac-no-enfria',
    nombre: 'El A/C no enfría',
    urgencia: 'verde',
    veredicto: 'Puede esperar. Pero en abril vas a querer tenerlo listo.',
    causas: [
      { causa: 'Falta de gas por fuga lenta', probabilidad: 'alta', porque: 'Enfría cada vez menos durante semanas.' },
      { causa: 'Filtro de cabina tapado', probabilidad: 'media', porque: 'Enfría, pero sale poco aire.' },
      { causa: 'Compresor que no embraga', probabilidad: 'baja', porque: 'Dejó de enfriar de un día para otro.' },
    ],
    revisaTu: ['Con el A/C prendido, mira si el centro de la polea del compresor gira.', 'Pon el ventilador al máximo: si sale poco aire, es filtro.'],
    servicios: ['carga-gas', 'filtro-cabina', 'fugas-ac', 'compresor'],
  },
];
