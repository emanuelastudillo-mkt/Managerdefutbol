# Fútbol Manager MVP - V7.46

## V7.46 - Animación diaria de puntos de habilidad

### Sumatoria junto a Avanzar día

- Al comenzar una nueva fecha, junto al botón **Avanzar día** aparece una animación breve con los puntos de habilidad obtenidos desde el avance anterior.
- El contador sube progresivamente desde 0 hasta la cantidad ganada.
- Cuando hubo varias recompensas, muestra una suma compacta, por ejemplo `125 + 250 = 375`.
- También informa el saldo total de puntos después de acreditar los premios.
- Si no se ganaron puntos, no aparece ninguna animación y la interfaz conserva su tamaño habitual.

### Registro de premios

- La sumatoria utiliza los movimientos positivos del historial de puntos, no la diferencia del saldo.
- Abrir sobres o gastar puntos no reduce ni oculta lo ganado durante el día.
- Se registran victorias, empates, bonus de goles, campeonatos, tratamientos, informes juveniles, mantenimiento del campo, códigos, destrucción de cartas, Campo destruido y Licencia Internacional.
- La destrucción de cartas ahora deja también su movimiento en el historial de puntos.
- Las recompensas obtenidas durante varios días de avance automático se agrupan en una única animación al volver a Inicio.

### Interfaz

- La animación aparece a la derecha del botón principal y se retira automáticamente después de unos segundos.
- En pantallas angostas se coloca debajo del botón para no comprimirlo.
- Respeta la preferencia del navegador de reducir movimientos.
- También funciona cuando el manager está sin club y continúa avanzando el calendario.

### Archivos principales modificados en V7.46

- `index.html`
- `js/game/05-state-season.js`
- `js/game/15-especial.js`
- `js/ui/06-render-home-messages.js`
- `js/ui/19-manager-courses.js`
- `style.css`
- `README.md`
- archivos de versión y caché

### Compatibilidad

**V7.46 no rompe partidas anteriores.** Las partidas V7.45 inicializan el nuevo cursor de movimientos con el historial existente, por lo que no muestran premios antiguos como si acabaran de obtenerse. La animación comienza a registrar y mostrar las recompensas obtenidas desde el siguiente avance de día.

## V7.45 - Cursos y licencias progresivas de manager

### Nuevo acceso superior

- Se agregó el botón **Cursos de manager** inmediatamente a la izquierda de **Ayuda**.
- El curso puede abrirse con o sin una partida activa.
- El progreso pertenece al perfil global del manager, por lo que se conserva al cambiar de club, carrera o slot dentro del mismo navegador y dominio.

### Licencia de manager Básica

Incluye diez módulos introductorios con explicación y checklist **Ya entiendo cómo funciona**:

- Táctica y formación.
- Puestos naturales y adaptación.
- Titulares y suplentes.
- Capitanía.
- Estado físico y rotación.
- Moral y cohesión.
- Estado del campo de juego.
- Entrenamiento.
- Lesiones y suspensiones.
- Rutina diaria del manager.

Al marcar los diez controles, la licencia queda aprobada y se habilita la Licencia Nacional.

### Licencia de manager Nacional

Profundiza en:

- Identidad y alternativas tácticas.
- Mentalidad e instrucciones.
- Rotación según calendario.
- Plan de entrenamiento.
- Ojeo y decisiones con información incompleta.
- Mercado, contratos y cláusulas.
- Academia.
- Empleados.
- Estadio, sponsors y finanzas.
- Objetivos y planificación de temporada.

Al aprobar sus diez controles se habilita la Licencia Internacional.

### Licencia de manager Internacional

Desarrolla conceptos de carrera avanzada:

- Cambios de club y prestigio.
- Adaptación a otras ligas.
- Construcción de planteles internacionales.
- Mundial de Clubes.
- Partidos en sede neutral.
- Ojeo internacional.
- Gestión de figuras y cláusulas.
- Preparación según el rival.
- Cartas y recursos especiales.
- Legado en distintos clubes, ligas y países.

Las explicaciones son orientativas y utilizan ejemplos prácticos, pero no muestran fórmulas, porcentajes internos ni cálculos ocultos de simulación.

### Premio final

- Al aprobar por primera vez la Licencia Internacional se acreditan **1.000 puntos de habilidad**.
- La recompensa es única por perfil global.
- Completar nuevamente una licencia o cambiar de slot no vuelve a pagar el premio.
- Si no existe una partida activa, los puntos quedan guardados en el perfil y se aplican al iniciar o cargar una carrera.

### Interfaz y persistencia

- Las tres licencias se muestran dentro de un desplegable progresivo.
- Cada nivel indica estado, cantidad de temas comprendidos y barra de progreso.
- Las licencias bloqueadas muestran claramente cuál debe completarse primero.
- Cada aprobación abre una pantalla de certificado y habilita el siguiente nivel.
- La aprobación internacional abre una felicitación especial con el premio obtenido.

### Archivos principales modificados en V7.45

- `index.html`
- `js/game/05-state-season.js`
- `js/ui/19-manager-courses.js`
- `style.css`
- `README.md`
- archivos de versión y caché

### Compatibilidad

**V7.45 no rompe partidas anteriores.** No modifica calendarios, planteles, tácticas, economía ni simulación. Las partidas V7.44 cargan normalmente y comienzan con las tres licencias sin completar. El progreso de cursos y el premio se guardan en el perfil global del navegador.

## V7.44 - 30 retos de carrera itinerante

### Catálogo ampliado

- El sistema pasa de 60 a **90 hitos** visibles.
- Se agregaron 30 retos centrados en cambiar de club, continuar después de despidos o renuncias y ganar títulos en distintos destinos.
- Los nuevos hitos se calculan con el historial laboral y el historial oficial de títulos ya guardados.

### Cambios de club y salidas

- Retos por dirigir 2, 3, 5, 7 y 10 clubes distintos.
- Retos por sufrir 1, 3, 5 y 10 despidos.
- Retos por registrar 1, 3 y 5 renuncias.
- Los hitos se revisan inmediatamente al dejar un club, aceptar un nuevo cargo o fundar un club durante una carrera existente.

### Campeón itinerante

- Títulos de liga con 2, 3, 5 y 7 clubes diferentes.
- Títulos en 2, 3, 5, 7 y las 9 ligas o divisiones jugables.
- Títulos en 2, 3, 5 y los 7 países disponibles.
- Máxima categoría conquistada en 3 países y en los 7 países.
- 1, 2 y 3 Mundiales de Clubes ganados.

### Corrección relacionada

- El hito `Leyenda del banco` pasa de exigir prestigio 100 a prestigio 99, porque el prestigio del manager tiene un máximo efectivo de 99.

### Archivos principales modificados en V7.44

- `data/hitos_manager.json`
- `data/retos_manager.json`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- archivos de versión y caché

### Compatibilidad

**V7.44 no rompe partidas anteriores.** Los 30 retos nuevos se reconstruyen usando `seasons`, `careerHistory` y `titleHistory`. Una carrera anterior puede desbloquear varios hitos al abrir Tus estadísticas. Los títulos muy antiguos que no hayan quedado registrados en esos historiales no pueden reconstruirse retroactivamente.

## V7.43 - Hitos visibles y premio único de Campo destruido

### Hitos y récords personales

- Los 50 hitos existentes ahora se muestran aunque todavía no hayan sido conseguidos.
- Los hitos pendientes aparecen con una estética oscura, desaturada y una barra de progreso.
- Los hitos desbloqueados mantienen el tratamiento dorado.
- Se agregaron 10 desafíos extremos: 500 y 1.000 partidos; 250 y 500 victorias; 1.000 goles; +300 de diferencia de gol; 10 temporadas; 15 objetivos de directiva; 10 títulos; y 100 de prestigio.
- El contador pasa a mostrar el progreso sobre un catálogo total de 60 hitos.

### Campo destruido

- Los 10.000 puntos de habilidad se entregan solamente la primera vez que el perfil termina primero en el reto.
- El premio queda registrado en el perfil global del manager y no se reinicia al borrar o volver a crear el slot del desafío.
- Al ganar aparece una pantalla final de felicitaciones, resultado y premio antes de volver al menú de partidas.
- Al repetir y volver a ganar, la pantalla informa que el premio único ya fue reclamado y no acredita nuevos puntos.
- La pantalla inicial y el panel del reto indican si la recompensa todavía está disponible.

### Archivos principales modificados en V7.43

