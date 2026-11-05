import type { ImageMetadata } from 'astro';

const files = import.meta.glob<ImageMetadata>('/src/assets/clients/*.{png,jpg,svg}', {
  eager: true,
  import: 'default',
});

/** Logo raster de un cliente a partir del nombre de archivo en src/assets/clients/ (campo `logo` de clients.ts). */
export function getClientLogo(file?: string): ImageMetadata | undefined {
  if (!file || file.startsWith('/')) return undefined;
  return files[`/src/assets/clients/${file}`];
}
