export interface Prompt {
  id: string;
  category: 'ansiedad' | 'relaciones' | 'trabajo' | 'general';
  text: string;
}

export const PROMPTS: Prompt[] = [
  // General / autoconocimiento
  {
    id: 'g1',
    category: 'general',
    text: '¿Qué es lo que en realidad no te atreves a decirte a ti mismo hoy?',
  },
  {
    id: 'g2',
    category: 'general',
    text: 'Escribe sobre algo que estás evitando pensar. No lo planees — empieza y sigue.',
  },
  {
    id: 'g3',
    category: 'general',
    text: '¿Qué haría la versión de ti que no tiene miedo?',
  },
  {
    id: 'g4',
    category: 'general',
    text: 'Describe con todo detalle cómo quieres sentirte en 3 meses. No lo que quieres hacer — cómo quieres sentirte.',
  },
  // Ansiedad
  {
    id: 'a1',
    category: 'ansiedad',
    text: '¿Qué es lo peor que podría pasar? Escríbelo todo. No lo controles.',
  },
  {
    id: 'a2',
    category: 'ansiedad',
    text: 'Tu cuerpo sabe algo que tu mente está ignorando. ¿Qué siente ahora mismo, desde los pies hasta la cabeza?',
  },
  {
    id: 'a3',
    category: 'ansiedad',
    text: '¿Qué necesitas que alguien te diga hoy, pero no te lo van a decir?',
  },
  // Relaciones
  {
    id: 'r1',
    category: 'relaciones',
    text: 'Hay algo que no le has dicho a alguien importante. Escríbelo aquí, sin filtros.',
  },
  {
    id: 'r2',
    category: 'relaciones',
    text: '¿Qué patrón sigues en tus relaciones que sabes que no te sirve pero sigues repitiendo?',
  },
  // Trabajo
  {
    id: 'w1',
    category: 'trabajo',
    text: 'Si nadie te juzgara, ¿qué cambiarías de tu vida profesional mañana mismo?',
  },
  {
    id: 'w2',
    category: 'trabajo',
    text: '¿Qué parte de tu trabajo te drena más? Escribe sobre eso sin intentar encontrar soluciones.',
  },
];

export function getRandomPrompt(category?: Prompt['category']): Prompt {
  const pool = category ? PROMPTS.filter((p) => p.category === category) : PROMPTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
