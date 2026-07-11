# Fútbol Manager MVP - V6.04

## V6.04 - Ojeo, avance automático y ranking de carrera

Esta entrega continúa la línea Manager V6 y toma V6.03 como base.

### Cambios principales

- En el Centro de Ojeo se muestra la **probabilidad de fichaje** de cada jugador externo.
- La probabilidad de fichaje usa la misma lógica real del mercado: media del jugador contra prestigio del club comprador.
- Los jugadores propios aparecen sin porcentaje de fichaje porque no corresponde calcular aceptación para comprar un jugador propio.
- El avance automático ahora se muestra como bloque claro: título **Avance automático** y debajo un switch **ON/OFF**.
- El switch cambia visualmente según estado:
  - verde cuando está activo;
  - rojo cuando está apagado;
  - deshabilitado si la temporada terminó o el manager está sin club.
- El ranking online ahora arma como payload principal la **carrera completa del mánager**, no solamente la temporada actual.
- La carrera subida incluye partidos totales, puntos de carrera, récord G-E-P, goles, títulos, temporadas jugadas, club actual, clubes dirigidos, prestigio, experiencia, presupuesto y puntaje de carrera.
- La clave de envío de ranking pasa a ser estable por partida/carrera: `SAVE-CODE-CAREER`.
- La tabla del ranking deduplica resultados por código de partida antes de ordenar, evitando filas repetidas de la misma carrera.
- Se priorizan rutas `/ranking/career` para lectura y carga, manteniendo rutas antiguas como respaldo.
- `apps-script-ranking.gs` queda actualizado para guardar una sola fila por carrera.
- Se actualiza versión visible, caché de scripts/estilos y documentación a V6.04.

### Archivos modificados

- `index.html`
- `app.js`
- `config.js`
- `apps-script-ranking.gs`
- `style.css`
- `js/game/09-simulation-economy-training.js`
- `js/game/13-ranking-online.js`
- `js/game/16-scouting-center.js`
- `js/ui/06-render-home-messages.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`

### Validaciones realizadas

- Sintaxis JavaScript validada con `node --check` en los archivos JS modificados.
- Parseo JSON validado en todos los archivos dentro de `data/`.
- Validación de estructura del ZIP completo e incremental.

### Instalación

Para instalación limpia, subir todo el contenido del ZIP completo V6.04.

Para actualizar desde V6.03, aplicar el ZIP incremental V6.04 sobre la carpeta existente y forzar recarga con Control + F5.

## Historial inmediato

### V6.03 - Dificultad competitiva

- Adaptación rival por repetición táctica.
- Lesiones largas por sobreuso desde 80% de participación.
- Moral progresiva negativa para jugadores disponibles que no juegan.

### V6.02 - División de `data/jugadores.json`

- `data/jugadores.json` pasa a funcionar como manifest liviano.
- La base completa de 4.050 jugadores queda dividida en 9 archivos dentro de `data/jugadores/`.
- Se agrega soporte de carga por `playersUrls` en `config.js`.
- Se mantiene compatibilidad con el formato anterior de jugadores.

### V6.01 - Revisión exhaustiva y limpieza inicial de Manager V6

- Se abrió la línea Manager V6 tomando como base V5.80.
- Se actualizaron versión visible y caché a V6.01.
- Se eliminaron funciones internas sin referencias detectables por análisis estático.
- Se corrigió la contradicción de balance de tarjetas y quedó activo `1.10` desde `balance-modificadores.js`.
