/* V5.66 · Sponsors especiales con condiciones, estadio, calendario, tabla, estadísticas y finanzas visuales. */

function randomInt(min,max){
  return Math.floor(rnd(min, max + 1));
}
function createInitialSponsorState(){
  return {
    active:[],
    offers:[],
    seasonPlan:[],
    seasonPlanSeason:0,
    seasonOfferTarget:0,
    generatedOfferCount:0,
    lastOfferTurn:-1,
    expiredOffers:0
  };
}
function sponsorTodayIso(){
  if(typeof validIsoDate === 'function' && validIsoDate(game?.currentDate)) return game.currentDate;
  if(typeof dateForSeasonState === 'function'){
    const date = dateForSeasonState(game);
    if(typeof validIsoDate === 'function' && validIsoDate(date)) return date;
  }
  return '';
}
function sponsorDefaultExpiryDate(createdDate, today=sponsorTodayIso()){
  const base = (typeof validIsoDate === 'function' && validIsoDate(createdDate)) ? createdDate : today;
  if(typeof validIsoDate !== 'function' || !validIsoDate(base) || typeof addDaysToIsoDate !== 'function') return '';
  return addDaysToIsoDate(base, SPONSOR_OFFER_EXPIRE_DAYS);
}
function normalizeSponsorOfferExpiry(offer={}, today=sponsorTodayIso()){
  const nowSeasonTurn = typeof currentSeasonTurnNumber === 'function' ? currentSeasonTurnNumber() : 1;
  const nowGlobalTurn = typeof currentTurnIndex === 'function' ? currentTurnIndex() : 0;
  const createdTurn = Number.isFinite(Number(offer.createdTurn)) ? Number(offer.createdTurn) : nowSeasonTurn;
  const createdGlobalTurn = Number.isFinite(Number(offer.createdGlobalTurn)) ? Number(offer.createdGlobalTurn) : nowGlobalTurn;
  const createdDate = (typeof validIsoDate === 'function' && validIsoDate(offer.createdDate)) ? offer.createdDate : today;
  let expiresDate = (typeof validIsoDate === 'function' && validIsoDate(offer.expiresDate)) ? offer.expiresDate : sponsorDefaultExpiryDate(createdDate, today);
  if(typeof validIsoDate === 'function' && validIsoDate(today) && validIsoDate(expiresDate)){
    const remainingDays = typeof daysBetweenIsoDates === 'function' ? daysBetweenIsoDates(today, expiresDate) : SPONSOR_OFFER_EXPIRE_DAYS;
    if(remainingDays > SPONSOR_OFFER_EXPIRE_DAYS){
      expiresDate = sponsorDefaultExpiryDate(today, today);
    }
  }
  const expiresTurn = Number.isFinite(Number(offer.expiresTurn))
    ? Number(offer.expiresTurn)
    : createdTurn + Math.max(1, daysToTurns(SPONSOR_OFFER_EXPIRE_DAYS)) - 1;
  const expiresGlobalTurn = Number.isFinite(Number(offer.expiresGlobalTurn))
    ? Number(offer.expiresGlobalTurn)
    : createdGlobalTurn + Math.max(1, daysToTurns(SPONSOR_OFFER_EXPIRE_DAYS));
  return { ...offer, createdTurn, expiresTurn, createdGlobalTurn, expiresGlobalTurn, createdDate, expiresDate };
}
function sponsorOfferIsExpired(offer={}, today=sponsorTodayIso()){
  const normalized = normalizeSponsorOfferExpiry(offer, today);
  if(typeof validIsoDate === 'function' && validIsoDate(today) && validIsoDate(normalized.expiresDate)){
    return daysBetweenIsoDates(normalized.expiresDate, today) > 0;
  }
  const nowGlobalTurn = typeof currentTurnIndex === 'function' ? currentTurnIndex() : 0;
  if(Number.isFinite(Number(normalized.expiresGlobalTurn))) return Number(normalized.expiresGlobalTurn) < nowGlobalTurn;
  const nowSeasonTurn = typeof currentSeasonTurnNumber === 'function' ? currentSeasonTurnNumber() : 1;
  return Number(normalized.expiresTurn || 0) < nowSeasonTurn;
}
function sponsorOfferDaysLeft(offer={}, today=sponsorTodayIso()){
  const normalized = normalizeSponsorOfferExpiry(offer, today);
  if(typeof validIsoDate === 'function' && validIsoDate(today) && validIsoDate(normalized.expiresDate)){
    return Math.max(0, daysBetweenIsoDates(today, normalized.expiresDate));
  }
  const nowGlobalTurn = typeof currentTurnIndex === 'function' ? currentTurnIndex() : 0;
  if(Number.isFinite(Number(normalized.expiresGlobalTurn))) return turnsToDays(Math.max(0, Number(normalized.expiresGlobalTurn) - nowGlobalTurn));
  const nowSeasonTurn = typeof currentSeasonTurnNumber === 'function' ? currentSeasonTurnNumber() : 1;
  return turnsToDays(Math.max(0, Number(normalized.expiresTurn || nowSeasonTurn) - nowSeasonTurn + 1));
}
function normalizeSponsorState(state){
  const base = createInitialSponsorState();
  const clean = { ...base, ...(state || {}) };
  clean.active = Array.isArray(clean.active) ? clean.active : [];
  clean.offers = Array.isArray(clean.offers) ? clean.offers : [];
  clean.seasonPlan = Array.isArray(clean.seasonPlan) ? clean.seasonPlan : [];
  clean.seasonPlanSeason = Number.isFinite(Number(clean.seasonPlanSeason)) ? Number(clean.seasonPlanSeason) : 0;
  clean.seasonOfferTarget = Number.isFinite(Number(clean.seasonOfferTarget)) ? Number(clean.seasonOfferTarget) : 0;
  clean.generatedOfferCount = Number.isFinite(Number(clean.generatedOfferCount)) ? Number(clean.generatedOfferCount) : 0;
  clean.lastOfferTurn = Number.isFinite(Number(clean.lastOfferTurn)) ? Number(clean.lastOfferTurn) : -1;
  clean.expiredOffers = Number.isFinite(Number(clean.expiredOffers)) ? Number(clean.expiredOffers) : 0;
  delete clean.matchesSinceOffer;
  delete clean.nextOfferAfter;
  delete clean.openingOffersSeason;
  const today = sponsorTodayIso();
  clean.offers = clean.offers.map(offer => normalizeSponsorOfferExpiry(offer, today));
  clean.active = clean.active.map(contract => {
    const turnsRemaining = Number.isFinite(Number(contract.turnsRemaining)) ? Number(contract.turnsRemaining) : daysToTurns(Number(contract.durationDays || contract.diasDuracion || 0));
    return { ...contract, turnsRemaining:Math.max(0, turnsRemaining), paidToDate:Math.round(Number(contract.paidToDate || 0)) };
  }).filter(contract => Number(contract.turnsRemaining || 0) > 0);
  return clean;
}
function ensureSponsorState(){
  if(!game) return;
  game.sponsors = normalizeSponsorState(game.sponsors);
}
function sponsorDivisionMultiplier(){
  const club = seed.clubs.find(c => c.id === game.selectedClubId) || {};
  const order = Number(club.divisionOrder || clubDivision(game.selectedClubId).order || 1);
  if(order <= 1) return 3;
  if(order === 2) return 1.5;
  return 1;
}
function sponsorPositionBonus(){
  const division = clubDivision(game.selectedClubId);
  const table = sortedStandings(division.id);
  const index = table.findIndex(row => row.clubId === game.selectedClubId);
  if(index < 0 || table.length <= 1) return 0;
  return ((table.length - (index + 1)) / (table.length - 1)) * 0.20;
}
function sponsorMoraleBonus(){
  return (squadMoraleAverage(game.selectedClubId) / 100) * 0.10;
}
function sponsorCohesionBonus(){
  return (cohesionValue(game.selectedClubId) / 100) * 0.10;
}
function sponsorSeasonWindowTurns(){
  const total = typeof totalSeasonTurnCount === 'function' ? totalSeasonTurnCount() : 365;
  return Math.max(30, Number(total || 365));
}
function sponsorPaymentTypeForDuration(durationDays=0){
  const days = Math.max(1, Math.round(Number(durationDays || 0)));
  if(days <= 60) return 'upfront';
  if(days <= 200) return 'mixed';
  return 'daily';
}
function sponsorPaymentLabel(paymentType='daily'){
  if(paymentType === 'upfront') return 'Todo al inicio';
  if(paymentType === 'mixed') return '20% al firmar + diario';
  return 'Diario';
}
function sponsorOfferValue(baseSponsor, lugar){
  const base = Number(baseSponsor?.valor_base_por_7_dias || 0);
  const place = Number(lugar?.multiplicador_lugar || 1);
  const specialBonusPct = typeof specialActiveBonus === 'function' ? specialActiveBonus('sponsors_extra') : 0;
  const totalMultiplier = sponsorDivisionMultiplier() * place * (1 + sponsorPositionBonus() + sponsorMoraleBonus() + sponsorCohesionBonus()) * (1 + (specialBonusPct / 100));
  const valuePer7Days = Math.max(0, Math.round(base * SPONSOR_BASE_VALUE_FACTOR * totalMultiplier));
  const baseDailyAmount = Math.max(0, Math.round(valuePer7Days / 7));
  const durationDays = randomInt(SPONSOR_DURATION_MIN_DAYS, SPONSOR_DURATION_MAX_DAYS);
  const turns = Math.max(1, daysToTurns(durationDays));
  const paymentType = sponsorPaymentTypeForDuration(durationDays);
  const dailyTotal = Math.round(baseDailyAmount * durationDays);
  const upfrontAmount = paymentType === 'upfront'
    ? dailyTotal
    : paymentType === 'mixed'
      ? Math.round(dailyTotal * 0.20)
      : 0;
  const remainingDailyTotal = Math.max(0, dailyTotal - upfrontAmount);
  const dailyAmount = paymentType === 'upfront' ? 0 : Math.max(0, Math.round(remainingDailyTotal / durationDays));
  return {
    valuePer7Days,
    baseDailyAmount,
    dailyAmount,
    durationDays,
    turns,
    paymentType,
    total:dailyTotal,
    upfrontAmount,
    upfrontTotal:upfrontAmount,
    dailyTotal,
    remainingDailyTotal
  };
}
function sponsorSpecialConditionPool(){
  return (SPONSOR_SPECIAL_CONDITIONS || []).filter(item => item && item.id && item.descripcion);
}
function sponsorSpecialPickCondition(){
  const pool = sponsorSpecialConditionPool();
  if(!SPONSOR_SPECIAL_ENABLED || !pool.length || Math.random() >= SPONSOR_SPECIAL_CHANCE) return null;
  return pool[randomInt(0, pool.length - 1)] || null;
}
function sponsorLowLevelCandidate(condition={}){
  const squad = playersByClub(game?.selectedClubId || 0).filter(Boolean);
  if(!squad.length) return null;
  const maxOverall = Number(condition.mediaMaxima || 55);
  const low = squad.filter(player => Number(effectiveOverall(player) || player.overall || 0) <= maxOverall);
  const pool = low.length ? low : squad;
  return [...pool].sort((a,b) => Number(effectiveOverall(a) || a.overall || 0) - Number(effectiveOverall(b) || b.overall || 0))[0] || null;
}
function createSponsorSpecialChallenge(condition=null){
  const item = condition || sponsorSpecialPickCondition();
  if(!item) return null;
  const challenge = {
    id:String(item.id || ''),
    name:String(item.nombre || 'Sponsor especial'),
    description:String(item.descripcion || ''),
    status:'active',
    matchesObserved:0,
    wins:0,
    losses:0,
    cleanSheets:0,
    redCards:0,
    targetStarts:0,
    daysObserved:0,
    createdDate:game?.currentDate || '',
    createdTurn:currentTurnIndex(),
    fulfilledDate:'',
    failedDate:'',
    bonusMultiplier:Number(SPONSOR_SPECIAL_BONUS_MULTIPLIER || 3),
    specialBonusPaid:false,
    config:{ ...item }
  };
  if(challenge.id === 'low_player_starter_6_10'){
    const player = sponsorLowLevelCandidate(item);
    if(!player) return null;
    challenge.targetPlayerId = Number(player.id || 0);
    challenge.targetPlayerName = player.name || 'Jugador elegido';
    challenge.description = `${challenge.targetPlayerName} debe ser titular ${Number(item.titularesObjetivo || 6)} de los próximos ${Number(item.partidosObjetivo || 10)} partidos.`;
  }
  return challenge;
}
function sponsorSpecialProgressText(challenge={}){
  if(!challenge?.id) return '';
  if(challenge.status === 'fulfilled') return 'Cumplido';
  if(challenge.status === 'failed') return 'Fallido';
  const cfg = challenge.config || {};
  if(challenge.id === 'low_player_starter_6_10') return `${Number(challenge.targetStarts || 0)}/${Number(cfg.titularesObjetivo || 6)} titularidades · ${Number(challenge.matchesObserved || 0)}/${Number(cfg.partidosObjetivo || 10)} partidos`;
  if(challenge.id === 'clean_sheets_4') return `${Number(challenge.cleanSheets || 0)}/${Number(cfg.partidosObjetivo || 4)} vallas invictas`;
  if(challenge.id === 'win_4_5') return `${Number(challenge.wins || 0)}/${Number(cfg.victoriasObjetivo || 4)} victorias · ${Number(challenge.matchesObserved || 0)}/${Number(cfg.partidosObjetivo || 5)} partidos`;
  if(challenge.id === 'no_reds_5') return `${Number(challenge.matchesObserved || 0)}/${Number(cfg.partidosObjetivo || 5)} partidos sin rojas`;
  if(challenge.id === 'field_98_30') return `${Number(challenge.daysObserved || 0)}/${Number(cfg.diasObjetivo || 30)} días con campo > ${Number(cfg.minimoCampo || 98)}`;
  if(challenge.id === 'lose_5_5') return `${Number(challenge.losses || 0)}/${Number(cfg.derrotasObjetivo || 5)} derrotas · ${Number(challenge.matchesObserved || 0)}/${Number(cfg.partidosObjetivo || 5)} partidos`;
  return `${Number(challenge.matchesObserved || challenge.daysObserved || 0)} avances`;
}
function sponsorSpecialBonusPotential(source=null){
  const challenge = source?.specialChallenge || source || {};
  if(!challenge?.id) return 0;
  const base = Math.max(0, Math.round(Number(source?.total || source?.dailyTotal || source?.upfrontTotal || 0)));
  const multiplier = Number(challenge.bonusMultiplier || SPONSOR_SPECIAL_BONUS_MULTIPLIER || 3);
  return Math.max(0, Math.round(base * multiplier));
}
function sponsorSpecialChallengeMarkup(challenge=null, compact=false, source=null){
  if(!challenge?.id) return '';
  const tone = challenge.status === 'fulfilled' ? 'ok' : challenge.status === 'failed' ? 'danger' : 'warn';
  const label = compact ? sponsorSpecialProgressText(challenge) : challenge.description;
  const bonus = sponsorSpecialBonusPotential(source || challenge);
  const bonusLine = bonus > 0 ? ` · Bono si cumple: ${formatMoney(bonus)}` : '';
  return `<span class="pill ${tone}">Sponsor especial x${Number(challenge.bonusMultiplier || SPONSOR_SPECIAL_BONUS_MULTIPLIER || 3)}</span><span class="muted small">${escapeHtml(label || '')}${compact ? '' : ` · ${escapeHtml(sponsorSpecialProgressText(challenge))}`}${bonusLine}</span>`;
}
function ownMatchSponsorContext(match){
  const clubId = Number(game?.selectedClubId || 0);
  const isHome = Number(match?.homeId || 0) === clubId;
  const isAway = Number(match?.awayId || 0) === clubId;
  if(!clubId || (!isHome && !isAway)) return null;
  const gf = isHome ? Number(match.homeGoals || 0) : Number(match.awayGoals || 0);
  const gc = isHome ? Number(match.awayGoals || 0) : Number(match.homeGoals || 0);
  const starters = (isHome ? match.starterIdsHome : match.starterIdsAway) || [];
  const redCards = (match.cards || []).filter(card => Number(card.clubId || 0) === clubId && ['red','secondYellowRed'].includes(String(card.type || ''))).length;
  return { clubId, gf, gc, won:gf > gc, lost:gf < gc, drawn:gf === gc, starters:starters.map(Number), redCards };
}
function paySponsorSpecialBonus(contract, reason=''){
  if(!contract || contract.specialBonusPaid) return 0;
  const base = Math.max(0, Math.round(Number(contract.total || contract.dailyTotal || contract.upfrontTotal || 0)));
  const amount = Math.max(0, Math.round(base * Number(contract.specialChallenge?.bonusMultiplier || SPONSOR_SPECIAL_BONUS_MULTIPLIER || 3)));
  if(amount <= 0) return 0;
  recordBudgetChange(amount, `Bono sponsor especial: ${contract.sponsorName} / ${contract.placeName}`, { type:'sponsor_special_bonus', sponsorId:contract.sponsorId, placeId:contract.placeId, sponsorContractId:contract.id, challengeId:contract.specialChallenge?.id || '' });
  contract.specialBonusPaid = true;
  contract.paidToDate = Math.round(Number(contract.paidToDate || 0) + amount);
  pushGameMessage({ type:'finanzas', title:'Bono de sponsor especial', body:`${contract.sponsorName} pagó un bono de ${formatMoney(amount)} por cumplir: ${contract.specialChallenge?.description || reason || 'condición especial'}.`, priority:'high' });
  return amount;
}
function completeSponsorChallenge(contract, success, detail=''){
  if(!contract?.specialChallenge || contract.specialChallenge.status !== 'active') return;
  contract.specialChallenge.status = success ? 'fulfilled' : 'failed';
  if(success){
    contract.specialChallenge.fulfilledDate = game?.currentDate || '';
    paySponsorSpecialBonus(contract, detail);
  }else{
    contract.specialChallenge.failedDate = game?.currentDate || '';
    if(detail) contract.specialChallenge.failureReason = detail;
    pushGameMessage({ type:'finanzas', title:'Sponsor especial perdido', body:`${contract.sponsorName} no pagará bono especial: ${detail || contract.specialChallenge.description || 'condición incumplida'}.`, priority:'normal' });
  }
}
function processSponsorSpecialAfterOwnMatch(match){
  if(!game?.sponsors?.active?.length) return;
  const ctx = ownMatchSponsorContext(match);
  if(!ctx) return;
  (game.sponsors.active || []).forEach(contract => {
    const ch = contract.specialChallenge;
    if(!ch || ch.status !== 'active') return;
    const cfg = ch.config || {};
    if(ch.id === 'low_player_starter_6_10'){
      ch.matchesObserved = Number(ch.matchesObserved || 0) + 1;
      if(ctx.starters.includes(Number(ch.targetPlayerId || 0))) ch.targetStarts = Number(ch.targetStarts || 0) + 1;
      if(Number(ch.targetStarts || 0) >= Number(cfg.titularesObjetivo || 6)) completeSponsorChallenge(contract, true, 'titularidades cumplidas');
      else if(Number(ch.matchesObserved || 0) >= Number(cfg.partidosObjetivo || 10)) completeSponsorChallenge(contract, false, 'no se alcanzaron las titularidades requeridas');
    }else if(ch.id === 'clean_sheets_4'){
      ch.matchesObserved = Number(ch.matchesObserved || 0) + 1;
      if(ctx.gc > 0) completeSponsorChallenge(contract, false, 'el equipo recibió goles');
      else {
        ch.cleanSheets = Number(ch.cleanSheets || 0) + 1;
        if(Number(ch.cleanSheets || 0) >= Number(cfg.partidosObjetivo || 4)) completeSponsorChallenge(contract, true, 'valla invicta cumplida');
      }
    }else if(ch.id === 'win_4_5'){
      ch.matchesObserved = Number(ch.matchesObserved || 0) + 1;
      if(ctx.won) ch.wins = Number(ch.wins || 0) + 1;
      if(Number(ch.wins || 0) >= Number(cfg.victoriasObjetivo || 4)) completeSponsorChallenge(contract, true, 'racha ganadora cumplida');
      else if(Number(ch.matchesObserved || 0) >= Number(cfg.partidosObjetivo || 5)) completeSponsorChallenge(contract, false, 'no se alcanzaron las victorias requeridas');
    }else if(ch.id === 'no_reds_5'){
      ch.matchesObserved = Number(ch.matchesObserved || 0) + 1;
      ch.redCards = Number(ch.redCards || 0) + Number(ctx.redCards || 0);
      if(ctx.redCards > 0) completeSponsorChallenge(contract, false, 'el equipo recibió una tarjeta roja');
      else if(Number(ch.matchesObserved || 0) >= Number(cfg.partidosObjetivo || 5)) completeSponsorChallenge(contract, true, 'juego limpio cumplido');
    }else if(ch.id === 'lose_5_5'){
      ch.matchesObserved = Number(ch.matchesObserved || 0) + 1;
      if(ctx.lost) ch.losses = Number(ch.losses || 0) + 1;
      if(Number(ch.matchesObserved || 0) >= Number(cfg.partidosObjetivo || 5)){
        if(Number(ch.losses || 0) >= Number(cfg.derrotasObjetivo || 5)) completeSponsorChallenge(contract, true, 'derrotas requeridas cumplidas');
        else completeSponsorChallenge(contract, false, 'no se alcanzaron las derrotas requeridas');
      }
    }
  });
}
function processSponsorSpecialDaily(){
  if(!game?.sponsors?.active?.length) return;
  const today = game?.currentDate || String(currentTurnIndex());
  (game.sponsors.active || []).forEach(contract => {
    const ch = contract.specialChallenge;
    if(!ch || ch.status !== 'active' || ch.id !== 'field_98_30') return;
    if(ch.lastDailyCheckDate === today) return;
    ch.lastDailyCheckDate = today;
    const cfg = ch.config || {};
    const minField = Number(cfg.minimoCampo || 98);
    const score = fieldScoreForClub(game.selectedClubId);
    if(score <= minField){
      completeSponsorChallenge(contract, false, `el campo bajó a ${score}/100`);
      return;
    }
    ch.daysObserved = Number(ch.daysObserved || 0) + 1;
    if(Number(ch.daysObserved || 0) >= Number(cfg.diasObjetivo || 30)) completeSponsorChallenge(contract, true, 'campo impecable sostenido');
  });
}
function occupiedSponsorPlaces(){
  ensureSponsorState();
  return new Set((game.sponsors.active || []).filter(item => Number(item.turnsRemaining || 0) > 0).map(item => item.placeId));
}

