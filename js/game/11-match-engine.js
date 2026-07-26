/* Puente del simulador 2.0 y helpers compartidos de partido. */

function simulateMatch(match){
  if(window.Simulator20?.simulateMatch) return window.Simulator20.simulateMatch(match);
  throw new Error('Simulador 2.0 no disponible');
}
function pitchEffect(pitch){
  return PITCH_CONDITIONS[pitch] || PITCH_CONDITIONS.Normal;
}

/*
  El cálculo principal del partido vive en simulador-2.0.js.
  Este archivo conserva sólo los helpers globales que ese motor usa fuera de su IIFE:
  cambios, aplicación de resultados, estadísticas, sanciones, lesiones y limpieza de táctica.
*/
function makeSubstitutions(clubId, tactic){
  if(clubId !== game.selectedClubId || !tactic?.autoSubs?.length) return [];
  const events = [];
  const onPitch = new Set((tactic.starters || []).map(Number));
  const alreadyIn = new Set();
  for(const rule of tactic.autoSubs){
    const outId = Number(rule.outId || 0);
    const inId = Number(rule.inId || 0);
    if(!outId || !inId || !onPitch.has(outId) || alreadyIn.has(inId) || !canEnterMatch(inId)) continue;
    const minute = Math.random() < 0.10 ? 45 : Math.floor(rnd(60,91));
    const outPlayer = playerById(outId);
    let execute = false;
    if(rule.trigger === 'injuryOnly') execute = false;
    if(rule.trigger === 'tired') execute = currentCondition(outId) < 68 || effectiveSkill(outPlayer,'resistencia') < 72 || minute >= 75 || Math.random() < 0.35;
    if(rule.trigger === 'best'){
      const inPlayer = playerById(inId);
      const outValue = outPlayer ? effectiveOverall(outPlayer) * conditionFactor(outId) : 0;
      const inValue = inPlayer ? benchOverallValue(inPlayer) * conditionFactor(inId) : 0;
      execute = inValue >= outValue * 0.96 || currentCondition(outId) < 72 || minute >= 75;
    }
    if(execute){
      onPitch.delete(outId);
      onPitch.add(inId);
      alreadyIn.add(inId);
      events.push({ clubId, outId, inId, minute, trigger:rule.trigger, injuredSubPenalty:canUseInjuredAsSub(inId) });
    }
  }
  return events.slice(0,5);
}
function makeInjurySubstitutions(clubId, tactic, injuries, existingSubs=[]){
  const ownInjuries = (injuries || []).filter(i => i.clubId === clubId && i.phase !== 'final');
  if(!ownInjuries.length) return [];
  const starterIds = (tactic?.starters?.length ? tactic.starters : selectLineup(clubId, tactic).map(p=>p.id)).map(Number);
  const benchIds = (tactic?.bench?.length ? tactic.bench : autoSelectBench(clubId, starterIds).map(p=>p.id)).map(Number);
  const usedIn = new Set(existingSubs.filter(s=>s.clubId===clubId).map(s=>Number(s.inId)));
  const alreadyOut = new Set(existingSubs.filter(s=>s.clubId===clubId).map(s=>Number(s.outId)));
  const events = [];
  for(const injury of ownInjuries){
    const outId = Number(injury.playerId);
    if(alreadyOut.has(outId)) continue;
    const outPlayer = playerById(outId);
    const candidate = benchIds
      .map(id => playerById(id))
      .filter(p => p && !usedIn.has(p.id) && canEnterMatch(p.id))
      .sort((a,b)=> (benchOverallValue(b) + (outPlayer && playerGroup(b.position)===playerGroup(outPlayer.position) ? 20 : 0)) - (benchOverallValue(a) + (outPlayer && playerGroup(a.position)===playerGroup(outPlayer.position) ? 20 : 0)))[0];
    if(candidate){
      usedIn.add(candidate.id);
      alreadyOut.add(outId);
      events.push({ clubId, outId, inId:candidate.id, minute:injury.minute, trigger:'injury', injuredSubPenalty:canUseInjuredAsSub(candidate.id) });
    }
    if(existingSubs.filter(s=>s.clubId===clubId).length + events.length >= 5) break;
  }
  return events;
}
function applyResultToTables(match, hg, ag){
  if(match?.playoff || match?.knockout || match?.clubWorldCup) return;
  const h = game.standings[match.homeId];
  const a = game.standings[match.awayId];
  h.pj++; a.pj++;
  h.gf += hg; h.gc += ag; a.gf += ag; a.gc += hg;
  if(hg > ag){ h.pg++; a.pp++; h.pts += 3; }
  else if(hg < ag){ a.pg++; h.pp++; a.pts += 3; }
  else { h.pe++; a.pe++; h.pts++; a.pts++; }
  h.dg = h.gf - h.gc; a.dg = a.gf - a.gc;
}
function officialPlayerStatsRecord(container, playerId, clubId){
  const id = Math.max(0, Math.round(Number(playerId || 0)));
  if(!container || !id) return null;
  const player = playerById(id) || { id, clubId };
  if(!container[id]) container[id] = typeof createEmptyPlayerStat === 'function'
    ? createEmptyPlayerStat(player)
    : { playerId:id, clubId:Number(player.clubId || clubId || 0), played:0, starts:0, minutes:0, goals:0, assists:0, yellow:0, red:0, injuries:0, keySaves:0, goalsConceded:0, cleanSheets:0, errors:0, goalErrors:0, ratingTotal:0, ratedMatches:0, lastRating:0 };
  if(typeof normalizePlayerStatRecord === 'function') normalizePlayerStatRecord(container[id], player);
  container[id].clubId = Math.max(0, Math.round(Number(player.clubId ?? clubId ?? container[id].clubId ?? 0)));
  return container[id];
}
function officialPlayerParticipation(playerId, clubId, lineup=[], substitutions=[], cards=[], injuries=[]){
  const id = Number(playerId || 0);
  const starters = new Set((lineup || []).map(player => Number(player?.id || 0)).filter(Boolean));
  const ownSubs = (substitutions || []).filter(sub => Number(sub?.clubId || 0) === Number(clubId));
  const starter = starters.has(id);
  const entry = starter
    ? 0
    : Math.min(90, ...ownSubs.filter(sub => Number(sub?.inId || 0) === id).map(sub => Math.max(0, Number(sub?.minute || 0))), 90);
  if(!starter && entry >= 90 && !ownSubs.some(sub => Number(sub?.inId || 0) === id)) return null;
  const exits = [90];
  ownSubs.filter(sub => Number(sub?.outId || 0) === id).forEach(sub => exits.push(Math.max(entry, Math.min(90, Number(sub?.minute || 90)))));
  (cards || []).filter(card => Number(card?.clubId || 0) === Number(clubId) && Number(card?.playerId || 0) === id && ['red','secondYellowRed'].includes(String(card?.type || ''))).forEach(card => exits.push(Math.max(entry, Math.min(90, Number(card?.minute || 90)))));
  (injuries || []).filter(injury => Number(injury?.clubId || 0) === Number(clubId) && Number(injury?.playerId || 0) === id).forEach(injury => exits.push(Math.max(entry, Math.min(90, Number(injury?.minute || 90)))));
  const exit = Math.max(entry, Math.min(...exits));
  return { starter, entry, exit, minutes:Math.max(0, Math.round(exit - entry)) };
}
function officialPlayerMatchRating(matchResult, clubId, playerId){
  if(!matchResult) return null;
  const id = Number(playerId || 0);
  const list = Array.isArray(matchResult.playerRatings) ? matchResult.playerRatings : [];
  const stored = Number(list.find(item => Number(item?.playerId || item?.id || 0) === id)?.rating);
  if(Number.isFinite(stored)) return clamp(stored, 3, 10);
  if(typeof managerPlayerStatsEventSummary === 'function' && typeof managerPlayerFallbackRating === 'function'){
    const events = managerPlayerStatsEventSummary(matchResult, id);
    return clamp(Number(managerPlayerFallbackRating(matchResult, clubId, id, events) || 0), 3, 10);
  }
  return null;
}
function applyPlayerStats(clubId, lineup, substitutions, goals, cards, injuries, keySaves=[], errors=[], matchResult=null){
  game.playerStats = game.playerStats || {};
  game.playerCareerStats = game.playerCareerStats && typeof game.playerCareerStats === 'object' && !Array.isArray(game.playerCareerStats) ? game.playerCareerStats : {};
  const playedIds = new Set((lineup || []).map(player => Number(player?.id || 0)).filter(Boolean));
  (substitutions || []).filter(sub => Number(sub?.clubId || 0) === Number(clubId)).forEach(sub => {
    const inId = Number(sub?.inId || 0);
    if(inId) playedIds.add(inId);
  });
  playedIds.forEach(id => {
    const participation = officialPlayerParticipation(id, clubId, lineup, substitutions, cards, injuries);
    if(!participation) return;
    const player = playerById(id);
    const eventSummary = typeof managerPlayerStatsEventSummary === 'function' && matchResult
      ? managerPlayerStatsEventSummary(matchResult, id)
      : {
          goals:(goals || []).filter(goal => Number(goal?.clubId || 0) === Number(clubId) && Number(goal?.playerId || goal?.scorerId || 0) === id).length,
          assists:(goals || []).filter(goal => Number(goal?.clubId || 0) === Number(clubId) && Number(goal?.assistId || 0) === id).length,
          injuries:(injuries || []).filter(injury => Number(injury?.clubId || 0) === Number(clubId) && Number(injury?.playerId || 0) === id).length,
          yellow:(cards || []).filter(card => Number(card?.clubId || 0) === Number(clubId) && Number(card?.playerId || 0) === id && ['yellow','secondYellowRed'].includes(String(card?.type || ''))).length,
          red:(cards || []).filter(card => Number(card?.clubId || 0) === Number(clubId) && Number(card?.playerId || 0) === id && ['red','secondYellowRed'].includes(String(card?.type || ''))).length,
          saves:(keySaves || []).filter(save => Number(save?.clubId || 0) === Number(clubId) && Number(save?.playerId || save?.goalkeeperId || 0) === id).length,
          errors:(errors || []).filter(error => Number(error?.clubId || 0) === Number(clubId) && Number(error?.playerId || 0) === id).length,
          goalErrors:(errors || []).filter(error => Number(error?.clubId || 0) === Number(clubId) && Number(error?.playerId || 0) === id && Boolean(error?.goal)).length
        };
    const isKeeper = String(player?.position || '').toUpperCase() === 'POR';
    const rivalGoals = isKeeper
      ? (goals || []).filter(goal => Number(goal?.clubId || 0) !== Number(clubId) && Number(goal?.minute || 90) >= participation.entry && Number(goal?.minute || 90) <= participation.exit).length
      : 0;
    const rating = officialPlayerMatchRating(matchResult, clubId, id);
    [officialPlayerStatsRecord(game.playerStats, id, clubId), officialPlayerStatsRecord(game.playerCareerStats, id, clubId)].filter(Boolean).forEach(stat => {
      stat.played += 1;
      if(participation.starter) stat.starts += 1;
      stat.minutes += participation.minutes;
      stat.goals += Number(eventSummary.goals || 0);
      stat.assists += Number(eventSummary.assists || 0);
      stat.yellow += Number(eventSummary.yellow || 0);
      stat.red += Number(eventSummary.red || 0);
      stat.injuries += Number(eventSummary.injuries || 0);
      stat.keySaves += Number(eventSummary.saves || 0);
      stat.errors += Number(eventSummary.errors || 0);
      stat.goalErrors += Number(eventSummary.goalErrors || 0);
      if(isKeeper){
        stat.goalsConceded += rivalGoals;
        if(rivalGoals === 0 && participation.minutes >= 60) stat.cleanSheets += 1;
      }
      if(Number.isFinite(rating)){
        stat.ratingTotal = Math.round((Number(stat.ratingTotal || 0) + rating) * 1000) / 1000;
        stat.ratedMatches = Number(stat.ratedMatches || 0) + 1;
        stat.lastRating = Math.round(rating * 10) / 10;
      }
    });
  });
  if(typeof recordManagerPlayerMatchStatistics === 'function' && matchResult){
    recordManagerPlayerMatchStatistics(clubId, [...playedIds], matchResult);
  }
}
function applyAvailability(cards, injuries){
  cards.forEach(c => {
    if(c.type === 'red' || c.type === 'secondYellowRed'){
      game.playerStatus[c.playerId] = { ...playerStatus(c.playerId), suspendedThrough: game.matchdayIndex + 1 };
    }
  });
  injuries.forEach(i => {
    const label = i.injuryLabel || i.name || 'Lesión';
    const injuryDays = Math.max(1, Math.round(Number(i.matchesOut || 1)));
    game.playerStatus[i.playerId] = {
      ...playerStatus(i.playerId),
      injuredThrough: game.matchdayIndex + Math.max(1, Math.ceil(injuryDays / Math.max(1, LEAGUE_ROUND_INTERVAL_DAYS))),
      injuredUntilTurn: currentTurnIndex() + injuryDays,
      injuryLabel: label,
      injuryChance: i.chance,
      highLoadInjury: Boolean(i.highLoad),
      highLoadRatio: i.highLoadRatio,
      highLoadPlayed: i.highLoadPlayed,
      highLoadReference: i.highLoadReference,
      injuredAtMatchday: game.matchdayIndex,
      injuredAtTurn: currentTurnIndex()
    };
  });
}
function collectOwnProblems(result){
  if(!result) return [];
  const ownClub = game.selectedClubId;
  const injuries = (result.injuries || []).filter(i => i.clubId === ownClub).map(i => ({ type:'injury', playerId:i.playerId }));
  const reds = (result.cards || []).filter(c => c.clubId === ownClub && (c.type === 'red' || c.type === 'secondYellowRed')).map(c => ({ type:'red', playerId:c.playerId }));
  return [...injuries, ...reds];
}
function removeOwnUnavailableFromTactic(problems=[]){
  if(!game?.tactic || !problems.length) return;
  const ids = new Set(problems.map(p => Number(p.playerId)).filter(Boolean));
  if(!ids.size) return;
  const starters = (game.tactic.starters || []).slice(0,11);
  while(starters.length < 11) starters.push(0);
  let changed = false;
  for(let i=0;i<starters.length;i++){
    if(ids.has(Number(starters[i]))){ starters[i] = 0; changed = true; }
  }
  const bench = (game.tactic.bench || []).filter(id => !ids.has(Number(id)));
  const autoSubs = (game.tactic.autoSubs || []).map(rule => ({
    ...rule,
    outId: ids.has(Number(rule.outId)) ? 0 : Number(rule.outId || 0),
    inId: ids.has(Number(rule.inId)) ? 0 : Number(rule.inId || 0)
  }));
  if(changed || bench.length !== (game.tactic.bench || []).length){
    const captainId = ids.has(Number(game.tactic.captainId || 0)) ? 0 : Number(game.tactic.captainId || 0);
    game.tactic = ensureTacticCaptain(applyStarterMentalities({ ...game.tactic, captainId, starters, bench, autoSubs }), game.selectedClubId);
  }
}
