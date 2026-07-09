# V4.15 - Verificador de ligas incompletas

## Cambios

- Se mejora el botón `Verificar que todo esté bien`.
- El verificador ahora conserva una referencia de la estructura base de clubes/divisiones antes de cargar snapshots de partidas guardadas.
- La reparación segura corrige clubes en país incorrecto y además balancea divisiones incompletas.
- Si una liga queda con menos de sus clubes esperados, vuelve a aparecer la opción de `Aplicar reparaciones seguras`.
- El reporte de estructura muestra `clubes / esperado` por división.
- La reparación actualiza `clubDivisionOverrides` y guarda la partida.

## Seguridad

- No reconstruye calendario.
- No borra resultados.
- No reinicia temporada.
- No elimina jugadores.
- No modifica economía.

## Compatibilidad

- Se implementa solo.
- Recomendado para partidas donde el verificador anterior movió clubes pero dejó ligas con menos de 18 equipos.
