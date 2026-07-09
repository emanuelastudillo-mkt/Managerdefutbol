/* V3.33 · Academia, captación, juveniles, empleados y tratamientos. */

function createInitialAcademyState(){
  return { players:[], scoutingJobs:[], unlockedStats:{}, trainingPlan:{}, youthPreparer:null, lastConsultTurn:null, lastArrivalTurn:null, lastConsultReveal:null, exceptionalYouthGrantedSeason:null, residences:0, residenceLastChargeDate:null, youthInjurySeason:null, youthInjuriesTarget:null, youthInjuriesCount:0 };
}
function normalizeAcademyState(state){
  const base = createInitialAcademyState();
  const clean = { ...base, ...(state || {}) };
  clean.players = Array.isArray(clean.players) ? clean.players.map(normalizeAcademyPlayer).filter(Boolean) : [];
  clean.scoutingJobs = Array.isArray(clean.scoutingJobs) ? clean.scoutingJobs : [];
  clean.unlockedStats = clean.unlockedStats && typeof clean.unlockedStats === 'object' ? clean.unlockedStats : {};
  clean.trainingPlan = clean.trainingPlan && typeof clean.trainingPlan === 'object' ? clean.trainingPlan : {};
  clean.youthPreparer = clean.youthPreparer || null;
  clean.exceptionalYouthGrantedSeason = Number(clean.exceptionalYouthGrantedSeason || 0) || null;
  clean.lastConsultReveal = clean.lastConsultReveal && typeof clean.lastConsultReveal === 'object' ? clean.lastConsultReveal : null;
  clean.youthInjurySeason = Number(clean.youthInjurySeason || 0) || null;
  clean.youthInjuriesTarget = Number.isFinite(Number(clean.youthInjuriesTarget)) ? Math.max(0, Math.round(Number(clean.youthInjuriesTarget))) : null;
  clean.youthInjuriesCount = Math.max(0, Math.round(Number(clean.youthInjuriesCount || 0)));
  clean.residences = Math.max(0, Math.round(Number(clean.residences || 0)));
  clean.residenceLastChargeDate = validIsoDate(clean.residenceLastChargeDate) ? clean.residenceLastChargeDate : null;
  return clean;
}


function defaultStaffCategories(){
  return [
    { id:'regular', nombre:'Regular', multiplicadorCosto:1, multiplicadorRendimiento:1, descripcion:'Mantiene el rendimiento estándar.' },
    { id:'bueno', nombre:'Bueno', multiplicadorCosto:4, multiplicadorRendimiento:2, descripcion:'Duplica el rendimiento de la acción.' },
    { id:'elite', nombre:'Elite', multiplicadorCosto:50, multiplicadorRendimiento:3, descripcion:'Triplica el rendimiento de la acción.' }
  ];
}
function defaultStaffDefinitions(){
  return [
    { id:'psychologist', nombre:'Psicólogo motivacional', rol:'Motivación', costoBase:PSYCHOLOGIST_COST, duracion:'temporada', descripcion:'Permite realizar charlas motivacionales para mejorar la moral del plantel.', accion:'charla_motivacional', imagenes:{ regular:'img/empleados/psicologo-regular.webp', bueno:'img/empleados/psicologo-bueno.webp', elite:'img/empleados/psicologo-elite.webp' } },
    { id:'kinesiologist', nombre:'Kinesiólogo', rol:'Recuperación', costoBase:KINESIOLOGIST_COST, duracion:'temporada', descripcion:'Permite tratar lesionados una vez por semana para reducir días de recuperación.', accion:'tratamiento_lesion', imagenes:{ regular:'img/empleados/kinesiologo-regular.webp', bueno:'img/empleados/kinesiologo-bueno.webp', elite:'img/empleados/kinesiologo-elite.webp' } },
    { id:'youth_preparer', nombre:'Preparador de juveniles', rol:'Academia', costoBase:YOUTH_PREPARER_COST, duracion:'temporada', descripcion:'Permite consultar informes de juveniles y descubrir más habilidades ocultas.', accion:'informe_juveniles', imagenes:{ regular:'img/empleados/preparador-juveniles-regular.webp', bueno:'img/empleados/preparador-juveniles-bueno.webp', elite:'img/empleados/preparador-juveniles-elite.webp' } }
  ];
}
function staffCategories(){
  const source = Array.isArray(employeesDatabase?.categorias) && employeesDatabase.categorias.length ? employeesDatabase.categorias : defaultStaffCategories();
  return source.map(item => ({
    id:String(item.id || 'regular'),
    nombre:item.nombre || item.label || item.id || 'Regular',
    multiplicadorCosto:Math.max(0, Number(item.multiplicadorCosto ?? item.costMultiplier ?? 1) || 1),
    multiplicadorRendimiento:Math.max(1, Number(item.multiplicadorRendimiento ?? item.performanceMultiplier ?? 1) || 1),
    descripcion:item.descripcion || item.description || ''
  }));
}
function staffDefinitions(){
  const source = Array.isArray(employeesDatabase?.empleados) && employeesDatabase.empleados.length ? employeesDatabase.empleados : defaultStaffDefinitions();
  return source.map(item => ({
    id:String(item.id || ''),
    nombre:item.nombre || item.name || item.id || 'Empleado',
    rol:item.rol || item.role || '',
    costoBase:Math.max(0, Number(item.costoBase ?? item.baseCost ?? 0) || 0),
    duracion:item.duracion || item.duration || 'temporada',
    descripcion:item.descripcion || item.description || '',
    accion:item.accion || item.action || '',
    imagenes:(item.imagenes && typeof item.imagenes === 'object') ? { ...item.imagenes } : {}
  })).filter(item => item.id);
}
function staffDefinition(staffId){
  return staffDefinitions().find(item => item.id === staffId) || defaultStaffDefinitions().find(item => item.id === staffId) || null;
}
function staffCategory(categoryId){
  return staffCategories().find(item => item.id === categoryId) || staffCategories()[0] || defaultStaffCategories()[0];
}
function staffBaseCost(staffId){
  const fromJson = Number(staffDefinition(staffId)?.costoBase || 0);
  if(fromJson > 0) return fromJson;
  if(staffId === 'psychologist') return PSYCHOLOGIST_COST;
  if(staffId === 'kinesiologist') return KINESIOLOGIST_COST;
  if(staffId === 'youth_preparer') return YOUTH_PREPARER_COST;
  return 0;
}
function staffHireCost(staffId, categoryId='regular'){
  return Math.round(staffBaseCost(staffId) * staffCategory(categoryId).multiplicadorCosto);
}
function normalizeStaffContracts(contracts){
  const clean = (contracts && typeof contracts === 'object' && !Array.isArray(contracts)) ? { ...contracts } : {};
  Object.keys(clean).forEach(key => {
    const current = clean[key] || {};
    clean[key] = {
      active:Boolean(current.active),
      season:Number(current.season || 0),
      category:staffCategory(current.category || current.nivel || 'regular').id,
      cost:Number(current.cost || 0),
      performanceMultiplier:Math.max(1, Number(current.performanceMultiplier || staffCategory(current.category || 'regular').multiplicadorRendimiento || 1)),
      hiredTurn:Number(current.hiredTurn || current.matchdayIndex || 0),
      hiredGlobalTurn:Number(current.hiredGlobalTurn || current.globalTurn || 0)
    };
  });
  return clean;
}
function resetStaffSeasonState(){
  if(!game) return;
  game.staffContracts = normalizeStaffContracts(game.staffContracts || {});
  Object.values(game.staffContracts).forEach(contract => { contract.active = false; });
  if(game.staffActions?.kinesiologist){ game.staffActions.kinesiologist.active = false; }
}
function legacyStaffActive(staffId){
  if(staffId === 'kinesiologist') return Boolean(game?.staffActions?.kinesiologist?.active);
  if(staffId === 'youth_preparer') return Boolean(game?.academy?.youthPreparer?.active && Number(game.academy.youthPreparer.season || 0) === Number(game.seasonNumber || 1));
  return false;
}
function staffContract(staffId){
  game.staffContracts = normalizeStaffContracts(game.staffContracts || {});
  const contract = game.staffContracts[staffId];
  if(contract?.active && Number(contract.season || 0) === Number(game.seasonNumber || 1)) return contract;
  if(legacyStaffActive(staffId)){
    return { active:true, season:game.seasonNumber || 1, category:'regular', cost:staffBaseCost(staffId), performanceMultiplier:1, legacy:true };
  }
  return null;
}
function staffActive(staffId){ return Boolean(staffContract(staffId)); }
function staffPerformanceMultiplier(staffId){ return Math.max(1, Number(staffContract(staffId)?.performanceMultiplier || 1)); }
function staffCategoryName(staffId){ return staffCategory(staffContract(staffId)?.category || 'regular').nombre; }
function staffImagePath(staffId, categoryId='regular'){
  const def = staffDefinition(staffId);
  const category = staffCategory(categoryId).id;
  const fromJson = def?.imagenes?.[category] || def?.imagenes?.regular || '';
  if(fromJson) return String(fromJson);
  const base = staffId === 'psychologist' ? 'psicologo' : staffId === 'kinesiologist' ? 'kinesiologo' : staffId === 'youth_preparer' ? 'preparador-juveniles' : 'empleado';
  return `img/empleados/${base}-${category}.webp`;
}
function staffImageMarkup(staffId, categoryId='regular', className='staff-employee-photo'){
  const def = staffDefinition(staffId);
  const alt = `${def?.nombre || 'Empleado'} ${staffCategory(categoryId).nombre}`;
  return `<img class="${escapeHtml(className)}" src="${escapeHtml(staffImagePath(staffId, categoryId))}" alt="${escapeHtml(alt)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling && (this.nextElementSibling.style.display='grid');"><span class="staff-photo-fallback" style="display:none">${escapeHtml((def?.nombre || 'E').slice(0,1).toUpperCase())}</span>`;
}
function staffActivePill(staffId){
  const contract = staffContract(staffId);
  if(!contract) return '';
  return `<span class="pill ok">${escapeHtml(staffCategoryName(staffId))} · contratado</span>`;
}
function staffContractCardMarkup(staffId, mode='compact'){
  const contract = staffContract(staffId);
  const def = staffDefinition(staffId);
  if(!contract || !def) return '';
  const category = staffCategory(contract.category || 'regular');
  const cls = mode === 'mini' ? 'staff-contract-card mini' : 'staff-contract-card';
  return `<div class="${cls}">
    <div class="staff-photo-wrap">${staffImageMarkup(staffId, category.id)}</div>
    <div class="staff-contract-info">
      <p class="label">${escapeHtml(def.rol || 'Empleado')}</p>
      <h3>${escapeHtml(def.nombre)}</h3>
      <div class="staff-contract-tags"><span class="pill ok">${escapeHtml(category.nombre)}</span><span class="pill">${formatMoney(contract.cost || staffHireCost(staffId, category.id))}</span></div>
    </div>
  </div>`;
}
function contractedStaffList(){
  return staffDefinitions().filter(def => staffActive(def.id));
}
function staffContractsPanelMarkup({ empty=false }={}){
  const active = contractedStaffList();
  if(!active.length && !empty) return '';
  return `<div class="card featured-staff-panel" style="margin-top:14px">
    <div class="row"><h3>Empleados contratados</h3><span class="pill">Temporada actual</span></div>
    ${active.length ? `<div class="grid cols-3 featured-staff-grid">${active.map(def => staffContractCardMarkup(def.id)).join('')}</div>` : '<p class="muted">Todavía no hay empleados contratados.</p>'}
  </div>`;
}
function openStaffHireModal(staffId, after=null){
  if(!game) return;
  const def = staffDefinition(staffId);
  if(!def){ showNotice('Empleado no disponible.'); return; }
  if(staffActive(staffId)){ showNotice(`${def.nombre} ya está contratado esta temporada.`); return; }
  const cards = staffCategories().map(cat => {
    const cost = staffHireCost(staffId, cat.id);
    const disabled = (game.budget || 0) < cost;
    return `<button class="staff-tier-card ${disabled ? 'disabled' : ''}" data-hire-staff-tier="${escapeHtml(staffId)}:${escapeHtml(cat.id)}" ${disabled ? 'disabled' : ''}>
      <span class="pill">${escapeHtml(cat.nombre)}</span>
      <strong>${formatMoney(cost)}</strong>
      <small>Contrato por temporada</small>
    </button>`;
  }).join('');
  openModal(`<div class="staff-hire-modal">
    <h2>Contratar ${escapeHtml(def.nombre)}</h2>
    <p class="muted">Elegí una categoría para esta temporada.</p>
    <div class="staff-tier-grid">${cards}</div>
  </div>`);
  document.querySelectorAll('[data-hire-staff-tier]').forEach(btn => btn.addEventListener('click', () => {
    const [id, category] = String(btn.dataset.hireStaffTier || '').split(':');
    hireStaffEmployee(id, category, after);
  }));
}
function hireStaffEmployee(staffId, categoryId='regular', after=null){
  if(!game) return;
  const def = staffDefinition(staffId);
  if(!def) return;
  if(staffActive(staffId)){ showNotice(`${def.nombre} ya está contratado esta temporada.`); return; }
  const cat = staffCategory(categoryId);
  const cost = staffHireCost(staffId, cat.id);
  if((game.budget || 0) < cost){ showNotice('Presupuesto insuficiente para contratar este empleado.'); return; }
  recordBudgetChange(-cost, `Contratación de ${def.nombre} ${cat.nombre}`, { type:`staff_${staffId}`, category:cat.id });
  game.staffContracts = normalizeStaffContracts(game.staffContracts || {});
  game.staffContracts[staffId] = {
    active:true,
    season:game.seasonNumber || 1,
    category:cat.id,
    cost,
    performanceMultiplier:cat.multiplicadorRendimiento,
    hiredTurn:currentTurnIndex(),
    hiredGlobalTurn:Number(game.globalTurn || 0)
  };
  game.staffActions = game.staffActions || {};
  if(staffId === 'kinesiologist') game.staffActions.kinesiologist = { active:true, category:cat.id, ...turnStamp() };
  if(staffId === 'youth_preparer'){
    game.academy = normalizeAcademyState(game.academy);
    game.academy.youthPreparer = { active:true, category:cat.id, season:game.seasonNumber || 1, hiredTurn:currentTurnIndex() };
  }
  closeModal();
  saveLocal(true);
  if(typeof after === 'function') after(); else renderAll();
  showNotice(`${def.nombre} ${cat.nombre} contratado por esta temporada.`);
}
function staffCostLabel(staffId){ return `Desde ${formatMoney(staffHireCost(staffId, 'regular'))}`; }

