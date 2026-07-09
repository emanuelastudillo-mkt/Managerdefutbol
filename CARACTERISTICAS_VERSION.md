# Características V4.28 - Aceptación de ofertas oculta

## Cambios

- Se oculta el porcentaje exacto de aceptación de ofertas en jugadores libres y contratados.
- El mercado ya no muestra `Acepta X%`.
- Las fichas de jugador externo ya no muestran probabilidad exacta de interés.
- Los mensajes de rechazo ya no informan la probabilidad calculada.
- La fórmula interna de aceptación/rechazo se mantiene igual: media real del jugador contra prestigio del club ofertante.
- Si el jugador rechaza, el bloqueo hasta la próxima temporada se mantiene.

## Motivo

El porcentaje exacto filtraba demasiada información del scouting y permitía inferir el nivel real del jugador. Ahora el dato queda oculto y la decisión se mantiene como parte interna de la negociación.
