# Registro de versión

## Versión: V2.22
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** mercado, finanzas y navegación de primer equipo

### Resumen
Esta versión reorganiza la gestión del plantel y agrega operaciones básicas de mercado desde la ficha del jugador y desde el menú Mercado.

### Cambios principales agregados
- Nuevo menú lateral **Primer Equipo**.
- Pestañas internas: **Táctica**, **Plantel** y **Entrenamiento**.
- Finanzas muestra el plantel completo con sueldo anual.
- Mercado se divide en:
  - Jugadores libres.
  - Jugadores contratados.
- Ficha de jugador propio:
  - Botón **Despedir**.
  - Botón **Ofrecer a clubes**.
- Ficha de jugador rival:
  - Botón **Hacer oferta**.
- Modal de oferta con tres opciones:
  - Ofrecer 50% menos.
  - Ofrecer 25% más.
  - Ofrecer cláusula.
- Si una compra se acepta, el jugador llega al plantel en el siguiente turno.
- Los mensajes de rechazo se registran en Mensajes.

### Reglas internas
- Las probabilidades de éxito de las ofertas no se muestran al usuario.
- El dinero se descuenta al aceptar la operación.
- Las operaciones pendientes se procesan al avanzar el turno.
