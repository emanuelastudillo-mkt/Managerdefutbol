# Características internas de versión · V3.01

## Tipo de versión
Versión mayor inicial: V3.01.

## Cambio principal
Separación de `app.js` en módulos funcionales dentro de la carpeta `js/`.

## Último agregado o modificado
- Se reemplazó el `app.js` monolítico por un punto de entrada mínimo.
- Se agregaron 12 archivos JavaScript organizados por responsabilidad.
- Se actualizó `index.html` para cargar cada archivo en un orden estable.
- Se actualizó la versión visible e interna a `V3.01`.

## Módulos creados
| Archivo | Responsabilidad |
|---|---|
| `js/core/01-config-constants.js` | Configuración, constantes y estado global. |
| `js/core/02-ui-utils.js` | Utilidades visuales y helpers generales. |
| `js/core/03-player-tactics-utils.js` | Jugadores, habilidades, roles, generación y táctica. |
| `js/data/04-data-storage.js` | Carga de datos, normalización e IndexedDB. |
| `js/game/05-state-season.js` | Partida, temporada, ascensos y descensos. |
| `js/ui/06-render-home-messages.js` | Render general, inicio, mensajes y ofertas de venta. |
| `js/ui/07-render-team-market.js` | Primer equipo, mercado, plantel y táctica. |
| `js/game/08-sponsors-stadium-stats.js` | Sponsors, estadio, fixture, tabla y estadísticas. |
| `js/game/09-simulation-economy-training.js` | Simulación, economía, moral, cohesión y entrenamiento. |
| `js/game/10-academy-employees.js` | Academia, captación, juveniles y empleados. |
| `js/game/11-match-engine.js` | Motor de partido alternativo y eventos de partido. |
| `js/ui/12-modals.js` | Modales y ventanas de detalle. |

## Decisión técnica
Se usaron scripts clásicos cargados desde `index.html` en lugar de `type="module"`. Esto reduce riesgo de problemas con variables globales existentes y mantiene la compatibilidad del MVP actual.

## Impacto esperado
- Código más fácil de revisar.
- Menor riesgo al tocar una sección específica.
- Base más ordenada para futuras mejoras.
- Sin cambio intencional de balance o reglas de juego.

## Riesgos pendientes
- Sigue existiendo acoplamiento global entre módulos.
- No hay pruebas automáticas funcionales completas en navegador.
- Algunas funciones largas siguen mezclando lógica y HTML.

## Siguiente mejora sugerida
Separar por segunda capa los módulos más grandes:
- `market`: reglas de compra/venta y render de mercado.
- `academy`: reglas de captación, entrenamiento y render.
- `sponsors`: generación, aceptación, contratos y render.
- `tactics`: validación, guardado y render de formación.
- `match`: simulación pura y presentación del resultado.
