# Fútbol Manager MVP - V2.0

Paquete de actualización del proyecto para navegador.

## Cambios de esta versión
- Se agrega el archivo `simulador-2.0.js` para separar el motor de simulación del resto de la interfaz.
- El partido pasa a simularse por bloques de 15 minutos.
- Se incorporan instrucciones de partido: ganando, empatando y perdiendo.
- Las instrucciones influyen en ritmo, volumen de ataque, defensa, conversión y desgaste físico posterior.
- El motor pondera cantidad y calidad de mediocampistas para posesión y generación de ataques.
- El motor pondera cantidad y calidad de delanteros para convertir ataques en ocasiones.
- El motor pondera defensores y portero para reducir ocasiones rivales.
- Se incorporan efectos del tipo de formación: defensiva, equilibrada, poblada de medios o ofensiva.
- Se mantienen como factores internos el estado del campo, la cohesión y la moral del equipo.

## Archivos incluidos
- `index.html`
- `app.js`
- `simulador-2.0.js`
- `style.css`
- `README.md`
- `VERSION.md`

## Nota
Este ZIP **no incluye** `pitch-board.png`. Mantené ese archivo en tu repositorio actual.
