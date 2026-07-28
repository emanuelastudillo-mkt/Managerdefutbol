# Una Vida de Mánager — V8.71

## Base requerida

Aplicar este incremental sobre **V8.70**.

## Tercera etapa del sistema integral de carrera

### Ofertas laborales según el perfil

- Los clubes ya no valoran únicamente el prestigio general del mánager.
- Cada institución determina el perfil que necesita según su situación deportiva, económica y estructural:
  - Rendimiento inmediato.
  - Liderazgo de vestuario.
  - Gestión económica.
  - Desarrollo de jugadores.
  - Manejo de crisis.
  - Estabilidad del proyecto.
- La compatibilidad entre club y mánager se calcula de 0 a 100 usando:
  - 30% adecuación entre prestigio del club y trayectoria del mánager.
  - 25% evaluaciones de las últimas tres etapas dirigidas.
  - 20% capacidad profesional requerida por el club.
  - 10% experiencia en la liga o país.
  - 10% estabilidad profesional.
  - 5% momento profesional actual.
- Las ofertas automáticas priorizan clubes que consideran compatible al mánager.
- Las solicitudes laborales muestran la compatibilidad y el perfil buscado.
- Una buena compatibilidad reduce moderadamente la posibilidad de rechazo; una muy baja la aumenta.
- Se mantienen los filtros existentes por prestigio, clubes bloqueados, clubes sin liga e invitaciones especiales.

### Consecuencias retrasadas

- Se incorpora un registro persistente de decisiones con efectos que pueden resolverse días o semanas después.
- Se contemplan inicialmente:
  - Venta de un referente o capitán.
  - Despido de un referente o capitán.
  - Referente declarado transferible durante varias semanas.
  - Cambio de capitán.
  - Promoción de un juvenil al primer equipo.
- El efecto final depende del contexto posterior:
  - Resultados recientes.
  - Continuidad de la decisión.
  - Influencia de los protagonistas.
  - Minutos otorgados a los juveniles.
- Las consecuencias pueden afectar confianza, moral, cohesión y predisposición a renovar.
- Si el mánager abandona el club antes de la resolución, la consecuencia permanece como parte de la historia del club pero no modifica el nuevo vestuario.
- Se evita programar dos veces la misma consecuencia.
- Se conservan hasta 180 registros para limitar el tamaño de la partida.

### Revisión contextual de objetivos

- El objetivo deportivo puede revisarse durante la temporada por cambios estructurales verificables.
- La primera revisión puede producirse desde el día 75 y con un mínimo de ocho partidos disputados.
- Se analiza el contexto cada 21 días.
- Deben transcurrir al menos 60 días entre dos modificaciones efectivas.
- Se permiten como máximo dos revisiones por temporada.
- La variación acumulada máxima es de ±0,24 puntos por partido.
- La exigencia puede aumentar cuando coinciden mejoras relevantes del plantel, economía o rendimiento sostenido por encima de la expectativa.
- La exigencia puede disminuir ante pérdida de nivel, deterioro económico o una cantidad importante de lesiones largas.
- Los malos resultados por sí solos no reducen automáticamente el objetivo.
- Cada cambio informa el motivo, el objetivo anterior, el nuevo objetivo cualitativo y su posición mínima.
- La pantalla de Inicio conserva una referencia breve al último motivo de revisión.

### Resumen narrativo completo

- Cada cierre de temporada, renuncia o despido genera un resumen narrativo permanente.
- El informe incluye:
  - Título y balance general de la etapa.
  - Cumplimiento del objetivo.
  - Mejor resultado registrado.
  - Peor resultado registrado.
  - Decisión con mayor influencia.
  - Evaluación económica y de desarrollo.
  - Estado final del vestuario.
  - Revisiones del objetivo.
  - Cambios en prestigio y momento profesional.
  - Consecuencias todavía pendientes.
- El resumen se muestra en el cierre de temporada y queda disponible en el perfil del mánager.
- Los partidos utilizados para identificar mejores y peores momentos se limitan a la etapa correspondiente en ese club.

## Compatibilidad

- Compatible con partidas existentes de **V8.70**.
- Conserva el perfil, historiales, objetivos y confianza de vestuario creados en las etapas anteriores.
- Las partidas antiguas inicializan automáticamente el registro de consecuencias.
- No requiere cambios de Worker, SQL ni recursos gráficos.

## Archivos modificados

- `README.md`
- `config.js`
- `index.html`
- `js/game/05l-manager-career-stage-three.js`
- `styles/160-manager-career-stage-three.css`
