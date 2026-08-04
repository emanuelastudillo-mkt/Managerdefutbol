# V9.68 · Copa Chile desbloqueada

Esta versión parte de V9.67 y corrige las copas nacionales que podían permanecer indefinidamente en estado `Pendiente`, especialmente la fase previa de Copa Chile.

## Corrección principal

El verificador ahora reconstruye también la asignación interna de participantes cuando una copa figura como sorteada, pero perdió o heredó incompletas sus listas de clubes.

- Copa Chile recupera 18 participantes.
- 14 clubes conservan el pase directo a octavos.
- 4 clubes disputan los 2 cruces de fase previa.
- Si la fecha quedó atrás, tanto la ronda como cada partido se trasladan a la nueva fecha.
- Al terminar la previa, octavos se genera y verifica inmediatamente.

Ver `AJUSTES-V9.68.md`.
