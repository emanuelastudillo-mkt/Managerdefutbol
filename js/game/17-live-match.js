/* V5.11 · Simulación viva minuto a minuto con tablero táctico, cambios por clic e instrucciones activables. */
(function(){
  let liveSession = null;
  let liveOptions = null;
  let liveState = null;
  let livePaused = true;
  let liveAutoTimer = null;
  let liveSelectedInstruction = 'none';
  let liveSelectedStarterId = 0;
  let liveSelectedBenchId = 0;
  let livePendingSubstitutions = [];

  function ehtml(value){
    return typeof escapeHtml === 'function' ? escapeHtml(value) : String(value ?? '').replace(/[&<>\"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[ch]));
  }
  function fmtNumber(value){ return new Intl.NumberFormat('es-AR').format(Number(value || 0)); }
  function lastName(name){
    return typeof playerLastName === 'function' ? playerLastName(name) : String(name || 'Jugador').trim().split(/\s+/).slice(-1)[0];
  }
  function liveClubName(id){ return typeof clubName === 'function' ? clubName(id) : `Club ${id}`; }
  function liveBadge(id){ return typeof clubBadge === 'function' ? clubBadge(id) : ''; }
  function ownClubId(){ return Number(game?.selectedClubId || 0); }
  function ownSide(){
    const own = ownClubId();
    if(!liveState?.match || !own) return 'home';
    return Number(liveState.match.homeId) === own ? 'home' : 'away';
  }
  function currentOwnLineup(){ return ownSide() === 'home' ? (liveState?.homeLineup || []) : (liveState?.awayLineup || []); }
  function rivalLineup(){ return ownSide() === 'home' ? (liveState?.awayLineup || []) : (liveState?.homeLineup || []); }
  function rivalClubId(){ return ownSide() === 'home' ? liveState?.match?.awayId : liveState?.match?.homeId; }
  function ownFormation(){ return liveState?.ownFormation || (ownSide() === 'home' ? liveState?.homeFormation : liveState?.awayFormation) || '4-4-2'; }
  function eventPlayerLabel(id, full=false){
    const player = typeof playerById === 'function' ? playerById(id) : null;
    const name = player?.name || player?.nombre || 'Jugador';
    return full ? name : lastName(name);
  }
  function liveShowNotice(message, error=false){
    if(typeof showNotice === 'function') showNotice(message, error);
  }
  function liveConfirm(message){
    return typeof window.confirm === 'function' ? window.confirm(message) : true;
  }
  function liveEvents(){
    const events = [];
    (liveState?.goals || []).forEach(g => {
      const assist = g.assistId ? ` · asistencia ${eventPlayerLabel(g.assistId)}` : '';
      const detail = g.errorGoal ? ' · error rival' : (g.setPiece ? ' · pelota parada' : assist);
      events.push({ minute:Number(g.minute || 0), type:'goal', clubId:g.clubId, data:g, text:`Gol de ${eventPlayerLabel(g.playerId)}${detail}` });
    });
    (liveState?.cards || []).forEach(c => {
      const kind = c.type === 'yellow' ? 'Amarilla' : (c.type === 'secondYellowRed' ? 'Doble amarilla y roja' : 'Roja directa');
      events.push({ minute:Number(c.minute || 0), type:c.type === 'yellow' ? 'yellow' : 'red', clubId:c.clubId, data:c, text:`${kind}: ${eventPlayerLabel(c.playerId)}` });
    });
    (liveState?.injuries || []).forEach(i => events.push({ minute:Number(i.minute || 0), type:'injury', clubId:i.clubId, data:i, text:`Lesión de ${eventPlayerLabel(i.playerId)} · ${i.injuryLabel || i.name || 'Lesión'}` }));
    (liveState?.substitutions || []).forEach(s => events.push({ minute:Number(s.minute || 0), type:'sub', clubId:s.clubId, data:s, text:`Cambio: entra ${eventPlayerLabel(s.inId)}, sale ${eventPlayerLabel(s.outId)}` }));
    (liveState?.keySaves || []).forEach(k => events.push({ minute:Number(k.minute || 0), type:'save', clubId:k.clubId, data:k, text:`Tapada clave de ${eventPlayerLabel(k.playerId)}${k.chanceById ? ` a ${eventPlayerLabel(k.chanceById)}` : ''}` }));
    (liveState?.errors || []).forEach(err => events.push({ minute:Number(err.minute || 0), type:'error', clubId:err.clubId, data:err, text:`${err.goal ? 'Error de gol' : 'Error'} de ${eventPlayerLabel(err.playerId)}` }));
    return events.sort((a,b)=>a.minute-b.minute || eventOrder(a.type)-eventOrder(b.type));
  }
  function eventOrder(type){ return ({ goal:1, red:2, injury:3, yellow:4, save:5, error:6, sub:7 })[type] || 9; }
  function eventIcon(type){ return ({ goal:'⚽', yellow:'🟨', red:'🟥', injury:'✚', sub:'⇄', save:'🧤', error:'⚠️' })[type] || '•'; }
  function liveNarration(events){
    const minute = Number(liveState?.minute || 0);
    const fresh = events.filter(ev => Number(ev.minute || 0) === minute).slice(-1)[0];
    const latest = fresh || events.slice(-1)[0];
    if(liveState?.finished){
      const h = Number(liveState.homeGoals || 0), a = Number(liveState.awayGoals || 0);
      return { tone:'final', title:'Final del partido', text:`Resultado final: ${h} - ${a}.`, sub:'Ya podés cerrar y guardar el resultado.' };
    }
    if(latest && latest.minute === minute){
      const playerId = latest.data?.playerId || latest.data?.inId || latest.data?.outId || 0;
      const player = typeof playerById === 'function' ? playerById(playerId) : null;
      const club = liveClubName(latest.clubId);
      const rivalId = Number(latest.clubId) === Number(liveState.match?.homeId) ? liveState.match?.awayId : liveState.match?.homeId;
      const rival = liveClubName(rivalId);
      const fallback = narrationFallback(latest, player, club, rival);
      const bucket = latest.type === 'yellow' || latest.type === 'red' ? 'card' : latest.type;
      const text = typeof pickRelatoPhrase === 'function'
        ? applyTemplateSafe(pickRelatoPhrase(bucket, `live-${liveState.match?.id}-${latest.type}-${latest.minute}-${playerId}`, fallback), { player:player?.name || 'el jugador', club, rival, minute:latest.minute })
        : fallback;
      return { tone:`event-${latest.type}`, title:`Minuto ${minute}'`, text, sub:latest.text };
    }
    const stats = liveState?.matchStats || {};
    const hStats = stats.home || {}, aStats = stats.away || {};
    const hPressure = Number(hStats.attacks || 0) + Number(hStats.chances || 0) * 3 + Number(hStats.possession || 50) / 12;
    const aPressure = Number(aStats.attacks || 0) + Number(aStats.chances || 0) * 3 + Number(aStats.possession || 50) / 12;
    const leader = hPressure > aPressure + 2 ? liveClubName(liveState.match.homeId) : (aPressure > hPressure + 2 ? liveClubName(liveState.match.awayId) : 'ninguno');
    const text = leader === 'ninguno' ? 'El partido está parejo y todavía no aparece una ventaja clara.' : `${leader} empieza a inclinar la cancha.`;
    return { tone:'ambient', title:`Minuto ${minute}'`, text, sub:minute < 45 ? 'Primer tiempo en desarrollo.' : 'Segundo tiempo en desarrollo.' };
  }
  function narrationFallback(event, player, club, rival){
    const p = player?.name || 'el jugador';
    if(event.type === 'goal') return `¡Gol de ${p}! ${club} golpea en el minuto ${event.minute}.`;
    if(event.type === 'save') return `Tapada clave para ${club}. El arquero sostiene el resultado.`;
    if(event.type === 'error') return `Error de ${p}. ${club} queda comprometido ante ${rival}.`;
    if(event.type === 'injury') return `Lesión de ${p}. Malas noticias para ${club}.`;
    if(event.type === 'sub') return `${club} mueve el banco y busca ajustar el partido.`;
    if(event.type === 'red') return `Expulsión para ${p}. El partido cambia de forma inmediata.`;
    if(event.type === 'yellow') return `Amonestado ${p}. El margen de error empieza a achicarse.`;
    return 'El partido sigue vivo.';
  }
  function applyTemplateSafe(text, data){ return String(text || '').replace(/\{([a-zA-Z_]+)\}/g, (_, key) => String(data?.[key] ?? '')); }
  function meterClass(value){
    const n = Number(value || 0);
    return n >= 76 ? 'ok' : n >= 55 ? 'warn' : 'bad';
  }
  function fitClass(value){
    const n = Number(value || 0);
    return n >= 90 ? 'ok' : n >= 74 ? 'warn' : 'bad';
  }
  function playerMiniRow(player, isOwn=false){
    const condition = Math.round(Number(player.condition || 0));
    const morale = Math.round(Number(player.morale || 0));
    const fit = Math.round(Number(player.fit || 100));
    return `<div class="live-player-row ${isOwn ? 'own' : ''}">
      <span class="live-player-name">${ehtml(lastName(player.name))}</span>
      <span class="live-player-role">${ehtml(player.role || player.position || '—')}</span>
      <strong>${Math.round(Number(player.overall || 0))}</strong>
      <span class="live-meter ${meterClass(condition)}">${condition}</span>
      <span class="live-meter ${meterClass(morale)}">${morale}</span>
      <span class="live-meter ${fitClass(fit)}">${fit}</span>
    </div>`;
  }
  function lineupCard(title, clubId, list, isOwn=false){
    return `<div class="card inner live-lineup-card">
      <div class="live-lineup-title"><span>${liveBadge(clubId)}</span><strong>${ehtml(title)}</strong></div>
      <div class="live-lineup-head"><span>Apellido</span><span>Rol</span><span>MED</span><span>Fís.</span><span>Moral</span><span>Rol%</span></div>
      <div class="live-lineup-list">${(list || []).map(p => playerMiniRow(p, isOwn)).join('') || '<p class="muted small">Sin jugadores en cancha.</p>'}</div>
    </div>`;
  }
  function statMini(label, value, suffix=''){
    return `<div class="live-stat-mini"><span>${ehtml(label)}</span><strong>${ehtml(value)}${ehtml(suffix)}</strong></div>`;
  }
  function liveStatsCard(title, clubId, stats={}, side='home'){
    return `<div class="card inner live-stats-card ${side}">
      <div class="live-stats-title"><span>${liveBadge(clubId)}</span><strong>${ehtml(title)}</strong></div>
      <div class="live-stat-grid">
        ${statMini('Ataques', stats.attacks ?? 0)}
        ${statMini('Ocasiones', stats.chances ?? 0)}
        ${statMini('xG', Number(stats.xg || 0).toFixed(2))}
        ${statMini('Posesión', stats.possession ?? 50, '%')}
        ${statMini('Faltas', stats.fouls ?? 0)}
        ${statMini('Tapadas', stats.keySaves ?? 0)}
        ${statMini('Errores', `${stats.errors ?? 0}/${stats.goalErrors ?? 0}`)}
        ${statMini('Pases', stats.passScore || '—')}
      </div>
    </div>`;
  }
  function possessionStrip(){
    const h = Math.max(0, Math.min(100, Number(liveState?.matchStats?.home?.possession || 50)));
    const a = 100 - h;
    return `<div class="live-possession-strip" style="--home-pos:${h}%"><span>${liveBadge(liveState.match.homeId)} ${h}%</span><span>${a}% ${liveBadge(liveState.match.awayId)}</span></div>`;
  }
  function minuteRail(events){
    const eventMinutes = new Map();
    events.forEach(ev => eventMinutes.set(Number(ev.minute || 0), ev.type));
    const current = Number(liveState?.minute || 0);
    return `<div class="live-minute-rail" aria-label="90 fases minuto a minuto">${Array.from({ length:90 }, (_, i) => {
      const minute = i + 1;
      const type = eventMinutes.get(minute);
      const cls = minute < current ? 'done' : (minute === current ? 'current' : 'pending');
      return `<span class="${cls} ${type ? `has-event ${ehtml(type)}` : ''}" title="${minute}'${type ? ` · ${type}` : ''}"></span>`;
    }).join('')}</div>`;
  }
  function remainingSubstitutions(){
    return Math.max(0, Number(liveState?.maxSubs || 3) - Number(liveState?.usedSubs || 0) - livePendingSubstitutions.length);
  }
  function pendingOutIds(){ return new Set(livePendingSubstitutions.map(s => Number(s.outId))); }
  function pendingInIds(){ return new Set(livePendingSubstitutions.map(s => Number(s.inId))); }
  function availabilityBadge(player, inField){
    if(inField && pendingOutIds().has(Number(player.id))) return '<span class="live-card-tag warn">SALE</span>';
    if(!inField && pendingInIds().has(Number(player.id))) return '<span class="live-card-tag ok">ENTRA</span>';
    return '';
  }
  function playerTacticalCard(player, inField=true){
    const id = Number(player.id || 0);
    const selected = inField ? Number(liveSelectedStarterId) === id : Number(liveSelectedBenchId) === id;
    const disabled = inField ? pendingOutIds().has(id) : pendingInIds().has(id);
    const cond = Math.round(Number(player.condition || 0));
    const morale = Math.round(Number(player.morale || 0));
    const fit = Math.round(Number(player.fit || (inField ? 100 : 0)));
    const attr = inField ? `data-live-starter-id="${id}"` : `data-live-bench-id="${id}"`;
    return `<button type="button" class="live-tactical-player ${inField ? 'field' : 'bench'} ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}" ${attr} ${disabled ? 'disabled' : ''}>
      <span class="live-tactical-name">${ehtml(lastName(player.name))}</span>
      <span class="live-tactical-meta"><b>${Math.round(Number(player.overall || 0))}</b> ${ehtml(player.role || player.position || '—')}</span>
      <span class="live-tactical-bars"><i class="${meterClass(cond)}">F${cond}</i><i class="${meterClass(morale)}">M${morale}</i>${inField ? `<i class="${fitClass(fit)}">R${fit}</i>` : ''}</span>
      ${availabilityBadge(player, inField)}
    </button>`;
  }
  function formationSelect(){
    const current = ownFormation();
    const formations = Array.isArray(liveState?.availableFormations) && liveState.availableFormations.length ? liveState.availableFormations : ['4-4-2','4-3-3','4-2-3-1','3-5-2','5-3-2','4-1-4-1','3-4-3','4-5-1','4-3-1-2','5-4-1'];
    return `<select id="liveFormationSelect" ${liveState?.finished ? 'disabled' : ''}>${formations.map(f => `<option value="${ehtml(f)}" ${f === current ? 'selected' : ''}>${ehtml(f)}</option>`).join('')}</select>`;
  }
  function instructionButtons(){
    const options = Array.isArray(window.LIVE_MANAGER_INSTRUCTIONS) ? window.LIVE_MANAGER_INSTRUCTIONS : [];
    return `<div class="live-instruction-buttons">${options.map(opt => `<button type="button" data-live-instruction="${ehtml(opt.value)}" class="${opt.value === liveSelectedInstruction ? 'active' : ''}" title="${ehtml(opt.desc || '')}"><strong>${ehtml(opt.label)}</strong><span>${ehtml(opt.desc || '')}</span></button>`).join('')}</div>`;
  }
  function pendingSubstitutionList(){
    if(!livePendingSubstitutions.length) return '<p class="muted small">Sin cambios pendientes.</p>';
    return `<div class="live-pending-subs">${livePendingSubstitutions.map((s, index) => `<div><span>Próx. minuto</span><strong>Entra ${ehtml(eventPlayerLabel(s.inId))} · Sale ${ehtml(eventPlayerLabel(s.outId))}</strong><button type="button" data-live-remove-pending-sub="${index}" class="ghost mini">Quitar</button></div>`).join('')}</div>`;
  }
  function ownTacticalBoard(){
    const own = ownClubId();
    const lineup = currentOwnLineup();
    const bench = liveState?.ownBench || [];
    const selectedHint = liveSelectedStarterId
      ? `Seleccionado sale: ${eventPlayerLabel(liveSelectedStarterId)}. Elegí un suplente para cambiar o un titular para reacomodar.`
      : (liveSelectedBenchId ? `Seleccionado entra: ${eventPlayerLabel(liveSelectedBenchId)}. Elegí el titular que sale.` : 'Click titular + suplente para cambiar. Click titular + titular para reacomodar roles.');
    return `<section class="card inner live-tactical-board">
      <div class="live-tactical-top">
        <div><p class="label">Tu equipo · ${lineup.length + bench.length} disponibles</p><h3>${liveBadge(own)} ${ehtml(liveClubName(own))}</h3></div>
        <div class="live-formation-control"><span>Formación</span>${formationSelect()}</div>
      </div>
      <p class="muted small live-selected-hint">${ehtml(selectedHint)}</p>
      <div class="live-pitch-board">
        ${(lineup || []).map(p => playerTacticalCard(p, true)).join('')}
      </div>
      <div class="live-bench-board">
        <div class="live-bench-title"><strong>Banco</strong><span>${bench.length} suplentes</span></div>
        <div class="live-bench-list">${bench.map(p => playerTacticalCard(p, false)).join('') || '<p class="muted small">Sin suplentes disponibles.</p>'}</div>
      </div>
      <div class="live-pending-box">
        <div class="live-bench-title"><strong>Cambios</strong><span>${Number(liveState.usedSubs || 0)} usados · ${remainingSubstitutions()} restantes</span></div>
        ${pendingSubstitutionList()}
      </div>
    </section>`;
  }
  function liveManagerPanel(){
    return `<div class="card inner live-manager-panel">
      <div class="live-card-head"><h3>Instrucciones</h3><span class="pill">${livePaused ? 'Pausado' : 'Auto'}</span></div>
      ${instructionButtons()}
      <div class="live-action-row">
        <button id="livePauseBtn" class="ghost">${livePaused ? 'Auto' : 'Pausar'}</button>
        <button id="liveNextBlockBtn" class="primary" ${liveState.finished ? 'disabled' : ''}>Simular 1 minuto</button>
        <button id="liveFinishBtn" class="primary" ${liveState.finished ? '' : 'disabled'}>Cerrar y guardar</button>
      </div>
    </div>`;
  }
  function renderLiveMatch(){
    if(!liveState) return;
    const match = liveState.match || {};
    const homeTitle = liveClubName(match.homeId);
    const awayTitle = liveClubName(match.awayId);
    const currentMinute = Number(liveState.minute || 0);
    const totalPhases = Number(liveState.totalPhases || 90);
    const progress = Math.max(0, Math.min(100, Math.round((currentMinute / 90) * 100)));
    const nextBlock = liveState.nextBlock;
    const events = liveEvents();
    const narration = liveNarration(events);
    const recentEvents = events.slice().reverse().slice(0, 14);
    const hStats = liveState.matchStats?.home || {};
    const aStats = liveState.matchStats?.away || {};
    const html = `<div class="live-match-shell live-v511">
      <div class="match-modal-head live-match-head">
        <div class="live-head-left"><p class="label">${match.friendly ? 'Simulación viva · Amistoso' : 'Simulación viva · Fecha'} ${ehtml(match.matchday || '—')} · ${ehtml(match.date || '')}</p><h2>${liveBadge(match.homeId)} ${ehtml(homeTitle)} <span class="live-score">${Number(liveState.homeGoals || 0)} - ${Number(liveState.awayGoals || 0)}</span> ${ehtml(awayTitle)} ${liveBadge(match.awayId)}</h2></div>
        <div class="live-head-right"><strong>${currentMinute}'</strong><span>Fase ${Math.max(1,currentMinute)} / ${totalPhases}</span><small>${nextBlock ? `Siguiente: ${nextBlock.label}` : 'Finalizado'}</small></div>
      </div>
      <div class="live-progress"><span style="width:${progress}%"></span></div>
      ${minuteRail(events)}
      <div class="live-v511-grid">
        <section class="live-left-stack">
          ${ownTacticalBoard()}
        </section>
        <section class="live-center-stack">
          <div class="card inner live-commentary-card ${ehtml(narration.tone || 'ambient')}">
            <p class="label">Relato en vivo</p>
            <h3>${ehtml(narration.title)}</h3>
            <div class="live-commentary-text">${ehtml(narration.text)}</div>
            <div class="live-commentary-sub">${ehtml(narration.sub || '')}</div>
          </div>
          ${possessionStrip()}
          <div class="live-stats-pair">
            ${liveStatsCard(homeTitle, match.homeId, hStats, 'home')}
            ${liveStatsCard(awayTitle, match.awayId, aStats, 'away')}
          </div>
          <div class="card inner live-events-card">
            <div class="live-card-head"><h3>Eventos</h3><span class="muted small">últimos arriba</span></div>
            <div class="live-events-list">${recentEvents.length ? recentEvents.map(ev => `<div class="live-event ${ehtml(ev.type)}"><span>${ev.minute}'</span><i>${eventIcon(ev.type)}</i>${liveBadge(ev.clubId)}<strong>${ehtml(ev.text)}</strong></div>`).join('') : '<p class="muted small">Todavía no hay eventos relevantes.</p>'}</div>
          </div>
          <div class="card inner compact-match-context live-context-compact">
            <div><span>Clima</span><strong>${ehtml(liveState.matchContext?.weather || '—')}</strong></div>
            <div><span>Campo</span><strong>${ehtml(liveState.matchContext?.pitch || '—')}</strong></div>
            <div><span>Hinchas</span><strong>${fmtNumber(liveState.matchContext?.homeFans || 0)}</strong></div>
            <div><span>Recaudación</span><strong class="ok">${typeof formatMoney === 'function' ? formatMoney(liveState.matchContext?.ticketRevenue || 0) : (liveState.matchContext?.ticketRevenue || 0)}</strong></div>
          </div>
        </section>
        <section class="live-right-stack">
          ${liveManagerPanel()}
          ${lineupCard(liveClubName(rivalClubId()), rivalClubId(), rivalLineup(), false)}
        </section>
      </div>
    </div>`;
    const root = document.querySelector('#liveMatchRoot');
    if(root) root.innerHTML = html;
    bindLiveControls();
  }
  function resetLiveSelections(){
    liveSelectedStarterId = 0;
    liveSelectedBenchId = 0;
  }
  function queueSubstitution(outId, inId){
    outId = Number(outId || 0);
    inId = Number(inId || 0);
    if(!outId || !inId || outId === inId) return;
    if(remainingSubstitutions() <= 0){ liveShowNotice('Ya no quedan cambios disponibles.', true); return; }
    if(pendingOutIds().has(outId) || pendingInIds().has(inId)){ liveShowNotice('Ese cambio ya está pendiente.', true); return; }
    const msg = `Confirmar sustitución\n\nEntra: ${eventPlayerLabel(inId, true)}\nSale: ${eventPlayerLabel(outId, true)}\n\nSe aplicará antes del próximo minuto.`;
    if(!liveConfirm(msg)) return;
    livePendingSubstitutions.push({ outId, inId });
    resetLiveSelections();
    liveShowNotice('Cambio confirmado para el próximo minuto.', false);
    renderLiveMatch();
  }
  function swapStarters(aId, bId){
    aId = Number(aId || 0);
    bId = Number(bId || 0);
    if(!aId || !bId || aId === bId) return;
    const lineup = currentOwnLineup();
    const order = lineup.map(p => Number(p.id));
    const a = order.indexOf(aId);
    const b = order.indexOf(bId);
    if(a < 0 || b < 0) return;
    const msg = `Reacomodar roles\n\n${eventPlayerLabel(aId, true)} cambia su rol con ${eventPlayerLabel(bId, true)}.`;
    if(!liveConfirm(msg)) return;
    [order[a], order[b]] = [order[b], order[a]];
    const ok = window.Simulator20?.applyLiveFormation?.(liveSession, ownClubId(), ownFormation(), order);
    if(!ok){ liveShowNotice('No se pudo reacomodar la formación.', true); return; }
    liveState = window.Simulator20.livePublicState(liveSession);
    resetLiveSelections();
    liveShowNotice('Jugadores reacomodados.', false);
    renderLiveMatch();
  }
  function simulateNextBlockFromUi(){
    if(!liveSession || liveState?.finished) return;
    const substitutions = livePendingSubstitutions.slice();
    const result = window.Simulator20.simulateLiveBlock(liveSession, { instruction:liveSelectedInstruction, substitutions });
    if(result?.played){
      liveState = window.Simulator20.livePublicState(liveSession);
      liveState.finished = true;
    }else{
      liveState = result || window.Simulator20.livePublicState(liveSession);
    }
    if(substitutions.length) livePendingSubstitutions = [];
    resetLiveSelections();
    renderLiveMatch();
  }
  function bindLiveControls(){
    document.querySelectorAll('[data-live-instruction]').forEach(btn => btn.addEventListener('click', () => {
      liveSelectedInstruction = btn.getAttribute('data-live-instruction') || 'none';
      renderLiveMatch();
    }));
    document.querySelector('#liveFormationSelect')?.addEventListener('change', (ev) => {
      const value = ev.target.value;
      if(!value || value === ownFormation()) return;
      if(!liveConfirm(`Cambiar formación a ${value}.\n\nEl cuerpo técnico reacomodará automáticamente a los titulares para reducir penalizaciones por rol.`)){
        ev.target.value = ownFormation();
        return;
      }
      const ok = window.Simulator20?.applyLiveFormation?.(liveSession, ownClubId(), value);
      if(!ok){ liveShowNotice('No se pudo cambiar la formación.', true); return; }
      liveState = window.Simulator20.livePublicState(liveSession);
      resetLiveSelections();
      liveShowNotice(`Formación cambiada a ${value}.`, false);
      renderLiveMatch();
    });
    document.querySelectorAll('[data-live-starter-id]').forEach(btn => btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-live-starter-id') || 0);
      if(!id || liveState?.finished) return;
      if(liveSelectedBenchId){ queueSubstitution(id, liveSelectedBenchId); return; }
      if(liveSelectedStarterId && liveSelectedStarterId !== id){ swapStarters(liveSelectedStarterId, id); return; }
      liveSelectedStarterId = liveSelectedStarterId === id ? 0 : id;
      liveSelectedBenchId = 0;
      renderLiveMatch();
    }));
    document.querySelectorAll('[data-live-bench-id]').forEach(btn => btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-live-bench-id') || 0);
      if(!id || liveState?.finished) return;
      if(remainingSubstitutions() <= 0){ liveShowNotice('Ya no quedan cambios disponibles.', true); return; }
      if(liveSelectedStarterId){ queueSubstitution(liveSelectedStarterId, id); return; }
      liveSelectedBenchId = liveSelectedBenchId === id ? 0 : id;
      liveSelectedStarterId = 0;
      renderLiveMatch();
    }));
    document.querySelectorAll('[data-live-remove-pending-sub]').forEach(btn => btn.addEventListener('click', () => {
      const index = Number(btn.getAttribute('data-live-remove-pending-sub') || -1);
      if(index >= 0) livePendingSubstitutions.splice(index, 1);
      resetLiveSelections();
      renderLiveMatch();
    }));
    document.querySelector('#liveNextBlockBtn')?.addEventListener('click', () => {
      livePaused = true;
      clearTimeout(liveAutoTimer);
      simulateNextBlockFromUi();
    });
    document.querySelector('#livePauseBtn')?.addEventListener('click', () => {
      livePaused = !livePaused;
      if(!livePaused) runAutoMode();
      renderLiveMatch();
    });
    document.querySelector('#liveFinishBtn')?.addEventListener('click', () => {
      if(!liveSession?.result) return;
      window.__liveMatchCloseLocked = false;
      const result = liveSession.result;
      closeModal();
      if(typeof liveOptions?.onComplete === 'function') liveOptions.onComplete(result);
      liveSession = null;
      liveOptions = null;
      liveState = null;
      livePaused = true;
      liveSelectedInstruction = 'none';
      livePendingSubstitutions = [];
      resetLiveSelections();
      clearTimeout(liveAutoTimer);
    });
  }
  function runAutoMode(){
    clearTimeout(liveAutoTimer);
    if(livePaused || !liveSession || liveState?.finished) return;
    liveAutoTimer = setTimeout(() => {
      simulateNextBlockFromUi();
      runAutoMode();
    }, 420);
  }
  function start(match, options={}){
    if(!match || !window.Simulator20?.createLiveMatchSession) return false;
    clearTimeout(liveAutoTimer);
    liveOptions = options || {};
    livePaused = true;
    liveSelectedInstruction = 'none';
    livePendingSubstitutions = [];
    resetLiveSelections();
    liveSession = window.Simulator20.createLiveMatchSession(match);
    liveState = window.Simulator20.livePublicState(liveSession);
    window.__liveMatchCloseLocked = false;
    openModal('<div id="liveMatchRoot"></div>');
    window.__liveMatchCloseLocked = true;
    renderLiveMatch();
    liveShowNotice('Partido propio abierto en simulación viva. El resultado todavía no está decidido.', false);
    return true;
  }
  window.LiveMatchUI = { start };
  window.__LIVE_MATCH_UI_READY = true;
})();
