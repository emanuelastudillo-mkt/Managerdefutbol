# Características de versión - V3.38

## Ajuste aplicado

### Sistema ESPECIAL · Cartas activas visibles
- Se corrigió un bug por el cual una carta podía desaparecer al activarse.
- La causa era una normalización interna ejecutada en medio del proceso de activación.
- Ahora la carta se elimina de reserva, se agrega a cartas activas y se guarda correctamente en `game.special`.

### Bonus activo
- El sector de cartas activas ahora se presenta como **Bonus activo**.
- Las cartas activas quedan visibles en ese sector.
- Cada carta muestra su bloqueo restante.
- El botón **Desactivar** queda bloqueado hasta que pasen los 100 días.

### Regla de cartas activas
- El bloque superior ahora muestra:
  - total de bonus acumulados activos;
  - nombre de cada carta activa;
  - efecto de cada carta;
  - estado de bloqueo de cada carta.

## Archivos modificados
- `js/game/15-especial.js`
- `style.css`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`
