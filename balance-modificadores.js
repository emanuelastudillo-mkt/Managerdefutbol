/* Modificadores de balance del simulador y entrenamiento.
  Archivo activo: se carga antes de config.js y sobrescribe los valores indicados.
  Ajustar estos números permite balancear sin tocar app.js ni los módulos del juego.
*/
window.GAME_BALANCE_MODIFICADORES = {
  metadataBalance: {
    version: 'V7.39',
    nombre: 'Balance centralizado de modificadores V7.39',
    nota: 'Los valores definidos acá pisan los valores equivalentes de config.js.'
  },

  entrenamiento: {
    // al avanzar 1 día se aplican sólo los 4 bloques del día actual, no los 28 turnos de toda la semana.
    aplicarSoloDiaActual: true,
    efectividadPorCasilla: 0.25,
    entrenamientoIndividualDiario: true,
    efectividadIndividualPorDia: 0.25,
    curvaHabilidadActual: true,
    probabilidadMinimaSubidaHabilidad: 0,
    multiplicadorSubidaHabilidades: 3,
    desgaste: {
      activo: true,
      maximo: 98,
      desgasteMinPartido: 2,
      desgasteMaxPartido: 4,
      desgastePorTurnoIntenso: 1,
      recuperacionPorTurnoMasajista: 1
    }
  },

  cohesion: {
    valorInicial: 10,
    gananciaPorPartido: 7,
    perdidaPorCambioTactico: 8,
    perdidaPorCambioJugador: 1,
    perdidaPorFichaje: 2,
    perdidaPorVenta: 3,
    perdidaPorDespedirJugador: 1,
    gananciaPorContratoProfesionalJuvenil: 3,
    probabilidadEntrenamientoTacticoPorCasilla: 0.35,
    gananciaEntrenamientoTacticoPorCasilla: 1
  },

  moral: {
    perdidaPlantelPorDespedirJugador: 1
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
    }
  },

  lesiones: {
    // Se mantiene así: un lesionado usado como suplente rinde casi nada.
    penalizacionLesionadoSuplente: 0.30
  },

  simulador: {
    pesoColectivo: 0.70,
    pesoIndividual: 0.30,
    probabilidadPelotaParada: 0.14,
    escalaRiesgoErrorJugador: 0.72,
    probabilidadGolAtribuyeErrorGol: 0.60,
    maximoErroresPorEquipo: 5,
    fatigaVivaMultiplicador: 5,
    multiplicadorTarjetas: 1.10,
    rojasDerrotaDefault: 5,
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

  dificultad: {
    // aumenta la dificultad sin azar arbitrario.
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

  equilibrioBots: {
    // Contra el manager, obliga a la IA a revisar su top 5 disponible y adaptar la formación para incluirlo.
    tacticaContraManager: {
      priorizarMejoresJugadores: true,
      cantidadMejoresJugadores: 5,
      bonusInclusionMejorJugador: 5000,
      auditarCobertura: true
    },
    // Los bots no entrenan. Este bloque sólo ajusta su simulación rápida de partido.
    tacticaRapida: {
      sobreexigenciaSiPierde: true,
      // reglas progresivas según diferencia de goles en contra del bot.
      // desgasteFisicoPct se aplica como pérdida extra de estado físico sobre la fatiga normal del partido.
      // bonusAtaquePct aumenta la presión ofensiva mientras el bot va perdiendo.
      reglasDiferencia: [
        { diferenciaMin: 1, diferenciaMax: 1, desgasteFisicoPct: 0.20, bonusAtaquePct: 0.10 },
        { diferenciaMin: 2, diferenciaMax: 2, desgasteFisicoPct: 0.30, bonusAtaquePct: 0.20 },
        { diferenciaMin: 3, diferenciaMax: 99, desgasteFisicoPct: 0.50, bonusAtaquePct: 0.30 }
      ],
      maxGolesExtraPorEquipo: 1,
      // La sobreexigencia se define únicamente mediante reglasDiferencia.
    }
  },

  estadio: {
    deterioroCampoMultiplicador: 2,
    deterioroCapacidadPorTemporadaPct: 1,
    clima: {
      lluviaDeterioroActivo: true,
      lluviaLeveExtraDeterioro: 3,
      lluviaIntensaExtraDeterioro: 7
    }
  }
};
