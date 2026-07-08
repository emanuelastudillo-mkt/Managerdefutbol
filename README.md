# Fútbol Manager MVP

## Versión actual: V3.48

Simulador con enfoque jugadorista: 70% fuerza colectiva y 30% impacto individual.

## V3.44

- Simulador con balance 70% colectivo / 30% individual.
- Las ocasiones importantes eligen protagonistas reales: rematador, defensor y arquero.
- Menos goles de defensores en jugadas normales.
- Defensores con opción de gol más ligada a pelota parada.
- Nuevas estadísticas: Tapadas clave POR, Errores y Errores de gol.
- El visualizador progresivo de partido muestra tapadas clave y errores.
- La ficha completa del partido agrega bloques de tapadas clave y errores.
- Las fichas de jugador registran tapadas clave, errores y errores de gol.

## V3.41

- Academia: visor circular tipo torta para ver el porcentaje de habilidades reveladas en cada juvenil.
- El indicador muestra el avance de scouting de habilidades visibles.
- Nuevos JSON base vacíos para futuras expansiones:
  - `data/estadios.json`
  - `data/hinchas.json`
  - `data/instalaciones.json`
- Se agregan rutas en `config.js` para esos archivos.



## V3.39

- Equilibrio de bots para sostener la dificultad a partir de la segunda temporada.
- Los bots de tu división ajustan moral, físico y cohesión cerca de los valores de tu club.
- Los mejores equipos de la temporada anterior reciben un plus competitivo.
- Mantenimiento automático durante pretemporada y temporada regular.
- Progresión moderada de habilidades para jugadores bots.
- Configurable desde `config.js` en `equilibrioBots`.


## V3.38

- Corrección del sistema ESPECIAL: al activar una carta ya no desaparece.
- La carta activada pasa al sector **Bonus activo**.
- Las cartas activas quedan visibles y bloqueadas durante 100 días.
- El bloque **Regla de cartas activas** muestra el detalle de bonus activos, cartas aplicadas y días restantes de bloqueo.

## V3.37

- Ajuste del sistema ESPECIAL.
- Destruir cartas suma puntos según rareza y muestra animación visual en el contador.
- Carta inútil: +5 puntos.
- Carta común: +20 puntos.
- Carta rara: +50 puntos.
- Carta legendaria: +1000 puntos.
- El bloqueo de 100 días ahora es por carta activa, no un bloqueo global.
- Se pueden activar hasta 5 cartas; cada una queda fija 100 días antes de poder desactivarse.
- El bloque Bonus activos muestra el detalle de cada carta activa.

## V3.35

- Corrección bloqueante de arranque: se eliminó el uso prematuro de `clamp()` en constantes de Academia.
- Nueva partida, Reset y carga inicial vuelven a funcionar.


## V3.34

- Corrección crítica del sistema de sobres: las cartas se guardan en reserva antes de mostrarse en la animación.
- Las cartas abiertas ya no quedan atrapadas en “Cartas obtenidas”.
- Al finalizar la apertura, pasan al inventario y se pueden activar o destruir.
- Se agregó reparación automática para cartas que hubieran quedado sólo en historial por versiones anteriores.
- Si el guardado falla, se revierte el gasto de puntos del sobre.


## Cambios V3.31

- Nuevo menú lateral **ESPECIAL**.
- Sistema de puntos de habilidad ocultos para el manager.
- Sobres común, raro y épico.
- Cartas inútiles, comunes, raras, épicas y legendarias.
- Máximo de 5 cartas activas.
- Máximo de 50 cartas en reserva.
- Bloqueo de 100 días para cambiar cartas activas.
- Destrucción de cartas en reserva para recuperar puntos.
- Bonus apilables aplicados a:
  - nuevos sponsors;
  - deterioro del campo propio;
  - probabilidad de obtener cartas legendarias.

## Archivos nuevos

```text
data/habilidades_especiales.json
js/game/15-especial.js
```

## Cómo usar

Abrir `index.html` en navegador o subir el contenido a GitHub Pages. Desde el menú lateral entrar a **ESPECIAL** para abrir sobres, activar cartas, revisar bonus y destruir cartas sobrantes.


## V3.30

- Reordenamiento del menú lateral según la estructura solicitada.


## V3.30
- Ajuste de textos del bloque de campos rivales en Estadio.
- El botón de reparación ahora aparece como petitorio a la Federación Argentina.


## V3.31

- Corrección del descuento de puntos al abrir sobres.
- Cartas de última apertura activables/destruibles.
- Apertura de sobres animada carta por carta.
- Activación de cartas por botón o arrastrando al bloque de cartas activas.



## V3.33
- Academia: al iniciar una captación, una vez por temporada llega un juvenil excepcional de 16 años.
- Ese juvenil puede entrenarse en academia o firmar contrato profesional de inmediato.
- Se agregó configuración para edad y rango de media inicial del juvenil excepcional.

## V3.32

- Corrección del pase automático de cartas abiertas hacia reserva.
- Recuperación defensiva de cartas de última apertura al activar o destruir.
- Apertura de sobres tres veces más lenta.

## V3.40 - Config actualizado

Esta versión toma como configuración principal el `config.js` editado por el usuario.

