# Características de versión - V3.34

## Corrección crítica: sobres y reserva
- Al abrir un sobre, las cartas se agregan inmediatamente a `cartas_reserva`.
- La partida se guarda antes de iniciar la animación de apertura.
- La animación sólo revela visualmente las cartas; no es el lugar definitivo del inventario.
- Al finalizar la apertura, las cartas aparecen en **Cartas en reserva / Inventario**.
- Desde Inventario se pueden activar o destruir.
- Durante la animación, los botones de las cartas reveladas quedan reemplazados por el estado “Guardada en reserva” para evitar acciones sobre una vista temporal.
- Si el guardado falla, se revierten los puntos descontados y no se consume el sobre.

## Reparación de partidas afectadas
- Si una partida quedó con cartas en historial pero fuera de reserva, el sistema intenta reconstruir la reserva automáticamente.
- No duplica cartas ya activas o ya existentes en reserva.
- No recupera cartas cuyo último estado registrado sea destruida.
