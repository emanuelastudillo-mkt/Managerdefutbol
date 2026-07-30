# V9.20 · Cupos del Mundial por liga

Versión completa e incremental sin paquetes de imágenes, construida sobre V9.19.

## Cambios principales

- Se aplicó la distribución definitiva transitoria de 16 cupos domésticos: Argentina 2, Chile 1, Brasil 2, Inglaterra 4, España 3, Italia 3 y Rumania 1.
- El Mundial conserva 16 invitados seleccionados desde la bolsa de 20 clubes y un total de 32 participantes.
- Las posiciones clasificatorias de cada primera división se colorean de azul en la tabla.
- Cada liga muestra una referencia con la cantidad de cupos que entrega al Mundial de Clubes.
- La selección se realiza según la tabla vigente al momento del sorteo.

El incremental se aplica sobre V9.19.

---

# V9.19 · Invitados del Mundial y planteles bot

Versión completa e incremental sin paquetes de imágenes, construida sobre V9.18.

## Cambios principales

- Se agregaron 12 clubes bot especiales y la bolsa internacional pasó a 20 invitados.
- Cada Mundial selecciona 16 invitados y deja cuatro fuera de la edición.
- Los nuevos clubes tienen planteles de 25 jugadores con nacionalidades coherentes y calidad determinada por su prestigio.
- Los equipos no pertenecen a ninguna liga y solo se activan para el Mundial de Clubes.
- Los escudos se buscan por el nombre exacto con guiones medios en orden `.svg`, `.png`, `.webp`.
- Transitoriamente, los otros 16 lugares del torneo provienen de las ligas existentes; quedan preparados para ser sustituidos por 8 cupos de Champions y 8 de Libertadores.

El incremental se aplica sobre V9.18.

---

# V9.18 · Calendario con contexto deportivo y de mercado

## Tipo de entrega

Versión completa e incremental sin paquetes de imágenes, construida sobre V9.17.

## Cambios

- Cada día del calendario de Inicio adopta un tono visual según el compromiso principal: liga, copa nacional, copa internacional o amistoso.
- El Mundial de Clubes utiliza el tono de copa internacional.
- Los días sin partido conservan un tono neutro, con una variante sutil cuando el mercado está abierto.
- Los siete días indican si el mercado se encuentra abierto o cerrado para esa fecha.
- Las operaciones acordadas muestran su impacto en el día de ejecución: jugadores que se marchan y refuerzos que llegan.
- Los movimientos ya ejecutados se mantienen visibles en Ayer y Hoy mediante el historial de transferencias, evitando duplicados con las operaciones pendientes.

## Aplicación del incremental

El incremental se aplica sobre V9.17.

## Base consolidada

# V9.17 · Versión visible y altas médicas

## Tipo de entrega

Versión completa e incremental sin paquetes de imágenes, construida sobre V9.16.

## Cambios

- La versión visible del juego se actualizó de V9.12 a V9.17.
- `GAME_CONFIG.version` y la caché de recursos también utilizan V9.17.
- Los informes automáticos de tratamientos exitosos o fallidos dejaron de enviarse a la bandeja.
- El único mensaje médico persistente se genera cuando un jugador recibe el alta y vuelve a estar disponible.
- La misma regla se aplica al primer equipo y a los juveniles de la Academia.
- Los tratamientos manuales conservan una confirmación neutral, sin revelar el resultado clínico de cada intento.

## Aplicación del incremental

El incremental se aplica sobre V9.16.

## Base consolidada

# V9.16 · Informe físico y riesgo de lesión

## Tipo de entrega

Versión completa e incremental sin paquetes de imágenes, construida sobre V9.15.

## Nueva pestaña en Primer equipo

Se agregó **Informe físico** dentro de Primer equipo. La vista reúne en una sola tabla:

- Jugador.
- Media.
- Edad.
- Posición.
- Partidos jugados.
- Goles.
- Asistencias.
- Estado físico.
- Riesgo de lesión.

Todas las columnas principales permiten ordenar de forma ascendente o descendente desde su encabezado.

## Riesgo de lesión

El nuevo dato se presenta como una estimación textual:

