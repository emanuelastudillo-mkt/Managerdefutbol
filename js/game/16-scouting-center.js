/* V6.07 · Centro de Ojeo: probabilidad de fichaje tratada como dato revelable. */

function createInitialScoutingCenterState(){
  return { listedPlayerIds:[], listedTeamIds:[], reports:{}, teamReports:{}, offices:0, scouts:0, chief:null, officeLastChargeDate:null, chiefLastChargeDate:null, scoutsLastChargeDate:null, lastDailyProcessDate:null };
}
function normalizeScoutingCenterState(state){
  const base = createInitialScoutingCenterState();
  const clean = { ...base, ...(state || {}) };
  clean.listedPlayerIds = Array.isArray(clean.listedPlayerIds) ? clean.listedPlayerIds.map(Number).filter(Boolean) : [];
  clean.listedPlayerIds = Array.from(new Set(clean.listedPlayerIds)).filter(id => {
    const p = typeof playerById === 'function' ? playerById(id) : null;
    return Boolean(p);
  });
  clean.listedTeamIds = Array.isArray(clean.listedTeamIds) ? clean.listedTeamIds.map(Number).filter(Boolean) : [];
  clean.listedTeamIds = Array.from(new Set(clean.listedTeamIds)).filter(id => {
    const club = seed?.clubs?.find(c => Number(c.id) === Number(id));
    return Boolean(club) && Number(id) !== Number(game?.selectedClubId || 0);
  });
  clean.reports = (clean.reports && typeof clean.reports === 'object' && !Array.isArray(clean.reports)) ? clean.reports : {};
  clean.teamReports = (clean.teamReports && typeof clean.teamReports === 'object' && !Array.isArray(clean.teamReports)) ? clean.teamReports : {};
  Object.entries({ ...clean.reports }).forEach(([id, report]) => {
    const numericId = Number(id);
    const player = typeof playerById === 'function' ? playerById(numericId) : null;
    if(!numericId || !player){ delete clean.reports[id]; return; }
    clean.reports[String(numericId)] = normalizeScoutingReport(numericId, report);
    if(String(id) !== String(numericId)) delete clean.reports[id];
  });
  clean.offices = Math.max(0, Math.round(Number(clean.offices || 0)));
  clean.scouts = Math.max(0, Math.round(Number(clean.scouts || 0)));
  clean.chief = clean.chief && typeof clean.chief === 'object' ? clean.chief : null;
  if(clean.chief && !scoutingChiefType(clean.chief.type)) clean.chief = null;
  clean.officeLastChargeDate = validIsoDate(clean.officeLastChargeDate) ? clean.officeLastChargeDate : null;
  clean.chiefLastChargeDate = validIsoDate(clean.chiefLastChargeDate) ? clean.chiefLastChargeDate : null;
  clean.scoutsLastChargeDate = validIsoDate(clean.scoutsLastChargeDate) ? clean.scoutsLastChargeDate : null;
  clean.lastDailyProcessDate = validIsoDate(clean.lastDailyProcessDate) ? clean.lastDailyProcessDate : null;
  const caps = scoutingCapacities(clean);
  Object.entries({ ...clean.teamReports }).forEach(([id, report]) => {
    const numericId = Number(id);
    const club = seed?.clubs?.find(c => Number(c.id) === Number(numericId));
    if(!numericId || !club){ delete clean.teamReports[id]; return; }
    clean.teamReports[String(numericId)] = normalizeScoutingTeamReport(numericId, report);
    if(String(id) !== String(numericId)) delete clean.teamReports[id];
  });
  clean.scouts = Math.min(clean.scouts, caps.scoutCapacity);
  const totalSlots = Math.max(0, Number(caps.playerCapacity || 0));
  clean.listedPlayerIds = clean.listedPlayerIds.slice(0, totalSlots);
  const remainingTeamSlots = Math.max(0, totalSlots - clean.listedPlayerIds.length);
  clean.listedTeamIds = clean.listedTeamIds.slice(0, remainingTeamSlots);
  return clean;
}
function scoutingTeamSectorDefinitions(){
  return [
    { key:'defense', label:'Defensa' },
    { key:'midfield', label:'Medios' },
    { key:'attack', label:'Delantera' }
  ];
}
function scoutingTeamSectorKeys(){
  return scoutingTeamSectorDefinitions().map(item => item.key);
}
function normalizeScoutingTeamReport(clubId, report={}){
  const allowed = new Set(scoutingTeamSectorKeys());
  const visible = Array.isArray(report.visibleSectors) ? report.visibleSectors.map(String) : [];
  const visibleSectors = Array.from(new Set(visible)).filter(key => allowed.has(key));
  return {
    clubId:Number(clubId),
    visibleSectors,
    daysObserved:Math.max(0, Math.round(Number(report.daysObserved || 0))),
    revealCount:Math.max(visibleSectors.length, Math.round(Number(report.revealCount || 0))),
    createdDate:validIsoDate(report.createdDate) ? report.createdDate : (game?.currentDate || currentCalendarDate()),
    lastUpdatedDate:validIsoDate(report.lastUpdatedDate) ? report.lastUpdatedDate : null,
    lastObservedDate:validIsoDate(report.lastObservedDate) ? report.lastObservedDate : null,
    lastRevealDate:validIsoDate(report.lastRevealDate) ? report.lastRevealDate : null,
    dynamic:true,
    type:'team_sector_report'
  };
}
function normalizeScoutingReport(playerId, report={}){
  const player = typeof playerById === 'function' ? playerById(playerId) : null;
  const visible = Array.isArray(report.visibleSkills) ? report.visibleSkills.map(String) : [];
  const allowed = new Set(player ? scoutingSkillKeys(player) : visible);
  const initialKnown = player ? scoutingInitialKnownSkillKeys(player) : [];
  const visibleSkills = Array.from(new Set([...initialKnown, ...visible])).filter(key => !allowed.size || allowed.has(key));
  const initialKnownSet = new Set(initialKnown);
  const revealedOnlyCount = player
    ? visibleSkills.filter(key => !initialKnownSet.has(key)).length
    : visibleSkills.length;
  return {
    playerId:Number(playerId),
    visibleSkills,
    daysObserved:Math.max(0, Math.round(Number(report.daysObserved || 0))),
    revealCount:Math.max(revealedOnlyCount, Math.round(Number(report.revealCount || 0))),
    lastUpdatedDate:validIsoDate(report.lastUpdatedDate) ? report.lastUpdatedDate : null,
    lastObservedDate:validIsoDate(report.lastObservedDate) ? report.lastObservedDate : null,
    lastRevealDate:validIsoDate(report.lastRevealDate) ? report.lastRevealDate : null,
    createdDate:validIsoDate(report.createdDate) ? report.createdDate : (game?.currentDate || currentCalendarDate())
  };
}
function ensureScoutingCenterState(){
  if(!game) return createInitialScoutingCenterState();
  game.scoutingCenter = normalizeScoutingCenterState(game.scoutingCenter || {});
  return game.scoutingCenter;
}
function scoutingChiefType(type){
  const key = String(type || '').toLowerCase();
  return (SCOUTING_CHIEF_TYPES || []).find(item => item.key === key) || null;
}
function scoutingCapacities(state=null){
  const clean = state || game?.scoutingCenter || {};
  const offices = Math.max(0, Math.round(Number(clean.offices || 0)));
  return {
    scoutCapacity:SCOUTING_BASE_SCOUTS + offices * SCOUTING_SCOUTS_PER_OFFICE,
    playerCapacity:SCOUTING_BASE_PLAYER_SLOTS + offices * SCOUTING_PLAYERS_PER_OFFICE
  };
}
function scoutingChiefMaxOffices(){
  const state = ensureScoutingCenterState();
  const type = scoutingChiefType(state.chief?.type);
  return type ? type.maxOffices : 0;
}
function scoutingIsOwnPlayer(player){
  return Boolean(player && game && Number(player.clubId || 0) === Number(game.selectedClubId || 0));
}
const SCOUTING_SIGNING_CHANCE_KEY = 'market.signingChance';
function stripScoutingSigningChanceFromReport(report){
  if(!report || typeof report !== 'object') return report;
  if(Array.isArray(report.visibleSkills)){
    report.visibleSkills = report.visibleSkills.filter(key => String(key) !== SCOUTING_SIGNING_CHANCE_KEY);
  }
  report.revealCount = Math.max(0, Math.round(Number(report.revealCount || 0)) - 1);
  return report;
}
function clearScoutedSigningChances(){
  if(!game?.scoutingCenter?.reports) return 0;
  let changed = 0;
  Object.keys(game.scoutingCenter.reports || {}).forEach(id => {
    const report = game.scoutingCenter.reports[id];
    if(report && Array.isArray(report.visibleSkills) && report.visibleSkills.includes(SCOUTING_SIGNING_CHANCE_KEY)){
      stripScoutingSigningChanceFromReport(report);
      changed += 1;
    }
  });
  return changed;
}
function scoutingSigningChanceMap(player){
  if(!player || scoutingIsOwnPlayer(player)) return {};
  const chance = typeof marketPlayerAcceptanceChance === 'function' ? marketPlayerAcceptanceChance(player) : null;
  if(chance === null || chance === undefined || !Number.isFinite(Number(chance))) return {};
  return { [SCOUTING_SIGNING_CHANCE_KEY]: Math.round(Number(chance) * 10) / 10 };
}
function playerHasScoutedSigningChance(playerOrId){
  const player = typeof playerOrId === 'object' ? playerOrId : (typeof playerById === 'function' ? playerById(Number(playerOrId || 0)) : null);
  if(!player || scoutingIsOwnPlayer(player)) return false;
  const known = typeof scoutingKnownSet === 'function' ? scoutingKnownSet(player.id) : new Set();
  return known.has(SCOUTING_SIGNING_CHANCE_KEY);
}
function scoutingSigningChanceValue(player){
  const map = scoutingSigningChanceMap(player);
  return map[SCOUTING_SIGNING_CHANCE_KEY];
}
function scoutingSigningChanceLabel(player){
  const value = scoutingSigningChanceValue(player);
  if(value === null || value === undefined || !Number.isFinite(Number(value))) return '—';
  const clean = Math.round(Number(value) * 10) / 10;
  return `${clean}%`;
}
function scoutingVisibleStatMap(player){
  return typeof scoutingStatMap === 'function' ? scoutingStatMap(player) : (player?.skills || {});
}
function scoutingHiddenStatMap(player){
  if(!player || typeof hiddenStats !== 'function') return {};
  const stats = hiddenStats(player);
  return {
    'hidden.aggression': stats.aggression,
    'hidden.genetics': stats.genetics,
    'hidden.surprise': stats.surprise
  };
}
function scoutingFullStatMap(player){
  return { ...scoutingVisibleStatMap(player), ...scoutingHiddenStatMap(player), ...scoutingSigningChanceMap(player) };
}
function scoutingHiddenSkillKeys(player){
  return Object.keys(scoutingHiddenStatMap(player) || {});
}
function scoutingVisibleSkillKeys(player){
  return Object.keys(scoutingVisibleStatMap(player) || {});
}
function scoutingInitialKnownSkillKeys(player){
  if(!scoutingIsOwnPlayer(player)) return [];
  return scoutingVisibleSkillKeys(player);
}
function scoutingSkillKeys(player){
  if(!player) return [];
  return Object.keys(scoutingFullStatMap(player) || {});
}
function scoutingMissingSkillKeysForPlayer(player, report=null){
  if(!player) return [];
  const cleanReport = report || scoutingReportForPlayer(player.id);
  const known = new Set(cleanReport.visibleSkills || []);
  // Jugadores propios: sólo se ojea información oculta faltante. Nunca se gasta avance en habilidades visibles.
  if(scoutingIsOwnPlayer(player)) return scoutingHiddenSkillKeys(player).filter(key => !known.has(key));
  // Jugadores externos: se revela cualquier dato todavía desconocido, visible u oculto, sin repetir habilidades ya ojeadas.
  return scoutingSkillKeys(player).filter(key => !known.has(key));
}
function scoutingMissingSectorKeysForTeam(clubId, report=null){
  const cleanReport = report || scoutingTeamReportForClub(clubId);
  const known = new Set(cleanReport.visibleSectors || []);
  return scoutingTeamSectorKeys().filter(key => !known.has(key));
}
function markScoutingDailyObservation(state, today){
  if(!state || !validIsoDate(today)) return 0;
  let observed = 0;
  (state.listedPlayerIds || []).forEach(playerId => {
    const player = typeof playerById === 'function' ? playerById(playerId) : null;
    if(!player) return;
    const report = scoutingReportForPlayer(player.id, state);
    if(report.lastObservedDate === today) return;
    report.daysObserved = Math.max(0, Number(report.daysObserved || 0)) + 1;
    report.lastObservedDate = today;
    observed += 1;
  });
  (state.listedTeamIds || []).forEach(clubId => {
    const club = seed?.clubs?.find(c => Number(c.id) === Number(clubId));
    if(!club) return;
    const report = scoutingTeamReportForClub(club.id, state);
    if(report.lastObservedDate === today) return;
    report.daysObserved = Math.max(0, Number(report.daysObserved || 0)) + 1;
    report.lastObservedDate = today;
    observed += 1;
  });
  return observed;
}
function scoutingKnownSet(playerId){
  const state = ensureScoutingCenterState();
  return new Set(state.reports[String(playerId)]?.visibleSkills || []);
}
function scoutingKnownCount(playerId){ return scoutingKnownSet(playerId).size; }
function scoutingReportForPlayer(playerId, stateOverride=null){
  const state = stateOverride || ensureScoutingCenterState();
  state.reports = (state.reports && typeof state.reports === 'object' && !Array.isArray(state.reports)) ? state.reports : {};
  const key = String(Number(playerId || 0));
  if(!state.reports[key]) state.reports[key] = normalizeScoutingReport(playerId, {});
  return state.reports[key];
}
function addPlayerToScoutingCenter(playerId, options={}){
  if(typeof managerWithoutClubActive === 'function' ? managerWithoutClubActive() : Boolean(game?.gameOver?.active)){ showNotice('No podés ojear jugadores mientras estás sin club.'); return; }
  if(!SCOUTING_CENTER_ENABLED || !game){ showNotice('El Centro de Ojeo no está disponible.'); return; }
  const player = playerById(playerId);
  if(!player){ showNotice('Jugador no encontrado.'); return; }
  const ownPlayer = scoutingIsOwnPlayer(player);
  const state = ensureScoutingCenterState();
  const caps = scoutingCapacities(state);
  const keepFicha = options.keepFicha !== false;
  const refreshFicha = () => {
    if(keepFicha && typeof showPlayerModal === 'function' && document.querySelector('.modal-backdrop')) showPlayerModal(Number(playerId));
  };
  if(state.listedPlayerIds.includes(Number(playerId))){
    showNotice(`${player.name} ya está en el Centro de Ojeo.`);
    refreshFicha();
    return;
  }
  if((state.listedPlayerIds.length + (state.listedTeamIds || []).length) >= caps.playerCapacity){ showNotice('No hay cupos libres en la lista de ojeo. Alquilá oficinas o quitá jugadores/equipos.'); return; }
  state.listedPlayerIds.push(Number(playerId));
  state.reports[String(playerId)] = normalizeScoutingReport(playerId, state.reports[String(playerId)] || {});
  saveLocal(true);
  showNotice(ownPlayer ? `${player.name} fue agregado para revelar habilidades ocultas.` : `${player.name} fue agregado al Centro de Ojeo.`);
  if(keepFicha){
    refreshFicha();
    return;
  }
  activeTab='scouting';
  if(typeof closeModal === 'function') closeModal();
  renderAll();
}

