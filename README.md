# Fútbol Manager MVP - V6.34

## V6.34 - Corrección de cartas destruidas y reserva/activa

### Cambios principales
- Al destruir una carta en reserva, ahora se marca como destruida en el inventario global y se elimina de todas las listas visibles.
- La carta destruida entrega sus puntos de recuperación una sola vez y no vuelve a aparecer por sincronización global, historial o reparación de reserva.
- Se corrigió la desincronización donde una carta podía verse en reserva pero el sistema decía que ya estaba activa.
- Si una carta figura en reserva, esa ubicación pasa a ser la fuente válida y se limpia cualquier marca activa global vieja antes de activarla.
- Se mantiene la lógica de cartas activas compartidas entre partidas, pero sin permitir estados contradictorios.

### Comportamiento esperado
- Reserva: la carta se puede activar o destruir.
- Activa: la carta no aparece simultáneamente en reserva.
- Destruida: suma puntos y desaparece definitivamente del inventario utilizable.
- Cambio de club: las cartas activas vuelven a reserva si todavía tienen usos.

## Historial reciente
- V6.33: Mundial de Clubes cada 5 días.
- V6.32: Mundial de Clubes integrado en Calendario y puestos clasificatorios en tablas.
- V6.31: Copa Mundial de Clubes de la FIFA.
- V6.30: corrección de freeze de avance.
- V6.29: recuperación de desgaste bot.
- V6.28: forma rival y charlas moderadas.

## Archivos modificados en V6.34
- `index.html`
- `config.js`
- `js/game/15-especial.js`
- `README.md`

## Validación V6.34
- `node --check` ejecutado sobre los archivos JS.
- JSON de `data/` parseados correctamente.
- ZIP incremental y completo verificados sin errores.

## Notas de entrega
- La documentación de versión queda unificada en este README.
- No se incluyen archivos separados `REVISION_CODIGO`, `VERSION.md`, `CARACTERISTICAS_VERSION.md`, `AUDITORIA` ni `apps-script-ranking.gs`.