function resetAcademySeasonState(){
  if(!game) return;
  game.academy = normalizeAcademyState(game.academy);
  if(game.academy.youthPreparer){ game.academy.youthPreparer.active = false; }
  game.academy.lastConsultTurn = null;
  game.academy.lastConsultReveal = null;
  game.academy.exceptionalYouthGrantedSeason = null;
  resetAcademyYouthInjurySeason();
}
function resetAcademyYouthInjurySeason(){
  if(!game) return;
  game.academy = normalizeAcademyState(game.academy);
  const min = ACADEMY_YOUTH_INJURIES_MIN_PER_SEASON;
  const max = ACADEMY_YOUTH_INJURIES_MAX_PER_SEASON;
  const target = max > min ? min + hashNumber(`academy-injury-target-${game.seasonNumber || 1}-${Date.now()}-${Math.random()}`, max - min + 1) : min;
  game.academy.youthInjurySeason = Number(game.seasonNumber || 1);
  game.academy.youthInjuriesTarget = target;
  game.academy.youthInjuriesCount = 0;
}
function ensureAcademyYouthInjurySeason(){
  if(!game) return;
  game.academy = normalizeAcademyState(game.academy);
  if(Number(game.academy.youthInjurySeason || 0) !== Number(game.seasonNumber || 1) || game.academy.youthInjuriesTarget === null){
    resetAcademyYouthInjurySeason();
  }
}
function normalizeAcademyPlayer(player){
  if(!player) return null;
  const group = normalizeAcademyGroup(player.group || player.role || player.positionGroup);
  const age = clamp(Math.round(Number(player.age || 12)), 8, 20);
  const overall = clamp(Math.round(Number(player.overall || player.media || 12)), 1, 40);
  const id = Number(player.id || nextAcademyPlayerId());
  const skills = player.skills && typeof player.skills === 'object' ? { ...player.skills } : academySkillsFor(group, overall, id);
  skills.resistencia = clamp(Math.round(Number(skills.resistencia || (1 + hashNumber(`academy-res-${id}`, 9)))), 1, 99);
  const injuredThroughTurn = Math.max(0, Math.round(Number(player.injuredThroughTurn || 0)));
  return {
    ...player,
    id,
    name:player.name || academyName(id),
    nationality:player.nationality || academyNationality(id),
    age,
    group,
    overall,
    skills,
    status:player.status || 'academy',
    injuredThroughTurn,
    injuryStartTurn:Math.max(0, Math.round(Number(player.injuryStartTurn || 0))),
    injuryName:injuredThroughTurn > currentTurnIndex() ? (player.injuryName || 'Molestia muscular') : '',
    injuryTreated:Boolean(player.injuryTreated && injuredThroughTurn > currentTurnIndex()),
    injuriesSeason:Math.max(0, Math.round(Number(player.injuriesSeason || 0)))
  };
}
function normalizeAcademyGroup(group){
  const raw = String(group || '').toUpperCase();
  if(['POR','ARQ'].includes(raw)) return 'POR';
  if(['DEF','DFC','LD','LI'].includes(raw)) return 'DEF';
  if(['MED','MID','MC','MCD','MCO','MI','MD'].includes(raw)) return 'MED';
  return 'DEL';
}
function academyGroupLabel(group){ return ({ POR:'POR', DEF:'DEF', MED:'MED', DEL:'DEL' })[normalizeAcademyGroup(group)] || 'MED'; }
function academyRepresentativePosition(group){
  const g = normalizeAcademyGroup(group);
  if(g === 'POR') return 'POR';
  if(g === 'DEF') return 'DFC';
  if(g === 'MED') return 'MC';
  return 'DC';
}
function academyExactPositions(group){
  const g = normalizeAcademyGroup(group);
  if(g === 'POR') return ['POR'];
  if(g === 'DEF') return ['DFC','LI','LD'];
  if(g === 'MED') return ['MC','MCO','MD','MI','MCD'];
  return ['DC','EI','ED'];
}
function academyActivePlayers(){
  game.academy = normalizeAcademyState(game.academy);
  return game.academy.players.filter(p => p.status === 'academy');
}
function academyResidenceCount(){
  game.academy = normalizeAcademyState(game.academy);
  return Math.max(0, Math.round(Number(game.academy.residences || 0)));
}
function academyCapacity(){
  return ACADEMY_BASE_CAPACITY + (academyResidenceCount() * ACADEMY_RESIDENCE_CAPACITY);
}
function academyAvailableSlots(){
  return Math.max(0, academyCapacity() - academyActivePlayers().length);
}
function academyAverageVisibleSkillsProgress(){
  const active = academyActivePlayers();
  if(!active.length) return 0;
  return Math.round(avg(active.map(player => academyVisibleSkillsProgress(player).percent)));
}
function rentAcademyResidence(){
  if(!game) return;
  game.academy = normalizeAcademyState(game.academy);
  const cost = ACADEMY_RESIDENCE_MONTHLY_COST;
  if((game.budget || 0) < cost){ showNotice('Presupuesto insuficiente para alquilar una residencia.'); return; }
  const currentResidences = academyResidenceCount();
  const nextResidences = currentResidences + 1;
  const today = typeof currentCalendarDate === 'function' ? currentCalendarDate() : (game.currentDate || dateForSeasonState(game));
  game.academy.residences = nextResidences;
  game.academy.residenceLastChargeDate = today;
  recordBudgetChange(-cost, 'Alquiler mensual de residencia juvenil', { type:'academy_residence_rent', residences:nextResidences });
  saveLocal(true);
  if(typeof renderAll === 'function') renderAll(); else renderAcademy();
  showNotice(`Residencia alquilada. Residencias: ${nextResidences}. Cupo juvenil: ${academyCapacity()}.`);
}
function cancelAcademyResidence(){
  if(!game) return;
  game.academy = normalizeAcademyState(game.academy);
  const currentResidences = academyResidenceCount();
  if(currentResidences <= 0){ showNotice('No hay residencias alquiladas para cancelar.'); return; }
  const nextResidences = Math.max(0, currentResidences - 1);
  game.academy.residences = nextResidences;
  if(game.academy.residences <= 0) game.academy.residenceLastChargeDate = null;
  saveLocal(true);
  if(typeof renderAll === 'function') renderAll(); else renderAcademy();
  showNotice(`Se canceló una residencia. Residencias: ${nextResidences}. Cupo juvenil: ${academyCapacity()}.`);
}
function processAcademyResidenceRent(){
  if(!game?.academy) return 0;
  game.academy = normalizeAcademyState(game.academy);
  const residences = academyResidenceCount();
  if(residences <= 0 || ACADEMY_RESIDENCE_MONTHLY_COST <= 0) return 0;
  const today = validIsoDate(game.currentDate) ? game.currentDate : dateForSeasonState(game);
  if(!game.academy.residenceLastChargeDate){
    game.academy.residenceLastChargeDate = today;
    return 0;
  }
  const elapsed = daysBetweenIsoDates(game.academy.residenceLastChargeDate, today);
  if(elapsed < ACADEMY_RESIDENCE_MONTH_DAYS) return 0;
  const months = Math.max(1, Math.floor(elapsed / ACADEMY_RESIDENCE_MONTH_DAYS));
  const total = residences * ACADEMY_RESIDENCE_MONTHLY_COST * months;
  recordBudgetChange(-total, 'Alquiler mensual de residencias juveniles', { type:'academy_residence_monthly', residences, months });
  game.academy.residenceLastChargeDate = addDaysToIsoDate(game.academy.residenceLastChargeDate, months * ACADEMY_RESIDENCE_MONTH_DAYS);
  return total;
}
function nextAcademyPlayerId(){
  const ids = [0]
    .concat((seed?.players || []).map(p => Number(p.id) || 0))
    .concat((game?.marketPlayers || []).map(p => Number(p.id) || 0))
    .concat((game?.academy?.players || []).map(p => Number(p.id) || 0));
  return Math.max(...ids) + 1;
}
function academyLocalCountry(){
  const club = seed?.clubs?.find(c => Number(c.id) === Number(game?.selectedClubId || 0));
  return club ? clubCountry(club) : 'Argentina';
}
function academyNationality(id, options={}){
  if(options.local === true) return localNationalityForCountry(academyLocalCountry());
  return pickNationalityForGeneration(id, `academy-${game?.seasonNumber || 1}`, null, { localCountry:academyLocalCountry() }) || localNationalityForCountry(academyLocalCountry());
}
const ACADEMY_FIRST_NAMES = ['Bruno','Mateo','Thiago','Lautaro','Benjamín','Julián','Santino','Tomás','Bautista','Franco','Facundo','Gael','Ignacio','Valentín','Ramiro','Nicolás','Agustín','Ezequiel','Simón','Máximo'];
const ACADEMY_LAST_NAMES = ['Luna','Rojas','Pereyra','Acosta','Sosa','Coronel','Vera','Molina','Cabrera','Medina','Campos','Suárez','Giménez','Arias','Silva','Farias','Roldán','Castro','Ferreyra','Benítez'];
const ACADEMY_COUNTRY_NAME_POOLS = {
  Argentina:{ first:ACADEMY_FIRST_NAMES, last:ACADEMY_LAST_NAMES },
  Chile:{ first:['Benjamín','Vicente','Matías','Joaquín','Tomás','Diego','Martín','Agustín','Cristóbal','Nicolás'], last:['González','Muñoz','Rojas','Díaz','Pérez','Soto','Contreras','Silva','Martínez','Sepúlveda'] },
  Brasil:{ first:['João','Lucas','Gabriel','Matheus','Pedro','Rafael','Felipe','Gustavo','Bruno','Caio'], last:['Silva','Santos','Oliveira','Souza','Pereira','Costa','Rodrigues','Almeida','Nascimento','Lima'] },
  Inglaterra:{ first:['Oliver','Harry','George','Jack','Leo','Charlie','Thomas','William','James','Oscar'], last:['Smith','Jones','Taylor','Brown','Williams','Wilson','Johnson','Davies','Evans','Thomas'] },
  España:{ first:['Alejandro','Pablo','Hugo','Álvaro','Adrián','Diego','Javier','Mario','Sergio','Marcos'], last:['García','Martínez','López','Sánchez','Pérez','Gómez','Martín','Jiménez','Ruiz','Hernández'] },
  Italia:{ first:['Lorenzo','Matteo','Alessandro','Francesco','Leonardo','Andrea','Riccardo','Gabriele','Marco','Davide'], last:['Rossi','Russo','Ferrari','Esposito','Bianchi','Romano','Colombo','Ricci','Marino','Greco'] },
  Rumania:{ first:['Andrei','Alexandru','Mihai','Stefan','Ionut','Cristian','Gabriel','Florin','Daniel','Radu'], last:['Popescu','Ionescu','Dumitru','Stan','Stoica','Gheorghe','Radu','Matei','Marin','Toma'] }
};
function academyNameForCountry(id, country='Argentina'){
  const pool = ACADEMY_COUNTRY_NAME_POOLS[country] || ACADEMY_COUNTRY_NAME_POOLS[localNationalityForCountry(country)] || ACADEMY_COUNTRY_NAME_POOLS.Argentina;
  const first = pool.first[hashNumber(`academy-name-${country}-${id}`, pool.first.length)];
  const last = pool.last[hashNumber(`academy-last-${country}-${id}`, pool.last.length)];
  return `${first} ${last}`;
}
function academyName(id, country='Argentina'){
  return academyNameForCountry(id, country);
}
function academyOverallRoll(id){
  const roll = hashNumber(`academy-overall-band-${game?.seasonNumber || 1}-${id}-${Math.random()}`, 1000) / 1000;
  if(roll < 0.80) return 1 + hashNumber(`academy-overall-low-${id}-${Math.random()}`, 19);
  if(roll < 0.90) return 20 + hashNumber(`academy-overall-mid-${id}-${Math.random()}`, 11);
  return 30 + hashNumber(`academy-overall-high-${id}-${Math.random()}`, 11);
}
function academyGroupRoll(id){
  const roll = hashNumber(`academy-group-${game?.seasonNumber || 1}-${id}-${Math.random()}`, 100);
  if(roll < 10) return 'POR';
  if(roll < 40) return 'DEF';
  if(roll < 70) return 'MED';
  return 'DEL';
}
function academySkillsFor(group, overall, id){
  const mapped = normalizeAcademyGroup(group) === 'MED' ? 'MID' : normalizeAcademyGroup(group) === 'DEL' ? 'ATT' : normalizeAcademyGroup(group);
  const skills = skillsForGroup(mapped, clamp(Number(overall || 10), 1, 40), id);
  skills.resistencia = 1 + hashNumber(`academy-res-init-${id}`, 9);
  return skills;
}
function academyTempPlayer(player){
  return { id:player.id, name:player.name, age:player.age, nationality:player.nationality, position:academyRepresentativePosition(player.group), overall:player.overall, skills:player.skills || academySkillsFor(player.group, player.overall, player.id) };
}
function academyVisibleStats(player){ return visibleStats(academyTempPlayer(player), rawVisibleSkill); }
function academyProjectedOverall(player){ return rawVisibleOverall(academyTempPlayer(player)); }
function startAcademyScouting(){
  if(!game) return;
  game.academy = normalizeAcademyState(game.academy);
  if(academyAvailableSlots() <= 0){ showNotice('No hay lugares disponibles en la academia. Alquilá residencias o liberá cupos antes de captar juveniles.'); return; }
  if((game.budget || 0) < ACADEMY_SCOUTING_COST){ showNotice('Presupuesto insuficiente para hacer una captación.'); return; }
  recordBudgetChange(-ACADEMY_SCOUTING_COST, 'Captación de talentos', { type:'academy_scouting_start' });
  const count = ACADEMY_PLAYERS_MIN + Math.floor(Math.random() * (ACADEMY_PLAYERS_MAX - ACADEMY_PLAYERS_MIN + 1));
  const job = { id:`cap-${Date.now()}-${Math.round(Math.random()*9999)}`, startedTurn:currentTurnIndex(), dueTurn:currentTurnIndex() + ACADEMY_SCOUTING_TURNS, count, status:'pending' };
  game.academy.scoutingJobs.push(job);
  const exceptionalYouth = grantSeasonalExceptionalAcademyYouth();
  saveLocal(true);
  renderAcademy();
  showNotice(exceptionalYouth ? `Captación iniciada. Además llegó ${exceptionalYouth.name}, juvenil de ${ACADEMY_EXCEPTIONAL_YOUTH_AGE} años listo para entrenar o subir.` : 'Captación iniciada. El informe llegará en 35 días.');
}
function createAcademyBatch(count){
  const players = [];
  let id = nextAcademyPlayerId();
  for(let i=0;i<count;i++, id++){
    const group = academyGroupRoll(id);
    const overall = academyOverallRoll(id);
    const age = 8 + hashNumber(`academy-age-${game?.seasonNumber || 1}-${id}-${Math.random()}`, 7);
    const nationality = academyNationality(id);
    players.push(normalizeAcademyPlayer({
      id,
      name:academyName(id, nationality),
      nationality,
      age,
      group,
      overall,
      skills:academySkillsFor(group, overall, id),
      status:'academy',
      joinedSeason:game?.seasonNumber || 1,
      joinedTurn:currentTurnIndex()
    }));
  }
  return players;
}

