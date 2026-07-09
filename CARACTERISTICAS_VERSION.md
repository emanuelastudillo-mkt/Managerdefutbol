# V4.04 - Ajustes varios de finanzas, jugadores libres, juveniles y calendario

## Cambios principales

- Se agrega en Finanzas un bloque de Banco con préstamos por temporada.
- El sistema configura 10 bancos reales y muestra 3 ofertas al azar por temporada.
- Cada oferta tiene monto, plazo, interés, cuota semanal, total a devolver y costo de prestigio.
- Al pedir un préstamo, el dinero entra al club, se descuenta prestigio al manager y se bloquean nuevos préstamos hasta cancelar la deuda.
- El préstamo activo muestra barra de progreso, semanas restantes, deuda pendiente y cuota semanal.
- Cada avance semanal descuenta automáticamente una cuota del presupuesto del club.
- Se agrega una tarjeta de Calificación económica con mensaje de la directiva.
- La calificación compara presupuesto disponible contra sueldos anuales del plantel.
- Se ajustan los jugadores libres para usar nacionalidades variadas de todos los países configurados.
- Los jugadores libres quedan con físico 5 y moral 5.
- Los juveniles excepcionales ahora toman nombre y nacionalidad del país del club.
- Los juveniles normales conservan variedad de nacionalidades con predominio de la liga del club.
- El menú Calendario abre por defecto en `Mi calendario`, mostrando los partidos del club del manager.
- El calendario general por liga sigue disponible desde el desplegable de divisiones.

## Archivos modificados

- `index.html`
- `config.js`
- `VERSION.md`
- `README.md`
- `CARACTERISTICAS_VERSION.md`
- `js/core/01-config-constants.js`
- `js/core/02-ui-utils.js`
- `js/core/03-player-tactics-utils.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/10-academy-employees.js`
- `js/ui/06-render-home-messages.js`

## Validaciones

- Sintaxis validada en `config.js`.
- Sintaxis validada en todos los archivos `.js` del proyecto.
- La deuda bancaria queda persistida dentro de la partida como `bankLoan`.
- Las partidas anteriores sin `bankLoan` se normalizan automáticamente al cargar.

## Nota de interpretación

- El monto escrito como `50.000.0000` se tomó como $50.000.000 para mantener coherencia con los otros dos escalones: $500.000.000 y $1.500.000.000.
- Los pagos se procesan semanalmente porque el avance principal del juego equivale a una semana.
