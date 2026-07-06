# Fútbol Manager MVP V2.34

Actualización incremental del manager de fútbol local.

## Cambios V2.34
- Se agregó `config.js` como archivo editable de configuración general.
- Se movieron a configuración externa los valores principales:
  - tiempo de bloqueo entre turnos;
  - duración visual de la transición de avance;
  - cantidad de turnos de pretemporada y postemporada;
  - cantidad máxima de jugadores del primer equipo;
  - cantidad de agentes libres iniciales y jóvenes libres por temporada;
  - escala de sueldos y cláusulas;
  - parámetros de sponsors;
  - costos de estadio, empleados y academia;
  - parámetros básicos de lesiones.
- Se ajustó la transición de avance de turno para usar la duración definida en `config.js`.
- Se limpió una estructura duplicada de formaciones visuales que ya no se usaba.
- Se agregaron controles simples de límite de plantel al contratar libres, comprar jugadores o promover juveniles.
- Se validó sintaxis de `app.js`, `config.js` y `simulador-2.0.js`.
- Se validaron los JSON principales: jugadores, sponsors y Liga Argentina.

## Archivo de configuración
Editar:

```txt
config.js
```

Ejemplos útiles:

```js
turnos: {
  bloqueoEntreTurnosMs: 120000,
  transicionAvanceMs: 3400
},
plantel: {
  jugadoresMaximosPorClub: 25
},
sponsors: {
  factorValorBase: 1,
  partidosMinimosEntreTandas: 4,
  partidosMaximosEntreTandas: 7
}
```

## Base inicial vigente
- Total jugadores: 1500.
- 92-99: 7 jugadores.
- 80-91: 105 jugadores.
- 68-79: 368 jugadores.
- 43-67: 750 jugadores.
- 19-42: 270 jugadores.

## Archivos
- `index.html`
- `config.js`
- `app.js`
- `style.css`
- `simulador-2.0.js`
- `data/Liga Argentina.json`
- `data/jugadores.json`
- `data/sponsors.json`

El guardado de partida sigue funcionando localmente con IndexedDB.
