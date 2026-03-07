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
`/session/new` es un Client Component con 4 steps en estado local: `mood_before → writing → analyzing → results`. Al completar la escritura llama a `/api/analyze` (Route Handler) que invoca Claude Haiku 4.5, guarda la sesión + latency_data + insights en Supabase, y devuelve los insights al cliente.

### AI
- `/app/api/analyze/route.ts` — Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) por sesión. Recibe texto + hesitaciones, devuelve JSON con `top_words`, `contradictions`, `micro_action`, `reflection_questions`.
- Sonnet 4.6 (`claude-sonnet-4-6`) reservado para análisis semanal (Etapa 2, no implementado aún).

### Supabase
- `src/lib/supabase/client.ts` — `createBrowserClient`. **No llamar en render, solo dentro de event handlers/callbacks.**
- `src/lib/supabase/server.ts` — `createServerClient` con cookies para Server Components y Route Handlers.
- Server pages que usan Supabase necesitan `export const dynamic = 'force-dynamic'`.
- Schema completo con RLS en `supabase/schema.sql`.

### Theming
CSS custom properties en `src/app/globals.css`. Dark mode es el default (`:root`), light mode con `[data-theme="light"]`. El toggle persiste en `localStorage` y se aplica con un script inline en `layout.tsx` antes de hidratación para evitar flash. **No usar clases Tailwind para colores — usar `var(--*)` inline para consistencia entre temas.**

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
| `src/app/session/new/page.tsx` | Flujo principal del producto |
| `src/app/api/analyze/route.ts` | Integración Claude |
| `src/lib/prompts.ts` | Biblioteca de prompts por categoría |
| `src/lib/types.ts` | Tipos compartidos (Session, Insights, LatencyEntry) |
| `supabase/schema.sql` | Schema PostgreSQL con RLS |
| `PRODUCTO.md` | Plan de producto (fases, métricas, roadmap) |
