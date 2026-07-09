# Características V4.27 - Verificador, simulador y ranking automático

- Verificador ampliado: controla que los partidos bot jugados tengan estadísticas mínimas de goleadores, asistentes, tarjetas, lesiones, tapadas y errores.
- Simulador visual: debajo de las estadísticas laterales de cada equipo se listan goleadores, asistentes, amonestados, expulsados y lesionados.
- Oficina: se agrega un bloque grande de `Días restantes` sobre `Próximo compromiso`.
- El bloque `Resumen del último avance` queda al final de la pantalla principal.
- Pantalla de táctica: instrucciones de partido al lateral izquierdo de la pizarra.
- Pantalla de táctica: instrucciones zonales/estilos por sector al lateral derecho de la pizarra.
- Los avisos superiores del avance automático dejan de quedar fijos.
- Ranking automático reforzado: al cierre de temporada y despido se hacen reintentos y se prueba formato JSON y formato `payload` compatible.

## Compatibilidad

- Se implementa solo.
- No requiere reinicio.
- Las verificaciones de partidos bot aplican sobre partidos ya jugados, pero no reconstruyen estadísticas faltantes.
- El ranking automático se refuerza desde el próximo cierre/despido; eventos anteriores pendientes pueden reintentarse si siguen guardados como error o pendiente.
