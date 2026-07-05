# Registro de versión

## Versión: V1.20
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** sistema de jugadores, moral y empleados

### Resumen
Esta versión incorpora moral visible de jugadores y un primer menú de empleados. La moral queda separada de la cohesión de equipo: la moral es visible e individual, la cohesión sigue siendo oculta y colectiva.

### Cambios principales agregados
- **Moral de jugador** en escala 1 a 99.
- Barra visual de moral con degradado de **morado a celeste**.
- La moral se muestra en:
  - plantel,
  - táctica,
  - ficha del jugador.
- La moral modifica internamente el rendimiento del jugador.
- Se agregan reglas automáticas de moral post partido:
  - titular suma moral,
  - suplente utilizado suma menos,
  - jugador que no participa pierde moral,
  - ganar mejora a toda la plantilla,
  - perder baja la moral, especialmente de los titulares.
- Nuevo menú lateral: **Empleados**.
- Nueva acción: **Llamar al psicólogo motivacional**.
- Costo de la acción: `$500.000`.
- 90% de probabilidad de éxito.
- 10% de probabilidad de fracaso.
- El valor exacto de mejora de moral por charla exitosa no se muestra en pantalla.
- Se muestra una barra de progreso completada y el resultado de la charla.

### Valores que siguen ocultos
- Cohesión de equipo.
- Valor exacto de mejora generada por el psicólogo.
- Coeficientes internos de impacto de la moral en el rendimiento.

### Pendientes sugeridos
- Agregar más empleados y acciones.
- Agregar preparador físico.
- Agregar cuerpo técnico con rasgos.
- Incorporar instrucciones tácticas según resultado parcial.
- Avanzar hacia simulación por bloques de 15 minutos.
