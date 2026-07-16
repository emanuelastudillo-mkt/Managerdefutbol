/*
  Configuración editable del juego.
  Cambiar estos valores no requiere tocar app.js.
  Nota: si ya existe una partida guardada, algunos cambios sólo aplican a nuevas partidas o a nuevos eventos.
*/
window.GAME_CONFIG = {
  version: 'V7.64',
  partidas: {
    // se mantiene la separación de carreras normales; el nombre visible se arma con club y temporada.
    slotsCarrera: 5
  },
  data: {
    seedUrl: 'data/seed.json',
    // Modo de cache para los JSON. 'default' permite cache del navegador; usar 'no-store' sólo durante pruebas intensivas.
    cacheMode: 'default',
    // El juego carga y combina todos los JSON válidos de esta lista.
    leagueUrls: ['data/Liga Argentina.json', 'data/Liga Chile.json', 'data/Liga Brasil.json', 'data/Liga Inglaterra.json', 'data/Liga Espana.json', 'data/Liga Italia.json', 'data/Liga Rumania.json'],
    // Manifest principal y chunks de jugadores. Si playersUrls está definido, el juego carga esos archivos en paralelo.
    playersUrl: 'data/jugadores.json',
    playersUrls: [
      'data/jugadores/argentina-liga-profesional.json',
      'data/jugadores/argentina-primera-nacional.json',
      'data/jugadores/argentina-federal-a.json',
      'data/jugadores/chile-primera-division-chile.json',
      'data/jugadores/brasil-brasileirao.json',
      'data/jugadores/inglaterra-premier-league.json',
      'data/jugadores/espana-laliga-espana.json',
      'data/jugadores/italia-serie-a-italia.json',
      'data/jugadores/rumania-superliga-rumania.json'
    ],
    manualPlayersUrl: 'data/jugadores_manuales.json',
    sponsorsUrl: 'data/sponsors.json',
    employeesUrl: 'data/empleados.json',
    installationsUrl: 'data/instalaciones.json?v=7.64',
    eventsUrl: 'data/eventos.json',
    specialSkillsUrl: 'data/habilidades_especiales.json?v=7.64',
    managerAchievementsUrl: 'data/hitos_manager.json',
    retosManagerUrl: 'data/retos_manager.json',
    estadiosUrl: 'data/estadios_argentina.json',
    hinchasUrl: 'data/hinchas_argentina.json',
    estadiosUrls: ['data/estadios_argentina.json', 'data/estadios_chile.json', 'data/estadios_brasil.json', 'data/estadios_inglaterra.json', 'data/estadios_espana.json', 'data/estadios_italia.json', 'data/estadios_rumania.json'],
    hinchasUrls: ['data/hinchas_argentina.json', 'data/hinchas_chile.json', 'data/hinchas_brasil.json', 'data/hinchas_inglaterra.json', 'data/hinchas_espana.json', 'data/hinchas_italia.json', 'data/hinchas_rumania.json'],
    estadiosArgentinaUrl: 'data/estadios_argentina.json',
    hinchasArgentinaUrl: 'data/hinchas_argentina.json',
    estadiosChileUrl: 'data/estadios_chile.json',
    hinchasChileUrl: 'data/hinchas_chile.json',
    estadiosBrasilUrl: 'data/estadios_brasil.json',
    hinchasBrasilUrl: 'data/hinchas_brasil.json',
    estadiosInglaterraUrl: 'data/estadios_inglaterra.json',
    hinchasInglaterraUrl: 'data/hinchas_inglaterra.json',
    estadiosEspanaUrl: 'data/estadios_espana.json',
    hinchasEspanaUrl: 'data/hinchas_espana.json',
    estadiosItaliaUrl: 'data/estadios_italia.json',
    hinchasItaliaUrl: 'data/hinchas_italia.json',
    estadiosRumaniaUrl: 'data/estadios_rumania.json',
    hinchasRumaniaUrl: 'data/hinchas_rumania.json',
    relatosPartidoUrl: 'data/relatos_partido.json'
  },
  calendario: {
    // Cada avance equivale a 1 día calendario. La temporada se procesa día por día.
    diasPorAvance: 1,
    // Año inicial del calendario. Cada temporada usa un año calendario completo y respeta años bisiestos.
    anioInicial: 2026,
    mesInicioTemporada: 1,
    diaInicioTemporada: 1,
    // La liga ahora se juega ida y vuelta. Con 18 clubes por división son 34 fechas.
    ligaIdaYVuelta: true,
    diasEntreFechasLiga: 7,
    fechaPausaLuegoDe: 17,
    diasVacacionesMitadTemporada: 28,
    // Distribución de partidos por días para no simular todas las ligas juntas.
    // offset: -2 = viernes, -1 = sábado, 0 = domingo respecto de la fecha base de cada jornada.
    diasPorLiga: [
      { paises:['España','Italia','Inglaterra','Rumania'], offset:-2 },
      { paises:['Argentina'], ordenes:[2,3], offset:-1 },
      { paises:['Chile','Brasil'], offset:0 },
      { paises:['Argentina'], ordenes:[1], offset:0 }
    ],
    // Los partidos sin manager usan simulación rápida para reducir bloqueos.
    simulacionRapidaBots: true,

    // Cooldown único tras cada avance/partido. 10000 = 10 segundos.
    bloqueoEntreAvancesMs: 10000,
    // El avance diario usa el mismo cooldown para evitar dobles flujos de calendario.
    bloqueoAvanceDiaMs: 10000,
    // Duración visual de la transición al avanzar días.
    transicionAvanceMs: 3400,
    diasPretemporada: 30,
    // Si queda vacío o en 0, la postemporada ocupa automáticamente los días restantes del año.
    diasPostemporada: 0,
    // Mundial de Clubes: calendario fijo por día fijo de temporada.
    // En años bisiestos se mantienen estos mismos días; el día adicional queda libre de competencia.
    mundialClubes: {
      diaSorteo: 295,
      diaGrupos1: 305,
      diaGrupos2: 310,
      diaGrupos3: 315,
      diaOctavos: 320,
      diaCuartos: 325,
      diaSemifinales: 330,
      diaTercerPuesto: 335,
      diaFinal: 336,
      diasPreparacionAntesPrimerPartido: 1,
      jugadoresMinimosPorPartido: 21,
      boostEntrenamientoCampeonMin: 10,
      boostEntrenamientoCampeonMax: 30
    },
    amistososMaximosPretemporada: 5
  },

  centroOjeo: {
    activo: true,
    cupoBaseOjeadores: 2,
    cupoBaseJugadores: 5,
    ojeadoresPorOficina: 3,
    jugadoresPorOficina: 10,
    costoOjeadorDiario: 200000,
    costoBusquedaJugadorDiario: 50000,
    costoOficinaMensual: 1000000,
    jefes: {
      regular: { nombre:'Regular', sueldoMensual: 500000, maxOficinas: 1, revelacionesMin: 0, revelacionesMax: 1 },
      bueno: { nombre:'Bueno', sueldoMensual: 12000000, maxOficinas: 2, revelacionesMin: 0, revelacionesMax: 1 },
      elite: { nombre:'Elite', sueldoMensual: 180000000, maxOficinas: 5, revelacionesMin: 1, revelacionesMax: 2 }
    }
  },
  modoFundador: {
    activo: true,
    prestigioClubInicial: 10,
    presupuestoInicial: 0,
    capacidadEstadioInicial: 0,
    hinchasIniciales: 500,
    campoInicial: 30,
    libresMinimosTotales: 80,
    libresMinimosPorteros: 8,
    libresMinimosDefensores: 20,
    libresMinimosMediocampistas: 24,
    libresMinimosDelanteros: 16,
    // En el club fundador, las categorías superiores de empleados se habilitan por victorias logradas con ese club.
    empleados: {
      victoriasNivelBueno: 15,
      victoriasNivelElite: 45
    },
    // Gastos diarios exclusivos del club fundador. El total combina un piso por división y un porcentaje del valor del plantel.
    costosAdministrativosDiarios: {
      activo: true,
      basePorDivision: { 1: 180000, 2: 100000, 3: 60000 },
      porcentajeValorPlantelPorDivision: { 1: 0.000015, 2: 0.000012, 3: 0.000010 },
      distribucion: {
        inscripcionLiga: 0.18,
        seguridad: 0.17,
        transporte: 0.20,
        administracion: 0.15,
        mantenimientoMinimo: 0.15,
        seguros: 0.15
      }
    },
    escudosDisponibles: [
      'img/escudos/fundador-1.webp',
      'img/escudos/fundador-2.webp',
      'img/escudos/fundador-3.webp',
      'img/escudos/fundador-4.webp',
      'img/escudos/fundador-5.webp',
      'img/escudos/fundador-6.webp',
      'img/escudos/fundador-7.webp',
      'img/escudos/fundador-8.webp',
      'img/escudos/fundador-9.webp'
    ]
  },
  modoBancarrota: {
    activo: true,
    cajaInicial: -500000000,
    reduccionPrestigio: 0.70,
    reduccionHinchas: 0.50,
    capacidadEstadioInicial: 0,
    campoInicial: 100,
    juvenilesIniciales: 20,
    juvenilesPorterosMinimos: 1,
    jugadoresLealesPrimerEquipo: 14,
    jugadoresLealesPorterosMinimos: 1
  },
  clubes: {
    reputacionTemporada: {
      // ajuste anual de reputación de club por rendimiento deportivo.
      // Los descensos negativos nunca pueden bajar al club por debajo del mínimo de su liga.
      minimoPorDivisionOrden: { 1: 40, 2: 25, 3: 10 },
      posicion: {
        campeon: 2,
        zonaAlta: 1,
        zonaMedia: 0,
        zonaBaja: -1,
        zonaFondo: -2,
        zonaAltaHasta: 0.25,
        zonaMediaHasta: 0.60,
        zonaBajaHasta: 0.85
      },
      bonusCampeonPorDivisionOrden: { 1: 4, 2: 3, 3: 2 },
      bonusAscensoPorDivisionOrigenOrden: { 2: 4, 3: 5 },
      penalizacionDescensoPorDivisionOrigenOrden: { 1: -3, 2: -2 }
    }
  },

  manager: {
    // Prestigio inicial del manager. Un manager nuevo arranca en 0.
    prestigioInicial: 0,
    // Clubes con este prestigio o menos aceptan cualquier manager, incluso con prestigio 0.
    prestigioClubLibreMinimo: 20,
    // Al renunciar o ser despedido, el club bloquea al manager por esta cantidad de temporadas.
    temporadasBloqueoRecontratacion: 1,
    // Objetivo opcional de puntos por partido. null o vacío = objetivo automático por división.
    // Valores válidos: 0.3 a 2.0.
    objetivoPuntosPorPartido: null,
    // Objetivos automáticos por división cuando objetivoPuntosPorPartido queda vacío.
    objetivoDivision1: 1.4,
    objetivoDivision2: 1.1,
    objetivoDivision3: 0.9,
    // Base de evaluación: la directiva revisa desde los 5 partidos oficiales de la temporada actual.
    partidosMinimosEvaluacionObjetivo: 5,
    // La cantidad total de partidos de evaluación se congela al iniciar cada temporada.
    congelarEvaluacionObjetivoPorTemporada: true,
  },
  codigosEspeciales: {
    activo: true,
    // Los códigos válidos no se guardan en texto visible: sólo se conservan sus huellas SHA-256.
    // Los códigos normales se pueden reclamar una sola vez por partida. Los marcados como reutilizables no tienen límite de usos.
    codigos: [
      {
        huella: 'BAC19BFA1A8CA06D178B9E63A44064B2EB7CFF0D9B568A9D8D0413E2AFE6A3CE',
        nombre: 'Código de prestigio 1',
        descripcion: 'Suma 20 puntos de prestigio al manager.',
        beneficios: { prestigio: 20 }
      },
      {
        huella: '73C9EC8921C82C0242201355BBA13F87935C705DE200D00512F93112B6B5DA4C',
        nombre: 'Código de prestigio 2',
        descripcion: 'Suma 20 puntos de prestigio al manager.',
        beneficios: { prestigio: 20 }
      },
      {
        huella: 'A53DC17BC280C12143A42816A6CF8C5D6C5A89EEA820C7D015EEFD77BED88B10',
        nombre: 'Código de habilidad 1',
        descripcion: 'Suma 20.000 puntos de habilidad para sobres.',
        beneficios: { puntosHabilidad: 20000 }
      },
      {
        huella: '4F93D13471AF9C3EE053C578B9A10E1ACFE75D19B4CFAAFC3C4641779D89F4AE',
        nombre: 'Código de habilidad 2',
        descripcion: 'Suma 20.000 puntos de habilidad para sobres.',
        beneficios: { puntosHabilidad: 20000 }
      },
      {
        huella: '2FCC2088FE583D742CF98C0196E2507604F74E82CD1F006FEFF19E3BB6916A27',
        nombre: 'Código de habilidad 3',
        descripcion: 'Suma 20.000 puntos de habilidad para sobres.',
        beneficios: { puntosHabilidad: 20000 }
      },
      {
        huella: '97A45E2C3BC2539BFDE0E7EE15774725205573DE2D12BA492B31C002537A0121',
        nombre: 'Código de habilidad 4',
        descripcion: 'Suma 20.000 puntos de habilidad para sobres.',
        beneficios: { puntosHabilidad: 20000 }
      },
      {
        huella: '39F7FAB62D2B6008454327EB498B5D3359B92A1E2C2B6D1D53EC2B8BEA00C390',
        nombre: 'Código de habilidad 5',
        descripcion: 'Suma 20.000 puntos de habilidad para sobres.',
        beneficios: { puntosHabilidad: 20000 }
      },
      {
        huella: 'C3F3A81BAAF0040644327C1EAEB501931415BEF3DA117AB015B41714D7177F17',
        nombre: 'Código de habilidad 6',
        descripcion: 'Suma 20.000 puntos de habilidad para sobres.',
        beneficios: { puntosHabilidad: 20000 }
      },
      {
        huella: '5C52BA8D691930D934092DB140916A0210387B0E968ABDF7F4CD9CDBC1292294',
        nombre: 'Código de habilidad 7',
        descripcion: 'Suma 20.000 puntos de habilidad para sobres.',
        beneficios: { puntosHabilidad: 20000 }
      },
      {
        huella: '7659DB939C3C794D7486E28B66DAB798867F81ADAB74C19353F4A0B24533F854',
        nombre: 'Código de habilidad 8',
        descripcion: 'Suma 20.000 puntos de habilidad para sobres.',
        beneficios: { puntosHabilidad: 20000 }
      },
      {
        huella: 'FBDED1D38270713AF1002D4757F5D5674B3869D5F03CDB26121073245C1B8EA5',
        nombre: 'Código de fondos del club',
        descripcion: 'Acredita $100.000.000 al presupuesto del club. Puede utilizarse sin límite.',
        reutilizable: true,
        beneficios: { dineroClub: 100000000 }
      }
    ]
  },
  plantel: {
    nacionalidades: {
      local: 0.70,
      sudamerica: 0.20,
      restoDelMundo: 0.10,
      porPais: {
        Argentina: 'Argentina',
        Chile: 'Chile',
        Brasil: 'Brasil',
        Inglaterra: 'Inglaterra',
        España: 'España',
        Italia: 'Italia',
        Rumania: 'Rumania'
      },
      sudamericaPaises: ['Argentina','Brasil','Uruguay','Paraguay','Chile','Bolivia','Perú','Ecuador','Colombia','Venezuela'],
      restoDelMundoPaises: ['España','Italia','Francia','Alemania','Portugal','Inglaterra','México','Estados Unidos','Japón','Corea del Sur','Marruecos','Nigeria','Ghana','Rumania']
    },
    // Límites del primer equipo. El máximo bloquea fichajes y promociones desde academia.
    jugadoresMinimosPorClub: 18,
    jugadoresInicialesPorClub: 25,
    jugadoresMaximosPorClub: 42,
    // Envejecimiento profesional: desde esta edad se aplica un boost negativo anual acumulado a todas las habilidades.
    deterioroEdadActivo: true,
    edadInicioDeterioro: 32,
    deterioroEdadMinAnual: 1,
    deterioroEdadMaxAnual: 4,
    // Reparación automática para clubes bots: evita planteles sin porteros o por debajo de estructura mínima.
    reparacionAutomaticaBots: true,
    botsMinimoPorteros: 2,
    botsMinimoDefensores: 5,
    botsMinimoMediocampistas: 5,
    botsMinimoDelanteros: 3,
    botsMediaEmergenciaMin: 28,
    botsMediaEmergenciaMax: 52,
    botsFactorSueldoEmergencia: 0.35,
    agentesLibresIniciales: 300,
    agentesLibresMaximosTotales: 300,
    agentesLibresMediaMin: 40,
    agentesLibresMediaMax: 62,
    agentesLibresEdadMin: 19,
    agentesLibresEdadMax: 30,
    agentesLibresMaximosPorTemporada: 300,
    agentesLibresPosiciones: {
      POR: 0.10,
      DEF: 0.35,
      MED: 0.35,
      DEL: 0.20
    },
    rellenarLibresHastaMaximoPorTemporada: true,
    limpiarLibresViejosAlCambiarTemporada: true,
    jovenesLibresNuevosPorEquipoTemporada: 0,
    jovenesLibresEdadMin: 17,
    jovenesLibresEdadMax: 18,
    jovenesLibresPorTemporada: 0
  },
  cohesion: {
    // Balance de cohesión ajustado para que el equipo gane cohesión con mayor claridad.
    valorInicial: 10,
    gananciaPorPartido: 7,
    perdidaPorCambioTactico: 8,
    perdidaPorCambioJugador: 1,
    // Movimientos de plantel: vender 2 y fichar 2 jugadores reduce 10 puntos en total.
    perdidaPorFichaje: 2,
    perdidaPorVenta: 3,
    gananciaPorContratoProfesionalJuvenil: 3,
    probabilidadEntrenamientoTacticoPorCasilla: 0.35,
    gananciaEntrenamientoTacticoPorCasilla: 1
  },
  capitania: {
    activo: true,
    partidosObjetivoAprox: 10,
    maximoPorcentaje: 99,
    // Sólo usa habilidades que ya existen en todos los jugadores de la base.
    pesosMaximo: {
      liderazgo: 0.35,
      serenidad: 0.20,
      disciplina: 0.15,
      trabajoEquipo: 0.15,
      posicionamiento: 0.10,
      resistencia: 0.05
    },
    aprendizaje: {
      factorMinimo: 0.80,
      factorMaximo: 1.20,
      pesoLiderazgo: 0.40,
      pesoSerenidad: 0.25,
      pesoDisciplina: 0.20,
      pesoTrabajoEquipo: 0.15
    },
    efectos: [
      { minimo: 80, maximo: 99, moral: 1, cohesion: 2 },
      { minimo: 40, maximo: 79, moral: 0, cohesion: 1 },
      { minimo: 20, maximo: 39, moral: -1, cohesion: 0 },
      { minimo: 0, maximo: 19, moral: -3, cohesion: -2 }
    ]
  },
  equilibrioBots: {
    // Nivelación competitiva de equipos bots. Evita que desde la segunda temporada queden muy por debajo del club manejado.
    activo: true,
    // suave | normal | dificil
    dificultad: 'dificil',
    soloDivisionManager: true,
    nivelarAlInicioTemporada: true,
    mantenerDuranteTemporada: true,
    intervaloMantenimientoFechas: 2,
    // Los mejores bots de la temporada anterior reciben un plus; los peores, un margen menor.
    bonusMaximoPorPosicion: 8,
    pisoMoral: 65,
    pisoFisico: 76,
    pisoCohesion: 70,
    margenMoral: 8,
    margenFisico: 6,
    margenCohesion: 10,
    recuperacionFisicaPorMantenimiento: 8,
    recuperacionMoralPorMantenimiento: 5,
    recuperacionCohesionPorMantenimiento: 4,
    // Recupera desgaste acumulado de equipos bots. Evita que lleguen al simulador con tope físico 1 por arrastre de temporada.
    recuperacionDesgasteDiariaBot: 4,
    desgasteMaximoBotAntesDePartido: 38,
    pisoFisicoBotAntesDePartido: 58,
    desarrolloPlantelPorTemporada: 0.18,
    bonusDesarrolloPorPosicion: 0.08,
    maximoBoostBotPorHabilidad: 18,
    // Cada bot rota perfiles tácticos de forma determinista. Los clubes no parten todos del mismo perfil.
    tacticasVariadas: {
      activo: true,
      rotacionCadaFechas: 1
    },
    // Antes de enfrentar al manager, el bot audita sus mejores futbolistas y elige una formación que pueda incluirlos.
    tacticaContraManager: {
      priorizarMejoresJugadores: true,
      cantidadMejoresJugadores: 5,
      bonusInclusionMejorJugador: 5000,
      auditarCobertura: true
    }
  },
  economia: {
    pagosPorResultadoLiga: {
      activo: true,
      reputacionMinima: 10,
      reputacionMaxima: 100,
      pagoVictoriaPorPuntoReputacion: 8000,
      pagoEmpatePorPuntoReputacion: 3000,
      variacionMinima: 0.75,
      variacionMaxima: 1.25,
      redondeo: 5000,
      pagoDerrota: 0
    },
    gastosMensuales: {
      activo: true,
      impuestoGananciasPct: 0.01,
      electricidadBasePorPartido: 100000,
      electricidadPorCapacidadPorPartido: 10,
      limpiezaPorHinchaPorPartido: 10
    },
    escalaSueldosYClausulas: 0.10,
    // Multiplica sólo las cláusulas calculadas. 0.10 = una décima parte del valor previo.
    escalaClausulas: 0.10,
    reduccionBaseSueldoFinTemporada: 0.05,
    bonusSueldoPorPartidoJugado: 0.01,
    banco: {
      activo: true,
      bancos: [
        { nombre:'Banco Nación', interes:0.32 },
        { nombre:'Banco Provincia', interes:0.36 },
        { nombre:'Banco Galicia', interes:0.41 },
        { nombre:'Santander', interes:0.44 },
        { nombre:'BBVA', interes:0.43 },
        { nombre:'Banco Macro', interes:0.47 },
        { nombre:'Banco Credicoop', interes:0.34 },
        { nombre:'ICBC', interes:0.39 },
        { nombre:'Banco Supervielle', interes:0.46 },
        { nombre:'Banco Comafi', interes:0.50 }
      ],
      montos: [
        { monto:50000000, prestigio:1 },
        { monto:500000000, prestigio:5 },
        { monto:1500000000, prestigio:20 }
      ],
      plazosSemanas: [24,48,172]
    }
  },
  sponsors: {
    // sistema fijo por temporada + sponsor especial con condición.
    factorValorBase: 0.1,
    ofertasMinimasPorTemporada: 20,
    ofertasMaximasPorTemporada: 40,
    ofertasVencenEnDias: 5,
    ofertasPorLlegadaMin: 1,
    ofertasPorLlegadaMax: 3,
    probabilidadLlegadaTriple: 0.45,
    duracionOfertaMinDias: 30,
    duracionOfertaMaxDias: 700,
    sponsorEspecialActivo: true,
    probabilidadSponsorEspecial: 0.22,
    multiplicadorBonoEspecial: 3,
    condicionesEspeciales: [
      { id:'low_player_starter_6_10', nombre:'Apuesta al tapado', descripcion:'Un jugador de muy bajo nivel debe ser titular 6 de los próximos 10 partidos.', partidosObjetivo:10, titularesObjetivo:6, mediaMaxima:55 },
      { id:'clean_sheets_4', nombre:'Valla invicta', descripcion:'No recibir goles en los próximos 4 partidos.', partidosObjetivo:4 },
      { id:'win_4_5', nombre:'Racha ganadora', descripcion:'Ganar 4 de los próximos 5 partidos.', partidosObjetivo:5, victoriasObjetivo:4 },
      { id:'no_reds_5', nombre:'Juego limpio', descripcion:'No recibir tarjetas rojas en los próximos 5 partidos.', partidosObjetivo:5 },
      { id:'field_98_30', nombre:'Campo impecable', descripcion:'Mantener el campo de juego por encima de 98 durante 30 días.', diasObjetivo:30, minimoCampo:98 },
      { id:'lose_5_5', nombre:'Campaña incómoda', descripcion:'Perder los próximos 5 partidos.', partidosObjetivo:5, derrotasObjetivo:5 }
    ]
  },
  mercado: {
    // Impuesto federativo sobre ventas de jugadores. 0.30 = el club recibe 70% neto.
    impuestoAfaTraspasos: 0.30,
    // Siglas usadas en mensajes de ofertas según país/liga del club comprador.
    federacionesTraspaso: {
      Argentina:'AFA',
      Chile:'ANFP',
      Brasil:'CBF',
      Inglaterra:'FA',
      España:'RFEF',
      Italia:'FIGC',
      Rumania:'FRF'
    },
    // Ofertas automáticas y ofertas al ofrecer jugadores: nunca superan este % de la cláusula.
    ofertaJugadoresMinPorcentajeClausula: 0.10,
    ofertaJugadoresMaxPorcentajeClausula: 0.30,
    ofertasJugadoresRequierenPartidos: true,
    ofertasJugadoresRequierenGolOAsistencia: true,
    // Un jugador del club puede ofrecerse manualmente cuando disputó 6 partidos o más. No exige haber cobrado un sueldo.
    partidosNecesariosParaOfrecerJugador: 6,
    // Bonificaciones porcentuales sobre la cláusula al calcular una oferta.
    // Se derivan de estadísticas ya existentes; no agregan atributos nuevos al jugador.
    valorOfertaJugador: {
      partidosParaBonoMaximo: 24,
      bonoMaximoPartidos: 8,
      bonoPorGol: 1.5,
      bonoMaximoGoles: 12,
      bonoPorAsistencia: 1.25,
      bonoMaximoAsistencias: 10,
      bonoMaximoRendimiento: 8,
      bonoMaximoOjeo: 5
    },
    ofertaMinimaEstrellaParaVentaPct: 60,

    // Bloqueo de presupuesto para fichajes. Sólo limita compras de jugadores; el resto del presupuesto queda disponible para gastos del club.
    presupuestoFichajesActivo: true,
    presupuestoFichajesMaximoPorcentaje: 0.50,
    presupuestoFichajesDivision3: 0.25,
    presupuestoFichajesDivision2: 0.35,
    presupuestoFichajesDivision1: 0.40,
    desbloqueoSuperarObjetivo: 0.05,
    desbloqueoPromedio15: 0.05,
    desbloqueoPromedio19: 0.10,
    desbloqueoAscenso: 0.10,
    desbloqueoCampeon: 0.15,
    porcentajeVentaLiberadoFichajes: 0.70,

    // Oferta especial de cláusula: entre 1 y 2 veces en las últimas fechas, un club de la misma liga puede pagar la cláusula de uno de los 3 mejores jugadores del plantel.
    ofertaClausulaEspecialActiva: true,
    ofertaClausulaEspecialFechasFinales: 10,
    ofertaClausulaEspecialMinPorTemporada: 1,
    ofertaClausulaEspecialMaxPorTemporada: 2,
    ofertaClausulaEspecialTopJugadores: 3,
    // Una oferta por cláusula completa que quede sin respuesta se ejecuta automáticamente en estos días de temporada.
    ofertaClausulaAutoAceptarPrimerDia: 162,
    ofertaClausulaAutoAceptarSegundoDia: 355
  },
  estadio: {
    costoReplantarCesped: 2000000,
    diasReplantarCesped: 35,
    costoParchearCampo: 200000,
    diasParchearCampo: 21,
    mejoraParchePorAvance: 5,
    // Sanción económica automática de AFA cuando el campo dirigido cae por debajo del umbral.
    afaCampoSancionActiva: true,
    afaCampoUmbral: 10,
    afaCampoMulta: 1000000,
    afaCampoReplanteObligatorio: 4000000,
    afaCampoEstadoRestaurado: 100,
    afaCampoDiasRestauracion: 1,
    // El deterioro normal del campo se multiplica por este valor.
    deterioroCampoMultiplicador: 2,
    // Cada cambio de temporada el estadio del club dirigido pierde este porcentaje de capacidad.
    deterioroCapacidadPorTemporadaPct: 1,
    // Los equipos bots no degradan su campo durante la temporada: reciben un estado fijo al iniciar cada temporada.
    botsCampoFijoPorTemporada: true,
    botsCampoMinimo: 30,
    botsCampoMaximo: 95,
    botsCampoBaseInicial: 58,
    botsCampoRangoPorPosicion: 42,
    // Reparación defensiva: si los campos bots quedan debajo del mínimo, se consideran datos corruptos y se regeneran.
    botsCampoAutoRepararEstadosInvalidos: true,
    botsCampoUmbralInvalido: 29,
    botsCampoPorcentajeMasivoInjugable: 0.60,
    // Entradas, hinchadas y ventaja local.
    precioEntradaInicial: 100,
    precioEntradaMinimo: 10,
    precioEntradaMaximo: 500,
    // Precio automático sólo para clubes bots locales según prestigio del rival.
    // Bajo: precio base. Medio: +50% a +100%. Alto: +100% a +500%.
    precioEntradaBotAutomatico: true,
    precioEntradaBotPrestigioBajoHasta: 39,
    precioEntradaBotPrestigioMedioHasta: 69,
    precioEntradaBotMultiplicadorMedioMin: 1.50,
    precioEntradaBotMultiplicadorMedioMax: 2.00,
    precioEntradaBotMultiplicadorAltoMin: 2.00,
    precioEntradaBotMultiplicadorAltoMax: 5.00,
    precioEntradaBotRedondeo: 10,
    porcentajeVisitanteMinimo: 0.07,
    porcentajeVisitanteMaximo: 0.10,
    porcentajeVisitanteMaximoConFaltanteLocal: 0.50,
    hinchasPorPuntoBonusLocal: 1000,
    bonusLocalMaximo: 50,
    gananciaHinchasPorVictoriaBase: 0.001,
    perdidaHinchasPorDerrotaActual: 0.005,
    posicionTablaPuntoNeutro: 10,
    posicionTablaPaso: 0.001,
    posicionTablaGananciaMaxima: 0.005,
    precioEntradaEfectoMaximo: 0.01,
    // Aumento de demanda de entradas por prestigio del rival. 0.35 = hasta +35% de público potencial.
    bonusAsistenciaPrestigioRivalMaximo: 0.35,
    // Desde este prestigio del rival empieza a notarse el aumento de interés por el partido.
    bonusAsistenciaPrestigioRivalDesde: 20,
    // Proporción del bonus que también empuja demanda visitante/neutral.
    bonusAsistenciaPrestigioRivalVisitante: 0.50,
    // Multiplica la duración base de las ampliaciones de estadio. Ejemplo: 1 día base x 30 = 30 días reales de obra.
    multiplicadorDiasObras: 30,

    // Campañas para sumar socios. La UI muestra inversión y duración; los socios diarios y totales quedan ocultos.
    campaniasSocios: [
      { id:'marketing_50m_60d', nombre:'Campaña barrial de socios', inversion: 50000000, diasDuracion: 60, sociosDiaMin: 10, sociosDiaMax: 15 },
      { id:'marketing_500m_90d', nombre:'Campaña masiva de afiliación', inversion: 500000000, diasDuracion: 90, sociosDiaMin: 35, sociosDiaMax: 50 },
      { id:'marketing_100m_10d', nombre:'Operativo relámpago de socios', inversion: 100000000, diasDuracion: 10, sociosDiaMin: 30, sociosDiaMax: 50 }
    ]
  },
  empleados: {
    // Los valores base de empleados regulares se mantienen; las categorías se cargan desde data/empleados.json.
    psicologoCosto: 500000,
    psicologoProbabilidadExito: 0.90,
    psicologoCooldownDias: 35,
    // Ganancia de moral por charla exitosa antes del multiplicador de categoría del empleado.
    psicologoMoralMin: 6,
    psicologoMoralMax: 10,
    kinesiologoCosto: 1000000,
    kinesiologoProbabilidadFallo: 0.20,
    // Botón masivo: horas extras médicas. 0.01 = 1% del costo/sueldo del kinesiólogo contratado.
    kinesiologoHorasExtrasPorcentajeSueldo: 0.01,
    kinesiologoTrabajoDiferenciado: {
      recuperacionDesgasteDiaria: 4,
      recuperacionFormaDiaria: 5,
      recuperacionMoralDiaria: 1,
      reduccionLesionPorCategoria: { regular: 0.40, bueno: 0.55, elite: 0.85 }
    },
    preparadorJuvenilesCosto: 1000000
  },
  academia: {
    costoCaptacion: 1000000,
    diasCaptacion: 35,
    jugadoresMinimosPorCaptacion: 5,
    jugadoresMaximosPorCaptacion: 10,
    costoJugadorPorAvance: 10000,
    diaCobroSemanalJuveniles: 1, // 1 = lunes. Los juveniles cobran una vez por semana.
    compensacionDespido: 50000,
    multiplicadorEntrenamiento: 5,
    multiplicadorEntrenamientoJuvenilExcepcional: 5,
    juvenilExcepcionalPorTemporada: true,
    edadJuvenilExcepcional: 16,
    edadJuvenilMin: 12,
    edadJuvenilMax: 16,
    edadUltimaTemporadaAcademia: 17,
    mediaJuvenilExcepcionalMin: 12,
    mediaJuvenilExcepcionalMax: 40,
    mediaMaximaCreacionBase: 30,
    mediaMaximaCreacionBonusEdad: 3,
    crecimientoTemporadaMin: 7,
    crecimientoTemporadaMax: 11,
    crecimientoExcepcionalTemporadaMin: 15,
    crecimientoExcepcionalTemporadaMax: 20,
    cupoBaseJuveniles: 10,
    residenciaCuposJuveniles: 20,
    residenciaCostoMensual: 560000,
    // Cantidad base de habilidades reveladas por informe del preparador.
    multiplicadorConsultaJuveniles: 1,
    // Lesiones juveniles por temporada. Mientras están lesionados no entrenan.
    lesionesJuvenilesMinPorTemporada: 1,
    lesionesJuvenilesMaxPorTemporada: 2,
    lesionJuvenilDiasMin: 14,
    lesionJuvenilDiasMax: 42,
    costoTratamientoLesionJuvenil: 50000
  },
  entrenamiento: {
    // Cada avance semanal aplica el plan de 7 días con 4 turnos generales por día.
    efectividadPorCasilla: 0.25,
    // Quinto entrenamiento diario: se aplica individualmente a cada jugador una vez por día.
    entrenamientoIndividualDiario: true,
    efectividadIndividualPorDia: 0.25,
    entrenamientoIndividualInicial: 'balanced',
    // Curva de dificultad: una habilidad alta reduce la probabilidad final de subir +1.
    // Ejemplo: habilidad 80 => 20% de probabilidad final si ya superó la tirada base.
    curvaHabilidadActual: true,
    probabilidadMinimaSubidaHabilidad: 0,
    // Multiplicador directo de velocidad para boosts temporales de habilidades profesionales.
    // Las habilidades base del profesional no cambian; los boosts se reducen al 30% al cerrar temporada.
    multiplicadorSubidaHabilidades: 3,
    planSemanalInicial: {
      pre: 'regenerative',
      morning: 'intense',
      afternoon: 'tactical',
      night: 'dayoff'
    },
    desgaste: {
      activo: true,
      maximo: 98,
      desgasteMinPartido: 2,
      desgasteMaxPartido: 4,
      desgastePorTurnoIntenso: 1,
      recuperacionPorTurnoMasajista: 1
    }
  },

  simulador: {
    // Equilibrio del resultado de cada ocasión: mitad construcción colectiva y mitad duelo individual.
    // Se aplica al partido normal, al simulador en vivo y a Ver solo resultados.
    pesoColectivo: 0.50,
    pesoIndividual: 0.50,
    // Reduce goles de defensores en jugadas normales. Siguen pudiendo marcar en pelota parada.
    probabilidadPelotaParada: 0.14,
    // los errores dependen del jugador implicado. Se usa la seguridad del jugador: (moral + físico + media + cohesión) / 400.
    // El riesgo real de error es 1 - seguridad, para que mejores valores reduzcan errores.
    formulaErroresJugador: true,
    escalaRiesgoErrorJugador: 0.72,
    // Cuando un gol rival ocurre, esta probabilidad lo atribuye también como error de gol a un defensor o arquero.
    probabilidadGolAtribuyeErrorGol: 0.60,
    // Probabilidad base anterior mantenida como respaldo si se desactiva formulaErroresJugador.
    probabilidadErrorTerminaEnGol: 0.28,
    // Máximo de errores usado para evitar partidos rotos por errores constantes.
    maximoErroresPorEquipo: 5,
    // multiplicador de pérdida física minuto a minuto del simulador vivo. 2 = doble fatiga.
    fatigaVivaMultiplicador: 5,
    // reducción general de tarjetas generadas por el simulador. 0.50 = mitad de tarjetas.
    multiplicadorTarjetas: 1.10,
    // con esta cantidad de rojas para un equipo, el partido se suspende y pierde 0-3.
    rojasDerrotaDefault: 5,
    // Estrellas de referencia: aumentan el peso del jugador dentro del simulador.
    estrellasMaximasPorEquipo: 3,
    estrellasPartidosVentana: 10,
    estrellaGoleadorPartidosConGol: 3,
    estrellaArqueroPartidosConTapadaClave: 3,
    estrellaMediocampistaAsistencias: 3,
    estrellaBonusReferencia: 0.30,
    // balance físico postpartido. Recuperación automática reducida a un tercio y desgaste ampliado.
    recuperacionAutomaticaPostPartidoMin: 4,
    recuperacionAutomaticaPostPartidoMax: 6,
    // si está activo, la recuperación postpartido usa la resistencia del jugador.
    // El rango 61-70 queda como puente para evitar saltos bruscos.
    recuperacionPostPartidoUsaResistencia: true,
    recuperacionPostPartidoPorResistencia: [
      { minResistencia: 1, maxResistencia: 40, recuperacionMin: 0, recuperacionMax: 1 },
      { minResistencia: 41, maxResistencia: 60, recuperacionMin: 2, recuperacionMax: 4 },
      { minResistencia: 61, maxResistencia: 70, recuperacionMin: 3, recuperacionMax: 5 },
      { minResistencia: 71, maxResistencia: 80, recuperacionMin: 4, recuperacionMax: 7 },
      { minResistencia: 81, maxResistencia: 90, recuperacionMin: 6, recuperacionMax: 9 },
      { minResistencia: 91, maxResistencia: 99, recuperacionMin: 12, recuperacionMax: 20 }
    ],
    desgastePartidoMin: 40,
    desgastePartidoMax: 78,
    factorDesgasteArquero: 0.5
  },

  tactica: {
    estilosSector: {
      activo: true,
      defensaInicial: 'posicional',
      mediosInicial: 'posicional',
      delanterosInicial: 'posicional',
      // Intensidad general del impacto de estilos sectoriales en el simulador. 1 = normal, 0.5 = suave.
      intensidadEfecto: 0.85,
      // Cansancio diario aplicado al finalizar el partido por estilos exigentes.
      cansancioPresionAlta: -3,
      cansancioRotacion: -1,
      cansancioRepliegue: -1
    }
  },
  dificultad: {
    partidosReferenciaTemporada: 34,
    umbralParticipacionLesionLarga: 0.80,
    probabilidadLesionLargaMin: 0.35,
    probabilidadLesionLargaMax: 0.65,
    pesoLesionLargaAltaParticipacion: 0.90,
    lesionLargaMinDias: 90,
    adaptacionTactica: {
      activo: true,
      partidosSinPenalizacion: 3,
      bonusRivalPorRepeticion: 0.03,
      bonusRivalMaximo: 0.12
    },
    moralSuplentes: {
      perdidaPorPartidoPerdido: 1,
      perdidaMaximaPorPartido: 12,
      partidosSinJugarMaximoContador: 20
    }
  },

  lesiones: {
    // Probabilidad general del sistema. 0.20 conserva el 20% de la probabilidad previa.
    multiplicadorProbabilidad: 0.20,
    lesionBase: 0.05,
    fatigaPaso: 5,
    fatigaBonus: 0.01,
    // Ajustes por contexto de partido.
    multiplicadorBots: 0.50,
    partidosProteccionManager: 50,
    multiplicadorManagerPrimerosPartidos: 0.50,
    multiplicadorSimuladorVivo: 0.50,
    // Pesos relativos de aparición. Deben sumar 100.
    pesoContusion: 34,
    pesoDistension: 30,
    pesoDesgarro: 20,
    pesoEsguince: 10,
    pesoRotura: 5,
    pesoFractura: 1,
    // Duraciones en días. El motor las convierte a turnos según diasPorAvance.
    contusionMinDias: 7,
    contusionMaxDias: 21,
    distensionMinDias: 21,
    distensionMaxDias: 56,
    desgarroMinDias: 28,
    desgarroMaxDias: 84,
    esguinceMinDias: 35,
    esguinceMaxDias: 105,
    roturaMinDias: 90,
    roturaMaxDias: 210,
    fracturaMinDias: 180,
    fracturaMaxDias: 400,
    lesionadoSuplenteDiasMax: 63,
    penalizacionLesionadoSuplente: 0.30
  },

  ranking: {
    // URL publicada para enviar y leer resultados del ranking online.
    appsScriptUrl: 'https://rankingdemanagers.emanuelastudillo.workers.dev',
    // Token opcional. Si el Worker exige login, pegar acá el token y el juego lo envía como Bearer.
    token: '',
    // El Worker actual exige sesión para subir récords. El front guarda el token en localStorage tras iniciar sesión.
    requiereLogin: true,
    // Rutas compatibles con Worker Cloudflare + D1 actual y variantes anteriores.
    // La ruta principal de carga es /ranking/career. Se mantienen rutas antiguas como respaldo.
    submitPaths: ['ranking/career','api/ranking/career','career','records/career','api/records/career','ranking/season','api/ranking/season','season','records/season','api/records/season','records','ranking','scores','submit','api/records','api/ranking','api/scores','api/submit',''],
    // Rutas de login/verificación compatibles con el Worker Cloudflare + D1.
    // También prueba rutas de registro/sesión para cuentas creadas originalmente sin contraseña.
    loginPaths: ['auth/login','login','api/auth/login','api/login','auth/register','register','api/auth/register','api/register','auth/session','session','api/auth/session','api/session'],
    mePaths: ['auth/me','me','api/auth/me','api/me','user','api/user'],
    // La lectura principal usa /ranking/career; /ranking/season queda como respaldo para instalaciones antiguas.
    readPaths: ['ranking/career','api/ranking/career','career','records/career','api/records/career','ranking/season','api/ranking/season','ranking','records','scores','api/ranking','api/records','api/scores',''],
    resultadosPorPagina: 100,
    cooldownCargaDias: 50,
    nombreRanking: 'Ranking Online'
  },

  desafiosOnline: {
    activo: true,
    // Usa el mismo Worker y la misma cuenta del Ranking Online.
    endpoint: 'https://rankingdemanagers.emanuelastudillo.workers.dev',
    versionSimulador: 'challenge-sim-v1',
    resultadosPorPagina: 40,
    actualizacionMs: 30000,
    maximosAbiertos: 3,
    vencimientoDias: 7,
    // Bloqueo local compartido entre publicar y aceptar para evitar acciones repetidas.
    cooldownAccionMinutos: 10
  },

  mensajesAsistente: {
    activo: true,
    frecuenciaDias: 12,
    titulo: 'Consejo del asistente',
    consejos: [
      'Hola #usuario#, cómo vas con eso de las cláusulas? Son una locura. Al menos nos protegen de que nos quiten jugadores, pero realmente nadie nunca las paga. Si ves que necesitás dinero, que no te asuste que paguen poco. Saludos.',
      'Siempre es bueno estar en los partidos. No digas que te dije, pero tu ayudante no tiene el espíritu para sacar lo mejor del equipo. Desde la cabina de video y GPS vemos todo.',
      '#usuario#, mirá de reojo el estado físico. A veces un jugador pide cancha con la cara, pero las piernas ya están negociando la rendición.',
      'Hay jugadores que parecen suplentes eternos hasta que los necesitás. No los castigues de más por una mala semana; el vestuario también se arma desde el banco.',
      'Si un jugador quiere irse, escuchalo antes de pelearte con todos. A veces una charla calma más que una multa o una promesa grande.',
      'La academia no siempre entrega estrellas. A veces entrega paciencia. Y la paciencia, aunque no salga en los informes, también gana partidos.',
      'Cuidado con comprar sólo por media. Hay jugadores que ordenan, otros que corren, otros que no se esconden. La planilla no siempre cuenta toda la historia.',
      'Cuando el equipo gana, todos parecen tácticamente brillantes. Cuando pierde, todos piden cambios. La verdad suele estar en algún punto bastante incómodo.',
      'No te cases con una formación sólo porque funcionó una vez. Los rivales miran, aprenden y después te esperan donde antes te dejaban pasar.',
      'Las ofertas bajas molestan, pero también miden el mercado. Si nadie pregunta por un jugador, quizá el problema no es la oferta sino nuestra expectativa.',
      'Si vas a cuidar el resultado, que el equipo lo sepa. Defender sin orden no es defender; es regalarle tiempo al rival para pensar.',
      'Hay días para entrenar fuerte y días para no romper lo que todavía sirve. El preparador físico no grita, pero suele tener razón.',
      'No subestimes la moral. Un plantel convencido corre un poco más, discute un poco menos y perdona mejor los errores del compañero.',
      'El mercado libre parece barato hasta que llenás el vestuario de contratos que nadie quiere pagar después. Revisá dos veces antes de entusiasmarte.',
      'Un arquero en buen momento cambia el humor de todos. Si lo ves seguro, no lo muevas sólo por ansiedad.',
      'Cuando un juvenil se lesiona, no lo apures. Todavía está aprendiendo a ser jugador y a veces el cuerpo va más lento que la ilusión.',
      'Hay partidos que se pierden antes de salir a la cancha: mala forma, mala moral, mala táctica y demasiada confianza. Revisar no cuesta nada.',
      'Si el estadio empieza a pedir arreglos, no lo dejes para siempre. El club también compite con lo que muestra alrededor de la cancha.',
      'Ojear no es descubrir una verdad absoluta; es reducir el margen de error. Igual, en este trabajo, reducir errores ya es bastante.',
      'Si el equipo está raro, mirá primero lo simple: cansancio, roles, moral y lesionados. La épica queda mejor cuando lo básico está ordenado.',
      'Antes de fichar por impulso, mandá un ojeador. Una media atractiva puede esconder poca genética, mala agresividad o un factor sorpresa que no aparece a simple vista.',
      'Ojear jugadores propios también sirve. No es desconfianza: es saber quién puede rendir más de lo que muestra y quién está viviendo de una media cómoda.',
      'Si un jugador libre aparece barato, preguntate por qué sigue libre. El ojeo no te da certezas absolutas, pero evita contratos largos por entusiasmo corto.',
      'Cuando mires un equipo rival, no busques nombres solamente. Defensa, medios y delantera te dicen dónde atacar y dónde conviene no regalar la pelota.',
      'Un informe incompleto no es inútil. A veces una sola habilidad oculta revelada alcanza para decidir si esperar, fichar o salir corriendo.',
      'Si vas a ojear varios jugadores a la vez, ordená prioridades. No todo rumor merece oficina, ojeador y café gratis.',
      'Los jugadores propios con informe completo te ayudan a elegir titulares sin mirar sólo la media. Algunos tienen más partido que cartel.',
      'Un equipo ojeado puede cambiar si vende, ficha o recompone plantel. Guardar el informe sirve, pero volver a mirar antes del partido evita sorpresas.',
      'No confundas jugador conocido con jugador conveniente. Conocer sus datos sólo elimina niebla; todavía hay que mirar sueldo, edad, puesto y necesidad real.',
      'Si el mercado muestra pocos nombres, no es pobreza: es foco. Primero aparecen los ojeados y después una ventana razonable para no perder media vida scrolleando.',
      'Un delantero con factor sorpresa alto puede convertir partidos cerrados en problemas nuevos para el rival. No siempre es regular, pero puede romper planes.',
      'Un defensor con mala agresividad oculta puede regalar amarillas aunque la media lo defienda. El informe de ojeo existe para descubrir esas trampas.',
      'La genética no mete goles, pero explica por qué algunos jugadores aguantan mejor los golpes de una temporada larga.',
      'Ojear al rival antes de cambiar la táctica es más sano que inventar soluciones después del segundo gol en contra.',
      'Si un jugador propio ya está ojeado, usá ese ojo junto al nombre como ventaja. Ya pagaste por esa información; no la ignores.',
      'Los informes archivados no son decoración. Sirven para volver rápido a jugadores que antes parecían interesantes y hoy quizá encajan mejor.',
      'No gastes todos los cupos en estrellas obvias. A veces el buen fichaje está en el jugador mediano que revela justo la oculta correcta.',
      'Ojear equipos no reemplaza mirar la tabla. Un club puede tener buena delantera y aun así estar mal por campo, moral o plantel corto.',
      'Si un jugador contratado tiene buenas visibles pero ocultas flojas, puede rendir bien en la ficha y mal cuando el partido se ensucia.',
      'El ojeo no compra jugadores; compra contexto. Y en un mercado caro, el contexto suele ser más barato que corregir un contrato malo.'
    ]
  },
  ui: {
    duracionAvisoMs: 5200,
    fasesSimulacionPartido: 90,
    duracionSimulacionPartidoMs: 270000,
    duracionMinimaFaseSimulacionMs: 3000,
    // Simulador vivo: demora entre minutos cuando se usa el botón Auto.
    simulacionVivaAutoMs: 840,
    relatoMantenerFases: 1,
    // Animación para acciones que pueden salir bien o fallar: tratar lesionados, charla motivacional, etc.
    accionesFeedbackCargaMs: 750,
    accionesFeedbackResultadoMs: 900,
    // Tiempo entre tratamientos cuando se usa "Tratar a todos". Evita que todas las animaciones se disparen a la vez.
    kinesiologoTratamientoProgresivoMs: 650,
    // Tiempo entre cartas al abrir sobres del menú ESPECIAL.
    especialAperturaCartaMs: 2700,
    frasesProgresoAvanceIntervaloMs: 10000,
    temaClubActivo: true,
    temaClubFondoOpacidad: 0.18,
    temaClubPanelOpacidad: 0.05,
    temaClubAcentoSuavizado: 0.18,
    frasesProgresoAvance: [
      'Recogiendo pelotas detrás del arco',
      'Regando el césped por sectores',
      'Midiendo la humedad del campo',
      'Marcando las líneas laterales',
      'Revisando redes de los arcos',
      'Ajustando los banderines del córner',
      'Ordenando conos de entrenamiento',
      'Contando pecheras disponibles',
      'Lavando botines embarrados',
      'Secando guantes de arquero',
      'Pesando pelotas oficiales',
      'Inflando pelotas a presión reglamentaria',
      'Verificando tapones de botines',
      'Revisando vendas y tobilleras',
      'Controlando hielo en la enfermería',
      'Preparando bebidas isotónicas',
      'Cortando cinta deportiva',
      'Limpiando pizarras tácticas',
      'Acomodando bancos de suplentes',
      'Revisando planillas de cambios',
      'Calculando desgaste del césped',
      'Separando camisetas por talle',
      'Chequeando números de dorsales',
      'Probando silbatos del árbitro',
      'Revisando iluminación del estadio',
      'Calibrando GPS de entrenamiento',
      'Registrando cargas musculares',
      'Controlando peso post-entrenamiento',
      'Analizando pisadas en el barro',
      'Ordenando pelotas por estado útil',
      'Aceitando bicicletas del gimnasio',
      'Recogiendo basura del estadio',
      'Visitando a padres de los talentos',
      'Filtrando rumores a la prensa',
      'Revisando cerraduras del vestuario',
      'Cambiando focos del túnel',
      'Contando bidones de agua',
      'Limpiando bancos de suplentes',
      'Ordenando medias por talle',
      'Revisando contratos vencidos',
      'Llamando representantes insistentes',
      'Separando pelotas pinchadas',
      'Desinfectando colchonetas del gimnasio',
      'Ajustando cintas de correr',
      'Imprimiendo planillas de entrenamiento',
      'Revisando permisos de juveniles',
      'Actualizando fichas médicas',
      'Controlando botiquines del estadio',
      'Pintando números en los conos',
      'Reparando redes de entrenamiento',
      'Barriendo tierra de los accesos',
      'Acomodando vallas publicitarias',
      'Verificando micrófonos de conferencia',
      'Revisando cámaras del estadio',
      'Cargando videos del último partido',
      'Buscando camisetas extraviadas',
      'Probando parlantes de la cancha',
      'Revisando carnets de socios',
      'Coordinando traslado de juveniles',
      'Archivando quejas de hinchas'
    ]
  }
};


(function aplicarModificadoresBalanceSeparados(){
  const balance = window.GAME_BALANCE_MODIFICADORES;
  if(!balance || typeof balance !== 'object') return;
  const mergeDeep = (base, extra) => {
    Object.entries(extra || {}).forEach(([key, value]) => {
      if(value && typeof value === 'object' && !Array.isArray(value)){
        base[key] = mergeDeep(base[key] && typeof base[key] === 'object' && !Array.isArray(base[key]) ? base[key] : {}, value);
      }else{
        base[key] = value;
      }
    });
    return base;
  };
  window.GAME_CONFIG = mergeDeep(window.GAME_CONFIG || {}, balance);
})();
