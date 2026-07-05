# Fútbol Manager MVP - V2.14

Paquete de actualización del proyecto para navegador.

## Cambios de esta versión
- Se corrige el cooldown de la charla motivacional usando un contador interno de turnos globales.
- El registro de turnos ahora contempla temporada, fase y turno interno para evitar bugs al cambiar de temporada.
- Se agrega una fase de **pretemporada** de 10 turnos al comenzar cada temporada.
- Durante la pretemporada se pueden jugar hasta 5 amistosos contra cualquier equipo.
- Se agrega una fase de **postemporada** de 5 turnos después de la última jornada oficial.
- Los turnos de pretemporada y postemporada aplican entrenamiento y permiten recuperar/preparar el plantel.

## Archivos incluidos
- `index.html`
- `app.js`
- `simulador-2.0.js`
- `README.md`
- `VERSION.md`

## Nota
Este ZIP **no incluye** `pitch-board.png`. Mantené ese archivo en tu repositorio actual si ya lo estás usando.
