# Características internas de versión · V3.03

## Tipo de versión
Versión menor dentro de V3: V3.03.

## Cambio principal
Ajuste de experiencia en la simulación visual de partidos.

## Último agregado o modificado
- Se retrasó el aviso superior de lesionados o expulsados propios.
- El aviso ya no se muestra al inicio de la visualización del partido.
- El aviso aparece recién al llegar al final de la visualización o después de usar **Finalizar partido**.
- Se actualizó la versión visible e interna a `V3.03`.

## Componentes modificados
| Componente | Archivo | Cambio |
|---|---|---|
| Simulación de jornada | `js/game/09-simulation-economy-training.js` | El mensaje final se encapsula como callback diferido. |
| Modal de partido | `js/ui/12-modals.js` | Acepta una acción `onRevealComplete` y la ejecuta sólo al llegar al final. |
| Versión visible | `index.html` + `config.js` | Actualización a V3.03. |

## Compatibilidad
- No cambia estructura de partida.
- No cambia JSON de datos.
- No cambia reglas de partido, lesiones, tarjetas ni economía.

## Riesgos pendientes
- La simulación todavía se calcula completa antes de mostrarse; la visualización sólo revela el resultado por etapas.
- En una mejora futura convendría separar el “resultado administrativo posterior al partido” del modal de visualización.

## Siguiente mejora sugerida
Crear una pantalla posterior al partido con secciones separadas: resultado, rendimiento, consecuencias médicas, sanciones y tareas pendientes del manager.