function addTeamToScoutingCenter(clubId){
  if(typeof managerWithoutClubActive === 'function' ? managerWithoutClubActive() : Boolean(game?.gameOver?.active)){ showNotice('No podés ojear equipos mientras estás sin club.'); return; }
  if(!SCOUTING_CENTER_ENABLED || !game){ showNotice('El Centro de Ojeo no está disponible.'); return; }
  const id = Number(clubId || 0);
  const club = seed?.clubs?.find(c => Number(c.id) === id);
  if(!club){ showNotice('Club no encontrado.'); return; }
  if(id === Number(game.selectedClubId || 0)){ showNotice('No necesitás ojear tu propio equipo desde el Centro de Ojeo.'); return; }
  const state = ensureScoutingCenterState();
  const caps = scoutingCapacities(state);
  state.listedTeamIds = Array.isArray(state.listedTeamIds) ? state.listedTeamIds.map(Number).filter(Boolean) : [];
  if(state.listedTeamIds.includes(id)){ showNotice(`${club.name} ya está en el Centro de Ojeo.`); activeTab='scouting'; if(typeof closeModal === 'function') closeModal(); renderAll(); return; }
  if((state.listedPlayerIds.length + state.listedTeamIds.length) >= caps.playerCapacity){ showNotice('No hay cupos libres en la lista de ojeo. Alquilá oficinas o quitá jugadores/equipos.'); return; }
  state.listedTeamIds.push(id);
  state.teamReports = (state.teamReports && typeof state.teamReports === 'object' && !Array.isArray(state.teamReports)) ? state.teamReports : {};
  state.teamReports[String(id)] = normalizeScoutingTeamReport(id, state.teamReports[String(id)] || {});
  saveLocal(true);
  showNotice(`${club.name} fue agregado al Centro de Ojeo.`);
  activeTab='scouting';
  if(typeof closeModal === 'function') closeModal();
  renderAll();
}
function removeTeamFromScoutingCenter(clubId){
  const state = ensureScoutingCenterState();
  const id = Number(clubId || 0);
  state.listedTeamIds = (state.listedTeamIds || []).map(Number).filter(teamId => teamId !== id);
  if(state.teamReports?.[String(id)]) state.teamReports[String(id)] = normalizeScoutingTeamReport(id, state.teamReports[String(id)]);
  saveLocal(true);
  renderScoutingCenter();
}
function scoutingTeamSectorStats(clubId){
  const squad = typeof playersByClub === 'function' ? playersByClub(clubId).filter(Boolean) : [];
  const avgSafe = values => values.length ? clamp(Math.round(avg(values)), 0, 99) : 0;
  const groupAvg = (players, resolver) => avgSafe(players.map(player => avgSafe(resolver(player))));
  const defenders = squad.filter(p => ['POR','DFC','LI','LD'].includes(String(p.position || '').toUpperCase()));
  const mids = squad.filter(p => ['MCD','MC','MCO','MD','MI'].includes(String(p.position || '').toUpperCase()));
  const attackers = squad.filter(p => ['DC','EI','ED'].includes(String(p.position || '').toUpperCase()));
  const skill = (p,key) => Number(p?.skills?.[key] ?? 0);
  return {
    defense:groupAvg(defenders, p => String(p.position || '').toUpperCase() === 'POR'
      ? [skill(p,'porteria'), skill(p,'posicionamiento'), skill(p,'serenidad')]
      : [skill(p,'marca'), skill(p,'entradas'), skill(p,'posicionamiento')]),
    midfield:groupAvg(mids, p => [skill(p,'paseCorto'), skill(p,'paseLargo'), skill(p,'vision')]),
    attack:groupAvg(attackers, p => [skill(p,'remate'), skill(p,'cabezazo')]),
    counts:{ defense:defenders.length, midfield:mids.length, attack:attackers.length, total:squad.length }
  };
}
function scoutingTeamReportForClub(clubId, stateOverride=null){
  const state = stateOverride || ensureScoutingCenterState();
  state.teamReports = (state.teamReports && typeof state.teamReports === 'object' && !Array.isArray(state.teamReports)) ? state.teamReports : {};
  const key = String(Number(clubId || 0));
  if(!state.teamReports[key]) state.teamReports[key] = normalizeScoutingTeamReport(clubId, {});
  return state.teamReports[key];
}
function scoutingTeamKnownSet(clubId){
  const report = scoutingTeamReportForClub(clubId);
  return new Set(report.visibleSectors || []);
}
function scoutingTeamKnownCount(clubId){
  return scoutingTeamKnownSet(clubId).size;
}
function scoutingTeamSectorMarkup(clubId){
  const stats = scoutingTeamSectorStats(clubId);
  const known = scoutingTeamKnownSet(clubId);
  const rows = scoutingTeamSectorDefinitions().map(item => ({
    ...item,
    value:Number(stats[item.key] || 0),
    count:Number(stats.counts?.[item.key] || 0),
    visible:known.has(item.key)
  }));
  return `<div class="tactic-skill-visor-list scouting-team-visors">${rows.map(row => {
    const shownValue = row.visible ? `${row.value}%` : '—';
    const barWidth = row.visible ? row.value : 0;
    const status = row.visible ? `${row.count} jugador(es) relevados` : 'Parámetro pendiente de ojeo';
    return `<div class="tactic-skill-visor ${row.key} ${row.visible ? 'known' : 'unknown'}"><div class="row"><span>${escapeHtml(row.label)}</span><strong>${shownValue}</strong></div><div class="project-progress"><span style="width:${barWidth}%"></span></div><small class="muted">${escapeHtml(status)}</small></div>`;
  }).join('')}</div>`;
}
function scoutingTeamCard(clubId){
  const club = seed?.clubs?.find(c => Number(c.id) === Number(clubId));
  if(!club) return '';
  const report = scoutingTeamReportForClub(clubId);
  const squadCount = typeof playersByClub === 'function' ? playersByClub(clubId).length : 0;
  const known = scoutingTeamKnownCount(clubId);
  const total = scoutingTeamSectorKeys().length || 1;
  const pct = clamp(Math.round((known / total) * 100), 0, 100);
  return `<div class="scouting-player-card scouting-team-card card inner">
    <div class="scouting-player-head">
      <div class="scouting-team-badge">${clubBadge(club.id) || '▣'}</div>
      <div><h3>${escapeHtml(club.name)}</h3><p class="muted small">${escapeHtml(club.divisionId || '')} · Plantel ${squadCount} · informe dinámico</p><span class="pill">Equipo ojeado</span></div>
      <button class="ghost small-btn" data-remove-scouting-team="${club.id}">Quitar</button>
    </div>
    <div class="project-progress scouting-report-progress"><span style="width:${pct}%"></span></div>
    <p class="muted small">Parámetros conocidos: ${known}/${total} · Días observado: ${Number(report.daysObserved || 0)}. Los porcentajes usan el promedio actual del plantel bot y pueden cambiar si el club modifica jugadores.</p>
    ${scoutingTeamSectorMarkup(club.id)}
    <p class="muted small">Creado: ${escapeHtml(report.createdDate || '—')}</p>
  </div>`;
}
function removePlayerFromScoutingCenter(playerId){
  const state = ensureScoutingCenterState();
  state.listedPlayerIds = state.listedPlayerIds.filter(id => Number(id) !== Number(playerId));
  // El informe queda archivado. Si ya se revelaron habilidades, la ficha del jugador debe seguir mostrándolas.
  if(state.reports[String(playerId)]) state.reports[String(playerId)] = normalizeScoutingReport(playerId, state.reports[String(playerId)]);
  saveLocal(true);
  renderScoutingCenter();
}
function hireScoutingChief(type){
  if(typeof managerChallengeBlocks === 'function' && managerChallengeBlocks('staff')){ showNotice(managerChallengeBlockedMessage('staff')); return; }
  const chief = scoutingChiefType(type);
  if(!chief){ showNotice('Jefe de ojeadores inválido.'); return; }
  const state = ensureScoutingCenterState();
  if(state.chief){ showNotice('Ya tenés un jefe de ojeadores. Se va solo al finalizar la temporada.'); return; }
  state.chief = { type:chief.key, hiredDate:game.currentDate || currentCalendarDate(), season:game.seasonNumber || 1 };
  state.chiefLastChargeDate = game.currentDate || currentCalendarDate();
  recordBudgetChange(-chief.monthlySalary, `Primer mes jefe de ojeadores ${chief.name}`, { type:'scouting_chief_salary', chief:chief.key });
  saveLocal(true);
  renderScoutingCenter();
}
function rentScoutingOffice(){
  if(typeof managerChallengeBlocks === 'function' && managerChallengeBlocks('staff')){ showNotice(managerChallengeBlockedMessage('staff')); return; }
  const state = ensureScoutingCenterState();
  const max = scoutingChiefMaxOffices();
  if(state.offices >= max){ showNotice(max > 0 ? 'Tu jefe de ojeadores no puede controlar más oficinas.' : 'Contratá un jefe de ojeadores antes de alquilar oficinas.'); return; }
  state.offices += 1;
  state.officeLastChargeDate = game.currentDate || currentCalendarDate();
  recordBudgetChange(-SCOUTING_OFFICE_MONTHLY_COST, 'Alquiler mensual de oficina de ojeo', { type:'scouting_office_rent', offices:state.offices });
  saveLocal(true);
  renderScoutingCenter();
}
function cancelScoutingOffice(){
  const state = ensureScoutingCenterState();
  if(state.offices <= 0){ showNotice('No hay oficinas de ojeo para cancelar.'); return; }
  const nextOffices = state.offices - 1;
  const nextCaps = scoutingCapacities({ ...state, offices:nextOffices });
  if(state.scouts > nextCaps.scoutCapacity){ showNotice('Primero despedí ojeadores. Con una oficina menos no alcanza el cupo actual.'); return; }
  if((state.listedPlayerIds.length + (state.listedTeamIds || []).length) > nextCaps.playerCapacity){ showNotice('Primero quitá jugadores o equipos de la lista de ojeo. Con una oficina menos no alcanza el cupo actual.'); return; }
  state.offices = nextOffices;
  if(state.offices <= 0) state.officeLastChargeDate = null;
  saveLocal(true);
  renderScoutingCenter();
}
function hireScoutingScout(){
  if(typeof managerChallengeBlocks === 'function' && managerChallengeBlocks('staff')){ showNotice(managerChallengeBlockedMessage('staff')); return; }
  const state = ensureScoutingCenterState();
  const caps = scoutingCapacities(state);
  if(state.scouts >= caps.scoutCapacity){ showNotice('No hay cupo para más ojeadores. Alquilá oficinas.'); return; }
  state.scouts += 1;
  state.scoutsLastChargeDate = game.currentDate || currentCalendarDate();
  recordBudgetChange(-SCOUTING_SCOUT_DAILY_COST, 'Contratación diaria de ojeador', { type:'scouting_scout_daily', scouts:state.scouts });
  saveLocal(true);
  renderScoutingCenter();
}
function dismissScoutingScout(){
  const state = ensureScoutingCenterState();
  if(state.scouts <= 0){ showNotice('No hay ojeadores contratados.'); return; }
  state.scouts -= 1;
  if(state.scouts <= 0) state.scoutsLastChargeDate = null;
  saveLocal(true);
  renderScoutingCenter();
}
function scoutingRevealOneSkill(attemptIndex=0, context='daily'){
  const state = ensureScoutingCenterState();
  const listed = state.listedPlayerIds.map(playerById).filter(Boolean);
  const listedTeams = (state.listedTeamIds || []).map(id => seed?.clubs?.find(c => Number(c.id) === Number(id))).filter(Boolean);
  const today = game.currentDate || currentCalendarDate();
  const candidates = [];
  listed.forEach(player => {
    const report = scoutingReportForPlayer(player.id, state);
    const ownPlayer = scoutingIsOwnPlayer(player);
    const revealPool = scoutingMissingSkillKeysForPlayer(player, report);
    if(revealPool.length){
      candidates.push({
        type:'player',
        id:Number(player.id),
        label:player.name || `Jugador ${player.id}`,
        hidden:revealPool,
        report,
        ownPlayer,
        revealCount:Math.max(0, Number(report.revealCount || 0)),
        lastRevealDate:report.lastRevealDate || ''
      });
    }
  });
  listedTeams.forEach(club => {
    const report = scoutingTeamReportForClub(club.id, state);
    const revealPool = scoutingMissingSectorKeysForTeam(club.id, report);
    if(revealPool.length){
      candidates.push({
        type:'team',
        id:Number(club.id),
        label:club.name || `Club ${club.id}`,
        hidden:revealPool,
        report,
        ownPlayer:false,
        revealCount:Math.max(0, Number(report.revealCount || 0)),
        lastRevealDate:report.lastRevealDate || ''
      });
    }
  });
  if(!candidates.length) return false;
  const ownPriority = Math.max(...candidates.map(item => Number(Boolean(item.ownPlayer))));
  const priorityCandidates = candidates.filter(item => Number(Boolean(item.ownPlayer)) === ownPriority);
  const minReveals = Math.min(...priorityCandidates.map(item => Number(item.revealCount || 0)));
  const lowRevealCandidates = priorityCandidates.filter(item => Number(item.revealCount || 0) === minReveals);
  const minMissing = Math.min(...lowRevealCandidates.map(item => Number(item.hidden.length || 0)));
  const pool = lowRevealCandidates.filter(item => Number(item.hidden.length || 0) === minMissing);
  pool.sort((a,b) => {
    const lastDateDelta = String(a.lastRevealDate || '').localeCompare(String(b.lastRevealDate || ''));
    if(lastDateDelta) return lastDateDelta;
    return String(a.label || '').localeCompare(String(b.label || ''), 'es');
  });
  const pickSeed = `scout-pick-${today}-${currentTurnIndex()}-${attemptIndex}-${context}-${pool.map(item => `${item.type}:${item.id}:${item.hidden.length}:${item.revealCount}:${item.lastRevealDate || '-'}`).join('|')}`;
  const pick = pool[hashNumber(pickSeed, pool.length)];
  const skillSeed = `scout-skill-${pick.type}-${pick.id}-${today}-${attemptIndex}-${context}-${pick.hidden.join('|')}`;
  const key = pick.hidden[hashNumber(skillSeed, pick.hidden.length)];
  const targetReport = pick.type === 'team'
    ? scoutingTeamReportForClub(pick.id, state)
    : scoutingReportForPlayer(pick.id, state);
  if(pick.type === 'team'){
    targetReport.visibleSectors = Array.from(new Set([...(targetReport.visibleSectors || []), key]));
  } else {
    targetReport.visibleSkills = Array.from(new Set([...(targetReport.visibleSkills || []), key]));
  }
  targetReport.revealCount = Math.max(0, Number(targetReport.revealCount || 0)) + 1;
  targetReport.lastRevealDate = today;
  targetReport.lastUpdatedDate = today;
  return true;
}
function scoutingChiefDailyReveals(){
  const state = ensureScoutingCenterState();
  const type = scoutingChiefType(state.chief?.type);
  if(!type) return 0;
  if(type.revealMax <= type.revealMin) return type.revealMin;
  return type.revealMin + hashNumber(`scout-chief-${state.chief.type}-${game.currentDate}-${game.seasonNumber}`, (type.revealMax - type.revealMin) + 1);
}
function processScoutingCenterMonthlyCosts(){
  const state = ensureScoutingCenterState();
  const today = game.currentDate || currentCalendarDate();
  if(!validIsoDate(today)) return 0;
  let total = 0;
  if(state.offices > 0 && SCOUTING_OFFICE_MONTHLY_COST > 0){
    if(!state.officeLastChargeDate) state.officeLastChargeDate = today;
    const months = Math.floor(daysBetweenIsoDates(state.officeLastChargeDate, today) / 30);
    if(months > 0){
      const cost = state.offices * SCOUTING_OFFICE_MONTHLY_COST * months;
      recordBudgetChange(-cost, 'Alquiler mensual de oficinas de ojeo', { type:'scouting_office_monthly', offices:state.offices, months });
      state.officeLastChargeDate = addDaysToIsoDate(state.officeLastChargeDate, months * 30);
      total += cost;
    }
  }
  const chief = scoutingChiefType(state.chief?.type);
  if(chief){
    if(!state.chiefLastChargeDate) state.chiefLastChargeDate = today;
    const months = Math.floor(daysBetweenIsoDates(state.chiefLastChargeDate, today) / 30);
    if(months > 0){
      const cost = chief.monthlySalary * months;
      recordBudgetChange(-cost, `Sueldo mensual jefe de ojeadores ${chief.name}`, { type:'scouting_chief_monthly', chief:chief.key, months });
      state.chiefLastChargeDate = addDaysToIsoDate(state.chiefLastChargeDate, months * 30);
      total += cost;
    }
  }
  return total;
}
function processScoutingCenterDaily(options={}){
  if(!SCOUTING_CENTER_ENABLED || !game) return { reveals:0, costs:0 };
  const state = ensureScoutingCenterState();
  const today = game.currentDate || currentCalendarDate();
  const reason = String(options.reason || 'daily');
  if(state.lastDailyProcessDate === today) return { reveals:0, costs:0, skipped:true, date:today, reason };
  state.lastDailyProcessDate = today;
  let costs = 0;
  if(state.scouts > 0 && SCOUTING_SCOUT_DAILY_COST > 0){
    const cost = state.scouts * SCOUTING_SCOUT_DAILY_COST;
    recordBudgetChange(-cost, 'Pago diario de ojeadores', { type:'scouting_scout_daily', scouts:state.scouts });
    costs += cost;
  }
  costs += processScoutingCenterMonthlyCosts();
  const attempts = Math.max(0, state.scouts) + scoutingChiefDailyReveals();
  const observed = attempts > 0 ? markScoutingDailyObservation(state, today) : 0;
  let reveals = 0;
  for(let i=0; i<attempts; i++){
    if(scoutingRevealOneSkill(i, reason)) reveals += 1;
  }
  game.lastScoutingDailyResult = { date:today, reason, attempts, reveals, observed, costs };
  return { reveals, costs, attempts, observed, date:today, reason };
}
function resetScoutingCenterForNewSeason(){
  if(!game) return;
  const state = ensureScoutingCenterState();
  state.chief = null;
  state.chiefLastChargeDate = null;
  state.lastDailyProcessDate = null;
  game.scoutingCenter = state;
}
function resetScoutingCenterForNewClub(){
  if(!game) return;
  const previous = ensureScoutingCenterState();
  Object.keys(previous.reports || {}).forEach(id => stripScoutingSigningChanceFromReport(previous.reports[id]));
  // Cambiar de club vacía oficinas, jefe, ojeadores y lista activa, pero conserva los informes ya revelados.
  // La información ojeada es progreso del manager. Sólo se borra la probabilidad de fichaje porque depende del club actual.
  game.scoutingCenter = { ...createInitialScoutingCenterState(), reports: previous.reports || {}, teamReports: previous.teamReports || {} };
}

