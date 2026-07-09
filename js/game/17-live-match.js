/* V5.07 · Simulación viva por bloques con intervención del manager. */
(function(){
  let liveSession = null;
  let liveOptions = null;
  let liveState = null;
  let livePaused = true;
  let liveAutoTimer = null;

  function ehtml(value){
    return typeof escapeHtml === 'function' ? escapeHtml(value) : String(value ?? '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  }
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
  function instructionOptions(){
    return (window.LIVE_MANAGER_INSTRUCTIONS || []).map(opt => `<option value="${ehtml(opt.value)}">${ehtml(opt.label)}</option>`).join('');
  }
  function eventPlayerLabel(id){
    const player = typeof playerById === 'function' ? playerById(id) : null;
    return player ? lastName(player.name || player.nombre || 'Jugador') : 'Jugador';
  }
  function liveEvents(){
    const events = [];
    (liveState?.goals || []).forEach(g => events.push({ minute:Number(g.minute || 0), type:'goal', clubId:g.clubId, text:`Gol de ${eventPlayerLabel(g.playerId)}` }));
    (liveState?.cards || []).forEach(c => {
      const kind = c.type === 'yellow' ? 'Amarilla' : (c.type === 'secondYellowRed' ? 'Doble amarilla y roja' : 'Roja directa');
      events.push({ minute:Number(c.minute || 0), type:c.type === 'yellow' ? 'yellow' : 'red', clubId:c.clubId, text:`${kind}: ${eventPlayerLabel(c.playerId)}` });
    });
    (liveState?.injuries || []).forEach(i => events.push({ minute:Number(i.minute || 0), type:'injury', clubId:i.clubId, text:`Lesión de ${eventPlayerLabel(i.playerId)} · ${i.injuryLabel || i.name || 'Lesión'}` }));
    (liveState?.substitutions || []).forEach(s => events.push({ minute:Number(s.minute || 0), type:'sub', clubId:s.clubId, text:`Cambio: entra ${eventPlayerLabel(s.inId)}, sale ${eventPlayerLabel(s.outId)}` }));
    (liveState?.keySaves || []).forEach(k => events.push({ minute:Number(k.minute || 0), type:'save', clubId:k.clubId, text:`Tapada clave de ${eventPlayerLabel(k.playerId)}` }));
    (liveState?.errors || []).forEach(err => events.push({ minute:Number(err.minute || 0), type:'error', clubId:err.clubId, text:`Error de ${eventPlayerLabel(err.playerId)}` }));
    return events.sort((a,b)=>a.minute-b.minute || String(a.type).localeCompare(String(b.type)));
  }
  function playerMiniRow(player, isOwn=false){
    const condition = Math.round(Number(player.condition || 0));
    const morale = Math.round(Number(player.morale || 0));
    const condClass = condition >= 76 ? 'ok' : condition >= 55 ? 'warn' : 'bad';
    const moraleClass = morale >= 70 ? 'ok' : morale >= 45 ? 'warn' : 'bad';
    return `<div class="live-player-row ${isOwn ? 'own' : ''}">
      <span class="live-player-name">${ehtml(lastName(player.name))}</span>
      <span class="live-player-role">${ehtml(player.role || player.position || '—')}</span>
      <strong>${Math.round(Number(player.overall || 0))}</strong>
      <span class="live-meter ${condClass}">${condition}</span>
      <span class="live-meter ${moraleClass}">${morale}</span>
    </div>`;
  }
  function lineupCard(title, clubId, list, isOwn=false){
    return `<div class="card inner live-lineup-card">
      <div class="live-lineup-title"><span>${liveBadge(clubId)}</span><strong>${ehtml(title)}</strong></div>
      <div class="live-lineup-head"><span>Apellido</span><span>Rol</span><span>MED</span><span>Fís.</span><span>Moral</span></div>
      <div class="live-lineup-list">${(list || []).map(p => playerMiniRow(p, isOwn)).join('') || '<p class="muted small">Sin jugadores en cancha.</p>'}</div>
    </div>`;
  }
  function substitutionRows(){
    const ownLineup = currentOwnLineup();
    const bench = liveState?.ownBench || [];
    const remaining = Math.max(0, Number(liveState?.maxSubs || 3) - Number(liveState?.usedSubs || 0));
    if(liveState?.finished) return '<p class="muted small">Partido finalizado.</p>';
    if(remaining <= 0) return '<p class="muted small">Ya usaste los 3 cambios.</p>';
    const outOptions = '<option value="0">Sale...</option>' + ownLineup.map(p => `<option value="${p.id}">${ehtml(lastName(p.name))} · ${ehtml(p.role || p.position)} · ${Math.round(p.overall)}</option>`).join('');
    const inOptions = '<option value="0">Entra...</option>' + bench.map(p => `<option value="${p.id}">${ehtml(lastName(p.name))} · ${ehtml(p.position)} · ${Math.round(p.overall)} · Fís ${Math.round(p.condition)}</option>`).join('');
    return Array.from({ length:remaining }, (_, i) => `<div class="live-sub-row">
      <select data-live-sub-out="${i}">${outOptions}</select>
      <select data-live-sub-in="${i}">${inOptions}</select>
    </div>`).join('');
  }
  function renderLiveMatch(){
    if(!liveState) return;
    const match = liveState.match || {};
    const homeTitle = liveClubName(match.homeId);
    const awayTitle = liveClubName(match.awayId);
    const progress = Math.max(0, Math.min(100, Math.round((Number(liveState.minute || 0) / 90) * 100)));
    const nextBlock = liveState.nextBlock;
    const events = liveEvents();
    const instructionHelp = (window.LIVE_MANAGER_INSTRUCTIONS || []).map(opt => `<div><strong>${ehtml(opt.label)}</strong><span>${ehtml(opt.desc || '')}</span></div>`).join('');
    const html = `<div class="live-match-shell">
      <div class="match-modal-head live-match-head">
        <p class="label">Simulación viva · Fecha ${ehtml(match.matchday || '—')} · ${ehtml(match.date || '')}</p>
        <h2>${liveBadge(match.homeId)} ${ehtml(homeTitle)} <span class="live-score">${Number(liveState.homeGoals || 0)} - ${Number(liveState.awayGoals || 0)}</span> ${ehtml(awayTitle)} ${liveBadge(match.awayId)}</h2>
        <p class="muted small">Minuto ${Number(liveState.minute || 0)}${nextBlock ? ` · próximo bloque ${nextBlock.label}` : ' · finalizado'}</p>
      </div>
      <div class="live-progress"><span style="width:${progress}%"></span></div>
      <div class="live-control-grid">
        <div class="card inner live-manager-panel">
          <h3>Instrucción para el siguiente bloque</h3>
          <select id="liveInstructionSelect">${instructionOptions()}</select>
          <div class="live-instruction-help">${instructionHelp}</div>
          <h3>Cambios disponibles</h3>
          <p class="muted small">Usados: ${Number(liveState.usedSubs || 0)} / ${Number(liveState.maxSubs || 3)}. Se aplican antes de simular el próximo bloque.</p>
          <div id="liveSubstitutionRows">${substitutionRows()}</div>
          <div class="live-action-row">
            <button id="livePauseBtn" class="ghost">${livePaused ? 'Continuar automático' : 'Pausar'}</button>
            <button id="liveNextBlockBtn" class="primary" ${liveState.finished ? 'disabled' : ''}>Simular siguiente bloque</button>
            <button id="liveFinishBtn" class="primary" ${liveState.finished ? '' : 'disabled'}>Cerrar y guardar resultado</button>
          </div>
        </div>
        <div class="card inner live-events-card">
          <h3>Relato del partido</h3>
          <div class="live-events-list">${events.length ? events.map(ev => `<div class="live-event ${ehtml(ev.type)}"><span>${ev.minute}'</span>${liveBadge(ev.clubId)}<strong>${ehtml(ev.text)}</strong></div>`).join('') : '<p class="muted small">Todavía no hay eventos relevantes.</p>'}</div>
          <h3>Instrucciones usadas</h3>
          <div class="live-instruction-log">${(liveState.instructionLog || []).length ? liveState.instructionLog.map(item => `<div><span>${Number(item.minute || 0)}'-${Number(item.to || 0)}'</span><strong>${ehtml(item.label || item.instruction)}</strong></div>`).join('') : '<p class="muted small">Sin bloques simulados todavía.</p>'}</div>
        </div>
      </div>
      <div class="live-lineups-grid">
        ${lineupCard(homeTitle, match.homeId, liveState.homeLineup || [], Number(match.homeId) === ownClubId())}
        ${lineupCard(awayTitle, match.awayId, liveState.awayLineup || [], Number(match.awayId) === ownClubId())}
      </div>
      <div class="card inner compact-match-context">
        <h3>Contexto</h3>
        <div class="grid cols-4">
          <div><p class="label">Clima</p><strong>${ehtml(liveState.matchContext?.weather || '—')}</strong></div>
          <div><p class="label">Campo</p><strong>${ehtml(liveState.matchContext?.pitch || '—')}</strong></div>
          <div><p class="label">Hinchas locales</p><strong>${new Intl.NumberFormat('es-AR').format(liveState.matchContext?.homeFans || 0)}</strong></div>
          <div><p class="label">Recaudación</p><strong class="ok">${typeof formatMoney === 'function' ? formatMoney(liveState.matchContext?.ticketRevenue || 0) : (liveState.matchContext?.ticketRevenue || 0)}</strong></div>
        </div>
      </div>
    </div>`;
    const root = document.querySelector('#liveMatchRoot');
    if(root) root.innerHTML = html;
    bindLiveControls();
  }
  function collectSubstitutions(){
    const rows = [...document.querySelectorAll('.live-sub-row')];
    return rows.map(row => ({
      outId:Number(row.querySelector('[data-live-sub-out]')?.value || 0),
      inId:Number(row.querySelector('[data-live-sub-in]')?.value || 0)
    })).filter(item => item.outId && item.inId && item.outId !== item.inId);
  }
  function simulateNextBlockFromUi(){
    if(!liveSession || liveState?.finished) return;
    const instruction = document.querySelector('#liveInstructionSelect')?.value || 'hold_result';
    const substitutions = collectSubstitutions();
    const result = window.Simulator20.simulateLiveBlock(liveSession, { instruction, substitutions });
    if(result?.played){
      liveState = window.Simulator20.livePublicState(liveSession);
      liveState.finished = true;
    }else{
      liveState = result || window.Simulator20.livePublicState(liveSession);
    }
    renderLiveMatch();
  }
  function bindLiveControls(){
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
    });
  }
  function runAutoMode(){
    clearTimeout(liveAutoTimer);
    if(livePaused || !liveSession || liveState?.finished) return;
    liveAutoTimer = setTimeout(() => {
      simulateNextBlockFromUi();
      runAutoMode();
    }, 1400);
  }
  function start(match, options={}){
    if(!match || !window.Simulator20?.createLiveMatchSession) return false;
    clearTimeout(liveAutoTimer);
    liveOptions = options || {};
    livePaused = true;
    liveSession = window.Simulator20.createLiveMatchSession(match);
    liveState = window.Simulator20.livePublicState(liveSession);
    window.__liveMatchCloseLocked = false;
    openModal('<div id="liveMatchRoot"></div>');
    window.__liveMatchCloseLocked = true;
    renderLiveMatch();
    showNotice('Partido propio abierto en simulación viva. El resultado todavía no está decidido.', false);
    return true;
  }
  window.LiveMatchUI = { start };
})();
