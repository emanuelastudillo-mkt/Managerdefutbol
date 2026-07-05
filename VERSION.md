# Registro de versión

## Versión: V2.4
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** entrenamiento individual y simplificación táctica

### Resumen
Esta versión agrega una nueva sección de entrenamiento para administrar el trabajo específico de cada jugador y simplifica las opciones de cambios automáticos para que sean más claras durante la configuración táctica.

### Cambios principales agregados
- Nuevo menú lateral **Entrenamiento**.
- Tabla de entrenamiento con todo el plantel.
- Selector individual de entrenamiento por jugador.
- Entrenamientos disponibles:
  - **Regenerativo:** mejora estado físico cada turno.
  - **Masajista:** mejora estado físico y moral.
  - **Entrenamiento intenso:** puede mejorar una habilidad clave o común, pero reduce estado físico y moral.
  - **Entrenamiento táctico:** puede mejorar la cohesión total del equipo.
  - **Día libre:** mejora estado físico y moral.
- Guardado local de la planificación de entrenamiento.
- Guardado local de mejoras de habilidades mediante entrenamiento intenso.
- Las mejoras de habilidad influyen en la media visible y en el simulador.
- Opciones de cambios automáticos simplificadas:
  - **Cambiar a los cansados**.
  - **Mejores suplentes**.
  - **Solo cambios por lesión**.
- Los cambios antiguos por situación de partido se migran a opciones simples al cargar una partida existente.

### Pendientes sugeridos
- Separar entrenamiento por grupos de trabajo.
- Agregar historial de entrenamientos recientes.
- Balancear cuánto impacta el entrenamiento táctico en cohesión.
- Evaluar costos o límite semanal para masajista y día libre.