- Muy bajo.
- Bajo.
- Normal.
- Alto.
- Muy alto.

La clasificación combina tres factores:

1. La genética interna del jugador.
2. Su estado físico actual.
3. La participación acumulada en la temporada.

No se muestra un porcentaje exacto ni se revela el valor numérico de genética. El informe funciona como referencia para planificar descansos, rotaciones y cargas de entrenamiento. Un jugador que ya está lesionado aparece dentro del nivel de riesgo más alto.

## Encabezados de producción ofensiva

En las tablas ordenables del plantel:

- La letra **G** fue reemplazada por un icono de pelota de fútbol.
- La letra **A** fue reemplazada por un icono de bota de fútbol.
- Ambos iconos conservan título, descripción accesible y controles de orden ascendente y descendente.

## Compatibilidad

- No modifica estadísticas, resultados, lesiones existentes ni la probabilidad real de lesión.
- No altera partidas guardadas.
- No agrega recursos gráficos externos.
- La estimación se calcula al abrir la pestaña y no introduce procesamiento diario adicional.

## Aplicación del incremental

El incremental se aplica sobre V9.15.

## Base consolidada

# V9.15 · Favicon desde la raíz

## Tipo de entrega

Versión completa e incremental sin paquetes de imágenes, construida sobre V9.14.

## Ajuste

- El favicon embebido fue retirado.
- El navegador ahora utiliza exclusivamente `favicon.png`, ubicado en el directorio raíz del juego.
- La misma ruta se declara como icono convencional, acceso directo, Apple Touch Icon y recurso del manifiesto web.
- Se actualizó la versión de caché de los recursos a V9.15 para forzar la renovación del icono en navegadores que conservan favicons anteriores.

## Archivo esperado

```text
/favicon.png
```

El PNG debe mantenerse en la misma carpeta que `index.html`. La entrega no vuelve a empaquetar el archivo gráfico porque corresponde a una versión sin imágenes.

## Compatibilidad

No modifica partidas, lógica, interfaz, guardados ni servicios online.

## Aplicación del incremental

El incremental se aplica sobre V9.14.

## Base consolidada

# V9.14 · Sanciones por competición

## Tipo de entrega

Versión completa e incremental sin paquetes de imágenes, construida sobre V9.13.

## Objetivo

Separar las sanciones deportivas según el torneo en el que se produjo la expulsión. Un jugador puede disputar otra clase de competición mientras conserva una fecha pendiente en la competición correspondiente.

## Ámbitos disciplinarios

- **Liga:** una expulsión en liga se cumple únicamente en el siguiente partido de liga del club.
- **Copa nacional:** una expulsión en copa nacional o supercopa se cumple únicamente en la siguiente copa nacional.
- **Copa internacional:** el Mundial de Clubes utiliza este ámbito y sus expulsiones se cumplen únicamente en partidos internacionales.
- **Amistosos:** no consumen ni generan sanciones oficiales.
- **Sanciones internas:** continúan afectando a cualquier partido mientras permanezcan activas.

## Funcionamiento

- Cada jugador guarda contadores independientes para liga, copa nacional y copa internacional.
- Antes de aplicar una nueva expulsión, el sistema descuenta las sanciones que se cumplieron en el partido recién disputado.
- Los partidos de otra categoría no reducen el contador pendiente.
- La selección de titulares, suplentes y planteles bots toma como referencia la competición del partido que se está preparando.
- Durante un amistoso se ignoran las sanciones oficiales, sin eliminarlas.
- La revisión táctica obligatoria por una expulsión sólo aparece cuando el próximo compromiso pertenece al mismo ámbito disciplinario.
- El sistema evita procesar dos veces la disciplina de un mismo partido.

## Compatibilidad de guardados

- Las sanciones globales creadas por versiones anteriores se migran automáticamente.
- La competición se infiere desde el último partido en el que el jugador fue expulsado.
- Si no existe información suficiente, la sanción antigua se asigna a liga, que era el comportamiento predominante del calendario anterior.
- Las sanciones internas existentes conservan su funcionamiento general.

## Aplicación del incremental

El incremental se aplica sobre V9.13.

## Base consolidada

