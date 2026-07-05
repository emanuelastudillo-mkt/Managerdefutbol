# Fútbol Manager MVP - V1.20

Paquete de actualización del proyecto para navegador.

## Cambios de esta versión
- Se agrega **moral visible** para cada jugador, con escala de 1 a 99.
- La moral se muestra con una barra degradada de **morado a celeste**.
- La moral aparece en:
  - pantalla de plantel,
  - pantalla de táctica,
  - ficha individual del jugador.
- La moral afecta internamente el rendimiento del jugador en partido.
- Se agrega el menú lateral **Empleados**.
- Se agrega la acción **Llamar al psicólogo motivacional**.
- La acción cuesta `$500.000`.
- Si la charla es exitosa, mejora la moral del plantel sin mostrar el valor exacto de mejora.
- Si la charla fracasa, no mejora la moral y el costo se descuenta igual.
- Se actualizan reglas de moral post partido:
  - titular: sube moral,
  - suplente utilizado: sube menos,
  - no jugar: baja moral,
  - ganar: sube a toda la plantilla,
  - perder: baja más a titulares y baja menos al resto.

## Archivos incluidos
- `index.html`
- `app.js`
- `style.css`
- `README.md`
- `VERSION.md`

## Nota
Este ZIP **no incluye** `pitch-board.png`. Mantené ese archivo en tu repositorio actual.
