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

  let habit: string, text: string;
  try {
    const body = await request.json();
    habit = body.habit;
    text = body.text;
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  if (!habit?.trim() || !text?.trim()) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const systemPrompt = `Sos Agamenón. El usuario quiere eliminar este hábito: "${habit.trim()}".

Escribió este texto amplificando todo lo negativo de ese hábito:
"${text.trim()}"

Tu tarea: observar lo que el texto reveló sobre la relación real entre el usuario y el hábito.

1. Nombrá qué fue lo más verdadero de lo que escribió — no lo más impactante, lo más honesto.
2. ¿Qué función cumple este hábito más allá de lo obvio? (alivio, identidad, control, comodidad — algo que el texto dejó entrever, no lo que el usuario dijo explícitamente).
3. Una sola pregunta: ¿qué necesitaría tener, o no tener, para no necesitar este hábito?

Formato: tres párrafos breves, en segunda persona, sin listas, sin numeración.
Tono: honesto sin ser cruel. Sin frases de aliento. Solo lo que viste.
Máximo 150 palabras.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Observá lo que viste.' }],
    });

    const block = response.content[0];
    if (block.type !== 'text') throw new Error('Respuesta inesperada');

    return NextResponse.json({ insight: block.text.trim() });
  } catch (err) {
    console.error('Error en aversión:', err);
    return NextResponse.json({ error: 'Error al generar la observación' }, { status: 500 });
  }
}
