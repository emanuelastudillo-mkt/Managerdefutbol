# Versión V3.02

## Objetivo de la versión

Mejorar la experiencia visual del juego sin alterar reglas principales ni balance. La intención es que el Inicio funcione más como una oficina del manager y menos como una suma de tarjetas aisladas.

## Ajustes principales

### Oficina del manager
- Nueva vista superior en Inicio con identidad del club, fase actual, posición, cantidad de jugadores, presupuesto y sponsors activos.
- Próximo partido integrado en el mismo bloque visual.
- Botón de avance incorporado al panel principal.

### Alertas visuales accionables
Se agregaron tarjetas de alerta para:
- Táctica incompleta o bloqueada.
- Lesionados.
- Mensajes nuevos.
- Ofertas pendientes por jugadores.
- Ofertas de sponsors disponibles.
- Captación de academia en curso.
- Plantel al límite.
- Presupuesto presionado por masa salarial.

### Resumen del último turno
- El juego guarda un resumen visual después de avanzar jornada, pretemporada o postemporada.
- El resumen muestra resultado, economía, academia, sponsors y alertas deportivas si corresponde.
- Las partidas previas siguen funcionando; si no existe resumen anterior, simplemente no se muestra.

### Favicon
- `index.html` ahora referencia `favico.png`.
- El archivo debe estar en la misma carpeta que `index.html`.

## Archivos modificados
- `index.html`
- `config.js`
- `style.css`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `js/ui/06-render-home-messages.js`
- `js/game/08-sponsors-stadium-stats.js`
- Comentarios de encabezado actualizados en módulos principales.
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

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

## Observaciones de revisión
- Esta versión es visual y de experiencia. No modifica intencionalmente simulación, economía, mercado ni academia.
- Se corrigió una referencia interna de sponsors a `currentClubDivision`, reemplazada por el helper existente `clubDivision`.
- La pantalla Inicio queda más preparada para futuras expansiones: noticias, tareas pendientes, reputación del manager o estado institucional.
- Sigue pendiente una separación más profunda entre lógica pura y HTML de renderizado.

## Compatibilidad
- Compatible con partidas V3.01 guardadas en IndexedDB.
- No requiere cambios en los JSON de datos.
- Mantiene la estructura modular creada en V3.01.
