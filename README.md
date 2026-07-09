# Fútbol Manager MVP

**V5.11 - Simulador táctico horizontal y cambios por clic**

## Historial de versiones

### V5.11 - Simulador táctico horizontal y cambios por clic

- Rediseñada la simulación viva para acercarse a una pantalla de partido horizontal tipo manager clásico.
- Se agrega tablero táctico propio con los jugadores disponibles: titulares en cancha y suplentes en banco.
- Las sustituciones pasan a hacerse por clic: seleccionar un titular, seleccionar un suplente y confirmar el cambio.
- Los cambios quedan pendientes y se aplican antes del próximo minuto simulado.
- Se permite reacomodar roles en vivo seleccionando dos titulares para intercambiar sus posiciones dentro de la formación.
- Se agrega menú superior de formación dentro del partido; al cambiarla, el sistema reordena titulares para reducir penalizaciones por rol.
- Las instrucciones pasan de selector desplegable a botones activables.
- Se agrega la instrucción `Sin instrucciones`, sin bonus ni penalización.
- Se mantiene la simulación minuto a minuto, el relato, los eventos y las estadísticas en vivo.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting, `simulador-2.0.js`, `js/game/17-live-match.js`, `style.css` y documentación a V5.11.

### V5.10 - Simulación viva minuto a minuto y horizontal

- El motor vivo deja de avanzar en 6 tramos de 15 minutos y pasa a resolver **90 fases de 1 minuto**.
- El resultado sigue sin quedar decidido al inicio: cada minuto se calcula recién cuando se simula la siguiente fase.
- Se agregan estadísticas en vivo durante el partido: ataques, ocasiones, xG, posesión, faltas, tapadas, errores y pases.
- Se recupera el relato visual del simulador anterior con comentario principal, eventos recientes y énfasis en goles, tarjetas, lesiones, tapadas, errores y cambios.
- Se agrega una línea de progreso de 90 fases para ver el avance minuto a minuto y los minutos con eventos.
- La interfaz del simulador se compacta y se adapta mejor a pantalla horizontal: titulares a la izquierda, relato/eventos al centro, estadísticas e instrucciones a la derecha.
- Los cambios manuales y las instrucciones de campo se aplican antes del próximo minuto simulado.
- El modo automático avanza minuto a minuto y puede pausarse para pensar cambios o instrucciones.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting, `simulador-2.0.js`, `js/game/17-live-match.js`, `style.css` y documentación a V5.10.

### V5.09 - Simulación viva también en amistosos

- Corregida la causa principal por la que podía seguir viéndose el simulador anterior después de reiniciar partida: los amistosos de pretemporada seguían usando el modal visual viejo.
- Los amistosos propios ahora también abren el motor de simulación viva por bloques.
- La pretemporada ya no avanza ni guarda el amistoso hasta terminar los 90 minutos del partido vivo.
- Si el motor vivo no carga, el amistoso queda pendiente y se muestra diagnóstico en lugar de caer al simulador anterior.
- Los amistosos vivos no generan sanciones ni lesiones persistentes, manteniendo el comportamiento histórico de pretemporada.
- Se mantiene la simulación viva en partidos oficiales propios de temporada regular.
- Se incluye nuevamente `simulador-2.0.js`, `js/game/17-live-match.js`, `style.css` y `js/ui/12-modals.js` dentro del ZIP incremental para evitar instalaciones incompletas de V5.07/V5.08.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.09.

### V5.07 - Simulación viva por bloques

- Agregado sistema real de partido propio por bloques de 15 minutos.
- El resultado ya no queda cerrado al abrir la pantalla: sólo se calcula hasta el minuto actual y el siguiente tramo se resuelve después de la intervención del manager.
- Agregado botón de pausa/continuación automática y botón manual `Simular siguiente bloque`.
- Agregado panel de cambios manuales con hasta 3 sustituciones durante el partido.
- Agregadas instrucciones de campo aplicadas al bloque siguiente: `Todos al ataque`, `PONGAN HUEVO!!!`, `Cuidar el resultado` y `Todos a defender`.
- Las instrucciones modifican ataque, defensa, posesión, riesgo, cansancio efectivo y/o producción ofensiva según el caso.
- Se visualizan los 11 jugadores en cancha de ambos equipos durante la simulación con apellido, media, rol, estado físico y moral.
- El relato y los eventos se actualizan por minuto: goles, tarjetas, lesiones, cambios, tapadas y errores.
- Los partidos de bots siguen usando simulación rápida para rendimiento. El sistema vivo se aplica al partido propio oficial.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.07.

