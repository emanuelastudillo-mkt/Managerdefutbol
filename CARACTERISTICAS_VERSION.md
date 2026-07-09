# Características de la versión V5.16

## Avance diario unificado

- Se reemplazan los dos botones de avance de la oficina por un único botón principal.
- En temporada regular, el botón avanza siempre al día siguiente cuando no hay partido propio pendiente.
- Si el partido propio ya corresponde al día actual, el mismo botón pasa a abrir el simulador vivo del partido.
- En pretemporada y postemporada, el mismo botón ejecuta el avance correspondiente de la fase.

## Cooldown único

- Después de cada avance se aplica un cooldown de 20 segundos.
- El mismo cooldown se usa para días normales, amistosos, partidos propios y postemporada.
- Se elimina el flujo visual de salto largo hasta el próximo partido para evitar contradicciones entre días, bloqueo y simulaciones pendientes.
- Si una partida traía un bloqueo viejo más largo, se normaliza al nuevo cooldown máximo.

## Procesos durante el avance

- Cada avance procesa verificaciones diarias y tareas de fondo: entrenamiento, academia, scouting, recuperaciones, sponsors, préstamos, obras y partidos bot pendientes.
- Si hay partidos bot programados para la fecha alcanzada, se simulan durante el avance y se informa en el resumen.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. Las partidas existentes conservan progreso, puntos, cartas, juveniles y calendario. El cambio afecta el flujo de avance desde la oficina y reduce problemas de bloqueo entre botones.
