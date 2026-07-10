# Historial de versiones

## V5.40 - Balance separado y entrenamiento diario corregido

- Agrega `balance-modificadores.js` como archivo activo para centralizar modificadores de entrenamiento, cohesión, lesiones, simulador, bots y clima.
- El archivo se carga antes de `config.js`; sus valores sobrescriben los bloques equivalentes sin tocar el resto de la configuración.
- Corrige el entrenamiento general diario: al avanzar un día se aplican sólo los 4 bloques del día actual.
- Mantiene el entrenamiento individual como una aplicación diaria por jugador.
- Los bots no entrenan; conservan su balance por simulación rápida y mantenimiento competitivo.
- En la simulación rápida, si un bot va perdiendo puede sobreexigirse: recibe una posibilidad de gol extra y paga desgaste/condición.
- La lluvia aumenta el deterioro del campo del manager cuando juega de local.
- La ficha del jugador muestra el boost de temporada en verde al lado de la habilidad visible.
- El desgaste sigue sin entrar directo al simulador; funciona como techo del estado físico, y el estado físico sí afecta el rendimiento.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.39 - Fotos manuales y reaparición libre

- Corrige la actualización de `photoPath` en jugadores manuales ya insertados en partidas existentes.
- Si la partida guardada tenía una ruta vieja o vacía, el jugador manual toma nuevamente la ruta declarada en `data/jugadores_manuales.json`.
- Mantiene las fotos en formato `.webp` dentro de `img/jugadores/manual/` y agrega un README en esa carpeta con los nombres esperados.
- Agrega cache-busting a fotos personalizadas para evitar que el navegador arrastre una imagen faltante o ruta vieja.
- Cambia los 7 jugadores manuales activos a `reapareceAlRetirarse: true`.
- Cuando uno de estos jugadores se retira, reaparece en el mercado libre con 20 años.
- La reaparición conserva sueldo, cláusula, valor, media bloqueada, habilidades y foto personalizada.
- El jugador reaparecido queda como libre: `clubId: 0`, `freeAgent: true`, `sold: false`, `retired: false`.
- En partidas existentes, si alguno quedó registrado como retirado bajo la regla anterior, puede recuperarse como libre al cargar si el JSON actual indica `reapareceAlRetirarse: true`.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.38 - Jugadores manuales WEBP y retiro persistente

- Cambia las rutas de foto de los jugadores manuales activos de `.png` a `.webp`.
- Los 7 jugadores manuales siguen iniciando en los clubes acordados: Barcelona, Juventus, Manchester United, Milan, Napoli, Real Madrid y Santos.
- Agrega `reapareceAlRetirarse: false` al bloque de mercado de los jugadores manuales activos.
- Agrega `game.manualRetiredPlayerIds` para recordar retiros manuales en la partida guardada.
- Si un jugador manual se retira, no se vuelve a insertar automáticamente al cargar la partida.
- Actualiza `data/jugadores_manual_ejemplo.json` para usar `.webp` en los ejemplos.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.37 - Jugadores manuales activos

- Agrega `data/jugadores_manuales.json` como archivo activo de carga automática.
- Crea a Ronaldinho, Gianluigi Buffon, David Beckham, Paolo Maldini, Diego Maradona, Zinedine Zidane y Pele en clubes reales del juego.
- Todos quedan con sueldo anual `$150.000.000`, cláusula fija `$1.200.000.000` y valor `$1.200.000.000`.
- Usa rutas de foto en `img/jugadores/manual/`, por ejemplo `img/jugadores/manual/ronaldinho.webp`.
- Convierte `media` y `habilidades` visibles al modelo interno del juego.
- Respeta la media manual como media bloqueada.
- En partidas existentes, los agrega al cargar si todavía no existen.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.36 - Plantilla manual con nombres visibles de habilidades

- Corrige `data/jugadores_manual_ejemplo.json` para que use nombres visibles y editables del juego, no nombres técnicos internos.
- La plantilla ahora usa `media` y `habilidades` con atributos como ataque, defensa, tiro, pase, velocidad, cabezazo, resistencia, agresividad, genética y factor sorpresa.
- Agrega reglas de rango: habilidades generales de 1 a 99 y factor sorpresa de 0 a 20.
- Agrega equivalencias para arqueros: ataque/salto, tiro/potencia, velocidad/reflejos y cabezazo/mando.
- Mantiene ruta de foto personalizada con el campo `foto`.
- No agrega importador ni pantalla de edición todavía.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.35 - Plantilla de jugadores manuales

