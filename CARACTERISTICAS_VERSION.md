# Características de la versión V5.17

## Simulador vivo más compacto

- Se redujo aproximadamente 10% la tipografía de listas de jugadores y eventos.
- Se achicaron paddings, alto de filas y espacios verticales para aprovechar mejor pantallas horizontales.
- Las listas de titulares, banco y eventos mantienen scroll propio para evitar que la parte inferior del simulador quede cortada.

## Entretiempo con fases de descanso

- El partido vivo ahora se divide en 105 fases:
  - 45 fases del primer tiempo.
  - 15 fases de descanso.
  - 45 fases del segundo tiempo.
- Al llegar a los 45 minutos, el modo automático se pausa y permite pensar cambios, formación o instrucciones.
- Durante el descanso no se generan goles, tarjetas, lesiones ni estadísticas nuevas.

## Recuperación física

- En cada fase de descanso, los jugadores en cancha recuperan algo de estado físico.
- La recuperación depende de resistencia, genética y posición.
- La recuperación sólo compensa desgaste del partido: no supera el estado físico inicial de cada jugador.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. Afecta partidos propios futuros o pendientes que abran el simulador vivo.
