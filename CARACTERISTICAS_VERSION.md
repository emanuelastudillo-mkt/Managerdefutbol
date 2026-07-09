# V4.20 - Rechazo de ofertas por media y prestigio

## Cambios

- Los jugadores libres ya no aceptan sólo por prestigio directo del club.
- La aceptación se calcula con la diferencia entre media del jugador y prestigio del club ofertante.
- La misma fórmula se aplica a jugadores contratados de otros clubes.
- Si el jugador rechaza, queda bloqueado para ese club hasta la próxima temporada.
- El mercado muestra la probabilidad estimada de aceptación de cada jugador.
- En jugadores contratados, las ofertas bajas todavía pueden ser rechazadas por el club vendedor; si pasan esa negociación, el jugador decide con la nueva curva.

## Fórmula aplicada

- Diferencia = media del jugador - prestigio del club ofertante.
- Diferencia -30: 95% aceptación.
- Diferencia 0: 80% aceptación.
- Diferencia 30: 20% aceptación.
- Diferencia 50: 3% aceptación.
- Diferencia 70: 1% aceptación.
- Diferencia 100: 0.5% aceptación.

## Seguridad

- No se modifica calendario, economía, simulador ni estructura de clubes.
- Los bloqueos de rechazo existentes siguen funcionando por temporada.
