# V3.77 - Elegibilidad de clubes por prestigio corregida

- Se corrigió la regla de selección de clubes al iniciar o continuar carrera.
- Un manager nuevo conserva prestigio real 0.
- Los clubes con prestigio 20 o menos pueden ser seleccionados por cualquier manager.
- Los clubes con prestigio 21 o más sólo aceptan managers con prestigio igual o superior al prestigio del club.
- Se corrigieron textos de interfaz que decían "menor a 20" para reflejar "20 o menos".
- Se agregaron parámetros editables en `config.js`: `manager.prestigioInicial` y `manager.prestigioClubLibreMinimo`.

---

# V3.75 - Ligas simultáneas Argentina + Chile

- El juego ahora carga y combina todos los JSON válidos definidos en `data.leagueUrls`.
- `Buscar club` permite elegir país, liga y club usando el mismo mundo de partida.
- Argentina y Chile pueden convivir simultáneamente en la selección de clubes.
- Se cargan también múltiples JSON de estadios e hinchas mediante `data.estadiosUrls` y `data.hinchasUrls`.
- Los clubes reciben país propio para filtrar correctamente.
- Los jugadores generados de ligas sin base de datos específica se conservan.
