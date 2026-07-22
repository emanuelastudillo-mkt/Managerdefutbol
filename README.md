# Chill mánager - Futbol online — V8.21

## V8.21 — Problemas de vestuario por moral y cohesión bajas

- Se agregó una crisis de vestuario que comienza cuando la moral media del plantel y la cohesión del equipo están ambas por debajo de 60.
- Una vez iniciada, se realiza un control cada 5 días de juego.
- Cada control tiene 30% de probabilidad de activar uno de 20 problemas de vestuario.
- La crisis continúa hasta que moral y cohesión vuelven simultáneamente a 60 o más.
- Los controles sin evento son silenciosos.
- Los últimos 5 problemas se evitan al elegir el siguiente, siempre que existan alternativas.
- Los participantes se eligen entre jugadores actuales del primer equipo y se adaptan al contexto: capitán, suplentes, veteranos, juveniles, porteros, defensores o competidores por un mismo puesto.
- Los mensajes muestran nombres reales y consecuencias narrativas, sin exponer cálculos internos de probabilidad, moral o cohesión.
- Tres eventos pueden causar lesiones de entrenamiento. La pelea principal lesiona a dos jugadores con contusiones independientes de 10 a 20 días.
- Las lesiones actualizan estadísticas, disponibilidad y táctica, y obligan a revisar la convocatoria cuando corresponde.
- La secuencia queda guardada dentro de cada partida para impedir repeticiones por recarga.
- El sistema funciona durante temporada regular, pretemporada y postemporada.
- No requiere cambios de Worker ni SQL.

### Compatibilidad

**V8.21 no rompe partidas anteriores.** Las partidas existentes crean el estado de crisis sólo cuando sea necesario. No se modifican resultados, contratos, jugadores, calendarios ni los cinco slots.


# Chill mánager - Futbol online — V8.20

## V8.20 — Identidad final y optimización SEO

- La marca visible pasa a ser **Chill mánager - Futbol online**.
- El título HTML combina la marca con la búsqueda principal: juego de manager de fútbol.
- Se agregó una meta description específica, directivas de indexación, color de tema y metadatos de aplicación.
- Se incorporaron etiquetas Open Graph y Twitter Card para mejorar la presentación al compartir la web.
- Se agregó JSON-LD con los tipos `WebSite` y `VideoGame`.
- El idioma de la página se especifica como español de Argentina (`es-AR`).
- La pantalla inicial incluye contenido visible que explica carrera, tácticas, mercado, juveniles, ranking y desafíos online.
- Se agregó contenido alternativo para navegadores sin JavaScript.
- Se incorporaron `robots.txt` y `manifest.webmanifest`.
- No se agregó un sitemap ni una imagen social porque todavía no existe un dominio y una portada pública definitivos.
- Las claves internas de IndexedDB y guardado continúan usando los identificadores históricos para no perder partidas.
- No requiere cambios de Worker ni SQL.

### Pendientes de publicación final

- Definir el dominio o URL pública definitiva.
- Crear el sitemap con URLs absolutas y registrarlo en `robots.txt`.
- Agregar una portada social pública mediante `og:image` y `twitter:image`.
- Verificar el sitio en Google Search Console y enviar el sitemap.

### Compatibilidad

**V8.20 no rompe partidas anteriores.** El cambio modifica identidad, metadatos y contenido inicial, pero conserva los IDs, la base IndexedDB, las claves de guardado, los jugadores, resultados y los cinco slots.


# Fútbol Manager MVP - V8.19

## V8.19 — Penalización de goles reforzada

- Todos los goles potenciales reciben una reducción base del **10%**, desde el primero hasta el quinto gol total del partido.
- El sexto gol recibe 40% de penalización; el séptimo 50%; el octavo 60%; el noveno 70%; el décimo 80%; el undécimo 90%; y desde el duodécimo, 95%.
- La escala se calcula sobre el próximo gol potencial según la suma del marcador de ambos equipos.
- Se aplica de forma uniforme al simulador completo, partido en vivo, simulaciones rápidas de bots, Mundial de Clubes y Desafíos Online.
- La penalización sólo afecta la conversión de goles; no reduce ocasiones, posesión, tarjetas, lesiones ni modifica resultados ya guardados.
- No requiere cambios de Worker ni SQL.

### Compatibilidad

**V8.19 no rompe partidas anteriores.** La nueva escala se utiliza únicamente en partidos futuros; no recalcula resultados existentes ni modifica jugadores, calendarios, contratos, guardados o los cinco slots.


## V8.18 — Verificador de estructura programado

- El Verificador de estructura se ejecuta automáticamente en los días **1, 31, 151, 179, 295 y 355** de cada temporada.
- El día 1 se controla al crear una carrera y al comenzar cada temporada nueva.
- Los demás controles se ejecutan después de completar las acciones automáticas del día y antes del guardado final.
- Cada control queda marcado por temporada y día para impedir que recargar o volver a abrir la partida lo repita.
- Si el calendario salta sobre uno de los días programados, el control pendiente se ejecuta en el siguiente avance.
- Las reparaciones seguras se aplican automáticamente: estructura de divisiones, calendarios no disputados, estadísticas mínimas de partidos bots y planteles bots insuficientes.
- Si no se detectan problemas, el control es completamente silencioso.
- Si se aplica alguna corrección, se muestra un aviso breve.
- Los problemas que requieren revisión manual generan un mensaje prioritario y conservan el acceso al Verificador manual.
- El botón manual del Verificador continúa disponible sin cambios.
- No requiere cambios de Worker ni SQL.

### Compatibilidad

**V8.18 no rompe partidas anteriores.** Los controles programados se incorporan al estado actual y no reconstruyen partidos disputados ni eliminan resultados. Se conservan los cinco slots, jugadores, contratos, temporadas y progreso.

## V8.17 — Apellidos ampliados x10 y migración de partidas

- Los bancos efectivos de apellidos pasan de 3.150 a **31.500 variantes únicas**.
- Argentina dispone de 1.800 apellidos; cada una de las otras 33 nacionalidades dispone de 900.
- La ampliación utiliza apellidos simples y combinaciones familiares deterministas, siempre en escritura latina compatible con español.
- Los jugadores nuevos de planteles, mercado, Academia, refuerzos bots y regeneraciones utilizan inmediatamente los bancos ampliados.
- Las partidas existentes reciben una migración única: conserva nombre de pila, ID, club, edad, habilidades, contratos, estadísticas y progreso, y reemplaza únicamente el apellido.
- Los jugadores manuales y Leyendas conservan íntegramente su nombre específico.
- La cartera de promocionados, ofertas juveniles y transferencias pendientes actualizan las referencias visibles al nuevo nombre.
- La migración queda marcada dentro del guardado para no repetirse.
- No requiere cambios de Worker ni SQL.

### Compatibilidad

**V8.17 no rompe partidas anteriores.** Actualiza una sola vez los apellidos de los jugadores generados, sin cambiar sus identificadores ni ninguna relación interna. Los cinco slots se conservan.

## V8.15 — Frontend compacto para 1280 × 720

- Se eliminó de Estadio e instalaciones el Petitorio a la Federación Argentina y su botón manual.
- La reparación automática de estados inválidos de campos rivales continúa funcionando como control interno de integridad.
- Se agregó una hoja de estilos final específica para notebooks y pantallas de hasta 1280 × 720.
- La barra superior reduce tamaños y espacios para evitar superposición de acciones.
- El aviso flotante se desplaza debajo de la barra superior en resoluciones compactas.
- El menú lateral utiliza desplazamiento propio cuando supera la altura disponible, permitiendo acceder siempre a todas las secciones.
- Se redujeron márgenes, rellenos, alturas mínimas, controles y tarjetas sin modificar la jerarquía visual.
- Tablas, subpestañas, formularios y modales utilizan medidas más compactas y conservan desplazamiento interno cuando corresponde.
- Táctica, entrenamiento, ojeo, Mundial de Clubes, Desafíos Online y partido en vivo reciben ajustes intermedios para evitar columnas comprimidas o desbordes.
- La presentación de escritorio amplio y el diseño móvil existente se mantienen separados del nuevo modo compacto.
- No requiere cambios de Worker ni SQL.

### Compatibilidad

**V8.15 no rompe partidas anteriores.** El cambio es visual y elimina una acción manual de mantenimiento; no modifica guardados, jugadores, clubes, temporadas, contratos, resultados ni los cinco slots.


## V8.14 — Control de marcadores altos y mensajes deportivos

- Se eliminó de los mensajes visibles la explicación de que una figura del plantel adquiere mayor peso dentro del simulador.
- Las solicitudes laborales rechazadas ya no muestran probabilidades, márgenes ni decisiones internas del sistema.
- Todos los motores reducen progresivamente la posibilidad de convertir nuevas ocasiones cuando el partido supera cinco goles totales.
- Hasta cinco goles entre ambos equipos no existe penalización.
- El sexto gol recibe 20% de penalización; el séptimo 30%; el octavo 40%; el noveno 50%; el décimo 60%; el undécimo 70%; y desde el duodécimo, 80%.
- La regla se aplica al simulador completo, partido en vivo, simulación rápida de bots y Desafíos Online.
- La penalización actúa únicamente sobre goles adicionales: no modifica ocasiones, posesión, tarjetas, lesiones ni resultados por cinco expulsiones.
- No requiere cambios de Worker ni SQL.

### Compatibilidad

**V8.14 no rompe partidas anteriores.** Sólo modifica partidos futuros y textos visibles; no altera resultados ya guardados, planteles, contratos, calendarios ni los cinco slots.



## V8.13 — Mejoras de Carrera y Experto en juveniles

- Se agregó **Carrera → Mejoras** como pestaña independiente.
- El Predio de entrenamiento juvenil y la administración de residencias fueron trasladados desde Tu Academia a Mejoras.
- Tu Academia concentra ahora el Preparador de juveniles y presenta como acciones principales **Hacer captación de talentos** y **Consultar juveniles**.
- Se agregaron cinco cartas **Experto en juveniles**: +1, +2, +3, +4 y +7 habilidades visibles por consulta.
- El bonus se suma después de calcular el resultado normal del Preparador y puede apilarse entre cartas activas.
- La consulta informa por separado el resultado normal y el aporte de las cartas.
- No se modificaron calidad, crecimiento, captaciones, costos, cupos ni datos existentes de los juveniles.
- No requiere cambios de Worker ni SQL.

