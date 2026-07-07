# Fútbol Manager MVP · V3.22

Versión incremental basada en V3.21.

## Cambios V3.22

### Kinesiólogo: horas extras médicas

En la pantalla **Empleados > Tratamientos**, cuando el club tiene kinesiólogo contratado y existen jugadores lesionados, ahora aparece un bloque superior con la frase:

**“Que los médicos hagan horas extras hoy”**

Debajo se agrega el botón:

**Tratar a todos**

El botón trata de forma masiva a todos los lesionados pendientes de tratamiento semanal.

## Costo

El uso de este botón cobra al momento el **1% del costo/sueldo del kinesiólogo contratado**.

Ejemplo con la configuración actual:

- Kinesiólogo Regular: $1.000.000 → horas extras $10.000.
- Kinesiólogo Bueno: $4.000.000 → horas extras $40.000.
- Kinesiólogo Elite: $50.000.000 → horas extras $500.000.

## Reglas de tratamiento

- Cada jugador puede recibir un solo intento de tratamiento por semana.
- El tratamiento puede ser exitoso o fallido.
- Si es exitoso, reduce la recuperación según el rendimiento del kinesiólogo contratado.
- Si falla, la lesión no se reduce y el jugador queda marcado como tratado esa semana.
- El botón masivo no repite tratamientos ya realizados.

## Animación progresiva

Al usar **Tratar a todos**, cada jugador se procesa uno por uno:

- se marca el jugador en curso;
- se espera una pausa configurable;
- se muestra éxito o fallo;
- luego avanza al siguiente lesionado.

Esto evita que todas las animaciones se ejecuten simultáneamente.

## Configuración editable

En `config.js`:

```js
empleados: {
  kinesiologoHorasExtrasPorcentajeSueldo: 0.01
},
ui: {
  kinesiologoTratamientoProgresivoMs: 650
}
```

## Archivos principales modificados

- `config.js`
- `js/core/01-config-constants.js`
- `js/game/10-academy-employees.js`
- `style.css`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`
