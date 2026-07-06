# Fútbol Manager MVP V2.27

Actualización incremental del manager de fútbol local.

## Cambios V2.27
- Se regeneró `data/jugadores.json` con la nueva distribución de medias.
- Elite mundial baja de 3% a 0,5% teórico, aplicado como máximo seguro: 7 jugadores sobre 1500, equivalente a 0,47%.
- Titular competitivo sube a 24,5% para compensar la reducción de elite.
- Se mantiene la auditoría por división: los jugadores 92-99 sólo aparecen en Primera; Tercera no inicia con jugadores 80+.
- Se mantiene la auditoría por club: como base inicial, ningún club comienza con más de 1 jugador 92-99.
- Se mantienen sueldos y cláusulas al 10% de la escala previa.
- Las reglas internas de generación para futuros jóvenes quedan alineadas con la nueva distribución.

## Validación de la base inicial
- Total jugadores: 1500.
- 92-99: 7 jugadores.
- 80-91: 105 jugadores.
- 68-79: 368 jugadores.
- 43-67: 750 jugadores.
- 19-42: 270 jugadores.

## Archivos
- `index.html`
- `app.js`
- `style.css`
- `simulador-2.0.js`
- `data/Liga Argentina.json`
- `data/jugadores.json`
- `data/sponsors.json`

El guardado de partida sigue funcionando localmente con IndexedDB. Para ver la nueva base en una partida ya creada, hay que iniciar una nueva partida o limpiar el guardado local.
