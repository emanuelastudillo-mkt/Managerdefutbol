/* V8.05 · Licencias progresivas actualizadas para contratos y Academia personal. */

const MANAGER_COURSE_REWARD_POINTS = 1000;
const MANAGER_COURSE_ORDER = ['basic','national','international'];
const MANAGER_COURSE_LICENSES = {
  basic:{
    id:'basic',
    title:'Licencia de manager Básica',
    actionLabel:'Obtener licencia de manager Básica',
    level:'Nivel inicial',
    intro:'Un recorrido corto para comprender las decisiones que conviene revisar antes de cada partido y durante las primeras semanas de una carrera.',
    topics:[
      { id:'tactics', title:'Táctica y formación', text:'La formación debe adaptarse a los mejores jugadores disponibles. No conviene forzar un dibujo que deje afuera a varias figuras o que obligue a demasiados futbolistas a jugar lejos de su puesto.', example:'Si tus tres mejores atacantes pueden jugar juntos, buscá una formación que los incluya sin vaciar el mediocampo.' },
      { id:'positions', title:'Puestos naturales y adaptación', text:'Un jugador suele rendir mejor en su posición natural. Puede cubrir puestos compatibles, pero cuanto más se aleja de su función habitual, menos confiable será su aporte.', example:'Un extremo puede adaptarse a otra banda con menor riesgo que un delantero utilizado como defensor central.' },
      { id:'lineup', title:'Titulares y suplentes', text:'Confirmá once titulares válidos y un banco capaz de cubrir distintas zonas. No alcanza con elegir las medias más altas si faltan defensores, mediocampistas o reemplazos útiles.', example:'Antes de jugar, comprobá que tengas alternativas para el arquero, la defensa y el ataque.' },
      { id:'captaincy', title:'Capitanía', text:'El capitán debe ser un futbolista confiable que normalmente forme parte del once. Revisá la capitanía cuando el jugador quede lesionado, suspendido, vendido o relegado al banco.', example:'Elegí un titular habitual para evitar llegar a un partido sin capitán disponible.' },
      { id:'fitness', title:'Estado físico y rotación', text:'La forma física baja con la exigencia y necesita tiempo para recuperarse. Repetir siempre el mismo once puede hacer que el equipo llegue cansado a los partidos importantes.', example:'Rotá a un titular agotado en un encuentro accesible para recuperarlo antes de una final.' },
      { id:'morale', title:'Moral y cohesión', text:'La moral refleja el ánimo individual y la cohesión representa cuánto se conoce el equipo. Los cambios constantes, las derrotas y un vestuario inestable pueden volver irregular a un plantel fuerte.', example:'Mantené una base reconocible y evitá modificar toda la alineación en cada fecha.' },
      { id:'pitch', title:'Campo e instalaciones del club', text:'El estado del campo influye en circulación, ocasiones, desgaste y riesgo físico. Estadio, césped y calefacción pertenecen al club; el Predio juvenil se administra por separado desde Tu Academia.', example:'Si el campo está deteriorado, usá recursos del club para mantenerlo; no confundas esa obra con una mejora personal del Predio juvenil.' },
      { id:'training', title:'Entrenamiento', text:'El entrenamiento mejora al plantel, pero las cargas más intensas también pueden reducir la forma y la moral. Entrenar bien significa elegir el momento, no usar siempre la opción más exigente.', example:'Después de varios partidos seguidos puede ser mejor recuperar que insistir con otra sesión intensa.' },
      { id:'availability', title:'Lesiones y suspensiones', text:'Un jugador lesionado o suspendido no debe quedar como una solución prevista para el próximo encuentro. Revisá disponibilidad antes de confirmar el equipo y prepará reemplazos.', example:'Mirá Mensajes y Primer Equipo después de cada partido para detectar bajas nuevas.' },
      { id:'routine', title:'Rutina diaria del manager', text:'La secuencia básica es revisar Inicio, Mensajes, Primer Equipo, Calendario y las dos economías antes de avanzar. Finanzas muestra al club; Cuenta Bancaria muestra sueldo, saldo personal y gastos de Academia.', example:'Antes de pulsar Avanzar día, comprobá alertas, táctica, objetivo contractual, presupuesto del club y saldo personal.' }
    ]
  },
  national:{
    id:'national',
    title:'Licencia de manager Nacional',
    actionLabel:'Obtener licencia de manager Nacional',
    level:'Nivel intermedio',
    intro:'Profundiza en la planificación de una temporada completa, el armado de plantel y la administración de recursos dentro de una liga nacional.',
    topics:[
      { id:'identity', title:'Identidad y alternativas tácticas', text:'Un equipo necesita una idea principal y al menos una alternativa. La mejor táctica depende del plantel, del rival y del momento del partido; no existe una formación perfecta para toda la temporada.', example:'Guardá un planteo equilibrado y otro más ofensivo para no reconstruir todo antes de cada partido.' },
      { id:'instructions', title:'Mentalidad e instrucciones', text:'Las instrucciones sirven para modificar riesgos, ritmo y comportamiento colectivo. Usarlas sin relación con el marcador o con las características del equipo puede empeorar un buen planteo.', example:'Si protegés una ventaja, no hace falta convertir a todos los jugadores en defensivos desde el primer minuto.' },
      { id:'rotation', title:'Rotación según calendario', text:'La rotación debe considerar cantidad de días entre partidos, importancia del rival y profundidad del banco. Reservar jugadores a tiempo suele ser mejor que recuperarlos después de una lesión.', example:'En una semana con dos encuentros, repartí minutos entre titulares y suplentes antes de que aparezca el cansancio extremo.' },
      { id:'training-plan', title:'Plan de entrenamiento', text:'El desarrollo funciona mejor cuando se combina entrenamiento, descanso y objetivos claros por posición. No todos los jugadores necesitan la misma carga ni progresan al mismo ritmo.', example:'Un juvenil con margen de mejora puede justificar más atención que un veterano que ya alcanzó su techo.' },
      { id:'scouting', title:'Ojeo y decisiones con incertidumbre', text:'El ojeo reduce dudas antes de invertir. Una media atractiva no cuenta toda la historia: posición, edad, sueldo, interés y encaje en el plantel también importan.', example:'Antes de pagar una cláusula alta, compará al jugador con el titular y con las necesidades reales del equipo.' },
      { id:'market', title:'Mercado profesional, contratos y cláusulas', text:'Los contratos de futbolistas pertenecen al club y comprometen dinero inmediato, salarios y cláusulas. No deben confundirse con el contrato laboral del manager ni con los juveniles que todavía forman parte de Tu Academia.', example:'No uses todo el presupuesto institucional en una compra si después el club no puede sostener salarios ni responder a una cláusula.' },
      { id:'academy', title:'Tu Academia como patrimonio personal', text:'Juveniles, Predio, residencias y Preparador pertenecen al manager y continúan con él aunque cambie de club. Captaciones, becas, tratamientos, empleados y obras se pagan desde la Cuenta Bancaria personal.', example:'Antes de ampliar el Predio o iniciar una captación, verificá que el saldo personal pueda sostener también las becas y residencias futuras.' },
      { id:'staff', title:'Empleados del club y de Academia', text:'Psicólogo, Kinesiólogo y estructura de ojeo pertenecen al club. El Preparador de juveniles pertenece al manager y se conserva al cambiar de equipo. Cada grupo se paga desde su patrimonio correspondiente.', example:'Si el plantel profesional acumula problemas físicos, contratá apoyo con dinero del club; si necesitás descubrir juveniles, financiá al Preparador desde tu cuenta.' },
      { id:'club-finance', title:'Finanzas del club y Cuenta Bancaria', text:'El presupuesto institucional sostiene fichajes, salarios profesionales, empleados, estadio y sponsors. La Cuenta Bancaria recibe el sueldo del manager y paga Tu Academia. Son economías separadas y deben planificarse en paralelo.', example:'Un club rico no resuelve automáticamente una Academia personal endeudada, y un manager con ahorros no puede usar ese dinero como presupuesto de fichajes.' },
      { id:'objectives', title:'Contrato del manager y objetivos anuales', text:'Los contratos duran una, dos o tres temporadas. En acuerdos largos, los primeros años aplican mínimos progresivos y el último exige el objetivo final. Elegir una propuesta prudente, normal o ambiciosa modifica exigencia y sueldo mensual.', example:'Compará estabilidad, salario y dificultad: un contrato de tres años puede pagar menos por mes, pero evita depender de una renovación inmediata.' }
    ]
  },
  international:{
    id:'international',
    title:'Licencia de manager Internacional',
    actionLabel:'Obtener licencia de manager Internacional',
    level:'Nivel avanzado',
    intro:'Prepara al manager para construir una carrera entre clubes y países, competir en contextos distintos y administrar planteles capaces de sostener objetivos internacionales.',
    topics:[
      { id:'career-mobility', title:'Cambiar de club, contratos y continuidad', text:'Renunciar o ser despedido termina el sueldo del contrato actual, pero no borra el saldo personal, Tu Academia ni los derechos económicos ya registrados. El prestigio abre destinos y cada nueva oferta redefine duración, objetivo, sueldo y porcentaje futuro.', example:'Antes de cambiar de club, evaluá la mejora deportiva sin olvidar cuánto salario y porcentaje de futuras ventas dejarías atrás.' },
      { id:'adaptation', title:'Adaptación a otra liga', text:'Cambiar de país o división exige volver a estudiar rivales, calendario, nivel salarial y profundidad de los planteles. Lo que funcionó en un club puede no encajar en el siguiente.', example:'Antes de fichar, compará el nivel de tu nuevo plantel con los equipos que dominan esa competencia.' },
      { id:'squad-building', title:'Construcción de un plantel internacional', text:'Un plantel competitivo necesita más que once figuras: debe cubrir posiciones, soportar lesiones y ofrecer variantes para calendarios extensos. La masa salarial también marca cuánto riesgo financiero asumís.', example:'Priorizá dos opciones fiables por zona antes de sumar un cuarto jugador para la misma posición.' },
      { id:'world-cup', title:'Mundial de Clubes', text:'El Mundial de Clubes exige llegar con un plantel completo y preparado. Los partidos se disputan en sedes neutrales, por lo que la organización y la calidad del equipo pesan más que la localía habitual.', example:'Planificá la forma física antes del debut y evitá depender de once jugadores sin reemplazos.' },
      { id:'neutral-matches', title:'Partidos en sede neutral', text:'En una sede neutral no debés planificar como si jugaras en tu estadio. La distribución de público y el contexto cambian; la prioridad pasa por el rival, el estado del plantel y la táctica.', example:'No bases un planteo conservador en una ventaja de localía que el torneo no concede.' },
      { id:'global-scouting', title:'Ojeo internacional y mercado juvenil', text:'El Centro de Ojeo sirve al club profesional, mientras Tu Academia puede recibir ofertas de compradores nacionales o extranjeros por juveniles de 17 años. En ambos casos importan edad, nivel actual, necesidad posicional y reputación del comprador.', example:'No aceptes una oferta juvenil sólo por el nombre del club: compará el ingreso neto con el desarrollo y la posible promoción futura.' },
      { id:'stars', title:'Gestión de figuras y cláusulas', text:'Los mejores jugadores atraen ofertas y esperan respuestas. Ignorar una situación contractual puede provocar una salida automática y deteriorar la relación con el futbolista.', example:'Respondé las ofertas por cláusula antes de las fechas límite, aunque la decisión sea rechazar la negociación.' },
      { id:'opponent-analysis', title:'Preparación según el rival', text:'El análisis avanzado consiste en relacionar tus fortalezas con las debilidades del oponente. La media general ayuda, pero también importa qué sectores concentran a los mejores jugadores.', example:'Si el rival reúne sus figuras en ataque, reforzá la estructura defensiva sin renunciar por completo a generar peligro.' },
      { id:'special-resources', title:'Cartas y recursos especiales', text:'Las cartas pueden reforzar áreas concretas durante una etapa de la carrera. Conviene activarlas con un objetivo claro y recordar que sus usos son limitados.', example:'Una carta preventiva de lesiones tiene más valor antes de una seguidilla decisiva que durante una semana sin partidos.' },
      { id:'legacy', title:'Cartera y derechos económicos', text:'Cada juvenil promovido registra el porcentaje de futura venta incluido en el contrato vigente. El derecho persiste después de dejar el club y se cobra una sola vez sobre la primera transferencia pagada, después de descontar el impuesto.', example:'Una oferta laboral con menor sueldo puede ser valiosa si ofrece un porcentaje alto y el club permite promover juveniles con potencial de venta.' }
    ]
  }
};

