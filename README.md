# Manager de Fútbol - README ordenado por versiones
## V3.84 - Parche de prueba de prestigio Chile

- Se ajustó Magallanes, el club chileno de menor prestigio, de 35 a 18.
- El club queda disponible para managers nuevos con prestigio 0.
- Se sincronizaron `data/Liga Chile.json`, `data/estadios_chile.json`, `data/hinchas_chile.json`, `data/estadios.json` y `data/hinchas.json`.
- Se ajustó su base de hinchas a 700 para sostener coherencia con el nuevo prestigio.

## V3.83 - Pantalla inicial con bienvenida y clubes disponibles

- La pantalla inicial para partidas nuevas ahora muestra una bienvenida general al juego.
- Se resumen las áreas principales: plantel, táctica, mercado, finanzas, sponsors, estadio, hinchas, academia, empleados, mensajes y sistema ESPECIAL.
- Se reemplaza el texto simple de inicio por una grilla de clubes disponibles según el prestigio actual del manager.
- Cada tarjeta de club muestra escudo, país, liga, capacidad de estadio, hinchas base y presupuesto en millones.
- La búsqueda de club también usa tarjetas enriquecidas para comparar opciones antes de firmar contrato.

## V3.82 - Ligas normalizadas y tema visual por club

- Se normalizaron todos los JSON de liga a una estructura común con `leagues > teams`.
- Cada club queda definido con `name`, `city`, `reputation`, `primaryColor` y `crestPath`.
- Esto deja preparada la base para agregar escudos nuevos en `img/escudos/` respetando la ruta declarada en cada club.
- El juego ahora aplica el color principal del club como tema visual suave del fondo y de varios componentes de interfaz.
- La ambientación conserva la estética oscura y evita saturación excesiva mediante un suavizado del color.
- Se agregan opciones en `config.js` para activar o ajustar la intensidad del tema visual por club.

## V3.81 - Ajuste de prestigio rumano para managers nuevos

- Se bajó el prestigio de 4 clubes rumanos para dejarlos en 20 o menos.
- Botoșani queda con prestigio 20.
- Voluntari queda con prestigio 19.
- Gloria Bistrița queda con prestigio 18.
- Chindia Târgoviște queda con prestigio 17.
- Estos clubes quedan disponibles para managers nuevos con prestigio 0 por la regla de clubes libres.
- Se sincronizaron `data/Liga Rumania.json`, `data/estadios_rumania.json`, `data/hinchas_rumania.json`, `data/estadios.json` y `data/hinchas.json`.

## V3.80 - Bloqueo de recontratación y taquilla por rival

- Si el manager renuncia o es despedido, ese club queda bloqueado durante 1 temporada para evitar el regreso inmediato.
- El bloqueo se aplica también si el club cumple el requisito de prestigio o está dentro del rango libre de 20 o menos.
- La búsqueda de club informa el motivo del bloqueo y hasta qué temporada dura.
- Se agrega `manager.temporadasBloqueoRecontratacion` en `config.js` para modificar la duración.
- La venta de entradas aumenta cuando el rival tiene mayor prestigio.
- El aumento se aplica sobre la demanda de público, no sobre el precio manual de la entrada.
- Se agregan parámetros configurables para el bonus de asistencia por prestigio del rival.

## V3.79 - Ligas internacionales y prestigio global

- Se agregan cinco ligas jugables nuevas de 18 equipos: Brasil, Inglaterra, España, Italia y Rumania.
- El mundo jugable pasa a 162 clubes: Argentina 54, Chile 18, Brasil 18, Inglaterra 18, España 18, Italia 18 y Rumania 18.
- Se reescala el prestigio de clubes de forma global: Real Madrid, Barcelona, Manchester City, Liverpool y otros gigantes europeos quedan como referencia superior.
- Boca, River, Flamengo, Palmeiras y otros grandes sudamericanos conservan peso alto regional, pero quedan por debajo de la élite europea.
- Se mantienen clubes de prestigio 20 o menos para que un manager nuevo con prestigio 0 pueda iniciar carrera.
- Se agregan JSON de liga, estadios e hinchadas para cada país nuevo.
- `data/estadios.json` y `data/hinchas.json` pasan a funcionar como alias globales con todos los países.
- `data/jugadores.json` se regenera con 25 jugadores por cada uno de los 162 clubes.
- `config.js` queda actualizado para cargar todos los países desde `data.leagueUrls`, `data.estadiosUrls` y `data.hinchasUrls`.

