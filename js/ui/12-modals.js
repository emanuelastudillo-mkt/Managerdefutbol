/* V3.44 · Modales de jugador, club, compra, partido, scouting y nueva partida. */

function purchaseOfferRejectionRecord(playerId){
  if(!game) return null;
  const rejected = game.rejectedPurchaseOffers || {};
  return rejected[String(playerId)] || null;
}
function isPurchaseOfferBlockedThisSeason(playerId){
  const record = purchaseOfferRejectionRecord(playerId);
  return Boolean(record && Number(record.season || 0) === Number(game?.seasonNumber || 1));
}
function markPurchaseOfferRejected(playerId, kind, amount){
  if(!game) return;
  game.rejectedPurchaseOffers = (game.rejectedPurchaseOffers && typeof game.rejectedPurchaseOffers === 'object' && !Array.isArray(game.rejectedPurchaseOffers)) ? game.rejectedPurchaseOffers : {};
  game.rejectedPurchaseOffers[String(playerId)] = {
    playerId:Number(playerId),
    season:Number(game.seasonNumber || 1),
    turn:currentTurnIndex(),
    kind:String(kind || ''),
    amount:Number(amount || 0),
    createdAt:Date.now()
  };
}
function purchaseOfferBlockedLabel(playerId){
  if(!isPurchaseOfferBlockedThisSeason(playerId)) return '';
  return 'Oferta rechazada hasta la próxima temporada';
}


function playerModalActionsMarkup(player){
  const clubId = Number(player.clubId || 0);
  if(clubId === Number(game.selectedClubId)){
    const checked = player.transferListed ? 'checked' : '';
    return `<div class="card inner player-action-card"><h3>Acciones</h3>
      <label class="transfer-toggle-row"><input type="checkbox" data-toggle-transfer-listed="${player.id}" ${checked}> <span>Poner transferible</span></label>
      <p class="muted small">Los transferibles reciben más ofertas, pero suelen ser más baratas.</p>
      <div class="row message-actions"><button class="danger ghost" data-dismiss-player="${player.id}">Despedir</button><button class="primary" data-offer-own-player="${player.id}">Ofrecer a clubes</button></div></div>`;
  }
  if(clubId > 0){
    const blocked = isPurchaseOfferBlockedThisSeason(player.id);
    const label = blocked ? purchaseOfferBlockedLabel(player.id) : 'Hacer oferta';
    return `<div class="card inner player-action-card"><h3>Mercado</h3><div class="row message-actions"><button class="primary" data-make-player-offer="${player.id}" ${blocked ? 'disabled' : ''}>${escapeHtml(label)}</button></div></div>`;
  }
  if(clubId === 0 && !player.sold){
    return `<div class="card inner player-action-card"><h3>Mercado</h3><div class="row message-actions"><button class="primary" data-hire-free-agent-modal="${player.id}">Contratar</button></div></div>`;
  }
  return '';
}
function bindPlayerModalActions(playerId){
  document.querySelector('[data-dismiss-player]')?.addEventListener('click', (ev) => { ev.stopPropagation(); dismissOwnPlayer(playerId); });
  document.querySelector('[data-offer-own-player]')?.addEventListener('click', (ev) => { ev.stopPropagation(); offerOwnPlayerToClubs(playerId); });
  document.querySelector('[data-make-player-offer]')?.addEventListener('click', (ev) => { ev.stopPropagation(); openPurchaseOfferModal(playerId); });
  document.querySelector('[data-hire-free-agent-modal]')?.addEventListener('click', (ev) => { ev.stopPropagation(); if(typeof hireFreeAgent === 'function'){ hireFreeAgent(playerId); closeModal(); activeTab='firstTeam'; renderAll(); } });
  document.querySelector('[data-toggle-transfer-listed]')?.addEventListener('change', (ev) => { ev.stopPropagation(); toggleTransferListed(playerId, ev.target.checked); });
}
function showPlayerModal(playerId){
  const p = playerById(playerId);
  if(!p) return;
  const visible = visibleStats(p);
  const stats = game?.playerStats?.[p.id];
  const meta = roleMeta(p.position);
  const body = `<div class="player-modal-compact">
    ${playerModalActionsMarkup(p)}
    <div class="player-modal-grid">
      <div>
        <div class="player-identity-card">
          ${faceImg(p, 'player-photo-placeholder large')}
          <div>
            <p class="label">${escapeHtml(clubName(p.clubId))} · #${jerseyNumber(p.id)}</p>
            <h2 class="player-modal-title">${typeof playerNameWithStar === 'function' ? playerNameWithStar(p) : escapeHtml(p.name)}</h2>
            <p class="muted">${escapeHtml(p.nationality || 'Sin nacionalidad')} · ${escapeHtml(meta.code)} · ${escapeHtml(meta.name)}</p>
            <p class="muted">${p.age} años · ${availabilityStatusMarkup(p.id)}</p>
          </div>
        </div>
        <div class="radar-wrap">${radarSvg(visible)}</div>
      </div>
      <div class="stack">
        <div class="card inner"><h3>Stats visibles</h3>${statPairs(visible, visibleStats(p, rawVisibleSkill))}</div>
        <div class="card inner"><h3>Perfil</h3>
          <div class="stat-rank"><span>Media</span><strong>${visibleOverall(p)}</strong></div>
          <div class="stat-rank"><span>Estado físico</span><strong>${currentCondition(p.id)}/99</strong></div>
          <div class="stat-rank"><span>Moral</span><strong>${currentMorale(p.id)}/99</strong></div>
          <div class="profile-bar-wrap">${moraleBar(p.id)}</div>
          <div class="stat-rank"><span>Cláusula</span><strong>${formatMoney(p.clause || p.value || 0)}</strong></div>
          <div class="stat-rank"><span>Salario</span><strong>${formatMoney(p.salary || 0)}</strong></div>
        </div>
        <div class="card inner"><h3>Temporada</h3>
          <div class="stat-rank"><span>Estrella</span><strong>${playerStarRecord(p) ? playerStarLabel(playerStarRecord(p).type) : '—'}</strong></div>
          ${playerStarRecord(p) ? `<p class="muted small-copy">${escapeHtml(playerStarRecord(p).reason || '')}</p>` : ''}
          <div class="stat-rank"><span>Partidos</span><strong>${stats?.played || 0}</strong></div>
          <div class="stat-rank"><span>Goles</span><strong>${stats?.goals || 0}</strong></div>
          <div class="stat-rank"><span>Asistencias</span><strong>${stats?.assists || 0}</strong></div>
          <div class="stat-rank"><span>Tapadas clave POR</span><strong>${stats?.keySaves || 0}</strong></div>
          <div class="stat-rank"><span>Lesiones</span><strong>${stats?.injuries || 0}</strong></div>
          <div class="stat-rank"><span>Expulsiones</span><strong>${stats?.red || 0}</strong></div>
          <div class="stat-rank"><span>Errores</span><strong>${stats?.errors || 0}</strong></div>
          <div class="stat-rank"><span>Errores de gol</span><strong>${stats?.goalErrors || 0}</strong></div>
          <div class="stat-rank"><span>Tarjetas amarillas</span><strong><span class="yellow-card">■</span> ${stats?.yellow || 0}</strong></div>
        </div>
      </div>
    </div></div>`;
  openModal(body);
  bindPlayerModalActions(playerId);
}


function toggleTransferListed(playerId, value){
  const player = playerById(playerId);
  if(!player || Number(player.clubId) !== Number(game.selectedClubId)) return;
  player.transferListed = Boolean(value);
  game.marketPlayers = (game.marketPlayers || []).map(p => Number(p.id) === Number(player.id) ? { ...p, transferListed:player.transferListed } : p);
  saveLocal(true);
  showNotice(player.transferListed ? `${player.name} fue marcado EN VENTA.` : `${player.name} dejó de figurar EN VENTA.`);
  showPlayerModal(playerId);
}


