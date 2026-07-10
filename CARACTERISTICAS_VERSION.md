# Características de la versión V5.44

## Recuperación postpartido por resistencia

- La recuperación automática postpartido ya no usa un rango fijo universal de 4 a 6.
- Ahora se calcula jugador por jugador según su habilidad `resistencia`.
- Los rangos activos quedan en `balance-modificadores.js`:
  - Resistencia 1-40: recupera 0 a 1.
  - Resistencia 41-60: recupera 2 a 4.
  - Resistencia 61-70: recupera 3 a 5.
  - Resistencia 71-80: recupera 4 a 7.
  - Resistencia 81-90: recupera 6 a 9.
  - Resistencia 91-99: recupera 12 a 20.
- El rango 61-70 se agrega como puente para evitar un salto brusco entre 60 y 71.

## Balance centralizado

- Se agrega `simulador.recuperacionPostPartidoUsaResistencia`.
- Se agrega `simulador.recuperacionPostPartidoPorResistencia`.
- Si se desactiva esa opción, el sistema vuelve al respaldo anterior `recuperacionAutomaticaPostPartidoMin/Max`.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida.
