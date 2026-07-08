# V3.71 - Oferta especial de cláusula

## Cambios
- Eliminado el mensaje visible de equilibrio bot: "La liga ajustó la preparación...".
- Agregada oferta especial de cláusula en las últimas 10 fechas.
- La oferta especial ocurre entre 1 y 2 veces por temporada si hay candidatos válidos.
- El club ofertante pertenece a la misma liga del manager.
- El jugador objetivo sale de los 3 futbolistas con mayor media del plantel.
- La oferta paga el 100% de la cláusula.
- El manager puede aceptar la venta, rechazarla o intentar convencer al jugador de quedarse.
- Convencer falla con probabilidad igual a la posición actual en liga x2.
- Se agregaron 5 variantes de mensaje para jugador convencido y 5 para jugador que decide irse.

## Archivos modificados
- config.js
- js/core/01-config-constants.js
- js/game/05-state-season.js
- js/ui/06-render-home-messages.js
- README.md
- VERSION.md
- CARACTERISTICAS_VERSION.md
