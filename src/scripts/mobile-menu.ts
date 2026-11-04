// Menú móvil (<1024px): panel a pantalla completa con foco atrapado y scroll bloqueado.
const FOCUSABLE = 'a[href],button:not([disabled])';

function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  const acc = panel?.querySelector<HTMLButtonElement>('[data-menu-acc]');
  const body = acc && document.getElementById(acc.getAttribute('aria-controls') ?? '');
  if (!toggle || !panel) return;

  const root = document.documentElement;
  const ac = new AbortController();
  const on = (t: EventTarget, type: string, fn: (e: any) => void) =>
    t.addEventListener(type, fn, { signal: ac.signal });
  const isOpen = () => panel.hasAttribute('data-open');
  const items = () =>
    [toggle, ...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.getClientRects().length);

  const setAcc = (open: boolean) => {
    acc?.setAttribute('aria-expanded', String(open));
    if (body) body.hidden = !open;
  };
  const set = (open: boolean) => {
    if (open === isOpen()) return;
    panel.toggleAttribute('data-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    root.toggleAttribute('data-menu-open', open);
    if (open) {
      root.style.setProperty('--sbw', `${innerWidth - root.clientWidth}px`);
      items()[1]?.focus();
    } else {
      root.style.removeProperty('--sbw');
      setAcc(false);
    }
  };

  on(toggle, 'click', () => set(!isOpen()));
  acc && on(acc, 'click', () => setAcc(acc.getAttribute('aria-expanded') !== 'true'));
  on(panel, 'click', (e) => {
    const t = e.target as Element;
    if (t.closest('a') || !t.closest('[data-menu-inner]')) set(false);
  });
  on(matchMedia('(min-width: 1024px)'), 'change', (e: MediaQueryListEvent) => e.matches && set(false));
  on(document, 'keydown', (e: KeyboardEvent) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      set(false);
      toggle.focus();
    } else if (e.key === 'Tab') {
      const list = items();
      const i = list.indexOf(document.activeElement as HTMLElement);
      const to = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : i < 0 || i === list.length - 1 ? 0 : i + 1;
      if (i < 0 || (e.shiftKey ? i === 0 : i === list.length - 1)) {
        e.preventDefault();
        list[to].focus();
      }
    }
  });
  on(document, 'focusin', (e: FocusEvent) => {
    if (isOpen() && !panel.contains(e.target as Node) && e.target !== toggle) items()[1]?.focus();
  });
  on(document, 'astro:before-swap', () => {
    set(false);
    ac.abort();
  });
}

document.addEventListener('astro:page-load', initMobileMenu);
