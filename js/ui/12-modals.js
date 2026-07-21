/* Modales: etiquetas de ojeo con probabilidad de fichaje revelable. */

function purchaseOfferRejectionRecord(playerId){
  if(!game) return null;
  const rejected = game.rejectedPurchaseOffers || {};
  return rejected[String(playerId)] || null;
}
function isPurchaseOfferBlockedThisSeason(playerId){
  const record = purchaseOfferRejectionRecord(playerId);
  if(!record) return false;
  if(Number(record.season || 0) !== Number(game?.seasonNumber || 1)) return false;
  if(Number(record.clubId || 0) && Number(record.clubId || 0) !== Number(game?.selectedClubId || 0)) return false;
  return true;
}
function markPurchaseOfferRejected(playerId, kind, amount, chance=null, reason='player'){
  if(!game) return;
  game.rejectedPurchaseOffers = (game.rejectedPurchaseOffers && typeof game.rejectedPurchaseOffers === 'object' && !Array.isArray(game.rejectedPurchaseOffers)) ? game.rejectedPurchaseOffers : {};
  game.rejectedPurchaseOffers[String(playerId)] = {
    playerId:Number(playerId),
    clubId:Number(game.selectedClubId || 0),
    season:Number(game.seasonNumber || 1),
    turn:currentTurnIndex(),
    kind:String(kind || ''),
    amount:Number(amount || 0),
    acceptanceChance:Number(chance || 0),
    reason:String(reason || 'player'),
    createdAt:Date.now()
  };
}
function purchaseOfferBlockedLabel(playerId){
  if(!isPurchaseOfferBlockedThisSeason(playerId)) return '';
  return 'Oferta rechazada hasta la próxima temporada';
}


