/* V3.50 · Configuración, calendario anual, constantes generales y estado global. */

const GAME_CONFIG = window.GAME_CONFIG || {};
function configValue(path, fallback){
  return String(path || '').split('.').reduce((node, key) => (node && Object.prototype.hasOwnProperty.call(node, key)) ? node[key] : undefined, GAME_CONFIG) ?? fallback;
}
function configNumber(path, fallback, min=null, max=null){
  const raw = Number(configValue(path, fallback));
  let value = Number.isFinite(raw) ? raw : Number(fallback);
  if(Number.isFinite(min)) value = Math.max(min, value);
  if(Number.isFinite(max)) value = Math.min(max, value);
  return value;
}
function configBoolean(path, fallback=false){
  const raw = configValue(path, fallback);
  if(typeof raw === 'boolean') return raw;
  if(typeof raw === 'string') return !['false','0','no','off'].includes(raw.trim().toLowerCase());
  if(typeof raw === 'number') return raw !== 0;
  return Boolean(fallback);
}

const DATA_URL = configValue('data.seedUrl', 'data/seed.json');
const PLAYERS_DATABASE_URL = configValue('data.playersUrl', 'data/jugadores.json');
const SPONSORS_DATABASE_URL = configValue('data.sponsorsUrl', 'data/sponsors.json');
const EMPLOYEES_DATABASE_URL = configValue('data.employeesUrl', 'data/empleados.json');
const EVENTS_DATABASE_URL = configValue('data.eventsUrl', 'data/eventos.json');
const SPECIAL_SKILLS_DATABASE_URL = configValue('data.specialSkillsUrl', 'data/habilidades_especiales.json');
const STADIUMS_DATABASE_URL = configValue('data.estadiosUrl', 'data/estadios.json');
const FANS_DATABASE_URL = configValue('data.hinchasUrl', 'data/hinchas.json');
const FACILITIES_DATABASE_URL = configValue('data.instalacionesUrl', 'data/instalaciones.json');
const LEAGUE_DATA_CANDIDATES = ['data/Liga Argentina.json', 'data/Liga argentina.json', 'data/Liga_argentina.json', 'data/liga_argentina.json', 'data/liga-argentina.json'];
const DB_NAME = 'futbol-manager-mvp';
const DB_STORE = 'saves';
const SAVE_KEY = 'main';
const DAYS_PER_ADVANCE = configNumber('calendario.diasPorAvance', 7, 1, 30);
const SEASON_START_YEAR = configNumber('calendario.anioInicial', 2026, 1900, 2200);
const SEASON_START_MONTH = configNumber('calendario.mesInicioTemporada', 1, 1, 12);
const SEASON_START_DAY = configNumber('calendario.diaInicioTemporada', 1, 1, 31);
const SEASON_HOME_AWAY = configBoolean('calendario.ligaIdaYVuelta', true);
const SEASON_CALENDAR_VERSION = 'annual-365-home-away-v1';
const ADVANCE_LOCK_MS = configNumber('calendario.bloqueoEntreAvancesMs', 120000, 0);
const DAY_ADVANCE_LOCK_MS = configNumber('calendario.bloqueoAvanceDiaMs', 10000, 0);
const TURN_TRANSITION_MS = configNumber('calendario.transicionAvanceMs', 3400, 800);
const NOTICE_DURATION_MS = configNumber('ui.duracionAvisoMs', 5200, 1000);
const ACTION_FEEDBACK_LOADING_MS = configNumber('ui.accionesFeedbackCargaMs', 750, 250, 3000);
const ACTION_FEEDBACK_RESULT_MS = configNumber('ui.accionesFeedbackResultadoMs', 900, 300, 4000);
const KINESIOLOGIST_BULK_TREATMENT_STEP_MS = configNumber('ui.kinesiologoTratamientoProgresivoMs', 650, 150, 4000);
const SPECIAL_PACK_REVEAL_STEP_MS = configNumber('ui.especialAperturaCartaMs', 2700, 250, 9000);
const ADVANCE_STATUS_PHRASE_INTERVAL_MS = configNumber('ui.frasesProgresoAvanceIntervaloMs', 10000, 3000, 60000);
const ADVANCE_STATUS_PHRASES = Array.isArray(configValue('ui.frasesProgresoAvance', [])) ? configValue('ui.frasesProgresoAvance', []).filter(Boolean).map(String) : [];
const PLAYER_STARS_MAX_PER_CLUB = configNumber('simulador.estrellasMaximasPorEquipo', 3, 0, 10);
const PLAYER_STARS_WINDOW_MATCHES = Math.round(configNumber('simulador.estrellasPartidosVentana', 10, 1, 30));
const PLAYER_STAR_GOAL_MATCHES_REQUIRED = Math.round(configNumber('simulador.estrellaGoleadorPartidosConGol', 3, 1, 30));
const PLAYER_STAR_KEY_SAVE_MATCHES_REQUIRED = Math.round(configNumber('simulador.estrellaArqueroPartidosConTapadaClave', 3, 1, 30));
const PLAYER_STAR_MID_ASSISTS_REQUIRED = Math.round(configNumber('simulador.estrellaMediocampistaAsistencias', 3, 1, 50));
const PLAYER_STAR_REFERENCE_BONUS = configNumber('simulador.estrellaBonusReferencia', 0.30, 0, 2);

