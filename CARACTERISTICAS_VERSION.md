# V4.17 - Simulación previa y playoffs visibles por liga

## Cambios

- Se ajusta el flujo de `Ir a próximo partido`.
- Antes de abrir/simular el partido propio, se simulan los partidos bot del mismo día o pendientes hasta esa fecha.
- Esto deja el partido del manager más aislado y con menor carga simultánea.
- `Avanzar día` también puede procesar partidos bot del día del partido propio antes de bloquear por partido pendiente.
- En el calendario, los playoffs argentinos ya no se muestran como fecha 35 y fecha 36.
- Ahora figuran como `Playoffs IDA` y `Playoffs VUELTA`.
- Los partidos de promoción se visualizan en las dos ligas implicadas.
- El cruce es el mismo partido aunque aparezca en Primera y Segunda, o en Segunda y Tercera.
- En el global, asciende quien haga más goles entre ida y vuelta.
- Si el global termina empatado, cada club permanece en su liga actual.

## Seguridad

- No cambia resultados ya jugados.
- No borra fixtures.
- No reconstruye la temporada.
- No modifica planteles ni economía.

## Compatibilidad

- Se implementa solo.
- Los playoffs ya creados deberían mostrarse con el nuevo nombre visual.
- Si una partida ya tiene playoffs antiguos, se usan los datos guardados para mostrarlos en ambas ligas sin duplicar simulación.
