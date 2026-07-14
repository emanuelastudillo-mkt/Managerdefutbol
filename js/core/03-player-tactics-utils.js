/* Estado de jugadores, disponibilidad, calendario anual, habilidades y utilidades tácticas. */

let playerLookupSource = null;
let playerLookupLength = -1;
let playerLookupIndex = new Map();
function refreshPlayerLookupIndex(){
  const players = Array.isArray(seed?.players) ? seed.players : [];
  if(playerLookupSource === players && playerLookupLength === players.length) return players;
  playerLookupSource = players;
  playerLookupLength = players.length;
  playerLookupIndex = new Map(players.map((player,index) => [Number(player.id), index]));
  return players;
}
function playerById(id){
  const playerId = Number(id);
  if(!Number.isFinite(playerId)) return undefined;
  const players = refreshPlayerLookupIndex();
  let index = playerLookupIndex.get(playerId);
  let player = Number.isInteger(index) ? players[index] : undefined;
  if(player && Number(player.id) === playerId) return player;
  playerLookupSource = null;
  refreshPlayerLookupIndex();
  index = playerLookupIndex.get(playerId);
  player = Number.isInteger(index) ? playerLookupSource[index] : undefined;
  return player && Number(player.id) === playerId ? player : undefined;
}
function playersByClub(clubId){ return seed.players.filter(p => p.clubId === clubId); }
function pendingIncomingTransfersCount(clubId=game?.selectedClubId){
  return (game?.pendingTransfers || []).filter(t => t.status === 'pending' && Number(t.toClubId) === Number(clubId)).length;
}
function firstTeamRosterCount(clubId=game?.selectedClubId){
  return playersByClub(Number(clubId)).length;
}
function hasFirstTeamRosterSpace(clubId=game?.selectedClubId, extra=1){
  return firstTeamRosterCount(clubId) + pendingIncomingTransfersCount(clubId) + Math.max(0, Number(extra) || 0) <= MAX_PLAYERS_PER_CLUB;
}
function hasFirstTeamRosterMinimumAfterRemoval(clubId=game?.selectedClubId, removeCount=1){
  return firstTeamRosterCount(clubId) - Math.max(0, Number(removeCount) || 0) >= MIN_PLAYERS_PER_CLUB;
}
function showRosterLimitNotice(){
  showNotice(`Plantel completo. Máximo ${MAX_PLAYERS_PER_CLUB} jugadores.`);
}
function showRosterMinimumNotice(){
  showNotice(`Plantel mínimo. Debés mantener al menos ${MIN_PLAYERS_PER_CLUB} jugadores.`);
}
function playerStatus(playerId){ return game?.playerStatus?.[playerId] || {}; }
function injuryActiveFromStatus(st){
  if(!game || !st) return false;
  if(Number.isFinite(Number(st.injuredUntilTurn))) return currentTurnIndex() < Number(st.injuredUntilTurn || 0);
  return st.injuredThrough !== undefined && game.matchdayIndex <= st.injuredThrough;
}
function isUnavailable(playerId){
  if(!game) return false;
  const st = playerStatus(playerId);
  return Boolean(injuryActiveFromStatus(st) || (st.suspendedThrough !== undefined && game.matchdayIndex <= st.suspendedThrough));
}
function isSuspended(playerId){
  const st = playerStatus(playerId);
  return Boolean(st.suspendedThrough !== undefined && game && game.matchdayIndex <= st.suspendedThrough);
}
function isInjured(playerId){
  const st = playerStatus(playerId);
  return Boolean(injuryActiveFromStatus(st));
}
function turnsRemaining(playerId){
  const st = playerStatus(playerId);
  if(!game || !st) return 0;
  if(Number.isFinite(Number(st.injuredUntilTurn))){
    return Math.max(0, Math.ceil(Number(st.injuredUntilTurn || 0) - currentTurnIndex()));
  }
  if(st.injuredThrough === undefined || game.matchdayIndex > st.injuredThrough) return 0;
  return Math.max(1, st.injuredThrough - game.matchdayIndex + 1);
}
function canUseInjuredAsSub(playerId){
  return Boolean(game && isInjured(playerId) && !isSuspended(playerId) && turnsRemaining(playerId) <= INJURED_SUB_MAX_TURNS);
}
function canBeStarter(playerId){
  return Boolean(playerId && !isUnavailable(playerId));
}
function canBeBench(playerId){
  if(!playerId) return false;
  if(isSuspended(playerId)) return false;
  if(isInjured(playerId)) return canUseInjuredAsSub(playerId);
  return true;
}
function canEnterMatch(playerId){
  return canBeBench(playerId) || canBeStarter(playerId);
}
function injuredSubPenaltyFactor(playerId){
  return canUseInjuredAsSub(playerId) ? INJURED_SUB_PENALTY : 1;
}
function benchOverallValue(player){
  return Math.round(effectiveOverall(player) * injuredSubPenaltyFactor(player.id));
}

