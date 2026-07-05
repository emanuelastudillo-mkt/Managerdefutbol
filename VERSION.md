# Registro de versión

## Versión: V2.25
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** mercado de cierre de temporada

### Resumen
Esta versión agrega una generación automática de ofertas por jugadores propios durante los turnos finales de la temporada.

### Cambios principales agregados
- En postemporada pueden aparecer entre 2 y 6 ofertas por jugadores del equipo.
- La lógica interna prioriza futbolistas de mayor media, goleadores y asistidores.
- Las ofertas de cierre de temporada pagan mejores porcentajes que las ofertas aleatorias normales.
- La información de probabilidad, cantidad y criterio de selección queda oculta al usuario.
- No se generan nuevas ofertas automáticas por jugadores que ya tengan una oferta pendiente.
- Se conserva el bloqueo de 3 turnos para ofrecer manualmente jugadores propios a otros clubes.

### Nota técnica
Las ofertas de cierre se registran por temporada mediante `seasonEndPlayerOffers`, evitando que se repitan varias veces dentro de la misma postemporada.
