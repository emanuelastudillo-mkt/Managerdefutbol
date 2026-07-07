# Características de la versión V3.24

La V3.24 agrega una planilla interna de eventos condicionales para que el juego pueda reaccionar a sucesos deportivos sin mezclar toda la lógica dentro del simulador de partidos.

## Cambio central

Se creó el archivo:

```text
data/eventos.json
```

Ese archivo funciona como una planilla editable. Cada evento tiene:

- `id`
- `activo`
- `nombre`
- `fase`
- `probabilidad`
- `condiciones`
- `efectos`

El motor de eventos está en:

```text
js/game/14-eventos.js
```

## Eventos incluidos

### 1. AFA compensa lesiones de visitante

Si el equipo del usuario juega de visitante y sufre más de 3 lesiones, se activa un mensaje de AFA y se acredita una compensación económica.

La compensación equivale a la suma del sueldo de cada jugador lesionado en ese partido.

### 2. Apoyo de hinchas por moral baja

Si la moral media del plantel está por debajo de 50, hay 30% de probabilidad de que los hinchas se acerquen al entrenamiento para apoyar al equipo.

Efectos:

- +10 moral para todos los jugadores.
- +10 cohesión del equipo.
- +10 forma física para todos los jugadores.
- Mensaje de la directiva.
- Mensaje del asistente.

## Registro interno

Se agregó:

```js
game.eventLog
```

Esto permite registrar qué eventos se activaron por temporada, turno y partido. Evita duplicados y deja preparada la base para futuras estadísticas de eventos.

## Preparación para futuras versiones

La estructura permite agregar nuevos eventos como:

- protestas de hinchas;
- sanciones de AFA;
- premios de la directiva;
- problemas de vestuario;
- bonus por racha positiva;
- caídas de moral por derrotas fuertes;
- eventos económicos extraordinarios;
- conflictos con empleados o jugadores.
