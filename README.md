# Manager Fútbol - README

## Versión actual: V3.71

Juego de manager de fútbol en HTML/JS local con simulación de partidos, economía, mercado, academia, estadio, hinchadas, carrera del manager y sistema ESPECIAL.

## Historial de actualizaciones

### V3.71 - Oferta especial de cláusula y mensajes limpios
- Se eliminó el mensaje visible de ajuste de preparación de equipos bot.
- En las últimas 10 fechas puede aparecer entre 1 y 2 ofertas especiales de cláusula.
- La oferta especial llega desde un club de la misma liga por uno de los 3 jugadores con mayor media del plantel.
- El club interesado ofrece el 100% de la cláusula.
- Se puede aceptar la venta o intentar convencer al jugador de quedarse.
- Convencer puede fallar con probabilidad igual a posición actual en liga x2.
- Se agregaron 5 variantes de mensaje cuando el jugador acepta quedarse y 5 cuando decide irse.

### V3.70 - Duración de obras de estadio configurable
- Se agregó `estadio.multiplicadorDiasObras` en `config.js`.
- Valor inicial: x30.
- Las ampliaciones del estadio ahora tardan 30 veces más que su duración base.
- El listado de Ampliaciones muestra la duración final ya multiplicada.
- Las obras activas antiguas se normalizan al nuevo multiplicador conservando el avance aproximado.

### V3.69 - Mini ajustes de interfaz
- El prestigio del manager se muestra como valor entero.
- Renunciar al club se movió arriba junto a Guardar y Cargar, con confirmación previa.
- En Táctica, las columnas Edad, Media, Físico, Moral y Estado se centran; Pos. y Jugador quedan alineadas a la izquierda.
- En Plantel se compactó la tabla y se agregó barra horizontal superior.
- En Academia, el preparador de juveniles y Consultar juveniles quedan arriba.
- El promedio de habilidades visibles de juveniles usa el mismo gráfico circular de los informes.
- La ficha de jugador es más compacta y muestra las acciones arriba.
- Mercado carga sólo los mejores 20 jugadores coincidentes y permite Ver más de a 20.
- Finanzas muestra categorías más compactas.

### V3.68 - Liga predeterminada y estados tácticos persistentes
- Tabla y Estadísticas abren por defecto en la liga donde juega el manager.
- Los estados individuales del jugador se conservan aunque salga del once, del club o se use Mejor once / Mejor condición física.
- Sólo el manager puede cambiar esos estados desde la pizarra.
- README reorganizado de versión más reciente a más antigua.

### V3.67 - Ampliaciones de estadio
- Nuevo apartado Ampliaciones en Estadio.
- 60 obras progresivas hasta 120.000 espectadores.
- Reglas de simultaneidad por capacidad, bloqueo por slot y bloqueo Integral.
- Penalización de asistencia por obras activas: -5% por obra, tope -20%.
- La capacidad aumenta sólo cuando la obra termina.

### V3.66 - Relato más lento
- El relato grande del simulador permanece visible durante 2 fases.
- La simulación mantiene 60 fases.

### V3.65 - Prestigio visual corregido
- El prestigio visual anterior usaba decimal local para evitar confusión; desde V3.69 se muestra como entero.
- El visor ya no suma el umbral artificial de 20 puntos.
- Clubes de prestigio menor a 20 siguen aceptando cualquier manager.

### V3.64 - Relato del simulador
- Simulador con 60 fases.
- Bloque grande de Relato de partido.
- 300 frases en `data/relatos_partido.json`.
- La lista de acciones se mantiene y el relato anticipa o remata jugadas destacadas.

### V3.63 - Prestigio, experiencia y renuncia
- Experiencia: ganar +10, empatar +3, perder +1.
- La experiencia equivale a 0.001 prestigio por punto.
- Cada 10 victorias suma 1 prestigio.
- Objetivo cumplido suma 5 prestigio.
- Despido resta 2.
- Campeonatos, descensos o último puesto ajustan prestigio según división.
- Botón Renunciar al club.

### V3.62 - Mejor condición física
- El botón Mejor condición física prioriza jugadores con condición 75 o más.
- Reduce penalizaciones por fuera de posición antes de completar el once.

### V3.61 - Finanzas y recaudación
- El simulador muestra Recaudación de entradas.
- Finanzas organiza ingresos y gastos por categorías desplegables.

### V3.60 - Ofertas con jugador clickeable
- En mensajes de ofertas, el nombre del jugador abre su ficha individual.

### V3.59 - Carrera y prestigio de manager
- El despido ya no reinicia la partida.
- El manager puede buscar otro club y continuar la carrera.
- Nueva lógica de prestigio de manager y experiencia.
- Nueva partida pasa a llamarse Buscar club.
- Mensajes más compactos, ESPECIAL destacado y reset movido abajo con advertencia.

### V3.58 - Flechas tácticas visibles
- Estados tácticos visibles dentro de la pizarra: ←←, ←, •, →, →→.
- Leyenda debajo de la cancha y borde reforzado por estado.

### V3.57 - Hinchadas, estadios y entradas
- Integración de hinchas y estadios desde JSON.
- Precio de entradas editable entre $10 y $500.
- Reserva visitante mínima de 7% a 10%.
- Visitante puede ocupar hasta 50% si el local no llena.
- Bonus oculto de localía por diferencia de hinchadas.
- Hinchas suben o bajan por resultado, tabla y precio de entradas.
- Recaudación por entradas limitada por capacidad del estadio.

