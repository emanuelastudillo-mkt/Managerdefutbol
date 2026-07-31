# V9.27 · Minijuego Ser jugador

Esta versión integra el minijuego «Ser jugador» dentro del menú lateral de Una Vida de Mánager.

## Archivos principales

- `js/game/19-player-career-minigame-v927.js`: estado, simulación, decisiones, contratos, transferencias, historial y retiro.
- `styles/370-player-career-minigame-v927.css`: interfaz responsive del minijuego.
- `index.html`: navegación lateral, estilos, scripts y versión visible.
- `js/ui/06-render-home-messages.js`: registro de la nueva vista en el sistema de renderizado.
- `config.js`: versión V9.27.

El estado del minijuego se guarda en `game.miniGames.playerCareer` y no altera el mundo de la carrera principal.
