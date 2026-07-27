# Una vida de manager — V8.70

## Base requerida

Aplicar este incremental sobre **V8.69**.

## Segunda etapa del sistema de carrera

### Confianza individual

- Cada jugador del primer equipo incorpora una confianza en el mánager entre 0 y 100.
- La confianza se guarda por club, temporada y etapa contractual del mánager.
- Al continuar en el mismo club, parte de la relación de la temporada anterior se conserva, acercándose moderadamente a un valor neutral.
- Los estados visibles son Respaldo, Estable, Dudas, Tensión y Fracturado.
- La ficha del jugador muestra su confianza, grupo, rol interno y predisposición a renovar.

### Grupos del vestuario

- El plantel se organiza automáticamente en Titulares, Rotación, Suplentes y Jóvenes.
- Los grupos se actualizan según la táctica, titularidades, partidos disputados y edad.
- Se muestra la confianza promedio de cada grupo y una confianza general ponderada por influencia.
- Se agrega el submenú **Vestuario** dentro de Primer equipo.

### Referentes y capitanes

- Cada plantel posee entre 2 y 4 referentes.
- La selección considera capacidad de capitán, progreso como capitán, media, edad, participación y continuidad.
- El capitán actual tiene prioridad como referente.
- Cambiar de capitán sin una causa deportiva clara puede afectar al capitán anterior y al resto de los referentes.
- Vender, despedir o declarar transferible a un referente genera consecuencias en el vestuario.

### Resultados, participación y confianza

- Las victorias aumentan más la confianza de titulares y jugadores utilizados.
- Las derrotas, derrotas amplias y falta prolongada de minutos pueden reducirla.
- Utilizar suplentes y jóvenes favorece su relación con el mánager.
- Cada partido oficial se procesa una sola vez para evitar cambios duplicados.

### Efectos sobre moral y cohesión

- Los cambios relevantes de confianza pueden modificar moderadamente la moral individual.
- Un vestuario con respaldo puede sumar cohesión después de una victoria.
- Un vestuario con dudas, tensión o fractura puede perder cohesión después de una derrota.
- Los efectos son limitados y no reemplazan la calidad del plantel ni la táctica.

### Renovaciones y solicitudes de salida

- La confianza modifica la predisposición anual a renovar.
- Los jugadores con dudas o tensión pueden exigir un salario mayor.
- La exigencia adicional puede ser de aproximadamente 5%, 10% o 15% según el nivel de conflicto.
- Un jugador con la relación fracturada puede solicitar ser transferido.
- El resultado anual de la renovación queda guardado en su historial de vestuario.

### Evolución de Liderazgo

- La evaluación anual de Liderazgo ahora utiliza:
  - 45% confianza general del vestuario.
  - 20% confianza de los referentes.
  - 20% moral del plantel.
  - 15% cohesión del equipo.
- Un vestuario fracturado aplica una penalización adicional.
- El resumen del vestuario queda vinculado al historial de temporada del mánager.

## Compatibilidad

- Compatible con partidas existentes de V8.69.
- Las partidas antiguas inicializan el vestuario al cargarse sin borrar estadísticas ni relaciones existentes del juego.
- No requiere Worker, SQL ni recursos gráficos.

## Archivos modificados

- `README.md`
- `config.js`
- `index.html`
- `js/game/05j-manager-career-stage-one.js`
- `js/game/05k-manager-dressing-room.js`
- `styles/150-manager-dressing-room.css`
