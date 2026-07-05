const DATA_URL = 'data/seed.json';
const DB_NAME = 'futbol-manager-mvp';
const DB_STORE = 'saves';
const SAVE_KEY = 'main';
const ADVANCE_LOCK_MS = 120000;
const APP_VERSION = 'V1.06';

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
const FORMATION_VISUAL_BANDS = {
  '4-4-2': [4,0,4,0,2],
  '4-3-3': [4,0,3,0,3],
  '4-2-3-1': [4,2,0,3,1],
  '3-5-2': [3,0,5,0,2],
  '5-3-2': [5,0,3,0,2],
  '4-1-4-1': [4,1,4,0,1],
  '3-4-3': [3,0,4,0,3],
  '4-5-1': [4,0,5,0,1],
  '4-3-1-2': [4,0,3,1,2],
  '5-4-1': [5,0,4,0,1]
};
const FORMATION_VISUALS = {
  '4-4-2':[4,0,4,0,2],
  '4-3-3':[4,0,3,0,3],
  '4-2-3-1':[4,2,0,3,1],
  '3-5-2':[3,0,5,0,2],
  '5-3-2':[5,0,3,0,2],
  '4-1-4-1':[4,1,4,0,1],
  '3-4-3':[3,0,4,0,3],
  '4-5-1':[4,1,2,2,1],
  '4-3-1-2':[4,0,3,1,2],
  '5-4-1':[5,0,4,0,1]
};
const MENTALITIES = ['posicional','ataque','defensiva'];
const SUB_TRIGGERS = [
  { value:'tired', label:'Quitar cansados' },
  { value:'winning', label:'Entrar ganando' },
  { value:'losing', label:'Entrar perdiendo' },
  { value:'drawing', label:'Entrar empatando' }
];
const DEFAULT_TACTIC = {
  formation:'4-4-2',
  starters:[],
  bench:[],
  autoSubs:[],
  playerMentalities:{}
};

let seed = null;
let game = null;
let activeTab = 'home';
let squadSort = 'media_desc';
let uiTicker = null;

