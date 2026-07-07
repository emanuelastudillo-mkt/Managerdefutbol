/* V3.28 · Menú ESPECIAL: cartas, sobres, puntos ocultos y bonus activos. */

function specialDatabase(){
  return specialSkillsDatabase && typeof specialSkillsDatabase === 'object' ? specialSkillsDatabase : { limites:{}, sobres:{}, cartas_base:[], puntos_ocultos:{ acciones:{} }, destruir_cartas:{ recuperacion_puntos:{} }, apilamiento_bonus:{} };
}
function specialLimits(){
  const db = specialDatabase();
  return {
    activeMax: Math.max(1, Math.round(Number(db.limites?.cartas_activas_max || 5))),
    reserveMax: Math.max(1, Math.round(Number(db.limites?.cartas_reserva_max || 50))),
    lockDays: Math.max(0, Math.round(Number(db.limites?.dias_bloqueo_cambio_cartas || 100))),
    allowOpenWhenReserveFull: db.limites?.permitir_abrir_sobres_con_reserva_llena === true,
    allowRepeatedActive: db.limites?.permitir_cartas_repetidas_activas !== false,
    stackBonuses: db.limites?.bonus_se_apilan !== false
  };
}
function createInitialSpecialState(managerName=''){
  return {
    manager_id: game?.saveCode || '',
    nombre_manager: managerName || storedManagerName() || '',
    puntos_habilidad: 0,
    cartas_activas: [],
    cartas_reserva: [],
    fecha_ultimo_cambio_cartas: null,
    bloqueado_hasta: null,
    historial_ultimas_cartas: [],
    puntos_log: []
  };
}
function normalizeSpecialCard(card, index=0){
  if(!card || typeof card !== 'object') return null;
  const base = specialCardBaseById(card.id_base || card.baseId) || {};
  const id = String(card.id_carta || card.id || `CARD-${Date.now()}-${index}-${hashNumber(JSON.stringify(card), 100000)}`);
  return {
    id_carta:id,
    id_base:String(card.id_base || base.id_base || ''),
    manager_id:String(card.manager_id || game?.saveCode || ''),
    nombre:String(card.nombre || base.nombre || 'Carta'),
    rareza:String(card.rareza || base.rareza || 'inutil'),
    tipo_bonus:card.tipo_bonus ?? base.tipo_bonus ?? null,
    valor_bonus:Number(card.valor_bonus ?? base.valor_bonus ?? 0) || 0,
    unidad:String(card.unidad || base.unidad || ''),
    activable:card.activable !== undefined ? Boolean(card.activable) : Boolean(base.activable),
    texto:String(card.texto || base.texto || ''),
    activa:Boolean(card.activa),
    destruida:Boolean(card.destruida),
    obtenida_en_turno:card.obtenida_en_turno ?? currentTurnIndex(),
    obtenida_desde_sobre:String(card.obtenida_desde_sobre || '')
  };
}
function normalizeSpecialState(state=null, managerName=''){
  const base = createInitialSpecialState(managerName);
  const source = state && typeof state === 'object' ? state : {};
  const normalized = { ...base, ...source };
  normalized.manager_id = String(normalized.manager_id || game?.saveCode || '');
  normalized.nombre_manager = String(normalized.nombre_manager || managerName || storedManagerName() || 'Manager');
  normalized.puntos_habilidad = Math.max(0, Math.round(Number(normalized.puntos_habilidad || 0)));
  const active = Array.isArray(normalized.cartas_activas) ? normalized.cartas_activas : [];
  const reserve = Array.isArray(normalized.cartas_reserva) ? normalized.cartas_reserva : [];
  normalized.cartas_activas = active.map((card, index) => normalizeSpecialCard(card, index)).filter(Boolean).map(card => ({ ...card, activa:true, destruida:false }));
  normalized.cartas_reserva = reserve.map((card, index) => normalizeSpecialCard(card, index)).filter(Boolean).filter(card => !card.destruida).map(card => ({ ...card, activa:false }));
  normalized.historial_ultimas_cartas = Array.isArray(normalized.historial_ultimas_cartas) ? normalized.historial_ultimas_cartas.slice(0, 30) : [];
  normalized.puntos_log = Array.isArray(normalized.puntos_log) ? normalized.puntos_log.slice(-80) : [];
  normalized.fecha_ultimo_cambio_cartas = validIsoDate(normalized.fecha_ultimo_cambio_cartas) ? normalized.fecha_ultimo_cambio_cartas : null;
  normalized.bloqueado_hasta = validIsoDate(normalized.bloqueado_hasta) ? normalized.bloqueado_hasta : null;
  return normalized;
}
function ensureSpecialState(){
  if(!game) return null;
  game.special = normalizeSpecialState(game.special, game.rankingManagerName || storedManagerName() || 'Manager');
  return game.special;
}
function specialCardBaseById(id){
  return (specialDatabase().cartas_base || []).find(card => String(card.id_base) === String(id)) || null;
}
function specialRarityOrder(){
  const order = specialDatabase().rareza_orden_visual;
  return Array.isArray(order) && order.length ? order : ['inutil','comun','rara','epica','legendaria'];
}
function specialRarityRank(rarity){
  const index = specialRarityOrder().indexOf(String(rarity || ''));
  return index >= 0 ? index : 99;
}
function specialRarityLabel(rarity){
  const labels = { inutil:'Inútil', comun:'Común', rara:'Rara', epica:'Épica', legendaria:'Legendaria' };
  return labels[rarity] || String(rarity || 'Carta');
}
function specialBonusLabel(type){
  const labels = {
    sponsors_extra:'Sponsors extra',
    deterioro_campo:'Deterioro de campo',
    probabilidad_legendaria:'Prob. legendaria'
  };
  return labels[type] || String(type || 'Sin bonus');
}
function specialCardBonusText(card){
  if(!card?.tipo_bonus || !card.valor_bonus) return 'Sin bonus activo';
  const unit = card.unidad === 'porcentaje_relativo' ? '% relativo' : (card.unidad === 'porcentaje' ? '%' : '');
  const sign = card.tipo_bonus === 'deterioro_campo' ? '-' : '+';
  return `${specialBonusLabel(card.tipo_bonus)}: ${sign}${Number(card.valor_bonus || 0)}${unit}`;
}
function specialCurrentDate(){
  if(typeof currentCalendarDate === 'function') return currentCalendarDate();
  return validIsoDate(game?.currentDate) ? game.currentDate : dateForSeasonState(game);
}
function specialCardsLockedInfo(){
  const state = ensureSpecialState();
  if(!state) return { locked:false, remaining:0, until:null };
  const until = validIsoDate(state.bloqueado_hasta) ? state.bloqueado_hasta : null;
  if(!until) return { locked:false, remaining:0, until:null };
  const remaining = daysBetweenIsoDates(specialCurrentDate(), until);
  return { locked:remaining > 0, remaining:Math.max(0, remaining), until };
}
function lockSpecialCardChanges(){
  const state = ensureSpecialState();
  if(!state) return;
  const today = specialCurrentDate();
  const lockDays = specialLimits().lockDays;
  state.fecha_ultimo_cambio_cartas = today;
  state.bloqueado_hasta = lockDays > 0 ? addDaysToIsoDate(today, lockDays) : null;
}
function specialActiveBonus(type){
  const state = ensureSpecialState();
  if(!state) return 0;
  const db = specialDatabase();
  const stack = db.apilamiento_bonus?.[type] || {};
  const raw = (state.cartas_activas || [])
    .filter(card => card.tipo_bonus === type && !card.destruida)
    .reduce((sum, card) => sum + Number(card.valor_bonus || 0), 0);
  const cap = Number(stack.tope_porcentaje);
  return Number.isFinite(cap) ? Math.min(raw, cap) : raw;
}
function specialActiveBonusSummary(){
  return ['sponsors_extra','deterioro_campo','probabilidad_legendaria'].map(type => ({ type, value:specialActiveBonus(type) })).filter(item => item.value > 0);
}
function specialActionPoints(actionId){
  const action = specialDatabase().puntos_ocultos?.acciones?.[actionId];
  return Math.max(0, Math.round(Number(action?.puntos || 0)));
}
function awardSpecialPoints(actionId, context={}){
  const state = ensureSpecialState();
  const points = specialActionPoints(actionId);
  if(!state || points <= 0) return 0;
  state.puntos_habilidad = Math.max(0, Math.round(Number(state.puntos_habilidad || 0) + points));
  state.puntos_log = Array.isArray(state.puntos_log) ? state.puntos_log : [];
  state.puntos_log.push({ actionId, points, ...turnStamp({ date:game?.currentDate || '', ...context }) });
  if(state.puntos_log.length > 80) state.puntos_log = state.puntos_log.slice(-80);
  return points;
}
function awardSpecialPointsForOwnMatch(match){
  if(!game || !match) return 0;
  const isHome = Number(match.homeId) === Number(game.selectedClubId);
  const gf = isHome ? Number(match.homeGoals || 0) : Number(match.awayGoals || 0);
  const gc = isHome ? Number(match.awayGoals || 0) : Number(match.homeGoals || 0);
  let total = 0;
  if(gf > gc) total += awardSpecialPoints('ganar_partido', { matchId:match.id });
  else if(gf === gc) total += awardSpecialPoints('empatar_partido', { matchId:match.id });
  if(gf > 5) total += awardSpecialPoints('meter_mas_de_5_goles_en_un_partido', { matchId:match.id, goals:gf });
  return total;
}
function awardSpecialChampionPoints(division){
  const order = Math.max(1, Math.round(Number(division?.order || 1)));
  const id = order <= 1 ? 'salir_campeon_division_1' : (order === 2 ? 'salir_campeon_division_2' : 'salir_campeon_division_3');
  return awardSpecialPoints(id, { divisionId:division?.id || '', divisionName:division?.name || '' });
}
function specialPackDefinitions(){
  const packs = specialDatabase().sobres || {};
  return Object.entries(packs).map(([id, pack]) => ({ id, ...pack })).filter(pack => pack.id && pack.costo_puntos !== undefined);
}
function specialCardPoolByRarity(rarity){
  return (specialDatabase().cartas_base || []).filter(card => String(card.rareza) === String(rarity));
}
function adjustedPackProbabilities(pack){
  const base = { ...(pack.probabilidades || {}) };
  const rarityOrder = specialRarityOrder();
  rarityOrder.forEach(r => { base[r] = Math.max(0, Number(base[r] || 0)); });
  const legendBonus = specialActiveBonus('probabilidad_legendaria');
  if(legendBonus > 0 && base.legendaria > 0){
    const oldLegend = base.legendaria;
    const nextLegend = Math.min(99, oldLegend * (1 + (legendBonus / 100)));
    const diff = Math.max(0, nextLegend - oldLegend);
    const nonLegend = rarityOrder.filter(r => r !== 'legendaria');
    const othersTotal = nonLegend.reduce((sum, r) => sum + base[r], 0);
    if(diff > 0 && othersTotal > 0){
      nonLegend.forEach(r => { base[r] = Math.max(0, base[r] - diff * (base[r] / othersTotal)); });
      base.legendaria = nextLegend;
    }
  }
  const total = rarityOrder.reduce((sum, r) => sum + Math.max(0, Number(base[r] || 0)), 0) || 1;
  return Object.fromEntries(rarityOrder.map(r => [r, Math.max(0, Number(base[r] || 0)) / total]));
}
function pickSpecialRarity(pack){
  const probs = adjustedPackProbabilities(pack);
  let roll = Math.random();
  for(const rarity of specialRarityOrder()){
    roll -= Number(probs[rarity] || 0);
    if(roll <= 0) return rarity;
  }
  return specialRarityOrder().slice(-1)[0] || 'inutil';
}
function createSpecialCardInstance(base, packId){
  const card = {
    id_carta:`CARD-${game?.saveCode || 'FM'}-${Date.now().toString(36)}-${hashNumber(`${base.id_base}-${Math.random()}`, 1000000)}`,
    id_base:base.id_base,
    manager_id:game?.saveCode || '',
    nombre:base.nombre || 'Carta',
    rareza:base.rareza || 'inutil',
    tipo_bonus:base.tipo_bonus ?? null,
    valor_bonus:Number(base.valor_bonus || 0),
    unidad:base.unidad || '',
    activable:Boolean(base.activable),
    texto:base.texto || '',
    activa:false,
    destruida:false,
    obtenida_en_turno:currentTurnIndex(),
    obtenida_desde_sobre:packId || ''
  };
  return normalizeSpecialCard(card);
}
function sortOpenedCards(cards=[]){
  const db = specialDatabase();
  if(db.rareza_orden_apertura?.mostrar_raras_epicas_legendarias_al_final === false) return cards;
  const order = Array.isArray(db.rareza_orden_apertura?.orden) ? db.rareza_orden_apertura.orden : specialRarityOrder();
  return cards.slice().sort((a,b) => (order.indexOf(a.rareza) - order.indexOf(b.rareza)) || a.nombre.localeCompare(b.nombre, 'es'));
}
function openSpecialPack(packId){
  const state = ensureSpecialState();
  const pack = specialPackDefinitions().find(item => item.id === packId);
  if(!state || !pack){ showNotice('Sobre no disponible.'); return; }
  const cost = Math.max(0, Math.round(Number(pack.costo_puntos || 0)));
  const count = Math.max(1, Math.round(Number(pack.cantidad_cartas || 1)));
  const limits = specialLimits();
  if(state.puntos_habilidad < cost){ showNotice(`Puntos insuficientes. Necesitás ${cost} puntos de habilidad.`); return; }
  if(!limits.allowOpenWhenReserveFull && state.cartas_reserva.length + count > limits.reserveMax){
    showNotice(`Reserva llena. Necesitás ${count} espacios libres para abrir este sobre.`);
    return;
  }
  const cards = [];
  for(let i=0;i<count;i++){
    const rarity = pickSpecialRarity(pack);
    const pool = specialCardPoolByRarity(rarity);
    const fallbackPool = (specialDatabase().cartas_base || []).filter(Boolean);
    const sourcePool = pool.length ? pool : fallbackPool;
    if(!sourcePool.length) continue;
    const base = sourcePool[hashNumber(`${packId}-${Date.now()}-${Math.random()}-${i}`, sourcePool.length)];
    const card = createSpecialCardInstance(base, packId);
    if(card) cards.push(card);
  }
  state.puntos_habilidad = Math.max(0, state.puntos_habilidad - cost);
  state.cartas_reserva.push(...cards);
  const sorted = sortOpenedCards(cards);
  state.historial_ultimas_cartas = sorted.concat(state.historial_ultimas_cartas || []).slice(0, 30);
  saveLocal(true);
  renderSpecial(sorted);
  showNotice(`${pack.nombre || 'Sobre'} abierto. Obtuviste ${cards.length} carta(s).`);
}
function activateSpecialCard(cardId){
  const state = ensureSpecialState();
  const limits = specialLimits();
  const locked = specialCardsLockedInfo();
  if(locked.locked){ showNotice(`Cambio de cartas bloqueado por ${formatDays(locked.remaining)}.`); return; }
  if((state.cartas_activas || []).length >= limits.activeMax){ showNotice(`Ya tenés ${limits.activeMax} cartas activas.`); return; }
  const index = state.cartas_reserva.findIndex(card => card.id_carta === cardId);
  if(index < 0){ showNotice('Carta no encontrada en reserva.'); return; }
  const card = state.cartas_reserva[index];
  if(!card.activable){ showNotice('Esta carta no se puede activar.'); return; }
  if(!limits.allowRepeatedActive && state.cartas_activas.some(active => active.id_base === card.id_base)){ showNotice('Esta carta ya está activa.'); return; }
  state.cartas_reserva.splice(index, 1);
  state.cartas_activas.push({ ...card, activa:true });
  lockSpecialCardChanges();
  saveLocal(true);
  renderSpecial();
  showNotice(`Carta activada: ${card.nombre}.`);
}
function deactivateSpecialCard(cardId){
  const state = ensureSpecialState();
  const limits = specialLimits();
  const locked = specialCardsLockedInfo();
  if(locked.locked){ showNotice(`Cambio de cartas bloqueado por ${formatDays(locked.remaining)}.`); return; }
  if(state.cartas_reserva.length >= limits.reserveMax){ showNotice('Reserva llena. No se puede desactivar una carta hasta liberar espacio.'); return; }
  const index = state.cartas_activas.findIndex(card => card.id_carta === cardId);
  if(index < 0){ showNotice('Carta activa no encontrada.'); return; }
  const card = state.cartas_activas[index];
  state.cartas_activas.splice(index, 1);
  state.cartas_reserva.push({ ...card, activa:false });
  lockSpecialCardChanges();
  saveLocal(true);
  renderSpecial();
  showNotice(`Carta desactivada: ${card.nombre}.`);
}
function destroySpecialCard(cardId){
  const state = ensureSpecialState();
  const db = specialDatabase();
  if(db.destruir_cartas?.permitido === false){ showNotice('La destrucción de cartas está desactivada.'); return; }
  const index = state.cartas_reserva.findIndex(card => card.id_carta === cardId);
  if(index < 0){ showNotice('Sólo se pueden destruir cartas en reserva.'); return; }
  const card = state.cartas_reserva[index];
  const recovery = Math.max(0, Math.round(Number(db.destruir_cartas?.recuperacion_puntos?.[card.rareza] || 0)));
  state.cartas_reserva.splice(index, 1);
  state.puntos_habilidad = Math.max(0, Math.round(Number(state.puntos_habilidad || 0) + recovery));
  state.historial_ultimas_cartas = [{ ...card, destruida:true, recuperacion_puntos:recovery }].concat(state.historial_ultimas_cartas || []).slice(0, 30);
  saveLocal(true);
  renderSpecial();
  showNotice(`Carta destruida: +${recovery} puntos.`);
}
function specialCardMarkup(card, zone='reserve'){
  const rarity = String(card.rareza || 'inutil');
  const canActivate = zone === 'reserve' && card.activable;
  const action = zone === 'active'
    ? `<button class="ghost small-btn" data-special-deactivate="${escapeHtml(card.id_carta)}">Desactivar</button>`
    : `<div class="row gap-xs"><button class="primary small-btn" data-special-activate="${escapeHtml(card.id_carta)}" ${canActivate ? '' : 'disabled'}>Activar</button><button class="ghost small-btn" data-special-destroy="${escapeHtml(card.id_carta)}">Destruir</button></div>`;
  return `<div class="special-card rarity-${escapeHtml(rarity)} ${zone === 'active' ? 'active' : ''}">
    <div class="row"><span class="pill rarity-pill rarity-${escapeHtml(rarity)}">${escapeHtml(specialRarityLabel(rarity))}</span>${card.activable ? '<span class="pill ok">Activable</span>' : '<span class="pill">Sin bonus</span>'}</div>
    <h3>${escapeHtml(card.nombre)}</h3>
    <p>${escapeHtml(card.texto || '')}</p>
    <strong>${escapeHtml(specialCardBonusText(card))}</strong>
    <div class="special-card-actions">${action}</div>
  </div>`;
}
function specialPackMarkup(pack){
  const state = ensureSpecialState();
  const cost = Math.max(0, Math.round(Number(pack.costo_puntos || 0)));
  const count = Math.max(1, Math.round(Number(pack.cantidad_cartas || 1)));
  const limits = specialLimits();
  const room = Math.max(0, limits.reserveMax - (state.cartas_reserva || []).length);
  const disabled = state.puntos_habilidad < cost || (!limits.allowOpenWhenReserveFull && room < count);
  const probs = adjustedPackProbabilities(pack);
  const probText = specialRarityOrder().map(r => `${specialRarityLabel(r)} ${Math.round((probs[r] || 0) * 1000) / 10}%`).join(' · ');
  return `<div class="card special-pack-card">
    <div class="row"><div><p class="label">Sobre</p><h3>${escapeHtml(pack.nombre || pack.id)}</h3></div><span class="pill">${count} cartas</span></div>
    <p class="muted small">${escapeHtml(probText)}</p>
    <div class="row"><strong>${cost} puntos</strong><button class="primary" data-open-special-pack="${escapeHtml(pack.id)}" ${disabled ? 'disabled' : ''}>Abrir sobre</button></div>
  </div>`;
}
function specialOpenedMarkup(opened=[]){
  if(!opened?.length) return '';
  return `<div class="card special-opened"><div class="row"><div><p class="label">Última apertura</p><h3>Cartas obtenidas</h3></div><span class="pill">${opened.length}</span></div><div class="special-card-grid">${opened.map(card => specialCardMarkup(card, 'opened')).join('')}</div></div>`;
}
function renderSpecial(opened=[]){
  const state = ensureSpecialState();
  const limits = specialLimits();
  const locked = specialCardsLockedInfo();
  const active = (state.cartas_activas || []).slice().sort((a,b)=>specialRarityRank(b.rareza)-specialRarityRank(a.rareza));
  const reserve = (state.cartas_reserva || []).slice().sort((a,b)=>specialRarityRank(b.rareza)-specialRarityRank(a.rareza) || a.nombre.localeCompare(b.nombre, 'es'));
  const packs = specialPackDefinitions();
  const bonuses = specialActiveBonusSummary();
  const lockText = locked.locked ? `Bloqueado por ${formatDays(locked.remaining)} · hasta ${locked.until}` : 'Cambio de cartas disponible';
  view.innerHTML = `
    <div class="row section-title"><div><h2>ESPECIAL</h2><p class="tagline">Sistema de cartas, sobres y bonus acumulables del manager.</p></div></div>
    <div class="grid cols-4 compact-team-stats special-summary">
      <div class="card"><p class="label">Manager</p><strong>${escapeHtml(state.nombre_manager || 'Manager')}</strong></div>
      <div class="card"><p class="label">Puntos de habilidad</p><strong>${Number(state.puntos_habilidad || 0)}</strong></div>
      <div class="card"><p class="label">Cartas activas</p><strong>${active.length}/${limits.activeMax}</strong></div>
      <div class="card"><p class="label">Reserva</p><strong>${reserve.length}/${limits.reserveMax}</strong></div>
    </div>
    <div class="card special-lock-card ${locked.locked ? 'warn' : 'ok'}"><div class="row"><div><h3>Bloqueo de cartas activas</h3><p class="muted small">${escapeHtml(lockText)}. Cada activación o desactivación inicia un bloqueo de ${limits.lockDays} días.</p></div><span class="pill ${locked.locked ? 'warn' : 'ok'}">${locked.locked ? 'Bloqueado' : 'Disponible'}</span></div></div>
    <div class="grid cols-3 special-bonus-grid">
      ${bonuses.length ? bonuses.map(item => `<div class="card"><p class="label">${escapeHtml(specialBonusLabel(item.type))}</p><strong>${item.type === 'deterioro_campo' ? '-' : '+'}${item.value}%</strong></div>`).join('') : '<div class="card"><p class="muted">No hay bonus activos.</p></div>'}
    </div>
    ${specialOpenedMarkup(opened)}
    <div class="card"><div class="row"><div><p class="label">Cartas activas</p><h3>Bonus aplicados</h3></div><span class="pill">Máximo ${limits.activeMax}</span></div><div class="special-card-grid">${active.length ? active.map(card => specialCardMarkup(card, 'active')).join('') : '<p class="muted">No hay cartas activas.</p>'}</div></div>
    <div class="card"><div class="row"><div><p class="label">Abrir sobres</p><h3>Sobres disponibles</h3></div><span class="pill">Reserva libre: ${Math.max(0, limits.reserveMax - reserve.length)}</span></div><div class="grid cols-3">${packs.length ? packs.map(specialPackMarkup).join('') : '<p class="muted">No hay sobres configurados.</p>'}</div></div>
    <div class="card"><div class="row"><div><p class="label">Cartas en reserva</p><h3>Inventario</h3></div><span class="pill">${reserve.length}/${limits.reserveMax}</span></div><div class="special-card-grid">${reserve.length ? reserve.map(card => specialCardMarkup(card, 'reserve')).join('') : '<p class="muted">No hay cartas en reserva.</p>'}</div></div>
  `;
  document.querySelectorAll('[data-open-special-pack]').forEach(btn => btn.addEventListener('click', () => openSpecialPack(btn.dataset.openSpecialPack)));
  document.querySelectorAll('[data-special-activate]').forEach(btn => btn.addEventListener('click', () => activateSpecialCard(btn.dataset.specialActivate)));
  document.querySelectorAll('[data-special-deactivate]').forEach(btn => btn.addEventListener('click', () => deactivateSpecialCard(btn.dataset.specialDeactivate)));
  document.querySelectorAll('[data-special-destroy]').forEach(btn => btn.addEventListener('click', () => destroySpecialCard(btn.dataset.specialDestroy)));
}
