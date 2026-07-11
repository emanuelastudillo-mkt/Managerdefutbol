# Revisión de código V6.07

## Objetivo

Ajustar la probabilidad de fichaje para que no sea un dato visible por defecto, sino una pieza de información que debe descubrirse mediante el Centro de Ojeo.

## Cambios técnicos

- Se agregó la clave interna `market.signingChance` como dato revelable del ojeo.
- `scoutingFullStatMap()` ahora incluye el dato de mercado para jugadores externos.
- El proceso diario de ojeo puede revelar ese dato como cualquier otra habilidad pendiente.
- El Centro de Ojeo muestra la probabilidad sólo cuando el dato fue revelado.
- Los informes guardados muestran `Oculto` hasta que la clave esté en `visibleSkills`.
- El Mercado reemplaza `Interés oculto` por `Prob. fichaje X%` únicamente cuando el jugador tiene ese dato descubierto.

## Archivos modificados

- `js/game/16-scouting-center.js`
- `js/ui/07-render-team-market.js`
- `js/ui/12-modals.js`
- `style.css`
- `index.html`
- `config.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

## Validación

- `node --check` ejecutado sobre archivos JS.
- JSON en `data/` parseados correctamente.
- ZIPs verificados.
