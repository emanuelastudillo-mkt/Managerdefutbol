# Características de la versión V5.13

## Simulador vivo

- El modo **Auto** ahora tarda el doble en avanzar de minuto a minuto.
- La demora queda configurable en `GAME_CONFIG.ui.simulacionVivaAutoMs`.
- Se mantiene el botón manual **Simular 1 minuto** para avanzar sin esperar.

## Puntajes e iconos de jugadores

- Cada titular en cancha muestra un puntaje vivo de partido.
- El puntaje combina media, moral, físico, encaje de rol, resultado parcial y eventos del partido.
- Los eventos positivos elevan el puntaje: goles, asistencias y tapadas.
- Los eventos negativos lo reducen: amarillas, rojas, errores y lesiones.
- Junto al apellido se acumulan iconos de estado:
  - ⚽ gol
  - 👟 asistencia
  - 🟨 amarilla
  - 🟥 roja
  - ✚ lesión

## Interfaz

- Los iconos se agregan dentro de la misma fila del jugador para no crear bloques extra.
- El equipo del manager y el equipo bot mantienen el mismo formato visual.
- La lista se ajusta para sumar la columna **Pun** sin romper el diseño compacto horizontal.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. Afecta partidos propios futuros o pendientes que abran el simulador vivo.
