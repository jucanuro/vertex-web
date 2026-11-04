import { servicesByVerb, verbOrder, verbs, services, type Service, type Verb } from './services';
import { products } from './products';

export type Locale = 'es' | 'en';
export type PathKey = 'negocios' | 'empresas';

export interface NavLink {
  label: string;
  href: string;
  /** Camino de entrada: define el gradiente del subrayado */
  path?: PathKey;
  /** Frase corta (tarjetas del menú móvil) */
  blurb?: string;
  /** Muestra un badge "Próximamente" y no se enlaza */
  soon?: boolean;
}

export interface MegaColumn {
  verb: Verb;
  title: string;
  color: string;
  items: Service[];
}

export type MainItem =
  | ({ kind: 'link' } & NavLink)
  | { kind: 'mega'; label: string; href: string; columns: MegaColumn[] };

export interface Navigation {
  main: MainItem[];
  /** Enlaces del menú móvil que van después de Servicios */
  mobileLinks: NavLink[];
  cta: NavLink;
  footer: {
    services: NavLink[];
    solutions: NavLink[];
    company: NavLink[];
    legal: NavLink[];
  };
}

const grouped = servicesByVerb();

/** Columnas del mega menú, generadas desde services.ts */
export const megaColumns: MegaColumn[] = verbOrder.map((verb) => ({
  verb,
  title: verbs[verb].columnTitle,
  color: verbs[verb].color,
  items: grouped[verb],
}));

const es: Navigation = {
  main: [
    { kind: 'link', label: 'Para negocios', href: '/negocios/', path: 'negocios', blurb: 'Sistemas listos para usar desde tu celular.' },
    { kind: 'link', label: 'Para empresas', href: '/empresas/', path: 'empresas', blurb: 'Software a medida, datos e IA aplicada.' },
    { kind: 'mega', label: 'Servicios', href: '/servicios/', columns: megaColumns },
    { kind: 'link', label: 'Casos', href: '/casos/' },
    { kind: 'link', label: 'Nosotros', href: '/nosotros/' },
    // TODO: añadir 'Blog' (/blog/) cuando exista la página
  ],
  mobileLinks: [
    { label: 'Casos', href: '/casos/' },
    { label: 'Crecemos contigo', href: '/crecemos-contigo/' },
    { label: 'Nosotros', href: '/nosotros/' },
    // TODO: añadir { label: 'Blog', href: '/blog/' } cuando exista la página
  ],
  cta: { label: 'Agenda tu diagnóstico', href: '/contacto/' },
  footer: {
    services: services.map((s) => ({
      label: s.brand,
      href: s.slug,
      soon: s.status === 'proximamente',
    })),
    solutions: [
      { label: 'Para negocios', href: '/negocios/' },
      { label: 'Para empresas', href: '/empresas/' },
      { label: products.qhalisys.name, href: products.qhalisys.slug },
      { label: products.canchaya.name, href: products.canchaya.slug },
    ],
    company: [
      { label: 'Crecemos contigo', href: '/crecemos-contigo/' },
      { label: 'Casos', href: '/casos/' },
      { label: 'Nosotros', href: '/nosotros/' },
      { label: 'Contacto', href: '/contacto/' },
    ],
    legal: [
      { label: 'Privacidad', href: '/privacidad/' },
      { label: 'Términos', href: '/terminos/' },
    ],
  },
};

/** Navegación por idioma. El inglés se completará más adelante bajo /en/. */
export const navigation: Record<Locale, Navigation> = {
  es,
  // TODO: traducir cuando se active /en/
  en: { ...es, cta: { label: 'Book your assessment', href: '/en/contact/' } },
};
