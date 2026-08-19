(() => {
  const TOTAL_PHASES = 360;
  const PHASE_SECONDS = 15; // 360 fases x 15s = 90 minutos

  const $ = (id) => document.getElementById(id);
  const pitch = $('pitch');
  const ballEl = $('ball');
  const offsideLine = $('offsideLine');

  const state = {
    phase: 0,
    running: false,
    timer: null,
    possession: 'home',
    possessorId: 'H9',
    homePossTicks: 0,
    awayPossTicks: 0,
    sequenceStep: 0,
    playType: 'kickoff',
    halftimeDone: false,
    homeScore: 0,
    awayScore: 0,
    stats: {
      home: { shots: 0, onTarget: 0, passes: 0, recoveries: 0 },
      away: { shots: 0, onTarget: 0, passes: 0, recoveries: 0 }
    }
  };

  const teams = {
    home: [
      {id:'H1', n:'1', role:'POR', x:6, y:50},
      {id:'H2', n:'2', role:'DFD', x:20, y:19},
      {id:'H3', n:'3', role:'DFC', x:18, y:38},
      {id:'H4', n:'4', role:'DFC', x:18, y:62},
      {id:'H5', n:'5', role:'DFI', x:20, y:81},
      {id:'H6', n:'6', role:'MDC', x:35, y:50},
      {id:'H7', n:'7', role:'MD', x:44, y:21},
      {id:'H8', n:'8', role:'MC', x:45, y:50},
      {id:'H10',n:'10',role:'MI', x:44, y:79},
      {id:'H9', n:'9', role:'DC', x:58, y:40},
      {id:'H11',n:'11',role:'DC', x:58, y:61}
    ],
    away: [
      {id:'A1', n:'1', role:'POR', x:94, y:50},
      {id:'A2', n:'2', role:'DFI', x:80, y:19},
      {id:'A3', n:'3', role:'DFC', x:82, y:38},
      {id:'A4', n:'4', role:'DFC', x:82, y:62},
      {id:'A5', n:'5', role:'DFD', x:80, y:81},
      {id:'A6', n:'6', role:'MDC', x:65, y:50},
      {id:'A7', n:'7', role:'MI', x:56, y:21},
      {id:'A8', n:'8', role:'MC', x:55, y:50},
      {id:'A10',n:'10',role:'MD', x:56, y:79},
      {id:'A9', n:'9', role:'DC', x:42, y:40},
      {id:'A11',n:'11',role:'DC', x:42, y:61}
    ]
  };

  const initialPositions = JSON.parse(JSON.stringify(teams));
  const allPlayers = () => [...teams.home, ...teams.away];

  function makePlayers() {
    pitch.querySelectorAll('.player').forEach(el => el.remove());
    for (const side of ['home','away']) {
      for (const p of teams[side]) {
        const el = document.createElement('div');
        el.className = `player ${side}`;
        el.id = p.id;
        el.textContent = p.n;
        el.title = `${p.role} #${p.n}`;
        pitch.appendChild(el);
      }
    }
    renderPlayers(true);
  }

  function renderPlayers(immediate=false) {
    allPlayers().forEach(p => {
      const el = $(p.id);
      if (!el) return;
      if (immediate) el.style.transition = 'none';
      el.style.left = `${p.x}%`;
      el.style.top = `${p.y}%`;
      el.classList.toggle('active', p.id === state.possessorId);
      if (immediate) requestAnimationFrame(() => el.style.transition = '');
    });
    const poss = getPlayer(state.possessorId);
    if (poss) moveBall(poss.x, poss.y, immediate);
    renderOffsideLine();
  }

  function moveBall(x,y, immediate=false) {
    if (immediate) ballEl.style.transition='none';
    ballEl.style.left = `${x}%`;
    ballEl.style.top = `${y}%`;
    if (immediate) requestAnimationFrame(() => ballEl.style.transition='');
  }

  function getPlayer(id) { return allPlayers().find(p => p.id === id); }
  function sidePlayers(side) { return teams[side]; }
  function otherSide(side) { return side === 'home' ? 'away' : 'home'; }
  function rand(min,max) { return Math.random()*(max-min)+min; }
  function choose(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
  function clamp(v,min,max) { return Math.max(min,Math.min(max,v)); }

  function gameMinuteText() {
    const secs = Math.min(state.phase * PHASE_SECONDS, 90*60);
    const m = Math.floor(secs/60);
    const s = secs%60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function log(text, kind='') {
    const node = document.createElement('div');
    node.className = `comment ${kind}`;
    node.innerHTML = `<span class="time">${gameMinuteText()}</span>${text}`;
    $('commentary').prepend(node);
  }

  function updateUI() {
    $('clock').textContent = gameMinuteText();
    $('phaseLabel').textContent = `Fase ${state.phase} / ${TOTAL_PHASES}`;
    $('homeScore').textContent = state.homeScore;
    $('awayScore').textContent = state.awayScore;
    const total = Math.max(1,state.homePossTicks + state.awayPossTicks);
    const homePct = Math.round(state.homePossTicks/total*100);
    $('possessionFill').style.width = `${homePct}%`;
    $('possessionText').textContent = `${homePct}% - ${100-homePct}%`;
    for (const side of ['home','away']) {
      const pfx = side === 'home' ? 'home' : 'away';
      $(pfx+'Shots').textContent = state.stats[side].shots;
      $(pfx+'OnTarget').textContent = state.stats[side].onTarget;
      $(pfx+'Passes').textContent = state.stats[side].passes;
      $(pfx+'Recoveries').textContent = state.stats[side].recoveries;
    }
  }

  function renderOffsideLine() {
    const defending = otherSide(state.possession);
    const defenders = sidePlayers(defending).filter(p => p.role !== 'POR');
    let line;
    if (state.possession === 'home') {
      const xs = defenders.map(p=>p.x).sort((a,b)=>b-a);
      line = xs[1] ?? 78;
    } else {
      const xs = defenders.map(p=>p.x).sort((a,b)=>a-b);
      line = xs[1] ?? 22;
    }
    offsideLine.style.left = `${line}%`;
  }

  function styleFor(side) { return $(side === 'home' ? 'homeStyle' : 'awayStyle').value; }

  function attackingDirection(side) { return side === 'home' ? 1 : -1; }

  function progressValue(side, x) { return side === 'home' ? x : 100-x; }

  function nearbyTeammates(side, player, maxDist=28) {
    return sidePlayers(side).filter(p => p.id !== player.id && Math.hypot(p.x-player.x,(p.y-player.y)*.65) <= maxDist);
  }

  function advanceBlocks(side, amount) {
    const dir = attackingDirection(side);
    const defending = otherSide(side);
    sidePlayers(side).forEach(p => {
      if (p.role === 'POR') return;
      const roleFactor = p.role.startsWith('DF') ? .45 : p.role.includes('M') ? .75 : 1;
      p.x = clamp(p.x + dir*amount*roleFactor, 8, 92);
      p.y = clamp(p.y + rand(-1.7,1.7), 8, 92);
    });
    sidePlayers(defending).forEach(p => {
      if (p.role === 'POR') return;
      const retreatFactor = p.role.startsWith('DF') ? .7 : p.role.includes('M') ? .48 : .3;
      p.x = clamp(p.x + dir*amount*retreatFactor, 8, 92);
      p.y = clamp(p.y + rand(-1.2,1.2), 8, 92);
    });
    enforceOffside(side);
  }

  function enforceOffside(attackingSide) {
    const defending = otherSide(attackingSide);
    const defenders = sidePlayers(defending).filter(p=>p.role!=='POR');
    if (attackingSide === 'home') {
      const line = defenders.map(p=>p.x).sort((a,b)=>b-a)[1] ?? 80;
      sidePlayers(attackingSide).filter(p=>p.role==='DC').forEach(p => p.x = Math.min(p.x,line-1.5));
    } else {
      const line = defenders.map(p=>p.x).sort((a,b)=>a-b)[1] ?? 20;
      sidePlayers(attackingSide).filter(p=>p.role==='DC').forEach(p => p.x = Math.max(p.x,line+1.5));
    }
  }

  function choosePassTarget(side, passer, style) {
    let candidates = sidePlayers(side).filter(p=>p.id!==passer.id && p.role!=='POR');
    const dir = attackingDirection(side);
    const currentProg = progressValue(side, passer.x);

    if (style === 'possession') {
      const near = nearbyTeammates(side, passer, 25);
      if (near.length) candidates = near;
      candidates.sort((a,b)=>Math.abs(progressValue(side,a.x)-currentProg)-Math.abs(progressValue(side,b.x)-currentProg));
      return choose(candidates.slice(0,Math.min(5,candidates.length)));
    }
    if (style === 'direct') {
      const forward = candidates.filter(p => (p.x-passer.x)*dir > 5);
      return choose((forward.length ? forward : candidates).sort((a,b)=>progressValue(side,b.x)-progressValue(side,a.x)).slice(0,5));
    }
    if (style === 'counter') {
      const runners = candidates.filter(p=>['DC','MD','MI'].includes(p.role) || p.role.startsWith('E'));
      return choose((runners.length?runners:candidates).sort((a,b)=>progressValue(side,b.x)-progressValue(side,a.x)).slice(0,4));
    }
    return choose(candidates.sort((a,b)=>progressValue(side,b.x)-progressValue(side,a.x)).slice(0,3));
  }

  function actionPass(side, passer, style) {
    const target = choosePassTarget(side, passer, style);
    if (!target) return actionTurnover(side, passer, 'se queda sin opciones');
    const dist = Math.hypot(target.x-passer.x,(target.y-passer.y)*.7);
    const isLong = style === 'longball' || dist > 28 || (style==='direct' && Math.random()<.38);
    const baseSuccess = isLong ? .68 : .84;
    const pressurePenalty = progressValue(side, passer.x)>70 ? .08 : 0;
    const styleBonus = style==='possession' && !isLong ? .06 : 0;
    state.stats[side].passes++;
    advanceBlocks(side, isLong ? rand(4,7) : rand(1.5,4));
    moveBall(target.x,target.y);
    if (Math.random() < baseSuccess + styleBonus - pressurePenalty) {
      state.possessorId = target.id;
      state.sequenceStep++;
      $('playState').textContent = isLong ? 'Pase largo' : 'Circulación';
      $('playMeta').textContent = `${side==='home'?'Local':'Visitante'} · ${styleLabel(style)}`;
      log(`${passer.n} encuentra a ${target.n} con ${isLong?'un pase largo':'un pase corto'}.`);
      setTimeout(()=>renderPlayers(), 40);
      return;
    }
    const interceptor = nearestOpponentTo(side,target.x,target.y);
    if (interceptor) {
      state.possession = otherSide(side);
      state.possessorId = interceptor.id;
      state.stats[state.possession].recoveries++;
      state.sequenceStep = 0;
      $('playState').textContent = 'Intercepción';
      $('playMeta').textContent = `${state.possession==='home'?'Local':'Visitante'} recupera y continúa desde esa zona`;
      log(`${target.n} no llega: ${interceptor.n} intercepta y cambia la posesión.`, 'major');
      setTimeout(()=>renderPlayers(), 40);
    }
  }

  function nearestOpponentTo(side,x,y) {
    return sidePlayers(otherSide(side)).filter(p=>p.role!=='POR').sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];
  }

  function actionDribble(side, p) {
    const dir = attackingDirection(side);
    const forward = rand(3,8);
    const oldX = p.x;
    p.x = clamp(p.x + dir*forward, 4, 96);
    p.y = clamp(p.y + rand(-6,6), 8, 92);
    advanceBlocks(side, rand(1,3));
    const success = .64 - (progressValue(side,p.x)>78 ? .07 : 0);
    if (Math.random() < success) {
      state.sequenceStep++;
      $('playState').textContent = 'Conducción / regate';
      $('playMeta').textContent = `${p.n} rompe una línea`;
      log(`${p.n} conduce desde ${Math.round(oldX)} hasta ${Math.round(p.x)} y supera la presión.`);
      renderPlayers();
    } else {
      actionTurnover(side,p,'pierde el duelo individual');
    }
  }

  function actionShot(side,p) {
    state.stats[side].shots++;
    const goalX = side==='home'?99:1;
    const shotY = rand(43,57);
    moveBall(goalX,shotY);
    $('playState').textContent = 'REMATE';
    $('playMeta').textContent = `${p.n} finaliza la jugada`;
    log(`${p.n} remata al arco.`, 'major');

    const distance = side==='home' ? 100-p.x : p.x;
    const onTargetChance = clamp(.74 - distance*.008, .32, .72);
    const onTarget = Math.random() < onTargetChance;
    if (onTarget) state.stats[side].onTarget++;

    setTimeout(()=>{
      if (!onTarget) {
        log('La pelota se va afuera. Saque de arco.');
        restartFromKeeper(otherSide(side));
        return;
      }
      const goalChance = clamp(.34 - distance*.004, .10, .32);
      if (Math.random() < goalChance) {
        if (side==='home') state.homeScore++; else state.awayScore++;
        updateUI();
        log(`¡GOL DEL ${side==='home'?'LOCAL':'VISITANTE'}!`, 'goal-msg');
        resetForKickoff(otherSide(side));
      } else {
        log('El arquero contiene y la jugada continúa desde sus manos.', 'major');
        restartFromKeeper(otherSide(side));
      }
    }, 220);
  }

  function restartFromKeeper(side) {
    state.possession = side;
    const keeper = sidePlayers(side).find(p=>p.role==='POR');
    state.possessorId = keeper.id;
    state.sequenceStep = 0;
    moveBall(keeper.x,keeper.y);
    renderPlayers();
  }

  function actionTurnover(side,p,reason) {
    const opponent = nearestOpponentTo(side,p.x,p.y);
    if (!opponent) return;
    state.possession = otherSide(side);
    state.possessorId = opponent.id;
    state.stats[state.possession].recoveries++;
    state.sequenceStep = 0;
    $('playState').textContent = 'Cambio de posesión';
    $('playMeta').textContent = 'La nueva jugada nace exactamente donde terminó la anterior';
    log(`${p.n} ${reason}. ${opponent.n} recupera.`, 'major');
    renderPlayers();
  }

  function chooseAction(side,p,style) {
    const prog = progressValue(side,p.x);
    const isForward = p.role==='DC' || p.role==='MD' || p.role==='MI' || p.role.startsWith('E');
    const roll = Math.random();

    if (prog > 78 && isForward) {
      if (roll < .48) return 'shot';
      if (roll < .72) return 'dribble';
      return 'pass';
    }
    if (prog > 67) {
      if (roll < (isForward?.25:.12)) return 'shot';
      if (roll < (isForward?.48:.25)) return 'dribble';
      return 'pass';
    }
    if (style==='counter' && state.sequenceStep < 2 && roll < .42) return 'dribble';
    if (style==='longball' && roll < .68) return 'pass';
    if (style==='possession') return roll < .88 ? 'pass' : 'dribble';
    return roll < .72 ? 'pass' : 'dribble';
  }

  function simulatePhase() {
    if (!state.running) return;
    if (state.phase >= TOTAL_PHASES) return endMatch();

    state.phase++;
    if (state.possession==='home') state.homePossTicks++; else state.awayPossTicks++;

    if (state.phase === 180 && !state.halftimeDone) {
      state.halftimeDone = true;
      halftime();
      updateUI();
      return;
    }

    const side = state.possession;
    const p = getPlayer(state.possessorId);
    if (!p) return;
    const style = styleFor(side);
    const action = chooseAction(side,p,style);

    if (action==='pass') actionPass(side,p,style);
    else if (action==='dribble') actionDribble(side,p);
    else actionShot(side,p);

    updateUI();
  }

  function styleLabel(style) {
    return ({possession:'Posesión', direct:'Directo', counter:'Contraataque', longball:'Pelotazo'})[style];
  }

  function resetForKickoff(side='home') {
    restoreBaseShape();
    state.possession = side;
    state.possessorId = side==='home'?'H9':'A9';
    state.sequenceStep=0;
    $('playState').textContent='Saque del medio';
    $('playMeta').textContent=`Reanuda ${side==='home'?'el local':'el visitante'}`;
    renderPlayers();
  }

  function restoreBaseShape() {
    for (const side of ['home','away']) {
      teams[side].forEach((p,i)=>{
        p.x=initialPositions[side][i].x;
        p.y=initialPositions[side][i].y;
      });
    }
  }

  function halftime() {
    state.running=false;
    clearInterval(state.timer);
    const overlay=document.createElement('div');
    overlay.className='halftime-overlay';
    overlay.innerHTML='<div>ENTRETIEMPO</div><small>Los jugadores se retiran y vuelven a sus posiciones</small>';
    pitch.appendChild(overlay);
    log('Final del primer tiempo. Los jugadores se retiran del campo.', 'major');

    allPlayers().forEach((p,i)=>{
      p.x = 49 + (i%2?2:-2);
      p.y = 101 + (i%5)*2;
    });
    renderPlayers();

    setTimeout(()=>{
      restoreBaseShape();
      resetForKickoff('away');
      renderPlayers();
      overlay.remove();
      log('Comienza el segundo tiempo.', 'major');
      state.running=true;
      startLoop();
    }, Math.max(900, Number($('speed').value)*2.2));
  }

  function endMatch() {
    state.running=false;
    clearInterval(state.timer);
    $('playState').textContent='Final del partido';
    $('playMeta').textContent=`${state.homeScore} - ${state.awayScore}`;
    log(`FINAL: Local ${state.homeScore} - ${state.awayScore} Visitante.`, 'goal-msg');
  }

  function startLoop() {
    clearInterval(state.timer);
    state.timer=setInterval(simulatePhase, Number($('speed').value));
  }

  function startMatch() {
    if (state.phase>=TOTAL_PHASES) resetAll();
    if (state.running) return;
    state.running=true;
    if (state.phase===0) {
      log('Pita el árbitro. Comienza el partido.', 'major');
      $('playState').textContent='Inicio de la primera posesión';
      $('playMeta').textContent='Cada pérdida enlaza directamente con la jugada rival';
    }
    startLoop();
  }

  function pauseMatch() {
    state.running=false;
    clearInterval(state.timer);
    $('playState').textContent='Partido pausado';
  }

  function resetAll() {
    clearInterval(state.timer);
    state.phase=0;
    state.running=false;
    state.possession='home';
    state.possessorId='H9';
    state.homePossTicks=0;
    state.awayPossTicks=0;
    state.sequenceStep=0;
    state.halftimeDone=false;
    state.homeScore=0;
    state.awayScore=0;
    state.stats={home:{shots:0,onTarget:0,passes:0,recoveries:0},away:{shots:0,onTarget:0,passes:0,recoveries:0}};
    restoreBaseShape();
    $('commentary').innerHTML='';
    $('playState').textContent='Esperando inicio';
    $('playMeta').textContent='—';
    updateUI();
    renderPlayers(true);
  }

  $('startBtn').addEventListener('click', startMatch);
  $('pauseBtn').addEventListener('click', pauseMatch);
  $('resetBtn').addEventListener('click', resetAll);
  $('speed').addEventListener('change', ()=>{ if(state.running) startLoop(); });

  makePlayers();
  resetAll();
})();
