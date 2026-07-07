# Fútbol Manager MVP · V3.21

## Cambios V3.21

- Se ajusta el balance de **cohesión de equipo** para que suba con mayor claridad.
- La ganancia por partido pasa de 8 a 14 puntos base.
- La pérdida por cambios o expulsiones baja de 2 a 1 punto por evento.
- La pérdida por cambiar la táctica baja de 10 a 8 puntos.
- El entrenamiento táctico ahora puede dar cohesión con una probabilidad configurable por casilla, sin quedar tan diluido por el avance semanal.
- Se agrega el bloque `cohesion` en `config.js` para modificar estos valores sin tocar el motor.

## Configuración nueva

```js
cohesion: {
  valorInicial: 50,
  gananciaPorPartido: 14,
  perdidaPorCambioTactico: 8,
  perdidaPorCambioJugador: 1,
  probabilidadEntrenamientoTacticoPorCasilla: 0.35,
  gananciaEntrenamientoTacticoPorCasilla: 1
}
```

## Cambios V3.20

- Se agrega un **5º entrenamiento diario individual** por jugador.
- El plan semanal general mantiene los 4 turnos diarios existentes para todo el plantel.
- Cada jugador puede tener un foco propio: Equilibrado, Recuperación, Físico, Técnico, Defensivo, Ofensivo, Portería, Mental o Descanso.
- El foco individual se configura desde la tabla de Entrenamiento, con selector por jugador y opción para aplicar un mismo foco a todo el plantel.
- El quinto entrenamiento se aplica una vez por día en cada avance semanal.
- La intensidad del entrenamiento individual queda editable desde `config.js`.
- Las partidas existentes migran automáticamente el viejo `trainingPlan` al nuevo formato individual.

## Validación

- JavaScript validado con `node --check`.
- JSON validado.
- ZIP verificado.
