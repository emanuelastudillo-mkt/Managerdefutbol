/*
  V5.47 · Modificadores de balance del simulador y entrenamiento.
  Archivo activo: se carga antes de config.js y sobrescribe los valores indicados.
  Ajustar estos números permite balancear sin tocar app.js ni los módulos del juego.
*/
window.GAME_BALANCE_MODIFICADORES = {
  metadataBalance: {
    version: 'V5.47',
    nombre: 'Balance centralizado de modificadores V5.47',
    nota: 'Los valores definidos acá pisan los valores equivalentes de config.js.'
  },

  entrenamiento: {
    // V5.40: al avanzar 1 día se aplican sólo los 4 bloques del día actual, no los 28 turnos de toda la semana.
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
    probabilidadEntrenamientoTacticoPorCasilla: 0.35,
    gananciaEntrenamientoTacticoPorCasilla: 1
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
    multiplicadorTarjetas: 1.50,
    rojasDerrotaDefault: 5,
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
    desgastePartidoMin: 40,
    desgastePartidoMax: 78,
    factorDesgasteArquero: 0.5
  },

  equilibrioBots: {
    // Los bots no entrenan. Este bloque sólo ajusta su simulación rápida de partido.
    tacticaRapida: {
      sobreexigenciaSiPierde: true,
      // V5.42: reglas progresivas según diferencia de goles en contra del bot.
      // desgasteFisicoPct se aplica como pérdida extra de estado físico sobre la fatiga normal del partido.
      // bonusAtaquePct aumenta la presión ofensiva mientras el bot va perdiendo.
      reglasDiferencia: [
        { diferenciaMin: 1, diferenciaMax: 1, desgasteFisicoPct: 0.20, bonusAtaquePct: 0.10 },
        { diferenciaMin: 2, diferenciaMax: 2, desgasteFisicoPct: 0.30, bonusAtaquePct: 0.20 },
        { diferenciaMin: 3, diferenciaMax: 99, desgasteFisicoPct: 0.50, bonusAtaquePct: 0.30 }
      ],
      maxGolesExtraPorEquipo: 1,
      // Valores heredados: quedan como respaldo si se borra reglasDiferencia.
      xgExtraSiPierde: 0.35,
      probabilidadGolExtraSiPierde: 0.34,
      desgasteExtraPorSobreexigencia: 2,
      condicionExtraDelta: -2
    }
  },

  estadio: {
    clima: {
      lluviaDeterioroActivo: true,
      lluviaLeveExtraDeterioro: 3,
      lluviaIntensaExtraDeterioro: 7
    }
  }
};