- Agrega `data/jugadores_manual_ejemplo.json` como archivo base para futura creación manual/importación de jugadores.
- La plantilla incluye todos los datos principales necesarios: id, nombre, edad, posición, club, estado libre, nacionalidad, media, skills completas, sueldo, cláusula, valor y bloque de generación.
- Incluye `photoPath` como ruta de foto personalizada por jugador.
- Incluye dos ejemplos: un jugador asignado a un club y un jugador libre.
- La UI queda preparada para usar `photoPath` si más adelante se importan jugadores manuales con foto propia.
- Si la foto personalizada no existe, el juego vuelve al sistema automático de caras por nacionalidad.
- No se agrega importador ni pantalla de edición todavía.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.34 - Bots: disponibilidad, libres y ofertas reales

- Los bots ya no pueden usar jugadores lesionados o suspendidos como titulares automáticos contra el manager.
- `autoSelectStarters()` y `autoSelectByBestCondition()` ahora filtran disponibilidad para todos los clubes, no sólo para el club del jugador.
- La reparación automática de planteles bot ahora intenta fichar jugadores libres reales del mercado antes de crear o reconvertir jugadores de emergencia.
- Los fichajes de libres hechos por bots no pasan por probabilidad de aceptación: los jugadores libres no pueden rechazar a bots cuando el sistema necesita completar mínimos de plantel.
- Se eliminan las ofertas provenientes de clubes inexistentes. Las ofertas automáticas, de fin de temporada y de jugador ofrecido ahora toman clubes reales cargados en `seed.clubs`.
- Las ventas aceptadas desde esas ofertas envían al jugador a un club real cuando existe uno disponible, en lugar de mandarlo a un destino externo ficticio.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.33 - Integridad diaria de partidos bot

- Corrige el origen del problema: los fixtures ahora guardan el paquete completo del resultado y no sólo marcador/estado jugado.
- Agrega verificación automática diaria de partidos bot ya jugados sin estadísticas mínimas.
- Si existe historial válido, recupera desde `game.matchHistory`.
- Si no existe historial completo, agrega datos mínimos conservadores respetando el marcador ya registrado.
- No vuelve a aplicar tabla, economía, desgaste, disponibilidad ni estadísticas acumuladas para evitar duplicaciones.
- El avance queda bloqueado si todavía existe un partido jugado que no pudo repararse con seguridad.
- El verificador manual también puede completar estas estadísticas faltantes.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.32 - Ranking online manual y automático

- Reactiva la tarjeta de carga manual dentro de **Ranking Online**.
- Agrega botón **Subir datos del club** para enviar el estado actual del club al ranking.
- La carga manual queda disponible cada **50 días de juego**.
- El cooldown manual se guarda separado de la carga automática, para que el cierre de temporada no bloquee el botón manual.
- Mantiene la carga automática al finalizar temporada y al ser despedido.
- Cada carga manual usa evento propio por día de temporada para evitar pisar registros del mismo año.
- Se envían datos del club, división, posición, puntos, G-E-P, diferencia de gol, presupuesto inicial/final, variación, títulos, versión y fecha de juego.
- Actualiza `config.js` con `ranking.cooldownCargaDias: 50`.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.31 - Ajuste menor Centro de Ojeo

- Quita los iconos repetidos de edificios del bloque **Control de oficinas** para evitar que deformen el panel.
- Quita los iconos repetidos de edificios del bloque **Edificios activos** en Oficinas.
- Conserva el resumen numérico de oficinas, cupos y acciones de alquiler/cancelación.
- No modifica costos, contratos, informes, procesamiento diario ni datos guardados del Centro de Ojeo.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.30 - Centro de Ojeo enriquecido

- Rediseña el **Centro de Ojeo** con una estructura más ordenada: bloque principal de jugadores a la izquierda y paneles de gestión a la derecha.
- Agrega un icono visual de binoculares como identidad principal del menú.
- Agrega iconos acumulables de edificios para representar oficinas activas y capacidad disponible.
- Agrega símbolos de personas para representar ojeadores contratados y cupo total.
- Reorganiza los resúmenes superiores en tarjetas compactas: jugadores listados, ojeadores, oficinas e informes guardados.
- Compacta las tarjetas de jefe de ojeadores, oficinas, personal y proceso diario.
- Mantiene sin cambios la lógica de contratación, cancelación de oficinas, despido de ojeadores, informes revelados y lista activa.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.29 - Pulido visual del menú de Táctica

