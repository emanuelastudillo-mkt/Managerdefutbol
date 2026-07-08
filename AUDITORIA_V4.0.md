# Auditoría V4.0 - Manager de Fútbol

## Resultado general

La versión queda marcada como `V4.0` y se aplicaron ajustes seguros de limpieza, consistencia y rendimiento. No se detectaron JSON inválidos ni errores de sintaxis JavaScript.

Validación realizada:

- JSON revisados: todos los archivos de `data/*.json` cargan correctamente.
- JavaScript revisado: `node --check` sin errores en `config.js`, `simulador-2.0.js`, `app.js` y módulos de `js/`.
- Prueba de carga de datos en entorno controlado: 162 clubes, 4.050 jugadores, 9 divisiones y 34 fechas generadas.
- Tiempo de carga del seed en prueba local Node: pasó de aproximadamente 454 ms a aproximadamente 178 ms. Esta medición no equivale al navegador real, pero confirma mejora del proceso de armado de datos.

## Cambios aplicados

### Versión y documentación

- `VERSION.md` queda en `V4.0`.
- `config.js` queda en `version: 'V4.0'`.
- `index.html` muestra `Fútbol Manager V4.0`.
- Se actualizó el cache-busting de CSS y scripts a `v=4.0`.
- Se agregaron notas de versión V4.0 en `README.md` y `CARACTERISTICAS_VERSION.md`.

### Rendimiento

- `fetchJsonIfExists()` ahora usa `data.cacheMode` desde `config.js`.
- `data.cacheMode` queda en `'default'`, para permitir cache del navegador. Usar `'no-store'` sólo conviene durante pruebas donde los JSON cambian todo el tiempo.
- La carga de jugadores, estadios e hinchas ahora corre en paralelo.
- La carga de ligas ahora corre en paralelo y conserva el orden configurado.
- Si `data/jugadores.json` existe y cubre los clubes, se evita generar planteles temporales que luego eran descartados.
- Si en el futuro la base de jugadores queda incompleta, el juego sigue generando planteles sólo para clubes sin cobertura.

### Imágenes y rutas

- Se corrigió el banner inicial para apuntar directo a `img/principales/banner_bienvenido.jpg`. Antes intentaba cargar primero una ruta sin extensión.
- Se corrigieron 54 rutas de escudos argentinos en `data/Liga Argentina.json` para que apunten directo al archivo existente. Esto reduce fallbacks y peticiones 404 de imágenes.
- Se eliminaron 6 escudos no usados por ninguna liga activa.

## Imágenes eliminadas

Estas imágenes ya no aparecen referenciadas por las ligas activas, ni por rutas dinámicas usadas actualmente:

- `img/escudos/Atenas_R#U00edo_Cuarto.png`
- `img/escudos/Ciudad_de_Bol#U00edvar.png`
- `img/escudos/Deportivo_Rinc#U00f3n.png`
- `img/escudos/Ituzaing#U00f3.png`
- `img/escudos/San_Mart#U00edn_de_Formosa.png`
- `img/escudos/Sarmiento_La_Banda.png`

Después de la limpieza no quedan escudos locales sin uso detectado.

## Imágenes que conviene agregar

Faltan escudos para la mayoría de clubes no argentinos/no chilenos. El juego no se rompe porque oculta el escudo si no encuentra imagen, pero visualmente queda incompleto.

### Brasil: faltan 18

Flamengo, Palmeiras, Corinthians, São Paulo, Santos, Grêmio, Internacional, Atlético Mineiro, Cruzeiro, Fluminense, Botafogo, Vasco da Gama, Athletico Paranaense, Bahia, Fortaleza, Sport Recife, Vitória, Ceará.

### Inglaterra: faltan 17 y hay 1 conflicto

Faltan: Manchester City, Liverpool, Manchester United, Arsenal, Chelsea, Tottenham, Newcastle United, Aston Villa, West Ham, Nottingham Forest, Leeds United, Leicester City, Brighton, Wolverhampton, Crystal Palace, Fulham, Sunderland.

Conflicto: `Everton` de Inglaterra usa `img/escudos/everton.png`, pero ese archivo ya existe por Everton de Chile. Si esa imagen corresponde al club chileno, Inglaterra mostrará un escudo incorrecto.

### España: faltan 18

Real Madrid, Barcelona, Atlético Madrid, Sevilla, Valencia, Athletic Club, Real Betis, Villarreal, Real Sociedad, Celta, Espanyol, Deportivo La Coruña, Mallorca, Osasuna, Zaragoza, Sporting Gijón, Getafe, Rayo Vallecano.

### Italia: faltan 18

Juventus, Inter, Milan, Napoli, Roma, Lazio, Atalanta, Fiorentina, Torino, Bologna, Genoa, Sampdoria, Parma, Udinese, Palermo, Cagliari, Hellas Verona, Sassuolo.

### Rumania: faltan 18

FCSB, CFR Cluj, Universitatea Craiova, Dinamo București, Rapid București, Farul Constanța, Petrolul Ploiești, UTA Arad, Sepsi OSK, Hermannstadt, Universitatea Cluj, Oțelul Galați, FC Argeș, Poli Iași, Botoșani, Voluntari, Gloria Bistrița, Chindia Târgoviște.

## Archivos de datos potencialmente redundantes

No los eliminé porque no son imágenes y pueden servir como respaldo, pero actualmente la configuración carga los archivos separados por país:

- `data/estadios.json`
- `data/hinchas.json`

Hoy `config.js` usa `data.estadiosUrls` y `data.hinchasUrls`, no esos alias globales. Si se decide mantener sólo una fuente, hay dos caminos razonables:

1. Usar sólo los separados por país y eliminar los alias globales.
2. Usar sólo los alias globales y simplificar `config.js`.

Recomiendo la opción 1 porque permite agregar ligas sin tocar archivos enormes.

## Contradicciones o puntos a revisar

- La versión estaba mezclada entre V3.86, V3.87 y comentarios internos. Se corrigió la versión funcional visible a V4.0, pero algunos comentarios históricos dentro de módulos mantienen referencias a versiones anteriores para preservar historial.
- `data/jugadores.json` todavía declara metadata de versión V3.79. No rompe el juego, pero cuando se regenere la base conviene marcarla como V4.0.
- `apps-script-ranking.gs` mantiene comentario interno V3.20. No afecta ejecución, pero conviene actualizarlo si se vuelve a tocar el script de ranking.
- Los escudos de ligas internacionales deben resolverse antes de considerar completa la expansión visual internacional.
- `data/seed.json` funciona como fallback. Con las ligas actuales cargando bien, no se usa en el flujo normal. No recomiendo borrarlo salvo que se quiera eliminar el fallback de emergencia.

## Recomendaciones siguientes

- Dividir `data/jugadores.json` por país o por liga. Es el archivo más pesado del proyecto con aproximadamente 4,6 MB.
- Agregar los escudos internacionales faltantes con nombres iguales a los `crestPath` de cada JSON.
- Resolver el conflicto de `everton.png` separando rutas por país o usando nombres más específicos, por ejemplo `everton-chile.png` y `everton-inglaterra.png`.
- Mantener `data.cacheMode: 'default'` para producción y cambiarlo a `'no-store'` sólo durante pruebas.
- Más adelante, empaquetar/minificar JS y CSS para producción, dejando los archivos fuente sin minificar para desarrollo.
