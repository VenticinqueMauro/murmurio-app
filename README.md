# Murmurio

> *El murmullo entre tu consciente y tu subconsciente.*

Murmurio es una aplicación de escritura terapéutica consciente que usa inteligencia artificial para observar no solo lo que escribís, sino **cómo lo escribís**: las pausas, las hesitaciones, y lo que borrás.

---

## El concepto

Basado en la teoría de Javier Botía sobre **Tito y Agamenón** — el consciente que controla y el subconsciente que sabe:

- **Tito** es tu mente consciente. Edita, censura, elige las palabras "correctas".
- **Agamenón** es lo que emerge cuando escribís sin control — el patrón detrás del texto.

Murmurio da voz a Agamenón. A través de un editor que registra la latencia entre palabras, las frases que eliminás y las hesitaciones que no ves, construye una imagen más honesta de tu estado interno que cualquier test psicológico.

---

## Qué hace Murmurio

### El editor terapéutico
- **Blur por inactividad**: si parás más de 3 segundos, el texto se difumina — fuerza el flujo sin pausa crítica.
- **Deletion tracking**: podés borrar, pero Agamenón registra qué borraste, cuánto tardaste antes de borrar y si fue autocensura (> 1s de pausa o > 5 caracteres).
- **Latencia por palabra**: detecta hesitaciones comparando el tiempo de cada palabra con el promedio personal del usuario.

### Los 6 programas especializados
Cada usuario elige un programa que adapta categorías, módulos y contexto de IA:

| Programa | Para quién |
|---|---|
| Bienestar general | Exploración abierta sin foco específico |
| Dejar un hábito | Fumadores, bebedores, scrollers compulsivos |
| Mejorar el sueño | Insomnio, rumiación nocturna, ansiedad al dormir |
| Procesar una pérdida | Duelo, separaciones, cambios de vida |
| Relación con el cuerpo | Imagen corporal, dolor crónico, reconexión |
| Encontrar propósito | Crisis de sentido, transiciones vitales |

### Los módulos terapéuticos
- **Reescritura de Recuerdos**: 3 actos — el evento como lo recordás, desde quien te quiere, como querés recordarlo en 5 años.
- **Visualización de Metas**: descripción sensorial de una meta → Claude la fragmenta en micro-acciones diarias que se inyectan en las sesiones.
- **Aversión Guiada**: para hábitos que querés eliminar — exploración amplificada, no supresión.

### El ritual de 21 días
- **El Puente**: visualización de 21 tablones. Cada sesión agrega uno. Si se rompe la racha, el puente muestra una grieta — no se reinicia, porque los procesos terapéuticos reales tampoco.
- **Seguimiento de micro-acción**: antes de cada sesión, Agamenón pregunta por la acción concreta que sugirió ayer.
- **Memoria entre sesiones**: las palabras más frecuentes de la última sesión aparecen al iniciar la siguiente.

### La Carta Semanal
Cada semana, Claude Sonnet genera una carta íntima — no un análisis, una carta — con las palabras que más aparecieron, el patrón que el consciente quizás no vio, y una sola pregunta profunda para la semana que empieza.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.1 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Backend / Auth / DB | Supabase (PostgreSQL + RLS) |
| AI — análisis por sesión | Claude Haiku 4.5 |
| AI — carta semanal, módulos | Claude Sonnet 4.6 |
| Deploy | Vercel |

---

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Variables de entorno (.env.local)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...

# 3. Ejecutar migraciones en Supabase (en orden)
# supabase/schema.sql → 001 → 002 → 003 → 004 → 005

# 4. Desarrollo
npm run dev

# 5. Build (incluye type check)
npm run build
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                    # Landing
│   ├── dashboard/page.tsx          # Dashboard principal
│   ├── session/
│   │   ├── new/page.tsx            # Flujo principal (6 steps)
│   │   ├── rewrite/page.tsx        # Módulo: Reescritura
│   │   ├── goals/page.tsx          # Módulo: Metas
│   │   └── aversion/page.tsx       # Módulo: Aversión
│   └── api/
│       ├── analyze/route.ts        # Claude Haiku — análisis
│       ├── weekly-letter/route.ts  # Claude Sonnet — carta
│       ├── rewrite/route.ts        # Claude Sonnet — reescritura
│       ├── goals/route.ts          # Claude Sonnet — metas
│       └── aversion/route.ts       # Claude Sonnet — aversión
├── components/
│   ├── editor/WritingEditor.tsx    # Editor con deletion tracking
│   ├── session/
│   │   ├── PuenteDeLosDias.tsx     # Visualización racha 21 días
│   │   ├── CartaSemanal.tsx        # Carta semanal
│   │   └── VocabularioPersonal.tsx # Nube histórica de palabras
│   └── ui/
│       ├── ProgramSelector.tsx     # Selector de programa
│       └── ChangeProgramPanel.tsx  # Panel cambio de programa
└── lib/
    ├── programs.ts                 # 6 programas + contextos Claude
    ├── prompts.ts                  # 53+ prompts × 9 categorías × 3 profundidades
    └── types.ts                    # TypeScript types

supabase/
├── schema.sql + migrations/001-005 # Schema y evolución
└── templates/                      # Email templates con identidad visual
    ├── magic_link.html
    ├── confirm.html
    ├── recovery.html
    └── email_change.html

docs/
├── PRODUCTO.md                     # Plan de producto y fases
├── PROGRAMAS.md                    # Diseño de los 6 programas
├── ARQUITECTURA.md                 # Arquitectura técnica con diagramas
└── MVP.md                          # Presentación formal del MVP
```

---

## Documentación

- [`docs/MVP.md`](docs/MVP.md) — Presentación formal del MVP: problema, solución, flujos, métricas
- [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) — Arquitectura técnica y diagramas de flujo
- [`docs/PRODUCTO.md`](docs/PRODUCTO.md) — Plan de producto por fases
- [`docs/PROGRAMAS.md`](docs/PROGRAMAS.md) — Los 6 programas especializados

---

## Diseño

Paleta oscura por defecto con modo claro disponible:
- Fondo: `#0a0907` (negro cálido)
- Texto: `#e8e2d5` (blanco marfil)
- Acento: `#c17d28` (ámbar)

El tema persiste en `localStorage` y se aplica antes de hidratación para evitar flash. No se usan clases Tailwind para colores — solo `var(--)` CSS custom properties.