- Reorganiza la pantalla de Táctica en una cuadrícula más compacta: contenido principal a la izquierda y acciones/controles a la derecha.
- Mueve los visores de Defensa, Medios y Delantera al mismo panel de Instrucciones zonales.
- Alinea la pizarra como bloque principal y elimina la columna izquierda de visores que reducía el espacio útil.
- Reemplaza los números de Estado físico y Moral por indicadores circulares compactos en titulares, suplentes y reservas.
- Compacta filas, tarjetas y bloques para que la pantalla se lea más como una grilla de módulos conectados.
- Mantiene sin cambios la lógica de formación, selección, guardado de tácticas, autoselección y validación de alineación.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.28 - Revisión y limpieza de código

- Se actualiza la línea de versiones a V5.28 como incremental posterior a V5.27.
- Se retira código muerto del motor viejo de partidos: helpers de cálculo alternativo que ya no eran llamados porque `simulateMatch()` delega en `window.Simulator20.simulateMatch()`.
- Se conserva `pitchEffect()` por uso activo en entrenamiento, economía y desgaste posterior al partido.
- Se eliminan wrappers heredados `advanceOneDay()` y `goToNextMatch()`; el flujo actual usa `advanceCalendarOneStep()` desde el botón unificado.
- Se agrega `REVISION_CODIGO_V5.28.md` con auditoría técnica, código potencialmente eliminable, contradicciones detectadas y sugerencias de optimización.
- Actualizados `VERSION.md`, `CARACTERISTICAS_VERSION.md`, `config.js`, `index.html`, cache-busting y `app.js`.
- Compatibilidad: se implementa solo. No requiere reiniciar partida.

## V5.27 - Pizarra táctica y visores restaurados

- Restaura los visores tácticos de porcentaje en Táctica: Defensa, Medios y Delantera.
- Mantiene eliminados los textos explicativos largos pedidos en V5.26.
- Ajusta el layout para que la pizarra vuelva a ocupar el bloque central y no quede reducida.
- Amplía el ancho máximo de la pizarra táctica y ajusta visores a un formato compacto.

## V5.26 - Desgaste, tarjetas y limpieza táctica

- Aumenta en 1 punto el desgaste de partido.
- Reduce al 50% las tarjetas generadas por el simulador.
- Agrega suspensión automática por 5 expulsiones de un mismo equipo, con derrota 0-3.
- Elimina textos explicativos redundantes del apartado Tácticas.

## V5.25 - Texto dirigir partido

- Cambiado el texto del botón **Ver partido** por **Dirigir partido** antes de abrir partidos propios y amistosos.
- No modifica lógica de simulación, resultado directo, calendario, fatiga ni estadísticas.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.25.

## V5.24 - Resultado directo y terminar partido

- Agregado botón **Ver solo resultados** antes de abrir partidos propios y amistosos.
- El botón saltea la simulación visual, resuelve el partido con el motor vivo y muestra estadísticas completas.
- Agregado botón **Terminar partido** dentro del simulador vivo.
- Terminar partido simula todos los minutos restantes sin más intervenciones y habilita guardar el resultado.
- El resultado directo conserva goles, asistencias, tarjetas, lesiones, cambios, tapadas, errores, contexto y estadísticas del partido.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.24.

## V5.23 - Lesiones fantasma y reemplazos bot

- El simulador vivo ahora distingue lesiones activas durante el partido.
- Si un jugador bot se lesiona y el equipo todavía no hizo 3 cambios, el bot intenta reemplazarlo automáticamente con un suplente coherente para el rol.
- Si un jugador del manager se lesiona, el partido se pausa automáticamente.
- El lesionado del manager queda en cancha como jugador fantasma: visible, clickeable, sin aporte ofensivo, defensivo ni táctico.
- El manager puede tocar al lesionado y luego a un suplente para confirmar el reemplazo si todavía tiene cambios.
- Si no quedan cambios, el lesionado queda visible pero sin aportar nada al equipo.
- Los lesionados ya no siguen participando en goles, asistencias, tarjetas, errores ni cálculos de fuerza del equipo.
- Se agregan etiquetas visuales `LES` para distinguir lesionados bloqueados o fantasmas.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.23.

