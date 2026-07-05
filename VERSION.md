# Registro de versión

## Versión: V1.06
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** scouting, navegación y detalle de jornada

### Resumen
Esta versión agrega clubes clickeables, scouting parcial de plantillas rivales y un detalle de partido más completo con datos contextuales provisorios.

### Cambios principales agregados
- **Detalle de partido ampliado**:
  - estadísticas en 2 columnas, una por equipo
  - clima del partido
  - estado del campo de juego
  - cantidad de hinchas locales
  - cantidad de hinchas visitantes
- **Clubes clickeables** desde tabla, calendario, próximos partidos y detalle de partido.
- **Modal de club** con:
  - datos generales
  - plantilla observada
  - táctica estimada
  - sin revelar quiénes son titulares
- **Scouting parcial de jugadores**:
  - por cada jugador se muestran sólo 2 o 3 habilidades visibles
  - el resto se reemplaza con guion
  - las habilidades reveladas cambian en cada nueva jornada
- Se mantiene el enfoque de exploración: el usuario debe revisar varias jornadas para conocer mejor a un jugador rival.

### Cambios que se mantienen
- Filtros de plantel.
- Requisitos mínimos de club.
- Pizarra táctica con arrastre manual.
- Penalización por jugador fuera de zona.
- Estado físico y anillo de cansancio.
- Stats especiales de portero.
- Caras por región desde `img/faces/`.
- Economía por resultado.
- Bloqueo de avance por 2 minutos.
- Guardado local con IndexedDB.

### Pendientes sugeridos
- Scouting persistente acumulativo.
- Informes de ojeadores.
- Staff técnico.
- Mercado de pases.
- Historial completo de partidos y asistencia.
- Objetivos institucionales.
