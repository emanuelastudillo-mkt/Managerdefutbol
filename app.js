const DATA_URL = 'data/seed.json';
const PLAYERS_DATABASE_URL = 'data/jugadores.json';
const SPONSORS_DATABASE_URL = 'data/sponsors.json';
const LEAGUE_DATA_CANDIDATES = ['data/Liga Argentina.json', 'data/Liga argentina.json', 'data/Liga_argentina.json', 'data/liga_argentina.json', 'data/liga-argentina.json'];
const DB_NAME = 'futbol-manager-mvp';
const DB_STORE = 'saves';
const SAVE_KEY = 'main';
const ADVANCE_LOCK_MS = 120000;
const PRESEASON_TURNS = 10;
const POSTSEASON_TURNS = 5;
const MAX_PRESEASON_FRIENDLIES = 5;
const APP_VERSION = 'V2.25';
const TEAM_COHESION_START = 50;
const TEAM_COHESION_MATCH_GAIN = 8;
const TEAM_COHESION_TACTIC_CHANGE_LOSS = 10;
const TEAM_COHESION_PLAYER_CHANGE_LOSS = 2;
const PLAYER_MORALE_START = 60;
const PSYCHOLOGIST_COST = 500000;
const PSYCHOLOGIST_SUCCESS_CHANCE = 0.90;
const PSYCHOLOGIST_COOLDOWN_TURNS = 5;
const KINESIOLOGIST_COST = 1000000;
const KINESIOLOGIST_FAILURE_CHANCE = 0.20;
const INJURED_SUB_MAX_TURNS = 9;
const INJURED_SUB_PENALTY = 0.10;
const DEFAULT_TRAINING_TYPE = 'regenerative';
const TRAINING_OPTIONS = [
  { value:'regenerative', label:'Regenerativo' },
  { value:'massage', label:'Masajista' },
  { value:'intense', label:'Entrenamiento intenso' },
  { value:'tactical', label:'Entrenamiento táctico' },
  { value:'dayoff', label:'Día libre' }
];

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
  { value:'tired', label:'Cambiar a los cansados' },
  { value:'best', label:'Mejores suplentes' },
  { value:'injuryOnly', label:'Solo cambios por lesión' }
];
const INJURY_TABLE = [
  { name:'Distensión', probability:25, minTurns:2, maxTurns:5 },
  { name:'Desgarro', probability:20, minTurns:1, maxTurns:4 },
  { name:'Esguince', probability:15, minTurns:3, maxTurns:8 },
  { name:'Rotura', probability:9, minTurns:6, maxTurns:12 },
  { name:'Fractura', probability:3, minTurns:16, maxTurns:30 },
  { name:'Contusión', probability:28, minTurns:1, maxTurns:2 }
];
const BASE_INJURY_CHANCE = 0.05;
const FATIGUE_INJURY_STEP = 5;
const FATIGUE_INJURY_BONUS = 0.01;
const PITCH_CONDITIONS = {
  'Excelente': { passDelta:10, chanceMultiplier:1.20, fatigueBonus:0, injuryBonus:0 },
  'Normal': { passDelta:0, chanceMultiplier:1.00, fatigueBonus:0, injuryBonus:0 },
  'Regular': { passDelta:-10, chanceMultiplier:0.80, fatigueBonus:0, injuryBonus:0 },
  'Muy malo': { passDelta:-20, chanceMultiplier:0.70, fatigueBonus:10, injuryBonus:0.10 },
  'Injugable': { passDelta:-50, chanceMultiplier:0.50, fatigueBonus:20, injuryBonus:0.30 }
};
const REPLANT_COST = 2000000;
const REPLANT_TURNS = 5;
const PATCH_COST = 200000;
const PATCH_TURNS = 3;
const PATCH_GAIN_PER_TURN = 5;
const MARKET_FREE_AGENT_COUNT = 50;
const SEASON_YOUTH_FREE_AGENT_COUNT = 20;
const RETIREMENT_MIN_AGE = 32;
const RETIREMENT_MAX_AGE = 38;
const SEASON_SALARY_BASE_REDUCTION = 0.05;
const SEASON_SALARY_MATCH_BONUS = 0.01;
const FOREIGN_CLUBS = ['Atlético Lisboa','London Athletic','Milano FC','Paris Nord','Berlin United','Porto Azul','Madrid Imperial','Amsterdam Club','Montevideo City','Santos del Mar'];
const OWN_PLAYER_OFFER_COOLDOWN_TURNS = 3;
const SEASON_END_TRANSFER_OFFERS_MIN = 2;
const SEASON_END_TRANSFER_OFFERS_MAX = 6;
const SPONSOR_OFFER_MATCH_MIN = 4;
const SPONSOR_OFFER_MATCH_MAX = 7;
const SPONSOR_OFFER_COUNT_MIN = 2;
const SPONSOR_OFFER_COUNT_MAX = 5;

const CLUB_ROSTER_SIZE = 25;
const PLAYER_GENERATION_RULES_VERSION = 'V2.23';
const PLAYER_GENERATION_NATIONALITY_GROUPS = [
  { id:'argentinos', probability:0.70, countries:['Argentina'] },
  { id:'sudamerica', probability:0.20, countries:['Brasil','Uruguay','Paraguay','Chile','Bolivia','Perú','Ecuador','Colombia','Venezuela'] },
  { id:'resto_del_mundo', probability:0.10, countries:['España','Italia','Francia','Alemania','Portugal','Inglaterra','México','Estados Unidos','Japón','Corea del Sur','Marruecos','Nigeria','Ghana'] }
];
const PLAYER_GENERATION_POSITION_GROUPS = [
  { id:'POR', probability:0.10, positions:['POR'] },
  { id:'DEF', probability:0.30, positions:['LD','LI','DFC'] },
  { id:'MID', probability:0.30, positions:['MCD','MC','MCO'] },
  { id:'ATT', probability:0.30, positions:['ED','EI','DC'] }
];
const PLAYER_GENERATION_MEDIA_RANGES = [
  { id:'elite_mundial', probability:0.03, media_min:92, media_max:99, salaryMultiplier:3000000 },
  { id:'estrella', probability:0.07, media_min:80, media_max:91, salaryMultiplier:1000000 },
  { id:'titular_competitivo', probability:0.22, media_min:68, media_max:79, salaryMultiplier:300000 },
  { id:'profesional_promedio_bajo', probability:0.50, media_min:43, media_max:67, salaryMultiplier:80000 },
  { id:'bajo_nivel', probability:0.18, media_min:19, media_max:42, salaryMultiplier:10000 }
];
const PLAYER_ECONOMY_SCALE = 0.10;
const PLAYER_ELITE_MAX_PER_CLUB = 3;
const PLAYER_CLAUSE_MIN_MULTIPLIER = 6;
const PLAYER_CLAUSE_AGE_REDUCTION = 10;
const PLAYER_CLAUSE_BASE_BY_DIVISION_ORDER = { 1:500, 2:450, 3:300 };
const FREE_YOUTH_SALARY_FACTOR = 0.55;
const MARKET_FREE_AGENT_SALARY_FACTOR = 0.75;

const DEFAULT_TACTIC = {
  formation:'4-4-2',
  starters:[],
  bench:[],
  autoSubs:[],
  playerMentalities:{},
  matchInstructions:{winning:'normal',drawing:'normal',losing:'normal'}
};

let seed = null;
let sponsorsDatabase = null;
let game = null;
let activeTab = 'home';
let squadSort = 'media_desc';
let trainingSort = 'media_desc';
let worldPlayersSort = 'media_desc';
let worldPlayersPositionFilter = 'all';
let worldPlayersClubFilter = 'all';
let marketSubTab = 'free';
let firstTeamTab = 'tactics';
let selectedFixtureDivision = 'all';
let selectedStandingsDivision = 'all';
let selectedStatsDivision = 'all';
let uiTicker = null;
let matchRevealTimers = [];
let newGameModalShown = false;

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
function clubBadge(id){
  const club = seed.clubs.find(c=>c.id===id) || {};
  const src = club.crestPath || `img/escudos/${imageSlug(club.name || clubName(id))}.png`;
  return `<span class="club-badge-placeholder" data-club-id="${id}" title="${escapeHtml(clubName(id))}"><img src="${escapeHtml(src)}" alt="" onerror="this.style.visibility='hidden'"></span>`;
}
function clubLink(id){ return `<button class="linklike club-link" data-club-id="${id}">${clubBadge(id)}<span>${escapeHtml(clubName(id))}</span></button>`; }
function clubSpan(id){ return `<span class="club-click" data-club-id="${id}">${clubBadge(id)}<span>${escapeHtml(clubName(id))}</span></span>`; }
function clubAbbrev(id){ return clubBadge(id); }
function divisionOptions(selected='all'){
  const divisions = seed?.divisions || [{ id:'default', name:'Liga única' }];
  return [`<option value="all" ${selected==='all'?'selected':''}>Todas las divisiones</option>`]
    .concat(divisions.map(d => `<option value="${escapeHtml(d.id)}" ${selected===d.id?'selected':''}>${escapeHtml(d.name)}</option>`))
    .join('');
}
function divisionFilterMarkup(id, selected){
  return `<div class="division-filter"><label for="${id}">División</label><select id="${id}">${divisionOptions(selected)}</select></div>`;
}
function playerById(id){ return seed.players.find(p => p.id === Number(id)); }
function playersByClub(clubId){ return seed.players.filter(p => p.clubId === clubId); }
function playerStatus(playerId){ return game?.playerStatus?.[playerId] || {}; }
function isUnavailable(playerId){
  if(!game) return false;
  const st = playerStatus(playerId);
  return Boolean((st.injuredThrough !== undefined && game.matchdayIndex <= st.injuredThrough) || (st.suspendedThrough !== undefined && game.matchdayIndex <= st.suspendedThrough));
}
function isSuspended(playerId){
  const st = playerStatus(playerId);
  return Boolean(st.suspendedThrough !== undefined && game && game.matchdayIndex <= st.suspendedThrough);
}
function isInjured(playerId){
  const st = playerStatus(playerId);
  return Boolean(st.injuredThrough !== undefined && game && game.matchdayIndex <= st.injuredThrough);
}
function turnsRemaining(playerId){
  const st = playerStatus(playerId);
  if(st.injuredThrough === undefined || !game || game.matchdayIndex > st.injuredThrough) return 0;
  return Math.max(1, st.injuredThrough - game.matchdayIndex + 1);
}
function canUseInjuredAsSub(playerId){
  return Boolean(game && isInjured(playerId) && !isSuspended(playerId) && turnsRemaining(playerId) <= INJURED_SUB_MAX_TURNS);
}
function canBeStarter(playerId){
  return Boolean(playerId && !isUnavailable(playerId));
}
function canBeBench(playerId){
  if(!playerId) return false;
  if(isSuspended(playerId)) return false;
  if(isInjured(playerId)) return canUseInjuredAsSub(playerId);
  return true;
}
function canEnterMatch(playerId){
  return canBeBench(playerId) || canBeStarter(playerId);
}
function injuredSubPenaltyFactor(playerId){
  return canUseInjuredAsSub(playerId) ? INJURED_SUB_PENALTY : 1;
}
function benchOverallValue(player){
  return Math.round(effectiveOverall(player) * injuredSubPenaltyFactor(player.id));
}

