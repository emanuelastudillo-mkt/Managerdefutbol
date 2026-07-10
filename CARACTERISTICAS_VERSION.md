# V5.32 - Ranking online manual y automático

## Cambios
- Se reactiva la carga manual desde la pantalla **Ranking Online**.
- Se agrega el botón **Subir datos del club**.
- El botón permite enviar el estado actual del club cada **50 días de juego**.
- El bloqueo manual usa `rankingLastManualUploadGameDate`, separado de los envíos automáticos.
- Se mantiene la carga automática al finalizar temporada y al ser despedido.
- Las cargas manuales generan eventos por día de temporada para evitar pisar envíos manuales anteriores.
- La tabla online sigue permitiendo actualizar y ordenar registros.
- `config.js` queda con `ranking.cooldownCargaDias: 50`.

## Datos enviados
- Manager, club, división, temporada, posición, puntos, G-E-P, goles, diferencia de gol.
- Presupuesto inicial, presupuesto final, variación de presupuesto y puntaje manager.
- Fecha de juego, día de temporada, tipo de evento, versión y código de partida.

## Validación
- `node --check` aplicado sobre todos los archivos JS.
- JSON de `data/` parseados correctamente.

## Compatibilidad
Se implementa solo. No requiere reiniciar partida porque agrega campos nuevos opcionales al guardado local.