const SPONSOR_BASE_PLACE_IDS = ['LUG001','LUG002','LUG003','LUG005','LUG006','LUG015','LUG016','LUG017'];
function sponsorPlacesOrdered(){
  const places = Array.isArray(sponsorsDatabase?.lugares_sponsor) ? sponsorsDatabase.lugares_sponsor : [];
  const baseOrder = new Map(SPONSOR_BASE_PLACE_IDS.map((id, index) => [id, index]));
  const orderValue = place => baseOrder.has(place.id_lugar) ? baseOrder.get(place.id_lugar) : 1000 + Math.max(0, Number(String(place.id_lugar || '').replace(/\D/g, '')) || 0);
  return places.slice().sort((a,b) => orderValue(a) - orderValue(b) || String(a.nombre || '').localeCompare(String(b.nombre || '')));
}
function sponsorUnlockedPlaceCount(clubId=game?.selectedClubId){
  const capacity = typeof clubStadiumCapacity === 'function' ? Number(clubStadiumCapacity(clubId) || 0) : 0;
  const count = 8 + Math.floor(Math.max(0, capacity) / 5000);
  return clamp(count, 8, 32);
}
function sponsorUnlockedPlaces(clubId=game?.selectedClubId){
  return sponsorPlacesOrdered().slice(0, sponsorUnlockedPlaceCount(clubId));
}
function sponsorPlaceIsUnlocked(placeId, clubId=game?.selectedClubId){
  return sponsorUnlockedPlaces(clubId).some(place => String(place.id_lugar) === String(placeId));
}
function sponsorOfferPlacePool(){
  const occupied = occupiedSponsorPlaces();
  return sponsorUnlockedPlaces().filter(place => !occupied.has(place.id_lugar));
}
function sponsorPlaceTypeLabel(type=''){
  if(type === 'equipacion') return 'Equipación';
  if(type === 'estadio') return 'Estadio';
  return 'Club';
}
function sponsorPlacesMarkup(){
  const places = sponsorPlacesOrdered();
  if(!places.length) return '<p class="muted small">No hay lugares de sponsor cargados.</p>';
  const unlockedCount = sponsorUnlockedPlaceCount();
  const occupied = occupiedSponsorPlaces();
  return `<div class="sponsor-places-card"><div class="row"><div><h4>Lugares disponibles</h4><p class="muted small">Tenés ${unlockedCount} de 32 lugares habilitados. Las ampliaciones de estadio pueden abrir más espacios comerciales.</p></div></div><div class="sponsor-places-grid">${places.map((place, index) => {
    const unlocked = index < unlockedCount;
    const active = occupied.has(place.id_lugar);
    const tone = !unlocked ? 'locked' : active ? 'occupied' : 'available';
    const label = !unlocked ? 'No disponible, amplia tu estadio para conseguir más lugares para sponsors' : active ? 'Ocupado' : 'Disponible';
    return `<div class="sponsor-place-item ${tone}"><strong>${escapeHtml(place.nombre)}</strong><span>${sponsorPlaceTypeLabel(place.tipo)}</span><em>${escapeHtml(label)}</em></div>`;
  }).join('')}</div></div>`;
}
function sponsorArrivalGroupSize(remaining){
  if(remaining <= 1) return 1;
  if(remaining >= 3 && Math.random() < SPONSOR_TRIPLE_ARRIVAL_CHANCE) return 3;
  return Math.min(remaining, randomInt(SPONSOR_OFFERS_PER_ARRIVAL_MIN, SPONSOR_OFFERS_PER_ARRIVAL_MAX));
}
function buildSponsorSeasonPlan(){
  ensureSponsorState();
  const season = Number(game?.seasonNumber || 1);
  const totalOffers = randomInt(SPONSOR_SEASON_OFFERS_MIN, SPONSOR_SEASON_OFFERS_MAX);
  const plan = [];
  let remaining = totalOffers;
  const windowTurns = sponsorSeasonWindowTurns();
  const currentTurn = Math.max(1, Math.min(windowTurns, typeof currentSeasonTurnNumber === 'function' ? currentSeasonTurnNumber() : 1));
  let guard = 0;
  while(remaining > 0 && guard < 500){
    guard += 1;
    const count = Math.min(remaining, sponsorArrivalGroupSize(remaining));
    const latestArrival = Math.max(currentTurn, windowTurns - Math.max(0, daysToTurns(SPONSOR_OFFER_EXPIRE_DAYS)));
    const arrivalTurn = randomInt(currentTurn, latestArrival);
    plan.push({ id:`SPONPLAN-${season}-${plan.length + 1}-${hashNumber(String(Math.random()), 100000)}`, arrivalTurn, count, released:false });
    remaining -= count;
  }
  plan.sort((a,b) => Number(a.arrivalTurn || 0) - Number(b.arrivalTurn || 0));
  game.sponsors.seasonPlan = plan;
  game.sponsors.seasonPlanSeason = season;
  game.sponsors.seasonOfferTarget = totalOffers;
  game.sponsors.generatedOfferCount = 0;
  return plan;
}
function ensureSponsorSeasonPlan(){
  ensureSponsorState();
  const season = Number(game?.seasonNumber || 1);
  if(Number(game.sponsors.seasonPlanSeason || 0) !== season || !Array.isArray(game.sponsors.seasonPlan) || !game.sponsors.seasonPlan.length){
    buildSponsorSeasonPlan();
  }
  return game.sponsors.seasonPlan || [];
}
function createSponsorOfferFromPlan(planItem){
  const lugares = sponsorOfferPlacePool();
  const sponsors = (sponsorsDatabase?.sponsors || []).filter(sponsor => sponsor.activo !== false);
  if(!lugares.length || !sponsors.length) return null;
  const sponsor = sponsors[randomInt(0, sponsors.length - 1)];
  const place = lugares[randomInt(0, lugares.length - 1)];
  if(!sponsor || !place) return null;
  const value = sponsorOfferValue(sponsor, place);
  const paymentType = value.paymentType;
  const specialChallenge = createSponsorSpecialChallenge();
  const createdTurn = currentSeasonTurnNumber();
  const createdGlobalTurn = typeof currentTurnIndex === 'function' ? currentTurnIndex() : 0;
  const createdDate = sponsorTodayIso();
  const expiresDate = sponsorDefaultExpiryDate(createdDate, createdDate);
  const expiresTurn = createdTurn + Math.max(1, daysToTurns(SPONSOR_OFFER_EXPIRE_DAYS)) - 1;
  const expiresGlobalTurn = createdGlobalTurn + Math.max(1, daysToTurns(SPONSOR_OFFER_EXPIRE_DAYS));
  const serial = Number(game.sponsors.generatedOfferCount || 0) + 1;
  game.sponsors.generatedOfferCount = serial;
  return {
    id:`SPON-${game.seasonNumber || 1}-${serial}-${sponsor.id_sponsor}-${place.id_lugar}-${hashNumber(String(Math.random()), 100000)}`,
    sponsorId:sponsor.id_sponsor,
    sponsorName:sponsor.nombre_marca,
    category:sponsor.categoria,
    placeId:place.id_lugar,
    placeName:place.nombre,
    placeType:place.tipo,
    paymentType,
    paymentLabel:sponsorPaymentLabel(paymentType),
    valuePer7Days:value.valuePer7Days,
    dailyAmount:value.dailyAmount,
    durationDays:value.durationDays,
    turns:value.turns,
    total:value.total,
    dailyTotal:value.dailyTotal,
    upfrontTotal:value.upfrontTotal,
    upfrontAmount:value.upfrontAmount,
    remainingDailyTotal:value.remainingDailyTotal,
    createdTurn,
    expiresTurn,
    createdGlobalTurn,
    expiresGlobalTurn,
    createdDate,
    expiresDate,
    arrivalPlanId:planItem?.id || '',
    season:game.seasonNumber || 1,
    specialChallenge
  };
}
function expireSponsorOffers(silent=true){
  ensureSponsorState();
  const today = sponsorTodayIso();
  const before = game.sponsors.offers.length;
  game.sponsors.offers = (game.sponsors.offers || [])
    .map(offer => normalizeSponsorOfferExpiry(offer, today))
    .filter(offer => !sponsorOfferIsExpired(offer, today));
  const expired = before - game.sponsors.offers.length;
  if(expired > 0){
    game.sponsors.expiredOffers = Number(game.sponsors.expiredOffers || 0) + expired;
    if(!silent) showNotice(`${expired} oferta(s) de sponsor vencieron.`);
  }
  return expired;
}
function releaseDueSponsorOffers(options={}){
  ensureSponsorSeasonPlan();
  expireSponsorOffers(true);
  const currentTurn = currentSeasonTurnNumber();
  const released = [];
  (game.sponsors.seasonPlan || []).forEach(planItem => {
    if(planItem.released) return;
    if(Number(planItem.arrivalTurn || 0) > currentTurn) return;
    planItem.released = true;
    const count = Math.max(1, Math.round(Number(planItem.count || 1)));
    for(let i=0;i<count;i+=1){
      const offer = createSponsorOfferFromPlan(planItem);
      if(offer) released.push(offer);
    }
  });
  if(released.length){
    game.sponsors.offers = [...(game.sponsors.offers || []), ...released];
    game.sponsors.lastOfferTurn = currentTurnIndex();
    if(options.silent !== true){
      pushGameMessage({
        type:'finanzas',
        title:'Nuevas ofertas de sponsors',
        body:`Llegaron ${released.length} oferta(s) de patrocinio. Tenés ${SPONSOR_OFFER_EXPIRE_DAYS} día(s) para aceptar o rechazar antes de que desaparezcan.`,
        priority:'normal'
      });
    }
  }
  return released;
}
function generateOpeningSponsorOffers(force=false){
  ensureSponsorSeasonPlan();
  return releaseDueSponsorOffers({ silent:!force });
}
function advanceSponsorMatchCounter(){
  // V5.66: los sponsors se liberan por plan fijo de temporada.
  return releaseDueSponsorOffers({ silent:true });
}
function processSponsorContracts(){
  ensureSponsorState();
  releaseDueSponsorOffers({ silent:false });
  processSponsorSpecialDaily();
  const currentDate = game?.currentDate || '';
  const nextActive = [];
  (game.sponsors.active || []).forEach(contract => {
    const remaining = Math.max(0, Number(contract.turnsRemaining || 0));
    if(remaining <= 0) return;
    let updated = { ...contract };
    if(updated.paymentType === 'daily' || updated.paymentType === 'mixed'){
      const amount = Math.max(0, Math.round(Number(updated.dailyAmount || 0)));
      if(amount > 0){
        recordBudgetChange(amount, `Sponsor diario: ${updated.sponsorName} / ${updated.placeName}`, { type:'sponsor_daily', sponsorId:updated.sponsorId, placeId:updated.placeId, sponsorContractId:updated.id });
        updated.paidToDate = Math.round(Number(updated.paidToDate || 0) + amount);
        updated.lastDailyPaymentDate = currentDate;
      }
    }
    updated.turnsRemaining = Math.max(0, remaining - 1);
    if(updated.turnsRemaining > 0) nextActive.push(updated);
  });
  game.sponsors.active = nextActive;
}
function acceptSponsorOffer(offerId){
  ensureSponsorState();
  expireSponsorOffers(true);
  const index = game.sponsors.offers.findIndex(offer => offer.id === offerId);
  if(index < 0) return;
  const offer = game.sponsors.offers[index];
  if(!sponsorPlaceIsUnlocked(offer.placeId)){
    showNotice('Ese lugar todavía no está disponible. Ampliá el estadio para habilitar más sponsors.');
    return;
  }
  if(occupiedSponsorPlaces().has(offer.placeId)){
    showNotice('Ese lugar ya está ocupado por otro sponsor. Rechazá esta oferta o esperá a que finalice el contrato activo.');
    return;
  }
  game.sponsors.offers.splice(index, 1);
  const contract = {
    ...offer,
    acceptedTurn:currentTurnIndex(),
    acceptedDate:game?.currentDate || '',
    turnsRemaining:offer.turns,
    paidToDate:0
  };
  if(offer.paymentType === 'upfront'){
    contract.paidToDate = Math.round(Number(offer.total || 0));
    recordBudgetChange(contract.paidToDate, `Sponsor pago inicial: ${offer.sponsorName} / ${offer.placeName}`, { type:'sponsor_upfront', sponsorId:offer.sponsorId, placeId:offer.placeId, sponsorContractId:offer.id });
    pushGameMessage({ type:'finanzas', title:'Sponsor aceptado', body:`${offer.sponsorName} pagó ${formatMoney(contract.paidToDate)} al inicio por ${offer.placeName}.`, priority:'normal' });
  } else if(offer.paymentType === 'mixed'){
    const upfront = Math.max(0, Math.round(Number(offer.upfrontAmount || offer.upfrontTotal || 0)));
    contract.paidToDate = upfront;
    if(upfront > 0){
      recordBudgetChange(upfront, `Sponsor 20% inicial: ${offer.sponsorName} / ${offer.placeName}`, { type:'sponsor_upfront_partial', sponsorId:offer.sponsorId, placeId:offer.placeId, sponsorContractId:offer.id });
    }
    pushGameMessage({ type:'finanzas', title:'Sponsor aceptado', body:`${offer.sponsorName} pagó ${formatMoney(upfront)} al firmar y pagará ${formatMoney(offer.dailyAmount)} por día durante ${formatDays(offer.durationDays)} por ${offer.placeName}.`, priority:'normal' });
  } else {
    pushGameMessage({ type:'finanzas', title:'Sponsor aceptado', body:`${offer.sponsorName} pagará ${formatMoney(offer.dailyAmount)} por día durante ${formatDays(offer.durationDays)} por ${offer.placeName}.`, priority:'normal' });
  }
  game.sponsors.active.push(contract);
  saveLocal(true);
  showNotice(`Sponsor aceptado: ${offer.sponsorName}.`);
  renderStadium();
}
function rejectSponsorOffer(offerId){
  ensureSponsorState();
  game.sponsors.offers = (game.sponsors.offers || []).filter(offer => offer.id !== offerId);
  saveLocal(true);
  renderStadium();
}
function sponsorOffersMarkup(){
  ensureSponsorState();
  expireSponsorOffers(true);
  const offers = game.sponsors.offers || [];
  if(!offers.length){
    return `<p class="muted small">Sin ofertas disponibles. Las marcas enviarán entre ${SPONSOR_SEASON_OFFERS_MIN} y ${SPONSOR_SEASON_OFFERS_MAX} propuestas durante la temporada.</p>`;
  }
  const today = sponsorTodayIso();
  return `<div class="table-wrap"><table class="sponsor-table"><thead><tr><th>Marca</th><th>Lugar</th><th>Duración</th><th>Pago</th><th>Valor</th><th>Vence</th><th></th></tr></thead><tbody>${offers.map(rawOffer => {
    const offer = normalizeSponsorOfferExpiry(rawOffer, today);
    const daysLeft = sponsorOfferDaysLeft(offer, today);
    const valueText = offer.paymentType === 'upfront'
      ? `${formatMoney(offer.total)} total`
      : offer.paymentType === 'mixed'
        ? `${formatMoney(offer.upfrontAmount || offer.upfrontTotal || 0)} inicial + ${formatMoney(offer.dailyAmount)} / día`
        : `${formatMoney(offer.dailyAmount)} / día`;
    const payText = sponsorPaymentLabel(offer.paymentType);
    return `<tr>
      <td><strong>${escapeHtml(offer.sponsorName)}</strong><span class="muted small">${escapeHtml(offer.category || '')}</span>${offer.specialChallenge ? `<span class="sponsor-special-line">${sponsorSpecialChallengeMarkup(offer.specialChallenge, false, offer)}</span>` : ''}</td>
      <td>${escapeHtml(offer.placeName)}</td>
      <td>${formatDays(offer.durationDays || turnsToDays(offer.turns))}</td>
      <td><span class="pill ${offer.paymentType === 'daily' ? 'ok' : ''}">${payText}</span></td>
      <td><strong class="ok">${valueText}</strong><span class="muted small">Base: ${formatMoney(offer.valuePer7Days || 0)} cada 7 días</span></td>
      <td>${formatDays(daysLeft)}</td>
      <td><button class="primary small-btn" data-accept-sponsor="${escapeHtml(offer.id)}">Aceptar</button><button class="ghost small-btn" data-reject-sponsor="${escapeHtml(offer.id)}">Rechazar</button></td>
    </tr>`;
  }).join('')}</tbody></table></div>`;
}
function activeSponsorsMarkup(){
  ensureSponsorState();
  const active = game.sponsors.active || [];
  if(!active.length) return '<p class="muted small">Todavía no hay contratos activos.</p>';
  return `<div class="table-wrap"><table class="sponsor-table"><thead><tr><th>Marca</th><th>Lugar</th><th>Pago</th><th>Días restantes</th><th>Cobrado</th></tr></thead><tbody>${active.map(item => {
    const payment = item.paymentType === 'upfront' ? 'Todo al inicio' : item.paymentType === 'mixed' ? `${formatMoney(item.upfrontAmount || item.upfrontTotal || 0)} inicial + ${formatMoney(item.dailyAmount || 0)} / día` : `${formatMoney(item.dailyAmount || 0)} / día`;
    const special = item.specialChallenge ? `<span class="sponsor-special-line">${sponsorSpecialChallengeMarkup(item.specialChallenge, true, item)}</span>` : '';
    return `<tr><td><strong>${escapeHtml(item.sponsorName)}</strong>${special}</td><td>${escapeHtml(item.placeName)}</td><td>${payment}</td><td>${formatDaysFromTurns(item.turnsRemaining)}</td><td>${formatMoney(Number(item.paidToDate || 0))}</td></tr>`;
  }).join('')}</tbody></table></div>`;
}

