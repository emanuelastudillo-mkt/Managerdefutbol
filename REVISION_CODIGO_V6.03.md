# Revisión de código V6.03

## Objetivo

Aumentar la dificultad del modo Manager V6 sin recurrir a resultados arbitrarios. La lógica agregada busca castigar rutinas demasiado estables: repetir siempre la misma táctica, usar titulares en exceso y dejar suplentes sin minutos durante muchos partidos.

## Cambios realizados

### 1. Adaptación rival por repetición táctica

Se agregó una firma de repetición táctica basada en:

- formación;
- mentalidades por puesto;
- instrucciones según resultado;
- estilos sectoriales.

No se incluyen los IDs de jugadores como parte central de la firma. De esa manera, cambiar nombres pero mantener el mismo plan de juego no borra la adaptación rival.

Regla activa:

- 3 partidos sin penalización;
- desde el cuarto partido repetido, el rival recibe bonus;
- bonus por repetición: 3%;
- bonus máximo: 12%.

El bonus se aplica sobre el rival, de forma más fuerte en defensa y mediocampo, y más suave en ataque y arquero.

### 2. Lesiones largas por participación extrema

Se agregó una referencia de 34 partidos por temporada. Cuando un jugador supera el 80% de participación, entra en zona de riesgo alto.

Regla activa:

- referencia: 34 partidos;
- umbral: 80%;
- riesgo mínimo en zona alta: 35%;
- riesgo máximo: 65%;
- probabilidad de que la lesión sea larga cuando se activa el riesgo: 90%;
- duración mínima de lesión larga: 90 días configurados.

La lógica se integra con el cálculo existente de lesiones y conserva compatibilidad con el sistema anterior.

### 3. Moral progresiva de suplentes sin minutos

Se agregó un estado por temporada para contar partidos consecutivos sin jugar.

Regla activa:

- si el jugador participa, el contador se reinicia;
- si está disponible y no juega, el contador aumenta;
- la pérdida de moral equivale al contador acumulado;
- pérdida máxima por partido: 12;
- lesionados y suspendidos no acumulan castigo por no jugar.

## Estados nuevos de partida

- `managerTacticalAdaptation`: guarda firma táctica, racha y último bonus.
- `playerBenchedStreak`: guarda contador de partidos sin jugar por jugador.

Ambos estados se normalizan al cargar partidas antiguas y se reinician al comenzar una nueva temporada.

## Archivos tocados

- `config.js`
- `balance-modificadores.js`
- `simulador-2.0.js`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/11-match-engine.js`
- `js/ui/12-modals.js`
- `index.html`
- `app.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

## Validaciones

- `node --check` ejecutado sobre archivos JS modificados.
- Parseo JSON validado para todo `data/`.
- Revisión de carga de versión/cache en `index.html`.

## Observación de balance

Los valores elegidos son intencionalmente fuertes porque el objetivo declarado era aumentar dificultad. Si se vuelve demasiado agresivo, los primeros parámetros a bajar son:

- `probabilidadLesionLargaMin`;
- `probabilidadLesionLargaMax`;
- `adaptacionTactica.bonusRivalPorRepeticion`;
- `moralSuplentes.perdidaMaximaPorPartido`.