function createExceptionalAcademyYouth(){
  const id = nextAcademyPlayerId();
  const group = academyGroupRoll(id);
  const span = Math.max(0, ACADEMY_EXCEPTIONAL_YOUTH_MAX_OVERALL - ACADEMY_EXCEPTIONAL_YOUTH_MIN_OVERALL);
  const overall = clamp(ACADEMY_EXCEPTIONAL_YOUTH_MIN_OVERALL + hashNumber(`academy-exceptional-overall-${game?.seasonNumber || 1}-${id}-${Math.random()}`, span + 1), 1, 40);
  return normalizeAcademyPlayer({
    id,
    name:academyName(id, academyLocalCountry()),
    nationality:academyNationality(id, { local:true }),
    age:ACADEMY_EXCEPTIONAL_YOUTH_AGE,
    group,
    overall,
    skills:academySkillsFor(group, overall, id),
    status:'academy',
    exceptional:true,
    source:'captacion_excepcional_temporada',
    joinedSeason:game?.seasonNumber || 1,
    joinedTurn:currentTurnIndex()
  });
}
function grantSeasonalExceptionalAcademyYouth(){
  if(!game?.academy || !ACADEMY_EXCEPTIONAL_YOUTH_ENABLED) return null;
  game.academy = normalizeAcademyState(game.academy);
  const season = Number(game.seasonNumber || 1);
  if(Number(game.academy.exceptionalYouthGrantedSeason || 0) === season) return null;
  if(academyAvailableSlots() <= 0){
    pushGameMessage({ type:'academia', title:'Juvenil excepcional perdido', body:'La captación encontró un juvenil de 16 años, pero no había cupo disponible en la academia.', priority:'normal' });
    game.academy.exceptionalYouthGrantedSeason = season;
    return null;
  }
  const player = createExceptionalAcademyYouth();
  game.academy.players.push(player);
  game.academy.exceptionalYouthGrantedSeason = season;
  pushGameMessage({
    type:'academia',
    title:'Juvenil excepcional incorporado',
    body:`La captación dejó una oportunidad inmediata: ${player.name}, ${academyGroupLabel(player.group)}, ${ACADEMY_EXCEPTIONAL_YOUTH_AGE} años, ya puede entrenarse en academia o firmar contrato profesional.`,
    priority:'normal'
  });
  return player;
}
function processAcademyScoutingArrivals(){
  if(!game?.academy) return 0;
  game.academy = normalizeAcademyState(game.academy);
  let added = 0;
  let lost = 0;
  game.academy.scoutingJobs.forEach(job => {
    if(job.status !== 'pending') return;
    if(Number(job.dueTurn || 0) > currentTurnIndex()) return;
    const requested = clamp(Number(job.count || 0), ACADEMY_PLAYERS_MIN, ACADEMY_PLAYERS_MAX);
    const available = academyAvailableSlots();
    if(available <= 0){
      job.status = 'completed_lost';
      job.completedTurn = currentTurnIndex();
      job.lostPlayers = requested;
      lost += requested;
      return;
    }
    const accepted = Math.min(requested, available);
    const batch = createAcademyBatch(requested).slice(0, accepted);
    game.academy.players.push(...batch);
    job.status = accepted >= requested ? 'completed' : 'completed_partial';
    job.completedTurn = currentTurnIndex();
    job.addedPlayers = batch.length;
    job.lostPlayers = Math.max(0, requested - batch.length);
    added += batch.length;
    lost += job.lostPlayers;
  });
  if(added > 0 || lost > 0){
    game.academy.lastArrivalTurn = currentTurnIndex();
    const parts = [];
    if(added > 0) parts.push(`La academia recibió ${added} juveniles para evaluar.`);
    if(lost > 0) parts.push(`${lost} juveniles se perdieron por falta de lugar.`);
    pushGameMessage({ type:'academia', title:'Informe de captación recibido', body:parts.join(' '), priority:lost > 0 ? 'high' : 'normal' });
  }
  return added;
}


