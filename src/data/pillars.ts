export interface Pillar {
  id: string;
  title: string;
  description: string;
  /** Contenido interno de un <svg viewBox="0 0 24 24"> de trazo (stroke) */
  icon: string;
}

export const pillars: Pillar[] = [
  {
    id: 'accesible',
    title: 'Accesible',
    description:
      'Funciona con celulares, WhatsApp y una mini ticketera. No necesitas comprar computadoras ni equipos caros por sucursal.',
    icon: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  },
  {
    id: 'ia-con-proposito',
    title: 'IA con propósito',
    description:
      'Usamos IA solo donde aporta: cargar e interpretar información y enviar mensajes automáticos. Nunca como adorno.',
    icon: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  },
  {
    id: 'a-tu-medida',
    title: 'A tu medida',
    description: 'Para empresas con procesos ordenados: sistemas propios y personalizados.',
    icon: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  },
  {
    id: 'crecemos-contigo',
    title: 'Crecemos contigo',
    description:
      'No solo entregamos un servicio: proponemos mejoras y crecemos contigo por etapas.',
    icon: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  },
];