# V9.13 · Procesamiento diario optimizado

## Tipo de entrega

Versión completa e incremental sin paquetes de imágenes, construida sobre V9.12.

## Objetivo

Reducir los bloqueos al avanzar días, evitar que las verificaciones pesadas se repitan en cada renderizado y distribuir el mantenimiento no crítico durante los momentos libres del navegador.

## Cola de segundo plano

- Se agregó una cola cooperativa basada en `requestIdleCallback`, con respaldo mediante `setTimeout` cuando el navegador no ofrece esa API.
- Las tareas se ejecutan de una en una y dejan una pausa entre bloques para devolver el control a la interfaz.
- Como máximo se programa un mantenimiento integral por fecha del juego; si coinciden varias revisiones vencidas, se reparten entre días sucesivos según su antigüedad.
- La cola descarta tareas pertenecientes a una partida que ya no está activa.
- Las modificaciones producidas por varias tareas se consolidan en un único autoguardado.
- Se incorporó el diagnóstico interno `getPerformanceDiagnostics()` para revisar tareas pendientes, duración reciente y fechas de mantenimiento.

## Procesamiento diario

- La auditoría completa del calendario dejó de ejecutarse dos veces en cada avance normal.
- Cada día se realiza un control rápido de fechas vencidas, fechas inválidas e identificadores duplicados.
- La auditoría estructural completa se ejecuta cuando el control rápido detecta una anomalía o, como mantenimiento preventivo, cada siete días en segundo plano.
- La reparación diaria y la comprobación posterior a una jornada revisan únicamente partidos recientes y cercanos al cursor actual.
- La revisión completa del historial de estadísticas queda programada cada siete días en segundo plano.
- Antes de simular se revisan solamente los planteles bots que tienen partido en la fecha correspondiente.
- La reparación general de todos los planteles bots se mantiene cada siete días y en los controles estructurales ya existentes.

## Renderizado e interfaz

- Cambiar de pestaña ya no dispara una reparación completa de planteles bots.
- La sincronización de jugadores referencia dejó de recorrer toda la base por cada nombre mostrado; ahora utiliza el índice de jugadores y validación individual constante.
- La revisión del Segundo entrenador y del Mundial de Clubes se trasladó al mantenimiento ocioso de cada fecha.
- El temporizador de Inicio mantiene la actualización por segundo únicamente durante un bloqueo de avance. Fuera del bloqueo revisa el botón cada cinco segundos.

## Contratos

- La normalización de contratos ya no recorre a todos los jugadores todos los días.
- Se guarda una firma por temporada y cantidad de jugadores para omitir revisiones idénticas.
- La normalización completa preventiva se ejecuta cada treinta días en segundo plano y continúa ejecutándose al cargar, crear jugadores o cambiar de temporada.

## Guardado local

- Los autoguardados consecutivos se agrupan durante 2,5 segundos.
- El guardado principal continúa actualizándose en cada escritura consolidada.
- La copia de seguridad completa se renueva cada cuatro autoguardados o inmediatamente cuando el guardado es manual o no existe una copia válida.
- Esto reduce escrituras duplicadas en IndexedDB sin eliminar el sistema de recuperación.

## Carga inicial

- Hitos, retos predeterminados y relatos de partido comienzan a cargarse en paralelo, pero ya no bloquean la primera pantalla.
- Se mantienen datos de respaldo hasta que esas bases auxiliares terminan de incorporarse.
- Se eliminó la solicitud fallida del antiguo `favicon.png`; el icono actual está embebido y no genera una petición adicional.

## Compatibilidad

Compatible con partidas V9.12. Las tareas que afectan el resultado de un día —entrenamiento, academia, economía, lesiones, partidos, contratos vencidos y eventos— continúan ejecutándose en orden antes de avanzar al día siguiente. Sólo se difirieron controles preventivos y sincronizaciones que no deben alterar el resultado inmediato.

## Aplicación del incremental

El incremental se aplica sobre V9.12.

## Base consolidada

# V9.12 · Bandeja, alertas y estadísticas vivas

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.11.

## Pantalla principal

