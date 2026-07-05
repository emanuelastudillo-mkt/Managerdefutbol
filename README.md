# Fútbol Manager MVP - V2.2

Paquete de actualización del proyecto para navegador.

## Cambios de esta versión
- Si un jugador propio se lesiona o es expulsado, se quita del once titular y queda fuera de la convocatoria, dejando su lugar vacío en la pizarra.
- La sección de lesionados del panel principal ahora muestra foto del jugador e ícono de lesión.
- En la simulación se agregan íconos para goles, asistencias, cambios y lesiones.
- Las lesiones en la ficha de partido ya no muestran los turnos de baja dentro del evento.
- Se agrega el empleado **Kinesiólogo**.
- El kinesiólogo cuesta $1.000.000 por temporada y permite intentar reducir una lesión 1 turno por jugador y por turno.
- El tratamiento del kinesiólogo puede fallar un 20% de las veces.
- La creación de nueva partida pasa a ventana emergente desde Reset o cuando no hay partida activa.
- El menú lateral queda minimizado mostrando solo “Nueva partida” y un ícono para abrir.

## Archivos incluidos
- `index.html`
- `app.js`
- `simulador-2.0.js`
- `style.css`
- `README.md`
- `VERSION.md`

## Nota
Este ZIP **no incluye** `pitch-board.png`. Mantené ese archivo en tu repositorio actual.
