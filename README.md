# V8.93 · Revisión integral y consolidación técnica

## Tipo de entrega

Versión completa sin imágenes, construida sobre V8.92.

## Cambios de V8.93

- Revisión de sintaxis y carga de los 57 archivos JavaScript.
- Validación de 42 JSON y manifiestos.
- Comprobación de la base cargada: 162 clubes y 4.150 jugadores, sin IDs duplicados ni referencias de club inválidas.
- Prueba de creación de carrera y carga de las secciones principales.
- Prueba funcional de los convenios de hotel, transporte, concentraciones y oficina de prensa/marketing.
- Manejo seguro de errores al guardar el estado de los servicios del club.
- Las recuperaciones de viaje sólo se marcan como procesadas cuando existe un convenio aplicable.
- Corrección de redacción en los informes de actividades con hinchas.
- Incorporación de `type="button"` en los botones estáticos del documento principal.
- Eliminación de `styles/100-visual-refresh-v854.css`, reemplazado y no utilizado desde V8.55.
- Actualización de versión y cache-busting a V8.93.

## Compatibilidad

Compatible con partidas de V8.92. No se modificó el esquema de guardado ni el balance de los sistemas existentes.

## Imágenes

Esta entrega no incluye archivos de imagen. Las rutas visuales permanecen preparadas para funcionar cuando se publiquen las carpetas de imágenes correspondientes.

## Base funcional incorporada desde V8.92

# V8.92 · Convenios y servicios del club

## Aplicación
Aplicar sobre **V8.91**.

## Nuevas funciones

### Convenio con hotel
Tres niveles con costo mensual variable según la masa salarial del plantel. Se activa después de partidos como visitante o en estadio neutral y mejora recuperación, moral o cohesión según el nivel contratado.

### Convenio de transporte
Tres niveles que representan combis y micros, transporte ejecutivo y viajes privados. Se combina con el hotel, con límites para que la recuperación no elimine el desgaste normal de los partidos.

### Concentraciones especiales
Tres acciones puntuales disponibles únicamente en días sin partido:
- Historia e identidad del club.
- Día de campo con familias.
- Concentración cerrada.

Reemplazan el entrenamiento del día. Tienen límites por temporada y tiempos de espera.

### Oficina de prensa y marketing
Cuatro niveles: pequeña, mediana, grande y mundial. Organiza automáticamente actividades con hinchas en días sin partido y lejos del próximo encuentro. Aumenta hinchas y puede mejorar moral, confianza o cohesión, pero siempre genera pérdida de estado físico en los participantes.

## Balance
- Todos los costos fueron triplicados respecto de la propuesta inicial.
- Los efectos se muestran con categorías cualitativas: ganancia o pérdida pequeña, normal, alta o muy alta.
- Los valores internos permanecen moderados y aplican rendimientos decrecientes cerca de los máximos.
- Los contratos duran hasta el final de la temporada.
- La cancelación anticipada cuesta dos mensualidades.
- Sólo puede existir un convenio activo por categoría.

