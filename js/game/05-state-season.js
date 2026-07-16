/* Eventos, carrera, ranking automático y limpieza de estado al cambiar de club. */

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
  const objectivePrestige = seasons.reduce((sum, item) => {
    if(Number.isFinite(Number(item.managerPrestigeObjectiveReward))) return sum + Number(item.managerPrestigeObjectiveReward);
    return sum + (Boolean(item.objectiveAchieved) ? Number(MANAGER_PRESTIGE_OBJECTIVE_REWARD || 5) : 0);
  }, 0);
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
function managerClubAccessPrestige(value=currentManagerPrestige()){
  const n = Number(value || 0);
  return Math.max(0, Math.floor(Number.isFinite(n) ? n : 0));
}
function currentManagerPrestige(){
  // el prestigio vuelve a ser propio de cada slot/carrera.
  // No se usa el perfil global para abrir clubes ni para calcular reputación activa.
  if(game?.managerStats) return managerPrestigeBreakdown(game.managerStats).total;
  return clamp(Number(MANAGER_PRESTIGE_INITIAL || 0), 0, 99);
}
function currentManagerExperience(){
  const localExperience = game?.managerStats ? Math.max(0, Math.round(Number(game.managerStats.experience || 0))) : 0;
  const sharedExperience = game?.managerSharedProfile ? Math.max(0, Math.round(Number(game.managerSharedProfile.experience || 0))) : 0;
  if(game?.managerStats) return Math.max(localExperience, sharedExperience);
  if(typeof readManagerGlobalProfileState === 'function'){
    const profile = readManagerGlobalProfileState();
    if(profile && !profile.empty && profile.managerStats) return Math.max(0, Math.round(Number(profile.managerStats.experience || 0)));
  }
  return 0;
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



function activeManagerChallenge(){
  return game?.challenge && game.challenge.active !== false ? game.challenge : null;
}
function managerChallengeIs(id){
  const challenge = activeManagerChallenge();
  return Boolean(challenge && (!id || String(challenge.id || '') === String(id)));
}
function managerChallengeBlocks(kind=''){
  const challenge = activeManagerChallenge();
  if(!challenge || challenge.completed) return false;
  const blocked = challenge.blocked || {};
  return Boolean(blocked[kind]);
}
function managerChallengeBlockedMessage(kind=''){
  const challenge = activeManagerChallenge();
  const title = challenge?.nombre || challenge?.title || 'Reto activo';
  if(kind === 'fieldMaintenance') return `${title}: no se puede replantar ni reparar el campo.`;
  if(kind === 'staff') return `${title}: no se pueden contratar empleados durante el reto.`;
  if(kind === 'players') return `${title}: no se pueden contratar ni incorporar jugadores durante el reto.`;
  if(kind === 'resultOnly') return `${title}: Ver resultado está bloqueado. Debés dirigir el partido.`;
  return `${title}: acción bloqueada por las reglas del reto.`;
}
function managerChallengePresetById(id=''){
  const key = String(id || '').trim();
  const presets = Array.isArray(managerChallengesDatabase?.retos) ? managerChallengesDatabase.retos : [];
  return presets.find(item => String(item?.id || '') === key && item?.activo !== false) || null;
}
function campoDestruidoChallengeDefinition(){
  return managerChallengePresetById('campo_destruido');
}
function challengeClubNameCandidates(){
  const definition = campoDestruidoChallengeDefinition();
  return Array.isArray(definition?.clubesSeleccionables) ? definition.clubesSeleccionables.filter(Boolean).map(String) : [];
}
function challengeClubKey(name){
  if(typeof lookupNameKey === 'function') return lookupNameKey(name);
  return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
function findClubByChallengeName(name){
  const key = challengeClubKey(name);
  return (seed?.clubs || []).find(club => challengeClubKey(club.name) === key)
    || (seed?.clubs || []).find(club => challengeClubKey(club.name).includes(key) || key.includes(challengeClubKey(club.name)));
}
function campoDestruidoChallengeClubs(){
  return challengeClubNameCandidates().map(name => findClubByChallengeName(name)).filter(Boolean);
}
function campoDestruidoChallengeAvailable(){
  const definition = campoDestruidoChallengeDefinition();
  if(!definition) return false;
  const clubs = campoDestruidoChallengeClubs();
  const matches = Math.max(1, Math.round(Number(definition?.calendario?.partidos || 0)));
  return clubs.length >= matches + 1;
}
function createChallengeRoundRobin(teamIds=[]){
  const unique = Array.from(new Set((teamIds || []).map(Number).filter(Boolean)));
  if(unique.length < 2) return [];
  const rotation = unique.length % 2 === 0 ? [...unique] : [...unique, 0];
  const rounds = [];
  for(let roundIndex=0; roundIndex<rotation.length - 1; roundIndex++){
    const pairs = [];
    for(let index=0; index<rotation.length / 2; index++){
      const a = Number(rotation[index] || 0);
      const b = Number(rotation[rotation.length - 1 - index] || 0);
      if(a && b) pairs.push([a,b]);
    }
    rounds.push(pairs);
    const last = rotation.pop();
    rotation.splice(1, 0, last);
  }
  return rounds;
}
function createCampoDestruidoChallengeFixtures(selectedClubId, opponentIds=[]){
  const definition = campoDestruidoChallengeDefinition();
  if(!definition) return [];
  const calendar = definition.calendario || {};
  const selected = Number(selectedClubId || 0);
  const division = clubDivision(selected);
  const divisionClubIds = (seed?.clubs || [])
    .filter(club => String(club.divisionId || '') === String(division.id || '') && challengeClubKey(clubCountry(club)) === 'argentina' && !club.specialCompetitionOnly)
    .map(club => Number(club.id))
    .filter(Boolean);
  const year = currentSeasonYear ? currentSeasonYear() : (game?.seasonYear || SEASON_START_YEAR || 2026);
  const month = String(Math.max(1, Math.min(12, Math.round(Number(calendar.mesInicio || 1))))).padStart(2, '0');
  const day = String(Math.max(1, Math.min(31, Math.round(Number(calendar.diaInicio || 1))))).padStart(2, '0');
  const startDate = `${year}-${month}-${day}`;
  const matchesTotal = Math.max(1, Math.round(Number(calendar.partidos || 1)));
  const intervalDays = Math.max(1, Math.round(Number(calendar.diasEntrePartidos || 7)));
  const firstLeagueRound = Math.max(1, Math.round(Number(calendar.fechaLigaInicial || 30)));
  const lastLeagueRound = Math.max(firstLeagueRound, Math.round(Number(calendar.fechaLigaFinal || (firstLeagueRound + matchesTotal - 1))));
  const title = String(calendar.tituloFecha || 'Reto · Fecha');
  const allRounds = createChallengeRoundRobin(divisionClubIds);
  const selectedRounds = (opponentIds || []).slice(0, matchesTotal).map(opponentId => {
    const opponent = Number(opponentId || 0);
    return allRounds.find(pairs => (pairs || []).some(pair => pair.includes(selected) && pair.includes(opponent))) || [];
  });
  const completeSchedule = selectedRounds.length === matchesTotal && selectedRounds.every(pairs => Array.isArray(pairs) && pairs.length >= Math.floor(divisionClubIds.length / 2));
  if(!completeSchedule){
    return (opponentIds || []).slice(0, matchesTotal).map((opponentId, index) => {
      const date = addDaysToIsoDate(startDate, index * intervalDays);
      const leagueRound = firstLeagueRound + index;
      const match = { id:`reto-${definition.id}-${game?.seasonNumber || 1}-${leagueRound}-${selected}-${opponentId}`, matchday:leagueRound, divisionId:division.id, divisionName:division.name, homeId:selected, awayId:Number(opponentId), played:false, homeGoals:0, awayGoals:0, date, roundDate:date, challengeId:definition.id, challengeManagerMatch:true };
      return { matchday:leagueRound, date, endDate:date, title:`${title} ${leagueRound}/${lastLeagueRound}`, challengeRound:true, matches:[match] };
    });
  }
  return selectedRounds.map((pairs, index) => {
    const date = addDaysToIsoDate(startDate, index * intervalDays);
    const leagueRound = firstLeagueRound + index;
    const forcedOpponent = Number(opponentIds[index] || 0);
    const matches = pairs.map((pair, pairIndex) => {
      let [homeId, awayId] = pair.map(Number);
      const managerPair = pair.includes(selected);
      if(managerPair){ homeId = selected; awayId = forcedOpponent; }
      else if((leagueRound + pairIndex) % 2 === 0){ [homeId, awayId] = [awayId, homeId]; }
      return {
        id:`reto-${definition.id}-${game?.seasonNumber || 1}-${leagueRound}-${homeId}-${awayId}`,
        matchday:leagueRound,
        divisionId:division.id,
        divisionName:division.name,
        homeId,
        awayId,
        played:false,
        homeGoals:0,
        awayGoals:0,
        date,
        roundDate:date,
        challengeId:definition.id,
        challengeManagerMatch:managerPair,
        challengeLeagueFinale:true
      };
    });
    return { matchday:leagueRound, date, endDate:date, title:`${title} ${leagueRound}/${lastLeagueRound}`, challengeRound:true, challengeLeagueFinale:true, matches };
  });
}
function ensureCampoDestruidoChallengeFullCalendar(){
  const challenge = game?.challenge;
  if(!challenge || challenge.completed || String(challenge.id || '') !== 'campo_destruido') return false;
  const rounds = Array.isArray(game?.fixtures) ? game.fixtures : [];
  const challengeRounds = rounds.filter(round => (round?.matches || []).some(match => String(match?.challengeId || '') === 'campo_destruido'));
  const challengeMatches = challengeRounds.flatMap(round => (round.matches || []).filter(match => String(match?.challengeId || '') === 'campo_destruido'));
  const expectedRounds = Math.max(1, Math.round(Number(challenge.matchesTotal || campoDestruidoChallengeDefinition()?.calendario?.partidos || 5)));
  const selectedClubId = Number(challenge.selectedClubId || game?.selectedClubId || 0);
  const selectedDivision = clubDivision(selectedClubId);
  const divisionTeamCount = (seed?.clubs || []).filter(club => String(club.divisionId || '') === String(selectedDivision?.id || '') && challengeClubKey(clubCountry(club)) === 'argentina' && !club.specialCompetitionOnly).length;
  const expectedTeams = Math.max(2, Number(divisionTeamCount || challenge.leagueTeams || 18));
  const expectedMatchesPerRound = Math.max(1, Math.floor(expectedTeams / 2));
  const fullCalendarReady = challengeRounds.length === expectedRounds
    && challengeRounds.every(round => (round.matches || []).filter(match => String(match?.challengeId || '') === 'campo_destruido').length >= expectedMatchesPerRound);
  if(fullCalendarReady){
    challenge.leagueTeams = Math.max(expectedTeams, challengeRounds[0]?.matches?.length ? challengeRounds[0].matches.length * 2 : 0);
    challenge.leagueMatchesTotal = challengeMatches.length;
    challenge.fullLeagueCalendar = true;
    return false;
  }
  // Una partida del reto ya iniciada conserva su calendario anterior para no reescribir
  // resultados, estadísticas ni la tabla a mitad de las cinco fechas.
  if(challengeMatches.some(match => match.played)) return false;
  const selected = Number(challenge.selectedClubId || game?.selectedClubId || 0);
  const opponentIds = Array.isArray(challenge.opponentIds) && challenge.opponentIds.length
    ? challenge.opponentIds.map(Number).filter(Boolean)
    : challengeMatches.filter(match => Number(match.homeId) === selected || Number(match.awayId) === selected)
      .map(match => Number(match.homeId) === selected ? Number(match.awayId) : Number(match.homeId)).filter(Boolean);
  const rebuilt = createCampoDestruidoChallengeFixtures(selected, opponentIds);
  const rebuiltMatches = rebuilt.flatMap(round => round.matches || []);
  if(rebuilt.length !== expectedRounds || rebuilt.some(round => (round.matches || []).length < expectedMatchesPerRound)) return false;
  game.fixtures = rebuilt;
  game.matchdayIndex = 0;
  resetChallengeDivisionStandings(selected, opponentIds);
  challenge.matchesPlayed = 0;
  challenge.leagueTeams = rebuilt[0]?.matches?.length ? rebuilt[0].matches.length * 2 : expectedTeams;
  challenge.leagueMatchesTotal = rebuiltMatches.length;
  challenge.fullLeagueCalendar = true;
  challenge.calendarMigratedTo = 'V7.41';
  if(typeof saveLocal === 'function') saveLocal(true);
  return true;
}
function resetChallengeDivisionStandings(selectedClubId, contenderIds=[]){
  if(!game || !seed?.clubs?.length) return;
  const definition = campoDestruidoChallengeDefinition();
  const tableConfig = definition?.condicionesIniciales?.tablaInicial;
  if(!tableConfig) return;
  const division = clubDivision(selectedClubId);
  game.standings = createInitialStandings();
  const selected = Number(selectedClubId);
  const contenders = (contenderIds || []).map(Number).filter(Boolean);
  const chosenTop = contenders.slice(0,2);
  const leaders = Array.isArray(tableConfig.lideres) ? tableConfig.lideres : [];
  const selectedRow = tableConfig.clubSeleccionado || {};
  const contender = tableConfig.contendiente || {};
  const sameDivision = seed.clubs
    .filter(club => String(club.divisionId || '') === String(division.id || ''))
    .sort((a,b) => Number(b.reputation || 0) - Number(a.reputation || 0) || String(a.name || '').localeCompare(String(b.name || ''), 'es'));
  let restRank = 0;
  sameDivision.forEach(club => {
    const id = Number(club.id);
    let row = null;
    const leaderIndex = chosenTop.indexOf(id);
    if(leaderIndex >= 0 && leaders[leaderIndex]) row = { clubId:id, ...leaders[leaderIndex] };
    else if(id === selected) row = { clubId:id, ...selectedRow };
    else if(contenders.includes(id)){
      const rank = contenders.indexOf(id);
      const variation = Math.min(rank, Math.max(0, Number(contender.variacionMaxima || 0)));
      row = {
        clubId:id,
        pj:Number(contender.pj || 29),
        pg:Number(contender.pgBase || 18) - variation,
        pe:Number(contender.pe || 6),
        pp:Number(contender.ppBase || 5) + variation,
        gf:Number(contender.gfBase || 48) - rank,
        gc:Number(contender.gcBase || 27) + rank
      };
      row.pts = row.pg * 3 + row.pe;
    }else{
      const pj = 29;
      const pg = Math.max(4, 13 - Math.floor(restRank * 0.7));
      const pe = Math.min(10, 5 + (restRank % 5));
      const pp = Math.max(0, pj - pg - pe);
      row = {
        clubId:id,
        pj,
        pg,
        pe,
        pp,
        gf:Math.max(20, 45 - restRank * 2),
        gc:Math.min(58, 30 + restRank * 2),
        pts:pg * 3 + pe
      };
      restRank += 1;
    }
    row.pj = Number(row.pj || 0);
    row.pg = Number(row.pg || 0);
    row.pe = Number(row.pe || 0);
    row.pp = Number(row.pp || 0);
    row.gf = Number(row.gf || 0);
    row.gc = Number(row.gc || 0);
    row.pts = Number.isFinite(Number(row.pts)) ? Number(row.pts) : row.pg * 3 + row.pe;
    row.dg = row.gf - row.gc;
    game.standings[id] = row;
  });
}
function lowerChallengeSquadLevel(selectedClubId, delta=10, exceptIds=[]){
  const except = new Set((exceptIds || []).map(Number));
  playersByClub(selectedClubId).forEach(player => {
    if(except.has(Number(player.id))) return;
    if(!player.challengeOriginalOverall) player.challengeOriginalOverall = Number(player.overall || 50);
    player.overall = clamp(Math.round(Number(player.overall || 50) - Math.max(0, Number(delta || 0))), 1, 99);
    if(player.skills && typeof player.skills === 'object'){
      Object.keys(player.skills).forEach(key => {
        if(['factorSorpresa'].includes(key)) return;
        const value = Number(player.skills[key]);
        if(Number.isFinite(value)) player.skills[key] = clamp(Math.round(value - Math.max(0, Number(delta || 0))), key === 'factorSorpresa' ? 0 : 1, 99);
      });
    }
  });
}
function moveMaradonaToChallengeClub(selectedClubId){
  const special = campoDestruidoChallengeDefinition()?.condicionesIniciales?.jugadorEspecial || {};
  const names = Array.isArray(special.nombresBusqueda) ? special.nombresBusqueda.map(challengeClubKey).filter(Boolean) : [];
  const byName = (seed?.players || []).find(player => names.some(name => challengeClubKey(player.name).includes(name)));
  if(!byName) return null;
  byName.clubId = Number(selectedClubId);
  byName.freeAgent = false;
  byName.transferListed = false;
  byName.intransferible = true;
  byName.sold = false;
  byName.retired = false;
  if(Array.isArray(game?.marketPlayers)) game.marketPlayers = game.marketPlayers.filter(player => Number(player.id) !== Number(byName.id));
  return byName;
}
function applyCampoDestruidoChallengePreset(selectedClubId){
  if(!game) return false;
  const definition = campoDestruidoChallengeDefinition();
  if(!definition) return false;
  const calendar = definition.calendario || {};
  const initial = definition.condicionesIniciales || {};
  const ownSquad = initial.plantelPropio || {};
  const rivals = initial.rivales || {};
  const special = initial.jugadorEspecial || {};
  const selected = Number(selectedClubId || game.selectedClubId || 0);
  const challengeClubs = campoDestruidoChallengeClubs();
  const allowedIds = challengeClubs.map(club => Number(club.id));
  if(!allowedIds.includes(selected)) return false;
  const matchesTotal = Math.max(1, Math.round(Number(calendar.partidos || 1)));
  const opponents = challengeClubs.filter(club => Number(club.id) !== selected).slice(0, matchesTotal);
  const opponentIds = opponents.map(club => Number(club.id));
  const maradona = moveMaradonaToChallengeClub(selected);
  const year = game.seasonYear || seasonYearForNumber(game.seasonNumber || 1);
  const month = String(Math.max(1, Math.min(12, Math.round(Number(calendar.mesInicio || 1))))).padStart(2, '0');
  const day = String(Math.max(1, Math.min(31, Math.round(Number(calendar.diaInicio || 1))))).padStart(2, '0');
  game.seasonPhase = 'regular';
  game.phaseTurn = 0;
  game.matchdayIndex = 0;
  game.globalTurn = Math.max(0, Math.round(Number(calendar.turnoGlobalInicial || 0)));
  game.currentDate = `${year}-${month}-${day}`;
  game.lastCalendarDate = game.currentDate;
  game.fixtures = createCampoDestruidoChallengeFixtures(selected, opponentIds);
  game.stadium = createInitialStadiumState();
  game.stadium.fields[selected] = clamp(Math.round(Number(initial.campoPropio || 1)), 0, 100);
  game.stadium.projects[selected] = { replantingTurnsLeft:0, patchingTurnsLeft:0 };
  resetChallengeDivisionStandings(selected, opponentIds);
  if(maradona){
    if(game.playerStats && game.playerStats[maradona.id]) game.playerStats[maradona.id].clubId = selected;
    game.playerStatus[maradona.id] = {
      ...(game.playerStatus[maradona.id] || {}),
      injuredUntilTurn:currentTurnIndex() + Math.max(1, Math.round(Number(special.diasLesion || 1))),
      injuredThrough:Math.max(0, Math.round(Number(special.lesionadoHastaFecha || 0))),
      injuryLabel:String(special.etiquetaLesion || 'Recuperación programada del reto'),
      injuredAtMatchday:0,
      injuredAtTurn:currentTurnIndex(),
      challengeInitialInjury:true
    };
    game.playerCondition[maradona.id] = clamp(Math.round(Number(special.condicionInicial || 80)), 1, 100);
    game.playerMorale[maradona.id] = clamp(Math.round(Number(special.moralInicial || 80)), 1, 100);
  }
  lowerChallengeSquadLevel(selected, Number(initial.reduccionMediaPlantel || 0), maradona ? [maradona.id] : []);
  playersByClub(selected).forEach(player => {
    if(maradona && Number(player.id) === Number(maradona.id)) return;
    game.playerCondition[player.id] = clamp(Math.round(Number(game.playerCondition[player.id] || 60)), Number(ownSquad.condicionMin || 1), Number(ownSquad.condicionMax || 100));
    game.playerMorale[player.id] = clamp(Math.round(Number(game.playerMorale[player.id] || 60)), Number(ownSquad.moralMin || 1), Number(ownSquad.moralMax || 100));
  });
  opponentIds.forEach(id => {
    game.teamCohesion[id] = Math.max(Number(game.teamCohesion[id] || 0), Number(rivals.cohesionMinima || 0));
    playersByClub(id).forEach(player => {
      game.playerCondition[player.id] = Math.max(Number(game.playerCondition[player.id] || 0), Number(rivals.condicionMinima || 0));
      game.playerMorale[player.id] = Math.max(Number(game.playerMorale[player.id] || 0), Number(rivals.moralMinima || 0));
    });
  });
  game.teamCohesion[selected] = clamp(Math.round(Number(initial.cohesionPropia || 50)), 0, 100);
  const fallbackName = String(special.nombreFallback || 'Jugador especial');
  game.challenge = {
    active:true,
    id:definition.id,
    nombre:definition.nombre,
    title:definition.nombre,
    difficulty:definition.dificultad,
    definitionVersion:managerChallengesDatabase?.metadata?.version || APP_VERSION,
    selectedClubId:selected,
    opponentIds,
    maradonaId:maradona ? Number(maradona.id) : 0,
    maradonaName:maradona?.name || fallbackName,
    maradonaRecoveryTurn:maradona ? Number(game.playerStatus[maradona.id]?.injuredUntilTurn || 0) : 0,
    startTurn:currentTurnIndex(),
    startDate:game.currentDate,
    fieldLocked:Boolean(definition?.bloqueos?.fieldMaintenance),
    requiredFieldScore:Number(initial.campoPropio || 0),
    matchesTotal,
    matchesPlayed:0,
    leagueTeams:game.fixtures?.[0]?.matches?.length ? game.fixtures[0].matches.length * 2 : 0,
    leagueMatchesTotal:(game.fixtures || []).reduce((sum, round) => sum + (round.matches || []).length, 0),
    maradonaReinjured:false,
    completed:false,
    success:false,
    objective:String(definition?.objetivo?.descripcion || ''),
    blocked:{ ...(definition.bloqueos || {}) },
    notes:Array.isArray(definition.notas) ? [...definition.notas] : []
  };
  game.tactic = normalizeTactic(selected, DEFAULT_TACTIC);
  game.mustReviewTactics = false;
  if(typeof removeOwnUnavailableFromTactic === 'function') removeOwnUnavailableFromTactic([{ type:'injury', playerId:maradona?.id || 0 }]);
  const lastMatches = Math.max(1, Math.round(Number(special.vuelveParaUltimosPartidos || 1)));
  pushGameMessage({ type:'reto', priority:'high', title:`Reto iniciado: ${definition.nombre}`, body:`Elegiste ${clubName(selected)}. Quedan ${matchesTotal} fechas en tu campo contra ${opponents.map(club => club.name).join(', ')}. En cada jornada también se simulan los otros partidos de la Primera División. Campo ${Number(initial.campoPropio || 0)}/100, mantenimiento bloqueado, mercado/staff bloqueados y ${maradona?.name || fallbackName} vuelve para los últimos ${lastMatches} partidos. Objetivo: ${String(definition?.objetivo?.descripcion || '').toLowerCase()}`, id:`challenge-${definition.id}-${selected}-${Date.now()}` });
  return true;
}
function applyChallengePreset(challengeId, selectedClubId){
  const id = String(challengeId || '');
  if(id === campoDestruidoChallengeDefinition()?.id) return applyCampoDestruidoChallengePreset(selectedClubId);
  return false;
}
function startCampoDestruidoChallenge(selectedClubId, options={}){
  if(typeof setCurrentSaveSlot === 'function') setCurrentSaveSlot(SAVE_SLOT_CAMPO_DESTRUIDO);
  const club = seed?.clubs?.find(item => Number(item.id) === Number(selectedClubId));
  if(!club){ showNotice('Club no encontrado para el reto.'); return; }
  if(!campoDestruidoChallengeClubs().some(item => Number(item.id) === Number(selectedClubId))){
    showNotice('Ese club no forma parte del reto Campo destruido.');
    return;
  }
  newGame(Number(selectedClubId), {
    managerName:options.managerName || storedManagerName(),
    country:clubCountry(club),
    leagueId:club.divisionId || 'default',
    challengeId:campoDestruidoChallengeDefinition()?.id || 'campo_destruido',
    saveSlotId:SAVE_SLOT_CAMPO_DESTRUIDO,
    ignorePrestige:true
  });
}
function managerChallengeAfterOwnMatch(match){
  const challenge = activeManagerChallenge();
  if(!challenge || challenge.completed) return;
  if(String(challenge.id || '') !== 'campo_destruido') return;
  challenge.matchesPlayed = Math.max(0, Number(challenge.matchesPlayed || 0)) + 1;
  const maradonaId = Number(challenge.maradonaId || 0);
  if(maradonaId && (match?.injuries || []).some(injury => Number(injury.playerId) === maradonaId)){
    challenge.maradonaReinjured = true;
    pushGameMessage({ type:'reto', priority:'normal', title:'Maradona volvió a lesionarse', body:`${challenge.maradonaName || 'Maradona'} sufrió una nueva lesión, pero el resultado del reto se define únicamente por la tabla final.`, id:`challenge-maradona-injury-${game.seasonNumber || 1}-${game.globalTurn || 0}` });
  }
  const pendingChallengeMatches = (game?.fixtures || []).flatMap(round => round.matches || []).filter(item => String(item?.challengeId || '') === 'campo_destruido' && !item.played);
  if(Number(challenge.matchesPlayed || 0) >= Number(challenge.matchesTotal || 5) && pendingChallengeMatches.length === 0){
    finalizeActiveManagerChallenge();
  }
}
function grantManagerChallengeSkillPoints(points=0, context={}){
  const amount = Math.max(0, Math.round(Number(points || 0)));
  if(!amount) return 0;
  const state = typeof ensureSpecialState === 'function' ? ensureSpecialState() : game?.special;
  if(!state) return 0;
  state.puntos_habilidad = Math.max(0, Math.round(Number(state.puntos_habilidad || 0) + amount));
  const logEntry = { actionId:'completar_reto_campo_destruido_primero', points:amount, date:game?.currentDate || '', season:game?.seasonNumber || 1, ...context };
  if(typeof appendSpecialPointsLog === 'function') appendSpecialPointsLog(state, logEntry);
  else {
    state.puntos_log = Array.isArray(state.puntos_log) ? state.puntos_log : [];
    state.puntos_log.push(logEntry);
    if(state.puntos_log.length > 80) state.puntos_log = state.puntos_log.slice(-80);
  }
  if(typeof persistSharedManagerProfileFromGame === 'function') persistSharedManagerProfileFromGame({ reason:'challenge_campo_destruido_reward' });
  return amount;
}
function completedChallengeResultModalActive(){
  const root = typeof $ === 'function' ? $('modalRoot') : document.getElementById('modalRoot');
  return Boolean(root?.dataset?.completedChallengeResult === '1');
}
async function closeCompletedChallengeResultScreen(){
  const challenge = game?.challenge;
  if(!challenge?.completed) return false;
  if(typeof forceCloseModal === 'function') forceCloseModal();
  else if(typeof closeModal === 'function') closeModal();
  if(typeof closeCompletedChallengeSlot === 'function') await closeCompletedChallengeSlot(challenge);
  return true;
}
function showCampoDestruidoCompletionScreen(challenge){
  if(!challenge?.completed || !challenge?.success || typeof openModal !== 'function') return false;
  const result = challenge.result || {};
  const firstReward = Number(result.skillPointsAwarded || 0) > 0;
  const dg = Number(result.dg || 0);
  const dgLabel = dg > 0 ? `+${dg}` : String(dg);
  const rewardAmount = Math.max(0, Math.round(Number(result.skillPointsAwarded || 0)));
  openModal(`<div class="challenge-completion-screen ${firstReward ? 'challenge-first-reward' : 'challenge-repeat-win'}">
    <div class="challenge-completion-emblem" aria-hidden="true">${firstReward ? '🏆' : '✓'}</div>
    <p class="label">Campo destruido</p>
    <h2>${firstReward ? '¡Reto superado!' : 'Reto superado nuevamente'}</h2>
    <p class="challenge-completion-lead">Terminaste primero con <strong>${Number(result.pts || 0)} puntos</strong> y diferencia de gol <strong>${dgLabel}</strong>.</p>
    ${firstReward
      ? `<div class="challenge-reward-box"><span>Premio único</span><strong>+${formatPlainNumber(rewardAmount)} puntos de habilidad</strong><p>Felicitaciones. Superaste por primera vez uno de los retos más exigentes del Manager.</p></div>`
      : `<div class="challenge-reward-box is-claimed"><span>Premio ya reclamado</span><strong>Sin recompensa adicional</strong><p>El reto puede repetirse, pero los 10.000 puntos de habilidad se entregan una sola vez por perfil.</p></div>`}
    <button class="primary challenge-result-continue" data-close-completed-challenge>Volver a crear partida</button>
  </div>`);
  const root = typeof $ === 'function' ? $('modalRoot') : document.getElementById('modalRoot');
  if(root) root.dataset.completedChallengeResult = '1';
  document.querySelector('[data-close-completed-challenge]')?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    closeCompletedChallengeResultScreen();
  });
  return true;
}
function finalizeActiveManagerChallenge(record=null){
  const challenge = activeManagerChallenge();
  if(!challenge || challenge.completed) return null;
  if(String(challenge.id || '') !== 'campo_destruido') return null;
  const division = clubDivision(game.selectedClubId);
  const table = sortedStandings(division.id);
  const positionIndex = table.findIndex(row => Number(row.clubId) === Number(game.selectedClubId));
  const ownRow = positionIndex >= 0 ? table[positionIndex] : (game.standings?.[game.selectedClubId] || {});
  const position = positionIndex >= 0 ? positionIndex + 1 : Number(record?.position || 0) || null;
  const champion = position === 1;
  const definition = campoDestruidoChallengeDefinition();
  const configuredReward = Math.max(0, Math.round(Number(definition?.recompensas?.puntosHabilidadPrimerPuesto || 10000)));
  const rewardAlreadyClaimed = managerChallengeRewardAlreadyClaimed(challenge.id);
  let awarded = 0;
  if(champion && !rewardAlreadyClaimed && !challenge.skillPointsAwarded){
    awarded = grantManagerChallengeSkillPoints(configuredReward, { challengeId:challenge.id, clubId:game.selectedClubId, position, pts:Number(ownRow.pts || 0), dg:Number(ownRow.dg || 0) });
    challenge.skillPointsAwarded = awarded;
  }
  challenge.completed = true;
  challenge.active = false;
  challenge.completedAt = { season:game?.seasonNumber || 1, date:game?.currentDate || '', turn:currentTurnIndex() };
  challenge.success = champion;
  challenge.result = {
    champion,
    position,
    pts:Number(ownRow.pts || 0),
    dg:Number(ownRow.dg || 0),
    gf:Number(ownRow.gf || 0),
    gc:Number(ownRow.gc || 0),
    skillPointsAwarded:awarded,
    rewardAlreadyClaimed:Boolean(rewardAlreadyClaimed)
  };
  recordManagerChallengeCompletion(challenge.id, { success:champion, rewardClaimed:awarded > 0, rewardAmount:awarded });
  const dgLabel = Number(ownRow.dg || 0) > 0 ? `+${Number(ownRow.dg || 0)}` : String(Number(ownRow.dg || 0));
  challenge.closeNotice = champion
    ? (awarded > 0
      ? `La directiva te da las gracias: terminaste 1° con ${Number(ownRow.pts || 0)} puntos y diferencia ${dgLabel}. Recibiste el premio único de ${formatPlainNumber(awarded)} puntos de habilidad.`
      : `La directiva te da las gracias: volviste a terminar 1° con ${Number(ownRow.pts || 0)} puntos y diferencia ${dgLabel}. El premio único ya había sido reclamado.`)
    : `La directiva decidió despedirte: terminaste ${position || 'fuera del primer puesto'} con ${Number(ownRow.pts || 0)} puntos y diferencia ${dgLabel}.`;
  pushGameMessage({
    type:'reto',
    priority:champion ? 'high' : 'normal',
    title:champion ? `Reto completado: ${challenge.nombre || 'Campo destruido'}` : `Reto finalizado: ${challenge.nombre || 'Campo destruido'}`,
    body:challenge.closeNotice,
    id:`challenge-result-campo-destruido-${game.seasonNumber || 1}-${game.selectedClubId}`
  });
  if(typeof saveLocal === 'function') saveLocal(true);
  if(champion){
    showCampoDestruidoCompletionScreen(challenge);
  } else {
    showNotice(challenge.closeNotice, true);
    if(typeof closeCompletedChallengeSlot === 'function') setTimeout(() => closeCompletedChallengeSlot(challenge), 1400);
  }
  return challenge;
}
function managerChallengeHomeMarkup(){
  if(typeof ensureCampoDestruidoChallengeFullCalendar === 'function') ensureCampoDestruidoChallengeFullCalendar();
  const challenge = game?.challenge;
  if(!challenge || String(challenge.id || '') !== 'campo_destruido') return '';
  const fieldScore = typeof fieldScoreForClub === 'function' ? fieldScoreForClub(game.selectedClubId) : Number(game?.stadium?.fields?.[game.selectedClubId] || 0);
  const maradonaId = Number(challenge.maradonaId || 0);
  const maradonaStatus = maradonaId && typeof isInjured === 'function' && isInjured(maradonaId)
    ? `Lesionado · vuelve en ${typeof turnsRemaining === 'function' ? turnsRemaining(maradonaId) : '?'} día(s)`
    : (challenge.maradonaReinjured ? 'Re-lesionado' : 'Disponible');
  const table = sortedStandings(clubDivision(game.selectedClubId).id);
  const pos = table.findIndex(row => Number(row.clubId) === Number(game.selectedClubId)) + 1;
  const pct = clamp((Number(challenge.matchesPlayed || 0) / Math.max(1, Number(challenge.matchesTotal || 5))) * 100, 0, 100);
  const currentRow = table.find(row => Number(row.clubId) === Number(game.selectedClubId)) || {};
  const remainingLeagueMatches = (game?.fixtures || []).flatMap(round => round.matches || []).filter(item => String(item?.challengeId || '') === 'campo_destruido' && !item.played).length;
  const rewardAlreadyClaimed = managerChallengeRewardAlreadyClaimed('campo_destruido');
  const rewardStatus = rewardAlreadyClaimed ? 'Premio único ya reclamado: podés repetir el reto, pero no volverá a pagar puntos.' : 'Premio disponible: 10.000 puntos de habilidad la primera vez que terminás primero.';
  return `<div class="card manager-challenge-card" style="margin-top:14px">
    <div class="row"><div><p class="label">Reto predeterminado</p><h3>${escapeHtml(challenge.nombre || 'Campo destruido')}</h3></div><span class="pill danger">Dificultad ${escapeHtml(challenge.difficulty || 'Alta')}</span></div>
    <p class="tagline">Objetivo: <strong>${escapeHtml(challenge.objective || 'Completar las condiciones del reto.')}</strong></p>
    <div class="grid cols-4 compact-team-stats">
      <div><p class="label">Campo</p><strong>${fieldScore}/100</strong></div>
      <div><p class="label">Posición</p><strong>${pos || '—'}°</strong></div>
      <div><p class="label">Maradona</p><strong>${escapeHtml(maradonaStatus)}</strong></div>
      <div><p class="label">Partidos propios</p><strong>${Number(challenge.matchesPlayed || 0)}/${Number(challenge.matchesTotal || 5)}</strong></div>
    </div>
    <div class="project-progress" style="margin-top:10px"><span style="width:${pct}%"></span></div>
    <p class="muted small">Tabla actual: ${Number(currentRow.pts || 0)} puntos · DG ${Number(currentRow.dg || 0) > 0 ? '+' : ''}${Number(currentRow.dg || 0)}. Quedan ${remainingLeagueMatches} partidos de liga por resolver. ${escapeHtml(rewardStatus)}</p>
    <p class="muted small">Bloqueos activos: mantenimiento de campo, fichajes, empleados y resultado directo.</p>
  </div>`;
}

function prepareManagerWithoutClubUi(){
  try{
    if(typeof forceCloseModal === 'function') forceCloseModal();
    else if(typeof closeModal === 'function') closeModal();
  }catch(error){}
  if(typeof stopAdvanceAutoClicker === 'function') stopAdvanceAutoClicker();
  if(typeof closeAutoAdvanceOverlay === 'function') closeAutoAdvanceOverlay();
  window.__liveMatchCloseLocked = false;
  activeTab = 'home';
  if(game?.gameOver?.active && typeof ensureManagerJobMarketState === 'function'){
    const state = ensureManagerJobMarketState();
    if(!state.nextIncomingOfferDate && typeof managerJobScheduleNextIncomingOffer === 'function') managerJobScheduleNextIncomingOffer(currentCalendarDate?.() || game.currentDate || '');
  }
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
function teamOptionsMarkupAll(country='Argentina', leagueId='', selectedClubId=0, statusLabel='Libre'){
  const clubs = clubsByCountryLeague(country, leagueId);
  const selected = clubs.some(club => Number(club.id) === Number(selectedClubId)) ? Number(selectedClubId) : Number(clubs[0]?.id || 0);
  return clubs.map(club => {
    const label = `${club.name} · Prestigio ${clubPrestigeValue(club)} · ${statusLabel}`;
    return `<option value="${club.id}" ${Number(club.id)===selected?'selected':''}>${escapeHtml(label)}</option>`;
  }).join('');
}

function managerAvailableClubPool(prestige=currentManagerPrestige()){
  return (seed?.clubs || [])
    .filter(club => managerCanSelectClub(club, prestige))
    .sort((a,b)=>String(a.name || '').localeCompare(String(b.name || ''), 'es', { sensitivity:'base' }));
}
function managerAvailableClubSample(limit=8, seedSuffix=''){
  const pool = managerAvailableClubPool(currentManagerPrestige());
  const keyBase = `club-options-${currentManagerPrestige()}-${game?.seasonNumber || 0}-${game?.globalTurn || 0}-${seedSuffix}`;
  return pool
    .map((club,index)=>({ club, score:hashNumber(`${keyBase}-${club.id}-${index}`, 1000000) }))
    .sort((a,b)=>a.score-b.score || String(a.club.name || '').localeCompare(String(b.club.name || ''),'es',{sensitivity:'base'}))
    .slice(0, Math.max(1, Math.min(Number(limit || 8), 8)))
    .map(item=>item.club);
}
function managerAvailableClubCard(club, options={}){
  if(!club) return '';
  const division = clubDivision(club.id);
  const budget = formatMoney(Number(club?.budget || game?.clubBudgets?.[club.id] || 0));
  const supporters = typeof clubFansBase === 'function'
    ? clubFansBase(club.id)
    : Math.max(0, Math.round(Number(club?.fansBase || club?.fansInitial || club?.supporters || 0)));
  const actionAttr = options.selectable ? ` data-select-job-club="${Number(club.id)}"` : ` data-open-job-club="${Number(club.id)}"`;
  const actionLabel = options.selectable ? 'Seleccionar' : 'Ver opción';
  return `<button type="button" class="card available-club-card"${actionAttr}>
    <div class="available-club-head"><span class="available-club-badge">${clubBadge(club.id) || '▣'}</span><strong>${escapeHtml(club.name || 'Club')}</strong></div>
    <p class="muted small">${escapeHtml(division?.name || club.divisionId || 'Liga')} · ${escapeHtml(clubCountry(club))}</p>
    <div class="available-club-meta"><span>Prestigio ${clubPrestigeValue(club)}</span><span>${budget}</span><span>${formatPlainNumber(supporters)} hinchas</span></div>
    <small>${actionLabel}</small>
  </button>`;
}
function managerAvailableClubsPanelMarkup(options={}){
  const clubs = managerAvailableClubSample(8, options.context || 'general');
  const prestigeLabel = typeof formatManagerPrestige === 'function' ? formatManagerPrestige(currentManagerPrestige()) : String(currentManagerPrestige());
  if(!clubs.length){
    return `<aside class="card available-clubs-panel"><p class="label">Clubes disponibles</p><h3>Sin opciones</h3><p class="muted small">No hay clubes disponibles con tu prestigio actual (${escapeHtml(prestigeLabel)}).</p></aside>`;
  }
  return `<aside class="card available-clubs-panel">
    <p class="label">Clubes disponibles</p>
    <h3>Opciones para tu prestigio</h3>
    <p class="muted small">Muestra aleatoria de hasta 8 equipos que aceptarían tu contrato con prestigio ${escapeHtml(prestigeLabel)}.</p>
    <div class="available-clubs-grid">${clubs.map(club => managerAvailableClubCard(club, options)).join('')}</div>
  </aside>`;
}


function normalizeManagerJobMarketState(state={}){
  const src = state && typeof state === 'object' && !Array.isArray(state) ? state : {};
  const normalizeOffer = offer => {
    const clubId = Number(offer?.clubId || 0);
    if(!clubId || !seed?.clubs?.some(club => Number(club.id) === clubId)) return null;
    const createdDate = validIsoDate(offer?.createdDate) ? offer.createdDate : (game?.currentDate || currentCalendarDate?.() || '');
    const expiresDate = validIsoDate(offer?.expiresDate) ? offer.expiresDate : addDaysToIsoDate(createdDate, 20);
    return {
      id:String(offer?.id || `job-offer-${clubId}-${createdDate}-${hashNumber(`${clubId}-${createdDate}`, 99999)}`),
      clubId,
      source:String(offer?.source || 'incoming'),
      contractType:String(offer?.contractType || 'normal'),
      createdDate,
      expiresDate,
      managerPrestigeAtOffer:Math.max(0, Math.round(Number(offer?.managerPrestigeAtOffer ?? currentManagerPrestige()))),
      objectiveBonus:Number.isFinite(Number(offer?.objectiveBonus)) ? Number(offer.objectiveBonus) : (String(offer?.contractType || '') === 'high_risk' ? 0.25 : 0),
      transferBudgetRate:Number.isFinite(Number(offer?.transferBudgetRate)) ? Number(offer.transferBudgetRate) : (String(offer?.contractType || '') === 'high_risk' ? 0.05 : null),
      rejectionChance:Number.isFinite(Number(offer?.rejectionChance)) ? clamp(Number(offer.rejectionChance), 1, 20) : 1,
      note:String(offer?.note || '')
    };
  };
  const normalizeApplication = app => {
    const clubId = Number(app?.clubId || 0);
    if(!clubId || !seed?.clubs?.some(club => Number(club.id) === clubId)) return null;
    const requestedDate = validIsoDate(app?.requestedDate) ? app.requestedDate : (game?.currentDate || currentCalendarDate?.() || '');
    return {
      id:String(app?.id || `job-app-${clubId}-${requestedDate}-${hashNumber(`${clubId}-${requestedDate}`, 99999)}`),
      clubId,
      requestedDate,
      responseDate:validIsoDate(app?.responseDate) ? app.responseDate : addDaysToIsoDate(requestedDate, 3),
      managerPrestigeAtRequest:Math.max(0, Math.round(Number(app?.managerPrestigeAtRequest ?? currentManagerPrestige()))),
      rejectionChance:Number.isFinite(Number(app?.rejectionChance)) ? clamp(Number(app.rejectionChance), 1, 20) : 1,
      status:String(app?.status || 'pending')
    };
  };
  return {
    offers:(Array.isArray(src.offers) ? src.offers : []).map(normalizeOffer).filter(Boolean).slice(-12),
    applications:(Array.isArray(src.applications) ? src.applications : []).map(normalizeApplication).filter(Boolean).slice(-12),
    nextIncomingOfferDate:validIsoDate(src.nextIncomingOfferDate) ? src.nextIncomingOfferDate : null,
    lastProcessedDate:validIsoDate(src.lastProcessedDate) ? src.lastProcessedDate : null,
    log:Array.isArray(src.log) ? src.log.slice(-25) : []
  };
}
function ensureManagerJobMarketState(){
  if(!game) return normalizeManagerJobMarketState({});
  game.managerJobMarket = normalizeManagerJobMarketState(game.managerJobMarket || {});
  return game.managerJobMarket;
}
function managerJobScheduleNextIncomingOffer(fromDate=currentCalendarDate()){
  if(!game?.gameOver?.active) return null;
  const state = ensureManagerJobMarketState();
  const base = validIsoDate(fromDate) ? fromDate : currentCalendarDate();
  const offset = 3 + hashNumber(`job-offer-wait-${game.saveCode || ''}-${game.seasonNumber || 1}-${game.globalTurn || 0}-${base}`, 5);
  state.nextIncomingOfferDate = addDaysToIsoDate(base, offset);
  return state.nextIncomingOfferDate;
}
function managerJobAvailableOfferCandidates(){
  const prestige = currentManagerPrestige();
  return (seed?.clubs || [])
    .filter(club => Number(club.id) !== Number(game?.selectedClubId || 0))
    .filter(club => managerCanSelectClub(club, prestige))
    .filter(club => !managerClubRehireBlockInfo(club).blocked)
    .sort((a,b) => clubPrestigeValue(b) - clubPrestigeValue(a) || String(a.name || '').localeCompare(String(b.name || ''), 'es', { sensitivity:'base' }));
}
function managerJobApplicationCandidates(limit=8){
  const prestige = managerClubAccessPrestige(currentManagerPrestige());
  const state = ensureManagerJobMarketState();
  const busy = new Set([
    ...state.offers.map(o => Number(o.clubId || 0)),
    ...state.applications.filter(a => a.status === 'pending').map(a => Number(a.clubId || 0))
  ]);
  const pool = (seed?.clubs || [])
    .filter(club => Number(club.id) !== Number(game?.selectedClubId || 0))
    .filter(club => !busy.has(Number(club.id)))
    .filter(club => !managerClubRehireBlockInfo(club).blocked)
    .filter(club => {
      const cp = clubPrestigeValue(club);
      return cp > prestige && cp <= prestige + 20;
    });
  const keyBase = `job-app-options-${game?.saveCode || ''}-${game?.seasonNumber || 1}-${game?.globalTurn || 0}-${prestige}`;
  return pool
    .map((club,index)=>({ club, score:hashNumber(`${keyBase}-${club.id}-${index}`, 1000000) }))
    .sort((a,b)=>a.score-b.score || clubPrestigeValue(a.club)-clubPrestigeValue(b.club))
    .slice(0, Math.max(1, Math.min(8, Number(limit || 8))))
    .map(item=>item.club);
}
function managerJobCreateOffer(clubId, options={}){
  const club = seed?.clubs?.find(c => Number(c.id) === Number(clubId));
  if(!club || !game?.gameOver?.active) return null;
  const state = ensureManagerJobMarketState();
  if(state.offers.some(o => Number(o.clubId) === Number(club.id))) return null;
  const today = currentCalendarDate();
  const contractType = String(options.contractType || 'normal');
  const offer = {
    id:`job-offer-${club.id}-${today}-${Date.now()}-${hashNumber(`${club.id}-${today}-${contractType}`, 9999)}`,
    clubId:Number(club.id),
    source:String(options.source || 'incoming'),
    contractType,
    createdDate:today,
    expiresDate:addDaysToIsoDate(today, 20),
    managerPrestigeAtOffer:currentManagerPrestige(),
    objectiveBonus:contractType === 'high_risk' ? 0.25 : 0,
    transferBudgetRate:contractType === 'high_risk' ? 0.05 : null,
    rejectionChance:Number.isFinite(Number(options.rejectionChance)) ? clamp(Number(options.rejectionChance), 1, 20) : 1,
    note:String(options.note || '')
  };
  state.offers.push(offer);
  state.log.push({ type:'offer', clubId:offer.clubId, contractType, date:today, source:offer.source });
  return offer;
}
function managerJobIncomingOfferClub(){
  const candidates = managerJobAvailableOfferCandidates();
  if(!candidates.length) return null;
  const prestige = currentManagerPrestige();
  const weighted = candidates.map(club => {
    const cp = clubPrestigeValue(club);
    const closeness = Math.max(1, 25 - Math.abs(cp - prestige));
    const reputation = Math.max(1, cp / 10);
    const jitter = 1 + (hashNumber(`job-incoming-${game?.saveCode || ''}-${game?.globalTurn || 0}-${club.id}`, 100) / 100);
    return { club, weight:closeness * reputation * jitter };
  });
  const total = weighted.reduce((sum,item)=>sum + item.weight, 0);
  let pick = hashNumber(`job-incoming-pick-${game?.saveCode || ''}-${game?.globalTurn || 0}-${currentCalendarDate()}`, Math.max(1, Math.round(total * 1000))) / 1000;
  for(const item of weighted){ pick -= item.weight; if(pick <= 0) return item.club; }
  return weighted[0]?.club || null;
}
function processManagerJobMarketDaily(){
  if(!game?.gameOver?.active) return { offers:0, expired:0, applications:0 };
  const state = ensureManagerJobMarketState();
  const today = currentCalendarDate();
  let expired = 0;
  const before = state.offers.length;
  state.offers = state.offers.filter(offer => {
    if(validIsoDate(offer.expiresDate) && daysBetweenIsoDates(offer.expiresDate, today) > 0){
      expired += 1;
      return false;
    }
    return true;
  });
  if(expired){
    pushGameMessage({ type:'directiva', priority:'normal', title:'Ofertas laborales vencidas', body:`${expired} oferta(s) para dirigir vencieron porque no fueron respondidas a tiempo.`, id:`job-offers-expired-${today}-${game.globalTurn || 0}` });
  }
  let applicationResponses = 0;
  const remainingApplications = [];
  state.applications.forEach(app => {
    if(app.status !== 'pending'){ remainingApplications.push(app); return; }
    if(!validIsoDate(app.responseDate) || daysBetweenIsoDates(app.responseDate, today) < 0){ remainingApplications.push(app); return; }
    applicationResponses += 1;
    const club = seed.clubs.find(c => Number(c.id) === Number(app.clubId));
    if(!club) return;
    const managerPrestige = currentManagerPrestige();
    const clubPrestige = clubPrestigeValue(club);
    const diff = clubPrestige - managerClubAccessPrestige(managerPrestige);
    const rejection = managerJobApplicationRejected(app, club);
    if(rejection.rejected){
      pushGameMessage({ type:'directiva', priority:'normal', title:'Solicitud rechazada', body:`${club.name} rechazó tu solicitud. La decisión interna fue negativa aunque estabas dentro del margen evaluable. Probabilidad de rechazo aplicada: ${Math.round(rejection.chance)}%.`, id:`job-application-random-rejected-${club.id}-${today}` });
    }else if(managerCanSelectClub(club, managerPrestige, { ignoreRehireBlock:false })){
      managerJobCreateOffer(club.id, { source:'application', contractType:'normal', note:'Solicitud aceptada con condiciones normales.', rejectionChance:rejection.chance });
      pushGameMessage({ type:'directiva', priority:'high', title:'Solicitud aceptada', body:`${club.name} respondió tu solicitud y te ofrece un contrato normal. Tenés 20 días para aceptar.`, id:`job-application-accepted-${club.id}-${today}` });
    }else if(diff > 0 && diff <= 20){
      managerJobCreateOffer(club.id, { source:'application', contractType:'high_risk', note:'Contrato exigente por diferencia de prestigio.', rejectionChance:rejection.chance });
      pushGameMessage({ type:'directiva', priority:'high', title:'Solicitud en evaluación aceptada', body:`${club.name} analiza tu perfil pese a la diferencia de prestigio. Te ofrece contrato con objetivo superior al normal y una restricción de fichajes muy alta. Tenés 20 días para aceptar.`, id:`job-application-risk-${club.id}-${today}` });
    }else{
      pushGameMessage({ type:'directiva', priority:'normal', title:'Solicitud rechazada', body:`${club.name} respondió que la diferencia de reputación todavía es demasiado grande para ofrecerte el cargo.`, id:`job-application-rejected-${club.id}-${today}` });
    }
  });
  state.applications = remainingApplications.slice(-12);
  let offers = 0;
  if(!state.nextIncomingOfferDate) managerJobScheduleNextIncomingOffer(today);
  const hasIncomingOffer = state.offers.some(offer => offer.source === 'incoming');
  if(!hasIncomingOffer && state.nextIncomingOfferDate && daysBetweenIsoDates(state.nextIncomingOfferDate, today) >= 0){
    const club = managerJobIncomingOfferClub();
    if(club){
      managerJobCreateOffer(club.id, { source:'incoming', contractType:'normal', note:'Oferta enviada por el club.' });
      offers += 1;
      pushGameMessage({ type:'directiva', priority:'high', title:'Oferta para dirigir', body:`${club.name} quiere contratarte como manager. Tenés 20 días para responder antes de que la oferta desaparezca.`, id:`job-offer-incoming-${club.id}-${today}` });
      managerJobScheduleNextIncomingOffer(today);
    }else{
      managerJobScheduleNextIncomingOffer(today);
    }
  }
  state.lastProcessedDate = today;
  return { offers, expired, applications:applicationResponses, previousOffers:before };
}

function managerJobApplicationRejectionChance(club, managerPrestige=currentManagerPrestige()){
  const diff = clubPrestigeValue(club) - managerClubAccessPrestige(managerPrestige);
  return clamp(Math.round(1 + Math.max(0, diff)), 1, 20);
}
function managerJobApplicationRejected(app, club){
  const chance = Number.isFinite(Number(app?.rejectionChance)) ? clamp(Number(app.rejectionChance), 1, 20) : managerJobApplicationRejectionChance(club, app?.managerPrestigeAtRequest ?? currentManagerPrestige());
  const roll = hashNumber(`job-app-reject-${app?.id || ''}-${club?.id || 0}-${app?.responseDate || currentCalendarDate()}`, 10000) / 100;
  return { rejected: roll < chance, chance, roll };
}
function managerJobOfferObjectiveDetails(offer, clubId=offer?.clubId){
  const base = Number(managerObjectiveForClubDivision(clubId));
  const highRisk = String(offer?.contractType || '') === 'high_risk';
  const bonus = highRisk ? Number(offer?.objectiveBonus || 0.25) : 0;
  const finalObjective = Number.isFinite(base) ? Number(Math.min(2.75, base + bonus).toFixed(2)) : null;
  const baseLabel = Number.isFinite(base) ? Number(base).toFixed(2) : '—';
  const finalLabel = Number.isFinite(finalObjective) ? Number(finalObjective).toFixed(2) : '—';
  const objectiveText = highRisk
    ? `Objetivo: ${finalLabel} pts/partido. Normal estimado ${baseLabel} + exigencia ${Number(bonus).toFixed(2)}.`
    : `Objetivo: ${baseLabel} pts/partido estimados según el club.`;
  const budgetRate = highRisk ? clamp(Number(offer?.transferBudgetRate || 0.05), 0.01, 1) : null;
  const restrictionText = highRisk
    ? `Restricción de fichajes: presupuesto muy limitado, aprox. ${Math.round(budgetRate * 100)}% del margen normal autorizado.`
    : 'Restricción de fichajes: condiciones normales del club.';
  return { objectiveText, restrictionText, baseLabel, finalLabel, highRisk, budgetRate };
}

function managerJobOfferCard(offer){
  const club = seed?.clubs?.find(c => Number(c.id) === Number(offer.clubId));
  if(!club) return '';
  const division = clubDivision(club.id);
  const highRisk = String(offer.contractType || '') === 'high_risk';
  const tag = highRisk ? 'Contrato exigente' : 'Contrato normal';
  const detail = managerJobOfferObjectiveDetails(offer, club.id);
  const note = highRisk
    ? 'Objetivo superior al normal y fichajes muy restringidos.'
    : 'Condiciones normales según reputación y división.';
  return `<article class="card job-offer-card ${highRisk ? 'warn' : ''}">
    <div class="row"><div><p class="label">Oferta laboral · vence ${escapeHtml(offer.expiresDate || '—')}</p><h3>${escapeHtml(club.name || 'Club')}</h3></div><span class="pill ${highRisk ? 'warn' : 'ok'}">${escapeHtml(tag)}</span></div>
    <p class="muted small">${escapeHtml(division?.name || 'Liga')} · Prestigio ${clubPrestigeValue(club)} · ${escapeHtml(note)}</p>
    <div class="job-offer-details"><p class="small"><strong>${escapeHtml(detail.objectiveText)}</strong></p><p class="muted small">${escapeHtml(detail.restrictionText)}</p></div>
    <div class="row message-actions"><button class="primary" data-accept-job-offer="${escapeHtml(offer.id)}">Aceptar cargo</button><button class="ghost" data-reject-job-offer="${escapeHtml(offer.id)}">Rechazar</button></div>
  </article>`;
}
function managerJobApplicationCard(app){
  const club = seed?.clubs?.find(c => Number(c.id) === Number(app.clubId));
  if(!club) return '';
  const chance = Number.isFinite(Number(app.rejectionChance)) ? Number(app.rejectionChance) : managerJobApplicationRejectionChance(club, app.managerPrestigeAtRequest ?? currentManagerPrestige());
  return `<article class="card job-application-card"><p class="label">Solicitud enviada</p><h3>${escapeHtml(club.name)}</h3><p class="muted small">Responden el ${escapeHtml(app.responseDate || '—')}. Prestigio club ${clubPrestigeValue(club)} · tu prestigio ${formatManagerPrestige(currentManagerPrestige())}. Riesgo de rechazo interno ${Math.round(chance)}%.</p></article>`;
}
function managerJobApplicationOptionCard(club){
  const prestige = managerClubAccessPrestige(currentManagerPrestige());
  const diff = clubPrestigeValue(club) - prestige;
  const rejectionChance = managerJobApplicationRejectionChance(club, currentManagerPrestige());
  return `<button type="button" class="card available-club-card job-application-option" data-apply-job-club="${Number(club.id)}">
    <div class="available-club-head"><span class="available-club-badge">${clubBadge(club.id) || '▣'}</span><strong>${escapeHtml(club.name || 'Club')}</strong></div>
    <p class="muted small">Prestigio ${clubPrestigeValue(club)} · ${diff > 0 ? `+${diff} sobre tu reputación` : 'alcanzable'} · rechazo ${Math.round(rejectionChance)}%</p>
    <small>Enviar solicitud · respuesta en 3 días</small>
  </button>`;
}
function managerJobMarketMarkup(){
  if(!game?.gameOver?.active) return '';
  const state = ensureManagerJobMarketState();
  if(!state.nextIncomingOfferDate) managerJobScheduleNextIncomingOffer(currentCalendarDate());
  const offers = state.offers || [];
  const applications = (state.applications || []).filter(app => app.status === 'pending');
  const options = managerJobApplicationCandidates(8);
  return `<section class="card job-market-panel">
    <div class="row"><div><p class="label">Mercado laboral</p><h3>Ofertas y solicitudes</h3></div><span class="pill">Próxima oferta: ${escapeHtml(state.nextIncomingOfferDate || '—')}</span></div>
    <p class="muted small">Mientras estás sin club, el calendario sigue corriendo. Los clubes pueden enviarte ofertas y también podés solicitar trabajo a equipos hasta 20 puntos por encima de tu prestigio.</p>
    <div class="grid cols-2 job-market-grid" style="margin-top:12px">
      <div><h4>Ofertas recibidas</h4>${offers.length ? offers.map(managerJobOfferCard).join('') : '<p class="muted small">No hay ofertas activas. Entre 3 y 7 días puede llegar una nueva.</p>'}</div>
      <div><h4>Solicitudes pendientes</h4>${applications.length ? applications.map(managerJobApplicationCard).join('') : '<p class="muted small">No hay solicitudes en espera.</p>'}</div>
    </div>
    <div style="margin-top:12px"><h4>Solicitar trabajo a clubes superiores</h4><div class="available-clubs-grid">${options.length ? options.map(managerJobApplicationOptionCard).join('') : '<p class="muted small">No hay clubes dentro del margen de 20 puntos o ya tienen una solicitud/oferta activa.</p>'}</div></div>
  </section>`;
}
function applyForManagerJob(clubId){
  if(!game?.gameOver?.active){ showNotice('Sólo podés solicitar trabajo cuando estás sin club.'); return false; }
  const club = seed?.clubs?.find(c => Number(c.id) === Number(clubId));
  if(!club){ showNotice('Club no encontrado.'); return false; }
  const rehireBlock = managerClubRehireBlockInfo(club);
  if(rehireBlock.blocked){ showNotice(managerClubRehireBlockLabel(club)); return false; }
  if(managerCanSelectClub(club, currentManagerPrestige())){
    showNotice(`${club.name} ya acepta contratarte de forma normal. Podés firmar desde Buscar otro club.`);
    return false;
  }
  const diff = clubPrestigeValue(club) - managerClubAccessPrestige(currentManagerPrestige());
  if(diff <= 0 || diff > 20){ showNotice(`${club.name} está fuera del margen de solicitud. Diferencia actual: ${diff} puntos.`); return false; }
  const state = ensureManagerJobMarketState();
  if(state.applications.some(app => Number(app.clubId) === Number(club.id) && app.status === 'pending')){ showNotice('Ya enviaste una solicitud a ese club.'); return false; }
  if(state.offers.some(offer => Number(offer.clubId) === Number(club.id))){ showNotice('Ese club ya tiene una oferta activa para vos.'); return false; }
  const today = currentCalendarDate();
  state.applications.push({
    id:`job-app-${club.id}-${today}-${Date.now()}`,
    clubId:Number(club.id),
    requestedDate:today,
    responseDate:addDaysToIsoDate(today, 3),
    managerPrestigeAtRequest:currentManagerPrestige(),
    rejectionChance:managerJobApplicationRejectionChance(club, currentManagerPrestige()),
    status:'pending'
  });
  pushGameMessage({ type:'directiva', priority:'normal', title:'Solicitud enviada', body:`Enviaste una solicitud para dirigir a ${club.name}. Responderán en 3 días.`, id:`job-application-sent-${club.id}-${today}` });
  saveLocal(true);
  renderAll();
  return true;
}
function removeManagerJobOffer(offerId){
  const state = ensureManagerJobMarketState();
  const before = state.offers.length;
  state.offers = state.offers.filter(offer => String(offer.id) !== String(offerId));
  return before !== state.offers.length;
}
function rejectManagerJobOffer(offerId){
  const state = ensureManagerJobMarketState();
  const offer = state.offers.find(item => String(item.id) === String(offerId));
  if(!offer){ showNotice('La oferta ya no está disponible.'); return; }
  const club = seed.clubs.find(c => Number(c.id) === Number(offer.clubId));
  removeManagerJobOffer(offerId);
  pushGameMessage({ type:'directiva', priority:'normal', title:'Oferta rechazada', body:`Rechazaste la oferta de ${club?.name || 'un club'}.`, id:`job-offer-rejected-${offer.clubId}-${currentCalendarDate()}` });
  saveLocal(true);
  renderAll();
}
function acceptManagerJobOffer(offerId){
  const state = ensureManagerJobMarketState();
  const offer = state.offers.find(item => String(item.id) === String(offerId));
  if(!offer){ showNotice('La oferta ya no está disponible.'); return; }
  continueCareerAtClub(offer.clubId, { jobOffer:offer, allowHighRiskContract:String(offer.contractType || '') === 'high_risk' });
}
function managerJobContractForClubSeason(clubId=game?.selectedClubId, season=game?.seasonNumber || 1){
  const contract = game?.managerJobContract;
  if(!contract || typeof contract !== 'object') return null;
  if(Number(contract.clubId || 0) !== Number(clubId || 0)) return null;
  if(Number(contract.season || 0) !== Number(season || 1)) return null;
  return contract;
}
function applyManagerJobContractToObjectiveFields(fields, clubId=game?.selectedClubId, season=game?.seasonNumber || 1){
  const clean = { ...(fields || {}) };
  const contract = managerJobContractForClubSeason(clubId, season);
  if(!contract || String(contract.contractType || '') !== 'high_risk') return clean;
  const bonus = Number.isFinite(Number(contract.objectiveBonus)) ? Number(contract.objectiveBonus) : 0.25;
  const base = Number(clean.objectivePpg ?? clean.objectiveBasePpg ?? 0);
  if(Number.isFinite(base)){
    clean.objectivePpg = Number(Math.min(2.75, base + bonus).toFixed(3));
    clean.objectiveJobContractBonus = Number(bonus.toFixed(3));
    clean.objectiveSource = 'contrato_exigente';
    clean.objectiveExpectation = 'Contrato exigente por reputación';
    clean.objectiveLabel = `${clean.objectivePpg.toFixed(2)} · contrato exigente`;
  }
  return clean;
}
function resetOutgoingClubStateAfterManagerExit(clubId=game?.selectedClubId, reason='exit'){
  if(!game || !clubId) return;
  const id = Number(clubId);
  const club = seed?.clubs?.find(c => Number(c.id) === id);
  ensureClubBudgetsState();
  const baseBudget = Math.max(0, Math.round(Number(club?.budget || 0)));
  game.clubBudgets[id] = baseBudget;
  if(Number(game.selectedClubId || 0) === id){
    game.budget = 0;
    game.seasonInitialBudget = 0;
    game.budgetHistory = [];
    game.lastBudgetDelta = 0;
  }
  game.staffActions = {};
  game.staffContracts = {};
  game.monthlyExpenses = {};
  game.academy = typeof createInitialAcademyState === 'function' ? createInitialAcademyState() : { players:[], scoutingJobs:[], residences:0 };
  if(typeof resetScoutingCenterForNewClub === 'function') resetScoutingCenterForNewClub(id);
  game.pendingTransfers = [];
  game.lastOwnPlayerOffer = null;
  game.rejectedPurchaseOffers = {};
  game.rejectedFreeAgentOffers = {};
  game.specialClauseOffers = null;
  game.bankLoan = typeof createBankLoanState === 'function' ? createBankLoanState(game.seasonNumber || 1) : null;
  game.sponsors = typeof createInitialSponsorState === 'function' ? createInitialSponsorState() : (typeof normalizeSponsorState === 'function' ? normalizeSponsorState({}) : {});
  game.transferBudget = typeof createTransferBudgetState === 'function' ? createTransferBudgetState(id, game.seasonNumber || 1, 0) : game.transferBudget;
  game.managerJobContract = null;
  game.managerJobMarket = normalizeManagerJobMarketState(game.managerJobMarket || {});
  pushGameMessage({ type:'sistema', priority:'normal', title:'Club saliente reiniciado', body:`${club?.name || 'El club anterior'} reinició economía, empleados, academia, préstamos, lista activa de ojeo y sponsors tras tu salida.`, id:`club-reset-after-${reason}-${id}-${game.seasonNumber || 1}-${game.globalTurn || 0}` });
}


function managerWithoutClubActive(){
  return Boolean(game?.gameOver?.active);
}

function formatPlainNumber(value){
  return new Intl.NumberFormat('es-AR', { maximumFractionDigits:0 }).format(Math.max(0, Math.round(Number(value || 0))));
}
function formatBudgetMillions(value){
  const millions = Number(value || 0) / 1000000;
  const digits = millions >= 100 ? 0 : 1;
  return `$${millions.toLocaleString('es-AR', { maximumFractionDigits:digits })} M`;
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

function founderModeEnabled(){ return Boolean(FOUNDER_MODE_ENABLED); }
function founderLowestDivisionByCountry(country){
  const divisions = divisionsByCountry(country);
  return divisions.slice().sort((a,b)=>(Number(b.order || 0) - Number(a.order || 0)) || String(a.name || '').localeCompare(String(b.name || ''), 'es', { sensitivity:'base' }))[0] || divisions[0] || { id:'default', name:'Liga única', country, order:1, prizeMultiplier:1 };
}
function founderProjectedDivisionId(clubId){
  const id = Number(clubId || 0);
  const movement = (game?.seasonTransition?.movements || []).find(item => Number(item?.clubId || 0) === id);
  if(movement?.toDivisionId) return String(movement.toDivisionId);
  return String(clubById(id)?.divisionId || 'default');
}
function founderReplacementClub(country, options={}){
  const division = founderLowestDivisionByCountry(country);
  const useProjectedDivision = Boolean(options?.nextSeason && game?.seasonFinalized);
  const clubs = (seed?.clubs || [])
    .filter(club => {
      if(clubCountry(club) !== country) return false;
      const divisionId = useProjectedDivision ? founderProjectedDivisionId(club.id) : String(club.divisionId || 'default');
      return divisionId === String(division.id || 'default');
    })
    .sort((a,b)=>clubPrestigeValue(a)-clubPrestigeValue(b) || Number(a.budget || 0)-Number(b.budget || 0) || String(a.name || '').localeCompare(String(b.name || ''), 'es', { sensitivity:'base' }));
  return clubs[0] || null;
}
function founderClubShort(name){
  const words = String(name || 'Club Fundador').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9\s]/g,' ').trim().split(/\s+/).filter(Boolean);
  if(words.length >= 3) return words.slice(0,3).map(w => w[0]).join('').toUpperCase().slice(0,3);
  if(words.length === 2) return (words[0].slice(0,2) + words[1][0]).toUpperCase().slice(0,3);
  return (words[0] || 'FND').slice(0,3).toUpperCase();
}
function sanitizeFounderClubInput(options={}){
  const country = availableCountries().includes(options.country) ? options.country : (availableCountries()[0] || 'Argentina');
  const clubName = String(options.clubName || '').trim().slice(0, 42) || 'Club Fundador';
  const city = String(options.city || '').trim().slice(0, 42) || 'Ciudad propia';
  const colorRaw = String(options.primaryColor || '#3b82f6').trim();
  const color = /^#[0-9a-f]{6}$/i.test(colorRaw) ? colorRaw : '#3b82f6';
  const crestOptions = Array.isArray(FOUNDER_CREST_OPTIONS) ? FOUNDER_CREST_OPTIONS : [];
  const crestRaw = String(options.crestPath || '').trim();
  const crestPath = crestOptions.includes(crestRaw) ? crestRaw : (crestOptions[0] || '');
  return { country, clubName, city, primaryColor:color, crestPath, managerName:String(options.managerName || '').trim().slice(0, 40) };
}
function releaseClubPlayersToFounderMarket(clubId){
  const released = [];
  (seed?.players || []).forEach(player => {
    if(Number(player.clubId || 0) !== Number(clubId)) return;
    player.clubId = 0;
    player.freeAgent = true;
    player.founderReleased = true;
    player.origin = player.origin || 'Club reemplazado por modo fundador';
    refreshPlayerClause(player);
    released.push({ ...player });
  });
  return released;
}
function createFoundedClubAtReplacement(options={}){
  if(!founderModeEnabled()) return null;
  const clean = sanitizeFounderClubInput(options);
  const replacement = founderReplacementClub(clean.country, { nextSeason:Boolean(options.nextSeason) });
  if(!replacement) return null;
  const division = options.nextSeason ? founderLowestDivisionByCountry(clean.country) : clubDivision(replacement.id);
  const releasedPlayers = releaseClubPlayersToFounderMarket(replacement.id);
  const nameSlug = typeof slugId === 'function' ? slugId(clean.clubName) : imageSlug(clean.clubName).toLowerCase();
  const foundedClub = {
    ...replacement,
    originalClubName:replacement.name,
    founderReplacedClub:{ id:replacement.id, name:replacement.name, country:clubCountry(replacement), divisionName:replacement.divisionName || division.name },
    isFoundedClub:true,
    founderClub:true,
    name:clean.clubName,
    short:founderClubShort(clean.clubName),
    city:clean.city,
    country:clean.country,
    reputation:FOUNDER_CLUB_REPUTATION,
    managerPrestige:FOUNDER_CLUB_REPUTATION,
    budget:FOUNDER_CLUB_INITIAL_BUDGET,
    primaryColor:clean.primaryColor,
    stadiumName:`Cancha Fundacional de ${clean.clubName}`,
    stadiumCapacity:FOUNDER_CLUB_INITIAL_CAPACITY,
    fansBase:FOUNDER_CLUB_INITIAL_FANS,
    fieldConditionScore:FOUNDER_CLUB_INITIAL_FIELD,
    fieldCondition:fieldConditionName(FOUNDER_CLUB_INITIAL_FIELD),
    crestPath:clean.crestPath || `img/escudos/${nameSlug}.png`,
    divisionId:division.id,
    divisionName:division.name,
    divisionOrder:division.order,
    prizeMultiplier:replacement.prizeMultiplier ?? divisionPrizeMultiplier(division.name, (division.order || 1)-1)
  };
  const index = seed.clubs.findIndex(club => Number(club.id) === Number(replacement.id));
  if(index >= 0) seed.clubs[index] = foundedClub;
  return { club:foundedClub, replacement, releasedPlayers, clean };
}
function founderFreeAgentGroupCounts(players=[]){
  const counts = { total:0, POR:0, DEF:0, MID:0, ATT:0 };
  (players || []).forEach(player => {
    if(Number(player.clubId || 0) !== 0 || player.sold || player.retired) return;
    counts.total += 1;
    const group = playerRoleGroup(player.position);
    if(Object.prototype.hasOwnProperty.call(counts, group)) counts[group] += 1;
  });
  return counts;
}
function ensureFounderFreeAgentPool(initialPlayers=[]){
  const pool = Array.isArray(game?.marketPlayers) ? game.marketPlayers : [];
  const existingIds = new Set(pool.map(p => Number(p.id)));
  (initialPlayers || []).forEach(player => {
    if(!player || existingIds.has(Number(player.id))) return;
    pool.push({ ...player, clubId:0, freeAgent:true });
    existingIds.add(Number(player.id));
  });
  const minimums = {
    total:FOUNDER_FREE_AGENTS_MIN_TOTAL,
    POR:FOUNDER_FREE_AGENTS_MIN_GK,
    DEF:FOUNDER_FREE_AGENTS_MIN_DEF,
    MID:FOUNDER_FREE_AGENTS_MIN_MID,
    ATT:FOUNDER_FREE_AGENTS_MIN_ATT
  };
  let guard = 0;
  while(guard < 12){
    const counts = founderFreeAgentGroupCounts(pool);
    const missing = counts.total < minimums.total || counts.POR < minimums.POR || counts.DEF < minimums.DEF || counts.MID < minimums.MID || counts.ATT < minimums.ATT;
    if(!missing) break;
    const nextStart = Math.max(0, ...((seed?.players || []).concat(pool)).map(p => Number(p.id) || 0)) + 1;
    const generated = generateMarketPlayers(24, { startId:nextStart, label:`founder-free-${guard}-${game?.selectedClubId || 0}`, nameContext:'Modo Fundador' });
    generated.forEach(player => pool.push(player));
    guard += 1;
  }
  game.marketPlayers = pruneFreeAgentMarketArrayToHardMax(pool, MARKET_FREE_AGENT_HARD_MAX);
  syncSeedFreeAgentCleanup(game.marketPlayers);
  mergeMarketPlayersIntoSeed(game.marketPlayers);
  ensurePlayerStateForAll();
  return founderFreeAgentGroupCounts(game.marketPlayers);
}
function founderGoalBaseTemplates(){
  return [
    { type:'capacity_absolute', title:'Primeras gradas', description:'Tener un estadio con capacidad para tus 500 hinchas iniciales.', target:500, importance:'Alta' },
    { type:'wins_delta', title:'Primeros 10 triunfos', description:'Ganar 10 partidos oficiales desde que se activa esta meta.', target:10, importance:'Media' },
    { type:'fans_delta', title:'Mil nuevos hinchas', description:'Sumar 1.000 hinchas desde que se activa esta meta.', target:1000, importance:'Media' },
    { type:'capacity_absolute', title:'Estadio de barrio', description:'Llegar a 5.000 espectadores de capacidad.', target:5000, importance:'Media' },
    { type:'promotion_or_title', title:'Salto deportivo', description:'Conseguir un ascenso. Si ya estás en la máxima división, salir campeón.', target:1, importance:'Alta' },
    { type:'wins_delta', title:'Racha fundacional', description:'Ganar 20 partidos oficiales desde que se activa esta meta.', target:20, importance:'Media' },
    { type:'fans_delta', title:'Arrastre popular', description:'Sumar 5.000 hinchas desde que se activa esta meta.', target:5000, importance:'Alta' },
    { type:'capacity_absolute', title:'Estadio competitivo', description:'Llegar a 20.000 espectadores de capacidad.', target:20000, importance:'Alta' },
    { type:'promotion_or_title', title:'Nueva consagración', description:'Conseguir otro ascenso. Si ya estás en la máxima división, salir campeón.', target:1, importance:'Alta' }
  ];
}
function founderLoopGoal(index){
  const cycle = Math.max(0, Math.floor((index - founderGoalBaseTemplates().length) / 4));
  const slot = Math.max(0, (index - founderGoalBaseTemplates().length) % 4);
  if(slot === 0) return { type:'wins_delta', title:`Bloque de victorias ${cycle + 1}`, description:`Ganar ${25 + cycle * 5} partidos oficiales desde que se activa esta meta.`, target:25 + cycle * 5, importance:'Media' };
  if(slot === 1) return { type:'fans_delta', title:`Nueva masa social ${cycle + 1}`, description:`Sumar ${6000 + cycle * 2000} hinchas desde que se activa esta meta.`, target:6000 + cycle * 2000, importance:'Alta' };
  if(slot === 2) return { type:'capacity_next', title:`Nueva ampliación grande ${cycle + 1}`, description:'Superar el siguiente umbral grande de capacidad.', target:30000 + cycle * 10000, importance:'Alta' };
  return { type:'promotion_or_title', title:`Logro deportivo mayor ${cycle + 1}`, description:'Conseguir un ascenso o, si ya estás en primera, salir campeón.', target:1, importance:'Alta' };
}
function founderGoalTemplate(index=0){
  const templates = founderGoalBaseTemplates();
  return index < templates.length ? templates[index] : founderLoopGoal(index);
}
function founderClubPromotionsCount(){ return Math.max(0, Math.round(Number(game?.founderGoals?.promotions || 0))); }
function founderGoalStartValues(){
  const totals = normalizeManagerStats(game?.managerStats).totals || {};
  return {
    wins:Number(totals.won || 0),
    fans:clubFansCurrent(game.selectedClubId),
    capacity:clubStadiumCapacity(game.selectedClubId),
    promotions:founderClubPromotionsCount(),
    titles:Number(game?.managerStats?.titles || 0)
  };
}
function activateFounderGoal(index=0){
  const template = founderGoalTemplate(index);
  const starts = founderGoalStartValues();
  const currentCapacity = starts.capacity;
  let type = template.type;
  let target = Math.max(1, Math.round(Number(template.target || 1)));
  if(type === 'capacity_next'){
    const thresholds = [500, 1000, 2000, 5000, 10000, 20000, 30000, 45000, 60000, 80000, 100000, 120000];
    target = thresholds.find(value => value > currentCapacity) || Math.min(120000, currentCapacity + 10000);
    type = 'capacity_absolute';
  }
  if(type === 'capacity_absolute' && currentCapacity >= target){
    const thresholds = [500, 1000, 2000, 5000, 10000, 20000, 30000, 45000, 60000, 80000, 100000, 120000];
    target = thresholds.find(value => value > currentCapacity) || Math.min(120000, currentCapacity + 10000);
  }
  if(type === 'promotion_or_title'){
    const division = clubDivision(game.selectedClubId);
    const hasUpper = divisionOrderList().some(item => Number(item.order || 0) < Number(division.order || 0));
    type = hasUpper ? 'promotion_delta' : 'title_delta';
  }
  return {
    index:Number(index || 0),
    id:`founder-goal-${index}-${game?.seasonNumber || 1}-${game?.globalTurn || 0}`,
    type,
    title:template.title,
    description:template.description,
    target,
    importance:template.importance || 'Media',
    start:starts,
    startedAt:{ season:game?.seasonNumber || 1, turn:game?.globalTurn || 0, date:game?.currentDate || '' },
    completed:false
  };
}
function ensureFounderGoalsState(){
  if(!currentGameIsFounderMode()) return null;
  game.founderGoals = game.founderGoals && typeof game.founderGoals === 'object' && !Array.isArray(game.founderGoals) ? game.founderGoals : {};
  game.founderGoals.activeIndex = Math.max(0, Math.round(Number(game.founderGoals.activeIndex || 0)));
  game.founderGoals.completed = Array.isArray(game.founderGoals.completed) ? game.founderGoals.completed : [];
  game.founderGoals.promotions = Math.max(0, Math.round(Number(game.founderGoals.promotions || 0)));
  if(!game.founderGoals.current || game.founderGoals.current.completed){
    game.founderGoals.current = activateFounderGoal(game.founderGoals.activeIndex);
  }
  return game.founderGoals;
}
function founderGoalProgress(goal=null){
  const state = ensureFounderGoalsState();
  const current = goal || state?.current;
  if(!current) return { value:0, target:1, percent:0, label:'—' };
  let value = 0;
  if(current.type === 'capacity_absolute') value = clubStadiumCapacity(game.selectedClubId);
  if(current.type === 'wins_delta') value = Math.max(0, Number(normalizeManagerStats(game.managerStats).totals?.won || 0) - Number(current.start?.wins || 0));
  if(current.type === 'fans_delta') value = Math.max(0, clubFansCurrent(game.selectedClubId) - Number(current.start?.fans || 0));
  if(current.type === 'promotion_delta') value = Math.max(0, founderClubPromotionsCount() - Number(current.start?.promotions || 0));
  if(current.type === 'title_delta') value = Math.max(0, Number(game?.managerStats?.titles || 0) - Number(current.start?.titles || 0));
  const target = Math.max(1, Number(current.target || 1));
  const percent = clamp((value / target) * 100, 0, 100);
  return { value, target, percent, label:`${formatPlainNumber(value)} / ${formatPlainNumber(target)}` };
}
function evaluateFounderGoals(options={}){
  const state = ensureFounderGoalsState();
  if(!state?.current || state.current.completed) return false;
  const progress = founderGoalProgress(state.current);
  if(progress.value < progress.target) return false;
  const completed = { ...state.current, completed:true, completedAt:{ season:game?.seasonNumber || 1, turn:game?.globalTurn || 0, date:game?.currentDate || '' } };
  state.completed.push(completed);
  state.completed = state.completed.slice(-40);
  state.activeIndex = Number(state.activeIndex || 0) + 1;
  pushGameMessage({
    type:'fundador',
    priority:'high',
    title:`Meta fundadora cumplida: ${completed.title}`,
    body:`${completed.description} Progreso final: ${progress.label}. Se activó una nueva meta del club.`,
    id:`founder-goal-complete-${completed.index}-${game?.selectedClubId}-${game?.globalTurn || 0}`
  });
  state.current = activateFounderGoal(state.activeIndex);
  if(options.silent !== true){
    pushGameMessage({ type:'fundador', priority:'normal', title:`Nueva meta fundadora: ${state.current.title}`, body:`${state.current.description} Importancia: ${state.current.importance}.`, id:`founder-goal-new-${state.current.index}-${game?.selectedClubId}-${game?.globalTurn || 0}` });
  }
  return true;
}
function founderGoalProgressMarkup(){
  const state = ensureFounderGoalsState();
  const goal = state?.current;
  if(!goal) return '';
  const progress = founderGoalProgress(goal);
  return `<div class="manager-objective-progress founder-goal-progress"><div class="manager-objective-progress-head"><span>Meta fundadora · ${escapeHtml(goal.importance)}</span><strong>${Math.round(progress.percent)}%</strong></div><div class="manager-objective-bar"><span style="width:${Math.min(100, Math.max(0, progress.percent))}%"></span></div><p><strong>${escapeHtml(goal.title)}:</strong> ${escapeHtml(goal.description)} <span class="muted">${escapeHtml(progress.label)}</span></p></div>`;
}
function founderPendingSeasonMatches(){
  return (game?.fixtures || []).reduce((total, round) => total + (round?.matches || []).filter(match => !match?.played).length, 0);
}
function founderForcedSeasonMatchDate(match, round=null){
  if(match?.clubWorldCup && typeof clubWorldCupAuthoritativeMatchDate === 'function'){
    const authoritative = clubWorldCupAuthoritativeMatchDate(match, round);
    if(validIsoDate(authoritative)) return authoritative;
  }
  return validIsoDate(match?.date) ? match.date : (validIsoDate(round?.date) ? round.date : seasonEndDateForYear(currentSeasonYear()));
}
function founderForcedSeasonDueMatches(targetDate){
  const pending = [];
  (game?.fixtures || []).forEach((round, roundIndex) => {
    (round?.matches || []).forEach(match => {
      if(match?.played) return;
      const date = founderForcedSeasonMatchDate(match, round);
      if(validIsoDate(date) && daysBetweenIsoDates(date, targetDate) >= 0) pending.push({ roundIndex, round, match, date });
    });
  });
  pending.sort((a,b) => daysBetweenIsoDates(b.date, a.date) || a.roundIndex-b.roundIndex || String(a.match?.id || '').localeCompare(String(b.match?.id || '')));
  const cupDates = pending.filter(item => item.match?.clubWorldCup).map(item => item.date).filter(validIsoDate).sort();
  const firstCupDate = cupDates[0] || '';
  return firstCupDate ? pending.filter(item => !item.match?.clubWorldCup || item.date === firstCupDate) : pending;
}
function founderForcedSeasonPoisson(lambda){
  const safe = Math.max(0.05, Math.min(4.5, Number(lambda) || 0.05));
  const limit = Math.exp(-safe);
  let product = 1;
  let count = 0;
  do{ count += 1; product *= Math.random(); }while(product > limit && count < 9);
  return Math.max(0, Math.min(7, count - 1));
}
function founderForcedSeasonClubStrength(clubId){
  const club = clubById(clubId) || {};
  const prestige = Number(typeof clubPrestigeValue === 'function' ? clubPrestigeValue(club) : (club.reputation || club.managerPrestige || 50));
  const division = typeof clubDivision === 'function' ? clubDivision(clubId) : null;
  const divisionBonus = Math.max(0, 4 - Number(division?.order || club.divisionOrder || 1)) * 2.5;
  return Math.max(10, Math.min(110, prestige + divisionBonus));
}
function founderForcedSeasonResult(match){
  const homeStrength = founderForcedSeasonClubStrength(match?.homeId);
  const awayStrength = founderForcedSeasonClubStrength(match?.awayId);
  const neutral = Boolean(match?.clubWorldCup);
  const gap = Math.max(-45, Math.min(45, homeStrength - awayStrength));
  const homeXg = Math.max(0.20, Math.min(3.80, 1.18 + gap / 42 + (neutral ? 0 : 0.16)));
  const awayXg = Math.max(0.20, Math.min(3.80, 1.08 - gap / 42));
  const homeGoals = founderForcedSeasonPoisson(homeXg);
  const awayGoals = founderForcedSeasonPoisson(awayXg);
  const possessionHome = Math.max(32, Math.min(68, Math.round(50 + gap * 0.24 + (neutral ? 0 : 2))));
  const foulsHome = 7 + (typeof hashNumber === 'function' ? hashNumber(`${match?.id || ''}-founder-home-fouls`, 12) : Math.floor(Math.random() * 12));
  const foulsAway = 7 + (typeof hashNumber === 'function' ? hashNumber(`${match?.id || ''}-founder-away-fouls`, 12) : Math.floor(Math.random() * 12));
  return {
    ...match,
    played:true,
    engine:'fundador-cierre-temporada-resumido-v7.35',
    homeGoals,
    awayGoals,
    goals:[],
    cards:[],
    injuries:[],
    substitutions:[],
    keySaves:[],
    errors:[],
    starterIdsHome:[],
    starterIdsAway:[],
    playedIdsHome:[],
    playedIdsAway:[],
    matchStats:{
      home:{ attacks:Math.max(12, Math.round(25 + homeXg * 7)), chances:Math.max(homeGoals, Math.round(homeXg * 4)), possession:possessionHome, fouls:foulsHome, passScore:Math.round(homeStrength), xg:Number(homeXg.toFixed(2)), keySaves:0, errors:0, goalErrors:0 },
      away:{ attacks:Math.max(12, Math.round(25 + awayXg * 7)), chances:Math.max(awayGoals, Math.round(awayXg * 4)), possession:100-possessionHome, fouls:foulsAway, passScore:Math.round(awayStrength), xg:Number(awayXg.toFixed(2)), keySaves:0, errors:0, goalErrors:0 }
    },
    matchContext:{ forcedSeasonEnd:true, managerAbsent:true }
  };
}
function resolveFounderForcedSeasonMatches(targetDate){
  const due = founderForcedSeasonDueMatches(targetDate);
  const results = [];
  due.forEach(item => {
    const raw = founderForcedSeasonResult(item.match);
    const result = typeof finalizeClubWorldCupMatchResult === 'function' ? finalizeClubWorldCupMatchResult(item.match, raw) : raw;
    if(typeof markScheduledResult === 'function') markScheduledResult(item, result);
    else Object.assign(item.match, result, { played:true, date:item.date });
    if(typeof applyResultToTables === 'function') applyResultToTables(item.match, Number(result.homeGoals || 0), Number(result.awayGoals || 0));
    results.push(result);
  });
  if(results.length){
    game.matchHistory = Array.isArray(game.matchHistory) ? game.matchHistory : [];
    game.matchHistory.push(...results);
    if(typeof advanceCompletedRegularRounds === 'function') advanceCompletedRegularRounds();
  }
  return results;
}
function finishCurrentSeasonForFounderCareer(){
  if(!game) return { ok:false, reason:'No hay una carrera activa.' };
  const season = Math.max(1, Math.round(Number(game.seasonNumber || 1)));
  if(game.seasonFinalized) return { ok:true, season, simulated:0, alreadyFinalized:true };
  const fromDate = validIsoDate(game.currentDate) ? game.currentDate : firstAdvanceDateForSeason(currentSeasonYear());
  const endDate = seasonEndDateForYear(currentSeasonYear());
  const skippedDays = validIsoDate(fromDate) && validIsoDate(endDate) ? Math.max(0, daysBetweenIsoDates(fromDate, endDate)) : 0;
  game.currentDate = endDate;
  rememberCalendarDate();
  if(typeof ensureClubWorldCupCurrentSeason === 'function') ensureClubWorldCupCurrentSeason({ source:'founder_forced_season_end' });
  let simulated = 0;
  let guard = 0;
  while(guard < 80){
    guard += 1;
    const results = resolveFounderForcedSeasonMatches(endDate);
    simulated += results.length;
    if(typeof advanceCompletedRegularRounds === 'function') advanceCompletedRegularRounds();
    const postCompetition = typeof createPostRegularCompetitionsIfNeeded === 'function' ? createPostRegularCompetitionsIfNeeded() : null;
    const pending = founderPendingSeasonMatches();
    if(!pending && !postCompetition?.created) break;
    if(!results.length && !postCompetition?.created && pending > 0){
      return { ok:false, season, simulated, reason:`Quedaron ${pending} partido(s) pendientes que no pudieron resolverse.` };
    }
  }
  const pending = founderPendingSeasonMatches();
  if(pending > 0) return { ok:false, season, simulated, reason:`Quedaron ${pending} partido(s) pendientes al cerrar la temporada.` };
  game.globalTurn = Math.max(0, Math.round(Number(game.globalTurn || 0))) + skippedDays;
  game.seasonPhase = 'finalizing';
  game.currentDate = endDate;
  rememberCalendarDate();
  finalizeSeasonIfNeeded({ managerAbsent:true, forcedByFounder:true });
  if(!game.seasonFinalized) return { ok:false, season, simulated, reason:'No se pudo finalizar la temporada actual.' };
  return { ok:true, season, simulated, skippedDays, alreadyFinalized:false };
}
function prepareFounderClubForCareerTransition(created){
  const clubId = Number(created?.club?.id || 0);
  if(!game || !clubId) return false;
  ensureClubBudgetsState();
  game.clubBudgets[clubId] = FOUNDER_CLUB_INITIAL_BUDGET;
  game.budget = FOUNDER_CLUB_INITIAL_BUDGET;
  game.lastBudgetDelta = 0;
  game.founderMode = true;
  game.founderClubId = clubId;
  game.founderReplacedClub = created.club.founderReplacedClub || null;
  game.founderGoals = null;
  game.founderAdministrativeCosts = {};
  game.bankruptcyMode = false;
  game.bankruptcy = null;
  game.challenge = null;
  game.managerJobContract = null;
  game.managerJobMarket = normalizeManagerJobMarketState(game.managerJobMarket || {});
  game.managerJobMarket.applications = [];
  game.gameOver = null;
  game.mustReviewTactics = false;
  game.stadium = game.stadium || createInitialStadiumState();
  game.stadium.capacityOverrides = game.stadium.capacityOverrides || {};
  game.stadium.fields = game.stadium.fields || {};
  game.stadium.capacityOverrides[clubId] = FOUNDER_CLUB_INITIAL_CAPACITY;
  game.stadium.fields[clubId] = FOUNDER_CLUB_INITIAL_FIELD;
  ensureFanState(game);
  game.fans.clubs[clubId] = { base:FOUNDER_CLUB_INITIAL_FANS, current:FOUNDER_CLUB_INITIAL_FANS, lastDelta:0, lastReason:'Modo fundador' };
  return true;
}
function startFounderCareerAfterSeason(created, transition={}){
  if(!prepareFounderClubForCareerTransition(created)) return false;
  const clubId = Number(created.club.id);
  const specialReset = typeof resetActiveSpecialCardsToReserveForNewClub === 'function'
    ? resetActiveSpecialCardsToReserveForNewClub({ reason:'founder_new_club' })
    : null;
  startNextSeason(clubId);
  game.founderMode = true;
  game.founderClubId = clubId;
  game.founderReplacedClub = created.club.founderReplacedClub || null;
  game.founderGoals = null;
  game.founderAdministrativeCosts = {};
  game.clubBudgets[clubId] = FOUNDER_CLUB_INITIAL_BUDGET;
  game.budget = FOUNDER_CLUB_INITIAL_BUDGET;
  game.seasonInitialBudget = FOUNDER_CLUB_INITIAL_BUDGET;
  game.seasonBudgetStartBySeason = game.seasonBudgetStartBySeason || {};
  game.seasonBudgetStartBySeason[game.seasonNumber] = FOUNDER_CLUB_INITIAL_BUDGET;
  game.stadium.capacityOverrides[clubId] = FOUNDER_CLUB_INITIAL_CAPACITY;
  game.stadium.fields[clubId] = FOUNDER_CLUB_INITIAL_FIELD;
  game.fans.clubs[clubId] = { base:FOUNDER_CLUB_INITIAL_FANS, current:FOUNDER_CLUB_INITIAL_FANS, lastDelta:0, lastReason:'Modo fundador' };
  ensureFounderFreeAgentPool(created.releasedPlayers || []);
  game.tactic = normalizeTactic(clubId, DEFAULT_TACTIC);
  game.mustReviewTactics = true;
  ensureFounderGoalsState();
  if(typeof checkManagerAchievements === 'function') checkManagerAchievements({ silent:false });
  const resetText = specialReset?.returned ? ` ${specialReset.returned} carta(s) activa(s) volvieron a la reserva.` : '';
  pushGameMessage({
    type:'fundador',
    priority:'high',
    title:`Club fundado: ${created.club.name}`,
    body:`La temporada ${transition.season || Math.max(1, Number(game.seasonNumber || 2) - 1)} terminó automáticamente después de quedar sin club. ${created.club.name} debuta en la temporada ${game.seasonNumber} desde la división más baja, sin plantel, sin presupuesto y con estadio de capacidad 0.${resetText}`,
    id:`founder-career-${game.seasonNumber}-${clubId}-${game.globalTurn || 0}`
  });
  activeTab = 'home';
  saveLocal(true);
  renderAll();
  showNotice(`Temporada ${game.seasonNumber} iniciada con ${created.club.name}. Armá el plantel desde Mercado antes de competir.`, true);
  return true;
}
function createFounderGame(options={}){
  if(!founderModeEnabled()){ showNotice('El modo fundador está desactivado en la configuración.'); return; }
  if(game?.gameOver?.active){
    const transition = finishCurrentSeasonForFounderCareer();
    if(!transition.ok){ showNotice(`No se pudo cerrar la temporada: ${transition.reason || 'error desconocido'}`); return; }
    const created = createFoundedClubAtReplacement({ ...options, managerName:storedManagerName(), nextSeason:true });
    if(!created?.club){ showNotice('No se pudo crear el club propio en la división más baja del país elegido.'); return; }
    startFounderCareerAfterSeason(created, transition);
    return;
  }
  if(game){ showNotice('El modo fundador sólo se puede iniciar al crear una carrera o cuando estás sin club.'); return; }
  const created = createFoundedClubAtReplacement(options);
  if(!created?.club){ showNotice('No se pudo crear el club propio en el país elegido.'); return; }
  newGame(created.club.id, {
    managerName:created.clean.managerName || storedManagerName(),
    country:created.clean.country,
    leagueId:created.club.divisionId || 'default',
    founderMode:true,
    saveSlotId:SAVE_SLOT_CAREER,
    founderReleasedPlayers:created.releasedPlayers,
    founderReplacedClub:created.club.founderReplacedClub
  });
}

function fillClubSelect(){
  const select = $('clubSelect');
  if(select) select.innerHTML = clubSelectOptionsMarkup();
}


function integrityCountryKey(value){
  return normalizeScheduleText(String(value || '').trim() || 'argentina');
}
function divisionCountryKey(division){
  return integrityCountryKey(division?.country || division?.pais || '');
}
function clubCountryKeyForIntegrity(club){
  return integrityCountryKey(typeof clubCountry === 'function' ? clubCountry(club) : (club?.country || club?.pais || 'Argentina'));
}
function isSpecialCompetitionOnlyClub(club){
  return Boolean(club?.specialCompetitionOnly || club?.clubWorldCupInvite || club?.clubWorldCupExternal || String(club?.divisionId || '') === String(CLUB_WORLD_CUP_CONFIG?.invitedDivisionId || 'club-world-cup-invitados'));
}
function integrityNormalClubs(){
  return (seed?.clubs || []).filter(club => !isSpecialCompetitionOnlyClub(club));
}
function integrityDivisionById(){
  return Object.fromEntries((seed?.divisions || []).map(division => [String(division.id || 'default'), division]));
}
function integrityDivisionsForClubCountry(club){
  const country = clubCountryKeyForIntegrity(club);
  const direct = (seed?.divisions || []).filter(division => divisionCountryKey(division) === country);
  if(direct.length) return direct.slice().sort((a,b)=>(a.order || 0)-(b.order || 0));
  const inferredIds = new Set(integrityNormalClubs()
    .filter(item => item && Number(item.id) !== Number(club?.id) && clubCountryKeyForIntegrity(item) === country)
    .map(item => String(item.divisionId || 'default')));
  return (seed?.divisions || [])
    .filter(division => inferredIds.has(String(division.id || 'default')))
    .sort((a,b)=>(a.order || 0)-(b.order || 0));
}
function safeTargetDivisionForClub(club, currentDivision=null){
  const candidates = integrityDivisionsForClubCountry(club);
  if(!candidates.length) return null;
  const currentOrder = Number(currentDivision?.order || club?.divisionOrder || 1);
  return candidates.find(division => Number(division.order || 0) === currentOrder) || candidates[0];
}
function baseClubDivisionIntegrityMap(){
  if(typeof window !== 'undefined' && window.__BASE_CLUB_DIVISION_INTEGRITY_MAP__) return window.__BASE_CLUB_DIVISION_INTEGRITY_MAP__;
  return null;
}
function baseClubDivisionEntry(club){
  const map = baseClubDivisionIntegrityMap();
  if(!map || !club) return null;
  const byId = map.byId?.[String(club.id || '')];
  if(byId) return byId;
  const key = `${integrityCountryKey(club.country || club.pais || '')}::${normalizeScheduleText(club.name || '')}`;
  return map.byName?.[key] || null;
}
function nativeTargetDivisionForClub(club, currentDivision=null){
  const divisionsById = integrityDivisionById();
  const native = baseClubDivisionEntry(club);
  if(native?.divisionId){
    const target = divisionsById[String(native.divisionId || '')];
    if(target && divisionCountryKey(target) === clubCountryKeyForIntegrity(club)) return target;
  }
  return safeTargetDivisionForClub(club, currentDivision);
}
function expectedDivisionTeamCount(division){
  const base = baseClubDivisionIntegrityMap();
  const fromBase = Number(base?.divisionCounts?.[String(division?.id || 'default')]);
  if(Number.isFinite(fromBase) && fromBase > 0) return Math.round(fromBase);
  const explicit = Number(division?.expectedTeams || division?.teamCount || division?.teamsCount || division?.cantidadEquipos);
  if(Number.isFinite(explicit) && explicit > 0) return Math.round(explicit);
  return 18;
}
function setClubIntegrityDivision(club, target){
  if(!club || !target) return false;
  const changed = String(club.divisionId || '') !== String(target.id || '');
  club.divisionId = target.id;
  club.divisionName = target.name;
  club.divisionOrder = target.order;
  club.prizeMultiplier = target.prizeMultiplier ?? divisionPrizeMultiplier(target.name, (target.order || 1)-1);
  return changed;
}

function fixtureMatchCountryIssue(match, divisionsById=integrityDivisionById()){
  if(!match) return null;
  const home = (seed?.clubs || []).find(club => Number(club.id) === Number(match.homeId));
  const away = (seed?.clubs || []).find(club => Number(club.id) === Number(match.awayId));
  if(!home || !away) return { matchId:match.id, issue:'club_inexistente', homeId:match.homeId, awayId:match.awayId, played:Boolean(match.played) };
  const division = divisionsById[String(match.divisionId || home.divisionId || '')];
  if(!division) return null;
  const divCountry = divisionCountryKey(division);
  if(divCountry && (clubCountryKeyForIntegrity(home) !== divCountry || clubCountryKeyForIntegrity(away) !== divCountry)){
    return { matchId:match.id, issue:'fixture_pais_cruzado', division:division.name, home:home.name, away:away.name, played:Boolean(match.played) };
  }
  return null;
}
function fixtureCountryIssues(){
  const divisionsById = integrityDivisionById();
  const issues = [];
  (game?.fixtures || []).forEach((round, roundIndex) => {
    (round.matches || []).forEach(match => {
      const issue = fixtureMatchCountryIssue(match, divisionsById);
      if(issue) issues.push({ ...issue, roundIndex, matchday:round.matchday || roundIndex + 1, roundTitle:round.title || '' });
    });
  });
  return issues;
}
function repairCrossCountryClubAssignments(options={}){
  if(!seed?.clubs?.length || !seed?.divisions?.length) return { repaired:0 };
  const restoreNativeIfNeeded = options.restoreNativeIfNeeded !== false;
  const divisionsById = integrityDivisionById();
  let repaired = 0;
  (seed.clubs || []).forEach(club => {
    if(isSpecialCompetitionOnlyClub(club)) return;
    const currentDivision = divisionsById[String(club.divisionId || 'default')];
    const countryMismatch = currentDivision && clubCountryKeyForIntegrity(club) !== divisionCountryKey(currentDivision);
    const invalidDivision = !currentDivision;
    if(!invalidDivision && !countryMismatch && !restoreNativeIfNeeded) return;
    if(!invalidDivision && !countryMismatch && restoreNativeIfNeeded){
      const native = baseClubDivisionEntry(club);
      if(!native?.divisionId || String(native.divisionId) === String(club.divisionId || '')) return;
      const nativeDivision = divisionsById[String(native.divisionId || '')];
      if(!nativeDivision || divisionCountryKey(nativeDivision) !== clubCountryKeyForIntegrity(club)) return;
      if(setClubIntegrityDivision(club, nativeDivision)) repaired += 1;
      return;
    }
    const target = nativeTargetDivisionForClub(club, currentDivision);
    if(!target) return;
    if(setClubIntegrityDivision(club, target)) repaired += 1;
  });
  return { repaired };
}
function rebuildSafeSeasonFixturesAfterStructureRepair(){
  if(!game || !Array.isArray(game.fixtures)) return { rebuilt:false, reason:'sin_calendario', blockedPlayedCross:0 };
  const issues = fixtureCountryIssues();
  const playedCross = issues.filter(item => item.played);
  if(playedCross.length) return { rebuilt:false, reason:'hay_partidos_cruzados_jugados', blockedPlayedCross:playedCross.length, issues };
  if(!issues.length) return { rebuilt:false, reason:'sin_partidos_cruzados', blockedPlayedCross:0, issues };
  if(typeof generateFixturesForDivisions !== 'function') return { rebuilt:false, reason:'generador_no_disponible', blockedPlayedCross:0, issues };
  const nextRegular = generateFixturesForDivisions(seed.clubs || [], divisionOrderList(), { seasonYear:game.seasonYear || seasonYearForNumber(game.seasonNumber || 1) });
  const previousRegular = (game.fixtures || []).filter(round => !isPromotionPlayoffRound(round));
  const previousPlayoffs = (game.fixtures || []).filter(isPromotionPlayoffRound);
  const mergedRegular = typeof mergePlayedFixturesIntoCalendar === 'function'
    ? mergePlayedFixturesIntoCalendar(nextRegular, previousRegular)
    : nextRegular;
  game.fixtures = mergedRegular.concat(previousPlayoffs);
  game.calendarVersion = `${SEASON_CALENDAR_VERSION}-country-safe`;
  return { rebuilt:true, reason:'calendario_regenerado', fixed:issues.length, blockedPlayedCross:0, issues };
}
function divisionCountIntegrityRows(){
  return (seed?.divisions || []).map(division => {
    const expected = expectedDivisionTeamCount(division);
    const count = integrityNormalClubs().filter(club => String(club.divisionId || 'default') === String(division.id || 'default')).length;
    return { id:division.id, name:division.name, country:division.country || '', order:division.order || 1, expected, count, delta:count - expected };
  });
}
function buildDivisionCountRepairPlan(){
  const divisions = (seed?.divisions || []).slice();
  const byId = Object.fromEntries(divisions.map(division => [String(division.id || 'default'), division]));
  const normalClubs = integrityNormalClubs();
  const assignments = new Map(normalClubs.map(club => [Number(club.id), String(club.divisionId || 'default')]));
  const plan = [];
  const countries = Array.from(new Set(divisions.map(division => divisionCountryKey(division)).filter(Boolean)));
  countries.forEach(country => {
    const countryDivisions = divisions
      .filter(division => divisionCountryKey(division) === country)
      .sort((a,b)=>(a.order || 0)-(b.order || 0));
    const expectedById = Object.fromEntries(countryDivisions.map(division => [String(division.id || 'default'), expectedDivisionTeamCount(division)]));
    const countFor = divisionId => Array.from(assignments.values()).filter(value => String(value) === String(divisionId)).length;
    const countryClubIds = normalClubs
      .filter(club => clubCountryKeyForIntegrity(club) === country)
      .map(club => Number(club.id));
    countryDivisions.forEach(targetDivision => {
      let need = Math.max(0, expectedById[String(targetDivision.id || 'default')] - countFor(targetDivision.id));
      while(need > 0){
        const overflowDivisions = countryDivisions
          .filter(division => countFor(division.id) > expectedById[String(division.id || 'default')])
          .sort((a,b)=>Math.abs((a.order || 1) - (targetDivision.order || 1)) - Math.abs((b.order || 1) - (targetDivision.order || 1)));
        if(!overflowDivisions.length) break;
        let chosenClub = null;
        let fromDivision = null;
        overflowDivisions.some(sourceDivision => {
          const candidates = countryClubIds
            .filter(clubId => String(assignments.get(clubId)) === String(sourceDivision.id || 'default'))
            .map(clubId => (seed?.clubs || []).find(club => Number(club.id) === Number(clubId)))
            .filter(Boolean)
            .sort((a,b) => {
              const nativeA = baseClubDivisionEntry(a);
              const nativeB = baseClubDivisionEntry(b);
              const targetId = String(targetDivision.id || 'default');
              const nativeScoreA = String(nativeA?.divisionId || '') === targetId ? 0 : 10;
              const nativeScoreB = String(nativeB?.divisionId || '') === targetId ? 0 : 10;
              const selectedScoreA = Number(a.id) === Number(game?.selectedClubId || 0) ? 5 : 0;
              const selectedScoreB = Number(b.id) === Number(game?.selectedClubId || 0) ? 5 : 0;
              const foundedScoreA = typeof isFoundedClubId === 'function' && isFoundedClubId(a.id) ? 5 : 0;
              const foundedScoreB = typeof isFoundedClubId === 'function' && isFoundedClubId(b.id) ? 5 : 0;
              return (nativeScoreA + selectedScoreA + foundedScoreA) - (nativeScoreB + selectedScoreB + foundedScoreB);
            });
          if(candidates.length){
            chosenClub = candidates[0];
            fromDivision = sourceDivision;
            return true;
          }
          return false;
        });
        if(!chosenClub || !fromDivision) break;
        assignments.set(Number(chosenClub.id), String(targetDivision.id || 'default'));
        plan.push({
          clubId:chosenClub.id,
          clubName:chosenClub.name,
          fromDivisionId:fromDivision.id,
          fromDivisionName:fromDivision.name,
          toDivisionId:targetDivision.id,
          toDivisionName:targetDivision.name,
          country:targetDivision.country || country
        });
        need -= 1;
      }
    });
  });
  return plan.filter(item => byId[String(item.fromDivisionId || '')] && byId[String(item.toDivisionId || '')]);
}

function matchHasMinimumBotStats(match){
  if(!match || !match.played) return true;
  if(typeof ownClubInMatch === 'function' && ownClubInMatch(match)) return true;
  const goals = Array.isArray(match.goals) ? match.goals : [];
  const cards = Array.isArray(match.cards) ? match.cards : [];
  const injuries = Array.isArray(match.injuries) ? match.injuries : [];
  const keySaves = Array.isArray(match.keySaves) ? match.keySaves : [];
  const errors = Array.isArray(match.errors) ? match.errors : [];
  const stats = match.matchStats || {};
  const homeStats = stats.home || {};
  const awayStats = stats.away || {};
  const goalsOk = Number(match.homeGoals || 0) + Number(match.awayGoals || 0) === goals.length && goals.every(g => Number.isFinite(Number(g.playerId)) && Number(g.playerId) > 0 && (Number(match.homeGoals || 0) + Number(match.awayGoals || 0) <= 0 || g.clubId));
  const assistsOk = goals.every(g => g.assistId === null || g.assistId === undefined || Number(g.assistId) > 0);
  const cardsOk = Array.isArray(cards) && cards.every(c => Number(c.playerId || 0) > 0 && ['yellow','red','secondYellowRed'].includes(String(c.type || '')));
  const injuriesOk = Array.isArray(injuries) && injuries.every(i => Number(i.playerId || 0) > 0 && String(i.injuryLabel || i.name || '').trim());
  const savesOk = Array.isArray(keySaves) && keySaves.every(k => Number(k.playerId || 0) > 0);
  const errorsOk = Array.isArray(errors) && errors.every(e => Number(e.playerId || 0) > 0);
  const statsOk = ['attacks','chances','possession','fouls','keySaves','errors','goalErrors'].every(key => Number.isFinite(Number(homeStats[key] ?? 0)) && Number.isFinite(Number(awayStats[key] ?? 0)));
  const playedIdsOk = Array.isArray(match.playedIdsHome) && match.playedIdsHome.length > 0 && Array.isArray(match.playedIdsAway) && match.playedIdsAway.length > 0;
  return Boolean(goalsOk && assistsOk && cardsOk && injuriesOk && savesOk && errorsOk && statsOk && playedIdsOk);
}
function botMatchStatsIntegrityIssues(){
  if(!game?.fixtures?.length) return [];
  const issues = [];
  (game.fixtures || []).forEach((round, roundIndex) => {
    (round.matches || []).forEach(match => {
      if(!match?.played) return;
      if(typeof ownClubInMatch === 'function' && ownClubInMatch(match)) return;
      if(matchHasMinimumBotStats(match)) return;
      issues.push({
        matchId:match.id,
        roundIndex,
        matchday:round.matchday || roundIndex + 1,
        divisionId:match.divisionId || round.divisionId || '',
        home:clubName(match.homeId),
        away:clubName(match.awayId),
        engine:match.engine || 'sin motor',
        goals:Array.isArray(match.goals) ? match.goals.length : 'faltan',
        cards:Array.isArray(match.cards) ? match.cards.length : 'faltan',
        injuries:Array.isArray(match.injuries) ? match.injuries.length : 'faltan',
        keySaves:Array.isArray(match.keySaves) ? match.keySaves.length : 'faltan',
        errors:Array.isArray(match.errors) ? match.errors.length : 'faltan'
      });
    });
  });
  return issues;
}

function integrityClonePlain(value){
  try{ return JSON.parse(JSON.stringify(value ?? null)); }
  catch(_){ return value ?? null; }
}
function integrityMatchFiniteScore(match){
  const homeGoals = Number(match?.homeGoals);
  const awayGoals = Number(match?.awayGoals);
  if(!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) return null;
  return { homeGoals:Math.max(0, Math.round(homeGoals)), awayGoals:Math.max(0, Math.round(awayGoals)) };
}
function integrityMatchComparableDate(match, round){
  const direct = String(match?.date || '').slice(0,10);
  if(validIsoDate(direct)) return direct;
  if(typeof scheduledDateForMatch === 'function') return scheduledDateForMatch(match, round);
  return String(round?.date || '').slice(0,10);
}
function integritySameScheduledMatch(record, match, round){
  if(!record || !match) return false;
  if(match.id && record.id && String(record.id) === String(match.id)) return true;
  const date = integrityMatchComparableDate(match, round);
  const recordDate = String(record.date || '').slice(0,10);
  return Number(record.homeId) === Number(match.homeId)
    && Number(record.awayId) === Number(match.awayId)
    && String(record.divisionId || '') === String(match.divisionId || round?.divisionId || '')
    && (!validIsoDate(date) || !validIsoDate(recordDate) || date === recordDate);
}
function integrityHistoryRecordForFixture(match, round, requireValid=false){
  const history = Array.isArray(game?.matchHistory) ? game.matchHistory : [];
  return history.find(record => {
    if(!record?.played) return false;
    if(!integritySameScheduledMatch(record, match, round)) return false;
    if(requireValid && !matchHasMinimumBotStats(record)) return false;
    return true;
  }) || null;
}
function integrityBotLineupForRepair(clubId){
  if(typeof quickBotLineup === 'function'){
    const lineup = quickBotLineup(clubId);
    if(Array.isArray(lineup) && lineup.length) return lineup;
  }
  const squad = typeof playersByClub === 'function' ? playersByClub(clubId) : [];
  return (squad || [])
    .filter(player => !player?.id || typeof isUnavailable !== 'function' || !isUnavailable(player.id))
    .sort((a,b) => Number((typeof effectiveOverall === 'function' ? effectiveOverall(b) : b?.overall) || 0) - Number((typeof effectiveOverall === 'function' ? effectiveOverall(a) : a?.overall) || 0))
    .slice(0, 11);
}
function integrityPickRepairPlayer(lineup=[], role='goal'){
  const list = (lineup || []).filter(player => Number(player?.id || 0) > 0);
  if(!list.length) return null;
  const posScore = player => {
    const pos = String(player?.position || '').toUpperCase();
    if(role === 'assist') return ['MCO','MC','MD','MI','ED','EI'].includes(pos) ? 6 : ['LD','LI','MCD'].includes(pos) ? 3 : 1;
    if(role === 'save') return pos === 'POR' ? 20 : 1;
    if(pos === 'DC') return 9;
    if(['ED','EI','MCO'].includes(pos)) return 6;
    if(['MC','MD','MI'].includes(pos)) return 3;
    if(['DFC','LD','LI','MCD'].includes(pos)) return 1.5;
    return 0.7;
  };
  const weighted = list.map(player => ({ player, weight:Math.max(1, Number(posScore(player)) || 1) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for(const item of weighted){
    roll -= item.weight;
    if(roll <= 0) return item.player;
  }
  return weighted[0].player;
}
function integrityBuildRepairGoals(clubId, lineup, count){
  const goals = [];
  const total = Math.max(0, Math.round(Number(count || 0)));
  for(let i=0; i<total; i++){
    const scorer = integrityPickRepairPlayer(lineup, 'goal');
    if(!scorer) return null;
    const assistants = (lineup || []).filter(player => Number(player?.id) !== Number(scorer.id));
    const assister = assistants.length && Math.random() < 0.70 ? integrityPickRepairPlayer(assistants, 'assist') : null;
    goals.push({
      clubId:Number(clubId),
      playerId:Number(scorer.id),
      assistId:assister ? Number(assister.id) : null,
      minute:Math.max(1, Math.min(90, Math.round(8 + Math.random() * 80))),
      integrityRepair:true
    });
  }
  return goals.sort((a,b) => a.minute - b.minute);
}
function integrityBuildRepairStats(match, score){
  const homeRating = typeof quickClubRating === 'function' ? quickClubRating(match.homeId) : 55;
  const awayRating = typeof quickClubRating === 'function' ? quickClubRating(match.awayId) : 55;
  const homeChances = Math.max(score.homeGoals, Math.round(4 + score.homeGoals * 2 + Math.random() * 6));
  const awayChances = Math.max(score.awayGoals, Math.round(4 + score.awayGoals * 2 + Math.random() * 6));
  const homePoss = Math.max(35, Math.min(65, Math.round(50 + (homeRating - awayRating) * 0.25 + Math.random() * 10 - 5)));
  const awayPoss = 100 - homePoss;
  return {
    home:{ attacks:Math.max(12, Math.round(24 + homeChances * 3)), chances:homeChances, possession:homePoss, fouls:Math.round(6 + Math.random() * 11), passScore:Math.round(homeRating), xg:Number(Math.max(0.2, score.homeGoals * 0.75 + homeChances * 0.11).toFixed(2)), keySaves:0, errors:0, goalErrors:0 },
    away:{ attacks:Math.max(12, Math.round(22 + awayChances * 3)), chances:awayChances, possession:awayPoss, fouls:Math.round(6 + Math.random() * 11), passScore:Math.round(awayRating), xg:Number(Math.max(0.2, score.awayGoals * 0.75 + awayChances * 0.11).toFixed(2)), keySaves:0, errors:0, goalErrors:0 }
  };
}
function integrityGenerateBotFixtureDetails(match, round){
  const score = integrityMatchFiniteScore(match);
  if(!score) return null;
  const homeLineup = integrityBotLineupForRepair(match.homeId);
  const awayLineup = integrityBotLineupForRepair(match.awayId);
  if(!homeLineup.length || !awayLineup.length) return null;
  const homeGoals = integrityBuildRepairGoals(match.homeId, homeLineup, score.homeGoals);
  const awayGoals = integrityBuildRepairGoals(match.awayId, awayLineup, score.awayGoals);
  if(!homeGoals || !awayGoals) return null;
  const starterIdsHome = homeLineup.map(player => Number(player.id)).filter(Number.isFinite);
  const starterIdsAway = awayLineup.map(player => Number(player.id)).filter(Number.isFinite);
  const date = integrityMatchComparableDate(match, round);
  return {
    ...integrityClonePlain(match),
    played:true,
    date:validIsoDate(date) ? date : match.date,
    homeGoals:score.homeGoals,
    awayGoals:score.awayGoals,
    goals:homeGoals.concat(awayGoals).sort((a,b) => a.minute - b.minute),
    cards:Array.isArray(match.cards) ? match.cards : [],
    injuries:Array.isArray(match.injuries) ? match.injuries : [],
    substitutions:Array.isArray(match.substitutions) ? match.substitutions : [],
    keySaves:Array.isArray(match.keySaves) ? match.keySaves : [],
    errors:Array.isArray(match.errors) ? match.errors : [],
    matchStats:integrityBuildRepairStats(match, score),
    matchContext:match.matchContext || { weather:'Normal', pitch:'Normal', integrityRepair:true },
    starterIdsHome,
    starterIdsAway,
    playedIdsHome:starterIdsHome,
    playedIdsAway:starterIdsAway,
    instructionConditionDeltas:match.instructionConditionDeltas || {},
    engine:match.engine || 'bot-integrity-repair-v5.33',
    integrityRepair:true
  };
}
function integrityCopyBotMatchDetails(target, source){
  if(!target || !source) return false;
  const fields = [
    'played','homeGoals','awayGoals','goals','cards','injuries','substitutions','keySaves','errors',
    'matchStats','matchContext','starterIdsHome','starterIdsAway','playedIdsHome','playedIdsAway',
    'instructionConditionDeltas','botOverexertionEvents','engine','suspended','defaultWin','defaultLoss','suspensionReason','integrityRepair'
  ];
  fields.forEach(field => {
    if(Object.prototype.hasOwnProperty.call(source, field)) target[field] = integrityClonePlain(source[field]);
  });
  target.played = true;
  if(source.date) target.date = source.date;
  return true;
}
function runDailyMatchStatsIntegrityRepair(options={}){
  const summary = { checked:0, fixed:0, fixedFromHistory:0, fixedGenerated:0, skipped:0, remaining:0 };
  if(!game?.fixtures?.length) return summary;
  const today = validIsoDate(game.currentDate) ? game.currentDate : (typeof currentCalendarDate === 'function' ? currentCalendarDate() : '');
  const force = Boolean(options.force);
  if(!force && game.lastMatchStatsIntegrityRepairDate === today) return game.lastMatchStatsIntegrityRepairSummary || summary;
  (game.fixtures || []).forEach((round) => {
    (round.matches || []).forEach(match => {
      if(!match?.played) return;
      if(typeof ownClubInMatch === 'function' && ownClubInMatch(match)) return;
      if(matchHasMinimumBotStats(match)) return;
      summary.checked += 1;
      const validHistory = integrityHistoryRecordForFixture(match, round, true);
      const existingHistory = integrityHistoryRecordForFixture(match, round, false);
      if(validHistory){
        integrityCopyBotMatchDetails(match, validHistory);
        summary.fixed += 1;
        summary.fixedFromHistory += 1;
        return;
      }
      const generated = integrityGenerateBotFixtureDetails(match, round);
      if(generated && matchHasMinimumBotStats(generated)){
        integrityCopyBotMatchDetails(match, generated);
        if(existingHistory) integrityCopyBotMatchDetails(existingHistory, generated);
        else {
          game.matchHistory = Array.isArray(game.matchHistory) ? game.matchHistory : [];
          game.matchHistory.push(integrityClonePlain(generated));
        }
        summary.fixed += 1;
        summary.fixedGenerated += 1;
        return;
      }
      summary.skipped += 1;
    });
  });
  summary.remaining = botMatchStatsIntegrityIssues().length;
  game.lastMatchStatsIntegrityRepairDate = today;
  game.lastMatchStatsIntegrityRepairSummary = { ...summary, reason:options.reason || 'daily', checkedAt:new Date().toISOString() };
  if(summary.fixed > 0){
    game.matchIntegrityRepairLog = Array.isArray(game.matchIntegrityRepairLog) ? game.matchIntegrityRepairLog.slice(-20) : [];
    game.matchIntegrityRepairLog.push({ ...game.lastMatchStatsIntegrityRepairSummary });
  }
  if(summary.fixed > 0 && !options.silent && typeof showNotice === 'function'){
    showNotice(`Se repararon ${summary.fixed} partido(s) bot con estadísticas mínimas faltantes.`, false);
  }
  return summary;
}

function currentFreeAgentIntegrityCount(){
  const ids = new Set();
  (game?.marketPlayers || []).forEach(player => { if(Number(player?.clubId || 0) === 0) ids.add(Number(player.id)); });
  (seed?.players || []).forEach(player => { if(Number(player?.clubId || 0) === 0) ids.add(Number(player.id)); });
  return Array.from(ids).filter(Number.isFinite).length;
}
function inspectGameIntegrity(){
  const result = {
    ok:true,
    checkedAt:new Date().toISOString(),
    issues:[],
    warnings:[],
    repairables:[],
    stats:{ clubs:Number(seed?.clubs?.length || 0), divisions:Number(seed?.divisions?.length || 0), players:Number(seed?.players?.length || 0), freeAgents:currentFreeAgentIntegrityCount(), fixtures:Number(game?.fixtures?.length || 0) },
    canRepair:false
  };
  if(!seed?.clubs?.length || !seed?.divisions?.length){
    result.ok = false;
    result.issues.push({ type:'base_missing', severity:'high', title:'Base incompleta', detail:'No se cargaron clubes o divisiones suficientes para verificar.' });
    return result;
  }
  if(!game){
    result.warnings.push({ type:'no_game', severity:'low', title:'Sin partida activa', detail:'La base cargó bien, pero no hay partida guardada/activa para verificar estado interno.' });
    return result;
  }
  const divisionsById = integrityDivisionById();
  const validClubIds = new Set((seed.clubs || []).map(club => Number(club.id)));
  const duplicateClubIds = [];
  const seenClubIds = new Set();
  (seed.clubs || []).forEach(club => {
    const id = Number(club.id);
    if(seenClubIds.has(id)) duplicateClubIds.push(id);
    seenClubIds.add(id);
  });
  if(duplicateClubIds.length){
    result.ok = false;
    result.issues.push({ type:'duplicate_club_ids', severity:'high', title:'IDs de clubes duplicados', detail:`Hay ${duplicateClubIds.length} IDs repetidos. Esto requiere revisión manual.`, samples:duplicateClubIds.slice(0,8) });
  }
  const crossCountryClubs = [];
  const invalidDivisionClubs = [];
  integrityNormalClubs().forEach(club => {
    const divisionId = String(club.divisionId || 'default');
    const division = divisionsById[divisionId];
    if(!division){
      const target = nativeTargetDivisionForClub(club, null);
      invalidDivisionClubs.push({ clubId:club.id, clubName:club.name, divisionId, targetDivisionId:target?.id || '', targetDivisionName:target?.name || '' });
      return;
    }
    const clubCountry = clubCountryKeyForIntegrity(club);
    const divCountry = divisionCountryKey(division);
    if(clubCountry && divCountry && clubCountry !== divCountry){
      const target = nativeTargetDivisionForClub(club, division);
      crossCountryClubs.push({
        clubId:club.id,
        clubName:club.name,
        clubCountry:club.country || club.pais || clubCountry,
        currentDivisionId:division.id,
        currentDivisionName:division.name,
        currentDivisionCountry:division.country || divCountry,
        targetDivisionId:target?.id || '',
        targetDivisionName:target?.name || ''
      });
    }
  });
  if(invalidDivisionClubs.length){
    result.ok = false;
    result.issues.push({ type:'invalid_club_division', severity:'high', title:'Clubes con división inexistente', detail:`Hay ${invalidDivisionClubs.length} clubes apuntando a divisiones que no existen.`, samples:invalidDivisionClubs.slice(0,8) });
    result.repairables.push({ type:'invalid_club_division', title:'Reasignar clubes con división inexistente a una división válida de su país', count:invalidDivisionClubs.filter(item => item.targetDivisionId).length, items:invalidDivisionClubs });
  }
  if(crossCountryClubs.length){
    result.ok = false;
    result.issues.push({ type:'cross_country_clubs', severity:'high', title:'Clubes en ligas de otro país', detail:`Hay ${crossCountryClubs.length} clubes ubicados en una división de otro país.`, samples:crossCountryClubs.slice(0,8) });
    result.repairables.push({ type:'cross_country_clubs', title:'Reasignar clubes a una división válida de su país', count:crossCountryClubs.filter(item => item.targetDivisionId).length, items:crossCountryClubs });
  }
  const overrides = game?.clubDivisionOverrides || {};
  const invalidOverrides = [];
  Object.entries(overrides).forEach(([clubId, override]) => {
    const club = (seed.clubs || []).find(item => Number(item.id) === Number(clubId));
    if(club && isSpecialCompetitionOnlyClub(club)) return;
    const division = divisionsById[String(override?.divisionId || '')];
    if(!club || !division){
      invalidOverrides.push({ clubId, clubName:club?.name || 'Club inexistente', divisionId:override?.divisionId || '' });
      return;
    }
    const clubCountry = clubCountryKeyForIntegrity(club);
    const divCountry = divisionCountryKey(division);
    if(clubCountry && divCountry && clubCountry !== divCountry){
      invalidOverrides.push({ clubId, clubName:club.name, divisionId:division.id, divisionName:division.name, clubCountry:club.country || clubCountry, divisionCountry:division.country || divCountry });
    }
  });
  if(invalidOverrides.length){
    result.ok = false;
    result.issues.push({ type:'invalid_division_overrides', severity:'medium', title:'Overrides de división inconsistentes', detail:`Hay ${invalidOverrides.length} asignaciones guardadas con división inválida o de otro país.`, samples:invalidOverrides.slice(0,8) });
    result.repairables.push({ type:'invalid_division_overrides', title:'Regenerar overrides desde la estructura actual reparada', count:invalidOverrides.length, items:invalidOverrides });
  }
  const invalidPlayers = (seed.players || []).filter(player => Number(player.clubId || 0) > 0 && !validClubIds.has(Number(player.clubId)));
  if(invalidPlayers.length){
    result.ok = false;
    result.issues.push({ type:'invalid_player_clubs', severity:'medium', title:'Jugadores con club inexistente', detail:`Hay ${invalidPlayers.length} jugadores asignados a clubes que no existen.`, samples:invalidPlayers.slice(0,8).map(p => ({ id:p.id, name:p.name, clubId:p.clubId })) });
  }
  if(game?.selectedClubId && !validClubIds.has(Number(game.selectedClubId))){
    result.ok = false;
    result.issues.push({ type:'invalid_selected_club', severity:'high', title:'Club del manager inexistente', detail:`El club seleccionado (${game.selectedClubId}) no existe en la base actual.` });
  }
  const invalidStandingIds = Object.keys(game?.standings || {}).filter(id => !validClubIds.has(Number(id)));
  if(invalidStandingIds.length){
    result.ok = false;
    result.issues.push({ type:'invalid_standings', severity:'medium', title:'Tabla con clubes inexistentes', detail:`Hay ${invalidStandingIds.length} entradas de tabla de clubes inexistentes.`, samples:invalidStandingIds.slice(0,8) });
  }
  const fixtureIssues = fixtureCountryIssues();
  if(fixtureIssues.length){
    const playedFixtureIssues = fixtureIssues.filter(item => item.played);
    const unplayedFixtureIssues = fixtureIssues.filter(item => !item.played);
    result.ok = false;
    const detail = playedFixtureIssues.length
      ? `Hay ${fixtureIssues.length} partidos cuyo país no coincide con la división del fixture. ${playedFixtureIssues.length} ya fueron jugados y no se reconstruyen automáticamente para no borrar resultados.`
      : `Hay ${fixtureIssues.length} partidos cuyo país no coincide con la división del fixture. Como no están jugados, pueden regenerarse de forma segura.`;
    result.warnings.push({ type:'fixture_cross_country', severity:'medium', title:'Calendario con partidos cruzados', detail, samples:fixtureIssues.slice(0,8) });
    if(unplayedFixtureIssues.length && !playedFixtureIssues.length){
      result.repairables.push({ type:'rebuild_cross_country_fixtures', title:'Regenerar calendario no jugado para quitar partidos cruzados', count:unplayedFixtureIssues.length, items:unplayedFixtureIssues });
    }
  }
  const botStatsIssues = botMatchStatsIntegrityIssues();
  result.stats.botMatchesWithMissingStats = botStatsIssues.length;
  if(botStatsIssues.length){
    result.ok = false;
    result.warnings.push({ type:'bot_match_min_stats_missing', severity:'medium', title:'Partidos bot sin estadísticas mínimas', detail:`Hay ${botStatsIssues.length} partido(s) bot jugados sin datos mínimos de goleadores, asistentes, tarjetas, lesiones, tapadas o errores. Se pueden completar copiando el historial válido o agregando datos conservadores sin alterar marcador ni tabla.`, samples:botStatsIssues.slice(0,8) });
    result.repairables.push({ type:'bot_match_min_stats_missing', title:'Completar estadísticas mínimas faltantes en partidos bot ya jugados', count:botStatsIssues.length, items:botStatsIssues });
  }
  const freeCap = Number(typeof MARKET_FREE_AGENT_HARD_MAX !== 'undefined' ? MARKET_FREE_AGENT_HARD_MAX : 300);
  if(result.stats.freeAgents > freeCap){
    result.ok = false;
    result.warnings.push({ type:'free_agents_over_cap', severity:'low', title:'Mercado libre excedido', detail:`Hay ${result.stats.freeAgents} libres y el máximo configurado es ${freeCap}. La limpieza automática de mercado debería recortarlo en carga/temporada.` });
  }
  const divisionCounts = divisionCountIntegrityRows();
  result.stats.divisionCounts = divisionCounts;
  const countMismatches = divisionCounts.filter(item => Number(item.count || 0) !== Number(item.expected || 0));
  if(countMismatches.length){
    result.ok = false;
    const repairPlan = buildDivisionCountRepairPlan();
    result.warnings.push({ type:'division_team_count_mismatch', severity:'medium', title:'Ligas con cantidad incorrecta de clubes', detail:`Hay ${countMismatches.length} división(es) que no tienen su cantidad esperada de clubes.`, samples:countMismatches.slice(0,8) });
    if(repairPlan.length){
      result.repairables.push({ type:'division_team_count_mismatch', title:'Completar ligas moviendo clubes de exceso a su división correspondiente', count:repairPlan.length, items:repairPlan });
    }else if(baseClubDivisionIntegrityMap()){
      result.repairables.push({ type:'restore_native_division_structure', title:'Restaurar estructura base de divisiones para completar ligas', count:countMismatches.length, items:countMismatches });
    }
  }
  result.canRepair = result.repairables.some(item => Number(item.count || 0) > 0);
  return result;
}
function integritySeverityLabel(severity){
  if(severity === 'high') return 'grave';
  if(severity === 'medium') return 'medio';
  return 'leve';
}
function integrityIssueMarkup(item){
  const samples = Array.isArray(item.samples) && item.samples.length
    ? `<details class="integrity-samples"><summary>Ver ejemplos</summary><pre>${escapeHtml(JSON.stringify(item.samples, null, 2))}</pre></details>`
    : '';
  return `<li class="integrity-item integrity-${escapeHtml(item.severity || 'low')}"><strong>${escapeHtml(item.title || 'Aviso')}</strong><span>${escapeHtml(integritySeverityLabel(item.severity || 'low'))}</span><p>${escapeHtml(item.detail || '')}</p>${samples}</li>`;
}
function showGameIntegrityModal(result=inspectGameIntegrity(), repaired=false){
  const issueItems = (result.issues || []).map(integrityIssueMarkup).join('');
  const warningItems = (result.warnings || []).map(integrityIssueMarkup).join('');
  const divisionRows = (result.stats?.divisionCounts || []).map(item => { const bad = Number(item.count || 0) !== Number(item.expected || item.count || 0); return `<tr class="${bad ? 'integrity-row-warn' : ''}"><td>${escapeHtml(item.country || '—')}</td><td>${escapeHtml(item.name || item.id)}</td><td>${Number(item.count || 0)} / ${Number(item.expected || item.count || 0)}</td></tr>`; }).join('');
  const repairRows = (result.repairables || []).filter(item => Number(item.count || 0) > 0).map(item => `<li><strong>${escapeHtml(item.title)}</strong><span>${Number(item.count || 0)} caso(s)</span></li>`).join('');
  const stateLabel = result.ok ? 'Todo correcto' : (result.canRepair ? 'Hay reparaciones seguras disponibles' : 'Hay avisos para revisar');
  const body = `<div class="integrity-modal">
    <p class="eyebrow">Verificador de estructura</p>
    <h2>${escapeHtml(stateLabel)}</h2>
    <p class="muted">Este chequeo no reinicia la partida y no borra resultados. La reparación segura reasigna clubes que quedaron en una liga de otro país, completa divisiones con cupos incorrectos, regenera el mapa de divisiones guardado, puede reconstruir calendarios cruzados no jugados y completa estadísticas mínimas de partidos bot ya jugados sin alterar marcador ni tabla.</p>
    ${repaired ? '<div class="notice-inline good">Reparación segura aplicada y partida guardada.</div>' : ''}
    <div class="integrity-summary-grid">
      <div><span>Clubes</span><strong>${Number(result.stats?.clubs || 0)}</strong></div>
      <div><span>Divisiones</span><strong>${Number(result.stats?.divisions || 0)}</strong></div>
      <div><span>Jugadores</span><strong>${Number(result.stats?.players || 0)}</strong></div>
      <div><span>Libres</span><strong>${Number(result.stats?.freeAgents || 0)}</strong></div>
    </div>
    ${issueItems ? `<h3>Problemas detectados</h3><ul class="integrity-list">${issueItems}</ul>` : '<div class="notice-inline good">No se detectaron problemas graves de estructura.</div>'}
    ${warningItems ? `<h3>Advertencias</h3><ul class="integrity-list">${warningItems}</ul>` : ''}
    ${repairRows ? `<h3>Reparaciones seguras</h3><ul class="integrity-repair-list">${repairRows}</ul><div class="row message-actions"><button class="primary" data-apply-integrity-repair>Aplicar reparaciones seguras</button></div>` : ''}
    <h3>Clubes por división actual</h3>
    <div class="table-wrap compact-table"><table><thead><tr><th>País</th><th>División</th><th>Clubes / esperado</th></tr></thead><tbody>${divisionRows}</tbody></table></div>
  </div>`;
  if(typeof openModal === 'function'){
    openModal(body);
    document.querySelector('[data-apply-integrity-repair]')?.addEventListener('click', async () => {
      const next = await applySafeGameIntegrityRepairs();
      showGameIntegrityModal(next, true);
    });
  }else{
    showNotice(result.ok ? 'Verificación correcta.' : 'Verificación completada con avisos.', true);
  }
}
async function applySafeGameIntegrityRepairs(){
  const before = inspectGameIntegrity();
  const divisionsById = integrityDivisionById();
  let repaired = 0;
  let fixturesRebuilt = 0;
  let statsFixed = 0;
  const countryRepair = repairCrossCountryClubAssignments({ restoreNativeIfNeeded:false });
  repaired += Number(countryRepair.repaired || 0);

  let countPlan = buildDivisionCountRepairPlan();
  let guard = 0;
  while(countPlan.length && guard < 6){
    countPlan.forEach(item => {
      const club = (seed?.clubs || []).find(club => Number(club.id) === Number(item.clubId));
      const target = divisionsById[String(item.toDivisionId || '')];
      if(!club || !target) return;
      if(divisionCountryKey(target) !== clubCountryKeyForIntegrity(club)) return;
      if(setClubIntegrityDivision(club, target)) repaired += 1;
    });
    const nextPlan = buildDivisionCountRepairPlan();
    if(!nextPlan.length || nextPlan.length === countPlan.length) break;
    countPlan = nextPlan;
    guard += 1;
  }

  const remainingMismatch = divisionCountIntegrityRows().some(item => Number(item.count || 0) !== Number(item.expected || 0));
  if(remainingMismatch && baseClubDivisionIntegrityMap()){
    (seed?.clubs || []).forEach(club => {
      if(isSpecialCompetitionOnlyClub(club)) return;
      const native = baseClubDivisionEntry(club);
      const target = native?.divisionId ? divisionsById[String(native.divisionId || '')] : null;
      if(!target || divisionCountryKey(target) !== clubCountryKeyForIntegrity(club)) return;
      if(setClubIntegrityDivision(club, target)) repaired += 1;
    });
  }

  const fixtureRepair = rebuildSafeSeasonFixturesAfterStructureRepair();
  if(fixtureRepair.rebuilt) fixturesRebuilt = Number(fixtureRepair.fixed || 0);

  if(typeof runDailyMatchStatsIntegrityRepair === 'function'){
    const statsRepair = runDailyMatchStatsIntegrityRepair({ reason:'manual_integrity_repair', force:true, silent:true });
    statsFixed = Number(statsRepair.fixed || 0);
  }

  if(game){
    game.clubDivisionOverrides = snapshotClubDivisionOverrides();
    const selectedClub = seed.clubs.find(club => Number(club.id) === Number(game.selectedClubId));
    if(selectedClub) game.selectedLeagueId = selectedClub.divisionId || game.selectedLeagueId;
  }
  if((repaired > 0 || fixturesRebuilt > 0) && typeof saveLocal === 'function'){
    await saveLocal(true);
  }
  if((repaired > 0 || fixturesRebuilt > 0) && typeof renderAll === 'function') renderAll();
  const after = inspectGameIntegrity();
  after.repairedCount = repaired;
  after.fixturesRebuiltCount = fixturesRebuilt;
  after.botStatsRepairedCount = statsFixed;
  after.previousIssues = before.issues || [];
  if(repaired > 0 || fixturesRebuilt > 0 || statsFixed > 0){
    const parts = [];
    if(repaired > 0) parts.push(`${repaired} movimiento(s) de estructura`);
    if(fixturesRebuilt > 0) parts.push(`${fixturesRebuilt} partido(s) de calendario regenerados`);
    if(statsFixed > 0) parts.push(`${statsFixed} partido(s) con estadísticas completadas`);
    showNotice(`Verificación: ${parts.join(' y ')} aplicados.`, false);
  }else{
    showNotice('Verificación completada. No había reparaciones seguras para aplicar.', false);
  }
  return after;
}


function recoveryClonePlain(value){
  try{ return JSON.parse(JSON.stringify(value ?? null)); }
  catch(_){ return null; }
}
function protectedManagerProgressSnapshot(){
  const stats = normalizeManagerStats(game?.managerStats || createInitialManagerStats());
  const special = typeof ensureSpecialState === 'function' ? ensureSpecialState() : (game?.special || null);
  return {
    managerStats: recoveryClonePlain(stats),
    special: recoveryClonePlain(special),
    prestige: typeof currentManagerPrestige === 'function' ? currentManagerPrestige() : Number(stats.prestige || 0),
    experience: Math.max(0, Math.round(Number(stats.experience || 0))),
    skillPoints: Math.max(0, Math.round(Number(special?.puntos_habilidad || 0))),
    saveCode:String(game?.saveCode || ''),
    rankingManagerName:String(game?.rankingManagerName || storedManagerName() || '')
  };
}
function restoreProtectedManagerProgress(snapshot){
  if(!game || !snapshot) return;
  const season = Math.max(1, Math.round(Number(game.seasonNumber || 1)));
  const clubId = Number(game.selectedClubId || 0);
  const stats = normalizeManagerStats(snapshot.managerStats || game.managerStats || createInitialManagerStats());
  stats.currentSeason = emptyManagerSeasonStats(season, clubId);
  stats.experience = Math.max(Math.round(Number(stats.experience || 0)), Math.round(Number(snapshot.experience || 0)));
  game.managerStats = ensureManagerCurrentSeasonStats(stats, season, clubId);
  game.managerStats = normalizeManagerStats(game.managerStats);
  if(snapshot.rankingManagerName) game.rankingManagerName = snapshot.rankingManagerName;
  if(snapshot.saveCode && !game.saveCode) game.saveCode = snapshot.saveCode;
  if(snapshot.special){
    game.special = recoveryClonePlain(snapshot.special) || snapshot.special;
    if(game.special && typeof game.special === 'object'){
      game.special.manager_id = String(game.saveCode || snapshot.saveCode || game.special.manager_id || '');
      game.special.nombre_manager = String(game.rankingManagerName || snapshot.rankingManagerName || game.special.nombre_manager || storedManagerName() || 'Manager');
    }
    if(typeof normalizeSpecialState === 'function') game.special = normalizeSpecialState(game.special, game.rankingManagerName || storedManagerName() || 'Manager');
    if(game.special && typeof game.special === 'object'){
      game.special.puntos_habilidad = Math.max(Math.round(Number(game.special.puntos_habilidad || 0)), Math.round(Number(snapshot.skillPoints || 0)));
    }
  }
}
function forceStartNewSeasonRecovery(){
  if(!game){ showNotice('No hay partida activa para desbloquear.'); return; }
  const clubId = Number(game.selectedClubId || 0);
  if(!clubId || !seed?.clubs?.some(club => Number(club.id) === clubId)){
    showNotice('No se encontró un club válido para continuar la partida.');
    return;
  }
  const snapshot = protectedManagerProgressSnapshot();
  const previousSeason = Math.max(1, Math.round(Number(game.seasonNumber || 1)));
  game.gameOver = null;
  game.mustReviewTactics = false;
  game.advanceLockedUntil = 0;
  game.advanceLockDurationMs = ADVANCE_LOCK_MS;
  game.seasonFinalized = true;
  game.seasonPhase = 'finalized';
  game.seasonEndModalShown = true;
  game.seasonTransition = {
    season:previousSeason,
    forcedRecovery:true,
    userRecord:null,
    movements:[],
    salariesPaid:0,
    salaryAdjustments:null,
    retirements:[],
    trainingDecay:null,
    prestigeChanges:[],
    agingApplied:false
  };
  startNextSeason(clubId);
  restoreProtectedManagerProgress(snapshot);
  pushGameMessage({
    type:'sistema',
    priority:'high',
    title:'Partida desbloqueada',
    body:`Se forzó el inicio de la temporada ${game.seasonNumber || previousSeason + 1} con ${clubName(game.selectedClubId)}. Se conservaron prestigio, experiencia, puntos de habilidad y progreso de manager.`,
    id:`force-new-season-${previousSeason}-${game.selectedClubId}-${Date.now()}`
  });
  activeTab = 'home';
  saveLocal(true);
  renderAll();
  showNotice(`Partida desbloqueada. Temporada ${game.seasonNumber || previousSeason + 1} iniciada sin borrar el progreso del manager.`, true);
}
function openForceNewSeasonModal(){
  if(!game){ showNotice('No hay partida activa para desbloquear.'); return; }
  const snapshot = protectedManagerProgressSnapshot();
  const prestigeLabel = typeof formatManagerPrestige === 'function' ? formatManagerPrestige(snapshot.prestige) : String(snapshot.prestige);
  const body = `<div class="force-season-modal">
    <p class="label">Recuperación de partida</p>
    <h2>Desbloquear y empezar temporada nueva</h2>
    <p class="muted">Usá esta opción sólo si la partida quedó bloqueada o necesitás saltar el cierre de temporada. No borra la carrera ni crea una partida nueva.</p>
    <div class="card blocker"><strong>Progreso protegido</strong><p class="muted small">Antes de avanzar se guarda una copia de seguridad interna de manager, prestigio, experiencia, puntos de habilidad y cartas especiales.</p></div>
    <div class="protected-grid">
      <div><span>Club actual</span><strong>${escapeHtml(clubName(game.selectedClubId))}</strong></div>
      <div><span>Temporada actual</span><strong>${game.seasonNumber || 1}</strong></div>
      <div><span>Prestigio manager</span><strong>${escapeHtml(prestigeLabel)}</strong></div>
      <div><span>Experiencia</span><strong>${formatPlainNumber(snapshot.experience)}</strong></div>
      <div><span>Puntos habilidad</span><strong>${formatPlainNumber(snapshot.skillPoints)}</strong></div>
    </div>
    <p class="small muted">No se otorgan títulos, premios ni penalizaciones de la temporada saltada. Es una herramienta de reparación.</p>
    <div class="row message-actions" style="margin-top:14px"><button id="btnConfirmForceNewSeason" class="primary">Desbloquear ahora</button><button class="ghost" onclick="closeModal()">Cancelar</button></div>
  </div>`;
  openModal(body);
  $('btnConfirmForceNewSeason')?.addEventListener('click', forceStartNewSeasonRecovery);
}

function confirmResetLocal(){
  const ok = window.confirm('Vas a borrar la partida local guardada en este navegador. Esta acción no se puede deshacer.');
  if(ok) resetLocal();
}
function bindEvents(){
  $('btnOpenNewGame')?.addEventListener('click', () => { if(typeof goToSaveSlotsMenu === 'function') goToSaveSlotsMenu({ saveCurrent:true, reloadSeed:true, notice:'Menú de slots.' }); else openNewGameModal(); });
  $('btnNewGame')?.addEventListener('click', ()=> newGame(Number($('clubSelect')?.value || 0), { managerName:storedManagerName() }));
  $('btnManagerCourses')?.addEventListener('click', () => { if(typeof openManagerCoursesModal === 'function') openManagerCoursesModal(); });
  $('btnHelp')?.addEventListener('click', () => { if(typeof openGameHelpModal === 'function') openGameHelpModal(); });
  $('btnAssistantMessagesToggle')?.addEventListener('click', () => {
    if(!game) return;
    game.assistantMessagesEnabled = game.assistantMessagesEnabled === false;
    saveLocal(true);
    if(typeof updateAssistantMessagesToggle === 'function') updateAssistantMessagesToggle();
    showNotice(game.assistantMessagesEnabled === false ? 'Mensajes del ayudante desactivados.' : 'Mensajes del ayudante activados.');
  });
  $('btnSave').addEventListener('click', saveLocal);
  $('btnLoad').addEventListener('click', () => { if(typeof goToSaveSlotsMenu === 'function') goToSaveSlotsMenu({ saveCurrent:true, reloadSeed:true, notice:'Menú de slots.' }); else loadLocal(false); });
  $('topResignClubBtn')?.addEventListener('click', resignCurrentClub);
  $('btnVerifyIntegrity')?.addEventListener('click', () => showGameIntegrityModal(inspectGameIntegrity(), false));
  $('btnForceNewSeason')?.addEventListener('click', openForceNewSeasonModal);
  $('btnReset')?.addEventListener('click', confirmResetLocal);
  document.querySelectorAll('.tabs button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const targetTab = btn.dataset.tab;
      if(typeof isManagerWithoutClubBlockedTab === 'function' && isManagerWithoutClubBlockedTab(targetTab)){
        activeTab = 'home';
        if(typeof managerWithoutClubBlockedNotice === 'function') showNotice(managerWithoutClubBlockedNotice(targetTab));
        renderAll();
        return;
      }
      activeTab = targetTab;
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
    if(close || event.target.classList.contains('modal-backdrop')){
      if(typeof completedChallengeResultModalActive === 'function' && completedChallengeResultModalActive()) closeCompletedChallengeResultScreen();
      else closeModal();
    }
  });
  document.addEventListener('keydown', (event)=>{
    if(event.key !== 'Escape') return;
    if(typeof completedChallengeResultModalActive === 'function' && completedChallengeResultModalActive()) closeCompletedChallengeResultScreen();
    else closeModal();
  });
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

function normalizeSectorStyleValue(value){
  const clean = String(value || '').trim();
  const aliases = { presion:'presion_alta', presionAlta:'presion_alta', presion_alta:'presion_alta', rotacion:'rotacion', rotación:'rotacion', posicional:'posicional', repliegue:'repliegue' };
  const normalized = aliases[clean] || clean;
  const valid = new Set((typeof TACTIC_SECTOR_STYLE_OPTIONS !== 'undefined' ? TACTIC_SECTOR_STYLE_OPTIONS : []).map(opt => opt.value));
  return valid.has(normalized) ? normalized : 'posicional';
}
function normalizeSectorStyles(styles){
  const base = typeof DEFAULT_TACTIC_SECTOR_STYLES !== 'undefined' ? DEFAULT_TACTIC_SECTOR_STYLES : { defense:'posicional', midfield:'posicional', attack:'posicional' };
  const src = styles && typeof styles === 'object' && !Array.isArray(styles) ? styles : {};
  return {
    defense: normalizeSectorStyleValue(src.defense || src.defensa || base.defense),
    midfield: normalizeSectorStyleValue(src.midfield || src.medios || src.medio || base.midfield),
    attack: normalizeSectorStyleValue(src.attack || src.delanteros || src.delantera || base.attack)
  };
}
function normalizeSavedTacticsState(src){
  const maxSlots = Number.isFinite(Number(typeof TACTIC_SAVE_SLOT_COUNT !== 'undefined' ? TACTIC_SAVE_SLOT_COUNT : 3)) ? Number(TACTIC_SAVE_SLOT_COUNT) : 3;
  const rawSlots = src && typeof src === 'object' && !Array.isArray(src) ? (src.slots || src) : {};
  const slots = {};
  for(let i=1; i<=maxSlots; i++){
    const raw = rawSlots[i] || rawSlots[String(i)] || null;
    if(!raw || typeof raw !== 'object') continue;
    const starters = Array.isArray(raw.starters) ? raw.starters.slice(0,11).map(id => Number(id) || 0) : [];
    while(starters.length < 11) starters.push(0);
    const bench = Array.isArray(raw.bench) ? raw.bench.slice(0,10).map(id => Number(id) || 0).filter(Boolean) : [];
    const playerMentalities = (raw.playerMentalities && typeof raw.playerMentalities === 'object' && !Array.isArray(raw.playerMentalities)) ? raw.playerMentalities : {};
    const cleanMentalities = {};
    Object.entries(playerMentalities).forEach(([id, mode]) => {
      const cleanId = Number(id || 0);
      if(cleanId) cleanMentalities[cleanId] = normalizeMentality(mode);
    });
    slots[i] = {
      slot:i,
      name:String(raw.name || `Táctica ${i}`),
      savedAt:String(raw.savedAt || ''),
      clubId:Number(raw.clubId || 0),
      clubName:String(raw.clubName || ''),
      formation:FORMATIONS[raw.formation] ? raw.formation : DEFAULT_TACTIC.formation,
      captainId:starters.includes(Number(raw.captainId || 0)) ? Number(raw.captainId || 0) : Number(bestCaptainForStarterIds(starters)?.id || 0),
      starters,
      bench,
      autoSubs:Array.isArray(raw.autoSubs) ? raw.autoSubs.slice(0,5).map(rule => ({ outId:Number(rule?.outId || 0), inId:Number(rule?.inId || 0), trigger:String(rule?.trigger || 'tired') })) : [],
      playerMentalities:cleanMentalities,
      matchInstructions: window.Simulator20?.normalizeMatchInstructions ? window.Simulator20.normalizeMatchInstructions(raw.matchInstructions) : (raw.matchInstructions || DEFAULT_TACTIC.matchInstructions),
      sectorStyles: normalizeSectorStyles(raw.sectorStyles)
    };
  }
  return { slots };
}
function savedTacticSlot(slot){
  game.savedTactics = normalizeSavedTacticsState(game?.savedTactics || {});
  return game.savedTactics.slots?.[Number(slot || 0)] || null;
}
function tacticSlotStatus(slot){
  const saved = savedTacticSlot(slot);
  if(!saved) return { exists:false, label:'Vacía', details:'Sin táctica guardada.' };
  const validStarters = (saved.starters || []).filter(Boolean).length;
  const clubText = saved.clubName ? ` · ${saved.clubName}` : '';
  const captain = playerById(saved.captainId);
  const captainText = captain ? ` · Capitán ${playerLastName(captain.name)}` : '';
  return { exists:true, label:`${saved.formation}${clubText}`, details:`${validStarters}/11 titulares guardados${captainText}` };
}
function snapshotCurrentTacticForSlot(slot){
  const current = applyStarterMentalities(normalizeTactic(game.selectedClubId, game.tactic || DEFAULT_TACTIC));
  const starters = current.starters.slice(0,11).map(id => Number(id) || 0);
  while(starters.length < 11) starters.push(0);
  const bench = (current.bench || []).slice(0,10).map(id => Number(id) || 0).filter(Boolean);
  const mentalities = {};
  starters.filter(Boolean).forEach(id => { mentalities[id] = playerMentality(id, current); });
  return {
    slot:Number(slot || 0),
    name:`Táctica ${Number(slot || 0)}`,
    savedAt:new Date().toISOString(),
    clubId:Number(game.selectedClubId || 0),
    clubName:clubName(game.selectedClubId),
    formation:current.formation || DEFAULT_TACTIC.formation,
    captainId:normalizedCaptainIdForTactic(game.selectedClubId, current),
    starters,
    bench,
    autoSubs:(current.autoSubs || []).slice(0,5).map(rule => ({ outId:Number(rule.outId || 0), inId:Number(rule.inId || 0), trigger:String(rule.trigger || 'tired') })),
    playerMentalities:mentalities,
    matchInstructions:current.matchInstructions || DEFAULT_TACTIC.matchInstructions,
    sectorStyles:normalizeSectorStyles(current.sectorStyles)
  };
}
function saveCurrentTacticSlot(slot){
  if(!game) return false;
  const cleanSlot = Math.max(1, Math.min(Number(typeof TACTIC_SAVE_SLOT_COUNT !== 'undefined' ? TACTIC_SAVE_SLOT_COUNT : 3), Math.round(Number(slot || 1))));
  game.savedTactics = normalizeSavedTacticsState(game.savedTactics || {});
  game.savedTactics.slots[cleanSlot] = snapshotCurrentTacticForSlot(cleanSlot);
  saveLocal(true);
  showNotice(`Táctica ${cleanSlot} guardada.`);
  if(typeof renderTactics === 'function') renderTactics();
  return true;
}
function sanitizeSavedTacticForCurrentClub(saved){
  const squad = playersByClub(game.selectedClubId);
  const squadIds = new Set(squad.map(p => Number(p.id)));
  const starters = (saved.starters || []).slice(0,11).map(id => {
    const cleanId = Number(id || 0);
    if(!cleanId || !squadIds.has(cleanId) || isUnavailable(cleanId)) return 0;
    return cleanId;
  });
  while(starters.length < 11) starters.push(0);
  const taken = new Set(starters.filter(Boolean));
  const bench = (saved.bench || []).map(Number).filter(id => id && squadIds.has(id) && !taken.has(id) && canBeBench(id)).slice(0,10);
  const mentalities = {};
  starters.filter(Boolean).forEach(id => {
    mentalities[id] = normalizeMentality(saved.playerMentalities?.[id] || saved.playerMentalities?.[String(id)] || 'normal');
  });
  const autoSubs = (saved.autoSubs || []).slice(0,5).map(rule => ({
    outId: starters.includes(Number(rule.outId || 0)) ? Number(rule.outId || 0) : 0,
    inId: bench.includes(Number(rule.inId || 0)) ? Number(rule.inId || 0) : 0,
    trigger: SUB_TRIGGERS.some(t => t.value === rule.trigger) ? rule.trigger : 'tired'
  }));
  while(autoSubs.length < 5) autoSubs.push({ outId:0, inId:0, trigger:'tired' });
  if(game){
    const store = ensurePlayerMentalitiesStore(game);
    Object.entries(mentalities).forEach(([id, mode]) => { store[Number(id)] = normalizeMentality(mode); });
  }
  return applyStarterMentalities({
    ...DEFAULT_TACTIC,
    formation:FORMATIONS[saved.formation] ? saved.formation : DEFAULT_TACTIC.formation,
    captainId:starters.includes(Number(saved.captainId || 0)) ? Number(saved.captainId || 0) : Number(bestCaptainForStarterIds(starters)?.id || 0),
    starters,
    bench,
    autoSubs,
    playerMentalities:{ ...(game.playerMentalities || {}), ...mentalities },
    matchInstructions:window.Simulator20?.normalizeMatchInstructions ? window.Simulator20.normalizeMatchInstructions(saved.matchInstructions) : (saved.matchInstructions || DEFAULT_TACTIC.matchInstructions),
    sectorStyles:normalizeSectorStyles(saved.sectorStyles)
  });
}
function loadSavedTacticSlot(slot){
  if(!game) return false;
  const saved = savedTacticSlot(slot);
  if(!saved){ showNotice(`No hay táctica guardada en el espacio ${slot}.`); return false; }
  const clean = sanitizeSavedTacticForCurrentClub(saved);
  const missing = clean.starters.filter(id => !id).length;
  game.tactic = clean;
  game.playerMentalities = { ...(game.playerMentalities || {}), ...(clean.playerMentalities || {}) };
  saveLocal(true);
  showNotice(missing ? `Táctica ${slot} cargada con ${missing} hueco(s) por jugadores lesionados o fuera del club.` : `Táctica ${slot} cargada.`);
  if(typeof renderTactics === 'function') renderTactics();
  return true;
}


function maxTrainingSaveSlots(){
  const raw = Number(typeof TRAINING_SAVE_SLOT_COUNT !== 'undefined' ? TRAINING_SAVE_SLOT_COUNT : 3);
  return Number.isFinite(raw) && raw > 0 ? Math.min(6, Math.round(raw)) : 3;
}
function safeTrainingTypeForSavedPlan(value){
  try{
    return typeof safeTrainingType === 'function' ? safeTrainingType(value) : (value || 'regenerative');
  }catch(_err){
    return 'regenerative';
  }
}
function safeIndividualTrainingTypeForSavedPlan(value){
  try{
    return typeof safeIndividualTrainingType === 'function' ? safeIndividualTrainingType(value) : (value || 'balanced');
  }catch(_err){
    return 'balanced';
  }
}
function normalizeTrainingScheduleForSavedPlan(schedule){
  try{
    if(typeof normalizeTrainingSchedule === 'function') return normalizeTrainingSchedule(schedule);
  }catch(_err){}
  const labels = Array.isArray(typeof TRAINING_DAY_LABELS !== 'undefined' ? TRAINING_DAY_LABELS : null) ? TRAINING_DAY_LABELS : ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const slots = Array.isArray(typeof TRAINING_DAY_SLOTS !== 'undefined' ? TRAINING_DAY_SLOTS : null) ? TRAINING_DAY_SLOTS : [{key:'morning'},{key:'midday'},{key:'afternoon'},{key:'evening'}];
  const normalized = {};
  labels.forEach((_, dayIndex) => {
    const sourceDay = schedule?.[dayIndex] || schedule?.[String(dayIndex)] || {};
    normalized[dayIndex] = {};
    slots.forEach(slot => { normalized[dayIndex][slot.key] = safeTrainingTypeForSavedPlan(sourceDay?.[slot.key]); });
  });
  return normalized;
}
function normalizeSavedTrainingPlansState(src){
  const maxSlots = maxTrainingSaveSlots();
  const source = src && typeof src === 'object' && !Array.isArray(src) ? src : {};
  const rawSlots = source.slots && typeof source.slots === 'object' && !Array.isArray(source.slots) ? source.slots : source;
  const slots = {};
  for(let i=1; i<=maxSlots; i++){
    try{
      const raw = rawSlots[i] || rawSlots[String(i)] || null;
      if(!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
      const rawPlan = (raw.trainingPlan && typeof raw.trainingPlan === 'object' && !Array.isArray(raw.trainingPlan)) ? raw.trainingPlan : {};
      const plan = {};
      Object.entries(rawPlan).forEach(([id, value]) => {
        const cleanId = Number(id || 0);
        if(cleanId) plan[cleanId] = safeIndividualTrainingTypeForSavedPlan(value);
      });
      slots[i] = {
        slot:i,
        name:String(raw.name || `Entrenamiento ${i}`).trim().slice(0,40) || `Entrenamiento ${i}`,
        savedAt:String(raw.savedAt || ''),
        clubId:Number(raw.clubId || 0),
        clubName:String(raw.clubName || ''),
        trainingSchedule:normalizeTrainingScheduleForSavedPlan(raw.trainingSchedule),
        trainingPlan:plan
      };
    }catch(err){
      console.warn('Plan de entrenamiento guardado omitido por datos inválidos', i, err);
    }
  }
  return { slots };
}
function resetSavedTrainingPlans(){
  if(!game) return false;
  game.savedTrainingPlans = normalizeSavedTrainingPlansState({});
  saveLocal(true).catch?.(()=>{});
  showNotice('Entrenamientos guardados reiniciados.');
  if(typeof renderTraining === 'function') renderTraining();
  return true;
}
function savedTrainingPlanSlot(slot){
  if(!game) return null;
  game.savedTrainingPlans = normalizeSavedTrainingPlansState(game.savedTrainingPlans || {});
  return game.savedTrainingPlans.slots?.[Number(slot || 0)] || null;
}
function trainingPlanSlotStatus(slot){
  try{
    const saved = savedTrainingPlanSlot(slot);
    if(!saved) return { exists:false, label:'Vacío', details:'Sin plan semanal guardado.' };
    const schedule = normalizeTrainingScheduleForSavedPlan(saved.trainingSchedule);
    const counts = {};
    Object.values(schedule || {}).forEach(day => Object.values(day || {}).forEach(value => { const key = safeTrainingTypeForSavedPlan(value); counts[key] = Number(counts[key] || 0) + 1; }));
    const summary = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([key,count]) => {
      const label = (typeof trainingOptionByValue === 'function' ? trainingOptionByValue(key)?.label : null) || key;
      return `${label}: ${count}`;
    }).join(' · ');
    const individualCount = Object.keys(saved.trainingPlan || {}).length;
    return { exists:true, label:saved.name || `Entrenamiento ${slot}`, details:`${summary || 'Plan semanal'} · ${individualCount} individuales` };
  }catch(err){
    console.warn('No se pudo leer el espacio de entrenamiento', slot, err);
    return { exists:false, label:'Error de lectura', details:'Espacio inválido. Reiniciá los entrenamientos guardados.' };
  }
}
function snapshotCurrentTrainingPlanForSlot(slot, name){
  const schedule = normalizeTrainingScheduleForSavedPlan(game.trainingSchedule);
  const squadIds = new Set(playersByClub(game.selectedClubId).map(p => Number(p.id)));
  const plan = {};
  Object.entries(game.trainingPlan || {}).forEach(([id, value]) => {
    const cleanId = Number(id || 0);
    if(cleanId && squadIds.has(cleanId)) plan[cleanId] = safeIndividualTrainingTypeForSavedPlan(value);
  });
  return {
    slot:Number(slot || 0),
    name:String(name || `Entrenamiento ${Number(slot || 0)}`).trim().slice(0,40) || `Entrenamiento ${Number(slot || 0)}`,
    savedAt:new Date().toISOString(),
    clubId:Number(game.selectedClubId || 0),
    clubName:clubName(game.selectedClubId),
    trainingSchedule:schedule,
    trainingPlan:plan
  };
}
function saveCurrentTrainingPlanSlot(slot){
  if(!game) return false;
  try{
    const cleanSlot = Math.max(1, Math.min(maxTrainingSaveSlots(), Math.round(Number(slot || 1))));
    const previous = savedTrainingPlanSlot(cleanSlot);
    const suggested = previous?.name || `Entrenamiento ${cleanSlot}`;
    const name = window.prompt ? window.prompt('Nombre del plan de entrenamiento:', suggested) : suggested;
    if(name === null) return false;
    const cleanName = String(name || suggested).trim().slice(0,40) || suggested;
    game.savedTrainingPlans = normalizeSavedTrainingPlansState(game.savedTrainingPlans || {});
    game.savedTrainingPlans.slots[cleanSlot] = snapshotCurrentTrainingPlanForSlot(cleanSlot, cleanName);
    saveLocal(true).catch(err => console.warn('No se pudo guardar el plan de entrenamiento en disco', err));
    showNotice(`${cleanName} guardado.`);
    if(typeof renderTraining === 'function') renderTraining();
    return true;
  }catch(err){
    console.error('Error guardando entrenamiento', err);
    showNotice('No se pudo guardar el entrenamiento. Se conservará la partida.');
    return false;
  }
}
function loadSavedTrainingPlanSlot(slot){
  if(!game) return false;
  try{
    const saved = savedTrainingPlanSlot(slot);
    if(!saved){ showNotice(`No hay plan guardado en el espacio ${slot}.`); return false; }
    game.trainingSchedule = normalizeTrainingScheduleForSavedPlan(saved.trainingSchedule);
    game.trainingPlan = typeof normalizeIndividualTrainingPlan === 'function' ? normalizeIndividualTrainingPlan(game.trainingPlan || {}) : (game.trainingPlan || {});
    const squadIds = new Set(playersByClub(game.selectedClubId).map(p => Number(p.id)));
    let applied = 0;
    Object.entries(saved.trainingPlan || {}).forEach(([id, value]) => {
      const cleanId = Number(id || 0);
      if(cleanId && squadIds.has(cleanId)){
        game.trainingPlan[cleanId] = safeIndividualTrainingTypeForSavedPlan(value);
        applied += 1;
      }
    });
    saveLocal(true).catch(err => console.warn('No se pudo guardar la carga del plan de entrenamiento', err));
    showNotice(`${saved.name || `Entrenamiento ${slot}`} cargado. Individuales aplicados: ${applied}.`);
    if(typeof renderTraining === 'function') renderTraining();
    return true;
  }catch(err){
    console.error('Error cargando entrenamiento', err);
    showNotice('No se pudo cargar ese entrenamiento. Probá reiniciar los entrenamientos guardados.');
    return false;
  }
}
function normalizeStandingsHistoryState(src){
  const obj = (src && typeof src === 'object' && !Array.isArray(src)) ? src : {};
  const seasons = Array.isArray(obj.seasons) ? obj.seasons : [];
  const clean = seasons.map(item => {
    const divisions = {};
    Object.entries(item?.divisions || {}).forEach(([divisionId, rows]) => {
      if(!Array.isArray(rows)) return;
      divisions[divisionId] = rows.map(row => ({
        clubId:Number(row.clubId || 0),
        pj:Number(row.pj || 0), pg:Number(row.pg || 0), pe:Number(row.pe || 0), pp:Number(row.pp || 0),
        gf:Number(row.gf || 0), gc:Number(row.gc || 0), dg:Number(row.dg || 0), pts:Number(row.pts || 0),
        position:Number(row.position || 0)
      })).filter(row => row.clubId);
    });
    return { season:Number(item?.season || 0), year:Number(item?.year || 0), createdAt:String(item?.createdAt || ''), divisions };
  }).filter(item => item.season && item.year && item.divisions && Object.keys(item.divisions).length);
  return { seasons:clean };
}

function normalizeCompetitionChampionsHistoryState(src){
  const obj = (src && typeof src === 'object' && !Array.isArray(src)) ? src : {};
  const entries = Array.isArray(obj.entries) ? obj.entries : (Array.isArray(obj.champions) ? obj.champions : []);
  const clean = [];
  const seen = new Set();
  entries.forEach(item => {
    const season = Math.max(1, Math.round(Number(item?.season || 0)) || 0);
    const year = Math.round(Number(item?.year || 0)) || (season ? seasonYearForNumber(season) : 0);
    const competitionId = String(item?.competitionId || item?.divisionId || item?.id || '').trim();
    const championId = Number(item?.championId || item?.clubId || 0);
    if(!season || !year || !competitionId || !championId) return;
    const key = `${season}-${competitionId}`;
    if(seen.has(key)) return;
    seen.add(key);
    clean.push({
      season,
      year,
      type:String(item?.type || 'league'),
      competitionId,
      competitionName:String(item?.competitionName || item?.divisionName || item?.name || competitionId),
      championId,
      championName:String(item?.championName || item?.clubName || clubName(championId)),
      runnerUpId:Number(item?.runnerUpId || 0),
      runnerUpName:item?.runnerUpName ? String(item.runnerUpName) : (item?.runnerUpId ? clubName(item.runnerUpId) : ''),
      thirdPlaceId:Number(item?.thirdPlaceId || 0),
      thirdPlaceName:item?.thirdPlaceName ? String(item.thirdPlaceName) : (item?.thirdPlaceId ? clubName(item.thirdPlaceId) : ''),
      createdAt:String(item?.createdAt || new Date().toISOString())
    });
  });
  clean.sort((a,b)=>(Number(b.year || 0)-Number(a.year || 0)) || (Number(b.season || 0)-Number(a.season || 0)) || String(a.competitionName || '').localeCompare(String(b.competitionName || '')));
  return { entries:clean };
}
function recordCompetitionChampion(entry){
  if(!game || !entry) return false;
  const season = Math.max(1, Math.round(Number(entry.season || game.seasonNumber || 1)) || 1);
  const year = Math.round(Number(entry.year || game.seasonYear || seasonYearForNumber(season))) || seasonYearForNumber(season);
  const competitionId = String(entry.competitionId || entry.divisionId || '').trim();
  const championId = Number(entry.championId || entry.clubId || 0);
  if(!competitionId || !championId) return false;
  game.competitionChampionsHistory = normalizeCompetitionChampionsHistoryState(game.competitionChampionsHistory || {});
  const clean = {
    season,
    year,
    type:String(entry.type || 'league'),
    competitionId,
    competitionName:String(entry.competitionName || entry.divisionName || competitionId),
    championId,
    championName:String(entry.championName || clubName(championId)),
    runnerUpId:Number(entry.runnerUpId || 0),
    runnerUpName:entry.runnerUpName ? String(entry.runnerUpName) : (entry.runnerUpId ? clubName(entry.runnerUpId) : ''),
    thirdPlaceId:Number(entry.thirdPlaceId || 0),
    thirdPlaceName:entry.thirdPlaceName ? String(entry.thirdPlaceName) : (entry.thirdPlaceId ? clubName(entry.thirdPlaceId) : ''),
    createdAt:String(entry.createdAt || new Date().toISOString())
  };
  const key = `${season}-${competitionId}`;
  const entries = (game.competitionChampionsHistory.entries || []).filter(item => `${Number(item.season || 0)}-${String(item.competitionId || '')}` !== key);
  entries.push(clean);
  game.competitionChampionsHistory = normalizeCompetitionChampionsHistoryState({ entries });
  return true;
}
function recordLeagueChampionsForCurrentSeason(){
  if(!game || !seed?.divisions?.length) return 0;
  let count = 0;
  const season = Number(game.seasonNumber || 1);
  const year = Number(game.seasonYear || seasonYearForNumber(season));
  (seed.divisions || []).forEach(division => {
    const rows = sortedStandings(division.id);
    const champion = rows && rows[0];
    if(!champion?.clubId) return;
    if(recordCompetitionChampion({
      season,
      year,
      type:'league',
      competitionId:division.id,
      competitionName:division.name,
      championId:Number(champion.clubId),
      championName:clubName(champion.clubId)
    })) count += 1;
  });
  return count;
}
function snapshotStandingsHistoryForCurrentSeason(){
  if(!game || !seed?.divisions?.length) return false;
  game.standingsHistory = normalizeStandingsHistoryState(game.standingsHistory || {});
  const season = Number(game.seasonNumber || 1);
  const year = Number(game.seasonYear || seasonYearForNumber(season));
  const divisions = {};
  (seed.divisions || []).forEach(division => {
    const rows = sortedStandings(division.id).map((row,index) => ({
      clubId:Number(row.clubId || 0),
      pj:Number(row.pj || 0), pg:Number(row.pg || 0), pe:Number(row.pe || 0), pp:Number(row.pp || 0),
      gf:Number(row.gf || 0), gc:Number(row.gc || 0), dg:Number(row.dg || 0), pts:Number(row.pts || 0),
      position:index + 1
    }));
    divisions[division.id] = rows;
  });
  const entry = { season, year, createdAt:new Date().toISOString(), divisions };
  game.standingsHistory.seasons = (game.standingsHistory.seasons || []).filter(item => !(Number(item.season) === season || Number(item.year) === year));
  game.standingsHistory.seasons.push(entry);
  game.standingsHistory.seasons.sort((a,b)=>Number(b.year || 0)-Number(a.year || 0));
  return true;
}

function deriveSeasonInitialBudgetFromHistory(saved, season){
  const history = Array.isArray(saved?.budgetHistory) ? saved.budgetHistory : [];
  const currentSeason = Number(season || saved?.seasonNumber || 1);
  const first = history.find(entry => Number(entry.season || currentSeason) === currentSeason && Number.isFinite(Number(entry.budget)));
  if(first){
    return Math.round(Number(first.budget || 0) - Number(first.delta || 0));
  }
  if(currentSeason === 1){
    const club = seed?.clubs?.find(c => Number(c.id) === Number(saved?.selectedClubId));
    if(club && Number.isFinite(Number(club.budget))) return Math.round(Number(club.budget));
  }
  return Math.round(Number(saved?.budget || 0));
}
function normalizeGame(saved){
  const normalized = {...saved};
  normalized.version = APP_VERSION;
  normalized.saveSlotId = typeof normalizeSaveSlotId === 'function' ? normalizeSaveSlotId(normalized.saveSlotId || currentSaveSlotId || SAVE_SLOT_CAREER) : (normalized.saveSlotId || 'career');
  normalized.seedSignature = normalized.seedSignature || seed?.meta?.signature || '';
  normalized.tactic = normalizeTactic(normalized.selectedClubId, normalized.tactic || DEFAULT_TACTIC);
  normalized.captaincyProgress = normalizeCaptaincyProgressState(normalized.captaincyProgress || {});
  normalized.captaincyAppliedMatches = (normalized.captaincyAppliedMatches && typeof normalized.captaincyAppliedMatches === 'object' && !Array.isArray(normalized.captaincyAppliedMatches)) ? normalized.captaincyAppliedMatches : {};
  normalized.lastCaptaincyEffect = normalized.lastCaptaincyEffect && typeof normalized.lastCaptaincyEffect === 'object' ? normalized.lastCaptaincyEffect : null;
  normalized.savedTactics = normalizeSavedTacticsState(normalized.savedTactics || {});
  normalized.savedTrainingPlans = normalizeSavedTrainingPlansState(normalized.savedTrainingPlans || {});
  normalized.standingsHistory = normalizeStandingsHistoryState(normalized.standingsHistory || {});
  normalized.competitionChampionsHistory = normalizeCompetitionChampionsHistoryState(normalized.competitionChampionsHistory || {});
  normalized.playerStatus = normalized.playerStatus || {};
  normalized.manualRetiredPlayerIds = Array.from(new Set((Array.isArray(normalized.manualRetiredPlayerIds) ? normalized.manualRetiredPlayerIds : (Array.isArray(normalized.retiredManualPlayerIds) ? normalized.retiredManualPlayerIds : [])).map(id => Number(id)).filter(id => Number.isFinite(id) && id > 0)));
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
  normalized.rankingLastManualUploadGameDate = validIsoDate(normalized.rankingLastManualUploadGameDate) ? normalized.rankingLastManualUploadGameDate : '';
  normalized.rankingLastAutomaticUploadGameDate = validIsoDate(normalized.rankingLastAutomaticUploadGameDate) ? normalized.rankingLastAutomaticUploadGameDate : '';
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
  normalized.seasonInitialBudget = Number.isFinite(Number(normalized.seasonInitialBudget)) ? Math.round(Number(normalized.seasonInitialBudget)) : Math.round(Number(normalized.seasonBudgetStartBySeason[normalized.seasonNumber] ?? deriveSeasonInitialBudgetFromHistory(normalized, normalized.seasonNumber)));
  const hadCareerInitialBudget = Number.isFinite(Number(normalized.careerInitialBudget));
  const orderedBudgetStarts = Object.entries(normalized.seasonBudgetStartBySeason).map(([season, value]) => ({ season:Number(season), value:Number(value) })).filter(item => Number.isFinite(item.season) && Number.isFinite(item.value)).sort((a,b)=>a.season-b.season);
  normalized.careerInitialBudget = hadCareerInitialBudget ? Math.round(Number(normalized.careerInitialBudget)) : Math.round(Number(orderedBudgetStarts[0]?.value ?? normalized.seasonInitialBudget ?? normalized.budget ?? 0));
  if(!hadCareerInitialBudget) normalized._needsAutosave = true;
  normalized.seasonFinalized = Boolean(normalized.seasonFinalized);
  normalized.seasonTransition = normalized.seasonTransition || null;
  normalized.argentinaPlayoffs = (normalized.argentinaPlayoffs && typeof normalized.argentinaPlayoffs === 'object' && !Array.isArray(normalized.argentinaPlayoffs)) ? normalized.argentinaPlayoffs : null;
  normalized.clubWorldCup = (normalized.clubWorldCup && typeof normalized.clubWorldCup === 'object' && !Array.isArray(normalized.clubWorldCup)) ? normalized.clubWorldCup : null;
  normalized.clubWorldCupHistory = normalizeClubWorldCupHistoryState(normalized.clubWorldCupHistory || {});
  if(normalized.clubWorldCup && typeof ensureClubWorldCupInvitedData === 'function') ensureClubWorldCupInvitedData();
  if(syncClubWorldCupHistoryForState(normalized)) normalized._needsAutosave = true;
  normalized.seasonPhase = normalized.seasonPhase || (normalized.seasonFinalized ? 'finalized' : 'regular');
  normalized.phaseTurn = Number.isFinite(normalized.phaseTurn) ? normalized.phaseTurn : 0;
  normalized.globalTurn = Number.isFinite(normalized.globalTurn) ? normalized.globalTurn : ((Math.max(1, normalized.seasonNumber || 1) - 1) * 53 + (normalized.matchdayIndex || 0));
  normalized.preseasonFriendliesPlayed = Number.isFinite(normalized.preseasonFriendliesPlayed) ? normalized.preseasonFriendliesPlayed : 0;
  normalized.pendingFriendlyOpponentId = Number.isFinite(normalized.pendingFriendlyOpponentId) ? normalized.pendingFriendlyOpponentId : 0;
  const rawDivisionOverrides = (normalized.clubDivisionOverrides && typeof normalized.clubDivisionOverrides === 'object' && !Array.isArray(normalized.clubDivisionOverrides)) ? normalized.clubDivisionOverrides : {};
  normalized.clubDivisionOverrides = sanitizeClubDivisionOverrides(rawDivisionOverrides);
  const removedSpecialOverrides = Object.keys(rawDivisionOverrides).length !== Object.keys(normalized.clubDivisionOverrides).length;
  const economySeasonKey = String(Math.max(1, Math.round(Number(normalized.seasonNumber || 1))));
  const hadLeagueEconomySnapshot = Boolean(normalized.leagueSeasonEconomy?.seasons?.[economySeasonKey]);
  if(typeof ensureLeagueSeasonEconomyForSeason === 'function') ensureLeagueSeasonEconomyForSeason(normalized, normalized.seasonNumber, { reason:'save_migration' });
  if(removedSpecialOverrides || !hadLeagueEconomySnapshot) normalized._needsAutosave = true;
  const previousTitleHistoryCount = Array.isArray(normalized.managerStats?.titleHistory) ? normalized.managerStats.titleHistory.length : 0;
  normalized.managerStats = ensureManagerCurrentSeasonStats(normalized.managerStats, normalized.seasonNumber, normalized.selectedClubId);
  const titlesRebuilt = syncManagerOfficialTitles(normalized);
  if(titlesRebuilt || Number(normalized.managerStats?.titleHistory?.length || 0) !== previousTitleHistoryCount) normalized._needsAutosave = true;
  normalized.managerSharedProfile = (normalized.managerSharedProfile && typeof normalized.managerSharedProfile === 'object' && !Array.isArray(normalized.managerSharedProfile)) ? {
    version:String(normalized.managerSharedProfile.version || 'V6.24'),
    experience:Math.max(0, Math.round(Number(normalized.managerSharedProfile.experience || 0))),
    careerHistory:Array.isArray(normalized.managerSharedProfile.careerHistory) ? normalized.managerSharedProfile.careerHistory : [],
    updatedAt:normalized.managerSharedProfile.updatedAt || null
  } : null;
  normalized.gameOver = normalizeGameOverState(normalized.gameOver);
  normalized.managerJobMarket = typeof normalizeManagerJobMarketState === 'function' ? normalizeManagerJobMarketState(normalized.managerJobMarket || {}) : (normalized.managerJobMarket || {});
  normalized.managerJobContract = (normalized.managerJobContract && typeof normalized.managerJobContract === 'object' && !Array.isArray(normalized.managerJobContract)) ? normalized.managerJobContract : null;
  normalized.founderMode = Boolean(normalized.founderMode || isFoundedClubId(normalized.selectedClubId));
  normalized.founderClubId = normalized.founderMode ? Number(normalized.founderClubId || normalized.selectedClubId || 0) : 0;
  normalized.founderReplacedClub = normalized.founderReplacedClub || null;
  normalized.founderGoals = normalized.founderMode && normalized.founderGoals && typeof normalized.founderGoals === 'object' && !Array.isArray(normalized.founderGoals) ? normalized.founderGoals : (normalized.founderMode ? {} : null);
  normalized.founderAdministrativeCosts = typeof normalizeFounderAdministrativeCostsState === 'function' ? normalizeFounderAdministrativeCostsState(normalized.founderAdministrativeCosts || {}) : (normalized.founderAdministrativeCosts || {});
  normalized.bankruptcyMode = Boolean(normalized.bankruptcyMode);
  normalized.bankruptcy = normalized.bankruptcy && typeof normalized.bankruptcy === 'object' && !Array.isArray(normalized.bankruptcy) ? normalized.bankruptcy : null;
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
  normalized.rejectedFreeAgentOffers = (normalized.rejectedFreeAgentOffers && typeof normalized.rejectedFreeAgentOffers === 'object' && !Array.isArray(normalized.rejectedFreeAgentOffers)) ? normalized.rejectedFreeAgentOffers : {};
  normalized.scoutingCenter = (normalized.scoutingCenter && typeof normalized.scoutingCenter === 'object' && !Array.isArray(normalized.scoutingCenter)) ? normalized.scoutingCenter : {};
  normalized.monthlyExpenses = (normalized.monthlyExpenses && typeof normalized.monthlyExpenses === 'object' && !Array.isArray(normalized.monthlyExpenses)) ? normalized.monthlyExpenses : {};
  normalized.lastOwnPlayerOffer = normalized.lastOwnPlayerOffer || null;
  // Limpia búsquedas pendientes creadas por la compilación retirada de V7.07.
  if(Object.prototype.hasOwnProperty.call(normalized, 'forcedOwnPlayerOffers')) delete normalized.forcedOwnPlayerOffers;
  normalized.seasonEndPlayerOffers = normalized.seasonEndPlayerOffers || null;
  mergeMarketPlayersIntoSeed(normalized.marketPlayers);
  normalizeAllPlayerPositions();
  normalized.marketPlayers.forEach((p, index) => {
    p.position = normalizePlayerPosition(p.position, p.id);
    p.transferListed = Boolean(p.transferListed);
    p.intransferible = Boolean(p.intransferible);
    if(p.intransferible) p.transferListed = false;
    if(Number(p.clubId || 0) === 0 || p.freeAgent){
      p.nationality = freeAgentNationalityForIndex(index, `market-normalized-${normalized.seasonNumber || 1}`);
      p.freeAgent = true;
    }
    ensurePlayerEconomics(p, p.youthFreeAgent ? FREE_YOUTH_SALARY_FACTOR : MARKET_FREE_AGENT_SALARY_FACTOR);
  });
  normalized.marketPlayers = pruneFreeAgentMarketArrayToHardMax(normalized.marketPlayers, MARKET_FREE_AGENT_HARD_MAX);
  syncSeedFreeAgentCleanup(normalized.marketPlayers);
  mergeMarketPlayersIntoSeed(normalized.marketPlayers);
  seed.players.forEach(p => { p.transferListed = Boolean(p.transferListed); p.intransferible = Boolean(p.intransferible); if(p.intransferible) p.transferListed = false; ensurePlayerEconomics(p, p.youthFreeAgent ? FREE_YOUTH_SALARY_FACTOR : 1); });
  applyClubDivisionOverrides(normalized.clubDivisionOverrides);
  const previousCalendarVersion = normalized.calendarVersion;
  const previousFixtureCount = Array.isArray(normalized.fixtures) ? normalized.fixtures.length : 0;
  normalized.fixtures = normalizeSeasonFixtures(normalized.fixtures || structuredClone(seed.fixtures), normalized.seasonNumber, normalized.seasonYear);
  repairPromotionPlayoffScheduleForState(normalized);
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
  normalized.lastCalendarDate = validIsoDate(normalized.lastCalendarDate) ? normalized.lastCalendarDate : null;
  if(normalized.lastCalendarDate && validIsoDate(normalized.currentDate) && daysBetweenIsoDates(normalized.currentDate, normalized.lastCalendarDate) > 0){
    normalized.currentDate = normalized.lastCalendarDate;
    normalized._calendarRegressionRepaired = true;
  }
  if(normalized.seasonPhase === 'postseason' && typeof ensurePostseasonCalendar === 'function'){
    const postseasonCalendar = ensurePostseasonCalendar(normalized);
    const expectedPostseasonDate = dateForSeasonState(normalized);
    if(validIsoDate(expectedPostseasonDate) && (!validIsoDate(normalized.currentDate) || daysBetweenIsoDates(normalized.currentDate, expectedPostseasonDate) >= 0)){
      normalized.currentDate = expectedPostseasonDate;
      normalized.lastCalendarDate = expectedPostseasonDate;
    }
    normalized._postseasonCalendarRepaired = Boolean(postseasonCalendar?.repaired || normalized._postseasonCalendarRepaired);
  }
  normalized.calendarVersion = SEASON_CALENDAR_VERSION;
  normalized.standings = normalized.standings || createInitialStandings();
  normalized.playerStats = normalized.playerStats || createInitialPlayerStats();
  normalized.managerPlayerStatsHistory = normalizeManagerPlayerStatsHistory(normalized.managerPlayerStatsHistory);
  normalized.clubBudgets = (normalized.clubBudgets && typeof normalized.clubBudgets === 'object' && !Array.isArray(normalized.clubBudgets)) ? normalized.clubBudgets : {};
  seed.clubs.forEach(c => { if(!Number.isFinite(Number(normalized.clubBudgets[c.id]))) normalized.clubBudgets[c.id] = Math.round(Number(c.budget || 0)); });
  normalized.budget = Number.isFinite(normalized.budget) ? normalized.budget : (Number(normalized.clubBudgets[normalized.selectedClubId]) || seed.clubs.find(c=>c.id===normalized.selectedClubId)?.budget || 0);
  normalized.clubBudgets[normalized.selectedClubId] = Math.round(Number(normalized.budget || 0));
  normalized.lastBudgetDelta = Number.isFinite(normalized.lastBudgetDelta) ? normalized.lastBudgetDelta : 0;
  normalized.budgetHistory = normalized.budgetHistory || [];
  normalized.transferBudget = typeof normalizeTransferBudgetState === 'function' ? normalizeTransferBudgetState(normalized.transferBudget, normalized) : (normalized.transferBudget || null);
  normalized.bankLoan = typeof normalizeBankLoanState === 'function' ? normalizeBankLoanState(normalized.bankLoan, normalized) : (normalized.bankLoan || null);
  normalized.nextSeasonTransferBudgetUnlock = (normalized.nextSeasonTransferBudgetUnlock && typeof normalized.nextSeasonTransferBudgetUnlock === 'object' && !Array.isArray(normalized.nextSeasonTransferBudgetUnlock)) ? normalized.nextSeasonTransferBudgetUnlock : null;
  normalized.playerCondition = normalized.playerCondition || {};
  seed.players.forEach(p => {
    if(Number(p.clubId || 0) === 0 || p.freeAgent) normalized.playerCondition[p.id] = 5;
    else if(!Number.isFinite(normalized.playerCondition[p.id])) normalized.playerCondition[p.id] = 99;
  });
  normalized.playerMorale = normalized.playerMorale || {};
  seed.players.forEach(p => {
    if(Number(p.clubId || 0) === 0 || p.freeAgent) normalized.playerMorale[p.id] = 5;
    else if(!Number.isFinite(normalized.playerMorale[p.id])) normalized.playerMorale[p.id] = PLAYER_MORALE_START;
  });
  normalized.playerSkillBoosts = normalized.playerSkillBoosts || {};
  normalized.playerAgeSkillPenalties = (normalized.playerAgeSkillPenalties && typeof normalized.playerAgeSkillPenalties === 'object' && !Array.isArray(normalized.playerAgeSkillPenalties)) ? normalized.playerAgeSkillPenalties : {};
  normalized.trainingPlan = normalized.trainingPlan || {};
  normalized.trainingSchedule = normalizeTrainingSchedule(normalized.trainingSchedule);
  seed.players.forEach(p => {
    if(!normalized.playerSkillBoosts[p.id]) normalized.playerSkillBoosts[p.id] = {};
    normalized.playerAgeSkillPenalties[p.id] = Math.round(Number(p.age || 18)) < PLAYER_AGE_DECAY_START_AGE
      ? 0
      : clamp(Math.round(Number(normalized.playerAgeSkillPenalties[p.id] || 0)), 0, PLAYER_AGE_DECAY_CAP);
    normalized.trainingPlan[p.id] = safeIndividualTrainingType(normalized.trainingPlan[p.id]);
  });
  const agePenaltyRepair = repairPlayerAgeSkillPenaltiesForState(normalized, seed.players);
  if(agePenaltyRepair.cleared || agePenaltyRepair.normalized || agePenaltyRepair.pruned) normalized._needsAutosave = true;
  normalized.staffActions = normalized.staffActions || {};
  normalized.staffContracts = normalizeStaffContracts(normalized.staffContracts || {});
  normalized.academy = normalizeAcademyState(normalized.academy);
  if(normalized.staffActions.motivationalTalk && !Number.isFinite(normalized.staffActions.motivationalTalk.globalTurn)){
    normalized.staffActions.motivationalTalk.globalTurn = ((Math.max(1, normalized.staffActions.motivationalTalk.season || normalized.seasonNumber || 1) - 1) * 53) + Number(normalized.staffActions.motivationalTalk.matchdayIndex || 0);
  }
  normalized.stadium = normalized.stadium || createInitialStadiumState();
  normalized.fans = normalized.fans || createInitialFanState();
  ensureFanState(normalized);
  if(normalized.founderMode && isFoundedClubId(normalized.selectedClubId)){
    const clubId = Number(normalized.selectedClubId);
    const club = seed.clubs.find(c => Number(c.id) === clubId);
    if(club){
      club.stadiumCapacity = Number.isFinite(Number(club.stadiumCapacity)) ? Math.round(Number(club.stadiumCapacity)) : FOUNDER_CLUB_INITIAL_CAPACITY;
      club.fansBase = Number.isFinite(Number(club.fansBase)) ? Math.round(Number(club.fansBase)) : FOUNDER_CLUB_INITIAL_FANS;
      club.budget = Number.isFinite(Number(club.budget)) ? Math.round(Number(club.budget)) : FOUNDER_CLUB_INITIAL_BUDGET;
    }
    normalized.fans.clubs[clubId] = normalized.fans.clubs[clubId] || { base:FOUNDER_CLUB_INITIAL_FANS, current:FOUNDER_CLUB_INITIAL_FANS, lastDelta:0, lastReason:'Modo fundador' };
  }
  if(normalized.bankruptcyMode){
    const clubId = Number(normalized.selectedClubId);
    const club = seed.clubs.find(c => Number(c.id) === clubId);
    if(club){
      const prestige = Number(normalized.bankruptcy?.reducedPrestige || club.reputation || 1);
      club.reputation = clamp(Math.round(prestige), 1, 99);
      club.managerPrestige = clamp(Math.round(prestige), 1, 99);
      club.stadiumCapacity = BANKRUPTCY_INITIAL_CAPACITY;
      club.budget = Number.isFinite(Number(normalized.clubBudgets?.[clubId])) ? Math.round(Number(normalized.clubBudgets[clubId])) : BANKRUPTCY_INITIAL_BUDGET;
      club.fieldConditionScore = Number.isFinite(Number(club.fieldConditionScore)) ? Math.round(Number(club.fieldConditionScore)) : BANKRUPTCY_INITIAL_FIELD;
    }
    normalized.fans.clubs[clubId] = normalized.fans.clubs[clubId] || { base:0, current:0, lastDelta:0, lastReason:'Modo Bancarrota' };
    if(normalized.stadium){
      normalized.stadium.capacityOverrides = normalized.stadium.capacityOverrides || {};
      normalized.stadium.capacityOverrides[clubId] = Number.isFinite(Number(normalized.stadium.capacityOverrides[clubId])) ? Math.round(Number(normalized.stadium.capacityOverrides[clubId])) : BANKRUPTCY_INITIAL_CAPACITY;
      normalized.stadium.fields = normalized.stadium.fields || {};
      normalized.stadium.fields[clubId] = Number.isFinite(Number(normalized.stadium.fields[clubId])) ? Math.round(Number(normalized.stadium.fields[clubId])) : BANKRUPTCY_INITIAL_FIELD;
    }
  }
  normalized.sponsors = normalizeSponsorState(normalized.sponsors);
  normalized.teamCohesion = normalized.teamCohesion || {};
  normalized.lastMatchTactics = normalized.lastMatchTactics || {};
  const normalizedSeasonForDifficulty = Math.max(1, Math.round(Number(normalized.seasonNumber || 1)));
  if(!normalized.managerTacticalAdaptation || typeof normalized.managerTacticalAdaptation !== 'object' || Array.isArray(normalized.managerTacticalAdaptation) || Number(normalized.managerTacticalAdaptation.season || normalizedSeasonForDifficulty) !== normalizedSeasonForDifficulty){
    normalized.managerTacticalAdaptation = { season:normalizedSeasonForDifficulty, signature:'', streak:0, lastBonus:0, lastProspectiveStreak:0 };
  }
  if(!normalized.playerBenchedStreak || typeof normalized.playerBenchedStreak !== 'object' || Array.isArray(normalized.playerBenchedStreak) || Number(normalized.playerBenchedStreak.season || normalizedSeasonForDifficulty) !== normalizedSeasonForDifficulty){
    normalized.playerBenchedStreak = { season:normalizedSeasonForDifficulty, players:{} };
  }
  if(!normalized.playerBenchedStreak.players || typeof normalized.playerBenchedStreak.players !== 'object' || Array.isArray(normalized.playerBenchedStreak.players)){
    normalized.playerBenchedStreak.players = {};
  }
  normalized.botRosterRepairLog = Array.isArray(normalized.botRosterRepairLog) ? normalized.botRosterRepairLog : [];
  normalized.botBalanceLog = Array.isArray(normalized.botBalanceLog) ? normalized.botBalanceLog : [];
  seed.clubs.forEach(c => { if(!Number.isFinite(normalized.teamCohesion[c.id])) normalized.teamCohesion[c.id] = TEAM_COHESION_START; });
  if(!normalized.stadium.fields) normalized.stadium.fields = {};
  if(!normalized.stadium.projects) normalized.stadium.projects = {};
  if(!normalized.stadium.ticketPrices) normalized.stadium.ticketPrices = {};
  if(!normalized.stadium.capacityOverrides || typeof normalized.stadium.capacityOverrides !== 'object' || Array.isArray(normalized.stadium.capacityOverrides)) normalized.stadium.capacityOverrides = {};
  if(!Array.isArray(normalized.stadium.capacityDeteriorationHistory)) normalized.stadium.capacityDeteriorationHistory = [];
  if(!normalized.stadium.facilities || typeof normalized.stadium.facilities !== 'object' || Array.isArray(normalized.stadium.facilities)) normalized.stadium.facilities = {};
  Object.keys(normalized.stadium.facilities).forEach(clubId => { normalized.stadium.facilities[clubId] = normalizeClubFacilitiesState(normalized.stadium.facilities[clubId]); });
  seed.clubs.forEach(c => {
    if(!Number.isFinite(normalized.stadium.fields[c.id])) normalized.stadium.fields[c.id] = Number.isFinite(c.fieldConditionScore) ? c.fieldConditionScore : initialFieldScore(c);
    if(!Number.isFinite(Number(normalized.stadium.ticketPrices[c.id]))) normalized.stadium.ticketPrices[c.id] = TICKET_PRICE_INITIAL;
    normalized.stadium.ticketPrices[c.id] = clamp(Math.round(Number(normalized.stadium.ticketPrices[c.id])), TICKET_PRICE_MIN, TICKET_PRICE_MAX);
  });
  repairInvalidBotFieldStates(normalized, 'normalize_game', { message:true });
  repairInvalidClubWorldCupParticipationPrizeForState(normalized);
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
  game.playerAgeSkillPenalties = (game.playerAgeSkillPenalties && typeof game.playerAgeSkillPenalties === 'object' && !Array.isArray(game.playerAgeSkillPenalties)) ? game.playerAgeSkillPenalties : {};
  game.trainingPlan = game.trainingPlan || {};
  game.trainingSchedule = normalizeTrainingSchedule(game.trainingSchedule);
  game.playerStats = game.playerStats || {};
  seed.players.forEach(p => {
    ensurePlayerEconomics(p, p.youthFreeAgent ? FREE_YOUTH_SALARY_FACTOR : (p.freeAgent ? MARKET_FREE_AGENT_SALARY_FACTOR : 1));
    if(Number(p.clubId || 0) === 0 || p.freeAgent){ game.playerCondition[p.id] = 5; }
    else if(!Number.isFinite(game.playerCondition[p.id])) game.playerCondition[p.id] = 99;
    if(Number(p.clubId || 0) === 0 || p.freeAgent){ game.playerMorale[p.id] = 5; }
    else if(!Number.isFinite(game.playerMorale[p.id])) game.playerMorale[p.id] = PLAYER_MORALE_START;
    if(!game.playerSkillBoosts[p.id]) game.playerSkillBoosts[p.id] = {};
    game.playerAgeSkillPenalties[p.id] = Math.round(Number(p.age || 18)) < PLAYER_AGE_DECAY_START_AGE
      ? 0
      : clamp(Math.round(Number(game.playerAgeSkillPenalties[p.id] || 0)), 0, PLAYER_AGE_DECAY_CAP);
    game.trainingPlan[p.id] = safeIndividualTrainingType(game.trainingPlan[p.id]);
    if(!game.playerStats[p.id]) game.playerStats[p.id] = createEmptyPlayerStat(p);
    normalizePlayerStatRecord(game.playerStats[p.id]);
  });
  const agePenaltyRepair = repairPlayerAgeSkillPenaltiesForState(game, seed.players);
  if(agePenaltyRepair.cleared || agePenaltyRepair.normalized || agePenaltyRepair.pruned) game._needsAutosave = true;
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
    if(!canAssignPlayerToSlot(player, slot)) return slot === 'POR' ? 'El puesto de portero sólo acepta porteros, salvo emergencia real cuando el plantel no tiene ningún POR.' : 'Los porteros sólo pueden ocupar el puesto de portero.';
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
  game.tactic = ensureTacticCaptain(applyStarterMentalities(game.tactic), game.selectedClubId);
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
  const sectorStyles = normalizeSectorStyles(base.sectorStyles);
  const normalized = { formation:base.formation, captainId:0, starters, bench, autoSubs, playerMentalities:{ ...(game?.playerMentalities || {}), ...(base.playerMentalities || {}) }, matchInstructions, sectorStyles };
  normalized.captainId = normalizedCaptainIdForTactic(clubId, { ...normalized, captainId:base.captainId });
  return applyStarterMentalities(normalized);
}


function bankruptcyModeEnabled(){ return Boolean(BANKRUPTCY_MODE_ENABLED); }
function currentGameIsBankruptcyMode(){ return Boolean(game?.bankruptcyMode || game?.bankruptcy?.active); }
function bankruptcyReducedPrestige(originalPrestige){
  const value = Math.max(1, Math.round(Number(originalPrestige || 0) * (1 - Number(BANKRUPTCY_PRESTIGE_REDUCTION || 0))));
  return clamp(value, 1, 99);
}
function bankruptcyReleasePlayer(player, reason='Modo Bancarrota'){
  if(!player) return null;
  player.clubId = 0;
  player.freeAgent = true;
  player.bankruptcyReleased = true;
  player.origin = player.origin || reason;
  if(typeof refreshPlayerClause === 'function') refreshPlayerClause(player);
  return { ...player };
}
function bankruptcyPositionPriority(position){
  const group = typeof playerRoleGroup === 'function' ? playerRoleGroup(position) : String(position || '');
  if(group === 'POR') return 0;
  if(group === 'DEF') return 1;
  if(group === 'MID') return 2;
  return 3;
}
function selectBankruptcyLoyalPlayers(clubId){
  const squad = playersByClub(clubId).slice().sort((a,b)=>
    bankruptcyPositionPriority(a.position)-bankruptcyPositionPriority(b.position) ||
    visibleOverall(b)-visibleOverall(a) ||
    Number(a.salary || 0)-Number(b.salary || 0) ||
    Number(a.id)-Number(b.id)
  );
  const keep = new Set();
  const keepByGroup = (group, count) => {
    squad.filter(p => (typeof playerRoleGroup === 'function' ? playerRoleGroup(p.position) : '') === group && !keep.has(Number(p.id))).slice(0, count).forEach(p => keep.add(Number(p.id)));
  };
  keepByGroup('POR', BANKRUPTCY_LOYAL_GK_MIN);
  keepByGroup('DEF', 4);
  keepByGroup('MID', 4);
  keepByGroup('ATT', 3);
  squad.filter(p => !keep.has(Number(p.id))).sort((a,b)=>visibleOverall(b)-visibleOverall(a) || Number(a.salary || 0)-Number(b.salary || 0)).forEach(player => {
    if(keep.size < BANKRUPTCY_LOYAL_FIRST_TEAM_PLAYERS) keep.add(Number(player.id));
  });
  return keep;
}
function trimBankruptcyFirstTeam(clubId){
  const loyal = selectBankruptcyLoyalPlayers(clubId);
  const released = [];
  (seed?.players || []).forEach(player => {
    if(Number(player.clubId || 0) !== Number(clubId)) return;
    if(loyal.has(Number(player.id))){
      player.bankruptcyLoyal = true;
      player.joinedClubSeason = game?.seasonNumber || 1;
      return;
    }
    const free = bankruptcyReleasePlayer(player, 'Liberado por quiebra del club');
    if(free) released.push(free);
  });
  if(Array.isArray(game?.marketPlayers)){
    const existing = new Set(game.marketPlayers.map(p => Number(p.id)));
    released.forEach(player => { if(!existing.has(Number(player.id))){ game.marketPlayers.push({ ...player }); existing.add(Number(player.id)); } });
  }
  return { kept:loyal.size, released:released.length };
}
function bankruptcyAcademyGroupForIndex(index){
  if(index < BANKRUPTCY_ACADEMY_GK_MIN) return 'POR';
  const pattern = ['DEF','MED','DEL','DEF','MED','DEL','MED','DEF','DEL'];
  return pattern[(index - BANKRUPTCY_ACADEMY_GK_MIN) % pattern.length];
}
function createBankruptcyAcademyPlayers(count=BANKRUPTCY_ACADEMY_PLAYERS){
  const created = [];
  if(!game?.academy || typeof nextAcademyPlayerId !== 'function') return created;
  let id = nextAcademyPlayerId();
  for(let i=0;i<count;i++, id++){
    const group = bankruptcyAcademyGroupForIndex(i);
    const nationality = typeof academyNationality === 'function' ? academyNationality(id, { local:true }) : 'Argentina';
    const overall = typeof academyOverallRoll === 'function' ? academyOverallRoll(id, 16) : 10;
    const raw = {
      id,
      name:typeof academyName === 'function' ? academyName(id, nationality) : `Juvenil ${id}`,
      nationality,
      age:16,
      group,
      overall,
      skills:typeof academySkillsFor === 'function' ? academySkillsFor(group, overall, id) : {},
      status:'academy',
      source:'modo_bancarrota_renacer',
      bankruptcyYouth:true,
      joinedSeason:game?.seasonNumber || 1,
      joinedTurn:typeof currentTurnIndex === 'function' ? currentTurnIndex() : 0
    };
    created.push(typeof normalizeAcademyPlayer === 'function' ? normalizeAcademyPlayer(raw) : raw);
  }
  game.academy.players.push(...created);
  created.forEach(player => { game.academy.trainingPlan[player.id] = game.academy.trainingPlan[player.id] || (typeof safeIndividualTrainingType === 'function' ? safeIndividualTrainingType(TRAINING_INDIVIDUAL_INITIAL) : 'balanced'); });
  return created;
}
function applyBankruptcyModeSetup(selectedClubId){
  if(!game || !bankruptcyModeEnabled()) return null;
  const club = seed.clubs.find(c => Number(c.id) === Number(selectedClubId));
  if(!club) return null;
  const original = {
    reputation:clubPrestigeValue(club),
    budget:Number(club.budget || 0),
    stadiumCapacity:typeof clubStadiumCapacity === 'function' ? clubStadiumCapacity(selectedClubId) : Number(club.stadiumCapacity || 0),
    fans:typeof clubFansCurrent === 'function' ? clubFansCurrent(selectedClubId) : Number(club.fansBase || 0),
    players:playersByClub(selectedClubId).length
  };
  const reducedPrestige = bankruptcyReducedPrestige(original.reputation);
  club.reputation = reducedPrestige;
  club.managerPrestige = reducedPrestige;
  club.budget = BANKRUPTCY_INITIAL_BUDGET;
  club.stadiumCapacity = BANKRUPTCY_INITIAL_CAPACITY;
  club.fieldConditionScore = BANKRUPTCY_INITIAL_FIELD;
  club.fieldCondition = typeof fieldConditionName === 'function' ? fieldConditionName(BANKRUPTCY_INITIAL_FIELD) : 'Óptimo';
  game.bankruptcyMode = true;
  game.bankruptcy = { active:true, label:'Bancarrota, Renacer', startedAt:{ season:game.seasonNumber || 1, date:game.currentDate || '', turn:game.globalTurn || 0 }, original, reducedPrestige, initialDebt:BANKRUPTCY_INITIAL_BUDGET };
  game.clubBudgets[selectedClubId] = BANKRUPTCY_INITIAL_BUDGET;
  game.budget = BANKRUPTCY_INITIAL_BUDGET;
  game.seasonInitialBudget = BANKRUPTCY_INITIAL_BUDGET;
  game.careerInitialBudget = BANKRUPTCY_INITIAL_BUDGET;
  game.seasonBudgetStartBySeason = { 1:BANKRUPTCY_INITIAL_BUDGET };
  if(game.stadium){
    game.stadium.capacityOverrides = game.stadium.capacityOverrides || {};
    game.stadium.fields = game.stadium.fields || {};
    game.stadium.capacityOverrides[selectedClubId] = BANKRUPTCY_INITIAL_CAPACITY;
    game.stadium.fields[selectedClubId] = BANKRUPTCY_INITIAL_FIELD;
  }
  if(typeof ensureFanState === 'function') ensureFanState(game);
  const reducedFans = Math.max(0, Math.round(Number(original.fans || 0) * (1 - Number(BANKRUPTCY_FANS_REDUCTION || 0))));
  if(game.fans?.clubs){
    game.fans.clubs[selectedClubId] = { ...(game.fans.clubs[selectedClubId] || {}), base:reducedFans, current:reducedFans, lastDelta:reducedFans - Number(original.fans || 0), lastReason:'Modo Bancarrota' };
  }
  const roster = trimBankruptcyFirstTeam(selectedClubId);
  const academyPlayers = createBankruptcyAcademyPlayers(BANKRUPTCY_ACADEMY_PLAYERS);
  game.bankruptcy.roster = roster;
  game.bankruptcy.academyPlayers = academyPlayers.length;
  game.tactic = normalizeTactic(selectedClubId, DEFAULT_TACTIC);
  if(game.managerStats){
    game.managerStats.currentSeason = applyManagerObjectiveSeasonFields(game.managerStats.currentSeason || {}, game.managerStats, 1, selectedClubId);
  }
  return game.bankruptcy;
}

function newGame(selectedClubId, options={}){
  const selectedClub = seed.clubs.find(c => Number(c.id) === Number(selectedClubId)) || {};
  if(!options.ignorePrestige && !managerCanSelectClub(selectedClub, currentManagerPrestige())){
    showNotice(`Ese club requiere prestigio ${clubPrestigeValue(selectedClub)}. Tu prestigio actual es ${formatManagerPrestige(currentManagerPrestige())}.`);
    return;
  }
  const managerName = persistManagerName(options.managerName || storedManagerName());
  const saveSlotId = typeof normalizeSaveSlotId === 'function' ? normalizeSaveSlotId(options.saveSlotId || currentSaveSlotId || (options.challengeId ? SAVE_SLOT_CAMPO_DESTRUIDO : SAVE_SLOT_CAREER)) : (options.challengeId ? 'challenge:campo_destruido' : 'career');
  if(typeof setCurrentSaveSlot === 'function') setCurrentSaveSlot(saveSlotId);
  const tactic = normalizeTactic(selectedClubId, DEFAULT_TACTIC);
  game = {
    version:APP_VERSION,
    saveSlotId,
    seedSignature:seed?.meta?.signature || '',
    selectedClubId,
    selectedCountry: options.country || clubCountry(selectedClub),
    selectedLeagueId: options.leagueId || selectedClub.divisionId || 'default',
    playerMentalities: {},
    savedTactics: normalizeSavedTacticsState({}),
    savedTrainingPlans: normalizeSavedTrainingPlansState({}),
    standingsHistory: normalizeStandingsHistoryState({}),
    competitionChampionsHistory: normalizeCompetitionChampionsHistoryState({}),
    clubWorldCupHistory: normalizeClubWorldCupHistoryState({}),
    saveCode: generateSaveCode(),
    rankingUploads: {},
    rankingManagerName: managerName,
    rankingLastUploadGameDate: '',
    rankingLastManualUploadGameDate: '',
    rankingLastAutomaticUploadGameDate: '',
    manualRetiredPlayerIds: [],
    seasonNumber: 1,
    seasonYear: seasonYearForNumber(1),
    calendarVersion: SEASON_CALENDAR_VERSION,
    seasonFinalized: false,
    seasonTransition: null,
    seasonPhase: 'preseason',
    phaseTurn: 0,
    postseasonStartDate: '',
    postseasonTotalTurns: 0,
    globalTurn: 0,
    preseasonFriendliesPlayed: 0,
    pendingFriendlyOpponentId: 0,
    clubDivisionOverrides: {},
    leagueSeasonEconomy: { version:1, seasons:{} },
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
    rejectedFreeAgentOffers: {},
    scoutingCenter: {},
    monthlyExpenses: {},
    lastOwnPlayerOffer: null,
    seasonEndPlayerOffers: null,
    specialClauseOffers: null,
    currentDate: firstAdvanceDateForSeason(seasonYearForNumber(1)),
    matchdayIndex: 0,
    tactic,
    captaincyProgress: {},
    captaincyAppliedMatches: {},
    lastCaptaincyEffect: null,
    standings: createInitialStandings(),
    playerStats: createInitialPlayerStats(),
    managerPlayerStatsHistory: createInitialManagerPlayerStatsHistory(),
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
    careerInitialBudget: seed.clubs.find(c=>c.id===selectedClubId)?.budget || 0,
    seasonBudgetStartBySeason: { 1: seed.clubs.find(c=>c.id===selectedClubId)?.budget || 0 },
    lastBudgetDelta: 0,
    budgetHistory: [],
    transferBudget: typeof createTransferBudgetState === 'function' ? createTransferBudgetState(selectedClubId, 1, 0) : null,
    bankLoan: typeof createBankLoanState === 'function' ? createBankLoanState(1) : null,
    nextSeasonTransferBudgetUnlock: null,
    playerCondition: Object.fromEntries(seed.players.map(p => [p.id, 99])),
    playerMorale: Object.fromEntries(seed.players.map(p => [p.id, PLAYER_MORALE_START])),
    playerSkillBoosts: Object.fromEntries(seed.players.map(p => [p.id, {}])),
    playerAgeSkillPenalties: Object.fromEntries(seed.players.map(p => [p.id, 0])),
    trainingPlan: Object.fromEntries(seed.players.map(p => [p.id, safeIndividualTrainingType(TRAINING_INDIVIDUAL_INITIAL)])),
    trainingSchedule: defaultTrainingSchedule(),
    staffActions: {},
    staffContracts: {},
    academy: createInitialAcademyState(),
    stadium: createInitialStadiumState(),
    fans: createInitialFanState(),
    sponsors: createInitialSponsorState(),
    teamCohesion: Object.fromEntries(seed.clubs.map(c => [c.id, TEAM_COHESION_START])),
    lastMatchTactics: {},
    managerTacticalAdaptation: { season:1, signature:'', streak:0, lastBonus:0, lastProspectiveStreak:0 },
    playerBenchedStreak: { season:1, players:{} },
    founderMode: Boolean(options.founderMode),
    founderClubId: options.founderMode ? Number(selectedClubId) : 0,
    founderReplacedClub: options.founderReplacedClub || null,
    founderGoals: null,
    founderAdministrativeCosts: {},
    bankruptcyMode: Boolean(options.bankruptcyMode),
    bankruptcy: null,
    challenge: null
  };
  if(typeof applySharedManagerProfileToGame === 'function') applySharedManagerProfileToGame({ reason:'new_game' });
  const newClubSpecialReset = typeof resetActiveSpecialCardsToReserveForNewClub === 'function' ? resetActiveSpecialCardsToReserveForNewClub({ reason:'new_game' }) : null;
  assignInitialBotFieldStates(selectedClubId);
  if(options.founderMode){
    const selected = seed.clubs.find(c => Number(c.id) === Number(selectedClubId));
    if(selected){
      selected.budget = FOUNDER_CLUB_INITIAL_BUDGET;
      selected.stadiumCapacity = FOUNDER_CLUB_INITIAL_CAPACITY;
      selected.fansBase = FOUNDER_CLUB_INITIAL_FANS;
      selected.reputation = FOUNDER_CLUB_REPUTATION;
      selected.managerPrestige = FOUNDER_CLUB_REPUTATION;
    }
    game.clubBudgets[selectedClubId] = FOUNDER_CLUB_INITIAL_BUDGET;
    game.budget = FOUNDER_CLUB_INITIAL_BUDGET;
    game.seasonInitialBudget = FOUNDER_CLUB_INITIAL_BUDGET;
    game.careerInitialBudget = FOUNDER_CLUB_INITIAL_BUDGET;
    game.seasonBudgetStartBySeason = { 1: FOUNDER_CLUB_INITIAL_BUDGET };
    game.stadium.capacityOverrides[selectedClubId] = FOUNDER_CLUB_INITIAL_CAPACITY;
    game.stadium.fields[selectedClubId] = FOUNDER_CLUB_INITIAL_FIELD;
    game.fans.clubs[selectedClubId] = { base:FOUNDER_CLUB_INITIAL_FANS, current:FOUNDER_CLUB_INITIAL_FANS, lastDelta:0, lastReason:'Modo fundador' };
  }
  game.marketPlayers = generateMarketPlayers(MARKET_FREE_AGENT_COUNT);
  if(options.bankruptcyMode) applyBankruptcyModeSetup(selectedClubId, options);
  if(options.founderMode) ensureFounderFreeAgentPool(options.founderReleasedPlayers || []);
  else mergeMarketPlayersIntoSeed(game.marketPlayers);
  ensurePlayerStateForAll();
  repairBotRosters({ reason: options.founderMode ? 'founder_new_game' : (options.challengeId ? 'challenge_new_game' : 'new_game') });
  if(options.challengeId && typeof applyChallengePreset === 'function') applyChallengePreset(options.challengeId, selectedClubId);
  if(typeof ensureLeagueSeasonEconomyForSeason === 'function') ensureLeagueSeasonEconomyForSeason(game, 1, { force:true, reason:'new_game' });
  generateOpeningSponsorOffers(true);
  if(options.founderMode){
    ensureFounderGoalsState();
    pushGameMessage({ type:'fundador', title:'Club fundado desde cero', body:`Fundaste ${clubName(selectedClubId)}. El club empieza sin jugadores, sin presupuesto, con estadio de capacidad 0, prestigio ${FOUNDER_CLUB_REPUTATION} y ${formatPlainNumber(FOUNDER_CLUB_INITIAL_FANS)} hinchas. No tendrás objetivos de directiva ni riesgo de despido.`, priority:'high' });
    pushGameMessage({ type:'fundador', title:`Primera meta: ${game.founderGoals.current.title}`, body:game.founderGoals.current.description, priority:'normal' });
  } else if(options.bankruptcyMode) {
    const info = game.bankruptcy || {};
    pushGameMessage({ type:'directiva', title:'Bancarrota, Renacer', body:`Aceptaste refundar ${clubName(selectedClubId)} tras la quiebra. El club quedó con deuda extrema, sin estadio disponible, menor prestigio, menos hinchas, un plantel reducido de jugadores leales y una camada de juveniles de 16 años en Academia. La primera temporada la directiva sólo exige no descender.`, priority:'high' });
    if(info.roster){
      pushGameMessage({ type:'mercado', title:'Plantel reducido por la crisis', body:'Parte del plantel se marchó como agente libre. Los jugadores que permanecieron serán la base deportiva inmediata mientras formás juveniles y recuperás ingresos.', priority:'normal' });
    }
  } else if(options.challengeId) {
    pushGameMessage({ type:'reto', title:'Reto activo', body:'La partida empezó desde un escenario predeterminado. Revisá las reglas del reto en Inicio antes de avanzar.', priority:'high' });
  } else {
    pushGameMessage({ type:'system', title:'Bienvenido al club', body:'La temporada está por comenzar. Revisá táctica, mercado y mensajes antes del debut.', priority:'normal' });
  }
  const initialLeagueEconomyText = typeof leagueSeasonEconomyMessageForClub === 'function' ? leagueSeasonEconomyMessageForClub(selectedClubId, 1) : '';
  if(initialLeagueEconomyText){
    pushGameMessage({ type:'finanzas', title:'Economía anual de la liga', body:initialLeagueEconomyText, priority:'normal', id:`league-economy-1-${selectedClubId}` });
  }
  if(newClubSpecialReset?.returned){
    pushGameMessage({ type:'especial', title:'Cartas activas devueltas', body:`Al comenzar en un nuevo club, ${newClubSpecialReset.returned} carta(s) activa(s) volvieron a la reserva. Los usos consumidos se conservaron.`, priority:'normal' });
  }
  if(typeof queueInitialAssistantAdviceMessages === 'function') queueInitialAssistantAdviceMessages();
  activeTab = 'home';
  closeModal();
  renderAll();
  if(typeof saveLocal === 'function') saveLocal(true).catch?.(()=>{});
  showNotice(options.founderMode ? 'Club fundado. Armá el plantel desde Mercado antes de competir.' : (options.bankruptcyMode ? 'Modo Bancarrota iniciado. Revisá Finanzas, Academia, Estadio y Táctica antes de avanzar.' : (options.challengeId ? 'Reto creado. Dirigí los 5 partidos y buscá el campeonato.' : 'Carrera creada. Revisá táctica, titulares y mentalidades antes de avanzar.')));
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

function createInitialManagerPlayerStatsHistory(){
  return { version:1, seasons:{} };
}
function normalizeManagerPlayerStatsEntry(raw, fallbackId=0){
  const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const playerId = Math.max(0, Math.round(Number(src.playerId || fallbackId || 0)));
  return {
    playerId,
    name:String(src.name || src.playerName || playerById(playerId)?.name || 'Jugador'),
    position:String(src.position || playerById(playerId)?.position || '—'),
    played:Math.max(0, Math.round(Number(src.played || 0))),
    goals:Math.max(0, Math.round(Number(src.goals || 0))),
    assists:Math.max(0, Math.round(Number(src.assists || 0))),
    injuries:Math.max(0, Math.round(Number(src.injuries || 0))),
    yellow:Math.max(0, Math.round(Number(src.yellow || 0))),
    red:Math.max(0, Math.round(Number(src.red || 0))),
    ratingTotal:Math.max(0, Number(src.ratingTotal || 0)),
    ratedMatches:Math.max(0, Math.round(Number(src.ratedMatches || 0))),
    lastRating:Number.isFinite(Number(src.lastRating)) ? Number(src.lastRating) : 0
  };
}
function normalizeManagerPlayerStatsHistory(raw){
  const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const out = { version:1, seasons:{} };
  Object.entries(src.seasons || {}).forEach(([seasonKey, seasonRaw]) => {
    if(!seasonRaw || typeof seasonRaw !== 'object' || Array.isArray(seasonRaw)) return;
    const seasonNumber = Math.max(1, Math.round(Number(seasonRaw.seasonNumber || seasonKey || 1)));
    const year = Math.round(Number(seasonRaw.year || seasonYearForNumber(seasonNumber) || 0));
    const season = { seasonNumber, year, clubs:{} };
    Object.entries(seasonRaw.clubs || {}).forEach(([clubKey, clubRaw]) => {
      if(!clubRaw || typeof clubRaw !== 'object' || Array.isArray(clubRaw)) return;
      const clubId = Math.max(0, Math.round(Number(clubRaw.clubId || clubKey || 0)));
      if(!clubId) return;
      const club = {
        clubId,
        clubName:String(clubRaw.clubName || clubName(clubId)),
        divisionName:String(clubRaw.divisionName || clubDivision(clubId)?.name || '—'),
        archived:Boolean(clubRaw.archived),
        completedDate:String(clubRaw.completedDate || ''),
        players:{},
        recordedMatchKeys:{}
      };
      Object.entries(clubRaw.players || {}).forEach(([playerKey, playerRaw]) => {
        const entry = normalizeManagerPlayerStatsEntry(playerRaw, playerKey);
        if(entry.playerId) club.players[String(entry.playerId)] = entry;
      });
      if(Array.isArray(clubRaw.recordedMatchKeys)) clubRaw.recordedMatchKeys.forEach(key => { if(key) club.recordedMatchKeys[String(key)] = true; });
      else if(clubRaw.recordedMatchKeys && typeof clubRaw.recordedMatchKeys === 'object') Object.keys(clubRaw.recordedMatchKeys).forEach(key => { if(key) club.recordedMatchKeys[String(key)] = true; });
      season.clubs[String(clubId)] = club;
    });
    out.seasons[String(seasonNumber)] = season;
  });
  return out;
}
function managerPlayerStatsHistoryState(){
  if(!game) return createInitialManagerPlayerStatsHistory();
  const current = game.managerPlayerStatsHistory;
  if(!current || typeof current !== 'object' || Array.isArray(current) || Number(current.version || 0) !== 1 || !current.seasons || typeof current.seasons !== 'object' || Array.isArray(current.seasons)){
    game.managerPlayerStatsHistory = normalizeManagerPlayerStatsHistory(current);
  }
  return game.managerPlayerStatsHistory;
}
function managerPlayerStatsSeasonRecord(seasonNumber=game?.seasonNumber || 1, create=true){
  const state = managerPlayerStatsHistoryState();
  const season = Math.max(1, Math.round(Number(seasonNumber || 1)));
  const key = String(season);
  if(!state.seasons[key] && create){
    state.seasons[key] = { seasonNumber:season, year:Number(game?.seasonNumber) === season ? Number(game?.seasonYear || seasonYearForNumber(season)) : Number(seasonYearForNumber(season)), clubs:{} };
  }
  return state.seasons[key] || null;
}
function managerPlayerStatsClubRecord(clubId=game?.selectedClubId, seasonNumber=game?.seasonNumber || 1, create=true){
  const id = Math.max(0, Math.round(Number(clubId || 0)));
  if(!id) return null;
  const season = managerPlayerStatsSeasonRecord(seasonNumber, create);
  if(!season) return null;
  const key = String(id);
  if(!season.clubs[key] && create){
    season.clubs[key] = { clubId:id, clubName:clubName(id), divisionName:clubDivision(id)?.name || '—', archived:false, completedDate:'', players:{}, recordedMatchKeys:{} };
  }
  return season.clubs[key] || null;
}
function ensureManagerPlayerStatsEntry(clubRecord, playerId){
  if(!clubRecord) return null;
  const id = Math.max(0, Math.round(Number(playerId || 0)));
  if(!id) return null;
  const key = String(id);
  if(!clubRecord.players[key]) clubRecord.players[key] = normalizeManagerPlayerStatsEntry({ playerId:id }, id);
  const player = playerById(id);
  if(player){
    clubRecord.players[key].name = String(player.name || clubRecord.players[key].name || 'Jugador');
    clubRecord.players[key].position = String(player.position || clubRecord.players[key].position || '—');
  }
  return clubRecord.players[key];
}
function managerPlayerStatsMatchKey(result){
  if(!result) return '';
  const explicit = String(result.id || result.matchId || '').trim();
  if(explicit) return explicit;
  return [result.season || game?.seasonNumber || 1, result.date || result.currentDate || '', result.seasonDay || '', result.round || result.matchday || '', result.homeId || 0, result.awayId || 0, result.engine || '', result.homeGoals ?? '', result.awayGoals ?? ''].join('|');
}
function managerPlayerStatsEventSummary(result, playerId){
  const id = Number(playerId || 0);
  const summary = { goals:0, assists:0, injuries:0, yellow:0, red:0, saves:0, errors:0, goalErrors:0 };
  (result?.goals || []).forEach(goal => {
    if(Number(goal.playerId || goal.scorerId || 0) === id) summary.goals += 1;
    if(Number(goal.assistId || 0) === id) summary.assists += 1;
  });
  (result?.cards || []).forEach(card => {
    if(Number(card.playerId || 0) !== id) return;
    if(card.type === 'yellow') summary.yellow += 1;
    else if(card.type === 'secondYellowRed'){ summary.yellow += 1; summary.red += 1; }
    else if(card.type === 'red') summary.red += 1;
  });
  (result?.injuries || []).forEach(injury => { if(Number(injury.playerId || 0) === id) summary.injuries += 1; });
  (result?.keySaves || []).forEach(save => { if(Number(save.playerId || save.goalkeeperId || 0) === id) summary.saves += 1; });
  (result?.errors || []).forEach(error => {
    if(Number(error.playerId || 0) !== id) return;
    summary.errors += 1;
    if(error.goal) summary.goalErrors += 1;
  });
  return summary;
}
function managerPlayerStoredRating(result, playerId){
  const id = Number(playerId || 0);
  const list = Array.isArray(result?.playerRatings) ? result.playerRatings : [];
  const found = list.find(item => Number(item?.playerId || item?.id || 0) === id);
  const value = Number(found?.rating);
  return Number.isFinite(value) ? clamp(value, 3, 10) : null;
}
function managerPlayerFallbackRating(result, clubId, playerId, events){
  const player = playerById(playerId);
  if(!player) return 6;
  const overall = clamp(Number(typeof effectiveOverall === 'function' ? effectiveOverall(player) : player.overall || 50), 1, 99);
  const condition = clamp(Number(typeof currentCondition === 'function' ? currentCondition(playerId) : 75), 1, 100);
  const morale = clamp(Number(typeof currentMorale === 'function' ? currentMorale(playerId) : 55), 1, 100);
  const home = Number(clubId) === Number(result?.homeId);
  const ownGoals = home ? Number(result?.homeGoals || 0) : Number(result?.awayGoals || 0);
  const rivalGoals = home ? Number(result?.awayGoals || 0) : Number(result?.homeGoals || 0);
  let rating = 6.05 + (overall - 62) * 0.012 + (morale - 55) * 0.006 + (condition - 70) * 0.005;
  rating += Number(events.goals || 0) * 0.82 + Number(events.assists || 0) * 0.48 + Number(events.saves || 0) * 0.24;
  rating -= Number(events.yellow || 0) * 0.22 + Number(events.red || 0) * 1.10 + Number(events.errors || 0) * 0.32 + Number(events.goalErrors || 0) * 0.42 + Number(events.injuries || 0) * 0.18;
  rating += clamp(ownGoals - rivalGoals, -3, 3) * 0.08;
  return clamp(rating, 3, 10);
}
function recordManagerPlayerMatchStatistics(clubId, playedIds=[], result=null, options={}){
  if(!game || !result || result.friendly || !result.played) return null;
  const id = Number(clubId || 0);
  if(!id || (!options.force && id !== Number(game.selectedClubId || 0))) return null;
  const seasonNumber = Math.max(1, Math.round(Number(options.seasonNumber || game.seasonNumber || 1)));
  const clubRecord = managerPlayerStatsClubRecord(id, seasonNumber, true);
  if(!clubRecord) return null;
  const matchKey = managerPlayerStatsMatchKey(result);
  if(matchKey && clubRecord.recordedMatchKeys[matchKey]) return clubRecord;
  const uniquePlayed = [...new Set((playedIds || []).map(Number).filter(Boolean))];
  uniquePlayed.forEach(playerId => {
    const entry = ensureManagerPlayerStatsEntry(clubRecord, playerId);
    if(!entry) return;
    const events = managerPlayerStatsEventSummary(result, playerId);
    entry.played += 1;
    entry.goals += events.goals;
    entry.assists += events.assists;
    entry.injuries += events.injuries;
    entry.yellow += events.yellow;
    entry.red += events.red;
    const stored = managerPlayerStoredRating(result, playerId);
    const rating = stored === null ? managerPlayerFallbackRating(result, id, playerId, events) : stored;
    entry.ratingTotal = Number(entry.ratingTotal || 0) + rating;
    entry.ratedMatches = Number(entry.ratedMatches || 0) + 1;
    entry.lastRating = rating;
  });
  if(matchKey) clubRecord.recordedMatchKeys[matchKey] = true;
  clubRecord.clubName = clubName(id);
  clubRecord.divisionName = clubDivision(id)?.name || clubRecord.divisionName || '—';
  return clubRecord;
}
function managerPlayerPlayedIdsForResult(result, clubId){
  const home = Number(clubId) === Number(result?.homeId);
  const explicit = home ? result?.playedIdsHome : result?.playedIdsAway;
  if(Array.isArray(explicit) && explicit.length) return [...new Set(explicit.map(Number).filter(Boolean))];
  const starters = home ? (result?.starterIdsHome || []) : (result?.starterIdsAway || []);
  const ins = (result?.substitutions || []).filter(sub => Number(sub.clubId || 0) === Number(clubId)).map(sub => Number(sub.inId || 0));
  return [...new Set(starters.concat(ins).map(Number).filter(Boolean))];
}
function syncManagerPlayerStatsClubFromHistory(clubId=game?.selectedClubId, seasonNumber=game?.seasonNumber || 1){
  if(!game) return null;
  const id = Number(clubId || 0);
  const clubRecord = managerPlayerStatsClubRecord(id, seasonNumber, true);
  if(!clubRecord) return null;
  if(Number(seasonNumber) === Number(game.seasonNumber || 1)){
    (game.matchHistory || []).filter(result => result?.played && !result?.friendly && (Number(result.homeId) === id || Number(result.awayId) === id)).forEach(result => {
      recordManagerPlayerMatchStatistics(id, managerPlayerPlayedIdsForResult(result, id), result, { force:true, seasonNumber });
    });
  }
  return clubRecord;
}
function ensureManagerPlayerStatsRoster(clubRecord, clubId){
  if(!clubRecord) return clubRecord;
  playersByClub(clubId).filter(player => !player.retired).forEach(player => ensureManagerPlayerStatsEntry(clubRecord, player.id));
  return clubRecord;
}
function archiveManagerPlayerStatsClub(clubId=game?.selectedClubId, options={}){
  if(!game) return null;
  const id = Number(clubId || 0);
  if(!id) return null;
  const clubRecord = syncManagerPlayerStatsClubFromHistory(id, game.seasonNumber || 1);
  ensureManagerPlayerStatsRoster(clubRecord, id);
  if(clubRecord){
    clubRecord.archived = options.final !== false;
    clubRecord.completedDate = String(game.currentDate || '');
  }
  return clubRecord;
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
function isPlayerUntransferable(playerOrId){
  const player = typeof playerOrId === 'object' ? playerOrId : playerById(playerOrId);
  return Boolean(player?.intransferible);
}
function transferListedMarkup(playerOrId){
  return isTransferListedPlayer(playerOrId) ? '<span class="transfer-listed-badge" title="Jugador transferible">EN VENTA</span>' : '';
}
function untransferableMarkup(playerOrId){
  return isPlayerUntransferable(playerOrId) ? '<span class="untransferable-lock" title="Jugador intransferible: sólo se escuchan ofertas por cláusula completa" aria-label="Jugador intransferible">🔒</span>' : '';
}
function playerNameWithStar(player){
  return `${playerStarMarkup(player)}${escapeHtml(player?.name || 'Jugador')}${transferListedMarkup(player)}${untransferableMarkup(player)}`;
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

function normalizeManagerTitleHistory(items=[]){
  const source = Array.isArray(items) ? items : [];
  const clean = [];
  const seen = new Set();
  source.forEach(item => {
    const season = Math.max(1, Math.round(Number(item?.season || 0)) || 1);
    const type = String(item?.type || 'league').trim() || 'league';
    const competitionId = String(item?.competitionId || item?.divisionId || item?.id || `${type}-${season}`).trim();
    const clubId = Number(item?.clubId || item?.championId || 0);
    const key = `${season}:${type}:${competitionId}`;
    if(seen.has(key)) return;
    seen.add(key);
    clean.push({
      key,
      season,
      year:Math.round(Number(item?.year || 0)) || seasonYearForNumber(season),
      type,
      competitionId,
      competitionName:String(item?.competitionName || item?.divisionName || item?.name || competitionId),
      clubId,
      clubName:String(item?.clubName || (clubId ? clubName(clubId) : '')),
      createdAt:String(item?.createdAt || new Date().toISOString())
    });
  });
  clean.sort((a,b)=>Number(a.season || 0)-Number(b.season || 0) || String(a.competitionName || '').localeCompare(String(b.competitionName || ''), 'es', { sensitivity:'base' }));
  return clean;
}
function recordManagerOfficialTitleForState(targetGame, entry={}){
  if(!targetGame || !entry) return false;
  targetGame.managerStats = normalizeManagerStats(targetGame.managerStats || createInitialManagerStats());
  const stats = targetGame.managerStats;
  const season = Math.max(1, Math.round(Number(entry.season || targetGame.seasonNumber || 1)) || 1);
  const type = String(entry.type || 'league').trim() || 'league';
  const competitionId = String(entry.competitionId || entry.divisionId || `${type}-${season}`).trim();
  const key = `${season}:${type}:${competitionId}`;
  stats.titleHistory = normalizeManagerTitleHistory(stats.titleHistory || []);
  if(stats.titleHistory.some(item => item.key === key)) return false;
  const previousTitles = Math.max(0, Math.round(Number(stats.titles || 0)));
  stats.titleHistory.push({
    key,
    season,
    year:Math.round(Number(entry.year || targetGame.seasonYear || 0)) || seasonYearForNumber(season),
    type,
    competitionId,
    competitionName:String(entry.competitionName || entry.divisionName || competitionId),
    clubId:Number(entry.clubId || entry.championId || targetGame.selectedClubId || 0),
    clubName:String(entry.clubName || clubName(entry.clubId || entry.championId || targetGame.selectedClubId)),
    createdAt:String(entry.createdAt || new Date().toISOString())
  });
  stats.titleHistory = normalizeManagerTitleHistory(stats.titleHistory);
  stats.titles = Math.max(previousTitles + 1, stats.titleHistory.length);
  targetGame.managerStats = stats;
  return true;
}
function syncManagerOfficialTitles(targetGame=game){
  if(!targetGame) return false;
  targetGame.managerStats = normalizeManagerStats(targetGame.managerStats || createInitialManagerStats());
  const stats = targetGame.managerStats;
  let changed = false;
  (stats.seasons || []).filter(item => Boolean(item?.title) || Number(item?.position || 0) === 1).forEach(item => {
    if(recordManagerOfficialTitleForState(targetGame, {
      season:item.season,
      year:item.year,
      type:'league',
      competitionId:item.divisionId || `league-${item.season}`,
      competitionName:item.divisionName || 'Liga',
      clubId:item.clubId,
      clubName:item.clubName
    })) changed = true;
  });
  const managedBySeason = new Map();
  (targetGame.managerStats?.seasons || []).forEach(item => {
    const season = Number(item?.season || 0);
    const clubId = Number(item?.clubId || 0);
    if(season && clubId){
      if(!managedBySeason.has(season)) managedBySeason.set(season, new Set());
      managedBySeason.get(season).add(clubId);
    }
  });
  if(Number(targetGame.selectedClubId || 0)){
    const season = Number(targetGame.seasonNumber || 1);
    if(!managedBySeason.has(season)) managedBySeason.set(season, new Set());
    managedBySeason.get(season).add(Number(targetGame.selectedClubId));
  }
  const entries = normalizeCompetitionChampionsHistoryState(targetGame.competitionChampionsHistory || {}).entries || [];
  entries.filter(item => String(item.type || '') !== 'league').forEach(item => {
    const clubs = managedBySeason.get(Number(item.season || 0));
    if(!clubs || !clubs.has(Number(item.championId || 0))) return;
    if(recordManagerOfficialTitleForState(targetGame, {
      season:item.season,
      year:item.year,
      type:item.type || 'official_competition',
      competitionId:item.competitionId,
      competitionName:item.competitionName,
      clubId:item.championId,
      clubName:item.championName,
      createdAt:item.createdAt
    })) changed = true;
  });
  return changed;
}

function createInitialManagerStats(){
  return {
    totals:{ played:0, won:0, drawn:0, lost:0, gf:0, gc:0 },
    currentSeason:{ season:1, clubId:0, played:0, won:0, drawn:0, lost:0, gf:0, gc:0 },
    seasons:[],
    titles:0,
    titleHistory:[],
    experience:0,
    prestige:0,
    prestigeWinMilestones:0,
    prestigeAdjustments:[],
    objectivePrestigeAwards:[],
    careerHistory:[],
    achievements:{ unlocked:{}, lastCheckedDate:null }
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
  const seasons = Array.isArray(src.seasons) ? src.seasons : [];
  const legacyLeagueTitles = seasons.filter(item => Boolean(item?.title) || Number(item?.position || 0) === 1).map(item => ({
    season:Number(item?.season || 1),
    year:Number(item?.year || 0) || seasonYearForNumber(item?.season || 1),
    type:'league',
    competitionId:String(item?.divisionId || `league-${Number(item?.season || 1)}`),
    competitionName:String(item?.divisionName || 'Liga'),
    clubId:Number(item?.clubId || 0),
    clubName:String(item?.clubName || '')
  }));
  const titleHistory = normalizeManagerTitleHistory([...(Array.isArray(src.titleHistory) ? src.titleHistory : []), ...legacyLeagueTitles]);
  const normalized = {
    totals,
    currentSeason,
    seasons,
    titles:Math.max(Number.isFinite(Number(src.titles)) ? Number(src.titles) : 0, titleHistory.length, legacyLeagueTitles.length),
    titleHistory,
    experience,
    prestige:0,
    prestigeWinMilestones,
    prestigeAdjustments,
    objectivePrestigeAwards:Array.isArray(src.objectivePrestigeAwards) ? src.objectivePrestigeAwards : [],
    careerHistory:Array.isArray(src.careerHistory) ? src.careerHistory : [],
    achievements:normalizeManagerAchievementsState(src.achievements)
  };
  normalized.prestige = managerPrestigeBreakdown(normalized).total;
  return normalized;
}


const MANAGER_GLOBAL_PROFILE_STORAGE_KEY = 'futbolManager.managerProfileGlobal.v1';

function managerProfileStatsHasProgress(stats=null){
  const src = stats || {};
  const totals = src.totals || {};
  return Boolean(
    Number(src.experience || 0) > 0
    || Number(src.titles || 0) > 0
    || Number(totals.played || 0) > 0
    || (Array.isArray(src.seasons) && src.seasons.length > 0)
    || (Array.isArray(src.careerHistory) && src.careerHistory.length > 0)
    || (Array.isArray(src.prestigeAdjustments) && src.prestigeAdjustments.length > 0)
    || (src.achievements?.unlocked && Object.keys(src.achievements.unlocked || {}).length > 0)
  );
}
function normalizeManagerChallengeRewardsState(value=null){
  const raw = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const clean = {};
  Object.entries(raw).forEach(([id, item]) => {
    const key = String(id || '').trim();
    if(!key) return;
    const src = item && typeof item === 'object' && !Array.isArray(item) ? item : {};
    clean[key] = {
      completions:Math.max(0, Math.round(Number(src.completions || 0))),
      successfulCompletions:Math.max(0, Math.round(Number(src.successfulCompletions || 0))),
      rewardClaimed:Boolean(src.rewardClaimed),
      rewardAmount:Math.max(0, Math.round(Number(src.rewardAmount || 0))),
      rewardClaimedAt:src.rewardClaimedAt || null,
      lastCompletedAt:src.lastCompletedAt || null
    };
  });
  return clean;
}
function managerChallengeRewardRecord(challengeId=''){
  const id = String(challengeId || '').trim();
  if(!id) return null;
  const profile = readManagerGlobalProfileState();
  return profile?.challengeRewards?.[id] || null;
}
function managerChallengeRewardAlreadyClaimed(challengeId=''){
  return Boolean(managerChallengeRewardRecord(challengeId)?.rewardClaimed);
}
function recordManagerChallengeCompletion(challengeId='', options={}){
  const id = String(challengeId || '').trim();
  if(!id) return null;
  const profile = readManagerGlobalProfileState();
  const rewards = normalizeManagerChallengeRewardsState(profile?.challengeRewards);
  const previous = rewards[id] || { completions:0, successfulCompletions:0, rewardClaimed:false, rewardAmount:0, rewardClaimedAt:null, lastCompletedAt:null };
  const success = options.success === true;
  const rewardClaimedNow = options.rewardClaimed === true;
  rewards[id] = {
    completions:Math.max(0, Number(previous.completions || 0)) + 1,
    successfulCompletions:Math.max(0, Number(previous.successfulCompletions || 0)) + (success ? 1 : 0),
    rewardClaimed:Boolean(previous.rewardClaimed || rewardClaimedNow),
    rewardAmount:Math.max(Number(previous.rewardAmount || 0), Math.max(0, Math.round(Number(options.rewardAmount || 0)))),
    rewardClaimedAt:previous.rewardClaimedAt || (rewardClaimedNow ? new Date().toISOString() : null),
    lastCompletedAt:new Date().toISOString()
  };
  return writeManagerGlobalProfileState({ ...profile, challengeRewards:rewards });
}

function normalizeManagerGlobalProfile(profile=null){
  const raw = profile && typeof profile === 'object' && !Array.isArray(profile) ? profile : {};
  const stats = normalizeManagerStats(raw.managerStats || createInitialManagerStats());
  const skillPoints = Math.max(0, Math.round(Number(raw.skillPoints ?? raw.puntos_habilidad ?? raw.puntosHabilidad ?? 0)));
  const managerCourses = typeof normalizeManagerCoursesState === 'function'
    ? normalizeManagerCoursesState(raw.managerCourses || raw.cursosManager)
    : (raw.managerCourses || raw.cursosManager || null);
  const coursesProgress = typeof managerCoursesHasProgress === 'function' ? managerCoursesHasProgress(managerCourses) : Boolean(managerCourses);
  const empty = !managerProfileStatsHasProgress(stats) && skillPoints <= 0 && !raw.saveCode && !raw.managerName && !coursesProgress;
  return {
    version:'V7.60',
    managerName:String(raw.managerName || raw.nombre_manager || storedManagerName() || ''),
    saveCode:String(raw.saveCode || raw.manager_id || ''),
    managerStats:stats,
    skillPoints,
    challengeRewards:normalizeManagerChallengeRewardsState(raw.challengeRewards || raw.recompensasRetos),
    managerCourses,
    updatedAt:raw.updatedAt || null,
    empty
  };
}
function readManagerGlobalProfileState(){
  try{
    const raw = localStorage.getItem(MANAGER_GLOBAL_PROFILE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return normalizeManagerGlobalProfile(parsed);
  }catch(err){ console.warn('No se pudo leer el perfil global del manager.', err); }
  return normalizeManagerGlobalProfile(null);
}
function writeManagerGlobalProfileState(profile){
  try{
    const clean = normalizeManagerGlobalProfile(profile);
    clean.version = 'V7.60';
    clean.updatedAt = new Date().toISOString();
    clean.empty = false;
    localStorage.setItem(MANAGER_GLOBAL_PROFILE_STORAGE_KEY, JSON.stringify(clean));
    return clean;
  }catch(err){ console.warn('No se pudo guardar el perfil global del manager.', err); return null; }
}
function applySharedManagerProfileToGame(){
  if(!game) return { changed:false };
  const profile = readManagerGlobalProfileState();
  if(!profile || profile.empty) return { changed:false };
  const season = Math.max(1, Math.round(Number(game.seasonNumber || 1)));
  const clubId = Number(game.selectedClubId || 0);
  // no reemplazar managerStats por el perfil global.
  // managerStats contiene el prestigio de esta carrera/slot; si se pisa, el prestigio se comparte.
  const previousStats = normalizeManagerStats(game.managerStats || createInitialManagerStats());
  game.managerStats = ensureManagerCurrentSeasonStats(previousStats, season, clubId);
  const profileStats = normalizeManagerStats(profile.managerStats || createInitialManagerStats());
  game.managerSharedProfile = {
    version:'V7.60',
    experience:Math.max(0, Math.round(Number(profileStats.experience || 0))),
    careerHistory:Array.isArray(profileStats.careerHistory) ? profileStats.careerHistory.slice() : [],
    updatedAt:profile.updatedAt || null
  };
  if(profile.managerName && !game.rankingManagerName) game.rankingManagerName = profile.managerName;
  if(profile.saveCode && !game.saveCode) game.saveCode = profile.saveCode;
  if(typeof normalizeSpecialState === 'function'){
    game.special = normalizeSpecialState(game.special || createInitialSpecialState(game.rankingManagerName || profile.managerName || storedManagerName() || 'Manager'), game.rankingManagerName || profile.managerName || storedManagerName() || 'Manager');
  } else if(!game.special) {
    game.special = { puntos_habilidad:0, cartas_activas:[], cartas_reserva:[] };
  }
  if(game.special && typeof game.special === 'object'){
    game.special.puntos_habilidad = Math.max(0, Math.round(Number(profile.skillPoints || 0)));
    game.special.manager_id = String(game.saveCode || profile.saveCode || game.special.manager_id || '');
    game.special.nombre_manager = String(game.rankingManagerName || profile.managerName || game.special.nombre_manager || storedManagerName() || 'Manager');
  }
  return { changed:true, profile };
}
function persistSharedManagerProfileFromGame(){
  if(!game) return null;
  const stats = normalizeManagerStats(game.managerStats || createInitialManagerStats());
  let special = game.special;
  if(typeof ensureSpecialState === 'function') special = ensureSpecialState();
  const existingProfile = readManagerGlobalProfileState();
  const profile = {
    version:'V7.60',
    managerName:String(game.rankingManagerName || storedManagerName() || ''),
    saveCode:String(game.saveCode || ''),
    managerStats:stats,
    skillPoints:Math.max(0, Math.round(Number(special?.puntos_habilidad || 0))),
    challengeRewards:normalizeManagerChallengeRewardsState(existingProfile?.challengeRewards),
    managerCourses:typeof normalizeManagerCoursesState === 'function' ? normalizeManagerCoursesState(existingProfile?.managerCourses) : existingProfile?.managerCourses,
    updatedAt:new Date().toISOString()
  };
  return writeManagerGlobalProfileState(profile);
}

function managerGlobalProfileScore(profile=null){
  const clean = normalizeManagerGlobalProfile(profile);
  const stats = clean.managerStats || {};
  const totals = stats.totals || {};
  const completedCourses = typeof normalizeManagerCoursesState === 'function'
    ? Object.values(normalizeManagerCoursesState(clean.managerCourses).completed || {}).filter(Boolean).length
    : 0;
  return (Number(stats.experience || 0) * 1000)
    + (Number(totals.played || 0) * 25)
    + ((Array.isArray(stats.seasons) ? stats.seasons.length : 0) * 500)
    + ((Array.isArray(stats.careerHistory) ? stats.careerHistory.length : 0) * 200)
    + (Number(stats.titles || 0) * 1000)
    + (completedCourses * 100)
    + Number(clean.skillPoints || 0);
}
async function migrateAllSavedManagerProfilesToGlobal(){
  if(typeof readLocalSaveRecord !== 'function') return false;
  const candidates = [];
  const currentGlobal = readManagerGlobalProfileState();
  if(currentGlobal && !currentGlobal.empty) candidates.push(currentGlobal);
  const slotIds = [];
  if(typeof careerSaveSlotIds === 'function') slotIds.push(...careerSaveSlotIds());
  else slotIds.push(typeof SAVE_SLOT_CAREER !== 'undefined' ? SAVE_SLOT_CAREER : 'career:1');
  if(typeof SAVE_SLOT_CAMPO_DESTRUIDO !== 'undefined') slotIds.push(SAVE_SLOT_CAMPO_DESTRUIDO);
  for(const rawSlot of Array.from(new Set(slotIds))){
    const slotId = typeof normalizeSaveSlotId === 'function' ? normalizeSaveSlotId(rawSlot) : rawSlot;
    const record = await readLocalSaveRecord(slotId).catch(()=>null);
    if(!record || typeof record !== 'object') continue;
    const profile = normalizeManagerGlobalProfile({
      managerName:record.rankingManagerName || storedManagerName() || '',
      saveCode:record.saveCode || '',
      managerStats:record.managerStats || createInitialManagerStats(),
      skillPoints:Math.max(0, Math.round(Number(record.special?.puntos_habilidad || 0)))
    });
    if(!profile.empty) candidates.push(profile);
  }
  if(!candidates.length) return false;
  candidates.sort((a,b) => managerGlobalProfileScore(b) - managerGlobalProfileScore(a));
  const best = candidates[0];
  const currentScore = managerGlobalProfileScore(currentGlobal);
  if(currentGlobal && !currentGlobal.empty && currentScore >= managerGlobalProfileScore(best)) return false;
  writeManagerGlobalProfileState({
    ...best,
    challengeRewards:normalizeManagerChallengeRewardsState(currentGlobal?.challengeRewards),
    managerCourses:typeof normalizeManagerCoursesState === 'function'
      ? normalizeManagerCoursesState(currentGlobal?.managerCourses || best?.managerCourses)
      : (currentGlobal?.managerCourses || best?.managerCourses)
  });
  return true;
}

function normalizeManagerAchievementsState(state){
  const clean = state && typeof state === 'object' && !Array.isArray(state) ? state : {};
  const unlockedRaw = clean.unlocked && typeof clean.unlocked === 'object' && !Array.isArray(clean.unlocked) ? clean.unlocked : {};
  const unlocked = {};
  Object.entries(unlockedRaw).forEach(([id, item]) => {
    if(!id) return;
    unlocked[String(id)] = {
      id:String(id),
      unlockedAt:item?.unlockedAt || item?.date || null,
      season:Number(item?.season || 0),
      value:Number.isFinite(Number(item?.value)) ? Number(item.value) : 0
    };
  });
  return { unlocked, lastCheckedDate:clean.lastCheckedDate || null };
}
function managerAchievementsCatalog(){
  const db = managerAchievementsDatabase && typeof managerAchievementsDatabase === 'object' ? managerAchievementsDatabase : null;
  return Array.isArray(db?.hitos) ? db.hitos : [];
}
function managerAchievementCareerSummary(statsInput=null){
  const stats = normalizeManagerStats(statsInput || game?.managerStats || createInitialManagerStats());
  const seasons = Array.isArray(stats.seasons) ? stats.seasons : [];
  const career = Array.isArray(stats.careerHistory) ? stats.careerHistory : [];
  const titles = Array.isArray(stats.titleHistory) ? stats.titleHistory : [];
  const managedClubIds = new Set();
  seasons.forEach(item => { const id = Number(item?.clubId || 0); if(id) managedClubIds.add(id); });
  career.forEach(item => { const id = Number(item?.clubId || 0); if(id) managedClubIds.add(id); });
  const currentClubId = Number(game?.selectedClubId || 0);
  if(currentClubId) managedClubIds.add(currentClubId);

  const leagueTitles = titles.filter(item => String(item?.type || '') === 'league');
  const leagueClubIds = new Set();
  const leagueIds = new Set();
  const leagueCountries = new Set();
  const topDivisionCountries = new Set();
  leagueTitles.forEach(item => {
    const clubId = Number(item?.clubId || 0);
    if(clubId) leagueClubIds.add(clubId);
    const competitionId = String(item?.competitionId || '').trim();
    if(competitionId) leagueIds.add(competitionId);
    else if(item?.competitionName) leagueIds.add(String(item.competitionName).trim().toLowerCase());
    const club = (seed?.clubs || []).find(candidate => Number(candidate.id) === clubId);
    const division = (seed?.divisions || []).find(candidate => String(candidate.id || '') === competitionId);
    const country = String(division?.country || division?.pais || club?.country || club?.pais || '').trim();
    if(country) leagueCountries.add(country.toLowerCase());
    const divisionOrder = Number(division?.order || (String(club?.divisionId || '') === competitionId ? club?.divisionOrder : 0) || 0);
    if(country && divisionOrder === 1) topDivisionCountries.add(country.toLowerCase());
  });
  const clubWorldCupTitles = titles.filter(item => String(item?.type || '') === 'club_world_cup' || String(item?.competitionId || '') === 'club-world-cup').length;
  return {
    managedClubs:managedClubIds.size,
    dismissals:career.filter(item => String(item?.type || '') === 'dismissal').length,
    resignations:career.filter(item => String(item?.type || '') === 'resignation').length,
    leagueTitleClubs:leagueClubIds.size,
    leagueTitleLeagues:leagueIds.size,
    leagueTitleCountries:leagueCountries.size,
    topDivisionTitleCountries:topDivisionCountries.size,
    clubWorldCupTitles
  };
}
function managerAchievementMetricValue(metric){
  const stats = normalizeManagerStats(game?.managerStats || createInitialManagerStats());
  const totals = stats.totals || {};
  const seasons = Array.isArray(stats.seasons) ? stats.seasons : [];
  const key = String(metric || '');
  if(['managedClubs','dismissals','resignations','leagueTitleClubs','leagueTitleLeagues','leagueTitleCountries','topDivisionTitleCountries','clubWorldCupTitles'].includes(key)){
    return Number(managerAchievementCareerSummary(stats)[key] || 0);
  }
  if(key === 'totals.played') return Number(totals.played || 0);
  if(key === 'totals.won') return Number(totals.won || 0);
  if(key === 'totals.drawn') return Number(totals.drawn || 0);
  if(key === 'totals.lost') return Number(totals.lost || 0);
  if(key === 'totals.gf') return Number(totals.gf || 0);
  if(key === 'totals.gc') return Number(totals.gc || 0);
  if(key === 'goalDiff') return Number(totals.gf || 0) - Number(totals.gc || 0);
  if(key === 'titles') return Number(stats.titles || 0);
  if(key === 'experience') return Number(stats.experience || 0);
  if(key === 'prestige') return Number(stats.prestige || 0);
  if(key === 'seasonsCompleted') return seasons.length;
  if(key === 'objectivesAchieved') return seasons.filter(item => item?.objectiveAchieved === true).length;
  if(key === 'bestSeasonPpg') return seasons.reduce((max, item) => Math.max(max, Number(item.ppg || 0)), 0);
  if(key === 'bestSeasonPoints') return seasons.reduce((max, item) => Math.max(max, Number(item.pts || 0)), 0);
  if(key === 'currentBudget') return Math.max(0, Math.round(Number(game?.budget || 0)));
  if(key === 'stadiumCapacity') return typeof clubStadiumCapacity === 'function' ? clubStadiumCapacity(game?.selectedClubId) : 0;
  if(key === 'fans') return typeof clubFansCurrent === 'function' ? clubFansCurrent(game?.selectedClubId) : 0;
  if(key === 'skillPoints') return Math.max(0, Math.round(Number(game?.special?.puntos_habilidad || 0)));
  if(key === 'activeSpecialCards') return Array.isArray(game?.special?.activeCards) ? game.special.activeCards.length : 0;
  if(key === 'savedScoutingReports') return game?.scoutingCenter?.reports && typeof game.scoutingCenter.reports === 'object' ? Object.keys(game.scoutingCenter.reports).length : 0;
  if(key === 'archivedScoutingReports'){
    const listed = new Set(Array.isArray(game?.scoutingCenter?.listedPlayerIds) ? game.scoutingCenter.listedPlayerIds.map(Number) : []);
    return game?.scoutingCenter?.reports && typeof game.scoutingCenter.reports === 'object' ? Object.keys(game.scoutingCenter.reports).filter(id => !listed.has(Number(id))).length : 0;
  }
  if(key === 'scoutedTeams') return game?.scoutingCenter?.teamReports && typeof game.scoutingCenter.teamReports === 'object' ? Object.keys(game.scoutingCenter.teamReports).length : 0;
  if(key === 'academyPlayers') return Array.isArray(game?.academy?.players) ? game.academy.players.length : 0;
  if(key === 'employeesCount') return ['psychologist','kinesiologist','youthPreparer'].filter(key => game?.employees?.[key]).length;
  return 0;
}
function checkManagerAchievements(options={}){
  if(!game?.managerStats) return [];
  game.managerStats = normalizeManagerStats(game.managerStats);
  const state = game.managerStats.achievements || normalizeManagerAchievementsState();
  const catalog = managerAchievementsCatalog();
  const unlockedNow = [];
  catalog.forEach(item => {
    const id = String(item.id || '');
    if(!id || state.unlocked[id]) return;
    const value = managerAchievementMetricValue(item.metrica);
    const target = Number(item.objetivo || 0);
    if(Number(value) >= target){
      state.unlocked[id] = { id, unlockedAt:currentCalendarDate(), season:Number(game.seasonNumber || 1), value:Number(value || 0) };
      unlockedNow.push({ ...item, value:Number(value || 0) });
    }
  });
  state.lastCheckedDate = currentCalendarDate();
  game.managerStats.achievements = state;
  if(unlockedNow.length && options.silent !== true){
    const first = unlockedNow[0];
    pushGameMessage({ type:'asistente', priority:'normal', title:'Nuevo hito desbloqueado', body:`${first.titulo}${unlockedNow.length > 1 ? ` y ${unlockedNow.length - 1} hito(s) más` : ''}. Revisalo en Tus estadísticas.`, id:`manager-achievement-${game.seasonNumber || 1}-${game.globalTurn || 0}-${first.id}` });
  }
  return unlockedNow;
}
function managerUnlockedAchievements(){
  if(!game?.managerStats) return [];
  game.managerStats = normalizeManagerStats(game.managerStats);
  checkManagerAchievements({ silent:true });
  const state = game.managerStats.achievements || normalizeManagerAchievementsState();
  const catalog = managerAchievementsCatalog();
  return catalog
    .filter(item => state.unlocked?.[String(item.id || '')])
    .map(item => ({ ...item, unlocked:state.unlocked[String(item.id || '')] }))
    .sort((a,b)=>String(b.unlocked?.unlockedAt || '').localeCompare(String(a.unlocked?.unlockedAt || '')) || String(a.categoria || '').localeCompare(String(b.categoria || '')));
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
function managerBalanceObjectiveConfig(){
  return (window.GAME_BALANCE_MANAGER && window.GAME_BALANCE_MANAGER.objetivos) ? window.GAME_BALANCE_MANAGER.objetivos : {};
}
function normalizeObjectiveText(value=''){
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
function managerObjectiveDivisionKey(order=3){
  const value = Math.round(Number(order || 3));
  if(value <= 1) return 'primera';
  if(value === 2) return 'segunda';
  return 'tercera';
}
function managerObjectiveLeagueClubs(clubId){
  const targetClubId = Number(clubId || game?.selectedClubId || 0);
  const club = seed?.clubs?.find(c => Number(c.id) === targetClubId);
  if(!club) return [];
  const divisionId = String(club.divisionId || 'default');
  return (seed?.clubs || []).filter(item => String(item.divisionId || 'default') === divisionId);
}
function managerObjectiveAverageLeaguePrestige(clubId){
  const clubs = managerObjectiveLeagueClubs(clubId);
  if(!clubs.length) return clubPrestigeValue(clubId);
  const total = clubs.reduce((sum, item) => sum + clubPrestigeValue(item), 0);
  return total / clubs.length;
}
function managerObjectiveEntryForValue(list=[], value=0){
  const n = Number(value || 0);
  const items = Array.isArray(list) ? list : [];
  const deltaRule = items.find(item => Number.isFinite(Number(item.minDelta)) && n >= Number(item.minDelta));
  if(deltaRule) return deltaRule;
  return items.find(item => n >= Number(item.min ?? -999) && n <= Number(item.max ?? 999)) || null;
}
function managerObjectiveBaseValueForDivision(division={}, clubId=0){
  const cfg = managerBalanceObjectiveConfig();
  const bases = cfg.basesPorDivision || {};
  const order = Math.round(Number(division?.order || 3));
  if(order <= 1){
    const club = seed?.clubs?.find(c => Number(c.id) === Number(clubId || game?.selectedClubId || 0));
    const country = normalizeObjectiveText(division?.country || division?.pais || clubCountry(club));
    const strongCountries = Array.isArray(cfg.paisesPrimeraFuerte) ? cfg.paisesPrimeraFuerte.map(normalizeObjectiveText) : [];
    return Number(strongCountries.includes(country) ? (bases.primeraFuerte ?? 1.25) : (bases.primeraMedia ?? 1.20));
  }
  if(order === 2) return Number(bases.segunda ?? 1.05);
  return Number(bases.tercera ?? 0.90);
}
function managerObjectiveLimitsForDivision(division={}){
  const cfg = managerBalanceObjectiveConfig();
  const key = managerObjectiveDivisionKey(division?.order || 3);
  const limits = (cfg.limitesPorDivision || {})[key] || {};
  const fallback = key === 'primera' ? { min:0.95, max:2.10 } : key === 'segunda' ? { min:0.80, max:2.00 } : { min:0.70, max:1.90 };
  return {
    min:Number.isFinite(Number(limits.min)) ? Number(limits.min) : fallback.min,
    max:Number.isFinite(Number(limits.max)) ? Number(limits.max) : fallback.max
  };
}
function managerObjectiveBreakdownForClubDivision(clubId){
  const targetClubId = clubId || game?.selectedClubId;
  if(isFoundedClubId(targetClubId)) return { active:false, objective:null, reason:'fundador' };
  const cfg = managerBalanceObjectiveConfig();
  const division = clubDivision(targetClubId);
  const manualAllowed = cfg.respetarObjetivoManualConfig !== false;
  if(manualAllowed && Number.isFinite(Number(MANAGER_OBJECTIVE_PPG)) && Number(MANAGER_OBJECTIVE_PPG) >= 0.3 && Number(MANAGER_OBJECTIVE_PPG) <= 2){
    const limits = managerObjectiveLimitsForDivision(division);
    const manualObjective = clamp(Number(MANAGER_OBJECTIVE_PPG), limits.min, limits.max);
    return {
      active:true,
      source:'manual',
      objective:Number(manualObjective.toFixed(3)),
      basePpg:Number(manualObjective.toFixed(3)),
      modifierPpg:0,
      prestige:clubPrestigeValue(targetClubId),
      leagueAveragePrestige:managerObjectiveAverageLeaguePrestige(targetClubId),
      prestigeRelative:0,
      expectation:'Objetivo manual',
      divisionKey:managerObjectiveDivisionKey(division?.order || 3),
      minLimit:limits.min,
      maxLimit:limits.max
    };
  }
  if(cfg.activo === false || cfg.usarPrestigioRelativo === false){
    const order = Math.round(Number(division?.order || 3));
    const legacy = order <= 1 ? Number(MANAGER_OBJECTIVE_DIVISION_1 || 1.4) : order === 2 ? Number(MANAGER_OBJECTIVE_DIVISION_2 || 1.1) : Number(MANAGER_OBJECTIVE_DIVISION_3 || 0.9);
    return { active:true, source:'legacy', objective:Number(legacy.toFixed(3)), basePpg:Number(legacy.toFixed(3)), modifierPpg:0, prestige:clubPrestigeValue(targetClubId), leagueAveragePrestige:managerObjectiveAverageLeaguePrestige(targetClubId), prestigeRelative:0, expectation:'Objetivo por división', divisionKey:managerObjectiveDivisionKey(division?.order || 3) };
  }
  const prestige = clubPrestigeValue(targetClubId);
  const avg = managerObjectiveAverageLeaguePrestige(targetClubId);
  const relative = Math.round(prestige - avg);
  const base = managerObjectiveBaseValueForDivision(division, targetClubId);
  const modEntry = managerObjectiveEntryForValue(cfg.modificadoresPrestigioRelativo, relative);
  const modifier = Number(modEntry?.ppg || 0);
  const limits = managerObjectiveLimitsForDivision(division);
  const raw = base + modifier;
  const objective = clamp(raw, limits.min, limits.max);
  const expectationEntry = managerObjectiveEntryForValue(cfg.expectativasPrestigioRelativo, relative);
  return {
    active:true,
    source:'prestigio_relativo',
    objective:Number(objective.toFixed(3)),
    basePpg:Number(base.toFixed(3)),
    modifierPpg:Number(modifier.toFixed(3)),
    rawPpg:Number(raw.toFixed(3)),
    prestige,
    leagueAveragePrestige:Number(avg.toFixed(2)),
    prestigeRelative:relative,
    expectation:expectationEntry?.texto || 'Mitad de tabla',
    divisionKey:managerObjectiveDivisionKey(division?.order || 3),
    minLimit:limits.min,
    maxLimit:limits.max
  };
}
function managerObjectiveBaseForClubDivision(clubId){
  const info = managerObjectiveBreakdownForClubDivision(clubId);
  return Number.isFinite(Number(info?.objective)) ? Number(Number(info.objective).toFixed(3)) : null;
}
function managerObjectiveReductionForClub(clubId){
  const targetClubId = clubId || game?.selectedClubId;
  if(Number(targetClubId) === Number(game?.selectedClubId || 0) && typeof specialActiveBonus === 'function'){
    return clamp(Number(specialActiveBonus('objetivo_mas_bajo') || 0), 0, 80);
  }
  return 0;
}
function applyManagerObjectiveReduction(baseObjective, clubId){
  const base = Number(baseObjective);
  if(!Number.isFinite(base)) return null;
  const reduction = managerObjectiveReductionForClub(clubId);
  const objective = reduction > 0 ? base * (1 - reduction / 100) : base;
  return Number(objective.toFixed(3));
}
function managerObjectiveForClubDivision(clubId){
  return applyManagerObjectiveReduction(managerObjectiveBaseForClubDivision(clubId), clubId);
}
function managerObjectiveMinMatchesForObjective(objective){
  const cfg = managerBalanceObjectiveConfig();
  const rules = Array.isArray(cfg.partidosMinimosEvaluacion) ? cfg.partidosMinimosEvaluacion : [];
  const value = Number(objective || 0);
  const rule = rules.find(item => value <= Number(item.maxObjetivo ?? 9.99));
  if(rule && Number.isFinite(Number(rule.partidos))) return Math.max(1, Math.round(Number(rule.partidos)));
  return Math.max(1, Number(MANAGER_OBJECTIVE_MIN_MATCHES || 5));
}
function bankruptcyFirstSeasonObjectiveActive(season=game?.seasonNumber || 1, clubId=game?.selectedClubId || 0){
  return currentGameIsBankruptcyMode() && Number(season || 1) === 1 && Number(clubId || 0) === Number(game?.selectedClubId || 0);
}
function buildBankruptcyFirstSeasonObjectiveFields(stats, season=game?.seasonNumber || 1, clubId=game?.selectedClubId || 0){
  const normalized = normalizeManagerStats(stats);
  const generalPpg = ppgFromTotals(normalized.totals || {});
  const division = clubDivision(clubId);
  const limits = managerObjectiveLimitsForDivision(division);
  const objective = Number(Number(limits.min || 0.8).toFixed(3));
  const baseMatches = managerObjectiveMinMatchesForObjective(objective);
  return {
    objectiveBasePpg:objective,
    objectivePpg:objective,
    objectiveBonusReduction:0,
    objectiveBaseMatches:baseMatches,
    objectiveExtraMatches:0,
    objectiveMinMatches:baseMatches,
    objectiveGeneralPpgAtStart:generalPpg,
    objectiveSeason:Number(season || 1),
    objectiveClubId:Number(clubId || 0),
    objectiveSource:'bancarrota',
    objectiveExpectation:'No descender',
    objectiveLabel:'No descender',
    objectiveFixed:true,
    objectivePrestigeRelative:null,
    objectiveClubPrestige:clubPrestigeValue(clubId),
    objectiveLeagueAveragePrestige:Number(managerObjectiveAverageLeaguePrestige(clubId).toFixed(2)),
    objectiveModifierPpg:0,
    objectiveDivisionKey:managerObjectiveDivisionKey(division?.order || 3)
  };
}
function managerObjectiveResultDelta(ppg, objective){
  const a = Number(ppg || 0);
  const b = Number(objective || 0);
  return Number.isFinite(a) && Number.isFinite(b) ? Number((a - b).toFixed(3)) : 0;
}
function managerObjectiveBoardState(delta){
  const cfg = managerBalanceObjectiveConfig();
  const entry = managerObjectiveEntryForValue(cfg.estadosDirectiva, Number(delta || 0));
  return entry || { estado:'Cumple', clase:'ok', despido:false };
}
function managerObjectivePrestigeRewardForDelta(delta){
  const cfg = managerBalanceObjectiveConfig();
  const entry = managerObjectiveEntryForValue(cfg.prestigioPorResultado, Number(delta || 0));
  if(!entry) return { points:0, label:'Sin ajuste por objetivo' };
  return { points:Math.round(Number(entry.puntos || 0)), label:String(entry.etiqueta || 'Resultado de objetivo') };
}
function managerObjectiveBadSeasonPenalty({ relegated=false, last=false }={}){
  const cfg = managerBalanceObjectiveConfig();
  const penalties = cfg.penalizacionesTemporada || {};
  const raw = (relegated ? Number(penalties.descenso ?? -8) : 0) + (last ? Number(penalties.ultimoPuestoAdicional ?? -5) : 0);
  return Math.max(0, Math.abs(Math.round(raw)));
}
function buildManagerObjectiveSeasonFields(stats, season=game?.seasonNumber || 1, clubId=game?.selectedClubId || 0){
  if(bankruptcyFirstSeasonObjectiveActive(season, clubId)) return buildBankruptcyFirstSeasonObjectiveFields(stats, season, clubId);
  const normalized = normalizeManagerStats(stats);
  const generalPpg = ppgFromTotals(normalized.totals || {});
  const dynamicInfo = managerObjectiveBreakdownForClubDivision(clubId);
  const baseObjective = Number.isFinite(Number(dynamicInfo?.objective)) ? Number(dynamicInfo.objective) : managerObjectiveBaseForClubDivision(clubId);
  const objective = applyManagerObjectiveReduction(baseObjective, clubId);
  const baseMatches = managerObjectiveMinMatchesForObjective(objective);
  const extraMatches = 0;
  const fields = {
    objectiveBasePpg:Number.isFinite(Number(baseObjective)) ? Number(baseObjective) : null,
    objectivePpg:Number.isFinite(Number(objective)) ? objective : null,
    objectiveBonusReduction:managerObjectiveReductionForClub(clubId),
    objectiveBaseMatches:baseMatches,
    objectiveExtraMatches:extraMatches,
    objectiveMinMatches:baseMatches + extraMatches,
    objectiveGeneralPpgAtStart:generalPpg,
    objectiveSeason:Number(season || 1),
    objectiveClubId:Number(clubId || 0),
    objectiveSource:dynamicInfo?.source || 'division',
    objectiveExpectation:dynamicInfo?.expectation || '',
    objectivePrestigeRelative:Number.isFinite(Number(dynamicInfo?.prestigeRelative)) ? Number(dynamicInfo.prestigeRelative) : null,
    objectiveClubPrestige:Number.isFinite(Number(dynamicInfo?.prestige)) ? Number(dynamicInfo.prestige) : null,
    objectiveLeagueAveragePrestige:Number.isFinite(Number(dynamicInfo?.leagueAveragePrestige)) ? Number(dynamicInfo.leagueAveragePrestige) : null,
    objectiveModifierPpg:Number.isFinite(Number(dynamicInfo?.modifierPpg)) ? Number(dynamicInfo.modifierPpg) : 0,
    objectiveDivisionKey:dynamicInfo?.divisionKey || ''
  };
  return typeof applyManagerJobContractToObjectiveFields === 'function' ? applyManagerJobContractToObjectiveFields(fields, clubId, season) : fields;
}
function applyManagerObjectiveSeasonFields(current, stats, season=game?.seasonNumber || 1, clubId=game?.selectedClubId || 0){
  const clean = { ...(current || {}) };
  if(bankruptcyFirstSeasonObjectiveActive(season, clubId)){
    Object.assign(clean, buildBankruptcyFirstSeasonObjectiveFields(stats, season, clubId));
    return clean;
  }
  const needsRefresh = !MANAGER_OBJECTIVE_FREEZE_BY_SEASON
    || !Number.isFinite(Number(clean.objectiveMinMatches || 0))
    || !Number.isFinite(Number(clean.objectivePpg || 0))
    || Number(clean.objectiveSeason || 0) !== Number(season || 1)
    || Number(clean.objectiveClubId || 0) !== Number(clubId || 0);
  if(needsRefresh){
    Object.assign(clean, buildManagerObjectiveSeasonFields(stats, season, clubId));
  } else {
    const dynamicInfo = managerObjectiveBreakdownForClubDivision(clubId);
    const baseObjective = Number.isFinite(Number(clean.objectiveBasePpg)) ? Number(clean.objectiveBasePpg) : managerObjectiveBaseForClubDivision(clubId);
    clean.objectiveBasePpg = Number.isFinite(Number(baseObjective)) ? Number(baseObjective) : null;
    clean.objectiveBonusReduction = managerObjectiveReductionForClub(clubId);
    clean.objectivePpg = applyManagerObjectiveReduction(clean.objectiveBasePpg, clubId);
    clean.objectiveExpectation = clean.objectiveExpectation || dynamicInfo?.expectation || '';
    clean.objectivePrestigeRelative = Number.isFinite(Number(clean.objectivePrestigeRelative)) ? Number(clean.objectivePrestigeRelative) : (Number.isFinite(Number(dynamicInfo?.prestigeRelative)) ? Number(dynamicInfo.prestigeRelative) : null);
    clean.objectiveClubPrestige = Number.isFinite(Number(clean.objectiveClubPrestige)) ? Number(clean.objectiveClubPrestige) : (Number.isFinite(Number(dynamicInfo?.prestige)) ? Number(dynamicInfo.prestige) : null);
    clean.objectiveLeagueAveragePrestige = Number.isFinite(Number(clean.objectiveLeagueAveragePrestige)) ? Number(clean.objectiveLeagueAveragePrestige) : (Number.isFinite(Number(dynamicInfo?.leagueAveragePrestige)) ? Number(dynamicInfo.leagueAveragePrestige) : null);
    clean.objectiveModifierPpg = Number.isFinite(Number(clean.objectiveModifierPpg)) ? Number(clean.objectiveModifierPpg) : (Number.isFinite(Number(dynamicInfo?.modifierPpg)) ? Number(dynamicInfo.modifierPpg) : 0);
    clean.objectiveSource = clean.objectiveSource || dynamicInfo?.source || 'division';
  }
  return typeof applyManagerJobContractToObjectiveFields === 'function' ? applyManagerJobContractToObjectiveFields(clean, clubId, season) : clean;
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
  if(currentGameIsFounderMode()) return false;
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
  const delta = objective !== null ? managerObjectiveResultDelta(ppg, objective) : 0;
  const boardState = managerObjectiveBoardState(delta);
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
    delta,
    boardState:boardState.estado,
    boardClass:boardState.clase,
    expectation:seasonTotals.objectiveExpectation || '',
    label:seasonTotals.objectiveLabel || '',
    prestigeRelative:seasonTotals.objectivePrestigeRelative,
    clubPrestige:seasonTotals.objectiveClubPrestige,
    leagueAveragePrestige:seasonTotals.objectiveLeagueAveragePrestige,
    modifierPpg:seasonTotals.objectiveModifierPpg,
    remainingMatches:Math.max(0, minMatches - played),
    failed:objective !== null && played >= minMatches && Boolean(boardState.despido)
  };
}

function queueAutomaticRankingSubmission(eventType='season_end'){
  if(!game) return false;
  game.rankingUploads = game.rankingUploads && typeof game.rankingUploads === 'object' && !Array.isArray(game.rankingUploads) ? game.rankingUploads : {};
  const capturedPayload = String(eventType || '') === 'dismissal' && game?.gameOver?.snapshot
    ? { ...game.gameOver.snapshot, eventType:'dismissal', eventLabel:'Carrera cerrada por despido', submittedAt:new Date().toISOString() }
    : null;
  const run = () => {
    if(typeof submitRankingAutomatically === 'function'){
      submitRankingAutomatically(eventType, { notifyErrors:true, forceRetry:true, payload:capturedPayload });
    }else if(typeof pushGameMessage === 'function'){
      pushGameMessage({ type:'sistema', priority:'normal', title:'Ranking pendiente', body:'El módulo de ranking no estaba listo. Volvé a abrir la partida o la pantalla Ranking para reintentar el envío automático.', id:`ranking-module-missing-${eventType}-${game.seasonNumber || 1}` });
      if(typeof saveLocal === 'function') saveLocal(true);
    }
  };
  setTimeout(run, 0);
  setTimeout(run, 5000);
  return true;
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
  if(typeof managerChallengeIs === 'function' && managerChallengeIs()) return false;
  if(!game || game.gameOver?.active || !managerObjectiveIsActive()) return false;
  const info = managerObjectiveProgressInfo();
  if(!info.failed) return false;
  game.gameOver = {
    active:true,
    type:'dismissal',
    reason:`La directiva perdió confianza: promedio ${info.ppg.toFixed(2)} / objetivo ${info.objective.toFixed(2)} (${info.delta.toFixed(2)}) tras ${info.played} partidos oficiales de la temporada.`,
    triggeredAt:new Date().toISOString(),
    objective:info.objective,
    ppg:info.ppg,
    matches:info.played,
    snapshot:gameOverSnapshot()
  };
  game.mustReviewTactics = false;
  if(typeof archiveManagerPlayerStatsClub === 'function') archiveManagerPlayerStatsClub(game.selectedClubId, { final:true });
  if(typeof clearScoutedSigningChances === 'function') clearScoutedSigningChances();
  prepareManagerWithoutClubUi('dismissal');
  recordDismissedCareerStep();
  if(typeof resetOutgoingClubStateAfterManagerExit === 'function') resetOutgoingClubStateAfterManagerExit(game.selectedClubId, 'dismissal');
  pushGameMessage({ type:'directiva', priority:'high', title:'Despido del manager', body:`La directiva decidió terminar el ciclo por falta de resultados y pérdida de confianza. El despido resta ${MANAGER_PRESTIGE_DISMISSAL_PENALTY} puntos de prestigio. Podés buscar otro club sin reiniciar el mundo de la partida.`, id:`dismissal-${game.seasonNumber || 1}-${game.selectedClubId}-${info.played}` });
  queueAutomaticRankingSubmission('dismissal');
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
  if(typeof checkManagerAchievements === 'function') checkManagerAchievements({ silent:false });
}
function resetClubSpecificCareerStateForNewClub(newClubId){
  if(!game) return;
  game.staffActions = {};
  game.staffContracts = {};
  if(typeof resetScoutingCenterForNewClub === 'function') resetScoutingCenterForNewClub(newClubId);
  game.monthlyExpenses = {};
  if(typeof createInitialAcademyState === 'function'){
    game.academy = createInitialAcademyState();
  }else{
    game.academy = { players:[], scoutingJobs:[], unlockedStats:{}, trainingPlan:{}, youthPreparer:null, lastConsultTurn:null, lastArrivalTurn:null, lastConsultReveal:null, exceptionalYouthGrantedSeason:null, residences:0, residenceLastChargeDate:null, youthInjurySeason:null, youthInjuriesTarget:null, youthInjuriesCount:0 };
  }
  game.lastOwnPlayerOffer = null;
  game.pendingTransfers = [];
  game.rejectedPurchaseOffers = {};
  game.rejectedFreeAgentOffers = {};
  game.specialClauseOffers = null;
  if(typeof createBankLoanState === 'function'){
    game.bankLoan = createBankLoanState(game.seasonNumber || 1);
  }else{
    game.bankLoan = null;
  }
  if(typeof createInitialSponsorState === 'function'){
    game.sponsors = createInitialSponsorState();
  }else if(typeof normalizeSponsorState === 'function'){
    game.sponsors = normalizeSponsorState({});
  }else{
    game.sponsors = {};
  }
  game.playerMentalities = {};
  if(game.tactic){
    game.tactic = typeof applyStarterMentalities === 'function' ? applyStarterMentalities({ ...game.tactic, playerMentalities:{} }) : { ...game.tactic, playerMentalities:{} };
  }
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
  if(typeof archiveManagerPlayerStatsClub === 'function') archiveManagerPlayerStatsClub(game.selectedClubId, { final:true });
  if(typeof clearScoutedSigningChances === 'function') clearScoutedSigningChances();
  prepareManagerWithoutClubUi('resignation');
  recordDismissedCareerStep();
  if(typeof resetOutgoingClubStateAfterManagerExit === 'function') resetOutgoingClubStateAfterManagerExit(game.selectedClubId, 'resignation');
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
  const canSignNormally = managerCanSelectClub(newClub, currentManagerPrestige());
  const highRiskOffer = options.jobOffer && String(options.jobOffer.contractType || '') === 'high_risk';
  if(!canSignNormally && !(options.allowHighRiskContract && highRiskOffer)){
    showNotice(`Ese club requiere prestigio ${clubPrestigeValue(newClub)}. Tu prestigio actual es ${formatManagerPrestige(currentManagerPrestige())}.`);
    return;
  }
  ensureClubBudgetsState();
  recordDismissedCareerStep();
  game.clubBudgets[game.selectedClubId] = Math.round(Number(game.budget || 0));
  game.selectedClubId = Number(newClub.id);
  game.selectedCountry = clubCountry(newClub);
  game.selectedLeagueId = newClub.divisionId || 'default';
  const newClubSpecialReset = typeof resetActiveSpecialCardsToReserveForNewClub === 'function' ? resetActiveSpecialCardsToReserveForNewClub({ reason:'new_job' }) : null;
  game.budget = budgetForCareerClub(newClub.id);
  game.seasonInitialBudget = Math.round(Number(game.budget || 0));
  game.lastBudgetDelta = 0;
  game.tactic = normalizeTactic(newClub.id, DEFAULT_TACTIC);
  game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber || 1, newClub.id);
  game.transferBudget = typeof createTransferBudgetState === 'function' ? createTransferBudgetState(newClub.id, game.seasonNumber || 1, 0) : game.transferBudget;
  resetClubSpecificCareerStateForNewClub(newClub.id);
  if(highRiskOffer){
    game.managerJobContract = {
      clubId:Number(newClub.id),
      season:Number(game.seasonNumber || 1),
      contractType:'high_risk',
      signedDate:game.currentDate || '',
      objectiveBonus:Number(options.jobOffer.objectiveBonus || 0.25),
      transferBudgetRate:Number(options.jobOffer.transferBudgetRate || 0.05),
      source:String(options.jobOffer.source || 'application')
    };
    if(game.transferBudget && typeof game.transferBudget === 'object'){
      game.transferBudget.baseRate = Math.min(Number(game.transferBudget.baseRate || 1), Number(game.managerJobContract.transferBudgetRate || 0.05));
      game.transferBudget.unlockedRate = 0;
      game.transferBudget.history = Array.isArray(game.transferBudget.history) ? game.transferBudget.history : [];
      game.transferBudget.history.push({ type:'job_restriction', text:'Contrato exigente: presupuesto de fichajes muy restringido', amount:0, rate:game.transferBudget.baseRate, date:game.currentDate || '' });
    }
  }else{
    game.managerJobContract = null;
  }
  game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber || 1, newClub.id);
  if(typeof checkManagerAchievements === 'function') checkManagerAchievements({ silent:false });
  if(typeof removeManagerJobOffer === 'function' && options.jobOffer?.id) removeManagerJobOffer(options.jobOffer.id);
  if(game.managerJobMarket){ game.managerJobMarket.applications = []; }
  game.gameOver = null;
  game.mustReviewTactics = true;
  activeTab = 'home';
  closeModal();
  const specialResetText = newClubSpecialReset?.returned ? ` ${newClubSpecialReset.returned} carta(s) activa(s) volvieron a la reserva.` : '';
  pushGameMessage({ type:'directiva', priority:'high', title:'Nuevo cargo aceptado', body: highRiskOffer ? `Firmaste con ${newClub.name} con contrato exigente: objetivo superior al normal y fichajes muy restringidos. La partida continúa desde la misma temporada.${specialResetText}` : `Firmaste con ${newClub.name}. La partida continúa desde la misma temporada. Se reiniciaron empleados, academia, acciones de staff, sponsors, préstamos y cooldowns vinculados al club anterior.${specialResetText}`, id:`new-job-${game.seasonNumber || 1}-${newClub.id}-${game.globalTurn || 0}` });
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
  if(typeof processSponsorSpecialAfterOwnMatch === 'function') processSponsorSpecialAfterOwnMatch(match);
  if(typeof managerChallengeAfterOwnMatch === 'function') managerChallengeAfterOwnMatch(match);
  if(currentGameIsFounderMode()) evaluateFounderGoals({ silent:false });
  checkManagerAchievements({ silent:false });
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
    if(typeof isSpecialCompetitionOnlyClub === 'function' && isSpecialCompetitionOnlyClub(club)) return;
    const override = overrides[club.id];
    const currentDivision = byId[club.divisionId] || divisions.find(d => d.name === club.divisionName);
    let division = currentDivision || null;
    if(override){
      division = byId[override.divisionId] || divisions.find(d => d.name === override.divisionName) || division;
    }
    const clubCountry = clubCountryKeyForIntegrity(club);
    const divisionCountry = division ? divisionCountryKey(division) : '';
    if(!division || (clubCountry && divisionCountry && clubCountry !== divisionCountry)){
      division = nativeTargetDivisionForClub(club, currentDivision || division);
    }
    if(!division) return;
    setClubIntegrityDivision(club, division);
  });
}
function sanitizeClubDivisionOverrides(overrides={}){
  if(!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) return {};
  return Object.fromEntries(Object.entries(overrides).filter(([clubId]) => {
    const club = (seed?.clubs || []).find(item => Number(item.id) === Number(clubId));
    return !(club && isSpecialCompetitionOnlyClub(club));
  }));
}
function snapshotClubDivisionOverrides(){
  return Object.fromEntries((seed.clubs || [])
    .filter(club => !isSpecialCompetitionOnlyClub(club))
    .map(club => [club.id, { divisionId:club.divisionId || 'default', divisionName:club.divisionName || 'Liga única' }]));
}
function playoffRoundMatchdayLabel(index){
  const regularCount = regularFixtureLength();
  const relative = Number(index || 0) - regularCount;
  if(relative === 1) return 'Playoffs IDA';
  if(relative === 2) return 'Playoffs VUELTA';
  return Number(index || 0) > regularCount ? `Playoffs ${relative}` : `Fecha ${Number(index || 0)}`;
}
function isPromotionPlayoffMatch(match){
  return Boolean(match?.playoff || match?.promotionPlayoff || match?.playoffTieId);
}
function isPromotionPlayoffRound(round){
  return Boolean(round?.playoffRound || (round?.matches || []).some(isPromotionPlayoffMatch));
}
function isClubWorldCupRound(round){
  return Boolean(round?.clubWorldCupRound || (round?.matches || []).some(match => match?.clubWorldCup));
}
function isPostRegularRound(round){
  return isPromotionPlayoffRound(round) || isClubWorldCupRound(round);
}
function regularFixtureLength(fixtures=game?.fixtures || []){
  const list = Array.isArray(fixtures) ? fixtures : [];
  const firstPostRegularIndex = list.findIndex(isPostRegularRound);
  return firstPostRegularIndex >= 0 ? firstPostRegularIndex : list.length;
}
function argentinaDivisions(){
  return divisionOrderList().filter(division => normalizeScheduleText(division.country || '') === 'argentina').sort((a,b)=>(a.order || 0)-(b.order || 0));
}
function argentinaDivisionByOrder(order){
  return argentinaDivisions().find(division => Number(division.order || 0) === Number(order));
}
function standingAtPosition(divisionId, position){
  const table = sortedStandings(divisionId);
  return table[Math.max(0, Number(position || 1) - 1)] || null;
}
function movementRecord(type, clubId, fromDivision, toDivision, reason=''){
  return {
    type,
    clubId:Number(clubId),
    fromDivisionId:fromDivision?.id,
    fromDivisionName:fromDivision?.name || '',
    toDivisionId:toDivision?.id,
    toDivisionName:toDivision?.name || '',
    reason
  };
}
function addUniqueMovement(list, movement){
  if(!movement?.clubId || !movement.fromDivisionId || !movement.toDivisionId) return;
  if(String(movement.fromDivisionId) === String(movement.toDivisionId)) return;
  const key = `${movement.clubId}-${movement.fromDivisionId}-${movement.toDivisionId}`;
  if(list.some(item => `${item.clubId}-${item.fromDivisionId}-${item.toDivisionId}` === key)) return;
  list.push(movement);
}
function createArgentinePlayoffTie(id, upperDivision, lowerDivision, upperPosition, lowerPosition){
  const upperRow = standingAtPosition(upperDivision?.id, upperPosition);
  const lowerRow = standingAtPosition(lowerDivision?.id, lowerPosition);
  if(!upperRow || !lowerRow) return null;
  return {
    id,
    upperClubId:Number(upperRow.clubId),
    lowerClubId:Number(lowerRow.clubId),
    upperClubName:clubName(upperRow.clubId),
    lowerClubName:clubName(lowerRow.clubId),
    upperPosition,
    lowerPosition,
    upperDivisionId:upperDivision.id,
    upperDivisionName:upperDivision.name,
    lowerDivisionId:lowerDivision.id,
    lowerDivisionName:lowerDivision.name,
    advantageClubId:Number(upperRow.clubId),
    matchIds:[]
  };
}
function buildArgentinePlayoffTies(){
  const first = argentinaDivisionByOrder(1);
  const second = argentinaDivisionByOrder(2);
  const third = argentinaDivisionByOrder(3);
  const ties = [];
  if(first && second){
    [
      createArgentinePlayoffTie('primera-15-vs-segunda-4', first, second, 15, 4),
      createArgentinePlayoffTie('primera-16-vs-segunda-3', first, second, 16, 3)
    ].forEach(tie => { if(tie) ties.push(tie); });
  }
  if(second && third){
    [
      createArgentinePlayoffTie('segunda-15-vs-tercera-4', second, third, 15, 4),
      createArgentinePlayoffTie('segunda-16-vs-tercera-3', second, third, 16, 3)
    ].forEach(tie => { if(tie) ties.push(tie); });
  }
  return ties;
}
function playoffFixtureMatch(tie, leg, date, matchday){
  const lowerHome = Number(leg) === 1;
  const homeId = lowerHome ? tie.lowerClubId : tie.upperClubId;
  const awayId = lowerHome ? tie.upperClubId : tie.lowerClubId;
  const id = `arg-playoff-s${game?.seasonNumber || 1}-${tie.id}-${leg}`;
  return {
    id,
    matchday,
    leg:Number(leg),
    playoff:true,
    promotionPlayoff:true,
    playoffTieId:tie.id,
    playoffStage:Number(leg) === 1 ? 'IDA' : 'VUELTA',
    upperDivisionId:tie.upperDivisionId,
    upperDivisionName:tie.upperDivisionName,
    lowerDivisionId:tie.lowerDivisionId,
    lowerDivisionName:tie.lowerDivisionName,
    divisionId:tie.upperDivisionId,
    divisionName:`Promoción ${tie.upperDivisionName}`,
    date,
    roundDate:date,
    homeId,
    awayId,
    played:false
  };
}
function lastRegularFixtureDate(state=game){
  const fixtures = Array.isArray(state?.fixtures) ? state.fixtures : [];
  const regularCount = regularFixtureLength(fixtures);
  const dates = [];
  fixtures.slice(0, regularCount).forEach(round => {
    if(validIsoDate(round?.endDate)) dates.push(round.endDate);
    if(validIsoDate(round?.date)) dates.push(round.date);
    (round?.matches || []).forEach(match => { if(validIsoDate(match.date)) dates.push(match.date); });
  });
  if(!dates.length) return validIsoDate(state?.currentDate) ? state.currentDate : dateForSeasonState(state);
  return dates.sort((a,b)=>daysBetweenIsoDates(b,a))[dates.length - 1];
}
function repairPromotionPlayoffScheduleForState(state){
  if(!state || !Array.isArray(state.fixtures)) return false;
  const playoffRounds = state.fixtures.filter(isPromotionPlayoffRound);
  if(!playoffRounds.length) return false;
  const playoffMatches = playoffRounds.flatMap(round => round.matches || []).filter(isPromotionPlayoffMatch);
  if(!playoffMatches.length || playoffMatches.some(match => match.played)) return false;
  const regularEndDate = lastRegularFixtureDate(state);
  if(!validIsoDate(regularEndDate)) return false;
  const expectedDates = {
    IDA:addDaysToIsoDate(regularEndDate, 7),
    VUELTA:addDaysToIsoDate(regularEndDate, 14)
  };
  let changed = false;
  playoffRounds.forEach((round, index) => {
    const stage = String(round?.playoffStage || round?.matches?.[0]?.playoffStage || (index === 0 ? 'IDA' : 'VUELTA')).toUpperCase();
    const expectedDate = expectedDates[stage];
    if(!validIsoDate(expectedDate)) return;
    if(round.date !== expectedDate || round.startDate !== expectedDate || round.endDate !== expectedDate) changed = true;
    round.date = expectedDate;
    round.startDate = expectedDate;
    round.endDate = expectedDate;
    (round.matches || []).forEach(match => {
      if(!isPromotionPlayoffMatch(match)) return;
      if(match.date !== expectedDate || match.roundDate !== expectedDate) changed = true;
      match.date = expectedDate;
      match.roundDate = expectedDate;
    });
  });
  if(state.argentinaPlayoffs?.created){
    if(state.argentinaPlayoffs.firstLegDate !== expectedDates.IDA || state.argentinaPlayoffs.secondLegDate !== expectedDates.VUELTA) changed = true;
    state.argentinaPlayoffs.firstLegDate = expectedDates.IDA;
    state.argentinaPlayoffs.secondLegDate = expectedDates.VUELTA;
  }
  if(changed) state._needsAutosave = true;
  return changed;
}
function regularFixturesComplete(){
  const regularCount = regularFixtureLength();
  return (game?.fixtures || []).slice(0, regularCount).every(round => (round.matches || []).every(match => match.played));
}
function createArgentinePromotionPlayoffsIfNeeded(){
  if(!game || game.seasonFinalized || !Array.isArray(game.fixtures)) return false;
  const season = Number(game.seasonNumber || 1);
  const regularCount = regularFixtureLength();
  if(game.fixtures.some(isPromotionPlayoffRound)) return false;
  if(Number(game.matchdayIndex || 0) < regularCount) return false;
  if(game.argentinaPlayoffs?.season === season && game.argentinaPlayoffs?.created) return false;
  if(!regularFixturesComplete()) return false;
  const ties = buildArgentinePlayoffTies();
  if(!ties.length) return false;
  const firstLegDate = addDaysToIsoDate(lastRegularFixtureDate(), 7);
  const secondLegDate = addDaysToIsoDate(firstLegDate, 7);
  const firstMatchday = regularCount + 1;
  const secondMatchday = regularCount + 2;
  const firstLegMatches = ties.map(tie => playoffFixtureMatch(tie, 1, firstLegDate, firstMatchday));
  const secondLegMatches = ties.map(tie => playoffFixtureMatch(tie, 2, secondLegDate, secondMatchday));
  ties.forEach(tie => {
    tie.matchIds = [`arg-playoff-s${season}-${tie.id}-1`, `arg-playoff-s${season}-${tie.id}-2`];
  });
  game.fixtures.push({
    matchday:firstMatchday,
    date:firstLegDate,
    startDate:firstLegDate,
    endDate:firstLegDate,
    playoffRound:true,
    playoffStage:'IDA',
    title:'Playoffs IDA',
    matches:firstLegMatches
  });
  game.fixtures.push({
    matchday:secondMatchday,
    date:secondLegDate,
    startDate:secondLegDate,
    endDate:secondLegDate,
    playoffRound:true,
    playoffStage:'VUELTA',
    title:'Playoffs VUELTA',
    matches:secondLegMatches
  });
  game.argentinaPlayoffs = { season, created:true, regularFixtureCount:regularCount, firstLegDate, secondLegDate, ties };
  pushGameMessage({
    type:'deportivo',
    priority:'high',
    title:'Playoffs de promoción creados',
    body:'Terminó la liga argentina. Se agregaron Playoffs IDA y Playoffs VUELTA entre Primera/Segunda y Segunda/Tercera. Asciende quien haga más goles en el global; si empatan, cada club permanece en su liga actual.',
    id:`arg-playoffs-${season}`
  });

  return true;
}

const CLUB_WORLD_CUP_CONFIG = {
  enabled:true,
  name:'Copa Mundial de Clubes de la FIFA',
  divisionId:'club-world-cup',
  invitedDivisionId:'club-world-cup-invitados',
  invitedDivisionName:'Invitados Copa Mundial de Clubes',
  groupCount:8,
  groupSize:4,
  invitedCount:4,
  scheduleSeasonDays:{
    draw:configNumber('calendario.mundialClubes.diaSorteo', 295, 1, 365),
    groups:[
      configNumber('calendario.mundialClubes.diaGrupos1', 305, 1, 365),
      configNumber('calendario.mundialClubes.diaGrupos2', 310, 1, 365),
      configNumber('calendario.mundialClubes.diaGrupos3', 315, 1, 365)
    ],
    r16:configNumber('calendario.mundialClubes.diaOctavos', 320, 1, 365),
    qf:configNumber('calendario.mundialClubes.diaCuartos', 325, 1, 365),
    sf:configNumber('calendario.mundialClubes.diaSemifinales', 330, 1, 365),
    thirdPlace:configNumber('calendario.mundialClubes.diaTercerPuesto', 335, 1, 365),
    final:configNumber('calendario.mundialClubes.diaFinal', 336, 1, 365)
  },
  preparationDaysBeforeFirstMatch:configNumber('calendario.mundialClubes.diasPreparacionAntesPrimerPartido', 1, 1, 10),
  minimumMatchSquad:configNumber('calendario.mundialClubes.jugadoresMinimosPorPartido', 21, 11, 42),
  championTrainingBoostMin:configNumber('calendario.mundialClubes.boostEntrenamientoCampeonMin', 10, 0, 99),
  championTrainingBoostMax:configNumber('calendario.mundialClubes.boostEntrenamientoCampeonMax', 30, 0, 99),
  stadiums:[
    { name:'MetLife Stadium', capacity:81118 },
    { name:'Mercedes-Benz Stadium', capacity:66937 },
    { name:'Lincoln Financial Field', capacity:65782 },
    { name:'Camping World Stadium', capacity:43091 }
  ],
  invitedTeams:[
    { name:'América de México', country:'México', city:'Ciudad de México', reputation:64, primaryColor:'#F4C430' },
    { name:'Monterrey', country:'México', city:'Monterrey', reputation:61, primaryColor:'#005BAA' },
    { name:'Cerro Porteño', country:'Paraguay', city:'Asunción', reputation:62, primaryColor:'#D71920' },
    { name:'Olimpia', country:'Paraguay', city:'Asunción', reputation:64, primaryColor:'#FFFFFF' },
    { name:'Inter Miami', country:'Estados Unidos', city:'Miami', reputation:68, primaryColor:'#F7B5CD' },
    { name:'Seattle Sounders', country:'Estados Unidos', city:'Seattle', reputation:68, primaryColor:'#5D9731' },
    { name:'Wydad Casablanca', country:'Marruecos', city:'Casablanca', reputation:57, primaryColor:'#C8102E' },
    { name:'Urawa Red Diamonds', country:'Japón', city:'Saitama', reputation:63, primaryColor:'#E60012' }
  ],
  qualifiers:[
    { country:'Argentina', order:1, count:6 },
    { country:'Chile', order:1, count:2 },
    { country:'Brasil', order:1, count:4 },
    { country:'Inglaterra', order:1, count:6 },
    { country:'España', order:1, count:5 },
    { country:'Italia', order:1, count:4 },
    { country:'Rumania', order:1, count:1 }
  ],
  prizes:{ participate:50000000, groups:70000000, qf:100000000, sf:140000000, runnerUp:180000000, champion:300000000 }
};
function clubWorldCupTeamKey(name){
  return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
function clubWorldCupInviteId(index){ return 910000 + Number(index || 0) + 1; }
function ensureClubWorldCupInvitedData(){
  if(!seed?.clubs || !seed?.players) return { clubs:0, players:0 };
  const cfg = CLUB_WORLD_CUP_CONFIG;
  const existingByKey = new Map((seed.clubs || []).map(club => [clubWorldCupTeamKey(club.name), club]));
  let addedClubs = 0;
  let addedPlayers = 0;
  cfg.invitedTeams.forEach((team, index) => {
    const key = clubWorldCupTeamKey(team.name);
    let club = existingByKey.get(key);
    if(!club){
      const id = clubWorldCupInviteId(index);
      club = {
        id,
        name:team.name,
        short:typeof clubShortFromName === 'function' ? clubShortFromName(team.name) : String(team.name).slice(0,3).toUpperCase(),
        city:team.city || '',
        country:team.country || '',
        reputation:Number(team.reputation || 50),
        budget:typeof clubBudgetByPrestige === 'function' ? clubBudgetByPrestige(Number(team.reputation || 50), 1) : 0,
        primaryColor:team.primaryColor || (typeof deterministicColor === 'function' ? deterministicColor(team.name) : '#888888'),
        divisionId:cfg.invitedDivisionId,
        divisionName:cfg.invitedDivisionName,
        divisionOrder:99,
        prizeMultiplier:1,
        clubWorldCupInvite:true,
        specialCompetitionOnly:true,
        noOwnStadium:true,
        fieldConditionScore:100,
        fieldCondition:'Excelente',
        crestPath:''
      };
      seed.clubs.push(club);
      existingByKey.set(key, club);
      addedClubs += 1;
      if(game?.standings && !game.standings[club.id]) game.standings[club.id] = { clubId:club.id, pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, dg:0, pts:0 };
      if(game?.teamCohesion && !game.teamCohesion[club.id]) game.teamCohesion[club.id] = 65;
    }else{
      club.clubWorldCupInvite = true;
      club.specialCompetitionOnly = true;
      club.noOwnStadium = true;
      club.country = team.country || club.country || '';
      club.city = team.city || club.city || '';
      club.divisionId = cfg.invitedDivisionId;
      club.divisionName = cfg.invitedDivisionName;
      club.divisionOrder = 99;
    }
    const currentPlayers = playersByClub(club.id).filter(player => !player.retired && !player.sold);
    const needed = Math.max(0, 24 - currentPlayers.length);
    if(needed > 0 && typeof generateClubPlayers === 'function'){
      const activePlayers = (seed.players || []).filter(player => player && !player.retired && !player.sold && Number(player.clubId || 0) >= 0);
      const context = typeof createPlayerGenerationContext === 'function' ? createPlayerGenerationContext(activePlayers.length + needed, activePlayers) : null;
      const generated = generateClubPlayers(club, Number(club.reputation || team.reputation || 50), nextPlayerId(), context).slice(0, needed).map(player => ({
        ...player,
        clubId:club.id,
        clubWorldCupInvitePlayer:true,
        specialCompetitionOnly:true,
        nationality:player.nationality || team.country || club.country || ''
      }));
      seed.players.push(...generated);
      addedPlayers += generated.length;
      if(game){
        game.playerStats = game.playerStats || {};
        generated.forEach(player => {
          if(!game.playerStats[player.id]) game.playerStats[player.id] = createEmptyPlayerStat(player);
          if(game.playerCondition) game.playerCondition[player.id] = Math.max(65, Number(game.playerCondition[player.id] || 0));
          if(game.playerMorale) game.playerMorale[player.id] = Math.max(60, Number(game.playerMorale[player.id] || 0));
          if(game.playerSkillBoosts) game.playerSkillBoosts[player.id] = game.playerSkillBoosts[player.id] || {};
          game.playerAgeSkillPenalties = (game.playerAgeSkillPenalties && typeof game.playerAgeSkillPenalties === 'object' && !Array.isArray(game.playerAgeSkillPenalties)) ? game.playerAgeSkillPenalties : {};
          game.playerAgeSkillPenalties[player.id] = 0;
          if(game.trainingPlan) game.trainingPlan[player.id] = typeof safeIndividualTrainingType === 'function' ? safeIndividualTrainingType(game.trainingPlan[player.id]) : (game.trainingPlan[player.id] || 'balanced');
        });
      }
    }
  });
  return { clubs:addedClubs, players:addedPlayers };
}
function normalizeClubWorldCupMatchSnapshot(match){
  const src = (match && typeof match === 'object' && !Array.isArray(match)) ? match : {};
  const homeId = Number(src.homeId || 0);
  const awayId = Number(src.awayId || 0);
  const homeGoals = Number(src.homeGoals || 0);
  const awayGoals = Number(src.awayGoals || 0);
  const played = Boolean(src.played);
  const penalties = src.penaltyShootout && typeof src.penaltyShootout === 'object' ? { home:Number(src.penaltyShootout.home || 0), away:Number(src.penaltyShootout.away || 0) } : null;
  const tiebreaker = src.clubWorldCupTiebreaker && typeof src.clubWorldCupTiebreaker === 'object' ? {
    type:String(src.clubWorldCupTiebreaker.type || ''),
    homeFouls:Number(src.clubWorldCupTiebreaker.homeFouls || 0),
    awayFouls:Number(src.clubWorldCupTiebreaker.awayFouls || 0),
    homeCards:Number(src.clubWorldCupTiebreaker.homeCards || 0),
    awayCards:Number(src.clubWorldCupTiebreaker.awayCards || 0),
    winnerClubId:Number(src.clubWorldCupTiebreaker.winnerClubId || 0)
  } : null;
  let winnerClubId = Number(src.winnerClubId || tiebreaker?.winnerClubId || 0);
  if(!winnerClubId && played){
    if(homeGoals > awayGoals) winnerClubId = homeId;
    else if(awayGoals > homeGoals) winnerClubId = awayId;
    else if(penalties && penalties.home !== penalties.away) winnerClubId = penalties.home > penalties.away ? homeId : awayId;
  }
  const stage = String(src.clubWorldCupStage || src.stage || '');
  const roundNumber = Math.max(0, Math.round(Number(src.clubWorldCupRound || src.roundNumber || 0)));
  const seasonDay = Math.max(0, Math.round(Number(src.seasonDay || src.clubWorldCupSeasonDay || clubWorldCupStageSeasonDay(stage, roundNumber || 1) || 0)));
  return {
    id:String(src.id || ''),
    date:validIsoDate(src.date) ? src.date : '',
    seasonDay,
    stage,
    groupId:String(src.clubWorldCupGroup || src.groupId || ''),
    roundNumber,
    homeId,
    awayId,
    homeGoals,
    awayGoals,
    played,
    winnerClubId,
    stadiumName:String(src.stadiumName || ''),
    bracketKey:String(src.clubWorldCupBracketKey || src.bracketKey || ''),
    bracketSlot:String(src.clubWorldCupBracketSlot || src.bracketSlot || ''),
    penaltyShootout:penalties,
    tiebreaker
  };
}
function normalizeClubWorldCupStandingSnapshot(row, position=0){
  const src = (row && typeof row === 'object' && !Array.isArray(row)) ? row : {};
  return {
    clubId:Number(src.clubId || 0),
    pj:Number(src.pj || 0), pg:Number(src.pg || 0), pe:Number(src.pe || 0), pp:Number(src.pp || 0),
    gf:Number(src.gf || 0), gc:Number(src.gc || 0), dg:Number(src.dg || 0), pts:Number(src.pts || 0),
    position:Math.max(1, Math.round(Number(src.position || position || 1)))
  };
}
function normalizeClubWorldCupEditionSnapshot(item){
  const src = (item && typeof item === 'object' && !Array.isArray(item)) ? item : {};
  const season = Math.max(1, Math.round(Number(src.season || 1)));
  const year = Math.round(Number(src.year || 0)) || seasonYearForNumber(season);
  const groups = (Array.isArray(src.groups) ? src.groups : []).map((group, groupIndex) => ({
    id:String(group?.id || String.fromCharCode(65 + groupIndex)),
    name:String(group?.name || `Grupo ${group?.id || String.fromCharCode(65 + groupIndex)}`),
    clubIds:Array.from(new Set((Array.isArray(group?.clubIds) ? group.clubIds : []).map(Number).filter(Boolean))),
    standings:(Array.isArray(group?.standings) ? group.standings : []).map((row, index) => normalizeClubWorldCupStandingSnapshot(row, index + 1)).filter(row => row.clubId),
    matches:(Array.isArray(group?.matches) ? group.matches : []).map(normalizeClubWorldCupMatchSnapshot).filter(match => match.homeId && match.awayId)
  })).filter(group => group.clubIds.length || group.standings.length || group.matches.length);
  const stages = {};
  ['r16','qf','sf','thirdPlace','final'].forEach(stage => {
    stages[stage] = (Array.isArray(src?.stages?.[stage]) ? src.stages[stage] : []).map(normalizeClubWorldCupMatchSnapshot).filter(match => match.homeId && match.awayId);
  });
  return {
    season,
    year,
    name:String(src.name || CLUB_WORLD_CUP_CONFIG?.name || 'Copa Mundial de Clubes de la FIFA'),
    status:String(src.status || (src.championId ? 'completed' : 'groups')),
    createdAt:String(src.createdAt || ''),
    archivedAt:String(src.archivedAt || ''),
    drawDate:validIsoDate(src.drawDate) ? src.drawDate : clubWorldCupIsoForSeasonDay(Number(src.drawSeasonDay || clubWorldCupFixtureReadySeasonDay()), year),
    drawSeasonDay:Math.max(1, Math.round(Number(src.drawSeasonDay || clubWorldCupFixtureReadySeasonDay()))),
    firstGroupDate:validIsoDate(src.firstGroupDate) ? src.firstGroupDate : clubWorldCupStageDate('groups', 1, year),
    groupDates:(Array.isArray(src.groupDates) && src.groupDates.length ? src.groupDates : clubWorldCupGroupDatesFromFirstDate('', year)).filter(validIsoDate).slice(0,3),
    groupSeasonDays:(Array.isArray(src.groupSeasonDays) && src.groupSeasonDays.length ? src.groupSeasonDays : clubWorldCupGroupSeasonDays()).map(value => Math.max(1, Math.round(Number(value || 1)))).slice(0,3),
    stageSeasonDays:{
      r16:Math.max(1, Math.round(Number(src?.stageSeasonDays?.r16 || clubWorldCupStageSeasonDay('r16', 1)))),
      qf:Math.max(1, Math.round(Number(src?.stageSeasonDays?.qf || clubWorldCupStageSeasonDay('qf', 1)))),
      sf:Math.max(1, Math.round(Number(src?.stageSeasonDays?.sf || clubWorldCupStageSeasonDay('sf', 1)))),
      thirdPlace:Math.max(1, Math.round(Number(src?.stageSeasonDays?.thirdPlace || clubWorldCupStageSeasonDay('thirdPlace', 1)))),
      final:Math.max(1, Math.round(Number(src?.stageSeasonDays?.final || clubWorldCupStageSeasonDay('final', 1))))
    },
    participantClubIds:Array.from(new Set((Array.isArray(src.participantClubIds) ? src.participantClubIds : []).map(Number).filter(Boolean))),
    invitedClubIds:Array.from(new Set((Array.isArray(src.invitedClubIds) ? src.invitedClubIds : []).map(Number).filter(Boolean))),
    groups,
    stages,
    championId:Number(src.championId || 0),
    runnerUpId:Number(src.runnerUpId || 0),
    thirdPlaceId:Number(src.thirdPlaceId || 0),
    summaryOnly:Boolean(src.summaryOnly),
    sourceVersion:String(src.sourceVersion || APP_VERSION || '')
  };
}
function normalizeClubWorldCupHistoryState(src){
  const obj = (src && typeof src === 'object' && !Array.isArray(src)) ? src : {};
  const editions = Array.isArray(obj.editions) ? obj.editions : (Array.isArray(obj.seasons) ? obj.seasons : []);
  const byKey = new Map();
  editions.map(normalizeClubWorldCupEditionSnapshot).forEach(edition => {
    if(!edition.season || !edition.year) return;
    const key = `${edition.season}-${edition.year}`;
    const previous = byKey.get(key);
    const score = Number(edition.groups.length > 0) * 100 + Object.values(edition.stages).reduce((sum, rows) => sum + rows.length, 0) + Number(Boolean(edition.championId));
    const previousScore = previous ? Number(previous.groups.length > 0) * 100 + Object.values(previous.stages).reduce((sum, rows) => sum + rows.length, 0) + Number(Boolean(previous.championId)) : -1;
    if(!previous || score >= previousScore) byKey.set(key, edition);
  });
  return { editions:Array.from(byKey.values()).sort((a,b)=>Number(b.year || 0)-Number(a.year || 0) || Number(b.season || 0)-Number(a.season || 0)) };
}
function clubWorldCupMatchesForState(targetState, cupState=null){
  const target = targetState || game || {};
  const cup = cupState || target.clubWorldCup || null;
  const season = Number(cup?.season || target.seasonNumber || 0);
  return (Array.isArray(target.fixtures) ? target.fixtures : [])
    .filter(round => round?.clubWorldCupRound || (round?.matches || []).some(match => match?.clubWorldCup))
    .flatMap(round => round?.matches || [])
    .filter(match => match?.clubWorldCup && (!season || String(match.id || '').includes(`cwc-s${season}-`) || Number(match.season || season) === season));
}
function clubWorldCupStandingsFromMatches(clubIds=[], matches=[]){
  const rows = Object.fromEntries((clubIds || []).map(Number).filter(Boolean).map(id => [id, { clubId:id, pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, dg:0, pts:0 }]));
  (matches || []).filter(match => match?.played).forEach(match => {
    const h = rows[Number(match.homeId)];
    const a = rows[Number(match.awayId)];
    if(!h || !a) return;
    const hg = Number(match.homeGoals || 0);
    const ag = Number(match.awayGoals || 0);
    h.pj += 1; a.pj += 1;
    h.gf += hg; h.gc += ag; a.gf += ag; a.gc += hg;
    if(hg > ag){ h.pg += 1; a.pp += 1; h.pts += 3; }
    else if(hg < ag){ a.pg += 1; h.pp += 1; a.pts += 3; }
    else { h.pe += 1; a.pe += 1; h.pts += 1; a.pts += 1; }
    h.dg = h.gf - h.gc; a.dg = a.gf - a.gc;
  });
  return Object.values(rows)
    .sort((a,b)=>b.pts-a.pts || b.dg-a.dg || b.gf-a.gf || clubPrestigeValue(b.clubId)-clubPrestigeValue(a.clubId) || clubName(a.clubId).localeCompare(clubName(b.clubId), 'es', { sensitivity:'base' }))
    .map((row,index)=>({ ...row, position:index + 1 }));
}
function clubWorldCupEditionSnapshotForState(targetState, cupState=null){
  const target = targetState || game || {};
  const cup = cupState || target.clubWorldCup;
  if(!cup || typeof cup !== 'object') return null;
  const season = Math.max(1, Math.round(Number(cup.season || target.seasonNumber || 1)));
  const year = Math.round(Number(cup.year || (Number(target.seasonNumber || 0) === season ? target.seasonYear : 0) || seasonYearForNumber(season))) || seasonYearForNumber(season);
  const allMatches = clubWorldCupMatchesForState(target, cup).map(normalizeClubWorldCupMatchSnapshot);
  const groups = (Array.isArray(cup.groups) ? cup.groups : []).map((group, groupIndex) => {
    const id = String(group?.id || String.fromCharCode(65 + groupIndex));
    const clubIds = Array.from(new Set((Array.isArray(group?.clubIds) ? group.clubIds : []).map(Number).filter(Boolean)));
    const matches = allMatches.filter(match => match.stage === 'groups' && String(match.groupId) === id);
    return {
      id,
      name:String(group?.name || `Grupo ${id}`),
      clubIds,
      standings:clubWorldCupStandingsFromMatches(clubIds, matches),
      matches
    };
  });
  const stages = {};
  ['r16','qf','sf','thirdPlace','final'].forEach(stage => { stages[stage] = allMatches.filter(match => match.stage === stage); });
  return normalizeClubWorldCupEditionSnapshot({
    season,
    year,
    name:cup.name || CLUB_WORLD_CUP_CONFIG.name,
    status:cup.status || 'groups',
    createdAt:(()=>{ if(!cup.createdAt) return ''; const value = Number(cup.createdAt) || cup.createdAt; const date = new Date(value); return Number.isNaN(date.getTime()) ? String(cup.createdAt) : date.toISOString(); })(),
    archivedAt:'',
    drawDate:cup.drawDate || '',
    drawSeasonDay:cup.drawSeasonDay || clubWorldCupFixtureReadySeasonDay(),
    firstGroupDate:cup.firstGroupDate || '',
    groupDates:cup.groupDates || [],
    groupSeasonDays:cup.groupSeasonDays || clubWorldCupGroupSeasonDays(),
    stageSeasonDays:cup.stageSeasonDays || {
      r16:clubWorldCupStageSeasonDay('r16', 1),
      qf:clubWorldCupStageSeasonDay('qf', 1),
      sf:clubWorldCupStageSeasonDay('sf', 1),
      thirdPlace:clubWorldCupStageSeasonDay('thirdPlace', 1),
      final:clubWorldCupStageSeasonDay('final', 1)
    },
    participantClubIds:cup.participantClubIds || [],
    invitedClubIds:cup.invitedClubIds || [],
    groups,
    stages,
    championId:cup.championId || 0,
    runnerUpId:cup.runnerUpId || 0,
    thirdPlaceId:cup.thirdPlaceId || 0,
    summaryOnly:false,
    sourceVersion:APP_VERSION
  });
}
function archiveClubWorldCupEditionForState(targetState, options={}){
  const target = targetState || game;
  if(!target?.clubWorldCup) return false;
  const snapshot = clubWorldCupEditionSnapshotForState(target, target.clubWorldCup);
  if(!snapshot) return false;
  if(!options.allowIncomplete && snapshot.status !== 'completed' && !snapshot.championId) return false;
  target.clubWorldCupHistory = normalizeClubWorldCupHistoryState(target.clubWorldCupHistory || {});
  const key = `${snapshot.season}-${snapshot.year}`;
  const previous = (target.clubWorldCupHistory.editions || []).find(item => `${Number(item.season || 0)}-${Number(item.year || 0)}` === key) || null;
  snapshot.archivedAt = String(previous?.archivedAt || new Date().toISOString());
  target.clubWorldCupHistory.editions = (target.clubWorldCupHistory.editions || []).filter(item => `${Number(item.season || 0)}-${Number(item.year || 0)}` !== key);
  target.clubWorldCupHistory.editions.push(snapshot);
  target.clubWorldCupHistory = normalizeClubWorldCupHistoryState(target.clubWorldCupHistory);
  return true;
}
function syncClubWorldCupHistoryForState(targetState){
  const target = targetState || game;
  if(!target) return false;
  const before = JSON.stringify(target.clubWorldCupHistory || {});
  target.clubWorldCupHistory = normalizeClubWorldCupHistoryState(target.clubWorldCupHistory || {});
  if(target.clubWorldCup && (String(target.clubWorldCup.status || '') === 'completed' || Number(target.clubWorldCup.championId || 0))){
    archiveClubWorldCupEditionForState(target, { allowIncomplete:false });
  }
  const champions = normalizeCompetitionChampionsHistoryState(target.competitionChampionsHistory || {}).entries || [];
  champions.filter(entry => String(entry.type || '') === 'club_world_cup' || String(entry.competitionId || '') === 'club-world-cup').forEach(entry => {
    const season = Number(entry.season || 0);
    const year = Number(entry.year || 0) || seasonYearForNumber(season);
    const exists = (target.clubWorldCupHistory.editions || []).some(item => Number(item.season || 0) === season && Number(item.year || 0) === year);
    if(exists) return;
    target.clubWorldCupHistory.editions.push(normalizeClubWorldCupEditionSnapshot({
      season,
      year,
      name:entry.competitionName || CLUB_WORLD_CUP_CONFIG.name,
      status:'completed',
      championId:entry.championId,
      runnerUpId:entry.runnerUpId,
      thirdPlaceId:entry.thirdPlaceId,
      summaryOnly:true,
      sourceVersion:'legacy'
    }));
  });
  target.clubWorldCupHistory = normalizeClubWorldCupHistoryState(target.clubWorldCupHistory);
  return JSON.stringify(target.clubWorldCupHistory || {}) !== before;
}
function clubWorldCupHistoryEntries(){
  if(!game) return [];
  syncClubWorldCupHistoryForState(game);
  return (game.clubWorldCupHistory?.editions || []).slice().sort((a,b)=>Number(b.year || 0)-Number(a.year || 0) || Number(b.season || 0)-Number(a.season || 0));
}
function clubWorldCupCurrentEditionSnapshot(){
  const state = clubWorldCupState();
  return state ? clubWorldCupEditionSnapshotForState(game, state) : null;
}
function clubWorldCupState(){
  if(!game) return null;
  const season = Number(game.seasonNumber || 1);
  if(!game.clubWorldCup || Number(game.clubWorldCup.season || 0) !== season){
    game.clubWorldCup = null;
  }
  return game.clubWorldCup;
}
function clubWorldCupParticipantIds(state=clubWorldCupState()){
  return Array.from(new Set((Array.isArray(state?.participantClubIds) ? state.participantClubIds : []).map(Number).filter(Boolean)));
}
function clubWorldCupClubParticipates(clubId, state=clubWorldCupState()){
  const id = Number(clubId || 0);
  return id > 0 && clubWorldCupParticipantIds(state).includes(id);
}

function clubWorldCupPreparationSeasonDay(){
  const firstGroupDay = Math.max(1, Number(clubWorldCupGroupSeasonDays()[0] || 1));
  return Math.max(1, firstGroupDay - Math.max(1, Number(CLUB_WORLD_CUP_CONFIG.preparationDaysBeforeFirstMatch || 1)));
}
function clearClubWorldCupPlayerInjury(playerId){
  if(!game?.playerStatus) return false;
  const id = Number(playerId || 0);
  const before = game.playerStatus[id];
  const injuryFields = ['injuredThrough','injuredUntilTurn','injuryLabel','injuryChance','injuredAtMatchday','injuredAtTurn','carriedFromPreviousSeason','carriedFromSeason','rebasedForSeason'];
  if(!before || !injuryFields.some(key => Object.prototype.hasOwnProperty.call(before, key))) return false;
  const clean = typeof removeInjuryFieldsFromStatus === 'function' ? removeInjuryFieldsFromStatus(before) : (() => {
    const next = { ...before };
    injuryFields.forEach(key => delete next[key]);
    return next;
  })();
  if(Object.keys(clean).length) game.playerStatus[id] = clean;
  else delete game.playerStatus[id];
  return true;
}
function clubWorldCupActiveSquad(clubId){
  return playersByClub(Number(clubId || 0)).filter(player => player && !player.retired && !player.sold && !player.freeAgent);
}
function clubWorldCupEligibleSquad(clubId){
  return clubWorldCupActiveSquad(clubId).filter(player => !isUnavailable(player.id));
}
function clubWorldCupNextRosterGroup(clubId){
  const squad = clubWorldCupEligibleSquad(clubId);
  const counts = rosterGroupCounts(squad);
  const req = minimumRosterRequirements();
  const deficits = [
    ['POR', Math.max(0, Number(req.POR || 0) - Number(counts.POR || 0))],
    ['DEF', Math.max(0, Number(req.DEF || 0) - Number(counts.DEF || 0))],
    ['MID', Math.max(0, Number(req.MID || 0) - Number(counts.MID || 0))],
    ['ATT', Math.max(0, Number(req.ATT || 0) - Number(counts.ATT || 0))]
  ].sort((a,b)=>b[1]-a[1]);
  if(deficits[0][1] > 0) return deficits[0][0];
  return ['DEF','MID','ATT','POR'].sort((a,b)=>Number(counts[a] || 0)-Number(counts[b] || 0))[0] || 'MID';
}
function ensureClubWorldCupParticipantRoster(clubId, minimumPlayers=CLUB_WORLD_CUP_CONFIG.minimumMatchSquad, report=null){
  const id = Number(clubId || 0);
  const club = seed?.clubs?.find(item => Number(item.id) === id);
  if(!club || id === Number(game?.selectedClubId || 0)) return { eligible:clubWorldCupEligibleSquad(id).length, added:0 };
  const localReport = report || { created:0, converted:0, signedFreeAgents:0 };
  if(typeof repairBotRoster === 'function') repairBotRoster(club, localReport);
  let added = 0;
  let guard = 0;
  while(clubWorldCupEligibleSquad(id).length < Math.max(11, Number(minimumPlayers || 21)) && guard < 48){
    const before = clubWorldCupActiveSquad(id).length;
    const group = clubWorldCupNextRosterGroup(id);
    if(typeof addOrConvertEmergencyBotPlayer !== 'function') break;
    const player = addOrConvertEmergencyBotPlayer(club, group, localReport);
    if(!player) break;
    added += clubWorldCupActiveSquad(id).length > before ? 1 : 0;
    guard += 1;
  }
  return { eligible:clubWorldCupEligibleSquad(id).length, added };
}
function clubWorldCupLeagueChampionIds(state=clubWorldCupState()){
  const participants = new Set(clubWorldCupParticipantIds(state));
  const champions = new Set();
  const season = Number(state?.season || game?.seasonNumber || 1);
  const recorded = normalizeCompetitionChampionsHistoryState(game?.competitionChampionsHistory || {}).entries || [];
  recorded.filter(entry => Number(entry.season || 0) === season && String(entry.type || 'league') === 'league').forEach(entry => {
    const id = Number(entry.championId || 0);
    if(participants.has(id)) champions.add(id);
  });
  (seed?.divisions || []).forEach(division => {
    if(String(division?.id || '') === String(CLUB_WORLD_CUP_CONFIG.divisionId) || String(division?.id || '') === String(CLUB_WORLD_CUP_CONFIG.invitedDivisionId)) return;
    const championId = Number(sortedStandings(division.id)?.[0]?.clubId || 0);
    if(participants.has(championId)) champions.add(championId);
  });
  return Array.from(champions).filter(id => id && id !== Number(game?.selectedClubId || 0));
}
function applyClubWorldCupChampionTrainingBoost(clubId, state=clubWorldCupState()){
  const id = Number(clubId || 0);
  const season = Number(state?.season || game?.seasonNumber || 1);
  const minBoost = Math.min(Number(CLUB_WORLD_CUP_CONFIG.championTrainingBoostMin || 10), Number(CLUB_WORLD_CUP_CONFIG.championTrainingBoostMax || 30));
  const maxBoost = Math.max(Number(CLUB_WORLD_CUP_CONFIG.championTrainingBoostMin || 10), Number(CLUB_WORLD_CUP_CONFIG.championTrainingBoostMax || 30));
  const spread = Math.max(1, Math.round(maxBoost - minBoost + 1));
  game.playerSkillBoosts = game.playerSkillBoosts || {};
  let players = 0;
  let gains = 0;
  clubWorldCupActiveSquad(id).forEach(player => {
    const target = Math.round(minBoost + hashNumber(`cwc-champion-boost-${season}-${id}-${player.id}`, spread));
    const skills = (typeof trainableSkillsForPlayer === 'function' ? trainableSkillsForPlayer(player) : botBalanceSkillPool(player)).filter(Boolean);
    if(!skills.length || target <= 0) return;
    game.playerSkillBoosts[player.id] = game.playerSkillBoosts[player.id] && typeof game.playerSkillBoosts[player.id] === 'object' && !Array.isArray(game.playerSkillBoosts[player.id]) ? game.playerSkillBoosts[player.id] : {};
    let applied = 0;
    let safety = 0;
    while(applied < target && safety < target * Math.max(4, skills.length)){
      const skill = skills[hashNumber(`cwc-champion-skill-${season}-${id}-${player.id}-${safety}`, skills.length)];
      const current = Math.max(0, Math.round(Number(game.playerSkillBoosts[player.id][skill] || 0)));
      if(current < 30 && baseSkill(player, skill) < 99){
        game.playerSkillBoosts[player.id][skill] = current + 1;
        applied += 1;
      }
      safety += 1;
    }
    if(applied > 0){ players += 1; gains += applied; }
  });
  return { clubId:id, players, gains };
}
function prepareClubWorldCupParticipantsIfNeeded(options={}){
  const state = clubWorldCupState();
  const result = { applied:false, changed:false, reason:'', clubs:0, players:0, injuriesCleared:0, rosterAdded:0, championClubs:0, championPlayers:0, championGains:0 };
  if(!game || !state || state.status === 'completed') return result;
  const season = Number(state.season || game.seasonNumber || 1);
  const source = String(options.source || '');
  const preparationRecord = state.hostCityPreparation;
  const alreadyApplied = Boolean(preparationRecord?.applied && Number(preparationRecord.season || 0) === season);
  const readinessValidationSources = new Set(['daily_calendar','daily_calendar_complete','before_matchday']);
  if(alreadyApplied && !options.forceReadiness && !readinessValidationSources.has(source)) return result;
  const currentDay = clubWorldCupCurrentSeasonDay();
  const preparationDay = clubWorldCupPreparationSeasonDay();
  if(currentDay < preparationDay) return result;
  const playedCupMatches = clubWorldCupPlayedMatches();
  if(playedCupMatches.length){ result.reason = 'el torneo ya tiene partidos disputados'; return result; }
  ensurePlayerStateForAll();
  ensureTeamCohesion();
  game.playerStatus = game.playerStatus || {};
  game.playerWear = game.playerWear || {};
  game.lastMatchTactics = game.lastMatchTactics || {};
  const participantIds = clubWorldCupParticipantIds(state).filter(id => Number(id) !== Number(game.selectedClubId || 0));
  const rosterReport = { created:0, converted:0, signedFreeAgents:0 };
  let readinessChanged = false;
  const normalizeReadyPlayer = player => {
    if(clearClubWorldCupPlayerInjury(player.id)){ result.injuriesCleared += 1; readinessChanged = true; }
    if(Number(game.playerWear[player.id] || 0) !== 0) readinessChanged = true;
    if(Number(game.playerCondition[player.id]) !== 99) readinessChanged = true;
    if(Number(game.playerMorale[player.id]) !== 99) readinessChanged = true;
    game.playerWear[player.id] = 0;
    game.playerCondition[player.id] = 99;
    game.playerMorale[player.id] = 99;
  };
  participantIds.forEach(clubId => {
    if(Number(game.teamCohesion[clubId]) !== 100) readinessChanged = true;
    game.teamCohesion[clubId] = 100;
    clubWorldCupActiveSquad(clubId).forEach(normalizeReadyPlayer);
    const roster = ensureClubWorldCupParticipantRoster(clubId, CLUB_WORLD_CUP_CONFIG.minimumMatchSquad, rosterReport);
    result.rosterAdded += Number(roster.added || 0);
    if(Number(roster.added || 0) > 0) readinessChanged = true;
    const readySquad = clubWorldCupActiveSquad(clubId);
    readySquad.forEach(normalizeReadyPlayer);
    result.players += readySquad.length;
    const preparedTactic = window.Simulator20?.botTacticForClub?.(clubId);
    if(preparedTactic && typeof tacticSignature === 'function'){
      const signature = tacticSignature(preparedTactic);
      if(game.lastMatchTactics[clubId] !== signature) readinessChanged = true;
      game.lastMatchTactics[clubId] = signature;
    }
    result.clubs += 1;
  });
  if(!alreadyApplied){
    const championIds = clubWorldCupLeagueChampionIds(state);
    championIds.forEach(clubId => {
      const boost = applyClubWorldCupChampionTrainingBoost(clubId, state);
      result.championClubs += 1;
      result.championPlayers += Number(boost.players || 0);
      result.championGains += Number(boost.gains || 0);
    });
    state.hostCityPreparation = {
      applied:true,
      season,
      preparationSeasonDay:preparationDay,
      appliedSeasonDay:currentDay,
      appliedDate:game.currentDate || '',
      participantClubCount:participantIds.length,
      minimumMatchSquad:Number(CLUB_WORLD_CUP_CONFIG.minimumMatchSquad || 21),
      rosterReport:{ ...rosterReport },
      summary:{ ...result, applied:true, changed:true },
      version:APP_VERSION
    };
    pushGameMessage({
      type:'deportivo',
      priority:'normal',
      title:CLUB_WORLD_CUP_CONFIG.name,
      body:'Los equipos ya están listos en la ciudad anfitriona.',
      id:`club-world-cup-${season}-host-city-ready`
    });
    result.applied = true;
    result.changed = true;
    game._needsAutosave = true;
    return result;
  }
  if(readinessChanged){
    state.hostCityPreparation.lastValidatedSeasonDay = currentDay;
    state.hostCityPreparation.lastValidatedDate = game.currentDate || '';
    state.hostCityPreparation.validationCount = Math.max(0, Number(state.hostCityPreparation.validationCount || 0)) + 1;
    state.hostCityPreparation.lastValidationSummary = {
      clubs:result.clubs,
      players:result.players,
      injuriesCleared:result.injuriesCleared,
      rosterAdded:result.rosterAdded
    };
    result.changed = true;
    game._needsAutosave = true;
  }
  return result;
}
function clubWorldCupAuthoritativeSeasonDay(match, round=null, state=clubWorldCupState()){
  if(!match?.clubWorldCup) return 0;
  const stage = String(match?.clubWorldCupStage || round?.clubWorldCupStage || '');
  const roundNumber = Math.max(1, Math.round(Number(match?.clubWorldCupRound || clubWorldCupRoundNumberFromRound(round, 1) || 1)));
  const fixed = clubWorldCupStageSeasonDay(stage, roundNumber);
  if(fixed > 0) return fixed;
  return Math.max(0, Math.round(Number(match?.seasonDay || round?.seasonDay || 0)));
}
function clubWorldCupAuthoritativeMatchDate(match, round=null, state=clubWorldCupState()){
  if(!match?.clubWorldCup) return '';
  const season = Math.max(1, Math.round(Number(state?.season || game?.seasonNumber || 1)));
  const year = Math.round(Number(state?.year || (season === Number(game?.seasonNumber || 0) ? game?.seasonYear : 0) || seasonYearForNumber(season))) || seasonYearForNumber(season);
  const seasonDay = clubWorldCupAuthoritativeSeasonDay(match, round, state);
  if(seasonDay > 0) return clubWorldCupIsoForSeasonDay(seasonDay, year);
  if(validIsoDate(round?.date)) return round.date;
  return validIsoDate(match?.date) ? match.date : '';
}
function repairInvalidClubWorldCupParticipationPrizeForState(state){
  const cup = state?.clubWorldCup;
  if(!cup || !Array.isArray(cup.participantClubIds) || !cup.participantClubIds.length) return false;
  const managedId = Number(state?.selectedClubId || 0);
  if(!managedId || clubWorldCupClubParticipates(managedId, cup)) return false;
  const paid = cup.prizesPaid?.[managedId];
  const amount = Math.max(0, Math.round(Number(paid?.participate || 0)));
  if(amount <= 0) return false;
  cup.invalidParticipationPrizeReversals = (cup.invalidParticipationPrizeReversals && typeof cup.invalidParticipationPrizeReversals === 'object' && !Array.isArray(cup.invalidParticipationPrizeReversals)) ? cup.invalidParticipationPrizeReversals : {};
  const reversalKey = `${managedId}:participate`;
  if(cup.invalidParticipationPrizeReversals[reversalKey]) return false;
  delete paid.participate;
  if(!Object.keys(paid).length) delete cup.prizesPaid[managedId];
  cup.invalidParticipationPrizeReversals[reversalKey] = { clubId:managedId, amount, season:Number(cup.season || state.seasonNumber || 1), repairedAt:Date.now() };
  state.budget = Math.round(Number(state.budget || 0) - amount);
  state.clubBudgets = (state.clubBudgets && typeof state.clubBudgets === 'object' && !Array.isArray(state.clubBudgets)) ? state.clubBudgets : {};
  state.clubBudgets[managedId] = state.budget;
  state.lastBudgetDelta = -amount;
  state.budgetHistory = Array.isArray(state.budgetHistory) ? state.budgetHistory : [];
  state.budgetHistory.push({
    season:Number(state.seasonNumber || cup.season || 1),
    matchdayIndex:Number(state.matchdayIndex || 0),
    date:state.currentDate || '',
    concept:'Corrección de premio de participación no clasificado',
    delta:-amount,
    budget:state.budget,
    type:'club_world_cup_prize_reversal',
    category:'Premios Mundial de Clubes'
  });
  state.messages = Array.isArray(state.messages) ? state.messages : [];
  const messageId = `club-world-cup-prize-reversal-${cup.season || state.seasonNumber || 1}-${managedId}`;
  if(!state.messages.some(message => String(message?.id || '') === messageId)){
    state.messages.unshift({
      id:messageId,
      turn:Number(state.matchdayIndex || 0),
      season:Number(state.seasonNumber || cup.season || 1),
      date:state.currentDate || '',
      read:false,
      priority:'normal',
      type:'finanzas',
      title:`Corrección ${CLUB_WORLD_CUP_CONFIG.name}`,
      body:`Se revirtió ${formatMoney(amount)} porque ${clubName(managedId)} no estaba clasificado al torneo.`,
      action:null,
      createdAt:Date.now()
    });
  }
  state._needsAutosave = true;
  return true;
}
function clubWorldCupStageRounds(stage){
  return (game?.fixtures || []).filter(round => round?.clubWorldCupRound && String(round.clubWorldCupStage || '') === String(stage || ''));
}
function clubWorldCupStageMatches(stage){
  return clubWorldCupStageRounds(stage).flatMap(round => round.matches || []).filter(match => match?.clubWorldCup);
}
function clubWorldCupStageComplete(stage){
  const matches = clubWorldCupStageMatches(stage);
  return matches.length > 0 && matches.every(match => match.played);
}
function clubWorldCupSelectedInvites(season=game?.seasonNumber || 1){
  ensureClubWorldCupInvitedData();
  const cfg = CLUB_WORLD_CUP_CONFIG;
  return (seed.clubs || [])
    .filter(club => club.clubWorldCupInvite)
    .sort((a,b)=>hashNumber(`cwc-invite-${season}-${a.name}`, 1000000) - hashNumber(`cwc-invite-${season}-${b.name}`, 1000000))
    .slice(0, cfg.invitedCount)
    .map(club => Number(club.id));
}
function clubWorldCupExpectedLeagueQualifierCount(){
  return CLUB_WORLD_CUP_CONFIG.qualifiers.reduce((sum, rule) => sum + Math.max(0, Math.round(Number(rule?.count || 0))), 0);
}
function clubWorldCupDomesticFallbackCandidates(){
  const divisions = divisionOrderList().filter(division => Number(division?.order || 0) === 1);
  const candidates = [];
  const used = new Set();
  divisions.forEach(division => {
    const rows = typeof sortedStandings === 'function' ? sortedStandings(division.id) : [];
    rows.forEach(row => {
      const id = Number(row?.clubId || 0);
      const club = seed?.clubs?.find(item => Number(item.id) === id);
      if(!id || used.has(id) || !club || isSpecialCompetitionOnlyClub(club)) return;
      used.add(id);
      candidates.push(id);
    });
    (seed?.clubs || [])
      .filter(club => String(club?.divisionId || '') === String(division.id || '') && !isSpecialCompetitionOnlyClub(club))
      .sort((a,b)=>clubPrestigeValue(b.id)-clubPrestigeValue(a.id) || String(a.name || '').localeCompare(String(b.name || ''), 'es', { sensitivity:'base' }))
      .forEach(club => {
        const id = Number(club?.id || 0);
        if(!id || used.has(id)) return;
        used.add(id);
        candidates.push(id);
      });
  });
  return candidates;
}
function clubWorldCupLeagueQualifiers(){
  const ids = [];
  const used = new Set();
  const divisions = divisionOrderList();
  const expected = clubWorldCupExpectedLeagueQualifierCount();
  CLUB_WORLD_CUP_CONFIG.qualifiers.forEach(rule => {
    const targetCountry = normalizeScheduleText(rule.country || '');
    const division = divisions.find(div => normalizeScheduleText(div.country || '') === targetCountry && Number(div.order || 0) === Number(rule.order || 1));
    if(!division) return;
    sortedStandings(division.id).slice(0, Number(rule.count || 0)).forEach(row => {
      const id = Number(row.clubId || 0);
      if(id && !used.has(id)){ used.add(id); ids.push(id); }
    });
  });
  if(ids.length < expected){
    clubWorldCupDomesticFallbackCandidates().forEach(id => {
      if(ids.length >= expected || used.has(Number(id))) return;
      used.add(Number(id));
      ids.push(Number(id));
    });
  }
  return ids.slice(0, expected);
}
function clubWorldCupCountryForClub(clubId){
  const club = seed?.clubs?.find(item => Number(item.id) === Number(clubId));
  return normalizeScheduleText(club?.country || club?.pais || 'sin-pais');
}
function clubWorldCupGroupsForParticipants(participantIds=[], season=game?.seasonNumber || 1){
  const labels = ['A','B','C','D','E','F','G','H'];
  const groups = labels.slice(0, CLUB_WORLD_CUP_CONFIG.groupCount).map(label => ({ id:label, name:`Grupo ${label}`, clubIds:[] }));
  const byCountry = new Map();
  (participantIds || []).map(Number).filter(Boolean).forEach(id => {
    const key = clubWorldCupCountryForClub(id);
    if(!byCountry.has(key)) byCountry.set(key, []);
    byCountry.get(key).push(id);
  });
  const countryPools = Array.from(byCountry.entries())
    .map(([country, ids]) => ({
      country,
      ids:ids.slice().sort((a,b)=>hashNumber(`cwc-draw-${season}-${country}-${a}`, 1000000) - hashNumber(`cwc-draw-${season}-${country}-${b}`, 1000000))
    }))
    .sort((a,b)=>b.ids.length-a.ids.length || a.country.localeCompare(b.country, 'es', { sensitivity:'base' }));
  const placeClub = (clubId, country, salt=0) => {
    const candidates = groups.filter(group => group.clubIds.length < CLUB_WORLD_CUP_CONFIG.groupSize);
    if(!candidates.length) return false;
    candidates.sort((a,b) => {
      const aSame = a.clubIds.some(id => clubWorldCupCountryForClub(id) === country) ? 1 : 0;
      const bSame = b.clubIds.some(id => clubWorldCupCountryForClub(id) === country) ? 1 : 0;
      return aSame-bSame
        || a.clubIds.length-b.clubIds.length
        || hashNumber(`cwc-group-${season}-${clubId}-${a.id}-${salt}`, 1000000)-hashNumber(`cwc-group-${season}-${clubId}-${b.id}-${salt}`, 1000000);
    });
    candidates[0].clubIds.push(Number(clubId));
    return true;
  };
  let salt = 0;
  countryPools.forEach(pool => {
    pool.ids.forEach(id => placeClub(id, pool.country, salt++));
  });
  const overflow = groups.flatMap(group => group.clubIds).filter(Boolean);
  const missing = (participantIds || []).map(Number).filter(Boolean).filter(id => !overflow.includes(id));
  missing.forEach((id, index) => placeClub(id, clubWorldCupCountryForClub(id), 1000 + index));
  groups.forEach(group => { group.clubIds = group.clubIds.slice(0, CLUB_WORLD_CUP_CONFIG.groupSize); });
  return groups;
}
function clubWorldCupFixtureMatch({ season, stage, roundNumber, homeId, awayId, date='', seasonDay=0, groupId='', matchIndex=0, bracketKey='', bracketSlot='' }){
  const stadium = CLUB_WORLD_CUP_CONFIG.stadiums[Math.abs(matchIndex) % CLUB_WORLD_CUP_CONFIG.stadiums.length];
  const fixedSeasonDay = Math.max(0, Math.round(Number(seasonDay || clubWorldCupStageSeasonDay(stage, roundNumber) || 0)));
  const year = Number(game?.clubWorldCup?.year || (Number(season || 0) === Number(game?.seasonNumber || 0) ? game?.seasonYear : 0) || seasonYearForNumber(season));
  const fixedDate = validIsoDate(date) ? date : (fixedSeasonDay > 0 ? clubWorldCupIsoForSeasonDay(fixedSeasonDay, year) : '');
  return {
    id:`cwc-s${season}-${stage}-${groupId || 'ko'}-r${roundNumber}-${homeId}-${awayId}-${matchIndex}`,
    matchday:Number(game?.fixtures?.length || 0) + 1,
    divisionId:CLUB_WORLD_CUP_CONFIG.divisionId,
    divisionName:CLUB_WORLD_CUP_CONFIG.name,
    homeId:Number(homeId),
    awayId:Number(awayId),
    played:false,
    date:fixedDate,
    roundDate:fixedDate,
    seasonDay:fixedSeasonDay,
    neutral:true,
    knockout:true,
    clubWorldCup:true,
    clubWorldCupStage:stage,
    clubWorldCupGroup:groupId,
    clubWorldCupRound:Number(roundNumber || 0),
    clubWorldCupKnockout:stage !== 'groups',
    clubWorldCupBracketKey:bracketKey || '',
    clubWorldCupBracketSlot:bracketSlot || '',
    stadiumName:stadium.name,
    stadiumCapacity:stadium.capacity
  };
}
function appendClubWorldCupRound(stage, title, date, matches, seasonDay=0){
  if(!game?.fixtures || !Array.isArray(matches) || !matches.length) return false;
  const matchday = game.fixtures.length + 1;
  const fixedSeasonDay = Math.max(0, Math.round(Number(seasonDay || matches[0]?.seasonDay || clubWorldCupStageSeasonDay(stage, matches[0]?.clubWorldCupRound || 1) || 0)));
  const normalized = matches.map((match, index) => ({ ...match, matchday, date:match.date || date, roundDate:match.date || date, seasonDay:Math.max(0, Math.round(Number(match.seasonDay || fixedSeasonDay))), matchIndex:index }));
  game.fixtures.push({
    matchday,
    date,
    startDate:date,
    endDate:date,
    roundDate:date,
    seasonDay:fixedSeasonDay,
    title,
    clubWorldCupRound:true,
    clubWorldCupStage:stage,
    matches:normalized
  });
  return true;
}
function createClubWorldCupGroupFixtures(){
  const state = clubWorldCupState();
  if(!state?.groups?.length) return false;
  const season = Number(state.season || game?.seasonNumber || 1);
  const year = Number(state.year || game?.seasonYear || seasonYearForNumber(season));
  const seasonDays = clubWorldCupGroupSeasonDays();
  const dates = clubWorldCupGroupDatesFromFirstDate('', year);
  state.firstGroupDate = dates[0];
  state.groupDates = dates.slice();
  state.groupSeasonDays = seasonDays.slice();
  const pairings = [ [[0,1],[2,3]], [[0,2],[1,3]], [[0,3],[1,2]] ];
  pairings.forEach((roundPairings, roundIndex) => {
    const matches = [];
    state.groups.forEach((group, groupIndex) => {
      roundPairings.forEach(pair => {
        const homeId = group.clubIds[pair[0]];
        const awayId = group.clubIds[pair[1]];
        if(!homeId || !awayId) return;
        matches.push(clubWorldCupFixtureMatch({ season, stage:'groups', roundNumber:roundIndex + 1, groupId:group.id, homeId, awayId, date:dates[roundIndex], seasonDay:seasonDays[roundIndex], matchIndex:(roundIndex * 20) + (groupIndex * 2) + matches.length }));
      });
    });
    appendClubWorldCupRound('groups', `${CLUB_WORLD_CUP_CONFIG.name} · Grupos ${roundIndex + 1}/3`, dates[roundIndex], matches, seasonDays[roundIndex]);
  });
  return true;
}
function clubWorldCupScheduleSeasonDays(){
  const raw = CLUB_WORLD_CUP_CONFIG?.scheduleSeasonDays || {};
  const groups = Array.isArray(raw.groups) ? raw.groups : [];
  return {
    draw:clamp(Math.round(Number(raw.draw || 295)), 1, 365),
    groups:[
      clamp(Math.round(Number(groups[0] || 305)), 1, 365),
      clamp(Math.round(Number(groups[1] || 310)), 1, 365),
      clamp(Math.round(Number(groups[2] || 315)), 1, 365)
    ],
    r16:clamp(Math.round(Number(raw.r16 || 320)), 1, 365),
    qf:clamp(Math.round(Number(raw.qf || 325)), 1, 365),
    sf:clamp(Math.round(Number(raw.sf || 330)), 1, 365),
    thirdPlace:clamp(Math.round(Number(raw.thirdPlace || 335)), 1, 365),
    final:clamp(Math.round(Number(raw.final || 336)), 1, 365)
  };
}
function clubWorldCupFixtureReadySeasonDay(){
  return clubWorldCupScheduleSeasonDays().draw;
}
function clubWorldCupIsoForSeasonDay(day, year=currentSeasonYear()){
  const safeDay = clamp(Math.round(Number(day || 1)), 1, daysInSeasonYear(year));
  return addDaysToIsoDate(seasonStartDateForYear(year), safeDay - 1);
}
function clubWorldCupCurrentSeasonDay(){
  if(typeof currentSeasonDayNumber === 'function') return Number(currentSeasonDayNumber() || 0);
  const iso = currentCalendarDate?.() || game?.currentDate || dateForSeasonState(game);
  return Number(seasonDayFromDate(iso, currentSeasonYear()) || 0);
}
function clubWorldCupDrawDate(year=currentSeasonYear()){
  return clubWorldCupIsoForSeasonDay(clubWorldCupFixtureReadySeasonDay(), year);
}
function clubWorldCupGroupSeasonDays(){
  return clubWorldCupScheduleSeasonDays().groups.slice();
}
function clubWorldCupGroupDatesFromFirstDate(_firstDate, year=currentSeasonYear()){
  return clubWorldCupGroupSeasonDays().map(day => clubWorldCupIsoForSeasonDay(day, year));
}
function clubWorldCupStageSeasonDay(stage, roundNumber=1){
  const schedule = clubWorldCupScheduleSeasonDays();
  const cleanStage = String(stage || '');
  if(cleanStage === 'groups') return schedule.groups[clamp(Math.round(Number(roundNumber || 1)), 1, 3) - 1];
  return Number(schedule[cleanStage] || 0);
}
function clubWorldCupStageDate(stage, roundNumber=1, year=currentSeasonYear()){
  const day = clubWorldCupStageSeasonDay(stage, roundNumber);
  return day > 0 ? clubWorldCupIsoForSeasonDay(day, year) : '';
}
function clubWorldCupRoundNumberFromRound(round, fallback=1){
  const nums = (round?.matches || []).map(match => Number(match?.clubWorldCupRound || 0)).filter(n => n > 0);
  if(nums.length) return Math.min(...nums);
  return Number(fallback || 1);
}
function repairClubWorldCupFixtureSchedule(options={}){
  if(!game?.fixtures || !clubWorldCupState?.()) return false;
  const state = clubWorldCupState();
  const season = Number(state.season || game?.seasonNumber || 1);
  const year = Number(state.year || game?.seasonYear || seasonYearForNumber(season));
  const schedule = clubWorldCupScheduleSeasonDays();
  let changed = false;
  const rounds = (game.fixtures || []).filter(round => round?.clubWorldCupRound || (round?.matches || []).some(match => match?.clubWorldCup));
  rounds.forEach(round => {
    const sample = (round.matches || []).find(match => match?.clubWorldCup) || null;
    const stage = String(round.clubWorldCupStage || sample?.clubWorldCupStage || '');
    const roundNumber = clubWorldCupRoundNumberFromRound(round, 1);
    const seasonDay = clubWorldCupStageSeasonDay(stage, roundNumber);
    if(seasonDay <= 0) return;
    const date = clubWorldCupIsoForSeasonDay(seasonDay, year);
    const roundNeedsChange = Number(round.seasonDay || 0) !== seasonDay
      || round.date !== date || round.startDate !== date || round.endDate !== date || round.roundDate !== date;
    if(roundNeedsChange) changed = true;
    round.seasonDay = seasonDay;
    round.date = date;
    round.startDate = date;
    round.endDate = date;
    round.roundDate = date;
    round.clubWorldCupStage = stage;
    (round.matches || []).forEach(match => {
      if(!match?.clubWorldCup) return;
      const matchRound = Math.max(1, Math.round(Number(match.clubWorldCupRound || roundNumber || 1)));
      const matchSeasonDay = clubWorldCupStageSeasonDay(String(match.clubWorldCupStage || stage), matchRound) || seasonDay;
      const matchDate = clubWorldCupIsoForSeasonDay(matchSeasonDay, year);
      if(Number(match.seasonDay || 0) !== matchSeasonDay || match.date !== matchDate || match.roundDate !== matchDate) changed = true;
      match.seasonDay = matchSeasonDay;
      match.date = matchDate;
      match.roundDate = matchDate;
      match.clubWorldCupRound = matchRound;
      const history = (game.matchHistory || []).find(item => item?.id === match.id);
      if(history){
        history.seasonDay = matchSeasonDay;
        history.date = matchDate;
        history.roundDate = matchDate;
      }
    });
  });
  const groupDates = schedule.groups.map(day => clubWorldCupIsoForSeasonDay(day, year));
  const stateSchedule = {
    draw:schedule.draw,
    groups:schedule.groups.slice(),
    r16:schedule.r16,
    qf:schedule.qf,
    sf:schedule.sf,
    thirdPlace:schedule.thirdPlace,
    final:schedule.final
  };
  if(Number(state.year || 0) !== year) changed = true;
  if(Number(state.drawSeasonDay || 0) !== schedule.draw) changed = true;
  if(JSON.stringify(state.groupSeasonDays || []) !== JSON.stringify(schedule.groups)) changed = true;
  if(JSON.stringify(state.stageSeasonDays || {}) !== JSON.stringify({ r16:schedule.r16, qf:schedule.qf, sf:schedule.sf, thirdPlace:schedule.thirdPlace, final:schedule.final })) changed = true;
  if(state.drawDate !== clubWorldCupIsoForSeasonDay(schedule.draw, year)) changed = true;
  if(JSON.stringify(state.groupDates || []) !== JSON.stringify(groupDates)) changed = true;
  state.year = year;
  state.drawSeasonDay = schedule.draw;
  state.groupSeasonDays = schedule.groups.slice();
  state.stageSeasonDays = { r16:schedule.r16, qf:schedule.qf, sf:schedule.sf, thirdPlace:schedule.thirdPlace, final:schedule.final };
  state.scheduleSeasonDays = stateSchedule;
  state.drawDate = clubWorldCupIsoForSeasonDay(schedule.draw, year);
  state.firstGroupDate = groupDates[0];
  state.groupDates = groupDates;
  state.fixtureReadySeasonDay = schedule.draw;
  if(changed || options.force){
    state.fixtureDatesRepairedAt = Date.now();
    state.fixtureScheduleMode = 'season-day-fixed';
  }
  return Boolean(changed || options.force);
}
function repairClubWorldCupGroupFixtureDates(options={}){
  return repairClubWorldCupFixtureSchedule(options);
}
function clubWorldCupCanCreateFixtureNow(){
  if(!game) return false;
  return clubWorldCupCurrentSeasonDay() >= clubWorldCupFixtureReadySeasonDay();
}
function clubWorldCupStateStructureInfo(state, season=game?.seasonNumber || 1){
  const participantIds = clubWorldCupParticipantIds(state);
  const groups = Array.isArray(state?.groups) ? state.groups : [];
  const groupClubIds = groups.flatMap(group => Array.isArray(group?.clubIds) ? group.clubIds.map(Number).filter(Boolean) : []);
  const completedLegacy = String(state?.status || '') === 'completed' && Number(state?.championId || 0) > 0;
  const validGroups = groups.length === Number(CLUB_WORLD_CUP_CONFIG.groupCount || 8)
    && groups.every(group => Array.isArray(group?.clubIds) && group.clubIds.map(Number).filter(Boolean).length === Number(CLUB_WORLD_CUP_CONFIG.groupSize || 4));
  const uniqueGroupIds = new Set(groupClubIds);
  const validParticipants = participantIds.length === Number(CLUB_WORLD_CUP_CONFIG.groupCount || 8) * Number(CLUB_WORLD_CUP_CONFIG.groupSize || 4)
    && uniqueGroupIds.size === participantIds.length
    && participantIds.every(id => uniqueGroupIds.has(Number(id)));
  return {
    sameSeason:Number(state?.season || 0) === Number(season || 1),
    completedLegacy,
    validGroups,
    validParticipants,
    usable:completedLegacy || (validGroups && validParticipants),
    participantCount:participantIds.length,
    groupCount:groups.length
  };
}
function removeBrokenClubWorldCupFixtures(){
  if(!Array.isArray(game?.fixtures)) return 0;
  const before = game.fixtures.length;
  game.fixtures = game.fixtures.filter(round => !round?.clubWorldCupRound && !(round?.matches || []).some(match => match?.clubWorldCup));
  if(Array.isArray(game.matchHistory)) game.matchHistory = game.matchHistory.filter(match => !match?.clubWorldCup);
  return before - game.fixtures.length;
}
function resetBrokenClubWorldCupState(reason='estructura incompleta'){
  if(!game?.clubWorldCup) return false;
  game.clubWorldCupGenerationRecoveries = Array.isArray(game.clubWorldCupGenerationRecoveries) ? game.clubWorldCupGenerationRecoveries.slice(-9) : [];
  game.clubWorldCupGenerationRecoveries.push({
    season:Number(game.seasonNumber || 1),
    day:typeof clubWorldCupCurrentSeasonDay === 'function' ? Number(clubWorldCupCurrentSeasonDay() || 0) : 0,
    reason:String(reason || 'estructura incompleta'),
    removedRounds:removeBrokenClubWorldCupFixtures(),
    repairedAt:Date.now()
  });
  game.clubWorldCup = null;
  return true;
}
function ensureClubWorldCupCurrentSeason(options={}){
  const result = { changed:false, created:false, repaired:false, reason:'' };
  if(!game || !CLUB_WORLD_CUP_CONFIG.enabled || !Array.isArray(game.fixtures)) return result;
  if(typeof managerChallengeIs === 'function' && managerChallengeIs()) return result;
  if(!clubWorldCupCanCreateFixtureNow()) return result;
  const season = Number(game.seasonNumber || 1);
  const raw = game.clubWorldCup;
  if(raw){
    const info = clubWorldCupStateStructureInfo(raw, season);
    if(!info.sameSeason){
      resetBrokenClubWorldCupState('edición perteneciente a otra temporada');
      result.changed = true;
      result.repaired = true;
    }else if(!info.usable){
      const existingCupMatches = (game.fixtures || []).flatMap(round => round?.matches || []).filter(match => match?.clubWorldCup);
      if(existingCupMatches.some(match => match?.played)){
        result.reason = `estado incompleto con ${existingCupMatches.filter(match => match?.played).length} partido(s) ya jugado(s); no se reinició automáticamente`;
        return result;
      }
      resetBrokenClubWorldCupState(`estado incompleto: ${info.participantCount} participantes y ${info.groupCount} grupos`);
      result.changed = true;
      result.repaired = true;
    }else if(!info.completedLegacy && String(raw.status || '') === 'groups' && clubWorldCupStageMatches('groups').length === 0){
      const createdFixtures = createClubWorldCupGroupFixtures();
      if(createdFixtures){
        repairClubWorldCupGroupFixtureDates({ force:true });
        result.changed = true;
        result.repaired = true;
        result.reason = 'fixture de grupos reconstruido';
      }
      if(typeof prepareClubWorldCupParticipantsIfNeeded === 'function'){
        const prep = prepareClubWorldCupParticipantsIfNeeded({ source:options.source || 'ensure_rebuilt_fixture' });
        if(prep.changed) result.changed = true;
      }
      return result;
    }else{
      if(repairClubWorldCupFixtureSchedule()){
        result.changed = true;
        result.repaired = true;
        result.reason = 'calendario realineado por día de temporada';
      }
      if(typeof prepareClubWorldCupParticipantsIfNeeded === 'function'){
        const prep = prepareClubWorldCupParticipantsIfNeeded({ source:options.source || 'ensure_existing' });
        if(prep.changed) result.changed = true;
      }
      return result;
    }
  }
  const created = createClubWorldCupIfNeeded({ skipEnsure:true });
  result.created = Boolean(created);
  result.changed = result.changed || result.created;
  if(result.created) result.reason = 'edición generada';
  if(typeof prepareClubWorldCupParticipantsIfNeeded === 'function'){
    const prep = prepareClubWorldCupParticipantsIfNeeded({ source:options.source || 'ensure_created' });
    if(prep.changed) result.changed = true;
  }
  return result;
}
function createClubWorldCupIfNeeded(options={}){
  if(!game || !CLUB_WORLD_CUP_CONFIG.enabled || !Array.isArray(game.fixtures)) return false;
  if(typeof managerChallengeIs === 'function' && managerChallengeIs()) return false;
  const season = Number(game.seasonNumber || 1);
  if(!clubWorldCupCanCreateFixtureNow()) return false;
  if(!options.skipEnsure){
    const raw = game.clubWorldCup;
    if(raw){
      const info = clubWorldCupStateStructureInfo(raw, season);
      if(info.sameSeason && info.usable) return false;
      resetBrokenClubWorldCupState(info.sameSeason ? 'estado inválido al intentar el sorteo' : 'edición de otra temporada');
    }
  }
  ensureClubWorldCupInvitedData();
  const leagueIds = clubWorldCupLeagueQualifiers();
  const invitedIds = clubWorldCupSelectedInvites(season);
  const used = new Set();
  const participantIds = [...leagueIds, ...invitedIds].map(Number).filter(id => id && !used.has(id) && used.add(id)).slice(0, 32);
  if(participantIds.length < 32){
    clubWorldCupDomesticFallbackCandidates().forEach(id => {
      if(participantIds.length >= 32 || used.has(Number(id))) return;
      used.add(Number(id));
      participantIds.push(Number(id));
    });
  }
  if(participantIds.length < 32){
    game.clubWorldCupGenerationIssue = {
      season,
      day:typeof clubWorldCupCurrentSeasonDay === 'function' ? Number(clubWorldCupCurrentSeasonDay() || 0) : 0,
      reason:`No se pudieron reunir 32 participantes. Disponibles: ${participantIds.length}.`,
      leagueCount:leagueIds.length,
      invitedCount:invitedIds.length,
      checkedAt:Date.now()
    };
    return false;
  }
  const groups = clubWorldCupGroupsForParticipants(participantIds, season);
  const groupCount = groups.length;
  const completeGroups = groups.filter(group => Array.isArray(group?.clubIds) && group.clubIds.length === CLUB_WORLD_CUP_CONFIG.groupSize).length;
  if(groupCount !== CLUB_WORLD_CUP_CONFIG.groupCount || completeGroups !== CLUB_WORLD_CUP_CONFIG.groupCount){
    game.clubWorldCupGenerationIssue = {
      season,
      day:typeof clubWorldCupCurrentSeasonDay === 'function' ? Number(clubWorldCupCurrentSeasonDay() || 0) : 0,
      reason:`El sorteo produjo ${completeGroups}/${CLUB_WORLD_CUP_CONFIG.groupCount} grupos completos.`,
      checkedAt:Date.now()
    };
    return false;
  }
  const year = currentSeasonYear();
  const schedule = clubWorldCupScheduleSeasonDays();
  const groupDates = clubWorldCupGroupDatesFromFirstDate('', year);
  const firstGroupDate = groupDates[0];
  game.clubWorldCup = {
    season,
    year,
    name:CLUB_WORLD_CUP_CONFIG.name,
    status:'groups',
    created:true,
    participantClubIds:participantIds,
    invitedClubIds:invitedIds,
    leagueClubIds:leagueIds,
    groups,
    prizesPaid:{},
    championId:0,
    runnerUpId:0,
    createdAt:Date.now(),
    fixtureCreatedDate:currentCalendarDate?.() || game.currentDate || '',
    fixtureScheduleMode:'season-day-fixed',
    drawSeasonDay:schedule.draw,
    groupSeasonDays:schedule.groups.slice(),
    stageSeasonDays:{ r16:schedule.r16, qf:schedule.qf, sf:schedule.sf, thirdPlace:schedule.thirdPlace, final:schedule.final },
    scheduleSeasonDays:{ ...schedule, groups:schedule.groups.slice() },
    drawDate:clubWorldCupDrawDate(year),
    firstGroupDate,
    groupDates,
    fixtureReadySeasonDay:schedule.draw
  };
  delete game.clubWorldCupGenerationIssue;
  createClubWorldCupGroupFixtures();
  repairClubWorldCupFixtureSchedule({ force:true });
  if(clubWorldCupClubParticipates(game.selectedClubId, game.clubWorldCup)) awardClubWorldCupPrizeIfManaged(game.selectedClubId, 'participate');
  pushGameMessage({
    type:'deportivo',
    priority:'high',
    title:CLUB_WORLD_CUP_CONFIG.name,
    body:`Se sortearon 8 grupos de 4 equipos. Calendario fijo: día ${schedule.groups[0]}, día ${schedule.groups[1]} y día ${schedule.groups[2]}. Participan los mejores clubes de primera división y 4 invitados especiales: ${invitedIds.map(clubName).join(', ')}.`,
    id:`club-world-cup-${season}-created`
  });
  return true;
}
function clubWorldCupGroupStandings(groupId){
  const state = clubWorldCupState();
  const group = state?.groups?.find(item => String(item.id) === String(groupId));
  if(!group) return [];
  const rows = Object.fromEntries(group.clubIds.map(id => [Number(id), { clubId:Number(id), pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, dg:0, pts:0 }]));
  clubWorldCupStageMatches('groups').filter(match => String(match.clubWorldCupGroup) === String(groupId) && match.played).forEach(match => {
    const h = rows[Number(match.homeId)];
    const a = rows[Number(match.awayId)];
    if(!h || !a) return;
    const hg = Number(match.homeGoals || 0);
    const ag = Number(match.awayGoals || 0);
    h.pj++; a.pj++;
    h.gf += hg; h.gc += ag; a.gf += ag; a.gc += hg;
    if(hg > ag){ h.pg++; a.pp++; h.pts += 3; }
    else if(hg < ag){ a.pg++; h.pp++; a.pts += 3; }
    else { h.pe++; a.pe++; h.pts += 1; a.pts += 1; }
    h.dg = h.gf - h.gc; a.dg = a.gf - a.gc;
  });
  return Object.values(rows).sort((a,b)=>b.pts-a.pts || b.dg-a.dg || b.gf-a.gf || clubPrestigeValue(b.clubId)-clubPrestigeValue(a.clubId) || clubName(a.clubId).localeCompare(clubName(b.clubId), 'es', { sensitivity:'base' }));
}
function clubWorldCupQualifiedFromGroups(){
  const state = clubWorldCupState();
  if(!state?.groups?.length) return [];
  return state.groups.flatMap(group => clubWorldCupGroupStandings(group.id).slice(0,2).map(row => Number(row.clubId))).filter(Boolean);
}
function clubWorldCupKnockoutWinner(match){
  if(!match?.played) return 0;
  if(Number(match.winnerClubId || 0)) return Number(match.winnerClubId);
  const hg = Number(match.homeGoals || 0);
  const ag = Number(match.awayGoals || 0);
  if(hg > ag) return Number(match.homeId || 0);
  if(ag > hg) return Number(match.awayId || 0);
  const pens = match.penaltyShootout || {};
  if(Number(pens.home || 0) > Number(pens.away || 0)) return Number(match.homeId || 0);
  if(Number(pens.away || 0) > Number(pens.home || 0)) return Number(match.awayId || 0);
  return Number(match.homeId || 0);
}
function createClubWorldCupKnockoutStage(stage, participants){
  const state = clubWorldCupState();
  if(!state || !Array.isArray(participants) || participants.length < 2) return false;
  const season = Number(state.season || game?.seasonNumber || 1);
  const year = Number(state.year || game?.seasonYear || seasonYearForNumber(season));
  const stageTitles = { r16:'Octavos de final', qf:'Cuartos de final', sf:'Semifinales', final:'Final', thirdPlace:'Partido por el 3er puesto' };
  const seasonDay = clubWorldCupStageSeasonDay(stage, 1);
  const date = clubWorldCupIsoForSeasonDay(seasonDay, year);
  const matches = [];
  for(let i=0;i<participants.length;i+=2){
    const homeId = Number(participants[i]);
    const awayId = Number(participants[i+1]);
    if(!homeId || !awayId) continue;
    const matchNumber = Math.floor(i / 2);
    let bracketKey = '';
    let bracketSlot = '';
    if(stage === 'r16'){
      bracketKey = `Llave ${Math.floor(matchNumber / 2) + 1}`;
      bracketSlot = matchNumber % 2 === 0 ? '1° grupo impar vs 2° grupo siguiente' : '2° grupo impar vs 1° grupo siguiente';
    }else if(stage === 'qf'){
      bracketKey = `Llave ${matchNumber + 1}`;
      bracketSlot = 'Ganadores de octavos';
    }else if(stage === 'sf'){
      bracketKey = `Semifinal ${matchNumber + 1}`;
      bracketSlot = matchNumber === 0 ? 'Ganador Llave 1 vs Ganador Llave 2' : 'Ganador Llave 3 vs Ganador Llave 4';
    }
    matches.push(clubWorldCupFixtureMatch({ season, stage, roundNumber:1, homeId, awayId, date, seasonDay, matchIndex:i, bracketKey, bracketSlot }));
  }
  const title = `${CLUB_WORLD_CUP_CONFIG.name} · ${stageTitles[stage] || stage}`;
  const created = appendClubWorldCupRound(stage, title, date, matches, seasonDay);
  if(created){
    state.status = stage;
    state[`${stage}ClubIds`] = participants.map(Number).filter(Boolean);
    repairClubWorldCupFixtureSchedule();
    pushGameMessage({ type:'deportivo', priority:'normal', title, body:`Ya están definidos los cruces de ${stageTitles[stage] || stage}. Se jugarán el día ${seasonDay}.`, id:`club-world-cup-${season}-${stage}` });
  }
  return created;
}
function clubWorldCupWinnersFromStage(stage){
  return clubWorldCupStageMatches(stage).filter(match => match.played).map(clubWorldCupKnockoutWinner).filter(Boolean);
}
function clubWorldCupLosersFromStage(stage){
  return clubWorldCupStageMatches(stage).filter(match => match.played).map(match => {
    const winner = clubWorldCupKnockoutWinner(match);
    const homeId = Number(match.homeId || 0);
    const awayId = Number(match.awayId || 0);
    if(!winner || !homeId || !awayId) return 0;
    return winner === homeId ? awayId : homeId;
  }).filter(Boolean);
}
function createClubWorldCupFinalStages(finalists=[], thirdPlaceClubs=[]){
  const state = clubWorldCupState();
  if(!state || !Array.isArray(finalists) || finalists.length < 2 || !Array.isArray(thirdPlaceClubs) || thirdPlaceClubs.length < 2) return false;
  const season = Number(state.season || game?.seasonNumber || 1);
  const year = Number(state.year || game?.seasonYear || seasonYearForNumber(season));
  const thirdPlaceSeasonDay = clubWorldCupStageSeasonDay('thirdPlace', 1);
  const finalSeasonDay = clubWorldCupStageSeasonDay('final', 1);
  const thirdPlaceDate = clubWorldCupIsoForSeasonDay(thirdPlaceSeasonDay, year);
  const finalDate = clubWorldCupIsoForSeasonDay(finalSeasonDay, year);
  const thirdMatches = [clubWorldCupFixtureMatch({ season, stage:'thirdPlace', roundNumber:1, homeId:Number(thirdPlaceClubs[0]), awayId:Number(thirdPlaceClubs[1]), date:thirdPlaceDate, seasonDay:thirdPlaceSeasonDay, matchIndex:0 })];
  const finalMatches = [clubWorldCupFixtureMatch({ season, stage:'final', roundNumber:1, homeId:Number(finalists[0]), awayId:Number(finalists[1]), date:finalDate, seasonDay:finalSeasonDay, matchIndex:1 })];
  const thirdCreated = appendClubWorldCupRound('thirdPlace', `${CLUB_WORLD_CUP_CONFIG.name} · Partido por el 3er puesto`, thirdPlaceDate, thirdMatches, thirdPlaceSeasonDay);
  const finalCreated = appendClubWorldCupRound('final', `${CLUB_WORLD_CUP_CONFIG.name} · Final`, finalDate, finalMatches, finalSeasonDay);
  if(thirdCreated && finalCreated){
    state.status = 'final';
    state.finalClubIds = finalists.map(Number).filter(Boolean);
    state.thirdPlaceClubIds = thirdPlaceClubs.map(Number).filter(Boolean);
    repairClubWorldCupFixtureSchedule();
    pushGameMessage({ type:'deportivo', priority:'normal', title:`${CLUB_WORLD_CUP_CONFIG.name} · Final`, body:`El tercer puesto se jugará el día ${thirdPlaceSeasonDay} y la final el día ${finalSeasonDay}.`, id:`club-world-cup-${season}-final` });
    return true;
  }
  return false;
}
function awardClubWorldCupPrizeIfManaged(clubId, stage){
  if(!game || !stage) return false;
  const managedId = Number(game.selectedClubId || 0);
  const cleanClubId = Number(clubId || 0);
  if(!managedId || cleanClubId !== managedId) return false;
  const state = clubWorldCupState();
  if(!state || !clubWorldCupClubParticipates(cleanClubId, state)) return false;
  const amount = Number(CLUB_WORLD_CUP_CONFIG.prizes?.[stage] || 0);
  if(amount <= 0) return false;
  state.prizesPaid = state.prizesPaid || {};
  const key = String(stage);
  const paid = state.prizesPaid[managedId] || {};
  if(paid[key]) return false;
  paid[key] = amount;
  state.prizesPaid[managedId] = paid;
  game.budget = Math.round(Number(game.budget || 0) + amount);
  game.lastBudgetDelta = Math.round(Number(game.lastBudgetDelta || 0) + amount);
  const labels = { participate:'Participación', groups:'Pasar grupos', qf:'Cuartos', sf:'Semifinal', runnerUp:'Subcampeón', champion:'Campeón' };
  pushGameMessage({
    type:'finanzas',
    priority:'normal',
    title:`Premio ${CLUB_WORLD_CUP_CONFIG.name}`,
    body:`${labels[key] || key}: ${formatMoney(amount)} acreditados a ${clubName(managedId)}.`,
    id:`club-world-cup-prize-${state.season}-${managedId}-${key}`
  });
  return true;
}
function finalizeClubWorldCupMatchResult(match, result){
  if(!match?.clubWorldCup || !result) return result;
  const out = { ...result, clubWorldCup:true, clubWorldCupStage:match.clubWorldCupStage, clubWorldCupGroup:match.clubWorldCupGroup || '' };
  if(match.clubWorldCupKnockout){
    const hg = Number(out.homeGoals || 0);
    const ag = Number(out.awayGoals || 0);
    if(hg > ag) out.winnerClubId = Number(match.homeId);
    else if(ag > hg) out.winnerClubId = Number(match.awayId);
    else{
      const homeFouls = Number(out.matchStats?.home?.fouls ?? match.matchStats?.home?.fouls ?? 0);
      const awayFouls = Number(out.matchStats?.away?.fouls ?? match.matchStats?.away?.fouls ?? 0);
      const homeCards = (out.cards || []).filter(card => Number(card.clubId) === Number(match.homeId)).reduce((sum, card) => sum + (card.type === 'red' || card.type === 'secondYellowRed' ? 3 : 1), 0);
      const awayCards = (out.cards || []).filter(card => Number(card.clubId) === Number(match.awayId)).reduce((sum, card) => sum + (card.type === 'red' || card.type === 'secondYellowRed' ? 3 : 1), 0);
      let homeWins = false;
      if(homeFouls !== awayFouls) homeWins = homeFouls < awayFouls;
      else if(homeCards !== awayCards) homeWins = homeCards < awayCards;
      else homeWins = hashNumber(`${match.id}-fouls-tiebreak-home`, 1000000) <= hashNumber(`${match.id}-fouls-tiebreak-away`, 1000000);
      out.winnerClubId = homeWins ? Number(match.homeId) : Number(match.awayId);
      out.clubWorldCupTiebreaker = { type:'fouls', homeFouls, awayFouls, homeCards, awayCards, winnerClubId:out.winnerClubId };
      delete out.penaltyShootout;
    }
    out.clubWorldCupResolved = true;
  }
  return out;
}
function advanceClubWorldCupIfNeeded(){
  const state = clubWorldCupState();
  if(!game || !state || state.status === 'completed') return false;
  if(state.status === 'groups' && clubWorldCupStageComplete('groups')){
    const qualified = clubWorldCupQualifiedFromGroups();
    state.r16ClubIds = qualified;
    if(qualified.includes(Number(game.selectedClubId))) awardClubWorldCupPrizeIfManaged(game.selectedClubId, 'groups');
    const groupOrder = state.groups || [];
    const participants = [];
    for(let i=0;i<groupOrder.length;i+=2){
      const g1 = clubWorldCupGroupStandings(groupOrder[i].id);
      const g2 = clubWorldCupGroupStandings(groupOrder[i+1].id);
      participants.push(g1[0]?.clubId, g2[1]?.clubId, g2[0]?.clubId, g1[1]?.clubId);
    }
    return createClubWorldCupKnockoutStage('r16', participants.filter(Boolean));
  }
  if(state.status === 'r16' && clubWorldCupStageComplete('r16')){
    const winners = clubWorldCupWinnersFromStage('r16');
    if(winners.includes(Number(game.selectedClubId))) awardClubWorldCupPrizeIfManaged(game.selectedClubId, 'qf');
    return createClubWorldCupKnockoutStage('qf', winners);
  }
  if(state.status === 'qf' && clubWorldCupStageComplete('qf')){
    const winners = clubWorldCupWinnersFromStage('qf');
    if(winners.includes(Number(game.selectedClubId))) awardClubWorldCupPrizeIfManaged(game.selectedClubId, 'sf');
    return createClubWorldCupKnockoutStage('sf', winners);
  }
  if(state.status === 'sf' && clubWorldCupStageComplete('sf')){
    return createClubWorldCupFinalStages(clubWorldCupWinnersFromStage('sf'), clubWorldCupLosersFromStage('sf'));
  }
  if(state.status === 'final' && clubWorldCupStageComplete('thirdPlace') && clubWorldCupStageComplete('final')){
    const final = clubWorldCupStageMatches('final')[0];
    const thirdPlaceMatch = clubWorldCupStageMatches('thirdPlace')[0];
    const championId = clubWorldCupKnockoutWinner(final);
    const runnerUpId = championId === Number(final.homeId) ? Number(final.awayId) : Number(final.homeId);
    const thirdPlaceId = thirdPlaceMatch ? clubWorldCupKnockoutWinner(thirdPlaceMatch) : 0;
    state.championId = championId;
    state.runnerUpId = runnerUpId;
    state.thirdPlaceId = thirdPlaceId;
    state.status = 'completed';
    archiveClubWorldCupEditionForState(game, { allowIncomplete:false });
    recordCompetitionChampion({
      season:state.season || game.seasonNumber || 1,
      year:game.seasonYear || seasonYearForNumber(state.season || game.seasonNumber || 1),
      type:'club_world_cup',
      competitionId:'club-world-cup',
      competitionName:state.name || CLUB_WORLD_CUP_CONFIG.name,
      championId,
      runnerUpId,
      thirdPlaceId
    });
    awardClubWorldCupPrizeIfManaged(runnerUpId, 'runnerUp');
    awardClubWorldCupPrizeIfManaged(championId, 'champion');
    if(Number(game.selectedClubId || 0) === championId){
      if(typeof addManagerPrestige === 'function') addManagerPrestige(4, `Campeón de ${CLUB_WORLD_CUP_CONFIG.name}`);
      recordManagerOfficialTitleForState(game, {
        season:state.season || game.seasonNumber || 1,
        year:game.seasonYear || seasonYearForNumber(state.season || game.seasonNumber || 1),
        type:'club_world_cup',
        competitionId:'club-world-cup',
        competitionName:state.name || CLUB_WORLD_CUP_CONFIG.name,
        clubId:championId,
        clubName:clubName(championId)
      });
      if(typeof checkManagerAchievements === 'function') checkManagerAchievements({ silent:false });
    }
    pushGameMessage({ type:'deportivo', priority:'high', title:`Campeón: ${clubName(championId)}`, body:`${clubName(championId)} ganó la ${CLUB_WORLD_CUP_CONFIG.name}.`, id:`club-world-cup-${state.season}-champion` });
    return true;
  }
  return false;
}
function createPostRegularCompetitionsIfNeeded(){
  if(!game || game.seasonFinalized || !Array.isArray(game.fixtures)) return null;
  if(typeof managerChallengeIs === 'function' && managerChallengeIs()) return null;
  const createdKinds = [];
  if(typeof createArgentinePromotionPlayoffsIfNeeded === 'function' && createArgentinePromotionPlayoffsIfNeeded()){
    createdKinds.push('promotion_playoff');
  }
  const clubWorldCupEnsure = typeof ensureClubWorldCupCurrentSeason === 'function' ? ensureClubWorldCupCurrentSeason({ source:'post-regular-check' }) : { created:createClubWorldCupIfNeeded(), changed:false, repaired:false };
  if(clubWorldCupEnsure?.created){
    createdKinds.push('club_world_cup');
  }else if(clubWorldCupEnsure?.changed){
    createdKinds.push('club_world_cup_repaired');
  }
  if(createdKinds.length){
    if(typeof repairClubWorldCupFixtureSchedule === 'function') repairClubWorldCupFixtureSchedule({ force:true });
    else if(typeof repairClubWorldCupGroupFixtureDates === 'function') repairClubWorldCupGroupFixtureDates({ force:true });
    const messages = [];
    if(createdKinds.includes('promotion_playoff')) messages.push('Se creó el calendario de playoffs de promoción');
    if(createdKinds.includes('club_world_cup')) messages.push(`se sorteó la Copa Mundial de Clubes de la FIFA el día ${clubWorldCupFixtureReadySeasonDay()}, con la primera fecha programada para el día ${clubWorldCupGroupSeasonDays()[0]}`);
    if(createdKinds.includes('club_world_cup_repaired')) messages.push('se reparó y reconstruyó el calendario del Mundial de Clubes');
    return { created:true, kind:createdKinds.join('+'), message:`${messages.join(' y ')}.` };
  }
  if(typeof repairClubWorldCupFixtureSchedule === 'function') repairClubWorldCupFixtureSchedule();
  else if(typeof repairClubWorldCupGroupFixtureDates === 'function') repairClubWorldCupGroupFixtureDates();
  if(advanceClubWorldCupIfNeeded()){
    const state = clubWorldCupState();
    const done = state?.status === 'completed';
    return { created:true, kind:'club_world_cup', completed:done, message:done ? 'Finalizó la Copa Mundial de Clubes de la FIFA.' : 'Se creó la siguiente fase de la Copa Mundial de Clubes de la FIFA.' };
  }
  return null;
}

function clubWorldCupPlayedMatches(){
  return (game?.fixtures || [])
    .filter(round => round?.clubWorldCupRound)
    .flatMap(round => round.matches || [])
    .filter(match => match?.clubWorldCup && match.played);
}
function clubWorldCupEnsurePlayerStat(map, playerId, clubId){
  const id = Number(playerId || 0);
  if(!id) return null;
  if(!map.has(id)){
    const player = playerById(id) || {};
    map.set(id, { playerId:id, clubId:Number(clubId || player.clubId || 0), played:0, goals:0, assists:0, yellow:0, red:0, injuries:0, keySaves:0, errors:0, goalErrors:0 });
  }
  return map.get(id);
}
function clubWorldCupTournamentPlayerStats(){
  const map = new Map();
  clubWorldCupPlayedMatches().forEach(match => {
    const homeIds = (match.playedIdsHome || match.starterIdsHome || []).map(Number).filter(Boolean);
    const awayIds = (match.playedIdsAway || match.starterIdsAway || []).map(Number).filter(Boolean);
    homeIds.forEach(id => { const row = clubWorldCupEnsurePlayerStat(map, id, match.homeId); if(row) row.played += 1; });
    awayIds.forEach(id => { const row = clubWorldCupEnsurePlayerStat(map, id, match.awayId); if(row) row.played += 1; });
    (match.goals || []).forEach(goal => {
      const row = clubWorldCupEnsurePlayerStat(map, goal.playerId, goal.clubId);
      if(row) row.goals += 1;
      if(goal.assistId){
        const assist = clubWorldCupEnsurePlayerStat(map, goal.assistId, goal.clubId);
        if(assist) assist.assists += 1;
      }
    });
    (match.cards || []).forEach(card => {
      const row = clubWorldCupEnsurePlayerStat(map, card.playerId, card.clubId);
      if(!row) return;
      if(card.type === 'yellow') row.yellow += 1;
      if(card.type === 'secondYellowRed'){ row.yellow += 1; row.red += 1; }
      if(card.type === 'red') row.red += 1;
    });
    (match.injuries || []).forEach(injury => {
      const row = clubWorldCupEnsurePlayerStat(map, injury.playerId, injury.clubId);
      if(row) row.injuries += 1;
    });
    (match.keySaves || []).forEach(save => {
      const row = clubWorldCupEnsurePlayerStat(map, save.playerId, save.clubId);
      if(row) row.keySaves += 1;
    });
    (match.errors || []).forEach(error => {
      const row = clubWorldCupEnsurePlayerStat(map, error.playerId, error.clubId);
      if(row){ row.errors += 1; if(error.goal) row.goalErrors += 1; }
    });
  });
  return Array.from(map.values());
}
function clubWorldCupTournamentTeamStats(){
  const state = clubWorldCupState();
  const ids = Array.isArray(state?.participantClubIds) ? state.participantClubIds.map(Number).filter(Boolean) : [];
  const rows = new Map(ids.map(id => [id, { clubId:id, pj:0, gf:0, gc:0, dg:0, fouls:0, yellow:0, red:0 }]));
  const ensure = id => {
    const clubId = Number(id || 0);
    if(!clubId) return null;
    if(!rows.has(clubId)) rows.set(clubId, { clubId, pj:0, gf:0, gc:0, dg:0, fouls:0, yellow:0, red:0 });
    return rows.get(clubId);
  };
  clubWorldCupPlayedMatches().forEach(match => {
    const h = ensure(match.homeId);
    const a = ensure(match.awayId);
    if(!h || !a) return;
    const hg = Number(match.homeGoals || 0);
    const ag = Number(match.awayGoals || 0);
    h.pj += 1; a.pj += 1;
    h.gf += hg; h.gc += ag; a.gf += ag; a.gc += hg;
    h.dg = h.gf - h.gc; a.dg = a.gf - a.gc;
    h.fouls += Number(match.matchStats?.home?.fouls || 0);
    a.fouls += Number(match.matchStats?.away?.fouls || 0);
    (match.cards || []).forEach(card => {
      const row = ensure(card.clubId);
      if(!row) return;
      if(card.type === 'yellow') row.yellow += 1;
      if(card.type === 'secondYellowRed'){ row.yellow += 1; row.red += 1; }
      if(card.type === 'red') row.red += 1;
    });
  });
  return Array.from(rows.values()).filter(row => row.pj > 0);
}
function clubWorldCupStatList(list, key, empty='Sin datos todavía.'){
  if(!list.length) return `<p class="muted">${escapeHtml(empty)}</p>`;
  return list.slice(0,20).map((s,i) => {
    const player = playerById(s.playerId);
    return `<div class="stat-rank ${Number(s.clubId)===Number(game?.selectedClubId) ? 'own-player-rank' : ''}"><span><span class="rank-num">${i+1}</span><button class="linklike" data-player-id="${Number(s.playerId || 0)}">${escapeHtml(player?.name || 'Jugador')}</button> <span class="pill ${Number(s.clubId)===Number(game?.selectedClubId) ? 'club-pill-own' : ''}">${clubBadge(s.clubId)}</span></span><strong>${Number(s[key] || 0)}</strong></div>`;
  }).join('');
}
function clubWorldCupCardStatList(list){
  if(!list.length) return '<p class="muted">Sin tarjetas todavía.</p>';
  return list.slice(0,20).map((s,i) => {
    const player = playerById(s.playerId);
    return `<div class="stat-rank ${Number(s.clubId)===Number(game?.selectedClubId) ? 'own-player-rank' : ''}"><span><span class="rank-num">${i+1}</span><button class="linklike" data-player-id="${Number(s.playerId || 0)}">${escapeHtml(player?.name || 'Jugador')}</button> <span class="pill ${Number(s.clubId)===Number(game?.selectedClubId) ? 'club-pill-own' : ''}">${clubBadge(s.clubId)}</span></span><strong><span class="yellow-card">■</span> ${Number(s.yellow || 0)} / <span class="red-card">■</span> ${Number(s.red || 0)}</strong></div>`;
  }).join('');
}
function clubWorldCupTeamFoulsList(list){
  if(!list.length) return '<p class="muted">Sin faltas registradas todavía.</p>';
  return list.slice(0,20).map((s,i) => `<div class="stat-rank ${Number(s.clubId)===Number(game?.selectedClubId) ? 'own-player-rank' : ''}"><span><span class="rank-num">${i+1}</span>${clubLink(s.clubId)}</span><strong>${Number(s.fouls || 0)}</strong></div>`).join('');
}
function clubWorldCupStatsBlock(){
  const stats = clubWorldCupTournamentPlayerStats();
  const scorers = stats.filter(s => s.goals > 0).sort((a,b)=>b.goals-a.goals || b.assists-a.assists || clubName(a.clubId).localeCompare(clubName(b.clubId),'es',{sensitivity:'base'}));
  const assists = stats.filter(s => s.assists > 0).sort((a,b)=>b.assists-a.assists || b.goals-a.goals || clubName(a.clubId).localeCompare(clubName(b.clubId),'es',{sensitivity:'base'}));
  const cards = stats.filter(s => s.yellow > 0 || s.red > 0).sort((a,b)=>(b.red*3+b.yellow)-(a.red*3+a.yellow));
  const played = stats.filter(s => s.played > 0).sort((a,b)=>b.played-a.played || b.goals-a.goals);
  const fouls = clubWorldCupTournamentTeamStats().sort((a,b)=>b.fouls-a.fouls || b.yellow-a.yellow || b.red-a.red);
  return `<div class="card stats-division-block"><h3>Estadísticas del Mundial de Clubes</h3><div class="grid cols-4">
    <div class="card inner"><h3>Goleadores</h3>${clubWorldCupStatList(scorers, 'goals')}</div>
    <div class="card inner"><h3>Asistidores</h3>${clubWorldCupStatList(assists, 'assists')}</div>
    <div class="card inner"><h3>Tarjetas</h3>${clubWorldCupCardStatList(cards)}</div>
    <div class="card inner"><h3>Más PJ</h3>${clubWorldCupStatList(played, 'played')}</div>
  </div><div class="card inner" style="margin-top:12px"><h3>Faltas por equipo</h3>${clubWorldCupTeamFoulsList(fouls)}</div></div>`;
}

function clubWorldCupEditionHistoryKey(edition){
  return `history-${Number(edition?.season || 0)}-${Number(edition?.year || 0)}`;
}
function clubWorldCupYearOptionsMarkup(selected=selectedClubWorldCupYear){
  const currentYear = Number(game?.seasonYear || seasonYearForNumber(game?.seasonNumber || 1));
  const current = clubWorldCupCurrentEditionSnapshot();
  const options = [`<option value="current" ${String(selected || 'current') === 'current' ? 'selected' : ''}>${currentYear} · actual${current ? '' : ' · sin sorteo'}</option>`];
  clubWorldCupHistoryEntries()
    .filter(edition => !current || Number(edition.season || 0) !== Number(current.season || 0) || Number(edition.year || 0) !== Number(current.year || 0))
    .forEach(edition => {
      const key = clubWorldCupEditionHistoryKey(edition);
      options.push(`<option value="${escapeHtml(key)}" ${String(selected || '') === key ? 'selected' : ''}>${Number(edition.year || 0)} · Temp. ${Number(edition.season || 0)}</option>`);
    });
  return `<div class="division-filter cwc-year-filter"><label for="clubWorldCupYearFilter">Año</label><select id="clubWorldCupYearFilter">${options.join('')}</select></div>`;
}
function selectedClubWorldCupEditionForDisplay(){
  const selected = String(selectedClubWorldCupYear || 'current');
  if(selected === 'current') return { edition:clubWorldCupCurrentEditionSnapshot(), current:true };
  const match = selected.match(/^history-(\d+)-(\d+)$/);
  if(!match){ selectedClubWorldCupYear = 'current'; return { edition:clubWorldCupCurrentEditionSnapshot(), current:true }; }
  const season = Number(match[1] || 0);
  const year = Number(match[2] || 0);
  const edition = clubWorldCupHistoryEntries().find(item => Number(item.season || 0) === season && Number(item.year || 0) === year) || null;
  if(!edition){ selectedClubWorldCupYear = 'current'; return { edition:clubWorldCupCurrentEditionSnapshot(), current:true }; }
  return { edition, current:false };
}
function clubWorldCupEditionMatchScore(match){
  if(!match?.played) return 'vs';
  const penalties = match.penaltyShootout ? ` (${Number(match.penaltyShootout.home || 0)}-${Number(match.penaltyShootout.away || 0)} pen.)` : '';
  const tie = match.tiebreaker ? ` · faltas ${Number(match.tiebreaker.homeFouls || 0)}-${Number(match.tiebreaker.awayFouls || 0)}` : '';
  return `${Number(match.homeGoals || 0)} - ${Number(match.awayGoals || 0)}${penalties}${tie}`;
}
function clubWorldCupEditionMatchCard(match, options={}){
  const interactive = Boolean(options.interactive && match?.played && match?.id);
  const tag = interactive ? 'button' : 'div';
  const attr = interactive ? ` data-match-id="${escapeHtml(match.id)}"` : '';
  const className = `match-card cwc-edition-match ${interactive ? 'clickable' : ''} ${match?.played ? 'played' : 'pending'}`;
  const seasonDay = Math.max(0, Math.round(Number(match?.seasonDay || clubWorldCupStageSeasonDay(match?.stage, match?.roundNumber || 1) || 0)));
  const meta = [seasonDay ? `Día ${seasonDay}` : '', match?.date ? matchDateLabel(match.date) : '', match?.stadiumName || '', match?.bracketKey || ''].filter(Boolean).join(' · ');
  return `<${tag} class="${className}"${attr}>
    <div class="match-date-line">${escapeHtml(meta || 'Fecha pendiente')}</div>
    <div class="match-line">
      <div class="cwc-match-team ${Number(match?.winnerClubId || 0) === Number(match?.homeId || 0) ? 'winner' : ''}">${clubBadge(match?.homeId)} <span>${escapeHtml(clubName(match?.homeId))}</span></div>
      <strong class="score">${escapeHtml(clubWorldCupEditionMatchScore(match))}</strong>
      <div class="cwc-match-team ${Number(match?.winnerClubId || 0) === Number(match?.awayId || 0) ? 'winner' : ''}">${clubBadge(match?.awayId)} <span>${escapeHtml(clubName(match?.awayId))}</span></div>
    </div>
  </${tag}>`;
}
function clubWorldCupCompactGroupMatch(match, interactive=false){
  const attr = interactive && match?.played && match?.id ? ` data-match-id="${escapeHtml(match.id)}"` : '';
  const tag = attr ? 'button' : 'div';
  const seasonDay = Math.max(0, Math.round(Number(match?.seasonDay || clubWorldCupStageSeasonDay('groups', match?.roundNumber || 1) || 0)));
  const dateLabel = [seasonDay ? `Día ${seasonDay}` : '', match?.date ? matchDateLabel(match.date) : 'Pendiente'].filter(Boolean).join(' · ');
  return `<${tag} class="cwc-group-result ${attr ? 'clickable' : ''}"${attr}>
    <span class="cwc-group-result-date">${escapeHtml(dateLabel)}</span>
    <span>${clubBadge(match?.homeId)} ${escapeHtml(clubName(match?.homeId))}</span>
    <strong>${escapeHtml(clubWorldCupEditionMatchScore(match))}</strong>
    <span>${escapeHtml(clubName(match?.awayId))} ${clubBadge(match?.awayId)}</span>
  </${tag}>`;
}
function clubWorldCupGroupsMarkup(edition, options={}){
  const groups = Array.isArray(edition?.groups) ? edition.groups : [];
  if(!groups.length) return '<div class="card"><p class="muted">No hay tablas de grupos guardadas para esta edición.</p></div>';
  return `<div class="cwc-section-heading"><div><h3>Fase de grupos</h3><p class="muted small">Cada grupo funciona como una liga de cuatro equipos. Los dos primeros avanzan a octavos.</p></div><span class="pill">8 grupos · 16 clasificados</span></div>
    <div class="cwc-groups-grid">${groups.map(group => {
      const standings = (Array.isArray(group.standings) ? group.standings : []).slice().sort((a,b)=>Number(a.position || 999)-Number(b.position || 999));
      const rows = standings.map((row,index) => `<tr class="${index < 2 ? 'promotion-row cwc-qualified-row' : ''}"><td><strong>${index + 1}</strong></td><td>${clubLink(row.clubId)}</td><td>${Number(row.pj || 0)}</td><td>${Number(row.dg || 0)}</td><td><strong>${Number(row.pts || 0)}</strong></td></tr>`).join('');
      const matches = (Array.isArray(group.matches) ? group.matches : []).slice().sort((a,b)=>Number(a.seasonDay || 0)-Number(b.seasonDay || 0) || Number(a.roundNumber || 0)-Number(b.roundNumber || 0) || daysBetweenIsoDates(b.date || '', a.date || ''));
      return `<article class="card inner cwc-group-card">
        <div class="row cwc-group-title"><h3>${escapeHtml(group.name || `Grupo ${group.id}`)}</h3><span class="pill">1° y 2° clasifican</span></div>
        <div class="table-wrap"><table class="cwc-group-table"><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>DG</th><th>PTS</th></tr></thead><tbody>${rows}</tbody></table></div>
        <details class="cwc-group-results"><summary>Partidos y resultados</summary><div class="cwc-group-result-list">${matches.map(match => clubWorldCupCompactGroupMatch(match, Boolean(options.interactive))).join('') || '<p class="muted small">Todavía no hay partidos.</p>'}</div></details>
      </article>`;
    }).join('')}</div>`;
}
function clubWorldCupBracketMarkup(edition, options={}){
  const stages = edition?.stages || {};
  const stageDefs = [ ['r16','Octavos'], ['qf','Cuartos'], ['sf','Semifinales'], ['final','Final'] ];
  const columns = stageDefs.map(([stage,label]) => {
    const matches = Array.isArray(stages[stage]) ? stages[stage] : [];
    return `<section class="cwc-bracket-stage cwc-bracket-${stage}"><h3>${label}</h3><div class="cwc-bracket-matches">${matches.length ? matches.map(match => clubWorldCupEditionMatchCard(match, { interactive:Boolean(options.interactive) })).join('') : '<div class="cwc-bracket-placeholder">Pendiente</div>'}</div></section>`;
  }).join('');
  const third = Array.isArray(stages.thirdPlace) ? stages.thirdPlace : [];
  return `<div class="cwc-section-heading"><div><h3>Cuadro eliminatorio</h3><p class="muted small">Cruces a partido único desde octavos hasta la final.</p></div></div>
    <div class="cwc-bracket-scroll"><div class="cwc-bracket">${columns}</div></div>
    ${third.length ? `<div class="card cwc-third-place"><h3>Partido por el 3er puesto</h3><div class="grid cols-2">${third.map(match => clubWorldCupEditionMatchCard(match, { interactive:Boolean(options.interactive) })).join('')}</div></div>` : ''}`;
}
function clubWorldCupEditionMarkup(edition, options={}){
  if(!edition){
    const readyDay = typeof clubWorldCupFixtureReadySeasonDay === 'function' ? clubWorldCupFixtureReadySeasonDay() : 295;
    const currentNote = options.current ? ` El sorteo se genera automáticamente el día ${readyDay}, participe o no el club dirigido.` : '';
    const issue = options.current && game?.clubWorldCupGenerationIssue?.reason ? `<p class="small danger-text">Diagnóstico: ${escapeHtml(game.clubWorldCupGenerationIssue.reason)}</p>` : '';
    return `<div class="card"><p class="muted">El Mundial de Clubes todavía no se generó en este año.</p><p class="small muted">Cuando se sortee la edición aparecerán los ocho grupos, sus tablas, todos los resultados y el cuadro eliminatorio.${currentNote}</p>${issue}</div>`;
  }
  const champion = Number(edition.championId || 0);
  const runnerUp = Number(edition.runnerUpId || 0);
  const third = Number(edition.thirdPlaceId || 0);
  const championBlock = champion ? `<div class="card champion-card cwc-champion-card"><p class="label">Campeón ${Number(edition.year || 0)}</p><h2>${clubBadge(champion)} ${escapeHtml(clubName(champion))}</h2><p class="muted">${runnerUp ? `Subcampeón: ${escapeHtml(clubName(runnerUp))}` : ''}${third ? `${runnerUp ? ' · ' : ''}3°: ${escapeHtml(clubName(third))}` : ''}</p></div>` : '';
  const statusLabels = { groups:'Fase de grupos', r16:'Octavos', qf:'Cuartos', sf:'Semifinales', final:'Final', completed:'Finalizado' };
  const dates = Array.isArray(edition.groupDates) ? edition.groupDates : [];
  const groupSeasonDays = Array.isArray(edition.groupSeasonDays) && edition.groupSeasonDays.length ? edition.groupSeasonDays : clubWorldCupGroupSeasonDays();
  const stageSeasonDays = edition.stageSeasonDays || {};
  const overview = `<div class="grid cols-3 cwc-overview-grid">
    <div class="card inner"><p class="label">Edición</p><h3>${Number(edition.year || 0)}</h3><p class="muted small">Temporada ${Number(edition.season || 0)}</p></div>
    <div class="card inner"><p class="label">Estado</p><h3>${escapeHtml(statusLabels[edition.status] || edition.status || '—')}</h3><p class="muted small">${Number(edition.participantClubIds?.length || 0) || 32} participantes</p></div>
    <div class="card inner"><p class="label">Formato</p><h3>8 grupos de 4</h3><p class="muted small">Clasifican los dos primeros</p></div>
  </div>`;
  const stageCalendarLabel = stage => {
    const day = Number(stageSeasonDays[stage] || clubWorldCupStageSeasonDay(stage, 1));
    const iso = clubWorldCupIsoForSeasonDay(day, Number(edition.year || currentSeasonYear()));
    return `día ${day} · ${escapeHtml(matchDateLabel(iso))}`;
  };
  const calendar = edition.drawDate || dates.length ? `<div class="card cwc-calendar-summary"><h3>Calendario fijo por día de temporada</h3><p class="muted small">${edition.drawDate ? `Sorteo: día ${Number(edition.drawSeasonDay || clubWorldCupFixtureReadySeasonDay())} · ${escapeHtml(matchDateLabel(edition.drawDate))}. ` : ''}${dates[0] ? `Grupos 1: día ${Number(groupSeasonDays[0] || 305)} · ${escapeHtml(matchDateLabel(dates[0]))}. ` : ''}${dates[1] ? `Grupos 2: día ${Number(groupSeasonDays[1] || 310)} · ${escapeHtml(matchDateLabel(dates[1]))}. ` : ''}${dates[2] ? `Grupos 3: día ${Number(groupSeasonDays[2] || 315)} · ${escapeHtml(matchDateLabel(dates[2]))}. ` : ''}Octavos: ${stageCalendarLabel('r16')}. Cuartos: ${stageCalendarLabel('qf')}. Semifinales: ${stageCalendarLabel('sf')}. 3er puesto: ${stageCalendarLabel('thirdPlace')}. Final: ${stageCalendarLabel('final')}.</p></div>` : '';
  if(edition.summaryOnly){
    return `${overview}${championBlock}<div class="card"><p class="muted">Esta edición proviene de una partida anterior a V7.09. Se conserva el campeón y el podio, pero los grupos y resultados detallados ya no estaban disponibles en el guardado.</p></div>`;
  }
  const stats = options.showStats && options.current ? clubWorldCupStatsBlock() : '';
  return `${overview}${calendar}${championBlock}${clubWorldCupGroupsMarkup(edition, { interactive:Boolean(options.interactive) })}${clubWorldCupBracketMarkup(edition, { interactive:Boolean(options.interactive) })}${stats ? `<div class="stack cwc-stats-history">${stats}</div>` : ''}`;
}
function bindClubWorldCupYearFilter(renderFn){
  $('clubWorldCupYearFilter')?.addEventListener('change', event => {
    selectedClubWorldCupYear = event.target.value;
    if(typeof renderFn === 'function') renderFn();
  });
}
function renderClubWorldCup(){
  if(typeof ensureClubWorldCupCurrentSeason === 'function'){
    const ensured = ensureClubWorldCupCurrentSeason({ source:'open-world-cup-tab' });
    if(ensured?.changed && typeof saveLocal === 'function') Promise.resolve(saveLocal(true)).catch(()=>{});
  }
  if(typeof repairClubWorldCupGroupFixtureDates === 'function') repairClubWorldCupGroupFixtureDates();
  const selected = selectedClubWorldCupEditionForDisplay();
  view.innerHTML = `<div class="row section-title fixture-title-row">
      <div><h2>${escapeHtml(CLUB_WORLD_CUP_CONFIG.name)}</h2><p class="tagline">Historial anual de grupos, clasificados y cuadro eliminatorio.</p></div>
      <div class="fixture-controls row">${clubWorldCupYearOptionsMarkup(selectedClubWorldCupYear)}</div>
    </div>
    <div class="stack cwc-edition-view">${clubWorldCupEditionMarkup(selected.edition, { current:selected.current, interactive:selected.current, showStats:true })}</div>`;
  bindClubWorldCupYearFilter(renderClubWorldCup);
}
function findPlayedMatchById(matchId){
  const id = String(matchId || '');
  for(const round of (game?.fixtures || [])){
    const match = (round.matches || []).find(item => String(item.id) === id);
    if(match?.played) return match;
  }
  return (game?.matchHistory || []).find(item => String(item.id) === id && item.played) || null;
}
function playoffTieResult(tie){
  if(!tie?.matchIds?.length) return null;
  const matches = tie.matchIds.map(findPlayedMatchById).filter(Boolean);
  if(matches.length < tie.matchIds.length) return null;
  const totals = { [tie.upperClubId]:0, [tie.lowerClubId]:0 };
  matches.forEach(match => {
    totals[match.homeId] = Number(totals[match.homeId] || 0) + Number(match.homeGoals || 0);
    totals[match.awayId] = Number(totals[match.awayId] || 0) + Number(match.awayGoals || 0);
  });
  const upperGoals = Number(totals[tie.upperClubId] || 0);
  const lowerGoals = Number(totals[tie.lowerClubId] || 0);
  const winnerClubId = upperGoals === lowerGoals ? Number(tie.advantageClubId || tie.upperClubId) : (upperGoals > lowerGoals ? Number(tie.upperClubId) : Number(tie.lowerClubId));
  const loserClubId = winnerClubId === Number(tie.upperClubId) ? Number(tie.lowerClubId) : Number(tie.upperClubId);
  return { winnerClubId, loserClubId, upperGoals, lowerGoals, tied:upperGoals === lowerGoals };
}
function argentinaPlayoffTiesForSeason(){
  const stored = game?.argentinaPlayoffs;
  if(stored?.season === Number(game?.seasonNumber || 1) && Array.isArray(stored.ties)) return stored.ties;
  return [];
}
function computeArgentinaSeasonMovements(){
  const first = argentinaDivisionByOrder(1);
  const second = argentinaDivisionByOrder(2);
  const third = argentinaDivisionByOrder(3);
  const movements = [];
  if(first && second){
    [1,2].forEach(position => {
      const row = standingAtPosition(second.id, position);
      if(row) addUniqueMovement(movements, movementRecord('promotion', row.clubId, second, first, position === 1 ? 'Campeón / ascenso directo' : 'Ascenso directo'));
    });
    [17,18].forEach(position => {
      const row = standingAtPosition(first.id, position);
      if(row) addUniqueMovement(movements, movementRecord('relegation', row.clubId, first, second, 'Descenso directo'));
    });
  }
  if(second && third){
    [1,2].forEach(position => {
      const row = standingAtPosition(third.id, position);
      if(row) addUniqueMovement(movements, movementRecord('promotion', row.clubId, third, second, position === 1 ? 'Campeón / ascenso directo' : 'Ascenso directo'));
    });
    [17,18].forEach(position => {
      const row = standingAtPosition(second.id, position);
      if(row) addUniqueMovement(movements, movementRecord('relegation', row.clubId, second, third, 'Descenso directo'));
    });
  }
  argentinaPlayoffTiesForSeason().forEach(tie => {
    const result = playoffTieResult(tie);
    if(!result) return;
    const upperDivision = (seed?.divisions || []).find(d => d.id === tie.upperDivisionId);
    const lowerDivision = (seed?.divisions || []).find(d => d.id === tie.lowerDivisionId);
    if(!upperDivision || !lowerDivision) return;
    if(Number(result.winnerClubId) === Number(tie.lowerClubId)){
      addUniqueMovement(movements, movementRecord('promotion', tie.lowerClubId, lowerDivision, upperDivision, 'Ganó playoff de promoción'));
      addUniqueMovement(movements, movementRecord('relegation', tie.upperClubId, upperDivision, lowerDivision, 'Perdió playoff de promoción'));
    }
  });
  return movements;
}
function divisionUsesArgentinaRules(division){
  return normalizeScheduleText(division?.country || '') === 'argentina' && [1,2,3].includes(Number(division?.order || 0));
}
function divisionCountryGroupsForSeason(){
  const groups = new Map();
  (seed?.divisions || []).forEach(division => {
    const country = divisionCountryKey(division);
    if(!country) return;
    if(!groups.has(country)) groups.set(country, []);
    groups.get(country).push(division);
  });
  return Array.from(groups.entries()).map(([country, divisions]) => ({
    country,
    divisions:divisions.slice().sort((a,b)=>(a.order || 0)-(b.order || 0))
  }));
}
function computeSeasonMovements(){
  const movements = [];
  let argentinaHandled = false;
  divisionCountryGroupsForSeason().forEach(group => {
    const isArgentinaGroup = group.country === 'argentina';
    if(isArgentinaGroup){
      if(!argentinaHandled && argentinaDivisions().length >= 3){
        computeArgentinaSeasonMovements().forEach(move => addUniqueMovement(movements, move));
      }
      argentinaHandled = true;
      return;
    }
    const divisions = group.divisions || [];
    if(divisions.length < 2) return;
    for(let i=1; i<divisions.length; i++){
      const upper = divisions[i-1];
      const lower = divisions[i];
      if(divisionCountryKey(upper) !== divisionCountryKey(lower)) continue;
      const lowerTable = sortedStandings(lower.id);
      const upperTable = sortedStandings(upper.id);
      const lowerChampion = lowerTable[0];
      const upperLast = upperTable[upperTable.length - 1];
      if(lowerChampion){
        addUniqueMovement(movements, movementRecord('promotion', lowerChampion.clubId, lower, upper, 'Campeón'));
      }
      if(upperLast){
        addUniqueMovement(movements, movementRecord('relegation', upperLast.clubId, upper, lower, 'Descenso'));
      }
    }
  });
  return movements;
}
function clubWorldCupQualifierCountForDivision(divisionId){
  const division = (seed?.divisions || []).find(d => String(d.id || '') === String(divisionId || ''));
  if(!division) return 0;
  const country = normalizeScheduleText(division.country || '');
  const order = Number(division.order || 0);
  const rule = (CLUB_WORLD_CUP_CONFIG.qualifiers || []).find(item => normalizeScheduleText(item.country || '') === country && Number(item.order || 0) === order);
  return Math.max(0, Number(rule?.count || 0));
}
function clubWorldCupStandingStatusClass(divisionId, index){
  const quota = clubWorldCupQualifierCountForDivision(divisionId);
  if(quota > 0 && Number(index || 0) < quota) return 'continental-row';
  return '';
}
function argentineStandingStatusClass(divisionId, index){
  const division = (seed?.divisions || []).find(d => d.id === divisionId);
  if(!divisionUsesArgentinaRules(division)) return '';
  const position = Number(index || 0) + 1;
  const order = Number(division.order || 0);
  if(order === 1){
    if(position === 1) return 'champion-row';
    if(position >= 2 && position <= 4) return 'continental-row';
    if(position >= 15 && position <= 16) return 'playoff-row';
    if(position >= 17 && position <= 18) return 'relegation-row';
  }
  if(order === 2){
    if(position >= 1 && position <= 2) return 'promotion-row';
    if(position >= 3 && position <= 4) return 'playoff-row';
    if(position >= 15 && position <= 16) return 'playoff-row';
    if(position >= 17 && position <= 18) return 'relegation-row';
  }
  if(order === 3){
    if(position >= 1 && position <= 2) return 'promotion-row';
    if(position >= 3 && position <= 4) return 'playoff-row';
  }
  return '';
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
      const nextValue = Math.max(0, Math.round(oldValue * 0.30));
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
function repairPlayerAgeSkillPenaltiesForState(targetGame, players=null){
  if(!targetGame) return { cleared:0, normalized:0, pruned:0 };
  targetGame.playerAgeSkillPenalties = (targetGame.playerAgeSkillPenalties && typeof targetGame.playerAgeSkillPenalties === 'object' && !Array.isArray(targetGame.playerAgeSkillPenalties)) ? targetGame.playerAgeSkillPenalties : {};
  const combined = [];
  const seen = new Set();
  const addPlayer = player => {
    const id = Number(player?.id || 0);
    if(!id || seen.has(id)) return;
    seen.add(id);
    combined.push(player);
  };
  (Array.isArray(players) ? players : (seed?.players || [])).forEach(addPlayer);
  (targetGame.marketPlayers || []).forEach(addPlayer);
  let cleared = 0;
  let normalized = 0;
  combined.forEach(player => {
    const id = Number(player.id);
    const before = clamp(Math.round(Number(targetGame.playerAgeSkillPenalties[id] || 0)), 0, PLAYER_AGE_DECAY_CAP);
    const age = Math.round(Number(player.age || 18));
    const after = age < PLAYER_AGE_DECAY_START_AGE ? 0 : before;
    if(before > 0 && after === 0) cleared += 1;
    if(Number(targetGame.playerAgeSkillPenalties[id] || 0) !== after) normalized += 1;
    targetGame.playerAgeSkillPenalties[id] = after;
  });
  let pruned = 0;
  Object.keys(targetGame.playerAgeSkillPenalties).forEach(rawId => {
    const id = Number(rawId || 0);
    if(!id || !seen.has(id)){
      delete targetGame.playerAgeSkillPenalties[rawId];
      pruned += 1;
    }
  });
  return { cleared, normalized, pruned };
}
function ageDecayRollForPlayer(player, season){
  const min = Math.max(0, Math.round(Number(PLAYER_AGE_DECAY_MIN_ANNUAL || 0)));
  const max = Math.max(min, Math.round(Number(PLAYER_AGE_DECAY_MAX_ANNUAL || min)));
  if(max <= 0) return 0;
  return min + hashNumber(`age-decay-${season}-${player?.id || 0}-${player?.age || 0}`, (max - min) + 1);
}
function applySeasonalAgeSkillDecay(season){
  if(!game || !PLAYER_AGE_DECAY_ENABLED) return { players:0, added:0, maxPenalty:0, cleared:0 };
  game.playerAgeSkillPenalties = (game.playerAgeSkillPenalties && typeof game.playerAgeSkillPenalties === 'object' && !Array.isArray(game.playerAgeSkillPenalties)) ? game.playerAgeSkillPenalties : {};
  let players = 0;
  let added = 0;
  let maxPenalty = 0;
  let cleared = 0;
  seed.players.forEach(player => {
    const age = Math.round(Number(player.age || 18));
    if(age < PLAYER_AGE_DECAY_START_AGE){
      const before = clamp(Math.round(Number(game.playerAgeSkillPenalties[player.id] || 0)), 0, PLAYER_AGE_DECAY_CAP);
      if(before > 0) cleared += 1;
      game.playerAgeSkillPenalties[player.id] = 0;
      return;
    }
    const roll = ageDecayRollForPlayer(player, season);
    const before = clamp(Math.round(Number(game.playerAgeSkillPenalties[player.id] || 0)), 0, PLAYER_AGE_DECAY_CAP);
    const after = clamp(before + roll, 0, PLAYER_AGE_DECAY_CAP);
    game.playerAgeSkillPenalties[player.id] = after;
    if(after > before){ players += 1; added += (after - before); }
    maxPenalty = Math.max(maxPenalty, after);
  });
  return { players, added, maxPenalty, cleared };
}
function applySeasonalAging(){
  if(!game) return { aged:0, ageDecay:{ players:0, added:0, maxPenalty:0, cleared:0 } };
  let count = 0;
  seed.players.forEach(player => {
    player.age = Math.max(15, Number(player.age || 18) + 1);
    count += 1;
  });
  const decay = applySeasonalAgeSkillDecay(game.seasonNumber || 1);
  return { aged:count, ageDecay:decay };
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
    .map(player => ({
      ...player,
      freeAgent:Number(player.clubId || 0) === 0 || Boolean(player.freeAgent) || Boolean(player.youthFreeAgent),
      manualPlayer:Boolean(player.manualPlayer),
      manualRespawnAfterRetirement:Boolean(player.manualRespawnAfterRetirement)
    }));
  if(!retirees.length) return [];
  const retiredIds = new Set(retirees.map(p => Number(p.id)));
  const manualRespawned = retirees
    .filter(player => player.manualPlayer && player.manualRespawnAfterRetirement)
    .map(player => typeof manualRespawnClone === 'function' ? manualRespawnClone(player, 'season_retirement') : null)
    .filter(Boolean);
  const manualRetiredIds = retirees
    .filter(player => player.manualPlayer && !player.manualRespawnAfterRetirement)
    .map(player => Number(player.id))
    .filter(id => Number.isFinite(id) && id > 0);
  if(manualRetiredIds.length){
    game.manualRetiredPlayerIds = Array.from(new Set([...(Array.isArray(game.manualRetiredPlayerIds) ? game.manualRetiredPlayerIds : []), ...manualRetiredIds]));
  }
  seed.players = seed.players.filter(player => !retiredIds.has(Number(player.id)));
  game.marketPlayers = (game.marketPlayers || []).filter(player => !retiredIds.has(Number(player.id)));
  retirees.forEach(player => {
    removePlayerFromCurrentTactic(player.id);
    delete game.playerCondition?.[player.id];
    delete game.playerMorale?.[player.id];
    delete game.playerSkillBoosts?.[player.id];
    delete game.playerAgeSkillPenalties?.[player.id];
    delete game.trainingPlan?.[player.id];
    delete game.playerStats?.[player.id];
    delete game.playerStatus?.[player.id];
  });
  if(manualRespawned.length){
    const respawnedIds = new Set(manualRespawned.map(player => Number(player.id)));
    seed.players = seed.players.filter(player => !respawnedIds.has(Number(player.id))).concat(manualRespawned);
    game.marketPlayers = (game.marketPlayers || []).filter(player => !respawnedIds.has(Number(player.id))).concat(manualRespawned);
    if(typeof initializeFreePlayerState === 'function') initializeFreePlayerState(manualRespawned);
    game.manualRetiredPlayerIds = (Array.isArray(game.manualRetiredPlayerIds) ? game.manualRetiredPlayerIds : []).filter(id => !respawnedIds.has(Number(id)));
    game.retiredManualPlayerIds = (Array.isArray(game.retiredManualPlayerIds) ? game.retiredManualPlayerIds : []).filter(id => !respawnedIds.has(Number(id)));
    manualRespawned.forEach(player => { player.respawnedAsFreeAgent = true; if(game.playerAgeSkillPenalties) game.playerAgeSkillPenalties[player.id] = 0; });
  }
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
  if(manualRespawned.length){
    const names = manualRespawned.slice(0,5).map(p => `${p.name} (20)`).join(', ');
    pushGameMessage({
      type:'mercado',
      priority:'normal',
      title:'Leyendas disponibles como libres',
      body:`${manualRespawned.length === 1 ? 'Un jugador manual reapareció' : `${manualRespawned.length} jugadores manuales reaparecieron`} en el mercado libre con 20 años: ${names}${manualRespawned.length > 5 ? '...' : ''}`
    });
  }
  return retirees.map(player => ({
    id:player.id,
    name:player.name,
    age:player.age,
    position:player.position,
    salary:player.salary || 0,
    freeAgent:Boolean(player.freeAgent),
    manualPlayer:Boolean(player.manualPlayer),
    manualRespawnAfterRetirement:Boolean(player.manualRespawnAfterRetirement),
    respawnedAsFreeAgent:Boolean(player.manualPlayer && player.manualRespawnAfterRetirement)
  }));
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
    delete game.playerAgeSkillPenalties?.[player.id];
    delete game.trainingPlan?.[player.id];
    delete game.playerStats?.[player.id];
    delete game.playerStatus?.[player.id];
  });
  return removed;
}

function freeAgentPrunePriority(player){
  const media = typeof visibleOverall === 'function' ? visibleOverall(player) : Number(player.overall || player.media || 50);
  const age = Number(player.age || 0);
  let score = 0;
  if(player.youthFreeAgent) score += 900;
  if(player.founderReleased) score += 250;
  score += Math.max(0, age - 27) * 18;
  score += Math.max(0, 60 - media) * 4;
  score += Number(player.id || 0) / 1000000;
  return score;
}
function pruneFreeAgentMarketArrayToHardMax(players=[], maxCount=MARKET_FREE_AGENT_HARD_MAX){
  const safeMax = Math.max(0, Math.min(300, Math.round(Number(maxCount) || 0)));
  if(!Array.isArray(players) || safeMax <= 0) return [];
  const free = players.filter(player => player && Number(player.clubId || 0) === 0 && !player.sold && !player.retired);
  const excess = free.length - safeMax;
  if(excess <= 0) return players;
  const remove = new Set(free.slice().sort((a,b) => freeAgentPrunePriority(b) - freeAgentPrunePriority(a)).slice(0, excess).map(player => Number(player.id)));
  return players.filter(player => !remove.has(Number(player.id)));
}
function syncSeedFreeAgentCleanup(activeMarketPlayers=[]){
  if(!seed?.players || !Array.isArray(activeMarketPlayers)) return;
  const activeMarketIds = new Set(activeMarketPlayers.map(player => Number(player.id)));
  seed.players = seed.players.filter(player => {
    if(!player || Number(player.clubId || 0) !== 0 || !player.freeAgent) return true;
    return activeMarketIds.has(Number(player.id));
  });
}
function pruneFreeAgentMarketToMax(maxCount=SEASON_FREE_AGENT_MARKET_MAX){
  if(!game || !SEASON_FREE_AGENT_CLEANUP_ENABLED || !Number.isFinite(Number(maxCount)) || Number(maxCount) <= 0) return [];
  const safeMax = Math.max(0, Math.min(300, Math.round(Number(maxCount) || 0)));
  const freePlayers = currentFreeMarketPlayers();
  const excess = freePlayers.length - safeMax;
  if(excess <= 0) return [];
  const candidates = freePlayers.slice().sort((a,b) => freeAgentPrunePriority(b) - freeAgentPrunePriority(a));
  return removeFreeMarketPlayersById(candidates.slice(0, excess).map(player => player.id));
}
function initializeFreePlayerState(players=[]){
  if(!game) return;
  game.playerCondition = game.playerCondition || {};
  game.playerMorale = game.playerMorale || {};
  game.playerSkillBoosts = game.playerSkillBoosts || {};
  game.playerAgeSkillPenalties = (game.playerAgeSkillPenalties && typeof game.playerAgeSkillPenalties === 'object' && !Array.isArray(game.playerAgeSkillPenalties)) ? game.playerAgeSkillPenalties : {};
  game.trainingPlan = game.trainingPlan || {};
  game.playerStats = game.playerStats || {};
  players.forEach(p => {
    game.playerCondition[p.id] = 5;
    game.playerMorale[p.id] = 5;
    game.playerSkillBoosts[p.id] = game.playerSkillBoosts[p.id] || {};
    game.playerAgeSkillPenalties[p.id] = 0;
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
      youthFreeAgent:true,
      nationalityOverride:freeAgentNationalityForIndex(i, `season-youth-${season}`),
      localCountry:club ? clubCountry(club) : null
    });
    player.originClubId = club?.id || 0;
    players.push(player);
  }
  return players;
}
function generateSeasonYouthFreeAgentsByClub(perClub=SEASON_YOUTH_FREE_AGENTS_PER_CLUB){
  const clubs = (seed?.clubs || []).filter(club => Number(club.id || 0) > 0);
  const available = Math.max(0, MARKET_FREE_AGENT_HARD_MAX - currentFreeMarketPlayers().length);
  const total = Math.min(available, Math.max(0, Math.round(Number(perClub || 0))) * clubs.length);
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
  const target = Math.min(MARKET_FREE_AGENT_HARD_MAX, Math.round(Number(maxCount)));
  const needed = Math.max(0, target - currentFreeMarketPlayers().length);
  if(needed <= 0) return [];
  const newPlayers = generateMarketPlayers(needed, { startId:nextPlayerId(), label:`season-market-${game.seasonNumber || 1}`, nameContext:'Mercado Libre' });
  game.marketPlayers = (game.marketPlayers || []).concat(newPlayers);
  mergeMarketPlayersIntoSeed(newPlayers);
  initializeFreePlayerState(newPlayers);
  return newPlayers;
}
function renewFreeAgentMarketForSeason(retiredCount=0){
  if(!game) return { removed:[], youth:[], regular:[] };
  pruneFreeAgentMarketToMax(MARKET_FREE_AGENT_HARD_MAX);
  const youth = generateSeasonYouthFreeAgentsByClub(SEASON_YOUTH_FREE_AGENTS_PER_CLUB);
  game.marketPlayers = (game.marketPlayers || []).concat(youth);
  mergeMarketPlayersIntoSeed(youth);
  initializeFreePlayerState(youth);
  pruneFreeAgentMarketToMax(MARKET_FREE_AGENT_HARD_MAX);
  const regular = topUpSeasonFreeAgentsToMax(SEASON_FREE_AGENT_MARKET_MAX);
  const finalPruned = pruneFreeAgentMarketToMax(MARKET_FREE_AGENT_HARD_MAX);
  const legacyExtra = retiredCount > 0 && SEASON_YOUTH_FREE_AGENT_COUNT > 0 ? addSeasonYouthFreeAgents(Math.max(SEASON_YOUTH_FREE_AGENT_COUNT, retiredCount)) : [];
  if(legacyExtra.length) pruneFreeAgentMarketToMax(MARKET_FREE_AGENT_HARD_MAX);
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
function clubReputationSeasonConfig(){
  const cfg = configValue('clubes.reputacionTemporada', {}) || {};
  const position = cfg.posicion || {};
  return {
    floors: cfg.minimoPorDivisionOrden || { 1:40, 2:25, 3:10 },
    position: {
      champion: Math.round(Number(position.campeon ?? 2)),
      high: Math.round(Number(position.zonaAlta ?? 1)),
      middle: Math.round(Number(position.zonaMedia ?? 0)),
      low: Math.round(Number(position.zonaBaja ?? -1)),
      bottom: Math.round(Number(position.zonaFondo ?? -2)),
      highUntil: Number(position.zonaAltaHasta ?? 0.25),
      middleUntil: Number(position.zonaMediaHasta ?? 0.60),
      lowUntil: Number(position.zonaBajaHasta ?? 0.85)
    },
    championBonus: cfg.bonusCampeonPorDivisionOrden || { 1:4, 2:3, 3:2 },
    promotionBonus: cfg.bonusAscensoPorDivisionOrigenOrden || { 2:4, 3:5 },
    relegationPenalty: cfg.penalizacionDescensoPorDivisionOrigenOrden || { 1:-3, 2:-2 }
  };
}
function clubReputationDivisionOrder(division){
  return Math.max(1, Math.round(Number(division?.order || divisionOrderFromName(division?.name) || 1)));
}
function clubReputationConfigValue(map, order, fallback=0){
  if(!map || typeof map !== 'object') return Math.round(Number(fallback || 0));
  const value = map[order] ?? map[String(order)] ?? fallback;
  return Math.round(Number(value || 0));
}
function clubReputationMinimumForDivision(division){
  const cfg = clubReputationSeasonConfig();
  const order = clubReputationDivisionOrder(division);
  return clamp(clubReputationConfigValue(cfg.floors, order, order === 1 ? 40 : order === 2 ? 25 : 10), 1, 99);
}
function clubSeasonPrestigeDeltaByPosition(position, totalTeams){
  const cfg = clubReputationSeasonConfig().position;
  const pos = Math.max(1, Math.round(Number(position || 0)));
  const total = Math.max(pos, Math.round(Number(totalTeams || 0)) || pos);
  if(pos === 1) return cfg.champion;
  const ratio = pos / total;
  if(ratio <= cfg.highUntil) return cfg.high;
  if(ratio <= cfg.middleUntil) return cfg.middle;
  if(ratio <= cfg.lowUntil) return cfg.low;
  return cfg.bottom;
}
function clubReputationSeasonMovementForClub(movements, clubId, type){
  return (Array.isArray(movements) ? movements : []).find(move => Number(move?.clubId) === Number(clubId) && move.type === type) || null;
}
function applyClubReputationFloor(oldValue, delta, floor){
  let adjusted = Math.round(Number(delta || 0));
  if(adjusted < 0){
    if(Number(oldValue || 0) <= Number(floor || 1)) return 0;
    adjusted = Math.max(adjusted, Math.round(Number(floor || 1)) - Math.round(Number(oldValue || 0)));
  }
  return adjusted;
}
function updateClubPrestigeAfterSeason(movements=[]){
  if(!game || !seed?.clubs) return [];
  const cfg = clubReputationSeasonConfig();
  const changes = [];
  divisionOrderList().forEach(division => {
    const order = clubReputationDivisionOrder(division);
    const table = sortedStandings(division.id);
    const totalTeams = table.length || 0;
    const floor = clubReputationMinimumForDivision(division);
    table.forEach((row, index) => {
      const club = seed.clubs.find(c => Number(c.id) === Number(row.clubId));
      if(!club || club.specialCompetitionOnly || club.competitionOnly) return;
      const position = index + 1;
      const champion = position === 1;
      const promoted = clubReputationSeasonMovementForClub(movements, club.id, 'promotion');
      const relegated = clubReputationSeasonMovementForClub(movements, club.id, 'relegation');
      const positionDelta = clubSeasonPrestigeDeltaByPosition(position, totalTeams);
      const championDelta = champion ? clubReputationConfigValue(cfg.championBonus, order, order === 1 ? 4 : order === 2 ? 3 : 2) : 0;
      const promotionDelta = promoted ? clubReputationConfigValue(cfg.promotionBonus, order, order === 2 ? 4 : order === 3 ? 5 : 0) : 0;
      const relegationDelta = relegated ? clubReputationConfigValue(cfg.relegationPenalty, order, order === 1 ? -3 : order === 2 ? -2 : 0) : 0;
      const rawDelta = positionDelta + championDelta + promotionDelta + relegationDelta;
      const oldValue = clubPrestigeValue(club);
      const delta = applyClubReputationFloor(oldValue, rawDelta, floor);
      if(delta === 0) return;
      const next = clamp(oldValue + delta, 1, 99);
      club.reputation = next;
      club.managerPrestige = next;
      changes.push({
        clubId:club.id,
        clubName:club.name,
        divisionId:division.id,
        divisionName:division.name,
        divisionOrder:order,
        position,
        oldValue,
        next,
        delta:next-oldValue,
        floor,
        champion,
        promoted:Boolean(promoted),
        relegated:Boolean(relegated),
        details:{ positionDelta, championDelta, promotionDelta, relegationDelta, rawDelta }
      });
    });
  });
  game.clubReputationHistory = Array.isArray(game.clubReputationHistory) ? game.clubReputationHistory : [];
  if(changes.length){
    game.clubReputationHistory.push({ season:game.seasonNumber || 1, date:game.currentDate || '', changes });
  }
  return changes;
}

function managerSeasonPrizeConfig(){
  const cfg = window.GAME_BALANCE_MANAGER?.premiosTemporada || {};
  return {
    activo: cfg.activo !== false,
    evitarDuplicados: cfg.evitarDuplicados !== false,
    conceptoCampeon: cfg.conceptoCampeon || 'Premio por campeonato',
    conceptoAscenso: cfg.conceptoAscenso || 'Premio por ascenso',
    campeonatoPorDivisionOrden: cfg.campeonatoPorDivisionOrden || {},
    ascensoPorDivisionOrigenOrden: cfg.ascensoPorDivisionOrigenOrden || {},
    valoresFallback: cfg.valoresFallback || { campeonato:750000000, ascenso:500000000 },
    acumularCampeonatoYAscenso: cfg.acumularCampeonatoYAscenso !== false
  };
}
function seasonPrizeDivisionOrder(division){
  return Math.max(1, Math.round(Number(division?.order || divisionOrderFromName(division?.name) || 1)));
}
function seasonChampionPrizeAmount(division){
  const cfg = managerSeasonPrizeConfig();
  if(!cfg.activo) return 0;
  const order = seasonPrizeDivisionOrder(division);
  const direct = Number(cfg.campeonatoPorDivisionOrden?.[order]);
  if(Number.isFinite(direct) && direct > 0) return Math.round(direct);
  return Math.max(0, Math.round(Number(cfg.valoresFallback?.campeonato || 0)));
}
function seasonPromotionPrizeAmount(division){
  const cfg = managerSeasonPrizeConfig();
  if(!cfg.activo) return 0;
  const order = seasonPrizeDivisionOrder(division);
  const direct = Number(cfg.ascensoPorDivisionOrigenOrden?.[order]);
  if(Number.isFinite(direct) && direct > 0) return Math.round(direct);
  return Math.max(0, Math.round(Number(cfg.valoresFallback?.ascenso || 0)));
}
function applyManagerSeasonPrize(delta, concept, meta={}){
  if(!game) return 0;
  const amount = Math.max(0, Math.round(Number(delta || 0)));
  if(amount <= 0) return 0;
  if(typeof recordBudgetChange === 'function'){
    recordBudgetChange(amount, concept, { type:'season_prize', category:'Premios temporada', ...meta });
  } else {
    game.budgetHistory = Array.isArray(game.budgetHistory) ? game.budgetHistory : [];
    game.budget = Math.round(Number(game.budget || 0) + amount);
    game.lastBudgetDelta = amount;
    game.budgetHistory.push({
      season:game.seasonNumber || 1,
      matchdayIndex:game.matchdayIndex || 0,
      date:game.currentDate || '',
      concept,
      delta:amount,
      budget:game.budget,
      type:'season_prize',
      category:'Premios temporada',
      ...meta
    });
  }
  game.clubBudgets = (game.clubBudgets && typeof game.clubBudgets === 'object' && !Array.isArray(game.clubBudgets)) ? game.clubBudgets : {};
  if(Number.isFinite(Number(game.selectedClubId))) game.clubBudgets[game.selectedClubId] = Math.round(Number(game.budget || 0));
  return amount;
}
function awardManagerSeasonPrizes(record){
  if(!game || !record) return { total:0, champion:0, promotion:0, applied:false };
  const cfg = managerSeasonPrizeConfig();
  if(!cfg.activo) return { total:0, champion:0, promotion:0, applied:false };
  const key = `${record.season || game.seasonNumber || 1}-${record.clubId || game.selectedClubId}`;
  game.seasonPrizeAwards = (game.seasonPrizeAwards && typeof game.seasonPrizeAwards === 'object' && !Array.isArray(game.seasonPrizeAwards)) ? game.seasonPrizeAwards : {};
  if(cfg.evitarDuplicados && game.seasonPrizeAwards[key]) return { ...game.seasonPrizeAwards[key], applied:false, duplicate:true };
  const championPrize = Math.max(0, Math.round(Number(record.championPrize || 0)));
  const promotionPrize = Math.max(0, Math.round(Number(record.promotionPrize || 0)));
  const total = championPrize + promotionPrize;
  if(total <= 0){
    game.seasonPrizeAwards[key] = { total:0, champion:0, promotion:0, season:record.season, clubId:record.clubId };
    return { total:0, champion:0, promotion:0, applied:false };
  }
  if(championPrize > 0){
    applyManagerSeasonPrize(championPrize, `${cfg.conceptoCampeon}: ${record.divisionName || 'liga'}`, { prizeType:'champion', divisionId:record.divisionId, divisionName:record.divisionName });
  }
  if(promotionPrize > 0){
    applyManagerSeasonPrize(promotionPrize, `${cfg.conceptoAscenso}: ${record.divisionName || 'liga'}`, { prizeType:'promotion', divisionId:record.divisionId, divisionName:record.divisionName });
  }
  const summary = { total, champion:championPrize, promotion:promotionPrize, season:record.season, clubId:record.clubId, applied:true };
  game.seasonPrizeAwards[key] = summary;
  const parts = [];
  if(championPrize > 0) parts.push(`campeonato ${formatMoney(championPrize)}`);
  if(promotionPrize > 0) parts.push(`ascenso ${formatMoney(promotionPrize)}`);
  pushGameMessage({
    type:'finanzas',
    priority:'high',
    title:'Premios deportivos acreditados',
    body:`La federación acreditó ${formatMoney(total)} por ${parts.join(' + ')}.`,
    id:`season-prizes-${key}`
  });
  return summary;
}

function finalizeSeasonIfNeeded(options={}){
  if(!game || game.seasonFinalized || game.matchdayIndex < game.fixtures.length) return;
  const managerAbsent = Boolean(options?.managerAbsent || game?.gameOver?.active);
  repairCrossCountryClubAssignments({ restoreNativeIfNeeded:false });
  game.clubDivisionOverrides = snapshotClubDivisionOverrides();
  game.managerStats = normalizeManagerStats(game.managerStats);
  const movementsPreview = computeSeasonMovements();
  let record = null;
  if(!managerAbsent){
    const division = clubDivision(game.selectedClubId);
    const table = sortedStandings(division.id);
    const index = table.findIndex(row => row.clubId === game.selectedClubId);
    const row = table[index] || game.standings[game.selectedClubId] || {};
    const position = index >= 0 ? index + 1 : null;
    const champion = position === 1;
    const promoted = movementsPreview.some(move => move.type === 'promotion' && Number(move.clubId) === Number(game.selectedClubId));
    const totalTeams = table.length || 0;
    const wasRelegated = Boolean(movementsPreview.some(move => move.type === 'relegation' && Number(move.clubId) === Number(game.selectedClubId)));
    const finishedLast = Boolean(position && totalTeams && position === totalTeams);
    const prizeConfig = managerSeasonPrizeConfig();
    record = {
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
      promoted,
      championPrize: champion ? seasonChampionPrizeAmount(division) : 0,
      promotionPrize: promoted && (!champion || prizeConfig.acumularCampeonatoYAscenso) ? seasonPromotionPrizeAmount(division) : 0,
      managerPrestigeChampionReward: champion ? championPrestigeRewardByDivisionOrder(division.order || divisionOrderFromName(division.name)) : 0,
      managerPrestigeBadSeasonPenalty: managerObjectiveBadSeasonPenalty({ relegated:wasRelegated, last:finishedLast })
    };
    record.totalSeasonPrize = Math.max(0, Math.round(Number(record.championPrize || 0) + Number(record.promotionPrize || 0)));
    if(!game.managerStats.seasons.some(s => s.season === record.season)){
      const objective = Number.isFinite(Number(game.managerStats.currentSeason?.objectivePpg)) ? Number(game.managerStats.currentSeason.objectivePpg) : managerObjectiveForClubDivision(game.selectedClubId);
      const seasonPpg = ppgFromTotals(game.managerStats.currentSeason || record);
      const objectiveDelta = Number.isFinite(Number(objective)) ? managerObjectiveResultDelta(seasonPpg, objective) : 0;
      const objectiveReward = !currentGameIsFounderMode() && Number.isFinite(Number(objective)) ? managerObjectivePrestigeRewardForDelta(objectiveDelta) : { points:0, label:'Sin objetivo' };
      record.objectivePpg = objective;
      record.objectiveAchieved = !currentGameIsFounderMode() && Number.isFinite(Number(objective)) && seasonPpg >= Number(objective);
      record.objectiveDelta = objectiveDelta;
      record.objectiveExpectation = game.managerStats.currentSeason?.objectiveExpectation || '';
      record.objectiveLabel = game.managerStats.currentSeason?.objectiveLabel || '';
      record.objectiveSource = game.managerStats.currentSeason?.objectiveSource || '';
      record.objectiveFixed = Boolean(game.managerStats.currentSeason?.objectiveFixed);
      record.objectivePrestigeRelative = game.managerStats.currentSeason?.objectivePrestigeRelative;
      record.managerPrestigeObjectiveReward = objectiveReward.points;
      record.objectivePrestigeLabel = objectiveReward.label;
      record.ppg = seasonPpg;
      game.managerStats.seasons.push(record);
      if(champion) recordManagerOfficialTitleForState(game, { season:record.season, year:game.seasonYear, type:'league', competitionId:division.id, competitionName:division.name, clubId:game.selectedClubId, clubName:clubName(game.selectedClubId) });
      game.managerStats = normalizeManagerStats(game.managerStats);
      if(typeof checkManagerAchievements === 'function') checkManagerAchievements({ silent:false });
      if(Number(objectiveReward.points || 0) !== 0){
        const sign = objectiveReward.points > 0 ? 'Suma' : 'Resta';
        pushGameMessage({ type:'directiva', priority:objectiveReward.points > 0 ? 'normal' : 'high', title:objectiveReward.label, body:`${record.clubName}: ${seasonPpg.toFixed(2)} PPG / objetivo ${Number(objective || 0).toFixed(2)}. ${sign} ${Math.abs(objectiveReward.points)} punto(s) de prestigio de manager.`, id:`objective-prestige-${record.season}-${record.clubId}` });
      }
    }
    if(champion){
      pushGameMessage({ type:'deportivo', priority:'high', title:'Has salido campeón', body:`Felicitaciones: ${clubName(game.selectedClubId)} salió campeón de ${division.name}. Suma ${record.managerPrestigeChampionReward} puntos de prestigio de manager.`, id:`champion-${game.seasonNumber || 1}-${game.selectedClubId}` });
      if(typeof awardSpecialChampionPoints === 'function') awardSpecialChampionPoints(division);
    }
    if(record.managerPrestigeBadSeasonPenalty > 0){
      pushGameMessage({ type:'directiva', priority:'high', title:'Prestigio de manager reducido', body:`Descender o terminar último resta ${record.managerPrestigeBadSeasonPenalty} puntos de prestigio de manager.`, id:`bad-season-prestige-${game.seasonNumber || 1}-${game.selectedClubId}` });
    }
    if(typeof finalizeActiveManagerChallenge === 'function') finalizeActiveManagerChallenge(record);
  }
  const seasonPrizeAwards = record ? awardManagerSeasonPrizes(record) : null;
  recordLeagueChampionsForCurrentSeason();
  snapshotStandingsHistoryForCurrentSeason();
  const prestigeChanges = updateClubPrestigeAfterSeason(movementsPreview);
  const movements = movementsPreview;
  if(record && currentGameIsFounderMode() && record.promoted){
    ensureFounderGoalsState();
    game.founderGoals.promotions = Math.max(0, Math.round(Number(game.founderGoals.promotions || 0))) + 1;
  }
  if(record && typeof queueNextSeasonTransferBudgetUnlock === 'function'){
    if(record.promoted) queueNextSeasonTransferBudgetUnlock('promotion', transferBudgetConfig().unlockPromotion, 'Ascenso');
    if(record.title) queueNextSeasonTransferBudgetUnlock('champion', transferBudgetConfig().unlockChampion, 'Campeón');
  }
  const salariesPaid = managerAbsent ? 0 : paySeasonSalaries();
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
    seasonPrizeAwards,
    managerAbsent,
    forcedByFounder:Boolean(options?.forcedByFounder),
    agingApplied:true
  };
  game.seasonFinalized = true;
  game.seasonPhase = 'finalized';
  game.seasonEndModalShown = managerAbsent;
  if(!managerAbsent) queueAutomaticRankingSubmission('season_end');
}
function applySeasonMovements(){
  const movements = game?.seasonTransition?.movements || [];
  const divisions = divisionOrderList();
  const byId = Object.fromEntries(divisions.map(d => [d.id, d]));
  movements.forEach(move => {
    const club = seed.clubs.find(c => Number(c.id) === Number(move.clubId));
    const from = byId[move.fromDivisionId];
    const target = byId[move.toDivisionId];
    if(!club || !target) return;
    const clubCountry = clubCountryKeyForIntegrity(club);
    const targetCountry = divisionCountryKey(target);
    const fromCountry = from ? divisionCountryKey(from) : clubCountry;
    if(clubCountry && targetCountry && clubCountry !== targetCountry) return;
    if(from && fromCountry && targetCountry && fromCountry !== targetCountry) return;
    setClubIntegrityDivision(club, target);
  });
  repairCrossCountryClubAssignments({ restoreNativeIfNeeded:false });
  game.clubDivisionOverrides = snapshotClubDivisionOverrides();
}

function statusObjectIsEmpty(status){
  return !status || Object.keys(status).length === 0;
}
function removeInjuryFieldsFromStatus(status){
  const clean = { ...(status || {}) };
  delete clean.injuredThrough;
  delete clean.injuredUntilTurn;
  delete clean.injuryLabel;
  delete clean.injuryChance;
  delete clean.injuredAtMatchday;
  delete clean.injuredAtTurn;
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

function botBalanceEligibleClubIdsForWear(options={}){
  if(!game || !seed?.clubs) return [];
  const ownId = Number(game?.selectedClubId || 0);
  const forceAll = Boolean(options.allClubs || game?.gameOver?.active || !ownId);
  if(forceAll){
    return (seed.clubs || []).map(club => Number(club.id || 0)).filter(Boolean);
  }
  return botBalanceClubIds(ownId);
}
function normalizeBotWearAndConditionForClub(clubId, options={}){
  if(!game || !PLAYER_WEAR_ENABLED || !clubId) return { players:0, wearReduced:0, conditionRaised:0 };
  const cleanClubId = Number(clubId || 0);
  const ownId = Number(game?.selectedClubId || 0);
  if(!options.includeManagedClub && ownId && cleanClubId === ownId && !game?.gameOver?.active) return { players:0, wearReduced:0, conditionRaised:0 };
  const wearCap = clamp(Math.round(Number(options.wearCap ?? BOT_BALANCE_MATCH_WEAR_CAP ?? 38)), 0, PLAYER_WEAR_MAX);
  const conditionFloor = clamp(Math.round(Number(options.conditionFloor ?? BOT_BALANCE_EMERGENCY_CONDITION_FLOOR ?? BOT_BALANCE_CONDITION_FLOOR ?? 58)), 0, 99);
  let players = 0;
  let wearReduced = 0;
  let conditionRaised = 0;
  playersByClub(cleanClubId).forEach(player => {
    if(!player || player.freeAgent || player.retired || isInjured(player.id) || isSuspended(player.id)) return;
    const beforeWear = currentPlayerWear(player.id);
    if(beforeWear > wearCap){
      wearReduced += Math.abs(Math.min(0, adjustPlayerWear(player.id, wearCap - beforeWear)));
    }
    const maxAllowed = maxConditionForPlayer(player.id);
    const target = Math.min(conditionFloor, maxAllowed);
    const beforeCondition = currentCondition(player.id);
    if(beforeCondition < target){
      game.playerCondition[player.id] = clamp(Math.round(target), 0, maxAllowed);
      conditionRaised += Math.max(0, Math.round(target - beforeCondition));
    }
    if(beforeWear > wearCap || beforeCondition < target) players += 1;
  });
  return { players, wearReduced, conditionRaised };
}
function normalizeBotWearAndConditionForMatch(match, options={}){
  if(!match) return { clubs:0, players:0, wearReduced:0, conditionRaised:0 };
  const clubIds = [Number(match.homeId || 0), Number(match.awayId || 0)].filter(Boolean);
  const summary = { clubs:0, players:0, wearReduced:0, conditionRaised:0 };
  clubIds.forEach(clubId => {
    const result = normalizeBotWearAndConditionForClub(clubId, options);
    if(result.players > 0){
      summary.clubs += 1;
      summary.players += result.players;
      summary.wearReduced += result.wearReduced;
      summary.conditionRaised += result.conditionRaised;
    }
  });
  if(summary.players > 0){
    game.botWearRepairLog = Array.isArray(game.botWearRepairLog) ? game.botWearRepairLog : [];
    game.botWearRepairLog.unshift({
      season:game.seasonNumber || 1,
      date:game.currentDate || '',
      matchId:match.id || null,
      reason:options.reason || 'before_match',
      ...summary,
      createdAt:Date.now()
    });
    game.botWearRepairLog = game.botWearRepairLog.slice(0, 20);
  }
  return summary;
}
function recoverBotWearDaily(options={}){
  if(!game || !PLAYER_WEAR_ENABLED || !BOT_BALANCE_ENABLED) return { clubs:0, players:0, wearReduced:0, conditionRaised:0 };
  const recovery = clamp(Math.round(Number(options.recovery ?? BOT_BALANCE_DAILY_WEAR_RECOVERY ?? 0)), 0, PLAYER_WEAR_MAX);
  if(recovery <= 0) return { clubs:0, players:0, wearReduced:0, conditionRaised:0 };
  const conditionGain = clamp(Math.round(Number(options.conditionGain ?? Math.max(1, Math.round(recovery * 1.5)))), 0, 99);
  const clubIds = botBalanceEligibleClubIdsForWear(options);
  const summary = { clubs:0, players:0, wearReduced:0, conditionRaised:0 };
  clubIds.forEach(clubId => {
    let clubPlayers = 0;
    playersByClub(clubId).forEach(player => {
      if(!player || player.freeAgent || player.retired) return;
      const beforeWear = currentPlayerWear(player.id);
      if(beforeWear <= 0) return;
      const reduced = Math.abs(Math.min(0, adjustPlayerWear(player.id, -recovery)));
      if(reduced > 0){
        summary.wearReduced += reduced;
        clubPlayers += 1;
      }
      if(!isInjured(player.id) && !isSuspended(player.id)){
        const beforeCondition = currentCondition(player.id);
        const maxAllowed = maxConditionForPlayer(player.id);
        const target = Math.min(maxAllowed, beforeCondition + conditionGain);
        if(target > beforeCondition){
          game.playerCondition[player.id] = clamp(Math.round(target), 0, maxAllowed);
          summary.conditionRaised += Math.round(target - beforeCondition);
        }
      }
    });
    if(clubPlayers > 0){
      summary.clubs += 1;
      summary.players += clubPlayers;
    }
  });
  if(summary.players > 0){
    game.botWearRecoveryLog = Array.isArray(game.botWearRecoveryLog) ? game.botWearRecoveryLog : [];
    game.botWearRecoveryLog.unshift({
      season:game.seasonNumber || 1,
      date:game.currentDate || '',
      reason:options.reason || 'daily',
      ...summary,
      createdAt:Date.now()
    });
    game.botWearRecoveryLog = game.botWearRecoveryLog.slice(0, 20);
  }
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
      if(PLAYER_WEAR_ENABLED && currentPlayerWear(player.id) > BOT_BALANCE_MATCH_WEAR_CAP){
        adjustPlayerWear(player.id, -(currentPlayerWear(player.id) - BOT_BALANCE_MATCH_WEAR_CAP));
        changed = true;
      }
      const cond = currentCondition(player.id);
      if(cond < targetCondition){
        const maxAllowed = maxConditionForPlayer(player.id);
        game.playerCondition[player.id] = clamp(Math.round(Math.min(targetCondition, cond + BOT_BALANCE_MAINTENANCE_CONDITION_GAIN, maxAllowed)), 0, maxAllowed);
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
  if(typeof archiveManagerPlayerStatsClub === 'function') archiveManagerPlayerStatsClub(game.selectedClubId, { final:true });
  archiveClubWorldCupEditionForState(game, { allowIncomplete:true });
  const retiredCount = game.seasonTransition?.retirements?.length || 0;
  const previousClubId = Number(game.selectedClubId || 0);
  const nextClubId = Number(selectedClubId || game.selectedClubId);
  const previousMatchdayIndex = Number(game.matchdayIndex || game.fixtures?.length || 0);
  const previousBotBalanceRanks = botBalanceRankMap();
  const configuredPostseasonRecovery = postseasonTurnsForCurrentSeason();
  const appliedPostseasonRecovery = injuryRecoveryTurnsRegistered(game.seasonNumber || 1, 'postseason');
  const missingPostseasonRecovery = Math.max(0, configuredPostseasonRecovery - appliedPostseasonRecovery);
  applySeasonStartAvailabilityRebase(previousMatchdayIndex, missingPostseasonRecovery);
  const stadiumCapacityDecay = typeof applyManagedStadiumCapacityDeterioration === 'function' ? applyManagedStadiumCapacityDeterioration(previousClubId, game.seasonNumber || 1) : null;
  assignBotFieldStatesForNextSeason(nextClubId, previousClubId);
  repairInvalidBotFieldStates(game, 'season_transition', { message:false });
  applySeasonMovements();
  repairCrossCountryClubAssignments({ restoreNativeIfNeeded:false });
  game.clubDivisionOverrides = snapshotClubDivisionOverrides();
  const aging = applySeasonalAging();
  applyAcademyAgingIfNeeded();
  refreshAllPlayerClauses();
  game.selectedClubId = nextClubId;
  game.seasonNumber = (game.seasonNumber || 1) + 1;
  const transferUnlock = typeof consumeNextSeasonTransferBudgetUnlock === 'function' ? consumeNextSeasonTransferBudgetUnlock() : { rate:0, reasons:[] };
  game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber, game.selectedClubId);
  game.transferBudget = typeof createTransferBudgetState === 'function' ? createTransferBudgetState(game.selectedClubId, game.seasonNumber, transferUnlock.rate || 0) : (game.transferBudget || null);
  game.bankLoan = typeof refreshBankLoanOffersForSeason === 'function' ? refreshBankLoanOffersForSeason(game.bankLoan, game.seasonNumber) : (game.bankLoan || null);
  if(transferUnlock?.rate && typeof transferBudgetAddHistory === 'function'){
    transferBudgetAddHistory('season_bonus', `Bonus de directiva: ${(transferUnlock.reasons || []).map(r => r.reason).filter(Boolean).join(' + ') || 'temporada anterior'}`, 0, transferUnlock.rate);
  }
  game.seasonYear = seasonYearForNumber(game.seasonNumber);
  if(typeof ensureLeagueSeasonEconomyForSeason === 'function') ensureLeagueSeasonEconomyForSeason(game, game.seasonNumber, { force:true, reason:'season_start' });
  game.calendarVersion = SEASON_CALENDAR_VERSION;
  game.seasonInitialBudget = Math.round(Number(game.budget || 0));
  game.seasonBudgetStartBySeason = game.seasonBudgetStartBySeason || {};
  game.seasonBudgetStartBySeason[game.seasonNumber] = game.seasonInitialBudget;
  game.seasonFinalized = false;
  game.seasonTransition = null;
  game.argentinaPlayoffs = null;
  game.clubWorldCup = null;
  game.seasonEndModalShown = false;
  game.seasonPhase = 'preseason';
  game.phaseTurn = 0;
  game.postseasonStartDate = '';
  game.postseasonTotalTurns = 0;
  game.preseasonFriendliesPlayed = 0;
  game.pendingFriendlyOpponentId = 0;
  game.matchdayIndex = 0;
  game.fixtures = generateFixturesForDivisions(seed.clubs, divisionOrderList(), { seasonYear:game.seasonYear });
  const previousDate = validIsoDate(game.currentDate) ? game.currentDate : seasonEndDateForYear(seasonYearForNumber((game.seasonNumber || 2) - 1));
  const nextSeasonStart = firstAdvanceDateForSeason(game.seasonYear);
  game.currentDate = validIsoDate(previousDate) && daysBetweenIsoDates(previousDate, nextSeasonStart) <= 0 ? nextSeasonStart : addDaysToIsoDate(previousDate, 1);
  game.lastCalendarDate = game.currentDate;
  game.standings = createInitialStandings();
  game.playerStats = createInitialPlayerStats();
  game.playerStars = normalizePlayerStarsState(game.playerStars || {});
  game.playerImpactWindows = normalizePlayerImpactWindows(game.playerImpactWindows || {});
  syncPlayerStarsWithClubs(game);
  game.matchHistory = [];
  game.managerTacticalAdaptation = { season:game.seasonNumber || 1, signature:'', streak:0, lastBonus:0, lastProspectiveStreak:0 };
  game.playerBenchedStreak = { season:game.seasonNumber || 1, players:{} };
  game.lastOwnProblems = [];
  game.lastTurnSummary = null;
  game.mustReviewTactics = false;
  game.seasonEndPlayerOffers = null;
  game.rejectedPurchaseOffers = {};
  game.rejectedFreeAgentOffers = {};
  resetAcademySeasonState();
  resetStaffSeasonState();
  if(typeof resetScoutingCenterForNewSeason === 'function') resetScoutingCenterForNewSeason();
  game.monthlyExpenses = {};
  game.advanceLockedUntil = 0;
  game.lastBudgetDelta = 0;
  game.tactic = normalizeTactic(nextClubId, DEFAULT_TACTIC);
  mergeMarketPlayersIntoSeed(game.marketPlayers || []);
  renewFreeAgentMarketForSeason(retiredCount);
  ensurePlayerStateForAll();
  balanceBotsForSeasonStart(nextClubId, previousBotBalanceRanks);
  generateOpeningSponsorOffers(true);
  const leagueEconomyText = typeof leagueSeasonEconomyMessageForClub === 'function' ? leagueSeasonEconomyMessageForClub(game.selectedClubId, game.seasonNumber) : '';
  pushGameMessage({ type:'deportivo', title:`Temporada ${game.seasonNumber} iniciada`, body:`Comienza una nueva temporada con ${clubName(game.selectedClubId)}.${leagueEconomyText ? ` ${leagueEconomyText}` : ''}`, priority:'normal' });
  if(stadiumCapacityDecay && Number(stadiumCapacityDecay.lost || 0) > 0){
    pushGameMessage({ type:'estadio', title:'Deterioro anual del estadio', body:`El estadio de ${clubName(stadiumCapacityDecay.clubId)} perdió ${new Intl.NumberFormat('es-AR').format(stadiumCapacityDecay.lost)} lugares por deterioro estructural anual (${new Intl.NumberFormat('es-AR').format(stadiumCapacityDecay.before)} → ${new Intl.NumberFormat('es-AR').format(stadiumCapacityDecay.after)}).`, priority:'normal' });
  }
  if(aging?.ageDecay?.players > 0){
    pushGameMessage({ type:'deportivo', title:'Deterioro por edad aplicado', body:`${aging.ageDecay.players} jugador(es) de 32 años o más recibieron penalización anual de habilidades. Total aplicado: -${aging.ageDecay.added} puntos acumulados.`, priority:'normal' });
  }
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
  const moveRows = movements.map(move => `<li><strong>${escapeHtml(clubName(move.clubId))}</strong>: ${move.type === 'promotion' ? 'asciende' : 'desciende'} a ${escapeHtml(move.toDivisionName)}${move.reason ? ` · ${escapeHtml(move.reason)}` : ''}</li>`).join('');
  const retirementRows = retirements.map(p => `<li><strong>${escapeHtml(p.name)}</strong> se retiró del fútbol a los ${p.age} años.</li>`).join('');
  return `<div class="card season-end-card">
    <div class="row"><div><p class="label">Fin de temporada</p><h3>${record?.title ? 'Campeón' : `Posición final: ${escapeHtml(record?.label || '—')}`}</h3></div><span class="pill">Temporada ${game.seasonNumber || 1}</span></div>
    <p class="muted">Podés seguir en ${escapeHtml(clubName(game.selectedClubId))} o elegir otro club para la próxima temporada.</p>
    ${record?.totalSeasonPrize ? `<p class="tagline ok">Premios deportivos cobrados: <strong>${formatMoney(record.totalSeasonPrize)}</strong>${record.championPrize ? ` · Campeonato ${formatMoney(record.championPrize)}` : ''}${record.promotionPrize ? ` · Ascenso ${formatMoney(record.promotionPrize)}` : ''}.</p>` : ''}
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
    ${record?.totalSeasonPrize ? `<p class="tagline ok">Premios cobrados: <strong>${formatMoney(record.totalSeasonPrize)}</strong>${record.championPrize ? ` · Campeonato ${formatMoney(record.championPrize)}` : ''}${record.promotionPrize ? ` · Ascenso ${formatMoney(record.promotionPrize)}` : ''}.</p>` : ''}
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

