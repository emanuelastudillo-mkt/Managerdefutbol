# Características V5.01 - Limpieza de auditoría y Everton por país

## Cambios

- Se separaron los escudos de Everton por país con rutas `everton-chi.png` y `everton-eng.png`.
- Se agregó compatibilidad para partidas guardadas que todavía tengan `everton.png`.
- Se corrigieron las 13 rutas argentinas con acentos para que vuelvan a coincidir con los nombres reales `#U00xx` incluidos en el ZIP.
- Se mantiene fallback visual a `everton.png` mientras no existan los dos PNG nuevos.
- Se optimizó el arranque con partida guardada: si hay snapshots completos, no se carga `data/jugadores.json` al iniciar.
- Se permite cargar partidas con snapshots aunque cambie la firma de la base por ajustes menores de datos.
- Se recarga la base completa después de resetear partida para evitar heredar datos de una partida anterior.
- Se documentaron archivos candidatos a eliminación en versión completa: escudos huérfanos y JSON legacy de estadios/hinchas.

## Motivo

V5.01 aplica los ajustes pendientes detectados en la auditoría V5.00 sin cambiar reglas deportivas, economía ni simulación. El objetivo principal es reducir contradicciones visuales, mejorar la carga con partidas existentes y dejar una lista clara de archivos removibles para una próxima versión completa.
