import type { ServiceId } from './services';

export interface Item {
  title: string;
  text: string;
}

export interface PathData {
  key: 'negocios' | 'empresas';
  eyebrow: string;
  h1: string;
  highlight: string;
  subtitle: string;
  /** Texto del botón principal del hero */
  cta: { audience: 'negocios' | 'empresas' };
  pain: { eyebrow: string; title: string; items: Item[] };
  offer?: { eyebrow: string; title: string; text: string; serviceId: ServiceId };
  how?: { eyebrow: string; title: string; items: Item[] };
  /** Ejemplo con producto propio */
  example?: { eyebrow: string; title: string; text: string; productId: 'qhalisys' | 'canchaya' };
  services?: { eyebrow: string; title: string; ids: ServiceId[] };
  process?: boolean;
  cases?: { eyebrow: string; title: string; ids: string[] };
  pillarIds: string[];
}

export const paths: Record<'negocios' | 'empresas', PathData> = {
  negocios: {
    key: 'negocios',
    eyebrow: 'Para negocios',
    h1: 'Sistemas listos para usar, desde tu celular',
    highlight: 'desde tu celular',
    subtitle:
      'Sistemas en la nube con facturación electrónica, sin invertir en computadoras ni equipos caros por sucursal.',
    cta: { audience: 'negocios' },
    pain: {
      eyebrow: 'Lo que suele pasar',
      title: 'Dolores típicos de un negocio que crece',
      items: [
        { title: 'Tareas manuales', text: 'Registrar ventas, stock y boletas a mano quita tiempo y deja espacio para errores.' },
        { title: 'Información dispersa', text: 'Los datos viven en cuadernos, hojas sueltas y chats, y es difícil tener el panorama completo.' },
        { title: 'Equipos caros por sucursal', text: 'Cada local nuevo obliga a comprar computadoras y equipos antes de poder operar.' },
      ],
    },
    offer: {
      eyebrow: 'Lo que ofrecemos',
      title: 'Vertex Platforms',
      text: 'Sistemas en la nube con facturación electrónica, que usas desde tu celular sin invertir en equipos.',
      serviceId: 'platforms',
    },
    how: {
      eyebrow: 'Cómo funciona',
      title: 'Con lo que ya tienes en la mano',
      items: [
        { title: 'Celulares', text: 'Usas el sistema desde tu celular, sin comprar computadoras.' },
        { title: 'WhatsApp', text: 'Puedes enviar la boleta por WhatsApp.' },
        { title: 'Mini ticketera', text: 'Si prefieres imprimir, funciona con una mini ticketera.' },
        { title: 'Facturación electrónica', text: 'Incluida en el sistema, en la nube.' },
      ],
    },
    example: {
      eyebrow: 'Un ejemplo real',
      title: 'Qhalisys, nuestro sistema para farmacias',
      text: 'Controla ventas, stock y sucursales sin invertir en computadoras por local.',
      productId: 'qhalisys',
    },
    pillarIds: ['accesible'],
  },
  empresas: {
    key: 'empresas',
    eyebrow: 'Para empresas',
    h1: 'Software a medida, datos e IA aplicada para tu organización',
    highlight: 'a medida',
    subtitle:
      'Sistemas construidos sobre el proceso real de tu organización, con soporte y garantía en cada proyecto.',
    cta: { audience: 'empresas' },
    pain: {
      eyebrow: 'El problema',
      title: 'Cuando el software no se parece a tu organización',
      items: [
        { title: 'Software genérico', text: 'Obliga a cambiar tu forma de trabajar para adaptarte a la herramienta.' },
        { title: 'Reportes que tardan', text: 'Obtener la información para decidir toma más tiempo del que debería.' },
        { title: 'Información dispersa', text: 'Los datos están repartidos en varios sistemas y archivos.' },
      ],
    },
    services: { eyebrow: 'Servicios que aplican', title: 'Cuatro servicios para tu organización', ids: ['build', 'data', 'mind', 'shield'] },
    process: true,
    cases: {
      eyebrow: 'Casos',
      title: 'Organizaciones que ya trabajan con nosotros',
      ids: ['instituto-san-pablo', 'instituto-san-miguel', 'grupo-vicaf'],
    },
    pillarIds: ['a-tu-medida', 'crecemos-contigo'],
  },
};
