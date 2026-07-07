# Características de versión - V3.33

## Ajustes sobre Academia
- Al iniciar una captación, si todavía no se usó el beneficio de la temporada, llega inmediatamente 1 juvenil excepcional de 16 años.
- El juvenil queda en la academia como jugador activo, puede entrenarse normalmente y puede subirse al primer equipo por tener edad suficiente.
- El beneficio es único por temporada: nuevas captaciones de la misma temporada ya no entregan otro juvenil excepcional.
- El estado se reinicia al comenzar la siguiente temporada.
- La carta del jugador muestra una marca visual de “Juvenil excepcional”.

## Configuración agregada
```js
academia: {
  juvenilExcepcionalPorTemporada: true,
  edadJuvenilExcepcional: 16,
  mediaJuvenilExcepcionalMin: 12,
  mediaJuvenilExcepcionalMax: 40
}
```
