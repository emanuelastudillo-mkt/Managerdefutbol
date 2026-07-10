# Características de la versión V5.37

## Jugadores manuales activos

- Agrega `data/jugadores_manuales.json` como archivo activo de carga automática.
- Crea 7 jugadores manuales en clubes reales del juego: Ronaldinho, Gianluigi Buffon, David Beckham, Paolo Maldini, Diego Maradona, Zinedine Zidane y Pele.
- Resuelve los clubes destino con IDs reales cargados por el juego: Barcelona, Juventus, Manchester United, Milan, Napoli, Real Madrid y Santos.
- Todos los jugadores manuales usan sueldo anual fijo de `$150.000.000`, cláusula fija de `$1.200.000.000` y valor de mercado de `$1.200.000.000`.
- Agrega rutas de foto personalizadas en `img/jugadores/manual/`. Si la imagen no existe, la UI vuelve automáticamente a las caras por nacionalidad.
- Convierte la estructura visible de `habilidades` al modelo interno del juego.
- Respeta `media` como media bloqueada para estos jugadores manuales.
- Los campos `agresividad`, `genetica` y `factorSorpresa` ahora pueden impactar como habilidades ocultas cuando existen en jugadores manuales.

## Alcance

- No agrega pantalla de edición manual todavía.
- No modifica la generación automática de jugadores comunes.
- No modifica reglas de mercado, contratos ni simulación fuera de la carga manual.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. En partidas existentes, los jugadores manuales se agregan al cargar si todavía no existen por ID.
