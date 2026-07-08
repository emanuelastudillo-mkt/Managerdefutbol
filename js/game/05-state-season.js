/* V3.80 · Eventos principales, normalización de partida, calendario anual, temporadas, bots, ascensos/descensos y prestigio de carrera. */

function clubPrestigeValue(clubOrId){
  const club = typeof clubOrId === 'object' ? clubOrId : seed?.clubs?.find(c => Number(c.id) === Number(clubOrId));
  const value = Number(club?.managerPrestige ?? club?.reputation ?? club?.prestigio ?? club?.prestige ?? 0);
  return clamp(Math.round(Number.isFinite(value) ? value : 0), 1, 99);
}
function divisionOrderFromName(name=''){
  const clean = String(name || '').toLowerCase();
  if(clean.includes('profesional') || clean.includes('primera divisi')) return 1;
  if(clean.includes('nacional') || clean.includes('segunda')) return 2;
  return 3;
}
function championPrestigeRewardByDivisionOrder(order){
  const value = Math.round(Number(order || 3));
  if(value <= 1) return 20;
  if(value === 2) return 10;
  return 5;
}
function badSeasonPrestigePenaltyByDivisionOrder(order){
  const value = Math.round(Number(order || 3));
  if(value <= 1) return 10;
  if(value === 2) return 10;
  return 5;
}
function managerPrestigeBreakdown(stats=game?.managerStats){
  const src = stats || {};
  const totals = src.totals || {};
  const seasons = Array.isArray(src.seasons) ? src.seasons : [];
  const career = Array.isArray(src.careerHistory) ? src.careerHistory : [];
  const adjustments = Array.isArray(src.prestigeAdjustments) ? src.prestigeAdjustments.reduce((sum, item) => sum + Number(item.points || 0), 0) : 0;
  const experience = Math.max(0, Math.round(Number(src.experience || 0)));
  const wins = Math.max(0, Math.round(Number(totals.won || 0)));
  const experiencePrestige = experience * Number(MANAGER_XP_TO_PRESTIGE_RATE || 0.001);
  const winPrestige = Math.floor(wins / Math.max(1, Number(MANAGER_PRESTIGE_WINS_STEP || 10)));
  const objectivePrestige = seasons.filter(item => Boolean(item.objectiveAchieved)).length * Number(MANAGER_PRESTIGE_OBJECTIVE_REWARD || 5);
  const championPrestige = seasons.reduce((sum, item) => {
    if(!(item.title || item.position === 1)) return sum;
    return sum + championPrestigeRewardByDivisionOrder(item.divisionOrder || divisionOrderFromName(item.divisionName));
  }, 0);
  const badSeasonPenalty = seasons.reduce((sum, item) => sum + Math.max(0, Number(item.managerPrestigeBadSeasonPenalty || item.prestigePenalty || 0)), 0);
  const dismissalPenalty = career.filter(item => item.type === 'dismissal').length * Number(MANAGER_PRESTIGE_DISMISSAL_PENALTY || 2);
  const totalRaw = adjustments + experiencePrestige + winPrestige + objectivePrestige + championPrestige - badSeasonPenalty - dismissalPenalty;
  const total = clamp(totalRaw, 0, 99);
  return { total, adjustments, experience, experiencePrestige, wins, winPrestige, objectivePrestige, championPrestige, badSeasonPenalty, dismissalPenalty };
}
function formatManagerPrestige(value=currentManagerPrestige()){
  const n = Math.max(0, Math.floor(Number(value || 0)));
  return n.toLocaleString('es-AR', { maximumFractionDigits:0 });
}
function formatManagerPrestigeDecimal(value=0){
  const n = Math.max(0, Number(value || 0));
  return n.toLocaleString('es-AR', { minimumFractionDigits:0, maximumFractionDigits:3 });
}
function managerClubAccessPrestige(value=currentManagerPrestige()){
  const n = Number(value || 0);
  return Math.max(0, Math.floor(Number.isFinite(n) ? n : 0));
}
function currentManagerPrestige(){
  if(game?.managerStats) return managerPrestigeBreakdown(game.managerStats).total;
  return clamp(Number(MANAGER_PRESTIGE_INITIAL || 0), 0, 99);
}
function currentManagerExperience(){
  return Math.max(0, Math.round(Number(game?.managerStats?.experience || 0)));
}
function managerClubRehireBlockInfo(clubOrId){
  const club = typeof clubOrId === 'object' ? clubOrId : seed?.clubs?.find(c => Number(c.id) === Number(clubOrId));
  const clubId = Number(club?.id || clubOrId || 0);
  if(!clubId || !game?.gameOver?.active || MANAGER_REHIRE_BLOCK_SEASONS <= 0) return { blocked:false };
  const currentSeason = Math.max(1, Number(game?.seasonNumber || 1));
  const history = Array.isArray(game?.managerStats?.careerHistory) ? game.managerStats.careerHistory : [];
  const leaves = history
    .filter(item => Number(item.clubId || 0) === clubId && ['dismissal','resignation'].includes(String(item.type || '')))
    .map(item => ({
      type:String(item.type || ''),
      season:Math.max(1, Number(item.season || 1)),
      clubName:String(item.clubName || club?.name || 'este club')
    }))
    .sort((a,b) => Number(b.season || 0) - Number(a.season || 0));
  const last = leaves[0];
  if(!last) return { blocked:false };
  const untilSeason = Math.max(1, Number(last.season || 1)) + MANAGER_REHIRE_BLOCK_SEASONS;
  if(currentSeason <= untilSeason){
    return {
      blocked:true,
      clubId,
      clubName:last.clubName,
      type:last.type,
      leftSeason:Number(last.season || 1),
      untilSeason,
      availableSeason:untilSeason + 1
    };
  }
  return { blocked:false };
}
function managerClubRehireBlockLabel(clubOrId){
  const info = managerClubRehireBlockInfo(clubOrId);
  if(!info.blocked) return '';
  const cause = info.type === 'resignation' ? 'renuncia' : 'despido';
  return `Bloqueado por ${cause} hasta temporada ${info.untilSeason}`;
}
function managerCanSelectClub(clubOrId, prestige=currentManagerPrestige(), options={}){
  const club = typeof clubOrId === 'object' ? clubOrId : seed?.clubs?.find(c => Number(c.id) === Number(clubOrId));
  if(!club) return false;
  if(options.ignoreRehireBlock !== true && managerClubRehireBlockInfo(club).blocked) return false;
  const clubPrestige = clubPrestigeValue(club);
  const managerPrestige = managerClubAccessPrestige(prestige);
  if(clubPrestige <= MANAGER_CLUB_OPEN_PRESTIGE) return true;
  return clubPrestige <= managerPrestige;
}
function clubAvailabilityLabel(clubOrId, prestige=currentManagerPrestige()){
  const club = typeof clubOrId === 'object' ? clubOrId : seed?.clubs?.find(c => Number(c.id) === Number(clubOrId));
  if(!club) return 'No disponible';
  const blockLabel = managerClubRehireBlockLabel(club);
  if(blockLabel) return blockLabel;
  const clubPrestige = clubPrestigeValue(club);
  if(managerCanSelectClub(club, prestige)) return 'Disponible';
  return `Requiere prestigio ${clubPrestige}`;
}
function clubSelectOptionsMarkup(){
  const divisions = seed.divisions || [{ id:'default', name:'Liga única' }];
  const prestige = currentManagerPrestige();
  return divisions.map(division => {
    const clubs = seed.clubs.filter(c => (c.divisionId || 'default') === division.id);
    if(!clubs.length) return '';
    return `<optgroup label="${escapeHtml(division.name)}">${clubs.map(c => {
      const available = managerCanSelectClub(c, prestige);
      const label = `${c.name} · Prestigio ${clubPrestigeValue(c)}${available ? '' : ' · No disponible'}`;
      return `<option value="${c.id}" ${available ? '' : 'disabled'}>${escapeHtml(label)}</option>`;
    }).join('')}</optgroup>`;
  }).join('');
}

function clubCountry(club){
  return String(club?.country || club?.pais || club?.countryName || 'Argentina').trim() || 'Argentina';
}
function availableCountries(){
  const names = Array.from(new Set((seed?.clubs || []).map(clubCountry).filter(Boolean)));
  return names.length ? names.sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'})) : ['Argentina'];
}
function countryOptionsMarkup(selected='Argentina'){
  const countries = availableCountries();
  const current = countries.includes(selected) ? selected : countries[0];
  return countries.map(name => `<option value="${escapeHtml(name)}" ${name===current?'selected':''}>${escapeHtml(name)}</option>`).join('');
}
function divisionsByCountry(country='Argentina'){
  const cleanCountry = String(country || '').trim() || availableCountries()[0] || 'Argentina';
  const countryClubDivisionIds = new Set((seed?.clubs || [])
    .filter(club => clubCountry(club) === cleanCountry)
    .map(club => club.divisionId || 'default'));
  const divisions = (seed?.divisions || [{ id:'default', name:'Liga única' }])
    .filter(division => countryClubDivisionIds.has(division.id || 'default'));
  return divisions.length ? divisions : (seed?.divisions || [{ id:'default', name:'Liga única' }]);
}
function leagueOptionsMarkup(country='Argentina', selected=''){
  const divisions = divisionsByCountry(country);
  const current = divisions.some(d => d.id === selected) ? selected : divisions[0]?.id;
  return divisions.map(division => `<option value="${escapeHtml(division.id)}" ${division.id===current?'selected':''}>${escapeHtml(division.name)}</option>`).join('');
}
function clubsByCountryLeague(country='Argentina', leagueId=''){
  const cleanCountry = String(country || '').trim() || availableCountries()[0] || 'Argentina';
  const divisions = divisionsByCountry(cleanCountry);
  const currentLeague = divisions.some(d => d.id === leagueId) ? leagueId : divisions[0]?.id;
  return (seed?.clubs || [])
    .filter(club => clubCountry(club) === cleanCountry && (club.divisionId || 'default') === currentLeague)
    .sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es',{sensitivity:'base'}));
}
function teamOptionsMarkup(country='Argentina', leagueId='', selectedClubId=0){
  const clubs = clubsByCountryLeague(country, leagueId);
  const prestige = currentManagerPrestige();
  const firstAvailable = clubs.find(club => managerCanSelectClub(club, prestige)) || clubs[0];
  const selected = clubs.some(club => Number(club.id) === Number(selectedClubId) && managerCanSelectClub(club, prestige)) ? Number(selectedClubId) : Number(firstAvailable?.id || 0);
  return clubs.map(club => {
    const available = managerCanSelectClub(club, prestige);
    const status = clubAvailabilityLabel(club, prestige);
    const label = `${club.name} · Prestigio ${clubPrestigeValue(club)} · ${status}`;
    return `<option value="${club.id}" ${Number(club.id)===selected?'selected':''} ${available ? '' : 'disabled'}>${escapeHtml(label)}</option>`;
  }).join('');
}
function formatPlainNumber(value){
  return new Intl.NumberFormat('es-AR', { maximumFractionDigits:0 }).format(Math.max(0, Math.round(Number(value || 0))));
}
function formatBudgetMillions(value){
  const millions = Number(value || 0) / 1000000;
  const digits = millions >= 100 ? 0 : 1;
  return `$${millions.toLocaleString('es-AR', { maximumFractionDigits:digits })} M`;
}
function clubStarterDetails(club){
  const id = Number(club?.id || 0);
  return {
    country:clubCountry(club),
    league:clubDivision(id).name,
    capacity:clubStadiumCapacity(id),
    fans:clubFansBase(id),
    budget:Number(club?.budget || 0)
  };
}
function availableManagerClubs(prestige=currentManagerPrestige()){
  return (seed?.clubs || [])
    .filter(club => managerCanSelectClub(club, prestige))
    .sort((a,b)=>{
      const country = clubCountry(a).localeCompare(clubCountry(b), 'es', { sensitivity:'base' });
      if(country) return country;
      const div = (a.divisionOrder || 99) - (b.divisionOrder || 99);
      if(div) return div;
      const rep = clubPrestigeValue(b) - clubPrestigeValue(a);
      if(rep) return rep;
      return String(a.name || '').localeCompare(String(b.name || ''), 'es', { sensitivity:'base' });
    });
}
function starterClubCardMarkup(club, options={}){
  const prestige = Number.isFinite(Number(options.prestige)) ? Number(options.prestige) : currentManagerPrestige();
  const available = managerCanSelectClub(club, prestige);
  const details = clubStarterDetails(club);
  const buttonAttr = options.buttonDataAttr || 'data-job-club';
  const buttonLabel = options.buttonLabel || 'Elegir club';
  const compact = Boolean(options.compact);
  const status = clubAvailabilityLabel(club, prestige);
  if(compact){
    return `<article class="starter-club-card ${available ? 'available' : 'locked'} compact" style="--starter-club-color:${escapeHtml(clubColor(club.id))}">
      <div class="starter-club-head compact">
        ${clubBadge(club.id)}
        <div>
          <strong>${escapeHtml(club.name)}</strong>
          <p class="starter-club-line">${escapeHtml(details.country)} · ${escapeHtml(details.league)}</p>
          <p class="starter-club-line starter-club-stats"><span>Est. ${formatPlainNumber(details.capacity)}</span><span>Hin. ${formatPlainNumber(details.fans)}</span><span>${formatBudgetMillions(details.budget)}</span></p>
        </div>
        <span class="pill ok-pill">P ${clubPrestigeValue(club)}</span>
      </div>
      <div class="starter-club-actions compact">
        <span class="muted small">${escapeHtml(status)}</span>
        <button type="button" class="primary" ${buttonAttr}="${club.id}" ${available ? '' : 'disabled'}>${escapeHtml(buttonLabel)}</button>
      </div>
    </article>`;
  }
  return `<article class="starter-club-card ${available ? 'available' : 'locked'}" style="--starter-club-color:${escapeHtml(clubColor(club.id))}">
    <div class="starter-club-head">
      ${clubBadge(club.id)}
      <div>
        <strong>${escapeHtml(club.name)}</strong>
        <p class="muted small">${escapeHtml(details.country)} · ${escapeHtml(details.league)}</p>
      </div>
      <span class="pill ${available ? 'ok-pill' : 'bad-pill'}">Prestigio ${clubPrestigeValue(club)}</span>
    </div>
    <div class="starter-club-meta">
      <div><span>Capacidad</span><strong>${formatPlainNumber(details.capacity)}</strong></div>
      <div><span>Hinchas</span><strong>${formatPlainNumber(details.fans)}</strong></div>
      <div><span>Presupuesto</span><strong>${formatBudgetMillions(details.budget)}</strong></div>
    </div>
    <div class="starter-club-actions">
      <span class="muted small">${escapeHtml(status)}</span>
      <button type="button" class="primary" ${buttonAttr}="${club.id}" ${available ? '' : 'disabled'}>${escapeHtml(buttonLabel)}</button>
    </div>
  </article>`;
}
function clubAvailabilityListMarkup(country='Argentina', leagueId=''){
  const clubs = clubsByCountryLeague(country, leagueId);
  const prestige = currentManagerPrestige();
  if(!clubs.length) return '<p class="muted small">No hay clubes para esta liga.</p>';
  return `<div class="job-club-list">${clubs.map(club => {
    const available = managerCanSelectClub(club, prestige);
    return `<button type="button" class="job-club-list-row ${available ? '' : 'locked'}" data-job-club="${club.id}" ${available ? '' : 'disabled'}><strong>${escapeHtml(club.name)}</strong><span>Prestigio ${clubPrestigeValue(club)} · ${escapeHtml(clubAvailabilityLabel(club, prestige))}</span></button>`;
  }).join('')}</div>`;
}
function storedManagerName(){
  try{ return String(game?.rankingManagerName || localStorage.getItem('fmRankingManagerName') || '').trim(); }
  catch(_){ return String(game?.rankingManagerName || '').trim(); }
}
function persistManagerName(name){
  const clean = String(name || '').trim().slice(0, 40);
  try{ localStorage.setItem('fmRankingManagerName', clean); }catch(_){ /* sin almacenamiento */ }
  if(game) game.rankingManagerName = clean;
  return clean;
}

