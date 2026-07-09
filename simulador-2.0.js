/* Motor de simulación V2.0 · V4.25 estilos sectoriales
   Archivo dedicado a la simulación de partidos y a los factores deportivos que influyen en el resultado.
   Mantiene valores internos ocultos fuera de la interfaz. */
(function(){
  const MATCH_INSTRUCTION_OPTIONS = [
    { value:'lower', label:'Bajar el ritmo' },
    { value:'normal', label:'Normal' },
    { value:'push', label:'Subir ritmo' }
  ];
  const DEFAULT_MATCH_INSTRUCTIONS = { winning:'normal', drawing:'normal', losing:'normal' };
  const INSTRUCTION_EFFECTS = {
    lower:{ attack:0.92, midfield:0.96, defense:1.04, attacks:0.90, conversion:0.94, foul:0.88 },
    normal:{ attack:1.00, midfield:1.00, defense:1.00, attacks:1.00, conversion:1.00, foul:1.00 },
    push:{ attack:1.09, midfield:1.03, defense:0.95, attacks:1.12, conversion:1.06, foul:1.10 }
  };
  const BLOCKS = Array.from({ length:30 }, (_, index) => ({
    from:index * 3 + 1,
    to:index === 29 ? 90 : index * 3 + 3
  }));
  const SIM_PITCH_CONDITIONS = {
    'Excelente': { passDelta:10, chanceMultiplier:1.20, fatigueBonus:0, injuryBonus:0 },
    'Normal': { passDelta:0, chanceMultiplier:1.00, fatigueBonus:0, injuryBonus:0 },
    'Regular': { passDelta:-10, chanceMultiplier:0.80, fatigueBonus:0, injuryBonus:0 },
    'Muy malo': { passDelta:-20, chanceMultiplier:0.70, fatigueBonus:10, injuryBonus:0.10 },
    'Injugable': { passDelta:-50, chanceMultiplier:0.50, fatigueBonus:20, injuryBonus:0.30 }
  };

  function simConfigValue(path, fallback){
    return String(path || '').split('.').reduce((node, key) => (node && Object.prototype.hasOwnProperty.call(node, key)) ? node[key] : undefined, window.GAME_CONFIG || {}) ?? fallback;
  }
  function simConfigNumber(path, fallback, min=null, max=null){
    const raw = Number(simConfigValue(path, fallback));
    let value = Number.isFinite(raw) ? raw : Number(fallback);
    if(Number.isFinite(min)) value = Math.max(min, value);
    if(Number.isFinite(max)) value = Math.min(max, value);
    return value;
  }
  const SIM_TEAM_WEIGHT = simConfigNumber('simulador.pesoColectivo', 0.70, 0, 1);
  const SIM_INDIVIDUAL_WEIGHT = simConfigNumber('simulador.pesoIndividual', 0.30, 0, 1);
  const SIM_SET_PIECE_CHANCE = simConfigNumber('simulador.probabilidadPelotaParada', 0.14, 0, 1);
  const SIM_ERROR_GOAL_RATE = simConfigNumber('simulador.probabilidadErrorTerminaEnGol', 0.28, 0, 1);
  const SIM_GOAL_ERROR_ATTRIBUTION_RATE = simConfigNumber('simulador.probabilidadGolAtribuyeErrorGol', 0.60, 0, 1);
  const SIM_PLAYER_ERROR_SCALE = simConfigNumber('simulador.escalaRiesgoErrorJugador', 0.72, 0, 2);
  const SIM_USE_PLAYER_ERROR_FORMULA = Boolean(simConfigValue('simulador.formulaErroresJugador', true));
  const SIM_MAX_TEAM_ERRORS = Math.round(simConfigNumber('simulador.maximoErroresPorEquipo', 5, 0, 20));

  function simClamp(value,min,max){ return Math.max(min, Math.min(max, value)); }
  function simAvg(values){ const clean = values.filter(v => Number.isFinite(v)); return clean.length ? clean.reduce((a,b)=>a+b,0)/clean.length : 0; }
  function simRnd(min,max){ return min + Math.random() * (max-min); }
  function probabilisticRoundV2(value){
    const safe = Math.max(0, Number(value) || 0);
    const base = Math.floor(safe);
    return base + (Math.random() < safe - base ? 1 : 0);
  }
  function blockDurationFactor(block){
    return simClamp(((Number(block?.to || 0) - Number(block?.from || 0) + 1) || 15) / 15, 0.05, 1);
  }
  function normalizeMatchInstructions(instructions){
    const src = instructions || {};
    const valid = new Set(MATCH_INSTRUCTION_OPTIONS.map(o=>o.value));
    return {
      winning: valid.has(src.winning) ? src.winning : DEFAULT_MATCH_INSTRUCTIONS.winning,
      drawing: valid.has(src.drawing) ? src.drawing : DEFAULT_MATCH_INSTRUCTIONS.drawing,
      losing: valid.has(src.losing) ? src.losing : DEFAULT_MATCH_INSTRUCTIONS.losing
    };
  }

  function normalizeSectorStyleValueV2(value){
    const clean = String(value || '').trim();
    const aliases = { presion:'presion_alta', presionAlta:'presion_alta', presion_alta:'presion_alta', rotacion:'rotacion', rotación:'rotacion', posicional:'posicional', repliegue:'repliegue' };
    const normalized = aliases[clean] || clean;
    return ['presion_alta','rotacion','posicional','repliegue'].includes(normalized) ? normalized : 'posicional';
  }
  function normalizeSectorStylesV2(styles){
    const fallback = (typeof DEFAULT_TACTIC_SECTOR_STYLES !== 'undefined') ? DEFAULT_TACTIC_SECTOR_STYLES : { defense:'posicional', midfield:'posicional', attack:'posicional' };
    const src = styles && typeof styles === 'object' && !Array.isArray(styles) ? styles : {};
    return {
      defense: normalizeSectorStyleValueV2(src.defense || src.defensa || fallback.defense),
      midfield: normalizeSectorStyleValueV2(src.midfield || src.medios || src.medio || fallback.midfield),
      attack: normalizeSectorStyleValueV2(src.attack || src.delanteros || src.delantera || fallback.attack)
    };
  }
  function sectorStyleIntensityV2(){
    return typeof TACTIC_SECTOR_STYLE_EFFECT_INTENSITY !== 'undefined' ? Number(TACTIC_SECTOR_STYLE_EFFECT_INTENSITY || 0.85) : simConfigNumber('tactica.estilosSector.intensidadEfecto', 0.85, 0, 2);
  }
  function simNormalizeMentality(mode){
    const value = String(mode || '').trim();
    const legacy = { posicional:'normal', ataque:'ofensivo', defensiva:'defensivo' };
    const normalized = legacy[value] || value;
    return ['muy_defensivo','defensivo','normal','ofensivo','muy_ofensivo'].includes(normalized) ? normalized : 'normal';
  }
  function simPlayerMentality(player, tactic){
    return simNormalizeMentality(tactic?.playerMentalities?.[player?.id]);
  }
  function simMentalityAttackMultiplier(player, tactic){
    return ({ muy_defensivo:0.82, defensivo:0.92, normal:1, ofensivo:1.10, muy_ofensivo:1.22 })[simPlayerMentality(player, tactic)] || 1;
  }
  function simMentalityDefenseMultiplier(player, tactic){
    return ({ muy_defensivo:1.22, defensivo:1.10, normal:1, ofensivo:0.92, muy_ofensivo:0.82 })[simPlayerMentality(player, tactic)] || 1;
  }
  function pitchEffectV2(pitch){ return SIM_PITCH_CONDITIONS[pitch] || SIM_PITCH_CONDITIONS.Normal; }
  function getTacticForClubV2(clubId){
    if(clubId === game.selectedClubId) return { ...game.tactic, matchInstructions:normalizeMatchInstructions(game.tactic?.matchInstructions), sectorStyles:normalizeSectorStylesV2(game.tactic?.sectorStyles) };
    const club = seed.clubs.find(c=>c.id===clubId) || { reputation:60 };
    const formation = club.reputation > 74 ? '4-3-3' : club.reputation < 61 ? '5-4-1' : '4-4-2';
    return { formation, starters:[], bench:[], autoSubs:[], playerMentalities:{}, matchInstructions:{...DEFAULT_MATCH_INSTRUCTIONS}, sectorStyles:normalizeSectorStylesV2(null) };
  }
  function instructionForScore(tactic, gf, gc){
    const instructions = normalizeMatchInstructions(tactic?.matchInstructions);
    if(gf > gc) return instructions.winning;
    if(gf < gc) return instructions.losing;
    return instructions.drawing;
  }
  function formationProfile(assigned){
    const counts = { gk:0, def:0, mid:0, att:0 };
    (assigned || []).forEach(a => { const g = slotGroup(a.slot); if(counts[g] !== undefined) counts[g]++; });
    const profile = { defense:0, midfield:0, attack:0, possession:0, attacks:0, conversion:0 };
    if(counts.def >= 5){ profile.defense += 5; profile.attack -= 3; profile.attacks -= 1; }
    if(counts.def <= 3){ profile.defense -= 3; profile.attack += 2; profile.attacks += 1; }
    if(counts.mid >= 5){ profile.midfield += 5; profile.possession += 4; profile.attacks += 2; }
    if(counts.mid <= 3){ profile.midfield -= 2; profile.possession -= 2; }
    if(counts.att >= 3){ profile.attack += 5; profile.conversion += 0.035; profile.defense -= 2; }
    if(counts.att <= 1){ profile.attack -= 3; profile.conversion -= 0.025; profile.defense += 2; }
    return { counts, profile };
  }
  function lineAverage(assigned, group, skillGroups){
    const items = assigned.filter(a => slotGroup(a.slot) === group);
    return simAvg(items.map(a => simAvg(skillGroups.map(skill => matchSkill(a.player, skill))) * a.factor));
  }

  function sectorQualityV2(assigned, group, skillGroups){
    return simClamp(lineAverage(assigned, group, skillGroups) / 99, 0, 1);
  }
  function emptySectorStyleEffectsV2(){
    return {
      possessionAdd:0,
      attackMultiplier:1,
      chanceMultiplier:1,
      conversionMultiplier:1,
      foulAdd:0,
      errorRiskMultiplier:1,
      rivalAttackMultiplier:1,
      rivalChanceMultiplier:1,
      rivalConversionMultiplier:1,
      conditionDelta:0,
      labels:[]
    };
  }
  function mul(value, pct, intensity){ return value * (1 + pct * intensity); }
  function addScaled(value, amount, intensity){ return value + amount * intensity; }
  function buildSectorStyleEffectsV2(tactic, assigned){
    const enabled = typeof TACTIC_SECTOR_STYLE_ENABLED === 'undefined' ? true : Boolean(TACTIC_SECTOR_STYLE_ENABLED);
    const effects = emptySectorStyleEffectsV2();
    if(!enabled) return effects;
    const styles = normalizeSectorStylesV2(tactic?.sectorStyles);
    const intensity = sectorStyleIntensityV2();
    const deltas = (typeof TACTIC_STYLE_CONDITION_DELTAS !== 'undefined') ? TACTIC_STYLE_CONDITION_DELTAS : { highPress:-3, rotation:-1, regroup:-1 };
    const defPressQ = sectorQualityV2(assigned, 'def', ['velocidad','resistencia']);
    const defPassQ = sectorQualityV2(assigned, 'def', ['paseCorto','tecnica','serenidad']);
    const defBlockQ = sectorQualityV2(assigned, 'def', ['marca','posicionamiento','fuerza']);
    const midPressQ = sectorQualityV2(assigned, 'mid', ['velocidad','marca','entradas','resistencia']);
    const midPassQ = sectorQualityV2(assigned, 'mid', ['paseCorto','vision','tecnica','trabajoEquipo']);
    const midDefQ = sectorQualityV2(assigned, 'mid', ['paseCorto','marca','posicionamiento']);
    const attPressQ = sectorQualityV2(assigned, 'att', ['velocidad','marca','resistencia']);
    const attPassQ = sectorQualityV2(assigned, 'att', ['paseCorto','vision','tecnica']);
    const attTargetQ = sectorQualityV2(assigned, 'att', ['cabezazo','fuerza','posicionamiento']);
    const attDefQ = sectorQualityV2(assigned, 'att', ['marca','resistencia','trabajoEquipo']);

    if(styles.defense === 'presion_alta'){
      effects.errorRiskMultiplier = mul(effects.errorRiskMultiplier, 0.08 + (1 - defPressQ) * 0.10, intensity);
      effects.rivalAttackMultiplier = mul(effects.rivalAttackMultiplier, -(0.04 + defPressQ * 0.06), intensity);
      effects.rivalChanceMultiplier = mul(effects.rivalChanceMultiplier, -(0.02 + defPressQ * 0.04), intensity);
      effects.foulAdd = addScaled(effects.foulAdd, 0.25 + (1 - defPressQ) * 0.45, intensity);
      effects.conditionDelta += (Number(deltas.highPress ?? -3) * (0.65 + (1 - defPressQ) * 0.35));
    }else if(styles.defense === 'rotacion'){
      effects.possessionAdd = addScaled(effects.possessionAdd, 2 + defPassQ * 3, intensity);
      effects.errorRiskMultiplier = mul(effects.errorRiskMultiplier, 0.05 + (1 - defPassQ) * 0.10, intensity);
    }else if(styles.defense === 'posicional'){
      effects.possessionAdd = addScaled(effects.possessionAdd, 3 + defPassQ * 3, intensity);
      effects.errorRiskMultiplier = mul(effects.errorRiskMultiplier, -(0.06 + defPassQ * 0.05), intensity);
      effects.rivalConversionMultiplier = mul(effects.rivalConversionMultiplier, 0.025, intensity);
    }else if(styles.defense === 'repliegue'){
      effects.possessionAdd = addScaled(effects.possessionAdd, -(2 + defBlockQ * 2), intensity);
      effects.errorRiskMultiplier = mul(effects.errorRiskMultiplier, -(0.10 + defBlockQ * 0.08), intensity);
      effects.rivalAttackMultiplier = mul(effects.rivalAttackMultiplier, -(0.08 + defBlockQ * 0.08), intensity);
      effects.rivalChanceMultiplier = mul(effects.rivalChanceMultiplier, -(0.08 + defBlockQ * 0.10), intensity);
      effects.conditionDelta += Number(deltas.regroup ?? -1) * 0.45;
    }

    if(styles.midfield === 'presion_alta'){
      effects.attackMultiplier = mul(effects.attackMultiplier, 0.04 + midPressQ * 0.07, intensity);
      effects.foulAdd = addScaled(effects.foulAdd, 0.55 + (1 - midPressQ) * 0.45, intensity);
      effects.conditionDelta += Number(deltas.highPress ?? -3) * (0.80 + (1 - midPressQ) * 0.35);
    }else if(styles.midfield === 'rotacion'){
      effects.possessionAdd = addScaled(effects.possessionAdd, 5 + midPassQ * 5, intensity);
      effects.chanceMultiplier = mul(effects.chanceMultiplier, -(0.04 + (1 - midPassQ) * 0.05), intensity);
      effects.conditionDelta += Number(deltas.rotation ?? -1) * 0.35;
    }else if(styles.midfield === 'posicional'){
      effects.possessionAdd = addScaled(effects.possessionAdd, 5 + midPassQ * 5, intensity);
      effects.errorRiskMultiplier = mul(effects.errorRiskMultiplier, -(0.04 + midPassQ * 0.06), intensity);
    }else if(styles.midfield === 'repliegue'){
      effects.possessionAdd = addScaled(effects.possessionAdd, 3 + midDefQ * 4, intensity);
      effects.attackMultiplier = mul(effects.attackMultiplier, -(0.08 + (1 - midDefQ) * 0.05), intensity);
      effects.chanceMultiplier = mul(effects.chanceMultiplier, -(0.08 + (1 - midDefQ) * 0.06), intensity);
      effects.conditionDelta += Number(deltas.regroup ?? -1) * 0.35;
    }

    if(styles.attack === 'presion_alta'){
      effects.attackMultiplier = mul(effects.attackMultiplier, 0.05 + attPressQ * 0.07, intensity);
      effects.foulAdd = addScaled(effects.foulAdd, 0.55 + (1 - attPressQ) * 0.55, intensity);
      effects.conditionDelta += Number(deltas.highPress ?? -3) * (0.75 + (1 - attPressQ) * 0.35);
    }else if(styles.attack === 'rotacion'){
      effects.possessionAdd = addScaled(effects.possessionAdd, -3, intensity);
      effects.attackMultiplier = mul(effects.attackMultiplier, -0.08, intensity);
      effects.chanceMultiplier = mul(effects.chanceMultiplier, 0.08 + attPassQ * 0.10, intensity);
      effects.conditionDelta += Number(deltas.rotation ?? -1) * 0.35;
    }else if(styles.attack === 'posicional'){
      effects.attackMultiplier = mul(effects.attackMultiplier, 0.05 + attTargetQ * 0.08, intensity);
      effects.possessionAdd = addScaled(effects.possessionAdd, -(2 + (1 - attTargetQ) * 2), intensity);
    }else if(styles.attack === 'repliegue'){
      effects.possessionAdd = addScaled(effects.possessionAdd, 4 + attDefQ * 3, intensity);
      effects.attackMultiplier = mul(effects.attackMultiplier, -0.22, intensity);
      effects.chanceMultiplier = mul(effects.chanceMultiplier, -0.25, intensity);
      effects.conditionDelta += Number(deltas.regroup ?? -1) * 0.55;
    }

    effects.attackMultiplier = simClamp(effects.attackMultiplier, 0.62, 1.38);
    effects.chanceMultiplier = simClamp(effects.chanceMultiplier, 0.55, 1.45);
    effects.conversionMultiplier = simClamp(effects.conversionMultiplier, 0.70, 1.30);
    effects.errorRiskMultiplier = simClamp(effects.errorRiskMultiplier, 0.58, 1.55);
    effects.rivalAttackMultiplier = simClamp(effects.rivalAttackMultiplier, 0.62, 1.22);
    effects.rivalChanceMultiplier = simClamp(effects.rivalChanceMultiplier, 0.58, 1.22);
    effects.rivalConversionMultiplier = simClamp(effects.rivalConversionMultiplier, 0.80, 1.22);
    effects.foulAdd = simClamp(effects.foulAdd, -1.2, 2.4);
    effects.conditionDelta = simClamp(effects.conditionDelta, -9, 3);
    effects.styles = styles;
    return effects;
  }
  function teamPowerV2(clubId, tactic, options={}){
    const formation = tactic?.formation || '4-4-2';
    const lineup = selectLineup(clubId, tactic);
    const slots = FORMATIONS[formation] || FORMATIONS['4-4-2'];
    const assigned = lineup.map((player, i) => ({ player, slot:slots[i] || player.position, factor:zoneFactor(player, slots[i] || player.position) }));
    const { counts, profile } = formationProfile(assigned);
    const gk = assigned.find(a => a.slot === 'POR');
    const defenseQuality = lineAverage(assigned, 'def', ['marca','entradas','posicionamiento','fuerza']);
    const midfieldQuality = lineAverage(assigned, 'mid', ['paseCorto','vision','tecnica','trabajoEquipo']);
    const attackQuality = lineAverage(assigned, 'att', ['remate','regate','velocidad','serenidad','posicionamiento']);
    const keeperQuality = gk ? simAvg(['porteria','posicionamiento','serenidad'].map(skill => matchSkill(gk.player, skill) * gk.factor)) : 38;
    const adjust = applyMentalityBonus(tactic || {}, assigned);
    const crowdBonus = simClamp(Math.round(Number(options.crowdBonus || 0)), 0, 99);
    const cohesionRaw = typeof cohesionValue === 'function' ? cohesionValue(clubId) : Number(game?.teamCohesion?.[clubId] || 50);
    const boostedCohesionRaw = simClamp(cohesionRaw + crowdBonus, 0, 100);
    const cohesion = boostedCohesionRaw <= 30
      ? simClamp(0.50 + (boostedCohesionRaw / 30) * 0.20, 0.50, 0.70)
      : boostedCohesionRaw <= 50
        ? simClamp(0.70 + ((boostedCohesionRaw - 30) / 20) * 0.30, 0.70, 1.00)
        : simClamp(1.00 + ((boostedCohesionRaw - 50) / 50) * 0.20, 1.00, 1.20);
    const boostedMorale = simClamp(squadMoraleAverage(clubId) + crowdBonus, 1, 99);
    const teamMorale = simClamp(0.94 + (boostedMorale / 99) * 0.12, 0.94, 1.06);
    const crowdConditionMultiplier = 1 + (crowdBonus / 99) * 0.08;
    const countBoost = {
      defense: counts.def * 1.25,
      midfield: counts.mid * 1.35,
      attack: counts.att * 1.55
    };
    const styleEffects = buildSectorStyleEffectsV2(tactic, assigned);
    const defense = (defenseQuality + countBoost.defense + profile.defense + adjust.defense + keeperQuality * 0.12) * cohesion * teamMorale * crowdConditionMultiplier;
    const midfield = (midfieldQuality + countBoost.midfield + profile.midfield + adjust.midfield) * cohesion * teamMorale * crowdConditionMultiplier;
    const attack = (attackQuality + countBoost.attack + profile.attack + adjust.attack) * cohesion * teamMorale * crowdConditionMultiplier;
    const discipline = simAvg(lineup.map(p=>p.skills.disciplina));
    const stamina = simAvg(lineup.map(p=>matchSkill(p,'resistencia'))) * cohesion * teamMorale * crowdConditionMultiplier;
    const aggression = simAvg(lineup.map(p=>hiddenStats(p).aggression));
    const rep = seed.clubs.find(c=>c.id===clubId)?.reputation || 60;
    return {
      clubId, tactic, formation, lineup, assigned, counts, profile:profile,
      defense, midfield, attack, keeper:keeperQuality * cohesion * teamMorale * crowdConditionMultiplier,
      crowdBonus,
      defenseQuality, midfieldQuality, attackQuality, keeperQuality,
      styleEffects,
      discipline, stamina, aggression, reputation:rep
    };
  }
  function makeMatchContextV2(match){
    const weatherOptions = ['Soleado', 'Nublado', 'Lluvia leve', 'Lluvia intensa', 'Viento moderado', 'Calor húmedo'];
    const weather = weatherOptions[hashNumber(`${match.id}-weather-${game?.matchdayIndex || 0}`, weatherOptions.length)];
    const homeClub = seed.clubs.find(c=>c.id===match.homeId);
    const awayClub = seed.clubs.find(c=>c.id===match.awayId);
    const pitchScore = fieldScoreForClub(match.homeId);
    const pitch = fieldConditionName(pitchScore);
    const effect = pitchEffectV2(pitch);
    const attendance = typeof attendanceContextForMatch === 'function'
      ? attendanceContextForMatch(match)
      : { homeFans:Math.max(800, Math.round((homeClub?.reputation || 60) * simRnd(210,360))), awayFans:Math.max(120, Math.round((awayClub?.reputation || 60) * simRnd(18,70))), totalFans:0, capacity:0, homeCrowdBonus:0, ticketPrice:0, ticketRevenue:0 };
    return { weather, pitch, pitchScore, ...attendance, pitchEffect:effect };
  }
  function blockStatsForTeam(own, rival, context, ownInstruction, rivalInstruction, isHome, block=null){
    const effect = pitchEffectV2(context.pitch);
    const phaseFactor = blockDurationFactor(block);
    const ownInstr = INSTRUCTION_EFFECTS[ownInstruction] || INSTRUCTION_EFFECTS.normal;
    const rivalInstr = INSTRUCTION_EFFECTS[rivalInstruction] || INSTRUCTION_EFFECTS.normal;
    const pitchPass = effect.passDelta;
    const pitchChance = effect.chanceMultiplier;
    const ownStyle = own.styleEffects || emptySectorStyleEffectsV2();
    const rivalStyle = rival.styleEffects || emptySectorStyleEffectsV2();
    const effectiveMid = simClamp((own.midfield * ownInstr.midfield) + pitchPass + own.profile.possession + ownStyle.possessionAdd, 1, 150);
    const rivalMid = simClamp((rival.midfield * rivalInstr.midfield) + pitchPass + rival.profile.possession + rivalStyle.possessionAdd, 1, 150);
    const possession = simClamp(Math.round((effectiveMid / Math.max(1, effectiveMid + rivalMid)) * 100 + (isHome ? 2 : -1) + simRnd(-4,4)), 28, 72);
    const midfieldAttack = effectiveMid / 17;
    const attackPressure = (own.attack * ownInstr.attack) / 22;
    const defenseBrake = (rival.defense * rivalInstr.defense) / 34;
    const baseAttacks = 3.5 + midfieldAttack + attackPressure - defenseBrake + own.profile.attacks + (possession - 50) / 12 + (isHome ? 0.6 : 0) + simRnd(-1.6,1.9);
    const fullBlockAttacks = simClamp(baseAttacks * ownInstr.attacks * ownStyle.attackMultiplier * rivalStyle.rivalAttackMultiplier, 0, 13);
    const attacks = simClamp(probabilisticRoundV2(fullBlockAttacks * phaseFactor), 0, 5);
    const forwardCount = Math.max(1, own.counts.att || 1);
    const defenderCount = Math.max(1, rival.counts.def || 1);
    const chanceRate = simClamp(
      0.220 + (own.attackQuality - rival.defenseQuality) / 500 + forwardCount * 0.022 + own.profile.conversion - defenderCount * 0.004 - (rival.keeperQuality / 2600),
      0.10,
      0.42
    ) * ownInstr.conversion * pitchChance * ownStyle.chanceMultiplier * rivalStyle.rivalChanceMultiplier;
    const pressureEdge = (own.attack - rival.defense) / 155;
    const chanceNoise = simRnd(-0.08,0.12) * phaseFactor;
    const expectedChances = Math.max(0, attacks * chanceRate + pressureEdge * phaseFactor + chanceNoise);
    const chances = simClamp(probabilisticRoundV2(expectedChances), 0, 3);
    const xgPerChance = simClamp((0.14 + (own.attackQuality - rival.keeperQuality) / 650 + forwardCount * 0.018 - defenderCount * 0.009) * ownStyle.conversionMultiplier * rivalStyle.rivalConversionMultiplier, 0.05, 0.46);
    const xg = simClamp(chances * xgPerChance + (fullBlockAttacks > 8 ? 0.04 * phaseFactor : 0) + (isHome ? 0.03 * phaseFactor : 0), 0, 0.55);
    const fullBlockFouls = Math.max(0, 1.1 + own.aggression/46 + (100-own.discipline)/62 + ownStyle.foulAdd + (ownInstruction === 'push' ? 0.55 : ownInstruction === 'lower' ? -0.35 : 0) + simRnd(-0.7,0.9));
    const fouls = simClamp(probabilisticRoundV2(fullBlockFouls * phaseFactor), 0, 3);
    return { attacks, chances, possession, fouls, passScore:Math.round(effectiveMid), xg };
  }
  function mergeBlockStats(total, block){
    total.attacks += block.attacks;
    total.chances += block.chances;
    total.fouls += block.fouls;
    total.xg += block.xg;
    total.passScore += block.passScore;
    total.possessionWeighted += block.possession;
  }
  function emptyStats(){ return { attacks:0, chances:0, possession:50, fouls:0, passScore:0, xg:0, possessionWeighted:0, keySaves:0, errors:0, goalErrors:0 }; }
  function finalizeStats(stats){
    return {
      attacks:simClamp(Math.round(stats.attacks), 1, 75),
      chances:simClamp(Math.round(stats.chances), 0, 18),
      possession:simClamp(Math.round(stats.possessionWeighted / BLOCKS.length), 20, 80),
      fouls:simClamp(Math.round(stats.fouls), 0, 32),
      passScore:simClamp(Math.round(stats.passScore / BLOCKS.length), 1, 140),
      xg:Number(stats.xg.toFixed(2)),
      keySaves:Math.round(Number(stats.keySaves || 0)),
      errors:Math.round(Number(stats.errors || 0)),
      goalErrors:Math.round(Number(stats.goalErrors || 0))
    };
  }
  function poissonV2(lambda){
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return simClamp(k - 1, 0, 7);
  }
  function weightedPickV2(items, weightFn){
    const safeItems = (items || []).filter(Boolean);
    const weighted = safeItems.map(item=>({item, w:Math.max(1, weightFn(item))}));
    const total = weighted.reduce((a,x)=>a+x.w,0);
    let r = Math.random()*total;
    for(const x of weighted){ r -= x.w; if(r<=0) return x.item; }
    return weighted[0]?.item;
  }
  function playerRoleCodeV2(player){
    const pos = String(player?.position || '').toUpperCase();
    if(pos === 'POR') return 'gk';
    if(['DC','ED','EI'].includes(pos)) return 'att';
    if(['MCO','MC','MCD'].includes(pos)) return 'mid';
    return 'def';
  }
  function scorerWeightV2(player, setPiece=false, tactic=null){
    if(!player) return 1;
    if(player.position === 'POR') return 0.05;
    const pos = String(player.position || '').toUpperCase();
    if(setPiece){
      const setPieceBonus = pos === 'DC' ? 110 : ['DFC','LD','LI'].includes(pos) ? 72 : ['ED','EI','MCO'].includes(pos) ? 46 : ['MC','MCD'].includes(pos) ? 28 : 12;
      const starMul = typeof playerStarReferenceMultiplier === 'function' ? playerStarReferenceMultiplier(player, 'goal') : 1;
      return (effectiveSkill(player,'cabezazo') * 1.18 + effectiveSkill(player,'fuerza') * 0.35 + effectiveSkill(player,'posicionamiento') * 0.70 + effectiveSkill(player,'serenidad') * 0.35 + setPieceBonus) * starMul * simMentalityAttackMultiplier(player, tactic);
    }
    const posBonus = pos === 'DC' ? 160 : ['ED','EI'].includes(pos) ? 118 : pos === 'MCO' ? 72 : pos === 'MC' ? 28 : pos === 'MCD' ? 9 : 2;
    const rolePenalty = ['DFC','LD','LI'].includes(pos) ? 0.28 : pos === 'MCD' ? 0.55 : 1;
    const starMul = typeof playerStarReferenceMultiplier === 'function' ? playerStarReferenceMultiplier(player, 'goal') : 1;
    return (effectiveSkill(player,'remate') * 1.55 + effectiveSkill(player,'posicionamiento') * 1.20 + effectiveSkill(player,'serenidad') * 0.55 + currentMorale(player.id) * 0.20 + posBonus) * rolePenalty * starMul * simMentalityAttackMultiplier(player, tactic);
  }
  function cardWeightV2(player){
    if(!player) return 1;
    if(player.position === 'POR') return 0.35;
    const roleBonus = ['DFC','MCD'].includes(player.position) ? 30 : ['LD','LI'].includes(player.position) ? 20 : player.position === 'MC' ? 12 : 6;
    return hiddenStats(player).aggression * 0.75 + (100 - effectiveSkill(player,'disciplina')) * 0.30 + roleBonus;
  }
  function selectChanceShooterV2(power, setPiece=false){
    const outfield = (power.lineup || []).filter(p => p.position !== 'POR');
    const scorerPool = outfield.length ? outfield : power.lineup;
    return weightedPickV2(scorerPool, p => scorerWeightV2(p, setPiece, power.tactic));
  }
  function goalkeeperFromPowerV2(power){
    return (power.lineup || []).find(p => p.position === 'POR') || null;
  }
  function defensivePlayerWeightV2(player, tactic=null){
    if(!player || player.position === 'POR') return 1;
    const pos = String(player.position || '').toUpperCase();
    const roleBonus = ['DFC','LD','LI'].includes(pos) ? 95 : pos === 'MCD' ? 68 : pos === 'MC' ? 34 : 14;
    return (effectiveSkill(player,'marca') * 0.95 + effectiveSkill(player,'entradas') * 0.90 + effectiveSkill(player,'posicionamiento') * 0.70 + effectiveSkill(player,'serenidad') * 0.28 + roleBonus) * simMentalityDefenseMultiplier(player, tactic);
  }
  function playerErrorSecurityV2(player, clubId){
    if(!player) return 0.50;
    const morale = simClamp(Number(currentMorale(player.id) || 0), 0, 100);
    const condition = simClamp(Number(currentCondition(player.id) || 0), 0, 100);
    const overall = simClamp(Number(effectiveOverall(player) || player.overall || 0), 0, 100);
    const cohesion = simClamp(Number(typeof cohesionValue === 'function' ? cohesionValue(clubId || player.clubId) : game?.teamCohesion?.[clubId || player.clubId] || 50), 0, 100);
    return simClamp((morale + condition + overall + cohesion) / 400, 0, 1);
  }
  function playerErrorRiskV2(player, clubId){
    // Corrección lógica: la fórmula de 0 a 1 se toma como seguridad. El riesgo es el complemento.
    return simClamp(1 - playerErrorSecurityV2(player, clubId), 0.01, 0.95);
  }
  function errorPlayerWeightV2(player, clubId){
    if(!player) return 1;
    const pos = String(player.position || '').toUpperCase();
    const rolePressure = pos === 'POR' ? 58 : ['DFC','LD','LI'].includes(pos) ? 46 : pos === 'MCD' ? 27 : 12;
    return Math.max(1, rolePressure + playerErrorRiskV2(player, clubId) * 140);
  }
  function pickErrorPlayerV2(defending, defendingClubId){
    const keeper = goalkeeperFromPowerV2(defending);
    const defenderPool = (defending.lineup || []).filter(p => p.position !== 'POR');
    return weightedPickV2([keeper].concat(defenderPool).filter(Boolean), p => errorPlayerWeightV2(p, defendingClubId));
  }
  function registerErrorEventV2(rivalTotals, incidents, defending, defendingClubId, attackingClubId, minute, isGoal){
    if(Number(rivalTotals.errors || 0) >= SIM_MAX_TEAM_ERRORS) return null;
    const errorPlayer = pickErrorPlayerV2(defending, defendingClubId);
    const event = { clubId:defendingClubId, playerId:errorPlayer?.id || null, minute, goal:Boolean(isGoal), causedBy:attackingClubId };
    rivalTotals.errors = Number(rivalTotals.errors || 0) + 1;
    if(isGoal) rivalTotals.goalErrors = Number(rivalTotals.goalErrors || 0) + 1;
    incidents.errors.push(event);
    return event;
  }
  function makeGoalV2(clubId, lineup, minute, details={}){
    const scorer = details.scorer || selectChanceShooterV2({ lineup }, Boolean(details.setPiece));
    if(!scorer) return { clubId, playerId:null, assistId:null, minute, setPiece:Boolean(details.setPiece), errorGoal:Boolean(details.errorGoal), errorById:details.errorById || null, chanceQuality:Number(details.chanceQuality || 0) };
    const possibleAssisters = lineup.filter(p=>p.id !== scorer?.id && p.position !== 'POR');
    const hasAssist = !details.errorGoal && Math.random() < (details.setPiece ? 0.58 : 0.72);
    const assister = hasAssist ? weightedPickV2(possibleAssisters, p => {
      const starMul = typeof playerStarReferenceMultiplier === 'function' ? playerStarReferenceMultiplier(p, 'assist') : 1;
      return (effectiveSkill(p,'paseCorto') + effectiveSkill(p,'vision') + (['ED','EI','MCO','MC'].includes(p.position)?30:6)) * starMul * simMentalityAttackMultiplier(p, details.tactic);
    }) : null;
    return {
      clubId,
      playerId:scorer.id,
      assistId:assister?.id || null,
      minute,
      setPiece:Boolean(details.setPiece),
      errorGoal:Boolean(details.errorGoal),
      errorById:details.errorById || null,
      chanceQuality:Number(details.chanceQuality || 0)
    };
  }
  function resolveChanceV2(attacking, defending, attackingClubId, defendingClubId, minute, baseGoalProb, homeOrAwayTotals, rivalTotals, incidents){
    const setPiece = Math.random() < SIM_SET_PIECE_CHANCE;
    const shooter = selectChanceShooterV2(attacking, setPiece);
    if(!shooter) return null;
    const defenderPool = (defending.lineup || []).filter(p => p.position !== 'POR');
    const defender = weightedPickV2(defenderPool, p => defensivePlayerWeightV2(p, defending.tactic));
    const keeper = goalkeeperFromPowerV2(defending);
    const shooterStarMul = typeof playerStarReferenceMultiplier === 'function' ? playerStarReferenceMultiplier(shooter, 'goal') : 1;
    const shooterScore = simAvg([
      effectiveSkill(shooter,'remate') * 1.15,
      effectiveSkill(shooter,'posicionamiento'),
      effectiveSkill(shooter,'serenidad'),
      setPiece ? effectiveSkill(shooter,'cabezazo') * 1.15 : effectiveSkill(shooter,'regate') * 0.85,
      currentMorale(shooter.id) * 0.45
    ]) * shooterStarMul;
    const defenderScore = defender ? simAvg([
      effectiveSkill(defender,'marca'),
      effectiveSkill(defender,'entradas'),
      effectiveSkill(defender,'posicionamiento'),
      effectiveSkill(defender,'serenidad') * 0.55
    ]) : 44;
    const keeperStarMul = keeper && typeof playerStarReferenceMultiplier === 'function' ? playerStarReferenceMultiplier(keeper, 'save') : 1;
    const keeperScore = keeper ? simAvg([
      effectiveSkill(keeper,'porteria') * 1.35,
      effectiveSkill(keeper,'posicionamiento'),
      effectiveSkill(keeper,'serenidad') * 0.85,
      currentMorale(keeper.id) * 0.35
    ]) * keeperStarMul * simMentalityDefenseMultiplier(keeper, defending.tactic) : 38;
    const individualGoalProb = simClamp(0.16 + (shooterScore - (keeperScore * 0.56 + defenderScore * 0.44)) / 150 + (setPiece ? 0.015 : 0), 0.025, 0.72);
    const collectiveWeight = simClamp(SIM_TEAM_WEIGHT, 0, 1);
    const individualWeight = simClamp(SIM_INDIVIDUAL_WEIGHT, 0, 1);
    const divisor = Math.max(0.01, collectiveWeight + individualWeight);
    const goalProb = simClamp(((baseGoalProb * collectiveWeight) + (individualGoalProb * individualWeight)) / divisor, 0.018, 0.78);
    const defensiveSafety = keeper ? keeperScore * 0.55 + defenderScore * 0.45 : defenderScore;
    const errorCandidate = pickErrorPlayerV2(defending, defendingClubId);
    const rawPlayerRisk = SIM_USE_PLAYER_ERROR_FORMULA ? playerErrorRiskV2(errorCandidate, defendingClubId) : simClamp(0.015 + (74 - defensiveSafety) / 1200 + baseGoalProb * 0.035 + (setPiece ? 0.008 : 0), 0.004, 0.12);
    const playerRisk = rawPlayerRisk * ((defending.styleEffects && Number(defending.styleEffects.errorRiskMultiplier)) || 1);
    const teamErrors = Number(rivalTotals.errors || 0);
    const errorChance = teamErrors >= SIM_MAX_TEAM_ERRORS ? 0 : simClamp(playerRisk * SIM_PLAYER_ERROR_SCALE + baseGoalProb * 0.03 + (setPiece ? 0.006 : 0), 0.003, 0.42);
    const goal = Math.random() < goalProb;
    let errorEvent = null;
    let errorGoal = false;
    if(goal){
      errorGoal = Math.random() < SIM_GOAL_ERROR_ATTRIBUTION_RATE;
      if(errorGoal) errorEvent = registerErrorEventV2(rivalTotals, incidents, defending, defendingClubId, attackingClubId, minute, true);
      return makeGoalV2(attackingClubId, attacking.lineup, minute, { scorer:shooter, setPiece, errorGoal:Boolean(errorEvent), errorById:errorEvent?.playerId || null, chanceQuality:goalProb, tactic:attacking.tactic });
    }
    if(Math.random() < errorChance){
      registerErrorEventV2(rivalTotals, incidents, defending, defendingClubId, attackingClubId, minute, false);
    }
    const saveBase = simClamp((0.28 + (keeperScore - shooterScore) / 240 + baseGoalProb * 0.75) * (keeperStarMul > 1 ? 1 + ((keeperStarMul - 1) * 0.45) : 1), 0.08, 0.88);
    if(keeper && (baseGoalProb >= 0.11 || individualGoalProb >= 0.22) && Math.random() < saveBase){
      rivalTotals.keySaves = Number(rivalTotals.keySaves || 0) + 1;
      incidents.keySaves.push({ clubId:defendingClubId, playerId:keeper.id, minute, chanceById:shooter.id, chanceQuality:Number(goalProb.toFixed(2)) });
    }
    return null;
  }
  function makeCardsV2(clubId, power, fouls){
    const cards = [];
    const yellowCount = simClamp(poissonV2(fouls / 7.6), 0, 6);
    const byPlayer = new Map();
    for(let i=0;i<yellowCount;i++){
      const p = weightedPickV2(power.lineup, cardWeightV2);
      if(!p) continue;
      const current = byPlayer.get(p.id) || 0;
      byPlayer.set(p.id, current + 1);
      if(current === 0) cards.push({ clubId, playerId:p.id, type:'yellow', minute:Math.floor(simRnd(5,88)) });
      else cards.push({ clubId, playerId:p.id, type:'secondYellowRed', minute:Math.floor(simRnd(35,90)) });
    }
    const directRedCandidates = power.lineup.filter(p => p.position !== 'POR' && hiddenStats(p).aggression >= 76);
    const directChance = simClamp((power.aggression - 60) / 290, 0.005, 0.13);
    if(directRedCandidates.length && Math.random() < directChance){
      const p = weightedPickV2(directRedCandidates, cardWeightV2);
      cards.push({ clubId, playerId:p.id, type:'red', minute:Math.floor(simRnd(20,90)) });
    }
    return cards.sort((a,b)=>a.minute-b.minute);
  }
  function makeInjuriesV2(clubId, ownPower, context){
    const injuries = [];
    const candidates = (ownPower.lineup || []).filter(player => !isUnavailable(player.id));
    candidates.forEach(player => {
      const chance = injuryChanceForPlayer(player.id, context.pitch);
      if(Math.random() < chance){
        const injury = pickInjuryType();
        const matchesOut = Math.floor(simRnd(injury.minTurns, injury.maxTurns + 1));
        const duringMatch = Math.random() < 0.72;
        injuries.push({
          clubId,
          playerId:player.id,
          type:'injury',
          name:injury.name,
          injuryLabel:injury.name,
          probability:injury.probability,
          chance:Math.round(chance * 100),
          matchesOut,
          minute:duringMatch ? Math.floor(simRnd(8,89)) : 90,
          phase:duringMatch ? 'durante' : 'final'
        });
      }
    });
    return injuries.sort((a,b)=>a.minute-b.minute);
  }
  function finalResultKey(gf, gc){
    if(gf > gc) return 'winning';
    if(gf < gc) return 'losing';
    return 'drawing';
  }
  function instructionConditionDelta(tactic, gf, gc, starterIds){
    const instructions = normalizeMatchInstructions(tactic?.matchInstructions);
    const state = finalResultKey(gf, gc);
    const selected = instructions[state];
    let delta = 0;
    if(state === 'winning' && selected === 'lower') delta = 2;
    if(state === 'winning' && selected === 'push') delta = -5;
    if(state === 'drawing' && selected === 'lower') delta = 1;
    if(state === 'drawing' && selected === 'push') delta = -1;
    if(state === 'losing' && selected === 'lower') delta = 5;
    if(state === 'losing' && selected === 'push') delta = -5;
    const result = {};
    if(delta !== 0) (starterIds || []).forEach(id => result[id] = delta);
    return result;
  }

  function sectorStyleConditionDelta(power, starterIds){
    const delta = Math.round(Number(power?.styleEffects?.conditionDelta || 0));
    const result = {};
    if(delta !== 0) (starterIds || []).forEach(id => result[id] = delta);
    return result;
  }
  function mergeConditionDeltas(...objects){
    const merged = {};
    objects.forEach(obj => Object.entries(obj || {}).forEach(([id, delta]) => { merged[id] = (merged[id] || 0) + delta; }));
    return merged;
  }
  function simulateMatch(match){
    const homeTactic = getTacticForClubV2(match.homeId);
    const awayTactic = getTacticForClubV2(match.awayId);
    applyTacticCohesionPenalty(match.homeId, homeTactic);
    applyTacticCohesionPenalty(match.awayId, awayTactic);
    const matchContext = makeMatchContextV2(match);
    const home = teamPowerV2(match.homeId, homeTactic, { crowdBonus:matchContext.homeCrowdBonus || 0 });
    const away = teamPowerV2(match.awayId, awayTactic, { crowdBonus:0 });
    const homeTotals = emptyStats();
    const awayTotals = emptyStats();
    const incidents = { keySaves:[], errors:[] };
    const goals = [];
    let homeGoals = 0;
    let awayGoals = 0;
    for(const block of BLOCKS){
      const homeInstruction = instructionForScore(homeTactic, homeGoals, awayGoals);
      const awayInstruction = instructionForScore(awayTactic, awayGoals, homeGoals);
      const h = blockStatsForTeam(home, away, matchContext, homeInstruction, awayInstruction, true, block);
      const a = blockStatsForTeam(away, home, matchContext, awayInstruction, homeInstruction, false, block);
      mergeBlockStats(homeTotals, h);
      mergeBlockStats(awayTotals, a);
      let hGoals = 0;
      let aGoals = 0;
      const hBaseProb = h.chances > 0 ? simClamp(h.xg / Math.max(1, h.chances), 0.025, 0.70) : 0;
      const aBaseProb = a.chances > 0 ? simClamp(a.xg / Math.max(1, a.chances), 0.025, 0.70) : 0;
      for(let i=0;i<h.chances;i++){
        const goal = resolveChanceV2(home, away, match.homeId, match.awayId, Math.floor(simRnd(block.from, block.to + 1)), hBaseProb, homeTotals, awayTotals, incidents);
        if(goal){ goals.push(goal); hGoals++; }
      }
      for(let i=0;i<a.chances;i++){
        const goal = resolveChanceV2(away, home, match.awayId, match.homeId, Math.floor(simRnd(block.from, block.to + 1)), aBaseProb, awayTotals, homeTotals, incidents);
        if(goal){ goals.push(goal); aGoals++; }
      }
      homeGoals += hGoals;
      awayGoals += aGoals;
    }
    goals.sort((a,b)=>a.minute-b.minute);
    const matchStats = { home:finalizeStats(homeTotals), away:finalizeStats(awayTotals) };
    matchStats.away.possession = 100 - matchStats.home.possession;
    const cards = [...makeCardsV2(match.homeId, home, matchStats.home.fouls), ...makeCardsV2(match.awayId, away, matchStats.away.fouls)].sort((a,b)=>a.minute-b.minute);
    const injuries = [...makeInjuriesV2(match.homeId, home, matchContext), ...makeInjuriesV2(match.awayId, away, matchContext)].sort((a,b)=>a.minute-b.minute);
    const regularSubs = [
      ...makeSubstitutions(match.homeId, homeTactic, goals),
      ...makeSubstitutions(match.awayId, awayTactic, goals)
    ];
    const injurySubs = [
      ...makeInjurySubstitutions(match.homeId, homeTactic, injuries, regularSubs),
      ...makeInjurySubstitutions(match.awayId, awayTactic, injuries, regularSubs)
    ];
    const substitutions = [...regularSubs, ...injurySubs].sort((a,b)=>a.minute-b.minute);
    const starterIdsHome = home.lineup.map(p=>p.id);
    const starterIdsAway = away.lineup.map(p=>p.id);
    const playedIdsHome = [...new Set(starterIdsHome.concat(substitutions.filter(s=>s.clubId===match.homeId).map(s=>s.inId)))];
    const playedIdsAway = [...new Set(starterIdsAway.concat(substitutions.filter(s=>s.clubId===match.awayId).map(s=>s.inId)))];
    if(!match.friendly){
      applyMatchCohesionResult(match, substitutions, cards);
      applyResultToTables(match, homeGoals, awayGoals);
      applyPlayerStats(match.homeId, home.lineup, substitutions, goals, cards, injuries, incidents.keySaves, incidents.errors);
      applyPlayerStats(match.awayId, away.lineup, substitutions, goals, cards, injuries, incidents.keySaves, incidents.errors);
      applyAvailability(cards, injuries);
      if(typeof updatePlayerStarTrackingForMatch === 'function'){
        updatePlayerStarTrackingForMatch({ ...match, played:true, homeGoals, awayGoals, goals, cards, injuries, substitutions, keySaves:incidents.keySaves, errors:incidents.errors, starterIdsHome, starterIdsAway, playedIdsHome, playedIdsAway });
      }
    }
    const instructionConditionDeltas = mergeConditionDeltas(
      instructionConditionDelta(homeTactic, homeGoals, awayGoals, starterIdsHome),
      instructionConditionDelta(awayTactic, awayGoals, homeGoals, starterIdsAway),
      sectorStyleConditionDelta(home, starterIdsHome),
      sectorStyleConditionDelta(away, starterIdsAway)
    );
    return { ...match, played:true, engine:'simulador-2.0-jugadorista', starterIdsHome, starterIdsAway, homeGoals, awayGoals, goals, cards, injuries, substitutions, keySaves:incidents.keySaves, errors:incidents.errors, matchStats, matchContext, playedIdsHome, playedIdsAway, instructionConditionDeltas };
  }

  window.MATCH_INSTRUCTION_OPTIONS = MATCH_INSTRUCTION_OPTIONS;
  window.DEFAULT_MATCH_INSTRUCTIONS = DEFAULT_MATCH_INSTRUCTIONS;
  window.Simulator20 = { simulateMatch, pitchEffect:pitchEffectV2, normalizeMatchInstructions, normalizeSectorStyles:normalizeSectorStylesV2 };
})();