- La previsualización del último mensaje fue retirada de Inicio.
- Se agregó un botón compacto con icono de sobre y contador de mensajes sin leer.
- Al pulsarlo se abre la bandeja completa.
- El bloque **Revisión obligatoria** ahora aparece debajo de las alertas y antes de **Tu ranking online**.

## Bandeja de mensajes

- Los mensajes sin leer se muestran primero y mantienen el resaltado visual.
- Los mensajes ya leídos se agrupan debajo.
- Abrir la bandeja ya no marca automáticamente todos los mensajes como leídos.
- Cada mensaje pendiente incorpora la acción **Marcar como leído**.

## Sponsors

- La alerta de sponsors disponibles abre directamente el submenú **Sponsors**.
- Ya no redirige a la pantalla principal de Estadio e instalaciones.

## Simulador vivo

- Posesión, intentos de ataque, tiros al arco, xG y faltas utilizan una única barra comparativa.
- La barra representa el 100% combinado de la estadística.
- Cada equipo ocupa una proporción equivalente a su participación: 20 contra 30 se presenta como 40% contra 60%.
- Los segmentos usan los colores principales de los clubes cuando están disponibles.

## Compatibilidad

Compatible con partidas anteriores. No modifica resultados, estadísticas calculadas, sponsors, mensajes guardados ni simulación; cambia la navegación y la presentación visual de esos datos.

## Aplicación del incremental

El incremental se aplica sobre V9.11.

## Base consolidada

# V9.11 · Calendario limpio y orden ascendente

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.10.

## Calendario semanal de Inicio

- Se eliminaron los textos visibles **Calendario de 7 días** y **Ayer · Hoy · Próximos 5 días**.
- Los siete recuadros permanecen en la parte superior de Inicio, sin modificar días, resultados ni compromisos mostrados.
- El bloque conserva una etiqueta accesible interna para lectores de pantalla.

## Mi calendario

- Los bloques de partidos del club se ordenan cronológicamente de forma ascendente.
- La vista comienza por las primeras jornadas de la temporada, como **Fecha 1**, y continúa hacia las fechas posteriores.
- Cuando existen partidos de copa u otras competiciones, se intercalan según su fecha programada real.
- El cambio se aplica únicamente a **Mi calendario**; no modifica el orden interno del fixture ni la simulación.

## Compatibilidad

Compatible con partidas anteriores. No modifica fechas, cruces, resultados, jornadas, cargas físicas ni guardados; únicamente cambia la presentación y el orden visual.

## Aplicación del incremental

El incremental se aplica sobre V9.10.

## Base consolidada

# V9.10 · Fechas de liga correctas en el calendario semanal

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.09.

## Corrección del calendario

- Los partidos de liga vuelven a mostrar la jornada real de la competición.
- El calendario semanal ya no utiliza la posición global del partido dentro del calendario combinado, que incluye fechas de copa y otros torneos.
- Un encuentro correspondiente a la fecha 14 se muestra como **Fecha 14**, y el siguiente como **Fecha 15**, aunque entre ambos existan partidos de copa.
- La corrección se aplica tanto a compromisos futuros como a resultados del día anterior.

## Otras competiciones

Las etiquetas de copa nacional, supercopa, playoffs, amistosos y Mundial de Clubes no fueron modificadas.

## Compatibilidad

Compatible con partidas anteriores. No modifica el fixture, las fechas programadas, los resultados ni el avance de temporada; únicamente corrige el número de jornada presentado en el calendario de Inicio.

## Aplicación del incremental

El incremental se aplica sobre V9.09.

## Base consolidada

# V9.09 · Calendario superior y avance compacto

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.08.

## Pantalla principal

- El calendario semanal de siete días se trasladó desde la parte inferior hasta el comienzo de la pantalla Inicio.
- Se eliminó el texto secundario **Planificación física** y se conserva el título **Calendario de 7 días**.
- El calendario mantiene ayer, hoy y los próximos cinco días, junto con resultados y compromisos futuros.

## Bloque Avanzar día

- La etiqueta **Días restantes** pasó a mostrarse como **Próximo compromiso en**.
- Se eliminó la segunda etiqueta **Próximo compromiso** para evitar información duplicada.
- Se retiró la línea descriptiva situada debajo de **Campo de juego**; permanecen el estado y la barra numérica del césped.

