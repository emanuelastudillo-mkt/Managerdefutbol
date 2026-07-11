/* V6.25 · Ranking online con manager_name explícito y alias estables. */

function rankingStoredEndpoint(){
  const configured = String(RANKING_APPS_SCRIPT_URL || '').trim();
  if(configured) return configured;
  try{ return localStorage.getItem('fmRankingEndpoint') || ''; }
  catch(_){ return ''; }
}
function rankingStoredManagerName(){
  try{ return (game?.rankingManagerName || localStorage.getItem('fmRankingManagerName') || '').trim(); }
  catch(_){ return (game?.rankingManagerName || '').trim(); }
}
function setRankingStoredManagerName(value){
  const clean = String(value || '').trim().slice(0, 40);
  try{ localStorage.setItem('fmRankingManagerName', clean); }catch(_){ /* sin almacenamiento */ }
  if(game) game.rankingManagerName = clean;
  return clean;
}

function rankingCurrentGameDate(){
  if(!game) return '';
  if(validIsoDate(game.currentDate)) return game.currentDate;
  const fallback = dateForSeasonState(game);
  return validIsoDate(fallback) ? fallback : '';
}
function rankingUploadCooldownInfo(){
  const current = rankingCurrentGameDate();
  const last = validIsoDate(game?.rankingLastManualUploadGameDate) ? game.rankingLastManualUploadGameDate : '';
  const cooldown = Math.max(0, Math.round(Number(RANKING_UPLOAD_COOLDOWN_DAYS || 50)));
  if(!game || !validIsoDate(current)){
    return { canUpload:false, elapsed:null, remaining:cooldown, last, current, cooldown };
  }
  if(!last || cooldown <= 0){
    return { canUpload:true, elapsed:last ? Math.max(0, daysBetweenIsoDates(last, current)) : cooldown, remaining:0, last, current, cooldown };
  }
  const elapsed = Math.max(0, daysBetweenIsoDates(last, current));
  const remaining = Math.max(0, cooldown - elapsed);
  return { canUpload:remaining <= 0, elapsed, remaining, last, current, cooldown };
}
function rankingCooldownText(info=rankingUploadCooldownInfo()){
  if(!game) return 'No hay partida activa.';
  if(info.canUpload) return 'Carga manual disponible.';
  return `Carga manual disponible en ${info.remaining} día(s) de juego.`;
}
function rankingManualEventType(){
  const info = rankingUploadCooldownInfo();
  const day = Number(seasonDayFromDate(info.current || rankingCurrentGameDate(), game?.seasonYear || seasonYearForNumber(game?.seasonNumber || 1)) || 0);
  return `manual_snapshot_d${day || 0}`;
}

function normalizeRankingEndpoint(url){
  const configured = String(url || '').trim().replace(/\/+$/, '');
  if(configured) return configured;
  return 'https://rankingdemanagers.emanuelastudillo.workers.dev';
}
function rankingConfiguredPaths(kind){
  const cfg = (window.GAME_CONFIG && window.GAME_CONFIG.ranking) ? window.GAME_CONFIG.ranking : {};
  const raw = kind === 'submit' ? cfg.submitPaths : cfg.readPaths;
  const defaults = kind === 'submit'
    ? [
        // Worker Cloudflare + D1 V6.05: carga principal de carrera.
        'ranking/career','api/ranking/career','career','records/career','api/records/career',
        // Compatibilidad con variantes anteriores.
        'ranking/season','api/ranking/season','season','records/season','api/records/season',
        'records','ranking','scores','submit','api/records','api/ranking','api/scores','api/submit',''
      ]
    : [
        // Lectura principal del ranking por carrera; temporada queda como respaldo.
        'ranking/career','api/ranking/career','career','records/career','api/records/career','ranking/season','api/ranking/season',
        'ranking','records','scores','api/ranking','api/records','api/scores',''
      ];
  const source = Array.isArray(raw) && raw.length ? raw.concat(defaults) : defaults;
  const seen = new Set();
  return source
    .map(path => String(path || '').trim().replace(/^\/+|\/+$/g, ''))
    .filter(path => {
      if(seen.has(path)) return false;
      seen.add(path);
      return true;
    });
}
function rankingRouteLabel(path){
  const clean = String(path || '').trim().replace(/^\/+|\/+$/g, '');
  return clean ? `/${clean}` : '/';
}
function rankingApiUrl(endpoint, path, query=''){
  const base = normalizeRankingEndpoint(endpoint);
  const cleanPath = String(path || '').trim().replace(/^\/+|\/+$/g, '');
  const suffix = cleanPath ? `/${cleanPath}` : '';
  return `${base}${suffix}${query || ''}`;
}
function rankingStoredAuthToken(){
  const configured = String(RANKING_TOKEN || '').trim();
  if(configured) return configured;
  try{
    return String(localStorage.getItem('fmRankingAuthToken') || localStorage.getItem('fmRankingToken') || localStorage.getItem('rankingToken') || '').trim();
  }catch(_){ return ''; }
}

