import { describe, expect, it } from 'vitest';
import { servicios, servicioPorId } from '@/data/servicios';
import { cotizar, formatoEntrega, formatoHoras, partida, precioDesde, precioHasta, redondear } from '@/lib/cotizador';

const s = (id: string) => {
  const found = servicioPorId(id);
  if (!found) throw new Error(`No existe ${id}`);
  return found;
};

describe('redondear', () => {
  it('redondea a la decena', () => {
    expect(redondear(1427.5)).toBe(1430);
    expect(redondear(1424)).toBe(1420);
    expect(redondear(0)).toBe(0);
  });
});

describe('partida', () => {
  it('compacto + equivalente es el precio base', () => {
    const p = partida(s('balatas-delanteras'), 'compacto', 'equivalente');
    expect(p).toMatchObject({ refaccion: 760, manoObra: 440, horas: 1.5 });
  });

  it('aplica factores de vehículo y de refacción por separado', () => {
    const p = partida(s('balatas-delanteras'), 'suv', 'original');
    // 760 × 1.4 × 1.45 = 1542.8 → 1540 ; 440 × 1.25 = 550
    expect(p.refaccion).toBe(1540);
    expect(p.manoObra).toBe(550);
    expect(p.horas).toBe(1.75); // 1.5 × 1.2 = 1.8 → cuarto de hora más cercano
  });

  it('un servicio sin refacción sigue en cero con cualquier calidad', () => {
    for (const r of ['original', 'equivalente', 'economica'] as const) {
      expect(partida(s('rectificado-discos'), 'pickup', r).refaccion).toBe(0);
    }
  });
});

describe('precioDesde / precioHasta', () => {
  it('desde = compacto con refacción económica', () => {
    // 1050 × .75 = 787.5 → 790 ; + 640
    expect(precioDesde(s('afinacion-mayor'))).toBe(1430);
  });

  it('el "desde" de la pared siempre es menor o igual que el "hasta"', () => {
    for (const sv of servicios) expect(precioDesde(sv)).toBeLessThanOrEqual(precioHasta(sv));
  });

  it('el precio tachado ("antes") es mayor que el actual', () => {
    for (const sv of servicios.filter((x) => x.antes)) expect(sv.antes!).toBeGreaterThan(precioDesde(sv));
  });

  it('ids de servicio únicos', () => {
    expect(new Set(servicios.map((x) => x.id)).size).toBe(servicios.length);
  });
});

describe('cotizar', () => {
  const lista = [s('balatas-delanteras'), s('rectificado-discos')];

  it('separa refacciones y mano de obra y suma el total sin IVA', () => {
    const c = cotizar(lista, 'compacto', 'equivalente', false);
    expect(c.refacciones).toBe(760);
    expect(c.manoObra).toBe(440 + 520);
    expect(c.subtotal).toBe(1720);
    expect(c.iva).toBe(0);
    expect(c.total).toBe(1720);
    expect(c.horas).toBe(2.5);
    expect(c.dias).toBe(1);
  });

  it('agrega 16 % de IVA cuando se pide factura', () => {
    const c = cotizar(lista, 'compacto', 'equivalente', true);
    expect(c.iva).toBe(Math.round(1720 * 0.16));
    expect(c.total).toBe(1720 + 275);
  });

  it('sin servicios todo es cero', () => {
    const c = cotizar([], 'sedan', 'original', true);
    expect(c).toMatchObject({ refacciones: 0, manoObra: 0, total: 0, horas: 0, dias: 0 });
    expect(formatoEntrega(c)).toBe('—');
  });

  it('un vehículo más grande nunca sale más barato', () => {
    const orden = ['compacto', 'sedan', 'suv', 'pickup'] as const;
    for (const sv of servicios) {
      const t = orden.map((v) => cotizar([sv], v, 'equivalente', false).total);
      for (let i = 1; i < t.length; i++) expect(t[i]).toBeGreaterThanOrEqual(t[i - 1]);
    }
  });

  it('calcula días hábiles de 7 h para trabajos largos', () => {
    const c = cotizar([s('kit-clutch'), s('banda-distribucion')], 'pickup', 'original', false);
    // (6 + 5) × 1.25 = 13.75 h → 2 días
    expect(c.horas).toBe(13.75);
    expect(formatoEntrega(c)).toBe('2 días hábiles');
  });
});

describe('formatos', () => {
  it('formatoHoras', () => {
    expect(formatoHoras(1.5)).toBe('1 h 30 min');
    expect(formatoHoras(0.5)).toBe('30 min');
    expect(formatoHoras(6)).toBe('6 h');
  });

  it('formatoEntrega mismo día', () => {
    expect(formatoEntrega(cotizar([s('cambio-aceite')], 'compacto', 'equivalente', false))).toBe('El mismo día');
  });
});
