import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Product } from '../data/products';

/** true si los dos archivos del logo completo existen en public/ (si no, el bloque muestra el nombre en texto visible) */
export function hasProductLogo(p: Product): boolean {
  return [p.logo.light, p.logo.dark].every((f) => existsSync(join(process.cwd(), 'public', f)));
}
