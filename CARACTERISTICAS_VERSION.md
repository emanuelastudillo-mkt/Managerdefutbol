# Características de la versión V5.18

## Fatiga reforzada

- La pérdida de estado físico del simulador vivo se duplica para ambos equipos.
- La fatiga sigue considerando resistencia, genética, posición e instrucción activa.
- Se agrega `GAME_CONFIG.simulador.fatigaVivaMultiplicador` para poder ajustar el multiplicador sin tocar el motor.

## Cambios bot más agresivos

- El bot intenta utilizar mejor los 3 cambios disponibles.
- Prioriza sacar jugadores cansados, con mal puntaje o con bajo encaje de rol.
- Evalúa cambios en ventanas más claras: entretiempo, 60, 70, 78 y 84 minutos.
- El resultado parcial influye en el tipo de suplente elegido: más ofensivo si pierde, más conservador si gana.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. Afecta partidos propios futuros o pendientes que abran el simulador vivo.
