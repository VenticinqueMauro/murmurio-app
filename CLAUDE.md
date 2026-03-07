# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # desarrollo local (Turbopack)
npm run build    # build de producción + type check
npm run lint     # ESLint
```

Siempre correr `npm run build` antes de dar una tarea por terminada — el type check corre durante el build.

## Architecture

Next.js 16.1 App Router con Supabase como BaaS y Claude como motor de análisis.

### Auth flow
`src/proxy.ts` protege `/dashboard` y `/session/*`. El callback OAuth/magic link vive en `/app/auth/callback/route.ts` que intercambia el code por sesión y redirige a `/dashboard`.

### Session flow (core del producto)
`/session/new` es un Client Component con 6 steps en estado local:
`loading → pre_session → mood_before → writing → analyzing → results`

- **loading**: fetchea en paralelo la última sesión, count total, insights históricos y goal activo
- **pre_session**: muestra palabras clave de la última sesión + seguimiento de micro-acción (si aplica)
- **mood_before**: slider de ánimo + selector de categoría + prompt (filtrado por depth)
- **writing**: `WritingEditor` — captura texto, latencia por palabra y deletions significativas
- **analyzing**: llama a `/api/analyze`, guarda sesión + latency_data + insights, actualiza racha
- **results**: `SessionResults` con insights de Agamenón + mood_after

### WritingEditor
`src/components/editor/WritingEditor.tsx` — editor con mecánicas terapéuticas:
- **Deletion tracking**: permite borrar libremente. Clasifica borrados como tipeo (< 1s pausa, ≤ 5 chars) o autocensura (> 1s pausa, > 5 chars). Los segundos van a Claude.
- **Latencia por palabra**: detecta hesitaciones (tiempo > 2.5× el promedio esperado)
- **Blur por inactividad**: difumina el texto tras 3s sin escribir para forzar el flujo
- **Bloqueado**: Ctrl+Z, Ctrl+X, Ctrl+A, paste — se permite Backspace y Delete
- Firma del callback: `onComplete(text, latencyData: LatencyEntry[], deletions: DeletionEntry[])`

### AI — Modelos y rutas
| Ruta | Modelo | Propósito |
|---|---|---|
| `/api/analyze` | Haiku 4.5 | Análisis por sesión: top_words, contradictions, micro_action, reflection_questions |
| `/api/weekly-letter` | Sonnet 4.6 | Carta semanal (GET, idempotente por semana) |
| `/api/rewrite` | Sonnet 4.6 | Observación de los 3 actos de Reescritura |
| `/api/goals` | Sonnet 4.6 | Genera 5 micro-acciones desde descripción sensorial |
| `/api/aversion` | Sonnet 4.6 | Observación del ejercicio de aversión (sin persistencia) |

`/api/analyze` acepta contexto enriquecido:
- `deletions: DeletionEntry[]` — autocensuras detectadas
- `user_vocabulary: string[]` — top-10 palabras históricas del usuario
- `active_goal: string | null` — descripción sensorial del goal activo (inyección silenciosa)

### Prompts
`src/lib/prompts.ts` — 28 prompts × 4 categorías × 3 profundidades:
- `superficie` (sesiones 0-6): preguntas de contacto con el presente
- `patron` (sesiones 7-13): identificación de repeticiones
- `transformacion` (sesiones 14+): preguntas desde la versión futura

`getDepthFromSessionCount(n)` calcula el nivel. `getRandomPrompt(category, depth)` filtra con fallback al pool completo si no hay prompts en ese nivel para esa categoría.

### Supabase
- `src/lib/supabase/client.ts` — `createBrowserClient`. **No llamar en render, solo dentro de event handlers/callbacks.**
- `src/lib/supabase/server.ts` — `createServerClient` con cookies para Server Components y Route Handlers.
- Server pages que usan Supabase necesitan `export const dynamic = 'force-dynamic'`.

Tablas (todas con RLS):
| Tabla | Descripción |
|---|---|
| `profiles` | streak_count, last_session_date |
| `sessions` | incluye micro_action_followup |
| `insights` | top_words, contradictions, micro_action, reflection_questions |
| `latency_data` | por palabra: latency_ms, is_hesitation |
| `weekly_letters` | UNIQUE(user_id, week_start) — idempotente |
| `rewrite_sessions` | act1_text, act2_text, act3_text, insight |
| `goals` | sensory_description, micro_actions[], active |

Función RPC: `update_streak(p_user_id UUID)` — llamada tras cada sesión completada.

Migraciones en orden: `schema.sql` → `001` → `002` → `003` → `004`

### Theming
CSS custom properties en `src/app/globals.css`. Dark mode es el default (`:root`), light mode con `[data-theme="light"]`. El toggle persiste en `localStorage` y se aplica con un script inline en `layout.tsx` antes de hidratación para evitar flash.

**No usar clases Tailwind para colores — usar `var(--*)` inline o clases CSS definidas en globals.css.**

Clases CSS utilitarias en globals.css: `.nav-pill`, `.session-card`, `.back-link`, `.animate-fade-in`, `.animate-pulse-slow`

Variable clave: `--btn-primary-text` cambia entre modos para botones con fondo ámbar (`#0a0907` en dark, `#faf7f2` en light).

### Icons
Componentes animados de lucide-animated en `src/components/icons/`. Requieren `motion/react`. Usan un wrapper `<div>` con `onMouseEnter/Leave` — **no usar en Server Components**.

### Next.js 16 quirks
- El archivo de middleware se llama `proxy.ts` (no `middleware.ts`) y exporta `proxy` (no `middleware`).
- `useSearchParams()` en Client Components necesita `<Suspense>` wrapper.
- `useRef` con timers: `useRef<ReturnType<typeof setTimeout> | undefined>(undefined)`.

## Key files

| Archivo | Rol |
|---|---|
| `src/proxy.ts` | Auth guard |
| `src/app/dashboard/page.tsx` | Dashboard principal (force-dynamic) |
| `src/app/session/new/page.tsx` | Flujo principal: 6 steps |
| `src/app/session/rewrite/page.tsx` | Módulo: Reescritura de Recuerdos |
| `src/app/session/goals/page.tsx` | Módulo: Visualización de Metas |
| `src/app/session/aversion/page.tsx` | Módulo: Aversión Guiada |
| `src/app/api/analyze/route.ts` | Claude Haiku — análisis por sesión |
| `src/app/api/weekly-letter/route.ts` | Claude Sonnet — carta semanal |
| `src/app/api/rewrite/route.ts` | Claude Sonnet — observación reescritura |
| `src/app/api/goals/route.ts` | Claude Sonnet — generación micro-acciones |
| `src/app/api/aversion/route.ts` | Claude Sonnet — observación aversión |
| `src/components/editor/WritingEditor.tsx` | Editor terapéutico con deletion tracking |
| `src/components/session/PuenteDeLosDias.tsx` | Visualización racha 21 días |
| `src/components/session/CartaSemanal.tsx` | Client Component carta semanal |
| `src/components/session/VocabularioPersonal.tsx` | Nube de palabras históricas |
| `src/lib/prompts.ts` | 28 prompts × categoría × depth |
| `src/lib/types.ts` | Session, Insights, LatencyEntry, DeletionEntry |
| `supabase/schema.sql` | Schema base PostgreSQL con RLS |
| `docs/PRODUCTO.md` | Plan de producto — fases, métricas, roadmap |
