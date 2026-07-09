# V4.09 - Playoffs de promoción Argentina

## Cambios principales

- Se agregan playoffs de promoción para Argentina al terminar la liga regular.
- Los cruces son ida y vuelta.
- Primera División Argentina:
  - 1° campeón.
  - 1° a 4° clasificados a copas futuras.
  - 15° y 16° juegan promoción contra Segunda.
  - 17° y 18° descienden directo.
- Segunda División Argentina:
  - 1° campeón y ascenso directo.
  - 2° ascenso directo.
  - 3° y 4° juegan promoción contra Primera.
  - 15° y 16° juegan promoción contra Tercera.
  - 17° y 18° descienden directo.
- Tercera División Argentina:
  - 1° campeón y ascenso directo.
  - 2° ascenso directo.
  - 3° y 4° juegan promoción contra Segunda.
  - No hay descensos.
- Los partidos de promoción no modifican las tablas regulares.
- Los ascensos y descensos definitivos se calculan al cerrar la temporada.
- En empate global conserva la categoría el club de la división superior.

## Archivos modificados

- `index.html`
- `config.js`
- `VERSION.md`
- `README.md`
- `CARACTERISTICAS_VERSION.md`
- `style.css`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/11-match-engine.js`

## Validaciones

- Sintaxis validada en `config.js`.
- Sintaxis validada en todos los archivos `.js`.
- Prueba lógica aislada de creación de cruces y cálculo de movimientos de ascenso/descenso.
