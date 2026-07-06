# Versión V3.03

## Objetivo de la versión

Corregir un problema de experiencia durante la simulación visual del partido: el aviso superior informaba lesiones o expulsiones antes de que la visualización llegara al final del encuentro.

## Ajuste principal

### Aviso diferido de lesiones y expulsiones
- Antes: después de simular internamente la jornada, el juego abría la visualización del partido y al mismo tiempo mostraba arriba el aviso de lesionados o expulsados propios.
- Ahora: el aviso queda diferido hasta que la visualización llega al minuto final.
- Si se usa el botón **Finalizar partido**, primero se muestra el resultado final y recién después aparece el aviso.

## Archivos modificados
- `config.js`
- `index.html`
- `js/game/09-simulation-economy-training.js`
- `js/ui/12-modals.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

## Validación realizada
- `node --check app.js`: correcto.
- `node --check config.js`: correcto.
- `node --check simulador-2.0.js`: correcto.
- `node --check js/core/*.js`: correcto.
- `node --check js/data/*.js`: correcto.
- `node --check js/game/*.js`: correcto.
- `node --check js/ui/*.js`: correcto.
- `data/jugadores.json`: JSON válido.
- `data/sponsors.json`: JSON válido.
- `data/Liga Argentina.json`: JSON válido.

## Observaciones de revisión
- No se alteró el motor de simulación. El partido sigue calculándose al avanzar la jornada; sólo se cambia cuándo se comunica el aviso al usuario.
- La mejora protege la ilusión de visualización en vivo sin tocar lesiones, tarjetas, suspensiones ni limpieza automática de táctica.
- Sigue pendiente una posible mejora futura: que la simulación revele eventos de manera más granular y que ciertas consecuencias administrativas aparezcan como resumen posterior al partido.

## Compatibilidad
- Compatible con partidas V3.01 y V3.02.
- No requiere reiniciar partida.
- No requiere cambios en archivos JSON.
