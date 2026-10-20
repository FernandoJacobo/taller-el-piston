import { describe, expect, it } from 'vitest';
import { folioDelMomento, mensajeOrden, validarOrden, type DatosOrden } from '@/lib/orden';
import { openStatus } from '@/lib/horario';
import { site } from '@/config/site';

const ok: DatosOrden = {
  placa: 'jal-482-c',
  marca: 'Nissan',
  modelo: 'Versa',
  anio: '2014',
  km: '148,320',
  falla: 'Rechina al frenar en las mañanas',
  horario: 'Mañana (8:30 a 12:00)',
  nombre: 'Mariana T.',
  telefono: '33 1234 5678',
};

describe('validarOrden', () => {
  it('una orden bien llenada no tiene errores', () => {
    expect(validarOrden(ok, 2026)).toEqual({});
  });

  it('marca cada campo faltante', () => {
    const e = validarOrden(
      { placa: '', marca: '', modelo: '', anio: '14', km: 'mucho', falla: 'ruido', horario: '', nombre: '', telefono: '123' },
      2026,
    );
    expect(Object.keys(e).sort()).toEqual(['anio', 'falla', 'horario', 'km', 'marca', 'modelo', 'nombre', 'placa', 'telefono'].sort());
  });

  it('el kilometraje es opcional', () => {
    expect(validarOrden({ ...ok, km: '' }, 2026)).toEqual({});
  });
});

describe('mensajeOrden', () => {
  it('formatea el mensaje de WhatsApp como orden de servicio', () => {
    const m = mensajeOrden(ok, '2419');
    expect(m.split('\n')[0]).toBe('*ORDEN DE SERVICIO N.º 2419*');
    expect(m).toContain('Placa: JAL-482-C');
    expect(m).toContain('Auto: Nissan Versa 2014');
    expect(m).toContain('Kilometraje: 148,320 km');
    expect(m).toContain('Tel.: 3312345678');
  });

  it('omite el kilometraje si no se escribió', () => {
    expect(mensajeOrden({ ...ok, km: '' }, '1')).not.toContain('Kilometraje');
  });

  it('el folio siempre tiene 4 dígitos', () => {
    expect(folioDelMomento(new Date(2026, 11, 31, 23, 59))).toMatch(/^\d{4}$/);
    expect(folioDelMomento(new Date(2026, 0, 1, 0, 0))).toMatch(/^\d{4}$/);
  });
});

describe('openStatus (America/Mexico_City, UTC-6)', () => {
  const nbsp = ' ';
  const at = (iso: string) => new Date(iso);

  it('martes 10:00 → abierto, cerramos 6:30 p. m.', () => {
    const s = openStatus(site.hours, site.timeZone, at('2026-10-20T16:00:00Z'));
    expect(s.open).toBe(true);
    expect(s.detalle).toBe(`Cerramos a las 6:30${nbsp}p.${nbsp}m.`);
  });

  it('martes 18:00 → ya casi cerramos', () => {
    expect(openStatus(site.hours, site.timeZone, at('2026-10-21T00:00:00Z')).estado).toBe('Abierto · ya casi cerramos');
  });

  it('sábado 15:00 → cerrado, abre el lunes', () => {
    const s = openStatus(site.hours, site.timeZone, at('2026-10-24T21:00:00Z'));
    expect(s.open).toBe(false);
    expect(s.detalle).toBe(`Abrimos el lunes a las 8:30${nbsp}a.${nbsp}m.`);
  });

  it('martes 7:00 → abre hoy', () => {
    expect(openStatus(site.hours, site.timeZone, at('2026-10-20T13:00:00Z')).detalle).toBe(`Abrimos hoy a las 8:30${nbsp}a.${nbsp}m.`);
  });
});
