# Características de la versión V5.52

## V5.52 - Cartas blancas, avisos de asistente, ojeo persistente y mercado reducido

- Rediseño visual de cartas especiales con fondo blanco, textura limpia y acentos por rareza.
- Consejos del asistente destacados en la bandeja de mensajes y en las alertas de Oficina Manager.
- Indicador rojo de mensaje pendiente del asistente cuando hay consejos sin leer.
- Avisos/confirmaciones visuales integrados al estilo de tarjetas del juego.
- El botón **Ojear** desde ficha de jugador ya no cierra la ficha ni cambia de pantalla.
- Jugadores con informe de ojeo muestran icono de ojo junto al nombre en plantel y mercado.
- Mercado optimizado: los listados visibles se reducen a jugadores ojeados + 50 aleatorios por ventana semanal.
- Jugadores contratados aleatorios priorizan la misma división/liga del manager.
- Jugadores libres aleatorios priorizan nacionalidad local del país del club.

## Validación

- `node --check` ejecutado sobre todos los JS.
- JSON de `data/` parseados correctamente.
- ZIP incremental y completo generados desde V5.51.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida.