function seasonPhase(){
  return game?.seasonPhase || (game?.seasonFinalized ? 'finalized' : 'regular');
}
function isPreseason(){ return seasonPhase() === 'preseason'; }
function isPostseason(){ return seasonPhase() === 'postseason'; }
function isRegularSeason(){ return seasonPhase() === 'regular'; }
function currentTurnIndex(){ return Number.isFinite(game?.globalTurn) ? game.globalTurn : 0; }
function turnStamp(extra={}){
  return { globalTurn:currentTurnIndex(), season:game?.seasonNumber || 1, phase:seasonPhase(), phaseTurn:game?.phaseTurn || 0, matchdayIndex:game?.matchdayIndex || 0, ...extra };
}
function turnCooldownLeft(last, cooldown){
  if(!last) return 0;
  const lastTurn = Number.isFinite(last.globalTurn) ? last.globalTurn : Number(last.absoluteTurn || last.matchdayIndex || 0);
  return Math.max(0, cooldown - (currentTurnIndex() - lastTurn));
}
function advanceGlobalTurn(){
  if(!game) return;
  game.globalTurn = currentTurnIndex() + 1;
}
function turnsToDays(value){
  return Math.max(0, Math.round((Number(value) || 0) * DAYS_PER_ADVANCE));
}
function daysToTurns(value){
  return Math.max(0, Math.round((Number(value) || 0) / Math.max(1, DAYS_PER_ADVANCE)));
}
function formatDays(value){
  const days = Math.max(0, Math.round(Number(value) || 0));
  return `${days} día${days === 1 ? '' : 's'}`;
}
function formatDaysFromTurns(value){
  return formatDays(turnsToDays(value));
}
function makeUtcDate(year, month, day){ return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))); }
function isoDateFromUtc(date){ return date.toISOString().slice(0, 10); }
function validIsoDate(value){ return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')); }
function addDaysToIsoDate(iso, days){
  const base = validIsoDate(iso) ? new Date(`${iso}T00:00:00Z`) : makeUtcDate(currentSeasonYear(), SEASON_START_MONTH, SEASON_START_DAY);
  base.setUTCDate(base.getUTCDate() + Math.round(Number(days) || 0));
  return isoDateFromUtc(base);
}
function daysBetweenIsoDates(startIso, endIso){
  if(!validIsoDate(startIso) || !validIsoDate(endIso)) return 0;
  const start = new Date(`${startIso}T00:00:00Z`);
  const end = new Date(`${endIso}T00:00:00Z`);
  return Math.round((end - start) / 86400000);
}
function isLeapYear(year){
  const y = Math.round(Number(year) || SEASON_START_YEAR);
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}
function daysInSeasonYear(year){ return isLeapYear(year) ? 366 : 365; }
function seasonYearForNumber(seasonNumber=1){
  return Math.round(SEASON_START_YEAR + Math.max(0, (Number(seasonNumber) || 1) - 1));
}
function currentSeasonYear(){
  return Math.round(Number(game?.seasonYear || 0)) || seasonYearForNumber(game?.seasonNumber || 1);
}
function seasonStartDateForYear(year=currentSeasonYear()){
  const safeDay = Math.min(SEASON_START_DAY, new Date(Date.UTC(year, SEASON_START_MONTH, 0)).getUTCDate());
  return isoDateFromUtc(makeUtcDate(year, SEASON_START_MONTH, safeDay));
}
function seasonEndDateForYear(year=currentSeasonYear()){
  return addDaysToIsoDate(seasonStartDateForYear(year), daysInSeasonYear(year) - 1);
}
function firstSundayOnOrAfterIso(iso){
  const date = new Date(`${iso}T00:00:00Z`);
  const offset = (7 - date.getUTCDay()) % 7;
  date.setUTCDate(date.getUTCDate() + offset);
  return isoDateFromUtc(date);
}
function firstAdvanceDateForSeason(year=currentSeasonYear()){
  return seasonStartDateForYear(year);
}
function leagueStartDateForSeason(year=currentSeasonYear()){
  return firstSundayOnOrAfterIso(addDaysToIsoDate(seasonStartDateForYear(year), PRESEASON_TURNS * DAYS_PER_ADVANCE));
}
function midseasonBreakStartsForSeason(year=currentSeasonYear()){
  const first = leagueStartDateForSeason(year);
  const afterRound = Math.max(0, Math.round(Number(MIDSEASON_BREAK_AFTER_ROUND || 0)));
  if(afterRound <= 0 || MIDSEASON_BREAK_DAYS <= 0) return '';
  return addDaysToIsoDate(first, afterRound * LEAGUE_ROUND_INTERVAL_DAYS);
}
function midseasonBreakEndsForSeason(year=currentSeasonYear()){
  const start = midseasonBreakStartsForSeason(year);
  return start ? addDaysToIsoDate(start, Math.max(0, MIDSEASON_BREAK_DAYS - 1)) : '';
}
function isMidseasonVacationDate(iso, year=currentSeasonYear()){
  const start = midseasonBreakStartsForSeason(year);
  const end = midseasonBreakEndsForSeason(year);
  if(!validIsoDate(iso) || !start || !end) return false;
  return daysBetweenIsoDates(start, iso) >= 0 && daysBetweenIsoDates(iso, end) >= 0;
}
function seasonDayFromDate(iso, year=currentSeasonYear()){
  const start = seasonStartDateForYear(year);
  const raw = daysBetweenIsoDates(start, validIsoDate(iso) ? iso : start) + 1;
  return clamp(raw, 1, daysInSeasonYear(year));
}
function nextUnplayedMatchDateForClub(state=game, clubId=null){
  if(!state || !Array.isArray(state.fixtures)) return '';
  const ownId = Number(clubId || state.selectedClubId || 0);
  if(!ownId) return '';
  for(let roundIndex=Math.max(0, Number(state.matchdayIndex || 0)); roundIndex<state.fixtures.length; roundIndex++){
    const round = state.fixtures[roundIndex];
    const match = (round.matches || []).find(m => !m.played && (Number(m.homeId) === ownId || Number(m.awayId) === ownId));
    if(match) return validIsoDate(match.date) ? match.date : (round.date || '');
  }
  return '';
}
function nextUnplayedMatchDate(state=game){
  if(!state || !Array.isArray(state.fixtures)) return '';
  let found = '';
  for(let roundIndex=Math.max(0, Number(state.matchdayIndex || 0)); roundIndex<state.fixtures.length; roundIndex++){
    const round = state.fixtures[roundIndex];
    (round.matches || []).forEach(match => {
      if(match.played) return;
      const date = validIsoDate(match.date) ? match.date : (round.date || '');
      if(validIsoDate(date) && (!found || daysBetweenIsoDates(found, date) < 0)) found = date;
    });
    if(found) return found;
  }
  return '';
}
function lastFixtureMatchDate(state=game){
  const dates = [];
  (state?.fixtures || []).forEach(round => {
    if(validIsoDate(round?.endDate)) dates.push(round.endDate);
    if(validIsoDate(round?.date)) dates.push(round.date);
    (round?.matches || []).forEach(match => {
      const date = validIsoDate(match?.date) ? match.date : round?.date;
      if(validIsoDate(date)) dates.push(date);
    });
  });
  if(!dates.length) return '';
  dates.sort((a,b)=>daysBetweenIsoDates(b,a));
  return dates[dates.length - 1];
}
function latestIsoDateInSeason(dates=[], year=currentSeasonYear()){
  const start = seasonStartDateForYear(year);
  const end = seasonEndDateForYear(year);
  const clean = (dates || []).filter(validIsoDate).filter(date => daysBetweenIsoDates(start, date) >= 0 && daysBetweenIsoDates(date, end) >= 0);
  if(!clean.length) return '';
  clean.sort((a,b)=>daysBetweenIsoDates(b,a));
  return clean[clean.length - 1];
}
function latestKnownCalendarDateForState(state=game, year=currentSeasonYear()){
  const dates = [state?.currentDate, state?.lastCalendarDate, lastFixtureMatchDate(state)];
  (state?.matchHistory || []).forEach(result => { if(validIsoDate(result?.date)) dates.push(result.date); });
  return latestIsoDateInSeason(dates, year);
}
function postseasonTotalTurnsFromStartDate(startDate, year=currentSeasonYear()){
  if(POSTSEASON_TURNS_CONFIG > 0) return POSTSEASON_TURNS_CONFIG;
  if(!validIsoDate(startDate)) return 0;
  const remainingDays = Math.max(0, daysBetweenIsoDates(startDate, seasonEndDateForYear(year)) + 1);
  return Math.ceil(remainingDays / Math.max(1, DAYS_PER_ADVANCE));
}
function ensurePostseasonCalendar(state=game, options={}){
  if(!state) return { startDate:'', totalTurns:0, repaired:false };
  const year = Math.round(Number(state.seasonYear || 0)) || seasonYearForNumber(state.seasonNumber || 1);
  const phaseTurn = Math.max(0, Math.round(Number(state.phaseTurn || 0)));
  const reset = Boolean(options.reset);
  let startDate = validIsoDate(state.postseasonStartDate) ? state.postseasonStartDate : '';
  let repaired = false;
  if(reset || !startDate){
    if(reset){
      const anchor = validIsoDate(options.anchorDate) ? options.anchorDate : (latestKnownCalendarDateForState(state, year) || lastFixtureMatchDate(state) || leagueStartDateForSeason(year));
      startDate = addDaysToIsoDate(anchor, DAYS_PER_ADVANCE);
    }else if(validIsoDate(state.currentDate) && phaseTurn > 0){
      startDate = addDaysToIsoDate(state.currentDate, -phaseTurn * DAYS_PER_ADVANCE);
    }else{
      const anchor = latestKnownCalendarDateForState(state, year) || lastFixtureMatchDate(state) || leagueStartDateForSeason(year);
      startDate = addDaysToIsoDate(anchor, DAYS_PER_ADVANCE);
    }
    repaired = true;
  }
  const seasonStart = seasonStartDateForYear(year);
  const seasonEnd = seasonEndDateForYear(year);
  if(validIsoDate(startDate) && daysBetweenIsoDates(startDate, seasonStart) > 0){ startDate = seasonStart; repaired = true; }
  if(validIsoDate(startDate) && daysBetweenIsoDates(seasonEnd, startDate) > 0){ startDate = seasonEnd; repaired = true; }
  let totalTurns = Math.max(0, Math.round(Number(state.postseasonTotalTurns || 0)));
  const expectedTurns = postseasonTotalTurnsFromStartDate(startDate, year);
  const impossibleTotal = POSTSEASON_TURNS_CONFIG <= 0 && totalTurns > Math.max(expectedTurns + phaseTurn + 7, expectedTurns + 14);
  if(reset || !totalTurns || impossibleTotal){
    totalTurns = expectedTurns;
    repaired = true;
  }
  state.postseasonStartDate = startDate;
  state.postseasonTotalTurns = totalTurns;
  return { startDate, totalTurns, repaired };
}
function dateForSeasonState(state=game){
  const year = Math.round(Number(state?.seasonYear || 0)) || seasonYearForNumber(state?.seasonNumber || 1);
  if(!state) return firstAdvanceDateForSeason(year);
  if(state.seasonFinalized || state.seasonPhase === 'finalized') return seasonEndDateForYear(year);
  if(state.seasonPhase === 'regular') return nextUnplayedMatchDateForClub(state, state.selectedClubId) || nextUnplayedMatchDate(state) || state.fixtures?.[state.matchdayIndex || 0]?.date || leagueStartDateForSeason(year);
  if(state.seasonPhase === 'postseason'){
    const calendar = ensurePostseasonCalendar(state);
    const startDate = validIsoDate(calendar.startDate) ? calendar.startDate : (lastFixtureMatchDate(state) ? addDaysToIsoDate(lastFixtureMatchDate(state), DAYS_PER_ADVANCE) : leagueStartDateForSeason(year));
    return addDaysToIsoDate(startDate, Math.max(0, Number(state.phaseTurn || 0)) * DAYS_PER_ADVANCE);
  }
  if(state.seasonPhase === 'preseason'){
    return addDaysToIsoDate(firstAdvanceDateForSeason(year), Math.max(0, Number(state.phaseTurn || 0)) * DAYS_PER_ADVANCE);
  }
  return validIsoDate(state.currentDate) ? state.currentDate : firstAdvanceDateForSeason(year);
}
function daysUntilTurn(targetTurn){
  return turnsToDays(Math.max(0, Number(targetTurn || 0) - currentTurnIndex()));
}
function currentGlobalDayNumber(){
  return seasonDayFromDate(game?.currentDate || dateForSeasonState(game), currentSeasonYear());
}
function currentSeasonFixtureCount(){ return game?.fixtures?.length || seed?.fixtures?.length || 0; }
function postseasonTurnsForSeason(seasonOrYear=null, fixtureCount=null){
  const year = Number(seasonOrYear || 0) > 1900 ? Math.round(Number(seasonOrYear)) : seasonYearForNumber(seasonOrYear || game?.seasonNumber || 1);
  if(POSTSEASON_TURNS_CONFIG > 0) return POSTSEASON_TURNS_CONFIG;
  if(game && game.seasonPhase === 'postseason' && Math.round(Number(game.seasonYear || 0) || currentSeasonYear()) === year){
    return ensurePostseasonCalendar(game).totalTurns || 0;
  }
  const fixtures = Number.isFinite(Number(fixtureCount)) ? Math.max(0, Number(fixtureCount)) : currentSeasonFixtureCount();
  const lastDate = lastFixtureMatchDate(game);
  const usedDays = lastDate ? seasonDayFromDate(lastDate, year) : ((PRESEASON_TURNS * DAYS_PER_ADVANCE) + (fixtures * LEAGUE_ROUND_INTERVAL_DAYS));
  const remainingDays = Math.max(0, daysInSeasonYear(year) - usedDays);
  return Math.ceil(remainingDays / DAYS_PER_ADVANCE);
}
function postseasonTurnsForCurrentSeason(){
  if(game && game.seasonPhase === 'postseason') return ensurePostseasonCalendar(game).totalTurns || 0;
  return postseasonTurnsForSeason(currentSeasonYear(), currentSeasonFixtureCount());
}
function totalSeasonTurnCount(){
  return PRESEASON_TURNS + currentSeasonFixtureCount() + postseasonTurnsForCurrentSeason();
}
function totalSeasonDayCount(){ return daysInSeasonYear(currentSeasonYear()); }
function currentSeasonTurnNumber(){
  if(!game) return 0;
  const regularCount = currentSeasonFixtureCount();
  if(game.seasonFinalized || seasonPhase() === 'finalized') return totalSeasonTurnCount();
  if(isPreseason()) return clamp((game.phaseTurn || 0) + 1, 1, totalSeasonTurnCount());
  if(isPostseason()) return clamp(PRESEASON_TURNS + regularCount + (game.phaseTurn || 0) + 1, 1, totalSeasonTurnCount());
  return clamp(PRESEASON_TURNS + (game.matchdayIndex || 0) + 1, 1, totalSeasonTurnCount());
}
function currentSeasonDayNumber(){ return currentGlobalDayNumber(); }
function phaseDayRangeLabel(completedSteps, totalSteps){
  const totalDays = turnsToDays(totalSteps);
  const start = (Math.max(0, Number(completedSteps || 0)) * DAYS_PER_ADVANCE) + 1;
  const end = Math.min(start + DAYS_PER_ADVANCE - 1, totalDays);
  return `Días ${start}-${end} de ${totalDays}`;
}
function yearStatusLabel(year=currentSeasonYear()){
  return `${year}${isLeapYear(year) ? ' · bisiesto' : ''}`;
}
function phaseLabel(){
  if(!game) return '—';
  const year = currentSeasonYear();
  const totalDays = totalSeasonDayCount();
  const currentDay = currentSeasonDayNumber();
  if(game.seasonFinalized || seasonPhase() === 'finalized') return `Día ${totalDays} / ${totalDays} · ${yearStatusLabel(year)} · Temporada finalizada`;
  if(isPreseason()) return `Día ${currentDay} / ${totalDays} · ${yearStatusLabel(year)} · Pretemporada ${phaseDayRangeLabel(game.phaseTurn || 0, PRESEASON_TURNS)}`;
  if(isPostseason()) return `Día ${currentDay} / ${totalDays} · ${yearStatusLabel(year)} · Postemporada ${phaseDayRangeLabel(game.phaseTurn || 0, postseasonTurnsForCurrentSeason())}`;
  const nextDate = nextUnplayedMatchDateForClub(game, game.selectedClubId) || nextUnplayedMatchDate(game);
  const vacation = isMidseasonVacationDate(game.currentDate || nextDate || '', year) ? ' · Vacaciones' : '';
  return `Día ${currentDay} / ${totalDays} · ${yearStatusLabel(year)} · Liga ${Math.min((game.matchdayIndex || 0) + 1, game.fixtures?.length || seed.fixtures.length)} / ${game.fixtures?.length || seed.fixtures.length}${vacation}`;
}
function preseasonFriendliesPlayed(){ return Number(game?.preseasonFriendliesPlayed || 0); }
function canPlayPreseasonFriendly(){ return isPreseason() && preseasonFriendliesPlayed() < MAX_PRESEASON_FRIENDLIES; }
function statusText(playerId){
  if(!game) return 'Disponible';
  const st = playerStatus(playerId);
  const parts = [];
  if(st.injuredThrough !== undefined && game.matchdayIndex <= st.injuredThrough){
    parts.push(`${st.injuryLabel || 'Lesión'}`.trim());
  }
  if(st.suspendedThrough !== undefined && game.matchdayIndex <= st.suspendedThrough) parts.push('Suspendido');
  return parts.length ? parts.join(' · ') : 'Disponible';
}
function hashNumber(seedValue, max){
  let h = 2166136261;
  const str = String(seedValue);
  for(let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0) % max;
}
function playerAgeSkillPenalty(playerOrId){
  if(!PLAYER_AGE_DECAY_ENABLED || !game) return 0;
  const providedPlayer = typeof playerOrId === 'object' ? playerOrId : null;
  const id = Number(providedPlayer?.id || playerOrId);
  if(!id) return 0;
  const player = providedPlayer || (seed?.players || []).find(item => Number(item?.id) === id) || (game?.marketPlayers || []).find(item => Number(item?.id) === id) || null;
  if(player && Math.round(Number(player.age || 18)) < PLAYER_AGE_DECAY_START_AGE){
    if(game.playerAgeSkillPenalties && Number(game.playerAgeSkillPenalties[id] || 0) !== 0) game.playerAgeSkillPenalties[id] = 0;
    return 0;
  }
  const value = Math.round(Number(game?.playerAgeSkillPenalties?.[id] || 0));
  return clamp(value, 0, PLAYER_AGE_DECAY_CAP);
}
function playerTrainingSkillBoost(p, skillName){
  if(!p || !game) return 0;
  return Math.max(0, Math.round(Number(game?.playerSkillBoosts?.[p.id]?.[skillName] || 0)));
}
function rawSkillValue(p, skillName){
  return clamp(Math.round(p?.skills?.[skillName] ?? p?.overall ?? 50), 1, 99);
}
function baseSkill(p, skillName){
  const base = rawSkillValue(p, skillName);
  const boost = playerTrainingSkillBoost(p, skillName);
  const agePenalty = playerAgeSkillPenalty(p);
  return clamp(base - agePenalty + boost, 1, 99);
}
function rawVisibleSkill(p, skillName){
  return rawSkillValue(p, skillName);
}
function hiddenStats(p){
  const manualAggression = Number(p?.skills?.agresividad);
  const manualGenetics = Number(p?.skills?.genetica);
  const manualSurprise = Number(p?.skills?.factorSorpresa);
  const aggression = Number.isFinite(manualAggression) ? clamp(Math.round(manualAggression), 1, 99) : clamp(Math.round(100 - (p.skills.disciplina || 50) + hashNumber(`ag${p.id}`, 18) - 8), 1, 99);
  const genetics = Number.isFinite(manualGenetics) ? clamp(Math.round(manualGenetics), 1, 99) : clamp(Math.round(45 + hashNumber(`ge${p.id}`, 55)), 1, 99);
  const surprise = Number.isFinite(manualSurprise) ? clamp(Math.round(manualSurprise), 0, 20) : clamp(hashNumber(`su${p.id}`, 21), 0, 20);
  return { aggression, genetics, surprise };
}

function captaincyMaximum(p){
  if(!p || !CAPTAINCY_ENABLED) return 0;
  const components = [
    [baseSkill(p, 'liderazgo'), configNumber('capitania.pesosMaximo.liderazgo', 0.35, 0, 1)],
    [baseSkill(p, 'serenidad'), configNumber('capitania.pesosMaximo.serenidad', 0.20, 0, 1)],
    [baseSkill(p, 'disciplina'), configNumber('capitania.pesosMaximo.disciplina', 0.15, 0, 1)],
    [baseSkill(p, 'trabajoEquipo'), configNumber('capitania.pesosMaximo.trabajoEquipo', 0.15, 0, 1)],
    [baseSkill(p, 'posicionamiento'), configNumber('capitania.pesosMaximo.posicionamiento', 0.10, 0, 1)],
    [baseSkill(p, 'resistencia'), configNumber('capitania.pesosMaximo.resistencia', 0.05, 0, 1)]
  ];
  const totalWeight = components.reduce((sum, item) => sum + Number(item[1] || 0), 0) || 1;
  const score = components.reduce((sum, item) => sum + Number(item[0] || 0) * Number(item[1] || 0), 0) / totalWeight;
  return clamp(Math.round(score), 1, CAPTAINCY_MAX_PERCENT);
}
function captaincyLearningScore(p){
  if(!p) return 1;
  const leadershipWeight = configNumber('capitania.aprendizaje.pesoLiderazgo', 0.40, 0, 1);
  const serenityWeight = configNumber('capitania.aprendizaje.pesoSerenidad', 0.25, 0, 1);
  const disciplineWeight = configNumber('capitania.aprendizaje.pesoDisciplina', 0.20, 0, 1);
  const teamworkWeight = configNumber('capitania.aprendizaje.pesoTrabajoEquipo', 0.15, 0, 1);
  const total = leadershipWeight + serenityWeight + disciplineWeight + teamworkWeight || 1;
  return clamp(Math.round((
    baseSkill(p,'liderazgo') * leadershipWeight
    + baseSkill(p,'serenidad') * serenityWeight
    + baseSkill(p,'disciplina') * disciplineWeight
    + baseSkill(p,'trabajoEquipo') * teamworkWeight
  ) / total), 1, 99);
}
function captaincyProgressGain(p){
  const maximum = captaincyMaximum(p);
  if(!maximum) return 0;
  const learning = captaincyLearningScore(p);
  const factor = CAPTAINCY_LEARNING_FACTOR_MIN + ((learning - 1) / 98) * (CAPTAINCY_LEARNING_FACTOR_MAX - CAPTAINCY_LEARNING_FACTOR_MIN);
  return Math.max(1, Math.ceil((maximum / CAPTAINCY_TARGET_MATCHES) * factor));
}
function normalizeCaptaincyProgressState(source={}){
  const src = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
  const clean = {};
  Object.entries(src).forEach(([key, raw]) => {
    const playerId = Number(key || raw?.playerId || 0);
    if(!playerId) return;
    const player = seed?.players?.find(item => Number(item.id) === playerId);
    if(!player) return;
    const entry = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : { percent:Number(raw || 0) };
    const clubId = Number(entry.clubId || player.clubId || 0);
    if(!clubId || Number(player.clubId || 0) !== clubId) return;
    clean[playerId] = {
      playerId,
      clubId,
      percent:clamp(Math.round(Number(entry.percent || entry.value || 0)), 0, CAPTAINCY_MAX_PERCENT),
      matches:Math.max(0, Math.round(Number(entry.matches || 0))),
      updatedSeason:Math.max(1, Math.round(Number(entry.updatedSeason || game?.seasonNumber || 1))),
      updatedAt:String(entry.updatedAt || '')
    };
  });
  return clean;
}
function ensureCaptaincyProgressState(){
  if(!game) return {};
  game.captaincyProgress = normalizeCaptaincyProgressState(game.captaincyProgress || {});
  if(!game.captaincyAppliedMatches || typeof game.captaincyAppliedMatches !== 'object' || Array.isArray(game.captaincyAppliedMatches)) game.captaincyAppliedMatches = {};
  return game.captaincyProgress;
}
function captaincyEntry(playerId, create=true){
  if(!game || !CAPTAINCY_ENABLED) return null;
  const id = Number(playerId || 0);
  const player = playerById(id);
  if(!id || !player || !Number(player.clubId || 0)) return null;
  const store = ensureCaptaincyProgressState();
  let entry = store[id];
  if(entry && Number(entry.clubId) !== Number(player.clubId)){
    delete store[id];
    entry = null;
  }
  if(!entry && create){
    entry = { playerId:id, clubId:Number(player.clubId), percent:0, matches:0, updatedSeason:Number(game.seasonNumber || 1), updatedAt:'' };
    store[id] = entry;
  }
  return entry || null;
}
function resetPlayerCaptaincyProgress(playerId, clubId=0){
  if(!game?.captaincyProgress) return false;
  const id = Number(playerId || 0);
  const entry = game.captaincyProgress[id];
  if(!entry) return false;
  if(clubId && Number(entry.clubId || 0) !== Number(clubId)) return false;
  delete game.captaincyProgress[id];
  return true;
}
function captaincyValue(playerId){
  const player = playerById(playerId);
  if(!player) return 0;
  const entry = captaincyEntry(playerId, false);
  return clamp(Math.round(Math.min(Number(entry?.percent || 0), captaincyMaximum(player))), 0, CAPTAINCY_MAX_PERCENT);
}
function captaincyMatches(playerId){
  return Math.max(0, Math.round(Number(captaincyEntry(playerId, false)?.matches || 0)));
}
function bestCaptainForStarterIds(ids=[]){
  const candidates = (ids || []).map(Number).filter(Boolean).map(playerById).filter(Boolean);
  return candidates.sort((a,b) => captaincyMaximum(b) - captaincyMaximum(a) || baseSkill(b,'liderazgo') - baseSkill(a,'liderazgo') || baseSkill(b,'serenidad') - baseSkill(a,'serenidad') || visibleOverall(b) - visibleOverall(a) || Number(a.id)-Number(b.id))[0] || null;
}
function normalizedCaptainIdForTactic(clubId, tactic){
  if(!CAPTAINCY_ENABLED) return 0;
  const starters = (tactic?.starters || []).map(Number).filter(Boolean);
  const starterSet = new Set(starters);
  const selected = Number(tactic?.captainId || 0);
  const player = playerById(selected);
  if(selected && starterSet.has(selected) && player && Number(player.clubId || 0) === Number(clubId || 0)) return selected;
  return Number(bestCaptainForStarterIds(starters)?.id || 0);
}
function ensureTacticCaptain(tactic, clubId=game?.selectedClubId){
  const clean = tactic && typeof tactic === 'object' ? tactic : {};
  return { ...clean, captainId:normalizedCaptainIdForTactic(clubId, clean) };
}
function captaincyEffectForPercent(percent){
  const value = clamp(Math.round(Number(percent || 0)), 0, CAPTAINCY_MAX_PERCENT);
  const fallback = [
    { minimo:80, maximo:99, moral:1, cohesion:2 },
    { minimo:40, maximo:79, moral:0, cohesion:1 },
    { minimo:20, maximo:39, moral:-1, cohesion:0 },
    { minimo:0, maximo:19, moral:-3, cohesion:-2 }
  ];
  const effects = configValue('capitania.efectos', fallback);
  const list = Array.isArray(effects) && effects.length ? effects : fallback;
  const found = list.find(item => value >= Number(item?.minimo ?? 0) && value <= Number(item?.maximo ?? 99)) || fallback[fallback.length-1];
  return { moral:Math.round(Number(found.moral || 0)), cohesion:Math.round(Number(found.cohesion || 0)), minimum:Number(found.minimo || 0), maximum:Number(found.maximo || 99) };
}
function captaincyMatchKey(match){
  return `${Number(game?.seasonNumber || 1)}:${String(match?.id || `${match?.date || game?.currentDate || ''}-${match?.homeId || 0}-${match?.awayId || 0}-${match?.homeGoals ?? 'x'}-${match?.awayGoals ?? 'x'}`)}`;
}
function applyCaptaincyAfterMatch(match){
  if(!game || !CAPTAINCY_ENABLED || game.gameOver?.active || !match?.played) return null;
  const ownClubId = Number(game.selectedClubId || 0);
  const isHome = Number(match.homeId || 0) === ownClubId;
  const isAway = Number(match.awayId || 0) === ownClubId;
  if(!ownClubId || (!isHome && !isAway)) return null;
  ensureCaptaincyProgressState();
  const matchKey = captaincyMatchKey(match);
  if(game.captaincyAppliedMatches[matchKey]){
    game.lastCaptaincyEffect = game.captaincyAppliedMatches[matchKey];
    return game.lastCaptaincyEffect;
  }
  game.lastCaptaincyEffect = null;
  const starters = (isHome ? (match.starterIdsHome || []) : (match.starterIdsAway || [])).map(Number).filter(Boolean);
  const storedCaptain = Number(isHome ? match.captainIdHome : match.captainIdAway);
  let captainId = storedCaptain || Number(game.tactic?.captainId || 0);
  if(!starters.includes(captainId)) captainId = Number(bestCaptainForStarterIds(starters)?.id || 0);
  const captain = playerById(captainId);
  if(!captain || Number(captain.clubId || 0) !== ownClubId || !starters.includes(captainId)) return null;
  const entry = captaincyEntry(captainId, true);
  const maximum = captaincyMaximum(captain);
  const before = clamp(Math.round(Number(entry.percent || 0)), 0, maximum);
  const baseGain = before >= maximum ? 0 : captaincyProgressGain(captain);
  const captainSupportBonus = typeof specialActiveBonus === 'function'
    ? Math.max(0, Math.round(Number(specialActiveBonus('apoyo_capitan') || 0)))
    : 0;
  const gain = before >= maximum ? 0 : Math.min(baseGain + captainSupportBonus, maximum - before);
  const after = clamp(before + gain, 0, maximum);
  entry.percent = after;
  entry.matches = Math.max(0, Math.round(Number(entry.matches || 0))) + 1;
  entry.updatedSeason = Number(game.seasonNumber || 1);
  entry.updatedAt = new Date().toISOString();
  const effect = captaincyEffectForPercent(after);
  let moraleAffected = 0;
  playersByClub(ownClubId).forEach(player => {
    if(!game.playerMorale) game.playerMorale = {};
    game.playerMorale[player.id] = clamp(Math.round(currentMorale(player.id) + effect.moral), 1, 99);
    moraleAffected += 1;
  });
  const cohesionApplied = typeof adjustTeamCohesion === 'function' ? adjustTeamCohesion(ownClubId, effect.cohesion) : 0;
  if(isHome) match.captainIdHome = captainId;
  else match.captainIdAway = captainId;
  const result = {
    matchKey,
    season:Number(game.seasonNumber || 1),
    clubId:ownClubId,
    playerId:captainId,
    playerName:String(captain.name || ''),
    before,
    after,
    maximum,
    gain,
    baseGain,
    captainSupportBonus,
    matches:entry.matches,
    moral:effect.moral,
    cohesion:cohesionApplied,
    requestedCohesion:effect.cohesion,
    moraleAffected,
    date:String(match.date || game.currentDate || '')
  };
  match.captaincyEffect = { ...result };
  game.captaincyAppliedMatches[matchKey] = result;
  const keys = Object.keys(game.captaincyAppliedMatches);
  if(keys.length > 500) keys.slice(0, keys.length - 500).forEach(key => delete game.captaincyAppliedMatches[key]);
  game.lastCaptaincyEffect = result;
  return result;
}
function applyCaptaincyAfterMatches(results=[]){
  let applied = null;
  (results || []).forEach(match => {
    const result = applyCaptaincyAfterMatch(match);
    if(result) applied = result;
  });
  return applied;
}
function captaincyEffectSummary(effect=game?.lastCaptaincyEffect){
  if(!effect) return '';
  const morale = Number(effect.moral || 0);
  const cohesion = Number(effect.cohesion || 0);
  const sign = value => value > 0 ? `+${value}` : String(value);
  const support = Number(effect.captainSupportBonus || 0) > 0 ? ` · cartas +${Number(effect.captainSupportBonus || 0)}%` : '';
  return `${playerLastName(effect.playerName || 'Capitán')} alcanzó ${Number(effect.after || 0)}% de capitanía (${Number(effect.before || 0)}% → ${Number(effect.after || 0)}%${support}). Moral ${sign(morale)} · cohesión ${sign(cohesion)}.`;
}

function effectiveSkill(p, skillName){
  const raw = baseSkill(p, skillName);
  return clamp(raw + hiddenStats(p).surprise, 1, 99);
}
function visibleStats(p, skillResolver=baseSkill){
  const val = (skillName) => skillResolver(p, skillName);
  if(p.position === 'POR'){
    return {
      Salto: Math.round(avg([val('cabezazo'), val('fuerza')])) || p.overall,
      Defensa: Math.round(avg([val('porteria'), val('posicionamiento')])) || p.overall,
      Pase: Math.round(avg([val('paseCorto'), val('paseLargo')])) || p.overall,
      Reflejos: Math.round(avg([val('porteria'), val('serenidad'), val('aceleracion')])) || p.overall,
      Mando: Math.round(avg([val('liderazgo'), val('trabajoEquipo'), val('serenidad')])) || p.overall,
      Potencia: Math.round(avg([val('fuerza'), val('paseLargo')])) || p.overall,
      Resistencia: val('resistencia')
    };
  }
  return {
    Ataque: Math.round(avg([val('remate'), val('regate'), val('posicionamiento')])) || p.overall,
    Defensa: Math.round(avg([val('marca'), val('entradas'), val('posicionamiento')])) || p.overall,
    Pase: Math.round(avg([val('paseCorto'), val('paseLargo'), val('vision')])) || p.overall,
    Velocidad: Math.round(avg([val('velocidad'), val('aceleracion')])) || p.overall,
    Cabezazo: val('cabezazo'),
    Tiro: val('remate'),
    Resistencia: val('resistencia')
  };
}

function lockedManualOverall(p){
  if(!p?.manualOverallLocked && !p?.overallLocked) return null;
  const value = Number(p?.overall || p?.media);
  return Number.isFinite(value) ? clamp(Math.round(value), 1, 99) : null;
}
function visibleOverall(p){
  const locked = lockedManualOverall(p);
  if(locked !== null) return clamp(locked - playerAgeSkillPenalty(p), 1, 99);
  return clamp(Math.round(avg(Object.values(visibleStats(p)))), 1, 99);
}
function rawVisibleOverall(p){
  const locked = lockedManualOverall(p);
  if(locked !== null) return locked;
  return clamp(Math.round(avg(Object.values(visibleStats(p, rawVisibleSkill)))), 1, 99);
}
function effectiveOverall(p){
  const locked = lockedManualOverall(p);
  if(locked !== null) return clamp(locked - playerAgeSkillPenalty(p), 1, 99);
  const simulated = {
    Ataque: Math.round(avg([effectiveSkill(p,'remate'), effectiveSkill(p,'regate'), effectiveSkill(p,'posicionamiento')])) || p.overall,
    Defensa: Math.round(avg([effectiveSkill(p,'marca'), effectiveSkill(p,'entradas'), effectiveSkill(p,'posicionamiento')])) || p.overall,
    Pase: Math.round(avg([effectiveSkill(p,'paseCorto'), effectiveSkill(p,'paseLargo'), effectiveSkill(p,'vision')])) || p.overall,
    Velocidad: Math.round(avg([effectiveSkill(p,'velocidad'), effectiveSkill(p,'aceleracion')])) || p.overall,
    Cabezazo: effectiveSkill(p,'cabezazo'),
    Tiro: effectiveSkill(p,'remate'),
    Resistencia: effectiveSkill(p,'resistencia')
  };
  return clamp(Math.round(avg(Object.values(simulated))), 1, 99);
}
function ensurePlayerWearState(){
  if(!game) return {};
  if(!game.playerWear || typeof game.playerWear !== 'object' || Array.isArray(game.playerWear)) game.playerWear = {};
  return game.playerWear;
}
function currentPlayerWear(playerId){
  if(!game || !PLAYER_WEAR_ENABLED) return 0;
  const wear = ensurePlayerWearState();
  const value = Number(wear[playerId] || 0);
  if(!Number.isFinite(value)) wear[playerId] = 0;
  return clamp(Math.round(Number(wear[playerId] || 0)), 0, PLAYER_WEAR_MAX);
}
function maxConditionForPlayer(playerId){
  return clamp(99 - currentPlayerWear(playerId), 1, 99);
}
function adjustPlayerWear(playerId, delta){
  if(!game || !PLAYER_WEAR_ENABLED || !playerId) return 0;
  const wear = ensurePlayerWearState();
  const before = currentPlayerWear(playerId);
  const next = clamp(Math.round(before + Number(delta || 0)), 0, PLAYER_WEAR_MAX);
  wear[playerId] = next;
  if(game.playerCondition && Number.isFinite(Number(game.playerCondition[playerId]))){
    game.playerCondition[playerId] = Math.min(Math.round(Number(game.playerCondition[playerId] || 0)), maxConditionForPlayer(playerId));
  }
  return next - before;
}
function currentCondition(playerId){
  if(!game) return 99;
  if(!game.playerCondition) game.playerCondition = {};
  if(!Number.isFinite(game.playerCondition[playerId])) game.playerCondition[playerId] = maxConditionForPlayer(playerId);
  const raw = Math.round(Number(game.playerCondition[playerId] || 0));
  return clamp(Math.min(raw, maxConditionForPlayer(playerId)), 0, 99);
}
function fatiguePoints(playerId){
  return clamp(99 - currentCondition(playerId), 0, 99);
}
function highParticipationInjuryRiskForPlayer(playerId){
  const played = Math.max(0, Math.round(Number(game?.playerStats?.[playerId]?.played || 0)));
  const ratio = played / Math.max(1, HIGH_PARTICIPATION_REFERENCE_MATCHES);
  if(ratio < HIGH_PARTICIPATION_INJURY_THRESHOLD){
    return { active:false, played, reference:HIGH_PARTICIPATION_REFERENCE_MATCHES, ratio, chance:0, overload:0 };
  }
  const denominator = Math.max(0.01, 1 - HIGH_PARTICIPATION_INJURY_THRESHOLD);
  const overload = clamp((ratio - HIGH_PARTICIPATION_INJURY_THRESHOLD) / denominator, 0, 1);
  const chance = clamp(HIGH_PARTICIPATION_INJURY_CHANCE_MIN + (HIGH_PARTICIPATION_INJURY_CHANCE_MAX - HIGH_PARTICIPATION_INJURY_CHANCE_MIN) * overload, 0, 0.95);
  return { active:true, played, reference:HIGH_PARTICIPATION_REFERENCE_MATCHES, ratio, chance, overload };
}
function injuryChanceForPlayer(playerId, pitchCondition='Normal'){
  const pitch = PITCH_CONDITIONS[pitchCondition] || PITCH_CONDITIONS.Normal;
  const rawChance = BASE_INJURY_CHANCE + Math.floor(fatiguePoints(playerId) / FATIGUE_INJURY_STEP) * FATIGUE_INJURY_BONUS + pitch.injuryBonus;
  const baseChance = clamp(rawChance * INJURY_CHANCE_MULTIPLIER, 0, 0.65);
  const highLoad = highParticipationInjuryRiskForPlayer(playerId);
  return clamp(Math.max(baseChance, highLoad.active ? highLoad.chance : 0), 0, 0.95);
}
function availabilityIcons(playerId){
  const icons = [];
  if(isInjured(playerId)) icons.push('<span class="injury-cross inline" title="Lesionado">✚</span>');
  if(isSuspended(playerId)) icons.push('<span class="red-card status-red-card inline" title="Expulsado / suspendido">■</span>');
  return icons.join('');
}
function availabilityStatusMarkup(playerId){
  const unavailable = isUnavailable(playerId);
  const icons = availabilityIcons(playerId);
  if(icons) return `<span class="availability-status ${unavailable ? 'bad' : 'ok'}">${icons}<span>${escapeHtml(statusText(playerId))}</span></span>`;
  return `<span class="${unavailable ? 'bad' : 'ok'}">${escapeHtml(statusText(playerId))}</span>`;
}
function weightedInjuryPickFrom(table){
  const source = Array.isArray(table) && table.length ? table : INJURY_TABLE;
  const total = source.reduce((sum, item) => sum + Number(item.probability || 0), 0);
  let roll = Math.random() * Math.max(1, total);
  for(const item of source){
    roll -= Number(item.probability || 0);
    if(roll <= 0) return item;
  }
  return source[source.length - 1];
}
function pickInjuryType(){
  return weightedInjuryPickFrom(INJURY_TABLE);
}
function pickLongInjuryType(){
  const longTable = INJURY_TABLE.filter(item => Number(item.maxTurns || 0) >= HIGH_PARTICIPATION_LONG_INJURY_MIN_TURNS || ['Rotura','Fractura'].includes(item.name));
  return weightedInjuryPickFrom(longTable.length ? longTable : INJURY_TABLE);
}
function pickInjuryTypeForPlayer(playerId){
  const highLoad = highParticipationInjuryRiskForPlayer(playerId);
  if(highLoad.active && Math.random() < HIGH_PARTICIPATION_LONG_INJURY_RATE){
    const injury = pickLongInjuryType();
    return { ...injury, highLoad:true, highLoadChance:highLoad.chance, highLoadRatio:highLoad.ratio, highLoadPlayed:highLoad.played, highLoadReference:highLoad.reference };
  }
  return pickInjuryType();
}
function injuredPlayersByClub(clubId){
  return playersByClub(clubId)
    .map(player => ({ player, status:playerStatus(player.id), remaining:turnsRemaining(player.id) }))
    .filter(item => item.remaining > 0)
    .sort((a,b)=>b.remaining-a.remaining || a.player.name.localeCompare(b.player.name));
}
function injuredHomeCard(item){
  const p = item.player;
  return `<div class="injured-home-player">
    ${faceImg(p, 'injured-home-face')}
    <div class="injured-home-info">
      <button class="linklike" data-player-id="${p.id}">${availabilityIcons(p.id)}${escapeHtml(p.name)}</button>
      <span>${escapeHtml(item.status.injuryLabel || 'Lesión')} · ${formatDaysFromTurns(item.remaining)} · Fís. ${currentCondition(p.id)}/99${canUseInjuredAsSub(p.id) ? ' · Banco permitido' : ''}</span>
    </div>
  </div>`;
}
function squadFitnessAverage(clubId){
  const squad = playersByClub(clubId);
  return Math.round(avg(squad.map(p => currentCondition(p.id)))) || 0;
}
function conditionFactor(playerId){
  return 0.5 + 0.5 * (currentCondition(playerId) / 99);
}
function compactValueCircle(value, kind, label){
  const clean = clamp(Math.round(Number(value) || 0), kind === 'morale' ? 1 : 0, 99);
  const colorClass = clean < 40 ? 'low' : clean < 70 ? 'mid' : 'high';
  const deg = Math.round((clean / 99) * 360);
  return `<span class="value-circle ${kind}-circle ${colorClass}" style="--value-deg:${deg}deg" title="${escapeHtml(label)} ${clean}/99"><strong>${clean}</strong></span>`;
}
function conditionBar(playerId){
  const condition = currentCondition(playerId);
  const wear = currentPlayerWear(playerId);
  const maxCondition = maxConditionForPlayer(playerId);
  if(!wear) return compactValueCircle(condition, 'condition', 'Estado físico');
  const degMax = Math.round((maxCondition / 99) * 360);
  return `<span class="condition-wear-wrap" title="Estado físico ${condition}/99 · Máximo por desgaste ${maxCondition}/99 · Desgaste ${wear}">${compactValueCircle(condition, 'condition', 'Estado físico')}<span class="condition-wear-max" style="--wear-max-deg:${degMax}deg"></span><small>Desg. ${wear}</small></span>`;
}

function currentMorale(playerId){
  if(!game) return PLAYER_MORALE_START;
  if(!game.playerMorale) game.playerMorale = {};
  if(!Number.isFinite(game.playerMorale[playerId])) game.playerMorale[playerId] = PLAYER_MORALE_START;
  return clamp(Math.round(game.playerMorale[playerId]), 1, 99);
}
function adjustSquadMorale(clubId, delta, excludedPlayerId = 0){
  if(!game || !Number(clubId)) return { affected:0, totalChange:0 };
  game.playerMorale = game.playerMorale || {};
  const change = Number(delta || 0);
  let affected = 0;
  let totalChange = 0;
  playersByClub(clubId).forEach(player => {
    if(Number(player.id) === Number(excludedPlayerId)) return;
    const before = currentMorale(player.id);
    const after = clamp(Math.round(before + change), 1, 99);
    game.playerMorale[player.id] = after;
    if(after !== before) affected += 1;
    totalChange += after - before;
  });
  return { affected, totalChange };
}
function moraleFactor(playerId){
  return 0.92 + (currentMorale(playerId) / 99) * 0.16;
}
function moraleBar(playerId){
  return compactValueCircle(currentMorale(playerId), 'morale', 'Moral');
}
function squadMoraleAverage(clubId){
  const squad = playersByClub(clubId);
  return Math.round(avg(squad.map(p => currentMorale(p.id)))) || 0;
}
function matchSkill(p, skillName){
  return clamp(Math.round(effectiveSkill(p, skillName) * conditionFactor(p.id) * moraleFactor(p.id) * injuredSubPenaltyFactor(p.id)), 1, 99);
}
function jerseyNumber(playerId){
  const p = playerById(playerId);
  if(!p) return 0;
  const ordered = playersByClub(p.clubId).slice().sort((a,b)=> positionOrder(a.position)-positionOrder(b.position) || visibleOverall(b)-visibleOverall(a) || a.id-b.id);
  const idx = ordered.findIndex(x=>x.id===p.id);
  return idx >= 0 ? idx + 1 : 0;
}
function playerLastName(name){
  const parts = String(name || '').trim().split(/\s+/);
  return parts[parts.length-1] || name || 'Jugador';
}
function countryCode(nationality){
  const map = {
    Argentina:'ARG', Brasil:'BRA', Uruguay:'URU', Paraguay:'PAR', Chile:'CHI', Bolivia:'BOL', 'Perú':'PER', Ecuador:'ECU', Colombia:'COL', Venezuela:'VEN',
    España:'ESP', Italia:'ITA', Francia:'FRA', Alemania:'ALE', Portugal:'POR', Inglaterra:'ING', México:'MEX', 'Estados Unidos':'USA', Japón:'JPN', 'Corea del Sur':'KOR', Marruecos:'MAR', Nigeria:'NGA', Ghana:'GHA'
  };
  return map[nationality] || String(nationality || '---').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z]/g,'').slice(0,3).toUpperCase().padEnd(3,'-');
}
function nationalityShortMarkup(nationality){
  return `<span class="pill nationality-code" title="${escapeHtml(nationality || 'Sin nacionalidad')}">${escapeHtml(countryCode(nationality))}</span>`;
}
function roleMeta(position){
  const map = {
    POR:{ code:'POR', name:'Portero', icon:'', group:'gk' },
    DFC:{ code:'DFC', name:'Defensa central', icon:'', group:'def' },
    LI:{ code:'LI', name:'Lateral izquierdo', icon:'', group:'def' },
    LD:{ code:'LD', name:'Lateral derecho', icon:'', group:'def' },
    MCD:{ code:'MCD', name:'Mediocentro defensivo', icon:'', group:'mid' },
    MC:{ code:'MC', name:'Mediocentro', icon:'', group:'mid' },
    MI:{ code:'MI', name:'Mediocampista izquierdo', icon:'', group:'mid' },
    MD:{ code:'MD', name:'Mediocampista derecho', icon:'', group:'mid' },
    MCO:{ code:'MCO', name:'Mediocentro ofensivo', icon:'', group:'mid' },
    EI:{ code:'EI', name:'Extremo izquierdo', icon:'', group:'att' },
    ED:{ code:'ED', name:'Extremo derecho', icon:'', group:'att' },
    DC:{ code:'DC', name:'Delantero centro', icon:'', group:'att' },
    VOL:{ code:'MC', name:'Mediocentro', icon:'', group:'mid' }
  };
  return map[position] || { code:position, name:position, icon:'', group:'mid' };
}
function roleBadge(position){
  return roleMeta(position).code;
}

