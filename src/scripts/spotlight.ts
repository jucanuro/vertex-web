// Un único listener delegado para todas las tarjetas [data-spotlight].
let frame = 0;
document.addEventListener(
  'pointermove',
  (e) => {
    if (e.pointerType !== 'mouse' || frame) return;
    const card = (e.target as Element).closest<HTMLElement>('[data-spotlight]');
    if (!card) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - r.left}px`);
      card.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
  },
  { passive: true },
);
