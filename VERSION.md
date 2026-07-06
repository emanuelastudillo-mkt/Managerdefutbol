# Versión V3.01

## Objetivo de la versión

Iniciar la Versión 3 separando el antiguo `app.js` monolítico en archivos más mantenibles, sin introducir cambios intencionales de reglas ni de balance.

## Ajustes principales

### Separación de `app.js`
- `app.js` ahora queda como punto de entrada mínimo y ejecuta `init()`.
- La lógica principal fue movida a la carpeta `js/`.
- La carga se mantiene con scripts clásicos en `index.html`, no con ES modules, para conservar compatibilidad simple con GitHub Pages y uso local servido por navegador.

### Nuevos grupos de archivos
- `js/core/01-config-constants.js`: configuración, constantes y estado global.
- `js/core/02-ui-utils.js`: utilidades DOM, avisos, formato y helpers básicos.
- `js/core/03-player-tactics-utils.js`: jugadores, disponibilidad, habilidades, generación, roles y utilidades tácticas.
- `js/data/04-data-storage.js`: carga de JSON, base inicial, normalización y persistencia local.
- `js/game/05-state-season.js`: eventos generales, nueva partida, normalización, temporadas, ascensos y descensos.
- `js/ui/06-render-home-messages.js`: render general, inicio, avance de turno, mensajes y ofertas recibidas.
- `js/ui/07-render-team-market.js`: primer equipo, mercado, plantel, táctica y validación de alineación.
- `js/game/08-sponsors-stadium-stats.js`: sponsors, estadio, fixture, tabla, estadísticas y vistas financieras.
- `js/game/09-simulation-economy-training.js`: simulación de turnos, cohesión, economía, moral, estadio y entrenamiento.
- `js/game/10-academy-employees.js`: academia, captación, juveniles, empleados y tratamientos.
- `js/game/11-match-engine.js`: motor alternativo de partido, goles, tarjetas, lesiones y estadísticas.
- `js/ui/12-modals.js`: modales de jugador, club, compra, partido, scouting y nueva partida.

### Archivos actualizados
- `index.html`: título, etiqueta de versión y nueva carga ordenada de scripts.
- `config.js`: versión interna actualizada a `V3.01`.
- `README.md`: documentación actualizada.
- `VERSION.md`: documento de versión actualizado.
- `CARACTERISTICAS_VERSION.md`: nuevo documento interno de características.

## Validación realizada
- `node --check app.js`: correcto.
- `node --check config.js`: correcto.
- `node --check simulador-2.0.js`: correcto.
- `node --check js/core/*.js`: correcto.
- `node --check js/data/*.js`: correcto.
- `node --check js/game/*.js`: correcto.
- `node --check js/ui/*.js`: correcto.
- `data/jugadores.json`: JSON válido.
- `data/sponsors.json`: JSON válido.
- `data/Liga Argentina.json`: JSON válido.
- Prueba de carga de scripts en contexto controlado: correcta.

## Observaciones de revisión
- La separación realizada es estructural y conservadora. No cambia el comportamiento del juego de forma intencional.
- Todavía hay dependencia global entre archivos. Es aceptable para esta etapa porque evita romper compatibilidad, pero a futuro conviene pasar gradualmente a módulos con export/import.
- Algunas áreas aún mezclan reglas de juego con HTML renderizado. El siguiente paso recomendable sería separar lógica pura y vista dentro de mercado, academia, sponsors y táctica.
- Los nombres numerados de archivos ayudan a conservar el orden de carga mientras el proyecto siga usando scripts clásicos.

## Compatibilidad
- Mantiene partidas guardadas en IndexedDB.
- Mantiene la estructura de datos actual.
- Mantiene el simulador externo `simulador-2.0.js`.
- Mantiene `config.js` como archivo editable central.
