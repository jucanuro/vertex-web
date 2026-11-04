import { initDropdown } from './dropdown';

function initMega(): void {
  document.querySelectorAll<HTMLElement>('[data-dropdown]').forEach((el) => initDropdown(el));
}

document.addEventListener('astro:page-load', initMega);
