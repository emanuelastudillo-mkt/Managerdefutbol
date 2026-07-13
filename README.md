# Fútbol Manager MVP - V7.08

## V7.08 - Premios y fechas del Mundial de Clubes

Esta versión parte de la V7.07 definitiva y mantiene las tácticas variables de los equipos bots, el ranking online, el guardado doble seguro y las migraciones anteriores.

### Premio de participación

El premio de participación de la Copa Mundial de Clubes de la FIFA sólo se acredita cuando el club dirigido figura realmente dentro de los 32 participantes de esa edición.

La comprobación se realiza en dos niveles:

- Al crear el torneo, antes de intentar pagar el premio.
- Dentro de la función general de premios, para impedir pagos a clubes ajenos a la competición aunque otra llamada intente concederlos.

Un club que no se clasificó no puede cobrar premios de participación, clasificación de grupos, cuartos, semifinal, subcampeonato o campeonato.

### Reparación de partidas con un premio incorrecto

Al cargar una partida anterior se revisa el premio de participación de la edición activa.

Si el club dirigido no aparece entre los participantes pero recibió el premio por el error anterior:

- Se elimina el registro de premio pagado.
- Se descuenta del presupuesto el importe acreditado incorrectamente.
- Se sincroniza el presupuesto del club.
- Se registra el movimiento en el historial financiero.
- Se agrega un mensaje explicando la corrección.
- La reparación queda marcada para no ejecutarse dos veces.

La corrección sólo se aplica cuando existe una lista válida de participantes y un pago de participación registrado para el club no clasificado.

### Fechas de la fase de grupos

Las tres fechas de grupos continúan programándose con cinco días de separación:

- Fecha 1: fecha inicial del torneo.
- Fecha 2: cinco días después.
- Fecha 3: diez días después de la primera.

La fecha autorizada para cada partido ahora se obtiene del calendario oficial guardado en el estado del Mundial, usando el número de jornada de grupos. De esta forma, una fecha incorrecta o antigua dentro de un partido no puede adelantar su simulación.

Además, cada ejecución del calendario puede resolver como máximo una jornada pendiente de la fase de grupos. Esto impide que las fechas 1, 2 y 3 se simulen juntas al llegar a la primera fecha.

Si una partida quedó atrasada respecto del calendario, las jornadas pendientes se procesan ordenadamente, una por cada avance, empezando siempre por la más antigua.

### Tácticas variables de equipos bots

Se conserva sin cambios la alternancia incorporada en V7.07 entre los perfiles:

- Equilibrado.
- Posesión.
- Presión alta.
- Juego directo.
- Juego abierto.
- Contraataque.
- Defensivo.
- Cauto.

### Ofrecer a clubes

Se mantiene la lógica original restaurada en V7.07. No existen ofertas garantizadas para fechas futuras.

### Ranking online y Cloudflare

No se modificó la API del ranking. No es necesario actualizar nuevamente el Worker de Cloudflare.

La carpeta `cloudflare-ranking` conserva el Worker operativo V7.06.3 con el binding:

```text
db -> ranking_manager_db
```

### Archivos principales modificados en V7.08

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `simulador-2.0.js`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`

### Compatibilidad de partidas

**V7.08 no rompe partidas anteriores.** Conserva planteles, calendarios, estadísticas, títulos y progreso. Las partidas afectadas por el premio de participación incorrecto ajustan únicamente ese importe y guardan la reparación para no repetirla.