- `data/hitos_manager.json`
- `data/retos_manager.json`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/ui/12-modals.js`
- `style.css`
- archivos de versión y caché

### Compatibilidad

**V7.43 no rompe partidas anteriores.** Los hitos nuevos se evalúan usando las estadísticas ya guardadas y pueden desbloquearse al cargar una carrera. El registro de premio único comienza en V7.43; una recompensa de Campo destruido cobrada en versiones anteriores no puede identificarse con certeza si el slot del reto ya fue eliminado.



## V7.42 - Aceptación automática de ofertas por cláusula sin respuesta

### Controles de los días 162 y 355

Las ofertas especiales en las que otro club paga el `100%` de la cláusula ya no pueden quedar pendientes indefinidamente:

- Si la oferta existe antes o durante el día **162**, se acepta automáticamente al llegar al día 162 cuando el manager no eligió **Aceptar oferta** ni **Convencer al jugador de quedarse**.
- Si el día 162 ya había sido superado cuando la oferta apareció o cuando una partida anterior incorpora esta regla, el segundo control queda programado para el día **355**.
- El procesamiento usa `>=` sobre el día previsto para cubrir avances que crucen el control sin detenerse exactamente en esa fecha.
- Una oferta generada después del día 355 se resuelve en el siguiente procesamiento del calendario.
- La venta automática ejecuta la cláusula completa, aplica el impuesto federativo, acredita el ingreso neto y retira al jugador del plantel y de la táctica.

Cada oferta nueva informa dentro del mensaje el día en que se ejecutará automáticamente si queda sin respuesta. Las ofertas pendientes creadas en versiones anteriores reciben esta información al volver a abrir Mensajes o al avanzar el calendario.

### Descontento del jugador

Se agregaron **5 respuestas personalizadas** para la salida por falta de comunicación. Incluyen nombre del manager, jugador y club, y expresan que el futbolista se marcha porque nadie respondió ni habló con él sobre la oferta.

Cuando se ejecuta la salida:

- La oferta original cambia al estado **Aceptada automáticamente: sin respuesta**.
- Se agrega un nuevo mensaje importante titulado con el apellido del jugador.
- La operación es idempotente: una oferta cerrada no puede vender al mismo jugador por segunda vez.
- Si el manager ya cambió de club o el jugador dejó de pertenecer al plantel, la oferta se cierra sin ejecutar una venta incorrecta.

### Archivos principales modificados en V7.42

- `config.js`
- `index.html`
- `balance-manager.js`
- `balance-modificadores.js`
- `js/core/01-config-constants.js`
- `js/ui/06-render-home-messages.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/18-challenges-online.js`
- `README.md`

### Compatibilidad

**V7.42 no rompe partidas anteriores.** Las ofertas especiales ya respondidas conservan su resultado. Las ofertas antiguas todavía pendientes se programan para el día 162 si la partida aún no lo alcanzó; si ese día ya pasó, esperan al control del día 355. No se modifican otras ofertas de transferencia.



## V7.41 - Prevención de lesiones y cierre completo del reto Campo destruido

### Cartas de prevención de lesiones durante partidos

Se incorporan cuatro cartas nuevas:

- **Vendaje preventivo** · Común · reduce un `2%` la probabilidad de lesión durante el partido.
- **Control de cargas** · Rara · reduce un `5%`.
- **Laboratorio de prevención** · Épica · reduce un `8%`.
- **Plantel blindado** · Legendaria · reduce un `15%`.

Las cartas actúan únicamente sobre el club del manager y sólo reducen la probabilidad de que se produzca una nueva lesión dentro de un partido. No curan lesiones previas, no reducen la duración de una lesión y no alteran el desgaste. El efecto se aplica en resultado rápido, partido dirigido y simulador en vivo. Los porcentajes de varias cartas activas son acumulables hasta el límite general del `95%`.

### Final completo de Primera División en Campo destruido

- El reto representa las fechas 30 a 34 de la Primera División argentina.
- Participan los 18 clubes de la categoría.
- Cada fecha contiene 9 partidos y cada club juega una vez.
- El calendario total incluye 45 encuentros, sin repetir enfrentamientos.
- Los cinco rivales especiales del manager se conservan y el club elegido disputa esos encuentros como local en el campo destruido.
- Antes de cada partido del manager se simulan los otros ocho resultados de esa jornada. Todos modifican la misma tabla.
- La clasificación inicial conserva la situación de final de temporada configurada para el reto.

Las partidas del reto creadas en una versión anterior y todavía sin partidos disputados se actualizan automáticamente al calendario completo. Un reto ya comenzado conserva su calendario previo para no reescribir resultados, estadísticas ni posiciones a mitad de la serie.

### Resolución del reto

Después de la quinta fecha y cuando los 45 partidos quedaron resueltos:

- Si el club termina primero en la tabla, la directiva agradece al manager y entrega **10.000 puntos de habilidad**.
- La tabla se ordena primero por puntos y luego por diferencia de gol, utilizando los desempates generales de la competición si ambos valores son idénticos.
- Si el club no termina primero, la directiva despide al manager.
- En ambos casos el desafío finaliza, el slot del reto se cierra y se vuelve a la pantalla de creación y selección de partidas.
- La recompensa se acredita una sola vez y se conserva en el perfil compartido del manager.

### Archivos principales modificados en V7.41

- `config.js`
- `index.html`
- `balance-manager.js`
- `balance-modificadores.js`
- `simulador-2.0.js`
- `data/habilidades_especiales.json`
- `data/retos_manager.json`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/15-especial.js`
- `js/game/18-challenges-online.js`
- `README.md`

### Compatibilidad

**V7.41 no rompe partidas anteriores.** Las cartas nuevas se incorporan al catálogo existente. Las partidas normales no cambian. Los retos Campo destruido todavía no iniciados migran al calendario de 45 partidos; los que ya disputaron al menos un encuentro conservan el calendario anterior para evitar modificaciones retroactivas.



## V7.40 - Progresión de empleados y costos administrativos del club fundador

### Empleados desbloqueados por victorias

Esta dificultad se aplica únicamente mientras el manager dirige el club que fundó:

- Al inicio sólo puede contratar empleados de categoría **Regular**.
- La categoría **Bueno** se habilita al alcanzar **15 victorias oficiales** con el club fundador.
- La categoría **Elite** se habilita al alcanzar **45 victorias oficiales** con el club fundador.
- El conteo suma temporadas completas y la temporada actual del club fundador. No utiliza victorias obtenidas previamente con otros clubes.
- El modal de contratación muestra el progreso y las victorias restantes.
- La misma progresión se aplica a los jefes de ojeadores Regular, Bueno y Elite del Centro de Ojeo.
- La contratación también se valida internamente para impedir que una categoría bloqueada se contrate ejecutando la acción por fuera de la interfaz.
- Los contratos superiores ya activos en una partida anterior no se eliminan; la restricción se aplica a nuevas contrataciones.

### Costos administrativos diarios

El club fundador afronta diariamente:

- Inscripción en la liga.
- Seguridad.
- Transporte.
- Administración.
- Mantenimiento mínimo.
- Seguros.

El total combina un costo base por división y una proporción del valor actual del plantel:

- Primera división: `$180.000` + `0,0015%` del plantel por día.
- Segunda división: `$100.000` + `0,0012%` del plantel por día.
- Tercera división: `$60.000` + `0,0010%` del plantel por día.

El cobro es idempotente: una fecha no puede cobrarse dos veces. Finanzas muestra la estimación vigente, el desglose de los seis conceptos y agrupa los movimientos bajo **Costos administrativos**.

### Archivos principales modificados en V7.40

