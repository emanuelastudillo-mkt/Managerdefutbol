# Fútbol Manager MVP - V7.09

## V7.09 - Historial anual del Mundial de Clubes

Esta versión parte de la V7.08 y conserva las correcciones de premios y fechas del Mundial de Clubes, las tácticas variables de los bots, el ranking online y el guardado doble seguro.

### Selector de año

En **Calendario → Mundial de Clubes** se agregó un selector de año similar al utilizado en las tablas de las ligas.

Permite consultar:

- La edición actual.
- Cada edición anterior guardada.
- El campeón, subcampeón y tercer puesto.
- Las tablas finales de los grupos.
- Los partidos y resultados de cada grupo.
- Octavos, cuartos, semifinales, tercer puesto y final.

La edición actual continúa actualizándose a medida que se disputan los partidos.

### Fase de grupos

Los ocho grupos se muestran como pequeñas ligas de cuatro equipos.

Cada tabla incluye:

- Posición.
- Equipo.
- Partidos jugados.
- Diferencia de gol.
- Puntos.

Los dos primeros aparecen destacados como clasificados a octavos. Cada grupo también contiene un desplegable con sus seis partidos y resultados.

### Cuadro eliminatorio

Debajo de los grupos se muestra un cuadro horizontal con:

- Octavos de final.
- Cuartos de final.
- Semifinales.
- Final.
- Partido por el tercer puesto.

Los partidos ya disputados muestran el marcador y el ganador. Los encuentros de la edición actual continúan siendo clickeables para abrir su ficha completa. Los resultados históricos se muestran como registros de consulta y no dependen del calendario activo.

### Historial guardado

Al finalizar una edición se guarda una instantánea independiente con:

- Temporada y año.
- Participantes e invitados.
- Grupos y posiciones finales.
- Partidos de la fase de grupos.
- Cruces y resultados eliminatorios.
- Podio final.

Antes de iniciar una nueva temporada también se realiza una copia preventiva de la edición saliente.

### Migración de partidas anteriores

Las partidas anteriores a V7.09 no almacenaban el fixture completo de Mundiales ya eliminados al cambiar de temporada.

Por ese motivo:

- Si la edición todavía está presente en la partida, se reconstruye y guarda automáticamente.
- Si sólo existe el registro histórico del campeón, se crea una entrada resumida con campeón, subcampeón y tercer puesto disponibles.
- Los grupos y marcadores antiguos que ya no existían en el guardado no se inventan.
- Desde V7.09 todas las nuevas ediciones conservarán el detalle completo.

### Correcciones conservadas de V7.08

- Un club no clasificado no cobra premios del Mundial de Clubes.
- Las tres jornadas de grupos respetan sus fechas oficiales.
- Sólo se procesa una jornada pendiente de grupos por avance.

### Cloudflare y ranking online

No se modificó la API del ranking. No es necesario actualizar el Worker de Cloudflare.

### Archivos principales modificados en V7.09

- `README.md`
- `index.html`
- `style.css`
- `config.js`
- `balance-modificadores.js`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`

### Compatibilidad de partidas

**V7.09 no rompe partidas anteriores.** Agrega el historial del Mundial como una estructura nueva. Las partidas existentes conservan planteles, calendarios, presupuestos, títulos, estadísticas y progreso. Las ediciones antiguas sin fixture disponible se muestran únicamente con la información histórica que realmente estaba guardada.
