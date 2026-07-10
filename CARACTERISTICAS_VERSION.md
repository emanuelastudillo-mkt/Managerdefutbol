# Características de la versión V5.47

## V5.47 - Objetivos dinámicos por prestigio relativo

### Cambios principales

- Se agrega `balance-manager.js` como archivo separado para balancear objetivos, evaluación directiva y prestigio del manager.
- Los objetivos dejan de depender sólo de la división fija y ahora usan:
  - base por liga/división,
  - prestigio del club,
  - prestigio promedio de la liga,
  - modificador por prestigio relativo.
- Se calcula y guarda una expectativa textual de directiva:
  - Evitar el último puesto,
  - Evitar descenso,
  - Temporada aceptable,
  - Mitad de tabla,
  - Pelear parte alta,
  - Clasificar a playoffs/copas,
  - Pelear ascenso/título,
  - Salir campeón.
- Los partidos mínimos de evaluación ahora dependen del objetivo PPG:
  - objetivo menor a 1.00: 7 partidos,
  - objetivo hasta 1.50: 6 partidos,
  - objetivo hasta 1.85: 5 partidos,
  - objetivo mayor a 1.85: 4 partidos.
- La directiva ya no despide sólo por estar apenas por debajo del objetivo. Ahora usa estados por diferencia PPG:
  - Excelente,
  - Cumple,
  - Advertencia leve,
  - Riesgo,
  - Crisis,
  - Despido probable.
- El despido por objetivo se activa sólo en zona crítica, por defecto desde -0.50 PPG o peor.
- El prestigio por objetivo de temporada pasa a ser dinámico:
  - +12, +8, +5 o +3 si se supera/cumple el objetivo,
  - -1, -3 o -5 si se incumple según gravedad.
- Las penalizaciones de mala temporada quedan separadas:
  - descenso: -8,
  - último puesto: -5 adicional.
- La oficina del manager muestra expectativa y diferencia actual contra el objetivo.
- La pantalla de estadísticas muestra el objetivo PPG, la diferencia y el ajuste de prestigio asociado.

### Archivo agregado

- `balance-manager.js`

### Compatibilidad de partida

Se implementa solo. En partidas existentes, el objetivo de la temporada actual se mantiene si ya estaba congelado; las nuevas temporadas y cambios de club usan la escala dinámica. No requiere reiniciar partida.
