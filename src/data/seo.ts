/**
 * Metadatos SEO por ruta. Fuente única.
 * `title` se completa con " | Vertex Quant Labs" en BaseLayout: el título final debe quedar entre 50 y 60 caracteres.
 * `description`: de 140 a 160 caracteres. scripts/check-seo.mjs lo verifica sobre dist/.
 */
export interface Seo {
  title: string;
  description: string;
  noindex?: boolean;
}

export const seo = {
  '/negocios/': {
    title: 'Sistemas SaaS para negocios en Perú',
    description:
      'Sistemas en la nube con facturación electrónica que usas desde tu celular, con WhatsApp y mini ticketera. Sin comprar computadoras por cada sucursal.',
  },
  '/empresas/': {
    title: 'Software a medida e IA para empresas',
    description:
      'Software a medida, datos e IA aplicada para tu organización. Construimos sobre tu proceso real, sin plantillas, con garantía y soporte en cada proyecto.',
  },
  '/servicios/': {
    title: 'Servicios de software, datos e IA',
    description:
      'Software a medida, sistemas SaaS, analítica de datos, IA agéntica y ciberseguridad. Seis servicios que piensan, protegen y escalan con tu organización.',
  },
  '/servicios/desarrollo-de-software-a-medida/': {
    title: 'Desarrollo de software a medida',
    description:
      'Desarrollo de software a medida: sistemas de gestión, portales institucionales y repositorios digitales construidos sobre el proceso real de tu organización.',
  },
  '/servicios/sistemas-saas/': {
    title: 'SaaS con facturación electrónica',
    description:
      'Sistemas SaaS en la nube con facturación electrónica, usables desde el celular, multisucursal y con actualizaciones incluidas. Pago mensual predecible.',
  },
  '/servicios/ia-agentica/': {
    title: 'IA agéntica para procesos de negocio',
    description:
      'IA agéntica donde aporta valor: cargar e interpretar información, enviar mensajes automáticos, generar documentos y reportes, y analizar textos con propósito.',
  },
  '/servicios/analitica-de-datos-y-dashboards/': {
    title: 'Analítica de datos y dashboards',
    description:
      'Reportes y tableros con información actualizada para decidir con datos. Deja atrás los reportes que tardan días y las decisiones a ciegas en tu organización.',
  },
  '/servicios/ciberseguridad/': {
    title: 'Ciberseguridad y desarrollo seguro',
    description:
      'Ciberseguridad y desarrollo seguro: sistemas desarrollados con la seguridad como requisito desde el primer día, para proteger la información de tu organización.',
  },
  '/servicios/blockchain/': {
    title: 'Vertex Chain: blockchain, próximamente',
    description:
      'Vertex Chain, nuestra línea de blockchain, llegará próximamente. Escríbenos por WhatsApp y te avisamos cuando esté lista para tu organización o tu negocio.',
  },
  '/plataformas/qhalisys/': {
    title: 'Qhalisys: sistema para farmacias',
    description:
      'Qhalisys es un SaaS para farmacias: punto de venta, inventario por lotes y vencimientos, multisucursal, facturación electrónica y reportes desde el celular.',
  },
  '/plataformas/canchaya/': {
    title: 'Canchaya: reserva de canchas en línea',
    description:
      'Canchaya conecta a dueños de canchas con jugadores: publica tu disponibilidad, encuentra la cancha más cercana en tu horario, reserva y paga en línea.',
  },
  '/casos/': {
    title: 'Casos de éxito de software a medida',
    description:
      'Proyectos que ya están funcionando: un laboratorio de suelos, dos institutos de educación superior y una plataforma para farmacias. Filtra por servicio.',
  },
  '/casos/grupo-vicaf/': {
    title: 'Caso VICAF: sistema para laboratorio',
    description:
      'Cómo Grupo VICAF pasó de una web comercial a un sistema de operaciones de laboratorio (LIMS) integrado a su web, creciendo por etapas junto a Vertex Quant Labs.',
  },
  '/casos/instituto-san-pablo/': {
    title: 'Caso San Pablo: portal institucional',
    description:
      'Plataforma institucional con portal de transparencia, admisión, convocatorias, investigación y repositorio de tesis para el licenciamiento del instituto.',
  },
  '/casos/instituto-san-miguel/': {
    title: 'Caso San Miguel: tesis y contenido IA',
    description:
      'Sistema que analiza la similitud de cada tesis y estima el contenido generado con IA para el Instituto San Miguel. Proyecto terminado y en uso.',
  },
  '/casos/qhalisys/': {
    title: 'Caso Qhalisys: farmacias en la nube',
    description:
      'Qhalisys, nuestro producto propio para farmacias: ventas, stock y sucursales controlados en la nube desde el celular, sin computadoras por cada local.',
  },
  '/crecemos-contigo/': {
    title: 'Crecemos contigo, etapa por etapa',
    description:
      'No solo entregamos un servicio: proponemos mejoras y crecemos contigo por etapas, como un socio a largo plazo. Así empezó el caso de Grupo VICAF.',
  },
  '/nosotros/': {
    title: 'Nosotros: casa de tecnología en Perú',
    description:
      'Vertex Quant Labs es una casa de tecnología que crece contigo: software a medida, IA con propósito y soluciones accesibles para Perú, Chile y España.',
  },
  '/contacto/': {
    title: 'Agenda tu diagnóstico sin costo',
    description:
      'Agenda una reunión de diagnóstico sin costo: entendemos tu proceso y te enviamos una propuesta clara con alcance, plazo e inversión. Escríbenos por WhatsApp.',
  },
  '/privacidad/': {
    title: 'Política de privacidad',
    description:
      'Borrador de la política de privacidad de Vertex Quant Labs. Texto base genérico, en revisión legal, a la espera de completar los datos de la empresa.',
    noindex: true,
  },
  '/terminos/': {
    title: 'Términos y condiciones',
    description:
      'Borrador de los términos y condiciones de uso del sitio de Vertex Quant Labs. Texto base genérico, en revisión legal, a la espera de datos de la empresa.',
    noindex: true,
  },
  '/404/': {
    title: 'Página no encontrada',
    description:
      'La página que buscas no existe o cambió de lugar. Vuelve al inicio o elige uno de nuestros dos caminos: para negocios o para empresas, o mira los servicios.',
    noindex: true,
  },
} satisfies Record<string, Seo>;

export type SeoPath = keyof typeof seo;
