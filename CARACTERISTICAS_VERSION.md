# Características de versión - V3.32

## Ajustes sobre ESPECIAL
- Al terminar la apertura, las cartas obtenidas dejan de quedar solamente en el bloque de apertura y pasan al inventario de reserva.
- Se agregó una reparación defensiva para cartas de última apertura: si una carta no aparece en reserva pero existe en el historial reciente, se recupera antes de activar o destruir.
- Se triplicó el tiempo entre cartas al abrir sobres.
- La apertura mantiene la revelación de a una carta por vez y luego limpia el bloque temporal de apertura.

## Configuración actualizada
```js
ui: {
  especialAperturaCartaMs: 2700
}
```
