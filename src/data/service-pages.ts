import type { ServiceId } from './services';

export interface ServicePage {
  h1: string;
  highlight: string;
  subtitle: string;
  /** Lista "Incluye" / "Qué hacemos" */
  includes?: { title: string; items: string[] };
  /** Problema que resuelve */
  problem?: { title: string; text: string };
  /** Muestra la sección de formas de contratar y el bloque de garantía (solo Build y Platforms) */
  contracting?: boolean;
  /** Muestra "Cómo trabajamos" */
  process?: boolean;
  caseIds?: string[];
  productIds?: ('qhalisys' | 'canchaya')[];
  /** Bloque "IA con propósito" */
  purposeBlock?: boolean;
  /** Sección con ImagePlaceholder cuando no hay más contenido */
  placeholder?: string;
  /** Idea central adicional (texto) */
  idea?: string;
  related: ServiceId[];
}

export const servicePages: Record<ServiceId, ServicePage> = {
  build: {
    h1: 'Desarrollo de software a medida para tu organización',
    highlight: 'a medida',
    subtitle: 'Sistemas construidos sobre el proceso real de tu organización, no plantillas adaptadas.',
    includes: {
      title: 'Qué incluye',
      items: [
        'Sistemas de gestión y operación',
        'Plataformas institucionales y portales de transparencia',
        'Repositorios y bibliotecas digitales',
        'Integración con los sistemas que ya usas',
      ],
    },
    contracting: true,
    process: true,
    caseIds: ['grupo-vicaf', 'instituto-san-pablo'],
    related: ['mind', 'data'],
  },
  platforms: {
    h1: 'Sistemas SaaS listos para usar, desde tu celular',
    highlight: 'desde tu celular',
    subtitle: 'Sistemas en la nube con facturación electrónica, que usas desde tu celular sin invertir en equipos.',
    includes: {
      title: 'Qué incluye',
      items: [
        'Sistemas SaaS en la nube con facturación electrónica',
        'Usables desde el celular',
        'Acceso desde cualquier lugar y dispositivo',
        'Multisucursal y multiusuario',
        'Actualizaciones continuas incluidas',
        'Pago mensual predecible',
      ],
    },
    contracting: true,
    process: true,
    productIds: ['qhalisys', 'canchaya'],
    related: ['build', 'mind'],
  },
  data: {
    h1: 'Analítica de datos y dashboards para decidir con datos',
    highlight: 'decidir con datos',
    subtitle: 'Reportes y tableros con información actualizada para decidir con datos.',
    problem: {
      title: 'El problema que resolvemos',
      text: 'Reportes que tardan días y decisiones a ciegas.',
    },
    process: true,
    placeholder: 'Espacio para un ejemplo de dashboard',
    related: ['build', 'mind'],
  },
  mind: {
    h1: 'IA agéntica para tus procesos, donde aporta valor',
    highlight: 'IA agéntica',
    subtitle: 'IA agéntica donde aporta valor, nunca como adorno.',
    includes: {
      title: 'Dónde aplicamos IA',
      items: [
        'Cargar e interpretar información',
        'Mensajes automáticos',
        'Generación de documentos y reportes',
        'Análisis de textos y detección de contenido generado con IA',
      ],
    },
    purposeBlock: true,
    process: true,
    caseIds: ['instituto-san-miguel'],
    related: ['data', 'build'],
  },
  shield: {
    h1: 'Ciberseguridad y desarrollo seguro desde el primer día',
    highlight: 'desde el primer día',
    subtitle: 'Sistemas desarrollados con la seguridad como requisito desde el primer día.',
    idea: 'La seguridad como requisito desde el primer día.',
    process: true,
    placeholder: 'Espacio para el detalle del servicio',
    related: ['build', 'data'],
  },
  chain: {
    h1: 'Vertex Chain: blockchain, próximamente',
    highlight: 'próximamente',
    subtitle: 'Estamos preparando nuestra línea de blockchain.',
    related: ['build', 'shield'],
  },
};

export const contractingForms = [
  {
    title: 'Proyecto a medida',
    text: 'Pago en 2 o 3 partes, según el avance del proyecto.',
  },
  {
    title: 'Plataforma SaaS',
    text: 'Suscripción mensual.',
  },
  {
    title: 'Nuevos desarrollos',
    text: 'Se acuerdan según lo que necesites.',
  },
];

export const guarantee = '6 meses de garantía y soporte en cada proyecto; las correcciones no tienen costo.';
