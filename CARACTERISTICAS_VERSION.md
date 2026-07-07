# Características de la versión V3.23

## Resumen

La V3.23 agrega visibilidad del estado del campo en el próximo compromiso y prepara una lógica más estable para equipos bots: sus campos ya no se degradan partido a partido durante la temporada, sino que quedan fijos y se recalculan al inicio de la temporada siguiente según rendimiento.

## Cambios funcionales

### Próximo compromiso

- El bloque de próximo partido ahora incluye el estado del campo de juego.
- El estado se calcula desde el equipo local del partido.
- Se muestra:
  - etiqueta del estado del campo;
  - puntaje sobre 100;
  - club local dueño del estadio;
  - indicador de si el campo es dinámico propio o fijo de bot.

### Campos de equipos bots

- Los equipos bots reciben un estado de campo al inicio de la temporada.
- Ese estado no se degrada durante los partidos de liga.
- El campo de bots se mantiene estable durante toda la temporada.
- Al cierre anual, el nuevo estado de campo de cada bot se calcula usando su posición final:
  - mejores posiciones tienden a recibir mejores campos;
  - peores posiciones tienden a recibir campos peores;
  - se aplica una pequeña variación determinística para evitar que todos los clubes de una misma zona queden iguales.

### Campo del club manejado

- El club manejado conserva la lógica previa.
- Si juega de local, el campo puede deteriorarse.
- El usuario puede seguir usando replante o riego/parcheo desde el módulo Estadio.
- Si el usuario continúa con el mismo club, su campo no se reinicia automáticamente por posición.
- Si el usuario cambia de club al iniciar temporada, el nuevo club toma el estado calculado por su rendimiento anterior.

## Archivos modificados

- `config.js`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `js/ui/06-render-home-messages.js`
- `style.css`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

## Validaciones realizadas

- Validación de sintaxis JavaScript con `node --check`.
- Validación de estructura de archivos.
- Validación de empaquetado ZIP.
