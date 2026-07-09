# V4.11 - Optimización de libres y relato de partido

## Cambios principales

- Mercado de jugadores libres limitado a 300 jugadores como máximo duro.
- Las partidas ya guardadas con más de 300 libres se limpian automáticamente al cargar.
- Se elimina la generación masiva de juveniles libres por club al cambiar de temporada.
- La renovación del mercado libre respeta el máximo y prioriza conservar mejores jugadores.
- Los jugadores libres ahora pueden rechazar ofertas.
- La probabilidad de aceptar equivale al prestigio actual del club.
- Si el jugador rechaza, queda bloqueado para ese club hasta la próxima temporada.
- La pantalla de Mercado muestra la probabilidad base de aceptación.
- El partido ahora tiene 90 fases de relato.
- Cada fase dura al menos 3 segundos.
- El texto del relato se achicó y aparece con animación.

## Archivos modificados

- `index.html`
- `config.js`
- `VERSION.md`
- `README.md`
- `CARACTERISTICAS_VERSION.md`
- `style.css`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/ui/07-render-team-market.js`
- `js/ui/12-modals.js`

## Validaciones

- Sintaxis validada en `config.js`.
- Sintaxis validada en todos los archivos `.js`.
- Prueba lógica del recorte de mercado libre a 300 jugadores.
- Prueba lógica de aceptación/rechazo por prestigio del club.
