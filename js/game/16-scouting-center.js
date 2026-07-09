/* V5.02 · Centro de Ojeo: oficinas, ojeadores, jefe de ojeadores e informes acumulativos. */

function createInitialScoutingCenterState(){
  return { listedPlayerIds:[], reports:{}, offices:0, scouts:0, chief:null, officeLastChargeDate:null, chiefLastChargeDate:null, scoutsLastChargeDate:null, lastDailyProcessDate:null };
}
function normalizeScoutingCenterState(state){
  const base = createInitialScoutingCenterState();
  const clean = { ...base, ...(state || {}) };
  clean.listedPlayerIds = Array.isArray(clean.listedPlayerIds) ? clean.listedPlayerIds.map(Number).filter(Boolean) : [];
  clean.listedPlayerIds = Array.from(new Set(clean.listedPlayerIds)).filter(id => {
    const p = typeof playerById === 'function' ? playerById(id) : null;
    return p && Number(p.clubId || 0) !== Number(game?.selectedClubId || 0);
  });
  clean.reports = (clean.reports && typeof clean.reports === 'object' && !Array.isArray(clean.reports)) ? clean.reports : {};
  Object.entries(clean.reports).forEach(([id, report]) => {
    if(!clean.listedPlayerIds.includes(Number(id))) delete clean.reports[id];
    else clean.reports[id] = normalizeScoutingReport(Number(id), report);
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
  clean.scouts = Math.min(clean.scouts, caps.scoutCapacity);
  clean.listedPlayerIds = clean.listedPlayerIds.slice(0, caps.playerCapacity);
  return clean;
}
function normalizeScoutingReport(playerId, report={}){
  const visible = Array.isArray(report.visibleSkills) ? report.visibleSkills.map(String) : [];
  return {
    playerId:Number(playerId),
    visibleSkills:Array.from(new Set(visible)),
    daysObserved:Math.max(0, Math.round(Number(report.daysObserved || 0))),
    lastUpdatedDate:validIsoDate(report.lastUpdatedDate) ? report.lastUpdatedDate : null,
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
function scoutingSkillKeys(player){
  if(!player) return [];
  const map = typeof scoutingStatMap === 'function' ? scoutingStatMap(player) : (player.skills || {});
  return Object.keys(map || {});
}
function scoutingKnownSet(playerId){
  const state = ensureScoutingCenterState();
  return new Set(state.reports[String(playerId)]?.visibleSkills || []);
}
function scoutingKnownCount(playerId){ return scoutingKnownSet(playerId).size; }
function scoutingReportForPlayer(playerId){
  const state = ensureScoutingCenterState();
  const key = String(playerId);
  if(!state.reports[key]) state.reports[key] = normalizeScoutingReport(playerId, {});
  return state.reports[key];
}
function addPlayerToScoutingCenter(playerId){
  if(!SCOUTING_CENTER_ENABLED || !game){ showNotice('El Centro de Ojeo no está disponible.'); return; }
  const player = playerById(playerId);
  if(!player){ showNotice('Jugador no encontrado.'); return; }
  if(Number(player.clubId || 0) === Number(game.selectedClubId || 0)){ showNotice('No necesitás ojear jugadores propios.'); return; }
  const state = ensureScoutingCenterState();
  const caps = scoutingCapacities(state);
  if(state.listedPlayerIds.includes(Number(playerId))){ showNotice(`${player.name} ya está en el Centro de Ojeo.`); activeTab='scouting'; renderAll(); return; }
  if(state.listedPlayerIds.length >= caps.playerCapacity){ showNotice('No hay cupos libres en la lista de ojeo. Alquilá oficinas o quitá jugadores.'); return; }
  state.listedPlayerIds.push(Number(playerId));
  state.reports[String(playerId)] = normalizeScoutingReport(playerId, state.reports[String(playerId)] || {});
  saveLocal(true);
  showNotice(`${player.name} fue agregado al Centro de Ojeo.`);
  activeTab='scouting';
  if(typeof closeModal === 'function') closeModal();
  renderAll();
}
function removePlayerFromScoutingCenter(playerId){
  const state = ensureScoutingCenterState();
  state.listedPlayerIds = state.listedPlayerIds.filter(id => Number(id) !== Number(playerId));
  delete state.reports[String(playerId)];
  saveLocal(true);
  renderScoutingCenter();
}
function hireScoutingChief(type){
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
  if(state.listedPlayerIds.length > nextCaps.playerCapacity){ showNotice('Primero quitá jugadores de la lista de ojeo. Con una oficina menos no alcanza el cupo actual.'); return; }
  state.offices = nextOffices;
  if(state.offices <= 0) state.officeLastChargeDate = null;
  saveLocal(true);
  renderScoutingCenter();
}
function hireScoutingScout(){
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
function scoutingRevealOneSkill(){
  const state = ensureScoutingCenterState();
  const listed = state.listedPlayerIds.map(playerById).filter(Boolean).filter(p => Number(p.clubId || 0) !== Number(game.selectedClubId || 0));
  const candidates = [];
  listed.forEach(player => {
    const keys = scoutingSkillKeys(player);
    const report = scoutingReportForPlayer(player.id);
    const known = new Set(report.visibleSkills || []);
    const hidden = keys.filter(key => !known.has(key));
    if(hidden.length) candidates.push({ player, hidden, report });
  });
  if(!candidates.length) return false;
  candidates.sort((a,b)=>Number(a.report.visibleSkills?.length || 0)-Number(b.report.visibleSkills?.length || 0) || a.player.name.localeCompare(b.player.name));
  const pick = candidates[hashNumber(`scout-pick-${game.currentDate}-${currentTurnIndex()}-${Math.random()}`, candidates.length)];
  const key = pick.hidden[hashNumber(`scout-skill-${pick.player.id}-${game.currentDate}-${Math.random()}`, pick.hidden.length)];
  pick.report.visibleSkills = Array.from(new Set([...(pick.report.visibleSkills || []), key]));
  pick.report.daysObserved = Math.max(0, Number(pick.report.daysObserved || 0)) + 1;
  pick.report.lastUpdatedDate = game.currentDate || currentCalendarDate();
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
function processScoutingCenterDaily(){
  if(!SCOUTING_CENTER_ENABLED || !game) return { reveals:0, costs:0 };
  const state = ensureScoutingCenterState();
  const today = game.currentDate || currentCalendarDate();
  if(state.lastDailyProcessDate === today) return { reveals:0, costs:0 };
  state.lastDailyProcessDate = today;
  let costs = 0;
  if(state.scouts > 0 && SCOUTING_SCOUT_DAILY_COST > 0){
    const cost = state.scouts * SCOUTING_SCOUT_DAILY_COST;
    recordBudgetChange(-cost, 'Pago diario de ojeadores', { type:'scouting_scout_daily', scouts:state.scouts });
    costs += cost;
  }
  costs += processScoutingCenterMonthlyCosts();
  const attempts = Math.max(0, state.scouts) + scoutingChiefDailyReveals();
  let reveals = 0;
  for(let i=0; i<attempts; i++){
    if(scoutingRevealOneSkill()) reveals += 1;
  }
  return { reveals, costs };
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
  game.scoutingCenter = createInitialScoutingCenterState();
}
function scoutingPlayerKnownSkillRows(player){
  const map = typeof scoutingStatMap === 'function' ? scoutingStatMap(player) : (player.skills || {});
  const known = scoutingKnownSet(player.id);
  return Object.entries(map).map(([key,value]) => {
    const label = typeof scoutingSkillDisplayLabel === 'function' ? scoutingSkillDisplayLabel(player, key) : key;
    return `<div class="stat-rank"><span>${escapeHtml(label)}</span><strong>${known.has(key) ? value : '—'}</strong></div>`;
  }).join('');
}
function scoutingPlayerCard(player){
  const report = scoutingReportForPlayer(player.id);
  const known = scoutingKnownCount(player.id);
  const total = scoutingSkillKeys(player).length || 1;
  const pct = clamp(Math.round((known / total) * 100), 0, 100);
  return `<div class="scouting-player-card card inner">
    <div class="scouting-player-head">
      ${faceImg(player, 'scouting-player-face')}
      <div><h3>${typeof playerNameWithStar === 'function' ? playerNameWithStar(player) : escapeHtml(player.name)}</h3><p class="muted small">${escapeHtml(clubName(player.clubId))} · ${escapeHtml(player.nationality || '—')} · ${escapeHtml(player.position || '')}</p></div>
      <button class="ghost small-btn" data-remove-scouting-player="${player.id}">Quitar</button>
    </div>
    <div class="project-progress scouting-report-progress"><span style="width:${pct}%"></span></div>
    <p class="muted small">Habilidades conocidas: ${known}/${total} · Días observado: ${Number(report.daysObserved || 0)}</p>
    <div class="scouting-known-grid">${scoutingPlayerKnownSkillRows(player)}</div>
  </div>`;
}
function scoutingChiefMarkup(){
  const state = ensureScoutingCenterState();
  if(state.chief){
    const type = scoutingChiefType(state.chief.type);
    return `<div class="card scouting-chief-card"><div class="row"><div><p class="label">Jefe de ojeadores</p><h3>${escapeHtml(type?.name || state.chief.type)}</h3><p class="muted small">Sueldo mensual ${formatMoney(type?.monthlySalary || 0)} · controla hasta ${type?.maxOffices || 0} oficina(s) · se va al finalizar la temporada.</p></div><span class="pill">Activo</span></div></div>`;
  }
  const cards = (SCOUTING_CHIEF_TYPES || []).map(type => `<div class="card inner scouting-chief-option"><h3>${escapeHtml(type.name)}</h3><p class="muted small">${formatMoney(type.monthlySalary)} por mes · hasta ${type.maxOffices} oficina(s) · revela ${type.revealMin}-${type.revealMax} habilidad(es)/día.</p><button class="primary small-btn" data-hire-scouting-chief="${escapeHtml(type.key)}">Contratar</button></div>`).join('');
  return `<div class="card scouting-chief-card"><div class="row"><div><p class="label">Empleado contratable</p><h3>Jefe de ojeadores</h3><p class="muted small">No puede despedirse. Finaliza contrato al terminar la temporada.</p></div></div><div class="grid cols-3">${cards}</div></div>`;
}
function renderScoutingCenter(){
  if(!SCOUTING_CENTER_ENABLED){ view.innerHTML = '<div class="card"><h2>Centro de Ojeo</h2><p class="muted">El Centro de Ojeo está desactivado en config.js.</p></div>'; return; }
  const state = ensureScoutingCenterState();
  const caps = scoutingCapacities(state);
  const maxOffices = scoutingChiefMaxOffices();
  const listed = state.listedPlayerIds.map(playerById).filter(Boolean);
  view.innerHTML = `
    <div class="row section-title"><div><h2>Centro de Ojeo</h2><p class="tagline">Agregá jugadores externos desde su ficha individual. Los ojeadores revelan habilidades acumulativas día por día.</p></div></div>
    <div class="grid cols-4 compact-team-stats">
      <div class="card"><p class="label">Jugadores listados</p><strong>${listed.length}/${caps.playerCapacity}</strong></div>
      <div class="card"><p class="label">Ojeadores</p><strong>${state.scouts}/${caps.scoutCapacity}</strong></div>
      <div class="card"><p class="label">Oficinas</p><strong>${state.offices}/${maxOffices}</strong></div>
      <div class="card"><p class="label">Costo ojeadores/día</p><strong class="bad">${formatMoney(state.scouts * SCOUTING_SCOUT_DAILY_COST)}</strong></div>
    </div>
    ${scoutingChiefMarkup()}
    <div class="card scouting-office-card" style="margin-top:14px">
      <div class="row"><div><h3>Oficinas y ojeadores</h3><p class="muted small">Base: ${SCOUTING_BASE_SCOUTS} ojeadores y ${SCOUTING_BASE_PLAYER_SLOTS} jugadores listados. Cada oficina agrega ${SCOUTING_SCOUTS_PER_OFFICE} ojeadores y ${SCOUTING_PLAYERS_PER_OFFICE} jugadores listados. Oficina: ${formatMoney(SCOUTING_OFFICE_MONTHLY_COST)}/mes. Ojeador: ${formatMoney(SCOUTING_SCOUT_DAILY_COST)}/día.</p></div></div>
      <div class="row message-actions"><button class="primary" data-rent-scouting-office ${state.offices >= maxOffices ? 'disabled' : ''}>Alquilar oficina</button><button class="ghost" data-cancel-scouting-office ${state.offices <= 0 ? 'disabled' : ''}>Cancelar oficina</button><button class="primary" data-hire-scouting-scout ${state.scouts >= caps.scoutCapacity ? 'disabled' : ''}>Contratar ojeador</button><button class="ghost danger" data-dismiss-scouting-scout ${state.scouts <= 0 ? 'disabled' : ''}>Despedir ojeador</button></div>
    </div>
    <div class="card" style="margin-top:14px"><div class="row"><div><h3>Lista de ojeo</h3><p class="muted small">Los datos conocidos quedan guardados. Físico, moral y media real siguen ocultos hasta tener informes suficientes.</p></div></div><div class="scouting-player-list">${listed.length ? listed.map(scoutingPlayerCard).join('') : '<p class="muted">Todavía no agregaste jugadores. Abrí la ficha de un jugador externo y usá “Ojear”.</p>'}</div></div>`;
  document.querySelectorAll('[data-hire-scouting-chief]').forEach(btn => btn.addEventListener('click', () => hireScoutingChief(btn.dataset.hireScoutingChief)));
  document.querySelector('[data-rent-scouting-office]')?.addEventListener('click', rentScoutingOffice);
  document.querySelector('[data-cancel-scouting-office]')?.addEventListener('click', cancelScoutingOffice);
  document.querySelector('[data-hire-scouting-scout]')?.addEventListener('click', hireScoutingScout);
  document.querySelector('[data-dismiss-scouting-scout]')?.addEventListener('click', dismissScoutingScout);
  document.querySelectorAll('[data-remove-scouting-player]').forEach(btn => btn.addEventListener('click', () => removePlayerFromScoutingCenter(Number(btn.dataset.removeScoutingPlayer || 0))));
}
