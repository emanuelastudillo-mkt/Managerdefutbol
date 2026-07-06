# Fútbol Manager MVP V3.03

Versión 3.03 del manager de fútbol local. Mantiene la base visual de V3.02 y corrige el aviso superior que anticipaba lesiones o expulsiones durante la simulación visual del partido.

## Cambios V3.03
- Se actualizó la versión interna y visible a `V3.03`.
- El aviso superior de “hay lesionados o expulsados propios” ya no aparece apenas se abre la simulación del partido.
- El aviso se dispara recién al llegar a la etapa final de la visualización del partido, con una pequeña demora adicional.
- Si el usuario presiona “Finalizar partido”, el aviso aparece después de mostrar el resultado final, no antes.
- No se modificó el balance del motor de partido, lesiones, tarjetas, economía ni táctica.

## Cambios conservados de V3.02
- Pantalla de Inicio tipo oficina del manager.
- Alertas visuales accionables.
- Resumen visual del último turno avanzado.
- Barras compactas de media, físico, moral y cohesión.
- Soporte para `favico.png` en `index.html`.

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
- Compatible con partidas V3.01 y V3.02 guardadas en IndexedDB.
- No requiere cambios en los JSON de datos.
- Mantiene `data/jugadores.json`.
- Mantiene `data/sponsors.json`.
- Mantiene `data/Liga Argentina.json`.