function dismissOwnPlayer(playerId){
  const player = playerById(playerId);
  if(!player || Number(player.clubId) !== Number(game.selectedClubId)) return;
  if(!hasFirstTeamRosterMinimumAfterRemoval(game.selectedClubId, 1)){ showRosterMinimumNotice(); return; }
  if(!confirm(`Despedir a ${player.name} del plantel?`)) return;
  removePlayerFromCurrentTactic(player.id);
  player.clubId = 0;
  player.freeAgent = true;
  player.salaryPaidCount = 0;
  player.lastSalaryPaidSeason = 0;
  refreshPlayerClause(player);
  if(typeof syncPlayerStarsWithClubs === 'function') syncPlayerStarsWithClubs(game);
  game.marketPlayers = game.marketPlayers || [];
  const idx = game.marketPlayers.findIndex(p => Number(p.id) === Number(player.id));
  const copy = { ...player, clubId:0, freeAgent:true, sold:false };
  if(idx >= 0) game.marketPlayers[idx] = { ...game.marketPlayers[idx], ...copy };
  else game.marketPlayers.push(copy);
  pushGameMessage({ type:'mercado', title:'Jugador despedido', body:`${player.name} dejó el club y quedó como agente libre.`, priority:'normal' });
  closeModal();
  saveLocal(true);
  renderAll();
  showNotice(`${player.name} fue despedido.`);
}
function offerOwnPlayerToClubs(playerId){
  const player = playerById(playerId);
  if(!player || Number(player.clubId) !== Number(game.selectedClubId)) return;
  if(!hasFirstTeamRosterMinimumAfterRemoval(game.selectedClubId, 1)){ showRosterMinimumNotice(); return; }
  if(!hasPlayerSalaryPaid(player)){
    showNotice('Primero debemos haberle pagado al menos un sueldo.');
    return;
  }
  if(typeof playerQualifiesForTransferOffers === 'function' && !playerQualifiesForTransferOffers(player)){
    showNotice('No hay clubes interesados: necesita partidos jugados, rendimiento visible o estar en venta con sueldo ya pagado.');
    return;
  }
  if(turnCooldownLeft(game.lastOwnPlayerOffer, OWN_PLAYER_OFFER_COOLDOWN_TURNS) > 0){
    showNotice('tu asistente está buscando las mejores opciones llamalo luego');
    return;
  }
  game.lastOwnPlayerOffer = turnStamp({ action:'offerOwnPlayer', playerId:player.id });
  const success = Math.random() < 0.85;
  if(!success){
    pushGameMessage({ type:'mercado', title:`Sin ofertas por ${playerLastName(player.name)}`, body:`Se ofreció a ${player.name}, pero ningún club presentó una propuesta formal.`, priority:'normal' });
    closeModal();
    activeTab = 'messages';
    saveLocal(true);
    renderAll();
    return;
  }
  const pct = typeof playerOfferPercent === 'function' ? playerOfferPercent(player, `forced-${Date.now()}`) : 15;
  const financials = typeof buildTransferOfferFinancials === 'function'
    ? buildTransferOfferFinancials(player, pct)
    : { grossAmount:Math.round(refreshPlayerClause(player) * pct / 100), taxAmount:0, netAmount:Math.round(refreshPlayerClause(player) * pct / 100) };
  const source = typeof botTransferOfferClub === 'function' ? botTransferOfferClub(player) : { name:FOREIGN_CLUBS[hashNumber(`forced-foreign-${player.id}-${Date.now()}`, FOREIGN_CLUBS.length)], id:-1 };
  const foreignClub = source.name;
  pushGameMessage({
    type:'mercado',
    priority:'high',
    title:`Oferta recibida por ${playerLastName(player.name)}`,
    body:typeof transferOfferBody === 'function'
      ? transferOfferBody(source, player, financials, pct, 'Al haberlo ofrecido activamente, el porcentaje pagado sobre la cláusula es menor.')
      : `${foreignClub} acercó una oferta de ${formatMoney(financials.grossAmount)} por ${player.name}.`,
    action:{ type:'transferOffer', status:'pending', playerId:player.id, amount:financials.grossAmount, grossAmount:financials.grossAmount, taxAmount:financials.taxAmount, netAmount:financials.netAmount, foreignClub, sourceClubId:source.id, pct }
  });
  closeModal();
  activeTab = 'messages';
  saveLocal(true);
  renderAll();
  showNotice('Llegó una oferta por el jugador.');
}
function openPurchaseOfferModal(playerId){
  const player = playerById(playerId);
  if(!player || Number(player.clubId || 0) <= 0 || Number(player.clubId) === Number(game.selectedClubId)) return;
  if(isPurchaseOfferBlockedThisSeason(player.id)){
    showNotice('Este club ya rechazó una oferta por este jugador. Podrás volver a intentarlo la próxima temporada.');
    return;
  }
  const clause = refreshPlayerClause(player);
  const transferAvailable = typeof transferBudgetAvailable === 'function' ? transferBudgetAvailable() : Number(game.budget || 0);
  const offerLow = Math.round(clause * 0.50);
  const offerMid = Math.round(clause * 0.75);
  const offerClause = Math.round(clause);
  const disabledAttrs = amount => amount > transferAvailable ? 'disabled' : '';
  const budgetNote = typeof transferBudgetSummaryMarkup === 'function' ? transferBudgetSummaryMarkup() : `<div class="card"><p class="label">Presupuesto disponible</p><strong>${formatMoney(game.budget || 0)}</strong></div>`;
  const body = `<div class="purchase-offer-modal">
    <p class="label">Hacer oferta</p>
    <h2>${escapeHtml(player.name)}</h2>
    <p class="muted">${escapeHtml(clubName(player.clubId))} · ${roleBadge(player.position)} · ${visibleOverall(player)} de media · Cláusula ${formatMoney(clause)}</p>
    <div style="margin-top:12px">${budgetNote}</div>
    <div class="grid cols-3 offer-choice-grid" style="margin-top:14px">
      <button class="card clickable plain" data-submit-player-offer="low" ${disabledAttrs(offerLow)}><h3>Ofrecer 50% menos</h3><p>${formatMoney(offerLow)}</p></button>
      <button class="card clickable plain" data-submit-player-offer="mid" ${disabledAttrs(offerMid)}><h3>Ofrecer 25% menos</h3><p>${formatMoney(offerMid)}</p></button>
      <button class="card clickable plain" data-submit-player-offer="clause" ${disabledAttrs(offerClause)}><h3>Ofrecer cláusula</h3><p>${formatMoney(offerClause)}</p></button>
    </div>
    <p class="muted small" style="margin-top:10px">Los botones se bloquean si superan el presupuesto autorizado para fichajes.</p>
  </div>`;
  openModal(body);
  document.querySelectorAll('[data-submit-player-offer]').forEach(btn => btn.addEventListener('click', () => submitPurchaseOffer(playerId, btn.dataset.submitPlayerOffer)));
}
function purchaseOfferConfig(kind, clause){
  if(kind === 'low') return { amount:Math.round(clause * 0.50), chance:0.40, fail:'No nos interesa negociar con ratas' };
  if(kind === 'mid') return { amount:Math.round(clause * 0.75), chance:0.65, fail:'Negociar no es tu fuerte, nos vemos' };
  return { amount:Math.round(clause), chance:0.90, fail:'el jugador no quiere jugar en tu club' };
}
function submitPurchaseOffer(playerId, kind){
  const player = playerById(playerId);
  if(!player || Number(player.clubId || 0) <= 0 || Number(player.clubId) === Number(game.selectedClubId)) return;
  if(!hasFirstTeamRosterSpace(game.selectedClubId, 1)){ showRosterLimitNotice(); return; }
  const clause = refreshPlayerClause(player);
  const cfg = purchaseOfferConfig(kind, clause);
  if((game.budget || 0) < cfg.amount){
    showNotice('Presupuesto total insuficiente para realizar esta oferta.');
    return;
  }
  const transferAvailable = typeof transferBudgetAvailable === 'function' ? transferBudgetAvailable() : Number(game.budget || 0);
  if(transferAvailable < cfg.amount){
    showNotice(`La directiva sólo autorizó ${formatMoney(transferAvailable)} para fichajes en este momento.`);
    return;
  }
  const accepted = Math.random() < cfg.chance;
  if(!accepted){
    markPurchaseOfferRejected(player.id, kind, cfg.amount);
    pushGameMessage({ type:'mercado', title:'Oferta rechazada', body:`${cfg.fail}. No podremos volver a enviar una oferta por este jugador hasta la próxima temporada.`, priority:'normal' });
    closeModal();
    activeTab = 'messages';
    saveLocal(true);
    renderAll();
    return;
  }
  game.pendingTransfers = Array.isArray(game.pendingTransfers) ? game.pendingTransfers : [];
  if(game.pendingTransfers.some(t => Number(t.playerId) === Number(player.id) && t.status === 'pending')){
    showNotice('Ya hay una operación pendiente por este jugador.');
    return;
  }
  if(typeof spendTransferBudget === 'function') spendTransferBudget(cfg.amount, `Compra de ${player.name}`);
  recordBudgetChange(-cfg.amount, `Compra acordada de ${player.name}`, { type:'transfer_purchase_pending', playerId:player.id, fromClubId:player.clubId });
  game.pendingTransfers.push({
    id:`incoming-${player.id}-${Date.now()}`,
    playerId:player.id,
    fromClubId:player.clubId,
    toClubId:game.selectedClubId,
    amount:cfg.amount,
    acceptedTurn:currentTurnIndex(),
    arrivalTurn:currentTurnIndex() + 1,
    status:'pending'
  });
  pushGameMessage({ type:'mercado', title:'Oferta aceptada', body:`${player.name}: el jugador se pondrá a disposición en breve.`, priority:'high' });
  closeModal();
  activeTab = 'messages';
  saveLocal(true);
  renderAll();
  showNotice('Oferta aceptada. El jugador llegará el próximo domingo.');
}
function processPendingTransfers(){
  if(!game) return;
  game.pendingTransfers = Array.isArray(game.pendingTransfers) ? game.pendingTransfers : [];
  let changed = false;
  game.pendingTransfers.forEach(t => {
    if(t.status !== 'pending') return;
    if(Number(t.arrivalTurn || 0) > currentTurnIndex()) return;
    const player = playerById(t.playerId);
    if(!player){ t.status = 'missing'; changed = true; return; }
    if(!hasFirstTeamRosterSpace(Number(t.toClubId || game.selectedClubId), 1)){
      t.arrivalTurn = currentTurnIndex() + 1;
      changed = true;
      return;
    }
    player.clubId = Number(t.toClubId || game.selectedClubId);
    player.freeAgent = false;
    player.sold = false;
    player.salaryPaidCount = 0;
    player.lastSalaryPaidSeason = 0;
    refreshPlayerClause(player);
    ensurePlayerStateForAll();
    if(typeof syncPlayerStarsWithClubs === 'function') syncPlayerStarsWithClubs(game);
    if(game.playerStats && !game.playerStats[player.id]) game.playerStats[player.id] = typeof createEmptyPlayerStat === 'function' ? createEmptyPlayerStat(player) : { playerId:player.id, clubId:player.clubId, goals:0, assists:0, yellow:0, red:0, played:0, injuries:0, keySaves:0, errors:0, goalErrors:0 };
    t.status = 'arrived';
    changed = true;
    pushGameMessage({ type:'mercado', title:'Jugador incorporado', body:`${player.name} ya está disponible en el plantel.`, priority:'high' });
  });
  if(changed) saveLocal(true);
}

