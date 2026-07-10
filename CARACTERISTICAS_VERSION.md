# Características de la versión V5.59

## V5.59 - Hitos visibles en estadísticas

### Cambios principales
- Los hitos y récords personales aparecen en **Mis estadísticas** y también como tarjeta superior dentro de **Estadísticas**.
- Se renombra el acceso lateral a **Mis estadísticas**.
- Se fuerza el chequeo silencioso de hitos al renderizar la UI para que partidas existentes desbloqueen logros ya cumplidos.
- Se agrega recuperación mínima de estadísticas desde la tabla actual si una partida antigua no tenía totales de manager registrados.
- El bloque de hitos muestra contador `desbloqueados/total` y aviso claro si no se cargó `data/hitos_manager.json`.

### Compatibilidad
- Se implementa solo.
- No requiere reiniciar partida.
- Las partidas ya iniciadas pueden desbloquear hitos sobre los datos que ya estén guardados o reconstruibles desde la tabla actual.

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
