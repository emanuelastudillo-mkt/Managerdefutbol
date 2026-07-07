# Características de versión - V3.31

## Ajustes sobre ESPECIAL
- Al abrir un sobre, se descuentan inmediatamente los puntos de habilidad del manager.
- El gasto queda registrado como movimiento negativo en el historial interno de puntos.
- Se bloquea la apertura simultánea de sobres para evitar dobles descuentos o aperturas superpuestas.
- Las cartas mostradas en “Última apertura” ahora son accionables: se pueden activar o destruir igual que desde el inventario.
- Las cartas activables pueden arrastrarse hasta el bloque de cartas activas.
- La apertura de sobres ahora muestra cartas progresivamente, una por una.
- Mientras se revela el sobre, las cartas nuevas no se duplican visualmente en el inventario.

## Configuración nueva
```js
ui: {
  especialAperturaCartaMs: 900
}
```
