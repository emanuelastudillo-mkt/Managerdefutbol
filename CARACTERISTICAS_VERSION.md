# Características de la versión V5.15

## Entrenamiento profesional

- Se corrige el enfoque de V5.14: los profesionales no aumentan sus habilidades base por entrenamiento.
- El entrenamiento intensivo ahora suma puntos temporales de temporada en `playerSkillBoosts`.
- Dos turnos intensivos deberían producir normalmente entre 1 y 2 puntos temporales en habilidades entrenables.
- El progreso se acumula internamente para evitar que una tirada mala deje el entrenamiento en cero.
- Al finalizar la temporada, los puntos entrenados se reducen al 30%.
- La media visible puede subir durante la temporada porque toma esos boosts, pero la base del jugador queda fija.

## Academia

- Se mantiene eliminado el botón directo **Tratar · $50.000** en juveniles lesionados.
- La Academia informa que el juvenil no entrena hasta ser tratado desde Empleados con kinesiólogo contratado o hasta recuperarse.
- Los tratamientos de juveniles quedan centralizados en Empleados y se mantienen gratuitos.

## Mensajes del asistente

- Se mantienen los 20 mensajes de consejos generales del asistente.
- Los mensajes no dan valores exactos ni revelan mecánicas internas duras.
- Se reemplaza `#usuario#` por el nombre del manager.

## Cartas

- Menú de cartas compactado y renombrado visualmente como **Cartas**.
- Se integra el resumen de bonus activo en la misma zona de cartas activas.
- Se eliminan bloques visuales redundantes de reglas/bonus.
- Las cartas usan diseño más bajo y minimalista para mostrar más información en menos espacio.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. Las partidas existentes conservan progreso, puntos, cartas y juveniles. Los próximos entrenamientos intensivos empiezan a usar boosts temporales.