function fillClubSelect(){
  const select = $('clubSelect');
  if(select) select.innerHTML = clubSelectOptionsMarkup();
}
function confirmResetLocal(){
  const ok = window.confirm('Vas a borrar la partida local guardada en este navegador. Esta acción no se puede deshacer.');
  if(ok) resetLocal();
}
function bindEvents(){
  $('btnOpenNewGame')?.addEventListener('click', openNewGameModal);
  $('btnNewGame')?.addEventListener('click', ()=> newGame(Number($('clubSelect')?.value || 0), { managerName:storedManagerName() }));
  $('btnSave').addEventListener('click', saveLocal);
  $('btnLoad').addEventListener('click', ()=>loadLocal(false));
  $('topResignClubBtn')?.addEventListener('click', resignCurrentClub);
  $('btnReset')?.addEventListener('click', confirmResetLocal);
  document.querySelectorAll('.tabs button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      activeTab = btn.dataset.tab;
      if(typeof resetManagerDivisionFilterForTab === 'function') resetManagerDivisionFilterForTab(activeTab);
      renderAll();
    });
  });
  document.addEventListener('click', (event)=>{
    const playerBtn = event.target.closest('[data-player-id]');
    if(playerBtn){ showPlayerModal(Number(playerBtn.dataset.playerId)); return; }
    const clubBtn = event.target.closest('[data-club-id]');
    if(clubBtn){ showClubModal(Number(clubBtn.dataset.clubId)); return; }
    const matchBtn = event.target.closest('[data-match-id]');
    if(matchBtn){ showMatchModal(matchBtn.dataset.matchId); return; }
    if(event.target.closest('[data-open-messages]')){ activeTab='messages'; renderAll(); return; }
    const mentalityBtn = event.target.closest('[data-toggle-mentality]');
    if(mentalityBtn){
      const playerId = Number(mentalityBtn.dataset.toggleMentality);
      if(game?.tactic?.starters?.includes(playerId)){
        game.tactic = applyStarterMentalities(game.tactic);
        setPlayerMentality(playerId, nextMentality(playerMentality(playerId)), game.tactic);
        saveLocal(true);
        renderTactics();
      }
      return;
    }
    const close = event.target.closest('[data-close-modal]');
    if(close || event.target.classList.contains('modal-backdrop')) closeModal();
  });
  document.addEventListener('keydown', (event)=>{ if(event.key === 'Escape') closeModal(); });
}

function startUiTicker(){
  clearInterval(uiTicker);
  uiTicker = setInterval(()=>{
    if(game) refreshSidebarDate();
    if(game && activeTab === 'home') updateAdvanceButtonState();
  }, 1000);
}
function generateSaveCode(){
  const raw = `${Date.now()}-${Math.random()}-${navigator.userAgent || ''}`;
  return `FM-${Date.now().toString(36).toUpperCase()}-${hashNumber(raw, 1000000).toString().padStart(6,'0')}`;
}
function deriveSeasonInitialBudgetFromHistory(saved, season){
  const history = Array.isArray(saved?.budgetHistory) ? saved.budgetHistory : [];
  const currentSeason = Number(season || saved?.seasonNumber || 1);
  const first = history.find(entry => Number(entry.season || currentSeason) === currentSeason && Number.isFinite(Number(entry.budget)));
  if(first){
    return Math.max(0, Math.round(Number(first.budget || 0) - Number(first.delta || 0)));
  }
  if(currentSeason === 1){
    const club = seed?.clubs?.find(c => Number(c.id) === Number(saved?.selectedClubId));
    if(club && Number.isFinite(Number(club.budget))) return Math.max(0, Math.round(Number(club.budget)));
  }
  return Math.max(0, Math.round(Number(saved?.budget || 0)));
}
function normalizeGame(saved){
  const normalized = {...saved};
  normalized.version = APP_VERSION;
  normalized.seedSignature = normalized.seedSignature || seed?.meta?.signature || '';
  normalized.tactic = normalizeTactic(normalized.selectedClubId, normalized.tactic || DEFAULT_TACTIC);
  normalized.playerStatus = normalized.playerStatus || {};
  normalized.statusRebases = (normalized.statusRebases && typeof normalized.statusRebases === 'object' && !Array.isArray(normalized.statusRebases)) ? normalized.statusRebases : {};
  normalized.injuryRecoveryTurnsBySeason = (normalized.injuryRecoveryTurnsBySeason && typeof normalized.injuryRecoveryTurnsBySeason === 'object' && !Array.isArray(normalized.injuryRecoveryTurnsBySeason)) ? normalized.injuryRecoveryTurnsBySeason : {};
  normalized.lastOwnProblems = normalized.lastOwnProblems || [];
  normalized.lastTurnSummary = normalized.lastTurnSummary || null;
  normalized.mustReviewTactics = Boolean(normalized.mustReviewTactics);
  normalized.advanceLockedUntil = normalized.advanceLockedUntil || 0;
  normalized.advanceLockDurationMs = Number.isFinite(Number(normalized.advanceLockDurationMs)) ? Number(normalized.advanceLockDurationMs) : ADVANCE_LOCK_MS;
  normalized.matchHistory = normalized.matchHistory || [];
  normalized.seasonNumber = Number.isFinite(normalized.seasonNumber) ? normalized.seasonNumber : 1;
  normalized.seasonYear = Math.round(Number(normalized.seasonYear || 0)) || seasonYearForNumber(normalized.seasonNumber || 1);
  normalized.calendarVersion = normalized.calendarVersion || '';
  normalized.saveCode = normalized.saveCode || generateSaveCode();
  normalized.rankingUploads = (normalized.rankingUploads && typeof normalized.rankingUploads === 'object' && !Array.isArray(normalized.rankingUploads)) ? normalized.rankingUploads : {};
  normalized.rankingManagerName = normalized.rankingManagerName || storedManagerName() || '';
  normalized.rankingLastUploadGameDate = validIsoDate(normalized.rankingLastUploadGameDate) ? normalized.rankingLastUploadGameDate : '';
  normalized.selectedCountry = normalized.selectedCountry || clubCountry(seed?.clubs?.find(c => Number(c.id) === Number(normalized.selectedClubId))) || 'Argentina';
  normalized.selectedLeagueId = normalized.selectedLeagueId || (seed?.clubs?.find(c => Number(c.id) === Number(normalized.selectedClubId))?.divisionId || 'default');
  normalized.playerMentalities = (normalized.playerMentalities && typeof normalized.playerMentalities === 'object' && !Array.isArray(normalized.playerMentalities)) ? normalized.playerMentalities : {};
  normalized.playerMentalities = { ...(normalized.tactic?.playerMentalities || {}), ...normalized.playerMentalities };
  Object.keys(normalized.playerMentalities).forEach(id => {
    const cleanId = Number(id);
    if(!cleanId) delete normalized.playerMentalities[id];
    else normalized.playerMentalities[cleanId] = normalizeMentality(normalized.playerMentalities[id]);
  });
  normalized.tactic.playerMentalities = { ...normalized.playerMentalities, ...(normalized.tactic?.playerMentalities || {}) };
  normalized.seasonBudgetStartBySeason = (normalized.seasonBudgetStartBySeason && typeof normalized.seasonBudgetStartBySeason === 'object' && !Array.isArray(normalized.seasonBudgetStartBySeason)) ? normalized.seasonBudgetStartBySeason : {};
  if(!Number.isFinite(Number(normalized.seasonBudgetStartBySeason[normalized.seasonNumber]))){
    normalized.seasonBudgetStartBySeason[normalized.seasonNumber] = deriveSeasonInitialBudgetFromHistory(normalized, normalized.seasonNumber);
  }
  normalized.seasonInitialBudget = Number.isFinite(Number(normalized.seasonInitialBudget)) ? Math.round(Number(normalized.seasonInitialBudget)) : Math.round(Number(normalized.seasonBudgetStartBySeason[normalized.seasonNumber] || deriveSeasonInitialBudgetFromHistory(normalized, normalized.seasonNumber)));
  normalized.seasonFinalized = Boolean(normalized.seasonFinalized);
  normalized.seasonTransition = normalized.seasonTransition || null;
  normalized.seasonPhase = normalized.seasonPhase || (normalized.seasonFinalized ? 'finalized' : 'regular');
  normalized.phaseTurn = Number.isFinite(normalized.phaseTurn) ? normalized.phaseTurn : 0;
  normalized.globalTurn = Number.isFinite(normalized.globalTurn) ? normalized.globalTurn : ((Math.max(1, normalized.seasonNumber || 1) - 1) * 53 + (normalized.matchdayIndex || 0));
  normalized.preseasonFriendliesPlayed = Number.isFinite(normalized.preseasonFriendliesPlayed) ? normalized.preseasonFriendliesPlayed : 0;
  normalized.pendingFriendlyOpponentId = Number.isFinite(normalized.pendingFriendlyOpponentId) ? normalized.pendingFriendlyOpponentId : 0;
  normalized.clubDivisionOverrides = normalized.clubDivisionOverrides || {};
  normalized.managerStats = ensureManagerCurrentSeasonStats(normalized.managerStats, normalized.seasonNumber, normalized.selectedClubId);
  normalized.gameOver = normalizeGameOverState(normalized.gameOver);
  normalized.messages = Array.isArray(normalized.messages) ? normalized.messages : [];
  normalized.messages = normalized.messages.filter(msg => !String(msg?.body || '').includes('La liga ajustó la preparación de'));
  normalized.specialClauseOffers = (normalized.specialClauseOffers && typeof normalized.specialClauseOffers === 'object' && !Array.isArray(normalized.specialClauseOffers)) ? normalized.specialClauseOffers : null;
  normalized.eventLog = Array.isArray(normalized.eventLog) ? normalized.eventLog : [];
  normalized.playerStars = normalizePlayerStarsState(normalized.playerStars || {});
  normalized.playerImpactWindows = normalizePlayerImpactWindows(normalized.playerImpactWindows || {});
  syncPlayerStarsWithClubs(normalized);
  normalized.special = typeof normalizeSpecialState === 'function' ? normalizeSpecialState(normalized.special, normalized.rankingManagerName || storedManagerName() || 'Manager') : (normalized.special || null);
  normalized.marketPlayers = Array.isArray(normalized.marketPlayers) ? normalized.marketPlayers : generateMarketPlayers(MARKET_FREE_AGENT_COUNT);
  normalized.pendingTransfers = Array.isArray(normalized.pendingTransfers) ? normalized.pendingTransfers : [];
  normalized.rejectedPurchaseOffers = (normalized.rejectedPurchaseOffers && typeof normalized.rejectedPurchaseOffers === 'object' && !Array.isArray(normalized.rejectedPurchaseOffers)) ? normalized.rejectedPurchaseOffers : {};
  normalized.lastOwnPlayerOffer = normalized.lastOwnPlayerOffer || null;
  normalized.seasonEndPlayerOffers = normalized.seasonEndPlayerOffers || null;
  mergeMarketPlayersIntoSeed(normalized.marketPlayers);
  normalizeAllPlayerPositions();
  normalized.marketPlayers.forEach(p => { p.position = normalizePlayerPosition(p.position, p.id); p.transferListed = Boolean(p.transferListed); ensurePlayerEconomics(p, p.youthFreeAgent ? FREE_YOUTH_SALARY_FACTOR : MARKET_FREE_AGENT_SALARY_FACTOR); });
  seed.players.forEach(p => { p.transferListed = Boolean(p.transferListed); ensurePlayerEconomics(p, p.youthFreeAgent ? FREE_YOUTH_SALARY_FACTOR : 1); });
  applyClubDivisionOverrides(normalized.clubDivisionOverrides);
  const previousCalendarVersion = normalized.calendarVersion;
  const previousFixtureCount = Array.isArray(normalized.fixtures) ? normalized.fixtures.length : 0;
  normalized.fixtures = normalizeSeasonFixtures(normalized.fixtures || structuredClone(seed.fixtures), normalized.seasonNumber, normalized.seasonYear);
  const calendarExpanded = previousCalendarVersion !== SEASON_CALENDAR_VERSION && previousFixtureCount > 0 && normalized.fixtures.length > previousFixtureCount;
  normalized.matchdayIndex = Math.min(Math.max(0, Number(normalized.matchdayIndex || 0)), normalized.fixtures.length);
  if(calendarExpanded && normalized.matchdayIndex < normalized.fixtures.length && ['postseason','finalizing','finalized'].includes(normalized.seasonPhase)){
    normalized.seasonPhase = 'regular';
    normalized.phaseTurn = 0;
    normalized.seasonFinalized = false;
    normalized.seasonTransition = null;
  }
  if(previousCalendarVersion !== SEASON_CALENDAR_VERSION || !validIsoDate(normalized.currentDate) || String(normalized.currentDate).slice(0,4) !== String(normalized.seasonYear)){
    normalized.currentDate = dateForSeasonState(normalized);
  }
  normalized.calendarVersion = SEASON_CALENDAR_VERSION;
  normalized.standings = normalized.standings || createInitialStandings();
  normalized.playerStats = normalized.playerStats || createInitialPlayerStats();
  normalized.clubBudgets = (normalized.clubBudgets && typeof normalized.clubBudgets === 'object' && !Array.isArray(normalized.clubBudgets)) ? normalized.clubBudgets : {};
  seed.clubs.forEach(c => { if(!Number.isFinite(Number(normalized.clubBudgets[c.id]))) normalized.clubBudgets[c.id] = Math.round(Number(c.budget || 0)); });
  normalized.budget = Number.isFinite(normalized.budget) ? normalized.budget : (Number(normalized.clubBudgets[normalized.selectedClubId]) || seed.clubs.find(c=>c.id===normalized.selectedClubId)?.budget || 0);
  normalized.clubBudgets[normalized.selectedClubId] = Math.round(Number(normalized.budget || 0));
  normalized.lastBudgetDelta = Number.isFinite(normalized.lastBudgetDelta) ? normalized.lastBudgetDelta : 0;
  normalized.budgetHistory = normalized.budgetHistory || [];
  normalized.transferBudget = typeof normalizeTransferBudgetState === 'function' ? normalizeTransferBudgetState(normalized.transferBudget, normalized) : (normalized.transferBudget || null);
  normalized.nextSeasonTransferBudgetUnlock = (normalized.nextSeasonTransferBudgetUnlock && typeof normalized.nextSeasonTransferBudgetUnlock === 'object' && !Array.isArray(normalized.nextSeasonTransferBudgetUnlock)) ? normalized.nextSeasonTransferBudgetUnlock : null;
  normalized.playerCondition = normalized.playerCondition || {};
  seed.players.forEach(p => { if(!Number.isFinite(normalized.playerCondition[p.id])) normalized.playerCondition[p.id] = 99; });
  normalized.playerMorale = normalized.playerMorale || {};
  seed.players.forEach(p => { if(!Number.isFinite(normalized.playerMorale[p.id])) normalized.playerMorale[p.id] = PLAYER_MORALE_START; });
  normalized.playerSkillBoosts = normalized.playerSkillBoosts || {};
  normalized.trainingPlan = normalized.trainingPlan || {};
  normalized.trainingSchedule = normalizeTrainingSchedule(normalized.trainingSchedule);
  seed.players.forEach(p => {
    if(!normalized.playerSkillBoosts[p.id]) normalized.playerSkillBoosts[p.id] = {};
    normalized.trainingPlan[p.id] = safeIndividualTrainingType(normalized.trainingPlan[p.id]);
  });
  normalized.staffActions = normalized.staffActions || {};
  normalized.staffContracts = normalizeStaffContracts(normalized.staffContracts || {});
  normalized.academy = normalizeAcademyState(normalized.academy);
  if(normalized.staffActions.motivationalTalk && !Number.isFinite(normalized.staffActions.motivationalTalk.globalTurn)){
    normalized.staffActions.motivationalTalk.globalTurn = ((Math.max(1, normalized.staffActions.motivationalTalk.season || normalized.seasonNumber || 1) - 1) * 53) + Number(normalized.staffActions.motivationalTalk.matchdayIndex || 0);
  }
  normalized.stadium = normalized.stadium || createInitialStadiumState();
  normalized.fans = normalized.fans || createInitialFanState();
  ensureFanState(normalized);
  normalized.sponsors = normalizeSponsorState(normalized.sponsors);
  normalized.teamCohesion = normalized.teamCohesion || {};
  normalized.lastMatchTactics = normalized.lastMatchTactics || {};
  normalized.botRosterRepairLog = Array.isArray(normalized.botRosterRepairLog) ? normalized.botRosterRepairLog : [];
  normalized.botBalanceLog = Array.isArray(normalized.botBalanceLog) ? normalized.botBalanceLog : [];
  seed.clubs.forEach(c => { if(!Number.isFinite(normalized.teamCohesion[c.id])) normalized.teamCohesion[c.id] = TEAM_COHESION_START; });
  if(!normalized.stadium.fields) normalized.stadium.fields = {};
  if(!normalized.stadium.projects) normalized.stadium.projects = {};
  if(!normalized.stadium.ticketPrices) normalized.stadium.ticketPrices = {};
  seed.clubs.forEach(c => {
    if(!Number.isFinite(normalized.stadium.fields[c.id])) normalized.stadium.fields[c.id] = Number.isFinite(c.fieldConditionScore) ? c.fieldConditionScore : initialFieldScore(c);
    if(!Number.isFinite(Number(normalized.stadium.ticketPrices[c.id]))) normalized.stadium.ticketPrices[c.id] = TICKET_PRICE_INITIAL;
    normalized.stadium.ticketPrices[c.id] = clamp(Math.round(Number(normalized.stadium.ticketPrices[c.id])), TICKET_PRICE_MIN, TICKET_PRICE_MAX);
  });
  repairInvalidBotFieldStates(normalized, 'normalize_game', { message:true });
  Object.values(normalized.playerStats).forEach(stat => normalizePlayerStatRecord(stat));
  repairLegacySeasonStartAvailability(normalized);
  return normalized;
}