const $ = (id) => document.getElementById(id);
const view = $('view');

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
function showNotice(text, persist=false){
  const box = $('notice');
  box.textContent = text;
  box.classList.remove('hidden');
  clearTimeout(showNotice.timer);
  if(!persist){ showNotice.timer = setTimeout(() => box.classList.add('hidden'), 4800); }
}
function hideNotice(){ $('notice').classList.add('hidden'); }
function clamp(value,min,max){ return Math.max(min, Math.min(max, value)); }
function rnd(min,max){ return min + Math.random() * (max-min); }
function avg(values){ const clean = values.filter(v => Number.isFinite(v)); return clean.length ? clean.reduce((a,b)=>a+b,0)/clean.length : 0; }
function formatMoney(value){ return new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(value); }
function clubName(id){ return seed.clubs.find(c => c.id === id)?.name || '—'; }
function clubShort(id){ return seed.clubs.find(c => c.id === id)?.short || clubName(id).slice(0,3).toUpperCase(); }
function clubColor(id){ return seed.clubs.find(c => c.id === id)?.primaryColor || '#3b82f6'; }
function clubLink(id){ return `<button class="linklike club-link" data-club-id="${id}"><span class="club-dot" style="background:${clubColor(id)}"></span>${escapeHtml(clubName(id))}</button>`; }
function clubSpan(id){ return `<span class="club-click" data-club-id="${id}"><span class="club-dot" style="background:${clubColor(id)}"></span>${escapeHtml(clubName(id))}</span>`; }
function playerById(id){ return seed.players.find(p => p.id === Number(id)); }
function playersByClub(clubId){ return seed.players.filter(p => p.clubId === clubId); }
function playerStatus(playerId){ return game?.playerStatus?.[playerId] || {}; }
function isUnavailable(playerId){
  if(!game) return false;
  const st = playerStatus(playerId);
  return Boolean((st.injuredThrough !== undefined && game.matchdayIndex <= st.injuredThrough) || (st.suspendedThrough !== undefined && game.matchdayIndex <= st.suspendedThrough));
}
function statusText(playerId){
  if(!game) return 'Disponible';
  const st = playerStatus(playerId);
  const parts = [];
  if(st.injuredThrough !== undefined && game.matchdayIndex <= st.injuredThrough) parts.push(`Lesionado ${st.injuryLabel || ''}`.trim());
  if(st.suspendedThrough !== undefined && game.matchdayIndex <= st.suspendedThrough) parts.push('Suspendido');
  return parts.length ? parts.join(' · ') : 'Disponible';
}
function hashNumber(seedValue, max){
  let h = 2166136261;
  const str = String(seedValue);
  for(let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0) % max;
}
function baseSkill(p, skillName){
  return clamp(Math.round(p.skills?.[skillName] ?? p.overall ?? 50), 1, 99);
}
function hiddenStats(p){
  const aggression = clamp(Math.round(100 - (p.skills.disciplina || 50) + hashNumber(`ag${p.id}`, 18) - 8), 1, 99);
  const genetics = clamp(Math.round(45 + hashNumber(`ge${p.id}`, 55)), 1, 99);
  const surprise = clamp(hashNumber(`su${p.id}`, 21), 0, 20);
  return { aggression, genetics, surprise };
}
function effectiveSkill(p, skillName){
  const raw = baseSkill(p, skillName);
  return clamp(raw + hiddenStats(p).surprise, 1, 99);
}
function visibleStats(p){
  if(p.position === 'POR'){
    return {
      Salto: Math.round(avg([baseSkill(p,'cabezazo'), baseSkill(p,'fuerza')])) || p.overall,
      Defensa: Math.round(avg([baseSkill(p,'porteria'), baseSkill(p,'posicionamiento')])) || p.overall,
      Pase: Math.round(avg([baseSkill(p,'paseCorto'), baseSkill(p,'paseLargo')])) || p.overall,
      Reflejos: Math.round(avg([baseSkill(p,'porteria'), baseSkill(p,'serenidad'), baseSkill(p,'aceleracion')])) || p.overall,
      Mando: Math.round(avg([baseSkill(p,'liderazgo'), baseSkill(p,'trabajoEquipo'), baseSkill(p,'serenidad')])) || p.overall,
      Potencia: Math.round(avg([baseSkill(p,'fuerza'), baseSkill(p,'paseLargo')])) || p.overall,
      Resistencia: baseSkill(p,'resistencia')
    };
  }
  return {
    Ataque: Math.round(avg([baseSkill(p,'remate'), baseSkill(p,'regate'), baseSkill(p,'posicionamiento')])) || p.overall,
    Defensa: Math.round(avg([baseSkill(p,'marca'), baseSkill(p,'entradas'), baseSkill(p,'posicionamiento')])) || p.overall,
    Pase: Math.round(avg([baseSkill(p,'paseCorto'), baseSkill(p,'paseLargo'), baseSkill(p,'vision')])) || p.overall,
    Velocidad: Math.round(avg([baseSkill(p,'velocidad'), baseSkill(p,'aceleracion')])) || p.overall,
    Cabezazo: baseSkill(p,'cabezazo'),
    Tiro: baseSkill(p,'remate'),
    Resistencia: baseSkill(p,'resistencia')
  };
}
function visibleOverall(p){
  return clamp(Math.round(avg(Object.values(visibleStats(p)))), 1, 99);
}
function effectiveOverall(p){
  const simulated = {
    Ataque: Math.round(avg([effectiveSkill(p,'remate'), effectiveSkill(p,'regate'), effectiveSkill(p,'posicionamiento')])) || p.overall,
    Defensa: Math.round(avg([effectiveSkill(p,'marca'), effectiveSkill(p,'entradas'), effectiveSkill(p,'posicionamiento')])) || p.overall,
    Pase: Math.round(avg([effectiveSkill(p,'paseCorto'), effectiveSkill(p,'paseLargo'), effectiveSkill(p,'vision')])) || p.overall,
    Velocidad: Math.round(avg([effectiveSkill(p,'velocidad'), effectiveSkill(p,'aceleracion')])) || p.overall,
    Cabezazo: effectiveSkill(p,'cabezazo'),
    Tiro: effectiveSkill(p,'remate'),
    Resistencia: effectiveSkill(p,'resistencia')
  };
  return clamp(Math.round(avg(Object.values(simulated))), 1, 99);
}
function currentCondition(playerId){
  if(!game) return 99;
  if(!game.playerCondition) game.playerCondition = {};
  if(!Number.isFinite(game.playerCondition[playerId])) game.playerCondition[playerId] = 99;
  return clamp(Math.round(game.playerCondition[playerId]), 0, 99);
}
function conditionFactor(playerId){
  return 0.5 + 0.5 * (currentCondition(playerId) / 99);
}
function matchSkill(p, skillName){
  return clamp(Math.round(effectiveSkill(p, skillName) * conditionFactor(p.id)), 1, 99);
}
function jerseyNumber(playerId){
  const p = playerById(playerId);
  if(!p) return 0;
  const ordered = playersByClub(p.clubId).slice().sort((a,b)=> positionOrder(a.position)-positionOrder(b.position) || visibleOverall(b)-visibleOverall(a) || a.id-b.id);
  const idx = ordered.findIndex(x=>x.id===p.id);
  return idx >= 0 ? idx + 1 : 0;
}
function playerLastName(name){
  const parts = String(name || '').trim().split(/\s+/);
  return parts[parts.length-1] || name || 'Jugador';
}
function playerDisplayName(playerId){
  const p = playerById(playerId);
  return p ? `${playerLastName(p.name)} #${jerseyNumber(p.id)}` : 'Jugador';
}
function countryFlag(nationality){
  const flags = { Argentina:'🇦🇷', Bolivia:'🇧🇴', Brasil:'🇧🇷', Chile:'🇨🇱', Colombia:'🇨🇴', Ecuador:'🇪🇨', Paraguay:'🇵🇾', 'Perú':'🇵🇪', Uruguay:'🇺🇾' };
  return flags[nationality] || '🌐';
}
function roleMeta(position){
  const map = {
    POR:{ code:'POR', name:'Portero', icon:'🧤', group:'gk' },
    DFC:{ code:'DFC', name:'Defensa central', icon:'🛡️', group:'def' },
    LI:{ code:'DFI', name:'Defensa izquierda', icon:'🛡️', group:'def' },
    LD:{ code:'DFD', name:'Defensa derecha', icon:'🛡️', group:'def' },
    MCD:{ code:'MDC', name:'Medio defensivo', icon:'⚙️', group:'mid' },
    MC:{ code:'MC', name:'Mediocentro', icon:'⚙️', group:'mid' },
    MCO:{ code:'MO', name:'Medio ofensivo', icon:'🎯', group:'mid' },
    EI:{ code:'EI', name:'Extremo izquierdo', icon:'⚡', group:'att' },
    ED:{ code:'ED', name:'Extremo derecho', icon:'⚡', group:'att' },
    EXT:{ code:'EXT', name:'Extremo', icon:'⚡', group:'att' },
    DC:{ code:'DC', name:'Delantero centro', icon:'🎯', group:'att' },
    VOL:{ code:'VOL', name:'Volante', icon:'⚙️', group:'mid' }
  };
  return map[position] || { code:position, name:position, icon:'⚽', group:'mid' };
}
function roleBadge(position){
  const meta = roleMeta(position);
  return `${meta.icon} ${meta.code}`;
}
function nationalityRegion(nationality){
  const value = String(nationality || '').toLowerCase();
  const america = ['argentina','bolivia','brasil','chile','colombia','ecuador','paraguay','perú','peru','uruguay','venezuela','méxico','mexico','estados unidos','canadá','canada','costa rica','panamá','panama'];
  const europe = ['españa','espana','italia','francia','alemania','portugal','inglaterra','croacia','serbia','polonia','países bajos','paises bajos','holanda','bélgica','belgica','suiza','dinamarca','noruega','suecia'];
  const africa = ['marruecos','senegal','nigeria','ghana','camerún','camerun','argelia','egipto','costa de marfil','túnez','tunez','sudáfrica','sudafrica'];
  const asia = ['japón','japon','corea','china','irán','iran','arabia saudita','qatar','australia'];
  if(america.includes(value)) return 'America';
  if(europe.includes(value)) return 'Europa';
  if(africa.includes(value)) return 'africa';
  if(asia.includes(value)) return 'Asia';
  return 'Otros';
}
function faceMaxForRegion(region){
  return region === 'Otros' ? 20 : 10;
}
function faceBaseForPlayer(player){
  const region = nationalityRegion(player?.nationality);
  const index = hashNumber(`face-${player?.id || 0}-${region}`, faceMaxForRegion(region)) + 1;
  return `img/faces/${region} (${index})`;
}
function faceImg(player, className='photo-thumb'){
  const base = faceBaseForPlayer(player);
  const alt = `Foto de ${escapeHtml(player?.name || 'jugador')}`;
  return `<img class="${className}" src="${base}.png" alt="${alt}" data-face-base="${base}" data-face-ext-index="0" onerror="tryNextFaceExt(this)">`;
}
function tryNextFaceExt(img){
  const exts = ['.png','.jpg','.jpeg','.webp'];
  const index = Number(img.dataset.faceExtIndex || 0) + 1;
  const base = img.dataset.faceBase;
  if(base && index < exts.length){
    img.dataset.faceExtIndex = String(index);
    img.src = `${base}${exts[index]}`;
    return;
  }
  img.onerror = null;
  img.replaceWith(fallbackFaceNode(img.className));
}
function fallbackFaceNode(className){
  const node = document.createElement('div');
  node.className = className || 'photo-thumb';
  node.textContent = '👤';
  return node;
}
function playerGroup(position){
  return roleMeta(position).group;
}
function playerGroupClass(position){
  const group = playerGroup(position);
  return group === 'gk' ? 'gk' : group === 'def' ? 'def' : group === 'att' ? 'att' : 'mid';
}
function slotGroup(slot){
  if(slot === 'POR') return 'gk';
  if(['LD','LI','DFC'].includes(slot)) return 'def';
  if(['MCD','MC','MCO','VOL'].includes(slot)) return 'mid';
  return 'att';
}
function playerFitsSlot(player, slot){
  return playerGroup(player.position) === slotGroup(slot);
}
function zoneFactor(player, slot){
  return playerFitsSlot(player, slot) ? 1 : 0.5;
}
function conditionLossForPlayer(player){
  const loss = rnd(15,20);
  return player?.position === 'POR' ? loss * 0.5 : loss;
}
function clubRequirementIssues(clubId){
  const squad = playersByClub(clubId);
  const keepers = squad.filter(p => p.position === 'POR').length;
  const issues = [];
  if(keepers < 2) issues.push(`necesita 2 porteros y tiene ${keepers}`);
  if(squad.length < 16) issues.push(`necesita 16 jugadores y tiene ${squad.length}`);
  return issues;
}
function invalidClubRequirements(){
  return seed.clubs.map(c => ({ club:c, issues:clubRequirementIssues(c.id) })).filter(x => x.issues.length);
}
function isClubRequirementsBlocking(){
  return invalidClubRequirements().length > 0;
}
function mentalityMarker(mode){
  if(mode === 'ataque') return '<span class="mentality-marker attack" title="Ataque">→</span>';
  if(mode === 'defensiva') return '<span class="mentality-marker defense" title="Defensiva">←</span>';
  return '<span class="mentality-marker positional" title="Posicional">—</span>';
}
function nextMentality(current){
  const idx = MENTALITIES.indexOf(current);
  return MENTALITIES[(idx + 1) % MENTALITIES.length] || 'posicional';
}
function playerMentality(playerId, tactic = game?.tactic){
  return tactic?.playerMentalities?.[playerId] || 'posicional';
}
function applyStarterMentalities(tactic){
  const next = { ...(tactic.playerMentalities || {}) };
  (tactic.starters || []).forEach(id => {
    if(!MENTALITIES.includes(next[id])) next[id] = 'posicional';
  });
  Object.keys(next).forEach(id => {
    if(!(tactic.starters || []).includes(Number(id))) delete next[id];
  });
  tactic.playerMentalities = next;
  return tactic;
}
function formationLayout(formation){
  return FORMATION_VISUALS[formation] || [4,0,4,0,2];
}
function formationCoordinates(formation){
  const layout = formationLayout(formation);
  const rows = [
    { count:1, x:10 },
    { count:layout[0], x:24 },
    { count:layout[1], x:38 },
    { count:layout[2], x:52 },
    { count:layout[3], x:66 },
    { count:layout[4], x:80 }
  ];
  const coords = [];
  rows.forEach(row=>{
    const count = row.count;
    for(let i=0;i<count;i++){
      const y = count === 1 ? 50 : 14 + (72 * (i+1)/(count+1));
      coords.push({ x:row.x, y });
    }
  });
  return coords;
}
function roleCompatibility(position, slot){
  if(position === slot) return 16;
  const near = {
    LD:['LI','DFC'], LI:['LD','DFC'], DFC:['LD','LI'],
    MCD:['MC','VOL'], MC:['MCD','VOL','MCO'], VOL:['MC','MCD','MCO'], MCO:['MC','VOL','ED','EI'],
    ED:['EI','EXT','DC','MCO'], EI:['ED','EXT','DC','MCO'], EXT:['ED','EI','DC'],
    DC:['ED','EI','EXT','MCO'], POR:[]
  };
  return (near[slot] || []).includes(position) ? 6 : -10;
}
function assignPlayersToRoleSequence(players, formation){
  const slots = FORMATIONS[formation] || FORMATIONS['4-4-2'];
  const remaining = players.slice();
  const assigned = [];
  slots.forEach(slot => {
    remaining.sort((a,b)=>(visibleOverall(b) + roleCompatibility(b.position, slot)) - (visibleOverall(a) + roleCompatibility(a.position, slot)));
    const pick = remaining.shift();
    if(pick) assigned.push({ player:pick, slot });
  });
  return assigned;
}
function pitchSlots(tactic){
  const slots = FORMATIONS[tactic?.formation] || FORMATIONS['4-4-2'];
  const coords = formationCoordinates(tactic?.formation || '4-4-2');
  return slots.map((slot, i) => {
    const player = playerById((tactic?.starters || [])[i]);
    return { player, slot, index:i, x: coords[i]?.x || 50, y: coords[i]?.y || 50, mentality: player ? playerMentality(player.id, tactic) : 'posicional' };
  });
}
function fitnessRingSvg(playerId){
  const condition = currentCondition(playerId);
  const active = Math.max(0, Math.min(8, Math.ceil(condition / 12.5)));
  const colors = ['#ef4444','#f97316','#f59e0b','#eab308','#84cc16','#22c55e','#16a34a','#15803d'];
  const cx = 34, cy = 34, r = 31;
  const segments = [];
  for(let i=0;i<8;i++){
    const a0 = (-120 + i * 45) * Math.PI / 180;
    const a1 = (-120 + i * 45 + 30) * Math.PI / 180;
    const x1 = cx + Math.cos(a0) * r;
    const y1 = cy + Math.sin(a0) * r;
    const x2 = cx + Math.cos(a1) * r;
    const y2 = cy + Math.sin(a1) * r;
    const color = i < active ? colors[i] : 'rgba(148,163,184,.22)';
    segments.push(`<path d="M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  }
  return `<svg class="fitness-ring" viewBox="0 0 68 68" aria-hidden="true">${segments.join('')}</svg>`;
}


async function openDb(){
  return new Promise((resolve,reject)=>{
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(DB_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function saveLocal(silent=false){
  if(!game) return showNotice('No hay partida para guardar.');
  const db = await openDb();
  await new Promise((resolve,reject)=>{
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(game, SAVE_KEY);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  if(!silent) showNotice('Partida guardada en este navegador.');
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
    game = normalizeGame(saved);
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
    startUiTicker();
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
  document.addEventListener('click', (event)=>{
    const playerBtn = event.target.closest('[data-player-id]');
    if(playerBtn){ showPlayerModal(Number(playerBtn.dataset.playerId)); return; }
    const clubBtn = event.target.closest('[data-club-id]');
    if(clubBtn){ showClubModal(Number(clubBtn.dataset.clubId)); return; }
    const matchBtn = event.target.closest('[data-match-id]');
    if(matchBtn){ showMatchModal(matchBtn.dataset.matchId); return; }
    const mentalityBtn = event.target.closest('[data-toggle-mentality]');
    if(mentalityBtn){
      const playerId = Number(mentalityBtn.dataset.toggleMentality);
      if(game?.tactic?.starters?.includes(playerId)){
        game.tactic = applyStarterMentalities(game.tactic);
        game.tactic.playerMentalities[playerId] = nextMentality(playerMentality(playerId));
        saveLocal(true);
        renderTactics();
      }
      return;
    }
    const close = event.target.closest('[data-close-modal]');
    if(close || event.target.classList.contains('modal-backdrop')) closeModal();
  });
  document.addEventListener('dragstart', (event)=>{
    const item = event.target.closest('[data-drag-player]');
    if(item){
      event.dataTransfer.setData('text/plain', item.dataset.dragPlayer);
      event.dataTransfer.effectAllowed = 'move';
    }
  });
  document.addEventListener('dragover', (event)=>{
    if(event.target.closest('[data-drop-slot], [data-drop-pool]')) event.preventDefault();
  });
  document.addEventListener('drop', (event)=>{
    const playerId = Number(event.dataTransfer.getData('text/plain'));
    if(!playerId || !game) return;
    const slot = event.target.closest('[data-drop-slot]');
    const pool = event.target.closest('[data-drop-pool]');
    if(slot){
      event.preventDefault();
      assignPlayerToStarterSlot(playerId, Number(slot.dataset.dropSlot));
      return;
    }
    if(pool){
      event.preventDefault();
      movePlayerToPool(playerId, pool.dataset.dropPool);
    }
  });
  document.addEventListener('keydown', (event)=>{ if(event.key === 'Escape') closeModal(); });
}

function startUiTicker(){
  clearInterval(uiTicker);
  uiTicker = setInterval(()=>{
    if(game && activeTab === 'home') updateAdvanceButtonState();
  }, 1000);
}
function normalizeGame(saved){
  const normalized = {...saved};
  normalized.version = APP_VERSION;
  normalized.tactic = normalizeTactic(normalized.selectedClubId, normalized.tactic || DEFAULT_TACTIC);
  normalized.playerStatus = normalized.playerStatus || {};
  normalized.lastOwnProblems = normalized.lastOwnProblems || [];
  normalized.mustReviewTactics = Boolean(normalized.mustReviewTactics);
  normalized.advanceLockedUntil = normalized.advanceLockedUntil || 0;
  normalized.matchHistory = normalized.matchHistory || [];
  normalized.fixtures = normalized.fixtures || structuredClone(seed.fixtures);
  normalized.standings = normalized.standings || createInitialStandings();
  normalized.playerStats = normalized.playerStats || createInitialPlayerStats();
  normalized.budget = Number.isFinite(normalized.budget) ? normalized.budget : (seed.clubs.find(c=>c.id===normalized.selectedClubId)?.budget || 0);
  normalized.lastBudgetDelta = Number.isFinite(normalized.lastBudgetDelta) ? normalized.lastBudgetDelta : 0;
  normalized.budgetHistory = normalized.budgetHistory || [];
  normalized.playerCondition = normalized.playerCondition || {};
  seed.players.forEach(p => { if(!Number.isFinite(normalized.playerCondition[p.id])) normalized.playerCondition[p.id] = 99; });
  Object.values(normalized.playerStats).forEach(stat => {
    if(stat.injuries === undefined) stat.injuries = 0;
    if(stat.played === undefined) stat.played = 0;
    if(stat.yellow === undefined) stat.yellow = 0;
    if(stat.red === undefined) stat.red = 0;
  });
  return normalized;
}

function assignPlayerToStarterSlot(playerId, slotIndex){
  game.tactic = applyStarterMentalities(normalizeTactic(game.selectedClubId, game.tactic));
  const starters = game.tactic.starters.slice(0,11);
  while(starters.length < 11) starters.push(0);
  let bench = game.tactic.bench.slice(0,10).filter(id => id !== playerId);
  const previousIndex = starters.indexOf(playerId);
  if(previousIndex >= 0) starters[previousIndex] = 0;
  const displaced = starters[slotIndex];
  starters[slotIndex] = playerId;
  if(displaced && displaced !== playerId && bench.length < 10) bench.push(displaced);
  game.tactic.starters = starters.filter(Boolean);
  game.tactic.bench = bench.filter(Boolean).slice(0,10);
  game.tactic.autoSubs = (game.tactic.autoSubs || []).map(rule => ({...rule, outId:game.tactic.starters.includes(rule.outId)?rule.outId:0, inId:game.tactic.bench.includes(rule.inId)?rule.inId:0}));
  game.tactic = applyStarterMentalities(game.tactic);
  saveLocal(true);
  renderTactics();
}
function movePlayerToPool(playerId, pool){
  game.tactic = applyStarterMentalities(normalizeTactic(game.selectedClubId, game.tactic));
  game.tactic.starters = game.tactic.starters.filter(id => id !== playerId);
  game.tactic.bench = game.tactic.bench.filter(id => id !== playerId);
  if(pool === 'bench'){
    if(game.tactic.bench.length < 10) game.tactic.bench.push(playerId);
    else showNotice('El banco ya tiene 10 suplentes. El jugador quedó como reserva.');
  }
  game.tactic.autoSubs = (game.tactic.autoSubs || []).map(rule => ({...rule, outId:game.tactic.starters.includes(rule.outId)?rule.outId:0, inId:game.tactic.bench.includes(rule.inId)?rule.inId:0}));
  game.tactic = applyStarterMentalities(game.tactic);
  saveLocal(true);
  renderTactics();
}
function normalizeTactic(clubId, tactic){
  const base = {...DEFAULT_TACTIC, ...(tactic || {})};
  const squad = playersByClub(clubId);
  const squadIds = new Set(squad.map(p => p.id));
  let starters = (base.starters || []).map(Number).filter(id => squadIds.has(id));
  let bench = (base.bench || []).map(Number).filter(id => squadIds.has(id) && !starters.includes(id));
  if(starters.length !== 11){ starters = autoSelectStarters(clubId, base).map(p => p.id); }
  if(bench.length !== 10){ bench = autoSelectBench(clubId, starters).map(p => p.id); }
  let autoSubs = Array.isArray(base.autoSubs) ? base.autoSubs.slice(0,5) : [];
  autoSubs = autoSubs.map(rule => ({
    outId: Number(rule.outId || 0),
    inId: Number(rule.inId || 0),
    trigger: SUB_TRIGGERS.some(t => t.value === rule.trigger) ? rule.trigger : 'tired'
  })).filter(rule => starters.includes(rule.outId) && bench.includes(rule.inId));
  while(autoSubs.length < 5){ autoSubs.push({ outId:0, inId:0, trigger:'tired' }); }
  const normalized = { formation:base.formation, starters, bench, autoSubs, playerMentalities:{ ...(base.playerMentalities || {}) } };
  return applyStarterMentalities(normalized);
}

function newGame(selectedClubId){
  const tactic = normalizeTactic(selectedClubId, DEFAULT_TACTIC);
  game = {
    version:APP_VERSION,
    selectedClubId,
    currentDate: seed.fixtures[0].date,
    matchdayIndex: 0,
    tactic,
    standings: createInitialStandings(),
    playerStats: createInitialPlayerStats(),
    playerStatus: {},
    matchHistory: [],
    fixtures: structuredClone(seed.fixtures),
    advanceLockedUntil: 0,
    mustReviewTactics: false,
    lastOwnProblems: [],
    budget: seed.clubs.find(c=>c.id===selectedClubId)?.budget || 0,
    lastBudgetDelta: 0,
    budgetHistory: [],
    playerCondition: Object.fromEntries(seed.players.map(p => [p.id, 99]))
  };
  activeTab = 'home';
  renderAll();
  showNotice('Nueva partida creada. Revisá táctica, titulares y mentalidades antes de avanzar.');
}

function createInitialStandings(){
  const obj = {};
  seed.clubs.forEach(c => obj[c.id] = { clubId:c.id, pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, dg:0, pts:0 });
  return obj;
}
function createInitialPlayerStats(){
  const obj = {};
  seed.players.forEach(p => obj[p.id] = { playerId:p.id, clubId:p.clubId, goals:0, assists:0, yellow:0, red:0, played:0, injuries:0 });
  return obj;
}

function renderAll(){
  document.querySelectorAll('.tabs button').forEach(btn=>btn.classList.toggle('active', btn.dataset.tab === activeTab));
  $('managerClub').textContent = game ? clubName(game.selectedClubId) : 'Sin partida';
  $('currentDate').textContent = game ? `Fecha: ${game.currentDate}` : 'Fecha: —';
  $('currentRound').textContent = game ? `Jornada: ${Math.min(game.matchdayIndex+1, seed.fixtures.length)} / ${seed.fixtures.length}` : 'Jornada: —';
  $('btnSave').disabled = !game;
  if(!game){
    hideNotice();
    view.innerHTML = $('emptyState').innerHTML;
    return;
  }
  if(isClubRequirementsBlocking()){
    renderClubRequirementsWarning();
    return;
  }
  const renderers = { home:renderHome, squad:renderSquad, tactics:renderTactics, fixture:renderFixture, standings:renderStandings, stats:renderStats };
  renderers[activeTab]();
}
function renderClubRequirementsWarning(){
  const invalid = invalidClubRequirements();
  const rows = invalid.map(item => {
    const squad = playersByClub(item.club.id);
    const keepers = squad.filter(p=>p.position==='POR').length;
    return `<tr><td><strong>${escapeHtml(item.club.name)}</strong></td><td>${squad.length}</td><td>${keepers}</td><td><span class="bad">${escapeHtml(item.issues.join(' · '))}</span></td></tr>`;
  }).join('');
  view.innerHTML = `
    <div class="card blocker requirement-warning">
      <h2>Advertencia de estructura de planteles</h2>
      <p>Cada club debe tener como mínimo <strong>2 porteros</strong> y <strong>16 jugadores</strong>. Corregí ` + "`data/seed.json`" + ` antes de continuar.</p>
      <div class="table-wrap"><table><thead><tr><th>Club</th><th>Jugadores</th><th>Porteros</th><th>Problema</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>`;
}
function getNextMatchForSelected(){
  if(!game || game.matchdayIndex >= game.fixtures.length) return null;
  const round = game.fixtures[game.matchdayIndex];
  return round.matches.find(m => m.homeId === game.selectedClubId || m.awayId === game.selectedClubId);
}
function renderHome(){
  const next = getNextMatchForSelected();
  const clubPlayers = playersByClub(game.selectedClubId);
  const avgOverall = Math.round(avg(clubPlayers.map(p=>visibleOverall(p))));
  const position = sortedStandings().findIndex(s=>s.clubId===game.selectedClubId)+1;
  const lastMatches = game.matchHistory.filter(m=>m.homeId===game.selectedClubId || m.awayId===game.selectedClubId).slice(-5).reverse();
  const problems = game.lastOwnProblems || [];
  const deltaClass = game.lastBudgetDelta > 0 ? 'ok' : game.lastBudgetDelta < 0 ? 'bad' : 'muted';
  const deltaText = game.lastBudgetDelta ? `${game.lastBudgetDelta > 0 ? '+' : ''}${formatMoney(game.lastBudgetDelta)}` : '—';
  const problemBox = problems.length ? `<div class="card blocker"><h3>Revisión obligatoria</h3><p>Hubo lesionados o expulsados propios en el último partido. Entrá a Táctica, reemplazalos y guardá una alineación válida.</p><div class="problem-list">${problems.map(problemItem).join('')}</div><button class="primary" data-go-tactics>Ir a táctica</button></div>` : '';
  view.innerHTML = `
    <div class="row section-title">
      <div>
        <h2>Panel principal</h2>
        <p class="tagline">Versión ${APP_VERSION}. Simulación local, once titular en cancha, cambios automáticos, estado físico y presupuesto dinámico por resultado.</p>
      </div>
      <button id="advanceBtn" class="primary">Avanzar fecha</button>
    </div>
    ${problemBox}
    <div class="card placeholder-main-card home-top-visual">
      <h3>Momento del club</h3>
      <div class="main-visual-placeholder"><strong>Próximamente</strong><span>Aquí se insertará una imagen contextual según el momento del club.</span></div>
    </div>
    <div class="grid cols-4" style="margin-top:14px">
      <div class="card"><p class="label">Posición</p><div class="metric">${position || '—'}°</div></div>
      <div class="card"><p class="label">Media plantel</p><div class="metric">${avgOverall}</div></div>
      <div class="card"><p class="label">Jugadores</p><div class="metric">${clubPlayers.length}</div></div>
      <div class="card"><p class="label">Presupuesto</p><div class="metric small">${formatMoney(game.budget || 0)}</div><p class="small ${deltaClass}">Último balance: ${deltaText}</p></div>
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
  document.querySelector('[data-go-tactics]')?.addEventListener('click',()=>{ activeTab='tactics'; renderAll(); });
  updateAdvanceButtonState();
}
function updateAdvanceButtonState(){
  const btn = $('advanceBtn');
  if(!btn || !game) return;
  const lockLeft = Math.max(0, (game.advanceLockedUntil || 0) - Date.now());
  const seasonEnded = game.matchdayIndex >= game.fixtures.length;
  const invalid = validateCurrentTactic(false);
  let text = 'Avanzar fecha';
  let disabled = false;
  if(seasonEnded){ text = 'Temporada finalizada'; disabled = true; }
  else if(lockLeft > 0){ text = `Avanzar disponible en ${formatClock(lockLeft)}`; disabled = true; }
  else if(game.mustReviewTactics){ text = 'Reemplazar lesionados/suspendidos'; disabled = true; }
  else if(invalid.length){ text = 'Táctica incompleta'; disabled = true; }
  btn.textContent = text;
  btn.disabled = disabled;
}
function formatClock(ms){
  const total = Math.ceil(ms/1000);
  const m = Math.floor(total/60);
  const s = String(total%60).padStart(2,'0');
  return `${m}:${s}`;
}
function problemItem(problem){
  const p = playerById(problem.playerId);
  const type = problem.type === 'injury' ? 'Lesión' : 'Expulsión';
  return `<span class="pill ${problem.type === 'injury' ? 'warn' : 'bad'}">${type}: ${escapeHtml(p?.name || 'Jugador')}</span>`;
}
function matchPreview(match){
  return `<button class="next-match clickable" data-match-id="${escapeHtml(match.id)}">
    <div><div class="team-name">${clubSpan(match.homeId)}</div></div>
    <div class="vs">VS<br><span class="small">${escapeHtml(match.date)}</span></div>
    <div><div class="team-name">${clubSpan(match.awayId)}</div></div>
  </button>`;
}
function compactMatch(m){
  const isHome = m.homeId === game.selectedClubId;
  const gf = isHome ? m.homeGoals : m.awayGoals;
  const gc = isHome ? m.awayGoals : m.homeGoals;
  const cls = gf > gc ? 'ok' : gf < gc ? 'bad' : 'warn';
  return `<button class="stat-rank clickable plain" data-match-id="${escapeHtml(m.id)}"><span>${escapeHtml(clubShort(m.homeId))} ${m.homeGoals} - ${m.awayGoals} ${escapeHtml(clubShort(m.awayId))}</span><strong class="${cls}">${gf > gc ? 'G' : gf < gc ? 'P' : 'E'}</strong></button>`;
}

function sortedSquadPlayers(){
  const players = playersByClub(game.selectedClubId).slice();
  const byName = (a,b) => a.name.localeCompare(b.name, 'es');
  const byNationality = (a,b) => a.nationality.localeCompare(b.nationality, 'es') || byName(a,b);
  const byValue = (a,b) => (a.value || 0) - (b.value || 0) || byName(a,b);
  const sorters = {
    media_desc:(a,b)=>visibleOverall(b)-visibleOverall(a) || byName(a,b),
    media_asc:(a,b)=>visibleOverall(a)-visibleOverall(b) || byName(a,b),
    valor_asc:byValue,
    valor_desc:(a,b)=>(b.value || 0)-(a.value || 0) || byName(a,b),
    nacionalidad_asc:byNationality,
    nacionalidad_desc:(a,b)=>b.nationality.localeCompare(a.nationality, 'es') || byName(a,b),
    nombre_asc:byName
  };
  return players.sort(sorters[squadSort] || sorters.media_desc);
}
function renderSquad(){
  const players = sortedSquadPlayers();
  const sortOptions = [
    ['media_desc','Media mayor a menor'],
    ['media_asc','Media menor a mayor'],
    ['valor_asc','Valor menor a mayor'],
    ['valor_desc','Valor mayor a menor'],
    ['nacionalidad_asc','Nacionalidad A-Z'],
    ['nacionalidad_desc','Nacionalidad Z-A'],
    ['nombre_asc','Nombre A-Z']
  ].map(([value,label])=>`<option value="${value}" ${squadSort===value?'selected':''}>${label}</option>`).join('');
  const rows = players.map(p=>`
    <tr class="${isUnavailable(p.id) ? 'dim-row' : ''}">
      <td>${faceImg(p, 'photo-thumb')}</td>
      <td><button class="linklike" data-player-id="${p.id}"><strong>${escapeHtml(p.name)}</strong></button></td>
      <td>#${jerseyNumber(p.id)}</td>
      <td><span class="pill role-pill">${roleBadge(p.position)}</span></td>
      <td><span class="pill">${countryFlag(p.nationality)} ${escapeHtml(p.nationality)}</span></td>
      <td><strong>${visibleOverall(p)}</strong></td>
      <td>${currentCondition(p.id)}/99</td>
      <td>${visibleStats(p).Resistencia}</td>
      <td><span class="${isUnavailable(p.id) ? 'bad' : 'ok'}">${escapeHtml(statusText(p.id))}</span></td>
      <td>${formatMoney(p.value)}</td>
    </tr>`).join('');
  view.innerHTML = `
    <div class="section-title row"><div><h2>Plantel</h2><p class="tagline">Cada jugador es clickeable. La media se calcula sólo con habilidades visibles.</p></div><div class="sort-box"><label>Ordenar</label><select id="squadSort">${sortOptions}</select></div></div>
    <div class="table-wrap"><table><thead><tr><th>Foto</th><th>Jugador</th><th>Dorsal</th><th>Rol</th><th>Nacionalidad</th><th>Media</th><th>Estado físico</th><th>Resistencia</th><th>Estado</th><th>Valor</th></tr></thead><tbody>${rows}</tbody></table></div>
  `;
  $('squadSort')?.addEventListener('change', e => { squadSort = e.target.value; renderSquad(); });
}
function playerDragCard(p, extra=''){
  return `<div class="drag-player ${playerGroupClass(p.position)} ${extra}" draggable="true" data-drag-player="${p.id}">
    ${faceImg(p, 'drag-face')}
    <div><strong>${escapeHtml(playerLastName(p.name))}</strong><span>#${jerseyNumber(p.id)} · ${roleBadge(p.position)} · ${visibleOverall(p)} · ${currentCondition(p.id)}/99</span></div>
  </div>`;
}
function renderTactics(){
  game.tactic = applyStarterMentalities(normalizeTactic(game.selectedClubId, game.tactic));
  const formationOptions = Object.keys(FORMATIONS).map(f=>`<option value="${f}" ${game.tactic.formation===f?'selected':''}>${f}</option>`).join('');
  const starters = game.tactic.starters.map(playerById).filter(Boolean);
  const bench = game.tactic.bench.map(playerById).filter(Boolean);
  const starterSet = new Set(game.tactic.starters);
  const benchSet = new Set(game.tactic.bench);
  const reserves = playersByClub(game.selectedClubId)
    .filter(p => !starterSet.has(p.id) && !benchSet.has(p.id))
    .sort((a,b)=>positionOrder(a.position)-positionOrder(b.position) || visibleOverall(b)-visibleOverall(a));
  const pitch = pitchSlots(game.tactic).map(slot => {
    const fit = slot.player ? playerFitsSlot(slot.player, slot.slot) : true;
    const chip = slot.player ? `
      <button class="player-chip ${playerGroupClass(slot.player.position)} ${fit ? '' : 'out-zone'}" draggable="true" data-drag-player="${slot.player.id}" data-toggle-mentality="${slot.player.id}" title="${fit ? 'Zona correcta' : 'Fuera de zona: rinde al 50%'}">
        ${fitnessRingSvg(slot.player.id)}
        <span class="jersey-dot">#${jerseyNumber(slot.player.id)}</span>
        <span class="player-chip-name">${escapeHtml(playerLastName(slot.player.name))}</span>
        ${mentalityMarker(slot.mentality)}
      </button>` : `<div class="empty-slot ${slotGroup(slot.slot)}"><strong>${slot.slot}</strong><span>Arrastrar</span></div>`;
    return `<div class="pitch-slot" style="left:${slot.x}%; top:${slot.y}%" data-drop-slot="${slot.index}">${chip}</div>`;
  }).join('');
  const starterList = pitchSlots(game.tactic).map(slot => {
    const p = slot.player;
    const fit = p ? playerFitsSlot(p, slot.slot) : false;
    return `<div class="lineup-row ${p && !fit ? 'bad-zone' : ''}">
      <span class="pill">${slot.index+1}. ${slot.slot}</span>
      <span>${p ? `<button class="linklike" data-player-id="${p.id}">${escapeHtml(p.name)}</button>` : '<span class="muted">Vacío</span>'}</span>
      <strong>${p ? (fit ? 'OK' : '50%') : '—'}</strong>
    </div>`;
  }).join('');
  view.innerHTML = `
    <div class="section-title"><h2>Táctica y convocatoria</h2><p class="tagline">Arrastrá jugadores a los círculos de la pizarra. Si un jugador juega fuera de su zona natural, su rendimiento de partido se penaliza al 50%.</p></div>
    <div class="card tactic-board-card">
      <div class="row tactic-top-row"><div><h3>Cancha táctica</h3><p class="muted small">Formación ${game.tactic.formation}</p></div><div class="formation-box"><label>Formación</label><select id="formation">${formationOptions}</select></div><button id="autoPickBtn" class="ghost">Autoseleccionar</button></div>
      <div class="pitch-board centered">${pitch}</div>
      <div class="pitch-legend">
        <span>${mentalityMarker('posicional')} Posicional</span>
        <span>${mentalityMarker('ataque')} Ataque</span>
        <span>${mentalityMarker('defensiva')} Defensiva</span>
        <span><span class="pill">Anillo</span> Estado físico</span>
      </div>
    </div>
    <div class="grid cols-2 tactic-lists" style="margin-top:14px">
      <div class="card">
        <h3>Titulares</h3>
        <div class="lineup-list">${starterList}</div>
      </div>
      <div class="card">
        <h3>Suplentes / reservas</h3>
        <div class="drop-pool" data-drop-pool="bench"><h4>Suplentes (${bench.length}/10)</h4><div class="drag-list">${bench.length ? bench.map(p=>playerDragCard(p,'bench-card')).join('') : '<p class="muted small">Arrastrá jugadores acá.</p>'}</div></div>
        <div class="drop-pool" data-drop-pool="reserve"><h4>Reservas</h4><div class="drag-list">${reserves.length ? reserves.map(p=>playerDragCard(p,'reserve-card')).join('') : '<p class="muted small">Sin reservas.</p>'}</div></div>
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <h3>Cambios automáticos</h3>
      <p class="muted small">Cada cambio se ejecuta al minuto 45 en un 10% de los casos. En el resto, se programa entre los minutos 60 y 90.</p>
      <div class="autosub-grid">${[0,1,2,3,4].map(i => autoSubRow(i)).join('')}</div>
    </div>
    <div class="row sticky-actions"><button id="saveTactic" class="primary">Guardar táctica</button><span id="tacticErrors" class="bad small"></span></div>
  `;
  $('formation').addEventListener('change', () => {
    const tentative = {...game.tactic, formation:$('formation').value};
    const autoStarters = autoSelectStarters(game.selectedClubId, tentative).map(p=>p.id);
    game.tactic.starters = autoStarters;
    game.tactic.bench = autoSelectBench(game.selectedClubId, autoStarters).map(p=>p.id);
    game.tactic.autoSubs = defaultAutoSubs(game.tactic.starters, game.tactic.bench);
    game.tactic.formation = tentative.formation;
    game.tactic = applyStarterMentalities(game.tactic);
    saveLocal(true);
    renderTactics();
  });
  $('autoPickBtn').addEventListener('click', () => {
    game.tactic.formation = $('formation').value;
    const starters = autoSelectStarters(game.selectedClubId, game.tactic).map(p=>p.id);
    game.tactic.starters = starters;
    game.tactic.bench = autoSelectBench(game.selectedClubId, starters).map(p=>p.id);
    game.tactic.autoSubs = defaultAutoSubs(game.tactic.starters, game.tactic.bench);
    game.tactic = applyStarterMentalities(game.tactic);
    saveLocal(true);
    renderTactics();
  });
  $('saveTactic').addEventListener('click', saveTacticFromScreen);
}
function tacticPlayerRow(p){
  const current = game.tactic.starters.includes(p.id) ? 'starter' : game.tactic.bench.includes(p.id) ? 'bench' : 'reserve';
  const unavailable = isUnavailable(p.id);
  const mentalityText = current === 'starter' ? playerMentality(p.id) : '—';
  return `<tr class="${unavailable ? 'dim-row' : ''}">
    <td><button class="linklike" data-player-id="${p.id}"><strong>${escapeHtml(p.name)}</strong></button></td>
    <td>#${jerseyNumber(p.id)}</td>
    <td><span class="pill role-pill">${roleBadge(p.position)}</span></td>
    <td><strong>${visibleOverall(p)}</strong></td>
    <td>${currentCondition(p.id)}/99</td>
    <td><span class="${unavailable ? 'bad' : 'ok'}">${escapeHtml(statusText(p.id))}</span></td>
    <td><select class="role-select" data-role-player="${p.id}" ${unavailable ? 'disabled' : ''}>
      <option value="reserve" ${current==='reserve'?'selected':''}>Reserva</option>
      <option value="starter" ${current==='starter'?'selected':''}>Titular</option>
      <option value="bench" ${current==='bench'?'selected':''}>Suplente</option>
    </select></td>
    <td>${current === 'starter' ? mentalityMarker(mentalityText) + ' ' + escapeHtml(mentalityText) : '<span class="muted">Sólo titulares</span>'}</td>
  </tr>`;
}
function autoSubRow(index){
  const rule = game.tactic.autoSubs[index] || { outId:0, inId:0, trigger:'tired' };
  const starterOpts = [`<option value="0">Sin cambio</option>`].concat(game.tactic.starters.map(id=>{
    const p = playerById(id);
    return `<option value="${id}" ${Number(rule.outId)===id?'selected':''}>${escapeHtml(p?.name || 'Jugador')} (${p?.position || ''})</option>`;
  })).join('');
  const benchOpts = [`<option value="0">Sin jugador</option>`].concat(game.tactic.bench.map(id=>{
    const p = playerById(id);
    return `<option value="${id}" ${Number(rule.inId)===id?'selected':''}>${escapeHtml(p?.name || 'Jugador')} (${p?.position || ''})</option>`;
  })).join('');
  const triggerOpts = SUB_TRIGGERS.map(t=>`<option value="${t.value}" ${rule.trigger===t.value?'selected':''}>${t.label}</option>`).join('');
  return `<div class="autosub-row">
    <span class="rank-num">${index+1}</span>
    <div><label>Sale</label><select data-sub-out="${index}">${starterOpts}</select></div>
    <div><label>Entra</label><select data-sub-in="${index}">${benchOpts}</select></div>
    <div><label>Condición</label><select data-sub-trigger="${index}">${triggerOpts}</select></div>
  </div>`;
}
function saveTacticFromScreen(){
  const autoSubs = [0,1,2,3,4].map(i => ({
    outId: Number(document.querySelector(`[data-sub-out="${i}"]`)?.value || 0),
    inId: Number(document.querySelector(`[data-sub-in="${i}"]`)?.value || 0),
    trigger: document.querySelector(`[data-sub-trigger="${i}"]`)?.value || 'tired'
  }));
  const nextTactic = applyStarterMentalities({
    formation:$('formation')?.value || game.tactic.formation,
    starters:game.tactic.starters.slice(0,11),
    bench:game.tactic.bench.slice(0,10),
    autoSubs,
    playerMentalities:{ ...(game.tactic.playerMentalities || {}) }
  });
  const errors = validateTactic(nextTactic);
  if(errors.length){
    $('tacticErrors').textContent = errors.join(' ');
    showNotice('La táctica no se guardó. Corregí titulares, suplentes o jugadores no disponibles.');
    return;
  }
  game.tactic = nextTactic;
  game.mustReviewTactics = false;
  game.lastOwnProblems = [];
  saveLocal(true);
  showNotice('Táctica guardada. Ya podés avanzar cuando termine el bloqueo.');
  renderAll();
}
function validateCurrentTactic(showErrors=true){
  const errors = validateTactic(game.tactic);
  if(showErrors && errors.length) showNotice(errors.join(' '));
  return errors;
}
function validateTactic(tactic){
  const errors = [];
  const uniqueStarters = new Set(tactic.starters || []);
  const uniqueBench = new Set(tactic.bench || []);
  if(uniqueStarters.size !== 11) errors.push('Necesitás exactamente 11 titulares.');
  if(uniqueBench.size !== 10) errors.push('Necesitás exactamente 10 suplentes.');
  const duplicated = [...uniqueStarters].filter(id => uniqueBench.has(id));
  if(duplicated.length) errors.push('Un jugador no puede ser titular y suplente a la vez.');
  const unavailable = [...uniqueStarters, ...uniqueBench].filter(id => isUnavailable(id));
  if(unavailable.length) errors.push('Hay lesionados o suspendidos en la convocatoria.');
  (tactic.autoSubs || []).forEach((rule, i)=>{
    if(rule.outId || rule.inId){
      if(!uniqueStarters.has(Number(rule.outId))) errors.push(`Cambio ${i+1}: el jugador que sale debe ser titular.`);
      if(!uniqueBench.has(Number(rule.inId))) errors.push(`Cambio ${i+1}: el jugador que entra debe ser suplente.`);
      if(Number(rule.outId) === Number(rule.inId)) errors.push(`Cambio ${i+1}: entrada y salida no pueden ser el mismo jugador.`);
    }
  });
  return errors;
}
function positionOrder(pos){
  const order = {POR:1, LD:2, DFC:3, LI:4, MCD:5, MC:6, VOL:7, MCO:8, ED:9, EI:10, EXT:11, DC:12};
  return order[pos] || 99;
}

function renderFixture(){
  const html = game.fixtures.map(round=>`
    <div class="card">
      <div class="row"><h3>Jornada ${round.matchday}</h3><span class="pill">${round.date}</span></div>
      <div class="grid cols-2">${round.matches.map(matchCard).join('')}</div>
    </div>`).join('');
  view.innerHTML = `<div class="section-title"><h2>Calendario</h2><p class="tagline">Los partidos jugados son clickeables para ver estadísticas y eventos.</p></div><div class="stack">${html}</div>`;
}
function matchCard(m){
  const events = game.matchHistory.find(x=>x.id===m.id);
  const clickable = m.played ? 'clickable' : '';
  const attr = m.played ? `data-match-id="${escapeHtml(m.id)}"` : '';
  return `<button class="match-card ${clickable}" ${attr}>
    <div class="match-line">
      <div>${clubSpan(m.homeId)}</div>
      <strong class="score">${m.played ? `${m.homeGoals} - ${m.awayGoals}` : 'vs'}</strong>
      <div>${clubSpan(m.awayId)}</div>
    </div>
    ${events ? `<div class="events">${events.goals.slice(0,4).map(g=>`${g.minute}' ${escapeHtml(playerById(g.playerId)?.name || 'Jugador')}`).join(' · ')}${events.goals.length>4?' · ...':''}</div>` : ''}
  </button>`;
}
function renderStandings(){
  const rows = sortedStandings().map((s,i)=>`
    <tr class="${s.clubId===game.selectedClubId ? 'own-club-row' : ''}">
      <td><strong>${i+1}</strong></td><td>${clubLink(s.clubId)}</td><td>${s.pj}</td><td>${s.pg}</td><td>${s.pe}</td><td>${s.pp}</td><td>${s.gf}</td><td>${s.gc}</td><td>${s.dg}</td><td><strong>${s.pts}</strong></td>
    </tr>`).join('');
  view.innerHTML = `<div class="section-title"><h2>Tabla de posiciones</h2></div><div class="table-wrap"><table><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th><th>PTS</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function renderStats(){
  const stats = Object.values(game.playerStats);
  const scorers = stats.filter(s=>s.goals>0).sort((a,b)=>b.goals-a.goals).slice(0,20);
  const assists = stats.filter(s=>s.assists>0).sort((a,b)=>b.assists-a.assists).slice(0,20);
  const cards = stats.filter(s=>s.yellow>0 || s.red>0).sort((a,b)=>(b.red*3+b.yellow)-(a.red*3+a.yellow)).slice(0,20);
  const injuries = stats.filter(s=>s.injuries>0).sort((a,b)=>b.injuries-a.injuries).slice(0,20);
  view.innerHTML = `
    <div class="section-title"><h2>Estadísticas</h2></div>
    <div class="grid cols-4">
      <div class="card"><h3>Goleadores</h3>${rankList(scorers,'goals')}</div>
      <div class="card"><h3>Asistidores</h3>${rankList(assists,'assists')}</div>
      <div class="card"><h3>Tarjetas</h3>${cardList(cards)}</div>
      <div class="card"><h3>Lesiones</h3>${rankList(injuries,'injuries')}</div>
    </div>
  `;
}
function rankList(list,key){
  if(!list.length) return '<p class="muted">Sin datos todavía.</p>';
  return list.map((s,i)=>{ const p=playerById(s.playerId); return `<div class="stat-rank ${s.clubId===game.selectedClubId ? 'own-player-rank' : ''}"><span><span class="rank-num">${i+1}</span><button class="linklike" data-player-id="${s.playerId}">${escapeHtml(p?.name||'Jugador')}</button> <span class="pill ${s.clubId===game.selectedClubId ? 'club-pill-own' : ''}">${escapeHtml(clubShort(s.clubId))}</span></span><strong>${s[key]}</strong></div>`; }).join('');
}
function cardList(list){
  if(!list.length) return '<p class="muted">Sin tarjetas todavía.</p>';
  return list.map((s,i)=>{ const p=playerById(s.playerId); return `<div class="stat-rank ${s.clubId===game.selectedClubId ? 'own-player-rank' : ''}"><span><span class="rank-num">${i+1}</span><button class="linklike" data-player-id="${s.playerId}">${escapeHtml(p?.name||'Jugador')}</button> <span class="pill ${s.clubId===game.selectedClubId ? 'club-pill-own' : ''}">${escapeHtml(clubShort(s.clubId))}</span></span><strong><span class="yellow-card">■</span> ${s.yellow} / <span class="red-card">■</span> ${s.red}</strong></div>`; }).join('');
}
function sortedStandings(){
  if(!game) return [];
  return Object.values(game.standings).sort((a,b)=> b.pts-a.pts || b.dg-a.dg || b.gf-a.gf || clubName(a.clubId).localeCompare(clubName(b.clubId)) );
}

function selectLineup(clubId, tactic){
  if(clubId === game?.selectedClubId && tactic?.starters?.length === 11){
    return tactic.starters.map(playerById).filter(Boolean);
  }
  return autoSelectStarters(clubId, tactic);
}
function autoSelectStarters(clubId, tactic){
  const squad = playersByClub(clubId).filter(p => clubId !== game?.selectedClubId || !isUnavailable(p.id));
  const used = new Set();
  const slots = FORMATIONS[tactic?.formation] || FORMATIONS['4-4-2'];
  const lineup = [];
  for(const slot of slots){
    const p = bestPlayerForSlot(squad, slot, used);
    if(p){ used.add(p.id); lineup.push(p); }
  }
  return lineup;
}
function autoSelectBench(clubId, starterIds){
  const starters = new Set(starterIds);
  return playersByClub(clubId)
    .filter(p => !starters.has(p.id) && !isUnavailable(p.id))
    .sort((a,b)=>effectiveOverall(b)-effectiveOverall(a))
    .slice(0,10);
}
function defaultAutoSubs(starters, bench){
  return [0,1,2,3,4].map(i => ({ outId: starters[10-i] || 0, inId: bench[i] || 0, trigger: i === 0 ? 'tired' : i === 1 ? 'losing' : i === 2 ? 'winning' : 'drawing' }));
}
function bestPlayerForSlot(squad, slot, used){
  const compatibility = (p) => {
    if(p.position === slot) return 14;
    const groups = { POR:['POR'], DEF:['LD','LI','DFC'], MID:['MCD','MC','MCO','VOL'], WING:['ED','EI','EXT'], ATT:['DC'] };
    const groupOf = pos => Object.keys(groups).find(k=>groups[k].includes(pos));
    return groupOf(p.position) === groupOf(slot) ? 5 : -8;
  };
  return squad.filter(p=>!used.has(p.id)).sort((a,b)=>(effectiveOverall(b)+compatibility(b))-(effectiveOverall(a)+compatibility(a)))[0];
}
function teamPower(clubId, tactic){
  const formation = tactic?.formation || '4-4-2';
  const lineup = selectLineup(clubId, tactic);
  const slots = FORMATIONS[formation] || FORMATIONS['4-4-2'];
  const assigned = lineup.map((player, i) => ({ player, slot:slots[i] || player.position, factor:zoneFactor(player, slots[i] || player.position) }));
  const bySlotGroup = (group) => assigned.filter(a => slotGroup(a.slot) === group);
  const ms = (a, skill) => matchSkill(a.player, skill) * a.factor;
  const defs = bySlotGroup('def');
  const mids = bySlotGroup('mid');
  const atts = bySlotGroup('att');
  const gk = assigned.find(a => a.slot === 'POR');
  let defense = avg(defs.map(a=> avg([ms(a,'marca'),ms(a,'entradas'),ms(a,'posicionamiento'),ms(a,'fuerza')])));
  let midfield = avg(mids.map(a=> avg([ms(a,'paseCorto'),ms(a,'vision'),ms(a,'tecnica'),ms(a,'trabajoEquipo')])));
  let attack = avg(atts.map(a=> avg([ms(a,'remate'),ms(a,'regate'),ms(a,'velocidad'),ms(a,'serenidad')])));
  let discipline = avg(lineup.map(p=>p.skills.disciplina));
  let stamina = avg(lineup.map(p=>matchSkill(p,'resistencia')));
  let aggression = avg(lineup.map(p=>hiddenStats(p).aggression));
  let keeper = gk ? avg([ms(gk,'porteria'),ms(gk,'posicionamiento'),ms(gk,'serenidad')]) : 40;
  const rep = seed.clubs.find(c=>c.id===clubId).reputation;
  const adjust = applyMentalityBonus(tactic || DEFAULT_TACTIC, assigned);
  return { clubId, lineup, assigned, defense:defense+adjust.defense, midfield:midfield+adjust.midfield, attack:attack+adjust.attack, discipline, stamina, aggression, keeper, reputation:rep };
}
function applyMentalityBonus(tactic, assigned){
  const bonus = { attack:0, midfield:0, defense:0 };
  (assigned || []).forEach(entry => {
    const player = entry.player || entry;
    const group = entry.slot ? slotGroup(entry.slot) : playerGroup(player.position);
    const mode = tactic?.playerMentalities?.[player.id] || 'posicional';
    const fitFactor = entry.factor ?? 1;
    if(mode === 'ataque'){
      bonus.attack += (group === 'att' ? 2.4 : 1.2) * fitFactor;
      bonus.midfield += group === 'mid' ? 0.5 * fitFactor : 0;
      bonus.defense -= group === 'def' ? 1.2 : 0.6;
    }
    if(mode === 'defensiva'){
      bonus.defense += (group === 'def' || group === 'gk' ? 2.4 : 1.2) * fitFactor;
      bonus.midfield += group === 'mid' ? 0.5 * fitFactor : 0;
      bonus.attack -= group === 'att' ? 1.1 : 0.4;
    }
    if(mode === 'posicional'){
      bonus.midfield += 0.9 * fitFactor;
      bonus.defense += 0.2 * fitFactor;
      bonus.attack += 0.2 * fitFactor;
    }
  });
  return bonus;
}

function simulateNextMatchday(){
  if(!game || game.matchdayIndex >= game.fixtures.length) return;
  if((game.advanceLockedUntil || 0) > Date.now()){ showNotice(`Tenés que esperar ${formatClock(game.advanceLockedUntil - Date.now())} para avanzar.`); return; }
  if(game.mustReviewTactics){ showNotice('Revisá la táctica: hay lesionados o suspendidos propios que deben ser reemplazados.'); return; }
  const errors = validateCurrentTactic(false);
  if(errors.length){ showNotice(errors.join(' ')); return; }
  const round = game.fixtures[game.matchdayIndex];
  const results = round.matches.map(match => simulateMatch(match));
  round.matches.forEach((m,i)=>Object.assign(m, { played:true, homeGoals:results[i].homeGoals, awayGoals:results[i].awayGoals }));
  game.matchHistory.push(...results);
  const ownResult = results.find(m => m.homeId === game.selectedClubId || m.awayId === game.selectedClubId);
  applyConditionUpdates(results);
  if(ownResult) applyEconomyResult(ownResult);
  game.lastOwnProblems = collectOwnProblems(ownResult);
  game.mustReviewTactics = game.lastOwnProblems.length > 0;
  game.matchdayIndex += 1;
  game.currentDate = game.fixtures[game.matchdayIndex]?.date || round.date;
  game.advanceLockedUntil = Date.now() + ADVANCE_LOCK_MS;
  activeTab = 'home';
  saveLocal(true);
  renderAll();
  if(game.mustReviewTactics){ showNotice('Jornada simulada. Hay lesionados o expulsados propios: revisá la táctica antes de avanzar.', true); }
  else { showNotice(`Jornada ${round.matchday} simulada. Avance bloqueado por 2 minutos.`); }
}
function applyEconomyResult(match){
  const isHome = match.homeId === game.selectedClubId;
  const gf = isHome ? match.homeGoals : match.awayGoals;
  const gc = isHome ? match.awayGoals : match.homeGoals;
  let delta = 0;
  if(gf > gc) delta = Math.round(rnd(300000, 500000));
  else if(gf === gc) delta = Math.round(rnd(100000, 200000));
  else delta = Math.round(rnd(-100000, 50000));
  game.lastBudgetDelta = delta;
  game.budget = Math.max(0, Math.round((game.budget || 0) + delta));
  game.budgetHistory = game.budgetHistory || [];
  game.budgetHistory.push({ matchId: match.id, delta, budget: game.budget });
}
function applyConditionUpdates(results){
  if(!game.playerCondition) game.playerCondition = {};
  seed.players.forEach(player => {
    if(!Number.isFinite(game.playerCondition[player.id])) game.playerCondition[player.id] = 99;
  });
  const played = new Set();
  results.forEach(match => {
    (match.playedIdsHome || []).forEach(id => played.add(id));
    (match.playedIdsAway || []).forEach(id => played.add(id));
  });
  seed.players.forEach(player => {
    let next = currentCondition(player.id);
    next += rnd(12,18);
    if(played.has(player.id)) next -= conditionLossForPlayer(player);
    else next += rnd(8,10);
    game.playerCondition[player.id] = clamp(Math.round(next), 0, 99);
  });
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
  const matchStats = makeMatchStats(home, away);
  const matchContext = makeMatchContext(match, home, away);
  const homeLambda = expectedGoals(home, away, true, matchStats.home.chances);
  const awayLambda = expectedGoals(away, home, false, matchStats.away.chances);
  const homeGoals = Math.min(poisson(homeLambda), Math.max(0, matchStats.home.chances));
  const awayGoals = Math.min(poisson(awayLambda), Math.max(0, matchStats.away.chances));
  const goals = [];
  for(let i=0;i<homeGoals;i++) goals.push(makeGoal(match.homeId, home.lineup));
  for(let i=0;i<awayGoals;i++) goals.push(makeGoal(match.awayId, away.lineup));
  goals.sort((a,b)=>a.minute-b.minute);
  const cards = [...makeCards(match.homeId, home, matchStats.home.fouls), ...makeCards(match.awayId, away, matchStats.away.fouls)].sort((a,b)=>a.minute-b.minute);
  const injuries = [...makeInjuries(match.homeId, home, away), ...makeInjuries(match.awayId, away, home)].sort((a,b)=>a.minute-b.minute);
  const substitutions = [
    ...makeSubstitutions(match.homeId, getTacticForClub(match.homeId), goals),
    ...makeSubstitutions(match.awayId, getTacticForClub(match.awayId), goals)
  ].sort((a,b)=>a.minute-b.minute);
  applyResultToTables(match, homeGoals, awayGoals);
  applyPlayerStats(match.homeId, home.lineup, substitutions, goals, cards, injuries);
  applyPlayerStats(match.awayId, away.lineup, substitutions, goals, cards, injuries);
  applyAvailability(cards, injuries);
  const playedIdsHome = [...new Set(home.lineup.map(p=>p.id).concat(substitutions.filter(s=>s.clubId===match.homeId).map(s=>s.inId)))];
  const playedIdsAway = [...new Set(away.lineup.map(p=>p.id).concat(substitutions.filter(s=>s.clubId===match.awayId).map(s=>s.inId)))];
  return { ...match, played:true, homeGoals, awayGoals, goals, cards, injuries, substitutions, matchStats, matchContext, playedIdsHome, playedIdsAway };
}
function expectedGoals(attacking, defending, isHome, chances){
  const attackEdge = (attacking.attack - defending.defense) / 34;
  const midfieldEdge = (attacking.midfield - defending.midfield) / 70;
  const keeperEdge = (70 - defending.keeper) / 85;
  const repEdge = (attacking.reputation - defending.reputation) / 95;
  const home = isHome ? 0.22 : 0;
  const chanceFactor = (chances - 5) / 10;
  return clamp(1.02 + attackEdge + midfieldEdge + keeperEdge + repEdge + home + chanceFactor + rnd(-0.12,0.12), 0.12, 3.8);
}
function makeMatchStats(home, away){
  const totalMid = Math.max(1, home.midfield + away.midfield);
  const homePoss = clamp(Math.round((home.midfield / totalMid) * 100 + rnd(-5,5) + 2), 32, 68);
  const awayPoss = 100 - homePoss;
  const homeAttacks = clamp(Math.round(29 + home.attack/2.8 + home.midfield/5 - away.defense/6 + rnd(-6,7)), 18, 68);
  const awayAttacks = clamp(Math.round(27 + away.attack/2.8 + away.midfield/5 - home.defense/6 + rnd(-6,7)), 18, 68);
  const homeChances = clamp(Math.round(homeAttacks * rnd(0.12,0.23) + (home.attack-away.defense)/17), 1, 14);
  const awayChances = clamp(Math.round(awayAttacks * rnd(0.12,0.23) + (away.attack-home.defense)/17), 1, 14);
  const homeFouls = clamp(Math.round(7 + home.aggression/11 + (100-home.discipline)/16 + rnd(-3,4)), 4, 27);
  const awayFouls = clamp(Math.round(7 + away.aggression/11 + (100-away.discipline)/16 + rnd(-3,4)), 4, 27);
  return {
    home: { attacks:homeAttacks, chances:homeChances, possession:homePoss, fouls:homeFouls },
    away: { attacks:awayAttacks, chances:awayChances, possession:awayPoss, fouls:awayFouls }
  };
}
function makeMatchContext(match, home, away){
  const weatherOptions = ['Soleado', 'Nublado', 'Lluvia leve', 'Lluvia intensa', 'Viento moderado', 'Calor húmedo'];
  const pitchOptions = ['Muy bueno', 'Bueno', 'Regular', 'Pesado', 'Rápido', 'Irregular'];
  const weather = weatherOptions[hashNumber(`${match.id}-weather-${game?.matchdayIndex || 0}`, weatherOptions.length)];
  const pitch = pitchOptions[hashNumber(`${match.id}-pitch-${game?.matchdayIndex || 0}`, pitchOptions.length)];
  const homeClub = seed.clubs.find(c=>c.id===match.homeId);
  const awayClub = seed.clubs.find(c=>c.id===match.awayId);
  const homeFans = Math.max(800, Math.round((homeClub?.reputation || 60) * rnd(210,360)));
  const awayFans = Math.max(120, Math.round((awayClub?.reputation || 60) * rnd(18,70)));
  return { weather, pitch, homeFans, awayFans };
}
function poisson(lambda){
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return clamp(k - 1, 0, 7);
}
function weightedPick(items, weightFn){
  const safeItems = items.filter(Boolean);
  const weighted = safeItems.map(item=>({item, w:Math.max(1, weightFn(item))}));
  const total = weighted.reduce((a,x)=>a+x.w,0);
  let r = Math.random()*total;
  for(const x of weighted){ r -= x.w; if(r<=0) return x.item; }
  return weighted[0]?.item;
}
function makeGoal(clubId, lineup){
  const scorer = weightedPick(lineup, p => {
    const posBonus = p.position === 'DC' ? 45 : ['ED','EI','EXT','MCO'].includes(p.position) ? 28 : ['MC','MCD','VOL'].includes(p.position) ? 10 : 3;
    return effectiveSkill(p,'remate') + effectiveSkill(p,'posicionamiento') + posBonus;
  });
  const possibleAssisters = lineup.filter(p=>p.id !== scorer.id);
  const hasAssist = Math.random() < 0.72;
  const assister = hasAssist ? weightedPick(possibleAssisters, p => effectiveSkill(p,'paseCorto') + effectiveSkill(p,'vision') + (['ED','EI','EXT','MCO','MC'].includes(p.position)?25:5)) : null;
  return { clubId, playerId:scorer.id, assistId:assister?.id || null, minute: Math.floor(rnd(2,91)) };
}
function makeCards(clubId, power, fouls){
  const cards = [];
  const yellowCount = clamp(poisson(fouls / 7.2), 0, 6);
  const byPlayer = new Map();
  for(let i=0;i<yellowCount;i++){
    const p = weightedPick(power.lineup, x => hiddenStats(x).aggression + (['DFC','MCD','LD','LI'].includes(x.position)?16:4));
    if(!p) continue;
    const current = byPlayer.get(p.id) || 0;
    byPlayer.set(p.id, current + 1);
    if(current === 0) cards.push({ clubId, playerId:p.id, type:'yellow', minute:Math.floor(rnd(5,88)) });
    else cards.push({ clubId, playerId:p.id, type:'secondYellowRed', minute:Math.floor(rnd(35,90)) });
  }
  const directRedCandidates = power.lineup.filter(p => hiddenStats(p).aggression >= 74);
  const directChance = clamp((power.aggression - 58) / 190, 0.01, 0.23);
  if(directRedCandidates.length && Math.random() < directChance){
    const p = weightedPick(directRedCandidates, x => hiddenStats(x).aggression + (['DFC','MCD'].includes(x.position)?18:4));
    cards.push({ clubId, playerId:p.id, type:'red', minute:Math.floor(rnd(20,90)) });
  }
  return cards.sort((a,b)=>a.minute-b.minute);
}
function makeInjuries(clubId, ownPower, rivalPower){
  const injuries = [];
  const baseChance = clamp(0.015 + (rivalPower.aggression - 50) / 900 + (68 - ownPower.stamina) / 850, 0.01, 0.18);
  if(Math.random() < baseChance){
    const p = weightedPick(ownPower.lineup, x => (100 - hiddenStats(x).genetics) + (100 - effectiveSkill(x,'resistencia'))/2 + 10);
    if(p){
      const severity = Math.random() < 0.16 ? 'grave' : Math.random() < 0.48 ? 'media' : 'leve';
      const matchesOut = severity === 'grave' ? Math.floor(rnd(3,6)) : severity === 'media' ? Math.floor(rnd(2,4)) : 1;
      injuries.push({ clubId, playerId:p.id, type:'injury', severity, matchesOut, minute:Math.floor(rnd(12,90)) });
    }
  }
  return injuries;
}
function makeSubstitutions(clubId, tactic, goals){
  if(clubId !== game.selectedClubId || !tactic?.autoSubs?.length) return [];
  const events = [];
  const onPitch = new Set((tactic.starters || []).map(Number));
  const alreadyIn = new Set();
  for(const rule of tactic.autoSubs){
    const outId = Number(rule.outId || 0);
    const inId = Number(rule.inId || 0);
    if(!outId || !inId || !onPitch.has(outId) || alreadyIn.has(inId)) continue;
    const minute = Math.random() < 0.10 ? 45 : Math.floor(rnd(60,91));
    const score = scoreAtMinute(goals, minute, clubId);
    const outPlayer = playerById(outId);
    let execute = false;
    if(rule.trigger === 'tired') execute = currentCondition(outId) < 68 || effectiveSkill(outPlayer,'resistencia') < 72 || minute >= 75 || Math.random() < 0.35;
    if(rule.trigger === 'winning') execute = score.gf > score.gc;
    if(rule.trigger === 'losing') execute = score.gf < score.gc;
    if(rule.trigger === 'drawing') execute = score.gf === score.gc;
    if(execute){
      onPitch.delete(outId);
      onPitch.add(inId);
      alreadyIn.add(inId);
      events.push({ clubId, outId, inId, minute, trigger:rule.trigger });
    }
  }
  return events.slice(0,5);
}
function scoreAtMinute(goals, minute, clubId){
  let gf = 0, gc = 0;
  goals.filter(g => g.minute <= minute).forEach(g => { if(g.clubId === clubId) gf++; else gc++; });
  return { gf, gc };
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
function applyPlayerStats(clubId, lineup, substitutions, goals, cards, injuries){
  const playedIds = new Set(lineup.map(p => p.id));
  substitutions.filter(s => s.clubId === clubId).forEach(s => playedIds.add(s.inId));
  playedIds.forEach(id => { if(game.playerStats[id]) game.playerStats[id].played++; });
  goals.filter(g=>g.clubId===clubId).forEach(g=>{
    game.playerStats[g.playerId].goals++;
    if(g.assistId) game.playerStats[g.assistId].assists++;
  });
  cards.filter(c=>c.clubId===clubId).forEach(c=>{
    if(c.type === 'yellow') game.playerStats[c.playerId].yellow++;
    if(c.type === 'secondYellowRed') { game.playerStats[c.playerId].yellow++; game.playerStats[c.playerId].red++; }
    if(c.type === 'red') game.playerStats[c.playerId].red++;
  });
  injuries.filter(i=>i.clubId===clubId).forEach(i=>{
    if(game.playerStats[i.playerId]) game.playerStats[i.playerId].injuries++;
  });
}
function applyAvailability(cards, injuries){
  cards.forEach(c => {
    if(c.type === 'red' || c.type === 'secondYellowRed'){
      game.playerStatus[c.playerId] = { ...playerStatus(c.playerId), suspendedThrough: game.matchdayIndex + 1 };
    }
  });
  injuries.forEach(i => {
    const label = i.severity === 'grave' ? 'grave' : i.severity === 'media' ? 'media' : 'leve';
    game.playerStatus[i.playerId] = { ...playerStatus(i.playerId), injuredThrough: game.matchdayIndex + i.matchesOut, injuryLabel: label };
  });
}
function collectOwnProblems(result){
  if(!result) return [];
  const ownClub = game.selectedClubId;
  const injuries = (result.injuries || []).filter(i => i.clubId === ownClub).map(i => ({ type:'injury', playerId:i.playerId }));
  const reds = (result.cards || []).filter(c => c.clubId === ownClub && (c.type === 'red' || c.type === 'secondYellowRed')).map(c => ({ type:'red', playerId:c.playerId }));
  return [...injuries, ...reds];
}

function showPlayerModal(playerId){
  const p = playerById(playerId);
  if(!p) return;
  const visible = visibleStats(p);
  const stats = game?.playerStats?.[p.id];
  const meta = roleMeta(p.position);
  const body = `
    <div class="player-modal-grid">
      <div>
        <div class="player-identity-card">
          ${faceImg(p, 'player-photo-placeholder large')}
          <div>
            <p class="label">${escapeHtml(clubName(p.clubId))} · #${jerseyNumber(p.id)}</p>
            <h2>${escapeHtml(p.name)}</h2>
            <p class="muted">${countryFlag(p.nationality)} ${escapeHtml(p.nationality)} · ${meta.icon} ${escapeHtml(meta.code)} · ${escapeHtml(meta.name)}</p>
            <p class="muted">${p.age} años · ${escapeHtml(statusText(p.id))}</p>
          </div>
        </div>
        <div class="radar-wrap">${radarSvg(visible)}</div>
      </div>
      <div class="stack">
        <div class="card inner"><h3>Stats visibles</h3>${statPairs(visible)}</div>
        <div class="card inner"><h3>Perfil</h3>
          <div class="stat-rank"><span>Media</span><strong>${visibleOverall(p)}</strong></div>
          <div class="stat-rank"><span>Estado físico</span><strong>${currentCondition(p.id)}/99</strong></div>
          <div class="stat-rank"><span>Valor</span><strong>${formatMoney(p.value)}</strong></div>
          <div class="stat-rank"><span>Salario</span><strong>${formatMoney(p.salary || 0)}</strong></div>
        </div>
        <div class="card inner"><h3>Temporada</h3>
          <div class="stat-rank"><span>Partidos</span><strong>${stats?.played || 0}</strong></div>
          <div class="stat-rank"><span>Goles</span><strong>${stats?.goals || 0}</strong></div>
          <div class="stat-rank"><span>Asistencias</span><strong>${stats?.assists || 0}</strong></div>
          <div class="stat-rank"><span>Tarjetas</span><strong><span class="yellow-card">■</span> ${stats?.yellow || 0} / <span class="red-card">■</span> ${stats?.red || 0}</strong></div>
        </div>
      </div>
    </div>`;
  openModal(body);
}
function statPairs(obj){
  return Object.entries(obj).map(([k,v])=>`<div class="stat-rank"><span>${escapeHtml(k)}</span><strong>${v}</strong></div>`).join('');
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
function showMatchModal(matchId){
  const match = game.matchHistory.find(m => m.id === matchId);
  if(!match) return;
  const home = clubName(match.homeId);
  const away = clubName(match.awayId);
  const context = match.matchContext || { weather:'No registrado', pitch:'No registrado', homeFans:0, awayFans:0 };
  const body = `
    <div class="match-modal-head">
      <p class="label">Jornada ${match.matchday} · ${match.date}</p>
      <h2>${clubLink(match.homeId)} ${match.homeGoals} - ${match.awayGoals} ${clubLink(match.awayId)}</h2>
    </div>
    <div class="card inner match-context-card">
      <h3>Contexto del partido</h3>
      <div class="grid cols-4">
        <div><p class="label">Clima</p><strong>${escapeHtml(context.weather)}</strong></div>
        <div><p class="label">Campo de juego</p><strong>${escapeHtml(context.pitch)}</strong></div>
        <div><p class="label">Hinchas locales</p><strong>${new Intl.NumberFormat('es-AR').format(context.homeFans || 0)}</strong></div>
        <div><p class="label">Hinchas visitantes</p><strong>${new Intl.NumberFormat('es-AR').format(context.awayFans || 0)}</strong></div>
      </div>
    </div>
    <div class="match-team-columns">
      ${matchStatsCard(match.homeId, match.matchStats.home, 'Local')}
      ${matchStatsCard(match.awayId, match.matchStats.away, 'Visitante')}
    </div>
    <div class="grid cols-2" style="margin-top:14px">
      <div class="card inner"><h3>Goles</h3>${match.goals.length ? match.goals.map(goalLine).join('') : '<p class="muted">Sin goles.</p>'}</div>
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
    <div class="stat-rank"><span>Posesión</span><strong>${stats.possession}%</strong></div>
    <div class="stat-rank"><span>Faltas</span><strong>${stats.fouls}</strong></div>
  </div>`;
}
function goalLine(g){
  const p = playerById(g.playerId);
  const a = g.assistId ? playerById(g.assistId) : null;
  return `<div class="stat-rank"><span>${g.minute}' ${escapeHtml(p?.name || 'Jugador')} <span class="pill">${escapeHtml(clubShort(g.clubId))}</span></span><strong>${a ? `Asist. ${escapeHtml(a.name.split(' ').slice(-1)[0])}` : 'Sin asist.'}</strong></div>`;
}
function cardLine(c){
  const p = playerById(c.playerId);
  const icon = c.type === 'yellow' ? '<span class="yellow-card">■</span>' : c.type === 'secondYellowRed' ? '<span class="yellow-card">■</span><span class="red-card">■</span>' : '<span class="red-card">■</span>';
  const label = c.type === 'yellow' ? 'Amarilla' : c.type === 'secondYellowRed' ? 'Doble amarilla + roja' : 'Roja directa';
  return `<div class="stat-rank"><span>${c.minute}' ${icon} ${escapeHtml(p?.name || 'Jugador')} <span class="pill">${escapeHtml(clubShort(c.clubId))}</span></span><strong>${label}</strong></div>`;
}
function subLine(s){
  const out = playerById(s.outId);
  const inn = playerById(s.inId);
  const label = SUB_TRIGGERS.find(t=>t.value===s.trigger)?.label || s.trigger;
  return `<div class="stat-rank"><span>${s.minute}' ${escapeHtml(inn?.name || 'Jugador')} por ${escapeHtml(out?.name || 'Jugador')}</span><strong>${escapeHtml(label)}</strong></div>`;
}
function injuryLine(i){
  const p = playerById(i.playerId);
  return `<div class="stat-rank"><span>${i.minute}' ${escapeHtml(p?.name || 'Jugador')} <span class="pill">${escapeHtml(clubShort(i.clubId))}</span></span><strong>${escapeHtml(i.severity)} · ${i.matchesOut} fecha(s)</strong></div>`;
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
      <h2><span class="club-dot" style="background:${clubColor(club.id)}"></span>${escapeHtml(club.name)}</h2>
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
        <p class="muted small">En cada nueva jornada se revelan de forma provisoria 2 o 3 habilidades visibles por jugador. Las demás quedan ocultas con guion.</p>
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
function scoutingVisibleKeys(player){
  const keys = Object.keys(scoutingStatMap(player));
  const count = 2 + hashNumber(`scout-count-${player.id}-${game?.matchdayIndex || 0}`, 2);
  const ordered = keys.slice().sort((a,b)=>hashNumber(`scout-${player.id}-${game?.matchdayIndex || 0}-${a}`, 10000) - hashNumber(`scout-${player.id}-${game?.matchdayIndex || 0}-${b}`, 10000));
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
    <td>${countryFlag(player.nationality)} ${escapeHtml(player.nationality)}</td>
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
function openModal(html){
  closeModal();
  const wrapper = document.createElement('div');
  wrapper.id = 'modalRoot';
  wrapper.innerHTML = `<div class="modal-backdrop"><div class="modal-panel"><button class="modal-close" data-close-modal aria-label="Cerrar">×</button>${html}</div></div>`;
  document.body.appendChild(wrapper);
}
function closeModal(){
  const root = $('modalRoot');
  if(root) root.remove();
}

init();
