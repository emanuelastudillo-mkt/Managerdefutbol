# Características V4.26 - Balance físico postpartido

- Se reduce la recuperación automática que el juego aplica al terminar un partido.
- Antes el motor sumaba aproximadamente `+12 a +18` físico antes de descontar el desgaste.
- Ahora suma aproximadamente `+4 a +6`, equivalente a un tercio.
- Se aumenta el desgaste base de los jugadores de campo por jugar un partido.
- Antes el desgaste base era aproximadamente `-15 a -20`.
- Ahora pasa a aproximadamente `-24 a -45`.
- En condiciones extremas el desgaste puede acercarse a `-75` físico:
  - desgaste base máximo;
  - campo injugable;
  - instrucción táctica exigente;
  - estilo sectorial de alto cansancio.
- El cálculo queda configurable en `config.js > simulador`:
  - `recuperacionAutomaticaPostPartidoMin`;
  - `recuperacionAutomaticaPostPartidoMax`;
  - `desgastePartidoMin`;
  - `desgastePartidoMax`;
  - `factorDesgasteArquero`.
- No se modifica la recuperación diaria por entrenamientos ni el calendario.
