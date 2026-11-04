// Contraste WCAG AA de los tokens de color de ambos temas, leídos de src/styles/global.css.
// Uso: node scripts/check-contrast.mjs   (sale con código 1 si algún par baja del mínimo)
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

function block(selectorStart) {
  const i = css.indexOf(selectorStart);
  if (i < 0) throw new Error(`No se encontró el bloque ${selectorStart}`);
  const open = css.indexOf('{', i);
  let depth = 0;
  for (let j = open; j < css.length; j++) {
    if (css[j] === '{') depth++;
    if (css[j] === '}' && --depth === 0) return css.slice(open + 1, j);
  }
  throw new Error('Bloque sin cerrar');
}
const decls = (body) => Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].replace(/\s+/g, ' ').trim()]));

const dark = decls(block(":root,\n[data-theme='dark']"));
const themes = { dark, light: { ...dark, ...decls(block("/* Tema claro */\n[data-theme='light']")) } };

const resolve = (vars, v, depth = 0) =>
  depth > 8 ? v : v.replace(/var\((--[\w-]+)\)/g, (_, n) => resolve(vars, vars[n] ?? '', depth + 1));

/** Devuelve [r,g,b,a] (0-255, a 0-1) de #hex o rgb(r g b / a) */
function color(str) {
  str = str.trim();
  let m = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = [...h].map((c) => c + c).join('');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1);
  }
  m = str.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[/,]\s*([\d.]+))?\s*\)$/);
  if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  throw new Error(`Color no soportado: ${str}`);
}
const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
const lum = ([r, g, b]) => {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const hexes = (str) => [...str.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => color(m[0]));

// Colores del tema oscuro heredados del diseño original (el tema oscuro no se modifica): se avisan como WARN
// y no fallan el script. El tema claro no admite excepciones.
const KNOWN_DARK = [
  /^(accent-mind|verb-piensa) \/ (bg-alt|glass\/)/, // violeta #8B5CF6 sobre bg-alt y vidrio: 3.8 a 4.3
  /^gradient-(brand|empresas)\[0\] .* \/ bg-alt/, // extremo azul #1F5FB8 en texto grande sobre bg-alt: 2.9
  /^path-card empresas texto/, // blanco sobre el extremo violeta del degradado: 4.2
];
let fails = 0;
let warns = 0;
let total = 0;
function check(theme, label, fg, bg, min) {
  total++;
  const r = ratio(fg, bg);
  const ok = r >= min;
  const known = !ok && theme === 'dark' && KNOWN_DARK.some((re) => re.test(label));
  if (!ok && !known) fails++;
  if (known) warns++;
  console.log(`${ok ? 'ok  ' : known ? 'WARN' : 'FAIL'} [${theme}] ${label}: ${r.toFixed(2)} (mín ${min})`);
}

for (const [theme, vars] of Object.entries(themes)) {
  const v = (n) => color(resolve(vars, vars[n]));
  const grads = (n) => hexes(resolve(vars, vars[n]));
  const bgs = { bg: v('--c-bg'), 'bg-alt': v('--c-bg-alt'), surface: v('--c-surface') };
  // Tarjetas de vidrio: la capa --glass compuesta sobre cada fondo
  const glass = color(vars['--glass']);
  const surfaces = { ...bgs, 'glass/bg': over(glass, bgs.bg), 'glass/bg-alt': over(glass, bgs['bg-alt']) };

  for (const [bn, b] of Object.entries(surfaces)) {
    check(theme, `text / ${bn}`, v('--c-text'), b, 4.5);
    check(theme, `text-muted / ${bn}`, v('--c-text-muted'), b, 4.5);
    if (bn !== 'surface') check(theme, `primary / ${bn}`, v('--c-primary'), b, 4.5);
    if (bn === 'surface') continue; // --c-surface solo aloja placeholders con texto base/atenuado
    for (const a of ['build', 'platforms', 'data', 'mind', 'shield', 'chain']) check(theme, `accent-${a} / ${bn}`, v(`--accent-${a}`), b, 4.5);
    for (const a of ['piensa', 'protege', 'escala']) check(theme, `verb-${a} / ${bn}`, v(`--verb-${a}`), b, 4.5);
  }
  for (const bn of ['bg', 'bg-alt']) {
    // Texto con degradado (cifras y titulares grandes): 3:1
    for (const g of ['brand', 'ai', 'negocios', 'empresas'])
      grads(`--gradient-${g}`).forEach((c, i) => check(theme, `gradient-${g}[${i}] (texto grande) / ${bn}`, c, bgs[bn], 3));
    check(theme, `logo-text-2 / ${bn}`, v('--logo-text-2'), bgs[bn], 4.5);
    grads('--logo-text').forEach((c, i) => check(theme, `logo-text[${i}] / ${bn}`, c, bgs[bn], 3));
  }
  // Elementos de interfaz (3:1): anillo de foco y nodos del logo
  check(theme, 'foco (primary) / bg', v('--c-primary'), bgs.bg, 3);
  check(theme, 'logo nodo trazo / relleno', v('--logo-node-stroke'), v('--logo-node-fill'), 3);
  // Texto sobre botones y tarjetas de camino
  grads('--btn-bg').forEach((c, i) => check(theme, `btn-primary texto / degradado[${i}]`, v('--c-on-primary'), c, 4.5));
  grads('--gradient-negocios').forEach((c, i) => check(theme, `path-card negocios texto / [${i}]`, v('--on-negocios'), c, 4.5));
  grads('--gradient-empresas').forEach((c, i) => check(theme, `path-card empresas texto / [${i}]`, v('--on-empresas'), c, 4.5));
}

console.log(`\n${total - fails - warns}/${total} pares cumplen, ${warns} aviso(s) del tema oscuro heredado`);
if (fails) {
  console.error(`${fails} par(es) por debajo del mínimo`);
  process.exit(1);
}