const PRESEASON_TURNS = Math.ceil(configNumber('calendario.diasPretemporada', 70, 0) / DAYS_PER_ADVANCE);
const POSTSEASON_TURNS_CONFIG = Math.ceil(configNumber('calendario.diasPostemporada', 0, 0) / DAYS_PER_ADVANCE);
const MAX_PRESEASON_FRIENDLIES = configNumber('calendario.amistososMaximosPretemporada', 5, 0);
const APP_VERSION = configValue('version', 'V3.47');

const RANKING_APPS_SCRIPT_URL = configValue('ranking.appsScriptUrl', '');
const RANKING_TOKEN = configValue('ranking.token', '');
const RANKING_PAGE_SIZE = configNumber('ranking.resultadosPorPagina', 100, 10, 500);
const RANKING_UPLOAD_COOLDOWN_DAYS = configNumber('ranking.cooldownCargaDias', 77, 0, 366);
const RANKING_NAME = configValue('ranking.nombreRanking', 'Ranking Online');
const MANAGER_OBJECTIVE_RAW = configValue('manager.objetivoPuntosPorPartido', null);
function parseManagerObjectiveValue(raw){
  if(raw === null || raw === undefined || raw === '') return null;
  const value = Number(String(raw).replace(',', '.'));
  if(!Number.isFinite(value) || value < 0.3 || value > 2) return null;
  return value;
}
const MANAGER_OBJECTIVE_PPG = parseManagerObjectiveValue(MANAGER_OBJECTIVE_RAW);
const MANAGER_OBJECTIVE_DIVISION_1 = configNumber('manager.objetivoDivision1', 1.4, 0.3, 2);
const MANAGER_OBJECTIVE_DIVISION_2 = configNumber('manager.objetivoDivision2', 1.1, 0.3, 2);
const MANAGER_OBJECTIVE_DIVISION_3 = configNumber('manager.objetivoDivision3', 0.9, 0.3, 2);
const MANAGER_OBJECTIVE_MIN_MATCHES = Math.max(1, Math.round(configNumber('manager.partidosMinimosEvaluacionObjetivo', 5, 1, 100)));
const MANAGER_OBJECTIVE_EXTRA_120 = Math.max(0, Math.round(configNumber('manager.bonusPartidosPromedioGeneral120', 2, 0, 100)));
const MANAGER_OBJECTIVE_EXTRA_150 = Math.max(0, Math.round(configNumber('manager.bonusPartidosPromedioGeneral150', 5, 0, 100)));
const MANAGER_OBJECTIVE_EXTRA_190 = Math.max(0, Math.round(configNumber('manager.bonusPartidosPromedioGeneral190', 10, 0, 100)));

