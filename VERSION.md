# Versión V3.26

## Nombre
Reparación automática de campos bots injugables

## Base
V3.25 · Corrección de arrastre de lesiones entre temporadas

## Cambios principales V3.26

- Se agregó una auditoría automática de campos de juego de equipos bots.
- Si un campo bot queda por debajo del mínimo configurado, se considera dato corrupto y se regenera.
- Si se detecta una situación masiva de campos injugables, el sistema repara todos los campos bots de la temporada.
- La reparación se ejecuta al cargar partida, al normalizar estado, al consultar estado de estadio y al pasar de temporada.
- Se agregó un bloque visible en la pantalla Estadio: “Auditoría de campos bots”.
- Se agregó un botón manual: “Reparar campos bots injugables”.
- Los campos bots reparados quedan entre el mínimo y máximo configurado para temporada.
- La partida se autosavea cuando se detecta y corrige el problema al cargar.

## Configuración agregada

```js
estadio: {
  botsCampoAutoRepararEstadosInvalidos: true,
  botsCampoUmbralInvalido: 29,
  botsCampoPorcentajeMasivoInjugable: 0.60
}
```

## Criterio aplicado

Los bots tienen campos fijos por temporada y su mínimo configurado es 30/100. Por lo tanto, un campo bot en 1/100 no se interpreta como desgaste legítimo, sino como estado inválido. La V3.26 lo detecta y lo corrige.

## Archivos modificados

- `config.js`
- `index.html`
- `app.js`
- `data/eventos.json`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

## Versión anterior

V3.25 · Corrección de arrastre de lesiones entre temporadas
