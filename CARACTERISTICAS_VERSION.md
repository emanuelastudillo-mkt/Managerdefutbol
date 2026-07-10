# Características de la versión V5.41

## Fatiga visitante y sobreexigencia bot progresiva

- Se toma como base el archivo `balance-modificadores.js` ajustado por el usuario.
- Se agrega protección para que la fatiga viva de un mismo club se aplique una sola vez por bloque de partido.
- Se mantiene corregido el caso del visitante: local y visitante reciben una única aplicación de fatiga por bloque.
- Los bots conservan su sistema de protección/recuperación física fuera del partido.
- Se agregan reglas progresivas de sobreexigencia cuando un bot va perdiendo:
  - diferencia de 1 gol: +20% de desgaste físico y +10% de bonus de ataque.
  - diferencia de 2 goles: +30% de desgaste físico y +20% de bonus de ataque.
  - diferencia de 3 o más goles: +50% de desgaste físico y +30% de bonus de ataque.
- Las reglas viven en `balance-modificadores.js`, dentro de `equilibrioBots.tacticaRapida.reglasDiferencia`.
- La sobreexigencia se aplica en partido vivo contra el manager y en simulación rápida bot vs bot.
- Se registran eventos de sobreexigencia bot en el resultado del partido cuando corresponde.

## Compatibilidad

- Se implementa solo.
- No requiere reiniciar partida.
- Afecta partidos futuros y simulaciones futuras.