const TEAM_COHESION_START = configNumber('cohesion.valorInicial', 50, 0, 100);
const TEAM_COHESION_MATCH_GAIN = configNumber('cohesion.gananciaPorPartido', 14, 0, 100);
const TEAM_COHESION_TACTIC_CHANGE_LOSS = configNumber('cohesion.perdidaPorCambioTactico', 8, 0, 100);
const TEAM_COHESION_PLAYER_CHANGE_LOSS = configNumber('cohesion.perdidaPorCambioJugador', 1, 0, 100);
const TEAM_COHESION_TACTICAL_TRAINING_CHANCE = configNumber('cohesion.probabilidadEntrenamientoTacticoPorCasilla', 0.35, 0, 1);
const TEAM_COHESION_TACTICAL_TRAINING_GAIN = configNumber('cohesion.gananciaEntrenamientoTacticoPorCasilla', 1, 0, 100);
const BOT_BALANCE_ENABLED = configBoolean('equilibrioBots.activo', true);
const BOT_BALANCE_DIFFICULTY = String(configValue('equilibrioBots.dificultad', 'normal') || 'normal').trim().toLowerCase();
const BOT_BALANCE_ONLY_MANAGER_DIVISION = configBoolean('equilibrioBots.soloDivisionManager', true);
const BOT_BALANCE_ON_SEASON_START = configBoolean('equilibrioBots.nivelarAlInicioTemporada', true);
const BOT_BALANCE_DURING_SEASON = configBoolean('equilibrioBots.mantenerDuranteTemporada', true);
const BOT_BALANCE_MAINTENANCE_INTERVAL_MATCHDAYS = Math.max(1, Math.round(configNumber('equilibrioBots.intervaloMantenimientoFechas', 2, 1, 38)));
const BOT_BALANCE_POSITION_BONUS_MAX = configNumber('equilibrioBots.bonusMaximoPorPosicion', 8, 0, 30);
const BOT_BALANCE_MORALE_FLOOR = configNumber('equilibrioBots.pisoMoral', 55, 1, 99);
const BOT_BALANCE_CONDITION_FLOOR = configNumber('equilibrioBots.pisoFisico', 76, 0, 99);
const BOT_BALANCE_COHESION_FLOOR = configNumber('equilibrioBots.pisoCohesion', 50, 0, 100);
const BOT_BALANCE_MORALE_SPREAD = Math.round(configNumber('equilibrioBots.margenMoral', 8, 0, 30));
const BOT_BALANCE_CONDITION_SPREAD = Math.round(configNumber('equilibrioBots.margenFisico', 6, 0, 30));
const BOT_BALANCE_COHESION_SPREAD = Math.round(configNumber('equilibrioBots.margenCohesion', 10, 0, 30));
const BOT_BALANCE_MAINTENANCE_CONDITION_GAIN = configNumber('equilibrioBots.recuperacionFisicaPorMantenimiento', 8, 0, 99);
const BOT_BALANCE_MAINTENANCE_MORALE_GAIN = configNumber('equilibrioBots.recuperacionMoralPorMantenimiento', 5, 0, 99);
const BOT_BALANCE_MAINTENANCE_COHESION_GAIN = configNumber('equilibrioBots.recuperacionCohesionPorMantenimiento', 4, 0, 100);
const BOT_BALANCE_DEVELOPMENT_CHANCE = configNumber('equilibrioBots.desarrolloPlantelPorTemporada', 0.18, 0, 1);
const BOT_BALANCE_POSITION_DEVELOPMENT_BONUS = configNumber('equilibrioBots.bonusDesarrolloPorPosicion', 0.08, 0, 1);
const BOT_BALANCE_MAX_SKILL_BOOST = configNumber('equilibrioBots.maximoBoostBotPorHabilidad', 18, 0, 30);
const PLAYER_MORALE_START = 60;
const PSYCHOLOGIST_COST = configNumber('empleados.psicologoCosto', 500000, 0);
const PSYCHOLOGIST_SUCCESS_CHANCE = configNumber('empleados.psicologoProbabilidadExito', 0.90, 0, 1);
const PSYCHOLOGIST_COOLDOWN_TURNS = Math.ceil(configNumber('empleados.psicologoCooldownDias', 35, 0) / DAYS_PER_ADVANCE);
const KINESIOLOGIST_COST = configNumber('empleados.kinesiologoCosto', 1000000, 0);
const KINESIOLOGIST_FAILURE_CHANCE = configNumber('empleados.kinesiologoProbabilidadFallo', 0.20, 0, 1);
const KINESIOLOGIST_OVERTIME_COST_RATE = configNumber('empleados.kinesiologoHorasExtrasPorcentajeSueldo', 0.01, 0, 1);
const INJURED_SUB_MAX_TURNS = Math.ceil(configNumber('lesiones.lesionadoSuplenteDiasMax', 63, 0) / DAYS_PER_ADVANCE);
const INJURED_SUB_PENALTY = configNumber('lesiones.penalizacionLesionadoSuplente', 0.10, 0, 1);
const DEFAULT_TRAINING_TYPE = 'regenerative';
const DEFAULT_INDIVIDUAL_TRAINING_TYPE = 'balanced';
const TRAINING_OPTIONS = [
  { value:'regenerative', label:'Regenerativo', tone:'regen' },
  { value:'massage', label:'Masajista', tone:'massage' },
  { value:'intense', label:'Entrenamiento intenso', tone:'intense' },
  { value:'tactical', label:'Entrenamiento táctico', tone:'tactical' },
  { value:'dayoff', label:'Turno libre', tone:'dayoff' }
];
const TRAINING_INDIVIDUAL_OPTIONS = [
  { value:'balanced', label:'Equilibrado', tone:'tactical' },
  { value:'recovery', label:'Recuperación', tone:'regen' },
  { value:'physical', label:'Físico', tone:'intense' },
  { value:'technical', label:'Técnico', tone:'massage' },
  { value:'defensive', label:'Defensivo', tone:'tactical' },
  { value:'attacking', label:'Ofensivo', tone:'intense' },
  { value:'goalkeeper', label:'Portería', tone:'regen' },
  { value:'mental', label:'Mental', tone:'dayoff' },
  { value:'rest', label:'Descanso', tone:'dayoff' }
];
const TRAINING_DAY_LABELS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const TRAINING_DAY_SLOTS = [
  { key:'pre', label:'Pre turno' },
  { key:'morning', label:'Turno mañana' },
  { key:'afternoon', label:'Turno tarde' },
  { key:'night', label:'Turno noche' }
];
const TRAINING_SLOT_EFFECTIVENESS = configNumber('entrenamiento.efectividadPorCasilla', 0.50, 0, 2);
const TRAINING_INDIVIDUAL_ENABLED = configBoolean('entrenamiento.entrenamientoIndividualDiario', true);
const TRAINING_INDIVIDUAL_SLOT_EFFECTIVENESS = configNumber('entrenamiento.efectividadIndividualPorDia', 0.50, 0, 2);
const TRAINING_INDIVIDUAL_INITIAL = configValue('entrenamiento.entrenamientoIndividualInicial', DEFAULT_INDIVIDUAL_TRAINING_TYPE);
const TRAINING_SKILL_CURVE_ENABLED = configValue('entrenamiento.curvaHabilidadActual', true) !== false;
const TRAINING_SKILL_MIN_FINAL_CHANCE = configNumber('entrenamiento.probabilidadMinimaSubidaHabilidad', 0, 0, 1);
const TRAINING_DEFAULT_SLOT_PLAN = configValue('entrenamiento.planSemanalInicial', { pre:'regenerative', morning:'intense', afternoon:'tactical', night:'dayoff' });

