# Fútbol Manager MVP V3.05

Versión 3.05 del manager de fútbol local. Mantiene la arquitectura modular de V3.01, las mejoras visuales de V3.02, los ajustes de V3.04 y actualiza la pantalla de táctica para reemplazar el arrastre por selección mediante clic.

## Cambios V3.05
- La pantalla de táctica ya no usa arrastre de jugadores.
- Se selecciona un jugador con click y luego se hace click en otro jugador para intercambiar lugares.
- El intercambio funciona entre pizarra, lista de titulares, suplentes y reservas.
- Se puede seleccionar un jugador y hacer click en un puesto vacío de la pizarra para ubicarlo ahí.
- La selección activa queda resaltada en verde.
- Se actualizaron los textos de ayuda de la pantalla táctica.

## Cambios conservados de V3.04
- Plantel mínimo configurable: 18 jugadores.
- Plantel máximo configurable: 42 jugadores.
- Tamaño inicial de plantel separado del máximo: 25 jugadores.
- Bloqueo de fichajes y promociones de juveniles al llegar a 42 jugadores.
- Bloqueo de ventas/despidos si el club queda por debajo de 18 jugadores.
- Corrección del favicon: ahora se referencia `favicon.png` desde la raíz.
- Simulador V2.0 con 30 bloques internos de 3 minutos y visualización con 30 fases configurables.
- Refuerzo del peso de delanteros como goleadores.
- Reducción fuerte de expulsiones del portero.
- Ajuste de cláusulas: se reducen a una décima parte del valor calculado anterior sin modificar sueldos.

## Cambios conservados de V3.03
- El aviso de lesionados o expulsados aparece después del final de la visualización del partido.

## Cambios conservados de V3.02
- Pantalla de Inicio tipo oficina del manager.
- Alertas visuales accionables.
- Resumen visual del último turno avanzado.
- Barras compactas de media, físico, moral y cohesión.

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
  jugadoresMinimosPorClub: 18,
  jugadoresInicialesPorClub: 25,
  jugadoresMaximosPorClub: 42
},
economia: {
  escalaSueldosYClausulas: 0.10,
  escalaClausulas: 0.10
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
- Compatible con partidas V3.01, V3.02 y V3.03 guardadas en IndexedDB.
- No requiere cambios en los JSON de datos.
- Mantiene `data/jugadores.json`.
- Mantiene `data/sponsors.json`.
- Mantiene `data/Liga Argentina.json`.


## Ajuste conservado V3.04 · Feedback visual de acciones

Las acciones de empleados con resultado incierto ahora muestran una carga breve y luego un color de resultado:

- Verde: acción realizada.
- Rojo: acción fallida.

Aplica a tratamientos de kinesiólogo y charla motivacional. Los tiempos pueden editarse en `config.js` dentro de `ui.accionesFeedbackCargaMs` y `ui.accionesFeedbackResultadoMs`.


## Ajuste conservado V3.04 · Cláusulas reducidas

Las cláusulas se recalculan a una décima parte del valor previo mediante `economia.escalaClausulas: 0.10`. El ajuste no toca sueldos: sólo afecta `clause` y `value` al normalizar jugadores, cargar partidas o generar nuevos jugadores.
