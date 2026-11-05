import { products } from './products';

export interface Client {
  slug: string;
  name: string;
  sector: string;
  country?: string;
  /**
   * Logo. Nombre de archivo en src/assets/clients/ (raster, se optimiza con astro:assets)
   * o ruta absoluta '/...' a un SVG en public/ (Qhalisys). Vacío = ícono genérico.
   */
  logo?: string;
  /** Versión para fondo oscuro. Con `logo` + `logoDark` se muestran ambas según el tema. */
  logoDark?: string;
  /** Proporción real del logo (viewBox); necesaria para width/height sin saltos de layout */
  logoSize?: { width: number; height: number };
}

export const clients: Client[] = [
  { slug: 'universidad-nacional-autonoma-de-chota', name: 'Universidad Nacional Autónoma de Chota', sector: 'Educación superior', country: 'Perú', logo: 'unach.png' },
  { slug: 'eespp-13-de-julio-de-1882', name: 'EESPP 13 de Julio de 1882', sector: 'Educación superior', country: 'Perú', logo: 'isp-san-pablo.png' },
  { slug: 'iespp-alfonso-barrantes-lingan', name: 'IESPP Alfonso Barrantes Lingán', sector: 'Educación superior', country: 'Perú', logo: 'iespp-alfonso-barrantes.png' },
  { slug: 'grupo-vicaf', name: 'Grupo VICAF', sector: 'Laboratorio', country: 'Perú', logo: 'grupo-vicaf.png' },
  { slug: 'qhalisys', name: 'Qhalisys', sector: 'Salud y farmacias', country: 'Perú', logo: products.qhalisys.logo.light, logoDark: products.qhalisys.logo.dark, logoSize: { width: products.qhalisys.logo.width, height: products.qhalisys.logo.height } },
  { slug: 'industrias-san-miguel', name: 'Industrias San Miguel', sector: 'Industria', country: 'Chile', logo: 'industrias-san-miguel.png' },
  { slug: 'viewtravel', name: 'ViewTravel', sector: 'Turismo', country: 'España', logo: 'viewtravel.png' },
  { slug: 'briela-sin-fronteras', name: 'Briela Sin Fronteras', sector: 'Sin fines de lucro', logo: 'briela-sin-fronteras.png' },
];
