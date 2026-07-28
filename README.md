# V8.72 — Motor central de carrera y decisiones

Incremental compatible con V8.71.

## Cambios principales

- Motor persistente de eventos de carrera integrado con Mensajes.
- Decisiones de directiva, vestuario, desarrollo y economía.
- Las nuevas decisiones no bloquean el calendario.
- Cada decisión tiene vencimiento; no responder también genera una consecuencia.
- Consecuencias diferidas evaluadas por resultados, confianza, minutos y presupuesto.
- Eventos automáticos sin respuesta para rachas, tensiones internas y dudas institucionales.
- Mensajes informativos que explican momentos importantes sin exigir una acción.
- Límites de frecuencia, tiempos de espera y protección contra eventos repetidos.
- Registro de decisiones, resultados y consecuencias por club, temporada y etapa laboral.
- Integración de las decisiones de vestuario anteriores dentro del historial general.
- Confianza de la directiva de 0 a 100.
- Las tendencias acumuladas pueden modificar hasta ±1 punto adicional por capacidad al cerrar la etapa.
- Resumen narrativo final enriquecido con decisión principal, confianza de la directiva y consecuencias pendientes.
- Nuevo resumen de decisiones y contexto dentro de Perfil e historial.

## Frecuencia inicial

- Revisión cada 7 días.
- Primera revisión desde el día 20.
- Máximo de 2 decisiones interactivas cada 30 días.
- Máximo de 3 eventos automáticos cada 30 días.
- Una sola decisión nueva pendiente a la vez.
- Vencimiento habitual: 5 días.

## Archivos

- `index.html`
- `config.js`
- `js/game/05m-manager-career-events.js`
- `styles/170-manager-career-events.css`

No requiere Worker, SQL ni recursos gráficos nuevos.
