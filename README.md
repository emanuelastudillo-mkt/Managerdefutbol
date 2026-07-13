# Fútbol Manager MVP - V7.19


## V7.19 - Recuperación física directa de cartas

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
