# Registro de versión

## Versión: V2.12
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** táctica y selección automática

### Resumen
Esta versión separa la autoselección táctica en dos criterios distintos: mejor once por rol y mejor condición física.

### Cambios principales
- Nuevo botón **Mejor once** en Táctica.
- Nuevo botón **Mejor condición física** en Táctica.
- **Mejor once** usa la lógica de mejores jugadores disponibles para cada posición de la formación.
- **Mejor condición física** prioriza jugadores con mayor estado físico, aunque queden fuera de rol y reciban penalización táctica.
- La selección por condición física también ordena el banco por mejor forma física.
- Los jugadores suspendidos o lesionados no habilitados no se colocan como titulares.
- Los lesionados permitidos para banco se mantienen disponibles para suplentes según la regla existente.

### Pendientes sugeridos
- Revisar si la selección por condición debe forzar siempre al menos un portero o permitir alineaciones totalmente libres.
- Agregar una advertencia visual cuando la opción por condición física deje muchos jugadores fuera de zona.
