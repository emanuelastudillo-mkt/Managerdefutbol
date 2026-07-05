# Registro de versión

## Versión: V1.02
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** funcional y visual

### Resumen
Esta versión mejora el MVP táctico con una cancha visual interactiva, mentalidad individual por jugador, media visible real basada sólo en stats visibles y una economía simple por resultado.

### Cambios principales agregados
- **Cancha táctica visual** con imagen tipo pizarra.
- **11 titulares visibles sobre la cancha** con distribución de izquierda a derecha según la formación.
- Cada titular aparece como **círculo clickeable** con:
  - apellido
  - dorsal
  - mentalidad individual
- **Mentalidad individual por jugador titular**:
  - Posicional = guion amarillo
  - Ataque = flecha verde hacia arriba
  - Defensiva = flecha azul hacia atrás
- **Media del jugador corregida**:
  - ahora es el promedio de las habilidades visibles
  - ya no se muestra en pantalla el valor afectado por mejoras ocultas
- **Habilidades ocultas ya no visibles** en la interfaz del jugador.
- **Espacios reservados** para:
  - futura cara del jugador
  - escudo del club
  - logo de la liga
- **Economía básica** implementada para el club del usuario:
  - ganar: +$300.000 a +$500.000
  - empatar: +$100.000 a +$200.000
  - perder: -$100.000 a +$50.000
- Se muestra el **presupuesto actualizado** y el **último balance** en la pantalla principal.

### Cambios mantenidos de la versión anterior
- 11 titulares y 10 suplentes.
- 5 cambios automáticos.
- Reglas automáticas:
  - quitar cansados
  - entrar ganando
  - entrar perdiendo
  - entrar empatando
- 10% de cambios en el entretiempo y el resto entre 60 y 90.
- Partidos clickeables con estadísticas.
- Bloqueo de 2 minutos para avanzar.
- Revisión obligatoria si hubo lesionados o expulsados propios.
- Guardado local con IndexedDB.

### Cambios técnicos
- Se agregó carpeta `assets/` con la cancha visual.
- Se añadió `playerMentalities` dentro de la táctica guardada.
- Se incorporó `budget`, `lastBudgetDelta` y `budgetHistory` al estado del juego.
- Se separó la lógica de stats visibles y rendimiento oculto para simulación.

### Pendientes sugeridos
- Mercado de pases.
- Escudos y logos reales/cargables.
- Cara de jugadores.
- Lesiones con recuperación detallada.
- Entrenamiento y evolución.
- Fin de temporada con premios y objetivos.