function statPairs(obj, baseObj=null){
  return Object.entries(obj).map(([k,v])=>{
    const base = baseObj ? Number(baseObj[k]) : NaN;
    const current = Number(v);
    const trained = Number.isFinite(base) ? Math.max(0, current - base) : 0;
    const valueMarkup = trained > 0 ? `${base}<span class="trained-boost">+${trained}</span>` : `${current}`;
    return `<div class="stat-rank"><span>${escapeHtml(k)}</span><strong>${valueMarkup}</strong></div>`;
  }).join('');
}
function radarSvg(stats){
  const entries = Object.entries(stats);
  const cx = 145, cy = 145, maxR = 98;
  const points = entries.map(([_,value],i)=>{
    const angle = -Math.PI/2 + i * (Math.PI*2/entries.length);
    const r = maxR * clamp(value,0,99) / 99;
    return `${cx + Math.cos(angle)*r},${cy + Math.sin(angle)*r}`;
  }).join(' ');
  const grid = [33,66,99].map(level=>{
    const pts = entries.map(([_,value],i)=>{
      const angle = -Math.PI/2 + i * (Math.PI*2/entries.length);
      const r = maxR * level / 99;
      return `${cx + Math.cos(angle)*r},${cy + Math.sin(angle)*r}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="rgba(148,163,184,.25)" stroke-width="1"/>`;
  }).join('');
  const labels = entries.map(([label,value],i)=>{
    const angle = -Math.PI/2 + i * (Math.PI*2/entries.length);
    const r = maxR + 28;
    const x = cx + Math.cos(angle)*r;
    const y = cy + Math.sin(angle)*r;
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" class="radar-label">${escapeHtml(label)}</text>`;
  }).join('');
  return `<svg viewBox="0 0 290 290" class="radar" role="img" aria-label="Rombo de estadísticas">
    ${grid}
    <polygon points="${points}" fill="rgba(59,130,246,.35)" stroke="rgba(147,197,253,.95)" stroke-width="2"/>
    ${labels}
  </svg>`;
}

function clearMatchRevealTimers(){
  matchRevealTimers.forEach(id => clearTimeout(id));
  matchRevealTimers = [];
}
function showMatchRevealModal(match, onRevealComplete=null){
  if(!match) return;
  let revealCompleteNotified = false;
  const context = match.matchContext || { weather:'No registrado', pitch:'No registrado', homeFans:0, awayFans:0 };
  const html = `
    <div class="match-reveal-shell">
      <div class="match-modal-head">
        <p class="label">Fecha ${match.matchday} · ${match.date}</p>
        <h2>${clubLink(match.homeId)} <span id="revealScore">0 - 0</span> ${clubLink(match.awayId)}</h2>
      </div>
      <div class="reveal-control-row">
        <div class="reveal-progress"><span id="revealProgressBar"></span></div>
        <button id="finishMatchReveal" class="primary">Finalizar partido</button>
      </div>
      <div id="matchRevealDynamic"></div>
      <div class="card inner match-context-card">
        <h3>Contexto del partido</h3>
        <div class="grid cols-4">
          <div><p class="label">Clima</p><strong>${escapeHtml(context.weather)}</strong></div>
          <div><p class="label">Campo</p><strong>${escapeHtml(context.pitch)}</strong></div>
          <div><p class="label">Capacidad usada</p><strong>${new Intl.NumberFormat('es-AR').format(context.capacity || 0)}</strong>${Number(context.constructionPenalty || 0) > 0 ? `<p class="muted small">Nominal ${new Intl.NumberFormat('es-AR').format(context.nominalCapacity || context.capacity || 0)} · Obras -${context.constructionPenalty}%</p>` : ''}</div>
          <div><p class="label">Hinchas locales</p><strong>${new Intl.NumberFormat('es-AR').format(context.homeFans || 0)}</strong></div>
          <div><p class="label">Hinchas visitantes</p><strong>${new Intl.NumberFormat('es-AR').format(context.awayFans || 0)}</strong></div>
          <div><p class="label">Precio entrada</p><strong>${formatMoney(context.ticketPrice || 0)}</strong>${context.ticketPriceAutoBot ? `<p class="muted small">Bot auto · rival ${escapeHtml(context.ticketPricePrestigeTier || '')} · x${Number(context.ticketPriceMultiplier || 1).toFixed(2)}</p>` : ''}</div>
          <div><p class="label">Recaudación entradas</p><strong class="ok">${formatMoney(context.ticketRevenue || 0)}</strong></div>
          ${Number(context.rivalPrestigeAttendanceBonusPct || 0) > 0 ? `<div><p class="label">Demanda extra por rival</p><strong>+${Number(context.rivalPrestigeAttendanceBonusPct || 0)}%</strong><p class="muted small">Asistencia · prestigio rival ${Number(context.rivalPrestige || 0)}</p></div>` : ''}
        </div>
      </div>
    </div>`;
  openModal(html);
  const stages = matchRevealStages(match);
  const notifyRevealComplete = () => {
    if(revealCompleteNotified) return;
    revealCompleteNotified = true;
    if(typeof onRevealComplete === 'function') setTimeout(onRevealComplete, 900);
  };
  const renderStage = (idx) => {
    renderMatchRevealStage(match, stages[idx], idx, stages.length);
    if(idx >= stages.length - 1) notifyRevealComplete();
  };
  renderStage(0);
  stages.slice(1).forEach((stage, i) => {
    matchRevealTimers.push(setTimeout(() => renderStage(i + 1), stage.time));
  });
  $('finishMatchReveal')?.addEventListener('click', () => {
    clearMatchRevealTimers();
    renderStage(stages.length - 1);
  });
}
function matchRevealStageLabel(minute, index, total){
  if(index === 0) return 'Salida al campo';
  if(index >= total - 1) return 'Final';
  if(minute === 45) return 'Entretiempo';
  if(minute < 15) return `Minuto ${minute} · Inicio`;
  if(minute < 30) return `Minuto ${minute} · Primer tiempo`;
  if(minute < 45) return `Minuto ${minute} · Antes del descanso`;
  if(minute < 60) return `Minuto ${minute} · Segundo tiempo`;
  if(minute < 75) return `Minuto ${minute} · Partido abierto`;
  return `Minuto ${minute} · Tramo final`;
}
function matchRevealStageNote(minute, index, total){
  if(index === 0) return 'Los equipos salen a la cancha. Todavía no hay eventos revelados.';
  if(index >= total - 1) return 'Resultado final, estadísticas completas y consecuencias del partido.';
  if(minute < 15) return 'Primeras posesiones, presión inicial y tanteo táctico.';
  if(minute < 30) return 'El ritmo empieza a mostrar quién logra progresar mejor.';
  if(minute < 45) return 'Últimos ataques antes del descanso.';
  if(minute === 45) return 'Cierre del primer tiempo.';
  if(minute < 60) return 'Arranque del complemento y primeros ajustes.';
  if(minute < 75) return 'El partido entra en una zona de mayor desgaste.';
  return 'Últimos riesgos, cambios y acciones decisivas.';
}
function matchRevealStages(match){
  const total = Math.max(6, Math.round(MATCH_REVEAL_PHASES || 60));
  const duration = Math.max(6000, Number(MATCH_REVEAL_DURATION_MS || 60000));
  const stages = [];
  const usedMinutes = new Set();
  for(let i=0;i<total;i++){
    const factor = total <= 1 ? 1 : i / (total - 1);
    let minute = i === 0 ? 0 : (i === total - 1 ? 90 : Math.round(factor * 90));
    if(i > 0 && i < total - 1){
      while(usedMinutes.has(minute) && minute < 89) minute++;
      minute = clamp(minute, 1, 89);
    }
    usedMinutes.add(minute);
    stages.push({
      label:matchRevealStageLabel(minute, i, total),
      minute,
      factor,
      time:Math.round(duration * factor),
      note:matchRevealStageNote(minute, i, total)
    });
  }
  const withWindows = stages.map((stage, index) => ({
    ...stage,
    previousMinute:index > 0 ? stages[index - 1].minute : -1,
    nextMinute:index < stages.length - 1 ? stages[index + 1].minute : 90
  }));
  const hold = Math.max(1, Math.round(Number(MATCH_COMMENTARY_HOLD_PHASES || 1)));
  return withWindows.map((stage, index) => {
    const narrationIndex = index >= withWindows.length - 1
      ? index
      : Math.min(withWindows.length - 2, Math.floor(index / hold) * hold);
    return {
      ...stage,
      narrationIndex,
      narrationStage:withWindows[narrationIndex]
    };
  });
}
function renderMatchRevealStage(match, stage, index, total){
  const box = $('matchRevealDynamic');
  if(!box) return;
  const homeGoals = match.goals.filter(g => g.clubId === match.homeId && g.minute <= stage.minute).length;
  const awayGoals = match.goals.filter(g => g.clubId === match.awayId && g.minute <= stage.minute).length;
  const scoreBox = $('revealScore');
  if(scoreBox) scoreBox.textContent = `${homeGoals} - ${awayGoals}`;
  const progress = $('revealProgressBar');
  if(progress) progress.style.width = `${Math.round((index/(total-1))*100)}%`;
  const homeStats = partialMatchStats(match.matchStats.home, stage.factor, match.matchStats.home.possession);
  const awayStats = partialMatchStats(match.matchStats.away, stage.factor, match.matchStats.away.possession);
  if(stage.factor === 1){
    homeStats.possession = match.matchStats.home.possession;
    awayStats.possession = match.matchStats.away.possession;
  } else {
    const hPoss = Math.round(50 + (match.matchStats.home.possession - 50) * stage.factor);
    homeStats.possession = hPoss;
    awayStats.possession = 100 - hPoss;
  }
  const events = matchRevealEvents(match, stage.minute);
  const narrationStage = stage.narrationStage || stage;
  const narrationIndex = Number.isFinite(Number(stage.narrationIndex)) ? Number(stage.narrationIndex) : index;
  const narration = matchRevealNarration(match, narrationStage, narrationIndex, total);
  box.innerHTML = `
    <div class="card inner reveal-commentary-card ${escapeHtml(narration.tone || 'ambient')}">
      <p class="label">Relato de partido</p>
      <div class="reveal-commentary-text">${escapeHtml(narration.text)}</div>
      <div class="reveal-commentary-sub">${escapeHtml(narration.sub || '')}</div>
    </div>
    <div class="card inner reveal-stage-card">
      <div class="row">
        <div><p class="label">Minuto ${stage.minute || 0}</p><h3>${escapeHtml(stage.label)}</h3></div>
        <span class="pill">${index + 1}/${total}</span>
      </div>
      <p class="muted small">${escapeHtml(stage.note)}</p>
    </div>
    <div class="match-team-columns reveal-columns">
      ${revealTeamStatsCard(match.homeId, homeStats, 'Local')}
      ${revealTeamStatsCard(match.awayId, awayStats, 'Visitante')}
    </div>
    <div class="card inner reveal-events-card">
      <h3>Eventos visibles</h3>
      ${events.length ? events.map(revealEventLine).join('') : '<p class="muted">Sin eventos relevantes en este tramo.</p>'}
    </div>
    ${stage.factor === 1 ? `<div class="row reveal-final-actions"><button class="ghost" data-match-id="${escapeHtml(match.id)}">Ver ficha completa normal</button></div>` : ''}`;
  const finish = $('finishMatchReveal');
  if(finish && stage.factor === 1) finish.textContent = 'Partido finalizado';
}
function partialMatchStats(stats, factor){
  return {
    attacks: Math.round((stats.attacks || 0) * factor),
    chances: Math.round((stats.chances || 0) * factor),
    possession: stats.possession,
    fouls: Math.round((stats.fouls || 0) * factor),
    passScore: stats.passScore,
    keySaves: Math.round((stats.keySaves || 0) * factor),
    errors: Math.round((stats.errors || 0) * factor),
    goalErrors: Math.round((stats.goalErrors || 0) * factor)
  };
}
function revealTeamStatsCard(clubId, stats, sideLabel){
  return `<div class="card inner team-stat-card"><h3>${clubLink(clubId)} <span class="pill">${escapeHtml(sideLabel)}</span></h3>
    <div class="stat-rank"><span>Total de ataques</span><strong>${stats.attacks}</strong></div>
    <div class="stat-rank"><span>Ocasiones de gol</span><strong>${stats.chances}</strong></div>
    <div class="stat-rank"><span>Tapadas clave POR</span><strong>${stats.keySaves || 0}</strong></div>
    <div class="stat-rank"><span>Errores / de gol</span><strong>${stats.errors || 0} / ${stats.goalErrors || 0}</strong></div>
    <div class="stat-rank"><span>Posesión</span><strong>${stats.possession}%</strong></div>
    <div class="stat-rank"><span>Faltas</span><strong>${stats.fouls}</strong></div>
    <div class="stat-rank"><span>Puntuación de pases</span><strong>${stats.passScore ?? '—'}</strong></div>
  </div>`;
}
function matchRevealAllEvents(match){
  const events = [];
  (match.goals || []).forEach(g => events.push({ minute:Number(g.minute || 0), type:'goal', data:g }));
  (match.cards || []).forEach(c => events.push({ minute:Number(c.minute || 0), type:'card', data:c }));
  (match.injuries || []).forEach(i => events.push({ minute:Number(i.minute || 0), type:'injury', data:i }));
  (match.substitutions || []).forEach(s => events.push({ minute:Number(s.minute || 0), type:'sub', data:s }));
  (match.keySaves || []).forEach(k => events.push({ minute:Number(k.minute || 0), type:'keySave', data:k }));
  (match.errors || []).forEach(e => events.push({ minute:Number(e.minute || 0), type:'error', data:e }));
  return events.sort((a,b)=>a.minute-b.minute || eventPriority(a.type)-eventPriority(b.type));
}
function eventPriority(type){
  const order = { goal:1, keySave:2, card:3, error:4, injury:5, sub:6 };
  return order[type] || 9;
}
function matchRevealEvents(match, minute){
  return matchRevealAllEvents(match).filter(e => e.minute <= minute);
}
function matchRevealNarration(match, stage, index, total){
  if(index === 0) return { tone:'ambient', text:'Ya están los equipos en la cancha. Se acomoda la pelota y empieza a pesar el ambiente.', sub:'Salida al campo' };
  if(index >= total - 1) return { tone:'final', text:finalMatchNarration(match), sub:'Final del partido' };
  const all = matchRevealAllEvents(match);
  const justRevealed = all.filter(e => e.minute <= stage.minute && e.minute > Number(stage.previousMinute || -1));
  if(justRevealed.length){
    const event = justRevealed[justRevealed.length - 1];
    return { tone:`event-${event.type}`, text:matchEventNarration(match, event, 'final'), sub:eventSubLabel(event) };
  }
  const warningWindow = Math.max(Number(stage.nextMinute || stage.minute + 2), stage.minute + 2);
  const incoming = all.find(e => e.minute > stage.minute && e.minute <= warningWindow);
  if(incoming){
    return { tone:`warning-${incoming.type}`, text:matchEventNarration(match, incoming, 'before'), sub:'La jugada empieza a tomar temperatura' };
  }
  return { tone:'ambient', text:pickRelatoPhrase('ambient', `ambient-${match.id}-${stage.minute}`), sub:stage.note || 'El partido sigue en desarrollo' };
}
function finalMatchNarration(match){
  const h = Number(match.homeGoals || 0), a = Number(match.awayGoals || 0);
  if(h === a) return `Final en tablas: ${clubName(match.homeId)} ${h} - ${a} ${clubName(match.awayId)}. Nadie pudo quebrar del todo el partido.`;
  const winner = h > a ? match.homeId : match.awayId;
  return `Final del partido. Gana ${clubName(winner)} ${h} - ${a} y se lleva una tarde pesada.`;
}
function eventSubLabel(event){
  const labels = { goal:'Jugada destacada · gol', card:'Jugada destacada · tarjeta', keySave:'Jugada destacada · tapada', error:'Jugada destacada · error', injury:'Jugada destacada · lesión', sub:'Cambio automático' };
  return `${event.minute}' · ${labels[event.type] || 'Jugada destacada'}`;
}
function matchEventNarration(match, event, mode='final'){
  const data = event.data || {};
  const playerId = data.playerId || data.inId || data.outId || data.chanceById || 0;
  const player = playerById(playerId);
  const clubId = Number(data.clubId || data.scoringClubId || data.teamId || 0);
  const rivalId = clubId === match.homeId ? match.awayId : match.homeId;
  const map = { goal:'goal', card:'card', keySave:'save', error:'error', injury:'injury', sub:'sub' };
  const bucket = `${map[event.type] || 'ambient'}_${mode === 'before' ? 'before' : 'final'}`;
  const fallback = defaultNarrationText(event, mode, player, clubId, rivalId);
  return applyRelatoTemplate(pickRelatoPhrase(bucket, `${match.id}-${event.type}-${event.minute}-${playerId}-${mode}`, fallback), {
    player:player?.name || 'el jugador',
    club:clubName(clubId) || 'su equipo',
    rival:clubName(rivalId) || 'el rival',
    minute:event.minute
  });
}
function defaultNarrationText(event, mode, player, clubId, rivalId){
  const p = player?.name || 'el jugador';
  const c = clubName(clubId) || 'su equipo';
  const r = clubName(rivalId) || 'el rival';
  if(mode === 'before') return `Atención con ${p}, la jugada empieza a ponerse pesada para ${r}.`;
  if(event.type === 'goal') return `¡Gol de ${p}! ${c} golpea en el minuto ${event.minute}.`;
  if(event.type === 'card') return `Tarjeta para ${p}. El partido sigue tomando temperatura.`;
  if(event.type === 'keySave') return `Tapada clave para ${c}. El arquero sostiene a su equipo.`;
  if(event.type === 'error') return `Error de ${p}. ${c} queda expuesto.`;
  if(event.type === 'injury') return `Lesión de ${p}. Malas noticias para ${c}.`;
  return `Cambio en ${c}. El banco busca modificar el partido.`;
}
function pickRelatoPhrase(bucket, seedKey, fallback='El partido sigue vivo y cada pelota empieza a pesar más.'){
  const categorias = matchCommentaryDatabase?.categorias || {};
  const list = Array.isArray(categorias[bucket]) && categorias[bucket].length ? categorias[bucket] : [];
  if(!list.length) return fallback;
  return list[hashNumber(String(seedKey || bucket), list.length)];
}
function applyRelatoTemplate(text, data){
  return String(text || '').replace(/\{(player|club|rival|minute)\}/g, (_, key) => String(data?.[key] ?? ''));
}
function revealEventLine(event){
  if(event.type === 'goal'){
    const g = event.data;
    const p = playerById(g.playerId);
    const a = g.assistId ? playerById(g.assistId) : null;
    const detail = g.errorGoal ? 'Error rival' : (g.setPiece ? 'Pelota parada' : (a ? `<span class="event-icon boot">🥾</span> ${escapeHtml(playerLastName(a.name))}` : 'Sin asist.'));
    return `<div class="stat-rank event-line"><span>${g.minute}' <span class="event-icon ball">⚽</span> ${escapeHtml(p?.name || 'Jugador')} ${clubBadge(g.clubId)}</span><strong>${detail}</strong></div>`;
  }
  if(event.type === 'keySave'){
    return keySaveLine(event.data);
  }
  if(event.type === 'error'){
    return errorLine(event.data);
  }
  if(event.type === 'card'){
    return cardLine(event.data);
  }
  if(event.type === 'injury'){
    return injuryLine(event.data);
  }
  const s = event.data;
  return subLine(s);
}

function showMatchModal(matchId){
  const match = game.matchHistory.find(m => m.id === matchId);
  if(!match) return;
  const home = clubName(match.homeId);
  const away = clubName(match.awayId);
  const context = match.matchContext || { weather:'No registrado', pitch:'No registrado', homeFans:0, awayFans:0 };
  const body = `
    <div class="match-modal-head">
      <p class="label">Fecha ${match.matchday} · ${match.date}</p>
      <h2>${clubLink(match.homeId)} ${match.homeGoals} - ${match.awayGoals} ${clubLink(match.awayId)}</h2>
    </div>
    <div class="card inner match-context-card">
      <h3>Contexto del partido</h3>
      <div class="grid cols-4">
        <div><p class="label">Clima</p><strong>${escapeHtml(context.weather)}</strong></div>
        <div><p class="label">Campo de juego</p><strong>${escapeHtml(context.pitch)}</strong></div>
        <div><p class="label">Capacidad usada</p><strong>${new Intl.NumberFormat('es-AR').format(context.capacity || 0)}</strong>${Number(context.constructionPenalty || 0) > 0 ? `<p class="muted small">Nominal ${new Intl.NumberFormat('es-AR').format(context.nominalCapacity || context.capacity || 0)} · Obras -${context.constructionPenalty}%</p>` : ''}</div>
        <div><p class="label">Hinchas locales</p><strong>${new Intl.NumberFormat('es-AR').format(context.homeFans || 0)}</strong></div>
        <div><p class="label">Hinchas visitantes</p><strong>${new Intl.NumberFormat('es-AR').format(context.awayFans || 0)}</strong></div>
        <div><p class="label">Precio entrada</p><strong>${formatMoney(context.ticketPrice || 0)}</strong>${context.ticketPriceAutoBot ? `<p class="muted small">Bot auto · rival ${escapeHtml(context.ticketPricePrestigeTier || '')} · x${Number(context.ticketPriceMultiplier || 1).toFixed(2)}</p>` : ''}</div>
        <div><p class="label">Recaudación entradas</p><strong class="ok">${formatMoney(context.ticketRevenue || 0)}</strong></div>
        ${Number(context.rivalPrestigeAttendanceBonusPct || 0) > 0 ? `<div><p class="label">Demanda extra por rival</p><strong>+${Number(context.rivalPrestigeAttendanceBonusPct || 0)}%</strong><p class="muted small">Asistencia · prestigio rival ${Number(context.rivalPrestige || 0)}</p></div>` : ''}
      </div>
    </div>
    <div class="match-team-columns">
      ${matchStatsCard(match.homeId, match.matchStats.home, 'Local')}
      ${matchStatsCard(match.awayId, match.matchStats.away, 'Visitante')}
    </div>
    <div class="grid cols-2" style="margin-top:14px">
      <div class="card inner"><h3>Goles</h3>${match.goals.length ? match.goals.map(goalLine).join('') : '<p class="muted">Sin goles.</p>'}</div>
      <div class="card inner"><h3>Tapadas clave POR</h3>${match.keySaves?.length ? match.keySaves.map(keySaveLine).join('') : '<p class="muted">Sin tapadas clave.</p>'}</div>
      <div class="card inner"><h3>Errores</h3>${match.errors?.length ? match.errors.map(errorLine).join('') : '<p class="muted">Sin errores decisivos.</p>'}</div>
      <div class="card inner"><h3>Amonestados y expulsados</h3>${match.cards.length ? match.cards.map(cardLine).join('') : '<p class="muted">Sin tarjetas.</p>'}</div>
      <div class="card inner"><h3>Cambios automáticos</h3>${match.substitutions?.length ? match.substitutions.map(subLine).join('') : '<p class="muted">Sin cambios automáticos ejecutados.</p>'}</div>
      <div class="card inner"><h3>Lesiones</h3>${match.injuries?.length ? match.injuries.map(injuryLine).join('') : '<p class="muted">Sin lesiones.</p>'}</div>
    </div>`;
  openModal(body);
}
function matchStatsCard(clubId, stats, sideLabel){
  return `<div class="card inner team-stat-card"><h3>${clubLink(clubId)} <span class="pill">${escapeHtml(sideLabel)}</span></h3>
    <div class="stat-rank"><span>Total de ataques</span><strong>${stats.attacks}</strong></div>
    <div class="stat-rank"><span>Ocasiones de gol</span><strong>${stats.chances}</strong></div>
    <div class="stat-rank"><span>Tapadas clave POR</span><strong>${stats.keySaves || 0}</strong></div>
    <div class="stat-rank"><span>Errores / de gol</span><strong>${stats.errors || 0} / ${stats.goalErrors || 0}</strong></div>
    <div class="stat-rank"><span>Posesión</span><strong>${stats.possession}%</strong></div>
    <div class="stat-rank"><span>Faltas</span><strong>${stats.fouls}</strong></div>
    <div class="stat-rank"><span>Puntuación de pases</span><strong>${stats.passScore ?? '—'}</strong></div>
  </div>`;
}
function goalLine(g){
  const p = playerById(g.playerId);
  const a = g.assistId ? playerById(g.assistId) : null;
  const detail = g.errorGoal ? 'Error rival' : (g.setPiece ? 'Pelota parada' : (a ? `<span class="event-icon boot">🥾</span> ${escapeHtml(a.name.split(' ').slice(-1)[0])}` : 'Sin asist.'));
  return `<div class="stat-rank event-line"><span>${g.minute}' <span class="event-icon ball">⚽</span> ${escapeHtml(p?.name || 'Jugador')} ${clubBadge(g.clubId)}</span><strong>${detail}</strong></div>`;
}
function keySaveLine(k){
  const p = playerById(k.playerId);
  const shooter = k.chanceById ? playerById(k.chanceById) : null;
  return `<div class="stat-rank event-line"><span>${k.minute}' 🧤 ${escapeHtml(p?.name || 'Arquero')} ${clubBadge(k.clubId)}</span><strong>${shooter ? `a ${escapeHtml(playerLastName(shooter.name))}` : 'Tapada clave'}</strong></div>`;
}
function errorLine(e){
  const p = playerById(e.playerId);
  return `<div class="stat-rank event-line"><span>${e.minute}' ⚠️ ${escapeHtml(p?.name || 'Jugador')} ${clubBadge(e.clubId)}</span><strong>${e.goal ? 'Error de gol' : 'Error'}</strong></div>`;
}
function cardLine(c){
  const p = playerById(c.playerId);
  const icon = c.type === 'yellow' ? '<span class="yellow-card">■</span>' : c.type === 'secondYellowRed' ? '<span class="yellow-card">■</span><span class="red-card">■</span>' : '<span class="red-card">■</span>';
  const label = c.type === 'yellow' ? 'Amarilla' : c.type === 'secondYellowRed' ? 'Doble amarilla + roja' : 'Roja directa';
  return `<div class="stat-rank"><span>${c.minute}' ${icon} ${escapeHtml(p?.name || 'Jugador')} ${clubBadge(c.clubId)}</span><strong>${label}</strong></div>`;
}
function subLine(s){
  const out = playerById(s.outId);
  const inn = playerById(s.inId);
  const label = s.trigger === 'injury' ? 'Cambio por lesión' : (SUB_TRIGGERS.find(t=>t.value===s.trigger)?.label || s.trigger);
  return `<div class="stat-rank event-line"><span>${s.minute}' <span class="event-icon sub">⇄</span> ${escapeHtml(inn?.name || 'Jugador')} por ${escapeHtml(out?.name || 'Jugador')}</span><strong>${escapeHtml(label)}</strong></div>`;
}
function injuryLine(i){
  const p = playerById(i.playerId);
  const label = i.injuryLabel || i.name || i.severity || 'Lesión';
  const phase = i.phase === 'final' ? 'al final' : 'durante';
  return `<div class="stat-rank event-line"><span>${i.minute}' <span class="injury-event-icon">✚</span> ${escapeHtml(p?.name || 'Jugador')} ${clubBadge(i.clubId)}</span><strong>${escapeHtml(label)} · ${phase}</strong></div>`;
}
function showClubModal(clubId){
  const club = seed.clubs.find(c => c.id === Number(clubId));
  if(!club) return;
  const tactic = getTacticForClub(club.id);
  const players = playersByClub(club.id).slice().sort((a,b)=>positionOrder(a.position)-positionOrder(b.position) || visibleOverall(b)-visibleOverall(a));
  const keepers = players.filter(p=>p.position === 'POR');
  const fieldPlayers = players.filter(p=>p.position !== 'POR');
  const rows = players.map(scoutingPlayerRow).join('');
  const body = `
    <div class="club-modal-head" style="clear:both">
      <p class="label">Club observado</p>
      <h2>${clubBadge(club.id)}${escapeHtml(club.name)}</h2>
      <p class="muted">${escapeHtml(club.city || '')} · Reputación ${club.reputation} · Presupuesto base ${formatMoney(club.budget || 0)}</p>
    </div>
    <div class="grid cols-3" style="margin:14px 0">
      <div class="card inner"><p class="label">Plantel</p><div class="metric">${players.length}</div></div>
      <div class="card inner"><p class="label">Porteros</p><div class="metric">${keepers.length}</div></div>
      <div class="card inner"><p class="label">Jugadores de campo</p><div class="metric">${fieldPlayers.length}</div></div>
    </div>
    <div class="grid cols-2">
      <div class="card inner">
        <h3>Táctica observada</h3>
        <p class="muted small">No se muestran titulares. Sólo la estructura estimada.</p>
        ${clubTacticPreview(tactic.formation)}
      </div>
      <div class="card inner">
        <h3>Scouting parcial</h3>
        <p class="muted small">En cada nueva fecha se revelan de forma provisoria 2 o 3 habilidades visibles por jugador. Las demás quedan ocultas con guion.</p>
      </div>
    </div>
    <div class="card inner" style="margin-top:14px">
      <h3>Plantilla observada</h3>
      <div class="table-wrap"><table class="scouting-table"><thead><tr><th>Jugador</th><th>Rol</th><th>Nac.</th><th>Media</th><th>Ataque/Salto</th><th>Defensa</th><th>Pase</th><th>Velocidad/Reflejos</th><th>Cabezazo/Mando</th><th>Tiro/Potencia</th><th>Resistencia</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>`;
  openModal(body);
}
function clubTacticPreview(formation){
  const layout = formationLayout(formation);
  const labels = ['Defensa','MCD','Medios','MO','Ataque'];
  return `<div class="club-tactic-preview">
    <div class="pill">Formación estimada: ${escapeHtml(formation)}</div>
    <div class="club-lines">${layout.map((count,i)=>`<div class="club-line"><strong>${count}</strong><span>${labels[i]}</span></div>`).join('')}</div>
  </div>`;
}
function scoutingTurnKey(){
  if(!game) return 'no-game';
  return `${game.seasonNumber || 1}-${seasonPhase()}-${currentTurnIndex()}-${currentSeasonTurnNumber()}`;
}
function scoutingVisibleKeys(player){
  const keys = Object.keys(scoutingStatMap(player));
  const turnKey = scoutingTurnKey();
  const count = 2 + hashNumber(`scout-count-${player.id}-${turnKey}`, 2);
  const ordered = keys.slice().sort((a,b)=>hashNumber(`scout-${player.id}-${turnKey}-${a}`, 10000) - hashNumber(`scout-${player.id}-${turnKey}-${b}`, 10000));
  return new Set(ordered.slice(0,count));
}
function scoutingStatMap(player){
  const stats = visibleStats(player);
  if(player.position === 'POR'){
    return {
      'Ataque/Salto': stats.Salto,
      'Defensa': stats.Defensa,
      'Pase': stats.Pase,
      'Velocidad/Reflejos': stats.Reflejos,
      'Cabezazo/Mando': stats.Mando,
      'Tiro/Potencia': stats.Potencia,
      'Resistencia': stats.Resistencia
    };
  }
  return {
    'Ataque/Salto': stats.Ataque,
    'Defensa': stats.Defensa,
    'Pase': stats.Pase,
    'Velocidad/Reflejos': stats.Velocidad,
    'Cabezazo/Mando': stats.Cabezazo,
    'Tiro/Potencia': stats.Tiro,
    'Resistencia': stats.Resistencia
  };
}
function scoutingPlayerRow(player){
  const map = scoutingStatMap(player);
  const visible = scoutingVisibleKeys(player);
  const cell = key => visible.has(key) ? `<strong>${map[key]}</strong>` : '<span class="muted">—</span>';
  return `<tr>
    <td>${faceImg(player,'photo-thumb')} <strong>${escapeHtml(player.name)}</strong></td>
    <td><span class="pill role-pill">${roleBadge(player.position)}</span></td>
    <td>${nationalityShortMarkup(player.nationality)}</td>
    <td><strong>${visibleOverall(player)}</strong></td>
    <td>${cell('Ataque/Salto')}</td>
    <td>${cell('Defensa')}</td>
    <td>${cell('Pase')}</td>
    <td>${cell('Velocidad/Reflejos')}</td>
    <td>${cell('Cabezazo/Mando')}</td>
    <td>${cell('Tiro/Potencia')}</td>
    <td>${cell('Resistencia')}</td>
  </tr>`;
}
function openFounderModeModal(){
  if(!founderModeEnabled()){
    showNotice('El modo fundador está desactivado en la configuración.');
    return;
  }
  if(game && !game.gameOver?.active){
    showNotice('El modo fundador sólo se puede iniciar sin una partida activa.');
    return;
  }
  const country = availableCountries()[0] || 'Argentina';
  const body = `
    <div class="new-game-modal founder-modal">
      <p class="label">Modo Fundador</p>
      <h2>Fundar tu propio club</h2>
      <p class="muted">Vas a reemplazar a un club bot de bajo prestigio en la división más baja del país elegido. Tu club empieza sin jugadores, sin dinero, con estadio de capacidad 0, prestigio ${FOUNDER_CLUB_REPUTATION} y ${formatPlainNumber(FOUNDER_CLUB_INITIAL_FANS)} hinchas.</p>
      <div class="card blocker founder-warning"><strong>Modo no recomendado para tu primera partida.</strong><p class="muted small">No tendrás objetivos de directiva ni despidos, pero deberás contratar jugadores libres, conseguir ingresos y construir el estadio desde cero.</p></div>
      <div class="new-game-form-grid">
        <label for="founderManagerName">Nombre del manager</label>
        <input id="founderManagerName" maxlength="40" placeholder="Ej: Emanuel" value="${escapeHtml(storedManagerName())}">
        <label for="founderClubName">Nombre del club</label>
        <input id="founderClubName" maxlength="42" placeholder="Ej: Club Atlético Los Fundadores">
        <label for="founderCity">Ciudad</label>
        <input id="founderCity" maxlength="42" placeholder="Ej: Villa Celina">
        <label for="founderCountry">País inicial</label>
        <select id="founderCountry">${countryOptionsMarkup(country)}</select>
        <label for="founderPrimaryColor">Color principal</label>
        <input id="founderPrimaryColor" type="color" value="#3b82f6">
      </div>
      <div class="founder-preview card">
        <p class="label">Condiciones iniciales</p>
        <div class="founder-preview-grid">
          <div><span>Plantel</span><strong>0 jugadores</strong></div>
          <div><span>Presupuesto</span><strong>$0</strong></div>
          <div><span>Estadio</span><strong>0 lugares</strong></div>
          <div><span>Hinchas</span><strong>${formatPlainNumber(FOUNDER_CLUB_INITIAL_FANS)}</strong></div>
          <div><span>Prestigio club</span><strong>${FOUNDER_CLUB_REPUTATION}</strong></div>
          <div><span>Directiva</span><strong>Sin objetivos</strong></div>
        </div>
      </div>
      <div class="row" style="margin-top:14px"><button id="btnCreateFounderClub" class="primary">Fundar club</button></div>
    </div>`;
  openModal(body);
  $('founderManagerName')?.addEventListener('input', event => persistManagerName(event.target.value || ''));
  $('btnCreateFounderClub')?.addEventListener('click', () => {
    const clubName = String($('founderClubName')?.value || '').trim();
    if(clubName.length < 3){ showNotice('Ingresá un nombre de club de al menos 3 caracteres.'); return; }
    const city = String($('founderCity')?.value || '').trim();
    if(city.length < 2){ showNotice('Ingresá una ciudad para el club.'); return; }
    createFounderGame({
      managerName:$('founderManagerName')?.value || '',
      clubName,
      city,
      country:$('founderCountry')?.value || country,
      primaryColor:$('founderPrimaryColor')?.value || '#3b82f6'
    });
  });
}

function openNewGameModal(force=false, options={}){
  if(force && typeof force === 'object'){
    options = force.target ? {} : force;
    force = false;
  }
  options = options && typeof options === 'object' ? options : {};
  const requestedClub = options.selectedClubId ? seed?.clubs?.find(club => Number(club.id) === Number(options.selectedClubId)) : null;
  const hasCareer = Boolean(game);
  const canChooseJob = !game || Boolean(game?.gameOver?.active);
  const initialCountry = requestedClub ? clubCountry(requestedClub) : (game?.selectedCountry || availableCountries()[0] || 'Argentina');
  const initialLeague = requestedClub ? (requestedClub.divisionId || 'default') : (game?.selectedLeagueId || divisionsByCountry(initialCountry)[0]?.id || 'default');
  const initialClub = requestedClub?.id || game?.selectedClubId || clubsByCountryLeague(initialCountry, initialLeague).find(club => managerCanSelectClub(club))?.id || clubsByCountryLeague(initialCountry, initialLeague)[0]?.id || 0;
  const prestige = typeof currentManagerPrestige === 'function' ? currentManagerPrestige() : MANAGER_PRESTIGE_INITIAL;
  const prestigeLabel = typeof formatManagerPrestige === 'function' ? formatManagerPrestige(prestige) : String(prestige);
  const modeLabel = game?.gameOver?.active ? 'Continuar carrera' : 'Buscar club';
  const body = `
    <div class="new-game-modal job-search-modal">
      <p class="label">${escapeHtml(modeLabel)}</p>
      <h2>${game?.gameOver?.active ? 'Firmar nuevo contrato' : 'Crear manager'}</h2>
      <p class="muted">Prestigio actual del manager: <strong>${prestigeLabel}</strong>. Elegí un club disponible y firmá contrato. Los clubes con prestigio ${MANAGER_CLUB_OPEN_PRESTIGE} o menos aceptan cualquier manager.</p>
      ${!canChooseJob ? '<div class="card blocker"><strong>Ya tenés club.</strong><p class="muted small">La búsqueda de club se habilita cuando estás sin cargo.</p></div>' : ''}
      <div class="new-game-form-grid">
        <label for="modalManagerName">Nombre del manager</label>
        <input id="modalManagerName" maxlength="40" placeholder="Ej: Emanuel" value="${escapeHtml(storedManagerName())}" ${hasCareer ? 'disabled' : ''}>
        <label for="modalCountrySelect">País</label>
        <select id="modalCountrySelect">${countryOptionsMarkup(initialCountry)}</select>
        <label for="modalLeagueSelect">Liga</label>
        <select id="modalLeagueSelect">${leagueOptionsMarkup(initialCountry, initialLeague)}</select>
        <label for="modalClubSelect">Equipo</label>
        <select id="modalClubSelect" ${canChooseJob ? '' : 'disabled'}>${teamOptionsMarkup(initialCountry, initialLeague, initialClub)}</select>
      </div>
      <div class="row" style="margin-top:14px"><button id="btnStartNewGameModal" class="primary" ${canChooseJob ? '' : 'disabled'}>${game?.gameOver?.active ? 'Firmar con este club' : 'Iniciar carrera'}</button></div>
    </div>`;
  openModal(body);
  const countrySelect = $('modalCountrySelect');
  const leagueSelect = $('modalLeagueSelect');
  const clubSelect = $('modalClubSelect');
  const syncAvailability = () => {};
  const syncLeagues = () => {
    const country = countrySelect?.value || availableCountries()[0] || 'Argentina';
    if(leagueSelect) leagueSelect.innerHTML = leagueOptionsMarkup(country, leagueSelect.value);
    syncClubs();
  };
  const syncClubs = () => {
    const country = countrySelect?.value || availableCountries()[0] || 'Argentina';
    const league = leagueSelect?.value || divisionsByCountry(country)[0]?.id || 'default';
    if(clubSelect) clubSelect.innerHTML = teamOptionsMarkup(country, league, clubSelect.value);
  };
  countrySelect?.addEventListener('change', syncLeagues);
  leagueSelect?.addEventListener('change', syncClubs);
  $('modalManagerName')?.addEventListener('input', event => persistManagerName(event.target.value || ''));
  $('btnStartNewGameModal')?.addEventListener('click', () => {
    const selected = Number(clubSelect?.value || 0);
    if(!selected) return;
    const selectedClub = seed.clubs.find(c => Number(c.id) === selected);
    const rehireBlock = typeof managerClubRehireBlockInfo === 'function' ? managerClubRehireBlockInfo(selectedClub) : { blocked:false };
    if(rehireBlock.blocked){
      const cause = rehireBlock.type === 'resignation' ? 'renuncia' : 'despido';
      showNotice(`${selectedClub.name} no acepta tu regreso todavía: bloqueo por ${cause} hasta la temporada ${rehireBlock.untilSeason}.`);
      return;
    }
    if(!managerCanSelectClub(selectedClub, currentManagerPrestige())){
      showNotice(`Ese club requiere prestigio ${clubPrestigeValue(selectedClub)}.`);
      return;
    }
    if(game?.gameOver?.active) continueCareerAtClub(selected, {
      country:countrySelect?.value || '',
      leagueId:leagueSelect?.value || ''
    });
    else if(!game) newGame(selected, {
      managerName:$('modalManagerName')?.value || '',
      country:countrySelect?.value || '',
      leagueId:leagueSelect?.value || ''
    });
  });
  newGameModalShown = true;
}
function openModal(html){
  closeModal();
  const wrapper = document.createElement('div');
  wrapper.id = 'modalRoot';
  wrapper.innerHTML = `<div class="modal-backdrop"><div class="modal-panel"><button class="modal-close" data-close-modal aria-label="Cerrar">×</button>${html}</div></div>`;
  document.body.appendChild(wrapper);
}
function closeModal(){
  clearMatchRevealTimers();
  const root = $('modalRoot');
  if(root) root.remove();
}

