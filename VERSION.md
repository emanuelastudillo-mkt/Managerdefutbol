# Versión V3.21

## Tipo de actualización

Balance de cohesión de equipo.

## Cambios principales V3.21

- La cohesión sube más después de los partidos.
- Los cambios de jugadores y expulsiones castigan menos la cohesión.
- Cambiar de táctica sigue teniendo coste, pero se reduce levemente.
- El entrenamiento táctico ahora tiene una probabilidad directa de sumar cohesión por casilla táctica semanal.
- Se agrega configuración editable para todo el sistema de cohesión.

## Valores actuales

```js
gananciaPorPartido: 14,
perdidaPorCambioTactico: 8,
perdidaPorCambioJugador: 1,
probabilidadEntrenamientoTacticoPorCasilla: 0.35,
gananciaEntrenamientoTacticoPorCasilla: 1
```

## Compatibilidad

- Compatible con partidas existentes.
- La cohesión ya guardada de cada club se conserva.
- Los nuevos valores aplican desde el próximo avance o partido.

---

## Versión anterior: V3.20

- Se mantiene el plan semanal general de 7 días con 4 turnos diarios.
- Se suma un quinto entrenamiento diario individual por jugador.
- Cada jugador puede recibir un foco propio: equilibrio, recuperación, físico, técnica, defensa, ataque, portería, mental o descanso.
- La pantalla Entrenamiento agrega una columna **5º entrenamiento**.
- Se agrega un selector masivo para aplicar un mismo foco individual a todo el plantel.
- El avance semanal aplica 7 sesiones individuales por jugador, una por cada día avanzado.
- Se agregan parámetros de configuración para activar/desactivar y balancear el quinto entrenamiento.
