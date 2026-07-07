# Versión V3.22

## Tipo de actualización

Ajuste de empleados médicos y tratamientos masivos.

## Cambios principales V3.22

- Se agrega un botón masivo para tratar a todos los jugadores lesionados pendientes de tratamiento semanal.
- El bloque muestra la frase: **“Que los médicos hagan horas extras hoy”**.
- El botón se muestra como **“Tratar a todos”** e informa el costo antes de ejecutarse.
- El costo se cobra al momento y equivale al **1% del costo/sueldo del kinesiólogo contratado**.
- El tratamiento masivo respeta la regla existente: cada jugador sólo puede recibir un intento de tratamiento por semana.
- Las animaciones se ejecutan de forma progresiva jugador por jugador, no todas a la vez.
- El resultado individual puede ser exitoso o fallido según la probabilidad de fallo del kinesiólogo.

## Nuevos parámetros configurables

```js
empleados: {
  kinesiologoHorasExtrasPorcentajeSueldo: 0.01
},
ui: {
  kinesiologoTratamientoProgresivoMs: 650
}
```

## Compatibilidad

- Compatible con partidas existentes.
- No modifica lesiones ya guardadas.
- No cambia el tratamiento individual existente.
- El botón masivo sólo aparece si hay kinesiólogo contratado y jugadores lesionados.

---

## Versión anterior: V3.21

- La cohesión sube más después de los partidos.
- Los cambios de jugadores y expulsiones castigan menos la cohesión.
- Cambiar de táctica sigue teniendo coste, pero se reduce levemente.
- El entrenamiento táctico ahora tiene una probabilidad directa de sumar cohesión por casilla táctica semanal.
- Se agrega configuración editable para todo el sistema de cohesión.
