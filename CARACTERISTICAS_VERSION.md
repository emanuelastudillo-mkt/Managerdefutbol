# V4.02 - Ajustes visuales de inicio y estadio

- Se achicó el texto de las tarjetas compactas de clubes disponibles al iniciar partida.
- Se reemplazaron abreviaturas por textos completos: `Estadio`, `Hinchas` y `Prestigio`.
- En `Hinchada y entradas`, se cambió `Hinchas actuales` por `Hinchas Totales`.
- Se cambió `Base` por `Vitalicios`.
- Se cambió `Último cambio` por `Nuevos socios`.
- En `Campo de juego`, se agrandó la línea de nombre del estadio y capacidad.
- No se modificaron motores, simulación, ranking, guardado ni reglas de partida.

## Versiones anteriores

# V4.01 - Ranking automático obligatorio

- Se bloqueó la carga manual de resultados al ranking online.
- El menú `Ranking Online` queda como panel de consulta y estado; ya no muestra botón para subir temporada.
- El ranking se envía automáticamente cuando el manager es despedido.
- El ranking se envía automáticamente cuando se cierra una temporada.
- Se agregó control local de envíos por evento para evitar duplicados por temporada, club y tipo de evento.
- Se registra el estado del envío automático: pendiente, enviado o error.
- Se mantiene la lectura pública de la tabla online con el botón `Actualizar ranking`.

# V4.0 - Auditoría, limpieza y optimización

- Se adopta V4.0 como nueva numeración del proyecto.
- Se sincronizó la versión visible de la interfaz, `VERSION.md`, `config.js` y todos los parámetros de cache-busting en `index.html`.
- Se cambió la carga de JSON a modo cache configurable desde `config.js` con `data.cacheMode`.
- Se paralelizó la carga de jugadores, estadios, hinchas y ligas para reducir espera inicial.
- Si `data/jugadores.json` está disponible, el juego evita crear planteles temporales que luego eran descartados.
- Se mantiene generación automática sólo para clubes sin cobertura en la base de jugadores.
- Se corrigió el banner inicial para no intentar cargar una ruta sin extensión antes del `.jpg`.
- Se corrigen las rutas de escudos argentinos activos para que apunten directo al archivo existente y reduzcan fallbacks/404.
- Se removieron 6 escudos de clubes que ya no están referenciados por ninguna liga activa.
- Se agregó `AUDITORIA_V4.0.md` con detalle de revisión y recomendaciones.

# V3.87 - Ranking Online Cloudflare Workers + D1

- Se conectó el menú `Ranking Online` con la API publicada en Cloudflare Workers.
- El envío de resultados ahora usa `POST /ranking` con JSON contra el Worker `rankingdemanagers`.
- La lectura de tabla online ahora usa `GET /ranking?limit=...` y consume la respuesta de D1.
- Se configuró la URL pública `https://rankingdemanagers.emanuelastudillo.workers.dev`.
- Se adaptó la normalización de filas para aceptar campos de Cloudflare/D1 en formato snake_case.
- Se mantiene el cálculo local de puntaje manager antes del envío.
- Se actualizó el cache-busting de los scripts modificados a V3.87.


# V3.86 - Modo Fundador

- Se agregó el botón `Modo Fundador` en la pantalla inicial.
- El modo fundador permite crear un club propio desde cero.
- El club fundado reemplaza a un club bot de bajo prestigio en la división más baja del país elegido para conservar calendarios de 18 equipos.
- El club propio inicia con 0 jugadores, $0 de presupuesto, estadio de capacidad 0, prestigio 10 y 500 hinchas.
- Los jugadores del club reemplazado pasan al mercado como jugadores libres normales.
- Se refuerza automáticamente el mercado de jugadores libres normales para asegurar disponibilidad mínima por posiciones.
- El club fundado no tiene objetivos de directiva y no puede despedir al manager.
- Se agregó un sistema de metas fundadoras con barra de progreso e importancia.
- Las metas fundadoras se activan en orden y sólo cuentan desde que cada meta queda activa cuando corresponde.
- Las metas incluyen hitos de estadio, victorias, hinchas, ascensos/campeonatos y un bucle progresivo posterior.
