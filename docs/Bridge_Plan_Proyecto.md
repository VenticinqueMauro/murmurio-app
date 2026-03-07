  
**BRIDGE**

*El Puente entre tu Consciente y tu Subconsciente*

Plan de Proyecto

Documento de Producto, Arquitectura y Roadmap de Desarrollo

Marzo 2026

v1.0

# **1\. ¿Qué es Bridge?**

Bridge es una aplicación web de escritura terapéutica y autoconocimiento basada en la teoría del consciente (Tito) y el subconsciente (Agamenón) popularizada por el mentalista Javier Botía. Su premisa fundamental es que la mayoría de los problemas de ansiedad, bloqueos emocionales y falta de claridad mental provienen de que el consciente intenta resolver cosas que el subconsciente ya sabe, pero no puede expresar.

Bridge actúa como traductor entre ambos, utilizando técnicas de escritura libre bajo presión, análisis de latencia de tecleo y procesamiento de lenguaje natural con IA para extraer lo que el subconsciente quiere comunicar.

## **1.1 Problema que resuelve**

* Las personas experimentan ansiedad, bloqueos y confusión porque su consciente (Tito) intenta controlar situaciones que el subconsciente (Agamenón) ya tiene resueltas, pero no logra comunicar.

* Las técnicas tradicionales de journaling no aplican presión temporal ni impiden la autocensura, lo que permite al consciente filtrar y racionalizar la información.

* No existe una herramienta digital que mida indicadores involuntarios (latencia de tecleo, patrones de evasión) como proxy del lenguaje corporal del subconsciente.

* Los usuarios no tienen visibilidad sobre sus patrones emocionales recurrentes a lo largo del tiempo.

## **1.2 Propuesta de valor**

Para personas que buscan autoconocimiento y manejo de ansiedad, **Bridge** es una herramienta de escritura terapéutica que a diferencia de apps de meditación o diarios digitales convencionales, utiliza presión temporal, análisis de latencia de tecleo e inteligencia artificial para forzar al consciente a soltar el control y dejar hablar al subconsciente, entregando insights accionables en forma de micro-acciones diarias.

# **2\. Concepto Core: El Mecanismo de Desconexión**

## **2.1 Escritura sin retorno**

El usuario no puede borrar, editar ni retroceder. Si deja de escribir por más de 3 segundos, la pantalla se difumina progresivamente como presión visual. Esto obliga a Tito a dejar de filtrar, permitiendo que el flujo sea más subconsciente. Es el equivalente digital a "cortar el hilo" entre el enano y el gigante.

## **2.2 Análisis de latencia**

El sistema mide en segundo plano la velocidad de tecleo palabra por palabra. Si el usuario escribe "estoy bien con mi trabajo" pero tarda el triple en tipear esa frase, hay una señal real del subconsciente. Es el equivalente digital del pestañeo involuntario que menciona Botía como indicador en interrogatorios.

## **2.3 IA como espejo, no como consejero**

La IA no da consejos. Devuelve preguntas basadas en contradicciones detectadas, palabras cargadas emocionalmente y patrones de evasión. El output final es: las 5 palabras más cargadas emocionalmente (lo que dijo Agamenón) y una micro-acción física concreta para el día (porque al gigante se le entrena con actos, no con palabras).

## **2.4 Medición de impacto**

Slider de estado de ánimo antes y después de cada sesión (ansioso ↔ tranquilo, confundido ↔ claro). Esto permite medir cuantitativamente si las sesiones generan un efecto real, y rastrear la evolución a lo largo de los 21 días que Botía menciona como umbral para que un comportamiento se convierta en hábito.

# **3\. Stack Tecnológico**

Todas las versiones listadas corresponden a las últimas releases estables a marzo 2026\.

| Capa | Tecnología | Justificación |
| :---- | :---- | :---- |
| Frontend | Next.js 16.1 | App Router, RSC, Turbopack estable. Framework principal del proyecto. |
| UI | React 19 \+ Tailwind CSS 4 | Componentes funcionales con hooks. Tailwind para styling rápido y consistente. |
| Backend / BaaS | Supabase (v1.26+) | PostgreSQL managed con Auth, RLS, Realtime y Edge Functions. PostgREST v14. |
| ORM / Queries | Supabase JS Client v2 | Cliente isomorfo para queries, auth y storage. Type-safe con generación automática. |
| IA — Análisis | Claude Haiku 4.5 | $1/$5 por millón de tokens. Rápido y económico para NLP en tiempo real. |
| IA — Profundo | Claude Sonnet 4.6 | $3/$15 por millón de tokens. Para análisis de patrones complejos y generación de insights semanales. |
| Auth | Supabase Auth | OAuth con Google/GitHub, magic links. RLS nativo para privacidad total. |
| Deploy | Vercel | Deploy automático desde GitHub. Edge Functions, previews por PR. |
| Lenguaje | TypeScript 5.7+ | Tipado estricto end-to-end. Tipos generados automáticamente desde Supabase. |