### V5.06 - Academia con crecimiento cualitativo

- En las tarjetas de juveniles de Academia se reemplaza el valor exacto de crecimiento `0/17` por una etiqueta cualitativa.
- Las etiquetas posibles son `Bajo`, `Normal`, `Muy bueno` y `Excelente`.
- `0/17` queda representado como `Bajo`; el máximo de temporada, por ejemplo `17/17`, queda representado como `Excelente`.
- El texto `Crecimiento de media esta temporada` pasa a `Crecimiento esta temporada`.
- Se agrega una barra visual aproximada para reforzar el estado sin mostrar el número exacto.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.06.

### V5.05 - Ojeo diario corregido en todos los avances

- Corregido el Centro de Ojeo: ahora procesa revelaciones también cuando el avance corresponde a día de partido propio.
- Corregido el Centro de Ojeo durante pretemporada y postemporada: cada avance de día también ejecuta el proceso diario de ojeadores.
- Los jugadores propios listados en ojeo priorizan de forma explícita las habilidades ocultas: `Agresividad`, `Genética` y `Factor sorpresa`.
- Se eliminó el componente aleatorio puro de la elección diaria de habilidades y se reemplazó por una selección estable basada en fecha, turno e intento.
- Agregado resumen visible en el Centro de Ojeo con último proceso diario, cantidad de intentos y habilidades reveladas.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.05.

### V5.04 - Intransferibles y ojeo como única fuente

- Agregada casilla `Intransferible` en la ficha de jugadores propios.
- Al marcar un jugador como intransferible se desactiva `Poner transferible` y se bloquea el ofrecimiento activo a clubes.
- Los jugadores intransferibles sólo quedan abiertos a ofertas por cláusula completa.
- Las ofertas pendientes inferiores a la cláusula se rechazan automáticamente al activar la casilla.
- Si una oferta vieja inferior a cláusula queda pendiente en una partida existente, también se bloquea al intentar aceptarla.
- Las ofertas automáticas normales y de fin de temporada ya no seleccionan jugadores intransferibles.
- Las ofertas especiales por cláusula completa se mantienen.
- Debajo del gráfico de habilidades se agrega la tarjeta `OJEADO POR TU EQUIPO` cuando hay ocultas reveladas.
- La tarjeta muestra `Agresividad`, `Genética` y `Factor sorpresa` según el informe del Centro de Ojeo.
- Eliminado el scouting provisorio anterior: abrir fichas de jugadores, clubes o listados ya no revela habilidades externas por semana.
- La única información visible de jugadores externos ahora es la que fue revelada y guardada por el Centro de Ojeo.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.04.

### V5.03 - Scouting de ocultas y ojeo propio

- El Centro de Ojeo ahora muestra un bloque específico de habilidades ocultas por jugador.
- Se agregan como ocultas revelables: `Agresividad`, `Genética` y `Factor sorpresa`.
- Ahora se pueden ojear jugadores propios desde la ficha del jugador.
- Los jugadores propios entran al Centro de Ojeo con las habilidades visibles ya conocidas, por lo que el progreso diario empieza directamente sobre las ocultas.
- Los jugadores externos mantienen el ojeo acumulativo normal, pero ahora también pueden revelar ocultas.
- La lista de ojeo distingue visualmente entre jugador `Propio · ocultas primero` y jugador `Externo`.
- Se actualizó el texto guía del Centro de Ojeo para explicar que sirve para jugadores propios y externos.
- Se corrigió una duplicación visual de `Media` en la ficha del jugador.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.03.

### V5.02 - Desbloqueo de temporada y ojeo limpio

