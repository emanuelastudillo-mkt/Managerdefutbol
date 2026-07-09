# Fútbol Manager MVP

**V5.12 - Simulador vivo compacto, fatiga real y cambios bot**

## Historial de versiones

### V5.12 - Simulador vivo compacto, fatiga real y cambios bot

- Rediseño del simulador vivo en formato horizontal más compacto.
- Las estadísticas del partido ahora se muestran en una sola tarjeta comparativa, con ambos equipos en la misma línea.
- El equipo del manager y el equipo bot usan el mismo formato visual de lista.
- Titulares y suplentes se muestran como filas compactas clickeables, similar al menú de táctica.
- Las sustituciones del manager se mantienen por clic: titular + suplente, con confirmación.
- Las instrucciones de campo pasan a botones inferiores centrados, sin explicación visible.
- Se mantiene la instrucción **Sin instrucciones**.
- Los jugadores de ambos equipos pierden estado físico minuto a minuto.
- La pérdida física depende principalmente de resistencia, genética, posición y esfuerzo táctico.
- El bot ahora tiene banco visible y realiza cambios automáticos coherentes.
- El bot prioriza cansancio, mal encaje de rol, contexto del resultado y minuto del partido.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting, `simulador-2.0.js`, `js/game/17-live-match.js`, `style.css` y documentación a V5.12.

### V5.11 - Simulador táctico horizontal y cambios por clic

- Rediseño del simulador vivo en formato más horizontal y compacto.
- Se agrega tablero táctico propio con titulares y banco.
- Las sustituciones ahora se hacen por clic con confirmación.
- Se puede reacomodar jugadores intercambiando titulares.
- Se agrega selector de formación dentro del partido.
- Las instrucciones pasan a botones activables.
- Agregada instrucción **Sin instrucciones**.

### V5.10 - Simulación viva minuto a minuto

- La simulación viva pasa de bloques de 15 minutos a 90 fases de 1 minuto.
- Se agregan estadísticas en vivo, relato, eventos y barra de fases.

## Instalación incremental

Subir los archivos del ZIP respetando carpetas. Después usar **Control + F5** para evitar caché del navegador.
