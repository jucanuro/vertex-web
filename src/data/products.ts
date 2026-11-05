export interface ProductImage {
  src: string;
  width: number;
  height: number;
}

/** Captura real de un sistema. `file` es relativo a src/assets/ (p. ej. "products/qhalisys-1.png"). */
export interface Screenshot {
  file: string;
  kind: 'desktop' | 'mobile';
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Línea destacada bajo el logo (el nombre ya lo dice el logo) */
  tagline: string;
  /** Resto de la descripción, sin el tagline */
  body: string;
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
  /** Capturas reales (src/assets/products/) */
  screenshots?: Screenshot[];
}

export const products = {
  qhalisys: {
    id: 'qhalisys',
    name: 'Qhalisys',
    description:
      'SaaS propio para farmacias: punto de venta, inventario por lotes y vencimientos, multisucursal, facturación electrónica y reportes. Funciona con celulares y mini ticketera, o boleta por WhatsApp.',
    tagline: 'SaaS propio para farmacias',
    body: 'Punto de venta, inventario por lotes y vencimientos, multisucursal, facturación electrónica y reportes. Funciona con celulares y mini ticketera, o boleta por WhatsApp.',
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
    screenshots: [
      {
        file: 'products/qhalisys-1.png',
        kind: 'desktop',
        alt: 'Panel de control de Qhalisys en computadora, con los módulos de inventario, compras, traslados de stock, ventas, administración y análisis',
      },
      {
        file: 'products/qhalisys-2.png',
        kind: 'mobile',
        alt: 'Punto de venta de Qhalisys en celular, con productos por lote y vencimiento, total a cobrar y opciones para imprimir o enviar por WhatsApp',
      },
    ],
  },
  canchaya: {
    id: 'canchaya',
    name: 'Canchaya',
    description:
      'Startup propia: los dueños de canchas publican su disponibilidad y los jugadores encuentran la cancha más cercana en el horario que quieren, con reserva y pago en línea.',
    tagline: 'Startup propia',
    body: 'Los dueños de canchas publican su disponibilidad y los jugadores encuentran la cancha más cercana en el horario que quieren, con reserva y pago en línea.',
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
    screenshots: [
      {
        file: 'products/canchaya-1.png',
        kind: 'mobile',
        alt: 'Búsqueda de canchas en Canchaya: mapa con precios y canchas cercanas con calificación y horarios disponibles',
      },
      {
        file: 'products/canchaya-2.png',
        kind: 'mobile',
        alt: 'Reserva en Canchaya: confirmación de fecha y horario, y pago con Yape o tarjeta',
      },
    ],
  },
} satisfies Record<string, Product>;
