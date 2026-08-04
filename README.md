# V9.66 · Verificador de copas nacionales por fase

Esta versión parte de V9.65 y corrige la ausencia del sorteo de la fase previa de Copa Chile. También incorpora un sistema de checkpoints para todas las copas nacionales.

## Cambios principales

- Recuperación automática de sorteos y fases previas que no fueron generados.
- Una copa que superó la fecha prevista ya no queda descartada de forma definitiva.
- Cada competición conserva una lista de checkpoints por fase.
- Una fase marcada como `OK` no vuelve a verificarse mientras mantenga la misma estructura.
- Cuando todos los partidos de una fase terminan, se habilita un nuevo control para la fase siguiente.
- Se muestran los estados de verificación dentro de Copas nacionales.
- La reparación se ejecuta al cargar la partida, durante el avance diario y en las auditorías generales del calendario.

Ver `AJUSTES-V9.66.md`.
