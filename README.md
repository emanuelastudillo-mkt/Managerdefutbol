# Fútbol Manager MVP V2.30

Actualización incremental del manager de fútbol local.

## Cambios V2.30
- Se testeó el flujo de sponsors y se detectó que la tanda inicial de 2 ofertas no se generaba al crear una partida nueva.
- Nueva partida: ahora genera automáticamente 2 ofertas iniciales de sponsors.
- Nueva temporada: vuelve a generar automáticamente 2 ofertas iniciales de sponsors.
- Si una partida vieja llega al inicio de la jornada 1 sin tanda inicial, se corrige y genera las 2 ofertas.
- Se mantiene la regla de tandas posteriores: entre 2 y 5 ofertas cada 4 a 7 partidos oficiales.
- Se mantiene el pago completo al aceptar la oferta.

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
