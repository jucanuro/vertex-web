const FOCUSABLE = 'a[href],button:not([disabled]),summary';

function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = header?.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = header?.querySelector<HTMLElement>('[data-menu-panel]');
  if (!header || !toggle || !panel) return;

  const onScroll = () => header.toggleAttribute('data-scrolled', scrollY > 16);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  };
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  panel.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  const mq = matchMedia('(min-width: 1024px)');
  mq.addEventListener('change', () => mq.matches && isOpen() && setOpen(false));

  header.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    } else if (e.key === 'Tab') {
      const items = [toggle, ...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  document.addEventListener(
    'astro:before-swap',
    () => {
      removeEventListener('scroll', onScroll);
      document.documentElement.style.overflow = '';
    },
    { once: true },
  );
}

document.addEventListener('astro:page-load', initHeader);
