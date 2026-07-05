# Registro de versión

## Versión: V2.18
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** generación económica y demográfica de jugadores

### Resumen
Esta versión adapta lo esencial de las instrucciones de creación de jugadores V1.02 para la base inicial y para los juveniles libres que aparecen al cambiar de temporada.

### Cambios principales agregados
- Reglas de nacionalidad ponderada:
  - 70% Argentina.
  - 20% Sudamérica.
  - 10% resto del mundo.
- Reglas de posición compatibles con la pizarra actual:
  - POR.
  - LD, LI, DFC.
  - MCD, MC, MCO.
  - ED, EI, DC.
- `EXT` ya no se genera como posición nueva.
- Si un dato viejo trae `EXT`, se normaliza automáticamente.
- Distribución de media general por rangos:
  - 92 a 99.
  - 80 a 91.
  - 68 a 79.
  - 43 a 67.
  - 19 a 42.
- Sueldo anual inicial según media y rango.
- Cláusula de rescisión calculada por sueldo, edad y división.
- Cláusula mínima: 6 veces el sueldo anual.
- Auditoría interna de proporciones para orientar la creación de nuevos jugadores.
- Juveniles libres entre 17 y 23 años generados con las mismas reglas, pero con sueldo reducido.
- Los juveniles de cambio de temporada compensan retiros manteniendo el mínimo de generación ya existente.
- Recalculo de cláusulas al iniciar una nueva temporada.

### Pendientes sugeridos
- Agregar informe visual de auditoría de proporciones.
- Separar valor de mercado y cláusula de rescisión como conceptos independientes.
- Agregar costo de scouting para revelar más estadísticas en la vista mundial.