function rankingStoredAuthUsername(){
  try{ return String(localStorage.getItem('fmRankingAuthUser') || localStorage.getItem('fmRankingUsername') || '').trim(); }
  catch(_){ return ''; }
}
function rankingStoredAuthExpiresAt(){
  try{ return String(localStorage.getItem('fmRankingAuthExpiresAt') || '').trim(); }
  catch(_){ return ''; }
}
function rankingAuthPaths(kind){
  const cfg = (window.GAME_CONFIG && window.GAME_CONFIG.ranking) ? window.GAME_CONFIG.ranking : {};
  const raw = kind === 'me' ? cfg.mePaths : cfg.loginPaths;
  const defaults = kind === 'me'
    ? ['auth/me','me','api/auth/me','api/me','user','api/user']
    : ['auth/login','login','api/auth/login','api/login','auth/register','register','api/auth/register','api/register','auth/session','session','api/auth/session','api/session'];
  const source = Array.isArray(raw) && raw.length ? raw.concat(defaults) : defaults;
  const seen = new Set();
  return source
    .map(path => String(path || '').trim().replace(/^\/+|\/+$/g, ''))
    .filter(path => {
      if(seen.has(path)) return false;
      seen.add(path);
      return true;
    });
}
function rankingExtractToken(data){
  if(!data || typeof data !== 'object') return '';
  const candidates = [
    data.token, data.access_token, data.accessToken, data.authToken,
    data?.data?.token, data?.data?.access_token, data?.session?.token,
    data?.auth?.token, data?.result?.token
  ];
  return String(candidates.find(value => value !== undefined && value !== null && String(value).trim()) || '').trim();
}
function rankingExtractUsername(data, fallback=''){
  if(!data || typeof data !== 'object') return String(fallback || '').trim();
  const candidates = [
    data?.user?.username, data?.user?.name, data?.user?.email,
    data?.data?.user?.username, data?.data?.user?.name, data?.data?.username,
    data?.username, data?.name, data?.email, fallback
  ];
  return String(candidates.find(value => value !== undefined && value !== null && String(value).trim()) || '').trim();
}
function rankingStoreAuthSession(data, fallbackUsername=''){
  const token = rankingExtractToken(data);
  if(!token) return '';
  const username = rankingExtractUsername(data, fallbackUsername);
  const expiresAt = String(data?.expires_at || data?.expiresAt || data?.data?.expires_at || data?.session?.expires_at || '').trim();
  try{
    localStorage.setItem('fmRankingAuthToken', token);
    localStorage.setItem('fmRankingToken', token);
    localStorage.setItem('rankingToken', token);
    if(username) localStorage.setItem('fmRankingAuthUser', username);
    if(expiresAt) localStorage.setItem('fmRankingAuthExpiresAt', expiresAt);
    if(data?.user?.id || data?.data?.user?.id) localStorage.setItem('fmRankingAuthUserId', String(data?.user?.id || data?.data?.user?.id));
  }catch(_){ /* sin almacenamiento */ }
  if(username && (!rankingStoredManagerName() || rankingStoredManagerName() === 'Manager')) setRankingStoredManagerName(username);
  return token;
}
function rankingClearAuthSession(){
  try{
    ['fmRankingAuthToken','fmRankingToken','rankingToken','fmRankingAuthUser','fmRankingUsername','fmRankingAuthExpiresAt','fmRankingAuthUserId'].forEach(key => localStorage.removeItem(key));
  }catch(_){ /* sin almacenamiento */ }
}
function rankingAuthStatusMarkup(endpoint){
  const token = rankingStoredAuthToken();
  const user = rankingStoredAuthUsername() || rankingStoredManagerName();
  const expiresAt = rankingStoredAuthExpiresAt();
  if(!endpoint) return '<span class="bad">Ranking sin endpoint configurado.</span>';
  if(token){
    const source = String(RANKING_TOKEN || '').trim() ? 'config.js' : 'sesión local';
    return `<span class="ok">Sesión activa${user ? ` · ${escapeHtml(user)}` : ''}</span><span class="small muted">Token desde ${escapeHtml(source)}${expiresAt ? ` · vence ${escapeHtml(expiresAt)}` : ''}</span>`;
  }
  if(RANKING_REQUIRES_LOGIN) return '<span class="warn">Sin sesión. Iniciá sesión para subir récords.</span>';
  return '<span class="muted">Login opcional.</span>';
}
function rankingLoginPanelMarkup(endpoint){
  const token = rankingStoredAuthToken();
  const disabled = endpoint ? '' : 'disabled';
  const user = rankingStoredAuthUsername() || rankingStoredManagerName() || '';
  return `<div class="card ranking-login-card">
    <div class="row"><div><p class="label">Cuenta online</p><h3>Login del ranking</h3></div><span class="pill">${RANKING_REQUIRES_LOGIN ? 'Requerido' : 'Opcional'}</span></div>
    <p class="muted">La partida puede estar empezada. El login sólo guarda el token en este navegador y lo usa para subir récords.</p>
    <div id="rankingAuthStatus" class="ranking-auth-status small">${rankingAuthStatusMarkup(endpoint)}</div>
    <form id="rankingLoginForm" class="ranking-login-form">
      <input id="rankingLoginUser" name="username" type="text" autocomplete="username" placeholder="Usuario" value="${escapeHtml(user)}" ${disabled} />
      <input id="rankingLoginPassword" name="password" type="password" autocomplete="current-password" placeholder="Contraseña opcional" ${disabled} />
      <button class="primary" type="submit" ${disabled}>Iniciar / recuperar sesión</button>
      <button id="rankingCheckSession" class="ghost" type="button" ${endpoint && token ? '' : 'disabled'}>Verificar sesión</button>
      <button id="rankingLogout" class="danger" type="button" ${token && !String(RANKING_TOKEN || '').trim() ? '' : 'disabled'}>Cerrar sesión</button>
    </form>
    <div id="rankingLoginStatus" class="small muted">${token ? 'Token guardado. Ya podés subir datos si el cooldown lo permite.' : 'La contraseña es opcional. Si tu cuenta fue creada sin contraseña, ingresá sólo el usuario.'}</div>
  </div>`;
}
function rankingLoginRequestBodies(username, password){
  const cleanUser = String(username || '').trim();
  const cleanPassword = String(password || '');
  const json = payload => ({ headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(payload) });
  const form = payload => ({ headers:{ 'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8' }, body:new URLSearchParams(payload).toString() });
  const bodies = [];
  if(cleanPassword){
    bodies.push(
      json({ username:cleanUser, password:cleanPassword }),
      json({ user:cleanUser, username:cleanUser, password:cleanPassword }),
      json({ email:cleanUser, password:cleanPassword }),
      form({ username:cleanUser, password:cleanPassword })
    );
  }
  // Compatibilidad con el Worker original del proyecto: usuario + token, sin contraseña.
  bodies.push(
    json({ username:cleanUser }),
    json({ user:cleanUser, username:cleanUser }),
    json({ managerName:cleanUser, username:cleanUser }),
    form({ username:cleanUser }),
    form({ user:cleanUser })
  );
  const seen = new Set();
  return bodies.filter(req => {
    const key = `${req.headers['Content-Type']}|${req.body}`;
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
async function rankingLoginRequest(endpoint, username, password){
  const paths = rankingAuthPaths('login');
  const bodies = rankingLoginRequestBodies(username, password);
  let lastMessage = '';
  let authMessage = '';
  const tried = [];
  for(const path of paths){
    const route = rankingRouteLabel(path);
    for(const req of bodies){
      tried.push(route);
      let response;
      let data = {};
      try{
        response = await fetch(rankingApiUrl(endpoint, path), { method:'POST', headers:req.headers, body:req.body });
        data = await response.json().catch(() => ({}));
      }catch(error){
        lastMessage = error?.message || 'Error de conexión con el ranking.';
        continue;
      }
      if(response.ok && data.ok !== false){
        const token = rankingStoreAuthSession(data, username);
        if(token) return data;
        lastMessage = 'El login respondió sin token.';
        continue;
      }
      const message = rankingResponseErrorMessage(data, response, 'No se pudo iniciar sesión.');
      lastMessage = message;
      if(rankingIsRouteMissing(message, response)) break;
      if([401,403].includes(Number(response.status || 0)) || /credencial|contraseña|password|usuario|login|token/i.test(message)){
        authMessage = message;
        // No cortar acá: algunos Workers devuelven error por formato en una ruta, pero aceptan usuario solo en otra.
        continue;
      }
    }
  }
  const uniqueRoutes = [...new Set(tried)].join(', ');
  if(authMessage && !String(password || '').trim()){
    throw new Error(`${authMessage}. Probá ingresando sólo tu usuario exacto del ranking o creá nuevamente la sesión en el Worker.`);
  }
  throw new Error(lastMessage || `No se encontró una ruta válida de login. Rutas probadas: ${uniqueRoutes}`);
}
async function loginRankingAccount(event){
  event?.preventDefault?.();
  const endpoint = normalizeRankingEndpoint(rankingStoredEndpoint());
  const username = String($('rankingLoginUser')?.value || '').trim();
  const password = String($('rankingLoginPassword')?.value || '');
  const status = $('rankingLoginStatus');
  if(!username){ showNotice('Ingresá el usuario del ranking. La contraseña es opcional.'); return false; }
  if(status) status.textContent = password ? 'Iniciando sesión...' : 'Buscando sesión por usuario...';
  const submit = document.querySelector('#rankingLoginForm button[type="submit"]');
  if(submit) submit.disabled = true;
  try{
    const data = await rankingLoginRequest(endpoint, username, password);
    const savedUser = rankingExtractUsername(data, username);
    if(status) status.textContent = `Sesión iniciada${savedUser ? ` como ${savedUser}` : ''}.`;
    showNotice('Sesión iniciada en el ranking online.');
    renderRankingOnline();
    return true;
  }catch(error){
    const message = error?.message || 'No se pudo iniciar sesión.';
    if(status) status.textContent = message;
    showNotice(message);
    if(submit) submit.disabled = false;
    return false;
  }
}
async function checkRankingSession(){
  const endpoint = normalizeRankingEndpoint(rankingStoredEndpoint());
  const token = rankingStoredAuthToken();
  const status = $('rankingLoginStatus');
  if(!token){ showNotice('No hay sesión guardada.'); return false; }
  if(status) status.textContent = 'Verificando sesión...';
  let lastMessage = '';
  try{
    for(const path of rankingAuthPaths('me')){
      const response = await fetch(rankingApiUrl(endpoint, path), { method:'GET', headers:rankingRequestHeaders(false) });
      const data = await response.json().catch(() => ({}));
      if(response.ok && data.ok !== false){
        const user = rankingExtractUsername(data, rankingStoredAuthUsername());
        if(user){
          try{ localStorage.setItem('fmRankingAuthUser', user); }catch(_){ /* sin almacenamiento */ }
        }
        if(status) status.textContent = `Sesión válida${user ? ` · ${user}` : ''}.`;
        showNotice('Sesión válida en el ranking online.');
        renderRankingOnline();
        return true;
      }
      const message = rankingResponseErrorMessage(data, response, 'Sesión no válida.');
      lastMessage = message;
      if(!rankingIsRouteMissing(message, response)) break;
    }
    throw new Error(lastMessage || 'No se pudo verificar la sesión.');
  }catch(error){
    const message = error?.message || 'No se pudo verificar la sesión.';
    if(status) status.textContent = message;
    showNotice(message);
    return false;
  }
}
function logoutRankingAccount(){
  rankingClearAuthSession();
  showNotice('Sesión del ranking cerrada en este navegador.');
  renderRankingOnline();
}
function rankingRequestHeaders(json=true){
  const headers = json ? { 'Content-Type':'application/json' } : {};
  const token = rankingStoredAuthToken();
  if(token){
    headers.Authorization = /^Bearer\s+/i.test(token) ? token : `Bearer ${token}`;
  }
  return headers;
}
function rankingResponseErrorMessage(data, response, fallback='Error al conectar con el ranking online.'){
  return String(data?.error || data?.message || data?.detail || (response ? `Error HTTP ${response.status}` : fallback) || fallback);
}
function rankingIsRouteMissing(message, response){
  return Number(response?.status || 0) === 404 || /ruta no encontrada|route not found|not found|no encontrado/i.test(String(message || ''));
}
const RANKING_AUTO_EVENT_LABELS = {
  career_snapshot:'Carrera del manager',
  season_end:'Carrera actualizada',
  dismissal:'Carrera cerrada por despido',
  season_snapshot:'Resumen automático',
  manual_snapshot:'Carga manual'
};
function rankingEventLabel(eventType){
  const event = String(eventType || '');
  if(event.startsWith('manual_snapshot')) return 'Carga manual de carrera';
  return RANKING_AUTO_EVENT_LABELS[event] || 'Carrera del manager';
}
function rankingSubmissionKey(payload, eventType=payload?.eventType || 'career_snapshot'){
  if(String(payload?.recordScope || '') === 'career') return `${payload?.saveCode || 'FM'}-CAREER`;
  const event = String(eventType || 'season_snapshot');
  const manualSuffix = event.startsWith('manual_snapshot') ? `-D${payload?.seasonDay || 0}` : '';
  return `${payload?.saveCode || 'FM'}-T${payload?.season || 1}-C${payload?.clubId || 0}-${event}${manualSuffix}`;
}
function rankingSeasonInitialBudget(season){
  if(!game) return 0;
  const seasonNumber = Number(season || game.seasonNumber || 1);
  const explicit = Number(game.seasonBudgetStartBySeason?.[seasonNumber]);
  if(Number.isFinite(explicit)) return Math.max(0, Math.round(explicit));
  if(Number.isFinite(Number(game.seasonInitialBudget))) return Math.max(0, Math.round(Number(game.seasonInitialBudget)));
  const first = (game.budgetHistory || []).find(entry => Number(entry.season || seasonNumber) === seasonNumber && Number.isFinite(Number(entry.budget)));
  if(first) return Math.max(0, Math.round(Number(first.budget || 0) - Number(first.delta || 0)));
  return Math.max(0, Math.round(Number(game.budget || 0)));
}

function rankingCareerSeasons(){
  if(!game) return [];
  game.managerStats = normalizeManagerStats(game.managerStats || createInitialManagerStats());
  const seasons = Array.isArray(game.managerStats.seasons) ? game.managerStats.seasons.map(item => ({ ...item })) : [];
  const current = game.managerStats.currentSeason || {};
  const currentPlayed = Number(current.played || 0);
  const seasonNumber = Number(game.seasonNumber || current.season || 1);
  const alreadyStored = seasons.some(item => Number(item.season || 0) === seasonNumber && Number(item.clubId || 0) === Number(game.selectedClubId || current.clubId || 0));
  if(currentPlayed > 0 && !alreadyStored){
    const division = clubDivision(game.selectedClubId);
    const table = sortedStandings(division.id);
    const index = table.findIndex(row => Number(row.clubId) === Number(game.selectedClubId));
    const row = table[index] || game.standings?.[game.selectedClubId] || {};
    seasons.push({
      season:seasonNumber,
      clubId:game.selectedClubId,
      clubName:clubName(game.selectedClubId),
      divisionId:division.id,
      divisionName:division.name,
      divisionOrder:Number(division.order || 1),
      position:index >= 0 ? index + 1 : 0,
      pts:Number(row.pts || (Number(current.won || 0) * 3 + Number(current.drawn || 0))),
      pg:Number(current.won || 0),
      pe:Number(current.drawn || 0),
      pp:Number(current.lost || 0),
      gf:Number(current.gf || 0),
      gc:Number(current.gc || 0),
      title:index === 0,
      current:true
    });
  }
  return seasons;
}
function rankingCareerInitialBudget(seasons=[]){
  if(!game) return 0;
  const ordered = seasons.slice().filter(item => Number(item.season || 0) > 0).sort((a,b)=>Number(a.season||0)-Number(b.season||0));
  const firstSeason = Number(ordered[0]?.season || 1);
  const explicit = Number(game.seasonBudgetStartBySeason?.[firstSeason]);
  if(Number.isFinite(explicit)) return Math.max(0, Math.round(explicit));
  const firstHistory = (game.budgetHistory || []).slice().sort((a,b)=>String(a.date || '').localeCompare(String(b.date || '')) || Number(a.season || 0)-Number(b.season || 0))[0];
  if(firstHistory && Number.isFinite(Number(firstHistory.budget))) return Math.max(0, Math.round(Number(firstHistory.budget || 0) - Number(firstHistory.delta || 0)));
  return rankingSeasonInitialBudget(firstSeason);
}
function rankingBestCareerPosition(seasons=[]){
  const positions = seasons.map(item => Number(item.position || 0)).filter(value => value > 0);
  return positions.length ? Math.min(...positions) : 0;
}
function rankingCareerClubNames(seasons=[]){
  const names = seasons.map(item => String(item.clubName || item.club || clubName(item.clubId) || '').trim()).filter(Boolean);
  const current = game?.selectedClubId ? clubName(game.selectedClubId) : '';
  if(current) names.push(current);
  return Array.from(new Set(names));
}
function calculateCareerManagerScore(payload){
  const points = Number(payload.points || 0);
  const gd = Number(payload.goalDifference || 0);
  const titles = Number(payload.titles || 0);
  const prestige = Number(payload.managerPrestige || 0);
  const seasons = Number(payload.seasonsPlayed || 0);
  const played = Math.max(1, Number(payload.careerMatches || payload.played || 0));
  const winRate = clamp(Math.round((Number(payload.won || 0) / played) * 100), 0, 100);
  const budgetVariation = Number(payload.budgetVariation || 0);
  const negativePenalty = Number(payload.finalBudget || 0) < 0 ? -80 : 0;
  return Math.round(
    points +
    gd +
    (titles * 160) +
    (prestige * 8) +
    (winRate * 2) +
    (seasons * 25) +
    rankingBudgetScore(budgetVariation) +
    negativePenalty
  );
}
function rankingCareerRecord(){
  if(!game) return null;
  game.managerStats = normalizeManagerStats(game.managerStats || createInitialManagerStats());
  const stats = game.managerStats;
  const totals = stats.totals || {};
  const seasons = rankingCareerSeasons();
  const clubs = rankingCareerClubNames(seasons);
  const division = clubDivision(game.selectedClubId);
  const bestPosition = rankingBestCareerPosition(seasons);
  const bestDivisionOrder = seasons.reduce((best, item) => Math.min(best, Number(item.divisionOrder || clubDivision(item.clubId).order || 99)), Number(division.order || 1));
  const careerPoints = Number(totals.won || 0) * 3 + Number(totals.drawn || 0);
  return {
    season: Number(game.seasonNumber || 1),
    seasonsPlayed: Math.max(seasons.length, Number(game.seasonNumber || 1)),
    clubId: Number(game.selectedClubId || 0),
    clubName: clubName(game.selectedClubId),
    clubCount: clubs.length,
    clubsManaged: clubs,
    divisionId: division.id,
    divisionName: division.name,
    divisionOrder: Number(division.order || 1),
    bestDivisionOrder,
    position: bestPosition,
    pts: careerPoints,
    pg: Number(totals.won || 0),
    pe: Number(totals.drawn || 0),
    pp: Number(totals.lost || 0),
    gf: Number(totals.gf || 0),
    gc: Number(totals.gc || 0),
    played: Number(totals.played || 0),
    title: Number(stats.titles || 0) > 0,
    titles: Number(stats.titles || 0),
    experience: Number(stats.experience || 0),
    managerPrestige: typeof managerPrestigeBreakdown === 'function' ? Number(managerPrestigeBreakdown(stats).total || 0) : Number(stats.prestige || 0),
    seasons
  };
}
function rankingCurrentSeasonRecord(){
  if(!game) return null;
  const transitionRecord = game.seasonTransition?.userRecord;
  if(transitionRecord) return { ...transitionRecord };
  const division = clubDivision(game.selectedClubId);
  const table = sortedStandings(division.id);
  const index = table.findIndex(row => Number(row.clubId) === Number(game.selectedClubId));
  const row = table[index] || game.standings?.[game.selectedClubId] || {};
  const position = index >= 0 ? index + 1 : null;
  return {
    season: game.seasonNumber || 1,
    clubId: game.selectedClubId,
    clubName: clubName(game.selectedClubId),
    divisionId: division.id,
    divisionName: division.name,
    position,
    pts: Number(row.pts || 0),
    pg: Number(row.pg || 0),
    pe: Number(row.pe || 0),
    pp: Number(row.pp || 0),
    gf: Number(row.gf || 0),
    gc: Number(row.gc || 0),
    title: position === 1
  };
}
function rankingDivisionBonus(record){
  const division = (seed?.divisions || []).find(d => d.id === record?.divisionId || d.name === record?.divisionName || d.name === record?.division);
  const order = Number(division?.order || clubDivision(record?.clubId).order || 1);
  if(order <= 1) return 80;
  if(order === 2) return 35;
  return 10;
}
function rankingPositionBonus(position){
  const pos = Number(position || 0);
  if(!pos) return 0;
  if(pos === 1) return 90;
  if(pos === 2) return 65;
  if(pos === 3) return 45;
  if(pos <= 6) return 25;
  if(pos <= 10) return 10;
  return 0;
}
function rankingBudgetScore(variation){
  const value = Number(variation || 0);
  return clamp(Math.round(value / 1000000), -50, 80);
}
function calculateManagerScore(payload){
  const pts = Number(payload.points || payload.pts || 0);
  const dg = Number(payload.goalDifference || payload.dg || 0);
  const titles = Number(payload.title ? 1 : 0);
  const budgetVariation = Number(payload.budgetVariation || 0);
  const negativePenalty = Number(payload.finalBudget || 0) < 0 ? -50 : 0;
  return Math.round(
    pts +
    rankingDivisionBonus(payload) +
    rankingPositionBonus(payload.position) +
    (titles * 80) +
    (dg * 2) +
    rankingBudgetScore(budgetVariation) +
    negativePenalty
  );
}
function rankingCleanManagerName(value=''){
  const clean = String(value || rankingStoredManagerName() || rankingStoredAuthUsername() || storedManagerName() || game?.rankingManagerName || '').trim().slice(0, 40);
  return clean || 'Manager';
}
function buildRankingPayload(managerName, options={}){
  if(!game) return null;
  const cleanManagerName = rankingCleanManagerName(managerName);
  options = options && typeof options === 'object' ? options : {};
  const scope = String(options.scope || 'career');
  const eventType = String(options.eventType || (scope === 'career' ? 'career_snapshot' : 'season_snapshot'));
  const record = scope === 'season' ? rankingCurrentSeasonRecord() : rankingCareerRecord();
  if(!record) return null;
  const initialBudget = scope === 'career' ? rankingCareerInitialBudget(record.seasons || []) : rankingSeasonInitialBudget(record.season);
  const finalBudget = Math.round(Number(game.budget || 0));
  const payload = {
    recordScope:scope,
    managerName: cleanManagerName,
    manager_name: cleanManagerName,
    nombre_manager: cleanManagerName,
    clubId: Number(record.clubId || game.selectedClubId),
    club: scope === 'career' ? (record.clubName || clubName(game.selectedClubId)) : (record.clubName || clubName(game.selectedClubId)),
    currentClub: record.clubName || clubName(game.selectedClubId),
    clubsManaged:Array.isArray(record.clubsManaged) ? record.clubsManaged : [],
    clubCount:Number(record.clubCount || 1),
    season: Number(record.season || game.seasonNumber || 1),
    seasonsPlayed:Number(record.seasonsPlayed || record.season || game.seasonNumber || 1),
    careerMatches:Number(record.played || 0),
    divisionId: record.divisionId || clubDivision(game.selectedClubId).id,
    division: record.divisionName || clubDivision(game.selectedClubId).name,
    divisionOrder: Number(record.divisionOrder || clubDivision(record.clubId || game.selectedClubId).order || 1),
    bestDivisionOrder:Number(record.bestDivisionOrder || record.divisionOrder || 1),
    position: Number(record.position || 0),
    points: Number(record.pts || 0),
    won: Number(record.pg || 0),
    drawn: Number(record.pe || 0),
    lost: Number(record.pp || 0),
    goalsFor: Number(record.gf || 0),
    goalsAgainst: Number(record.gc || 0),
    goalDifference: Number(record.gf || 0) - Number(record.gc || 0),
    initialBudget,
    finalBudget,
    budgetVariation: finalBudget - initialBudget,
    titles: Number(record.titles ?? game.managerStats?.titles ?? 0),
    title: Boolean(record.title),
    managerPrestige:Number(record.managerPrestige ?? game.managerStats?.prestige ?? 0),
    managerExperience:Number(record.experience ?? game.managerStats?.experience ?? 0),
    submittedAt: new Date().toISOString(),
    gameDate: rankingCurrentGameDate(),
    seasonDay: seasonDayFromDate(rankingCurrentGameDate(), game.seasonYear || seasonYearForNumber(game.seasonNumber || 1)),
    saveCode: game.saveCode || generateSaveCode(),
    version: APP_VERSION,
    eventType,
    eventLabel: options.eventLabel || rankingEventLabel(eventType)
  };
  payload.managerScore = scope === 'career' ? calculateCareerManagerScore(payload) : calculateManagerScore(payload);
  payload.submissionKey = rankingSubmissionKey(payload, eventType);
  return payload;
}

function rankingValue(row, ...keys){
  for(const key of keys){
    if(row && row[key] !== undefined && row[key] !== null && row[key] !== '') return row[key];
  }
  return '';
}

function rankingApiRowToGameRow(row){
  if(!row) return row;
  const mapped = { ...row };
  mapped.managerName = rankingValue(row, 'managerName', 'manager_name', 'manager');
  mapped.club = rankingValue(row, 'club', 'club_name', 'club_usado', 'current_club');
  mapped.division = rankingValue(row, 'division', 'division_name', 'league_name');
  mapped.season = rankingValue(row, 'season', 'temporada', 'season_number');
  mapped.points = rankingValue(row, 'matchPoints', 'match_points', 'pts', 'puntos', 'points', 'career_points');
  mapped.managerScore = rankingValue(row, 'managerScore', 'manager_score', 'puntaje_manager', 'points');
  mapped.initialBudget = rankingValue(row, 'initialBudget', 'initial_budget', 'budget_initial', 'presupuesto_inicial');
  mapped.finalBudget = rankingValue(row, 'finalBudget', 'final_budget', 'budget_final', 'presupuesto_final');
  mapped.budgetVariation = rankingValue(row, 'budgetVariation', 'budget_variation', 'variacion_presupuesto');
  mapped.titles = rankingValue(row, 'titles', 'titulos');
  mapped.submittedAt = rankingValue(row, 'submittedAt', 'submitted_at', 'created_at', 'fecha_envio');
  mapped.saveCode = rankingValue(row, 'saveCode', 'save_code', 'save_hash', 'codigo_partida');
  mapped.version = rankingValue(row, 'version', 'game_version');
  mapped.eventType = rankingValue(row, 'eventType', 'event_type', 'evento_tipo');
  mapped.eventLabel = rankingValue(row, 'eventLabel', 'event_label', 'evento');
  mapped.won = rankingValue(row, 'won', 'wins', 'Partidos ganados', 'ganados');
  mapped.drawn = rankingValue(row, 'drawn', 'draws', 'Partidos empatados', 'empatados');
  mapped.lost = rankingValue(row, 'lost', 'losses', 'Partidos perdidos', 'perdidos');
  mapped.goalsFor = rankingValue(row, 'goalsFor', 'goals_for', 'Goles a favor', 'gf');
  mapped.goalsAgainst = rankingValue(row, 'goalsAgainst', 'goals_against', 'Goles en contra', 'gc');
  mapped.goalDifference = rankingValue(row, 'goalDifference', 'goal_difference', 'Diferencia de gol', 'dg');
  mapped.recordScope = rankingValue(row, 'recordScope', 'record_scope', 'tipo_registro');
  mapped.seasonsPlayed = rankingValue(row, 'seasonsPlayed', 'seasons_played', 'temporadas_jugadas', 'season_number');
  mapped.careerMatches = rankingValue(row, 'careerMatches', 'career_matches', 'partidos_carrera', 'played');
  mapped.currentClub = rankingValue(row, 'currentClub', 'current_club', 'club_actual', 'club_name');
  mapped.clubCount = rankingValue(row, 'clubCount', 'club_count', 'clubes_dirigidos');
  mapped.managerPrestige = rankingValue(row, 'managerPrestige', 'manager_prestige', 'prestigio_manager');
  mapped.managerExperience = rankingValue(row, 'managerExperience', 'manager_experience', 'experiencia_manager');
  return mapped;
}

function rankingPlainObject(value){
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}
function rankingJsonSafeValue(value){
  if(value === undefined || value === null) return '';
  if(typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if(typeof value === 'boolean') return value;
  if(Array.isArray(value)) return value.map(rankingJsonSafeValue);
  if(typeof value === 'object'){
    const out = {};
    Object.entries(value).forEach(([key, val]) => { out[key] = rankingJsonSafeValue(val); });
    return out;
  }
  return String(value);
}
function rankingJsonSafeObject(obj){
  const out = {};
  Object.entries(rankingPlainObject(obj)).forEach(([key, value]) => { out[key] = rankingJsonSafeValue(value); });
  return out;
}
function rankingPathPrefersJson(path){
  const route = String(path || '').toLowerCase();
  return route.includes('career') || route.includes('ranking') || route.includes('records') || route.includes('scores') || route.includes('submit');
}
function rankingRequestVariantsForPath(path, apiBody, fullPayload){
  const token = String(RANKING_TOKEN || '').trim();
  const cleanApiBody = rankingJsonSafeObject(apiBody);
  const cleanFullPayload = rankingJsonSafeObject(fullPayload);
  const jsonHeaders = rankingRequestHeaders(true);
  const formHeaders = { ...rankingRequestHeaders(false), 'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8' };
  const jsonVariants = [
    { label:'json-flat', headers:jsonHeaders, body:JSON.stringify(cleanApiBody) },
    { label:'json-action-flat', headers:jsonHeaders, body:JSON.stringify({ action:'submit', ...cleanApiBody }) },
    // Algunos Workers validan campos de nivel superior aunque también acepten payload anidado.
    { label:'json-payload-object', headers:jsonHeaders, body:JSON.stringify({ action:'submit', ...cleanApiBody, payload:cleanFullPayload, token }) }
  ];
  const formVariants = [
    { label:'form-payload', headers:formHeaders, body:new URLSearchParams({ action:'submit', payload:JSON.stringify(cleanFullPayload), token }).toString() },
    { label:'form-flat', headers:formHeaders, body:new URLSearchParams(Object.entries({ action:'submit', ...cleanApiBody, token }).reduce((acc, [key, value]) => { acc[key] = value === undefined || value === null ? '' : String(value); return acc; }, {})).toString() }
  ];
  return rankingPathPrefersJson(path) ? jsonVariants : jsonVariants.concat(formVariants);
}
function rankingPayloadToApiBody(payload){
  const cleanManagerName = rankingCleanManagerName(payload?.managerName || payload?.manager_name || payload?.nombre_manager);
  const body = {
    // Nombres del Worker Cloudflare + D1.
    record_scope: payload.recordScope || 'career',
    manager_name: cleanManagerName,
    managerName: cleanManagerName,
    nombre_manager: cleanManagerName,
    manager: cleanManagerName,
    name: cleanManagerName,
    username: cleanManagerName,
    club_name: payload.club,
    current_club: payload.currentClub || payload.club || '',
    clubs_managed: Array.isArray(payload.clubsManaged) ? payload.clubsManaged.join(' | ') : String(payload.clubsManaged || ''),
    club_count: Number(payload.clubCount || 1),
    country: payload.country || '',
    league_name: payload.division,
    season_number: payload.season,
    seasons_played: payload.seasonsPlayed || payload.season || 1,
    career_matches: payload.careerMatches || payload.played || 0,
    final_position: payload.position,
    best_position: payload.position || 0,
    points: payload.points,
    wins: payload.won,
    draws: payload.drawn,
    losses: payload.lost,
    goals_for: payload.goalsFor,
    goals_against: payload.goalsAgainst,
    goal_difference: payload.goalDifference,
    budget_initial: payload.initialBudget,
    budget_final: payload.finalBudget,
    manager_prestige: Number(payload.managerPrestige ?? game?.managerPrestige ?? game?.managerStats?.prestige ?? 0),
    manager_experience: Number(payload.managerExperience ?? game?.managerStats?.experience ?? 0),
    game_version: payload.version || APP_VERSION,
    save_hash: payload.saveCode || '',

    // Aliases usados por versiones previas del front/juego.
    club_id: payload.clubId,
    recordScope: payload.recordScope || 'career',
    season: payload.season,
    seasonsPlayed: payload.seasonsPlayed || payload.season || 1,
    careerMatches: payload.careerMatches || payload.played || 0,
    currentClub: payload.currentClub || payload.club || '',
    clubCount: payload.clubCount || 1,
    clubsManaged: Array.isArray(payload.clubsManaged) ? payload.clubsManaged.join(' | ') : String(payload.clubsManaged || ''),
    division: payload.division,
    division_id: payload.divisionId,
    division_order: payload.divisionOrder,
    position: payload.position,
    match_points: payload.points,
    won: payload.won,
    drawn: payload.drawn,
    lost: payload.lost,
    initial_budget: payload.initialBudget,
    final_budget: payload.finalBudget,
    budget_variation: payload.budgetVariation,
    titles: payload.titles,
    title: payload.title ? 1 : 0,
    manager_score: payload.managerScore,
    managerScore: payload.managerScore,
    puntaje_manager: payload.managerScore,
    submitted_at: payload.submittedAt || new Date().toISOString(),
    event_type: payload.eventType || 'career_snapshot',
    event_label: payload.eventLabel || rankingEventLabel(payload.eventType),
    game_date: payload.gameDate || '',
    season_day: payload.seasonDay || 0,
    submission_key: payload.submissionKey || '',
    save_code: payload.saveCode || '',
    codigo_partida: payload.saveCode || '',
    saveHash: payload.saveCode || '',
    version: payload.version || APP_VERSION
  };
  if(String(RANKING_TOKEN || '').trim()) body.token = String(RANKING_TOKEN).trim();
  return body;
}
function normalizeRankingRow(row){
  row = rankingApiRowToGameRow(row);
  const normalized = {
    managerName: String(rankingValue(row, 'managerName', 'Nombre del manager', 'nombre_manager', 'manager') || '').trim(),
    club: String(rankingValue(row, 'club', 'Club usado', 'club_usado') || '').trim(),
    season: Number(rankingValue(row, 'season', 'Temporada', 'temporada') || 0),
    division: String(rankingValue(row, 'division', 'División', 'division') || '').trim(),
    position: Number(rankingValue(row, 'position', 'Posición final', 'posicion_final') || 0),
    points: Number(rankingValue(row, 'points', 'Puntos', 'puntos') || 0),
    won: Number(rankingValue(row, 'won', 'Partidos ganados', 'ganados') || 0),
    drawn: Number(rankingValue(row, 'drawn', 'Partidos empatados', 'empatados') || 0),
    lost: Number(rankingValue(row, 'lost', 'Partidos perdidos', 'perdidos') || 0),
    goalsFor: Number(rankingValue(row, 'goalsFor', 'Goles a favor', 'gf', 'goals_for') || 0),
    goalsAgainst: Number(rankingValue(row, 'goalsAgainst', 'Goles en contra', 'gc', 'goals_against') || 0),
    goalDifference: Number(rankingValue(row, 'goalDifference', 'Diferencia de gol', 'dg', 'goal_difference') || 0),
    initialBudget: Number(rankingValue(row, 'initialBudget', 'Presupuesto inicial', 'presupuesto_inicial') || 0),
    finalBudget: Number(rankingValue(row, 'finalBudget', 'Presupuesto final', 'presupuesto_final') || 0),
    budgetVariation: Number(rankingValue(row, 'budgetVariation', 'Variación de presupuesto', 'variacion_presupuesto') || 0),
    titles: Number(rankingValue(row, 'titles', 'Cantidad de títulos', 'titulos') || 0),
    submittedAt: String(rankingValue(row, 'submittedAt', 'Fecha de envío', 'fecha_envio') || '').trim(),
    saveCode: String(rankingValue(row, 'saveCode', 'Código de partida', 'codigo_partida') || '').trim(),
    managerScore: Number(rankingValue(row, 'managerScore', 'Puntaje manager', 'puntaje_manager') || 0),
    eventType: String(rankingValue(row, 'eventType', 'evento_tipo') || '').trim(),
    eventLabel: String(rankingValue(row, 'eventLabel', 'evento') || '').trim(),
    recordScope: String(rankingValue(row, 'recordScope', 'tipo_registro') || 'career').trim(),
    seasonsPlayed: Number(rankingValue(row, 'seasonsPlayed', 'temporadas_jugadas') || rankingValue(row, 'season', 'Temporada', 'temporada') || 0),
    careerMatches: Number(rankingValue(row, 'careerMatches', 'partidos_carrera') || rankingValue(row, 'played', 'partidos_jugados') || 0),
    currentClub: String(rankingValue(row, 'currentClub', 'club_actual') || '').trim(),
    clubCount: Number(rankingValue(row, 'clubCount', 'clubes_dirigidos') || 0),
    managerPrestige: Number(rankingValue(row, 'managerPrestige', 'prestigio_manager') || 0),
    managerExperience: Number(rankingValue(row, 'managerExperience', 'experiencia_manager') || 0)
  };
  if(!normalized.budgetVariation && normalized.finalBudget && normalized.initialBudget) normalized.budgetVariation = normalized.finalBudget - normalized.initialBudget;
  if(!normalized.managerScore) normalized.managerScore = normalized.recordScope === 'career' ? calculateCareerManagerScore(normalized) : calculateManagerScore(normalized);
  if(!normalized.eventLabel) normalized.eventLabel = rankingEventLabel(normalized.eventType || 'career_snapshot');
  return normalized;
}
function rankingDedupeKey(row){
  const saveCode = String(row?.saveCode || '').trim();
  if(saveCode) return `save:${saveCode}`;
  const manager = String(row?.managerName || '').trim().toLowerCase();
  return `manager:${manager || 'manager'}:${String(row?.currentClub || row?.club || '').trim().toLowerCase()}`;
}
function dedupeRankingRows(rows=[]){
  const map = new Map();
  (rows || []).forEach(row => {
    const key = rankingDedupeKey(row);
    const current = map.get(key);
    if(!current){ map.set(key, row); return; }
    const rowScore = Number(row.managerScore || 0);
    const currentScore = Number(current.managerScore || 0);
    const rowDate = Date.parse(row.submittedAt || '') || 0;
    const currentDate = Date.parse(current.submittedAt || '') || 0;
    if(rowScore > currentScore || (rowScore === currentScore && rowDate >= currentDate)) map.set(key, row);
  });
  return Array.from(map.values());
}
function sortRankingRows(rows, sortKey=rankingSort){
  const [key, dir='desc'] = String(sortKey || '').split('_');
  const direction = dir === 'asc' ? 1 : -1;
  const getter = {
    managerScore: row => Number(row.managerScore || 0),
    division: row => String(row.division || ''),
    club: row => String(row.club || ''),
    points: row => Number(row.points || 0),
    finalBudget: row => Number(row.finalBudget || 0),
    seasonsPlayed: row => Number(row.seasonsPlayed || row.season || 0),
    careerMatches: row => Number(row.careerMatches || 0)
  }[key] || (row => Number(row.managerScore || 0));
  return rows.slice().sort((a,b)=>{
    const av = getter(a);
    const bv = getter(b);
    if(typeof av === 'string' || typeof bv === 'string'){
      const cmp = String(av).localeCompare(String(bv), 'es', { sensitivity:'base' });
      return cmp * direction || Number(b.managerScore || 0) - Number(a.managerScore || 0);
    }
    return ((av > bv ? 1 : av < bv ? -1 : 0) * direction) || Number(b.managerScore || 0) - Number(a.managerScore || 0);
  });
}
function rankingSortButton(key, label){
  const isActive = String(rankingSort || '').startsWith(`${key}_`);
  const currentDir = isActive ? String(rankingSort).split('_')[1] : 'desc';
  const nextDir = isActive && currentDir === 'desc' ? 'asc' : 'desc';
  const arrow = isActive ? (currentDir === 'asc' ? '↑' : '↓') : '';
  return `<button class="ranking-sort ${isActive ? 'active' : ''}" data-ranking-sort="${escapeHtml(key)}_${nextDir}" type="button">${escapeHtml(label)} ${arrow}</button>`;
}
function rankingRowMarkup(row, index){
  const budgetCls = Number(row.budgetVariation || 0) >= 0 ? 'ok' : 'bad';
  const seasons = Number(row.seasonsPlayed || row.season || 0);
  const matches = Number(row.careerMatches || (Number(row.won || 0) + Number(row.drawn || 0) + Number(row.lost || 0)) || 0);
  return `<tr>
    <td><strong>${index + 1}</strong></td>
    <td><strong>${escapeHtml(row.managerName || 'Manager')}</strong><br><span class="muted small">${escapeHtml(row.saveCode || '')}</span></td>
    <td>${escapeHtml(row.currentClub || row.club || '—')}</td>
    <td>${escapeHtml(row.division || '—')}</td>
    <td>${seasons || '—'}</td>
    <td>${matches || '—'}</td>
    <td>${row.position ? `${row.position}°` : '—'}</td>
    <td><strong>${Number(row.managerScore || 0)}</strong></td>
    <td>${Number(row.points || 0)}</td>
    <td>${Number(row.won || 0)}-${Number(row.drawn || 0)}-${Number(row.lost || 0)}</td>
    <td>${Number(row.goalDifference || 0) > 0 ? '+' : ''}${Number(row.goalDifference || 0)}</td>
    <td>${Number(row.titles || 0)}</td>
    <td>${formatMoney(Number(row.finalBudget || 0))}<br><span class="${budgetCls} small">${Number(row.budgetVariation || 0) >= 0 ? '+' : ''}${formatMoney(Number(row.budgetVariation || 0))}</span></td>
  </tr>`;
}
function rankingRowsTable(rows){
  const sorted = sortRankingRows(rows).slice(0, RANKING_PAGE_SIZE);
  return `<div class="ranking-sortbar">
    ${rankingSortButton('managerScore','Puntaje')}
    ${rankingSortButton('division','División')}
    ${rankingSortButton('club','Club')}
    ${rankingSortButton('points','Puntos')}
    ${rankingSortButton('finalBudget','Presupuesto final')}
    ${rankingSortButton('seasonsPlayed','Temporadas')}
    ${rankingSortButton('careerMatches','Partidos')}
  </div>
  <div class="table-wrap ranking-table-wrap"><table class="ranking-table"><thead><tr><th>#</th><th>Manager</th><th>Club actual</th><th>División</th><th>Temps.</th><th>Partidos</th><th>Mejor pos.</th><th>Puntaje</th><th>Pts</th><th>G-E-P</th><th>DG</th><th>Títulos</th><th>Presupuesto final</th></tr></thead><tbody>${sorted.length ? sorted.map(rankingRowMarkup).join('') : '<tr><td colspan="13" class="muted">Todavía no hay carreras cargadas.</td></tr>'}</tbody></table></div>`;
}
function rankingSeasonPreviewMarkup(payload){
  if(!payload) return '<p class="muted">No hay partida activa para calcular una temporada.</p>';
  return `<div class="ranking-preview-grid">
    <div><span>Manager</span><strong>${escapeHtml(payload.managerName || 'Manager')}</strong></div>
    <div><span>Evento previsto</span><strong>${escapeHtml(payload.eventLabel || rankingEventLabel(payload.eventType))}</strong></div>
    <div><span>Club actual</span><strong>${escapeHtml(payload.currentClub || payload.club)}</strong></div>
    <div><span>Temporadas</span><strong>${Number(payload.seasonsPlayed || payload.season || 0)}</strong></div>
    <div><span>Partidos de carrera</span><strong>${Number(payload.careerMatches || 0)}</strong></div>
    <div><span>Mejor posición</span><strong>${payload.position ? `${payload.position}°` : '—'}</strong></div>
    <div><span>Puntos carrera</span><strong>${payload.points}</strong></div>
    <div><span>Presupuesto inicial</span><strong>${formatMoney(payload.initialBudget)}</strong></div>
    <div><span>Presupuesto final</span><strong>${formatMoney(payload.finalBudget)}</strong></div>
    <div><span>Variación</span><strong class="${payload.budgetVariation >= 0 ? 'ok' : 'bad'}">${payload.budgetVariation >= 0 ? '+' : ''}${formatMoney(payload.budgetVariation)}</strong></div>
    <div><span>Puntaje manager</span><strong>${payload.managerScore}</strong></div>
  </div>`;
}
function rankingUploadEntries(){
  const uploads = game?.rankingUploads && typeof game.rankingUploads === 'object' && !Array.isArray(game.rankingUploads) ? game.rankingUploads : {};
  return Object.entries(uploads).map(([key, value]) => ({ key, ...(value || {}) })).sort((a,b)=> String(b.submittedAt || b.attemptedAt || '').localeCompare(String(a.submittedAt || a.attemptedAt || '')));
}
function rankingAutomaticStatusMarkup(){
  if(!game) return '<p class="small muted">No hay partida activa.</p>';
  const entries = rankingUploadEntries().filter(entry => ['season_end','dismissal'].includes(String(entry.eventType || '')));
  if(!entries.length) return '<p class="small muted">Todavía no hay envíos automáticos registrados en esta partida.</p>';
  const latest = entries[0];
  const statusText = latest.status === 'success' ? 'Enviado' : latest.status === 'pending' ? 'Pendiente' : latest.status === 'error' ? 'Error' : 'Registrado';
  const statusClass = latest.status === 'success' ? 'ok' : latest.status === 'error' ? 'bad' : 'warn';
  return `<div class="ranking-auto-status">
    <p class="small muted">Último evento automático</p>
    <p><strong>${escapeHtml(latest.eventLabel || rankingEventLabel(latest.eventType))}</strong> · <span class="${statusClass}">${escapeHtml(statusText)}</span></p>
    <p class="small muted">${escapeHtml(latest.club || '')}${latest.season ? ` · Temporada ${Number(latest.season)}` : ''}${latest.error ? ` · ${escapeHtml(latest.error)}` : ''}</p>
  </div>`;
}
function rankingSubmitPanelMarkup(payload, endpoint){
  const info = rankingUploadCooldownInfo();
  const hasSession = Boolean(rankingStoredAuthToken());
  const loginOk = !RANKING_REQUIRES_LOGIN || hasSession;
  const canUpload = Boolean(endpoint && game && payload && info.canUpload && loginOk);
  const buttonLabel = !loginOk ? 'Iniciar sesión para subir' : canUpload ? 'Subir carrera' : rankingCooldownText(info);
  const manualStatus = info.last
    ? `Última carga manual: día ${seasonDayFromDate(info.last, game?.seasonYear || seasonYearForNumber(game?.seasonNumber || 1))} (${info.last}).`
    : 'Todavía no hiciste una carga manual en esta partida.';
  return `<div class="card ranking-submit-card">
    <div class="row"><div><p class="label">Carga manual y automática</p><h3>Carrera del mánager</h3></div><span class="pill">${game ? `Temp. ${game.seasonNumber || 1}` : 'Sin partida'}</span></div>
    <p class="muted">Podés subir manualmente la carrera completa del mánager cada ${Number(info.cooldown || RANKING_UPLOAD_COOLDOWN_DAYS || 50)} días de juego. Al finalizar la temporada o ante un despido, el juego actualiza la misma carrera sin duplicar registros.</p>
    <div class="ranking-manual-actions">
      <button id="submitRankingManual" class="primary" type="button" ${canUpload ? '' : 'disabled'}>${escapeHtml(buttonLabel)}</button>
      <span id="rankingManualStatus" class="small muted">${!loginOk ? 'Tenés que iniciar sesión para subir récords.' : endpoint ? escapeHtml(manualStatus) : 'Ranking online no disponible por el momento.'}</span>
    </div>
    ${rankingAutomaticStatusMarkup()}
    ${rankingSeasonPreviewMarkup(payload)}
  </div>`;
}
function renderRankingOnline(){
  const endpoint = normalizeRankingEndpoint(rankingStoredEndpoint());
  const managerName = rankingCleanManagerName();
  const manualEventType = rankingManualEventType();
  const manualDay = Number(seasonDayFromDate(rankingCurrentGameDate(), game?.seasonYear || seasonYearForNumber(game?.seasonNumber || 1)) || 0);
  const payload = buildRankingPayload(managerName, { eventType:manualEventType, eventLabel:`Carrera actualizada manualmente · día ${manualDay || '—'}` });
  view.innerHTML = `<div class="section-title"><h2>${escapeHtml(RANKING_NAME)}</h2><p class="tagline">Tabla comunitaria online de carreras de mánager. Se muestra una sola fila por partida/manager, ordenada sin duplicados.</p></div>
    ${rankingLoginPanelMarkup(endpoint)}
    ${rankingSubmitPanelMarkup(payload, endpoint)}
    <div class="card ranking-list-card">
      <div class="row"><div><p class="label">Lectura pública</p><h3>Ranking de carreras</h3></div><button id="refreshRanking" class="ghost" type="button">Actualizar ranking</button></div>
      <div id="rankingStatus" class="small muted">${endpoint ? `Listo para cargar hasta ${RANKING_PAGE_SIZE} registros.` : 'Ranking online no disponible por el momento.'}</div>
      <div id="rankingTableBox">${rankingRowsTable(rankingRowsCache)}</div>
    </div>`;
  $('refreshRanking')?.addEventListener('click', loadRankingOnline);
  $('submitRankingManual')?.addEventListener('click', submitCurrentSeasonToRanking);
  $('rankingLoginForm')?.addEventListener('submit', loginRankingAccount);
  $('rankingCheckSession')?.addEventListener('click', checkRankingSession);
  $('rankingLogout')?.addEventListener('click', logoutRankingAccount);
  document.querySelectorAll('[data-ranking-sort]').forEach(btn => btn.addEventListener('click', () => {
    rankingSort = btn.dataset.rankingSort;
    renderRankingOnline();
  }));
  if(endpoint && !rankingRowsCache.length && !rankingLoading){
    setTimeout(() => loadRankingOnline(true), 0);
  }
}
function validateRankingSubmit(payload, managerName, endpoint, options={}){
  if(!game) return 'No hay partida activa.';
  if(!endpoint) return 'Ranking online no disponible por el momento.';
  if(RANKING_REQUIRES_LOGIN && !rankingStoredAuthToken()) return 'Tenés que iniciar sesión para subir récords.';
  if(!managerName) return 'Ingresá un nombre de manager.';
  if(String(payload?.recordScope || '') !== 'career' && !payload?.position) return 'No se pudo calcular la posición actual.';
  if(String(payload?.recordScope || '') === 'career' && !Number(payload?.careerMatches || 0)) return 'La carrera todavía no tiene partidos oficiales para subir.';
  const previous = game.rankingUploads?.[payload.submissionKey];
  if(previous?.status === 'pending' && !options.forceRetry){
    const attemptedAt = Date.parse(previous.attemptedAt || 0);
    if(Number.isFinite(attemptedAt) && Date.now() - attemptedAt < 15000) return 'Este evento ya está pendiente de envío.';
  }
  if(options?.automatic){
    if(previous?.status === 'success' && !options.forceRetry) return 'Este evento ya fue enviado al ranking.';
    return '';
  }
  const info = rankingUploadCooldownInfo();
  if(!info.canUpload) return rankingCooldownText(info);
  return '';
}
function submitCurrentSeasonToRanking(){
  const endpoint = normalizeRankingEndpoint(rankingStoredEndpoint());
  const managerName = rankingCleanManagerName();
  const manualDay = Number(seasonDayFromDate(rankingCurrentGameDate(), game?.seasonYear || seasonYearForNumber(game?.seasonNumber || 1)) || 0);
  const payload = buildRankingPayload(managerName, { eventType:rankingManualEventType(), eventLabel:`Carrera actualizada manualmente · día ${manualDay || '—'}` });
  const error = validateRankingSubmit(payload, managerName, endpoint, { manual:true });
  if(error){ showNotice(error); return false; }
  const status = $('rankingManualStatus');
  const button = $('submitRankingManual');
  if(status) status.textContent = 'Enviando carrera del mánager...';
  if(button) button.disabled = true;
  rankingRecordUploadState(payload, 'pending', { attemptedAt:new Date().toISOString() });
  saveLocal(true);
  submitRankingToCloudflare(endpoint, payload, {
    onSuccess: () => {
      rankingRecordUploadState(payload, 'success', { submittedAt:new Date().toISOString() });
      game.rankingLastManualUploadGameDate = payload.gameDate || rankingCurrentGameDate();
      game.rankingLastUploadGameDate = payload.gameDate || rankingCurrentGameDate();
      rankingRowsCache = dedupeRankingRows([normalizeRankingRow(payload)].concat(rankingRowsCache));
      saveLocal(true);
      showNotice('Carrera del mánager enviada al ranking online.');
      if(activeTab === 'ranking') renderRankingOnline();
      loadRankingOnline(true);
    },
    onError: (message) => {
      rankingRecordUploadState(payload, 'error', { error:message || 'Error al conectar con el ranking online.' });
      saveLocal(true);
      if(status) status.textContent = message || 'No se pudo enviar la carga manual.';
      if(button) button.disabled = false;
      showNotice(message || 'No se pudo enviar la carga manual.');
    }
  });
  return true;
}
function rankingRecordUploadState(payload, status, extra={}){
  if(!game || !payload?.submissionKey) return;
  game.rankingUploads = game.rankingUploads && typeof game.rankingUploads === 'object' && !Array.isArray(game.rankingUploads) ? game.rankingUploads : {};
  const previous = game.rankingUploads[payload.submissionKey] || {};
  game.rankingUploads[payload.submissionKey] = {
    ...previous,
    status,
    eventType:payload.eventType || previous.eventType || 'season_snapshot',
    eventLabel:payload.eventLabel || previous.eventLabel || rankingEventLabel(payload.eventType),
    managerName:payload.managerName || previous.managerName || 'Manager',
    club:payload.club || previous.club || '',
    season:Number(payload.season || previous.season || 1),
    managerScore:Number(payload.managerScore || previous.managerScore || 0),
    gameDate:payload.gameDate || previous.gameDate || '',
    attemptedAt:extra.attemptedAt || previous.attemptedAt || new Date().toISOString(),
    submittedAt: status === 'success' ? (extra.submittedAt || payload.submittedAt || new Date().toISOString()) : (previous.submittedAt || ''),
    error: status === 'error' ? String(extra.error || '') : '',
    payload:{ ...payload }
  };
}
function submitRankingAutomatically(eventType='season_end', options={}){
  const endpoint = normalizeRankingEndpoint(rankingStoredEndpoint());
  const managerName = rankingCleanManagerName();
  const payload = buildRankingPayload(managerName, { ...options, eventType });
  const error = validateRankingSubmit(payload, managerName, endpoint, { automatic:true });
  if(error){
    if(!/ya fue enviado|pendiente/.test(error) && options.notifyErrors) showNotice(error);
    return false;
  }
  rankingRecordUploadState(payload, 'pending', { attemptedAt:new Date().toISOString() });
  saveLocal(true);
  submitRankingToCloudflare(endpoint, payload, {
    onSuccess: () => {
      rankingRecordUploadState(payload, 'success', { submittedAt:new Date().toISOString() });
      game.rankingLastAutomaticUploadGameDate = payload.gameDate || rankingCurrentGameDate();
      game.rankingLastUploadGameDate = payload.gameDate || rankingCurrentGameDate();
      rankingRowsCache = dedupeRankingRows([normalizeRankingRow(payload)].concat(rankingRowsCache));
      if(typeof pushGameMessage === 'function'){
        pushGameMessage({ type:'sistema', priority:'normal', title:'Ranking actualizado', body:`${payload.eventLabel} enviado automáticamente al ranking online.`, id:`ranking-auto-ok-${payload.submissionKey}` });
      }
      saveLocal(true);
      if(activeTab === 'ranking') renderRankingOnline();
    },
    onError: (message) => {
      rankingRecordUploadState(payload, 'error', { error:message || 'Error al conectar con el ranking online.' });
      if(typeof pushGameMessage === 'function'){
        pushGameMessage({ type:'sistema', priority:'normal', title:'Ranking no enviado', body:`No se pudo enviar automáticamente el evento ${payload.eventLabel}: ${message || 'error de conexión'}.`, id:`ranking-auto-error-${payload.submissionKey}-${Date.now()}` });
      }
      saveLocal(true);
      if(activeTab === 'ranking') renderRankingOnline();
    }
  });
  return true;
}
async function submitRankingToCloudflare(endpoint, payload, handlers={}){
  const paths = rankingConfiguredPaths('submit');
  const apiBody = rankingJsonSafeObject(rankingPayloadToApiBody(payload));
  const fullPayload = rankingJsonSafeObject({ ...payload, ...apiBody });
  let lastMessage = '';
  const attemptedRoutes = new Set();
  for(let i = 0; i < paths.length; i++){
    const path = paths[i];
    attemptedRoutes.add(rankingRouteLabel(path));
    const requestBodies = rankingRequestVariantsForPath(path, apiBody, fullPayload);
    for(let j = 0; j < requestBodies.length; j++){
      const req = requestBodies[j];
      try{
        const response = await fetch(rankingApiUrl(endpoint, path), {
          method:'POST',
          headers:req.headers,
          body:req.body
        });
        const data = await response.json().catch(() => ({}));
        if(!response.ok || data.ok === false){
          const message = rankingResponseErrorMessage(data, response);
          lastMessage = message;
          if(rankingIsRouteMissing(message, response) && i < paths.length - 1) break;
          if(j < requestBodies.length - 1) continue;
          throw new Error(message);
        }
        handlers.onSuccess?.(data);
        return;
      }catch(error){
        lastMessage = error?.message || lastMessage || 'Error al conectar con el ranking online.';
        if(rankingIsRouteMissing(lastMessage) && i < paths.length - 1) break;
        if(j < requestBodies.length - 1) continue;
        const tried = Array.from(attemptedRoutes).join(', ');
        const message = rankingIsRouteMissing(lastMessage) && tried ? `${lastMessage} Rutas probadas: ${tried}.` : lastMessage;
        handlers.onError?.(message);
        return;
      }
    }
  }
  const tried = Array.from(attemptedRoutes).join(', ');
  const message = lastMessage || 'No se encontró una ruta válida para subir el ranking.';
  handlers.onError?.(rankingIsRouteMissing(message) && tried ? `${message} Rutas probadas: ${tried}.` : message);
}
async function loadRankingOnline(silent=false){
  const endpoint = normalizeRankingEndpoint(rankingStoredEndpoint());
  const status = $('rankingStatus');
  if(!endpoint){ if(status) status.textContent = 'Ranking online no disponible por el momento.'; return; }
  if(rankingLoading) return;
  rankingLoading = true;
  if(status) status.textContent = 'Cargando ranking online...';
  let lastMessage = '';
  try{
    const paths = rankingConfiguredPaths('read');
    for(let i = 0; i < paths.length; i++){
      const path = paths[i];
      const response = await fetch(rankingApiUrl(endpoint, path, `?limit=${encodeURIComponent(RANKING_PAGE_SIZE)}`), {
        method:'GET',
        headers:rankingRequestHeaders(false)
      });
      const data = await response.json().catch(() => ({}));
      if(!response.ok || data.ok === false){
        const message = rankingResponseErrorMessage(data, response);
        lastMessage = message;
        if(rankingIsRouteMissing(message, response) && i < paths.length - 1) continue;
        throw new Error(message);
      }
      const rows = Array.isArray(data.ranking) ? data.ranking
        : Array.isArray(data.rows) ? data.rows
        : Array.isArray(data.records) ? data.records
        : Array.isArray(data.data) ? data.data
        : Array.isArray(data.items) ? data.items
        : [];
      rankingRowsCache = dedupeRankingRows(rows.map(normalizeRankingRow).filter(row => row.managerName || row.club || row.saveCode));
      const box = $('rankingTableBox');
      if(box) box.innerHTML = rankingRowsTable(rankingRowsCache);
      if(status) status.textContent = `${rankingRowsCache.length} registro(s) cargado(s).`;
      return;
    }
    throw new Error(lastMessage || 'No se encontró una ruta válida para leer el ranking.');
  }catch(error){
    if(status) status.textContent = 'No se pudo leer el ranking online.';
    if(!silent) showNotice(error?.message || 'No se pudo cargar el ranking online.');
  }finally{
    rankingLoading = false;
  }
}