function createInitialManagerCoursesState(){
  return {
    version:'V8.05',
    checked:{ basic:[], national:[], international:[] },
    completed:{ basic:false, national:false, international:false },
    completedAt:{ basic:null, national:null, international:null },
    rewardClaimed:false,
    rewardClaimedAt:null
  };
}
function managerCourseTopicIds(licenseId=''){
  return (MANAGER_COURSE_LICENSES[String(licenseId || '')]?.topics || []).map(item => String(item.id || '')).filter(Boolean);
}
function normalizeManagerCoursesState(value=null){
  const base = createInitialManagerCoursesState();
  const src = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const checkedSrc = src.checked && typeof src.checked === 'object' && !Array.isArray(src.checked) ? src.checked : {};
  const completedSrc = src.completed && typeof src.completed === 'object' && !Array.isArray(src.completed) ? src.completed : {};
  const completedAtSrc = src.completedAt && typeof src.completedAt === 'object' && !Array.isArray(src.completedAt) ? src.completedAt : {};
  const clean = createInitialManagerCoursesState();
  MANAGER_COURSE_ORDER.forEach(id => {
    const valid = new Set(managerCourseTopicIds(id));
    clean.checked[id] = Array.from(new Set(Array.isArray(checkedSrc[id]) ? checkedSrc[id].map(String).filter(item => valid.has(item)) : []));
    clean.completed[id] = Boolean(completedSrc[id]);
    clean.completedAt[id] = completedAtSrc[id] || null;
  });
  if(clean.completed.international){ clean.completed.national = true; clean.completed.basic = true; }
  if(clean.completed.national) clean.completed.basic = true;
  MANAGER_COURSE_ORDER.forEach(id => {
    if(clean.completed[id]) clean.checked[id] = managerCourseTopicIds(id);
  });
  clean.rewardClaimed = Boolean(src.rewardClaimed && clean.completed.international);
  clean.rewardClaimedAt = clean.rewardClaimed ? (src.rewardClaimedAt || clean.completedAt.international || null) : null;
  clean.version = 'V8.05';
  return clean;
}
function managerCoursesHasProgress(value=null){
  const state = normalizeManagerCoursesState(value);
  return MANAGER_COURSE_ORDER.some(id => state.completed[id] || state.checked[id].length > 0) || state.rewardClaimed;
}
function managerCourseLicenseUnlocked(licenseId='', stateInput=null){
  const id = String(licenseId || '');
  const state = normalizeManagerCoursesState(stateInput);
  if(id === 'basic') return true;
  if(id === 'national') return Boolean(state.completed.basic);
  if(id === 'international') return Boolean(state.completed.national);
  return false;
}
function managerCourseLicenseProgress(licenseId='', stateInput=null){
  const id = String(licenseId || '');
  const state = normalizeManagerCoursesState(stateInput);
  const total = managerCourseTopicIds(id).length;
  const checked = Math.min(total, state.checked[id]?.length || 0);
  return { checked, total, percent:total ? Math.round((checked / total) * 100) : 0, complete:Boolean(state.completed[id]) };
}
function managerCourseReadState(){
  const profile = typeof readManagerGlobalProfileState === 'function' ? readManagerGlobalProfileState() : {};
  return normalizeManagerCoursesState(profile?.managerCourses);
}
function managerCourseWriteState(stateInput=null, profilePatch={}){
  if(typeof readManagerGlobalProfileState !== 'function' || typeof writeManagerGlobalProfileState !== 'function') return null;
  const profile = readManagerGlobalProfileState();
  const state = normalizeManagerCoursesState(stateInput);
  return writeManagerGlobalProfileState({ ...profile, ...profilePatch, managerCourses:state });
}
function managerCourseAddRewardPoints(stateInput=null){
  const state = normalizeManagerCoursesState(stateInput);
  if(state.rewardClaimed) return { state, awarded:0, total:Number(game?.special?.puntos_habilidad || 0) };
  const profile = typeof readManagerGlobalProfileState === 'function' ? readManagerGlobalProfileState() : { skillPoints:0 };
  let currentPoints = Math.max(0, Math.round(Number(profile?.skillPoints || 0)));
  if(typeof ensureSpecialState === 'function' && game){
    const special = ensureSpecialState();
    currentPoints = Math.max(currentPoints, Math.max(0, Math.round(Number(special?.puntos_habilidad || 0))));
    special.puntos_habilidad = currentPoints + MANAGER_COURSE_REWARD_POINTS;
    const rewardLog = {
      actionId:'licencia_manager_internacional',
      points:MANAGER_COURSE_REWARD_POINTS,
      puntos_antes:currentPoints,
      puntos_despues:special.puntos_habilidad,
      fecha:typeof currentCalendarDate === 'function' ? currentCalendarDate() : null,
      createdAt:new Date().toISOString()
    };
    if(typeof appendSpecialPointsLog === 'function') appendSpecialPointsLog(special, rewardLog);
    else {
      special.puntos_log = Array.isArray(special.puntos_log) ? special.puntos_log : [];
      special.puntos_log.push(rewardLog);
      special.puntos_log = special.puntos_log.slice(-80);
    }
    game.special = special;
    currentPoints = special.puntos_habilidad;
  } else {
    currentPoints += MANAGER_COURSE_REWARD_POINTS;
  }
  state.rewardClaimed = true;
  state.rewardClaimedAt = new Date().toISOString();
  managerCourseWriteState(state, { skillPoints:currentPoints });
  if(game){
    if(typeof persistSharedManagerProfileFromGame === 'function') persistSharedManagerProfileFromGame();
    if(typeof saveLocal === 'function') saveLocal(true);
  }
  return { state, awarded:MANAGER_COURSE_REWARD_POINTS, total:currentPoints };
}
function managerCourseCompleteLicense(licenseId=''){
  const id = String(licenseId || '');
  const definition = MANAGER_COURSE_LICENSES[id];
  let state = managerCourseReadState();
  if(!definition || !managerCourseLicenseUnlocked(id, state) || state.completed[id]) return { state, completed:false, awarded:0 };
  const progress = managerCourseLicenseProgress(id, state);
  if(progress.checked < progress.total) return { state, completed:false, awarded:0 };
  state.completed[id] = true;
  state.completedAt[id] = new Date().toISOString();
  state.checked[id] = managerCourseTopicIds(id);
  let awarded = 0;
  if(id === 'international'){
    const reward = managerCourseAddRewardPoints(state);
    state = reward.state;
    awarded = reward.awarded;
  } else {
    managerCourseWriteState(state);
  }
  return { state, completed:true, awarded };
}
function managerCourseToggleTopic(licenseId='', topicId='', checked=false){
  const id = String(licenseId || '');
  const topic = String(topicId || '');
  let state = managerCourseReadState();
  if(!managerCourseLicenseUnlocked(id, state) || state.completed[id] || !managerCourseTopicIds(id).includes(topic)) return { state, completed:false, awarded:0 };
  const selected = new Set(state.checked[id] || []);
  if(checked) selected.add(topic); else selected.delete(topic);
  state.checked[id] = Array.from(selected);
  managerCourseWriteState(state);
  const progress = managerCourseLicenseProgress(id, state);
  if(progress.total > 0 && progress.checked >= progress.total) return managerCourseCompleteLicense(id);
  return { state, completed:false, awarded:0 };
}
function managerCourseStatusLabel(licenseId='', stateInput=null){
  const state = normalizeManagerCoursesState(stateInput);
  if(state.completed[licenseId]) return 'Aprobada';
  if(!managerCourseLicenseUnlocked(licenseId, state)) return 'Bloqueada';
  const progress = managerCourseLicenseProgress(licenseId, state);
  return progress.checked ? 'En curso' : 'Disponible';
}
function managerCourseNextLicenseId(licenseId=''){
  const index = MANAGER_COURSE_ORDER.indexOf(String(licenseId || ''));
  return index >= 0 && index < MANAGER_COURSE_ORDER.length - 1 ? MANAGER_COURSE_ORDER[index + 1] : '';
}
function managerCourseTopicMarkup(licenseId, topic, state){
  const checked = state.checked[licenseId]?.includes(topic.id) || state.completed[licenseId];
  const disabled = state.completed[licenseId] ? 'disabled' : '';
  return `<article class="manager-course-topic ${checked ? 'is-checked' : ''}">
    <div class="manager-course-topic-copy">
      <h4>${escapeHtml(topic.title)}</h4>
      <p>${escapeHtml(topic.text)}</p>
      ${topic.example ? `<div class="manager-course-example"><strong>Ejemplo útil</strong><span>${escapeHtml(topic.example)}</span></div>` : ''}
    </div>
    <label class="manager-course-check">
      <input type="checkbox" data-manager-course-license="${escapeHtml(licenseId)}" data-manager-course-topic="${escapeHtml(topic.id)}" ${checked ? 'checked' : ''} ${disabled}>
      <span>Ya entiendo cómo funciona</span>
    </label>
  </article>`;
}
function managerCourseLicenseMarkup(licenseId, state, focus=''){
  const definition = MANAGER_COURSE_LICENSES[licenseId];
  const unlocked = managerCourseLicenseUnlocked(licenseId, state);
  const progress = managerCourseLicenseProgress(licenseId, state);
  const completed = state.completed[licenseId];
  const status = managerCourseStatusLabel(licenseId, state);
  const shouldOpen = focus === licenseId || (!focus && licenseId === 'basic' && !completed);
  const previousId = licenseId === 'national' ? 'basic' : licenseId === 'international' ? 'national' : '';
  const previousTitle = previousId ? MANAGER_COURSE_LICENSES[previousId]?.title : '';
  return `<details class="manager-course-license ${completed ? 'is-completed' : ''} ${unlocked ? '' : 'is-locked'}" ${shouldOpen ? 'open' : ''}>
    <summary>
      <div class="manager-course-license-title">
        <span class="manager-course-medal" aria-hidden="true">${completed ? '✓' : licenseId === 'basic' ? 'B' : licenseId === 'national' ? 'N' : 'I'}</span>
        <div><small>${escapeHtml(definition.level)}</small><strong>${escapeHtml(definition.title)}</strong></div>
      </div>
      <div class="manager-course-license-meta"><span class="pill ${completed ? 'ok' : unlocked ? 'warn' : ''}">${escapeHtml(status)}</span><b>${progress.checked}/${progress.total}</b></div>
    </summary>
    <div class="manager-course-license-body">
      ${unlocked ? `<p class="manager-course-intro">${escapeHtml(definition.intro)}</p>
        <div class="manager-course-progress"><span style="width:${progress.percent}%"></span></div>
        <div class="manager-course-topics">${definition.topics.map(topic => managerCourseTopicMarkup(licenseId, topic, state)).join('')}</div>
        <div class="manager-course-license-footer ${completed ? 'is-completed' : ''}">
          <strong>${completed ? 'Licencia aprobada' : definition.actionLabel}</strong>
          <span>${completed ? `Completada${state.completedAt[licenseId] ? ` · ${new Date(state.completedAt[licenseId]).toLocaleDateString('es-AR')}` : ''}` : `Marcá los ${progress.total} controles para aprobarla.`}</span>
        </div>` : `<div class="manager-course-locked-copy"><strong>Licencia todavía bloqueada</strong><p>Primero debés aprobar la ${escapeHtml(previousTitle)}.</p></div>`}
    </div>
  </details>`;
}
function openManagerCoursesModal(options={}){
  const state = managerCourseReadState();
  const completedCount = MANAGER_COURSE_ORDER.filter(id => state.completed[id]).length;
  const focus = String(options.focus || '');
  const body = `<div class="manager-courses-modal">
    <div class="manager-courses-hero card">
      <div><p class="eyebrow">Formación progresiva</p><h2>Cursos de manager</h2><p>Completá cada checklist en orden. Las explicaciones enseñan el funcionamiento general del juego sin revelar fórmulas internas.</p></div>
      <div class="manager-course-overall"><strong>${completedCount}/3</strong><span>licencias aprobadas</span></div>
    </div>
    <div class="manager-course-sequence"><span class="${state.completed.basic ? 'done' : 'active'}">Básica</span><i></i><span class="${state.completed.national ? 'done' : state.completed.basic ? 'active' : ''}">Nacional</span><i></i><span class="${state.completed.international ? 'done' : state.completed.national ? 'active' : ''}">Internacional</span></div>
    <div class="manager-course-license-list">${MANAGER_COURSE_ORDER.map(id => managerCourseLicenseMarkup(id, state, focus)).join('')}</div>
    <div class="card manager-course-reward ${state.rewardClaimed ? 'is-claimed' : ''}">
      <div><p class="label">Premio final</p><strong>${state.rewardClaimed ? 'Licencia Internacional aprobada' : '+1.000 puntos de habilidad'}</strong><p>${state.rewardClaimed ? 'La recompensa ya fue acreditada a este perfil de manager.' : 'Se entrega una sola vez al completar la tercera licencia.'}</p></div>
      <span>${state.rewardClaimed ? '✓' : '1000'}</span>
    </div>
  </div>`;
  openModal(body);
  document.querySelectorAll('[data-manager-course-license][data-manager-course-topic]').forEach(input => {
    input.addEventListener('change', event => {
      const licenseId = event.target.dataset.managerCourseLicense || '';
      const topicId = event.target.dataset.managerCourseTopic || '';
      const result = managerCourseToggleTopic(licenseId, topicId, event.target.checked);
      if(result.completed){
        openManagerCourseCompletionModal(licenseId, result.awarded);
      } else {
        openManagerCoursesModal({ focus:licenseId });
      }
    });
  });
}
function openManagerCourseCompletionModal(licenseId='', awarded=0){
  const id = String(licenseId || '');
  const definition = MANAGER_COURSE_LICENSES[id];
  const nextId = managerCourseNextLicenseId(id);
  const final = id === 'international';
  const body = `<div class="manager-course-completion">
    <div class="manager-course-certificate">
      <span class="manager-course-certificate-mark">✓</span>
      <p class="eyebrow">Licencia aprobada</p>
      <h2>${escapeHtml(definition?.title || 'Curso completado')}</h2>
      <p>${final ? 'Completaste el recorrido de formación y ya podés aplicar estos conceptos en carreras nacionales e internacionales.' : `Terminaste todos los contenidos. La ${escapeHtml(MANAGER_COURSE_LICENSES[nextId]?.title || 'siguiente licencia')} quedó habilitada.`}</p>
      ${final ? `<div class="manager-course-prize"><span>Premio único</span><strong>+${formatPlainNumber(awarded || MANAGER_COURSE_REWARD_POINTS)} puntos de habilidad</strong></div>` : ''}
    </div>
    <div class="row message-actions">
      ${nextId ? `<button id="btnContinueManagerCourses" class="primary">Continuar con la siguiente licencia</button>` : `<button id="btnContinueManagerCourses" class="primary">Volver a los cursos</button>`}
      <button class="ghost" data-close-modal>Cerrar</button>
    </div>
  </div>`;
  openModal(body);
  $('btnContinueManagerCourses')?.addEventListener('click', () => openManagerCoursesModal({ focus:nextId || 'international' }));
}

window.ManagerCoursesTest = {
  licenses:MANAGER_COURSE_ORDER.slice(),
  topicCounts:Object.fromEntries(MANAGER_COURSE_ORDER.map(id => [id, managerCourseTopicIds(id).length])),
  normalize:normalizeManagerCoursesState,
  progress:(state=null) => Object.fromEntries(MANAGER_COURSE_ORDER.map(id => [id, managerCourseLicenseProgress(id, state)])),
  unlocked:(state=null) => Object.fromEntries(MANAGER_COURSE_ORDER.map(id => [id, managerCourseLicenseUnlocked(id, state)]))
};
