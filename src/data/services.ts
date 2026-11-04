export type Verb = 'base' | 'piensa' | 'protege' | 'escala';
export type Audience = 'negocios' | 'empresas' | 'ambos';
export type ServiceId = 'build' | 'platforms' | 'data' | 'mind' | 'shield' | 'chain';

export interface Service {
  id: ServiceId;
  brand: string;
  /** Texto SEO */
  descriptor: string;
  /** Ruta completa de la página del servicio */
  slug: string;
  verb: Verb;
  secondaryVerb?: Verb;
  audience: Audience;
  /** Color de acento (hex) */
  accent: string;
  status: 'activo' | 'proximamente';
  summary: string;
  /** Contenido interno de un <svg viewBox="0 0 24 24"> de trazo (stroke) */
  icon: string;
}

export interface VerbMeta {
  label: string;
  /** Título de columna en el mega menú */
  columnTitle: string;
  color: string;
}

export const verbs: Record<Verb, VerbMeta> = {
  piensa: { label: 'Piensa', columnTitle: 'Piensa', color: '#8B5CF6' },
  protege: { label: 'Protege', columnTitle: 'Protege', color: '#34D399' },
  escala: { label: 'Escala', columnTitle: 'Escala', color: '#22D3EE' },
  base: { label: 'La base', columnTitle: 'La base', color: '#4F8DF7' },
};

/** Orden de las columnas del mega menú */
export const verbOrder: Verb[] = ['piensa', 'protege', 'escala', 'base'];

export const services: Service[] = [
  {
    id: 'build',
    brand: 'Vertex Build',
    descriptor: 'Desarrollo de software a medida',
    slug: '/servicios/desarrollo-de-software-a-medida/',
    verb: 'base',
    audience: 'empresas',
    accent: '#4F8DF7',
    status: 'activo',
    summary: 'Sistemas construidos sobre el proceso real de tu organización, no plantillas adaptadas.',
    icon: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
  },
  {
    id: 'platforms',
    brand: 'Vertex Platforms',
    descriptor: 'Sistemas SaaS listos para usar, desde tu celular',
    slug: '/servicios/sistemas-saas/',
    verb: 'escala',
    audience: 'negocios',
    accent: '#22D3EE',
    status: 'activo',
    summary:
      'Sistemas en la nube con facturación electrónica, que usas desde tu celular sin invertir en equipos.',
    icon: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  },
  {
    id: 'mind',
    brand: 'Vertex Mind',
    descriptor: 'IA agéntica para tus procesos',
    slug: '/servicios/ia-agentica/',
    verb: 'piensa',
    audience: 'empresas',
    accent: '#8B5CF6',
    status: 'activo',
    summary:
      'Agentes de IA que cargan e interpretan información y envían mensajes automáticos, donde realmente aportan valor.',
    icon: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  },
  {
    id: 'data',
    brand: 'Quant Data',
    descriptor: 'Datos, analítica y dashboards',
    slug: '/servicios/analitica-de-datos-y-dashboards/',
    verb: 'piensa',
    audience: 'empresas',
    accent: '#818CF8',
    status: 'activo',
    summary: 'Reportes y tableros con información actualizada para decidir con datos.',
    icon: '<path d="M4 20V10M10 20V4M16 20v-7M2 20h20"/>',
  },
  {
    id: 'shield',
    brand: 'Vertex Shield',
    descriptor: 'Ciberseguridad y desarrollo seguro',
    slug: '/servicios/ciberseguridad/',
    verb: 'protege',
    audience: 'empresas',
    accent: '#34D399',
    status: 'activo',
    summary: 'Sistemas desarrollados con la seguridad como requisito desde el primer día.',
    icon: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  },
  {
    id: 'chain',
    brand: 'Vertex Chain',
    descriptor: 'Blockchain',
    slug: '/servicios/blockchain/',
    verb: 'escala',
    secondaryVerb: 'protege',
    audience: 'ambos',
    accent: '#E879F9',
    status: 'proximamente',
    summary: 'Próximamente.',
    icon: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  },
];

export const servicesById = Object.fromEntries(services.map((s) => [s.id, s])) as Record<
  ServiceId,
  Service
>;

/** Agrupa los servicios por su verbo principal (secondaryVerb no se usa para agrupar). */
export function servicesByVerb(): Record<Verb, Service[]> {
  const groups: Record<Verb, Service[]> = { piensa: [], protege: [], escala: [], base: [] };
  for (const s of services) groups[s.verb].push(s);
  return groups;
}
