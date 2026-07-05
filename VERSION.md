# Registro de versión

## Versión: V1.16
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** gestión de estadio y campo de juego

### Resumen
Esta versión incorpora un módulo de estadio con estado dinámico del campo de juego, deterioro por partidos y acciones de mantenimiento pagas.

### Cambios principales agregados
- Nuevo menú lateral **Estadio**.
- Cada club comienza con una condición de campo aleatoria entre **60 y 80**.
- Escala de campo implementada:
  - Excelente: 90 a 100
  - Normal: 60 a 89
  - Regular: 40 a 59
  - Muy malo: 20 a 39
  - Injugable: 1 a 19
- Cada partido jugado como local baja el campo entre **5 y 8 puntos**.
- El estado del campo ahora se calcula por puntaje y afecta el partido:
  - Excelente: +10 en pase y 20% más ocasiones.
  - Normal: sin cambios.
  - Regular: -10 en pase y 20% menos ocasiones.
  - Muy malo: -20 en pase, 30% menos ocasiones, +10 cansancio y +10% lesión.
  - Injugable: -50 en pase, 50% menos ocasiones, +20 cansancio y +30% lesión.
- Acción **Replantar todo**:
  - costo $2.000.000
  - dura 5 turnos
  - durante el proceso el campo queda en estado muy malo
  - al finalizar sube a 99
- Acción **Regar y parchar campo de juego**:
  - costo $200.000
  - dura 3 turnos
  - mejora 5 puntos por turno
  - mejora total de 15 puntos
- Las acciones descuentan el costo directamente del presupuesto.
- Se muestran barras de estado y progreso en el módulo Estadio.

### Pendientes sugeridos
- Agregar capacidad del estadio.
- Agregar venta de entradas y recaudación por asistencia.
- Agregar mejoras estructurales permanentes del estadio.
- Agregar riesgo de suspensión de partido si el campo está injugable.
