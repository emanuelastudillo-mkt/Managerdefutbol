/* Desafíos online: fotografías del equipo, simulación local y resultados públicos. */

let challengeViewTab = 'available';
let challengeRowsCache = { available:[], mine:[], history:[] };
let challengeLoading = false;
let challengeDetail = null;
let challengePollTimer = null;

function challengeConfig(){
  const cfg = window.GAME_CONFIG?.desafiosOnline || {};
  return {
    active:cfg.activo !== false,
    endpoint:String(cfg.endpoint || rankingStoredEndpoint?.() || RANKING_APPS_SCRIPT_URL || '').trim(),
    simulatorVersion:String(cfg.versionSimulador || window.ChallengeSimulator?.version || 'challenge-sim-v1'),
    pageSize:Math.max(5, Math.min(100, Math.round(Number(cfg.resultadosPorPagina || 40)))),
    pollMs:Math.max(10000, Math.round(Number(cfg.actualizacionMs || 30000)))
  };
}
function challengeEndpoint(){ return normalizeRankingEndpoint(challengeConfig().endpoint); }
function challengeToken(){ return typeof rankingStoredAuthToken === 'function' ? rankingStoredAuthToken() : ''; }
function challengeApiUrl(path='', query=''){
  const clean = String(path || '').replace(/^\/+|\/+$/g, '');
  return `${challengeEndpoint()}${clean ? `/${clean}` : ''}${query || ''}`;
}
function challengeHeaders(includeJson=false){
  const headers = { 'X-FM-Client-Version':String(typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'V7.26') };
  const token = challengeToken();
  if(token) headers.Authorization = `Bearer ${token}`;
  if(includeJson) headers['Content-Type'] = 'application/json';
  return headers;
}
async function challengeRequest(path, options={}){
  const method = String(options.method || 'GET').toUpperCase();
  const response = await fetch(challengeApiUrl(path, options.query || ''), {
    method,
    headers:challengeHeaders(method !== 'GET'),
    body:method === 'GET' ? undefined : JSON.stringify(options.body || {})
  });
  const data = await response.json().catch(() => ({}));
  if(!response.ok || data?.ok === false) throw new Error(data?.error || `Error ${response.status} al conectar con Desafíos.`);
  return data;
}