function fanDateKey(value){
  const d = new Date(value || game?.currentDate || '');
  if(Number.isNaN(d.getTime())) return String(value || game?.currentDate || '');
  return d.toISOString().slice(0,10);
}
function fanRecentStats(clubId=game?.selectedClubId){
  ensureFanState();
  const id = Number(clubId || 0);
  const todayKey = fanDateKey(game?.currentDate || '');
  const today = new Date(game?.currentDate || '');
  const minDate = new Date(today);
  if(!Number.isNaN(minDate.getTime())) minDate.setDate(minDate.getDate() - 29);
  let todayDelta = 0;
  let last30 = 0;
  const addIfRelevant = (entry) => {
    if(Number(entry?.clubId || 0) !== id) return;
    const delta = Math.round(Number(entry?.delta || 0));
    if(!delta) return;
    const key = fanDateKey(entry?.date || '');
    if(key === todayKey) todayDelta += delta;
    const d = new Date(entry?.date || '');
    if(Number.isNaN(today.getTime()) || Number.isNaN(d.getTime()) || d >= minDate) last30 += delta;
  };
  (game?.fans?.history || []).forEach(addIfRelevant);
  (game?.fans?.memberCampaignHistory || []).forEach(addIfRelevant);
  return { todayDelta, last30 };
}