### Compatibilidad

**V8.13 no rompe partidas anteriores.** Predio, residencias, empleados, juveniles, cartas obtenidas y progreso conservan sus datos; sólo cambia su ubicación en la interfaz y se amplía el catálogo de cartas.


## V8.12 — Emparejamientos online anónimos

- En **Disponibles** ya no se muestran el club, manager, escudo, plantel, sueldo, fecha ni identificador del desafío publicado.
- Cada categoría sólo informa que existe al menos un rival disponible.
- Al aceptar, el Worker selecciona al azar uno de los desafíos abiertos de la misma categoría, excluyendo los publicados por el propio usuario.
- La identidad y el equipo rival se revelan únicamente después de que el servidor reserva el cruce.
- La aceptación directa de un ID anterior también se redirige al sorteo aleatorio, evitando elegir manualmente un rival.
- No requiere cambios de SQL ni nuevas tablas. Sí requiere reemplazar el Worker por la versión completa V8.12 entregada junto al juego.
- Los desafíos propios, partidos disputados y rankings continúan mostrando los equipos normalmente.

### Compatibilidad

**V8.12 no rompe partidas anteriores.** Los desafíos abiertos existentes pasan automáticamente a los grupos anónimos de su categoría. No se modifica el esquema local ni D1.


## V8.11 - Ciclos y premios de Competencias Online

### Temporadas globales de 10 días

Las clasificaciones salariales online funcionan ahora por ciclos globales de **10 días reales**, iguales para todos los managers. El primer ciclo comienza el **19 de julio de 2026 a las 00:00 UTC**.

Cada partido terminado se asigna al ciclo correspondiente según la fecha registrada por el Worker. Al comenzar un ciclo nuevo, la tabla visible vuelve a cero; los partidos anteriores permanecen en el historial.

Para clasificarse oficialmente y recibir premios se requieren:

- al menos **10 partidos** dentro del ciclo;
- al menos **5 rivales diferentes**;
- no existe un máximo de encuentros.

### Premios

| Categorías | Campeón | Segundo | Tercero |
|---|---:|---:|---:|
| Ascenso, Nacional, Profesional, Continental y Élite | 3.000 | 1.500 | 750 |
| Libre | 6.000 | 2.500 | 1.000 |

Los premios se acreditan como puntos de habilidad del perfil global del manager. No pertenecen a un club o slot específico.

La primera victoria contra un rival conserva el mayor valor. Repetir triunfos contra el mismo manager reduce progresivamente la recompensa; vencer a un rival con muchas derrotas vale menos, y ganar desde una posición inferior aumenta el puntaje.

### Reclamo seguro

El Worker recalcula y congela la clasificación de cada ciclo cerrado. Los resultados congelados se guardan en `fm_meta_v2`, de modo que cambios posteriores en el historial no alteran campeones ya definidos.

Los reclamos se registran en `fm_online_reward_claims_v1` con una clave única por usuario, ciclo y categoría. El cliente sólo acredita puntos cuando el Worker confirma que el reclamo es nuevo.

El paquete separado `worker-V8.11-premios-competencias-online.zip` contiene:

- la migración D1;
- el parche para el Worker actual;
- las instrucciones de instalación y verificación.

Sin actualizar el Worker, las clasificaciones siguen visibles, pero el juego no permite acreditar premios.

### Compatibilidad

**V8.11 no rompe partidas anteriores.** No cambia el esquema de guardado local, los cinco slots, planteles, contratos ni progreso. Los partidos online anteriores al 19 de julio de 2026 continúan en el historial, pero no pertenecen a un ciclo premiado.


## V8.10 - Categoría Online visible en Táctica

### Resumen competitivo de la convocatoria

La pantalla **Táctica y convocatoria** incorpora un apartado compacto dentro del panel de Acciones que informa en tiempo real:

- la categoría salarial natural del equipo armado: Ascenso, Nacional, Profesional, Continental, Élite o Libre;
- el logo correspondiente A, N, P, C, E o L;
- la suma actual de sueldos mensuales de titulares y suplentes;
- la cantidad de titulares y suplentes incluidos en la convocatoria online;
- el rango salarial de la categoría.

El cálculo utiliza exactamente la misma composición que Desafíos Online: hasta 11 titulares y 10 suplentes, sin contar reservas. Cada cambio de formación, selección automática o movimiento de jugadores actualiza el apartado al volver a renderizar Táctica.

Si faltan titulares, el bloque indica que la convocatoria está incompleta. Cuando existen 11 titulares válidos, también recuerda que el equipo puede publicarse en su categoría natural o en Libre.

No se modificaron categorías, rangos salariales, puntajes, SQL, D1 ni Worker.

### Compatibilidad

**V8.10 no rompe partidas anteriores.** El cambio es exclusivamente visual y de cálculo en la pantalla Táctica. No modifica guardados, planteles, contratos, desafíos existentes ni los cinco slots.


## V8.09 - Competencias Online por categorías salariales

### Categorías

Los Desafíos Online pasan a organizarse en seis competencias independientes según el sueldo mensual total de la convocatoria publicada:

| Logo | Categoría | Rango salarial |
|---|---|---:|
| A | Ascenso | Hasta `$5.000.000` |
| N | Nacional | `$5.000.001` a `$10.000.000` |
| P | Profesional | `$10.000.001` a `$20.000.000` |
| C | Continental | `$20.000.001` a `$45.000.000` |
| E | Élite | `$45.000.001` a `$100.000.000` |
| L | Libre | Sin límite |

No existen restricciones por estrellas ni un máximo salarial individual. La categoría se determina exclusivamente por la suma de sueldos de titulares y suplentes incluidos en el snapshot.

### Publicar un desafío

Al pulsar **Publicar desafío**, el juego permite elegir entre:

- la categoría salarial natural del equipo actual;
- Libre.

Si la convocatoria supera `$100.000.000`, su única opción es Libre.

El snapshot incorpora la categoría dentro del JSON que ya utiliza el sistema. No se agregaron tablas, columnas, rutas ni migraciones para SQL o Worker.

### Aceptar un desafío

- Ascenso, Nacional, Profesional, Continental y Élite sólo pueden ser aceptadas por una convocatoria del mismo rango.
- Libre puede ser aceptada por cualquier equipo.
- La categoría se valida antes de reservar el desafío y nuevamente antes de ejecutar el simulador.
- Los desafíos anteriores a V8.09, que no poseen categoría guardada, se consideran Libre.

### Ranking y campeones

Cada categoría dispone de su ranking independiente:

- Campeón de Ascenso.
- Campeón de Nacional.
- Campeón de Profesional.
- Campeón de Continental.
- Campeón de Élite.
- Campeón de Libre.

No existe un máximo de partidos. Se requieren **10 partidos** en la categoría para abandonar el estado provisional, obtener posición oficial y poder ser campeón.

### Puntaje dinámico

- Victoria base: 100 puntos.
- Empate base: 30 puntos.
- Derrota: 0 puntos.
- La primera victoria contra cada rival vale más.
- Repetir triunfos contra el mismo manager reduce progresivamente el premio.
- Vencer a un equipo que acumula derrotas entrega cada vez menos puntos.
- Vencer a un rival con buenos resultados aumenta el premio.
- Ganar estando más abajo en la tabla incrementa los puntos.
- Ganar siendo uno de los líderes los reduce.

El cálculo se realiza cronológicamente desde el historial existente. La pantalla muestra partidos, resultados, rivales diferentes vencidos, mejor triunfo y puntos acumulados.

### Interfaz

- Se incorporaron los logos A, N, P, C, E y L.
- Disponibles puede filtrarse por categoría.
- Cada tarjeta informa la competencia a la que pertenece.
- Ranking permite cambiar entre las seis tablas.
- El líder clasificado aparece como campeón de su categoría.

### Archivos principales modificados

