# Registro de versión

## Versión: V2.10
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** ajuste visual de inicio de partida

### Resumen
Esta versión reemplaza el placeholder inicial del panel principal por un banner de bienvenida cuando el club todavía no jugó partidos.

### Cambios principales agregados
- Si no existe último partido del club seleccionado, el bloque **Momento del club** intenta mostrar `img/principales/banner_bienvenido`.
- Si esa ruta no existe, se prueba automáticamente `img/principales/banner_bienvenido.jpg`.
- Los banners posteriores al primer partido siguen usando la lógica ya definida por resultado y lesiones.

### Pendientes sugeridos
- Confirmar el nombre/extensión final del archivo de bienvenida en `img/principales/`.
- Agregar variantes de bienvenida por división o prestigio del club.