function normalizePlayerPosition(position, playerId=0){
  const pos = String(position || '').toUpperCase();
  const aliases = { ARQ:'POR', CAI:'LI', CAD:'LD', SD:'DC', VOL:'MC' };
  if(aliases[pos]) return aliases[pos];
  if(pos === 'EXT') return (Number(playerId) || 0) % 2 === 0 ? 'ED' : 'EI';
  const valid = ['POR','LD','LI','DFC','MCD','MC','MI','MD','MCO','ED','EI','DC'];
  return valid.includes(pos) ? pos : 'MC';
}
function normalizeAllPlayerPositions(){
  if(!seed?.players) return;
  seed.players.forEach(player => { player.position = normalizePlayerPosition(player.position, player.id); });
}
function playerRoleGroup(position){
  const pos = normalizePlayerPosition(position);
  if(pos === 'POR') return 'POR';
  if(['LD','LI','DFC'].includes(pos)) return 'DEF';
  if(['MCD','MC','MI','MD','MCO'].includes(pos)) return 'MID';
  return 'ATT';
}

function weightedRulePick(items, seedKey){
  const list = (items || []).filter(item => Number(item.probability) > 0);
  if(!list.length) return (items || [])[0] || null;
  const total = list.reduce((sum,item)=>sum + Number(item.probability || 0), 0);
  let roll = (hashNumber(seedKey, 1000000) / 1000000) * total;
  for(const item of list){
    roll -= Number(item.probability || 0);
    if(roll <= 0) return item;
  }
  return list[list.length - 1];
}
function nationalityGroupId(nationality){
  const nat = String(nationality || '');
  if(nat === 'Argentina') return 'argentinos';
  const south = PLAYER_GENERATION_NATIONALITY_GROUPS.find(g=>g.id==='sudamerica')?.countries || [];
  if(south.includes(nat)) return 'sudamerica';
  return 'resto_del_mundo';
}
function mediaRangeIdForOverall(media){
  const value = Math.round(Number(media) || 0);
  return (PLAYER_GENERATION_MEDIA_RANGES.find(range => value >= range.media_min && value <= range.media_max) || PLAYER_GENERATION_MEDIA_RANGES[PLAYER_GENERATION_MEDIA_RANGES.length - 1]).id;
}
function mediaRangeForOverall(media){
  const value = Math.round(Number(media) || 0);
  return PLAYER_GENERATION_MEDIA_RANGES.find(range => value >= range.media_min && value <= range.media_max) || PLAYER_GENERATION_MEDIA_RANGES[PLAYER_GENERATION_MEDIA_RANGES.length - 1];
}
function createPlayerGenerationContext(targetTotal=0, activePlayers=[]){
  return { targetTotal:Math.max(1, Math.round(Number(targetTotal) || 0)), activePlayers:Array.isArray(activePlayers) ? activePlayers.slice() : [], created:[] };
}
function contextPlayersForGeneration(context){
  if(!context) return [];
  return (context.activePlayers || []).concat(context.created || []).filter(player => player && !player.retired && !player.sold && Number(player.clubId || 0) >= 0);
}
function registerGeneratedPlayer(context, player){
  if(context && player) context.created.push(player);
}
function underTargetRules(rules, selector, context){
  if(!context) return [];
  const players = contextPlayersForGeneration(context);
  const targetTotal = Math.max(players.length + 1, Number(context.targetTotal || 0));
  const counts = {};
  players.forEach(player => { const key = selector(player); counts[key] = (counts[key] || 0) + 1; });
  return rules.filter(rule => (counts[rule.id] || 0) < Math.ceil(targetTotal * Number(rule.probability || 0)));
}
function pickRuleWithAudit(rules, selector, context, seedKey){
  const under = underTargetRules(rules, selector, context);
  if(under.length) return weightedRulePick(under, `${seedKey}-audit`);
  return weightedRulePick(rules, seedKey);
}
function mediaRangeTargetCount(range, targetTotal){
  const total = Math.max(1, Math.round(Number(targetTotal) || 0));
  const raw = total * Number(range.probability || 0);
  if(range.id === 'elite_mundial') return Math.floor(raw);
  return Math.round(raw);
}
function generationDivisionOrder(clubId=0, divisionName=''){
  if(Number(clubId || 0) > 0 && seed?.clubs?.length){
    return Math.round(Number(clubDivision(clubId).order || 3));
  }
  const lower = String(divisionName || '').toLowerCase();
  if(lower.includes('profesional') || lower.includes('primera')) return 1;
  if(lower.includes('nacional') || lower.includes('segunda')) return 2;
  if(lower.includes('federal') || lower.includes('tercera')) return 3;
  return 0;
}
function mediaRangeAllowedByDivision(range, divisionOrder){
  const order = Math.round(Number(divisionOrder || 0));
  if(order === 2 && range.id === 'elite_mundial') return false;
  if(order >= 3 && (range.id === 'elite_mundial' || range.id === 'estrella')) return false;
  return true;
}
function clubEliteCountInContext(context, clubId){
  if(!context || Number(clubId || 0) <= 0) return 0;
  return contextPlayersForGeneration(context).filter(player => Number(player.clubId) === Number(clubId) && mediaRangeIdForOverall(player.overall ?? visibleOverall(player)) === 'elite_mundial').length;
}
function pickMediaRangeWithAudit(context, seedKey, constraints={}){
  const preferred = weightedRulePick(PLAYER_GENERATION_MEDIA_RANGES, `${seedKey}-range`);
  const divisionOrder = Math.round(Number(constraints.divisionOrder || 0));
  const clubId = Number(constraints.clubId || 0);
  const passesHardLimits = (range) => {
    if(!mediaRangeAllowedByDivision(range, divisionOrder)) return false;
    if(range.id === 'elite_mundial' && clubId > 0 && clubEliteCountInContext(context, clubId) >= PLAYER_ELITE_MAX_PER_CLUB) return false;
    return true;
  };
  if(!context){
    return passesHardLimits(preferred) ? preferred : (PLAYER_GENERATION_MEDIA_RANGES.find(passesHardLimits) || PLAYER_GENERATION_MEDIA_RANGES[PLAYER_GENERATION_MEDIA_RANGES.length - 1]);
  }
  const players = contextPlayersForGeneration(context);
  const targetTotal = Math.max(players.length + 1, Number(context.targetTotal || 0));
  const counts = {};
  players.forEach(player => {
    const key = mediaRangeIdForOverall(player.overall ?? visibleOverall(player));
    counts[key] = (counts[key] || 0) + 1;
  });
  const under = PLAYER_GENERATION_MEDIA_RANGES.filter(range => passesHardLimits(range) && (counts[range.id] || 0) < mediaRangeTargetCount(range, targetTotal));
  const fallbackAllowed = PLAYER_GENERATION_MEDIA_RANGES.filter(passesHardLimits);
  const fallbackWithoutElite = fallbackAllowed.filter(range => range.id !== 'elite_mundial');
  const allowed = under.length ? under : (fallbackWithoutElite.length ? fallbackWithoutElite : fallbackAllowed);
  if(allowed.some(range => range.id === preferred.id)) return preferred;
  const preferredIndex = PLAYER_GENERATION_MEDIA_RANGES.findIndex(range => range.id === preferred.id);
  const lower = PLAYER_GENERATION_MEDIA_RANGES.slice(preferredIndex + 1).find(range => allowed.some(item => item.id === range.id));
  if(lower) return lower;
  return weightedRulePick(allowed, `${seedKey}-range-fallback`) || PLAYER_GENERATION_MEDIA_RANGES[PLAYER_GENERATION_MEDIA_RANGES.length - 1];
}
function localNationalityForCountry(country='Argentina'){
  const clean = String(country || '').trim() || 'Argentina';
  const mapped = PLAYER_NATIONALITY_BY_COUNTRY && PLAYER_NATIONALITY_BY_COUNTRY[clean] ? String(PLAYER_NATIONALITY_BY_COUNTRY[clean]) : clean;
  return mapped || 'Argentina';
}
function allConfiguredNationalities(){
  const locals = Array.from(new Set((seed?.clubs || []).map(club => localNationalityForCountry(clubCountry(club))).filter(Boolean)));
  const pool = locals.concat(SOUTH_AMERICAN_NATIONALITIES || []).concat(WORLD_NATIONALITIES || []);
  return Array.from(new Set(pool.filter(Boolean)));
}
function freeAgentNationalityForIndex(index=0, seedKey='free-agent'){
  const pool = allConfiguredNationalities();
  if(!pool.length) return 'Argentina';
  const offset = hashNumber(`free-nationality-offset-${seedKey}`, pool.length);
  return pool[(Math.max(0, Math.round(Number(index || 0))) + offset) % pool.length];
}
function pickNationalityForGeneration(id, label, context=null, options={}){
  const group = pickRuleWithAudit(PLAYER_GENERATION_NATIONALITY_GROUPS, player => nationalityGroupId(player.nationality), context, `${label}-${id}-nat-group`);
  let countries = group?.countries?.length ? group.countries : ['Argentina'];
  if(group?.id === 'local'){
    countries = [localNationalityForCountry(options.localCountry || 'Argentina')];
  }
  return countries[hashNumber(`${label}-${id}-nat-country`, countries.length)];
}
function pickPositionGroupForGeneration(id, label, context=null){
  return pickRuleWithAudit(PLAYER_GENERATION_POSITION_GROUPS, player => playerRoleGroup(player.position), context, `${label}-${id}-pos-group`)?.id || 'MID';
}
function pickPositionFromGroup(groupId, id, label){
  const group = PLAYER_GENERATION_POSITION_GROUPS.find(item => item.id === groupId) || PLAYER_GENERATION_POSITION_GROUPS[2];
  const pool = group.positions || ['MC'];
  return pool[hashNumber(`${label}-${id}-pos`, pool.length)];
}
function mediaFromGenerationRules(prestige, id, group, context=null, label='player', constraints={}){
  const range = pickMediaRangeWithAudit(context, `${label}-${id}-${group}`, constraints);
  const span = Math.max(1, range.media_max - range.media_min + 1);
  const raw = range.media_min + hashNumber(`${label}-${id}-${group}-media`, span);
  const prestigeBias = Math.round(((Number(prestige) || 50) - 50) / 28);
  return clamp(raw + prestigeBias, range.media_min, range.media_max);
}
function initialAnnualSalaryForMedia(media, factor=1){
  const range = mediaRangeForOverall(media);
  return Math.max(0, Math.round((Number(media) || 0) * Number(range.salaryMultiplier || 0) * PLAYER_ECONOMY_SCALE * Number(factor || 1)));
}
function clauseBaseFromDivisionName(divisionName){
  const lower = String(divisionName || '').toLowerCase();
  if(lower.includes('profesional') || lower.includes('primera')) return PLAYER_CLAUSE_BASE_BY_DIVISION_ORDER[1];
  if(lower.includes('nacional') || lower.includes('segunda')) return PLAYER_CLAUSE_BASE_BY_DIVISION_ORDER[2];
  return PLAYER_CLAUSE_BASE_BY_DIVISION_ORDER[3];
}
function clauseBaseForClub(clubId, divisionName=''){
  if(Number(clubId || 0) <= 0) return clauseBaseFromDivisionName(divisionName);
  if(seed?.clubs?.length){
    const order = Math.round(Number(clubDivision(clubId).order || 3));
    return PLAYER_CLAUSE_BASE_BY_DIVISION_ORDER[order] || PLAYER_CLAUSE_BASE_BY_DIVISION_ORDER[3];
  }
  return clauseBaseFromDivisionName(divisionName);
}
function playerClauseFor(player, clubId=player?.clubId, divisionName=''){
  const salary = Math.max(0, Math.round(Number(player?.salary || 0)));
  const age = Math.max(15, Math.round(Number(player?.age || 18)));
  const multiplier = Math.max(PLAYER_CLAUSE_MIN_MULTIPLIER, clauseBaseForClub(clubId, divisionName) - (PLAYER_CLAUSE_AGE_REDUCTION * age));
  const baseClause = Math.max(salary * PLAYER_CLAUSE_MIN_MULTIPLIER, Math.round(salary * multiplier));
  return Math.max(0, Math.round(baseClause * PLAYER_CLAUSE_VALUE_SCALE));
}
function refreshPlayerClause(player){
  if(!player) return 0;
  if(player.fixedClause || player.manualFixedClause || player.economyLocked){
    player.clause = Math.max(0, Math.round(Number(player.clause || player.value || 0)));
    player.value = Math.max(0, Math.round(Number(player.value || player.clause || 0)));
    return player.clause;
  }
  player.clause = playerClauseFor(player, player.clubId);
  player.value = player.clause;
  return player.clause;
}
function refreshAllPlayerClauses(){
  (seed?.players || []).forEach(refreshPlayerClause);
  (game?.marketPlayers || []).forEach(refreshPlayerClause);
}
function ensurePlayerEconomics(player, salaryFactor=1){
  if(!player) return player;
  const media = Math.max(1, Math.round(Number(player.overall || 0) || visibleOverall(player) || 50));
  if(!Number.isFinite(Number(player.salary)) || Number(player.salary) <= 0){
    player.salary = initialAnnualSalaryForMedia(media, salaryFactor);
  }
  // Las cláusulas se recalculan siempre para que los ajustes de balance impacten
  // también en partidas guardadas, sin modificar sueldos existentes.
  refreshPlayerClause(player);
  return player;
}
function generatedPlayerFactory({ id, position, clubId=0, age=18, prestige=50, nameContext='Jugador', divisionName='', divisionOrder=null, generationContext=null, salaryFactor=1, freeAgent=false, youthFreeAgent=false, mediaMin=null, mediaMax=null, nationalityOverride=null, localCountry=null }){
  const cleanPosition = normalizePlayerPosition(position, id);
  const group = playerRoleGroup(cleanPosition);
  const generationDivision = Number.isFinite(Number(divisionOrder)) ? Number(divisionOrder) : generationDivisionOrder(clubId, divisionName);
  let media;
  if(Number.isFinite(Number(mediaMin)) && Number.isFinite(Number(mediaMax))){
    const min = clamp(Math.round(Number(mediaMin)), 1, 99);
    const max = Math.max(min, clamp(Math.round(Number(mediaMax)), 1, 99));
    media = min + hashNumber(`${nameContext}-${id}-${group}-fixed-media`, Math.max(1, max - min + 1));
  } else {
    media = mediaFromGenerationRules(prestige, id, group, generationContext, nameContext, { clubId, divisionOrder:generationDivision });
  }
  const skills = skillsForPosition(cleanPosition, media, id);
  const visible = averageGeneratedVisible(cleanPosition, skills);
  const player = {
    id,
    name:generatedPlayerName(id, nameContext),
    age,
    position:cleanPosition,
    clubId,
    freeAgent:Boolean(freeAgent),
    youthFreeAgent:Boolean(youthFreeAgent),
    nationality:nationalityOverride || pickNationalityForGeneration(id, divisionName || nameContext, generationContext, { localCountry:localCountry || (Number(clubId || 0) > 0 ? clubCountry(seed?.clubs?.find(c => Number(c.id) === Number(clubId))) : null) }),
    overall:visible,
    skills,
    salary:initialAnnualSalaryForMedia(visible, salaryFactor),
    salaryPaidCount:0,
    lastSalaryPaidSeason:0
  };
  player.clause = playerClauseFor(player, clubId, divisionName);
  player.value = player.clause;
  registerGeneratedPlayer(generationContext, player);
  return player;
}
function generationRosterBlueprint(){
  return ['POR','POR','POR','LD','LI','DFC','DFC','DFC','LD','LI','MCD','MCD','MC','MC','MCO','MCO','MI','MD','ED','EI','ED','EI','DC','DC','DC'];
}
function playerNationalityImageSlug(nationality){
  const raw = String(nationality || '').trim();
  const normalized = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ñ/g, 'n')
    .replace(/&/g, ' y ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const aliases = {
    'espana':'espana',
    'paises-bajos':'paises-bajos',
    'pais-bajos':'paises-bajos',
    'holanda':'paises-bajos',
    'corea':'corea-del-sur',
    'corea-sur':'corea-del-sur',
    'corea-del-sur':'corea-del-sur',
    'estados-unidos':'estados-unidos',
    'eeuu':'estados-unidos',
    'eua':'estados-unidos',
    'usa':'estados-unidos',
    'mexico':'mexico',
    'peru':'peru',
    'japon':'japon'
  };
  return aliases[normalized] || normalized || 'generico';
}
function playerNationalityImageBase(player){
  return `img/jugadores/nacionalidades/${playerNationalityImageSlug(player?.nationality)}`;
}
function playerGenericImageBase(){
  return 'img/jugadores/nacionalidades/generico';
}
function faceBaseForPlayer(player){
  return playerNationalityImageBase(player);
}
function playerPhotoPath(player){
  const custom = player?.photoPath || player?.fotoPath || player?.imagePath || player?.photo || player?.foto || '';
  return String(custom || '').trim();
}
function versionedCustomPhotoPath(path){
  const clean = String(path || '').trim();
  if(!clean) return '';
  if(/[?&]v=/.test(clean)) return clean;
  const version = typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'manual';
  return `${clean}${clean.includes('?') ? '&' : '?'}v=${encodeURIComponent(version)}`;
}
function faceImg(player, className='photo-thumb'){
  const base = faceBaseForPlayer(player);
  const fallbackBase = playerGenericImageBase();
  const customPath = playerPhotoPath(player);
  const alt = `Foto de ${escapeHtml(player?.name || 'jugador')}`;
  const fallbackAttr = fallbackBase && fallbackBase !== base ? ` data-face-fallback-base="${escapeHtml(fallbackBase)}"` : '';
  if(customPath){
    return `<img class="${escapeHtml(className)}" src="${escapeHtml(versionedCustomPhotoPath(customPath))}" alt="${alt}" data-face-base="${escapeHtml(base)}" data-face-ext-index="-1"${fallbackAttr} onerror="tryNextFaceExt(this)">`;
  }
  return `<img class="${escapeHtml(className)}" src="${escapeHtml(base)}.webp" alt="${alt}" data-face-base="${escapeHtml(base)}" data-face-ext-index="0"${fallbackAttr} onerror="tryNextFaceExt(this)">`;
}
function tryNextFaceExt(img){
  const exts = ['.webp','.png','.jpg','.jpeg'];
  const currentIndex = Number(img.dataset.faceExtIndex || 0);
  const nextIndex = currentIndex + 1;
  const base = img.dataset.faceBase;
  if(base && nextIndex < exts.length){
    img.dataset.faceExtIndex = String(nextIndex);
    img.src = `${base}${exts[nextIndex]}`;
    return;
  }
  const fallbackBase = img.dataset.faceFallbackBase;
  if(fallbackBase && img.dataset.faceFallbackUsed !== '1'){
    img.dataset.faceFallbackUsed = '1';
    img.dataset.faceBase = fallbackBase;
    img.dataset.faceExtIndex = '0';
    img.src = `${fallbackBase}${exts[0]}`;
    return;
  }
  img.onerror = null;
  img.replaceWith(fallbackFaceNode(img.className));
}
function fallbackFaceNode(className){
  const node = document.createElement('div');
  node.className = className || 'photo-thumb';
  node.textContent = '👤';
  return node;
}
function playerGroup(position){
  return roleMeta(position).group;
}
function playerGroupClass(position){
  const group = playerGroup(position);
  return group === 'gk' ? 'gk' : group === 'def' ? 'def' : group === 'att' ? 'att' : 'mid';
}
function slotGroup(slot){
  if(slot === 'POR') return 'gk';
  if(['LD','LI','DFC'].includes(slot)) return 'def';
  if(['MCD','MC','MCO','MI','MD'].includes(slot)) return 'mid';
  return 'att';
}
function roleMirrorSide(role){
  const map = { LD:'LI', LI:'LD', ED:'EI', EI:'ED', MD:'MI', MI:'MD' };
  return map[role] || '';
}
function sideEquivalentRole(playerPosition, slot){
  const position = String(playerPosition || '').toUpperCase();
  const target = String(slot || '').toUpperCase();
  if(position === target) return true;
  if(roleMirrorSide(position) === target) return true;
  const widePairs = { ED:['MD'], MD:['ED'], EI:['MI'], MI:['EI'] };
  return (widePairs[position] || []).includes(target);
}
function playerFitsSlot(player, slot){
  return playerGroup(player.position) === slotGroup(slot) || sideEquivalentRole(player.position, slot);
}
function playerExactRoleFitsSlot(player, slot){
  return String(player?.position || '').toUpperCase() === String(slot || '').toUpperCase();
}
function clubHasNaturalGoalkeeper(clubId){
  const id = Number(clubId || 0);
  if(!id || typeof playersByClub !== 'function') return true;
  return playersByClub(id).some(p => String(p?.position || '').toUpperCase() === 'POR');
}
function emergencyFieldKeeperAllowed(player, slot){
  if(!player || String(slot || '').toUpperCase() !== 'POR') return false;
  if(isGoalkeeperPlayer(player)) return false;
  const clubId = Number(player.clubId || game?.selectedClubId || 0);
  return !clubHasNaturalGoalkeeper(clubId);
}
function playerTacticFitLevel(player, slot){
  if(!player) return 'empty';
  if(emergencyFieldKeeperAllowed(player, slot)) return 'emergency_gk';
  if(playerExactRoleFitsSlot(player, slot)) return 'exact';
  if(playerFitsSlot(player, slot)) return 'role';
  return 'zone';
}
function playerTacticFitFactor(player, slot){
  const level = playerTacticFitLevel(player, slot);
  if(level === 'exact') return 1;
  if(level === 'role') return 0.75;
  if(level === 'emergency_gk') return 0.25;
  return 0.5;
}
function playerTacticFitPercent(player, slot){
  return Math.round(playerTacticFitFactor(player, slot) * 100);
}
function tacticFitBar(player, slot){
  const percent = playerTacticFitPercent(player, slot);
  const value = Math.max(0, Math.min(99, Math.round((percent / 100) * 99)));
  return compactValueCircle(value, 'performance', `Rendimiento táctico ${percent}%`);
}
function playerTacticFitTitle(player, slot){
  const level = playerTacticFitLevel(player, slot);
  if(level === 'exact') return 'Rol exacto: rinde al 100%';
  if(level === 'role') return 'Fuera de rol exacto, pero compatible: rinde al 75%';
  if(level === 'emergency_gk') return 'Arquero de emergencia: jugador de campo al 25% porque el plantel no tiene porteros.';
  return 'Fuera de zona natural: rinde al 50%';
}
function isGoalkeeperSlot(slot){
  return slot === 'POR';
}
function isGoalkeeperPlayer(player){
  return player?.position === 'POR';
}
function canAssignPlayerToSlot(player, slot){
  if(!player) return false;
  if(isGoalkeeperSlot(slot)) return isGoalkeeperPlayer(player) || emergencyFieldKeeperAllowed(player, slot);
  return !isGoalkeeperPlayer(player);
}

