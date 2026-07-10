# Características de la versión V5.43

## Ojeo de equipos progresivo

- Defensa, Medios y Delantera pasan a funcionar como tres parámetros de informe.
- El Centro de Ojeo revela esos parámetros de a uno, igual que las habilidades de un jugador.
- Mientras un parámetro no fue revelado, se muestra como `—`.
- Cuando se revela, muestra el porcentaje actual calculado sobre el plantel bot.
- El valor sigue siendo dinámico y puede cambiar si el bot ficha, vende o recompone plantel.

## Corrección de procesamiento diario

- Se evita que una variable local llamada `seed` bloquee el acceso al `seed` global del juego durante el proceso de ojeo.
- Se mejora la distribución de intentos diarios para que varios jugadores propios en seguimiento avancen de forma más pareja.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida.

