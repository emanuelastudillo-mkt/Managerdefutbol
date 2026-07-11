# Características de la versión V6.07

## V6.07 - Probabilidad de fichaje como dato de ojeo

### Centro de Ojeo

- La probabilidad de ser fichado pasa a funcionar como un dato revelable.
- Se incorpora al informe de jugadores externos dentro del bloque de Mercado.
- El dato queda oculto hasta que el proceso de ojeo lo descubra.
- Al revelarse, aparece como porcentaje en el informe activo y en los informes guardados.

### Mercado

- La columna de aceptación deja de mostrar información automática.
- Mientras el dato no esté ojeado, se mantiene `Interés oculto`.
- Cuando el ojeo revela la probabilidad, el mercado muestra `Prob. fichaje`.

### Validaciones

- Sintaxis JS validada con `node --check`.
- JSON de `data/` parseados correctamente.
- ZIP completo e incremental verificados.
