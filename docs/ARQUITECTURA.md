# Murmurio — Arquitectura Técnica

---

## Visión general del sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENTE                                │
│                                                                 │
│   Landing → Auth (magic link / password) → Dashboard           │
│                          │                                      │
│            ┌─────────────┼─────────────┐                       │
│            │             │             │                        │
│         Sesión       Reescritura    Metas / Aversión            │
│       (core loop)    (módulo)         (módulos)                 │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────┼──────────────────────────────────────┐
│                    NEXT.JS 16.1                                 │
│                    (Vercel Edge)                                │
│                          │                                      │
│   ┌──────────────────────┼──────────────────────────────────┐  │
│   │                  API Routes                             │  │
│   │   /api/analyze  /api/weekly-letter  /api/rewrite        │  │
│   │   /api/goals    /api/aversion                           │  │
│   └──────────────────────┼──────────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────────┘
              ┌────────────┴────────────┐
              │                         │
┌─────────────▼──────────┐  ┌──────────▼──────────────────────┐
│       SUPABASE          │  │       ANTHROPIC API              │
│                         │  │                                  │
│  Auth (magic link,      │  │  Haiku 4.5 → /api/analyze       │
│  email/password)        │  │  Sonnet 4.6 → /api/weekly-letter│
│                         │  │              /api/rewrite        │
│  PostgreSQL + RLS       │  │              /api/goals          │
│  ├── profiles           │  │              /api/aversion       │
│  ├── sessions           │  │                                  │
│  ├── insights           │  └──────────────────────────────────┘
│  ├── latency_data       │
│  ├── weekly_letters     │
│  ├── rewrite_sessions   │
│  └── goals              │
└─────────────────────────┘
```

---

## Flujo de autenticación

```
Usuario ingresa email
        │
        ▼
Supabase envía magic link / verifica password
        │
        ▼
/auth/callback?code=...
        │
        ▼
exchangeCodeForSession()
        │
        ▼
redirect → /dashboard
        │
        ▼
