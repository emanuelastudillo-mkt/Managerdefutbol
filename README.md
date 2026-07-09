# Fútbol Manager MVP

## Versión actual

**V4.13 - Verificador seguro de estructura**

## Historial de versiones



### V4.13 - Verificador seguro de estructura

- Se agrega el botón `Verificar que todo esté bien` al final del menú lateral.
- El verificador revisa estructura de clubes, divisiones, overrides, jugadores, tablas, fixtures y mercado libre.
- Detecta clubes asignados a divisiones de otro país, como un club rumano dentro de una división argentina.
- La verificación inicial no modifica la partida.
- Si encuentra clubes en ligas de otro país, permite aplicar una reparación segura.
- La reparación segura reasigna esos clubes a una división válida de su país y regenera `clubDivisionOverrides`.
- No reconstruye calendario, no borra resultados y no reinicia partida.
- El reporte muestra ejemplos de errores y conteo de clubes por división.


### V4.12 - Visor de partido y eventos destacados

- Se agrega un visor de inclinación de cancha dentro del simulador.
- El visor usa dos colores para diferenciar local y visitante.
- La pelota se mueve sobre la barra según posesión, ataques y ocasiones reveladas.
- El simulador muestra si la cancha está inclinada para el local, visitante o equilibrada.
- Se agregan animaciones destacadas para goles.
- Los goles muestran escudo, nombre del jugador y grito `GOOOOOOLLLL!`.
- Se agregan animaciones destacadas para rojas directas y dobles amarillas.
- Las rojas muestran escudo, nombre del jugador y tarjeta grande.
- Se agregan animaciones destacadas para lesiones.
- Las lesiones muestran escudo, nombre del jugador e ícono de lesión.
- No se modifica el cálculo deportivo del partido ni los resultados.


### V4.11 - Optimización de libres y relato de partido

- El mercado de jugadores libres queda limitado a un máximo duro de 300 jugadores.
- Las partidas existentes con exceso de libres se recortan automáticamente al cargar.
- Se desactiva la creación masiva de juveniles libres por club al cerrar temporada.
- La renovación de mercado rellena hasta el máximo permitido, pero ya no puede superar el límite.
- Los jugadores libres pueden rechazar ofertas según el prestigio del club.
- La probabilidad de aceptación de un libre equivale al prestigio actual del club.
- Si un jugador libre rechaza, queda bloqueado para ese club hasta la próxima temporada.
- La pantalla de Mercado muestra la probabilidad base de aceptación.
- El relato del partido pasa a 90 fases.
- Cada fase del relato dura al menos 3 segundos.
- El texto del relato se achica y aparece con animación de entrada.


### V4.10 - Precio dinámico de entradas bots

- Los clubes bots locales ahora ajustan automáticamente el precio de entrada según el prestigio del rival.
- Rival de prestigio bajo: mantiene precio base de $100.
- Rival de prestigio medio: cobra entre $150 y $200.
- Rival de prestigio alto: cobra entre $200 y $500.
- El club del manager mantiene el precio manual configurado en Estadio.
- La recaudación usa el precio efectivo del partido, no modifica de forma permanente el precio base del club bot.
- En el contexto del partido, `Atracción rival` se renombra como `Demanda extra por rival` para aclarar que afecta asistencia.
- Si el precio fue automático de bot, el contexto del partido muestra el multiplicador aplicado.

### V4.09 - Playoffs de promoción Argentina

- Se agrega calendario de playoffs de promoción para las tres divisiones argentinas.
- Los playoffs se crean automáticamente una vez terminada la liga regular argentina.
- Los cruces son ida y vuelta.
- Primera División Argentina:
  - Puesto 1: campeón.
  - Puestos 1 a 4: clasificados a copas futuras.
  - Puestos 15 y 16: juegan promoción contra 4° y 3° de Segunda.
  - Puestos 17 y 18: descienden directo.
- Segunda División Argentina:
  - Puesto 1: campeón y ascenso directo.
  - Puesto 2: ascenso directo.
  - Puestos 3 y 4: juegan promoción contra 16° y 15° de Primera.
  - Puestos 15 y 16: juegan promoción contra 4° y 3° de Tercera.
  - Puestos 17 y 18: descienden directo.