function memberCampaignsMarkup(){
  ensureFanState();
  const active = typeof activeMemberCampaignsForClub === 'function' ? activeMemberCampaignsForClub(game.selectedClubId) : [];
  const options = (STADIUM_MEMBER_CAMPAIGNS || []).map(item => {
    const activeCampaign = active.find(campaign => String(campaign.templateId || '') === String(item.id));
    const canPay = Number(game?.budget || 0) >= Number(item.cost || 0);
    if(activeCampaign){
      const total = Math.max(1, Number(activeCampaign.durationDays || activeCampaign.daysLeft || item.durationDays || 1));
      const left = Math.max(0, Number(activeCampaign.daysLeft || 0));
      const progress = clamp(Math.round(((total - left) / total) * 100), 0, 100);
      return `<div class="member-campaign-option member-campaign-running">
        <div><strong>${escapeHtml(item.name || activeCampaign.name || 'Campaña de Marketing')}</strong><p class="muted small">Inversión ${formatMoney(item.cost || activeCampaign.investment || 0)} · Duración ${formatDays(item.durationDays || activeCampaign.durationDays || 0)}</p></div>
        <div class="member-campaign-progress-inline"><span class="pill ok">${formatDays(left)} restantes</span><div class="project-progress"><span style="width:${progress}%"></span></div></div>
      </div>`;
    }
    return `<div class="member-campaign-option ${canPay ? '' : 'dim-row'}">
      <div><strong>${escapeHtml(item.name || 'Campaña de Marketing')}</strong><p class="muted small">Inversión ${formatMoney(item.cost || 0)} · Duración ${formatDays(item.durationDays || 0)}</p></div>
      <button class="ghost small-btn" data-start-member-campaign="${escapeHtml(item.id)}" ${canPay ? '' : 'disabled'}>Iniciar</button>
    </div>`;
  }).join('');
  return `<div class="member-campaigns-box">
    <div class="row"><div><h4>Hacer campañas para sumar socios</h4><p class="muted small">Se muestra inversión, duración y progreso. La captación diaria exacta de cada campaña queda oculta.</p></div></div>
    <div class="stack">${options || '<p class="muted small">No hay campañas configuradas.</p>'}</div>
  </div>`;
}

function botFieldAuditMarkup(){
  const audit = botFieldAudit(game);
  const needsPetition = audit.invalid > 0 || audit.massUnplayable;
  const tone = needsPetition ? 'warn' : 'ok';
  const detail = audit.massUnplayable
    ? `Varios clubes rivales tienen el campo en condiciones inaceptables. La dirigencia puede pedir que se cumplan las condiciones mínimas antes de los próximos partidos.`
    : needsPetition
      ? `Se detectaron ${audit.invalid} estadios rivales por debajo de las condiciones mínimas. La dirigencia puede elevar un reclamo formal.`
      : `La revisión de estadios rivales no encontró campos en condiciones inaceptables.`;
  return `<div class="card stadium-card bot-field-audit ${tone}" style="margin-top:14px">
    <div class="row"><div><h3>Petitorio a la Federación Argentina</h3><p class="muted small">${escapeHtml(detail)}</p></div><span class="pill ${tone}">${needsPetition ? 'Reclamo disponible' : 'Sin reclamo'}</span></div>
    <div class="row" style="margin-top:10px"><button id="btnRepairBotFields" class="ghost">Presentar petitorio a la Federación Argentina</button></div>
  </div>`;
}
function repairBotFieldsFromUi(){
  const result = repairInvalidBotFieldStates(game, 'manual_stadium_audit', { message:true });
  if(result.repaired){
    saveLocal(true);
    renderStadium();
    showNotice(`La Federación Argentina recibió el petitorio. Campos corregidos: ${result.repaired}.`);
  } else {
    showNotice('La Federación Argentina no encontró campos rivales fuera de reglamento.');
  }
}



