# Versión actual

V5.63

## Cambios
- Agrega verificador/reparador automático cada 5 días de juego.
- Revisa partidos bot con datos mínimos faltantes, planteles bot y calendario de postemporada.
- En postemporada valida fecha de inicio, duración total y fecha visible para evitar contadores inflados o días congelados.
- Guarda resumen interno en `game.scheduledVerifierState` y log acotado en `game.scheduledVerifierLog`.
