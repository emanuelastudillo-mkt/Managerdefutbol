# Una Vida de Mánager · V8.76 incremental

Aplicar sobre **V8.75** conservando la estructura de carpetas.

## Corrección de frecuencia de eventos de carrera

- Se corrigió la repetición excesiva de `Los referentes piden una definición` en partidas iniciadas antes de incorporar el motor de eventos.
- La causa era la ausencia de un identificador estable de etapa laboral en algunas partidas migradas. El sistema podía interpretar días consecutivos como etapas distintas y reiniciar sus bloqueos.
- Las etapas duplicadas de la misma temporada y club se consolidan automáticamente al cargar.
- Los mensajes y registros anteriores también se utilizan como bloqueo, aunque el estado interno antiguo estuviera incompleto.
- Una misma decisión interactiva sólo puede aparecer una vez durante una etapa laboral, salvo futuros eventos configurados expresamente con otro límite.
- El evento de referentes requiere ahora una tensión más clara:
  - al menos ocho partidos de temporada;
  - al menos cinco partidos desde la llegada del mánager;
  - confianza general inferior a 45 o confianza de referentes inferior a 42.
- Se amplió a 90 días la protección contra repetición del mismo evento.
- Dos decisiones de la misma categoría deben quedar separadas por al menos 35 días.
- Las decisiones interactivas deben quedar separadas por al menos 21 días.

## Llegada a un nuevo club

- Al asumir un equipo se aplican 21 días de adaptación antes de generar eventos especiales de carrera.
- También deben haberse disputado al menos cuatro partidos desde la llegada.
- Los eventos pendientes duplicados del mismo tipo se cierran y unifican sin aplicar nuevas consecuencias.
- Los eventos del club anterior no reinician ni contaminan el vestuario del nuevo equipo.

## Compatibilidad

- Compatible con partidas de V8.75 y anteriores migradas hasta esa versión.
- Los eventos ya respondidos permanecen en el historial; no se revierten sus efectos.
- No requiere cambios de Worker, SQL ni recursos gráficos.

## Archivos modificados

- `config.js`
- `index.html`
- `js/game/05m-manager-career-events.js`
