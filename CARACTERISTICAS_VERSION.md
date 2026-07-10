# Características de la versión V5.35

## Plantilla de jugadores manuales

- Agrega `data/jugadores_manual_ejemplo.json` como base para una futura creación manual/importación de jugadores.
- Incluye estructura completa compatible con el modelo actual: `id`, `name`, `age`, `position`, `clubId`, `freeAgent`, `nationality`, `overall`, `skills`, `salary`, `clause`, `value` y `generation`.
- Incluye las 20 habilidades requeridas por el sistema actual.
- Agrega `photoPath` como ruta de foto personalizada por jugador.
- Incluye un ejemplo de jugador asignado a un club y otro ejemplo de jugador libre.
- Agrega soporte pasivo en `faceImg()` para que, si un jugador tiene `photoPath`, la UI use esa foto antes de recurrir a las caras automáticas por nacionalidad.

## Alcance

- No agrega pantalla de edición manual todavía.
- No carga automáticamente el JSON nuevo.
- No modifica generación automática, mercado, planteles ni partidas guardadas.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida; es una plantilla de datos y una mejora visual pasiva para futuros jugadores importados.
