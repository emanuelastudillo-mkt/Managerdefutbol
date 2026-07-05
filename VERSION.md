# Registro de versión

## Versión: V2.14
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** flujo de temporada y turnos internos

### Resumen
Esta versión corrige el problema de cooldown de la charla motivacional al cambiar de temporada y agrega fases de pretemporada y postemporada para entrenar antes y después de las jornadas oficiales.

### Cambios principales agregados
- Se agrega `globalTurn` como contador interno de turnos.
- Las acciones de empleados ahora guardan temporada, fase, turno interno y jornada.
- La charla motivacional se desbloquea correctamente aunque cambie la temporada.
- Se agrega **pretemporada** de 10 turnos al iniciar una temporada.
- En pretemporada se pueden jugar hasta **5 partidos amistosos** contra cualquier equipo.
- Se agrega **postemporada** de 5 turnos después de la última jornada oficial.
- Los turnos no oficiales aplican entrenamiento y avance semanal sin simular partidos de liga.
- Los amistosos no modifican la tabla ni las estadísticas oficiales.

### Valores mantenidos
- Cooldown de charla motivacional: 5 turnos.
- Costo de charla motivacional: $500.000.
- Entrenamientos actuales sin cambios.
- Cierre de temporada, sueldos, retiros y juveniles libres se ejecutan después de la postemporada.

### Pendientes sugeridos
- Separar visualmente el historial de amistosos y partidos oficiales.
- Agregar premios o riesgos propios para amistosos.
- Agregar calendario específico de pretemporada.
