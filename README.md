# Fútbol Manager MVP - V7.02

## V7.02 - Guardado doble seguro y retos configurables

Esta versión parte de V7.01 y mantiene intacta la estructura principal de las partidas.

### Guardado local

- El slot principal dejó de escribirse tres veces y ahora mantiene dos copias actualizadas: una principal y una de respaldo.
- La Carrera 1 conserva `main` como segunda copia. Esto mantiene compatibilidad con el formato histórico y permite recuperar partidas anteriores.
- Las Carreras 2 a 5 y el reto utilizan una clave de respaldo propia.
- Al cargar, el juego revisa la copia principal, la copia de respaldo y, para Carrera 1, la antigua clave `slot:career`.
- Si la copia principal falta o no es válida, se recupera automáticamente la mejor copia disponible y se regeneran las dos copias vigentes.
- Cada guardado nuevo incorpora fecha, versión de esquema y slot dentro de `localSaveMeta` para elegir correctamente la copia más reciente.
- Al borrar un slot se eliminan también sus respaldos, evitando que una partida eliminada reaparezca.

Este sistema reduce de tres a dos escrituras en Carrera 1. La mejora de rendimiento es moderada porque el contenido completo de la partida sigue duplicándose deliberadamente para priorizar seguridad.

La copia doble protege frente a claves ausentes, datos inválidos y migraciones internas, pero no puede recuperar información si el usuario borra todos los datos del sitio o elimina el perfil del navegador.

### Retos desde JSON

- `data/retos_manager.json` ahora se carga al iniciar el juego.
- El reto Campo destruido obtiene desde el JSON sus clubes, calendario, cantidad de partidos, estado del campo, reducción del plantel, cohesión, condición, moral, lesión de Maradona, tabla inicial, bloqueos, objetivo, notas y textos de interfaz.
- El código JavaScript conserva únicamente la implementación del comportamiento del reto.
- Si el JSON falta o no contiene un preset activo, el reto no se ofrece como disponible en lugar de usar una definición duplicada dentro del código.
- El archivo queda preparado para incorporar nuevos retos configurables.

### Instalaciones

- `data/instalaciones.json` se conserva sin cambios como archivo reservado para el futuro sistema de instalaciones.

### Limpieza de comentarios

- Se retiraron etiquetas históricas V3, V4, V5 y V6 de comentarios internos.
- Se conservaron las explicaciones técnicas útiles sin referencias a versiones antiguas.
- Esta limpieza reduce levemente el tamaño transferido y mejora la lectura del código; no produce una mejora perceptible en la ejecución.

### Archivos modificados en V7.02

- `README.md`
- `index.html`
- `app.js`
- `config.js`
- `data/retos_manager.json`
- `js/core/01-config-constants.js`
- `js/data/04-data-storage.js`
- `js/game/05-state-season.js`
- `js/ui/06-render-home-messages.js`
- `js/ui/12-modals.js`
- Otros archivos JavaScript sólo recibieron limpieza de etiquetas históricas en comentarios.

### Compatibilidad de partidas

**V7.02 no rompe partidas anteriores.** Puede cargar partidas V7.01 y anteriores desde `slot:career:1`, `main` o `slot:career`. Al primer guardado, la partida queda actualizada al sistema de dos copias. Volver luego a una versión antigua puede mostrar el último estado escrito en `main` para Carrera 1, pero las versiones antiguas no conocen los respaldos de los demás slots.
