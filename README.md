# Una Vida de Mánager · V8.80 incremental

Aplicar sobre una instalación completa de **V8.79**.

## Escudos de clubes

- Los escudos utilizan siempre ajuste proporcional `contain`.
- Se agrega margen interno para evitar que los bordes del archivo queden recortados por los contenedores redondeados.
- La corrección alcanza las vistas generales, fichas de club, competiciones, desafíos online, selección de club y clubes fundados.

## Ofertas laborales con contrato vigente

- Los clubes pueden enviar ofertas aunque el mánager ya tenga trabajo.
- Las propuestas aparecen en **Carrera → Ofertas laborales**, debajo del contrato actual.
- Se reutilizan los criterios existentes de prestigio, rendimiento reciente, capacidades, compatibilidad con el proyecto, posición en la tabla y necesidad deportiva del club.
- El club actual queda excluido de las propuestas.
- Primera revisión estimada: entre 25 y 55 días.
- Espera habitual entre propuestas: entre 35 y 75 días.
- Máximo por temporada: 4 ofertas generadas.
- Máximo simultáneo: 2 ofertas activas.

## Plazo para responder

Cada propuesta vence entre **10 y 30 días**.

El plazo se reduce cuando:

- El equipo está en una zona baja o crítica de la tabla.
- La oferta llega durante la pretemporada.
- La oferta llega durante la mitad de temporada.
- La temporada está cerca de finalizar.

La tarjeta muestra la urgencia, el contexto del calendario, la fecha de vencimiento y los días restantes.

## Aceptar o rechazar

- Rechazar elimina únicamente esa propuesta.
- Una oferta vencida desaparece y genera un mensaje informativo.
- Aceptar solicita confirmación porque termina inmediatamente el vínculo con el club actual.
- La carrera continúa en la misma fecha y temporada.
- El ciclo anterior se archiva como **Cambio de club**.
- Se crea el nuevo contrato con su sueldo, duración, objetivo y porcentaje de futuras ventas.
- Las demás ofertas activas se retiran después de aceptar un cargo.

## Configuración

Los límites se encuentran en `balance-manager.js`, dentro de:

`contratosManager.mercadoLaboralRealista.ofertasDuranteContrato`

## Compatibilidad

Compatible con partidas V8.79 ya iniciadas. Al cargar una partida existente se programa la primera revisión futura del mercado laboral; no se generan ofertas retroactivas.