function botFormationPlayerScore(player, slot){
  if(!player || !slot || !canAssignPlayerToSlot(player, slot)) return -100000;
  const fit = playerTacticFitFactor(player, slot);
  const overall = Math.max(1, Number(effectiveOverall(player) || 0));
  const condition = Math.max(0, Number(currentCondition(player.id) || 0));
  const morale = Math.max(1, Number(currentMorale(player.id) || 0));
  const exactBonus = playerExactRoleFitsSlot(player, slot) ? 7 : (playerFitsSlot(player, slot) ? 2 : 0);
  return (overall * fit) + (condition * 0.12) + (morale * 0.05) + exactBonus;
}
function optimalBotLineupForFormation(squad=[], slots=[], clubId=0, formation=''){
  const rowCount = slots.length;
  const realPlayers = squad.slice();
  const columnCount = Math.max(rowCount, realPlayers.length);
  if(!rowCount || !columnCount) return { lineup:[], score:-110000, missing:rowCount || 11 };
  const scoreFor = (row, column) => {
    if(column >= realPlayers.length) return -10000 - row;
    const player = realPlayers[column];
    const slot = slots[row];
    const base = botFormationPlayerScore(player, slot);
    const tie = hashNumber(`bot-lineup-tie-${game?.seasonNumber || 1}-${clubId}-${formation}-${slot}-${player.id}`, 1000) / 1000000;
    return base + tie;
  };
  const u = Array(rowCount + 1).fill(0);
  const v = Array(columnCount + 1).fill(0);
  const p = Array(columnCount + 1).fill(0);
  const way = Array(columnCount + 1).fill(0);
  for(let i=1; i<=rowCount; i+=1){
    p[0] = i;
    let j0 = 0;
    const minv = Array(columnCount + 1).fill(Infinity);
    const used = Array(columnCount + 1).fill(false);
    do{
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;
      for(let j=1; j<=columnCount; j+=1){
        if(used[j]) continue;
        const current = -scoreFor(i0 - 1, j - 1) - u[i0] - v[j];
        if(current < minv[j]){ minv[j] = current; way[j] = j0; }
        if(minv[j] < delta){ delta = minv[j]; j1 = j; }
      }
      for(let j=0; j<=columnCount; j+=1){
        if(used[j]){ u[p[j]] += delta; v[j] -= delta; }
        else minv[j] -= delta;
      }
      j0 = j1;
    }while(p[j0] !== 0);
    do{
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    }while(j0 !== 0);
  }
  const assignedColumns = Array(rowCount).fill(-1);
  for(let j=1; j<=columnCount; j+=1){
    if(p[j] > 0 && p[j] <= rowCount) assignedColumns[p[j] - 1] = j - 1;
  }
  let score = 0;
  let missing = 0;
  const lineup = [];
  assignedColumns.forEach((column, row) => {
    const player = column >= 0 && column < realPlayers.length ? realPlayers[column] : null;
    const playerScore = player ? botFormationPlayerScore(player, slots[row]) : -100000;
    if(!player || playerScore <= -50000){ missing += 1; score -= 10000 + row; return; }
    lineup.push(player);
    score += playerScore;
  });
  return { lineup, score:score - (missing * 10000), missing };
}
function bestBotFormationSelection(clubId, options={}){
  const id = Number(clubId || 0);
  const squad = playersByClub(id)
    .filter(player => player && !player.retired && !player.sold && !player.freeAgent)
    .filter(player => options.includeUnavailable || !isUnavailable(player.id));
  const formationNames = Object.keys(FORMATIONS || {});
  let best = { formation:'4-4-2', lineup:[], score:-Infinity, missing:11 };
  formationNames.forEach(formation => {
    const selection = optimalBotLineupForFormation(squad, FORMATIONS[formation] || [], id, formation);
    const tie = hashNumber(`best-bot-formation-${game?.seasonNumber || 1}-${id}-${formation}`, 1000) / 1000000;
    const finalScore = selection.score + tie;
    if(finalScore > best.score){ best = { formation, lineup:selection.lineup, score:finalScore, missing:selection.missing }; }
  });
  return best;
}
function zoneFactor(player, slot){
  return playerTacticFitFactor(player, slot);
}
function conditionLossForPlayer(player){
  const loss = rnd(MATCH_CONDITION_LOSS_MIN, MATCH_CONDITION_LOSS_MAX);
  return player?.position === 'POR' ? loss * GOALKEEPER_CONDITION_LOSS_FACTOR : loss;
}
function postMatchRecoveryForPlayer(player){
  let recovery = 0;
  if(POST_MATCH_RECOVERY_USE_STAMINA && POST_MATCH_RECOVERY_STAMINA_RULES.length){
    const stamina = clamp(Math.round(baseSkill(player || {}, 'resistencia')), 1, 99);
    const rule = POST_MATCH_RECOVERY_STAMINA_RULES.find(item => stamina >= item.minResistencia && stamina <= item.maxResistencia)
      || POST_MATCH_RECOVERY_STAMINA_RULES[POST_MATCH_RECOVERY_STAMINA_RULES.length - 1];
    if(rule){
      const min = clamp(Math.round(Math.min(rule.recuperacionMin, rule.recuperacionMax)), 0, 99);
      const max = clamp(Math.round(Math.max(rule.recuperacionMin, rule.recuperacionMax)), min, 99);
      recovery = rnd(min, max);
    }
  } else {
    recovery = rnd(POST_MATCH_RECOVERY_MIN, POST_MATCH_RECOVERY_MAX);
  }
  return clamp(Math.round(recovery), 0, 99);
}
function postMatchPhysicalCardRecoveryForPlayer(player){
  if(!player || Number(player.clubId || 0) !== Number(game?.selectedClubId || 0)) return 0;
  if(typeof specialActiveBonus !== 'function') return 0;
  return clamp(Math.round(Number(specialActiveBonus('preparacion_fisica') || 0)), 0, 99);
}
function applyPostMatchPhysicalCardRecoveryForPlayer(player, conditionValue){
  const baseCondition = clamp(Math.round(Number(conditionValue || 0)), 0, 99);
  const bonus = postMatchPhysicalCardRecoveryForPlayer(player);
  if(!player || bonus <= 0) return baseCondition;
  const desiredCondition = clamp(baseCondition + bonus, 0, 99);
  if(PLAYER_WEAR_ENABLED && desiredCondition > maxConditionForPlayer(player.id)){
    const recoveryNeeded = desiredCondition - maxConditionForPlayer(player.id);
    adjustPlayerWear(player.id, -recoveryNeeded);
  }
  return clamp(Math.min(desiredCondition, maxConditionForPlayer(player.id)), 0, 99);
}
function rosterGroupCounts(squad=[]){
  const counts = { POR:0, DEF:0, MID:0, ATT:0 };
  (squad || []).forEach(player => {
    const group = playerRoleGroup(player.position);
    if(Object.prototype.hasOwnProperty.call(counts, group)) counts[group] += 1;
  });
  return counts;
}
function minimumRosterRequirements(){
  return {
    total:MIN_PLAYERS_PER_CLUB,
    POR:BOT_MIN_GOALKEEPERS,
    DEF:BOT_MIN_DEFENDERS,
    MID:BOT_MIN_MIDFIELDERS,
    ATT:BOT_MIN_ATTACKERS
  };
}
function clubRequirementIssues(clubId){
  const squad = playersByClub(clubId);
  const counts = rosterGroupCounts(squad);
  const req = minimumRosterRequirements();
  const issues = [];
  if(squad.length < req.total) issues.push(`necesita ${req.total} jugadores y tiene ${squad.length}`);
  if(counts.POR < req.POR) issues.push(`necesita ${req.POR} porteros y tiene ${counts.POR}`);
  if(counts.DEF < req.DEF) issues.push(`necesita ${req.DEF} defensores y tiene ${counts.DEF}`);
  if(counts.MID < req.MID) issues.push(`necesita ${req.MID} mediocampistas y tiene ${counts.MID}`);
  if(counts.ATT < req.ATT) issues.push(`necesita ${req.ATT} delanteros y tiene ${counts.ATT}`);
  return issues;
}
function nextEmergencyPlayerId(){
  const ids = (seed?.players || []).map(p => Number(p.id) || 0);
  return Math.max(0, ...ids) + 1;
}
function emergencyPositionForGroup(group, seedKey=''){
  const clean = String(group || '').toUpperCase();
  if(clean === 'POR') return 'POR';
  if(clean === 'DEF'){
    const pool = ['DFC','LD','LI'];
    return pool[hashNumber(`${seedKey}-def`, pool.length)];
  }
  if(clean === 'MID'){
    const pool = ['MC','MCD','MCO','MI','MD'];
    return pool[hashNumber(`${seedKey}-mid`, pool.length)];
  }
  const pool = ['DC','ED','EI'];
  return pool[hashNumber(`${seedKey}-att`, pool.length)];
}
function weakestBotPlayerForConversion(clubId, neededGroup){
  const req = minimumRosterRequirements();
  const squad = playersByClub(clubId).filter(p => !p.emergencyLocked);
  const counts = rosterGroupCounts(squad);
  const protectedByGroup = { POR:req.POR, DEF:req.DEF, MID:req.MID, ATT:req.ATT };
  return squad
    .filter(player => {
      const group = playerRoleGroup(player.position);
      if(group === neededGroup) return false;
      return (counts[group] || 0) > (protectedByGroup[group] || 0);
    })
    .sort((a,b)=>visibleOverall(a)-visibleOverall(b))[0] || null;
}
function normalizeEmergencyPlayerEconomics(player){
  const media = clamp(Math.round(Number(player.overall || visibleOverall(player) || BOT_EMERGENCY_MEDIA_MIN)), BOT_EMERGENCY_MEDIA_MIN, BOT_EMERGENCY_MEDIA_MAX);
  player.overall = media;
  player.skills = skillsForPosition(player.position, media, player.id);
  player.salary = initialAnnualSalaryForMedia(media, BOT_EMERGENCY_SALARY_FACTOR);
  refreshPlayerClause(player);
  return player;
}
function createEmergencyBotPlayer(club, group, report){
  const id = nextEmergencyPlayerId();
  const position = emergencyPositionForGroup(group, `${club.id}-${id}`);
  const media = BOT_EMERGENCY_MEDIA_MIN + hashNumber(`emergency-media-${club.id}-${id}-${group}`, BOT_EMERGENCY_MEDIA_MAX - BOT_EMERGENCY_MEDIA_MIN + 1);
  const player = generatedPlayerFactory({
    id,
    position,
    clubId:club.id,
    age:18 + hashNumber(`emergency-age-${club.id}-${id}`, 17),
    prestige:35,
    nameContext:`Emergencia ${club.name}`,
    divisionName:club.divisionName,
    divisionOrder:club.divisionOrder,
    generationContext:null,
    salaryFactor:BOT_EMERGENCY_SALARY_FACTOR,
    freeAgent:false
  });
  player.overall = media;
  player.origin = 'Emergencia bot';
  player.emergencyBot = true;
  normalizeEmergencyPlayerEconomics(player);
  seed.players.push(player);
  if(game){
    game.playerAgeSkillPenalties = (game.playerAgeSkillPenalties && typeof game.playerAgeSkillPenalties === 'object' && !Array.isArray(game.playerAgeSkillPenalties)) ? game.playerAgeSkillPenalties : {};
    game.playerAgeSkillPenalties[player.id] = 0;
  }
  if(report) report.created += 1;
  ensurePlayerStateForAll();
  return player;
}
function convertWeakBotPlayer(club, group, report){
  const player = weakestBotPlayerForConversion(club.id, group);
  if(!player) return null;
  player.position = emergencyPositionForGroup(group, `${club.id}-${player.id}-convert`);
  player.origin = player.origin || 'Reconversión de emergencia bot';
  player.emergencyBot = true;
  normalizeEmergencyPlayerEconomics(player);
  if(report) report.converted += 1;
  return player;
}
function botFreeAgentPoolForGroup(group){
  const targetGroup = String(group || '').toUpperCase();
  return (seed?.players || []).filter(player => {
    if(!player || player.retired || player.sold) return false;
    const isFree = Number(player.clubId || 0) === 0 || Boolean(player.freeAgent) || Boolean(player.youthFreeAgent);
    if(!isFree) return false;
    return playerRoleGroup(player.position) === targetGroup;
  });
}
function botFreeAgentRecruitmentScore(player, club){
  const clubRep = Number(club?.reputation || 45);
  const overall = Number(visibleOverall(player) || player?.overall || 35);
  const age = Number(player?.age || 24);
  const fit = 100 - Math.abs(overall - clubRep);
  const salaryPenalty = Math.max(0, Number(player?.salary || 0) / 1000000);
  const ageBonus = age <= 24 ? 6 : age <= 30 ? 3 : 0;
  return fit + ageBonus - salaryPenalty;
}
function signFreeAgentForBotRoster(club, group, report){
  const pool = botFreeAgentPoolForGroup(group);
  if(!pool.length) return null;
  const player = pool.sort((a,b) => botFreeAgentRecruitmentScore(b, club) - botFreeAgentRecruitmentScore(a, club) || visibleOverall(b) - visibleOverall(a) || Number(a.id || 0) - Number(b.id || 0))[0];
  if(!player) return null;
  player.clubId = Number(club.id);
  player.freeAgent = false;
  player.youthFreeAgent = false;
  player.sold = false;
  player.transferListed = false;
  player.intransferible = false;
  player.salaryPaidCount = 0;
  player.lastSalaryPaidSeason = 0;
  refreshPlayerClause(player);
  if(game?.marketPlayers && Array.isArray(game.marketPlayers)){
    const idx = game.marketPlayers.findIndex(p => Number(p.id) === Number(player.id));
    if(idx >= 0){
      game.marketPlayers[idx] = { ...game.marketPlayers[idx], ...player, clubId:Number(club.id), freeAgent:false, youthFreeAgent:false, sold:false, transferListed:false, intransferible:false };
    }
  }
  if(report) report.signedFreeAgents = Number(report.signedFreeAgents || 0) + 1;
  return player;
}
function addOrConvertEmergencyBotPlayer(club, group, report){
  const signed = signFreeAgentForBotRoster(club, group, report);
  if(signed) return signed;
  const rosterSize = playersByClub(club.id).length;
  if(rosterSize < MAX_PLAYERS_PER_CLUB) return createEmergencyBotPlayer(club, group, report);
  return convertWeakBotPlayer(club, group, report) || createEmergencyBotPlayer(club, group, report);
}
function repairBotRoster(club, report){
  if(!club || Number(club.id) === Number(game?.selectedClubId)) return;
  const req = minimumRosterRequirements();
  const fillGroup = (group, target) => {
    let guard = 0;
    while(rosterGroupCounts(playersByClub(club.id))[group] < target && guard < 20){
      addOrConvertEmergencyBotPlayer(club, group, report);
      guard += 1;
    }
  };
  fillGroup('POR', req.POR);
  fillGroup('DEF', req.DEF);
  fillGroup('MID', req.MID);
  fillGroup('ATT', req.ATT);
  let guard = 0;
  const extraGroups = ['DEF','MID','ATT','POR'];
  while(playersByClub(club.id).length < req.total && guard < 30){
    const group = extraGroups[guard % extraGroups.length];
    addOrConvertEmergencyBotPlayer(club, group, report);
    guard += 1;
  }
}
function repairBotRosters(options={}){
  if(!BOT_ROSTER_REPAIR_ENABLED || !game || !seed?.clubs?.length) return { created:0, converted:0, clubs:0 };
  const report = { created:0, converted:0, signedFreeAgents:0, clubs:0, reason:options.reason || 'auto' };
  seed.clubs.forEach(club => {
    if(Number(club.id) === Number(game.selectedClubId)) return;
    const before = clubRequirementIssues(club.id).length;
    if(before){
      repairBotRoster(club, report);
      report.clubs += 1;
    }
  });
  if(report.created || report.converted || report.signedFreeAgents){
    ensurePlayerStateForAll();
    if(game.botRosterRepairLog === undefined) game.botRosterRepairLog = [];
    game.botRosterRepairLog.push({ ...report, turn:currentTurnIndex(), season:game.seasonNumber || 1, createdAt:Date.now() });
    game.botRosterRepairLog = game.botRosterRepairLog.slice(-20);
  }
  return report;
}
function normalizeMentality(mode){
  const value = String(mode || '').trim();
  const legacy = { posicional:'normal', ataque:'ofensivo', defensiva:'defensivo' };
  const normalized = legacy[value] || value;
  return MENTALITIES.includes(normalized) ? normalized : 'normal';
}
function mentalityLabel(mode){
  const labels = {
    muy_defensivo:'Muy defensivo',
    defensivo:'Defensivo',
    normal:'Normal',
    ofensivo:'Ofensivo',
    muy_ofensivo:'Muy ofensivo'
  };
  return labels[normalizeMentality(mode)] || 'Normal';
}
function mentalityMarker(mode){
  const normalized = normalizeMentality(mode);
  const meta = {
    muy_defensivo:{ cls:'very-defense', text:'←←', title:'Muy defensivo' },
    defensivo:{ cls:'defense', text:'←', title:'Defensivo' },
    normal:{ cls:'normal', text:'•', title:'Normal' },
    ofensivo:{ cls:'attack', text:'→', title:'Ofensivo' },
    muy_ofensivo:{ cls:'very-attack', text:'→→', title:'Muy ofensivo' }
  }[normalized] || { cls:'normal', text:'•', title:'Normal' };
  return `<span class="mentality-marker ${meta.cls}" title="${meta.title}" aria-label="${meta.title}"><span class="mentality-marker-symbol">${meta.text}</span></span>`;
}
function nextMentality(current){
  const idx = MENTALITIES.indexOf(normalizeMentality(current));
  return MENTALITIES[(idx + 1) % MENTALITIES.length] || 'normal';
}
function ensurePlayerMentalitiesStore(targetGame=game){
  if(!targetGame) return {};
  targetGame.playerMentalities = (targetGame.playerMentalities && typeof targetGame.playerMentalities === 'object' && !Array.isArray(targetGame.playerMentalities)) ? targetGame.playerMentalities : {};
  Object.keys(targetGame.playerMentalities).forEach(id => {
    const cleanId = Number(id);
    if(!cleanId) delete targetGame.playerMentalities[id];
    else targetGame.playerMentalities[cleanId] = normalizeMentality(targetGame.playerMentalities[id]);
  });
  return targetGame.playerMentalities;
}
function playerMentality(playerId, tactic = game?.tactic){
  const id = Number(playerId || 0);
  const globalStore = game?.playerMentalities || {};
  return normalizeMentality(globalStore[id] || tactic?.playerMentalities?.[id]);
}
function setPlayerMentality(playerId, mode, tactic = game?.tactic){
  const id = Number(playerId || 0);
  if(!id) return 'normal';
  const normalized = normalizeMentality(mode);
  if(game){
    const store = ensurePlayerMentalitiesStore(game);
    store[id] = normalized;
  }
  if(tactic){
    tactic.playerMentalities = (tactic.playerMentalities && typeof tactic.playerMentalities === 'object' && !Array.isArray(tactic.playerMentalities)) ? tactic.playerMentalities : {};
    tactic.playerMentalities[id] = normalized;
  }
  return normalized;
}
function applyStarterMentalities(tactic){
  tactic = tactic || {};
  const globalStore = game ? ensurePlayerMentalitiesStore(game) : {};
  const next = { ...(tactic.playerMentalities || {}) };
  Object.keys(next).forEach(id => {
    const cleanId = Number(id);
    if(!cleanId) delete next[id];
    else next[cleanId] = normalizeMentality(next[id]);
  });
  (tactic.starters || []).filter(Boolean).forEach(id => {
    const cleanId = Number(id);
    next[cleanId] = normalizeMentality(globalStore[cleanId] || next[cleanId]);
    if(game) globalStore[cleanId] = next[cleanId];
  });
  tactic.playerMentalities = next;
  return tactic;
}
function formationLayout(formation){
  return FORMATION_VISUALS[formation] || [4,0,4,0,2];
}
function slotVisualColumn(slot){
  const map = {
    POR:{ key:'POR', x:8 },
    DFC:{ key:'DFC', x:23 }, LD:{ key:'LD', x:23 }, LI:{ key:'LI', x:23 },
    MCD:{ key:'MCD', x:38 },
    MC:{ key:'MC', x:52 }, MI:{ key:'MI', x:56 }, MD:{ key:'MD', x:56 },
    MCO:{ key:'MCO', x:66 },
    EI:{ key:'EI', x:72 }, ED:{ key:'ED', x:72 },
    DC:{ key:'DC', x:84 }
  };
  return map[slot] || { key:String(slot || 'MC'), x:52 };
}
function roleBaseY(slot){
  const map = {
    POR:50,
    LI:18, LD:82,
    MI:18, MD:82,
    EI:18, ED:82
  };
  return map[slot] || 50;
}
function distributedRoleY(slot, count, rowIndex){
  if(count <= 1) return roleBaseY(slot);
  const compactPresets = {
    DFC:{
      2:[42,58],
      3:[36,50,64]
    },
    MC:{
      2:[42,58],
      3:[36,50,64],
      4:[30,43,57,70]
    },
    DC:{
      2:[40,60],
      3:[32,50,68]
    }
  };
  const preset = compactPresets[slot]?.[count];
  if(preset) return preset[Math.max(0, Math.min(rowIndex, preset.length - 1))];
  const centerRoles = ['DFC','MCD','MC','MCO','DC'];
  if(centerRoles.includes(slot)){
    const minY = count >= 4 ? 24 : 34;
    const maxY = count >= 4 ? 76 : 66;
    return minY + ((maxY - minY) * rowIndex / Math.max(1, count - 1));
  }
  const base = roleBaseY(slot);
  const spread = Math.min(14, 6 + count * 2);
  const start = base - spread * (count - 1) / 2;
  return clamp(start + spread * rowIndex, 10, 90);
}
function formationCoordinates(formation){
  const slots = FORMATIONS[formation] || FORMATIONS['4-4-2'];
  const roleGroups = {};
  slots.forEach((slot, index) => {
    const column = slotVisualColumn(slot);
    if(!roleGroups[column.key]) roleGroups[column.key] = { slot, x:column.x, items:[] };
    roleGroups[column.key].items.push(index);
  });
  const coords = Array(slots.length).fill(null);
  Object.values(roleGroups).forEach(group => {
    const count = group.items.length;
    group.items.forEach((slotIndex, rowIndex) => {
      coords[slotIndex] = { x:group.x, y:distributedRoleY(group.slot, count, rowIndex) };
    });
  });
  return coords;
}
function pitchSlots(tactic){
  const slots = FORMATIONS[tactic?.formation] || FORMATIONS['4-4-2'];
  const coords = formationCoordinates(tactic?.formation || '4-4-2');
  return slots.map((slot, i) => {
    const player = playerById((tactic?.starters || [])[i]);
    return { player, slot, index:i, x: coords[i]?.x || 50, y: coords[i]?.y || 50, mentality: player ? playerMentality(player.id, tactic) : 'posicional' };
  });
}