function ensurePlayerStateForAll(){
  if(!game) return;
  normalizeAllPlayerPositions();
  game.playerCondition = game.playerCondition || {};
  game.playerMorale = game.playerMorale || {};
  game.playerSkillBoosts = game.playerSkillBoosts || {};
  game.trainingPlan = game.trainingPlan || {};
  game.trainingSchedule = normalizeTrainingSchedule(game.trainingSchedule);
  game.playerStats = game.playerStats || {};
  seed.players.forEach(p => {
    ensurePlayerEconomics(p, p.youthFreeAgent ? FREE_YOUTH_SALARY_FACTOR : (p.freeAgent ? MARKET_FREE_AGENT_SALARY_FACTOR : 1));
    if(!Number.isFinite(game.playerCondition[p.id])) game.playerCondition[p.id] = p.freeAgent ? 15 + hashNumber(`free-cond-${p.id}`, 15) : 99;
    if(!Number.isFinite(game.playerMorale[p.id])) game.playerMorale[p.id] = p.freeAgent ? 35 + hashNumber(`free-morale-${p.id}`, 55) : PLAYER_MORALE_START;
    if(!game.playerSkillBoosts[p.id]) game.playerSkillBoosts[p.id] = {};
    game.trainingPlan[p.id] = safeIndividualTrainingType(game.trainingPlan[p.id]);
    if(!game.playerStats[p.id]) game.playerStats[p.id] = createEmptyPlayerStat(p);
    normalizePlayerStatRecord(game.playerStats[p.id]);
  });
}

function assignPlayerToStarterSlot(playerId, slotIndex){
  if(!canBeStarter(playerId)){
    showNotice('Los lesionados no pueden ser titulares. Los de recuperación menor a 70 días sólo pueden ir al banco.');
    return;
  }
  const player = playerById(playerId);
  const slot = (FORMATIONS[game?.tactic?.formation] || FORMATIONS['4-4-2'])[slotIndex];
  if(!canAssignPlayerToSlot(player, slot)){
    showNotice(slot === 'POR' ? 'El puesto de portero sólo acepta porteros.' : 'Los porteros sólo pueden ocupar el puesto de portero.');
    return;
  }
  game.tactic = applyStarterMentalities(normalizeTactic(game.selectedClubId, game.tactic));
  const starters = game.tactic.starters.slice(0,11);
  while(starters.length < 11) starters.push(0);
  let bench = game.tactic.bench.slice(0,10).filter(id => id !== playerId);
  const previousIndex = starters.indexOf(playerId);
  if(previousIndex >= 0) starters[previousIndex] = 0;
  const displaced = starters[slotIndex];
  starters[slotIndex] = playerId;
  if(displaced && displaced !== playerId && bench.length < 10) bench.push(displaced);
  game.tactic.starters = starters.slice(0,11);
  game.tactic.bench = bench.filter(Boolean).slice(0,10);
  game.tactic.autoSubs = (game.tactic.autoSubs || []).map(rule => ({...rule, outId:game.tactic.starters.includes(rule.outId)?rule.outId:0, inId:game.tactic.bench.includes(rule.inId)?rule.inId:0}));
  game.tactic = applyStarterMentalities(game.tactic);
  saveLocal(true);
  renderTactics();
}
function movePlayerToPool(playerId, pool){
  game.tactic = applyStarterMentalities(normalizeTactic(game.selectedClubId, game.tactic));
  const starters = game.tactic.starters.slice(0,11);
  while(starters.length < 11) starters.push(0);
  const idx = starters.indexOf(playerId);
  if(idx >= 0) starters[idx] = 0;
  game.tactic.starters = starters;
  game.tactic.bench = game.tactic.bench.filter(id => id !== playerId);
  if(pool === 'bench'){
    if(!canBeBench(playerId)){
      showNotice('Sólo se pueden convocar al banco jugadores disponibles o lesionados con recuperación menor a 70 días.');
    } else if(game.tactic.bench.length < 10) game.tactic.bench.push(playerId);
    else showNotice('El banco ya tiene 10 suplentes. El jugador quedó como reserva.');
  }
  game.tactic.autoSubs = (game.tactic.autoSubs || []).map(rule => ({...rule, outId:game.tactic.starters.includes(rule.outId)?rule.outId:0, inId:game.tactic.bench.includes(rule.inId)?rule.inId:0}));
  game.tactic = applyStarterMentalities(game.tactic);
  saveLocal(true);
  renderTactics();
}

function tacticLocationOfPlayer(playerId){
  game.tactic = normalizeTactic(game.selectedClubId, game.tactic);
  const id = Number(playerId || 0);
  const starterIndex = (game.tactic.starters || []).map(Number).indexOf(id);
  if(starterIndex >= 0) return { type:'starter', index:starterIndex, playerId:id };
  const benchIndex = (game.tactic.bench || []).map(Number).indexOf(id);
  if(benchIndex >= 0) return { type:'bench', index:benchIndex, playerId:id };
  return { type:'reserve', index:-1, playerId:id };
}
function tacticLocationLabel(location){
  if(!location) return '';
  if(location.type === 'starter') return `titular ${Number(location.index || 0) + 1}`;
  if(location.type === 'bench') return `suplente ${Number(location.index || 0) + 1}`;
  return 'reserva';
}
function targetSlotLabel(location){
  if(!location) return '';
  if(location.type === 'starter'){
    const slot = (FORMATIONS[game?.tactic?.formation] || FORMATIONS['4-4-2'])[location.index] || 'puesto';
    return `${slot} ${Number(location.index || 0) + 1}`;
  }
  return tacticLocationLabel(location);
}
function validateTacticPlacement(playerId, location){
  const id = Number(playerId || 0);
  if(!id || !location) return '';
  if(location.type === 'starter'){
    if(!canBeStarter(id)) return 'Los lesionados no pueden ser titulares. Los de recuperación menor a 70 días sólo pueden ir al banco.';
    const player = playerById(id);
    const slot = (FORMATIONS[game?.tactic?.formation] || FORMATIONS['4-4-2'])[location.index];
    if(!canAssignPlayerToSlot(player, slot)) return slot === 'POR' ? 'El puesto de portero sólo acepta porteros.' : 'Los porteros sólo pueden ocupar el puesto de portero.';
  }
  if(location.type === 'bench' && !canBeBench(id)) return 'Sólo se pueden convocar al banco jugadores disponibles o lesionados con recuperación menor a 70 días.';
  return '';
}
function setTacticPlayerAt(location, playerId){
  const id = Number(playerId || 0);
  if(location.type === 'starter'){
    while(game.tactic.starters.length < 11) game.tactic.starters.push(0);
    game.tactic.starters[location.index] = id;
  } else if(location.type === 'bench'){
    while(game.tactic.bench.length <= location.index) game.tactic.bench.push(0);
    game.tactic.bench[location.index] = id;
  }
}
function clearTacticLocation(location){
  if(!location) return;
  if(location.type === 'starter'){
    while(game.tactic.starters.length < 11) game.tactic.starters.push(0);
    game.tactic.starters[location.index] = 0;
  } else if(location.type === 'bench'){
    while(game.tactic.bench.length <= location.index) game.tactic.bench.push(0);
    game.tactic.bench[location.index] = 0;
  }
}
function removeTacticPlayer(playerId){
  const id = Number(playerId || 0);
  game.tactic.starters = (game.tactic.starters || []).map(current => Number(current) === id ? 0 : Number(current || 0)).slice(0,11);
  while(game.tactic.starters.length < 11) game.tactic.starters.push(0);
  game.tactic.bench = (game.tactic.bench || []).map(current => Number(current) === id ? 0 : Number(current || 0)).slice(0,10);
}
function cleanupTacticAfterClickSwap(){
  const starterIds = new Set((game.tactic.starters || []).map(Number).filter(Boolean));
  game.tactic.bench = (game.tactic.bench || [])
    .map(Number)
    .filter((id, index, arr) => id && !starterIds.has(id) && arr.indexOf(id) === index)
    .slice(0,10);
  game.tactic.autoSubs = (game.tactic.autoSubs || []).map(rule => ({
    ...rule,
    outId:game.tactic.starters.includes(Number(rule.outId)) ? Number(rule.outId) : 0,
    inId:game.tactic.bench.includes(Number(rule.inId)) ? Number(rule.inId) : 0
  }));
  game.tactic = applyStarterMentalities(game.tactic);
}
function swapTacticClickTargets(source, target){
  if(!game || !source || !target || !source.playerId) return false;
  game.tactic = applyStarterMentalities(normalizeTactic(game.selectedClubId, game.tactic));
  const sourcePlayerId = Number(source.playerId || 0);
  const targetPlayerId = Number(target.playerId || 0);
  if(sourcePlayerId && targetPlayerId && sourcePlayerId === targetPlayerId){
    tacticClickSelection = null;
    renderTactics();
    return false;
  }
  if(source.type === 'reserve' && target.type === 'reserve'){
    showNotice('Ambos jugadores ya están en reserva. Elegí un titular o suplente para intercambiarlos.');
    tacticClickSelection = null;
    renderTactics();
    return false;
  }
  const sourceCurrent = tacticLocationOfPlayer(sourcePlayerId);
  const targetCurrent = targetPlayerId ? tacticLocationOfPlayer(targetPlayerId) : target;
  const sourceError = validateTacticPlacement(sourcePlayerId, targetCurrent);
  if(sourceError){ showNotice(sourceError); return false; }
  const targetError = targetPlayerId ? validateTacticPlacement(targetPlayerId, sourceCurrent) : '';
  if(targetError){ showNotice(targetError); return false; }
  clearTacticLocation(sourceCurrent);
  clearTacticLocation(targetCurrent);
  setTacticPlayerAt(targetCurrent, sourcePlayerId);
  if(targetPlayerId) setTacticPlayerAt(sourceCurrent, targetPlayerId);
  cleanupTacticAfterClickSwap();
  saveLocal(true);
  const sourceName = playerLastName(playerById(sourcePlayerId)?.name || 'Jugador');
  const targetName = targetPlayerId ? playerLastName(playerById(targetPlayerId)?.name || 'jugador') : targetSlotLabel(targetCurrent);
  showNotice(`${sourceName} intercambió lugar con ${targetName}. Guardá la táctica para confirmar.`);
  tacticClickSelection = null;
  renderTactics();
  return true;
}
function normalizeTactic(clubId, tactic){
  const base = {...DEFAULT_TACTIC, ...(tactic || {})};
  const squad = playersByClub(clubId);
  const squadIds = new Set(squad.map(p => p.id));
  const rawStarters = Array.isArray(base.starters) ? base.starters.map(Number) : [];
  let starters = rawStarters.length >= 11
    ? rawStarters.slice(0,11).map(id => squadIds.has(id) ? id : 0)
    : autoSelectStarters(clubId, base).map(p => p.id);
  let bench = (base.bench || []).map(Number).filter(id => squadIds.has(id) && !starters.includes(id));
  if(bench.length !== 10){ bench = autoSelectBench(clubId, starters.filter(Boolean)).map(p => p.id); }
  let autoSubs = Array.isArray(base.autoSubs) ? base.autoSubs.slice(0,5) : [];
  autoSubs = autoSubs.map(rule => {
    const legacy = ['winning','losing','drawing'].includes(rule.trigger) ? 'best' : rule.trigger;
    return {
      outId: Number(rule.outId || 0),
      inId: Number(rule.inId || 0),
      trigger: SUB_TRIGGERS.some(t => t.value === legacy) ? legacy : 'tired'
    };
  }).filter(rule => starters.includes(rule.outId) && bench.includes(rule.inId));
  while(autoSubs.length < 5){ autoSubs.push({ outId:0, inId:0, trigger:'tired' }); }
  const matchInstructions = window.Simulator20?.normalizeMatchInstructions
    ? window.Simulator20.normalizeMatchInstructions(base.matchInstructions)
    : { winning:'normal', drawing:'normal', losing:'normal' };
  const normalized = { formation:base.formation, starters, bench, autoSubs, playerMentalities:{ ...(game?.playerMentalities || {}), ...(base.playerMentalities || {}) }, matchInstructions };
  return applyStarterMentalities(normalized);
}

function newGame(selectedClubId, options={}){
  const selectedClub = seed.clubs.find(c => Number(c.id) === Number(selectedClubId)) || {};
  if(!managerCanSelectClub(selectedClub, currentManagerPrestige())){
    showNotice(`Ese club requiere prestigio ${clubPrestigeValue(selectedClub)}. Tu prestigio actual es ${formatManagerPrestige(currentManagerPrestige())}.`);
    return;
  }
  const managerName = persistManagerName(options.managerName || storedManagerName());
  const tactic = normalizeTactic(selectedClubId, DEFAULT_TACTIC);
  game = {
    version:APP_VERSION,
    seedSignature:seed?.meta?.signature || '',
    selectedClubId,
    selectedCountry: options.country || clubCountry(selectedClub),
    selectedLeagueId: options.leagueId || selectedClub.divisionId || 'default',
    playerMentalities: {},
    saveCode: generateSaveCode(),
    rankingUploads: {},
    rankingManagerName: managerName,
    rankingLastUploadGameDate: '',
    seasonNumber: 1,
    seasonYear: seasonYearForNumber(1),
    calendarVersion: SEASON_CALENDAR_VERSION,
    seasonFinalized: false,
    seasonTransition: null,
    seasonPhase: 'preseason',
    phaseTurn: 0,
    globalTurn: 0,
    preseasonFriendliesPlayed: 0,
    pendingFriendlyOpponentId: 0,
    clubDivisionOverrides: {},
    managerStats: ensureManagerCurrentSeasonStats(createInitialManagerStats(), 1, selectedClubId),
    gameOver: null,
    messages: [],
    eventLog: [],
    playerStars: createInitialPlayerStarsState(),
    playerImpactWindows: {},
    special: typeof createInitialSpecialState === 'function' ? createInitialSpecialState(managerName) : null,
    marketPlayers: [],
    pendingTransfers: [],
    rejectedPurchaseOffers: {},
    lastOwnPlayerOffer: null,
    seasonEndPlayerOffers: null,
    specialClauseOffers: null,
    currentDate: firstAdvanceDateForSeason(seasonYearForNumber(1)),
    matchdayIndex: 0,
    tactic,
    standings: createInitialStandings(),
    playerStats: createInitialPlayerStats(),
    playerStatus: {},
    statusRebases: {},
    injuryRecoveryTurnsBySeason: {},
    matchHistory: [],
    fixtures: generateFixturesForDivisions(seed.clubs, divisionOrderList(), { seasonYear:seasonYearForNumber(1) }),
    advanceLockedUntil: 0,
    advanceLockDurationMs: ADVANCE_LOCK_MS,
    mustReviewTactics: false,
    lastOwnProblems: [],
    lastTurnSummary: null,
    clubBudgets: Object.fromEntries(seed.clubs.map(c => [c.id, Math.round(Number(c.budget || 0))])),
    budget: seed.clubs.find(c=>c.id===selectedClubId)?.budget || 0,
    seasonInitialBudget: seed.clubs.find(c=>c.id===selectedClubId)?.budget || 0,
    seasonBudgetStartBySeason: { 1: seed.clubs.find(c=>c.id===selectedClubId)?.budget || 0 },
    lastBudgetDelta: 0,
    budgetHistory: [],
    transferBudget: typeof createTransferBudgetState === 'function' ? createTransferBudgetState(selectedClubId, 1, 0) : null,
    nextSeasonTransferBudgetUnlock: null,
    playerCondition: Object.fromEntries(seed.players.map(p => [p.id, 99])),
    playerMorale: Object.fromEntries(seed.players.map(p => [p.id, PLAYER_MORALE_START])),
    playerSkillBoosts: Object.fromEntries(seed.players.map(p => [p.id, {}])),
    trainingPlan: Object.fromEntries(seed.players.map(p => [p.id, safeIndividualTrainingType(TRAINING_INDIVIDUAL_INITIAL)])),
    trainingSchedule: defaultTrainingSchedule(),
    staffActions: {},
    staffContracts: {},
    academy: createInitialAcademyState(),
    stadium: createInitialStadiumState(),
    fans: createInitialFanState(),
    sponsors: createInitialSponsorState(),
    teamCohesion: Object.fromEntries(seed.clubs.map(c => [c.id, TEAM_COHESION_START])),
    lastMatchTactics: {}
  };
  assignInitialBotFieldStates(selectedClubId);
  game.marketPlayers = generateMarketPlayers(MARKET_FREE_AGENT_COUNT);
  mergeMarketPlayersIntoSeed(game.marketPlayers);
  ensurePlayerStateForAll();
  repairBotRosters({ reason:'new_game' });
  generateOpeningSponsorOffers(true);
  pushGameMessage({ type:'system', title:'Bienvenido al club', body:'La temporada está por comenzar. Revisá táctica, mercado y mensajes antes del debut.', priority:'normal' });
  activeTab = 'home';
  closeModal();
  newGameModalShown = true;
  renderAll();
  showNotice('Carrera creada. Revisá táctica, titulares y mentalidades antes de avanzar.');
}