function playerRequiresScouting(player){
  if(!player || !game) return false;
  return Number(player.clubId || 0) !== Number(game.selectedClubId || 0);
}
function scoutedVisibleKeySet(player){
  const map = scoutingStatMap(player);
  const visible = new Set();
  if(!playerRequiresScouting(player)){
    Object.keys(map).forEach(key => visible.add(key));
  }
  if(typeof scoutingKnownSet === 'function'){
    scoutingKnownSet(player.id).forEach(key => visible.add(key));
  }
  return visible;
}
function scoutedOverallLabel(player){
  if(!playerRequiresScouting(player)) return String(visibleOverall(player));
  const map = typeof scoutingDetailedStatMap === 'function' ? scoutingDetailedStatMap(player) : scoutingStatMap(player);
  const visible = scoutedVisibleKeySet(player);
  const keeper = String(player?.position || '').toUpperCase() === 'POR';
  const values = Object.entries(map).filter(([key]) => {
    if(!visible.has(key)) return false;
    if(!keeper && key === 'porteria') return false;
    if(key === 'potencial') return false;
    return true;
  }).map(([,value]) => Number(value || 0)).filter(Number.isFinite);
  if(values.length < 3) return '<span class="muted">—</span>';
  return `<span title="Estimación con habilidades detalladas observadas">≈ ${clamp(Math.round(avg(values)), 1, 99)}</span>`;
}
function scoutedPhysicalLabel(player){
  if(playerRequiresScouting(player)) return '<span class="muted">—</span>';
  const current = typeof currentCondition === 'function' ? currentCondition(player.id) : 0;
  const max = typeof maxConditionForPlayer === 'function' ? maxConditionForPlayer(player.id) : 99;
  return `<strong>${current}/<span class="max-condition-limit" title="Máximo actual por desgaste">${max}</span></strong>`;
}
function scoutedMoraleLabel(player){
  return playerRequiresScouting(player) ? '<span class="muted">—</span>' : `<strong>${currentMorale(player.id)}/99</strong>`;
}
function scoutedBarsMarkup(player){
  return playerRequiresScouting(player) ? '<p class="muted small">Físico y moral ocultos hasta observar al jugador en más semanas.</p>' : `<div class="profile-bar-wrap">${moraleBar(player.id)}</div>`;
}
function scoutingStatMapWithResolver(player, resolver=baseSkill){
  const stats = visibleStats(player, resolver);
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
function skillBreakdownMarkup(player, key, currentValue, rawValue){
  const raw = Number(rawValue);
  const current = Number(currentValue);
  if(!Number.isFinite(raw) || !Number.isFinite(current)) return escapeHtml(String(currentValue ?? '—'));
  const agePenalty = typeof playerAgeSkillPenalty === 'function' ? playerAgeSkillPenalty(player) : 0;
  const withoutTraining = clamp(Math.round(raw - agePenalty), 1, 99);
  const trained = Math.max(0, Math.round(current - withoutTraining));
  const parts = [];
  if(agePenalty > 0) parts.push(`<span class="age-skill-penalty" title="Penalización acumulada por edad">-${agePenalty}</span>`);
  parts.push(`<span class="skill-base-value">${raw}</span>`);
  if(trained > 0) parts.push(`<span class="trained-boost" title="Boost de entrenamiento">+${trained}</span>`);
  return `<span class="skill-breakdown" title="Actual efectivo: ${clamp(Math.round(current), 1, 99)}/99">${parts.join('')}</span>`;
}
function scoutedStatsMarkup(player){
  const map = typeof scoutingDetailedStatMap === 'function' ? scoutingDetailedStatMap(player) : scoutingStatMap(player);
  const rawMap = typeof scoutingDetailedStatMapWithResolver === 'function'
    ? scoutingDetailedStatMapWithResolver(player, rawVisibleSkill)
    : scoutingStatMapWithResolver(player, rawVisibleSkill);
  const visible = scoutedVisibleKeySet(player);
  const rows = Object.entries(map).map(([key, value]) => {
    const raw = Number(rawMap[key]);
    const current = Number(value);
    const shown = !playerRequiresScouting(player) || visible.has(key);
    const label = typeof scoutingSkillDisplayLabel === 'function' ? scoutingSkillDisplayLabel(player, key) : key;
    const valueMarkup = shown
      ? (key === 'potencial' ? escapeHtml(String(current)) : skillBreakdownMarkup(player, key, current, raw))
      : '—';
    return `<div class="stat-rank"><span>${escapeHtml(label)}</span><strong>${valueMarkup}</strong></div>`;
  }).join('');
  const agePenalty = typeof playerAgeSkillPenalty === 'function' ? playerAgeSkillPenalty(player) : 0;
  const ageNote = agePenalty > 0 ? `<p class="muted small"><span class="age-skill-penalty">-${agePenalty}</span> indica deterioro acumulado por edad. El valor base queda al centro y el entrenamiento aparece a la derecha en verde.</p>` : '';
  const note = playerRequiresScouting(player) ? '<p class="muted small">El Centro de Ojeo revela cada habilidad existente por separado. Sin informe, el valor permanece oculto.</p>' : '';
  return `${rows}${ageNote}${note}`;
}
function scoutedRadarMarkup(player){
  if(!playerRequiresScouting(player)) return radarSvg(visibleStats(player));
  const map = typeof scoutingDetailedStatMap === 'function' ? scoutingDetailedStatMap(player) : scoutingStatMap(player);
  const known = scoutedVisibleKeySet(player);
  const allVisibleKnown = Object.keys(map).length > 0 && Object.keys(map).every(key => known.has(key));
  if(allVisibleKnown) return radarSvg(visibleStats(player));
  return '<div class="scouting-radar-placeholder"><strong>Sin informe completo</strong><span>El radar se activa cuando el Centro de Ojeo revela todas las habilidades existentes del jugador.</span></div>';
}

function scoutedHiddenStatsCardMarkup(player){
  if(!player || typeof scoutingHiddenStatMap !== 'function' || typeof scoutingKnownSet !== 'function') return '';
  const hidden = scoutingHiddenStatMap(player);
  const keys = Object.keys(hidden || {});
  if(!keys.length) return '';
  const known = scoutingKnownSet(player.id);
  const revealed = keys.filter(key => known.has(key));
  if(!revealed.length) return '';
  const rows = keys.map(key => {
    const label = typeof scoutingSkillDisplayLabel === 'function' ? scoutingSkillDisplayLabel(player, key) : key;
    return `<div class="stat-rank"><span>${escapeHtml(label)}</span><strong>${known.has(key) ? hidden[key] : '—'}</strong></div>`;
  }).join('');
  return `<div class="card inner scouted-hidden-card"><p class="label ok">OJEADO POR TU EQUIPO</p><h3>Habilidades ocultas</h3>${rows}</div>`;
}

function markPendingTransferOffersRejectedForUntransferable(player){
  if(!game || !player) return 0;
  let count = 0;
  (game.messages || []).forEach(msg => {
    if(msg.action?.type !== 'transferOffer' || msg.action.status !== 'pending') return;
    if(Number(msg.action.playerId || 0) !== Number(player.id || 0)) return;
    if(Number(msg.action.pct || 0) >= 100) return;
    msg.action.status = 'auto_rejected_intransferible';
    msg.body += ` Oferta rechazada automáticamente: ${player.name} fue marcado como intransferible y sólo se aceptan propuestas por la cláusula completa.`;
    count += 1;
  });
  return count;
}

function playerModalActionsMarkup(player){
  if(typeof managerWithoutClubActive === 'function' ? managerWithoutClubActive() : Boolean(game?.gameOver?.active)){
    return `<div class="card inner player-action-card"><h3>Acciones bloqueadas</h3><p class="muted small">Estás sin club. No podés ojear, marcar transferible/intransferible, despedir, ofrecer jugadores ni enviar ofertas hasta firmar con un equipo.</p></div>`;
  }
  const clubId = Number(player.clubId || 0);
  if(clubId === Number(game.selectedClubId)){
    const checked = player.transferListed ? 'checked' : '';
    const locked = player.intransferible ? 'checked' : '';
    const inScouting = Array.isArray(game?.scoutingCenter?.listedPlayerIds) && game.scoutingCenter.listedPlayerIds.map(Number).includes(Number(player.id));
    return `<div class="card inner player-action-card"><h3>Acciones</h3>
      <label class="transfer-toggle-row"><input type="checkbox" data-toggle-transfer-listed="${player.id}" ${checked} ${player.intransferible ? 'disabled' : ''}> <span>Poner transferible</span></label>
      <label class="transfer-toggle-row untransferable-toggle-row"><input type="checkbox" data-toggle-untransferable="${player.id}" ${locked}> <span>Intransferible</span></label>
      <p class="muted small">Intransferible bloquea ofertas inferiores a la cláusula completa. El ojeo propio revela sólo las habilidades ocultas porque las visibles ya son conocidas.</p>
      <div class="row message-actions"><button class="danger ghost" data-dismiss-player="${player.id}">Despedir</button><button class="primary" data-offer-own-player="${player.id}" ${player.intransferible ? 'disabled title="Marcado como intransferible"' : ''}>Ofrecer a clubes</button><button class="ghost" data-add-scouting-player="${player.id}">${inScouting ? 'En Centro de Ojeo' : 'Ojear ocultas'}</button></div></div>`;
  }
  if(clubId > 0){
    const blocked = isPurchaseOfferBlockedThisSeason(player.id);
    const label = blocked ? purchaseOfferBlockedLabel(player.id) : 'Hacer oferta';
    const hasScoutingReport = Boolean(game?.scoutingCenter?.reports?.[String(player.id)]);
    const clauseMarkup = hasScoutingReport
      ? `<div class="player-modal-clause-value"><span>Valor de cláusula</span><strong>${formatMoney(Math.max(0, Number(player.clause || player.value || 0)))}</strong></div>`
      : '';
    return `<div class="card inner player-action-card"><h3>Mercado</h3><div class="row message-actions player-market-offer-row">${clauseMarkup}<button class="primary" data-make-player-offer="${player.id}" ${blocked ? 'disabled' : ''}>${escapeHtml(label)}</button><button class="ghost" data-add-scouting-player="${player.id}">Ojear</button></div></div>`;
  }
  if(clubId === 0 && !player.sold){
    const blocked = typeof isFreeAgentOfferBlockedThisSeason === 'function' && isFreeAgentOfferBlockedThisSeason(player.id);
    const label = typeof freeAgentOfferButtonLabel === 'function' ? freeAgentOfferButtonLabel(player.id) : (blocked ? 'Rechazó hasta próxima temp.' : 'Hacer oferta');
    return `<div class="card inner player-action-card"><h3>Mercado</h3><p class="muted small">Interés del jugador: oculto. Puede aceptar o rechazar según su media real y el prestigio del club.</p><div class="row message-actions"><button class="primary" data-hire-free-agent-modal="${player.id}" ${blocked ? 'disabled' : ''}>${escapeHtml(label)}</button><button class="ghost" data-add-scouting-player="${player.id}">Ojear</button></div></div>`;
  }
  return '';
}
function bindPlayerModalActions(playerId){
  if(typeof managerWithoutClubActive === 'function' ? managerWithoutClubActive() : Boolean(game?.gameOver?.active)) return;
  document.querySelector('[data-dismiss-player]')?.addEventListener('click', (ev) => { ev.stopPropagation(); dismissOwnPlayer(playerId); });
  document.querySelector('[data-offer-own-player]')?.addEventListener('click', (ev) => { ev.stopPropagation(); offerOwnPlayerToClubs(playerId); });
  document.querySelector('[data-make-player-offer]')?.addEventListener('click', (ev) => { ev.stopPropagation(); openPurchaseOfferModal(playerId); });
  document.querySelector('[data-hire-free-agent-modal]')?.addEventListener('click', (ev) => { ev.stopPropagation(); if(typeof hireFreeAgent === 'function'){ hireFreeAgent(playerId); closeModal(); activeTab='firstTeam'; renderAll(); } });
  document.querySelector('[data-toggle-transfer-listed]')?.addEventListener('change', (ev) => { ev.stopPropagation(); toggleTransferListed(playerId, ev.target.checked); });
  document.querySelector('[data-toggle-untransferable]')?.addEventListener('change', (ev) => { ev.stopPropagation(); toggleUntransferablePlayer(playerId, ev.target.checked); });
  document.querySelector('[data-add-scouting-player]')?.addEventListener('click', (ev) => { ev.stopPropagation(); if(typeof addPlayerToScoutingCenter === 'function') addPlayerToScoutingCenter(playerId); });
}
function showPlayerModal(playerId){
  const p = playerById(playerId);
  if(!p) return;
  const stats = game?.playerStats?.[p.id];
  const needsScouting = playerRequiresScouting(p);
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
        <div class="radar-wrap">${scoutedRadarMarkup(p)}</div>
        ${scoutedHiddenStatsCardMarkup(p)}
      </div>
      <div class="stack">
        <div class="card inner"><h3>${needsScouting ? 'Informe de ojeo' : 'Stats visibles'}</h3>${scoutedStatsMarkup(p)}</div>
        <div class="card inner"><h3>Perfil</h3>
          <div class="stat-rank"><span>Media</span><strong>${scoutedOverallLabel(p)}</strong></div>
          <div class="stat-rank"><span>Estado físico</span>${scoutedPhysicalLabel(p)}</div>
          ${!needsScouting && typeof currentPlayerWear === 'function' ? `<div class="stat-rank"><span>Desgaste</span><strong>${currentPlayerWear(p.id)}</strong></div>` : ''}
          <div class="stat-rank"><span>Moral</span>${scoutedMoraleLabel(p)}</div>
          ${scoutedBarsMarkup(p)}
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
  if(typeof managerWithoutClubActive === 'function' ? managerWithoutClubActive() : Boolean(game?.gameOver?.active)){ showNotice('No podés modificar estados de jugadores mientras estás sin club.'); return; }
  const player = playerById(playerId);
  if(!player || Number(player.clubId) !== Number(game.selectedClubId)) return;
  player.transferListed = Boolean(value);
  if(player.transferListed) player.intransferible = false;
  game.marketPlayers = (game.marketPlayers || []).map(p => Number(p.id) === Number(player.id) ? { ...p, transferListed:player.transferListed, intransferible:player.intransferible } : p);
  saveLocal(true);
  showNotice(player.transferListed ? `${player.name} fue marcado EN VENTA.` : `${player.name} dejó de figurar EN VENTA.`);
  showPlayerModal(playerId);
}
function toggleUntransferablePlayer(playerId, value){
  if(typeof managerWithoutClubActive === 'function' ? managerWithoutClubActive() : Boolean(game?.gameOver?.active)){ showNotice('No podés modificar estados de jugadores mientras estás sin club.'); return; }
  const player = playerById(playerId);
  if(!player || Number(player.clubId) !== Number(game.selectedClubId)) return;
  player.intransferible = Boolean(value);
  if(player.intransferible) player.transferListed = false;
  const rejected = player.intransferible ? markPendingTransferOffersRejectedForUntransferable(player) : 0;
  game.marketPlayers = (game.marketPlayers || []).map(p => Number(p.id) === Number(player.id) ? { ...p, transferListed:player.transferListed, intransferible:player.intransferible } : p);
  saveLocal(true);
  showNotice(player.intransferible ? `${player.name} fue marcado INTRANSFERIBLE.${rejected ? ` Ofertas inferiores rechazadas: ${rejected}.` : ''}` : `${player.name} dejó de ser intransferible.`);
  showPlayerModal(playerId);
}


function dismissOwnPlayer(playerId){
  if(typeof managerWithoutClubActive === 'function' ? managerWithoutClubActive() : Boolean(game?.gameOver?.active)){ showNotice('No podés despedir jugadores mientras estás sin club.'); return; }
  const player = playerById(playerId);
  if(!player || Number(player.clubId) !== Number(game.selectedClubId)) return;
  if(!hasFirstTeamRosterMinimumAfterRemoval(game.selectedClubId, 1)){ showRosterMinimumNotice(); return; }
  if(!confirm(`Despedir a ${player.name} del plantel?`)) return;
  const dismissedClubId = Number(game.selectedClubId);
  removePlayerFromCurrentTactic(player.id);
  if(typeof resetPlayerCaptaincyProgress === 'function') resetPlayerCaptaincyProgress(player.id, dismissedClubId);
  setPlayerClubId(player, 0);
  player.freeAgent = true;
  player.transferListed = false;
  player.intransferible = false;
  player.salaryPaidCount = 0;
  player.lastSalaryPaidSeason = 0;
  refreshPlayerClause(player);
  if(typeof syncPlayerStarsWithClubs === 'function') syncPlayerStarsWithClubs(game);
  game.marketPlayers = game.marketPlayers || [];
  const idx = game.marketPlayers.findIndex(p => Number(p.id) === Number(player.id));
  const copy = { ...player, clubId:0, freeAgent:true, transferListed:false, intransferible:false, sold:false };
  if(idx >= 0) game.marketPlayers[idx] = { ...game.marketPlayers[idx], ...copy };
  else game.marketPlayers.push(copy);
  const moraleImpact = typeof adjustSquadMorale === 'function'
    ? adjustSquadMorale(dismissedClubId, -TEAM_MORALE_DISMISSAL_LOSS, player.id)
    : { affected:0, totalChange:0 };
  const cohesionChange = typeof adjustTeamCohesion === 'function'
    ? adjustTeamCohesion(dismissedClubId, -TEAM_COHESION_DISMISSAL_LOSS)
    : 0;
  const moraleText = moraleImpact.affected ? ' Moral del plantel -1.' : '';
  const cohesionText = cohesionChange ? ` Cohesión ${cohesionChange > 0 ? '+' : ''}${cohesionChange}.` : '';
  const impactText = `${moraleText}${cohesionText}`;
  pushGameMessage({ type:'mercado', title:'Jugador despedido', body:`${player.name} dejó el club y quedó como agente libre.${impactText}`, priority:'normal' });
  closeModal();
  saveLocal(true);
  renderAll();
  showNotice(`${player.name} fue despedido.${impactText}`);
}
function offerOwnPlayerToClubs(playerId){
  if(typeof managerWithoutClubActive === 'function' ? managerWithoutClubActive() : Boolean(game?.gameOver?.active)){ showNotice('No podés ofrecer jugadores mientras estás sin club.'); return; }
  const player = playerById(playerId);
  if(!player || Number(player.clubId) !== Number(game.selectedClubId)) return;
  if(!hasFirstTeamRosterMinimumAfterRemoval(game.selectedClubId, 1)){ showRosterMinimumNotice(); return; }
  if(player.intransferible){
    showNotice('Este jugador está marcado como intransferible. Sólo se aceptan ofertas por cláusula completa.');
    return;
  }
  const played = Number(game?.playerStats?.[player.id]?.played || 0);
  const requiredMatches = Math.max(0, Number(typeof OWN_PLAYER_OFFER_MIN_MATCHES !== 'undefined' ? OWN_PLAYER_OFFER_MIN_MATCHES : 6));
  if(played < requiredMatches){
    showNotice(`Para ofrecerlo a otros clubes debe disputar al menos ${requiredMatches} partidos. Actualmente tiene ${played}.`);
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
  const source = typeof botTransferOfferClub === 'function' ? botTransferOfferClub(player) : { name:'Club interesado', id:-1 };
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
  if(typeof managerWithoutClubActive === 'function' ? managerWithoutClubActive() : Boolean(game?.gameOver?.active)){ showNotice('No podés enviar ofertas mientras estás sin club.'); return; }
  if(typeof managerChallengeBlocks === 'function' && managerChallengeBlocks('players')){ showNotice(managerChallengeBlockedMessage('players')); return; }
  const player = playerById(playerId);
  if(!player || Number(player.clubId || 0) <= 0 || Number(player.clubId) === Number(game.selectedClubId)) return;
  if(typeof hasActivePendingTransferForPlayer === 'function' && hasActivePendingTransferForPlayer(player.id)){
    showNotice('Este jugador ya tiene una transferencia acordada.');
    return;
  }
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
    <p class="muted">${escapeHtml(clubName(player.clubId))} · ${roleBadge(player.position)} · Media ojeada ${typeof scoutedOverallLabel === 'function' ? scoutedOverallLabel(player) : '<span class="muted">—</span>'} · Cláusula ${formatMoney(clause)}</p>
    <p class="small muted">Interés del jugador: <strong>oculto</strong>. Puede aceptar o rechazar según su media real y el prestigio del club. Si rechaza, queda bloqueado para tu club hasta la próxima temporada.</p>
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
  if(kind === 'low') return { amount:Math.round(clause * 0.50), clubChance:0.40, fail:'El club rechazó la oferta de 50% de cláusula.' };
  if(kind === 'mid') return { amount:Math.round(clause * 0.75), clubChance:0.65, fail:'El club rechazó la oferta de 75% de cláusula.' };
  return { amount:Math.round(clause), clubChance:1, fail:'El club no puede bloquear el pago de cláusula.' };
}
function submitPurchaseOffer(playerId, kind){
  if(typeof managerWithoutClubActive === 'function' ? managerWithoutClubActive() : Boolean(game?.gameOver?.active)){ showNotice('No podés enviar ofertas mientras estás sin club.'); return; }
  if(typeof managerChallengeBlocks === 'function' && managerChallengeBlocks('players')){ showNotice(managerChallengeBlockedMessage('players')); return; }
  const player = playerById(playerId);
  if(!player || Number(player.clubId || 0) <= 0 || Number(player.clubId) === Number(game.selectedClubId)) return;
  if(typeof hasActivePendingTransferForPlayer === 'function' && hasActivePendingTransferForPlayer(player.id)){ showNotice('Este jugador ya tiene una transferencia acordada.'); return; }
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
  const clubAccepted = Math.random() < Number(cfg.clubChance ?? 1);
  if(!clubAccepted){
    markPurchaseOfferRejected(player.id, kind, cfg.amount, null, 'club');
    pushGameMessage({ type:'mercado', title:'Oferta rechazada por el club', body:`${cfg.fail} No podremos volver a enviar una oferta por este jugador hasta la próxima temporada.`, priority:'normal' });
    closeModal();
    activeTab = 'messages';
    saveLocal(true);
    renderAll();
    return;
  }
  const playerChance = typeof marketPlayerAcceptanceChance === 'function' ? marketPlayerAcceptanceChance(player) : 80;
  const playerAccepted = Math.random() * 100 < Number(playerChance || 0);
  if(!playerAccepted){
    markPurchaseOfferRejected(player.id, kind, cfg.amount, playerChance, 'player');
    pushGameMessage({ type:'mercado', title:'Jugador rechazó la oferta', body:typeof marketPlayerRejectionBody === 'function' ? marketPlayerRejectionBody(player) : `${player.name} no tiene interés en jugar en tu club ni le gusta tu forma de dirigir. Queda bloqueado para tu club hasta la próxima temporada.`, priority:'normal' });
    closeModal();
    activeTab = 'messages';
    saveLocal(true);
    renderAll();
    return;
  }
  game.pendingTransfers = Array.isArray(game.pendingTransfers) ? game.pendingTransfers : [];
  if(game.pendingTransfers.some(t => Number(t.playerId) === Number(player.id) && isActivePendingTransfer(t))){
    showNotice('Ya hay una operación pendiente por este jugador.');
    return;
  }
  const marketSchedule = transferMarketScheduleForCurrentState(game);
  const marketOpen = isTransferMarketOpen(game);
  if(typeof spendTransferBudget === 'function') spendTransferBudget(cfg.amount, `Compra de ${player.name}`);
  recordBudgetChange(-cfg.amount, `Compra acordada de ${player.name}`, { type:'transfer_purchase_pending', playerId:player.id, fromClubId:player.clubId, executeSeason:marketSchedule.season, executeDay:marketSchedule.day });
  game.pendingTransfers.push({
    id:`incoming-${player.id}-${Date.now()}`,
    type:'incoming',
    playerId:player.id,
    fromClubId:player.clubId,
    toClubId:game.selectedClubId,
    amount:cfg.amount,
    acceptedTurn:currentTurnIndex(),
    acceptedSeason:Number(game.seasonNumber || 1),
    acceptedDay:transferMarketSeasonDayForState(game),
    acceptedDate:game.currentDate || '',
    executeSeason:marketSchedule.season,
    executeDay:marketSchedule.day,
    executeDate:marketSchedule.date,
    status:'pending'
  });
  player.transferAgreed = true;
  player.transferAgreedToClubId = Number(game.selectedClubId || 0);
  player.transferScheduledDate = marketSchedule.date;
  pushGameMessage({
    type:'mercado',
    title:marketOpen ? 'Oferta aceptada' : 'Fichaje acordado',
    body:marketOpen
      ? `${player.name} aceptó jugar en ${clubName(game.selectedClubId)}. La operación se ejecutará ahora porque el mercado está abierto.`
      : `${player.name} aceptó jugar en ${clubName(game.selectedClubId)}. El importe quedó reservado y llegará en la temporada ${marketSchedule.season}, día ${marketSchedule.day}, cuando abra el mercado.`,
    priority:'high'
  });
  closeModal();
  activeTab = 'messages';
  processPendingTransfers();
  saveLocal(true);
  renderAll();
  showNotice(marketOpen ? 'Oferta aceptada. El jugador ya puede incorporarse.' : `Fichaje acordado para la temporada ${marketSchedule.season}, día ${marketSchedule.day}.`);
}
function processPendingTransfers(){
  if(!game) return { checked:0, incoming:0, outgoing:0, changed:false };
  game.pendingTransfers = (Array.isArray(game.pendingTransfers) ? game.pendingTransfers : [])
    .map(item => typeof normalizePendingTransferMarketEntry === 'function' ? normalizePendingTransferMarketEntry(item, game) : item)
    .filter(Boolean);
  const summary = { checked:0, incoming:0, outgoing:0, changed:false };
  for(const t of game.pendingTransfers){
    if(!isActivePendingTransfer(t) || !isPendingTransferReadyToExecute(t, game)) continue;
    summary.checked += 1;
    const player = playerById(t.playerId);
    if(!player){ t.status = 'missing'; summary.changed = true; continue; }
    if(String(t.type || 'incoming') === 'outgoing'){
      const msg = (game.messages || []).find(item => String(item.id || '') === String(t.messageId || ''));
      if(!msg?.action){ t.status = 'missing_message'; summary.changed = true; continue; }
      if(Number(player.clubId || 0) !== Number(t.fromClubId || game.selectedClubId || 0)){
        t.status = 'player_unavailable';
        msg.action.status = 'expired_player_unavailable';
        summary.changed = true;
        continue;
      }
      const result = completeTransferSaleFromMessage(msg, player, {
        forceExecute:true,
        status:t.finalStatus || msg.action.finalStatus || 'accepted',
        silent:true,
        skipSave:true
      }) || {};
      if(result.executed){
        t.status = 'departed';
        summary.outgoing += 1;
        summary.changed = true;
        pushGameMessage({ type:'mercado', title:'Transferencia ejecutada', body:`${player.name} dejó el club durante la apertura del mercado.`, priority:'high' });
      }
      continue;
    }
    const destinationClubId = Number(t.toClubId || game.selectedClubId);
    if(firstTeamRosterCount(destinationClubId) >= MAX_PLAYERS_PER_CLUB){
      const next = nextTransferMarketOpening(Number(game.seasonNumber || 1), Math.min(daysInSeasonYear(currentSeasonYear()), transferMarketSeasonDayForState(game) + 1));
      t.executeSeason = next.season;
      t.executeDay = next.day;
      t.executeDate = next.date;
      summary.changed = true;
      continue;
    }
    const sellerClubId = Number(player.clubId || t.fromClubId || 0);
    setPlayerClubId(player, destinationClubId);
    player.freeAgent = false;
    player.sold = false;
    player.transferListed = false;
    player.intransferible = false;
    player.transferAgreed = false;
    delete player.transferAgreedToClubId;
    delete player.transferScheduledDate;
    player.salaryPaidCount = 0;
    player.lastSalaryPaidSeason = 0;
    refreshPlayerClause(player);
    ensurePlayerStateForAll();
    if(typeof syncPlayerStarsWithClubs === 'function') syncPlayerStarsWithClubs(game);
    if(game.playerStats && !game.playerStats[player.id]) game.playerStats[player.id] = typeof createEmptyPlayerStat === 'function' ? createEmptyPlayerStat(player) : { playerId:player.id, clubId:player.clubId, goals:0, assists:0, yellow:0, red:0, played:0, injuries:0, keySaves:0, errors:0, goalErrors:0 };
    const cohesionChange = Number(player.clubId) === Number(game.selectedClubId) && typeof adjustTeamCohesion === 'function'
      ? adjustTeamCohesion(game.selectedClubId, -TEAM_COHESION_SIGNING_LOSS)
      : 0;
    const cohesionText = cohesionChange ? ` Cohesión ${cohesionChange > 0 ? '+' : ''}${cohesionChange}.` : '';
    t.status = 'arrived';
    t.executedSeason = Number(game.seasonNumber || 1);
    t.executedDay = transferMarketSeasonDayForState(game);
    t.executedDate = game.currentDate || '';
    t.sellerClubId = sellerClubId;
    summary.incoming += 1;
    summary.changed = true;
    pushGameMessage({ type:'mercado', title:'Jugador incorporado', body:`${player.name} ya está disponible en el plantel.${cohesionText}`, priority:'high' });
  }
  if(summary.changed) saveLocal(true);
  return summary;
}
function radarSvg(stats){
  const entries = Object.entries(stats);
  const cx = 145, cy = 145, maxR = 98;
  const points = entries.map(([, value],i)=>{
    const angle = -Math.PI/2 + i * (Math.PI*2/entries.length);
    const r = maxR * clamp(value,0,99) / 99;
    return `${cx + Math.cos(angle)*r},${cy + Math.sin(angle)*r}`;
  }).join(' ');
  const grid = [33,66,99].map(level=>{
    const pts = entries.map(([, ],i)=>{
      const angle = -Math.PI/2 + i * (Math.PI*2/entries.length);
      const r = maxR * level / 99;
      return `${cx + Math.cos(angle)*r},${cy + Math.sin(angle)*r}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="rgba(148,163,184,.25)" stroke-width="1"/>`;
  }).join('');
  const labels = entries.map(([label],i)=>{
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
      <div class="card inner match-context-card compact-match-context match-context-safe">
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
          ${Number(context.marketingBonusPct || 0) > 0 ? `<div><p class="label">Director de marketing</p><strong>+${Number(context.marketingBonusPct || 0)}%</strong><p class="muted small">Asistencia y recaudación</p></div>` : ''}
          ${context.tacticalAdaptation ? `<div><p class="label">Adaptación rival</p><strong>+${Number(context.tacticalAdaptation.bonusPct || 0)}%</strong><p class="muted small">Patrón repetido ${Number(context.tacticalAdaptation.streak || 0)} partido(s)</p></div>` : ''}
        </div>
      </div>
      <div id="matchRevealDynamic"></div>
    </div>`;
  openModal(html);
  const stages = matchRevealStages();
  const notifyRevealComplete = () => {
    if(revealCompleteNotified) return;
    revealCompleteNotified = true;
    if(typeof onRevealComplete === 'function') setTimeout(onRevealComplete, 900);
  };
  const renderStage = (idx) => {
    try{
      renderMatchRevealStage(match, stages[idx], idx, stages.length);
    }catch(err){
      console.error('Error al renderizar simulador visual', err);
      const box = $('matchRevealDynamic');
      if(box){
        box.innerHTML = `<div class="card inner"><h3>Simulador visual no disponible</h3><p class="muted">El partido ya fue procesado. Se muestra el resultado final para evitar bloquear la partida.</p><div class="score-pill">${Number(match.homeGoals || 0)} - ${Number(match.awayGoals || 0)}</div></div>`;
      }
      const scoreBox = $('revealScore');
      if(scoreBox) scoreBox.textContent = `${Number(match.homeGoals || 0)} - ${Number(match.awayGoals || 0)}`;
      notifyRevealComplete();
    }
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
  if(index >= total - 1) return '';
  if(minute < 15) return 'Primeras posesiones, presión inicial y tanteo táctico.';
  if(minute < 30) return 'El ritmo empieza a mostrar quién logra progresar mejor.';
  if(minute < 45) return 'Últimos ataques antes del descanso.';
  if(minute === 45) return 'Cierre del primer tiempo.';
  if(minute < 60) return 'Arranque del complemento y primeros ajustes.';
  if(minute < 75) return 'El partido entra en una zona de mayor desgaste.';
  return 'Últimos riesgos, cambios y acciones decisivas.';
}
function matchRevealStages(){
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
  match.goals = Array.isArray(match.goals) ? match.goals : [];
  match.cards = Array.isArray(match.cards) ? match.cards : [];
  match.injuries = Array.isArray(match.injuries) ? match.injuries : [];
  match.substitutions = Array.isArray(match.substitutions) ? match.substitutions : [];
  match.keySaves = Array.isArray(match.keySaves) ? match.keySaves : [];
  match.errors = Array.isArray(match.errors) ? match.errors : [];
  match.matchStats = match.matchStats || {};
  match.matchStats.home = match.matchStats.home || { attacks:0, chances:0, possession:50, fouls:0, keySaves:0, errors:0, goalErrors:0, passScore:0 };
  match.matchStats.away = match.matchStats.away || { attacks:0, chances:0, possession:50, fouls:0, keySaves:0, errors:0, goalErrors:0, passScore:0 };
  const homeGoals = match.goals.filter(g => Number(g.clubId) === Number(match.homeId) && Number(g.minute || 0) <= Number(stage.minute || 0)).length;
  const awayGoals = match.goals.filter(g => Number(g.clubId) === Number(match.awayId) && Number(g.minute || 0) <= Number(stage.minute || 0)).length;
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
  const fieldTilt = matchRevealFieldTilt(match, homeStats, awayStats, stage.factor);
  const specialEvents = matchRevealSpecialEvents(match, stage);
  const narrationStage = stage.narrationStage || stage;
  const narrationIndex = Number.isFinite(Number(stage.narrationIndex)) ? Number(stage.narrationIndex) : index;
  const narration = matchRevealNarration(match, narrationStage, narrationIndex, total);
  box.innerHTML = `
    <div class="match-fullscreen-grid">
      <aside class="match-side-column match-side-home">
        ${revealTeamStatsCard(match.homeId, homeStats, 'Local', match, stage.minute)}
      </aside>
      <main class="match-main-column">
        <div class="card inner reveal-commentary-card ${escapeHtml(narration.tone || 'ambient')}">
          <p class="label">Relato de partido</p>
          <div class="reveal-commentary-text">${escapeHtml(narration.text)}</div>
          <div class="reveal-commentary-sub">${escapeHtml(narration.sub || '')}</div>
        </div>
        ${specialEvents.length ? `<div class="reveal-special-stack">${specialEvents.map((event, specialIndex) => revealSpecialEventCard(match, event, specialIndex)).join('')}</div>` : ''}
        ${revealPitchMomentumCard(match, fieldTilt)}
        ${stage.factor === 1 ? '' : `<div class="card inner reveal-stage-card">
          <div class="row">
            <div><p class="label">Minuto ${stage.minute || 0}</p><h3>${escapeHtml(stage.label)}</h3></div>
            <span class="pill">${index + 1}/${total}</span>
          </div>
          <p class="muted small">${escapeHtml(stage.note)}</p>
        </div>`}
        <div class="card inner reveal-events-card">
          <h3>Eventos visibles <span class="muted small">últimos arriba</span></h3>
          <div class="reveal-events-scroll">${events.length ? events.slice().reverse().map(revealEventLine).join('') : '<p class="muted">Sin eventos relevantes en este tramo.</p>'}</div>
        </div>
        ${stage.factor === 1 ? `<div class="row reveal-final-actions"><button class="ghost" data-match-id="${escapeHtml(match.id)}">Ver ficha completa normal</button></div>` : ''}
      </main>
      <aside class="match-side-column match-side-away">
        ${revealTeamStatsCard(match.awayId, awayStats, 'Visitante', match, stage.minute)}
      </aside>
    </div>`;
  const finish = $('finishMatchReveal');
  if(finish && stage.factor === 1) finish.textContent = 'Partido finalizado';
}
function matchRevealFieldTilt(match, homeStats={}, awayStats={}, factor=0){
  const hAttacks = Number(homeStats.attacks || 0);
  const aAttacks = Number(awayStats.attacks || 0);
  const hChances = Number(homeStats.chances || 0);
  const aChances = Number(awayStats.chances || 0);
  const hPoss = Number(homeStats.possession || 50);
  const aPoss = Number(awayStats.possession || (100 - hPoss));
  const hPressure = (hPoss * 0.45) + (hAttacks * 0.85) + (hChances * 4.2);
  const aPressure = (aPoss * 0.45) + (aAttacks * 0.85) + (aChances * 4.2);
  const totalPressure = Math.max(1, hPressure + aPressure);
  const dominance = clamp((hPressure - aPressure) / totalPressure, -1, 1);
  const ball = clamp(50 + dominance * 42, 8, 92);
  const homeId = Number(match?.homeId || 0);
  const awayId = Number(match?.awayId || 0);
  const leaderId = ball > 56 ? homeId : (ball < 44 ? awayId : 0);
  const leaderSide = ball > 56 ? 'local' : (ball < 44 ? 'visitante' : 'neutral');
  const label = leaderId ? `Cancha inclinada para ${clubName(leaderId)}` : 'Partido equilibrado';
  const intensity = Math.round(Math.abs(ball - 50) * 2);
  return { ball, homeShare:ball, awayShare:100-ball, leaderId, leaderSide, label, intensity, factor:Number(factor || 0), homePressure:hPressure, awayPressure:aPressure };
}
function revealPitchMomentumCard(match, tilt){
  const homeName = clubName(match.homeId);
  const awayName = clubName(match.awayId);
  const ball = clamp(Number(tilt?.ball || 50), 8, 92);
  const homeShare = clamp(Math.round(Number(tilt?.homeShare || ball)), 0, 100);
  const awayShare = 100 - homeShare;
  return `<div class="card inner reveal-pitch-card" style="--ball-pos:${ball}%;--home-share:${homeShare}%;--away-share:${awayShare}%">
    <div class="row reveal-pitch-head">
      <div>
        <p class="label">Inclinación de cancha</p>
        <h3>${escapeHtml(tilt?.label || 'Partido equilibrado')}</h3>
      </div>
      <span class="pill">Intensidad ${Math.round(Number(tilt?.intensity || 0))}%</span>
    </div>
    <div class="pitch-momentum" aria-label="Inclinación visual de cancha">
      <div class="pitch-side pitch-home"><span>${escapeHtml(homeName)}</span></div>
      <div class="pitch-side pitch-away"><span>${escapeHtml(awayName)}</span></div>
      <div class="pitch-midline"></div>
      <div class="pitch-ball">⚽</div>
    </div>
    <div class="row reveal-pitch-labels">
      <span>${clubBadge(match.homeId)} Local · ${homeShare}%</span>
      <span>Visitante · ${awayShare}% ${clubBadge(match.awayId)}</span>
    </div>
  </div>`;
}
function matchRevealSpecialEvents(match, stage){
  const fromMinute = Number(stage?.previousMinute ?? -1);
  const toMinute = Number(stage?.minute ?? 0);
  return matchRevealAllEvents(match).filter(event => {
    if(event.minute <= fromMinute || event.minute > toMinute) return false;
    if(event.type === 'goal' || event.type === 'injury') return true;
    return event.type === 'card' && ['red','secondYellowRed'].includes(String(event.data?.type || ''));
  }).sort((a,b)=>specialEventPriority(a)-specialEventPriority(b) || a.minute-b.minute).slice(0,3);
}
function specialEventPriority(event){
  if(event.type === 'goal') return 1;
  if(event.type === 'card') return 2;
  if(event.type === 'injury') return 3;
  return 9;
}
function revealSpecialEventCard(match, event, index=0){
  const data = event.data || {};
  const playerId = data.playerId || data.inId || data.outId || 0;
  const player = playerById(playerId);
  const clubId = Number(data.clubId || data.scoringClubId || data.teamId || 0);
  const playerName = escapeHtml(player?.name || 'Jugador');
  const badge = clubBadge(clubId);
  const delay = Math.min(index * 120, 360);
  if(event.type === 'goal'){
    return `<div class="reveal-special-event reveal-special-goal" style="animation-delay:${delay}ms">
      <div class="special-event-badge">${badge}</div>
      <div class="special-event-main"><div class="special-event-title">GOOOOOOLLLL!</div><div class="special-event-name">${playerName}</div><div class="special-event-sub">${event.minute}' · ${escapeHtml(clubName(clubId))}</div></div>
      <div class="special-event-icon">⚽</div>
    </div>`;
  }
  if(event.type === 'card'){
    const label = String(data.type || '') === 'secondYellowRed' ? 'DOBLE AMARILLA Y ROJA' : 'ROJA DIRECTA';
    return `<div class="reveal-special-event reveal-special-red" style="animation-delay:${delay}ms">
      <div class="special-event-badge">${badge}</div>
      <div class="special-event-main"><div class="special-event-title">${label}</div><div class="special-event-name">${playerName}</div><div class="special-event-sub">${event.minute}' · ${escapeHtml(clubName(clubId))}</div></div>
      <div class="special-event-red-card">■</div>
    </div>`;
  }
  const injuryLabel = escapeHtml(data.injuryLabel || data.name || data.severity || 'Lesión');
  return `<div class="reveal-special-event reveal-special-injury" style="animation-delay:${delay}ms">
    <div class="special-event-badge">${badge}</div>
    <div class="special-event-main"><div class="special-event-title">LESIÓN</div><div class="special-event-name">${playerName}</div><div class="special-event-sub">${event.minute}' · ${injuryLabel}</div></div>
    <div class="special-event-icon">✚</div>
  </div>`;
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
function matchEventPlayerName(id){
  const player = playerById(id);
  return player ? playerLastName(player.name || player.nombre || 'Jugador') : 'Jugador';
}
function teamMatchEventSummary(match, clubId, minute=90){
  const limitMinute = Number.isFinite(Number(minute)) ? Number(minute) : 90;
  const occurred = item => Number(item.minute || 0) <= limitMinute;
  const goals = (match?.goals || []).filter(item => Number(item.clubId) === Number(clubId) && occurred(item));
  const assists = goals.filter(item => Number(item.assistId || 0) > 0);
  const yellow = (match?.cards || []).filter(item => Number(item.clubId) === Number(clubId) && occurred(item) && String(item.type || '') === 'yellow');
  const red = (match?.cards || []).filter(item => Number(item.clubId) === Number(clubId) && occurred(item) && ['red','secondYellowRed'].includes(String(item.type || '')));
  const injuries = (match?.injuries || []).filter(item => Number(item.clubId) === Number(clubId) && occurred(item));
  const line = (label, list, mapper) => `<div class="team-event-line"><span>${escapeHtml(label)}</span><strong>${list.length ? list.map(mapper).join(', ') : '—'}</strong></div>`;
  return `<div class="team-event-summary">
    ${line('Goles', goals, item => `${escapeHtml(matchEventPlayerName(item.playerId))} ${Number(item.minute || 0)}'`)}
    ${line('Asistencias', assists, item => `${escapeHtml(matchEventPlayerName(item.assistId))}`)}
    ${line('Amonestados', yellow, item => `${escapeHtml(matchEventPlayerName(item.playerId))}`)}
    ${line('Expulsados', red, item => `${escapeHtml(matchEventPlayerName(item.playerId))}`)}
    ${line('Lesionados', injuries, item => `${escapeHtml(matchEventPlayerName(item.playerId))}`)}
  </div>`;
}
function revealTeamStatsCard(clubId, stats, sideLabel, match=null, minute=90){
  return `<div class="card inner team-stat-card"><h3>${clubLink(clubId)} <span class="pill">${escapeHtml(sideLabel)}</span></h3>
    <div class="stat-rank"><span>Intentos de ataque</span><strong>${stats.attacks}</strong></div>
    <div class="stat-rank"><span>Tiros al arco</span><strong>${stats.chances}</strong></div>
    <div class="stat-rank"><span>Tapadas clave POR</span><strong>${stats.keySaves || 0}</strong></div>
    <div class="stat-rank"><span>Errores / de gol</span><strong>${stats.errors || 0} / ${stats.goalErrors || 0}</strong></div>
    <div class="stat-rank"><span>Posesión</span><strong>${stats.possession}%</strong></div>
    <div class="stat-rank"><span>Faltas</span><strong>${stats.fouls}</strong></div>
    <div class="stat-rank"><span>Puntuación de pases</span><strong>${stats.passScore ?? '—'}</strong></div>
    ${match ? teamMatchEventSummary(match, clubId, minute) : ''}
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
  const home = clubName(match.homeId);
  const away = clubName(match.awayId);
  const h = Number(match.homeGoals || 0), a = Number(match.awayGoals || 0);
  const score = `${h} - ${a}`;
  let bucket = 'final_draw';
  if(h === 0 && a === 0) bucket = 'final_scoreless';
  else if(Math.abs(h - a) >= 3) bucket = 'final_big_win';
  else if((h + a) >= 5) bucket = 'final_goalfest';
  else if(h > a) bucket = 'final_home_win';
  else if(a > h) bucket = 'final_away_win';
  const winnerId = h >= a ? match.homeId : match.awayId;
  const loserId = h >= a ? match.awayId : match.homeId;
  const template = pickRelatoPhrase(bucket, `final-${match.id}-${score}`, h === a
    ? `Final igualado: ${home} y ${away} terminan ${score}.`
    : `Final del partido. Gana ${clubName(winnerId)} ${score}.`);
  return applyRelatoTemplate(template, {
    home,
    away,
    score,
    winner:clubName(winnerId),
    loser:clubName(loserId),
    club:clubName(winnerId),
    rival:clubName(loserId),
    minute:90,
    player:''
  });
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
  return String(text || '').replace(/\{([a-zA-Z_]+)\}/g, (_, key) => String(data?.[key] ?? ''));
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
  const context = match.matchContext || { weather:'No registrado', pitch:'No registrado', homeFans:0, awayFans:0 };
  const body = `
    <div class="match-result-shell">
    <div class="match-modal-head">
      <p class="label">Fecha ${match.matchday} · ${match.date}</p>
      <h2>${clubLink(match.homeId)} ${match.homeGoals} - ${match.awayGoals} ${clubLink(match.awayId)}</h2>
    </div>
    <div class="card inner match-context-card compact-match-context match-context-safe">
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
        ${Number(context.marketingBonusPct || 0) > 0 ? `<div><p class="label">Director de marketing</p><strong>+${Number(context.marketingBonusPct || 0)}%</strong><p class="muted small">Asistencia y recaudación</p></div>` : ''}
        ${context.tacticalAdaptation ? `<div><p class="label">Adaptación rival</p><strong>+${Number(context.tacticalAdaptation.bonusPct || 0)}%</strong><p class="muted small">Patrón repetido ${Number(context.tacticalAdaptation.streak || 0)} partido(s)</p></div>` : ''}
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
    </div>
    </div>`;
  openModal(body);
}
function matchStatsCard(clubId, stats, sideLabel){
  return `<div class="card inner team-stat-card"><h3>${clubLink(clubId)} <span class="pill">${escapeHtml(sideLabel)}</span></h3>
    <div class="stat-rank"><span>Intentos de ataque</span><strong>${stats.attacks}</strong></div>
    <div class="stat-rank"><span>Tiros al arco</span><strong>${stats.chances}</strong></div>
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
  const load = i.highLoad ? ' · alta carga' : '';
  return `<div class="stat-rank event-line"><span>${i.minute}' <span class="injury-event-icon">✚</span> ${escapeHtml(p?.name || 'Jugador')} ${clubBadge(i.clubId)}</span><strong>${escapeHtml(label)} · ${phase}${load}</strong></div>`;
}
function showClubModal(clubId){
  const club = seed.clubs.find(c => c.id === Number(clubId));
  if(!club) return;
  const tactic = getTacticForClub(club.id);
  const players = playersByClub(club.id).slice().sort((a,b)=>positionOrder(a.position)-positionOrder(b.position) || visibleOverall(b)-visibleOverall(a));
  const keepers = players.filter(p=>p.position === 'POR');
  const fieldPlayers = players.filter(p=>p.position !== 'POR');
  const rows = players.map(player => scoutingPlayerRow(player, { clickable:true })).join('');
  const isOwnClub = Number(club.id) === Number(game?.selectedClubId || 0);
  const isTeamScouted = Array.isArray(game?.scoutingCenter?.listedTeamIds) && game.scoutingCenter.listedTeamIds.map(Number).includes(Number(club.id));
  const teamScoutButton = isOwnClub ? '' : `<button class="ghost" data-add-scouting-team="${club.id}">${isTeamScouted ? 'En Centro de Ojeo' : 'Ojear equipo'}</button>`;
  const teamSectorReport = isTeamScouted && typeof scoutingTeamSectorMarkup === 'function' ? scoutingTeamSectorMarkup(club.id) : '<p class="muted small">Usá “Ojear equipo” para guardar un informe dinámico de Defensa, Medios y Delantera en el Centro de Ojeo.</p>';
  const body = `
    <div class="club-modal-head" style="clear:both">
      <p class="label">Club observado</p>
      <div class="row between"><h2>${clubBadge(club.id)}${escapeHtml(club.name)}</h2>${teamScoutButton}</div>
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
        <h3>Informe de ojeo de equipo</h3>
        ${teamSectorReport}
      </div>
    </div>
    <div class="card inner" style="margin-top:14px">
      <h3>Plantilla observada</h3>
      <div class="table-wrap"><table class="scouting-table"><thead><tr><th>Jugador</th><th>Rol</th><th>Nac.</th><th>Media ojeada</th><th>Ataque/Salto</th><th>Defensa</th><th>Pase</th><th>Velocidad/Reflejos</th><th>Cabezazo/Mando</th><th>Tiro/Potencia</th><th>Resistencia</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>`;
  openModal(body);
  document.querySelector('[data-add-scouting-team]')?.addEventListener('click', ev => { ev.stopPropagation(); if(typeof addTeamToScoutingCenter === 'function') addTeamToScoutingCenter(Number(ev.currentTarget.dataset.addScoutingTeam || 0)); });
}
function clubTacticPreview(formation){
  const layout = formationLayout(formation);
  const labels = ['Defensa','MCD','Medios','MO','Ataque'];
  return `<div class="club-tactic-preview">
    <div class="pill">Formación estimada: ${escapeHtml(formation)}</div>
    <div class="club-lines">${layout.map((count,i)=>`<div class="club-line"><strong>${count}</strong><span>${labels[i]}</span></div>`).join('')}</div>
  </div>`;
}
function scoutingVisibleKeys(player){
  return typeof scoutedVisibleKeySet === 'function' ? scoutedVisibleKeySet(player) : new Set(Object.keys(scoutingStatMap(player)));
}

function scoutingSkillDisplayLabel(player, key){
  const keeper = String(player?.position || '').toUpperCase() === 'POR';
  const labels = {
    'Ataque/Salto': keeper ? 'Salto' : 'Ataque',
    'Velocidad/Reflejos': keeper ? 'Reflejos' : 'Velocidad',
    'Cabezazo/Mando': keeper ? 'Mando' : 'Cabezazo',
    'Tiro/Potencia': keeper ? 'Potencia' : 'Tiro',
    porteria:'Portería',
    entradas:'Entradas',
    marca:'Marca',
    posicionamiento:'Posicionamiento',
    paseCorto:'Pase corto',
    paseLargo:'Pase largo',
    vision:'Visión',
    regate:'Regate',
    tecnica:'Técnica',
    remate:'Remate',
    cabezazo:'Cabezazo',
    velocidad:'Velocidad',
    aceleracion:'Aceleración',
    fuerza:'Fuerza',
    resistencia:'Resistencia',
    trabajoEquipo:'Trabajo en equipo',
    serenidad:'Serenidad',
    disciplina:'Disciplina',
    liderazgo:'Liderazgo',
    potencial:'Potencial',
    'hidden.aggression':'Agresividad',
    'hidden.genetics':'Genética',
    'hidden.surprise':'Factor sorpresa',
    'market.signingChance':'Prob. fichaje'
  };
  if(labels[key]) return labels[key];
  const clean = String(key || '').replace(/([a-záéíóúñ])([A-Z])/g, '$1 $2').replace(/[._-]+/g, ' ').trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : String(key || 'Habilidad');
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
function scoutingPlayerRow(player, options={}){
  const map = scoutingStatMap(player);
  const visible = scoutingVisibleKeys(player);
  const clickable = Boolean(options?.clickable);
  const rawMap = typeof scoutingStatMapWithResolver === 'function' ? scoutingStatMapWithResolver(player, rawVisibleSkill) : map;
  const cell = key => {
    const shown = visible.has(key) || (typeof scoutingSummarySkillKnown === 'function' && scoutingSummarySkillKnown(player, key, visible));
    return shown ? `<strong>${typeof skillBreakdownMarkup === 'function' ? skillBreakdownMarkup(player, key, map[key], rawMap[key]) : map[key]}</strong>` : '<span class="muted">—</span>';
  };
  const nameMarkup = clickable
    ? `<button class="linklike" data-player-id="${Number(player.id)}"><strong>${typeof playerNameWithScoutingEye === 'function' ? playerNameWithScoutingEye(player) : escapeHtml(player.name)}</strong></button>`
    : `<strong>${escapeHtml(player.name)}</strong>`;
  return `<tr class="${clickable ? 'clickable-player-row' : ''}" ${clickable ? `data-player-id="${Number(player.id)}"` : ''}>
    <td>${faceImg(player,'photo-thumb')} ${nameMarkup}</td>
    <td><span class="pill role-pill">${roleBadge(player.position)}</span></td>
    <td>${nationalityShortMarkup(player.nationality)}</td>
    <td>${typeof scoutedOverallLabel === 'function' ? scoutedOverallLabel(player) : '<span class="muted">—</span>'}</td>
    <td>${cell('Ataque/Salto')}</td>
    <td>${cell('Defensa')}</td>
    <td>${cell('Pase')}</td>
    <td>${cell('Velocidad/Reflejos')}</td>
    <td>${cell('Cabezazo/Mando')}</td>
    <td>${cell('Tiro/Potencia')}</td>
    <td>${cell('Resistencia')}</td>
  </tr>`;
}
function founderCrestOptionsMarkup(){
  const options = Array.isArray(FOUNDER_CREST_OPTIONS) && FOUNDER_CREST_OPTIONS.length
    ? FOUNDER_CREST_OPTIONS
    : ['img/escudos/fundador-1.webp','img/escudos/fundador-2.webp','img/escudos/fundador-3.webp','img/escudos/fundador-4.webp','img/escudos/fundador-5.webp','img/escudos/fundador-6.webp','img/escudos/fundador-7.webp','img/escudos/fundador-8.webp','img/escudos/fundador-9.webp'];
  return options.slice(0, 9).map((path, index) => {
    const checked = index === 0 ? 'checked' : '';
    const clean = escapeHtml(path);
    return `<label class="founder-crest-option" title="Escudo ${index + 1}"><input type="radio" name="founderCrestPath" value="${clean}" ${checked}><span><img src="${clean}" alt="Escudo fundador ${index + 1}" onerror="var el=this.closest('.founder-crest-option');if(el)el.classList.add('missing')"></span></label>`;
  }).join('');
}

function openFounderModeModal(){
  if(!founderModeEnabled()){
    showNotice('El modo fundador está desactivado en la configuración.');
    return;
  }
  if(game && !game.gameOver?.active){
    showNotice('El modo fundador sólo se puede iniciar al crear una carrera o cuando estás sin club.');
    return;
  }
  const continuingCareer = Boolean(game?.gameOver?.active);
  const currentSeason = Math.max(1, Math.round(Number(game?.seasonNumber || 1)));
  const country = availableCountries()[0] || 'Argentina';
  const body = `
    <div class="new-game-modal founder-modal">
      <p class="label">${continuingCareer ? 'Continuar carrera · Modo Fundador' : 'Modo Fundador'}</p>
      <h2>Fundar tu propio club</h2>
      <p class="muted">Vas a reemplazar a un club bot de bajo prestigio en la división más baja del país elegido. Tu club empieza sin jugadores, sin dinero, con estadio de capacidad 0, campo en ${FOUNDER_CLUB_INITIAL_FIELD}/100, prestigio ${FOUNDER_CLUB_REPUTATION} y ${formatPlainNumber(FOUNDER_CLUB_INITIAL_FANS)} hinchas.</p>
      <div class="card blocker founder-warning"><strong>Dificultad inicial muy alta.</strong><p class="muted small">Debés construir un plantel completo desde agentes libres, generar ingresos sin presupuesto inicial, ampliar un estadio sin capacidad y competir con una base social mínima. No tendrás objetivos de directiva ni despidos, pero al inicio sólo podrás contratar empleados Regulares y afrontarás costos administrativos diarios según la liga y el valor del plantel. Los niveles Bueno y Elite se desbloquean con 15 y 45 victorias.</p></div>
      ${continuingCareer ? `<div class="card blocker"><strong>La temporada ${currentSeason} terminará inmediatamente.</strong><p class="muted small">Todos los partidos pendientes se resolverán como encuentros bot. No recibirás títulos, premios ni méritos del club al que renunciaste. El club fundado debutará al comienzo de la temporada ${currentSeason + 1}, conservando prestigio, experiencia, historial y cartas del manager.</p></div>` : ''}
      <div class="new-game-form-grid">
        <label for="founderManagerName">Nombre del manager</label>
        <input id="founderManagerName" maxlength="40" placeholder="Ej: Emanuel" value="${escapeHtml(storedManagerName())}" ${continuingCareer ? 'disabled' : ''}>
        <label for="founderClubName">Nombre del club</label>
        <input id="founderClubName" maxlength="42" placeholder="Ej: Club Atlético Los Fundadores">
        <label for="founderCity">Ciudad</label>
        <input id="founderCity" maxlength="42" placeholder="Ej: Villa Celina">
        <label for="founderCountry">País inicial</label>
        <select id="founderCountry">${countryOptionsMarkup(country)}</select>
        <label for="founderPrimaryColor">Color principal</label>
        <input id="founderPrimaryColor" type="color" value="#3b82f6">
      </div>
      <div class="founder-crest-selector card">
        <div class="row"><div><p class="label">Escudo fundador</p><h3>Elegí el escudo del club</h3><p class="muted small">Usa archivos .webp de 256x256 px. Ruta esperada: <code>img/escudos/fundador-1.webp</code> a <code>fundador-9.webp</code>.</p></div></div>
        <div class="founder-crest-grid">${founderCrestOptionsMarkup()}</div>
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
      <div class="row" style="margin-top:14px"><button id="btnCreateFounderClub" class="primary">${continuingCareer ? `Terminar temporada ${currentSeason} y fundar club` : 'Fundar club'}</button></div>
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
      primaryColor:$('founderPrimaryColor')?.value || '#3b82f6',
      crestPath:document.querySelector('input[name="founderCrestPath"]:checked')?.value || ''
    });
  });
}




function openBankruptcyModeModal(options={}){
  options = options && typeof options === 'object' ? options : {};
  if(typeof bankruptcyModeEnabled === 'function' && !bankruptcyModeEnabled()){
    showNotice('El modo Bancarrota está desactivado en la configuración.');
    return;
  }
  if(game && !game.gameOver?.active){
    showNotice('El modo Bancarrota se inicia como una partida nueva o desde una carrera sin club.');
    return;
  }
  const requestedClub = options.selectedClubId ? seed?.clubs?.find(club => Number(club.id) === Number(options.selectedClubId)) : null;
  const initialCountry = requestedClub ? clubCountry(requestedClub) : (availableCountries()[0] || 'Argentina');
  const initialLeague = requestedClub ? (requestedClub.divisionId || 'default') : (divisionsByCountry(initialCountry)[0]?.id || 'default');
  const initialClub = requestedClub?.id || clubsByCountryLeague(initialCountry, initialLeague)[0]?.id || 0;
  const body = `
    <div class="new-game-modal bankruptcy-modal">
      <p class="label">Modo Bancarrota · Renacer</p>
      <h2>Refundar desde las cenizas</h2>
      <p class="muted">Elegí cualquier club del mundo sin bloqueo por prestigio. Es un modo libre, pero el club inicia en bancarrota: deuda extrema, estadio sin capacidad disponible, menos hinchas, prestigio recortado, plantel reducido y una camada juvenil de 16 años para reconstruir.</p>
      <div class="card blocker"><strong>Modo libre en bancarrota.</strong><p class="muted small">La carrera funciona como una partida normal: hay directiva, mercado, lesiones, moral y riesgo deportivo. La primera temporada el objetivo fijo es no descender.</p></div>
      <div class="new-game-form-grid">
        <label for="bankruptcyManagerName">Nombre del manager</label>
        <input id="bankruptcyManagerName" maxlength="40" placeholder="Ej: Emanuel" value="${escapeHtml(storedManagerName())}">
        <label for="bankruptcyCountrySelect">País</label>
        <select id="bankruptcyCountrySelect">${countryOptionsMarkup(initialCountry)}</select>
        <label for="bankruptcyLeagueSelect">Liga</label>
        <select id="bankruptcyLeagueSelect">${leagueOptionsMarkup(initialCountry, initialLeague)}</select>
        <label for="bankruptcyClubSelect">Equipo</label>
        <select id="bankruptcyClubSelect">${typeof teamOptionsMarkupAll === 'function' ? teamOptionsMarkupAll(initialCountry, initialLeague, initialClub, 'Elegible') : teamOptionsMarkup(initialCountry, initialLeague, initialClub)}</select>
      </div>
      <div class="founder-preview card">
        <p class="label">Condiciones iniciales</p>
        <div class="founder-preview-grid">
          <div><span>Selección</span><strong>Libre</strong></div>
          <div><span>Caja</span><strong>Deuda extrema</strong></div>
          <div><span>Estadio</span><strong>Capacidad 0</strong></div>
          <div><span>Campo</span><strong>100%</strong></div>
          <div><span>Hinchas</span><strong>Reducidos</strong></div>
          <div><span>Prestigio club</span><strong>Recortado</strong></div>
          <div><span>Academia</span><strong>20 juveniles</strong></div>
        </div>
      </div>
      <div class="row" style="margin-top:14px"><button id="btnStartBankruptcyMode" class="primary">Iniciar Bancarrota</button><button id="btnBackToNormalNewGame" class="ghost">Volver</button></div>
    </div>`;
  openModal(body);
  const countrySelect = $('bankruptcyCountrySelect');
  const leagueSelect = $('bankruptcyLeagueSelect');
  const clubSelect = $('bankruptcyClubSelect');
  const syncClubs = () => {
    const country = countrySelect?.value || availableCountries()[0] || 'Argentina';
    const league = leagueSelect?.value || divisionsByCountry(country)[0]?.id || 'default';
    if(clubSelect) clubSelect.innerHTML = typeof teamOptionsMarkupAll === 'function' ? teamOptionsMarkupAll(country, league, clubSelect.value, 'Elegible') : teamOptionsMarkup(country, league, clubSelect.value);
  };
  const syncLeagues = () => {
    const country = countrySelect?.value || availableCountries()[0] || 'Argentina';
    if(leagueSelect) leagueSelect.innerHTML = leagueOptionsMarkup(country, leagueSelect.value);
    syncClubs();
  };
  countrySelect?.addEventListener('change', syncLeagues);
  leagueSelect?.addEventListener('change', syncClubs);
  $('bankruptcyManagerName')?.addEventListener('input', event => persistManagerName(event.target.value || ''));
  $('btnBackToNormalNewGame')?.addEventListener('click', () => openNewGameModal(true, { saveSlotId:options.saveSlotId || currentSaveSlotId || SAVE_SLOT_CAREER }));
  $('btnStartBankruptcyMode')?.addEventListener('click', () => {
    const selected = Number(clubSelect?.value || 0);
    if(!selected) return;
    newGame(selected, {
      managerName:$('bankruptcyManagerName')?.value || '',
      country:countrySelect?.value || '',
      leagueId:leagueSelect?.value || '',
      saveSlotId:options.saveSlotId || currentSaveSlotId || SAVE_SLOT_CAREER,
      ignorePrestige:true,
      bankruptcyMode:true
    });
  });
}

function openCampoDestruidoChallengeModal(){
  if(typeof setCurrentSaveSlot === 'function') setCurrentSaveSlot(SAVE_SLOT_CAMPO_DESTRUIDO);
  if(game && !game.gameOver?.active){
    showNotice('Los retos predeterminados se inician como partida nueva o desde una carrera sin club.');
    return;
  }
  const definition = typeof campoDestruidoChallengeDefinition === 'function' ? campoDestruidoChallengeDefinition() : null;
  const clubs = typeof campoDestruidoChallengeClubs === 'function' ? campoDestruidoChallengeClubs() : [];
  if(!clubs.length){ showNotice('No se encontraron los clubes necesarios para el reto.'); return; }
  const rewardAlreadyClaimed = typeof managerChallengeRewardAlreadyClaimed === 'function' ? managerChallengeRewardAlreadyClaimed('campo_destruido') : false;
  const rewardStatus = rewardAlreadyClaimed
    ? 'Premio único ya reclamado: superar nuevamente el reto no entrega puntos adicionales.'
    : 'Premio disponible: 10.000 puntos de habilidad la primera vez que superes el reto.';
  const cards = clubs.map(club => `<button class="card clickable plain challenge-club-card" data-start-campo-destruido="${Number(club.id)}">
    <h3>${clubBadge(club.id)} ${escapeHtml(club.name)}</h3>
    <p class="muted small">${escapeHtml(definition?.textos?.descripcionClub || 'Elegir como tu club para iniciar el reto.')}</p>
    <span class="pill">Prestigio ${clubPrestigeValue(club)}</span>
  </button>`).join('');
  openModal(`<div class="new-game-modal challenge-modal">
    <p class="label">Reto predeterminado</p>
    <h2>${escapeHtml(definition?.nombre || 'Campo destruido')}</h2>
    <p class="muted">${escapeHtml(definition?.textos?.descripcionModal || '')}</p>
    <div class="card blocker"><strong>Reglas del reto</strong><p class="muted small">${escapeHtml(definition?.textos?.reglasModal || definition?.objetivo?.descripcion || '')}</p><p class="small ${rewardAlreadyClaimed ? 'muted' : 'ok'}"><strong>${escapeHtml(rewardStatus)}</strong></p></div>
    <div class="grid cols-3" style="margin-top:14px">${cards}</div>
  </div>`);
  document.querySelectorAll('[data-start-campo-destruido]').forEach(btn => btn.addEventListener('click', () => {
    const clubId = Number(btn.dataset.startCampoDestruido || 0);
    if(typeof startCampoDestruidoChallenge === 'function') startCampoDestruidoChallenge(clubId, { managerName:storedManagerName(), saveSlotId:SAVE_SLOT_CAMPO_DESTRUIDO });
  }));
}

function openNewGameModal(force=false, options={}){
  if(force && typeof force === 'object'){
    options = force.target ? {} : force;
    force = false;
  }
  options = options && typeof options === 'object' ? options : {};
  if(!game && typeof setCurrentSaveSlot === 'function') setCurrentSaveSlot(options.saveSlotId || SAVE_SLOT_CAREER);
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
      <div class="job-search-layout">
        <div class="job-search-main">
          <div class="new-game-form-grid">
            <label for="modalManagerName">Nombre del manager</label>
            <input id="modalManagerName" maxlength="40" placeholder="Ej: Emanuel" value="${escapeHtml(storedManagerName())}" ${hasCareer ? 'disabled' : ''}>
            <label for="modalCountrySelect">País</label>
            <select id="modalCountrySelect">${countryOptionsMarkup(initialCountry)}</select>
            <label for="modalLeagueSelect">Liga</label>
            <select id="modalLeagueSelect">${leagueOptionsMarkup(initialCountry, initialLeague)}</select>
            <label for="modalClubSelect">Equipo</label>
            <select id="modalClubSelect" ${canChooseJob ? '' : 'disabled'}>${teamOptionsMarkup(initialCountry, initialLeague, initialClub)}</select>
            <label for="modalContractNegotiation">Objetivo contractual</label>
            <select id="modalContractNegotiation" ${canChooseJob ? '' : 'disabled'}>
              <option value="prudente">Prudente · objetivo menor · sueldo -20%</option>
              <option value="normal" selected>Normal · objetivo y sueldo base</option>
              <option value="ambicioso">Ambicioso · objetivo mayor · sueldo +25%</option>
            </select>
          </div>
          <div id="modalContractPreview" style="margin-top:14px"></div>
          <div class="row" style="margin-top:14px"><button id="btnStartNewGameModal" class="primary" ${canChooseJob ? '' : 'disabled'}>${game?.gameOver?.active ? 'Firmar con este club' : 'Iniciar carrera'}</button></div>
          ${canChooseJob && typeof founderModeEnabled === 'function' && founderModeEnabled() ? `<div class="card inner" style="margin-top:14px"><div class="row"><div><p class="label">Modo fundador · dificultad extrema</p><strong>Fundar tu propio club</strong><p class="muted small">Creá un club en la división más baja. Empezás con 0 jugadores, $0, estadio sin capacidad, campo deteriorado y sólo ${formatPlainNumber(FOUNDER_CLUB_INITIAL_FANS)} hinchas. Deberás formar el plantel, conseguir ingresos y construir toda la infraestructura desde cero. Al inicio sólo habrá empleados Regulares; los niveles superiores exigen 15 y 45 victorias, además de costos administrativos diarios.${game?.gameOver?.active ? ` La temporada ${game.seasonNumber || 1} se cerrará y el club debutará en la siguiente.` : ''}</p></div><button id="btnOpenFounderMode" class="ghost">Fundar club</button></div></div>` : ''}
          ${canChooseJob && typeof bankruptcyModeEnabled === 'function' && bankruptcyModeEnabled() ? `<div class="card inner" style="margin-top:14px"><div class="row"><div><p class="label">Modo libre en bancarrota</p><strong>Bancarrota, Renacer</strong><p class="muted small">Elegí cualquier club. Empezás con deuda extrema, estadio en capacidad 0, menos hinchas, menor prestigio, plantel reducido, campo al 100% y una academia juvenil de emergencia.</p></div><button id="btnOpenBankruptcyMode" class="ghost">Elegir modo</button></div></div>` : ''}
          ${canChooseJob && typeof campoDestruidoChallengeAvailable === 'function' && campoDestruidoChallengeAvailable() ? `<div class="card inner" style="margin-top:14px"><div class="row"><div><p class="label">Retos predeterminados</p><strong>${escapeHtml(typeof campoDestruidoChallengeDefinition === 'function' ? campoDestruidoChallengeDefinition()?.nombre || 'Campo destruido' : 'Campo destruido')}</strong><p class="muted small">${escapeHtml(typeof campoDestruidoChallengeDefinition === 'function' ? campoDestruidoChallengeDefinition()?.textos?.descripcionTarjeta || '' : '')}</p></div><button id="btnOpenCampoDestruidoChallenge" class="ghost">Elegir reto</button></div></div>` : ''}
        </div>
        ${canChooseJob && typeof managerAvailableClubsPanelMarkup === 'function' ? managerAvailableClubsPanelMarkup({ context:'modal', selectable:true }) : ''}
      </div>
    </div>`;
  openModal(body);
  const countrySelect = $('modalCountrySelect');
  const leagueSelect = $('modalLeagueSelect');
  const clubSelect = $('modalClubSelect');
  const contractNegotiationSelect = $('modalContractNegotiation');
  const contractPreview = $('modalContractPreview');
  const modalContractOfferForClub = (clubId) => {
    const club = seed?.clubs?.find(item => Number(item.id) === Number(clubId));
    if(!club || typeof managerContractDurationForOffer !== 'function') return null;
    const state = game || {
      saveCode:'new-career-preview',
      seasonNumber:1,
      selectedClubId:Number(clubId),
      currentDate:firstAdvanceDateForSeason(seasonYearForNumber(1)),
      clubBudgets:Object.fromEntries((seed?.clubs || []).map(item => [item.id, Number(item.budget || 0)])),
      managerStats:createInitialManagerStats()
    };
    const source = game?.gameOver?.active ? 'busqueda_directa' : 'inicio_carrera';
    return {
      id:`modal-contract-${club.id}-${state.seasonNumber || 1}`,
      clubId:Number(club.id),
      source,
      contractType:'normal',
      durationSeasons:game?.gameOver?.active ? managerContractDurationForOffer(club, { source, contractType:'normal' }, state) : 1,
      managerPrestigeAtOffer:Number(prestige || 0),
      baseObjectivePpg:managerObjectiveBaseForClubDivision(club.id),
      futureSalePercent:managerContractFutureSalePercent(club, source, state)
    };
  };
  const refreshModalContractPreview = () => {
    if(!contractPreview || typeof managerContractOfferPreviewMarkup !== 'function') return;
    const offer = modalContractOfferForClub(Number(clubSelect?.value || 0));
    contractPreview.innerHTML = offer ? managerContractOfferPreviewMarkup(offer, contractNegotiationSelect?.value || 'normal') : '';
  };
  const syncLeagues = () => {
    const country = countrySelect?.value || availableCountries()[0] || 'Argentina';
    if(leagueSelect) leagueSelect.innerHTML = leagueOptionsMarkup(country, leagueSelect.value);
    syncClubs();
  };
  const syncClubs = () => {
    const country = countrySelect?.value || availableCountries()[0] || 'Argentina';
    const league = leagueSelect?.value || divisionsByCountry(country)[0]?.id || 'default';
    if(clubSelect) clubSelect.innerHTML = teamOptionsMarkup(country, league, clubSelect.value);
    refreshModalContractPreview();
  };
  countrySelect?.addEventListener('change', syncLeagues);
  leagueSelect?.addEventListener('change', syncClubs);
  clubSelect?.addEventListener('change', refreshModalContractPreview);
  contractNegotiationSelect?.addEventListener('change', refreshModalContractPreview);
  $('modalManagerName')?.addEventListener('input', event => persistManagerName(event.target.value || ''));
  document.querySelectorAll('[data-select-job-club]').forEach(btn => btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const clubId = Number(btn.dataset.selectJobClub || 0);
    const club = seed?.clubs?.find(c => Number(c.id) === clubId);
    if(!club || !clubSelect) return;
    const country = clubCountry(club);
    if(countrySelect) countrySelect.value = country;
    if(leagueSelect) leagueSelect.innerHTML = leagueOptionsMarkup(country, club.divisionId || 'default');
    if(leagueSelect) leagueSelect.value = club.divisionId || 'default';
    clubSelect.innerHTML = teamOptionsMarkup(country, club.divisionId || 'default', clubId);
    clubSelect.value = String(clubId);
    refreshModalContractPreview();
  }));
  refreshModalContractPreview();
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
    const contractNegotiationLevel = contractNegotiationSelect?.value || 'normal';
    if(game?.gameOver?.active) continueCareerAtClub(selected, {
      country:countrySelect?.value || '',
      leagueId:leagueSelect?.value || '',
      contractNegotiationLevel
    });
    else if(!game) newGame(selected, {
      managerName:$('modalManagerName')?.value || '',
      country:countrySelect?.value || '',
      leagueId:leagueSelect?.value || '',
      contractNegotiationLevel,
      saveSlotId:options.saveSlotId || SAVE_SLOT_CAREER
    });
  });
  $('btnOpenFounderMode')?.addEventListener('click', () => openFounderModeModal());
  $('btnOpenBankruptcyMode')?.addEventListener('click', () => openBankruptcyModeModal({ saveSlotId:options.saveSlotId || currentSaveSlotId || SAVE_SLOT_CAREER }));
  $('btnOpenCampoDestruidoChallenge')?.addEventListener('click', () => { if(typeof startNewCampoDestruidoSlot === 'function') startNewCampoDestruidoSlot(); else openCampoDestruidoChallengeModal(); });
}
function gameHelpGoButton(tab, label, subtab='', mode=''){
  const subtabAttr = subtab ? ` data-help-subtab="${escapeHtml(subtab)}"` : '';
  const modeAttr = mode ? ` data-help-mode="${escapeHtml(mode)}"` : '';
  return `<button class="ghost small-btn help-jump-btn" type="button" data-help-tab="${escapeHtml(tab)}"${subtabAttr}${modeAttr}>${escapeHtml(label)}</button>`;
}
function openGameHelpModal(){
  const body = `
  <div class="help-modal">
    <div class="help-hero card">
      <p class="eyebrow">Guía actualizada · V8.16</p>
      <h2>Ayuda de Fútbol Manager</h2>
      <p class="muted">La carrera ahora separa claramente dos patrimonios: el club administra plantel profesional, estadio, sponsors y presupuesto institucional; el manager conserva su Cuenta Bancaria, contrato laboral, Tu Academia y derechos económicos aunque cambie de equipo.</p>
    </div>

    <div class="help-section">
      <h3>Rutina básica de cada avance</h3>
      <div class="help-grid">
        <article class="help-card card">
          <span class="pill warn">1 · Control diario</span>
          <h4>Inicio</h4>
          <p>Es el tablero principal. Reúne próximo partido, resultados, alertas, lesionados, presupuesto del club y decisiones pendientes. También avisa sobre ofertas laborales, pagos de sueldo y propuestas por juveniles.</p>
          ${gameHelpGoButton('home','Abrir Inicio')}
        </article>
        <article class="help-card card">
          <span class="pill warn">2 · Competencia</span>
          <h4>Primer Equipo</h4>
          <p>Concentra Táctica, Plantel, Entrenamiento y Estadísticas por temporada. Revisá disponibilidad, forma, moral, cohesión y rendimiento antes de confirmar el once.</p>
          <div class="help-actions">${gameHelpGoButton('firstTeam','Abrir Táctica','tactics')}${gameHelpGoButton('firstTeam','Abrir Plantel','squad')}${gameHelpGoButton('firstTeam','Abrir Entrenamiento','training')}${gameHelpGoButton('firstTeam','Abrir Estadísticas','playerStats')}</div>
        </article>
        <article class="help-card card">
          <span class="pill warn">3 · Decisiones</span>
          <h4>Mensajes</h4>
          <p>Reúne ofertas, avisos de directiva, lesiones, vencimientos, ventas y consecuencias de decisiones anteriores. Algunas operaciones sólo se resuelven desde esta bandeja.</p>
          ${gameHelpGoButton('messages','Abrir Mensajes')}
        </article>
      </div>
    </div>

    <div class="help-section">
      <h3>Contrato y patrimonio del manager</h3>
      <div class="help-grid">
        <article class="help-card card">
          <h4>Contrato actual</h4>
          <p>Los clubes ofrecen contratos de una, dos o tres temporadas. El último año concentra el objetivo final y los años previos aplican mínimos progresivos. Podés elegir una exigencia prudente, normal o ambiciosa; eso modifica objetivo y sueldo, pero no duración ni porcentaje futuro.</p>
          ${gameHelpGoButton('careerJobs','Abrir contrato actual')}
        </article>
        <article class="help-card card">
          <h4>Sueldo mensual</h4>
          <p>El club paga cada 30 días. El dinero sale de Finanzas institucionales e ingresa en la Cuenta Bancaria personal. El sueldo termina al dejar el club y no se traslada al siguiente contrato.</p>
          ${gameHelpGoButton('finance','Abrir Cuenta Bancaria','','bank')}
        </article>
        <article class="help-card card">
          <h4>Dos economías separadas</h4>
          <p>El presupuesto del club paga fichajes, salarios profesionales, empleados institucionales, estadio y sponsors. La cuenta personal paga todos los gastos de Tu Academia. Un saldo no puede utilizarse para cubrir directamente al otro.</p>
          <div class="help-actions">${gameHelpGoButton('finance','Finanzas del club','','main')}${gameHelpGoButton('finance','Cuenta personal','','bank')}</div>
        </article>
        <article class="help-card card">
          <h4>Ofertas laborales</h4>
          <p>Antes de aceptar compará duración, sueldo, objetivo anual y porcentaje de futuras ventas. Un contrato largo ofrece estabilidad, pero puede pagar algo menos por mes y mantener exigencias mínimas durante varios años.</p>
          ${gameHelpGoButton('careerJobs','Revisar ofertas laborales')}
        </article>
      </div>
    </div>

    <div class="help-section">
      <h3>Tu Academia</h3>
      <div class="help-grid">
        <article class="help-card card">
          <h4>Propiedad personal</h4>
          <p>Juveniles, Predio, residencias y Preparador pertenecen al manager. Se conservan al cambiar de club, renunciar, ser despedido o quedar sin trabajo. La Academia puede seguir funcionando sin club.</p>
          ${gameHelpGoButton('academy','Abrir Tu Academia')}
        </article>
        <article class="help-card card">
          <h4>Captación y desarrollo</h4>
          <p>La primera captación anual entrega la cuota excepcional completa según el nivel del Predio, hasta seis en nivel Elite. Necesitás cupos suficientes y saldo personal para captaciones, residencias, becas, tratamientos, empleados y obras.</p>
          <div class="help-actions">${gameHelpGoButton('academy','Revisar juveniles')}${gameHelpGoButton('careerImprovements','Abrir Mejoras')}</div>
        </article>
        <article class="help-card card">
          <h4>Ofertas por juveniles</h4>
          <p>Los jugadores de 17 años pueden recibir ofertas de clubes bot. La bandeja permite aceptar o rechazar; al vender, la federación retiene 5% y el resto ingresa íntegramente en la Cuenta Bancaria del manager.</p>
          ${gameHelpGoButton('academy','Abrir ofertas juveniles')}
        </article>
        <article class="help-card card">
          <h4>Promoción y cartera</h4>
          <p>Para ofrecer contrato profesional necesitás dirigir un club, que el juvenil tenga al menos 16 años y disponer de cupo en el plantel. El jugador promovido registra el porcentaje de futura venta del contrato laboral vigente. Ese derecho queda en tu cartera y persiste aunque abandones el club.</p>
          ${gameHelpGoButton('academy','Abrir cartera de promocionados','','portfolio')}
        </article>
      </div>
    </div>

    <div class="help-section">
      <h3>Gestión del club</h3>
      <div class="help-grid">
        <article class="help-card card">
          <h4>Mercado y Centro de Ojeo</h4>
          <p>El mercado profesional utiliza el presupuesto del club. Ojeá antes de invertir para conocer habilidades, edad, cláusula, media general, puntaje total y probabilidad de fichaje.</p>
          <div class="help-actions">${gameHelpGoButton('market','Abrir Mercado')}${gameHelpGoButton('scouting','Abrir Ojeo')}</div>
        </article>
        <article class="help-card card">
          <h4>Empleados</h4>
          <p>Psicólogo, Kinesiólogo y personal de observación pertenecen al club. El Preparador de juveniles pertenece a Tu Academia y se paga con dinero personal. Revisá esa diferencia antes de contratar.</p>
          ${gameHelpGoButton('employees','Abrir Empleados')}
        </article>
        <article class="help-card card">
          <h4>Estadio e instalaciones</h4>
          <p>El estadio, el campo y la calefacción del césped siguen siendo propiedad del club. El Predio juvenil ya no está aquí: se administra y financia desde Carrera → Mejoras.</p>
          ${gameHelpGoButton('stadium','Abrir Estadio','','facilities')}
        </article>
        <article class="help-card card">
          <h4>Sponsors, hinchas y finanzas</h4>
          <p>Son recursos institucionales. Sus ingresos pertenecen al club y no a la cuenta personal. Usalos para sostener salarios, obras, fichajes y costos operativos.</p>
          <div class="help-actions">${gameHelpGoButton('stadium','Abrir Sponsors','','sponsors')}${gameHelpGoButton('stadium','Abrir Hinchas y socios','','fans')}${gameHelpGoButton('finance','Abrir Finanzas','','main')}</div>
        </article>
      </div>
    </div>

    <div class="help-section">
      <h3>Competición, carrera y modos online</h3>
      <div class="help-grid">
        <article class="help-card card">
          <h4>Calendario y competiciones</h4>
          <p>Usá el calendario para planificar rotaciones. Tabla de posiciones, palmarés y estadísticas permiten evaluar el contexto del objetivo contractual y la evolución del equipo.</p>
          <div class="help-actions">${gameHelpGoButton('fixture','Abrir Calendario')}${gameHelpGoButton('standings','Abrir Tabla','','standings')}${gameHelpGoButton('stats','Abrir Estadísticas')}</div>
        </article>
        <article class="help-card card">
          <h4>Perfil, historial e hitos</h4>
          <p>El historial registra clubes, temporadas y resultados. Los hitos, el prestigio y las licencias acompañan al manager durante toda la carrera, independientemente de su empleador actual.</p>
          ${gameHelpGoButton('mystats','Abrir perfil e historial','','profile')}
        </article>
        <article class="help-card card">
          <h4>Ranking y Desafíos Online</h4>
          <p>El Ranking compara carreras completas. Desafíos Online utiliza convocatorias publicadas y un simulador independiente; no altera contrato laboral, Academia ni cartera personal.</p>
          <div class="help-actions">${gameHelpGoButton('ranking','Abrir Ranking')}${gameHelpGoButton('challenges','Abrir Desafíos')}</div>
        </article>
        <article class="help-card card">
          <h4>Cartas especiales</h4>
          <p>Las cartas aplican efectos limitados sobre áreas concretas. Conviene reservarlas para objetivos claros y recordar que no reemplazan una estructura económica o deportiva sostenible.</p>
          ${gameHelpGoButton('special','Abrir Cartas')}
        </article>
      </div>
    </div>

    <div class="help-section">
      <h3>Funciones superiores</h3>
      <div class="help-grid compact">
        <article class="help-card card"><h4>Guardar</h4><p>Guarda la partida local. Usalo antes de cerrar o después de operaciones importantes.</p></article>
        <article class="help-card card"><h4>Cargar</h4><p>Abre los slots para continuar una carrera o iniciar otra.</p></article>
        <article class="help-card card"><h4>Renunciar</h4><p>Finaliza el contrato actual y sus pagos. Tu saldo, Academia y derechos económicos permanecen.</p></article>
        <article class="help-card card"><h4>Avance automático</h4><p>Avanza hasta que una decisión, bloqueo o revisión requiera intervención manual.</p></article>
      </div>
    </div>

    <div class="card help-final-note">
      <h3>Secuencia recomendada</h3>
      <p>Revisá Inicio y Mensajes, corregí Primer Equipo, comprobá el Calendario y el objetivo contractual, controlá por separado Finanzas del club y Cuenta Bancaria, atendé Tu Academia y recién entonces avanzá. En una carrera larga no sólo importa ganar: también sostener el contrato, financiar la Academia y conservar oportunidades futuras en la cartera.</p>
    </div>
  </div>`;
  openModal(body);
  document.querySelectorAll('[data-help-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.helpTab || 'home';
      const subtab = btn.dataset.helpSubtab || '';
      const mode = btn.dataset.helpMode || '';
      if(!game && tab !== 'ranking'){
        closeModal();
        if(typeof showNotice === 'function') showNotice('Iniciá o cargá una partida para abrir esa sección.', true);
        return;
      }
      if(tab === 'firstTeam' && subtab) firstTeamTab = subtab;
      if(tab === 'academy' && mode){
        game.academy = game.academy && typeof game.academy === 'object' && !Array.isArray(game.academy) ? game.academy : {};
        game.academy.submenu = mode === 'portfolio' ? 'portfolio' : 'players';
      }
      if(typeof prepareSidebarNavigation === 'function') prepareSidebarNavigation(tab, mode);
      else {
        if(tab === 'finance' && mode) financeViewMode = mode;
        if(tab === 'stadium' && mode) stadiumViewMode = mode;
        if(tab === 'standings' && mode) selectedCompetitionView = mode;
        if(tab === 'mystats' && mode) managerStatsViewMode = mode;
      }
      activeTab = tab;
      closeModal();
      if(typeof renderAll === 'function') renderAll();
    });
  });
}

function openModal(html){
  closeModal();
  const wrapper = document.createElement('div');
  wrapper.id = 'modalRoot';
  wrapper.innerHTML = `<div class="modal-backdrop"><div class="modal-panel"><button class="modal-close" data-close-modal aria-label="Cerrar">×</button>${html}</div></div>`;
  document.body.appendChild(wrapper);
}
function closeModal(){
  if(window.__liveMatchCloseLocked){
    if(typeof showNotice === 'function') showNotice('El partido está en vivo. Debés terminar los 90 minutos y guardar el resultado para salir.', true);
    return;
  }
  clearMatchRevealTimers();
  const root = $('modalRoot');
  if(root) root.remove();
}
function forceCloseModal(){
  try{ clearMatchRevealTimers(); }catch(error){}
  const root = $('modalRoot');
  if(root) root.remove();
  document.querySelectorAll('.modal-backdrop').forEach(node => node.remove());
}

