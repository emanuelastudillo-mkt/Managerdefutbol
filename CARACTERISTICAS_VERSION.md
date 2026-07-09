# Características V4.34 - Corrección calendario, préstamos y cartas

## Cambios

- Corregido el pago semanal de cuotas de préstamos.
- El préstamo activo ahora conserva `lastPaymentDate`, `nextPaymentDate` y el progreso de cuotas al normalizar la partida.
- Se reemplaza la lógica frágil de `daysSincePayment` por vencimientos por fecha.
- Si la partida avanza varios días, las cuotas vencidas se cobran por orden hasta ponerse al día.
- El panel del banco muestra la próxima fecha de cuota.
- Corregido el bloqueo de cartas activas que podía mostrar valores anómalos como 337 días.
- Las cartas activas ahora tienen bloqueo por turno absoluto además de fecha.
- El bloqueo visible queda limitado al máximo configurado de cartas activas.
- Agregada protección contra retrocesos de calendario mediante `lastCalendarDate`.
- El cambio de temporada mantiene lógica de avance: la nueva temporada empieza después del cierre anterior y no como reinicio hacia atrás.

## Motivo

El problema de préstamos venía de una normalización que descartaba el contador interno de días sin pago. El problema de cartas venía de depender solo de fechas visibles cuando el cambio de temporada podía recalcular el calendario como si fuera un reinicio. Esta versión endurece ambos sistemas para que usen referencias persistentes y no retrocedan.
