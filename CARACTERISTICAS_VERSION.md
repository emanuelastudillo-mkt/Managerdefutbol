# Características V5.02 - Desbloqueo de temporada y ojeo limpio

## Cambios

- Se agregó una herramienta lateral de recuperación: `Desbloquear y nueva temporada`.
- La herramienta fuerza el comienzo de la siguiente temporada sin borrar la partida local.
- El proceso protege explícitamente manager, prestigio, experiencia, puntos de habilidad y cartas especiales.
- La temporada que se salta no calcula campeonatos, premios ni castigos; queda tratada como reparación de partida.
- Se limpian bloqueos habituales: avance bloqueado, revisión obligatoria de táctica, estado sin club y transición de temporada incompleta.
- En las vistas de scouting se reemplazan etiquetas compuestas por etiquetas específicas según posición.
- Los jugadores de campo ya no muestran `Cabezazo/Mando`; muestran `Cabezazo`. Los porteros muestran `Mando`.
- Se agregaron estilos para el botón de recuperación y para el modal de confirmación con progreso protegido.

## Motivo

V5.02 agrega una salida segura para partidas trabadas sin obligar a reiniciar desde cero. También pule la lectura del ojeo, reduciendo texto innecesario y evitando habilidades mezcladas entre porteros y jugadores de campo.
