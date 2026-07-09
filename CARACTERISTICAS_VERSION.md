# V4.14 - Corrección simulador visual

## Cambios principales

- Se corrige un error del visor de inclinación de cancha agregado en V4.12.
- El simulador volvía a quedar detenido después del bloque superior del partido por una variable interna mal nombrada.
- El modal ahora renderiza nuevamente fases, relato, eventos, estadísticas y resultado final.
- Se agregan defensas para que, si un partido viene con datos incompletos, el simulador visual no bloquee el cierre del partido.
- Si el visor falla por datos corruptos de una partida vieja, muestra resultado final de respaldo y permite continuar.

## Archivos modificados

- `index.html`
- `config.js`
- `VERSION.md`
- `README.md`
- `CARACTERISTICAS_VERSION.md`
- `js/ui/12-modals.js`

## Validaciones

- Sintaxis validada en `config.js`.
- Sintaxis validada en todos los archivos `.js`.
- Prueba aislada del render del simulador visual con eventos de gol, roja y lesión.
