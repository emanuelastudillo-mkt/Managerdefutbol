# Fútbol Manager MVP - V6.31

## V6.31 - Copa Mundial de Clubes de la FIFA

Esta versión agrega una competición internacional de cierre de temporada: **Copa Mundial de Clubes de la FIFA**.

### Cambios principales

- Se agrega la pestaña lateral **Mundial de Clubes**.
- La competición se genera al final de la temporada, cuando ya están definidos los clasificados de las primeras divisiones.
- Formato implementado:
  - 32 equipos;
  - 8 grupos de 4;
  - clasifican 2 por grupo;
  - octavos, cuartos, semifinales y final a partido único;
  - sede neutral.
- Clasificación por liga:
  - 6 mejores de Argentina Primera;
  - 2 mejores de Chile;
  - 4 mejores de Brasil;
  - 6 mejores de Inglaterra;
  - 5 mejores de España;
  - 4 mejores de Italia;
  - 1 mejor de Rumania;
  - 4 invitados especiales aleatorios.
- Equipos invitados posibles:
  - América de México;
  - Monterrey;
  - Cerro Porteño;
  - Olimpia;
  - Inter Miami;
  - Seattle Sounders;
  - Wydad Casablanca;
  - Urawa Red Diamonds.
- Cada edición elige 4 invitados de esa lista.
- Los equipos invitados no tienen estadio propio ni juegan liga local. Existen sólo como clubes especiales para esta competición.
- Sus planteles se generan automáticamente usando su prestigio.
- Estadios sede:
  - MetLife Stadium — 81.118;
  - Mercedes-Benz Stadium — 66.937;
  - Lincoln Financial Field — 65.782;
  - Camping World Stadium — 43.091.
- Premios económicos configurados:
  - Participar: $50.000.000;
  - Pasar grupos: $70.000.000;
  - Cuartos: $100.000.000;
  - Semifinal: $140.000.000;
  - Subcampeón: $180.000.000;
  - Campeón: $300.000.000.
- Si el club del usuario participa, cobra premios según avance.
- Si el club del usuario gana el torneo, el manager recibe un ajuste de prestigio adicional.
- Los partidos del Mundial de Clubes no alteran las tablas de liga.
- Sí generan resultado, estadísticas de partido, desgaste, lesiones, sanciones y eventos de jugador como partidos oficiales.
- En eliminatorias, los empates se resuelven por penales.

### Ajustes técnicos

- Se agregó estado persistente `game.clubWorldCup`.
- Se agregaron fixtures especiales con `clubWorldCup: true`.
- Se evita que los partidos de copa modifiquen `game.standings` de liga.
- Se agregó resolución de ganadores por penales para cruces eliminatorios.
- Se agregó generación automática y persistente de equipos/planteles invitados cuando la competición se crea o cuando se carga una partida ya iniciada durante el torneo.
- El cierre de temporada ahora espera a que terminen playoffs de promoción y Copa Mundial de Clubes antes de pasar a postemporada.

## Archivos modificados en V6.31

- `index.html`
- `config.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/11-match-engine.js`
- `js/ui/06-render-home-messages.js`
- `README.md`

## Validación V6.31

- `node --check` ejecutado sobre todos los archivos JS.
- JSON de `data/` parseados correctamente.
- ZIP incremental y ZIP completo verificados sin errores.

## Notas

- Los invitados de la Copa Mundial de Clubes no aparecen en búsqueda de club porque no pertenecen a una liga jugable.
- La competición se crea al terminar la temporada regular y los playoffs de promoción que correspondan.
- El torneo no reemplaza ligas ni modifica ascensos/descensos.
