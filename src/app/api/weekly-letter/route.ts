import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { PROGRAMS, type ProgramId } from '@/lib/programs';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // lunes
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const weekStart = getWeekStart();

  // Leer programa del usuario
  const { data: profileData } = await supabase
    .from('profiles')
    .select('program')
    .eq('id', user.id)
    .maybeSingle();

  const programConfig = profileData?.program
    ? PROGRAMS[profileData.program as ProgramId]
    : null;
  const programContext = programConfig?.weeklyLetterContext
    ? `\n\n${programConfig.weeklyLetterContext}`
    : '';

  // Si ya existe la carta de esta semana, devolverla directamente
  const { data: existing } = await supabase
    .from('weekly_letters')
    .select('content, top_words, mood_delta, session_count')
    .eq('user_id', user.id)
    .eq('week_start', weekStart)
    .maybeSingle();

  if (existing) return NextResponse.json(existing);

  // Buscar sesiones de esta semana con sus insights
  const { data: sessions } = await supabase
    .from('sessions')
    .select('mood_before, mood_after, created_at, insights(top_words)')
    .eq('user_id', user.id)
    .gte('created_at', weekStart)
    .order('created_at', { ascending: true });

  if (!sessions || sessions.length < 2) {
    return NextResponse.json(
      { error: 'Se necesitan al menos 2 sesiones esta semana' },
      { status: 422 }
    );
  }

  // Frecuencia de palabras a través de todas las sesiones
  const wordFreq: Record<string, number> = {};
  for (const s of sessions) {
    const raw = s.insights;
    const ins = Array.isArray(raw) ? raw[0] : raw;
    if (ins?.top_words) {
      for (const w of ins.top_words as string[]) {
        wordFreq[w] = (wordFreq[w] ?? 0) + 1;
      }
    }
  }

  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);

  // Delta de ánimo: mood_before de la primera sesión → mood_after de la última
  const firstMood = sessions[0].mood_before ?? sessions[0].mood_after;
  const lastMood =
    sessions[sessions.length - 1].mood_after ??
    sessions[sessions.length - 1].mood_before;
  const moodDelta =
    firstMood !== null && lastMood !== null
      ? parseFloat((lastMood - firstMood).toFixed(2))
      : null;

  const wordsSentence =
    topWords.length > 0 ? topWords.join(', ') : 'sin palabras destacadas';
  const moodSentence =
    moodDelta !== null
      ? `El ánimo se movió ${moodDelta >= 0 ? '+' : ''}${moodDelta} puntos a lo largo de la semana.`
      : '';

  const systemPrompt = `Sos Agamenón — el observador interno, la voz que habita en las pausas entre palabras.

Esta semana, quien escribe tuvo ${sessions.length} sesiones.
Las palabras con más peso que emergieron: ${wordsSentence}.
${moodSentence}

Escribí una carta. No un análisis — una carta. En segunda persona, íntima, directa.
Sin tecnicismos terapéuticos. Sin frases vacías de aliento.

La carta debe:
1. Nombrar lo que observaste esta semana con precisión (las palabras, el movimiento interno)
2. Señalar un patrón que el consciente quizás no vio
3. Terminar con UNA pregunta profunda para la semana que empieza — no retórica, real

Tono: como alguien que te conoce mejor que vos mismo y te habla con honestidad y afecto.
Extensión: no más de 180 palabras.
No uses encabezado ni firma — la carta comienza directamente.
No uses markdown, asteriscos, guiones ni ningún símbolo de formato. Solo texto limpio.${programContext}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Escribí la carta de esta semana.' }],
    });

    const block = response.content[0];
    if (block.type !== 'text') {
      throw new Error('Respuesta inesperada de Claude');
    }

    const letterContent = block.text.trim();

    await supabase.from('weekly_letters').insert({
      user_id: user.id,
      week_start: weekStart,
      content: letterContent,
      top_words: topWords,
      mood_delta: moodDelta,
      session_count: sessions.length,
    });

    return NextResponse.json({
      content: letterContent,
      top_words: topWords,
      mood_delta: moodDelta,
      session_count: sessions.length,
    });
  } catch (err) {
    console.error('Error generando carta semanal:', err);
    return NextResponse.json({ error: 'Error al generar la carta' }, { status: 500 });
  }
}
