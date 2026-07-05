# Fútbol Manager MVP - V2.20

Paquete de actualización del proyecto para navegador.

## Cambios de esta versión
- En los selectores de orden se elimina la palabra "Ordenar" y se deja un marcador compacto.
- Moral y estado físico pasan de barras horizontales a indicadores circulares compactos para ahorrar espacio en tablas.
- Las nacionalidades se muestran como abreviatura de 3 letras en listados y tablas.
- En la ficha del jugador se conserva el nombre completo del país.
- Se agrega `data/sponsors.json` con 20 lugares de sponsor y 200 marcas.
- En el menú Estadio se incorpora la sección Sponsors.
- Las ofertas de sponsors llegan cada 4 a 7 partidos.
- Cada tanda genera entre 2 y 5 ofertas.
- Al aceptar una oferta, el pago total se acredita inmediatamente al presupuesto.
- Los contratos activos ocupan su lugar de sponsor durante los turnos definidos por la oferta.
- El cálculo usa multiplicador por división, lugar, posición en tabla, moral y cohesión.

## Archivos incluidos
- `index.html`
- `app.js`
- `style.css`
- `simulador-2.0.js`
- `README.md`
- `VERSION.md`
- `data/jugadores.json`
- `data/sponsors.json`

## Nota
Este ZIP no incluye `pitch-board.png`.
