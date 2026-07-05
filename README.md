# Fútbol Manager MVP - V2.3

Paquete de actualización del proyecto para navegador.

## Cambios de esta versión
- Se agregan banners contextuales en el panel principal según lo ocurrido en el último partido propio.
- Si hubo una lesión leve, intermedia o grave, se muestra la imagen correspondiente desde `img/principales/`.
- Si no hubo lesionados y el equipo empató o perdió, se muestra el banner de entrenamiento normal.
- Si no hubo lesionados y el equipo ganó, se muestra el banner de entrenamiento posterior al triunfo.
- Los jugadores lesionados con menos de 10 turnos restantes ahora pueden ser convocados como suplentes.
- Un lesionado convocado como suplente queda penalizado internamente al 10% de rendimiento.
- Los lesionados no pueden ser titulares.
- Los suspendidos no pueden ser titulares ni suplentes.
- El banco prioriza jugadores sanos; sólo usa lesionados convocables si hacen falta.

## Archivos incluidos
- `index.html`
- `app.js`
- `simulador-2.0.js`
- `style.css`
- `README.md`
- `VERSION.md`

## Nota
Este ZIP **no incluye** `pitch-board.png` ni imágenes de `img/principales/`. Mantené esos archivos en tu repositorio actual.