function createInitialStandings(){
  const obj = {};
  seed.clubs.forEach(c => obj[c.id] = { clubId:c.id, pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, dg:0, pts:0 });
  return obj;
}
function createEmptyPlayerStat(player){
  return {
    playerId:player.id,
    clubId:player.clubId,
    goals:0,
    assists:0,
    yellow:0,
    red:0,
    played:0,
    injuries:0,
    keySaves:0,
    errors:0,
    goalErrors:0
  };
}
function normalizePlayerStatRecord(stat){
  if(!stat) return stat;
  if(stat.injuries === undefined) stat.injuries = 0;
  if(stat.played === undefined) stat.played = 0;
  if(stat.yellow === undefined) stat.yellow = 0;
  if(stat.red === undefined) stat.red = 0;
  if(stat.keySaves === undefined) stat.keySaves = 0;
  if(stat.errors === undefined) stat.errors = 0;
  if(stat.goalErrors === undefined) stat.goalErrors = 0;
  return stat;
}
function createInitialPlayerStats(){
  const obj = {};
  seed.players.forEach(p => obj[p.id] = createEmptyPlayerStat(p));
  return obj;
}


function createInitialPlayerStarsState(){
  return { byPlayerId:{} };
}
function normalizePlayerStarsState(state){
  const src = state && typeof state === 'object' && !Array.isArray(state) ? state : {};
  const byPlayerId = src.byPlayerId && typeof src.byPlayerId === 'object' && !Array.isArray(src.byPlayerId) ? src.byPlayerId : src;
  const out = { byPlayerId:{} };
  Object.entries(byPlayerId || {}).forEach(([id, rec]) => {
    if(!rec || typeof rec !== 'object') return;
    const playerId = Number(rec.playerId || id);
    const clubId = Number(rec.clubId || 0);
    if(!Number.isFinite(playerId) || !Number.isFinite(clubId) || !playerId || !clubId) return;
    out.byPlayerId[playerId] = {
      playerId,
      clubId,
      type:String(rec.type || 'referencia'),
      reason:String(rec.reason || ''),
      earnedSeason:Number(rec.earnedSeason || rec.season || game?.seasonNumber || 1),
      earnedTurn:Number(rec.earnedTurn || rec.turn || 0),
      earnedDate:rec.earnedDate || rec.date || '',
      locked:true
    };
  });
  return out;
}
function normalizePlayerImpactWindows(windows){
  const src = windows && typeof windows === 'object' && !Array.isArray(windows) ? windows : {};
  const out = {};
  Object.entries(src).forEach(([id, list]) => {
    const playerId = Number(id);
    if(!Number.isFinite(playerId) || !Array.isArray(list)) return;
    out[playerId] = list
      .filter(item => item && typeof item === 'object')
      .map(item => ({
        matchId:String(item.matchId || ''),
        season:Number(item.season || 0),
        clubId:Number(item.clubId || 0),
        goals:Number(item.goals || 0),
        assists:Number(item.assists || 0),
        keySaves:Number(item.keySaves || 0),
        played:Boolean(item.played !== false)
      }))
      .filter(item => item.clubId > 0)
      .slice(-PLAYER_STARS_WINDOW_MATCHES);
  });
  return out;
}
function syncPlayerStarsWithClubs(targetGame=game){
  if(!targetGame) return 0;
  targetGame.playerStars = normalizePlayerStarsState(targetGame.playerStars || {});
  targetGame.playerImpactWindows = normalizePlayerImpactWindows(targetGame.playerImpactWindows || {});
  let removed = 0;
  Object.entries(targetGame.playerStars.byPlayerId).forEach(([id, rec]) => {
    const player = seed?.players?.find(p => Number(p.id) === Number(id));
    if(!player || Number(player.clubId || 0) !== Number(rec.clubId || 0)){
      delete targetGame.playerStars.byPlayerId[id];
      if(targetGame.playerImpactWindows) delete targetGame.playerImpactWindows[id];
      removed++;
    }
  });
  return removed;
}
function playerStarRecord(playerOrId){
  if(!game) return null;
  syncPlayerStarsWithClubs(game);
  const id = Number(typeof playerOrId === 'object' ? playerOrId?.id : playerOrId);
  const player = typeof playerOrId === 'object' ? playerOrId : playerById(id);
  const rec = game.playerStars?.byPlayerId?.[id];
  if(!rec || !player || Number(player.clubId || 0) !== Number(rec.clubId || 0)) return null;
  return rec;
}
function playerStarLabel(type){
  const map = { goleador:'Referencia goleadora', arquero:'Arquero decisivo', asistidor:'Cerebro asistidor', referencia:'Jugador referencia' };
  return map[String(type || '')] || 'Jugador referencia';
}
function playerStarMarkup(playerOrId){
  const rec = playerStarRecord(playerOrId);
  if(!rec) return '';
  return `<span class="player-star" title="${escapeHtml(playerStarLabel(rec.type))}">★</span>`;
}
function isTransferListedPlayer(playerOrId){
  const player = typeof playerOrId === 'object' ? playerOrId : playerById(playerOrId);
  return Boolean(player?.transferListed);
}
function transferListedMarkup(playerOrId){
  return isTransferListedPlayer(playerOrId) ? '<span class="transfer-listed-badge" title="Jugador transferible">EN VENTA</span>' : '';
}
function playerNameWithStar(player){
  return `${playerStarMarkup(player)}${escapeHtml(player?.name || 'Jugador')}${transferListedMarkup(player)}`;
}
function playerStarReferenceMultiplier(player, action='general'){
  const rec = playerStarRecord(player);
  if(!rec) return 1;
  const type = String(rec.type || 'referencia');
  const kind = String(action || 'general');
  let multiplier = 1 + PLAYER_STAR_REFERENCE_BONUS;
  if((type === 'goleador' && kind === 'goal') || (type === 'arquero' && kind === 'save') || (type === 'asistidor' && kind === 'assist')){
    multiplier += PLAYER_STAR_REFERENCE_BONUS * 0.35;
  }
  return clamp(multiplier, 1, 3);
}
function activeStarsForClub(clubId, targetGame=game){
  if(!targetGame) return [];
  syncPlayerStarsWithClubs(targetGame);
  return Object.values(targetGame.playerStars?.byPlayerId || {}).filter(rec => Number(rec.clubId || 0) === Number(clubId || 0));
}
function compactStarReason(type, metrics){
  if(type === 'arquero') return `${metrics.keySaveMatches}/${PLAYER_STARS_WINDOW_MATCHES} partidos con tapada clave`;
  if(type === 'asistidor') return `${metrics.assists}/${PLAYER_STARS_WINDOW_MATCHES} asistencias recientes`;
  if(type === 'goleador') return `${metrics.goalMatches}/${PLAYER_STARS_WINDOW_MATCHES} partidos convirtiendo`;
  return 'Rendimiento destacado';
}
function evaluatePlayerStarEligibility(player, window){
  if(!player || !Array.isArray(window) || !window.length) return null;
  const recent = window.slice(-PLAYER_STARS_WINDOW_MATCHES).filter(item => Number(item.clubId || 0) === Number(player.clubId || 0));
  const metrics = {
    goalMatches:recent.filter(item => Number(item.goals || 0) > 0).length,
    keySaveMatches:recent.filter(item => Number(item.keySaves || 0) > 0).length,
    assists:recent.reduce((sum, item) => sum + Number(item.assists || 0), 0)
  };
  const group = playerRoleGroup(player.position);
  if(String(player.position || '').toUpperCase() === 'POR' && metrics.keySaveMatches >= PLAYER_STAR_KEY_SAVE_MATCHES_REQUIRED){
    return { type:'arquero', metrics };
  }
  if(group === 'MID' && metrics.assists >= PLAYER_STAR_MID_ASSISTS_REQUIRED){
    return { type:'asistidor', metrics };
  }
  if(String(player.position || '').toUpperCase() !== 'POR' && metrics.goalMatches >= PLAYER_STAR_GOAL_MATCHES_REQUIRED){
    return { type:'goleador', metrics };
  }
  return null;
}
function awardPlayerStar(player, eligibility){
  if(!game || !player || !eligibility) return false;
  syncPlayerStarsWithClubs(game);
  const clubId = Number(player.clubId || 0);
  if(!clubId) return false;
  if(game.playerStars?.byPlayerId?.[player.id]) return false;
  if(activeStarsForClub(clubId).length >= PLAYER_STARS_MAX_PER_CLUB) return false;
  const reason = compactStarReason(eligibility.type, eligibility.metrics || {});
  game.playerStars.byPlayerId[player.id] = {
    playerId:Number(player.id),
    clubId,
    type:eligibility.type,
    reason,
    earnedSeason:Number(game.seasonNumber || 1),
    earnedTurn:currentTurnIndex(),
    earnedDate:game.currentDate || '',
    locked:true
  };
  if(clubId === Number(game.selectedClubId)){
    pushGameMessage({
      type:'deportivo',
      priority:'high',
      title:`${player.name} ganó una estrella`,
      body:`${player.name} se convirtió en ${playerStarLabel(eligibility.type).toLowerCase()} del equipo. Motivo: ${reason}. Mientras siga en el club tendrá más peso como referencia del simulador.`
    });
  }
  return true;
}
function updatePlayerStarTrackingForMatch(result){
  if(!game || !result || result.friendly) return;
  syncPlayerStarsWithClubs(game);
  game.playerImpactWindows = normalizePlayerImpactWindows(game.playerImpactWindows || {});
  const goalStats = {};
  (result.goals || []).forEach(goal => {
    const scorerId = Number(goal.playerId || 0);
    const assistId = Number(goal.assistId || 0);
    if(scorerId){ goalStats[scorerId] = goalStats[scorerId] || { goals:0, assists:0 }; goalStats[scorerId].goals += 1; }
    if(assistId){ goalStats[assistId] = goalStats[assistId] || { goals:0, assists:0 }; goalStats[assistId].assists += 1; }
  });
  const saveStats = {};
  (result.keySaves || []).forEach(save => {
    const id = Number(save.playerId || 0);
    if(!id) return;
    saveStats[id] = (saveStats[id] || 0) + 1;
  });
  const playersBySide = [
    { clubId:Number(result.homeId || 0), ids:result.playedIdsHome || result.starterIdsHome || [] },
    { clubId:Number(result.awayId || 0), ids:result.playedIdsAway || result.starterIdsAway || [] }
  ];
  playersBySide.forEach(side => {
    [...new Set((side.ids || []).map(Number).filter(Boolean))].forEach(id => {
      const player = playerById(id);
      if(!player || Number(player.clubId || 0) !== side.clubId) return;
      const key = String(id);
      const previous = (game.playerImpactWindows[key] || []).filter(item => Number(item.clubId || 0) === side.clubId);
      previous.push({
        matchId:String(result.id || `${game.seasonNumber || 1}-${game.matchdayIndex || 0}`),
        season:Number(game.seasonNumber || 1),
        clubId:side.clubId,
        goals:Number(goalStats[id]?.goals || 0),
        assists:Number(goalStats[id]?.assists || 0),
        keySaves:Number(saveStats[id] || 0),
        played:true
      });
      game.playerImpactWindows[key] = previous.slice(-PLAYER_STARS_WINDOW_MATCHES);
      const eligibility = evaluatePlayerStarEligibility(player, game.playerImpactWindows[key]);
      if(eligibility) awardPlayerStar(player, eligibility);
    });
  });
}

