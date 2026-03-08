# Programas Especializados — Plan de Implementación

> Evolución de Murmurio: de app genérica de journaling a programas dirigidos por perfil de usuario.

---

## Concepto

Cada usuario elige un **programa** que adapta toda la experiencia:
- Categorías de prompts visibles
- Módulo terapéutico destacado en el dashboard
- Contexto inyectado a Claude para personalizar análisis y micro-acciones
- Categoría preseleccionada al iniciar sesión

El programa no bloquea — el usuario siempre puede cambiar categoría manualmente.

---

## Los 6 programas

### 1. Bienestar general (`bienestar`) — DEFAULT
Para quien quiere explorar sin foco específico.
- **Categorías**: ansiedad, relaciones, trabajo, general
- **Módulos**: Reescritura, Metas, Aversión (todos visibles)
- **Contexto Claude**: análisis abierto, sin sesgo temático

### 2. Dejar un hábito (`habitos`)
Para fumadores, bebedores, comedores compulsivos, scrollers, etc.
- **Categorías**: habitos, general
- **Módulo central**: Aversión Guiada
- **Contexto Claude**: micro-acciones orientadas a romper el automatismo del trigger. Preguntas espejo que exploran la función emocional del hábito, no el hábito en sí.
- **Base teórica**: el hábito llena un vacío. La escritura expone ese vacío. La aversión amplifica lo negativo sin supresión. Las metas describen sensorialmente la vida sin el hábito.

### 3. Mejorar el sueño (`insomnio`)
Para insomnio de mantenimiento, rumiación nocturna, ansiedad al dormir.
- **Categorías**: insomnio, ansiedad, general
- **Módulo central**: Metas
- **Contexto Claude**: micro-acciones de higiene cognitiva nocturna. Vaciado de la RAM mental por escrito. Preguntas espejo sobre lo que no se cierra durante el día.
- **Base teórica**: la mente no duerme porque tiene pendientes emocionales abiertos. La escritura los cierra.

### 4. Procesar una pérdida (`duelo`)
Para duelo, separaciones, cambios de vida, mudanzas, despidos.
- **Categorías**: perdida, relaciones, general
- **Módulo central**: Reescritura de Recuerdos
- **Contexto Claude**: micro-acciones de ritualización del duelo. Preguntas espejo que permiten narrar la pérdida sin resolverla prematuramente.
- **Base teórica**: el duelo necesita ser narrado, no resuelto. La reescritura en 3 actos permite ver el evento desde perspectivas distintas.

### 5. Relación con el cuerpo (`cuerpo`)
Para dolor crónico, imagen corporal, fibromialgia, recuperación de TCA.
- **Categorías**: cuerpo, general
- **Módulo central**: Metas
- **Contexto Claude**: micro-acciones sensoriales y de reconexión corporal. Preguntas espejo que exploran la narrativa emocional del cuerpo.
- **Base teórica**: el cuerpo guarda lo que la mente no procesa. Prompts sensoriales que reconectan sin juzgar.

### 6. Encontrar propósito (`proposito`)
Para crisis de sentido, transiciones vitales, "no sé qué quiero".
- **Categorías**: identidad, trabajo, general
- **Módulos**: Metas, Reescritura
- **Contexto Claude**: micro-acciones de exploración existencial. Preguntas espejo sobre la máscara construida vs. el deseo real.
- **Base teórica**: el propósito no se encuentra pensando — se encuentra escribiendo sin filtro sobre lo que genera energía y lo que la drena.

---

## Nuevas categorías de prompts

Se agregan 5 categorías a las 4 existentes (ansiedad, relaciones, trabajo, general).
Cada una con prompts en los 3 niveles de profundidad.

### habitos (5 prompts)

**Superficie** (sesiones 0-6):
- "Describí el momento exacto en que el impulso aparece. ¿Dónde estás, qué sentís en el cuerpo, qué estás evitando?"
- "¿Qué es lo primero que hace tu cuerpo antes de ceder al hábito? Describí la secuencia completa, desde el primer cosquilleo."

**Patrón** (sesiones 7-13):
- "¿Qué emoción aparece justo antes del impulso? Rastreá las últimas 3 veces — ¿hay un patrón que no querés ver?"
- "Si el hábito pudiera hablar, ¿qué te diría que necesitás? ¿Qué función cumple que todavía no encontraste cómo reemplazar?"

**Transformación** (sesiones 14+):
- "Describí un día completo sin el hábito. No lo que harías distinto — cómo te sentirías distinto. Cada momento, cada sensación."

### insomnio (5 prompts)

**Superficie**:
- "¿Qué es lo que tu mente repite cuando la almohada se vuelve una pantalla? Escribí todo lo que aparece, sin orden."
- "Describí tu cuerpo en la cama. Desde los dedos de los pies hasta la cabeza. Sin juzgar, solo observar."

