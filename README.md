# V9.26 · Capitanía oculta y Primer equipo optimizado

Esta versión se construye sobre V9.25.

## Cambios

- El juego ya no muestra el máximo interno de capitanía de ningún jugador.
- Vestuario y Táctica continúan mostrando el porcentaje actual y el tiempo aproximado de formación, sin revelar el techo posible.
- La normalización del progreso de capitanía se realiza una sola vez por partida cargada, en lugar de repetirse en cada lectura.
- El máximo interno de capitanía usa una caché segura que se invalida cuando cambian edad, habilidades, mejoras o deterioro.
- Las consultas de confianza, renovación y jerarquía del vestuario usan lecturas rápidas después de una única sincronización.
- El vestuario evita reconstruir el plantel si fecha, alineación, integrantes y estadísticas relevantes no cambiaron.
- Los tabs de Primer equipo usan un único controlador delegado y permiten pintar el tab activo antes de generar la vista.
- Las fotos de jugadores cargan de forma diferida y recuerdan durante la sesión qué extensión funcionó, evitando repetir búsquedas fallidas al cambiar de pestaña.

## Compatibilidad

No cambia la lógica deportiva, los porcentajes de capitanía, las cartas, los guardados ni la formación ya acumulada.
