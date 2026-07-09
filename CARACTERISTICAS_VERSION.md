# V4.19 - Tácticas guardadas y objetivo dinámico

## Cambios

- Se agregan 3 espacios para guardar tácticas personalizadas.
- Cada táctica guardada conserva formación, titulares, suplentes, cambios automáticos, instrucciones de partido y mentalidades.
- Se agregan botones de carga rápida para tácticas 1, 2 y 3.
- Al cargar una táctica, los jugadores lesionados o que ya no pertenecen al club dejan hueco en el once.
- Se corrige el cálculo del objetivo de directiva con cartas de `Objetivo más bajo`.
- El objetivo ya no queda fijo en el valor anterior si se activa una carta durante la temporada.
- La Oficina muestra el objetivo efectivo y el porcentaje de reducción activo.

## Seguridad

- No se modifica el motor de partidos.
- No se modifican calendarios, economía ni jugadores.
- Las tácticas guardadas se agregan como estado nuevo compatible con partidas existentes.

## Compatibilidad

- Se implementa solo.
- No requiere reinicio.
- Las partidas existentes empiezan con los 3 espacios de táctica vacíos.
- Las cartas de objetivo ya activas empiezan a afectar el objetivo al cargar o refrescar la partida.