### V3.56 - Mercado, bots y transferibles
- Casilla Poner transferible en ficha del jugador.
- Etiqueta EN VENTA junto al nombre.
- Bots pueden ofertar por jugadores del manager y despedir sobrantes.
- Protección de estrellas ante ofertas demasiado bajas.
- Botones de mercado revisados en ficha individual.

### V3.55 - Presupuesto para fichajes
- Presupuesto autorizado para fichajes separado de la caja general.
- Máximo absoluto de 50% del presupuesto total.
- Desbloqueos por rendimiento, ascenso, campeonato y ventas.

### V3.54 - Fix mensajes y residencias
- Textos de Mensajes adaptados a pantalla oscura.
- Residencias de Academia corregidas: cada una suma +20 cupos.

### V3.53 - Estados individuales
- 5 estados por jugador: muy defensivo, defensivo, normal, ofensivo, muy ofensivo.
- Bonus/penalizaciones simples en ataque y defensa.

### V3.52 - Mensajes visuales
- Rediseño visual del menú Mensajes como bandeja de entrada.

### V3.51 - Confianza y residencias
- Progreso del objetivo pasa a Confianza de la directiva.
- Evaluación congelada al inicio de temporada.
- Cupos de juveniles con residencias alquilables.

### V3.50 - Objetivo por división
- Objetivo automático: 3ª 0.9, 2ª 1.1, 1ª 1.4.
- Evaluación inicial a 5 partidos.
- Prórroga por promedio general histórico.

### V3.49 - Pizarra y roles
- DFC y MC más compactos en pizarra.
- Generación de MI y MD para mediocampistas.

### V3.48 - Pizarra de formaciones
- 10 formaciones principales.
- Roles exactos por formación.
- Penalización: exacto 0%, compatible 25%, fuera de zona 50%.

### V3.47 - Objetivo y Game Over
- Objetivo de puntos por partido y evaluación de continuidad.
- Game Over con estadísticas generales.

### V3.46 - Ofertas y estadísticas AFA
- Ofertas automáticas basadas en estadísticas.
- No hay ofertas por jugadores sin partidos ni producción ofensiva.
- Tope de oferta al 15% de cláusula.
- Impuesto AFA del 30% en ventas.

### V3.45 - Errores por jugador
- Riesgo de error basado en moral, físico, media y cohesión.
- Errores de gol atribuidos en goles rivales.
- Ficha del jugador separa lesiones, expulsiones, errores y amarillas.

### V3.44 - Estrellas de referencia
- Hasta 3 estrellas por equipo.
- Estrellas por goles, asistencias o tapadas clave.
- Bonus de referencia en el simulador.

### V3.43 - Simulador jugadorista
- 70% colectivo y 30% individual.
- Rematador, defensor y arquero involucrados en ocasiones.
- Tapadas clave, errores y errores de gol.

### V3.42 - Lesiones raras y largas
- Probabilidad de lesión reducida.
- Lesiones graves pueden durar hasta 400 días.

### V3.41 - Academia JSON base
- Visor circular de habilidades reveladas.
- JSON base para estadios, hinchas e instalaciones.

### V3.40 - Config actualizado
- Cooldowns y valores de cohesión ajustados.
- Equilibrio de bots en dificultad difícil.

### V3.39 - Equilibrio de bots
- Bots nivelan moral, físico y cohesión para sostener dificultad.
- Desarrollo moderado de plantel bot.

### V3.38 - Cartas activas visibles
- Las cartas activadas quedan visibles en Bonus activo.

### V3.37 - Descuento sobres
- Correcciones de descuento de puntos al comprar sobres.

### V3.36 - Bloqueo de cartas
- Bloqueo aplicado luego de activar carta.

### V3.35 - Fix arranque
- Corrección de error de arranque por uso temprano de `clamp()`.

### V3.34 - Fix sobres reserva
- Correcciones de cartas en reserva e inventario.

### V3.33 - Juvenil excepcional
- Una vez por temporada puede llegar juvenil excepcional de 16 años.

### V3.32 - Fix reserva / sobres lentos
- Apertura de sobres y reserva más estable.

### V3.31 - Fix sobres y cartas
- Correcciones del sistema ESPECIAL.

### V3.30 - Petitorio Federación
- Acción narrativa para exigir condiciones mínimas de campos bots.

### V3.29 - Menú lateral ordenado
- Reordenamiento del menú lateral.

### V3.28 - Sistema ESPECIAL
- Puntos ocultos, sobres, cartas, bonus activos, destrucción e inventario.

### V3.27 - Avance día / próximo partido
- Botones separados para avanzar día o ir al próximo partido.

### V3.26 - Auditoría de campos bots
- Reparación automática de campos bots inválidos.

### V3.25 - Fix lesiones de temporada
- Corrección del arrastre excesivo de lesiones al cambiar temporada.

### V3.24 - Eventos condicionales
- Eventos por lesiones visitantes y apoyo de hinchas con moral baja.

### V3.23 - Campos bots y próximo compromiso
- Campo del estadio visible en próximo compromiso.
- Campos bots fijos por temporada.

### V3.22 - Tratar todos
- Botón de kinesiólogo para tratar todos los lesionados.

### V3.21 - Cohesión ajustada
- Más ganancia de cohesión por partido y menos castigo por cambios.

### V3.20 - Entrenamiento individual
- 5º entrenamiento individual diario por jugador.

## Nota de entrega

Por defecto, las próximas entregas son parches con sólo los archivos modificados. Pedir **versión completa** para recibir todo el proyecto.
