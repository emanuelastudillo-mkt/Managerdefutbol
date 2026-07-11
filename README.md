# Fútbol Manager MVP - V6.02

## V6.02 - División de `data/jugadores.json`

Esta entrega continúa la línea Manager V6 y toma V6.01 como base.

### Cambios principales

- `data/jugadores.json` deja de contener toda la base pesada de jugadores y pasa a funcionar como manifest liviano.
- La base completa de 4.050 jugadores se divide en 9 archivos dentro de `data/jugadores/`, separados por país/liga.
- Se agrega soporte de carga por `playersUrls` en `config.js`, con carga paralela de los chunks.
- Se mantiene compatibilidad con el formato anterior: el loader todavía acepta un `jugadores.json` con `players` directo.
- También se agrega compatibilidad con manifest: si `playersUrl` apunta a un archivo con `files`, el juego puede resolver y cargar los chunks declarados.
- Se actualiza versión visible, caché de scripts/estilos y documentación a V6.02.
- Se elimina del reporte la observación sobre fotos de jugadores manuales no incluidas, ya que esas imágenes existen fuera del ZIP.

### Archivos de jugadores generados

- `data/jugadores/argentina-liga-profesional.json`
- `data/jugadores/argentina-primera-nacional.json`
- `data/jugadores/argentina-federal-a.json`
- `data/jugadores/chile-primera-division-chile.json`
- `data/jugadores/brasil-brasileirao.json`
- `data/jugadores/inglaterra-premier-league.json`
- `data/jugadores/espana-laliga-espana.json`
- `data/jugadores/italia-serie-a-italia.json`
- `data/jugadores/rumania-superliga-rumania.json`

### Validaciones realizadas

- Parseo JSON validado en todos los archivos dentro de `data/`.
- Verificación de cantidad total de jugadores cargables desde chunks: 4.050.
- Verificación de IDs únicos de jugadores: 4.050 IDs únicos.
- Sintaxis JavaScript validada con `node --check`.
- Revisión de referencias de carga para `playersUrl`, `playersUrls` y manifest.

### Instalación

Para instalación limpia, subir todo el contenido del ZIP completo V6.02.

Para actualizar desde V6.01, aplicar el ZIP incremental V6.02 sobre la carpeta existente y forzar recarga con Control + F5. El incremental sobrescribe `data/jugadores.json` con el manifest liviano y agrega la carpeta `data/jugadores/`.

## Historial inmediato

### V6.01 - Revisión exhaustiva y limpieza inicial de Manager V6

- Se abrió la línea Manager V6 tomando como base V5.80.
- Se actualizaron versión visible y caché a V6.01.
- Se eliminaron funciones internas sin referencias detectables por análisis estático.
- Se eliminó el archivo vacío `err` en la versión completa.
- Se corrigió la contradicción de balance de tarjetas y quedó activo `1.10` desde `balance-modificadores.js`.
- Se agregó `REVISION_CODIGO_V6.01.md`.
