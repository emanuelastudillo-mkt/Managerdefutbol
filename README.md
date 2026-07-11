# Fútbol Manager MVP - V6.23

## Estado de la versión

Esta versión toma como base la **V6.22**. La documentación se mantiene unificada en este `README.md`: no se entregan archivos separados de revisión, versión o características.

La versión vigente se identifica desde:

- `README.md`
- `config.js`
- `index.html`




## V6.23 - Prestigio propio por slot

- El **prestigio del manager deja de compartirse entre slots/carreras**.
- Al crear una nueva carrera, la selección de clubes vuelve a usar el prestigio propio de ese slot, no el perfil global.
- Al cargar una carrera vieja, el perfil global ya no pisa `managerStats` ni altera el prestigio acumulado de esa partida.
- Se mantienen compartidos los puntos de habilidad y las cartas globales/activas.
- La pantalla de estadísticas aclara que el prestigio es propio de la carrera actual.

## V6.22 - Hinchas base en clubes disponibles y ranking JSON estable

- En las tarjetas de **Clubes disponibles** se muestra el valor base de hinchas del club, tomado de la base de hinchadas aplicada al seed.
- Corregido el caso donde esas tarjetas mostraban `0 hinchas` antes de iniciar o al quedar sin club.
- Ajustado el envío de **Subir carrera** para priorizar JSON plano estable hacia Cloudflare Worker + D1 y evitar caer en formatos form legacy que podían devolver `JSON inválido`.
- El payload de ranking ahora se sanitiza antes de enviarse y mantiene alias de compatibilidad para versiones previas del backend.

## V6.21 - Perfil global del manager y cartas activas compartidas

### Cambios principales

- El perfil del manager se comparte entre partidas locales.
- Se comparten entre slots:
  - puntos de experiencia;
  - puntos de habilidad;
  - carrera laboral / historial de clubes;
  - estadísticas acumuladas y logros del manager.
- Desde V6.23, el prestigio ya no se toma del perfil global: cada slot conserva su propio acceso a clubes.
- Al cargar una partida vieja, se sincronizan elementos globales sin pisar la temporada actual ni el prestigio propio de ese slot.
- Al guardar, el perfil global se actualiza con el progreso actual del manager.
- Las cartas activas dejan de estar limitadas al slot donde se activaron.
- Una carta activada aparece como activa en el resto de partidas y mantiene usos compartidos.
- Si una carta activa se consume, se desactiva o se destruye, ese estado se refleja en todos los slots.
- Las cartas de reserva siguen compartidas como inventario global.

## V6.20 - Táctica, sponsors y reputación de manager

### Cambios principales

- En **Táctica**, la lista de titulares agrega columna **Rol** para mostrar el rol natural del jugador.
- En la columna **Edad** de Táctica se muestra sólo el número, sin el texto `años`.
- La columna **Estado** fue renombrada como **Rendimiento** y ahora usa un visor circular como Físico y Moral.
- El rendimiento táctico muestra **100%** si el jugador está en su rol exacto, **75%** si juega en una posición compatible y **50%** si está fuera de zona natural.
- El sistema de sponsors ahora trabaja con **32 lugares comerciales**.
- Todos los clubes tienen **8 lugares base** habilitados: 5 de equipación y 3 de estadio.
- El resto de lugares aparece bloqueado en gris con la etiqueta de ampliación de estadio.
- La generación de ofertas de sponsors sólo usa lugares habilitados y no ocupados.
- En la barra superior se agregó el switch textual **Recibir mensajes de tu ayudante / No recibir mensajes del ayudante**.
- Si el switch está desactivado, no se generan nuevos consejos del asistente.
- La probabilidad de fichar jugadores suma linealmente el prestigio del manager. Ejemplo: base 4% + 20 de prestigio = 24%.
- Los mensajes de rechazo del jugador cambian según relación entre prestigio del manager, prestigio del club y nivel del jugador.

## V6.19 - Sponsors por división y pagos por duración

### Cambios principales

- Se redujeron los multiplicadores de valor por división en sponsors:
  - Primera: de `x10` a `x3`.
  - Segunda: de `x4` a `x1.5`.
  - Tercera: se mantiene en `x1`.
- La duración de nuevas ofertas de sponsors ahora va de **30 a 700 días**.
- El tipo de pago ya no se sortea al azar: depende de la duración del contrato.
- Contratos de **30 a 60 días**: pagan el **100% al firmar**.
- Contratos de **61 a 200 días**: pagan **20% al firmar** y el resto se cobra por día.
- Contratos de **201 a 700 días**: no pagan anticipo; se cobran sólo por día.
- Se corrigió la columna **Cobrado** de sponsors activos para mostrar sólo lo realmente cobrado hasta la fecha.
- `sponsors.factorValorBase` se mantiene en `0.1`.

## V6.18 - Presupuesto inicial por prestigio extremo

### Cambios principales

