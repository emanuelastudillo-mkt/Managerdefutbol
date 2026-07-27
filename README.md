# Una vida de manager — V8.62

## Base requerida

Aplicar este incremental sobre **V8.61**.

## Cambios

### Sponsors locales por liga

- El **50% aproximado** de las ofertas de sponsors se selecciona entre marcas vinculadas al país de la liga del club.
- El otro 50% proviene de marcas globales o de otros mercados.
- Se agregaron grupos locales para Argentina, Chile, Brasil, Inglaterra, España, Italia y Rumania.
- La misma regla se utiliza al heredar sponsors activos al asumir un club durante la temporada.

### Pago por reputación de liga

- El pago base ahora incorpora la reputación promedio anual de la división.
- Las ligas de menor reputación aplican una reducción progresiva.
- Las ligas de mayor reputación aplican un aumento progresivo.
- El multiplicador configurable varía entre **0,70 y 1,30**.

### Pago por posición en tabla

- La posición dejó de otorgar únicamente bonificaciones.
- Los equipos de la zona baja reciben una reducción progresiva.
- Los equipos de la zona alta reciben un aumento progresivo.
- El multiplicador configurable varía entre **0,80 y 1,20**.
- Antes de que se juegue la primera fecha, el multiplicador de tabla queda neutral en 1,00.

## Compatibilidad

- Compatible con partidas existentes de V8.61.
- Los contratos de sponsor ya aceptados conservan sus importes.
- Los nuevos criterios se aplican a ofertas generadas desde V8.62 y a sponsors heredados al asumir un nuevo club.
- No requiere cambios de Worker ni SQL.

## Archivos modificados

- `config.js`
- `index.html`
- `data/sponsors.json`
- `js/core/01-config-constants.js`
- `js/game/08-sponsors-stadium-stats.js`
