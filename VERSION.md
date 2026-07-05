# Registro de versión

## Versión: V1.12
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** visual y UX táctica

### Resumen
Esta versión ajusta la pantalla de táctica para mejorar la lectura de estado físico, reducir texto innecesario y dar más contraste a la pizarra.

### Cambios principales agregados
- Barra horizontal de **estado físico** en cada titular dentro de la pantalla Táctica.
- Degradado visual de rojo a verde:
  - rojo en valores bajos,
  - amarillo/intermedio en valores medios,
  - verde en valores altos.
- Valor numérico visible dentro de la barra, por ejemplo `87/99`.
- Eliminado el bloque de texto bajo la pizarra:
  - Posicional
  - Ataque
  - Defensiva
  - Anillo / Estado físico
- Pizarra visual reajustada con CSS:
  - menos ruido visual,
  - mayor contraste,
  - líneas de cancha más claras,
  - áreas marcadas sin depender de elementos extra.

### Cambios técnicos
- Se agregó `conditionBar(playerId)` en `app.js`.
- Se ajustó el layout de `.lineup-row` a cuatro columnas.
- Se agregó override CSS para ocultar `.pitch-legend`.
- Se agregó estilo de pizarra minimalista en `style.css`.

### Archivos modificados
- `index.html`
- `app.js`
- `style.css`
- `README.md`
- `VERSION.md`

### Nota
Este paquete no incluye `pitch-board.png`.
