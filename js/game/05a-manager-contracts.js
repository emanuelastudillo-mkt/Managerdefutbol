/* V7.65 · Contratos, sueldo y patrimonio personal del manager. */

function managerContractBalanceConfig(){
  const cfg = window.GAME_BALANCE_MANAGER?.contratosManager;
  return cfg && typeof cfg === 'object' && !Array.isArray(cfg) ? cfg : {};
}
function managerContractStatePrestige(state=game){
  if(state?.managerStats && typeof managerPrestigeBreakdown === 'function') return clamp(Number(managerPrestigeBreakdown(state.managerStats).total || 0), 0, 99);
  return clamp(Number(MANAGER_PRESTIGE_INITIAL || 0), 0, 99);
}
function managerContractNegotiationLevel(value='normal'){
  const level = String(value || 'normal').toLowerCase();
  return ['prudente','normal','ambicioso'].includes(level) ? level : 'normal';
}
function managerContractNegotiationConfig(level='normal'){
  const cfg = managerContractBalanceConfig();
  const clean = managerContractNegotiationLevel(level);
  const fallback = {
    prudente:{ label:'Objetivo prudente', objectiveDelta:-0.10, salaryFactor:0.80 },
    normal:{ label:'Objetivo normal', objectiveDelta:0, salaryFactor:1 },
    ambicioso:{ label:'Objetivo ambicioso', objectiveDelta:0.20, salaryFactor:1.25 }
  }[clean];
  const raw = cfg.negociacionObjetivo?.[clean] || {};
  return {
    key:clean,
    label:String(raw.label || fallback.label),
    objectiveDelta:Number.isFinite(Number(raw.objectiveDelta)) ? Number(raw.objectiveDelta) : fallback.objectiveDelta,
    salaryFactor:Number.isFinite(Number(raw.salaryFactor)) ? Number(raw.salaryFactor) : fallback.salaryFactor
  };
}
function managerContractDurationSalaryFactor(duration=1){
  const cfg = managerContractBalanceConfig();
  const clean = clamp(Math.round(Number(duration || 1)), 1, 3);
  const fallback = clean === 1 ? 1 : clean === 2 ? 0.95 : 0.90;
  const value = Number(cfg.factorSueldoPorDuracion?.[clean] ?? cfg.factorSueldoPorDuracion?.[String(clean)]);
  return Number.isFinite(value) ? clamp(value, 0.5, 1.5) : fallback;
}
function managerContractDivisionBaseSalary(clubId){
  const cfg = managerContractBalanceConfig();
  const order = clamp(Math.round(Number(clubDivision(clubId)?.order || 3)), 1, 3);
  const fallback = order === 1 ? 6000000 : order === 2 ? 3000000 : 1500000;
  const value = Number(cfg.sueldoBaseMensualPorDivision?.[order] ?? cfg.sueldoBaseMensualPorDivision?.[String(order)]);
  return Math.max(100000, Math.round(Number.isFinite(value) ? value : fallback));
}
function managerContractLeagueBudgets(clubId, state=game){
  const targetClub = seed?.clubs?.find(item => Number(item.id) === Number(clubId));
  const divisionId = String(targetClub?.divisionId || 'default');
  return (seed?.clubs || [])
    .filter(item => String(item.divisionId || 'default') === divisionId)
    .map(item => Math.max(1, Math.round(Number(state?.clubBudgets?.[item.id] ?? item.budget ?? 1))));
}
function managerContractWealthFactor(clubId, state=game){
  const cfg = managerContractBalanceConfig();
  const budgets = managerContractLeagueBudgets(clubId, state);
  const club = seed?.clubs?.find(item => Number(item.id) === Number(clubId));
  const current = Math.max(1, Math.round(Number(state?.clubBudgets?.[clubId] ?? club?.budget ?? 1)));
  const average = budgets.length ? budgets.reduce((sum,value)=>sum+value,0) / budgets.length : current;
  const ratio = Math.max(0.05, current / Math.max(1, average));
  const min = Number.isFinite(Number(cfg.factorEconomicoMin)) ? Number(cfg.factorEconomicoMin) : 0.75;
  const max = Number.isFinite(Number(cfg.factorEconomicoMax)) ? Number(cfg.factorEconomicoMax) : 1.25;
  return clamp(0.90 + (Math.log2(ratio) * 0.12), min, max);
}
function managerContractBaseMonthlySalary(clubId, state=game, managerPrestige=managerContractStatePrestige(state)){
  const cfg = managerContractBalanceConfig();
  const base = managerContractDivisionBaseSalary(clubId);
  const prestigeMin = Number.isFinite(Number(cfg.factorPrestigioManagerMin)) ? Number(cfg.factorPrestigioManagerMin) : 0.60;
  const prestigeMax = Number.isFinite(Number(cfg.factorPrestigioManagerMax)) ? Number(cfg.factorPrestigioManagerMax) : 1.50;
  const managerFactor = prestigeMin + ((prestigeMax - prestigeMin) * (clamp(Number(managerPrestige || 0), 0, 99) / 99));
  const clubMin = Number.isFinite(Number(cfg.factorReputacionClubMin)) ? Number(cfg.factorReputacionClubMin) : 0.70;
  const clubMax = Number.isFinite(Number(cfg.factorReputacionClubMax)) ? Number(cfg.factorReputacionClubMax) : 1.30;
  const clubFactor = clubMin + ((clubMax - clubMin) * (clubPrestigeValue(clubId) / 99));
  return Math.max(100000, Math.round(base * managerFactor * clubFactor * managerContractWealthFactor(clubId, state)));
}
function managerContractDurationForOffer(club, options={}, state=game){
  if(String(options.contractType || '') === 'high_risk') return 1;
  const cfg = managerContractBalanceConfig();
  const prestige = managerContractStatePrestige(state);
  const fit = prestige - clubPrestigeValue(club);
  const roll = hashNumber(`manager-contract-duration-${state?.saveCode || ''}-${state?.seasonNumber || 1}-${club?.id || 0}-${options.source || ''}`, 100);
  const table = fit >= 15
    ? (cfg.duracionProbabilidadManagerSuperior || { one:15, two:45, three:40 })
    : fit >= -5
      ? (cfg.duracionProbabilidadEquilibrada || { one:35, two:45, three:20 })
      : (cfg.duracionProbabilidadExigente || { one:70, two:25, three:5 });
  const one = clamp(Math.round(Number(table.one ?? table[1] ?? 35)), 0, 100);
  const two = clamp(Math.round(Number(table.two ?? table[2] ?? 45)), 0, 100);
  if(roll < one) return 1;
  if(roll < one + two) return 2;
  return 3;
}
function managerContractFutureSalePercent(club, salt='', state=game){
  const cfg = managerContractBalanceConfig();
  const min = clamp(Math.round(Number(cfg.porcentajeVentaFuturaMin ?? 5)), 0, 100);
  const max = clamp(Math.round(Number(cfg.porcentajeVentaFuturaMax ?? 20)), min, 100);
  const reputation = clubPrestigeValue(club);
  const base = max - Math.round((reputation / 99) * (max - min));
  const variation = hashNumber(`manager-future-percent-${state?.saveCode || ''}-${club?.id || 0}-${salt}`, 3) - 1;
  return clamp(base + variation, min, max);
}
function managerContractObjectiveSchedule(finalObjective, duration=1, startSeason=game?.seasonNumber || 1, clubId=game?.selectedClubId){
  const cfg = managerContractBalanceConfig();
  const cleanDuration = clamp(Math.round(Number(duration || 1)), 1, 3);
  const divisionLimits = managerObjectiveLimitsForDivision(clubDivision(clubId));
  const fallbackOffsets = cleanDuration === 1 ? [0] : cleanDuration === 2 ? [-0.20, 0] : [-0.30, -0.15, 0];
  const configured = cfg.escalonesObjetivo?.[cleanDuration] || cfg.escalonesObjetivo?.[String(cleanDuration)];
  const offsets = Array.isArray(configured) && configured.length === cleanDuration ? configured.map(Number) : fallbackOffsets;
  return offsets.map((offset,index) => {
    const isFinal = index === cleanDuration - 1;
    const objectivePpg = clamp(Number(finalObjective || 0) + Number(offset || 0), divisionLimits.min, Math.max(divisionLimits.max, Number(finalObjective || divisionLimits.max)));
    return {
      season:Number(startSeason || 1) + index,
      contractYear:index + 1,
      type:isFinal ? 'final' : 'minimum',
      objectivePpg:Number(objectivePpg.toFixed(3)),
      label:isFinal ? 'Objetivo final' : `Mínimo año ${index + 1}`
    };
  });
}
function managerContractOfferTerms(offer={}, negotiationLevel='normal', state=game){
  const club = seed?.clubs?.find(item => Number(item.id) === Number(offer.clubId));
  if(!club) return null;
  const highRisk = String(offer.contractType || '') === 'high_risk';
  const duration = highRisk ? 1 : clamp(Math.round(Number(offer.durationSeasons || 1)), 1, 3);
  const negotiation = highRisk
    ? { key:'ambicioso', label:'Contrato exigente', objectiveDelta:Number(offer.objectiveBonus || 0.25), salaryFactor:1.30 }
    : managerContractNegotiationConfig(negotiationLevel);
  const baseObjective = Number.isFinite(Number(offer.baseObjectivePpg)) ? Number(offer.baseObjectivePpg) : Number(managerObjectiveBaseForClubDivision(club.id));
  const limits = managerObjectiveLimitsForDivision(clubDivision(club.id));
  const finalObjective = clamp(baseObjective + Number(negotiation.objectiveDelta || 0), limits.min, Math.max(limits.max, baseObjective + 0.50));
  const startSeason = Number(state?.seasonNumber || 1);
  const annualObjectives = managerContractObjectiveSchedule(finalObjective, duration, startSeason, club.id);
  const baseMonthly = managerContractBaseMonthlySalary(club.id, state, Number(offer.managerPrestigeAtOffer ?? managerContractStatePrestige(state)));
  const monthlySalary = Math.max(100000, Math.round(baseMonthly * managerContractDurationSalaryFactor(duration) * Number(negotiation.salaryFactor || 1)));
  return {
    clubId:Number(club.id),
    durationSeasons:duration,
    startSeason,
    endSeason:startSeason + duration - 1,
    negotiationLevel:negotiation.key,
    negotiationLabel:negotiation.label,
    baseObjectivePpg:Number(baseObjective.toFixed(3)),
    finalObjectivePpg:Number(finalObjective.toFixed(3)),
    annualObjectives,
    monthlySalary,
    annualSalary:monthlySalary * 12,
    futureSalePercent:clamp(Math.round(Number(offer.futureSalePercent ?? managerContractFutureSalePercent(club, offer.id || '', state))), 5, 20),
    durationSalaryFactor:managerContractDurationSalaryFactor(duration),
    salaryFactor:Number(negotiation.salaryFactor || 1),
    highRisk
  };
}
function managerContractScheduleEntry(contract, season=game?.seasonNumber || 1){
  const list = Array.isArray(contract?.annualObjectives) ? contract.annualObjectives : [];
  return list.find(item => Number(item.season) === Number(season)) || null;
}
function managerContractActiveForSeason(contract, clubId=game?.selectedClubId, season=game?.seasonNumber || 1){
  if(!contract || typeof contract !== 'object') return false;
  return String(contract.status || 'active') === 'active'
    && Number(contract.clubId || 0) === Number(clubId || 0)
    && Number(season || 1) >= Number(contract.startSeason || contract.season || 1)
    && Number(season || 1) <= Number(contract.endSeason || contract.season || 1);
}
function normalizeManagerJobContract(contract, state=game){
  if(!contract || typeof contract !== 'object' || Array.isArray(contract)) return null;
  const clubId = Number(contract.clubId || state?.selectedClubId || 0);
  const club = seed?.clubs?.find(item => Number(item.id) === clubId);
  if(!club) return null;
  const startSeason = Math.max(1, Math.round(Number(contract.startSeason || contract.season || state?.seasonNumber || 1)));
  const duration = clamp(Math.round(Number(contract.durationSeasons || ((Number(contract.endSeason || startSeason) - startSeason) + 1) || 1)), 1, 3);
  const pseudoOffer = {
    id:String(contract.offerId || contract.id || `contract-${clubId}-${startSeason}`),
    clubId,
    contractType:String(contract.contractType || 'normal'),
    durationSeasons:duration,
    managerPrestigeAtOffer:Number(contract.managerPrestigeAtSigning ?? managerContractStatePrestige(state)),
    baseObjectivePpg:Number(contract.baseObjectivePpg ?? managerObjectiveBaseForClubDivision(clubId)),
    objectiveBonus:Number(contract.objectiveBonus || 0.25),
    futureSalePercent:Number(contract.futureSalePercent ?? managerContractFutureSalePercent(club, contract.id || '', state))
  };
  const terms = managerContractOfferTerms(pseudoOffer, contract.negotiationLevel || (pseudoOffer.contractType === 'high_risk' ? 'ambicioso' : 'normal'), { ...state, seasonNumber:startSeason });
  const annualObjectives = Array.isArray(contract.annualObjectives) && contract.annualObjectives.length === duration
    ? contract.annualObjectives.map((item,index)=>({
      season:Number(item.season || startSeason + index),
      contractYear:Number(item.contractYear || index + 1),
      type:String(item.type || (index === duration - 1 ? 'final' : 'minimum')),
      objectivePpg:Number(item.objectivePpg ?? terms.annualObjectives[index]?.objectivePpg ?? terms.finalObjectivePpg),
      label:String(item.label || (index === duration - 1 ? 'Objetivo final' : `Mínimo año ${index + 1}`))
    }))
    : terms.annualObjectives;
  return {
    id:String(contract.id || `manager-contract-${clubId}-${startSeason}-${String(contract.signedDate || 'legacy').replace(/[^0-9A-Za-z_-]/g,'')}`),
    offerId:String(contract.offerId || ''),
    clubId,
    clubName:String(contract.clubName || club.name || 'Club'),
    contractType:String(contract.contractType || 'normal'),
    source:String(contract.source || 'legacy'),
    status:String(contract.status || 'active'),
    signedDate:validIsoDate(contract.signedDate) ? contract.signedDate : (state?.currentDate || currentCalendarDate?.() || ''),
    startSeason,
    durationSeasons:duration,
    endSeason:startSeason + duration - 1,
    negotiationLevel:managerContractNegotiationLevel(contract.negotiationLevel || terms.negotiationLevel),
    negotiationLabel:String(contract.negotiationLabel || terms.negotiationLabel),
    managerPrestigeAtSigning:Number(contract.managerPrestigeAtSigning ?? pseudoOffer.managerPrestigeAtOffer),
    baseObjectivePpg:Number(contract.baseObjectivePpg ?? terms.baseObjectivePpg),
    finalObjectivePpg:Number(contract.finalObjectivePpg ?? terms.finalObjectivePpg),
    annualObjectives,
    monthlySalary:Math.max(100000, Math.round(Number(contract.monthlySalary ?? terms.monthlySalary))),
    futureSalePercent:clamp(Math.round(Number(contract.futureSalePercent ?? terms.futureSalePercent)), 5, 20),
    nextSalaryDate:validIsoDate(contract.nextSalaryDate) ? contract.nextSalaryDate : addDaysToIsoDate(validIsoDate(contract.signedDate) ? contract.signedDate : (state?.currentDate || currentCalendarDate()), 30),
    lastSalaryPaidDate:validIsoDate(contract.lastSalaryPaidDate) ? contract.lastSalaryPaidDate : '',
    salaryPayments:Math.max(0, Math.round(Number(contract.salaryPayments || 0))),
    totalSalaryPaid:Math.max(0, Math.round(Number(contract.totalSalaryPaid || 0))),
    transferBudgetRate:Number.isFinite(Number(contract.transferBudgetRate)) ? Number(contract.transferBudgetRate) : null
  };
}
function createManagerJobContractFromOffer(clubId, offer={}, negotiationLevel='normal', state=game){
  const club = seed?.clubs?.find(item => Number(item.id) === Number(clubId));
  if(!club) return null;
  const normalizedOffer = {
    ...offer,
    id:String(offer.id || `direct-contract-${club.id}-${state?.seasonNumber || 1}`),
    clubId:Number(club.id),
    contractType:String(offer.contractType || 'normal'),
    durationSeasons:clamp(Math.round(Number(offer.durationSeasons || managerContractDurationForOffer(club, offer, state))), 1, 3),
    managerPrestigeAtOffer:Number(offer.managerPrestigeAtOffer ?? managerContractStatePrestige(state)),
    baseObjectivePpg:Number(offer.baseObjectivePpg ?? managerObjectiveBaseForClubDivision(club.id)),
    futureSalePercent:Number(offer.futureSalePercent ?? managerContractFutureSalePercent(club, offer.id || '', state))
  };
  const terms = managerContractOfferTerms(normalizedOffer, negotiationLevel, state);
  if(!terms) return null;
  const signedDate = validIsoDate(state?.currentDate) ? state.currentDate : currentCalendarDate();
  return normalizeManagerJobContract({
    id:`manager-contract-${club.id}-${terms.startSeason}-${Date.now()}`,
    offerId:normalizedOffer.id,
    clubId:Number(club.id),
    clubName:String(club.name || 'Club'),
    contractType:normalizedOffer.contractType,
    source:String(normalizedOffer.source || 'direct'),
    status:'active',
    signedDate,
    startSeason:terms.startSeason,
    durationSeasons:terms.durationSeasons,
    endSeason:terms.endSeason,
    negotiationLevel:terms.negotiationLevel,
    negotiationLabel:terms.negotiationLabel,
    managerPrestigeAtSigning:normalizedOffer.managerPrestigeAtOffer,
    baseObjectivePpg:terms.baseObjectivePpg,
    finalObjectivePpg:terms.finalObjectivePpg,
    annualObjectives:terms.annualObjectives,
    monthlySalary:terms.monthlySalary,
    futureSalePercent:terms.futureSalePercent,
    nextSalaryDate:addDaysToIsoDate(signedDate, 30),
    lastSalaryPaidDate:'',
    salaryPayments:0,
    totalSalaryPaid:0,
    transferBudgetRate:normalizedOffer.transferBudgetRate
  }, state);
}
function ensureManagerFinancesState(state=game){
  if(!state) return null;
  const src = state.managerFinances && typeof state.managerFinances === 'object' && !Array.isArray(state.managerFinances) ? state.managerFinances : {};
  state.managerFinances = {
    balance:Math.round(Number(src.balance || 0)),
    totalIncome:Math.max(0, Math.round(Number(src.totalIncome || 0))),
    totalExpenses:Math.max(0, Math.round(Number(src.totalExpenses || 0))),
    totalSalaryIncome:Math.max(0, Math.round(Number(src.totalSalaryIncome || 0))),
    history:Array.isArray(src.history) ? src.history.slice(-500) : []
  };
  state.managerContractHistory = Array.isArray(state.managerContractHistory) ? state.managerContractHistory.slice(-100) : [];
  return state.managerFinances;
}
function recordManagerFinanceChange(delta, concept, meta={}, state=game){
  const finances = ensureManagerFinancesState(state);
  if(!finances) return 0;
  const amount = Math.round(Number(delta || 0));
  finances.balance += amount;
  if(amount >= 0) finances.totalIncome += amount;
  else finances.totalExpenses += Math.abs(amount);
  if(String(meta.type || '') === 'manager_salary') finances.totalSalaryIncome += Math.max(0, amount);
  finances.history.push({
    id:`manager-finance-${Date.now()}-${hashNumber(`${concept}-${state?.currentDate || ''}-${amount}`,99999)}`,
    date:state?.currentDate || '',
    season:Number(state?.seasonNumber || 1),
    concept:String(concept || 'Movimiento personal'),
    delta:amount,
    balance:finances.balance,
    ...meta
  });
  finances.history = finances.history.slice(-500);
  return amount;
}
function archiveManagerJobContract(reason='ended', state=game){
  if(!state?.managerJobContract) return null;
  ensureManagerFinancesState(state);
  const contract = normalizeManagerJobContract(state.managerJobContract, state);
  if(!contract) { state.managerJobContract = null; return null; }
  const archived = { ...contract, status:'ended', endReason:String(reason || 'ended'), endedDate:state.currentDate || '', endedSeason:Number(state.seasonNumber || 1) };
  if(!state.managerContractHistory.some(item => String(item.id) === String(archived.id))) state.managerContractHistory.push(archived);
  state.managerContractHistory = state.managerContractHistory.slice(-100);
  state.managerJobContract = null;
  return archived;
}
function ensureActiveManagerJobContract(state=game, options={}){
  if(!state || state.gameOver?.active || state.founderMode || state.challenge) return null;
  ensureManagerFinancesState(state);
  const clubId = Number(state.selectedClubId || 0);
  if(!clubId) return null;
  const current = normalizeManagerJobContract(state.managerJobContract, state);
  if(current && managerContractActiveForSeason(current, clubId, state.seasonNumber || 1)){
    state.managerJobContract = current;
    return current;
  }
  if(current) archiveManagerJobContract(options.reason || 'expired', state);
  const club = seed?.clubs?.find(item => Number(item.id) === clubId);
  if(!club) return null;
  const duration = options.initial ? 1 : managerContractDurationForOffer(club, { source:options.source || 'renewal', contractType:'normal' }, state);
  state.managerJobContract = createManagerJobContractFromOffer(clubId, {
    id:`auto-contract-${clubId}-${state.seasonNumber || 1}-${Date.now()}`,
    source:options.source || 'renewal',
    contractType:'normal',
    durationSeasons:duration,
    managerPrestigeAtOffer:managerContractStatePrestige(state),
    baseObjectivePpg:managerObjectiveBaseForClubDivision(clubId),
    futureSalePercent:managerContractFutureSalePercent(club, `${state.seasonNumber || 1}-${options.source || ''}`, state)
  }, options.negotiationLevel || 'normal', state);
  return state.managerJobContract;
}
function processManagerSalaryDaily(){
  if(!game || game.gameOver?.active || game.founderMode || game.challenge) return 0;
  const contract = ensureActiveManagerJobContract(game, { source:'daily_migration' });
  if(!contract || !managerContractActiveForSeason(contract, game.selectedClubId, game.seasonNumber)) return 0;
  const today = validIsoDate(game.currentDate) ? game.currentDate : currentCalendarDate();
  if(!validIsoDate(today) || !validIsoDate(contract.nextSalaryDate)) return 0;
  let total = 0;
  let guard = 0;
  while(daysBetweenIsoDates(contract.nextSalaryDate, today) >= 0 && guard < 24){
    const paymentDate = contract.nextSalaryDate;
    const salary = Math.max(0, Math.round(Number(contract.monthlySalary || 0)));
    if(salary > 0){
      if(typeof recordBudgetChange === 'function') recordBudgetChange(-salary, `Sueldo mensual del manager`, { type:'manager_salary_expense', managerContractId:contract.id, paymentDate });
      recordManagerFinanceChange(salary, `Sueldo de ${clubName(contract.clubId)}`, { type:'manager_salary', clubId:contract.clubId, contractId:contract.id, paymentDate });
      contract.salaryPayments += 1;
      contract.totalSalaryPaid += salary;
      contract.lastSalaryPaidDate = paymentDate;
      total += salary;
    }
    contract.nextSalaryDate = addDaysToIsoDate(paymentDate, 30);
    guard += 1;
  }
  game.managerJobContract = contract;
  if(total > 0){
    pushGameMessage({ type:'finanzas', priority:'normal', title:'Sueldo del manager acreditado', body:`${clubName(contract.clubId)} pagó ${formatMoney(total)}. El dinero ingresó en tu Cuenta Bancaria personal.`, id:`manager-salary-${contract.id}-${contract.lastSalaryPaidDate}` });
  }
  return total;
}
function managerContractScheduleMarkup(schedule=[]){
  return `<div class="manager-contract-schedule">${schedule.map(item => `<div class="manager-contract-year ${item.type === 'final' ? 'is-final' : ''}"><span>Año ${Number(item.contractYear || 1)}</span><strong>${Number(item.objectivePpg || 0).toFixed(2)} PPG</strong><small>${escapeHtml(item.type === 'final' ? 'Objetivo final' : 'Mínimo de continuidad')}</small></div>`).join('')}</div>`;
}
function managerContractOfferPreviewMarkup(offer, level='normal'){
  const terms = managerContractOfferTerms(offer, level, game);
  if(!terms) return '';
  const durationDiscount = Math.round((1 - terms.durationSalaryFactor) * 100);
  return `<div class="manager-contract-preview">
    <div class="grid cols-3 compact-team-stats">
      <div><span>Sueldo mensual</span><strong>${formatMoney(terms.monthlySalary)}</strong></div>
      <div><span>Duración</span><strong>${terms.durationSeasons} temporada${terms.durationSeasons === 1 ? '' : 's'}</strong></div>
      <div><span>Venta futura</span><strong>${terms.futureSalePercent}%</strong></div>
    </div>
    ${managerContractScheduleMarkup(terms.annualObjectives)}
    <p class="muted small">${durationDiscount > 0 ? `El contrato largo reduce ${durationDiscount}% el sueldo mensual a cambio de estabilidad. ` : ''}El porcentaje de venta futura lo fija el club y no se negocia.</p>
  </div>`;
}