## V5.22 - Controles del simulador centrados

- Los botones de instrucciones del simulador vivo quedan centrados en una primera línea.
- Los botones de acción quedan centrados en una segunda línea: **Táctica**, **Auto/Pausar**, **Simular 1 minuto** y **Cerrar y guardar**.
- Se reduce el ancho ocupado por la botonera inferior para evitar cortes y desbordes en pantalla horizontal.
- No modifica lógica del partido, fatiga, cambios, expulsiones ni calendario.

## V5.21 - Pizarra táctica integrada al simulador

- El botón **Táctica** del simulador vivo ahora abre una pizarra interna en primer plano.
- Ya no se intenta usar la pantalla general de tácticas por detrás del modal del partido.
- Los titulares se muestran como círculos por zona de cancha.
- Clic en un círculo y luego en otro intercambia posiciones.
- Si hay un hueco por expulsión, se puede mover un jugador a ese espacio para cubrir el rol perdido.
- El selector de formación queda disponible dentro de la pizarra.
- Los expulsados permanecen visibles junto al banco, con roja y bloqueados.

## V5.20 - Ojeo persistente en fichas

- Los informes del Centro de Ojeo ya no se pierden al quitar jugadores de la lista activa.
- Las habilidades ocultas reveladas quedan guardadas en la ficha del jugador.
- Aplica a jugadores propios, libres y contratados por otros clubes.
- Cambiar de club vacía lista activa, jefe, oficinas y ojeadores, pero conserva informes ya revelados como progreso del manager.
- Agregado contador de informes guardados y archivados en el Centro de Ojeo.


## Historial de versiones

### V5.19 - Táctica viva, expulsados reales e instrucción ajustada

- Agregado botón **Táctica** dentro del simulador vivo.
- El botón pausa el modo automático y abre una ayuda de táctica rápida para reacomodar jugadores durante el partido.
- Se mantiene el flujo de listas clickeables: titular + titular intercambia roles; titular + suplente confirma sustitución.
- Los expulsados ya no desaparecen: pasan visualmente junto al banco con tarjeta roja, etiqueta **EXP** y quedan bloqueados para volver a entrar.
- Los expulsados dejan de participar realmente en la simulación: no aportan fuerza de equipo, no pueden recibir nuevas tarjetas, no pueden asistir ni convertir goles.
- El equipo con uno o más expulsados queda en desventaja numérica real para los minutos siguientes.
- Ajustada la instrucción **PONGAN HUEVO!!!**: ahora da +10% en ataque y defensa y consume 20% extra de estado físico.
- Se conserva el `config.js` editado por el usuario como base y se actualiza la versión a V5.19.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.19.

### V5.18 - Fatiga reforzada y cambios bot

- Duplicada la pérdida de estado físico por minuto en el simulador vivo para ambos equipos.
- La fatiga sigue dependiendo de resistencia, genética, posición e instrucción activa.
- Agregado parámetro editable `GAME_CONFIG.simulador.fatigaVivaMultiplicador: 2`.
- El bot ahora intenta usar con más decisión los 3 cambios disponibles.
- La lógica de cambios bot prioriza jugadores cansados, con mal puntaje, mal ubicados o afectados por el resultado parcial.
- El bot evalúa ventanas de cambio en entretiempo, 60, 70, 78 y 84 minutos.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.18.



### V5.17 - Simulador compacto con descanso real

- El simulador vivo reduce tipografía, alto de filas y espacios verticales en listas de jugadores y eventos para evitar cortes en pantalla horizontal.
- El partido vivo ahora tiene 105 fases: 45 minutos del primer tiempo, 15 fases de descanso y 45 minutos del segundo tiempo.
- Al llegar al entretiempo, el modo automático se pausa para permitir cambios, ajuste de formación o instrucciones.
- Durante las 15 fases de descanso no se generan eventos de partido: los jugadores recuperan parte de su estado físico.
- La recuperación depende de resistencia, genética y posición, sin superar el estado físico con el que cada jugador llegó al partido.
- La barra de fases diferencia primer tiempo, descanso y segundo tiempo.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.17.


**V5.16 - Avance diario unificado y cooldown de 20 segundos**


### V5.16 - Avance diario unificado y cooldown de 20 segundos

