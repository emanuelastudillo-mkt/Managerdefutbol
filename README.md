# Fútbol Manager MVP - V6.44

## V6.44 - Mundial de Clubes con fechas protegidas

Ajuste sobre V6.43 para corregir la planificación del Mundial de Clubes cuando el fixture se crea tarde o una partida arrastra fechas inválidas.

### Cambios principales

- El fixture del Mundial de Clubes sigue quedando listo desde el día 295 si las ligas ya terminaron.
- La fase de grupos ahora calcula fechas protegidas:
  - Fecha 1: mínimo 18 días después de la última fecha regular de liga.
  - Fecha 2: 5 días después de la Fecha 1.
  - Fecha 3: 5 días después de la Fecha 2.
- Si el fixture se genera cuando alguna fecha ya quedó vencida, se mueve hacia adelante para evitar que el avance diario simule varias fechas juntas.
- Se agregó reparación automática para fixtures viejos del Mundial con fechas repetidas o vencidas.
- La reparación actualiza también las fechas de partidos ya registrados en historial, sin modificar resultados.
- El calendario de Mundial de Clubes revisa y repara fechas antes de mostrarse.

### Archivos modificados en V6.44

- `index.html`
- `config.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `README.md`

### Validación V6.44

- JS revisado con `node --check`.
- JSON de `data/` parseados correctamente.
- ZIP incremental y completo verificados sin errores.
