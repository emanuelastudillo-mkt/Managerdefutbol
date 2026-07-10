# Características de la versión V5.39

## Fotos manuales y reaparición libre

- Corrige la sincronización de fotos personalizadas para jugadores manuales ya existentes en partidas guardadas.
- El sincronizador actualiza `photoPath` desde `data/jugadores_manuales.json` sin resetear club actual, edad actual, estado de transferencia ni progreso de partida.
- Los 7 jugadores manuales activos usan rutas `.webp` en `img/jugadores/manual/` y el ZIP incluye esa carpeta con un README de nombres esperados.
- La UI agrega versión a la URL de fotos personalizadas para evitar caché vieja del navegador.
- Los 7 jugadores manuales activos quedan con `reapareceAlRetirarse: true`.
- Al retirarse, estos jugadores reaparecen como libres con 20 años.
- La reaparición conserva sueldo, cláusula, valor de mercado, media bloqueada, habilidades y ruta de foto.
- El jugador reaparecido queda disponible en el mercado libre con `clubId: 0` y `freeAgent: true`.
- El sistema limpia estados anteriores de lesión, moral, condición, entrenamiento y estadísticas antes de inicializarlo como libre.

## Alcance

- No agrega pantalla de edición manual todavía.
- No cambia los clubes iniciales de Ronaldinho, Buffon, Beckham, Maldini, Maradona, Zidane ni Pele.
- No modifica la lógica general de retiro para jugadores comunes.
- No modifica la generación automática de jugadores comunes ni el mercado general.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. Las partidas existentes actualizan las rutas de foto de jugadores manuales al cargar y aplican la nueva regla de reaparición para retiros futuros.