- Agregado botón lateral `Desbloquear y nueva temporada` como herramienta de recuperación de partida.
- El desbloqueo fuerza el inicio de una nueva temporada con el club actual sin borrar la partida local.
- Antes del avance forzado se toma una copia interna de seguridad del progreso del manager.
- El desbloqueo conserva explícitamente prestigio de manager, experiencia, estadísticas acumuladas, puntos de habilidad y cartas especiales.
- La temporada saltada no otorga títulos, premios ni penalizaciones: funciona como reparación, no como simulación deportiva completa.
- El desbloqueo limpia estados que suelen trabar partidas: bloqueo de avance, revisión obligatoria de táctica, estado sin club y transición de temporada incompleta.
- En Centro de Ojeo y fichas de jugador observadas, las habilidades compuestas ahora se muestran según posición: `Ataque`/`Salto`, `Velocidad`/`Reflejos`, `Cabezazo`/`Mando` y `Tiro`/`Potencia`.
- Para jugadores que no son porteros ya no se muestra `Cabezazo/Mando`; se muestra sólo `Cabezazo`. En porteros se muestra sólo `Mando`.
- Se agregó estilo visual específico para el botón de recuperación y el modal de progreso protegido.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.02.

### V5.01 - Limpieza de auditoría y Everton por país

- Se separaron las rutas de escudo de Everton por país: Chile usa `img/escudos/everton-chi.png` e Inglaterra usa `img/escudos/everton-eng.png`.
- Se corrigió una inconsistencia de V5.00: los 13 escudos argentinos con acentos fueron devueltos a las rutas reales del ZIP, que usan marcadores `#U00xx` en el nombre del archivo.
- Se agregó normalización para partidas guardadas que todavía tengan `img/escudos/everton.png`: si el club es Everton de Chile o Inglaterra, se redirige a la ruta nueva según país.
- La UI mantiene fallback automático a `img/escudos/everton.png` si todavía no existen los archivos nuevos, para no dejar el escudo roto durante la transición.
- Mejora de rendimiento: si ya existe una partida guardada con snapshots de clubes y jugadores, el inicio evita cargar `data/jugadores.json`. Ese archivo sólo vuelve a cargarse para crear partida nueva o después de resetear partida local.
- Se flexibilizó la carga de partidas guardadas cuando cambia la firma de la base pero la partida trae snapshots completos. Esto evita bloquear partidas por cambios menores de datos o rutas visuales.
- Al hacer reset de partida, el juego recarga la base completa con `data/jugadores.json` para que una nueva partida no herede el snapshot alterado de la partida anterior.
- Quedan documentados como archivos candidatos a borrar en una limpieza completa: 6 escudos huérfanos y los archivos legacy `data/estadios.json` y `data/hinchas.json`. En un ZIP incremental no se pueden eliminar automáticamente archivos ya existentes en tu repositorio.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.01.

### V5.00 - Auditoría, limpieza y base de versión 5

- Se adopta V5.00 como nueva base de numeración del proyecto.
- Se sincronizó la versión visible en `index.html`, `config.js`, `VERSION.md`, `README.md` y cache-busting de scripts/estilos.
- Se corrigió la contradicción de `index.html`: el paquete venía como V4.34, pero el título y el encabezado seguían mostrando V4.31.
- Se corrigió una regresión de rendimiento: `data.cacheMode` existía en `config.js`, pero `fetchJsonIfExists()` forzaba siempre `no-store`. Ahora respeta `data.cacheMode`.
- Se paralelizó la carga inicial de jugadores, estadios, hinchas, ligas, sponsors, empleados, eventos, cartas y relatos.
- Se redujo una petición 404 inicial del banner de bienvenida apuntando directo a `img/principales/banner_bienvenido.jpg`.
- En V5.00 se intentó corregir 13 rutas de escudos argentinos hacia nombres acentuados. En V5.01 se corrigió ese criterio: los archivos reales del ZIP usan marcadores `#U00xx`, por lo que las rutas activas vuelven a coincidir con los PNG existentes.
- Se agregó normalización para partidas guardadas que conserven `crestPath` antiguos con marcadores `#U00xx`.
- Se actualizó `CARACTERISTICAS_VERSION.md` para reflejar la base V5.00.
- Revisión de imágenes: se detectaron 6 escudos locales sin referencia activa en ninguna liga cargada. No se incluyen en este ZIP porque esta entrega contiene sólo archivos modificados.
- Archivos de imagen candidatos a borrar en una limpieza completa: `img/escudos/Atenas_Río_Cuarto.png`, `img/escudos/Ciudad_de_Bolívar.png`, `img/escudos/Deportivo_Rincón.png`, `img/escudos/Ituzaingó.png`, `img/escudos/San_Martín_de_Formosa.png`, `img/escudos/Sarmiento_La_Banda.png`.
- Contradicción resuelta en V5.01: Everton de Chile e Inglaterra ahora usan rutas separadas.
- Archivos de datos legacy detectados sin referencia actual en `config.js`: `data/estadios.json` y `data/hinchas.json`. No se borran para no romper usos externos o históricos.

