# Una Vida de Mánager · V8.77 incremental

Aplicar sobre **V8.76** conservando la estructura de carpetas.

## Renovaciones visibles desde la ficha

- La renovación continúa disponible desde **Primer equipo → Contratos**.
- Se corrigió el acceso desde la ficha horizontal del jugador, que todavía buscaba la estructura anterior a V8.74.
- La ficha de un jugador del club dirigido muestra ahora:
  - temporada de vencimiento;
  - tiempo restante;
  - predisposición contractual;
  - botón **Negociar renovación**.
- El botón permanece visible pero desactivado cuando:
  - restan más de dos temporadas;
  - la confianza no permite extender el contrato actual;
  - existe un bloqueo temporal después de una propuesta rechazada.
- En esos casos se muestra el motivo o la fecha en la que puede retomarse la negociación.

## Funcionamiento de la negociación

- Se elige la duración permitida por confianza y edad.
- Se selecciona una propuesta salarial ajustada, recomendada o generosa.
- Antes de enviarla se informa el salario propuesto y la probabilidad estimada de aceptación.
- El descontento eleva la exigencia, limita los años disponibles y reduce la posibilidad de aceptación.
- Una relación positiva facilita la renovación y habilita contratos más largos.

## Compatibilidad

- Compatible con partidas de V8.76.
- No modifica contratos ya firmados ni reinicia intentos anteriores.
- No requiere cambios de Worker, SQL ni recursos gráficos.

## Archivos modificados

- `config.js`
- `index.html`
- `js/game/05n-player-contracts.js`
- `styles/185-player-contracts-groups.css`
