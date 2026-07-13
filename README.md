# Fútbol Manager MVP - V7.03

## V7.03 - Cohesión por movimientos de plantel y código PUNTOS20000

Esta versión parte de V7.02 y conserva el sistema de guardado doble seguro.

### Cohesión del plantel

Los movimientos efectivos del primer equipo ahora modifican la cohesión:

- Fichar un jugador reduce 2 puntos de cohesión.
- Vender un jugador reduce 3 puntos de cohesión.
- Ofrecer contrato profesional a un juvenil aumenta 3 puntos de cohesión.
- Vender 2 jugadores y fichar 2 jugadores produce una variación total de -10 puntos.
- La cohesión continúa limitada al rango de 0 a 100.

La penalización por fichaje se aplica cuando el jugador se incorpora realmente al plantel:

- Los agentes libres la aplican al aceptar e incorporarse inmediatamente.
- Los jugadores comprados la aplican al llegar al club el domingo correspondiente.
- Una oferta rechazada o una transferencia todavía pendiente no modifica la cohesión.

La penalización por venta se aplica cuando la operación se completa y el jugador deja el club. También se aplica cuando una cláusula especial termina en venta forzada.

La promoción desde Academia utiliza su regla propia de +3 y no se considera un fichaje externo, por lo que no recibe la penalización de -2.

Los valores se pueden editar desde el bloque `cohesion` de `balance-modificadores.js`:

- `perdidaPorFichaje`
- `perdidaPorVenta`
- `gananciaPorContratoProfesionalJuvenil`

### Código especial

- El código anterior de puntos fue reemplazado por `PUNTOS20000`.
- El beneficio fue ajustado para entregar 20.000 puntos de habilidad, coincidiendo con el nombre del código.
- El código continúa pudiéndose reclamar una sola vez por partida.

### Guardado y compatibilidad

- Se conserva el sistema de dos copias introducido en V7.02.
- Carrera 1 mantiene `slot:career:1` y `main`.
- Las demás carreras y el reto mantienen una copia principal y un respaldo propio.
- No se modificó la estructura de los guardados existentes.
- Las nuevas reglas de cohesión comienzan a aplicarse únicamente a movimientos realizados después de instalar V7.03.

### Archivos modificados en V7.03

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/retos_manager.json`
- `js/core/01-config-constants.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/10-academy-employees.js`
- `js/ui/06-render-home-messages.js`
- `js/ui/07-render-team-market.js`
- `js/ui/12-modals.js`

### Compatibilidad de partidas

**V7.03 no rompe partidas anteriores.** Las partidas V7.02 y anteriores mantienen presupuesto, planteles, cohesión y progreso. No se recalculan transferencias históricas ni promociones juveniles ya realizadas.
