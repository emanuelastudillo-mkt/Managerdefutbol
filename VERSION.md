# Versión V3.24

## Nombre
Eventos condicionales desde planilla

## Base
V3.23 · Campos bots y próximo compromiso

## Cambios principales V3.24

- Se agregó `data/eventos.json` como planilla editable de eventos condicionales.
- Se agregó el motor `js/game/14-eventos.js` para evaluar eventos después de cada fecha oficial.
- Se agregó `game.eventLog` para registrar los eventos activados y evitar duplicados en el mismo turno/partido.
- Se integró la carga de eventos desde `config.js` mediante `data.eventsUrl`.
- Se agregó un evento AFA por exceso de lesiones de visitante.
- Se agregó un evento de apoyo de hinchas cuando la moral media del plantel está por debajo de 50.
- El resumen semanal ahora avisa si se activaron eventos y sugiere revisar Mensajes.

## Evento: AFA por lesiones de visitante

Condiciones:

- Temporada regular.
- El equipo del usuario juega de visitante.
- El equipo del usuario sufre más de 3 lesiones en ese partido.

Efectos:

- AFA envía un mensaje de disculpas en nombre del club rival.
- Se acredita una compensación económica equivalente a la suma del sueldo de los jugadores lesionados.
- El movimiento queda registrado en Finanzas como compensación por evento.

## Evento: Apoyo de hinchas por moral baja

Condiciones:

- Temporada regular.
- Moral media del plantel menor a 50.
- Probabilidad de activación: 30%.

Efectos:

- Moral +10 para todos los jugadores del plantel.
- Cohesión +10 para el equipo.
- Forma física +10 para todos los jugadores del plantel.
- Mensaje de la directiva.
- Mensaje del asistente con lectura deportiva posterior al entrenamiento.

## Archivos modificados

- `config.js`
- `index.html`
- `data/eventos.json`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/14-eventos.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

## Versión anterior

V3.23 · Campos bots y próximo compromiso
