# Características de versión - V3.39

## Ajuste aplicado

### Equilibrio competitivo de bots
- Se agregó un sistema de nivelación para evitar que la segunda temporada se vuelva demasiado fácil.
- Al iniciar una nueva temporada, los bots de la división del manager ajustan:
  - moral media;
  - estado físico;
  - cohesión de equipo.
- La referencia es el club manejado, pero con variación y bonus por posición final anterior.
- La dificultad puede configurarse como `suave`, `normal` o `dificil`.

### Mantenimiento durante temporada
- Cada cierta cantidad de fechas, los bots recuperan parcialmente físico, moral y cohesión si quedaron demasiado por debajo.
- En pretemporada también se aplica mantenimiento para compensar que el club del jugador entrena varias semanas antes del debut.

### Desarrollo de plantel bot
- Al cambio de temporada, los jugadores bots pueden recibir mejoras moderadas de habilidades.
- Los equipos que terminaron mejor posicionados tienen una probabilidad algo mayor de desarrollo.

## Configuración nueva

```js
equilibrioBots: {
  activo: true,
  dificultad: 'normal',
  soloDivisionManager: true,
  nivelarAlInicioTemporada: true,
  mantenerDuranteTemporada: true,
  intervaloMantenimientoFechas: 2,
  bonusMaximoPorPosicion: 8,
  pisoMoral: 55,
  pisoFisico: 76,
  pisoCohesion: 50,
  desarrolloPlantelPorTemporada: 0.18
}
```

## Archivos modificados
- `config.js`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/09-simulation-economy-training.js`
- `index.html`
- `README.md`
- `VERSION.md`
- `CARACTERISTICAS_VERSION.md`
