import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let act1: string, act2: string, act3: string;
  try {
    const body = await request.json();
    act1 = body.act1;
    act2 = body.act2;
    act3 = body.act3;
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  if (!act1?.trim() || !act2?.trim() || !act3?.trim()) {
    return NextResponse.json({ error: 'Faltan los tres actos' }, { status: 400 });
  }

  const systemPrompt = `Sos Agamenón. Este usuario acaba de completar una Reescritura de Recuerdos — tres versiones del mismo evento.

ACTO 1 — Como lo recuerda hoy:
${act1}

ACTO 2 — Desde la perspectiva de alguien que lo quiere:
${act2}

ACTO 3 — Como quiere recordarlo en 5 años:
${act3}

Tu tarea: observar qué se movió entre los tres actos.

1. Nombrá qué cambió en la relación del escritor con el evento entre el acto 1 y el acto 3. No describas el contenido — describí el movimiento interno.
2. Señalá qué fue lo más difícil de sostener en esta sesión (podés inferirlo de lo que se esquivó o de lo que costó escribirse).
3. Una observación final: ¿qué acaba de hacer esta persona para sí misma?

Formato: tres párrafos, sin numeración ni listas. Íntimo, en segunda persona. Honesto sin ser cruel.
No uses frases como "has dado un gran paso" o "esto es muy valioso". Solo observá lo que viste.
Máximo 160 palabras.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Observá lo que viste.' }],
    });

    const block = response.content[0];
    if (block.type !== 'text') throw new Error('Respuesta inesperada');

    const insightText = block.text.trim();

    await supabase.from('rewrite_sessions').insert({
      user_id: user.id,
      act1_text: act1,
      act2_text: act2,
      act3_text: act3,
      insight: insightText,
    });

    return NextResponse.json({ insight: insightText });
  } catch (err) {
    console.error('Error en reescritura:', err);
    return NextResponse.json({ error: 'Error al generar la observación' }, { status: 500 });
  }
}
