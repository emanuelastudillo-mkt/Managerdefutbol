# Una Vida de Mánager — V8.73 COMPLETA

Versión completa y autónoma del juego. No necesita aplicar incrementales anteriores.

## Instalación

1. Descomprimir `V8.73-COMPLETO.zip`.
2. Publicar todo el contenido de la carpeta `01-GITHUB-V8.73-COMPLETO` en el sitio.
3. Reemplazar los archivos existentes conservando la misma estructura de carpetas.
4. Recargar el navegador sin caché después de publicar.

## Contenido acumulado

Esta versión reúne todos los sistemas incorporados hasta V8.73, entre ellos:

- Carrera laboral, contratos, solicitudes, despidos y renuncias.
- Prestigio acumulativo, momento profesional y seis capacidades del mánager.
- Progresión larga con acceso gradual a clubes grandes y exigencia creciente en la élite.
- Historial de temporadas del mánager y registro anual de clubes.
- Objetivos deportivos cualitativos y posición mínima visible.
- Evaluaciones finales, parciales y resúmenes narrativos.
- Confianza individual, grupos de vestuario, referentes y capitanes.
- Consecuencias inmediatas y retrasadas sobre moral, cohesión y renovaciones.
- Eventos de carrera con respuesta, vencimiento y resolución posterior.
- Ofertas laborales según prestigio, momento, rendimiento reciente y compatibilidad de perfil.
- Tácticas predefinidas y táctica personalizada provisoria.
- Estadísticas de temporada y carrera por jugador.
- Mercado, contratos, sponsors, empleados, academia, instalaciones y estadio.
- Mundial de Clubes, desafíos online, modo fundador y cursos del mánager.
- Adaptaciones de interfaz y navegación para escritorio y dispositivos móviles.

## Ajustes específicos de V8.73

- El prestigio de carrera de 0 a 1.000 es la referencia central del acceso laboral.
- Un mánager nuevo conserva acceso inmediato a clubes pequeños.
- Las solicitudes a clubes superiores pueden aceptarse con objetivos y presupuestos más exigentes.
- La progresión se ralentiza de forma gradual al acercarse a la élite.
- Las temporadas mediocres pueden reducir prestigio y acceso cuando el mánager ya está consolidado.
- Momento, rendimiento reciente y compatibilidad continúan condicionando las ofertas aunque exista prestigio suficiente.
- Las capacidades tienen topes suaves, especialización y desgaste por falta de demostración.

## Correcciones de coherencia realizadas en la versión completa

- Se corrigió la identificación interna que todavía declaraba V8.70 y se unificó todo en V8.73.
- Se normalizaron las versiones de caché de datos y módulos para evitar cargas antiguas del navegador.
- Se eliminó la presentación paralela del antiguo prestigio por victorias y objetivos.
- Se retiraron premios y penalizaciones fijas duplicadas que ya forman parte de la evaluación integral de temporada.
- Los hitos de prestigio ahora utilizan la escala laboral vigente de 0 a 99.
- Se conservaron estructuras antiguas únicamente cuando son necesarias para migrar partidas guardadas.

## Compatibilidad

- Compatible con partidas de V8.72 y con partidas anteriores que atraviesen las migraciones incluidas.
- No reinicia prestigio, capacidades, historiales, vestuario ni eventos de carrera existentes.
- No requiere cambios de Worker, SQL ni base de datos externa.
- No incorpora recursos gráficos adicionales.

## Revisión técnica

Se verificaron:

- Sintaxis de todos los archivos JavaScript.
- Carga ordenada de los 49 módulos utilizados por `index.html`.
- Validez de todos los archivos JSON.
- Referencias internas de scripts, estilos y recursos declarados en HTML.
- Ausencia de identificadores HTML duplicados e importaciones repetidas.
- Coherencia de clubes, divisiones, jugadores base y jugadores manuales.
- Unicidad de identificadores de jugadores.
- Planteles base de 25 jugadores por club.
- Configuración y rutas de datos normalizadas a V8.73.
- Progresión laboral inicial, solicitudes de alto riesgo y bloqueo de clubes de élite para mánagers nuevos.
- Objetivos cualitativos, vestuario, referentes y estado de eventos de carrera.
- Aplicación acumulativa de las modificaciones hasta V8.73.

La revisión estática y las pruebas funcionales automatizadas reducen errores de integración, pero no sustituyen una prueba manual completa de todas las combinaciones posibles dentro de una carrera extensa.
