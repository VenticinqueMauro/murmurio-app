import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import type { LatencyEntry, DeletionEntry } from '@/lib/types';
import { PROGRAMS, type ProgramId } from '@/lib/programs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const BASE_SYSTEM_PROMPT = `Eres el núcleo de IA de Murmurio — un espejo perceptivo entre la mente consciente (Tito) y el subconsciente (Agamenón).

Tu rol NO es dar consejos ni diagnósticos. Eres un detector de lo que la mente consciente intenta ocultar.

Se te proporcionará:
1. Un texto de escritura libre
2. Palabras donde el usuario dudó (alta latencia de tecleo = fricción del subconsciente)

Tu tarea:
1. Identificar las 5 palabras o frases cortas con mayor carga emocional. No las más frecuentes — las más cargadas. Las que pesan.
2. Detectar hasta 3 contradicciones: lugares donde lo escrito contradice lo que fue hesitado. La contradicción puede ser sutil.
3. Generar EXACTAMENTE UNA micro-acción física concreta para hoy. Debe ser:
   - Física (no mental, no "reflexiona sobre esto")
   - Realizable en menos de 10 minutos
   - Diseñada para romper el ciclo de rumiación
   - Relacionada con lo que emergió en la escritura
4. Generar 2-3 preguntas espejo — preguntas que reflejan lo escrito sin interpretarlo ni dar consejos. Deben hacerle hablar a Agamenón sin que Tito censure.

REGLAS ABSOLUTAS:
- Nunca des consejos directos
- Usa lenguaje concreto, sensorial, presente
- Habla al subconsciente, no al intelecto
- Refleja, no interpretes
- Responde SIEMPRE en el mismo idioma que el texto del usuario

Responde ÚNICAMENTE con JSON válido en este formato exacto:
{
  "top_words": ["palabra1", "palabra2", "palabra3", "palabra4", "palabra5"],
  "contradictions": ["descripción1", "descripción2"],
  "micro_action": "Descripción de la acción física concreta",
  "reflection_questions": ["pregunta1", "pregunta2", "pregunta3"]
}`;

export async function POST(request: NextRequest) {
  // Verificar autenticación
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let text: string;
  let latency_data: LatencyEntry[];
  let deletions: DeletionEntry[] = [];
  let user_vocabulary: string[] = [];
  let active_goal: string | null = null;
  let program: string | null = null;

  try {
    const body = await request.json();
    text = body.text;
    latency_data = body.latency_data ?? [];
    deletions = body.deletions ?? [];
    user_vocabulary = body.user_vocabulary ?? [];
    active_goal = body.active_goal ?? null;
    program = body.program ?? null;
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 });
  }

  if (!text || text.trim().length < 30) {
    return NextResponse.json({ error: 'Texto demasiado corto' }, { status: 400 });
  }

  // Construir contexto de hesitaciones
  const hesitations = latency_data
    .filter((d) => d.is_hesitation)
    .map((d) => `"${d.word}" (${(d.latency_ms / 1000).toFixed(1)}s)`)
    .join(', ');

  const deletionsSection =
    deletions.length > 0
      ? `\n\nFRASES ELIMINADAS DURANTE LA ESCRITURA (borradas tras una pausa significativa — probable autocensura):\n${deletions
          .map((d) => `- "${d.deleted_text}" (pausa previa: ${(d.pause_before_ms / 1000).toFixed(1)}s)`)
          .join('\n')}\nSi alguna de estas frases conecta con lo que quedó escrito, señalalo — Tito llegó hasta ahí y retrocedió.`
      : '';

  const vocabularySection =
    user_vocabulary.length > 0
      ? `\n\nVOCABULARIO RECURRENTE DE ESTE USUARIO (palabras que han aparecido en sesiones anteriores): ${user_vocabulary.join(', ')}.\nSi alguna de estas palabras reaparece hoy, señálalo en las preguntas espejo — su reaparición es significativa.`
      : '';

  const goalSection =
    active_goal
      ? `\n\nOBJETIVO ACTIVO DEL USUARIO (descripción sensorial que el usuario escribió sobre su meta): "${active_goal}".\nSi algo en el texto de hoy conecta con esta sensación o la contradice, podés mencionarlo sutilmente en UNA de las preguntas espejo — sin forzarlo ni nombrarlo directamente.`
      : '';

  const programConfig = program ? PROGRAMS[program as ProgramId] : null;
  const programSection = programConfig?.claudeContext
    ? `\n\n${programConfig.claudeContext}`
    : '';

  const systemPrompt = BASE_SYSTEM_PROMPT + deletionsSection + vocabularySection + goalSection + programSection;

  const userMessage = `TEXTO DEL USUARIO:\n${text}\n\nPALABRAS CON HESITACIÓN (el subconsciente dudó aquí):\n${hesitations || 'Ninguna detectada'}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Tipo de respuesta inesperado');
    }

    // Extraer JSON (a veces Claude puede agregar texto antes/después)
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No se encontró JSON en la respuesta');

    const insights = JSON.parse(jsonMatch[0]);
    return NextResponse.json(insights);
  } catch (err) {
    console.error('Error al llamar a Claude:', err);
    return NextResponse.json({ error: 'El análisis falló' }, { status: 500 });
  }
}
