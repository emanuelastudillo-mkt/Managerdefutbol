# Una vida de manager — V8.69

## Base requerida

Aplicar este incremental sobre **V8.68**.

## Primera etapa del sistema de carrera

### Perfil acumulativo del manager

- Se incorpora un **Prestigio de carrera** entre 0 y 1.000.
- Se incorpora un **Momento profesional** entre -100 y +100.
- Se agregan seis capacidades acumulativas entre 0 y 100:
  - Rendimiento deportivo.
  - Liderazgo.
  - Gestión económica.
  - Desarrollo de jugadores.
  - Manejo de crisis.
  - Estabilidad.
- Los valores no se compran ni se reparten manualmente: cambian al cerrar una temporada, renunciar o ser despedido.
- El prestigio representa la trayectoria completa; el momento profesional da mayor peso a los resultados recientes.
- Un despido y una renuncia reducen siempre el momento profesional, incluso cuando existieron aspectos positivos en la campaña.

### Objetivos cualitativos

- El objetivo numérico interno se traduce a una expectativa deportiva comprensible.
- Los objetivos disponibles incluyen ganar el título, pelear el título, terminar en zona alta, mitad de tabla, no descender, ascender, jugar playoffs, pelear el ascenso y consolidar la categoría.
- Cada objetivo muestra una **posición mínima visible**.
- El objetivo principal y el mínimo aparecen en Inicio y en el perfil del manager.
- El modo Club Fundador conserva su objetivo específico sin exigir una posición mínima artificial.

### Evaluación final de temporada

- Cada campaña obtiene una evaluación entre 0 y 100.
- La evaluación combina:
  - 45% rendimiento deportivo.
  - 15% rendimiento por encima o por debajo de la expectativa.
  - 10% gestión económica.
  - 10% desarrollo del plantel.
  - 10% liderazgo mediante moral y cohesión.
  - 10% contexto, manejo de crisis y estabilidad.
- El cierre informa resultado del objetivo, evaluación general, cambios de prestigio y momento profesional.
- Las salidas durante la temporada generan una evaluación parcial proporcional al tiempo dirigido.

### Historial de temporadas del manager

- Se guarda club, división, posición, partidos, puntos, goles, objetivo, mínimo exigido, evaluación y motivo de cierre.
- Se registran finales de temporada, renuncias y despidos.
- Se evita duplicar un mismo cierre al cargar o guardar repetidamente.
- Las temporadas antiguas se migran al nuevo formato sin borrar el historial existente.

### Historial anual de clubes

- Al finalizar cada temporada se guarda un resumen de todos los clubes de las ligas jugables.
- Se registra división, posición, puntos, goles, ascenso, descenso, campeonato, reputación, presupuesto y valor general del plantel.
- El historial identifica las temporadas en las que un club fue dirigido por el jugador y vincula su evaluación.
- Se guardan resúmenes, no copias completas de cada partido, para reducir el impacto sobre el tamaño de la partida.

## Compatibilidad

- Compatible con partidas existentes de V8.68.
- Migra el prestigio y los historiales anteriores como base del nuevo perfil.
- No modifica resultados ya disputados ni reinicia el progreso del manager.
- No requiere Worker, SQL ni recursos gráficos.

## Archivos modificados

- `README.md`
- `config.js`
- `index.html`
- `js/game/05j-manager-career-stage-one.js`
- `styles/140-manager-career-stage-one.css`
