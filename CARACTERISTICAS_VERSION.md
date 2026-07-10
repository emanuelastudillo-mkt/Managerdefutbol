# Características de la versión V5.40

## Balance separado y entrenamiento diario corregido

- Agrega `balance-modificadores.js` como archivo activo para centralizar modificadores y multiplicadores de balance.
- `balance-modificadores.js` se carga antes de `config.js` y pisa sólo los valores declarados ahí.
- El entrenamiento general del manager ahora aplica sólo los 4 bloques del día actual, no los 28 bloques de toda la semana.
- Los bots siguen sin entrenamiento diario. Su balance permanece por simulación rápida y mantenimiento competitivo.
- La simulación rápida de bots agrega sobreexigencia si un bot va perdiendo: puede recibir un pequeño boost ofensivo y paga más desgaste/condición.
- La lluvia ahora aumenta el deterioro del campo del club manager cuando juega como local.
- La ficha del jugador muestra los boosts de temporada en verde junto a la habilidad visible, por ejemplo `Pase 72 +7`.
- El desgaste se mantiene como efecto indirecto: no entra directo al simulador, pero limita el máximo de estado físico y ese estado físico sí modifica el rendimiento.
- Se mantiene la penalización actual para lesionados usados como suplentes: rinden casi como jugadores inutilizables.

## Archivo nuevo

- `balance-modificadores.js`

Bloques principales:

- `entrenamiento`
- `cohesion`
- `lesiones`
- `simulador`
- `equilibrioBots.tacticaRapida`
- `estadio.clima`

## Alcance

- No cambia planteles, mercado, clubes, calendario ni jugadores manuales.
- No convierte el balance a pantalla editable todavía.
- No hace que los bots entrenen.
- No cambia el cálculo base de habilidades; sólo expone mejor los boosts de temporada y corrige el ritmo de aplicación diaria.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. Los cambios aplican a entrenamientos y partidos futuros.
