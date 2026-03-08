import type { PromptCategory } from './prompts';

export type ProgramId =
  | 'bienestar'
  | 'habitos'
  | 'insomnio'
  | 'duelo'
  | 'cuerpo'
  | 'proposito';

export interface ProgramModule {
  href: string;
  label: string;
  isPrimary?: boolean;
}

export interface Program {
  id: ProgramId;
  label: string;
  description: string;
  categories: PromptCategory[];
  defaultCategory: PromptCategory;
  featuredModules: ProgramModule[];
  claudeContext: string;
  weeklyLetterContext: string;
}

export const PROGRAMS: Record<ProgramId, Program> = {
  bienestar: {
    id: 'bienestar',
    label: 'Bienestar general',
    description: 'Exploración abierta sin un foco específico.',
    categories: ['ansiedad', 'relaciones', 'trabajo', 'general'],
    defaultCategory: 'general',
    featuredModules: [
      { href: '/session/rewrite', label: 'Reescritura' },
      { href: '/session/goals', label: 'Metas' },
      { href: '/session/aversion', label: 'Aversión' },
    ],
    claudeContext: '',
    weeklyLetterContext: '',
  },

  habitos: {
    id: 'habitos',
    label: 'Dejar un hábito',
    description: 'Para romper un ciclo que ya no te sirve.',
    categories: ['habitos', 'general'],
    defaultCategory: 'habitos',
    featuredModules: [
      { href: '/session/aversion', label: 'Aversión Guiada', isPrimary: true },
      { href: '/session/goals', label: 'Metas' },
    ],
    claudeContext: `CONTEXTO DEL PROGRAMA: El usuario está trabajando en eliminar un hábito no deseado (puede ser fumar, beber, comer compulsivamente u otro automatismo). Las micro-acciones deben estar orientadas a interrumpir el ciclo trigger-rutina-recompensa — acciones físicas concretas que rompan el automatismo en el momento del impulso. Las preguntas espejo deben explorar la función emocional que cumple el hábito (qué vacío llena, qué emoción evita), no el hábito en sí mismo. No menciones el hábito específico si no está explícito en el texto.`,
    weeklyLetterContext: `El usuario está trabajando en dejar un hábito. La carta debe nombrar los momentos donde el impulso apareció esta semana y señalar la emoción que lo precede, sin juzgar las recaídas — son datos, no fracasos.`,
  },

  insomnio: {
    id: 'insomnio',
    label: 'Mejorar el sueño',
    description: 'Para vaciar la mente y encontrar el descanso.',
    categories: ['insomnio', 'ansiedad', 'general'],
    defaultCategory: 'insomnio',
    featuredModules: [
      { href: '/session/goals', label: 'Metas', isPrimary: true },
    ],
    claudeContext: `CONTEXTO DEL PROGRAMA: El usuario tiene dificultades para dormir o descansar. Las micro-acciones deben ser rituales de cierre cognitivo: acciones físicas breves que señalen al sistema nervioso que el día terminó. Las preguntas espejo deben explorar qué quedó sin cerrar emocionalmente durante el día (qué se posterga, qué se anticipa con miedo, qué conversación quedó pendiente). Evitá sugerir acciones que impliquen usar pantallas o activar el intelecto.`,
    weeklyLetterContext: `El usuario está trabajando en mejorar su sueño. La carta debe nombrar los patrones de rumiación nocturna que aparecieron en las sesiones esta semana y señalar qué tema emocional se repite sin resolverse.`,
  },

  duelo: {
    id: 'duelo',
    label: 'Procesar una pérdida',
    description: 'Para narrar lo que duele sin tener que resolverlo.',
    categories: ['perdida', 'relaciones', 'general'],
    defaultCategory: 'perdida',
    featuredModules: [
      { href: '/session/rewrite', label: 'Reescritura', isPrimary: true },
      { href: '/session/goals', label: 'Metas' },
    ],
    claudeContext: `CONTEXTO DEL PROGRAMA: El usuario está procesando una pérdida (puede ser la muerte de alguien, una separación, un trabajo, una identidad anterior u otro cierre). Las micro-acciones deben ser rituales de reconocimiento — gestos físicos que honren la pérdida sin forzar la superación. Las preguntas espejo deben abrir espacio para nombrar lo que se extraña con precisión sensorial, sin apresurarse hacia la aceptación. El duelo necesita ser narrado, no resuelto. Nunca uses la palabra "superar" ni sus equivalentes.`,
    weeklyLetterContext: `El usuario está atravesando un proceso de duelo. La carta debe nombrar lo que fue nombrado esta semana con respeto — sin empujar hacia la resolución, señalando la valentía de seguir escribiendo sobre algo que duele.`,
  },

  cuerpo: {
    id: 'cuerpo',
    label: 'Relación con el cuerpo',
    description: 'Para reconectar con lo que el cuerpo guarda.',
    categories: ['cuerpo', 'general'],
    defaultCategory: 'cuerpo',
    featuredModules: [
      { href: '/session/goals', label: 'Metas', isPrimary: true },
    ],
    claudeContext: `CONTEXTO DEL PROGRAMA: El usuario está trabajando en su relación con el cuerpo (puede ser imagen corporal, dolor crónico, desconexión somática, recuperación de TCA u otra experiencia corporal). Las micro-acciones deben ser sensoriales y suaves — gestos de reconexión que no impliquen esfuerzo ni cambio. Las preguntas espejo deben explorar la narrativa que el usuario tiene sobre su cuerpo (de dónde viene esa voz, cuándo empezó), no el cuerpo en sí. Usá lenguaje sensorial y presente. Nunca menciones dietas, ejercicio o cambios físicos.`,
    weeklyLetterContext: `El usuario está trabajando en su relación con su cuerpo. La carta debe nombrar los momentos de reconexión que aparecieron esta semana, por pequeños que sean, y señalar qué narrativa heredada sigue apareciendo.`,
  },

  proposito: {
    id: 'proposito',
    label: 'Encontrar propósito',
    description: 'Para descubrir qué querés cuando dejás de complacer.',
    categories: ['identidad', 'trabajo', 'general'],
    defaultCategory: 'identidad',
    featuredModules: [
      { href: '/session/goals', label: 'Metas', isPrimary: true },
      { href: '/session/rewrite', label: 'Reescritura' },
    ],
    claudeContext: `CONTEXTO DEL PROGRAMA: El usuario está en un proceso de exploración de propósito e identidad (puede ser una crisis de sentido, una transición vital, o la sensación de vivir según el guión de otros). Las micro-acciones deben estar orientadas a la exploración sin presión de resultado — experimentos de baja apuesta que permitan sentir, no decidir. Las preguntas espejo deben distinguir entre lo que el usuario quiere genuinamente y lo que cree que debería querer. Nunca sugieras metas de productividad o eficiencia.`,
    weeklyLetterContext: `El usuario está explorando su propósito. La carta debe nombrar los momentos donde algo generó energía genuina esta semana (aunque haya sido pequeño) y señalar el contraste con lo que drena.`,
  },
};

export const DEFAULT_PROGRAM: ProgramId = 'bienestar';

export const PROGRAM_LIST: Program[] = Object.values(PROGRAMS);
