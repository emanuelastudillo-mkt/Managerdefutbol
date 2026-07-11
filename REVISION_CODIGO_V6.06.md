# Revisión de código V6.06

## Alcance

Implementación de ayuda superior e integrada para mejorar la orientación del usuario dentro del Manager V6.

## Archivos modificados

- `index.html`
- `style.css`
- `config.js`
- `js/game/05-state-season.js`
- `js/ui/12-modals.js`
- `README.md`
- `CARACTERISTICAS_VERSION.md`
- `VERSION.md`

## Cambios técnicos

- Se agregó `btnHelp` en la barra superior.
- Se vinculó el evento del botón en `bindEvents()`.
- Se agregó `openGameHelpModal()` para construir la ventana de ayuda.
- Se agregaron accesos internos con `data-help-tab` y `data-help-subtab`.
- Se agregaron estilos `.help-*` para ordenar el contenido del modal.
- Se actualizó la versión visible y el cache busting de recursos a V6.06.

## Observaciones

- La ayuda funciona sin partida activa, pero los saltos a secciones de juego requieren una partida cargada.
- Ranking Online puede abrirse incluso sin partida activa, igual que en el comportamiento heredado.
- No se agregaron imágenes nuevas ni dependencias externas.

## Validaciones

- `node --check` ejecutado sobre scripts JS.
- JSON de `data/` parseados correctamente.
- ZIP completo verificado sin `apps-script-ranking.gs`.
