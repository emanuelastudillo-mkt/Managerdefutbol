# Características V5.00 - Auditoría, limpieza y base de versión 5

## Cambios

- Se adopta V5.00 como nueva base de numeración del Manager de fútbol.
- Se sincronizó la versión visible de `index.html`, `config.js`, `VERSION.md`, `README.md` y los parámetros de cache-busting.
- Se corrigió una regresión: `data.cacheMode` existía en `config.js`, pero la carga JSON seguía forzada a `no-store`. Ahora respeta el modo configurado.
- Se paralelizó la carga inicial de jugadores, estadios, hinchas, ligas, sponsors, empleados, eventos, cartas y relatos.
- Se redujo una petición 404 inicial del banner de bienvenida apuntando directo a `banner_bienvenido.jpg`.
- Se corrigieron 13 rutas de escudos argentinos que no coincidían con los nombres reales de archivo dentro del ZIP.
- Se agregó normalización de rutas antiguas `#U00xx` al cargar partidas guardadas.
- Se actualizó la documentación de auditoría en el README con imágenes huérfanas, contradicciones y oportunidades de optimización.

## Motivo

La versión 5.00 queda como base limpia para próximas entregas. No cambia reglas de partida, economía, calendario ni simulación. Los cambios aplicados son de sincronización, carga inicial y documentación técnica.