## Compatibilidad

Compatible con partidas anteriores. Los cambios son únicamente de presentación y no modifican calendarios, resultados, simulación, estado del campo, cargas físicas ni guardados.

## Aplicación del incremental

El incremental se aplica sobre V9.08.

## Base consolidada

# V9.08 · Calendario semanal en Inicio

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.07.

## Calendario de 7 días

- Se agregó un calendario compacto en la parte inferior de la pantalla principal.
- Muestra siete recuadros alineados: ayer, hoy y los próximos cinco días.
- Cada recuadro incluye el día de la semana y la fecha completa en formato ISO.
- El día actual queda destacado con el acento naranja de la interfaz.

## Partidos y competiciones

- Los días con partido muestran un icono de fútbol, el rival y la condición de local o visitante.
- Los partidos de liga indican el número de fecha y la división.
- Las copas nacionales muestran la fase correspondiente, como previa, 8vos, cuartos, semifinal o final.
- El Mundial de Clubes distingue fase de grupos, octavos, cuartos, semifinales, tercer puesto y final.
- También reconoce amistosos, supercopas y playoffs de promoción.
- Si el partido ya se disputó, el recuadro muestra el resultado desde la perspectiva del club dirigido, incluidos los penales cuando corresponda.
- Al pulsar un resultado se abre la ficha del partido. Al pulsar un compromiso futuro se abre el calendario completo.

## Objetivo visual

El bloque permite detectar rápidamente semanas con dos o más compromisos y organizar la condición física, los entrenamientos y la recuperación del plantel. Su ubicación inferior es provisoria hasta definir la composición final de Inicio.

## Compatibilidad

Compatible con partidas anteriores. No modifica fechas, simulación, resultados, cargas físicas, entrenamientos ni guardados; únicamente presenta la información existente en una vista semanal.

## Aplicación del incremental

El incremental se aplica sobre V9.07.

## Base consolidada

# V9.07 · Mensajes de cruces por país del mánager

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.06.

## Mensajes de copas nacionales

- Los avisos del sorteo y de cada nueva ronda de una copa nacional sólo se envían cuando la competición pertenece al país del club dirigido.
- Los cruces de copas extranjeras continúan generándose, simulándose y mostrándose en Competiciones, pero ya no llenan la bandeja de mensajes.
- El aviso de programación de una supercopa también se limita al país del club dirigido.
- Los anuncios de campeones nacionales se mantienen sin cambios.
- Si el mánager se encuentra sin club, no recibe actualizaciones de cruces nacionales hasta asumir un nuevo equipo.

## Mundial de Clubes

Los mensajes del Mundial de Clubes se mantienen sin cambios, incluidos el sorteo, las fases eliminatorias, la final, los premios y el campeón.

## Compatibilidad

Compatible con partidas anteriores. No modifica calendarios, resultados, títulos, economía ni guardados; únicamente filtra los nuevos avisos de cruces que se agregan a la bandeja del mánager.

## Aplicación del incremental

El incremental se aplica sobre V9.06.

## Base consolidada

# V9.06 · Interfaz oscura definitiva

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.05.

## Aplicación definitiva

- La estética presentada en V9.05 pasa a ser la interfaz predeterminada del juego.
- Se eliminó el botón **Nueva interfaz** y ya no se puede regresar a la presentación anterior desde la barra superior.
- Se conserva la misma información, navegación y funcionalidad de la versión anterior.

## Tema único

- Se eliminó el switch de modo claro y oscuro.
- El juego utiliza siempre el tema oscuro de grafito con acento naranja.
- Se dejaron de cargar el controlador del tema, la hoja del switch y la capa de contraste del modo claro.
- Una preferencia de tema guardada por versiones anteriores ya no modifica la apariencia.

## Compatibilidad

Compatible con partidas anteriores. No modifica guardados, economía, planteles, calendarios, simulación ni funciones online.

## Aplicación del incremental

