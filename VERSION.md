# Versión V3.23

## Tipo de actualización

Ajuste de calendario visual y estado de campos de juego de equipos bots.

## Cambios principales V3.23

- El visor de **Próximo compromiso** ahora muestra el estado del campo de juego donde se disputará el partido.
- Se muestra el club local, el puntaje del campo y la etiqueta de estado: Excelente, Normal, Regular, Muy malo o Injugable.
- Los equipos bots ahora tienen un campo de juego fijo durante toda la temporada.
- El campo de un equipo bot se asigna al inicio de la temporada.
- Al finalizar una temporada, los bots reciben un campo mejor o peor para la siguiente temporada según su posición final en la tabla.
- El campo del club manejado por el jugador conserva la lógica dinámica existente: se deteriora al jugar de local y puede mejorarse con mantenimiento.
- Si el jugador cambia de club al comenzar una nueva temporada, el nuevo club recibe el estado de campo calculado por su rendimiento de la temporada anterior.

## Nuevos parámetros configurables

```js
estadio: {
  botsCampoFijoPorTemporada: true,
  botsCampoMinimo: 30,
  botsCampoMaximo: 95,
  botsCampoBaseInicial: 58,
  botsCampoRangoPorPosicion: 42
}
```

## Compatibilidad

- Compatible con partidas existentes.
- En partidas ya guardadas, los nuevos estados fijos de bots se consolidan al iniciar la siguiente temporada.
- No modifica la lógica de mantenimiento del campo propio.

---

## Versión anterior: V3.22

- Se agregó el botón **Tratar a todos** para tratar lesionados de forma masiva.
- El costo equivale al 1% del sueldo/costo del kinesiólogo contratado.
- Las animaciones de tratamientos se ejecutan jugador por jugador.
