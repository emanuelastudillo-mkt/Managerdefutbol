# Revisión de código V6.04

## Objetivo

Aplicar tres ajustes sobre V6.03:

1. Mostrar en el Centro de Ojeo la probabilidad de fichaje.
2. Convertir el avance automático en un switch ON/OFF claro.
3. Cambiar el ranking para subir y ordenar la carrera completa del mánager sin duplicados visibles.

## Cambios técnicos

### Ojeo

- Se agregaron funciones auxiliares:
  - `scoutingPlayerSigningChance`;
  - `scoutingPlayerSigningChanceLabel`;
  - `scoutingPlayerSigningChanceTone`;
  - `scoutingPlayerSigningChanceMarkup`.
- El cálculo reutiliza `marketPlayerAcceptanceChance(player)`.
- Se integró el dato en:
  - tarjetas activas del Centro de Ojeo;
  - tabla de informes guardados.

### Avance automático

- Se modificó el markup de `managerOfficeMarkup` en `js/ui/06-render-home-messages.js`.
- Se actualizó `updateAdvanceAutoClickerButton` para manejar clases `is-on`, `is-off`, `is-disabled` y `aria-pressed`.
- Se agregaron estilos nuevos en `style.css`.

### Ranking

- Se agregó construcción de payload de carrera:
  - `rankingCareerSeasons`;
  - `rankingCareerInitialBudget`;
  - `rankingBestCareerPosition`;
  - `rankingCareerClubNames`;
  - `rankingCareerRecord`;
  - `calculateCareerManagerScore`.
- `buildRankingPayload` usa por defecto `recordScope: "career"`.
- La clave de envío estable es `SAVE-CODE-CAREER`.
- Se agregaron campos de carrera a `rankingPayloadToApiBody`.
- La tabla pública deduplica con `dedupeRankingRows` antes de ordenar.
- Se prioriza `/ranking/career` en `config.js`.
- Se actualizó `apps-script-ranking.gs` para una fila por carrera.

## Validaciones

- `node --check` ejecutado sobre JS modificados.
- JSON de `data/` validado con parseo completo.
- ZIP incremental y completo generados desde V6.03.
