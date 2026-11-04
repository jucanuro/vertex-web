// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// URL base por entorno: SITE_URL en pruebas (p. ej. https://vertex-web.<cuenta>.workers.dev)
const site = (process.env.SITE_URL ?? 'https://vertexquantlabs.com').replace(/\/+$/, '');

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Páginas con noindex: no deben entrar al sitemap
      filter: (page) => !/\/(design-system|privacidad|terminos)\/$/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