- `config.js`
- `index.html`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/18-challenges-online.js`
- `js/ui/12-modals.js`
- `js/ui/19-manager-courses.js`
- `styles/60-manager-competitions-online.css`
- `balance-modificadores.js`
- `README.md`
- `AUDITORIA-CATEGORIAS-ONLINE-V8.09.md`

### Compatibilidad

**V8.09 no rompe partidas anteriores.** No modifica guardados, planteles, contratos, cinco slots, SQL ni Worker. Los desafíos y partidos anteriores continúan disponibles dentro de Libre.

## V8.08 - Refactorización profunda de configuración, módulos y estilos

### Configuración centralizada

- `config.js` pasa a ser la única fuente de valores base del juego.
- Los 12 valores que sólo estaban definidos en `balance-modificadores.js` se trasladaron a la configuración principal.
- Se eliminaron 92 sobrescrituras redundantes que repetían exactamente los valores base.
- `balance-modificadores.js` queda como una capa opcional vacía, destinada únicamente a diferencias intencionales.
- Se agregó una auditoría automática que detecta rutas inexistentes, números inválidos, valores redundantes y una misma ruta modificada por más de una fuente.
- El orden de carga queda fijado: primero `config.js` y después cualquier capa opcional de balance.

### División del estado y la temporada

El antiguo `js/game/05-state-season.js` se separó por responsabilidades, manteniendo el mismo orden de ejecución:

- `05b-manager-challenges.js`: retos y desafíos del manager.
- `05c-manager-job-market.js`: mercado laboral y cambios de club.
- `05d-founder-career.js`: fundación de club y continuidad de carrera.
- `05e-integrity-navigation-saves.js`: integridad, navegación y guardados.
- `05-state-season.js`: núcleo de estado y temporada.
- `05f-club-world-cup.js`: Mundial de Clubes.
- `05g-season-lifecycle.js`: cierre, transición e inicio de temporada.

La reconstrucción concatenada conserva el código funcional anterior; las únicas adiciones son encabezados descriptivos de cada módulo y la actualización de versión.

### División de simulación, economía y entrenamiento

El antiguo módulo monolítico `09-simulation-economy-training.js` se reemplazó por:

- `09a-team-cohesion-summary.js`: cohesión y resúmenes.
- `09b-calendar-quick-simulation.js`: calendario y simulación rápida.
- `09c-economy-finance.js`: economía y finanzas.
- `09d-stadium-condition-morale.js`: estadio, condición y moral.
- `09e-training.js`: entrenamiento.

El archivo anterior se conserva únicamente como referencia de compatibilidad y ya no se carga desde `index.html`.

### CSS modular

- `style.css` se convirtió en un manifiesto de compatibilidad y dejó de contener el bloque monolítico.
- Los estilos activos se separaron en ocho archivos dentro de `styles/`.
- Se eliminaron 19 reglas exactamente duplicadas y sin efecto adicional.
- Se conservaron las redefiniciones históricas necesarias para responsive y especificidad.
- `90-cascade-compat.css` mantiene siete cruces de cascada cuya prioridad dependía del orden anterior.

### Validación

- Se compararon 24 pantallas y modales representativos, además de la simulación viva y el cierre de temporada.
- No se detectaron errores JavaScript durante la navegación automatizada.
- Los estilos calculados coinciden con V8.07 en las pantallas auditadas.
- Se validaron sintaxis JavaScript, JSON, CSS, referencias de carga y orden de módulos.
- Se mantienen los cinco slots y no cambia el formato de guardado.

**V8.08 no rompe partidas anteriores.** Es una reorganización interna: conserva estado, balance efectivo, clubes, jugadores, contratos, calendarios, cinco slots y progreso. No incorpora migraciones de datos ni vuelve a aplicar la reducción de calidad de V8.07.

## V8.07 - Reducción global de calidad profesional

- Se redujo una sola vez la calidad base de los futbolistas profesionales según su media previa: -4 entre 92-99, -5 entre 80-91, -6 entre 68-79, -5 entre 43-67 y -3 entre 1-42.
- La migración se aplica también a partidas existentes y queda registrada para no repetirse al volver a cargar.
- Los jugadores Leyenda/manuales quedan completamente excluidos: no pierden habilidades, conservan el multiplicador de entrenamiento y el desarrollo bot anteriores, y sus regeneraciones mantienen el rango previo de agentes libres.
- Tu Academia no fue modificada: se conservan captaciones, medias iniciales, crecimiento, juveniles excepcionales, empleados, Predio y residencias.
- La generación profesional futura usa rangos más bajos: 88-95, 75-87, 62-74, 38-61 y 15-37.
- Los agentes libres futuros pasan de 40-62 a 35-57 y los refuerzos de emergencia bots de 28-52 a 25-47.
- El multiplicador de entrenamiento profesional general baja de 3 a 2. Las Leyendas mantienen 3.
- El desarrollo anual bot baja de 18% a 14% y su máximo por habilidad de 18 a 12. Las Leyendas mantienen 18% y máximo 18.
- No se recalculan salarios, cláusulas ni valores ya guardados por esta migración.

**V8.07 no rompe partidas anteriores.** Al cargar una carrera previa se reduce una sola vez la base profesional no legendaria; se conservan clubes, contratos, estadísticas, entrenamiento acumulado, cinco slots y toda la Academia. La modificación deportiva es intencional y no vuelve a aplicarse.

## V8.06 - Inicio de Tu Academia y tratamientos automáticos

### Primer paso en Tu Academia

- La primera acción efectiva realizada en Tu Academia muestra un mensaje introductorio y de felicitaciones.
- El aviso puede activarse al contratar al Preparador de juveniles, iniciar una captación, comenzar la construcción del Predio o alquilar la primera residencia.
- El mensaje explica que Tu Academia, sus instalaciones, juveniles y derechos económicos pertenecen al manager y continúan con él aunque cambie de club.
- La felicitación se muestra una sola vez por carrera y también queda registrada en Mensajes.
- Las partidas anteriores que ya tenían actividad en Academia se reconocen automáticamente y no reciben un aviso tardío.

### Tratamiento automático de lesionados

- Con un kinesiólogo contratado, cada jugador lesionado recibe automáticamente un intento de tratamiento al avanzar cada día.
- Cada lesión inicia un único plan médico con un costo de **$2.000 por cada día diagnosticado**.
- Los tratamientos del primer equipo se pagan con el presupuesto del club; los juveniles de Academia se pagan desde la Cuenta Bancaria personal del manager.
- El plan se cobra una sola vez por lesión. Los intentos diarios posteriores no vuelven a cobrarlo.
- Si no hay fondos suficientes, el tratamiento de esa lesión no comienza y se informa la situación.
- La probabilidad diaria de éxito depende de la categoría del kinesiólogo: Regular 80%, Bueno 90% y Elite 98%.
- Cuando el tratamiento tiene éxito, reduce la lesión con el mismo efecto que la acción manual: 1, 2 o 3 días según la categoría, más los bonos especiales activos.
- El botón manual se conserva para tratar inmediatamente una lesión ocurrida durante el mismo día; después, el proceso continúa de forma automática.
- Los resultados diarios son deterministas para impedir que recargar la partida cambie un éxito por un fallo.

**V8.06 no rompe partidas anteriores.** Agrega estados opcionales y normalizados para el mensaje inicial y los planes médicos. Las lesiones, empleados, presupuestos y Academias existentes se conservan; las lesiones activas comienzan su plan automático cuando exista un kinesiólogo y haya fondos disponibles.


## V8.05 - Nombres adaptados, traspasos visibles y cartera interactiva

### Nombres de jugadores

- Los bancos de Japón, Corea del Sur y Bulgaria utilizan ahora nombres escritos con alfabeto latino y legibles en español.
- Los nuevos juveniles, libres, profesionales generados y futbolistas reciclados después del retiro usan siempre esta adaptación.
- Al cargar una partida anterior, los nombres existentes escritos con caracteres coreanos, japoneses o cirílicos se reemplazan de manera determinista sin alterar nacionalidad, habilidades, edad ni identidad del jugador.
- La corrección también alcanza a Academia, mercado, reserva de retirados y nombres guardados en la cartera de promocionados.

### Traspasos acordados

- Los jugadores que ya tienen acordado un traspaso a otro club muestran una flecha roja junto a los iconos de lesión y suspensión.
- El indicador aparece en las tablas, tácticas, entrenamientos y pantallas de mercado que utilizan el sistema común de estados.
- Al pasar el cursor se informa el club de destino cuando está disponible.

### Cartera de promocionados

- Todos los nombres de la cartera son clickeables.
- Si el futbolista continúa activo, se abre su ficha completa con los datos actuales, club, estadísticas, contrato y estado de transferencia.
- Si ya no existe en la base activa, se abre una ficha histórica con los datos de promoción y el derecho económico registrado.

**V8.05 no rompe partidas anteriores.** Los nombres no latinos se adaptan automáticamente al cargar; no se modifican IDs, planteles, contratos, derechos económicos, estadísticas ni transferencias pendientes.

## V8.04 - Cartera de Academia, regeneración de retirados y reputación de Boca

### Tu Academia

- Tu Academia incorpora un submenú interno con las secciones **Juveniles** y **Cartera de promocionados**.
- La cartera reúne los juveniles que el manager promovió al primer equipo durante cualquiera de sus contratos.
- Para cada futbolista se muestran club actual, liga, cláusula o importe de venta, porcentaje personal de futura venta, beneficio estimado o cobrado y estado del derecho.
- Los derechos existentes de partidas anteriores se conservan; no se generan derechos retroactivos para promociones que nunca fueron registradas.

### Regeneración de jugadores retirados

- Cada jugador retirado pasa a una reserva compacta de identidades en lugar de desaparecer definitivamente.
- Cuando el juego necesita incorporar jugadores libres, utiliza primero esa reserva antes de crear identidades nuevas. Esto también se aplica cuando un club bot necesita cubrir una posición y no encuentra libres disponibles.
- El futbolista vuelve con 18 años, como agente libre, conservando nombre, nacionalidad, posición y fotografía personalizada cuando existe.
- Las habilidades, media, salario y cláusula se regeneran como las de un nuevo jugador de 18 años para evitar arrastrar penalizaciones o datos de la carrera anterior.
- El jugador regenerado recibe un identificador nuevo; así no se mezclan estadísticas, transferencias ni registros históricos de sus dos carreras.
- Los jugadores manuales dejan de reaparecer inmediatamente al retirarse: también esperan hasta que el mercado libre necesite incorporaciones.
- Las partidas anteriores comienzan a registrar esta reserva desde V8.04. Los retirados eliminados por versiones previas no pueden reconstruirse porque esos datos no estaban guardados.

### Clubes

- La reputación base de Boca Juniors pasa de 80 a **92** para partidas nuevas.
- Las partidas existentes conservan la reputación que ya evolucionó durante su carrera.

**V8.04 no rompe partidas anteriores.** Conserva slots, temporadas, planteles, cartera económica y mercado. Agrega de forma automática el submenú de Academia y el estado vacío de reserva de retirados; desde el siguiente retiro, los futbolistas quedan disponibles para futuras regeneraciones.

## V8.03 - Ventanas de mercado y transferencias programadas

### Ventanas del mercado profesional

- Mercado principal: desde el día 355 hasta el día 30 de la temporada siguiente.
- Mercado de mitad de temporada: desde el día 151 hasta el día 178.
- Las compras y ventas de jugadores con contrato se ejecutan inmediatamente sólo cuando el mercado está abierto.
- Con el mercado cerrado se pueden negociar y aceptar operaciones, pero el jugador permanece en su club hasta la siguiente apertura.
- Los jugadores libres y los juveniles de Tu Academia no están limitados por estas ventanas.
- Las transferencias pagadas entre clubes bots también se procesan únicamente durante una ventana abierta.

### Ofertas por cláusula

- Cada oferta por cláusula concede cinco días completos para aceptar la venta o intentar convencer al jugador.
- El cierre del mercado no reduce ese plazo ni provoca una aceptación anticipada.
- Si el plazo vence con el mercado cerrado y el jugador no fue convencido, la transferencia queda acordada para la próxima ventana.
- El futbolista puede jugar y entrenar con normalidad hasta que la salida se ejecute.
- Mientras una transferencia está acordada, el jugador queda bloqueado para nuevas negociaciones, despidos bots y retiros.

### Compras y ventas acordadas

- Las compras realizadas con el mercado cerrado reservan y descuentan el importe al aceptar el acuerdo; el jugador llega en la siguiente apertura.
- Las ventas acordadas con el mercado cerrado acreditan el dinero y aplican impuestos únicamente cuando el jugador deja efectivamente el club.
- La fecha prevista queda almacenada por temporada, día y fecha de calendario.
- Las partidas V8.02 con incorporaciones pendientes migran automáticamente al nuevo calendario de mercado.
- Se corrigió el texto anterior que anunciaba la llegada «el próximo domingo» aunque el código utilizaba otro plazo.

### Interfaz

- El panel fijo de alertas muestra siempre **Mercado abierto** o **Mercado cerrado** junto a mensajes nuevos, ofertas y lesionados.
- El aviso indica cuándo cierra la ventana actual o en qué temporada y día volverá a abrir.
- La pantalla Mercado incluye el mismo estado sobre las pestañas de jugadores libres y contratados.
- Los futbolistas con una transferencia ya acordada aparecen bloqueados para nuevas ofertas.
- Si el manager cambia de club, las operaciones pendientes del club anterior se cancelan y sus bloqueos se limpian para evitar jugadores inaccesibles.

### Corrección de carga

- `10a-manager-player-portfolio.js` ahora se carga después de `12-modals.js`, donde se definen las funciones de transferencia que extiende. Esto evita una referencia prematura durante el inicio.
- Los derechos económicos de la cartera se liquidan sólo cuando la transferencia se ejecuta, no al quedar acordada con el mercado cerrado.

**V8.03 no rompe partidas anteriores.** Conserva los cinco slots, clubes, jugadores y temporadas. Las ofertas por cláusula pendientes reciben un vencimiento individual de cinco días desde su fecha original, y las incorporaciones pendientes se programan para la próxima ventana disponible.


## V8.02 - Optimización de retiros, guardados, planteles y simuladores

### Alcance

- Esta versión aplica los bloques de limpieza segura, retiros y reducción de población, reducción de datos por jugador y rendimiento de guardados y planteles.
- Los slots de partidas no fueron modificados: continúan existiendo cinco carreras normales y el modo especial conserva su tratamiento independiente.

### Retiros y población de jugadores

- El retiro dejó de ser automático para todos los futbolistas de 32 a 38 años del club dirigido.
- La decisión ahora es anual, probabilística y determinista según temporada, jugador y edad; recargar la partida no cambia el resultado.
- La curva se aplica por igual a jugadores del club dirigido, clubes bots y agentes libres.
- Las probabilidades anuales son: 32 años 5%, 33 años 10%, 34 años 18%, 35 años 30%, 36 años 45%, 37 años 60%, 38 años 75%, 39 años 86%, 40 años 94%, 41 años 98% y 42 años 100%.
- Se corrigió la exclusión que impedía retirarse a jugadores contratados por clubes bots.
- Los jugadores manuales que tienen configurada la reaparición después del retiro conservan esa regla.
- Los bots sólo reparan planteles cuando quedan por debajo del mínimo de 18 jugadores o pierden cobertura posicional.
- Antes de generar un jugador de emergencia, el bot intenta contratar un agente libre de la posición necesaria.

### Reducción de datos por jugador

- `playerAgeSkillPenalties` pasa a ser un registro disperso: sólo guarda futbolistas con una penalización real mayor que cero.
- `playerSkillBoosts` también pasa a ser disperso: no conserva objetos vacíos ni mejoras con valor cero.
- Las partidas anteriores eliminan al cargar o guardar entradas de penalizaciones y mejoras con valor cero, identificadores inválidos y jugadores inexistentes.
- La ausencia de una entrada equivale a penalización cero.
- El retiro utiliza una limpieza centralizada para borrar condición, moral, entrenamiento, penalización por edad, estadísticas, lesiones, sanciones, capitanía, impacto, tácticas, mercado y otras referencias del jugador.

### Rendimiento de planteles

- `playersByClub()` utiliza un índice de jugadores por club en lugar de filtrar toda la base en cada consulta.
- El índice se invalida al transferir, liberar, promover, retirar o incorporar futbolistas.
- Las reparaciones de plantel posteriores a los retiros conservan el mínimo existente de 18 jugadores y no vuelven a completar automáticamente cada club hasta 25.

### Guardado local

- Los autoguardados consecutivos se agrupan durante una ventana breve para evitar múltiples escrituras iguales en IndexedDB.
- El guardado manual fuerza inmediatamente la escritura más reciente.
- Se conserva una copia principal y una copia de respaldo por slot.
- Antes de crear el snapshot se compactan las penalizaciones por edad.
- Los errores de cuota, estado de IndexedDB u otros rechazos muestran una advertencia visible y específica.

### Simuladores

- Todos los simuladores y las reglas automáticas quedan unificados en un máximo de cinco sustituciones.
- La simulación rápida impide que un jugador ya expulsado vuelva a recibir tarjetas.
- Cinco expulsiones suspenden el partido y producen derrota 0-3 para el equipo infractor.
- La simulación rápida aplica la misma evolución de cohesión posterior al partido que el simulador completo.
- Los identificadores internos de motores dejaron de depender de números históricos de versiones.

### Limpieza segura

- Se eliminaron constantes antiguas reemplazadas por variantes activas, una versión de banco de nombres sin uso y una configuración de error de gol sin lecturas.
- Se retiró `data/jugadores_manual_ejemplo.json`, que no era cargado por el juego.
- Se eliminaron configuraciones individuales de estadios e hinchas duplicadas por las listas de URLs activas.

### Textos de estadísticas

- `Disparos` y `disparos a puerta` pasan a mostrarse como **Intentos de ataque**.
- `Tiros a Puerta` y `tiros a puerta` pasan a mostrarse como **Tiros al arco**.

**V8.02 no rompe partidas anteriores.** Las partidas existentes migran automáticamente las penalizaciones por edad al formato compacto, conservan sus cinco slots y mantienen todos los snapshots, clubes, jugadores y progresos compatibles.


## V8.01 - Base oficial, auditoría estructural y corrección del guardado manual

### Nueva línea de versiones

- Este paquete establece V8.01 como nueva base oficial del proyecto.
- Se actualizaron versión visible, versión interna, cabeceras del cliente online y parámetros de caché de archivos.
- Las próximas entregas continúan con V8.02 y siguientes.

### Guardado manual

- El botón Guardar ya no entrega el evento del clic como parámetro `silent`.
- El guardado manual vuelve a mostrar su confirmación.
- Si IndexedDB rechaza la operación, se registra el error y se muestra un aviso visible.

### Auditoría de código

- Se validaron sintaxis JavaScript, JSON, CSS, referencias globales, configuración, archivos de datos y focos de rendimiento.
- No se eliminó código potencialmente muerto en esta versión para evitar mezclar la nueva base oficial con una depuración de mayor alcance.
- El informe completo se incluye en `AUDITORIA-CODIGO-V8.01.md`.
- Se identificaron candidatos de eliminación segura, contradicciones entre simuladores, duplicación de configuración y oportunidades de optimización del sistema de guardado.

**V8.01 no rompe partidas anteriores.** Conserva el esquema de guardado y todos los datos existentes.


## V7.69 - Ayuda y cursos adaptados a contratos y Academia personal

### Pantalla de Ayuda

- La guía explica la separación entre presupuesto del club y Cuenta Bancaria del manager.
- Se incorporaron contratos de una, dos o tres temporadas, objetivos anuales, sueldo mensual y ofertas laborales.
- Tu Academia se presenta como patrimonio personal que persiste al cambiar o quedar sin club.
- Se detallan captación, Predio, residencias, gastos personales, ofertas por juveniles, promoción profesional y cartera de jugadores.
- Sponsors, hinchas, estadio, empleados y mercado profesional quedan identificados como recursos institucionales.
- Los botones de la guía abren directamente Finanzas del club, Cuenta Bancaria, Sponsors, Hinchas, instalaciones, contrato actual y las demás pantallas correspondientes.

### Cursos de manager

- La Licencia Básica diferencia campo del club, Predio juvenil y las dos economías de la carrera.
- La Licencia Nacional enseña contrato laboral, objetivos progresivos, sueldo, Academia personal, empleados propios y finanzas separadas.
- La Licencia Internacional incorpora continuidad patrimonial al cambiar de club, mercado juvenil y derechos económicos de la cartera.
- Se conservaron los identificadores de los contenidos para no borrar el progreso de cursos ya iniciado.
- Las licencias aprobadas y la recompensa final de 1.000 puntos permanecen intactas.

**V7.69 no rompe partidas anteriores.** Sólo actualiza textos, enlaces de navegación y la versión interna de los cursos; conserva licencias, controles marcados y recompensas.


## V7.68 - Derechos económicos y cartera de jugadores

### Registro del derecho

- Cada juvenil que firma contrato profesional con el club dirigido queda asociado al contrato laboral vigente del manager.
- Se registra el porcentaje de futura venta ofrecido por ese club, entre 5% y 20%.
- El derecho pertenece al manager y se conserva al cambiar de club, renunciar, ser despedido o quedar sin trabajo.
- No se crean derechos retroactivos sobre jugadores promovidos antes de V7.68.
- Los juveniles vendidos directamente desde Tu Academia a un club bot no generan este porcentaje: el derecho nace únicamente al promoverlos al primer equipo del club dirigido.

### Primera transferencia pagada

- El porcentaje se cobra una sola vez, cuando el club que recibió al juvenil realiza su primera transferencia pagada.
- Primero se descuenta el impuesto de traspaso vigente.
- Sobre el importe neto se calcula el porcentaje personal del manager.
- El club vendedor conserva el neto restante y el beneficio personal se acredita en la Cuenta Bancaria.
- Una vez cobrado, el derecho queda cerrado y no vuelve a generar ingresos en transferencias posteriores.
- Una salida como jugador libre o el retiro cierran el derecho sin pago.

### Cartera de jugadores

- Tu Academia incorpora una sección **Cartera de jugadores**.
- Muestra nombre, rol, edad, club actual, liga, cláusula, porcentaje, beneficio estimado o cobrado y estado.
- El beneficio estimado utiliza la cláusula actual, descuenta el impuesto de traspaso y aplica el porcentaje contractual.
- Los registros cobrados conservan monto de venta, impuesto, importe neto y beneficio personal.

### Transferencias de clubes bot

- Los clubes bot pueden vender jugadores con derechos activos cuando el manager ya no controla al club de origen.
- Se revisan posibles ventas cada 30 días.
- El jugador debe llevar al menos 180 días en el club que lo promovió.
- En cada revisión existe una probabilidad base de 18% por jugador elegible.
- El comprador debe necesitar esa zona, tener lugar en el plantel, presupuesto y una reputación compatible con la calidad del futbolista.
- La oferta se mueve entre 60% y 100% de la cláusula.
- Se procesa como máximo una venta de cartera por revisión.

### Casos cubiertos

- Venta aceptada por el manager desde Mensajes.
- Ejecución automática o forzada de una cláusula.
- Compra del jugador por el nuevo club dirigido por el manager.
- Transferencia futura entre dos clubes bot.

**V7.68 no rompe partidas anteriores.** Las partidas V7.67 crean una cartera vacía al cargar. Los derechos comienzan a registrarse únicamente con juveniles promovidos después de actualizar.


## V7.67 - Mercado juvenil de Tu Academia

### Ofertas por juveniles

- Los juveniles de **17 años** pueden recibir ofertas de clubes controlados por bots.
- Las propuestas aparecen dentro de **Carrera → Tu Academia**, con el nombre del jugador, club comprador, liga, monto bruto, impuesto federativo, ingreso neto y fecha de vencimiento.
- Cada oferta puede aceptarse o rechazarse directamente desde la Academia.
- Las propuestas vencen después de 5 días si no reciben respuesta.
- Un juvenil no puede tener más de una oferta pendiente al mismo tiempo y, tras un rechazo, debe esperar 30 días antes de recibir otra propuesta.

### Clubes compradores

- Los bots revisan la Academia cuando su plantel está por debajo del objetivo de 24 jugadores o necesita reforzar una zona concreta.
- Se consideran porteros, defensores, mediocampistas y delanteros según la composición del plantel comprador.
- El nivel actual del juvenil debe ser coherente con la reputación del club.
- Se priorizan clubes del mismo país de la Academia, aunque también pueden aparecer propuestas extranjeras.
- El club debe tener espacio en el plantel y presupuesto suficiente al generar y al aceptar la oferta.

### Valores e impuestos

- Las ofertas van desde **$20.000 hasta $5.000.000**.
- El valor se calcula a partir de la media actual, la condición excepcional, la necesidad del comprador, su reputación y una penalización moderada si el juvenil está lesionado.
- Los $5.000.000 quedan reservados para casos realmente excepcionales y muy desarrollados.
- Al aceptar, la federación retiene **5%** y el 95% restante entra íntegramente en la Cuenta Bancaria personal del manager.
- El club comprador descuenta el monto bruto de su propio presupuesto.

### Incorporación al club bot

- El juvenil deja Tu Academia y firma su primer contrato profesional con el comprador.
- Su posición definitiva se elige según la necesidad concreta del club.
- Recibe salario, cláusula y estado profesional normal.
- La venta no crea todavía un derecho económico futuro para el manager; esa cartera se incorpora en V7.68 para los juveniles promovidos al club dirigido.

### Interfaz y avisos

- Los juveniles con oferta pendiente muestran una insignia con el monto.
- Inicio muestra una alerta cuando existen propuestas pendientes.
- La Academia conserva un historial interno de ofertas aceptadas, rechazadas y vencidas.

**V7.67 no rompe partidas anteriores.** Las Academias existentes comienzan con la bandeja de ofertas vacía y el mercado juvenil se activa desde el primer día avanzado después de actualizar.



## V7.66 - Academia personal del manager

### Propiedad y continuidad

- **Tu Academia** pasa a ser patrimonio personal del manager y deja de pertenecer al club actual.
- Los juveniles, residencias, Predio de entrenamiento juvenil, obras en curso y Preparador de juveniles se conservan al cambiar de club, renunciar, ser despedido o quedar temporalmente sin trabajo.
- La Academia mantiene como sede el país en el que fue recibida o creada; cambiar de club no modifica automáticamente su origen.
- Tu Academia puede abrirse y continuar funcionando mientras el manager está sin club.
- Ofrecer un contrato profesional a un juvenil sigue requiriendo que el manager esté trabajando en un club.

### Gastos personales

- Todos los gastos de Academia salen de la **Cuenta Bancaria personal** del manager.
- Se incluyen captaciones, alquiler y mantenimiento mensual de residencias, becas semanales de juveniles, Preparador de juveniles, tratamientos médicos, compensaciones por bajas y mejoras del Predio.
- Los gastos quedan registrados dentro del historial de movimientos personales y en una nueva tabla de Finanzas de Academia.
- Las acciones voluntarias se bloquean cuando el saldo personal es insuficiente.
- Los gastos automáticos continúan venciendo aunque el saldo quede negativo; el juego genera una advertencia y bloquea nuevas captaciones, obras, tratamientos y contrataciones hasta recuperar saldo.

### Predio e instalaciones

- El Predio de entrenamiento juvenil se trasladó desde **Club → Estadio e instalaciones** hacia **Carrera → Tu Academia**.
- Conserva nivel, beneficios, límite de residencias y avance de cualquier obra iniciada antes de actualizar.
- Su construcción y mejora se pagan desde la Cuenta Bancaria del manager.
- En las instalaciones del estadio queda únicamente la calefacción del césped, que continúa siendo propiedad y gasto del club.

### Empleados

- El Preparador de juveniles es ahora un empleado personal de Tu Academia.
- Su contratación se paga desde la Cuenta Bancaria y su contrato continúa aunque el manager cambie de club.
- No aparece entre los empleados del club y no es despedido si el presupuesto del club cae por debajo de cero.
- Psicólogo y Kinesiólogo continúan perteneciendo al club y se pagan desde su presupuesto.

### Migración

- Las partidas anteriores transfieren automáticamente la Academia vigente al manager.
- Se conservan todos los juveniles y residencias existentes.
- El nivel y la obra activa del Predio juvenil del club actual pasan a Tu Academia.
- El Preparador de juveniles contratado se mueve desde los contratos del club a los contratos personales de Academia.
- No se duplican instalaciones, empleados ni juveniles durante la migración.

**V7.66 no rompe partidas anteriores.** La propiedad y los gastos se migran automáticamente al cargar. Los movimientos anteriores no se recalculan ni se cobran retroactivamente.


## V7.65 - Contratos y sueldo personal del manager

### Duración contractual

- Los clubes pueden ofrecer contratos de **1, 2 o 3 temporadas**.
- La duración la define el club según el ajuste entre su prestigio y el del manager.
- Los contratos exigentes por diferencia de prestigio siempre duran una temporada.
- Un contrato de dos temporadas reduce 5% el sueldo mensual y uno de tres temporadas lo reduce 10%, a cambio de estabilidad.
- La carrera inicial conserva un primer contrato normal de una temporada.

### Objetivos por año

- El manager negocia la exigencia deportiva, no la duración ni el porcentaje de venta futura.
- **Prudente:** reduce 0,10 PPG el objetivo final y baja 20% el sueldo.
- **Normal:** mantiene objetivo y sueldo base.
- **Ambicioso:** aumenta 0,20 PPG el objetivo final y sube 25% el sueldo.
- En contratos de dos temporadas, el primer año exige un mínimo 0,20 PPG inferior al objetivo final.
- En contratos de tres temporadas, los mínimos son 0,30 y 0,15 PPG inferiores; el tercer año aplica el objetivo final completo.
- Los límites mínimos de cada división continúan activos.
- Si el objetivo final no se cumple pero el manager no fue despedido, la renovación automática queda limitada a una temporada prudente con sueldo reducido.

### Sueldo y Cuenta Bancaria

- El sueldo se calcula usando división, prestigio del manager, reputación del club, capacidad económica, duración y objetivo negociado.
- El club paga el sueldo cada 30 días: se descuenta de sus Finanzas y se acredita en la Cuenta Bancaria personal del manager.
- La Cuenta Bancaria queda separada del presupuesto del club y continúa visible aunque el manager esté sin trabajo.
- Los préstamos siguen perteneciendo al club y permanecen dentro de **Club → Finanzas**.
- La cuenta personal conserva saldo, ingresos acumulados y movimientos entre clubes.

### Porcentaje de futuras ventas

- Cada contrato fija un porcentaje no negociable entre 5% y 20%.
- Los clubes de menor reputación tienden a ofrecer porcentajes mayores.
- El porcentaje queda guardado en el contrato para aplicarlo posteriormente a los juveniles promovidos durante su vigencia.
- V7.65 registra la condición contractual; el cobro efectivo se incorporará con el sistema de derechos económicos y cartera de jugadores.

### Migración

- Las partidas anteriores reciben una Cuenta Bancaria personal con saldo inicial $0.
- El club actual genera un contrato normal de una temporada desde la fecha de migración.
- No se acreditan sueldos retroactivos.
- Los contratos exigentes anteriores se convierten al nuevo formato conservando su restricción de fichajes.

**V7.65 no rompe partidas anteriores.** Agrega estados nuevos y los crea automáticamente al cargar una carrera existente.


## V7.64 - Corrección de recursión en Club

- Se corrigió el error `Maximum call stack size exceeded` al abrir Estadio e instalaciones, Sponsors y Finanzas.
- La causa eran dos enlazadores de botones sobrescritos por funciones autorreferenciales.
- Sponsors vuelve a enlazar correctamente Aceptar/Rechazar ofertas.
- Finanzas y Cuenta Bancaria vuelven a enlazar correctamente solicitudes y cancelación de préstamos.
- Se limpió una asignación HTML duplicada en la vista de Estadio.
- No se modificaron economía, sponsors, estadio, guardados ni simuladores.

**V7.64 no rompe partidas anteriores.** Es una corrección de interfaz y eventos.

## V7.63 - Edad en ojeo y limpieza de Oficina del manager

- Las tarjetas activas del **Centro de Ojeo** muestran la edad del jugador junto a club, nacionalidad y posición.
- Las tablas de **Informes guardados** e **Informes archivados** incorporan una columna específica de edad.
- Se utiliza el dato de edad que ya existe en cada jugador; no se agregan campos nuevos al guardado ni a la base.
- Se retiró el bloque **Sponsors activos** de la cuadrícula de **Oficina del manager** para reducir información duplicada.
- Sponsors continúa disponible como pantalla propia dentro de **Club → Sponsors**, y sus ofertas siguen apareciendo entre los avisos de Inicio.
- No se modifican contratos comerciales, economía, ojeo, planteles ni simuladores.

**V7.63 no rompe partidas anteriores.** Son ajustes de visualización que utilizan datos ya existentes.


## V7.62 - Menú lateral compacto y anidado

- El menú lateral se reorganizó en seis grupos desplegables: **Especial, Equipo, Club, Competición, Carrera y Online**, además de **Inicio** como acceso directo.
- Sólo un grupo permanece abierto a la vez y el navegador recuerda el último grupo desplegado.
- **Especial** contiene Cartas.
- **Equipo** contiene Primer equipo, Centro de Ojeo y Mercado.
- **Club** contiene Empleados, Estadio e instalaciones, Finanzas, Sponsors e Hinchas y socios.
- **Competición** contiene Calendario, Competiciones, Tabla de posiciones y Mundial de Clubes. Las estadísticas generales siguen disponibles dentro de la pantalla de competiciones.
- **Carrera** contiene Tu Academia, Perfil e historial, Hitos, Ofertas laborales/contrato actual y Cuenta Bancaria.
- **Online** contiene Ranking y Desafíos Online.
- Sponsors, Hinchas y socios, Cuenta Bancaria, Hitos y Contrato actual reciben vistas directas, sin duplicar datos ni cambiar la lógica de los sistemas.
- Mensajes permanece accesible desde Inicio y desde sus avisos, evitando alargar nuevamente el menú.
- El estado activo, los bloqueos por estar sin club y la navegación responsive se adaptaron a los nuevos submenús.

**V7.62 no rompe partidas anteriores.** Es una reorganización de navegación y presentación. No modifica guardados, simuladores, calendarios, economía ni planteles.


## V7.61 - Captación excepcional del predio juvenil

- Se auditó la relación entre el Predio de entrenamiento juvenil y la captación de talentos.
- La cuota excepcional se entrega completa y de una sola vez en la primera captación de cada temporada.
- La progresión queda fijada en 1, 2, 3, 4 y 6 juveniles excepcionales para los niveles 1 a 5; sin predio se mantiene el juvenil base.
- La primera captación exige cupos libres para toda la cuota, evitando que juveniles excepcionales se marquen como entregados aunque se hayan perdido por falta de espacio.
- Una mejora del predio posterior a la primera captación se aplica desde la temporada siguiente; las captaciones posteriores del mismo año no agregan diferencias.
- La Academia y la pantalla de Instalaciones muestran el total exacto que entregará la primera captación.

**V7.61 no rompe partidas anteriores.** Las temporadas que ya registraron una captación excepcional se consideran resueltas y no reciben duplicados. La nueva regla se aplica plenamente desde la siguiente primera captación pendiente.

## V7.60 - Cláusula visible en jugadores ojeados

- Las tarjetas activas del **Centro de Ojeo** muestran el **Valor de cláusula** junto al botón **Hacer oferta**.
- El botón abre la negociación habitual sin modificar montos, aceptación ni reglas de mercado.
- Al abrir la ficha individual de un jugador que ya posee informe de ojeo, la cláusula también aparece al lado de **Hacer oferta**.
- No se agregan campos a los jugadores: se utiliza el valor de cláusula que ya existe en la base y en la partida.
- No se modifican simuladores, probabilidades, planteles ni contratos.

**V7.60 no rompe partidas anteriores.** Es un ajuste de presentación y acceso a la negociación; utiliza datos ya guardados.


## V7.59 - Reducción contextual y distribución de lesiones

- Nueva distribución de tipos de lesión: Contusión 34%, Distensión 30%, Desgarro 20%, Esguince 10%, Rotura 5% y Fractura 1%. Las duraciones no cambian.
- Todos los equipos bot utilizan un multiplicador constante de 0,50 sobre la probabilidad final de lesión durante partidos.
- El club del manager utiliza un multiplicador de 0,50 durante sus primeros 50 partidos oficiales dirigidos. La protección no se aplica a encuentros contra otros managers; Desafíos Online conserva su sistema independiente.
- El simulador en vivo aplica otro multiplicador de 0,50 a ambos equipos.
- La comprobación minuto a minuto del simulador en vivo fue normalizada: la suma de los 90 controles representa una única probabilidad de partido, evitando multiplicar indirectamente el riesgo por realizar un control en cada minuto.
- Cartas, trabajo diferenciado, estado físico, campo, sobrecarga por participación e instrucciones conservan sus efectos y se combinan de forma multiplicativa.

**V7.59 no rompe partidas anteriores.** No cambia la estructura del guardado. Los nuevos pesos y multiplicadores se aplican únicamente a lesiones generadas en partidos disputados después de cargar esta versión.


## V7.58 - Estadísticas individuales por temporada

### Cambios

- Se agregó la subpestaña **Estadísticas** dentro de **Primer Equipo**, junto a Táctica, Plantel y Entrenamiento.
- La tabla muestra por jugador: partidos jugados, goles, asistencias, lesiones, amarillas, rojas y puntaje promedio.
- El puntaje promedio acumula la calificación final de cada partido oficial del club dirigido.
- El simulador vivo guarda la calificación final mostrada para cada futbolista participante.
- La simulación normal y **Ver solo resultados** generan una calificación equivalente usando los eventos principales del encuentro.
- Las estadísticas se organizan por año, temporada y club.
- Al renunciar, ser despedido o comenzar una nueva temporada, la fotografía del club queda archivada.
- Si el manager dirige más de un club durante el mismo año, puede seleccionar cada club dentro de esa temporada.
- Se conservan nombres y posiciones aunque el jugador cambie de club o se retire.

### Compatibilidad

**V7.58 no rompe partidas anteriores.** La temporada vigente se reconstruye desde `matchHistory` cuando esté disponible. Las temporadas finalizadas antes de instalar V7.58 no pueden reconstruirse porque las versiones anteriores eliminaban el historial detallado al comenzar un nuevo año.

### Archivos principales modificados

- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/11-match-engine.js`
- `simulador-2.0.js`
- `js/ui/07-render-team-market.js`
- `style.css`
- archivos de versión y caché
- `README.md`


