# Una Vida de Mánager · V8.75 incremental

Aplicar sobre **V8.74** conservando la misma estructura de carpetas.

## Renovación de contratos de jugadores

- El club dirigido renueva contratos de forma manual desde `Primer equipo → Contratos`.
- Se puede negociar cuando restan dos temporadas o menos y la nueva propuesta extiende la vigencia existente.
- La negociación ofrece tres niveles salariales: ajustado, recomendado y generoso.
- La confianza individual modifica:
  - exigencia salarial;
  - posibilidad de aceptación;
  - cantidad máxima de temporadas ofrecibles;
  - predisposición para negociar antes del vencimiento.
- Un rechazo bloquea nuevas propuestas durante siete días y eleva levemente la siguiente exigencia.
- Los contratos vencidos no renovados del club dirigido pasan al mercado de libres al cerrar la temporada.
- Los clubes bots renuevan automáticamente. Su salario utiliza el ajuste anual por rendimiento ya existente, sin aplicar un segundo aumento duplicado.
- Las partidas anteriores reciben contratos migrados de dos a cuatro temporadas futuras para evitar salidas inmediatas.

## Control de plantel al inicio de temporada

- Desde el día 10 se controla la cantidad total y la distribución mínima por puestos.
- Si falta completar el plantel, se genera una advertencia diaria hasta el día 28.
- En el día 29, si el problema continúa, la directiva despide al mánager.
- Un mánager contratado después del día 10 no hereda retroactivamente este control de pretemporada.
- Los clubes bots continúan utilizando la reparación automática de planteles existente.

## Grupos y vestuario

- Nueva pestaña `Grupos` junto a Táctica para consultar:
  - referentes;
  - titulares;
  - rotación;
  - suplentes;
  - juveniles.
- Nueva pestaña `Contratos` dentro de Primer equipo.
- Vestuario separa Jugador y Grupo en columnas distintas.
- Jugador, grupo, rol interno, confianza, influencia, renovación y moral se ordenan con flechas ascendentes y descendentes.
- Vestuario y Contratos comparten una única escala de predisposición contractual.

## FACES

Se agregó `FACES/README.md` con la estructura regional acordada y la distribución recomendada de **5.000 imágenes**. Las ocho carpetas regionales ya están creadas.

## Archivos principales

- `config.js`
- `index.html`
- `js/game/05g-season-lifecycle.js`
- `js/game/05k-manager-dressing-room.js`
- `js/game/05n-player-contracts.js`
- `styles/185-player-contracts-groups.css`
- `FACES/README.md`

## Compatibilidad y validación

- Compatible con partidas de V8.74.
- No requiere Worker, SQL ni cambios externos.
- Se verificaron sintaxis JavaScript, JSON, referencias de scripts y estilos, migración contractual, negociación, rechazo, renovación automática de bots, vencimientos, advertencias y despido por plantel incompleto.
