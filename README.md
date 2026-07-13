# Fútbol Manager MVP - V7.05

## V7.05 - Economía anual por reputación de liga

Esta versión parte de V7.04 y conserva el sistema de guardado doble seguro.

### Reputación económica anual de cada liga

Al comenzar cada temporada se calcula y guarda la reputación media de cada división doméstica usando la reputación de todos sus clubes en ese momento. El valor permanece fijo durante toda la temporada y se vuelve a calcular después de los ascensos, descensos y cambios de reputación, al iniciar el año siguiente.

La fórmula activa es:

- Victoria promedio: reputación de liga × $8.000.
- Empate promedio: reputación de liga × $3.000.
- Variación por partido: entre 75% y 125% del valor promedio.
- Derrota: $0 por resultado.
- Redondeo: múltiplos de $5.000.
- Reputación utilizada: mínimo 10 y máximo 100.

Una liga con reputación 50 paga aproximadamente:

- Victoria: $300.000 a $500.000.
- Empate: $115.000 a $190.000, según redondeo.
- Derrota: $0.

La recaudación de entradas continúa calculándose por separado. Por lo tanto, una derrota como local puede generar ingresos de entradas, pero nunca un pago positivo o negativo por el resultado deportivo.

Los valores pueden editarse desde `balance-modificadores.js`, dentro de `economia.pagosPorResultadoLiga`.

### Mundial de Clubes

El Mundial de Clubes queda excluido del pago por resultado de liga. Conserva exclusivamente sus premios propios por participación y avance de fase.

### Integridad de divisiones

Los clubes invitados exclusivamente al Mundial de Clubes ya no se guardan dentro de `clubDivisionOverrides`, porque no pertenecen a una división doméstica cargada.

- El verificador ignora correctamente estos invitados.
- Las ocho entradas antiguas se eliminan automáticamente al cargar una partida.
- Los overrides nuevos sólo incluyen clubes de ligas domésticas.
- La advertencia “Overrides de división inconsistentes” se mantiene para errores reales.

También se corrigió el país de Wydad Casablanca de China a Marruecos en la lista interna de invitados.

### Guardado y migración

Las partidas anteriores reciben una instantánea económica para la temporada que esté en curso al cargarse por primera vez en V7.05. Desde la temporada siguiente, el cálculo se realiza normalmente al inicio de cada año.

Se conserva el sistema de dos copias de guardado:

- Carrera 1: `slot:career:1` y `main`.
- Otros slots: copia principal y respaldo dedicado.

### Archivos modificados en V7.05

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/retos_manager.json`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`

### Compatibilidad de partidas

**V7.05 no rompe partidas anteriores.** Mantiene planteles, presupuesto, calendario, reputaciones y resultados. Sólo agrega la instantánea económica de liga y elimina overrides falsos de clubes exclusivos del Mundial de Clubes.