### V4.34 - Corrección calendario, préstamos y cartas

- Corregido el cobro semanal de préstamos: el calendario de cuotas ahora usa `lastPaymentDate` y `nextPaymentDate`.
- El contador heredado `daysSincePayment` ya no se pierde al normalizar el préstamo activo.
- Las cuotas vencidas se procesan por fecha real y pueden continuar después del cambio de temporada.
- El préstamo activo muestra la próxima fecha de cuota.
- Corregido el bloqueo de cartas activas para que no pueda mostrar más días que el máximo configurado.
- Las cartas activas ahora guardan también bloqueo por turno absoluto, no solo por fecha visible.
- Agregada protección contra retrocesos de calendario: la partida recuerda la última fecha válida y no vuelve a una fecha anterior por normalización.
- El inicio de nueva temporada se trata como avance desde el cierre anterior, no como reinicio hacia atrás.

### V4.32 - Entrenamientos guardados e histórico de tablas

- Agregados 3 espacios para guardar planes de entrenamiento semanales.
- Cada plan puede tener nombre personalizado al guardarse.
- Cada espacio permite cargar el plan semanal guardado.
- El guardado incluye los 7 días de entrenamiento general y el 5º entrenamiento individual de los jugadores actuales.
- Al cargar un plan, los entrenamientos individuales solo se aplican a jugadores que todavía estén en el club.
- La tabla de posiciones ahora guarda histórico al cierre de temporada.
- En `Tabla de posiciones` se agrega selector de año a la izquierda del selector de división.
- Las temporadas anteriores pueden revisarse sin alterar la tabla actual.

### V4.31 - Reglas de juveniles y límites de crecimiento

- Los juveniles captados ahora se crean entre 12 y 16 años.
- La media máxima inicial depende de la edad: base 30 + bonus por edad.
- Los juveniles normales tienen un límite de crecimiento de media por temporada entre 7 y 11 puntos.
- El juvenil excepcional mantiene entrenamiento x5, pero queda limitado a 15-20 puntos de crecimiento de media por temporada.
- Con 17 años el juvenil entra en su última temporada de academia.
- Si al cambiar temporada un juvenil de 17 años no recibió contrato profesional, desaparece de la academia.
- Se agrega advertencia visual en juveniles de 17 años.
- La ficha de academia muestra el progreso de crecimiento de media usado en la temporada.

### V4.30 - Centro de Ojeo y gastos mensuales

- Agregado menú lateral `Centro de Ojeo`.
- Agregado empleado contratable `Jefe de ojeadores` con categorías Regular, Bueno y Elite.
- Agregado sistema de oficinas de ojeo, con cupos para ojeadores y jugadores listados.
- Agregado botón `Ojear` en fichas de jugadores externos.
- Los jugadores observados quedan en una lista acumulativa y revelan habilidades día por día.
- Cada ojeador revela 1 habilidad diaria de los jugadores listados.
- El jefe de ojeadores aporta revelaciones diarias según su categoría.
- Agregados costos diarios de ojeadores y costos mensuales de oficinas/jefe.
- Agregados gastos mensuales del club: impuesto de ganancias, electricidad y limpieza general.
- Eliminadas de la pantalla táctica las instrucciones de partido por resultado.
- Agregados 3 visores tácticos: defensas, medios y delanteros titulares, calculados por habilidades clave.

