# Características de la versión V5.38

## Jugadores manuales WEBP y retiro persistente

- Cambia las rutas de foto de los jugadores manuales activos a formato `.webp`.
- Mantiene a Ronaldinho, Gianluigi Buffon, David Beckham, Paolo Maldini, Diego Maradona, Zinedine Zidane y Pele asignados a los clubes acordados desde el inicio de la partida.
- Agrega control persistente de retiro para jugadores manuales.
- Si un jugador manual se retira, queda registrado en `game.manualRetiredPlayerIds` y no vuelve a insertarse automáticamente al cargar la partida.
- Agrega la bandera `reapareceAlRetirarse: false` en el bloque `mercado` de los jugadores manuales activos.
- Actualiza la plantilla `data/jugadores_manual_ejemplo.json` para usar `.webp` en los ejemplos.

## Alcance

- No agrega pantalla de edición manual todavía.
- No modifica contratos, cláusulas, medias ni habilidades de los 7 jugadores manuales.
- No modifica la lógica general de mercado ni la generación automática de jugadores comunes.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. Las partidas existentes cargan la nueva regla; los retiros futuros de jugadores manuales ya quedan protegidos contra reaparición automática.
