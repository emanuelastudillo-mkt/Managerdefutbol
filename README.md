# Fútbol Manager MVP - V6.36

## V6.36 - Corrección de cuotas semanales de préstamos

- Corregido el cobro de préstamos bancarios para que se aplique como máximo una cuota semanal por fecha real de juego.
- Eliminado el catch-up agresivo que podía cobrar hasta 10 cuotas juntas cuando `nextPaymentDate` quedaba atrasado o se procesaba más de una vez.
- Agregada protección `lastScheduleCheckDate` para evitar dobles cobros el mismo día.
- Agregada reparación de sobrecobros en préstamos activos: si la partida ya tenía más cuotas cobradas que las permitidas por los días transcurridos desde el inicio del préstamo, se devuelve el exceso al presupuesto y se recalcula deuda restante.
- La visualización de préstamos conserva semanas restantes, deuda restante y próxima cuota.

### Archivos modificados en V6.36

- `index.html`
- `config.js`
- `js/game/09-simulation-economy-training.js`
- `README.md`

### Validación V6.36

- `node --check` en todos los JavaScript.
- JSON de `data/` parseados correctamente.
- ZIP incremental y completo verificados sin errores.

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