### V4.29 - Desgaste físico y préstamo completo

- La lista lateral de eventos del simulador se revela por minuto y no completa desde el inicio.
- Agregada estadística persistente `Desgaste`.
- El desgaste se acumula por partidos y entrenamientos intensos.
- El Masajista reduce desgaste.
- El desgaste reduce el máximo de estado físico posible.
- Agregado botón para pagar la totalidad del préstamo bancario activo.

### V4.28 - Aceptación de ofertas oculta

- Se oculta el porcentaje exacto de aceptación en el mercado.
- Jugadores libres y contratados ya no muestran `Acepta X%`.
- Las fichas y modales de oferta muestran interés oculto, sin porcentaje.
- Los mensajes de rechazo ya no revelan la probabilidad calculada.
- El cálculo interno de aceptación/rechazo por media y prestigio se mantiene activo.
- El bloqueo por rechazo hasta la próxima temporada se mantiene.

### V4.27 - Verificador, simulador y ranking automático
- El verificador revisa partidos bot ya jugados y alerta si faltan estadísticas mínimas: goleadores, asistentes, tarjetas, lesiones, tapadas o errores.
- El simulador visual agrega bajo las estadísticas de cada equipo un resumen de goles, asistencias, amonestados, expulsados y lesionados.
- La Oficina muestra un bloque grande de `Días restantes` antes del próximo compromiso o durante vacaciones/pretemporada/postemporada.
- El resumen del último avance se mueve al final de la pantalla principal.
- Los estilos tácticos por sector se integran en el lateral derecho de la pizarra como instrucciones zonales.
- Las instrucciones de partido se integran en el lateral izquierdo de la pizarra.
- Los avisos superiores de avance automático desaparecen automáticamente luego de unos segundos.
- Se refuerza el envío automático al ranking al cierre de temporada y despido con reintentos y formato alternativo compatible.

### V4.26 - Balance físico postpartido
- La recuperación automática aplicada al terminar un partido baja a un tercio: de `+12 a +18` pasa a `+4 a +6`.
- El desgaste base por jugar sube de `-15 a -20` a `-24 a -45` para jugadores de campo.
- En partidos extremos, combinando campo injugable, presión/forzar y estilos exigentes, el desgaste puede acercarse a `-75` de físico.
- El factor de desgaste para arqueros queda configurable y por defecto se mantiene en 50%.
- Los valores quedan editables en `config.js > simulador`.

### V4.25 - Estilos tácticos por sector
- Se agregan estilos de juego por sector en Táctica: defensa, medios y delanteros.
- Cada sector puede elegir entre `Presión alta`, `Rotación`, `Posicional` y `Repliegue`.
- Los estilos afectan el simulador de forma moderada según habilidades clave del sector.
- Defensa influye en llegadas rivales, errores, posesión y protección del área.
- Medios influyen en posesión, faltas, ataques totales, ocasiones y errores.
- Delantera influye en presión, movilidad, generación de ocasiones, posesión y cansancio.
- Los efectos usan velocidad, resistencia, pase, defensa, físico, cabeceo y posicionamiento según el estilo elegido.
- Los estilos quedan guardados al confirmar equipo y también dentro de las tácticas guardadas 1, 2 y 3.
- Los estilos tácticos pasan a formar parte de la firma de cohesión: cambiar el plan puede afectar cohesión como cualquier cambio táctico.

### V4.24 - Avance no bloqueante, economía negativa y simulador compacto
- `Ir a próximo partido` ya no abre una pantalla de carga bloqueante para avanzar días.
- El avance automático hasta el partido propio se muestra dentro del bloque del botón, con spinner y barra de progreso.
- El contexto del partido se compacta para ocupar menos espacio en el simulador.
- La cruz de cierre del simulador queda alineada a la derecha.
- La economía del club puede quedar en saldo negativo.
- Los gastos recurrentes ya no se cortan al llegar a $0: el saldo sigue bajando como deuda.
- Los montos negativos se muestran con signo menos y color rojo en Oficina, Finanzas e historial.
- Se elimina del simulador visual el bloque final `Minuto 90 / Final / Resultado final...` para ahorrar espacio.

