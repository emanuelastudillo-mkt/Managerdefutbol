# Fútbol Manager MVP - V6.42

## V6.42 - Fallback de escudo para clubes fundados viejos

- Los clubes fundados de partidas antiguas que no tengan escudo válido guardado ahora usan automáticamente `img/escudos/fundador-1.webp`.
- La migración se aplica al cargar snapshots de clubes guardados.
- La UI de escudos también incorpora ese fallback para evitar imágenes rotas.

### Archivos modificados en V6.42
- `index.html`
- `config.js`
- `js/data/04-data-storage.js`
- `js/core/02-ui-utils.js`
- `README.md`

### Validación V6.42
- `node --check` en todos los JS.
- JSON de `data/` parseados correctamente.
- ZIP incremental y completo verificados sin errores.

## V6.41 - Residencias y escudos de club fundador

Cambios principales:
- Para cancelar el alquiler de una residencia juvenil ahora deben existir al menos **20 cupos libres** en la academia.
- El botón de cancelar residencia queda bloqueado si no hay cupos libres suficientes.
- En **Fundar club** se agregó selección visual de escudo.
- El modo fundador espera 9 archivos `.webp` de 256x256 px en:
  - `img/escudos/fundador-1.webp`
  - `img/escudos/fundador-2.webp`
  - `img/escudos/fundador-3.webp`
  - `img/escudos/fundador-4.webp`
  - `img/escudos/fundador-5.webp`
  - `img/escudos/fundador-6.webp`
  - `img/escudos/fundador-7.webp`
  - `img/escudos/fundador-8.webp`
  - `img/escudos/fundador-9.webp`
- El escudo elegido se guarda como `crestPath` del club fundado y queda persistente en la carrera.

### Archivos modificados en V6.41

- `index.html`
- `config.js`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/10-academy-employees.js`
- `js/ui/12-modals.js`
- `style.css`
- `README.md`

### Validación V6.41

- `node --check` en todos los JavaScript.
- JSON de `data/` parseados correctamente.
- ZIP incremental y completo verificados sin errores.


## V6.40 - Plantel con PJ/G/A y estado compacto

Cambios principales:
- En **Plantel** se agregaron columnas **PJ**, **G** y **A** para partidos jugados, goles y asistencias.
- La columna **Estado** de Plantel ahora muestra sólo un icono: check verde disponible, tarjeta roja suspendido o icono de lesión sin especificar diagnóstico.
- En **Entrenamiento** se agregó la columna **PJ**.
- Las nuevas columnas pueden ordenarse con las flechas compactas del encabezado.

### Archivos modificados en V6.40

- `index.html`
- `config.js`
- `js/ui/07-render-team-market.js`
- `js/game/09-simulation-economy-training.js`
- `style.css`
- `README.md`

### Validación V6.40

- `node --check` en todos los JavaScript.
- JSON de `data/` parseados correctamente.
- ZIP incremental y completo verificados sin errores.


## V6.39 - Ranking con `points` como puntaje total

- Corregido el envío de carrera al ranking cuando el backend responde **“El puntaje total debe ser mayor a 0.”**.
- Además de `total_score`, `score` y aliases previos, el payload ahora envía `points` como puntaje total, porque algunas versiones del Worker validan ese campo.
- Los puntos deportivos de liga/carrera se conservan en `match_points`, `league_points` y `career_match_points`.
- Se agregó un cálculo defensivo de puntaje total si la partida tiene partidos reales pero los acumulados internos no estaban sincronizados.


## V6.38 - Competiciones y palmarés histórico

- El menú lateral **Tabla** ahora se llama **Competiciones**.
- Dentro de Competiciones se agregó navegación interna con botones:
  - **Tabla de posiciones**
  - **Campeones**
- La vista **Campeones** muestra el palmarés histórico por año/temporada.
- Al cerrar una temporada se guarda el campeón de cada liga/división.
- Al finalizar la Copa Mundial de Clubes de la FIFA se guarda su campeón, subcampeón y tercer puesto.
- El historial se conserva dentro de la partida y también puede reconstruir campeones desde tablas históricas ya guardadas.

### Archivos modificados en V6.38

- `index.html`
- `config.js`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/ui/12-modals.js`
- `README.md`

### Validación V6.38

- `node --check` en todos los JavaScript.
- JSON de `data/` parseados correctamente.
- ZIP incremental y completo verificados sin errores.

## V6.37 - Ranking con puntaje total compatible

- Corregido el envío de carrera al ranking cuando el backend respondía **“El puntaje total debe ser mayor a 0.”**.
- El payload ahora envía aliases explícitos de puntaje: `total_score`, `totalScore`, `score`, `puntaje_total`, `career_score`, `manager_score` y `puntaje_manager`.
- El cálculo de carrera ahora consolida también la tabla/temporada actual si los totales internos del manager no estaban sincronizados.
- Agregado respaldo de puntaje positivo para carreras con partidos oficiales reales, evitando que una carrera con encuentros jugados se envíe con score 0.

### Archivos modificados en V6.37

- `index.html`
- `config.js`
- `js/game/13-ranking-online.js`
- `README.md`

### Validación V6.37

- `node --check` en todos los JavaScript.
- JSON de `data/` parseados correctamente.
- ZIP incremental y completo verificados sin errores.

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

Usar la versión completa para reemplazar todo el proyecto o aplicar el ZIP incremental sobre V6.36.