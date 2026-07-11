# Características de la versión V6.02

## V6.02 - División de base de jugadores

Esta versión toma V6.01 como base y optimiza el archivo más pesado del proyecto: `data/jugadores.json`.

### Cambios aplicados

- `data/jugadores.json` se reemplaza por un manifest liviano.
- Se crean 9 archivos JSON de jugadores dentro de `data/jugadores/`, cada uno con 450 jugadores.
- Se agrega `playersUrls` a `config.js` para cargar los chunks en paralelo.
- Se actualiza `js/core/01-config-constants.js` para exponer `PLAYERS_DATABASE_URLS`.
- Se actualiza `js/data/04-data-storage.js` para aceptar tres formatos:
  - archivo legacy con `players` directo;
  - archivo legacy como array directo;
  - manifest con lista `files`, `playerFiles` o `jugadoresFiles`.
- Se actualiza versión visible/cache a V6.02.
- Se actualiza README y VERSION.
- Se crea `REVISION_CODIGO_V6.02.md`.

### Archivos modificados

- `index.html`
- `app.js`
- `config.js`
- `balance-modificadores.js`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `data/jugadores.json`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`
- `REVISION_CODIGO_V6.02.md`

### Archivos agregados

- `data/jugadores/argentina-liga-profesional.json`
- `data/jugadores/argentina-primera-nacional.json`
- `data/jugadores/argentina-federal-a.json`
- `data/jugadores/chile-primera-division-chile.json`
- `data/jugadores/brasil-brasileirao.json`
- `data/jugadores/inglaterra-premier-league.json`
- `data/jugadores/espana-laliga-espana.json`
- `data/jugadores/italia-serie-a-italia.json`
- `data/jugadores/rumania-superliga-rumania.json`

### Resultado técnico

- `data/jugadores.json` deja de pesar varios MB y queda como índice de carga.
- La carga inicial puede resolver chunks por `playersUrls` o por manifest.
- La base total sigue conservando 4.050 jugadores.