## V7.57 - Media general y puntaje total en jugadores ojeados

### Nuevos indicadores

- Las tarjetas de jugadores del **Centro de Ojeo** muestran ahora **Media general** y **Puntaje total**.
- La **Media general** es el promedio directo de las 20 habilidades existentes del jugador.
- El **Puntaje total** es la suma de esas mismas 20 habilidades, con un máximo teórico de 1.980 puntos.
- Se incluyen Portería, habilidades defensivas, técnicas, físicas, mentales y Potencial.
- No se incluyen Agresividad, Genética, Factor sorpresa ni Probabilidad de fichaje, porque son datos ocultos o de mercado y no forman parte de la media técnica general.

### Progreso del informe

- En jugadores externos, ambos valores permanecen ocultos hasta descubrir las 20 habilidades necesarias.
- Mientras el informe está incompleto se indica cuántas habilidades se conocen y cuántas faltan.
- En jugadores propios, cuyos atributos normales ya son conocidos, los dos indicadores aparecen inmediatamente.
- Los informes guardados y archivados incorporan columnas de Media general y Puntaje total cuando el informe está completo.

### Datos y simulación

- Los dos indicadores se calculan en tiempo real; no se agregan campos a los jugadores ni a la base JSON.
- No se modifica el ritmo del ojeo, la cantidad de datos revelados ni la probabilidad de fichaje.
- No se modifican el simulador normal, el simulador en vivo, el resultado rápido ni Desafíos Online.

