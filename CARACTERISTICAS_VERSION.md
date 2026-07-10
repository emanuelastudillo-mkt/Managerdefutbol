# Características de la versión V5.61

## V5.61 - Hitos con estilo dorado

### Cambios principales
- Las tarjetas de hitos y récords personales pasan de blanco a amarillo/dorado.
- Se ajustan fondo, borde, brillo, icono y pill de categoría para reforzar el aspecto de logro desbloqueado.
- No cambia el sistema de hitos ni sus condiciones, sólo la parte visual.

### Compatibilidad
- Se implementa solo.
- No requiere reiniciar partida.
- Afecta únicamente la presentación visual de los hitos.

---

## V5.58 - Finanzas agrupadas y planteles bot clickeables

### Cambios principales
- El historial de Finanzas agrupa movimientos iguales por temporada, tipo y concepto.
- Las filas agrupadas muestran cantidad de movimientos, rango de fechas, monto consolidado y último presupuesto registrado.
- Los bloques por categoría de ingresos y gastos también muestran grupos cuando hay movimientos repetidos.
- La tarjeta **Plantel y sueldos** queda siempre desplegada; no se minimiza.
- En la ficha de un equipo bot, la tabla **Plantilla observada** permite clickear jugadores para abrir su ficha.

### Compatibilidad
- Se implementa solo.
- No requiere reiniciar partida.
- Afecta sólo visualización de Finanzas y navegación de planteles bot.

---

## V5.57 - Premios deportivos reducidos

### Cambios principales
- Se redujeron a la mitad los premios económicos por campeonato y ascenso agregados en V5.56.
- Los valores quedan centralizados en `balance-manager.js`, bloque `premiosTemporada`.
- Se mantiene la regla de acumulación: un club que sale campeón y asciende cobra ambos premios.
- Se mantiene la protección contra pagos duplicados con `game.seasonPrizeAwards`.

### Valores actuales

| Logro | Premio |
|---|---:|
| Campeón de Primera | $1.500.000.000 |
| Campeón de Segunda | $750.000.000 |
| Campeón de Tercera | $375.000.000 |
| Ascenso de Segunda a Primera | $500.000.000 |
| Ascenso de Tercera a Segunda | $250.000.000 |

### Compatibilidad
- Se implementa solo.
- No requiere reiniciar partida.
- Aplica al cierre de futuras temporadas.

---

## V5.56 - Premios por campeonatos y ascensos

- Se agregan premios económicos configurables por campeonato y ascenso.
- Los valores quedan centralizados en `balance-manager.js`, dentro de `premiosTemporada`.
- Premios por campeonato:
  - Primera: $3.000.000.000
  - Segunda: $1.500.000.000
  - Tercera: $750.000.000
- Premios por ascenso:
  - Desde segunda a primera: $1.000.000.000
  - Desde tercera a segunda: $500.000.000
- Los premios se apilan: si un club sale campeón y asciende, cobra ambos conceptos.
- Se evita la duplicación mediante `game.seasonPrizeAwards`.
- Los premios se registran en el historial financiero como `season_prize` y aparecen dentro de Finanzas en la categoría **Premios temporada**.
- El panel y modal de fin de temporada muestran el total cobrado y el detalle de campeonato/ascenso.

## Validación

- `node --check` ejecutado sobre todos los JS.
- JSON de `data/` parseados correctamente.
- ZIP incremental y completo generados desde V5.55.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. Los premios se aplican al cerrar futuras temporadas.
