# V4.06 - Optimización de simulación y calendario por días

## Cambios principales

- Se agrega simulación rápida para partidos bot vs bot.
- Los partidos del manager siguen usando el simulador completo.
- Se distribuyen las ligas por día dentro de cada jornada:
  - Viernes: España, Italia, Inglaterra y Rumania.
  - Sábado: segunda y tercera argentina.
  - Domingo: Chile, Brasil y primera argentina.
- El avance diario puede simular partidos de otras ligas sin ejecutar el partido propio.
- Si el partido propio está en cooldown, el juego permite avanzar días que no tengan partido propio pendiente.
- El calendario ahora muestra la fecha específica de cada partido.
- Se regenera el calendario de partidas existentes manteniendo resultados ya jugados.

## Archivos modificados

- `index.html`
- `config.js`
- `VERSION.md`
- `README.md`
- `CARACTERISTICAS_VERSION.md`
- `style.css`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/data/04-data-storage.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `js/ui/06-render-home-messages.js`

## Validaciones

- Sintaxis validada en `config.js`.
- Sintaxis validada en todos los archivos `.js`.

## Nota

- Los partidos bot vs bot pasan a ser menos detallados internamente para priorizar rendimiento.
- El partido del manager conserva el detalle completo.
