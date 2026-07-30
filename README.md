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

