# V8.88 INCREMENTAL

Aplicar sobre **V8.87**.

## Táctica personalizada

- El botón `Personalizada · prueba` pasa a llamarse `Personalizada`.
- Se retira la palabra `provisoria` de la descripción visible.
- La sección de espacios pasa a llamarse `Tácticas guardadas`.

## Corrección del guardado y carga

Las tácticas personalizadas ya no dependen únicamente de dos arreglos paralelos de jugadores y casillas.

Cada espacio guarda ahora una asociación explícita:

- `cellId`: casilla táctica.
- `playerId`: jugador asignado a esa casilla.

Esto evita que una normalización, lesión, suspensión o migración desplace jugadores a posiciones diferentes.

## Compatibilidad

- Los espacios guardados anteriormente se migran automáticamente al nuevo formato.
- Se reconocen los modos antiguos `personalizada-prueba`, `personalizada prueba` y `personalizada`.
- Los jugadores lesionados o suspendidos permanecen en la posición guardada; la táctica informa que deben revisarse antes de confirmar.
- Sólo queda un hueco cuando el jugador ya no pertenece al club.
- Se eliminan duplicados de jugadores o casillas dañadas sin alterar el resto de la distribución.

## Verificación

- Guardado y carga exacta de las once asociaciones jugador/casilla.
- Migración del formato anterior.
- Recuperación desde arreglos antiguos desordenados.
- Conservación de jugadores temporalmente no disponibles.
- Sintaxis de todos los archivos modificados.
