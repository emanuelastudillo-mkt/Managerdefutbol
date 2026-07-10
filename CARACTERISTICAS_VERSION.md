# V5.34 - Bots: disponibilidad, libres y ofertas reales

## Cambios
- Se corrige `autoSelectStarters()` para que los clubes bot también excluyan jugadores lesionados o suspendidos.
- Se corrige `autoSelectByBestCondition()` con el mismo criterio de disponibilidad para todos los clubes.
- La reparación automática de planteles bot ahora intenta fichar jugadores libres del mercado antes de crear jugadores de emergencia o reconvertir jugadores.
- Los fichajes de libres realizados por bots para completar mínimos de plantel no usan probabilidad de aceptación: el libre se incorpora directamente.
- Se mantiene la creación/reconversión de emergencia sólo como respaldo si no hay libres disponibles por posición.
- Las ofertas automáticas por jugadores del manager ahora salen de clubes reales cargados en el juego.
- Las ofertas de fin de temporada también usan clubes reales.
- El botón de ofrecer un jugador a clubes también usa clubes reales cuando existe una fuente disponible.
- Se elimina el uso activo del listado de clubes ficticios externos para ofertas de traspaso.

## Criterio técnico
- No se modifica el sistema de lesiones, sanciones ni duración de indisponibilidad. Sólo se corrige quién queda habilitado para ser seleccionado.
- La reparación de bots sigue siendo conservadora: primero libres reales, luego emergencia si el mercado no alcanza.
- Las ofertas mantienen impuestos y cálculo financiero; cambia el origen para que pertenezca al universo real de clubes cargados.

## Validación
- `node --check` aplicado sobre todos los archivos JS.
- JSON de `data/` parseados correctamente.

## Compatibilidad
Se implementa solo. No requiere reiniciar partida porque no cambia estructura del guardado; afecta futuras selecciones, reparaciones y ofertas.
