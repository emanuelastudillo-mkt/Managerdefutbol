# Registro de versión

## Versión: V2.3
**Estado:** ajuste funcional sobre visual post-partido y convocatoria de lesionados  
**Tipo de mejora:** interfaz, táctica y reglas médicas

### Resumen
La versión V2.3 agrega imágenes contextuales después de cada partido y permite convocar lesionados leves/intermedios al banco para evitar bloqueos por falta de suplentes disponibles.

### Cambios principales agregados
- Se agrega selección automática de banner contextual en el panel principal según el último partido propio:
  - lesión de menos de 5 turnos: `banner_noticias_lesion_leve.jpg`;
  - lesión de más de 10 turnos: `banner_noticia_lesion_intermedia.jpg`;
  - lesión de más de 25 turnos: `banner_noticia_lesion_grave.jpg`;
  - sin lesionados y empate/derrota: `banner_entrenamiento_normal.jpg`;
  - sin lesionados y victoria: `banner_entrenamiento_triunfo.jpg`.
- Si una lesión queda entre 5 y 10 turnos, se usa el banner de lesión intermedia para no ocultar que hubo lesión.
- Los jugadores lesionados con menos de 10 turnos restantes pueden ser convocados como suplentes.
- Los jugadores lesionados convocados como suplentes reciben una penalización interna del 90%.
- Los lesionados no pueden ser titulares.
- Los suspendidos no pueden formar parte de la convocatoria.
- El autoselector de suplentes prioriza jugadores disponibles y deja a los lesionados convocables como recurso de emergencia.
- Los cambios automáticos y cambios por lesión pueden usar un suplente lesionado convocable si no hay una mejor opción disponible.

### Pendientes sugeridos
- Hacer que los cambios modifiquen el rendimiento por bloque dentro del motor de simulación.
- Definir si un jugador lesionado convocado al banco debe aumentar su riesgo de recaída.
- Confirmar extensión final del archivo `banner_entrenamiento_triunfo.jpg`.