function scoutingRepeatedIcons(icon, active=0, total=null, className=''){
  const safeActive = Math.max(0, Math.round(Number(active || 0)));
  const safeTotal = total === null ? safeActive : Math.max(0, Math.round(Number(total || 0)));
  const limit = Math.min(Math.max(safeTotal, safeActive), 24);
  const items = [];
  for(let i=0; i<limit; i++){
    const filled = i < safeActive;
    items.push(`<span class="${filled ? 'filled' : 'empty'}" aria-hidden="true">${icon}</span>`);
  }
  if(Math.max(safeTotal, safeActive) > limit) items.push(`<span class="more">+${Math.max(safeTotal, safeActive) - limit}</span>`);
  return `<div class="scouting-icon-stack ${className}">${items.join('')}</div>`;
}
function scoutingBinocularsIcon(extraClass=''){
  return `<span class="scouting-binoculars-icon ${extraClass}" aria-hidden="true"><span></span></span>`;
}
function scoutingSummaryTile({ label, value, hint='', icon='', extra='' }){
  return `<div class="card scouting-summary-tile ${extra}">
    <div class="scouting-summary-icon">${icon}</div>
    <div><p class="label">${escapeHtml(label)}</p><strong>${value}</strong>${hint ? `<small class="muted">${hint}</small>` : ''}</div>
  </div>`;
}

