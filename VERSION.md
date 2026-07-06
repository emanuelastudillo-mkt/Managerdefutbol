# Versión V3.06

## Objetivo de la versión

Agregar ordenamiento especial para columnas de posición, respetando el orden deportivo POR, defensores, mediocampistas y delanteros. Se conserva la interacción táctica por clic incorporada en V3.05.

## Ajustes principales

### Ordenamiento de posición
- Se agrega ordenamiento para columnas `POS`/`Pos.`.
- Ascendente: `POR → DEF → MED → DEL`.
- Descendente: `DEL → MED → DEF → POR`.
- Las variantes se agrupan dentro de su familia: defensores, mediocampistas y delanteros.
- Se aplica en `Plantel`, `Entrenamiento` y listado mundial de `Jugadores`.

## Ajustes conservados de V3.05

### Táctica por clic
- Se elimina el uso de drag & drop en la pantalla de táctica.
- Primer click: selecciona un jugador.
- Segundo click: intercambia al jugador seleccionado con otro jugador.
- El intercambio funciona entre titulares, suplentes, reservas y fichas de la pizarra.
- Los puestos vacíos de la pizarra aceptan un jugador seleccionado.
- La selección activa queda resaltada en verde.
- Se mantienen las validaciones existentes de porteros, lesionados, suspendidos y suplentes lesionados.
- Se limpian cambios automáticos inválidos si un intercambio modifica titulares o banco.

## Ajustes conservados de V3.04

### Límites de plantel
- Se incorporó un mínimo configurable de `18` jugadores por plantel.
- Se incorporó un máximo configurable de `42` jugadores por plantel.
- Con `42/42` jugadores ya no se puede fichar ni subir juveniles al primer equipo.
- Con el plantel en mínimo, el juego bloquea despidos, ventas aceptadas y ofrecimientos activos que dejarían al club por debajo del mínimo.
- El tamaño inicial de plantel queda separado en `jugadoresInicialesPorClub`, con valor `25`, para no generar automáticamente 42 jugadores por club.

### Favicon
- Se reemplazó la referencia `favico.png` por `favicon.png`.
- Se agregó `?v=3.04` para forzar actualización de caché del navegador.
- El archivo `favicon.png` debe estar en la carpeta raíz, junto a `index.html`.

### Simulación de partido
- El motor V2.0 pasa de 6 bloques internos de 15 minutos a 30 bloques de 3 minutos.
- Ataques, chances, faltas y xG se escalan por duración de bloque para no inflar resultados.
- La visualización del partido pasa de 6 etapas fijas a 30 fases configurables.
- Se agregaron las claves `fasesSimulacionPartido` y `duracionSimulacionPartidoMs` en `config.js`.
- La duración visual base queda en 30 segundos.

### Balance de goleadores y tarjetas
- Se reforzó el peso de los delanteros en la selección de goleadores.
- Los delanteros centro y extremos ahora tienen más probabilidad relativa de convertir que mediocampistas y defensores.
- El arquero queda prácticamente excluido de la selección normal de goleadores.
- Se redujo fuertemente la probabilidad de tarjetas del arquero.
- El arquero ya no entra en la selección de roja directa.
- Se redujo levemente la frecuencia de rojas directas.



## Ajustes dentro de V3.04

### Cláusulas reducidas
- Se agregó `economia.escalaClausulas: 0.10` en `config.js`.
- Las cláusulas calculadas ahora quedan en una décima parte del valor anterior.
- No se modifican sueldos existentes ni la escala salarial.
- Las cláusulas se recalculan al normalizar jugadores, por lo que el ajuste también impacta en partidas guardadas compatibles.

### Feedback visual de acciones con resultado
- Las acciones de empleados que pueden salir bien o fallar ahora muestran una animación de carga al hacer clic.
- `Tratar` muestra estado de procesamiento y luego resultado verde si fue exitoso o rojo si falló.
- `Llamar al psicólogo motivacional` muestra estado de procesamiento y luego resultado verde o rojo según la charla.
- Se conservan los mensajes existentes de éxito/fallo.
- Se agregaron tiempos configurables en `config.js`: `accionesFeedbackCargaMs` y `accionesFeedbackResultadoMs`.

## Archivos modificados
- `config.js`
- `style.css`
- `js/core/02-ui-utils.js`
- `js/game/10-academy-employees.js`
- `js/game/05-state-season.js`
- `js/ui/07-render-team-market.js`
- `index.html`
- `simulador-2.0.js`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/game/11-match-engine.js`
- `js/ui/06-render-home-messages.js`
- `js/ui/12-modals.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

## Validación realizada
- `node --check` correcto en todos los `.js`.
- `data/jugadores.json`: JSON válido.
- `data/sponsors.json`: JSON válido.
- `data/Liga Argentina.json`: JSON válido.
- Scripts referenciados en `index.html` verificados.

## Compatibilidad
- Compatible con partidas V3.01, V3.02, V3.03 y V3.04.
- No requiere reiniciar partida.
- Si una partida guardada ya supera 42 jugadores, el juego no elimina jugadores automáticamente, pero bloquea nuevas incorporaciones hasta volver a estar por debajo del máximo.
