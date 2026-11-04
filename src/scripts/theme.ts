// Botón de tema. La decisión inicial la toma el script inline de BaseLayout (sin parpadeo);
// aquí solo se alterna, se guarda ("vql-theme") y se mantienen theme-color y aria al día.
type Theme = 'light' | 'dark';
const KEY = 'vql-theme';
const COLOR: Record<Theme, string> = { light: '#F6F9FC', dark: '#050B14' };
const root = document.documentElement;
const current = (): Theme => (root.dataset.theme === 'light' ? 'light' : 'dark');

function stored(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function apply(t: Theme) {
  root.dataset.theme = t;
  document.querySelectorAll<HTMLMetaElement>('meta[name=theme-color]').forEach((m) => (m.content = COLOR[t]));
  const label = t === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro';
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-label', label);
    b.title = label;
    b.setAttribute('aria-pressed', String(t === 'dark')); // pulsado = tema oscuro activo
  });
  document.dispatchEvent(new CustomEvent('themechange', { detail: t }));
}

document.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('[data-theme-toggle]')) return;
  const next: Theme = current() === 'light' ? 'dark' : 'light';
  try {
    localStorage.setItem(KEY, next);
  } catch {}
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('theme-anim');
    setTimeout(() => root.classList.remove('theme-anim'), 220);
  }
  apply(next);
});

// Sin elección manual, se sigue la preferencia del sistema
matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (!stored()) apply(e.matches ? 'light' : 'dark');
});

// View Transitions: el documento nuevo llega sin data-theme; se fija antes del intercambio (sin parpadeo)
document.addEventListener('astro:before-swap', (e) => {
  (e as Event & { newDocument: Document }).newDocument.documentElement.dataset.theme = current();
});
document.addEventListener('astro:page-load', () => apply(current()));
apply(current());
