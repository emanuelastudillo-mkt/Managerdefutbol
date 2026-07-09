# Características V4.33 - Corrección entrenamientos guardados

## Cambios

- Corregido un error que bloqueaba la pestaña Entrenamiento después de guardar un plan.
- El problema venía de intentar recorrer el plan semanal guardado como si fuera una lista, cuando internamente es un objeto por día.
- El panel de entrenamientos guardados ahora es tolerante a datos incompletos o corruptos.
- Agregado botón para reiniciar sólo los entrenamientos guardados, sin borrar partida ni entrenamiento semanal actual.
- Agregada protección en Primer Equipo: si una subpestaña falla, vuelve a Táctica en vez de dejar la interfaz trabada.

## Motivo

El guardado de entrenamientos funcionaba, pero al volver a renderizar la pestaña se rompía la lectura del resumen del plan guardado. Esta versión corrige la lectura y agrega defensas para que un preset dañado no bloquee Primer Equipo.
