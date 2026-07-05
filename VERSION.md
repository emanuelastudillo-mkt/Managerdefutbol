# Registro de versión

## Versión: V2.19
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** base inicial fija de jugadores + persistencia local de modificaciones

### Resumen
Esta versión crea una base inicial real del juego en `data/jugadores.json`, validada contra las proporciones definidas para nacionalidad, posición y media general. La generación aleatoria inicial deja de ser la fuente principal si el archivo existe.

### Cambios principales agregados
- Nuevo archivo `data/jugadores.json` con 1.500 jugadores ficticios.
- Distribución validada de nacionalidades:
  - 1.050 argentinos.
  - 300 sudamericanos no argentinos.
  - 150 resto del mundo.
- Distribución validada de puestos:
  - 150 POR.
  - 450 defensores.
  - 450 mediocampistas.
  - 450 atacantes.
- Distribución validada de medias:
  - 45 jugadores de 92 a 99.
  - 105 jugadores de 80 a 91.
  - 330 jugadores de 68 a 79.
  - 750 jugadores de 43 a 67.
  - 270 jugadores de 19 a 42.
- Control por división para evitar exceso de medias altas en ligas menores.
- El juego carga la base desde `data/jugadores.json` cuando está disponible.
- Si no existe el archivo, conserva el sistema de generación anterior como respaldo.
- Se guarda una copia local del estado de jugadores dentro de la partida en IndexedDB.
- Las modificaciones posteriores ya no dependen únicamente del archivo inicial: quedan guardadas en el navegador.

### Validación incluida en JSON
El archivo `data/jugadores.json` contiene un bloque `validation` con conteos esperados y conteos reales.

### Pendientes sugeridos
- Crear pantalla interna de auditoría para ver distribución real durante la partida.
- Agregar exportación/importación de partida completa.
- Agregar control visual de cuántos jugadores de cada rango hay por división.
