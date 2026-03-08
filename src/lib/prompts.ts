export type PromptDepth = 'superficie' | 'patron' | 'transformacion';

export type PromptCategory =
  | 'ansiedad'
  | 'relaciones'
  | 'trabajo'
  | 'general'
  | 'habitos'
  | 'insomnio'
  | 'perdida'
  | 'cuerpo'
  | 'identidad';

export const CATEGORY_LABELS: Record<PromptCategory, string> = {
  general: 'General',
  ansiedad: 'Ansiedad',
  relaciones: 'Relaciones',
  trabajo: 'Trabajo',
  habitos: 'Hábitos',
  insomnio: 'Insomnio',
  perdida: 'Pérdida',
  cuerpo: 'Cuerpo',
  identidad: 'Propósito',
};

export interface Prompt {
  id: string;
  category: PromptCategory;
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

  // ── Hábitos / superficie ──────────────────────────────────────────────────
  {
    id: 'h-s1',
    category: 'habitos',
    depth: 'superficie',
    text: 'Describí el momento exacto en que el impulso aparece. ¿Dónde estás, qué sentís en el cuerpo, qué estás evitando?',
  },
  {
    id: 'h-s2',
    category: 'habitos',
    depth: 'superficie',
    text: '¿Qué es lo primero que hace tu cuerpo antes de ceder al hábito? Describí la secuencia completa, desde el primer cosquilleo.',
  },
  {
    id: 'h-s3',
    category: 'habitos',
    depth: 'superficie',
    text: '¿Cuándo fue la última vez que sentiste el impulso y no actuaste? ¿Qué pasó en ese espacio?',
  },
  // ── Hábitos / patrón ─────────────────────────────────────────────────────
  {
    id: 'h-p1',
    category: 'habitos',
    depth: 'patron',
    text: '¿Qué emoción aparece justo antes del impulso? Rastreá las últimas 3 veces — ¿hay un patrón que no querés ver?',
  },
  {
    id: 'h-p2',
    category: 'habitos',
    depth: 'patron',
    text: 'Si el hábito pudiera hablar, ¿qué te diría que necesitás? ¿Qué función cumple que todavía no encontraste cómo reemplazar?',
  },
  {
    id: 'h-p3',
    category: 'habitos',
    depth: 'patron',
    text: '¿En qué momentos del día o de la semana el impulso es más fuerte? ¿Qué tienen en común esos momentos?',
  },
  // ── Hábitos / transformación ──────────────────────────────────────────────
  {
    id: 'h-t1',
    category: 'habitos',
    depth: 'transformacion',
    text: 'Describí un día completo sin el hábito. No lo que harías distinto — cómo te sentirías distinto. Cada momento, cada sensación.',
  },
  {
    id: 'h-t2',
    category: 'habitos',
    depth: 'transformacion',
    text: '¿Qué versión de vos mismo vive sin este hábito? Describila: cómo piensa, cómo se mueve, cómo duerme.',
  },

  // ── Insomnio / superficie ─────────────────────────────────────────────────
  {
    id: 'i-s1',
    category: 'insomnio',
    depth: 'superficie',
    text: '¿Qué es lo que tu mente repite cuando la almohada se vuelve una pantalla? Escribí todo lo que aparece, sin orden.',
  },
  {
    id: 'i-s2',
    category: 'insomnio',
    depth: 'superficie',
    text: 'Describí tu cuerpo en la cama. Desde los dedos de los pies hasta la cabeza. Sin juzgar, solo observar.',
  },
  {
    id: 'i-s3',
    category: 'insomnio',
    depth: 'superficie',
    text: '¿Qué quedó sin terminar hoy? No la tarea — la emoción. ¿Qué sentís que no pudiste cerrar?',
  },
  // ── Insomnio / patrón ────────────────────────────────────────────────────
  {
    id: 'i-p1',
    category: 'insomnio',
    depth: 'patron',
    text: '¿Qué pensamientos vuelven siempre a las 3am? No los de hoy — los de siempre. Los residentes permanentes.',
  },
  {
    id: 'i-p2',
    category: 'insomnio',
    depth: 'patron',
    text: '¿Qué decisiones postergás durante el día que tu mente cobra de noche? ¿Cuáles son las deudas emocionales sin pagar?',
  },
  // ── Insomnio / transformación ─────────────────────────────────────────────
  {
    id: 'i-t1',
    category: 'insomnio',
    depth: 'transformacion',
    text: 'Describí cómo se siente despertar después de una noche de descanso real. El momento exacto en que abrís los ojos, el primer pensamiento.',
  },

