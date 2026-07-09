# V4.12 - Visor de partido y eventos destacados

## Cambios principales

- Se agrega un visor visual de inclinación de cancha en el simulador de partido.
- El visor tiene dos colores: local y visitante.
- La pelota se desplaza en la barra según posesión, ataques y ocasiones visibles hasta ese momento.
- Se muestra una etiqueta indicando si la cancha está inclinada para el local, visitante o equilibrada.
- Se agregan animaciones especiales para goles.
- Los goles muestran escudo, nombre del jugador y grito `GOOOOOOLLLL!`.
- Se agregan animaciones especiales para rojas directas y dobles amarillas.
- Las rojas muestran escudo, nombre del jugador y tarjeta roja grande.
- Se agregan animaciones especiales para lesiones.
- Las lesiones muestran escudo, nombre del jugador e ícono de lesión.
- Las animaciones se muestran al revelarse el evento dentro de las fases del relato.

## Archivos modificados

- `index.html`
- `config.js`
- `VERSION.md`
- `README.md`
- `CARACTERISTICAS_VERSION.md`
- `style.css`
- `js/ui/12-modals.js`

## Validaciones

- Sintaxis validada en `config.js`.
- Sintaxis validada en todos los archivos `.js`.
- El cambio no modifica el motor de resultado, sólo la visualización del simulador.
