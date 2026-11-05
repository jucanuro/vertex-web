import { products, type Screenshot } from './products';
import type { ServiceId } from './services';

export interface CaseStudy {
  id: string;
  name: string;
  shortName?: string;
  kind: 'cliente' | 'producto propio';
  sector: string;
  location?: string;
  challenge: string;
  solution: string;
  result: string;
  stages?: string[];
  services: ServiceId[];
  /** Capturas reales (src/assets/cases/) */
  screenshots?: Screenshot[];
}

export const cases: CaseStudy[] = [
  {
    id: 'grupo-vicaf',
    name: 'Grupo VICAF',
    kind: 'cliente',
    sector: 'Laboratorio de suelos',
    location: 'Cajamarca, Perú',
    challenge: 'Gestionar la operación del laboratorio y captar clientes desde un mismo lugar.',
    solution:
      'Empezamos con su web comercial, propusimos mejoras y hoy operan con un sistema de operaciones de laboratorio (LIMS) integrado a su web.',
    result: 'Operación y canal comercial en una sola plataforma.',
    stages: ['Web comercial', 'Mejoras propuestas', 'Sistema de operaciones (LIMS)', 'Siguiente etapa'],
    services: ['build'],
    screenshots: [
      {
        file: 'cases/vicaf-1.png',
        kind: 'desktop',
        alt: 'Panel del sistema de operación del laboratorio de Grupo VICAF',
      },
    ],
  },
  {
    id: 'instituto-san-pablo',
    name: 'EESPP 13 de Julio de 1882',
    shortName: 'Instituto San Pablo',
    kind: 'cliente',
    sector: 'Educación superior',
    location: 'San Pablo, Cajamarca, Perú',
    challenge:
      'Cumplir los estándares de transparencia y gestión institucional exigidos en el licenciamiento.',
    solution:
      'Plataforma institucional con portal de transparencia, admisión, convocatorias, investigación y repositorio institucional de tesis.',
    result: 'Fuimos parte del proceso de licenciamiento como aliado tecnológico.',
    services: ['build'],
  },
  {
    id: 'instituto-san-miguel',
    name: 'IESPP Alfonso Barrantes Lingán',
    shortName: 'Instituto San Miguel',
    kind: 'cliente',
    sector: 'Educación superior',
    location: 'San Miguel, Cajamarca, Perú',
    challenge: 'Verificar la originalidad de las tesis y detectar textos generados con IA.',
    solution:
      'Sistema que analiza la similitud de cada tesis y estima el contenido generado con IA.',
    result: 'Proyecto terminado y en uso por la institución.',
    services: ['mind', 'build'],
  },
  {
    id: 'qhalisys',
    name: 'Qhalisys',
    kind: 'producto propio',
    sector: 'Salud y farmacias',
    challenge: 'Controlar ventas, stock y sucursales sin invertir en computadoras por local.',
    solution: products.qhalisys.description,
    result: 'Toda la operación en la nube, desde el celular.',
    services: ['platforms'],
  },
];
