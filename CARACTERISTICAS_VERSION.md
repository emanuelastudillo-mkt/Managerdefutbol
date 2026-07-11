# Características de la versión V5.80

## V5.80 - Corrección de slots vacíos

Ajuste visual específico para el menú de slots:

- Las carreras vacías ya no usan la clase global `empty-slot`, que estaba pensada para huecos de la pizarra táctica.
- Los slots vacíos se muestran como filas completas, igual que Carrera 1 y el reto Campo destruido.
- Se mantiene el listado vertical estable.
- No se modifican guardados, slots, retos, cartas ni lógica de carrera.

## Archivos modificados

- `style.css`
- `js/data/04-data-storage.js`
- `index.html`
- `app.js`
- `config.js`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`