function createInitialManagerStats(){
  return {
    totals:{ played:0, won:0, drawn:0, lost:0, gf:0, gc:0 },
    currentSeason:{ season:1, clubId:0, played:0, won:0, drawn:0, lost:0, gf:0, gc:0 },
    seasons:[],
    titles:0,
    experience:0,
    prestige:0,
    prestigeWinMilestones:0,
    prestigeAdjustments:[],
    objectivePrestigeAwards:[],
    careerHistory:[]
  };
}
function normalizeManagerStats(stats){
  const base = createInitialManagerStats();
  const src = stats || {};
  const totals = { ...base.totals, ...(src.totals || {}) };
  Object.keys(totals).forEach(key => { totals[key] = Number.isFinite(Number(totals[key])) ? Number(totals[key]) : 0; });
  const currentRaw = src.currentSeason && typeof src.currentSeason === 'object' ? src.currentSeason : {};
  const currentSeason = { ...base.currentSeason, ...currentRaw };
  Object.keys(currentSeason).forEach(key => { currentSeason[key] = Number.isFinite(Number(currentSeason[key])) ? Number(currentSeason[key]) : 0; });
  const prestigeWinMilestones = Math.max(0, Math.round(Number(src.prestigeWinMilestones || 0)));
  const experience = Math.max(0, Math.round(Number(src.experience || 0)));
  const prestigeAdjustments = Array.isArray(src.prestigeAdjustments) ? src.prestigeAdjustments : [];
  const normalized = {
    totals,
    currentSeason,
    seasons:Array.isArray(src.seasons) ? src.seasons : [],
    titles:Number.isFinite(Number(src.titles)) ? Number(src.titles) : (Array.isArray(src.seasons) ? src.seasons.filter(s => s.position === 1).length : 0),
    experience,
    prestige:0,
    prestigeWinMilestones,
    prestigeAdjustments,
    objectivePrestigeAwards:Array.isArray(src.objectivePrestigeAwards) ? src.objectivePrestigeAwards : [],
    careerHistory:Array.isArray(src.careerHistory) ? src.careerHistory : []
  };
  normalized.prestige = managerPrestigeBreakdown(normalized).total;
  return normalized;
}
function addManagerPrestige(points, reason=''){
  if(!game?.managerStats || Number(points || 0) === 0) return 0;
  game.managerStats = normalizeManagerStats(game.managerStats);
  game.managerStats.prestigeAdjustments = Array.isArray(game.managerStats.prestigeAdjustments) ? game.managerStats.prestigeAdjustments : [];
  game.managerStats.prestigeAdjustments.push({ points:Number(points || 0), reason:String(reason || 'Ajuste de prestigio'), season:Number(game.seasonNumber || 1), clubId:Number(game.selectedClubId || 0), createdAt:new Date().toISOString() });
  game.managerStats = normalizeManagerStats(game.managerStats);
  const total = formatManagerPrestige(game.managerStats.prestige);
  if(reason){
    pushGameMessage({ type:'directiva', priority:Number(points || 0) > 0 ? 'normal' : 'high', title:Number(points || 0) > 0 ? 'Prestigio de manager aumentado' : 'Prestigio de manager reducido', body:`${reason}. Prestigio actual: ${total}.`, id:`manager-prestige-${game.seasonNumber || 1}-${game.globalTurn || 0}-${reason}` });
  }
  return Number(points || 0);
}
function updateManagerPrestigeFromWins(){
  if(!game?.managerStats) return 0;
  game.managerStats = normalizeManagerStats(game.managerStats);
  const wins = Math.max(0, Math.round(Number(game.managerStats.totals?.won || 0)));
  const step = Math.max(1, Number(MANAGER_PRESTIGE_WINS_STEP || 10));
  const milestones = Math.floor(wins / step);
  const current = Math.max(0, Math.round(Number(game.managerStats.prestigeWinMilestones || 0)));
  if(milestones <= current) return 0;
  const diff = milestones - current;
  game.managerStats.prestigeWinMilestones = milestones;
  pushGameMessage({ type:'directiva', priority:'normal', title:'Prestigio por victorias', body:`${wins} victorias acumuladas. Las victorias suman ${diff} punto(s) de prestigio por carrera. Prestigio actual: ${formatManagerPrestige(currentManagerPrestige())}.`, id:`manager-win-prestige-${game.seasonNumber || 1}-${game.globalTurn || 0}-${wins}` });
  return diff;
}
function emptyManagerSeasonStats(season=game?.seasonNumber || 1, clubId=game?.selectedClubId || 0){
  return { season:Number(season || 1), clubId:Number(clubId || 0), played:0, won:0, drawn:0, lost:0, gf:0, gc:0 };
}
function managerObjectiveForClubDivision(clubId){
  if(Number.isFinite(Number(MANAGER_OBJECTIVE_PPG)) && Number(MANAGER_OBJECTIVE_PPG) >= 0.3 && Number(MANAGER_OBJECTIVE_PPG) <= 2) return Number(MANAGER_OBJECTIVE_PPG);
  const division = clubDivision(clubId || game?.selectedClubId);
  const order = Math.round(Number(division?.order || 3));
  if(order <= 1) return Number(MANAGER_OBJECTIVE_DIVISION_1 || 1.4);
  if(order === 2) return Number(MANAGER_OBJECTIVE_DIVISION_2 || 1.1);
  return Number(MANAGER_OBJECTIVE_DIVISION_3 || 0.9);
}
function buildManagerObjectiveSeasonFields(stats, season=game?.seasonNumber || 1, clubId=game?.selectedClubId || 0){
  const normalized = normalizeManagerStats(stats);
  const generalPpg = ppgFromTotals(normalized.totals || {});
  const objective = managerObjectiveForClubDivision(clubId);
  const baseMatches = Number(MANAGER_OBJECTIVE_MIN_MATCHES || 5);
  const extraMatches = managerObjectiveExtraMatches(generalPpg);
  return {
    objectivePpg:Number.isFinite(objective) ? objective : null,
    objectiveBaseMatches:baseMatches,
    objectiveExtraMatches:extraMatches,
    objectiveMinMatches:baseMatches + extraMatches,
    objectiveGeneralPpgAtStart:generalPpg,
    objectiveSeason:Number(season || 1),
    objectiveClubId:Number(clubId || 0)
  };
}
function applyManagerObjectiveSeasonFields(current, stats, season=game?.seasonNumber || 1, clubId=game?.selectedClubId || 0){
  const clean = { ...(current || {}) };
  const needsRefresh = !MANAGER_OBJECTIVE_FREEZE_BY_SEASON
    || !Number.isFinite(Number(clean.objectiveMinMatches || 0))
    || !Number.isFinite(Number(clean.objectivePpg || 0))
    || Number(clean.objectiveSeason || 0) !== Number(season || 1)
    || Number(clean.objectiveClubId || 0) !== Number(clubId || 0);
  if(needsRefresh){
    Object.assign(clean, buildManagerObjectiveSeasonFields(stats, season, clubId));
  }
  return clean;
}
function ensureManagerCurrentSeasonStats(stats, season=game?.seasonNumber || 1, clubId=game?.selectedClubId || 0){
  const normalized = normalizeManagerStats(stats);
  const current = normalized.currentSeason || {};
  if(Number(current.season || 0) !== Number(season || 1) || Number(current.clubId || 0) !== Number(clubId || 0)){
    normalized.currentSeason = applyManagerObjectiveSeasonFields(emptyManagerSeasonStats(season, clubId), normalized, season, clubId);
  } else {
    normalized.currentSeason = applyManagerObjectiveSeasonFields(current, normalized, season, clubId);
  }
  return normalized;
}
function normalizeGameOverState(state){
  if(!state || typeof state !== 'object') return null;
  const active = Boolean(state.active);
  if(!active) return null;
  return {
    active:true,
    type:String(state.type || 'dismissal'),
    reason:String(state.reason || 'Objetivo deportivo no cumplido'),
    triggeredAt:state.triggeredAt || new Date().toISOString(),
    objective:Number(state.objective || 0),
    ppg:Number(state.ppg || 0),
    matches:Number(state.matches || 0),
    snapshot:state.snapshot && typeof state.snapshot === 'object' ? state.snapshot : null
  };
}
function managerObjectiveForCurrentDivision(){
  return managerObjectiveForClubDivision(game?.selectedClubId);
}
function managerObjectiveIsActive(){
  const objective = managerObjectiveForCurrentDivision();
  return Number.isFinite(objective) && objective >= 0.3 && objective <= 2;
}
function managerOfficialTotals(){
  return normalizeManagerStats(game?.managerStats).totals;
}
function managerSeasonObjectiveTotals(){
  game.managerStats = ensureManagerCurrentSeasonStats(game?.managerStats, game?.seasonNumber || 1, game?.selectedClubId || 0);
  return game.managerStats.currentSeason || emptyManagerSeasonStats(game?.seasonNumber || 1, game?.selectedClubId || 0);
}
function ppgFromTotals(totals){
  const played = Number(totals?.played || 0);
  const points = (Number(totals?.won || 0) * 3) + Number(totals?.drawn || 0);
  return played > 0 ? points / played : 0;
}
function managerGeneralPPG(){
  return ppgFromTotals(managerOfficialTotals());
}
function managerCurrentPPG(){
  return ppgFromTotals(managerSeasonObjectiveTotals());
}
function managerObjectiveExtraMatches(generalPpg=managerGeneralPPG()){
  if(generalPpg > 1.9) return MANAGER_OBJECTIVE_EXTRA_190;
  if(generalPpg > 1.5) return MANAGER_OBJECTIVE_EXTRA_150;
  if(generalPpg > 1.2) return MANAGER_OBJECTIVE_EXTRA_120;
  return 0;
}
function managerObjectiveProgressInfo(){
  const seasonTotals = managerSeasonObjectiveTotals();
  const played = Number(seasonTotals.played || 0);
  const ppg = managerCurrentPPG();
  const objective = managerObjectiveIsActive() ? Number(seasonTotals.objectivePpg ?? managerObjectiveForCurrentDivision()) : null;
  const baseMinMatches = Math.max(1, Number(seasonTotals.objectiveBaseMatches || MANAGER_OBJECTIVE_MIN_MATCHES || 5));
  const extraMatches = Math.max(0, Number(seasonTotals.objectiveExtraMatches || 0));
  const minMatches = Math.max(baseMinMatches, Number(seasonTotals.objectiveMinMatches || (baseMinMatches + extraMatches)));
  const generalPpg = Number.isFinite(Number(seasonTotals.objectiveGeneralPpgAtStart)) ? Number(seasonTotals.objectiveGeneralPpgAtStart) : managerGeneralPPG();
  const confidence = objective ? clamp((ppg / objective) * 100, 0, 140) : 0;
  return {
    active:objective !== null,
    objective,
    baseMinMatches,
    extraMatches,
    minMatches,
    played,
    ppg,
    generalPpg,
    progress:confidence,
    confidence,
    remainingMatches:Math.max(0, minMatches - played),
    failed:objective !== null && played >= minMatches && ppg <= objective
  };
}
function gameOverSnapshot(){
  if(typeof buildRankingPayload === 'function'){
    const payload = buildRankingPayload(game?.rankingManagerName || storedManagerName() || 'Manager');
    if(payload) return payload;
  }
  const totals = managerOfficialTotals();
  const division = clubDivision(game?.selectedClubId);
  const table = sortedStandings(division.id);
  const index = table.findIndex(row => Number(row.clubId) === Number(game?.selectedClubId));
  const row = table[index] || game?.standings?.[game?.selectedClubId] || {};
  return {
    managerName:game?.rankingManagerName || storedManagerName() || 'Manager',
    club:clubName(game?.selectedClubId),
    season:Number(game?.seasonNumber || 1),
    division:division.name,
    position:index >= 0 ? index + 1 : 0,
    points:Number(row.pts || 0),
    won:Number(totals.won || 0),
    drawn:Number(totals.drawn || 0),
    lost:Number(totals.lost || 0),
    goalsFor:Number(totals.gf || 0),
    goalsAgainst:Number(totals.gc || 0),
    goalDifference:Number(totals.gf || 0) - Number(totals.gc || 0),
    finalBudget:Number(game?.budget || 0),
    titles:Number(game?.managerStats?.titles || 0),
    managerScore:0,
    saveCode:game?.saveCode || ''
  };
}
function checkManagerObjectiveGameOver(){
  if(!game || game.gameOver?.active || !managerObjectiveIsActive()) return false;
  const info = managerObjectiveProgressInfo();
  if(!info.failed) return false;
  game.gameOver = {
    active:true,
    type:'dismissal',
    reason:`La directiva perdió confianza: promedio ${info.ppg.toFixed(2)} / objetivo ${info.objective.toFixed(2)} tras ${info.played} partidos oficiales de la temporada.`,
    triggeredAt:new Date().toISOString(),
    objective:info.objective,
    ppg:info.ppg,
    matches:info.played,
    snapshot:gameOverSnapshot()
  };
  game.mustReviewTactics = false;
  activeTab = 'home';
  recordDismissedCareerStep();
  pushGameMessage({ type:'directiva', priority:'high', title:'Despido del manager', body:`La directiva decidió terminar el ciclo por falta de resultados y pérdida de confianza. El despido resta ${MANAGER_PRESTIGE_DISMISSAL_PENALTY} puntos de prestigio. Podés buscar otro club sin reiniciar el mundo de la partida.`, id:`dismissal-${game.seasonNumber || 1}-${game.selectedClubId}-${info.played}` });
  return true;
}
function ensureClubBudgetsState(){
  if(!game) return {};
  game.clubBudgets = (game.clubBudgets && typeof game.clubBudgets === 'object' && !Array.isArray(game.clubBudgets)) ? game.clubBudgets : {};
  seed.clubs.forEach(c => { if(!Number.isFinite(Number(game.clubBudgets[c.id]))) game.clubBudgets[c.id] = Math.round(Number(c.budget || 0)); });
  if(Number.isFinite(Number(game.selectedClubId))) game.clubBudgets[game.selectedClubId] = Math.round(Number(game.budget || game.clubBudgets[game.selectedClubId] || 0));
  return game.clubBudgets;
}
function budgetForCareerClub(clubId){
  ensureClubBudgetsState();
  return Math.max(0, Math.round(Number(game?.clubBudgets?.[clubId] ?? seed.clubs.find(c => Number(c.id) === Number(clubId))?.budget ?? 0)));
}
function recordDismissedCareerStep(){
  if(!game?.managerStats || !game?.gameOver?.active) return;
  game.managerStats = normalizeManagerStats(game.managerStats);
  const eventType = game.gameOver.type === 'resignation' ? 'resignation' : 'dismissal';
  const key = `${game.gameOver.triggeredAt || ''}-${game.selectedClubId}-${eventType}`;
  if(game.managerStats.careerHistory.some(item => item.key === key)) return;
  const division = clubDivision(game.selectedClubId);
  const table = sortedStandings(division.id);
  const position = table.findIndex(row => Number(row.clubId) === Number(game.selectedClubId)) + 1;
  const season = managerSeasonObjectiveTotals();
  game.managerStats.careerHistory.push({
    key,
    type:eventType,
    season:Number(game.seasonNumber || 1),
    clubId:Number(game.selectedClubId || 0),
    clubName:clubName(game.selectedClubId),
    divisionName:division.name,
    position:position || 0,
    played:Number(season.played || 0),
    won:Number(season.won || 0),
    drawn:Number(season.drawn || 0),
    lost:Number(season.lost || 0),
    ppg:ppgFromTotals(season),
    reason:game.gameOver.reason || (eventType === 'resignation' ? 'Renuncia del manager' : 'Despido por objetivo no cumplido'),
    date:game.currentDate || '',
    createdAt:new Date().toISOString()
  });
  game.managerStats = normalizeManagerStats(game.managerStats);
}
function resignCurrentClub(){
  if(!game || game.gameOver?.active) return;
  const ok = window.confirm('Vas a renunciar al club actual. La partida no se reinicia, pero quedarás sin cargo hasta buscar otro club.');
  if(!ok) return;
  game.gameOver = {
    active:true,
    type:'resignation',
    reason:'Renunciaste al cargo. Podés buscar otro club disponible según tu prestigio.',
    triggeredAt:new Date().toISOString(),
    objective:managerObjectiveForCurrentDivision(),
    ppg:managerCurrentPPG(),
    matches:Number(managerSeasonObjectiveTotals().played || 0),
    snapshot:gameOverSnapshot()
  };
  game.mustReviewTactics = false;
  recordDismissedCareerStep();
  activeTab = 'home';
  pushGameMessage({ type:'directiva', priority:'high', title:'Renuncia del manager', body:'Presentaste la renuncia. El mundo de la partida sigue activo y podés buscar otro club.', id:`resignation-${game.seasonNumber || 1}-${game.selectedClubId}-${game.globalTurn || 0}` });
  saveLocal(true);
  renderAll();
  showNotice('Renuncia registrada. Usá Buscar club para continuar tu carrera.');
}
function continueCareerAtClub(selectedClubId, options={}){
  if(!game?.gameOver?.active){ showNotice('Sólo podés buscar otro club cuando estás sin cargo.'); return; }
  const newClub = seed.clubs.find(c => Number(c.id) === Number(selectedClubId));
  if(!newClub){ showNotice('Club no encontrado.'); return; }
  const rehireBlock = managerClubRehireBlockInfo(newClub);
  if(rehireBlock.blocked){
    const cause = rehireBlock.type === 'resignation' ? 'renuncia' : 'despido';
    showNotice(`${newClub.name} no acepta tu regreso todavía: bloqueo por ${cause} hasta la temporada ${rehireBlock.untilSeason}.`);
    return;
  }
  if(!managerCanSelectClub(newClub, currentManagerPrestige())){
    showNotice(`Ese club requiere prestigio ${clubPrestigeValue(newClub)}. Tu prestigio actual es ${formatManagerPrestige(currentManagerPrestige())}.`);
    return;
  }
  ensureClubBudgetsState();
  recordDismissedCareerStep();
  game.clubBudgets[game.selectedClubId] = Math.round(Number(game.budget || 0));
  game.selectedClubId = Number(newClub.id);
  game.selectedCountry = clubCountry(newClub);
  game.selectedLeagueId = newClub.divisionId || 'default';
  game.budget = budgetForCareerClub(newClub.id);
  game.seasonInitialBudget = Math.round(Number(game.budget || 0));
  game.lastBudgetDelta = 0;
  game.tactic = normalizeTactic(newClub.id, DEFAULT_TACTIC);
  game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber || 1, newClub.id);
  game.transferBudget = typeof createTransferBudgetState === 'function' ? createTransferBudgetState(newClub.id, game.seasonNumber || 1, 0) : game.transferBudget;
  game.gameOver = null;
  game.mustReviewTactics = true;
  activeTab = 'home';
  closeModal();
  pushGameMessage({ type:'directiva', priority:'high', title:'Nuevo cargo aceptado', body:`Firmaste con ${newClub.name}. La partida continúa desde la misma temporada.`, id:`new-job-${game.seasonNumber || 1}-${newClub.id}-${game.globalTurn || 0}` });
  saveLocal(true);
  renderAll();
  showNotice(`Contrato firmado con ${newClub.name}. La carrera continúa desde la misma partida. Revisá la táctica antes de avanzar.`);
}
function updateManagerMatchStats(match){
  if(match?.friendly) return;
  game.managerStats = normalizeManagerStats(game.managerStats);
  const isHome = match.homeId === game.selectedClubId;
  const gf = isHome ? match.homeGoals : match.awayGoals;
  const gc = isHome ? match.awayGoals : match.homeGoals;
  const totals = game.managerStats.totals;
  const seasonTotals = game.managerStats.currentSeason || emptyManagerSeasonStats(game.seasonNumber || 1, game.selectedClubId || 0);
  totals.played += 1;
  totals.gf += gf;
  totals.gc += gc;
  seasonTotals.played += 1;
  seasonTotals.gf += gf;
  seasonTotals.gc += gc;
  let xpGain = MANAGER_XP_DRAW;
  if(gf > gc){ totals.won += 1; seasonTotals.won += 1; xpGain = MANAGER_XP_WIN; }
  else if(gf < gc){ totals.lost += 1; seasonTotals.lost += 1; xpGain = MANAGER_XP_LOSS; }
  else { totals.drawn += 1; seasonTotals.drawn += 1; xpGain = MANAGER_XP_DRAW; }
  game.managerStats.experience = Math.max(0, Math.round(Number(game.managerStats.experience || 0))) + Math.max(0, Math.round(Number(xpGain || 0)));
  game.managerStats.currentSeason = seasonTotals;
  updateManagerPrestigeFromWins();
  if(typeof updateTransferBudgetPerformanceUnlocks === 'function') updateTransferBudgetPerformanceUnlocks();
  checkManagerObjectiveGameOver();
}
function divisionOrderList(){
  return (seed.divisions || [{ id:'default', name:'Liga única', order:1 }]).slice().sort((a,b)=>(a.order || 0)-(b.order || 0));
}
function clubDivision(clubId){
  const club = seed.clubs.find(c=>c.id===Number(clubId));
  return club ? { id:club.divisionId || 'default', name:club.divisionName || 'Liga única', order:club.divisionOrder || 1 } : { id:'default', name:'Liga única', order:1 };
}
function applyClubDivisionOverrides(overrides={}){
  if(!seed?.clubs) return;
  const divisions = divisionOrderList();
  const byId = Object.fromEntries(divisions.map(d => [d.id, d]));
  seed.clubs.forEach(club => {
    const override = overrides[club.id];
    if(!override) return;
    const division = byId[override.divisionId] || divisions.find(d => d.name === override.divisionName);
    if(!division) return;
    club.divisionId = division.id;
    club.divisionName = division.name;
    club.divisionOrder = division.order;
    club.prizeMultiplier = division.prizeMultiplier ?? divisionPrizeMultiplier(division.name, (division.order || 1)-1);
  });
}
function snapshotClubDivisionOverrides(){
  return Object.fromEntries(seed.clubs.map(c => [c.id, { divisionId:c.divisionId || 'default', divisionName:c.divisionName || 'Liga única' }]));
}
function computeSeasonMovements(){
  const divisions = divisionOrderList();
  const movements = [];
  for(let i=1; i<divisions.length; i++){
    const upper = divisions[i-1];
    const lower = divisions[i];
    const lowerTable = sortedStandings(lower.id);
    const upperTable = sortedStandings(upper.id);
    const lowerChampion = lowerTable[0];
    const upperLast = upperTable[upperTable.length - 1];
    if(lowerChampion){
      movements.push({ type:'promotion', clubId:lowerChampion.clubId, fromDivisionId:lower.id, fromDivisionName:lower.name, toDivisionId:upper.id, toDivisionName:upper.name });
    }
    if(upperLast){
      movements.push({ type:'relegation', clubId:upperLast.clubId, fromDivisionId:upper.id, fromDivisionName:upper.name, toDivisionId:lower.id, toDivisionName:lower.name });
    }
  }
  return movements;
}
function decayTrainedSkillBoosts(){
  if(!game?.playerSkillBoosts) return { players:0, lost:0, remaining:0 };
  let players = 0;
  let lost = 0;
  let remaining = 0;
  Object.entries(game.playerSkillBoosts).forEach(([playerId, boosts]) => {
    if(!boosts || typeof boosts !== 'object') return;
    let affected = false;
    Object.keys(boosts).forEach(skill => {
      const oldValue = Math.max(0, Math.round(Number(boosts[skill]) || 0));
      if(oldValue <= 0){ delete boosts[skill]; return; }
      const nextValue = Math.max(0, Math.round(oldValue * 0.40));
      lost += Math.max(0, oldValue - nextValue);
      remaining += nextValue;
      affected = true;
      if(nextValue > 0) boosts[skill] = nextValue;
      else delete boosts[skill];
    });
    if(affected) players += 1;
    if(Object.keys(boosts).length === 0) delete game.playerSkillBoosts[playerId];
  });
  return { players, lost, remaining };
}
function applySeasonalAging(){
  if(!game) return 0;
  let count = 0;
  seed.players.forEach(player => {
    player.age = Math.max(15, Number(player.age || 18) + 1);
    count += 1;
  });
  return count;
}

