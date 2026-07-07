# Características de versión - V3.35

## Corrección crítica de inicio
- La V3.34 podía quedar trabada en la pantalla principal porque las constantes de Academia usaban `clamp()` antes de cargar el archivo donde esa función se declara.
- Se reemplazó ese uso por límites directos desde `configNumber()`.
- El juego vuelve a iniciar correctamente y los botones de Nueva partida / Reset quedan operativos.

## Se conserva
- Sistema de cartas ESPECIAL.
- Corrección de sobres hacia reserva.
- Juvenil excepcional de Academia.
