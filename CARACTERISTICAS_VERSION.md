# Características de la versión V5.10

## Simulación viva minuto a minuto

- El partido propio se resuelve en 90 fases de 1 minuto.
- Las decisiones del manager afectan los minutos siguientes, no un resultado precalculado.
- Se agregan estadísticas en vivo, relato principal y eventos recientes durante el desarrollo.
- La interfaz se compacta para pantallas horizontales y reduce espacios verticales.

## Archivos modificados

- `simulador-2.0.js`
- `js/game/17-live-match.js`
- `style.css`
- `index.html`
- `config.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`


---

# Características de versión

## V5.09 - Simulación viva también en amistosos

- Se corrige el caso que seguía mostrando el simulador anterior al iniciar una partida nueva: los amistosos de pretemporada no estaban conectados al motor vivo.
- Los amistosos propios pasan a usar bloques de 15 minutos, pausa, cambios manuales e instrucciones de campo.
- El avance de pretemporada queda detenido hasta cerrar y guardar el resultado del amistoso vivo.
- Si el motor vivo no está cargado, el partido no se simula con el sistema viejo y se muestra un diagnóstico.
- Los amistosos conservan su regla anterior: no dejan lesiones ni sanciones persistentes.
- Se refuerza el ZIP incremental incluyendo los archivos completos del motor vivo y sus estilos.

## V5.07 - Simulación viva por bloques

- Los partidos propios oficiales ahora pueden abrirse en una simulación viva por bloques de 15 minutos.
- El resultado no se calcula completo al inicio: cada tramo se resuelve después de confirmar cambios e instrucciones.
- El manager puede pausar, simular el siguiente bloque, hacer hasta 3 cambios manuales y dar instrucciones de campo.
- Las instrucciones disponibles son `Todos al ataque`, `PONGAN HUEVO!!!`, `Cuidar el resultado` y `Todos a defender`.
- Se muestran los 11 jugadores de ambos equipos con apellido, media, rol, físico y moral.
- Los eventos del partido se agregan progresivamente para evitar spoilers y permitir intervención real.

## V5.06 - Academia con crecimiento cualitativo

- El crecimiento de juveniles en Academia deja de mostrarse como número exacto `actual/límite`.
- Se usan cuatro niveles legibles: `Bajo`, `Normal`, `Muy bueno` y `Excelente`.
- La etiqueta del bloque cambia de `Crecimiento de media esta temporada` a `Crecimiento esta temporada`.
- Se agrega una barra aproximada para que el estado sea visual sin exponer valores tan exactos.

## V5.05 - Ojeo diario corregido en todos los avances

- El proceso diario del Centro de Ojeo ya no depende únicamente de avanzar días vacíos.
- Ahora se ejecuta en días de partido, pretemporada y postemporada.
- El ojeo de jugadores propios prioriza explícitamente las tres ocultas.
- La interfaz del Centro de Ojeo muestra el último procesamiento diario y sus revelaciones.

# Características V5.04 - Intransferibles y ojeo como única fuente

## Cambios

- Se agrega en la ficha del jugador propio la casilla `Intransferible`.
- Un jugador intransferible deja de figurar como transferible y sólo puede recibir ofertas por cláusula completa.
- Las ofertas pendientes inferiores a la cláusula se rechazan automáticamente al marcar al jugador como intransferible.
- Si una partida vieja trae una oferta inferior pendiente, al intentar aceptarla se bloquea y queda marcada como rechazada por intransferible.
- Las ofertas automáticas normales y de fin de temporada ya no seleccionan jugadores intransferibles.
- Las ofertas especiales de cláusula completa siguen existiendo.
- La ficha del jugador muestra una tarjeta `OJEADO POR TU EQUIPO` debajo del gráfico cuando hay habilidades ocultas reveladas.
- Esa tarjeta muestra `Agresividad`, `Genética` y `Factor sorpresa` según lo revelado por el Centro de Ojeo.
- Se elimina el scouting provisorio anterior: abrir fichas de jugadores, clubes o listados ya no revela habilidades externas por semana.
- Para jugadores externos, la única información visible es la guardada en informes del Centro de Ojeo.
- El radar de jugadores externos queda oculto hasta completar el informe de habilidades visibles.

## Motivo

V5.04 separa de forma más clara la información propia de la información investigada. El jugador puede ver su plantel, pero los rivales y libres sólo muestran datos obtenidos por ojeo real. Además, la casilla `Intransferible` permite proteger jugadores importantes sin perder la posibilidad de ventas por cláusula completa.