## **3.1 ¿Por qué Claude y no otro modelo?**

El análisis de sentimiento y detección de patrones emocionales requiere un modelo que sobresalga en comprensión de matices del lenguaje natural en español. Claude destaca en instrucción-following preciso y razonamiento contextual. La estrategia de dos modelos permite optimizar costos: Haiku 4.5 para procesamiento en tiempo real por sesión (rápido, barato) y Sonnet 4.6 para análisis profundo semanal o bajo demanda. Con prompt caching, el costo se reduce hasta un 90% en prompts repetidos.

# **4\. Arquitectura de la Aplicación**

## **4.1 Modelo de datos (Supabase / PostgreSQL)**

**users:** Perfil del usuario. Se extiende la tabla auth.users de Supabase con campos como display\_name, timezone, created\_at y streak\_count (días consecutivos de uso).

**sessions:** Cada sesión de escritura. Contiene user\_id, prompt utilizado, texto raw (encriptado), duración, mood\_before (slider 1-10), mood\_after (slider 1-10), timestamps.

**latency\_data:** Datos de latencia por palabra/frase. Campos: session\_id, word, position\_in\_text, latency\_ms, is\_hesitation (boolean calculado si supera 2x el promedio del usuario).

**insights:** Resultados del análisis de IA por sesión. Contiene: top\_words (las 5 palabras cargadas), contradictions (array de contradicciones detectadas), micro\_action (acción física sugerida), reflection\_questions (preguntas espejo).

**patterns:** Patrones detectados a lo largo del tiempo. Temas recurrentes, palabras evitadas, correlaciones entre mood y eventos. Generados por Sonnet 4.6 en análisis semanal.

## **4.2 Flujo de una sesión**

* **Entrada:** El usuario registra su estado de ánimo (slider). Recibe un prompt diseñado para bypasear al consciente.

* **Escritura (3–10 min):** Escribe sin poder borrar. Timer de inactividad de 3 segundos difumina la pantalla. Se captura latencia por keystroke en el frontend.

* **Procesamiento:** Al terminar, el texto \+ datos de latencia se envían a una Edge Function de Supabase que llama a Claude Haiku 4.5 con un system prompt específico.

* **Output — La Respuesta del Gigante:** Se oculta el texto original (para que Tito no lo juzgue). Se muestran las 5 palabras clave emocionales, una micro-acción física para el día, y opcionalmente preguntas espejo.

* **Cierre:** Segundo slider de estado de ánimo. Se registra el delta.

## **4.3 Seguridad y privacidad**

Los textos de las sesiones son extremadamente privados. Se almacenan encriptados en Supabase con Row Level Security (RLS) estricto: cada usuario solo puede acceder a sus propios datos. Las Edge Functions procesan el texto con la API de Claude y devuelven solo los insights, nunca almacenando el texto raw en logs. El usuario puede eliminar todo su historial en cualquier momento.

# **5\. Roadmap de Desarrollo**

## **Etapa 1 — MVP Core (2 semanas)**

**Objetivo:** Validar si la escritura bajo presión con análisis de IA genera un impacto real y medible en el estado de ánimo del usuario.

| Sem. | Entregable | Criterio de éxito |
| :---- | :---- | :---- |
| 1 | Setup proyecto (Next.js 16.1 \+ Supabase \+ Auth). Editor de escritura sin retorno con timer de inactividad 3s. Captura de latencia por keystroke. Slider de mood before/after. | El editor funciona fluidamente. Los datos de latencia se persisten correctamente. |
| 2 | Integración con Claude Haiku 4.5 vía Edge Function. System prompt para extracción de palabras clave, contradicciones y micro-acción. UI de resultados ("La Respuesta del Gigante"). Dashboard mínimo con historial de sesiones y deltas de mood. | 10–15 usuarios de prueba completan al menos 5 sesiones. Retención día 3 \> 50%. |

## **Etapa 2 — Patrones y Profundidad (2 semanas)**

**Objetivo:** Demostrar que con datos acumulados, la app revela patrones que el usuario no conocía sobre sí mismo.

* Análisis semanal con Claude Sonnet 4.6: patrones recurrentes, temas evitados, correlaciones mood/eventos.

* Mapa de latencia visual: representación gráfica de las palabras/temas donde el usuario duda más.

* Sistema de racha (streak) de 21 días con progreso visual — basado en la regla de formación de hábitos de Botía.

* Biblioteca de prompts categorizados: ansiedad, relaciones, trabajo, autoconocimiento general.

* Notificaciones (opcionales) para mantener la cadena de escritura diaria.

| Métrica | Target | Cómo se mide |
| :---- | :---- | :---- |
| Retención día 7 | \> 40% | Usuarios activos día 7 / registros |
| Delta mood promedio | \> \+1.5 puntos | Promedio (mood\_after \- mood\_before) |
| Insight útil (cualitativo) | \> 60% reportan descubrimiento | Encuesta post-análisis semanal |

