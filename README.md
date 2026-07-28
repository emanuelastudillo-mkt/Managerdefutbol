# V8.86 · Auditoría de conflictos y orden de ejecución

Aplicar sobre una instalación V8.85.

## Conflictos corregidos

- Se centralizó la liquidación de transferencias con derechos económicos del mánager. El club vendedor ya no puede recibir primero su porción y luego volver a recibir el neto completo.
- La transición de contratos de jugadores se ejecuta únicamente después de confirmar que la temporada avanzó realmente.
- Los contratos vencidos se identifican antes de normalizar la nueva temporada, evitando renovaciones accidentales por migración.
- Las opciones especiales de `startNextSeason`, incluido `allowDirectClubChange`, ahora atraviesan todas las capas de contratos y objetivos ocultos.
- El verificador legado del calendario se ejecuta antes de la auditoría unificada. La auditoría V8.85/V8.86 queda como última autoridad y sus reparaciones no pueden ser sobrescritas después.
- Las decisiones pendientes de carrera sólo se cierran cuando el cierre de temporada fue confirmado. Un intento rechazado ya no cancela eventos activos.

## Auditoría estructural

- Se revisaron las extensiones encadenadas de `startNextSeason`, `finalizeSeasonIfNeeded`, `processDailyCalendarState`, `processPendingTransfers`, `continueCareerAtClub`, `normalizeGame` y renderizados principales.
- Se comprobó que cada wrapper crítico invoque una sola vez a su implementación anterior por ruta de ejecución.
- Se revisaron listeners del botón Avanzar: las dos rutas detectadas corresponden a estados excluyentes —con club y sin club— y no se duplican en una misma pantalla.
- Se revisó el cierre de decisiones al cambiar de club: `ceExpireDecisions()` ya realiza esa tarea; no se agregó una segunda clausura para evitar efectos duplicados.
- No se agregaron bloqueos globales de reentrada que pudieran impedir llamadas legítimas entre módulos.

## Compatibilidad

Compatible con partidas V8.85 iniciadas. No modifica resultados, calendario, contratos o cajas por sí mismo al cargar; sólo evita dobles efectos y transiciones ejecutadas fuera de orden.