/* Amplía las ofertas laborales existentes con duración, sueldo y porcentaje futuro. */
const normalizeManagerJobMarketStateV764 = normalizeManagerJobMarketState;
normalizeManagerJobMarketState = function(state={}){
  const normalized = normalizeManagerJobMarketStateV764(state);
  normalized.offers = normalized.offers.map(offer => {
    const club = seed?.clubs?.find(item => Number(item.id) === Number(offer.clubId));
    if(!club) return offer;
    return {
      ...offer,
      durationSeasons:clamp(Math.round(Number(offer.durationSeasons || managerContractDurationForOffer(club, offer, game))), 1, 3),
      baseObjectivePpg:Number.isFinite(Number(offer.baseObjectivePpg)) ? Number(offer.baseObjectivePpg) : Number(managerObjectiveBaseForClubDivision(club.id)),
      futureSalePercent:clamp(Math.round(Number(offer.futureSalePercent ?? managerContractFutureSalePercent(club, offer.id || '', game))), 5, 20)
    };
  });
  return normalized;
};
managerJobCreateOffer = function(clubId, options={}){
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
  offer.durationSeasons = managerContractDurationForOffer(club, offer, game);
  offer.baseObjectivePpg = Number(managerObjectiveBaseForClubDivision(club.id));
  offer.futureSalePercent = managerContractFutureSalePercent(club, offer.id, game);
  state.offers.push(offer);
  state.log.push({ type:'offer', clubId:offer.clubId, contractType, durationSeasons:offer.durationSeasons, date:today, source:offer.source });
  return offer;
};
managerJobOfferObjectiveDetails = function(offer, clubId=offer?.clubId, negotiationLevel='normal'){
  const terms = managerContractOfferTerms(offer, negotiationLevel, game);
  if(!terms) return { objectiveText:'Sin objetivo', restrictionText:'', baseLabel:'—', finalLabel:'—', highRisk:false, budgetRate:null };
  const highRisk = terms.highRisk;
  const restrictionText = highRisk
    ? `Restricción de fichajes: presupuesto muy limitado, aprox. ${Math.round(clamp(Number(offer?.transferBudgetRate || 0.05), 0.01, 1) * 100)}% del margen normal autorizado.`
    : 'Restricción de fichajes: condiciones normales del club.';
  return {
    objectiveText:`Objetivo final: ${terms.finalObjectivePpg.toFixed(2)} pts/partido.`,
    restrictionText,
    baseLabel:terms.baseObjectivePpg.toFixed(2),
    finalLabel:terms.finalObjectivePpg.toFixed(2),
    highRisk,
    budgetRate:highRisk ? clamp(Number(offer?.transferBudgetRate || 0.05), 0.01, 1) : null,
    terms
  };
};
managerJobOfferCard = function(offer){
  const club = seed?.clubs?.find(c => Number(c.id) === Number(offer.clubId));
  if(!club) return '';
  const division = clubDivision(club.id);
  const highRisk = String(offer.contractType || '') === 'high_risk';
  const tag = highRisk ? 'Contrato exigente' : `${Number(offer.durationSeasons || 1)} temporada${Number(offer.durationSeasons || 1) === 1 ? '' : 's'}`;
  const defaultLevel = highRisk ? 'ambicioso' : 'normal';
  return `<article class="card job-offer-card ${highRisk ? 'warn' : ''}" data-job-offer-card="${escapeHtml(offer.id)}">
    <div class="row"><div><p class="label">Oferta laboral · vence ${escapeHtml(offer.expiresDate || '—')}</p><h3>${escapeHtml(club.name || 'Club')}</h3></div><span class="pill ${highRisk ? 'warn' : 'ok'}">${escapeHtml(tag)}</span></div>
    <p class="muted small">${escapeHtml(division?.name || 'Liga')} · Prestigio ${clubPrestigeValue(club)} · El club fija ${Number(offer.futureSalePercent || 5)}% sobre la futura primera venta de juveniles promovidos durante este contrato.</p>
    ${highRisk ? '<p class="small"><strong>La diferencia de prestigio impone un objetivo ambicioso y un contrato de una sola temporada.</strong></p>' : `<label class="job-negotiation-label">Negociar objetivo y sueldo<select data-job-negotiation="${escapeHtml(offer.id)}"><option value="prudente">Prudente · objetivo menor · sueldo -20%</option><option value="normal" selected>Normal · objetivo y sueldo base</option><option value="ambicioso">Ambicioso · objetivo mayor · sueldo +25%</option></select></label>`}
    <div data-job-offer-preview="${escapeHtml(offer.id)}">${managerContractOfferPreviewMarkup(offer, defaultLevel)}</div>
    <div class="row message-actions"><button class="primary" data-accept-job-offer="${escapeHtml(offer.id)}">Aceptar cargo</button><button class="ghost" data-reject-job-offer="${escapeHtml(offer.id)}">Rechazar</button></div>
  </article>`;
};
bindManagerJobMarketActions = function(){
  document.querySelectorAll('[data-accept-job-offer]').forEach(btn => btn.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    const offerId = btn.dataset.acceptJobOffer || '';
    const select = document.querySelector(`[data-job-negotiation="${CSS.escape(offerId)}"]`);
    acceptManagerJobOffer(offerId, select?.value || 'normal');
  }));
  document.querySelectorAll('[data-reject-job-offer]').forEach(btn => btn.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    rejectManagerJobOffer(btn.dataset.rejectJobOffer || '');
  }));
  document.querySelectorAll('[data-apply-job-club]').forEach(btn => btn.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    applyForManagerJob(Number(btn.dataset.applyJobClub || 0));
  }));
  document.querySelectorAll('[data-job-negotiation]').forEach(select => select.addEventListener('change', () => {
    const offerId = select.dataset.jobNegotiation || '';
    const state = ensureManagerJobMarketState();
    const offer = state.offers.find(item => String(item.id) === String(offerId));
    const target = document.querySelector(`[data-job-offer-preview="${CSS.escape(offerId)}"]`);
    if(offer && target) target.innerHTML = managerContractOfferPreviewMarkup(offer, select.value || 'normal');
  }));
};
acceptManagerJobOffer = function(offerId, negotiationLevel='normal'){
  const state = ensureManagerJobMarketState();
  const offer = state.offers.find(item => String(item.id) === String(offerId));
  if(!offer){ showNotice('La oferta ya no está disponible.'); return; }
  continueCareerAtClub(offer.clubId, {
    jobOffer:offer,
    contractNegotiationLevel:String(offer.contractType || '') === 'high_risk' ? 'ambicioso' : managerContractNegotiationLevel(negotiationLevel),
    allowHighRiskContract:String(offer.contractType || '') === 'high_risk'
  });
};
managerJobContractForClubSeason = function(clubId=game?.selectedClubId, season=game?.seasonNumber || 1){
  const contract = normalizeManagerJobContract(game?.managerJobContract, game);
  if(!managerContractActiveForSeason(contract, clubId, season)) return null;
  if(game) game.managerJobContract = contract;
  return contract;
};
applyManagerJobContractToObjectiveFields = function(fields, clubId=game?.selectedClubId, season=game?.seasonNumber || 1){
  const clean = { ...(fields || {}) };
  const contract = managerJobContractForClubSeason(clubId, season);
  if(!contract) return clean;
  const step = managerContractScheduleEntry(contract, season);
  if(!step) return clean;
  clean.objectiveBasePpg = Number(contract.baseObjectivePpg || clean.objectiveBasePpg || 0);
  clean.objectivePpg = Number(step.objectivePpg || clean.objectivePpg || 0);
  clean.objectiveJobContractBonus = Number((clean.objectivePpg - clean.objectiveBasePpg).toFixed(3));
  clean.objectiveSource = step.type === 'final' ? 'contrato_objetivo_final' : 'contrato_minimo_anual';
  clean.objectiveExpectation = step.type === 'final' ? 'Objetivo final del contrato' : 'Mínimo de continuidad contractual';
  clean.objectiveLabel = `${clean.objectivePpg.toFixed(2)} · ${step.type === 'final' ? 'objetivo final' : `mínimo año ${step.contractYear}`}`;
  clean.objectiveContractId = contract.id;
  clean.objectiveContractYear = Number(step.contractYear || 1);
  clean.objectiveContractDuration = Number(contract.durationSeasons || 1);
  return clean;
};

