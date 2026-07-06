# Fútbol Manager MVP V3.02

Versión 3.02 del manager de fútbol local. Esta versión mantiene la separación de archivos de V3.01 y suma una capa visual orientada a experiencia de juego.

## Cambios V3.02
- Se actualizó la versión interna y visible a `V3.02`.
- Se agregó soporte en `index.html` para `favico.png` como favicon.
- Se reemplazó la entrada del Inicio por una vista tipo **oficina del manager**.
- Se agregaron alertas visuales accionables para problemas o tareas pendientes.
- Se agregó un resumen visual del último turno avanzado.
- Se añadieron barras compactas para media, físico, moral y cohesión dentro del panel principal.
- Se mantuvo la lógica de juego sin cambios intencionales de balance.
- Se corrigió una referencia interna de sponsors que apuntaba a un helper inexistente (`currentClubDivision`).

## Cambios conservados de V3.01
- `app.js` funciona como punto de entrada mínimo.
- La lógica principal está separada dentro de la carpeta `js/`.
- La carga se mantiene con scripts clásicos desde `index.html`, compatible con GitHub Pages.
- Se mantiene compatibilidad con partidas guardadas en IndexedDB.

## Estructura principal
```txt
index.html
config.js
app.js
style.css
simulador-2.0.js
CARACTERISTICAS_VERSION.md
VERSION.md
data/
  Liga Argentina.json
  jugadores.json
  sponsors.json
js/
  core/
    01-config-constants.js
    02-ui-utils.js
    03-player-tactics-utils.js
  data/
    04-data-storage.js
  game/
    05-state-season.js
    08-sponsors-stadium-stats.js
    09-simulation-economy-training.js
    10-academy-employees.js
    11-match-engine.js
  ui/
    06-render-home-messages.js
    07-render-team-market.js
    12-modals.js
```

## Archivo de configuración
Editar:

```txt
config.js
```

Ejemplos útiles:

```js
turnos: {
  bloqueoEntreTurnosMs: 120000,
  transicionAvanceMs: 3400
},
plantel: {
  jugadoresMaximosPorClub: 25
},
sponsors: {
  factorValorBase: 1,
  partidosMinimosEntreTandas: 4,
  partidosMaximosEntreTandas: 7
}
```

## Validación realizada
- Sintaxis JS validada con `node --check` en todos los archivos principales y módulos de `js/`.
- JSON principales validados: `jugadores.json`, `sponsors.json` y `Liga Argentina.json`.
- Verificación de archivos referenciados en `index.html`.

## Compatibilidad
- Mantiene guardado local por navegador con IndexedDB.
- Mantiene `data/jugadores.json`.
- Mantiene `data/sponsors.json`.
- Mantiene `data/Liga Argentina.json`.
- Las partidas guardadas de V3.01 se normalizan y reciben el nuevo campo `lastTurnSummary` sin requerir reiniciar partida.