## V3.78 - Ligas Argentina/Chile reestructuradas a 18 clubes

- Argentina queda con tres divisiones jugables de 18 equipos: Liga Profesional, Primera Nacional y Federal A.
- Chile queda con una Primera División de 18 equipos.
- Se eliminaron de Argentina: Deportivo Rincón, San Martín de Formosa, Atenas Río Cuarto, Sarmiento La Banda, Ituzaingó y Ciudad de Bolívar.
- Se eliminaron de Chile: Universidad de Concepción y Deportes Concepción.
- Se sincronizaron `data/Liga Argentina.json`, `data/Liga Chile.json`, estadios e hinchadas.
- `jugadores.json` fue remapeado para evitar `clubId` desalineados después de reducir la cantidad de clubes.
- El calendario ida y vuelta ahora queda coherente con 18 clubes por división: 34 fechas.

## V3.77 - Elegibilidad de clubes por prestigio corregida

- El manager nuevo inicia con prestigio 0 real.
- Los clubes con prestigio 20 o menos quedan libres para cualquier manager.
- Desde prestigio 21 en adelante, el club exige que el prestigio del manager sea igual o superior al prestigio del club.
- Se evita cualquier lectura visual o lógica que sume el umbral libre de 20 al prestigio real del manager.
- Se agregaron `manager.prestigioInicial` y `manager.prestigioClubLibreMinimo` a `config.js` para editar la regla desde configuración.

## V3.75 - Ligas simultáneas Argentina + Chile

- El loader ahora combina todos los archivos válidos de `data.leagueUrls`.
- `Buscar club` permite filtrar por país, liga y equipo.
- Argentina y Chile aparecen en el mismo mundo de partida.
- Se agregan listas múltiples para estadios e hinchas: `data.estadiosUrls` y `data.hinchasUrls`.
- Los clubes ahora conservan país propio para filtros y futuros sistemas internacionales.
- Los jugadores generados de ligas sin base de datos propia se conservan.

## V3.74 - JSON Argentina/Chile

- Los archivos base de Argentina pasan a llamarse `estadios_argentina.json` y `hinchas_argentina.json`.
- La configuración por defecto ahora usa esos archivos argentinos renombrados.
- Se agregó `data/Liga Chile.json` con una liga jugable chilena de 20 clubes importantes.
- Se agregaron `data/estadios_chile.json` y `data/hinchas_chile.json`.
- Se agregó `data.leagueUrls` para facilitar cambios futuros de país/liga base desde `config.js`.


## V3.73 - Academia, lesiones juveniles y entrenamiento x3

- Los preparadores de juveniles revelan el triple de habilidades por consulta.
- Se agregó una pequeña animación visual al recibir informes juveniles.
- Los juveniles pueden lesionarse entre 1 y 2 veces por temporada.
- Mientras están lesionados no entrenan habilidades.
- Se puede tratar una lesión juvenil desde la tarjeta del juvenil en Academia.
- Se triplicó la velocidad de entrenamiento de habilidades de jugadores profesionales.

# Manager Fútbol - README

## Versión actual: V3.84

Juego de manager de fútbol en HTML/JS local con simulación de partidos, economía, mercado, academia, estadio, hinchadas, carrera del manager y sistema ESPECIAL.

## Historial de actualizaciones

### V3.72 - Cambio de club sin reinicio y juvenil excepcional x20
- Se corrigieron textos del flujo de cambio de club para evitar referencias a nueva partida.
- Al estar sin cargo, el botón pasa a indicar continuidad de carrera y firma de contrato.
- Firmar con otro club mantiene la misma partida, calendario, mundo e historial del manager.
- Se agregó `academia.multiplicadorEntrenamientoJuvenilExcepcional: 20`.
- El juvenil excepcional entrena x20; los juveniles normales conservan el multiplicador general de academia.

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
- Clubes de prestigio 20 o menos siguen aceptando cualquier manager.

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
