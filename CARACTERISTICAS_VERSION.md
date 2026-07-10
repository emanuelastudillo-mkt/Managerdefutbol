# Características de la versión V5.45

## Resultado de partido

- El bloque **Contexto del partido** deja de quedar tapado por estadísticas, eventos o bloques inferiores.
- En la simulación visual, el contexto se ubica antes del bloque dinámico del partido y queda protegido con `z-index` y tamaño propio.
- En el resultado histórico, el contenido se envuelve en `match-result-shell`, con scroll interno seguro.

## Centro de Ojeo

- Se agrega una tarjeta de **Informes guardados y archivados**.
- **Informes guardados** muestra todos los informes de jugadores registrados.
- **Archivados** muestra sólo los informes de jugadores que ya no están en la lista activa.
- La lista permite hacer clic sobre un jugador para abrir su ficha.
- Los equipos no se archivan; sus informes siguen siendo dinámicos porque sus porcentajes pueden cambiar si el bot cambia jugadores.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida.
