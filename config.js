/*
  Configuración editable del juego.
  Cambiar estos valores no requiere tocar app.js.
  Nota: si ya existe una partida guardada, algunos cambios sólo aplican a nuevas partidas o a nuevos eventos.
*/
window.GAME_CONFIG = {
  version: 'V5.65',
  data: {
    seedUrl: 'data/seed.json',
    // Modo de cache para los JSON. 'default' permite cache del navegador; usar 'no-store' sólo durante pruebas intensivas.
    cacheMode: 'default',
    // El juego carga y combina todos los JSON válidos de esta lista.
    leagueUrls: ['data/Liga Argentina.json', 'data/Liga Chile.json', 'data/Liga Brasil.json', 'data/Liga Inglaterra.json', 'data/Liga Espana.json', 'data/Liga Italia.json', 'data/Liga Rumania.json'],
    playersUrl: 'data/jugadores.json',
    manualPlayersUrl: 'data/jugadores_manuales.json',
    sponsorsUrl: 'data/sponsors.json',
    employeesUrl: 'data/empleados.json',
    eventsUrl: 'data/eventos.json',
    specialSkillsUrl: 'data/habilidades_especiales.json',
    managerAchievementsUrl: 'data/hitos_manager.json',
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
    instalacionesUrl: 'data/instalaciones.json',
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
    amistososMaximosPretemporada: 5
  },

  centroOjeo: {
    activo: true,
    cupoBaseOjeadores: 2,
    cupoBaseJugadores: 5,
    ojeadoresPorOficina: 3,
    jugadoresPorOficina: 10,
    costoOjeadorDiario: 200000,
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
    libresMinimosDelanteros: 16
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
    // Prórroga por promedio general histórico del manager.
    bonusPartidosPromedioGeneral120: 2,
    bonusPartidosPromedioGeneral150: 5,
    bonusPartidosPromedioGeneral190: 12
  },
  codigosEspeciales: {
    activo: true,
    // Cada código se puede reclamar una sola vez por partida guardada.
    codigos: [
      {
        codigo: 'PRESTIGIO20',
        nombre: 'Impulso de prestigio',
        descripcion: 'Suma 20 puntos de prestigio al manager.',
        beneficios: { prestigio: 20 }
      },
      {
        codigo: 'PUNTOS50000',
        nombre: 'Puntos de habilidad',
        descripcion: 'Suma 50.000 puntos de habilidad para sobres.',
        beneficios: { puntosHabilidad: 50000 }
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
    // Balance de cohesión de equipo. Ajustado en V3.21 para que el equipo gane cohesión con mayor claridad.
    valorInicial: 50,
    gananciaPorPartido: 7,
    perdidaPorCambioTactico: 8,
    perdidaPorCambioJugador: 1,
    probabilidadEntrenamientoTacticoPorCasilla: 0.35,
    gananciaEntrenamientoTacticoPorCasilla: 1
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
    desarrolloPlantelPorTemporada: 0.18,
    bonusDesarrolloPorPosicion: 0.08,
    maximoBoostBotPorHabilidad: 18
  },
  economia: {
    gastosMensuales: {
      activo: true,
      diaCobro: 1,
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
    // Multiplica los valores base de data/sponsors.json. 1 mantiene el valor del archivo.
    factorValorBase: 1,
    partidosMinimosEntreTandas: 4,
    partidosMaximosEntreTandas: 7,
    ofertasMinimasPorTanda: 2,
    ofertasMaximasPorTanda: 5,
    ofertasInicialesFecha1: 2
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
    ofertaJugadoresMinPorcentajeClausula: 0.05,
    ofertaJugadoresMaxPorcentajeClausula: 0.15,
    ofertasJugadoresRequierenPartidos: true,
    ofertasJugadoresRequierenGolOAsistencia: true,

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
    ofertaClausulaEspecialTopJugadores: 3
  },
  estadio: {
    costoReplantarCesped: 2000000,
    diasReplantarCesped: 35,
    costoParchearCampo: 200000,
    diasParchearCampo: 21,
    mejoraParchePorAvance: 5,
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
    multiplicadorDiasObras: 30
  },
  empleados: {
    // Los valores base de empleados regulares se mantienen; las categorías se cargan desde data/empleados.json.
    psicologoCosto: 500000,
    psicologoProbabilidadExito: 0.90,
    psicologoCooldownDias: 35,
    kinesiologoCosto: 1000000,
    kinesiologoProbabilidadFallo: 0.20,
    // Botón masivo: horas extras médicas. 0.01 = 1% del costo/sueldo del kinesiólogo contratado.
    kinesiologoHorasExtrasPorcentajeSueldo: 0.01,
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
    // V3.43: enfoque jugadorista. El resultado mezcla fuerza colectiva con duelos individuales.
    pesoColectivo: 0.70,
    pesoIndividual: 0.30,
    // Reduce goles de defensores en jugadas normales. Siguen pudiendo marcar en pelota parada.
    probabilidadPelotaParada: 0.14,
    // V3.45: los errores dependen del jugador implicado. Se usa la seguridad del jugador: (moral + físico + media + cohesión) / 400.
    // El riesgo real de error es 1 - seguridad, para que mejores valores reduzcan errores.
    formulaErroresJugador: true,
    escalaRiesgoErrorJugador: 0.72,
    // Cuando un gol rival ocurre, esta probabilidad lo atribuye también como error de gol a un defensor o arquero.
    probabilidadGolAtribuyeErrorGol: 0.60,
    // Probabilidad base anterior mantenida como respaldo si se desactiva formulaErroresJugador.
    probabilidadErrorTerminaEnGol: 0.28,
    // Máximo de errores usado para evitar partidos rotos por errores constantes.
    maximoErroresPorEquipo: 5,
    // V5.18: multiplicador de pérdida física minuto a minuto del simulador vivo. 2 = doble fatiga.
    fatigaVivaMultiplicador: 2,
    // V5.27: reducción general de tarjetas generadas por el simulador. 0.50 = mitad de tarjetas.
    multiplicadorTarjetas: 0.50,
    // V5.27: con esta cantidad de rojas para un equipo, el partido se suspende y pierde 0-3.
    rojasDerrotaDefault: 5,
    // Estrellas de referencia: aumentan el peso del jugador dentro del simulador.
    estrellasMaximasPorEquipo: 3,
    estrellasPartidosVentana: 10,
    estrellaGoleadorPartidosConGol: 3,
    estrellaArqueroPartidosConTapadaClave: 3,
    estrellaMediocampistaAsistencias: 3,
    estrellaBonusReferencia: 0.30,
    // V4.26: balance físico postpartido. Recuperación automática reducida a un tercio y desgaste ampliado.
    recuperacionAutomaticaPostPartidoMin: 4,
    recuperacionAutomaticaPostPartidoMax: 6,
    // V5.44: si está activo, la recuperación postpartido usa la resistencia del jugador.
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
    desgastePartidoMin: 25,
    desgastePartidoMax: 46,
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
  lesiones: {
    // V3.42: reduce la probabilidad total de lesiones un 80%. 0.20 = queda el 20% de la chance previa.
    multiplicadorProbabilidad: 0.20,
    lesionBase: 0.05,
    fatigaPaso: 5,
    fatigaBonus: 0.01,
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
    penalizacionLesionadoSuplente: 0.10
  },

  ranking: {
    // URL publicada para enviar y leer resultados del ranking online.
    appsScriptUrl: 'https://rankingdemanagers.emanuelastudillo.workers.dev',
    // Token opcional. Si el Worker exige login, pegar acá el token y el juego lo envía como Bearer.
    token: '',
    // El Worker actual exige sesión para subir récords. El front guarda el token en localStorage tras iniciar sesión.
    requiereLogin: true,
    // Rutas compatibles con Worker Cloudflare + D1 actual y variantes anteriores.
    // La ruta principal de carga es /ranking/season.
    submitPaths: ['ranking/season','api/ranking/season','season','records/season','api/records/season','records','ranking','scores','submit','api/records','api/ranking','api/scores','api/submit',''],
    // Rutas de login/verificación compatibles con el Worker Cloudflare + D1.
    // También prueba rutas de registro/sesión para cuentas creadas originalmente sin contraseña.
    loginPaths: ['auth/login','login','api/auth/login','api/login','auth/register','register','api/auth/register','api/register','auth/session','session','api/auth/session','api/session'],
    mePaths: ['auth/me','me','api/auth/me','api/me','user','api/user'],
    // La lectura principal usa /ranking/season; /ranking/career queda como respaldo si se expone.
    readPaths: ['ranking/season','ranking/career','api/ranking/season','api/ranking/career','ranking','records','scores','api/ranking','api/records','api/scores',''],
    resultadosPorPagina: 100,
    cooldownCargaDias: 50,
    nombreRanking: 'Ranking Online'
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
    // Simulador vivo: demora entre minutos cuando se usa el botón Auto. V5.13 duplica la pausa anterior.
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
