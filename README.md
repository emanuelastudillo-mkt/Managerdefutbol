# V9.70 · Fixtures con 20 semillas anuales

Construida sobre V9.69 “ranking online de carreras ordenable”.

## Cambio principal

Cada temporada nueva utiliza una semilla de fixture diferente. El juego dispone de 20 semillas fijas y determinísticas que rotan por temporada; después de la semilla 20 el ciclo vuelve a comenzar.

- Temporadas consecutivas no repiten el mismo orden de partidos.
- Los ascensos y descensos se aplican antes de generar el nuevo fixture.
- La semilla queda guardada en la partida para que una reparación reproduzca exactamente el calendario original de esa temporada.
- Una temporada ya iniciada en V9.69 conserva su fixture actual. La rotación comienza en el siguiente cambio de temporada.
- No se modifica el Worker.

Ver `AJUSTES-V9.70.md`.
