# Versión V3.43 - Simulador jugadorista 70/30

## Cambios principales

- El simulador ahora mezcla **70% fuerza colectiva** y **30% impacto individual** en la definición de ocasiones.
- Las ocasiones importantes eligen protagonistas reales: rematador, defensor implicado y arquero.
- Se redujo la frecuencia de goles de defensores en jugadas normales.
- Los defensores siguen pudiendo marcar, pero con mayor peso en pelota parada.
- Se agregaron estadísticas visibles de partido:
  - Tapadas clave POR.
  - Errores.
  - Errores de gol.
- El visor progresivo del partido también muestra tapadas clave y errores como eventos.
- La ficha completa del partido incluye bloques de tapadas clave y errores.
- Las estadísticas de temporada del jugador ahora registran tapadas clave, errores y errores de gol.

## Configuración nueva

```js
simulador: {
  pesoColectivo: 0.70,
  pesoIndividual: 0.30,
  probabilidadPelotaParada: 0.14,
  probabilidadErrorTerminaEnGol: 0.28,
  maximoErroresPorEquipo: 5
}
```

## Archivos modificados

- `config.js`
- `simulador-2.0.js`
- `js/game/11-match-engine.js`
- `js/game/05-state-season.js`
- `js/game/10-academy-employees.js`
- `js/ui/12-modals.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`