## **Etapa 3 — La Máquina del Tiempo (2 semanas)**

**Objetivo:** Aportar herramientas de transformación activa, no solo observación.

* Módulo de reescritura de recuerdos: sesiones guiadas donde el usuario escribe un evento doloroso, luego lo reescribe desde otra perspectiva, y finalmente como le gustaría recordarlo.

* Visualizador de metas con micro-recordatorios: el usuario define un objetivo, lo describe sensorialmente, y la app lo presenta de formas inesperadas a lo largo del día.

* Técnica de aversión guiada: para hábitos que el usuario quiere eliminar, sesiones de escritura enfocadas en explorar y amplificar el rechazo al hábito.

* Exportación de datos y timeline personal de evolución.

## **Etapa 4 — Escala y Monetización (3–4 semanas)**

**Objetivo:** Si las etapas anteriores validan el concepto, preparar para crecimiento.

* PWA / app móvil para sesiones de escritura en cualquier momento.

* Plan freemium: 3 sesiones/semana gratis, ilimitadas con suscripción.

* Audio-sesiones guiadas con frecuencias theta (inspiradas en la propuesta de Botía de regalar audiohipnosis).

* API pública para que terapeutas o coaches integren Bridge en sus prácticas.

* Integración con wearables para correlacionar datos fisiológicos (frecuencia cardíaca, sueño) con patrones de escritura.

# **6\. Estrategia de IA**

## **6.1 Modelos y uso**

| Modelo | Uso | Costo | Frecuencia |
| :---- | :---- | :---- | :---- |
| Claude Haiku 4.5 | Análisis por sesión: extracción de palabras clave, contradicciones, micro-acción | $1 / $5 por 1M tokens | Cada sesión (diario) |
| Claude Sonnet 4.6 | Análisis semanal profundo: patrones, correlaciones, evolución | $3 / $15 por 1M tokens | 1x por semana |

## **6.2 Estimación de costos por usuario**

Asumiendo un usuario activo que hace 1 sesión diaria de \~500 palabras (\~700 tokens de input) con un system prompt de \~800 tokens y una respuesta de \~400 tokens:

1. **Haiku diario:** \~1,500 tokens input \+ \~400 tokens output por sesión. 30 sesiones/mes \= \~45K input \+ \~12K output. Costo: \~$0.10/mes por usuario.

2. **Sonnet semanal:** \~10K tokens input (resumen semanal) \+ \~2K output. 4 análisis/mes \= \~40K input \+ \~8K output. Costo: \~$0.24/mes por usuario.

3. **Total IA por usuario:** \~$0.34/mes. Con prompt caching se reduce a \~$0.10–$0.15/mes.

## **6.3 System prompt — Filosofía**

El prompt de Bridge no instruye a Claude a dar consejos ni diagnósticos. Le instruye a actuar como un espejo inteligente que detecta lo que el consciente intenta ocultar. Las reglas clave del prompt incluyen: nunca dar consejos directos (solo preguntas), priorizar contradicciones entre lo escrito y la latencia, usar lenguaje que hable al subconsciente (sensorial, concreto, presente), y generar micro-acciones físicas que rompan el ciclo de rumiación mental.

# **7\. Métricas de Validación**

La hipótesis central es: la escritura bajo presión temporal con análisis de latencia e IA genera un impacto positivo y medible en el autoconocimiento y la reducción de ansiedad. Para validarla:

| Métrica | Qué valida | Target MVP | Herramienta |
| :---- | :---- | :---- | :---- |
| Retención D1/D3/D7 | El producto engancha | D1\>70%, D3\>50%, D7\>40% | Supabase queries |
| Delta mood por sesión | Efecto inmediato real | Promedio \> \+1.5 pts | Slider antes/después |
| Sesiones por semana | Formación de hábito | \> 4 sesiones/sem | Conteo automático |
| NPS cualitativo | Valor percibido | \> 8/10 en encuesta | Entrevistas \+ form |
| Descubrimiento | La app revela algo nuevo | \> 60% reportan insight | Pregunta post-sesión |

**Regla de kill/pivot:** Si al final de la Etapa 1 (2 semanas) la retención D3 es menor al 30% y el delta de mood promedio es menor a \+0.5, se pivotea o se descarta. No se invierte en Etapa 2 sin validación.

# **8\. Visión**

Bridge no es una app de journaling más. Es un intérprete entre dos partes de ti que no saben comunicarse. Si la hipótesis se valida, el potencial es enorme: desde integración con terapeutas profesionales hasta uso en entornos corporativos para manejo de estrés, pasando por herramientas educativas para que los jóvenes aprendan a escuchar a su propio Agamenón antes de que la ansiedad les gane la partida.

*Como dice Botía: el gigante es muy poderoso, pero necesita que le enseñes a hablar. Bridge es ese puente.*