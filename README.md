# Una vida de manager — V8.68

## Base requerida

Aplicar este incremental sobre **V8.67**.

## Control silencioso de lesiones

- Se incorpora un seguimiento interno de las lesiones del primer equipo durante cada temporada.
- El mínimo de referencia queda establecido en **30 lesiones por temporada**.
- Las lesiones producidas durante los partidos se cuentan antes de aplicar cualquier compensación.
- Cuando el club queda por debajo del ritmo esperado, el sistema puede generar una lesión de entrenamiento entre semana.
- La compensación se distribuye progresivamente durante la temporada y no espera al cierre para concentrar lesiones.
- En los últimos siete días de la fase regular se completa cualquier diferencia pendiente para alcanzar el mínimo.
- Las lesiones compensatorias son principalmente leves o moderadas: sobrecargas, contusiones, distensiones, esguinces leves y desgarros.
- Se limita la cantidad habitual de lesionados simultáneos y se evita repetir al mismo jugador de forma inmediata.
- Se protege al único arquero disponible y se conserva un mínimo operativo de jugadores.
- Los jugadores con mayor carga, fatiga o participación tienen prioridad cuando varios candidatos poseen la misma cantidad de lesiones.

## Comportamiento visible

- No se crean mensajes, notificaciones ni avisos especiales explicando la compensación.
- La lesión aparece únicamente mediante los sistemas normales del juego: disponibilidad del jugador, táctica y tratamiento médico.
- Si el jugador estaba convocado, se retira de la táctica y se exige completar nuevamente la formación.

## Compatibilidad

- Compatible con partidas existentes de V8.67.
- Las partidas comenzadas reconstruyen el contador mediante el historial de partidos y las estadísticas de la temporada.
- El contador se reinicia automáticamente al cambiar de temporada o de club.
- No requiere cambios de Worker, SQL ni recursos gráficos.

## Archivos modificados

- `README.md`
- `config.js`
- `index.html`
- `js/core/01-config-constants.js`
- `js/game/09b-calendar-quick-simulation.js`
- `js/game/11-match-engine.js`
