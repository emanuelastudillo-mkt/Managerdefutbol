# Características de la versión V6.04

## V6.04 - Ojeo, avance automático y ranking de carrera

Esta versión toma V6.03 como base y agrega tres mejoras de lectura y competencia online.

### Cambios aplicados

- Centro de Ojeo:
  - cada jugador externo muestra `Prob. fichaje`;
  - el cálculo usa `marketPlayerAcceptanceChance`, por lo tanto respeta la relación entre media del jugador y prestigio del club ofertante;
  - la probabilidad se muestra con tono visual alto/medio/bajo;
  - los informes guardados también incorporan columna de probabilidad de fichaje.

- Avance automático:
  - se reemplaza el botón textual por un bloque más claro;
  - arriba dice `Avance automático`;
  - abajo se muestra un switch `ON/OFF`;
  - el switch queda verde cuando está activo y rojo cuando está apagado;
  - conserva la lógica anterior de bloqueo por temporada finalizada, manager sin club, táctica inválida o ventana modal abierta.

- Ranking online:
  - la carga principal pasa de temporada a carrera completa;
  - el payload incluye partidos totales, puntos de carrera, récord G-E-P, goles, títulos, temporadas jugadas, club actual, clubes dirigidos, prestigio, experiencia, presupuesto y puntaje de carrera;
  - la clave `submissionKey` queda estable como `SAVE-CODE-CAREER`;
  - la tabla deduplica por código de partida antes de ordenar;
  - el ranking muestra una fila por carrera;
  - se priorizan rutas `/ranking/career` y se mantienen rutas anteriores como respaldo;
  - `apps-script-ranking.gs` se actualiza para guardar o reemplazar una sola fila por carrera.

### Archivos modificados

- `index.html`
- `app.js`
- `config.js`
- `apps-script-ranking.gs`
- `style.css`
- `js/game/09-simulation-economy-training.js`
- `js/game/13-ranking-online.js`
- `js/game/16-scouting-center.js`
- `js/ui/06-render-home-messages.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

### Archivos agregados

- `REVISION_CODIGO_V6.04.md`

### Resultado técnico

- El ojeo ahora informa no solo cuánto se conoce del jugador, sino qué tan viable es ficharlo.
- El avance automático es más legible y menos ambiguo.
- El ranking deja de competir por registros aislados de temporada y pasa a comparar carreras completas, evitando duplicados visibles por partida.
