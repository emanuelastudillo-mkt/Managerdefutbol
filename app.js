const DATA_URL = 'data/seed.json';
const DB_NAME = 'futbol-manager-mvp';
const DB_STORE = 'saves';
const SAVE_KEY = 'main';

const FORMATIONS = {
  '4-4-2': ['POR','LD','DFC','DFC','LI','MC','MC','ED','EI','DC','DC'],
  '4-3-3': ['POR','LD','DFC','DFC','LI','MCD','MC','MCO','ED','EI','DC'],
  '4-2-3-1': ['POR','LD','DFC','DFC','LI','MCD','MCD','MCO','ED','EI','DC'],
  '3-5-2': ['POR','DFC','DFC','DFC','MCD','MC','MC','ED','EI','DC','DC'],
  '5-3-2': ['POR','LD','DFC','DFC','DFC','LI','MCD','MC','MCO','DC','DC'],
  '4-1-4-1': ['POR','LD','DFC','DFC','LI','MCD','MC','MC','ED','EI','DC'],
  '3-4-3': ['POR','DFC','DFC','DFC','MC','MC','ED','EI','DC','DC','MCO'],
  '4-5-1': ['POR','LD','DFC','DFC','LI','MCD','MC','MC','ED','EI','DC'],
  '4-3-1-2': ['POR','LD','DFC','DFC','LI','MCD','MC','MC','MCO','DC','DC'],
  '5-4-1': ['POR','LD','DFC','DFC','DFC','LI','MC','MC','ED','EI','DC']
};
const MENTALITIES = ['posicional','ataque','defensiva'];
const DEFAULT_TACTIC = { formation:'4-4-2', defense:'posicional', midfield:'posicional', attack:'posicional' };
let seed = null;
let game = null;
let activeTab = 'home';

const $ = (id) => document.getElementById(id);
const view = $('view');

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
function showNotice(text){
  const box = $('notice');
  box.textContent = text;
  box.classList.remove('hidden');
  clearTimeout(showNotice.timer);
  showNotice.timer = setTimeout(() => box.classList.add('hidden'), 4200);
}
function clubName(id){ return seed.clubs.find(c => c.id === id)?.name || '—'; }
function clubShort(id){ return seed.clubs.find(c => c.id === id)?.short || '—'; }
function clubColor(id){ return seed.clubs.find(c => c.id === id)?.primaryColor || '#94a3b8'; }
function playerById(id){ return seed.players.find(p => p.id === id); }
function playersByClub(clubId){ return seed.players.filter(p => p.clubId === clubId); }
function formatMoney(n){ return '$' + Math.round(n).toLocaleString('es-AR'); }
function avg(list){ return list.length ? list.reduce((a,b)=>a+b,0)/list.length : 0; }
function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
function rnd(min,max){ return Math.random() * (max-min) + min; }

