# Características de la versión V6.01

## V6.01 - Revisión y limpieza inicial de Manager V6

Esta versión toma `futbol-manager-mvp-V5.80-completa-correccion-slots-vacios(1).zip` como base y abre la nueva línea V6.01.

### Cambios aplicados

- Actualización visible de versión a V6.01 en `index.html`, `config.js`, `app.js`, `VERSION.md`, `README.md` y caché de scripts/estilos.
- Limpieza de funciones declaradas que no tenían referencias internas en el proyecto.
- Eliminación del archivo vacío `err`, que no cumplía ninguna función de juego ni documentación.
- Ajuste de contradicción de balance: `config.js` mantenía tarjetas al 50%, pero `balance-modificadores.js` lo pisaba con `1.50`. En V6.01 queda centralizado en `1.10` dentro de `balance-modificadores.js`.
- Actualización de metadata de balance a V6.01.
- Agregado de reporte técnico `REVISION_CODIGO_V6.01.md`.

### Archivos modificados

- `index.html`
- `app.js`
- `config.js`
- `balance-modificadores.js`
- `simulador-2.0.js`
- `js/core/02-ui-utils.js`
- `js/core/03-player-tactics-utils.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/10-academy-employees.js`
- `js/game/13-ranking-online.js`
- `js/game/15-especial.js`
- `js/ui/06-render-home-messages.js`
- `js/ui/07-render-team-market.js`
- `js/ui/12-modals.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`
- `REVISION_CODIGO_V6.01.md`

### Archivo eliminado en versión completa

- `err`
