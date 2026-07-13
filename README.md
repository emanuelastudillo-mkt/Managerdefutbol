# Fútbol Manager MVP - V7.06

## V7.06 - Ranking de carrera completo y Worker D1 compatible

Esta versión parte de V7.05 y conserva el sistema de guardado doble seguro, la economía anual por reputación de liga y la corrección de overrides del Mundial de Clubes.

### Ranking online

Se corrigió el envío, lectura y presentación del ranking de carreras.

- **Índice carrera:** reemplaza visualmente a “Puntaje”. Combina puntos deportivos, diferencia de gol, títulos, prestigio, porcentaje de victorias, temporadas y rendimiento presupuestario.
- **Pts. deportivos:** reemplaza visualmente a “Pts”. Son los puntos acumulados por resultados oficiales: 3 por victoria y 1 por empate.
- Se guardan y muestran el club actual, la división, las temporadas, los partidos, la mejor posición, G-E-P, diferencia de gol, títulos y presupuestos.
- La mejor posición acepta los campos `best_position`, `final_position` y sus aliases anteriores.
- Los títulos aceptan tanto `titles` como el campo antiguo `title`.
- Cuando existen varias filas de una misma partida, se conserva la carga más reciente. Ya no se conserva una fila antigua sólo porque tenía un índice mayor.

### Presupuestos

- El presupuesto final y la variación admiten números negativos.
- Se agregó `careerInitialBudget` para conservar el presupuesto real con el que comenzó la carrera.
- Las partidas antiguas reconstruyen ese valor usando el inicio de la primera temporada disponible.
- El cambio evita que una carrera con crecimiento económico muestre incorrectamente `+$0` por tomar el presupuesto actual como presupuesto inicial.
- Al producirse un despido, el ranking utiliza la instantánea tomada antes de reiniciar la economía del club saliente. El presupuesto final ya no se reemplaza por cero.

### Títulos oficiales

El contador de títulos ahora utiliza un historial identificable por temporada y competición.

Cuenta:

- Campeonatos de liga.
- Mundial de Clubes.
- Futuras competiciones oficiales registradas en el historial de campeones.

No cuenta un ascenso como título salvo que el club también haya sido campeón de su división.

Las partidas anteriores reconstruyen los campeonatos de liga desde `managerStats.seasons` y los títulos internacionales desde `competitionChampionsHistory` cuando el club campeón era el dirigido por el manager.

### Worker Cloudflare y D1

Se agregó la carpeta `cloudflare-ranking` con:

- `worker-v7.06.js`: Worker completo con login, sesiones, carga y lectura de carreras.
- `migracion-d1-v7.06.sql`: creación segura de las tablas V2.
- `PASOS-ACTUALIZACION.md`: procedimiento de actualización en Cloudflare.

El Worker:

- No elimina las tablas anteriores.
- Intenta importar automáticamente usuarios y registros existentes.
- Actualiza una carrera por usuario y código de partida.
- Conserva presupuestos negativos.
- Separa `manager_score` de `match_points`.
- Devuelve todos los campos que necesita la tabla del juego.

El binding D1 debe llamarse `DB`.

### Guardado y migración local

Se mantiene el sistema de dos copias:

- Carrera 1: `slot:career:1` y `main`.
- Otros slots: copia principal y respaldo dedicado.

La migración de títulos y presupuesto inicial se realiza al cargar y marca la partida para autoguardado sólo cuando encuentra información que debe reconstruir.

### Archivos principales modificados en V7.06

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/retos_manager.json`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/13-ranking-online.js`
- `cloudflare-ranking/worker-v7.06.js`
- `cloudflare-ranking/migracion-d1-v7.06.sql`
- `cloudflare-ranking/PASOS-ACTUALIZACION.md`

### Compatibilidad de partidas

**V7.06 no rompe partidas anteriores.** Conserva planteles, calendarios, presupuestos, historial y progreso. Agrega campos de migración para el presupuesto inicial y el historial de títulos. El Worker nuevo utiliza tablas V2 y no borra las tablas anteriores.
