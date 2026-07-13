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
