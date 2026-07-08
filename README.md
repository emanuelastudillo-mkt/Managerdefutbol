# Fútbol Manager MVP

**Versión actual:** V3.64  
**Tipo de proyecto:** juego local HTML/JS de manager de fútbol.  
**Uso:** abrir `index.html` en navegador o subir la carpeta completa a GitHub Pages.

---

## Entregas del proyecto

Desde V3.59, salvo pedido explícito de **versión completa**, los ZIP se entregan como **parches** con sólo los archivos modificados.

Para aplicar un parche:

1. Descomprimir la última versión completa del juego.
2. Descomprimir el parche encima de esa carpeta.
3. Aceptar reemplazar archivos.
4. Abrir `index.html`.

---

# Historial de actualizaciones

## V3.64 - Relato mejorado del simulador

- El visor progresivo del partido ahora usa **60 fases**.
- Se agregó un bloque grande de **Relato de partido** para jugadas destacadas.
- La lista de eventos del partido se mantiene como antes.
- El relato puede anticipar jugadas antes de mostrar la acción final.
- Se agregó `data/relatos_partido.json` con frases estilo relator argentino para goles, tarjetas, tapadas, errores, lesiones, cambios y momentos sin evento.

---

## V3.63 - Prestigio real del manager y renuncia

- El prestigio del manager ahora se calcula por suma real.
- La experiencia suma prestigio con conversión: **experiencia × 0.001**.
- Cada 10 partidos ganados suma **+1 prestigio**.
- Cumplir el objetivo del club suma **+5 prestigio**.
- Salir campeón suma prestigio según división:
  - Primera: **+20**.
  - Segunda: **+10**.
  - Tercera: **+5**.
- Ser despedido resta **-2 prestigio**.
- Descender o terminar último resta prestigio según división:
  - Primera: **-10**.
  - Segunda: **-10**.
  - Tercera: **-5**.
- El visor de prestigio ya no suma los 20 puntos artificiales usados para clubes chicos.
- Los clubes con prestigio menor a 20 siguen aceptando cualquier manager.
- Se agregó el botón **Renunciar al club**.

---

## V3.62 - Mejor condición física ajustado

- El botón **Mejor condición física** ahora prioriza jugadores con condición **75 o más**.
- Dentro de esa prioridad, intenta reducir penalizaciones tácticas.
- Orden de preferencia:
  - rol exacto;
  - rol compatible;
  - fuera de zona.
- Si no hay suficientes jugadores con +75 de condición, completa el once con los mejores disponibles cuidando condición, posición, moral y media.

---

## V3.61 - Finanzas y recaudación

- En el simulador ahora aparece **Recaudación de entradas**.
- En el resumen del último avance también aparece la recaudación si el club jugó de local.
- Finanzas ahora tiene:
  - gastos por categoría;
  - bloques desplegables/minimizables;
  - totales por categoría;
  - movimientos internos dentro de cada categoría.
- También se agregaron ingresos por categoría para entradas, sponsors, ventas y eventos.

---

## V3.60 - Ofertas con jugador clickeable

- En Mensajes, las ofertas muestran el nombre del jugador como enlace clickeable.
- También es clickeable el título del mensaje tipo **Oferta por X**.
- Al hacer click se abre la ficha individual del jugador para revisar datos antes de aceptar o rechazar.

---

## V3.59 - Carrera, prestigio y despido sin reinicio

- El despido ya no reinicia la partida completa.
- El manager puede buscar otro club y continuar su carrera.
- El club anterior pasa a ser bot.
- El mundo de la partida sigue avanzando.
- Se agregó **prestigio de manager**.
- Se agregaron **puntos de experiencia**.
- Los clubes aparecen como disponibles o no disponibles según prestigio.
- Los clubes con menos de 20 de prestigio aceptan cualquier manager.
- El prestigio de clubes cambia al final de cada temporada.
- El botón lateral **Nueva partida** pasó a llamarse **Buscar club**.
- “Tus estadísticas” muestra prestigio, experiencia e historial laboral.
- El menú Mensajes fue compactado.
- El menú **ESPECIAL** tiene color destacado.
- Guardar/Cargar quedan arriba en formato más chico.
- Reset se movió abajo del menú lateral, en rojo y con advertencia previa.

