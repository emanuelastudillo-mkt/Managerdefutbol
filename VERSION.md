# Registro de versión

## Versión: V2.2
**Estado:** ajuste funcional de estados médicos, expulsiones y flujo de nueva partida  
**Tipo de mejora:** interfaz, gestión de lesionados y empleados

### Resumen
La versión V2.2 mejora la gestión posterior a lesiones y expulsiones, suma tratamientos mediante kinesiólogo y reorganiza la creación de nueva partida para que no ocupe espacio fijo en el menú lateral.

### Cambios principales agregados
- Cuando un jugador propio se lesiona o es expulsado:
  - se quita automáticamente del once titular;
  - se elimina de la convocatoria si estaba en banco;
  - queda como reserva;
  - su espacio en la pizarra queda vacío para reemplazarlo manualmente.
- La sección de **Jugadores lesionados** del panel principal ahora muestra:
  - foto del jugador;
  - ícono de lesión;
  - nombre;
  - tipo de lesión;
  - turnos restantes;
  - estado físico.
- En la pantalla de simulación se agregan íconos para:
  - gol;
  - asistencia;
  - cambio;
  - lesión.
- El evento de lesión en la simulación ya no muestra información de turnos de baja.
- Se agrega el empleado **Kinesiólogo**:
  - costo de contratación: $1.000.000;
  - contratación válida por temporada completa;
  - permite tratar jugadores lesionados una vez por turno;
  - si el tratamiento tiene éxito, reduce 1 turno de lesión;
  - el tratamiento puede fallar con 20% de probabilidad.
- La sección de **Nueva partida** se transforma en acceso minimizado.
- Al entrar sin partida o usar Reset, la selección de club aparece en una ventana emergente.

### Pendientes sugeridos
- Integrar el efecto de cambios y expulsiones dentro del motor por bloques durante el partido.
- Definir si el kinesiólogo podrá tratar más de un jugador por turno o solo uno total por turno.
- Reemplazar internamente “disciplina” por conducta de partido calculada.