function openDb(){
  return new Promise((resolve,reject)=>{
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(DB_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function saveLocal(){
  if(!game) return showNotice('No hay partida para guardar.');
  const db = await openDb();
  await new Promise((resolve,reject)=>{
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(game, SAVE_KEY);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  showNotice('Partida guardada en este navegador.');
}
async function loadLocal(silent=false){
  const db = await openDb();
  const saved = await new Promise((resolve,reject)=>{
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).get(SAVE_KEY);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  if(saved){
    game = saved;
    activeTab = 'home';
    renderAll();
    if(!silent) showNotice('Partida cargada.');
    return true;
  }
  if(!silent) showNotice('No hay partida guardada en este navegador.');
  return false;
}
async function resetLocal(){
  const db = await openDb();
  await new Promise((resolve,reject)=>{
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).delete(SAVE_KEY);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  game = null;
  activeTab = 'home';
  renderAll();
  showNotice('Partida local eliminada.');
}

async function init(){
  try{
    const res = await fetch(DATA_URL);
    if(!res.ok) throw new Error('No se pudo cargar data/seed.json');
    seed = await res.json();
    fillClubSelect();
    bindEvents();
    const loaded = await loadLocal(true);
    if(!loaded) renderAll();
  }catch(error){
    console.error(error);
    view.innerHTML = `<div class="empty"><h2>Error de carga</h2><p>${escapeHtml(error.message)}. Subí la carpeta completa a GitHub Pages o ejecutá el proyecto con un servidor local.</p></div>`;
  }
}
function fillClubSelect(){
  $('clubSelect').innerHTML = seed.clubs.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
}
function bindEvents(){
  $('btnNewGame').addEventListener('click', ()=> newGame(Number($('clubSelect').value)));
  $('btnSave').addEventListener('click', saveLocal);
  $('btnLoad').addEventListener('click', ()=>loadLocal(false));
  $('btnReset').addEventListener('click', resetLocal);
  document.querySelectorAll('.tabs button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      activeTab = btn.dataset.tab;
      renderAll();
    });
  });
}
function newGame(selectedClubId){
  game = {
    version:'1.0.0',
    selectedClubId,
    currentDate: seed.fixtures[0].date,
    matchdayIndex: 0,
    tactic: {...DEFAULT_TACTIC},
    standings: createInitialStandings(),
    playerStats: createInitialPlayerStats(),
    matchHistory: [],
    fixtures: structuredClone(seed.fixtures)
  };
  activeTab = 'home';
  renderAll();
  showNotice('Nueva partida creada.');
}
function createInitialStandings(){
  const obj = {};
  seed.clubs.forEach(c => obj[c.id] = { clubId:c.id, pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, dg:0, pts:0 });
  return obj;
}
function createInitialPlayerStats(){
  const obj = {};
  seed.players.forEach(p => obj[p.id] = { playerId:p.id, clubId:p.clubId, goals:0, assists:0, yellow:0, red:0, played:0 });
  return obj;
}

function renderAll(){
  document.querySelectorAll('.tabs button').forEach(btn=>btn.classList.toggle('active', btn.dataset.tab === activeTab));
  $('managerClub').textContent = game ? clubName(game.selectedClubId) : 'Sin partida';
  $('currentDate').textContent = game ? `Fecha: ${game.currentDate}` : 'Fecha: —';
  $('currentRound').textContent = game ? `Jornada: ${Math.min(game.matchdayIndex+1, seed.fixtures.length)} / ${seed.fixtures.length}` : 'Jornada: —';
  $('btnSave').disabled = !game;
  if(!game){
    view.innerHTML = $('emptyState').innerHTML;
    return;
  }
  const renderers = { home:renderHome, squad:renderSquad, tactics:renderTactics, fixture:renderFixture, standings:renderStandings, stats:renderStats };
  renderers[activeTab]();
}
function getNextMatchForSelected(){
  if(!game || game.matchdayIndex >= game.fixtures.length) return null;
  const round = game.fixtures[game.matchdayIndex];
  return round.matches.find(m => m.homeId === game.selectedClubId || m.awayId === game.selectedClubId);
}
function renderHome(){
  const next = getNextMatchForSelected();
  const clubPlayers = playersByClub(game.selectedClubId);
  const avgOverall = Math.round(avg(clubPlayers.map(p=>p.overall)));
  const position = sortedStandings().findIndex(s=>s.clubId===game.selectedClubId)+1;
  const lastMatches = game.matchHistory.filter(m=>m.homeId===game.selectedClubId || m.awayId===game.selectedClubId).slice(-5).reverse();
  view.innerHTML = `
    <div class="row section-title">
      <div>
        <h2>Panel principal</h2>
        <p class="tagline">MVP de temporada simple: 20 clubes, 600 jugadores, fixture de 19 jornadas, simulación local y estadísticas acumuladas.</p>
      </div>
      <button id="advanceBtn" class="primary" ${game.matchdayIndex >= game.fixtures.length ? 'disabled' : ''}>Avanzar fecha</button>
    </div>
    <div class="grid cols-4">
      <div class="card"><p class="label">Posición</p><div class="metric">${position || '—'}°</div></div>
      <div class="card"><p class="label">Media plantel</p><div class="metric">${avgOverall}</div></div>
      <div class="card"><p class="label">Jugadores</p><div class="metric">${clubPlayers.length}</div></div>
      <div class="card"><p class="label">Presupuesto</p><div class="metric small">${formatMoney(seed.clubs.find(c=>c.id===game.selectedClubId).budget)}</div></div>
    </div>
    <div class="split" style="margin-top:14px">
      <div class="card">
        <h3>Próximo partido</h3>
        ${next ? matchPreview(next) : '<p class="muted">Temporada finalizada.</p>'}
      </div>
      <div class="card">
        <h3>Últimos partidos</h3>
        <div class="timeline">${lastMatches.length ? lastMatches.map(compactMatch).join('') : '<p class="muted">Aún no hay partidos jugados.</p>'}</div>
      </div>
    </div>
  `;
  $('advanceBtn')?.addEventListener('click', simulateNextMatchday);
}
function matchPreview(match){
  return `<div class="next-match">
    <div><span class="club-dot" style="background:${clubColor(match.homeId)}"></span><div class="team-name">${escapeHtml(clubName(match.homeId))}</div></div>
    <div class="vs">VS<br><span class="small">${escapeHtml(match.date)}</span></div>
    <div><span class="club-dot" style="background:${clubColor(match.awayId)}"></span><div class="team-name">${escapeHtml(clubName(match.awayId))}</div></div>
  </div>`;
}
function compactMatch(m){
  const isHome = m.homeId === game.selectedClubId;
  const gf = isHome ? m.homeGoals : m.awayGoals;
  const gc = isHome ? m.awayGoals : m.homeGoals;
  const cls = gf > gc ? 'ok' : gf < gc ? 'bad' : 'warn';
  return `<div class="stat-rank"><span>${escapeHtml(clubShort(m.homeId))} ${m.homeGoals} - ${m.awayGoals} ${escapeHtml(clubShort(m.awayId))}</span><strong class="${cls}">${gf > gc ? 'G' : gf < gc ? 'P' : 'E'}</strong></div>`;
}
function renderSquad(){
  const players = playersByClub(game.selectedClubId).sort((a,b)=>b.overall-a.overall);
  const rows = players.map(p=>`
    <tr>
      <td><strong>${escapeHtml(p.name)}</strong></td><td><span class="pos">${p.position}</span></td><td>${p.age}</td><td>${p.nationality}</td><td><strong>${p.overall}</strong></td><td>${p.skills.potencial}</td><td>${formatMoney(p.value)}</td><td>${formatMoney(p.salary)}</td>
    </tr>`).join('');
  view.innerHTML = `
    <div class="section-title"><h2>Plantel</h2><p class="tagline">Los titulares se eligen automáticamente según formación, posición y media.</p></div>
    <div class="table-wrap"><table><thead><tr><th>Jugador</th><th>Pos</th><th>Edad</th><th>Nacionalidad</th><th>Media</th><th>Potencial</th><th>Valor</th><th>Salario</th></tr></thead><tbody>${rows}</tbody></table></div>
  `;
}
function renderTactics(){
  const formationOptions = Object.keys(FORMATIONS).map(f=>`<option value="${f}" ${game.tactic.formation===f?'selected':''}>${f}</option>`).join('');
  const mentalityOptions = (selected) => MENTALITIES.map(m=>`<option value="${m}" ${selected===m?'selected':''}>${m}</option>`).join('');
  const xi = selectLineup(game.selectedClubId, game.tactic);
  view.innerHTML = `
    <div class="section-title"><h2>Táctica</h2><p class="tagline">Las mentalidades modifican el peso ofensivo, defensivo y posicional del equipo durante la simulación.</p></div>
    <div class="split">
      <div class="card">
        <div class="form-grid">
          <div><label>Formación</label><select id="formation">${formationOptions}</select></div>
          <div><label>Defensa</label><select id="defenseMentality">${mentalityOptions(game.tactic.defense)}</select></div>
          <div><label>Mediocampo</label><select id="midfieldMentality">${mentalityOptions(game.tactic.midfield)}</select></div>
          <div><label>Ataque</label><select id="attackMentality">${mentalityOptions(game.tactic.attack)}</select></div>
        </div>
        <button id="saveTactic" class="primary">Guardar táctica</button>
      </div>
      <div class="card">
        <h3>Once estimado</h3>
        <div class="timeline">${xi.map((p,i)=>`<div class="stat-rank"><span><span class="rank-num">${i+1}</span>${escapeHtml(p.name)} <span class="pill">${p.position}</span></span><strong>${p.overall}</strong></div>`).join('')}</div>
      </div>
    </div>
  `;
  $('saveTactic').addEventListener('click',()=>{
    game.tactic = { formation:$('formation').value, defense:$('defenseMentality').value, midfield:$('midfieldMentality').value, attack:$('attackMentality').value };
    showNotice('Táctica actualizada.');
    renderAll();
  });
}
function renderFixture(){
  const html = game.fixtures.map(round=>`
    <div class="card">
      <div class="row"><h3>Jornada ${round.matchday}</h3><span class="pill">${round.date}</span></div>
      <div class="grid cols-2">${round.matches.map(matchCard).join('')}</div>
    </div>`).join('');
  view.innerHTML = `<div class="section-title"><h2>Calendario</h2></div><div class="stack">${html}</div>`;
}
function matchCard(m){
  const played = m.played;
  const events = game.matchHistory.find(x=>x.id===m.id);
  return `<div class="match-card">
    <div class="match-line">
      <div><span class="club-dot" style="background:${clubColor(m.homeId)}"></span>${escapeHtml(clubName(m.homeId))}</div>
      <strong class="score">${played ? `${m.homeGoals} - ${m.awayGoals}` : 'vs'}</strong>
      <div><span class="club-dot" style="background:${clubColor(m.awayId)}"></span>${escapeHtml(clubName(m.awayId))}</div>
    </div>
    ${events ? `<div class="events">${events.goals.slice(0,4).map(g=>`${g.minute}' ${escapeHtml(playerById(g.playerId)?.name || 'Jugador')}`).join(' · ')}${events.goals.length>4?' · ...':''}</div>` : ''}
  </div>`;
}
function renderStandings(){
  const rows = sortedStandings().map((s,i)=>`
    <tr>
      <td><strong>${i+1}</strong></td><td><span class="club-dot" style="background:${clubColor(s.clubId)}"></span><strong>${escapeHtml(clubName(s.clubId))}</strong></td><td>${s.pj}</td><td>${s.pg}</td><td>${s.pe}</td><td>${s.pp}</td><td>${s.gf}</td><td>${s.gc}</td><td>${s.dg}</td><td><strong>${s.pts}</strong></td>
    </tr>`).join('');
  view.innerHTML = `<div class="section-title"><h2>Tabla de posiciones</h2></div><div class="table-wrap"><table><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th><th>PTS</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function renderStats(){
  const stats = Object.values(game.playerStats);
  const scorers = stats.filter(s=>s.goals>0).sort((a,b)=>b.goals-a.goals).slice(0,20);
  const assists = stats.filter(s=>s.assists>0).sort((a,b)=>b.assists-a.assists).slice(0,20);
  const cards = stats.filter(s=>s.yellow>0 || s.red>0).sort((a,b)=>(b.red*3+b.yellow)-(a.red*3+a.yellow)).slice(0,20);
  view.innerHTML = `
    <div class="section-title"><h2>Estadísticas</h2></div>
    <div class="grid cols-3">
      <div class="card"><h3>Goleadores</h3>${rankList(scorers,'goals')}</div>
      <div class="card"><h3>Asistidores</h3>${rankList(assists,'assists')}</div>
      <div class="card"><h3>Tarjetas</h3>${cardList(cards)}</div>
    </div>
  `;
}
function rankList(list,key){
  if(!list.length) return '<p class="muted">Sin datos todavía.</p>';
  return list.map((s,i)=>{ const p=playerById(s.playerId); return `<div class="stat-rank"><span><span class="rank-num">${i+1}</span>${escapeHtml(p?.name||'Jugador')} <span class="pill">${escapeHtml(clubShort(s.clubId))}</span></span><strong>${s[key]}</strong></div>`; }).join('');
}
function cardList(list){
  if(!list.length) return '<p class="muted">Sin tarjetas todavía.</p>';
  return list.map((s,i)=>{ const p=playerById(s.playerId); return `<div class="stat-rank"><span><span class="rank-num">${i+1}</span>${escapeHtml(p?.name||'Jugador')} <span class="pill">${escapeHtml(clubShort(s.clubId))}</span></span><strong><span class="warn">${s.yellow}</span> / <span class="bad">${s.red}</span></strong></div>`; }).join('');
}
function sortedStandings(){
  if(!game) return [];
  return Object.values(game.standings).sort((a,b)=> b.pts-a.pts || b.dg-a.dg || b.gf-a.gf || clubName(a.clubId).localeCompare(clubName(b.clubId)) );
}

function selectLineup(clubId, tactic){
  const squad = playersByClub(clubId);
  const used = new Set();
  const slots = FORMATIONS[tactic.formation] || FORMATIONS['4-4-2'];
  const lineup = [];
  for(const slot of slots){
    const p = bestPlayerForSlot(squad, slot, used);
    if(p){ used.add(p.id); lineup.push(p); }
  }
  return lineup;
}
function bestPlayerForSlot(squad, slot, used){
  const compatibility = (p) => {
    if(p.position === slot) return 14;
    const groups = {
      POR:['POR'], DEF:['LD','LI','DFC'], MID:['MCD','MC','MCO','VOL'], WING:['ED','EI','EXT'], ATT:['DC']
    };
    const groupOf = pos => Object.keys(groups).find(k=>groups[k].includes(pos));
    return groupOf(p.position) === groupOf(slot) ? 5 : -8;
  };
  return squad.filter(p=>!used.has(p.id)).sort((a,b)=>(b.overall+compatibility(b))-(a.overall+compatibility(a)))[0];
}
function teamPower(clubId, tactic){
  const lineup = selectLineup(clubId, tactic);
  const defs = lineup.filter(p=>['LD','LI','DFC'].includes(p.position));
  const mids = lineup.filter(p=>['MCD','MC','MCO','VOL'].includes(p.position));
  const wings = lineup.filter(p=>['ED','EI','EXT'].includes(p.position));
  const atts = lineup.filter(p=>['DC'].includes(p.position));
  const gk = lineup.find(p=>p.position==='POR');
  let defense = avg(defs.map(p=> avg([p.skills.marca,p.skills.entradas,p.skills.posicionamiento,p.skills.fuerza])));
  let midfield = avg(mids.concat(wings).map(p=> avg([p.skills.paseCorto,p.skills.vision,p.skills.tecnica,p.skills.trabajoEquipo])));
  let attack = avg(atts.concat(wings).map(p=> avg([p.skills.remate,p.skills.regate,p.skills.velocidad,p.skills.serenidad])));
  let discipline = avg(lineup.map(p=>p.skills.disciplina));
  let stamina = avg(lineup.map(p=>p.skills.resistencia));
  let keeper = gk ? avg([gk.skills.porteria,gk.skills.posicionamiento,gk.skills.serenidad]) : 40;
  const rep = seed.clubs.find(c=>c.id===clubId).reputation;
  const adjust = applyMentalityBonus(tactic);
  return { lineup, defense:defense+adjust.defense, midfield:midfield+adjust.midfield, attack:attack+adjust.attack, discipline, stamina, keeper, reputation:rep };
}
function applyMentalityBonus(tactic){
  const bonus = { attack:0, midfield:0, defense:0 };
  const apply = (line, value) => {
    if(value === 'ataque') { bonus.attack += line === 'attack' ? 6 : 3; bonus.defense -= line === 'defense' ? 3 : 1; }
    if(value === 'defensiva') { bonus.defense += line === 'defense' ? 6 : 3; bonus.attack -= line === 'attack' ? 3 : 1; }
    if(value === 'posicional') { bonus.midfield += 3; bonus.defense += 1; }
  };
  apply('defense', tactic.defense);
  apply('midfield', tactic.midfield);
  apply('attack', tactic.attack);
  return bonus;
}
function simulateNextMatchday(){
  if(!game || game.matchdayIndex >= game.fixtures.length) return;
  const round = game.fixtures[game.matchdayIndex];
  const results = round.matches.map(match => simulateMatch(match));
  round.matches.forEach((m,i)=>Object.assign(m, { played:true, homeGoals:results[i].homeGoals, awayGoals:results[i].awayGoals }));
  game.matchHistory.push(...results);
  game.matchdayIndex += 1;
  game.currentDate = game.fixtures[game.matchdayIndex]?.date || round.date;
  activeTab = 'home';
  renderAll();
  saveLocal();
  showNotice(`Jornada ${round.matchday} simulada.`);
}
function getTacticForClub(clubId){
  if(clubId === game.selectedClubId) return game.tactic;
  const club = seed.clubs.find(c=>c.id===clubId);
  const formation = club.reputation > 74 ? '4-3-3' : club.reputation < 61 ? '5-4-1' : '4-4-2';
  return { formation, defense:'posicional', midfield:'posicional', attack:'posicional' };
}
function simulateMatch(match){
  const home = teamPower(match.homeId, getTacticForClub(match.homeId));
  const away = teamPower(match.awayId, getTacticForClub(match.awayId));
  const homeLambda = expectedGoals(home, away, true);
  const awayLambda = expectedGoals(away, home, false);
  const homeGoals = poisson(homeLambda);
  const awayGoals = poisson(awayLambda);
  const goals = [];
  for(let i=0;i<homeGoals;i++) goals.push(makeGoal(match.homeId, home.lineup));
  for(let i=0;i<awayGoals;i++) goals.push(makeGoal(match.awayId, away.lineup));
  goals.sort((a,b)=>a.minute-b.minute);
  const cards = [...makeCards(match.homeId, home), ...makeCards(match.awayId, away)].sort((a,b)=>a.minute-b.minute);
  applyResultToTables(match, homeGoals, awayGoals);
  applyPlayerStats(match.homeId, home.lineup, goals, cards);
  applyPlayerStats(match.awayId, away.lineup, goals, cards);
  return { ...match, played:true, homeGoals, awayGoals, goals, cards };
}
function expectedGoals(attacking, defending, isHome){
  const attackEdge = (attacking.attack - defending.defense) / 34;
  const midfieldEdge = (attacking.midfield - defending.midfield) / 70;
  const keeperEdge = (70 - defending.keeper) / 85;
  const repEdge = (attacking.reputation - defending.reputation) / 95;
  const home = isHome ? 0.22 : 0;
  return clamp(1.12 + attackEdge + midfieldEdge + keeperEdge + repEdge + home + rnd(-0.12,0.12), 0.18, 3.4);
}
function poisson(lambda){
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return clamp(k - 1, 0, 7);
}
function weightedPick(items, weightFn){
  const weighted = items.map(item=>({item, w:Math.max(1, weightFn(item))}));
  const total = weighted.reduce((a,x)=>a+x.w,0);
  let r = Math.random()*total;
  for(const x of weighted){ r -= x.w; if(r<=0) return x.item; }
  return weighted[0].item;
}
function makeGoal(clubId, lineup){
  const scorer = weightedPick(lineup, p => {
    const posBonus = p.position === 'DC' ? 45 : ['ED','EI','EXT','MCO'].includes(p.position) ? 28 : ['MC','MCD','VOL'].includes(p.position) ? 10 : 3;
    return p.skills.remate + p.skills.posicionamiento + posBonus;
  });
  const possibleAssisters = lineup.filter(p=>p.id !== scorer.id);
  const hasAssist = Math.random() < 0.72;
  const assister = hasAssist ? weightedPick(possibleAssisters, p => p.skills.paseCorto + p.skills.vision + (['ED','EI','EXT','MCO','MC'].includes(p.position)?25:5)) : null;
  return { clubId, playerId:scorer.id, assistId:assister?.id || null, minute: Math.floor(rnd(2,91)) };
}
function makeCards(clubId, power){
  const cards = [];
  const yellowBase = clamp((74 - power.discipline) / 30 + 1.1, 0.3, 3.3);
  const yellows = poisson(yellowBase);
  for(let i=0;i<yellows;i++){
    const p = weightedPick(power.lineup, x => 100 - x.skills.disciplina + (['DFC','MCD','LD','LI'].includes(x.position)?16:4));
    cards.push({ clubId, playerId:p.id, type:'yellow', minute:Math.floor(rnd(5,90)) });
  }
  if(Math.random() < clamp((72 - power.discipline) / 180, 0.02, 0.18)){
    const p = weightedPick(power.lineup, x => 100 - x.skills.disciplina + (['DFC','MCD'].includes(x.position)?18:4));
    cards.push({ clubId, playerId:p.id, type:'red', minute:Math.floor(rnd(20,90)) });
  }
  return cards;
}
function applyResultToTables(match, hg, ag){
  const h = game.standings[match.homeId];
  const a = game.standings[match.awayId];
  h.pj++; a.pj++;
  h.gf += hg; h.gc += ag; a.gf += ag; a.gc += hg;
  if(hg > ag){ h.pg++; a.pp++; h.pts += 3; }
  else if(hg < ag){ a.pg++; h.pp++; a.pts += 3; }
  else { h.pe++; a.pe++; h.pts++; a.pts++; }
  h.dg = h.gf - h.gc; a.dg = a.gf - a.gc;
}
function applyPlayerStats(clubId, lineup, goals, cards){
  lineup.forEach(p => game.playerStats[p.id].played++);
  goals.filter(g=>g.clubId===clubId).forEach(g=>{
    game.playerStats[g.playerId].goals++;
    if(g.assistId) game.playerStats[g.assistId].assists++;
  });
  cards.filter(c=>c.clubId===clubId).forEach(c=>{
    if(c.type === 'yellow') game.playerStats[c.playerId].yellow++;
    if(c.type === 'red') game.playerStats[c.playerId].red++;
  });
}

init();