---

## V3.58 - Flechas tácticas visibles

- Se corrigió la referencia visual de los estados individuales en pizarra.
- Ahora se ven marcas grandes dentro del círculo del jugador:
  - **←←** Muy defensivo.
  - **←** Defensivo.
  - **•** Normal.
  - **→** Ofensivo.
  - **→→** Muy ofensivo.
- Se agregó una leyenda debajo de la cancha.
- El borde del círculo se refuerza visualmente según el estado.

---

## V3.57 - Hinchadas, estadios y entradas

- Integración de `data/hinchas.json`.
- Integración de `data/estadios.json`.
- Cada club tiene hinchas actuales y capacidad de estadio.
- Precio de entrada editable desde **Estadio**, entre **$10 y $500**.
- El club local debe entregar entre **7% y 10%** de la capacidad al visitante.
- Si el local no llena el estadio, el visitante puede ocupar más lugares hasta un máximo de **50%**.
- La diferencia de hinchadas genera un bonus oculto de localía durante el partido.
- El bonus afecta sólo durante el partido:
  - moral;
  - estado físico;
  - cohesión.
- Se recalculan hinchas después de cada fecha.
- Ganar suma **0,1%** de la base.
- Perder resta **0,5%** de hinchas actuales.
- La posición en tabla suma o resta hinchas.
- El precio de entradas modifica el crecimiento o caída de hinchas.
- La recaudación se calcula por asistentes reales, limitada por capacidad del estadio.

---

## V3.56 - Mercado bot y transferibles

- Llegan mejores ofertas por jugadores jóvenes, con rendimiento o estrellas del equipo.
- Los jugadores marcados como transferibles reciben ofertas con más probabilidad.
- Si una oferta por una estrella no supera el 40% de la cláusula, la directiva puede bloquear la venta.
- Se agregó la casilla **Poner transferible** en la ficha del jugador propio.
- Los jugadores transferibles muestran etiqueta **EN VENTA** junto al nombre.
- Los bots pueden enviar ofertas por jugadores del manager.
- Los bots pueden despedir jugadores sobrantes sin romper su estructura mínima.
- La ficha individual muestra:
  - botón **Contratar** en jugadores libres;
  - botón **Hacer oferta** en jugadores contratados;
  - acciones de mercado más claras.

---

## V3.55 - Presupuesto autorizado para fichajes

- Se separó el presupuesto total del club del presupuesto autorizado para fichajes.
- Máximo absoluto autorizado para fichajes: **50% del presupuesto total**.
- El resto del dinero sigue disponible para sueldos, empleados, academia, residencias, estadio, tratamientos y gastos generales.
- Base inicial por división:
  - 3ª división: **25%**.
  - 2ª división: **35%**.
  - 1ª división: **40%**.
- Desbloqueos:
  - superar objetivo de puntos: **+5%**;
  - promedio temporada mayor a 1,5: **+5%**;
  - promedio temporada mayor a 1,9: **+10%**;
  - ascender: **+10%** para la siguiente temporada;
  - salir campeón: **+15%** para la siguiente temporada;
  - vender jugador: libera parte del ingreso neto para fichajes.
- Mercado, Finanzas y modal de compra muestran el presupuesto de fichajes.
- Las ofertas de compra se bloquean si superan el presupuesto autorizado, aunque el club tenga caja total suficiente.

---

## V3.54 - Fix Mensajes y Residencias

- Mensajes vuelve a usar textos claros sobre pantalla oscura.
- Se corrigió el alquiler de residencias en Academia.
- Al alquilar residencia:
  - descuenta dinero;
  - suma +1 residencia;
  - aumenta el cupo en +20;
  - actualiza la pantalla.
- Se agregaron métricas visibles:
  - residencias alquiladas;
  - cupo total;
  - cupos libres.

---

## V3.53 - Estados individuales en pizarra

- Se agregaron 5 estados individuales por titular:
  - Muy defensivo.
  - Defensivo.
  - Normal.
  - Ofensivo.
  - Muy ofensivo.
