import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

export const htmlFiles = (dist) => walk(dist).filter((f) => f.endsWith('.html'));
export const read = (f) => readFileSync(f, 'utf8');
