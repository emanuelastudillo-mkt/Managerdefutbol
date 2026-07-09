# Características V4.24 - Avance no bloqueante, economía negativa y simulador compacto

- `Ir a próximo partido` ya no muestra una pantalla de carga bloqueante durante el avance automático.
- El avance automático se integra al bloque actual de avance con spinner, barra de progreso y estado del día procesado.
- El jugador puede seguir viendo la pantalla mientras el juego avanza días hasta el próximo partido.
- El contexto del partido se vuelve más compacto para ahorrar espacio en el simulador.
- La cruz de cierre del simulador queda alineada a la derecha.
- La economía del club ahora puede quedar en negativo.
- Los gastos recurrentes no se pierden cuando el presupuesto llega a $0: se descuentan y generan saldo negativo.
- Los saldos negativos se muestran con signo menos y color rojo en Oficina, Finanzas e historial.
- Se elimina el bloque final de fase `Minuto 90 / Final / Resultado final...` del simulador visual para reducir ruido y ahorrar espacio.
