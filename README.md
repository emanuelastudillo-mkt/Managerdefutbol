# Auditoría V5.00 - Manager de Fútbol

> Nota: este archivo conserva el nombre histórico `AUDITORIA_V4.0.md`, pero el contenido fue actualizado para la base V5.00.

## Resultado general

La versión queda marcada como `V5.00` y se aplicaron ajustes seguros de consistencia, rendimiento de carga y documentación. No se detectaron JSON inválidos ni errores de sintaxis JavaScript.

Validación realizada:

- JSON revisados: todos los archivos de `data/*.json` cargan correctamente.
- JavaScript revisado: `node --check` sin errores en `config.js`, `simulador-2.0.js`, `app.js` y módulos de `js/`.
- Datos activos detectados: 162 clubes, 4.050 jugadores y 9 divisiones de liga.
- Rutas de escudos referenciadas por ligas activas: 162 referencias, 161 rutas únicas, 0 archivos faltantes después de corregir rutas argentinas con acentos.

## Cambios aplicados en V5.00

### Versión y documentación

- `VERSION.md` queda en `V5.00`.
- `config.js` queda en `version: 'V5.00'`.
- `index.html` muestra `Fútbol Manager V5.00` y `MVP local · V5.00`.
- Se actualizó el cache-busting de CSS y scripts a `v=5.00`.
- Se agregaron notas de versión V5.00 en `README.md` y `CARACTERISTICAS_VERSION.md`.

### Rendimiento

- `fetchJsonIfExists()` ahora respeta `data.cacheMode` desde `config.js`.
- `data.cacheMode` queda en `'default'`, para permitir cache del navegador en producción.
- Usar `'no-store'` sólo conviene durante pruebas donde los JSON cambian con mucha frecuencia.
- La carga de jugadores, estadios e hinchas corre en paralelo.
- La carga de ligas corre en paralelo y conserva el orden configurado.
- La carga inicial de seed, sponsors, empleados, eventos, cartas y relatos corre en paralelo.

### Imágenes y rutas

- Se corrigió el banner inicial para apuntar directo a `img/principales/banner_bienvenido.jpg`.
- Antes intentaba cargar primero `img/principales/banner_bienvenido` sin extensión, generando una petición fallida antes del fallback.
- Se corrigieron 13 `crestPath` de Argentina que usaban nombres escapados como `#U00e9` aunque los archivos reales del ZIP usan caracteres acentuados.
- Se agregó normalización para partidas guardadas que todavía tengan `crestPath` antiguos con `#U00xx`.
- No se modificaron imágenes en esta entrega porque el ZIP pedido contiene sólo archivos modificados.

## Imágenes candidatas a eliminar

Estas imágenes no aparecen referenciadas por ninguna liga activa en la revisión V5.00:

- `img/escudos/Atenas_Río_Cuarto.png`
- `img/escudos/Ciudad_de_Bolívar.png`
- `img/escudos/Deportivo_Rincón.png`
- `img/escudos/Ituzaingó.png`
- `img/escudos/San_Martín_de_Formosa.png`
- `img/escudos/Sarmiento_La_Banda.png`

Si se pide una versión completa limpia, pueden eliminarse del paquete completo. En una entrega incremental como esta no conviene incluir borrados porque el ZIP contiene únicamente archivos modificados.

## Contradicciones o puntos a revisar

- El paquete venía como V4.34, pero `index.html` mostraba V4.31. Quedó corregido a V5.00.
- `README.md` decía que los 6 escudos huérfanos habían sido removidos, pero seguían presentes en el ZIP recibido. Quedan identificados arriba para borrado en una versión completa.
- `img/escudos/everton.png` está compartido por Everton de Chile y Everton de Inglaterra. No falta archivo, pero puede mostrar un escudo incorrecto en una de las dos ligas si la imagen corresponde al otro club.
- `data/estadios.json` y `data/hinchas.json` no están referenciados por `config.js`; el juego usa los archivos separados por país. No se borran porque pueden servir como respaldo o por compatibilidad histórica.
- `data/seed.json` funciona como fallback. Con las ligas actuales cargando bien, no se usa en el flujo normal. No recomiendo borrarlo salvo que se quiera eliminar el fallback de emergencia.
- Algunos comentarios de cabecera en módulos siguen mencionando versiones V3/V4. No afecta ejecución; sólo son marcas históricas.

## Recomendaciones siguientes

- Dividir `data/jugadores.json` por país o por liga. Es el archivo más pesado del proyecto y concentra más de 4 MB.
- Resolver el conflicto de `everton.png` separando rutas por país, por ejemplo `everton-chile.png` y `everton-inglaterra.png`.
- Mantener `data.cacheMode: 'default'` para producción y cambiarlo a `'no-store'` sólo durante pruebas fuertes.
- Más adelante, empaquetar/minificar JS y CSS para producción, dejando los archivos fuente sin minificar para desarrollo.
- Revisar si `data/estadios.json` y `data/hinchas.json` siguen siendo necesarios como respaldo. Si no se usan, pueden quitarse en una versión completa.
