# Características de la versión V3.26

La V3.26 corrige el problema de campos de juego bots que podían quedar masivamente en estado injugable, por ejemplo 1/100, incluso después de iniciar una nueva temporada.

## Problema corregido

Los equipos bots deben tener un campo fijo durante la temporada, con un mínimo configurado. Si muchos bots aparecen con campo 1/100, eso no representa desgaste normal: es un dato corrupto o mal arrastrado.

## Solución

- El juego audita los campos bots automáticamente.
- Si un bot queda por debajo del mínimo configurado, se regenera su campo.
- Si más del porcentaje configurado de bots está injugable, se considera falla masiva y se regeneran todos los campos bots.
- La reparación se guarda al cargar la partida.
- Se agrega mensaje interno cuando el sistema corrige campos bots.
- Se agrega una auditoría visible en la pantalla Estadio.
- Se agrega un botón manual para reparar campos bots injugables.

## Resultado esperado

Al cargar una partida afectada, los campos bots dejan de estar en 1/100 y pasan a valores razonables de temporada. El club manejado no se toca: su campo sigue siendo dinámico y depende del mantenimiento hecho por el jugador.
