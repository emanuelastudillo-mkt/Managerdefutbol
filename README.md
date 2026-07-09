# Fútbol Manager MVP

## Versión actual

**V4.04 - Ajustes varios de finanzas, jugadores libres, juveniles y calendario**

## Historial de versiones

### V4.04 - Ajustes varios de finanzas, jugadores libres, juveniles y calendario

- Se agrega el bloque `Banco` dentro de Finanzas.
- El banco muestra 3 ofertas por temporada, tomadas al azar desde una lista de 10 bancos reales configurados en `config.js`.
- Cada oferta tiene banco, monto, interés, plazo, cuota semanal y costo de prestigio del manager.
- Montos disponibles por temporada:
  - $50.000.000 con costo de 1 punto de prestigio.
  - $500.000.000 con costo de 5 puntos de prestigio.
  - $1.500.000.000 con costo de 20 puntos de prestigio.
- Los plazos posibles son 24, 48 o 172 semanas.
- Al aceptar un préstamo, el dinero se suma al club, se descuenta el prestigio del manager y se bloquean nuevos préstamos hasta finalizar la deuda.
- El préstamo activo muestra barra de progreso, deuda restante, semanas restantes y cuota semanal.
- Cada avance semanal descuenta una cuota del presupuesto del club y reduce la deuda.
- Se agrega una tarjeta de `Calificación` en Finanzas con mensaje de la directiva.
- La calificación económica se calcula comparando presupuesto disponible contra sueldos anuales del plantel.
- Estados posibles: economía destruida, economía en problemas, economía regular, economía buena y economía excelente.
- Los jugadores libres pasan a generarse con nacionalidades variadas de todos los países configurados.
- Los jugadores libres quedan con físico 5 y moral 5 para representar baja preparación competitiva.
- Los juveniles excepcionales toman nombre y nacionalidad del país del club.
- Los juveniles normales mantienen variedad de nacionalidades, con predominio del país o región de la liga.
- En Calendario se agrega vista predeterminada `Mi calendario`.
- `Mi calendario` muestra todos los partidos del club del manager.
- El calendario de liga sigue disponible desde el desplegable de divisiones.

### V4.03 - Corrección de empates masivos en bots

- Se corrigió el cálculo interno de ocasiones de gol del simulador.
- El problema detectado hacía que los partidos bot vs bot generaran casi siempre 0 chances y terminaran 0-0.
- La tabla de posiciones no era el origen del bug: los puntos reflejaban correctamente los empates generados por el motor.
- Se ajustó la conversión de ataques a chances usando los ataques reales del bloque.
- No se modificó la estructura de guardado ni se reiniciaron partidas existentes.

### V4.02 - Ajustes visuales de inicio y estadio

- Se achicó el texto de las tarjetas compactas de clubes disponibles al iniciar partida.
- Se reemplazaron abreviaturas por textos completos: `Estadio`, `Hinchas` y `Prestigio`.
- En `Hinchada y entradas`, se cambió `Hinchas actuales` por `Hinchas Totales`.
- Se cambió `Base` por `Vitalicios`.
- Se cambió `Último cambio` por `Nuevos socios`.
- En `Campo de juego`, se agrandó la línea de nombre del estadio y capacidad.
- No se modificaron motores, simulación, ranking, guardado ni reglas de partida.

### V4.01 - Ranking automático obligatorio

- Se bloqueó la carga manual de resultados al ranking online.
- El menú `Ranking Online` queda como panel de consulta y estado; ya no muestra botón para subir temporada.
- El ranking se envía automáticamente cuando el manager es despedido.
- El ranking se envía automáticamente cuando se cierra una temporada.
- Se agregó control local de envíos por evento para evitar duplicados por temporada, club y tipo de evento.
- Se registra el estado del envío automático: pendiente, enviado o error.
- Se mantiene la lectura pública de la tabla online con el botón `Actualizar ranking`.

### V4.00 - Auditoría, limpieza y optimización

- Se adopta V4.0 como nueva numeración del proyecto.
- Se sincronizó la versión visible de la interfaz, `VERSION.md`, `config.js` y parámetros de cache-busting en `index.html`.
- Se cambió la carga de JSON a modo cache configurable desde `config.js` con `data.cacheMode`.
- Se paralelizó la carga de jugadores, estadios, hinchas y ligas para reducir espera inicial.
- Si `data/jugadores.json` está disponible, el juego evita crear planteles temporales que luego eran descartados.
- Se mantiene generación automática sólo para clubes sin cobertura en la base de jugadores.
- Se corrigió el banner inicial para no intentar cargar una ruta sin extensión antes del `.jpg`.
- Se corrigieron rutas de escudos argentinos activos para apuntar directo al archivo existente.
- Se removieron 6 escudos de clubes que ya no están referenciados por ninguna liga activa.
- Se agregó `AUDITORIA_V4.0.md` con detalle de revisión y recomendaciones.
