# V4.07 - Federaciones en ofertas de traspaso

## Cambios principales

- Los mensajes de ofertas de jugadores ahora muestran la federación correspondiente a la liga o país del club comprador.
- Se reemplaza el texto fijo `AFA retiene` por una sigla dinámica.
- Federaciones configuradas:
  - Argentina: AFA.
  - Chile: ANFP.
  - Brasil: CBF.
  - Inglaterra: FA.
  - España: RFEF.
  - Italia: FIGC.
  - Rumania: FRF.
- Los clubes externos genéricos usan una sigla coherente cuando puede inferirse por el nombre.
- Al aceptar una venta, el resumen de ingreso neto también muestra la federación correspondiente.
- La configuración editable queda en `config.js > mercado.federacionesTraspaso`.

## Archivos modificados

- `index.html`
- `config.js`
- `VERSION.md`
- `README.md`
- `CARACTERISTICAS_VERSION.md`
- `js/core/01-config-constants.js`
- `js/ui/06-render-home-messages.js`
- `js/ui/12-modals.js`

## Validaciones

- Sintaxis validada en `config.js`.
- Sintaxis validada en todos los archivos `.js`.

## Nota

- España queda como `RFEF`, no `REFF`.
