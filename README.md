# Una vida de manager — V8.67

## Base requerida

Aplicar este incremental sobre **V8.66**.

## Ajustes

### Presentación del objetivo

- El bloque de objetivo de la Oficina del manager ahora separa la información por jerarquía visual.
- **Objetivo** se muestra como etiqueta pequeña.
- El valor, por ejemplo **0.94**, se muestra en tamaño destacado.
- La etapa contractual, por ejemplo **mínimo año 1**, se muestra debajo en texto pequeño.
- La reducción de la carta se muestra únicamente como porcentaje entre paréntesis, por ejemplo **(-1%)**, sin repetir la palabra “Carta”.

### Moral y cohesión después de una derrota

- Una derrota resta **2 puntos adicionales de moral** a cada jugador del plantel, además del efecto que ya tenía el resultado.
- En una derrota no se aplica la ganancia base de cohesión por partido.
- Cada gol recibido en una derrota resta **1 punto de cohesión**.
- Las sustituciones y expulsiones mantienen sus penalizaciones de cohesión actuales.

## Compatibilidad

- Compatible con partidas existentes de V8.66.
- No reinicia temporadas, contratos, moral, cohesión ni planteles.
- No requiere cambios de Worker, SQL ni recursos gráficos.

## Archivos modificados

- `README.md`
- `config.js`
- `index.html`
- `js/core/01-config-constants.js`
- `js/game/09a-team-cohesion-summary.js`
- `js/game/09d-stadium-condition-morale.js`
- `js/ui/06-render-home-messages.js`
- `styles/10-layout-navigation.css`
