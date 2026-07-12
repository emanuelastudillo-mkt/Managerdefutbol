# Fútbol Manager MVP - V6.46

## V6.46 - Mundial de Clubes sin error de división inexistente

Ajuste sobre V6.45 para que los equipos invitados del Mundial de Clubes no sean evaluados como clubes de liga regular.

### Cambios principales

- Los 8 equipos externos/invitados del Mundial de Clubes quedan marcados como equipos de competición especial.
- El verificador de estructura ya no los cuenta como clubes con división inexistente.
- La reparación segura de divisiones ya no intenta mover invitados del Mundial a ligas reales.
- El conteo de clubes por división ignora equipos de competición especial.
- La generación del fixture de liga regular filtra clubes especiales para evitar que puedan entrar accidentalmente en una liga local.
- Se mantiene intacto el funcionamiento del Mundial de Clubes de V6.45: grupos A-H, fechas escalonadas, llaves predefinidas y estadísticas propias.

### Archivos modificados en V6.46

- `index.html`
- `config.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `README.md`

### Validación V6.46

- JS revisado con `node --check`.
- JSON de `data/` parseado correctamente.
- ZIP incremental y completo verificados con `unzip -tq`.
