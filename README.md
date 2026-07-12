# Fútbol Manager MVP - V6.48

## V6.48 - Nueva fórmula de reputación de clubes

Ajuste sobre V6.47 para reemplazar la fórmula anual de reputación de clubes y sumar factores deportivos más claros: campeón, ascenso, descenso y piso mínimo por liga.

### Cambios principales

- La reputación de clubes ya no usa el multiplicador anterior por número de división.
- La posición final ahora usa una fórmula por zonas:
  - campeón: suma base;
  - zona alta: suma leve;
  - zona media: sin cambio;
  - zona baja: resta leve;
  - fondo de tabla: resta mayor.
- Se agregó bonus extra de reputación por salir campeón.
- Se agregó bonus extra de reputación por ascender.
- Se agregó penalización configurable por descender.
- Las restas de reputación respetan un mínimo por liga:
  - Primera: no baja de 40 por cierre de temporada;
  - Segunda: no baja de 25 por cierre de temporada;
  - Tercera: no baja de 10 por cierre de temporada.
- Si un club ya está por debajo del mínimo de su liga, no se le resta reputación por mala temporada.
- La fórmula queda editable desde `config.js` en `clubes.reputacionTemporada`.
- Se guarda un historial interno de cambios de reputación por temporada.

### Archivos modificados en V6.48

- `index.html`
- `config.js`
- `js/game/05-state-season.js`
- `README.md`

### Validación V6.48

- JS revisado con `node --check`.
- JSON de `data/` parseado correctamente.
- ZIP incremental y completo verificados con `unzip -tq`.