### Archivos principales modificados en V7.57

- `js/game/16-scouting-center.js`
- `style.css`
- archivos de versión y caché
- `README.md`

### Compatibilidad

**V7.57 no rompe partidas anteriores.** Los valores se calculan a partir de las habilidades ya existentes y de los informes guardados. Un jugador completamente ojeado mostrará ambos indicadores al cargar esta versión.


## V7.56 - Mayor peso de las individualidades

### Equilibrio colectivo e individual

- Se confirmó que el motor utilizaba una mezcla de **70% fuerza colectiva y 30% resolución individual** al definir cada ocasión.
- La relación pasa a **50% colectivo y 50% individual**.
- El ajuste potencia la influencia de delanteros, defensores y arqueros sobresalientes en los duelos concretos de una jugada.
- La parte individual compara atributos ya existentes del rematador, defensor y portero, además de su moral y otros modificadores vigentes.
- No se cambia la habilidad **Trabajo en equipo** de los jugadores ni se alteran sus valores guardados.

### Modos afectados

- Simulación normal mediante el motor principal.
- Partido dirigido en el simulador en vivo.
- Opción **Ver solo resultados**, que recorre automáticamente el mismo motor vivo.
- Los tres modos usan la misma función de resolución de ocasiones, por lo que la proporción 50/50 es consistente.
- No se modifica el simulador independiente de Desafíos Online.