function scoutingPlayerSkillValueMarkup(player, key, value, known){
  if(!known) return '—';
  if(key === SCOUTING_SIGNING_CHANCE_KEY) return scoutingSigningChanceLabel(player);
  return escapeHtml(String(value ?? '—'));
}
function scoutingPlayerSkillRows(player, map){
  const known = scoutingKnownSet(player.id);
  return Object.entries(map || {}).map(([key,value]) => {
    const label = typeof scoutingSkillDisplayLabel === 'function' ? scoutingSkillDisplayLabel(player, key) : key;
    return `<div class="stat-rank"><span>${escapeHtml(label)}</span><strong>${scoutingPlayerSkillValueMarkup(player, key, value, known.has(key))}</strong></div>`;
  }).join('');
}
function scoutingPlayerKnownSkillRows(player){
  const knownSet = scoutingKnownSet(player.id);
  const visibleMap = scoutingVisibleStatMap(player);
  const hiddenMap = scoutingHiddenStatMap(player);
  const signingMap = scoutingSigningChanceMap(player);
  const hiddenKnown = Object.keys(hiddenMap).filter(key => knownSet.has(key)).length;
  const signingKeys = Object.keys(signingMap);
  const signingKnown = signingKeys.filter(key => knownSet.has(key)).length;
  const signingSection = signingKeys.length
    ? `<div class="scouting-known-section scouting-market-section"><p class="label">Mercado ${signingKnown}/${signingKeys.length}</p><div class="scouting-known-grid">${scoutingPlayerSkillRows(player, signingMap)}</div></div>`
    : '';
  return `
    <div class="scouting-known-section"><p class="label">Habilidades visibles</p><div class="scouting-known-grid">${scoutingPlayerSkillRows(player, visibleMap)}</div></div>
    <div class="scouting-known-section scouting-hidden-section"><p class="label">Habilidades ocultas ${hiddenKnown}/${Object.keys(hiddenMap).length}</p><div class="scouting-known-grid">${scoutingPlayerSkillRows(player, hiddenMap)}</div></div>
    ${signingSection}`;
}
function scoutingPlayerSigningChanceTone(chance){
  const value = Number(chance || 0);
  if(value >= 65) return 'ok';
  if(value >= 30) return 'warn';
  return 'bad';
}
function scoutingPlayerSigningChanceMarkup(player){
  if(!player || scoutingIsOwnPlayer(player)){
    return `<div class="scouting-signing-chance own"><span>Prob. fichaje</span><strong>—</strong><small>Jugador propio</small></div>`;
  }
  if(!playerHasScoutedSigningChance(player)){
    return `<div class="scouting-signing-chance hidden"><span>Prob. fichaje</span><strong>—</strong><small>Dato pendiente de ojeo</small></div>`;
  }
  const chance = scoutingSigningChanceValue(player);
  const tone = scoutingPlayerSigningChanceTone(chance);
  return `<div class="scouting-signing-chance ${tone}"><span>Prob. fichaje</span><strong>${scoutingSigningChanceLabel(player)}</strong><small>Revelado por ojeo</small></div>`;
}
function scoutingPlayerCard(player){
  const report = scoutingReportForPlayer(player.id);
  const known = scoutingKnownCount(player.id);
  const total = scoutingSkillKeys(player).length || 1;
  const hiddenTotal = Object.keys(scoutingHiddenStatMap(player)).length;
  const hiddenKnown = Object.keys(scoutingHiddenStatMap(player)).filter(key => scoutingKnownSet(player.id).has(key)).length;
  const pct = clamp(Math.round((known / total) * 100), 0, 100);
  const ownPill = scoutingIsOwnPlayer(player) ? '<span class="pill ok">Propio · ocultas primero</span>' : '<span class="pill">Externo</span>';
  return `<div class="scouting-player-card card inner">
    <div class="scouting-player-head">
      ${faceImg(player, 'scouting-player-face')}
      <div><h3>${typeof playerNameWithStar === 'function' ? playerNameWithStar(player) : escapeHtml(player.name)}</h3><p class="muted small">${escapeHtml(clubName(player.clubId))} · ${escapeHtml(player.nationality || '—')} · ${escapeHtml(player.position || '')}</p>${ownPill}</div>
      <button class="ghost small-btn" data-remove-scouting-player="${player.id}">Quitar</button>
    </div>
    <div class="project-progress scouting-report-progress"><span style="width:${pct}%"></span></div>
    <div class="scouting-player-meta-row">
      <p class="muted small">Habilidades conocidas: ${known}/${total} · Ocultas reveladas: ${hiddenKnown}/${hiddenTotal} · Días observado: ${Number(report.daysObserved || 0)}</p>
      ${scoutingPlayerSigningChanceMarkup(player)}
    </div>
    ${scoutingPlayerKnownSkillRows(player)}
  </div>`;
}

