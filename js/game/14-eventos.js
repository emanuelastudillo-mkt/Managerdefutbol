/* Motor de eventos condicionales desde data/eventos.json. */

function gameEventDefinitions(){
  const fromDatabase = Array.isArray(eventsDatabase?.eventos) ? eventsDatabase.eventos : [];
  const fromConfig = Array.isArray(configValue('eventos.planilla', [])) ? configValue('eventos.planilla', []) : [];
  return (fromDatabase.length ? fromDatabase : fromConfig).filter(event => event && event.activo !== false && event.id);
}
function ensureEventLog(){
  if(!game) return [];
  game.eventLog = Array.isArray(game.eventLog) ? game.eventLog : [];
  return game.eventLog;
}
function ownInjuriesFromResult(result){
  if(!result || !game) return [];
  return (result.injuries || []).filter(injury => Number(injury.clubId) === Number(game.selectedClubId));
}
function ownRivalFromResult(result){
  if(!result || !game) return null;
  const ownId = Number(game.selectedClubId);
  if(Number(result.homeId) === ownId) return seed.clubs.find(c => Number(c.id) === Number(result.awayId)) || null;
  if(Number(result.awayId) === ownId) return seed.clubs.find(c => Number(c.id) === Number(result.homeId)) || null;
  return null;
}
function eventOccurrenceId(event, context={}){
  const matchId = context.ownResult?.id || context.round?.matchday || 'turno';
  return `${event.id}-s${game?.seasonNumber || 1}-t${game?.globalTurn || game?.matchdayIndex || 0}-${matchId}`;
}
function eventAlreadyTriggered(event, context={}){
  const id = eventOccurrenceId(event, context);
  return ensureEventLog().some(entry => entry.occurrenceId === id);
}
function markEventTriggered(event, context={}, details={}){
  const entry = {
    occurrenceId:eventOccurrenceId(event, context),
    eventId:event.id,
    name:event.nombre || event.id,
    season:game?.seasonNumber || 1,
    turn:game?.globalTurn || game?.matchdayIndex || 0,
    matchdayIndex:game?.matchdayIndex || 0,
    date:game?.currentDate || '',
    matchId:context.ownResult?.id || null,
    createdAt:Date.now(),
    details
  };
  ensureEventLog().push(entry);
  return entry;
}
function eventProbabilityPass(event){
  const probability = clamp(Number(event.probabilidad ?? event.probability ?? 1), 0, 1);
  return probability >= 1 || Math.random() < probability;
}
function evaluateGameEventCondition(condition={}, context={}){
  const type = condition.tipo || condition.type;
  const value = Number(condition.valor ?? condition.value ?? 0);
  const ownResult = context.ownResult || null;
  if(type === 'temporada_regular') return isRegularSeason();
  if(type === 'partido_propio') return !!ownResult;
  if(type === 'partido_propio_visitante') return !!ownResult && Number(ownResult.awayId) === Number(game?.selectedClubId);
  if(type === 'partido_propio_local') return !!ownResult && Number(ownResult.homeId) === Number(game?.selectedClubId);
  if(type === 'lesiones_propias_mayor_a') return ownInjuriesFromResult(ownResult).length > value;
  if(type === 'lesiones_propias_mayor_o_igual_a') return ownInjuriesFromResult(ownResult).length >= value;
  if(type === 'moral_media_menor_a') return squadMoraleAverage(game.selectedClubId) < value;
  if(type === 'moral_media_mayor_a') return squadMoraleAverage(game.selectedClubId) > value;
  if(type === 'cohesion_menor_a') return cohesionValue(game.selectedClubId) < value;
  if(type === 'forma_media_menor_a') return squadFitnessAverage(game.selectedClubId) < value;
  return false;
}
function shouldTriggerGameEvent(event, context={}){
  if(!game || !event || event.activo === false) return false;
  if(event.fase && event.fase !== context.phase) return false;
  if(eventAlreadyTriggered(event, context)) return false;
  const conditions = Array.isArray(event.condiciones) ? event.condiciones : (event.condicion ? [event.condicion] : []);
  if(conditions.length && !conditions.every(condition => evaluateGameEventCondition(condition, context))) return false;
  return eventProbabilityPass(event);
}
function eventContextDetails(context={}, runtime={}){
  const ownResult = context.ownResult || null;
  const rival = ownRivalFromResult(ownResult);
  const injuries = ownInjuriesFromResult(ownResult);
  const players = injuries.map(injury => playerById(injury.playerId)).filter(Boolean);
  return {
    rival: rival?.name || 'el club rival',
    monto: formatMoney(runtime.compensationAmount || 0),
    jugadores: players.map(p => p.name).join(', ') || 'sin detalle',
    lesiones: String(injuries.length),
    moral: String(squadMoraleAverage(game.selectedClubId)),
    cohesion: String(cohesionValue(game.selectedClubId)),
    forma: String(squadFitnessAverage(game.selectedClubId)),
    ...(runtime.templateValues && typeof runtime.templateValues === 'object' ? runtime.templateValues : {})
  };
}
function formatEventTemplate(template='', context={}, runtime={}){
  const details = eventContextDetails(context, runtime);
  return String(template || '').replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => details[key] ?? '');
}
function executeGameEventEffect(event, effect={}, context={}, runtime={}){
  const type = effect.tipo || effect.type;
  if(type === 'compensacion_sueldos_lesionados'){
    const injuries = ownInjuriesFromResult(context.ownResult);
    const players = injuries.map(injury => playerById(injury.playerId)).filter(Boolean);
    const amount = Math.round(players.reduce((sum, player) => sum + Number(player.salary || 0), 0));
    runtime.compensationAmount = amount;
    runtime.affectedPlayerIds = players.map(p => p.id);
    if(amount > 0){
      recordBudgetChange(amount, effect.concepto || 'Compensación por evento', {
        type:'event_compensation',
        eventId:event.id,
        matchId:context.ownResult?.id || null,
        players:runtime.affectedPlayerIds
      });
    }
    return { type, amount, players:runtime.affectedPlayerIds || [] };
  }
  if(type === 'moral_plantel'){
    const delta = Number(effect.valor ?? effect.value ?? 0);
    playersByClub(game.selectedClubId).forEach(player => {
      game.playerMorale[player.id] = clamp(Math.round(currentMorale(player.id) + delta), 1, 99);
    });
    return { type, delta };
  }
  if(type === 'forma_plantel'){
    const delta = Number(effect.valor ?? effect.value ?? 0);
    playersByClub(game.selectedClubId).forEach(player => {
      game.playerCondition[player.id] = clamp(Math.round(currentCondition(player.id) + delta), 0, 99);
    });
    return { type, delta };
  }
  if(type === 'cohesion_equipo'){
    const delta = Number(effect.valor ?? effect.value ?? 0);
    ensureTeamCohesion();
    game.teamCohesion[game.selectedClubId] = clamp(Math.round(cohesionValue(game.selectedClubId) + delta), 0, 100);
    return { type, delta };
  }
  if(type === 'mensaje'){
    const message = pushGameMessage({
      type:effect.mensajeTipo || effect.messageType || 'evento',
      priority:effect.prioridad || effect.priority || 'normal',
      title:formatEventTemplate(effect.titulo || effect.title || event.nombre || 'Evento del club', context, runtime),
      body:formatEventTemplate(effect.cuerpo || effect.body || '', context, runtime),
      id:effect.id ? `${effect.id}-${eventOccurrenceId(event, context)}` : undefined
    });
    return { type, messageId:message?.id || null };
  }
  return { type:type || 'desconocido', skipped:true };
}
function executeGameEvent(event, context={}){
  const runtime = {};
  const effects = Array.isArray(event.efectos) ? event.efectos : [];
  const appliedEffects = effects.map(effect => executeGameEventEffect(event, effect, context, runtime));
  markEventTriggered(event, context, { appliedEffects, runtime });
  return { event, appliedEffects, runtime };
}
function processGameEventsAfterMatches(context={}){
  if(!game || !context.ownResult) return [];
  const eventContext = { ...context, phase:'post_matchday' };
  const triggered = [];
  gameEventDefinitions().forEach(event => {
    if(shouldTriggerGameEvent(event, eventContext)) triggered.push(executeGameEvent(event, eventContext));
  });
  if(triggered.length) game.lastTriggeredEvents = triggered.map(item => ({ id:item.event.id, name:item.event.nombre || item.event.id }));
  else game.lastTriggeredEvents = [];
  return triggered;
}

