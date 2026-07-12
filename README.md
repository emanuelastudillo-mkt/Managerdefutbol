# Fútbol Manager MVP - V6.45

## V6.45 - Mundial de Clubes con llaves y estadísticas

Ajuste sobre V6.44 para ordenar definitivamente la Copa Mundial de Clubes de la FIFA: sorteo visible, grupos A-H, calendario escalonado, cruces fijos y estadísticas propias del torneo.

### Cambios principales

- El Mundial de Clubes se sortea y queda visible desde el día 295 si las ligas ya terminaron.
- Los grupos se nombran de la A a la H y mantienen 4 equipos cada uno.
- El sorteo intenta repartir clubes de distintos países en cada grupo cuando la cantidad de clasificados lo permite.
- La Fecha 1 de grupos se programa como mínimo 18 días después del sorteo del día 295 y también respeta el descanso mínimo desde la última fecha de liga.
- La Fecha 2 se juega 5 días después de la Fecha 1.
- La Fecha 3 se juega 5 días después de la Fecha 2.
- Las eliminatorias ya no se crean todas de golpe: se agregan fase por fase cuando termina la fase anterior.
- Octavos de final quedan con cruces fijos:
  - 1° Grupo A vs 2° Grupo B.
  - 2° Grupo A vs 1° Grupo B.
  - 1° Grupo C vs 2° Grupo D.
  - 2° Grupo C vs 1° Grupo D.
  - Se repite el mismo patrón para E/F y G/H.
- Las llaves posteriores quedan predefinidas por orden de avance.
- En partidos eliminatorios empatados, avanza el equipo que hizo menos faltas.
- Si también empatan en faltas, se usa tarjetas como segundo criterio y un desempate determinístico final.
- La vista del Mundial mantiene visible lo anterior: grupos, fases ya jugadas y nuevas fases creadas.
- Se agregó un bloque de estadísticas del Mundial de Clubes:
  - goleadores;
  - asistidores;
  - tarjetas;
  - más partidos jugados;
  - faltas por equipo.

### Archivos modificados en V6.45

- `index.html`
- `config.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `README.md`

### Validación V6.45

- JS revisado con `node --check`.
- JSON de `data/` parseado correctamente.
- ZIP incremental y completo verificados con `unzip -tq`.
