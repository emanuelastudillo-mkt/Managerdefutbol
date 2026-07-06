# Características internas de versión · V3.02

## Tipo de versión
Versión menor dentro de V3: V3.02.

## Cambio principal
Mejora visual de la experiencia del Inicio y del avance de turnos.

## Último agregado o modificado
- Se agregó una vista tipo **oficina del manager** en el Inicio.
- Se agregaron alertas visuales accionables.
- Se agregó resumen persistente del último turno.
- Se agregó soporte para `favico.png`.
- Se actualizó la versión visible e interna a `V3.02`.
- Se corrigió una referencia interna de sponsors a un helper inexistente.

## Componentes visuales agregados
| Componente | Archivo | Función |
|---|---|---|
| Oficina del manager | `js/ui/06-render-home-messages.js` | Resume club, fase, presupuesto, posición, sponsors y próximo partido. |
| Alertas accionables | `js/ui/06-render-home-messages.js` | Muestra bloqueos, avisos y tareas pendientes con navegación directa. |
| Barras compactas | `js/ui/06-render-home-messages.js` + `style.css` | Representan media, físico, moral y cohesión. |
| Resumen de turno | `js/game/09-simulation-economy-training.js` + `js/ui/06-render-home-messages.js` | Guarda y muestra qué pasó al avanzar. |
| Favicon | `index.html` | Referencia `favico.png`. |

## Campos nuevos en partida
| Campo | Uso |
|---|---|
| `lastTurnSummary` | Guarda el resumen visual del último turno avanzado. |

## Compatibilidad
- Las partidas anteriores se normalizan con `lastTurnSummary: null` si no lo tenían.
- No se cambia la estructura de jugadores, clubes, sponsors ni fixtures.
- No se cambian las reglas de simulación de partidos.

## Riesgos pendientes
- El render de Inicio sigue en un archivo grande.
- Las alertas están calculadas en la UI, no en una capa de lógica separada.
- El resumen de turno usa datos agregados simples; más adelante puede ampliarse con eventos específicos de partido, entrenamiento y finanzas.

## Siguiente mejora sugerida
Crear una sección de **Noticias** con estética de diario deportivo y eventos generados automáticamente por resultados, mercado, lesiones, academia y sponsors.
