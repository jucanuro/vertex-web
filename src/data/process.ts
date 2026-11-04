export interface ProcessStep {
  title: string;
  text: string;
}

/** Los 5 pasos de "Cómo trabajamos". Fuente única (home, servicios, empresas, nosotros, contacto). */
export const processSteps: ProcessStep[] = [
  { title: 'Reunión de diagnóstico', text: 'Sin costo. Entendemos tu proceso y lo que necesitas mejorar.' },
  { title: 'Propuesta clara', text: 'Alcance, plazo e inversión definidos antes de empezar.' },
  { title: 'Desarrollo', text: 'De 4 a 12 semanas, con avances que revisas en cada etapa.' },
  { title: 'Entrega y capacitación', text: 'Puesta en marcha y capacitación a tu equipo.' },
  { title: 'Garantía y soporte', text: '6 meses de garantía; te acompañamos después de la entrega.' },
];