const FORMATIONS = {
  '4-4-2': ['POR','LD','DFC','DFC','LI','MC','MC','MC','MC','DC','DC'],
  '4-3-3': ['POR','LD','DFC','DFC','LI','MCD','MC','MC','EI','DC','ED'],
  '4-2-3-1': ['POR','LD','DFC','DFC','LI','MCD','MCD','MI','MCO','MD','DC'],
  '3-5-2': ['POR','DFC','DFC','DFC','MCD','MI','MC','MC','MD','DC','DC'],
  '5-3-2': ['POR','LD','DFC','DFC','DFC','LI','MC','MC','MC','DC','DC'],
  '4-1-4-1': ['POR','LD','DFC','DFC','LI','MCD','MI','MCO','MCO','MD','DC'],
  '3-4-3': ['POR','DFC','DFC','DFC','MC','MC','MC','MC','DC','DC','DC'],
  '4-5-1': ['POR','LD','DFC','DFC','LI','MCD','MI','MC','MC','MD','DC'],
  '4-3-1-2': ['POR','LD','DFC','DFC','LI','MC','MC','MC','MCO','EI','ED'],
  '5-4-1': ['POR','LD','DFC','DFC','DFC','LI','MI','MC','MC','MD','DC']
};
const FORMATION_VISUALS = {
  '4-4-2':[4,0,4,0,2],
  '4-3-3':[4,1,2,0,3],
  '4-2-3-1':[4,2,0,3,1],
  '3-5-2':[3,1,4,0,2],
  '5-3-2':[5,0,3,0,2],
  '4-1-4-1':[4,1,4,0,1],
  '3-4-3':[3,0,4,0,3],
  '4-5-1':[4,1,4,0,1],
  '4-3-1-2':[4,0,3,1,2],
  '5-4-1':[5,0,4,0,1]
};
const MENTALITIES = ['posicional','ataque','defensiva'];
const SUB_TRIGGERS = [
  { value:'tired', label:'Cambiar a los cansados' },
  { value:'best', label:'Mejores suplentes' },
  { value:'injuryOnly', label:'Solo cambios por lesión' }
];
function injuryMinTurns(path, fallbackDays){
  return Math.max(1, Math.ceil(configNumber(path, fallbackDays, 1) / DAYS_PER_ADVANCE));
}
function injuryMaxTurns(path, fallbackDays, minTurns=1){
  return Math.max(minTurns, Math.floor(configNumber(path, fallbackDays, 1) / DAYS_PER_ADVANCE));
}
function injuryRule(name, probability, minPath, minDays, maxPath, maxDays){
  const minTurns = injuryMinTurns(minPath, minDays);
  const maxTurns = injuryMaxTurns(maxPath, maxDays, minTurns);
  return { name, probability, minTurns, maxTurns };
}
const INJURY_TABLE = [
  injuryRule('Distensión', 25, 'lesiones.distensionMinDias', 21, 'lesiones.distensionMaxDias', 56),
  injuryRule('Desgarro', 20, 'lesiones.desgarroMinDias', 28, 'lesiones.desgarroMaxDias', 84),
  injuryRule('Esguince', 15, 'lesiones.esguinceMinDias', 35, 'lesiones.esguinceMaxDias', 105),
  injuryRule('Rotura', 9, 'lesiones.roturaMinDias', 90, 'lesiones.roturaMaxDias', 210),
  injuryRule('Fractura', 3, 'lesiones.fracturaMinDias', 180, 'lesiones.fracturaMaxDias', 400),
  injuryRule('Contusión', 28, 'lesiones.contusionMinDias', 7, 'lesiones.contusionMaxDias', 21)
];
const INJURY_CHANCE_MULTIPLIER = configNumber('lesiones.multiplicadorProbabilidad', 1, 0, 2);
const BASE_INJURY_CHANCE = configNumber('lesiones.lesionBase', 0.05, 0, 1);
const FATIGUE_INJURY_STEP = configNumber('lesiones.fatigaPaso', 5, 1);
const FATIGUE_INJURY_BONUS = configNumber('lesiones.fatigaBonus', 0.01, 0, 1);
const PITCH_CONDITIONS = {
  'Excelente': { passDelta:10, chanceMultiplier:1.20, fatigueBonus:0, injuryBonus:0 },
  'Normal': { passDelta:0, chanceMultiplier:1.00, fatigueBonus:0, injuryBonus:0 },
  'Regular': { passDelta:-10, chanceMultiplier:0.80, fatigueBonus:0, injuryBonus:0 },
  'Muy malo': { passDelta:-20, chanceMultiplier:0.70, fatigueBonus:10, injuryBonus:0.10 },
  'Injugable': { passDelta:-50, chanceMultiplier:0.50, fatigueBonus:20, injuryBonus:0.30 }
};
const REPLANT_COST = configNumber('estadio.costoReplantarCesped', 2000000, 0);
const REPLANT_TURNS = Math.ceil(configNumber('estadio.diasReplantarCesped', 35, 0) / DAYS_PER_ADVANCE);
const PATCH_COST = configNumber('estadio.costoParchearCampo', 200000, 0);
const PATCH_TURNS = Math.ceil(configNumber('estadio.diasParchearCampo', 21, 0) / DAYS_PER_ADVANCE);
const PATCH_GAIN_PER_TURN = configNumber('estadio.mejoraParchePorAvance', 5, 0, 100);
const BOT_FIELDS_FIXED_BY_SEASON = configBoolean('estadio.botsCampoFijoPorTemporada', true);
const BOT_FIELD_MIN_SCORE = configNumber('estadio.botsCampoMinimo', 30, 1, 100);
const BOT_FIELD_MAX_SCORE = Math.max(BOT_FIELD_MIN_SCORE, configNumber('estadio.botsCampoMaximo', 95, 1, 100));
const BOT_FIELD_INITIAL_BASE = configNumber('estadio.botsCampoBaseInicial', 58, 1, 100);
const BOT_FIELD_POSITION_RANGE = configNumber('estadio.botsCampoRangoPorPosicion', 42, 0, 100);
const BOT_FIELD_AUTO_REPAIR_ENABLED = configBoolean('estadio.botsCampoAutoRepararEstadosInvalidos', true);
const BOT_FIELD_INVALID_THRESHOLD = configNumber('estadio.botsCampoUmbralInvalido', Math.max(1, BOT_FIELD_MIN_SCORE - 1), 1, 100);
const BOT_FIELD_MASS_REPAIR_RATIO = configNumber('estadio.botsCampoPorcentajeMasivoInjugable', 0.60, 0, 1);
const MARKET_FREE_AGENT_COUNT = configNumber('plantel.agentesLibresIniciales', 300, 0);
const MARKET_FREE_AGENT_MEDIA_MIN = configNumber('plantel.agentesLibresMediaMin', 40, 1, 99);
const MARKET_FREE_AGENT_MEDIA_MAX = Math.max(MARKET_FREE_AGENT_MEDIA_MIN, configNumber('plantel.agentesLibresMediaMax', 62, 1, 99));
const MARKET_FREE_AGENT_AGE_MIN = configNumber('plantel.agentesLibresEdadMin', 19, 15, 45);
const MARKET_FREE_AGENT_AGE_MAX = Math.max(MARKET_FREE_AGENT_AGE_MIN, configNumber('plantel.agentesLibresEdadMax', 30, 15, 55));
const MARKET_FREE_AGENT_POSITION_GROUPS = [
  { id:'POR', probability:configNumber('plantel.agentesLibresPosiciones.POR', 0.10, 0), positions:['POR'] },
  { id:'DEF', probability:configNumber('plantel.agentesLibresPosiciones.DEF', 0.35, 0), positions:['LD','LI','DFC'] },
  { id:'MID', probability:configNumber('plantel.agentesLibresPosiciones.MED', 0.35, 0), positions:['MCD','MC','MC','MCO','MI','MD'] },
  { id:'ATT', probability:configNumber('plantel.agentesLibresPosiciones.DEL', 0.20, 0), positions:['ED','EI','DC'] }
];
const SEASON_FREE_AGENT_MARKET_MAX = configNumber('plantel.agentesLibresMaximosPorTemporada', 200, 0);
const SEASON_FREE_AGENT_TOP_UP_ENABLED = configBoolean('plantel.rellenarLibresHastaMaximoPorTemporada', true);
const SEASON_FREE_AGENT_CLEANUP_ENABLED = configBoolean('plantel.limpiarLibresViejosAlCambiarTemporada', true);
const SEASON_YOUTH_FREE_AGENTS_PER_CLUB = configNumber('plantel.jovenesLibresNuevosPorEquipoTemporada', 3, 0);
const SEASON_YOUTH_FREE_AGENT_AGE_MIN = configNumber('plantel.jovenesLibresEdadMin', 17, 15, 30);
const SEASON_YOUTH_FREE_AGENT_AGE_MAX = Math.max(SEASON_YOUTH_FREE_AGENT_AGE_MIN, configNumber('plantel.jovenesLibresEdadMax', 18, 15, 35));
const SEASON_YOUTH_FREE_AGENT_COUNT = configNumber('plantel.jovenesLibresPorTemporada', 0, 0);
const RETIREMENT_MIN_AGE = 32;
const RETIREMENT_MAX_AGE = 38;
const SEASON_SALARY_BASE_REDUCTION = configNumber('economia.reduccionBaseSueldoFinTemporada', 0.05, 0, 1);
const SEASON_SALARY_MATCH_BONUS = configNumber('economia.bonusSueldoPorPartidoJugado', 0.01, 0);
const FOREIGN_CLUBS = ['Atlético Lisboa','London Athletic','Milano FC','Paris Nord','Berlin United','Porto Azul','Madrid Imperial','Amsterdam Club','Montevideo City','Santos del Mar'];
const OWN_PLAYER_OFFER_COOLDOWN_TURNS = 3;
const SEASON_END_TRANSFER_OFFERS_MIN = 2;
const SEASON_END_TRANSFER_OFFERS_MAX = 6;
const TRANSFER_AFA_TAX_RATE = configNumber('mercado.impuestoAfaTraspasos', 0.30, 0, 0.95);
const PLAYER_OFFER_MIN_CLAUSE_RATE = configNumber('mercado.ofertaJugadoresMinPorcentajeClausula', 0.05, 0, 1);
const PLAYER_OFFER_MAX_CLAUSE_RATE = Math.max(PLAYER_OFFER_MIN_CLAUSE_RATE, configNumber('mercado.ofertaJugadoresMaxPorcentajeClausula', 0.15, 0, 1));
const PLAYER_OFFERS_REQUIRE_MATCHES = configBoolean('mercado.ofertasJugadoresRequierenPartidos', true);
const PLAYER_OFFERS_REQUIRE_GOAL_OR_ASSIST = configBoolean('mercado.ofertasJugadoresRequierenGolOAsistencia', true);
const SPONSOR_OFFER_MATCH_MIN = configNumber('sponsors.partidosMinimosEntreTandas', 4, 1);
const SPONSOR_OFFER_MATCH_MAX = Math.max(SPONSOR_OFFER_MATCH_MIN, configNumber('sponsors.partidosMaximosEntreTandas', 7, 1));
const SPONSOR_OFFER_COUNT_MIN = configNumber('sponsors.ofertasMinimasPorTanda', 2, 1);
const SPONSOR_OFFER_COUNT_MAX = Math.max(SPONSOR_OFFER_COUNT_MIN, configNumber('sponsors.ofertasMaximasPorTanda', 5, 1));
const SPONSOR_OPENING_OFFER_COUNT = configNumber('sponsors.ofertasInicialesFecha1', 2, 0);
const SPONSOR_BASE_VALUE_FACTOR = configNumber('sponsors.factorValorBase', 1, 0);
const ACADEMY_SCOUTING_COST = configNumber('academia.costoCaptacion', 1000000, 0);
const ACADEMY_SCOUTING_TURNS = Math.ceil(configNumber('academia.diasCaptacion', 35, 1) / DAYS_PER_ADVANCE);
const ACADEMY_PLAYERS_MIN = configNumber('academia.jugadoresMinimosPorCaptacion', 5, 1);
const ACADEMY_PLAYERS_MAX = Math.max(ACADEMY_PLAYERS_MIN, configNumber('academia.jugadoresMaximosPorCaptacion', 10, 1));
const ACADEMY_PLAYER_TURN_COST = configNumber('academia.costoJugadorPorAvance', 10000, 0);
const ACADEMY_DISMISS_COMPENSATION = configNumber('academia.compensacionDespido', 50000, 0);
const YOUTH_PREPARER_COST = configNumber('empleados.preparadorJuvenilesCosto', 1000000, 0);
const ACADEMY_VISIBLE_STATS_COUNT = 7;
const ACADEMY_SKILL_GAIN_MULTIPLIER = configNumber('academia.multiplicadorEntrenamiento', 3, 1);
const ACADEMY_EXCEPTIONAL_YOUTH_ENABLED = configBoolean('academia.juvenilExcepcionalPorTemporada', true);
const ACADEMY_EXCEPTIONAL_YOUTH_AGE = Math.round(configNumber('academia.edadJuvenilExcepcional', 16, 8, 20));
const ACADEMY_EXCEPTIONAL_YOUTH_MIN_OVERALL = Math.round(configNumber('academia.mediaJuvenilExcepcionalMin', 12, 1, 40));
const ACADEMY_EXCEPTIONAL_YOUTH_MAX_OVERALL = Math.max(ACADEMY_EXCEPTIONAL_YOUTH_MIN_OVERALL, Math.round(configNumber('academia.mediaJuvenilExcepcionalMax', 40, 1, 40)));

