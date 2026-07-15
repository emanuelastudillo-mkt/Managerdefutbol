/* Desafíos online: fotografías del equipo, simulación local y resultados públicos. */

let challengeViewTab = 'available';
let challengeRowsCache = { available:[], mine:[], history:[], ranking:[] };
let challengeLoadedTabs = { available:false, mine:false, history:false, ranking:false };
let challengeLoading = false;
let challengeDetail = null;
let challengePollTimer = null;
let challengeCooldownTimer = null;
let challengeActionBusy = false;

function challengeConfig(){
  const cfg = window.GAME_CONFIG?.desafiosOnline || {};
  return {
    active:cfg.activo !== false,
    endpoint:String(cfg.endpoint || rankingStoredEndpoint?.() || RANKING_APPS_SCRIPT_URL || '').trim(),
    simulatorVersion:String(cfg.versionSimulador || window.ChallengeSimulator?.version || 'challenge-sim-v1'),
    pageSize:Math.max(5, Math.min(100, Math.round(Number(cfg.resultadosPorPagina || 40)))),
    pollMs:Math.max(10000, Math.round(Number(cfg.actualizacionMs || 30000))),
    actionCooldownMs:Math.max(60000, Math.round(Number(cfg.cooldownAccionMinutos || 10) * 60000))
  };
}
function challengeEndpoint(){ return normalizeRankingEndpoint(challengeConfig().endpoint); }
function challengeToken(){ return typeof rankingStoredAuthToken === 'function' ? rankingStoredAuthToken() : ''; }
function challengeActionCooldownStorageKey(){
  let owner = 'local';
  try{
    owner = String(localStorage.getItem('fmRankingAuthUserId') || localStorage.getItem('fmRankingAuthUser') || localStorage.getItem('fmRankingUsername') || 'local').trim() || 'local';
  }catch(_){ owner = 'local'; }
  return `fmChallengeActionCooldownUntil:${owner}`;
}
function challengeActionCooldownInfo(now=Date.now()){
  let until = 0;
  try{ until = Number(localStorage.getItem(challengeActionCooldownStorageKey()) || 0); }catch(_){ until = 0; }
  if(!Number.isFinite(until) || until <= now){
    try{ localStorage.removeItem(challengeActionCooldownStorageKey()); }catch(_){ /* sin almacenamiento */ }
    return { active:false, until:0, remainingMs:0 };
  }
  return { active:true, until, remainingMs:Math.max(0, until - now) };
}
function challengeActionCooldownLabel(remainingMs){
  const totalSeconds = Math.max(0, Math.ceil(Number(remainingMs || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}
function challengeStartActionCooldown(){
  const until = Date.now() + challengeConfig().actionCooldownMs;
  try{ localStorage.setItem(challengeActionCooldownStorageKey(), String(until)); }catch(_){ /* sin almacenamiento */ }
  challengeRefreshActionCooldown();
  return until;
}
function challengeActionUiState(defaultLabel){
  const cooldown = challengeActionCooldownInfo();
  const authenticated = Boolean(challengeToken());
  return {
    disabled:challengeActionBusy || !authenticated || cooldown.active,
    label:challengeActionBusy ? 'Procesando...' : cooldown.active ? `Disponible en ${challengeActionCooldownLabel(cooldown.remainingMs)}` : defaultLabel,
    cooldown
  };
}
function challengeRefreshActionCooldown(){
  clearTimeout(challengeCooldownTimer);
  const cooldown = challengeActionCooldownInfo();
  const authenticated = Boolean(challengeToken());
  document.querySelectorAll('[data-challenge-cooldown-action]').forEach(button => {
    const defaultLabel = String(button.dataset.defaultLabel || 'Continuar');
    button.disabled = challengeActionBusy || !authenticated || cooldown.active;
    button.textContent = challengeActionBusy ? 'Procesando...' : cooldown.active ? `Disponible en ${challengeActionCooldownLabel(cooldown.remainingMs)}` : defaultLabel;
  });
  const note = document.getElementById('challengeActionCooldownNote');
  if(note){
    note.textContent = cooldown.active
      ? `Podrás publicar o aceptar otro desafío en ${challengeActionCooldownLabel(cooldown.remainingMs)}.`
      : 'Publicar o aceptar un desafío habilita una pausa de 10 minutos antes de la siguiente acción.';
  }
  if(cooldown.active && activeTab === 'challenges') challengeCooldownTimer = setTimeout(challengeRefreshActionCooldown, 1000);
}
function challengeEnsureActionAvailable(){
  const cooldown = challengeActionCooldownInfo();
  if(!cooldown.active) return true;
  showNotice(`Podrás publicar o aceptar otro desafío en ${challengeActionCooldownLabel(cooldown.remainingMs)}.`);
  return false;
}
function challengeApiUrl(path='', query=''){
  const clean = String(path || '').replace(/^\/+|\/+$/g, '');
  return `${challengeEndpoint()}${clean ? `/${clean}` : ''}${query || ''}`;
}
function challengeHeaders(includeJson=false){
  const headers = { 'X-FM-Client-Version':String(typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'V7.47') };
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
      gameVersion:String(typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'V7.47'),
      simulatorVersion:challengeConfig().simulatorVersion,
      seasonNumber:Math.max(1, Math.round(Number(game.seasonNumber || 1))),
      seasonDay:Math.max(1, Math.round(Number(seasonDay || 1)))
    },
    club:{
      id:String(game.selectedClubId),
      name:String(club.name || clubName(game.selectedClubId) || 'Club').slice(0, 100),
      crestPath:String((typeof clubBadgeSrcCandidates === 'function' ? clubBadgeSrcCandidates(club)?.[0] : '') || club.crestPath || club.crest || '').slice(0, 220),
      reputation:Math.max(0, Math.round(Number(club.reputation || club.prestige || 0))),
      fans:Math.max(0, Math.round(typeof clubFansCurrent === 'function' ? clubFansCurrent(game.selectedClubId) : 0)),
      stadiumName:String(typeof clubStadiumName === 'function' ? clubStadiumName(game.selectedClubId) : (club.stadiumName || `${club.name || 'Club'} Stadium`)).slice(0, 120),
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
function challengeCrestMarkup(snapshot={}, extraClass=''){
  const club = snapshot?.club || {};
  const src = String(club.crestPath || '').trim();
  return src
    ? `<span class="challenge-crest-shell ${escapeHtml(extraClass)}"><img src="${escapeHtml(src)}" alt="" class="challenge-crest" onerror="this.parentElement.classList.add('crest-missing');this.remove()"></span>`
    : `<span class="challenge-crest-shell crest-missing ${escapeHtml(extraClass)}" aria-hidden="true">⚽</span>`;
}
function challengeVenueName(snapshot={}){
  return String(snapshot?.club?.stadiumName || `${snapshot?.club?.name || 'Club'} Stadium`);
}
function challengeClubSummary(snapshot={}, options={}){
  const club = snapshot.club || {};
  const team = snapshot.team || {};
  const compact = options.compact === true;
  const facts = compact
    ? `<div class="challenge-compact-facts">
        <span><b>Estadio</b><em title="${escapeHtml(challengeVenueName(snapshot))}">${escapeHtml(challengeVenueName(snapshot))}</em></span>
        <span><b>Capacidad</b><em>${formatPlainNumber(Number(club.stadiumCapacity || 0))}</em></span>
        <span><b>Hinchas</b><em>${formatPlainNumber(Number(club.fans || 0))}</em></span>
      </div>`
    : `<div class="challenge-club-facts">
        <span><b>Estadio</b>${escapeHtml(challengeVenueName(snapshot))}</span>
        <span><b>Capacidad</b>${formatPlainNumber(Number(club.stadiumCapacity || 0))}</span>
        <span><b>Hinchas</b>${formatPlainNumber(Number(club.fans || 0))}</span>
        <span><b>Valor</b>${formatMoney(Number(team.matchSquadValue || 0))}</span>
        <span><b>Sueldos</b>${formatMoney(Number(team.matchSquadSalaryTotal || 0))}</span>
      </div>`;
  return `<div class="challenge-team-summary ${compact ? 'compact' : ''}">
    <div class="challenge-club-head">${challengeCrestMarkup(snapshot)}<div><strong title="${escapeHtml(club.name || 'Club')}">${escapeHtml(club.name || 'Club')}</strong><small>${escapeHtml(snapshot?.tactic?.formation || '—')} · Media ${Number(team.rating || 0).toFixed(1)}</small></div></div>
    ${facts}
  </div>`;
}
function challengeVenueMarkup(homeSnapshot={}){
  const club = homeSnapshot?.club || {};
  return `<div class="challenge-venue-line"><span>🏟</span><strong>${escapeHtml(challengeVenueName(homeSnapshot))}</strong><span>Capacidad ${formatPlainNumber(Number(club.stadiumCapacity || 0))}</span><span>Hinchas ${formatPlainNumber(Number(club.fans || 0))}</span></div>`;
}
function challengeSnapshotSalary(snapshot={}){
  const team = snapshot?.team || {};
  return Math.max(0, Math.round(challengeSafeNumber(team.matchSquadSalaryTotal ?? team.startingXiSalaryTotal, 0)));
}
function challengeSimpleTeamSide(snapshot={}, managerName='Manager', side='home', options={}){
  const clubName = String(snapshot?.club?.name || options.fallbackClub || (side === 'away' ? 'Club visitante' : 'Club local'));
  const salaryMarkup = options.showSalary === true
    ? `<small class="challenge-history-simple-salary" title="Sueldos de la convocatoria">Sueldos ${formatMoney(challengeSnapshotSalary(snapshot))}</small>`
    : '';
  return `<div class="challenge-history-simple-side challenge-history-simple-${side}">
    ${challengeCrestMarkup(snapshot, 'challenge-history-simple-crest')}
    <div class="challenge-history-simple-copy">
      <strong title="${escapeHtml(clubName)}">${escapeHtml(clubName)}</strong>
      <span title="${escapeHtml(managerName || 'Manager')}">${escapeHtml(managerName || 'Manager')}</span>
      ${salaryMarkup}
    </div>
  </div>`;
}
function challengeSimpleScore(result={}, label='Final'){
  const hasScore = result && (result.homeGoals != null || result.awayGoals != null);
  return `<div class="challenge-history-simple-score ${label ? 'with-label' : ''} ${hasScore ? '' : 'challenge-history-simple-status'}" ${hasScore ? `aria-label="Resultado ${Number(result.homeGoals || 0)} a ${Number(result.awayGoals || 0)}"` : ''}>
    ${label ? `<small>${escapeHtml(label)}</small>` : ''}
    <b>${hasScore ? `${Number(result.homeGoals || 0)}–${Number(result.awayGoals || 0)}` : 'VS'}</b>
  </div>`;
}
function challengeOpenCard(row){
  const snapshot = row.creatorSnapshot || row.snapshot || {};
  const action = challengeActionUiState('Aceptar desafío');
  return `<article class="card challenge-card challenge-open-card challenge-simple-single-card">
    ${challengeSimpleTeamSide(snapshot, row.creatorUsername || 'Manager', 'home', { showSalary:true, fallbackClub:row.creatorClubName || 'Club' })}
    <div class="challenge-simple-card-actions">
      <span class="pill ${challengeStatusClass(row.status)}">${challengeStatusLabel(row.status)}</span>
      <small>Publicado ${escapeHtml(challengeDateLabel(row.createdAt))}</small>
      <small>Vence ${escapeHtml(challengeDateLabel(row.expiresAt))}</small>
      <button class="primary" data-challenge-accept="${escapeHtml(row.id)}" data-challenge-cooldown-action="accept" data-default-label="Aceptar desafío" ${action.disabled ? 'disabled' : ''}>${escapeHtml(action.label)}</button>
    </div>
  </article>`;
}
function challengeMineCard(row){
  const home = row.creatorSnapshot || {};
  const away = row.opponentSnapshot || {};
  const result = row.match || null;
  const hasOpponent = Boolean(row.opponentUsername || away?.club?.name);
  const actions = `${row.status === 'open' ? `<button class="ghost danger" data-challenge-cancel="${escapeHtml(row.id)}">Cancelar</button>` : ''}${row.status === 'completed' ? `<button class="primary" data-challenge-view="${escapeHtml(row.id)}">Ver partido</button>` : ''}`;
  if(!hasOpponent){
    return `<article class="card challenge-card challenge-simple-single-card challenge-mine-simple-card">
      ${challengeSimpleTeamSide(home, row.creatorUsername || 'Tu manager', 'home', { showSalary:true, fallbackClub:row.creatorClubName || 'Club' })}
      <div class="challenge-simple-card-actions">
        <span class="pill ${challengeStatusClass(row.status)}">${challengeStatusLabel(row.status)}</span>
        <small>Esperando rival</small>
        <small>${escapeHtml(challengeDateLabel(row.createdAt))}</small>
        ${actions}
      </div>
    </article>`;
  }
  const center = result ? challengeSimpleScore(result, 'Final') : challengeSimpleScore({}, challengeStatusLabel(row.status));
  return `<article class="card challenge-card challenge-mine-simple-card challenge-simple-match-card">
    <div class="challenge-history-simple challenge-mine-simple-matchup">
      ${challengeSimpleTeamSide(home, row.creatorUsername || 'Manager', 'home', { showSalary:true, fallbackClub:row.creatorClubName || 'Club local' })}
      ${center}
      ${challengeSimpleTeamSide(away, row.opponentUsername || 'Manager', 'away', { showSalary:true, fallbackClub:row.opponentClubName || 'Club visitante' })}
    </div>
    <div class="challenge-simple-card-footer">
      <span>${escapeHtml(challengeDateLabel(row.completedAt || row.createdAt))}</span>
      <div class="challenge-actions">${actions}</div>
    </div>
  </article>`;
}
function challengeHistoryCard(row){
  const home = row.creatorSnapshot || {};
  const away = row.opponentSnapshot || {};
  const result = row.match || {};
  return `<article class="card challenge-card challenge-history-card challenge-history-simple" data-challenge-view="${escapeHtml(row.id)}" title="Ver detalle del partido">
    ${challengeSimpleTeamSide(home, row.creatorUsername || 'Manager', 'home', { fallbackClub:row.creatorClubName || 'Club local' })}
    ${challengeSimpleScore(result, '')}
    ${challengeSimpleTeamSide(away, row.opponentUsername || 'Manager', 'away', { fallbackClub:row.opponentClubName || 'Club visitante' })}
  </article>`;
}

function challengeRankingMarkup(rows){
  return `<div class="card challenge-ranking-card">
    <div class="row"><div><h3>Ranking de desafíos</h3><p class="muted small">Puntaje calculado por resultado y diferencia de media entre equipos. Ganar con un equipo inferior suma mucho más.</p></div><span class="pill">Amistoso online</span></div>
    <div class="table-wrap"><table class="challenge-ranking-table"><thead><tr><th>#</th><th>Manager</th><th>PJ</th><th>G/E/P</th><th>GF-GC</th><th>Media</th><th>Rival prom.</th><th>Mejor partido</th><th>PTS</th></tr></thead><tbody>
      ${rows.map((row,index) => `<tr>
        <td>${Number(row.rank || index + 1)}</td>
        <td><strong>${escapeHtml(row.username || 'Manager')}</strong></td>
        <td>${Number(row.played || 0)}</td>
        <td>${Number(row.wins || 0)}/${Number(row.draws || 0)}/${Number(row.losses || 0)}</td>
        <td>${Number(row.goalsFor || 0)}-${Number(row.goalsAgainst || 0)}</td>
        <td>${Number(row.averageTeamRating || 0).toFixed(1)}</td>
        <td>${Number(row.averageOpponentRating || 0).toFixed(1)}</td>
        <td>${Number(row.bestMatchPoints || 0)}</td>
        <td><strong>${Number(row.points || 0)}</strong></td>
      </tr>`).join('')}
    </tbody></table></div>
    <p class="muted small">Victoria favorita: pocos puntos. Victoria de equipo inferior: puntaje alto. Empate: ambos suman, con más premio para el equipo más débil.</p>
  </div>`;
}
function challengeDateLabel(value){
  const date = new Date(String(value || ''));
  return Number.isFinite(date.getTime()) ? date.toLocaleString('es-AR', { dateStyle:'short', timeStyle:'short' }) : '—';
}
function challengeCurrentTeamCard(){
  let snapshot;
  try{ snapshot = buildChallengeSnapshot(); }
  catch(error){ return `<div class="card blocker"><h3>No se puede publicar el equipo</h3><p>${escapeHtml(error.message)}</p><button class="ghost" data-go-tab="firstTeam">Ir a Primer Equipo</button></div>`; }
  const action = challengeActionUiState('Publicar desafío');
  return `<div class="card challenge-publish-card">
    <div class="challenge-publish-head">${challengeCrestMarkup(snapshot,'large')}<div><p class="label">Tu equipo actual</p><h3>${escapeHtml(snapshot.club.name)}</h3><p class="muted small">${escapeHtml(challengeVenueName(snapshot))} · ${formatPlainNumber(snapshot.club.stadiumCapacity)} lugares · ${formatPlainNumber(snapshot.club.fans)} hinchas</p></div><span class="pill">${escapeHtml(snapshot.tactic.formation)}</span></div>
    <div class="grid cols-4 challenge-team-metrics">
      <div><span>Media</span><strong>${snapshot.team.rating.toFixed(1)}</strong></div>
      <div><span>Valor convocatoria</span><strong>${formatMoney(snapshot.team.matchSquadValue)}</strong></div>
      <div><span>Sueldos convocatoria</span><strong>${formatMoney(snapshot.team.matchSquadSalaryTotal)}</strong></div>
      <div><span>Cohesión</span><strong>${snapshot.team.cohesion}%</strong></div>
    </div>
    <p class="muted small">Se envía una fotografía de los titulares, suplentes, táctica, forma, moral, valores y sueldos. El amistoso no modifica la carrera.</p>
    <button id="btnPublishChallenge" class="primary" data-challenge-cooldown-action="publish" data-default-label="Publicar desafío" ${action.disabled ? 'disabled' : ''}>${escapeHtml(action.label)}</button>
    <p id="challengeActionCooldownNote" class="muted small challenge-cooldown-note"></p>
  </div>`;
}

function challengeLoginWarning(){
  if(challengeToken()) return '';
  return `<div class="card blocker"><h3>Iniciá sesión</h3><p>Los desafíos reutilizan la misma cuenta del Ranking Online.</p><button class="primary" data-go-ranking>Ir al login del ranking</button></div>`;
}
function challengeListMarkup(){
  const rows = challengeRowsCache[challengeViewTab] || [];
  if(challengeLoading && !rows.length && !challengeLoadedTabs[challengeViewTab]) return '<div class="card"><p class="muted">Cargando desafíos...</p></div>';
  if(!rows.length){
    const label = challengeViewTab === 'available' ? 'desafíos disponibles' : challengeViewTab === 'mine' ? 'desafíos propios' : challengeViewTab === 'ranking' ? 'puntajes de ranking' : 'partidos disputados';
    return `<div class="card empty"><h3>Sin registros</h3><p>No hay ${label} para mostrar.</p></div>`;
  }
  if(challengeViewTab === 'available') return `<div class="challenge-grid challenge-available-grid">${rows.map(challengeOpenCard).join('')}</div>`;
  if(challengeViewTab === 'mine') return `<div class="challenge-grid challenge-mine-grid">${rows.map(challengeMineCard).join('')}</div>`;
  if(challengeViewTab === 'ranking') return challengeRankingMarkup(rows);
  return `<div class="challenge-grid challenge-history-grid">${rows.map(challengeHistoryCard).join('')}</div>`;
}
function renderOnlineChallenges(){
  clearTimeout(challengePollTimer);
  clearTimeout(challengeCooldownTimer);
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
      <button data-challenge-tab="ranking" class="${challengeViewTab === 'ranking' ? 'active' : ''}">Ranking</button>
    </div>
    <div id="challengeStatus" class="small muted"></div>
    <div id="challengeList">${challengeListMarkup()}</div>`;
  bindChallengeEvents();
  challengeRefreshActionCooldown();
  if(!challengeLoadedTabs[challengeViewTab] && !challengeLoading) setTimeout(() => loadChallenges(challengeViewTab), 0);
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
  if(!challengeToken() && tab === 'mine'){ challengeLoadedTabs.mine = true; return; }
  if(options.force) challengeLoadedTabs[tab] = false;
  challengeLoading = true;
  if(!options.silent && activeTab === 'challenges') renderOnlineChallenges();
  try{
    const path = tab === 'available' ? 'challenges/open' : tab === 'mine' ? 'challenges/mine' : tab === 'ranking' ? 'challenges/ranking' : 'challenges/history';
    const data = await challengeRequest(path, { query:`?limit=${challengeConfig().pageSize}` });
    let rows = Array.isArray(data.challenges) ? data.challenges : Array.isArray(data.ranking) ? data.ranking : [];
    if(tab === 'available'){
      let ownUserId = 0;
      try{ ownUserId = Number(localStorage.getItem('fmRankingAuthUserId') || 0); }catch(_){ ownUserId = 0; }
      if(ownUserId) rows = rows.filter(row => Number(row.creatorUserId || 0) !== ownUserId);
    }
    challengeRowsCache[tab] = rows;
    challengeLoadedTabs[tab] = true;
  }catch(error){
    challengeLoadedTabs[tab] = true;
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
  if(!challengeEnsureActionAvailable()) return;
  try{
    challengeActionBusy = true;
    challengeRefreshActionCooldown();
    const snapshot = buildChallengeSnapshot();
    showNotice('Publicando fotografía del equipo...');
    await challengeRequest('challenges', { method:'POST', body:{ snapshot } });
    challengeStartActionCooldown();
    challengeRowsCache.available = [];
    challengeRowsCache.mine = [];
    challengeLoadedTabs.available = false;
    challengeLoadedTabs.mine = false;
    challengeViewTab = 'mine';
    showNotice('Desafío publicado. Podrás publicar o aceptar otro dentro de 10 minutos.');
    await loadChallenges('mine', { force:true });
  }catch(error){ showNotice(error.message); }
  finally{
    challengeActionBusy = false;
    challengeRefreshActionCooldown();
  }
}
async function acceptChallenge(challengeId){
  if(!challengeEnsureActionAvailable()) return;
  if(!confirm('¿Aceptar este desafío con la táctica y convocatoria actuales?')) return;
  const status = $('challengeStatus');
  try{
    challengeActionBusy = true;
    challengeRefreshActionCooldown();
    const snapshot = buildChallengeSnapshot();
    if(status) status.textContent = 'Reservando desafío y enviando tu equipo...';
    const accepted = await challengeRequest(`challenges/${encodeURIComponent(challengeId)}/accept`, { method:'POST', body:{ snapshot } });
    challengeStartActionCooldown();
    if(status) status.textContent = 'Simulando el partido en este navegador...';
    const result = window.ChallengeSimulator.simulateChallengeMatch({
      homeSnapshot:accepted.homeSnapshot,
      awaySnapshot:accepted.awaySnapshot,
      seed:accepted.seed
    });
    if(status) status.textContent = 'Guardando el resultado...';
    const saved = await challengeRequest(`challenges/${encodeURIComponent(challengeId)}/result`, { method:'POST', body:{ result } });
    challengeRowsCache.available = [];
    challengeRowsCache.mine = [];
    challengeRowsCache.history = [];
    challengeRowsCache.ranking = [];
    challengeLoadedTabs.available = false;
    challengeLoadedTabs.mine = false;
    challengeLoadedTabs.history = false;
    challengeLoadedTabs.ranking = false;
    challengeDetail = saved.challenge || null;
    showNotice('Partido simulado y guardado.');
    renderOnlineChallenges();
  }catch(error){
    if(status) status.textContent = '';
    showNotice(error.message);
  }finally{
    challengeActionBusy = false;
    challengeRefreshActionCooldown();
  }
}
async function cancelChallenge(challengeId){
  if(!confirm('¿Cancelar este desafío abierto?')) return;
  try{
    await challengeRequest(`challenges/${encodeURIComponent(challengeId)}/cancel`, { method:'POST', body:{} });
    challengeRowsCache.mine = [];
    challengeRowsCache.available = [];
    challengeLoadedTabs.mine = false;
    challengeLoadedTabs.available = false;
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
function challengeRatingsColumn(ratings=[], side='home'){
  const rows = ratings.filter(item => item.side === side).sort((a,b) => Number(b.rating || 0) - Number(a.rating || 0) || String(a.playerName || '').localeCompare(String(b.playerName || ''), 'es'));
  return `<aside class="card challenge-ratings-side ${side}">
    <div class="challenge-ratings-head"><span class="pill">${side === 'home' ? 'LOCAL' : 'VISITANTE'}</span><strong>${rows.length} jugadores</strong></div>
    <div class="challenge-rating-list">${rows.length ? rows.map(item => `<div class="challenge-rating-row"><span><b>${escapeHtml(item.playerName || 'Jugador')}</b><small>${escapeHtml(item.position || '—')}</small></span><strong>${Number(item.rating || 0).toFixed(1)}</strong></div>`).join('') : '<p class="muted small">Sin puntajes.</p>'}</div>
  </aside>`;
}
function renderChallengeDetail(row){
  const home = row.creatorSnapshot || {};
  const away = row.opponentSnapshot || {};
  const match = row.match || {};
  const result = match.result || {};
  const events = Array.isArray(result.events) ? result.events : [];
  const ratings = Array.isArray(result.playerRatings) ? result.playerRatings.slice() : [];
  view.innerHTML = `<div class="row section-title"><div><h2>Partido de desafío</h2><p class="tagline">${escapeHtml(row.creatorUsername || 'Manager')} vs ${escapeHtml(row.opponentUsername || 'Manager')}</p></div><button id="btnBackChallenges" class="ghost">Volver</button></div>
    <div class="card challenge-result-hero">
      <div>${challengeClubSummary(home)}</div>
      <div class="challenge-result-score"><span>Final</span><strong>${Number(match.homeGoals || result?.score?.home || 0)}–${Number(match.awayGoals || result?.score?.away || 0)}</strong><small>${escapeHtml(challengeDateLabel(row.completedAt || match.createdAt))}</small></div>
      <div>${challengeClubSummary(away)}</div>
    </div>
    ${challengeVenueMarkup(home)}
    <div class="grid cols-4 challenge-result-metrics">
      <div class="card"><span>Asistencia</span><strong>${formatPlainNumber(Number(match.attendance || result?.attendance?.total || 0))}</strong></div>
      <div class="card"><span>Valor usado local</span><strong>${formatMoney(Number(match.homeUsedPlayersValue || result?.economy?.homeUsedPlayersValue || 0))}</strong></div>
      <div class="card"><span>Valor usado visitante</span><strong>${formatMoney(Number(match.awayUsedPlayersValue || result?.economy?.awayUsedPlayersValue || 0))}</strong></div>
      <div class="card"><span>Figura</span><strong>${escapeHtml(result?.manOfMatch?.playerName || '—')} ${result?.manOfMatch?.rating ? `(${result.manOfMatch.rating})` : ''}</strong></div>
    </div>
    <div class="challenge-match-layout">
      ${challengeRatingsColumn(ratings,'home')}
      <main class="challenge-match-center">
        <div class="card"><h3>Estadísticas</h3>${challengeStatisticsMarkup(home, away, result.statistics || {})}</div>
        <div class="card"><h3>Eventos</h3><div class="challenge-events">${events.length ? events.map(event => `<div><span>${Number(event.minute || 0)}'</span><strong>${event.side === 'home' ? 'LOCAL' : 'VISITANTE'}</strong><p>${challengeEventLabel(event)}</p></div>`).join('') : '<p class="muted">Sin eventos registrados.</p>'}</div></div>
      </main>
      ${challengeRatingsColumn(ratings,'away')}
    </div>
    <div class="card challenge-disclaimer"><strong>Amistoso online.</strong> El resultado fue simulado localmente por el jugador que aceptó y no modifica ninguna carrera.</div>`;
  $('btnBackChallenges')?.addEventListener('click', () => { challengeDetail=null; renderOnlineChallenges(); });
}
function challengeStatisticsMarkup(home, away, statistics){
  const labels = [
    ['Posesión','possession','%'], ['Disparos','shots',''], ['Tiros a Puerta','shotsOnTarget',''], ['Córners','corners',''], ['Faltas','fouls','']
  ];
  return `<div class="challenge-stat-list">${labels.map(([label,key,suffix]) => `<div><strong>${Number(statistics?.home?.[key] || 0)}${suffix}</strong><span>${label}</span><strong>${Number(statistics?.away?.[key] || 0)}${suffix}</strong></div>`).join('')}</div>
    <div class="challenge-economy-comparison"><p>Local: convocatoria ${formatMoney(Number(home?.team?.matchSquadValue || 0))} · sueldos ${formatMoney(Number(home?.team?.matchSquadSalaryTotal || 0))}</p><p>Visitante: convocatoria ${formatMoney(Number(away?.team?.matchSquadValue || 0))} · sueldos ${formatMoney(Number(away?.team?.matchSquadSalaryTotal || 0))}</p></div>`;
}
