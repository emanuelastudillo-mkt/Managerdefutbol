# Fútbol Manager MVP - V6.07

## V6.07 - Probabilidad de fichaje como dato de ojeo

Esta versión toma como base la V6.06 y ajusta la información de mercado revelada por el Centro de Ojeo.

### Cambios principales

- La probabilidad de ser fichado ya no se muestra automáticamente.
- Ahora funciona como una habilidad/dato de ojeo.
- En el Centro de Ojeo aparece dentro del bloque de Mercado del informe del jugador.
- Hasta que se revela, figura como dato pendiente u oculto.
- En Mercado, donde antes decía `Interés oculto`, ahora se muestra la probabilidad sólo si ese dato fue revelado por ojeo.
- Los informes guardados también respetan esta regla: muestran `Oculto` hasta que el dato esté descubierto.

### Base acumulada

- V6.02: división de `data/jugadores` en chunks.
- V6.03: dificultad competitiva, adaptación rival, lesiones por sobreuso y moral por falta de minutos.
- V6.04: ojeo, avance automático y ranking de carrera.
- V6.05: eliminación de `apps-script-ranking.gs`.
- V6.06: botón Ayuda y guía de interfaz.

### Instalación

Para instalación limpia, subir todo el contenido del ZIP completo V6.07.

Para actualizar desde V6.06, aplicar el ZIP incremental V6.07 sobre la carpeta existente y forzar recarga con Control + F5.

Si se actualiza desde una versión anterior a V6.05 y todavía existe `apps-script-ranking.gs`, eliminarlo manualmente.
