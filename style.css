# Características de la versión V5.67

## V5.67 - Campañas de socios en Estadio

### Cambios principales
- Se agrega un bloque de campañas para sumar socios dentro del menú **Estadio**.
- Las campañas muestran inversión y duración, pero ocultan los socios diarios y el total de captación.
- Las campañas activas se procesan día a día y suman socios al club manejado.
- El costo se descuenta al iniciar y queda registrado en Finanzas.
- Los valores quedan configurables desde `config.js`, bloque `estadio.campaniasSocios`.

### Campañas iniciales
| Campaña | Inversión | Duración | Captación oculta |
|---|---:|---:|---:|
| Marketing | $50.000.000 | 60 días | 10 a 15 socios/día |
| Marketing | $500.000.000 | 90 días | 35 a 50 socios/día |
| Marketing | $100.000.000 | 10 días | 30 a 50 socios/día |

### Compatibilidad
- Se implementa solo.
- No requiere reiniciar partida.

---

## V5.66 - Sponsors fijos por temporada

### Cambios principales
- Se reemplaza el sistema de aparición por partidos por un plan fijo de temporada.
- Cada temporada genera entre 20 y 40 ofertas de sponsors.
- Las ofertas vencen a los 5 días si no se aceptan o rechazan.
- Pueden llegar hasta 3 ofertas juntas y pueden competir por el mismo espacio publicitario.
- Los 20 lugares posibles siguen disponibles como destino de oferta.
- Cada oferta define una sola forma de pago: pago total inicial o pago diario.
- Las ofertas con pago total inicial pagan 50% menos que el total equivalente por día.
- Las duraciones pasan a 200-500 días.
- Los multiplicadores vigentes se conservan: división, puesto, moral, cohesión, lugar, valor base y cartas de sponsors.

### Compatibilidad
- Se implementa solo.
- No requiere reiniciar partida.
- Las partidas existentes normalizan el estado de sponsors al cargar.

---

## V5.65 - Códigos especiales en menú Especial

### Cambios principales
- Se agrega una tarjeta de canje de códigos dentro del menú **Especial**.
- Los códigos disponibles quedan configurables en `config.js`.
- Cada código se reclama una sola vez por partida guardada.
- El beneficio puede sumar prestigio de manager y/o puntos de habilidad.
- Se incluyen dos códigos iniciales: `PRESTIGIO20` y `PUNTOS50000`.

### Compatibilidad
- Se implementa solo.
- No requiere reiniciar partida.
- Afecta únicamente al menú Especial y al estado guardado de códigos reclamados.

---


## V5.64 - Botón de auto avance

### Cambios principales
- Se agregó un botón debajo de **Avanzar día** para funcionar como auto clicker interno.
- Al activarlo, intenta avanzar automáticamente cuando el cooldown llega a cero.
- El sistema se detiene si detecta temporada finalizada, manager sin club, ventana/modal abierta, táctica incompleta o revisión táctica obligatoria.
- El botón cambia a **Detener auto avance** mientras está activo.

### Compatibilidad
- Se implementa solo.
- No requiere reiniciar partida.
- No modifica reglas de calendario, simulador ni economía; sólo automatiza el click cuando ya era legal avanzar.

---

## V5.63 - Verificador automático cada 5 días

### Cambios principales
- Se suma un verificador/reparador automático que corre cada 5 días de juego.
- El verificador revisa datos mínimos de partidos bot, reparación segura de planteles bot y consistencia de calendario de postemporada.
- En postemporada revalida el inicio, duración total y fecha visible para evitar casos como contadores inflados o día congelado.
- El proceso es silencioso; sólo guarda un resumen interno cuando corrige algo.

### Compatibilidad
- Se implementa solo.
- No requiere reiniciar partida.
- Afecta chequeos futuros al avanzar días.

---

## V5.62 - Corrección calendario postemporada

### Cambios principales
- La postemporada deja de recalcular su duración desde el fixture cada vez que se renderiza o avanza.
- Al terminar la fase regular se guardan `postseasonStartDate` y `postseasonTotalTurns`.
- Si una partida ya quedó con una duración inflada de postemporada, el cargador intenta inferir una fecha de inicio válida y normalizar el total.
- El avance de postemporada vuelve a mover `currentDate` hacia adelante hasta el cierre real del año.
- Se actualizaron versión visible y cache-busting a V5.62.

### Compatibilidad
- Se implementa solo.
- No requiere reiniciar partida.
- Afecta sólo calendario/postemporada y reparación de partidas ya iniciadas.

---

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
