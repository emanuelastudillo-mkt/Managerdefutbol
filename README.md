# Fútbol Manager MVP - V6.10

## Estado de la versión

Esta versión toma como base la **V6.09**. La documentación se mantiene unificada en este `README.md`: no se entregan archivos separados de revisión, versión o características.

La versión vigente se identifica desde:

- `README.md`
- `config.js`
- `index.html`

## V6.10 - Ajustes del Modo Bancarrota

### Cambios principales

- El modo **Bancarrota, Renacer - Libre** queda definido como un modo libre en bancarrota, no como un modo difícil separado.
- Permite elegir cualquier club disponible en la base, sin bloqueo por prestigio del mánager.
- El club elegido inicia con una crisis extrema:
  - caja inicial negativa de **-500 millones**;
  - estadio vendido/sin capacidad disponible, con capacidad inicial 0 real;
  - prestigio del club reducido fuertemente;
  - hinchas reducidos a la mitad;
  - campo de juego inicial al **100%**;
  - plantel profesional reducido a un grupo de jugadores leales;
  - 20 juveniles de 16 años en Academia, con al menos un portero.
- La primera temporada tiene objetivo fijo: **no descender**.
- El modo se comporta como una partida normal: mantiene objetivos de directiva, riesgo deportivo, mercado, empleados, academia, finanzas, calendario y ranking.

### Cómo iniciar el modo

1. Entrar a **Slots / Nueva partida**.
2. Elegir una carrera libre o iniciar una carrera nueva.
3. En la ventana de creación, usar el bloque **Bancarrota, Renacer**.
4. Seleccionar país, liga y club.
5. Confirmar con **Iniciar Bancarrota**.

### Criterio de diseño

Este modo no reemplaza al Modo Fundador. La diferencia principal es:

- **Modo Fundador:** se crea un club nuevo desde cero.
- **Modo Bancarrota:** se toma un club real/existente y se lo reconstruye después de una quiebra.

La dificultad inicial se concentra en la economía, la falta de estadio, la pérdida de prestigio, la base reducida de hinchas y la necesidad de formar juveniles.

## Base acumulada reciente

### V6.02 - División de jugadores

- `data/jugadores.json` pasó a funcionar como manifest liviano.
- La base de jugadores se dividió en chunks dentro de `data/jugadores/`.
- La carga acepta manifest, chunks y estructuras anteriores para mantener compatibilidad.

### V6.03 - Dificultad competitiva

- Adaptación rival si se repite muchas veces la misma formación, mentalidad e instrucciones.
- Riesgo alto de lesión larga por sobreuso en jugadores con participación excesiva.
- Pérdida progresiva de moral en jugadores disponibles que pasan muchos partidos sin jugar.

### V6.04 - Ojeo, avance automático y ranking de carrera

- El Centro de Ojeo incorporó probabilidad de fichaje como información de mercado.
- El avance automático pasó a tener bloque propio con switch visual ON/OFF.
- El ranking online empezó a subir la carrera completa del mánager, sin duplicar partidas.

### V6.05 - Limpieza ranking legacy

- Se eliminó `apps-script-ranking.gs` de la versión completa.
- El ranking queda asociado a Cloudflare Worker + D1.

### V6.06 - Ayuda de interfaz

- Se agregó botón superior **Ayuda** junto a Guardar, Cargar y Renunciar.
- La ayuda explica los menús laterales por importancia y jerarquía.
- También resume funciones principales sin exponer fórmulas o valores internos exactos.

### V6.07 - Probabilidad de fichaje como dato de ojeo

- La probabilidad de ser fichado dejó de mostrarse automáticamente.
- Ahora funciona como dato revelable por el Centro de Ojeo.
- En Mercado, donde antes aparecía `Interés oculto`, ahora se muestra `Prob. fichaje` sólo si ese dato fue revelado.
- Los informes guardados también respetan si el dato está descubierto u oculto.

### V6.08 - Documentación unificada en README

- Se eliminaron de la versión completa los archivos documentales separados de revisión, versión y características.
- El historial relevante queda resumido dentro de este README.
- Las validaciones y notas técnicas de cada entrega se informan en este mismo archivo.

### V6.09 - Modo Bancarrota, Renacer

- Se agregó el modo **Bancarrota, Renacer - Libre**.
- Desde el alta de una carrera nueva se puede abrir este modo como variante de inicio libre en crisis.
- El club elegido arranca con deuda extrema, estadio sin capacidad disponible, menos hinchas, menor prestigio, plantel reducido y academia juvenil de emergencia.


## Archivos modificados en V6.09

- `index.html`
- `config.js`
- `README.md`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/ui/12-modals.js`

## Instalación

Para instalación limpia, subir todo el contenido del ZIP completo **V6.09**.

Para actualizar desde V6.08, aplicar el ZIP incremental **V6.09** sobre la carpeta existente y forzar recarga del navegador.

Si se actualiza con incremental, los archivos documentales viejos que ya existan en la carpeta no se borran solos. La versión completa V6.09 mantiene la documentación unificada sólo en `README.md`.

## Validación V6.09

- Sintaxis JS validada con `node --check`.
- JSON de `data/` parseados correctamente.
- ZIP completo verificado sin documentos separados de revisión, versión o características.
- ZIP incremental preparado sólo con archivos necesarios para este cambio.
