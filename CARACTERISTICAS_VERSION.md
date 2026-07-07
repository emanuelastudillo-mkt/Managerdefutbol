# Características internas de versión · V3.22

## Enfoque V3.22

Esta versión agrega una acción masiva para tratamientos médicos sin reemplazar la lógica individual existente del kinesiólogo.

## Funcionalidad agregada

### Botón “Tratar a todos”

Ubicación:

- Pantalla **Empleados**.
- Card **Tratamientos**.
- Visible cuando hay kinesiólogo contratado y jugadores lesionados.

Texto superior del bloque:

```txt
Que los médicos hagan horas extras hoy
```

Botón:

```txt
Tratar a todos
```

## Costo

El costo se calcula desde el contrato vigente del kinesiólogo:

```js
currentKinesiologistOvertimeCost()
```

Fórmula:

```js
costoHorasExtras = costoContratoKinesiologoActual * KINESIOLOGIST_OVERTIME_COST_RATE
```

Valor por defecto:

```js
KINESIOLOGIST_OVERTIME_COST_RATE = 0.01
```

Equivale al 1%.

## Reglas de tratamiento

Se creó una función común:

```js
applyKinesioTreatment(playerId)
```

La usan:

- el botón individual **Tratar**;
- el botón masivo **Tratar a todos**.

Esto evita duplicar la lógica de éxito/fallo, reducción de lesión y marca semanal.

## Animaciones progresivas

El botón masivo ejecuta:

```js
treatAllInjuredPlayers(button)
```

La función procesa jugadores en secuencia usando pausas configurables:

```js
KINESIOLOGIST_BULK_TREATMENT_STEP_MS
```

Valor por defecto:

```js
650
```

Cada fila de jugador puede pasar por los estados visuales:

- `is-processing`
- `is-success`
- `is-failure`

## Movimiento económico

Al iniciar el tratamiento masivo se registra un movimiento de presupuesto:

```js
recordBudgetChange(-cost, 'Horas extras médicas: tratamiento de X lesionado(s)', {...})
```

El cobro ocurre antes de iniciar la secuencia.

## Compatibilidad

- Compatible con partidas existentes.
- No requiere migración de datos.
- Reutiliza `game.staffActions.kinesiologyTreatments`.
- Respeta `currentTurnIndex()` para impedir tratamientos repetidos en la misma semana.

## Archivos modificados en V3.22

- `config.js`
- `js/core/01-config-constants.js`
- `js/game/10-academy-employees.js`
- `style.css`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`
