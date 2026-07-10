# Características de la versión V5.54

## V5.54 - Nuevas cartas de habilidades

- Se agregan cartas de Ídolo del Club con bonus a hinchas/socios ganados por resultados positivos.
- Se agregan cartas de Entrenador Táctico: al activarse suman cohesión una sola vez y quedan fijas por 100 días.
- Se agregan cartas de Especialista en Libres con bonus a la aceptación de jugadores libres.
- Se agregan cartas de Preparación Física con bonus bajo a la recuperación postpartido del club del manager.
- Ninguna de estas nuevas familias usa tope interno de apilamiento.
- Se actualiza el resumen de cartas activas para mostrar bonus porcentuales, relativos y puntos de cohesión con texto correcto.
- No se modifican sobres, costos, cantidad de cartas activas, bloqueo de 100 días ni probabilidades de rareza.

## Validación

- `node --check` ejecutado sobre todos los JS.
- JSON de `data/` parseados correctamente.
- ZIP incremental y completo generados desde V5.53.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. Las cartas nuevas aparecen en futuras aperturas de sobres.