- Se cambian haciendo click sobre el círculo del jugador en la pizarra.
- Los estados ofensivos aumentan chances de asistir o hacer gol.
- Los estados defensivos aumentan chances de defender, evitar gol o sumar tapadas.
- Cada bonus tiene penalización opuesta.
- Migración automática de valores viejos:
  - `posicional` → `normal`.
  - `ataque` → `ofensivo`.
  - `defensiva` → `defensivo`.

---

## V3.52 - Mensajes visuales

- Se rediseñó el menú **Mensajes** para lectura más rápida.
- Se agregó estilo tipo bandeja de entrada.
- Se agregaron indicadores visuales de tipo, prioridad y fecha.
- Se agregó resumen superior con total, nuevos, ofertas pendientes e importantes.

---

## V3.51 - Confianza de directiva y residencias de Academia

- “Progreso del objetivo” pasó a mostrarse como **Confianza de la directiva**.
- Texto actualizado: “Se evaluará tu continuidad en los próximos X partidos.”
- La cantidad de partidos de evaluación se congela al inicio de cada temporada.
- Los partidos extra por promedio general histórico se calculan sólo al iniciar temporada.
- Cupo base de Academia: **10 juveniles**.
- Se agregó botón **Alquilar residencias**.
- Cada residencia suma **20 cupos**.
- Costo mensual por residencia: **$560.000**.
- Se agregó botón **Cancelar alquiler de 1 residencia**.
- Si no hay cupos disponibles, se bloquea **Hacer captación de talentos**.
- Si llega una captación sin cupo, los juveniles se pierden por falta de lugar.
- Nuevo visor principal: promedio de habilidades visibles de juveniles.

---

## V3.50 - Objetivo por división y prórroga

- El promedio de puntos por partido de Oficina usa sólo la temporada actual.
- La evaluación inicial ahora es a los **5 partidos oficiales**.
- Objetivo automático por división:
  - 3ª división: **0,9**.
  - 2ª división: **1,1**.
  - 1ª división: **1,4**.
- Prórroga según promedio general histórico:
  - más de 1,2: +2 partidos;
  - más de 1,5: +5 partidos;
  - más de 1,9: +10 partidos.
- La barra de objetivo informa si hay partidos extra por historial.

---

## V3.49 - Ajustes de pizarra y generación de roles

- Se compactó la distribución visual de DFC para que no invadan LD/LI.
- Se compactó la distribución visual de MC para que no invadan MI/MD.
- Se ajustó la separación de DC cuando hay dos o tres delanteros.
- La generación de jugadores ahora puede crear una pequeña proporción de mediocampistas MI y MD.
- La generación inicial de planteles, generación general y agentes libres pueden producir MI y MD.

---

## V3.48 - Pizarra táctica y roles

- Se corrigió la distribución visual de las formaciones.
- Se aplicó penalización táctica por rol:
  - rol exacto: **100%**;
  - rol compatible: **75%**;
  - fuera de zona: **50%**.
- Se ordenaron 10 formaciones principales.
- La pizarra y la lista de titulares muestran el nivel de ajuste táctico.

---

## V3.47 - Objetivo y Game Over

- Se agregó objetivo opcional de puntos por partido.
- Se agregó barra de progreso.
- Si el promedio no supera el objetivo desde los 10 partidos oficiales, se dispara Game Over.
- La pantalla final muestra estadísticas generales similares al ranking online.

---

## V3.46 - Ofertas estadísticas AFA

- Ofertas automáticas por jugadores basadas en estadísticas internas.
- No llegan ofertas por jugadores sin partidos oficiales.
- No llegan ofertas por jugadores sin goles ni asistencias.
- Las ofertas no superan el 15% de la cláusula.
- Si se vende un jugador, AFA cobra 30% de impuesto.
- El club recibe 70% neto.
- Oficina del manager muestra promedio de puntos por partido.

---

## V3.45 - Errores por jugador

- La probabilidad de errores depende del jugador implicado.
- Usa moral, estado físico, media y cohesión.
- Se separan estadísticas internas:
  - partidos jugados;
  - asistencias;
  - goles;
  - lesiones;
  - expulsiones;
  - errores;
  - errores de gol;
  - amarillas.
- La ficha del jugador muestra mejor esas estadísticas.

---

