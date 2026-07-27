# Una vida de manager — V8.64

## Base requerida

Aplicar este incremental sobre **V8.63**.

## Cambios

### Selección en táctica personalizada

- El primer clic sobre un jugador ahora lo muestra con el color atenuado.
- La atenuación se aplica en la cancha, la lista de titulares, suplentes y reservas.
- El jugador seleccionado conserva exactamente su posición y tamaño mientras espera el segundo clic.
- Volver a hacer clic sobre el mismo jugador continúa cancelando la selección.

### Casilla de destino fija

- En el segundo clic, las casillas disponibles de la táctica personalizada ya no aumentan de tamaño ni se desplazan al pasar el cursor o presionarlas.
- El estado interactivo se comunica únicamente atenuando el color, brillo y saturación.
- La ubicación final del jugador y la lógica de intercambio no fueron modificadas.

## Compatibilidad

- Compatible con partidas existentes de V8.63.
- No modifica formaciones guardadas, titulares, suplentes, mentalidades ni modificadores tácticos.
- No requiere cambios de Worker, SQL ni recursos gráficos.

## Archivos modificados

- `config.js`
- `index.html`
- `js/ui/07-render-team-market.js`
- `styles/20-team-tactics-training.css`
