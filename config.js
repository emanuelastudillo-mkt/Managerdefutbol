# Características de la versión V5.36

## Plantilla manual con nombres visibles

- Corrige `data/jugadores_manual_ejemplo.json` para que use nombres editables del juego en lugar de nombres técnicos internos.
- Reemplaza la estructura anterior por campos en español: `nombre`, `edad`, `posicion`, `jugadorLibre`, `media`, `habilidades`, `economia`, `foto`, `mercado` y `origen`.
- El bloque `habilidades` ahora usa atributos visibles: `ataque`, `defensa`, `tiro`, `pase`, `velocidad`, `cabezazo`, `resistencia`, `agresividad`, `genetica`, `factorSorpresa`, `potencial`, `liderazgo`, `disciplina` y `trabajoEquipo`.
- Agrega reglas de rango para habilidades: valores generales de 1 a 99 y `factorSorpresa` de 0 a 20.
- Agrega equivalencias específicas para arqueros: ataque/salto, tiro/potencia, velocidad/reflejos y cabezazo/mando.
- Mantiene `foto` como ruta personalizada de imagen por jugador.

## Alcance

- No agrega pantalla de edición manual todavía.
- No carga automáticamente el JSON nuevo.
- No modifica generación automática, mercado, planteles ni partidas guardadas.
- El importador futuro deberá convertir esta estructura amigable al modelo interno del juego.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida; es una corrección de plantilla/documentación para futura carga manual.