### Alcance del ajuste

- No cambia la cantidad base de ataques ni ocasiones generadas por los equipos.
- No modifica tácticas, cohesión, estado físico, localía, tarjetas, lesiones ni entrenamiento.
- Cambia la probabilidad final de convertir una ocasión, dando más importancia a la calidad individual de quienes intervienen.

### Archivos principales modificados en V7.56

- `config.js`
- `balance-modificadores.js`
- `simulador-2.0.js`
- archivos de versión y caché
- `README.md`

### Compatibilidad

**V7.56 no rompe partidas anteriores.** No cambia la estructura de guardado ni los atributos de los jugadores. La nueva proporción se aplica a los partidos disputados después de cargar esta versión.


## V7.55 - Corrección de búsqueda automática y requisito de jefe

### Corrección del avance diario

- Se corrigió un error de persistencia que impedía que la barra de **Buscar jugadores** avanzara día a día.
- El problema se producía porque el procesamiento de costos normalizaba nuevamente el Centro de Ojeo y reemplazaba su objeto de estado. El costo diario se registraba, pero el progreso y el resultado quedaban escritos sobre una referencia anterior.
- El proceso diario ahora reutiliza el mismo objeto persistente para costos mensuales, búsqueda, observación y revelaciones.
- Al completar los días requeridos, el jugador encontrado se agrega correctamente a la lista activa, recibe el borde especial y genera su mensaje.
- Se mantiene el límite de un jugador encontrado cada siete días.

