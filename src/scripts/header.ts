// Fondo del header al hacer scroll. El menú móvil vive en mobile-menu.ts.
function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const onScroll = () => header.toggleAttribute('data-scrolled', scrollY > 16);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  document.addEventListener('astro:before-swap', () => removeEventListener('scroll', onScroll), { once: true });
}

document.addEventListener('astro:page-load', initHeader);
