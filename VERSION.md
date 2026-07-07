# Fútbol Manager MVP - V3.35

Corrección bloqueante sobre V3.34.

## Cambio principal
- Se corrigió el error de arranque causado por usar `clamp()` dentro de `js/core/01-config-constants.js` antes de que esa función estuviera cargada.
- Nueva partida, reset y carga inicial vuelven a funcionar.
- Se mantiene el fix anterior del sistema de sobres y reserva.
