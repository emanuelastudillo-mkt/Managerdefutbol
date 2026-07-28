# V8.84 · Recuperación integral del calendario

Aplicar sobre una instalación V8.83.

## Cambios

- Auditoría automática del calendario contra el fixture canónico de cada liga.
- Comparación entre fecha actual, fixtures guardados e historial de partidos jugados.
- Reconstrucción de partidos de liga que desaparecieron del calendario.
- Recuperación de rondas programadas de copas nacionales y supercopas cuando sus fixtures faltan.
- Restauración de resultados ya jugados desde `matchHistory`, sin volver a simularlos.
- Eliminación segura de fixtures duplicados, conservando la versión jugada o más completa.
- Reprogramación de partidos vencidos, sin fecha o saltados en el primer martes disponible.
- Un club nunca recibe dos partidos el mismo martes; los conflictos pasan al martes siguiente.
- Segunda pasada de control: la auditoría no termina mientras quede un partido pendiente con fecha anterior a la fecha actual.
- Corrección automática de `matchdayIndex` después de reconstruir y ordenar el calendario.
- Ejecución al cargar la partida, antes y después de avanzar, en verificaciones programadas y antes de cerrar la temporada.
- Registro persistente de cada reparación en `calendarIntegrityLog`.

## Compatibilidad

Las partidas iniciadas se migran automáticamente. No se alteran marcadores ya jugados, tablas, goleadores ni estadísticas existentes. Los partidos realmente faltantes se agregan como pendientes y se disputan en martes.
