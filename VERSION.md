# Registro de versión

## Versión: V1.03
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** funcional, visual y de lógica táctica

### Resumen
Esta versión mejora la visualización táctica, agrega estado físico a los jugadores, incorpora placeholders de foto y mejora la identificación visual de roles, nacionalidades y elementos propios del club del usuario.

### Cambios principales agregados
- **Visualización táctica de formaciones corregida** con lógica de **5 secciones de juego** más portero.
- Adaptación visual de esquemas como:
  - 4-3-3 → 4-0-3-0-3
  - 4-3-1-2 → 4-0-3-1-2
  - 4-1-4-1 → 4-1-4-0-1
- **Círculos de jugadores más pequeños** en la cancha táctica.
- **Colores distintos por línea**:
  - porteros
  - defensas
  - mediocampistas
  - delanteros
- **Flecha de ataque corregida**, ahora apunta hacia la derecha.
- **Anillo de estado físico** alrededor de cada titular:
  - dividido en 8 segmentos
  - cada segmento representa 12,5 puntos
  - colores de rojo a verde
- **Estado físico implementado**:
  - impacto directo en el rendimiento de partido
  - jugar resta entre 15 y 20 puntos
  - el paso del tiempo recupera entre 12 y 18 puntos
  - no jugar suma entre 8 y 10 puntos extra
- **Placeholders de foto** agregados en:
  - pantalla de plantel
  - ficha individual del jugador
- **Iconos de nacionalidad y rol** agregados en plantel y ficha.
- **Tablas resaltadas** para distinguir fácilmente:
  - tu club en la tabla
  - tus jugadores en rankings y estadísticas
- **Placeholder en pantalla principal** para futura imagen del momento del club.

### Cambios que se mantienen
- 11 titulares y 10 suplentes.
- 5 cambios automáticos.
- Reglas automáticas:
  - quitar cansados
  - entrar ganando
  - entrar perdiendo
  - entrar empatando
- 10% de cambios en entretiempo y el resto entre 60 y 90.
- Partidos clickeables con estadísticas.
- Bloqueo de 2 minutos para avanzar.
- Revisión obligatoria si hubo lesionados o expulsados propios.
- Guardado local con IndexedDB.
- Economía básica por resultado.

### Pendientes sugeridos
- Mercado de pases.
- Escudos reales o cargables.
- Retratos reales o generados para jugadores.
- Mayor profundidad de roles y posiciones laterales.
- Desarrollo de entrenamiento y evolución.
- Paso a V2.0 con módulos de temporada más completos.
