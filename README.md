# Una vida de manager — V8.65

## Base requerida

Aplicar este incremental sobre **V8.64**.

## Cambio

### Información general sin duplicar en Inicio

- La pantalla de Inicio ya no vuelve a mostrar el escudo, nombre del club ni la referencia de fase/fecha dentro de la Oficina del manager.
- La información general de la carrera continúa visible una sola vez en el panel lateral: club, temporada, día y fecha.
- La Oficina del manager conserva sus datos útiles: posición, plantel, presupuesto, promedio de puntos, objetivo, estado del equipo y próximo partido.

## Compatibilidad

- Compatible con partidas existentes de V8.64.
- No modifica calendarios, contratos, tácticas, sponsors, planteles ni guardados.
- No requiere cambios de Worker, SQL ni recursos gráficos.

## Archivos modificados

- `config.js`
- `index.html`
- `js/ui/06-render-home-messages.js`