### V4.23 - Balance diario, academia semanal y confirmar equipo
- La ganancia de cohesión por partido baja a 8.
- El efecto de entrenamientos generales baja al 50% del valor anterior.
- El efecto del entrenamiento individual diario baja al 50% del valor anterior.
- Los juveniles dejan de cobrar todos los días: ahora cobran una vez por semana.
- El día de cobro semanal de juveniles queda configurable en `config.js` con `academia.diaCobroSemanalJuveniles`.
- El alquiler de residencias juveniles se mantiene mensual.
- Se actualizan textos de academia para reflejar el juvenil excepcional x5 y el cobro semanal.
- En Tácticas, el botón principal pasa de `Guardar táctica` a `Confirmar equipo`.
- Si el equipo está mal formado, la pantalla principal avisa `Debes confirmar tu equipo`.

### V4.22 - Bots con estadísticas y scouting oculto
- Se baja el multiplicador de consulta de juveniles para que los informes no revelen tantas habilidades de golpe.
- El juvenil excepcional ahora entrena x5.
- Los partidos bot siguen usando simulación rápida, pero ahora generan estadísticas individuales.
- Los partidos bot registran goleadores, asistencias, tarjetas, lesiones, tapadas clave, errores y partidos jugados.
- Las estadísticas se sostienen en rankings y fichas de jugadores sin ejecutar el simulador visual completo.
- Se evita el doble procesamiento de resultados bot previos al partido propio.
- Las estadísticas deportivas de jugadores libres y contratados quedan ocultas en Mercado.
- La media visible de jugadores externos pasa a ser una estimación de scouting, no la media real completa.
- Físico y moral de jugadores externos quedan ocultos.
- El scouting cambia por semana para que mirar jugadores en distintas semanas revele partes diferentes del perfil.

### V4.21 - Temporada segura por país
- Se corrige el origen del cruce de clubes entre países al cambiar de temporada.
- Los ascensos y descensos generales ahora se calculan por país, no con una escalera global de divisiones.
- Argentina conserva su sistema especial: Primera, Segunda, Tercera y playoffs de promoción.
- Las ligas de país único, como Chile, Brasil, España, Inglaterra, Italia y Rumania, ya no se conectan entre sí al cerrar temporada.
- Los overrides de división que manden un club a otro país se ignoran o se reparan hacia una división válida del país del club.
- El verificador agrega reparación de calendario: si los partidos cruzados todavía no fueron jugados, regenera el fixture seguro.
- Si hay partidos cruzados ya jugados, el verificador los marca pero no los borra para evitar pérdida de resultados.
- Al iniciar una nueva temporada, el juego vuelve a validar clubes/divisiones antes de generar el calendario.

### V4.20 - Rechazo de ofertas por media y prestigio
- Se reemplaza la aceptación simple de jugadores libres por una curva basada en diferencia entre media del jugador y prestigio del club ofertante.
- La misma regla se aplica a jugadores libres y a jugadores contratados de otros clubes.
- La probabilidad de aceptación usa los puntos: diferencia -30 = 95%, 0 = 80%, 30 = 20%, 50 = 3%, 70 = 1%, 100 = 0.5%.
- En jugadores contratados, la oferta al club mantiene la negociación por monto, pero el jugador también puede rechazar por media/prestigio.
- Si un jugador rechaza, queda bloqueado para el club actual hasta la próxima temporada.
- El mercado muestra el porcentaje estimado de aceptación por jugador.

### V4.19 - Tácticas guardadas y objetivo dinámico
- Se agregan 3 espacios para guardar tácticas personalizadas.
- Cada espacio guarda formación, titulares, suplentes, instrucciones automáticas y mentalidad de los titulares.
- Al cargar una táctica, si un jugador está lesionado o ya no pertenece al club, el puesto queda vacío.
- Se agregan botones `Guardar 1/2/3` y `Cargar 1/2/3` en la pantalla de Táctica.
- Se corrige el objetivo de directiva reducido por cartas: ahora se recalcula aunque la evaluación de temporada esté congelada.
- La Oficina muestra el objetivo efectivo con el bonus activo, por ejemplo `1.03 (-6%)`.


