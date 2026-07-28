# Una Vida de Mánager · V8.79 incremental

## Copas nacionales

- Copa Argentina, Copa Chile, Copa del Rey, Copa Rumana, FA Cup y Copa Brasil.
- Sorteos durante los días 20, 21, 22, 23, 24 y 25.
- Copa Argentina: 54 participantes; 10 clasificados directamente y 44 equipos en fase previa.
- Las demás copas: 18 participantes; 14 clasificados directamente y 4 equipos en fase previa.
- Rondas en el primer miércoles de marzo, mayo, junio, agosto, septiembre y octubre.
- Las seis finales se disputan en octubre.
- Partidos únicos en estadios neutrales de clubes con buena reputación, sin bonificación de localía.
- Distribución inicial de la capacidad entre ambas hinchadas y reasignación de lugares libres para intentar completar el estadio.
- Entradas de $200, $250, $300, $350, $500 o $1,000 según la instancia.
- El ganador de cada partido recibe el 100% de la recaudación.
- Todos los empates se definen mediante tanda de penales.

## Supercopas

- Se juegan durante el día 300.
- Participan el campeón de liga y el campeón de copa de cada país.
- Si un club gana ambas competiciones, participa el siguiente equipo mejor ubicado de la liga.
- Se disputan en el estadio de mayor capacidad del país, sin localía de los participantes.
- Entrada de $1,000 y recaudación completa para el ganador.
- Se registran como títulos oficiales, pero aportan menos valor al legado del mánager que los demás campeonatos.

## Integración

- 144 partidos oficiales nuevos por temporada: 138 de copas nacionales y 6 supercopas.
- Nueva vista `Competiciones → Copas nacionales` con llaves, fechas, resultados, campeones y supercopas.
- Los partidos no alteran las tablas ni los goles de liga.
- Los campeones quedan registrados en el historial de competiciones y, cuando corresponde, en los títulos del mánager.
- Calendario, simulación rápida, simulación completa, partidos en vivo, economía, guardados y migraciones integrados.
- Puede desactivarse mediante `calendario.copasNacionalesActivas` en `config.js`.

Compatible con partidas V8.78. Si una partida existente ya superó la primera ronda prevista al instalar V8.79, esa copa no reescribe el pasado y comienza normalmente desde la temporada siguiente.
