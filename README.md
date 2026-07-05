# Fútbol Manager MVP - V2.19

Paquete de actualización del proyecto para navegador.

## Cambios de esta versión
- Se agrega `data/jugadores.json` como base inicial fija de jugadores ficticios.
- La nueva base inicial contiene 1.500 jugadores: 60 clubes x 25 jugadores.
- La base fue validada con los porcentajes estipulados:
  - Nacionalidad: 70% argentinos, 20% sudamérica, 10% resto del mundo.
  - Posiciones: 10% POR, 30% defensores, 30% mediocampistas, 30% atacantes.
  - Media: 3% de 92 a 99, 7% de 80 a 91, 22% de 68 a 79, 50% de 43 a 67 y 18% de 19 a 42.
- Se evita que las ligas menores queden sobrecargadas con medias altas:
  - Federal A no tiene jugadores de media 80 o superior.
  - Primera Nacional no tiene jugadores de media 92 o superior.
- Se mantiene `EXT` fuera de la creación. Sólo se usan puestos válidos: POR, LD, LI, DFC, MCD, MC, MCO, ED, EI y DC.
- El juego intenta cargar `data/jugadores.json` al iniciar la base. Si existe, reemplaza la generación aleatoria inicial.
- Las modificaciones posteriores de jugadores quedan guardadas en el navegador junto con la partida: sueldos, cláusulas, retiros, juveniles, transferencias y cambios de plantel.
- Los juveniles futuros siguen usando las reglas de auditoría existentes para no inflar rangos ya excedidos.

## Archivos incluidos
- `index.html`
- `app.js`
- `style.css`
- `simulador-2.0.js`
- `README.md`
- `VERSION.md`
- `data/jugadores.json`

## Nota
Este ZIP no incluye `pitch-board.png`.
