# Versión V3.27

## Nombre
Doble avance: día y próximo partido

## Base
V3.26 · Reparación automática de campos bots injugables

## Cambios principales V3.27

- Se reemplazó el botón único de avance por dos botones:
  - `Avanzar día`
  - `Ir a próximo partido`
- `Avanzar día` mueve el calendario sólo 1 día durante la temporada regular.
- `Avanzar día` usa un cooldown corto configurable de 10 segundos.
- `Ir a próximo partido` lleva el calendario al día del próximo compromiso y ejecuta el partido.
- `Ir a próximo partido` mantiene el cooldown largo de 120 segundos.
- La barra de progreso queda debajo de ambos botones y ocupa el ancho conjunto del bloque.
- La barra ahora calcula su progreso usando la duración real del bloqueo activo, no siempre 120 segundos.
- La fecha lateral ahora muestra el día real del calendario guardado.
- Si ya hay un partido pendiente en el día actual, el avance diario se bloquea para evitar saltarse el encuentro.

## Configuración agregada

```js
calendario: {
  bloqueoEntreAvancesMs: 120000,
  bloqueoAvanceDiaMs: 10000
}
```

## Archivos modificados

- `config.js`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `js/ui/06-render-home-messages.js`
- `style.css`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

## Versión anterior

V3.26 · Reparación automática de campos bots injugables
