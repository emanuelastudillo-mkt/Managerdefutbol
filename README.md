# Una vida de manager — V8.63

## Base requerida

Aplicar este incremental sobre **V8.62**.

## Cambios

### Limpieza de textos sobre imágenes

- Se quitaron los textos superpuestos que indicaban **“Fase visual X/10”** en el estadio.
- También se retiró la referencia equivalente de fases visuales en la imagen de juveniles de Tu Academia.
- Los indicadores útiles de estado, nivel y capacidad permanecen visibles mediante sus etiquetas principales.

### Sponsors fuera de Estadio e instalaciones

- Se eliminó el bloque duplicado de sponsors de la pantalla principal de **Estadio e instalaciones**.
- Las ofertas, espacios y contratos activos continúan disponibles exclusivamente desde el submenú **Sponsors**.
- No se modificó la generación, pago ni vencimiento de contratos.

### Continuidad al terminar la temporada

- Al finalizar una temporada ya no aparece la selección directa de otro club.
- El manager sólo puede comenzar la temporada siguiente con su club actual.
- Los cambios de equipo deben realizarse mediante una oferta laboral o una solicitud enviada por el manager.
- Se añadió una validación interna que bloquea intentos de cambiar directamente el identificador del club durante el cierre de temporada.
- El inicio de una nueva partida y el inicio explícito de una carrera de club fundador conservan la selección inicial de club.

## Compatibilidad

- Compatible con partidas existentes de V8.62.
- No altera sponsors activos, contratos laborales, tablas ni calendarios guardados.
- No requiere cambios de Worker, SQL ni recursos gráficos.

## Archivos modificados

- `config.js`
- `index.html`
- `js/game/05d-founder-career.js`
- `js/game/05g-season-lifecycle.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/10-academy-employees.js`
- `js/ui/06-render-home-messages.js`