- Unificados los botones **Avanzar día** e **Ir a próximo partido** en un solo botón principal.
- El botón ahora avanza un día calendario por vez o abre el partido propio si el compromiso ya está pendiente ese día.
- Cooldown único de **20 segundos** después de cada avance, amistoso, partido propio o día de postemporada.
- Durante el avance se procesan verificaciones diarias, academia, scouting, contratos, lesiones, préstamos, sponsors y partidos bot pendientes.
- Se eliminan los saltos automáticos largos hacia el próximo partido desde la oficina para evitar inconsistencias de bloqueo y fechas.
- La barra de progreso queda asociada al único botón de avance.
- Si una partida traía un bloqueo viejo más largo, se normaliza al nuevo cooldown máximo.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.16.

### V5.15 - Entrenamiento temporal, academia y cartas limpias

- Rehecho el ajuste de entrenamiento profesional de V5.14.
- Los jugadores profesionales ya no suben habilidades base de forma permanente por entrenamiento.
- El entrenamiento intensivo suma **boosts temporales de temporada** sobre habilidades existentes.
- Dos turnos de entrenamiento intensivo deberían generar normalmente entre **1 y 2 puntos temporales** en habilidades entrenables.
- Al cerrar temporada, los boosts de entrenamiento se reducen al **30%**.
- Se mantiene quitado el botón **Tratar · $50.000** de Academia.
- Los juveniles lesionados se tratan desde **Empleados** con kinesiólogo contratado y sin costo para juveniles.
- Se mantienen los 20 consejos del asistente con reemplazo de `#usuario#` por el nombre del manager.
- Apartado **Cartas** revisado: menos bloques duplicados, información más compacta, resumen de bonus activo integrado y cartas más minimalistas.
- Actualizado `VERSION.md`, `config.js`, `index.html`, cache-busting y documentación a V5.15.

### V5.14 - Academia y consejos del asistente

- Quitado el botón **Tratar · $50.000** de las tarjetas de juveniles lesionados en Academia.
- Los juveniles lesionados se tratan desde **Empleados** con kinesiólogo contratado, sin costo para juveniles.
- Agregados 20 consejos del asistente sin especificidades duras, con reemplazo de `#usuario#` por el nombre del manager.
- El asistente envía un consejo al iniciar carrera y luego mensajes periódicos durante la partida.

### V5.13 - Auto más pausado, puntajes e iconos de partido

- El botón **Auto** del simulador vivo ahora avanza más lento: tarda el doble entre minuto y minuto.
- Se agrega puntaje vivo de partido para titulares de ambos equipos.
- El puntaje se calcula de forma coherente según media, moral, físico, encaje de rol, resultado parcial y eventos.
- Se agregan iconos acumulables junto al apellido del jugador: ⚽, 👟, 🟨, 🟥 y ✚.
- Los iconos se muestran tanto para el equipo del manager como para el bot.
- Se mantiene el formato compacto de lista para ahorrar espacio horizontal.

### V5.12 - Simulador vivo compacto, fatiga real y cambios bot

- Rediseño del simulador vivo en formato horizontal más compacto.
- Las estadísticas del partido ahora se muestran en una sola tarjeta comparativa, con ambos equipos en la misma línea.
- El equipo del manager y el equipo bot usan el mismo formato visual de lista.
- Titulares y suplentes se muestran como filas compactas clickeables, similar al menú de táctica.
- Las instrucciones de campo pasan a botones inferiores centrados, sin explicación visible.
- Los jugadores de ambos equipos pierden estado físico minuto a minuto.
- El bot ahora tiene banco visible y realiza cambios automáticos coherentes.

### V5.11 - Simulador táctico horizontal y cambios por clic

- Rediseño del simulador vivo en formato más horizontal y compacto.
- Se agrega tablero táctico propio con titulares y banco.
- Las sustituciones ahora se hacen por clic con confirmación.
- Se puede reacomodar jugadores intercambiando titulares.
- Se agrega selector de formación dentro del partido.
- Las instrucciones pasan a botones activables.
- Agregada instrucción **Sin instrucciones**.

### V5.10 - Simulación viva minuto a minuto

- La simulación viva pasa de bloques de 15 minutos a 90 fases de 1 minuto.
- Se agregan estadísticas en vivo, relato, eventos y barra de fases.

## Instalación incremental

Subir los archivos del ZIP respetando carpetas. Después usar **Control + F5** para evitar caché del navegador.