const MIN_PLAYERS_PER_CLUB = configNumber('plantel.jugadoresMinimosPorClub', 18, 1);
const INITIAL_PLAYERS_PER_CLUB = Math.max(MIN_PLAYERS_PER_CLUB, configNumber('plantel.jugadoresInicialesPorClub', 25, 1));
const MAX_PLAYERS_PER_CLUB = Math.max(INITIAL_PLAYERS_PER_CLUB, configNumber('plantel.jugadoresMaximosPorClub', 42, 1));
const CLUB_ROSTER_SIZE = INITIAL_PLAYERS_PER_CLUB;
const BOT_ROSTER_REPAIR_ENABLED = configBoolean('plantel.reparacionAutomaticaBots', true);
const BOT_MIN_GOALKEEPERS = configNumber('plantel.botsMinimoPorteros', 2, 1);
const BOT_MIN_DEFENDERS = configNumber('plantel.botsMinimoDefensores', 5, 0);
const BOT_MIN_MIDFIELDERS = configNumber('plantel.botsMinimoMediocampistas', 5, 0);
const BOT_MIN_ATTACKERS = configNumber('plantel.botsMinimoDelanteros', 3, 0);
const BOT_EMERGENCY_MEDIA_MIN = configNumber('plantel.botsMediaEmergenciaMin', 28, 1, 99);
const BOT_EMERGENCY_MEDIA_MAX = Math.max(BOT_EMERGENCY_MEDIA_MIN, configNumber('plantel.botsMediaEmergenciaMax', 52, 1, 99));
const BOT_EMERGENCY_SALARY_FACTOR = configNumber('plantel.botsFactorSueldoEmergencia', 0.35, 0);

