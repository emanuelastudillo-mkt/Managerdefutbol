# Características internas de versión · V3.08

## Objetivo

Ajustar el comportamiento de ofertas de compra para que el mercado sea menos repetitivo y tenga consecuencias por temporada.

## Cambios funcionales

### Textos de oferta

La ventana de compra ahora muestra correctamente:

- `Ofrecer 50% menos`: 50% de la cláusula.
- `Ofrecer 25% menos`: 75% de la cláusula.
- `Ofrecer cláusula`: 100% de la cláusula.

### Bloqueo por rechazo

Cuando una oferta enviada por el usuario es rechazada:

- Se registra en `game.rejectedPurchaseOffers`.
- El registro queda asociado al jugador y a la temporada actual.
- El usuario no puede volver a ofertar por ese jugador hasta la temporada siguiente.
- En el mercado, el botón queda deshabilitado.
- En el modal del jugador, el botón también queda deshabilitado.

### Reinicio por temporada

Al iniciar una nueva temporada con `startNextSeason()`, se limpia:

```js
game.rejectedPurchaseOffers = {};
```

## No modificado

- Sueldos.
- Cláusulas.
- Probabilidades de aceptación.
- Fichajes libres.
- Ofertas recibidas por jugadores propios.
