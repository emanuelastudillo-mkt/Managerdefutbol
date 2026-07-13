# Fútbol Manager MVP - V7.04

## V7.04 - Impacto de despedir jugadores

Esta versión parte de V7.03 y conserva el sistema de guardado doble seguro.

### Moral y cohesión al despedir

Al despedir a un jugador del primer equipo se aplican inmediatamente estas consecuencias:

- La moral de cada jugador que permanece en el plantel baja 1 punto.
- La cohesión del club baja 1 punto.
- Los valores respetan sus límites: moral entre 1 y 99, cohesión entre 0 y 100.
- La penalización se ejecuta sólo después de confirmar el despido y completar la salida del jugador.
- No se aplica cuando el despido se cancela o cuando el plantel mínimo impide realizarlo.

Los valores pueden editarse desde `balance-modificadores.js`:

- `moral.perdidaPlantelPorDespedirJugador`
- `cohesion.perdidaPorDespedirJugador`

La moral del jugador despedido no se utiliza para calcular esta penalización: el efecto representa la reacción de los compañeros que continúan en el club.

### Reglas de cohesión vigentes

- Fichar un jugador: -2.
- Vender un jugador: -3.
- Despedir un jugador: -1.
- Ofrecer contrato profesional a un juvenil: +3.

### Código especial

- El código vigente es `PUNTOS20000`.
- Entrega 20.000 puntos de habilidad.
- Puede reclamarse una sola vez por partida.

### Guardado y compatibilidad

- Se conserva el sistema de dos copias introducido en V7.02.
- Carrera 1 mantiene `slot:career:1` y `main`.
- Las demás carreras y el reto mantienen una copia principal y un respaldo propio.
- No se modificó la estructura de los guardados existentes.
- Las nuevas penalizaciones se aplican sólo a despidos realizados después de instalar V7.04.

### Archivos modificados en V7.04

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/retos_manager.json`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/ui/12-modals.js`

### Compatibilidad de partidas

**V7.04 no rompe partidas anteriores.** Las partidas V7.03 y anteriores mantienen presupuesto, planteles, moral, cohesión y progreso. No se recalculan despidos anteriores.
