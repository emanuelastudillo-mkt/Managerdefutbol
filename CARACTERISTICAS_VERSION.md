# Características de la versión V3.28

La V3.28 agrega el sistema **ESPECIAL**, con cartas, sobres, puntos ocultos y bonos acumulables para el manager.

## Menú ESPECIAL

El menú lateral ahora incluye la sección **ESPECIAL**. Dentro se muestran:

- nombre del manager;
- puntos de habilidad acumulados;
- cartas activas;
- cartas en reserva;
- sobres disponibles;
- últimas cartas abiertas;
- bonus activos.

## Puntos ocultos

El manager acumula puntos de habilidad sin que el origen se detalle en pantalla. Estos puntos se usan para abrir sobres.

Acciones integradas:

- ganar partido;
- empatar partido;
- salir campeón;
- tratar lesionados;
- meter más de 5 goles;
- regar o parchar el campo;
- consultar juveniles.

## Cartas y sobres

Se cargan desde `data/habilidades_especiales.json`.

Hay tres sobres:

- Sobre Común;
- Sobre Raro;
- Sobre Épico.

Las cartas pueden ser:

- inútiles;
- comunes;
- raras;
- épicas;
- legendarias.

## Límites

- Máximo de 5 cartas activas.
- Máximo de 50 cartas en reserva.
- Las cartas activas pueden repetirse si son instancias distintas.
- Activar o desactivar una carta bloquea cambios durante 100 días.

## Bonus implementados

- **Sponsors extra**: aumenta el valor de nuevas ofertas de sponsors.
- **Deterioro de campo**: reduce el deterioro del campo propio cuando se juega de local.
- **Probabilidad legendaria**: aumenta de forma relativa la probabilidad de cartas legendarias al abrir sobres.

## Destrucción de cartas

Las cartas en reserva pueden destruirse para recuperar puntos según rareza. Las cartas activas no se destruyen: primero deben desactivarse.