El incremental se aplica sobre V9.05. Al sobrescribirlo, los archivos antiguos del selector de tema y de la vista previa pueden permanecer físicamente en la carpeta, pero ya no se cargan ni afectan el juego.

## Base consolidada

# V9.05 · Nueva interfaz en vista previa

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.04.

## Vista previa reversible

- Se agregó el botón **Nueva interfaz** en la barra superior.
- El botón activa y desactiva una capa visual independiente sin modificar la información, los datos ni la estructura funcional del juego.
- La nueva estética no se guarda en el navegador: cada recarga comienza con la interfaz actual.
- Al activar la vista previa, el mismo botón permite volver inmediatamente a la interfaz anterior.

## Nueva estética

- Marco general más compacto y continuo, con barra superior, menú lateral y área central visualmente conectados.
- Paleta oscura de grafito con acento naranja, inspirada en interfaces de gestión deportiva.
- Bordes finos, radios reducidos, paneles planos y jerarquías tipográficas más precisas.
- Navegación lateral con indicador naranja, botones rectangulares y estados activos más claros.
- Tablas, tarjetas, formularios, modales, métricas y partidos adaptados a la misma línea visual.
- Se incluyó una variante clara compatible con el selector de tema existente.
- La presentación se adapta a escritorio, notebooks y dispositivos móviles.

## Compatibilidad

Compatible con partidas anteriores. La modificación es exclusivamente visual y no altera guardados, economía, planteles, calendarios, simulación ni funciones online.

## Base consolidada

# V9.04 · Resumen diario compacto

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.03.

## Interfaz

- El bloque “Resumen del último avance” dejó de mostrarse como una tarjeta grande.
- La información ahora ocupa una franja discreta de una o dos líneas en escritorio.
- Título, fecha, fase, calendario y próximo compromiso utilizan tipografía pequeña y de jerarquía casi uniforme.
- En móvil, los detalles se acomodan en líneas compactas sin generar desbordes.
- Se mantienen los datos del avance para poder verificar el calendario sin ocupar espacio central.

## Compatibilidad

Compatible con partidas anteriores. El cambio es exclusivamente visual y no modifica el guardado ni la simulación.

## Base consolidada

# V9.03 · Corrección integral de contraste del modo claro

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.02.

## Interfaz

- Se corrigieron textos blancos o grises demasiado claros sobre paneles claros.
- Se reforzó la jerarquía entre texto principal, secundario, enlaces y estados positivos, de advertencia o error.
- Se adaptaron inicio, mensajes, mercado, academia, empleados, finanzas, estadio, partidos, competiciones, cursos, filosofía, vestuario, perfiles, ranking FIFA y registro de transferencias.
- Las superficies históricas con fondos oscuros se convierten a fondos claros cuando corresponde.
- Canchas, camisetas, cartas especiales y botones con fondos sólidos conservan texto blanco para mantener contraste.
- El modo oscuro no fue modificado.

## Compatibilidad

Compatible con partidas anteriores. El cambio es exclusivamente visual y la preferencia de tema continúa guardándose en el navegador.

## Base consolidada

# V9.02 · Subidas automáticas de carrera

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.01.

## Ranking online

- La carrera del mánager se intenta subir automáticamente en los días 150, 250 y 350 de cada temporada.
- Cada hito se ejecuta una sola vez cuando el envío se completa.
- Si falta iniciar sesión o hay un problema de conexión, el hito queda pendiente y se reintenta en un avance posterior.
- Al cargar una partida que ya superó una fecha programada, se publica únicamente el hito más reciente pendiente para evitar tres envíos consecutivos.
- Las actualizaciones utilizan el mismo registro de carrera, por lo que no crean managers duplicados.
- Se mantienen las subidas automáticas existentes al finalizar la temporada y ante un despido.

## Interfaz

La pantalla Ranking muestra el estado de las cargas programadas de los días 150, 250 y 350.

## Compatibilidad

Compatible con partidas anteriores. El nuevo estado de programación se crea automáticamente al cargar una carrera de V9.01.

## Base consolidada

# V9.01 · Modo claro y oscuro

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V9.00.

## Interfaz

