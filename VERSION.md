# Registro de versión

## Versión: V2.20
**Estado:** estable para pruebas locales / GitHub Pages  
**Tipo de mejora:** UI compacta + sistema inicial de sponsors

### Resumen
Esta versión ajusta tablas y filtros para ocupar menos espacio, normaliza la visualización de nacionalidades y suma un sistema inicial de patrocinadores dentro del menú Estadio.

### Cambios principales agregados
- Selectores de orden sin la palabra "Ordenar".
- Indicador circular para estado físico.
- Indicador circular para moral.
- Nacionalidad abreviada en tablas con código de 3 letras.
- Nombre completo del país dentro de la ficha del jugador.
- Nuevo archivo `data/sponsors.json`.
- Nueva sección Sponsors dentro de Estadio.
- Tandas de ofertas cada 4 a 7 partidos.
- Entre 2 y 5 ofertas por tanda.
- Pago completo al aceptar la oferta.
- Registro del ingreso en Finanzas.
- Contratos activos con turnos restantes.

### Reglas de cálculo de sponsors
- División 1: x10.
- División 2: x4.
- División 3: x1.
- Bonus por posición en tabla: 0% a 20%.
- Bonus por moral: 0% a 10%.
- Bonus por cohesión: 0% a 10%.
- Multiplicador por lugar del sponsor.

### Pendientes sugeridos
- Agregar histórico específico de sponsors aceptados y rechazados.
- Permitir negociar o renovar contratos.
- Crear restricciones por categoría comercial.
