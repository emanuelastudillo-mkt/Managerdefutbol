# Fútbol Manager MVP V2.29

Actualización incremental del manager de fútbol local.

## Cambios V2.29
- Se corrigió la pizarra táctica para que las posiciones se ubiquen según su rol real.
- ED, EI y DC quedan tratados como atacantes; MCD, MC y MCO como mediocampistas.
- Se ajustaron formaciones donde ED/EI estaban funcionando como mediocampistas visuales.
- El botón **Mejor once** ahora elige jugadores compatibles con cada línea y evita titulares penalizados por fuera de zona.
- El puesto POR sólo acepta porteros.
- Los porteros no pueden ser colocados como jugadores de campo.
- El botón **Mejor condición física** sigue priorizando forma física, pero respeta que el portero sea portero.

## Base inicial vigente
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

El guardado de partida sigue funcionando localmente con IndexedDB. Para aplicar correcciones de base en una partida ya creada, conviene iniciar una nueva partida o limpiar el guardado local.
