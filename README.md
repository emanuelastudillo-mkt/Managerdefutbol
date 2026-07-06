# Fútbol Manager MVP V3.01

Versión 3 inicial del manager de fútbol local. El cambio principal es la separación del antiguo `app.js` monolítico en archivos organizados por responsabilidad.

## Cambios V3.01
- `app.js` dejó de contener toda la lógica del juego y ahora funciona como punto de entrada mínimo.
- Se creó la carpeta `js/` con separación por áreas:
  - `js/core/`: configuración, constantes, utilidades, jugadores y táctica.
  - `js/data/`: carga de JSON, normalización y guardado local.
  - `js/game/`: reglas de temporada, sponsors, estadio, economía, entrenamiento, academia, empleados y simulación.
  - `js/ui/`: renderizado de pantallas, mercado, plantel, táctica y modales.
- Se actualizó `index.html` para cargar los nuevos archivos en orden compatible con navegador y GitHub Pages.
- Se actualizó `config.js` a `V3.01`.
- Se agregó `CARACTERISTICAS_VERSION.md` como documento interno de características de versión.
- Se mantuvo la compatibilidad con IndexedDB y con los JSON actuales.

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

## Base inicial vigente
- Total jugadores: 1500.
- 92-99: 7 jugadores.
- 80-91: 105 jugadores.
- 68-79: 368 jugadores.
- 43-67: 750 jugadores.
- 19-42: 270 jugadores.

## Validación realizada
- Sintaxis JS validada con `node --check` en todos los archivos principales y módulos de `js/`.
- JSON principales validados: `jugadores.json`, `sponsors.json` y `Liga Argentina.json`.
- Prueba de carga de scripts sin inicializar partida: correcta.

## Compatibilidad
- Mantiene guardado local por navegador con IndexedDB.
- Mantiene `data/jugadores.json`.
- Mantiene `data/sponsors.json`.
- Mantiene `data/Liga Argentina.json`.
- No cambia reglas de juego intencionalmente; esta versión prioriza estructura y mantenimiento.
