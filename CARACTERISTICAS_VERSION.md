# V3.82 - Normalización de ligas y tema visual por club

- Se normalizaron todos los archivos de liga a una estructura común basada en `leagues > teams`.
- Cada club ahora define de forma explícita: `name`, `city`, `reputation`, `primaryColor` y `crestPath`.
- Se preparó la base para futuros escudos personalizados en `img/escudos/` usando la ruta indicada en cada club.
- El juego ahora toma el `primaryColor` del club elegido y lo aplica como tema visual suave del fondo e interfaz.
- El color del club respeta la estética oscura actual con una saturación moderada y transiciones sutiles.
- Se agregaron parámetros de configuración visual en `config.js` para activar o suavizar el tema de club.
- No se modificó la lógica deportiva ni la estructura de ligas/cupos existente.