function applySeasonSalaryAdjustments(){
  if(!game?.playerStats || !seed?.players) return { players:0, increased:0, decreased:0, totalDelta:0, details:[] };
  let players = 0;
  let increased = 0;
  let decreased = 0;
  let totalDelta = 0;
  const details = [];
  seed.players.forEach(player => {
    if(!player || Number(player.clubId || 0) <= 0 || player.sold) return;
    const oldSalary = Math.max(0, Math.round(Number(player.salary || 0)));
    if(oldSalary <= 0) return;
    const played = Math.max(0, Math.round(Number(game.playerStats[player.id]?.played || 0)));
    const pct = (played * SEASON_SALARY_MATCH_BONUS) - SEASON_SALARY_BASE_REDUCTION;
    const nextSalary = Math.max(0, Math.round(oldSalary * (1 + pct)));
    const delta = nextSalary - oldSalary;
    player.salary = nextSalary;
    refreshPlayerClause(player);
    players += 1;
    totalDelta += delta;
    if(delta > 0) increased += 1;
    if(delta < 0) decreased += 1;
    if(Number(player.clubId) === Number(game.selectedClubId)){
      details.push({ playerId:player.id, name:player.name, played, oldSalary, nextSalary, delta, pct });
    }
  });
  return { players, increased, decreased, totalDelta, details };
}
function retireSeasonVeterans(){
  if(!game || !seed?.players) return [];
  const clubId = Number(game.selectedClubId);
  const retirees = seed.players
    .filter(player => !player.sold)
    .filter(player => {
      const age = Math.round(Number(player.age || 0));
      const retirementAge = age >= RETIREMENT_MIN_AGE && age <= RETIREMENT_MAX_AGE;
      if(!retirementAge) return false;
      const ownPlayer = Number(player.clubId) === clubId && !player.freeAgent;
      const freePlayer = Number(player.clubId || 0) === 0 || Boolean(player.freeAgent) || Boolean(player.youthFreeAgent);
      return ownPlayer || freePlayer;
    })
    .map(player => ({ id:player.id, name:player.name, age:player.age, position:player.position, salary:player.salary || 0, freeAgent:Number(player.clubId || 0) === 0 || Boolean(player.freeAgent) || Boolean(player.youthFreeAgent) }));
  if(!retirees.length) return [];
  const retiredIds = new Set(retirees.map(p => Number(p.id)));
  seed.players = seed.players.filter(player => !retiredIds.has(Number(player.id)));
  game.marketPlayers = (game.marketPlayers || []).filter(player => !retiredIds.has(Number(player.id)));
  retirees.forEach(player => {
    removePlayerFromCurrentTactic(player.id);
    delete game.playerCondition?.[player.id];
    delete game.playerMorale?.[player.id];
    delete game.playerSkillBoosts?.[player.id];
    delete game.trainingPlan?.[player.id];
    delete game.playerStats?.[player.id];
    delete game.playerStatus?.[player.id];
  });
  const ownRetirees = retirees.filter(player => !player.freeAgent);
  const freeRetirees = retirees.filter(player => player.freeAgent);
  if(ownRetirees.length){
    const names = ownRetirees.slice(0,5).map(p => `${p.name} (${p.age})`).join(', ');
    pushGameMessage({
      type:'plantel',
      priority:'normal',
      title:'Retiros al finalizar la temporada',
      body:`${ownRetirees.length === 1 ? 'Un jugador informó' : `${ownRetirees.length} jugadores informaron`} su retiro del fútbol: ${names}${ownRetirees.length > 5 ? '...' : ''}`
    });
  }
  if(freeRetirees.length){
    pushGameMessage({
      type:'mercado',
      priority:'normal',
      title:'Retiros en el mercado libre',
      body:`${freeRetirees.length} jugadores libres se retiraron al finalizar la temporada.`
    });
  }
  return retirees;
}
function nextPlayerId(){
  const ids = [0]
    .concat((seed?.players || []).map(p => Number(p.id) || 0))
    .concat((game?.marketPlayers || []).map(p => Number(p.id) || 0));
  return Math.max(...ids) + 1;
}
function currentFreeMarketPlayers(){
  return (game?.marketPlayers || []).filter(player => player && Number(player.clubId || 0) === 0 && !player.sold);
}
function removeFreeMarketPlayersById(ids=[]){
  const remove = new Set((ids || []).map(Number));
  if(!remove.size) return [];
  const removed = currentFreeMarketPlayers().filter(player => remove.has(Number(player.id)));
  game.marketPlayers = (game.marketPlayers || []).filter(player => !remove.has(Number(player.id)));
  if(seed?.players){
    seed.players = seed.players.filter(player => {
      if(!remove.has(Number(player.id))) return true;
      return !(Number(player.clubId || 0) === 0 && player.freeAgent);
    });
  }
  removed.forEach(player => {
    delete game.playerCondition?.[player.id];
    delete game.playerMorale?.[player.id];
    delete game.playerSkillBoosts?.[player.id];
    delete game.trainingPlan?.[player.id];
    delete game.playerStats?.[player.id];
    delete game.playerStatus?.[player.id];
  });
  return removed;
}
function pruneFreeAgentMarketToMax(maxCount=SEASON_FREE_AGENT_MARKET_MAX){
  if(!game || !SEASON_FREE_AGENT_CLEANUP_ENABLED || !Number.isFinite(Number(maxCount)) || Number(maxCount) <= 0) return [];
  const freePlayers = currentFreeMarketPlayers();
  const excess = freePlayers.length - Number(maxCount);
  if(excess <= 0) return [];
  const candidates = freePlayers
    .filter(player => Math.round(Number(player.age || 0)) >= RETIREMENT_MIN_AGE)
    .sort((a,b) => {
      const ageDiff = Number(b.age || 0) - Number(a.age || 0);
      if(ageDiff !== 0) return ageDiff;
      const youthWeight = Number(Boolean(a.youthFreeAgent)) - Number(Boolean(b.youthFreeAgent));
      if(youthWeight !== 0) return youthWeight;
      const mediaDiff = visibleOverall(a) - visibleOverall(b);
      if(mediaDiff !== 0) return mediaDiff;
      return Number(a.id || 0) - Number(b.id || 0);
    });
  if(!candidates.length) return [];
  return removeFreeMarketPlayersById(candidates.slice(0, excess).map(player => player.id));
}
function initializeFreePlayerState(players=[]){
  if(!game) return;
  game.playerCondition = game.playerCondition || {};
  game.playerMorale = game.playerMorale || {};
  game.playerSkillBoosts = game.playerSkillBoosts || {};
  game.trainingPlan = game.trainingPlan || {};
  game.playerStats = game.playerStats || {};
  players.forEach(p => {
    game.playerCondition[p.id] = clamp(15 + hashNumber(`free-cond-${p.id}`, 15), 1, 29);
    game.playerMorale[p.id] = clamp(35 + hashNumber(`free-morale-${p.id}`, 55), 1, 99);
    game.playerSkillBoosts[p.id] = game.playerSkillBoosts[p.id] || {};
    game.trainingPlan[p.id] = safeIndividualTrainingType(game.trainingPlan[p.id]);
    game.playerStats[p.id] = game.playerStats[p.id] || createEmptyPlayerStat(p);
    normalizePlayerStatRecord(game.playerStats[p.id]);
  });
}
function generateSeasonYouthFreeAgents(count=SEASON_YOUTH_FREE_AGENT_COUNT){
  const totalCount = Math.max(0, Math.round(Number(count) || 0));
  const activePlayers = (seed?.players || []).filter(player => player && !player.retired && !player.sold && Number(player.clubId || 0) >= 0);
  const generationContext = createPlayerGenerationContext(activePlayers.length + totalCount, activePlayers);
  const players = [];
  let id = nextPlayerId();
  const season = Number(game?.seasonNumber || 1);
  for(let i=0;i<totalCount;i++, id++){
    const group = pickPositionGroupForGeneration(id, `season-youth-${season}`, generationContext);
    const position = pickPositionFromGroup(group, id, `season-youth-${season}`);
    const club = seed?.clubs?.length ? seed.clubs[i % seed.clubs.length] : null;
    const division = club ? clubDivision(club.id) : null;
    const ageSpan = Math.max(1, SEASON_YOUTH_FREE_AGENT_AGE_MAX - SEASON_YOUTH_FREE_AGENT_AGE_MIN + 1);
    const player = generatedPlayerFactory({
      id,
      position,
      clubId:0,
      age:SEASON_YOUTH_FREE_AGENT_AGE_MIN + hashNumber(`season-youth-age-${season}-${id}`, ageSpan),
      prestige:50,
      nameContext:`Juveniles libres ${season}`,
      divisionName:division?.name || 'Juveniles libres',
      divisionOrder:division?.order || null,
      generationContext,
      salaryFactor:FREE_YOUTH_SALARY_FACTOR,
      freeAgent:true,
      youthFreeAgent:true
    });
    player.originClubId = club?.id || 0;
    players.push(player);
  }
  return players;
}
function generateSeasonYouthFreeAgentsByClub(perClub=SEASON_YOUTH_FREE_AGENTS_PER_CLUB){
  const clubs = (seed?.clubs || []).filter(club => Number(club.id || 0) > 0);
  const total = Math.max(0, Math.round(Number(perClub || 0))) * clubs.length;
  if(total <= 0) return [];
  return generateSeasonYouthFreeAgents(total);
}
function addSeasonYouthFreeAgents(count=SEASON_YOUTH_FREE_AGENT_COUNT){
  if(!game) return [];
  const newPlayers = generateSeasonYouthFreeAgents(count);
  game.marketPlayers = (game.marketPlayers || []).concat(newPlayers);
  mergeMarketPlayersIntoSeed(newPlayers);
  initializeFreePlayerState(newPlayers);
  if(newPlayers.length){
    pushGameMessage({ type:'mercado', title:'Nuevos juveniles libres', body:`Aparecieron ${newPlayers.length} jóvenes libres de ${SEASON_YOUTH_FREE_AGENT_AGE_MIN} a ${SEASON_YOUTH_FREE_AGENT_AGE_MAX} años en el mercado.`, priority:'normal' });
  }
  return newPlayers;
}
function topUpSeasonFreeAgentsToMax(maxCount=SEASON_FREE_AGENT_MARKET_MAX){
  if(!game || !SEASON_FREE_AGENT_TOP_UP_ENABLED || !Number.isFinite(Number(maxCount)) || Number(maxCount) <= 0) return [];
  const needed = Math.max(0, Math.round(Number(maxCount)) - currentFreeMarketPlayers().length);
  if(needed <= 0) return [];
  const newPlayers = generateMarketPlayers(needed, { startId:nextPlayerId(), label:`season-market-${game.seasonNumber || 1}`, nameContext:'Mercado Libre' });
  game.marketPlayers = (game.marketPlayers || []).concat(newPlayers);
  mergeMarketPlayersIntoSeed(newPlayers);
  initializeFreePlayerState(newPlayers);
  return newPlayers;
}
function renewFreeAgentMarketForSeason(retiredCount=0){
  if(!game) return { removed:[], youth:[], regular:[] };
  pruneFreeAgentMarketToMax(SEASON_FREE_AGENT_MARKET_MAX);
  const youth = generateSeasonYouthFreeAgentsByClub(SEASON_YOUTH_FREE_AGENTS_PER_CLUB);
  game.marketPlayers = (game.marketPlayers || []).concat(youth);
  mergeMarketPlayersIntoSeed(youth);
  initializeFreePlayerState(youth);
  pruneFreeAgentMarketToMax(SEASON_FREE_AGENT_MARKET_MAX);
  const regular = topUpSeasonFreeAgentsToMax(SEASON_FREE_AGENT_MARKET_MAX);
  const finalPruned = pruneFreeAgentMarketToMax(SEASON_FREE_AGENT_MARKET_MAX);
  const legacyExtra = retiredCount > 0 && SEASON_YOUTH_FREE_AGENT_COUNT > 0 ? addSeasonYouthFreeAgents(Math.max(SEASON_YOUTH_FREE_AGENT_COUNT, retiredCount)) : [];
  if(legacyExtra.length) pruneFreeAgentMarketToMax(SEASON_FREE_AGENT_MARKET_MAX);
  const totalYouth = youth.length + legacyExtra.length;
  const totalRegular = regular.length;
  if(totalYouth || totalRegular || finalPruned.length){
    pushGameMessage({
      type:'mercado',
      title:'Mercado libre renovado',
      body:`Se incorporaron ${totalYouth} jóvenes y ${totalRegular} jugadores libres al mercado.`,
      priority:'normal'
    });
  }
  return { removed:finalPruned, youth:youth.concat(legacyExtra), regular };
}
function clubSeasonPrestigeDeltaByPosition(position){
  const pos = Math.max(1, Math.round(Number(position || 0)));
  if(pos >= 1 && pos <= 5) return 2;
  if(pos >= 6 && pos <= 10) return 1;
  if(pos >= 11 && pos <= 15) return -1;
  if(pos >= 16 && pos <= 20) return -2;
  return 0;
}
function updateClubPrestigeAfterSeason(){
  if(!game || !seed?.clubs) return [];
  const changes = [];
  divisionOrderList().forEach(division => {
    const multiplier = Math.max(1, Math.round(Number(division.order || 1)));
    sortedStandings(division.id).forEach((row, index) => {
      const club = seed.clubs.find(c => Number(c.id) === Number(row.clubId));
      if(!club) return;
      const position = index + 1;
      const rawDelta = clubSeasonPrestigeDeltaByPosition(position);
      const delta = rawDelta * multiplier;
      if(delta === 0) return;
      const oldValue = clubPrestigeValue(club);
      const next = clamp(oldValue + delta, 1, 99);
      club.reputation = next;
      club.managerPrestige = next;
      changes.push({ clubId:club.id, clubName:club.name, divisionId:division.id, divisionName:division.name, position, oldValue, next, delta:next-oldValue });
    });
  });
  return changes;
}
function finalizeSeasonIfNeeded(){
  if(!game || game.seasonFinalized || game.matchdayIndex < game.fixtures.length) return;
  game.managerStats = normalizeManagerStats(game.managerStats);
  const division = clubDivision(game.selectedClubId);
  const table = sortedStandings(division.id);
  const index = table.findIndex(row => row.clubId === game.selectedClubId);
  const row = table[index] || game.standings[game.selectedClubId] || {};
  const position = index >= 0 ? index + 1 : null;
  const champion = position === 1;
  const movementsPreview = computeSeasonMovements();
  const totalTeams = table.length || 0;
  const relegatedOrLast = Boolean(movementsPreview.some(move => move.type === 'relegation' && Number(move.clubId) === Number(game.selectedClubId)) || (position && totalTeams && position === totalTeams));
  const record = {
    season:game.seasonNumber || 1,
    clubId:game.selectedClubId,
    clubName:clubName(game.selectedClubId),
    divisionId:division.id,
    divisionName:division.name,
    divisionOrder:division.order || divisionOrderFromName(division.name),
    position,
    label:champion ? 'Campeón' : (position ? `${position}°` : '—'),
    pts:row.pts || 0,
    pg:row.pg || 0,
    pe:row.pe || 0,
    pp:row.pp || 0,
    gf:row.gf || 0,
    gc:row.gc || 0,
    title:champion,
    managerPrestigeChampionReward: champion ? championPrestigeRewardByDivisionOrder(division.order || divisionOrderFromName(division.name)) : 0,
    managerPrestigeBadSeasonPenalty: relegatedOrLast ? badSeasonPrestigePenaltyByDivisionOrder(division.order || divisionOrderFromName(division.name)) : 0
  };
  if(!game.managerStats.seasons.some(s => s.season === record.season)){
    const objective = managerObjectiveForClubDivision(game.selectedClubId);
    const seasonPpg = ppgFromTotals(game.managerStats.currentSeason || record);
    record.objectivePpg = objective;
    record.objectiveAchieved = Number.isFinite(Number(objective)) && seasonPpg >= Number(objective);
    record.ppg = seasonPpg;
    game.managerStats.seasons.push(record);
    if(champion) game.managerStats.titles += 1;
    game.managerStats = normalizeManagerStats(game.managerStats);
    if(record.objectiveAchieved && MANAGER_PRESTIGE_OBJECTIVE_REWARD > 0){
      const awardKey = `${record.season}-${record.clubId}`;
      if(!game.managerStats.objectivePrestigeAwards.includes(awardKey)){
        game.managerStats.objectivePrestigeAwards.push(awardKey);
        pushGameMessage({ type:'directiva', priority:'normal', title:'Objetivo cumplido', body:`Objetivo cumplido con ${record.clubName}. Suma ${MANAGER_PRESTIGE_OBJECTIVE_REWARD} puntos de prestigio de manager.`, id:`objective-prestige-${record.season}-${record.clubId}` });
      }
    }
  }
  if(champion){
    pushGameMessage({ type:'deportivo', priority:'high', title:'Has salido campeón', body:`Felicitaciones: ${clubName(game.selectedClubId)} salió campeón de ${division.name}. Suma ${record.managerPrestigeChampionReward} puntos de prestigio de manager.`, id:`champion-${game.seasonNumber || 1}-${game.selectedClubId}` });
    if(typeof awardSpecialChampionPoints === 'function') awardSpecialChampionPoints(division);
  }
  if(record.managerPrestigeBadSeasonPenalty > 0){
    pushGameMessage({ type:'directiva', priority:'high', title:'Prestigio de manager reducido', body:`Descender o terminar último resta ${record.managerPrestigeBadSeasonPenalty} puntos de prestigio de manager.`, id:`bad-season-prestige-${game.seasonNumber || 1}-${game.selectedClubId}` });
  }
  const prestigeChanges = updateClubPrestigeAfterSeason();
  const movements = movementsPreview;
  const promoted = movements.some(move => move.type === 'promotion' && Number(move.clubId) === Number(game.selectedClubId));
  if(typeof queueNextSeasonTransferBudgetUnlock === 'function'){
    if(promoted) queueNextSeasonTransferBudgetUnlock('promotion', transferBudgetConfig().unlockPromotion, 'Ascenso');
    if(champion) queueNextSeasonTransferBudgetUnlock('champion', transferBudgetConfig().unlockChampion, 'Campeón');
  }
  const salariesPaid = paySeasonSalaries();
  const salaryAdjustments = applySeasonSalaryAdjustments();
  const retirements = retireSeasonVeterans();
  const trainingDecay = decayTrainedSkillBoosts();
  game.seasonTransition = {
    season:game.seasonNumber || 1,
    userRecord:record,
    movements,
    salariesPaid,
    salaryAdjustments,
    retirements,
    trainingDecay,
    prestigeChanges,
    agingApplied: true
  };
  game.seasonFinalized = true;
  game.seasonPhase = 'finalized';
  game.seasonEndModalShown = false;
}
function applySeasonMovements(){
  const movements = game?.seasonTransition?.movements || [];
  const divisions = divisionOrderList();
  const byId = Object.fromEntries(divisions.map(d => [d.id, d]));
  movements.forEach(move => {
    const club = seed.clubs.find(c => c.id === move.clubId);
    const target = byId[move.toDivisionId];
    if(!club || !target) return;
    club.divisionId = target.id;
    club.divisionName = target.name;
    club.divisionOrder = target.order;
    club.prizeMultiplier = target.prizeMultiplier ?? divisionPrizeMultiplier(target.name, (target.order || 1)-1);
  });
  game.clubDivisionOverrides = snapshotClubDivisionOverrides();
}

