# Fútbol Manager MVP - V6.35

## V6.35 - Ordenamiento compacto de jugadores y columna Habilidad

### Cambios principales

- En las tablas de jugadores se reemplazaron los selectores largos de orden por dos flechas compactas:
  - ↑ orden ascendente.
  - ↓ orden descendente.
- En columnas de posición, el orden mantiene la jerarquía interna definida del juego.
- En columnas de texto, el orden usa A-Z y Z-A.
- En columnas numéricas, el orden usa menor/mayor o mayor/menor según la flecha.
- En Plantel, la columna **Resistencia** pasó a llamarse **Habilidad**.
- La columna Habilidad permite elegir cualquiera de las 7 habilidades visibles:
  - Ataque/Salto
  - Defensa
  - Pase
  - Velocidad/Reflejos
  - Cabezazo/Mando
  - Tiro/Potencia
  - Resistencia
- La habilidad elegida se muestra en la columna y se puede ordenar con flechas.
- El cambio se aplicó a Plantel, Entrenamiento y Jugadores para reducir ancho de cabeceras.

### Archivos modificados en V6.35

- `index.html`
- `config.js`
- `style.css`
- `js/core/01-config-constants.js`
- `js/ui/07-render-team-market.js`
- `js/game/09-simulation-economy-training.js`
- `README.md`

### Validación V6.35

- `node --check` ejecutado sobre todos los archivos JS.
- JSON de `data/` parseados correctamente.
- ZIP incremental y ZIP completo verificados sin errores.

---

## Notas de instalación

Usar la versión completa para reemplazar todo el proyecto o aplicar el ZIP incremental sobre V6.34.