/* Problemas de vestuario programados por moral y cohesión bajas. */
function lockerRoomProblemDefinitions(){
  const fromDatabase = Array.isArray(eventsDatabase?.problemasVestuario) ? eventsDatabase.problemasVestuario : [];
  const fromConfig = Array.isArray(configValue('eventos.problemasVestuario', [])) ? configValue('eventos.problemasVestuario', []) : [];
  return (fromDatabase.length ? fromDatabase : fromConfig).filter(event => event && event.activo !== false && event.id);
}
function lockerRoomCrisisSettings(){
  return {
    moraleThreshold:Math.round(configNumber('eventos.vestuarioMoralUmbral', 60, 1, 99)),
    cohesionThreshold:Math.round(configNumber('eventos.vestuarioCohesionUmbral', 60, 1, 100)),
    intervalDays:Math.max(1, Math.round(configNumber('eventos.vestuarioIntervaloDias', 5, 1, 60))),
    probability:clamp(configNumber('eventos.vestuarioProbabilidad', 0.30, 0, 1), 0, 1),
    recentLimit:Math.max(0, Math.round(configNumber('eventos.vestuarioEventosRecientes', 5, 0, 20)))
  };
}
function ensureLockerRoomCrisisState(){
  if(!game) return null;
  const raw = game.lockerRoomCrisis && typeof game.lockerRoomCrisis === 'object' ? game.lockerRoomCrisis : {};
  game.lockerRoomCrisis = {
    clubId:Number(raw.clubId || 0),
    season:Math.max(1, Math.round(Number(raw.season || game.seasonNumber || 1))),
    active:Boolean(raw.active),
    startedTurn:Math.max(0, Math.round(Number(raw.startedTurn || 0))),
    nextCheckTurn:Math.max(0, Math.round(Number(raw.nextCheckTurn || 0))),
    lastCheckTurn:Math.max(0, Math.round(Number(raw.lastCheckTurn || 0))),
    checks:Math.max(0, Math.round(Number(raw.checks || 0))),
    events:Math.max(0, Math.round(Number(raw.events || 0))),
    recentEventIds:Array.isArray(raw.recentEventIds) ? raw.recentEventIds.map(String).filter(Boolean).slice(-20) : [],
    lastEventId:String(raw.lastEventId || ''),
    lastEventDate:String(raw.lastEventDate || ''),
    lastEventTurn:Math.max(0, Math.round(Number(raw.lastEventTurn || 0)))
  };
  return game.lockerRoomCrisis;
}
function lockerRoomHash(seedText, max=1000000){
  const limit = Math.max(1, Math.round(Number(max || 1)));
  if(typeof hashNumber === 'function') return hashNumber(String(seedText || ''), limit);
  let hash = 2166136261;
  const text = String(seedText || '');
  for(let i=0;i<text.length;i++){
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0) % limit;
}
function lockerRoomDeterministicOrder(players=[], seedText=''){
  return (Array.isArray(players) ? players : []).slice().sort((a,b) => {
    const aHash = lockerRoomHash(`${seedText}-${Number(a?.id || 0)}`, 1000000);
    const bHash = lockerRoomHash(`${seedText}-${Number(b?.id || 0)}`, 1000000);
    return aHash - bHash || Number(a?.id || 0) - Number(b?.id || 0);
  });
}
function lockerRoomEligiblePlayers(clubId){
  return playersByClub(clubId)
    .filter(player => player && !player.freeAgent && Number(player.clubId || 0) === Number(clubId) && !isInjured(player.id))
    .sort((a,b) => Number(a.id || 0) - Number(b.id || 0));
}
function lockerRoomTacticIds(key){
  return new Set((game?.tactic?.[key] || []).map(Number).filter(Boolean));
}
function lockerRoomCaptainPlayer(eligible=[]){
  const captainId = Number(game?.tactic?.captainId || 0);
  return eligible.find(player => Number(player.id) === captainId) || null;
}
function lockerRoomPickDistinct(source=[], count=1, seedText='', used=new Set()){
  const ordered = lockerRoomDeterministicOrder(source.filter(player => player && !used.has(Number(player.id))), seedText);
  const picked = ordered.slice(0, Math.max(0, Number(count || 0)));
  picked.forEach(player => used.add(Number(player.id)));
  return picked;
}
function lockerRoomFallbackParticipants(eligible=[], count=1, seedText='', preferred=[]){
  const used = new Set();
  const output = [];
  (preferred || []).filter(Boolean).forEach(player => {
    if(output.length >= count || used.has(Number(player.id))) return;
    output.push(player);
    used.add(Number(player.id));
  });
  output.push(...lockerRoomPickDistinct(eligible, count - output.length, `${seedText}-fallback`, used));
  return output.slice(0, count);
}
function selectLockerRoomParticipants(event, seedText=''){
  const clubId = Number(game?.selectedClubId || 0);
  const eligible = lockerRoomEligiblePlayers(clubId);
  if(!eligible.length) return [];
  const starters = lockerRoomTacticIds('starters');
  const bench = lockerRoomTacticIds('bench');
  const selector = String(event?.selector || 'random_pair');
  const countMap = { random_pair:2, goalkeeper_defender:2, captain_challenger:2, reserve_single:1, random_four:4, random_three:3, starting_pair:2, veteran_youth:2, same_position_pair:2, star_reserve:2, captain_group:3, low_morale_three:3, highest_salary_three:3, random_single:1 };
  const count = Number(countMap[selector] || 2);
  let picked = [];
  if(selector === 'goalkeeper_defender'){
    const goalkeeper = lockerRoomPickDistinct(eligible.filter(player => player.position === 'POR'), 1, `${seedText}-gk`)[0];
    const defender = lockerRoomPickDistinct(eligible.filter(player => ['DFC','LD','LI'].includes(player.position) && Number(player.id) !== Number(goalkeeper?.id)), 1, `${seedText}-def`)[0];
    picked = [goalkeeper, defender].filter(Boolean);
  }else if(selector === 'captain_challenger'){
    const captain = lockerRoomCaptainPlayer(eligible);
    const challenger = eligible.filter(player => Number(player.id) !== Number(captain?.id)).sort((a,b) => Number(b.skills?.liderazgo || 0) - Number(a.skills?.liderazgo || 0) || Number(b.overall || 0) - Number(a.overall || 0))[0];
    picked = [captain, challenger].filter(Boolean);
  }else if(selector === 'reserve_single'){
    const reserves = eligible.filter(player => !starters.has(Number(player.id)) && !bench.has(Number(player.id)));
    const substitutes = eligible.filter(player => !starters.has(Number(player.id)));
    picked = lockerRoomPickDistinct(reserves.length ? reserves : substitutes.length ? substitutes : eligible, 1, `${seedText}-reserve`);
  }else if(selector === 'starting_pair'){
    picked = lockerRoomPickDistinct(eligible.filter(player => starters.has(Number(player.id))), 2, `${seedText}-starters`);
  }else if(selector === 'veteran_youth'){
    const byAge = eligible.slice().sort((a,b) => Number(b.age || 0) - Number(a.age || 0) || Number(a.id || 0) - Number(b.id || 0));
    const veteran = byAge[0];
    const youth = byAge.slice().reverse().find(player => Number(player.id) !== Number(veteran?.id));
    picked = [veteran, youth].filter(Boolean);
  }else if(selector === 'same_position_pair'){
    const groups = new Map();
    eligible.forEach(player => {
      const key = typeof playerGroup === 'function' ? playerGroup(player.position) : String(player.position || '');
      if(!groups.has(key)) groups.set(key, []);
      groups.get(key).push(player);
    });
    const validGroups = [...groups.entries()].filter(([, players]) => players.length >= 2).sort(([a],[b]) => String(a).localeCompare(String(b)));
    if(validGroups.length){
      const groupIndex = lockerRoomHash(`${seedText}-position-group`, validGroups.length);
      picked = lockerRoomPickDistinct(validGroups[groupIndex][1], 2, `${seedText}-position-pair`);
    }
  }else if(selector === 'star_reserve'){
    const star = eligible.slice().sort((a,b) => Number(b.overall || 0) - Number(a.overall || 0) || Number(a.id || 0) - Number(b.id || 0))[0];
    const reserves = eligible.filter(player => Number(player.id) !== Number(star?.id) && !starters.has(Number(player.id)));
    const reserve = lockerRoomPickDistinct(reserves.length ? reserves : eligible.filter(player => Number(player.id) !== Number(star?.id)), 1, `${seedText}-star-reserve`)[0];
    picked = [star, reserve].filter(Boolean);
  }else if(selector === 'captain_group'){
    const captain = lockerRoomCaptainPlayer(eligible);
    picked = lockerRoomFallbackParticipants(eligible, 3, `${seedText}-captain-group`, [captain]);
  }else if(selector === 'low_morale_three'){
    picked = eligible.slice().sort((a,b) => currentMorale(a.id) - currentMorale(b.id) || Number(a.id || 0) - Number(b.id || 0)).slice(0, 3);
  }else if(selector === 'highest_salary_three'){
    picked = eligible.slice().sort((a,b) => Number(b.salary || 0) - Number(a.salary || 0) || Number(a.id || 0) - Number(b.id || 0)).slice(0, 3);
  }else{
    picked = lockerRoomPickDistinct(eligible, count, `${seedText}-${selector}`);
  }
  return lockerRoomFallbackParticipants(eligible, count, seedText, picked);
}
function lockerRoomApplyPlayerMorale(player, delta){
  if(!player || !Number.isFinite(Number(delta)) || Number(delta) === 0) return 0;
  game.playerMorale = game.playerMorale || {};
  const before = currentMorale(player.id);
  const after = clamp(Math.round(before + Number(delta)), 1, 99);
  game.playerMorale[player.id] = after;
  return after - before;
}
function lockerRoomApplyPlayerCondition(player, delta){
  if(!player || !Number.isFinite(Number(delta)) || Number(delta) === 0) return 0;
  game.playerCondition = game.playerCondition || {};
  const before = currentCondition(player.id);
  const after = clamp(Math.round(before + Number(delta)), 0, 99);
  game.playerCondition[player.id] = after;
  return after - before;
}
function lockerRoomInjuryDays(eventId, playerId, minDays, maxDays, turn){
  const min = Math.max(1, Math.round(Number(minDays || 1)));
  const max = Math.max(min, Math.round(Number(maxDays || min)));
  return min + lockerRoomHash(`${eventId}-${playerId}-${turn}-injury`, max - min + 1);
}
function executeLockerRoomProblem(event, participants=[], state=null){
  if(!game || !event || !participants.length) return null;
  const turn = typeof currentTurnIndex === 'function' ? currentTurnIndex() : Math.max(0, Number(game.globalTurn || 0));
  const participantMap = {};
  const templateValues = {};
  participants.forEach((player, index) => {
    const key = `jugador${index + 1}`;
    participantMap[key] = player;
    templateValues[key] = player.name || 'Jugador';
  });
  const uniformMorale = Number(event.moralParticipantes || 0);
  participants.forEach(player => lockerRoomApplyPlayerMorale(player, uniformMorale));
  Object.entries(event.moralPorJugador || {}).forEach(([key, delta]) => lockerRoomApplyPlayerMorale(participantMap[key], Number(delta || 0)));
  const uniformCondition = Number(event.formaParticipantes || 0);
  participants.forEach(player => lockerRoomApplyPlayerCondition(player, uniformCondition));
  if(Number(event.moralPlantel || 0) !== 0 && typeof adjustSquadMorale === 'function') adjustSquadMorale(game.selectedClubId, Number(event.moralPlantel || 0));
  const cohesionChange = typeof adjustTeamCohesion === 'function' ? adjustTeamCohesion(game.selectedClubId, Number(event.cohesion || 0)) : 0;
  const injuries = [];
  (Array.isArray(event.lesiones) ? event.lesiones : []).forEach((injuryDefinition, injuryIndex) => {
    (injuryDefinition.jugadores || []).forEach(key => {
      const player = participantMap[key];
      if(!player || isInjured(player.id)) return;
      const days = lockerRoomInjuryDays(event.id, player.id, injuryDefinition.diasMin, injuryDefinition.diasMax, turn + injuryIndex);
      injuries.push({
        clubId:Number(game.selectedClubId),
        playerId:Number(player.id),
        playerName:player.name || 'Jugador',
        injuryLabel:String(injuryDefinition.nombre || 'Contusión'),
        name:String(injuryDefinition.nombre || 'Contusión'),
        matchesOut:days,
        chance:1,
        source:'locker_room'
      });
      templateValues[`dias_${key}`] = String(days);
    });
  });
  if(injuries.length && typeof applyAvailability === 'function'){
    applyAvailability([], injuries);
    injuries.forEach(injury => {
      if(game.playerStats?.[injury.playerId]) game.playerStats[injury.playerId].injuries = Number(game.playerStats[injury.playerId].injuries || 0) + 1;
    });
    const problems = injuries.map(injury => ({ type:'injury', playerId:injury.playerId }));
    if(typeof removeOwnUnavailableFromTactic === 'function') removeOwnUnavailableFromTactic(problems);
    game.lastOwnProblems = [...(Array.isArray(game.lastOwnProblems) ? game.lastOwnProblems : []), ...problems].filter((item, index, list) => list.findIndex(other => other.type === item.type && Number(other.playerId) === Number(item.playerId)) === index);
    game.mustReviewTactics = game.lastOwnProblems.length > 0;
  }
  const injuryText = injuries.length
    ? ` ${injuries.map(injury => `${injury.playerName} sufrió ${String(injury.injuryLabel || 'una lesión').toLowerCase()} y estará fuera ${injury.matchesOut} días.`).join(' ')}`
    : '';
  const runtime = { templateValues };
  const message = typeof pushGameMessage === 'function' ? pushGameMessage({
    id:`locker-room-${event.id}-s${game.seasonNumber || 1}-t${turn}`,
    type:'vestuario',
    priority:injuries.length ? 'high' : 'normal',
    title:formatEventTemplate(event.titulo || event.nombre || 'Problema de vestuario', {}, runtime),
    body:`${formatEventTemplate(event.cuerpo || '', {}, runtime)}${injuryText}`.trim()
  }) : null;
  const logEntry = {
    occurrenceId:`locker-room-${event.id}-s${game.seasonNumber || 1}-t${turn}`,
    eventId:event.id,
    name:event.nombre || event.id,
    season:game.seasonNumber || 1,
    turn,
    matchdayIndex:game.matchdayIndex || 0,
    date:game.currentDate || '',
    matchId:null,
    createdAt:Date.now(),
    details:{
      type:'locker_room',
      participantIds:participants.map(player => Number(player.id)),
      injuries:injuries.map(injury => ({ playerId:injury.playerId, injuryLabel:injury.injuryLabel, days:injury.matchesOut })),
      cohesionChange,
      moraleAfter:squadMoraleAverage(game.selectedClubId),
      cohesionAfter:cohesionValue(game.selectedClubId),
      messageId:message?.id || null
    }
  };
  ensureEventLog().push(logEntry);
  game.lastLockerRoomEvent = { id:event.id, name:event.nombre || event.id, turn, date:game.currentDate || '', participantIds:logEntry.details.participantIds };
  if(state){
    state.events += 1;
    state.lastEventId = event.id;
    state.lastEventDate = String(game.currentDate || '');
    state.lastEventTurn = turn;
  }
  return { event, participants, injuries, message, logEntry };
}
function processLockerRoomProblemsDaily(options={}){
  if(!game || game.gameOver?.active || !Number(game.selectedClubId || 0)) return { active:false, checked:false, triggered:false };
  const definitions = lockerRoomProblemDefinitions();
  if(!definitions.length) return { active:false, checked:false, triggered:false };
  const settings = lockerRoomCrisisSettings();
  const state = ensureLockerRoomCrisisState();
  const clubId = Number(game.selectedClubId || 0);
  const season = Math.max(1, Math.round(Number(game.seasonNumber || 1)));
  const turn = typeof currentTurnIndex === 'function' ? currentTurnIndex() : Math.max(0, Number(game.globalTurn || 0));
  if(Number(state.clubId) !== clubId || Number(state.season) !== season){
    Object.assign(state, { clubId, season, active:false, startedTurn:0, nextCheckTurn:0, lastCheckTurn:0, checks:0, events:0, recentEventIds:[], lastEventId:'', lastEventDate:'', lastEventTurn:0 });
  }
  const morale = squadMoraleAverage(clubId);
  const cohesion = cohesionValue(clubId);
  const canStart = morale < settings.moraleThreshold && cohesion < settings.cohesionThreshold;
  const recovered = morale >= settings.moraleThreshold && cohesion >= settings.cohesionThreshold;
  if(state.active && recovered){
    state.active = false;
    state.startedTurn = 0;
    state.nextCheckTurn = 0;
    state.lastCheckTurn = turn;
    return { active:false, recovered:true, checked:false, triggered:false, morale, cohesion };
  }
  if(!state.active){
    if(!canStart) return { active:false, checked:false, triggered:false, morale, cohesion };
    state.active = true;
    state.startedTurn = turn;
    state.nextCheckTurn = turn + settings.intervalDays;
    state.lastCheckTurn = turn;
    return { active:true, started:true, checked:false, triggered:false, morale, cohesion, nextCheckTurn:state.nextCheckTurn };
  }
  if(turn < Number(state.nextCheckTurn || 0)) return { active:true, checked:false, triggered:false, morale, cohesion, nextCheckTurn:state.nextCheckTurn };
  state.checks += 1;
  state.lastCheckTurn = turn;
  state.nextCheckTurn = turn + settings.intervalDays;
  const roll = lockerRoomHash(`locker-room-roll-${clubId}-${season}-${turn}-${state.checks}`, 1000000) / 1000000;
  if(roll >= settings.probability) return { active:true, checked:true, triggered:false, roll, morale, cohesion, nextCheckTurn:state.nextCheckTurn };
  const recent = new Set((state.recentEventIds || []).slice(-settings.recentLimit));
  const candidates = definitions.filter(event => !recent.has(String(event.id)));
  const pool = candidates.length ? candidates : definitions;
  const eventIndex = lockerRoomHash(`locker-room-event-${clubId}-${season}-${turn}-${state.events}`, pool.length);
  const event = pool[eventIndex];
  const participants = selectLockerRoomParticipants(event, `locker-room-${clubId}-${season}-${turn}-${event.id}`);
  if(!participants.length) return { active:true, checked:true, triggered:false, roll, reason:'no_players', morale, cohesion, nextCheckTurn:state.nextCheckTurn };
  const result = executeLockerRoomProblem(event, participants, state);
  state.recentEventIds = [...(state.recentEventIds || []), String(event.id)].slice(-Math.max(settings.recentLimit, 1));
  return { active:true, checked:true, triggered:Boolean(result), roll, morale, cohesion, nextCheckTurn:state.nextCheckTurn, result };
}