### Jefe de ojeadores obligatorio

- La búsqueda automática sólo puede activarse con un **Jefe de ojeadores contratado**.
- Sin jefe, el interruptor muestra **REQUIERE JEFE**, permanece apagado y explica el requisito.
- Una búsqueda activa de una partida anterior se desactiva automáticamente si no existe un jefe.
- Despedir al jefe apaga la búsqueda, elimina su progreso y deja intactos los criterios elegidos.
- Al finalizar la temporada, cuando el jefe deja el club, la búsqueda también se apaga y reinicia.
- Mientras está desactivada por falta de jefe no se cobra el costo diario de $50.000.

### Validación

- Búsqueda sin filtros: resultado persistente al completar 1 día.
- Búsqueda con probabilidad superior al 30%: progreso 1/2 el primer día y resultado el segundo.
- Cobro único de $50.000 por cada fecha procesada.
- Activación bloqueada sin jefe.
- Migración de búsquedas activas sin jefe a estado apagado y progreso cero.
- Despido del jefe con apagado inmediato de la búsqueda.
- No se modificaron los simuladores ni la lógica de partidos.

### Archivos principales modificados en V7.55

- `js/game/16-scouting-center.js`
- `style.css`
- archivos de versión y caché
- `README.md`

### Compatibilidad

**V7.55 no rompe partidas anteriores.** Las búsquedas de V7.54 conservan sus criterios. Si tenían un jefe contratado, continuarán desde su progreso guardado; si no tenían jefe, se apagarán y reiniciarán automáticamente.


## V7.54 - Búsqueda automática de jugadores

### Nuevo buscador del Centro de Ojeo

- Se agregó el bloque **Buscar jugadores** en la parte principal del Centro de Ojeo.
- La búsqueda funciona mediante un switch **ON/OFF**.
- Mientras permanece activa cuesta **$50.000 por día** y el gasto queda registrado en Finanzas.
- Apagarla reinicia inmediatamente la barra de progreso a cero.
- Cambiar cualquiera de los criterios también reinicia el progreso, evitando mezclar búsquedas diferentes.
- El servicio encuentra como máximo un jugador por semana y lo agrega automáticamente a la lista activa de seguimiento.

### Criterios disponibles

- Rol: cualquiera o uno de los doce puestos disponibles —POR, LD, LI, DFC, MCD, MC, MI, MD, MCO, ED, EI y DC—.
- Probabilidad de fichaje: cualquiera, más de 30%, más de 50% o más de 80%.
- La búsqueda utiliza la probabilidad real correspondiente al club que dirige actualmente el manager, sin revelarla automáticamente dentro del informe.

### Tiempo de búsqueda

- Sin criterios: **1 día**.
- Elegir un rol específico: **+2 días**.
- Más de 30% de probabilidad de fichaje: **+1 día**.
- Más de 50%: **+2 días**.
- Más de 80%: **+3 días**.
- El tiempo total puede variar entre **1 y 6 días**. Después de encontrar un jugador se respeta el límite máximo de una incorporación automática por cada siete días.

### Progreso y resultados

- Una barra muestra los días cumplidos y los días requeridos.
- Si la lista activa está completa, la búsqueda queda al 100% esperando un cupo libre.
- Si no existen coincidencias, permanece completa y vuelve a intentarlo diariamente mientras siga encendida.
- El jugador encontrado se agrega automáticamente, recibe una insignia específica y su tarjeta aparece con un borde verde diferenciado.
- También se genera un mensaje con el nombre, el rol y el club del jugador encontrado.
- Quitar al jugador de la lista elimina el resaltado, pero conserva su informe archivado como en el resto del Centro de Ojeo.

### Archivos principales modificados en V7.54

- `config.js`
- `js/core/01-config-constants.js`
- `js/game/16-scouting-center.js`
- `style.css`
- archivos de versión y caché
- `README.md`

### Compatibilidad

**V7.54 no rompe partidas anteriores.** Las partidas existentes incorporan la búsqueda apagada y con progreso cero. No se modifican informes, jugadores, simuladores ni resultados.


## V7.53 - Pulido visual del Centro de Ojeo

### Lista de jugadores en seguimiento

- Cada jugador ocupa ahora una fila completa dentro del área principal, evitando tarjetas demasiado angostas cuando existen muchos informes.
- La cabecera separa con mayor claridad rostro, identidad, progreso, probabilidad de fichaje y acción de quitar.
- Los textos largos pueden saltar de línea sin invadir botones, cifras ni tarjetas vecinas.
- La lista conserva todas las habilidades agregadas en V7.52 y no cambia el ritmo ni la lógica del ojeo.

### Grupos de habilidades

- Los grupos se distribuyen en una grilla responsive de tres, dos o una columna según el ancho disponible.
- Técnicas y ofensivas dispone de más espacio por ser el grupo con mayor cantidad de atributos.
- Habilidades ocultas y Mercado forman parte de la misma grilla visual para evitar bloques sueltos y alturas inconsistentes.
- Cada grupo tiene un encabezado independiente y una insignia compacta con datos conocidos sobre el total.
- Cada habilidad utiliza una fila estable de etiqueta y valor; los nombres extensos, como Trabajo en equipo, pueden ocupar dos líneas sin superponerse.

### Responsive y alcance

- En pantallas medianas la grilla pasa a dos columnas.
- En móviles pasa a una columna y el botón Quitar ocupa una fila propia.
- No se modificaron informes, jugadores, datos guardados, fórmulas, mercado ni simuladores.

### Archivos principales modificados en V7.53

- `js/game/16-scouting-center.js`
- `style.css`
- archivos de versión y caché
- `README.md`

### Compatibilidad

**V7.53 no rompe partidas anteriores.** Es un ajuste de presentación. Los informes y progresos de ojeo existentes se conservan sin migraciones adicionales.


## V7.52 - Ojeo detallado de todas las habilidades existentes

### Informe individual ampliado

- El Centro de Ojeo deja de limitar el informe individual a las siete habilidades resumidas.
- Cada jugador externo puede revelar por separado todas las habilidades que ya existen dentro de su objeto `skills`.
- La base profesional actual contiene 20 habilidades internas por jugador:
  - Portería.
  - Entradas.
  - Marca.
  - Posicionamiento.
  - Pase corto.
  - Pase largo.
  - Visión.
  - Regate.
  - Técnica.
  - Remate.
  - Cabezazo.
  - Velocidad.
  - Aceleración.
  - Fuerza.
  - Resistencia.
  - Trabajo en equipo.
  - Serenidad.
  - Disciplina.
  - Liderazgo.
  - Potencial.
- También se conservan las tres habilidades ocultas ya existentes: Agresividad, Genética y Factor sorpresa.
- La probabilidad de fichaje continúa funcionando como información adicional revelable.

### Presentación del informe

- Las habilidades se ordenan por grupos: Portería, Defensivas, Técnicas y ofensivas, Físicas, Mentales y desarrollo, Ocultas y Mercado.
- Cada grupo muestra cuántos datos fueron descubiertos y cuáles permanecen ocultos.
- La ficha individual del jugador usa el mismo detalle cuando el futbolista pertenece a otro club.
- La estimación de media se calcula sólo con habilidades detalladas ya observadas y no utiliza Potencial ni Portería para jugadores de campo.
- El radar se habilita cuando todas las habilidades existentes del jugador fueron reveladas.

### Compatibilidad de informes anteriores

- Los informes creados en V7.51 se migran automáticamente.
- Cada antigua habilidad resumida se convierte en los atributos internos que la componían, evitando perder el progreso ya realizado.
- Los informes propios continúan mostrando desde el inicio todas las habilidades conocidas del plantel y sólo gastan ojeo en datos ocultos.
- Los informes archivados conservan sus revelaciones.

### Datos y simulación

- No se agregaron campos a `data/jugadores.json` ni a los archivos de jugadores por liga.
- El sistema lee dinámicamente las habilidades que ya existen en cada jugador, por lo que también puede mostrar futuros atributos internos sin duplicar la base.
- No se modificaron el simulador normal, el simulador en vivo, las fórmulas deportivas ni la generación de resultados.

### Archivos principales modificados en V7.52

- `js/game/16-scouting-center.js`
- `js/ui/12-modals.js`
- `style.css`
- archivos de versión y caché
- `README.md`

### Compatibilidad

**V7.52 no rompe partidas anteriores.** Los informes de ojeo existentes se migran al nuevo detalle al cargar la partida. No se modifican jugadores, planteles, calendarios, resultados ni el simulador en vivo.

## V7.51 - Despido del jefe de ojeadores

### Nueva acción

- La tarjeta del **Jefe de ojeadores** incorpora el botón **Despedir jefe**.
- El despido sólo puede confirmarse cuando el Centro de Ojeo tiene **0 oficinas alquiladas** y **0 ojeadores contratados**.
- Si queda alguna oficina u ojeador, el botón permanece bloqueado y la tarjeta explica qué debe retirarse primero.
- El mes actual ya pagado no se reintegra.
- Al despedirlo se elimina el jefe y se detienen sus cargos mensuales futuros. Los informes guardados y la lista de seguimiento no se borran.
- Sin jefe no pueden alquilarse nuevas oficinas hasta contratar un reemplazo.

### Archivos principales modificados en V7.51

