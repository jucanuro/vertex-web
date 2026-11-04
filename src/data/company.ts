/**
 * Datos de la empresa. Fuente única para todas las páginas.
 */
export interface Stat {
  value: number | string;
  label: string;
}

export interface Company {
  name: string;
  slogan: string;
  philosophy: string;
  whatsapp: { number: string; display: string; message: string };
  location: string;
  markets: string;
  /** Las únicas cifras permitidas en el sitio */
  stats: Stat[];
  /** TODO: pendiente. Ningún componente renderiza estos campos mientras sean null. */
  legal: { businessName: string | null; ruc: string | null; email: string | null };
}

export const company: Company = {
  name: 'Vertex Quant Labs',
  slogan: 'Tecnología que piensa, protege y escala.',
  philosophy:
    'Creemos que la tecnología debe estar al alcance de cualquier negocio. Por eso creamos soluciones que funcionan con lo que ya tienes, y aplicamos IA solo donde realmente aporta valor. Empezamos por tu necesidad más urgente y crecemos contigo, etapa por etapa, como un socio a largo plazo.',
  whatsapp: {
    number: '51916393838',
    display: '+51 916 393 838',
    message: 'Hola, quiero agendar una reunión de diagnóstico',
  },
  location: 'Lima, Perú',
  markets: 'Atendemos clientes en Perú, Chile y España',
  stats: [
    { value: 8, label: 'organizaciones atendidas' },
    { value: 3, label: 'países: Perú, Chile y España' },
    { value: 6, label: 'meses de garantía en cada proyecto' },
    { value: '4 a 12', label: 'semanas por proyecto típico' },
  ],
  // TODO: pendiente (razón social, RUC y correo)
  legal: { businessName: null, ruc: null, email: null },
};

export const whatsappUrl = `https://wa.me/${company.whatsapp.number}?text=${encodeURIComponent(company.whatsapp.message)}`;

/** Enlace de WhatsApp con un mensaje prellenado distinto al de diagnóstico. */
export const whatsappLink = (message: string) =>
  `https://wa.me/${company.whatsapp.number}?text=${encodeURIComponent(message)}`;
