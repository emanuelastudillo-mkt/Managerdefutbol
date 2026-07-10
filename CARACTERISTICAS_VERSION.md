# V5.33 - Integridad diaria de partidos bot

## Cambios
- Se corrige `markScheduledResult()` para que el fixture guarde el paquete completo del resultado: goles, tarjetas, lesiones, tapadas, errores, estadísticas, titulares y jugadores utilizados.
- Se agrega una verificación automática de integridad de partidos bot al avanzar el calendario.
- Si un partido bot ya fue jugado pero quedó sin datos mínimos, el sistema primero intenta recuperar los datos desde `game.matchHistory`.
- Si no existe historial completo, el sistema agrega datos mínimos conservadores preservando el marcador ya registrado.
- La reparación no vuelve a aplicar tabla, economía, disponibilidad, desgaste ni estadísticas acumuladas, para evitar duplicaciones.
- El avance de calendario se bloquea si quedan partidos jugados sin datos mínimos que no pueden repararse de forma segura.
- El verificador manual ahora también puede completar estadísticas mínimas faltantes de partidos bot.

## Criterio de rendimiento
- La verificación se ejecuta cada día porque el escaneo es liviano: sólo revisa fixtures jugados y sólo genera datos cuando detecta un caso roto.
- No se re-simula toda la fecha completa, salvo que el partido aún no haya sido jugado por el flujo normal del calendario.

## Validación
- `node --check` aplicado sobre todos los archivos JS.
- JSON de `data/` parseados correctamente.

## Compatibilidad
Se implementa solo. No requiere reiniciar partida porque los campos agregados son datos complementarios sobre fixtures ya existentes.