const renderCareerJobsV764 = renderCareerJobs;
renderCareerJobs = function(){
  if(game?.gameOver?.active){ renderCareerJobsV764(); return; }
  const contract = ensureActiveManagerJobContract(game, { source:'contract_view' });
  if(!contract){ renderCareerJobsV764(); return; }
  game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber, game.selectedClubId);
  const step = managerContractScheduleEntry(contract, game.seasonNumber);
  const objectiveInfo = managerObjectiveProgressInfo();
  const played = Number(objectiveInfo?.played || 0);
  const ppg = Number(objectiveInfo?.ppg || 0);
  const currentYear = Number(game.seasonNumber || 1) - Number(contract.startSeason || 1) + 1;
  const restriction = contract.contractType === 'high_risk'
    ? `Presupuesto de fichajes limitado al ${Math.round(Number(contract.transferBudgetRate || 0.05) * 100)}% del margen normal.`
    : 'Sin restricciones especiales sobre el presupuesto de fichajes.';
  view.innerHTML = `<div class="row section-title"><div><h2>Contrato actual</h2><p class="tagline">Sueldo, duración y objetivos acordados con el club.</p></div><span class="pill">Año ${currentYear} de ${contract.durationSeasons}</span></div>
    <div class="grid cols-4 compact-team-stats">
      <div class="card"><p class="label">Club</p><strong>${clubBadge(contract.clubId)} ${escapeHtml(clubName(contract.clubId))}</strong></div>
      <div class="card"><p class="label">Sueldo mensual</p><strong>${formatMoney(contract.monthlySalary)}</strong></div>
      <div class="card"><p class="label">Próximo pago</p><strong>${escapeHtml(contract.nextSalaryDate || '—')}</strong></div>
      <div class="card"><p class="label">Futura venta juvenil</p><strong>${Number(contract.futureSalePercent || 0)}%</strong></div>
    </div>
    <div class="card" style="margin-top:14px"><div class="row"><div><p class="label">Plan deportivo</p><h3>${escapeHtml(contract.negotiationLabel || 'Objetivo normal')}</h3></div><span class="pill">Hasta temporada ${contract.endSeason}</span></div>${managerContractScheduleMarkup(contract.annualObjectives)}</div>
    <div class="grid cols-2" style="margin-top:14px">
      <div class="card"><p class="label">Exigencia vigente</p><h3>${Number(step?.objectivePpg || objectiveInfo?.objective || 0).toFixed(2)} puntos por partido</h3><p class="muted small">${step?.type === 'final' ? 'Es el objetivo final del contrato.' : 'Es el mínimo necesario para mantener la continuidad del proyecto.'} Rendimiento actual: ${ppg.toFixed(2)} en ${played} encuentros oficiales.</p></div>
      <div class="card"><p class="label">Condiciones laborales</p><h3>${escapeHtml(restriction)}</h3><p class="muted small">El sueldo es fijo durante todo el contrato. Cambiar de club o renunciar termina los pagos pendientes.</p></div>
    </div>
    <div class="card" style="margin-top:14px"><p class="label">Porcentaje de formación</p><h3>${Number(contract.futureSalePercent || 0)}% sobre futuras ventas</h3><p class="muted small">Se asigna automáticamente a cada juvenil que promociones durante este contrato. Conservás el derecho aunque cambies de club, renuncies o seas despedido; se cobra una sola vez en la primera transferencia pagada.</p></div>`;
};