- Se agregó un switch en la barra superior para alternar entre modo claro y modo oscuro.
- El modo oscuro continúa siendo el valor inicial para conservar la estética existente.
- La elección se guarda en el navegador y se aplica antes de mostrar la interfaz para evitar destellos de color.
- El selector actualiza el color de la interfaz del navegador y expone su estado a lectores de pantalla.
- La capa clara adapta paneles, tablas, formularios, modales, navegación y vista móvil.

## Compatibilidad

Compatible con partidas anteriores. El tema visual no se incorpora al archivo de guardado ni altera lógica, economía o simulación.

## Base consolidada

# V9.00 · Mercado de élite para clubes bots

## Tipo de entrega

Versión completa e incremental sin imágenes, construida sobre V8.99.

## Nuevas funciones

### Estrellas libres

- Los clubes de prestigio 80 o superior revisan las estrellas libres cada tres días.
- Los equipos del Top 10 del ranking FIFA tienen prioridad cuando todavía no alcanzaron su objetivo.
- Sólo se consideran jugadores de media 85 o superior y hasta 34 años.
- Los libres pueden firmar fuera de las ventanas profesionales.

### Objetivo del Top 10

- Los diez mejores clubes del ranking FIFA intentan sostener al menos siete jugadores de media 85+.
- Si no hay libres adecuados, buscan compras entre clubes durante las ventanas de transferencias.
- Se realizan como máximo dos compras por revisión y una incorporación por club en cada revisión.
- El club controlado por el mánager nunca compra automáticamente.

### Protección financiera

- Cada operación conserva como mínimo el 42% de la caja previa.
- La caja restante también debe cubrir al menos el 80% de la masa salarial anual resultante.
- Un fichaje pago no puede superar el 24% de la caja del comprador.
- Los clubes no superan seis incorporaciones de élite por temporada mediante este sistema.
- Si las condiciones económicas no se cumplen, el fichaje no se realiza aunque el equipo esté debajo del objetivo.

### Integración

- Todos los movimientos aparecen en el registro anual de transferencias.
- Los fichajes actualizan presupuestos, contratos, cláusulas, estadísticas y pertenencia del jugador.
- Los clubes vendedores reciben el importe neto luego del impuesto de transferencia.

## Compatibilidad

Compatible con partidas anteriores. El nuevo estado se crea automáticamente al cargar una carrera de V8.99.

## Base consolidada

# V8.99 · Registro anual de transferencias

## Aplicación

Aplicar sobre **V8.98**.

## Mercado

La pestaña Mercado incorpora la sección **Registro anual**, con todos los movimientos profesionales registrados durante cada temporada.

Cada operación conserva:

- Nombre del jugador.
- Media al momento del movimiento.
- Importe pagado o indicación de pase libre.
- Estado anterior: agente libre o club de origen.
- Destino: agente libre o club comprador.
- Fecha, temporada y tipo de movimiento.

Se registran compras, ventas, contrataciones libres, despidos, contratos vencidos y movimientos simulados entre clubes controlados por el juego.

## Retirados

Cuando un jugador se retira, todas sus entradas se eliminan del registro. Esta limpieza también se aplica al cargar partidas antiguas mediante la lista de retirados, evitando conservar movimientos de jugadores que ya no existen en la base activa.

## Compatibilidad

Compatible con partidas anteriores. Las partidas V8.98 comienzan con el registro vacío y documentan las operaciones realizadas a partir de V8.99.

## Base V8.98

# V8.98 · Ficha de club horizontal

## Aplicación

Aplicar sobre **V8.97**.

## Interfaz

- La ficha de club utiliza una disposición horizontal en pantallas de escritorio.
- El resumen institucional y económico queda en la parte superior.
- La táctica y el informe de ojeo ocupan una columna lateral compacta.
- La plantilla observada utiliza el área principal y mantiene encabezados visibles durante el desplazamiento.
- En dispositivos pequeños la ficha vuelve automáticamente a una disposición vertical.

## Dinero compacto

Los importes de la ficha se muestran abreviados para reducir espacio:

- `M` representa millones.
- `mil` representa miles.
- El importe completo continúa disponible al mantener el cursor sobre el valor.

## Compatibilidad

