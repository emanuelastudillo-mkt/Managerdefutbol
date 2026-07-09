# Fútbol Manager MVP

## Historial de versiones

### V5.17 - Simulador compacto con descanso real

- El simulador vivo reduce tipografía, alto de filas y espacios verticales en listas de jugadores y eventos para evitar cortes en pantalla horizontal.
- El partido vivo ahora tiene 105 fases: 45 minutos del primer tiempo, 15 fases de descanso y 45 minutos del segundo tiempo.
- Al llegar al entretiempo, el modo automático se pausa para permitir cambios, ajuste de formación o instrucciones.
- Durante las 15 fases de descanso no se generan eventos de partido: los jugadores recuperan parte de su estado físico.
- La recuperación depende de resistencia, genética y posición, sin superar el estado físico con el que cada jugador llegó al partido.
- La barra de fases diferencia primer tiempo, descanso y segundo tiempo.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.17.

# Fútbol Manager MVP

**V5.16 - Avance diario unificado y cooldown de 20 segundos**

## Historial de versiones

### V5.16 - Avance diario unificado y cooldown de 20 segundos

- Unificados los botones **Avanzar día** e **Ir a próximo partido** en un solo botón principal.
- El botón ahora avanza un día calendario por vez o abre el partido propio si el compromiso ya está pendiente ese día.
- Cooldown único de **20 segundos** después de cada avance, amistoso, partido propio o día de postemporada.
- Durante el avance se procesan verificaciones diarias, academia, scouting, contratos, lesiones, préstamos, sponsors y partidos bot pendientes.
- Se eliminan los saltos automáticos largos hacia el próximo partido desde la oficina para evitar inconsistencias de bloqueo y fechas.
- La barra de progreso queda asociada al único botón de avance.
- Si una partida traía un bloqueo viejo más largo, se normaliza al nuevo cooldown máximo.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.16.

### V5.15 - Entrenamiento temporal, academia y cartas limpias

- Rehecho el ajuste de entrenamiento profesional de V5.14.
- Los jugadores profesionales ya no suben habilidades base de forma permanente por entrenamiento.
- El entrenamiento intensivo suma **boosts temporales de temporada** sobre habilidades existentes.
- Dos turnos de entrenamiento intensivo deberían generar normalmente entre **1 y 2 puntos temporales** en habilidades entrenables.
- Al cerrar temporada, los boosts de entrenamiento se reducen al **30%**.
- Se mantiene quitado el botón **Tratar · $50.000** de Academia.
- Los juveniles lesionados se tratan desde **Empleados** con kinesiólogo contratado y sin costo para juveniles.
- Se mantienen los 20 consejos del asistente con reemplazo de `#usuario#` por el nombre del manager.
- Apartado **Cartas** revisado: menos bloques duplicados, información más compacta, resumen de bonus activo integrado y cartas más minimalistas.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.15.

### V5.14 - Academia y consejos del asistente

- Quitado el botón **Tratar · $50.000** de las tarjetas de juveniles lesionados en Academia.
- Los juveniles lesionados se tratan desde **Empleados** con kinesiólogo contratado, sin costo para juveniles.
- Agregados 20 consejos del asistente sin especificidades duras, con reemplazo de `#usuario#` por el nombre del manager.
- El asistente envía un consejo al iniciar carrera y luego mensajes periódicos durante la partida.

### V5.13 - Auto más pausado, puntajes e iconos de partido

- El botón **Auto** del simulador vivo ahora avanza más lento: tarda el doble entre minuto y minuto.
- Se agrega puntaje vivo de partido para titulares de ambos equipos.
- El puntaje se calcula de forma coherente según media, moral, físico, encaje de rol, resultado parcial y eventos.
- Se agregan iconos acumulables junto al apellido del jugador: ⚽, 👟, 🟨, 🟥 y ✚.
- Los iconos se muestran tanto para el equipo del manager como para el bot.
- Se mantiene el formato compacto de lista para ahorrar espacio horizontal.

### V5.12 - Simulador vivo compacto, fatiga real y cambios bot

- Rediseño del simulador vivo en formato horizontal más compacto.
- Las estadísticas del partido ahora se muestran en una sola tarjeta comparativa, con ambos equipos en la misma línea.
- El equipo del manager y el equipo bot usan el mismo formato visual de lista.
- Titulares y suplentes se muestran como filas compactas clickeables, similar al menú de táctica.
- Las instrucciones de campo pasan a botones inferiores centrados, sin explicación visible.
- Los jugadores de ambos equipos pierden estado físico minuto a minuto.
- El bot ahora tiene banco visible y realiza cambios automáticos coherentes.

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
