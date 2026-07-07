# Características de versión - V3.43

## Ajuste de simulación: enfoque jugadorista

Se ajustó el motor de partido para que ciertos jugadores tengan más peso real en los momentos decisivos sin eliminar la importancia colectiva del equipo.

### Balance aplicado

- 70% fuerza colectiva.
- 30% impacto individual.

La fuerza colectiva sigue definiendo volumen de ataques, posesión, presión y cantidad de ocasiones. El impacto individual interviene en la resolución de cada ocasión: rematador, defensor implicado y arquero.

### Nuevas estadísticas visibles

- **Tapadas clave POR**: atajadas importantes de los arqueros en ocasiones de alto peligro.
- **Errores**: fallos defensivos o del arquero que generan peligro.
- **Errores de gol**: errores que terminan directamente en gol rival.

Estas estadísticas aparecen en:

- visor progresivo del partido;
- ficha completa del partido;
- ficha de temporada del jugador.

### Cambios deportivos

- Los delanteros y extremos tienen mucho más peso en goles de jugada.
- Los mediocampistas ofensivos pueden seguir definiendo partidos.
- Los defensores tienen menos peso como goleadores de jugada normal.
- Los defensores mantienen opción real de gol en pelota parada.
- Los arqueros ahora pueden destacarse por tapadas clave.
- Los jugadores con baja serenidad, posicionamiento o disciplina pueden cometer más errores.

### Configuración editable

```js
simulador: {
  pesoColectivo: 0.70,
  pesoIndividual: 0.30,
  probabilidadPelotaParada: 0.14,
  probabilidadErrorTerminaEnGol: 0.28,
  maximoErroresPorEquipo: 5
}
```
