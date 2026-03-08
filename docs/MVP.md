# Murmurio — Presentación del MVP

> *El murmullo entre tu consciente y tu subconsciente.*

---

## El problema

Las aplicaciones de journaling y bienestar mental tienen un problema estructural: **el usuario escribe, lee el resultado, y no tiene razón para volver mañana**.

La causa no es la falta de features — es que el insight no se convierte en proceso. El usuario es observado una vez y abandonado. No hay continuidad, no hay ritual, no hay transformación.

Además, existe un problema más profundo en el acto mismo de escribir: **el consciente edita**. Cuando alguien escribe en un diario digital, elige las palabras con cuidado. Escribe lo que "debería" sentir, no lo que siente. El subconsciente queda fuera.

---

## La hipótesis

> Si podemos capturar no solo lo que el usuario escribe, sino **cómo lo escribe** — las pausas, las hesitaciones, lo que borra — tenemos acceso a información que el propio usuario no ve.

Esta hipótesis está fundamentada en la teoría de **Javier Botía** sobre Tito y Agamenón:
- **Tito** (el consciente) edita, controla, elige la versión presentable.
- **Agamenón** (el subconsciente) emerge en las pausas, en lo que se tarda en escribir, en lo que se borra antes de que nadie lo lea.

Murmurio da voz a Agamenón.

---

## La solución

### Un editor que observa el proceso, no solo el producto

```
Usuario escribe
      │
      ├── Latencia entre palabras → ¿hesitó aquí?
      ├── Pausa antes de borrar   → ¿autocensura?
      ├── Cantidad borrada        → ¿error tipográfico o frase suprimida?
      └── Blur tras 3s inactivo  → fuerza flujo, evita pausa crítica
```

El texto final más estos metadatos van a Claude. El análisis incluye lo que el usuario escribió **y** lo que intentó no escribir.

### Un ritual de 21 días

```
Día 1            Día 7            Día 14           Día 21
  │                │                │                │
  ▼                ▼                ▼                ▼
[sesión]  →  [sesión]  →  [sesión]  →  [puente completo]
              │                │
              ├── "¿Hiciste tu micro-acción?"
              └── "La última vez aparecieron: control, miedo, trabajo"
```

Basado en la teoría de los 21 días como umbral de conversión de comportamiento en hábito. El "Puente de 21 días" es la visualización central: cada sesión agrega un tablón. Si se rompe la racha, el puente muestra una grieta — no se reinicia, porque los procesos terapéuticos reales tampoco.

### Profundidad que evoluciona

Los prompts cambian según la cantidad de sesiones acumuladas:

| Etapa | Sesiones | Foco |
|---|---|---|
| Superficie | 0-6 | Contacto con el presente |
| Patrón | 7-13 | Identificación de repeticiones |
| Transformación | 14+ | Desde la versión futura del usuario |

---

## Los 6 programas especializados

Murmurio no es un diario genérico. Cada usuario elige un programa que adapta toda la experiencia:

```
┌─────────────────────────────────────────────────────────────────┐
│  BIENESTAR GENERAL                                              │
│  Para quien explora sin foco. Todos los módulos disponibles.    │
├─────────────────────────────────────────────────────────────────┤
│  DEJAR UN HÁBITO                                                │
│  Fumadores, bebedores, scrollers. Módulo central: Aversión.     │
│  Claude contextualiza: automatismos, vacío emocional, triggers. │
├─────────────────────────────────────────────────────────────────┤
│  MEJORAR EL SUEÑO                                               │
│  Insomnio, rumiación nocturna. Módulo central: Metas.           │
│  Claude contextualiza: pendientes emocionales, RAM mental.      │
├─────────────────────────────────────────────────────────────────┤
│  PROCESAR UNA PÉRDIDA                                           │
│  Duelo, separaciones, cambios de vida. Módulo: Reescritura.     │
│  Claude contextualiza: narración del duelo sin resolución forzada│
├─────────────────────────────────────────────────────────────────┤
│  RELACIÓN CON EL CUERPO                                         │
│  Imagen corporal, dolor crónico. Módulo central: Metas.         │
│  Claude contextualiza: reconexión sensorial, narrativa corporal. │
├─────────────────────────────────────────────────────────────────┤
│  ENCONTRAR PROPÓSITO                                            │
│  Crisis de sentido, transiciones. Módulos: Metas + Reescritura. │
│  Claude contextualiza: máscara construida vs. deseo real.       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Los módulos terapéuticos

### Reescritura de Recuerdos
Sesión guiada en 3 actos:
```
Acto 1 → El evento como lo recordás (sin borrar)
Acto 2 → Desde la perspectiva de alguien que te quiere
Acto 3 → Cómo querés recordarlo en 5 años
           │
           └── Claude observa la evolución entre los 3 textos
