// Enciende cada etapa al llegar a pantalla. Sin JS o con reduced-motion todo queda visible.
function initStages(): void {
  const root = document.querySelector<HTMLElement>('[data-stages]');
  if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.setAttribute('data-armed', '');
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-on');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -20% 0px' },
  );
  root.querySelectorAll('[data-stage]').forEach((el) => io.observe(el));
}
document.addEventListener('astro:page-load', initStages);
