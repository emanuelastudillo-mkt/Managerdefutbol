# V3.87 - Ranking Online Cloudflare Workers + D1

- Se conectó el menú `Ranking Online` con la API publicada en Cloudflare Workers.
- El envío de resultados ahora usa `POST /ranking` con JSON contra el Worker `rankingdemanagers`.
- La lectura de tabla online ahora usa `GET /ranking?limit=...` y consume la respuesta de D1.
- Se configuró la URL pública `https://rankingdemanagers.emanuelastudillo.workers.dev`.
- Se adaptó la normalización de filas para aceptar campos de Cloudflare/D1 en formato snake_case.
- Se mantiene el cálculo local de puntaje manager antes del envío.
- Se actualizó el cache-busting de los scripts modificados a V3.87.

## Versión anterior

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
