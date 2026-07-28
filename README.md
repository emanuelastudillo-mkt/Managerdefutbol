# V8.85 · Recuperación determinista del calendario actual

Aplicar sobre una instalación V8.84.

## Problema corregido

En partidas avanzadas podía ocurrir que el calendario conservara sólo una jornada futura —por ejemplo la fecha 34— mientras fechas intermedias desaparecían o quedaban reprogramándose sin llegar a ejecutarse. Además, el indicador de Inicio podía mostrar `Liga 1 / 34` aunque el club ya hubiera disputado muchos encuentros.

## Recuperación de la temporada actual

- Reconstruye las 34 jornadas esperadas de la temporada y año que se están jugando.
- Compara el fixture canónico con los fixtures guardados y con `matchHistory`.
- Conserva todos los marcadores y estadísticas que tengan evidencia de haber sido jugados.
- Restaura partidos desaparecidos sin crear duplicados.
- Las jornadas cuya fecha original ya pasó se reprograman en martes, comenzando por el primer martes disponible.
- Las jornadas atrasadas se agrupan por fecha de liga para que se disputen juntas.
- Un club nunca recibe dos partidos el mismo día.
- Los partidos correspondientes al día actual permanecen en ese día.
- Las jornadas futuras vuelven a su fecha original y no son desplazadas por el recuperador.
- Las reprogramaciones antiguas de V8.83/V8.84 se recalculan una sola vez para colocarlas lo antes posible.
- Una segunda auditoría sobre el mismo estado no vuelve a mover ni crear partidos.

## Próximo partido y progreso

- El próximo compromiso se elige por la fecha real más cercana, no por la posición interna del fixture.
- Las fechas recuperadas ya no pueden quedar detrás de una fecha 34 futura.
- `Liga X / 34` se calcula con los partidos de liga realmente jugados por el club.
- Copas, supercopas, Mundial de Clubes y playoffs no alteran ese contador.

## Coordinación de verificadores

- Se eliminó el recuperador duplicado que seguía activo en la capa económica V8.83.
- `05r-calendar-integrity-v884.js` queda como única autoridad de reparación.
- Durante un avance diario, el verificador programado no ejecuta una segunda auditoría anidada.

## Caso validado

Temporada 4, año 2029, día 224, veinte partidos jugados y fechas 21 a 33 ausentes:

- Fecha 24: conserva el 12/08/2029, día actual.
- Fechas 21, 22 y 23: pasan al 14/08, 21/08 y 28/08, todos martes.
- Fechas 25 a 34: mantienen sus fechas originales.
- Próximo compromiso: 12/08/2029, no la fecha 34.
- Indicador: `Liga 21 / 34`.

## Compatibilidad

Compatible con partidas V8.84 iniciadas. No reinicia la temporada, no retrocede la fecha actual y no modifica resultados ya disputados.