```
Base teórica: el recuerdo no es un archivo fijo — cada vez que se narra, se reescribe. Este módulo hace ese proceso intencional.

### Visualización de Metas
```
Usuario describe meta sensorialmente
("Me levanto y siento el peso del silencio...")
           │
           ▼
Claude genera 5 micro-acciones físicas y concretas
           │
           ▼
La meta se inyecta silenciosamente en el prompt
de Claude en las próximas sesiones principales
```
Base teórica: el propósito no se activa con listas de objetivos. Se activa cuando el cuerpo ya "sabe" cómo se siente llegar.

### Aversión Guiada
Para hábitos que el usuario quiere eliminar: el usuario escribe y amplifica todo lo negativo del hábito. No supresión — exploración dirigida. Claude observa y amplifica la aversión sin moralizar.

---

## El loop de valor completo

```
                        ┌─────────────────────────┐
                        │      DASHBOARD           │
                        │                          │
                        │  El Puente (racha 21d)   │
                        │  Carta Semanal           │
                        │  Vocabulario Personal    │
                        │  Módulos (programa)      │
                        └────────────┬─────────────┘
                                     │
                              Nueva sesión
                                     │
                    ┌────────────────▼──────────────────┐
                    │         PRE-SESIÓN                 │
                    │  "¿Hiciste tu micro-acción?"       │
                    │  Palabras de la última sesión      │
                    └────────────────┬──────────────────┘
                                     │
                    ┌────────────────▼──────────────────┐
                    │         ESCRITURA                  │
                    │  Editor con deletion tracking      │
                    │  Prompt según programa + depth     │
                    │  Blur por inactividad              │
                    └────────────────┬──────────────────┘
                                     │
                    ┌────────────────▼──────────────────┐
                    │         AGAMENÓN RESPONDE          │
                    │  Palabras con peso                 │
                    │  Contradicciones detectadas        │
                    │  Micro-acción para mañana          │
                    │  Preguntas de reflexión            │
                    └────────────────┬──────────────────┘
                                     │
                              ────────────
                              Mañana: volvés
                              y se cierra el loop
