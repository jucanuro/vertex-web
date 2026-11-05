import type { ImageMetadata } from 'astro';
import type { Screenshot } from '../data/products';

// Un solo glob para productos y casos: Astro las optimiza al referenciarlas con <Picture>/getImage.
const files = import.meta.glob<ImageMetadata>('/src/assets/{products,cases}/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

export interface ResolvedScreenshot extends Screenshot {
  image: ImageMetadata;
}

/** Resuelve las capturas declaradas en los datos. Las que no existen en disco se omiten (el showcase cae al marcador). */
export function resolveScreenshots(list?: Screenshot[]): ResolvedScreenshot[] {
  const out: ResolvedScreenshot[] = [];
  for (const s of list ?? []) {
    const image = files[`/src/assets/${s.file}`];
    if (image) out.push({ ...s, image });
    else console.warn(`[screenshots] Falta src/assets/${s.file}`);
  }
  return out;
}

/** Calidad y anchos por tipo: mantienen cada archivo servido bajo 90 KB (escritorio) y 60 KB (celular). */
export const shotConfig = {
  desktop: { widths: [480, 800, 1200], quality: 80 },
  mobile: { widths: [320, 480, 780], quality: 78 },
} as const;
