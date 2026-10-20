/** JSON-LD para SEO local: AutoRepair, FAQPage y Service. */
import { site, dayOrder, type DayKey } from '@/config/site';
import { preguntas } from '@/data/preguntas';
import { servicios, sistemas, type Servicio } from '@/data/servicios';
import { precioDesde } from '@/lib/cotizador';

const schemaDay: Record<DayKey, string> = {
  lun: 'Monday',
  mar: 'Tuesday',
  mie: 'Wednesday',
  jue: 'Thursday',
  vie: 'Friday',
  sab: 'Saturday',
  dom: 'Sunday',
};

export const absoluteUrl = (path: string) => new URL(path, site.url).toString();

/** `/ruta.html` (build.format: 'file') → `/ruta` para canonical y navegación activa. */
export const cleanPath = (pathname: string) => {
  const p = pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '');
  return p === '' ? '/' : p;
};

export const businessId = `${site.url}/#taller`;

export function businessSchema(image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': businessId,
    name: site.name,
    alternateName: site.legalName,
    slogan: site.slogan,
    description: site.description,
    url: site.url,
    logo: absoluteUrl('/favicon.svg'),
    image,
    telephone: site.contact.phone,
    email: site.contact.email,
    foundingDate: String(site.foundingYear),
    priceRange: '$$',
    currenciesAccepted: site.currency,
    paymentAccepted: 'Efectivo, tarjeta de débito, tarjeta de crédito, transferencia',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: `https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}`,
    areaServed: ['Guadalajara', 'Zapopan', 'Tlaquepaque'],
    openingHoursSpecification: dayOrder
      .filter((d) => site.hours[d].length)
      .map((d) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${schemaDay[d]}`,
        opens: site.hours[d][0].open,
        closes: site.hours[d][0].close,
      })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Lista de precios',
      itemListElement: sistemas.map((g) => ({
        '@type': 'OfferCatalog',
        name: g.nombre,
        itemListElement: servicios.filter((s) => s.sistema === g.id).map(offer),
      })),
    },
  };
}

const offer = (s: Servicio) => ({
  '@type': 'Offer',
  itemOffered: { '@type': 'Service', name: s.nombre, description: s.incluye.join('. ') },
  priceSpecification: {
    '@type': 'PriceSpecification',
    minPrice: precioDesde(s),
    priceCurrency: site.currency,
    valueAddedTaxIncluded: false,
  },
});

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map((q) => ({
      '@type': 'Question',
      name: q.p,
      acceptedAnswer: { '@type': 'Answer', text: q.r },
    })),
  };
}

export function servicesSchema() {
  return servicios.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.nombre,
    serviceType: sistemas.find((g) => g.id === s.sistema)?.nombre,
    description: `${s.incluye.join('. ')}. ${s.cuando}`,
    provider: { '@id': businessId },
    areaServed: site.address.city,
    offers: {
      '@type': 'Offer',
      priceCurrency: site.currency,
      price: precioDesde(s),
      description: `Desde ${precioDesde(s)} MXN más IVA. ${s.garantia}.`,
    },
  }));
}
