# Revisión de código V6.02

## Objetivo

Dividir `data/jugadores.json`, que era el archivo más pesado de la carpeta `data/`, sin romper la carga actual del juego ni las partidas guardadas.

## Ajuste aplicado

La base de jugadores fue separada en 9 chunks por país/liga:

| Archivo | Jugadores |
| --- | ---: |
| `data/jugadores/argentina-liga-profesional.json` | 450 |
| `data/jugadores/argentina-primera-nacional.json` | 450 |
| `data/jugadores/argentina-federal-a.json` | 450 |
| `data/jugadores/chile-primera-division-chile.json` | 450 |
| `data/jugadores/brasil-brasileirao.json` | 450 |
| `data/jugadores/inglaterra-premier-league.json` | 450 |
| `data/jugadores/espana-laliga-espana.json` | 450 |
| `data/jugadores/italia-serie-a-italia.json` | 450 |
| `data/jugadores/rumania-superliga-rumania.json` | 450 |

Total verificado: 4.050 jugadores.

## Cambios de carga

`config.js` ahora declara `data.playersUrls`, una lista de archivos de jugadores. Si esa lista existe, el juego carga los chunks directamente.

`data.playersUrl` se mantiene apuntando a `data/jugadores.json`, pero ahora ese archivo funciona como manifest liviano. Esto permite mantener una ruta central de referencia y compatibilidad.

`js/data/04-data-storage.js` ahora soporta:

- JSON legacy con propiedad `players`.
- JSON legacy como array directo.
- JSON con propiedad `jugadores`.
- Manifest con `files`, `playerFiles` o `jugadoresFiles`.

## Rendimiento esperado

El cambio reduce el peso de `data/jugadores.json` y evita que un único archivo concentre toda la base. En servidores estáticos y navegador, esto mejora mantenimiento, cacheo granular y depuración. La cantidad total de datos descargados es similar, pero repartida en archivos paralelizables.

## Compatibilidad

Las partidas guardadas siguen usando snapshots internos de jugadores. Para nuevas partidas, el seed se arma con la misma base total de 4.050 jugadores.

No se eliminó soporte para el formato anterior, por lo que futuras pruebas pueden volver temporalmente a un único archivo si hiciera falta.

## Nota sobre fotos manuales

La observación de V6.01 sobre fotos de `jugadores_manuales.json` queda descartada: las imágenes existen fuera del ZIP y no se consideran faltantes del código.

## Validaciones

- Todos los JSON de `data/` parsean correctamente.
- Los chunks suman 4.050 jugadores.
- Los IDs de jugadores siguen siendo únicos.
- `node --check` no reporta errores de sintaxis en los JS modificados ni en el resto de JS del proyecto.