function academyPlayerInjured(player){
  return Number(player?.injuredThroughTurn || 0) > currentTurnIndex();
}
function academyYouthInjuryTurnsLeft(player){
  return Math.max(0, Math.round(Number(player?.injuredThroughTurn || 0) - currentTurnIndex()));
}
function academyYouthInjuryLabel(player){
  const turns = academyYouthInjuryTurnsLeft(player);
  if(turns <= 0) return '';
  return `${player.injuryName || 'Lesión juvenil'} · ${formatDaysFromTurns(turns)}`;
}
function clearRecoveredAcademyYouthInjuries(){
  if(!game?.academy) return 0;
  let recovered = 0;
  academyActivePlayers().forEach(player => {
    if(Number(player.injuredThroughTurn || 0) > 0 && Number(player.injuredThroughTurn || 0) <= currentTurnIndex()){
      player.injuredThroughTurn = 0;
      player.injuryStartTurn = 0;
      player.injuryName = '';
      player.injuryTreated = false;
      recovered += 1;
    }
  });
  return recovered;
}
function academySeasonProgressRatio(){
  const total = Math.max(1, (game?.fixtures || []).length || 30);
  const current = clamp(Number(game?.matchdayIndex || 0), 0, total);
  return clamp(current / total, 0, 1);
}
function processAcademyYouthInjuries(){
  if(!game?.academy) return 0;
  ensureAcademyYouthInjurySeason();
  clearRecoveredAcademyYouthInjuries();
  const target = Math.max(0, Math.round(Number(game.academy.youthInjuriesTarget || 0)));
  if(target <= 0) return 0;
  const count = Math.max(0, Math.round(Number(game.academy.youthInjuriesCount || 0)));
  if(count >= target) return 0;
  const progress = academySeasonProgressRatio();
  const due = Math.min(target, Math.floor((progress * target) + 0.15));
  const randomPush = Math.random() < 0.06;
  const forcedEndSeason = progress >= 0.88;
  if(due <= count && !randomPush && !forcedEndSeason) return 0;
  const candidates = academyActivePlayers().filter(player => !academyPlayerInjured(player));
  if(!candidates.length) return 0;
  const player = candidates[hashNumber(`academy-injury-pick-${game.seasonNumber || 1}-${currentTurnIndex()}-${Math.random()}`, candidates.length)];
  const names = ['sobrecarga muscular','esguince leve','molestia en la rodilla','contractura fuerte','dolor en el aductor','golpe en el tobillo'];
  const duration = rnd(ACADEMY_YOUTH_INJURY_MIN_TURNS, ACADEMY_YOUTH_INJURY_MAX_TURNS);
  player.injuryName = names[hashNumber(`academy-injury-name-${player.id}-${currentTurnIndex()}-${Math.random()}`, names.length)];
  player.injuryStartTurn = currentTurnIndex();
  player.injuredThroughTurn = currentTurnIndex() + duration;
  player.injuryTreated = false;
  player.injuriesSeason = Math.max(0, Math.round(Number(player.injuriesSeason || 0))) + 1;
  game.academy.youthInjuriesCount = count + 1;
  pushGameMessage({ type:'academia', priority:'normal', title:'Juvenil lesionado', body:`${player.name} sufrió ${player.injuryName}. Mientras esté lesionado no entrenará habilidades.` });
  return 1;
}
function treatAcademyYouthInjuryCore(playerId, options={}){
  if(!game) return { success:false, message:'No hay partida activa.' };
  game.academy = normalizeAcademyState(game.academy);
  const player = game.academy.players.find(p => Number(p.id) === Number(playerId) && p.status === 'academy');
  if(!player || !academyPlayerInjured(player)) return { success:false, message:'El juvenil no está lesionado.' };
  const injuryName = player.injuryName || 'lesión juvenil';
  player.injuredThroughTurn = 0;
  player.injuryStartTurn = 0;
  player.injuryName = '';
  player.injuryTreated = true;
  if(typeof awardSpecialPoints === 'function') awardSpecialPoints('tratar_jugador_lesionado', { playerId:player.id, youth:true, success:true });
  return { success:true, player, injuryName, message:`${player.name} fue tratado por ${injuryName} y puede volver a entrenar.` };
}
function treatAcademyYouthInjury(playerId){
  const result = treatAcademyYouthInjuryCore(playerId);
  if(!result.success){ showNotice(result.message || 'No se pudo tratar al juvenil.'); return; }
  saveLocal(true);
  renderAcademy();
  showNotice(result.message);
}
function academyInjuredTreatmentItems(){
  if(!game?.academy) return [];
  game.academy = normalizeAcademyState(game.academy);
  return academyActivePlayers().filter(player => academyPlayerInjured(player)).map(player => ({
    kind:'youth',
    player,
    remaining:academyYouthInjuryTurnsLeft(player),
    status:{ injuryLabel:player.injuryName || 'Lesión juvenil' }
  }));
}

