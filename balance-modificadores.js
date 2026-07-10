/*
  V5.40 · Modificadores de balance del simulador y entrenamiento.
  Archivo activo: se carga antes de config.js y sobrescribe los valores indicados.
  Ajustar estos números permite balancear sin tocar app.js ni los módulos del juego.
*/
window.GAME_BALANCE_MODIFICADORES = {
  metadataBalance: {
    version: 'V5.40',
    nombre: 'Balance centralizado de modificadores',
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
    valorInicial: 50,
    gananciaPorPartido: 7,
    perdidaPorCambioTactico: 8,
    perdidaPorCambioJugador: 1,
    probabilidadEntrenamientoTacticoPorCasilla: 0.35,
    gananciaEntrenamientoTacticoPorCasilla: 1
  },

  lesiones: {
    // Se mantiene así: un lesionado usado como suplente rinde casi nada.
    penalizacionLesionadoSuplente: 0.10
  },

  simulador: {
    pesoColectivo: 0.70,
    pesoIndividual: 0.30,
    probabilidadPelotaParada: 0.14,
    escalaRiesgoErrorJugador: 0.72,
    probabilidadGolAtribuyeErrorGol: 0.60,
    maximoErroresPorEquipo: 5,
    fatigaVivaMultiplicador: 2,
    multiplicadorTarjetas: 0.50,
    rojasDerrotaDefault: 5,
    recuperacionAutomaticaPostPartidoMin: 4,
    recuperacionAutomaticaPostPartidoMax: 6,
    desgastePartidoMin: 25,
    desgastePartidoMax: 46,
    factorDesgasteArquero: 0.5
  },

  equilibrioBots: {
    // Los bots no entrenan. Este bloque sólo ajusta su simulación rápida de partido.
    tacticaRapida: {
      sobreexigenciaSiPierde: true,
      xgExtraSiPierde: 0.35,
      probabilidadGolExtraSiPierde: 0.34,
      maxGolesExtraPorEquipo: 1,
      desgasteExtraPorSobreexigencia: 2,
      condicionExtraDelta: -2
    }
  },

  estadio: {
    clima: {
      lluviaDeterioroActivo: true,
      lluviaLeveExtraDeterioro: 2,
      lluviaIntensaExtraDeterioro: 4
    }
  }
};
