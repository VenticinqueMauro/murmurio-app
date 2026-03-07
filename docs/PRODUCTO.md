# Murmurio — Plan de Producto

> Enfoque: valor real al usuario, no features técnicas.

---

## El problema central de retención

La mayoría de apps de journaling mueren en el día 3. El usuario escribe, lee el insight, y no tiene razón para volver mañana. **Murmurio necesita que volver mañana sea parte del mecanismo terapéutico, no solo una feature.**

La base teórica ya lo dice: Botía habla de **21 días** como umbral para que un comportamiento se convierta en hábito. Eso no es un streak decorativo — es el producto.

---

## El loop de valor diario

```
Hoy → Sesión → Insight + Micro-acción
               ↓
Mañana → "¿Hiciste tu micro-acción?" → Nueva sesión
               ↓
         Agamenón recuerda lo de ayer
```

Sin ese loop, Murmurio es una herramienta de curiosidad. Con él, es un proceso de transformación.

---

## Fase 1 — El Ritual (semanas 1-2)

**Objetivo**: que el usuario sienta que volver mañana tiene sentido.

### 1. Seguimiento de la micro-acción
Antes de cada sesión nueva, una sola pregunta:

> *"Ayer Agamenón te sugirió: [micro-acción]. ¿La hiciste?"*

→ Sí / Parcialmente / No (sin juicio, solo registro)

Por qué importa: crea continuidad entre sesiones. El usuario empieza a ver que las sesiones no son eventos aislados sino capítulos de una historia.

### 2. El Puente de 21 días
No un contador de racha — una visualización de un puente que se construye tablón a tablón. Cada sesión agrega uno. Al día 21, el puente está completo.

Si se rompe la racha: el puente no desaparece, se muestra una grieta. Esto es intencional — los procesos terapéuticos reales no se reinician desde cero.

### 3. Memoria entre sesiones
Al iniciar una sesión, Murmurio muestra brevemente:

> *"La última vez, Agamenón señaló: **control, miedo, trabajo**"*

Esto contextualiza la sesión del día y permite al usuario (y a la IA) detectar si esas palabras reaparecen.

---

## Fase 2 — La Evolución (semanas 3-4)

**Objetivo**: que el usuario vea algo sobre sí mismo que no sabía.

### 1. La Carta Semanal de Agamenón
Cada domingo, generada por Claude Sonnet 4.6:
- Las 3 palabras que más aparecieron esta semana
- Un patrón detectado entre las sesiones
- Una pregunta profunda para la semana que empieza
- El delta de mood de la semana

Formato: una carta, no un dashboard. Lenguaje íntimo, no analítico.

### 2. El Vocabulario Personal
Con el tiempo, Murmurio construye el "diccionario de Agamenón" del usuario: sus palabras cargadas históricas, las que evita, las que aparecen siempre juntas. Este vocabulario personaliza los prompts futuros.

### 3. Prompts que evolucionan
- **Semana 1**: preguntas de superficie (¿cómo te sentís?)
- **Semana 2**: preguntas de patrón (¿esto ya lo viviste antes?)
- **Semana 3+**: preguntas de transformación (¿qué haría la versión de vos que ya cruzó el puente?)

---

## Fase 3 — La Transformación (mes 2)

**Objetivo**: herramientas activas, no solo observación.

### 1. Reescritura de recuerdos
Sesión guiada en 3 actos:
1. Escribir el evento como lo recordás (sin borrar)
2. Escribirlo desde la perspectiva de alguien que te quiere
3. Escribir cómo querés recordarlo en 5 años

### 2. Visualización de metas
El usuario describe una meta sensorialmente (no "quiero éxito" sino "me levanto y siento..."). Murmurio la fragmenta en micro-acciones diarias y la inyecta en las sesiones de forma inesperada.

### 3. Técnica de aversión guiada
Para hábitos que el usuario quiere eliminar: sesiones donde escribe y amplifica todo lo negativo del hábito. No supresión — exploración dirigida.

---

## Métricas que importan (no las técnicas)

| Métrica | Lo que realmente mide |
|---|---|
| % que completa su micro-acción | Si el insight se convierte en acción real |
| Palabras que desaparecen del vocabulario | Si el proceso genera cambio genuino |
| Delta de mood acumulado (semana 3 vs semana 1) | Si Murmurio funciona terapéuticamente |
| % que llega al día 21 | Si el ritual se convirtió en hábito |

---

## Orden de construcción

```
Ahora      → Seguimiento micro-acción + memoria entre sesiones
Semana 2   → El Puente de 21 días (visualización)
Semana 3   → La Carta Semanal (Sonnet 4.6)
Semana 4   → Vocabulario personal + prompts que evolucionan
Mes 2      → Módulos de transformación activa
```

---

## Regla de kill / pivot (del plan original)

> Si al final de las primeras 2 semanas la retención D3 es menor al 30% y el delta de mood promedio es menor a +0.5, se pivotea o se descarta. No se invierte en fases posteriores sin validación.