```

---

## El estado del MVP

### Implementado y funcionando

- [x] Auth completo (magic link + password) con email templates con identidad visual
- [x] Editor terapéutico: latencia, deletion tracking, blur por inactividad
- [x] 6 steps del flujo de sesión (loading → pre_session → mood → writing → analyzing → results)
- [x] Claude Haiku 4.5 para análisis por sesión (top_words, contradicciones, micro-acción, preguntas)
- [x] Seguimiento de micro-acción entre sesiones
- [x] El Puente de 21 días con RPC de Supabase
- [x] Memoria entre sesiones (palabras históricas)
- [x] Carta Semanal con Claude Sonnet 4.6 (idempotente por semana)
- [x] Vocabulario Personal (nube histórica)
- [x] Prompts que evolucionan por depth (3 niveles × 9 categorías × 53+ prompts)
- [x] Módulo: Reescritura de Recuerdos (3 actos + Claude Sonnet)
- [x] Módulo: Visualización de Metas (descripción sensorial → micro-acciones → inyección)
- [x] Módulo: Aversión Guiada (sin persistencia, observable en sesión)
- [x] 6 Programas especializados con contexto diferenciado en Claude
- [x] ChangeProgramPanel en dashboard
- [x] Dark mode / Light mode con anti-flash
- [x] RLS en todas las tablas de Supabase

### No incluido en MVP (próximas iteraciones)

- [ ] Onboarding interactivo (actualmente el usuario elige programa sin guía)
- [ ] Notificaciones push / email recordatorio de sesión diaria
- [ ] Analytics del usuario (gráficos de mood_delta a lo largo del tiempo)
- [ ] Compartir carta semanal (opt-in)
- [ ] Export de sesiones (PDF / texto plano)
- [ ] Versión móvil nativa

---

## Métricas de validación

Las métricas que determinan si el MVP funciona terapéuticamente:

| Métrica | Objetivo | Señal de fracaso |
|---|---|---|
| Retención D3 | > 40% | < 30% → pivotar |
| Retención D7 | > 25% | < 15% → pivotar |
| % que completa micro-acción | > 50% "Sí/Parcialmente" | < 30% → micro-acciones no resuenan |
| Delta de mood promedio | > +0.5 por semana | Negativo → algo falla en el proceso |
| % que llega a sesión 7 (nivel Patrón) | > 20% | < 10% → el ritual no engancha |
| Carta semanal leída | > 70% de usuarios con 2+ sesiones | < 50% → el formato no conecta |

**Regla de kill**: si al final de las primeras 2 semanas de beta la retención D3 es < 30% y el delta de mood promedio es < +0.5, no se invierte en fases posteriores.

---

## Diferenciación

| | Murmurio | Daylio | Journey | Reflectly |
|---|---|---|---|---|
| Analiza cómo escribís | Sí | No | No | No |
| Registra autocensuras | Sí | No | No | No |
| IA que escala con el usuario | Sí | No | Básico | Básico |
| Ritual de continuidad (21d) | Sí | Streak básico | No | No |
| Módulos terapéuticos | Sí | No | No | No |
| Programas por perfil | Sí | No | No | No |
| Carta semanal personalizada | Sí | No | No | No |

La diferencia central no es la IA — es el **nivel de observación**. Murmurio es el único que mira el proceso de escritura, no solo su resultado.

---

## Propuesta de valor en una línea

> Murmurio no lee lo que escribís — lee cómo lo escribís. Lo que borrás, cuándo dudás, y qué palabras te cuestan más que otras le dicen a Agamenón lo que vos aún no podés decirte.

---

## Público objetivo inicial

**Primera ola de usuarios (beta)**:
- Personas con práctica previa de journaling que sienten que "se leen a sí mismas" y quieren más profundidad
- Personas en proceso terapéutico que buscan un complemento a su terapia (no un reemplazo)
- Personas que quieren dejar un hábito y han probado apps de hábitos sin éxito sostenido

**Perfil demográfico estimado**: 25-45 años, ciudad, familiarizados con apps de bienestar, abiertos a introspección.

**Canales de adquisición iniciales**: comunidades de journaling, grupos de meditación y mindfulness, recomendación de terapeutas.

---

## Stack y decisiones técnicas clave

```
Next.js 16.1 App Router    → Server Components para SEO + Client para interactividad
Supabase                   → Auth + PostgreSQL + RLS listos para producción
Claude Haiku 4.5           → Análisis rápido (< 2s) a bajo costo por sesión
Claude Sonnet 4.6          → Calidad literaria para carta semanal y módulos
Vercel                     → Deploy instantáneo + Edge Functions
```

**Costo estimado de IA por usuario activo/mes** (estimado 20 sesiones/mes):
- Haiku (análisis): ~$0.02 por sesión × 20 = ~$0.40
- Sonnet (carta + módulos): ~$0.10 por uso × 5 = ~$0.50
- **Total: ~$0.90/usuario activo/mes**

Esto deja amplio margen para un modelo de suscripción de $8-15/mes.
