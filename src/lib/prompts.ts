export type PromptDepth = 'superficie' | 'patron' | 'transformacion';

export interface Prompt {
  id: string;
  category: 'ansiedad' | 'relaciones' | 'trabajo' | 'general';
  depth: PromptDepth;
  text: string;
}

export const DEPTH_LABELS: Record<PromptDepth, string> = {
  superficie: 'Superficie',
  patron: 'Patrón',
  transformacion: 'Transformación',
};

export function getDepthFromSessionCount(count: number): PromptDepth {
  if (count < 7) return 'superficie';
  if (count < 14) return 'patron';
  return 'transformacion';
}

export const PROMPTS: Prompt[] = [
  // ── General / superficie ──────────────────────────────────────────────────
  {
    id: 'g-s1',
    category: 'general',
    depth: 'superficie',
    text: '¿Qué es lo que cargás hoy que todavía no pusiste en palabras?',
  },
  {
    id: 'g-s2',
    category: 'general',
    depth: 'superficie',
    text: 'Describí cómo llegaste al día. ¿Qué pasó en tu cuerpo cuando te despertaste?',
  },
  // ── General / patrón ─────────────────────────────────────────────────────
  {
    id: 'g-p1',
    category: 'general',
    depth: 'patron',
    text: '¿Qué es lo que en realidad no te atreves a decirte a vos mismo hoy?',
  },
  {
    id: 'g-p2',
    category: 'general',
    depth: 'patron',
    text: 'Escribí sobre algo que estás evitando pensar. No lo planees — empezá y seguí.',
  },
  {
    id: 'g-p3',
    category: 'general',
    depth: 'patron',
    text: '¿Qué situación que viviste esta semana te resulta familiar? ¿Cuándo la viviste antes?',
  },
  // ── General / transformación ──────────────────────────────────────────────
  {
    id: 'g-t1',
    category: 'general',
    depth: 'transformacion',
    text: '¿Qué haría la versión de vos que ya cruzó el puente?',
  },
  {
    id: 'g-t2',
    category: 'general',
    depth: 'transformacion',
    text: 'Describí con todo detalle cómo querés sentirte en 3 meses. No lo que querés hacer — cómo querés sentirte.',
  },
  {
    id: 'g-t3',
    category: 'general',
    depth: 'transformacion',
    text: '¿Qué creencia sobre vos mismo estás listo para dejar ir?',
  },

  // ── Ansiedad / superficie ─────────────────────────────────────────────────
  {
    id: 'a-s1',
    category: 'ansiedad',
    depth: 'superficie',
    text: '¿Qué es lo peor que podría pasar? Escribilo todo. No lo controles.',
  },
  {
    id: 'a-s2',
    category: 'ansiedad',
    depth: 'superficie',
    text: 'Tu cuerpo sabe algo que tu mente está ignorando. ¿Qué sentís ahora mismo, desde los pies hasta la cabeza?',
  },
  {
    id: 'a-s3',
    category: 'ansiedad',
    depth: 'superficie',
    text: '¿Qué necesitás que alguien te diga hoy, pero no te lo van a decir?',
  },
  // ── Ansiedad / patrón ────────────────────────────────────────────────────
  {
    id: 'a-p1',
    category: 'ansiedad',
    depth: 'patron',
    text: '¿Qué evitaste hacer hoy por la ansiedad? ¿Cuál es el relato que te contaste para justificarlo?',
  },
  {
    id: 'a-p2',
    category: 'ansiedad',
    depth: 'patron',
    text: '¿En qué tipo de situaciones aparece la ansiedad casi siempre? ¿Qué tienen en común?',
  },
  // ── Ansiedad / transformación ─────────────────────────────────────────────
  {
    id: 'a-t1',
    category: 'ansiedad',
    depth: 'transformacion',
    text: '¿Cómo sería tu día a día si esta ansiedad específica ya no existiera? Describilo en detalle sensorial.',
  },
  {
    id: 'a-t2',
    category: 'ansiedad',
    depth: 'transformacion',
    text: '¿Qué aprendiste de vos mismo gracias a este miedo que no podrías haber aprendido de otra manera?',
  },

  // ── Relaciones / superficie ───────────────────────────────────────────────
  {
    id: 'r-s1',
    category: 'relaciones',
    depth: 'superficie',
    text: 'Hay algo que no le dijiste a alguien importante. Escribilo acá, sin filtros.',
  },
  {
    id: 'r-s2',
    category: 'relaciones',
    depth: 'superficie',
    text: '¿Cómo te sentiste en la última conversación difícil que tuviste? Describí cada momento.',
  },
  // ── Relaciones / patrón ──────────────────────────────────────────────────
  {
    id: 'r-p1',
    category: 'relaciones',
    depth: 'patron',
    text: '¿Qué patrón seguís en tus relaciones que sabés que no te sirve pero seguís repitiendo?',
  },
  {
    id: 'r-p2',
    category: 'relaciones',
    depth: 'patron',
    text: '¿Qué necesidad tuya suele quedar sin decir en tus relaciones más cercanas?',
  },
  // ── Relaciones / transformación ───────────────────────────────────────────
  {
    id: 'r-t1',
    category: 'relaciones',
    depth: 'transformacion',
    text: 'Imaginá la relación que realmente querés tener. ¿Qué tendrías que soltar para tenerla?',
  },
  {
    id: 'r-t2',
    category: 'relaciones',
    depth: 'transformacion',
    text: '¿Qué versión de vos mismo mostrás en tus relaciones que no es completamente auténtica?',
  },

  // ── Trabajo / superficie ──────────────────────────────────────────────────
  {
    id: 'w-s1',
    category: 'trabajo',
    depth: 'superficie',
    text: '¿Qué parte de tu trabajo te drena más? Escribí sobre eso sin intentar encontrar soluciones.',
  },
  {
    id: 'w-s2',
    category: 'trabajo',
    depth: 'superficie',
    text: 'Describí tu semana laboral en términos de energía. ¿Cuándo la perdiste? ¿Cuándo la ganaste?',
  },
  // ── Trabajo / patrón ─────────────────────────────────────────────────────
  {
    id: 'w-p1',
    category: 'trabajo',
    depth: 'patron',
    text: '¿Qué tipo de situaciones en el trabajo te generan frustración repetidamente? ¿Qué tienen en común?',
  },
  {
    id: 'w-p2',
    category: 'trabajo',
    depth: 'patron',
    text: '¿Qué seguís postergando en tu trabajo? ¿Qué historia te contás para no hacerlo?',
  },
  // ── Trabajo / transformación ──────────────────────────────────────────────
  {
    id: 'w-t1',
    category: 'trabajo',
    depth: 'transformacion',
    text: 'Si nadie te juzgara, ¿qué cambiarías de tu vida profesional mañana mismo?',
  },
  {
    id: 'w-t2',
    category: 'trabajo',
    depth: 'transformacion',
    text: '¿Qué trabajo haría la versión de vos que ya no tiene nada que demostrar?',
  },
];

export function getRandomPrompt(category?: Prompt['category'], depth?: PromptDepth): Prompt {
  let pool = category ? PROMPTS.filter((p) => p.category === category) : PROMPTS;
  if (depth) {
    const depthPool = pool.filter((p) => p.depth === depth);
    if (depthPool.length > 0) pool = depthPool;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
