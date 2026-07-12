# Fútbol Manager MVP - V7.01

## V7.01 - Auditoría integral, limpieza y estabilidad de guardados

Esta versión inaugura la línea **Manager V7**. Parte de la versión completa V6.48 y conserva el formato de datos y guardado existente.

### Correcciones funcionales

- Corregida la búsqueda de clubes al conformar los grupos del Mundial de Clubes. La lógica llamaba a una función inexistente y podía detener la creación del torneo.
- Corregido el premio de prestigio del manager por ganar el Mundial de Clubes. Ahora usa la función vigente de prestigio.
- Corregido el botón de verificación que aparece cuando una pantalla falla al renderizar. Ahora abre el verificador real de integridad.
- Corregida la detención del avance automático al quedar sin club. Se eliminaron referencias a un sistema anterior que ya no existe.
- Corregida la restauración de partidas: `divisionsSnapshot` ahora se aplica antes de `clubsSnapshot`. Esto evita clubes apuntando a divisiones inexistentes cuando una partida conserva una estructura de ligas anterior.
- Corregido el generador de jugadores de emergencia para bots: la media configurada ahora se aplica realmente al jugador creado.
- Eliminadas claves duplicadas en el objeto enviado al ranking online.
- Corregido el aislamiento de cartas especiales entre slots: una carta activa sólo aparece en el slot que la activó; las cartas en reserva siguen siendo globales.

### Limpieza de código

- Eliminada la pantalla global de jugadores que no estaba conectada a ningún menú ni renderer, junto con sus filtros, estado y estilos exclusivos.
- Eliminadas funciones sin referencias: formato decimal de prestigio, comprobación duplicada de club activo, participación estacional sin uso, icono táctico antiguo, etiqueta táctica antigua y helper redundante de ojeo.
- Eliminadas constantes y opciones de configuración sin consumo real: instalaciones, prórrogas antiguas de objetivos, cobro mensual por día fijo, pago único legacy de sponsors, fallback legacy de sobreexigencia bot, contador fijo de habilidades visibles y versión antigua de generación.
- Eliminadas variables locales sin uso, parámetros obsoletos y helpers que quedaron sin consumidores después de la limpieza.
- Reducción neta del código auditado: 176 líneas menos, sin eliminar datos ni archivos de contenido.
- Simplificado el punto de entrada `app.js`.

### Hallazgos conservados para una versión posterior

- El guardado del slot principal mantiene tres claves de IndexedDB por compatibilidad con versiones anteriores. Esto aumenta el uso de almacenamiento y el costo de clonado, pero retirarlo podría impedir volver a versiones antiguas.
- `data/retos_manager.json` existe, pero el reto actual se define directamente en código y ese JSON no se carga.
- `data/instalaciones.json` permanece como archivo reservado y actualmente está vacío; se retiró únicamente su configuración inactiva.
- No se modificaron reglas deportivas, economía, calendarios, planteles ni bases de datos salvo las correcciones indicadas.

### Validaciones realizadas

- Sintaxis de todos los archivos JavaScript con `node --check`.
- Parseo de todos los archivos JSON.
- Auditoría estructural de 162 clubes, 9 divisiones y 4.050 jugadores.
- Cada división conserva 18 clubes y cada club 25 jugadores.
- Sin referencias rotas entre clubes, divisiones, jugadores, estadios, hinchas y escudos.
- Análisis estático sin referencias indefinidas, redeclaraciones, claves duplicadas ni funciones globales completamente huérfanas.
- Integridad de los ZIP comprobada con `unzip -tq`.

### Archivos modificados en V7.01

- `README.md`
- `index.html`
- `app.js`
- `config.js`
- `balance-modificadores.js`
- `simulador-2.0.js`
- `style.css`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/10-academy-employees.js`
- `js/game/11-match-engine.js`
- `js/ui/06-render-home-messages.js`
- `js/ui/07-render-team-market.js`
- `js/ui/12-modals.js`
- `js/game/13-ranking-online.js`
- `js/game/15-especial.js`
- `js/game/16-scouting-center.js`
- `js/game/17-live-match.js`

### Compatibilidad de partidas

**V7.01 no rompe partidas anteriores.** Las partidas V6.48 mantienen su esquema. La restauración de divisiones guardadas mejora la compatibilidad cuando una carrera contiene snapshots de una estructura de ligas previa.
