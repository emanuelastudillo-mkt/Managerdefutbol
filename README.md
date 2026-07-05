# Fútbol Manager MVP - V2.18

Paquete de actualización del proyecto para navegador.

## Cambios de esta versión
- Se adapta la creación inicial de jugadores a las reglas `instrucciones_creacion_jugadores_V1.02`.
- Se aplica nacionalidad ponderada:
  - 70% argentinos.
  - 20% sudamérica.
  - 10% resto del mundo.
- Se mantiene la estructura de puestos válida del juego:
  - POR.
  - LD, LI, DFC.
  - MCD, MC, MCO.
  - ED, EI, DC.
- Se elimina `EXT` de la generación nueva. Si aparece en datos viejos, se normaliza a ED/EI.
- Se aplica distribución ponderada de media general por rangos.
- El sueldo anual inicial se calcula por media y rango.
- La cláusula inicial se calcula por sueldo, edad y división, con mínimo de 6 sueldos.
- Los juveniles libres creados en cambios de temporada usan las mismas reglas base, con sueldos reducidos.
- Los juveniles nuevos se generan para compensar retiros, manteniendo como mínimo la tanda habitual.
- Se actualiza la cláusula al cambiar de temporada según sueldo vigente, edad y división.

## Archivos incluidos
- `index.html`
- `app.js`
- `style.css`
- `simulador-2.0.js`
- `README.md`
- `VERSION.md`

## Nota
Este ZIP no incluye `pitch-board.png`.
