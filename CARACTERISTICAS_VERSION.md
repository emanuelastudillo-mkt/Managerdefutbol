# Características internas de versión · V3.06

## Tipo de versión
Versión menor dentro de V3.

## Último agregado o modificado
- Ordenamiento especial para columnas `POS`/`Pos.` con orden ascendente `POR → DEF → MED → DEL` y descendente `DEL → MED → DEF → POR`.
- Pantalla de táctica actualizada: se elimina el arrastre y se implementa intercambio por clic entre pizarra, titulares, suplentes y reservas.
- Reducción de cláusulas a una décima parte del valor calculado anterior, sin modificar sueldos.
- Feedback visual de acciones con resultado: carga breve, éxito verde o fallo rojo para tratamientos y charla motivacional.
- Límite mínimo de plantel: 18 jugadores.
- Límite máximo de plantel: 42 jugadores.
- Bloqueo de fichajes y promociones desde academia al llegar a 42 jugadores.
- Bloqueo de ventas, despidos y ofrecimientos activos si el club quedaría por debajo de 18 jugadores.
- Corrección de favicon: `favicon.png` en raíz.
- Simulador V2.0 con 30 bloques internos de 3 minutos y visualización con 30 fases configurables.
- Rebalance menor en selección de goleadores y expulsiones.

## Componentes modificados
| Componente | Archivo | Cambio |
|---|---|---|
| Configuración | `config.js` | Agrega límites mínimo/inicial/máximo de plantel, fases/duración del simulador visual y escala separada de cláusulas. |
| Constantes | `js/core/01-config-constants.js` | Lee los nuevos valores de configuración, incluida `PLAYER_CLAUSE_VALUE_SCALE`. |
| Plantel y cláusulas | `js/core/03-player-tactics-utils.js` | Agrega helpers de mínimo/máximo, actualiza validaciones y recalcula cláusulas con escala independiente. |
| Mercado/ventas | `js/ui/06-render-home-messages.js` + `js/ui/12-modals.js` | Bloquea ventas/despidos si rompen el mínimo. |
| Academia | `js/game/10-academy-employees.js` | Usa el máximo de plantel existente para impedir promociones cuando el plantel está completo. |
| Favicon | `index.html` | Cambia `favico.png` por `favicon.png?v=3.04`. |
| Visualización de partido | `js/ui/12-modals.js` | Reemplaza 6 etapas fijas por fases generadas dinámicamente. |
| Bloques del simulador | `simulador-2.0.js` | Reemplaza 6 bloques de 15 minutos por 30 bloques de 3 minutos, con escala de ataques, chances, faltas y xG. |
| Simulador 2.0 | `simulador-2.0.js` | Refuerza peso ofensivo de delanteros y reduce expulsiones del arquero. |
| Motor fallback | `js/game/11-match-engine.js` | Mantiene los mismos criterios si no carga `simulador-2.0.js`. |
| Feedback de acciones | `js/core/02-ui-utils.js` + `js/game/10-academy-employees.js` + `style.css` | Agrega animación de carga y resultado visual verde/rojo para acciones que pueden fallar. |
| Interacción táctica | `js/game/05-state-season.js` | Agrega helpers para localizar, validar e intercambiar jugadores por clic. |
| Pantalla de táctica y orden POS | `js/ui/07-render-team-market.js` | Reemplaza elementos arrastrables por botones seleccionables, resalta la selección activa y agrega ordenamiento `POR/DEF/MED/DEL` para posición. |
| Entrenamiento | `js/game/09-simulation-economy-training.js` | Agrega ordenamiento especial para la columna `POS` en la tabla de entrenamiento. |
| Estilos de táctica | `style.css` | Agrega estados visuales de selección, ayuda contextual y hover para intercambio por clic. |



## Ajuste de ordenamiento POS V3.06
- La columna `POS`/`Pos.` ahora puede ordenarse por familia táctica.
- Ascendente: `POR → DEF → MED → DEL`.
- Descendente: `DEL → MED → DEF → POR`.
- `DEF` agrupa LD, LI y DFC.
- `MED` agrupa MCD, MC, MI, MD y MCO.
- `DEL` agrupa ED, EI y DC.
- Se aplica en Plantel, Entrenamiento y Jugadores.

## Ajuste táctico conservado de V3.05
- La pantalla táctica deja de usar arrastre.
- El usuario hace click en un jugador para seleccionarlo y luego click en otro para intercambiarlos.
- El sistema funciona con los mismos jugadores representados en la pizarra, la lista de titulares, suplentes y reservas.
- El intercambio respeta las restricciones existentes: portero sólo en POR, lesionados no titulares, lesionados leves sólo como suplentes y suspendidos fuera de convocatoria.
- Cuando cambia la convocatoria, se limpian reglas de cambios automáticos que hayan quedado inválidas.

## Ajuste económico de cláusulas
- La nueva clave `economia.escalaClausulas` permite bajar o subir sólo las cláusulas.
- Valor actual: `0.10`, equivalente a una décima parte del cálculo previo.
- `economia.escalaSueldosYClausulas` se mantiene igual para no tocar sueldos.
- `ensurePlayerEconomics()` recalcula cláusulas siempre, pero sólo genera sueldo cuando falta o es inválido.

## Reglas de plantel
- Mínimo: `18`.
- Inicial recomendado: `25`.
- Máximo: `42`.
- El máximo considera jugadores actuales más transferencias pendientes.
- El mínimo protege acciones que sacarían jugadores del club.

## Nota sobre el simulador
Los delanteros ya tenían más probabilidad de convertir, pero el peso relativo era moderado. En V3.04 se aumentó ese sesgo para que DC, ED y EI sean goleadores más frecuentes. También se corrigió la selección disciplinaria del arquero, que podía quedar demasiado expuesto a tarjetas y rojas directas.

## Ajuste visual dentro de V3.04
- Las acciones `Tratar` y `Llamar al psicólogo motivacional` ahora muestran un estado intermedio de procesamiento antes de revelar el resultado.
- El resultado conserva el mensaje funcional anterior, pero el botón también cambia visualmente a verde o rojo.
- No cambia la probabilidad de éxito/fallo de ninguna acción.

## Riesgos pendientes
- La simulación se calcula completa al avanzar jornada, pero ahora el motor V2.0 también divide el partido en 30 bloques internos de 3 minutos. La visualización muestra 30 fases progresivas del resultado calculado.
- Las partidas antiguas con planteles fuera de regla no se corrigen automáticamente.