function academyTurnSalaryCost(){
  const count = academyActivePlayers().length;
  if(!count) return 0;
  const total = count * ACADEMY_PLAYER_TURN_COST;
  recordBudgetChange(-total, 'Sueldos de academia', { type:'academy_turn_salary', players:count });
  return total;
}
function academyTrainingType(playerId){
  return game?.academy?.trainingPlan?.[playerId] === 'resistance' ? 'resistance' : 'technical';
}
function academyTrainingGainMultiplier(player){
  return player?.exceptional ? ACADEMY_EXCEPTIONAL_YOUTH_TRAINING_MULTIPLIER : ACADEMY_SKILL_GAIN_MULTIPLIER;
}
function applyAcademyTrainingEffects(){
  if(!game?.academy) return;
  academyActivePlayers().forEach(player => {
    if(academyPlayerInjured(player)) return;
    player.skills = player.skills || academySkillsFor(player.group, player.overall, player.id);
    const type = academyTrainingType(player.id);
    const gainMultiplier = Math.max(1, Math.round(academyTrainingGainMultiplier(player)));
    if(type === 'resistance'){
      player.skills.resistencia = clamp(Math.round(Number(player.skills.resistencia || 1) + rnd(3,6) * gainMultiplier), 1, 99);
    } else {
      const skillNames = Object.keys(player.skills).filter(k => k !== 'porteria' || player.group === 'POR');
      for(let i=0;i<gainMultiplier;i++){
        const skill = skillNames[hashNumber(`academy-train-${player.id}-${currentTurnIndex()}-${i}-${Math.random()}`, skillNames.length)];
        player.skills[skill] = clamp(Math.round(Number(player.skills[skill] || 1) + 1), 1, 99);
      }
    }
    player.overall = clamp(academyProjectedOverall(player), 1, 60);
  });
}
function processAcademyTurn(){
  if(!game) return;
  game.academy = normalizeAcademyState(game.academy);
  processAcademyResidenceRent();
  processAcademyYouthInjuries();
  academyTurnSalaryCost();
  applyAcademyTrainingEffects();
  const added = processAcademyScoutingArrivals();
  if(activeTab === 'academy' && added > 0) renderAcademy();
}
function academyYouthPreparerActive(){
  return staffActive('youth_preparer');
}
function hireYouthPreparer(){
  openStaffHireModal('youth_preparer', renderAcademy);
}
function academyLockedStatTargets(){
  const targets = [];
  academyActivePlayers().forEach(player => {
    const stats = Object.keys(academyVisibleStats(player));
    const unlocked = new Set(game.academy.unlockedStats[player.id] || []);
    stats.forEach(stat => { if(!unlocked.has(stat)) targets.push({ playerId:player.id, stat }); });
  });
  return targets;
}
function consultAcademyPlayers(){
  if(!academyYouthPreparerActive()){ showNotice('Necesitás contratar al preparador de juveniles para consultar informes.'); return; }
  const turn = currentTurnIndex();
  if(Number(game.academy.lastConsultTurn) === turn){ showNotice('El preparador ya entregó un informe esta semana.'); return; }
  const targets = academyLockedStatTargets();
  if(!targets.length){ showNotice('No quedan habilidades ocultas por desbloquear en la academia.'); return; }
  const baseAmount = 1 + Math.floor(Math.random() * 2);
  const amount = Math.min(targets.length, Math.max(1, Math.round(baseAmount * staffPerformanceMultiplier('youth_preparer') * ACADEMY_CONSULT_REVEAL_MULTIPLIER)));
  const revealed = [];
  for(let i=0;i<amount;i++){
    const remaining = academyLockedStatTargets();
    if(!remaining.length) break;
    const pick = remaining[hashNumber(`academy-consult-${turn}-${i}-${Math.random()}`, remaining.length)];
    game.academy.unlockedStats[pick.playerId] = game.academy.unlockedStats[pick.playerId] || [];
    if(!game.academy.unlockedStats[pick.playerId].includes(pick.stat)) game.academy.unlockedStats[pick.playerId].push(pick.stat);
    const p = game.academy.players.find(x => Number(x.id) === Number(pick.playerId));
    revealed.push(`${p?.name || 'Juvenil'}: ${pick.stat}`);
  }
  game.academy.lastConsultTurn = turn;
  game.academy.lastConsultReveal = { turn, revealed:revealed.slice(0,12), total:revealed.length, createdAt:Date.now() };
  if(typeof awardSpecialPoints === 'function') awardSpecialPoints('consultar_juveniles', { revealed:revealed.length });
  saveLocal(true);
  renderAcademy();
  showNotice(`Informe recibido: ${revealed.join(' · ')}`);
}
function dismissAcademyPlayer(playerId){
  if(!game) return;
  game.academy = normalizeAcademyState(game.academy);
  const player = game.academy.players.find(p => Number(p.id) === Number(playerId) && p.status === 'academy');
  if(!player) return;
  if((game.budget || 0) < ACADEMY_DISMISS_COMPENSATION){ showNotice('Presupuesto insuficiente para pagar la compensación.'); return; }
  if(!confirm(`Despedir a ${player.name} de la academia?`)) return;
  recordBudgetChange(-ACADEMY_DISMISS_COMPENSATION, 'Compensación por baja de academia', { type:'academy_dismiss', playerId });
  player.status = 'dismissed';
  player.dismissedTurn = currentTurnIndex();
  saveLocal(true);
  renderAcademy();
  showNotice(`${player.name} fue dado de baja de la academia.`);
}
function openPromoteAcademyModal(playerId){
  const player = academyActivePlayers().find(p => Number(p.id) === Number(playerId));
  if(!player) return;
  if(Number(player.age || 0) < 16){ showNotice('El juvenil todavía no tiene edad para firmar contrato profesional.'); return; }
  const options = academyExactPositions(player.group).map(pos => `<option value="${pos}">${pos} · ${escapeHtml(roleMeta(pos).name)}</option>`).join('');
  openModal(`<div class="purchase-offer-modal"><h2>Contrato profesional</h2><p class="muted">Fijá la posición definitiva de ${escapeHtml(player.name)} antes de subirlo al primer equipo.</p><label for="academyPromotePosition">Posición</label><select id="academyPromotePosition">${options}</select><div class="row" style="margin-top:14px"><button class="primary" id="btnConfirmPromoteAcademy">Subir al primer equipo</button></div></div>`);
  $('btnConfirmPromoteAcademy')?.addEventListener('click', () => promoteAcademyPlayer(playerId, $('academyPromotePosition')?.value));
}
function promoteAcademyPlayer(playerId, exactPosition){
  if(!game) return;
  game.academy = normalizeAcademyState(game.academy);
  const player = game.academy.players.find(p => Number(p.id) === Number(playerId) && p.status === 'academy');
  if(!player) return;
  if(Number(player.age || 0) < 16){ showNotice('El juvenil todavía no tiene edad para firmar contrato profesional.'); return; }
  if(!hasFirstTeamRosterSpace(game.selectedClubId, 1)){ showRosterLimitNotice(); return; }
  const allowed = academyExactPositions(player.group);
  const position = allowed.includes(exactPosition) ? exactPosition : allowed[0];
  const official = {
    id:player.id,
    name:player.name,
    age:player.age,
    nationality:player.nationality,
    position,
    clubId:game.selectedClubId,
    overall:clamp(academyProjectedOverall(player), 1, 99),
    skills:{ ...(player.skills || academySkillsFor(player.group, player.overall, player.id)) },
    freeAgent:false,
    academyOrigin:true,
    joinedClubSeason:game.seasonNumber || 1,
    salaryPaidCount:0,
    lastSalaryPaidSeason:0
  };
  official.salary = initialAnnualSalaryForMedia(official.overall, 0.40);
  refreshPlayerClause(official);
  seed.players = (seed.players || []).filter(p => Number(p.id) !== Number(official.id));
  seed.players.push(official);
  game.playerCondition[official.id] = 70;
  game.playerMorale[official.id] = PLAYER_MORALE_START;
  game.playerSkillBoosts[official.id] = {};
  game.trainingPlan[official.id] = safeIndividualTrainingType(TRAINING_INDIVIDUAL_INITIAL);
  game.playerStats[official.id] = typeof createEmptyPlayerStat === 'function' ? createEmptyPlayerStat(official) : { playerId:official.id, clubId:official.clubId, goals:0, assists:0, yellow:0, red:0, played:0, injuries:0, keySaves:0, errors:0, goalErrors:0 };
  player.status = 'promoted';
  player.promotedTurn = currentTurnIndex();
  player.promotedPosition = position;
  pushGameMessage({ type:'academia', title:'Juvenil promovido', body:`${official.name} firmó contrato profesional como ${position}.`, priority:'normal' });
  closeModal();
  saveLocal(true);
  renderAll();
  showNotice(`${official.name} ya está en el primer equipo.`);
}
function applyAcademyAgingIfNeeded(){
  if(!game?.academy) return 0;
  const season = Number(game.seasonNumber || 1);
  if(season % 2 !== 0) return 0;
  let count = 0;
  game.academy.players.forEach(player => {
    if(player.status !== 'academy') return;
    player.age = Math.max(8, Number(player.age || 12) + 1);
    count += 1;
  });
  return count;
}
function academyPendingJobsMarkup(){
  const jobs = (game.academy?.scoutingJobs || []).filter(j => j.status === 'pending');
  if(!jobs.length) return '<p class="muted">No hay captaciones en curso.</p>';
  return `<div class="academy-jobs">${jobs.map(job => `<div class="stat-rank"><span>Captación en curso</span><strong>${formatDays(daysUntilTurn(job.dueTurn || 0))}</strong></div>`).join('')}</div>`;
}
function academyVisibleSkillsProgress(player){
  const stats = academyVisibleStats(player);
  const labels = Object.keys(stats);
  const unlocked = new Set(game.academy?.unlockedStats?.[player.id] || []);
  const total = labels.length || 0;
  const visible = labels.filter(label => unlocked.has(label)).length;
  const percent = total ? Math.round((visible / total) * 100) : 0;
  return { total, visible, percent };
}
function academyVisibilityPieMarkup(player){
  const progress = academyVisibleSkillsProgress(player);
  const title = progress.total
    ? `${progress.visible}/${progress.total} habilidades visibles`
    : 'Sin habilidades para mostrar';
  return `<div class="academy-visibility" title="${escapeHtml(title)}">
    <div class="academy-visibility-pie" style="--academy-visible-pct:${progress.percent}"><strong>${progress.percent}%</strong></div>
    <div>
      <p class="label">Habilidades visibles</p>
      <strong>${progress.visible}/${progress.total}</strong>
      <p class="small muted">Informe descubierto</p>
    </div>
  </div>`;
}
function academyAverageVisibilityPieMarkup(activePlayers){
  const players = Array.isArray(activePlayers) ? activePlayers : [];
  if(!players.length){
    return `<div class="academy-visibility academy-visibility-average"><div class="academy-visibility-pie" style="--academy-visible-pct:0"><strong>0%</strong></div><div><p class="label">Habilidades visibles</p><strong>Sin juveniles</strong><p class="small muted">Promedio activo</p></div></div>`;
  }
  const progress = players.map(player => academyVisibleSkillsProgress(player));
  const avgPercent = Math.round(avg(progress.map(item => item.percent)) || 0);
  const totalVisible = progress.reduce((sum, item) => sum + Number(item.visible || 0), 0);
  const totalStats = progress.reduce((sum, item) => sum + Number(item.total || 0), 0);
  return `<div class="academy-visibility academy-visibility-average" title="${totalVisible}/${totalStats} habilidades visibles">
    <div class="academy-visibility-pie" style="--academy-visible-pct:${avgPercent}"><strong>${avgPercent}%</strong></div>
    <div>
      <p class="label">Habilidades visibles</p>
      <strong>${totalVisible}/${totalStats}</strong>
      <p class="small muted">Promedio de juveniles activos</p>
    </div>
  </div>`;
}
function academyPlayerStatsMarkup(player){
  const stats = academyVisibleStats(player);
  const unlocked = new Set(game.academy?.unlockedStats?.[player.id] || []);
  return `<div class="academy-hidden-stats">${Object.entries(stats).map(([label,value]) => `<div class="stat-rank"><span>${escapeHtml(label)}</span><strong>${unlocked.has(label) ? value : '—'}</strong></div>`).join('')}</div>`;
}
function academyPlayerCard(player){
  const training = academyTrainingType(player.id);
  const canPromote = Number(player.age || 0) >= 16;
  const injured = academyPlayerInjured(player);
  const injuryLabel = academyYouthInjuryLabel(player);
  const specialPill = player.exceptional ? '<span class="pill ok">Juvenil excepcional · x20</span>' : '<span class="pill">Media oculta</span>';
  const injuryPill = injured ? '<span class="pill bad">Lesionado</span>' : '';
  return `<div class="card academy-player-card ${player.exceptional ? 'academy-player-special' : ''} ${injured ? 'academy-player-injured' : ''}">
    <div class="row academy-player-head"><div><p class="label">${academyGroupLabel(player.group)} · ${Number(player.age || 0)} años · ${nationalityShortMarkup(player.nationality)}</p><h3>${escapeHtml(player.name)}</h3></div><div class="row gap-sm">${specialPill}${injuryPill}</div></div>
    ${injured ? `<div class="academy-injury-alert"><strong>${escapeHtml(injuryLabel)}</strong><span>No entrena habilidades hasta ser tratado o recuperarse.</span></div>` : ''}
    ${academyVisibilityPieMarkup(player)}
    ${academyPlayerStatsMarkup(player)}
    <div class="row academy-actions">
      <select data-academy-training="${player.id}" ${injured ? 'disabled' : ''}><option value="technical" ${training==='technical'?'selected':''}>Técnica</option><option value="resistance" ${training==='resistance'?'selected':''}>Resistencia</option></select>
      ${injured ? `<button class="primary small-btn" data-treat-academy-injury="${player.id}">Tratar · ${formatMoney(ACADEMY_YOUTH_INJURY_TREATMENT_COST)}</button>` : ''}
      <button class="ghost small-btn" data-dismiss-academy="${player.id}">Despedir</button>
      <button class="primary small-btn" data-promote-academy="${player.id}" ${canPromote ? '' : 'disabled'}>${canPromote ? 'Contrato profesional' : 'Menor de 16'}</button>
    </div>
  </div>`;
}
function academyConsultAnimationMarkup(){
  const info = game?.academy?.lastConsultReveal;
  if(!info || Number(info.turn || -1) !== currentTurnIndex()) return '';
  const revealed = Array.isArray(info.revealed) ? info.revealed : [];
  if(!revealed.length) return '';
  return `<div class="academy-consult-animation"><div><p class="label">Informe actualizado</p><strong>${Number(info.total || revealed.length)} habilidad(es) revelada(s)</strong></div><div class="academy-consult-revealed">${revealed.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div></div>`;
}
function renderAcademy(){
  game.academy = normalizeAcademyState(game.academy);
  const active = academyActivePlayers();
  const activePreparer = academyYouthPreparerActive();
  const salaryTurn = active.length * ACADEMY_PLAYER_TURN_COST;
  const residences = academyResidenceCount();
  const capacity = academyCapacity();
  const availableSlots = academyAvailableSlots();
  const avgVisible = academyAverageVisibleSkillsProgress();
  const scoutingDisabled = availableSlots <= 0;
  view.innerHTML = `
    <div class="row section-title">
      <div><h2>Academia</h2><p class="tagline">Captación, seguimiento y entrenamiento de juveniles antes de firmar contrato profesional.</p></div>
      <div class="pill">Costo por semana: ${formatMoney(salaryTurn)}</div>
    </div>
    <div class="card academy-residence-card" style="margin-bottom:14px">
      <div class="row"><div><p class="label">Residencias juveniles</p><h3>Cupos de academia</h3><p class="muted small">Base ${ACADEMY_BASE_CAPACITY} cupos. Cada residencia agrega ${ACADEMY_RESIDENCE_CAPACITY} cupos. Costo mensual por residencia: ${formatMoney(ACADEMY_RESIDENCE_MONTHLY_COST)}.</p></div><span class="pill">${active.length}/${capacity} ocupados</span></div>
      <div class="academy-residence-stats">
        <div><p class="label">Residencias alquiladas</p><strong>${residences}</strong></div>
        <div><p class="label">Cupo total</p><strong>${capacity}</strong></div>
        <div><p class="label">Cupos libres</p><strong>${availableSlots}</strong></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="primary" id="btnRentAcademyResidence">Alquilar residencias</button><button class="ghost" id="btnCancelAcademyResidence" ${residences > 0 ? '' : 'disabled'}>Cancelar alquiler de 1 residencia</button></div>
    </div>
    <div class="card academy-youth-preparer-card" style="margin-bottom:14px">
      <div class="row">
        <div><p class="label">Preparador de juveniles</p><h3>Informe de juveniles</h3><p class="muted small">Contratá al preparador para consultar y revelar habilidades de los juveniles activos.</p></div>
        <div class="academy-preparer-actions">${activePreparer ? staffContractCardMarkup('youth_preparer', 'mini') : `<button class="primary" id="btnHireYouthPreparer">Contratar · ${staffCostLabel('youth_preparer')}</button>`}<button class="ghost" id="btnConsultAcademy" ${activePreparer ? '' : 'disabled'}>Consultar juveniles</button></div>
      </div>
    </div>
    ${academyConsultAnimationMarkup()}
    <div class="grid cols-3 academy-summary">
      <div class="card"><p class="label">Juveniles</p><div class="metric">${active.length}/${capacity}</div><p class="small muted">Lugares libres: ${availableSlots}</p></div>
      <div class="card academy-average-card">${academyAverageVisibilityPieMarkup(active)}</div>
      <div class="card"><p class="label">Captación</p><div class="metric small">${formatMoney(ACADEMY_SCOUTING_COST)}</div><button class="primary" id="btnAcademyScouting" ${scoutingDisabled ? 'disabled' : ''}>Hacer captación de talentos</button>${scoutingDisabled ? '<p class="small warn">Sin cupos disponibles. Alquilá residencias o liberá juveniles.</p>' : ''}</div>
    </div>
    <div class="card" style="margin-top:14px"><h3>Captaciones pendientes</h3>${academyPendingJobsMarkup()}</div>
    <div class="card academy-rules-card" style="margin-top:14px"><p class="muted">Cada captación tarda 35 días y puede sumar entre 5 y 10 juveniles. Si no hay cupos al recibir el informe, los juveniles se pierden por falta de lugar. Una vez por temporada, la primera captación incorpora además un juvenil excepcional de 16 años, entrenable x20 y promovible de inmediato. Los juveniles pueden lesionarse entre ${ACADEMY_YOUTH_INJURIES_MIN_PER_SEASON} y ${ACADEMY_YOUTH_INJURIES_MAX_PER_SEASON} veces por temporada; mientras están lesionados no entrenan habilidades. Los juveniles cobran ${formatMoney(ACADEMY_PLAYER_TURN_COST)} por semana. Despedir uno cuesta ${formatMoney(ACADEMY_DISMISS_COMPENSATION)}.</p></div>
    <div class="academy-grid" style="margin-top:14px">${active.length ? active.map(academyPlayerCard).join('') : '<div class="card"><p class="muted">Todavía no hay juveniles en la academia.</p></div>'}</div>
  `;
  $('btnRentAcademyResidence')?.addEventListener('click', rentAcademyResidence);
  $('btnCancelAcademyResidence')?.addEventListener('click', cancelAcademyResidence);
  $('btnAcademyScouting')?.addEventListener('click', startAcademyScouting);
  $('btnHireYouthPreparer')?.addEventListener('click', hireYouthPreparer);
  $('btnConsultAcademy')?.addEventListener('click', consultAcademyPlayers);
  document.querySelectorAll('[data-dismiss-academy]').forEach(btn => btn.addEventListener('click', () => dismissAcademyPlayer(Number(btn.dataset.dismissAcademy))));
  document.querySelectorAll('[data-promote-academy]').forEach(btn => btn.addEventListener('click', () => openPromoteAcademyModal(Number(btn.dataset.promoteAcademy))));
  document.querySelectorAll('[data-treat-academy-injury]').forEach(btn => btn.addEventListener('click', () => treatAcademyYouthInjury(Number(btn.dataset.treatAcademyInjury))));
  document.querySelectorAll('[data-academy-training]').forEach(select => select.addEventListener('change', () => {
    game.academy.trainingPlan[select.dataset.academyTraining] = select.value === 'resistance' ? 'resistance' : 'technical';
    saveLocal(true);
    showNotice('Entrenamiento juvenil actualizado.');
  }));
}