## V3.44 - Estrellas de referencia

- Se agregó sistema de estrellas por rendimiento reciente.
- Cada club puede tener hasta 3 jugadores referencia.
- La estrella aparece junto al nombre.
- El jugador con estrella aumenta su peso dentro del simulador.
- Si el jugador cambia de club, pierde la estrella.
- Los bots también pueden tener jugadores estrella.

---

## V3.43 - Simulador jugadorista

- Simulador con balance **70% colectivo / 30% individual**.
- Cada ocasión importante elige protagonistas reales:
  - rematador;
  - defensor implicado;
  - arquero rival.
- Menos goles de defensores en jugadas normales.
- Defensores con más opción de gol en pelota parada.
- Nuevas estadísticas:
  - tapadas clave POR;
  - errores;
  - errores de gol.
- El visualizador progresivo muestra tapadas y errores.
- La ficha de partido agrega bloques de tapadas y errores.

---

## V3.42 - Lesiones menos frecuentes y más largas

- La probabilidad total de lesión baja un 80% con `lesiones.multiplicadorProbabilidad: 0.20`.
- El rebalanceo afecta probabilidad base, fatiga y campo.
- Las recuperaciones ahora son más largas.
- Las lesiones graves pueden llegar hasta 400 días.

---

## V3.41 - Academia JSON base

- Academia tiene visor circular para porcentaje de habilidades reveladas en juveniles.
- Se agregaron JSON base para futuras expansiones:
  - `data/estadios.json`;
  - `data/hinchas.json`;
  - `data/instalaciones.json`.
- Se agregaron rutas en `config.js`.

---

## V3.40 - Config actualizado

- Se integró el `config.js` editado por el usuario.
- Cooldown largo de avance: 60 segundos.
- Avance diario: 2 segundos.
- Ganancia de cohesión por partido: 9.
- Equilibrio de bots reforzado.
- Dificultad corregida a `dificil`.

---

## V3.39 - Equilibrio de bots

- Se agregó equilibrio competitivo para bots.
- Los bots de la división del manager ajustan moral, físico y cohesión cerca del club del usuario.
- Los mejores equipos de la temporada anterior reciben plus competitivo.
- Hay mantenimiento automático durante la temporada.
- Los planteles bots tienen progresión moderada.
- Configurable desde `config.js` en `equilibrioBots`.

---

## V3.38 - Cartas activas visibles

- Corrección del sistema ESPECIAL: al activar una carta ya no desaparece.
- La carta activada pasa al sector **Bonus activo**.
- Las cartas activas quedan visibles y bloqueadas durante 100 días.
- El bloque de regla de cartas activas muestra cartas aplicadas y días restantes.

---

## V3.37 - Destrucción de cartas y bloqueo por carta

- Destruir cartas suma puntos según rareza.
- Se muestra animación visual en el contador.
- Valores:
  - inútil: +5;
  - común: +20;
  - rara: +50;
  - legendaria: +1000.
- El bloqueo de 100 días ahora es por carta activa, no global.
- Se pueden activar hasta 5 cartas.

---

## V3.36 - Bloqueo de puntos en cartas

- Ajustes defensivos en el sistema ESPECIAL.
- Correcciones sobre activación, bloqueo y puntos de cartas.

---

## V3.35 - Fix de arranque

- Corrección bloqueante de arranque.
- Se eliminó el uso prematuro de `clamp()` en constantes de Academia.
- Nueva partida, Reset y carga inicial vuelven a funcionar.

---

## V3.34 - Fix sobres reserva

- Las cartas se guardan en reserva antes de mostrarse en animación.
- Las cartas abiertas ya no quedan atrapadas en “Cartas obtenidas”.
- Al finalizar la apertura pasan al inventario.
- Se agregó reparación automática para cartas de versiones anteriores.
- Si el guardado falla, se revierte el gasto de puntos del sobre.

---

## V3.33 - Juvenil excepcional

- En Academia, una vez por temporada puede llegar un juvenil excepcional de 16 años.
- Puede entrenarse en Academia o firmar contrato profesional.
- Configurable por edad y rango de media inicial.

---

## V3.32 - Sobres más lentos y reserva