const MATCH_REVEAL_PHASES = Math.max(6, Math.min(90, configNumber('ui.fasesSimulacionPartido', 30, 6))); 
const MATCH_REVEAL_DURATION_MS = Math.max(6000, configNumber('ui.duracionSimulacionPartidoMs', 30000, 1000));
const PLAYER_GENERATION_RULES_VERSION = 'V2.30';
const PLAYER_GENERATION_NATIONALITY_GROUPS = [
  { id:'argentinos', probability:0.70, countries:['Argentina'] },
  { id:'sudamerica', probability:0.20, countries:['Brasil','Uruguay','Paraguay','Chile','Bolivia','Perú','Ecuador','Colombia','Venezuela'] },
  { id:'resto_del_mundo', probability:0.10, countries:['España','Italia','Francia','Alemania','Portugal','Inglaterra','México','Estados Unidos','Japón','Corea del Sur','Marruecos','Nigeria','Ghana'] }
];
const PLAYER_GENERATION_POSITION_GROUPS = [
  { id:'POR', probability:0.10, positions:['POR'] },
  { id:'DEF', probability:0.30, positions:['LD','LI','DFC'] },
  { id:'MID', probability:0.30, positions:['MCD','MC','MC','MCO','MI','MD'] },
  { id:'ATT', probability:0.30, positions:['ED','EI','DC'] }
];
const PLAYER_GENERATION_MEDIA_RANGES = [
  { id:'elite_mundial', probability:0.005, media_min:92, media_max:99, salaryMultiplier:3000000 },
  { id:'estrella', probability:0.07, media_min:80, media_max:91, salaryMultiplier:1000000 },
  { id:'titular_competitivo', probability:0.245, media_min:68, media_max:79, salaryMultiplier:300000 },
  { id:'profesional_promedio_bajo', probability:0.50, media_min:43, media_max:67, salaryMultiplier:80000 },
  { id:'bajo_nivel', probability:0.18, media_min:19, media_max:42, salaryMultiplier:10000 }
];
const PLAYER_ECONOMY_SCALE = configNumber('economia.escalaSueldosYClausulas', 0.10, 0);
const PLAYER_CLAUSE_VALUE_SCALE = configNumber('economia.escalaClausulas', 0.10, 0);
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
let employeesDatabase = null;
let eventsDatabase = null;
let specialSkillsDatabase = null;
let game = null;
let activeTab = 'home';
let squadSort = 'media_desc';
let trainingSort = 'media_desc';
let worldPlayersSort = 'media_desc';
let worldPlayersPositionFilter = 'all';
let worldPlayersClubFilter = 'all';
let marketSubTab = 'free';
let marketFilters = { mediaMin:'', mediaMax:'', ageMin:'', ageMax:'', priceMax:'', position:'all' };
let firstTeamTab = 'tactics';
let selectedFixtureDivision = 'all';
let selectedStandingsDivision = 'all';
let selectedStatsDivision = 'all';
let uiTicker = null;
let matchRevealTimers = [];
let newGameModalShown = false;
let tacticClickSelection = null;
let rankingSort = 'managerScore_desc';
let rankingRowsCache = [];
let rankingLoading = false;

const $ = (id) => document.getElementById(id);
const view = $('view');
