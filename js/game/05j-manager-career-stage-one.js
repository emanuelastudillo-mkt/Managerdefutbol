/* V8.69 · Primera etapa del sistema integral de carrera del manager.
   Historial anual, perfil acumulativo, objetivos cualitativos y evaluación final. */

(function(){
  const CAREER_PROFILE_VERSION = 1;
  const CAREER_HISTORY_VERSION = 1;
  const CAPABILITY_KEYS = ['sporting','leadership','economy','development','crisis','stability'];
  const CAPABILITY_LABELS = {
    sporting:'Rendimiento deportivo',
    leadership:'Liderazgo',
    economy:'Gestión económica',
    development:'Desarrollo de jugadores',
    crisis:'Manejo de crisis',
    stability:'Estabilidad'
  };
  let clubHistorySeasonFilter = 'latest';

  function careerSetting(key, fallback){
    return typeof configValue === 'function' ? configValue(`manager.carrera.${key}`, fallback) : fallback;
  }
  function careerPrestigeMaximum(){ return Math.max(100, careerRound(careerSetting('prestigioMaximo', 1000), 1000)); }
  function careerMomentMinimum(){ return careerRound(careerSetting('momentoMinimo', -100), -100); }
  function careerMomentMaximum(){ return careerRound(careerSetting('momentoMaximo', 100), 100); }
  function careerInitialCapability(){ return careerClamp(careerRound(careerSetting('capacidadInicial', 10), 10), 0, 100); }

  function careerClamp(value, min, max){
    const number = Number(value);
    const safe = Number.isFinite(number) ? number : 0;
    return Math.max(min, Math.min(max, safe));
  }
  function careerRound(value, fallback=0){
    const number = Number(value);
    return Number.isFinite(number) ? Math.round(number) : Math.round(Number(fallback || 0));
  }
  function careerNumber(value, fallback=0){
    const number = Number(value);
    return Number.isFinite(number) ? number : Number(fallback || 0);
  }
  function careerAverage(values=[]){
    const clean = (Array.isArray(values) ? values : []).map(Number).filter(Number.isFinite);
    return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : 0;
  }
  function careerSeasonYear(season){
    if(typeof seasonYearForNumber === 'function') return seasonYearForNumber(season);
    return careerRound(configValue('calendario.anioInicial', 2026)) + Math.max(0, careerRound(season, 1) - 1);
  }
  function careerDivisionForClub(clubId){
    try{
      if(typeof clubDivision === 'function') return clubDivision(clubId);
    }catch(_){ }
    const club = (seed?.clubs || []).find(item => Number(item.id) === Number(clubId));
    return (seed?.divisions || []).find(item => String(item.id || '') === String(club?.divisionId || '')) || { id:club?.divisionId || 'default', name:'Liga', order:3 };
  }
  function careerDivisionOrder(division){
    if(Number.isFinite(Number(division?.order))) return Math.max(1, careerRound(division.order, 3));
    if(typeof divisionOrderFromName === 'function') return Math.max(1, careerRound(divisionOrderFromName(division?.name || ''), 3));
    return 3;
  }
  function careerLeagueClubs(clubId){
    const club = (seed?.clubs || []).find(item => Number(item.id) === Number(clubId));
    const divisionId = String(club?.divisionId || careerDivisionForClub(clubId)?.id || '');
    return (seed?.clubs || []).filter(item => String(item.divisionId || '') === divisionId && !item.specialCompetitionOnly && !item.competitionOnly);
  }
  function careerLeagueSize(clubId){
    return Math.max(1, careerLeagueClubs(clubId).length || 18);
  }
  function careerPositionLabel(position){
    const value = careerRound(position, 0);
    return value > 0 ? `${value}.º` : '—';
  }
  function careerObjectiveCodeLabel(code){
    const map = {
      win_title:'Ganar el título',
      challenge_title:'Pelear el título',
      high_table:'Terminar en la zona alta',
      mid_table:'Terminar en mitad de tabla',
      avoid_relegation:'No descender',
      promote:'Ascender',
      playoffs:'Jugar playoffs',
      promotion_fight:'Pelear puestos de ascenso',
      consolidate:'Consolidar la categoría',
      founder:'Desarrollar el club fundador'
    };
    return map[String(code || '')] || 'Cumplir el objetivo deportivo';
  }

  function managerCareerQualitativeObjective(clubId, objectivePpg=null, options={}){
    const targetClubId = Number(clubId || game?.selectedClubId || 0);
    const division = careerDivisionForClub(targetClubId);
    const order = careerDivisionOrder(division);
    const teams = careerLeagueSize(targetClubId);
    const ppg = Number.isFinite(Number(objectivePpg)) ? Number(objectivePpg) : (typeof managerObjectiveForClubDivision === 'function' ? Number(managerObjectiveForClubDivision(targetClubId)) : 1.1);
    const founder = options.founder === true || (typeof currentGameIsFounderMode === 'function' && Number(targetClubId) === Number(game?.selectedClubId || 0) && currentGameIsFounderMode());
    if(founder){
      return {
        code:'founder', label:careerObjectiveCodeLabel('founder'), targetPosition:null, minimumPosition:null,
        minimumLabel:'Sin posición mínima', objectivePpg:null, divisionOrder:order, teams
      };
    }
    let code = 'mid_table';
    let targetPosition = Math.max(1, Math.ceil(teams * 0.50));
    let minimumPosition = Math.max(targetPosition, Math.ceil(teams * 0.70));
    if(order <= 1){
      if(ppg >= 1.82){ code = 'win_title'; targetPosition = 1; minimumPosition = Math.min(teams, 3); }
      else if(ppg >= 1.56){ code = 'challenge_title'; targetPosition = Math.min(teams, 3); minimumPosition = Math.min(teams, 5); }
      else if(ppg >= 1.32){ code = 'high_table'; targetPosition = Math.max(1, Math.ceil(teams * 0.30)); minimumPosition = Math.max(targetPosition, Math.ceil(teams * 0.45)); }
      else if(ppg >= 1.08){ code = 'mid_table'; targetPosition = Math.max(1, Math.ceil(teams * 0.50)); minimumPosition = Math.max(targetPosition, Math.ceil(teams * 0.67)); }
      else { code = 'avoid_relegation'; targetPosition = Math.max(1, teams - 4); minimumPosition = Math.max(1, teams - 2); }
    }else{
      if(ppg >= 1.70){ code = 'promote'; targetPosition = Math.min(teams, 2); minimumPosition = Math.min(teams, 4); }
      else if(ppg >= 1.43){ code = 'playoffs'; targetPosition = Math.min(teams, 4); minimumPosition = Math.min(teams, 6); }
      else if(ppg >= 1.20){ code = 'promotion_fight'; targetPosition = Math.min(teams, 6); minimumPosition = Math.max(targetPosition, Math.ceil(teams * 0.50)); }
      else if(order < Math.max(...(seed?.divisions || []).map(item => careerDivisionOrder(item)), order)){
        code = 'avoid_relegation'; targetPosition = Math.max(1, teams - 4); minimumPosition = Math.max(1, teams - 2);
      }else{
        code = 'consolidate'; targetPosition = Math.max(1, Math.ceil(teams * 0.55)); minimumPosition = Math.max(targetPosition, Math.ceil(teams * 0.75));
      }
    }
    return {
      code,
      label:careerObjectiveCodeLabel(code),
      targetPosition:careerClamp(targetPosition, 1, teams),
      minimumPosition:careerClamp(minimumPosition, 1, teams),
      minimumLabel:`Posición mínima: ${careerPositionLabel(minimumPosition)}`,
      objectivePpg:Number.isFinite(ppg) ? Number(ppg.toFixed(3)) : null,
      divisionOrder:order,
      divisionId:String(division?.id || ''),
      divisionName:String(division?.name || 'Liga'),
      teams
    };
  }
  window.managerCareerQualitativeObjective = managerCareerQualitativeObjective;

  function normalizeCareerCapabilities(source={}, fallbackValue=careerInitialCapability()){
    const raw = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    const clean = {};
    CAPABILITY_KEYS.forEach(key => { clean[key] = careerClamp(careerRound(raw[key], fallbackValue), 0, 100); });
    return clean;
  }
  function managerCareerLegacyProfile(stats={}){
    const seasons = Array.isArray(stats?.seasons) ? stats.seasons : [];
    const career = Array.isArray(stats?.careerHistory) ? stats.careerHistory : [];
    const titles = Math.max(0, careerRound(stats?.titles || 0));
    const legacyPrestige = typeof managerPrestigeBreakdown === 'function' ? Number(managerPrestigeBreakdown(stats).total || 0) : Number(stats?.prestige || 0);
    const baseCapability = careerClamp(10 + seasons.length * 2, 10, 45);
    const avgPpg = careerAverage(seasons.map(item => Number(item?.ppg || 0)));
    const objectiveRate = seasons.length ? seasons.filter(item => item?.objectiveAchieved === true).length / seasons.length : 0;
    return {
      version:CAREER_PROFILE_VERSION,
      prestige:careerClamp(careerRound(legacyPrestige * 7 + titles * 8 + seasons.length * 3), 0, careerPrestigeMaximum()),
      moment:seasons.length ? careerClamp(careerRound((avgPpg - 1.15) * 55 + (objectiveRate - 0.5) * 30), careerMomentMinimum(), careerMomentMaximum()) : 0,
      capabilities:normalizeCareerCapabilities({
        sporting:baseCapability + titles * 2 + careerRound(objectiveRate * 8),
        leadership:baseCapability,
        economy:baseCapability,
        development:baseCapability,
        crisis:baseCapability,
        stability:baseCapability + Math.max(0, seasons.length - career.filter(item => ['dismissal','resignation'].includes(String(item?.type || ''))).length)
      }, baseCapability),
      seasonsEvaluated:seasons.length,
      progression:[],
      lastEvaluationKey:'',
      lastSeason:null
    };
  }
  function normalizeManagerCareerProfile(source={}, stats={}){
    const raw = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    const legacy = managerCareerLegacyProfile(stats);
    const progression = Array.isArray(raw.progression) ? raw.progression.map(item => ({
      key:String(item?.key || ''), season:careerRound(item?.season || 0), clubId:careerRound(item?.clubId || 0),
      evaluationScore:careerClamp(careerRound(item?.evaluationScore || 0), 0, 100),
      prestigeDelta:careerRound(item?.prestigeDelta || 0), momentBefore:careerRound(item?.momentBefore || 0), momentAfter:careerRound(item?.momentAfter || 0),
      capabilityDeltas:normalizeCareerCapabilities(item?.capabilityDeltas || {}, 0), createdAt:String(item?.createdAt || '')
    })).filter(item => item.key).slice(-120) : [];
    return {
      version:CAREER_PROFILE_VERSION,
      prestige:careerClamp(careerRound(raw.prestige, legacy.prestige), 0, careerPrestigeMaximum()),
      moment:careerClamp(careerRound(raw.moment, legacy.moment), careerMomentMinimum(), careerMomentMaximum()),
      capabilities:normalizeCareerCapabilities(raw.capabilities || legacy.capabilities, careerInitialCapability()),
      seasonsEvaluated:Math.max(progression.length, careerRound(raw.seasonsEvaluated, legacy.seasonsEvaluated)),
      progression,
      lastEvaluationKey:String(raw.lastEvaluationKey || progression[progression.length - 1]?.key || ''),
      lastSeason:raw.lastSeason && typeof raw.lastSeason === 'object' ? { ...raw.lastSeason } : legacy.lastSeason
    };
  }
  window.normalizeManagerCareerProfile = normalizeManagerCareerProfile;

  function normalizeManagerSeasonHistory(source=[]){
    const list = Array.isArray(source) ? source : [];
    const clean = [];
    const seen = new Set();
    list.forEach(item => {
      const season = Math.max(1, careerRound(item?.season || 1));
      const clubId = careerRound(item?.clubId || 0);
      const key = String(item?.key || `season:${season}:club:${clubId}:${item?.status || 'end'}`);
      if(!clubId || seen.has(key)) return;
      seen.add(key);
      const objective = item?.objective && typeof item.objective === 'object'
        ? { ...item.objective }
        : managerCareerQualitativeObjective(clubId, item?.objectivePpg);
      clean.push({
        ...item,
        version:CAREER_HISTORY_VERSION,
        key,
        season,
        year:careerRound(item?.year || careerSeasonYear(season)),
        clubId,
        clubName:String(item?.clubName || ''),
        divisionId:String(item?.divisionId || ''),
        divisionName:String(item?.divisionName || ''),
        position:careerRound(item?.position || 0),
        totalTeams:careerRound(item?.totalTeams || objective?.teams || 0),
        played:Math.max(0, careerRound(item?.played || 0)),
        won:Math.max(0, careerRound(item?.won ?? item?.pg ?? 0)),
        drawn:Math.max(0, careerRound(item?.drawn ?? item?.pe ?? 0)),
        lost:Math.max(0, careerRound(item?.lost ?? item?.pp ?? 0)),
        gf:Math.max(0, careerRound(item?.gf || 0)),
        gc:Math.max(0, careerRound(item?.gc || 0)),
        pts:Math.max(0, careerRound(item?.pts || 0)),
        ppg:Number(Number(item?.ppg || 0).toFixed(3)),
        status:String(item?.status || 'season_end'),
        partial:Boolean(item?.partial),
        objective,
        objectiveStatus:String(item?.objectiveStatus || ''),
        evaluationScore:careerClamp(careerRound(item?.evaluationScore || 0), 0, 100),
        evaluationLabel:String(item?.evaluationLabel || ''),
        components:item?.components && typeof item.components === 'object' ? { ...item.components } : {},
        profileChange:item?.profileChange && typeof item.profileChange === 'object' ? { ...item.profileChange } : null,
        createdAt:String(item?.createdAt || new Date().toISOString())
      });
    });
    const deduplicated = new Map();
    clean.forEach(item => {
      const semanticKey = String(item.status || '') === 'season_end'
        ? `season_end:${item.season}:${item.clubId}`
        : String(item.key || `${item.status}:${item.season}:${item.clubId}`);
      const previous = deduplicated.get(semanticKey);
      if(!previous){
        deduplicated.set(semanticKey, item);
        return;
      }
      const itemPriority = (item.legacy ? 0 : 100) + (item.profileChange ? 10 : 0) + Number(item.evaluationScore || 0) / 100;
      const previousPriority = (previous.legacy ? 0 : 100) + (previous.profileChange ? 10 : 0) + Number(previous.evaluationScore || 0) / 100;
      if(itemPriority >= previousPriority) deduplicated.set(semanticKey, item);
    });
    return Array.from(deduplicated.values()).sort((a,b)=>(Number(b.season || 0)-Number(a.season || 0)) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  }
  window.normalizeManagerSeasonHistory = normalizeManagerSeasonHistory;

  function managerCareerMigrateLegacySeasonHistory(stats){
    const existing = normalizeManagerSeasonHistory(stats?.seasonHistory || []);
    const keys = new Set(existing.map(item => `${item.season}:${item.clubId}:season_end`));
    (Array.isArray(stats?.seasons) ? stats.seasons : []).forEach(item => {
      const season = Math.max(1, careerRound(item?.season || 1));
      const clubId = careerRound(item?.clubId || 0);
      if(!clubId || keys.has(`${season}:${clubId}:season_end`)) return;
      const objective = managerCareerQualitativeObjective(clubId, item?.objectivePpg);
      const position = careerRound(item?.position || 0);
      const totalTeams = objective.teams || careerLeagueSize(clubId);
      const minimumMet = position > 0 && objective.minimumPosition && position <= objective.minimumPosition;
      const mainMet = position > 0 && objective.targetPosition && position <= objective.targetPosition;
      const sportScore = mainMet ? 90 : minimumMet ? 70 : careerClamp(55 - Math.max(0, position - (objective.minimumPosition || position)) * 7, 10, 65);
      const evaluationScore = careerRound(sportScore * 0.60 + 50 * 0.40);
      existing.push({
        key:`legacy:${season}:${clubId}:season_end`, season, year:item?.year || careerSeasonYear(season), clubId,
        clubName:item?.clubName || '', divisionId:item?.divisionId || '', divisionName:item?.divisionName || '',
        position, totalTeams, played:item?.played || 0, won:item?.pg || item?.won || 0, drawn:item?.pe || item?.drawn || 0,
        lost:item?.pp || item?.lost || 0, gf:item?.gf || 0, gc:item?.gc || 0, pts:item?.pts || 0, ppg:item?.ppg || 0,
        status:'season_end', partial:false, objective,
        objectiveStatus:mainMet ? 'Cumplido' : minimumMet ? 'Mínimo cumplido' : 'Incumplido',
        evaluationScore, evaluationLabel:managerCareerEvaluationLabel(evaluationScore), components:{ sporting:sportScore, overperformance:50, economy:50, development:50, leadership:50, context:50, crisis:50, stability:65 },
        legacy:true, createdAt:item?.createdAt || new Date().toISOString()
      });
      keys.add(`${season}:${clubId}:season_end`);
    });
    return normalizeManagerSeasonHistory(existing);
  }

  function normalizeClubSeasonHistory(source={}){
    const rawEntries = Array.isArray(source) ? source : (Array.isArray(source?.entries) ? source.entries : []);
    const map = new Map();
    rawEntries.forEach(item => {
      const season = Math.max(1, careerRound(item?.season || 1));
      const clubId = careerRound(item?.clubId || 0);
      if(!clubId) return;
      const key = `${season}:${clubId}`;
      map.set(key, {
        ...item,
        version:CAREER_HISTORY_VERSION,
        key,
        season,
        year:careerRound(item?.year || careerSeasonYear(season)),
        clubId,
        clubName:String(item?.clubName || ''),
        country:String(item?.country || ''),
        divisionId:String(item?.divisionId || ''),
        divisionName:String(item?.divisionName || ''),
        divisionOrder:Math.max(1, careerRound(item?.divisionOrder || 3)),
        position:Math.max(0, careerRound(item?.position || 0)),
        totalTeams:Math.max(0, careerRound(item?.totalTeams || 0)),
        played:Math.max(0, careerRound(item?.played ?? item?.pj ?? 0)),
        won:Math.max(0, careerRound(item?.won ?? item?.pg ?? 0)),
        drawn:Math.max(0, careerRound(item?.drawn ?? item?.pe ?? 0)),
        lost:Math.max(0, careerRound(item?.lost ?? item?.pp ?? 0)),
        gf:Math.max(0, careerRound(item?.gf || 0)), gc:Math.max(0, careerRound(item?.gc || 0)),
        dg:careerRound(item?.dg ?? (careerRound(item?.gf || 0) - careerRound(item?.gc || 0))),
        pts:Math.max(0, careerRound(item?.pts || 0)), ppg:Number(Number(item?.ppg || 0).toFixed(3)),
        champion:Boolean(item?.champion || Number(item?.position || 0) === 1), promoted:Boolean(item?.promoted), relegated:Boolean(item?.relegated),
        reputationStart:Number.isFinite(Number(item?.reputationStart)) ? Number(item.reputationStart) : null,
        reputationEnd:Number.isFinite(Number(item?.reputationEnd)) ? Number(item.reputationEnd) : null,
        reputationDelta:careerRound(item?.reputationDelta || 0),
        budgetEnd:Number.isFinite(Number(item?.budgetEnd)) ? Math.round(Number(item.budgetEnd)) : null,
        squadValue:Number.isFinite(Number(item?.squadValue)) ? Math.round(Number(item.squadValue)) : null,
        squadAverage:Number.isFinite(Number(item?.squadAverage)) ? Number(Number(item.squadAverage).toFixed(2)) : null,
        managedByUser:Boolean(item?.managedByUser), managerEvaluation:Number.isFinite(Number(item?.managerEvaluation)) ? careerClamp(careerRound(item.managerEvaluation), 0, 100) : null,
        createdAt:String(item?.createdAt || new Date().toISOString())
      });
    });
    return { version:CAREER_HISTORY_VERSION, entries:Array.from(map.values()).sort((a,b)=>(b.season-a.season) || String(a.divisionName).localeCompare(String(b.divisionName), 'es') || a.position-b.position) };
  }
  window.normalizeClubSeasonHistory = normalizeClubSeasonHistory;

  function managerCareerMigrateStandingsHistoryToClubs(targetGame){
    const history = normalizeClubSeasonHistory(targetGame?.clubSeasonHistory || {});
    const existing = new Set(history.entries.map(item => `${item.season}:${item.clubId}`));
    (targetGame?.standingsHistory?.seasons || []).forEach(seasonEntry => {
      Object.entries(seasonEntry?.divisions || {}).forEach(([divisionId, rows]) => {
        const division = (seed?.divisions || []).find(item => String(item.id || '') === String(divisionId || '')) || {};
        const totalTeams = Array.isArray(rows) ? rows.length : 0;
        (Array.isArray(rows) ? rows : []).forEach(row => {
          const clubId = careerRound(row?.clubId || 0);
          const key = `${careerRound(seasonEntry?.season || 1)}:${clubId}`;
          if(!clubId || existing.has(key)) return;
          const club = (seed?.clubs || []).find(item => Number(item.id) === clubId) || {};
          history.entries.push({
            key, season:careerRound(seasonEntry?.season || 1), year:careerRound(seasonEntry?.year || 0), clubId,
            clubName:club.name || '', country:club.country || division.country || '', divisionId:String(divisionId), divisionName:division.name || divisionId,
            divisionOrder:careerDivisionOrder(division), position:careerRound(row?.position || 0), totalTeams,
            played:careerRound(row?.pj || 0), won:careerRound(row?.pg || 0), drawn:careerRound(row?.pe || 0), lost:careerRound(row?.pp || 0),
            gf:careerRound(row?.gf || 0), gc:careerRound(row?.gc || 0), dg:careerRound(row?.dg || 0), pts:careerRound(row?.pts || 0),
            ppg:careerRound(row?.pj || 0) > 0 ? Number((Number(row?.pts || 0) / Number(row.pj)).toFixed(3)) : 0,
            champion:careerRound(row?.position || 0) === 1, promoted:false, relegated:false,
            reputationStart:null, reputationEnd:null, reputationDelta:0, budgetEnd:null, squadValue:null, squadAverage:null,
            managedByUser:Boolean((targetGame?.managerStats?.seasons || []).some(item => Number(item?.season) === Number(seasonEntry?.season) && Number(item?.clubId) === clubId)),
            managerEvaluation:null, legacy:true, createdAt:seasonEntry?.createdAt || new Date().toISOString()
          });
          existing.add(key);
        });
      });
    });
    return normalizeClubSeasonHistory(history);
  }

  function normalizeCareerBaselines(source={}){
    const raw = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    const clean = {};
    Object.entries(raw).forEach(([key, item]) => {
      if(!key || !item || typeof item !== 'object' || Array.isArray(item)) return;
      clean[key] = {
        key:String(item.key || key), season:Math.max(1, careerRound(item.season || 1)), clubId:careerRound(item.clubId || 0),
        joinedDate:String(item.joinedDate || ''), joinedDay:Math.max(1, careerRound(item.joinedDay || 1)),
        budget:Number.isFinite(Number(item.budget)) ? Math.round(Number(item.budget)) : null,
        reputation:Number.isFinite(Number(item.reputation)) ? Number(item.reputation) : null,
        squadValue:Number.isFinite(Number(item.squadValue)) ? Math.round(Number(item.squadValue)) : null,
        squadAverage:Number.isFinite(Number(item.squadAverage)) ? Number(item.squadAverage) : null,
        youngAverage:Number.isFinite(Number(item.youngAverage)) ? Number(item.youngAverage) : null,
        squadCount:Math.max(0, careerRound(item.squadCount || 0)), morale:Number.isFinite(Number(item.morale)) ? Number(item.morale) : null,
        cohesion:Number.isFinite(Number(item.cohesion)) ? Number(item.cohesion) : null,
        position:Number.isFinite(Number(item.position)) ? careerRound(item.position) : null,
        createdAt:String(item.createdAt || new Date().toISOString())
      };
    });
    return clean;
  }

  function managerCareerSquadMetrics(clubId){
    const players = typeof playersByClub === 'function' ? playersByClub(clubId) : (seed?.players || []).filter(item => Number(item.clubId) === Number(clubId));
    const overalls = players.map(player => typeof visibleOverall === 'function' ? Number(visibleOverall(player)) : Number(player?.overall || player?.media || 0)).filter(Number.isFinite);
    const young = players.filter(player => Number(player?.age || 99) <= 23);
    const youngOveralls = young.map(player => typeof visibleOverall === 'function' ? Number(visibleOverall(player)) : Number(player?.overall || player?.media || 0)).filter(Number.isFinite);
    const squadValue = players.reduce((sum, player) => {
      let value = Number(player?.clause || player?.value || 0);
      if((!Number.isFinite(value) || value <= 0) && typeof playerClauseFor === 'function') value = Number(playerClauseFor(player) || 0);
      return sum + Math.max(0, Number.isFinite(value) ? value : 0);
    }, 0);
    return {
      count:players.length,
      average:overalls.length ? careerAverage(overalls) : 0,
      youngAverage:youngOveralls.length ? careerAverage(youngOveralls) : 0,
      youngCount:young.length,
      value:Math.round(squadValue)
    };
  }
  function managerCareerCurrentPosition(clubId){
    try{
      const division = careerDivisionForClub(clubId);
      const table = typeof sortedStandings === 'function' ? sortedStandings(division.id) : [];
      const index = table.findIndex(row => Number(row?.clubId) === Number(clubId));
      return { position:index >= 0 ? index + 1 : 0, totalTeams:table.length || careerLeagueSize(clubId), row:index >= 0 ? table[index] : null };
    }catch(_){ return { position:0, totalTeams:careerLeagueSize(clubId), row:null }; }
  }
  function managerCareerStintKey(current, season, clubId){
    if(current?.careerStintId) return String(current.careerStintId);
    const turn = Math.max(0, careerRound(game?.globalTurn || 0));
    const date = String(game?.currentDate || 'inicio').replace(/[^0-9A-Za-z_-]/g, '');
    return `s${season}-c${clubId}-t${turn}-${date}`;
  }
  function ensureManagerCareerBaseline(options={}){
    if(!game || game?.gameOver?.active || !Number(game.selectedClubId || 0)) return null;
    game.managerStats = typeof ensureManagerCurrentSeasonStats === 'function'
      ? ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber || 1, game.selectedClubId)
      : game.managerStats;
    const current = game.managerStats?.currentSeason || {};
    const season = Math.max(1, careerRound(game.seasonNumber || 1));
    const clubId = careerRound(game.selectedClubId || 0);
    const stintKey = managerCareerStintKey(current, season, clubId);
    current.careerStintId = stintKey;
    game.managerStats.currentSeason = current;
    game.managerCareerBaselines = normalizeCareerBaselines(game.managerCareerBaselines || {});
    if(game.managerCareerBaselines[stintKey]) return game.managerCareerBaselines[stintKey];
    const squad = managerCareerSquadMetrics(clubId);
    const standing = managerCareerCurrentPosition(clubId);
    const joinedDay = typeof currentGlobalDayNumber === 'function' ? Math.max(1, careerRound(currentGlobalDayNumber() || 1)) : 1;
    const baseline = {
      key:stintKey, season, clubId, joinedDate:String(game.currentDate || ''), joinedDay,
      budget:Number.isFinite(Number(game.budget)) ? Math.round(Number(game.budget)) : null,
      reputation:typeof clubPrestigeValue === 'function' ? Number(clubPrestigeValue(clubId)) : null,
      squadValue:squad.value, squadAverage:Number(squad.average.toFixed(2)), youngAverage:Number(squad.youngAverage.toFixed(2)), squadCount:squad.count,
      morale:typeof squadMoraleAverage === 'function' ? Number(squadMoraleAverage(clubId)) : null,
      cohesion:typeof cohesionValue === 'function' ? Number(cohesionValue(clubId)) : null,
      position:standing.position || null, createdAt:new Date().toISOString()
    };
    game.managerCareerBaselines[stintKey] = baseline;
    return baseline;
  }
  window.ensureManagerCareerBaseline = ensureManagerCareerBaseline;

  function managerCareerObjectiveResult(objective, position){
    const pos = careerRound(position || 0);
    if(!objective || !pos || !objective.targetPosition) return { mainMet:false, minimumMet:false, status:'Sin evaluación' };
    const mainMet = pos <= Number(objective.targetPosition);
    const minimumMet = pos <= Number(objective.minimumPosition || objective.targetPosition);
    return { mainMet, minimumMet, status:mainMet ? 'Cumplido' : minimumMet ? 'Mínimo cumplido' : 'Incumplido' };
  }
  function managerCareerSportingScore({ position, totalTeams, ppg, objectivePpg, objective }){
    const pos = Math.max(1, careerRound(position || totalTeams || 1));
    const teams = Math.max(pos, careerRound(totalTeams || objective?.teams || pos));
    const target = careerClamp(careerRound(objective?.targetPosition || Math.ceil(teams * 0.5)), 1, teams);
    const minimum = careerClamp(careerRound(objective?.minimumPosition || Math.ceil(teams * 0.7)), target, teams);
    let positionScore = 0;
    if(pos <= target){
      positionScore = 88 + ((target - pos) / Math.max(1, target - 1)) * 12;
    }else if(pos <= minimum){
      positionScore = 68 + ((minimum - pos) / Math.max(1, minimum - target)) * 18;
    }else{
      positionScore = Math.max(5, 65 - ((pos - minimum) / Math.max(1, teams - minimum)) * 60);
    }
    const reference = Number(objectivePpg || objective?.objectivePpg || 0);
    const ppgScore = reference > 0 ? careerClamp(50 + ((Number(ppg || 0) - reference) / 0.65) * 50, 0, 100) : 50;
    return careerClamp(Math.round(positionScore * 0.72 + ppgScore * 0.28), 0, 100);
  }
  function managerCareerOverperformanceScore({ position, totalTeams, objective }){
    const pos = Math.max(1, careerRound(position || totalTeams || 1));
    const teams = Math.max(pos, careerRound(totalTeams || objective?.teams || pos));
    const expected = careerAverage([objective?.targetPosition || pos, objective?.minimumPosition || pos]);
    return careerClamp(Math.round(50 + ((expected - pos) / Math.max(1, teams - 1)) * 170), 0, 100);
  }
  function managerCareerEconomyScore(baseline, endBudget){
    if(!baseline || !Number.isFinite(Number(baseline.budget)) || !Number.isFinite(Number(endBudget))) return 50;
    const start = Number(baseline.budget);
    const end = Number(endBudget);
    const denominator = Math.max(10000000, Math.abs(start), Number(baseline.squadValue || 0) * 0.08);
    const ratio = (end - start) / denominator;
    return careerClamp(Math.round(50 + ratio * 65), 0, 100);
  }
  function managerCareerDevelopmentScore(baseline, endSquad){
    if(!baseline || !endSquad) return 50;
    const overallDelta = Number(endSquad.average || 0) - Number(baseline.squadAverage || endSquad.average || 0);
    const youngDelta = Number(endSquad.youngAverage || 0) - Number(baseline.youngAverage || endSquad.youngAverage || 0);
    const countDelta = Number(endSquad.count || 0) - Number(baseline.squadCount || endSquad.count || 0);
    return careerClamp(Math.round(50 + overallDelta * 7 + youngDelta * 9 + careerClamp(countDelta, -5, 5) * 1.5), 0, 100);
  }
  function managerCareerLeadershipScore(clubId){
    if(typeof window.managerDressingRoomLeadershipScore === 'function'){
      const contextual = Number(window.managerDressingRoomLeadershipScore(clubId));
      if(Number.isFinite(contextual)) return careerClamp(Math.round(contextual), 0, 100);
    }
    const morale = typeof squadMoraleAverage === 'function' ? Number(squadMoraleAverage(clubId) || 0) : 50;
    const cohesion = typeof cohesionValue === 'function' ? Number(cohesionValue(clubId) || 0) : 50;
    return careerClamp(Math.round((morale / 99) * 52 + (cohesion / 100) * 48), 0, 100);
  }
  function managerCareerMatchPointsSequence(clubId){
    return (Array.isArray(game?.matchHistory) ? game.matchHistory : [])
      .filter(match => match?.played && !match?.friendly && (Number(match.homeId) === Number(clubId) || Number(match.awayId) === Number(clubId)))
      .map(match => {
        const ownHome = Number(match.homeId) === Number(clubId);
        const gf = ownHome ? Number(match.homeGoals || 0) : Number(match.awayGoals || 0);
        const gc = ownHome ? Number(match.awayGoals || 0) : Number(match.homeGoals || 0);
        return gf > gc ? 3 : gf === gc ? 1 : 0;
      });
  }
  function managerCareerCrisisScore(clubId, evaluationScore=50){
    const points = managerCareerMatchPointsSequence(clubId);
    if(points.length < 5) return 50;
    let longest = 0;
    let current = 0;
    let longestEnd = -1;
    points.forEach((value, index) => {
      if(value < 3){ current += 1; if(current > longest){ longest = current; longestEnd = index; } }
      else current = 0;
    });
    if(longest < 4) return careerClamp(Math.round(52 + (Number(evaluationScore || 50) - 50) * 0.25), 35, 75);
    const after = points.slice(longestEnd + 1);
    const recovery = after.length ? careerAverage(after.slice(-Math.min(6, after.length))) / 3 : 0;
    return careerClamp(Math.round(25 + recovery * 60 + (Number(evaluationScore || 50) - 50) * 0.25), 0, 100);
  }
  function managerCareerStabilityScore(status, baseline, played, expectedMatches){
    const type = String(status || 'season_end');
    const share = expectedMatches > 0 ? careerClamp(Number(played || 0) / expectedMatches, 0, 1) : 1;
    if(type === 'dismissal') return careerClamp(Math.round(22 + share * 18), 0, 100);
    if(type === 'resignation') return careerClamp(Math.round(28 + share * 22), 0, 100);
    const joinedLate = Number(baseline?.joinedDay || 1) > 60;
    return careerClamp(Math.round((joinedLate ? 62 : 72) + share * 20), 0, 100);
  }
  function managerCareerEvaluationLabel(score){
    const value = careerClamp(careerRound(score || 0), 0, 100);
    if(value >= 90) return 'Temporada histórica';
    if(value >= 80) return 'Sobresaliente';
    if(value >= 70) return 'Muy buena';
    if(value >= 60) return 'Positiva';
    if(value >= 50) return 'Aceptable';
    if(value >= 40) return 'Irregular';
    if(value >= 30) return 'Deficiente';
    return 'Crisis deportiva';
  }
  window.managerCareerEvaluationLabel = managerCareerEvaluationLabel;

  function managerCareerEvaluationData(options={}){
    const clubId = Number(options.clubId || game?.selectedClubId || 0);
    const season = Math.max(1, careerRound(options.season || game?.seasonNumber || 1));
    const current = options.current || game?.managerStats?.currentSeason || {};
    const standing = options.standing || managerCareerCurrentPosition(clubId);
    const row = options.row || standing.row || {};
    const position = careerRound(options.position || standing.position || 0);
    const totalTeams = careerRound(options.totalTeams || standing.totalTeams || careerLeagueSize(clubId));
    const played = Math.max(0, careerRound(options.played ?? current.played ?? row.pj ?? 0));
    const won = Math.max(0, careerRound(options.won ?? current.won ?? row.pg ?? 0));
    const drawn = Math.max(0, careerRound(options.drawn ?? current.drawn ?? row.pe ?? 0));
    const lost = Math.max(0, careerRound(options.lost ?? current.lost ?? row.pp ?? 0));
    const pts = Number.isFinite(Number(options.pts)) ? careerRound(options.pts) : won * 3 + drawn;
    const ppg = played > 0 ? pts / played : 0;
    const objectivePpg = Number.isFinite(Number(options.objectivePpg)) ? Number(options.objectivePpg) : Number(current.objectivePpg || 0);
    const objective = options.objective || managerCareerQualitativeObjective(clubId, objectivePpg);
    const objectiveResult = managerCareerObjectiveResult(objective, position);
    const baseline = options.baseline || ensureManagerCareerBaseline({ silent:true });
    const endSquad = options.endSquad || managerCareerSquadMetrics(clubId);
    const endBudget = Number.isFinite(Number(options.endBudget)) ? Number(options.endBudget) : Number(game?.budget || 0);
    const sporting = managerCareerSportingScore({ position, totalTeams, ppg, objectivePpg, objective });
    const overperformance = managerCareerOverperformanceScore({ position, totalTeams, objective });
    const economy = managerCareerEconomyScore(baseline, endBudget);
    const development = managerCareerDevelopmentScore(baseline, endSquad);
    const leadership = managerCareerLeadershipScore(clubId);
    const expectedMatches = Math.max(1, (totalTeams - 1) * (typeof SEASON_HOME_AWAY !== 'undefined' && SEASON_HOME_AWAY ? 2 : 1));
    const stability = managerCareerStabilityScore(options.status || 'season_end', baseline, played, expectedMatches);
    const provisional = sporting * 0.45 + overperformance * 0.15 + economy * 0.10 + development * 0.10 + leadership * 0.10;
    const crisis = managerCareerCrisisScore(clubId, provisional);
    const injuryCount = Number(game?.firstTeamInjurySeasonControl?.season) === season && Number(game?.firstTeamInjurySeasonControl?.clubId) === clubId
      ? Number(game.firstTeamInjurySeasonControl.count || 0) : 0;
    const injuryContext = injuryCount >= 35 ? 8 : injuryCount >= 25 ? 4 : 0;
    const context = careerClamp(Math.round(crisis * 0.55 + stability * 0.45 + injuryContext), 0, 100);
    const score = careerClamp(Math.round(sporting * 0.45 + overperformance * 0.15 + economy * 0.10 + development * 0.10 + leadership * 0.10 + context * 0.10), 0, 100);
    return {
      season, clubId, position, totalTeams, played, won, drawn, lost,
      gf:Math.max(0, careerRound(options.gf ?? current.gf ?? row.gf ?? 0)), gc:Math.max(0, careerRound(options.gc ?? current.gc ?? row.gc ?? 0)),
      pts, ppg:Number(ppg.toFixed(3)), objectivePpg:Number.isFinite(objectivePpg) ? Number(objectivePpg.toFixed(3)) : null,
      objective, objectiveResult, baseline, endSquad, endBudget, score, label:managerCareerEvaluationLabel(score),
      components:{ sporting, overperformance, economy, development, leadership, context, crisis, stability }
    };
  }
  window.managerCareerEvaluationData = managerCareerEvaluationData;

  function managerCareerCapabilityDelta(score, weight=1){
    return careerClamp(Math.round(((Number(score || 50) - 50) / 17) * Number(weight || 1)), -4, 6);
  }
  function managerCareerApplyProfileEvaluation(evaluation, options={}){
    if(!game?.managerStats || !evaluation) return null;
    game.managerStats = normalizeManagerStats(game.managerStats);
    const profile = normalizeManagerCareerProfile(game.managerStats.careerProfile, game.managerStats);
    const key = String(options.key || `season:${evaluation.season}:club:${evaluation.clubId}:${options.status || 'season_end'}`);
    if(profile.progression.some(item => String(item.key) === key)){
      return profile.progression.find(item => String(item.key) === key) || null;
    }
    const expectedMatches = Math.max(1, (Math.max(2, evaluation.totalTeams) - 1) * (typeof SEASON_HOME_AWAY !== 'undefined' && SEASON_HOME_AWAY ? 2 : 1));
    const partialWeight = options.partial ? careerClamp(evaluation.played / expectedMatches, 0.20, 0.75) : 1;
    const status = String(options.status || 'season_end');
    let prestigeDelta = Math.round(((evaluation.score - 50) * 0.45) * partialWeight);
    if(evaluation.position === 1) prestigeDelta += Math.round(10 * partialWeight);
    if(options.promoted) prestigeDelta += Math.round(7 * partialWeight);
    if(options.relegated) prestigeDelta -= Math.round(10 * partialWeight);
    if(status === 'dismissal') prestigeDelta -= 7;
    if(status === 'resignation') prestigeDelta -= 4;
    prestigeDelta = careerClamp(prestigeDelta, -25, 30);
    const momentBefore = profile.moment;
    let momentEvent = 0;
    if(evaluation.position === 1) momentEvent += 12;
    if(options.promoted) momentEvent += 8;
    if(options.relegated) momentEvent -= 14;
    if(status === 'dismissal') momentEvent -= 16;
    if(status === 'resignation') momentEvent -= 9;
    let momentAfter = careerClamp(Math.round(momentBefore * 0.52 + (evaluation.score - 50) * 1.18 * partialWeight + momentEvent), careerMomentMinimum(), careerMomentMaximum());
    if(status === 'dismissal') momentAfter = Math.min(momentAfter, careerClamp(momentBefore - 10, careerMomentMinimum(), careerMomentMaximum()));
    if(status === 'resignation') momentAfter = Math.min(momentAfter, careerClamp(momentBefore - 5, careerMomentMinimum(), careerMomentMaximum()));
    const capabilityScores = {
      sporting:evaluation.components.sporting,
      leadership:evaluation.components.leadership,
      economy:evaluation.components.economy,
      development:evaluation.components.development,
      crisis:evaluation.components.crisis,
      stability:evaluation.components.stability
    };
    const capabilityDeltas = {};
    CAPABILITY_KEYS.forEach(capability => {
      let delta = managerCareerCapabilityDelta(capabilityScores[capability], partialWeight);
      if(capability === 'stability' && status === 'dismissal') delta = Math.min(delta, -2);
      if(capability === 'stability' && status === 'resignation') delta = Math.min(delta, -2);
      capabilityDeltas[capability] = delta;
      profile.capabilities[capability] = careerClamp(careerRound(profile.capabilities[capability] || 0) + delta, 0, 100);
    });
    const change = {
      key, season:evaluation.season, clubId:evaluation.clubId, evaluationScore:evaluation.score,
      prestigeBefore:profile.prestige, prestigeDelta, prestigeAfter:careerClamp(profile.prestige + prestigeDelta, 0, careerPrestigeMaximum()),
      momentBefore, momentAfter, capabilityDeltas, weight:Number(partialWeight.toFixed(3)), status,
      createdAt:new Date().toISOString()
    };
    profile.prestige = change.prestigeAfter;
    profile.moment = momentAfter;
    profile.progression.push(change);
    profile.progression = profile.progression.slice(-120);
    profile.seasonsEvaluated = Math.max(0, careerRound(profile.seasonsEvaluated || 0)) + 1;
    profile.lastEvaluationKey = key;
    profile.lastSeason = { season:evaluation.season, clubId:evaluation.clubId, score:evaluation.score, label:evaluation.label, status };
    game.managerStats.careerProfile = profile;
    return change;
  }

  function managerCareerBuildSeasonHistoryEntry(options={}){
    const evaluation = options.evaluation || managerCareerEvaluationData(options);
    const status = String(options.status || 'season_end');
    const partial = Boolean(options.partial);
    const key = String(options.key || `${status}:${evaluation.season}:${evaluation.clubId}:${game?.managerStats?.currentSeason?.careerStintId || 'stint'}`);
    const club = (seed?.clubs || []).find(item => Number(item.id) === Number(evaluation.clubId)) || {};
    const division = careerDivisionForClub(evaluation.clubId);
    const profileChange = managerCareerApplyProfileEvaluation(evaluation, {
      key, status, partial, promoted:Boolean(options.promoted), relegated:Boolean(options.relegated)
    });
    return {
      version:CAREER_HISTORY_VERSION, key, season:evaluation.season, year:careerRound(game?.seasonYear || careerSeasonYear(evaluation.season)),
      clubId:evaluation.clubId, clubName:club.name || (typeof clubName === 'function' ? clubName(evaluation.clubId) : ''),
      divisionId:String(division?.id || ''), divisionName:String(division?.name || 'Liga'), divisionOrder:careerDivisionOrder(division),
      position:evaluation.position, totalTeams:evaluation.totalTeams, played:evaluation.played, won:evaluation.won, drawn:evaluation.drawn,
      lost:evaluation.lost, gf:evaluation.gf, gc:evaluation.gc, pts:evaluation.pts, ppg:evaluation.ppg,
      status, partial, objective:evaluation.objective, objectiveStatus:evaluation.objectiveResult.status,
      evaluationScore:evaluation.score, evaluationLabel:evaluation.label, components:evaluation.components, profileChange,
      title:evaluation.position === 1, promoted:Boolean(options.promoted), relegated:Boolean(options.relegated),
      startDate:String(evaluation.baseline?.joinedDate || ''), endDate:String(game?.currentDate || ''), createdAt:new Date().toISOString()
    };
  }

  function managerCareerStoreSeasonEntry(entry){
    if(!game?.managerStats || !entry) return null;
    game.managerStats = normalizeManagerStats(game.managerStats);
    const history = normalizeManagerSeasonHistory(game.managerStats.seasonHistory || []);
    const index = history.findIndex(item => String(item.key) === String(entry.key));
    if(index >= 0) history[index] = { ...history[index], ...entry };
    else history.push(entry);
    game.managerStats.seasonHistory = normalizeManagerSeasonHistory(history);
    return entry;
  }

  function managerCareerFinalizeCurrentStint(options={}){
    if(!game?.managerStats || !Number(game.selectedClubId || 0)) return null;
    ensureManagerCareerBaseline({ silent:true });
    game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber || 1, game.selectedClubId);
    const current = game.managerStats.currentSeason || {};
    const status = String(options.status || 'season_end');
    const key = String(options.key || `${status}:${game.seasonNumber || 1}:${game.selectedClubId}:${current.careerStintId || 'stint'}`);
    if((game.managerStats.seasonHistory || []).some(item => String(item.key) === key)) return (game.managerStats.seasonHistory || []).find(item => String(item.key) === key);
    const transitionRecord = options.record || game?.seasonTransition?.userRecord || {};
    const movements = options.movements || game?.seasonTransition?.movements || [];
    const promoted = Boolean(options.promoted ?? transitionRecord.promoted ?? movements.some(move => move.type === 'promotion' && Number(move.clubId) === Number(game.selectedClubId)));
    const relegated = Boolean(options.relegated ?? movements.some(move => move.type === 'relegation' && Number(move.clubId) === Number(game.selectedClubId)));
    const evaluation = managerCareerEvaluationData({
      clubId:game.selectedClubId, season:game.seasonNumber, current,
      position:transitionRecord.position, totalTeams:transitionRecord.totalTeams,
      played:current.played, won:current.won, drawn:current.drawn, lost:current.lost, gf:current.gf, gc:current.gc,
      pts:transitionRecord.pts, objectivePpg:current.objectivePpg, status
    });
    const entry = managerCareerBuildSeasonHistoryEntry({ evaluation, status, partial:Boolean(options.partial), key, promoted, relegated });
    managerCareerStoreSeasonEntry(entry);
    return entry;
  }
  window.managerCareerFinalizeCurrentStint = managerCareerFinalizeCurrentStint;

  function managerCareerRecordClubSeasonHistory(){
    if(!game || !game.seasonFinalized) return 0;
    const season = Math.max(1, careerRound(game.seasonNumber || 1));
    const year = careerRound(game.seasonYear || careerSeasonYear(season));
    const reputationChanges = new Map((game?.seasonTransition?.prestigeChanges || []).map(item => [Number(item.clubId), item]));
    const movements = game?.seasonTransition?.movements || [];
    const managerEntries = (game?.managerStats?.seasonHistory || []).filter(item => Number(item.season) === season);
    const managerByClub = new Map(managerEntries.map(item => [Number(item.clubId), item]));
    const history = normalizeClubSeasonHistory(game.clubSeasonHistory || {});
    const map = new Map(history.entries.map(item => [`${item.season}:${item.clubId}`, item]));
    (seed?.divisions || []).forEach(division => {
      const table = typeof sortedStandings === 'function' ? sortedStandings(division.id) : [];
      const totalTeams = table.length;
      table.forEach((row, index) => {
        const clubId = Number(row.clubId || 0);
        const club = (seed?.clubs || []).find(item => Number(item.id) === clubId);
        if(!club || club.specialCompetitionOnly || club.competitionOnly) return;
        const change = reputationChanges.get(clubId);
        const squad = managerCareerSquadMetrics(clubId);
        const managerEntry = managerByClub.get(clubId);
        const promoted = movements.some(move => move.type === 'promotion' && Number(move.clubId) === clubId);
        const relegated = movements.some(move => move.type === 'relegation' && Number(move.clubId) === clubId);
        const played = careerRound(row.pj || 0);
        const entry = {
          key:`${season}:${clubId}`, season, year, clubId, clubName:club.name || '', country:club.country || division.country || '',
          divisionId:String(division.id || ''), divisionName:String(division.name || 'Liga'), divisionOrder:careerDivisionOrder(division),
          position:index + 1, totalTeams, played, won:careerRound(row.pg || 0), drawn:careerRound(row.pe || 0), lost:careerRound(row.pp || 0),
          gf:careerRound(row.gf || 0), gc:careerRound(row.gc || 0), dg:careerRound(row.dg || 0), pts:careerRound(row.pts || 0),
          ppg:played > 0 ? Number((Number(row.pts || 0) / played).toFixed(3)) : 0,
          champion:index === 0, promoted, relegated,
          reputationStart:change ? Number(change.oldValue) : (typeof clubPrestigeValue === 'function' ? Number(clubPrestigeValue(club)) : null),
          reputationEnd:change ? Number(change.next) : (typeof clubPrestigeValue === 'function' ? Number(clubPrestigeValue(club)) : null),
          reputationDelta:change ? careerRound(change.delta || 0) : 0,
          budgetEnd:Number.isFinite(Number(game?.clubBudgets?.[clubId])) ? Math.round(Number(game.clubBudgets[clubId])) : (clubId === Number(game.selectedClubId) ? Math.round(Number(game.budget || 0)) : Math.round(Number(club.budget || 0))),
          squadValue:squad.value, squadAverage:Number(squad.average.toFixed(2)),
          managedByUser:Boolean(managerEntry), managerEvaluation:managerEntry ? managerEntry.evaluationScore : null,
          createdAt:new Date().toISOString()
        };
        map.set(entry.key, entry);
      });
    });
    game.clubSeasonHistory = normalizeClubSeasonHistory({ entries:Array.from(map.values()) });
    return game.clubSeasonHistory.entries.filter(item => Number(item.season) === season).length;
  }
  window.managerCareerRecordClubSeasonHistory = managerCareerRecordClubSeasonHistory;

  function managerCareerEvaluationMarkup(entry, compact=false){
    if(!entry) return '';
    const objective = entry.objective || {};
    const change = entry.profileChange || {};
    const delta = Number(change.prestigeDelta || 0);
    const component = entry.components || {};
    if(compact){
      return `<div class="career-season-evaluation compact"><div><span>Evaluación final</span><strong>${entry.evaluationScore}/100</strong><em>${escapeHtml(entry.evaluationLabel || '')}</em></div><div><span>Objetivo</span><strong>${escapeHtml(objective.label || '—')}</strong><em>${escapeHtml(objective.minimumLabel || '')}</em></div><div><span>Prestigio de carrera</span><strong class="${delta >= 0 ? 'ok' : 'danger'}">${delta >= 0 ? '+' : ''}${delta}</strong><em>${escapeHtml(entry.objectiveStatus || '')}</em></div></div>`;
    }
    return `<div class="career-season-evaluation"><div><span>Evaluación final</span><strong>${entry.evaluationScore}/100</strong><em>${escapeHtml(entry.evaluationLabel || '')}</em></div><div><span>Objetivo</span><strong>${escapeHtml(objective.label || '—')}</strong><em>${escapeHtml(objective.minimumLabel || '')} · ${escapeHtml(entry.objectiveStatus || '')}</em></div><div><span>Rendimiento</span><strong>${careerRound(component.sporting || 0)}</strong><em>Resultado deportivo</em></div><div><span>Gestión</span><strong>${careerRound(careerAverage([component.economy, component.development, component.leadership]))}</strong><em>Economía, desarrollo y liderazgo</em></div><div><span>Prestigio de carrera</span><strong class="${delta >= 0 ? 'ok' : 'danger'}">${delta >= 0 ? '+' : ''}${delta}</strong><em>Momento ${careerRound(change.momentAfter || 0) >= 0 ? '+' : ''}${careerRound(change.momentAfter || 0)}</em></div></div>`;
  }
  window.managerCareerEvaluationMarkup = managerCareerEvaluationMarkup;

  const createInitialManagerStatsV869 = createInitialManagerStats;
  createInitialManagerStats = function(){
    const stats = createInitialManagerStatsV869();
    stats.careerProfile = normalizeManagerCareerProfile({}, stats);
    stats.seasonHistory = [];
    return stats;
  };

  const normalizeManagerStatsV869 = normalizeManagerStats;
  normalizeManagerStats = function(stats){
    const normalized = normalizeManagerStatsV869(stats);
    normalized.seasonHistory = managerCareerMigrateLegacySeasonHistory({ ...normalized, seasonHistory:stats?.seasonHistory || normalized.seasonHistory || [] });
    normalized.careerProfile = normalizeManagerCareerProfile(stats?.careerProfile || normalized.careerProfile || {}, normalized);
    return normalized;
  };

  const ensureManagerCurrentSeasonStatsV869 = ensureManagerCurrentSeasonStats;
  ensureManagerCurrentSeasonStats = function(stats, season=game?.seasonNumber || 1, clubId=game?.selectedClubId || 0){
    const normalized = ensureManagerCurrentSeasonStatsV869(stats, season, clubId);
    const current = normalized.currentSeason || {};
    const objective = managerCareerQualitativeObjective(clubId, current.objectivePpg, { founder:typeof currentGameIsFounderMode === 'function' && currentGameIsFounderMode() });
    current.objectiveQualitative = objective;
    current.objectiveQualitativeLabel = objective.label;
    current.objectiveMinimumPosition = objective.minimumPosition;
    current.objectiveTargetPosition = objective.targetPosition;
    current.careerStintId = current.careerStintId || managerCareerStintKey(current, season, clubId);
    normalized.currentSeason = current;
    normalized.careerProfile = normalizeManagerCareerProfile(normalized.careerProfile, normalized);
    normalized.seasonHistory = normalizeManagerSeasonHistory(normalized.seasonHistory || []);
    return normalized;
  };

  if(typeof managerObjectiveProgressInfo === 'function'){
    const managerObjectiveProgressInfoV869 = managerObjectiveProgressInfo;
    managerObjectiveProgressInfo = function(){
      const info = managerObjectiveProgressInfoV869();
      const qualitative = managerCareerQualitativeObjective(game?.selectedClubId, info?.objective, { founder:typeof currentGameIsFounderMode === 'function' && currentGameIsFounderMode() });
      return { ...info, qualitative, qualitativeLabel:qualitative.label, minimumPosition:qualitative.minimumPosition, targetPosition:qualitative.targetPosition };
    };
  }

  const normalizeGameV869 = normalizeGame;
  normalizeGame = function(saved){
    const normalized = normalizeGameV869(saved);
    normalized.managerStats = normalizeManagerStats(normalized.managerStats || createInitialManagerStats());
    normalized.managerCareerBaselines = normalizeCareerBaselines(normalized.managerCareerBaselines || {});
    normalized.clubSeasonHistory = managerCareerMigrateStandingsHistoryToClubs(normalized);
    return normalized;
  };

  const newGameV869 = newGame;
  newGame = function(selectedClubId, options={}){
    const result = newGameV869(selectedClubId, options);
    if(game){
      game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber || 1, game.selectedClubId || selectedClubId);
      game.clubSeasonHistory = normalizeClubSeasonHistory(game.clubSeasonHistory || {});
      ensureManagerCareerBaseline({ silent:true });
      if(typeof saveLocal === 'function') saveLocal(true);
    }
    return result;
  };

  const startNextSeasonV869 = startNextSeason;
  startNextSeason = function(selectedClubId, options={}){
    const result = startNextSeasonV869(selectedClubId, options);
    if(game && !game.seasonFinalized){
      game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber || 1, game.selectedClubId || selectedClubId);
      ensureManagerCareerBaseline({ silent:true });
      if(typeof saveLocal === 'function') saveLocal(true);
    }
    return result;
  };

  const continueCareerAtClubV869 = continueCareerAtClub;
  continueCareerAtClub = function(selectedClubId, options={}){
    const result = continueCareerAtClubV869(selectedClubId, options);
    if(game && !game.gameOver?.active && Number(game.selectedClubId || 0) === Number(selectedClubId || 0)){
      game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber || 1, game.selectedClubId);
      ensureManagerCareerBaseline({ silent:true });
      if(typeof saveLocal === 'function') saveLocal(true);
    }
    return result;
  };

  const recordDismissedCareerStepV869 = recordDismissedCareerStep;
  recordDismissedCareerStep = function(){
    const clubId = Number(game?.selectedClubId || 0);
    const season = Number(game?.seasonNumber || 1);
    const status = game?.gameOver?.type === 'resignation' ? 'resignation' : 'dismissal';
    const current = game?.managerStats?.currentSeason ? { ...game.managerStats.currentSeason } : null;
    const baseline = game?.managerCareerBaselines?.[current?.careerStintId || ''] || null;
    const result = recordDismissedCareerStepV869();
    if(game?.gameOver?.active && clubId && current){
      if(baseline){
        game.managerCareerBaselines = normalizeCareerBaselines(game.managerCareerBaselines || {});
        game.managerCareerBaselines[current.careerStintId] = baseline;
      }
      const careerEvent = (game.managerStats?.careerHistory || []).filter(item => Number(item.clubId) === clubId && Number(item.season) === season && String(item.type) === status).slice(-1)[0];
      managerCareerFinalizeCurrentStint({ status, partial:true, key:`${status}:${careerEvent?.key || `${season}:${clubId}:${current.careerStintId || 'stint'}`}` });
    }
    return result;
  };

  const finalizeSeasonIfNeededV869 = finalizeSeasonIfNeeded;
  finalizeSeasonIfNeeded = function(options={}){
    const before = Boolean(game?.seasonFinalized);
    const result = finalizeSeasonIfNeededV869(options);
    if(!before && game?.seasonFinalized && !game?.seasonTransition?.managerAbsent){
      const record = game.seasonTransition?.userRecord || {};
      const entry = managerCareerFinalizeCurrentStint({ status:'season_end', partial:false, record, movements:game.seasonTransition?.movements || [], key:`season_end:${game.seasonNumber || 1}:${game.selectedClubId}:${game.managerStats?.currentSeason?.careerStintId || 'stint'}` });
      if(entry){
        Object.assign(record, {
          totalTeams:entry.totalTeams,
          qualitativeObjective:entry.objective,
          objectiveStatus:entry.objectiveStatus,
          evaluationScore:entry.evaluationScore,
          evaluationLabel:entry.evaluationLabel,
          evaluationComponents:entry.components,
          careerProfileChange:entry.profileChange
        });
        const legacySeason = (game.managerStats.seasons || []).find(item => Number(item.season) === Number(entry.season) && Number(item.clubId) === Number(entry.clubId));
        if(legacySeason){
          Object.assign(legacySeason, {
            objectiveQualitative:entry.objective,
            objectiveStatus:entry.objectiveStatus,
            evaluationScore:entry.evaluationScore,
            evaluationLabel:entry.evaluationLabel,
            evaluationComponents:entry.components,
            careerProfileChange:entry.profileChange
          });
        }
      }
      managerCareerRecordClubSeasonHistory();
      game.managerStats = normalizeManagerStats(game.managerStats);
      if(typeof saveLocal === 'function') saveLocal(true);
    }
    return result;
  };

  function managerCareerCurrentEntry(){
    const season = Number(game?.seasonNumber || 0);
    const clubId = Number(game?.selectedClubId || 0);
    return (game?.managerStats?.seasonHistory || []).find(item => Number(item.season) === season && Number(item.clubId) === clubId && String(item.status) === 'season_end') || null;
  }

  if(typeof seasonEndPanelMarkup === 'function'){
    const seasonEndPanelMarkupV869 = seasonEndPanelMarkup;
    seasonEndPanelMarkup = function(){
      const html = seasonEndPanelMarkupV869();
      const evaluation = managerCareerCurrentEntry();
      if(!evaluation) return html;
      const markup = managerCareerEvaluationMarkup(evaluation, true);
      return html.replace('<div class="row" style="margin-top:12px">', `${markup}<div class="row" style="margin-top:12px">`);
    };
  }

  if(typeof openSeasonEndModal === 'function'){
    const openSeasonEndModalV869 = openSeasonEndModal;
    openSeasonEndModal = function(){
      const result = openSeasonEndModalV869();
      const modal = document.querySelector('.season-end-modal');
      const entry = managerCareerCurrentEntry();
      if(modal && entry && !modal.querySelector('.career-season-evaluation')){
        const node = document.createElement('div');
        node.innerHTML = managerCareerEvaluationMarkup(entry, false);
        const row = modal.querySelector('.row');
        if(row) modal.insertBefore(node.firstElementChild, row);
        else modal.appendChild(node.firstElementChild);
      }
      return result;
    };
  }

  function careerProfileMomentLabel(value){
    const moment = careerRound(value || 0);
    if(moment >= 70) return 'Momento extraordinario';
    if(moment >= 35) return 'En alza';
    if(moment >= 10) return 'Positivo';
    if(moment > -10) return 'Estable';
    if(moment > -35) return 'En duda';
    if(moment > -70) return 'Mala etapa';
    return 'Crisis profesional';
  }
  function careerCapabilityMarkup(profile){
    return CAPABILITY_KEYS.map(key => {
      const value = careerClamp(careerRound(profile.capabilities?.[key] || 0), 0, 100);
      return `<div class="career-capability"><div><span>${escapeHtml(CAPABILITY_LABELS[key])}</span><strong>${value}</strong></div><div class="career-capability-track"><i style="width:${value}%"></i></div></div>`;
    }).join('');
  }
  function careerSeasonHistoryRows(stats){
    const history = normalizeManagerSeasonHistory(stats?.seasonHistory || []);
    return history.map(item => {
      const delta = Number(item.profileChange?.prestigeDelta || 0);
      const event = item.status === 'dismissal' ? 'Despido' : item.status === 'resignation' ? 'Renuncia' : 'Fin de temporada';
      return `<tr><td>${item.season}</td><td>${clubBadge(item.clubId)} ${escapeHtml(item.clubName || (typeof clubName === 'function' ? clubName(item.clubId) : ''))}</td><td>${escapeHtml(item.objective?.label || '—')}<small>${escapeHtml(item.objective?.minimumLabel || '')}</small></td><td>${careerPositionLabel(item.position)}</td><td><strong>${item.evaluationScore}</strong><small>${escapeHtml(item.evaluationLabel || '')}</small></td><td>${escapeHtml(item.objectiveStatus || '—')}</td><td class="${delta >= 0 ? 'ok' : 'danger'}">${delta >= 0 ? '+' : ''}${delta}</td><td>${event}</td></tr>`;
    }).join('');
  }
  function careerClubHistoryMarkup(){
    const history = normalizeClubSeasonHistory(game?.clubSeasonHistory || {});
    const seasons = Array.from(new Set(history.entries.map(item => Number(item.season || 0)).filter(Boolean))).sort((a,b)=>b-a);
    const latest = seasons[0] || Number(game?.seasonNumber || 1);
    if(clubHistorySeasonFilter === 'latest') clubHistorySeasonFilter = String(latest);
    const visible = history.entries.filter(item => clubHistorySeasonFilter === 'all' || Number(item.season) === Number(clubHistorySeasonFilter)).slice(0, 300);
    const options = [`<option value="all" ${clubHistorySeasonFilter === 'all' ? 'selected' : ''}>Todas las temporadas</option>`]
      .concat(seasons.map(season => `<option value="${season}" ${String(season) === String(clubHistorySeasonFilter) ? 'selected' : ''}>Temporada ${season}</option>`)).join('');
    const rows = visible.map(item => `<tr class="${item.managedByUser ? 'career-managed-club-row' : ''}"><td>${item.season}</td><td>${clubBadge(item.clubId)} ${escapeHtml(item.clubName || '')}${item.managedByUser ? '<small>Dirigido por vos</small>' : ''}</td><td>${escapeHtml(item.divisionName || '—')}</td><td>${careerPositionLabel(item.position)}</td><td>${item.pts}</td><td>${Number(item.ppg || 0).toFixed(2)}</td><td>${item.gf}/${item.gc}</td><td>${item.reputationEnd ?? '—'}${item.reputationDelta ? `<small class="${item.reputationDelta > 0 ? 'ok' : 'danger'}">${item.reputationDelta > 0 ? '+' : ''}${item.reputationDelta}</small>` : ''}</td><td>${item.managerEvaluation ?? '—'}</td></tr>`).join('');
    return `<div class="card career-club-history-card" style="margin-top:14px"><div class="row"><div><h3>Historial anual de clubes</h3><p class="muted small">Rendimiento, reputación y evolución guardados al cierre de cada temporada.</p></div><select id="careerClubHistorySeasonFilter">${options}</select></div><div class="table-wrap"><table><thead><tr><th>Temp.</th><th>Club</th><th>División</th><th>Pos.</th><th>PTS</th><th>PPG</th><th>GF/GC</th><th>Reputación</th><th>Eval. manager</th></tr></thead><tbody>${rows || '<tr><td colspan="9" class="muted">El historial se completará al finalizar la temporada.</td></tr>'}</tbody></table></div></div>`;
  }
  function careerProfileMarkup(){
    game.managerStats = normalizeManagerStats(game.managerStats);
    const profile = game.managerStats.careerProfile;
    const currentObjective = managerCareerQualitativeObjective(game.selectedClubId, game.managerStats.currentSeason?.objectivePpg, { founder:typeof currentGameIsFounderMode === 'function' && currentGameIsFounderMode() });
    const rows = careerSeasonHistoryRows(game.managerStats);
    return `<section class="career-profile-stage-one"><div class="career-profile-summary"><div class="career-profile-main"><span>Prestigio de carrera</span><strong>${profile.prestige}<small>/${careerPrestigeMaximum()}</small></strong><em>Se construye con cada temporada y cada club.</em></div><div class="career-profile-main"><span>Momento profesional</span><strong class="${profile.moment >= 0 ? 'ok' : 'danger'}">${profile.moment >= 0 ? '+' : ''}${profile.moment}</strong><em>${escapeHtml(careerProfileMomentLabel(profile.moment))}</em></div><div class="career-profile-main"><span>Objetivo actual</span><strong>${escapeHtml(currentObjective.label)}</strong><em>${escapeHtml(currentObjective.minimumLabel || 'Sin posición mínima')}</em></div></div><div class="card career-capabilities-card"><h3>Capacidades acumulativas</h3><p class="muted small">No se compran: evolucionan según decisiones y resultados de la carrera.</p><div class="career-capabilities-grid">${careerCapabilityMarkup(profile)}</div></div><div class="card career-season-history-card" style="margin-top:14px"><h3>Evaluaciones de carrera</h3><div class="table-wrap"><table><thead><tr><th>Temp.</th><th>Club</th><th>Objetivo</th><th>Pos.</th><th>Evaluación</th><th>Resultado</th><th>Prestigio</th><th>Cierre</th></tr></thead><tbody>${rows || '<tr><td colspan="8" class="muted">La primera evaluación se guardará al terminar la temporada o al dejar un club.</td></tr>'}</tbody></table></div></div>${careerClubHistoryMarkup()}</section>`;
  }

  const renderManagerStatsV869 = renderManagerStats;
  renderManagerStats = function(){
    renderManagerStatsV869();
    if(String(managerStatsViewMode || 'profile') !== 'profile') return;
    const holder = document.createElement('div');
    holder.innerHTML = careerProfileMarkup();
    if(view.firstChild) view.insertBefore(holder.firstElementChild, view.firstChild.nextSibling || view.firstChild);
    else view.appendChild(holder.firstElementChild);
    document.getElementById('careerClubHistorySeasonFilter')?.addEventListener('change', event => {
      clubHistorySeasonFilter = String(event.target.value || 'all');
      renderManagerStats();
    });
  };

  const renderHomeV869 = renderHome;
  renderHome = function(){
    ensureManagerCareerBaseline({ silent:true });
    const result = renderHomeV869();
    if(typeof currentGameIsFounderMode === 'function' && currentGameIsFounderMode()) return result;
    const info = typeof managerObjectiveProgressInfo === 'function' ? managerObjectiveProgressInfo() : null;
    const objective = info?.qualitative || managerCareerQualitativeObjective(game?.selectedClubId, info?.objective);
    const card = document.querySelector('.office-objective-card');
    if(card && objective){
      const value = card.querySelector('strong');
      if(value) value.textContent = objective.label;
      let meta = card.querySelector('.office-objective-meta');
      if(!meta){ meta = document.createElement('em'); meta.className = 'office-objective-meta'; card.appendChild(meta); }
      const reduction = typeof managerObjectiveReductionForClub === 'function' ? Number(managerObjectiveReductionForClub(game.selectedClubId) || 0) : 0;
      meta.innerHTML = `<span>${escapeHtml(objective.minimumLabel || '')}</span>${reduction > 0 ? `<small>(-${careerRound(reduction)}%)</small>` : ''}`;
      card.classList.add('office-objective-card-qualitative');
    }
    return result;
  };

  window.managerCareerStageOne = {
    version:CAREER_PROFILE_VERSION,
    capabilityLabels:{ ...CAPABILITY_LABELS },
    ensureBaseline:ensureManagerCareerBaseline,
    evaluate:managerCareerEvaluationData,
    qualitativeObjective:managerCareerQualitativeObjective
  };
})();