  // ── Pérdida / superficie ──────────────────────────────────────────────────
  {
    id: 'p-s1',
    category: 'perdida',
    depth: 'superficie',
    text: '¿Qué es lo que más extrañás? No la persona o la situación — el gesto, el sonido, el detalle concreto.',
  },
  {
    id: 'p-s2',
    category: 'perdida',
    depth: 'superficie',
    text: 'Describí el último momento bueno que tuviste con lo que perdiste. Cada detalle que recuerdes, sin apresurarte.',
  },
  {
    id: 'p-s3',
    category: 'perdida',
    depth: 'superficie',
    text: '¿En qué momento del día la ausencia pesa más? Describí ese momento con precisión.',
  },
  // ── Pérdida / patrón ─────────────────────────────────────────────────────
  {
    id: 'p-p1',
    category: 'perdida',
    depth: 'patron',
    text: '¿Qué te dijiste a vos mismo sobre esta pérdida que sabés que no es completamente cierto?',
  },
  {
    id: 'p-p2',
    category: 'perdida',
    depth: 'patron',
    text: '¿En qué momentos del día la ausencia aparece sin que la llames? ¿Qué trigger la convoca — un olor, una hora, una canción?',
  },
  // ── Pérdida / transformación ──────────────────────────────────────────────
  {
    id: 'p-t1',
    category: 'perdida',
    depth: 'transformacion',
    text: 'Si pudieras hablar con lo que perdiste y supiera todo, ¿qué le dirías que nunca le dijiste?',
  },
  {
    id: 'p-t2',
    category: 'perdida',
    depth: 'transformacion',
    text: '¿Qué parte de vos mismo emergió después de esta pérdida que no existía antes?',
  },

  // ── Cuerpo / superficie ───────────────────────────────────────────────────
  {
    id: 'c-s1',
    category: 'cuerpo',
    depth: 'superficie',
    text: 'Describí tu cuerpo sin juicios — como si fuera un paisaje. Cada parte, cada textura, cada sensación presente.',
  },
  {
    id: 'c-s2',
    category: 'cuerpo',
    depth: 'superficie',
    text: '¿Qué parte de tu cuerpo evitás mirar, tocar o pensar? Escribí sobre ella como si le hablaras directamente.',
  },
  {
    id: 'c-s3',
    category: 'cuerpo',
    depth: 'superficie',
    text: '¿Cuándo fue la última vez que tu cuerpo se sintió cómodo? Describí ese momento en detalle sensorial.',
  },
  // ── Cuerpo / patrón ──────────────────────────────────────────────────────
  {
    id: 'c-p1',
    category: 'cuerpo',
    depth: 'patron',
    text: '¿Qué voz escuchás cuando te ves en el espejo? ¿De quién es esa voz originalmente — tuya o de alguien más?',
  },
  {
    id: 'c-p2',
    category: 'cuerpo',
    depth: 'patron',
    text: '¿Qué actividades dejaste de hacer por cómo te sentís con tu cuerpo? ¿Qué historia te contaste para justificarlo?',
  },
  // ── Cuerpo / transformación ───────────────────────────────────────────────
  {
    id: 'c-t1',
    category: 'cuerpo',
    depth: 'transformacion',
    text: 'Describí cómo se siente habitar tu cuerpo con comodidad total. No cambiarlo — habitarlo. Cada gesto, cada movimiento.',
  },

  // ── Identidad / superficie ────────────────────────────────────────────────
  {
    id: 'id-s1',
    category: 'identidad',
    depth: 'superficie',
    text: 'Si mañana nadie te conociera, ¿qué harías con tu día? Sin roles, sin expectativas, sin historia previa.',
  },
  {
    id: 'id-s2',
    category: 'identidad',
    depth: 'superficie',
    text: '¿Qué actividad te hace perder la noción del tiempo? Describí el estado interno durante esos momentos, no la actividad.',
  },
  {
    id: 'id-s3',
    category: 'identidad',
    depth: 'superficie',
    text: '¿Cuándo fue la última vez que hiciste algo sin pensar en cómo lo verían los demás? ¿Cómo se sintió?',
  },
  // ── Identidad / patrón ───────────────────────────────────────────────────
  {
    id: 'id-p1',
    category: 'identidad',
    depth: 'patron',
    text: '¿Qué versión de vos mismo construiste para que los demás te acepten? Describí esa máscara con honestidad.',
  },
  {
    id: 'id-p2',
    category: 'identidad',
    depth: 'patron',
    text: '¿Qué sueño abandonaste y por qué? No la razón lógica que te contás — la razón real que no querés ver.',
  },
  // ── Identidad / transformación ────────────────────────────────────────────
  {
    id: 'id-t1',
    category: 'identidad',
    depth: 'transformacion',
    text: 'La versión de vos que vive según su propósito — ¿cómo es su mañana? ¿Qué siente al abrir los ojos, qué hace primero?',
  },
  {
    id: 'id-t2',
    category: 'identidad',
    depth: 'transformacion',
    text: '¿Qué tendrías que dejar de ser para poder ser lo que realmente querés?',
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
