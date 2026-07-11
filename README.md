# Fútbol Manager MVP - V6.11

## Estado de la versión

Esta versión toma como base la **V6.10**. La documentación se mantiene unificada en este `README.md`: no se entregan archivos separados de revisión, versión o características.

La versión vigente se identifica desde:

- `README.md`
- `config.js`
- `index.html`

## V6.11 - Sponsors, Home e instrucciones extremas

### Cambios principales

- El sponsor especial ahora muestra el monto exacto del bono que pagará si se cumple el objetivo.
- En Inicio se reemplazó el segundo bloque de **Próximo partido** por una vista compacta de la tabla de posiciones.
- La tabla compacta muestra al club propio y su zona inmediata: el equipo de arriba y el de abajo; si el club está primero o último, mantiene tres equipos mostrando los dos más cercanos.
- El simulador vivo incorpora el nuevo orden de instrucciones: **Sin instrucciones**, **Todos a defender**, **Cuidar el resultado**, **Contraataque**, **Bajar el ritmo**, **Jugar limpio**, **Luchar**, **Ataque** y **Gol como sea!**.
- **Gol como sea!** aumenta fuerte la búsqueda de ocasiones, pero también deja más ataques rivales.
- **Jugar limpio** reduce fuerte la probabilidad de tarjetas y mejora el control de la pelota.
- **Contraataque** baja la posesión y el volumen, pero mejora la peligrosidad de las llegadas claras.
- **Bajar el ritmo** reduce ataques, posesión, disparos/ocasiones y también baja el riesgo de lesión propia.
- El botón **Auto** del simulador ahora dice **Avance automático**.
- Se ajustó la disposición para centrar el botón **Cerrar y guardar**.

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



### V6.10 - Ajustes del Modo Bancarrota

- El modo **Bancarrota, Renacer - Libre** quedó definido como modo libre en bancarrota, no como modo difícil separado.
- Permite elegir cualquier club disponible en la base, sin bloqueo por prestigio del mánager.
- El club elegido inicia con caja negativa, estadio sin capacidad disponible, prestigio reducido, hinchas reducidos, plantel profesional reducido y academia juvenil de emergencia.
- La primera temporada tiene objetivo fijo: **no descender**.
- El campo de juego inicial queda al **100%**.

## Archivos modificados en V6.11

- `index.html`
- `config.js`
- `README.md`
- `style.css`
- `simulador-2.0.js`
- `js/game/08-sponsors-stadium-stats.js`
- `js/game/17-live-match.js`
- `js/ui/06-render-home-messages.js`

## Instalación

Para instalación limpia, subir todo el contenido del ZIP completo **V6.11**.

Para actualizar desde V6.10, aplicar el ZIP incremental **V6.11** sobre la carpeta existente y forzar recarga del navegador.

Si se actualiza con incremental, los archivos documentales viejos que ya existan en la carpeta no se borran solos. La versión completa V6.11 mantiene la documentación unificada sólo en `README.md`.

## Validación V6.11

- Sintaxis JS validada con `node --check`.
- JSON de `data/` parseados correctamente.
- ZIP completo verificado sin documentos separados de revisión, versión o características.
- ZIP incremental preparado sólo con archivos necesarios para este cambio.
