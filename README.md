# Fútbol Manager MVP - V6.47

## V6.47 - Sponsors, portero de emergencia y orden de academia

Ajuste sobre V6.46 para corregir vencimientos de sponsors al cambiar de temporada y mejorar el manejo de planteles sin portero y de juveniles en academia.

### Cambios principales

- Las ofertas de sponsors ahora tienen vencimiento por fecha real de juego, no sólo por turno interno de temporada.
- Las ofertas activas se normalizan para que nunca aparezcan con más de 5 días restantes por desconfiguración de cambio de temporada.
- Las ofertas viejas o mal migradas se reparan automáticamente al abrir Sponsors.
- Si un plantel no tiene ningún portero natural, se permite colocar un jugador de campo en el puesto POR.
- El jugador de campo usado como portero de emergencia rinde al 25%.
- La táctica puede confirmarse con ese portero de emergencia sólo cuando el club no tiene ningún POR.
- En Academia se puede ordenar a los juveniles por edad o por porcentaje de informe descubierto.
- Se corrigió la referencia interna de cupos libres al cancelar residencias juveniles.

### Archivos modificados en V6.47

- `index.html`
- `config.js`
- `js/core/03-player-tactics-utils.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/10-academy-employees.js`
- `js/ui/07-render-team-market.js`
- `README.md`

### Validación V6.47

- JS revisado con `node --check`.
- JSON de `data/` parseado correctamente.
- ZIP incremental y completo verificados con `unzip -tq`.