function statusObjectIsEmpty(status){
  return !status || Object.keys(status).length === 0;
}
function removeInjuryFieldsFromStatus(status){
  const clean = { ...(status || {}) };
  delete clean.injuredThrough;
  delete clean.injuryLabel;
  delete clean.injuryChance;
  delete clean.injuredAtMatchday;
  delete clean.carriedFromPreviousSeason;
  delete clean.carriedFromSeason;
  delete clean.rebasedForSeason;
  return clean;
}
function removeSuspensionFieldsFromStatus(status){
  const clean = { ...(status || {}) };
  delete clean.suspendedThrough;
  return clean;
}
function rebaseAvailabilityStatusesForSeasonStart(statuses={}, previousMatchdayIndex=0, injuryRecoveryTurns=0, meta={}){
  const safePreviousIndex = Math.max(0, Math.round(Number(previousMatchdayIndex) || 0));
  const safeRecovery = Math.max(0, Math.round(Number(injuryRecoveryTurns) || 0));
  const nextStatuses = {};
  const summary = {
    changed:false,
    injuriesCleared:0,
    injuriesCarried:0,
    suspensionsCleared:0,
    suspensionsCarried:0
  };
  Object.entries(statuses || {}).forEach(([playerId, rawStatus]) => {
    let status = { ...(rawStatus || {}) };
    const injuryThrough = Number(status.injuredThrough);
    if(Number.isFinite(injuryThrough)){
      const remainingTurns = Math.max(0, Math.round(injuryThrough) - safePreviousIndex + 1);
      const remainingAfterRecovery = Math.max(0, remainingTurns - safeRecovery);
      summary.changed = true;
      if(remainingAfterRecovery <= 0){
        status = removeInjuryFieldsFromStatus(status);
        summary.injuriesCleared += 1;
      } else {
        status.injuredThrough = remainingAfterRecovery - 1;
        status.injuredAtMatchday = 0;
        status.carriedFromPreviousSeason = true;
        status.carriedFromSeason = meta.previousSeason || status.carriedFromSeason || null;
        status.rebasedForSeason = meta.nextSeason || null;
        summary.injuriesCarried += 1;
      }
    }
    const suspendedThrough = Number(status.suspendedThrough);
    if(Number.isFinite(suspendedThrough)){
      const remainingSuspension = Math.max(0, Math.round(suspendedThrough) - safePreviousIndex + 1);
      summary.changed = true;
      if(remainingSuspension <= 0){
        status = removeSuspensionFieldsFromStatus(status);
        summary.suspensionsCleared += 1;
      } else {
        status.suspendedThrough = remainingSuspension - 1;
        summary.suspensionsCarried += 1;
      }
    }
    if(!statusObjectIsEmpty(status)) nextStatuses[playerId] = status;
  });
  return { statuses:nextStatuses, summary };
}
function reduceInjuryDurationsByTurns(turns=1){
  if(!game?.playerStatus) return { changed:false, cleared:0, reduced:0 };
  const amount = Math.max(0, Math.round(Number(turns) || 0));
  if(amount <= 0) return { changed:false, cleared:0, reduced:0 };
  const result = { changed:false, cleared:0, reduced:0 };
  Object.entries(game.playerStatus || {}).forEach(([playerId, rawStatus]) => {
    let status = { ...(rawStatus || {}) };
    const injuryThrough = Number(status.injuredThrough);
    if(!Number.isFinite(injuryThrough)) return;
    const nextThrough = Math.round(injuryThrough) - amount;
    result.changed = true;
    if(nextThrough < Number(game.matchdayIndex || 0)){
      status = removeInjuryFieldsFromStatus(status);
      result.cleared += 1;
    } else {
      status.injuredThrough = nextThrough;
      result.reduced += 1;
    }
    if(statusObjectIsEmpty(status)) delete game.playerStatus[playerId];
    else game.playerStatus[playerId] = status;
  });
  return result;
}
function registerInjuryRecoveryTurn(phase='recovery'){
  if(!game) return;
  game.injuryRecoveryTurnsBySeason = game.injuryRecoveryTurnsBySeason || {};
  const key = `${game.seasonNumber || 1}:${phase}`;
  game.injuryRecoveryTurnsBySeason[key] = Math.max(0, Math.round(Number(game.injuryRecoveryTurnsBySeason[key] || 0))) + 1;
}
function injuryRecoveryTurnsRegistered(seasonNumber=game?.seasonNumber || 1, phase='postseason'){
  const key = `${seasonNumber || 1}:${phase}`;
  return Math.max(0, Math.round(Number(game?.injuryRecoveryTurnsBySeason?.[key] || 0)));
}
function applySeasonStartAvailabilityRebase(previousMatchdayIndex, extraInjuryRecoveryTurns=0){
  if(!game) return { changed:false };
  game.playerStatus = game.playerStatus || {};
  const nextSeason = (game.seasonNumber || 1) + 1;
  const rebaseKey = `season-${nextSeason}`;
  game.statusRebases = game.statusRebases || {};
  if(game.statusRebases[rebaseKey]) return { changed:false, skipped:true };
  const result = rebaseAvailabilityStatusesForSeasonStart(game.playerStatus, previousMatchdayIndex, extraInjuryRecoveryTurns, { previousSeason:game.seasonNumber || 1, nextSeason });
  game.playerStatus = result.statuses;
  game.statusRebases[rebaseKey] = {
    previousSeason:game.seasonNumber || 1,
    nextSeason,
    previousMatchdayIndex:Math.max(0, Math.round(Number(previousMatchdayIndex) || 0)),
    extraInjuryRecoveryTurns:Math.max(0, Math.round(Number(extraInjuryRecoveryTurns) || 0)),
    ...result.summary
  };
  if(result.summary.changed){
    const cleared = result.summary.injuriesCleared;
    const carried = result.summary.injuriesCarried;
    pushGameMessage({
      type:'medico',
      priority:'normal',
      title:'Parte médico de inicio de temporada',
      body:`Se recalcularon las lesiones pendientes al cambiar de temporada. Recuperados: ${cleared}. Siguen en recuperación: ${carried}.`
    });
  }
  return { changed:result.summary.changed, ...result.summary };
}
function repairLegacySeasonStartAvailability(normalized){
  if(!normalized || normalized.seasonPhase !== 'preseason' || Number(normalized.matchdayIndex || 0) !== 0) return normalized;
  normalized.statusRebases = normalized.statusRebases || {};
  const key = `legacy-season-start-${normalized.seasonNumber || 1}`;
  if(normalized.statusRebases[key]) return normalized;
  const statuses = normalized.playerStatus || {};
  const hasLegacyCarry = Object.values(statuses).some(status => {
    const injuredThrough = Number(status?.injuredThrough);
    const injuredAt = Number(status?.injuredAtMatchday);
    const suspendedThrough = Number(status?.suspendedThrough);
    return (Number.isFinite(injuredThrough) && Number.isFinite(injuredAt) && injuredAt > 0 && injuredThrough > 0)
      || (Number.isFinite(suspendedThrough) && suspendedThrough > 5);
  });
  if(!hasLegacyCarry) return normalized;
  const previousFixtureCount = Math.max(0, Array.isArray(normalized.fixtures) ? normalized.fixtures.length : currentSeasonFixtureCount());
  const previousSeason = Math.max(1, Math.round(Number(normalized.seasonNumber || 1)) - 1);
  const postseasonRecovery = postseasonTurnsForSeason(previousSeason, previousFixtureCount);
  const result = rebaseAvailabilityStatusesForSeasonStart(statuses, previousFixtureCount, postseasonRecovery, { previousSeason, nextSeason:normalized.seasonNumber || 1 });
  normalized.playerStatus = result.statuses;
  normalized.statusRebases[key] = {
    previousSeason,
    nextSeason:normalized.seasonNumber || 1,
    previousMatchdayIndex:previousFixtureCount,
    extraInjuryRecoveryTurns:postseasonRecovery,
    legacyRepair:true,
    ...result.summary
  };
  if(result.summary.changed){
    normalized._needsAutosave = true;
    normalized.messages = Array.isArray(normalized.messages) ? normalized.messages : [];
    normalized.messages.unshift({
      id:`legacy-medical-repair-${normalized.seasonNumber || 1}-${Date.now()}`,
      turn:0,
      season:normalized.seasonNumber || 1,
      date:normalized.currentDate || '',
      read:false,
      priority:'normal',
      type:'medico',
      title:'Parte médico corregido',
      body:`Se corrigió el arrastre de lesiones al inicio de temporada. Recuperados: ${result.summary.injuriesCleared}. Siguen en recuperación: ${result.summary.injuriesCarried}.`,
      action:null,
      createdAt:Date.now()
    });
  }
  return normalized;
}


