# Versión V2.29

## Ajustes principales

### Pizarra táctica
- Se corrigió la ubicación visual de los roles en cancha.
- Los extremos `ED` y `EI` dejan de aparecer como mediocampistas en formaciones donde quedaban mal alineados.
- Las columnas visuales se calculan por rol: portero, defensa, mediocampo defensivo, mediocampo, mediapunta y ataque.

### Autoselección
- `Mejor once` ahora usa jugadores compatibles con cada slot.
- El portero siempre debe ser `POR`.
- Un portero no puede ocupar puestos de campo.
- Se evita que `Mejor once` arme titulares penalizados por jugar fuera de zona.
- `Mejor condición física` mantiene su lógica de priorizar estado físico, pero también respeta la regla estricta del portero.

## Compatibilidad
- Mantiene guardado local por navegador.
- Mantiene `data/jugadores.json` de V2.27.
- No incluye `assets/pitch-board.png`.