function stadiumExpansionProjectMarkup(project){
  const total = Math.max(1, Number(project.totalDays || project.daysLeft || 1));
  const left = Math.max(0, Number(project.daysLeft || 0));
  const progress = clamp(Math.round(((total - left) / total) * 100), 0, 100);
  return `<div class="stadium-expansion-active">
    <div class="row"><div><strong>${escapeHtml(project.name)}</strong><p class="muted small">Slot ${escapeHtml(project.slot || '—')} · +${new Intl.NumberFormat('es-AR').format(project.capacityGain || 0)} lugares</p></div><span class="pill">${left} día(s)</span></div>
    <div class="project-progress"><span style="width:${progress}%"></span></div>
  </div>`;
}
function stadiumExpansionCard(expansion){
  const status = stadiumExpansionStartStatus(game.selectedClubId, expansion);
  const durationDays = typeof stadiumExpansionDurationDays === 'function' ? stadiumExpansionDurationDays(expansion) : Number(expansion.days || 1);
  return `<div class="stadium-expansion-option ${status.ok ? '' : 'dim-row'}">
    <div>
      <strong>#${expansion.id} · ${escapeHtml(expansion.name)}</strong>
      <p class="muted small">Desde ${new Intl.NumberFormat('es-AR').format(expansion.minCapacity)} · +${new Intl.NumberFormat('es-AR').format(expansion.capacityGain)} lugares · ${durationDays} día(s) · Slot ${escapeHtml(expansion.slot)}</p>
      <p class="small ${status.ok ? 'ok' : 'muted'}">${status.ok ? `Costo ${formatMoney(expansion.cost)}` : escapeHtml(status.reason)}</p>
    </div>
    <button class="primary" data-start-stadium-expansion="${expansion.id}" ${status.ok ? '' : 'disabled'}>Iniciar</button>
  </div>`;
}
function stadiumExpansionsMarkup(){
  const clubId = game.selectedClubId;
  const capacity = clubStadiumCapacity(clubId);
  const baseCapacity = baseStadiumCapacityForClub(clubId);
  const active = activeStadiumExpansionProjects(clubId);
  const available = availableStadiumExpansionsForClub(clubId).slice(0, 12);
  const maxWorks = maxSimultaneousStadiumWorks(capacity);
  const penalty = stadiumConstructionAttendancePenalty(clubId);
  const nextLocked = (STADIUM_EXPANSIONS || []).filter(item => capacity < Number(item.minCapacity || 0)).slice(0, 3);
  return `<div class="card stadium-card stadium-expansions-card" style="margin-top:14px">
    <div class="row"><div><h3>Ampliaciones</h3><p class="muted small">La capacidad nueva cuenta recién cuando la obra termina. No se pueden repetir slots y las obras integrales bloquean cualquier otra obra. Duración configurada: x${STADIUM_EXPANSION_DAYS_MULTIPLIER} sobre la tabla base.</p></div><span class="pill">${active.length}/${maxWorks} obra(s) activas</span></div>
    <div class="grid cols-4 stadium-expansion-summary">
      <div><p class="label">Capacidad base</p><strong>${new Intl.NumberFormat('es-AR').format(baseCapacity)}</strong></div>
      <div><p class="label">Capacidad actual</p><strong>${new Intl.NumberFormat('es-AR').format(capacity)}</strong></div>
      <div><p class="label">Máximo</p><strong>${new Intl.NumberFormat('es-AR').format(STADIUM_EXPANSION_MAX_CAPACITY)}</strong></div>
      <div><p class="label">Penalización asistencia</p><strong class="${penalty > 0 ? 'warn' : ''}">${Math.round(penalty * 100)}%</strong></div>
    </div>
    ${active.length ? `<h4>Obras en construcción</h4><div class="stack">${active.map(stadiumExpansionProjectMarkup).join('')}</div>` : '<p class="muted small">No hay obras activas.</p>'}
    <h4 style="margin-top:14px">Obras disponibles</h4>
    <div class="stack">${available.length ? available.map(stadiumExpansionCard).join('') : '<p class="muted small">No hay ampliaciones disponibles para la capacidad actual o el estadio llegó al máximo.</p>'}</div>
    ${nextLocked.length ? `<p class="muted small" style="margin-top:12px">Próximos umbrales: ${nextLocked.map(item => `${escapeHtml(item.name)} desde ${new Intl.NumberFormat('es-AR').format(item.minCapacity)}`).join(' · ')}</p>` : ''}
  </div>`;
}
function renderStadium(){
  ensureStadiumState();
  ensureSponsorState();
  const club = seed.clubs.find(c=>c.id===game.selectedClubId);
  const score = fieldScoreForClub(game.selectedClubId);
  const label = fieldConditionName(score);
  const project = stadiumProjectForClub(game.selectedClubId);
  ensureFanState();
  const currentFans = clubFansCurrent(game.selectedClubId);
  const baseFans = clubFansBase(game.selectedClubId);
  const capacity = clubStadiumCapacity(game.selectedClubId);
  const constructionPenalty = stadiumConstructionAttendancePenalty(game.selectedClubId);
  const effectiveCapacity = Math.max(0, Math.floor(capacity * (1 - constructionPenalty)));
  const ticketPrice = ticketPriceForClub(game.selectedClubId);
  const lastFanDelta = Math.round(Number(game?.fans?.clubs?.[game.selectedClubId]?.lastDelta || 0));
  const lastFanClass = lastFanDelta >= 0 ? 'ok' : 'bad';
  const fanStats = fanRecentStats(game.selectedClubId);
  const todayFanClass = fanStats.todayDelta >= 0 ? 'ok' : 'bad';
  const monthFanClass = fanStats.last30 >= 0 ? 'ok' : 'bad';
  const replantActive = project.replantingTurnsLeft > 0;
  const patchActive = project.patchingTurnsLeft > 0;
  const replantProgress = replantActive ? Math.round(((REPLANT_TURNS - project.replantingTurnsLeft) / REPLANT_TURNS) * 100) : 0;
  const patchProgress = patchActive ? Math.round(((PATCH_TURNS - project.patchingTurnsLeft) / PATCH_TURNS) * 100) : 0;
  const fieldMaintenanceBlocked = typeof managerChallengeBlocks === 'function' && managerChallengeBlocks('fieldMaintenance');
  const lastCapacityDecay = Array.isArray(game?.stadium?.capacityDeteriorationHistory) ? game.stadium.capacityDeteriorationHistory.slice().reverse().find(item => Number(item.clubId || 0) === Number(game.selectedClubId)) : null;
  view.innerHTML = `
    <div class="row section-title">
      <div>
        <h2>Estadio</h2>
        <p class="tagline">Estado del campo de ${escapeHtml(clubName(game.selectedClubId))}. Cada partido como local nuestro campo de juego empeora, dale mantenimiento para evitar lesiones y dificultades para dar pases precisos.</p>
      </div>
      <div class="pill">Presupuesto: ${formatMoney(game.budget || 0)}</div>
    </div>
    <div class="grid cols-2">
      <div class="card stadium-card">
        <div class="row" style="align-items:flex-start">
          <div>
            <h3>Campo de juego</h3>
            <p class="label">Estado actual</p>
          </div>
          <span class="pill">Mantenimiento</span>
        </div>
        <div class="stadium-score-row"><strong class="field-state ${fieldConditionClass(score)}">${escapeHtml(label)}</strong><span>${score}/100</span></div>
        ${fieldBar(score, label)}
        ${fieldMaintenanceBlocked ? '<p class="muted small danger">Reto activo: no se puede replantar ni reparar el campo.</p>' : ''}
        <p class="stadium-identity-line">${escapeHtml(clubStadiumName(game.selectedClubId))} · Capacidad ${new Intl.NumberFormat('es-AR').format(capacity)}${constructionPenalty > 0 ? ` · Aforo partido con obras ${new Intl.NumberFormat('es-AR').format(effectiveCapacity)}` : ''}</p>
        <p class="muted small">Deterioro anual del estadio: -${Number(STADIUM_CAPACITY_SEASON_DECAY_PCT || 0)}% de capacidad al cambiar de temporada.${lastCapacityDecay ? ` Último deterioro: -${new Intl.NumberFormat('es-AR').format(lastCapacityDecay.lost || 0)} lugares.` : ''}</p>
        <div class="stack" style="margin-top:14px">
          <div class="maintenance-option">
            <div><strong>Replantar todo</strong><p class="muted small">Costo ${formatMoney(REPLANT_COST)}. Durante 35 días el campo queda muy malo; al finalizar sube a 99.</p></div>
            <button id="btnReplant" class="primary" ${fieldMaintenanceBlocked || replantActive || patchActive || (game.budget || 0) < REPLANT_COST ? 'disabled' : ''}>Replantar</button>
          </div>
          <div class="maintenance-option">
            <div><strong>Regar y parchar campo de juego</strong><p class="muted small">Costo ${formatMoney(PATCH_COST)}. Mejora el campo durante los próximos 21 días.</p></div>
            <button id="btnPatch" class="ghost" ${fieldMaintenanceBlocked || replantActive || patchActive || (game.budget || 0) < PATCH_COST ? 'disabled' : ''}>Regar y parchar</button>
          </div>
        </div>
      </div>
      <div class="card stadium-card">
        <h3>Hinchada y entradas</h3>
        <div class="grid cols-3">
          <div><p class="label">Hinchas Totales</p><strong>${new Intl.NumberFormat('es-AR').format(currentFans)}</strong></div>
          <div><p class="label">Vitalicios</p><strong>${new Intl.NumberFormat('es-AR').format(baseFans)}</strong></div>
          <div><p class="label">Nuevos socios</p><strong class="${lastFanClass}">${lastFanDelta >= 0 ? '+' : ''}${new Intl.NumberFormat('es-AR').format(lastFanDelta)}</strong></div>
          <div><p class="label">Nuevos socios diarios</p><strong class="${todayFanClass}">${fanStats.todayDelta >= 0 ? '+' : ''}${new Intl.NumberFormat('es-AR').format(fanStats.todayDelta)}</strong></div>
          <div><p class="label">Socios últimos 30 días</p><strong class="${monthFanClass}">${fanStats.last30 >= 0 ? '+' : ''}${new Intl.NumberFormat('es-AR').format(fanStats.last30)}</strong></div>
          <div><p class="label">Socios campaña activos</p><strong>${new Intl.NumberFormat('es-AR').format((game?.fans?.memberCampaigns || []).filter(campaign => Number(campaign.clubId || 0) === Number(game.selectedClubId) && Number(campaign.daysLeft || 0) > 0).length)}</strong></div>
        </div>
        <label for="ticketPriceInput" style="margin-top:14px">Precio de entrada</label>
        <input id="ticketPriceInput" type="number" min="${TICKET_PRICE_MIN}" max="${TICKET_PRICE_MAX}" step="10" value="${ticketPrice}">
        <p class="muted small">Mínimo ${formatMoney(TICKET_PRICE_MIN)} y máximo ${formatMoney(TICKET_PRICE_MAX)}. Entradas baratas protegen caídas por mala posición; entradas caras limitan el crecimiento de hinchas.</p>
        ${memberCampaignsMarkup()}
      </div>
    </div>
    ${replantActive ? `<div class="card stadium-progress-card" style="margin-top:14px"><div class="row"><h3>Replantando</h3><span class="pill">${formatDaysFromTurns(project.replantingTurnsLeft)} restante(s)</span></div><div class="project-progress"><span style="width:${replantProgress}%"></span></div><p class="muted small">Durante el replante el campo se mantiene en estado muy malo. Al finalizar pasará a 99.</p></div>` : ''}
    ${patchActive ? `<div class="card stadium-progress-card" style="margin-top:14px"><div class="row"><h3>Regando y parchando campo de juego</h3><span class="pill">${formatDaysFromTurns(project.patchingTurnsLeft)} restante(s)</span></div><div class="project-progress"><span style="width:${patchProgress}%"></span></div><p class="muted small">El campo mejora progresivamente mientras dura el mantenimiento.</p></div>` : ''}
    ${stadiumExpansionsMarkup()}
    ${botFieldAuditMarkup()}
    <div class="card sponsors-card" style="margin-top:14px">
      <div class="row"><div><h3>Sponsors</h3><p class="muted small">Llegan entre 20 y 40 ofertas por temporada. Cada propuesta vence en 5 días y puede pagar todo al inicio o por día.</p></div></div>
      ${sponsorPlacesMarkup()}
      <h4>Ofertas disponibles</h4>
      ${sponsorOffersMarkup()}
      <h4 style="margin-top:14px">Contratos activos</h4>
      ${activeSponsorsMarkup()}
    </div>
  `;
  $('ticketPriceInput')?.addEventListener('change', event => {
    const price = setTicketPriceForClub(game.selectedClubId, event.target.value);
    saveLocal(true);
    renderStadium();
    showNotice(`Precio de entrada actualizado a ${formatMoney(price)}.`);
  });
  $('btnReplant')?.addEventListener('click', startReplantingField);
  $('btnPatch')?.addEventListener('click', startPatchingField);
  $('btnRepairBotFields')?.addEventListener('click', repairBotFieldsFromUi);
  document.querySelectorAll('[data-start-stadium-expansion]').forEach(btn => btn.addEventListener('click', () => startStadiumExpansion(btn.dataset.startStadiumExpansion)));
  document.querySelectorAll('[data-accept-sponsor]').forEach(btn => btn.addEventListener('click', () => acceptSponsorOffer(btn.dataset.acceptSponsor)));
  document.querySelectorAll('[data-reject-sponsor]').forEach(btn => btn.addEventListener('click', () => rejectSponsorOffer(btn.dataset.rejectSponsor)));
  document.querySelectorAll('[data-start-member-campaign]').forEach(btn => btn.addEventListener('click', () => startMemberCampaign(btn.dataset.startMemberCampaign)));
}

