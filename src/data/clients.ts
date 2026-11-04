export interface Client {
  slug: string;
  name: string;
  sector: string;
  country?: string;
  /** Ruta del logo, p. ej. '/clients/<slug>.svg'. Vacío = se muestra el marcador provisional. */
  logo?: string;
}

export const clients: Client[] = [
  { slug: 'universidad-nacional-autonoma-de-chota', name: 'Universidad Nacional Autónoma de Chota', sector: 'Educación superior', country: 'Perú' },
  { slug: 'eespp-13-de-julio-de-1882', name: 'EESPP 13 de Julio de 1882', sector: 'Educación superior', country: 'Perú' },
  { slug: 'iespp-alfonso-barrantes-lingan', name: 'IESPP Alfonso Barrantes Lingán', sector: 'Educación superior', country: 'Perú' },
  { slug: 'grupo-vicaf', name: 'Grupo VICAF', sector: 'Laboratorio', country: 'Perú' },
  { slug: 'qhalisys', name: 'Qhalisys', sector: 'Salud y farmacias', country: 'Perú' },
  { slug: 'industrias-san-miguel', name: 'Industrias San Miguel', sector: 'Industria', country: 'Chile' },
  { slug: 'viewtravel', name: 'ViewTravel', sector: 'Turismo', country: 'España' },
  { slug: 'briela-sin-fronteras', name: 'Briela Sin Fronteras', sector: 'Sin fines de lucro' },
];
