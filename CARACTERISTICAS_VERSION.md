# V4.05 - Ranking automático y limpieza al cambiar de club

## Cambios principales

- Se corrige el envío automático del ranking para Cloudflare Workers.
- El envío automático prueba primero la ruta `/records` y mantiene `/ranking` como alternativa.
- La lectura del ranking mantiene `/ranking` y agrega `/records` como ruta alternativa.
- Si `config.js > ranking.token` tiene un token, se envía también como encabezado `Authorization: Bearer`.
- Al tomar un nuevo club después de un despido o renuncia, se limpian estados vinculados al club anterior:
  - empleados contratados;
  - acciones de staff;
  - cooldown de charla motivacional;
  - tratamientos de kinesiólogo ya usados;
  - preparador de juveniles;
  - consultas de academia en curso;
  - ofertas pendientes;
  - préstamo bancario activo;
  - sponsors activos y ofertas de sponsors.
- El nuevo club empieza sin arrastrar contratos ni cooldowns del club anterior.

## Archivos modificados

- `index.html`
- `config.js`
- `VERSION.md`
- `README.md`
- `CARACTERISTICAS_VERSION.md`
- `js/game/05-state-season.js`
- `js/game/13-ranking-online.js`

## Validaciones

- Sintaxis validada en `config.js`.
- Sintaxis validada en todos los archivos `.js` modificados.
- No se modificaron estructura de datos global, calendario, simulador de partidos ni generación de jugadores.

## Nota

- Si el Worker mantiene autenticación obligatoria para subir récords, hace falta pegar el token vigente en `config.js > ranking.token` o guardarlo en `localStorage` como `fmRankingAuthToken`.
