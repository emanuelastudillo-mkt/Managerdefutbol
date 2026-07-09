# Características de versión

## V5.08 - Corrección de conexión de simulación viva

- Se corrige el fallback silencioso que podía mandar el partido propio al simulador anterior si el módulo vivo no cargaba.
- Si falta `js/game/17-live-match.js` o el archivo `simulador-2.0.js` no trae el motor por bloques, el partido no se simula con el sistema viejo.
- Se muestra un aviso de diagnóstico para saber qué archivo no cargó o quedó desactualizado.
- Se reordena `index.html` para cargar el módulo de simulación viva antes del calendario y avance de partidos.
- El objetivo es que V5.07/V5.08 no parezca implementada sólo por versión visible: el flujo real debe entrar al partido vivo o avisar el motivo exacto.

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