function promotionPlayoffTieForMatch(match){
  const tieId = String(match?.playoffTieId || '');
  if(!tieId) return null;
  const ties = game?.argentinaPlayoffs?.ties;
  return Array.isArray(ties) ? ties.find(tie => String(tie.id) === tieId) || null : null;
}
function matchVisibleInFixtureDivision(match, division){
  if(!match || !division) return false;
  const divisionId = String(division.id || '');
  const directDivisionId = String(match.divisionId || seed.clubs.find(c=>c.id===match.homeId)?.divisionId || 'default');
  if(directDivisionId === divisionId) return true;
  if(match.promotionPlayoff || match.playoffTieId){
    if(String(match.upperDivisionId || '') === divisionId || String(match.lowerDivisionId || '') === divisionId) return true;
    const tie = promotionPlayoffTieForMatch(match);
    if(tie && (String(tie.upperDivisionId || '') === divisionId || String(tie.lowerDivisionId || '') === divisionId)) return true;
  }
  return false;
}
function fixtureRoundTitle(round){
  if(round?.playoffRound || round?.matches?.some(m => m?.promotionPlayoff)){
    const stage = String(round.playoffStage || round.matches?.find(m => m?.promotionPlayoff)?.playoffStage || '').toUpperCase();
    if(stage.includes('VUELTA')) return 'Playoffs VUELTA';
    if(stage.includes('IDA')) return 'Playoffs IDA';
  }
  return round?.title || (typeof playoffRoundMatchdayLabel === 'function' ? playoffRoundMatchdayLabel(round?.matchday) : `Fecha ${round?.matchday || ''}`);
}

function renderFixture(){
  if(typeof repairClubWorldCupGroupFixtureDates === 'function') repairClubWorldCupGroupFixtureDates();
  const divisions = seed.divisions || [{ id:'default', name:'Liga única' }];
  const ownClubId = Number(game?.selectedClubId || 0);
  const showCup = fixtureViewMode === 'clubWorldCup';
  const showMine = fixtureViewMode !== 'league' && !showCup;
  const visibleDivisions = selectedFixtureDivision === 'all' ? divisions : divisions.filter(d => d.id === selectedFixtureDivision);
  if(showCup){
    const cupRounds = (game.fixtures || []).filter(round => round?.clubWorldCupRound || (round.matches || []).some(match => match?.clubWorldCup));
    const cupHtml = cupRounds.map(round => `<div class="card"><div class="row"><h3>${escapeHtml(fixtureRoundTitle(round))}</h3><span class="pill">${round.startDate && round.endDate && round.startDate !== round.endDate ? `${round.startDate} → ${round.endDate}` : round.date}</span></div><div class="grid cols-2">${(round.matches || []).filter(match => match?.clubWorldCup).map(matchCard).join('')}</div></div>`).join('');
    view.innerHTML = `
      <div class="row section-title fixture-title-row">
        <div><h2>Calendario</h2><p class="tagline">Mundial de Clubes: sede neutral, grupos y eliminatorias.</p></div>
        <div class="fixture-controls row">
          <button type="button" id="btnMyFixture" class="ghost">Mi calendario</button>
          <button type="button" id="btnClubWorldCupFixture" class="primary">Mundial de Clubes</button>
          <div class="division-filter"><label for="fixtureDivisionFilter">Liga</label><select id="fixtureDivisionFilter">${divisionOptions(selectedFixtureDivision)}</select></div>
        </div>
      </div>
      <div class="stack">${cupHtml || '<div class="card"><p class="muted">El Mundial de Clubes todavía no se generó en esta temporada.</p><p class="small muted">El sorteo y fixture quedan listos en el día 295 si las ligas ya terminaron. Los grupos se muestran desde ese momento; la fecha 1 se programa como mínimo 18 días después del sorteo y de la última jornada de liga. Fechas 2 y 3 van cada 5 días; las eliminatorias se agregan fase por fase.</p></div>'}</div>`;
    $('btnMyFixture')?.addEventListener('click', () => { fixtureViewMode = 'mine'; renderFixture(); });
    $('btnClubWorldCupFixture')?.addEventListener('click', () => { fixtureViewMode = 'clubWorldCup'; renderFixture(); });
    $('fixtureDivisionFilter')?.addEventListener('change', event => { selectedFixtureDivision = event.target.value; fixtureViewMode = 'league'; renderFixture(); });
    return;
  }
  const html = game.fixtures.map(round=>{
    if(showMine){
      const matches = round.matches.filter(m => Number(m.homeId) === ownClubId || Number(m.awayId) === ownClubId);
      if(!matches.length) return '';
      return `<div class="card own-fixture-round"><div class="row"><h3>${escapeHtml(fixtureRoundTitle(round))}</h3><span class="pill">${round.startDate && round.endDate && round.startDate !== round.endDate ? `${round.startDate} → ${round.endDate}` : round.date}</span></div><div class="grid cols-2">${matches.map(matchCard).join('')}</div></div>`;
    }
    const groups = visibleDivisions.map(division => {
      const matches = round.matches.filter(m => matchVisibleInFixtureDivision(m, division));
      if(!matches.length) return '';
      return `<div class="fixture-division-block"><h4>${escapeHtml(division.name)}</h4><div class="grid cols-2">${matches.map(matchCard).join('')}</div></div>`;
    }).join('');
    return `<div class="card"><div class="row"><h3>${escapeHtml(fixtureRoundTitle(round))}</h3><span class="pill">${round.startDate && round.endDate && round.startDate !== round.endDate ? `${round.startDate} → ${round.endDate}` : round.date}</span></div>${groups || '<p class="muted">Sin partidos para esta división.</p>'}</div>`;
  }).filter(Boolean).join('');
  view.innerHTML = `
    <div class="row section-title fixture-title-row">
      <div><h2>Calendario</h2><p class="tagline">Por defecto se muestra el calendario de tu club. Los partidos jugados son clickeables para ver estadísticas y eventos.</p></div>
      <div class="fixture-controls row">
        <button type="button" id="btnMyFixture" class="${showMine ? 'primary' : 'ghost'}">Mi calendario</button>
        <button type="button" id="btnClubWorldCupFixture" class="${showCup ? 'primary' : 'ghost'}">Mundial de Clubes</button>
        <div class="division-filter"><label for="fixtureDivisionFilter">Liga</label><select id="fixtureDivisionFilter">${divisionOptions(selectedFixtureDivision)}</select></div>
      </div>
    </div>
    <div class="stack">${html || '<div class="card"><p class="muted">Sin partidos para mostrar.</p></div>'}</div>`;
  $('btnMyFixture')?.addEventListener('click', () => { fixtureViewMode = 'mine'; renderFixture(); });
  $('btnClubWorldCupFixture')?.addEventListener('click', () => { fixtureViewMode = 'clubWorldCup'; renderFixture(); });
  $('fixtureDivisionFilter')?.addEventListener('change', event => { selectedFixtureDivision = event.target.value; fixtureViewMode = 'league'; renderFixture(); });
}
function matchCard(m){
  const events = game.matchHistory.find(x=>x.id===m.id);
  const clickable = m.played ? 'clickable' : '';
  const attr = m.played ? `data-match-id="${escapeHtml(m.id)}"` : '';
  const playoffNote = m.promotionPlayoff ? `<div class="match-date-line playoff-note">${escapeHtml(`Playoffs ${String(m.playoffStage || '').toUpperCase() || ''}`.trim())} · mismo partido en ambas ligas</div>` : '';
  const cupMeta = m.clubWorldCup ? `${m.stadiumName || 'Sede neutral'}${m.clubWorldCupGroup ? ` · Grupo ${m.clubWorldCupGroup}` : ''}${m.clubWorldCupBracketKey ? ` · ${m.clubWorldCupBracketKey}` : ''}` : '';
  const cupNote = m.clubWorldCup ? `<div class="match-date-line playoff-note">${escapeHtml(cupMeta)}</div>` : '';
  const penalties = m.penaltyShootout ? ` <span class="small muted">(${Number(m.penaltyShootout.home || 0)}-${Number(m.penaltyShootout.away || 0)} pen.)</span>` : '';
  const foulsTie = m.clubWorldCupTiebreaker ? ` <span class="small muted">(desempate faltas ${Number(m.clubWorldCupTiebreaker.homeFouls || 0)}-${Number(m.clubWorldCupTiebreaker.awayFouls || 0)})</span>` : '';
  return `<button class="match-card ${clickable}" ${attr}>
    <div class="match-date-line">${escapeHtml(typeof matchDateLabel === 'function' ? matchDateLabel(m.date) : (m.date || ''))}</div>
    ${playoffNote}${cupNote}
    <div class="match-line">
      <div>${clubSpan(m.homeId)}</div>
      <strong class="score">${m.played ? `${m.homeGoals} - ${m.awayGoals}${penalties}${foulsTie}` : 'vs'}</strong>
      <div>${clubSpan(m.awayId)}</div>
    </div>
    ${events ? `<div class="events">${events.goals.slice(0,4).map(g=>`${g.minute}' ${escapeHtml(playerById(g.playerId)?.name || 'Jugador')}`).join(' · ')}${events.goals.length>4?' · ...':''}</div>` : ''}
  </button>`;
}

