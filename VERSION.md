# Versión V2.34

## Ajustes principales

### Configuración externa
- Nuevo archivo `config.js`.
- Permite editar valores generales sin tocar `app.js`.
- Incluye parámetros de turnos, transición, plantel, economía, sponsors, estadio, empleados, academia y lesiones.

### Limpieza y semántica
- Se incorporaron helpers de lectura de configuración: `configValue` y `configNumber`.
- Se centralizó la duración de avisos y transición.
- Se eliminó una constante duplicada de formaciones visuales que no estaba en uso.
- Se incorporaron helpers para límite de plantel: conteo de plantel, transferencias pendientes y espacio disponible.

### Plantel
- El máximo de jugadores por club queda configurable desde `config.js`.
- La contratación de libres, compras y promoción de juveniles revisan ese límite.

### Validación realizada
- `node --check app.js`: correcto.
- `node --check config.js`: correcto.
- `node --check simulador-2.0.js`: correcto.
- `data/jugadores.json`: JSON válido.
- `data/sponsors.json`: JSON válido.
- `data/Liga Argentina.json`: JSON válido.
- Base de jugadores: 1500 activos iniciales, 7 elite 92-99.
- Base de sponsors: 200 sponsors y 20 lugares.

## Observaciones de revisión
- El archivo `app.js` ya es grande. La mejora clara siguiente sería separar módulos: mercado, academia, sponsors, tácticas, renderizado y persistencia.
- Hay varias reglas de juego mezcladas con renderizado HTML. Funciona, pero a futuro conviene separar lógica y vista.
- El límite de plantel ahora se controla en acciones nuevas. Las partidas viejas con planteles ya excedidos no se corrigen automáticamente.

## Compatibilidad
- Mantiene guardado local por navegador.
- Mantiene `data/jugadores.json`.
- Mantiene `data/sponsors.json`.
- No incluye `assets/pitch-board.png`.
