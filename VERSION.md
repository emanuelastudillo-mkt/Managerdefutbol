# Versión V3.28

## Nombre
Menú ESPECIAL: cartas, sobres y bonos

## Base
V3.27 · Doble avance: día y próximo partido

## Cambios principales V3.28

- Se agrega el menú lateral **ESPECIAL**.
- Se integra la planilla `data/habilidades_especiales.json` basada en `habilidades_especiales_V1.02.json`.
- Se agrega estado persistente del manager para:
  - puntos de habilidad;
  - cartas activas;
  - cartas en reserva;
  - historial de últimas cartas;
  - bloqueo de cambio de cartas activas.
- Se agregan sobres común, raro y épico.
- Se agregan cartas inútiles, comunes, raras, épicas y legendarias.
- Se permite destruir cartas en reserva para recuperar pocos puntos.
- Se implementa máximo de 5 cartas activas.
- Se implementa máximo de 50 cartas en reserva.
- Se implementa bloqueo de 100 días tras activar o desactivar cartas.
- Se implementan bonus apilables de:
  - sponsors extra;
  - reducción del deterioro del campo;
  - aumento relativo de probabilidad legendaria.

## Puntos ocultos integrados

El manager suma puntos de habilidad por:

- ganar partido;
- empatar partido;
- salir campeón según división;
- tratar jugador lesionado;
- meter más de 5 goles en un partido;
- regar o parchar el campo de juego;
- consultar juveniles.

## Archivos modificados

- `index.html`
- `config.js`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/10-academy-employees.js`
- `js/ui/06-render-home-messages.js`
- `style.css`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

## Archivos agregados

- `data/habilidades_especiales.json`
- `js/game/15-especial.js`

## Versión anterior

V3.27 · Doble avance: día y próximo partido