- `config.js`
- `index.html`
- `balance-manager.js`
- `balance-modificadores.js`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/10-academy-employees.js`
- `js/game/16-scouting-center.js`
- `js/game/18-challenges-online.js`
- `js/ui/12-modals.js`
- `README.md`

### Compatibilidad

**V7.40 no rompe partidas anteriores.** Las restricciones usan las estadísticas ya guardadas. Las partidas fundadoras existentes comenzarán a pagar los costos administrativos desde el próximo día procesado. Las carreras normales y los clubes no fundados no reciben estos gastos ni bloqueos.

## V7.39 - Tarjetas unificadas de Desafíos Online y referencia salarial

### Disponibles

- Las tarjetas de **Disponibles** adoptan el lenguaje visual horizontal de **Partidos disputados**.
- Cada desafío muestra escudo, nombre del club, nombre del manager y sueldos totales de la convocatoria publicada.
- El estado, la fecha de publicación, el vencimiento y el botón para aceptar quedan agrupados en un bloque lateral, sin volver a mostrar estadio, capacidad, hinchas, valor de plantel ni formación.

### Mis desafíos

- Un desafío todavía abierto utiliza la misma tarjeta horizontal, con escudo, club, manager y sueldos de la convocatoria propia.
- Cuando ya existe rival, la tarjeta muestra ambos clubes y managers enfrentados, los sueldos de ambas convocatorias y el resultado final o el estado `VS` mientras se procesa.
- Se mantienen los botones **Cancelar** y **Ver partido**, junto con la apertura del detalle completo del encuentro.

### Referencia de nivel

- El valor mostrado como **Sueldos** corresponde a `matchSquadSalaryTotal`, es decir, la suma salarial de titulares y suplentes incluidos en la fotografía del desafío.
- Como respaldo para fotografías antiguas sin ese campo, se utiliza `startingXiSalaryTotal`.
- El historial de **Partidos disputados** conserva su contenido simplificado anterior y no agrega información adicional.

### Diseño adaptable

- Disponibles, Mis desafíos y Partidos disputados comparten proporciones, tamaño fijo de escudos, recorte seguro de nombres y distribución horizontal.
- En pantallas amplias pueden mostrarse dos tarjetas por fila.
- En pantallas angostas, las acciones pasan debajo del club y los enfrentamientos mantienen la adaptación móvil ya existente.

### Archivos principales modificados en V7.39

- `config.js`
- `balance-manager.js`
- `balance-modificadores.js`
- `index.html`
- `style.css`
- `js/core/01-config-constants.js`
- `js/game/18-challenges-online.js`
- `README.md`

**V7.39 no rompe partidas anteriores.** No modifica partidas, snapshots existentes ni la estructura del servicio online. Las fotografías antiguas siguen siendo compatibles; si no incluyen la masa salarial completa de la convocatoria, se muestra el total salarial del once inicial disponible en esa fotografía.

---

## Historial anterior

## V7.38 - Corrección del alquiler de oficinas de ojeo

### Error corregido

- El botón **Alquilar oficina** descontaba correctamente el primer mes, pero la cantidad de oficinas permanecía en cero.
- La causa era una segunda normalización del estado del Centro de Ojeo al consultar el límite del jefe de ojeadores.
- Esa normalización reemplazaba el objeto guardado y el incremento se aplicaba sobre una referencia anterior que ya no pertenecía a la partida.
- La consulta del límite ahora reutiliza el mismo estado que se está modificando, por lo que alquiler, fecha de cobro, capacidad y guardado se actualizan en una única operación.

### Comportamiento verificado

- Un jefe Regular puede alquilar 1 oficina.
- Un jefe Bueno puede alquilar hasta 2 oficinas.
- Un jefe Elite puede alquilar hasta 5 oficinas.
- Cada alquiler cobra una sola vez el costo inicial de `$1.000.000`, aumenta la capacidad en 3 ojeadores y 10 seguimientos, guarda la fecha de inicio y persiste al recargar.
- Al alcanzar el máximo del jefe, no se cobra dinero ni se agrega otra oficina.
- Sin jefe de ojeadores, el control muestra **Requiere jefe** y explica el requisito; al pulsarlo informa que primero debe contratarse uno.
- Después de alquilar se muestra una confirmación con la capacidad resultante.
- Cancelar una oficina conserva las validaciones existentes para impedir que queden ojeadores o seguimientos por encima del nuevo cupo.

### Archivos principales modificados en V7.38

- `config.js`
- `balance-manager.js`
- `balance-modificadores.js`
- `index.html`
- `js/core/01-config-constants.js`
- `js/game/16-scouting-center.js`
- `js/game/18-challenges-online.js`
- `README.md`

**V7.38 no rompe partidas anteriores.** No cambia la estructura de guardado. Las oficinas ya registradas continúan funcionando y las partidas donde el cobro fallido no llegó a guardar una oficina simplemente podrán alquilarla nuevamente.

---

## V7.37 - Auditoría táctica bot y cobertura del top 5

### Prioridad de los mejores jugadores contra el manager

- Antes de cada partido contra el club controlado por el manager, el bot ordena a sus jugadores disponibles por media efectiva.
- Se forma un grupo prioritario de 5 futbolistas. Para mantener una alineación válida, el grupo admite como máximo un portero; si aparecen dos porteros entre los primeros puestos, el segundo se reemplaza por el siguiente jugador de campo.
- Los cinco jugadores prioritarios deben quedar incluidos en el once inicial siempre que exista una alineación reglamentaria.
- La regla se aplica tanto al partido simulado directamente como al simulador en vivo.
- Los partidos entre dos equipos bot mantienen el selector general anterior y no activan esta prioridad especial.

### Elección de formación

- Se prueban las diez formaciones disponibles antes de confirmar la táctica bot.
- La comparación se realiza en este orden: cantidad de jugadores prioritarios incluidos, adaptación de esos jugadores a los puestos, cantidad de puestos sin cubrir y rendimiento total del once.
- Un rol exacto vale más que una ubicación compatible y una ubicación compatible vale más que forzar al jugador fuera de su zona.
- Si el plantel tiene tres delanteros entre sus principales figuras, las formaciones con tres lugares ofensivos reciben ventaja por poder utilizarlos juntos con mejor adaptación.
- Después de asegurar el top 5, los seis puestos restantes se completan mediante la optimización global del once que ya utilizaba el juego.

### Test interno

- Cada táctica bot contra el manager conserva una auditoría interna con formación elegida, jugadores prioritarios, cantidad incluida, adaptación media y jugadores omitidos.
- Puede ejecutarse desde la consola del navegador con `BotFormationCoverageTest.testClub(idClub)` para revisar un club o `BotFormationCoverageTest.testAll()` para revisar todos los bots.
- La auditoría no genera mensajes ni información visible para el jugador.
- En la validación de la base actual, los 161 clubes bot evaluados incluyeron correctamente a sus cinco jugadores prioritarios.
- Una prueba específica con tres delanteros centro como principales figuras seleccionó `3-4-3` y ubicó a los tres en posiciones exactas.

### Configuración

El bloque `equilibrioBots.tacticaContraManager` permite ajustar:

- Activación de la prioridad.
- Cantidad de jugadores prioritarios, entre 3 y 5.
- Bonificación interna que garantiza su inclusión.
- Registro de la auditoría táctica.

### Archivos principales modificados en V7.37

- `config.js`
- `balance-manager.js`
- `balance-modificadores.js`
- `index.html`
- `simulador-2.0.js`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/game/18-challenges-online.js`
- `README.md`

**V7.37 no rompe partidas anteriores.** No cambia la estructura de guardado ni modifica planteles, resultados o tácticas del manager. La nueva selección se calcula únicamente al preparar los próximos partidos de un bot contra el manager.


## V7.36 - Respuestas por cláusula y nombres por nacionalidad

### Respuestas personalizadas ante ofertas por cláusula

- El banco específico tenía 10 respuestas: 5 cuando el jugador aceptaba quedarse y 5 cuando rechazaba la charla y ejecutaba su salida.
- Ahora contiene 20 respuestas: 10 de permanencia y 10 de salida.
- Las respuestas incorporan dinámicamente el nombre del jugador, el nombre del manager y el club actual.
- Se mantiene la misma probabilidad deportiva de convencer al jugador; sólo aumenta la variedad narrativa.
- Los 40 consejos generales del asistente no fueron modificados.

### Nombres y apellidos por nacionalidad

- Se corrigió una contradicción: los jugadores profesionales generados recibían una nacionalidad propia, pero su nombre se elegía desde un único banco argentino.
- Profesionales generados, agentes libres, refuerzos de emergencia bot y juveniles usan ahora bancos de nombres y apellidos asociados a su nacionalidad.
- Argentina pasa de 60 nombres y 60 apellidos juveniles a 180 y 180.
- Chile, Brasil, Inglaterra, España, Italia y Rumania pasan de 30 nombres y 30 apellidos a 90 y 90 por país.
- También se incorporaron bancos de 90 nombres y 90 apellidos para las demás nacionalidades presentes en la base y en la generación dinámica, incluidas Uruguay, Colombia, Francia, Portugal, Serbia, Croacia, Países Bajos, Senegal y otras.
- Los 4.050 jugadores de la base inicial fueron renombrados de forma determinista según su nacionalidad, sin cambiar ids, edad, club, posición, habilidades, sueldo, cláusula ni valor.
- Los jugadores manuales y personalizados conservan sus nombres definidos en `data/jugadores_manuales.json`.
- Se corrigió una validación de rango: cuando `mediaMin` y `mediaMax` estaban en `null`, JavaScript los interpretaba como cero y podía crear juveniles libres o planteles de respaldo con media 1. Ahora sólo se usa un rango fijo cuando ambos valores fueron proporcionados realmente; en los demás casos se aplican las reglas de media por liga y prestigio.

### Archivos principales modificados en V7.36

