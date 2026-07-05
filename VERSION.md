# Registro de versión

## Versión: V1.13
**Estado:** actualización de base de datos / generación de planteles  
**Tipo de mejora:** estructura de liga, clubes y generación de jugadores

### Cambios principales
- Se agrega soporte directo para `data/Liga Argentina.json`.
- Se cargan 3 divisiones desde el archivo del usuario:
  - Liga Profesional
  - Primera Nacional
  - Federal A
- Se usan los valores de `reputation` del JSON para generar clubes, presupuestos, estado del campo y planteles.
- Se ajusta el multiplicador económico por división:
  - Liga Profesional: x1.00
  - Primera Nacional: x0.30
  - Federal A: x0.15
- Se conserva la lógica de nombres de escudos usando espacios reemplazados por guion bajo.

### Generación de jugadores
- Cada club genera 25 jugadores.
- Cada club conserva como mínimo 2 porteros y más de 16 jugadores.
- Los porteros tienen una edad promedio superior.
- Los jugadores se generan con habilidades acordes al prestigio del club.

### Reglas por rol
- **Porteros:** habilidades específicas de arquero, edad promedio más alta.
- **Defensas:** defensa como habilidad clave; ataque y cabezazo como comunes; pase y velocidad como raras.
- **Medios:** pase como habilidad clave; defensa, ataque y tiro como comunes; velocidad y cabezazo como raras.
- **Delanteros:** ataque como habilidad clave; tiro y cabezazo como comunes; pase, velocidad y defensa como raras.

### Archivos incluidos
- `index.html`
- `app.js`
- `README.md`
- `VERSION.md`
- `data/Liga Argentina.json`

### Nota técnica
No se incluye `pitch-board.png` en esta actualización.
