# Vertex Quant Labs — sitio web

Astro 7 + TypeScript (strict) + Tailwind. Salida estática.

## Desarrollo

```sh
npm install
npm run dev        # http://localhost:4321
npx astro check    # tipos
npm run build      # genera dist/
npm run preview
```

Requiere Node >= 22.23.4 (ver `.nvmrc` y `engines`).

## Despliegue

Destino: Cloudflare (Workers con static assets o Pages), desde GitHub.

### Variables de entorno

Ver `.env.example`. Se leen **en el build**, así que hay que definirlas en Cloudflare (Build variables) antes de compilar.

| Variable | Descripción | Por defecto |
| :-- | :-- | :-- |
| `SITE_URL` | URL base del sitio. Alimenta `site`, canonical, Open Graph, JSON-LD, sitemap y robots.txt. | `https://vertexquantlabs.com` |
| `ALLOW_INDEXING` | Solo `"true"` permite indexación. Cualquier otro valor (o sin definir) agrega `<meta name="robots" content="noindex, nofollow">` a todas las páginas y genera `robots.txt` con `Disallow: /`. | sin definir (modo prueba) |

`/design-system/`, `/privacidad/`, `/terminos/` y `/404` llevan siempre `noindex` y no entran al sitemap.

### Build y salida

- Comando de build: `npm run build`
- Directorio de salida: `dist/` (incluye `404.html`, `_headers`, `robots.txt` y `sitemap-index.xml`)
- `wrangler.jsonc` ya define `assets.directory: "./dist"` y `not_found_handling: "404-page"`.

### Probar en una URL de Cloudflare (sin indexar)

1. Conectar el repositorio de GitHub a Cloudflare.
2. Variables: `SITE_URL=https://<proyecto>.workers.dev` (la URL que asigne Cloudflare) y **no** definir `ALLOW_INDEXING`.
3. Verificar: `noindex` en el HTML y `Disallow: /` en `/robots.txt`.

### Pasar a producción

1. Conectar el dominio `vertexquantlabs.com` al proyecto en Cloudflare.
2. Definir `SITE_URL=https://vertexquantlabs.com` y `ALLOW_INDEXING=true`.
3. Volver a desplegar (las variables se aplican en el build).
4. Verificar: sin `noindex` en las páginas públicas, `/robots.txt` con `Sitemap: https://vertexquantlabs.com/sitemap-index.xml`, canonical con el dominio real.
5. Enviar el sitemap en Google Search Console.

### Cabeceras y caché

`public/_headers`: cabeceras de seguridad en todas las rutas, `immutable` para `/_astro/*` (nombres con hash) y 1 día para `/brand/*` (sin hash). HTML con `max-age=0, must-revalidate`.

### TODO

- **Content-Security-Policy**: no incluida a propósito. Definirla cuando esté listo el formulario de contacto con Cloudflare Turnstile (hay que permitir `challenges.cloudflare.com` en `script-src`, `frame-src` y `connect-src`) y el resto de orígenes externos.
