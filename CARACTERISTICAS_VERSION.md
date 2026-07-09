# V4.10 - Precio dinámico de entradas bots

## Cambios principales

- Los clubes bots locales ajustan automáticamente el precio de entrada según el prestigio del rival.
- Rival de prestigio bajo: precio base de $100.
- Rival de prestigio medio: precio entre $150 y $200.
- Rival de prestigio alto: precio entre $200 y $500.
- El club del manager conserva el precio manual de entrada.
- El precio automático se calcula por partido y no modifica permanentemente el precio base del club bot.
- `Atracción rival` pasa a mostrarse como `Demanda extra por rival` para aclarar que ese bonus afecta asistencia.
- El contexto del partido muestra cuando el precio fue automático de bot, el nivel del rival y el multiplicador aplicado.

## Archivos modificados

- `index.html`
- `config.js`
- `VERSION.md`
- `README.md`
- `CARACTERISTICAS_VERSION.md`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/ui/12-modals.js`

## Validaciones

- Sintaxis validada en `config.js`.
- Sintaxis validada en todos los archivos `.js`.
- Prueba lógica de precio automático para rivales de prestigio bajo, medio y alto.
