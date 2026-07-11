# Fútbol Manager MVP - V6.06

## V6.06 - Botón de ayuda y guía de interfaz

Esta versión toma como base la V6.05 y agrega una ayuda integrada en la barra superior para orientar al jugador dentro de una interfaz con pocas imágenes y mucha información de gestión.

### Cambios principales

- Se agrega botón **Ayuda** arriba de todo, ubicado a la izquierda de Guardar, Cargar y Renunciar.
- El botón abre una ventana modal con una guía breve por jerarquía de uso.
- La guía resume los menús laterales según importancia:
  - Inicio, Primer Equipo y Mensajes como revisión principal.
  - Mercado, Ojeo, Academia y Empleados como gestión de plantel y crecimiento.
  - Finanzas, Estadio, Calendario y Tabla como contexto del club.
  - Estadísticas, Tus estadísticas, Ranking Online y ESPECIAL como seguimiento y sistemas avanzados.
- Se explica el uso de Guardar, Cargar, Renunciar y Avance automático.
- La guía evita detallar fórmulas internas o valores exactos; está pensada como orientación funcional.
- Desde la ayuda se puede saltar a las secciones principales cuando hay una partida activa.

## Estado funcional heredado

- Ranking online activo mediante Cloudflare Worker + D1.
- El archivo `apps-script-ranking.gs` ya no forma parte de la versión completa.
- Centro de Ojeo con probabilidad de fichaje visible.
- Avance automático con bloque ON/OFF y color de estado.
- Ranking online de carrera completa del mánager.
- Ranking deduplicado por código estable de partida.
- Base de jugadores dividida en chunks.
- Dificultad competitiva V6.03 activa:
  - adaptación rival por repetir táctica;
  - lesiones largas por sobreuso;
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

Aunque el nombre interno conserva compatibilidad histórica, actualmente apunta al Worker de Cloudflare:

```txt
https://rankingdemanagers.emanuelastudillo.workers.dev
```

El backend activo esperado es Cloudflare Worker + D1, no Google Apps Script.

## Instalación

Para instalación limpia, subir todo el contenido del ZIP completo V6.06.

Para actualizar desde V6.05, aplicar el ZIP incremental V6.06 sobre la carpeta existente y forzar recarga con Control + F5.

Si se actualiza desde una versión anterior a V6.05 y todavía existe `apps-script-ranking.gs`, eliminarlo manualmente.
