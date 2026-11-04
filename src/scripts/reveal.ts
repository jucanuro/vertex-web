// Respaldo para navegadores sin animation-timeline: view().
function initReveal(): void {
  if (CSS.supports('animation-timeline: view()')) return;
  const items = document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)');
  if (!items.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  items.forEach((el) => {
    el.classList.add('reveal-hidden');
    io.observe(el);
  });
}
document.addEventListener('astro:page-load', initReveal);
