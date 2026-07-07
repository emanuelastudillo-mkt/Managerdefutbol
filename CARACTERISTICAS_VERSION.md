# Características internas de versión · V3.21

## Enfoque V3.21

Ajustar la curva de cohesión para que el crecimiento del equipo sea más visible y menos castigado por el uso normal de cambios durante los partidos.

## Cambios de balance

- `TEAM_COHESION_MATCH_GAIN` ahora se lee desde `config.js` y queda por defecto en **14**.
- `TEAM_COHESION_PLAYER_CHANGE_LOSS` ahora se lee desde `config.js` y queda por defecto en **1**.
- `TEAM_COHESION_TACTIC_CHANGE_LOSS` ahora se lee desde `config.js` y queda por defecto en **8**.
- Se agregan constantes configurables para la cohesión ganada por entrenamiento táctico.

## Motivo del ajuste

Con el valor anterior, una victoria o partido normal podía quedar neutralizado por los cambios realizados durante el encuentro. Con cinco sustituciones, el partido podía dar muy poca cohesión o incluso una pérdida neta. El nuevo balance permite que el equipo suba cohesión aunque use cambios normales.

## Configuración agregada

En `config.js`:

```js
cohesion: {
  valorInicial: 50,
  gananciaPorPartido: 14,
  perdidaPorCambioTactico: 8,
  perdidaPorCambioJugador: 1,
  probabilidadEntrenamientoTacticoPorCasilla: 0.35,
  gananciaEntrenamientoTacticoPorCasilla: 1
}
```

## Efecto esperado

- Partido con 5 cambios: antes podía quedar en **-2** de cohesión neta; ahora queda aproximadamente en **+9**.
- Semana con entrenamiento táctico: puede sumar puntos extra de cohesión según la cantidad de casillas tácticas programadas.
- Cambiar completamente la táctica todavía penaliza, pero menos que antes.

## Archivos modificados en V3.21

- `config.js`
- `js/core/01-config-constants.js`
- `js/game/09-simulation-economy-training.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

## Validación esperada

- Validación sintáctica de JavaScript.
- Validación de JSON.
- Verificación de ZIP.
