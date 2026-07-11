# Características de la versión V6.05

## V6.05 - Limpieza de backend legacy de ranking

### Objetivo

Eliminar del proyecto el archivo heredado de Google Apps Script para evitar confusión con la implementación actual de ranking online basada en Cloudflare Worker + D1.

### Cambios

- Se elimina `apps-script-ranking.gs` de la versión completa.
- Se documenta que el ranking activo usa Cloudflare Worker + D1.
- Se conserva la lógica V6.04 de ranking de carrera completa.
- Se mantiene deduplicación por código estable de partida.
- Se actualizan versión visible y caché a V6.05.

### Nota de incremental

El incremental incluye `ELIMINAR_ARCHIVOS_V6.05.txt` porque descomprimir un ZIP incremental encima de una carpeta existente no borra archivos viejos.

Archivo a borrar manualmente si todavía existe:

```txt
apps-script-ranking.gs
```

### Validaciones

- Sintaxis JS validada con `node --check`.
- JSON de `data/` parseados correctamente.
- Verificado que la versión completa V6.05 no contiene `apps-script-ranking.gs`.