function standingsHistoryEntries(){
  const history = typeof normalizeStandingsHistoryState === 'function' ? normalizeStandingsHistoryState(game?.standingsHistory || {}) : (game?.standingsHistory || { seasons:[] });
  return Array.isArray(history.seasons) ? history.seasons.slice().sort((a,b)=>Number(b.year || 0)-Number(a.year || 0)) : [];
}
function currentStandingsYearKey(){
  return `current-${Number(game?.seasonYear || seasonYearForNumber?.(game?.seasonNumber || 1) || new Date().getFullYear())}`;
}
function standingsYearOptionsMarkup(selected){
  const currentYear = Number(game?.seasonYear || (typeof seasonYearForNumber === 'function' ? seasonYearForNumber(game?.seasonNumber || 1) : new Date().getFullYear()));
  const currentKey = currentStandingsYearKey();
  const opts = [`<option value="${escapeHtml(currentKey)}" ${selected === currentKey || selected === 'current' ? 'selected' : ''}>${currentYear} · actual</option>`];
  standingsHistoryEntries().forEach(entry => {
    const key = `history-${Number(entry.season || 0)}-${Number(entry.year || 0)}`;
    opts.push(`<option value="${escapeHtml(key)}" ${selected === key ? 'selected' : ''}>${Number(entry.year || 0)} · Temp. ${Number(entry.season || 0)}</option>`);
  });
  return `<div class="division-filter standings-year-filter"><label for="standingsYearFilter">Año</label><select id="standingsYearFilter">${opts.join('')}</select></div>`;
}
function selectedStandingsHistoryEntry(){
  const selected = String(selectedStandingsYear || 'current');
  if(!selected.startsWith('history-')) return null;
  const parts = selected.split('-');
  const season = Number(parts[1] || 0);
  const year = Number(parts[2] || 0);
  return standingsHistoryEntries().find(entry => Number(entry.season || 0) === season && Number(entry.year || 0) === year) || null;
}
function standingsRowsForDisplay(divisionId){
  const historical = selectedStandingsHistoryEntry();
  if(historical){
    return Array.isArray(historical.divisions?.[divisionId]) ? historical.divisions[divisionId].slice().sort((a,b)=>Number(a.position || 999)-Number(b.position || 999)) : [];
  }
  return sortedStandings(divisionId);
}
function standingsDisplaySubtitle(){
  const historical = selectedStandingsHistoryEntry();
  if(!historical) return '';
  return `<p class="muted small">Tabla histórica guardada al cierre de la temporada ${Number(historical.season || 0)}.</p>`;
}


