import { describe, expect, it } from 'vitest';
import { sintomas } from '@/data/sintomas';
import { servicios, servicioPorId } from '@/data/servicios';
import { diagnosticar, fallaParaOrden, ordenarCausas, rangoPrecio } from '@/lib/diagnostico';
import { precioDesde } from '@/lib/cotizador';

const sintoma = (id: string) => sintomas.find((s) => s.id === id)!;

describe('datos de síntomas', () => {
  it('hay 10 síntomas con ids únicos', () => {
    expect(sintomas).toHaveLength(10);
    expect(new Set(sintomas.map((s) => s.id)).size).toBe(10);
  });

  it('todos los servicios relacionados existen en la lista de precios', () => {
    for (const s of sintomas) for (const id of s.servicios) expect(servicioPorId(id), `${s.id} → ${id}`).toBeDefined();
  });
});

describe('ordenarCausas', () => {
  it('ordena alta > media > baja y respeta el orden en empates', () => {
    const r = ordenarCausas([
      { causa: 'a', probabilidad: 'media', porque: '' },
      { causa: 'b', probabilidad: 'baja', porque: '' },
      { causa: 'c', probabilidad: 'alta', porque: '' },
      { causa: 'd', probabilidad: 'media', porque: '' },
    ]);
    expect(r.map((c) => c.causa)).toEqual(['c', 'a', 'd', 'b']);
  });

  it('no muta el arreglo original', () => {
    const original = sintoma('check-engine').causas;
    const copia = [...original];
    ordenarCausas(original);
    expect(original).toEqual(copia);
  });
});

describe('diagnosticar', () => {
  it('check engine: la causa "alta" sube al primer lugar', () => {
    const r = diagnosticar(sintoma('check-engine'), servicios);
    expect(r.causas[0].probabilidad).toBe('alta');
    expect(r.urgencia.nivel).toBe('ambar');
  });

  it('se calienta = rojo, no lo manejes', () => {
    expect(diagnosticar(sintoma('se-calienta'), servicios).urgencia.etiqueta).toBe('No lo manejes');
  });

  it('el rango empieza en el servicio relacionado más barato', () => {
    for (const s of sintomas) {
      const r = diagnosticar(s, servicios);
      expect(r.rango).not.toBeNull();
      expect(r.rango!.min).toBe(Math.min(...r.servicios.map(precioDesde)));
      expect(r.rango!.max).toBeGreaterThanOrEqual(r.rango!.min);
    }
  });

  it('ignora servicios inexistentes', () => {
    const r = diagnosticar({ ...sintomas[0], servicios: ['no-existe', 'cambio-aceite'] }, servicios);
    expect(r.servicios.map((s) => s.id)).toEqual(['cambio-aceite']);
  });

  it('sin servicios no hay rango', () => {
    expect(rangoPrecio([])).toBeNull();
  });

  it('prellena la falla de la orden con el síntoma y la causa probable', () => {
    const f = fallaParaOrden(diagnosticar(sintoma('ruido-frenar'), servicios));
    expect(f).toMatch(/^Rechina al frenar\./);
    expect(f).toContain('balatas gastadas');
  });
});