/* Envuelve los flujos existentes para crear, conservar o cerrar contratos. */
const continueCareerAtClubV764 = continueCareerAtClub;
continueCareerAtClub = function(selectedClubId, options={}){
  const offerCopy = options.jobOffer ? { ...options.jobOffer } : null;
  const previousContract = game?.managerJobContract ? normalizeManagerJobContract(game.managerJobContract, game) : null;
  continueCareerAtClubV764(selectedClubId, options);
  if(!game || game.gameOver?.active || Number(game.selectedClubId || 0) !== Number(selectedClubId || 0)) return;
  if(previousContract){
    game.managerJobContract = previousContract;
    archiveManagerJobContract('nuevo_club', game);
  }
  const club = seed?.clubs?.find(item => Number(item.id) === Number(selectedClubId));
  const offer = offerCopy || {
    id:`direct-job-${selectedClubId}-${game.seasonNumber || 1}-${Date.now()}`,
    clubId:Number(selectedClubId),
    source:'career_change',
    contractType:'normal',
    durationSeasons:managerContractDurationForOffer(club, { source:'career_change', contractType:'normal' }, game),
    managerPrestigeAtOffer:currentManagerPrestige(),
    baseObjectivePpg:managerObjectiveBaseForClubDivision(selectedClubId),
    futureSalePercent:managerContractFutureSalePercent(club, 'career_change', game)
  };
  game.managerJobContract = createManagerJobContractFromOffer(selectedClubId, offer, options.contractNegotiationLevel || 'normal', game);
  ensureManagerFinancesState(game);
  game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber, game.selectedClubId);
  saveLocal(true);
  renderAll();
};
const resignCurrentClubV764 = resignCurrentClub;
resignCurrentClub = function(){
  const before = game?.gameOver?.triggeredAt || '';
  resignCurrentClubV764();
  if(game?.gameOver?.active && game.gameOver.type === 'resignation' && game.gameOver.triggeredAt !== before){
    archiveManagerJobContract('renuncia', game);
    saveLocal(true);
    renderAll();
  }
};
const checkManagerObjectiveGameOverV764 = checkManagerObjectiveGameOver;
checkManagerObjectiveGameOver = function(){
  const dismissed = checkManagerObjectiveGameOverV764();
  if(dismissed){ archiveManagerJobContract('despido', game); saveLocal(true); }
  return dismissed;
};
const startNextSeasonV764 = startNextSeason;
startNextSeason = function(selectedClubId){
  const previousSeason = Number(game?.seasonNumber || 1);
  const previousClubId = Number(game?.selectedClubId || 0);
  const previousContract = game?.managerJobContract ? normalizeManagerJobContract(game.managerJobContract, game) : null;
  const previousStepBeforeTransition = previousContract ? managerContractScheduleEntry(previousContract, previousSeason) : null;
  const previousTotalsBeforeTransition = { ...(game?.managerStats?.currentSeason || {}) };
  const previousPpgBeforeTransition = ppgFromTotals(previousTotalsBeforeTransition);
  startNextSeasonV764(selectedClubId);
  if(!game || Number(game.seasonNumber || 0) !== previousSeason + 1) return;
  const changedClub = Number(game.selectedClubId || 0) !== previousClubId;
  if(changedClub && previousContract){
    game.managerJobContract = previousContract;
    archiveManagerJobContract('cambio_fin_temporada', game);
  }
  if(!changedClub && previousContract && managerContractActiveForSeason(previousContract, game.selectedClubId, game.seasonNumber)){
    game.managerJobContract = previousContract;
  }else{
    if(!changedClub && previousContract){
      game.managerJobContract = previousContract;
      archiveManagerJobContract('fin_contrato', game);
    }
    const club = seed?.clubs?.find(item => Number(item.id) === Number(game.selectedClubId));
    const source = changedClub ? 'cambio_fin_temporada' : 'renovacion_automatica';
    const previousStep = previousStepBeforeTransition;
    const archivedTotals = game.managerStats?.seasons?.find(item => Number(item.season) === previousSeason && Number(item.clubId) === previousClubId) || {};
    const previousPpg = Number.isFinite(Number(archivedTotals.ppg)) ? Number(archivedTotals.ppg) : previousPpgBeforeTransition;
    const renewalMet = !previousStep || previousPpg >= Number(previousStep.objectivePpg || 0);
    const renewalLevel = changedClub ? 'normal' : (renewalMet ? 'normal' : 'prudente');
    const offer = {
      id:`${source}-${game.selectedClubId}-${game.seasonNumber}-${Date.now()}`,
      clubId:Number(game.selectedClubId),
      source,
      contractType:'normal',
      durationSeasons:(!changedClub && !renewalMet) ? 1 : managerContractDurationForOffer(club, { source, contractType:'normal' }, game),
      managerPrestigeAtOffer:currentManagerPrestige(),
      baseObjectivePpg:managerObjectiveBaseForClubDivision(game.selectedClubId),
      futureSalePercent:managerContractFutureSalePercent(club, source, game)
    };
    game.managerJobContract = createManagerJobContractFromOffer(game.selectedClubId, offer, renewalLevel, game);
    const renewalText = !changedClub && !renewalMet ? ' El objetivo final anterior no se cumplió: la renovación es por una temporada, con objetivo prudente y sueldo reducido.' : '';
    pushGameMessage({ type:'directiva', priority:'normal', title:changedClub ? 'Contrato con nuevo club' : 'Contrato renovado', body:`${clubName(game.selectedClubId)} acordó un contrato de ${game.managerJobContract.durationSeasons} temporada(s), sueldo mensual de ${formatMoney(game.managerJobContract.monthlySalary)} y ${game.managerJobContract.futureSalePercent}% sobre futuras ventas de juveniles promovidos.${renewalText}`, id:`manager-contract-season-${game.seasonNumber}-${game.selectedClubId}` });
  }
  ensureManagerFinancesState(game);
  game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber, game.selectedClubId);
  saveLocal(true);
  renderAll();
};
const newGameV764 = newGame;
newGame = function(selectedClubId, options={}){
  newGameV764(selectedClubId, options);
  if(!game) return;
  ensureManagerFinancesState(game);
  if(!options.founderMode && !options.challengeId){
    game.managerJobContract = createManagerJobContractFromOffer(selectedClubId, {
      id:`initial-contract-${selectedClubId}-1`,
      clubId:Number(selectedClubId),
      source:'inicio_carrera',
      contractType:'normal',
      durationSeasons:1,
      managerPrestigeAtOffer:currentManagerPrestige(),
      baseObjectivePpg:managerObjectiveBaseForClubDivision(selectedClubId),
      futureSalePercent:managerContractFutureSalePercent(seed.clubs.find(item => Number(item.id) === Number(selectedClubId)), 'initial', game)
    }, options.contractNegotiationLevel || 'normal', game);
    game.managerStats = ensureManagerCurrentSeasonStats(game.managerStats, game.seasonNumber, game.selectedClubId);
  }
  saveLocal(true);
  renderAll();
};
const normalizeGameV764 = normalizeGame;
normalizeGame = function(saved){
  const normalized = normalizeGameV764(saved);
  const hadManagerFinances = Boolean(normalized.managerFinances && typeof normalized.managerFinances === 'object' && !Array.isArray(normalized.managerFinances));
  const hadManagerContract = Boolean(normalized.managerJobContract && typeof normalized.managerJobContract === 'object' && !Array.isArray(normalized.managerJobContract));
  ensureManagerFinancesState(normalized);
  normalized.managerJobContract = normalizeManagerJobContract(normalized.managerJobContract, normalized);
  if(!hadManagerFinances || (hadManagerContract && !normalized.managerJobContract)) normalized._needsAutosave = true;
  if(!normalized.managerJobContract && !normalized.gameOver?.active && !normalized.founderMode && !normalized.challenge){
    normalized.managerJobContract = createManagerJobContractFromOffer(normalized.selectedClubId, {
      id:`migration-contract-${normalized.selectedClubId}-${normalized.seasonNumber || 1}`,
      clubId:Number(normalized.selectedClubId),
      source:'migracion_v765',
      contractType:'normal',
      durationSeasons:1,
      managerPrestigeAtOffer:managerContractStatePrestige(normalized),
      baseObjectivePpg:managerObjectiveBaseForClubDivision(normalized.selectedClubId),
      futureSalePercent:managerContractFutureSalePercent(seed.clubs.find(item => Number(item.id) === Number(normalized.selectedClubId)), 'migration', normalized)
    }, 'normal', normalized);
    normalized._needsAutosave = true;
  }
  return normalized;
};