Cambios destacados:
- cooldown largo de avance: 60 segundos;
- avance diario: 2 segundos;
- ganancia de cohesión por partido: 9;
- equilibrio de bots reforzado con pisos más altos;
- dificultad de bots corregida a `dificil`.



## V3.42 - Lesiones menos frecuentes

El sistema de lesiones fue rebalanceado. Ahora la probabilidad total de lesión se multiplica por `lesiones.multiplicadorProbabilidad`. Con el valor `0.20`, las lesiones bajan un 80% respecto del cálculo anterior.

A cambio, los tiempos de recuperación son más largos y configurables desde `config.js`, con lesiones graves que pueden llegar hasta 400 días.


## V3.44 - Estrellas de referencia

Se agrega un sistema de estrellas por rendimiento reciente. Cada club puede tener hasta 3 jugadores referencia. La estrella aparece junto al nombre y aumenta su peso dentro del simulador. Si el jugador cambia de club, pierde la estrella.


### V3.48 - Errores por jugador

Se ajustó el simulador para que los errores defensivos y del arquero dependan del jugador implicado, usando moral, físico, media y cohesión del equipo. También se separan mejor las estadísticas internas de lesiones, expulsiones, errores y errores de gol.


## V3.48

- Ofertas automáticas de jugadores basadas en estadísticas internas.
- Filtro de ofertas: partidos oficiales jugados y producción ofensiva mínima.
- Tope del 15% de cláusula para ofertas recibidas por jugadores.
- Impuesto AFA del 30% sobre ventas.
- Promedio de puntos por partido en Oficina del manager.


## V3.48

Agrega objetivo opcional de puntos por partido, barra de progreso y Game Over si el promedio no supera el objetivo desde los 10 partidos oficiales.


## V3.48 - Pizarra táctica y roles

Se corrigió la distribución visual de las formaciones y se agregó una penalización intermedia para jugadores fuera de su rol exacto: 100% si juega en su rol, 75% si ocupa un rol compatible y 50% si queda fuera de su zona.


## V3.49
- Ajuste visual de pizarra para DFC, MC y DC.
- Aparición de jugadores MI y MD en generación de planteles y agentes libres.


## V3.50
- Objetivo automático por división.
- Evaluación inicial a 5 partidos oficiales de temporada.
- Prórroga por promedio general histórico del manager.
- El promedio visible en oficina se calcula sobre la temporada actual.


## V3.51
- Confianza de la directiva: objetivo congelado al inicio de temporada y evaluación en los próximos partidos.
- Residencias de academia: cupo base, alquiler mensual, cancelación y pérdida de juveniles sin lugar.
- Visor de promedio de habilidades visibles juveniles.


## V3.52
- Mejora visual del menú Mensajes con estilo más claro tipo bandeja de entrada.


## V3.53
- Estados individuales de jugador en pizarra: muy defensivo, defensivo, normal, ofensivo y muy ofensivo.
- Click sobre el círculo del jugador para cambiar estado.
- Los estados influyen en ataque, asistencia, defensa y tapadas.


## V3.54
- Fix visual de Mensajes: textos claros sobre pantalla oscura.
- Fix de residencias en Academia: contador y cupos se actualizan correctamente.


## V3.55
- Nuevo presupuesto autorizado para fichajes con tope del 50% del presupuesto total.
- Base por división y desbloqueos por rendimiento, ascenso, campeonato y ventas.
- Finanzas y Mercado muestran el presupuesto disponible para fichajes.


## V3.56
- Mercado bot ampliado: ofertas por jugadores del manager, transferibles, veto de directiva para estrellas y despidos de bots.
- Ficha individual mejorada con botón Contratar en libres, Hacer oferta en contratados y casilla EN VENTA en propios.


## V3.57
- Integración completa de estadios e hinchas base.
- Hinchadas locales/visitantes con cupo visitante obligatorio y máximo del 50% si el local no llena el estadio.
- Bonus local oculto por diferencia de hinchadas durante el partido.
- Crecimiento/caída de hinchas por resultado, posición y precio de entradas.
- Precio de entradas editable en Estadio, entre $10 y $500.


## V3.58
- Corrección visual de flechas/marcadores de estados individuales en la pizarra táctica.
- Leyenda visible para muy defensivo, defensivo, normal, ofensivo y muy ofensivo.

## V3.59
- Despido sin reiniciar partida: el manager puede buscar otro club y continuar la carrera.
- Nuevo prestigio de manager y puntos de experiencia.
- Clubes disponibles/no disponibles según prestigio.
- Prestigio de clubes variable al final de cada temporada.
- Botón lateral actualizado a “Buscar club”.
- Mensajes compactos, ESPECIAL destacado y Reset movido abajo con advertencia.


## V3.60
- En Mensajes, las ofertas muestran el nombre del jugador como enlace clickeable para abrir su ficha antes de aceptar o rechazar.
- ZIP entregado como parche con sólo archivos modificados.


## V3.61
- Recaudación de entradas visible en el simulador/resumen de partido.
- Finanzas con gastos por categoría en bloques desplegables.
- Ingresos por categoría también desplegables para controlar recaudación, sponsors y ventas.


## V3.62
- Ajuste del botón Mejor condición física: prioriza jugadores con condición +75 y reduce penalizaciones por fuera de posición.