function challengeSafeNumber(value, fallback=0){
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}
function challengeFormation(){ return String(game?.tactic?.formation || game?.tactic?.formationId || '4-4-2'); }
function challengePlayerValue(player){ return Math.max(0, Math.round(challengeSafeNumber(player?.clause ?? player?.value, 0))); }
function challengePlayerSalary(player){ return Math.max(0, Math.round(challengeSafeNumber(player?.salary, 0))); }
function challengeSkill(player, key){
  try{ return clamp(Math.round(typeof baseSkill === 'function' ? baseSkill(player, key) : player?.skills?.[key] || player?.[key] || player?.overall || 50), 1, 99); }
  catch(_){ return clamp(Math.round(Number(player?.overall || 50)), 1, 99); }
}
function challengeVisibleSkillSet(player){
  let stats = {};
  try{ stats = typeof visibleStats === 'function' ? visibleStats(player) : {}; }catch(_){ stats = {}; }
  return {
    attack:Math.round(Number(stats.Ataque ?? player?.overall ?? 50)),
    defense:Math.round(Number(stats.Defensa ?? player?.overall ?? 50)),
    passing:Math.round(Number(stats.Pase ?? player?.overall ?? 50)),
    speed:Math.round(Number(stats.Velocidad ?? stats.Reflejos ?? player?.overall ?? 50)),
    heading:Math.round(Number(stats.Cabezazo ?? stats.Salto ?? player?.overall ?? 50)),
    shooting:Math.round(Number(stats.Tiro ?? stats.Potencia ?? player?.overall ?? 50)),
    stamina:Math.round(Number(stats.Resistencia ?? player?.overall ?? 50)),
    leadership:challengeSkill(player, 'liderazgo'),
    serenity:challengeSkill(player, 'serenidad'),
    discipline:challengeSkill(player, 'disciplina'),
    teamwork:challengeSkill(player, 'trabajoEquipo'),
    goalkeeping:challengeSkill(player, 'porteria')
  };
}
function challengeCurrentForm(playerId){
  try{ return clamp(Math.round(typeof currentCondition === 'function' ? currentCondition(playerId) : game?.playerCondition?.[playerId] ?? 99), 0, 99); }
  catch(_){ return 99; }
}
function challengeCurrentMorale(playerId){
  try{ return clamp(Math.round(typeof currentMorale === 'function' ? currentMorale(playerId) : game?.playerMorale?.[playerId] ?? 50), 1, 99); }
  catch(_){ return 50; }
}
function challengePlayerSnapshot(player, squadRole, tacticalIndex){
  const overall = clamp(Math.round(typeof effectiveOverall === 'function' ? effectiveOverall(player) : player?.overall || 50), 1, 99);
  return {
    id:String(player.id),
    name:String(player.name || 'Jugador').slice(0, 80),
    position:String(player.position || 'MC').slice(0, 8),
    age:Math.max(15, Math.round(Number(player.age || 18))),
    overall,
    visibleOverall:clamp(Math.round(typeof visibleOverall === 'function' ? visibleOverall(player) : player?.overall || overall), 1, 99),
    skills:challengeVisibleSkillSet(player),
    form:challengeCurrentForm(player.id),
    morale:challengeCurrentMorale(player.id),
    salary:challengePlayerSalary(player),
    value:challengePlayerValue(player),
    squadRole,
    tacticalIndex:Math.max(0, Math.round(Number(tacticalIndex || 0))),
    isCaptain:Number(game?.tactic?.captainId || 0) === Number(player.id),
    captaincy:typeof captaincyValue === 'function' ? Math.max(0, Math.round(Number(captaincyValue(player.id) || 0))) : 0
  };
}
function challengeSquadIds(){
  const starters = (game?.tactic?.starters || []).slice(0, 11).map(Number).filter(Boolean);
  const starterSet = new Set(starters);
  const bench = (game?.tactic?.bench || []).map(Number).filter(Boolean).filter(id => !starterSet.has(id)).slice(0, 10);
  return { starters, bench };
}
function challengeEconomy(players){
  return (players || []).reduce((totals, player) => {
    totals.value += challengePlayerValue(player);
    totals.salary += challengePlayerSalary(player);
    return totals;
  }, { value:0, salary:0 });
}
function buildChallengeSnapshot(){
  if(!game || !game.selectedClubId) throw new Error('Necesitás una partida activa y un club para publicar un desafío.');
  const ids = challengeSquadIds();
  if(ids.starters.length !== 11) throw new Error('La táctica debe tener 11 titulares válidos.');
  const starterPlayers = ids.starters.map(playerById).filter(Boolean);
  if(starterPlayers.length !== 11) throw new Error('Hay titulares que no existen en el plantel actual.');
  const benchPlayers = ids.bench.map(playerById).filter(Boolean);
  const players = [
    ...starterPlayers.map((player,index) => challengePlayerSnapshot(player, 'starter', index)),
    ...benchPlayers.map((player,index) => challengePlayerSnapshot(player, 'bench', index))
  ];
  const xiEconomy = challengeEconomy(starterPlayers);
  const squadEconomy = challengeEconomy([...starterPlayers, ...benchPlayers]);
  const club = seed?.clubs?.find(item => Number(item.id) === Number(game.selectedClubId)) || {};
  const rating = starterPlayers.reduce((sum, player) => sum + (typeof effectiveOverall === 'function' ? effectiveOverall(player) : Number(player.overall || 50)), 0) / 11;
  const moraleAverage = starterPlayers.reduce((sum, player) => sum + challengeCurrentMorale(player.id), 0) / 11;
  const formAverage = starterPlayers.reduce((sum, player) => sum + challengeCurrentForm(player.id), 0) / 11;
  const cohesion = typeof cohesionValue === 'function' ? cohesionValue(game.selectedClubId) : Number(game?.teamCohesion?.[game.selectedClubId] || 50);
  const seasonYear = Number(game.seasonYear || (typeof currentSeasonYear === 'function' ? currentSeasonYear() : new Date().getUTCFullYear()));
  const seasonDay = typeof seasonDayFromDate === 'function' ? seasonDayFromDate(game.currentDate, seasonYear) : Number(game.phaseTurn || 1);
  return {
    snapshotVersion:1,
    context:{
      gameVersion:String(typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'V7.26'),
      simulatorVersion:challengeConfig().simulatorVersion,
      seasonNumber:Math.max(1, Math.round(Number(game.seasonNumber || 1))),
      seasonDay:Math.max(1, Math.round(Number(seasonDay || 1)))
    },
    club:{
      id:String(game.selectedClubId),
      name:String(club.name || clubName(game.selectedClubId) || 'Club').slice(0, 100),
      crestPath:String(club.crestPath || club.crest || '').slice(0, 220),
      reputation:Math.max(0, Math.round(Number(club.reputation || club.prestige || 0))),
      fans:Math.max(0, Math.round(typeof clubFansCurrent === 'function' ? clubFansCurrent(game.selectedClubId) : 0)),
      stadiumCapacity:Math.max(0, Math.round(typeof clubStadiumCapacity === 'function' ? clubStadiumCapacity(game.selectedClubId) : 0)),
      stadiumCondition:Math.max(0, Math.round(typeof fieldScoreForClub === 'function' ? fieldScoreForClub(game.selectedClubId) : 100))
    },
    tactic:{
      formation:challengeFormation(),
      captainId:String(game?.tactic?.captainId || ''),
      mentality:String(game?.tactic?.mentality || game?.tactic?.mentalidad || 'normal'),
      sectorStyles:JSON.parse(JSON.stringify(game?.tactic?.sectorStyles || game?.tactic?.zoneInstructions || {})),
      matchInstructions:JSON.parse(JSON.stringify(game?.tactic?.matchInstructions || game?.tactic?.instructions || {})),
      playerMentalities:JSON.parse(JSON.stringify(game?.tactic?.playerMentalities || {}))
    },
    team:{
      rating:Math.round(rating * 10) / 10,
      cohesion:Math.round(cohesion),
      moraleAverage:Math.round(moraleAverage * 10) / 10,
      formAverage:Math.round(formAverage * 10) / 10,
      startingXiValue:xiEconomy.value,
      startingXiSalaryTotal:xiEconomy.salary,
      matchSquadValue:squadEconomy.value,
      matchSquadSalaryTotal:squadEconomy.salary
    },
    players
  };
}

