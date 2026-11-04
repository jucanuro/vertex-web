// Recorre dist/ y falla si hay enlaces internos rotos (rutas o anclas #id).
// Uso: node scripts/check-links.mjs [dist]
import { existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { htmlFiles, read } from './lib.mjs';

const dist = process.argv[2] ?? 'dist';
const files = htmlFiles(dist);
const pageOf = (file) => {
  const rel = relative(dist, file).replaceAll('\\', '/');
  return '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
};
const known = new Map(); // ruta -> ids
const idsOf = (html) => new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1]));
for (const f of files) known.set(pageOf(f), idsOf(read(f)));

function resolveTarget(path) {
  // Devuelve ids si es una página HTML; true si es un archivo estático; null si no existe
  if (known.has(path)) return known.get(path);
  if (known.has(path + '/')) return known.get(path + '/');
  const file = join(dist, path);
  if (existsSync(file) && statSync(file).isFile()) return true;
  return null;
}

const broken = [];
let total = 0;
for (const f of files) {
  const html = read(f);
  const from = pageOf(f);
  for (const m of html.matchAll(/<a\s[^>]*?href=(?:"([^"]*)"|'([^']*)')/gi)) {
    const href = (m[1] ?? m[2]).trim();
    if (!href || /^(https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(href)) continue;
    total++;
    const [beforeHash, hash = ''] = href.split('#');
    const pathPart = beforeHash.split('?')[0];
    const path = pathPart === '' ? from : pathPart.startsWith('/') ? pathPart : new URL(pathPart, 'http://x' + from).pathname;
    const target = resolveTarget(decodeURI(path));
    if (target === null) broken.push(`${from} → ${href} (no existe la ruta)`);
    else if (hash && target instanceof Set && !target.has(decodeURIComponent(hash))) broken.push(`${from} → ${href} (no existe el ancla #${hash})`);
  }
}

if (broken.length) {
  console.error(`✗ ${broken.length} enlace(s) interno(s) roto(s) de ${total} revisados:`);
  for (const b of [...new Set(broken)]) console.error('  ' + b);
  process.exit(1);
}
console.log(`✓ ${total} enlaces internos revisados en ${files.length} páginas: ninguno roto.`);
