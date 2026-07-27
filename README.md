# Una vida de manager — V8.66

## Base requerida

Aplicar este incremental sobre **V8.65**.

## Corrección

### Cruce entre versiones antiguas y nuevas de un jugador

- Se corrigió la coexistencia entre la ficha actualizada de un jugador especial y copias antiguas almacenadas en el mercado de pases.
- El nombre, la posición, la nacionalidad, la media y las habilidades toman siempre la versión vigente de `jugadores_manuales.json`.
- El estado dinámico de la carrera se conserva: edad, club actual, condición de agente libre, venta, retiro y estado de transferencia.
- Las copias repetidas con el mismo ID se consolidan automáticamente en un único jugador.
- La corrección también alcanza a identidades guardadas en el pool de retirados, jugadores históricos reciclados y registros estadísticos del manager.
- Las partidas afectadas se reparan al cargarse y se vuelven a guardar automáticamente.

### Caché de la lista de jugadores

- `jugadores_manuales.json` dejó de utilizar una versión fija `v=8.60`.
- Desde esta versión, la URL recibe automáticamente la versión actual del juego, evitando que el navegador mezcle archivos antiguos y nuevos.

## Compatibilidad

- Compatible con partidas existentes de V8.65.
- No reinicia temporadas, planteles, transferencias ni estadísticas.
- No requiere cambios de Worker, SQL ni recursos gráficos.

## Archivos modificados

- `config.js`
- `index.html`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/ui/06-render-home-messages.js`