- Se reemplazó la fórmula de presupuesto inicial de clubes por una curva exponencial basada principalmente en prestigio.
- La nueva curva usa anclas de diseño: prestigio **20 => $4.500.000**, prestigio **80 => $100.000.000** y prestigio **95 => $800.000.000**.
- El presupuesto inicial deja de multiplicarse por división para evitar que clubes de igual prestigio arranquen con cajas muy distintas.
- El parámetro interno `prizeMultiplier` se conserva por compatibilidad con datos existentes, pero ya no altera la caja inicial.
- El modo **Bancarrota, Renacer** mantiene su regla especial de inicio en **-$500.000.000**.
- El modo **Fundador** mantiene su regla especial de inicio en **$0**.

## V6.17 - Sin club, opciones laborales y ojeo persistente

### Cambios principales

- En Táctica se quitó el texto visual **Suplente penalizado** de las tarjetas de suplentes lesionados para liberar espacio.
- La pantalla de **Crear manager / Continuar carrera** ahora muestra un panel lateral con hasta 8 clubes disponibles según el prestigio actual del manager.
- Al renunciar o ser despedido, la pantalla **Sin club** también muestra opciones laborales disponibles.
- En estado **Sin club**, el menú lateral de **Mercado** queda bloqueado junto con Primer Equipo, Academia, Empleados, Centro de Ojeo, Estadio y Finanzas.
- Se agregó el botón **Archivo de jugadores ojeados** en la pantalla Sin club, junto a Buscar otro club, Fundar club y Guardar carrera.
- El archivo de jugadores ojeados se conserva como progreso del manager al cambiar de club.
- Al renunciar, ser despedido o firmar con otro club se borra sólo el dato de **Prob. fichaje**, porque depende del club actual.

## V6.16 - Imágenes de jugadores por nacionalidad

### Cambios principales

- La imagen genérica de jugadores deja de elegirse por región/FACES.
- Ahora cada jugador usa una imagen base según su nacionalidad.
- La ruta esperada es `img/jugadores/nacionalidades/<nacionalidad-en-slug>.webp`.
- Ejemplos: `argentina.webp`, `brasil.webp`, `espana.webp`, `paises-bajos.webp`, `corea-del-sur.webp`, `estados-unidos.webp`.
- Si no existe `.webp`, el juego intenta `.png`, `.jpg` y `.jpeg`.
- Si no existe imagen para esa nacionalidad, intenta `img/jugadores/nacionalidades/generico.webp` y sus variantes.
- Las fotos manuales explícitas en datos de jugadores siguen funcionando como prioridad; si fallan, caen a la imagen por nacionalidad.

## V6.15 - Ajustes de interfaz, sponsors y mercado

### Cambios principales

- La información de lesionados en plantel/táctica ahora muestra sólo el diagnóstico, por ejemplo **Desgarro**, sin el prefijo `Lesionado:` ni la nota de banco con penalización.
- Se amplió de forma importante la variedad de nombres y apellidos usados por la generación de jugadores y juveniles.
- Al ser despedido por la directiva o renunciar, la pantalla **Sin club** funciona como Inicio de carrera: permite navegar por el menú lateral para consultar calendario, tabla, estadísticas, tus estadísticas y ranking online.
- Mientras el manager está sin club, quedan bloqueadas las áreas operativas: Primer Equipo, Academia, Empleados, Centro de Ojeo, Estadio y Finanzas.
- Los botones de verificación, desbloqueo y reset fueron movidos dentro del desplegable **Si tienes problemas ingresa aquí**.
- Los ingresos de sponsors nuevos bajan al 10% del valor anterior mediante `sponsors.factorValorBase = 0.1`.
- Las ofertas normales por jugadores propios duplican el porcentaje previo ofrecido sobre la cláusula. Las ofertas de cláusula completa mantienen su lógica separada.
- La directiva bloquea la venta de estrellas si una oferta normal no llega al 60% de su cláusula.

## V6.14 - Tarjetas del simulador vivo alineadas con simulación rápida

### Cambios principales

- El simulador vivo mantiene el mismo `multiplicadorTarjetas` global, pero ahora usa la misma escala base de amarillas que la simulación rápida.
- Se reemplazó la escala interna más agresiva del vivo para que, ante una cantidad similar de faltas, genere una cantidad de tarjetas más cercana a la simulación rápida.
- No se modificó el valor activo de balance: `balance-modificadores.js` sigue pisando el valor base de `config.js`.
- Las instrucciones y estilos que reducen o aumentan tarjetas siguen funcionando sobre el multiplicador final.

## V6.13 - Media visible en simulador vivo

### Cambios principales

- La columna **MED** del simulador vivo ahora muestra la misma media visible que la vista de Plantel.
- `player.overall` se mantiene intacto y oculto como valor interno del jugador.
- La lógica de rendimiento, calificaciones y motor de partido no cambia: sólo se unifica el valor mostrado al usuario.
- La pizarra táctica del simulador también usa la media visible en su resumen corto del jugador.

## V6.12 - Pesos de goleadores por posición

