# Fútbol Manager MVP - V5.75

## V5.75 - Balance de campo, estadio y edad

Cambios principales:

- Se duplicó el deterioro normal del campo de juego.
- El estadio del club dirigido pierde 1% de capacidad al cambiar de temporada.
- Desde los 32 años los jugadores reciben una penalización anual acumulada de -1 a -4 en todas sus habilidades.
- La ficha del jugador muestra el deterioro por edad en rojo a la izquierda del valor base y el boost de entrenamiento en verde a la derecha.
- Las habilidades efectivas siguen limitadas entre 1 y 99.

Compatibilidad:

- Las partidas existentes normalizan el nuevo estado `playerAgeSkillPenalties` al cargar.
- El deterioro por edad se aplica en los siguientes cambios de temporada.
