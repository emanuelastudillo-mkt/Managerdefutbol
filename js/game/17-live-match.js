/* V5.10 · Simulación viva minuto a minuto con estadísticas y relato en vivo. */
(function(){
  let liveSession = null;
  let liveOptions = null;
  let liveState = null;
  let livePaused = true;
  let liveAutoTimer = null;
  let liveSelectedInstruction = 'hold_result';

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
  function instructionOptions(){
    return (window.LIVE_MANAGER_INSTRUCTIONS || []).map(opt => `<option value="${ehtml(opt.value)}" ${opt.value === liveSelectedInstruction ? 'selected' : ''}>${ehtml(opt.label)}</option>`).join('');
  }
  function eventPlayerLabel(id, full=false){
    const player = typeof playerById === 'function' ? playerById(id) : null;
    const name = player?.name || player?.nombre || 'Jugador';
    return full ? name : lastName(name);
  }
  function playerLabelWithClub(id, clubId){ return `${eventPlayerLabel(id, false)} ${liveBadge(clubId)}`; }
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
  function eventIcon(type){
    return ({ goal:'⚽', yellow:'🟨', red:'🟥', injury:'✚', sub:'⇄', save:'🧤', error:'⚠️' })[type] || '•';
  }
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
  function applyTemplateSafe(text, data){
    return String(text || '').replace(/\{([a-zA-Z_]+)\}/g, (_, key) => String(data?.[key] ?? ''));
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
    const currentMinute = Number(liveState.minute || 0);
    const totalPhases = Number(liveState.totalPhases || 90);
    const progress = Math.max(0, Math.min(100, Math.round((currentMinute / 90) * 100)));
    const nextBlock = liveState.nextBlock;
    const events = liveEvents();
    const narration = liveNarration(events);
    const recentEvents = events.slice().reverse().slice(0, 12);
    const instructionHelp = (window.LIVE_MANAGER_INSTRUCTIONS || []).map(opt => `<div><strong>${ehtml(opt.label)}</strong><span>${ehtml(opt.desc || '')}</span></div>`).join('');
    const hStats = liveState.matchStats?.home || {};
    const aStats = liveState.matchStats?.away || {};
    const html = `<div class="live-match-shell">
      <div class="match-modal-head live-match-head">
        <div class="live-head-left"><p class="label">${match.friendly ? 'Simulación viva · Amistoso' : 'Simulación viva · Fecha'} ${ehtml(match.matchday || '—')} · ${ehtml(match.date || '')}</p><h2>${liveBadge(match.homeId)} ${ehtml(homeTitle)} <span class="live-score">${Number(liveState.homeGoals || 0)} - ${Number(liveState.awayGoals || 0)}</span> ${ehtml(awayTitle)} ${liveBadge(match.awayId)}</h2></div>
        <div class="live-head-right"><strong>${currentMinute}'</strong><span>Fase ${Math.max(1,currentMinute)} / ${totalPhases}</span><small>${nextBlock ? `Siguiente: ${nextBlock.label}` : 'Finalizado'}</small></div>
      </div>
      <div class="live-progress"><span style="width:${progress}%"></span></div>
      ${minuteRail(events)}
      <div class="live-wide-grid">
        <section class="live-lineups-stack">
          ${lineupCard(homeTitle, match.homeId, liveState.homeLineup || [], Number(match.homeId) === ownClubId())}
          ${lineupCard(awayTitle, match.awayId, liveState.awayLineup || [], Number(match.awayId) === ownClubId())}
        </section>
        <section class="live-center-stack">
          <div class="card inner live-commentary-card ${ehtml(narration.tone || 'ambient')}">
            <p class="label">Relato en vivo</p>
            <h3>${ehtml(narration.title)}</h3>
            <div class="live-commentary-text">${ehtml(narration.text)}</div>
            <div class="live-commentary-sub">${ehtml(narration.sub || '')}</div>
          </div>
          ${possessionStrip()}
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
          <div class="live-stats-pair">
            ${liveStatsCard(homeTitle, match.homeId, hStats, 'home')}
            ${liveStatsCard(awayTitle, match.awayId, aStats, 'away')}
          </div>
          <div class="card inner live-manager-panel">
            <div class="live-card-head"><h3>Manager</h3><span class="pill">${livePaused ? 'Pausado' : 'Auto'}</span></div>
            <select id="liveInstructionSelect">${instructionOptions()}</select>
            <div class="live-instruction-help">${instructionHelp}</div>
            <p class="muted small">Cambios: ${Number(liveState.usedSubs || 0)} / ${Number(liveState.maxSubs || 3)}. Se aplican antes del próximo minuto.</p>
            <div id="liveSubstitutionRows">${substitutionRows()}</div>
            <div class="live-action-row">
              <button id="livePauseBtn" class="ghost">${livePaused ? 'Auto' : 'Pausar'}</button>
              <button id="liveNextBlockBtn" class="primary" ${liveState.finished ? 'disabled' : ''}>Simular 1 minuto</button>
              <button id="liveFinishBtn" class="primary" ${liveState.finished ? '' : 'disabled'}>Cerrar y guardar</button>
            </div>
          </div>
        </section>
      </div>
    </div>`;
    const root = document.querySelector('#liveMatchRoot');
    if(root) root.innerHTML = html;
    bindLiveControls();
  }
  function collectSubstitutions(){
    const rows = [...document.querySelectorAll('.live-sub-row')];
    const seenOut = new Set();
    const seenIn = new Set();
    return rows.map(row => ({
      outId:Number(row.querySelector('[data-live-sub-out]')?.value || 0),
      inId:Number(row.querySelector('[data-live-sub-in]')?.value || 0)
    })).filter(item => {
      if(!item.outId || !item.inId || item.outId === item.inId) return false;
      if(seenOut.has(item.outId) || seenIn.has(item.inId)) return false;
      seenOut.add(item.outId); seenIn.add(item.inId);
      return true;
    });
  }
  function simulateNextBlockFromUi(){
    if(!liveSession || liveState?.finished) return;
    liveSelectedInstruction = document.querySelector('#liveInstructionSelect')?.value || liveSelectedInstruction || 'hold_result';
    const substitutions = collectSubstitutions();
    const result = window.Simulator20.simulateLiveBlock(liveSession, { instruction:liveSelectedInstruction, substitutions });
    if(result?.played){
      liveState = window.Simulator20.livePublicState(liveSession);
      liveState.finished = true;
    }else{
      liveState = result || window.Simulator20.livePublicState(liveSession);
    }
    renderLiveMatch();
  }
  function bindLiveControls(){
    const instruction = document.querySelector('#liveInstructionSelect');
    instruction?.addEventListener('change', () => { liveSelectedInstruction = instruction.value || 'hold_result'; });
    document.querySelector('#liveNextBlockBtn')?.addEventListener('click', () => {
      livePaused = true;
      clearTimeout(liveAutoTimer);
      simulateNextBlockFromUi();
    });
    document.querySelector('#livePauseBtn')?.addEventListener('click', () => {
      liveSelectedInstruction = document.querySelector('#liveInstructionSelect')?.value || liveSelectedInstruction || 'hold_result';
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
    liveSelectedInstruction = 'hold_result';
    liveSession = window.Simulator20.createLiveMatchSession(match);
    liveState = window.Simulator20.livePublicState(liveSession);
    window.__liveMatchCloseLocked = false;
    openModal('<div id="liveMatchRoot"></div>');
    window.__liveMatchCloseLocked = true;
    renderLiveMatch();
    showNotice('Partido propio abierto en simulación viva minuto a minuto. El resultado todavía no está decidido.', false);
    return true;
  }
  window.LiveMatchUI = { start };
  window.__LIVE_MATCH_UI_READY = true;
})();