function kinesioTreatmentItems(){
  const firstTeam = injuredPlayersByClub(game.selectedClubId).map(item => ({ ...item, kind:'first' }));
  const youth = typeof academyInjuredTreatmentItems === 'function' ? academyInjuredTreatmentItems() : [];
  return firstTeam.concat(youth);
}
function kinesioItemTreatmentKey(itemOrId, kind='first'){
  const playerId = typeof itemOrId === 'object' ? itemOrId?.player?.id : itemOrId;
  const itemKind = typeof itemOrId === 'object' ? (itemOrId?.kind || kind) : kind;
  return `${itemKind}:${playerId}`;
}
function academyYouthTreatmentVisual(player){
  const progress = typeof academyVisibleSkillsProgress === 'function' ? academyVisibleSkillsProgress(player) : { percent:0, visible:0, total:0 };
  return `<div class="academy-youth-treatment-visual" title="${escapeHtml(progress.visible || 0)}/${escapeHtml(progress.total || 0)} habilidades visibles"><div class="academy-visibility-pie" style="--academy-visible-pct:${Math.round(progress.percent || 0)}"><strong>${Math.round(progress.percent || 0)}%</strong></div></div>`;
}
function renderEmployees(){
  const last = game.staffActions?.motivationalTalk || null;
  const psychologistActive = staffActive('psychologist');
  const cooldownLeft = turnCooldownLeft(last, PSYCHOLOGIST_COOLDOWN_TURNS);
  const canCallPsychologist = psychologistActive && cooldownLeft <= 0;
  const cooldownText = cooldownLeft > 0 ? `<p class="small warn">Disponible nuevamente en ${formatDaysFromTurns(cooldownLeft)}.</p>` : '';
  const kinesioActive = staffActive('kinesiologist');
  const injuredList = kinesioTreatmentItems();
  view.innerHTML = `
    <div class="row section-title">
      <div>
        <h2>Empleados</h2>
        <p class="tagline">Acciones de apoyo para el plantel. Cada empleado puede contratarse en categoría Regular, Bueno o Elite.</p>
      </div>
      <div class="pill">Presupuesto: ${formatMoney(game.budget || 0)}</div>
    </div>
    ${staffContractsPanelMarkup({ empty:true })}
    <div class="grid cols-2" style="margin-top:14px">
      <div class="card staff-card">
        <h3>Psicólogo motivacional</h3>
        <p class="muted">Convoca una charla para intentar mejorar la moral del plantel.</p>
        <p class="label">Costo</p>
        <div class="metric small">${staffCostLabel('psychologist')}</div>
        ${psychologistActive ? staffContractCardMarkup('psychologist', 'mini') : `<button id="btnHirePsychologist" class="primary">Contratar</button>`}
        ${cooldownText}
        <button id="btnMotivationalTalk" class="primary" ${canCallPsychologist ? '' : 'disabled'}>Charla motivacional</button>
      </div>
      <div class="card staff-card">
        <h3>Estado del plantel</h3>
        <div class="stat-rank"><span>Moral media</span><strong>${squadMoraleAverage(game.selectedClubId)}/99</strong></div>
        <div class="profile-bar-wrap">${moraleTeamBar(game.selectedClubId)}</div>
        ${last ? `<div class="staff-result ${last.success ? 'ok-result' : 'bad-result'}"><div class="project-progress completed"><span style="width:100%"></span></div><strong>${escapeHtml(last.message)}</strong></div>` : '<p class="muted">Sin acciones recientes.</p>'}
      </div>
      <div class="card staff-card">
        <h3>Kinesiólogo</h3>
        <p class="muted">Contratación por temporada completa. Permite tratar lesionados una vez por semana.</p>
        <p class="label">Costo</p>
        <div class="metric small">${staffCostLabel('kinesiologist')}</div>
        ${kinesioActive ? staffContractCardMarkup('kinesiologist', 'mini') : `<button id="btnHireKinesiologist" class="primary">Contratar</button>`}
      </div>
      <div class="card staff-card">
        <h3>Tratamientos</h3>
        ${kinesioActive ? injuredTreatmentList(injuredList) : '<p class="muted">Contratá al kinesiólogo para habilitar tratamientos sobre jugadores lesionados.</p>'}
      </div>
    </div>
  `;
  $('btnHirePsychologist')?.addEventListener('click', () => openStaffHireModal('psychologist', renderEmployees));
  $('btnMotivationalTalk')?.addEventListener('click', (event) => callMotivationalPsychologist(event.currentTarget));
  $('btnHireKinesiologist')?.addEventListener('click', hireKinesiologist);
  $('btnKinesioTreatAll')?.addEventListener('click', (event) => treatAllInjuredPlayers(event.currentTarget));
  document.querySelectorAll('[data-kinesio-treat]').forEach(btn => {
    btn.addEventListener('click', () => treatInjuredPlayer(Number(btn.dataset.kinesioTreat), btn, btn.dataset.kinesioKind || 'first')); 
  });
}
function injuredTreatmentList(injuredList){
  if(!injuredList.length) return '<p class="muted">No hay jugadores lesionados para tratar.</p>';
  const eligible = injuredList.filter(item => !wasKinesioTreatedThisTurn(item.player.id, item.kind));
  const firstTeamEligible = eligible.filter(item => item.kind !== 'youth');
  const overtimeCost = firstTeamEligible.length ? currentKinesiologistOvertimeCost() : 0;
  const insufficientBudget = overtimeCost > 0 && (game.budget || 0) < overtimeCost;
  const bulkDisabled = !eligible.length || insufficientBudget;
  const bulkReason = !eligible.length ? 'Todos los lesionados disponibles ya fueron tratados esta semana.' : insufficientBudget ? 'Presupuesto insuficiente para pagar horas extras.' : (firstTeamEligible.length ? 'Se cobra horas extras sólo por el plantel profesional. Los juveniles se tratan gratis.' : 'Tratamiento gratuito para juveniles lesionados.');
  return `<div class="kinesio-bulk-card">
    <p class="label">Que los médicos hagan horas extras hoy</p>
    <div class="row gap-sm">
      <button class="primary" id="btnKinesioTreatAll" ${bulkDisabled ? 'disabled' : ''}>Tratar a todos · ${formatMoney(overtimeCost)}</button>
      <span class="pill">${eligible.length}/${injuredList.length} pendiente(s)</span>
    </div>
    <p class="small ${insufficientBudget ? 'warn' : 'muted'}">${escapeHtml(bulkReason)}</p>
    <div class="kinesio-bulk-progress hidden" id="kinesioBulkProgress"></div>
  </div>
  <div class="injured-treatment-list">${injuredList.map(item => {
    const kind = item.kind || 'first';
    const treated = wasKinesioTreatedThisTurn(item.player.id, kind);
    const key = kinesioItemTreatmentKey(item);
    const visual = kind === 'youth' ? academyYouthTreatmentVisual(item.player) : faceImg(item.player, 'injured-home-face');
    const nameButton = kind === 'youth'
      ? `<strong>${escapeHtml(item.player.name)}</strong>`
      : `<button class="linklike" data-player-id="${item.player.id}">${availabilityIcons(item.player.id)}${escapeHtml(item.player.name)}</button>`;
    const extra = kind === 'youth' ? '<span class="small muted">Juvenil de academia · tratamiento gratis</span>' : '';
    return `<div class="injured-treatment-row ${kind === 'youth' ? 'youth-treatment' : ''}" data-treatment-row="${escapeHtml(key)}">
      ${visual}
      <div>${nameButton}<span>${escapeHtml(item.status.injuryLabel || 'Lesión')} · ${formatDaysFromTurns(item.remaining)}</span>${extra}<span class="treatment-status" data-kinesio-status="${escapeHtml(key)}">${treated ? 'Tratado esta semana' : ''}</span></div>
      <button class="ghost" data-kinesio-treat="${item.player.id}" data-kinesio-kind="${escapeHtml(kind)}" ${treated ? 'disabled' : ''}>${treated ? 'Tratado esta semana' : 'Tratar'}</button>
    </div>`;
  }).join('')}</div>`;
}
function wasKinesioTreatedThisTurn(playerId, kind='first'){
  if(kind === 'youth') return false;
  const key = `${currentTurnIndex()}:${playerId}`;
  return Boolean(game.staffActions?.kinesiologyTreatments?.[key]);
}
function currentKinesiologistOvertimeCost(){
  const contract = staffContract('kinesiologist');
  const reference = Number(contract?.cost || staffHireCost('kinesiologist', contract?.category || 'regular') || staffBaseCost('kinesiologist') || 0);
  return Math.max(0, Math.round(reference * KINESIOLOGIST_OVERTIME_COST_RATE));
}
function hireKinesiologist(){
  openStaffHireModal('kinesiologist', renderEmployees);
}
function applyKinesioTreatment(playerId, kind='first'){
  if(!staffActive('kinesiologist')){ return { success:false, message:'Primero tenés que contratar al kinesiólogo.' }; }
  if(kind === 'youth'){
    const result = treatAcademyYouthInjuryCore(playerId);
    return {
      success:Boolean(result.success),
      recoveryReductionTurns:0,
      buttonLabel: result.success ? 'Juvenil tratado' : 'Tratamiento fallido',
      message: result.message || 'No se pudo tratar al juvenil.'
    };
  }
  if(!isInjured(playerId)){ return { success:false, message:'El jugador no está lesionado.', after:renderEmployees }; }
  game.staffActions.kinesiologyTreatments = game.staffActions.kinesiologyTreatments || {};
  const key = `${currentTurnIndex()}:${playerId}`;
  if(game.staffActions.kinesiologyTreatments[key]){ return { success:false, message:'Este jugador ya recibió tratamiento esta semana.' }; }
  const success = Math.random() >= KINESIOLOGIST_FAILURE_CHANCE;
  const recoveryReductionTurns = Math.max(1, Math.round(staffPerformanceMultiplier('kinesiologist')));
  game.staffActions.kinesiologyTreatments[key] = { success, ...turnStamp({ playerId }) };
  if(typeof awardSpecialPoints === 'function') awardSpecialPoints('tratar_jugador_lesionado', { playerId, success });
  if(success){
    const st = playerStatus(playerId);
    const nextThrough = Number(st.injuredThrough) - recoveryReductionTurns;
    if(nextThrough < game.matchdayIndex){
      const { injuredThrough, injuryLabel, injuryChance, injuredAtMatchday, ...rest } = st;
      game.playerStatus[playerId] = rest;
    } else {
      game.playerStatus[playerId] = { ...st, injuredThrough:nextThrough };
    }
  }
  return {
    success,
    recoveryReductionTurns,
    buttonLabel: success ? 'Tratamiento realizado' : 'Tratamiento fallido',
    message: success ? `Tratamiento exitoso. La recuperación se acortó ${formatDaysFromTurns(recoveryReductionTurns)}.` : 'El tratamiento falló. La lesión no se redujo.'
  };
}
function treatInjuredPlayer(playerId, button=null, kind='first'){
  const performTreatment = () => {
    const outcome = applyKinesioTreatment(playerId, kind);
    saveLocal(true);
    return { ...outcome, after:renderEmployees };
  };
  return runActionFeedback(button, performTreatment, {
    loadingLabel:'Tratando...',
    successLabel:kind === 'youth' ? 'Juvenil tratado' : 'Tratamiento realizado',
    failureLabel:'Tratamiento fallido'
  });
}
function kinesioDelay(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }
function setKinesioTreatmentRowState(playerId, state, label='', kind='first'){
  const key = `${kind}:${playerId}`;
  const row = document.querySelector(`[data-treatment-row="${key}"]`) || document.querySelector(`[data-treatment-row="${playerId}"]`);
  const status = document.querySelector(`[data-kinesio-status="${key}"]`) || document.querySelector(`[data-kinesio-status="${playerId}"]`);
  const btn = document.querySelector(`[data-kinesio-treat="${playerId}"][data-kinesio-kind="${kind}"]`) || document.querySelector(`[data-kinesio-treat="${playerId}"]`);
  if(row){
    row.classList.remove('is-processing','is-success','is-failure');
    if(state) row.classList.add(`is-${state}`);
  }
  if(status) status.textContent = label;
  if(btn){
    btn.disabled = true;
    if(state === 'processing') btn.textContent = 'Tratando...';
    if(state === 'success') btn.textContent = 'Tratado';
    if(state === 'failure') btn.textContent = 'Falló';
  }
}
async function treatAllInjuredPlayers(button=null){
  if(!game) return;
  if(button && (button.disabled || button.dataset.actionBusy === '1')) return;
  if(!staffActive('kinesiologist')){ showNotice('Primero tenés que contratar al kinesiólogo.'); return; }
  const targets = kinesioTreatmentItems().filter(item => !wasKinesioTreatedThisTurn(item.player.id, item.kind));
  if(!targets.length){ showNotice('No hay lesionados pendientes de tratamiento esta semana.'); return; }
  const professionalTargets = targets.filter(item => item.kind !== 'youth');
  const cost = professionalTargets.length ? currentKinesiologistOvertimeCost() : 0;
  if(cost > 0 && (game.budget || 0) < cost){ showNotice(`Presupuesto insuficiente. Necesitás ${formatMoney(cost)} para pagar horas extras médicas.`); return; }
  if(cost > 0) recordBudgetChange(-cost, `Horas extras médicas: tratamiento de ${professionalTargets.length} lesionado(s) profesional(es)`, { type:'kinesiology_overtime', players:professionalTargets.map(item => item.player.id), costRate:KINESIOLOGIST_OVERTIME_COST_RATE });
  const progress = $('kinesioBulkProgress');
  if(progress){
    progress.classList.remove('hidden');
    progress.innerHTML = `<div class="project-progress"><span style="width:0%"></span></div><strong>Preparando tratamientos...</strong>`;
  }
  if(button){
    button.dataset.actionBusy = '1';
    button.disabled = true;
    button.classList.add('action-processing');
    button.innerHTML = '<span class="action-spinner" aria-hidden="true"></span><span>Tratando plantel...</span>';
  }
  document.querySelectorAll('[data-kinesio-treat]').forEach(btn => { btn.disabled = true; });
  let successes = 0;
  let failures = 0;
  for(let index = 0; index < targets.length; index++){
    const item = targets[index];
    const playerName = item.player?.name || 'Jugador';
    setKinesioTreatmentRowState(item.player.id, 'processing', 'Tratamiento en curso...', item.kind || 'first');
    if(progress){
      const pct = Math.round((index / targets.length) * 100);
      progress.innerHTML = `<div class="project-progress"><span style="width:${pct}%"></span></div><strong>Tratando a ${escapeHtml(playerName)} (${index + 1}/${targets.length})</strong>`;
    }
    await kinesioDelay(KINESIOLOGIST_BULK_TREATMENT_STEP_MS);
    const outcome = applyKinesioTreatment(item.player.id, item.kind || 'first');
    if(outcome.success){
      successes++;
      setKinesioTreatmentRowState(item.player.id, 'success', item.kind === 'youth' ? 'Juvenil tratado' : `Éxito · -${formatDaysFromTurns(outcome.recoveryReductionTurns)}`, item.kind || 'first');
    }else{
      failures++;
      setKinesioTreatmentRowState(item.player.id, 'failure', 'Falló · sin reducción', item.kind || 'first');
    }
    saveLocal(true);
    const pct = Math.round(((index + 1) / targets.length) * 100);
    if(progress){
      progress.innerHTML = `<div class="project-progress completed"><span style="width:${pct}%"></span></div><strong>${escapeHtml(playerName)}: ${outcome.success ? 'tratamiento exitoso' : 'tratamiento fallido'}</strong>`;
    }
    await kinesioDelay(Math.max(250, Math.round(ACTION_FEEDBACK_RESULT_MS * 0.55)));
  }
  if(progress){
    progress.innerHTML = `<div class="project-progress completed"><span style="width:100%"></span></div><strong>Horas extras finalizadas: ${successes} éxito(s), ${failures} fallo(s).</strong>`;
  }
  if(button){
    button.classList.remove('action-processing');
    button.classList.add('action-success');
    button.innerHTML = '<span>Tratamientos finalizados</span>';
  }
  saveLocal(true);
  showNotice(`Tratamientos finalizados. Costo: ${formatMoney(cost)}. Éxitos: ${successes}. Fallos: ${failures}.`);
  await kinesioDelay(Math.max(650, ACTION_FEEDBACK_RESULT_MS));
  renderEmployees();
}
function moraleTeamBar(clubId){
  const value = squadMoraleAverage(clubId);
  const cls = value < 40 ? 'low' : value < 70 ? 'mid' : 'high';
  return `<div class="morale-bar ${cls} team-morale-bar" title="Moral media ${value}/99"><span style="width:${clamp(value,1,99)}%"></span><em>${value}/99</em></div>`;
}
function callMotivationalPsychologist(button=null){
  const performTalk = () => {
    if(!game) return { success:false, message:'No hay partida activa.' };
    const last = game.staffActions?.motivationalTalk || null;
    const cooldownLeft = turnCooldownLeft(last, PSYCHOLOGIST_COOLDOWN_TURNS);
    if(!staffActive('psychologist')){ return { success:false, message:'Primero tenés que contratar al psicólogo motivacional.' }; }
    if(cooldownLeft > 0){ return { success:false, message:`La charla motivacional estará disponible en ${formatDaysFromTurns(cooldownLeft)}.` }; }
    const success = Math.random() < PSYCHOLOGIST_SUCCESS_CHANCE;
    const moraleMultiplier = staffPerformanceMultiplier('psychologist');
    if(success){
      playersByClub(game.selectedClubId).forEach(player => {
        game.playerMorale[player.id] = clamp(Math.round(currentMorale(player.id) + rnd(18,25) * moraleMultiplier), 1, 99);
      });
    }
    game.staffActions = game.staffActions || {};
    game.staffActions.motivationalTalk = {
      success,
      ...turnStamp(),
      category:staffContract('psychologist')?.category || 'regular',
      performanceMultiplier:staffPerformanceMultiplier('psychologist'),
      message: success ? 'La charla motivacional fue un éxito' : 'La charla motivacional fue un fracaso'
    };
    saveLocal(true);
    return {
      success,
      buttonLabel: success ? 'Charla exitosa' : 'Charla fallida',
      message: game.staffActions.motivationalTalk.message,
      after:renderEmployees
    };
  };
  return runActionFeedback(button, performTalk, {
    loadingLabel:'Convocando charla...',
    successLabel:'Charla exitosa',
    failureLabel:'Charla fallida'
  });
}


function getTacticForClub(clubId){
  if(clubId === game.selectedClubId) return game.tactic;
  const club = seed.clubs.find(c=>c.id===clubId);
  const formation = club.reputation > 74 ? '4-3-3' : club.reputation < 61 ? '5-4-1' : '4-4-2';
  return { formation, defense:'posicional', midfield:'posicional', attack:'posicional' };
}
