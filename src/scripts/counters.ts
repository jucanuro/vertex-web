// Contadores animados. El valor final ya está en el HTML (SEO y reduced-motion).
function run(el: HTMLElement): void {
  const end = Number(el.dataset.count);
  const t0 = performance.now();
  const tick = (t: number) => {
    const p = Math.min((t - t0) / 1400, 1);
    el.textContent = String(Math.round(end * (1 - (1 - p) ** 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
function initCounters(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        run(e.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
}
document.addEventListener('astro:page-load', initCounters);
