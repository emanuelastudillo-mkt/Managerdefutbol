# V8.73 — Progresión larga de la carrera del mánager

Incremental acumulativo para aplicar sobre V8.72.

## Objetivo

Extender la progresión profesional para que un mánager necesite aproximadamente diez temporadas destacadas para acceder con regularidad a los grandes clubes, sin impedir que una partida nueva comience de inmediato en instituciones pequeñas.

## Cambios principales

### Prestigio unificado

- El prestigio acumulativo de carrera, de 0 a 1.000, pasa a ser la única fuente activa para el acceso laboral.
- Se conserva la información antigua únicamente para migración y compatibilidad.
- Las victorias ya no otorgan una segunda ganancia paralela: forman parte de la evaluación final de temporada.
- Los eventos que modificaban prestigio se redirigen al perfil acumulativo.

### Curva de progresión

- Un mánager nuevo comienza con 100 puntos de prestigio y capacidades cercanas a 35.
- La progresión es más rápida durante la formación y disminuye gradualmente a partir de 400, 600, 750, 850 y 900 puntos.
- Una trayectoria fuerte puede alcanzar acceso amplio alrededor de la décima temporada.
- El acceso de carrera se convierte a la escala de reputación de clubes de 0 a 99.

### Dificultad para sostener la élite

- Desde 650 puntos aparece una evaluación mínima de mantenimiento.
- Desde 800 y 900 puntos las temporadas aceptables o mediocres pueden reducir prestigio, aunque no exista despido.
- Los despidos y renuncias reducen con mayor intensidad el momento profesional y la estabilidad.
- El momento conserva sólo el 65% de su valor entre evaluaciones.
- Las potencias exigen prestigio, momento positivo, rendimiento reciente y compatibilidad de perfil.

### Capacidades acumulativas

- Las seis capacidades utilizan topes suaves a partir de 60, 70, 80 y 90.
- El crecimiento normal queda limitado a 3 puntos por temporada y el excepcional a 5.
- Tener más de dos especializaciones superiores a 75 reduce el crecimiento restante.
- Las capacidades altas pueden desgastarse cuando dejan de demostrarse.

### Mercado laboral inicial

- Los clubes de reputación 20 o menor pueden enviar ofertas desde el comienzo de la carrera.
- Si no existen candidatos compatibles, el mercado conserva clubes pequeños como respaldo para que el jugador pueda empezar.
- Un mánager nuevo puede solicitar trabajo en clubes entre 8 y 12 puntos por encima de su acceso actual.
- Estas solicitudes tienen mayor probabilidad de rechazo y, si son aceptadas, generan contratos de alto riesgo.
- Los contratos ambiciosos aplican objetivos entre 0,28 y 0,55 puntos por partido más exigentes y presupuestos de pases reducidos al 3%–10%.

### Expectativas

- Un mánager prestigioso que llega a un club inferior aumenta las expectativas de la directiva.
- El objetivo puede sumar hasta 0,18 puntos por partido según la diferencia entre el nivel del mánager y el del club.

## Compatibilidad

- Compatible con partidas guardadas de V8.72.
- No reinicia prestigio, historiales, capacidades, vestuario ni eventos de carrera existentes.
- No requiere cambios de Worker, base de datos, SQL ni recursos gráficos.

## Archivos modificados

- `index.html`
- `config.js`
- `js/game/05-state-season.js`
- `js/game/05a-manager-contracts.js`
- `js/game/05b-manager-challenges.js`
- `js/game/05c-manager-job-market.js`
- `js/game/05j-manager-career-stage-one.js`
- `js/game/05l-manager-career-stage-three.js`
- `js/game/05m-manager-career-events.js`
- `js/game/14-eventos.js`

## Verificaciones

- Sintaxis de todos los archivos JavaScript.
- Progresión de diez temporadas.
- Simulación de cincuenta temporadas con campañas buenas, medias, crisis y recuperaciones.
- Caída de prestigio y momento después de un despido en la élite.
- Ofertas iniciales de clubes pequeños.
- Solicitudes ambiciosas, rechazo y condiciones de alto riesgo.
- Eventos de carrera, vencimientos, consecuencias retrasadas y cierre narrativo.