function competitionsNavMarkup(active='standings'){
  const current = String(active || 'standings');
  return `<div class="row competition-controls">
    <button type="button" id="btnCompetitionStandings" class="${current === 'standings' ? 'primary' : 'ghost'}">Tabla de posiciones</button>
    <button type="button" id="btnCompetitionChampions" class="${current === 'champions' ? 'primary' : 'ghost'}">Campeones</button>
  </div>`;
}
function bindCompetitionsNav(){
  $('btnCompetitionStandings')?.addEventListener('click', () => { selectedCompetitionView = 'standings'; renderStandings(); });
  $('btnCompetitionChampions')?.addEventListener('click', () => { selectedCompetitionView = 'champions'; renderStandings(); });
}
function competitionChampionEntriesFromStandingsHistory(){
  const entries = [];
  standingsHistoryEntries().forEach(entry => {
    Object.entries(entry.divisions || {}).forEach(([divisionId, rows]) => {
      if(!Array.isArray(rows) || !rows.length) return;
      const champion = rows.slice().sort((a,b)=>Number(a.position || 999)-Number(b.position || 999))[0];
      if(!champion?.clubId) return;
      const division = (seed?.divisions || []).find(item => String(item.id || '') === String(divisionId));
      entries.push({
        season:Number(entry.season || 0),
        year:Number(entry.year || 0),
        type:'league',
        competitionId:String(divisionId),
        competitionName:division?.name || String(divisionId),
        championId:Number(champion.clubId || 0),
        championName:clubName(champion.clubId),
        createdAt:String(entry.createdAt || '')
      });
    });
  });
  return entries;
}
function competitionChampionsHistoryEntries(){
  const explicit = typeof normalizeCompetitionChampionsHistoryState === 'function'
    ? normalizeCompetitionChampionsHistoryState(game?.competitionChampionsHistory || {}).entries
    : (Array.isArray(game?.competitionChampionsHistory?.entries) ? game.competitionChampionsHistory.entries : []);
  const merged = [];
  const seen = new Set();
  [...explicit, ...competitionChampionEntriesFromStandingsHistory()].forEach(entry => {
    const season = Number(entry.season || 0);
    const competitionId = String(entry.competitionId || entry.divisionId || '');
    const championId = Number(entry.championId || entry.clubId || 0);
    if(!season || !competitionId || !championId) return;
    const key = `${season}-${competitionId}`;
    if(seen.has(key)) return;
    seen.add(key);
    merged.push({
      season,
      year:Number(entry.year || seasonYearForNumber(season)),
      type:String(entry.type || 'league'),
      competitionId,
      competitionName:String(entry.competitionName || entry.divisionName || competitionId),
      championId,
      championName:String(entry.championName || clubName(championId)),
      runnerUpId:Number(entry.runnerUpId || 0),
      runnerUpName:entry.runnerUpName ? String(entry.runnerUpName) : (entry.runnerUpId ? clubName(entry.runnerUpId) : ''),
      thirdPlaceId:Number(entry.thirdPlaceId || 0),
      thirdPlaceName:entry.thirdPlaceName ? String(entry.thirdPlaceName) : (entry.thirdPlaceId ? clubName(entry.thirdPlaceId) : '')
    });
  });
  merged.sort((a,b)=>(Number(b.year || 0)-Number(a.year || 0)) || (Number(b.season || 0)-Number(a.season || 0)) || String(a.competitionName || '').localeCompare(String(b.competitionName || '')));
  return merged;
}
function renderChampionsHistory(){
  const entries = competitionChampionsHistoryEntries();
  const grouped = new Map();
  entries.forEach(entry => {
    const key = `${Number(entry.year || 0)} · Temp. ${Number(entry.season || 0)}`;
    if(!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(entry);
  });
  const blocks = Array.from(grouped.entries()).map(([label, items]) => {
    const rows = items.map(entry => {
      const extra = entry.type === 'club_world_cup'
        ? `${entry.runnerUpId ? `Subcampeón: ${escapeHtml(entry.runnerUpName || clubName(entry.runnerUpId))}` : ''}${entry.thirdPlaceId ? `${entry.runnerUpId ? ' · ' : ''}3°: ${escapeHtml(entry.thirdPlaceName || clubName(entry.thirdPlaceId))}` : ''}`
        : '';
      return `<tr>
        <td>${escapeHtml(entry.competitionName)}</td>
        <td>${clubLink(entry.championId)}</td>
        <td>${entry.type === 'club_world_cup' ? 'Mundial de Clubes' : 'Liga'}</td>
        <td class="muted small">${extra || '—'}</td>
      </tr>`;
    }).join('');
    return `<div class="card"><div class="row"><h3>${escapeHtml(label)}</h3><span class="pill">${items.length} competición(es)</span></div><div class="table-wrap"><table><thead><tr><th>Competición</th><th>Campeón</th><th>Tipo</th><th>Detalle</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
  }).join('');
  view.innerHTML = `
    <div class="row section-title">
      <div><h2>Competiciones</h2><p class="tagline">Histórico de palmarés: campeones de cada liga y de la Copa Mundial de Clubes por temporada.</p></div>
      ${competitionsNavMarkup('champions')}
    </div>
    <div class="stack">${blocks || '<div class="card"><p class="muted">Todavía no hay campeones guardados. El palmarés se completa al cerrar temporadas y al finalizar el Mundial de Clubes.</p></div>'}</div>`;
  bindCompetitionsNav();
}
function renderStandings(){
  if(String(selectedCompetitionView || 'standings') === 'champions'){ renderChampionsHistory(); return; }
  const divisions = seed.divisions || [{ id:'default', name:'Liga única' }];
  const managerDivision = typeof managerCurrentDivisionId === 'function' ? managerCurrentDivisionId() : (game?.selectedLeagueId || divisions[0]?.id || 'default');
  const currentKey = currentStandingsYearKey();
  const validYearKeys = new Set([currentKey, 'current', ...standingsHistoryEntries().map(entry => `history-${Number(entry.season || 0)}-${Number(entry.year || 0)}`)]);
  if(!validYearKeys.has(String(selectedStandingsYear || 'current'))) selectedStandingsYear = currentKey;
  if(selectedStandingsDivision !== 'all' && !divisions.some(d => d.id === selectedStandingsDivision)){
    selectedStandingsDivision = managerDivision;
  }
  const visibleDivisions = selectedStandingsDivision === 'all' ? divisions : divisions.filter(d => d.id === selectedStandingsDivision);
  const blocks = visibleDivisions.map(division => {
    const tableRows = standingsRowsForDisplay(division.id);
    const rows = tableRows.map((s,i)=>{
      const statusClass = standingsStatusClass(division.id, i, tableRows.length);
      const ownClass = s.clubId===game.selectedClubId ? 'own-club-row' : '';
      return `<tr class="${ownClass} ${statusClass}">
        <td><strong>${i+1}</strong></td><td>${clubLink(s.clubId)}</td><td>${s.pj}</td><td>${s.pg}</td><td>${s.pe}</td><td>${s.pp}</td><td>${s.gf}</td><td>${s.gc}</td><td>${s.dg}</td><td><strong>${s.pts}</strong></td>
      </tr>`;
    }).join('');
    return `<div class="card"><div class="row"><h3>${escapeHtml(division.name)}</h3></div><div class="table-wrap"><table><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th><th>PTS</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
  }).join('');
  view.innerHTML = `
    <div class="row section-title">
      <div><h2>Competiciones</h2><p class="tagline">Tablas de posiciones por liga y temporada.</p>${standingsDisplaySubtitle()}</div>
      <div class="row filters-row">${competitionsNavMarkup('standings')}${standingsYearOptionsMarkup(selectedStandingsYear)}${divisionFilterMarkup('standingsDivisionFilter', selectedStandingsDivision)}</div>
    </div>
    <div class="stack">${blocks || '<div class="card"><p class="muted">Sin datos para esta división.</p></div>'}</div>`;
  bindCompetitionsNav();
  $('standingsYearFilter')?.addEventListener('change', event => { selectedStandingsYear = event.target.value; renderStandings(); });
  $('standingsDivisionFilter')?.addEventListener('change', event => { selectedStandingsDivision = event.target.value; renderStandings(); });
}


function standingsStatusClass(divisionId, index, total){
  if(typeof clubWorldCupStandingStatusClass === 'function'){
    const cupClass = clubWorldCupStandingStatusClass(divisionId, index);
    if(cupClass) return cupClass;
  }
  if(typeof argentineStandingStatusClass === 'function'){
    const argClass = argentineStandingStatusClass(divisionId, index, total);
    if(argClass) return argClass;
  }
  const divisions = divisionOrderList();
  const current = divisions.findIndex(d => d.id === divisionId);
  if(index === 0) return current > 0 ? 'promotion-row' : 'champion-row';
  if(index === total - 1 && current >= 0 && current < divisions.length - 1) return 'relegation-row';
  return '';
}

function renderManagerStats(){
  game.managerStats = normalizeManagerStats(game.managerStats);
  const totals = game.managerStats.totals;
  const seasons = game.managerStats.seasons.slice().sort((a,b)=>(b.season || 0)-(a.season || 0));
  const career = (game.managerStats.careerHistory || []).slice().sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
  const breakdown = typeof managerPrestigeBreakdown === 'function' ? managerPrestigeBreakdown(game.managerStats) : { total:Number(game.managerStats.prestige || 0), experiencePrestige:0, winPrestige:0, objectivePrestige:0, championPrestige:0, badSeasonPenalty:0, dismissalPenalty:0 };
  const prestige = breakdown.total;
  const prestigeLabel = typeof formatManagerPrestige === 'function' ? formatManagerPrestige(prestige) : String(Math.floor(Number(prestige || 0)));
  const prestigeAccess = typeof managerClubAccessPrestige === 'function' ? managerClubAccessPrestige(prestige) : Math.floor(Number(prestige || 0));
  const localExperience = Number(game.managerStats.experience || 0);
  const experience = typeof currentManagerExperience === 'function' ? currentManagerExperience() : localExperience;
  const unlockedAchievements = typeof managerUnlockedAchievements === 'function' ? managerUnlockedAchievements() : [];
  const achievementTotal = typeof managerAchievementsCatalog === 'function' ? managerAchievementsCatalog().length : unlockedAchievements.length;
  const achievementRows = unlockedAchievements.map(item => `<div class="achievement-unlocked-card"><span class="achievement-icon">${escapeHtml(item.icono || '★')}</span><div><strong>${escapeHtml(item.titulo || 'Hito')}</strong><p class="small muted">${escapeHtml(item.descripcion || '')}</p><span class="pill">${escapeHtml(item.categoria || 'Manager')}</span></div></div>`).join('');
  const rows = seasons.map(item => {
    const objectiveName = item.objectiveLabel ? escapeHtml(item.objectiveLabel) : (Number.isFinite(Number(item.objectivePpg)) ? Number(item.objectivePpg).toFixed(2) : '—');
    const objectiveLabel = Number.isFinite(Number(item.objectivePpg)) ? `${objectiveName} ${item.objectiveAchieved ? '<span class="ok">✓</span>' : '<span class="muted">×</span>'}` : objectiveName;
    const deltaLabel = Number.isFinite(Number(item.objectiveDelta)) ? ` <span class="small muted">${Number(item.objectiveDelta) >= 0 ? '+' : ''}${Number(item.objectiveDelta).toFixed(2)}</span>` : '';
    const prestigeLabel = Number.isFinite(Number(item.managerPrestigeObjectiveReward)) && Number(item.managerPrestigeObjectiveReward) !== 0 ? ` <span class="small ${Number(item.managerPrestigeObjectiveReward) > 0 ? 'ok' : 'danger'}">${Number(item.managerPrestigeObjectiveReward) > 0 ? '+' : ''}${Number(item.managerPrestigeObjectiveReward)}</span>` : '';
    return `<tr>
    <td>${item.season}</td>
    <td>${clubBadge(item.clubId)} ${escapeHtml(item.clubName || clubName(item.clubId))}</td>
    <td>${escapeHtml(item.divisionName || '—')}</td>
    <td><strong>${escapeHtml(item.label || (item.position === 1 ? 'Campeón' : `${item.position || '—'}°`))}</strong></td>
    <td>${objectiveLabel}${deltaLabel}${prestigeLabel}</td>
    <td>${Number(item.ppg || 0).toFixed(2)}</td>
    <td>${item.pts || 0}</td><td>${item.pg || 0}</td><td>${item.pe || 0}</td><td>${item.pp || 0}</td><td>${item.gf || 0}</td><td>${item.gc || 0}</td>
  </tr>`;
  }).join('');
  const careerRows = career.map(item => `<tr>
    <td>${item.season || '—'}</td>
    <td>${clubBadge(item.clubId)} ${escapeHtml(item.clubName || clubName(item.clubId))}</td>
    <td>${escapeHtml(item.divisionName || '—')}</td>
    <td>${item.position ? `${item.position}°` : '—'}</td>
    <td>${item.played || 0}</td>
    <td>${Number(item.ppg || 0).toFixed(2)}</td>
    <td>${escapeHtml(item.type === 'dismissal' ? 'Despido' : item.type || 'Cambio')}</td>
  </tr>`).join('');
  view.innerHTML = `<div class="row section-title"><div><h2>Tus estadísticas</h2><p class="tagline">Historial acumulado y prestigio propio de esta carrera.</p></div></div>
    <div class="grid cols-6 compact-team-stats">
      <div class="card manager-prestige-card"><p class="label">Prestigio manager</p><strong>${prestigeLabel}</strong><span class="small muted">Propio de este slot. Clubes de prestigio ${MANAGER_CLUB_OPEN_PRESTIGE} o menos: libres.</span></div>
      <div class="card"><p class="label">Puntos experiencia</p><strong>${experience}</strong><span class="small muted">Compartidos como perfil; el prestigio no se comparte entre slots.</span></div>
      <div class="card"><p class="label">Partidos</p><strong>${totals.played || 0}</strong></div>
      <div class="card"><p class="label">Ganados</p><strong>${totals.won || 0}</strong></div>
      <div class="card"><p class="label">Empatados</p><strong>${totals.drawn || 0}</strong></div>
      <div class="card"><p class="label">Perdidos</p><strong>${totals.lost || 0}</strong></div>
      <div class="card"><p class="label">GF / GC</p><strong>${totals.gf || 0} / ${totals.gc || 0}</strong></div>
      <div class="card"><p class="label">Títulos obtenidos</p><strong>${game.managerStats.titles || 0}</strong></div>
      <div class="card"><p class="label">Victorias p/ prestigio</p><strong>${Math.floor((totals.won || 0) / MANAGER_PRESTIGE_WINS_STEP)}</strong><span class="small muted">1 cada ${MANAGER_PRESTIGE_WINS_STEP} victorias</span></div>
      <div class="card"><p class="label">Objetivos / directiva</p><strong>${Number(breakdown.objectivePrestige || 0)}</strong><span class="small muted">dinámico por PPG vs objetivo</span></div>
      <div class="card"><p class="label">Títulos / penalizaciones</p><strong>${Number(breakdown.championPrestige || 0)} / -${Number(breakdown.badSeasonPenalty || 0) + Number(breakdown.dismissalPenalty || 0)}</strong></div>
      <div class="card"><p class="label">Hitos personales</p><strong>${unlockedAchievements.length}/${achievementTotal || 0}</strong><span class="small muted">lista oculta: se revela al conseguirlos</span></div>
    </div>
    <div class="card manager-achievements-card" style="margin-top:14px"><h3>Hitos y récords personales</h3><p class="muted small">Sólo se muestran los logros ya conseguidos. Los pendientes permanecen ocultos.</p><div class="manager-achievements-grid">${achievementRows || '<p class="muted">Todavía no desbloqueaste hitos personales.</p>'}</div></div>
    <div class="card" style="margin-top:14px"><h3>Finales de temporada</h3>
      <div class="table-wrap"><table><thead><tr><th>Temp.</th><th>Club</th><th>División</th><th>Posición</th><th>Objetivo</th><th>PPG</th><th>PTS</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th></tr></thead><tbody>${rows || '<tr><td colspan="12" class="muted">Aún no finalizaste ninguna temporada.</td></tr>'}</tbody></table></div>
    </div>
    <div class="card" style="margin-top:14px"><h3>Carrera laboral</h3>
      <div class="table-wrap"><table><thead><tr><th>Temp.</th><th>Club</th><th>División</th><th>Posición</th><th>PJ</th><th>PPG</th><th>Evento</th></tr></thead><tbody>${careerRows || '<tr><td colspan="7" class="muted">Sin cambios de club todavía.</td></tr>'}</tbody></table></div>
    </div>`;
}

function renderStats(){
  const divisions = seed.divisions || [{ id:'default', name:'Liga única' }];
  const managerDivision = typeof managerCurrentDivisionId === 'function' ? managerCurrentDivisionId() : (game?.selectedLeagueId || divisions[0]?.id || 'default');
  if(selectedStatsDivision !== 'all' && !divisions.some(d => d.id === selectedStatsDivision)){
    selectedStatsDivision = managerDivision;
  }
  const visibleDivisions = selectedStatsDivision === 'all' ? divisions : divisions.filter(d => d.id === selectedStatsDivision);
  const blocks = visibleDivisions.map(division => {
    const allowedClubs = new Set(seed.clubs.filter(c => (c.divisionId || 'default') === division.id).map(c => c.id));
    const stats = Object.values(game.playerStats).filter(s => allowedClubs.has(s.clubId));
    const scorers = stats.filter(s=>s.goals>0).sort((a,b)=>b.goals-a.goals).slice(0,20);
    const assists = stats.filter(s=>s.assists>0).sort((a,b)=>b.assists-a.assists).slice(0,20);
    const cards = stats.filter(s=>s.yellow>0 || s.red>0).sort((a,b)=>(b.red*3+b.yellow)-(a.red*3+a.yellow)).slice(0,20);
    const injuries = stats.filter(s=>s.injuries>0).sort((a,b)=>b.injuries-a.injuries).slice(0,20);
    return `<div class="card stats-division-block"><h3>${escapeHtml(division.name)}</h3><div class="grid cols-4">
      <div class="card inner"><h3>Goleadores</h3>${rankList(scorers,'goals')}</div>
      <div class="card inner"><h3>Asistidores</h3>${rankList(assists,'assists')}</div>
      <div class="card inner"><h3>Tarjetas</h3>${cardList(cards)}</div>
      <div class="card inner"><h3>Lesiones</h3>${rankList(injuries,'injuries')}</div>
    </div></div>`;
  }).join('');
  view.innerHTML = `
    <div class="row section-title">
      <div><h2>Estadísticas</h2><p class="tagline">Rankings separados por división.</p></div>
      ${divisionFilterMarkup('statsDivisionFilter', selectedStatsDivision)}
    </div>
    <div class="stack">${blocks || '<div class="card"><p class="muted">Sin datos para esta división.</p></div>'}</div>
  `;
  $('statsDivisionFilter')?.addEventListener('change', event => { selectedStatsDivision = event.target.value; renderStats(); });
}
function rankList(list,key){
  if(!list.length) return '<p class="muted">Sin datos todavía.</p>';
  return list.map((s,i)=>{ const p=playerById(s.playerId); return `<div class="stat-rank ${s.clubId===game.selectedClubId ? 'own-player-rank' : ''}"><span><span class="rank-num">${i+1}</span><button class="linklike" data-player-id="${s.playerId}">${escapeHtml(p?.name||'Jugador')}</button> <span class="pill ${s.clubId===game.selectedClubId ? 'club-pill-own' : ''}">${clubBadge(s.clubId)}</span></span><strong>${s[key]}</strong></div>`; }).join('');
}
function cardList(list){
  if(!list.length) return '<p class="muted">Sin tarjetas todavía.</p>';
  return list.map((s,i)=>{ const p=playerById(s.playerId); return `<div class="stat-rank ${s.clubId===game.selectedClubId ? 'own-player-rank' : ''}"><span><span class="rank-num">${i+1}</span><button class="linklike" data-player-id="${s.playerId}">${escapeHtml(p?.name||'Jugador')}</button> <span class="pill ${s.clubId===game.selectedClubId ? 'club-pill-own' : ''}">${clubBadge(s.clubId)}</span></span><strong><span class="yellow-card">■</span> ${s.yellow} / <span class="red-card">■</span> ${s.red}</strong></div>`; }).join('');
}
function sortedStandings(divisionId=null){
  if(!game) return [];
  const allowed = divisionId ? new Set(seed.clubs.filter(c => (c.divisionId || 'default') === divisionId).map(c => c.id)) : null;
  return Object.values(game.standings)
    .filter(s => !allowed || allowed.has(s.clubId))
    .sort((a,b)=> b.pts-a.pts || b.dg-a.dg || b.gf-a.gf || clubName(a.clubId).localeCompare(clubName(b.clubId)) );
}