function botBalanceDifficultyProfile(){
  if(BOT_BALANCE_DIFFICULTY === 'dificil' || BOT_BALANCE_DIFFICULTY === 'difícil') return { morale:4, condition:3, cohesion:5, development:1.35, label:'difícil' };
  if(BOT_BALANCE_DIFFICULTY === 'suave' || BOT_BALANCE_DIFFICULTY === 'facil' || BOT_BALANCE_DIFFICULTY === 'fácil') return { morale:-4, condition:-3, cohesion:-6, development:0.75, label:'suave' };
  return { morale:0, condition:0, cohesion:0, development:1, label:'normal' };
}
function botBalanceRandomOffset(seedValue, spread){
  const cleanSpread = Math.max(0, Math.round(Number(spread || 0)));
  if(cleanSpread <= 0) return 0;
  return hashNumber(seedValue, cleanSpread * 2 + 1) - cleanSpread;
}
function botBalanceManagedDivisionId(selectedClubId=game?.selectedClubId){
  return seed?.clubs?.find(c => Number(c.id) === Number(selectedClubId))?.divisionId || 'default';
}
function botBalanceClubIds(selectedClubId=game?.selectedClubId){
  const ownId = Number(selectedClubId || game?.selectedClubId || 0);
  const divisionId = botBalanceManagedDivisionId(ownId);
  return (seed?.clubs || [])
    .filter(club => Number(club.id) !== ownId)
    .filter(club => !BOT_BALANCE_ONLY_MANAGER_DIVISION || (club.divisionId || 'default') === divisionId)
    .map(club => Number(club.id));
}
function botBalanceReference(selectedClubId=game?.selectedClubId){
  const ownSquad = playersByClub(Number(selectedClubId || game?.selectedClubId || 0));
  return {
    morale: Math.round(avg(ownSquad.map(p => currentMorale(p.id))) || PLAYER_MORALE_START),
    condition: Math.round(avg(ownSquad.map(p => currentCondition(p.id))) || 85),
    cohesion: cohesionValue(Number(selectedClubId || game?.selectedClubId || 0)) || TEAM_COHESION_START
  };
}
function botBalanceRankMap(){
  const map = {};
  if(typeof sortedStandings !== 'function') return map;
  (divisionOrderList() || []).forEach(division => {
    const table = sortedStandings(division.id) || [];
    const total = Math.max(1, table.length);
    table.forEach((row, index) => {
      const normalized = total <= 1 ? 0 : ((total - 1 - index) / (total - 1));
      const bonus = Math.round(((normalized - 0.5) * 2) * BOT_BALANCE_POSITION_BONUS_MAX);
      map[Number(row.clubId)] = {
        rank:index + 1,
        total,
        bonus,
        divisionId:division.id
      };
    });
  });
  return map;
}
function botBalancePositionBonus(clubId, rankMap={}){
  return Math.round(Number(rankMap?.[Number(clubId)]?.bonus || 0));
}
function botBalanceTargetValue(kind, referenceValue, clubId, rankMap={}, purpose='season_start'){
  const profile = botBalanceDifficultyProfile();
  const spread = kind === 'condition' ? BOT_BALANCE_CONDITION_SPREAD : kind === 'cohesion' ? BOT_BALANCE_COHESION_SPREAD : BOT_BALANCE_MORALE_SPREAD;
  const floor = kind === 'condition' ? BOT_BALANCE_CONDITION_FLOOR : kind === 'cohesion' ? BOT_BALANCE_COHESION_FLOOR : BOT_BALANCE_MORALE_FLOOR;
  const max = kind === 'cohesion' ? 100 : 99;
  const profileOffset = Number(profile[kind] || 0);
  const positionBonus = botBalancePositionBonus(clubId, rankMap);
  const positionFactor = purpose === 'maintenance' ? 0.45 : 0.75;
  const random = botBalanceRandomOffset(`bot-balance-${purpose}-${game?.seasonNumber || 1}-${clubId}-${kind}`, spread);
  return clamp(Math.round(Number(referenceValue || 0) + profileOffset + random + (positionBonus * positionFactor)), floor, max);
}
function botBalanceSkillPool(player){
  if(typeof trainableSkillsForPlayer === 'function') return trainableSkillsForPlayer(player);
  if(player.position === 'POR') return ['porteria','posicionamiento','serenidad','paseLargo','liderazgo','resistencia'];
  if(['LD','LI','DFC'].includes(player.position)) return ['marca','entradas','posicionamiento','fuerza','cabezazo','resistencia','trabajoEquipo'];
  if(['MCD','MC','MCO'].includes(player.position)) return ['paseCorto','paseLargo','vision','tecnica','trabajoEquipo','posicionamiento','resistencia'];
  return ['remate','regate','posicionamiento','serenidad','cabezazo','fuerza','resistencia','tecnica'];
}
function applyBotSeasonDevelopment(clubIds, rankMap={}){
  if(!BOT_BALANCE_ENABLED || BOT_BALANCE_DEVELOPMENT_CHANCE <= 0) return { players:0, gains:0 };
  game.playerSkillBoosts = game.playerSkillBoosts || {};
  const profile = botBalanceDifficultyProfile();
  let players = 0;
  let gains = 0;
  (clubIds || []).forEach(clubId => {
    const positionBonus = botBalancePositionBonus(clubId, rankMap);
    const positionScale = BOT_BALANCE_POSITION_BONUS_MAX > 0 ? (positionBonus / BOT_BALANCE_POSITION_BONUS_MAX) : 0;
    const squad = playersByClub(clubId)
      .filter(player => !player.freeAgent && !player.retired)
      .sort((a,b)=> visibleOverall(b) - visibleOverall(a))
      .slice(0, Math.max(18, Math.min(28, playersByClub(clubId).length)));
    squad.forEach(player => {
      const youngBonus = Number(player.age || 0) <= 23 ? 0.05 : 0;
      const chance = clamp((BOT_BALANCE_DEVELOPMENT_CHANCE + (positionScale * BOT_BALANCE_POSITION_DEVELOPMENT_BONUS) + youngBonus) * profile.development, 0, 0.80);
      const roll = hashNumber(`bot-development-${game?.seasonNumber || 1}-${clubId}-${player.id}`, 10000) / 10000;
      if(roll >= chance) return;
      const gainCount = 1 + (roll < chance * 0.18 ? 1 : 0);
      const skills = botBalanceSkillPool(player).filter(skill => Number.isFinite(baseSkill(player, skill)) && baseSkill(player, skill) < 98);
      if(!skills.length) return;
      if(!game.playerSkillBoosts[player.id]) game.playerSkillBoosts[player.id] = {};
      let playerGains = 0;
      for(let i=0; i<gainCount; i++){
        const skill = skills[hashNumber(`bot-development-skill-${game?.seasonNumber || 1}-${player.id}-${i}`, skills.length)];
        const current = Math.round(Number(game.playerSkillBoosts[player.id][skill] || 0));
        if(current >= BOT_BALANCE_MAX_SKILL_BOOST) continue;
        game.playerSkillBoosts[player.id][skill] = clamp(current + 1, 0, BOT_BALANCE_MAX_SKILL_BOOST);
        playerGains += 1;
      }
      if(playerGains > 0){
        players += 1;
        gains += playerGains;
      }
    });
  });
  return { players, gains };
}
function balanceBotsForSeasonStart(selectedClubId=game?.selectedClubId, rankMap={}){
  if(!game || !BOT_BALANCE_ENABLED || !BOT_BALANCE_ON_SEASON_START) return null;
  ensurePlayerStateForAll();
  ensureTeamCohesion();
  const clubIds = botBalanceClubIds(selectedClubId);
  const reference = botBalanceReference(selectedClubId);
  let playersAdjusted = 0;
  let clubsAdjusted = 0;
  clubIds.forEach(clubId => {
    const targetMorale = botBalanceTargetValue('morale', reference.morale, clubId, rankMap, 'season_start');
    const targetCondition = botBalanceTargetValue('condition', reference.condition, clubId, rankMap, 'season_start');
    const targetCohesion = botBalanceTargetValue('cohesion', reference.cohesion, clubId, rankMap, 'season_start');
    game.teamCohesion[clubId] = targetCohesion;
    const squad = playersByClub(clubId).filter(player => !player.freeAgent && !player.retired);
    squad.forEach(player => {
      const moraleVariance = botBalanceRandomOffset(`bot-balance-morale-player-${game?.seasonNumber || 1}-${clubId}-${player.id}`, 4);
      const conditionVariance = botBalanceRandomOffset(`bot-balance-condition-player-${game?.seasonNumber || 1}-${clubId}-${player.id}`, 4);
      game.playerMorale[player.id] = clamp(Math.round((currentMorale(player.id) * 0.30) + ((targetMorale + moraleVariance) * 0.70)), 1, 99);
      game.playerCondition[player.id] = clamp(Math.round((currentCondition(player.id) * 0.25) + ((targetCondition + conditionVariance) * 0.75)), 0, 99);
      playersAdjusted += 1;
    });
    clubsAdjusted += 1;
  });
  const development = applyBotSeasonDevelopment(clubIds, rankMap);
  const summary = {
    season:game.seasonNumber || 1,
    date:game.currentDate || '',
    clubs:clubsAdjusted,
    players:playersAdjusted,
    reference,
    development,
    difficulty:botBalanceDifficultyProfile().label,
    createdAt:Date.now()
  };
  game.botBalanceLog = Array.isArray(game.botBalanceLog) ? game.botBalanceLog : [];
  game.botBalanceLog.unshift(summary);
  game.botBalanceLog = game.botBalanceLog.slice(0, 20);
  return summary;
}
function maintainBotBalanceDuringSeason(options={}){
  if(!game || !BOT_BALANCE_ENABLED || !BOT_BALANCE_DURING_SEASON) return null;
  const force = Boolean(options.force);
  if(!force && isRegularSeason() && ((Number(game.matchdayIndex || 0) + 1) % BOT_BALANCE_MAINTENANCE_INTERVAL_MATCHDAYS !== 0)) return null;
  if(!force && !isRegularSeason()) return null;
  ensurePlayerStateForAll();
  ensureTeamCohesion();
  const rankMap = botBalanceRankMap();
  const reference = botBalanceReference(game.selectedClubId);
  const clubIds = botBalanceClubIds(game.selectedClubId);
  let playersAdjusted = 0;
  let clubsAdjusted = 0;
  clubIds.forEach(clubId => {
    const targetMorale = botBalanceTargetValue('morale', reference.morale, clubId, rankMap, 'maintenance');
    const targetCondition = botBalanceTargetValue('condition', reference.condition, clubId, rankMap, 'maintenance');
    const targetCohesion = botBalanceTargetValue('cohesion', reference.cohesion, clubId, rankMap, 'maintenance');
    const currentCohesion = cohesionValue(clubId);
    if(currentCohesion < targetCohesion){
      game.teamCohesion[clubId] = clamp(Math.round(Math.min(targetCohesion, currentCohesion + BOT_BALANCE_MAINTENANCE_COHESION_GAIN)), 0, 100);
      clubsAdjusted += 1;
    }
    playersByClub(clubId).forEach(player => {
      if(player.freeAgent || player.retired) return;
      let changed = false;
      const cond = currentCondition(player.id);
      if(cond < targetCondition){
        game.playerCondition[player.id] = clamp(Math.round(Math.min(targetCondition, cond + BOT_BALANCE_MAINTENANCE_CONDITION_GAIN)), 0, 99);
        changed = true;
      }
      const morale = currentMorale(player.id);
      if(morale < targetMorale){
        game.playerMorale[player.id] = clamp(Math.round(Math.min(targetMorale, morale + BOT_BALANCE_MAINTENANCE_MORALE_GAIN)), 1, 99);
        changed = true;
      }
      if(changed) playersAdjusted += 1;
    });
  });
  return { clubs:clubsAdjusted, players:playersAdjusted, reference, forced:force };
}

function startNextSeason(selectedClubId){
  if(!game?.seasonFinalized) return;
  const retiredCount = game.seasonTransition?.retirements?.length || 0;
  const previousClubId = Number(game.selectedClubId || 0);
  const nextClubId = Number(selectedClubId || game.selectedClubId);
  const previousMatchdayIndex = Number(game.matchdayIndex || game.fixtures?.length || 0);
  const previousBotBalanceRanks = botBalanceRankMap();
  const configuredPostseasonRecovery = postseasonTurnsForCurrentSeason();
  const appliedPostseasonRecovery = injuryRecoveryTurnsRegistered(game.seasonNumber || 1, 'postseason');
  const missingPostseasonRecovery = Math.max(0, configuredPostseasonRecovery - appliedPostseasonRecovery);
  applySeasonStartAvailabilityRebase(previousMatchdayIndex, missingPostseasonRecovery);
  assignBotFieldStatesForNextSeason(nextClubId, previousClubId);
  repairInvalidBotFieldStates(game, 'season_transition', { message:false });
  applySeasonMovements();
  const aging = applySeasonalAging();
  applyAcademyAgingIfNeeded();
  refreshAllPlayerClauses();
  game.selectedClubId = nextClubId;
  game.seasonNumber = (game.seasonNumber || 1) + 1;
  const transferUnlock = typeof consumeNextSeasonTransferBudgetUnlock === 'function' ? consumeNextSeasonTransferBudgetUnlock() : { rate:0, reasons:[] };
  game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber, game.selectedClubId);
  game.transferBudget = typeof createTransferBudgetState === 'function' ? createTransferBudgetState(game.selectedClubId, game.seasonNumber, transferUnlock.rate || 0) : (game.transferBudget || null);
  if(transferUnlock?.rate && typeof transferBudgetAddHistory === 'function'){
    transferBudgetAddHistory('season_bonus', `Bonus de directiva: ${(transferUnlock.reasons || []).map(r => r.reason).filter(Boolean).join(' + ') || 'temporada anterior'}`, 0, transferUnlock.rate);
  }
  game.seasonYear = seasonYearForNumber(game.seasonNumber);
  game.calendarVersion = SEASON_CALENDAR_VERSION;
  game.seasonInitialBudget = Math.max(0, Math.round(Number(game.budget || 0)));
  game.seasonBudgetStartBySeason = game.seasonBudgetStartBySeason || {};
  game.seasonBudgetStartBySeason[game.seasonNumber] = game.seasonInitialBudget;
  game.seasonFinalized = false;
  game.seasonTransition = null;
  game.seasonEndModalShown = false;
  game.seasonPhase = 'preseason';
  game.phaseTurn = 0;
  game.preseasonFriendliesPlayed = 0;
  game.pendingFriendlyOpponentId = 0;
  game.matchdayIndex = 0;
  game.fixtures = generateFixturesForDivisions(seed.clubs, divisionOrderList(), { seasonYear:game.seasonYear });
  game.currentDate = firstAdvanceDateForSeason(game.seasonYear);
  game.standings = createInitialStandings();
  game.playerStats = createInitialPlayerStats();
  game.playerStars = normalizePlayerStarsState(game.playerStars || {});
  game.playerImpactWindows = normalizePlayerImpactWindows(game.playerImpactWindows || {});
  syncPlayerStarsWithClubs(game);
  game.matchHistory = [];
  game.lastOwnProblems = [];
  game.lastTurnSummary = null;
  game.mustReviewTactics = false;
  game.seasonEndPlayerOffers = null;
  game.rejectedPurchaseOffers = {};
  resetAcademySeasonState();
  resetStaffSeasonState();
  game.advanceLockedUntil = 0;
  game.lastBudgetDelta = 0;
  game.tactic = normalizeTactic(nextClubId, DEFAULT_TACTIC);
  mergeMarketPlayersIntoSeed(game.marketPlayers || []);
  renewFreeAgentMarketForSeason(retiredCount);
  ensurePlayerStateForAll();
  balanceBotsForSeasonStart(nextClubId, previousBotBalanceRanks);
  generateOpeningSponsorOffers(true);
  pushGameMessage({ type:'deportivo', title:`Temporada ${game.seasonNumber} iniciada`, body:`Comienza una nueva temporada con ${clubName(game.selectedClubId)}.`, priority:'normal' });
  activeTab = 'home';
  closeModal();
  saveLocal(true);
  renderAll();
  showNotice(`Temporada ${game.seasonNumber} iniciada.`);
}
function seasonEndPanelMarkup(){
  const record = game?.seasonTransition?.userRecord;
  const movements = game?.seasonTransition?.movements || [];
  const retirements = game?.seasonTransition?.retirements || [];
  const salaryAdjustments = game?.seasonTransition?.salaryAdjustments || null;
  const moveRows = movements.map(move => `<li><strong>${escapeHtml(clubName(move.clubId))}</strong>: ${move.type === 'promotion' ? 'asciende' : 'desciende'} a ${escapeHtml(move.toDivisionName)}</li>`).join('');
  const retirementRows = retirements.map(p => `<li><strong>${escapeHtml(p.name)}</strong> se retiró del fútbol a los ${p.age} años.</li>`).join('');
  return `<div class="card season-end-card">
    <div class="row"><div><p class="label">Fin de temporada</p><h3>${record?.title ? 'Campeón' : `Posición final: ${escapeHtml(record?.label || '—')}`}</h3></div><span class="pill">Temporada ${game.seasonNumber || 1}</span></div>
    <p class="muted">Podés seguir en ${escapeHtml(clubName(game.selectedClubId))} o elegir otro club para la próxima temporada.</p>
    ${game.seasonTransition?.salariesPaid ? `<p class="tagline">Pago anual de sueldos descontado: <strong>${formatMoney(game.seasonTransition.salariesPaid)}</strong>.</p>` : ''}
    ${salaryAdjustments ? `<p class="tagline">Sueldos ajustados para la próxima temporada según partidos jugados: ${salaryAdjustments.increased || 0} suben, ${salaryAdjustments.decreased || 0} bajan.</p>` : ''}
    ${retirementRows ? `<ul class="season-movement-list">${retirementRows}</ul>` : ''}
    ${moveRows ? `<ul class="season-movement-list">${moveRows}</ul>` : ''}
    <div class="row" style="margin-top:12px"><button class="primary" data-continue-season>Seguir en este club</button><button class="ghost" data-open-season-modal>Cambiar club</button></div>
  </div>`;
}
function openSeasonEndModal(){
  if(!game?.seasonFinalized) return;
  const record = game.seasonTransition?.userRecord;
  const body = `<div class="season-end-modal">
    <p class="label">Fin de temporada ${game.seasonNumber || 1}</p>
    <h2>${record?.title ? 'Saliste campeón' : `Finalizaste ${escapeHtml(record?.label || '—')}`}</h2>
    <p class="muted">Elegí cómo continuar la próxima temporada.</p>
    <div class="row" style="margin-top:14px"><button id="btnContinueSameClub" class="primary">Seguir en ${escapeHtml(clubName(game.selectedClubId))}</button></div>
    <hr>
    <label for="seasonClubSelect">Cambiar de club</label>
    <select id="seasonClubSelect">${clubSelectOptionsMarkup()}</select>
    <div class="row" style="margin-top:12px"><button id="btnStartNextSeasonOther" class="ghost">Empezar nueva temporada con este club</button></div>
  </div>`;
  openModal(body);
  $('btnContinueSameClub')?.addEventListener('click', () => startNextSeason(game.selectedClubId));
  $('btnStartNextSeasonOther')?.addEventListener('click', () => startNextSeason(Number($('seasonClubSelect')?.value || game.selectedClubId)));
}

