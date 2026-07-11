# Fútbol Manager MVP - V6.05

## V6.05 - Limpieza de backend legacy de ranking

Esta versión toma como base la V6.04 y elimina del paquete el archivo heredado de Google Apps Script para ranking.

### Cambios principales

- Se elimina `apps-script-ranking.gs` de la versión completa.
- El ranking queda documentado como sistema basado en Cloudflare Worker + D1.
- Se mantiene la carga de ranking de carrera agregada en V6.04.
- Se actualiza versión visible, caché de scripts/estilos y documentación a V6.05.

### Nota para actualización incremental

Un ZIP incremental no puede borrar archivos que ya existen en una carpeta del usuario. Si actualizás desde una versión anterior y todavía tenés este archivo en la raíz del proyecto, eliminar manualmente:

```txt
apps-script-ranking.gs
```

La versión completa V6.05 ya no lo incluye.

## Estado funcional heredado de V6.04

- Centro de Ojeo con probabilidad de fichaje visible.
- Avance automático con bloque ON/OFF y color de estado.
- Ranking online de carrera completa del mánager.
- Ranking deduplicado por código estable de partida.
- Base de jugadores dividida en chunks.
- Dificultad competitiva V6.03 activa:
  - adaptación rival por repetir táctica;
  - lesiones largas por sobreuso desde 80% de participación;
  - pérdida progresiva de moral para jugadores disponibles sin minutos.

## Archivos principales

- `index.html`
- `style.css`
- `app.js`
- `config.js`
- `balance-manager.js`
- `balance-modificadores.js`
- `simulador-2.0.js`
- `js/`
- `data/`
- `assets/`
- `img/` si se agregan recursos visuales externos

## Ranking online

El ranking usa el endpoint configurado en `config.js`:

```js
CONFIG.ranking.appsScriptUrl
```

Aunque el nombre interno de la propiedad conserva compatibilidad histórica, actualmente apunta al Worker de Cloudflare:

```txt
https://rankingdemanagers.emanuelastudillo.workers.dev
```

El backend activo esperado es Cloudflare Worker + D1, no Google Apps Script.

## Instalación

Para instalación limpia, subir todo el contenido del ZIP completo V6.05.

Para actualizar desde V6.04, aplicar el ZIP incremental V6.05 sobre la carpeta existente, eliminar `apps-script-ranking.gs` si todavía existe y forzar recarga con Control + F5.
