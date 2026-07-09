# Características V4.29 - Desgaste físico y préstamo completo

## Cambios

- La lista lateral de goleadores, asistentes, amonestados, expulsados y lesionados del simulador ahora se revela por minuto.
- Se agrega `Desgaste` como estado persistente por jugador.
- El desgaste se acumula por partido jugado entre 1 y 3 puntos según intensidad del partido.
- Cada turno general de `Entrenamiento intenso` suma 1 punto de desgaste.
- Cada turno general de `Masajista` reduce 1 punto de desgaste.
- El desgaste reduce el máximo de estado físico posible: `máximo = 99 - desgaste`.
- El máximo limitado por desgaste se muestra en gris en el indicador de estado físico.
- Se agrega un botón para pagar la totalidad de un préstamo bancario activo.
- Al cancelar el préstamo completo, la deuda restante se descuenta del presupuesto del club y el préstamo queda cerrado.

## Motivo

El físico necesitaba una capa de fatiga acumulada que no se solucionara sólo con recuperación diaria. El desgaste permite que una seguidilla de partidos o entrenamientos intensos limite el máximo físico, y obliga a usar Masajista para recuperar techo físico.