### Cambios principales

- Ajustada la selección de autores de gol en el simulador vivo y en la simulación rápida.
- En jugada normal se aplican pesos posicionales más marcados: **DC** como referencia principal; **ED/EI**, **MCO**, **MC**, **MD/MI**, **MCD** y defensores bajan de forma progresiva.
- En pelota parada se aplican pesos específicos: **DC** sigue como referencia, pero **DFC**, laterales y mediocampistas ganan más participación relativa.
- Los arqueros siguen con participación casi nula como autores de gol.
- Estos pesos no eliminan el impacto de habilidades: remate, cabezazo, posicionamiento, serenidad, moral, referencias de estrella e instrucciones siguen influyendo.

## Base acumulada reciente

### V6.02 - División de jugadores

- `data/jugadores.json` pasó a funcionar como manifest liviano.
- La base de jugadores se dividió en chunks dentro de `data/jugadores/`.
- La carga acepta manifest, chunks y estructuras anteriores para mantener compatibilidad.

### V6.03 - Dificultad competitiva

- Adaptación rival si se repite muchas veces la misma formación, mentalidad e instrucciones.
- Riesgo alto de lesión larga por sobreuso en jugadores con participación excesiva.
- Pérdida progresiva de moral en jugadores disponibles que pasan muchos partidos sin jugar.

### V6.04 - Ojeo, avance automático y ranking de carrera

- El Centro de Ojeo incorporó probabilidad de fichaje como información de mercado.
- El avance automático pasó a tener bloque propio con switch visual ON/OFF.
- El ranking online empezó a subir la carrera completa del mánager, sin duplicar partidas.

### V6.05 - Limpieza ranking legacy

- Se eliminó `apps-script-ranking.gs` de la versión completa.
- El ranking queda asociado a Cloudflare Worker + D1.

### V6.06 - Ayuda de interfaz

- Se agregó botón superior **Ayuda** junto a Guardar, Cargar y Renunciar.
- La ayuda explica los menús laterales por importancia y jerarquía.
- También resume funciones principales sin exponer fórmulas o valores internos exactos.

### V6.07 - Probabilidad de fichaje como dato de ojeo

- La probabilidad de ser fichado dejó de mostrarse automáticamente.
- Ahora funciona como dato revelable por el Centro de Ojeo.
- En Mercado, donde antes aparecía `Interés oculto`, ahora se muestra `Prob. fichaje` sólo si ese dato fue revelado.
- Los informes guardados también respetan si el dato está descubierto u oculto.

### V6.08 - Documentación unificada en README

- Se eliminaron de la versión completa los archivos documentales separados de revisión, versión y características.
- El historial relevante queda resumido dentro de este README.
- Las validaciones y notas técnicas de cada entrega se informan en este mismo archivo.

### V6.09 - Modo Bancarrota, Renacer

- Se agregó el modo **Bancarrota, Renacer - Libre**.
- Desde el alta de una carrera nueva se puede abrir este modo como variante de inicio libre en crisis.
- El club elegido arranca con deuda extrema, estadio sin capacidad disponible, menos hinchas, menor prestigio, plantel reducido y academia juvenil de emergencia.



### V6.10 - Ajustes del Modo Bancarrota

- El modo **Bancarrota, Renacer - Libre** quedó definido como modo libre en bancarrota, no como modo difícil separado.
- Permite elegir cualquier club disponible en la base, sin bloqueo por prestigio del mánager.
- El club elegido inicia con caja negativa, estadio sin capacidad disponible, prestigio reducido, hinchas reducidos, plantel profesional reducido y academia juvenil de emergencia.
- La primera temporada tiene objetivo fijo: **no descender**.
- El campo de juego inicial queda al **100%**.

### V6.11 - Sponsors, Home e instrucciones extremas

- El sponsor especial muestra el monto exacto del bono que pagará si se cumple el objetivo.
- En Inicio se reemplazó el segundo bloque de **Próximo partido** por una vista compacta de la tabla de posiciones.
- El simulador vivo incorporó el orden de instrucciones extremas y el botón **Avance automático**.
- Se centró el botón **Cerrar y guardar**.

## Archivos modificados en V6.23

- `index.html`
- `config.js`
- `README.md`
- `js/game/05-state-season.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/13-ranking-online.js`
- `js/game/15-especial.js`

## Instalación

Para instalación limpia, subir todo el contenido del ZIP completo **V6.23**.

Para actualizar desde V6.22, aplicar el ZIP incremental **V6.23** sobre la carpeta existente y forzar recarga del navegador.

Si se actualiza con incremental, los archivos documentales viejos que ya existan en la carpeta no se borran solos. La versión completa V6.23 mantiene la documentación unificada sólo en `README.md`.

## Validación V6.23

- Sintaxis JS validada con `node --check`.
- JSON de `data/` parseados correctamente.
- ZIP completo verificado sin documentos separados de revisión, versión o características.
- ZIP incremental preparado sólo con archivos necesarios para este cambio.
