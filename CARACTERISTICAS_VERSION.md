# V3.79 - Ligas internacionales y prestigio global

- Se agregaron cinco ligas jugables nuevas, todas con 18 equipos:
  - Brasil: `data/Liga Brasil.json`.
  - Inglaterra: `data/Liga Inglaterra.json`.
  - España: `data/Liga Espana.json`.
  - Italia: `data/Liga Italia.json`.
  - Rumania: `data/Liga Rumania.json`.
- El mundo jugable queda con 162 clubes: 54 argentinos, 18 chilenos y 90 internacionales nuevos.
- Se actualizó `config.js` para cargar todas las ligas, estadios e hinchadas desde `data.leagueUrls`, `data.estadiosUrls` y `data.hinchasUrls`.
- Se creó un JSON de estadios y un JSON de hinchadas para cada país nuevo.
- Se actualizaron los alias globales `data/estadios.json` y `data/hinchas.json` con todos los países.
- Se reescaló el prestigio de clubes de forma global:
  - Real Madrid queda como referencia máxima junto a la élite europea.
  - Barcelona, Manchester City, Liverpool, Manchester United, Atlético Madrid, Juventus, Inter, Milan y Napoli quedan en el rango alto mundial.
  - Boca, River, Flamengo, Palmeiras y otros grandes sudamericanos quedan por debajo de la élite europea, pero por encima del resto regional.
  - Se mantienen clubes de prestigio 20 o menos para que un manager nuevo con prestigio 0 tenga opciones iniciales.
- Se regeneró `data/jugadores.json` con 25 jugadores por club para los 162 clubes cargados.
- Se ajustó el detector de país por URL para Brasil, Inglaterra, España, Italia y Rumania.