- Corrección del pase automático de cartas abiertas hacia reserva.
- Recuperación defensiva de cartas de última apertura al activar o destruir.
- Apertura de sobres tres veces más lenta.

---

## V3.31 - Sistema ESPECIAL

- Nuevo menú lateral **ESPECIAL**.
- Sistema de puntos ocultos de habilidad para el manager.
- Sobres común, raro y épico.
- Cartas inútiles, comunes, raras, épicas y legendarias.
- Máximo de 5 cartas activas.
- Máximo de 50 cartas en reserva.
- Bloqueo de 100 días para cambiar cartas activas.
- Destrucción de cartas en reserva para recuperar puntos.
- Bonus apilables aplicados a sponsors, deterioro de campo y probabilidad legendaria.
- Archivos agregados:
  - `data/habilidades_especiales.json`;
  - `js/game/15-especial.js`.

---

## V3.30 - Menú lateral y petitorio AFA

- Reordenamiento del menú lateral.
- Ajuste de textos del bloque de campos rivales en Estadio.
- El botón de reparación de campos bots ahora aparece como petitorio a la Federación Argentina.

---

## Sistemas principales actuales

### Carrera del manager

- El manager puede ser despedido sin reiniciar el mundo.
- Puede renunciar al club.
- Puede buscar club según prestigio.
- Tiene experiencia, prestigio e historial laboral.

### Simulador

- Balance jugadorista: 70% colectivo y 30% individual.
- Eventos con protagonistas reales.
- Estados individuales tácticos por jugador.
- Relato grande de jugadas destacadas.
- 60 fases visuales.
- Estadísticas de goles, asistencias, errores, tapadas, tarjetas, lesiones y expulsiones.

### Tácticas

- Pizarra con roles exactos por formación.
- Penalización por rol exacto, compatible o fuera de zona.
- Estados individuales:
  - muy defensivo;
  - defensivo;
  - normal;
  - ofensivo;
  - muy ofensivo.

### Mercado

- Presupuesto separado para fichajes.
- Transferibles.
- Ofertas bots.
- Protección de estrellas importantes.
- Fichajes limitados por presupuesto autorizado.

### Finanzas

- Ingresos y gastos por categoría.
- Recaudación de entradas.
- Sponsors.
- Ventas de jugadores.
- Gastos de sueldos, empleados, estadio, academia y residencias.

### Academia

- Captación de juveniles.
- Residencias para aumentar cupos.
- Juvenil excepcional por temporada.
- Visor de habilidades visibles.

### Hinchadas y estadio

- Hinchas actuales por club.
- Capacidad real de estadio.
- Precio de entradas.
- Cupo visitante obligatorio.
- Bonus oculto de localía por diferencia de hinchadas.
- Evolución de hinchas por rendimiento, tabla y precio de entrada.

### ESPECIAL

- Puntos ocultos del manager.
- Sobres.
- Cartas activas.
- Bonus apilables.
- Destrucción de cartas para recuperar puntos.

---

## Uso básico

1. Abrir `index.html`.
2. Elegir o buscar club según prestigio disponible.
3. Configurar táctica y titulares.
4. Gestionar entrenamiento, mercado, academia, estadio y finanzas.
5. Avanzar días o ir directo al próximo partido.
6. Revisar mensajes, ofertas, objetivos y estadísticas del manager.

---

## Archivos destacados

```text
index.html
style.css
config.js
app.js
simulador-2.0.js
js/core/01-config-constants.js
js/core/02-ui-utils.js
js/core/03-player-tactics-utils.js
js/data/04-data-storage.js
js/game/05-state-season.js
js/game/08-sponsors-stadium-stats.js
js/game/09-simulation-economy-training.js
js/game/10-academy-employees.js
js/game/11-match-engine.js
js/game/13-ranking-online.js
js/game/14-eventos.js
js/game/15-especial.js
js/ui/06-render-home-messages.js
js/ui/07-render-team-market.js
js/ui/12-modals.js
data/Liga Argentina.json
data/jugadores.json
data/empleados.json
data/sponsors.json
data/eventos.json
data/habilidades_especiales.json
data/estadios.json
data/hinchas.json
data/instalaciones.json
data/relatos_partido.json
```