function seasonPhase(){
  return game?.seasonPhase || (game?.seasonFinalized ? 'finalized' : 'regular');
}
function isPreseason(){ return seasonPhase() === 'preseason'; }
function isPostseason(){ return seasonPhase() === 'postseason'; }
function isRegularSeason(){ return seasonPhase() === 'regular'; }
function currentTurnIndex(){ return Number.isFinite(game?.globalTurn) ? game.globalTurn : 0; }
function turnStamp(extra={}){
  return { globalTurn:currentTurnIndex(), season:game?.seasonNumber || 1, phase:seasonPhase(), phaseTurn:game?.phaseTurn || 0, matchdayIndex:game?.matchdayIndex || 0, ...extra };
}
function turnCooldownLeft(last, cooldown){
  if(!last) return 0;
  const lastTurn = Number.isFinite(last.globalTurn) ? last.globalTurn : Number(last.absoluteTurn || last.matchdayIndex || 0);
  return Math.max(0, cooldown - (currentTurnIndex() - lastTurn));
}
function advanceGlobalTurn(){
  if(!game) return;
  game.globalTurn = currentTurnIndex() + 1;
}
function totalSeasonTurnCount(){
  return PRESEASON_TURNS + (game?.fixtures?.length || seed?.fixtures?.length || 0) + POSTSEASON_TURNS;
}
function currentSeasonTurnNumber(){
  if(!game) return 0;
  const regularCount = game.fixtures?.length || seed?.fixtures?.length || 0;
  if(game.seasonFinalized || seasonPhase() === 'finalized') return totalSeasonTurnCount();
  if(isPreseason()) return clamp((game.phaseTurn || 0) + 1, 1, totalSeasonTurnCount());
  if(isPostseason()) return clamp(PRESEASON_TURNS + regularCount + (game.phaseTurn || 0) + 1, 1, totalSeasonTurnCount());
  return clamp(PRESEASON_TURNS + (game.matchdayIndex || 0) + 1, 1, totalSeasonTurnCount());
}
function phaseLabel(){
  if(!game) return '—';
  if(game.seasonFinalized || seasonPhase() === 'finalized') return `Jornada total: ${totalSeasonTurnCount()} / ${totalSeasonTurnCount()} · Temporada finalizada`;
  const total = totalSeasonTurnCount();
  const current = currentSeasonTurnNumber();
  if(isPreseason()) return `Jornada total: ${current} / ${total} · Pretemporada ${Math.min((game.phaseTurn || 0) + 1, PRESEASON_TURNS)} / ${PRESEASON_TURNS}`;
  if(isPostseason()) return `Jornada total: ${current} / ${total} · Postemporada ${Math.min((game.phaseTurn || 0) + 1, POSTSEASON_TURNS)} / ${POSTSEASON_TURNS}`;
  return `Jornada total: ${current} / ${total} · Liga ${Math.min((game.matchdayIndex || 0) + 1, game.fixtures?.length || seed.fixtures.length)} / ${game.fixtures?.length || seed.fixtures.length}`;
}
function preseasonFriendliesPlayed(){ return Number(game?.preseasonFriendliesPlayed || 0); }
function canPlayPreseasonFriendly(){ return isPreseason() && preseasonFriendliesPlayed() < MAX_PRESEASON_FRIENDLIES; }
function statusText(playerId){
  if(!game) return 'Disponible';
  const st = playerStatus(playerId);
  const parts = [];
  if(st.injuredThrough !== undefined && game.matchdayIndex <= st.injuredThrough){
    const subNote = canUseInjuredAsSub(playerId) ? ' · puede ir al banco con penalización' : '';
    parts.push(`Lesionado: ${st.injuryLabel || 'Lesión'}${subNote}`.trim());
  }
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
  const base = Math.round(p.skills?.[skillName] ?? p.overall ?? 50);
  const boost = Number(game?.playerSkillBoosts?.[p.id]?.[skillName] || 0);
  return clamp(base + boost, 1, 99);
}
function rawVisibleSkill(p, skillName){
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
function visibleStats(p, skillResolver=baseSkill){
  const val = (skillName) => skillResolver(p, skillName);
  if(p.position === 'POR'){
    return {
      Salto: Math.round(avg([val('cabezazo'), val('fuerza')])) || p.overall,
      Defensa: Math.round(avg([val('porteria'), val('posicionamiento')])) || p.overall,
      Pase: Math.round(avg([val('paseCorto'), val('paseLargo')])) || p.overall,
      Reflejos: Math.round(avg([val('porteria'), val('serenidad'), val('aceleracion')])) || p.overall,
      Mando: Math.round(avg([val('liderazgo'), val('trabajoEquipo'), val('serenidad')])) || p.overall,
      Potencia: Math.round(avg([val('fuerza'), val('paseLargo')])) || p.overall,
      Resistencia: val('resistencia')
    };
  }
  return {
    Ataque: Math.round(avg([val('remate'), val('regate'), val('posicionamiento')])) || p.overall,
    Defensa: Math.round(avg([val('marca'), val('entradas'), val('posicionamiento')])) || p.overall,
    Pase: Math.round(avg([val('paseCorto'), val('paseLargo'), val('vision')])) || p.overall,
    Velocidad: Math.round(avg([val('velocidad'), val('aceleracion')])) || p.overall,
    Cabezazo: val('cabezazo'),
    Tiro: val('remate'),
    Resistencia: val('resistencia')
  };
}

function visibleOverall(p){
  return clamp(Math.round(avg(Object.values(visibleStats(p)))), 1, 99);
}
function rawVisibleOverall(p){
  return clamp(Math.round(avg(Object.values(visibleStats(p, rawVisibleSkill)))), 1, 99);
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
function fatiguePoints(playerId){
  return clamp(99 - currentCondition(playerId), 0, 99);
}
function injuryChanceForPlayer(playerId, pitchCondition='Normal'){
  const pitch = PITCH_CONDITIONS[pitchCondition] || PITCH_CONDITIONS.Normal;
  return clamp(BASE_INJURY_CHANCE + Math.floor(fatiguePoints(playerId) / FATIGUE_INJURY_STEP) * FATIGUE_INJURY_BONUS + pitch.injuryBonus, 0, 0.65);
}
function tacticStatusIcon(playerId){
  if(isInjured(playerId)) return '<span class="injury-cross" title="Lesionado">✚</span>';
  if(isSuspended(playerId)) return '<span class="red-card status-red-card" title="Expulsado / suspendido">■</span>';
  return '<span class="ok">OK</span>';
}
function availabilityIcons(playerId){
  const icons = [];
  if(isInjured(playerId)) icons.push('<span class="injury-cross inline" title="Lesionado">✚</span>');
  if(isSuspended(playerId)) icons.push('<span class="red-card status-red-card inline" title="Expulsado / suspendido">■</span>');
  return icons.join('');
}
function availabilityStatusMarkup(playerId){
  const unavailable = isUnavailable(playerId);
  const icons = availabilityIcons(playerId);
  if(icons) return `<span class="availability-status ${unavailable ? 'bad' : 'ok'}">${icons}<span>${escapeHtml(statusText(playerId))}</span></span>`;
  return `<span class="${unavailable ? 'bad' : 'ok'}">${escapeHtml(statusText(playerId))}</span>`;
}
function pickInjuryType(){
  const total = INJURY_TABLE.reduce((sum, item) => sum + item.probability, 0);
  let roll = Math.random() * total;
  for(const item of INJURY_TABLE){
    roll -= item.probability;
    if(roll <= 0) return item;
  }
  return INJURY_TABLE[INJURY_TABLE.length - 1];
}
function injuredPlayersByClub(clubId){
  return playersByClub(clubId)
    .map(player => ({ player, status:playerStatus(player.id), remaining:turnsRemaining(player.id) }))
    .filter(item => item.remaining > 0)
    .sort((a,b)=>b.remaining-a.remaining || a.player.name.localeCompare(b.player.name));
}
function injuredHomeCard(item){
  const p = item.player;
  return `<div class="injured-home-player">
    ${faceImg(p, 'injured-home-face')}
    <div class="injured-home-info">
      <button class="linklike" data-player-id="${p.id}">${availabilityIcons(p.id)}${escapeHtml(p.name)}</button>
      <span>${escapeHtml(item.status.injuryLabel || 'Lesión')} · ${item.remaining} turno(s) · Fís. ${currentCondition(p.id)}/99${canUseInjuredAsSub(p.id) ? ' · Banco permitido' : ''}</span>
    </div>
  </div>`;
}
function squadFitnessAverage(clubId){
  const squad = playersByClub(clubId);
  return Math.round(avg(squad.map(p => currentCondition(p.id)))) || 0;
}

function lastOwnMatch(){
  if(!game?.matchHistory?.length) return null;
  return game.matchHistory.filter(m => m.homeId === game.selectedClubId || m.awayId === game.selectedClubId).slice(-1)[0] || null;
}
function mainBannerForLastMatch(){
  const match = lastOwnMatch();
  if(!match){
    return {
      src:'img/principales/banner_bienvenido',
      fallbackSrc:'img/principales/banner_bienvenido.jpg',
      label:'Bienvenido al club'
    };
  }
  const ownId = game.selectedClubId;
  const ownInjuries = (match.injuries || []).filter(i => i.clubId === ownId);
  if(ownInjuries.some(i => Number(i.matchesOut || 0) > 25)){
    return { src:'img/principales/banner_noticia_lesion_grave.jpg', label:'Lesión grave en el último partido' };
  }
  if(ownInjuries.some(i => Number(i.matchesOut || 0) > 10)){
    return { src:'img/principales/banner_noticia_lesion_intermedia.jpg', label:'Lesión intermedia en el último partido' };
  }
  if(ownInjuries.some(i => Number(i.matchesOut || 0) < 5)){
    return { src:'img/principales/banner_noticias_lesion_leve.jpg', label:'Lesión leve en el último partido' };
  }
  if(ownInjuries.length){
    return { src:'img/principales/banner_noticia_lesion_intermedia.jpg', label:'Lesión intermedia en el último partido' };
  }
  const isHome = match.homeId === ownId;
  const gf = isHome ? match.homeGoals : match.awayGoals;
  const gc = isHome ? match.awayGoals : match.homeGoals;
  if(gf > gc) return { src:'img/principales/banner_entrenamiento_triunfo.jpg', label:'Entrenamiento posterior al triunfo' };
  return { src:'img/principales/banner_entrenamiento_normal.jpg', label:'Entrenamiento posterior al empate o derrota' };
}
function mainBannerMarkup(){
  const banner = mainBannerForLastMatch();
  if(!banner){
    return `<div class="main-visual-placeholder"><strong>Inicio de temporada</strong><span>La imagen contextual aparecerá después del primer partido.</span></div>`;
  }
  const fallbackAttr = banner.fallbackSrc ? ` data-fallback-src="${escapeHtml(banner.fallbackSrc)}"` : '';
  const errorHandler = "const fb=this.getAttribute('data-fallback-src');if(fb&&!this.dataset.triedFallback){this.dataset.triedFallback='1';this.src=fb;}else{this.closest('.main-visual-banner').classList.add('is-missing');this.remove();}";
  return `<div class="main-visual-banner"><img src="${escapeHtml(banner.src)}" alt="${escapeHtml(banner.label)}"${fallbackAttr} onerror="${errorHandler}"><span>${escapeHtml(banner.label)}</span></div>`;
}

function injuryRulesTable(){
  return INJURY_TABLE.map(item => `<tr><td>${escapeHtml(item.name)}</td><td>${item.probability}%</td><td>${item.minTurns} a ${item.maxTurns}</td></tr>`).join('');
}
function conditionFactor(playerId){
  return 0.5 + 0.5 * (currentCondition(playerId) / 99);
}
function compactValueCircle(value, kind, label){
  const clean = clamp(Math.round(Number(value) || 0), kind === 'morale' ? 1 : 0, 99);
  const colorClass = clean < 40 ? 'low' : clean < 70 ? 'mid' : 'high';
  const deg = Math.round((clean / 99) * 360);
  return `<span class="value-circle ${kind}-circle ${colorClass}" style="--value-deg:${deg}deg" title="${escapeHtml(label)} ${clean}/99"><strong>${clean}</strong></span>`;
}
function conditionBar(playerId){
  return compactValueCircle(currentCondition(playerId), 'condition', 'Estado físico');
}

function currentMorale(playerId){
  if(!game) return PLAYER_MORALE_START;
  if(!game.playerMorale) game.playerMorale = {};
  if(!Number.isFinite(game.playerMorale[playerId])) game.playerMorale[playerId] = PLAYER_MORALE_START;
  return clamp(Math.round(game.playerMorale[playerId]), 1, 99);
}
function moraleFactor(playerId){
  return 0.92 + (currentMorale(playerId) / 99) * 0.16;
}
function moraleBar(playerId){
  return compactValueCircle(currentMorale(playerId), 'morale', 'Moral');
}
function squadMoraleAverage(clubId){
  const squad = playersByClub(clubId);
  return Math.round(avg(squad.map(p => currentMorale(p.id)))) || 0;
}
function dashboardDonut(label, value, max=100){
  const cleanMax = Math.max(1, Number(max) || 100);
  const cleanValue = clamp(Math.round(Number(value) || 0), 0, cleanMax);
  const deg = Math.round((cleanValue / cleanMax) * 360);
  return `<div class="dashboard-donut-card card">
    <div class="donut-chart" style="--value-deg:${deg}deg" aria-label="${escapeHtml(label)} ${cleanValue} de ${cleanMax}"><span>${cleanValue}</span></div>
    <div><p class="label">${escapeHtml(label)}</p><strong>${cleanValue}/${cleanMax}</strong></div>
  </div>`;
}
function matchSkill(p, skillName){
  return clamp(Math.round(effectiveSkill(p, skillName) * conditionFactor(p.id) * moraleFactor(p.id) * injuredSubPenaltyFactor(p.id)), 1, 99);
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
function countryCode(nationality){
  const map = {
    Argentina:'ARG', Brasil:'BRA', Uruguay:'URU', Paraguay:'PAR', Chile:'CHI', Bolivia:'BOL', 'Perú':'PER', Ecuador:'ECU', Colombia:'COL', Venezuela:'VEN',
    España:'ESP', Italia:'ITA', Francia:'FRA', Alemania:'ALE', Portugal:'POR', Inglaterra:'ING', México:'MEX', 'Estados Unidos':'USA', Japón:'JPN', 'Corea del Sur':'KOR', Marruecos:'MAR', Nigeria:'NGA', Ghana:'GHA'
  };
  return map[nationality] || String(nationality || '---').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z]/g,'').slice(0,3).toUpperCase().padEnd(3,'-');
}
function nationalityShortMarkup(nationality){
  return `<span class="pill nationality-code" title="${escapeHtml(nationality || 'Sin nacionalidad')}">${escapeHtml(countryCode(nationality))}</span>`;
}
function roleMeta(position){
  const map = {
    POR:{ code:'POR', name:'Portero', icon:'', group:'gk' },
    DFC:{ code:'DFC', name:'Defensa central', icon:'', group:'def' },
    LI:{ code:'LI', name:'Lateral izquierdo', icon:'', group:'def' },
    LD:{ code:'LD', name:'Lateral derecho', icon:'', group:'def' },
    MCD:{ code:'MCD', name:'Mediocentro defensivo', icon:'', group:'mid' },
    MC:{ code:'MC', name:'Mediocentro', icon:'', group:'mid' },
    MCO:{ code:'MCO', name:'Mediocentro ofensivo', icon:'', group:'mid' },
    EI:{ code:'EI', name:'Extremo izquierdo', icon:'', group:'att' },
    ED:{ code:'ED', name:'Extremo derecho', icon:'', group:'att' },
    DC:{ code:'DC', name:'Delantero centro', icon:'', group:'att' },
    VOL:{ code:'MC', name:'Mediocentro', icon:'', group:'mid' }
  };
  return map[position] || { code:position, name:position, icon:'', group:'mid' };
}
function roleBadge(position){
  return roleMeta(position).code;
}

function normalizePlayerPosition(position, playerId=0){
  const pos = String(position || '').toUpperCase();
  const aliases = { ARQ:'POR', CAI:'LI', CAD:'LD', MI:'MC', MD:'MC', SD:'DC', VOL:'MC' };
  if(aliases[pos]) return aliases[pos];
  if(pos === 'EXT') return (Number(playerId) || 0) % 2 === 0 ? 'ED' : 'EI';
  const valid = ['POR','LD','LI','DFC','MCD','MC','MCO','ED','EI','DC'];
  return valid.includes(pos) ? pos : 'MC';
}
function normalizeAllPlayerPositions(){
  if(!seed?.players) return;
  seed.players.forEach(player => { player.position = normalizePlayerPosition(player.position, player.id); });
}
function playerRoleGroup(position){
  const pos = normalizePlayerPosition(position);
  if(pos === 'POR') return 'POR';
  if(['LD','LI','DFC'].includes(pos)) return 'DEF';
  if(['MCD','MC','MCO'].includes(pos)) return 'MID';
  return 'ATT';
}

function weightedRulePick(items, seedKey){
  const list = (items || []).filter(item => Number(item.probability) > 0);
  if(!list.length) return (items || [])[0] || null;
  const total = list.reduce((sum,item)=>sum + Number(item.probability || 0), 0);
  let roll = (hashNumber(seedKey, 1000000) / 1000000) * total;
  for(const item of list){
    roll -= Number(item.probability || 0);
    if(roll <= 0) return item;
  }
  return list[list.length - 1];
}
function nationalityGroupId(nationality){
  const nat = String(nationality || '');
  if(nat === 'Argentina') return 'argentinos';
  const south = PLAYER_GENERATION_NATIONALITY_GROUPS.find(g=>g.id==='sudamerica')?.countries || [];
  if(south.includes(nat)) return 'sudamerica';
  return 'resto_del_mundo';
}
function mediaRangeIdForOverall(media){
  const value = Math.round(Number(media) || 0);
  return (PLAYER_GENERATION_MEDIA_RANGES.find(range => value >= range.media_min && value <= range.media_max) || PLAYER_GENERATION_MEDIA_RANGES[PLAYER_GENERATION_MEDIA_RANGES.length - 1]).id;
}
function mediaRangeForOverall(media){
  const value = Math.round(Number(media) || 0);
  return PLAYER_GENERATION_MEDIA_RANGES.find(range => value >= range.media_min && value <= range.media_max) || PLAYER_GENERATION_MEDIA_RANGES[PLAYER_GENERATION_MEDIA_RANGES.length - 1];
}
function createPlayerGenerationContext(targetTotal=0, activePlayers=[]){
  return { targetTotal:Math.max(1, Math.round(Number(targetTotal) || 0)), activePlayers:Array.isArray(activePlayers) ? activePlayers.slice() : [], created:[] };
}
function contextPlayersForGeneration(context){
  if(!context) return [];
  return (context.activePlayers || []).concat(context.created || []).filter(player => player && !player.retired && !player.sold && Number(player.clubId || 0) >= 0);
}
function registerGeneratedPlayer(context, player){
  if(context && player) context.created.push(player);
}
function underTargetRules(rules, selector, context){
  if(!context) return [];
  const players = contextPlayersForGeneration(context);
  const targetTotal = Math.max(players.length + 1, Number(context.targetTotal || 0));
  const counts = {};
  players.forEach(player => { const key = selector(player); counts[key] = (counts[key] || 0) + 1; });
  return rules.filter(rule => (counts[rule.id] || 0) < Math.ceil(targetTotal * Number(rule.probability || 0)));
}
function pickRuleWithAudit(rules, selector, context, seedKey){
  const under = underTargetRules(rules, selector, context);
  if(under.length) return weightedRulePick(under, `${seedKey}-audit`);
  return weightedRulePick(rules, seedKey);
}
function mediaRangeTargetCount(range, targetTotal){
  const total = Math.max(1, Math.round(Number(targetTotal) || 0));
  const raw = total * Number(range.probability || 0);
  if(range.id === 'elite_mundial') return Math.floor(raw);
  return Math.round(raw);
}
function generationDivisionOrder(clubId=0, divisionName=''){
  if(Number(clubId || 0) > 0 && seed?.clubs?.length){
    return Math.round(Number(clubDivision(clubId).order || 3));
  }
  const lower = String(divisionName || '').toLowerCase();
  if(lower.includes('profesional') || lower.includes('primera')) return 1;
  if(lower.includes('nacional') || lower.includes('segunda')) return 2;
  if(lower.includes('federal') || lower.includes('tercera')) return 3;
  return 0;
}
function mediaRangeAllowedByDivision(range, divisionOrder){
  const order = Math.round(Number(divisionOrder || 0));
  if(order === 2 && range.id === 'elite_mundial') return false;
  if(order >= 3 && (range.id === 'elite_mundial' || range.id === 'estrella')) return false;
  return true;
}
function clubEliteCountInContext(context, clubId){
  if(!context || Number(clubId || 0) <= 0) return 0;
  return contextPlayersForGeneration(context).filter(player => Number(player.clubId) === Number(clubId) && mediaRangeIdForOverall(player.overall ?? visibleOverall(player)) === 'elite_mundial').length;
}
function pickMediaRangeWithAudit(context, seedKey, constraints={}){
  const preferred = weightedRulePick(PLAYER_GENERATION_MEDIA_RANGES, `${seedKey}-range`);
  const divisionOrder = Math.round(Number(constraints.divisionOrder || 0));
  const clubId = Number(constraints.clubId || 0);
  const passesHardLimits = (range) => {
    if(!mediaRangeAllowedByDivision(range, divisionOrder)) return false;
    if(range.id === 'elite_mundial' && clubId > 0 && clubEliteCountInContext(context, clubId) >= PLAYER_ELITE_MAX_PER_CLUB) return false;
    return true;
  };
  if(!context){
    return passesHardLimits(preferred) ? preferred : (PLAYER_GENERATION_MEDIA_RANGES.find(passesHardLimits) || PLAYER_GENERATION_MEDIA_RANGES[PLAYER_GENERATION_MEDIA_RANGES.length - 1]);
  }
  const players = contextPlayersForGeneration(context);
  const targetTotal = Math.max(players.length + 1, Number(context.targetTotal || 0));
  const counts = {};
  players.forEach(player => {
    const key = mediaRangeIdForOverall(player.overall ?? visibleOverall(player));
    counts[key] = (counts[key] || 0) + 1;
  });
  const under = PLAYER_GENERATION_MEDIA_RANGES.filter(range => passesHardLimits(range) && (counts[range.id] || 0) < mediaRangeTargetCount(range, targetTotal));
  const fallbackAllowed = PLAYER_GENERATION_MEDIA_RANGES.filter(passesHardLimits);
  const fallbackWithoutElite = fallbackAllowed.filter(range => range.id !== 'elite_mundial');
  const allowed = under.length ? under : (fallbackWithoutElite.length ? fallbackWithoutElite : fallbackAllowed);
  if(allowed.some(range => range.id === preferred.id)) return preferred;
  const preferredIndex = PLAYER_GENERATION_MEDIA_RANGES.findIndex(range => range.id === preferred.id);
  const lower = PLAYER_GENERATION_MEDIA_RANGES.slice(preferredIndex + 1).find(range => allowed.some(item => item.id === range.id));
  if(lower) return lower;
  return weightedRulePick(allowed, `${seedKey}-range-fallback`) || PLAYER_GENERATION_MEDIA_RANGES[PLAYER_GENERATION_MEDIA_RANGES.length - 1];
}
function pickNationalityForGeneration(id, label, context=null){
  const group = pickRuleWithAudit(PLAYER_GENERATION_NATIONALITY_GROUPS, player => nationalityGroupId(player.nationality), context, `${label}-${id}-nat-group`);
  const countries = group?.countries?.length ? group.countries : ['Argentina'];
  return countries[hashNumber(`${label}-${id}-nat-country`, countries.length)];
}
function pickPositionGroupForGeneration(id, label, context=null){
  return pickRuleWithAudit(PLAYER_GENERATION_POSITION_GROUPS, player => playerRoleGroup(player.position), context, `${label}-${id}-pos-group`)?.id || 'MID';
}
function pickPositionFromGroup(groupId, id, label){
  const group = PLAYER_GENERATION_POSITION_GROUPS.find(item => item.id === groupId) || PLAYER_GENERATION_POSITION_GROUPS[2];
  const pool = group.positions || ['MC'];
  return pool[hashNumber(`${label}-${id}-pos`, pool.length)];
}
function mediaFromGenerationRules(prestige, id, group, context=null, label='player', constraints={}){
  const range = pickMediaRangeWithAudit(context, `${label}-${id}-${group}`, constraints);
  const span = Math.max(1, range.media_max - range.media_min + 1);
  const raw = range.media_min + hashNumber(`${label}-${id}-${group}-media`, span);
  const prestigeBias = Math.round(((Number(prestige) || 50) - 50) / 28);
  return clamp(raw + prestigeBias, range.media_min, range.media_max);
}
function initialAnnualSalaryForMedia(media, factor=1){
  const range = mediaRangeForOverall(media);
  return Math.max(0, Math.round((Number(media) || 0) * Number(range.salaryMultiplier || 0) * PLAYER_ECONOMY_SCALE * Number(factor || 1)));
}
function clauseBaseFromDivisionName(divisionName){
  const lower = String(divisionName || '').toLowerCase();
  if(lower.includes('profesional') || lower.includes('primera')) return PLAYER_CLAUSE_BASE_BY_DIVISION_ORDER[1];
  if(lower.includes('nacional') || lower.includes('segunda')) return PLAYER_CLAUSE_BASE_BY_DIVISION_ORDER[2];
  return PLAYER_CLAUSE_BASE_BY_DIVISION_ORDER[3];
}
function clauseBaseForClub(clubId, divisionName=''){
  if(Number(clubId || 0) <= 0) return clauseBaseFromDivisionName(divisionName);
  if(seed?.clubs?.length){
    const order = Math.round(Number(clubDivision(clubId).order || 3));
    return PLAYER_CLAUSE_BASE_BY_DIVISION_ORDER[order] || PLAYER_CLAUSE_BASE_BY_DIVISION_ORDER[3];
  }
  return clauseBaseFromDivisionName(divisionName);
}
function playerClauseFor(player, clubId=player?.clubId, divisionName=''){
  const salary = Math.max(0, Math.round(Number(player?.salary || 0)));
  const age = Math.max(15, Math.round(Number(player?.age || 18)));
  const multiplier = Math.max(PLAYER_CLAUSE_MIN_MULTIPLIER, clauseBaseForClub(clubId, divisionName) - (PLAYER_CLAUSE_AGE_REDUCTION * age));
  return Math.max(salary * PLAYER_CLAUSE_MIN_MULTIPLIER, Math.round(salary * multiplier));
}
function refreshPlayerClause(player){
  if(!player) return 0;
  player.clause = playerClauseFor(player, player.clubId);
  player.value = player.clause;
  return player.clause;
}
function refreshAllPlayerClauses(){
  (seed?.players || []).forEach(refreshPlayerClause);
  (game?.marketPlayers || []).forEach(refreshPlayerClause);
}
function ensurePlayerEconomics(player, salaryFactor=1){
  if(!player) return player;
  const media = Math.max(1, Math.round(Number(player.overall || 0) || visibleOverall(player) || 50));
  if(!Number.isFinite(Number(player.salary)) || Number(player.salary) <= 0){
    player.salary = initialAnnualSalaryForMedia(media, salaryFactor);
  }
  if(!Number.isFinite(Number(player.clause)) || Number(player.clause) <= 0 || !Number.isFinite(Number(player.value)) || Number(player.value) <= 0){
    refreshPlayerClause(player);
  }
  return player;
}
function generatedPlayerFactory({ id, position, clubId=0, age=18, prestige=50, nameContext='Jugador', divisionName='', divisionOrder=null, generationContext=null, salaryFactor=1, freeAgent=false, youthFreeAgent=false }){
  const cleanPosition = normalizePlayerPosition(position, id);
  const group = playerRoleGroup(cleanPosition);
  const generationDivision = Number.isFinite(Number(divisionOrder)) ? Number(divisionOrder) : generationDivisionOrder(clubId, divisionName);
  const media = mediaFromGenerationRules(prestige, id, group, generationContext, nameContext, { clubId, divisionOrder:generationDivision });
  const skills = skillsForPosition(cleanPosition, media, id);
  const visible = averageGeneratedVisible(cleanPosition, skills);
  const player = {
    id,
    name:generatedPlayerName(id, nameContext),
    age,
    position:cleanPosition,
    clubId,
    freeAgent:Boolean(freeAgent),
    youthFreeAgent:Boolean(youthFreeAgent),
    nationality:pickNationalityForGeneration(id, divisionName || nameContext, generationContext),
    overall:visible,
    skills,
    salary:initialAnnualSalaryForMedia(visible, salaryFactor)
  };
  player.clause = playerClauseFor(player, clubId, divisionName);
  player.value = player.clause;
  registerGeneratedPlayer(generationContext, player);
  return player;
}
function generationRosterBlueprint(){
  return ['POR','POR','POR','LD','LI','DFC','DFC','DFC','LD','LI','MCD','MCD','MC','MC','MC','MCO','MCO','MCO','ED','EI','ED','EI','DC','DC','DC'];
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
  if(['MCD','MC','MCO'].includes(slot)) return 'mid';
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
  (tactic.starters || []).filter(Boolean).forEach(id => {
    if(!MENTALITIES.includes(next[id])) next[id] = 'posicional';
  });
  Object.keys(next).forEach(id => {
    const cleanId = Number(id);
    if(!cleanId || !(tactic.starters || []).includes(cleanId)) delete next[id];
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
    { count:1, x:8 },
    { count:layout[0], x:22 },
    { count:layout[1], x:36 },
    { count:layout[2], x:52 },
    { count:layout[3], x:68 },
    { count:layout[4], x:84 }
  ];
  const coords = [];
  rows.forEach(row=>{
    const count = row.count;
    for(let i=0;i<count;i++){
      const y = count === 1 ? 50 : 6 + (88 * (i+1)/(count+1));
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
    ED:['EI','DC','MCO'], EI:['ED','DC','MCO'],
    DC:['ED','EI','MCO'], POR:[]
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



async function fetchJsonIfExists(url){
  try{
    const res = await fetch(url, { cache:'no-store' });
    if(!res.ok) return null;
    const raw = await res.text();
    if(!raw.trim()) return null;
    return JSON.parse(raw);
  }catch(error){
    console.warn(`No se pudo cargar ${url}`, error);
    return null;
  }
}

async function loadPlayersDatabase(){
  const raw = await fetchJsonIfExists(PLAYERS_DATABASE_URL);
  if(!raw) return null;
  const players = Array.isArray(raw) ? raw : raw.players;
  if(!Array.isArray(players) || !players.length) return null;
  return { raw, players, source:PLAYERS_DATABASE_URL };
}

async function loadSponsorsDatabase(){
  const raw = await fetchJsonIfExists(SPONSORS_DATABASE_URL);
  if(!raw) return { lugares_sponsor:[], sponsors:[], reglas_calculo:{} };
  const lugares = Array.isArray(raw.lugares_sponsor) ? raw.lugares_sponsor : [];
  const sponsors = Array.isArray(raw.sponsors) ? raw.sponsors.filter(sponsor => sponsor && sponsor.activo !== false) : [];
  return { ...raw, lugares_sponsor:lugares, sponsors, source:SPONSORS_DATABASE_URL };
}
function playersDatabaseHash(players=[]){
  const raw = players.map(p => `${p.id}:${p.clubId}:${p.position}:${p.overall}:${p.salary}:${p.clause}`).join('|');
  return `players-${hashNumber(raw, 1000000000)}`;
}
function normalizeDatabasePlayer(player){
  const clean = { ...player, id:Number(player.id), clubId:Number(player.clubId || 0), age:Math.max(15, Math.round(Number(player.age || 18))) };
  clean.position = normalizePlayerPosition(clean.position, clean.id);
  clean.skills = clean.skills && typeof clean.skills === 'object' ? { ...clean.skills } : skillsForPosition(clean.position, Number(clean.overall || 50), clean.id);
  clean.overall = rawVisibleOverall({ ...clean, overall:Number(clean.overall || 50) });
  ensurePlayerEconomics(clean, clean.youthFreeAgent ? FREE_YOUTH_SALARY_FACTOR : (clean.freeAgent ? MARKET_FREE_AGENT_SALARY_FACTOR : 1));
  return clean;
}
function databaseValidationCounts(players=[]){
  const media = {};
  const position = {};
  const nationality = {};
  players.forEach(player => {
    const mediaKey = mediaRangeIdForOverall(rawVisibleOverall(player));
    const positionKey = playerRoleGroup(player.position);
    const nationalityKey = nationalityGroupId(player.nationality);
    media[mediaKey] = (media[mediaKey] || 0) + 1;
    position[positionKey] = (position[positionKey] || 0) + 1;
    nationality[nationalityKey] = (nationality[nationalityKey] || 0) + 1;
  });
  return { media, position, nationality };
}
function applyPlayersDatabase(seedData, database){
  if(!seedData || !database?.players?.length) return seedData;
  const validClubIds = new Set((seedData.clubs || []).map(c => Number(c.id)));
  const normalized = database.players
    .map(normalizeDatabasePlayer)
    .filter(player => Number.isFinite(player.id) && (Number(player.clubId) === 0 || validClubIds.has(Number(player.clubId))));
  if(!normalized.length) return seedData;
  seedData.players = normalized;
  seedData.meta = { ...(seedData.meta || {}), playersSource:database.source, playersDatabaseVersion:database.raw?.metadata?.version || 'local', playersDatabaseValidation:database.raw?.validation || databaseValidationCounts(normalized) };
  seedData.meta.signature = `${seedSignature(seedData)}-${playersDatabaseHash(normalized)}`;
  return seedData;
}
function applySavedDatabaseSnapshots(saved){
  const clean = { ...(saved || {}) };
  if(Array.isArray(saved?.clubsSnapshot) && saved.clubsSnapshot.length){
    seed.clubs = saved.clubsSnapshot.map(club => ({ ...club, fieldConditionScore:Number.isFinite(club.fieldConditionScore) ? club.fieldConditionScore : initialFieldScore(club), fieldCondition:club.fieldCondition || fieldConditionName(club.fieldConditionScore || initialFieldScore(club)), crestPath:club.crestPath || `img/escudos/${imageSlug(club.name)}.png` }));
  }
  if(Array.isArray(saved?.playersSnapshot) && saved.playersSnapshot.length){
    seed.players = saved.playersSnapshot.map(normalizeDatabasePlayer);
  }
  delete clean.playersSnapshot;
  delete clean.clubsSnapshot;
  delete clean.divisionsSnapshot;
  return clean;
}
function currentSavePayload(){
  const payload = structuredClone(game);
  payload.seedSignature = seed?.meta?.signature || payload.seedSignature || '';
  payload.playersSnapshot = structuredClone(seed?.players || []);
  payload.clubsSnapshot = structuredClone(seed?.clubs || []);
  payload.divisionsSnapshot = structuredClone(seed?.divisions || []);
  return payload;
}
async function loadInitialSeed(){
  const playersDatabase = await loadPlayersDatabase();
  for(const url of LEAGUE_DATA_CANDIDATES){
    const leagueJson = await fetchJsonIfExists(url);
    if(leagueJson){
      const built = buildSeedFromLigaArgentina(leagueJson, url);
      return applyPlayersDatabase(built, playersDatabase);
    }
  }
  const fallback = await fetchJsonIfExists(DATA_URL);
  if(fallback && Array.isArray(fallback.clubs) && Array.isArray(fallback.players) && Array.isArray(fallback.fixtures)){
    fallback.meta = { ...(fallback.meta || {}), source:fallback.meta?.source || 'seed.json', signature:seedSignature(fallback) };
    fallback.clubs = fallback.clubs.map(c => ({ ...c, divisionId:c.divisionId || 'default', divisionName:c.divisionName || 'Liga única', prizeMultiplier:c.prizeMultiplier ?? 1, fieldConditionScore:c.fieldConditionScore || initialFieldScore(c), fieldCondition:fieldConditionName(c.fieldConditionScore || initialFieldScore(c)), crestPath:c.crestPath || `img/escudos/${imageSlug(c.name)}.png` }));
    fallback.divisions = fallback.divisions || [{ id:'default', name:'Liga única', order:1, prizeMultiplier:1 }];
    fallback.players = (fallback.players || []).map(player => ensurePlayerEconomics({ ...player, position:normalizePlayerPosition(player.position, player.id) }));
    return applyPlayersDatabase(fallback, playersDatabase);
  }
  throw new Error('No se pudo cargar data/Liga argentina.json ni un data/seed.json válido');
}
function buildSeedFromLigaArgentina(raw, sourceUrl){
  const divisions = extractLeagueDivisions(raw);
  if(!divisions.length) throw new Error('El JSON de Liga argentina no tiene divisiones o equipos reconocibles.');
  const normalizedDivisions = divisions.map((division, index) => {
    const name = normalizeDivisionName(division.name || division.nombre || division.division || `División ${index+1}`);
    return {
      id: slugId(name),
      name,
      order:index+1,
      prizeMultiplier: divisionPrizeMultiplier(name, index)
    };
  });
  const totalClubCount = divisions.reduce((sum, division) => sum + normalizeTeamList(division.teams || division.equipos || division.clubes || division.clubs || []).length, 0);
  const generationContext = createPlayerGenerationContext(totalClubCount * CLUB_ROSTER_SIZE, []);
  const clubs = [];
  const players = [];
  let clubId = 1;
  let playerId = 1;
  divisions.forEach((division, divisionIndex) => {
    const divInfo = normalizedDivisions[divisionIndex];
    const teams = normalizeTeamList(division.teams || division.equipos || division.clubes || division.clubs || []);
    teams.forEach((team, teamIndex) => {
      const name = teamName(team);
      if(!name) return;
      const prestige = teamPrestige(team, divInfo.name, teamIndex, teams.length);
      const fieldConditionScore = initialFieldScore({ name, id:clubId });
      const fieldCondition = fieldConditionName(fieldConditionScore);
      const club = {
        id:clubId,
        name,
        short:clubShortFromName(name),
        city:team.city || team.ciudad || '',
        reputation:prestige,
        budget:clubBudgetByPrestige(prestige, divInfo.prizeMultiplier),
        primaryColor:team.color || team.primaryColor || deterministicColor(name),
        divisionId:divInfo.id,
        divisionName:divInfo.name,
        divisionOrder:divInfo.order,
        prizeMultiplier:divInfo.prizeMultiplier,
        fieldConditionScore,
        fieldCondition,
        crestPath:team.escudo || team.crestPath || `img/escudos/${imageSlug(name)}.png`
      };
      clubs.push(club);
      const generated = generateClubPlayers(club, prestige, playerId, generationContext);
      players.push(...generated);
      playerId += generated.length;
      clubId += 1;
    });
  });
  const seedData = {
    meta:{
      version:APP_VERSION,
      source:sourceUrl,
      generatedAt:new Date().toISOString(),
      signature:''
    },
    divisions:normalizedDivisions,
    clubs,
    players,
    fixtures:generateFixturesForDivisions(clubs, normalizedDivisions)
  };
  seedData.meta.signature = seedSignature(seedData);
  return seedData;
}
function extractLeagueDivisions(raw){
  if(raw && raw['Liga argentina']) raw = raw['Liga argentina'];
  if(raw && raw['Liga Argentina']) raw = raw['Liga Argentina'];
  if(Array.isArray(raw)) return raw.map((item, index) => normalizeDivisionObject(item, index));
  if(Array.isArray(raw.divisiones)) return raw.divisiones.map(normalizeDivisionObject);
  if(raw.divisiones && typeof raw.divisiones === 'object') return Object.entries(raw.divisiones).map(([name, teams]) => ({ name, teams }));
  if(Array.isArray(raw.divisions)) return raw.divisions.map(normalizeDivisionObject);
  if(raw.divisions && typeof raw.divisions === 'object') return Object.entries(raw.divisions).map(([name, teams]) => ({ name, teams }));
  if(Array.isArray(raw.ligas)) return raw.ligas.map(normalizeDivisionObject);
  if(Array.isArray(raw.leagues)) return raw.leagues.map(normalizeDivisionObject);
  const known = ['Liga Profesional','Primera Nacional','Federal A'];
  const found = [];
  known.forEach(name => {
    if(raw[name]) found.push({ name, teams:raw[name] });
  });
  if(found.length) return found;
  const dynamic = Object.entries(raw).filter(([_, value]) => Array.isArray(value));
  return dynamic.map(([name, teams]) => ({ name, teams }));
}
function normalizeDivisionObject(item, index=0){
  if(Array.isArray(item)) return { name:`División ${index+1}`, teams:item };
  return {
    name:item.nombre || item.name || item.division || item.liga || `División ${index+1}`,
    teams:item.equipos || item.clubes || item.clubs || item.teams || []
  };
}
function normalizeTeamList(list){
  if(!Array.isArray(list)) return [];
  return list.map(item => typeof item === 'string' ? { nombre:item } : (item || {}));
}
function normalizeDivisionName(name){
  const cleaned = String(name || '').trim();
  const lower = cleaned.toLowerCase();
  if(lower.includes('profesional')) return 'Liga Profesional';
  if(lower.includes('nacional')) return 'Primera Nacional';
  if(lower.includes('federal')) return 'Federal A';
  return cleaned || 'Liga';
}
function divisionPrizeMultiplier(name, index=0){
  const lower = String(name || '').toLowerCase();
  if(lower.includes('profesional')) return 1;
  if(lower.includes('nacional')) return 0.30;
  if(lower.includes('federal')) return 0.15;
  return index === 0 ? 1 : index === 1 ? 0.30 : 0.15;
}
function teamName(team){
  return String(team.nombre || team.name || team.club || team.equipo || team.team || '').trim();
}
function teamPrestige(team, divisionName, index, total){
  const explicit = Number(team.prestigio ?? team.prestige ?? team.reputacion ?? team.reputation ?? team.media ?? team.rating);
  if(Number.isFinite(explicit)) return clamp(Math.round(explicit), 20, 99);
  const multiplier = divisionPrizeMultiplier(divisionName);
  const tierBase = multiplier === 1 ? 68 : multiplier === 0.30 ? 52 : 38;
  const tierTop = multiplier === 1 ? 92 : multiplier === 0.30 ? 72 : 58;
  const rankRatio = total > 1 ? 1 - (index / (total - 1)) : 0.5;
  const value = tierBase + (tierTop - tierBase) * rankRatio + hashNumber(`${teamName(team)}-${divisionName}`, 7) - 3;
  return clamp(Math.round(value), 20, 99);
}
function fieldConditionByPrestige(prestige){
  const p = Number(prestige) || 50;
  if(p >= 82) return 'Excelente';
  if(p >= 62) return 'Normal';
  if(p >= 45) return 'Regular';
  if(p >= 30) return 'Muy malo';
  return 'Injugable';
}
function initialFieldScore(club){
  return clamp(60 + hashNumber(`field-start-${club?.name || club?.id || ''}`, 21), 60, 80);
}
function fieldConditionName(score){
  const value = clamp(Math.round(Number(score) || 1), 1, 100);
  if(value >= 90) return 'Excelente';
  if(value >= 60) return 'Normal';
  if(value >= 40) return 'Regular';
  if(value >= 20) return 'Muy malo';
  return 'Injugable';
}
function fieldConditionClass(score){
  const label = fieldConditionName(score);
  return label === 'Excelente' ? 'excellent' : label === 'Normal' ? 'normal' : label === 'Regular' ? 'regular' : label === 'Muy malo' ? 'bad' : 'unplayable';
}
function createInitialStadiumState(){
  const fields = {};
  seed.clubs.forEach(club => { fields[club.id] = Number.isFinite(club.fieldConditionScore) ? club.fieldConditionScore : initialFieldScore(club); });
  return { fields, projects:{} };
}
function ensureStadiumState(){
  if(!game) return;
  if(!game.stadium) game.stadium = createInitialStadiumState();
  if(!game.stadium.fields) game.stadium.fields = {};
  if(!game.stadium.projects) game.stadium.projects = {};
  seed.clubs.forEach(club => {
    if(!Number.isFinite(game.stadium.fields[club.id])) game.stadium.fields[club.id] = Number.isFinite(club.fieldConditionScore) ? club.fieldConditionScore : initialFieldScore(club);
  });
}
function fieldScoreForClub(clubId){
  ensureStadiumState();
  return clamp(Math.round(game?.stadium?.fields?.[clubId] ?? 60), 1, 100);
}
function fieldNameForClub(clubId){
  return fieldConditionName(fieldScoreForClub(clubId));
}
function stadiumProjectForClub(clubId){
  ensureStadiumState();
  if(!game.stadium.projects[clubId]) game.stadium.projects[clubId] = { replantingTurnsLeft:0, patchingTurnsLeft:0 };
  return game.stadium.projects[clubId];
}
function fieldBar(score, label=''){
  const value = clamp(Math.round(score), 1, 100);
  return `<div class="field-bar ${fieldConditionClass(value)}" title="${escapeHtml(label || fieldConditionName(value))} ${value}/100"><span style="width:${value}%"></span><em>${value}/100</em></div>`;
}
function clubBudgetByPrestige(prestige, prizeMultiplier=1){
  const base = 7000000 + Math.pow(Number(prestige) || 50, 2) * 18000;
  return Math.round(base * (0.75 + prizeMultiplier * 0.65));
}
function clubShortFromName(name){
  const words = String(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9 ]/g,' ').trim().split(/\s+/).filter(Boolean);
  if(words.length >= 3) return words.slice(0,3).map(w=>w[0]).join('').toUpperCase();
  if(words.length === 2) return (words[0].slice(0,2) + words[1][0]).toUpperCase();
  return (words[0] || 'CLU').slice(0,3).toUpperCase();
}
function imageSlug(name){
  return String(name || '').trim().replace(/\s+/g,'_');
}
function slugId(name){
  return String(name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'division';
}
function deterministicColor(name){
  const hue = hashNumber(name, 360);
  return `hsl(${hue} 70% 42%)`;
}
function seedSignature(data){
  const raw = `${(data.clubs || []).map(c=>c.name).join('|')}::${(data.divisions || []).map(d=>d.name).join('|')}`;
  return `seed-${hashNumber(raw, 1000000000)}`;
}
function generateClubPlayers(club, prestige, startId, generationContext=null){
  const blueprint = generationRosterBlueprint();
  return blueprint.map((position, index) => {
    const id = startId + index;
    const group = playerRoleGroup(position);
    const age = group === 'POR' ? 25 + hashNumber(`age-${club.name}-${id}`, 14) : 18 + hashNumber(`age-${club.name}-${id}`, 16);
    return generatedPlayerFactory({
      id,
      position,
      clubId:club.id,
      age,
      prestige,
      nameContext:club.name,
      divisionName:club.divisionName,
      divisionOrder:club.divisionOrder,
      generationContext,
      salaryFactor:1
    });
  });
}
function playerBaseMedia(prestige, id, group){
  const groupBoost = group === 'POR' ? 1 : group === 'ATT' ? 0 : group === 'MID' ? 0.5 : -0.5;
  return clamp(Math.round(42 + prestige * 0.48 + groupBoost + hashNumber(`media-${id}`, 13) - 6), 35, 94);
}
const FIRST_NAMES = ['Agustín','Mateo','Lautaro','Santiago','Julián','Tomás','Nicolás','Franco','Lucas','Bruno','Facundo','Ezequiel','Ramiro','Iván','Gonzalo','Emiliano','Brian','Thiago','Alan','Pablo','Martín','Leandro'];
const LAST_NAMES = ['Gómez','Rodríguez','Fernández','López','Martínez','Pérez','García','Sánchez','Romero','Torres','Díaz','Alvarez','Ruiz','Ramírez','Aguirre','Molina','Castro','Silva','Rojas','Vera','Acosta','Morales','Herrera','Medina'];
function generatedPlayerName(id, clubNameValue){
  const first = FIRST_NAMES[hashNumber(`${clubNameValue}-${id}-first`, FIRST_NAMES.length)];
  const last = LAST_NAMES[hashNumber(`${clubNameValue}-${id}-last`, LAST_NAMES.length)];
  return `${first} ${last}`;
}
function generatedNationality(id, divisionName){
  return pickNationalityForGeneration(id, divisionName || 'Jugador', null);
}
function skillValue(base, id, label, offset=0){
  return clamp(Math.round(base + offset + hashNumber(`${id}-${label}`, 15) - 7), 1, 99);
}
function skillTierValue(base, id, label, tier='common'){
  const multipliers = { key:1.30, common:1.00, rare:0.65, weak:0.35 };
  const multiplier = multipliers[tier] ?? multipliers.common;
  const noise = hashNumber(`${id}-${label}-${tier}`, 13) - 6;
  return clamp(Math.round(base * multiplier + noise), 1, 99);
}
function setSkillTier(target, base, id, names, tier){
  names.forEach(name => { target[name] = skillTierValue(base, id, name, tier); });
}
function positionSkillProfile(position){
  const pos = normalizePlayerPosition(position);
  const base = {
    key:[],
    common:['resistencia','trabajoEquipo','serenidad','disciplina','liderazgo','potencial'],
    rare:[],
    weak:['porteria']
  };
  if(pos === 'POR'){
    return {
      key:['porteria','posicionamiento','serenidad','aceleracion'],
      common:['cabezazo','fuerza','liderazgo','trabajoEquipo','paseCorto','paseLargo','resistencia','disciplina'],
      rare:['velocidad'],
      weak:['marca','entradas','remate','regate','tecnica']
    };
  }
  if(['LD','LI','DFC'].includes(pos)){
    return {
      key:['marca','entradas','posicionamiento','fuerza'],
      common:['cabezazo','resistencia','trabajoEquipo','disciplina','liderazgo'],
      rare:['remate','regate','paseCorto','paseLargo','vision','velocidad','aceleracion','tecnica','serenidad'],
      weak:['porteria']
    };
  }
  if(pos === 'MCD'){
    return {
      key:['marca','entradas','paseCorto','trabajoEquipo','resistencia'],
      common:['posicionamiento','paseLargo','vision','disciplina','serenidad','fuerza'],
      rare:['remate','regate','cabezazo','velocidad','aceleracion','tecnica','liderazgo'],
      weak:['porteria']
    };
  }
  if(pos === 'MC'){
    return {
      key:['paseCorto','paseLargo','vision','trabajoEquipo','resistencia'],
      common:['tecnica','posicionamiento','serenidad','marca','disciplina','liderazgo'],
      rare:['remate','regate','cabezazo','velocidad','aceleracion','entradas','fuerza'],
      weak:['porteria']
    };
  }
  if(pos === 'MCO'){
    return {
      key:['paseCorto','vision','tecnica','regate','remate'],
      common:['posicionamiento','serenidad','paseLargo','trabajoEquipo','resistencia'],
      rare:['marca','entradas','cabezazo','velocidad','aceleracion','fuerza','disciplina','liderazgo'],
      weak:['porteria']
    };
  }
  if(['ED','EI'].includes(pos)){
    return {
      key:['velocidad','aceleracion','regate','tecnica','paseCorto'],
      common:['remate','vision','posicionamiento','resistencia','serenidad'],
      rare:['marca','entradas','cabezazo','fuerza','paseLargo','trabajoEquipo','disciplina','liderazgo'],
      weak:['porteria']
    };
  }
  return {
    key:['remate','posicionamiento','cabezazo','serenidad'],
    common:['fuerza','regate','tecnica','velocidad','resistencia'],
    rare:['paseCorto','paseLargo','vision','marca','entradas','aceleracion','trabajoEquipo','disciplina','liderazgo'],
    weak:['porteria']
  };
}
function skillsForPosition(position, base, id){
  const s = {};
  const all = ['porteria','entradas','marca','posicionamiento','paseCorto','paseLargo','vision','regate','tecnica','remate','cabezazo','velocidad','aceleracion','fuerza','resistencia','trabajoEquipo','serenidad','disciplina','liderazgo','potencial'];
  all.forEach(name => { s[name] = skillTierValue(base, id, name, 'rare'); });
  const profile = positionSkillProfile(position);
  setSkillTier(s, base, id, profile.rare || [], 'rare');
  setSkillTier(s, base, id, profile.common || [], 'common');
  setSkillTier(s, base, id, profile.key || [], 'key');
  setSkillTier(s, base, id, profile.weak || [], 'weak');
  s.potencial = clamp(skillTierValue(base, id, 'potencial', 'common') + hashNumber(`pot-${id}`, 8), 1, 99);
  s.disciplina = clamp(Math.round((s.disciplina || skillTierValue(base, id, 'disciplina', 'common')) + hashNumber(`disc-${id}`, 9) - 4), 1, 99);
  return s;
}
function skillsForGroup(group, base, id){
  const representative = group === 'POR' ? 'POR' : group === 'DEF' ? 'DFC' : group === 'MID' ? 'MC' : 'DC';
  return skillsForPosition(representative, base, id);
}
function averageGeneratedVisible(position, skills){
  const temp = { position, skills, overall:50 };
  return clamp(Math.round(avg(Object.values(visibleStats(temp)))), 1, 99);
}
function generateFixturesForDivisions(clubs, divisions){
  const schedules = divisions.map(division => roundRobinSchedule(clubs.filter(c => c.divisionId === division.id), division));
  const maxRounds = Math.max(...schedules.map(s => s.length), 0);
  const fixtures = [];
  for(let roundIndex=0; roundIndex<maxRounds; roundIndex++){
    const date = new Date(Date.UTC(2026, 1, 1 + roundIndex * 7));
    const matches = [];
    schedules.forEach(schedule => {
      (schedule[roundIndex] || []).forEach(match => matches.push(match));
    });
    fixtures.push({ matchday:roundIndex+1, date:date.toISOString().slice(0,10), matches });
  }
  return fixtures;
}
function roundRobinSchedule(clubsInDivision, division){
  const teams = clubsInDivision.slice();
  if(teams.length % 2 === 1) teams.push(null);
  const rounds = [];
  const n = teams.length;
  if(n < 2) return rounds;
  let arr = teams.slice();
  for(let r=0; r<n-1; r++){
    const matches = [];
    for(let i=0; i<n/2; i++){
      const a = arr[i];
      const b = arr[n-1-i];
      if(a && b){
        const home = r % 2 === 0 ? a : b;
        const away = r % 2 === 0 ? b : a;
        matches.push({ id:`${division.id}-j${r+1}-${home.id}-${away.id}`, matchday:r+1, divisionId:division.id, divisionName:division.name, homeId:home.id, awayId:away.id, played:false });
      }
    }
    rounds.push(matches);
    arr = [arr[0], arr[n-1], ...arr.slice(1,n-1)];
  }
  return rounds;
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
    tx.objectStore(DB_STORE).put(currentSavePayload(), SAVE_KEY);
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
    const currentSignature = seed?.meta?.signature;
    if(currentSignature && saved.seedSignature !== currentSignature){
      if(!silent) showNotice('La base de datos cambió. Creá una nueva partida para usar la Liga argentina.');
      return false;
    }
    game = normalizeGame(applySavedDatabaseSnapshots(saved));
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
  setTimeout(()=>openNewGameModal(true), 0);
}

async function init(){
  try{
    seed = await loadInitialSeed();
    sponsorsDatabase = await loadSponsorsDatabase();
    fillClubSelect();
    bindEvents();
    startUiTicker();
    const loaded = await loadLocal(true);
    if(!loaded){
      renderAll();
      setTimeout(()=>openNewGameModal(true), 0);
    }
  }catch(error){
    console.error(error);
    view.innerHTML = `<div class="empty"><h2>Error de carga</h2><p>${escapeHtml(error.message)}. Subí <code>data/Liga argentina.json</code> o un <code>data/seed.json</code> válido y ejecutá el proyecto con GitHub Pages o servidor local.</p></div>`;
  }
}
function clubSelectOptionsMarkup(){
  const divisions = seed.divisions || [{ id:'default', name:'Liga única' }];
  return divisions.map(division => {
    const clubs = seed.clubs.filter(c => (c.divisionId || 'default') === division.id);
    if(!clubs.length) return '';
    return `<optgroup label="${escapeHtml(division.name)}">${clubs.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}</optgroup>`;
  }).join('');
}
function fillClubSelect(){
  const select = $('clubSelect');
  if(select) select.innerHTML = clubSelectOptionsMarkup();
}
function bindEvents(){
  $('btnOpenNewGame')?.addEventListener('click', openNewGameModal);
  $('btnNewGame')?.addEventListener('click', ()=> newGame(Number($('clubSelect')?.value || 0)));
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
    if(event.target.closest('[data-open-messages]')){ activeTab='messages'; renderAll(); return; }
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
    if(game) refreshSidebarDate();
    if(game && activeTab === 'home') updateAdvanceButtonState();
  }, 1000);
}
function normalizeGame(saved){
  const normalized = {...saved};
  normalized.version = APP_VERSION;
  normalized.seedSignature = normalized.seedSignature || seed?.meta?.signature || '';
  normalized.tactic = normalizeTactic(normalized.selectedClubId, normalized.tactic || DEFAULT_TACTIC);
  normalized.playerStatus = normalized.playerStatus || {};
  normalized.lastOwnProblems = normalized.lastOwnProblems || [];
  normalized.mustReviewTactics = Boolean(normalized.mustReviewTactics);
  normalized.advanceLockedUntil = normalized.advanceLockedUntil || 0;
  normalized.matchHistory = normalized.matchHistory || [];
  normalized.seasonNumber = Number.isFinite(normalized.seasonNumber) ? normalized.seasonNumber : 1;
  normalized.seasonFinalized = Boolean(normalized.seasonFinalized);
  normalized.seasonTransition = normalized.seasonTransition || null;
  normalized.seasonPhase = normalized.seasonPhase || (normalized.seasonFinalized ? 'finalized' : 'regular');
  normalized.phaseTurn = Number.isFinite(normalized.phaseTurn) ? normalized.phaseTurn : 0;
  normalized.globalTurn = Number.isFinite(normalized.globalTurn) ? normalized.globalTurn : ((Math.max(1, normalized.seasonNumber || 1) - 1) * 40 + (normalized.matchdayIndex || 0));
  normalized.preseasonFriendliesPlayed = Number.isFinite(normalized.preseasonFriendliesPlayed) ? normalized.preseasonFriendliesPlayed : 0;
  normalized.pendingFriendlyOpponentId = Number.isFinite(normalized.pendingFriendlyOpponentId) ? normalized.pendingFriendlyOpponentId : 0;
  normalized.clubDivisionOverrides = normalized.clubDivisionOverrides || {};
  normalized.managerStats = normalizeManagerStats(normalized.managerStats);
  normalized.messages = Array.isArray(normalized.messages) ? normalized.messages : [];
  normalized.marketPlayers = Array.isArray(normalized.marketPlayers) ? normalized.marketPlayers : generateMarketPlayers(MARKET_FREE_AGENT_COUNT);
  normalized.pendingTransfers = Array.isArray(normalized.pendingTransfers) ? normalized.pendingTransfers : [];
  normalized.lastOwnPlayerOffer = normalized.lastOwnPlayerOffer || null;
  normalized.seasonEndPlayerOffers = normalized.seasonEndPlayerOffers || null;
  mergeMarketPlayersIntoSeed(normalized.marketPlayers);
  normalizeAllPlayerPositions();
  normalized.marketPlayers.forEach(p => { p.position = normalizePlayerPosition(p.position, p.id); ensurePlayerEconomics(p, p.youthFreeAgent ? FREE_YOUTH_SALARY_FACTOR : MARKET_FREE_AGENT_SALARY_FACTOR); });
  seed.players.forEach(p => ensurePlayerEconomics(p, p.youthFreeAgent ? FREE_YOUTH_SALARY_FACTOR : 1));
  applyClubDivisionOverrides(normalized.clubDivisionOverrides);
  normalized.fixtures = normalized.fixtures || structuredClone(seed.fixtures);
  normalized.standings = normalized.standings || createInitialStandings();
  normalized.playerStats = normalized.playerStats || createInitialPlayerStats();
  normalized.budget = Number.isFinite(normalized.budget) ? normalized.budget : (seed.clubs.find(c=>c.id===normalized.selectedClubId)?.budget || 0);
  normalized.lastBudgetDelta = Number.isFinite(normalized.lastBudgetDelta) ? normalized.lastBudgetDelta : 0;
  normalized.budgetHistory = normalized.budgetHistory || [];
  normalized.playerCondition = normalized.playerCondition || {};
  seed.players.forEach(p => { if(!Number.isFinite(normalized.playerCondition[p.id])) normalized.playerCondition[p.id] = 99; });
  normalized.playerMorale = normalized.playerMorale || {};
  seed.players.forEach(p => { if(!Number.isFinite(normalized.playerMorale[p.id])) normalized.playerMorale[p.id] = PLAYER_MORALE_START; });
  normalized.playerSkillBoosts = normalized.playerSkillBoosts || {};
  normalized.trainingPlan = normalized.trainingPlan || {};
  seed.players.forEach(p => {
    if(!normalized.playerSkillBoosts[p.id]) normalized.playerSkillBoosts[p.id] = {};
    if(!trainingOptionByValue(normalized.trainingPlan[p.id])) normalized.trainingPlan[p.id] = DEFAULT_TRAINING_TYPE;
  });
  normalized.staffActions = normalized.staffActions || {};
  if(normalized.staffActions.motivationalTalk && !Number.isFinite(normalized.staffActions.motivationalTalk.globalTurn)){
    normalized.staffActions.motivationalTalk.globalTurn = ((Math.max(1, normalized.staffActions.motivationalTalk.season || normalized.seasonNumber || 1) - 1) * 40) + Number(normalized.staffActions.motivationalTalk.matchdayIndex || 0);
  }
  normalized.stadium = normalized.stadium || createInitialStadiumState();
  normalized.sponsors = normalizeSponsorState(normalized.sponsors);
  normalized.teamCohesion = normalized.teamCohesion || {};
  normalized.lastMatchTactics = normalized.lastMatchTactics || {};
  seed.clubs.forEach(c => { if(!Number.isFinite(normalized.teamCohesion[c.id])) normalized.teamCohesion[c.id] = TEAM_COHESION_START; });
  if(!normalized.stadium.fields) normalized.stadium.fields = {};
  if(!normalized.stadium.projects) normalized.stadium.projects = {};
  seed.clubs.forEach(c => { if(!Number.isFinite(normalized.stadium.fields[c.id])) normalized.stadium.fields[c.id] = Number.isFinite(c.fieldConditionScore) ? c.fieldConditionScore : initialFieldScore(c); });
  Object.values(normalized.playerStats).forEach(stat => {
    if(stat.injuries === undefined) stat.injuries = 0;
    if(stat.played === undefined) stat.played = 0;
    if(stat.yellow === undefined) stat.yellow = 0;
    if(stat.red === undefined) stat.red = 0;
  });
  return normalized;
}

function ensurePlayerStateForAll(){
  if(!game) return;
  normalizeAllPlayerPositions();
  game.playerCondition = game.playerCondition || {};
  game.playerMorale = game.playerMorale || {};
  game.playerSkillBoosts = game.playerSkillBoosts || {};
  game.trainingPlan = game.trainingPlan || {};
  game.playerStats = game.playerStats || {};
  seed.players.forEach(p => {
    ensurePlayerEconomics(p, p.youthFreeAgent ? FREE_YOUTH_SALARY_FACTOR : (p.freeAgent ? MARKET_FREE_AGENT_SALARY_FACTOR : 1));
    if(!Number.isFinite(game.playerCondition[p.id])) game.playerCondition[p.id] = p.freeAgent ? 15 + hashNumber(`free-cond-${p.id}`, 15) : 99;
    if(!Number.isFinite(game.playerMorale[p.id])) game.playerMorale[p.id] = p.freeAgent ? 35 + hashNumber(`free-morale-${p.id}`, 55) : PLAYER_MORALE_START;
    if(!game.playerSkillBoosts[p.id]) game.playerSkillBoosts[p.id] = {};
    if(!trainingOptionByValue(game.trainingPlan[p.id])) game.trainingPlan[p.id] = DEFAULT_TRAINING_TYPE;
    if(!game.playerStats[p.id]) game.playerStats[p.id] = { playerId:p.id, clubId:p.clubId, goals:0, assists:0, yellow:0, red:0, played:0, injuries:0 };
  });
}

function assignPlayerToStarterSlot(playerId, slotIndex){
  if(!canBeStarter(playerId)){
    showNotice('Los lesionados no pueden ser titulares. Los de menos de 10 turnos sólo pueden ir al banco.');
    return;
  }
  game.tactic = applyStarterMentalities(normalizeTactic(game.selectedClubId, game.tactic));
  const starters = game.tactic.starters.slice(0,11);
  while(starters.length < 11) starters.push(0);
  let bench = game.tactic.bench.slice(0,10).filter(id => id !== playerId);
  const previousIndex = starters.indexOf(playerId);
  if(previousIndex >= 0) starters[previousIndex] = 0;
  const displaced = starters[slotIndex];
  starters[slotIndex] = playerId;
  if(displaced && displaced !== playerId && bench.length < 10) bench.push(displaced);
  game.tactic.starters = starters.slice(0,11);
  game.tactic.bench = bench.filter(Boolean).slice(0,10);
  game.tactic.autoSubs = (game.tactic.autoSubs || []).map(rule => ({...rule, outId:game.tactic.starters.includes(rule.outId)?rule.outId:0, inId:game.tactic.bench.includes(rule.inId)?rule.inId:0}));
  game.tactic = applyStarterMentalities(game.tactic);
  saveLocal(true);
  renderTactics();
}
function movePlayerToPool(playerId, pool){
  game.tactic = applyStarterMentalities(normalizeTactic(game.selectedClubId, game.tactic));
  const starters = game.tactic.starters.slice(0,11);
  while(starters.length < 11) starters.push(0);
  const idx = starters.indexOf(playerId);
  if(idx >= 0) starters[idx] = 0;
  game.tactic.starters = starters;
  game.tactic.bench = game.tactic.bench.filter(id => id !== playerId);
  if(pool === 'bench'){
    if(!canBeBench(playerId)){
      showNotice('Sólo se pueden convocar al banco jugadores disponibles o lesionados con menos de 10 turnos de recuperación.');
    } else if(game.tactic.bench.length < 10) game.tactic.bench.push(playerId);
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
  const rawStarters = Array.isArray(base.starters) ? base.starters.map(Number) : [];
  let starters = rawStarters.length >= 11
    ? rawStarters.slice(0,11).map(id => squadIds.has(id) ? id : 0)
    : autoSelectStarters(clubId, base).map(p => p.id);
  let bench = (base.bench || []).map(Number).filter(id => squadIds.has(id) && !starters.includes(id));
  if(bench.length !== 10){ bench = autoSelectBench(clubId, starters.filter(Boolean)).map(p => p.id); }
  let autoSubs = Array.isArray(base.autoSubs) ? base.autoSubs.slice(0,5) : [];
  autoSubs = autoSubs.map(rule => {
    const legacy = ['winning','losing','drawing'].includes(rule.trigger) ? 'best' : rule.trigger;
    return {
      outId: Number(rule.outId || 0),
      inId: Number(rule.inId || 0),
      trigger: SUB_TRIGGERS.some(t => t.value === legacy) ? legacy : 'tired'
    };
  }).filter(rule => starters.includes(rule.outId) && bench.includes(rule.inId));
  while(autoSubs.length < 5){ autoSubs.push({ outId:0, inId:0, trigger:'tired' }); }
  const matchInstructions = window.Simulator20?.normalizeMatchInstructions
    ? window.Simulator20.normalizeMatchInstructions(base.matchInstructions)
    : { winning:'normal', drawing:'normal', losing:'normal' };
  const normalized = { formation:base.formation, starters, bench, autoSubs, playerMentalities:{ ...(base.playerMentalities || {}) }, matchInstructions };
  return applyStarterMentalities(normalized);
}

function newGame(selectedClubId){
  const tactic = normalizeTactic(selectedClubId, DEFAULT_TACTIC);
  game = {
    version:APP_VERSION,
    seedSignature:seed?.meta?.signature || '',
    selectedClubId,
    seasonNumber: 1,
    seasonFinalized: false,
    seasonTransition: null,
    seasonPhase: 'preseason',
    phaseTurn: 0,
    globalTurn: 0,
    preseasonFriendliesPlayed: 0,
    pendingFriendlyOpponentId: 0,
    clubDivisionOverrides: {},
    managerStats: createInitialManagerStats(),
    messages: [],
    marketPlayers: [],
    pendingTransfers: [],
    lastOwnPlayerOffer: null,
    seasonEndPlayerOffers: null,
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
    playerCondition: Object.fromEntries(seed.players.map(p => [p.id, 99])),
    playerMorale: Object.fromEntries(seed.players.map(p => [p.id, PLAYER_MORALE_START])),
    playerSkillBoosts: Object.fromEntries(seed.players.map(p => [p.id, {}])),
    trainingPlan: Object.fromEntries(seed.players.map(p => [p.id, DEFAULT_TRAINING_TYPE])),
    staffActions: {},
    stadium: createInitialStadiumState(),
    sponsors: createInitialSponsorState(),
    teamCohesion: Object.fromEntries(seed.clubs.map(c => [c.id, TEAM_COHESION_START])),
    lastMatchTactics: {}
  };
  game.marketPlayers = generateMarketPlayers(MARKET_FREE_AGENT_COUNT);
  mergeMarketPlayersIntoSeed(game.marketPlayers);
  ensurePlayerStateForAll();
  pushGameMessage({ type:'system', title:'Bienvenido al club', body:'La temporada está por comenzar. Revisá táctica, mercado y mensajes antes del debut.', priority:'normal' });
  activeTab = 'home';
  closeModal();
  newGameModalShown = true;
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

function createInitialManagerStats(){
  return { totals:{ played:0, won:0, drawn:0, lost:0, gf:0, gc:0 }, seasons:[], titles:0 };
}
function normalizeManagerStats(stats){
  const base = createInitialManagerStats();
  const src = stats || {};
  const totals = { ...base.totals, ...(src.totals || {}) };
  Object.keys(totals).forEach(key => { totals[key] = Number.isFinite(totals[key]) ? totals[key] : 0; });
  return {
    totals,
    seasons:Array.isArray(src.seasons) ? src.seasons : [],
    titles:Number.isFinite(src.titles) ? src.titles : (Array.isArray(src.seasons) ? src.seasons.filter(s => s.position === 1).length : 0)
  };
}
function updateManagerMatchStats(match){
  game.managerStats = normalizeManagerStats(game.managerStats);
  const isHome = match.homeId === game.selectedClubId;
  const gf = isHome ? match.homeGoals : match.awayGoals;
  const gc = isHome ? match.awayGoals : match.homeGoals;
  const totals = game.managerStats.totals;
  totals.played += 1;
  totals.gf += gf;
  totals.gc += gc;
  if(gf > gc) totals.won += 1;
  else if(gf < gc) totals.lost += 1;
  else totals.drawn += 1;
}
function divisionOrderList(){
  return (seed.divisions || [{ id:'default', name:'Liga única', order:1 }]).slice().sort((a,b)=>(a.order || 0)-(b.order || 0));
}
function clubDivision(clubId){
  const club = seed.clubs.find(c=>c.id===Number(clubId));
  return club ? { id:club.divisionId || 'default', name:club.divisionName || 'Liga única', order:club.divisionOrder || 1 } : { id:'default', name:'Liga única', order:1 };
}
function applyClubDivisionOverrides(overrides={}){
  if(!seed?.clubs) return;
  const divisions = divisionOrderList();
  const byId = Object.fromEntries(divisions.map(d => [d.id, d]));
  seed.clubs.forEach(club => {
    const override = overrides[club.id];
    if(!override) return;
    const division = byId[override.divisionId] || divisions.find(d => d.name === override.divisionName);
    if(!division) return;
    club.divisionId = division.id;
    club.divisionName = division.name;
    club.divisionOrder = division.order;
    club.prizeMultiplier = division.prizeMultiplier ?? divisionPrizeMultiplier(division.name, (division.order || 1)-1);
  });
}
function snapshotClubDivisionOverrides(){
  return Object.fromEntries(seed.clubs.map(c => [c.id, { divisionId:c.divisionId || 'default', divisionName:c.divisionName || 'Liga única' }]));
}
function computeSeasonMovements(){
  const divisions = divisionOrderList();
  const movements = [];
  for(let i=1; i<divisions.length; i++){
    const upper = divisions[i-1];
    const lower = divisions[i];
    const lowerTable = sortedStandings(lower.id);
    const upperTable = sortedStandings(upper.id);
    const lowerChampion = lowerTable[0];
    const upperLast = upperTable[upperTable.length - 1];
    if(lowerChampion){
      movements.push({ type:'promotion', clubId:lowerChampion.clubId, fromDivisionId:lower.id, fromDivisionName:lower.name, toDivisionId:upper.id, toDivisionName:upper.name });
    }
    if(upperLast){
      movements.push({ type:'relegation', clubId:upperLast.clubId, fromDivisionId:upper.id, fromDivisionName:upper.name, toDivisionId:lower.id, toDivisionName:lower.name });
    }
  }
  return movements;
}
function decayTrainedSkillBoosts(){
  if(!game?.playerSkillBoosts) return { players:0, lost:0, remaining:0 };
  let players = 0;
  let lost = 0;
  let remaining = 0;
  Object.entries(game.playerSkillBoosts).forEach(([playerId, boosts]) => {
    if(!boosts || typeof boosts !== 'object') return;
    let affected = false;
    Object.keys(boosts).forEach(skill => {
      const oldValue = Math.max(0, Math.round(Number(boosts[skill]) || 0));
      if(oldValue <= 0){ delete boosts[skill]; return; }
      const nextValue = Math.max(0, Math.round(oldValue * 0.40));
      lost += Math.max(0, oldValue - nextValue);
      remaining += nextValue;
      affected = true;
      if(nextValue > 0) boosts[skill] = nextValue;
      else delete boosts[skill];
    });
    if(affected) players += 1;
    if(Object.keys(boosts).length === 0) delete game.playerSkillBoosts[playerId];
  });
  return { players, lost, remaining };
}
function applyBiSeasonalAging(){
  if(!game) return 0;
  const season = Number(game.seasonNumber || 1);
  if(season % 2 !== 0) return 0;
  let count = 0;
  seed.players.forEach(player => {
    player.age = Math.max(15, Number(player.age || 18) + 1);
    count += 1;
  });
  return count;
}

function applySeasonSalaryAdjustments(){
  if(!game?.playerStats || !seed?.players) return { players:0, increased:0, decreased:0, totalDelta:0, details:[] };
  let players = 0;
  let increased = 0;
  let decreased = 0;
  let totalDelta = 0;
  const details = [];
  seed.players.forEach(player => {
    if(!player || Number(player.clubId || 0) <= 0 || player.sold) return;
    const oldSalary = Math.max(0, Math.round(Number(player.salary || 0)));
    if(oldSalary <= 0) return;
    const played = Math.max(0, Math.round(Number(game.playerStats[player.id]?.played || 0)));
    const pct = (played * SEASON_SALARY_MATCH_BONUS) - SEASON_SALARY_BASE_REDUCTION;
    const nextSalary = Math.max(0, Math.round(oldSalary * (1 + pct)));
    const delta = nextSalary - oldSalary;
    player.salary = nextSalary;
    refreshPlayerClause(player);
    players += 1;
    totalDelta += delta;
    if(delta > 0) increased += 1;
    if(delta < 0) decreased += 1;
    if(Number(player.clubId) === Number(game.selectedClubId)){
      details.push({ playerId:player.id, name:player.name, played, oldSalary, nextSalary, delta, pct });
    }
  });
  return { players, increased, decreased, totalDelta, details };
}
function retireSeasonVeterans(){
  if(!game || !seed?.players) return [];
  const clubId = Number(game.selectedClubId);
  const retirees = seed.players
    .filter(player => Number(player.clubId) === clubId && !player.freeAgent && !player.sold)
    .filter(player => {
      const age = Math.round(Number(player.age || 0));
      return age >= RETIREMENT_MIN_AGE && age <= RETIREMENT_MAX_AGE;
    })
    .map(player => ({ id:player.id, name:player.name, age:player.age, position:player.position, salary:player.salary || 0 }));
  if(!retirees.length) return [];
  const retiredIds = new Set(retirees.map(p => Number(p.id)));
  seed.players = seed.players.filter(player => !retiredIds.has(Number(player.id)));
  game.marketPlayers = (game.marketPlayers || []).filter(player => !retiredIds.has(Number(player.id)));
  retirees.forEach(player => {
    removePlayerFromCurrentTactic(player.id);
    delete game.playerCondition?.[player.id];
    delete game.playerMorale?.[player.id];
    delete game.playerSkillBoosts?.[player.id];
    delete game.trainingPlan?.[player.id];
    delete game.playerStats?.[player.id];
    delete game.playerStatus?.[player.id];
  });
  const names = retirees.slice(0,5).map(p => `${p.name} (${p.age})`).join(', ');
  pushGameMessage({
    type:'plantel',
    priority:'normal',
    title:'Retiros al finalizar la temporada',
    body:`${retirees.length === 1 ? 'Un jugador informó' : `${retirees.length} jugadores informaron`} su retiro del fútbol: ${names}${retirees.length > 5 ? '...' : ''}`
  });
  return retirees;
}
function nextPlayerId(){
  const ids = [0]
    .concat((seed?.players || []).map(p => Number(p.id) || 0))
    .concat((game?.marketPlayers || []).map(p => Number(p.id) || 0));
  return Math.max(...ids) + 1;
}
function generateSeasonYouthFreeAgents(count=SEASON_YOUTH_FREE_AGENT_COUNT){
  const activePlayers = (seed?.players || []).filter(player => player && !player.retired && !player.sold && Number(player.clubId || 0) >= 0);
  const generationContext = createPlayerGenerationContext(activePlayers.length + count, activePlayers);
  const players = [];
  let id = nextPlayerId();
  const season = Number(game?.seasonNumber || 1);
  for(let i=0;i<count;i++, id++){
    const group = pickPositionGroupForGeneration(id, `season-youth-${season}`, generationContext);
    const position = pickPositionFromGroup(group, id, `season-youth-${season}`);
    const player = generatedPlayerFactory({
      id,
      position,
      clubId:0,
      age:17 + hashNumber(`season-youth-age-${season}-${id}`, 7),
      prestige:48,
      nameContext:`Juveniles libres ${season}`,
      divisionName:'Juveniles libres',
      generationContext,
      salaryFactor:FREE_YOUTH_SALARY_FACTOR,
      freeAgent:true,
      youthFreeAgent:true
    });
    players.push(player);
  }
  return players;
}
function addSeasonYouthFreeAgents(count=SEASON_YOUTH_FREE_AGENT_COUNT){
  if(!game) return [];
  const newPlayers = generateSeasonYouthFreeAgents(count);
  game.marketPlayers = (game.marketPlayers || []).concat(newPlayers);
  mergeMarketPlayersIntoSeed(newPlayers);
  newPlayers.forEach(p => {
    game.playerCondition[p.id] = clamp(15 + hashNumber(`season-youth-cond-${p.id}`, 15), 1, 29);
    game.playerMorale[p.id] = clamp(35 + hashNumber(`season-youth-morale-${p.id}`, 55), 1, 99);
    game.playerSkillBoosts[p.id] = {};
    game.trainingPlan[p.id] = DEFAULT_TRAINING_TYPE;
    game.playerStats[p.id] = { playerId:p.id, clubId:p.clubId, goals:0, assists:0, yellow:0, red:0, played:0, injuries:0 };
  });
  pushGameMessage({ type:'mercado', title:'Nuevos juveniles libres', body:`Aparecieron ${newPlayers.length} jóvenes libres de 17 a 23 años en el mercado, con sueldos más bajos de lo normal.`, priority:'normal' });
  return newPlayers;
}
function finalizeSeasonIfNeeded(){
  if(!game || game.seasonFinalized || game.matchdayIndex < game.fixtures.length) return;
  game.managerStats = normalizeManagerStats(game.managerStats);
  const division = clubDivision(game.selectedClubId);
  const table = sortedStandings(division.id);
  const index = table.findIndex(row => row.clubId === game.selectedClubId);
  const row = table[index] || game.standings[game.selectedClubId] || {};
  const position = index >= 0 ? index + 1 : null;
  const champion = position === 1;
  const record = {
    season:game.seasonNumber || 1,
    clubId:game.selectedClubId,
    clubName:clubName(game.selectedClubId),
    divisionId:division.id,
    divisionName:division.name,
    position,
    label:champion ? 'Campeón' : (position ? `${position}°` : '—'),
    pts:row.pts || 0,
    pg:row.pg || 0,
    pe:row.pe || 0,
    pp:row.pp || 0,
    gf:row.gf || 0,
    gc:row.gc || 0,
    title:champion
  };
  if(!game.managerStats.seasons.some(s => s.season === record.season)){
    game.managerStats.seasons.push(record);
    if(champion) game.managerStats.titles += 1;
  }
  if(champion){
    pushGameMessage({ type:'deportivo', priority:'high', title:'Has salido campeón', body:`Felicitaciones: ${clubName(game.selectedClubId)} salió campeón de ${division.name}.`, id:`champion-${game.seasonNumber || 1}-${game.selectedClubId}` });
  }
  const salariesPaid = paySeasonSalaries();
  const salaryAdjustments = applySeasonSalaryAdjustments();
  const retirements = retireSeasonVeterans();
  const trainingDecay = decayTrainedSkillBoosts();
  game.seasonTransition = {
    season:game.seasonNumber || 1,
    userRecord:record,
    movements:computeSeasonMovements(),
    salariesPaid,
    salaryAdjustments,
    retirements,
    trainingDecay,
    agingApplied: (game.seasonNumber || 1) % 2 === 0
  };
  game.seasonFinalized = true;
  game.seasonPhase = 'finalized';
  game.seasonEndModalShown = false;
}
function applySeasonMovements(){
  const movements = game?.seasonTransition?.movements || [];
  const divisions = divisionOrderList();
  const byId = Object.fromEntries(divisions.map(d => [d.id, d]));
  movements.forEach(move => {
    const club = seed.clubs.find(c => c.id === move.clubId);
    const target = byId[move.toDivisionId];
    if(!club || !target) return;
    club.divisionId = target.id;
    club.divisionName = target.name;
    club.divisionOrder = target.order;
    club.prizeMultiplier = target.prizeMultiplier ?? divisionPrizeMultiplier(target.name, (target.order || 1)-1);
  });
  game.clubDivisionOverrides = snapshotClubDivisionOverrides();
}
function startNextSeason(selectedClubId){
  if(!game?.seasonFinalized) return;
  const retiredCount = game.seasonTransition?.retirements?.length || 0;
  applySeasonMovements();
  const aging = applyBiSeasonalAging();
  refreshAllPlayerClauses();
  const nextClubId = Number(selectedClubId || game.selectedClubId);
  game.selectedClubId = nextClubId;
  game.seasonNumber = (game.seasonNumber || 1) + 1;
  game.seasonFinalized = false;
  game.seasonTransition = null;
  game.seasonEndModalShown = false;
  game.seasonPhase = 'preseason';
  game.phaseTurn = 0;
  game.preseasonFriendliesPlayed = 0;
  game.pendingFriendlyOpponentId = 0;
  game.matchdayIndex = 0;
  game.fixtures = generateFixturesForDivisions(seed.clubs, divisionOrderList());
  game.currentDate = game.fixtures[0]?.date || game.currentDate;
  game.standings = createInitialStandings();
  game.playerStats = createInitialPlayerStats();
  game.matchHistory = [];
  game.lastOwnProblems = [];
  game.mustReviewTactics = false;
  game.seasonEndPlayerOffers = null;
  game.advanceLockedUntil = 0;
  game.lastBudgetDelta = 0;
  game.tactic = normalizeTactic(nextClubId, DEFAULT_TACTIC);
  mergeMarketPlayersIntoSeed(game.marketPlayers || []);
  addSeasonYouthFreeAgents(Math.max(SEASON_YOUTH_FREE_AGENT_COUNT, retiredCount));
  ensurePlayerStateForAll();
  pushGameMessage({ type:'deportivo', title:`Temporada ${game.seasonNumber} iniciada`, body:`Comienza una nueva temporada con ${clubName(game.selectedClubId)}.`, priority:'normal' });
  activeTab = 'home';
  closeModal();
  saveLocal(true);
  renderAll();
  showNotice(`Temporada ${game.seasonNumber} iniciada.`);
}
function seasonEndPanelMarkup(){
  const record = game?.seasonTransition?.userRecord;
  const movements = game?.seasonTransition?.movements || [];
  const retirements = game?.seasonTransition?.retirements || [];
  const salaryAdjustments = game?.seasonTransition?.salaryAdjustments || null;
  const moveRows = movements.map(move => `<li><strong>${escapeHtml(clubName(move.clubId))}</strong>: ${move.type === 'promotion' ? 'asciende' : 'desciende'} a ${escapeHtml(move.toDivisionName)}</li>`).join('');
  const retirementRows = retirements.map(p => `<li><strong>${escapeHtml(p.name)}</strong> se retiró del fútbol a los ${p.age} años.</li>`).join('');
  return `<div class="card season-end-card">
    <div class="row"><div><p class="label">Fin de temporada</p><h3>${record?.title ? 'Campeón' : `Posición final: ${escapeHtml(record?.label || '—')}`}</h3></div><span class="pill">Temporada ${game.seasonNumber || 1}</span></div>
    <p class="muted">Podés seguir en ${escapeHtml(clubName(game.selectedClubId))} o elegir otro club para la próxima temporada.</p>
    ${game.seasonTransition?.salariesPaid ? `<p class="tagline">Pago anual de sueldos descontado: <strong>${formatMoney(game.seasonTransition.salariesPaid)}</strong>.</p>` : ''}
    ${salaryAdjustments ? `<p class="tagline">Sueldos ajustados para la próxima temporada según partidos jugados: ${salaryAdjustments.increased || 0} suben, ${salaryAdjustments.decreased || 0} bajan.</p>` : ''}
    ${retirementRows ? `<ul class="season-movement-list">${retirementRows}</ul>` : ''}
    ${moveRows ? `<ul class="season-movement-list">${moveRows}</ul>` : ''}
    <div class="row" style="margin-top:12px"><button class="primary" data-continue-season>Seguir en este club</button><button class="ghost" data-open-season-modal>Cambiar club</button></div>
  </div>`;
}
function openSeasonEndModal(){
  if(!game?.seasonFinalized) return;
  const record = game.seasonTransition?.userRecord;
  const body = `<div class="season-end-modal">
    <p class="label">Fin de temporada ${game.seasonNumber || 1}</p>
    <h2>${record?.title ? 'Saliste campeón' : `Finalizaste ${escapeHtml(record?.label || '—')}`}</h2>
    <p class="muted">Elegí cómo continuar la próxima temporada.</p>
    <div class="row" style="margin-top:14px"><button id="btnContinueSameClub" class="primary">Seguir en ${escapeHtml(clubName(game.selectedClubId))}</button></div>
    <hr>
    <label for="seasonClubSelect">Cambiar de club</label>
    <select id="seasonClubSelect">${clubSelectOptionsMarkup()}</select>
    <div class="row" style="margin-top:12px"><button id="btnStartNextSeasonOther" class="ghost">Empezar nueva temporada con este club</button></div>
  </div>`;
  openModal(body);
  $('btnContinueSameClub')?.addEventListener('click', () => startNextSeason(game.selectedClubId));
  $('btnStartNextSeasonOther')?.addEventListener('click', () => startNextSeason(Number($('seasonClubSelect')?.value || game.selectedClubId)));
}

function renderAll(){
  document.querySelectorAll('.tabs button').forEach(btn=>btn.classList.toggle('active', btn.dataset.tab === activeTab));
  if(game){
    $('managerClub').innerHTML = `${clubBadge(game.selectedClubId)}<span>${escapeHtml(clubName(game.selectedClubId))}</span>`;
    $('managerClub').classList.add('side-club-name');
  }else{
    $('managerClub').textContent = 'Sin partida';
    $('managerClub').classList.remove('side-club-name');
  }
  refreshSidebarDate();
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
  if(activeTab === 'players') activeTab = 'market';
  const renderers = { home:renderHome, messages:renderMessages, market:renderMarket, firstTeam:renderFirstTeam, squad:renderSquad, tactics:renderTactics, training:renderTraining, stadium:renderStadium, employees:renderEmployees, fixture:renderFixture, standings:renderStandings, stats:renderStats, mystats:renderManagerStats, finance:renderFinances };
  (renderers[activeTab] || renderers.home)();
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
function turnModePanelMarkup(){
  if(!game || game.seasonFinalized) return '';
  if(isPreseason()){
    const remaining = Math.max(0, MAX_PRESEASON_FRIENDLIES - preseasonFriendliesPlayed());
    const options = seed.clubs
      .filter(c => c.id !== game.selectedClubId)
      .map(c => `<option value="${c.id}" ${Number(game.pendingFriendlyOpponentId || 0)===c.id?'selected':''}>${escapeHtml(c.name)} · ${escapeHtml(clubDivision(c.id).name)}</option>`)
      .join('');
    return `<div class="card preseason-card">
      <div class="row"><div><p class="label">Pretemporada</p><h3>Turno ${(game.phaseTurn || 0) + 1} de ${PRESEASON_TURNS}</h3></div><span class="pill">Amistosos restantes: ${remaining}</span></div>
      <p class="muted">Usá estos turnos para entrenar, recuperar forma física y preparar el plantel antes del inicio oficial.</p>
      <div class="grid cols-2" style="margin-top:10px">
        <div><label for="friendlyOpponentSelect">Amistoso opcional de este turno</label><select id="friendlyOpponentSelect" ${remaining <= 0 ? 'disabled' : ''}><option value="0">Sin amistoso</option>${options}</select></div>
        <div class="row" style="align-items:end"><button id="btnClearFriendly" class="ghost" ${Number(game.pendingFriendlyOpponentId || 0) ? '' : 'disabled'}>Quitar amistoso</button></div>
      </div>
    </div>`;
  }
  if(isPostseason()){
    return `<div class="card preseason-card"><div class="row"><div><p class="label">Postemporada</p><h3>Turno ${(game.phaseTurn || 0) + 1} de ${POSTSEASON_TURNS}</h3></div><span class="pill">Sin partidos oficiales</span></div><p class="muted">Últimos turnos de entrenamiento y recuperación antes del cierre formal de temporada.</p></div>`;
  }
  return '';
}

function featuredPlayerCard(type, player, label, valueText){
  if(!player){
    return `<div class="card featured-player-card empty"><p class="label">${escapeHtml(label)}</p><p class="muted">Sin jugador destacado todavía.</p></div>`;
  }
  const stats = game?.playerStats?.[player.id] || {};
  return `<button class="card featured-player-card clickable" data-player-id="${player.id}" type="button">
    ${faceImg(player, 'featured-player-face')}
    <div class="featured-player-info">
      <span class="featured-badge ${escapeHtml(type)}">${escapeHtml(label)}</span>
      <strong>${escapeHtml(player.name)}</strong>
      <span>${roleBadge(player.position)} · ${Number(player.age || 0) || '—'} años</span>
      <div class="featured-player-meta">
        <span>Media <b>${visibleOverall(player)}</b></span>
        ${valueText ? `<span>${valueText}</span>` : ''}
      </div>
    </div>
  </button>`;
}
function homeFeaturedPlayers(clubId, teamAverage){
  const squad = playersByClub(clubId);
  const stats = game?.playerStats || {};
  const scorer = squad.slice().sort((a,b)=>(Number(stats[b.id]?.goals || 0) - Number(stats[a.id]?.goals || 0)) || visibleOverall(b)-visibleOverall(a))[0] || null;
  const star = squad.slice().sort((a,b)=>visibleOverall(b)-visibleOverall(a) || currentMorale(b.id)-currentMorale(a.id))[0] || null;
  const promisePool = squad.filter(p => Number(p.age || 99) <= 23 && visibleOverall(p) > teamAverage);
  const promise = (promisePool.length ? promisePool : squad.filter(p => Number(p.age || 99) <= 23)).sort((a,b)=>visibleOverall(b)-visibleOverall(a) || a.age-b.age)[0] || null;
  return {
    scorer,
    star,
    promise,
    scorerText: scorer ? `Goles <b>${Number(stats[scorer.id]?.goals || 0)}</b>` : '',
    starText: star ? `Media general <b>${visibleOverall(star)}</b>` : '',
    promiseText: promise ? (visibleOverall(promise) > teamAverage ? `Promedio equipo <b>${teamAverage}</b>` : `En desarrollo`) : ''
  };
}

function renderHome(){
  const next = getNextMatchForSelected();
  const clubPlayers = playersByClub(game.selectedClubId);
  const avgOverall = Math.round(avg(clubPlayers.map(p=>visibleOverall(p))));
  const avgFitness = squadFitnessAverage(game.selectedClubId);
  const avgMorale = squadMoraleAverage(game.selectedClubId);
  const cohesion = cohesionValue(game.selectedClubId);
  const featured = homeFeaturedPlayers(game.selectedClubId, avgOverall);
  const injuredList = injuredPlayersByClub(game.selectedClubId);
  const myStanding = game.standings[game.selectedClubId] || { pts:0, pg:0, pe:0, pp:0, gf:0, gc:0 };
  const selectedClub = seed.clubs.find(c=>c.id===game.selectedClubId);
  const position = sortedStandings(selectedClub?.divisionId || null).findIndex(s=>s.clubId===game.selectedClubId)+1;
  const lastMatches = game.matchHistory.filter(m=>m.homeId===game.selectedClubId || m.awayId===game.selectedClubId).slice(-5).reverse();
  const problems = game.lastOwnProblems || [];
  const deltaClass = game.lastBudgetDelta > 0 ? 'ok' : game.lastBudgetDelta < 0 ? 'bad' : 'muted';
  const deltaText = game.lastBudgetDelta ? `${game.lastBudgetDelta > 0 ? '+' : ''}${formatMoney(game.lastBudgetDelta)}` : '—';
  const problemBox = problems.length ? `<div class="card blocker"><h3>Revisión obligatoria</h3><p>Hubo lesionados o expulsados propios en el último partido. Entrá a Táctica, reemplazalos y guardá una alineación válida.</p><div class="problem-list">${problems.map(problemItem).join('')}</div><button class="primary" data-go-tactics>Ir a táctica</button></div>` : '';
  const seasonBox = game.seasonFinalized ? seasonEndPanelMarkup() : '';
  view.innerHTML = `
    <div class="row section-title">
      <div class="home-message-strip">${homeMessagesSummary()}</div>
      <div class="advance-control"><button id="advanceBtn" class="primary">Avanzar fecha</button><div id="advanceProgressBox">${advanceProgressMarkup()}</div></div>
    </div>
    ${problemBox}
    ${seasonBox}
    ${turnModePanelMarkup()}
    <div class="card placeholder-main-card home-top-visual">
      <h3>Momento del club</h3>
      ${mainBannerMarkup()}
    </div>
    <div class="grid cols-4 dashboard-donut-grid" style="margin-top:14px">
      ${dashboardDonut('Media general', avgOverall, 99)}
      ${dashboardDonut('Estado físico', avgFitness, 99)}
      ${dashboardDonut('Moral', avgMorale, 99)}
      ${dashboardDonut('Cohesión', cohesion, 100)}
    </div>
    <div class="card featured-players-panel" style="margin-top:14px">
      <div class="row"><h3>Tus jugadores destacados</h3><span class="pill">Plantel actual</span></div>
      <div class="grid cols-3 featured-player-grid">
        ${featuredPlayerCard('scorer', featured.scorer, 'Goleador', featured.scorerText)}
        ${featuredPlayerCard('star', featured.star, 'Estrella', featured.starText)}
        ${featuredPlayerCard('promise', featured.promise, 'Promesa', featured.promiseText)}
      </div>
    </div>
    <div class="grid cols-3" style="margin-top:14px">
      <div class="card"><p class="label">Posición</p><div class="metric">${position || '—'}°</div></div>
      <div class="card"><p class="label">Jugadores</p><div class="metric">${clubPlayers.length}</div></div>
      <div class="card"><p class="label">Presupuesto</p><div class="metric small">${formatMoney(game.budget || 0)}</div><p class="small ${deltaClass}">Último balance: ${deltaText}</p></div>
    </div>
    <div class="card own-team-stats-card" style="margin-top:14px">
      <h3>Estadísticas de mi equipo</h3>
      <div class="grid cols-6 compact-team-stats">
        <div><p class="label">Puntos</p><strong>${myStanding.pts}</strong></div>
        <div><p class="label">Ganados</p><strong>${myStanding.pg}</strong></div>
        <div><p class="label">Empatados</p><strong>${myStanding.pe}</strong></div>
        <div><p class="label">Perdidos</p><strong>${myStanding.pp}</strong></div>
        <div><p class="label">GF</p><strong>${myStanding.gf}</strong></div>
        <div><p class="label">GC</p><strong>${myStanding.gc}</strong></div>
      </div>
    </div>
    <div class="card injury-home-card" style="margin-top:14px">
      <div class="row"><h3>Jugadores lesionados</h3><span class="pill">${injuredList.length} activo(s)</span></div>
      ${injuredList.length ? `<div class="injured-home-list">${injuredList.map(item => injuredHomeCard(item)).join('')}</div>` : '<p class="muted">No hay jugadores lesionados en el plantel.</p>'}
    </div>
    <div class="split" style="margin-top:14px">
      <div class="card">
        <h3>Próximo partido</h3>
        ${next ? matchPreview(next) : (isPostseason() ? '<p class="muted">Postemporada en curso. No hay partidos oficiales.</p>' : '<p class="muted">Temporada finalizada.</p>')}
      </div>
      <div class="card">
        <h3>Últimos partidos</h3>
        <div class="timeline">${lastMatches.length ? lastMatches.map(compactMatch).join('') : '<p class="muted">Aún no hay partidos jugados.</p>'}</div>
      </div>
    </div>

  `;
  $('advanceBtn')?.addEventListener('click', simulateNextMatchday);
  document.querySelector('[data-go-tactics]')?.addEventListener('click',()=>{ activeTab='tactics'; renderAll(); });
  document.querySelector('[data-continue-season]')?.addEventListener('click',()=>startNextSeason(game.selectedClubId));
  document.querySelector('[data-open-season-modal]')?.addEventListener('click',()=>openSeasonEndModal());
  document.querySelectorAll('.featured-player-card[data-player-id]').forEach(card => card.addEventListener('click',()=>showPlayerModal(Number(card.dataset.playerId))));
  $('friendlyOpponentSelect')?.addEventListener('change', (event)=>{ game.pendingFriendlyOpponentId = Number(event.target.value || 0); saveLocal(true); renderHome(); });
  $('btnClearFriendly')?.addEventListener('click', ()=>{ game.pendingFriendlyOpponentId = 0; saveLocal(true); renderHome(); });
  updateAdvanceButtonState();
}
function updateAdvanceButtonState(){
  const btn = $('advanceBtn');
  if(!btn || !game) return;
  const lockLeft = Math.max(0, (game.advanceLockedUntil || 0) - Date.now());
  const seasonEnded = game.seasonFinalized || seasonPhase() === 'finalized';
  const invalid = validateCurrentTactic(false);
  let text = isPreseason() ? 'Avanzar pretemporada' : isPostseason() ? 'Avanzar postemporada' : 'Domingo · jugar partido';
  let disabled = false;
  if(seasonEnded){ text = 'Temporada finalizada'; disabled = true; }
  else if(lockLeft > 0){ text = `${currentWeekdayLabel()} · preparando jornada`; disabled = true; }
  else if(isRegularSeason() && game.mustReviewTactics){ text = 'Reemplazar lesionados/suspendidos'; disabled = true; }
  else if(isRegularSeason() && invalid.length){ text = 'Táctica incompleta'; disabled = true; }
  btn.textContent = text;
  btn.disabled = disabled;
  const progressBox = $('advanceProgressBox');
  if(progressBox) progressBox.innerHTML = advanceProgressMarkup();
}
function advanceProgressPercent(){
  if(!game) return 0;
  const lockLeft = Math.max(0, (game.advanceLockedUntil || 0) - Date.now());
  if(lockLeft <= 0) return 100;
  return clamp(Math.round(((ADVANCE_LOCK_MS - lockLeft) / ADVANCE_LOCK_MS) * 100), 0, 100);
}
function advanceProgressMarkup(){
  if(!game) return '';
  const lockLeft = Math.max(0, (game.advanceLockedUntil || 0) - Date.now());
  const pct = advanceProgressPercent();
  const ready = isPreseason() ? 'Domingo · turno de pretemporada disponible' : isPostseason() ? 'Domingo · turno de postemporada disponible' : 'Domingo · partido disponible';
  const label = lockLeft > 0 ? `${currentWeekdayLabel()} · semana en curso` : ready;
  return `<div class="advance-progress"><div class="project-progress"><span style="width:${pct}%"></span></div><p class="small muted">${label}</p></div>`;
}
function formatClock(ms){
  const total = Math.ceil(ms/1000);
  const m = Math.floor(total/60);
  const s = String(total%60).padStart(2,'0');
  return `${m}:${s}`;
}
function currentWeekdayLabel(){
  if(!game) return '—';
  const lockLeft = Math.max(0, (game.advanceLockedUntil || 0) - Date.now());
  if(lockLeft <= 0) return 'Domingo';
  const elapsed = clamp(ADVANCE_LOCK_MS - lockLeft, 0, ADVANCE_LOCK_MS);
  const days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const index = clamp(Math.floor(elapsed / (ADVANCE_LOCK_MS / days.length)), 0, days.length - 1);
  return days[index];
}
function refreshSidebarDate(){
  if(!game){
    $('currentSeason') && ($('currentSeason').textContent = 'Temporada: —');
    $('currentDate').textContent = 'Fecha: —';
    $('currentRound').textContent = 'Jornada: —';
    return;
  }
  $('currentSeason') && ($('currentSeason').textContent = `Temporada: ${game.seasonNumber || 1}`);
  $('currentDate').textContent = `Día: ${currentWeekdayLabel()} · Fecha: ${game.currentDate}`;
  $('currentRound').textContent = phaseLabel();
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
  return `<button class="stat-rank clickable plain" data-match-id="${escapeHtml(m.id)}"><span>${clubBadge(m.homeId)} ${m.homeGoals} - ${m.awayGoals} ${clubBadge(m.awayId)}</span><strong class="${cls}">${gf > gc ? 'G' : gf < gc ? 'P' : 'E'}</strong></button>`;
}


function unreadMessagesCount(){
  return (game?.messages || []).filter(m => !m.read).length;
}
function pushGameMessage(message){
  if(!game) return null;
  game.messages = Array.isArray(game.messages) ? game.messages : [];
  const item = {
    id: message.id || `msg-${Date.now()}-${hashNumber(`${message.title || ''}-${game.messages.length}-${Math.random()}`, 1000000)}`,
    turn: game.matchdayIndex || 0,
    season: game.seasonNumber || 1,
    date: game.currentDate || '',
    read: false,
    priority: message.priority || 'normal',
    type: message.type || 'info',
    title: message.title || 'Mensaje',
    body: message.body || '',
    action: message.action || null,
    createdAt: Date.now()
  };
  game.messages.unshift(item);
  return item;
}
function markMessagesRead(){
  if(!game?.messages) return;
  game.messages.forEach(m => { m.read = true; });
}
function latestMessages(limit=3){
  return (game?.messages || []).slice(0, limit);
}
function homeMessagesSummary(){
  const items = latestMessages(3);
  const count = unreadMessagesCount();
  if(!items.length){
    return `<div class="home-messages-summary"><p class="label">Mensajes / eventos</p><h2>Sin mensajes nuevos</h2><p class="tagline">Los avisos deportivos, ofertas y eventos del club aparecerán acá.</p></div>`;
  }
  return `<div class="home-messages-summary clickable" data-open-messages>
    <div class="row"><div><p class="label">Mensajes / eventos</p><h2>${escapeHtml(items[0].title)}</h2></div>${count ? `<span class="pill warn">${count} nuevo(s)</span>` : '<span class="pill">Ver mensajes</span>'}</div>
    <p class="tagline">${escapeHtml(items[0].body)}</p>
  </div>`;
}
function renderMessages(){
  markMessagesRead();
  const rows = (game.messages || []).map(m => messageCard(m)).join('');
  view.innerHTML = `
    <div class="section-title"><h2>Mensajes</h2><p class="tagline">Eventos importantes, ofertas y avisos del club.</p></div>
    <div class="message-list">${rows || '<div class="card"><p class="muted">No hay mensajes todavía.</p></div>'}</div>`;
  document.querySelectorAll('[data-accept-offer]').forEach(btn => btn.addEventListener('click', () => acceptTransferOffer(btn.dataset.acceptOffer)));
  document.querySelectorAll('[data-reject-offer]').forEach(btn => btn.addEventListener('click', () => rejectTransferOffer(btn.dataset.rejectOffer)));
  saveLocal(true);
}
function messageCard(m){
  const action = m.action?.type === 'transferOffer' && m.action.status === 'pending'
    ? `<div class="row message-actions"><button class="primary" data-accept-offer="${escapeHtml(m.id)}">Aceptar oferta</button><button class="ghost" data-reject-offer="${escapeHtml(m.id)}">Rechazar</button></div>`
    : (m.action?.status ? `<span class="pill">${m.action.status === 'accepted' ? 'Aceptada' : 'Rechazada'}</span>` : '');
  return `<div class="card message-card ${m.read ? '' : 'unread'}">
    <div class="row"><div><p class="label">Temporada ${m.season || 1} · Jornada ${Number(m.turn || 0)+1}</p><h3>${escapeHtml(m.title)}</h3></div><span class="pill ${m.priority === 'high' ? 'warn' : ''}">${escapeHtml(m.type || 'info')}</span></div>
    <p>${escapeHtml(m.body)}</p>
    ${action}
  </div>`;
}
function hasPendingTransferOfferForPlayer(playerId){
  const id = Number(playerId);
  return (game?.messages || []).some(m => m.action?.type === 'transferOffer' && m.action.status === 'pending' && Number(m.action.playerId) === id);
}
function maybeGenerateTransferOffer(match){
  if(!game || !match) return;
  const roll = Math.random();
  if(roll > 0.28) return;
  const candidates = playersByClub(game.selectedClubId).filter(p => playerClauseFor(p) > 0 && !isUnavailable(p.id) && !hasPendingTransferOfferForPlayer(p.id));
  if(!candidates.length) return;
  candidates.sort((a,b)=>visibleOverall(b)-visibleOverall(a));
  const pool = candidates.slice(0, Math.min(12, candidates.length));
  const player = pool[hashNumber(`offer-${game.seasonNumber}-${game.matchdayIndex}-${match.id}`, pool.length)];
  const pct = 20 + hashNumber(`offer-pct-${player.id}-${Date.now()}`, 81);
  const amount = Math.round(refreshPlayerClause(player) * pct / 100);
  const foreignClub = FOREIGN_CLUBS[hashNumber(`foreign-${player.id}-${game.matchdayIndex}`, FOREIGN_CLUBS.length)];
  pushGameMessage({
    type:'mercado',
    priority:'high',
    title:`Oferta por ${playerLastName(player.name)}`,
    body:`${foreignClub} ofrece ${formatMoney(amount)} por ${player.name}. La oferta equivale al ${pct}% de su cláusula. Si aceptás, el jugador se va del club.`,
    action:{ type:'transferOffer', status:'pending', playerId:player.id, amount, foreignClub, pct }
  });
}
function seasonEndOfferScore(player){
  const st = game?.playerStats?.[player.id] || {};
  const goals = Number(st.goals || 0);
  const assists = Number(st.assists || 0);
  return (visibleOverall(player) * 2) + (goals * 18) + (assists * 14) + hashNumber(`season-end-score-${game?.seasonNumber || 1}-${player.id}`, 9);
}
function generateSeasonEndPlayerOffers(){
  if(!game || !isPostseason()) return [];
  const season = game.seasonNumber || 1;
  if(game.seasonEndPlayerOffers?.season === season) return [];
  const candidates = playersByClub(game.selectedClubId)
    .filter(p => playerClauseFor(p) > 0 && !isUnavailable(p.id) && !hasPendingTransferOfferForPlayer(p.id));
  if(!candidates.length){
    game.seasonEndPlayerOffers = { season, generatedAt:turnStamp({ action:'seasonEndPlayerOffers' }), count:0 };
    return [];
  }
  const stats = game.playerStats || {};
  const byScore = candidates.slice().sort((a,b)=>seasonEndOfferScore(b)-seasonEndOfferScore(a));
  const byGoals = candidates.slice().sort((a,b)=>Number(stats[b.id]?.goals || 0)-Number(stats[a.id]?.goals || 0) || visibleOverall(b)-visibleOverall(a));
  const byAssists = candidates.slice().sort((a,b)=>Number(stats[b.id]?.assists || 0)-Number(stats[a.id]?.assists || 0) || visibleOverall(b)-visibleOverall(a));
  const map = new Map();
  [...byScore.slice(0,12), ...byGoals.slice(0,8), ...byAssists.slice(0,8)].forEach(p => map.set(p.id, p));
  const pool = Array.from(map.values()).sort((a,b)=>seasonEndOfferScore(b)-seasonEndOfferScore(a));
  const targetCount = Math.min(pool.length, randomInt(SEASON_END_TRANSFER_OFFERS_MIN, SEASON_END_TRANSFER_OFFERS_MAX));
  const created = [];
  for(const player of pool){
    if(created.length >= targetCount) break;
    const st = stats[player.id] || {};
    const productionBonus = clamp((Number(st.goals || 0) + Number(st.assists || 0)) * 2, 0, 15);
    const pct = clamp(78 + hashNumber(`season-end-pct-${season}-${player.id}-${Date.now()}`, 43) + productionBonus, 78, 125);
    const amount = Math.round(refreshPlayerClause(player) * pct / 100);
    const foreignClub = FOREIGN_CLUBS[hashNumber(`season-end-foreign-${season}-${player.id}-${created.length}`, FOREIGN_CLUBS.length)];
    const msg = pushGameMessage({
      type:'mercado',
      priority:'high',
      title:`Oferta por ${playerLastName(player.name)}`,
      body:`${foreignClub} acercó una buena oferta de ${formatMoney(amount)} por ${player.name}. Si aceptás, el jugador se va del club.`,
      action:{ type:'transferOffer', status:'pending', playerId:player.id, amount, foreignClub, pct, origin:'season_end' }
    });
    if(msg) created.push(msg);
  }
  game.seasonEndPlayerOffers = { season, generatedAt:turnStamp({ action:'seasonEndPlayerOffers' }), count:created.length };
  return created;
}
function acceptTransferOffer(messageId){
  const msg = (game.messages || []).find(m => m.id === messageId);
  if(!msg || msg.action?.type !== 'transferOffer' || msg.action.status !== 'pending') return;
  const player = playerById(msg.action.playerId);
  if(!player || player.clubId !== game.selectedClubId){ showNotice('La oferta ya no está disponible.'); return; }
  recordBudgetChange(msg.action.amount || 0, `Venta de ${player.name}`, { type:'transfer_sale', playerId:player.id });
  player.clubId = -1;
  game.marketPlayers = (game.marketPlayers || []).map(p => p.id === player.id ? { ...p, clubId:-1, sold:true } : p);
  removePlayerFromCurrentTactic(player.id);
  msg.action.status = 'accepted';
  msg.body += ' Oferta aceptada.';
  saveLocal(true);
  showNotice(`${player.name} fue vendido por ${formatMoney(msg.action.amount || 0)}.`);
  renderMessages();
}
function rejectTransferOffer(messageId){
  const msg = (game.messages || []).find(m => m.id === messageId);
  if(!msg || msg.action?.type !== 'transferOffer' || msg.action.status !== 'pending') return;
  msg.action.status = 'rejected';
  saveLocal(true);
  renderMessages();
}
function removePlayerFromCurrentTactic(playerId){
  if(!game?.tactic) return;
  const id = Number(playerId);
  const starters = (game.tactic.starters || []).map(x => Number(x) === id ? 0 : x);
  const bench = (game.tactic.bench || []).filter(x => Number(x) !== id);
  const autoSubs = (game.tactic.autoSubs || []).map(rule => ({...rule, outId:Number(rule.outId)===id?0:rule.outId, inId:Number(rule.inId)===id?0:rule.inId}));
  game.tactic = applyStarterMentalities({ ...game.tactic, starters, bench, autoSubs });
}
function generateMarketPlayers(count=50){
  const startId = Math.max(0, ...(seed?.players || []).map(p => Number(p.id) || 0)) + 1000;
  const activePlayers = (seed?.players || []).filter(player => player && !player.retired && !player.sold && Number(player.clubId || 0) >= 0);
  const generationContext = createPlayerGenerationContext(activePlayers.length + count, activePlayers);
  const players = [];
  for(let i=0;i<count;i++){
    const id = startId + i;
    const group = pickPositionGroupForGeneration(id, 'market', generationContext);
    const position = pickPositionFromGroup(group, id, 'market');
    const player = generatedPlayerFactory({
      id,
      position,
      clubId:0,
      age:18 + hashNumber(`market-age-${id}`, 18),
      prestige:52,
      nameContext:'Mercado Libre',
      divisionName:'Mercado',
      generationContext,
      salaryFactor:MARKET_FREE_AGENT_SALARY_FACTOR,
      freeAgent:true
    });
    players.push(player);
  }
  return players;
}
function mergeMarketPlayersIntoSeed(players=[]){
  if(!seed?.players) return;
  const existing = new Set(seed.players.map(p => Number(p.id)));
  players.forEach(p => {
    if(!existing.has(Number(p.id))){ seed.players.push(p); existing.add(Number(p.id)); }
    else {
      const idx = seed.players.findIndex(x => Number(x.id) === Number(p.id));
      if(idx >= 0) seed.players[idx] = { ...seed.players[idx], ...p };
    }
  });
}

function firstTeamTabsMarkup(current){
  const tabs = [
    ['tactics','Táctica'],
    ['squad','Plantel'],
    ['training','Entrenamiento']
  ];
  return `<div class="card first-team-tabs"><div class="subtabs">${tabs.map(([key,label])=>`<button class="${current===key?'active':''}" data-first-team-tab="${key}">${label}</button>`).join('')}</div></div>`;
}
function bindFirstTeamTabs(){
  document.querySelectorAll('[data-first-team-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      firstTeamTab = btn.dataset.firstTeamTab || 'tactics';
      renderFirstTeam();
    });
  });
}
function prependFirstTeamTabs(current){
  if(activeTab !== 'firstTeam') return;
  firstTeamTab = current;
  view.insertAdjacentHTML('afterbegin', firstTeamTabsMarkup(current));
  bindFirstTeamTabs();
}
function renderFirstTeam(){
  if(firstTeamTab === 'squad') return renderSquad();
  if(firstTeamTab === 'training') return renderTraining();
  return renderTactics();
}

function marketTabsMarkup(){
  return `<div class="card market-tabs"><div class="subtabs"><button class="${marketSubTab==='free'?'active':''}" data-market-tab="free">Jugadores libres</button><button class="${marketSubTab==='contracted'?'active':''}" data-market-tab="contracted">Jugadores contratados</button></div></div>`;
}
function bindMarketTabs(){
  document.querySelectorAll('[data-market-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      marketSubTab = btn.dataset.marketTab || 'free';
      renderMarket();
    });
  });
}
function contractedMarketPlayers(){
  return seed.players
    .filter(p => !p.retired && !p.sold && Number(p.clubId || 0) > 0 && Number(p.clubId) !== Number(game.selectedClubId))
    .slice()
    .sort((a,b)=>visibleOverall(b)-visibleOverall(a) || a.name.localeCompare(b.name,'es'));
}
function renderMarket(){
  mergeMarketPlayersIntoSeed(game.marketPlayers || []);
  ensurePlayerStateForAll();
  if(marketSubTab !== 'contracted') marketSubTab = 'free';
  if(marketSubTab === 'contracted') return renderContractedMarket();
  const free = (game.marketPlayers || []).filter(p => Number(p.clubId || 0) === 0 && !p.sold).slice().sort((a,b)=>visibleOverall(b)-visibleOverall(a));
  const rows = free.map(p => `<tr>
    <td>${faceImg(p, 'photo-thumb')}</td>
    <td><button class="linklike" data-player-id="${p.id}"><strong>${escapeHtml(p.name)}</strong></button></td>
    <td><span class="pill role-pill">${roleBadge(p.position)}</span></td>
    <td>${Number(p.age || 0) || '—'}</td>
    <td>${nationalityShortMarkup(p.nationality)}</td>
    <td>${visibleOverall(p)}</td>
    <td>${conditionBar(p.id)}</td>
    <td>${moraleBar(p.id)}</td>
    <td>${formatMoney(p.salary || 0)}</td>
    <td><button class="primary small-btn" data-hire-free-agent="${p.id}">Contratar</button></td>
  </tr>`).join('');
  view.innerHTML = `
    <div class="section-title"><h2>Mercado</h2><p class="tagline">Jugadores libres y jugadores contratados disponibles para negociar.</p></div>
    ${marketTabsMarkup()}
    <div class="table-wrap"><table><thead><tr><th>Foto</th><th>Jugador</th><th>Rol</th><th>Edad</th><th>Nac.</th><th>Media</th><th>Físico</th><th>Moral</th><th>Sueldo</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="10" class="muted">No quedan jugadores libres.</td></tr>'}</tbody></table></div>`;
  bindMarketTabs();
  document.querySelectorAll('[data-hire-free-agent]').forEach(btn => btn.addEventListener('click', () => hireFreeAgent(Number(btn.dataset.hireFreeAgent))));
}
function renderContractedMarket(){
  const players = contractedMarketPlayers();
  const rows = players.map(p => `<tr>
    <td>${faceImg(p, 'photo-thumb')}</td>
    <td><button class="linklike" data-player-id="${p.id}"><strong>${escapeHtml(p.name)}</strong></button></td>
    <td><span class="pill role-pill">${roleBadge(p.position)}</span></td>
    <td>${Number(p.age || 0) || '—'}</td>
    <td>${nationalityShortMarkup(p.nationality)}</td>
    <td>${clubBadge(p.clubId)} ${escapeHtml(clubName(p.clubId))}</td>
    <td>${visibleOverall(p)}</td>
    <td>${formatMoney(p.clause || p.value || 0)}</td>
    <td>${formatMoney(p.salary || 0)}</td>
    <td><button class="primary small-btn" data-make-player-offer="${p.id}">Hacer oferta</button></td>
  </tr>`).join('');
  view.innerHTML = `
    <div class="section-title"><h2>Mercado</h2><p class="tagline">Jugadores de otros clubes. Podés iniciar una negociación desde esta pestaña.</p></div>
    ${marketTabsMarkup()}
    <div class="table-wrap"><table><thead><tr><th>Foto</th><th>Jugador</th><th>Rol</th><th>Edad</th><th>Nac.</th><th>Equipo</th><th>Media</th><th>Cláusula</th><th>Sueldo</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="10" class="muted">No hay jugadores contratados para mostrar.</td></tr>'}</tbody></table></div>`;
  bindMarketTabs();
  document.querySelectorAll('[data-make-player-offer]').forEach(btn => btn.addEventListener('click', () => openPurchaseOfferModal(Number(btn.dataset.makePlayerOffer))));
}

function hireFreeAgent(playerId){
  const idx = (game.marketPlayers || []).findIndex(p => Number(p.id) === Number(playerId) && Number(p.clubId || 0) === 0 && !p.sold);
  if(idx < 0) return;
  game.marketPlayers[idx].clubId = game.selectedClubId;
  game.marketPlayers[idx].freeAgent = false;
  mergeMarketPlayersIntoSeed(game.marketPlayers);
  const player = playerById(playerId);
  if(player){ player.clubId = game.selectedClubId; player.freeAgent = false; refreshPlayerClause(player); }
  refreshPlayerClause(game.marketPlayers[idx]);
  game.playerCondition[playerId] = clamp(game.playerCondition[playerId] || (15 + hashNumber(`free-cond-${playerId}`, 15)), 1, 29);
  if(!Number.isFinite(game.playerMorale[playerId])) game.playerMorale[playerId] = 35 + hashNumber(`free-morale-${playerId}`, 55);
  ensurePlayerStateForAll();
  pushGameMessage({ type:'mercado', title:'Jugador libre contratado', body:`${player?.name || 'El jugador'} se incorporó al plantel como agente libre.`, priority:'normal' });
  saveLocal(true);
  showNotice(`${player?.name || 'Jugador'} contratado.`);
  renderMarket();
}

function sortPlayersForView(players, sortKey){
  const byName = (a,b) => a.name.localeCompare(b.name, 'es');
  const byNameDesc = (a,b) => b.name.localeCompare(a.name, 'es');
  const byNationality = (a,b) => a.nationality.localeCompare(b.nationality, 'es') || byName(a,b);
  const byNationalityDesc = (a,b) => b.nationality.localeCompare(a.nationality, 'es') || byName(a,b);
  const byValueAsc = (a,b) => (a.value || 0) - (b.value || 0) || byName(a,b);
  const byValueDesc = (a,b) => (b.value || 0) - (a.value || 0) || byName(a,b);
  const byAgeAsc = (a,b) => Number(a.age || 0) - Number(b.age || 0) || byName(a,b);
  const byAgeDesc = (a,b) => Number(b.age || 0) - Number(a.age || 0) || byName(a,b);
  const byDorsalAsc = (a,b) => jerseyNumber(a.id) - jerseyNumber(b.id) || byName(a,b);
  const byDorsalDesc = (a,b) => jerseyNumber(b.id) - jerseyNumber(a.id) || byName(a,b);
  const byStatusAvailable = (a,b) => Number(isUnavailable(a.id)) - Number(isUnavailable(b.id)) || byName(a,b);
  const byStatusUnavailable = (a,b) => Number(isUnavailable(b.id)) - Number(isUnavailable(a.id)) || byName(a,b);
  const sorters = {
    nombre_asc:byName,
    nombre_desc:byNameDesc,
    dorsal_asc:byDorsalAsc,
    dorsal_desc:byDorsalDesc,
    media_desc:(a,b)=>visibleOverall(b)-visibleOverall(a) || byName(a,b),
    media_asc:(a,b)=>visibleOverall(a)-visibleOverall(b) || byName(a,b),
    condicion_desc:(a,b)=>currentCondition(b.id)-currentCondition(a.id) || byName(a,b),
    condicion_asc:(a,b)=>currentCondition(a.id)-currentCondition(b.id) || byName(a,b),
    moral_desc:(a,b)=>currentMorale(b.id)-currentMorale(a.id) || byName(a,b),
    moral_asc:(a,b)=>currentMorale(a.id)-currentMorale(b.id) || byName(a,b),
    resistencia_desc:(a,b)=>visibleStats(b).Resistencia-visibleStats(a).Resistencia || byName(a,b),
    resistencia_asc:(a,b)=>visibleStats(a).Resistencia-visibleStats(b).Resistencia || byName(a,b),
    estado_disponible:byStatusAvailable,
    estado_no_disponible:byStatusUnavailable,
    valor_asc:byValueAsc,
    valor_desc:byValueDesc,
    edad_asc:byAgeAsc,
    edad_desc:byAgeDesc,
    nacionalidad_asc:byNationality,
    nacionalidad_desc:byNationalityDesc
  };
  return players.slice().sort(sorters[sortKey] || sorters.media_desc);
}
function sortedSquadPlayers(){
  return sortPlayersForView(playersByClub(game.selectedClubId), squadSort);
}
function sortedTrainingPlayers(){
  return sortPlayersForView(playersByClub(game.selectedClubId), trainingSort);
}
function columnSort(label, options){
  const opts = ['<option value="">—</option>'].concat(options.map(([value,text])=>`<option value="${value}" ${squadSort===value?'selected':''}>${text}</option>`)).join('');
  return `<div class="th-filter"><span>${label}</span><select data-squad-sort>${opts}</select></div>`;
}

function trainingColumnSort(label, options){
  const opts = ['<option value="">—</option>'].concat(options.map(([value,text])=>`<option value="${value}" ${trainingSort===value?'selected':''}>${text}</option>`)).join('');
  return `<div class="th-filter"><span>${label}</span><select data-training-sort>${opts}</select></div>`;
}

function worldPlayerTeamMarkup(player){
  const clubId = Number(player.clubId || 0);
  if(clubId > 0){
    return `<button class="linklike team-cell" data-club-id="${clubId}">${clubBadge(clubId)}<span>${escapeHtml(clubName(clubId))}</span></button>`;
  }
  if(clubId < 0 || player.sold) return '<span class="pill">Exterior</span>';
  return '<span class="pill">Agente libre</span>';
}
function worldPlayersPositionOptions(){
  const positions = ['all','POR','LD','LI','DFC','MCD','MC','MCO','ED','EI','DC'];
  return positions.map(pos => `<option value="${pos}" ${worldPlayersPositionFilter===pos?'selected':''}>${pos==='all'?'Todas':pos}</option>`).join('');
}
function worldPlayersClubOptions(){
  const clubs = (seed.clubs || []).slice().sort((a,b)=>a.name.localeCompare(b.name,'es'));
  const fixed = [
    `<option value="all" ${worldPlayersClubFilter==='all'?'selected':''}>Todos</option>`,
    `<option value="free" ${worldPlayersClubFilter==='free'?'selected':''}>Agentes libres</option>`,
    `<option value="foreign" ${worldPlayersClubFilter==='foreign'?'selected':''}>Exterior</option>`
  ];
  return fixed.concat(clubs.map(c => `<option value="${c.id}" ${String(worldPlayersClubFilter)===String(c.id)?'selected':''}>${escapeHtml(c.name)}</option>`)).join('');
}
function worldPlayerFilterList(players){
  return players.filter(player => {
    if(worldPlayersPositionFilter !== 'all' && player.position !== worldPlayersPositionFilter) return false;
    const clubId = Number(player.clubId || 0);
    if(worldPlayersClubFilter === 'free') return clubId === 0 && !player.sold;
    if(worldPlayersClubFilter === 'foreign') return clubId < 0 || player.sold;
    if(worldPlayersClubFilter !== 'all') return clubId === Number(worldPlayersClubFilter);
    return true;
  });
}
function worldPlayersColumnSort(label, options){
  const opts = ['<option value="">—</option>'].concat(options.map(([value,text])=>`<option value="${value}" ${worldPlayersSort===value?'selected':''}>${text}</option>`)).join('');
  return `<div class="th-filter"><span>${label}</span><select data-world-sort>${opts}</select></div>`;
}
function worldStatCell(player, key){
  const map = scoutingStatMap(player);
  const visible = scoutingVisibleKeys(player);
  return visible.has(key) ? `<strong>${map[key]}</strong>` : '<span class="muted">—</span>';
}
function worldPlayerRow(player){
  return `<tr class="${Number(player.clubId || 0) === game.selectedClubId ? 'own-player-row' : ''}">
    <td>${faceImg(player, 'photo-thumb')}</td>
    <td><button class="linklike" data-player-id="${player.id}"><strong>${escapeHtml(player.name)}</strong></button></td>
    <td><span class="pill role-pill">${roleBadge(player.position)}</span></td>
    <td>${Number(player.age || 0) || '—'}</td>
    <td>${worldPlayerTeamMarkup(player)}</td>
    <td>${formatMoney(player.clause || player.value || 0)}</td>
    <td>${formatMoney(player.salary || 0)}</td>
    <td>${worldStatCell(player,'Ataque/Salto')}</td>
    <td>${worldStatCell(player,'Defensa')}</td>
    <td>${worldStatCell(player,'Pase')}</td>
    <td>${worldStatCell(player,'Velocidad/Reflejos')}</td>
    <td>${worldStatCell(player,'Cabezazo/Mando')}</td>
    <td>${worldStatCell(player,'Tiro/Potencia')}</td>
    <td>${worldStatCell(player,'Resistencia')}</td>
  </tr>`;
}
function renderWorldPlayers(){
  mergeMarketPlayersIntoSeed(game.marketPlayers || []);
  ensurePlayerStateForAll();
  const basePlayers = seed.players.filter(p => !p.retired);
  const filtered = worldPlayerFilterList(basePlayers);
  const players = sortPlayersForView(filtered, worldPlayersSort);
  const rows = players.map(worldPlayerRow).join('');
  view.innerHTML = `
    <div class="section-title">
      <h2>Jugadores</h2>
      <p class="tagline">Listado mundial. La mayor parte de las habilidades se oculta y vuelve a sortearse en cada turno.</p>
    </div>
    <div class="card world-player-filters">
      <label>Posición<select id="worldPositionFilter">${worldPlayersPositionOptions()}</select></label>
      <label>Equipo<select id="worldClubFilter">${worldPlayersClubOptions()}</select></label>
      <span class="pill">${players.length} jugador(es)</span>
    </div>
    <div class="table-wrap world-players-wrap"><table class="world-players-table"><thead><tr>
      <th>Foto</th>
      <th>${worldPlayersColumnSort('Nombre', [['nombre_asc','A-Z'],['nombre_desc','Z-A']])}</th>
      <th>Pos.</th>
      <th>${worldPlayersColumnSort('Edad', [['edad_asc','Menor'],['edad_desc','Mayor']])}</th>
      <th>Equipo</th>
      <th>${worldPlayersColumnSort('Cláusula', [['valor_desc','Mayor'],['valor_asc','Menor']])}</th>
      <th>Sueldo</th>
      <th>Ataque/Salto</th>
      <th>Defensa</th>
      <th>Pase</th>
      <th>Vel./Ref.</th>
      <th>Cab./Mando</th>
      <th>Tiro/Pot.</th>
      <th>Resist.</th>
    </tr></thead><tbody>${rows || '<tr><td colspan="14" class="muted">No hay jugadores para mostrar.</td></tr>'}</tbody></table></div>`;
  $('worldPositionFilter')?.addEventListener('change', event => { worldPlayersPositionFilter = event.target.value || 'all'; renderWorldPlayers(); });
  $('worldClubFilter')?.addEventListener('change', event => { worldPlayersClubFilter = event.target.value || 'all'; renderWorldPlayers(); });
  document.querySelectorAll('[data-world-sort]').forEach(select => {
    select.addEventListener('change', () => {
      if(select.value){ worldPlayersSort = select.value; renderWorldPlayers(); }
    });
  });
}

function renderSquad(){
  const players = sortedSquadPlayers();
  const rows = players.map(p=>`
    <tr class="${isUnavailable(p.id) ? 'dim-row' : ''}">
      <td>${faceImg(p, 'photo-thumb')}</td>
      <td><button class="linklike" data-player-id="${p.id}"><strong>${escapeHtml(p.name)}</strong></button></td>
      <td>#${jerseyNumber(p.id)}</td>
      <td>${Number(p.age || 0) || '—'}</td>
      <td><span class="pill role-pill">${roleBadge(p.position)}</span></td>
      <td>${nationalityShortMarkup(p.nationality)}</td>
      <td><strong>${visibleOverall(p)}</strong></td>
      <td>${conditionBar(p.id)}</td>
      <td>${moraleBar(p.id)}</td>
      <td>${visibleStats(p).Resistencia}</td>
      <td>${availabilityStatusMarkup(p.id)}</td>
      <td>${formatMoney(p.clause || p.value || 0)}</td>
    </tr>`).join('');
  view.innerHTML = `
    <div class="section-title"><h2>Plantel</h2><p class="tagline">Cada jugador es clickeable. La media se calcula sólo con habilidades visibles. Los controles de orden están en la cabecera de cada columna.</p></div>
    <div class="table-wrap"><table class="squad-table"><thead><tr>
      <th>Foto</th>
      <th>${columnSort('Jugador', [['nombre_asc','A-Z'],['nombre_desc','Z-A']])}</th>
      <th>${columnSort('Dorsal', [['dorsal_asc','Menor a mayor'],['dorsal_desc','Mayor a menor']])}</th>
      <th>${columnSort('Edad', [['edad_asc','Menor a mayor'],['edad_desc','Mayor a menor']])}</th>
      <th>Rol</th>
      <th>${columnSort('Nacionalidad', [['nacionalidad_asc','A-Z'],['nacionalidad_desc','Z-A']])}</th>
      <th>${columnSort('Media', [['media_desc','Mayor a menor'],['media_asc','Menor a mayor']])}</th>
      <th>${columnSort('Estado físico', [['condicion_desc','Mayor a menor'],['condicion_asc','Menor a mayor']])}</th>
      <th>${columnSort('Moral', [['moral_desc','Mayor a menor'],['moral_asc','Menor a mayor']])}</th>
      <th>${columnSort('Resistencia', [['resistencia_desc','Mayor a menor'],['resistencia_asc','Menor a mayor']])}</th>
      <th>${columnSort('Estado', [['estado_disponible','Disponibles primero'],['estado_no_disponible','No disponibles primero']])}</th>
      <th>${columnSort('Cláusula', [['valor_desc','Mayor a menor'],['valor_asc','Menor a mayor']])}</th>
    </tr></thead><tbody>${rows}</tbody></table></div>
  `;
  prependFirstTeamTabs('squad');
  document.querySelectorAll('[data-squad-sort]').forEach(select => {
    select.addEventListener('change', e => {
      if(e.target.value){ squadSort = e.target.value; renderSquad(); }
    });
  });
}
function playerDragCard(p, extra=''){
  const statusIcons = availabilityIcons(p.id);
  const unavailableClass = isUnavailable(p.id) ? 'injured-card' : '';
  const playableInjuredClass = canUseInjuredAsSub(p.id) ? 'playable-injured-card' : '';
  return `<div class="drag-player ${playerGroupClass(p.position)} ${extra} ${unavailableClass} ${playableInjuredClass}" draggable="true" data-drag-player="${p.id}">
    ${faceImg(p, 'drag-face')}
    <div><strong>${statusIcons}${escapeHtml(playerLastName(p.name))}</strong><span>#${jerseyNumber(p.id)} · ${roleBadge(p.position)} · ${Number(p.age || 0) || '—'} años · ${visibleOverall(p)} · Fís. ${currentCondition(p.id)}/99 · Mor. ${currentMorale(p.id)}/99</span></div>
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
      <button class="player-chip ${playerGroupClass(slot.player.position)} ${fit ? '' : 'out-zone'}" draggable="true" data-drag-player="${slot.player.id}" title="${fit ? 'Zona correcta' : 'Fuera de zona: rinde al 50%'}">
        <span class="jersey-dot">${jerseyNumber(slot.player.id)}</span>
        <span class="player-chip-name">${escapeHtml(playerLastName(slot.player.name))}</span>
      </button>` : `<div class="empty-slot ${slotGroup(slot.slot)}"><strong>${slot.slot}</strong><span>Arrastrar</span></div>`;
    return `<div class="pitch-slot" style="left:${slot.x}%; top:${slot.y}%" data-drop-slot="${slot.index}">${chip}</div>`;
  }).join('');
  const starterList = pitchSlots(game.tactic).map(slot => {
    const p = slot.player;
    const fit = p ? playerFitsSlot(p, slot.slot) : false;
    return `<div class="lineup-row ${p && !fit ? 'bad-zone' : ''}">
      <span class="pill">${slot.index+1}. ${slot.slot}</span>
      <span>${p ? `<button class="linklike" data-player-id="${p.id}">${escapeHtml(p.name)}</button>` : '<span class="muted">Vacío</span>'}</span>
      <span class="age-cell">${p ? `${Number(p.age || 0) || '—'} años` : '—'}</span>
      ${p ? conditionBar(p.id) : '<span></span>'}
      ${p ? moraleBar(p.id) : '<span></span>'}
      <strong>${p ? (isInjured(p.id) ? tacticStatusIcon(p.id) : fit ? 'OK' : '50%') : '—'}</strong>
    </div>`;
  }).join('');
  view.innerHTML = `
    <div class="section-title"><h2>Táctica y convocatoria</h2><p class="tagline">Arrastrá jugadores a los círculos de la pizarra. Si un jugador juega fuera de su zona natural, su rendimiento de partido se penaliza al 50%.</p></div>
    <div class="card tactic-board-card">
      <div class="row tactic-top-row"><div><h3>Cancha táctica</h3><p class="muted small">Formación ${game.tactic.formation}</p></div><div class="formation-box"><label>Formación</label><select id="formation">${formationOptions}</select></div><div class="tactic-autopick-row"><button id="autoPickBestBtn" class="ghost">Mejor once</button><button id="autoPickConditionBtn" class="ghost">Mejor condición física</button></div></div>
      <div class="pitch-board centered">${pitch}</div>
    </div>
    <div class="grid cols-2 tactic-lists" style="margin-top:14px">
      <div class="card">
        <h3>Titulares</h3>
        <div class="lineup-row lineup-head"><span>Pos.</span><span>Jugador</span><span>Edad</span><span>Físico</span><span>Moral</span><span>Estado</span></div>
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
      <p class="muted small">Elegí reglas simples: cansados, mejores suplentes o sólo cambios obligados por lesión.</p>
      <div class="autosub-grid">${[0,1,2,3,4].map(i => autoSubRow(i)).join('')}</div>
    </div>
    <div class="card match-instructions-card" style="margin-top:14px">
      <h3>Instrucciones de partido</h3>
      <p class="muted small">El simulador 2.0 usa estas instrucciones según el resultado parcial del partido.</p>
      <div class="instruction-grid">${matchInstructionControls()}</div>
    </div>
    <div class="row sticky-actions"><button id="saveTactic" class="primary">Guardar táctica</button><span id="tacticErrors" class="bad small"></span></div>
  `;
  prependFirstTeamTabs('tactics');
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
  $('autoPickBestBtn').addEventListener('click', () => {
    game.tactic.formation = $('formation').value;
    const starters = autoSelectStarters(game.selectedClubId, game.tactic).map(p=>p.id);
    game.tactic.starters = starters;
    game.tactic.bench = autoSelectBench(game.selectedClubId, starters).map(p=>p.id);
    game.tactic.autoSubs = defaultAutoSubs(game.tactic.starters, game.tactic.bench);
    game.tactic = applyStarterMentalities(game.tactic);
    saveLocal(true);
    renderTactics();
  });
  $('autoPickConditionBtn').addEventListener('click', () => {
    game.tactic.formation = $('formation').value;
    const starters = autoSelectByBestCondition(game.selectedClubId).map(p=>p.id);
    game.tactic.starters = starters;
    game.tactic.bench = autoSelectBenchByBestCondition(game.selectedClubId, starters).map(p=>p.id);
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
  const benchAllowed = canBeBench(p.id);
  const roleDisabled = isSuspended(p.id) || (isInjured(p.id) && !benchAllowed);
  const mentalityText = current === 'starter' ? playerMentality(p.id) : '—';
  return `<tr class="${unavailable ? 'dim-row' : ''}">
    <td><button class="linklike" data-player-id="${p.id}"><strong>${escapeHtml(p.name)}</strong></button></td>
    <td>#${jerseyNumber(p.id)}</td>
    <td>${Number(p.age || 0) || '—'}</td>
    <td><span class="pill role-pill">${roleBadge(p.position)}</span></td>
    <td><strong>${visibleOverall(p)}</strong></td>
    <td>${currentCondition(p.id)}/99</td>
    <td>${availabilityStatusMarkup(p.id)}</td>
    <td><select class="role-select" data-role-player="${p.id}" ${roleDisabled ? 'disabled' : ''}>
      <option value="reserve" ${current==='reserve'?'selected':''}>Reserva</option>
      <option value="starter" ${current==='starter'?'selected':''}>Titular</option>
      <option value="bench" ${current==='bench'?'selected':''}>Suplente</option>
    </select></td>
    <td>${current === 'starter' ? mentalityMarker(mentalityText) + ' ' + escapeHtml(mentalityText) : '<span class="muted">Sólo titulares</span>'}</td>
  </tr>`;
}
function matchInstructionControls(){
  const current = window.Simulator20?.normalizeMatchInstructions
    ? window.Simulator20.normalizeMatchInstructions(game.tactic?.matchInstructions)
    : { winning:'normal', drawing:'normal', losing:'normal' };
  const options = window.MATCH_INSTRUCTION_OPTIONS || [
    { value:'lower', label:'Bajar el ritmo' },
    { value:'normal', label:'Normal' },
    { value:'push', label:'Subir ritmo' }
  ];
  const row = (key, label) => `<div class="instruction-control"><label>${label}</label><select data-match-instruction="${key}">${options.map(opt=>`<option value="${opt.value}" ${current[key]===opt.value?'selected':''}>${opt.label}</option>`).join('')}</select></div>`;
  return row('winning','Ganando') + row('drawing','Empatando') + row('losing','Perdiendo');
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
    <div><label>Tipo</label><select data-sub-trigger="${index}">${triggerOpts}</select></div>
  </div>`;
}
function saveTacticFromScreen(){
  const autoSubs = [0,1,2,3,4].map(i => ({
    outId: Number(document.querySelector(`[data-sub-out="${i}"]`)?.value || 0),
    inId: Number(document.querySelector(`[data-sub-in="${i}"]`)?.value || 0),
    trigger: document.querySelector(`[data-sub-trigger="${i}"]`)?.value || 'tired'
  }));
  const selectedInstructions = {
    winning: document.querySelector('[data-match-instruction="winning"]')?.value || 'normal',
    drawing: document.querySelector('[data-match-instruction="drawing"]')?.value || 'normal',
    losing: document.querySelector('[data-match-instruction="losing"]')?.value || 'normal'
  };
  const nextTactic = applyStarterMentalities({
    formation:$('formation')?.value || game.tactic.formation,
    starters:game.tactic.starters.slice(0,11),
    bench:game.tactic.bench.slice(0,10),
    autoSubs,
    playerMentalities:{ ...(game.tactic.playerMentalities || {}) },
    matchInstructions: window.Simulator20?.normalizeMatchInstructions ? window.Simulator20.normalizeMatchInstructions(selectedInstructions) : selectedInstructions
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
  const starters = (tactic.starters || []).map(Number).filter(Boolean);
  const bench = (tactic.bench || []).map(Number).filter(Boolean);
  const uniqueStarters = new Set(starters);
  const uniqueBench = new Set(bench);
  if(starters.length !== 11 || uniqueStarters.size !== 11) errors.push('Necesitás exactamente 11 titulares.');
  if(bench.length !== 10 || uniqueBench.size !== 10) errors.push('Necesitás exactamente 10 suplentes.');
  const duplicated = [...uniqueStarters].filter(id => uniqueBench.has(id));
  if(duplicated.length) errors.push('Un jugador no puede ser titular y suplente a la vez.');
  const unavailableStarters = [...uniqueStarters].filter(id => !canBeStarter(id));
  if(unavailableStarters.length) errors.push('Hay lesionados o suspendidos entre los titulares.');
  const unavailableBench = [...uniqueBench].filter(id => !canBeBench(id));
  if(unavailableBench.length) errors.push('En el banco sólo se permiten disponibles o lesionados con menos de 10 turnos de recuperación.');
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
  const order = {POR:1, LD:2, DFC:3, LI:4, MCD:5, MC:6, MCO:7, ED:8, EI:9, DC:10};
  return order[pos] || 99;
}


function randomInt(min,max){
  return Math.floor(rnd(min, max + 1));
}
function createInitialSponsorState(){
  return { active:[], offers:[], matchesSinceOffer:0, nextOfferAfter:randomInt(SPONSOR_OFFER_MATCH_MIN, SPONSOR_OFFER_MATCH_MAX), lastOfferTurn:-1 };
}
function normalizeSponsorState(state){
  const base = createInitialSponsorState();
  const clean = { ...base, ...(state || {}) };
  clean.active = Array.isArray(clean.active) ? clean.active : [];
  clean.offers = Array.isArray(clean.offers) ? clean.offers : [];
  clean.matchesSinceOffer = Number.isFinite(clean.matchesSinceOffer) ? clean.matchesSinceOffer : 0;
  clean.nextOfferAfter = Number.isFinite(clean.nextOfferAfter) ? clean.nextOfferAfter : randomInt(SPONSOR_OFFER_MATCH_MIN, SPONSOR_OFFER_MATCH_MAX);
  clean.lastOfferTurn = Number.isFinite(clean.lastOfferTurn) ? clean.lastOfferTurn : -1;
  return clean;
}
function ensureSponsorState(){
  if(!game) return;
  game.sponsors = normalizeSponsorState(game.sponsors);
}
function sponsorDivisionMultiplier(){
  const club = seed.clubs.find(c => c.id === game.selectedClubId) || {};
  const order = Number(club.divisionOrder || currentClubDivision(game.selectedClubId).order || 1);
  if(order <= 1) return 10;
  if(order === 2) return 4;
  return 1;
}
function sponsorPositionBonus(){
  const division = currentClubDivision(game.selectedClubId);
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
function sponsorOfferValue(baseSponsor, lugar){
  const base = Number(baseSponsor?.valor_base_por_turno || 0);
  const place = Number(lugar?.multiplicador_lugar || 1);
  const totalMultiplier = sponsorDivisionMultiplier() * place * (1 + sponsorPositionBonus() + sponsorMoraleBonus() + sponsorCohesionBonus());
  const perTurn = Math.round(base * totalMultiplier);
  const turns = clamp(Math.round(Number(baseSponsor?.turnos_duracion_oferta || randomInt(3,35))), 3, 35);
  return { perTurn, turns, total:perTurn * turns };
}
function occupiedSponsorPlaces(){
  ensureSponsorState();
  return new Set((game.sponsors.active || []).filter(item => Number(item.turnsRemaining || 0) > 0).map(item => item.placeId));
}
function sponsorPlaceById(id){
  return (sponsorsDatabase?.lugares_sponsor || []).find(place => place.id_lugar === id) || null;
}
function sponsorBrandById(id){
  return (sponsorsDatabase?.sponsors || []).find(sponsor => sponsor.id_sponsor === id) || null;
}
function generateSponsorOffers(){
  ensureSponsorState();
  const lugares = (sponsorsDatabase?.lugares_sponsor || []).filter(place => !occupiedSponsorPlaces().has(place.id_lugar));
  const sponsors = (sponsorsDatabase?.sponsors || []).filter(sponsor => sponsor.activo !== false);
  if(!lugares.length || !sponsors.length) return [];
  const count = Math.min(randomInt(SPONSOR_OFFER_COUNT_MIN, SPONSOR_OFFER_COUNT_MAX), lugares.length, sponsors.length);
  const usedPlaces = new Set();
  const usedSponsors = new Set();
  const offers = [];
  let guard = 0;
  while(offers.length < count && guard < 200){
    guard += 1;
    const sponsor = sponsors[randomInt(0, sponsors.length - 1)];
    const place = lugares[randomInt(0, lugares.length - 1)];
    if(!sponsor || !place || usedSponsors.has(sponsor.id_sponsor) || usedPlaces.has(place.id_lugar)) continue;
    usedSponsors.add(sponsor.id_sponsor);
    usedPlaces.add(place.id_lugar);
    const value = sponsorOfferValue(sponsor, place);
    offers.push({
      id:`SPON-${game.seasonNumber || 1}-${currentSeasonTurnNumber()}-${sponsor.id_sponsor}-${place.id_lugar}-${hashNumber(String(Math.random()), 100000)}`,
      sponsorId:sponsor.id_sponsor,
      sponsorName:sponsor.nombre_marca,
      category:sponsor.categoria,
      placeId:place.id_lugar,
      placeName:place.nombre,
      placeType:place.tipo,
      perTurn:value.perTurn,
      turns:value.turns,
      total:value.total,
      createdTurn:currentTurnIndex(),
      season:game.seasonNumber || 1
    });
  }
  game.sponsors.offers = offers;
  game.sponsors.matchesSinceOffer = 0;
  game.sponsors.nextOfferAfter = randomInt(SPONSOR_OFFER_MATCH_MIN, SPONSOR_OFFER_MATCH_MAX);
  game.sponsors.lastOfferTurn = currentTurnIndex();
  if(offers.length){
    pushGameMessage({ type:'finanzas', title:'Nuevas ofertas de sponsors', body:`Llegaron ${offers.length} oferta(s) de patrocinio para el club.`, priority:'normal' });
  }
  return offers;
}
function advanceSponsorMatchCounter(){
  ensureSponsorState();
  game.sponsors.matchesSinceOffer = Number(game.sponsors.matchesSinceOffer || 0) + 1;
  if(game.sponsors.matchesSinceOffer >= Number(game.sponsors.nextOfferAfter || SPONSOR_OFFER_MATCH_MIN)){
    generateSponsorOffers();
  }
}
function processSponsorContracts(){
  ensureSponsorState();
  game.sponsors.active = (game.sponsors.active || []).map(contract => ({ ...contract, turnsRemaining:Math.max(0, Number(contract.turnsRemaining || 0) - 1) })).filter(contract => Number(contract.turnsRemaining || 0) > 0);
}
function acceptSponsorOffer(offerId){
  ensureSponsorState();
  const index = game.sponsors.offers.findIndex(offer => offer.id === offerId);
  if(index < 0) return;
  const offer = game.sponsors.offers[index];
  if(occupiedSponsorPlaces().has(offer.placeId)){
    showNotice('Ese lugar ya está ocupado por otro sponsor.');
    return;
  }
  game.sponsors.offers.splice(index, 1);
  game.sponsors.active.push({
    ...offer,
    acceptedTurn:currentTurnIndex(),
    turnsRemaining:offer.turns
  });
  recordBudgetChange(offer.total, `Sponsor: ${offer.sponsorName} / ${offer.placeName}`, { type:'sponsor', sponsorId:offer.sponsorId, placeId:offer.placeId });
  pushGameMessage({ type:'finanzas', title:'Sponsor aceptado', body:`${offer.sponsorName} pagó ${formatMoney(offer.total)} por ${offer.placeName}.`, priority:'normal' });
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
  const offers = game.sponsors.offers || [];
  if(!offers.length){
    return `<p class="muted small">Sin ofertas disponibles. Intenta ganar partidos para tentar a las marcas a anunciarse con nosotros.</p>`;
  }
  return `<div class="table-wrap"><table class="sponsor-table"><thead><tr><th>Marca</th><th>Lugar</th><th>Turnos</th><th>Por turno</th><th>Pago inmediato</th><th></th></tr></thead><tbody>${offers.map(offer => `<tr>
    <td><strong>${escapeHtml(offer.sponsorName)}</strong><span class="muted small">${escapeHtml(offer.category || '')}</span></td>
    <td>${escapeHtml(offer.placeName)}</td>
    <td>${offer.turns}</td>
    <td>${formatMoney(offer.perTurn)}</td>
    <td><strong class="ok">${formatMoney(offer.total)}</strong></td>
    <td><button class="primary small-btn" data-accept-sponsor="${escapeHtml(offer.id)}">Aceptar</button><button class="ghost small-btn" data-reject-sponsor="${escapeHtml(offer.id)}">Rechazar</button></td>
  </tr>`).join('')}</tbody></table></div>`;
}
function activeSponsorsMarkup(){
  ensureSponsorState();
  const active = game.sponsors.active || [];
  if(!active.length) return '<p class="muted small">Todavía no hay contratos activos.</p>';
  return `<div class="table-wrap"><table class="sponsor-table"><thead><tr><th>Marca</th><th>Lugar</th><th>Turnos restantes</th><th>Pago recibido</th></tr></thead><tbody>${active.map(item => `<tr><td><strong>${escapeHtml(item.sponsorName)}</strong></td><td>${escapeHtml(item.placeName)}</td><td>${item.turnsRemaining}</td><td>${formatMoney(item.total || 0)}</td></tr>`).join('')}</tbody></table></div>`;
}


function renderStadium(){
  ensureStadiumState();
  ensureSponsorState();
  const club = seed.clubs.find(c=>c.id===game.selectedClubId);
  const score = fieldScoreForClub(game.selectedClubId);
  const label = fieldConditionName(score);
  const project = stadiumProjectForClub(game.selectedClubId);
  const replantActive = project.replantingTurnsLeft > 0;
  const patchActive = project.patchingTurnsLeft > 0;
  const replantProgress = replantActive ? Math.round(((REPLANT_TURNS - project.replantingTurnsLeft) / REPLANT_TURNS) * 100) : 0;
  const patchProgress = patchActive ? Math.round(((PATCH_TURNS - project.patchingTurnsLeft) / PATCH_TURNS) * 100) : 0;
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
        <h3>Campo de juego</h3>
        <p class="label">Estado actual</p>
        <div class="stadium-score-row"><strong class="field-state ${fieldConditionClass(score)}">${escapeHtml(label)}</strong><span>${score}/100</span></div>
        ${fieldBar(score, label)}

      </div>
      <div class="card stadium-card">
        <h3>Mantenimiento</h3>
        <div class="stack">
          <div class="maintenance-option">
            <div><strong>Replantar todo</strong><p class="muted small">Costo ${formatMoney(REPLANT_COST)}. Durante 5 turnos el campo queda muy malo; al finalizar sube a 99.</p></div>
            <button id="btnReplant" class="primary" ${replantActive || patchActive || (game.budget || 0) < REPLANT_COST ? 'disabled' : ''}>Replantar</button>
          </div>
          <div class="maintenance-option">
            <div><strong>Regar y parchar campo de juego</strong><p class="muted small">Costo ${formatMoney(PATCH_COST)}. Mejora el campo durante los próximos 3 turnos.</p></div>
            <button id="btnPatch" class="ghost" ${replantActive || patchActive || (game.budget || 0) < PATCH_COST ? 'disabled' : ''}>Regar y parchar</button>
          </div>
        </div>
      </div>
    </div>
    ${replantActive ? `<div class="card stadium-progress-card" style="margin-top:14px"><div class="row"><h3>Replantando</h3><span class="pill">${project.replantingTurnsLeft} turno(s) restante(s)</span></div><div class="project-progress"><span style="width:${replantProgress}%"></span></div><p class="muted small">Durante el replante el campo se mantiene en estado muy malo. Al finalizar pasará a 99.</p></div>` : ''}
    ${patchActive ? `<div class="card stadium-progress-card" style="margin-top:14px"><div class="row"><h3>Regando y parchando campo de juego</h3><span class="pill">${project.patchingTurnsLeft} turno(s) restante(s)</span></div><div class="project-progress"><span style="width:${patchProgress}%"></span></div><p class="muted small">El campo mejora progresivamente mientras dura el mantenimiento.</p></div>` : ''}
    <div class="card sponsors-card" style="margin-top:14px">
      <div class="row"><div><h3>Sponsors</h3><p class="muted small">Cada algunos partidos tendras ofertas publicitarias. El pago se recibe completo al aceptar.</p></div></div>
      <h4>Ofertas disponibles</h4>
      ${sponsorOffersMarkup()}
      <h4 style="margin-top:14px">Contratos activos</h4>
      ${activeSponsorsMarkup()}
    </div>
  `;
  $('btnReplant')?.addEventListener('click', startReplantingField);
  $('btnPatch')?.addEventListener('click', startPatchingField);
  document.querySelectorAll('[data-accept-sponsor]').forEach(btn => btn.addEventListener('click', () => acceptSponsorOffer(btn.dataset.acceptSponsor)));
  document.querySelectorAll('[data-reject-sponsor]').forEach(btn => btn.addEventListener('click', () => rejectSponsorOffer(btn.dataset.rejectSponsor)));
}

function renderFixture(){
  const divisions = seed.divisions || [{ id:'default', name:'Liga única' }];
  const visibleDivisions = selectedFixtureDivision === 'all' ? divisions : divisions.filter(d => d.id === selectedFixtureDivision);
  const html = game.fixtures.map(round=>{
    const groups = visibleDivisions.map(division => {
      const matches = round.matches.filter(m => (m.divisionId || seed.clubs.find(c=>c.id===m.homeId)?.divisionId || 'default') === division.id);
      if(!matches.length) return '';
      return `<div class="fixture-division-block"><h4>${escapeHtml(division.name)}</h4><div class="grid cols-2">${matches.map(matchCard).join('')}</div></div>`;
    }).join('');
    return `<div class="card"><div class="row"><h3>Jornada ${round.matchday}</h3><span class="pill">${round.date}</span></div>${groups || '<p class="muted">Sin partidos para esta división.</p>'}</div>`;
  }).join('');
  view.innerHTML = `
    <div class="row section-title">
      <div><h2>Calendario</h2><p class="tagline">Los partidos jugados son clickeables para ver estadísticas y eventos.</p></div>
      ${divisionFilterMarkup('fixtureDivisionFilter', selectedFixtureDivision)}
    </div>
    <div class="stack">${html}</div>`;
  $('fixtureDivisionFilter')?.addEventListener('change', event => { selectedFixtureDivision = event.target.value; renderFixture(); });
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
  const divisions = seed.divisions || [{ id:'default', name:'Liga única' }];
  const visibleDivisions = selectedStandingsDivision === 'all' ? divisions : divisions.filter(d => d.id === selectedStandingsDivision);
  const blocks = visibleDivisions.map(division => {
    const tableRows = sortedStandings(division.id);
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
      <div><h2>Tabla de posiciones</h2></div>
      ${divisionFilterMarkup('standingsDivisionFilter', selectedStandingsDivision)}
    </div>
    <div class="stack">${blocks || '<div class="card"><p class="muted">Sin datos para esta división.</p></div>'}</div>`;
  $('standingsDivisionFilter')?.addEventListener('change', event => { selectedStandingsDivision = event.target.value; renderStandings(); });
}


function standingsStatusClass(divisionId, index, total){
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
  const rows = seasons.map(item => `<tr>
    <td>${item.season}</td>
    <td>${clubBadge(item.clubId)} ${escapeHtml(item.clubName || clubName(item.clubId))}</td>
    <td>${escapeHtml(item.divisionName || '—')}</td>
    <td><strong>${escapeHtml(item.label || (item.position === 1 ? 'Campeón' : `${item.position || '—'}°`))}</strong></td>
    <td>${item.pts || 0}</td><td>${item.pg || 0}</td><td>${item.pe || 0}</td><td>${item.pp || 0}</td><td>${item.gf || 0}</td><td>${item.gc || 0}</td>
  </tr>`).join('');
  view.innerHTML = `<div class="row section-title"><div><h2>Tus estadísticas</h2><p class="tagline">Historial acumulado del manager.</p></div></div>
    <div class="grid cols-6 compact-team-stats">
      <div class="card"><p class="label">Partidos</p><strong>${totals.played || 0}</strong></div>
      <div class="card"><p class="label">Ganados</p><strong>${totals.won || 0}</strong></div>
      <div class="card"><p class="label">Empatados</p><strong>${totals.drawn || 0}</strong></div>
      <div class="card"><p class="label">Perdidos</p><strong>${totals.lost || 0}</strong></div>
      <div class="card"><p class="label">GF / GC</p><strong>${totals.gf || 0} / ${totals.gc || 0}</strong></div>
      <div class="card"><p class="label">Títulos obtenidos</p><strong>${game.managerStats.titles || 0}</strong></div>
    </div>
    <div class="card" style="margin-top:14px"><h3>Finales de temporada</h3>
      <div class="table-wrap"><table><thead><tr><th>Temp.</th><th>Club</th><th>División</th><th>Posición</th><th>PTS</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th></tr></thead><tbody>${rows || '<tr><td colspan="10" class="muted">Aún no finalizaste ninguna temporada.</td></tr>'}</tbody></table></div>
    </div>`;
}

function renderStats(){
  const divisions = seed.divisions || [{ id:'default', name:'Liga única' }];
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
    .filter(p => !starters.has(p.id) && (clubId !== game?.selectedClubId ? !isUnavailable(p.id) : canBeBench(p.id)))
    .sort((a,b)=>benchOverallValue(b)-benchOverallValue(a))
    .slice(0,10);
}
function conditionSelectionScore(p){
  return currentCondition(p.id) * 1000 + currentMorale(p.id) * 10 + visibleOverall(p);
}
function autoSelectByBestCondition(clubId){
  return playersByClub(clubId)
    .filter(p => clubId !== game?.selectedClubId || !isUnavailable(p.id))
    .sort((a,b)=>conditionSelectionScore(b)-conditionSelectionScore(a))
    .slice(0,11);
}
function autoSelectBenchByBestCondition(clubId, starterIds){
  const starters = new Set(starterIds);
  return playersByClub(clubId)
    .filter(p => !starters.has(p.id) && (clubId !== game?.selectedClubId ? !isUnavailable(p.id) : canBeBench(p.id)))
    .sort((a,b)=>conditionSelectionScore(b)-conditionSelectionScore(a))
    .slice(0,10);
}
function defaultAutoSubs(starters, bench){
  return [0,1,2,3,4].map(i => ({ outId: starters[10-i] || 0, inId: bench[i] || 0, trigger: i < 2 ? 'tired' : 'best' }));
}
function bestPlayerForSlot(squad, slot, used){
  const compatibility = (p) => {
    if(p.position === slot) return 14;
    const groups = { POR:['POR'], DEF:['LD','LI','DFC'], MID:['MCD','MC','MCO'], ATT:['ED','EI','DC'] };
    const groupOf = pos => Object.keys(groups).find(k=>groups[k].includes(pos));
    return groupOf(p.position) === groupOf(slot) ? 5 : -8;
  };
  return squad.filter(p=>!used.has(p.id)).sort((a,b)=>(effectiveOverall(b)+compatibility(b))-(effectiveOverall(a)+compatibility(a)))[0];
}
function ensureTeamCohesion(){
  if(!game) return;
  game.teamCohesion = game.teamCohesion || {};
  game.lastMatchTactics = game.lastMatchTactics || {};
  seed.clubs.forEach(c => { if(!Number.isFinite(game.teamCohesion[c.id])) game.teamCohesion[c.id] = TEAM_COHESION_START; });
}
function cohesionValue(clubId){
  ensureTeamCohesion();
  return clamp(Math.round(game?.teamCohesion?.[clubId] ?? TEAM_COHESION_START), 0, 100);
}
function cohesionMultiplier(clubId){
  const c = cohesionValue(clubId);
  if(c <= 30) return clamp(0.50 + (c / 30) * 0.20, 0.50, 0.70);
  if(c <= 50) return clamp(0.70 + ((c - 30) / 20) * 0.30, 0.70, 1.00);
  return clamp(1.00 + ((c - 50) / 50) * 0.20, 1.00, 1.20);
}
function tacticSignature(tactic){
  if(!tactic) return '';
  const normalizeIds = arr => (arr || []).map(Number).filter(Boolean).join(',');
  const mentality = Object.entries(tactic.playerMentalities || {})
    .map(([id, mode]) => `${Number(id)}:${mode}`)
    .sort()
    .join('|');
  const instructions = window.Simulator20?.normalizeMatchInstructions
    ? window.Simulator20.normalizeMatchInstructions(tactic.matchInstructions)
    : (tactic.matchInstructions || {});
  const instructionSig = ['winning','drawing','losing'].map(key => `${key}:${instructions[key] || 'normal'}`).join('|');
  return [tactic.formation || '', normalizeIds(tactic.starters), normalizeIds(tactic.bench), mentality, instructionSig].join('::');
}
function applyTacticCohesionPenalty(clubId, tactic){
  ensureTeamCohesion();
  const signature = tacticSignature(tactic);
  const last = game.lastMatchTactics?.[clubId];
  if(last && last !== signature){
    game.teamCohesion[clubId] = clamp((game.teamCohesion[clubId] ?? TEAM_COHESION_START) - TEAM_COHESION_TACTIC_CHANGE_LOSS, 0, 100);
  }
  game.lastMatchTactics[clubId] = signature;
}
function applyMatchCohesionResult(match, substitutions=[], cards=[]){
  ensureTeamCohesion();
  [match.homeId, match.awayId].forEach(clubId => {
    const subCount = (substitutions || []).filter(s => s.clubId === clubId).length;
    const redCount = (cards || []).filter(c => c.clubId === clubId && (c.type === 'red' || c.type === 'secondYellowRed')).length;
    const loss = (subCount + redCount) * TEAM_COHESION_PLAYER_CHANGE_LOSS;
    game.teamCohesion[clubId] = clamp((game.teamCohesion[clubId] ?? TEAM_COHESION_START) + TEAM_COHESION_MATCH_GAIN - loss, 0, 100);
  });
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
  const cohesion = cohesionMultiplier(clubId);
  return { clubId, lineup, assigned, defense:(defense+adjust.defense)*cohesion, midfield:(midfield+adjust.midfield)*cohesion, attack:(attack+adjust.attack)*cohesion, discipline, stamina:stamina*cohesion, aggression, keeper:keeper*cohesion, reputation:rep };
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
  if(!game || game.seasonFinalized) return;
  if((game.advanceLockedUntil || 0) > Date.now()){ showNotice(`${currentWeekdayLabel()}: el siguiente turno se habilita el domingo.`); return; }
  if(isPreseason()){
    simulatePreseasonTurn();
    return;
  }
  if(isPostseason()){
    simulatePostseasonTurn();
    return;
  }
  if(game.matchdayIndex >= game.fixtures.length){
    game.seasonPhase = 'postseason';
    game.phaseTurn = 0;
    saveLocal(true);
    renderAll();
    showNotice('Comienza la postemporada. Tenés 5 turnos antes del cierre de temporada.');
    return;
  }
  if(game.mustReviewTactics){ showNotice('Revisá la táctica: hay lesionados o suspendidos propios que deben ser reemplazados.'); return; }
  const errors = validateCurrentTactic(false);
  if(errors.length){ showNotice(errors.join(' ')); return; }
  const round = game.fixtures[game.matchdayIndex];
  const results = round.matches.map(match => simulateMatch(match));
  round.matches.forEach((m,i)=>Object.assign(m, { played:true, homeGoals:results[i].homeGoals, awayGoals:results[i].awayGoals }));
  game.matchHistory.push(...results);
  const ownResult = results.find(m => m.homeId === game.selectedClubId || m.awayId === game.selectedClubId);
  applyConditionUpdates(results);
  applyMoraleUpdates(results);
  applyTrainingEffects();
  advanceStadiumAfterMatches(results);
  processSponsorContracts();
  if(ownResult){
    applyEconomyResult(ownResult);
    updateManagerMatchStats(ownResult);
    maybeGenerateTransferOffer(ownResult);
    advanceSponsorMatchCounter();
  }
  const ownProblems = collectOwnProblems(ownResult);
  removeOwnUnavailableFromTactic(ownProblems);
  game.lastOwnProblems = ownProblems;
  game.mustReviewTactics = game.lastOwnProblems.length > 0;
  game.matchdayIndex += 1;
  advanceGlobalTurn();
  processPendingTransfers();
  const regularEnded = game.matchdayIndex >= game.fixtures.length;
  if(regularEnded){
    game.seasonPhase = 'postseason';
    game.phaseTurn = 0;
    game.advanceLockedUntil = 0;
  } else {
    game.currentDate = game.fixtures[game.matchdayIndex]?.date || round.date;
    game.advanceLockedUntil = Date.now() + ADVANCE_LOCK_MS;
  }
  activeTab = 'home';
  saveLocal(true);
  renderAll();
  if(ownResult && !regularEnded) showMatchRevealModal(ownResult);
  if(game.mustReviewTactics){ showNotice('Jornada simulada. Hay lesionados o expulsados propios: revisá la táctica antes de avanzar.', true); }
  else if(regularEnded){ showNotice('Terminó la fase regular. Comienzan 5 turnos de postemporada antes del cierre.', true); }
  else { showNotice(`Jornada ${round.matchday} simulada. La semana avanza hasta el próximo domingo.`); }
}

function simulatePreseasonTurn(){
  const opponentId = Number(game.pendingFriendlyOpponentId || 0);
  const canFriendly = opponentId && canPlayPreseasonFriendly();
  let friendlyResult = null;
  if(canFriendly){
    const homeOwn = Math.random() < 0.5;
    const match = {
      id:`friendly-t${game.seasonNumber || 1}-${game.phaseTurn || 0}-${game.selectedClubId}-${opponentId}`,
      friendly:true,
      matchday:`PRE-${(game.phaseTurn || 0) + 1}`,
      divisionId:'friendly',
      divisionName:'Amistoso',
      date:game.currentDate || '',
      homeId:homeOwn ? game.selectedClubId : opponentId,
      awayId:homeOwn ? opponentId : game.selectedClubId,
      played:false
    };
    friendlyResult = simulateMatch(match);
    friendlyResult.cards = [];
    friendlyResult.injuries = [];
    friendlyResult.substitutions = [];
    game.matchHistory.push(friendlyResult);
    applyConditionUpdates([friendlyResult]);
    applyMoraleUpdates([friendlyResult]);
    game.preseasonFriendliesPlayed = preseasonFriendliesPlayed() + 1;
  }
  applyTrainingEffects();
  processStadiumProjects();
  processSponsorContracts();
  game.pendingFriendlyOpponentId = 0;
  game.phaseTurn = Number(game.phaseTurn || 0) + 1;
  advanceGlobalTurn();
  processPendingTransfers();
  if(game.phaseTurn >= PRESEASON_TURNS){
    game.seasonPhase = 'regular';
    game.phaseTurn = 0;
    game.currentDate = game.fixtures[game.matchdayIndex]?.date || game.currentDate;
    game.advanceLockedUntil = 0;
    showNotice('Pretemporada finalizada. Ya está disponible la primera jornada oficial.', true);
  } else {
    game.advanceLockedUntil = Date.now() + ADVANCE_LOCK_MS;
    showNotice(canFriendly ? `Amistoso jugado ante ${clubName(opponentId)}. La pretemporada avanza.` : 'Turno de pretemporada aplicado. La semana avanza.', false);
  }
  activeTab = 'home';
  saveLocal(true);
  renderAll();
  if(friendlyResult) showMatchRevealModal(friendlyResult);
}

function simulatePostseasonTurn(){
  generateSeasonEndPlayerOffers();
  applyTrainingEffects();
  processStadiumProjects();
  processSponsorContracts();
  game.phaseTurn = Number(game.phaseTurn || 0) + 1;
  advanceGlobalTurn();
  processPendingTransfers();
  if(game.phaseTurn >= POSTSEASON_TURNS){
    game.seasonPhase = 'finalizing';
    finalizeSeasonIfNeeded();
    game.advanceLockedUntil = 0;
    activeTab = 'home';
    saveLocal(true);
    renderAll();
    setTimeout(openSeasonEndModal, 0);
    showNotice('Postemporada finalizada. Cerró la temporada.', true);
  } else {
    game.advanceLockedUntil = Date.now() + ADVANCE_LOCK_MS;
    activeTab = 'home';
    saveLocal(true);
    renderAll();
    showNotice('Turno de postemporada aplicado. La semana avanza.');
  }
}


function recordBudgetChange(delta, concept, meta={}){
  if(!game) return;
  game.budgetHistory = game.budgetHistory || [];
  const safeDelta = Math.round(Number(delta) || 0);
  game.budget = Math.max(0, Math.round((game.budget || 0) + safeDelta));
  game.lastBudgetDelta = safeDelta;
  game.budgetHistory.push({
    season:game.seasonNumber || 1,
    matchdayIndex:game.matchdayIndex || 0,
    date:game.currentDate || '',
    concept:concept || 'Movimiento de presupuesto',
    delta:safeDelta,
    budget:game.budget,
    ...meta
  });
}
function budgetConcept(entry){
  if(entry.concept) return entry.concept;
  if(entry.type === 'season_salary') return 'Pago anual de sueldos';
  if(entry.matchId) return 'Resultado de partido';
  return 'Movimiento de presupuesto';
}
function financeSquadRows(){
  return playersByClub(game.selectedClubId)
    .slice()
    .sort((a,b)=>visibleOverall(b)-visibleOverall(a) || a.name.localeCompare(b.name,'es'))
    .map(p => `<tr><td><strong>${escapeHtml(p.name)}</strong></td><td>${nationalityShortMarkup(p.nationality)}</td><td>${Number(p.age || 0) || '—'}</td><td>${visibleOverall(p)}</td><td>${formatMoney(p.salary || 0)}</td></tr>`)
    .join('');
}
function renderFinances(){
  const history = (game.budgetHistory || []).slice().reverse();
  const seasonExpenses = (game.budgetHistory || []).filter(h => (h.season || game.seasonNumber || 1) === (game.seasonNumber || 1) && Number(h.delta || 0) < 0).reduce((a,h)=>a+Math.abs(Number(h.delta || 0)),0);
  const seasonIncome = (game.budgetHistory || []).filter(h => (h.season || game.seasonNumber || 1) === (game.seasonNumber || 1) && Number(h.delta || 0) > 0).reduce((a,h)=>a+Number(h.delta || 0),0);
  const salaryTotal = totalClubSalary(game.selectedClubId);
  const rows = history.slice(0,80).map(entry => {
    const delta = Number(entry.delta || 0);
    const cls = delta > 0 ? 'ok' : delta < 0 ? 'bad' : 'muted';
    return `<tr><td>Temp. ${entry.season || game.seasonNumber || 1}</td><td>${escapeHtml(budgetConcept(entry))}</td><td><span class="${cls}">${delta > 0 ? '+' : ''}${formatMoney(delta)}</span></td><td>${formatMoney(entry.budget || 0)}</td></tr>`;
  }).join('');
  view.innerHTML = `
    <div class="row section-title"><div><h2>Finanzas</h2><p class="tagline">Detalle del presupuesto, sus movimientos registrados y la masa salarial del plantel.</p></div></div>
    <div class="grid cols-4 compact-team-stats">
      <div class="card"><p class="label">Presupuesto actual</p><strong>${formatMoney(game.budget || 0)}</strong></div>
      <div class="card"><p class="label">Ingresos temporada</p><strong class="ok">${formatMoney(seasonIncome)}</strong></div>
      <div class="card"><p class="label">Gastos temporada</p><strong class="bad">${formatMoney(seasonExpenses)}</strong></div>
      <div class="card"><p class="label">Sueldos anuales estimados</p><strong>${formatMoney(salaryTotal)}</strong></div>
    </div>
    <div class="card" style="margin-top:14px"><h3>Plantel y sueldos</h3>
      <div class="table-wrap"><table><thead><tr><th>Jugador</th><th>Nac.</th><th>Edad</th><th>Media</th><th>Sueldo anual</th></tr></thead><tbody>${financeSquadRows() || '<tr><td colspan="5" class="muted">No hay jugadores en el plantel.</td></tr>'}</tbody></table></div>
    </div>
    <div class="card" style="margin-top:14px"><h3>Movimientos</h3>
      <div class="table-wrap"><table><thead><tr><th>Temporada</th><th>Concepto</th><th>Monto</th><th>Presupuesto luego</th></tr></thead><tbody>${rows || '<tr><td colspan="4" class="muted">Todavía no hay movimientos registrados.</td></tr>'}</tbody></table></div>
    </div>`;
}

function totalClubSalary(clubId){
  return playersByClub(clubId).reduce((sum,p)=>sum + Math.max(0, Number(p.salary || 0)), 0);
}
function paySeasonSalaries(){
  const total = totalClubSalary(game.selectedClubId);
  if(total <= 0) return 0;
  recordBudgetChange(-total, `Pago anual de sueldos de ${clubName(game.selectedClubId)}`, { type:'season_salary' });
  return total;
}
function applyEconomyResult(match){
  const isHome = match.homeId === game.selectedClubId;
  const gf = isHome ? match.homeGoals : match.awayGoals;
  const gc = isHome ? match.awayGoals : match.homeGoals;
  const club = seed.clubs.find(c=>c.id===game.selectedClubId);
  const multiplier = Number.isFinite(club?.prizeMultiplier) ? club.prizeMultiplier : divisionPrizeMultiplier(club?.divisionName || 'Liga Profesional');
  let delta = 0;
  if(gf > gc) delta = Math.round(rnd(300000, 500000));
  else if(gf === gc) delta = Math.round(rnd(100000, 200000));
  else delta = Math.round(rnd(-100000, 50000));
  delta = Math.round(delta * multiplier);
  recordBudgetChange(delta, 'Resultado de partido', { matchId: match.id, multiplier });
}
function advanceStadiumAfterMatches(results){
  ensureStadiumState();
  const homePlayed = new Set((results || []).map(match => match.homeId));
  homePlayed.forEach(clubId => {
    const project = stadiumProjectForClub(clubId);
    if(project.replantingTurnsLeft > 0){
      game.stadium.fields[clubId] = 30;
    } else {
      game.stadium.fields[clubId] = clamp(Math.round(fieldScoreForClub(clubId) - rnd(5,8)), 1, 100);
    }
  });
  processStadiumProjects();
  processSponsorContracts();
}
function processStadiumProjects(){
  ensureStadiumState();
  Object.entries(game.stadium.projects).forEach(([clubIdRaw, project]) => {
    const clubId = Number(clubIdRaw);
    if(project.replantingTurnsLeft > 0){
      project.replantingTurnsLeft -= 1;
      if(project.replantingTurnsLeft <= 0){
        project.replantingTurnsLeft = 0;
        game.stadium.fields[clubId] = 99;
      } else {
        game.stadium.fields[clubId] = 30;
      }
    } else if(project.patchingTurnsLeft > 0){
      project.patchingTurnsLeft -= 1;
      game.stadium.fields[clubId] = clamp(Math.round(fieldScoreForClub(clubId) + PATCH_GAIN_PER_TURN), 1, 100);
      if(project.patchingTurnsLeft <= 0) project.patchingTurnsLeft = 0;
    }
  });
}
function startReplantingField(){
  if(!game) return;
  ensureStadiumState();
  const project = stadiumProjectForClub(game.selectedClubId);
  if(project.replantingTurnsLeft > 0 || project.patchingTurnsLeft > 0){ showNotice('Ya hay un trabajo de mantenimiento activo en el estadio.'); return; }
  if((game.budget || 0) < REPLANT_COST){ showNotice('Presupuesto insuficiente para replantar todo el campo.'); return; }
  recordBudgetChange(-REPLANT_COST, 'Replante completo del campo', { type:'stadium_replant' });
  project.replantingTurnsLeft = REPLANT_TURNS;
  project.patchingTurnsLeft = 0;
  game.stadium.fields[game.selectedClubId] = 30;
  saveLocal(true);
  showNotice('Replante completo iniciado. El campo quedará muy malo durante 5 turnos y luego subirá a 99.');
  renderStadium();
}
function startPatchingField(){
  if(!game) return;
  ensureStadiumState();
  const project = stadiumProjectForClub(game.selectedClubId);
  if(project.replantingTurnsLeft > 0 || project.patchingTurnsLeft > 0){ showNotice('Ya hay un trabajo de mantenimiento activo en el estadio.'); return; }
  if((game.budget || 0) < PATCH_COST){ showNotice('Presupuesto insuficiente para regar y parchar el campo.'); return; }
  recordBudgetChange(-PATCH_COST, 'Riego y parcheo del campo', { type:'stadium_patch' });
  project.patchingTurnsLeft = PATCH_TURNS;
  saveLocal(true);
  showNotice('Riego y parcheo iniciado. El campo mejorará 5 puntos por turno durante 3 turnos.');
  renderStadium();
}
function applyConditionUpdates(results){
  if(!game.playerCondition) game.playerCondition = {};
  seed.players.forEach(player => {
    if(!Number.isFinite(game.playerCondition[player.id])) game.playerCondition[player.id] = 99;
  });
  const played = new Set();
  const pitchFatigueByPlayer = new Map();
  const instructionConditionByPlayer = new Map();
  results.forEach(match => {
    const extra = pitchEffect(match.matchContext?.pitch || 'Normal').fatigueBonus || 0;
    (match.playedIdsHome || []).forEach(id => { played.add(id); pitchFatigueByPlayer.set(id, Math.max(pitchFatigueByPlayer.get(id) || 0, extra)); });
    (match.playedIdsAway || []).forEach(id => { played.add(id); pitchFatigueByPlayer.set(id, Math.max(pitchFatigueByPlayer.get(id) || 0, extra)); });
    Object.entries(match.instructionConditionDeltas || {}).forEach(([id, delta]) => {
      const key = Number(id);
      instructionConditionByPlayer.set(key, (instructionConditionByPlayer.get(key) || 0) + Number(delta || 0));
    });
  });
  seed.players.forEach(player => {
    let next = currentCondition(player.id);
    if(isInjured(player.id)){
      next -= rnd(2,3);
    } else {
      next += rnd(12,18);
      if(played.has(player.id)) next -= conditionLossForPlayer(player) + (pitchFatigueByPlayer.get(player.id) || 0);
      else next += rnd(8,10);
      next += instructionConditionByPlayer.get(player.id) || 0;
    }
    game.playerCondition[player.id] = clamp(Math.round(next), 0, 99);
  });
}

function applyMoraleUpdates(results){
  if(!game.playerMorale) game.playerMorale = {};
  seed.players.forEach(player => {
    if(!Number.isFinite(game.playerMorale[player.id])) game.playerMorale[player.id] = PLAYER_MORALE_START;
  });
  const processedClubs = new Set();
  (results || []).forEach(match => {
    [
      { clubId:match.homeId, gf:match.homeGoals, gc:match.awayGoals, starterIds:match.starterIdsHome || [], playedIds:match.playedIdsHome || [] },
      { clubId:match.awayId, gf:match.awayGoals, gc:match.homeGoals, starterIds:match.starterIdsAway || [], playedIds:match.playedIdsAway || [] }
    ].forEach(team => {
      if(!team.clubId || processedClubs.has(`${match.id}-${team.clubId}`)) return;
      processedClubs.add(`${match.id}-${team.clubId}`);
      const squad = playersByClub(team.clubId);
      const starterSet = new Set((team.starterIds || []).map(Number));
      const playedSet = new Set((team.playedIds || []).map(Number));
      squad.forEach(player => {
        let next = currentMorale(player.id);
        if(starterSet.has(player.id)) next += rnd(3,6);
        else if(playedSet.has(player.id)) next += rnd(1,2);
        else next -= 2;
        if(team.gf > team.gc) next += rnd(1,3);
        else if(team.gf < team.gc){
          next -= starterSet.has(player.id) ? rnd(5,8) : rnd(3,4);
        }
        game.playerMorale[player.id] = clamp(Math.round(next), 1, 99);
      });
    });
  });
}

function trainingOptionByValue(value){
  return TRAINING_OPTIONS.find(opt => opt.value === value) || null;
}
function trainingLabel(value){
  return trainingOptionByValue(value)?.label || trainingOptionByValue(DEFAULT_TRAINING_TYPE).label;
}
function playerTrainingType(playerId){
  if(!game.trainingPlan) game.trainingPlan = {};
  if(!trainingOptionByValue(game.trainingPlan[playerId])) game.trainingPlan[playerId] = DEFAULT_TRAINING_TYPE;
  return game.trainingPlan[playerId];
}
function trainingOptionsMarkup(current){
  return TRAINING_OPTIONS.map(opt => `<option value="${opt.value}" ${current===opt.value?'selected':''}>${opt.label}</option>`).join('');
}
function trainableSkillsForPlayer(player){
  if(player.position === 'POR') return ['porteria','posicionamiento','serenidad','aceleracion','cabezazo','fuerza','liderazgo','trabajoEquipo','paseCorto','paseLargo','resistencia'];
  if(['LD','LI','DFC'].includes(player.position)) return ['marca','entradas','posicionamiento','fuerza','remate','regate','cabezazo','resistencia','trabajoEquipo'];
  if(['MCD','MC','MCO'].includes(player.position)) return ['paseCorto','paseLargo','vision','tecnica','trabajoEquipo','marca','entradas','posicionamiento','regate','remate','resistencia','serenidad'];
  return ['remate','regate','posicionamiento','serenidad','cabezazo','fuerza','resistencia','tecnica'];
}
function improveRandomSkill(player){
  if(!game.playerSkillBoosts) game.playerSkillBoosts = {};
  if(!game.playerSkillBoosts[player.id]) game.playerSkillBoosts[player.id] = {};
  const skills = trainableSkillsForPlayer(player);
  const skill = skills[hashNumber(`${player.id}-${game.matchdayIndex}-${Math.random()}`, skills.length)];
  const gain = Math.random() < 0.50 ? 1 : 0;
  if(gain > 0){
    game.playerSkillBoosts[player.id][skill] = clamp(Number(game.playerSkillBoosts[player.id][skill] || 0) + gain, 0, 30);
  }
  return gain;
}
function applyTrainingEffects(){
  if(!game) return;
  game.trainingPlan = game.trainingPlan || {};
  game.playerCondition = game.playerCondition || {};
  game.playerMorale = game.playerMorale || {};
  game.playerSkillBoosts = game.playerSkillBoosts || {};
  let tacticalGain = 0;
  playersByClub(game.selectedClubId).forEach(player => {
    const type = playerTrainingType(player.id);
    if(type === 'regenerative'){
      game.playerCondition[player.id] = clamp(Math.round(currentCondition(player.id) + rnd(1,3)), 0, 99);
    } else if(type === 'massage'){
      game.playerCondition[player.id] = clamp(Math.round(currentCondition(player.id) + rnd(5,8)), 0, 99);
      game.playerMorale[player.id] = clamp(Math.round(currentMorale(player.id) + rnd(2,3)), 1, 99);
    } else if(type === 'intense'){
      improveRandomSkill(player);
      game.playerCondition[player.id] = clamp(Math.round(currentCondition(player.id) - rnd(2,3)), 0, 99);
      game.playerMorale[player.id] = clamp(Math.round(currentMorale(player.id) - rnd(5,6)), 1, 99);
    } else if(type === 'tactical'){
      tacticalGain += Math.random() < 0.50 ? 1 : 0;
    } else if(type === 'dayoff'){
      game.playerCondition[player.id] = clamp(Math.round(currentCondition(player.id) + rnd(1,2)), 0, 99);
      game.playerMorale[player.id] = clamp(Math.round(currentMorale(player.id) + rnd(8,10)), 1, 99);
    }
  });
  if(tacticalGain > 0){
    ensureTeamCohesion();
    game.teamCohesion[game.selectedClubId] = clamp(Math.round(cohesionValue(game.selectedClubId) + tacticalGain), 0, 100);
  }
  game.lastTrainingApplied = { ...turnStamp(), tacticalGain };
}
function renderTraining(){
  const squad = sortedTrainingPlayers();
  view.innerHTML = `
    <div class="row section-title">
      <div>
        <h2>Entrenamiento</h2>
        <p class="tagline">Asigná un entrenamiento especializado por jugador. Los efectos se aplican al avanzar cada turno.</p>
      </div>
      <span class="pill">Cohesión: ${cohesionValue(game.selectedClubId)}/100</span>
    </div>
    <div class="card training-help">
      <div class="grid cols-5 training-option-grid">
        <div><strong>Regenerativo</strong><span>+ forma física.</span></div>
        <div><strong>Masajista</strong><span>+ forma física y moral.</span></div>
        <div><strong>Intenso</strong><span>Puede mejorar habilidad; baja forma y moral.</span></div>
        <div><strong>Táctico</strong><span>Puede mejorar cohesión total.</span></div>
        <div><strong>Día libre</strong><span>+ forma física y mucha moral.</span></div>
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="table-wrap"><table class="training-table"><thead><tr><th>${trainingColumnSort('Jugador', [['nombre_asc','A-Z'],['nombre_desc','Z-A'],['dorsal_asc','Dorsal ↑'],['dorsal_desc','Dorsal ↓']])}</th><th>Pos.</th><th>${trainingColumnSort('Edad', [['edad_asc','Menor'],['edad_desc','Mayor']])}</th><th>${trainingColumnSort('Media', [['media_desc','Mayor'],['media_asc','Menor']])}</th><th>${trainingColumnSort('Estado físico', [['condicion_desc','Mayor'],['condicion_asc','Menor']])}</th><th>${trainingColumnSort('Moral', [['moral_desc','Mayor'],['moral_asc','Menor']])}</th><th>Entrenamiento</th></tr></thead><tbody>
        ${squad.map(player => trainingPlayerRow(player)).join('')}
      </tbody></table></div>
    </div>
  `;
  prependFirstTeamTabs('training');
  document.querySelectorAll('[data-training-sort]').forEach(select => {
    select.addEventListener('change', () => {
      if(select.value){ trainingSort = select.value; renderTraining(); }
    });
  });
  document.querySelectorAll('[data-training-player]').forEach(select => {
    select.addEventListener('change', () => {
      const playerId = Number(select.dataset.trainingPlayer);
      game.trainingPlan = game.trainingPlan || {};
      game.trainingPlan[playerId] = trainingOptionByValue(select.value) ? select.value : DEFAULT_TRAINING_TYPE;
      saveLocal(true);
      showNotice('Entrenamiento actualizado. Se aplicará al avanzar el turno.');
    });
  });
}
function trainingPlayerRow(player){
  const type = playerTrainingType(player.id);
  return `<tr>
    <td><div class="training-player-cell">${faceImg(player,'training-face')}<button class="linklike" data-player-id="${player.id}">${availabilityIcons(player.id)}${escapeHtml(player.name)}</button></div></td>
    <td><span class="pill role-pill">${roleBadge(player.position)}</span></td>
    <td>${Number(player.age || 0) || '—'}</td>
    <td><strong>${visibleOverall(player)}</strong></td>
    <td>${conditionBar(player.id)}</td>
    <td>${moraleBar(player.id)}</td>
    <td><select data-training-player="${player.id}">${trainingOptionsMarkup(type)}</select></td>
  </tr>`;
}

function renderEmployees(){
  const last = game.staffActions?.motivationalTalk || null;
  const cooldownLeft = turnCooldownLeft(last, PSYCHOLOGIST_COOLDOWN_TURNS);
  const canCallPsychologist = cooldownLeft <= 0 && (game.budget || 0) >= PSYCHOLOGIST_COST;
  const cooldownText = cooldownLeft > 0 ? `<p class="small warn">Disponible nuevamente en ${cooldownLeft} turno(s).</p>` : '';
  const kinesio = game.staffActions?.kinesiologist || null;
  const kinesioActive = Boolean(kinesio?.active);
  const injuredList = injuredPlayersByClub(game.selectedClubId);
  view.innerHTML = `
    <div class="row section-title">
      <div>
        <h2>Empleados</h2>
        <p class="tagline">Acciones de apoyo para el plantel. La moral es visible; los valores exactos de mejora no se muestran.</p>
      </div>
      <div class="pill">Presupuesto: ${formatMoney(game.budget || 0)}</div>
    </div>
    <div class="grid cols-2">
      <div class="card staff-card">
        <h3>Psicólogo motivacional</h3>
        <p class="muted">Convoca una charla para intentar mejorar la moral del plantel.</p>
        <p class="label">Costo</p>
        <div class="metric small">${formatMoney(PSYCHOLOGIST_COST)}</div>
        ${cooldownText}
        <button id="btnMotivationalTalk" class="primary" ${canCallPsychologist ? '' : 'disabled'}>Llamar al psicólogo motivacional</button>
      </div>
      <div class="card staff-card">
        <h3>Estado del plantel</h3>
        <div class="stat-rank"><span>Moral media</span><strong>${squadMoraleAverage(game.selectedClubId)}/99</strong></div>
        <div class="profile-bar-wrap">${moraleTeamBar(game.selectedClubId)}</div>
        ${last ? `<div class="staff-result ${last.success ? 'ok-result' : 'bad-result'}"><div class="project-progress completed"><span style="width:100%"></span></div><strong>${escapeHtml(last.message)}</strong></div>` : '<p class="muted">Sin acciones recientes.</p>'}
      </div>
      <div class="card staff-card">
        <h3>Kinesiólogo</h3>
        <p class="muted">Contratación por temporada completa. Permite tratar lesionados una vez por turno para intentar reducir 1 turno de lesión.</p>
        <p class="label">Costo</p>
        <div class="metric small">${formatMoney(KINESIOLOGIST_COST)}</div>
        ${kinesioActive ? '<span class="pill ok">Contratado</span>' : `<button id="btnHireKinesiologist" class="primary" ${(game.budget || 0) >= KINESIOLOGIST_COST ? '' : 'disabled'}>Contratar kinesiólogo</button>`}
      </div>
      <div class="card staff-card">
        <h3>Tratamientos</h3>
        ${kinesioActive ? injuredTreatmentList(injuredList) : '<p class="muted">Contratá al kinesiólogo para habilitar tratamientos sobre jugadores lesionados.</p>'}
      </div>
    </div>
  `;
  $('btnMotivationalTalk')?.addEventListener('click', callMotivationalPsychologist);
  $('btnHireKinesiologist')?.addEventListener('click', hireKinesiologist);
  document.querySelectorAll('[data-kinesio-treat]').forEach(btn => {
    btn.addEventListener('click', () => treatInjuredPlayer(Number(btn.dataset.kinesioTreat)));
  });
}
function injuredTreatmentList(injuredList){
  if(!injuredList.length) return '<p class="muted">No hay jugadores lesionados para tratar.</p>';
  return `<div class="injured-treatment-list">${injuredList.map(item => {
    const treated = wasKinesioTreatedThisTurn(item.player.id);
    return `<div class="injured-treatment-row">
      ${faceImg(item.player, 'injured-home-face')}
      <div><button class="linklike" data-player-id="${item.player.id}">${availabilityIcons(item.player.id)}${escapeHtml(item.player.name)}</button><span>${escapeHtml(item.status.injuryLabel || 'Lesión')} · ${item.remaining} turno(s)</span></div>
      <button class="ghost" data-kinesio-treat="${item.player.id}" ${treated ? 'disabled' : ''}>${treated ? 'Tratado este turno' : 'Tratar'}</button>
    </div>`;
  }).join('')}</div>`;
}
function wasKinesioTreatedThisTurn(playerId){
  const key = `${currentTurnIndex()}:${playerId}`;
  return Boolean(game.staffActions?.kinesiologyTreatments?.[key]);
}
function hireKinesiologist(){
  if(!game) return;
  if(game.staffActions?.kinesiologist?.active){ showNotice('El kinesiólogo ya está contratado.'); return; }
  if((game.budget || 0) < KINESIOLOGIST_COST){ showNotice('Presupuesto insuficiente para contratar al kinesiólogo.'); return; }
  recordBudgetChange(-KINESIOLOGIST_COST, 'Contratación de kinesiólogo', { type:'staff_kinesiologist' });
  game.staffActions = game.staffActions || {};
  game.staffActions.kinesiologist = { active:true, ...turnStamp() };
  saveLocal(true);
  showNotice('Kinesiólogo contratado por la temporada completa.');
  renderEmployees();
}
function treatInjuredPlayer(playerId){
  if(!game?.staffActions?.kinesiologist?.active){ showNotice('Primero tenés que contratar al kinesiólogo.'); return; }
  if(!isInjured(playerId)){ showNotice('El jugador no está lesionado.'); renderEmployees(); return; }
  game.staffActions.kinesiologyTreatments = game.staffActions.kinesiologyTreatments || {};
  const key = `${currentTurnIndex()}:${playerId}`;
  if(game.staffActions.kinesiologyTreatments[key]){ showNotice('Este jugador ya recibió tratamiento en este turno.'); return; }
  const success = Math.random() >= KINESIOLOGIST_FAILURE_CHANCE;
  game.staffActions.kinesiologyTreatments[key] = { success, ...turnStamp({ playerId }) };
  if(success){
    const st = playerStatus(playerId);
    const nextThrough = Number(st.injuredThrough) - 1;
    if(nextThrough < game.matchdayIndex){
      const { injuredThrough, injuryLabel, injuryChance, injuredAtMatchday, ...rest } = st;
      game.playerStatus[playerId] = rest;
    } else {
      game.playerStatus[playerId] = { ...st, injuredThrough:nextThrough };
    }
    showNotice('Tratamiento exitoso. La recuperación se acortó 1 turno.');
  } else {
    showNotice('El tratamiento falló. La lesión no se redujo.');
  }
  saveLocal(true);
  renderEmployees();
}
function moraleTeamBar(clubId){
  const value = squadMoraleAverage(clubId);
  const cls = value < 40 ? 'low' : value < 70 ? 'mid' : 'high';
  return `<div class="morale-bar ${cls} team-morale-bar" title="Moral media ${value}/99"><span style="width:${clamp(value,1,99)}%"></span><em>${value}/99</em></div>`;
}
function callMotivationalPsychologist(){
  if(!game) return;
  const last = game.staffActions?.motivationalTalk || null;
  const cooldownLeft = turnCooldownLeft(last, PSYCHOLOGIST_COOLDOWN_TURNS);
  if(cooldownLeft > 0){ showNotice(`La charla motivacional estará disponible en ${cooldownLeft} turno(s).`); return; }
  if((game.budget || 0) < PSYCHOLOGIST_COST){ showNotice('Presupuesto insuficiente para llamar al psicólogo motivacional.'); return; }
  recordBudgetChange(-PSYCHOLOGIST_COST, 'Psicólogo motivacional', { type:'staff_psychologist' });
  const success = Math.random() < PSYCHOLOGIST_SUCCESS_CHANCE;
  if(success){
    playersByClub(game.selectedClubId).forEach(player => {
      game.playerMorale[player.id] = clamp(Math.round(currentMorale(player.id) + rnd(18,25)), 1, 99);
    });
  }
  game.staffActions = game.staffActions || {};
  game.staffActions.motivationalTalk = {
    success,
    ...turnStamp(),
    message: success ? 'La charla motivacional fue un éxito' : 'La charla motivacional fue un fracaso'
  };
  saveLocal(true);
  showNotice(game.staffActions.motivationalTalk.message);
  renderEmployees();
}

function getTacticForClub(clubId){
  if(clubId === game.selectedClubId) return game.tactic;
  const club = seed.clubs.find(c=>c.id===clubId);
  const formation = club.reputation > 74 ? '4-3-3' : club.reputation < 61 ? '5-4-1' : '4-4-2';
  return { formation, defense:'posicional', midfield:'posicional', attack:'posicional' };
}
function simulateMatch(match){
  if(window.Simulator20?.simulateMatch) return window.Simulator20.simulateMatch(match);
  throw new Error('Simulador 2.0 no disponible');
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
function pitchEffect(pitch){
  return PITCH_CONDITIONS[pitch] || PITCH_CONDITIONS.Normal;
}
function makeMatchStats(home, away, context={pitch:'Normal'}){
  const effect = pitchEffect(context.pitch);
  const homeMid = clamp(home.midfield + effect.passDelta, 1, 120);
  const awayMid = clamp(away.midfield + effect.passDelta, 1, 120);
  const totalMid = Math.max(1, homeMid + awayMid);
  const homePoss = clamp(Math.round((homeMid / totalMid) * 100 + rnd(-5,5) + 2), 32, 68);
  const awayPoss = 100 - homePoss;
  const homeAttacks = clamp(Math.round(29 + home.attack/2.8 + homeMid/5 - away.defense/6 + rnd(-6,7)), 18, 68);
  const awayAttacks = clamp(Math.round(27 + away.attack/2.8 + awayMid/5 - home.defense/6 + rnd(-6,7)), 18, 68);
  const rawHomeChances = Math.round(homeAttacks * rnd(0.12,0.23) + (home.attack-away.defense)/17);
  const rawAwayChances = Math.round(awayAttacks * rnd(0.12,0.23) + (away.attack-home.defense)/17);
  const homeChances = clamp(Math.round(rawHomeChances * effect.chanceMultiplier), 1, 14);
  const awayChances = clamp(Math.round(rawAwayChances * effect.chanceMultiplier), 1, 14);
  const homeFouls = clamp(Math.round(7 + home.aggression/11 + (100-home.discipline)/16 + rnd(-3,4)), 4, 27);
  const awayFouls = clamp(Math.round(7 + away.aggression/11 + (100-away.discipline)/16 + rnd(-3,4)), 4, 27);
  return {
    home: { attacks:homeAttacks, chances:homeChances, possession:homePoss, fouls:homeFouls, passScore:Math.round(homeMid) },
    away: { attacks:awayAttacks, chances:awayChances, possession:awayPoss, fouls:awayFouls, passScore:Math.round(awayMid) }
  };
}
function makeMatchContext(match, home, away){
  const weatherOptions = ['Soleado', 'Nublado', 'Lluvia leve', 'Lluvia intensa', 'Viento moderado', 'Calor húmedo'];
  const weather = weatherOptions[hashNumber(`${match.id}-weather-${game?.matchdayIndex || 0}`, weatherOptions.length)];
  const homeClub = seed.clubs.find(c=>c.id===match.homeId);
  const awayClub = seed.clubs.find(c=>c.id===match.awayId);
  const pitchScore = fieldScoreForClub(match.homeId);
  const pitch = fieldConditionName(pitchScore);
  const effect = pitchEffect(pitch);
  const homeFans = Math.max(800, Math.round((homeClub?.reputation || 60) * rnd(210,360)));
  const awayFans = Math.max(120, Math.round((awayClub?.reputation || 60) * rnd(18,70)));
  return { weather, pitch, pitchScore, homeFans, awayFans, pitchEffect:effect };
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
    const posBonus = p.position === 'DC' ? 45 : ['ED','EI','MCO'].includes(p.position) ? 28 : ['MC','MCD'].includes(p.position) ? 10 : 3;
    return effectiveSkill(p,'remate') + effectiveSkill(p,'posicionamiento') + posBonus;
  });
  const possibleAssisters = lineup.filter(p=>p.id !== scorer.id);
  const hasAssist = Math.random() < 0.72;
  const assister = hasAssist ? weightedPick(possibleAssisters, p => p.position === 'POR' ? 1 : effectiveSkill(p,'paseCorto') + effectiveSkill(p,'vision') + (['ED','EI','MCO','MC'].includes(p.position)?25:5)) : null;
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
function makeInjuries(clubId, ownPower, rivalPower, context={pitch:'Normal'}){
  const injuries = [];
  const candidates = (ownPower.lineup || []).filter(player => !isUnavailable(player.id));
  candidates.forEach(player => {
    const chance = injuryChanceForPlayer(player.id, context.pitch);
    if(Math.random() < chance){
      const injury = pickInjuryType();
      const matchesOut = Math.floor(rnd(injury.minTurns, injury.maxTurns + 1));
      const duringMatch = Math.random() < 0.72;
      injuries.push({
        clubId,
        playerId:player.id,
        type:'injury',
        name:injury.name,
        injuryLabel:injury.name,
        probability:injury.probability,
        chance:Math.round(chance * 100),
        matchesOut,
        minute:duringMatch ? Math.floor(rnd(8,89)) : 90,
        phase:duringMatch ? 'durante' : 'final'
      });
    }
  });
  return injuries.sort((a,b)=>a.minute-b.minute);
}
function makeSubstitutions(clubId, tactic, goals){
  if(clubId !== game.selectedClubId || !tactic?.autoSubs?.length) return [];
  const events = [];
  const onPitch = new Set((tactic.starters || []).map(Number));
  const alreadyIn = new Set();
  for(const rule of tactic.autoSubs){
    const outId = Number(rule.outId || 0);
    const inId = Number(rule.inId || 0);
    if(!outId || !inId || !onPitch.has(outId) || alreadyIn.has(inId) || !canEnterMatch(inId)) continue;
    const minute = Math.random() < 0.10 ? 45 : Math.floor(rnd(60,91));
    const score = scoreAtMinute(goals, minute, clubId);
    const outPlayer = playerById(outId);
    let execute = false;
    if(rule.trigger === 'injuryOnly') execute = false;
    if(rule.trigger === 'tired') execute = currentCondition(outId) < 68 || effectiveSkill(outPlayer,'resistencia') < 72 || minute >= 75 || Math.random() < 0.35;
    if(rule.trigger === 'best'){
      const inPlayer = playerById(inId);
      const outValue = outPlayer ? effectiveOverall(outPlayer) * conditionFactor(outId) : 0;
      const inValue = inPlayer ? benchOverallValue(inPlayer) * conditionFactor(inId) : 0;
      execute = inValue >= outValue * 0.96 || currentCondition(outId) < 72 || minute >= 75;
    }
    if(execute){
      onPitch.delete(outId);
      onPitch.add(inId);
      alreadyIn.add(inId);
      events.push({ clubId, outId, inId, minute, trigger:rule.trigger, injuredSubPenalty:canUseInjuredAsSub(inId) });
    }
  }
  return events.slice(0,5);
}
function makeInjurySubstitutions(clubId, tactic, injuries, existingSubs=[]){
  const ownInjuries = (injuries || []).filter(i => i.clubId === clubId && i.phase !== 'final');
  if(!ownInjuries.length) return [];
  const starterIds = (tactic?.starters?.length ? tactic.starters : selectLineup(clubId, tactic).map(p=>p.id)).map(Number);
  const benchIds = (tactic?.bench?.length ? tactic.bench : autoSelectBench(clubId, starterIds).map(p=>p.id)).map(Number);
  const usedIn = new Set(existingSubs.filter(s=>s.clubId===clubId).map(s=>Number(s.inId)));
  const alreadyOut = new Set(existingSubs.filter(s=>s.clubId===clubId).map(s=>Number(s.outId)));
  const events = [];
  for(const injury of ownInjuries){
    const outId = Number(injury.playerId);
    if(alreadyOut.has(outId)) continue;
    const outPlayer = playerById(outId);
    const candidate = benchIds
      .map(id => playerById(id))
      .filter(p => p && !usedIn.has(p.id) && canEnterMatch(p.id))
      .sort((a,b)=> (benchOverallValue(b) + (outPlayer && playerGroup(b.position)===playerGroup(outPlayer.position) ? 20 : 0)) - (benchOverallValue(a) + (outPlayer && playerGroup(a.position)===playerGroup(outPlayer.position) ? 20 : 0)))[0];
    if(candidate){
      usedIn.add(candidate.id);
      alreadyOut.add(outId);
      events.push({ clubId, outId, inId:candidate.id, minute:injury.minute, trigger:'injury', injuredSubPenalty:canUseInjuredAsSub(candidate.id) });
    }
    if(existingSubs.filter(s=>s.clubId===clubId).length + events.length >= 5) break;
  }
  return events;
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
    const label = i.injuryLabel || i.name || 'Lesión';
    game.playerStatus[i.playerId] = {
      ...playerStatus(i.playerId),
      injuredThrough: game.matchdayIndex + i.matchesOut,
      injuryLabel: label,
      injuryChance: i.chance,
      injuredAtMatchday: game.matchdayIndex
    };
  });
}
function collectOwnProblems(result){
  if(!result) return [];
  const ownClub = game.selectedClubId;
  const injuries = (result.injuries || []).filter(i => i.clubId === ownClub).map(i => ({ type:'injury', playerId:i.playerId }));
  const reds = (result.cards || []).filter(c => c.clubId === ownClub && (c.type === 'red' || c.type === 'secondYellowRed')).map(c => ({ type:'red', playerId:c.playerId }));
  return [...injuries, ...reds];
}
function removeOwnUnavailableFromTactic(problems=[]){
  if(!game?.tactic || !problems.length) return;
  const ids = new Set(problems.map(p => Number(p.playerId)).filter(Boolean));
  if(!ids.size) return;
  const starters = (game.tactic.starters || []).slice(0,11);
  while(starters.length < 11) starters.push(0);
  let changed = false;
  for(let i=0;i<starters.length;i++){
    if(ids.has(Number(starters[i]))){ starters[i] = 0; changed = true; }
  }
  const bench = (game.tactic.bench || []).filter(id => !ids.has(Number(id)));
  const autoSubs = (game.tactic.autoSubs || []).map(rule => ({
    ...rule,
    outId: ids.has(Number(rule.outId)) ? 0 : Number(rule.outId || 0),
    inId: ids.has(Number(rule.inId)) ? 0 : Number(rule.inId || 0)
  }));
  if(changed || bench.length !== (game.tactic.bench || []).length){
    game.tactic = applyStarterMentalities({ ...game.tactic, starters, bench, autoSubs });
  }
}

function playerModalActionsMarkup(player){
  const clubId = Number(player.clubId || 0);
  if(clubId === Number(game.selectedClubId)){
    return `<div class="card inner player-action-card"><h3>Acciones</h3><div class="row message-actions"><button class="danger ghost" data-dismiss-player="${player.id}">Despedir</button><button class="primary" data-offer-own-player="${player.id}">Ofrecer a clubes</button></div></div>`;
  }
  if(clubId > 0){
    return `<div class="card inner player-action-card"><h3>Mercado</h3><div class="row message-actions"><button class="primary" data-make-player-offer="${player.id}">Hacer oferta</button></div></div>`;
  }
  return '';
}
function bindPlayerModalActions(playerId){
  document.querySelector('[data-dismiss-player]')?.addEventListener('click', () => dismissOwnPlayer(playerId));
  document.querySelector('[data-offer-own-player]')?.addEventListener('click', () => offerOwnPlayerToClubs(playerId));
  document.querySelector('[data-make-player-offer]')?.addEventListener('click', () => openPurchaseOfferModal(playerId));
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
          <div class="stat-rank"><span>Partidos</span><strong>${stats?.played || 0}</strong></div>
          <div class="stat-rank"><span>Goles</span><strong>${stats?.goals || 0}</strong></div>
          <div class="stat-rank"><span>Asistencias</span><strong>${stats?.assists || 0}</strong></div>
          <div class="stat-rank"><span>Tarjetas</span><strong><span class="yellow-card">■</span> ${stats?.yellow || 0} / <span class="red-card">■</span> ${stats?.red || 0}</strong></div>
        </div>
        ${playerModalActionsMarkup(p)}
      </div>
    </div>`;
  openModal(body);
  bindPlayerModalActions(playerId);
}


function dismissOwnPlayer(playerId){
  const player = playerById(playerId);
  if(!player || Number(player.clubId) !== Number(game.selectedClubId)) return;
  if(!confirm(`Despedir a ${player.name} del plantel?`)) return;
  removePlayerFromCurrentTactic(player.id);
  player.clubId = 0;
  player.freeAgent = true;
  refreshPlayerClause(player);
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
  const pct = 35 + hashNumber(`forced-sale-${player.id}-${Date.now()}`, 41); // 35% a 75% de la cláusula
  const amount = Math.round(refreshPlayerClause(player) * pct / 100);
  const foreignClub = FOREIGN_CLUBS[hashNumber(`forced-foreign-${player.id}-${Date.now()}`, FOREIGN_CLUBS.length)];
  pushGameMessage({
    type:'mercado',
    priority:'high',
    title:`Oferta recibida por ${playerLastName(player.name)}`,
    body:`${foreignClub} acercó una oferta de ${formatMoney(amount)} por ${player.name}. Al haberlo ofrecido activamente, el porcentaje pagado sobre la cláusula es menor.`,
    action:{ type:'transferOffer', status:'pending', playerId:player.id, amount, foreignClub, pct }
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
  const clause = refreshPlayerClause(player);
  const body = `<div class="purchase-offer-modal">
    <p class="label">Hacer oferta</p>
    <h2>${escapeHtml(player.name)}</h2>
    <p class="muted">${escapeHtml(clubName(player.clubId))} · ${roleBadge(player.position)} · ${visibleOverall(player)} de media · Cláusula ${formatMoney(clause)}</p>
    <div class="grid cols-3 offer-choice-grid" style="margin-top:14px">
      <button class="card clickable plain" data-submit-player-offer="low"><h3>Ofrecer 50% menos</h3><p>${formatMoney(Math.round(clause * 0.50))}</p></button>
      <button class="card clickable plain" data-submit-player-offer="mid"><h3>Ofrecer 25% más</h3><p>${formatMoney(Math.round(clause * 0.75))}</p></button>
      <button class="card clickable plain" data-submit-player-offer="clause"><h3>Ofrecer cláusula</h3><p>${formatMoney(clause)}</p></button>
    </div>
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
  const clause = refreshPlayerClause(player);
  const cfg = purchaseOfferConfig(kind, clause);
  if((game.budget || 0) < cfg.amount){
    showNotice('Presupuesto insuficiente para realizar esta oferta.');
    return;
  }
  const accepted = Math.random() < cfg.chance;
  if(!accepted){
    pushGameMessage({ type:'mercado', title:'Oferta rechazada', body:cfg.fail, priority:'normal' });
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
  showNotice('Oferta aceptada. El jugador llegará en el próximo turno.');
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
    player.clubId = Number(t.toClubId || game.selectedClubId);
    player.freeAgent = false;
    player.sold = false;
    refreshPlayerClause(player);
    ensurePlayerStateForAll();
    if(game.playerStats && !game.playerStats[player.id]) game.playerStats[player.id] = { playerId:player.id, clubId:player.clubId, goals:0, assists:0, yellow:0, red:0, played:0, injuries:0 };
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
function showMatchRevealModal(match){
  if(!match) return;
  const context = match.matchContext || { weather:'No registrado', pitch:'No registrado', homeFans:0, awayFans:0 };
  const html = `
    <div class="match-reveal-shell">
      <div class="match-modal-head">
        <p class="label">Jornada ${match.matchday} · ${match.date}</p>
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
          <div><p class="label">Hinchas locales</p><strong>${new Intl.NumberFormat('es-AR').format(context.homeFans || 0)}</strong></div>
          <div><p class="label">Hinchas visitantes</p><strong>${new Intl.NumberFormat('es-AR').format(context.awayFans || 0)}</strong></div>
        </div>
      </div>
    </div>`;
  openModal(html);
  const stages = matchRevealStages(match);
  const renderStage = (idx) => renderMatchRevealStage(match, stages[idx], idx, stages.length);
  renderStage(0);
  stages.slice(1).forEach((stage, i) => {
    matchRevealTimers.push(setTimeout(() => renderStage(i + 1), stage.time));
  });
  $('finishMatchReveal')?.addEventListener('click', () => {
    clearMatchRevealTimers();
    renderStage(stages.length - 1);
  });
}
function matchRevealStages(match){
  return [
    { label:'Salida al campo', minute:0, factor:0, time:0, note:'Los equipos ya están en cancha. El partido se simula de una vez, pero la visualización avanza gradualmente.' },
    { label:'Primeros minutos', minute:18, factor:.22, time:4000, note:'Primer tramo de posesión, ataques iniciales y primeras faltas.' },
    { label:'Media hora de juego', minute:32, factor:.38, time:8000, note:'El partido empieza a mostrar una tendencia táctica.' },
    { label:'Entretiempo', minute:45, factor:.52, time:12000, note:'Cierre del primer tiempo. Algunos cambios pueden aparecer desde este punto.' },
    { label:'Tramo final', minute:75, factor:.78, time:16000, note:'Se definen los momentos de mayor riesgo, tarjetas y posibles lesiones.' },
    { label:'Final del partido', minute:90, factor:1, time:20000, note:'Resultado final y estadísticas completas.' }
  ];
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
  box.innerHTML = `
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
    passScore: stats.passScore
  };
}
function revealTeamStatsCard(clubId, stats, sideLabel){
  return `<div class="card inner team-stat-card"><h3>${clubLink(clubId)} <span class="pill">${escapeHtml(sideLabel)}</span></h3>
    <div class="stat-rank"><span>Total de ataques</span><strong>${stats.attacks}</strong></div>
    <div class="stat-rank"><span>Ocasiones de gol</span><strong>${stats.chances}</strong></div>
    <div class="stat-rank"><span>Posesión</span><strong>${stats.possession}%</strong></div>
    <div class="stat-rank"><span>Faltas</span><strong>${stats.fouls}</strong></div>
    <div class="stat-rank"><span>Puntuación de pases</span><strong>${stats.passScore ?? '—'}</strong></div>
  </div>`;
}
function matchRevealEvents(match, minute){
  const events = [];
  (match.goals || []).forEach(g => events.push({ minute:g.minute, type:'goal', data:g }));
  (match.cards || []).forEach(c => events.push({ minute:c.minute, type:'card', data:c }));
  (match.injuries || []).forEach(i => events.push({ minute:i.minute, type:'injury', data:i }));
  (match.substitutions || []).forEach(s => events.push({ minute:s.minute, type:'sub', data:s }));
  return events.filter(e => e.minute <= minute).sort((a,b)=>a.minute-b.minute);
}
function revealEventLine(event){
  if(event.type === 'goal'){
    const g = event.data;
    const p = playerById(g.playerId);
    const a = g.assistId ? playerById(g.assistId) : null;
    return `<div class="stat-rank event-line"><span>${g.minute}' <span class="event-icon ball">⚽</span> ${escapeHtml(p?.name || 'Jugador')} ${clubBadge(g.clubId)}</span><strong>${a ? `<span class="event-icon boot">🥾</span> ${escapeHtml(playerLastName(a.name))}` : 'Sin asist.'}</strong></div>`;
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
    <div class="stat-rank"><span>Puntuación de pases</span><strong>${stats.passScore ?? '—'}</strong></div>
  </div>`;
}
function goalLine(g){
  const p = playerById(g.playerId);
  const a = g.assistId ? playerById(g.assistId) : null;
  return `<div class="stat-rank event-line"><span>${g.minute}' <span class="event-icon ball">⚽</span> ${escapeHtml(p?.name || 'Jugador')} ${clubBadge(g.clubId)}</span><strong>${a ? `<span class="event-icon boot">🥾</span> ${escapeHtml(a.name.split(' ').slice(-1)[0])}` : 'Sin asist.'}</strong></div>`;
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
function openNewGameModal(force=false){
  if(!force && game && newGameModalShown) return;
  const body = `
    <div class="new-game-modal">
      <p class="label">Nueva partida</p>
      <h2>Elegir club</h2>
      <p class="muted">Seleccioná el club inicial. Al empezar se crea una partida nueva y se guarda localmente en el navegador.</p>
      <label for="modalClubSelect">Club</label>
      <select id="modalClubSelect">${clubSelectOptionsMarkup()}</select>
      <div class="row" style="margin-top:14px"><button id="btnStartNewGameModal" class="primary">Empezar</button></div>
    </div>`;
  openModal(body);
  $('btnStartNewGameModal')?.addEventListener('click', () => {
    const selected = Number($('modalClubSelect')?.value || 0);
    if(selected) newGame(selected);
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

init();
