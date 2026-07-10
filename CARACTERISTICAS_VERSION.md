# Características de la versión V5.46

## V5.46 - Ojeo progresivo sólo sobre información faltante

### Cambios principales

- El Centro de Ojeo ya no puede gastar avances sobre habilidades visibles o ya conocidas.
- Para jugadores propios, los avances se aplican sólo sobre habilidades ocultas faltantes.
- Para jugadores externos, los avances se aplican sólo sobre información no revelada.
- Los informes de equipo siguen revelando Defensa, Medios y Delantera progresivamente.
- El contador "Días observado" ahora cuenta días reales con departamento de ojeo activo.
- Se agregó `revealCount` para repartir mejor los avances entre varios informes activos.
- Se agregaron `lastObservedDate` y `lastRevealDate` para evitar repeticiones y mejorar la rotación.

### Corrección de bug probable

Si varios jugadores estaban en la lista activa, el sistema podía aparentar bloqueo porque el contador de días sólo subía cuando ese informe recibía una habilidad revelada. Además, la selección de candidato dependía demasiado del conteo de días, lo que podía concentrar avances. También había un problema técnico: cada consulta de informe podía normalizar el estado completo y dejar algunos avances aplicados sobre copias no persistentes del informe.

### Compatibilidad de partida

Se implementa solo. Los informes existentes se normalizan al cargar y conservan habilidades ya reveladas.
