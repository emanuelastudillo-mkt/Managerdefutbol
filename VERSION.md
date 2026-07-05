# Registro de versión

## Versión: V1.04
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** integración visual con carpetas de imágenes

### Resumen
Esta versión conecta el sistema de jugadores con la carpeta `img/faces/`, asignando automáticamente una cara fija a cada jugador según su nacionalidad y región.

### Cambios principales agregados
- Se agregó soporte para estructura de imágenes:
  - `img/escudos/`
  - `img/faces/`
  - `img/logos/`
  - `img/principales/`
- Cada jugador toma una imagen de `img/faces/` según región:
  - `africa`
  - `America`
  - `Asia`
  - `Europa`
  - `Otros`
- La asignación es fija por ID de jugador, no cambia al recargar la página.
- Se soportan automáticamente estas extensiones:
  - `.png`
  - `.jpg`
  - `.jpeg`
  - `.webp`
- Si la imagen no existe, se muestra el placeholder anterior.
- Las caras se usan en:
  - pantalla de plantel
  - ficha individual del jugador

### Convención de nombres esperada
```txt
img/faces/africa (1) ... africa (10)
img/faces/America (1) ... America (10)
img/faces/Asia (1) ... Asia (10)
img/faces/Europa (1) ... Europa (10)
img/faces/Otros (1) ... Otros (20)
```

Con extensión `.png`, `.jpg`, `.jpeg` o `.webp`.

### Cambios que se mantienen
- Visualización táctica por 5 secciones.
- Círculos por color según línea.
- Estado físico con anillo de 8 segmentos.
- Resaltado de club y jugadores propios.
- Economía básica por resultado.
- Guardado local con IndexedDB.

### Pendientes sugeridos
- Usar `img/escudos/` para escudos reales de clubes.
- Usar `img/logos/` para logo de liga.
- Usar `img/principales/` para imagen contextual del momento del club.
- Crear una pantalla de gestión visual para cambiar manualmente caras, escudos y logos.
