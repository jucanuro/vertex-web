// Verifica en dist/: un único h1, title y description únicos (y con longitud adecuada en páginas indexables), canonical.
// Uso: node scripts/check-seo.mjs [dist]
import { relative } from 'node:path';
import { htmlFiles, read } from './lib.mjs';

const dist = process.argv[2] ?? 'dist';
const problems = [];
const titles = new Map();
const descs = new Map();
const decode = (s) => s.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"');

for (const f of htmlFiles(dist)) {
  const page = '/' + relative(dist, f).replace(/index\.html$/, '');
  const html = read(f);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (h1s !== 1) problems.push(`${page}: ${h1s} h1 (debe haber 1)`);
  if (!title) problems.push(`${page}: sin title`);
  if (!desc) problems.push(`${page}: sin description`);
  if (!canonical) problems.push(`${page}: sin canonical`);
  if (title) titles.set(title, [...(titles.get(title) ?? []), page]);
  if (desc) descs.set(desc, [...(descs.get(desc) ?? []), page]);
  if (!noindex) {
    if (title.length < 50 || title.length > 60) problems.push(`${page}: title de ${title.length} caracteres (50-60): "${title}"`);
    if (desc.length < 140 || desc.length > 160) problems.push(`${page}: description de ${desc.length} caracteres (140-160)`);
  }
}
for (const [t, pages] of titles) if (pages.length > 1) problems.push(`title repetido "${t}": ${pages.join(', ')}`);
for (const [, pages] of descs) if (pages.length > 1) problems.push(`description repetida en: ${pages.join(', ')}`);

if (problems.length) {
  console.error(`✗ ${problems.length} problema(s):`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log(`✓ ${titles.size} páginas: un h1, title y description únicos.`);
