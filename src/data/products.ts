export interface ProductImage {
  src: string;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  status?: string;
  /** Para quién es (derivado de la descripción) */
  audience: string;
  /** Qué resuelve */
  solves: string;
  /** Funciones o módulos: solo los que aparecen en la descripción */
  features: string[];
  /** Logo completo: versión para fondo claro y para fondo oscuro (misma proporción) */
  logo: { light: string; dark: string; width: number; height: number };
  /** Ícono (sirve en ambos temas) */
  icon: ProductImage;
}

export const products = {
  qhalisys: {
    id: 'qhalisys',
    name: 'Qhalisys',
    description:
      'SaaS propio para farmacias: punto de venta, inventario por lotes y vencimientos, multisucursal, facturación electrónica y reportes. Funciona con celulares y mini ticketera, o boleta por WhatsApp.',
    slug: '/plataformas/qhalisys/',
    status: 'En operación y en constante modernización',
    audience: 'Farmacias, con una o varias sucursales.',
    solves: 'Controlar ventas, stock y sucursales sin invertir en computadoras por local.',
    features: [
      'Punto de venta',
      'Inventario por lotes y vencimientos',
      'Multisucursal',
      'Facturación electrónica',
      'Reportes',
      'Funciona con celulares y mini ticketera, o boleta por WhatsApp',
    ],
    logo: { light: '/brand/products/qhalisys-logo.svg', dark: '/brand/products/qhalisys-logo-dark.svg', width: 668.9, height: 194 },
    icon: { src: '/brand/products/qhalisys-icon.svg', width: 190, height: 190 },
  },
  canchaya: {
    id: 'canchaya',
    name: 'Canchaya',
    description:
      'Startup propia: los dueños de canchas publican su disponibilidad y los jugadores encuentran la cancha más cercana en el horario que quieren, con reserva y pago en línea.',
    slug: '/plataformas/canchaya/',
    audience: 'Dueños de canchas y jugadores.',
    solves:
      'Que los jugadores encuentren la cancha más cercana en el horario que quieren, y que los dueños publiquen su disponibilidad.',
    features: [
      'Publicación de disponibilidad por parte de los dueños de canchas',
      'Búsqueda de la cancha más cercana en el horario deseado',
      'Reserva en línea',
      'Pago en línea',
    ],
    logo: { light: '/brand/products/canchaya-logo.svg', dark: '/brand/products/canchaya-logo-dark.svg', width: 713.4, height: 196 },
    icon: { src: '/brand/products/canchaya-icon.svg', width: 144, height: 192 },
  },
} satisfies Record<string, Product>;
