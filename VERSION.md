# Versión V2.27

## Ajustes principales

### Base inicial de jugadores
- `data/jugadores.json` fue regenerado con la nueva regla de medias:
  - Elite mundial: 0,5% teórico, aplicado como máximo seguro.
  - Estrella: 7%.
  - Titular competitivo: 24,5%.
  - Profesional promedio/bajo: 50%.
  - Bajo nivel: 18%.

### Validación aplicada
- Total: 1500 jugadores.
- Jugadores 92-99: 7, equivalente a 0,47%.
- Jugadores 80-91: 105, equivalente a 7%.
- Jugadores 68-79: 368, equivalente a 24,53%.
- Jugadores 43-67: 750, equivalente a 50%.
- Jugadores 19-42: 270, equivalente a 18%.

### Restricciones mantenidas
- Los jugadores 92-99 sólo aparecen en Primera División.
- Ningún club arranca con más de 1 jugador 92-99 en la base inicial.
- Segunda División no inicia con jugadores 92-99.
- Tercera División no inicia con jugadores 80+.
- Sueldos y cláusulas siguen al 10% de la escala previa.

## Compatibilidad
- Mantiene guardado local por navegador.
- Si ya existe una partida guardada, seguirá usando su snapshot local hasta iniciar una nueva partida.
- No incluye `assets/pitch-board.png`.
