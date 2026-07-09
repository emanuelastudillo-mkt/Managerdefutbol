# V4.13 - Verificador seguro de estructura

## Cambios principales

- Se agrega un botón inferior: `Verificar que todo esté bien`.
- El botón abre un reporte de integridad de partida.
- El chequeo no modifica nada al abrirse.
- Detecta clubes ubicados en divisiones de otro país.
- Detecta overrides de división inválidos o cruzados entre países.
- Detecta jugadores apuntando a clubes inexistentes.
- Detecta entradas de tabla con clubes inexistentes.
- Detecta fixtures con clubes cruzados de país respecto de la división del partido.
- Muestra cantidad de clubes por división para revisar rápidamente mezclas raras.
- Si hay reparaciones seguras disponibles, permite aplicarlas desde el modal.

## Reparación segura

- Reasigna clubes que quedaron en una división de otro país.
- Elige una división válida del país real del club.
- Regenera `clubDivisionOverrides` para evitar que el error vuelva a aparecer al cargar.
- Actualiza la liga seleccionada si el club afectado es el club del manager.
- Guarda automáticamente la reparación.

## Límites de seguridad

- No reconstruye calendario.
- No borra resultados jugados.
- No reinicia temporada.
- No modifica ascensos/descensos ya cerrados.
- No borra jugadores ni mercado libre desde este botón.

## Archivos modificados

- `index.html`
- `config.js`
- `VERSION.md`
- `README.md`
- `CARACTERISTICAS_VERSION.md`
- `style.css`
- `js/game/05-state-season.js`

## Validaciones

- Sintaxis validada en `config.js`.
- Sintaxis validada en todos los archivos `.js`.
- El cambio no requiere reinicio de partida.