### V4.18 - Calendario diario 365 días
- La temporada pasa a procesarse día por día con 365 días fijos.
- La pretemporada dura 30 días y la liga regular empieza al primer domingo posterior.
- Las fechas de liga se programan una vez por semana según el día asignado a cada país/división.
- Después de la fecha 17 hay una pausa de mitad de temporada de 28 días para conservar el orden semanal del calendario.
- `Ir a próximo partido` ya no salta directo: usa el bloqueo de 120 segundos para avanzar automáticamente los días hasta el partido propio.
- En cada día avanzado se procesan entrenamientos, academia, cooldowns, lesiones, obras, sponsors, préstamos y partidos bot programados.
- Los partidos bot atrasados se simulan automáticamente al avanzar día.
- El partido propio queda separado: se juega cuando el calendario llega a su fecha.
- Los playoffs IDA/VUELTA quedan ubicados después de la fecha 34 como eventos posteriores reales.
- Las lesiones nuevas pasan a medirse también por `globalTurn` diario para que duren días reales.

### V4.17 - Simulación previa y playoffs visibles por liga
- Al usar `Ir a próximo partido`, el juego simula primero los partidos bot del mismo día o pendientes hasta esa fecha.
- El partido propio queda más aislado para evitar que el simulador visual mezcle carga de otros partidos.
- `Avanzar día` también puede limpiar partidos bot del mismo día antes de avisar que hay partido propio pendiente.
- Los playoffs argentinos se muestran como `Playoffs IDA` y `Playoffs VUELTA` en vez de fechas 35 y 36.
- Los cruces de promoción aparecen en el calendario de las dos ligas implicadas.
- El partido de promoción sigue siendo uno solo: conserva el mismo `match.id`, resultado e historial aunque se vea en ambas ligas.
- Se aclara la regla de promoción: asciende quien haga más goles en el global; si empatan, cada club queda en su liga actual.

### V4.16 - Simulador completo, libres y tratamientos juveniles
- Se agregan nuevas frases finales de partido para que el último relato sea menos repetitivo.
- Se agregan cartas de objetivo de directiva más bajo: 1%, 2%, 3% y 10%.
- Se agregan cartas de socios ganados extra: +10%, +15%, +20% y +50%.
- El objetivo de directiva se reduce si hay cartas activas de ese tipo.
- Los socios ganados aumentan si hay cartas activas de socios extra.
- En Oficina del manager, el presupuesto se muestra en millones para ahorrar espacio.
- La respuesta del jugador al intentar convencerlo de no aceptar una cláusula se muestra en una ventana destacada.
- Se corrige la probabilidad de aceptación de jugadores libres para usar el prestigio real del club.
- Los juveniles lesionados aparecen en Empleados > Kinesiólogo.
- Los juveniles lesionados pueden tratarse gratis de a uno o con `Tratar a todos`.
- El simulador usa pantalla completa, con datos de local y visitante en laterales.
- Los eventos visibles se ordenan de más reciente a más antiguo.
- El bloque de comentario del simulador tiene altura fija para evitar saltos visuales.

### V4.15 - Verificador de ligas incompletas
- El verificador ahora conserva una referencia de estructura base antes de cargar snapshots guardados.
- La reparación segura ya no solo quita clubes de ligas incorrectas: también intenta completar divisiones que quedaron con menos de su cantidad esperada.
- Detecta ligas con cantidad incorrecta de clubes y vuelve a mostrar la opción de reparación segura si quedan cupos sin completar.
- El reporte de divisiones muestra `clubes / esperado`.
- La reparación regenera `clubDivisionOverrides` y guarda la partida sin reconstruir calendario ni borrar resultados.

### V4.14 - Corrección simulador visual

- Se corrige un bug del visor de inclinación de cancha agregado en V4.12.
- El partido volvía a quedar detenido después del bloque superior por una variable interna mal nombrada.
- El simulador vuelve a mostrar fases, relato, eventos, estadísticas y resultado final.
- Se agregan defensas para que datos incompletos de una partida no bloqueen el modal.
- Si el visor visual falla, se muestra un resultado final de respaldo y la partida puede continuar.


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
