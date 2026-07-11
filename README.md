# Fútbol Manager MVP - V6.03

## V6.03 - Dificultad competitiva

Esta entrega continúa la línea Manager V6 y toma V6.02 como base.

### Cambios principales

- Se agrega adaptación rival cuando el usuario repite demasiadas veces la misma forma de jugar.
- La repetición se mide por formación, mentalidades por puesto, instrucciones de partido y estilos sectoriales, no por nombres de jugadores.
- Los primeros 3 partidos con el mismo patrón no tienen penalización; desde el cuarto, el rival recibe un bonus progresivo y limitado.
- Se agrega riesgo alto de lesión larga para jugadores con participación excesiva.
- La referencia de temporada queda en 34 partidos: desde el 80% de participación, el riesgo de lesión larga sube de forma fuerte.
- Las lesiones por alta participación priorizan lesiones de larga duración.
- Se agrega contador progresivo de partidos sin jugar para suplentes.
- Los jugadores disponibles que no participan pierden cada vez más moral según la cantidad consecutiva de partidos que se pierden.
- Los jugadores lesionados o suspendidos no acumulan castigo por no jugar.
- Se actualiza versión visible, caché de scripts/estilos y documentación a V6.03.

### Parámetros editables

Los nuevos valores se pueden ajustar desde `balance-modificadores.js` o `config.js`, dentro de `dificultad`:

- `partidosReferenciaTemporada`: 34.
- `umbralParticipacionLesionLarga`: 0.80.
- `probabilidadLesionLargaMin`: 0.35.
- `probabilidadLesionLargaMax`: 0.65.
- `pesoLesionLargaAltaParticipacion`: 0.90.
- `adaptacionTactica.partidosSinPenalizacion`: 3.
- `adaptacionTactica.bonusRivalPorRepeticion`: 0.03.
- `adaptacionTactica.bonusRivalMaximo`: 0.12.
- `moralSuplentes.perdidaPorPartidoPerdido`: 1.
- `moralSuplentes.perdidaMaximaPorPartido`: 12.

### Validaciones realizadas

- Sintaxis JavaScript validada con `node --check` en los archivos modificados.
- Parseo JSON validado en todos los archivos dentro de `data/`.
- Se mantiene la carga dividida de `data/jugadores` agregada en V6.02.

### Instalación

Para instalación limpia, subir todo el contenido del ZIP completo V6.03.

Para actualizar desde V6.02, aplicar el ZIP incremental V6.03 sobre la carpeta existente y forzar recarga con Control + F5.

## Historial inmediato

### V6.02 - División de `data/jugadores.json`

- `data/jugadores.json` pasa a funcionar como manifest liviano.
- La base completa de 4.050 jugadores queda dividida en 9 archivos dentro de `data/jugadores/`.
- Se agrega soporte de carga por `playersUrls` en `config.js`.
- Se mantiene compatibilidad con el formato anterior de jugadores.

### V6.01 - Revisión exhaustiva y limpieza inicial de Manager V6

- Se abrió la línea Manager V6 tomando como base V5.80.
- Se actualizaron versión visible y caché a V6.01.
- Se eliminaron funciones internas sin referencias detectables por análisis estático.
- Se corrigió la contradicción de balance de tarjetas y quedó activo `1.10` desde `balance-modificadores.js`.