- Tercera División Argentina:
  - Puesto 1: campeón y ascenso directo.
  - Puesto 2: ascenso directo.
  - Puestos 3 y 4: juegan promoción contra 16° y 15° de Segunda.
  - No hay descensos.
- Las tablas de liga no se alteran con los resultados de promoción.
- En empate global de una serie, conserva la categoría el club de la división superior.
- La pantalla de calendario muestra los cruces como `Promoción Argentina · Ida` y `Promoción Argentina · Vuelta`.
- La tabla argentina marca visualmente campeón, copas futuras, promoción y descenso directo.


### V4.08 - Academia al cambiar de club y ranking público

- Al tomar un nuevo club después de despido o renuncia, la academia se vacía por completo.
- Los juveniles de la academia anterior desaparecen y no viajan con el manager.
- También se eliminan captaciones pendientes, habilidades desbloqueadas, planes de entrenamiento juvenil, residencias y lesiones juveniles asociadas a la academia anterior.
- El nuevo club empieza con academia vacía.
- En `Ranking Online` se elimina el bloque de `Carga automática`.
- La pantalla de ranking queda sólo como tabla online de lectura.
- Se mantienen los filtros actuales y se muestran hasta 100 resultados.

### V4.07 - Federaciones en ofertas de traspaso

- Los mensajes de ofertas por jugadores ya no muestran siempre `AFA` como entidad que retiene impuestos.
- La sigla se calcula según la liga o país del club comprador.
- Federaciones configuradas:
  - Argentina: AFA.
  - Chile: ANFP.
  - Brasil: CBF.
  - Inglaterra: FA.
  - España: RFEF.
  - Italia: FIGC.
  - Rumania: FRF.
- Para clubes externos genéricos también se asignan siglas coherentes cuando el nombre permite inferir país: FPF, FFF, DFB, KNVB o AUF.
- Se actualiza el texto del ingreso neto al aceptar la venta para mostrar `Impuesto <sigla>`.
- La sigla de España queda como `RFEF`.

### V4.06 - Optimización de simulación y calendario por días

- Se reduce la carga al simular partidos: los partidos sin participación del manager usan un simulador rápido de bots.
- El partido propio mantiene el simulador completo con eventos, lesiones, tarjetas, estadísticas y consecuencias del plantel.
- El calendario de cada jornada se divide por días:
  - Viernes: España, Italia, Inglaterra y Rumania.
  - Sábado: segunda y tercera división argentina.
  - Domingo: Chile, Brasil y primera división argentina.
- El avance ya no necesita resolver todas las ligas con el motor completo en el mismo bloque.
- El botón `Avanzar día` puede procesar partidos de otras ligas sin jugar el partido propio.
- Durante el bloqueo posterior al partido propio, se permite avanzar días sin partido propio para procesar calendario de bots.
- El calendario muestra la fecha específica de cada partido dentro de la jornada.
- Se mantiene compatibilidad con partidas guardadas: el calendario se regenera conservando partidos ya jugados.
- Se cambia la versión de calendario interno para forzar la corrección de fechas escalonadas.

### V4.05 - Ranking automático y limpieza al cambiar de club

- Se corrige el envío automático del ranking para el Worker online.
- El envío automático ya no depende solamente de `/ranking`; ahora prueba primero `/records` y deja `/ranking` como alternativa.
- La lectura del ranking mantiene `/ranking` y agrega `/records` como alternativa.
- Si el Worker exige autenticación, el valor de `config.js > ranking.token` se envía como `Authorization: Bearer`.
- Al tomar un nuevo club después de despido o renuncia, se limpian empleados y cooldowns del club anterior.
- Se reinician acciones de staff como charla motivacional, tratamientos semanales de kinesiólogo y preparador de juveniles.
- También se limpian estados de club que no deberían viajar con el manager: sponsors, préstamo bancario activo, ofertas pendientes y captaciones pendientes de academia.
- No se modificó el simulador de partidos, calendario, ranking de lectura ni generación de jugadores.

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
