import { describe, expect, it } from 'vitest';
import { ordenesDemo } from '@/data/ordenes';
import { autorizar, buscarOrden, estadoInicial, fechaEntrega, leerEstado, normalizarPlaca, totales, vistaOrden } from '@/lib/seguimiento';

const T0 = new Date(2026, 9, 20, 12, 0).getTime(); // martes 20 oct 2026, 12:00 (hora local)
const orden = (placa: string) => buscarOrden(ordenesDemo, placa)!;

describe('placas', () => {
  it('normaliza espacios, guiones y minúsculas', () => {
    expect(normalizarPlaca(' jal 482-c ')).toBe('JAL482C');
  });

  it('encuentra la orden aunque se escriba distinto', () => {
    expect(buscarOrden(ordenesDemo, 'jal482c')?.folio).toBe('2417');
    expect(buscarOrden(ordenesDemo, 'XXX-000')).toBeUndefined();
    expect(buscarOrden(ordenesDemo, '   ')).toBeUndefined();
  });

  it('hay 4 placas demo con estados distintos', () => {
    expect(ordenesDemo).toHaveLength(4);
    expect(new Set(ordenesDemo.map((o) => o.estado)).size).toBe(4);
  });
});

describe('leerEstado', () => {
  it('sin datos o con basura → demo nueva', () => {
    expect(leerEstado(null, T0)).toEqual(estadoInicial(T0));
    expect(leerEstado('{no es json', T0)).toEqual(estadoInicial(T0));
    expect(leerEstado('"texto"', T0).autorizaciones).toEqual({});
  });

  it('descarta autorizaciones con valores no numéricos', () => {
    const e = leerEstado(JSON.stringify({ inicio: 5, autorizaciones: { 'jal-482-c': 10, x: 'y' } }), T0);
    expect(e).toEqual({ inicio: 5, autorizaciones: { JAL482C: 10 } });
  });
});

describe('vistaOrden y autorizar', () => {
  it('ancla el historial al inicio de la demo y lo ordena', () => {
    const v = vistaOrden(orden('JAL-482-C'), estadoInicial(T0));
    expect(v.historial[0].en).toBe(T0 - 230 * 60_000);
    const horas = v.historial.map((e) => e.en);
    expect(horas).toEqual([...horas].sort((a, b) => a - b));
    expect(v.estado).toBe('autorizacion');
    expect(v.paso).toBe(2);
    expect(v.puedeAutorizar).toBe(true);
  });

  it('autorizar pasa la orden a "En reparación" y agrega el evento con hora', () => {
    const demo = estadoInicial(T0);
    const despues = autorizar(demo, orden('JAL-482-C'), T0 + 60_000);
    expect(demo.autorizaciones).toEqual({}); // no muta
    const v = vistaOrden(orden('JAL-482-C'), despues);
    expect(v.estado).toBe('reparacion');
    expect(v.autorizado).toBe(true);
    expect(v.puedeAutorizar).toBe(false);
    expect(v.historial.at(-1)).toMatchObject({ en: T0 + 60_000, estado: 'reparacion' });
  });

  it('autorizar dos veces no cambia nada', () => {
    const una = autorizar(estadoInicial(T0), orden('JAL-482-C'), T0 + 1);
    expect(autorizar(una, orden('JAL-482-C'), T0 + 2)).toBe(una);
  });

  it('no se puede autorizar una orden en diagnóstico (sin presupuesto) ni una ya lista', () => {
    const demo = estadoInicial(T0);
    expect(autorizar(demo, orden('JKL-305-A'), T0)).toBe(demo);
    expect(autorizar(demo, orden('JNB-226-D'), T0)).toBe(demo);
  });
});

describe('fechaEntrega', () => {
  it('mismo día a la hora indicada', () => {
    const d = new Date(fechaEntrega(T0, 0, '17:30'));
    expect([d.getDate(), d.getHours(), d.getMinutes()]).toEqual([20, 17, 30]);
  });

  it('se salta el domingo', () => {
    const sabado = new Date(2026, 9, 24, 10, 0).getTime();
    expect(new Date(fechaEntrega(sabado, 1, '13:00')).getDay()).toBe(1);
  });
});

describe('totales', () => {
  it('suma refacciones, mano de obra e IVA', () => {
    expect(totales(orden('JAL-482-C'))).toEqual({ refacciones: 870, manoObra: 1050, subtotal: 1920, iva: 307, total: 2227 });
  });
});