- `config.js`
- `balance-manager.js`
- `balance-modificadores.js`
- `index.html`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/data/04-player-name-pools.js`
- `js/data/04-data-storage.js`
- `js/game/10-academy-employees.js`
- `js/game/16-scouting-center.js`
- `js/game/18-challenges-online.js`
- `js/ui/06-render-home-messages.js`
- `data/jugadores.json`
- `data/jugadores/*.json`
- `README.md`

**V7.36 no rompe partidas anteriores.** Las partidas guardadas conservan los nombres ya almacenados en su snapshot. Los bancos ampliados se aplican a nuevos jugadores generados y a partidas nuevas; no se cambian nombres de jugadores dentro de una carrera ya iniciada.

---

## Historial anterior

## V7.35 - Fundar club al crear manager y continuidad después de renunciar

El modo **Fundar club** queda disponible tanto al iniciar una partida como durante una carrera en la que el manager quedó sin contrato. La fundación desde una carrera existente ya no reinicia el historial del manager.

### Fundar club desde “Crear manager”

- La pantalla inicial **Crear manager** incorpora una tarjeta propia de **Modo fundador · dificultad extrema**, ubicada junto a los demás modos y retos.
- El botón **Fundar club** abre el formulario de nombre, ciudad, país, color y escudo.
- La descripción informa las dificultades iniciales: plantel de 0 jugadores, presupuesto de $0, estadio con capacidad 0, campo deteriorado, sólo 500 hinchas y necesidad de construir desde cero el plantel, los ingresos y la infraestructura.
- El modo conserva sus reglas originales: ingreso en la división más baja, sin objetivos de directiva y sin despidos, pero con crecimiento deportivo y económico considerablemente más exigente.

### Fundar club después de una renuncia

- Cuando el manager renuncia y luego elige **Fundar club**, la temporada actual termina obligatoriamente antes de crear el nuevo equipo.
- Los encuentros pendientes se resuelven mediante una simulación bot resumida para cerrar rápidamente tablas, playoffs, ascensos, descensos, campeones y Mundial de Clubes sin bloquear el navegador.
- No se acreditan al manager títulos, premios, objetivos ni méritos posteriores a la renuncia por los resultados del club abandonado.
- Al terminar el año deportivo, se aplican los movimientos de divisiones y el club fundado reemplaza a un equipo que realmente estará en la división más baja durante la temporada siguiente.
- La nueva temporada comienza de inmediato con el club fundado.
- Se conservan prestigio, experiencia, historial de carrera, títulos previos y cartas del manager. Las cartas que estaban activas vuelven a la reserva según la regla existente para un cambio de club.
- El mismo flujo seguro se utiliza si el manager quedó sin club por despido, evitando una vía alternativa que reiniciara la carrera.
- Si la temporada ya estaba finalizada, no se vuelve a simular: se inicia directamente la temporada siguiente.

### Corrección de continuidad

Antes de V7.35, `createFounderGame()` ejecutaba `newGame()` incluso cuando se accedía al modo fundador desde una carrera sin club. Esto borraba la continuidad deportiva y comenzaba otra partida desde la temporada 1. Ahora existen dos recorridos separados:

- **Partida inicial:** crea una carrera fundadora nueva en la temporada 1.
- **Carrera sin club:** finaliza la temporada vigente, conserva el perfil del manager e inicia la temporada siguiente con el club nuevo.

### Archivos principales modificados en V7.35

- `config.js`
- `balance-manager.js`
- `balance-modificadores.js`
- `index.html`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/18-challenges-online.js`
- `js/ui/12-modals.js`
- `README.md`

**V7.35 no rompe partidas anteriores.** No cambia el esquema de guardado. En una carrera existente, la temporada sólo se cierra automáticamente cuando el manager está sin club y confirma la creación de un club propio; no se alteran partidas que no utilicen esa opción.

---

## V7.34 - Preparación del Mundial, sedes neutrales y mejor once bot

Un día antes de la primera fecha del Mundial de Clubes se ejecuta una preparación automática y silenciosa sobre todos los participantes controlados por la CPU. El único mensaje visible es: **“Los equipos ya están listos en la ciudad anfitriona.”**

### Preparación previa al torneo

- Los participantes bot quedan con forma física y moral al máximo interno del juego (`99/99`, equivalente al 100%), cohesión `100/100` y desgaste acumulado en cero.
- Se eliminan todas las lesiones activas de sus planteles. Las suspensiones no se borran.
- Cada participante bot debe disponer de 21 jugadores elegibles para completar once titular y diez suplentes. Si no alcanza esa cantidad, ficha agentes libres; sólo genera un jugador de emergencia cuando no existe una opción libre adecuada.
- Los clubes participantes que sean campeones de una liga en esa temporada reciben, por jugador, entre 10 y 30 puntos totales de boost de entrenamiento distribuidos entre habilidades entrenables. El club del manager queda excluido de todas estas ayudas.
- La preparación se registra una sola vez por edición. La forma, moral, cohesión, lesiones y disponibilidad se vuelven a validar silenciosamente antes del debut para evitar que un partido doméstico del día anterior deshaga la puesta a punto. El boost de entrenamiento y el mensaje no se repiten.
- En partidas anteriores situadas antes del primer partido se aplica automáticamente; si el Mundial ya tiene resultados disputados, no modifica retrospectivamente el torneo.

### Formación de los equipos bot

- Todos los equipos bot evalúan las formaciones disponibles y eligen la que produce su mejor once según media efectiva, adaptación al puesto, forma y moral. La asignación de jugadores a los once puestos se resuelve de forma global para evitar selecciones parciales inferiores.
- La misma selección se usa en la simulación rápida y en la simulación completa.
- Los bots convocan hasta diez suplentes adicionales cuando disponen de 21 jugadores elegibles.

### Sedes y público del Mundial de Clubes

- Los partidos utilizan exclusivamente los estadios definidos para el torneo: **MetLife Stadium**, **Mercedes-Benz Stadium**, **Lincoln Financial Field** y **Camping World Stadium**.
- No se utiliza el estadio, el campo ni la capacidad del club marcado administrativamente como local.
- Se retiraron todas las ventajas de localía del Mundial, tanto en posesión, ataques, xG y público como en la simulación rápida.
- La asistencia se distribuye proporcionalmente entre las hinchadas totales de ambos clubes y se limita por la capacidad de la sede neutral.
- Los partidos del Mundial no generan recaudación de entradas para ninguno de los clubes.

### Corrección adicional

- La limpieza genérica de lesiones ahora elimina también `injuredUntilTurn` e `injuredAtTurn`. Esos campos podían mantener una lesión activa después de borrar sus datos de fecha de partido.

### Archivos principales modificados en V7.34

- `config.js`
- `balance-manager.js`
- `balance-modificadores.js`
- `index.html`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/18-challenges-online.js`
- `simulador-2.0.js`
- `README.md`

**V7.34 no rompe partidas anteriores.** Conserva el esquema de guardado. Las carreras existentes aplican la preparación sólo si la edición actual del Mundial aún no disputó ningún partido; un torneo ya iniciado no recibe cambios retroactivos.


## V7.33 - Auditoría de código, calendario y rendimiento

Se realizó una revisión estática y una prueba completa de ejecución sobre la base V7.32. Esta versión corrige una contradicción de calendario, elimina código confirmado como inactivo y reduce operaciones repetitivas en búsquedas de clubes y jugadores.

### Corrección de fechas y playoffs

- Se corrigieron comparadores cronológicos que ordenaban fechas en sentido inverso.
- La última fecha de la fase regular ahora se calcula usando la fecha realmente más avanzada del calendario.
- Los playoffs argentinos de promoción se programan 7 y 14 días después de la última fecha regular.
- Al cargar una partida anterior, los playoffs de promoción todavía no disputados se corrigen automáticamente si habían quedado ubicados antes de tiempo.
- Los playoffs que ya tengan al menos un partido disputado no se reprograman, para conservar el historial de la carrera.
- También se corrigió el desempate por fecha en la visualización de partidos de grupos del Mundial de Clubes.

### Limpieza de código sin uso

La auditoría confirmó que las siguientes funciones no tenían ninguna referencia en HTML ni JavaScript y fueron eliminadas:

- `clubWorldCupAuthoritativeGroupDate`
- `clubWorldCupLatestDate`
- `clubWorldCupMinFirstGroupDate`
- `clubWorldCupStageLabel`
- `rankingStoredAuthExpiresAt`

No se eliminaron archivos completos. `app.js`, `balance-manager.js` y los módulos históricos de datos siguen siendo necesarios. Las versiones internas V3.x presentes en algunos JSON corresponden al esquema o generación de esos datos y no a la versión pública del juego.

### Rendimiento y carga

- `playerById` y `clubById` ahora utilizan índices en memoria y dejan de recorrer las listas completas en cada consulta.
- En la prueba de 100.000 búsquedas de jugadores, el tiempo bajó de aproximadamente **177 ms** a **7 ms** en el entorno de auditoría.
- Los 24 scripts externos se cargan con `defer`, conservando su orden de ejecución y evitando bloquear el análisis inicial del HTML.
- Se sincronizaron los valores de respaldo de `config.js` con el balance efectivo para evitar diferencias si el archivo de modificadores no pudiera cargarse.

### Contradicciones corregidas

- `config.js` y `balance-modificadores.js` diferían en seis valores activos: cohesión inicial, penalización del suplente lesionado, fatiga viva, tarjetas y desgaste mínimo/máximo de partido. Los valores de respaldo ahora coinciden con el balance efectivo; con la carga normal no cambia el balance jugable.
- El objeto enviado al Ranking Online repetía las claves `budget_variation` y `titles`. Se conservaron una sola vez y `titles` se normaliza como número.
- Los metadatos activos de balance fueron actualizados a V7.33. Los valores deportivos de `balance-manager.js` no fueron modificados.

### Verificaciones realizadas

- Sintaxis válida en todos los archivos JavaScript.
- Lectura válida de todos los archivos JSON.
- Auditoría estática sin claves duplicadas, código inalcanzable ni advertencias activas.
- Carga completa de 162 clubes y más de 4.000 jugadores.
- Creación de una partida nueva y renderizado de las 16 secciones sin errores de consola.
- Prueba de reparación de playoffs pendientes y conservación de playoffs ya disputados.
- Paquetes generados sin archivos de imagen.

### Archivos principales modificados en V7.33

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `balance-manager.js`
- `js/core/01-config-constants.js`
- `js/core/02-ui-utils.js`
- `js/core/03-player-tactics-utils.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/game/10-academy-employees.js`
- `js/game/16-scouting-center.js`
- `js/game/13-ranking-online.js`
- `js/game/15-especial.js`
- `js/game/17-live-match.js`
- `js/game/18-challenges-online.js`

### Compatibilidad de partidas

**V7.33 no rompe partidas anteriores.** No cambia el esquema del guardado. Las carreras existentes se cargan normalmente; únicamente se reubican de forma automática los playoffs argentinos de promoción que todavía no tengan partidos disputados y hayan sido generados con fechas incorrectas.

---

## V7.32 - Escudos en Partidos disputados

La pestaña **Desafíos Online → Partidos disputados** conserva el formato simplificado y vuelve a mostrar el escudo de cada club.

Cada enfrentamiento presenta únicamente:

- Escudo del club local.
- Nombre del club local.
- Nombre del manager local.
- Resultado final.
- Escudo del club visitante.
- Nombre del club visitante.
- Nombre del manager visitante.

Los escudos mantienen un tamaño fijo para no comprimir los nombres ni desplazar el marcador. El equipo local permanece a la izquierda y el visitante a la derecha. La tarjeta completa continúa siendo clickeable y abre la ficha detallada del partido.

No se modificaron el simulador, los resultados, el ranking, los desafíos guardados ni Cloudflare.

### Archivos principales modificados en V7.32

- `README.md`
- `index.html`
- `style.css`
- `config.js`
- `balance-modificadores.js`
- `js/core/01-config-constants.js`
- `js/game/18-challenges-online.js`

### Compatibilidad de partidas

**V7.32 no rompe partidas anteriores.** El cambio es exclusivamente visual y conserva desafíos, resultados, ranking y carreras existentes.

---

## V7.30 - Reacondicionamiento de tarjetas de Desafíos Online

### Diseño orientado a 1920 × 1080

Se reorganizaron las tarjetas de **Partidos disputados** para impedir que los datos de ambos equipos se compriman, se superpongan o corten las palabras.

- En resoluciones de escritorio amplias se muestran como máximo dos partidos por fila.
- Por debajo de 1500 píxeles se utiliza una sola tarjeta por fila para conservar el ancho interno.
- Cada enfrentamiento mantiene local a la izquierda, marcador en el centro y visitante a la derecha.
- Estadio, capacidad e hinchas utilizan bloques internos estables, sin cortes letra por letra.
- Los nombres largos de clubes y estadios se recortan visualmente con puntos suspensivos, conservando el texto completo como ayuda emergente.
- Las pestañas **Disponibles** y **Mis desafíos** usan un ancho mínimo mayor para evitar tarjetas demasiado estrechas.
- En pantallas pequeñas el enfrentamiento pasa a disposición vertical.

No se modificaron el simulador, los resultados, el ranking, la base online ni el Worker.

### Archivos principales modificados en V7.30

- `README.md`
- `index.html`
- `style.css`
- `config.js`
- `balance-modificadores.js`
- `js/core/01-config-constants.js`
- `js/game/18-challenges-online.js`

### Compatibilidad de partidas

**V7.30 no rompe partidas anteriores.** El cambio es exclusivamente visual y conserva desafíos, resultados, ranking y carreras existentes.

---


## V7.29 - Pausa de desafíos y Ranking Online para usuarios finales

### Pausa entre acciones de desafíos

Publicar o aceptar un desafío activa una pausa local compartida de **10 minutos**:

- Durante ese tiempo se bloquean los botones **Publicar desafío** y **Aceptar desafío**.
- Los botones muestran el tiempo restante en formato `MM:SS`.
- La pausa se conserva al recargar la página o cerrar y volver a abrir el juego.
- Se guarda por cuenta iniciada en ese navegador.
- El bloqueo comienza después de publicar correctamente o después de reservar correctamente un desafío al aceptarlo.
- La simulación y el guardado del partido aceptado continúan normalmente.

La pausa es local y no modifica el servidor ni las partidas guardadas.

### Ranking Online simplificado

La pantalla fue reacondicionada para un usuario final:

- Se oculta el origen interno de la sesión.
- Se oculta la fecha técnica de vencimiento de la credencial.
- Se elimina el contador técnico de registros descargados.
- Se reemplazan explicaciones de almacenamiento y red por mensajes simples.
- La pantalla sólo informa si la sesión está activa, si el ranking se actualizó o si todavía no hay carreras publicadas.

### Paquetes

Desde V7.29 los ZIP del juego no incluyen carpetas, migraciones, Workers ni instrucciones de Cloudflare. Esta actualización no requiere cambios externos.

### Archivos principales modificados en V7.29

- `README.md`
- `index.html`
- `style.css`
- `config.js`
- `balance-modificadores.js`
- `js/core/01-config-constants.js`
- `js/game/13-ranking-online.js`
- `js/game/18-challenges-online.js`

### Compatibilidad de partidas

**V7.29 no rompe partidas anteriores.** La pausa se guarda en el navegador y no altera carreras, desafíos publicados, resultados ni datos del club.

---

## V7.28 - Presentación de desafíos, residencias y cartas por rareza

- Se unificaron los nombres visibles del simulador como **Disparos** y **Tiros a Puerta**.
- Cada nivel del predio juvenil habilita dos residencias acumulativas.
- Los jugadores intransferibles muestran un candado.
- Los usos de cartas dependen de la rareza: 1, 2, 3 y 5.
- Desafíos Online incorporó escudos, estadio, capacidad, hinchas y detalle en tres columnas.

## V7.27 - Ranking de desafíos y listas estables

- Se corrigió el parpadeo de listas vacías en Desafíos Online.
- Se agregó el ranking público calculado según resultado, diferencia de media y diferencia de goles.
- No requirió una tabla D1 adicional.

## V7.25 - Código reutilizable de fondos para el club

Se agregó un código especial alfanumérico que acredita **$100.000.000** al presupuesto del club dirigido cada vez que se canjea.

### Funcionamiento

- El código puede utilizarse una cantidad ilimitada de veces dentro de la misma partida.
- Cada uso acredita $100.000.000 al club actual del manager.
- El movimiento queda registrado en Finanzas como `Código especial`.
- El presupuesto persistente del club se actualiza junto con el presupuesto activo de la partida.
- El historial del código guarda la cantidad de usos, pero no bloquea nuevos canjes.
- Los diez códigos anteriores continúan siendo de un solo uso por partida.
- El código real no está incluido en los ZIP públicos; la configuración conserva solamente su huella SHA-256.

### Archivos principales modificados en V7.25

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/instalaciones.json`
- `js/core/01-config-constants.js`
- `js/game/15-especial.js`

### Compatibilidad de partidas

**V7.25 no rompe partidas anteriores.** Agrega un nuevo código reutilizable y conserva códigos reclamados, cartas, presupuestos, planteles y progreso existentes.

---

## V7.24 - Mensajes antiguos e instalaciones del club

### Borrar mensajes antiguos

En **Mensajes** se agregó el botón `Borrar mensajes antiguos`. La acción solicita confirmación, elimina los avisos cerrados y conserva cualquier oferta o acción que continúe pendiente de respuesta.

### Instalaciones en Estadio

La cabecera de **Estadio** incorpora el botón `Instalaciones`, que abre una pantalla específica para construcciones permanentes vinculadas al club. Las instalaciones quedan asociadas al club y no al manager.

#### Calefacción de césped

- Construcción: **$200.000.000**.
- Duración: **60 días**.
- Una vez terminada dispone de un switch **ON/OFF**.
- Encendida cobra **$10.000 por día**.
- Cada día encendida mejora **+1** el estado del campo, hasta 100.
- Si no hay presupuesto para el gasto diario, se apaga automáticamente y deja un mensaje.
- Puede construirse en paralelo con el predio juvenil.

#### Predio de entrenamiento juvenil

| Nivel | Costo | Obra | Juveniles excepcionales adicionales |
|---|---:|---:|---:|
| 1 · Básico | $20.000.000 | 58 días | +0 |
| 2 · Medio | $100.000.000 | 105 días | +1 |
| 3 · Bueno | $300.000.000 | 180 días | +2 |
| 4 · Excelente | $500.000.000 | 230 días | +3 |
| 5 · Elite | $1.200.000.000 | 80 días | +5 |

Los niveles deben construirse en orden. El bonus se suma al juvenil excepcional base de cada temporada. Los juveniles adicionales se entregan mediante captaciones mientras haya cupos disponibles. Si el predio mejora después de que ya se entregó el juvenil base, una captación posterior puede entregar la diferencia pendiente del nuevo nivel.

### Persistencia y economía

- Las obras conservan sus días restantes al guardar y cargar.
- Las instalaciones terminadas permanecen entre temporadas.
- Los gastos y construcciones aparecen en Finanzas dentro de la categoría Estadio.
- Cambiar de club no traslada las instalaciones: cada club conserva las propias.

### Archivos principales modificados en V7.24

- `README.md`
- `index.html`
- `style.css`
- `config.js`
- `balance-modificadores.js`
- `data/instalaciones.json`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/ui/06-render-home-messages.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/10-academy-employees.js`
- `js/game/16-scouting-center.js`

### Compatibilidad de partidas

**V7.24 no rompe partidas anteriores.** Los guardados existentes reciben el estado inicial de instalaciones sin obras construidas y conservan mensajes, academia, estadio, presupuesto y progreso anteriores.

---


## V7.23 - Nuevas cartas de apoyo, marketing, mercado y medicina

Se incorporaron cuatro familias nuevas al sistema de cartas especiales. Cada familia contiene una carta común, rara, épica y legendaria, por lo que se agregan **16 cartas nuevas** al conjunto disponible en los sobres.

### Todo al apoyo a mi capitán

- **Común:** +1 punto porcentual de progreso por partido.
- **Rara:** +3 puntos.
- **Épica:** +5 puntos.
- **Legendaria:** +12 puntos.

El bonus se suma al progreso normal obtenido por el jugador que disputó el encuentro como capitán. Las cartas se apilan y el resultado nunca supera el máximo individual de capitanía del jugador.

### Director de marketing

- **Común:** +1%.
- **Rara:** +3%.
- **Épica:** +5%.
- **Legendaria:** +12%.

En partidos donde el club del manager actúa como local, el porcentaje acumulado aumenta la demanda de hinchas locales hasta la capacidad disponible del estadio. El mismo porcentaje también se aplica sobre la recaudación de entradas, por lo que conserva utilidad aun cuando el estadio esté completo.

### Director deportivo

- **Común:** +1 punto porcentual.
- **Rara:** +2 puntos.
- **Épica:** +3 puntos.
- **Legendaria:** +7 puntos.

El bonus se suma al porcentaje de cláusula calculado para las ofertas recibidas por jugadores propios. Se combina con partidos, goles, asistencias, rendimiento y ojeo. No modifica las ofertas que ya pagan la cláusula completa.

### Médico Milagroso

- **Común:** resta 1 día adicional.
- **Rara:** resta 2 días adicionales.
- **Épica:** resta 3 días adicionales.
- **Legendaria:** resta 5 días adicionales.

El bonus se aplica cuando el tratamiento del kinesiólogo resulta exitoso. Se suma a la reducción normal del empleado y puede aplicarse también al tratamiento conjunto de todos los lesionados. No convierte un tratamiento fallido en exitoso y no altera lesiones juveniles que ya se curan completamente mediante su tratamiento específico.

### Apilamiento y usos

- Las cuatro familias respetan el límite general de cinco cartas activas.
- Las cartas repetidas continúan permitidas y sus efectos se suman.
- Mantienen el sistema normal de 10 activaciones y el bloqueo de 15 días.
- Las cartas nuevas pueden aparecer en sobres según la probabilidad de su rareza.
- No se modifican ni reemplazan cartas obtenidas en versiones anteriores.

### Archivos principales modificados en V7.23

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/habilidades_especiales.json`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/data/04-data-storage.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/10-academy-employees.js`
- `js/game/16-scouting-center.js`
- `js/game/15-especial.js`
- `js/ui/06-render-home-messages.js`
- `js/ui/12-modals.js`

### Compatibilidad de partidas

**V7.23 no rompe partidas anteriores.** Agrega nuevas cartas al conjunto de sobres y conserva íntegramente cartas activas, reserva, usos, bloqueos, progreso de capitanía, lesiones, presupuestos y ofertas existentes.

---


## V7.22 - Nuevos valores de recuperación física de cartas

Se reajustaron los puntos directos que otorgan las cartas de preparación física después de calcular el desgaste completo del partido.

### Valores por rareza

- **Común:** +1 punto de forma física postpartido.
- **Rara:** +3 puntos.
- **Épica:** +5 puntos.
- **Legendaria:** +12 puntos.

Las cartas continúan apilándose. Cinco cartas legendarias activas suman **+60 puntos** a cada jugador del club del manager que haya disputado el encuentro, con un máximo final de 99 de forma.

### Migración de cartas existentes

- Las cartas ya obtenidas se normalizan automáticamente según su rareza.
- Se conservan usos, estado activo, bloqueo, inventario y posición en reserva.
- No se crean cartas nuevas ni se eliminan cartas existentes.
- El cambio empieza a aplicarse desde el siguiente partido.

### Archivos principales modificados en V7.22

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/habilidades_especiales.json`
- `js/core/01-config-constants.js`
- `js/game/15-especial.js`

### Compatibilidad de partidas

**V7.22 no rompe partidas anteriores.** Actualiza automáticamente el valor de las cartas de preparación física existentes sin modificar usos, bloqueos, inventario ni activaciones.

---


## V7.21 - Mundial de Clubes por día fijo de temporada

El calendario del Mundial de Clubes deja de calcularse a partir de fechas ISO, del final de las ligas o de la última ronda creada. Cada etapa utiliza un día fijo y autoritativo de la temporada.

### Calendario oficial

- **Día 295:** sorteo de los ocho grupos.
- **Día 305:** primera fecha de grupos.
- **Día 310:** segunda fecha de grupos.
- **Día 315:** tercera fecha de grupos.
- **Día 320:** octavos de final.
- **Día 325:** cuartos de final.
- **Día 330:** semifinales.
- **Día 335:** partido por el tercer puesto.
- **Día 336:** final.

Los grupos continúan funcionando como ligas de cuatro equipos y clasifican los dos primeros de cada grupo.

### Años bisiestos

- Los días del Mundial no cambian: el sorteo sigue siendo el día 295 y la final el día 336.
- La fecha ISO visible se deriva del número de día real de esa temporada.
- En un año bisiesto existe el día 366, pero queda libre de competencias del Mundial.
- Ninguna fase se desplaza mediante cálculos basados en el final de las ligas o en la última fecha creada.

### Reparación automática

- Las partidas con fechas incorrectas como `2028-02-27` se realinean al abrir la partida o el calendario.
- Se corrigen las tres jornadas de grupos y todas las eliminatorias existentes.
- Se guarda en cada partido y ronda el nuevo campo temporal `seasonDay`.
- Los resultados ya disputados, clasificados, premios y estadísticas no se eliminan ni se vuelven a simular.
- Los partidos pendientes sólo se procesan cuando el calendario alcanza el día fijo correspondiente.
- La fecha ISO se mantiene únicamente para integrar el Mundial con el calendario general y se deriva siempre del día de temporada.

### Configuración

Los días pueden revisarse en `config.js`, dentro de:

```js
calendario: {
  mundialClubes: {
    diaSorteo: 295,
    diaGrupos1: 305,
    diaGrupos2: 310,
    diaGrupos3: 315,
    diaOctavos: 320,
    diaCuartos: 325,
    diaSemifinales: 330,
    diaTercerPuesto: 335,
    diaFinal: 336
  }
}
```

### Archivos principales modificados en V7.21

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/habilidades_especiales.json`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`

### Compatibilidad de partidas

**V7.21 no rompe partidas anteriores.** Realinea fechas y días del Mundial existente sin borrar resultados. Las ediciones finalizadas permanecen en el historial y las etapas pendientes pasan a respetar el calendario fijo.

---


## V7.20 - Reparación del apilado y del límite físico de las cartas

> Valores históricos de V7.20. Desde V7.22, cinco legendarias suman +60 puntos.

Se corrigieron dos errores que podían dejar a un jugador en 0 de forma aunque hubiera varias cartas legendarias activas.

### Causas corregidas

1. En `habilidades_especiales.json`, `tope_porcentaje: null` significa que el bonus no tiene límite. El cálculo convertía `null` en `0`, por lo que las cartas sin tope podían quedar anuladas completamente.
2. Aunque el bonus se sumara, la forma final volvía a limitarse por el desgaste persistente del jugador: `forma máxima = 99 - desgaste`. Ese límite podía absorber casi toda la recuperación.

### Nuevo comportamiento

- `null`, campo vacío o ausencia de `tope_porcentaje` se interpretan correctamente como **sin límite**.
- Cinco cartas legendarias de preparación física suman realmente **+90 puntos**.
- Se calcula primero la forma final normal del partido y se limita como mínimo a 0.
- Después se suman los puntos directos de las cartas activas.
- Si el desgaste persistente bloquea el resultado, se reduce únicamente el desgaste necesario para habilitar esa forma.
- El bonus se aplica una sola vez; no se duplica entre forma y desgaste.
- Un jugador lesionado durante el encuentro también recibe la recuperación si disputó minutos. La duración de la lesión no se modifica.
- Se mantiene el máximo general de 99 de forma.

Un jugador cuyo cálculo normal termina en 0 y tiene cinco cartas legendarias activas queda en 90 inmediatamente después del partido.

La corrección de `tope_porcentaje: null` también restablece otros bonus acumulables sin límite que estuvieran definidos con ese valor.

### Archivos principales modificados en V7.20

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/habilidades_especiales.json`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/15-especial.js`

### Compatibilidad de partidas

**V7.20 no rompe partidas anteriores.** Conserva cartas, usos, bloqueos, planteles y desgaste guardado. La corrección se aplica desde el siguiente partido disputado.

---

## V7.19 - Recuperación física directa de cartas

> Valores históricos de V7.19. Fueron reajustados posteriormente en V7.22.

Las cartas de preparación física dejaron de aplicar un porcentaje sobre la recuperación base. Ahora suman puntos directos de forma física después de calcular el desgaste completo del partido, evitando que el efecto desaparezca por redondeo.

### Valores por rareza

- **Común:** +2 puntos de forma física postpartido.
- **Rara:** +5 puntos.
- **Épica:** +8 puntos.
- **Legendaria:** +18 puntos.

### Aplicación

- El bonus se aplica únicamente a jugadores del club del manager que hayan disputado el partido.
- Primero se calcula la recuperación base por Resistencia.
- Luego se descuentan el desgaste del encuentro, el estado del campo y los ajustes físicos de las instrucciones tácticas.
- Finalmente se suman los puntos directos de las cartas activas.
- Las cartas del mismo tipo continúan apilándose.
- Un jugador que habría terminado con 0 de forma puede finalizar con 2, 5, 8 o 18 según la carta activa, salvo que alcance el límite máximo de 99.

### Migración de cartas existentes

- Las cartas obtenidas en versiones anteriores se actualizan automáticamente según su rareza.
- Una carta común antigua de +1% pasa a +2 puntos.
- Una rara de +3% pasa a +5 puntos.
- Una épica de +5% pasa a +8 puntos.
- Una legendaria de +9% pasa a +18 puntos.
- Se conservan activaciones utilizadas, bloqueo, inventario y estado activo.

### Archivos principales modificados en V7.19

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/habilidades_especiales.json`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/15-especial.js`

### Compatibilidad de partidas

**V7.19 no rompe partidas anteriores.** Actualiza automáticamente el valor y la unidad de las cartas de preparación física existentes sin eliminar cartas, usos ni bloqueos.

---

## V7.18 - Reparación de penalizaciones por edad

Se corrigió el caso en el que un jugador joven podía conservar una penalización por edad asociada a su ID. El deterioro continúa aplicándose únicamente desde los 32 años.

### Limpieza automática de partidas

- Al cargar una partida, todo jugador menor de 32 años queda con penalización por edad igual a 0.
- Los registros asociados a IDs que ya no pertenecen a ningún jugador activo o del mercado se eliminan.
- El cálculo visible vuelve a comprobar la edad del jugador antes de descontar puntos, de modo que un valor residual nunca afecte sus habilidades.
- La limpieza se repite de forma segura al normalizar el estado, se guarda automáticamente en ambas copias del slot y no modifica penalizaciones válidas de jugadores de 32 años o más.

### Jugadores nuevos y regenerados

- Los juveniles promovidos al primer equipo se inicializan expresamente con penalización 0.
- Los jugadores libres generados para una nueva temporada comienzan en 0.
- Los jugadores creados para clubes invitados del Mundial de Clubes comienzan en 0.
- Los jugadores de emergencia creados para planteles bots comienzan en 0.
- Los jugadores manuales regenerados continúan reiniciando su penalización en 0.

### Cambio de temporada

- Si un jugador tiene menos de 32 años, cualquier penalización residual se elimina antes de continuar.
- Un jugador que alcanza los 32 años al envejecer puede recibir por primera vez el deterioro anual configurado.
- Los puntos obtenidos por entrenamiento no se modifican.

### Archivos principales modificados en V7.18

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/habilidades_especiales.json`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/game/05-state-season.js`
- `js/game/10-academy-employees.js`
- `js/game/16-scouting-center.js`

### Compatibilidad de partidas

**V7.18 no rompe partidas anteriores.** Al cargar, elimina exclusivamente penalizaciones por edad inválidas de jugadores menores de 32 años y registros huérfanos. Conserva entrenamiento, habilidades base, planteles, estadísticas, contratos y penalizaciones válidas de jugadores veteranos.

---

## V7.17 - Valor de ofertas según rendimiento y ojeo

Se mantuvo el requisito mínimo de seis partidos para ofrecer manualmente un jugador, pero esos seis partidos ya no fijan por sí solos el monto. El porcentaje de la cláusula que ofrece un club se incrementa mediante datos existentes de la temporada y del Centro de Ojeo.

### Factores que aumentan la oferta

- **Partidos jugados:** progresan hasta un máximo de **+8 puntos porcentuales** al llegar a 24 partidos.
- **Goles:** agregan **+1,5 puntos porcentuales por gol**, con máximo de +12.
- **Asistencias:** agregan **+1,25 puntos porcentuales por asistencia**, con máximo de +10.
- **Rendimiento de temporada:** agrega hasta **+8 puntos porcentuales**. Se calcula con partidos, producción según posición, atajadas clave y regularidad, utilizando estadísticas ya guardadas.
- **Ojeo:** agrega hasta **+5 puntos porcentuales** según cuántas habilidades ocultas del jugador propio fueron reveladas en el Centro de Ojeo.

El porcentaje final continúa limitado por el rango del perfil del jugador y nunca supera el 100% de la cláusula. Las ofertas especiales que pagan la cláusula completa siguen funcionando de manera separada.

### Alcance

- La fórmula se utiliza al ofrecer manualmente un jugador.
- También se utiliza en ofertas automáticas durante la temporada.
- También se utiliza en ofertas generadas al finalizar la temporada.
- No se agregan habilidades, atributos ni estadísticas nuevas a los jugadores.
- El rendimiento y el ojeo se derivan exclusivamente de información existente en la partida.

### Archivos principales modificados en V7.17

- `README.md`
- `index.html`
- `config.js`
- `data/habilidades_especiales.json`
- `js/core/01-config-constants.js`
- `js/ui/06-render-home-messages.js`

### Compatibilidad de partidas

**V7.17 no rompe partidas anteriores.** Los partidos, goles, asistencias y avances de ojeo ya guardados empiezan a influir inmediatamente en las nuevas ofertas.

---

## V7.16 - Ofertas por cláusula y jugadores ofrecidos

Se ajustaron las decisiones disponibles ante una oferta que paga la cláusula completa y los requisitos para ofrecer manualmente un jugador del plantel.

### Ofertas por cláusula completa

- Las ofertas identificadas como pago de cláusula ya no muestran la opción **Rechazar**.
- Las únicas decisiones disponibles son **Aceptar oferta** o **Convencer al jugador de quedarse**.
- La función interna de rechazo también bloquea estas ofertas, evitando que una partida antigua o una llamada residual pueda rechazarlas.
- Las ofertas normales inferiores a la cláusula conservan las opciones **Aceptar** y **Rechazar**.

### Ofrecer un jugador propio

- Un jugador puede ofrecerse manualmente a otros clubes cuando disputó **6 partidos o más** en la temporada actual.
- Ya no es necesario haberle pagado un sueldo.
- Tampoco se exige que haya convertido goles o asistencias para usar la acción manual.
- Se mantienen el bloqueo por jugador intransferible, el mínimo estructural del plantel y la espera general de tres turnos entre búsquedas.
- Si todavía no alcanzó los seis partidos, la interfaz informa cuántos lleva y cuántos necesita.

### Archivos principales modificados en V7.16

- `README.md`
- `index.html`
- `config.js`
- `data/habilidades_especiales.json`
- `js/core/01-config-constants.js`
- `js/ui/06-render-home-messages.js`
- `js/ui/12-modals.js`

### Compatibilidad de partidas

**V7.16 no rompe partidas anteriores.** Las ofertas pendientes por cláusula conservan su información, pero dejan de permitir rechazo; los partidos ya registrados de cada jugador se utilizan inmediatamente para habilitar la acción de ofrecerlo.

---

## V7.15 - Reparación definitiva de generación del Mundial de Clubes

Se corrigieron dos bloqueos que todavía podían impedir el sorteo después del día 295.

### Causas encontradas

- La vista **Calendario → Mundial de Clubes** mostraba la competencia, pero no ejecutaba la función de generación. La creación desde pantalla sólo estaba conectada a otra ruta interna.
- Algunas partidas podían conservar un objeto `clubWorldCup` vacío o incompleto de la temporada actual. Como el código comprobaba únicamente si el objeto existía, ese estado inválido impedía volver a sortear la competencia.
- La selección de clasificados podía detenerse silenciosamente si una división no devolvía suficientes posiciones válidas.

### Correcciones

- El Mundial se verifica al renderizar cualquier pantalla del juego desde el día 295.
- También se verifica expresamente al abrir **Calendario → Mundial de Clubes**.
- Un estado vacío o incompleto, sin partidos disputados, se elimina y se reconstruye automáticamente.
- Si el estado es válido pero faltan los partidos de grupos, el fixture se reconstruye sin repetir el sorteo.
- La selección conserva los cupos previstos por país y completa cualquier faltante con clubes de primeras divisiones ordenados por tabla y reputación.
- La competencia ya no falla silenciosamente: si no pudiera reunir 32 clubes, la pantalla muestra el motivo técnico.
- El club del manager no necesita estar clasificado. Si no participa, los 64 partidos se desarrollan únicamente entre bots.
- Las partidas ubicadas en el día 313 o posterior generan el torneo al cargar/renderizar la partida, sin esperar otro partido del usuario.

### Protección de partidas

La reparación automática sólo reinicia un estado estructuralmente incompleto cuando no existen partidos del Mundial ya disputados. Si encuentra resultados jugados, no los elimina.

### Archivos principales modificados en V7.15

- `README.md`
- `index.html`
- `config.js`
- `data/habilidades_especiales.json`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/ui/06-render-home-messages.js`

### Compatibilidad de partidas

**V7.15 no rompe partidas anteriores.** Repara estados vacíos del Mundial y conserva cualquier edición que ya tenga resultados disputados.

---

## V7.14 - Generación automática del Mundial de Clubes

El sorteo del Mundial de Clubes ahora se genera automáticamente al alcanzar el **día 295** de cada temporada, aunque el club dirigido por el usuario no esté clasificado y aunque todavía exista algún partido doméstico pendiente.

### Funcionamiento

- El día 295 se seleccionan los 32 participantes y se crean los ocho grupos de cuatro equipos.
- La creación ya no depende de que todos los partidos de liga estén marcados como disputados.
- La clasificación del club del manager no condiciona la existencia del torneo.
- Si el club dirigido no participa, todos los partidos del Mundial se simulan entre equipos bots en sus fechas correspondientes.
- Las fechas de grupos continúan separadas por cinco días.
- La primera jornada se mantiene al menos 18 días después del sorteo y respeta el descanso posterior al último partido regular cuando corresponde.
- Las partidas que ya superaron el día 295 sin haber creado el torneo lo generan al abrir **Calendario → Mundial de Clubes** o al realizar el siguiente avance.
- La pantalla informa expresamente que el sorteo está programado para el día 295 cuando todavía no se alcanzó esa fecha.

### Causa corregida

La versión anterior exigía simultáneamente alcanzar el día 295 y que todos los encuentros regulares de todas las ligas estuvieran finalizados. Un partido pendiente podía impedir el sorteo completo, incluso cuando el usuario no participaba en la competición.

### Archivos principales modificados en V7.14

- `README.md`
- `index.html`
- `config.js`
- `data/habilidades_especiales.json`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`

### Compatibilidad de partidas

**V7.14 no rompe partidas anteriores.** Una partida situada después del día 295 y sin Mundial creado generará la edición pendiente automáticamente, conservando planteles, presupuestos, calendarios, resultados e historiales.

---


## V7.13 - Desbloqueo de cartas en 15 días

El plazo durante el cual una carta activa queda fija se redujo de **50 a 15 días de juego**.

### Funcionamiento

- Toda carta activada a partir de esta versión queda bloqueada durante 15 días.
- Al cumplirse el plazo puede retirarse o reemplazarse normalmente.
- La pantalla de Cartas muestra el plazo configurado de forma dinámica y ya no contiene el texto fijo `50 días`.
- Las cartas que ya estaban activas en una partida anterior ajustan automáticamente su vencimiento al nuevo máximo de 15 días.
- Si una carta ya permaneció activa durante 15 días o más, queda disponible al cargar la partida.
- El cambio no modifica la cantidad de usos, rareza, bonificaciones, inventario ni puntos de habilidad.

### Archivos principales modificados en V7.13

- `README.md`
- `index.html`
- `config.js`
- `data/habilidades_especiales.json`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/game/15-especial.js`

### Compatibilidad de partidas

**V7.13 no rompe partidas anteriores.** Conserva todas las cartas y reduce, sin extender, los bloqueos activos al nuevo máximo de 15 días.

---

## V7.12 - Códigos especiales alfanuméricos

Esta versión reemplaza los códigos descriptivos visibles por **10 códigos alfanuméricos individuales**.

### Distribución

- 2 códigos entregan **20 puntos de prestigio** cada uno.
- 8 códigos entregan **20.000 puntos de habilidad** cada uno.
- Cada código puede reclamarse una sola vez por partida guardada.
- Canjear un código en una partida no lo invalida en otras partidas.

### Protección de los códigos

Los textos reales de los códigos no están incluidos en `config.js` ni en el README distribuido con el juego. La configuración almacena únicamente una huella **SHA-256** de cada código.

Cuando el jugador escribe un código:

1. Se normaliza a mayúsculas.
2. Se calcula su huella SHA-256.
3. Se compara con las huellas autorizadas.
4. Se aplica el beneficio correspondiente.

Los códigos descriptivos de versiones anteriores dejan de aceptar nuevos canjes. Los beneficios ya reclamados se conservan.

### Archivos principales modificados en V7.12

- `README.md`
- `index.html`
- `config.js`
- `js/core/01-config-constants.js`
- `js/game/15-especial.js`

### Compatibilidad de partidas

**V7.12 no rompe partidas anteriores.** Conserva puntos, prestigio, cartas y códigos ya reclamados. Sólo cambia la lista de códigos aceptados para nuevos canjes.

---

# Fútbol Manager MVP - V7.11

## V7.11 - Ajustes visuales del capitán

Esta versión corrige la presentación del sistema de capitanía dentro de **Táctica** sin modificar su cálculo interno ni sus efectos después del partido.

### Tarjeta del capitán

- Se corrigió la alineación del círculo de **Forma**, incluso cuando el jugador acumula desgaste físico.
- Se eliminó de la interfaz la línea `Próximo partido estimado` y cualquier referencia al máximo posible.
- La tarjeta conserva foto, apellido, rol, media, forma, moral, rendimiento actual, partidos como capitán e impacto postpartido.
- El máximo individual continúa existiendo internamente para limitar el progreso, pero permanece oculto al usuario.

### Selector de capitán

Cada titular muestra únicamente su progreso actual:

```text
Apellido · Rol · Media 72 · Capitanía 34%
```

El selector ya no revela el máximo posible de ningún jugador.

### Insignias

- Se agregó una insignia circular **C** al capitán.
- La insignia aparece junto al icono de jugador ojeado.
- Cuando un jugador es capitán y además fue ojeado, ambos iconos permanecen visibles.
- Las insignias se muestran en la tarjeta del capitán, la pizarra y la lista de titulares.

### Archivos principales modificados en V7.11

- `README.md`
- `index.html`
- `style.css`
- `config.js`
- `balance-modificadores.js`
- `js/core/01-config-constants.js`
- `js/ui/07-render-team-market.js`

### Compatibilidad de partidas

**V7.11 no rompe partidas anteriores.** Es un ajuste de interfaz y versión. El capitán elegido, su progreso acumulado y los efectos de moral y cohesión se conservan sin cambios.

---

## V7.10 - Capitán, moral y cohesión

Esta versión parte de V7.09 e incorpora un sistema individual de capitanía dentro de **Táctica**. El jugador designado progresa únicamente cuando disputa un partido como capitán y, después del encuentro, modifica la moral del plantel y la cohesión del club.

### Selección del capitán

En **Táctica** se agregó una tarjeta de Capitán con:

- Selector limitado a los once titulares.
- Foto del jugador.
- Apellido.
- Rol o posición.
- Media visible.
- Forma física.
- Moral.
- Visor porcentual de rendimiento como capitán.
- Partidos disputados como capitán.
- Efecto actual sobre moral y cohesión.

El capitán aparece identificado con una insignia `C` en la tarjeta, la pizarra y la lista de titulares. Cuando también fue ojeado, la `C` se muestra junto al icono de ojo sin reemplazarlo.

Si el capitán queda fuera del once por lesión, suspensión, cambio de formación o modificación manual, el juego selecciona automáticamente otro titular válido. El usuario puede cambiarlo desde el selector antes de confirmar el equipo.

### Rendimiento como capitán

Cada jugador comienza en **0%** la primera vez que es utilizado como capitán por un club.

El porcentaje sube únicamente después de un partido en el que el jugador fue capitán titular. El ritmo está calculado para alcanzar su máximo personal aproximadamente en **8 a 12 partidos**, con una referencia central de 10 partidos.

El progreso queda guardado por jugador y club:

- Cambiar temporalmente de capitán no elimina el progreso anterior.
- Una lesión o suspensión no elimina el progreso.
- Cambiar de temporada no elimina el progreso.
- Cambiar de club como manager no elimina el progreso de los jugadores que permanecen en su club.
- Cuando el jugador abandona el club por venta, despido, retiro u otra transferencia, su progreso de capitanía en ese club se elimina.
- Si llega a otro club, comienza nuevamente en 0%.

### Cálculo del máximo posible

El máximo individual está limitado entre 1% y 99% y utiliza únicamente habilidades que ya existen en todos los jugadores de la base.

#### Habilidades utilizadas

| Habilidad existente | Peso |
|---|---:|
| Liderazgo | 35% |
| Serenidad | 20% |
| Disciplina | 15% |
| Trabajo en equipo | 15% |
| Posicionamiento | 10% |
| Resistencia | 5% |

No se crean atributos nuevos para calcular la capitanía. Se eliminaron `influencia en el vestuario`, `responsabilidad/profesionalismo` y `lealtad al club` porque no existen de forma general en la base de los 4.050 jugadores.

La fórmula es:

```text
Máximo de capitanía =
Liderazgo × 0,35
+ Serenidad × 0,20
+ Disciplina × 0,15
+ Trabajo en equipo × 0,15
+ Posicionamiento × 0,10
+ Resistencia × 0,05
```

### Velocidad de aprendizaje

La subida por partido utiliza:

| Habilidad existente | Peso en aprendizaje |
|---|---:|
| Liderazgo | 40% |
| Serenidad | 25% |
| Disciplina | 20% |
| Trabajo en equipo | 15% |

El resultado modifica la velocidad entre 80% y 120% del ritmo base. Un jugador con mejores valores en esas habilidades progresa más rápido, pero nunca puede superar su máximo personal.

### Efecto después del partido

El efecto se aplica después de las variaciones normales del encuentro y afecta a todos los jugadores que permanecen en el plantel y a la cohesión del club.

| Rendimiento del capitán | Moral del plantel | Cohesión |
|---:|---:|---:|
| 80% a 99% | +1 | +2 |
| 40% a 79% | 0 | +1 |
| 20% a 39% | -1 | 0 |
| 0% a 19% | -3 | -2 |

La moral continúa limitada entre 1 y 99. La cohesión continúa limitada entre 0 y 100.

El efecto se registra una sola vez por partido, incluso si se vuelve a cargar o procesar el mismo resultado.

### Guardado y migración

Las partidas nuevas incorporan:

```text
captaincyProgress
captaincyAppliedMatches
lastCaptaincyEffect
captainId dentro de la táctica
```

Las partidas anteriores reciben estas estructuras automáticamente. La táctica existente conserva sus titulares y el juego designa como capitán inicial al titular con mejor máximo estimado.

Las tácticas guardadas también conservan al capitán. Si ese jugador ya no está disponible al cargar la táctica, se elige otro titular válido.

### Configuración editable

Los valores principales se encuentran en `balance-modificadores.js` y `config.js`, dentro de:

```js
capitania: {
  activo: true,
  partidosObjetivoAprox: 10,
  maximoPorcentaje: 99,
  pesosMaximo: { ... },
  aprendizaje: { ... },
  efectos: [ ... ]
}
```

### Cloudflare y ranking online

No se modificó la API del ranking. No es necesario actualizar el Worker de Cloudflare.

### Archivos principales modificados en V7.10

- `README.md`
- `index.html`
- `style.css`
- `config.js`
- `balance-modificadores.js`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/11-match-engine.js`
- `js/ui/06-render-home-messages.js`
- `js/ui/07-render-team-market.js`
- `js/ui/12-modals.js`

### Compatibilidad de partidas

**V7.10 no rompe partidas anteriores.** Las partidas existentes reciben el nuevo sistema con progreso inicial de 0%. Se conservan planteles, tácticas, calendarios, presupuestos, títulos, estadísticas y todo el progreso previo.

---

## V7.09 - Historial anual del Mundial de Clubes

### Selector de año

En **Calendario → Mundial de Clubes** se agregó un selector de año para consultar la edición actual y cada edición anterior guardada.

Permite consultar:

- Campeón, subcampeón y tercer puesto.
- Tablas finales de los ocho grupos.
- Partidos y resultados de cada grupo.
- Octavos, cuartos, semifinales, tercer puesto y final.

### Fase de grupos

Los ocho grupos se muestran como ligas de cuatro equipos. Cada tabla incluye posición, equipo, partidos jugados, diferencia de gol y puntos. Los dos primeros aparecen destacados como clasificados.

### Cuadro eliminatorio

Debajo de los grupos se muestra un cuadro horizontal con octavos, cuartos, semifinales, final y partido por el tercer puesto.

### Historial guardado

Al finalizar cada edición se guarda una instantánea independiente con participantes, invitados, grupos, posiciones, partidos, cruces, fechas y podio final.

### Correcciones conservadas de V7.08

- Un club no clasificado no cobra premios del Mundial de Clubes.
- Las tres jornadas de grupos respetan sus fechas oficiales.
- Sólo se procesa una jornada pendiente de grupos por avance.