Compatible con partidas anteriores. No modifica datos, economía, planteles, resultados ni guardados.

## Base V8.97

# V8.97 · Ranking FIFA de clubes

## Aplicación

Aplicar sobre **V8.96**.

## Nueva función

La pestaña Competiciones incorpora un ranking mundial interno de clubes con puntajes entre 1 y 1500. Combina reputación del club y de su liga, victorias recientes y títulos oficiales. Las victorias y el título del Mundial de Clubes tienen el valor más alto.

## Historial

Al finalizar cada temporada se guarda una fotografía del ranking para mostrar subidas y bajadas. Las partidas antiguas reconstruyen ligas y títulos desde sus historiales disponibles y comienzan a conservar las victorias de copa desde V8.97.

## Compatibilidad

Compatible con partidas anteriores. No modifica resultados, economía, planteles ni clasificación a competiciones.

## Base V8.96

# V8.96 · Jerarquía, disciplina y estrellas difíciles

## Aplicación

Aplicar sobre **V8.95**. También se incluye una versión completa sin imágenes.

## Nuevo sistema

Los jugadores pueden generar conflictos especiales cuando combinan una o más fuentes de poder interno con disciplina baja:

- Media absoluta alta.
- Diferencia importante de media respecto del resto del plantel.
- Sueldo anual superior o cercano al sueldo anual del mánager.
- Influencia dentro del vestuario.

La disciplina funciona como filtro principal: una figura profesional y disciplinada no se vuelve problemática únicamente por ser buena o cobrar mucho.

## Autoridad del mánager

Las respuestas firmes no tienen éxito automático. La posibilidad de imponerse depende de:

- Liderazgo y prestigio del mánager.
- Confianza general del vestuario.
- Diferencia salarial con la figura.
- Media, influencia, disciplina y riesgo interno del jugador.

## Eventos incorporados

- Accidente con un Ferrari y lesión extradeportiva.
- Fiesta y pérdida de forma física un día antes de un partido.
- Exigencia de titularidad.
- Exigencia de capitanía.
- Crítica pública al mánager después de una derrota.

## Interfaz

La pestaña Vestuario muestra los jugadores propensos, el principal riesgo interno, el sueldo del mánager y los incidentes de la temporada. La ficha individual muestra disciplina, diferencia de media, relación salarial y riesgo de conflicto.

## Compatibilidad

Compatible con partidas anteriores. El estado nuevo se crea automáticamente al cargar una carrera de V8.95 o anterior.

## Base anterior

# V8.95 · Copa Italia y Supercopa de Italia

## Aplicación

La versión incremental se aplica sobre **V8.94**. La versión completa incluye todo el juego y excluye las imágenes.

## Copa Italia

Italia incorpora el mismo sistema de copa nacional utilizado por España e Inglaterra:

- Participan los 18 clubes de la Serie A Italia.
- Los 14 mejores clasificados avanzan directamente a octavos de final.
- Los otros 4 clubes disputan una fase previa de dos partidos.
- Todos los cruces son a eliminación directa y en sede neutral.
- Los empates se definen por penales.
- El ganador recibe la recaudación del partido.
- El campeón queda registrado como ganador de la **Copa Italia** y como título oficial del mánager cuando corresponda.

## Calendario

- Sorteo: día 26 de la temporada.
- Fase previa: primer miércoles de mayo.
- Octavos: primer miércoles de junio.
- Cuartos: primer miércoles de agosto.
- Semifinales: primer miércoles de septiembre.
- Final: primer miércoles de octubre.

## Supercopa de Italia

- Se disputa el día 300.
- Enfrenta al campeón de la Serie A Italia con el campeón de la Copa Italia.
- Si un mismo club gana ambas competiciones, participa el segundo de la liga.
- Se juega a partido único, en el estadio de mayor capacidad de Italia.
- En caso de empate se define por penales.
- El ganador recibe la recaudación y registra un título oficial de valor menor.

## Compatibilidad

Compatible con partidas de V8.94 y anteriores. En partidas que ya hayan superado la fecha de la primera ronda, la Copa Italia comenzará en la temporada siguiente para evitar alterar calendarios ya avanzados.

