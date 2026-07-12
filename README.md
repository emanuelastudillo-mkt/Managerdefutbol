# Fútbol Manager MVP - V6.32

## V6.32 - Calendario de Mundial de Clubes y clasificados visibles

Esta versión ajusta la **Copa Mundial de Clubes de la FIFA** agregada en V6.31 para que se integre mejor al calendario general y a las tablas de liga.

### Cambios principales

- El acceso **Mundial de Clubes** se quitó del menú lateral.
- Ahora se consulta desde **Calendario**, junto al botón **Mi calendario**.
- El calendario del Mundial de Clubes queda separado dentro de Calendario para ver sus fechas, sedes y partidos.
- Los partidos de la Copa Mundial de Clubes ahora se juegan cada **7 días**.
- La fase de grupos comienza **18 días después de la última fecha regular de las ligas**.
- Se agregó partido por el **3er puesto**.
- El partido por el 3er puesto se juega **1 día antes de la final**.
- La final se juega 7 días después de las semifinales.

### Formato de la Copa Mundial de Clubes

- 32 equipos.
- 8 grupos de 4.
- Clasifican 2 por grupo.
- Octavos, cuartos, semifinales, 3er puesto y final.
- Sede neutral.
- Eliminatorias a partido único.
- Empates en eliminatorias definidos por penales.

### Clasificados por liga

En las tablas de posiciones, los puestos que clasifican al Mundial de Clubes ahora usan el color de clasificación correspondiente.

Clasifican:

- 6 mejores de Argentina Primera;
- 2 mejores de Chile;
- 4 mejores de Brasil;
- 6 mejores de Inglaterra;
- 5 mejores de España;
- 4 mejores de Italia;
- 1 mejor de Rumania;
- 4 invitados especiales aleatorios.

### Invitados especiales posibles

- América de México;
- Monterrey;
- Cerro Porteño;
- Olimpia;
- Inter Miami;
- Seattle Sounders;
- Wydad Casablanca;
- Urawa Red Diamonds.

Cada edición elige 4 invitados de esa lista.

### Estadios sede

- MetLife Stadium — 81.118;
- Mercedes-Benz Stadium — 66.937;
- Lincoln Financial Field — 65.782;
- Camping World Stadium — 43.091.

### Premios económicos

- Participar: $50.000.000;
- Pasar grupos: $70.000.000;
- Cuartos: $100.000.000;
- Semifinal: $140.000.000;
- Subcampeón: $180.000.000;
- Campeón: $300.000.000.

### Ajustes técnicos

- Se agregó configuración interna del Mundial de Clubes:
  - `startDaysAfterLeague: 18`;
  - `daysBetweenRounds: 7`;
  - `thirdPlaceDaysBeforeFinal: 1`.
- `regularFixtureLength()` ahora detecta rondas de Copa Mundial de Clubes como postemporada para no confundirlas con fechas de liga.
- Se agregó estado de 3er puesto dentro de `game.clubWorldCup`.
- Se agregó detección de cupos clasificatorios por país/división para colorear las tablas.
- El botón de Mundial de Clubes dentro de Calendario muestra sólo los fixtures del torneo.

## Archivos modificados en V6.32

- `index.html`
- `config.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `README.md`

## Validación V6.32

- `node --check` ejecutado sobre todos los archivos JS.
- JSON de `data/` parseados correctamente.
- ZIP incremental y ZIP completo verificados sin errores.

## Notas

- Los invitados de la Copa Mundial de Clubes no aparecen en búsqueda de club porque no pertenecen a una liga jugable.
- El torneo no reemplaza ligas ni modifica ascensos/descensos.
- Los partidos del Mundial de Clubes no alteran las tablas de liga.
