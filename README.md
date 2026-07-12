# Fútbol Manager MVP - V6.33

## V6.33 - Reprogramación compacta del Mundial de Clubes

Esta versión ajusta el calendario de la **Copa Mundial de Clubes de la FIFA** para que el torneo cierre con más margen dentro de los 70 días posteriores al final de las ligas.

### Cambios principales

- La fase de grupos sigue comenzando **18 días después de la última fecha regular de las ligas**.
- Las rondas del Mundial de Clubes ahora se juegan cada **5 días**.
- La final es la excepción: se juega **6 días después de las semifinales**.
- El partido por el **3er puesto** se juega **1 día antes de la final**.
- Con esta planificación, la final cae en el **día 49** desde el cierre de las ligas.
- Quedan aproximadamente **21 días de margen** antes del cambio de temporada.

### Planificación del torneo

| Fase | Día desde fin de ligas | Separación |
|---|---:|---:|
| Descanso previo | Día 1 al 17 | — |
| Grupos - Fecha 1 | Día 18 | Inicio |
| Grupos - Fecha 2 | Día 23 | +5 días |
| Grupos - Fecha 3 | Día 28 | +5 días |
| Octavos de final | Día 33 | +5 días |
| Cuartos de final | Día 38 | +5 días |
| Semifinales | Día 43 | +5 días |
| Partido por 3er puesto | Día 48 | +5 días |
| Final | Día 49 | +6 días desde semifinales / 1 día después del 3er puesto |

### Formato de la Copa Mundial de Clubes

- 32 equipos.
- 8 grupos de 4.
- Clasifican 2 por grupo.
- Octavos, cuartos, semifinales, 3er puesto y final.
- Sede neutral.
- Eliminatorias a partido único.
- Empates en eliminatorias definidos por penales.

### Clasificados por liga

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

- Configuración del Mundial de Clubes actualizada:
  - `startDaysAfterLeague: 18`;
  - `daysBetweenRounds: 5`;
  - `finalExtraDaysAfterSemifinal: 1`;
  - `thirdPlaceDaysBeforeFinal: 1`.
- El partido por el 3er puesto se programa 5 días después de semifinales.
- La final se programa 6 días después de semifinales.
- El texto de Calendario fue actualizado para reflejar la nueva planificación.

## Archivos modificados en V6.33

- `index.html`
- `config.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `README.md`

## Validación V6.33

- `node --check` ejecutado sobre todos los archivos JS.
- JSON de `data/` parseados correctamente.
- ZIP incremental y ZIP completo verificados sin errores.

## Notas

- Los invitados de la Copa Mundial de Clubes no aparecen en búsqueda de club porque no pertenecen a una liga jugable.
- El torneo no reemplaza ligas ni modifica ascensos/descensos.
- Los partidos del Mundial de Clubes no alteran las tablas de liga.
