/*
 * REGLA: Los menús desplegables no deben tener huecos entre el botón y el panel,
 * deben tolerar el movimiento diagonal del cursor y cerrar con un retardo de unos 350ms.
 *
 * Uso: el `root` contiene el botón (primer <button>) y un `[data-dropdown-panel]`.
 * El panel (y su puente invisible) deben ser DESCENDIENTES de `root`, así el área
 * hover es una sola. El estado se expone en `root[data-open]` y `aria-expanded`;
 * el CSS anima con opacity/transform y visibility (nunca display:none).
 */

export interface DropdownOptions {
  /** Retardo de apertura por hover (ms). */
  openDelay?: number;
  /** Retardo de cierre al salir del área (ms). */
  closeDelay?: number;
  /** Media query donde el hover está activo. */
  hoverQuery?: string;
}

export const DROPDOWN_DEFAULTS = {
  openDelay: 80,
  closeDelay: 350,
  hoverQuery: '(hover: hover) and (min-width: 1024px)',
} satisfies Required<DropdownOptions>;

interface Instance {
  close: () => void;
  isOpen: () => boolean;
}
const instances = new Set<Instance>();

export function initDropdown(root: HTMLElement, options: DropdownOptions = {}): () => void {
  const { openDelay, closeDelay, hoverQuery } = { ...DROPDOWN_DEFAULTS, ...options };
  const btn = root.querySelector<HTMLButtonElement>('button');
  const panel = root.querySelector<HTMLElement>('[data-dropdown-panel]');
  if (!btn || !panel) return () => {};

  const ac = new AbortController();
  const on = (t: EventTarget, type: string, fn: (e: any) => void) =>
    t.addEventListener(type, fn, { signal: ac.signal });
  let timer = 0;
  let pinned = false;
  const isOpen = () => root.hasAttribute('data-open');

  const set = (open: boolean) => {
    clearTimeout(timer);
    if (open) {
      for (const i of instances) if (i !== self) i.close();
    } else pinned = false;
    root.toggleAttribute('data-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  const self: Instance = { close: () => set(false), isOpen };
  instances.add(self);

  const schedule = (open: boolean) => {
    if (!matchMedia(hoverQuery).matches || pinned) return;
    clearTimeout(timer);
    if (open === isOpen()) return;
    // Cambiar de un menú a otro es inmediato; abrir desde cero espera openDelay.
    const switching = open && [...instances].some((i) => i !== self && i.isOpen());
    timer = window.setTimeout(set, open ? (switching ? 0 : openDelay) : closeDelay, open);
  };

  on(root, 'mouseenter', () => schedule(true));
  on(root, 'mouseleave', () => schedule(false));

  on(btn, 'click', () => {
    clearTimeout(timer);
    if (isOpen() && pinned) {
      set(false);
    } else {
      set(true);
      pinned = true;
    }
  });

  on(root, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen()) {
      set(false);
      btn.focus();
    } else if (e.key === 'ArrowDown' && e.target === btn) {
      e.preventDefault();
      if (!isOpen()) {
        set(true);
        pinned = true;
      }
      panel.querySelector<HTMLElement>('a[href]')?.focus();
    }
  });

  on(root, 'focusout', (e: FocusEvent) => {
    const to = e.relatedTarget as Node | null;
    if (to && !root.contains(to)) self.close();
  });

  on(panel, 'click', (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) self.close();
  });

  on(document, 'click', (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) self.close();
  });

  const destroy = () => {
    clearTimeout(timer);
    self.close();
    instances.delete(self);
    ac.abort();
  };
  document.addEventListener('astro:before-swap', destroy, { once: true, signal: ac.signal });
  return destroy;
}
