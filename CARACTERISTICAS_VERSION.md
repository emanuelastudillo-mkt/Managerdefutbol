# V4.18 - Calendario diario 365 días

## Cambios

- Se reestructura el calendario para que la temporada use 365 días fijos.
- Cada avance interno equivale a 1 día calendario.
- La pretemporada dura 30 días.
- La liga regular se juega una fecha por semana.
- Se agrega una pausa de mitad de temporada luego de la fecha 17.
- La pausa queda en 28 días para conservar viernes, sábado y domingo como días estables de partido.
- `Ir a próximo partido` usa el bloqueo de 120 segundos para avanzar automáticamente los días hasta el partido propio.
- Durante ese avance automático se procesan entrenamientos, academia, cooldowns, lesiones, obras, sponsors, préstamos y partidos bot.
- Los partidos bot atrasados se simulan automáticamente al avanzar día.
- El partido propio no se simula mezclado con todo el calendario: queda disponible cuando llega su día.
- Las fechas bot se siguen distribuyendo así:
  - Viernes: España, Italia, Inglaterra y Rumania.
  - Sábado: Segunda y Tercera Argentina.
  - Domingo: Chile, Brasil y Primera Argentina.
- Las lesiones nuevas registran recuperación por día calendario.
- Los playoffs argentinos IDA/VUELTA se ubican después de la fecha 34.

## Seguridad

- El cambio migra el calendario al cargar.
- No borra jugadores, economía ni resultados jugados.
- Los resultados ya jugados se conservan por `match.id` cuando se regenera la grilla de fechas.
- Si una partida ya tenía calendario viejo, las fechas futuras se reordenan al nuevo esquema diario.

## Compatibilidad

- Puede dar problemas menores en partidas ya avanzadas porque cambia la estructura temporal completa.
- No requiere reinicio obligatorio.
- Recomendado guardar/exportar la partida antes de aplicar.
- Para testear el calendario completo de 365 días, lo más limpio es una partida nueva.