- `js/game/16-scouting-center.js`
- `config.js`
- `balance-manager.js`
- `balance-modificadores.js`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/18-challenges-online.js`
- `js/ui/19-manager-courses.js`
- `data/habilidades_especiales.json`
- `index.html`
- `README.md`

### Compatibilidad

**V7.51 no rompe partidas anteriores.** Los jefes ya contratados continúan activos. El nuevo botón sólo modifica el estado cuando el manager decide despedirlos y cumple las condiciones.

## V7.50 - Trabajo diferenciado integrado con el kinesiólogo

### Interfaz unificada

- El casillero de **Trabajo diferenciado** ya no aparece como una tarjeta independiente dentro de Empleados.
- Ahora forma parte del mismo bloque visual del **Kinesiólogo**, debajo de su contratación, categoría y botón de despido.
- La selección del jugador, su estado físico, moral y porcentaje de prevención permanecen dentro de esa misma tarjeta.

### Kinesiólogo no contratado o despedido

- El casillero permanece visible dentro de la tarjeta del kinesiólogo, pero aparece oscuro, desaturado y marcado como **Sin efecto**.
- No permite seleccionar ni agregar jugadores hasta contratar nuevamente al empleado.
- Al despedir al kinesiólogo, la asignación vigente se elimina y dejan de aplicarse inmediatamente la recuperación diaria, la exclusión del entrenamiento y la reducción de lesiones.
- Volver a contratar un kinesiólogo no recupera automáticamente la asignación anterior; el manager debe elegir nuevamente al jugador.

### Archivos principales modificados en V7.50

- `js/game/10-academy-employees.js`
- `style.css`
- `config.js`
- `balance-manager.js`
- `balance-modificadores.js`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/18-challenges-online.js`
- `js/ui/19-manager-courses.js`
- `data/habilidades_especiales.json`
- `index.html`
- `README.md`

### Compatibilidad

**V7.50 no rompe partidas anteriores.** Las asignaciones existentes continúan activas si el kinesiólogo sigue contratado. Si el empleado es despedido, el casillero se desactiva y la asignación se elimina, igual que en V7.49.

## V7.49 - Trabajo diferenciado del kinesiólogo

### Nuevo casillero de recuperación

- La sección **Empleados → Kinesiólogo** incorpora un único casillero de **Trabajo diferenciado**.
- Puede asignarse cualquier jugador del primer equipo mientras exista un kinesiólogo contratado.
- El jugador puede cambiarse o retirarse del casillero en cualquier momento.
- El casillero se libera automáticamente si el kinesiólogo es despedido, termina su contrato o el jugador deja el club.

### Efectos diarios

Mientras permanezca asignado, el jugador:

- no participa del entrenamiento general del plantel;
- no recibe entrenamiento individual;
- no obtiene mejoras de habilidades por entrenamiento;
- reduce **4 puntos de desgaste acumulado por día**;
- recupera **5 puntos de forma física por día**;
- aumenta **1 punto de moral por día**.

La recuperación respeta los límites normales de forma y desgaste del jugador. El trabajo diferenciado también se procesa en días donde el entrenamiento general esté omitido.

### Prevención de lesiones durante partidos

La reducción se aplica únicamente al jugador ubicado en el casillero y depende de la categoría del kinesiólogo:

| Kinesiólogo | Reducción de probabilidad de lesión |
|---|---:|
| Regular | 40% |
| Bueno | 55% |
| Elite | 85% |

- Funciona en resultado rápido, partido dirigido y simulador en vivo.
- Se combina de forma multiplicativa con cartas de prevención de lesiones.
- No impide que el jugador participe de partidos.
- No cura lesiones existentes ni reduce directamente la duración de una lesión.

### Interfaz de entrenamiento

- El jugador asignado aparece marcado como **Trabajo diferenciado**.
- Su selector de entrenamiento individual queda reemplazado por una advertencia.
- Las asignaciones masivas de entrenamiento no modifican al jugador mientras ocupe el casillero.

### Archivos principales modificados en V7.49

- `config.js`
- `data/empleados.json`
- `js/core/01-config-constants.js`
- `js/core/03-player-tactics-utils.js`
- `js/data/04-data-storage.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/10-academy-employees.js`
- `style.css`
- `index.html`
- `README.md`

### Compatibilidad

**V7.49 no rompe partidas anteriores.** Las partidas existentes incorporan el casillero vacío. No se modifican entrenamientos, lesiones ni empleados ya contratados hasta que el manager asigne voluntariamente un jugador.


## V7.48 - Reajuste de recompensas de puntos de habilidad

### Nueva tabla de entrega

| Acción | Puntos | Frecuencia |
|---|---:|---|
| Ganar un partido | 150 | Cada partido ganado por el manager |
| Empatar un partido | 50 | Cada empate |
| Marcar más de 5 goles | 250 adicionales | Cada partido con 6 o más goles a favor |
| Campeón de Tercera División | 1.000 | Cada campeonato |
| Campeón de Segunda División | 2.000 | Cada campeonato |
| Campeón de Primera División | 3.000 | Cada campeonato |
| Tratar a un jugador lesionado | 10 | Cada tratamiento válido |
| Consultar juveniles | 10 | Cada nuevo informe del preparador |
| Regar o parchar el campo | 50 | Cada mantenimiento iniciado |
| Destruir una carta | Según rareza | Cada carta destruida |
| Superar Campo destruido | 10.000 | Una sola vez por perfil |
| Completar la Licencia Internacional | 1.000 | Una sola vez por perfil |
| Canjear códigos de habilidad | 20.000 por código | Una vez por código y partida |

### Cambios respecto de V7.47

- Victoria: de 125 a **150 puntos**.
- Empate: de 100 a **50 puntos**.
- Tratamiento de lesión: de 50 a **10 puntos**.
- Consulta de juveniles: de 100 a **10 puntos**.
- Se mantienen sin cambios el bonus por seis o más goles, los campeonatos, el mantenimiento del campo, la destrucción de cartas, Campo destruido, la Licencia Internacional y los códigos especiales.
- Los nuevos valores se leen desde la tabla central de habilidades especiales y se reflejan automáticamente en la animación diaria de sumatoria.
- La URL del archivo de recompensas incorpora versión para evitar que el navegador conserve la tabla anterior en caché al publicar en GitHub Pages.

### Ejemplos de acumulación

- Victoria con hasta cinco goles: **150 puntos**.
- Victoria con seis o más goles: **400 puntos** (`150 + 250`).
- Empate con hasta cinco goles: **50 puntos**.
- Empate marcando seis o más goles: **300 puntos** (`50 + 250`).
- Derrota marcando seis o más goles: conserva el bonus de **250 puntos**.

### Compatibilidad

**V7.48 no rompe partidas anteriores.** No se recalculan ni descuentan puntos ya entregados. Los nuevos importes se aplican únicamente a acciones realizadas después de cargar esta versión.


## V7.47 - Medidas económicas, despido de empleados y sanción AFA

### Despido automático por números rojos

- Cuando el presupuesto del club cae por debajo de `$0`, la directiva despide automáticamente a todos los empleados de temporada activos.
- La medida alcanza al psicólogo motivacional, kinesiólogo y preparador de juveniles.
- Los contratos ya fueron abonados por la temporada completa, por lo que no existe devolución de dinero.
- El despido se comprueba al registrar movimientos económicos, al comenzar un nuevo día y al cargar Inicio o Empleados con saldo negativo.
- Se genera un mensaje financiero de prioridad alta con el listado de empleados despedidos.

### Despido manual de empleados

- Cada tarjeta de empleado contratado incorpora el botón **Despedir**.
- Antes de confirmar se advierte que el contrato anual ya está pagado y no tiene reintegro.
- El empleado deja de habilitar sus acciones inmediatamente.
- Si el club desea contratarlo nuevamente durante la misma temporada, debe pagar un contrato completo nuevo.
- Los cooldowns y tratamientos ya utilizados no se reinician por despedir y volver a contratar.

### Sanción de AFA por campo crítico

- Si el campo del club dirigido cae por debajo de `10/100`, la AFA interviene automáticamente.
- Se aplican dos cargos separados:
  - `$1.000.000` de multa.
  - `$4.000.000` por replante obligatorio del césped.
- El replante de AFA reemplaza cualquier parcheo o replante manual que estuviera activo.
- Durante la intervención no se puede iniciar otro mantenimiento.
- El campo conserva su estado crítico durante el día de la sanción y queda restaurado a `100/100` al día siguiente.
- El control es idempotente: no puede cobrar dos veces la misma intervención en una fecha.
- La pantalla Estadio muestra el aviso, el total cobrado y la fecha prevista de restauración.

### Integración económica

- Los cargos de AFA aparecen en Finanzas dentro de la categoría Estadio.
- Si la multa y el replante llevan al club a números rojos, se ejecuta inmediatamente el despido automático de empleados.
- Los clubes bots no reciben esta sanción; se aplica únicamente al club controlado por el manager.

### Archivos principales modificados en V7.47

- `config.js`
- `index.html`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/09-simulation-economy-training.js`
- `js/game/10-academy-employees.js`
- `js/ui/06-render-home-messages.js`
- `style.css`
- `README.md`
- archivos de versión y caché

### Compatibilidad

**V7.47 no rompe partidas anteriores.** Las partidas existentes incorporan automáticamente el registro de sanciones del campo. Si una partida se carga con presupuesto negativo y empleados activos, estos serán despedidos al abrir Inicio o Empleados, o durante el siguiente procesamiento económico. Si el campo ya está por debajo de 10, la sanción se aplicará al comenzar el próximo día.


## V7.46 - Animación diaria de puntos de habilidad

### Sumatoria junto a Avanzar día

- Al comenzar una nueva fecha, junto al botón **Avanzar día** aparece una animación breve con los puntos de habilidad obtenidos desde el avance anterior.
- El contador sube progresivamente desde 0 hasta la cantidad ganada.
- Cuando hubo varias recompensas, muestra una suma compacta, por ejemplo `150 + 250 = 400`.
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

Los niveles deben construirse en orden. La primera captación de cada temporada entrega toda la cuota excepcional de una sola vez: 1 juvenil base más el bonus del nivel, hasta un máximo de 6. Para iniciar esa captación deben existir cupos libres para toda la cuota. Las mejoras finalizadas después de la primera captación se aplican desde la temporada siguiente.

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