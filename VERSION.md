# Registro de versión

## Versión: V1.08
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** sistema médico y gestión de plantel

### Resumen
Esta versión agrega un sistema de lesiones más explícito, con probabilidades, duración en turnos y visualización directa en el panel principal del club.

### Cambios principales agregados
- **Tabla de lesiones** incorporada al juego:
  - Distensión: 25%, 2 a 5 turnos.
  - Desgarro: 20%, 1 a 4 turnos.
  - Esguince: 15%, 3 a 8 turnos.
  - Rotura: 9%, 6 a 12 turnos.
  - Fractura: 3%, 16 a 30 turnos.
  - Contusión: 28%, 1 a 2 turnos.
- **Probabilidad de lesión por jugador**:
  - 5% base.
  - +1% por cada 5 puntos de cansancio acumulado.
- Las lesiones se ejecutan al simular el partido.
- La lesión puede ocurrir:
  - durante el partido,
  - al final del partido.
- Las lesiones ahora muestran nombre de lesión, no sólo gravedad genérica.
- Se informa la lesión en eventos del partido y en el panel principal.
- Nueva sección en pantalla principal: **Jugadores lesionados**.
- La sección de lesionados muestra:
  - jugador,
  - tipo de lesión,
  - turnos restantes,
  - estado físico.
- Se agregó **Media general del plantel** en el panel principal.
- Se agregó **Estado físico general del plantel** en el panel principal.

### Cambios mantenidos
- Simulación visual de partido en ventana progresiva.
- Opción para finalizar partido y ver resultado final.
- Estadísticas de jornada por equipo en dos columnas.
- Clima, campo de juego e hinchas locales/visitantes.
- Clubes clickeables con plantilla y scouting parcial.
- Táctica con arrastre manual.
- Penalización por jugador fuera de zona.
- Reglas de plantel mínimo.
- Guardado local con IndexedDB.

### Pendientes sugeridos
- Historial médico completo por jugador.
- Cuerpo médico y reducción de plazos de recuperación.
- Lesiones recurrentes.
- Riesgo por jugar con baja condición física.
- Entrenamiento preventivo.
