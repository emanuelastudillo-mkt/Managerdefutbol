# Una Vida de Mánager · V8.78 incremental

Aplicar sobre **V8.77** conservando la estructura de carpetas.

## Tandas de penales

- Se agregó una definición por penales para partidos cuya competición exige un ganador.
- Se aplica inicialmente a las fases de eliminación directa del Mundial de Clubes:
  - octavos;
  - cuartos;
  - semifinales;
  - partido por el tercer puesto;
  - final.
- La fase de grupos y las ligas continúan permitiendo empates.
- Se eliminó el antiguo desempate del Mundial de Clubes por faltas y tarjetas.

## Funcionamiento

- Los equipos patean de forma alternada.
- Se disputan hasta cinco rondas iniciales.
- La tanda sólo puede finalizar después de que ambos equipos hayan ejecutado la misma cantidad de penales.
- Se permite finalización anticipada cuando un equipo ya no puede alcanzar al otro.
- Si continúan empatados después de cinco remates por equipo, comienza la muerte súbita.
- En muerte súbita siempre patean ambos equipos antes de declarar al ganador.
- Los jugadores sustituidos, expulsados o lesionados no integran la lista final de ejecutantes cuando puede reconstruirse quién terminó el partido.

## Probabilidad de conversión

La primera versión utiliza:

- habilidad específica de penales, cuando existe;
- remate;
- serenidad;
- técnica;
- media general;
- posición;
- estado físico;
- moral;
- calidad del portero;
- una influencia local mínima en sedes no neutrales.

## Estadísticas

Los goles de la tanda se guardan de forma separada y no se suman a:

- marcador reglamentario;
- goles de jugadores;
- tabla de goleadores;
- goles a favor o en contra;
- estadísticas oficiales del partido.

## Preparación para futuras copas

Una competición futura puede exigir ganador usando:

- `requiresWinner: true`;
- `tieBreakMode: 'penalties'`;
- `neutralVenue: true` cuando corresponda.

También se admite un empate global en una vuelta mediante `aggregateHomeGoals` y `aggregateAwayGoals`, o mediante una estructura `aggregateScore`.

## Interfaz

- El resultado mantiene el marcador reglamentario.
- Debajo se muestra el ganador y el resultado de la tanda.
- El detalle del partido incluye cada ejecución, el jugador y si convirtió o falló.
- La simulación viva muestra la definición al finalizar.

## Compatibilidad

- Compatible con partidas de V8.77.
- Los partidos antiguos ya resueltos por el criterio anterior conservan su ganador.
- No requiere cambios de Worker, SQL ni recursos gráficos.

## Archivos modificados

- `config.js`
- `index.html`
- `simulador-2.0.js`
- `js/game/05d-founder-career.js`
- `js/game/05f-club-world-cup.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09b-calendar-quick-simulation.js`
- `js/game/11-match-engine.js`
- `js/game/17-live-match.js`
- `js/ui/12-modals.js`
- `styles/40-match-simulation.css`