**Patrón**:
- "¿Qué pensamientos vuelven siempre a las 3am? No los de hoy — los de siempre. Los residentes permanentes."
- "¿Qué decisiones postergás durante el día que tu mente cobra de noche?"

**Transformación**:
- "Describí cómo se siente despertar después de una noche de descanso real. El momento exacto en que abrís los ojos."

### perdida (5 prompts)

**Superficie**:
- "¿Qué es lo que más extrañás? No la persona o la situación — el gesto, el sonido, el detalle concreto."
- "Describí el último momento bueno que tuviste con lo que perdiste. Cada detalle que recuerdes."

**Patrón**:
- "¿Qué te dijiste a vos mismo sobre esta pérdida que sabés que no es completamente cierto?"
- "¿En qué momentos del día la ausencia aparece sin que la llames? ¿Qué trigger la convoca?"

**Transformación**:
- "Si pudieras hablar con lo que perdiste y supiera todo, ¿qué le dirías que nunca le dijiste?"

### cuerpo (5 prompts)

**Superficie**:
- "Describí tu cuerpo sin juicios — como si fuera un paisaje. Cada parte, cada textura, cada sensación."
- "¿Qué parte de tu cuerpo evitás mirar, tocar o pensar? Escribí sobre ella como si le hablaras."

**Patrón**:
- "¿Qué voz escuchás cuando te ves en el espejo? ¿De quién es esa voz originalmente — tuya o de alguien más?"
- "¿Qué actividades dejaste de hacer por cómo te sentís con tu cuerpo? ¿Qué te contaste para justificarlo?"

**Transformación**:
- "Describí cómo se siente habitar tu cuerpo con comodidad total. No cambiarlo — habitarlo."

### identidad (5 prompts)

**Superficie**:
- "Si mañana nadie te conociera, ¿qué harías con tu día? Sin roles, sin expectativas, sin historia."
- "¿Qué actividad te hace perder la noción del tiempo? Describí el estado interno, no la actividad."

**Patrón**:
- "¿Qué versión de vos mismo construiste para que los demás te acepten? Describí la máscara con honestidad."
- "¿Qué sueño abandonaste y por qué? No la razón lógica — la razón real."

**Transformación**:
- "La versión de vos que vive según su propósito — ¿cómo es su mañana? ¿Qué siente al abrir los ojos?"

---

## Arquitectura de implementación

### Schema (Migration 005)

```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS program TEXT DEFAULT 'bienestar';
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS program TEXT;
```

- Default `'bienestar'` para retrocompatibilidad total con usuarios existentes
- `sessions.program` para tracking histórico (analytics futuro)

### Archivos nuevos

| Archivo | Propósito |
|---|---|
| `src/lib/programs.ts` | Definición de ProgramId, PROGRAMS, CATEGORY_LABELS |
| `src/components/ui/ProgramSelector.tsx` | Grid de tarjetas para elegir programa |
| `supabase/migrations/005_programs.sql` | Migration de schema |

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/lib/prompts.ts` | Expandir type category (4→9) + ~25 prompts nuevos |
| `src/lib/types.ts` | Agregar `program` a Profile |
| `src/app/api/analyze/route.ts` | Aceptar `program`, inyectar `claudeContext` al system prompt |
| `src/app/api/weekly-letter/route.ts` | Leer programa del profile, agregar contexto a carta |
| `src/app/session/new/page.tsx` | Categorías dinámicas filtradas por programa |
| `src/app/dashboard/page.tsx` | Nav dinámica por programa + selector para nuevos |
| `src/app/globals.css` | Clases .program-card, .nav-pill-primary |

### Inyección de contexto a Claude

Cada programa tiene un `claudeContext` (texto puro) que se concatena al system prompt de `/api/analyze`. Esto contextualiza:
- Las micro-acciones generadas (orientadas al programa)
- Las preguntas espejo (relevantes al foco del usuario)
- Las contradicciones detectadas (en contexto)

La carta semanal (`/api/weekly-letter`) recibe un `weeklyLetterContext` equivalente.

No se cambia la estructura del JSON de respuesta de Claude — solo se contextualiza lo que dice.

---

## Orden de implementación

1. **Tipos y definiciones** — `programs.ts`, expandir `prompts.ts`, actualizar `types.ts`
2. **Migration** — `005_programs.sql`
3. **APIs** — `/api/analyze` y `/api/weekly-letter` aceptan/usan programa
4. **UI** — ProgramSelector, dashboard dinámico, sesión con categorías filtradas
5. **Build + verificación** — `npm run build`, test manual del flujo completo

---

## Métricas nuevas por programa

| Métrica | Qué mide |
|---|---|
| Sesiones por programa | Qué programas tienen más engagement |
| Retención D7 por programa | Qué programas retienen mejor |
| Cambios de programa | Si los usuarios encuentran su foco o saltan |
| Uso de módulo central | Si el módulo destacado se usa más que los otros |