function challengeStatusLabel(status){
  return ({ open:'Disponible', processing:'Simulando', completed:'Finalizado', cancelled:'Cancelado', expired:'Vencido' })[String(status || '')] || String(status || '—');
}
function challengeStatusClass(status){
  return ({ open:'ok', processing:'warn', completed:'', cancelled:'bad', expired:'muted' })[String(status || '')] || '';
}
function challengeClubSummary(snapshot={}){
  const club = snapshot.club || {};
  const team = snapshot.team || {};
  return `<div class="challenge-team-summary">
    <div>${club.crestPath ? `<img src="${escapeHtml(club.crestPath)}" alt="" class="challenge-crest" onerror="this.style.display='none'">` : ''}<strong>${escapeHtml(club.name || 'Club')}</strong></div>
    <span>Media ${Number(team.rating || 0).toFixed(1)}</span>
    <span>${escapeHtml(snapshot?.tactic?.formation || '—')}</span>
    <span>Valor ${formatMoney(Number(team.matchSquadValue || 0))}</span>
    <span>Sueldos ${formatMoney(Number(team.matchSquadSalaryTotal || 0))}</span>
  </div>`;
}
function challengeOpenCard(row){
  const snapshot = row.creatorSnapshot || row.snapshot || {};
  return `<article class="card challenge-card">
    <div class="row"><div><p class="label">${escapeHtml(row.creatorUsername || 'Manager')}</p><h3>${escapeHtml(snapshot?.club?.name || row.creatorClubName || 'Club')}</h3></div><span class="pill ${challengeStatusClass(row.status)}">${challengeStatusLabel(row.status)}</span></div>
    ${challengeClubSummary(snapshot)}
    <p class="small muted">Publicado ${escapeHtml(challengeDateLabel(row.createdAt))} · vence ${escapeHtml(challengeDateLabel(row.expiresAt))}</p>
    <button class="primary" data-challenge-accept="${escapeHtml(row.id)}">Aceptar desafío</button>
  </article>`;
}
function challengeMineCard(row){
  const home = row.creatorSnapshot || {};
  const away = row.opponentSnapshot || {};
  const result = row.match || null;
  return `<article class="card challenge-card">
    <div class="row"><div><p class="label">Tu desafío</p><h3>${escapeHtml(home?.club?.name || row.creatorClubName || 'Club')}</h3></div><span class="pill ${challengeStatusClass(row.status)}">${challengeStatusLabel(row.status)}</span></div>
    ${result ? `<div class="challenge-score"><strong>${escapeHtml(home?.club?.name || 'Local')}</strong><b>${Number(result.homeGoals || 0)}–${Number(result.awayGoals || 0)}</b><strong>${escapeHtml(away?.club?.name || 'Visitante')}</strong></div>` : challengeClubSummary(home)}
    <p class="small muted">${row.opponentUsername ? `Aceptado por ${escapeHtml(row.opponentUsername)}` : 'Esperando rival'} · ${escapeHtml(challengeDateLabel(row.createdAt))}</p>
    <div class="row challenge-actions">
      ${row.status === 'open' ? `<button class="ghost danger" data-challenge-cancel="${escapeHtml(row.id)}">Cancelar</button>` : ''}
      ${row.status === 'completed' ? `<button class="primary" data-challenge-view="${escapeHtml(row.id)}">Ver partido</button>` : ''}
    </div>
  </article>`;
}
function challengeHistoryCard(row){
  const home = row.creatorSnapshot || {};
  const away = row.opponentSnapshot || {};
  const result = row.match || {};
  return `<article class="card challenge-card challenge-history-card" data-challenge-view="${escapeHtml(row.id)}">
    <div class="row"><p class="label">${escapeHtml(row.creatorUsername || 'Manager')} vs ${escapeHtml(row.opponentUsername || 'Manager')}</p><span class="small muted">${escapeHtml(challengeDateLabel(row.completedAt || row.createdAt))}</span></div>
    <div class="challenge-score"><strong>${escapeHtml(home?.club?.name || 'Local')}</strong><b>${Number(result.homeGoals || 0)}–${Number(result.awayGoals || 0)}</b><strong>${escapeHtml(away?.club?.name || 'Visitante')}</strong></div>
    <p class="small muted">Asistencia ${formatPlainNumber(Number(result.attendance || 0))} · Valor usado ${formatMoney(Number(result.homeUsedPlayersValue || 0))} vs ${formatMoney(Number(result.awayUsedPlayersValue || 0))}</p>
  </article>`;
}
function challengeDateLabel(value){
  const date = new Date(String(value || ''));
  return Number.isFinite(date.getTime()) ? date.toLocaleString('es-AR', { dateStyle:'short', timeStyle:'short' }) : '—';
}
function challengeCurrentTeamCard(){
  let snapshot;
  try{ snapshot = buildChallengeSnapshot(); }
  catch(error){ return `<div class="card blocker"><h3>No se puede publicar el equipo</h3><p>${escapeHtml(error.message)}</p><button class="ghost" data-go-tab="firstTeam">Ir a Primer Equipo</button></div>`; }
  return `<div class="card challenge-publish-card">
    <div class="row"><div><p class="label">Tu equipo actual</p><h3>${escapeHtml(snapshot.club.name)}</h3></div><span class="pill">${escapeHtml(snapshot.tactic.formation)}</span></div>
    <div class="grid cols-4 challenge-team-metrics">
      <div><span>Media</span><strong>${snapshot.team.rating.toFixed(1)}</strong></div>
      <div><span>Valor convocatoria</span><strong>${formatMoney(snapshot.team.matchSquadValue)}</strong></div>
      <div><span>Sueldos convocatoria</span><strong>${formatMoney(snapshot.team.matchSquadSalaryTotal)}</strong></div>
      <div><span>Cohesión</span><strong>${snapshot.team.cohesion}%</strong></div>
    </div>
    <p class="muted small">Se envía una fotografía de los titulares, suplentes, táctica, forma, moral, valores y sueldos. El amistoso no modifica la carrera.</p>
    <button id="btnPublishChallenge" class="primary" ${challengeToken() ? '' : 'disabled'}>Publicar desafío</button>
  </div>`;
}
function challengeLoginWarning(){
  if(challengeToken()) return '';
  return `<div class="card blocker"><h3>Iniciá sesión</h3><p>Los desafíos reutilizan la misma cuenta del Ranking Online.</p><button class="primary" data-go-ranking>Ir al login del ranking</button></div>`;
}
function challengeListMarkup(){
  const rows = challengeRowsCache[challengeViewTab] || [];
  if(challengeLoading && !rows.length) return '<div class="card"><p class="muted">Cargando desafíos...</p></div>';
  if(!rows.length) return `<div class="card empty"><h3>Sin registros</h3><p>No hay ${challengeViewTab === 'available' ? 'desafíos disponibles' : challengeViewTab === 'mine' ? 'desafíos propios' : 'partidos disputados'} para mostrar.</p></div>`;
  if(challengeViewTab === 'available') return `<div class="challenge-grid">${rows.map(challengeOpenCard).join('')}</div>`;
  if(challengeViewTab === 'mine') return `<div class="challenge-grid">${rows.map(challengeMineCard).join('')}</div>`;
  return `<div class="challenge-grid">${rows.map(challengeHistoryCard).join('')}</div>`;
}
function renderOnlineChallenges(){
  clearTimeout(challengePollTimer);
  const cfg = challengeConfig();
  if(!cfg.active){ view.innerHTML = '<div class="card blocker"><h2>Desafíos desactivados</h2><p>La función está deshabilitada en config.js.</p></div>'; return; }
  if(challengeDetail){ renderChallengeDetail(challengeDetail); return; }
  view.innerHTML = `<div class="section-title row">
      <div><h2>Desafíos Online</h2><p class="tagline">Amistosos simulados localmente y publicados para toda la comunidad.</p></div>
      <button id="btnRefreshChallenges" class="ghost">Actualizar</button>
    </div>
    ${challengeLoginWarning()}
    ${game && !game.gameOver?.active ? challengeCurrentTeamCard() : ''}
    <div class="card challenge-tabs">
      <button data-challenge-tab="available" class="${challengeViewTab === 'available' ? 'active' : ''}">Disponibles</button>
      <button data-challenge-tab="mine" class="${challengeViewTab === 'mine' ? 'active' : ''}">Mis desafíos</button>
      <button data-challenge-tab="history" class="${challengeViewTab === 'history' ? 'active' : ''}">Partidos disputados</button>
    </div>
    <div id="challengeStatus" class="small muted"></div>
    <div id="challengeList">${challengeListMarkup()}</div>`;
  bindChallengeEvents();
  if(!challengeRowsCache[challengeViewTab].length && !challengeLoading) setTimeout(() => loadChallenges(challengeViewTab), 0);
  if(challengeToken()) challengePollTimer = setTimeout(() => { if(activeTab === 'challenges' && !challengeDetail) loadChallenges('mine', { silent:true, keepTab:true }); }, cfg.pollMs);
}
function bindChallengeEvents(){
  $('btnRefreshChallenges')?.addEventListener('click', () => loadChallenges(challengeViewTab, { force:true }));
  $('btnPublishChallenge')?.addEventListener('click', publishChallenge);
  document.querySelector('[data-go-ranking]')?.addEventListener('click', () => { activeTab='ranking'; renderAll(); });
  document.querySelectorAll('[data-challenge-tab]').forEach(button => button.addEventListener('click', () => {
    challengeViewTab = button.dataset.challengeTab;
    challengeDetail = null;
    renderOnlineChallenges();
  }));
  document.querySelectorAll('[data-challenge-accept]').forEach(button => button.addEventListener('click', () => acceptChallenge(button.dataset.challengeAccept)));
  document.querySelectorAll('[data-challenge-cancel]').forEach(button => button.addEventListener('click', () => cancelChallenge(button.dataset.challengeCancel)));
  document.querySelectorAll('[data-challenge-view]').forEach(button => button.addEventListener('click', () => openChallengeDetail(button.dataset.challengeView)));
  document.querySelectorAll('[data-go-tab]').forEach(button => button.addEventListener('click', () => { activeTab=button.dataset.goTab; renderAll(); }));
}
async function loadChallenges(tab=challengeViewTab, options={}){
  if(!challengeToken() && tab === 'mine') return;
  challengeLoading = true;
  if(!options.silent && activeTab === 'challenges') renderOnlineChallenges();
  try{
    const path = tab === 'available' ? 'challenges/open' : tab === 'mine' ? 'challenges/mine' : 'challenges/history';
    const data = await challengeRequest(path, { query:`?limit=${challengeConfig().pageSize}` });
    let rows = Array.isArray(data.challenges) ? data.challenges : [];
    if(tab === 'available'){
      let ownUserId = 0;
      try{ ownUserId = Number(localStorage.getItem('fmRankingAuthUserId') || 0); }catch(_){ ownUserId = 0; }
      if(ownUserId) rows = rows.filter(row => Number(row.creatorUserId || 0) !== ownUserId);
    }
    challengeRowsCache[tab] = rows;
  }catch(error){
    if(!options.silent) showNotice(error.message);
  }finally{
    challengeLoading = false;
    if(activeTab === 'challenges' && (!options.keepTab || challengeViewTab === tab)) renderOnlineChallenges();
    else if(activeTab === 'challenges' && options.keepTab && challengeToken()){
      clearTimeout(challengePollTimer);
      challengePollTimer = setTimeout(() => loadChallenges('mine', { silent:true, keepTab:true }), challengeConfig().pollMs);
    }
  }
}
async function publishChallenge(){
  const button = $('btnPublishChallenge');
  try{
    if(button) button.disabled = true;
    const snapshot = buildChallengeSnapshot();
    showNotice('Publicando fotografía del equipo...');
    await challengeRequest('challenges', { method:'POST', body:{ snapshot } });
    challengeRowsCache.available = [];
    challengeRowsCache.mine = [];
    challengeViewTab = 'mine';
    showNotice('Desafío publicado. El equipo quedó congelado para este encuentro.');
    await loadChallenges('mine', { force:true });
  }catch(error){ showNotice(error.message); if(button) button.disabled = false; }
}
async function acceptChallenge(challengeId){
  if(!confirm('¿Aceptar este desafío con la táctica y convocatoria actuales?')) return;
  const status = $('challengeStatus');
  try{
    const snapshot = buildChallengeSnapshot();
    if(status) status.textContent = 'Reservando desafío y enviando tu equipo...';
    const accepted = await challengeRequest(`challenges/${encodeURIComponent(challengeId)}/accept`, { method:'POST', body:{ snapshot } });
    if(status) status.textContent = 'Simulando el partido en este navegador...';
    const result = window.ChallengeSimulator.simulateChallengeMatch({
      homeSnapshot:accepted.homeSnapshot,
      awaySnapshot:accepted.awaySnapshot,
      seed:accepted.seed
    });
    if(status) status.textContent = 'Guardando el resultado en Cloudflare...';
    const saved = await challengeRequest(`challenges/${encodeURIComponent(challengeId)}/result`, { method:'POST', body:{ result } });
    challengeRowsCache.available = [];
    challengeRowsCache.mine = [];
    challengeRowsCache.history = [];
    challengeDetail = saved.challenge || null;
    showNotice('Partido simulado y guardado.');
    renderOnlineChallenges();
  }catch(error){
    if(status) status.textContent = '';
    showNotice(error.message);
  }
}
async function cancelChallenge(challengeId){
  if(!confirm('¿Cancelar este desafío abierto?')) return;
  try{
    await challengeRequest(`challenges/${encodeURIComponent(challengeId)}/cancel`, { method:'POST', body:{} });
    challengeRowsCache.mine = [];
    challengeRowsCache.available = [];
    showNotice('Desafío cancelado.');
    await loadChallenges('mine', { force:true });
  }catch(error){ showNotice(error.message); }
}
async function openChallengeDetail(challengeId){
  try{
    const data = await challengeRequest(`challenges/${encodeURIComponent(challengeId)}`);
    challengeDetail = data.challenge || null;
    renderOnlineChallenges();
  }catch(error){ showNotice(error.message); }
}
function challengeEventLabel(event){
  const playerName = escapeHtml(event.playerName || 'Jugador');
  const assistName = escapeHtml(event.assistPlayerName || '');
  if(event.type === 'goal') return `⚽ ${playerName}${assistName ? ` (asist. ${assistName})` : ''}`;
  if(event.type === 'yellow') return `🟨 ${playerName}`;
  if(event.type === 'red') return `🟥 ${playerName}`;
  if(event.type === 'injury') return `✚ ${playerName} · lesión estimada ${Number(event.days || 0)} días`;
  if(event.type === 'substitution') return `↔ ${escapeHtml(event.inPlayerName || 'Jugador')} por ${escapeHtml(event.outPlayerName || 'Jugador')}`;
  return escapeHtml(event.type || 'Evento');
}
function renderChallengeDetail(row){
  const home = row.creatorSnapshot || {};
  const away = row.opponentSnapshot || {};
  const match = row.match || {};
  const result = match.result || {};
  const events = Array.isArray(result.events) ? result.events : [];
  const ratings = Array.isArray(result.playerRatings) ? result.playerRatings.slice().sort((a,b)=>b.rating-a.rating) : [];
  view.innerHTML = `<div class="row section-title"><div><h2>Partido de desafío</h2><p class="tagline">${escapeHtml(row.creatorUsername || 'Manager')} vs ${escapeHtml(row.opponentUsername || 'Manager')}</p></div><button id="btnBackChallenges" class="ghost">Volver</button></div>
    <div class="card challenge-result-hero">
      <div>${challengeClubSummary(home)}</div>
      <div class="challenge-result-score"><span>Final</span><strong>${Number(match.homeGoals || result?.score?.home || 0)}–${Number(match.awayGoals || result?.score?.away || 0)}</strong><small>${escapeHtml(challengeDateLabel(row.completedAt || match.createdAt))}</small></div>
      <div>${challengeClubSummary(away)}</div>
    </div>
    <div class="grid cols-4 challenge-result-metrics">
      <div class="card"><span>Asistencia</span><strong>${formatPlainNumber(Number(match.attendance || result?.attendance?.total || 0))}</strong></div>
      <div class="card"><span>Valor usado local</span><strong>${formatMoney(Number(match.homeUsedPlayersValue || result?.economy?.homeUsedPlayersValue || 0))}</strong></div>
      <div class="card"><span>Valor usado visitante</span><strong>${formatMoney(Number(match.awayUsedPlayersValue || result?.economy?.awayUsedPlayersValue || 0))}</strong></div>
      <div class="card"><span>Figura</span><strong>${escapeHtml(result?.manOfMatch?.playerName || '—')} ${result?.manOfMatch?.rating ? `(${result.manOfMatch.rating})` : ''}</strong></div>
    </div>
    <div class="grid cols-2">
      <div class="card"><h3>Estadísticas</h3>${challengeStatisticsMarkup(home, away, result.statistics || {})}</div>
      <div class="card"><h3>Eventos</h3><div class="challenge-events">${events.length ? events.map(event => `<div><span>${Number(event.minute || 0)}'</span><strong>${event.side === 'home' ? escapeHtml(home?.club?.name || 'Local') : escapeHtml(away?.club?.name || 'Visitante')}</strong><p>${challengeEventLabel(event)}</p></div>`).join('') : '<p class="muted">Sin eventos registrados.</p>'}</div></div>
    </div>
    <div class="card"><h3>Rendimientos individuales</h3><div class="table-wrap"><table><thead><tr><th>Equipo</th><th>Jugador</th><th>POS</th><th>Nota</th></tr></thead><tbody>${ratings.map(item => `<tr><td>${item.side === 'home' ? escapeHtml(home?.club?.name || 'Local') : escapeHtml(away?.club?.name || 'Visitante')}</td><td>${escapeHtml(item.playerName || 'Jugador')}</td><td>${escapeHtml(item.position || '—')}</td><td><strong>${Number(item.rating || 0).toFixed(1)}</strong></td></tr>`).join('')}</tbody></table></div></div>
    <div class="card challenge-disclaimer"><strong>Amistoso online.</strong> El resultado fue simulado localmente por el jugador que aceptó y no modifica ninguna carrera.</div>`;
  $('btnBackChallenges')?.addEventListener('click', () => { challengeDetail=null; renderOnlineChallenges(); });
}
function challengeStatisticsMarkup(home, away, statistics){
  const labels = [
    ['Posesión','possession','%'], ['Tiros','shots',''], ['Al arco','shotsOnTarget',''], ['Córners','corners',''], ['Faltas','fouls','']
  ];
  return `<div class="challenge-stat-list">${labels.map(([label,key,suffix]) => `<div><strong>${Number(statistics?.home?.[key] || 0)}${suffix}</strong><span>${label}</span><strong>${Number(statistics?.away?.[key] || 0)}${suffix}</strong></div>`).join('')}</div>
    <div class="challenge-economy-comparison"><p>${escapeHtml(home?.club?.name || 'Local')}: convocatoria ${formatMoney(Number(home?.team?.matchSquadValue || 0))} · sueldos ${formatMoney(Number(home?.team?.matchSquadSalaryTotal || 0))}</p><p>${escapeHtml(away?.club?.name || 'Visitante')}: convocatoria ${formatMoney(Number(away?.team?.matchSquadValue || 0))} · sueldos ${formatMoney(Number(away?.team?.matchSquadSalaryTotal || 0))}</p></div>`;
}
