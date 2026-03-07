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

  let sensory_description: string;
  try {
    const body = await request.json();
    sensory_description = body.sensory_description;
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  if (!sensory_description?.trim() || sensory_description.trim().split(/\s+/).length < 20) {
    return NextResponse.json({ error: 'Descripción demasiado breve' }, { status: 400 });
  }

  const systemPrompt = `El usuario describió una meta de esta manera sensorial:

"${sensory_description}"

Tu tarea: fragmentar esta meta en exactamente 5 micro-acciones concretas y diarias.

Cada micro-acción debe ser:
- Física y observable (no mental, no actitudinal)
- Realizable en menos de 15 minutos
- Conectada directamente con la sensación descrita, no con la meta abstracta
- Formulada en segunda persona, imperativo suave en español rioplatense ("Abrí...", "Escribí...", "Caminá...", "Llamá...")
- Específica: con lugar, duración o cantidad cuando sea posible

Respondé ÚNICAMENTE con JSON válido:
{"micro_actions": ["acción1", "acción2", "acción3", "acción4", "acción5"]}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Fragmentá la meta.' }],
    });

    const block = response.content[0];
    if (block.type !== 'text') throw new Error('Respuesta inesperada');

    const jsonMatch = block.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No se encontró JSON');

    const { micro_actions } = JSON.parse(jsonMatch[0]) as { micro_actions: string[] };

    // Desactivar goal anterior si existe
    await supabase
      .from('goals')
      .update({ active: false })
      .eq('user_id', user.id)
      .eq('active', true);

    // Insertar nuevo goal
    const { data: goal, error: insertError } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        sensory_description: sensory_description.trim(),
        micro_actions,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ id: goal.id, micro_actions });
  } catch (err) {
    console.error('Error generando meta:', err);
    return NextResponse.json({ error: 'Error al generar las micro-acciones' }, { status: 500 });
  }
}
