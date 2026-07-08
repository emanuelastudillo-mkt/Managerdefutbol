# V3.80 - Bloqueo de recontratación y taquilla por rival

- Al renunciar o ser despedido, el club anterior bloquea al manager durante 1 temporada configurable.
- El bloqueo impide volver inmediatamente al mismo club desde Buscar club, aunque el prestigio del manager alcance el requisito.
- La búsqueda de club muestra el motivo del bloqueo y la temporada hasta la que dura.
- Se agrega `manager.temporadasBloqueoRecontratacion` en `config.js`.
- La recaudación por entradas ahora aumenta según el prestigio del rival.
- El bonus de asistencia por rival prestigioso es configurable desde `config.js`:
  - `estadio.bonusAsistenciaPrestigioRivalMaximo`.
  - `estadio.bonusAsistenciaPrestigioRivalDesde`.
  - `estadio.bonusAsistenciaPrestigioRivalVisitante`.
- Los resúmenes y modales de partido muestran el bonus de atracción del rival cuando corresponde.
