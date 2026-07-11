# Características de la versión V6.03

## V6.03 - Dificultad competitiva

Esta versión toma V6.02 como base y agrega tres capas de dificultad para evitar que la partida entre rápido en piloto automático.

### Cambios aplicados

- Adaptación rival por repetición táctica:
  - se calcula una firma de juego con formación, mentalidades por puesto, instrucciones y estilos sectoriales;
  - si el usuario repite esa firma más de 3 partidos, el rival recibe un bonus progresivo;
  - el bonus máximo queda limitado para no volver injusto el sistema.
- Lesiones por carga extrema de partidos:
  - se toma una temporada de 34 partidos como referencia;
  - desde el 80% de participación se activa riesgo alto;
  - la probabilidad escala entre 35% y 65%;
  - cuando se activa, el 90% de esas lesiones prioriza lesiones largas.
- Moral progresiva para jugadores sin minutos:
  - cada jugador disponible que no participa acumula partidos sin jugar;
  - la pérdida de moral aumenta según el contador acumulado;
  - el contador se reinicia cuando el jugador participa;
  - lesionados y suspendidos no acumulan castigo por ausencia.
- Se agregan estados guardables:
  - `managerTacticalAdaptation`;
  - `playerBenchedStreak`.
- Se actualiza versión visible/cache a V6.03.
- Se actualiza README y VERSION.
- Se crea `REVISION_CODIGO_V6.03.md`.

### Archivos modificados

- `index.html`
- `app.js`
- `config.js`
- `balance-modificadores.js`
- `simulador-2.0.js`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/11-match-engine.js`
- `js/ui/12-modals.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

### Archivos agregados

- `REVISION_CODIGO_V6.03.md`

### Resultado técnico

- El equipo ordenado sigue teniendo ventaja, pero ya no queda protegido de la adaptación rival ni de la sobreutilización de titulares.
- La rotación pasa a tener valor real porque reduce riesgo físico y evita descontento profundo de suplentes.
- La dificultad se puede rebalancear sin tocar el motor, editando el bloque `dificultad`.