proxy.ts valida sesión en cada request a /dashboard y /session/*
(si no hay sesión → redirect a /)
```

**Email templates**: HTML inline con identidad visual Murmurio en `supabase/templates/`. Variable `{{ .ConfirmationURL }}` inyectada por Supabase.

---

## Flujo de sesión principal (6 steps)

```
/session/new (Client Component — estado local)

[loading]
    │   Fetch paralelo:
    │   ├── última sesión del usuario (palabras previas)
    │   ├── total de sesiones (para calcular depth)
    │   ├── top-10 palabras históricas (vocabulario personal)
    │   └── goal activo (micro-acción inyectable)
    ▼
[pre_session]
    │   Muestra palabras de la última sesión
    │   "¿Hiciste tu micro-acción de ayer?"
    │   → Sí / Parcialmente / No (sin juicio)
    ▼
[mood_before]
    │   Slider de ánimo (0-10)
    │   Selector de categoría (filtrado por programa del usuario)
    │   Selección de prompt (según categoría + depth)
    ▼
[writing]
    │   WritingEditor:
    │   ├── captura latencia por palabra
    │   ├── clasifica deletions (autocensura vs. tipeo)
    │   ├── blur si > 3s sin escribir
    │   └── mínimo 50 palabras para habilitar submit
    ▼
[analyzing]
    │   POST /api/analyze con:
    │   ├── text (lo que escribió)
    │   ├── latency_data (hesitaciones)
    │   ├── deletions (autocensuras)
    │   ├── user_vocabulary (top-10 histórico)
    │   ├── active_goal (goal actual, inyección silenciosa)
    │   └── program (contexto del programa)
    │
    │   Claude Haiku devuelve:
    │   ├── top_words (3-5 palabras con peso)
    │   ├── contradictions (tensiones detectadas)
    │   ├── micro_action (acción concreta para mañana)
    │   └── reflection_questions (2-3 preguntas)
    │
    │   Se guarda en Supabase:
    │   ├── sessions (con mood_before, program, micro_action_followup)
    │   ├── insights (análisis de Claude)
    │   ├── latency_data (hesitaciones por palabra)
    │   └── update_streak() RPC → actualiza racha en profiles
    ▼
[results]
    │   Mood after (slider final)
    │   Respuesta de Agamenón (top_words, reflection_questions)
    │   Micro-acción para mañana
    └── El Puente de 21 días (visualización racha)
```

---

## Pipeline de IA

### Sesión — Claude Haiku 4.5

```
System prompt (base)
    + deletions section (si hay autocensuras)
    + vocabulary section (top-10 palabras históricas)
    + goal section (si hay goal activo)
    + program section (claudeContext del programa)
    ──────────────────────────────────────────────
    → Respuesta JSON:
      { top_words, contradictions, micro_action, reflection_questions }
```

**Por qué Haiku**: baja latencia, respuesta en < 2s, formato JSON confiable. El análisis por sesión no requiere la sofisticación de Sonnet.

### Carta semanal — Claude Sonnet 4.6

```
Inputs:
    ├── N sesiones de la semana (mood_before, mood_after, top_words)
    ├── Frecuencia de palabras agregada entre sesiones
    ├── Delta de mood (primera sesión → última)
    └── weeklyLetterContext del programa

Output:
    Carta en prosa, máx 180 palabras, sin markdown
    Guardada en weekly_letters (UNIQUE por user_id + week_start)
    Idempotente: si ya existe la carta de esa semana, se devuelve sin re-generar
```

### Módulos — Claude Sonnet 4.6

| Ruta | Input | Output |
|---|---|---|
| `/api/rewrite` | 3 textos (los 3 actos) | Observación literaria sobre la evolución |
| `/api/goals` | Descripción sensorial de la meta | 5 micro-acciones concretas y físicas |
| `/api/aversion` | Texto sobre el hábito | Observación que amplifica la aversión |

---

## Modelo de datos

```
profiles
├── id (UUID, FK → auth.users)
├── streak_count (INT)
├── last_session_date (DATE)
└── program (TEXT, default 'bienestar')

sessions
├── id (UUID)
├── user_id (UUID, FK → profiles)
├── mood_before (NUMERIC 0-10)
├── mood_after (NUMERIC 0-10)
├── category (TEXT)
├── prompt (TEXT)
├── content (TEXT)
├── micro_action_followup (TEXT)
├── program (TEXT)
└── created_at (TIMESTAMPTZ)

insights (1:1 con sessions)
├── session_id (UUID, FK → sessions)
├── top_words (TEXT[])
├── contradictions (TEXT[])
├── micro_action (TEXT)
└── reflection_questions (TEXT[])

latency_data (N:1 con sessions)
├── session_id (UUID)
├── word (TEXT)
├── position_in_text (INT)
├── latency_ms (INT)
└── is_hesitation (BOOLEAN)

weekly_letters
├── user_id (UUID)
├── week_start (DATE)          ← UNIQUE(user_id, week_start)
├── content (TEXT)
├── top_words (TEXT[])
├── mood_delta (NUMERIC)
└── session_count (INT)

rewrite_sessions
├── user_id (UUID)
├── act1_text / act2_text / act3_text (TEXT)
└── insight (TEXT)

goals
├── user_id (UUID)
├── sensory_description (TEXT)
├── micro_actions (TEXT[])
└── active (BOOLEAN)
```

Todas las tablas tienen **Row Level Security (RLS)** — un usuario solo puede leer y escribir sus propios datos.

---

## Sistema de prompts

```
53+ prompts
    × 9 categorías
    × 3 niveles de profundidad

Categorías:
    ansiedad | relaciones | trabajo | general
    habitos | insomnio | perdida | cuerpo | identidad

Profundidades (calculadas por getDepthFromSessionCount):
    superficie     → sesiones 0-6  (contacto con el presente)
    patron         → sesiones 7-13 (identificación de repeticiones)
    transformacion → sesiones 14+  (desde la versión futura)

Filtrado:
    getRandomPrompt(category, depth)
    → si no hay prompts en ese depth para esa categoría,
      hace fallback al pool completo de la categoría
```

---

## Programas especializados

```
bienestar (default)
    categorías: ansiedad, relaciones, trabajo, general
    módulos: Reescritura, Metas, Aversión
    claude_context: análisis abierto

habitos
    categorías: habitos, general
    módulo central: Aversión Guiada
    claude_context: contexto de ruptura de automatismos

insomnio
    categorías: insomnio, ansiedad, general
    módulo central: Metas
    claude_context: higiene cognitiva nocturna

duelo
    categorías: perdida, relaciones, general
    módulo central: Reescritura de Recuerdos
    claude_context: ritualización del duelo

cuerpo
    categorías: cuerpo, general
    módulo central: Metas
    claude_context: reconexión corporal sensorial

proposito
    categorías: identidad, trabajo, general
    módulos: Metas, Reescritura
    claude_context: exploración existencial
```

---

## Theming

```
CSS Custom Properties (globals.css)

Dark mode (:root — default)           Light mode ([data-theme="light"])
──────────────────────────            ─────────────────────────────────
--bg:         #0a0907                 --bg:         #faf7f2
--surface:    #111110                 --surface:    #ffffff
--surface-2:  #1a1917                 --surface-2:  #f5f0e8
--text:       #e8e2d5                 --text:       #1a1611
--text-subtle:#7a7570                 --text-subtle:#8a7f78
--amber:      #c17d28                 --amber:      #a66820
--btn-primary-text: #0a0907           --btn-primary-text: #faf7f2

Toggle persiste en localStorage
Script inline en layout.tsx aplica antes de hidratación (anti-flash)
<html suppressHydrationWarning> evita mismatch de React
```

---

## Decisiones de arquitectura notables

**`proxy.ts` (no `middleware.ts`)**: Next.js 16 requiere que el archivo exporte `proxy` en lugar de `middleware`. Idem el nombre del archivo.

**`createBrowserClient` solo en handlers**: El cliente Supabase del lado del cliente no se instancia en render — solo dentro de event handlers o callbacks de useEffect. Previene errores de SSR.

**Server pages con `force-dynamic`**: Páginas como `/dashboard` que llaman Supabase desde Server Components necesitan `export const dynamic = 'force-dynamic'` para no cachearse en el build.

**Idempotencia de la carta semanal**: Antes de llamar a Claude, se verifica si ya existe una `weekly_letter` para `(user_id, week_start)`. Si existe, se devuelve directamente. Esto evita re-generar y tener múltiples versiones por semana.

**Deletion tracking como dato terapéutico**: Lo que se borra no se descarta — se clasifica. Una pausa > 1s antes de borrar o más de 5 caracteres eliminados se considera autocensura y se envía a Claude como contexto adicional. El rationale: lo que el consciente censura es precisamente lo que Agamenón necesita ver.