function scoutingPlayerReportEntries(mode='all'){
  const state = ensureScoutingCenterState();
  const activeIds = new Set((state.listedPlayerIds || []).map(Number));
  const reports = state.reports && typeof state.reports === 'object' && !Array.isArray(state.reports) ? state.reports : {};
  return Object.keys(reports).map(id => {
    const player = typeof playerById === 'function' ? playerById(Number(id)) : null;
    if(!player) return null;
    const report = normalizeScoutingReport(Number(id), reports[id]);
    const active = activeIds.has(Number(id));
    if(mode === 'archived' && active) return null;
    if(mode === 'active' && !active) return null;
    return { player, report, active };
  }).filter(Boolean).sort((a,b) => {
    if(Number(b.active) !== Number(a.active)) return Number(b.active) - Number(a.active);
    return String(a.player.name || '').localeCompare(String(b.player.name || ''), 'es');
  });
}
function scoutingPlayerReportListRow(entry){
  const player = entry.player;
  const report = entry.report || {};
  const known = Array.isArray(report.visibleSkills) ? report.visibleSkills.length : 0;
  const total = scoutingSkillKeys(player).length || 1;
  const hiddenMap = scoutingHiddenStatMap(player);
  const hiddenKnown = Object.keys(hiddenMap).filter(key => (report.visibleSkills || []).includes(key)).length;
  const hiddenTotal = Object.keys(hiddenMap).length;
  const signingText = playerHasScoutedSigningChance(player) ? scoutingSigningChanceLabel(player) : '<span class="muted">Oculto</span>';
  const status = entry.active ? '<span class="pill ok">Activo</span>' : '<span class="pill">Archivado</span>';
  return `<tr>
    <td><button class="linklike" data-scouting-report-player="${player.id}"><strong>${typeof playerNameWithStar === 'function' ? playerNameWithStar(player) : escapeHtml(player.name)}</strong></button></td>
    <td>${roleBadge(player.position)}</td>
    <td>${escapeHtml(clubName(player.clubId))}</td>
    <td>${known}/${total}</td>
    <td>${hiddenKnown}/${hiddenTotal}</td>
    <td>${signingText}</td>
    <td>${Number(report.daysObserved || 0)}</td>
    <td>${status}</td>
  </tr>`;
}
function scoutingReportsModalMarkup(mode='all'){
  const title = mode === 'archived' ? 'Informes archivados' : 'Informes guardados';
  const entries = scoutingPlayerReportEntries(mode);
  const rows = entries.map(scoutingPlayerReportListRow).join('');
  const empty = mode === 'archived'
    ? 'No hay informes archivados de jugadores. Quitá un jugador de la lista activa para archivar su informe.'
    : 'Todavía no hay informes guardados de jugadores.';
  return `<div class="scouting-reports-modal">
    <div class="scouting-reports-head"><p class="label">Centro de Ojeo</p><h2>${escapeHtml(title)}</h2></div>
    <p class="muted small">Sólo se listan jugadores. Los informes de equipo son dinámicos y no se archivan.</p>
    <div class="table-wrap scouting-reports-table-wrap"><table class="scouting-reports-table"><thead><tr><th>Jugador</th><th>Rol</th><th>Club</th><th>Conocidas</th><th>Ocultas</th><th>Prob. fichaje</th><th>Días</th><th>Estado</th></tr></thead><tbody>${rows || `<tr><td colspan="8" class="muted">${escapeHtml(empty)}</td></tr>`}</tbody></table></div>
  </div>`;
}
function openScoutingReportsModal(mode='all'){
  if(typeof openModal !== 'function') return;
  openModal(scoutingReportsModalMarkup(mode));
  document.querySelectorAll('[data-scouting-report-player]').forEach(btn => btn.addEventListener('click', ev => {
    ev.stopPropagation();
    const playerId = Number(ev.currentTarget.dataset.scoutingReportPlayer || 0);
    if(playerId && typeof showPlayerModal === 'function') showPlayerModal(playerId);
  }));
}
function scoutingReportsControlMarkup(){
  const state = ensureScoutingCenterState();
  const totalPlayerReports = scoutingPlayerReportEntries('all').length;
  const teamReports = Object.keys(state.teamReports || {}).length;
  return `<div class="card scouting-reports-card scouting-control-card">
    <div class="scouting-card-head"><div><p class="label">Informes</p><h3>Guardados y archivados</h3></div><span class="pill">${totalPlayerReports}</span></div>
    <p class="muted small">Abrí jugadores ya ojeados en lista. Los equipos no se archivan; sus visores se actualizan con el plantel actual.</p>
    <div class="scouting-action-grid"><button class="ghost" data-open-scouting-reports="all">Informes guardados</button><button class="ghost" data-open-scouting-reports="archived">Archivados</button></div>
    ${teamReports ? `<p class="muted small">Informes dinámicos de equipo activos/guardados: ${teamReports}</p>` : ''}
  </div>`;
}
function scoutingChiefMarkup(){
  const state = ensureScoutingCenterState();
  if(state.chief){
    const type = scoutingChiefType(state.chief.type);
    return `<div class="card scouting-chief-card scouting-control-card">
      <div class="scouting-card-head">
        <div class="scouting-card-icon">${scoutingBinocularsIcon('small')}</div>
        <div><p class="label">Jefe de ojeadores</p><h3>${escapeHtml(type?.name || state.chief.type)}</h3></div>
        <span class="pill ok">Activo</span>
      </div>
      <p class="muted small">Sueldo mensual ${formatMoney(type?.monthlySalary || 0)} · controla hasta ${type?.maxOffices || 0} oficina(s) · se va al finalizar la temporada.</p>
    </div>`;
  }
  const cards = (SCOUTING_CHIEF_TYPES || []).map(type => `<div class="card inner scouting-chief-option">
    <div class="scouting-chief-option-head"><strong>${escapeHtml(type.name)}</strong><span>${type.maxOffices} 🏢</span></div>
    <p class="muted small">${formatMoney(type.monthlySalary)} por mes · revela ${type.revealMin}-${type.revealMax} habilidad(es)/día.</p>
    <button class="primary small-btn" data-hire-scouting-chief="${escapeHtml(type.key)}">Contratar</button>
  </div>`).join('');
  return `<div class="card scouting-chief-card scouting-control-card">
    <div class="scouting-card-head">
      <div class="scouting-card-icon">${scoutingBinocularsIcon('small')}</div>
      <div><p class="label">Empleado contratable</p><h3>Jefe de ojeadores</h3></div>
    </div>
    <p class="muted small">No puede despedirse. Finaliza contrato al terminar la temporada.</p>
    <div class="scouting-chief-options">${cards}</div>
  </div>`;
}
function renderScoutingCenter(){
  if(!SCOUTING_CENTER_ENABLED){ view.innerHTML = '<div class="card"><h2>Centro de Ojeo</h2><p class="muted">El Centro de Ojeo está desactivado en config.js.</p></div>'; return; }
  const state = ensureScoutingCenterState();
  const caps = scoutingCapacities(state);
  const maxOffices = scoutingChiefMaxOffices();
  const listed = state.listedPlayerIds.map(playerById).filter(Boolean);
  const listedTeams = (state.listedTeamIds || []).map(id => seed?.clubs?.find(c => Number(c.id) === Number(id))).filter(Boolean);
  const usedSlots = listed.length + listedTeams.length;
  const archivedReports = Object.keys(state.reports || {}).filter(id => !state.listedPlayerIds.map(Number).includes(Number(id))).length;
  const reportCount = Object.keys(state.reports || {}).length;
  const lastProcess = game?.lastScoutingDailyResult;
  const lastProcessText = lastProcess?.date ? `Último proceso: ${escapeHtml(lastProcess.date)} · intentos ${Number(lastProcess.attempts || 0)} · reveladas ${Number(lastProcess.reveals || 0)}` : 'Todavía no se procesó ningún día de ojeo.';
  const officeCost = state.offices > 0 ? `${formatMoney(SCOUTING_OFFICE_MONTHLY_COST)}/mes` : 'Sin alquileres activos';
  const scoutCost = state.scouts > 0 ? `${formatMoney(state.scouts * SCOUTING_SCOUT_DAILY_COST)}/día` : 'Sin ojeadores activos';
  view.innerHTML = `
    <div class="scouting-shell">
      <div class="card scouting-hero">
        <div class="scouting-hero-icon">${scoutingBinocularsIcon()}</div>
        <div>
          <p class="eyebrow">Departamento deportivo</p>
          <h2>Centro de Ojeo</h2>
          <p class="tagline">Agregá jugadores externos o propios desde su ficha individual. En jugadores propios las habilidades visibles ya están desbloqueadas y el ojeo avanza directo sobre las ocultas.</p>
        </div>
      </div>
      <div class="scouting-summary-grid">
        ${scoutingSummaryTile({ label:'Ojeo activo', value:`${usedSlots}/${caps.playerCapacity}`, hint:`${listed.length} jugador(es) · ${listedTeams.length} equipo(s)`, icon:scoutingBinocularsIcon('mini') })}
        ${scoutingSummaryTile({ label:'Ojeadores', value:`${state.scouts}/${caps.scoutCapacity}`, hint:scoutCost, icon:'👤' })}
        ${scoutingSummaryTile({ label:'Oficinas', value:`${state.offices}/${maxOffices}`, hint:officeCost, icon:'🏢' })}
        ${scoutingSummaryTile({ label:'Informes guardados', value:reportCount, hint:`${archivedReports} jugador(es) archivado(s)`, icon:'▣' })}
      </div>
      <div class="scouting-workspace">
        <div class="scouting-main-stack">
          <div class="card scouting-list-card">
            <div class="scouting-card-head">
              <div><p class="label">Lista activa</p><h3>Jugadores y equipos en seguimiento</h3></div>
              <span class="pill">${usedSlots}/${caps.playerCapacity}</span>
            </div>
            <p class="muted small">Los datos conocidos quedan guardados aunque quites al jugador o equipo de la lista activa. Los informes de equipo muestran visores dinámicos del plantel actual.</p>
            <div class="scouting-player-list">${usedSlots ? listed.map(scoutingPlayerCard).join('') + listedTeams.map(club => scoutingTeamCard(club.id)).join('') : '<div class="scouting-empty-list"><div class="scouting-empty-icon">' + scoutingBinocularsIcon('empty') + '</div><p class="muted">Todavía no agregaste jugadores ni equipos. Abrí una ficha y usá “Ojear”.</p></div>'}</div>
          </div>
        </div>
        <aside class="scouting-side-rail">
          ${scoutingChiefMarkup()}
          <div class="card scouting-office-card scouting-control-card">
            <div class="scouting-card-head">
              <div><p class="label">Infraestructura</p><h3>Oficinas</h3></div>
              <span class="pill">${state.offices}/${maxOffices}</span>
            </div>
            <p class="muted small">Base: ${SCOUTING_BASE_SCOUTS} ojeadores y ${SCOUTING_BASE_PLAYER_SLOTS} jugadores listados. Cada oficina agrega ${SCOUTING_SCOUTS_PER_OFFICE} ojeadores y ${SCOUTING_PLAYERS_PER_OFFICE} jugadores listados.</p>
            <div class="scouting-action-grid"><button class="primary" data-rent-scouting-office ${state.offices >= maxOffices ? 'disabled' : ''}>Alquilar oficina</button><button class="ghost" data-cancel-scouting-office ${state.offices <= 0 ? 'disabled' : ''}>Cancelar oficina</button></div>
          </div>
          <div class="card scouting-office-card scouting-control-card">
            <div class="scouting-card-head">
              <div><p class="label">Personal</p><h3>Ojeadores</h3></div>
              <span class="pill">${state.scouts}/${caps.scoutCapacity}</span>
            </div>
            <div class="scouting-asset-strip"><span>Equipo activo</span>${scoutingRepeatedIcons('👤', state.scouts, caps.scoutCapacity, 'person-icons')}</div>
            <p class="muted small">Ojeador: ${formatMoney(SCOUTING_SCOUT_DAILY_COST)}/día. Costo actual: <strong class="bad">${formatMoney(state.scouts * SCOUTING_SCOUT_DAILY_COST)}</strong>.</p>
            <div class="scouting-action-grid"><button class="primary" data-hire-scouting-scout ${state.scouts >= caps.scoutCapacity ? 'disabled' : ''}>Contratar ojeador</button><button class="ghost danger" data-dismiss-scouting-scout ${state.scouts <= 0 ? 'disabled' : ''}>Despedir ojeador</button></div>
          </div>
          ${scoutingReportsControlMarkup()}
          <div class="card scouting-process-card scouting-control-card">
            <div class="scouting-card-head"><div><p class="label">Actividad diaria</p><h3>Proceso de ojeo</h3></div></div>
            <p class="muted small">${lastProcessText}</p>
          </div>
        </aside>
      </div>
    </div>`;
  document.querySelectorAll('[data-hire-scouting-chief]').forEach(btn => btn.addEventListener('click', () => hireScoutingChief(btn.dataset.hireScoutingChief)));
  document.querySelector('[data-rent-scouting-office]')?.addEventListener('click', rentScoutingOffice);
  document.querySelector('[data-cancel-scouting-office]')?.addEventListener('click', cancelScoutingOffice);
  document.querySelector('[data-hire-scouting-scout]')?.addEventListener('click', hireScoutingScout);
  document.querySelector('[data-dismiss-scouting-scout]')?.addEventListener('click', dismissScoutingScout);
  document.querySelectorAll('[data-open-scouting-reports]').forEach(btn => btn.addEventListener('click', () => openScoutingReportsModal(btn.dataset.openScoutingReports || 'all')));
  document.querySelectorAll('[data-remove-scouting-player]').forEach(btn => btn.addEventListener('click', () => removePlayerFromScoutingCenter(Number(btn.dataset.removeScoutingPlayer || 0))));
  document.querySelectorAll('[data-remove-scouting-team]').forEach(btn => btn.addEventListener('click', () => removeTeamFromScoutingCenter(Number(btn.dataset.removeScoutingTeam || 0))));
}
