/**
 * Sello que se estampa: añade .estampado a [data-estampa] la primera vez que entra en vista.
 * Con prefers-reduced-motion el CSS no oculta los sellos, así que no hace falta nada más.
 */
const sellos = document.querySelectorAll<HTMLElement>('[data-estampa]');

if (sellos.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('estampado');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.4 },
  );
  sellos.forEach((s) => io.observe(s));
} else {
  sellos.forEach((s) => s.classList.add('estampado'));
}
