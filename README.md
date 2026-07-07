# Fútbol Manager MVP

## Versión actual: V3.24

Esta versión agrega una planilla editable de eventos condicionales mediante `data/eventos.json`.

## Cómo usar

Abrir `index.html` desde un servidor local o publicarlo en GitHub Pages. El juego carga la liga, jugadores, sponsors, empleados y eventos desde archivos JSON.

## Archivos principales

- `index.html`: estructura principal.
- `style.css`: estilos visuales.
- `config.js`: configuración general editable.
- `data/Liga Argentina.json`: estructura de ligas y clubes.
- `data/jugadores.json`: base de jugadores.
- `data/sponsors.json`: base de sponsors.
- `data/empleados.json`: base de empleados.
- `data/eventos.json`: planilla de eventos condicionales.
- `js/game/14-eventos.js`: motor que interpreta la planilla de eventos.

## Cambios V3.24

- Planilla editable de eventos en `data/eventos.json`.
- Motor de eventos condicionales.
- Registro interno `game.eventLog`.
- Evento AFA por más de 3 lesiones jugando de visitante.
- Evento de apoyo de hinchas con moral media menor a 50 y 30% de probabilidad.
- Efectos sobre presupuesto, moral, cohesión y forma física.

## Cambios V3.23

- Estado del campo visible en Próximo compromiso.
- Campos bots fijos durante la temporada.
- Reasignación de estado de campos bots al inicio de la temporada siguiente según posición final.
