/* V8.84 · Auditoría integral del calendario.
   Reconstruye partidos de liga faltantes, reconcilia resultados con el historial,
   elimina duplicados y reprograma encuentros atrasados en martes sin cruces de club. */

(function(){
  const CALENDAR_INTEGRITY_VERSION = 3;
  const MAX_LOG_ENTRIES = 30;
  const MAX_SEARCH_WEEKS = 120;

  function ciState(target=game){ return target && typeof target === 'object' ? target : null; }
  function ciNumber(value, fallback=0){ const n=Number(value); return Number.isFinite(n) ? n : fallback; }
  function ciClone(value){
    if(value == null) return value;
    if(typeof structuredClone === 'function'){
      try{ return structuredClone(value); }catch(_error){}
    }
    try{ return JSON.parse(JSON.stringify(value)); }catch(_error){ return value; }
  }
  function ciValidDate(value){ return typeof validIsoDate === 'function' ? validIsoDate(value) : /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')); }
  function ciUtc(iso){
    if(!ciValidDate(iso)) return null;
    const [year,month,day]=String(iso).slice(0,10).split('-').map(Number);
    return new Date(Date.UTC(year, month-1, day));
  }
  function ciIso(date){ return date instanceof Date && Number.isFinite(date.getTime()) ? date.toISOString().slice(0,10) : ''; }
  function ciAddDays(iso, days){
    if(typeof addDaysToIsoDate === 'function') return addDaysToIsoDate(iso, days);
    const date=ciUtc(iso);
    if(!date) return '';
    date.setUTCDate(date.getUTCDate()+Math.round(ciNumber(days,0)));
    return ciIso(date);
  }
  function ciCompareDates(left,right){
    const a=ciUtc(left), b=ciUtc(right);
    if(!a || !b) return 0;
    return a.getTime()-b.getTime();
  }
  function ciBefore(left,right){ return ciCompareDates(left,right)<0; }
  function ciNextTuesday(fromIso, includeToday=true){
    const date=ciUtc(fromIso);
    if(!date) return '';
    let add=(2-date.getUTCDay()+7)%7;
    if(add===0 && !includeToday) add=7;
    date.setUTCDate(date.getUTCDate()+add);
    return ciIso(date);
  }
  function ciMatchDate(match, round){
    if(ciValidDate(match?.date)) return String(match.date).slice(0,10);
    if(ciValidDate(match?.roundDate)) return String(match.roundDate).slice(0,10);
    if(ciValidDate(round?.date)) return String(round.date).slice(0,10);
    if(ciValidDate(round?.startDate)) return String(round.startDate).slice(0,10);
    return '';
  }
  function ciIsSpecialRound(round){
    if(typeof fixtureRoundIsPersistentCompetition === 'function') return fixtureRoundIsPersistentCompetition(round);
    return Boolean(
      round?.playoffRound || round?.clubWorldCupRound || round?.nationalCupRound ||
      (round?.matches || []).some(match => match?.playoff || match?.clubWorldCup || match?.nationalCup || match?.friendly)
    );
  }
  function ciIsRegularMatch(match, round){
    return Boolean(match && !match.friendly && !match.playoff && !match.clubWorldCup && !match.nationalCup && !ciIsSpecialRound(round));
  }
  function ciPairKey(match){
    if(!match) return '';
    return `${String(match.divisionId || '')}|${ciNumber(match.homeId)}|${ciNumber(match.awayId)}`;
  }
  function ciMatchKey(match){ return String(match?.id || '').trim() || ciPairKey(match); }
  function ciLeagueRoundNumber(match){
    const id=String(match?.id || '');
    const found=id.match(/-j(\d+)-/i);
    return found ? Math.max(0, Math.round(Number(found[1] || 0))) : 0;
  }
  function ciHistoryMaps(state){
    const byId=new Map();
    const byPair=new Map();
    (Array.isArray(state?.matchHistory) ? state.matchHistory : []).forEach(record => {
      if(!record?.played) return;
      const id=String(record.id || '').trim();
      const pair=ciPairKey(record);
      if(id && !byId.has(id)) byId.set(id, record);
      if(pair && !byPair.has(pair)) byPair.set(pair, record);
    });
    return { byId, byPair };
  }
  function ciPlayedEvidence(match, historyMaps){
    const id=String(match?.id || '').trim();
    return (id && historyMaps.byId.get(id)) || historyMaps.byPair.get(ciPairKey(match)) || null;
  }
  function ciRestorePlayedFixture(match, history){
    if(!match || !history?.played) return false;
    const keep={
      id:match.id,
      matchday:match.matchday,
      divisionId:match.divisionId,
      divisionName:match.divisionName,
      homeId:match.homeId,
      awayId:match.awayId,
      date:match.date || history.date,
      roundDate:match.roundDate || history.roundDate
    };
    Object.assign(match, ciClone(history), keep, {
      played:true,
      calendarIntegrityRestored:true,
      calendarIntegrityRestoredFrom:'matchHistory'
    });
    return true;
  }
  function ciFixtureRegistry(state){
    const byId=new Map();
    const byPair=new Map();
    const locations=[];
    (state.fixtures || []).forEach((round, roundIndex) => {
      (round?.matches || []).forEach((match, matchIndex) => {
        const location={ round, roundIndex, match, matchIndex };
        locations.push(location);
        const id=String(match?.id || '').trim();
        const pair=ciPairKey(match);
        if(id){
          if(!byId.has(id)) byId.set(id, []);
          byId.get(id).push(location);
        }
        if(pair){
          if(!byPair.has(pair)) byPair.set(pair, []);
          byPair.get(pair).push(location);
        }
      });
    });
    return { byId, byPair, locations };
  }
  function ciMatchQuality(match){
    let score=0;
    if(match?.played) score+=1000;
    if(Number.isFinite(Number(match?.homeGoals)) && Number.isFinite(Number(match?.awayGoals))) score+=200;
    if(Array.isArray(match?.goals) && match.goals.length) score+=50;
    if(match?.matchStats) score+=30;
    if(ciValidDate(match?.date)) score+=10;
    if(match?.calendarIntegrityRestored) score-=1;
    return score;
  }
  function ciRemoveDuplicateFixtures(state, historyMaps){
    const registry=ciFixtureRegistry(state);
    const removals=new Map();
    let duplicatesRemoved=0;
    let historyRestored=0;
    registry.byId.forEach((locations,id) => {
      if(locations.length<2) return;
      locations.sort((a,b)=>ciMatchQuality(b.match)-ciMatchQuality(a.match) || a.roundIndex-b.roundIndex || a.matchIndex-b.matchIndex);
      const keeper=locations[0];
      const evidence=historyMaps.byId.get(id);
      if(!keeper.match.played && evidence?.played && ciRestorePlayedFixture(keeper.match,evidence)) historyRestored+=1;
      locations.slice(1).forEach(location => {
        if(!removals.has(location.round)) removals.set(location.round,new Set());
        removals.get(location.round).add(location.match);
        duplicatesRemoved+=1;
      });
    });
    removals.forEach((matches,round) => { round.matches=(round.matches || []).filter(match => !matches.has(match)); });
    state.fixtures=state.fixtures.filter(round => (round?.matches || []).length || !round?.calendarRecoveryRound);
    return { duplicatesRemoved, historyRestored };
  }
  function ciCanonicalRegular(state){
    if(state?.challenge?.active && state.challenge.completed !== true) return [];
    if(typeof generateFixturesForDivisions !== 'function' || !seed?.clubs?.length) return [];
    const year=Math.round(ciNumber(state?.seasonYear,0)) || (typeof seasonYearForNumber === 'function' ? seasonYearForNumber(state?.seasonNumber || 1) : new Date().getUTCFullYear());
    const divisions=typeof divisionOrderList === 'function' ? divisionOrderList() : (seed?.divisions || []);
    try{ return generateFixturesForDivisions(seed.clubs, divisions, { seasonYear:year }) || []; }
    catch(error){ console.error('V8.84: no se pudo generar calendario canónico', error); return []; }
  }
  function ciCanonicalMaps(rounds){
    const byId=new Map();
    const byPair=new Map();
    (rounds || []).forEach((round,roundIndex) => (round.matches || []).forEach(match => {
      const item={ round, roundIndex, match, expectedDate:ciMatchDate(match,round) };
      if(match.id) byId.set(String(match.id),item);
      byPair.set(ciPairKey(match),item);
    }));
    return { byId, byPair };
  }
  function ciExistingRegularMaps(state){
    const byId=new Map();
    const byPair=new Map();
    (state.fixtures || []).forEach(round => (round.matches || []).forEach(match => {
      if(!ciIsRegularMatch(match,round)) return;
      if(match.id && !byId.has(String(match.id))) byId.set(String(match.id),{match,round});
      const pair=ciPairKey(match);
      if(pair && !byPair.has(pair)) byPair.set(pair,{match,round});
    }));
    return {byId,byPair};
  }
  function ciFindOrCreateRound(state,date,options={}){
    const id=String(options.id || `calendar-recovery-${state.seasonNumber || 1}-${date}`);
    let round=(state.fixtures || []).find(item => String(item?.id || '')===id);
    if(round) return round;
    round={
      id,
      matchday:(state.fixtures || []).length+1,
      date,
      startDate:date,
      endDate:date,
      roundDate:date,
      title:String(options.title || 'Partidos recuperados'),
      calendarRecoveryRound:true,
      calendarIntegrityVersion:CALENDAR_INTEGRITY_VERSION,
      nationalCupRound:Boolean(options.nationalCupRound),
      nationalCupId:options.nationalCupId || undefined,
      nationalCupStage:options.nationalCupStage || undefined,
      nationalSupercup:Boolean(options.nationalSupercup),
      matches:[]
    };
    state.fixtures.push(round);
    return round;
  }
  function ciRestoreMissingRegularMatches(state,canonicalRounds,historyMaps,referenceDate){
    const existing=ciExistingRegularMaps(state);
    const canonical=ciCanonicalMaps(canonicalRounds);
    const restored=[];
    let restoredPlayed=0;
    canonical.byId.forEach((item,id) => {
      const present=existing.byId.get(id) || existing.byPair.get(ciPairKey(item.match));
      if(present){
        if(!present.match.played){
          const evidence=historyMaps.byId.get(id) || historyMaps.byPair.get(ciPairKey(item.match));
          if(evidence?.played && ciRestorePlayedFixture(present.match,evidence)) restoredPlayed+=1;
        }
        if(!ciValidDate(present.match.date)) present.match.date=item.expectedDate;
        if(!ciValidDate(present.match.roundDate)) present.match.roundDate=item.expectedDate;
        present.match.calendarIntegrityCanonicalId=id;
        return;
      }
      const evidence=historyMaps.byId.get(id) || historyMaps.byPair.get(ciPairKey(item.match));
      const match=ciClone(item.match);
      match.calendarIntegrityRestored=true;
      match.calendarIntegrityCanonicalId=id;
      match.calendarIntegrityExpectedDate=item.expectedDate;
      if(evidence?.played){
        ciRestorePlayedFixture(match,evidence);
        restoredPlayed+=1;
      }
      const targetDate=match.played ? (ciValidDate(evidence?.date) ? evidence.date : item.expectedDate) : item.expectedDate;
      match.date=targetDate;
      match.roundDate=item.expectedDate;
      const round=ciFindOrCreateRound(state,targetDate,{
        id:`calendar-restored-regular-s${state.seasonNumber || 1}-${targetDate}`,
        title:'Liga · partidos restaurados'
      });
      round.matches.push(match);
      restored.push({match,round,expectedDate:item.expectedDate,missing:true});
      existing.byId.set(id,{match,round});
      existing.byPair.set(ciPairKey(match),{match,round});
    });
    return { restored, restoredCount:restored.length, restoredPlayed, canonicalCount:canonical.byId.size };
  }
  function ciNationalCupIdParts(id){
    const found=String(id || '').match(/-(\d+)-(\d+)-(\d+)$/);
    return found ? { index:Number(found[1]), homeId:Number(found[2]), awayId:Number(found[3]) } : null;
  }
  function ciNationalCupFixtureFromState(state,config,stage,stageState,id,options={}){
    const parts=ciNationalCupIdParts(id);
    if(!parts) return null;
    const date=ciValidDate(stageState?.date) ? stageState.date : (typeof nationalCupStageDate === 'function' ? nationalCupStageDate(config,stage.id,state.seasonYear) : '');
    let fixture=null;
    if(state===game && typeof nationalCupCreateMatch === 'function'){
      try{
        fixture=nationalCupCreateMatch(config,stage,parts.homeId,parts.awayId,parts.index,{
          date,
          supercup:Boolean(options.supercup),
          largestVenue:Boolean(options.supercup),
          ticketPrice:options.supercup ? 1000 : stage.ticketPrice,
          competitionId:options.competitionId || config.id,
          competitionName:options.competitionName || config.name
        });
      }catch(_error){ fixture=null; }
    }
    if(!fixture){
      fixture={
        id,
        divisionId:String(options.competitionId || config.id),
        divisionName:String(options.competitionName || config.name),
        homeId:parts.homeId,
        awayId:parts.awayId,
        played:false,
        date,
        roundDate:date,
        neutral:true,
        neutralVenue:true,
        knockout:true,
        requiresWinner:true,
        tieBreakMode:'penalties',
        nationalCup:true,
        nationalCupId:config.id,
        nationalCupStage:stage.id,
        nationalCupStageLabel:stage.label,
        nationalCupCountry:config.country,
        nationalSupercup:Boolean(options.supercup),
        ticketPrice:Math.max(0,Math.round(ciNumber(options.supercup ? 1000 : stage.ticketPrice,0))),
        competitionRules:{requiresWinner:true,tieBreakMode:'penalties',neutralVenue:true}
      };
    }
    fixture.id=id;
    fixture.calendarIntegrityRestored=true;
    fixture.calendarIntegrityExpectedDate=date;
    return fixture;
  }
  function ciRestoreNationalCupStateMatches(state,historyMaps){
    if(!state?.nationalCups || typeof NATIONAL_CUP_CONFIGS === 'undefined') return { restored:[], restoredPlayed:0 };
    const registry=ciFixtureRegistry(state);
    const restored=[];
    let restoredPlayed=0;
    const addFixture=(fixture,roundOptions,history) => {
      if(!fixture) return;
      if(history?.played){ ciRestorePlayedFixture(fixture,history); restoredPlayed+=1; }
      const round=ciFindOrCreateRound(state,fixture.date,roundOptions);
      if(!(round.matches || []).some(match => String(match.id)===String(fixture.id))) round.matches.push(fixture);
      restored.push({match:fixture,round,expectedDate:fixture.calendarIntegrityExpectedDate,missing:true});
      registry.byId.set(String(fixture.id),[{match:fixture,round}]);
    };
    (NATIONAL_CUP_CONFIGS || []).forEach(config => {
      const edition=state.nationalCups?.editions?.[config.id];
      if(!edition?.drawn || ['skipped'].includes(String(edition.status || ''))) return;
      (config.stages || []).forEach(stage => {
        const stageState=edition.stages?.[stage.id];
        if(!stageState || !['scheduled','completed'].includes(String(stageState.status || ''))) return;
        (stageState.matchIds || []).forEach(id => {
          if(registry.byId.has(String(id))) return;
          const history=historyMaps.byId.get(String(id));
          const fixture=ciNationalCupFixtureFromState(state,config,stage,stageState,id);
          addFixture(fixture,{
            id:stageState.roundId || `national-cup-${state.seasonNumber}-${config.id}-${stage.id}`,
            title:`${config.name} · ${stage.label}`,
            nationalCupRound:true,
            nationalCupId:config.id,
            nationalCupStage:stage.id
          },history);
        });
      });
    });
    if(typeof NATIONAL_CUP_COUNTRIES !== 'undefined'){
      (NATIONAL_CUP_COUNTRIES || []).forEach(country => {
        const key=typeof nationalCupCountryKey === 'function' ? nationalCupCountryKey(country) : String(country).toLowerCase();
        const supercup=state.nationalCups?.supercups?.[key];
        if(!supercup || !['scheduled','completed'].includes(String(supercup.status || '')) || !supercup.matchId) return;
        if(registry.byId.has(String(supercup.matchId))) return;
        const config=typeof nationalCupConfigForCountry === 'function' ? nationalCupConfigForCountry(country) : (NATIONAL_CUP_CONFIGS || []).find(item=>item.country===country);
        if(!config) return;
        const stage={id:'supercup',label:'Final',ticketPrice:1000};
        const stageState={date:supercup.date};
        const history=historyMaps.byId.get(String(supercup.matchId));
        const fixture=ciNationalCupFixtureFromState(state,config,stage,stageState,supercup.matchId,{
          supercup:true,
          competitionId:supercup.id,
          competitionName:supercup.name
        });
        addFixture(fixture,{
          id:`national-supercup-${state.seasonNumber}-${key}`,
          title:supercup.name,
          nationalCupRound:true,
          nationalCupId:config.id,
          nationalCupStage:'supercup',
          nationalSupercup:true
        },history);
      });
    }
    return { restored, restoredPlayed };
  }
  function ciReconcileAllPlayedFlags(state,historyMaps){
    let restored=0;
    (state.fixtures || []).forEach(round => (round.matches || []).forEach(match => {
      if(match?.played) return;
      const evidence=ciPlayedEvidence(match,historyMaps);
      if(evidence?.played && ciRestorePlayedFixture(match,evidence)) restored+=1;
    }));
    return restored;
  }
  function ciPlayedFrontier(state,historyMaps){
    const maxByDivision=new Map();
    const visit=match => {
      if(!match?.played || match?.nationalCup || match?.clubWorldCup || match?.playoff || match?.friendly) return;
      const round=ciLeagueRoundNumber(match);
      const division=String(match.divisionId || '');
      if(round>0) maxByDivision.set(division,Math.max(round,maxByDivision.get(division)||0));
    };
    (state.fixtures || []).forEach(round => (round.matches || []).forEach(visit));
    historyMaps.byId.forEach(visit);
    return maxByDivision;
  }
  function ciCollectRecoveryCandidates(state,canonicalMaps,historyMaps,referenceDate,restoredItems=[]){
    const frontier=ciPlayedFrontier(state,historyMaps);
    const candidates=[];
    const seen=new Set();
    const add=(match,round,reason,expectedDate='') => {
      if(!match || match.played) return;
      const key=ciMatchKey(match);
      if(seen.has(key)) return;
      seen.add(key);
      candidates.push({match,round,reason,expectedDate:expectedDate || ciMatchDate(match,round)});
    };
    (state.fixtures || []).forEach(round => (round.matches || []).forEach(match => {
      if(match?.played || match?.friendly) return;
      const scheduled=ciMatchDate(match,round);
      const canonical=canonicalMaps.byId.get(String(match.id || '')) || canonicalMaps.byPair.get(ciPairKey(match));
      const expected=canonical?.expectedDate || match?.calendarIntegrityExpectedDate || scheduled;
      const leagueRound=ciLeagueRoundNumber(match);
      const frontierRound=frontier.get(String(match.divisionId || '')) || 0;
      if(!ciValidDate(scheduled)) add(match,round,'fecha_invalida',expected);
      else if(ciBefore(scheduled,referenceDate)) add(match,round,'fecha_vencida',expected);
      else if(leagueRound>0 && frontierRound>leagueRound && !match.recoveredSchedule) add(match,round,'fecha_salteada',expected);
    }));
    (restoredItems || []).forEach(item => {
      if(!item?.match?.played && ciValidDate(item.expectedDate) && ciBefore(item.expectedDate,referenceDate)) add(item.match,item.round,'fixture_faltante',item.expectedDate);
    });
    candidates.sort((a,b)=>ciCompareDates(a.expectedDate || '9999-12-31',b.expectedDate || '9999-12-31') || String(ciMatchKey(a.match)).localeCompare(String(ciMatchKey(b.match))));
    return candidates;
  }
  function ciOccupiedDates(state,candidateSet){
    const occupied=new Map();
    (state.fixtures || []).forEach(round => (round.matches || []).forEach(match => {
      if(match?.played || candidateSet.has(match)) return;
      const date=ciMatchDate(match,round);
      if(!ciValidDate(date)) return;
      [ciNumber(match.homeId),ciNumber(match.awayId)].filter(Boolean).forEach(clubId => {
        if(!occupied.has(clubId)) occupied.set(clubId,new Set());
        occupied.get(clubId).add(date);
      });
    }));
    return occupied;
  }
  function ciScheduleCandidatesOnTuesdays(state,candidates,referenceDate){
    if(!candidates.length) return { rescheduled:0, dates:[] };
    const set=new Set(candidates.map(item=>item.match));
    const occupied=ciOccupiedDates(state,set);
    const dates=[];
    let rescheduled=0;
    candidates.forEach(item => {
      const clubs=[ciNumber(item.match.homeId),ciNumber(item.match.awayId)].filter(Boolean);
      let slot=ciNextTuesday(referenceDate,true);
      let guard=0;
      while(guard<MAX_SEARCH_WEEKS && clubs.some(clubId => occupied.get(clubId)?.has(slot))){
        slot=ciAddDays(slot,7);
        guard+=1;
      }
      if(!ciValidDate(slot)) return;
      const oldDate=ciMatchDate(item.match,item.round);
      if(!item.match.originalScheduledDate && ciValidDate(oldDate)) item.match.originalScheduledDate=oldDate;
      if(!item.match.calendarIntegrityExpectedDate && ciValidDate(item.expectedDate)) item.match.calendarIntegrityExpectedDate=item.expectedDate;
      item.match.date=slot;
      item.match.roundDate=slot;
      item.match.recoveredSchedule=true;
      item.match.recoveredScheduleReason=`calendar_integrity_v884:${item.reason}`;
      item.match.recoveredScheduleAt=referenceDate;
      item.match.calendarIntegrityVersion=CALENDAR_INTEGRITY_VERSION;
      clubs.forEach(clubId => {
        if(!occupied.has(clubId)) occupied.set(clubId,new Set());
        occupied.get(clubId).add(slot);
      });
      dates.push(slot);
      rescheduled+=1;
    });
    return {rescheduled,dates:[...new Set(dates)].sort()};
  }
  function ciRefreshRoundDates(state){
    (state.fixtures || []).forEach(round => {
      const dates=(round.matches || []).map(match=>ciMatchDate(match,null)).filter(ciValidDate).sort();
      if(!dates.length) return;
      round.startDate=dates[0];
      round.endDate=dates[dates.length-1];
      round.date=dates[0];
      round.roundDate=dates[0];
    });
  }
  function ciSortAndRepairCursor(state,reason){
    if(state===game && typeof sortFixturesAfterNationalCupChange === 'function') sortFixturesAfterNationalCupChange();
    else{
      state.fixtures.sort((a,b)=>ciCompareDates(ciMatchDate(null,a)||'9999-12-31',ciMatchDate(null,b)||'9999-12-31') || ciNumber(a.matchday)-ciNumber(b.matchday));
      state.fixtures.forEach((round,index)=>{
        round.matchday=index+1;
        (round.matches || []).forEach(match=>{ match.matchday=index+1; });
      });
    }
    if(typeof repairFixtureCursorForState === 'function') repairFixtureCursorForState(state,{reason});
    else{
      const index=state.fixtures.findIndex(round => (round.matches || []).some(match=>!match.played));
      state.matchdayIndex=index>=0?index:state.fixtures.length;
    }
  }
  function ciAuditState(target=game,options={}){
    const state=ciState(target);
    const empty={ran:false,version:CALENDAR_INTEGRITY_VERSION,restoredMissing:0,restoredPlayed:0,duplicatesRemoved:0,rescheduled:0,dates:[],remainingPastDue:0};
    if(!state || !Array.isArray(state.fixtures)) return empty;
    const referenceDate=ciValidDate(options.referenceDate) ? options.referenceDate : (ciValidDate(state.currentDate) ? state.currentDate : '');
    if(!referenceDate) return empty;
    state.matchHistory=Array.isArray(state.matchHistory)?state.matchHistory:[];
    const historyMaps=ciHistoryMaps(state);
    const duplicate=ciRemoveDuplicateFixtures(state,historyMaps);
    const reconciled=ciReconcileAllPlayedFlags(state,historyMaps);
    const canonicalRounds=ciCanonicalRegular(state);
    const canonicalMaps=ciCanonicalMaps(canonicalRounds);
    const regularRepair=ciRestoreMissingRegularMatches(state,canonicalRounds,historyMaps,referenceDate);
    const cupRepair=ciRestoreNationalCupStateMatches(state,historyMaps);
    if(state===game && typeof ensureClubWorldCupCurrentSeason === 'function'){
      try{ ensureClubWorldCupCurrentSeason({source:'calendar_integrity_v884'}); }catch(error){ console.warn('V8.84: revisión Mundial de Clubes omitida',error); }
    }
    const restoredItems=[...(regularRepair.restored || []),...(cupRepair.restored || [])];
    const candidates=ciCollectRecoveryCandidates(state,canonicalMaps,historyMaps,referenceDate,restoredItems);
    const scheduled=ciScheduleCandidatesOnTuesdays(state,candidates,referenceDate);
    ciRefreshRoundDates(state);
    ciSortAndRepairCursor(state,options.reason || 'calendar_integrity_v884');

    // Segunda pasada: una auditoría válida no puede dejar partidos con fecha vencida.
    const remaining=[];
    (state.fixtures || []).forEach(round => (round.matches || []).forEach(match => {
      if(match?.played || match?.friendly) return;
      const date=ciMatchDate(match,round);
      if(!ciValidDate(date) || ciBefore(date,referenceDate)) remaining.push({match,round});
    }));
    if(remaining.length){
      const retry=remaining.map(item=>({match:item.match,round:item.round,reason:'segunda_pasada',expectedDate:ciMatchDate(item.match,item.round)}));
      const extra=ciScheduleCandidatesOnTuesdays(state,retry,referenceDate);
      scheduled.rescheduled+=extra.rescheduled;
      scheduled.dates=[...new Set(scheduled.dates.concat(extra.dates))].sort();
      ciRefreshRoundDates(state);
      ciSortAndRepairCursor(state,'calendar_integrity_v884_second_pass');
    }
    const remainingPastDue=(state.fixtures || []).reduce((total,round)=>total+(round.matches || []).filter(match=>!match?.played && !match?.friendly && (!ciValidDate(ciMatchDate(match,round)) || ciBefore(ciMatchDate(match,round),referenceDate))).length,0);
    const summary={
      ran:true,
      version:CALENDAR_INTEGRITY_VERSION,
      reason:String(options.reason || 'calendar_integrity_v884'),
      season:ciNumber(state.seasonNumber,1),
      referenceDate,
      canonicalLeagueMatches:regularRepair.canonicalCount,
      restoredMissing:regularRepair.restoredCount+(cupRepair.restored || []).length,
      restoredPlayed:duplicate.historyRestored+reconciled+regularRepair.restoredPlayed+cupRepair.restoredPlayed,
      duplicatesRemoved:duplicate.duplicatesRemoved,
      rescheduled:scheduled.rescheduled,
      dates:scheduled.dates,
      remainingPastDue,
      checkedAt:new Date().toISOString()
    };
    const changed=summary.restoredMissing||summary.restoredPlayed||summary.duplicatesRemoved||summary.rescheduled;
    state.calendarIntegrityState=state.calendarIntegrityState && typeof state.calendarIntegrityState==='object' ? state.calendarIntegrityState : {};
    state.calendarIntegrityState.version=CALENDAR_INTEGRITY_VERSION;
    state.calendarIntegrityState.lastCheckDate=referenceDate;
    state.calendarIntegrityState.lastSummary=summary;
    state.calendarIntegrityLog=Array.isArray(state.calendarIntegrityLog)?state.calendarIntegrityLog.slice(-(MAX_LOG_ENTRIES-1)):[];
    if(changed || options.logAlways) state.calendarIntegrityLog.push(summary);
    if(changed){ state._needsAutosave=true; state._calendarIntegrityPendingNotice=summary; }
    return summary;
  }

  function ciNotify(summary){
    if(!summary || !(summary.restoredMissing||summary.restoredPlayed||summary.duplicatesRemoved||summary.rescheduled)) return;
    const parts=[];
    if(summary.restoredMissing) parts.push(`${summary.restoredMissing} partido(s) reconstruido(s)`);
    if(summary.restoredPlayed) parts.push(`${summary.restoredPlayed} resultado(s) recuperado(s)`);
    if(summary.duplicatesRemoved) parts.push(`${summary.duplicatesRemoved} duplicado(s) eliminado(s)`);
    if(summary.rescheduled) parts.push(`${summary.rescheduled} partido(s) reubicado(s) en martes`);
    const body=`La auditoría integral del calendario corrigió ${parts.join(', ')}.${summary.dates?.length ? ` Primeras fechas de recuperación: ${summary.dates.slice(0,3).join(', ')}.` : ''}`;
    if(typeof pushGameMessage === 'function'){
      pushGameMessage({
        id:`calendar-integrity-v884-s${summary.season}-${summary.referenceDate}`,
        type:'system',priority:'high',title:'Calendario recuperado',body
      });
    }
    if(typeof showNotice === 'function') showNotice(body,false);
  }

  window.runCalendarIntegrityAudit=ciAuditState;
  window.recoverBrokenCalendarOnTuesdays=ciAuditState;

  if(typeof normalizeGame === 'function'){
    const originalNormalizeGame=normalizeGame;
    normalizeGame=function(saved){
      const normalized=originalNormalizeGame.call(this,saved);
      ciAuditState(normalized,{referenceDate:normalized.currentDate || '',reason:'save_migration_v884'});
      return normalized;
    };
  }
  if(typeof processDailyCalendarState === 'function'){
    const originalProcessDailyCalendarState=processDailyCalendarState;
    processDailyCalendarState=function(dateAfter='',options={}){
      const beforeDate=ciValidDate(dateAfter)?dateAfter:(ciValidDate(game?.currentDate)?game.currentDate:'');
      const before=ciAuditState(game,{referenceDate:beforeDate,reason:'before_daily_advance_v884'});
      const result=originalProcessDailyCalendarState.call(this,dateAfter,options)||{};
      const after=ciAuditState(game,{referenceDate:game?.currentDate || beforeDate,reason:'after_daily_advance_v884'});
      result.calendarIntegrity={before,after};
      const pending=game?._calendarIntegrityPendingNotice;
      if(pending){ ciNotify(pending); delete game._calendarIntegrityPendingNotice; }
      return result;
    };
  }
  if(typeof runScheduledSeasonGameVerifier === 'function'){
    const originalRunScheduledSeasonGameVerifier=runScheduledSeasonGameVerifier;
    runScheduledSeasonGameVerifier=function(options={}){
      const audit=ciAuditState(game,{referenceDate:game?.currentDate || '',reason:options.reason || 'scheduled_verifier_v884'});
      const result=originalRunScheduledSeasonGameVerifier.call(this,options)||{};
      result.calendarIntegrity=audit;
      result.repaired=Boolean(result.repaired||audit.restoredMissing||audit.restoredPlayed||audit.duplicatesRemoved||audit.rescheduled);
      return result;
    };
  }
  if(typeof finalizeSeasonIfNeeded === 'function'){
    const originalFinalizeSeasonIfNeeded=finalizeSeasonIfNeeded;
    finalizeSeasonIfNeeded=function(...args){
      ciAuditState(game,{referenceDate:game?.currentDate || '',reason:'before_season_finalize_v884'});
      return originalFinalizeSeasonIfNeeded.apply(this,args);
    };
  }
  if(typeof startNextSeason === 'function'){
    const originalStartNextSeason=startNextSeason;
    startNextSeason=function(...args){
      const result=originalStartNextSeason.apply(this,args);
      ciAuditState(game,{referenceDate:game?.currentDate || '',reason:'after_next_season_v884'});
      return result;
    };
  }
})();
