# Una Vida de Mánager — V8.74 INCREMENTAL

## Base requerida

Aplicar sobre **V8.73 COMPLETA**.

Copiar el contenido de esta carpeta sobre la instalación existente y aceptar el reemplazo de archivos. No elimina partidas guardadas ni requiere cambios de Worker, SQL o datos.

## Ficha horizontal del jugador

- La ficha utiliza una composición horizontal de tres zonas en pantallas de escritorio.
- Columna izquierda: identidad, club, dorsal, posición, edad, estado, media, físico, moral, desgaste, cláusula, salario, distinción y acciones.
- Columna central: habilidades distribuidas en tres columnas, radar y habilidades ocultas conocidas.
- Columna derecha: estadísticas de temporada y carrera comparadas simultáneamente.
- Se eliminó la necesidad de alternar pestañas para consultar temporada y carrera.
- La ventana ocupa el ancho disponible y evita scroll interno en resoluciones horizontales habituales desde 1024 × 768 y 1280 × 720.
- En pantallas móviles conserva el formato vertical con desplazamiento normal.

## Colores de habilidades

- 0–39: rojo.
- 40–54: naranja.
- 55–69: amarillo.
- 70–84: verde.
- 85–99: celeste.
- Los valores todavía no descubiertos se muestran en gris.
- Se agregó una leyenda compacta dentro de la ficha.
- Las penalizaciones por edad y mejoras de entrenamiento conservan sus indicadores propios.

## Archivos incluidos

- `index.html`
- `config.js`
- `js/core/01-config-constants.js`
- `js/ui/12-modals.js`
- `styles/180-player-profile-v874.css`

## Compatibilidad

Compatible con partidas de V8.73. La actualización es visual y no modifica habilidades, estadísticas ni contratos guardados.
