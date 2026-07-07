# Características V3.44

## Agregado

### Estrellas de referencia
Se incorpora un sistema de reconocimiento deportivo para reforzar el enfoque jugadorista del simulador.

Condiciones:
- Goleador: marca goles en al menos 3 de los últimos 10 partidos jugados.
- Arquero: consigue al menos 1 tapada clave en 3 de los últimos 10 partidos jugados.
- Mediocampista: suma 3 asistencias dentro de una ventana máxima de 10 partidos.

Reglas:
- Máximo 3 estrellas por equipo.
- La estrella se muestra junto al nombre del jugador.
- Si el jugador cambia de club, la estrella desaparece.
- La estrella debe volver a ganarse en el nuevo club.

## Impacto en simulación

Las estrellas aumentan el peso individual del jugador al definir protagonistas de jugadas relevantes:
- rematadores;
- asistidores;
- arqueros en tapadas clave.

El balance general del simulador mantiene el enfoque 70% colectivo / 30% individual.
