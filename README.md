# Una Vida de Mánager · V8.82

## Corrección del calendario con copas nacionales

Se corrigió un problema introducido al intercalar las rondas de copas nacionales dentro del calendario de liga.

El guardado utilizaba `matchdayIndex` como posición numérica dentro de `fixtures`. Al agregar, ordenar o cargar rondas de copa, esa posición podía desplazarse y dejar un partido de liga pendiente detrás del cursor. El partido seguía existiendo, pero dejaba de aparecer como próximo compromiso y la portada mostraba **Sin partido confirmado**.

### Cambios

- El cursor del calendario se reconstruye desde el primer encuentro realmente pendiente.
- Las búsquedas de próximo partido ya no ignoran encuentros anteriores al índice guardado.
- La simulación diaria revisa todas las rondas pendientes en orden cronológico.
- Al agregar una nueva ronda de copa se recalcula el cursor de forma segura.
- Las partidas afectadas se reparan automáticamente al cargarse.
- Un partido pendiente recuperado conserva su fecha original, sin hacer retroceder la fecha general de la partida.
- Después de jugar el encuentro recuperado, el calendario continúa con el siguiente compromiso normal.

## Separación entre liga y copas

- Las rondas de copas nacionales ya no se cuentan como fechas de liga regular.
- El cierre de la liga, la creación de playoffs argentinos y la última fecha regular se calculan únicamente con jornadas de liga.
- Mundial de Clubes, copas nacionales, supercopas y playoffs permanecen como competiciones independientes.

## Compatibilidad

Compatible con partidas V8.79, V8.80 y V8.81 ya iniciadas. No reinicia la temporada, no elimina resultados y no vuelve a simular partidos ya disputados.
