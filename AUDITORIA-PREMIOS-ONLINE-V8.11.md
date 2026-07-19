# Auditoría V8.11 · Ciclos y premios de Competencias Online

## Alcance

- ciclos globales de 10 días reales;
- clasificaciones independientes A, N, P, C, E y L;
- mínimo de 10 partidos y 5 rivales distintos;
- premios de puntos de habilidad;
- reclamo autenticado y único en D1;
- conservación del historial y desafíos existentes.

## Premios

| Categorías | 1.º | 2.º | 3.º |
|---|---:|---:|---:|
| A, N, P, C y E | 3.000 | 1.500 | 750 |
| L | 6.000 | 2.500 | 1.000 |

## Modelo temporal

- Epoch: `2026-07-19T00:00:00.000Z`.
- Duración: 10 días exactos.
- Identificador: `FM10D-0001`, `FM10D-0002`, etc.
- Los partidos anteriores al epoch no participan de premios, pero permanecen en el historial general.

## Seguridad

El Worker recalcula la tabla desde los resultados almacenados en `DESAFIOS_DB`. El cliente no decide la posición ni el importe.

La tabla `fm_online_reward_claims_v1` utiliza una restricción única sobre:

```text
user_id + cycle_id + category_code
```

La clasificación de cada ciclo cerrado se congela en `fm_meta_v2`. Los premios no vencen y permanecen disponibles hasta ser reclamados.

El cliente sólo acredita el premio cuando recibe `newlyClaimed: true`.

## Compatibilidad

No se modifica el esquema de partidas locales. La única migración corresponde a la base D1 principal del Worker y agrega una tabla independiente de reclamos.
